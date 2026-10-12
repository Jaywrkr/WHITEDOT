import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {buildAtlas,regionCenter} from '../src/atlas.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const a=buildAtlas(r);
assert.equal(a.total,61*61);assert.equal(a.list.length,Object.keys(r.GEN).length,'atlas lists every genre');
assert.deepEqual(a.missing,[],'every genre exists inside the scanned area');
for(const e of a.list){const [x,y]=regionCenter(r,e.nearest.rx,e.nearest.ry);assert.equal(r.regionOfPos(x,y).genre,e.id,`nearest region for ${e.id}`);}
assert.equal(a.list.reduce((s,e)=>s+e.count,0),a.total);
assert.deepEqual(buildAtlas(r).list.map(e=>[e.id,e.nearest.rx,e.nearest.ry]),a.list.map(e=>[e.id,e.nearest.rx,e.nearest.ry]),'deterministic');
console.log(`PASS: rhythm atlas lists ${a.list.length} genres, all reachable within ${a.total} regions, teleport targets match`);
