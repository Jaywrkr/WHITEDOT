// The environment keeps a soloist for eight bars; change phrases, not random hits.
const key=o=>o.id||`${o.kind||o.k||o.s?.id||'voice'}:${o.hx??o.x},${o.hy??o.y}`;
export function ambientSoloist(region,bar,step,sources,seedOf,{x=0,y=0,rest=false,quiet=false}={}){
 if(!region||quiet||rest||bar%4===3||step!==[6,10,6,14][bar%4])return null;
 const eligible=sources.filter(o=>typeof o.snd==='function'&&Number.isFinite(o.x+o.y)&&Math.hypot(o.x-x,o.y-y)<280);
 const chapter=Math.floor(bar/8),rank=o=>seedOf(`ambient:phrase:v1:${region.key}:${chapter}:${key(o)}`)>>>0;
 return eligible.sort((a,b)=>rank(a)-rank(b)||key(a).localeCompare(key(b)))[0]||null;
}
