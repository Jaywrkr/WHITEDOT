import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {HYBRID_STYLES,hybridIdentity,hybridRegister} from '../src/musical-hybrids.js';
import {createRadio} from '../src/radio.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const found=new Map(),genres=new Set();let native=0;
for(let x=-28;x<=28;x++)for(let y=-28;y<=28;y++){
 const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600),before=JSON.stringify(d),h=hybridIdentity(d,r.seedOf,r.rng);
 assert.equal(JSON.stringify(d),before,'hybrids must never mutate a stored world recipe');if(d.sea)continue;genres.add(d.genre);
 if(h){assert.deepEqual(h,hybridIdentity(d,r.seedOf,r.rng));if(!found.has(h.id))found.set(h.id,d);}else native++;
}
assert.equal(genres.size,52);assert.equal(found.size,HYBRID_STYLES.length);assert(native>100,'pure styles must remain common');
const signatures=new Set();
for(const [id,d]of found){const radio=createRadio(r.seedOf,r.rng,r.GEN),heard=[];
 for(let bar=0;bar<128;bar++){
  const f=radio.advance(d,bar);assert.equal(f.hybrid.id,id);assert(f.grammar.brightness<=f.hybrid.brightness);
  assert(f.hook.every(n=>n===-1||Number.isInteger(n)&&n>=0&&n<=6));assert(f.hook.filter(n=>n>=0).length<=4);
  if(f.melodyRest)assert(f.hook.every(n=>n<0));assert(f.identity.hooks.includes(f.hookI));
  heard.push(JSON.stringify([f.hook,f.hookI,f.grammar.progression,f.expression.toneScale,f.identity.swing]));
 }assert(new Set(heard).size>3,'a static location must develop its composition');signatures.add(heard.join('|'));
 const lower=hybridRegister({role:'lead',low:52,high:76},hybridIdentity(d,r.seedOf,r.rng));assert(lower.low<lower.high&&lower.high<=76);
 const shared=createRadio(r.seedOf,r.rng,r.GEN).advance(d,0,{room:'shared-room'});assert(!shared.hybrid,'room transport must retain its existing agreed harmony');
}
assert.equal(signatures.size,HYBRID_STYLES.length);assert.equal(HYBRID_STYLES.find(h=>h.id==='blues-machine').progression.length,12);
console.log('PASS 18 reachable compositional influences, 52 retained styles, pure worlds, immutable DNA, evolving diatonic phrases, spectral/density limits and room harmony');

assert.equal(hybridIdentity(found.get('blues-machine'),r.seedOf,r.rng).harmonyBars,1,'twelve chord positions correspond to twelve musical bars');
