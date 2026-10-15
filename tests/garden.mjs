import assert from 'node:assert/strict';
import {normalizeGarden,addGardenCard,gardenScore,saveGardenSet} from '../src/garden-model.js';
const b=normalizeGarden({extra:'keep'}),cards=Array.from({length:5},(_,i)=>({id:'card'+i,context:{role:['bajo','perc','acorde','lead'][i%4]}}));
for(const c of cards.slice(0,4))assert(addGardenCard(b,c));assert(!addGardenCard(b,cards[4]));assert(!addGardenCard(b,cards[0]));assert(saveGardenSet(b));b.cards.pop();assert.equal(b.sets[0].cards.length,4);assert.equal(b.extra,'keep');const o=gardenScore(cards[1],1,{x:20,y:-2});assert.equal(o.role,'perc');assert(o.x<=.95&&o.y>=.1);assert.deepEqual(gardenScore(cards[0],0),gardenScore(cards[0],0));assert(!addGardenCard(normalizeGarden({version:9}),cards[0]));
console.log('PASS four non-consuming card voices, deterministic score/positions, independent saved sets and future-readonly gardens');
