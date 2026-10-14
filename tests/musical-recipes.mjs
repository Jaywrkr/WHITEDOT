import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {initialize as world} from '../src/world.js';
import {createRadio} from '../src/radio.js';
import {MUSIC_IDENTITIES,musicIdentity} from '../src/musical-recipes.js';
import {musicalCharacter,interactionInstruments,expressiveBassInstruments} from '../src/musical-character.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};data(r);progress(r);world(r);
const original=r.regionOfPos(900,900),before=JSON.stringify(original),recipes=new Map();
for(const genre of Object.keys(r.GEN))for(let i=0;i<120;i++){
 const region={...original,genre,key:'identity-test:'+i};
 const a=musicIdentity(region,r.seedOf,r.rng,r.GEN),b=musicIdentity(region,r.seedOf,r.rng,r.GEN);
 assert.deepEqual(a,b);assert(a&&a.version===1&&a.genres.includes(genre));
 assert(a.hooks.every(id=>interactionInstruments(genre,r.GEN[genre],'lead').includes(id)));
 assert(expressiveBassInstruments(genre,r.GEN[genre]).includes(a.bassI));
 assert(a.bass.length===16&&a.bass.every(d=>d>=-1&&d<=6));
 assert(a.air<=musicalCharacter(genre).air&&a.energyCap<=.7);
 assert(a.progression.every(d=>[0,3,4,5].includes(d)));
 if(!recipes.has(a.id))recipes.set(a.id,{region,identity:a});
}
assert.equal(recipes.size,16,'all curated identities must be reachable');
const actual=new Set();
for(const {region,identity} of recipes.values()){
 const radio=createRadio(r.seedOf,r.rng,r.GEN),frames=[];
 for(let bar=0;bar<160;bar++){
  const f=radio.advance(region,bar);assert.equal(f.identity.id,identity.id);
  assert(f.hook.filter(n=>n>=0).length<=musicalCharacter(region.genre).budget[f.section]);
  assert(f.grammar.brightness<=identity.brightness);
  assert(f.hook.every(n=>n<0||(r.GEN[region.genre].melodyDegrees||[0,2,4]).includes(n)));
  if(bar%8===0)frames.push([f.bass,f.hook,f.hookI,f.bassI,f.grammar.accents,f.grammar.progression,f.expression.attackScale,f.expression.toneScale]);
 }
 actual.add(JSON.stringify(frames));
}
assert.equal(actual.size,16,'different names must produce different audible arrangements');
assert.equal(JSON.stringify(original),before,'playback identity must not mutate legacy world DNA');
assert.equal(MUSIC_IDENTITIES.length,16);
console.log('PASS 16 reachable arranged identities, all 52 native styles, stable playback DNA, harmony/register/density limits and distinct actual phrases');
