export const ECO_PHASES=['amanecer','dia','atardecer','noche'];
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
 let frame=null,lastSave=0;
 function cycle(dt){const s=runtime.S;s.livingSeconds=Number.isFinite(s.livingSeconds)?Math.min(1e9,Math.max(0,s.livingSeconds)+dt):dt;
  const region=runtime.regionOfPos(s.wx,s.wy);frame=ecologyFrame(region,s.livingSeconds,runtime.seedOf,runtime.weather?.i||0,runtime.MU.season?.id);
  const near=runtime.livingNear(500);
  for(const o of near){o.ecology=frame;o.awake=o.activeAt===frame.phase||o.energy>.3||runtime.labLiving?1:.45;
   o.growth=o.group==='flora'?.75+frame.humidity*.3+Math.sin(s.livingSeconds/120+o.variant)*.07:1;
   o.relation=null;for(const peer of near){if(peer===o)continue;const relation=ecologyRelation(o,peer,frame);if(relation){o.relation={type:relation,peer:peer.id};o.energy=Math.max(o.energy,.26);peer.energy=Math.max(peer.energy,.26);runtime.livingRelationFound?.(o,peer,relation,frame);break;}}
  }
  if(s.livingSeconds-lastSave>15){lastSave=s.livingSeconds;runtime.save();}
 }
 Object.defineProperties(runtime,{livingEcologyTick:{get:()=>cycle},livingEnvironment:{get:()=>frame}});
}
