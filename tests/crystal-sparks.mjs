import assert from 'node:assert/strict';
import {initialize,crystalField,normalizeSparks} from '../src/crystal-sparks.js';
import {validateSave} from '../src/save-store.js';
import {worldIdentity} from '../src/world-identity.js';
const seedOf=s=>{let h=2166136261;for(const ch of s)h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0;};
assert.deepEqual(crystalField(-250,20,seedOf),crystalField(-250,20,seedOf));
assert.deepEqual([undefined,-5,3.9,Infinity].map(normalizeSparks),[0,0,3,0]);
let modal=false,saves=0;globalThis.document={hidden:false,querySelector:()=>modal?{}:null};
const calls=[],c=new Proxy({},{get:(o,k)=>o[k]??((...args)=>{for(const v of args)if(typeof v==='number')assert(Number.isFinite(v));calls.push([k,...args]);}),set:(o,k,v)=>(o[k]=v,true)});
const r={S:{wx:0,wy:0,layer:'superficie'},W:390,H:844,camX:0,camY:0,cx:c,worldIdentity:{seed:'a'},seedOf,inWorld:()=>true,waves:[],save:()=>{saves++;return true;}};
initialize(r);r.crystalTick(.02);assert.equal(r.S.sparks,0);
const all=r.crystalState.near;assert.deepEqual(new Set(all.map(o=>o.size)),new Set([1,2,3]));
let expected=0;
for(const size of [1,2,3]){
 const o=all.find(o=>o.size===size);r.S.wx=o.x;r.S.wy=o.y-40;r.camX=r.S.wx;r.camY=r.S.wy;
 const wave=origin=>({x:o.x-20,y:o.y,r:21,prev:19,origin});
 r.waves=[wave('ambient')];r.crystalTick(.02);assert(!r.crystalState.near.find(p=>p.id===o.id).hits,'ambient pulses cannot mine');
 modal=true;r.waves=[wave('player')];r.crystalTick(.02);modal=false;assert(!r.crystalState.near.find(p=>p.id===o.id).hits);
 for(let n=1;n<=size;n++){
  r.waves=[wave('player')];r.crystalTick(.02);r.crystalTick(.02);
  assert.equal(r.crystalState.near.find(p=>p.id===o.id).hits,n,'one damage per wave');
  r.drawCrystals();
 }
 r.waves=[];r.autopilotState={mode:'wander',paused:false};for(let i=0;i<20;i++)r.crystalTick(.05);assert.equal(r.S.sparks,expected,'autopilot cannot collect');
 r.autopilotState.paused=true;for(let i=0;i<20;i++)r.crystalTick(.05);
 expected+=o.value;assert.equal(r.S.sparks,expected);r.drawSparkHUD();
 const before=expected;r.waves=[wave('player')];for(let i=0;i<20;i++)r.crystalTick(.05);assert.equal(r.S.sparks,before,'depleted sites never pay twice');
}
assert.equal(expected,9);assert.equal(saves,3);assert(calls.some(([k,t])=>k==='fillText'&&t==='✦ 9'));
r.S.wx=10000;r.crystalTick(.02);r.S.wx=0;r.S.wy=0;r.crystalTick(.02);assert.equal(r.crystalState.near.filter(o=>o.collected).length,3,'travel does not respawn sites');
const identity=worldIdentity('', 'classic',1),defaults={sparks:0,studio:{},journal:{music:{}}};
assert.equal(validateSave({},defaults,identity).sparks,0);assert.equal(validateSave({sparks:9},defaults,identity).sparks,9);assert.equal(validateSave({sparks:-2},defaults,identity).sparks,0);
r.S={wx:0,wy:0,sparks:17,reducedMotion:true};r.crystalTick(.02);assert.equal(r.crystalState.sites,0);assert.equal(r.S.sparks,17);
r.drawCrystals();r.drawSparkHUD();
console.log('PASS crystal sizes, manual pulses, deduplication, modal/autopilot guards, collection, depletion, migration, finite drawing and save ownership');
