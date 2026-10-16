import assert from 'node:assert/strict';
import {createCelebrationQueue,celebrationDuration,openingFragments} from '../src/celebration-model.js';
import {POWERS} from '../src/expansion-music.js';
const q=createCelebrationQueue(3);assert(q.enqueue({id:'a',name:'A',rarity:'comun'}));assert(!q.enqueue({id:'a',name:'A',rarity:'comun'}));
assert(q.enqueue({id:'b',rarity:'rara'}));assert.equal(q.tick(1,false),null);assert.equal(q.pending,2);
assert.equal(q.tick(.1,true).id,'a');const time=q.remaining;q.tick(1,false);assert.equal(q.remaining,time,'menus pause the event');
assert.equal(q.tick(1,true),null);assert.equal(q.tick(1,true).id,'b');assert.equal(q.remaining,5);
q.dismiss();assert.equal(q.current,null);for(let i=0;i<20;i++)q.enqueue({id:'x'+i,rarity:'epica'});assert.equal(q.pending,3);q.clear();assert.equal(q.pending,0);
assert.equal(celebrationDuration('comun'),2);assert.equal(celebrationDuration('mitica'),4);
assert(!q.enqueue({id:'bad',rarity:'bad'}));assert(openingFragments(12,1.2).every(p=>p.alpha===0));assert(openingFragments(12,.5).every(p=>Math.abs(p.x)<64&&Math.abs(p.y)<64));
assert(Object.values(POWERS).every(p=>p.text.split(/\s+/).length<=12&&p.seconds>0));
const openings=Object.keys(POWERS).map(power=>openingFragments(42,.6,power));assert.equal(new Set(openings.map(p=>JSON.stringify(p))).size,6,'each power reveals its own motion');
for(const power of Object.keys(POWERS)){assert.deepEqual(openingFragments(42,.6,power),openingFragments(42,.6,power));assert(openingFragments(42,1.2,power).every(p=>p.alpha===0));assert(openingFragments(42,.8,power).every(p=>Math.abs(p.x)<64&&Math.abs(p.y)<64));}
console.log('PASS celebration sequencing, duplicate coalescing, active-time pause, bounded queue/fragments and short timed-power copy');

const gap=createCelebrationQueue();gap.enqueue({id:'first',rarity:'comun'});gap.enqueue({id:'second',rarity:'comun'});gap.tick(0,true);gap.tick(1,true,false);gap.tick(1,true,false);assert.equal(gap.current,null);assert.equal(gap.pending,1);assert.equal(gap.tick(0,true).id,'second');
