import assert from 'node:assert/strict';
import {lightOfHour,realNight} from '../src/world-light-model.js';
// Noon is clear, midnight dark but never black, and the player's real night deepens it a little.
const noon=lightOfHour(1,true,12),midnight=lightOfHour(0,false,12),lateNight=lightOfHour(0,false,2);
assert.equal(noon.darkness,0);assert.equal(noon.fireflies,0);assert.equal(noon.dawn+noon.dusk,0);
assert(midnight.darkness>.35&&midnight.darkness<=.5);assert(midnight.fireflies>=10);assert(midnight.stars>noon.stars);
assert(lateNight.darkness>=midnight.darkness);assert.equal(realNight(13),0);assert.equal(realNight(2),1);assert(realNight(21)>0&&realNight(21)<1);
// Dawn and dusk tint only around the middle of the cycle, and only one at a time.
const dawn=lightOfHour(.5,true),dusk=lightOfHour(.5,false);assert(dawn.dawn>.9&&dawn.dusk===0);assert(dusk.dusk>.9&&dusk.dawn===0);
assert.equal(lightOfHour(.95,true).dawn,0);
// Bad input falls back to daylight.
assert.deepEqual(lightOfHour(NaN,true),noon);
console.log('PASS world light: noon clear, night dark with lantern, real night deeper, single dawn or dusk tint, safe fallback');
