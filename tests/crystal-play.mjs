import assert from 'node:assert/strict';
import {crystalPlay,crystalFragments,moveEscape,CRYSTAL_CHAIN_LIMIT} from '../src/crystal-play-model.js';
import {crystalField,initialize as crystals} from '../src/crystal-sparks.js';
import {initialize as economy} from '../src/sparks.js';
import {normalizeSparkEconomy} from '../src/sparks-model.js';
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
globalThis.document={hidden:false,querySelector:()=>null};
const ink=[],draws=[];
const cx=new Proxy({},{get:(o,k)=>o[k]??((...args)=>{for(const v of args)if(typeof v==='number')assert(Number.isFinite(v),k+' must draw finite coordinates');draws.push([k,...args]);}),set:(o,k,v)=>{if(k==='fillStyle')ink.push(v);o[k]=v;return true;}});
let fail=false,lastSave=null;const messages=[];
function game(raw=null){const nodes={},r={S:raw||{mode:'world',todayKey:'2026-10-16',wx:0,wy:0,sparks:0,pathCrystals:[]},W:390,H:844,camX:0,camY:0,cx,worldIdentity:{seed:'play-test'},seedOf,waves:[],inWorld(){return this.S.mode==='world';},save(){if(fail)return false;lastSave=structuredClone(this.S);return true;},toast(message){messages.push(message);},$:id=>nodes[id]||={classList:{toggle(){}},addEventListener(){}}};economy(r);crystals(r);r.crystalTick(.05);return r;}
const run=(r,n)=>{for(let i=0;i<n;i++){r.crystalTick(.05);r.sparkTick(.05);}};
const tap=(r,o)=>{r.waves=[{x:o.x-10,y:o.y,r:11,prev:9,origin:'player'}];r.crystalTick(.05);r.waves=[];};
for(const size of [1,2,3]){const o={size};assert.equal(crystalFragments(o,false).reduce((n,p)=>n+p.value,0),[1,3,5][size-1]);assert.equal(crystalFragments(o,true).reduce((n,p)=>n+p.value,0),[1,3,5][size-1]+3);assert.equal(crystalFragments(o,true).filter(p=>p.rare).length,1);}
assert.deepEqual(crystalPlay({id:'path:day:0',size:2},()=>0),{rare:false,runner:false});
let variant=null,runner=null,root=null,neighbor=null;
for(let x=0;x<500&&!((variant&&runner&&root));x++){
 const field=crystalField(x*800,0,seedOf);variant||=field.find(p=>p.rare&&!p.runner&&p.size>1);runner||=field.find(p=>p.runner);
 if(!root)for(const a of field.filter(p=>p.size===1)){const b=field.find(p=>p.id!==a.id&&Math.hypot(p.x-a.x,p.y-a.y)<230);if(b){root=a;neighbor=b;break;}}
}
const rareSizes=new Set();for(let x=0;x<100;x++)for(const p of crystalField(x*1200,0,seedOf))if(p.rare)rareSizes.add(p.size);assert.deepEqual(rareSizes,new Set([1,2,3]),'special fragments can appear in every size');
assert(variant&&runner&&root&&neighbor,'fixtures must come from the actual deterministic field');
let r=game();r.S.wx=runner.x;r.S.wy=runner.y-40;r.crystalTick(.05);tap(r,runner);run(r,12);
let state=r.crystalState.near.find(p=>p.id===runner.id);assert(state.run&&Math.hypot(state.run.x-runner.x,state.run.y-runner.y)>20,'first hit makes actual runners flee');
const frozen={...state.run};r.crystalTick(.05,true);assert.deepEqual(r.crystalState.near.find(p=>p.id===runner.id).run,frozen,'menus pause pursuit');
run(r,80);state=r.crystalState.near.find(p=>p.id===runner.id);assert(Math.hypot(state.run.x-runner.x,state.run.y-runner.y)<=90.00001);const stopped={...state.run};run(r,20);state=r.crystalState.near.find(p=>p.id===runner.id);assert.equal(state.run.x,stopped.x,'pursuit ends without losing the crystal');r.drawCrystals();
r=game();r.S.wx=variant.x;r.S.wy=variant.y-55;r.crystalTick(.05);for(let n=0;n<variant.size;n++)tap(r,variant);
r.autopilotState={mode:'wander',paused:false};run(r,25);assert.equal(r.S.sparks,0,'automatic wandering does not collect any fragment');r.autopilotState.paused=true;run(r,50);
state=r.crystalState.near.find(p=>p.id===variant.id);const rare=state.particles.find(p=>p.rare);
assert(rare&&Math.hypot(rare.x-variant.x,rare.y-variant.y)>40,'rare fragments visibly escape');assert(!r.savedCrystal(variant.id).collected);assert(r.S.sparks>0,'common fragments pay individually before the rare fragment');
r.drawCrystals();assert(ink.includes('#77e8ff'));assert(draws.some(d=>d[0]==='fillText'&&String(d[1]).includes('✦')));r.drawSparkCosmetics(0);
const partial=r.S.sparks,mask=r.savedCrystal(variant.id).fragments;
fail=true;assert.equal(r.crystalTransaction(variant,'collect',false,rare.index),null);assert.equal(r.S.sparks,partial);assert.equal(r.savedCrystal(variant.id).fragments,mask);fail=false;
r=game(structuredClone(r.S));assert.equal(r.savedCrystal(variant.id).fragments,mask,'partial collection survives reload');assert.equal(r.S.sparks,partial);r.crystalTick(.05);run(r,50);state=r.crystalState.near.find(p=>p.id===variant.id);const chase=state.particles.find(p=>p.rare);r.S.wx=chase.x;r.S.wy=chase.y;run(r,20);assert(r.savedCrystal(variant.id).collected);assert.equal(r.S.sparks,variant.value+3);const paid=r.S.sparks;run(r,30);assert.equal(r.S.sparks,paid);r=game(structuredClone(lastSave));run(r,30);assert.equal(r.S.sparks,paid,'reload cannot repeat the bonus');
const old=normalizeSparkEconomy({day:'d',sites:{old:{x:0,y:0,size:3,hits:3,collected:true}}},5,'d');assert.equal(old.sites.old.fragments,7);assert.equal(old.sites.old.rare,false,'legacy depletion never grows a retroactive bonus');
r=game();r.S.wx=root.x+270;r.S.wy=root.y;r.crystalTick(.05);tap(r,root);run(r,80);assert((r.savedCrystal(neighbor.id)?.hits||0)>=1,'the actual nearby crystal receives the chain');
const hits=Object.values(r.sparkEconomy.sites).reduce((n,p)=>n+p.hits,0);assert(hits<=CRYSTAL_CHAIN_LIMIT+1,'one root cannot damage an unbounded chain');tap(r,root);run(r,30);assert.equal(Object.values(r.sparkEconomy.sites).reduce((n,p)=>n+p.hits,0),hits,'spent crystals cannot restart a chain');
r=game();r.S.reducedMotion=true;r.S.wx=runner.x;r.S.wy=runner.y-10;r.crystalTick(.05);tap(r,runner);run(r,20);state=r.crystalState.near.find(p=>p.id===runner.id);assert.equal(state.run.x,runner.x);assert.equal(state.run.y,runner.y);r.drawCrystals();
r=game({mode:'world',todayKey:'2026-10-16',wx:0,wy:0,sparks:19,pathCrystals:[]});const unlock={id:'unlock',x:0,y:0,size:1,value:1};r.crystalTransaction(unlock,'hit');r.crystalTransaction(unlock,'collect');assert.equal(messages.filter(m=>m==='Ya puedes saltar').length,1);r.crystalTransaction(unlock,'collect');assert.equal(messages.filter(m=>m==='Ya puedes saltar').length,1,'unlock notice never repeats');
assert.deepEqual(moveEscape({x:0,y:0},{x:0,y:0},{x:0,y:-20},.05,3),{x:0,y:0});
console.log('PASS real seeded runners/rare fragments, bounded pursuit and chains, individual/bonus payouts, partial reload, failed-save rollback, legacy depletion, reduced motion and finite drawing');
