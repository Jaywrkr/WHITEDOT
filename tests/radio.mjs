import assert from 'node:assert/strict';
import { createRadio } from '../src/radio.js';
import { initialize as data } from '../src/data.js';
import { initialize as progress } from '../src/progress.js';
import { initialize as world } from '../src/world.js';
import { initialize as audio } from '../src/audio.js';
import { initialize as voices } from '../src/voices.js';
import { initialize as effects } from '../src/effects.js';
globalThis.localStorage = { getItem: () => null, setItem() {} };
const runtime = Object.create(null);
data(runtime); progress(runtime); world(runtime);
const origin = runtime.regionOfPos(900, 900);
const originalDNA = JSON.stringify(origin);
for (const genre of Object.keys(runtime.GEN)) {
  const region = { ...origin, genre, key: genre };
  const radio = createRadio(runtime.seedOf, runtime.rng, runtime.GEN);
  const melodies = new Set(), sections = new Set(), energies = [];
  let previous;
  for (let bar = 0; bar < 160; bar++) {
    const music = radio.advance(region, bar, { near: 0, singers: 0 });
    melodies.add(JSON.stringify(music.hook)); sections.add(music.section); energies.push(music.energy);
    assert.equal(music.genre, genre);
    const lean=['minimal','rominimal','microhouse','minimaltechno','dub','heart'].includes(genre);
    assert(music.hook.filter(n=>n>=0).length<=(music.section===0?2:lean?3:5),'overcrowded melody');
    assert(music.hook.every(n=>n<0||[0,2,4].includes(n)),'unrelated melodic leap');
    if(previous&&Math.floor(previous.phrase/4)===Math.floor(music.phrase/4))music.hook.forEach((n,i)=>{if(n>=0&&previous.hook[i]>=0)assert.equal(n,previous.hook[i],'motif changed pitch before its cycle');});
    if(previous&&music.section===previous.section)assert.equal(music.hookI,previous.hookI,'timbre swapped inside section');
    previous=music;
    assert.equal(music.hook.length, 16);
    assert(music.hook.some((note, step) => step % 4 === 0 && note >= 0));
    assert(music.energy >= .14 && music.energy <= (genre === 'ambient' ? .3 : .7));
    assert(runtime.GEN[genre].hookP.includes(music.hookI));
  }
  assert(melodies.size > 10, `${genre}: stopped composing while stationary`);
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
  return { gain: param(), frequency: param(), detune: param(), delayTime: param(), Q: param(),
    connect(target) { return target; }, disconnect() {}, start(time=0) { assert(Number.isFinite(time)); started++; }, stop: () => {} };
}
class Context {
  currentTime = 0; state = 'running'; sampleRate = 1000; destination = node();
  createGain = node; createOscillator = node; createBiquadFilter = node;
  createDynamicsCompressor = node; createConvolver = node; createDelay = node; createBufferSource = node;
  createBuffer(channels, length) { const buffers = Array.from({length:channels},()=>new Float32Array(length)); return {getChannelData:i=>buffers[i]}; }
}
globalThis.window = { AudioContext: Context };
try {
  audio(runtime); voices(runtime); effects(runtime);
  runtime.S.mode = 'world'; runtime.S.todayKey = '2026-10-12';
  runtime.MU.dnaT = origin; runtime.MU.layers = new Set([0,1,2]);
  runtime.MU.flowers = [{n:69,st:0,x:900,y:900}];
  runtime.MU.E = 0; runtime.MU.speed = 0; runtime.MU.still = 60;
  runtime.audio();
  const phrases = new Set();
  for (let tick = 0; tick < 4800; tick++) {
    runtime.ac.currentTime = tick * .025;
    schedule();
    assert(runtime.activeEffectCount<=12);
    if (runtime.MU.radio) phrases.add(runtime.MU.radio.phrase);
  }
  assert(phrases.size > 5, 'actual audio scheduler failed to evolve music');
  assert(started > 100, 'stationary world did not schedule instruments');
  assert.equal(runtime.MU.speed, 0);
  runtime.MU.layers.clear();runtime.MU.flowers=[];
  for(const genre of Object.keys(runtime.GEN)) {
    runtime.MU.dnaT={...origin,key:`audio-test:${genre}`,genre,bpm:runtime.GEN[genre].bpm[0]};
    const start=runtime.ac.currentTime,previous=started,heard=new Set();
    runtime.recordInstrument=id=>heard.add(id);
    for(let tick=1;tick<=2400;tick++){runtime.ac.currentTime=start+tick*.025;schedule();}
    assert(started>previous+20,`${genre}: no sustained audio while stationary`);
    assert(heard.size>0,`${genre}: no instruments scheduled`);
    assert.equal(runtime.MU.radio.genre,genre);
  }
  runtime.S.mode = 'camino';
  for(let tick=0;tick<24;tick++){runtime.ac.currentTime+=.025;schedule();}
  assert.equal(runtime.MU.radio, null, 'radio leaked into daily path');
  runtime.S.mode = 'studio';
  runtime.S.studio.slots = {}; runtime.ac.currentTime += runtime.SIX+.2; schedule();
  assert.equal(runtime.MU.radio, null, 'radio leaked into sequencer');
} finally { globalThis.setInterval = interval; }
console.log('PASS: '+Object.keys(runtime.GEN).length+' genres evolve at rest, environment affects composition, real scheduler plays without movement, path/studio remain separate');
