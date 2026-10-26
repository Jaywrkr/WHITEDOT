import assert from 'node:assert/strict';
import {guideLesson} from '../src/voice-guide.js';
const r={S:{journey:{}},journeyQuiet:()=>true,journeyChapter:()=>({id:'bosque',done:{}}),journeyGameProgress:()=>.4};
assert.equal(guideLesson(r).name,'Bosque');assert.match(guideLesson(r).steps.join(' '),/Rodea/);
r.journeyGameProgress=()=>1;assert.match(guideLesson(r).hint,/dorada/);
r.journeyChapter=()=>({id:'bosque',done:{bosque:true}});assert.match(guideLesson(r).hint,/portal/);
r.placeRun=()=>({id:'jardin'});assert.equal(guideLesson(r).name,'Jardín');
r.placeRun=()=>null;r.journeyChapter=()=>({id:'camino'});assert.equal(guideLesson(r).steps.length,3);
r.S.journey.finished=true;assert.equal(guideLesson(r),null);
r.journeyQuiet=()=>false;r.S.journey.finished=false;assert.equal(guideLesson(r),null);
console.log('PASS contextual help: active campaign, close, portal, round, Camino and free exploration');
const c={S:{journey:{}},journeyQuiet:()=>true,journeyChapter:()=>({id:'bosque',done:{}}),journeyGameProgress:()=>.2,journeyLasso:()=>({closed:true,inside:3})};assert.match(guideLesson(c).hint,/Pulsa/);c.journeyLasso=()=>({closed:true,inside:0});assert.match(guideLesson(c).hint,/dentro/);
c.journeyChapter=()=>({id:'vacio'});c.journeyPulseState=()=>({action:'crowded'});assert.match(guideLesson(c).hint,/espacio vacío/);

const {normalizeGarden,bedSpots}=await import('../src/journey-garden.js');
const garden=normalizeGarden({center:{x:0,y:0}}),spot=bedSpots(garden.center)[0],g={S:{journey:{},wx:spot.x,wy:spot.y,sound:true},placeRun:()=>({id:'jardin'}),journeyGameProgress:()=>.1,journeyGarden:()=>garden};
assert.match(guideLesson(g).hint,/sembrar/);garden.beds[0].stage=1;assert.match(guideLesson(g).hint,/regar/);garden.beds[0].stage=4;assert.match(guideLesson(g).hint,/flor/);assert.equal(guideLesson(g).step,2);

g.journeyGameProgress=()=>1;assert.match(guideLesson(g).hint,/árbol dorado/);assert.equal(guideLesson(g).step,2);
