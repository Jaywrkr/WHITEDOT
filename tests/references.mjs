import assert from 'node:assert/strict';
import {REFERENCE_GENRES,REFERENCE_STEPS,REFERENCE_BASS,referenceRhythm} from '../src/references.js';
import {createRegionalVoices} from '../src/voices.js';import {INSTRUMENTS} from '../src/journal.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);const found=new Map();
for(let x=-30;x<=30;x++)for(let y=-30;y<=30;y++){const d=r.regionOfPos(x*3600+900,y*3600+900);if(REFERENCE_GENRES[d.genre])found.set(d.genre,d);}
assert.equal(found.size,12,'some musical references are unreachable');const rhythms=new Set();
for(const [id,g]of Object.entries(REFERENCE_GENRES)){
 const d=found.get(id);assert(g.bpm[0]<=d.bpm&&d.bpm<=g.bpm[1]);assert(g.scales.some(s=>JSON.stringify(s)===JSON.stringify(d.scale)));
 const voices=createRegionalVoices(d,r.BIOMES,r.GEN,r.seedOf,r.rng);for(const v of Object.values(voices)){
  assert(INSTRUMENTS[v.instrument],`missing instrument explanation: ${v.instrument}`);
  if(v.role==='bajo')assert(g.bassP.includes(v.instrument));else if(v.role==='perc')assert(g.percP.includes(v.instrument));else assert(g.hookP.includes(v.instrument));
 }
 assert(REFERENCE_STEPS[id].includes(0)&&REFERENCE_BASS[id].includes(0));
 const pattern=referenceRhythm(id,0);assert(pattern.kick.length>0);Object.values(pattern).forEach(steps=>steps.forEach(s=>assert(Number.isInteger(s)&&s>=0&&s<16)));
 rhythms.add(JSON.stringify(pattern));
}
assert.equal(rhythms.size,12);assert.notDeepEqual(referenceRhythm('algorave',0).wood,referenceRhythm('algorave',1).wood);
assert.equal(r.GEN.amapiano.bassI,'logdrum');assert.equal(r.GEN.liquid.bpm[0],168);assert(r.GEN.jazztronica.melodyDegrees.includes(6));
console.log('PASS: twelve reachable reference families, distinct drum grammars, characteristic palettes, pentatonic/extended melody vocabulary and log drum');
