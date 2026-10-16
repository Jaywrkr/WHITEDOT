import assert from 'node:assert/strict';
import {createMotion} from '../src/wow-model.js';
const m=createMotion();m.step(0,0,.02);
assert(m.step(3,0,.02).started);assert(m.pose().x>1);
for(let i=0;i<50;i++)m.step(3,0,.02);
assert(Math.abs(m.pose().x-1)<.001);
m.step(3,5,.02);assert(m.pose().x>1);
assert.equal(m.pose(true).x,1);
m.step(999,999,.02);assert.equal(m.pose().x,1,'teleport does not stretch');
m.step(1000,999,.02,true);assert.equal(m.pose().x,1,'modal pauses effects');
m.reset();assert(!m.step(500,800,.02).started,'first frame is not movement');
console.log('PASS visual motion: starts, decay, reduced motion, teleport and modal guards');

const {lookVector}=await import('../src/wow-model.js');
for(const [x,y]of [[0,0],[1,0],[-40,800],[NaN,1]]){const eye=lookVector(x,y);assert(Number.isFinite(eye.x)&&Math.hypot(eye.x,eye.y)<=1.40001);}
assert.deepEqual(lookVector(20,30,true),{x:0,y:0});

const {greetingPose}=await import('../src/wow-model.js');
assert(greetingPose(0,.25).turn>0);assert(greetingPose(2,.25).lift<0);
for(const k of [0,1,2]){assert.deepEqual(greetingPose(k,3),{turn:0,lift:0});assert.deepEqual(greetingPose(k,-1),{turn:0,lift:0});}
