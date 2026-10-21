import assert from 'node:assert/strict';
import {normalizeHouse,HOUSE_ROOMS,encodeHouse,decodeHouse} from '../src/house-model.js';
import {CAPSULE_PRICE,CAPSULE_DECOR,CAPSULE_SOUNDS,CAPSULE_PIECES,CAPSULE_TINTS,capsulePrize,applyPrize,capsuleObjects,capsuleDefinition,HOUSE_ACHIEVEMENTS,houseValue,drawDecor,initialize} from '../src/house-capsules.js';
import {adventureProgress} from '../src/adventure-achievements.js';
// Rooms open by days or by achievements, whichever comes first; nobody loses a room.
assert.deepEqual(normalizeHouse({},0,0).unlocked,['sala']);
assert.deepEqual(normalizeHouse({},0,8).unlocked,['sala','jardin']);
assert.deepEqual(normalizeHouse({},3,0).unlocked,['sala','jardin']);
assert.deepEqual(normalizeHouse({},7,40).unlocked,['sala','jardin','azotea','sotano']);
assert.deepEqual(normalizeHouse({unlocked:['sotano']},0,0).unlocked,['sotano','sala'],'a room already open stays open');
assert(HOUSE_ROOMS.every((r,i)=>!i||r.found>HOUSE_ROOMS[i-1].found));
// Pieces are unique, sit in real rooms and sound with real instruments.
assert.equal(new Set(CAPSULE_PIECES.map(p=>p.id)).size,18);assert(CAPSULE_PIECES.every(p=>HOUSE_ROOMS.some(r=>r.id===p.room)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1));
assert(CAPSULE_SOUNDS.every(p=>['lead','perc'].includes(p.role)&&p.instrument));assert(CAPSULE_TINTS.every(c=>/^#[0-9a-f]{6}$/.test(c)));
// Draws: deterministic, new pieces of open rooms first, a colour every third capsule once something is placed, never a repeat.
const fresh=()=>normalizeHouse({objects:[{kind:'obj:origen',room:'sala',x:.5,y:.5}]},0,0);
const a=fresh(),b=fresh();assert.deepEqual(capsulePrize(a,['obj:origen']),capsulePrize(b,['obj:origen']));
const h=fresh(),seen=new Set();let tints=0;
for(let i=0;i<40;i++){const p=capsulePrize(h,['obj:origen']);if(!p)break;if(p.type==='tint'){tints++;assert.notEqual(p.color,h.tints['obj:origen']);}else{assert(!seen.has(p.piece.id),'no repeats');seen.add(p.piece.id);if(seen.size<=3)assert.equal(p.piece.room,'sala','open rooms first');}applyPrize(h,p);}
assert.equal(seen.size,18,'every piece comes out');assert(tints>=10,'colours keep coming once everything is out');assert.equal(h.capsules.count,40);
assert.equal(capsulePrize(normalizeHouse({decor:CAPSULE_PIECES.map(p=>({id:p.id,room:p.room,x:p.x,y:p.y}))}),[]),null,'nothing left without objects to paint');
// The prizes survive saving, migration and visit codes.
const saved=normalizeHouse(JSON.parse(JSON.stringify(h)),0,0);assert.equal(saved.decor.length,18);assert.equal(saved.capsules.count,40);assert(saved.tints['obj:origen']);
const visit=decodeHouse(encodeHouse(saved));assert.equal(visit.decor.length,18);assert.equal(visit.tints['obj:origen'],saved.tints['obj:origen']);
// Sounding pieces join the sequencer.
assert.equal(capsuleObjects(saved).length,1,'only the open Sala sounds on day one');assert.equal(capsuleObjects(normalizeHouse(saved,14,0)).length,6);assert.equal(capsuleObjects({unlocked:['x'],decor:[{id:'sound:gong',room:'x',x:.5,y:.5}]}).length,0,'an unknown room never reaches the sequencer');
const all=normalizeHouse(saved,14,0);assert(capsuleObjects(all).every(o=>capsuleDefinition(o)));assert.equal(capsuleDefinition({kind:'decor:reloj'}),null);
// House achievements read only the house.
assert.equal(HOUSE_ACHIEVEMENTS.length,6);assert(HOUSE_ACHIEVEMENTS.every(p=>p.category==='Casa'&&p.adventure));
const s={house:{...saved,workbench:true}};for(const p of HOUSE_ACHIEVEMENTS)assert.equal(adventureProgress(p,s).ratio,1,p.id);
assert.equal(houseValue('house:capsules',{}),0);assert.equal(houseValue('house:decor',{house:{decor:[{id:'decor:reloj'},{id:'sound:gong'}]}}),1);
// Every decoration draws on an inert canvas.
const canvas=new Proxy({},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>{o[k]=v;return true;}});for(const p of CAPSULE_DECOR)drawDecor(canvas,p.shape,20,1000,{night:.5});
// Runtime: a capsule takes sparks only when it is saved, and a second tap on the machine is needed.
let toast='',saveOk=true;const house=fresh();
const r={S:{sparks:100,sparkEconomy:{spent:0,earned:100},house,sound:false},currentHouse:()=>house,save:()=>saveOk,toast:t=>toast=t};initialize(r);
assert.equal(r.houseCapsuleTap(204,500),true);assert.equal(house.capsules.count,0,'the first tap only asks');assert.match(toast,/60 ✦/);
assert.equal(r.houseCapsuleTap(204,500),true);assert.equal(house.capsules.count,1);assert.equal(r.S.sparks,100-CAPSULE_PRICE);assert.equal(r.S.sparkEconomy.spent,CAPSULE_PRICE);
saveOk=false;assert.equal(r.openHouseCapsule(),null);assert.equal(r.S.sparks,40);assert.equal(house.capsules.count,1,'a failed save keeps sparks and house');saveOk=true;
assert.equal(r.openHouseCapsule(),null);assert.match(toast,/cuesta/);
assert.equal(r.houseCapsuleTap(600,300),false,'elsewhere is not the machine');
console.log('PASS house capsules: rooms by days or achievements, 18 unique pieces and colours from a fixed draw, kept in saves and codes, sounding pieces in the sequencer, six house achievements, sparks only on a saved capsule');
