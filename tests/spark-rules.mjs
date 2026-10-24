import assert from 'node:assert/strict';
import {STREAK_TRIPLE,STREAK_FORGET_MS,rhythmMultiplier,nextStreak,ROUND_BASE,roundSparks} from '../src/spark-rules.js';
// Free World: off time ×1, on time ×2, from the eighth on time in a row ×3.
assert.equal(rhythmMultiplier(false,20),0,'off time earns nothing (plan H5)');assert.equal(rhythmMultiplier(true,1),2);assert.equal(rhythmMultiplier(true,STREAK_TRIPLE-1),2);assert.equal(rhythmMultiplier(true,STREAK_TRIPLE),3);
// The streak grows on time, breaks off time and is forgotten after a pause.
let s=0;for(let i=0;i<8;i++)s=nextStreak(s,true,500);assert.equal(s,8);assert.equal(nextStreak(s,false,500),0);assert.equal(nextStreak(s,true,STREAK_FORGET_MS+1),1);
// A round in a place: 60 plus 6 per tenth on time; Maestro double; from the fourth round of the day, half.
assert.equal(roundSparks(0),ROUND_BASE);assert.equal(roundSparks(.85),108);assert.equal(roundSparks(1),120);assert.equal(roundSparks(.85,{maestro:true}),216);
assert.equal(roundSparks(.85,{roundsToday:2}),108);assert.equal(roundSparks(.85,{roundsToday:3}),54);assert.equal(roundSparks(NaN),60);assert.equal(roundSparks(2),120);
console.log('PASS spark rules: on time ×2 and ×3 from eight in a row in the free World, the streak breaks off time or after a pause, a round gives 60–120 (Maestro double, half from the fourth of the day)');
