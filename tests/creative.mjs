import assert from 'node:assert/strict';
import {journeyStep,gestureHint} from '../src/creative.js';
assert.equal(journeyStep({}),0);assert.equal(journeyStep({world:true}),1);assert.equal(journeyStep({world:true,transformed:true}),2);assert.equal(journeyStep({studio:true,transformed:true}),3);
console.log('PASS: creative journey milestones');
assert.match(gestureHint("toy:rotor"),/girar/);assert.match(gestureHint("forma:test"),/escuchar/);
