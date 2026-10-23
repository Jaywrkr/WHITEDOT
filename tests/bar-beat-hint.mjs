import assert from 'node:assert/strict';
import {barBeat,BAR_HINT_AFTER} from '../src/bar-beat-hint.js';
// Before the sound, the bar beats at 120 BPM: bright on the beat, dark in the second half.
assert.equal(barBeat(0),1);assert.equal(barBeat(500),1);assert(barBeat(125)>.4&&barBeat(125)<.6);assert.equal(barBeat(300),0);assert.equal(BAR_HINT_AFTER,5000);
console.log('PASS bar beat hint: the bar beats on the beat at 120 BPM before the sound, after five seconds without a pulse');
