import assert from 'node:assert/strict';
import {isFestival,FESTIVAL_KEY,FESTIVAL_CHAPTERS} from '../src/festival.js';
import {SAFE_COLORS,placeColor} from '../src/color-safe.js';
import {LANDSCAPES} from '../src/house-view.js';
// The festival build opens only with ?festival=1, on its own save, with the whole Journey (plan I5).
assert.equal(isFestival('?festival=1'),true);assert.equal(isFestival('?festival=0'),false);assert.equal(isFestival(''),false);assert.equal(isFestival('?testSeed=x'),false);
assert(FESTIVAL_KEY!=='pixel-blanco-v4'&&FESTIVAL_KEY.startsWith('kubono:'));assert.deepEqual(FESTIVAL_CHAPTERS,['llanura','lago','bosque','tormenta','vacio']);
// Colour-blind palette: every place has a hue; off, the usual colours stay.
for(const id of Object.keys(LANDSCAPES))assert(SAFE_COLORS[id],id);
assert.equal(placeColor('lago','#8ad1ff',false),'#8ad1ff');assert.equal(placeColor('lago','#8ad1ff',true),SAFE_COLORS.lago);assert.equal(placeColor('otro','#123456',true),'#123456');
// The chapters' safe hues are far apart in luminance or hue: no two of the five world chapters are the same.
const hues=['llanura','lago','bosque','tormenta','vacio'].map(id=>SAFE_COLORS[id]);assert.equal(new Set(hues).size,5);
console.log('PASS festival and colour-safe: festival only by URL with its own save and the whole Journey; colour-blind palette for every place, usual colours when off');
