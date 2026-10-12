import assert from 'node:assert/strict';
import {createInstrumentPatch,patchIdentity,initialize} from '../src/patches.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);
const region={key:'-3,2',genre:'robotic'},voice={role:'lead',instrument:'metalkeys'},source={personality:{period:1000,spin:7,degree:2},x:0,y:0};
const identity=patchIdentity('arbol',source);source.x=300;assert.equal(patchIdentity('arbol',source),identity);
const variants=new Set();for(let i=0;i<500;i++){
 const p=createInstrumentPatch(region,'metalkeys','lead',String(i),r.seedOf,r.rng);assert.deepEqual(p,createInstrumentPatch(region,'metalkeys','lead',String(i),r.seedOf,r.rng));
 assert(p.level<=1&&p.level>0);assert(p.widthCents<=7);assert(p.resonance<1);assert(p.cutoff<5100);variants.add(JSON.stringify(p));
 const bass=createInstrumentPatch(region,'machine','bajo',String(i),r.seedOf,r.rng);assert.equal(bass.widthCents,0);assert(bass.cutoff<1100);
}assert.equal(variants.size,500);
function node(){return {gain:{value:0},frequency:{value:0},Q:{value:0},disconnects:0,connect(target){return target;},disconnect(){this.disconnects++;}};}
r.S.mode='world';r.ac={state:'running',currentTime:1,createGain:node,createBiquadFilter:node};r.bus=node();r.verbIn=node();r.dsend=node();initialize(r);
const original=[r.bus,r.verbIn,r.dsend],patch=r.getInstrumentPatch('arbol',region,voice,source);let filter;
r.withInstrumentPatch('arbol',region,voice,source,1.1,()=>{filter=r.bus;assert.equal(r.activeInstrumentPatch,patch);assert.notEqual(r.bus,original[0]);assert.equal(r.bus.frequency.value,patch.cutoff);});
assert.equal(r.activeInstrumentPatch,null);assert.deepEqual([r.bus,r.verbIn,r.dsend],original);
assert.throws(()=>r.withInstrumentPatch('arbol',region,voice,source,1.1,()=>{throw Error('failed synth');}));assert.equal(r.activeInstrumentPatch,null);assert.deepEqual([r.bus,r.verbIn,r.dsend],original);
for(let i=0;i<100;i++)r.withInstrumentPatch('arbol',region,voice,source,1.1,()=>{});assert.equal(r.activePatchCount,32);
r.ac.currentTime=3.2;r.patchTick();assert.equal(r.activePatchCount,0);assert.equal(filter.disconnects,1);
for(let i=0;i<1000;i++)r.getInstrumentPatch(String(i),region,voice,{id:String(i)});assert.equal(r.instrumentPatchCacheSize,256);assert.deepEqual(r.getInstrumentPatch('arbol',region,voice,source),patch);
r.S.mode='camino';r.withInstrumentPatch('arbol',region,voice,source,4,()=>assert.equal(r.activeInstrumentPatch,null));
console.log('PASS: stable moving-object identities, 500 timbral variants, protected pitch/levels, routing restoration, capped nodes and cache');
