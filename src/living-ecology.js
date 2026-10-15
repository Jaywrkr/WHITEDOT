export const ECO_PHASES=['amanecer','dia','atardecer','noche'];
import {habitatAt,spatialNeighbors} from './habitats.js';
import {mindProfile,updateMind} from './living-mind.js';
export function ecologyFrame(region,seconds,seedOf,storm=0,season='primavera'){
 const h=seedOf('living:climate:v1:'+region.key),phase=Math.floor(Math.max(0,seconds)/150+h%4)%4;
 const tide=(1+Math.sin(seconds/100+h))/2,humidity=Math.min(1,.25+(h%50)/100+storm*.4);
 return {phase,name:ECO_PHASES[phase],tide,humidity,season,wind:Math.sin(seconds/90+h),migration:phase===0||phase===2,
  convergence:storm>.4&&phase===2,phraseCycle:Math.floor(seconds/40)};
}
export function ecologyRelation(a,b,frame){
 const distance=Math.hypot(a.x-b.x,a.y-b.y);if(distance>120)return null;
 if(['moth','beetle','manta'].includes(a.kind)&&['pressure-flower','pulse-fruit','seed'].includes(b.kind))return 'polinizacion';
 if((a.kind==='fungal-net'&&b.group==='flora')||(a.kind==='deer'&&b.kind==='breath-tree'))return 'simbiosis';
 if(a.kind==='blob'&&b.kind==='blob'&&frame.migration)return 'colonia';return null;
}
export function initialize(runtime){
 let frame=null,lastSave=0,updateAt=-1,owner=null,lastClock=0;const native=new WeakMap();
 function cycle(dt){const s=runtime.S;if(owner!==s||(s.livingSeconds||0)<lastClock){owner=s;lastSave=s.livingSeconds||0;updateAt=-1;}s.livingSeconds=Number.isFinite(s.livingSeconds)?Math.min(1e9,Math.max(0,s.livingSeconds)+dt):dt;lastClock=s.livingSeconds;
  const region=runtime.regionOfPos(s.wx,s.wy);frame=ecologyFrame(region,s.livingSeconds,runtime.seedOf,runtime.weather?.i||0,runtime.MU.season?.id);
  if(runtime.weather?.i>.15)runtime.recordRewardSource?.('weather','lluvia');if(runtime.weather?.i>.4)runtime.recordRewardSource?.('weather','tormenta');if(frame.convergence)runtime.recordRewardSource?.('weather','convergencia');
  if(s.livingSeconds<updateAt)return;updateAt=s.livingSeconds+.25;
  const near=runtime.livingNear(500);
  const neighbors=spatialNeighbors(near);
  for(const o of near){o.ecology=frame;o.awake=(o.mind?.activity??o.activeAt)===frame.phase||o.energy>.3||runtime.labLiving?1:.45;
   o.growth=o.group==='flora'?.75+frame.humidity*.3+Math.sin(s.livingSeconds/120+o.variant)*.07:1;
   o.relation=null;for(const peer of neighbors(o)){const relation=ecologyRelation(o,peer,frame);if(relation){o.relation={type:relation,peer:peer.id};o.energy=Math.max(o.energy,.26);peer.energy=Math.max(peer.energy,.26);runtime.livingRelationFound?.(o,peer,relation,frame);break;}}
  }
  if(s.livingSeconds-lastSave>15){lastSave=s.livingSeconds;runtime.save();}
 }
 function nativeState(o,sp){let state=native.get(o);if(!state){const x=o.hx??o.x,y=o.hy??o.y,d=runtime.regionOfPos(x,y),group=sp.mob?'fauna':'flora';state={id:`native:${sp.id}:${x},${y}`,kind:sp.id,group,x:o.x,y:o.y,homeX:x,homeY:y,variant:runtime.seedOf(sp.id)%256,size:12,activeAt:runtime.seedOf(sp.id)%4,energy:0,awake:1,habitat:habitatAt(d,x,y,runtime.seedOf),worldFamily:d.worldFamily};state.mind=mindProfile(state,runtime.seedOf,runtime.rng);native.set(o,state);}return state;}
 function nativeTick(o,sp,dt,clock,peers){
  const a=nativeState(o,sp);a.x=o.x;a.y=o.y;a.homeX=o.hx;a.homeY=o.hy;a.energy=o.lit||0;a.ecology=frame;a.awake=frame&&frame.phase!==a.activeAt?.45:1;
  const player={x:runtime.S.wx,y:runtime.S.wy,speed:runtime.body?.speed||0},neighbors=peers.filter(p=>p!==o&&Math.hypot(p.x-o.x,p.y-o.y)<140).slice(0,12).map(p=>({x:p.x,y:p.y,kind:p.s.id,group:p.s.mob?'fauna':'flora'}));
  updateMind(a,dt,runtime.S.livingSeconds||clock,Math.hypot(a.x-player.x,a.y-player.y),player,neighbors);
  o.nativeIntent=a.intent;o.nativeOpenness=a.openness;
  if(sp.mob&&!(o.follow>0)){o.x=a.x;o.y=a.y;}
 }
 function plantScale(o){const d=runtime.regionOfPos(o.x,o.y),h=habitatAt(d,o.x,o.y,runtime.seedOf),seconds=runtime.S.livingSeconds||0;return Math.max(.78,Math.min(1.12,.82+h.humidity*.25+Math.sin(seconds/35+h.phase)*.035));}
 Object.defineProperties(runtime,{livingEcologyTick:{get:()=>cycle},livingEnvironment:{get:()=>frame},nativeLifeTick:{get:()=>nativeTick},nativePlantScale:{get:()=>plantScale}});
}
