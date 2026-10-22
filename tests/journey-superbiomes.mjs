import assert from 'node:assert/strict';
import {findChapter,CHAPTER_FAMILIES,WORLD_CHAPTERS} from '../src/journey-chapters.js';
import {familyOf,FAMILIES} from '../src/superbiomes.js';
// Every World chapter has its families, all real; the Vacío only Ambient.
assert.deepEqual(Object.keys(CHAPTER_FAMILIES).sort(),[...WORLD_CHAPTERS].sort());for(const list of Object.values(CHAPTER_FAMILIES))for(const f of list)assert(FAMILIES.some(x=>x.id===f),f);assert.deepEqual([...CHAPTER_FAMILIES.vacio],['ambient']);
// A toy map: the first family is preferred even when farther, then the next, then any place of the region.
const at=(x,y)=>x>=3000?'bosque':x>=600?'bosque':'llanura',fam=(x,y)=>x>=3000?'disco':'jazz',sea=()=>false;
const s=findChapter('bosque',{x:0,y:0},at,sea,fam);assert.equal(s.family,'disco');assert(s.x>=3000);
const t=findChapter('bosque',{x:0,y:0},at,sea,()=>'trance');assert.equal(t.family,null,'no family nearby: any place of the region');assert(t.x>=600);
assert.equal(findChapter('tormenta',{x:0,y:0},at,sea,fam),null);
// The real map, without changing it: the main world's chapters land in their superbiomes where the map has them.
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};globalThis.location={search:''};
const [d,p,w]=await Promise.all(['data','progress','world'].map(n=>import(new URL('../src/'+n+'.js',import.meta.url))));const r={};d.initialize(r);p.initialize(r);w.initialize(r);
const ids=r.BIOMES.map(b=>b.id);let from={x:450,y:450};const got={};
for(const id of WORLD_CHAPTERS){const spot=findChapter(id,from,(x,y)=>ids[r.biomeOfPos(x,y)],(x,y)=>!!r.regionOfPos(x,y).sea,(x,y)=>familyOf(r.regionOfPos(x,y).genre)?.id);assert(spot,id);assert.equal(ids[r.biomeOfPos(spot.x,spot.y)],id);
 if(spot.family)assert.equal(familyOf(r.regionOfPos(spot.x,spot.y).genre).id,spot.family);got[id]=spot.family;from=spot;}
assert.deepEqual(got,{llanura:'house',lago:'downtempo',bosque:'disco',tormenta:'techno',vacio:'ambient'});
console.log('PASS journey superbiomes: each chapter prefers its families in order, falls back to its region, and the main world lands Polvo · House, Marea · Downtempo, Cúmulo · Disco, Tormenta solar · Techno and Vacío · Ambient');
