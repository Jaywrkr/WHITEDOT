import assert from 'node:assert/strict';
import {STREAK_TRIPLE,STREAK_FORGET_MS,LOOSE_SPARK,ON_TIME_MULTIPLIER,rhythmMultiplier,nextStreak,ROUND_BASE,roundSparks,ECONOMY_BEFORE_E1,ECONOMY_BEFORE_H1,LEVEL_SPARKS,UNIVERSE_BASE,DIFFICULTY,RARITY,DISTANCE_BANDS,distanceFactor,universeReward,activityReward,mischiefReward,ACTIVITY_DIFFICULTY} from '../src/spark-rules.js';
// Free World (H1, Jay): a loose spark is 1, on time 2; the ×3 from the eighth on time in a row is gone.
assert.equal(LOOSE_SPARK,1);assert.equal(ON_TIME_MULTIPLIER,2);assert.equal(rhythmMultiplier(false,20),1,'off time keeps its base reward (K2)');assert.equal(rhythmMultiplier(true,1),2);assert.equal(rhythmMultiplier(true,STREAK_TRIPLE-1),2);assert.equal(rhythmMultiplier(true,STREAK_TRIPLE),2,'no ×3 any more');assert.equal(rhythmMultiplier(true,40),2);
// The streak grows on time, breaks off time and is forgotten after a pause.
let s=0;for(let i=0;i<8;i++)s=nextStreak(s,true,500);assert.equal(s,8);assert.equal(nextStreak(s,false,500),0);assert.equal(nextStreak(s,true,STREAK_FORGET_MS+1),1);
// H1 (Jay, alpha.233): a level pays no sparks. What a round paid until then stays for the curves: 80 plus 9 per tenth on
// time (E1, up from 60 + 6); Maestro double; from the fourth round of the day, half.
assert.equal(LEVEL_SPARKS,0);assert.equal(ECONOMY_BEFORE_H1.roundBase,ROUND_BASE);assert.equal(ECONOMY_BEFORE_H1.roundPerTenth,9);
assert.equal(roundSparks(0),ROUND_BASE);assert.equal(ROUND_BASE,80);assert.equal(roundSparks(.85),152);assert.equal(roundSparks(1),170);assert.equal(roundSparks(.85,{maestro:true}),304);
assert.equal(roundSparks(.85,{roundsToday:2}),152);assert.equal(roundSparks(.85,{roundsToday:3}),76);assert.equal(roundSparks(NaN),80);assert.equal(roundSparks(2),170);
// The rules before E1 stay reachable for the curves: 60 + 6 per tenth.
assert.equal(roundSparks(.85,{base:ECONOMY_BEFORE_E1.roundBase,perTenth:ECONOMY_BEFORE_E1.roundPerTenth}),108);
assert.equal(ECONOMY_BEFORE_H1.activity,15);assert.equal(ECONOMY_BEFORE_H1.mischief,10);assert(ECONOMY_BEFORE_H1.streak&&ECONOMY_BEFORE_H1.mine>1);
// What appears or has to be done: base × difficulty × distance × rarity (× 1.5 on time), rounded, at least 1.
assert.deepEqual({...UNIVERSE_BASE},{live:5,sky:4,activity:10,mischief:4});assert.deepEqual({...DIFFICULTY},{easy:1,medium:1.5,hard:2});assert.deepEqual({...RARITY},{common:1,rare:1.5,legend:3});
assert.deepEqual(DISTANCE_BANDS.map(b=>b[1]),[1,1.5,2,3]);const km=k=>k*10000;
assert.equal(distanceFactor(0,0),1);assert.equal(distanceFactor(km(4.99),0),1);assert.equal(distanceFactor(km(5),0),1.5);assert.equal(distanceFactor(0,-km(19.9)),1.5);assert.equal(distanceFactor(km(30),km(30)),2);assert.equal(distanceFactor(km(50),0),3);assert.equal(distanceFactor(NaN,undefined),1);
assert.equal(universeReward(5),5,'an easy encounter near: a few');assert.equal(universeReward(5,{onTime:true}),8);assert.equal(universeReward(5,{difficulty:2,x:km(60)}),30,'hard and far: many');
assert.equal(universeReward(4,{difficulty:1.5,x:km(60),rarity:3}),54,'a far legend: the most');assert.equal(universeReward(.1),1,'at least one');
assert.equal(activityReward('orchestra',0,0),10);assert.equal(activityReward('maze',0,0),20);assert.equal(activityReward('city',km(25),0),30);assert.equal(ACTIVITY_DIFFICULTY.maze,2);
assert.equal(mischiefReward('rain',0,0),4);assert.equal(mischiefReward('race',0,0),6);assert.equal(mischiefReward('rain',km(60),0),12);
console.log('PASS spark rules: on time ×2 in the free World, the streak breaks off time or after a pause, a level gives no sparks since H1 (a round gave 80–170 until then, kept for the curves); a loose spark 1 and 2 on time (no ×3); what appears pays base × difficulty × distance × rarity');
