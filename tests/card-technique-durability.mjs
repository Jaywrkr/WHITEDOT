import assert from 'node:assert/strict';
import {commitCardTechnique} from '../src/rare-card-model.js';
const card={learning:{version:1,techniques:['normal','muted'],selected:'normal'},id:'keep'},original=structuredClone(card);
assert.equal(commitCardTechnique(card,()=>false),null);assert.deepEqual(card,original);
assert.equal(commitCardTechnique(card,()=>{throw Error('quota');}),null);assert.deepEqual(card,original);
assert.equal(commitCardTechnique(card,()=>true),'muted');assert.equal(card.learning.selected,'muted');
const future={learning:{version:9,payload:'keep'}};assert.equal(commitCardTechnique(future,()=>{throw Error('must not write');}),null);assert.deepEqual(future,{learning:{version:9,payload:'keep'}});
const old={learning:{version:1,techniques:['normal','muted']}};commitCardTechnique(old,()=>false);assert(!Object.hasOwn(old.learning,'selected'));
console.log('PASS card technique: successful choice retained, failed/throwing writes restore exact selection, future format untouched');
