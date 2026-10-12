import assert from 'node:assert/strict';
import { gravityOf, movementMultiplier } from '../src/gravity.js';
import { initialize as progress } from '../src/progress.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};progress(r);
const region=(x,y)=>({key:`${Math.floor(x/3600)},${Math.floor(y/3600)}`});
const speed=(x,y)=>movementMultiplier(x,y,3600,region,r.seedOf);
assert.equal(gravityOf({key:'0,0'},r.seedOf).multiplier,1);
const values=new Set();
for(let x=-10;x<=10;x++)for(let y=-10;y<=10;y++) {
 const place=region(x*3600+1800,y*3600+1800),g=gravityOf(place,r.seedOf);
 values.add(g.multiplier);assert.equal(speed(x*3600+1800,y*3600+1800),g.multiplier);
 assert.deepEqual(gravityOf({...place},r.seedOf),g);
}
assert.equal(values.size,3);
for(let edge=-10800;edge<=10800;edge+=3600)for(const offset of [0,400,1800,3600]) {
 assert(Math.abs(speed(edge-.001,offset)-speed(edge+.001,offset))<.00001);
 assert(Math.abs(speed(offset,edge-.001)-speed(offset,edge+.001))<.00001);
 assert(speed(edge,offset)>=.55&&speed(edge,offset)<=1.65);
}
console.log('PASS: stable gravity, three speeds, neutral origin, continuous edges/corners including negative coordinates');
