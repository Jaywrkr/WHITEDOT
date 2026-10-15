import assert from 'node:assert/strict';
import {auditRuntime} from '../scripts/encounter-model.mjs';
import {electronicEnsemble,ensembleVoices,electronicDrum} from '../src/electronic-ensemble.js';
import {labScore,labArrangement,labNoteEvents,labDrumEvents} from '../src/lab-score.js';
import {INSTRUMENT_SPECS} from '../src/instruments.js';
const r=auditRuntime('electronic-band'),counts=new Set(),kits=new Set();let full=null,solo=null;
for(let x=-20;x<20;x++)for(let y=-20;y<20;y++){
 const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600),snapshot=JSON.stringify(d),s=labScore(d,r.seedOf,r.rng);if(!s)continue;
 const p=s.electronic;assert.equal(p.layers.length,p.count);assert.equal(new Set(p.layers).size,p.count);assert(p.count>=1&&p.count<=10);counts.add(p.count);kits.add(p.kit.seed);
 assert.equal(JSON.stringify(d),snapshot);assert.deepEqual(s,labScore(d,r.seedOf,r.rng));for(const id of p.pool)assert(INSTRUMENT_SPECS[id],id);
 const voices=ensembleVoices(p,s.leads[0],s.variant);assert.equal(new Set(Object.values(voices)).size,4);assert(!Object.values(voices).includes(s.leads[0]));
 if(p.count===10&&!full)full={d,s};if(p.count===1&&!solo)solo={d,s};
}
assert.equal(counts.size,10);assert(kits.size>500);
const base={harmonyBar:0,phrase:0,section:0,melodyRest:true,energy:.18,bass:Array(16).fill(0),hook:Array(16).fill(-1),identity:{air:.3},grammar:{hookLimit:4,brightness:7000,hookLevel:1},expression:{toneScale:1,attackScale:1}};
const parts=new Set(),drums=new Set();
for(let bar=0;bar<4;bar++){
 const frame=labArrangement({...base,harmonyBar:bar},full.s);assert(frame.energy>=.48);
 for(let step=0;step<16;step++){
  for(const e of labNoteEvents(frame,step,bar)){parts.add(e.part||e.role);assert(e.degree>=0&&e.degree<=9);assert(e.offset>=0&&e.offset<1);assert(INSTRUMENT_SPECS[e.instrument]||['sub','acid','fm','roll','pluck','reese','organb','boing'].includes(e.instrument));}
  for(const e of labDrumEvents(frame.labScore,step,bar,.6))drums.add(e.instrument);
 }
}
for(const part of ['bajo','lead','comp','answer','sequence','air'])assert(parts.has(part),part);
assert(drums.size>=4);assert(drums.has('kick'));assert([...drums].some(id=>/hat|shaker/.test(id)));
const frame=labArrangement(base,solo.s);for(let step=0;step<16;step++){assert.equal(labDrumEvents(frame.labScore,step,0,.8).length,0);assert(labNoteEvents(frame,step,0).every(e=>e.role==='lead'&&!e.part));}
const quiet=labArrangement(base,full.s,{quiet:true});assert.equal(quiet.melodyRest,true);
assert.deepEqual(labNoteEvents({...quiet,labScore:{...quiet.labScore,scene:5}},2,0).filter(e=>e.role!=='bajo'),[]);
assert.equal(electronicDrum({},'unrecognized',0,1,{}),false);
console.log('PASS all ten ensemble sizes, solo/ten-part real scores, distinct instruments/kits, arrival harmony and protected quiet/rest behavior');
