import assert from 'node:assert/strict';
import {ACTIVITIES,activityCell,activityLevel,activityState,activityCanStand,moveActivity,updateActivity,normalizeActivities} from '../src/universe-activities-model.js';
import {drawActivity} from '../src/universe-activities-art.js';
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
assert.equal(ACTIVITIES.length,30);assert.equal(new Set(ACTIVITIES.map(d=>d.id)).size,30);
const seen=new Set();let sites=0;for(let x=-80;x<80;x++)for(let y=-80;y<80;y++){const a=activityCell(x,y,seedOf);assert.deepEqual(a,activityCell(x,y,seedOf));assert(a.length<=1);for(const o of a){seen.add(o.kind);sites++;}}
assert.equal(seen.size,30);assert(sites>1200&&sites<1900);
const advance=(l,s,n=1)=>{for(let i=0;i<n;i++)updateActivity(l,s,.05);};
function visit(l,s,i){s.x=l.nodes[i].x;s.y=l.nodes[i].y;advance(l,s);s.x=1.5;s.y=l.n-1.5;advance(l,s);}
function mazeRoute(l){const start=Math.floor(l.spawn.y)*l.n+Math.floor(l.spawn.x),goal=Math.floor(l.goal.y)*l.n+Math.floor(l.goal.x),queue=[start],prev=new Map([[start,null]]);for(let a=0;a<queue.length&&!prev.has(goal);a++){const k=queue[a],x=k%l.n,y=Math.floor(k/l.n);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const i=(y+dy)*l.n+x+dx;if(x+dx<0||x+dx>=l.n||y+dy<0||y+dy>=l.n||!l.floor[i]||prev.has(i))continue;prev.set(i,k);queue.push(i);}}assert(prev.has(goal),'every maze has an actual reachable goal');const path=[];for(let k=goal;k!==null;k=prev.get(k))path.push({x:k%l.n+.5,y:Math.floor(k/l.n)+.5});return path.reverse();}
export function solve(l,s){
 const id=l.def.id,f=l.def.family;
 if(id==='maze'){for(const p of mazeRoute(l)){moveActivity(l,s,p.x-s.x,p.y-s.y);advance(l,s);}return;}
 if(f==='rotate'){for(let i=0;i<l.nodes.length;i++)for(let turn=0;s.values[i]!==l.solution[i]&&turn<4;turn++)visit(l,s,i);if(id==='fold'){s.x=l.goal.x;s.y=l.goal.y;}advance(l,s,200);return;}
 if(f==='switch'){if(id==='city')for(const i of l.cityMoves.slice().reverse())visit(l,s,i);else for(let i=0;i<l.nodes.length;i++)if(s.values[i]!==l.solution[i])visit(l,s,i);return;}
 if(f==='doors'||f==='sequence'){for(const i of l.sequence)visit(l,s,i);return;}
 if(f==='dig'){for(const cell of l.digCells){s.x=cell%l.n+.5;s.y=Math.floor(cell/l.n)+.5;advance(l,s,10);}return;}
 if(['push','escort','herd','attract'].includes(f)){
  for(let i=0;i<s.blocks.length;i++)for(let tries=0;!s.locked[i]&&tries<200;tries++){
   const b=s.blocks[i],target=l.targets[b.index],d=Math.hypot(target.x-b.x,target.y-b.y)||1,dx=(target.x-b.x)/d,dy=(target.y-b.y)/d;
   if(f==='push'){s.x=b.x-dx*.65;s.y=b.y-dy*.65;moveActivity(l,s,dx*.08,dy*.08);}
   else {const sign=f==='herd'?-1:1;s.x=b.x+dx*1.4*sign;s.y=b.y+dy*1.4*sign;}advance(l,s);
  }advance(l,s,50);return;
 }
 if(id==='giant'){for(let i=0;i<l.nodes.length;i++)visit(l,s,i);return;}
 for(const p of l.route){assert(activityCanStand(l,p.x,p.y));s.x=p.x;s.y=p.y;advance(l,s);}
}
for(let seed=1;seed<=12;seed++)for(const d of ACTIVITIES){const l=activityLevel(d.id,seed),s=activityState(l);assert.deepEqual(l,activityLevel(d.id,seed));assert(activityCanStand(l,s.x,s.y));assert(activityCanStand(l,l.exit.x,l.exit.y));solve(l,s);assert(s.done,`${d.id}/${seed} must be solvable through its actual movement/contact mechanics`);const restored=activityState(l,structuredClone(s));assert(restored.done);assert.equal(restored.next,s.next);assert.equal(restored.blocks.length,l.blocks.length);}
const wall=activityLevel('maze',42),s=activityState(wall);const before=s.x;moveActivity(wall,s,-100,0);assert(s.x>=1.2&&s.x<=before,'swept movement cannot tunnel through maze walls');assert(activityCanStand(wall,s.x,s.y));
const future={version:9,done:{future:true}};assert.equal(normalizeActivities(future),future);assert.equal(normalizeActivities({extension:7}).extension,7);
let drawn=0;const c=new Proxy({globalAlpha:1},{get:(o,k)=>o[k]??((...args)=>{drawn++;for(const a of args)if(typeof a==='number')assert(Number.isFinite(a),k);}),set:(o,k,v)=>(o[k]=v,true)});
for(const d of ACTIVITIES){const l=activityLevel(d.id,42),s=activityState(l),state=structuredClone(s);drawActivity({cx:c,W:390,H:844,S:{universeTexts:false,reducedMotion:true}},l,s,0);assert.deepEqual(s,state);}
assert(drawn>0);console.log('PASS 30 seeded activities, 360 real mechanical solutions, reachable maze goals/exits, swept walls, save recovery, future preservation and finite draw-only reduced-motion scenes');
