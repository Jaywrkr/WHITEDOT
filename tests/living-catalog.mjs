import assert from 'node:assert/strict';import {LIVING_CATALOG,livingChunk,musicRecipe,livingVoice} from '../src/living-catalog.js';
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
const d={key:'0,0',genre:'deep',hue:200},genres={deep:{bassP:['sub','fm'],hookP:['rhodes']}};
assert.equal(new Set(LIVING_CATALOG.map(o=>o.id)).size,28);
const signatures=new Set(),counts=new Set();let total=0;
for(let i=0;i<1000;i++){const a=livingChunk(i,-i,900,d,'bosque',seedOf,rng);assert.deepEqual(a,livingChunk(i,-i,900,d,'bosque',seedOf,rng));assert(a.length<=3);counts.add(a.length);total+=a.length;signatures.add(JSON.stringify(a));for(const o of a)assert(o.x>=i*900&&o.x<(i+1)*900);}
console.log({total,distinct:signatures.size,densities:[...counts]});assert(total>300&&signatures.size>350&&counts.size===4);assert.deepEqual(livingChunk(1,2,900,{...d,sea:true},'lago',seedOf,rng),[]);
assert.equal(musicRecipe(d,seedOf,rng).family,'swing');assert.equal(musicRecipe({...d,genre:'ambient'},seedOf,rng).family,'free');
for(const item of LIVING_CATALOG){const v=livingVoice('living:'+item.id,d,genres,seedOf,rng);assert(v&&v.high<=69&&v.low>=36&&v.instrument);}
console.log('PASS 28 extensible lineages, seeded bounds, sparse densities, original namespaces and contextual music grammar');
