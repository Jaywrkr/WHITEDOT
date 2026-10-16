// Ephemeral visual responses. No world RNG, audio, save or object mutation.
export const REACTIONS=Object.freeze(['contorno','flor','niebla','constelacion','elastica','color','eco','enjambre','tejido','metamorfosis']);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const sample=(seed,key)=>(seed('visual:ecology:v1:'+key)>>>0)/4294967296;
export function ecologyProfile(region,seed){
 const h=sample(seed,region.key+':regime'),regime=h<.32?'quieto':h<.82?'reactivo':'festivo';
 return Object.freeze({regime,activity:sample(seed,region.key+':activity'),sensitivity:.25+sample(seed,region.key+':sensitivity')*.75,contagion:sample(seed,region.key+':contagion'),limit:regime==='quieto'?3:regime==='reactivo'?7:11,interval:regime==='quieto'?55:regime==='reactivo'?32:18});
}
export function reactionOf(object,region,seed){return REACTIONS[Math.floor(sample(seed,region.key+':'+object.id+':gesture')*REACTIONS.length)];}
export function createReactiveEcology(seed){
 let time=0,last=null,anchor=null,regionKey=null,profile=null,nextIdle=0,serial=0,colorUntil=0,color=null,trail=[],effects=[],visits=[];const contacts=new Map();
 function burst(o,type,gesture,ink,passive=false,speed=0){
  if(!profile||effects.length>=profile.limit)return false;
  effects.push({id:++serial,source:o.id,type,gesture,x:o.x,y:o.y,size:clamp(o.size||12,5,28),ink,speed,age:0,duration:passive?2.8:4.4,power:passive?.35:1,phase:sample(seed,o.id+':phase')*Math.PI*2});
  if(type==='color'){color=ink;colorUntil=time+9;}
  if(type==='constelacion'||type==='tejido'){visits=visits.filter(p=>p.id!==o.id);visits.push({id:o.id,x:o.x,y:o.y,ink,until:time+12});visits=visits.slice(-5);}
  return true;
 }
 function tick(dt,point,objects,region,ink,{paused=false,reduced=false,tap=null}={}){
  if(paused){last=null;return;}
  dt=clamp(Number.isFinite(dt)?dt:0,0,.1);time+=dt;
  if(regionKey!==region.key){regionKey=region.key;profile=ecologyProfile(region,seed);nextIdle=time+profile.interval;}
  const distance=last?Math.hypot(point.x-last.x,point.y-last.y):0,teleport=anchor?Math.hypot(point.x-anchor.x,point.y-anchor.y)>180:false,speed=dt>0&&!teleport?distance/dt:0;
  if(teleport){effects=[];visits=[];trail=[];contacts.clear();colorUntil=0;}
  if(!last||teleport||distance>8){trail.push({x:point.x,y:point.y,until:time+2.4});trail=trail.slice(-16);}
  last={...point};anchor=last;trail=trail.filter(p=>p.until>time);effects=effects.filter(e=>(e.age+=dt)<e.duration);visits=visits.filter(p=>p.until>time);
  const sorted=objects.filter(o=>o&&Number.isFinite(o.x)&&Number.isFinite(o.y)&&o.id!=null).sort((a,b)=>Math.hypot(a.x-point.x,a.y-point.y)-Math.hypot(b.x-point.x,b.y-point.y)).slice(0,48);
  const relayed=new Set();let tapped=null;if(tap)for(const o of sorted){const d=Math.hypot(o.x-tap.x,o.y-tap.y);if(d<Math.max(24,(o.size||12)+14)&&(!tapped||d<tapped.d))tapped={o,d};}
  for(const o of sorted){
   const d=Math.hypot(o.x-point.x,o.y-point.y),radius=28+(o.size||12)+profile.sensitivity*20,inside=d<radius,angle=Math.atan2(point.y-o.y,point.x-o.x);
   let state=contacts.get(o.id);if(!state){state={inside:false,angle,orbit:0,dwell:0,last:relayed.has(o.id)?time:-100,seen:time};contacts.set(o.id,state);}
   state.seen=time;state.orbit=inside?state.orbit+Math.abs(Math.atan2(Math.sin(angle-state.angle),Math.cos(angle-state.angle))):0;state.angle=angle;state.dwell=inside&&speed<24?state.dwell+dt:0;
   const gesture=tapped?.o===o?'tocar':inside&&!state.inside?'entrar':state.orbit>Math.PI*1.3?'rodear':state.dwell>2.4?'esperar':null;state.inside=inside;
   if(!gesture||time-state.last<3.4)continue;
   const type=reactionOf(o,region,seed);if(!burst(o,type,gesture,colorUntil>time&&type==='flor'?color:ink,false,speed))continue;
   state.last=time;state.dwell=0;state.orbit=0;
   // Contagion uses nearby real organisms; it never creates population or saves.
   if(!reduced&&profile.contagion>.57&&['flor','color','enjambre'].includes(type)){
    const neighbor=sorted.find(n=>n.id!==o.id&&Math.hypot(n.x-o.x,n.y-o.y)<95&&time-(contacts.get(n.id)?.last??-100)>4);
    if(neighbor&&burst(neighbor,type==='color'?'flor':'enjambre','contagio',ink,true)){const st=contacts.get(neighbor.id);if(st)st.last=time;relayed.add(neighbor.id);}
   }
  }
  if(time>=nextIdle){nextIdle=time+profile.interval*(1.5-profile.activity*.6);if(profile.activity>.32&&sorted.length&&effects.length<Math.max(1,profile.limit-2)){const o=sorted[Math.floor(sample(seed,region.key+':idle:'+Math.floor(time/profile.interval))*sorted.length)];burst(o,reactionOf(o,region,seed),'ambiente',ink,true);}}
  for(const [id,s]of contacts)if(time-s.seen>4)contacts.delete(id);
  while(contacts.size>72)contacts.delete(contacts.keys().next().value);
 }
 function snapshot(){return {profile,effects,visits,trail,color:colorUntil>time?color:null,time,contacts:contacts.size};}
 function pose(id,reduced=false){if(reduced)return null;const e=effects.findLast(e=>e.source===id);if(!e)return null;const life=Math.sin(Math.PI*clamp(e.age/e.duration))*e.power;if(!['elastica','metamorfosis','flor'].includes(e.type))return null;
  const twist=e.gesture==='rodear',fast=e.speed>70;return {x:0,y:e.type==='flor'?-4*life:0,sx:1+life*(twist?.18:fast?.3:-.15),sy:1+life*(fast?-.15:.25),rotation:twist?life*.3:0};}
 return {tick,snapshot,pose};
}
