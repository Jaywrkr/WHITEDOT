import assert from 'node:assert/strict';
import {GENRE_CHARACTERS,musicalCharacter,hookInstruments,interactionInstruments,hookPitch} from '../src/musical-character.js';
import {createRadio} from '../src/radio.js';
import {createRegionalVoices,initialize as voices} from '../src/voices.js';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {initialize as world} from '../src/world.js';
import {initialize as wonders} from '../src/wonders.js';
import {initialize as initiative} from '../src/initiative.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};data(r);progress(r);world(r);
assert.deepEqual(Object.keys(GENRE_CHARACTERS).sort(),Object.keys(r.GEN).sort(),'an existing genre lacks an intentional register policy');
const origin=r.regionOfPos(900,900),snapshot=JSON.stringify(origin);
for(const genre of Object.keys(r.GEN)){
  const region={...origin,key:`policy:${genre}`,genre},p=musicalCharacter(genre),radio=createRadio(r.seedOf,r.rng,r.GEN);
  const sections=new Set();let resting=0,playing=0;
  for(let bar=0;bar<400;bar++){
    const a=radio.advance(region,bar);sections.add(a.section);
    assert(a.hook.filter(n=>n>=0).length<=p.budget[a.section]);
    assert(a.identity.hooks.includes(a.hookI));
    assert(interactionInstruments(genre,r.GEN[genre],'lead').includes(a.hookI));
    if(a.melodyRest){resting++;assert(a.hook.every(n=>n===-1));if(genre!=='ambient')assert(a.bass.some(n=>n>=0),'melody rest also erased the genre bass');}
    else {playing++;assert(a.hook.some(n=>n>=0));}
  }
  assert(resting>0&&playing>0&&sections.size===4,`${genre}: no alternation between foundation and melody`);
  const profile=createRegionalVoices(region,r.BIOMES,r.GEN,r.seedOf,r.rng);
  assert(Object.values(profile).some(v=>v.role==='bajo'));assert(Object.values(profile).some(v=>v.role==='perc'));
  for(const v of Object.values(profile))if(v.role!=='bajo'&&v.role!=='perc'){
    assert(v.high<=p.high&&v.high-v.low>=12);
    assert(interactionInstruments(genre,r.GEN[genre],v.role).includes(v.instrument),'object instrument escaped its genre and role palette');
  }
  for(const instrument of hookInstruments(genre,r.GEN[genre]))for(let n=30;n<=95;n++){
    const audible=hookPitch(instrument,n,p)+(instrument==='glass'?12:0);
    assert(audible>=p.low&&audible<=p.high,'synthesis octave escaped the intended audible register');
    assert.equal(((audible-n)%12+12)%12,0,'register folding changed pitch class');
  }
}
// Exercise actual voice routing: automatic melody rests, deliberate touches remain audible.
const calls=[];Object.assign(r,{ac:{},MU:{deg:0,radio:{genre:'dub',melodyRest:true}},SIX:.125,vel:v=>v,
  hookInst:(instrument,n)=>calls.push({n:n+(instrument==='glass'?12:0)}),bassInst:(instrument,n)=>calls.push({n})});
for(const key of ['kick','conga','wood','rim','shaker','tom','guiro','timbale','clap','hatHit','snare'])r[key]=()=>calls.push({});
voices(r);
const region={...origin,key:'gesture:dub',genre:'dub'},kind=Object.entries(createRegionalVoices(region,r.BIOMES,r.GEN,r.seedOf,r.rng)).find(([k,v])=>v.role==='lead'&&k!=='pulso')[0];   // the pulse is the cube's bell (cube-bell.js), above the genre's range on purpose
r.playVoice(kind,0,1,region,false,1,null,'ambient');assert.equal(calls.length,0);
r.playVoice(kind,0,1,region,false,1,null,'player');assert(calls.length>0);assert(calls.every(c=>c.n<=65));
assert.equal(JSON.stringify(origin),snapshot,'musical policy changed saved world DNA');
// Automatic secondary layers must not bring the old high glass cascade back.
wonders(r);Object.assign(r,{say(){},toast(){},unlock(){},chordTones:()=>[76,80,83,87]});
r.S.mode='world';r.S.sound=true;r.MU.dnaA=r.MU.dnaT=region;r.ac.state='running';r.MU.near=[];
let river;
for(let x=-80;x<80&&!river;x++)for(let y=-20;y<20&&!river;y++){
  const a=(x+.5)*3600,b=(y+.5)*3600;if(r.riverAt(a,b)?.on)river={x:a,y:b};
}
assert(river,'no river fixture');r.S.wx=river.x;r.S.wy=river.y;r.riverStep(.01);
calls.length=0;r.riverBar(1);assert.equal(calls.length,0,'river defeated the melody rest');
r.MU.radio.melodyRest=false;r.riverBar(1);assert(calls.length>=1&&calls.length<=3);assert(calls.every(c=>c.n<=65),'river reintroduced a high-octave cascade');
globalThis.document={hidden:false};initiative(r);
for(let i=0;i<1400;i++)r.initiativeTick(.05,false,false);
r.MU.radio.melodyRest=true;calls.length=0;r.initiativeBar(1,4);
assert(calls.length>0&&calls.every(c=>c.n>=38&&c.n<=55),'stillness fallback must support the bass section');
r.MU.radio.melodyRest=false;calls.length=0;r.initiativeBar(2,8);
assert(calls.length>0&&calls.every(c=>c.n<=65),'stillness fallback escaped the style register');
console.log('PASS: all 52 styles alternate groove/melody without erased bass, genre-native object palettes, bounded audible octaves and deliberate gesture response');
