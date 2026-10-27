// Panel 11 (Q5 · El golpe al oírse, Mizuguchi): a touch off the beat sounds on the next sixteenth at least 20 ms away
// (touchSlot), not on the next step still to be scheduled. A model of the music's scheduler (audio.js: a 25 ms timer,
// steps scheduled 120 ms ahead, the queue drained at most four per step) at 96 BPM, without output latency.
import assert from 'node:assert/strict';
import {touchSlot,TOUCH_LEAD,TOUCH_STEP_VOICES} from '../src/journey-pulse.js';

function model({bpm=96,taps=[],useSlot=true,until=8}){
  const SIX=60/bpm/4,sq=[],queue=[],stepVoices=new Map(),notes=[];let next=.1,step=0;
  const touch=at=>{const slot=useSlot?touchSlot(sq,at,stepVoices):null;if(!slot){queue.push(at);return;}stepVoices.set(slot.tick,(stepVoices.get(slot.tick)||0)+1);notes.push({at,t:slot.t,tick:slot.tick});};
  const playStep=t=>{sq.push({t,s:step%16,tick:step});if(sq.length>12)sq.shift();let n=0;while(queue.length&&n<TOUCH_STEP_VOICES){notes.push({at:queue.shift(),t,tick:step});n++;}if(n)stepVoices.set(step,n);};
  const sched=now=>{while(next<now+.12){playStep(next);next+=SIX;step++;}};
  const pending=[...taps].sort((a,b)=>a-b);
  for(let now=0;now<until;now+=.025){while(pending.length&&pending[0]<now+.025){const at=pending.shift();sched(Math.max(now,at-.025));touch(at);}sched(now);}
  return {notes,SIX};
}
const pct=(v,p)=>{const s=[...v].sort((a,b)=>a-b);return s[Math.min(s.length-1,Math.ceil(s.length*p)-1)];};

// Single taps spread over every phase of the grid (a golden-ratio walk), one every 0.7 s.
const taps=Array.from({length:200},(_,i)=>1+i*.7+((i*.618034)%1)*.01);
const now=model({taps,until:150}),old=model({taps,useSlot:false,until:150});
const lag=r=>r.notes.map(n=>(n.t-n.at)*1000);
const lagNew=lag(now),lagOld=lag(old);
assert.equal(lagNew.length,taps.length,'every touch sounds');
assert(Math.min(...lagNew)>=TOUCH_LEAD*1000-1e-6,'never sooner than 20 ms: the step must still be ahead of the clock');
const median=pct(lagNew,.5),p95=pct(lagNew,.95);
assert(median<=100,`touch to note: median ${median.toFixed(1)} ms (≤ 100)`);
assert(p95<=180,`touch to note: p95 ${p95.toFixed(1)} ms (≤ 180)`);
assert(pct(lagOld,.5)>median+50,'the old queue waited much longer');
// The note falls on the grid: a sixteenth of the music's own steps.
for(const n of now.notes)assert(Math.abs(((n.t-.1)/now.SIX)-Math.round((n.t-.1)/now.SIX))<1e-6,'on a sixteenth');

// A runaway finger: twenty touches 10 ms apart never put more than four voices on one step.
const flurry=model({taps:Array.from({length:20},(_,i)=>2+i*.01),until:5}),per=new Map();
for(const n of flurry.notes)per.set(n.tick,(per.get(n.tick)||0)+1);
assert.equal(flurry.notes.length,20,'all of them sound');
assert(Math.max(...per.values())<=TOUCH_STEP_VOICES,'at most four voices per step');

// touchSlot itself: the first scheduled step ≥ 20 ms ahead with room; null when there is none.
const sq=[{t:1,tick:10},{t:1.015,tick:11},{t:1.03,tick:12},{t:1.045,tick:13}];
assert.equal(touchSlot(sq,1,new Map()).tick,12);
assert.equal(touchSlot(sq,1,new Map([[12,4]])).tick,13,'a full step passes to the next');
assert.equal(touchSlot(sq,1.04,new Map()),null,'none far enough: the touch waits in the queue');
assert.equal(touchSlot([],1,new Map()),null);assert.equal(touchSlot(null,1),null);
console.log(`PASS touch timing (Q5): at 96 BPM a touch off the beat sounds on the next sixteenth ≥ 20 ms away, median ${median.toFixed(0)} ms and p95 ${p95.toFixed(0)} ms (before ${pct(lagOld,.5).toFixed(0)} and ${pct(lagOld,.95).toFixed(0)}), at most four voices per step`);
