import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {initialize as world} from '../src/world.js';
import {createRadio} from '../src/radio.js';
import {labNoteEvents} from '../src/lab-score.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};data(r);progress(r);world(r);
// Captured by executing radio.js and its dependencies from the actual old commit.
const fixture=JSON.parse(readFileSync(new URL('./music-reference-15bbe77.json',import.meta.url))),identities=new Set();
let comparisons=0;
for(const {region,frames}of fixture.rows){
 const radio=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true}),before=JSON.stringify(region);
 for(let bar=0;bar<=64;bar++){
  const f=radio.advance(region,bar),old=frames.find(n=>n.bar===bar);
  if(!old)continue;
  assert.equal(f.section,old.section,region.genre+' native section');
  assert.equal(f.identity.id,old.identity,region.genre+' native identity');
  assert.deepEqual(f.bass,old.bass,region.genre+' original bass');
  assert.equal(f.bassI,old.bassI,region.genre+' bass timbre');
  assert.equal(f.hookI,old.hookI,region.genre+' lead timbre');
  // New ensembles may answer a formerly silent opening; active native phrases stay exact.
  if(old.hook.some(n=>n>=0))assert.deepEqual(f.hook,old.hook,region.genre+' original motif');
  assert(f.labScore.backbone);assert(f.direction);assert(f.phrasing);
  assert(f.labScore.electronic.count>=1&&f.labScore.electronic.count<=10);
  for(let step=0;step<16;step++){
   const bass=labNoteEvents(f,step,bar).find(n=>n.role==='bajo');
   if(bass)assert.equal(bass.degree,old.bass[step],'no second bass pitch rewrite');
  }
  identities.add(f.identity.id);comparisons++;
 }
 assert.equal(JSON.stringify(region),before,'recovery cannot mutate the historical map');
 const duet=radio.advance(region,65,{room:'agreed'});assert(!duet.labScore&&!duet.direction);
}
assert.equal(comparisons,72);assert(identities.size>=7);
console.log('PASS 72 historical frames across nine styles: original motifs/bass/timbres/sections with modern ensembles, harmony, room routing and unchanged maps/duets');
