import assert from 'node:assert/strict';
import {initialize,pulseNoteTime,landDelay} from '../src/journey-pulse.js';
const original={set:setTimeout,clear:clearTimeout,now:performance.now.bind(performance),doc:globalThis.document};let clock=1000,next=0;const timers=new Map();
performance.now=()=>clock;globalThis.setTimeout=(f,ms)=>{timers.set(++next,{f,at:clock+ms});return next;};globalThis.clearTimeout=id=>timers.delete(id);globalThis.document={hidden:false,querySelectorAll:()=>[]};
const flush=at=>{clock=at;for(const [id,t] of [...timers])if(t.at<=clock){timers.delete(id);t.f();}};
try{
 for(const latency of [0,.05,.18,.4]){
  timers.clear();clock=1000;const r={S:{mode:'world',sound:true,reducedMotion:true},MU:{bq:[10],sq:[{s:0,t:10}]},SIX:.125,ac:{currentTime:10+latency,outputLatency:latency,state:'running'},BIOMES:[],inWorld:()=>true,cubeGlow:0};initialize(r);
  assert(r.journeyPulse());const emitted=pulseNoteTime(r.ac.currentTime,10);r.journeyPulseScheduled(emitted);const delay=Math.round((.01+latency)*1000);assert.equal(r.journeyPulseState().landIn,delay);
  flush(1000+delay-1);assert.equal(r.cubeGlow,0,'never before the emitted note reaches the output');flush(1000+delay);assert.equal(r.cubeGlow,1);assert.equal(r.cubeKick,0,'reduced motion kept');
  clock+=500;r.ac.currentTime+=.5;r.MU.bq=[r.ac.currentTime-latency];r.cubeGlow=0;assert(r.journeyPulse());r.journeyPulseReset();flush(clock+500);assert.equal(r.cubeGlow,0,'old chapter callbacks canceled');
  clock+=500;r.ac.currentTime+=.5;r.MU.bq=[r.ac.currentTime-latency];assert(r.journeyPulse());const due=clock+r.journeyPulseState().landIn;globalThis.document.hidden=true;flush(due);assert.equal(r.cubeGlow,0,'hidden tab does not flash');globalThis.document.hidden=false;
 }
 assert.equal(landDelay(1,1,.4),400);assert.equal(landDelay(NaN,0,0),0);
 // The extraction of note time preserves the exact former sound-scheduling expression.
 for(const now of [0,10,100])for(const beat of [null,NaN,-1,0,10,100,110])assert.equal(pulseNoteTime(now,beat),Math.max(now+.01,Number.isFinite(beat)&&beat>now?beat:0));
 console.log('PASS emitted-note visual timing at 0–400ms, no early landing, reset/background cancellation and unchanged audio scheduling');
}finally{globalThis.setTimeout=original.set;globalThis.clearTimeout=original.clear;performance.now=original.now;globalThis.document=original.doc;}
// One reference for scheduled world cues; calibration does not shift the audible clock.
const {audibleTime}=await import('../src/journey-pulse.js');
assert.equal(audibleTime({currentTime:10,outputLatency:.18}),9.82);
assert.equal(audibleTime({currentTime:10,outputLatency:NaN,baseLatency:.02}),9.98);
const oldDoc=globalThis.document;globalThis.document={querySelectorAll:()=>[]};
try {const r={S:{mode:'world',sound:false},MU:{},inWorld:()=>true,journeyGamePulse:()=> 'wait',cubeGlow:0};initialize(r);assert(r.journeyPulse());assert.equal(r.journeyPulseState().action,'wait');assert.equal(r.cubeGlow,0,'a valid musical pulse waiting for the rule never announces progress');}finally{globalThis.document=oldDoc;}
