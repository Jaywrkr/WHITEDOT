import assert from 'node:assert/strict';import {pixelGenome,inhabitantVoice} from '../src/pixel-life-model.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {initialize as voices} from '../src/voices.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};globalThis.document={hidden:false,querySelector:()=>null};const r={};data(r);progress(r);world(r);const calls=[],cues=[];
Object.assign(r,{ac:{},SIX:.125,vel:v=>v,MU:{deg:0,radio:{labScore:{}}},hookInst:(instrument,n,t,v)=>calls.push({instrument,n,t,v}),bassInst:(instrument,n,t,v)=>calls.push({instrument,n,t,v}),soundCue:(source,role,t)=>cues.push({source,role,t}),musicalFrame:t=>({time:t,six:.125,step:0,degree:0,transposition:0,chords:[48,52,55]})});
for(const method of ['kick','conga','wood','rim','shaker','tom','guiro','timbale','clap','hatHit','snare'])r[method]=(...args)=>calls.push({instrument:method,t:args[0],v:args.at(-1)});
voices(r);const roles=new Set(),timbral=new Set();
for(let i=0;i<160;i++){
 const d=r.regionOfPos(i*1000,900),source={id:'inhabitant:test:'+i,x:0,y:0,genome:pixelGenome('sound:'+i,r.seedOf)},raw=inhabitantVoice(source,d,r.GEN),voice=r.getVoice('habitante',d,source);assert.equal(voice.instrument,raw.instrument,'modern accompaniment must not replace individual voice');roles.add(voice.role);timbral.add(voice.instrument);calls.length=cues.length=0;
 assert.equal(r.playVoice('habitante',0,2,d,false,.65,source,'player'),true);assert(calls.length>0);assert(calls.every(c=>c.t===2&&c.v>0&&Number.isFinite(c.v)));assert(cues.length===1&&cues[0].source===source);
 for(const call of calls)if(call.n!==undefined){const audible=call.n+(call.instrument==='glass'?12:0);assert(audible>=voice.low&&audible<=voice.high);assert([0,4,7].includes(((audible%12)+12)%12),'strong beats use the shared chord');}
}
assert.equal(roles.size,4);assert(timbral.size>=20);console.log(`PASS actual voice routing across ${timbral.size} instruments, four roles, exact scheduled onset, shared harmony, bounded registers and source cues (not DSP)`);
