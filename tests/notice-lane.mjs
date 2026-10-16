import assert from 'node:assert/strict';
import {createNoticeLane,installNoticeLane} from '../src/notice-lane.js';
const lane=createNoticeLane();lane.request('voice');lane.request('card');lane.request('voice');
assert.deepEqual(lane.pending,['voice','card']);assert(!lane.claim('card'));assert(lane.claim('voice'));assert(lane.claim('voice'));
lane.release('voice');assert.equal(lane.owner,null);assert.equal(lane.exiting,'voice');assert(!lane.claim('card'));
lane.tick(NaN);lane.tick(-3);assert(!lane.claim('card'));for(let i=0;i<3;i++)lane.tick(.1);assert(!lane.claim('card'));lane.tick(.1);assert(lane.claim('card'));
lane.request('toast');lane.cancel('toast');assert.deepEqual(lane.pending,[]);lane.cancel('card');assert.equal(lane.exiting,'card');lane.clear();assert(lane.claim('next'));
console.log('PASS notice ownership, FIFO, duplicate tickets, exit interval, cancellation and reset');

// Collection/migration logic can be used without a DOM. Never start a UI timer there.
const originalInterval=globalThis.setInterval;let intervals=0;globalThis.setInterval=()=>{intervals++;return 1;};
try{const headless={S:{}};installNoticeLane(headless);assert.equal(intervals,0);assert(headless.noticeLane.blocked());assert.equal(headless.noticeLane.inspecting,false);}finally{globalThis.setInterval=originalInterval;}
console.log('PASS headless collection installs no UI timer; Node runtimes cannot race a missing document');
const priority=createNoticeLane();priority.request('routine',{level:1});priority.request('useful',{level:2});priority.request('finding',{level:3});assert(!priority.claim('routine'));assert(!priority.claim('useful'));assert(priority.claim('finding'));priority.request('another',{level:3});assert.equal(priority.owner,'finding','important arrivals never interrupt an open card');priority.release('finding');for(let i=0;i<4;i++)priority.tick(.1);assert(priority.claim('another'));priority.cancel('another');for(let i=0;i<4;i++)priority.tick(.1);assert(priority.claim('useful'));priority.clear();assert.deepEqual(priority.pending,[]);
console.log('PASS priority reserves the next slot for exceptional findings without interrupting the current reader');
// Recording must remain stoppable while a finding is queued.
const doc=globalThis.document;globalThis.document={hidden:false,querySelector:()=>null};
try{
 const r={S:{}};globalThis.setInterval=()=>0;const notices=installNoticeLane(r);
 assert(!notices.blocked());r.setRecording=true;assert(notices.blocked());assert(!notices.claim('rare',{level:3}));
 r.setRecording=false;r.jam={loop:{armed:true,rec:false}};assert(notices.blocked());r.jam.loop.armed=false;r.jam.loop.rec=true;assert(notices.blocked());
 r.jam.loop.rec=false;assert(notices.claim('rare'));assert.equal(notices.owner,'rare');
}finally{globalThis.document=doc;globalThis.setInterval=originalInterval;}
console.log('PASS queued cards cannot cover active or armed recording controls');
