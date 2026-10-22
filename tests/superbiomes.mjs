import assert from 'node:assert/strict';
import {FAMILIES,familyOf,LAND_REGIONS,ABYSS_REGIONS,valid,SUPERBIOME_COUNT,superbiome,initialize} from '../src/superbiomes.js';
// Ten families hold the 52 genres, each genre exactly once.
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};globalThis.location={search:''};
const [d,p,w]=await Promise.all(['data','progress','world'].map(n=>import(new URL('../src/'+n+'.js',import.meta.url))));const r={};d.initialize(r);p.initialize(r);w.initialize(r);r.S.todayKey='2026-10-22';
assert.equal(FAMILIES.length,10);const all=FAMILIES.flatMap(f=>f.genres);assert.equal(all.length,52);assert.equal(new Set(all).size,52);
for(const g of Object.keys(r.GEN))assert(familyOf(g),g+' has a family');
// Valid combinations: every continent region with every family; the Abyss only with Ambient.
assert.equal(SUPERBIOME_COUNT,105);assert(valid('llanura','dnb'));assert(valid('aurora','ambient'));assert(!valid('vacio','house'));assert(!valid('cometas','techno'));assert(!valid('mar','ambient'));
assert.deepEqual({...superbiome('lago','dub','Marea')},{id:'lago:dub',region:'lago',family:'dub',name:'Marea · Dub'});assert.equal(superbiome('vacio','deep'),null);
// The real map: every place of the main world lands in a valid superbiome, and the continents show many of them.
initialize(r);r.newRegionAt=()=>null;const seen=new Set();
for(let x=-30;x<=30;x++)for(let y=-30;y<=30;y++){const pos=[(x+.5)*r.WCH,(y+.5)*r.WCH],place=r.regionOfPos(...pos),sb=r.superbiomeOf(place,...pos);assert(sb,place.key+' '+place.genre);assert(valid(sb.region,sb.family));seen.add(sb.id);}
assert(seen.size>=60,'the continents hold many superbiomes: '+seen.size);assert(seen.has('vacio:ambient'));
// In the Abyss a new region names the superbiome.
r.newRegionAt=()=>({id:'aurora',name:'Aurora'});const sea={sea:true,genre:'ambient',z:0};assert.equal(r.superbiomeOf(sea,0,0).name,'Aurora · Ambient');
// Recording: once per superbiome, kept with the day, rolled back if the save fails, malformed data replaced.
let saves=0,fail=false;const q={S:{todayKey:'2026-10-22'},save:()=>{saves++;return !fail;}};initialize(q);const sb=superbiome('faros','detroit','Púlsares');
assert.equal(q.recordSuperbiome(sb),true);assert.equal(q.S.universe.super['faros:techno'],'2026-10-22');assert.equal(q.recordSuperbiome(sb),false,'only the first time');assert.equal(saves,1);
fail=true;assert.equal(q.recordSuperbiome(superbiome('cueva','dub','Pozo')),false);assert(!('cueva:dub' in q.S.universe.super),'a failed save leaves nothing');
fail=false;q.S.universe.super=[1,2];assert.equal(q.recordSuperbiome(sb),true);assert.deepEqual(Object.keys(q.S.universe.super),['faros:techno']);
q.S.universe={rare:{llanura:2},future:'kept'};assert.equal(q.recordSuperbiome(sb),true);assert.deepEqual(q.S.universe.rare,{llanura:2});assert.equal(q.S.universe.future,'kept','other universe data stays');
console.log(`PASS superbiomes: 10 families hold the 52 genres, ${SUPERBIOME_COUNT} valid combinations, ${seen.size} on the main world's map, new regions in the Abyss, first-heard day kept with save rollback`);
