import assert from 'node:assert/strict';import {behavior} from '../src/living-behavior.js';
const a={kind:'deer',homeX:0,homeY:0,x:0,y:0,variant:5,personality:'timida'},b={...a,personality:'curiosa'};
for(let i=0;i<10000;i++){for(const o of [a,b])behavior(o,.05,i*.05,40,{x:40,y:0,speed:50});assert(Math.hypot(a.x,a.y)<=75);assert(Math.hypot(b.x,b.y)<=75);}
assert(Math.abs(a.x-b.x)>5);behavior(a,.05,500,30,{x:30,y:0,speed:130});assert.equal(a.expression,'staccato');
console.log('PASS bounded 500-second organism travel, distinct personalities and gesture expression');
