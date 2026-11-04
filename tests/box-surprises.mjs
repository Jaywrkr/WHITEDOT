// T3 «la carga» (Kubono coherente, decision 4 of Jay): a box gives one power and no surprise. The sixteen surprises are
// retired: none is drawn from a box, none can be given, none is drawn, heard or shown, and a save with one active loads
// fine (it simply ends) and keeps its data. The six powers and their seeded odds are untouched.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BOX_SURPRISES,SURPRISE_IDS,RETIRED_SURPRISES,surpriseFor,surpriseStyle,normalizeSurprise} from '../src/box-surprises-model.js';
import {initialize} from '../src/box-surprises.js';
import {boxAt,POWER_IDS,NATURAL_BOX_RATE} from '../src/expansion-music.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const seed=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const rng=n=>()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);
// The powers and the boxes stay as they were (same seeds, same odds, same places).
assert.equal(POWER_IDS.length,6);assert.equal(NATURAL_BOX_RATE,.04);
{const a=[],b=[];for(let i=0;i<400;i++){const x=boxAt(i,-i,1000,seed,rng);a.push(x&&x.power+':'+x.x.toFixed(2));b.push(boxAt(i,-i,1000,seed,rng)?.power??null);}assert.ok(a.filter(Boolean).length>5);assert.deepEqual(a.map(v=>v&&v.split(':')[0]),b);}
// The names stay (a save or a card can still read one); every one is retired.
assert.equal(SURPRISE_IDS.length,16);for(const id of SURPRISE_IDS){assert.ok(RETIRED_SURPRISES.has(id),id);assert.ok(BOX_SURPRISES[id].name);}
for(let i=0;i<1000;i++)assert.equal(surpriseFor({id:'caja:'+i},seed),null,'no box gives a surprise');
assert.deepEqual(surpriseStyle(SURPRISE_IDS),{speed:1,scale:1,shape:'cube'},'the cube stays a small cube');
assert.deepEqual(surpriseStyle(['pequeno','grande','lento','redondo']),{speed:1,scale:1,shape:'cube'});
const future={version:9,secret:{x:7}};assert.equal(normalizeSurprise(future),future,'a future format is kept as it is');
// The runtime: nothing can be given, the HUD (its id kept) stays hidden, nothing sounds or draws.
const elements={};const $=id=>elements[id]||=({dataset:{},hidden:false});globalThis.document={hidden:false,querySelector:()=>null};
const r={S:{wx:0,wy:0,bag:{luz:17},boxes:{earned:1}},$,W:390,H:844,inWorld:()=>true,seedOf:seed,rng,regionOfPos:()=>({sea:false}),canPracticeTravel:()=>true,travelPracticePoint:()=>{throw Error('no surprise moves the cube');},save:()=>true};
initialize(r);assert.equal(elements.surpriseHud.hidden,true);
for(const id of SURPRISE_IDS)assert.equal(r.giveSurprise(id),false,id);
assert.equal(r.giveBoxSurprise({id:'caja:1'}),null);assert.deepEqual(r.surpriseState.ids,[]);assert.equal(r.surpriseStyle.shape,'cube');assert.equal(r.surpriseStyle.scale,1);assert.equal(r.surpriseStyle.speed,1);
r.surpriseTick(.05);assert.equal(r.drawSurpriseBody({},0,0,10,0),false);assert.equal(r.drawSurprises(0,0,0),undefined);
r.S.sound=true;r.body={speed:120};r.ac={state:'running'};let notes=0;r.playVoice=()=>{notes++;return true;};for(const s of [0,8])r.surpriseStep(s,12,1);assert.equal(notes,0,'no trail sounds');
assert.deepEqual(r.S.bag,{luz:17});assert.deepEqual(r.S.boxes,{earned:1});
// A save with a surprise active (and a return point from the old jump) loads fine: it simply ends, and its data stays.
const old={version:1,remaining:{pequeno:12000,salto:8000,alien:9},elapsed:{pequeno:400},returnPoint:{x:5,y:6,layer:'superficie'},unknown:'keep'};
r.S={wx:9,wy:9,boxSurprises:structuredClone(old)};elements.surpriseHud.hidden=false;r.surpriseTick(.05);
assert.equal(elements.surpriseHud.hidden,true,'no HUD for an old surprise');assert.equal(r.surpriseStyle.scale,1);assert.deepEqual(r.surpriseState.ids,[]);
assert.deepEqual(r.snapshotBoxSurprises(),old,'the saved surprise stays in the save, unread');assert.equal(r.S.wx,9,'nothing moves the cube');
r.S={wx:0,wy:0,boxSurprises:future};assert.equal(r.giveSurprise('redondo'),false);assert.equal(r.snapshotBoxSurprises(),future);assert.equal(r.clearSurprise(),false);
r.S={wx:0,wy:0};assert.deepEqual(r.snapshotBoxSurprises(),{version:1,remaining:{},elapsed:{}},'a save without one gets the empty shape');
// The box asks for no surprise; the card says none.
assert.doesNotMatch(read('src/cajas.js'),/giveBoxSurprise/,'opening a box gives its power only');
assert.doesNotMatch(read('src/celebration.js'),/BOX_SURPRISES/,'the card names no surprise');
console.log('PASS box surprises retired (T3, decision 4): sixteen names kept, none given or drawn, no trail note, the HUD hidden, an active saved surprise ends and stays in the save, future format kept; six powers and their odds intact');
