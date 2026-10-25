import assert from 'node:assert/strict';
import {initialize as places} from '../src/places.js';
import {initialize as games} from '../src/journey-games.js';
import {initialize as pulse} from '../src/journey-pulse.js';
const old=setTimeout,realNow=performance.now;globalThis.setTimeout=()=>0;let clock=1000;performance.now=()=>clock;
try{
 let failed=false,disk;
 const r={S:{mode:'world',sound:false,wx:0,wy:0,sparks:0,journey:{finished:true,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}}},MU:{bq:[],tr:0},BIOMES:[{id:'lago',scale:[0,2,3,5,7,8,10]}],biomeOfPos:()=>0,regionOfPos:()=>({}),inWorld:()=>true,journeyChapter:()=>null,$:()=>null,hud(){},save(){if(failed)return false;disk=structuredClone(this.S);return true;}};
 places(r);games(r);pulse(r);let count=0;r.registerJourneyGame('lago',{pulse(on){if(on&&++count>=3)return r.placeFinish('lago');}});
 // Warm the unrelated global history before a round.
 for(let i=0;i<2;i++){clock+=500;r.journeyPulse();}const oldNotes=[...r.journeyPulseState().notes];
 assert(r.startPlace('lago'));for(let i=0;i<3;i++){clock+=500;r.journeyPulse();}
 assert.equal(r.placeRun(),null);const expected=r.journeyPulseState().notes.slice(-3);assert.deepEqual(r.S.lugares.notes.lago,expected,'last closing pulse is included');assert.notDeepEqual(expected,oldNotes);assert.equal(r.S.lugares.notes.lago.length,3,'unrelated history is excluded');assert.deepEqual(disk.lugares.notes.lago,expected);
 // A second short round has no carry-over and a rejected write keeps its live phrase for retry.
 count=2;assert(r.startPlace('lago'));failed=true;clock+=500;r.journeyPulse();assert(r.placeRun());assert.equal(r.S.lugares.run.notes.length,1);assert.deepEqual(r.S.lugares.notes.lago,expected,'failed reward cannot replace kept phrase');
 failed=false;assert(r.placeFinish('lago'));assert.equal(r.S.lugares.notes.lago.length,1);assert.deepEqual(r.S.lugares.notes.lago,r.journeyPulseState().notes.slice(-1));
 const kept=[...r.S.lugares.notes.lago];assert(r.startPlace('lago'));r.placeHear('lago',false,{midi:80,step:0});r.placeFinish('lago');assert.deepEqual(r.S.lugares.notes.lago,kept,'no valid new notes retains the old phrase');
 assert(r.startPlace('lago'));for(let i=0;i<20;i++)r.placeHear('lago',true,{midi:60+i,step:i%16});assert.equal(r.S.lugares.run.notes.length,8);r.placeFinish('lago');assert.deepEqual(r.S.lugares.notes.lago,[72,73,74,75,76,77,78,79]);
 console.log('PASS round phrases: global history excluded, actual closing note included, second round isolated, failed save retry and eight-note bound');
}finally{globalThis.setTimeout=old;performance.now=realNow;}
