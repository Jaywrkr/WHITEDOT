import assert from 'node:assert/strict';
import {productionExperimentEvents,PRODUCTION_EXPERIMENT_NAMES} from '../src/production-experiments.js';
for(const mode of Object.keys(PRODUCTION_EXPERIMENT_NAMES)){
 const events=[];for(let bar=0;bar<64;bar++)for(let step=0;step<16;step++)for(const e of productionExperimentEvents(mode,step,bar,.8)){assert(e.offset===0||e.offset===.5);assert(e.level>0&&e.level<=.018);assert(e.chord===undefined||[0,1,2].includes(e.chord));events.push(e);}
 assert(events.length>0&&events.length<=128);assert.deepEqual(productionExperimentEvents(mode,10,2,.2),[]);
}
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {createRadio} from '../src/radio.js';import {labNoteEvents,labScore} from '../src/lab-score.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);const region=r.regionOfPos((-29+.5)*3600,(-12+.5)*3600);assert.equal(labScore(region,r.seedOf,r.rng).electronic.count,2);const radio=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true});let notes=0;for(let b=0;b<4;b++){const f=radio.advance(region,b);for(let s=0;s<16;s++)notes+=labNoteEvents(f,s,b).length;}assert(notes>0,'the previously silent two-part ambient introduction must play from arrival');
console.log('PASS experimental color stays on subdivisions/chord indices, bounded accents without free clusters, and audible two-part ambient arrival');
