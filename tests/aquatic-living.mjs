import assert from 'node:assert/strict';import {aquaticChunk} from '../src/living-catalog.js';import {livingPortrait} from '../src/living-portraits.js';
const seedOf=s=>Array.from(s).reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261),rng=a=>()=>((a=Math.imul(a,1664525)+1013904223>>>0)/4294967296);let count=0;
for(let i=0;i<1000;i++){const a=aquaticChunk(i,-i,900,{hue:200},seedOf,rng);assert.deepEqual(a,aquaticChunk(i,-i,900,{hue:200},seedOf,rng));assert(a.length<=1);count+=a.length;if(a.length)assert(a[0].x>=i*900&&a[0].x<(i+1)*900);}
assert(count>70&&count<170);assert.notEqual(livingPortrait('living:cactus'),livingPortrait('living:manta'));console.log('PASS sparse bounded aquatic encounters and species-specific original portraits');
