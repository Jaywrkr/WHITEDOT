import assert from 'node:assert/strict';
import {personalityOf,attachPersonalities} from '../src/personality.js';
import {reactPlaything,stepPlaything} from '../src/playthings.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const traits=Array.from({length:50},(_,i)=>personalityOf(`tree:${i}`,r.seedOf,r.rng));
assert.equal(new Set(traits.map(p=>p.name)).size,3);assert(new Set(traits.map(p=>p.period)).size>40);
for(let i=0;i<traits.length;i++){assert.deepEqual(traits[i],personalityOf(`tree:${i}`,r.seedOf,r.rng));assert(traits[i].volume<=1);}
const objects=traits.slice(0,20).map(p=>({kind:'spark',x:10,y:0,hx:10,hy:0,vx:0,vy:0,rotation:0,lit:0,jump:0,personality:p}));
objects.forEach(o=>reactPlaything(o,0,0));assert(new Set(objects.map(o=>o.vx)).size>15);
for(let i=0;i<2400;i++)objects.forEach(o=>stepPlaything(o,.05));
for(const o of objects){assert(Number.isFinite(o.x));assert(Math.abs(o.x-o.hx)<.1);}
const chunk={id:'1,2',grass:[{x:1,y:2,h:20},{x:3,y:4,h:20}]};const original=JSON.stringify(chunk);
attachPersonalities(chunk,r.seedOf,r.rng);assert.notDeepEqual(chunk.grass[0].personality,chunk.grass[1].personality);
const rebuilt=JSON.parse(original);attachPersonalities(rebuilt,r.seedOf,r.rng);assert.deepEqual(chunk,rebuilt);
const c=r.wchunk(4,4);assert(c.plants.every(o=>o.personality));assert(c.playthings.every(o=>o.personality));
console.log('PASS: stable per-object traits, distinct neighboring trees and flight responses, bounded recovery, real chunk attachment');
