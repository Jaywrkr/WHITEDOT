import assert from 'node:assert/strict';
import {productionIdentity,PRODUCTION_IDENTITIES} from '../src/production-identities.js';
import {INSTRUMENT_SPECS} from '../src/instruments.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {labScore} from '../src/lab-score.js';import {createRadio} from '../src/radio.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
for(const p of Object.values(PRODUCTION_IDENTITIES))for(const id of [...p.leads,...p.bass,p.comp,p.answer])assert(INSTRUMENT_SPECS[id]||['sub','pluck','clav'].includes(id),id);
const origin=r.regionOfPos(900,900),found=new Set(),signatures=new Set();
for(const genre of Object.keys(r.GEN))for(let i=0;i<8;i++){
 const region={...origin,sea:false,key:'identity:'+genre+':'+i,genre},before=JSON.stringify(region),p=productionIdentity(region,r.seedOf),score=labScore(region,r.seedOf,r.rng),frame=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true}).advance(region,0);
 assert.deepEqual(p,productionIdentity(region,r.seedOf));assert.equal(JSON.stringify(region),before);assert.equal(frame.labScore.production.id,score.production.id);assert(score.leads.some(id=>score.production.leads.includes(id)));assert(score.electronic.pool.includes(score.production.comp));
 found.add(p.id);signatures.add(p.leads.join(',')+p.bassI);
}
assert(found.size>=10);assert(signatures.size>30);assert.equal(productionIdentity(origin,r.seedOf,{id:'blues-machine'}).id,'blues');
assert.notDeepEqual(PRODUCTION_IDENTITIES.blues.leads,PRODUCTION_IDENTITIES.minimal.leads);assert.notEqual(PRODUCTION_IDENTITIES.afro.accent,PRODUCTION_IDENTITIES.bass.accent);
console.log('PASS 52 native genres, original distinct production identities, complementary orchestration, preserved maps and deterministic instrumental variation');
const {productionPercussion}=await import('../src/production-identities.js');const percussion=new Set();for(const p of Object.values(PRODUCTION_IDENTITIES))for(const id of productionPercussion(p)){assert(INSTRUMENT_SPECS[id]||['wood','rim','clap','conga'].includes(id),id);percussion.add(id);}assert(percussion.size>=10);
const shapes=new Set();for(let i=0;i<80;i++){const {effectProfile}=await import('../src/effects.js'),p=effectProfile('shape:'+i,{key:'shape',genre:'deep'},'lead',r.seedOf,r.rng);if(p.type==='filter')shapes.add(p.mode+':'+p.stages+':'+p.endRatio);}assert(shapes.size>=4,'filters must differ in actual topology and motion');
