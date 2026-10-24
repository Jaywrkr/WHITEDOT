import assert from 'node:assert/strict';
import {curve,simulate,PROFILES,HORIZON,NOVELTY_GAP} from '../scripts/play-curve.mjs';
import {TOTAL_STARS} from '../src/places.js';
// Plan H7: the model is deterministic, plays the Journey first and the places in order.
const all=curve(),again=curve();assert.deepEqual(all.map(({events,...r})=>r),again.map(({events,...r})=>r));assert.equal(all.length,PROFILES.length);
for(const r of all){const kinds=r.events.map(e=>e.kind);assert.equal(kinds.slice(0,7).join(),'viaje,viaje,viaje,viaje,viaje,viaje,viaje');
 const order=r.events.filter(e=>e.kind==='lugar').map(e=>e.what);assert.deepEqual(order,['jardin','dunas','cristales','faros','ruinas','cueva']);
 // Everyone wins (the eleven places) within the first hour, and never waits more than 12 minutes for something new.
 assert(r.won&&r.won<60,r);assert(r.rule,`${r.id}: ${r.longestGap} min without a novelty`);assert(r.events.every(e=>e.t<=HORIZON));}
// The 90 % player gets all 33 ★ within the two hours and the song keeps growing.
const best=all.find(r=>r.id==='90');assert.equal(best.stars120,TOTAL_STARS);assert(best.songRule);
// Today a 75 % player's song stops growing after the win (★★ asks 85 %); asking 75 % would keep it under 12 minutes.
const mid=all.find(r=>r.id==='75');assert(!mid.songRule&&mid.songGap>NOVELTY_GAP);assert(simulate(PROFILES[1],{rhythmStar:.75,maestroStar:.7}).songRule);
console.log(`PASS play curve: three players, the Journey then the places in order, the win before an hour, a novelty every ${NOVELTY_GAP} min at most; the 75 % song wall after the win is measured`);
