import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {pocketAt} from '../src/pockets.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const layouts=new Set(),counts=new Set(),types=new Set(),signatures=new Set();
for(let x=-8;x<=8;x++)for(let y=-8;y<=8;y++){
 const chunk=r.wchunk(x*4,y*4),region=r.regionOfPos(x*3600+1,y*3600+1),recipe=region.recipe;
 assert(chunk.playthings.length<=recipe.budgets.objects);layouts.add(recipe.layout);counts.add(chunk.playthings.length);
 for(const o of chunk.playthings){const def=r.elementCatalog.get('toy:'+o.kind);assert(def&&def.biomes.includes(r.BIOMES[chunk.z].id));assert(def.materials.includes(o.material));assert(Number.isFinite(o.x)&&Number.isFinite(o.y));assert(o.x>=x*3600&&o.x<(x*4+1)*900);assert(o.y>=y*3600&&o.y<(y*4+1)*900);assert.notEqual(pocketAt(chunk.pockets,o.x,o.y)?.kind,'quiet');types.add(o.kind);}
 signatures.add(JSON.stringify(chunk.playthings.map(o=>[o.kind,o.material,Math.round(o.x-x*3600),Math.round(o.y-y*3600)])));
}
assert.equal(layouts.size,3);assert.equal(types.size,5);assert(counts.size>15);assert(signatures.size>180);
const original=r.wchunk(-12,16).playthings.map(({snd,...o})=>o);r.wchunks.delete('-12,16');assert.deepEqual(r.wchunk(-12,16).playthings.map(({snd,...o})=>o),original);
console.log(`PASS: compatible material/motion catalog, ${counts.size} population sizes, 3 layouts, preserved quiet pockets and deterministic rebuilds`);
