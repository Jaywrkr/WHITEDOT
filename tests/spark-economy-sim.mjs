import assert from 'node:assert/strict';
import {simulate} from '../scripts/spark-economy.mjs';
// Plan F3: on time doubles what mining gives. E1 (Jay, 27 Oct 2026, «more sparks»): rounds 80–170 and living encounters
// while travelling bring the whole cube shop (prices unchanged) from 9.4 to about 7 hours for a casual player and from
// 7 to about 5.3 playing on time: more to buy, still a long collection. If prices or rules change, this fails until the
// numbers are reviewed.
const r=simulate();
assert(Math.abs(r.minePerMinute[2]/r.minePerMinute[1]-2)<.1&&Math.abs(r.minePerMinute[3]/r.minePerMinute[1]-3)<.15,JSON.stringify(r.minePerMinute));
const [casual,rhythm]=r.players;
assert(casual.shopHours>=6.5&&casual.shopHours<=7.5,JSON.stringify(casual));assert(rhythm.shopHours>=4.8&&rhythm.shopHours<casual.shopHours,JSON.stringify(rhythm));assert(casual.livePerMinute>0&&rhythm.livePerMinute>casual.livePerMinute);
console.log(`PASS spark economy: on time ×2/×3 mining, the cube shop (${r.shop} ✦) in ${casual.shopHours} h for a casual player and ${rhythm.shopHours} h playing on time`);
