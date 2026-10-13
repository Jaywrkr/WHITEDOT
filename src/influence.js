import {RHYTHM_GENRES} from './rhythms.js';
import {REFERENCE_BASS} from './references.js';
export const CHANNELS=['bass','groove','melody','space'];
export const CHANNEL_NAMES={bass:'Bajo',groove:'Groove',melody:'Motivo',space:'Espacio'};
const clamp=n=>Math.max(-1,Math.min(1,n));
export function influenceProfile(region,kind,source,seedOf,rng){
 const id=source?.id||`${source?.hx??source?.x??0},${source?.hy??source?.y??0}`;
 const r=rng(seedOf(`influence:v1:${region.key}:${kind}:${id}`));
 const preferred={organic:['bass','groove','space'],mechanical:['bass','groove','melody'],melodic:['melody','space','bass'],rhythmic:['groove','bass','melody'],quiet:['space','melody']};
 const pool=preferred[region.recipe?.archetype]||CHANNELS;
 return {channel:pool[Math.floor(r()*pool.length)],variant:Math.floor(r()*8),speed:.7+r()*.8};
}
export function createInfluenceState(){
 const state={values:Object.fromEntries(CHANNELS.map(k=>[k,0])),targets:Object.fromEntries(CHANNELS.map(k=>[k,0])),variant:0};
 return {state,
  touch(channel,amount=.22,variant=0){if(!CHANNELS.includes(channel)||!Number.isFinite(amount))return;state.targets[channel]=clamp(state.targets[channel]+amount);state.variant=variant%8;},
  drive(channel,level,variant=0){if(!CHANNELS.includes(channel)||!Number.isFinite(level))return;state.targets[channel]=clamp(level);state.variant=variant%8;},
  tick(dt,active=true){if(!active)return;dt=Math.max(0,Math.min(.25,dt));for(const channel of CHANNELS){state.values[channel]+=(state.targets[channel]-state.values[channel])*(1-Math.exp(-dt/1.8));state.targets[channel]*=Math.exp(-dt/24);}},
 };
}
const BASS_CELLS=[[0,6,10,14],[0,3,6,10,14],[0,2,7,10,14],[0,5,8,13],[0,6,8,14],[0,3,8,11,14],[0,2,6,10,12],[0,7,10,14]];
// Transform existing parts instead of continually stacking a new melody on top.
export function shapeInfluencedTrack(region,arrangement,state,genres){
 if(!arrangement||!state)return arrangement;
 const v=state.values,g=genres[region.genre],variant=Math.abs(state.variant)%8;
 if(CHANNELS.every(k=>Math.abs(v[k])<.04))return arrangement;
 const out={...arrangement,bass:[...arrangement.bass],hook:[...arrangement.hook],grammar:{...arrangement.grammar}};
 if(v.bass>.15&&region.genre!=='ambient'){
  const native=RHYTHM_GENRES[region.genre]?.bass;
  const positions=native?native.map((n,i)=>n>=0?i:-1).filter(i=>i>=0):REFERENCE_BASS[region.genre]||BASS_CELLS[variant];
  out.bass=Array(16).fill(-1);
  positions.slice(0,v.bass>.6?8:5).forEach((step,i)=>out.bass[step]=native?native[step]:[0,0,4,2][(i+variant)%4]);out.bass[0]=0;
  const pool=g.bassP||[g.bassI];out.bassI=pool[variant%pool.length];
 }else if(v.bass<-.15)out.bass=out.bass.map((n,i)=>i%8===0?n:-1);
 if(v.melody>.15){
  const tones=g.melodyDegrees||[0,2,4];out.hook=out.hook.map((n,i)=>n<0?n:i%4===0?0:tones[(i+variant)%tones.length]);
  out.hookI=g.hookP[variant%g.hookP.length];
 }
 if(v.space>.15||v.melody<-.15){let count=0;out.hook=out.hook.map(n=>n>=0&&++count>(v.space>.6?2:3)?-1:n);}
 out.grammar.hookLevel=(out.grammar.hookLevel||1)*(1-.22*Math.max(0,v.bass)-.3*Math.max(0,v.space));
 out.grammar.bassLevel=(out.grammar.bassLevel||1)*(1+.08*Math.max(0,v.bass)-.15*Math.max(0,v.space));
 return out;
}
export function initialize(runtime){
 const states=new Map(),recent=new Map();let current=null,previous=runtime.S;
 function regionState(region){
  if(!states.has(region.key)){states.set(region.key,createInfluenceState());while(states.size>32)states.delete(states.keys().next().value);}return states.get(region.key);
 }
 function input(kind,region,source,origin){
  if(origin!=='player'||!runtime.inWorld()||!region)return;
  const profile=influenceProfile(region,kind,source,runtime.seedOf,runtime.rng),key=`${region.key}:${profile.channel}`,now=performance.now();
  if(now-(recent.get(key)??-Infinity)<400)return;recent.set(key,now);while(recent.size>128)recent.delete(recent.keys().next().value);
  regionState(region).touch(profile.channel,.22,profile.variant);
 }
 function tick(dt,paused){
  if(previous!==runtime.S){states.clear();recent.clear();previous=runtime.S;}
  const region=runtime.inWorld()?(runtime.activeLayerRegion?.()||runtime.regionOfPos(runtime.S.wx,runtime.S.wy)):null;current=runtime.inWorld()&&region?regionState(region):null;
  for(const state of states.values())state.tick(dt,!paused&&!document.hidden&&runtime.S.sound&&runtime.ac?.state==='running');
 }
 function drive(region,channel,level,variant){if(runtime.inWorld()&&region)regionState(region).drive(channel,level,variant);}
 function track(region,arrangement){return region?shapeInfluencedTrack(region,arrangement,states.get(region.key)?.state,runtime.GEN):arrangement;}
 Object.defineProperties(runtime,{influenceInput:{get:()=>input},influenceTick:{get:()=>tick},driveInfluence:{get:()=>drive},shapeInfluence:{get:()=>track},influenceState:{get:()=>current?.state||null}});
}
