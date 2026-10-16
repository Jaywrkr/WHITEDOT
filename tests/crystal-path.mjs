import assert from 'node:assert/strict';
import {initialize,crystalField,pathCrystalField} from '../src/crystal-sparks.js';
import {validateSave} from '../src/save-store.js';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
const seedOf=s=>{let h=2166136261;for(const ch of s)h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0;};
const field=crystalField(0,0,seedOf);for(const a of field)for(const b of field)if(a!==b)assert(Math.hypot(a.x-b.x,a.y-b.y)>110,'crystals have breathing room');
const counts=Array.from({length:30},(_,i)=>crystalField(i*1200,0,seedOf).length);assert(Math.max(...counts)>Math.min(...counts)*2,'abundance varies by region');
let paused=false,entered=0;globalThis.document={hidden:false,querySelector:()=>null,getElementById:()=>({hidden:true})};globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};data(r);progress(r);r.S.todayKey=r.dayKey();r.S.mode='camino';r.S.sound=false;r.S.todayLight=100;
assert(!r.worldReady(),'old lights cannot unlock the new gate');
const oldWorld=validateSave({mode:'world',sparks:43},r.fresh(),r.worldIdentity);assert.equal(oldWorld.pathCrystals.length,10);assert.equal(oldWorld.sparks,43);
const oldPath=validateSave({mode:'camino',todayLight:120},r.fresh(),r.worldIdentity);assert.equal(oldPath.pathCrystals.length,0,'legacy lights never bypass the new Camino');
Object.assign(r,{waves:[],unlock(){},showPhrase(){},setBiome(){},hud(){},enterWorld(options){assert.deepEqual(options,{automatic:true});assert.equal(r.S.pathCrystals.length,10);r.S.mode='world';entered++;}});
initialize(r);r.crystalTick(.02);
for(let i=0;i<10;i++){
 const o=pathCrystalField(i*160,r.pathY,r.S.todayKey).find(p=>p.id.endsWith(':'+i));r.S.px=o.x;r.S.py=o.y-20;r.waves=[];r.crystalTick(.02);
 const wave={x:o.x-10,y:o.y,r:11,prev:9,origin:'player'};r.waves=[wave];
 r.crystalTick(.02,true);assert.equal(r.S.pathCrystals.length,i,'paused frames cannot mine');
 r.crystalTick(.02);assert.equal(r.S.pathCrystals.length,i+1);r.crystalTick(.02);
 assert.equal(entered,i===9?1:0);if(i<9)assert(!r.worldReady());
}
assert.equal(r.S.sparks,10);assert(r.worldReady());assert.equal(entered,1);
const saved=r.S.pathCrystals.slice();r.S.mode='camino';r.waves=[];r.crystalTick(.02);assert.equal(r.S.mode,'camino','returning to the Camino does not immediately re-enter');r.S.mode='camino';r.S.pathCrystals=saved.slice(0,9);r.S.px=90;r.S.py=r.pathY(90);r.waves=[];r.crystalTick(.02);const o=pathCrystalField(90,r.pathY,r.S.todayKey).find(p=>p.id.endsWith(':0'));
r.waves=[{x:o.x-10,y:o.y,r:11,prev:9,origin:'player'}];r.crystalTick(.02);assert.equal(r.S.pathCrystals.length,9,'saved broken crystals cannot count twice');
r.S.todayKey='2000-01-01';r.S.mode='camino';r.checkDay();assert.equal(r.S.pathCrystals.length,0,'new day restores the ten-crystal goal');
console.log('PASS regional gaps/abundance, mandatory ten unique broken crystals, automatic entry without prompt, paused mining, saved depletion and day reset');
