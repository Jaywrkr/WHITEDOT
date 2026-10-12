import assert from 'node:assert/strict';
import {musicalField} from '../src/neighborhoods.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
let near=0,far=0,n=0;const genres=new Set();
for(let x=-20;x<20;x++)for(let y=-20;y<20;y++){
 const a=r.regionOfPos(x*3600+900,y*3600+900),b=r.regionOfPos((x+1)*3600+900,y*3600+900),c=r.regionOfPos((x+15)*3600+900,(y+13)*3600+900);
 near+=Math.abs(a.bpm-b.bpm);far+=Math.abs(a.bpm-c.bpm);n++;genres.add(a.genre);
 assert(a.bpm>=r.GEN[a.genre].bpm[0]&&a.bpm<=r.GEN[a.genre].bpm[1]);
 assert.deepEqual(musicalField(x,y,r.seedOf,r.rng),musicalField(x,y,r.seedOf,r.rng));
}
assert(near/n<12);assert(near<far*.5);assert(genres.size>=18);
for(const x of [-8,-4,0,4,8]){const left=musicalField(x-1e-6,-4,r.seedOf,r.rng),right=musicalField(x+1e-6,-4,r.seedOf,r.rng);assert(Math.abs(left.tempo-right.tempo)<1e-4);}
assert.equal(r.regionOfPos(900,900).genre,'minimal');
console.log(`PASS: coherent neighbor tempos (${(near/n).toFixed(1)} vs ${(far/n).toFixed(1)} BPM distant), native tempo ranges, negative edges and ${genres.size} styles`);
