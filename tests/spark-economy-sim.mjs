import assert from 'node:assert/strict';
import {simulate} from '../scripts/spark-economy.mjs';
// Plan F3: on time doubles what mining gives, and the whole cube shop takes a casual player under ten hours and one
// who plays on time about seven (docs/MUNDO.md). If prices or rules change, this fails until the numbers are reviewed.
const r=simulate();
assert(Math.abs(r.minePerMinute[2]/r.minePerMinute[1]-2)<.1&&Math.abs(r.minePerMinute[3]/r.minePerMinute[1]-3)<.15,JSON.stringify(r.minePerMinute));
const [casual,rhythm]=r.players;
assert(casual.shopHours>=8&&casual.shopHours<=10.5,JSON.stringify(casual));assert(rhythm.shopHours>=6&&rhythm.shopHours<casual.shopHours,JSON.stringify(rhythm));
console.log(`PASS spark economy: on time ×2/×3 mining, the cube shop (${r.shop} ✦) in ${casual.shopHours} h for a casual player and ${rhythm.shopHours} h playing on time`);
