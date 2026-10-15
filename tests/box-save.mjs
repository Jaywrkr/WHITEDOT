import assert from 'node:assert/strict';
import {initialize,normalizeGiftBoxes} from '../src/cajas.js';
const box={id:'regalo:old',x:12,y:24,power:'cometa',hue:20},future={id:'regalo:future',x:12,y:24,power:'future-power'};
assert.equal(normalizeGiftBoxes([box,box,{...box,id:'bad'},future,{...box,id:'regalo:bad',x:Infinity}]).length,1);
const s={wx:0,wy:0,boxPowers:{version:1,remaining:{cometa:41000,futurePower:99},custom:'kept'},giftBoxes:[box,future]};
const r={S:s,inWorld:()=>true};initialize(r);assert.equal(r.powerSecondsLeft('cometa'),41);assert.equal(r.snapshotPowers().remaining.futurePower,99);assert.equal(r.snapshotPowers().custom,'kept');
r.spawnBox(8,9,'campo');assert(s.giftBoxes.some(b=>b.power==='future-power'),'unknown gifts stay in the save');
const other={...s,boxPowers:{version:9,payload:'future-progress'}};r.S=other;assert.deepEqual(r.snapshotPowers(),other.boxPowers,'newer power formats are never overwritten');assert.equal(r.powerSecondsLeft('cometa'),0);
console.log('PASS versioned active-time power saves, unknown data preservation and durable gift validation');
