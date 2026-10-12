import assert from 'node:assert/strict';
import { initialize as data } from '../src/data.js';
import { initialize as progress } from '../src/progress.js';
import { initialize as world } from '../src/world.js';
import { initialize as discovery } from '../src/discovery.js';

const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
};
// Load an existing v4 save, including discoveries and a studio composition.
const saved = { todayKey: '2026-10-12', lastDay: '2026-10-12', todayLight: 119,
  totalLight: 119, capShown: true, cat: { '0,0:0': 1 }, catN: 1,
  studio: { x: 900, y: 900, biome: 0, slots: { '1,0': 'luz' } } };
storage.set('pixel-blanco-v4', JSON.stringify(saved));
const runtime = Object.create(null);
data(runtime); progress(runtime); world(runtime);
assert.deepEqual(runtime.S.studio, saved.studio);
assert.deepEqual(runtime.S.cat, saved.cat);
assert.equal(runtime.S.sound, true); // missing fields retain defaults

// Side-effect sinks let collection run without a DOM or audio device.
Object.assign(runtime, { parts: [], grooveFx: 0, playerNote() {}, unlock() {},
  hud() {}, showPhrase() {}, say() {}, gain() {} });
discovery(runtime);
const random = Math.random;
try {
  Math.random = () => 0; // golden light worth 10, with only 1 remaining
  runtime.collect({ id: 'test,0,0', x: 0, y: 0 });
} finally { Math.random = random; }
assert.equal(runtime.S.todayLight, 120);
assert.equal(runtime.S.totalLight, 120);
runtime.collect({ id: 'test,0,1', x: 0, y: 0 });
assert.equal(runtime.S.totalLight, 120); // completed day cannot grow further
runtime.save();
assert.deepEqual(JSON.parse(storage.get('pixel-blanco-v4')).studio, saved.studio);

const origin = runtime.regionOfPos(900, 900);
assert.equal(origin.name, 'Origen');
assert.equal(origin.genre, 'minimal');
assert.equal(runtime.regionOfPos(-1, -1).key, '-1,-1');
const freshRuntime = Object.create(null);
data(freshRuntime); progress(freshRuntime); world(freshRuntime);
for (const [x, y] of [[900,900], [-4000,8000], [16000,-12000]]) {
  assert.deepEqual(runtime.regionOfPos(x,y), freshRuntime.regionOfPos(x,y));
}
console.log('PASS: v4 save compatibility, daily growth cap, seeded world across runtimes');
