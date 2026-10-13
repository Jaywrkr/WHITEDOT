import assert from 'node:assert/strict';
import {journeyStep,gestureHint,advanceOpenChallenge} from '../src/creative.js';
assert.equal(journeyStep({}),0);assert.equal(journeyStep({world:true}),1);assert.equal(journeyStep({world:true,transformed:true}),2);assert.equal(journeyStep({studio:true,transformed:true}),3);
console.log('PASS: creative journey milestones');
assert.match(gestureHint("toy:rotor"),/girar/);assert.match(gestureHint("forma:test"),/escuchar/);
const challenge={};assert.equal(advanceOpenChallenge(challenge,"bass","touch"),false);assert.equal(advanceOpenChallenge(challenge,"bass","touch"),false);assert.equal(advanceOpenChallenge(challenge,"groove","subtract"),true);assert.equal(challenge.channels.length,2);

const {clueDirection}=await import('../src/clues.js');assert.equal(clueDirection(0,0,[]),null);assert.equal(clueDirection(0,0,[{x:30,y:40},{x:2,y:0,got:true}]).distance,50);
