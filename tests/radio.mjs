import {hookInstruments} from '../src/musical-character.js';
import assert from 'node:assert/strict';
import {harmonicDegree} from '../src/grammar.js';
import { createRadio } from '../src/radio.js';
import { initialize as data } from '../src/data.js';
import { initialize as progress } from '../src/progress.js';
import { initialize as world } from '../src/world.js';
import { initialize as audio } from '../src/audio.js';
import { initialize as voices } from '../src/voices.js';
import { initialize as instruments } from '../src/instruments.js';
import { initialize as patches } from '../src/patches.js';
import { initialize as phenomena } from '../src/phenomena.js';
import { initialize as spatial } from '../src/spatial.js';
import { initialize as effects } from '../src/effects.js';
globalThis.localStorage = { getItem: () => null, setItem() {} };
const runtime = Object.create(null);
data(runtime); progress(runtime); world(runtime);
const origin = runtime.regionOfPos(900, 900);
const originalDNA = JSON.stringify(origin);
for (const genre of Object.keys(runtime.GEN)) {
  const region = { ...origin, genre, key: genre };
  const radio = createRadio(runtime.seedOf, runtime.rng, runtime.GEN);
  const melodies = new Set(), compositions=new Set(), sections = new Set(), energies = [];
  let previous;
  for (let bar = 0; bar < 160; bar++) {
    const music = radio.advance(region, bar, { near: 0, singers: 0 });
    melodies.add(JSON.stringify(music.hook));compositions.add(JSON.stringify([music.bass,music.hook,music.hookI,harmonicDegree(music.grammar,music.harmonyBar)])); sections.add(music.section); energies.push(music.energy);
    assert.equal(music.genre, genre);
    const lean=['minimal','rominimal','microhouse','minimaltechno','dub','heart'].includes(genre);
    assert(music.hook.filter(n=>n>=0).length<=(music.section===0?2:lean?3:5),'overcrowded melody');
    assert(music.hook.every(n=>n<0||(runtime.GEN[genre].melodyDegrees||[0,2,4]).includes(n)),'unrelated melodic leap');
    if(previous&&Math.floor(previous.phrase/4)===Math.floor(music.phrase/4))music.hook.forEach((n,i)=>{if(n>=0&&previous.hook[i]>=0)assert.equal(n,previous.hook[i],'motif changed pitch before its cycle');});
    if(previous&&music.section===previous.section)assert.equal(music.hookI,previous.hookI,'timbre swapped inside section');
    previous=music;
    assert.equal(music.hook.length, 16);
    if(music.melodyRest)assert(music.hook.every(n=>n<0),'rest section kept a mandatory melody');
    else assert(music.hook.some((note, step) => step % 4 === 0 && note >= 0));
    assert(music.energy >= .14 && music.energy <= (genre === 'ambient' ? .3 : .7));
    assert(music.identity.hooks.includes(music.hookI));
  }
  assert(melodies.size>2&&compositions.size>10,`${genre}: stopped developing melody, bass and harmony while stationary`);
  assert(sections.size > 1, `${genre}: no section changes`);
  assert(Math.max(...energies) - Math.min(...energies) > .05);
}
assert.equal(JSON.stringify(origin), originalDNA);
const calm = createRadio(runtime.seedOf, runtime.rng, runtime.GEN);
const alive = createRadio(runtime.seedOf, runtime.rng, runtime.GEN);
assert(alive.advance(origin, 0, { near: 20, singers: 2, event: 'aurora' }).energy > calm.advance(origin, 0).energy);

