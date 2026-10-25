import assert from 'node:assert/strict';
import {sayOnce,chapterToast,PLACE_LESSONS} from '../src/journey-games.js';
let timers=[],saves=0,delivery=null;const old=globalThis.setTimeout;globalThis.setTimeout=f=>timers.push(f);
try{
 const flags={},r={S:{journey:{}},placeRun:()=>({id:'jardin'}),journeyGamePlaying:()=>true,save:()=>{saves++;return true;},toast:(_,options)=>{delivery=options;return true;}};
 assert(sayOnce(r,flags,'hinted','Lección','jardin'));assert(!sayOnce(r,flags,'hinted','Lección','jardin'),'one pending request');assert(!flags.hinted&&!saves,'scheduling does not learn');timers.shift()();assert(!flags.hinted&&!saves,'queuing does not learn');delivery.onShown();assert(flags.hinted&&r.S.journey.lines.Lección);assert.equal(saves,1);
 const reject={...r,S:{journey:{}},toast:()=>false},other={};assert(sayOnce(reject,other,'hinted','Rechazada','jardin'));timers.shift()();assert(!other.hinted);assert(sayOnce(reject,other,'hinted','Rechazada','jardin'),'rejection can retry');timers.shift()();
 const bad={...r,S:{journey:{}},save:()=>false},pending={};sayOnce(bad,pending,'hinted','Disco lleno','jardin');timers.shift()();delivery.onShown();assert(!pending.hinted&&!bad.S.journey.lines?.['Disco lleno'],'failed write does not claim a durable lesson');
 const stale={...r,S:{journey:{}}};chapterToast(stale,'jardin','Vieja');stale.S={journey:{}};timers.shift()();assert(!stale.S.journey.lines,'old timers cannot modify a replacement save');
 assert(!chapterToast({...r,S:{journey:{version:9}}},'jardin','Futura'));
 const late={...r,S:{journey:{}}};sayOnce(late,{},'hinted','Cambio futuro','jardin');late.S.journey={version:9,payload:{keep:true}};timers.shift()();assert.deepEqual(late.S.journey,{version:9,payload:{keep:true}},'a future format installed while waiting is never altered');
 const malformed={...r,S:{journey:{lines:'keep'}},save:()=>false};sayOnce(malformed,{},'hinted','No guardar','jardin');timers.shift()();delivery.onShown();assert.equal(malformed.S.journey.lines,'keep','a failed acknowledgement restores exact old lines');
 assert.equal(Object.keys(PLACE_LESSONS).length,11);for(const steps of Object.values(PLACE_LESSONS)){assert.equal(steps.length,3);for(const step of steps)assert(step.split(/\s+/).length<=12);}
 console.log('PASS lessons: acknowledge real presentation, rejected requests retry, failed writes roll back, stale/future saves preserved, eleven concise recoverable rules');
}finally{globalThis.setTimeout=old;}
