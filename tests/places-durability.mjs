import assert from 'node:assert/strict';
import {initialize,PLACES,PLACES_VERSION} from '../src/places.js';
import {commitJourneyClose} from '../src/journey-games.js';
import {roundSparks} from '../src/spark-rules.js';
const timers=[],oldTimer=globalThis.setTimeout;globalThis.setTimeout=f=>{timers.push(f);return timers.length;};
try{
 for(const {id,game} of PLACES){
  let failed=false,disk,calls=0;
  const r={S:{wx:0,wy:0,sound:true,sparks:7,todayKey:'2026-10-25',journey:{finished:true,done:Object.fromEntries(PLACES.map(p=>[p.id,true])),[game]:{points:91}},lugares:{version:2,kept:Object.fromEntries(PLACES.map(p=>[p.id,true]))},wild:{remix:{best:0}}},BIOMES:[{id}],biomeOfPos:()=>0,regionOfPos:()=>({}),MU:{},$:()=>null,hud(){},narrateRound(){calls++;},journeyVictory(){calls++;},journeyPulseState:()=>({notes:[90,91],noteSteps:[7,15]}),save(){if(failed)return false;disk=structuredClone(this.S);return true;}};
  initialize(r);assert(r.startPlace(id));for(let n=0;n<10;n++)r.placeHear(id,true,n<2?{midi:[60,64][n],step:[0,6][n]}:{});
  const previous=structuredClone(r.S),placesRef=r.S.lugares,journeyRef=r.S.journey;
  failed=true;assert.equal(r.placeFinish(id),false);assert.deepEqual(r.S,previous,'failed finish rolls back every affected field');assert.equal(r.S.lugares,placesRef);assert.equal(r.S.journey,journeyRef);assert.equal(calls,0,'never celebrate unsaved rewards');assert.equal(r.places().last,null);assert.equal(disk.sparks,7);
  failed=false;assert(r.placeFinish(id));assert.equal(r.S.sparks,7+roundSparks(1));assert.deepEqual(disk,r.S);assert.equal(r.placeFinish(id),false,'retry cannot pay twice');assert.equal(calls,2);assert.deepEqual(r.S.lugares.notes[id],[60,64]);
 }
 const raw={version:PLACES_VERSION+1,run:{id:'lago',stash:{untouched:true}},unknown:{x:[1,2]}};
 const r={S:{wx:23,wy:45,journey:{finished:true},lugares:raw},MU:{},save(){throw Error('read-only');}};
 initialize(r);assert.equal(r.places().count,0);assert.equal(r.placesData().readOnly,true);assert.equal(r.startPlace('lago'),false);r.placeHear('lago',true);r.placeChapterKept('lago');assert.equal(r.placeFinish('lago'),false);assert.equal(r.abandonPlace(),false);assert.equal(r.S.lugares,raw);assert.deepEqual(raw,{version:3,run:{id:'lago',stash:{untouched:true}},unknown:{x:[1,2]}});assert.equal(r.S.wx,23);
 assert.equal(commitJourneyClose({journeyComplete:()=>false,save(){throw Error('double save');}},'lago'),false);
 console.log('PASS durable rewards in eleven places, safe retries without duplicate pay, and future places read-only without mutation');
}finally{globalThis.setTimeout=oldTimer;}
