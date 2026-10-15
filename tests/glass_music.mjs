import assert from 'node:assert/strict';
import {glassVoice,glassShape} from '../src/glass-music.js';
import {hybridIdentity,hybridRegister} from '../src/musical-hybrids.js';
import {voiceRegister} from '../src/musical-character.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {initialize as voices} from '../src/voices.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);voices(r);
for(let x=-5;x<5;x++)for(const genre of Object.keys(r.GEN)){
 const region={...r.regionOfPos(x*3600+1800,1800),genre},roles=new Set();
 for(let pane=0;pane<3;pane++){
  const voice=glassVoice(region,pane,r.GEN,r.seedOf),shape=glassShape([pane,1,2],pane,region,r.seedOf);roles.add(voice.role);
  assert.deepEqual(hybridRegister(voiceRegister(voice,genre),hybridIdentity(region,r.seedOf,r.rng)),r.getVoice('installation:glass:'+pane,region));assert(voice.high<=67);assert.notEqual(voice.role,'agudo');
  const g=r.GEN[genre],pool=voice.role==='bajo'?(g.bassP||[g.bassI]):voice.role==='perc'?(g.percP||['tom','wood','rim']):g.hookP;assert(pool.includes(voice.instrument));
  assert([0,2,4].includes(shape.degree));assert(shape.amount>=.3&&shape.amount<=.6);assert(shape.variant>=0&&shape.variant<8);
 }
 assert(roles.has('bajo')&&roles.has('perc')&&(roles.has('lead')||roles.has('acorde')));
}
const region=r.regionOfPos(900,900);assert.notDeepEqual(glassShape([0,0,0],0,region,r.seedOf),glassShape([Math.PI,0,0],0,region,r.seedOf));
console.log('PASS: balanced glass roles across all 52 genres, actual voice routing, native instruments, consonant degrees and bounded movement influence');
