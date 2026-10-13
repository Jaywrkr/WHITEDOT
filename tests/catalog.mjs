import assert from 'node:assert/strict';
import {createElementCatalog,createRegionalRecipe,RECIPE_VERSION} from '../src/catalog.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const catalog=createElementCatalog(),origin=r.regionOfPos(900,900),make=d=>createRegionalRecipe(d,r.BIOMES[d.z].id,r.seedOf,r.rng,catalog);
assert.deepEqual(make(origin),origin.recipe);assert(Object.isFrozen(origin.recipe.music.scale));assert.equal(origin.recipe.version,RECIPE_VERSION);
assert.throws(()=>catalog.register(catalog.list()[0]),/Duplicate/);assert.throws(()=>catalog.register({id:'incomplete'}),/Incomplete/);
const before=make(origin);catalog.register({id:'test:box',name:'Caja de prueba',kind:'installation',biomes:['llanura'],actions:['touch'],materials:['wood']});
const after=make(origin);assert(after.elements.some(e=>e.id==='test:box'));
for(const entry of before.elements)assert.deepEqual(after.elements.find(e=>e.id===entry.id),entry,'adding content changed existing independent element RNG');
assert.equal(after.archetype,before.archetype);assert.equal(after.material,before.material);
const nativeCatalog=createElementCatalog();
const signatures=new Set(),types=new Set();
for(let x=-15;x<=15;x++)for(let y=-15;y<=15;y++){
 const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600),recipe=d.recipe;
 assert.deepEqual(recipe,createRegionalRecipe(d,r.BIOMES[d.z].id,r.seedOf,r.rng,nativeCatalog));assert.equal(recipe.music.genre,d.genre);assert.equal(recipe.music.bpm,d.bpm);
 assert(recipe.elements.every(e=>catalog.get(e.id).biomes.includes(r.BIOMES[d.z].id)));
 assert(recipe.budgets.objects<=40&&recipe.budgets.ambientPerBar===1);if(d.sea||r.BIOMES[d.z].id==='vacio')assert.equal(recipe.archetype,'quiet');
 types.add(recipe.archetype);signatures.add(JSON.stringify([recipe.archetype,recipe.material,recipe.layout,recipe.activity,recipe.elements]));
}
assert.equal(types.size,6);assert(signatures.size>800);
console.log('PASS: expandable catalog, independent RNG per element, 6 recipe archetypes, deterministic compatible recipes and protected budgets');
