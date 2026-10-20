import assert from 'node:assert/strict';
import {CUBE_SHOP,CUBE_SHOP_SLOTS,normalizeWear,shopPiece,wearing} from '../src/cube-shop-model.js';
import {normalizeSparkEconomy,SPARK_SHOP} from '../src/sparks-model.js';
// Catalog: unique ids, every piece in a known slot, former ids preserved.
assert.equal(new Set(CUBE_SHOP.map(p=>p.id)).size,CUBE_SHOP.length);assert.equal(new Set(CUBE_SHOP_SLOTS.map(s=>s.id)).size,14);
for(const p of CUBE_SHOP){assert(CUBE_SHOP_SLOTS.some(s=>s.id===p.slot),p.id);assert(Number.isSafeInteger(p.cost)&&p.cost>0);}
assert.deepEqual(['dust','facet','orbit'].map(id=>shopPiece(id)?.slot),['trail','pulse','companion']);assert.equal(SPARK_SHOP,CUBE_SHOP);
// Migration: the single former equipment moves to its slot; nothing owned is lost.
let q=normalizeSparkEconomy({purchases:{dust:'2026-10-01',facet:true,orbit:true},equipped:'facet'},10,'d');
assert.deepEqual(q.wear,{pulse:'facet'});assert.equal(q.equipped,'facet');assert(wearing(q,'facet'));assert(!wearing(q,'dust'));
// All three former pieces can be worn together now; unowned or misplaced entries are dropped.
q=normalizeSparkEconomy({purchases:{dust:true,facet:true,orbit:true},wear:{trail:'dust',pulse:'facet',companion:'orbit'},equipped:'orbit'},10,'d');
assert(['dust','facet','orbit'].every(id=>wearing(q,id)));
q=normalizeSparkEconomy({purchases:{dust:true},wear:{trail:'dust',companion:'orbit',pulse:'dust'}},10,'d');assert.deepEqual(q.wear,{trail:'dust'});
// A piece written by a newer version is kept while owned, so an older device does not erase it.
q=normalizeSparkEconomy({purchases:{'motion:roll':true},wear:{motion:'motion:roll'},on:{'sound:hihat':true}},10,'d');assert.deepEqual(q.wear,{motion:'motion:roll'});assert.deepEqual(q.on,{});
q=normalizeSparkEconomy({purchases:{'sound:hihat':true},on:{'sound:hihat':true}},10,'d');assert.deepEqual(q.on,{'sound:hihat':true});
// Normalizing twice is stable.
assert.deepEqual(normalizeWear(q,q.purchases,q.equipped),{wear:q.wear,on:q.on});
console.log('PASS cube shop slots, former purchases migrated to their slots, three pieces worn together and newer pieces preserved');
