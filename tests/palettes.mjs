import {createInstrumentPatch} from '../src/patches.js';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {createRegionalVoices} from '../src/voices.js';import {WORLD_GENRES} from '../src/palettes.js';import {INSTRUMENTS} from '../src/journal.js';import {INSTRUMENT_SPECS,initialize as instruments} from '../src/instruments.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);r.S.todayKey='2026-10-12';
const found=new Map();for(let x=-25;x<=25;x++)for(let y=-25;y<=25;y++){const d=r.regionOfPos(x*3600+900,y*3600+900);if(WORLD_GENRES[d.genre])found.set(d.genre,d);}
assert.equal(found.size,4);assert.equal(r.regionOfPos(900,900).genre,'minimal');
for(const [genre,d]of found){const g=WORLD_GENRES[genre],voices=createRegionalVoices(d,r.BIOMES,r.GEN,r.seedOf,r.rng);assert(g.scales.some(scale=>JSON.stringify(scale)===JSON.stringify(d.scale)));assert(d.bpm>=g.bpm[0]&&d.bpm<=g.bpm[1]);for(const v of Object.values(voices)){assert(INSTRUMENTS[v.instrument]);if(v.role==='bajo')assert(g.bassP.includes(v.instrument));else if(v.role==='perc')assert(g.percP.includes(v.instrument));else assert(g.hookP.includes(v.instrument));}}
// Serialized chunks of the continental world (v2 continentes + tierras raras, octubre 2026): scenery and identities stay stable from here on.
for(const [x,y,hash]of [[0,0,'37e6fbc78b8e9482a56ea3b4875d919e4eacd36ae82306fa41fb5775b0fa45ed'],[5,7,'d24ed28742f7a05c29a2c6a45379fe6a7cf309a24ee923d8d618c8e84d2b8093'],[-6,12,'72b03afce082b8f21f132ec75fb60338ec7ae5af84753d70636e331c2a46eac9'],[21,-15,'b89b92d4a6f07e83b355b5c101e80cfe8cceb09aa0830b5965e15587ba3610e6'],[-30,-20,'d5584166b8ed5a6139fec064234a80519f37f00959cf1d247d10bb9956117111']])assert.equal(createHash('sha256').update(JSON.stringify(r.wchunk(x,y))).digest('hex'),hash);
let events=[];function param(){return {value:0,setValueAtTime(v,t){assert(Number.isFinite(v)&&Number.isFinite(t));events.push(['set',v,t]);},exponentialRampToValueAtTime(v,t){assert(v>0&&Number.isFinite(t));events.push(['ramp',v,t]);}};}
function node(){const n={frequency:param(),gain:param(),Q:param(),detune:param(),connect(target){return target;},start(t){assert.equal(t,10);events.push(['osc',this.type,this.frequency.value]);},stop(t){assert(t>10&&t<12);}};return n;}
r.ac={createOscillator:node,createGain:node,createBiquadFilter:node};r.bus=node();r.verbIn=node();r.hz=m=>440*2**((m-69)/12);r.env=(g,t,a,v,d)=>{assert(a>0&&v>0&&d>0);events.push(['env',a,v,d]);};instruments(r);
const signatures=new Set();for(const id of Object.keys(INSTRUMENT_SPECS)){assert(INSTRUMENTS[id]);for(const pitch of [36,60,84]){events=[];assert.equal(r.playNewInstrument(id,pitch,10,.1),true);assert(events.some(e=>e[0]==='osc'));if(pitch===60)signatures.add(JSON.stringify(events));}}
for(const id of Object.keys(INSTRUMENT_SPECS)){
 r.activeInstrumentPatch=null;events=[];r.playNewInstrument(id,60,10,.1);const baseline=events.slice();
 r.activeInstrumentPatch=createInstrumentPatch({key:'2,3',genre:'robotic'},id,id==='rubber'||id==='machine'||id==='logdrum'?'bajo':'lead',id,r.seedOf,r.rng);
 events=[];r.playNewInstrument(id,60,10,.1);assert.notDeepEqual(events,baseline,'patch did not change synth parameters');
 assert.deepEqual(events.filter(e=>e[0]==='osc').map(e=>e[2]),baseline.filter(e=>e[0]==='osc').map(e=>e[2]),'patch shifted oscillator note frequencies');
}r.activeInstrumentPatch=null;
assert.equal(signatures.size,Object.keys(INSTRUMENT_SPECS).length);assert.equal(r.playNewInstrument('unknown',60,10,.1),false);
console.log('PASS: four reachable electronic palettes, family-specific voices, preserved world fixtures and distinct bounded synth graphs');
