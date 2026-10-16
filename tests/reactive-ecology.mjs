import assert from 'node:assert/strict';
import {REACTIONS,ecologyProfile,reactionOf,createReactiveEcology} from '../src/reactive-ecology-model.js';
const seed=s=>{let n=2166136261;for(const c of s)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};
const regimes=new Set(),profiles=new Set();for(let i=0;i<1000;i++){const p=ecologyProfile({key:String(i)},seed);assert.deepEqual(p,ecologyProfile({key:String(i)},seed));regimes.add(p.regime);profiles.add(p.activity+':'+p.sensitivity+':'+p.contagion);assert(p.limit<=11&&p.sensitivity>=.25);}
assert.equal(regimes.size,3);assert(profiles.size>950);
const region={key:'native'},objects=Array.from({length:1000},(_,i)=>({id:'real:'+i,x:0,y:0,size:12})),byType=new Map();for(const o of objects)byType.set(reactionOf(o,region,seed),o);assert.equal(byType.size,10);
const original=JSON.stringify(objects);
for(const type of REACTIONS){const o=byType.get(type),m=createReactiveEcology(seed);m.tick(.05,{x:0,y:0},[o],region,'#aaeecc');assert.equal(m.snapshot().effects[0].type,type);assert.equal(m.snapshot().effects[0].source,o.id);const before=m.snapshot().time;m.tick(1,{x:0,y:0},[o],region,'#aaeecc',{paused:true});assert.equal(m.snapshot().time,before);assert.equal(m.pose(o.id,true),null);
 for(let i=0;i<240;i++)m.tick(.05,{x:0,y:0},[],region,'#aaeecc');assert.equal(m.snapshot().effects.length,0,'responses fade without requiring movement');assert.equal(m.snapshot().visits.length<=1,true);
}
assert.equal(JSON.stringify(objects),original,'visual gestures cannot move, recolor or mutate inhabitants');
const m=createReactiveEcology(seed),one=byType.get('metamorfosis');m.tick(.05,{x:-70,y:0},[one],region,'#aaccff');m.tick(.05,{x:0,y:0},[one],region,'#aaccff');assert.equal(m.snapshot().effects[0].gesture,'entrar');
for(let i=0;i<100;i++)m.tick(.05,{x:0,y:0},[one],region,'#aaccff');assert(m.snapshot().effects.some(e=>e.gesture==='esperar'));
const orbit=createReactiveEcology(seed);for(let i=0;i<120;i++){const a=i*.07;orbit.tick(.05,{x:Math.cos(a)*40,y:Math.sin(a)*40},[one],region,'#aaccff');}assert(orbit.snapshot().effects.some(e=>e.gesture==='rodear'));
const tap=createReactiveEcology(seed);tap.tick(.05,{x:150,y:0},[one],region,'#aaccff',{tap:{x:0,y:0}});assert.equal(tap.snapshot().effects[0].gesture,'tocar');
for(let i=0;i<2000;i++)tap.tick(.05,{x:150,y:0},objects.map(o=>({...o,id:o.id+i})),region,'#aaccff',{tap:{x:0,y:0}});assert(tap.snapshot().effects.length<=tap.snapshot().profile.limit);assert(tap.snapshot().contacts<=72,'contact history is bounded during travel');tap.tick(.05,{x:10000,y:10000},[],region,'#aaccff');assert.equal(tap.snapshot().effects.length,0);assert.equal(tap.snapshot().visits.length,0);assert.equal(tap.snapshot().trail.length,1);
const pausedJump=createReactiveEcology(seed);pausedJump.tick(.05,{x:0,y:0},[one],region,'#aaccff');pausedJump.tick(1,{},[],region,'#aaccff',{paused:true});pausedJump.tick(.05,{x:5000,y:5000},[],region,'#aaccff');assert.equal(pausedJump.snapshot().effects.length,0,'a jump through a menu also clears former responses');
// Visit order defines links, not a fixed decorative polygon.
const c=byType.get('constelacion'),v=createReactiveEcology(seed);v.tick(.05,{x:150,y:0},[c],region,'#aaccff',{tap:{x:0,y:0}});for(let i=0;i<90;i++)v.tick(.05,{x:150,y:0},[],region,'#aaccff');v.tick(.05,{x:150,y:0},[{...c,x:90,id:c.id}],region,'#aaccff',{tap:{x:90,y:0}});assert.equal(v.snapshot().visits.length,1,'revisiting updates its anchor instead of duplicating it');
const fast=createReactiveEcology(seed),slow=createReactiveEcology(seed);
fast.tick(.05,{x:60,y:0},[one],region,'#aaccff');fast.tick(.05,{x:0,y:0},[one],region,'#aaccff');
slow.tick(.05,{x:60,y:0},[one],region,'#aaccff');for(let i=59;i>=0;i--)slow.tick(.05,{x:i,y:0},[one],region,'#aaccff');
assert(fast.snapshot().effects[0].speed>70);assert(slow.snapshot().effects[0].speed<28);assert.notEqual(fast.pose(one.id)?.sx,slow.pose(one.id)?.sx,'speed changes the actual glyph deformation');
console.log('PASS ten real-source gestures, three independent regional regimes, tap/stay/orbit distinction, pauses, fading, teleport cleanup, immutable inhabitants and bounded work');
