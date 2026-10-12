import assert from 'node:assert/strict';
import {effectProfile,initialize} from '../src/effects.js';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};data(r);progress(r);
const region={key:'-2,3'},types=new Set();
for(let i=0;i<100;i++){
 const p=effectProfile(`object:${i}`,region,'lead',r.seedOf,r.rng);
 assert.deepEqual(p,effectProfile(`object:${i}`,region,'lead',r.seedOf,r.rng));types.add(p.type);
 assert.equal(effectProfile(`object:${i}`,region,'bajo',r.seedOf,r.rng).type,'dry');
 assert(['dry','filter'].includes(effectProfile(`object:${i}`,region,'perc',r.seedOf,r.rng).type));
}
assert.equal(types.size,5);
const nodes=[];
function param(){return {value:0,setValueAtTime(v,t){assert(Number.isFinite(v)&&Number.isFinite(t));},exponentialRampToValueAtTime(v,t){assert(v>0&&Number.isFinite(t));}};}
function node(){const n={gain:param(),frequency:param(),Q:param(),delayTime:param(),connections:[],disconnects:0,connect(target){this.connections.push(target);return target;},disconnect(){this.disconnects++;},start(t){this.startTime=t;},stop(t){this.stopTime=t;}};nodes.push(n);return n;}
r.ac={currentTime:1,state:'running',createGain:node,createBiquadFilter:node,createDelay:node,createOscillator:node};
r.S.sound=true;r.S.mode="world";r.SIX=.125;r.bus=node();r.verbIn=node();r.dsend=node();
initialize(r);const original={bus:r.bus,verb:r.verbIn,send:r.dsend};
const kinds=Object.fromEntries([...types].map(type=>[type,Array.from({length:100},(_,i)=>`object:${i}`).find(k=>effectProfile(k,region,'lead',r.seedOf,r.rng).type===type)]));
for(const type of ['filter','echo','space','metal']){
 r.withVoiceEffect(kinds[type],region,{role:'lead'},1.2,()=>{assert.notEqual(r.bus,original.bus);assert.notEqual(r.verbIn,original.verb);assert.equal(r.dsend.gain.value,0);});
 assert.equal(r.bus,original.bus);assert.equal(r.verbIn,original.verb);assert.equal(r.dsend,original.send);
}
assert(nodes.some(n=>n.delayTime.value===.375));assert(nodes.some(n=>n.startTime===1.2&&n.stopTime===3.7));
assert.throws(()=>r.withVoiceEffect(kinds.echo,region,{role:'lead'},1.2,()=>{throw Error('synth failed');}));assert.equal(r.bus,original.bus);
for(let i=0;i<100;i++)r.withVoiceEffect(kinds.echo,region,{role:'lead'},1.2,()=>{});
assert.equal(r.activeEffectCount,12);
r.ac.currentTime=4.3;r.effectsTick();assert.equal(r.activeEffectCount,0);assert(nodes.slice(3).every(n=>n.disconnects===1));
for(const disabled of ['mute','path','suspend']){
 r.S.sound=disabled!=='mute';r.S.mode=disabled==='path'?'camino':'world';r.ac.state=disabled==='suspend'?'suspended':'running';
 r.withVoiceEffect(kinds.echo,region,{role:'lead'},5,()=>assert.equal(r.bus,original.bus));assert.equal(r.activeEffectCount,0);
}
console.log('PASS: stable local effects, protected bass/percussion, beat delay, routing restoration, bounded nodes and cleanup');
