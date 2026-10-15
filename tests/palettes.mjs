import {ADVANCED_INSTRUMENTS} from '../src/modular-synth.js';
import {interactionInstruments} from '../src/musical-character.js';
import {createInstrumentPatch} from '../src/patches.js';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {createRegionalVoices} from '../src/voices.js';import {WORLD_GENRES} from '../src/palettes.js';import {INSTRUMENTS} from '../src/journal.js';import {INSTRUMENT_SPECS,initialize as instruments} from '../src/instruments.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);r.S.todayKey='2026-10-12';
const found=new Map();for(let x=-25;x<=25;x++)for(let y=-25;y<=25;y++){const d=r.regionOfPos(x*3600+900,y*3600+900);if(WORLD_GENRES[d.genre])found.set(d.genre,d);}
assert.equal(found.size,4);assert.equal(r.regionOfPos(900,900).genre,'minimal');
for(const [genre,d]of found){const g=WORLD_GENRES[genre],voices=createRegionalVoices(d,r.BIOMES,r.GEN,r.seedOf,r.rng);assert(g.scales.some(scale=>JSON.stringify(scale)===JSON.stringify(d.scale)));assert(d.bpm>=g.bpm[0]&&d.bpm<=g.bpm[1]);for(const v of Object.values(voices)){assert(INSTRUMENTS[v.instrument]);if(v.role==='bajo')assert(g.bassP.includes(v.instrument));else if(v.role==='perc')assert(g.percP.includes(v.instrument));else assert(interactionInstruments(genre,r.GEN[genre],v.role).includes(v.instrument));}}
// Protect the original scenery/creatures independently of the evolving plaything catalog.
for(const [x,y,hash]of [[0, 0, "a4801f5ed9490ff4ae167c647151587a4f8d48f33ab076aa18c325007ffcf30d"], [5, 7, "821a587e041b8a605135338fd71e43934ea105a10cad615ff9e9bff03b3b886a"], [-6, 12, "48499e2386e0de54e5d36487fe27347a43f10bde15c91716bd6dda6ab348a6df"], [21, -15, "e749e060ab0906f8b1bbc888de0aeca1a991ebae41fb8316a026630a31791d2c"], [-30, -20, "f819a2cffaca83a717307e1b39eb8e0316acb8fd4fcebd46e114da44f6ece388"]]){const {playthings,...scenery}=r.wchunk(x,y);assert.equal(createHash('sha256').update(JSON.stringify(scenery)).digest('hex'),hash);}
let events=[],currentInstrument,caseTime=10;function param(){return {value:0,setValueAtTime(v,t){assert(Number.isFinite(v)&&Number.isFinite(t));events.push(['set',v,t-caseTime]);},linearRampToValueAtTime(v,t){assert(Number.isFinite(v)&&Number.isFinite(t));events.push(['linear',v,t-caseTime]);},exponentialRampToValueAtTime(v,t){assert(v>0&&Number.isFinite(t));events.push(['ramp',v,t-caseTime]);}};}
function node(){const n={frequency:param(),gain:param(),Q:param(),detune:param(),playbackRate:param(),setPeriodicWave(w){events.push(["wave",...w.imag]);},connect(target){return target;},start(t){assert(t>=caseTime&&t<caseTime+2);events.push(['osc',this.type,this.frequency.value]);},stop(t){assert(t>caseTime&&t<caseTime+(ADVANCED_INSTRUMENTS[currentInstrument]||INSTRUMENT_SPECS[currentInstrument]?.technique?3:2));}};return n;}
r.ac={sampleRate:1000,createBuffer:(channels,length)=>({duration:length/1000,getChannelData:()=>new Float32Array(length),copyToChannel(data){assert(data.every(Number.isFinite));}}),createConstantSource:node,createPeriodicWave:(real,imag)=>({real,imag}),createBufferSource:node,createOscillator:node,createGain:node,createBiquadFilter:node};r.bus=node();r.verbIn=node();r.hz=m=>440*2**((m-69)/12);r.env=(g,t,a,v,d)=>{assert(a>0&&v>0&&d>0);events.push(['env',a,v,d]);};instruments(r);
// Parameter cases are isolated in time; polyphony has its own bounded tests.
const resetBudget=()=>{caseTime+=4;r.ac.currentTime=caseTime;r.techniqueTick();};
const signatures=new Set();for(const id of Object.keys(INSTRUMENT_SPECS)){currentInstrument=id;assert(INSTRUMENTS[id]);for(const pitch of [36,60,84]){events=[];resetBudget();assert.equal(r.playNewInstrument(id,pitch,caseTime,.1),true);assert(events.some(e=>e[0]==='osc'));if(pitch===60)signatures.add(JSON.stringify(events));}}
for(const id of Object.keys(INSTRUMENT_SPECS)){
 currentInstrument=id;r.activeInstrumentPatch=null;events=[];resetBudget();r.playNewInstrument(id,60,caseTime,.1);const baseline=events.slice();
 r.activeInstrumentPatch=createInstrumentPatch({key:'2,3',genre:'robotic'},id,id==='rubber'||id==='machine'||id==='logdrum'?'bajo':'lead',id,r.seedOf,r.rng);
 events=[];resetBudget();r.playNewInstrument(id,60,caseTime,.1);assert.notDeepEqual(events,baseline,'patch did not change synth parameters');
 assert.deepEqual(events.filter(e=>e[0]==='osc').map(e=>e[2]),baseline.filter(e=>e[0]==='osc').map(e=>e[2]),'patch shifted oscillator note frequencies');
}r.activeInstrumentPatch=null;
assert.equal(signatures.size,Object.keys(INSTRUMENT_SPECS).length);assert.equal(r.playNewInstrument('unknown',60,caseTime,.1),false);
console.log('PASS: four reachable electronic palettes, family-specific voices, preserved world fixtures and distinct bounded synth graphs');
