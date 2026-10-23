import assert from 'node:assert/strict';
import {edgePoint,MOMENT_GUIDE_AFTER} from '../src/journey-moments.js';
// The edge light for a chapter's moment out of sight: none while it is on screen, at the edge in its direction otherwise.
assert.equal(edgePoint(100,50,390,844),null);const right=edgePoint(700,0,390,844);assert(right.x>360&&Math.abs(right.y-422)<1);
const up=edgePoint(0,-2000,390,844);assert.equal(up.y,70,'clear of the counters');const down=edgePoint(0,2000,390,844);assert.equal(down.y,724,'clear of the Line');
assert(MOMENT_GUIDE_AFTER>=15000,'only after a while');
console.log('PASS moment guide: a faint edge light toward the lighthouse or the lotuses when out of sight, clear of counters and Line');
