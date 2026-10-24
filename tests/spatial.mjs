import assert from 'node:assert/strict';
import {proximityGain,chooseNearbySource,directionPan,initialize} from '../src/spatial.js';
import {initialize as effects} from '../src/effects.js';
const source={x:0,y:0};let previous=1;
for(let d=0;d<=400;d++){const gain=proximityGain(source,d,0);assert(gain<=previous&&gain>=0&&gain<=1);previous=gain;}
assert.equal(proximityGain(source,180,0),.5);assert.equal(proximityGain(source,360,0),0);assert.equal(proximityGain(null,100,0),1);
const near={x:20,y:0,snd(){}},far={x:270,y:0,snd(){}},outside={x:1000,y:0,snd(){}};
let close=0;for(let i=0;i<1000;i++)close+=chooseNearbySource([near,far,outside],0,0,()=>i/1000)===near?1:0;
assert(close>850);assert.equal(chooseNearbySource([outside],0,0,()=>.5),null);
const nodes=[];function param(){return {value:0,targets:[],setValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(value,time,tau){assert(Number.isFinite(value)&&value>=0&&value<=1);assert.equal(tau,.12);this.targets.push(value);}};}
function node(){const n={gain:param(),frequency:param(),delayTime:param(),Q:param(),disconnects:0,connect(target){return target;},disconnect(){this.disconnects++;}};nodes.push(n);return n;}
let world=true;const r={S:{sound:true,wx:180,wy:0},ac:{currentTime:1,state:'running',createGain:node,createDelay:node,createBiquadFilter:node},inWorld:()=>world,bus:node(),verbIn:node(),dsend:node(),SIX:.125,seedOf:()=>1,rng:()=>()=>.5};
initialize(r);effects(r);const original=[r.bus,r.verbIn,r.dsend];let local;
r.withSpatialVoice(source,1.1,()=>{local=[r.bus,r.verbIn,r.dsend];assert(local.every(n=>n.gain.value===.5));r.withVoiceEffect('object',{key:'0,0'},{role:'lead'},1.1,()=>assert.notEqual(r.bus,local[0]));assert.equal(r.bus,local[0]);});
assert.deepEqual([r.bus,r.verbIn,r.dsend],original);
r.S.wx=0;r.spatialTick();assert(local.every(n=>n.gain.targets.at(-1)===1));
source.x=360;r.spatialTick();assert(local.every(n=>n.gain.targets.at(-1)===0));source.x=0;
world=false;r.spatialTick();world=true;
assert.throws(()=>r.withSpatialVoice(source,1.2,()=>{throw Error('failed synth');}));assert.deepEqual([r.bus,r.verbIn,r.dsend],original);
for(let i=0;i<100;i++)r.withSpatialVoice(source,1.2,()=>{});assert.equal(r.activeSpatialCount,32);
r.S.wx=180;let fallback;r.withSpatialVoice(source,1.2,gain=>fallback=gain);assert.equal(fallback,.5);
r.ac.currentTime=4.3;r.spatialTick();assert.equal(r.activeSpatialCount,0);assert(local.every(n=>n.disconnects===1));
r.S.sound=false;r.withSpatialVoice(source,5,gain=>assert.equal(gain,.5));assert.equal(r.activeSpatialCount,0);
// Plan H6: a source to the right is heard on the right, never fully in one ear; straight ahead or behind, centred.
assert.equal(directionPan({x:0,y:-500},0,0),0);assert(directionPan({x:300,y:0},0,0)>0&&directionPan({x:-300,y:0},0,0)<0);assert.equal(directionPan({x:5000,y:0},0,0),.85);assert.equal(directionPan({x:-5000,y:0},0,0),-.85);assert.equal(directionPan(null,0,0),0);
{const panners=[];r.ac.createStereoPanner=()=>{const p={pan:{value:0},connect(t){p.to=t;return t;},disconnect(){p.off=true;}};panners.push(p);return p;};const before=r.bus;let inside;
 r.withPan(.5,()=>{inside=r.bus;});assert.equal(panners.length,1);assert.equal(inside,panners[0]);assert.equal(panners[0].pan.value,.5);assert.equal(panners[0].to,before);assert.equal(r.bus,before);
 r.withPan(0,()=>{inside=r.bus;});assert.equal(inside,before);assert.equal(panners.length,1,'centred voices need no panner');
 assert.throws(()=>r.withPan(-.4,()=>{throw Error('x');}));assert.equal(r.bus,before);}
console.log('PASS: direction pans left and right and routes through a panner; smooth distance curve, nearby selection, live moving-source gain, effect isolation, bounded routing and cleanup');
