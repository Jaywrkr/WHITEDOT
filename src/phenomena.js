import {WORLD_VISUAL,elementInk,elementAlpha} from './visual.js';
export const PHENOMENON_NAMES={bird:'Ave de eco',shaker:'Semillero de caja',cloud:'Nube de pulso'};
const POOLS={llanura:['bird','shaker'],bosque:['bird','shaker'],lago:['bird','shaker'],ruinas:['shaker','cloud'],jardin:['bird','shaker'],dunas:['bird','shaker'],cristales:['shaker','cloud'],faros:['bird','cloud'],tormenta:['cloud','shaker'],cueva:['shaker','cloud'],vacio:['cloud']};
export function createPhenomena(cx,cy,size,biome,seedOf,rng){
 const r=rng(seedOf(`phenomena:v1:${cx},${cy}`)),pool=POOLS[biome],count=biome==='vacio'?1:1+(r()<.45?1:0);
 return Array.from({length:count},(_,i)=>{
  const ordinary=pool.filter(k=>k!=='bird'),kind=pool.includes('bird')&&r()<.18?'bird':ordinary[Math.floor(r()*ordinary.length)];
  const x=(cx+.15+r()*.7)*size,y=(cy+.15+r()*.7)*size;
  return {id:`phenomena:v1:${cx},${cy}:${i}`,kind,x,y,hx:x,hy:y,phase:r()*6.283,period:1000+r()*1800,offset:Math.floor(r()*8),voiceIndex:Math.floor(r()*8),cues:[],next:0,cd:0};
 });
}
export function cueIntensity(cues,time){return cues.reduce((level,onset)=>time>=onset?Math.max(level,Math.max(0,1-(time-onset)/.65)):level,0);}
export function initialize(runtime){
 const cache=new Map();let autoBar=-1;
 function nearbyPhenomena(radius=360){
  const items=[],size=runtime.WCH,x=runtime.S.wx,y=runtime.S.wy;
  for(let cx=Math.floor((x-radius)/size);cx<=Math.floor((x+radius)/size);cx++)for(let cy=Math.floor((y-radius)/size);cy<=Math.floor((y+radius)/size);cy++){
   const key=`${cx},${cy}`;let list=cache.get(key);
   if(!list){const region=runtime.regionOfPos(cx*size+1,cy*size+1);list=createPhenomena(cx,cy,size,runtime.BIOMES[region.z].id,runtime.seedOf,runtime.rng);cache.set(key,list);while(cache.size>64)cache.delete(cache.keys().next().value);}
   items.push(...list.filter(o=>Math.hypot(o.x-x,o.y-y)<radius));
  }
  return items.sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y));
 }
 function phenomenonVoice(o){const region=runtime.regionOfPos(o.hx,o.hy),g=runtime.GEN[region.genre];return {role:o.kind==='bird'?'lead':o.kind==='shaker'?'perc':'bajo',instrument:o.kind==='bird'?g.hookP[o.voiceIndex%g.hookP.length]:o.kind==='shaker'?'snare':g.bassI};}
 function cue(o,time){if(!o.cues.some(t=>Math.abs(t-time)<.025)){o.cues.push(time);if(o.cues.length>4)o.cues.shift();}}
 const audible=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'&&runtime.S.sound&&runtime.ac?.state==='running';
 function triggerPhenomenon(o,time){
  if(!audible()||time<o.next)return false;
  o.next=time+runtime.SIX*8;
  const region=runtime.regionOfPos(o.hx,o.hy),voice=phenomenonVoice(o),tones=runtime.chordTones();
  function hit(t,index){
   let volume=(o.kind==='bird'?.035:o.kind==='shaker'?.032:.045)*(runtime.curatedVoiceGain?.(t,voice.role)||1);
   const emit=(gain=1)=>{volume*=gain;const sound=()=>{
    if(o.kind==='bird')runtime.hookInst(voice.instrument,Math.min(76,tones[index%3]),t,volume);
    else if(o.kind==='shaker')runtime.snareHit(t,volume);
    else{runtime.bassInst(voice.instrument,runtime.root(),t,volume);runtime.noiseHit(t,'lowpass',700,.7,volume*.4,.3,true);}
   };const patchEmit=()=>{if(runtime.withInstrumentPatch)runtime.withInstrumentPatch(`phenomenon:${o.kind}`,region,voice,o,t,sound);else sound();};if(runtime.withVoiceEffect)runtime.withVoiceEffect(`phenomenon:${o.kind}`,region,voice,t,patchEmit);else patchEmit();};
   if(runtime.withSpatialVoice)runtime.withSpatialVoice(o,t,emit);else emit();
   cue(o,t);runtime.soundCue?.(o,voice.role,t);
  }
  hit(time,o.voiceIndex);if(o.kind==='bird')hit(time+runtime.SIX*2,o.voiceIndex+1);
  return true;
 }
 function phenomenonPercussionCue(time){if(!audible())return;const o=nearbyPhenomena().find(o=>o.kind==='shaker');if(o)cue(o,time);}
 function phenomenaStep(step,bar,time){
  if(!audible()||autoBar===bar||runtime.initiativeLastBar===bar||runtime.currentPocket?.()?.kind==='quiet')return;
  const o=nearbyPhenomena().find(o=>o.kind==='bird'?step===14&&bar%4===o.offset%4:o.kind==='cloud'?step===0&&bar%8===o.offset:step===12&&bar%4===o.offset%4);
  if(o&&triggerPhenomenon(o,time))autoBar=bar;
 }
 function phenomenonSources(){return nearbyPhenomena(250).map(o=>({object:o,kind:`phenomenon:${o.kind}`,name:PHENOMENON_NAMES[o.kind],voice:phenomenonVoice(o),distance:Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)}));}
 function drawPhenomena(t,dt,ox,oy,radius){
  const ctx=runtime.cx,now=performance.now(),audioTime=runtime.ac?.currentTime||0;
  for(const o of nearbyPhenomena(radius)){
   o.cues=o.cues.filter(q=>audioTime-q<.7);
   const pulse=audible()?cueIntensity(o.cues,audioTime):0;
   if(o.kind==='bird'){o.x=o.hx+Math.sin(t/o.period+o.phase)*18;o.y=o.hy+Math.cos(t/(o.period*1.3)+o.phase)*10-pulse*24;}
   const wave=runtime.waves.length&&runtime.hitW(o.x,o.y),distance=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy);
   if(now>o.cd&&(wave||distance<22)){o.cd=now+1700;runtime.touched();runtime.beatSoon(q=>triggerPhenomenon(o,q));}
   ctx.save();ctx.translate(o.x+ox,o.y+oy);ctx.globalAlpha=elementAlpha(distance,radius,pulse);ctx.strokeStyle=elementInk(o.kind==='shaker'?'wood':'air',runtime.regionOfPos(o.hx,o.hy).hue,pulse>0);ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=WORLD_VISUAL.line;
   if(o.kind==='bird'){
    const wing=5+Math.sin(t/(o.period*.1)+o.phase)*3+pulse*5;ctx.beginPath();ctx.moveTo(-10,-wing);ctx.lineTo(0,0);ctx.lineTo(10,-wing);ctx.stroke();ctx.fillRect(-1,-2,2,3);
    if(pulse>0){ctx.globalAlpha*=pulse;ctx.beginPath();ctx.arc(0,0,12+(1-pulse)*20,0,6.283);ctx.stroke();}
   }else if(o.kind==='shaker'){
    for(let i=0;i<3;i++){const dx=Math.sin(t/55+o.phase+i)*pulse*5;ctx.beginPath();ctx.moveTo((i-1)*8,10);ctx.lineTo((i-1)*8+dx,-10-i*3);ctx.stroke();ctx.strokeRect((i-1)*8+dx-3,-15-i*3,6,6);}
   }else{
    ctx.beginPath();ctx.moveTo(-15,0);ctx.quadraticCurveTo(-9,-17,0,-7);ctx.quadraticCurveTo(14,-18,17,0);ctx.stroke();
    if(pulse>0){ctx.globalAlpha*=pulse;ctx.beginPath();ctx.moveTo(0,3);ctx.lineTo(-7,15);ctx.lineTo(4,13);ctx.lineTo(-2,29);ctx.stroke();}
   }
   ctx.restore();
  }
 }
 Object.defineProperties(runtime,{nearbyPhenomena:{get:()=>nearbyPhenomena},phenomenonVoice:{get:()=>phenomenonVoice},triggerPhenomenon:{get:()=>triggerPhenomenon},phenomenonPercussionCue:{get:()=>phenomenonPercussionCue},phenomenaStep:{get:()=>phenomenaStep},phenomenonSources:{get:()=>phenomenonSources},drawPhenomena:{get:()=>drawPhenomena},phenomenonCacheSize:{get:()=>cache.size}});
}
