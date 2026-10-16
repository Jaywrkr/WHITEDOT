import assert from 'node:assert/strict';
import {arrangementPhrase,phraseNotes,phraseDrums} from '../src/arrangement-phrases.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {createRadio} from '../src/radio.js';import {labNoteEvents,labDrumEvents} from '../src/lab-score.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);const origin=r.regionOfPos(900,900),forms=new Set(),signatures=new Set();
for(const genre of ['deep','nudisco','afro','minimaltechno','dnb','ambient']){
 const region={...origin,sea:false,key:'form:'+genre,genre},radio=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true});
 const before=JSON.stringify(region);for(let bar=0;bar<160;bar++){
  const f=radio.advance(region,bar);forms.add(f.phrasing.name);const notes=Array.from({length:16},(_,s)=>labNoteEvents(f,s,bar)).flat(),drums=Array.from({length:16},(_,s)=>labDrumEvents(f.labScore,s,bar,f.energy)).flat();
  assert(notes.every(n=>Number.isInteger(n.degree)&&n.degree>=0&&n.degree<=9&&n.level>0&&n.level<=1));assert(drums.length<=48);signatures.add(JSON.stringify([f.phrasing.name,f.hook,notes.map(n=>[n.part,n.degree,n.instrument])]));
 }assert.equal(JSON.stringify(region),before);
}
assert.equal(forms.size,6);assert(signatures.size>30);
const events=[{role:'lead',part:'sequence',degree:2,level:.5},{role:'bajo',degree:0,level:1}];assert.equal(phraseNotes(events,{name:'release',turn:0},0).length,1);assert.equal(phraseDrums([{instrument:'kick'},{instrument:'conga'},{instrument:'clap'}],{name:'release'},0).length,2);
assert.equal(arrangementPhrase(0,5).name,'statement');assert.equal(arrangementPhrase(7,5).name,'statement');assert.notDeepEqual(arrangementPhrase(24,0),arrangementPhrase(24,1));
console.log('PASS six evolving musical forms, stable arrival, call/response, actual withdrawn parts, bounded density, diatonic development and immutable territories');
