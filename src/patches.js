const MATERIALS={wood:{name:'Madera cálida',tone:.7,tail:.75,attack:1.1,harmonics:.6},glass:{name:'Cristal suave',tone:1.05,tail:1.1,attack:.85,harmonics:.85},metal:{name:'Metal filtrado',tone:.9,tail:.85,attack:.75,harmonics:.8},air:{name:'Aire sedoso',tone:.65,tail:1.2,attack:1.6,harmonics:.5}};
export function patchIdentity(kind,source){
 const p=source?.personality;
 return `${kind}:${source?.id||(p?`${p.period}:${p.spin}:${p.degree}`:source?.s?.id||'regional')}`;
}
export function createInstrumentPatch(region,instrument,role,identity,seedOf,rng){
 const r=rng(seedOf(`instrument-patch:v1:${region.key}:${region.genre}:${instrument}:${role}:${identity}`));
 const robotic=['robotic','electro','ebm','acid','idm','algorave'].includes(region.genre),organic=['tropical','andean','organic','afro','tribal'].includes(region.genre);
 const pool=role==='bajo'?['wood','metal']:robotic?['metal','metal','glass','air']:organic?['wood','wood','air','glass']:['wood','glass','air'];
 const native=pool[Math.floor(r()*pool.length)],preferred=region.recipe?.material,material=preferred&&pool.includes(preferred)&&r()<.35?preferred:native,m=MATERIALS[material],bass=role==='bajo',toneScale=m.tone*(.85+r()*.3);
 return Object.freeze({material,name:m.name,toneScale,cutoff:(bass?900:4200)*toneScale,resonance:.65+r()*.25,
  attackScale:m.attack*(.9+r()*.2),decayScale:m.tail*(.9+r()*.15),legacyDecay:.72+r()*.25,
  harmonics:m.harmonics*(.85+r()*.15),fmIndex:.65+r()*.35,widthCents:bass?0:2+r()*5,
  sendScale:.6+r()*.3,level:.88+r()*.1});
}
export function initialize(runtime){
 const cache=new Map(),active=[];let current=null;
 function getInstrumentPatch(kind,region,voice,source){
  const identity=patchIdentity(kind,source),key=`${region.key}:${region.genre}:${voice.instrument}:${voice.role}:${identity}`;
  if(!cache.has(key)){cache.set(key,createInstrumentPatch(region,voice.instrument,voice.role,identity,runtime.seedOf,runtime.rng));while(cache.size>256)cache.delete(cache.keys().next().value);}
  return cache.get(key);
 }
 function patchTick(){if(!runtime.ac)return;for(let i=active.length-1;i>=0;i--)if(active[i].end<=runtime.ac.currentTime){active[i].nodes.forEach(n=>n.disconnect());active.splice(i,1);}}
 function withInstrumentPatch(kind,region,voice,source,time,emit){
  if(!region||!runtime.inWorld())return emit();
  const patch=getInstrumentPatch(kind,region,voice,source),previous=current;current=patch;
  patchTick();const ac=runtime.ac;
  if(!runtime.S.sound||ac?.state!=='running'||!runtime.bus||!runtime.verbIn||!runtime.dsend||active.length>=32){try{return emit();}finally{current=previous;}}
  const original=[runtime.bus,runtime.verbIn,runtime.dsend],f=ac.createBiquadFilter(),verb=ac.createGain(),delay=ac.createGain();
  f.type='lowpass';f.frequency.value=patch.cutoff;f.Q.value=patch.resonance;f.connect(original[0]);
  verb.gain.value=patch.sendScale;verb.connect(original[1]);delay.gain.value=patch.sendScale;delay.connect(original[2]);
  active.push({nodes:[f,verb,delay],end:time+2});[runtime.bus,runtime.verbIn,runtime.dsend]=[f,verb,delay];
  try{return emit();}finally{[runtime.bus,runtime.verbIn,runtime.dsend]=original;current=previous;}
 }
 Object.defineProperties(runtime,{getInstrumentPatch:{get:()=>getInstrumentPatch},withInstrumentPatch:{get:()=>withInstrumentPatch},activeInstrumentPatch:{get:()=>current},patchTick:{get:()=>patchTick},activePatchCount:{get:()=>active.length},instrumentPatchCacheSize:{get:()=>cache.size}});
}
