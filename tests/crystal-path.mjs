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
r.S.todayKey='2000-01-01';r.S.mode='camino';r.checkDay();assert.equal(r.S.pathCrystals.length,0,'new day restores the ten-crystal goal');assert(!r.worldOpened()&&!r.worldReady(),'a new player who never opened the World still needs the ten crystals');
console.log('PASS regional gaps/abundance, mandatory ten unique broken crystals, automatic entry without prompt, paused mining, saved depletion and day reset');

r.S.mode='camino';r.S.pathCrystals=Array.from({length:10},(_,i)=>'earned:'+i);r.S.sparks=10;const extraPath=pathCrystalField(5000,r.pathY,r.S.todayKey).at(4);r.S.px=extraPath.x;r.S.py=extraPath.y-20;r.waves=[];r.crystalTick(.02);r.waves=[{x:extraPath.x-10,y:extraPath.y,r:11,prev:9,origin:'player'}];r.crystalTick(.02);assert(r.crystalState.near.find(o=>o.id===extraPath.id).broken);assert.equal(r.S.sparks,10);assert.equal(r.S.pathCrystals.length,10);assert.equal(r.S.mode,'camino');
console.log('PASS real fallback pulse breaks further Camino crystals without payment or re-entry');

// Panel 11 (Q6, D7-C): whoever opened the World once comes back where they were on a new day, also mid-Journey.
{const yesterday=new Date(Date.now()-864e5),key=yesterday.getFullYear()+'-'+String(yesterday.getMonth()+1).padStart(2,'0')+'-'+String(yesterday.getDate()).padStart(2,'0');
 const back={};data(back);progress(back);let exits=0,entries=0,toasts=0;Object.assign(back,{waves:[],unlock(){},showPhrase(){},setBiome(){},hud(){},toast(){toasts++;},exitWorld(){exits++;back.S.mode='camino';},enterWorld(){entries++;back.S.mode='world';}});
 Object.assign(back.S,{mode:'world',wx:48210,wy:-9120,layer:'superficie',todayKey:key===back.dayKey()?'2000-01-01':key,lastWorldDay:key,pathCrystals:Array.from({length:10},(_,i)=>'old:'+i),sparks:40,journey:{mode:'viaje',chapter:3,done:{llanura:true,lago:true}}});
 back.checkDay(true);
 assert.equal(back.S.mode,'world','a save in the Bosque with yesterday\'s todayKey loads in the World');assert.equal(exits,0);assert.equal(toasts,0,'no notice on load');
 assert.deepEqual([back.S.wx,back.S.wy,back.S.layer],[48210,-9120,'superficie'],'right where the player was');assert.equal(back.S.journey.chapter,3,'mid-Journey progress kept');
 assert.equal(back.S.todayKey,back.dayKey());assert.equal(back.S.lastWorldDay,back.S.todayKey,'today is a World day: no daily jump on load');
 assert.equal(back.S.pathCrystals.length,0,'the day\'s Camino comes back');assert(back.worldReady(),'the World stays open without the ten crystals');
 // The day's Camino is a walk: its crystals still pay sparks; the tenth one does not pull the player into the World.
 back.S.mode='camino';back.S.sound=false;back.S.journey={mode:'libre'};initialize(back);back.crystalTick(.02);
 for(let i=0;i<10;i++){const o=pathCrystalField(i*160,back.pathY,back.S.todayKey).find(p=>p.id.endsWith(':'+i));back.S.px=o.x;back.S.py=o.y-20;back.waves=[];back.crystalTick(.02);back.waves=[{x:o.x-10,y:o.y,r:11,prev:9,origin:'player'}];back.crystalTick(.02);back.crystalTick(.02);}
 assert.equal(back.S.pathCrystals.length,10);assert.equal(back.S.sparks,50,'the walk\'s crystals still give ✦');assert.equal(entries,0,'no forced entry for a returning player');assert.equal(back.S.mode,'camino');
 // Old saves: the «mundo» achievement alone proves the World was opened; a Camino save stays in the Camino.
 const old={};data(old);progress(old);Object.assign(old,{unlock(){},showPhrase(){},setBiome(){},hud(){},exitWorld(){throw Error('no exit');}});Object.assign(old.S,{mode:'camino',todayKey:'2000-01-01',lastWorldDay:null,ach:{mundo:'2026-09-01'}});
 old.checkDay(true);assert.equal(old.S.mode,'camino','where they were: the Camino');assert(old.worldReady(),'legacy achievement keeps the World open');assert.equal(old.S.ach.mundo,'2026-09-01');
 // Studio left from the World returns to the World on a new day.
 const st={};data(st);progress(st);Object.assign(st,{unlock(){},showPhrase(){},setBiome(){},hud(){}});Object.assign(st.S,{mode:'studio',prevMode:'world',todayKey:'2000-01-01',lastWorldDay:'1999-12-31'});st.checkDay(true);assert.equal(st.S.prevMode,'world');assert.equal(st.S.lastWorldDay,st.S.todayKey);
}
console.log('PASS D7-C: returning player loads where they were (World mid-Journey, Camino, Studio), the day\'s Camino pays ✦ as a walk without forced entry, new players still need ten crystals');
