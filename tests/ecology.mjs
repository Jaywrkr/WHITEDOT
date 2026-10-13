import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {ECOLOGIES,climateField,ecologyVoice} from '../src/ecology-model.js';
import {worldIdentity,supportedWorld,sameWorld} from '../src/world-identity.js';import {previewKey} from '../src/seeds.js';
import {createGrammar} from '../src/grammar.js';import {createRegionalVoices} from '../src/voices.js';
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
const make=(seed='',generation=1,layout='classic')=>{globalThis.location={search:seed?'?testSeed='+seed+'&layout='+layout+'&generation='+generation:''};const r={};data(r);progress(r);world(r);r.S.todayKey='2026-10-13';return r;};
// Captured from phase 1, not from the new generator: recipes and real chunk positions must remain identical.
const old=make(),regions=[[-20,10],[-3,-2],[0,0],[2,3],[9,-12],[18,17]].map(([x,y])=>old.regionOfPos((x+.5)*3600,(y+.5)*3600)),chunks=[[1,1],[-3,4],[39,-48]].map(([x,y])=>old.wchunk(x,y));
old.ACH.push(['registered-later','Dynamic achievement','Discovery']);assert(old.ACH.some(a=>a[0]==='registered-later'),'achievement plugins must retain their shared mutable registry');assert(!old.ACH.some(a=>a[0]==='ecologyTouch'));
assert.equal(createHash('sha256').update(JSON.stringify([regions,chunks])).digest('hex'),'81ae446e930a1dbd4bb2e35ae85d2d328335130fc200fadd0ddd561305ce33ce');
assert(supportedWorld(worldIdentity('a','wide',2)));assert(!sameWorld(worldIdentity('a','wide',1),worldIdentity('a','wide',2)));assert(!supportedWorld({...worldIdentity('a','wide',2),layoutVersion:1}));
assert.notEqual(previewKey('a','wide',1),previewKey('a','wide',2));
assert.equal(Object.values(ECOLOGIES).flat().length,33);const live=make('humedal-01',2,'wide');assert.equal(live.REG*live.WCH,10800);assert.equal(make('humedal-01',1,'wide').REG*900,7200);
const origin=live.regionOfPos(5400,5400),before=JSON.stringify(origin);assert.equal(origin.ecology.id,'humedal');assert.equal(origin.recipe.version,2);assert.equal(live.contentDirectory.list().length,30);
let objects=0;const discovered=new Set();
for(let i=0;i<1200;i++){
 const x=(i%40-20)*10800+5400,y=(Math.floor(i/40)-15)*10800+5400,d=live.regionOfPos(x,y),c=live.wchunk(Math.floor(x/900),Math.floor(y/900));
 discovered.add(d.ecology.id);assert(c.ecologyObjects.length<=4);assert(c.ecologyObjects.every(o=>live.contentDirectory.get('ecology:'+o.kind).biomes.includes(live.BIOMES[c.z].id)));objects+=c.ecologyObjects.length;
 if(d.sea)assert.equal(c.ecologyObjects.length,0);
 const g=live.GEN[d.genre];assert(d.bpm>=g.bpm[0]&&d.bpm<=(d.anomaly?.type==='frenesi'?178:g.bpm[1]));assert(Math.abs(d.tuneCents)<=12);assert.deepEqual(d.scale.length,7);
 assert(createGrammar(d,live.seedOf,live.rng).hookLimit<=4);
 const voices=createRegionalVoices(d,live.BIOMES,live.GEN,live.seedOf,live.rng);assert(Object.values(voices).every(v=>v.role!=='agudo'&&v.high<=69));
}
assert(objects>50);assert(discovered.size>=24);assert.equal(JSON.stringify(live.regionOfPos(5400,5400)),before);
const a=climateField(4,6,live.seedOf,live.rng),b=climateField(4.01,6,live.seedOf,live.rng);assert(Object.keys(a).every(k=>Math.abs(a[k]-b[k])<.01));
for(const channel of ['bass','groove','melody','space']){const v=ecologyVoice('ecology:stone:'+channel,origin,live.GEN,live.seedOf,live.rng);assert(v.high<=69);assert.notEqual(v.role,'agudo');}
const compositions=['breathing','rooted','interlocking','floating'].map(architecture=>createGrammar({...origin,ecology:{...origin.ecology,score:{...origin.ecology.score,architecture}}},live.seedOf,live.rng));assert.equal(new Set(compositions.map(g=>JSON.stringify([g.progression,g.motifRotation,g.phraseBars,g.harmonyBars,g.hookLimit]))).size,4,'architecture must change actual composition, not just its name');
const same=make('humedal-01',2,'wide');assert.equal(JSON.stringify(same.regionOfPos(5400,5400)),before,'seed must be independent of previous runtime/seed order');
live.S.ach.keep='2026-10-13';assert(live.save());const restored=make('humedal-01',2,'wide');assert(restored.S.ach.keep);assert.equal(restored.storageStatus.kind,'ok');const legacy=make('humedal-01',1,'wide');assert(!legacy.S.ach.keep);
console.log(`PASS: phase-1 golden world preserved; 33 ecologies, version/layout save isolation, ${discovered.size} sampled habitats, ${objects} bounded objects, continuous climate and deterministic return`);
