import assert from 'node:assert/strict';import {createAutopilot} from '../src/autopilot.js';
const a=createAutopilot(),base={x:0,y:0,layer:'superficie',active:true,manual:false,paused:false,studio:false,speed:190};
a.start('wander','superficie');let v=a.vector(.05,base);assert(v&&Math.hypot(v.dx,v.dy)<=.4+.0001);
const seconds=a.state.seconds;assert.equal(a.vector(.05,{...base,paused:true}),null);assert.equal(a.state.seconds,seconds);assert.equal(a.state.mode,'wander');
a.vector(.05,{...base,manual:true});assert.equal(a.state.mode,null);
a.start('destination','superficie');const target={x:500,y:0,layer:'superficie'};v=a.vector(.05,{...base,target});assert(v.dx>0&&v.dy===0);
a.vector(.05,{...base,x:target.x-10,target});assert.equal(a.state.mode,null,'arrival did not stop');
a.start('destination','superficie');a.vector(.05,{...base,target:{...target,layer:'bajo'}});assert.equal(a.state.mode,null);
a.start('wander','superficie');a.vector(.05,{...base,active:false,studio:true});assert.equal(a.state.mode,'wander');assert(a.state.paused);a.vector(.05,{...base,active:false});assert.equal(a.state.mode,null);
a.start('wander','bajo');a.vector(.05,base);assert.equal(a.state.mode,null,'layer transition must stop');
a.start('destination','cielo');v=a.vector(.05,{...base,layer:'cielo',x:0,target:{x:31,y:0,layer:'cielo'}});assert(v.dx*190*6*.05<=11+.001,'sky overshot arrival');
console.log('PASS: opt-in slow travel, paused active clock, manual cancellation, arrival, layer transitions and sky speed limit');
const turns=createAutopilot(()=>.75);turns.start('wander','superficie',0);
for(let i=0;i<1900;i++)turns.vector(.05,base);
assert(turns.state.angle>.1,'wander never chose another direction');
const avoid=createAutopilot(()=>.5);avoid.start('wander','superficie',0);
for(let i=0;i<100;i++){
 const v=avoid.vector(.05,{...base,seaAhead:angle=>Math.cos(angle)>.8});
 if(v&&Math.hypot(v.dx,v.dy)>0)assert(Math.cos(avoid.state.angle)<=.8,'wander entered the sea during its turn');
}
assert(avoid.state.angle>.5,'wander failed to turn away from the sea');
