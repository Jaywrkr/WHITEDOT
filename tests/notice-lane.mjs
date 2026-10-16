import assert from 'node:assert/strict';
import {createNoticeLane} from '../src/notice-lane.js';
const lane=createNoticeLane();lane.request('voice');lane.request('card');lane.request('voice');
assert.deepEqual(lane.pending,['voice','card']);assert(!lane.claim('card'));assert(lane.claim('voice'));assert(lane.claim('voice'));
lane.release('voice');assert.equal(lane.owner,null);assert.equal(lane.exiting,'voice');assert(!lane.claim('card'));
lane.tick(NaN);lane.tick(-3);assert(!lane.claim('card'));for(let i=0;i<3;i++)lane.tick(.1);assert(!lane.claim('card'));lane.tick(.1);assert(lane.claim('card'));
lane.request('toast');lane.cancel('toast');assert.deepEqual(lane.pending,[]);lane.cancel('card');assert.equal(lane.exiting,'card');lane.clear();assert(lane.claim('next'));
console.log('PASS notice ownership, FIFO, duplicate tickets, exit interval, cancellation and reset');
