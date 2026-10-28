import assert from 'node:assert/strict';
import {simulate} from '../scripts/spark-economy.mjs';
// Plan F3: on time doubles what mining gives. E1 (Jay, 27 Oct 2026, «more sparks»): rounds 80–170 and living encounters
// while travelling bring the whole cube shop (prices unchanged) from 9.4 to about 7 hours for a casual player and from
// 7 to about 5.3 playing on time: more to buy, still a long collection. If prices or rules change, this fails until the
// numbers are reviewed.
const r=simulate();
assert(Math.abs(r.minePerMinute[2]/r.minePerMinute[1]-2)<.1&&Math.abs(r.minePerMinute[3]/r.minePerMinute[1]-3)<.15,JSON.stringify(r.minePerMinute));
// H1 (Jay, alpha.233): the places pay no sparks; the World pays more (crystals ×3, encounters 30/45). With half the time
// in places the shop is not slower than in alpha.231 (6.9 and 5.2 h) and not given away: still hours, about 5.6 and 3.8.
const [casual,rhythm]=r.players,[casualBefore,rhythmBefore]=simulate({before:true}).players;
assert.equal(casualBefore.shopHours,6.9);assert.equal(rhythmBefore.shopHours,5.2);assert(r.players.every(p=>p.placesPerMinute===0));
assert(casual.shopHours>=5&&casual.shopHours<=casualBefore.shopHours,JSON.stringify(casual));assert(rhythm.shopHours>=3.5&&rhythm.shopHours<casual.shopHours&&rhythm.shopHours<=rhythmBefore.shopHours,JSON.stringify(rhythm));assert(casual.livePerMinute>0&&rhythm.livePerMinute>casual.livePerMinute);
console.log(`PASS spark economy: on time ×2/×3 mining, no sparks in the places (H1), the cube shop (${r.shop} ✦) in ${casual.shopHours} h for a casual player and ${rhythm.shopHours} h playing on time`);
