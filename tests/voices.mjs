import {hybridIdentity,hybridRegister} from '../src/musical-hybrids.js';
import {voiceRegister} from '../src/musical-character.js';
import {musicalCharacter} from '../src/musical-character.js';
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
 assert.equal(new Set(Object.values(profile).map(v=>v.role)).size,musicalCharacter(region.genre).upper?5:4);
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
for(const method of ['kick','conga','wood','rim','shaker','tom','guiro','timbale','clap','hatHit','snare'])runtime[method]=(...args)=>calls.push({type:'perc',method,args});
voices(runtime);
for(let x=0;x<30;x++) {
 const region=runtime.regionOfPos(x*3600+900,900);
 const profile=createRegionalVoices(region,runtime.BIOMES,runtime.GEN,runtime.seedOf,runtime.rng);
 for(const [kind,rawVoice]of Object.entries(profile)) {
  const voice=hybridRegister(voiceRegister(rawVoice,region.genre),hybridIdentity(region,runtime.seedOf,runtime.rng));
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
// A pulse on time plays the cube's theme: the exact theme note in a melodic voice (never a percussion hit or a chord
// moved by the harmony), then its third and fifth later and quieter. Every region, whatever its pulse role.
{const {themePitch,THEME}=await import('../src/journey-pulse.js'),scale=[0,2,3,5,7,8,10],roles=new Set();
for(let x=0;x<30;x++){const region=runtime.regionOfPos(x*3600+900,900);roles.add(runtime.getVoice('pulso',region).role);
 for(const [degree] of THEME){const midi=themePitch(degree,scale,0);calls.length=0;const out=runtime.playTheme(midi,degree,1,region,scale,0);
  assert(out&&out.notes.length===3);assert.equal(((out.notes[0]-midi)%12+12)%12,0,'the theme note itself, in some octave');assert(out.notes[1]>out.notes[0]&&out.notes[2]>out.notes[0]);
  const hooks=calls.filter(c=>c.type==='hook');assert.equal(hooks.length,3,'three melodic notes, no percussion or chords');assert(hooks[0].t===1&&hooks[1].t>1&&hooks[2].t>hooks[1].t);assert(hooks[2].v<hooks[0].v);}}
assert(roles.has('perc')||roles.has('bajo'),'regions whose pulse is not melodic are covered');console.log('PASS the theme on time: exact note in a melodic voice in every region, third and fifth after');}
const encountered=new Set();
for(let x=-20;x<=20;x++)for(let y=-20;y<=20;y++)encountered.add(runtime.regionOfPos(x*3600+900,y*3600+900).genre);
for(const genre of ['electro','progressive','microhouse','minimaltechno','dubstep','dnb'])assert(encountered.has(genre),`${genre}: unavailable in world`);
console.log('PASS: stable regional voices, five tree roles within one biome, varied instruments, bounded emitted registers and groove responses');
// The magnet keeps the actual voice/notes, promotes its level only inside the call,
// and supplies a spatial source even for legacy closures without one.
const d=runtime.regionOfPos(900,900),source={id:'magnet:voice',x:900,y:900};
const {magnetVoiceGain}=await import('../src/voices.js');
const hear=()=>{calls.length=0;runtime.withVoiceOrigin('field',()=>runtime.playVoice('arbol',0,1,d,false,.4,source));return calls.map(c=>c.v??c.args.at(-1));};
const base=hear(),boosted=runtime.withMagnetVoice(source,hear),ratio=magnetVoiceGain(runtime.getVoice('arbol',d).role);
assert(base.length>0);assert.equal(boosted.length,base.length);assert(boosted.every((v,i)=>Math.abs(v-base[i]*ratio)<1e-12));assert.deepEqual(hear(),base);assert.throws(()=>runtime.withMagnetVoice(source,()=>{throw Error('restore');}));assert.deepEqual(hear(),base);
console.log('PASS magnet voices rise by their role, preserve notes and restore gain after errors');
// A pulse wave over many low objects keeps one bass voice; other roles all answer.
{const region=runtime.regionOfPos(900,900),bassKind=Object.keys(createRegionalVoices(region,runtime.BIOMES,runtime.GEN,runtime.seedOf,runtime.rng)).find(k=>k!=='pulso'&&runtime.getVoice(k,region).role==='bajo');
 if(bassKind){const wave={n:0};Object.defineProperty(runtime,'currentWave',{get:()=>wave,configurable:true});calls.length=0;runtime.playVoice(bassKind,0,1,region);const first=calls.length;runtime.playVoice(bassKind,1,1,region);assert(first>0);assert.equal(calls.length,first,'second bass in the same wave stays quiet');
  Object.defineProperty(runtime,'currentWave',{get:()=>null,configurable:true});calls.length=0;runtime.playVoice(bassKind,1,1,region);assert(calls.length>0,'outside a wave it sounds');console.log('PASS one bass voice per pulse wave');}}
