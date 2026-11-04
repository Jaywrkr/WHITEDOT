import assert from 'node:assert/strict';
import {WILD_AFTER,WILD_SURE,WILD_WALK,WILD_HEAR,wildGain,REMIX_PLACES,REMIX_RHYTHMS,REMIX_SPARKS,REMIX_RECORD,normalizeWild,dailyRemix,remixSparks,wildDue,wildPay,WILD_SPARKS} from '../src/wild.js';
import {normalizeSparkEconomy} from '../src/sparks-model.js';
import {PLACE_RHYTHMS} from '../src/journey-rhythm.js';
// Saves: junk dropped, counts kept, the remix best in 0–1.
const w=normalizeWild({caught:3,today:-1,remix:{day:'2026-10-23',best:7}});assert.equal(w.caught,3);assert.equal(w.today,0);assert.equal(w.remix.best,1);assert.deepEqual(normalizeWild(null).remix,{day:'',best:0,done:0});
// A wild spark: never before a minute or before 1 200 px walked; at a moment drawn between one and two minutes.
assert(!wildDue(WILD_SURE+1,WILD_WALK-1,0));assert(!wildDue(WILD_AFTER-1,WILD_WALK,0));assert(wildDue(WILD_AFTER,WILD_WALK,0));assert(wildDue(WILD_SURE,WILD_WALK,1));
assert(wildDue(WILD_AFTER+30000,WILD_WALK,.4)&&!wildDue(WILD_AFTER+30000,WILD_WALK,.6));
// Today's remix: one open place from those that can be remixed, with a rhythm that is not its own; fixed for the day.
const all={stars:Object.fromEntries(['llanura','lago','bosque','tormenta','vacio','jardin','dunas','cristales','faros','ruinas','cueva'].map(id=>[id,[true,true,true]]))},journey={free:true};
const seen=new Set();for(let d=1;d<=60;d++){const day=`2026-11-${String(d).padStart(2,'0')}`,m=dailyRemix(day,all,journey,id=>PLACE_RHYTHMS[id]);assert(REMIX_PLACES.includes(m.id));assert(REMIX_RHYTHMS.includes(m.rhythm));assert.notEqual(m.rhythm,PLACE_RHYTHMS[m.id]);assert.deepEqual(dailyRemix(day,all,journey,id=>PLACE_RHYTHMS[id]),m);seen.add(m.id);}
assert(seen.size>=5,'the remix moves around the places');
// Only open places: with no stars only the five chapters' places are open, and none before the free World.
const none={stars:{}};for(let d=1;d<=20;d++){const m=dailyRemix('2026-12-'+d,none,journey);assert(['llanura','lago','bosque','tormenta'].includes(m.id),m.id);}assert.equal(dailyRemix('2026-12-01',none,{free:false}),null);
// What it pays: 30, and 20 more over the day's best.
assert.equal(remixSparks(.8,.9),REMIX_SPARKS);assert.equal(remixSparks(.95,.9),REMIX_SPARKS+REMIX_RECORD);
// Plan H6: the spark is louder near, never silent within its reach of a walk.
{let prev=1;for(let d=0;d<=WILD_HEAR*2;d+=50){const g=wildGain(d);assert(g>0&&g<=prev);prev=g;}assert(wildGain(0)>wildGain(WILD_HEAR)*3);}
// T0 (bug 1): the wild spark pays like every other source. Only a save of version 1, never in the lab or on another
// land (a preview seed without real travel); each catch leaves its line in the log; a future save stays as it was.
{const S={sparks:3,todayKey:'2026-11-04'};S.sparkEconomy=normalizeSparkEconomy(undefined,3,S.todayKey);
 assert.equal(wildPay(S,{}),WILD_SPARKS);assert.equal(S.sparks,3+WILD_SPARKS);assert.equal(S.sparkEconomy.log.at(-1).text,`Chispa salvaje · +${WILD_SPARKS} chispas`);
 const future={version:2,earned:9,log:[],secret:{x:1}},F={sparks:4,todayKey:'2026-11-04',sparkEconomy:future};assert.equal(wildPay(F,{}),0);assert.equal(F.sparks,4);assert.equal(F.sparkEconomy,future);assert.deepEqual(future,{version:2,earned:9,log:[],secret:{x:1}});
 const L={sparks:0,todayKey:'d',sparkEconomy:normalizeSparkEconomy(undefined,0,'d')};assert.equal(wildPay(L,{labMode:true}),0);assert.equal(L.sparks,0);assert.equal(L.sparkEconomy.log.length,0);
 const P={sparks:0,todayKey:'d',previewSeed:'otra',sparkEconomy:normalizeSparkEconomy(undefined,0,'d')};assert.equal(wildPay(P,{}),0);assert.equal(wildPay(P,{realTravel:true}),WILD_SPARKS);}
console.log('PASS wild: a wild spark after a minute and 1 200 px walked (always by two), today\'s remix of an open place with another rhythm (it paid 30 ✦ and 20 more over the day\'s best until H1; now none)');
