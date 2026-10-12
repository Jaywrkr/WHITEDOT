import assert from 'node:assert/strict';
import {createPockets,distributePlaythings,pocketAt} from '../src/pockets.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {createRadio} from '../src/radio.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++) {
 const pockets=createPockets(x,y,900,r.seedOf,r.rng);assert.deepEqual(pockets,createPockets(x,y,900,r.seedOf,r.rng));
 assert.equal(new Set(pockets.map(p=>p.kind)).size,3);
 for(const p of pockets){assert(p.x>=x*900&&p.x<(x+1)*900);assert.equal(pocketAt(pockets,p.x,p.y).kind,p.kind);}
 const objects=Array.from({length:18},(_,i)=>({id:`${x},${y}:${i}`,kind:'spark',x:0,y:0,hx:0,hy:0}));
 distributePlaythings(objects,pockets,r.seedOf,r.rng);
 const zones=objects.map(o=>pocketAt(pockets,o.x,o.y)?.kind);assert(zones.includes('ensemble'));assert(zones.includes('discovery'));assert(!zones.includes('quiet'));assert(!zones.includes(undefined));
 assert(objects.every(o=>o.x===o.hx&&o.y===o.hy));
 const copy=objects.map(o=>({...o,x:0,y:0,hx:0,hy:0}));distributePlaythings(copy,pockets,r.seedOf,r.rng);assert.deepEqual(objects,copy);
}
const region=r.regionOfPos(900,900),radio=createRadio(r.seedOf,r.rng,r.GEN);
for(let bar=0;bar<60;bar++)radio.advance(region,bar,{near:20,singers:2});
let quiet;for(let bar=60;bar<80;bar++)quiet=radio.advance(region,bar,{quiet:true,near:20,singers:2});assert(quiet.energy<.25);
const chunk=r.wchunk(0,0);assert.equal(chunk.pockets.length,3);assert(chunk.playthings.every(o=>pocketAt(chunk.pockets,o.x,o.y)?.kind!=='quiet'));
console.log('PASS: stable local spaces, negative coordinates, compact groups, empty listening centers, quieter radio and actual chunk integration');
