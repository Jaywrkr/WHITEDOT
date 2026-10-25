import assert from 'node:assert/strict';
import {curve,simulate,PROFILES,HORIZON,NOVELTY_GAP} from '../scripts/play-curve.mjs';
import {TOTAL_STARS} from '../src/places.js';
// Plan H7: the model is deterministic, plays the Journey first and the places in order.
const all=curve(),again=curve();assert.deepEqual(all.map(({events,...r})=>r),again.map(({events,...r})=>r));assert.equal(all.length,PROFILES.length);
for(const r of all){const kinds=r.events.map(e=>e.kind);assert.equal(kinds.slice(0,7).join(),'viaje,viaje,viaje,viaje,viaje,viaje,viaje');
 const order=r.events.filter(e=>e.kind==='lugar').map(e=>e.what);assert.deepEqual(order,['jardin','dunas','cristales','faros','ruinas','cueva']);
 // Everyone wins (the eleven places) within the first hour.
 assert(r.won&&r.won<60,r);assert.equal(r.interestMeasured,false);assert(r.completedInterpretations>0);assert(r.interpretationGap<=r.songGap);assert(r.events.every(e=>e.t<=HORIZON));
 // Plan I6: the rule counts only what grows the song; pieces bought are reported apart and never pass it.
 assert.equal(r.rule,r.songGap<=NOVELTY_GAP);assert(r.withPurchasesGap<=r.songGap);assert.equal(r.quitAt===null,r.rule);}
const by=id=>all.find(r=>r.id===id);
// The 90 % player gets all 33 ★ within the two hours; the 75 % player's song keeps growing (★★ at 75 %, plan I5).
assert.equal(by('90').stars120,TOTAL_STARS);assert(by('90').rule);assert(by('75').rule,`75 %: ${by('75').songGap} min`);
assert(!simulate(PROFILES[1],{rhythmStar:.85,maestroStar:.8}).rule,'with the old 85 % the 75 % player stopped after the win');
// Measured, not hidden: the 60 % player and the player without sound get no ★★, so their song stops after the win
// and the model marks the risk of leaving there.
for(const id of ['60','sin sonido']){const r=by(id);assert(!r.rule);assert.equal(r.quitAt,r.songGapFrom);assert(Math.abs(r.quitAt-r.won)<1);}
assert.equal(by('sin sonido').stars120,11,'without sound only ★');
console.log(`PASS play curve: four players, the Journey then the places in order, the win before an hour; the ${NOVELTY_GAP}-minute rule counts only what grows the song (not purchases); 75 and 90 % keep growing, 60 % and no sound stop after the win and the risk of leaving is marked there`);