// Exercise the actual scheduler and instrument paths with a stationary player.
// Fake audio nodes capture scheduling, rather than making the test wait minutes.
let schedule, started = 0;
const interval = globalThis.setInterval;
globalThis.setInterval = fn => { schedule = fn; return 1; };
function param() {
  return { value: 0, setValueAtTime: check, setTargetAtTime: check,
    exponentialRampToValueAtTime: check, linearRampToValueAtTime: check };
}
function check(value, time) { assert(Number.isFinite(value)); assert(Number.isFinite(time)); }
function node() {
  return { gain: param(), frequency: param(), detune: param(), delayTime: param(), Q: param(),playbackRate:param(),setPeriodicWave(){},
    connect(target) { return target; }, disconnect() {}, start(time=0) { assert(Number.isFinite(time)); started++; }, stop: () => {} };
}
class Context {
  currentTime = 0; state = 'running'; sampleRate = 1000; destination = node();
  createGain = node; createOscillator = node; createBiquadFilter = node;
  createDynamicsCompressor = node; createConvolver = node; createDelay = node; createBufferSource = node;
  createConstantSource=node;createPeriodicWave(real,imag){return {real,imag};}
  createBuffer(channels, length) { const buffers = Array.from({length:channels},()=>new Float32Array(length)); return {duration:length/this.sampleRate,getChannelData:i=>buffers[i],copyToChannel(data,i){buffers[i].set(data);}}; }
}
globalThis.window = { AudioContext: Context };
try {
  audio(runtime); voices(runtime); effects(runtime); instruments(runtime); spatial(runtime); phenomena(runtime); patches(runtime);
  runtime.S.mode = 'world'; runtime.S.todayKey = '2026-10-12';
  runtime.MU.dnaT = origin; runtime.MU.layers = new Set([0,1,2]);
  runtime.MU.flowers = [{n:69,st:0,x:900,y:900}];
  runtime.MU.E = 0; runtime.MU.speed = 0; runtime.MU.still = 60;
  runtime.audio();
  const phrases = new Set();
  for (let tick = 0; tick < 4800; tick++) {
    runtime.ac.currentTime = tick * .025;
    schedule();
    assert(runtime.activeEffectCount<=12);assert(runtime.activeSpatialCount<=32);assert(runtime.activePatchCount<=32);
    if (runtime.MU.radio) phrases.add(runtime.MU.radio.phrase);
  }
  assert(phrases.size > 5, 'actual audio scheduler failed to evolve music');
  assert(started > 100, 'stationary world did not schedule instruments');
  assert.equal(runtime.MU.speed, 0);
  runtime.MU.layers.clear();runtime.MU.flowers=[];
  runtime.MU.E=.65;
  for(const genre of Object.keys(runtime.GEN)) {
    runtime.MU.dnaT={...origin,key:`audio-test:${genre}`,genre,bpm:runtime.GEN[genre].bpm[0],track:{...origin.track,bassI:runtime.GEN[genre].bassI}};
    const start=runtime.ac.currentTime,previous=started,heard=new Set();
    runtime.recordInstrument=id=>heard.add(id);
    for(let tick=1;tick<=9600;tick++){runtime.ac.currentTime=start+tick*.025;schedule();}
    // Cover a complete foundation/melody cycle, including slow, deliberate rests.
    assert(started>previous+20,`${genre}: no sustained audio while stationary`);
    assert(heard.size>0,`${genre}: no instruments scheduled`);
    if(runtime.GEN[genre].bassP){assert(heard.has('kick'),`${genre}: groove has no kick`);assert(heard.has(runtime.MU.radio.identity.bassI)||runtime.GEN[genre].bassP.some(id=>heard.has(id)));assert(runtime.MU.radio.identity.hooks.some(id=>heard.has(id)),`${genre}: recipe hooks ${runtime.MU.radio.identity.hooks} not in ${[...heard]}; final ${JSON.stringify({section:runtime.MU.radio.section,phrase:runtime.MU.radio.phrase,rest:runtime.MU.radio.melodyRest,hook:runtime.MU.radio.hook,step:runtime.MU.step,vari:runtime.MU.vari})}`);}
    assert.equal(runtime.MU.radio.genre,genre);
  }
  // Keep the original two-native-bass border contract under classic playback.
  // The same scheduler loop above exercises all 52 styles with live territories.
  runtime.S.livingMusic=false;
  const mixed=new Set();runtime.recordInstrument=id=>mixed.add(id);
  runtime.MU.dnaT={...origin,key:'mix:primary',genre:'tropical',bpm:112,track:{...origin.track,bassI:'rubber'}};
  runtime.MU.nb={...origin,key:'mix:neighbor',genre:'robotic',bpm:126,track:{...origin.track,bassI:'machine'}};runtime.MU.nbW=.5;
  for(let tick=0;tick<4800;tick++){runtime.ac.currentTime+=.025;schedule();}
  const primaryBass=runtime.MU.radio.bassI,neighborBass=runtime.MU.neighborRadio.bassI;
  assert.notEqual(primaryBass,neighborBass,'border fixture must contain distinct bass voices');
  assert(mixed.has(primaryBass)&&mixed.has(neighborBass),'border failed to mix both actual arranged bass voices');
  assert(runtime.MU.radio.identity.hooks.some(id=>mixed.has(id))&&runtime.MU.neighborRadio.identity.hooks.some(id=>mixed.has(id)),'border failed to mix both melodic palettes');
  assert.equal(runtime.MU.neighborRadio.key,'mix:neighbor');runtime.MU.nb=null;runtime.MU.nbW=0;
  runtime.S.softMusic=true;runtime.applyComfort();assert.equal(runtime.musicVolume(),.65);
  runtime.S.sound=false;runtime.applyComfort();assert.equal(runtime.musicVolume(),0);runtime.S.sound=true;runtime.S.softMusic=false;
  runtime.S.mode = 'camino';
  for(let tick=0;tick<24;tick++){runtime.ac.currentTime+=.025;schedule();}
  assert.equal(runtime.MU.radio, null, 'radio leaked into daily path');
  runtime.S.mode = 'studio';
  runtime.S.studio.slots = {}; runtime.ac.currentTime += runtime.SIX+.2; schedule();
  assert.equal(runtime.MU.radio, null, 'radio leaked into sequencer');
  // The actual scheduler must not give timestamp-based renderers a future hit.
  const timer=setTimeout,realNow=performance.now.bind(performance);let ms=1000,pending=[];
  try{performance.now=()=>ms;globalThis.setTimeout=(fn,delay)=>{pending.push({fn,at:ms+delay});return pending.length;};
   const flush=at=>{ms=at;for(const item of pending.filter(p=>p.at<=ms))item.fn();pending=pending.filter(p=>p.at>ms);};
   for(const kind of ['flower','studio']){ms=1000;pending=[];runtime.ac.outputLatency=.18;runtime.MU.step=Math.ceil(runtime.MU.step/16)*16;runtime.MU.next=runtime.ac.currentTime+.1;
    let get;if(kind==='flower'){const f={n:0,st:0,x:900,y:900};runtime.S.mode='world';runtime.MU.flowers=[f];get=()=>f.hit;}
    else{runtime.S.mode='studio';runtime.S.studio.slots={'0,0':'luz'};runtime.studioHit={};runtime.playSample=()=>{};get=()=>runtime.studioHit['0,0'];}
    schedule();assert.equal(get(),undefined,kind+' does not glow when merely scheduled');
    flush(1279);assert.equal(get(),undefined,kind+' does not glow before audible time');
    flush(1280);assert.equal(get(),1280,kind+' lights at the estimated audible output');
    assert.equal(Math.max(0,1-(ms-get())/400),1,'renderer receives a present timestamp');
   }
  }finally{globalThis.setTimeout=timer;performance.now=realNow;runtime.ac.outputLatency=0;}
} finally { globalThis.setInterval = interval; }
console.log('PASS: '+Object.keys(runtime.GEN).length+' genres evolve at rest, environment affects composition, real scheduler plays without movement, path/studio remain separate');
