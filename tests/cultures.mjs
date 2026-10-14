import assert from 'node:assert/strict';
import {CULTURES,createSanctuary,captureStone,normalizeCultureBook,cultureNotes} from '../src/culture-model.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {worldIdentity,sameWorld,placeAddress} from '../src/world-identity.js';import {previewKey} from '../src/seeds.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const found=new Set();let sites=0;
for(let x=-20;x<20;x++)for(let y=-10;y<10;y++){
 const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600),before=JSON.stringify(d);
 const make=()=>createSanctuary(d,3600,r.regionOfPos,r.seedOf,r.rng),s=make();assert.deepEqual(s,make());assert.equal(JSON.stringify(d),before);
 if(!s)continue;sites++;found.add(s.culture);assert(!d.sea);
 for(let chapter=0;chapter<3;chapter++){
  const route=s.routes[chapter];assert(!r.regionOfPos(route.x,route.y).sea);assert.notEqual(route.key,s.key);assert.equal(new Set(route.order).size,4);
  let input=[];for(const i of route.order)input=captureStone(input,i,route.order);assert.equal(input.length,4);
  assert(captureStone([],route.order[1],route.order).length===0);
  const notes=cultureNotes(s,chapter);assert(notes.every(n=>CULTURES[s.culture].scale.includes(n.interval)));
 }
}
assert(found.size===8&&sites>25&&sites<150,'rare complete studies across the existing world');
const clean=normalizeCultureBook({collections:{altiplano:2,islas:99},sites:{'sanctuary:0,0':{chapter:1,heard:false,clues:2,open:true},garbage:{chapter:0}}});
assert.equal(clean.collections.altiplano,2);assert(!clean.collections.islas);assert(!clean.sites['sanctuary:0,0'].open);assert(!clean.sites.garbage);
const vast=worldIdentity('laboratorio','vasto',2),classic=worldIdentity('laboratorio','classic',2);
assert.equal(vast.layout,'vasto');assert(!sameWorld(vast,classic));assert.equal(placeAddress(vast,-100,200).layout,'vasto');
assert.notEqual(previewKey('laboratorio','vasto',2),previewKey('laboratorio','wide',2));
assert.equal(previewKey('hello','wide',1),'pixel-blanco-v4:preview-wide:hello','legacy key preserved');
console.log(`PASS: ${sites} sparse sanctuaries, eight studies, deterministic land routes/keys, bounded saved progress and isolated vast-layout addresses`);

r.speedBoost=2.2;r.S.mode='camino';assert.equal(r.SPEED,190,'world power accelerated the daily path');r.S.mode='world';assert(Math.abs(r.SPEED-418)<1e-8);r.S.layer='cielo';assert.equal(r.SPEED,190,'surface power accelerated another layer');
