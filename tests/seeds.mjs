import assert from 'node:assert/strict';import {normalizeSeed,previewKey} from '../src/seeds.js';import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
function create(seed=null){globalThis.location={search:seed?`?testSeed=${seed}`:''};const r={};data(r);progress(r);world(r);return r;}
const base=create(),a=create('blobs-01'),same=create('blobs-01'),b=create('blobs-02');
const signature=r=>{const d=r.regionOfPos(1800,1800);return JSON.stringify([d.z,d.genre,d.scale,d.track,d.species,d.hue,d.ground,d.air]);};
assert.equal(signature(a),signature(same));assert.notEqual(signature(a),signature(b));assert.notEqual(a.seedOf('adn:1,1'),b.seedOf('adn:1,1'));assert.equal(a.seedOfBase('daily'),base.seedOf('daily'));
assert.deepEqual(a.getChunk(0,0),b.getChunk(0,0));assert.notEqual(previewKey('blobs-01'),previewKey('blobs-02'));assert.equal(normalizeSeed(' <> '),'original');assert.equal(normalizeSeed('a'.repeat(100)).length,40);
const homes=new Set();for(let n=0;n<20;n++){const r=create('world-'+n),d=r.regionOfPos(1800,1800);assert(!d.sea);homes.add(d.z+':'+d.genre);}assert(homes.size>10);
console.log('PASS: distinct complete seeded homes, stable reconstruction, separate preview keys and unchanged daily path');
