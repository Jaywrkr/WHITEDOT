import assert from 'node:assert/strict';import {glassParameters,normalizeGlassSites,createGlassSite} from '../src/glass.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const origin=r.regionOfPos(900,900),site=createGlassSite(origin,3600,r.seedOf,r.rng);assert(site);assert.deepEqual(site,createGlassSite(origin,3600,r.seedOf,r.rng));assert.equal(site.id,'glass:0,0');
const aligned=glassParameters([0,0,0]),spaced=glassParameters([0,Math.PI*2/3,Math.PI*4/3]);assert(aligned.alignment>.99);assert(spaced.alignment<.3);assert(aligned.stride<spaced.stride);
for(let i=0;i<100;i++){const p=glassParameters([i,-i,Math.PI*i]);assert(p.degrees.every(n=>n>=0&&n<=6));assert(p.accents.every(n=>n>=0&&n<16));assert(p.alignment>=0&&p.alignment<=1);}
const saved=normalizeGlassSites({'glass:-1,2':{angles:[-Math.PI,10,1],seen:true},bad:{angles:[0,1,2]},'glass:2,3':{angles:'bad'}});assert.equal(Object.keys(saved).length,1);assert.deepEqual(saved,normalizeGlassSites(JSON.parse(JSON.stringify(saved))));
let count=0;for(let x=-15;x<=15;x++)for(let y=-15;y<=15;y++){const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600),g=createGlassSite(d,3600,r.seedOf,r.rng);if(g){assert(!d.sea);count++;}}
assert(count>80&&count<400);assert.equal(r.fresh().favorites.items.length,0);assert.deepEqual(r.fresh().glassSites,{});
console.log(`PASS: ${count} stable sparse glass sites, forced home example, orientation-to-note/accent mapping, alignment and persistent safe angles`);
