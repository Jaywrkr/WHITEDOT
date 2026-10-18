import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {createRadio} from '../src/radio.js';import {createReferenceRadio} from '../src/radio-reference.js';import {musicFamily} from '../src/music-families.js';import {labNoteEvents} from '../src/lab-score.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const fixture=JSON.parse(readFileSync(new URL('./music-reference-acd766f.json',import.meta.url)));let comparisons=0;
for(const {region,frames}of fixture.rows){const radio=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true,reference:()=>true}),before=JSON.stringify(region);
 for(let bar=0;bar<=64;bar++){const f=radio.advance(region,bar),old=frames.find(n=>n.bar===bar);if(!old)continue;
  const original=createReferenceRadio(r.seedOf,r.rng,r.GEN);let historical;for(let i=0;i<=bar;i++)historical=original.advance(region,i);for(const key of ['section','phrase','melodyRest','hookI','bass','hook','grammar','expression'])assert.deepEqual(historical[key],old[key],region.genre+' historical '+key);if(!musicFamily(region.genre))for(const key of ['section','phrase','melodyRest','hookI','bass','hook','grammar','expression'])assert.deepEqual(f[key],old[key],region.genre+' '+key);
  if(!musicFamily(region.genre))assert.equal(f.bassI,region.track.bassI);assert.equal(f.referenceOrigin,'acd766f');if(!region.sea)assert(f.labScore&&f.direction&&f.phrasing,'retain modern accompaniment');else assert(!f.labScore,'empty seas retain the native ambient path');
  if(f.labScore)for(let step=0;step<16;step++){const primary=labNoteEvents(f,step,bar).find(e=>e.role==='lead'&&!e.part);assert.equal(primary?.degree??-1,f.melodyRest?-1:f.hook[step],region.genre+' primary phrase must survive modern release/bridge');}
  comparisons++;
 }
 assert.equal(JSON.stringify(region),before);assert(!radio.advance(region,65,{room:'shared'}).referenceOrigin,'duet agreement is preserved');
}
assert.equal(comparisons,96);
const silent={referenceOrigin:'acd766f',melodyRest:true,hookI:'rhodes',hook:Array(16).fill(-1),bass:Array(16).fill(-1),labScore:{electronic:{count:1,layers:['motif'],pool:['rhodes']},genre:'ambient',variant:0,leads:['rhodes'],scene:5,ensemble:1},phrasing:{name:'bridge',local:1}};assert(labNoteEvents(silent,0,0).some(e=>e.part==='foundation'&&e.degree===0&&e.instrument==='rhodes'));assert.equal(labNoteEvents(silent,8,0).filter(e=>e.part==='foundation').length,0,'one quiet pulse per bar, no pad or note lottery');console.log('PASS 96 historical acd766f frames intact; unaffected production styles retained; expanded families agree with their emitted motifs; immutable maps and duet agreement retained');
