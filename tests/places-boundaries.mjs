import assert from 'node:assert/strict';
import {initialize} from '../src/places.js';
import {initialize as stick,STICK_GOAL} from '../src/journey-stick.js';
const original=setTimeout;globalThis.setTimeout=()=>0;
try{
 let fail=true;
 const r={S:{wx:0,wy:0,sparks:0,sound:false,todayKey:'2026-10-25',journey:{finished:true}},BIOMES:[{id:'lago'},{id:'llanura'}],biomeOfPos:x=>x>1000?1:0,regionOfPos:()=>({}),MU:{},save:()=>!fail,$:()=>null};initialize(r);
 const position=[r.S.wx,r.S.wy];assert.equal(r.startPlace('llanura'),false);assert.deepEqual([r.S.wx,r.S.wy],position,'failed entry never teleports the player');
 fail=false;assert(r.startPlace('llanura'));r.placeHear('llanura',true,{silent:true});assert(r.placeFinish('llanura'));assert(r.places().last);
 const card={hidden:false};r.$=id=>id==='mPlace'?card:null;const previous=r.S;r.S={wx:0,wy:0,sparks:0,sound:false,journey:{finished:true}};assert.equal(r.places().last,null,'a replaced save cannot inherit a previous reward card');assert(previous.lugares.best.llanura.rounds>0);assert.equal(card.hidden,true,'a visible old result closes on save replacement');
 // The real gold handler retains its state reference while a failed finish rolls back.
 let blocked=false,g;
 const a={S:{wx:0,wy:0,sparks:0,sound:false,todayKey:'2026-10-25',journey:{finished:true,stick:{points:7}}},BIOMES:[{id:'llanura'}],biomeOfPos:()=>0,regionOfPos:()=>({}),MU:{},save:()=>!blocked,$:()=>null,registerJourneyGame:(id,game)=>g=game,journeyGamePlaying:()=>true};
 initialize(a);a.journeyComplete=id=>a.placeFinish(id);stick(a);assert(a.startPlace('llanura'));a.journeyStick();a.S.journey.stick.points=STICK_GOAL;blocked=true;assert.equal(g.pulse(true),null);assert.equal(a.S.journey.stick.swallowed,false,'failed gold close stays retryable through its real game handler');blocked=false;assert.equal(g.pulse(true),'swallow');assert.equal(a.placeRun(),null);assert(a.places().stars.llanura[0]);assert.equal(a.S.sparks,60,'paid exactly once');
 console.log('PASS failed entry preserves position and replaced saves cannot show a prior reward card');
}finally{globalThis.setTimeout=original;}
