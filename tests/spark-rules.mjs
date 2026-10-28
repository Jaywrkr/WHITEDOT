import assert from 'node:assert/strict';
import {STREAK_TRIPLE,STREAK_FORGET_MS,rhythmMultiplier,nextStreak,ROUND_BASE,roundSparks,ECONOMY_BEFORE_E1,ECONOMY_BEFORE_H1,ACTIVITY_SPARKS,MISCHIEF_SPARKS,LEVEL_SPARKS,CRYSTAL_SPARK_SCALE} from '../src/spark-rules.js';
// Free World: off time ×1, on time ×2, from the eighth on time in a row ×3.
assert.equal(rhythmMultiplier(false,20),1,'off time keeps its base reward (K2)');assert.equal(rhythmMultiplier(true,1),2);assert.equal(rhythmMultiplier(true,STREAK_TRIPLE-1),2);assert.equal(rhythmMultiplier(true,STREAK_TRIPLE),3);
// The streak grows on time, breaks off time and is forgotten after a pause.
let s=0;for(let i=0;i<8;i++)s=nextStreak(s,true,500);assert.equal(s,8);assert.equal(nextStreak(s,false,500),0);assert.equal(nextStreak(s,true,STREAK_FORGET_MS+1),1);
// H1 (Jay, alpha.233): a level pays no sparks. What a round paid until then stays for the curves: 80 plus 9 per tenth on
// time (E1, up from 60 + 6); Maestro double; from the fourth round of the day, half.
assert.equal(LEVEL_SPARKS,0);assert.equal(ECONOMY_BEFORE_H1.roundBase,ROUND_BASE);assert.equal(ECONOMY_BEFORE_H1.roundPerTenth,9);
assert.equal(roundSparks(0),ROUND_BASE);assert.equal(ROUND_BASE,80);assert.equal(roundSparks(.85),152);assert.equal(roundSparks(1),170);assert.equal(roundSparks(.85,{maestro:true}),304);
assert.equal(roundSparks(.85,{roundsToday:2}),152);assert.equal(roundSparks(.85,{roundsToday:3}),76);assert.equal(roundSparks(NaN),80);assert.equal(roundSparks(2),170);
// The rules before E1 stay reachable for the curves: 60 + 6 per tenth.
assert.equal(roundSparks(.85,{base:ECONOMY_BEFORE_E1.roundBase,perTenth:ECONOMY_BEFORE_E1.roundPerTenth}),108);assert.equal(ACTIVITY_SPARKS,30);assert.equal(MISCHIEF_SPARKS,20);assert.equal(CRYSTAL_SPARK_SCALE,3);
assert.equal(ECONOMY_BEFORE_H1.activity,15);assert.equal(ECONOMY_BEFORE_H1.mischief,10);assert.equal(ECONOMY_BEFORE_H1.mine,1/3);
console.log('PASS spark rules: on time ×2 and ×3 from eight in a row in the free World, the streak breaks off time or after a pause, a level gives no sparks since H1 (a round gave 80–170 until then, kept for the curves); activities 30 and mischief 20 once per place; the crystals of the World ×3');
