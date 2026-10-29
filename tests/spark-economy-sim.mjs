import assert from 'node:assert/strict';
import {simulate} from '../scripts/spark-economy.mjs';
// Plan F3: on time doubles what mining gives. E1 (Jay, 27 Oct 2026, «more sparks»): rounds 80–170 and living encounters
// while travelling bring the whole cube shop (prices unchanged) from 9.4 to about 7 hours for a casual player and from
// 7 to about 5.3 playing on time: more to buy, still a long collection. If prices or rules change, this fails until the
// numbers are reviewed.
const r=simulate();
// H1 (Jay): on time ×2, and no ×3 any more.
assert(Math.abs(r.minePerMinute[2]/r.minePerMinute[1]-2)<.1&&r.minePerMinute[3]===r.minePerMinute[2],JSON.stringify(r.minePerMinute));
// H1 (Jay, alpha.233): the places pay no sparks, and the open universe is not inflated (a loose spark 1, 2 on time;
// what appears pays by difficulty, distance and rarity). With half the time in places the shop takes much longer than in
// alpha.231 (6.9 and 5.2 h): reported to Jay, prices unchanged.
const [casual,rhythm]=r.players,[casualBefore,rhythmBefore]=simulate({before:true}).players;
assert(Math.abs(casualBefore.shopHours-6.9)<=.1);assert(Math.abs(rhythmBefore.shopHours-5.2)<=.1);assert(r.players.every(p=>p.placesPerMinute===0));
assert(casual.shopHours>casualBefore.shopHours*2,JSON.stringify(casual));assert(rhythm.shopHours<casual.shopHours&&rhythm.shopHours>rhythmBefore.shopHours*2,JSON.stringify(rhythm));assert(casual.livePerMinute>0&&rhythm.livePerMinute>casual.livePerMinute);
console.log(`PASS spark economy: on time ×2 mining, no sparks in the places and no inflation (H1), the cube shop (${r.shop} ✦) in ${casual.shopHours} h for a casual player and ${rhythm.shopHours} h playing on time`);
