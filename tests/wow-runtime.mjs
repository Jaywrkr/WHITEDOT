import assert from 'node:assert/strict';
import {initialize} from '../src/wow-feel.js';
globalThis.document={hidden:false,querySelector:()=>null};globalThis.matchMedia=()=>({matches:false});
const source={x:20,y:0},neighbor={x:42,y:0},s={wx:0,wy:0,layer:'superficie',sound:true},calls=[];
const c=new Proxy({globalAlpha:1},{get:(o,k)=>k in o?o[k]:(...a)=>calls.push([k,...a]),set:(o,k,v)=>(o[k]=v,true)});
const r={S:s,cx:c,W:390,H:844,camX:0,camY:0,ac:{currentTime:0},inWorld:()=>true,$:()=>null,MU:{near:[source,neighbor]},seedOf:()=>1,musicInk:()=> '#88bbdd',playVoice:()=>assert.fail('visual feedback must not create audio')};
initialize(r);r.wowTick(.02);r.wowSoundCue(source,'perc',1);
r.wowTick(.02);assert.equal(r.wowState.pending,1);assert.equal(r.wowState.ripples,0,'no early note lights');
r.ac.currentTime=1;r.wowTick(.02);assert(r.wowState.ripples>0);assert.equal(r.wowState.flashes,1);
for(let i=0;i<100;i++)r.wowSoundCue(source,'bajo',2);assert.equal(r.wowState.pending,16);
r.drawWowWorld();assert(calls.length);
s.wx=1000;r.wowTick(.02);assert.equal(r.wowState.pending,0,'jumps clear queued reactions');assert.equal(r.wowState.ripples,0);assert.equal(r.wowState.flashes,0);
s.reducedMotion=true;r.wowSoundCue(source,'lead',3);assert.equal(r.wowState.pending,0);
console.log('PASS real-clock visual reactions, bounded queues, teleport cleanup, reduced motion and no audio generation');

s.reducedMotion=false;s.wx=0;r.wowTick(.02);const wave={color:'#fff'};
for(let i=0;i<100;i++)r.wowPulseHit(i*9,0,wave);
assert.equal(r.wowState.marks,18);r.wowPulseHit(891,0,wave);assert.equal(r.wowState.marks,18);
r.wowTick(.02,true);assert.equal(r.wowState.marks,0);

r.seedOf=()=>0;r.MU.near=[source,neighbor,{x:50,y:10}];r.wowTick(.02);
assert(r.wowState.clusters<=2&&r.wowState.clusters>0);
r.currentPocket=()=>({kind:'quiet'});r.wowTick(.02);assert.equal(r.wowState.clusters,0);

r.currentPocket=()=>null;s.layer='cielo';r.wowTick(.02);assert.equal(r.wowState.clusters,0,'surface sources do not leak into other layers');

// Exercise the real eyes hook with no effects: drawConnections previously threw even here.
s.layer='superficie';r.seedOf=()=>1;r.wowTick(.02);
calls.length=0;r.wowEyes(source,c,7,9);
assert.equal(calls.filter(([name])=>name==='fillRect').length,2,'eyes draw exactly two local pixels');
// Populate every relocated world effect and verify world coordinates, independent of eyes.
r.seedOf=()=>0;r.beams=[{x1:20,y1:0,x2:42,y2:0,l:.8}];
r.wowPulseHit(20,0,{color:'#abcdef'});r.wowSoundCue(source,'perc',r.ac.currentTime);r.wowTick(.05);
r.wowTick(.05);r.wowTick(.05);
for(const key of ['clusters','marks','constellations','flashes','ripples'])assert(r.wowState[key]>0,key+' fixture is active');
calls.length=0;r.wowEyes(source,c,7,9);
assert.deepEqual(calls.map(([name])=>name),['save','fillRect','fillRect','restore'],'world effects never draw once per inhabitant');
r.camX=80;r.camY=-30;calls.length=0;r.drawWowWorld();
const ox=r.W/2-r.camX,oy=r.H/2-r.camY;
assert(calls.some(([name,x,y])=>name==='moveTo'&&x===20+ox&&y===oy),'beam memory uses camera coordinates');
assert(calls.some(([name,x,y,w,h])=>name==='fillRect'&&x===20+ox-1.5&&y===oy-1.5&&w===3&&h===3),'flash survives relocation');
assert(calls.some(([name,x,y,radius])=>name==='arc'&&x===20+ox&&y===oy&&radius<4),'pulse mark survives relocation');
assert(calls.some(([name,x,y,radius])=>name==='arc'&&x===42+ox&&y===oy&&radius>=8&&radius<13),'neighbor ripple survives relocation');
assert(calls.filter(([name,,,w,h])=>name==='fillRect'&&w===1&&h===1).length===8,'cluster retains eight dust pixels');
assert(calls.filter(([name,,,w,h])=>name==='fillRect'&&w===2&&h===2).length===5,'beam retains endpoints and three connection lights');
console.log('PASS real eyes hook and all world effects with nonzero camera offsets');

// The real Canvas hook animates presentation in both modes without editing the player.
r.inWorld=()=>s.mode==='world';s.mode='camino';s.px=s.py=0;r.pulse=0;r.wowTick(.02);s.px=5;r.wowTick(.02);
let before=structuredClone(s);calls.length=0;r.cubeVisualTransform(c,195,422);assert(calls.some(([name,angle])=>name==='rotate'&&Math.abs(angle)>.001));assert.deepEqual(s,before);
for(let i=0;i<100;i++)r.wowTick(.02);r.pulse=.6;calls.length=0;r.cubeVisualTransform(c,195,422);assert(calls.some(([name,x,y])=>name==='scale'&&x>1.08&&y<.93));
s.reducedMotion=true;r.wowTick(.02);calls.length=0;r.cubeVisualTransform(c,195,422);assert.equal(calls.length,0);
s.reducedMotion=false;r.wowTick(.02,true);calls.length=0;r.cubeVisualTransform(c,195,422);assert.equal(calls.length,0);
r.pulse=0;s.px+=500;r.wowTick(.02);calls.length=0;r.cubeVisualTransform(c,195,422);assert(!calls.some(([name,angle])=>name==='rotate'&&angle!==0),'teleports cannot leave a tilt');
console.log('PASS actual cube hook: Camino movement, pulse compression, unchanged state, pause, reduced motion and teleport cleanup');
