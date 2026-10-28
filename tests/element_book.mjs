import assert from 'node:assert/strict';
import {DISCOVERY_ELEMENTS,elementFamily,normalizeElementBook,migrateElementBook} from '../src/element-book-model.js';
import {initialize} from '../src/element-book.js';
import {localGlowRadius} from '../src/visual.js';
assert.equal(new Set(DISCOVERY_ELEMENTS.map(e=>e.id)).size,DISCOVERY_ELEMENTS.length);assert.equal(DISCOVERY_ELEMENTS.length,190);
for(const k of ['rhythm:stone:4','rhythm:fossil:7','installation:glass:0','encounter:animal','ecology:reed:groove','vida:grulla:3'])assert(elementFamily(k));
assert.equal(elementFamily('forma:2,0:6',true),'blob');assert.equal(elementFamily('forma:2,0:6',false),'form');assert.equal(elementFamily('tool:fx'),null);assert.equal(elementFamily(null),null);
const raw={found:{'rhythm:stone':{day:'2026-10-14',genre:'x'.repeat(300)},'installation:patch':{},bad:{},pet:null}};
const clean=normalizeElementBook(raw);assert.deepEqual(Object.keys(clean.found),['rhythm:stone']);assert.equal(clean.found['rhythm:stone'].genre.length,40);
const previous={catN:10000,rhythmFound:{stone:1,wrong:1},journal:{encounters:{animal:1},ecologyObjects:{lichen:1}},vida:{seen:{grulla:true}},glassSites:{a:{seen:true}},materiaSites:{'strings:0,0':{seen:true}},pet:{species:'grulla'}};
const migrated=migrateElementBook(previous);assert.equal(Object.keys(migrated.found).length,7);assert(!migrated.found.form,'catN cannot invent object discoveries');
let modal=false;globalThis.document={hidden:false,querySelector:()=>modal?{}:null};const badge={textContent:'',title:''},ach=[];
const r={S:{todayKey:'2026-10-14'},$:()=>badge,GEN:{ambient:{name:'Ambient'}},inWorld:()=>true,unlock:k=>ach.push(k)};initialize(r);
assert.equal(r.elementFamilyCount,0);assert(r.recordElement('rhythm:stone',{genre:'ambient'}));assert(!r.recordElement('rhythm:stone:6',{genre:'ambient'}));assert.equal(r.elementFamilyCount,1);
modal=true;assert(!r.recordElement('rhythm:roots'));modal=false;document.hidden=true;assert(!r.recordElement('rhythm:roots'));document.hidden=false;
for(const e of DISCOVERY_ELEMENTS.slice(0,30))r.recordElement(e.id);assert(ach.includes('elementos10')&&ach.includes('elementos30'));assert(r.elementFamilyCount<=190);
r.S={todayKey:'2026-10-14'};r.elementBookUI();assert.equal(r.elementFamilyCount,0,'replacement save does not inherit counts');assert(!r.recordElement(null));
r.recordElement('pet',{genre:'<img src=x onerror=bad()>'});assert(!r.elementBookCards().includes('<img'));
for(const [w,h]of [[320,640],[844,390],[1920,1080]])assert(localGlowRadius(w,h,400)<=Math.min(w,h)*.18);assert.equal(localGlowRadius(1920,1080,400),72);
console.log('PASS 190 unique collectible families, honest migration, deduplication, UI/modal silence, bounded normalization, save reset, escaped journal and local visual budgets');

// New catalogs may recognize old quarantined discoveries; never delete their evidence.
const preserved=normalizeElementBook({version:1,extension:{earned:7},found:{'rhythm:stone':{day:'2026-10-14',genre:'ambient',earnedShape:'kept'},'future:voice':{day:'2026-10-14',genre:'future',learned:[1,3,5]}}});
assert.equal(preserved.extension.earned,7);assert.equal(preserved.found['rhythm:stone'].earnedShape,'kept');assert.deepEqual(preserved.unrecognizedFound['future:voice'].learned,[1,3,5]);
const restored=normalizeElementBook({...preserved,unrecognizedFound:{...preserved.unrecognizedFound,'rhythm:roots':{day:'2026-10-14',genre:'ambient'}}});assert(restored.found['rhythm:roots']);assert(!Object.hasOwn(restored.unrecognizedFound,'rhythm:roots'));assert(restored.unrecognizedFound['future:voice']);
const newer={version:9,found:{'rhythm:stone':{day:'2026-10-14',genre:'ambient'},'future:voice':{earned:99}},extension:{reward:8}};assert.equal(normalizeElementBook(newer),newer);assert.equal(migrateElementBook({elementBook:newer,rhythmFound:{roots:1}}),newer);
r.S={todayKey:'2026-10-14',elementBook:newer};const snapshot=JSON.stringify(newer);r.elementBookUI();assert(!r.recordElement('rhythm:roots'));assert.equal(JSON.stringify(r.S.elementBook),snapshot);assert.match(badge.textContent,/versión posterior/);assert.equal(r.elementFamilyCount,1);assert.match(r.elementBookCards(),/siguen guardados/);
console.log('PASS unknown discoveries and metadata retained, recognized quarantine restored, future book readonly and honest visible counts');
