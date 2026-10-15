import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {initialize as world} from '../src/world.js';
import {labScore,labDrumEvents} from '../src/lab-score.js';
import {createRadio} from '../src/radio.js';
import {hybridIdentity} from '../src/musical-hybrids.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};data(r);progress(r);world(r);const genres=new Set(),hybrids=new Set(),rhythms=new Set();
for(let x=-20;x<=20;x++)for(let y=-20;y<=20;y++){
 const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600);if(d.sea)continue;
 const score=labScore(d,r.seedOf,r.rng),hybrid=hybridIdentity(d,r.seedOf,r.rng),a=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true}).advance(d,0);
 assert.equal(a.hybrid?.id,hybrid?.id,'territory must preserve its fusion');
 if(hybrid){hybrids.add(hybrid.id);assert.deepEqual(a.grammar.progression,hybrid.progression);}
 if(!genres.has(d.genre)){genres.add(d.genre);rhythms.add(JSON.stringify(Array.from({length:16},(_,s)=>labDrumEvents(score,s,0,.65))));}
 for(let s=0;s<16;s++)for(const hit of labDrumEvents(score,s,0,.65)){
  if(['handslap','skinbass','acousticsnare'].includes(hit.instrument))assert(hit.pitch>=36&&hit.pitch<=57,'natural drums must use a low/mid body');
 }
}
assert.equal(genres.size,52);assert.equal(hybrids.size,16);assert(rhythms.size>=24,`too few actual rhythmic grammars: ${rhythms.size}`);
console.log(`PASS ${genres.size} native styles, ${hybrids.size} retained live fusions, ${rhythms.size} actual drum grammars and low/mid membrane bodies`);
