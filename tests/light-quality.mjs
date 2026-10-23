import assert from 'node:assert/strict';
import {thinRects} from '../src/universe-layers.js';
import {frameStats,MEASURE_FRAMES} from '../src/frame-quality.js';
// Light quality (phase 4 of the plan): while a layer draws, every other point is skipped, always the same ones, and the
// context is put back afterwards.
const drawn=[],c={fillRect(x){drawn.push(x);}},own=c.fillRect;const back=thinRects(c);for(let i=0;i<10;i++)c.fillRect(i);back();
assert.deepEqual(drawn,[0,2,4,6,8]);assert.equal(c.fillRect,own,'restored');drawn.length=0;const again=thinRects(c);for(let i=0;i<10;i++)c.fillRect(i);again();assert.deepEqual(drawn,[0,2,4,6,8],'the same points every frame');
// Frame times for measuring on a phone: median and 95th percentile, pauses ignored.
assert.deepEqual(frameStats([]),{n:0,p50:0,p95:0});const s=frameStats([...Array(95).fill(16),...Array(5).fill(40),5000]);assert.equal(s.n,100);assert.equal(s.p50,16);assert.equal(s.p95,40);assert.equal(MEASURE_FRAMES,300);
console.log('PASS light quality: half the points of a layer, the same ones each frame, context restored; frame median and 95th percentile ignore pauses');
