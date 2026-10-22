import assert from 'node:assert/strict';
import {journeyStep,gestureHint,advanceOpenChallenge} from '../src/creative.js';
import {discoveryJourney} from '../src/voice-guide.js';
const journey={ach:{oldReward:'2026-10-01'},house:{objects:[]}};assert.equal(discoveryJourney(journey).steps[0].id,'voice');assert.equal(discoveryJourney(journey).completed,0);
journey.voiceLearned={bajo:true};assert.equal(discoveryJourney(journey).completed,1);assert.match(discoveryJourney(journey).next,/Favoritos/);
journey.favorites={items:[{id:'saved'}]};assert.match(discoveryJourney(journey).next,/Refugio/);journey.house.objects.push({kind:'obj:origen'});assert.match(discoveryJourney(journey).next,/reliquia/);
journey.stars=[{id:'old-relic'}];assert.equal(discoveryJourney(journey).completed,4);assert.match(discoveryJourney(journey).next,/voz nueva/);assert.equal(journey.ach.oldReward,'2026-10-01','guidance never consumes progress');
assert.equal(journeyStep({}),0);assert.equal(journeyStep({world:true}),1);assert.equal(journeyStep({world:true,transformed:true}),2);assert.equal(journeyStep({studio:true,transformed:true}),3);
console.log('PASS: creative journey milestones');
assert.match(gestureHint("toy:rotor"),/girar/);assert.match(gestureHint("forma:test"),/escuchar/);
const challenge={};assert.equal(advanceOpenChallenge(challenge,"bass","touch"),false);assert.equal(advanceOpenChallenge(challenge,"bass","touch"),false);assert.equal(advanceOpenChallenge(challenge,"groove","subtract"),true);assert.equal(challenge.channels.length,2);

const {clueDirection}=await import('../src/clues.js');assert.equal(clueDirection(0,0,[]),null);assert.equal(clueDirection(0,0,[{x:30,y:40},{x:2,y:0,got:true}]).distance,50);
