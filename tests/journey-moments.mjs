import assert from 'node:assert/strict';
import {normalizeMoments,placeFaro,lotusAt,faroVolume,FARO_DISTANCE,FARO_HEAR,LOTUS_COUNT,initialize} from '../src/journey-moments.js';
// Saved moments are cleaned.
assert.deepEqual(normalizeMoments(null),{});
assert.deepEqual(normalizeMoments({faro:{x:1.4,y:2,reached:'yes'},lotos:{x:0,y:0,open:[true,1]},companion:true,otro:1}),{faro:{x:1,y:2,reached:false},lotos:{x:0,y:0,open:[true,false,false,false,false]},companion:true});
// The lighthouse stays in the Llanura; the lotuses ring the player; the voice grows as you come near.
const f=placeFaro({x:0,y:0},(x,y)=>y>100);assert.equal(Math.round(Math.hypot(f.x,f.y)),FARO_DISTANCE);assert(f.y>100);
assert.deepEqual(placeFaro({x:0,y:0},()=>false),{x:FARO_DISTANCE,y:0},'never fails');
assert.equal(new Set(Array.from({length:LOTUS_COUNT},(_,i)=>JSON.stringify(lotusAt({x:0,y:0},i)))).size,LOTUS_COUNT);
assert.equal(faroVolume(FARO_HEAR),0);assert(faroVolume(100)>faroVolume(500)&&faroVolume(500)>0);
// Runtime: the Llanura places its lighthouse and reaching it lights it; the Lago's lotuses open with notes on time
// near them; the Bosque's creature follows from the first note there and never into the Vacío.
const ids=['llanura','lago','bosque','tormenta','vacio'];let saves=0;globalThis.document={querySelectorAll:()=>[]};
const r={S:{journey:{version:1,mode:'viaje'},wx:0,wy:0,sound:false},MU:{},SIX:.125,BIOMES:ids.map(id=>({id})),camX:0,camY:0,biomeOfPos:()=>0,regionOfPos:()=>({sea:false}),save:()=>{saves++;return true;}};
initialize(r);const drawn=[];const c=new Proxy({},{get:(o,k)=>k in o?o[k]:(...a)=>{if(k==='fillRect')drawn.push(a);},set:(o,k,v)=>{o[k]=v;return true;}});
r.drawJourneyMoments(c,390,844,0,'llanura',true);const m=r.journeyMoments();assert(m.faro&&!m.faro.reached);assert(drawn.length>0,'the lighthouse is drawn');
r.S.wx=m.faro.x;r.S.wy=m.faro.y;r.drawJourneyMoments(c,390,844,16,'llanura',true);assert.equal(r.journeyMoments().faro.reached,true);
r.S.wx=1000;r.S.wy=1000;r.drawJourneyMoments(c,390,844,32,'lago',true);const lake=r.journeyMoments().lotos;assert.deepEqual(lake.open,[false,false,false,false,false]);
const p=lotusAt(lake,2);r.S.wx=p.x;r.S.wy=p.y;r.journeyMomentNote('lago',60);assert.equal(r.journeyMoments().lotos.open[2],true);assert.equal(r.journeyMoments().counts.lotus,1);
r.S.wx=99999;r.journeyMomentNote('lago',62);assert.equal(r.journeyMoments().counts.lotus,1,'far from every lotus, nothing opens');
assert.equal(r.journeyMoments().companion,undefined);r.journeyMomentNote('bosque',55);assert.equal(r.journeyMoments().companion,true);
drawn.length=0;r.drawJourneyMoments(c,390,844,48,'tormenta',false);assert(drawn.length>0,'the creature walks with you');
drawn.length=0;r.drawJourneyMoments(c,390,844,64,'vacio',true);assert.equal(drawn.length,0,'it cannot enter the Vacío');
const before=r.journeyMoments().counts.companion;r.journeyMomentNote('vacio',60);assert.equal(r.journeyMoments().counts.companion,before);
r.drawJourneyMoments(c,390,844,80,null,false);
console.log('PASS journey moments: saved moments cleaned, the Llanura lighthouse placed and lit when reached, its voice grows near, Lago lotuses open with notes on time, the Bosque creature follows but not into the Vacío');
