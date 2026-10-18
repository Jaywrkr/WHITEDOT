import assert from 'node:assert/strict';
import {MUSIC_FAMILIES,familyArrangement,familyDrums,createAmbientPunctuation} from '../src/music-families.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {createRadio} from '../src/radio.js';import {labNoteEvents} from '../src/lab-score.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);const origin=r.regionOfPos(900,900),signatures=new Set();let frames=0;
for(const f of MUSIC_FAMILIES){signatures.add(JSON.stringify([f.bass,f.motifs,f.drums,f.progression]));for(let i=0;i<16;i++){
 const region={...origin,key:'family:'+i,genre:f.genres[0],sea:false},before=JSON.stringify(region),a=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true,reference:()=>true}),b=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true,reference:()=>true});
 for(let bar=0;bar<64;bar++){const x=a.advance(region,bar),y=b.advance(region,bar);assert.deepEqual(x,y);assert.equal(x.musicFamily.id,f.id);assert(x.hook.every(n=>n>=-1&&n<=6));assert.equal(x.hook.length,16);assert.equal(x.bass.length,16);assert(f.leads.includes(x.hookI));if(bar%8===7){assert(x.melodyRest);assert(x.hook.every(n=>n===-1));assert(!Array.from({length:16},(_,step)=>labNoteEvents(x,step,bar)).flat().some(e=>e.role==='lead'));}for(let step=0;step<16;step++)assert(familyDrums(x,step,bar,.7).every(e=>e.gain>0&&e.gain<.2));frames++;}
 assert.equal(JSON.stringify(region),before);
}}
assert.equal(signatures.size,6);assert.equal(familyArrangement({id:'old'},{genre:'dnb'},r.seedOf).id,'old');
const gate=createAmbientPunctuation(),state={};for(let bar=0;bar<32;bar++){assert.equal(gate.allow('bell','ambient','a',bar,state),bar%8===0);assert.equal(gate.allow('glass','ambient','a',bar,state),false);assert(gate.allow('bell','player','a',bar,state));assert(gate.allow('glass','track','a',bar,state));assert(gate.allow('reed','ambient','a',bar,state));}assert(gate.allow('bell','ambient','a',0,state));assert(gate.allow('bell','ambient','a',0,{}));
console.log('PASS six families, '+frames+' deterministic production frames, unique rhythm/bass/harmony, silent release, immutable regions, automatic ringing budget and untouched player/track voices');
