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

const {formationOffset}=await import('../src/wow-model.js');
const positions=Array.from({length:24},(_,i)=>formationOffset(i,3));
assert.equal(new Set(positions.map(p=>[p.x.toFixed(2),p.y.toFixed(2)].join(','))).size,24);
assert(positions.every(p=>Math.hypot(p.x,p.y)>=31.99&&Math.hypot(p.x,p.y)<=74.01));

const {cometStyle}=await import('../src/wow-model.js');
for(let h=0;h<100;h++){let previous=-1;for(let i=0;i<=100;i++){const c=cometStyle(h*1057,i/100);assert(c.progress>=previous&&c.progress<=1.00001);previous=c.progress;assert(c.tail>=22&&c.tail<=56);}}

const {cloudBreath}=await import('../src/wow-model.js');
for(let i=0;i<300;i++){const b=cloudBreath({phase:1},i);assert(b.light>=.79999&&b.light<=1&&b.scale>=.97499&&b.scale<=1.02501);}
assert.deepEqual(cloudBreath({phase:1},400,true),{light:.9,scale:1});
