import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {createRadio} from '../src/radio.js';import {labNoteEvents} from '../src/lab-score.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const fixture=JSON.parse(readFileSync(new URL('./music-reference-acd766f.json',import.meta.url)));let comparisons=0;
for(const {region,frames}of fixture.rows){const radio=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true,reference:()=>true}),before=JSON.stringify(region);
 for(let bar=0;bar<=64;bar++){const f=radio.advance(region,bar),old=frames.find(n=>n.bar===bar);if(!old)continue;
  for(const key of ['section','phrase','melodyRest','hookI','bass','hook','grammar','expression'])assert.deepEqual(f[key],old[key],region.genre+' '+key);
  assert.equal(f.bassI,region.track.bassI);assert.equal(f.referenceOrigin,'acd766f');if(!region.sea)assert(f.labScore&&f.direction&&f.phrasing,'retain modern accompaniment');else assert(!f.labScore,'empty seas retain the native ambient path');
  if(f.labScore)for(let step=0;step<16;step++){const primary=labNoteEvents(f,step,bar).find(e=>e.role==='lead'&&!e.part);assert.equal(primary?.degree??-1,old.melodyRest?-1:old.hook[step],region.genre+' primary phrase must survive modern release/bridge');}
  comparisons++;
 }
 assert.equal(JSON.stringify(region),before);assert(!radio.advance(region,65,{room:'shared'}).referenceOrigin,'duet agreement is preserved');
}
assert.equal(comparisons,96);console.log('PASS 96 frames from actual acd766f across 12 styles: native motifs, bass, lead, grammar, expression and sections; modern guests, immutable maps and duet agreement retained');
