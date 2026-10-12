import assert from 'node:assert/strict';
import { initialize as data } from '../src/data.js';
import { initialize as progress } from '../src/progress.js';
import { initialize as world } from '../src/world.js';
import { createRegionalVoices, initialize as voices } from '../src/voices.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const runtime=Object.create(null);
data(runtime);progress(runtime);world(runtime);
const roles=new Set(), instruments=new Set(), forests=[];
for(let x=-20;x<=20;x++)for(let y=-10;y<=10;y++) {
 const region=runtime.regionOfPos(x*3600+900,y*3600+900),before=JSON.stringify(region);
 const get=()=>createRegionalVoices(region,runtime.BIOMES,runtime.GEN,runtime.seedOf,runtime.rng);
 const profile=get();
 assert.deepEqual(profile,get(),'region changed voice assignment on revisit');
 assert.equal(JSON.stringify(region),before,'voice generation mutated map or creatures');
 assert.equal(new Set(Object.values(profile).map(v=>v.role)).size,5);
 roles.add(profile.arbol.role);instruments.add(profile.arbol.instrument);
 if(runtime.BIOMES[region.z].id==='bosque')forests.push(profile.arbol.role);
}
assert.equal(roles.size,5,'trees were locked into a musical role');
assert(new Set(forests).size===5,'trees did not vary within the same biome');
assert(instruments.size>5,'insufficient instrumental variation');
const calls=[];
Object.assign(runtime,{ac:{},MU:{deg:0},SIX:.125,vel:v=>v,
 bassInst:(instrument,n,t,v)=>calls.push({type:'bass',instrument,n,t,v}),
 hookInst:(instrument,n,t,v)=>calls.push({type:'hook',instrument,n:n+(instrument==='glass'?12:0),t,v}),
});
for(const method of ['kick','conga','wood','rim','shaker','tom'])runtime[method]=(...args)=>calls.push({type:'perc',method,args});
voices(runtime);
for(let x=0;x<30;x++) {
 const region=runtime.regionOfPos(x*3600+900,900);
 const profile=createRegionalVoices(region,runtime.BIOMES,runtime.GEN,runtime.seedOf,runtime.rng);
 for(const [kind,voice]of Object.entries(profile)) {
  calls.length=0;runtime.playVoice(kind,3,1,region,true);
  assert(calls.length>0);
  for(const call of calls)if(call.n!==undefined) {
   assert(Number.isFinite(call.n));assert(call.n>=voice.low&&call.n<=voice.high,`${voice.role} out of range: ${call.n}`);
   assert(call.v>0&&call.v<=.15);
  }
  if(voice.role==='lead'||voice.role==='agudo'||voice.role==='bajo') {
   const pitched=calls.filter(c=>c.n!==undefined);
   assert.equal(pitched.length,2);assert.equal(pitched[0].n,pitched[1].n,'response became a rising pickup jingle');
   assert(pitched[1].v<pitched[0].v);
  }
  if(voice.role==='bajo')assert(calls.every(c=>c.type==='bass'));
  if(voice.role==='perc')assert(calls.every(c=>c.type==='perc'));
  assert.deepEqual(runtime.getVoice(kind,region),voice);
 }
}
const encountered=new Set();
for(let x=-20;x<=20;x++)for(let y=-20;y<=20;y++)encountered.add(runtime.regionOfPos(x*3600+900,y*3600+900).genre);
for(const genre of ['electro','progressive','microhouse','minimaltechno','dubstep','dnb'])assert(encountered.has(genre),`${genre}: unavailable in world`);
console.log('PASS: stable regional voices, five tree roles within one biome, varied instruments, bounded emitted registers and groove responses');
