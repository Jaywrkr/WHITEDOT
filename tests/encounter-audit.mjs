import assert from 'node:assert/strict';
import {auditRuntime,sampleEncounterHour,summarizeEncounters,observationKeys,wilsonInterval} from '../scripts/encounter-model.mjs';
const previousStorage=Object.getOwnPropertyDescriptor(globalThis,'localStorage'),previousLocation=Object.getOwnPropertyDescriptor(globalThis,'location');
const storage={getItem(){throw Error('Player save must never be read');},setItem(){throw Error('Player save must never be written');}};
Object.defineProperty(globalThis,'localStorage',{value:storage,writable:true,configurable:true});
const location={search:'?testSeed=player-save'};Object.defineProperty(globalThis,'location',{value:location,writable:true,configurable:true});
try{
 const first=sampleEncounterHour({seed:'measurement-test',route:3}),second=sampleEncounterHour({seed:'measurement-test',route:3});
 assert.deepEqual(first,second,'a fixed route/world is reproducible');assert.equal(globalThis.localStorage,storage);assert.equal(globalThis.location,location,'does not replace the caller environment');
 assert.equal(first.seconds,3600);assert.equal(first.movingSeconds+first.listeningSeconds,3600);assert(first.generatedChunks>100);assert(first.seen.some(k=>k.startsWith('living:')));assert(first.seen.some(k=>k.startsWith('rhythm:')));
 const still=sampleEncounterHour({seed:'measurement-test',route:3,mode:'still'});assert.deepEqual(still.start,first.start);assert.deepEqual(still.start,still.end);assert.equal(still.movingSeconds,0);assert(still.generatedChunks<first.generatedChunks,'stillness does not invent new spatial draws');
 for(const key of still.seen)assert(first.seen.includes(key),'exploration retains the initial nearby opportunities');
 const old=auditRuntime('old-territory','classic',1),d=old.regionOfPos(15000,-6000),signature=JSON.stringify([d.key,d.genre,d.bpm,d.track]);
 sampleEncounterHour({seed:'another-place',generation:2,route:5});
 const again=old.regionOfPos(15000,-6000);assert.equal(JSON.stringify([again.key,again.genre,again.bpm,again.track]),signature,'auditing another world does not consume the original placement stream');
 assert.deepEqual(observationKeys({category:'living',kind:'moth',rare:true}),['living:moth','rare-source:living:moth']);
 assert.deepEqual(observationKeys({category:'relic',magical:true}),['relic','relic:magical']);assert.deepEqual(observationKeys({category:'future'}),[]);
 const summary=summarizeEncounters([{seen:['box','box']},{seen:[]}]);assert.equal(summary.box.routes,1);assert.equal(summary.box.proportion,.5);assert(!('relic' in summary),'unobserved does not become zero probability');
 assert(wilsonInterval(0,192)[1]>.019);assert(wilsonInterval(192,192)[0]<.981);
 assert.equal(wilsonInterval(0,192)[0],0);assert.equal(wilsonInterval(192,192)[1],1,'floating point rounding must retain all-success observations');
 for(const args of [[-1,2],[3,2],[0,0],[.2,2]])assert.throws(()=>wilsonInterval(...args));
 for(const args of [{mode:'jump'},{route:-1},{radius:0},{generation:99},{layout:'unknown'}])assert.throws(()=>sampleEncounterHour(args));assert.throws(()=>summarizeEncounters([]));
}finally{
 for(const [key,descriptor] of [['localStorage',previousStorage],['location',previousLocation]])if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];
}
console.log('PASS reproducible hourly opportunity model, still/explore separation, no player-save access, stable legacy worlds and uncertainty without invented awards');
