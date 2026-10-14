import {createHash} from 'node:crypto';
import {influenceProfile} from '../src/influence.js';
import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {RHYTHM_KINDS,RHYTHM_ELEMENTS,createRhythmElements,rhythmVoice,rhythmPattern} from '../src/percussion-model.js';
import {initialize} from '../src/percussion.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};globalThis.document={hidden:false,querySelector:()=>null};
const r={};data(r);progress(r);world(r);r.S.mode='world';const region=r.regionOfPos(900,900),families=new Set(),fingerprints=new Set();
for(let x=-40;x<40;x++)for(let y=-20;y<20;y++){
 const a=createRhythmElements(x,y,900,region,r.seedOf,r.rng);assert.deepEqual(a,createRhythmElements(x,y,900,region,r.seedOf,r.rng));assert(a.length<=3);
 fingerprints.add(JSON.stringify(a));for(const o of a){families.add(o.kind);assert(o.x>=x*900&&o.x<(x+1)*900);assert(o.y>=y*900&&o.y<(y+1)*900);}
}assert.equal(families.size,9);assert(fingerprints.size>1800);assert.deepEqual(createRhythmElements(0,0,900,{sea:true},r.seedOf,r.rng),[]);
for(const g of Object.keys(r.GEN))for(const k of [...RHYTHM_KINDS,'fossil']){
 const v=rhythmVoice('rhythm:'+k+':3',{...region,genre:g},r.seedOf);assert.equal(v.role,'perc');assert(v.low<=60);assert(RHYTHM_ELEMENTS[k].voices.includes(v.instrument)||['wood','rim'].includes(v.instrument));
 const pattern=rhythmPattern(k,g,3);assert(pattern.length===2&&pattern[0]<pattern[1]&&pattern.every(n=>n>=0&&n<16));
}
assert.equal(influenceProfile(region,'rhythm:stone:0',null,r.seedOf,r.rng).channel,'bass');
assert.equal(influenceProfile(region,'rhythm:reeds:0',null,r.seedOf,r.rng).channel,'groove');
const ordinary=[];for(let x=-20;x<20;x++)for(let y=-20;y<20;y++)ordinary.push(createRhythmElements(x,y,900,region,r.seedOf,r.rng).filter(o=>o.kind!=='fossil'));
assert.equal(createHash('sha256').update(JSON.stringify(ordinary)).digest('hex'),'34f30788b055c6a618e8cd272234f1660bfa2a78121c59e46705bee41e74740d','RC2 ordinary percussion placements stay intact');
assert.equal(rhythmVoice('rhythm:bad',region,r.seedOf),null);
let modal=false;document.querySelector=()=>modal?{}:null;const q=[],hits=[],found=[];
Object.assign(r,{MU:{step:0},ac:{state:'running',currentTime:0},SIX:.125,body:{x:0,y:0,px:0,py:0,ready:true,jump:false,speed:0},labRhythm:'stone',getVoice:(k,g)=>rhythmVoice(k,g,r.seedOf),beatSoon:fn=>q.push(fn),playVoice:(...args)=>hits.push(args),recordElement:id=>found.push(id),currentPocket:()=>null});
initialize(r);const stone=r.nearbyPercussion(1e6)[0];r.S.wx=stone.x;r.S.wy=stone.y;
function move(x,y,dt=.05){Object.assign(r.body,{px:r.body.x,py:r.body.y,x,y});r.S.wx=x;r.S.wy=y;r.percussionTick(dt);}
move(stone.x-80,stone.y);move(stone.x,stone.y);assert.equal(q.length,1);q.shift()(1);assert.equal(hits.length,1);assert.deepEqual(found,['rhythm:stone']);
for(let i=0;i<25;i++)move(stone.x,stone.y);assert.equal(q.length,0,'held contact does not queue repeated touches');
r.percussionStep(0,0,2);assert.equal(hits.length,3,'holding adds a bounded two-hit groove');r.percussionStep(0,0,2);assert.equal(hits.length,3,'one held phrase per shared bar');
modal=true;r.percussionStep(0,1,4);move(stone.x,stone.y);assert.equal(hits.length,3);assert.equal(q.length,0);
modal=false;r.S.sound=false;move(stone.x-80,stone.y);move(stone.x,stone.y);assert.equal(q.length,0);r.percussionStep(0,2,6);assert.equal(hits.length,3);
r.S.sound=true;move(stone.x-80,stone.y,.8);move(stone.x,stone.y);assert.equal(q.length,1);r.S={...r.S,rhythmFound:{}};q.shift()(8);assert.equal(hits.length,3,'queued notes from a replaced save are discarded');
r.MU.step=32;const next=r.nearbyPercussion(1e6)[0],beforeHits=hits.length;
for(let i=0;i<6;i++){move(next.x-80,next.y,.8);move(next.x,next.y,.8);assert.equal(q.length,1);q.shift()(10+i*.4);}
assert.equal(hits.length,beforeHits+4,'manual strokes share one musical bar budget, independent of timestamp drift');
r.MU.step=48;move(next.x-80,next.y,.8);move(next.x,next.y,.8);q.shift()(13);assert.equal(hits.length,beforeHits+5,'next musical bar rearms budget');
r.nearbyPercussion();r.labRhythm=null;for(let x=0;x<90;x++){r.S.wx=x*900;r.S.wy=900;r.nearbyPercussion();}assert(r.percussionCacheSize<=64);
console.log('PASS nine deterministic percussion families, all genre voices, sparse bounded placement, native entry/hold, mute, modal, save isolation and shared budget');
