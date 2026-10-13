import assert from 'node:assert/strict';
import {FAMILIES,createFamilyState,familyInfluence,encounterVoice} from '../src/encounter-families.js';
import {createEncounters} from '../src/encounters.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
for(const [kind,f]of Object.entries(FAMILIES)){
 const s=createFamilyState(),before=JSON.stringify(s);f.tap(s);assert.notEqual(JSON.stringify(s),before,kind+' tap has no effect');
 f.drag(s,70,-60,140);assert(Object.values(familyInfluence(kind,s)).every(v=>Number.isFinite(v)&&Math.abs(v)<=1));
 const positive=JSON.stringify(familyInfluence(kind,s));f.drag(s,-70,60,15);assert.notEqual(JSON.stringify(familyInfluence(kind,s)),positive,kind+' drag directions do not differ');
 for(let i=0;i<1000;i++)f.tick?.(s,.05,false,{runtime:r,object:{x:0,y:0},distance:200});assert(Object.values(s).every(v=>typeof v!=='number'||Number.isFinite(v)));
 for(const genre of Object.keys(r.GEN)){const region={...r.regionOfPos(900,900),genre};const voice=encounterVoice(kind,region,r.GEN,r.seedOf);assert(voice.high<=72);assert(r.GEN[genre]);assert(voice.instrument);const g=r.GEN[genre],pool=voice.role==='bajo'?(g.bassP||[g.bassI]):voice.role==='perc'?(g.percP||['tom','conga','wood','rim']):g.hookP;assert(pool.includes(voice.instrument),kind+' left its native genre palette');}
}
const region=r.regionOfPos(900,900);let found=0;for(let x=-15;x<15;x++){const a=createEncounters(x,2,900,region,r.seedOf,r.rng);assert.deepEqual(a,createEncounters(x,2,900,region,r.seedOf,r.rng));assert(a.length<=1);found+=a.length;}assert(found>0);assert.equal(createEncounters(0,0,900,{...region,sea:true},r.seedOf,r.rng).length,0);
console.log('PASS: encounter gestures, bounded modulation, deterministic sparse generation and regional instrument coverage');

const voices=new Set();for(const role of ['bass','groove','melody','space'])voices.add(encounterVoice('animal:'+role,region,r.GEN,r.seedOf).role);assert.equal(voices.size,4);

const {familyArrange}=await import('../src/encounter-families.js');const track={bass:Array(16).fill(0),hook:Array.from({length:16},(_,i)=>i%7),grammar:{}},original=JSON.stringify(track);const reversed=familyArrange('stream',track,{a:.1,b:.5,c:0});assert.notDeepEqual(reversed.hook,track.hook);assert.equal(reversed.hook[0],track.hook[0]);assert.equal(JSON.stringify(track),original);

const gated=familyArrange('shadow',track,{a:.5,b:.2,c:0});assert(gated.bass.filter(n=>n>=0).length<track.bass.length);const ground=familyArrange('box',track,{a:.85,b:.1,c:0});assert(ground.bass.filter(n=>n>=0).length<=4);assert.deepEqual(familyInfluence('box',{a:.15,b:.1}),{});assert.equal(JSON.stringify(track),original);

const {encounterRole,regionalFamilyInfluence}=await import('../src/encounter-families.js');
const roles=new Set();for(let x=-10;x<10;x++){const region=r.regionOfPos(x*3600+1800,1800);roles.add(encounterRole('weaver',region,r.seedOf));const mapped=regionalFamilyInfluence('weaver',{a:.8,b:.2,c:0,charge:1},region,r.seedOf);assert(Object.values(mapped).every(v=>Math.abs(v)<=1));}assert.equal(roles.size,4,'regional role variety lost');
for(const [kind,f]of Object.entries(FAMILIES)){const s=createFamilyState();f.drag(s,100,-70,400);const out=familyArrange(kind,track,s);assert(out.hook.filter(n=>n>=0).length<=6||!f.arrange);assert(out.bass.filter(n=>n>=0).length<=8||!f.arrange);assert.equal(JSON.stringify(track),original);}
