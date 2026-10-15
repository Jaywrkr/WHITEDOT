import {SYNTH_PROGRAMS,synthProgram,filterMovement,opticalFilter} from './synth-colors.js';
import {voiceLifetime} from './modular-synth.js';
import {routeThreadGraph} from './modular-routing.js';
const MATERIALS={wood:{name:'Madera cálida',tone:.7,tail:.75,attack:1.1,harmonics:.6},glass:{name:'Cristal suave',tone:1.05,tail:1.1,attack:.85,harmonics:.85},metal:{name:'Metal filtrado',tone:.9,tail:.85,attack:.75,harmonics:.8},air:{name:'Aire sedoso',tone:.65,tail:1.2,attack:1.6,harmonics:.5}};
export function patchIdentity(kind,source){
 const p=source?.personality;
 return `${kind}:${source?.id||(p?`${p.period}:${p.spin}:${p.degree}`:source?.s?.id||'regional')}`;
}
export function createInstrumentPatch(region,instrument,role,identity,seedOf,rng,programId=null){
 const r=rng(seedOf(`instrument-patch:v1:${region.key}:${region.genre}:${instrument}:${role}:${identity}`));
 const robotic=['robotic','electro','ebm','acid','idm','algorave'].includes(region.genre),organic=['tropical','andean','organic','afro','tribal'].includes(region.genre);
 const pool=role==='bajo'?['wood','metal']:robotic?['metal','metal','glass','air']:organic?['wood','wood','air','glass']:['wood','glass','air'];
 const native=pool[Math.floor(r()*pool.length)],preferred=region.recipe?.material,material=preferred&&pool.includes(preferred)&&r()<.35?preferred:native,m=MATERIALS[material],bass=role==='bajo',toneScale=m.tone*(.85+r()*.3);
 const requested=SYNTH_PROGRAMS.find(p=>p.id===programId&&(!bass||p.type==='lowpass'&&p.stages<=2));
 return Object.freeze({material,name:m.name,program:requested||synthProgram(region,role,identity+':'+instrument,seedOf),toneScale,cutoff:(bass?900:4200)*toneScale,resonance:.65+r()*.25,
  attackScale:m.attack*(.9+r()*.2),decayScale:m.tail*(.9+r()*.15),legacyDecay:.72+r()*.25,
  harmonics:m.harmonics*(.85+r()*.15),fmIndex:.65+r()*.35,widthCents:bass?0:2+r()*5,
  sendScale:.6+r()*.3,level:.88+r()*.1});
}
export function initialize(runtime){
 const cache=new Map(),active=[];let current=null;
 function getInstrumentPatch(kind,region,voice,source){
  const identity=patchIdentity(kind,source),programId=source?.id?.startsWith('living:lab:')?source.labFilter:null,key=`${region.key}:${region.genre}:${voice.instrument}:${voice.role}:${identity}:${programId||''}`;
  if(!cache.has(key)){cache.set(key,createInstrumentPatch(region,voice.instrument,voice.role,identity,runtime.seedOf,runtime.rng,programId));while(cache.size>256)cache.delete(cache.keys().next().value);}
  return cache.get(key);
 }
 function patchTick(){if(!runtime.ac)return;for(let i=active.length-1;i>=0;i--)if(active[i].end<=runtime.ac.currentTime){active[i].nodes.forEach(n=>n.disconnect());active.splice(i,1);}}
 function withInstrumentPatch(kind,region,voice,source,time,emit){
  if(!region||!runtime.inWorld())return emit();
  const base=getInstrumentPatch(kind,region,voice,source),graph=runtime.modularForSource?.(kind,region,source),patch=graph?{...base,modular:graph}:base,previous=current;current=patch;
  patchTick();const ac=runtime.ac;
  if(!runtime.S.sound||ac?.state!=='running'||!runtime.bus||!runtime.verbIn||!runtime.dsend||active.length>=32){try{return emit();}finally{current=previous;}}
  const original=[runtime.bus,runtime.verbIn,runtime.dsend],filters=[],verb=ac.createGain(),delay=ac.createGain();
  const movement=opticalFilter(filterMovement(patch.program,patch.cutoff,voice.role,time,runtime.SIX,source?.energy||runtime.body?.speed/180||0,runtime.weather?.i||0),source?.opticalPosition,voice.role);
  for(let i=0;i<movement.stages;i++){const f=ac.createBiquadFilter();f.type=movement.type;f.frequency.value=patch.cutoff;f.Q.value=movement.type==='bandpass'?.85:.55;
   f.frequency.setValueAtTime?.(movement.start,time);f.frequency.exponentialRampToValueAtTime?.(movement.end,time+movement.duration);filters.push(f);if(i)filters[i-1].connect(f);}
  const lifetime=voice.sustained?24.3:voiceLifetime(voice.instrument),modularNodes=[];
  if(graph){modularNodes.push(...routeThreadGraph(ac,filters.at(-1),original[0],graph,time,time+lifetime));runtime.modularGraphCue?.(graph.signature,time);if(source)source.modularSignal={signature:graph.signature,routes:graph.routes.length};}else filters.at(-1).connect(original[0]);
  verb.gain.value=patch.sendScale;verb.connect(original[1]);delay.gain.value=patch.sendScale;delay.connect(original[2]);
  if(source){source.filterMotion={...movement,onset:performance.now()+Math.max(0,time-ac.currentTime)*1000};}
  runtime.filterCue?.(source,voice.role,movement,time);
  active.push({nodes:[...filters,verb,delay,...modularNodes],end:time+lifetime});[runtime.bus,runtime.verbIn,runtime.dsend]=[filters[0],verb,delay];
  try{return emit();}finally{[runtime.bus,runtime.verbIn,runtime.dsend]=original;current=previous;}
 }
 Object.defineProperties(runtime,{getInstrumentPatch:{get:()=>getInstrumentPatch},withInstrumentPatch:{get:()=>withInstrumentPatch},activeInstrumentPatch:{get:()=>current},patchTick:{get:()=>patchTick},activePatchCount:{get:()=>active.length},instrumentPatchCacheSize:{get:()=>cache.size}});
}
