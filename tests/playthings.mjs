import assert from 'node:assert/strict';
import { createPlaythings,reactPlaything,stepPlaything,TOY_NAMES } from '../src/playthings.js';
import { initialize as data } from '../src/data.js';
import { initialize as progress } from '../src/progress.js';
import { initialize as world } from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};data(r);progress(r);world(r);
const build=(biome='llanura')=>createPlaythings(-1,2,900,1,biome,r.seedOf,r.rng);
assert.deepEqual(build(),build());
for(const o of build()){assert(o.x>=-900&&o.x<0&&o.y>=1800&&o.y<2700);assert(TOY_NAMES[o.kind]);}
assert(createPlaythings(0,0,900,100,'bosque',r.seedOf,r.rng).length<=40);
for(const kind of Object.keys(TOY_NAMES)) {
 const object={kind,x:10,y:0,hx:10,hy:0,vx:0,vy:0,rotation:0,lit:0,jump:0};
 reactPlaything(object,0,0);assert.equal(object.lit,1);stepPlaything(object,.05);
 if(kind==='spark'||kind==='kite')assert(object.x>10,'flight did not move object');
 if(kind==='spring')assert(object.jump>0,'spring did not jump');
 if(kind==='rotor'){assert(object.rotation>0);assert.equal(object.x,10);}
 if(kind==='resonator'){assert(object.ring>0);assert.equal(object.x,10);}
 for(let i=0;i<2000;i++)stepPlaything(object,.05);
 assert(Number.isFinite(object.x));assert(Math.abs(object.x-object.hx)<.1);assert.equal(object.lit,0);
}
const chunk=r.wchunk(1,1);assert(chunk.playthings.length>0);assert(chunk.playthings.every(o=>typeof o.snd==='function'));
const second={};data(second);progress(second);world(second);
const clean=chunk=>chunk.playthings.map(({snd,...object})=>object);
assert.deepEqual(clean(chunk),clean(second.wchunk(1,1)));
console.log('PASS: deterministic generation, density cap, flight/jump/rotation/static response, return home and real chunk sound hooks');
