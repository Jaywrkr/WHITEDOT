import assert from 'node:assert/strict';
import {CUBE_SHOP,CUBE_SHOP_SLOTS,normalizeWear,shopPiece,wearing,normalizeRoute,rollRoute,thinRoute} from '../src/cube-shop-model.js';
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
// Batch 2: one eye and one accessory worn at a time, habits switched on together.
const batch2=CUBE_SHOP.filter(p=>['eyes','habits','accessory'].includes(p.slot));assert.equal(batch2.length,13);assert.equal(batch2.reduce((a,p)=>a+p.cost,0),450);
q=normalizeSparkEconomy({purchases:Object.fromEntries(batch2.map(p=>[p.id,true])),wear:{eyes:'eyes:sleepy',accessory:'acc:hat',habits:'habit:yawn'},on:{'habit:yawn':true,'habit:dizzy':true,'eyes:curious':true}},10,'d');
assert.deepEqual(q.wear,{eyes:'eyes:sleepy',accessory:'acc:hat'});assert.deepEqual(q.on,{'habit:yawn':true,'habit:dizzy':true});
// Batch 3: trails and companions, and the bounded route kept by Huellas del día and Fantasma de ayer.
const batch3=CUBE_SHOP.filter(p=>['trail','companion'].includes(p.slot)&&p.id.includes(':')&&p.id!=='trail:notes');assert.equal(batch3.length,10);assert.equal(batch3.reduce((a,p)=>a+p.cost,0),2375);
let r=normalizeRoute({day:'2026-10-19',today:[[1.4,2.6],['x',1],[1,2,3],[Infinity,0],...Array.from({length:700},(_,i)=>[i,i])],yday:'nope',yesterday:'x',future:7});
assert.equal(r.today.length,600);assert.deepEqual(r.today[0],[100,100]);assert.equal(r.yday,'');assert.deepEqual(r.yesterday,[]);assert.equal(r.future,7);
r=rollRoute(r,'2026-10-20');assert.equal(r.day,'2026-10-20');assert.deepEqual(r.today,[]);assert.equal(r.yday,'2026-10-19');assert.equal(r.yesterday.length,120);assert.deepEqual(r.yesterday.at(-1),[699,699]);
assert.equal(rollRoute(r,'2026-10-20'),r);assert.equal(rollRoute(r,'2026-10-21').yday,'2026-10-19');assert.equal(thinRoute([[0,0],[1,1]]).length,2);
// Batch 4: pulse looks (one at a time, facet included) and gestures (several at once).
const batch4=CUBE_SHOP.filter(p=>/^(pulse|gesture):/.test(p.id));assert.equal(batch4.length,12);assert.equal(batch4.reduce((a,p)=>a+p.cost,0),1385);
r=normalizeSparkEconomy({purchases:Object.fromEntries(batch4.map(p=>[p.id,true])),wear:{pulse:'pulse:star',gestures:'gesture:pose'},on:{'gesture:pose':true,'gesture:flip':true,'pulse:echo':true}},10,'d');
assert.deepEqual(r.wear,{pulse:'pulse:star'});assert.deepEqual(r.on,{'gesture:pose':true,'gesture:flip':true});
// Normalizing twice is stable.
assert.deepEqual(normalizeWear(q,q.purchases,q.equipped),{wear:q.wear,on:q.on});
console.log('PASS cube shop slots, former purchases migrated to their slots, three pieces worn together and newer pieces preserved; eyes, habits and accessories by slot; bounded route for steps and ghost; pulse looks and gestures by slot');
