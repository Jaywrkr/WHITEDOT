// Deliberately bounded individual motion: organisms remain attached to their original habitat.
export function behavior(o,dt,clock,d,player,neighbors=[]){
 const moving=['manta','deer','beetle','jelly','worm','moth','crab','blob','whale'].includes(o.kind);
 if(!moving)return;
 const shy=o.personality==='timida',curious=o.personality==='curiosa',amplitude=o.kind==='whale'?45:o.kind==='beetle'?12:26;
 let tx=o.homeX+Math.sin(clock*(o.kind==='deer'?.32:.18)+o.variant)*amplitude,ty=o.homeY+Math.cos(clock*.14+o.variant)*amplitude*.6;
 if(d<100&&shy){const a=Math.atan2(o.homeY-player.y,o.homeX-player.x);tx+=Math.cos(a)*18;ty+=Math.sin(a)*18;}
 else if(d<150&&curious){tx+=(player.x-tx)*.12;ty+=(player.y-ty)*.12;}
 if(o.kind==='blob'&&o.personality==='social'){
  const peer=neighbors.find(p=>p!==o&&p.kind==='blob'&&Math.hypot(p.homeX-o.homeX,p.homeY-o.homeY)<160);if(peer){tx+=(peer.x-tx)*.22;ty+=(peer.y-ty)*.22;}
 }
 if(o.ecology?.migration){tx+=Math.sin(clock/80+o.variant)*18;ty+=Math.cos(clock/80+o.variant)*18;}
 const pace=(o.kind==='turtle'?.25:o.kind==='deer'?1.3:.7)*(o.awake||1);o.x+=(tx-o.x)*Math.min(1,dt*pace);o.y+=(ty-o.y)*Math.min(1,dt*pace);
 // Excited motion never pushes the creature beyond a small radius of its address.
 const dx=o.x-o.homeX,dy=o.y-o.homeY,r=Math.hypot(dx,dy);if(r>75){o.x=o.homeX+dx/r*75;o.y=o.homeY+dy/r*75;}
 o.expression=player.speed<12?'legato':player.speed>100?'staccato':o.variant%2?'glide':'tremolo';
}
export function initialize(runtime){
 function tick(o,dt,clock,d){behavior(o,dt,clock,d,{x:runtime.S.wx,y:runtime.S.wy,speed:runtime.body?.speed||0},runtime.livingNear(350));}
 function hear(kind,index,region,source,origin){if(origin!=='player'||kind.startsWith('living:'))return;
  for(const o of runtime.livingNear(240)){if(!['moth','cactus','worm'].includes(o.kind))continue;o.phrase.push(((index%7)+7)%7);if(o.phrase.length>6)o.phrase.shift();o.energy=Math.min(1,o.energy+.1);}
 }
 Object.defineProperties(runtime,{livingBehavior:{get:()=>tick},livingHear:{get:()=>hear}});
}
