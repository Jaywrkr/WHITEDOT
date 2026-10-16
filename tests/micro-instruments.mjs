import assert from 'node:assert/strict';
import {MICRO_INSTRUMENTS,MICRO_IDS,microChunk,microTerritory,microVoice,microPath,microKit,microArticulation,microPattern} from '../src/micro-instruments-model.js';
import {MICRO_SYNTHS} from '../src/micro-synthesis.js';
import {INSTRUMENT_SPECS} from '../src/instruments.js';
import {initialize as micro} from '../src/micro-instruments.js';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {normalizeRareBook,makeRareCard,rarityLabel} from '../src/rare-card-model.js';
import {normalizeElementBook,elementFamily} from '../src/element-book-model.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);const seed=r.seedOf,rng=r.rng;
assert.equal(MICRO_IDS.length,10);assert.equal(Object.keys(MICRO_SYNTHS).length,6);assert.equal(new Set(MICRO_IDS.map(microPath)).size,10);
let count=0,primary=0,empty=0;const found=new Set(),profiles=new Set(),genres=Object.keys(r.GEN);
for(let x=-25;x<25;x++)for(let y=-25;y<25;y++){
 const d={key:x+','+y,genre:genres[((x+25)*50+y+25)%genres.length]},before=JSON.stringify(d),profile=microTerritory(d,seed),items=microChunk(x,y,900,d,seed,rng);profiles.add(profile.primary+':'+profile.secondary);
 assert.deepEqual(items,microChunk(x,y,900,d,seed,rng));assert.equal(JSON.stringify(d),before);if(!items.length)empty++;
 for(const o of items){found.add(o.kind);count++;if(o.kind===profile.primary)primary++;assert(Math.abs(o.x-(x+.5)*900)<450);assert(Math.abs(o.y-(y+.5)*900)<450);assert(o.variant>=0&&o.variant<64);const v=microVoice('micro:'+o.kind,o);assert(v.low<v.high&&v.high<=69);assert(INSTRUMENT_SPECS[v.instrument]||['kick','snare','clap','hat','tom'].includes(v.instrument));assert(MICRO_INSTRUMENTS[o.kind].hint.split(/\s+/).length<=12);assert.equal(elementFamily('micro:'+o.kind),'micro:'+o.kind);}
}
assert.equal(found.size,10);assert(primary/count>.6);assert(empty>1400);assert(profiles.size>20);
assert.deepEqual(microChunk(0,0,900,{sea:true},seed,rng),[]);assert.deepEqual(microChunk(0,0,900,{anomaly:'canon'},seed,rng),[]);
assert.equal(new Set(Array.from({length:5},(_,entry)=>microVoice('micro:drum',{variant:0,entry}).instrument)).size,5);
assert.deepEqual(new Set(microPattern('drum',0).map(playStep=>microVoice('micro:drum',{variant:0,playStep}).instrument)),new Set(['kick','snare','hat']),'holding a drum plays complementary kit parts, not one hit in a loop');
assert.equal(microArticulation({parameter:Infinity}).pressure,.35);assert.equal(microArticulation({parameter:4}).pressure,1);assert.deepEqual(microPattern('arp'),[0,4,8]);assert.notDeepEqual(microKit({key:'0,0',genre:'deep'},seed),microKit({key:'1,0',genre:'deep'},seed));
const world={seed:'',layout:'classic',generatorVersion:2,catalogVersion:2,layoutVersion:2};
for(const kind of ['grain','ring']){const c=makeRareCard({type:'micro:'+kind,sourceId:'micro:v1:0,0:0',world});assert(c);assert.match(rarityLabel(c.type),/1\/64/);assert.equal(normalizeRareBook({version:1,items:[c]}).items.length,1);}
const saved={version:1,found:{arbol:{day:'2026-10-16',genre:'deep'},'micro:acid':{day:'2026-10-16',genre:'acid'}}};assert.deepEqual(normalizeElementBook(saved),saved);
let hidden=false,modal=false;globalThis.document={get hidden(){return hidden;},querySelector:()=>modal?{}:null};let played=[],queued=[],saves=0,gestures=0;
const d={key:'0,0',genre:'minimal'},fake={visualGesture:()=>gestures++,S:{wx:0,wy:0,sound:true,layer:'superficie'},MU:{step:0},WCH:900,seedOf:seed,rng,inWorld:()=>true,regionOfPos:()=>d,ac:{state:'running'},body:{ready:true,jump:false,x:0,y:0,px:0,py:0},playVoice:(...args)=>{played.push(args);return true;},getVoice:(kind,d,o)=>microVoice(kind,o),beatSoon:fn=>queued.push(fn),save:()=>saves++};
micro(fake);let fixture;for(let x=-8;x<=8&&!fixture;x++){fake.S.wx=x*900;fixture=fake.microNear(700)[0];}assert(fixture);fake.S.wx=fake.body.x=fixture.x;fake.S.wy=fake.body.y=fixture.y;fake.body.px=fixture.x-10;fake.body.py=fixture.y;fake.microTick(.05);assert(queued.length);queued.shift()(1);assert.equal(played.length,1);for(let i=0;i<10;i++)fake.microTick(.05);assert.equal(queued.length,0,'holding never creates contact spam');
const oldKind=fixture.kind;fixture.kind='drum';fixture.variant=0;fixture.dwell=1;const kitCues=[];fake.microNoteCue=n=>kitCues.push(n);
for(let s=0;s<16;s++)fake.microStep(s,0,2+s*.125);
assert.deepEqual(new Set(kitCues.map(n=>n.voice.instrument)),new Set(['kick','snare','hat']));assert(!Object.hasOwn(fixture,'playStep'),'temporary articulation must not leak into the next contact');fixture.kind=oldKind;
const before=played.length;hidden=true;fake.microPulse();fake.microStep(0,1,2);assert.equal(played.length,before);hidden=false;modal=true;fake.microPulse();assert.equal(queued.length,0);modal=false;fake.noticeLane={inspecting:true};fake.microPulse();assert.equal(queued.length,0);fake.noticeLane=null;
for(let i=0;i<40;i++)fake.microTick(.05);const visualBefore=gestures;fake.S.sound=false;assert(fake.microTouch(fixture));assert.equal(gestures,visualBefore+1,'muted contact still gives visual feedback');assert.equal(queued.length,0);fake.S.sound=true;for(let i=0;i<20;i++)fake.microTick(.05);fake.microTouch(fixture);const pending=queued.splice(0);fake.S={...fake.S};for(const fn of pending)fn(3);assert.equal(played.length,before,'old world callbacks cannot play in a new save');
for(let i=0;i<100;i++){fake.S.wx=i*900;fake.microNear(900);}assert(fake.microCacheSize<=64);assert(saves>0);
console.log('PASS ten seeded families, regional predominance, quiet gaps, distinct voices/shapes, 1/64 variants, preserved collection, contact edges, modal/mute guards and bounded cache');
