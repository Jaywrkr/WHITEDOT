import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {initialize as world} from '../src/world.js';
import {LAB_BANDS,labScore,labDrumEvents} from '../src/lab-score.js';
import {createRadio} from '../src/radio.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};data(r);progress(r);world(r);
const found=new Map(),signatures=new Set();
for(let x=-18;x<=18;x++)for(let y=-18;y<=18;y++){
 const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600),before=JSON.stringify(d),score=labScore(d,r.seedOf,r.rng);
 assert.equal(JSON.stringify(d),before);if(!score)continue;
 assert.deepEqual(score,labScore(d,r.seedOf,r.rng));if(!found.has(score.id))found.set(score.id,d);
}
assert.equal(found.size,LAB_BANDS.length);
for(const [id,d]of found){
 const radio=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true});
 const frame=radio.advance(d,0);assert.equal(frame.labScore.id,id);assert.equal(frame.bass.length,16);assert.equal(frame.hook.length,16);
 assert(frame.labScore.leads.includes(frame.hookI));assert(frame.grammar.brightness<=frame.labScore.ceiling);
 assert.equal(d.genre,frame.genre);assert(frame.hook.filter(n=>n>=0).length<=4);
 const beats=Array.from({length:16},(_,s)=>labDrumEvents(frame.labScore,s,0,.65));
 assert(beats.every(h=>h.length<=3&&h.every(n=>n.gain>0&&n.gain<=.2)));
 signatures.add(JSON.stringify([beats,frame.bass,frame.hook,frame.hookI]));
 const shared=radio.advance(d,1,{room:'agreed'});assert(!shared.labScore);assert(!shared.hybrid);
 const legacy=createRadio(r.seedOf,r.rng,r.GEN).advance(d,0);assert(!legacy.labScore);assert.equal(legacy.genre,d.genre);
}
assert.equal(signatures.size,LAB_BANDS.length);
assert.deepEqual(labDrumEvents(null,0,0,.8),[]);
console.log('PASS nine audible territorial bands, coordinated actual drum patterns/bass/phrases, bounded gain, immutable maps and unchanged classic/room transport');
