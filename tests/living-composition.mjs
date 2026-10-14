import assert from 'node:assert/strict';import {productionFrame} from '../src/living-composition.js';
const seedOf=s=>Array.from(s).reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261),rng=a=>()=>((a=Math.imul(a,1664525)+1013904223>>>0)/4294967296);
const region={genre:'deep',key:'0,0'},a={harmonyBar:0,energy:.7,hook:[0,2,4,6,0,2,4,6,0,2,4,6,0,2,4,6],grammar:{progression:[0,3,5,4],hookLevel:1,bassLevel:1,brightness:10000}};
const original=JSON.stringify(a),frames=[];
for(let bar=0;bar<512;bar+=32){const f=productionFrame(region,{...a,harmonyBar:bar},seedOf,rng,{genre:{bassP:['sub','fm']},character:'warm'});assert(f.grammar.brightness<=8700&&f.grammar.bassLevel>.5);frames.push(JSON.stringify(f));}
assert.equal(new Set(frames).size,16);assert.equal(JSON.stringify(a),original);const rest=productionFrame(region,a,seedOf,rng,{silence:true});assert(rest.hook.filter(n=>n>=0).length===2);console.log('PASS long-form phrase changes, subtraction, native genre banks, bounded comfort and immutable recipes');
