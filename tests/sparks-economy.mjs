import assert from 'node:assert/strict';
import {normalizeSparkEconomy,creditSparks,debitSparks,claimSparkReward,sparkSetProgress,SPARK_JUMP_COST,universeProgress,SPARK_UNIVERSE} from '../src/sparks-model.js';
import {ACTIVITIES} from '../src/universe-activities-model.js';
import {WONDERS} from '../src/musical-wonders-model.js';
import {MISCHIEF} from '../src/universe-mischief-model.js';
import {TOTEM_KINDS} from '../src/sculpture-totems-model.js';
import {initialize} from '../src/sparks.js';
const day='2026-10-16';let s={sparks:42,todayKey:day};s.sparkEconomy=normalizeSparkEconomy(null,s.sparks,day);assert.equal(s.sparkEconomy.earned,42);
assert.equal(creditSparks(s,3),3);assert(debitSparks(s,20));assert(!debitSparks(s,999));assert.equal(s.sparks,25);assert.equal(s.sparkEconomy.earned-s.sparkEconomy.spent,s.sparks);
assert(claimSparkReward(s,'set:one',15,'Uno'));assert(!claimSparkReward(s,'set:one',15,'Uno'));assert.equal(s.sparks,40);
s.sparkEconomy.sites['0,0']={x:2,y:3,size:2,value:3,hits:2,broken:true,collected:true};
let q=normalizeSparkEconomy(s.sparkEconomy,s.sparks,day);assert(q.sites['0,0'].collected);assert(q.claims['set:one']);q=normalizeSparkEconomy(q,s.sparks,'2026-10-17');assert.equal(Object.keys(q.sites).length,0);assert(q.claims['set:one']);assert.equal(q.earned-q.spent,s.sparks);
const future={version:8,secret:17};assert.equal(normalizeSparkEconomy(future,100,day),future);
const cards=['perc','bajo','lead','acorde'].map((role,i)=>({type:'voice:'+i,context:{role}}));cards.push({type:'living:deer'},{type:'living:turtle'},{type:'living:whale'},{type:'relic:ordinary'},{type:'anomaly:espejo'},{type:'event:lluvia'});
assert.deepEqual(sparkSetProgress({rareBook:{items:cards}}),{band:4,neighbors:3,wonders:3});assert.equal(sparkSetProgress({rareBook:{items:cards.map(c=>({...c,forced:true}))}}).band,0);
globalThis.document={hidden:false,querySelector:()=>null,querySelectorAll:()=>[]};let fail=false,saved=null;
function runtime(state){const nodes={};const $=id=>nodes[id]||=( {hidden:false,textContent:'',innerHTML:'',dataset:{},classList:{toggle(){}},addEventListener(){}} );const r={S:state,$,inWorld:()=>state.mode==='world',save:()=>{if(fail)return false;saved=structuredClone(r.S);return true;},toast(){},W:390,H:844,playerProfile:{distanceUnits:0},jumpPracticePlace:()=>true,returnPracticePlace:()=>true};initialize(r);return r;}
let r=runtime({mode:'world',todayKey:day,sparks:200,pathCrystals:[],playerProfile:{distanceUnits:0}});
assert(r.buySparkStyle('dust'));assert.equal(r.S.sparks,160);assert(!r.buySparkStyle('dust'));assert.equal(r.S.sparks,160);assert(r.equipSparkStyle('dust'));assert(!r.equipSparkStyle('orbit'));
{const calls=[];r.cx={save(){},restore(){},fillRect:(...a)=>calls.push(a),beginPath(){},moveTo(){},lineTo(){},closePath(){},stroke(){}};r.S.wx=0;r.S.wy=0;r.S.reducedMotion=true;r.drawSparkCosmetics(1);assert(calls.length>=6,'reduced motion still shows the bought dust');r.S.reducedMotion=false;}
fail=true;assert(!r.buySparkStyle('facet'));assert.equal(r.S.sparks,160);assert(!r.sparkEconomy.purchases.facet);fail=false;
const ticket=r.reserveSparkJump();assert(ticket);assert.equal(r.S.sparks,160-SPARK_JUMP_COST);r.cancelSparkJump(ticket);assert.equal(r.S.sparks,160);assert.equal(r.sparkEconomy.stats.jumps,0);
const crystal={id:'a',x:20,y:0,size:2,value:3};assert.equal(r.crystalTransaction(crystal,'hit').hits,1);fail=true;assert.equal(r.crystalTransaction(crystal,'hit'),null);assert.equal(r.savedCrystal('a').hits,1);fail=false;
assert(r.crystalTransaction(crystal,'hit').broken);assert(!r.savedCrystal('a').collected);assert(r.crystalTransaction(crystal,'collect').collected);assert.equal(r.S.sparks,163);
assert(r.crystalTransaction(crystal,'collect').collected);assert.equal(r.S.sparks,163,'collect never pays twice');
r=runtime(structuredClone(saved));assert(r.savedCrystal('a').collected);assert.equal(r.S.sparks,163,'reload keeps mining and wallet');
r.S.rareBook={items:cards};for(let i=0;i<6;i++)r.sparkTick(.1);assert.equal(r.S.sparks,218);const amount=r.S.sparks;for(let i=0;i<6;i++)r.sparkTick(.1);assert.equal(r.S.sparks,amount,'retroactive sets pay once');
r.S.playerProfile.distanceUnits=10000;for(let i=0;i<6;i++)r.sparkTick(.1);assert(r.sparkEconomy.claims['distance:1000']);assert(r.sparkEconomy.claims['badge:taxi']);assert.equal(r.sparkEconomy.earned-r.sparkEconomy.spent,r.S.sparks);
r.drawSparkEconomyHUD();assert(r.$('sparkTotal').textContent.includes(String(r.S.sparks)));
const novice=runtime({mode:'world',todayKey:day,sparks:19,pathCrystals:[]});assert(!novice.sparkJumpEarned());assert(!novice.canAffordSparkJump());creditSparks(novice.S,1);assert(novice.sparkJumpEarned());assert(novice.canAffordSparkJump());debitSparks(novice.S,20);assert(novice.sparkJumpEarned(),'earned jump stays unlocked after spending');assert(!novice.canAffordSparkJump());const restored=runtime(structuredClone(novice.S));assert(restored.sparkJumpEarned());
const demo=runtime({mode:'world',todayKey:day,sparks:0,pathCrystals:[]});demo.labMode=true;assert.equal(demo.crystalTransaction(crystal,'hit'),null);assert.equal(demo.S.sparks,0);
const f=runtime({mode:'world',todayKey:day,sparks:20,pathCrystals:[],sparkEconomy:future});assert(!f.buySparkStyle('dust'));assert.equal(f.sparkEconomy,future);
console.log('PASS wallet conservation, migration/future saves, daily depletion, atomic save failure, permanent purchases/equipment, jump rollback, retroactive one-time sets, distance badges and demo rejection');

// The hub and HUD describe the same journey and respect the same travel restrictions.
const loop=runtime({mode:'camino',todayKey:day,sparks:10,pathCrystals:[],playerProfile:{distanceUnits:0}});
loop.drawSparkEconomyHUD();assert(loop.$('sparkGoal').hidden);loop.openSparks();assert(loop.$('sparkJump').disabled);assert(loop.$('sparkStatus').textContent.includes('diez cristales'));
loop.S.playerProfile.distanceUnits=9000;loop.sparkTick(.1);loop.S.mode='world';loop.sparkTick(.1);assert.equal(loop.sparkEconomy.stats.sinceJump,0,'Camino distance cannot leak into world-only badges');
loop.S.playerProfile.distanceUnits+=5000;loop.sparkTick(.1,true);loop.sparkTick(.1);assert.equal(loop.sparkEconomy.stats.sinceJump,0,'paused distance cannot leak into the next active frame');
loop.S.playerProfile.distanceUnits+=20;loop.sparkTick(.1);assert.equal(loop.sparkEconomy.stats.sinceJump,20);
loop.openSparks();assert(loop.$('sparkJump').disabled);assert(loop.$('sparkStatus').textContent.includes('10 chispas'));
creditSparks(loop.S,50);loop.canPracticeTravel=()=>false;loop.S.practiceTravel={previous:{x:0,y:0}};loop.openSparks();assert(loop.$('sparkJump').disabled);assert(loop.$('sparkBack').disabled);
loop.canPracticeTravel=()=>true;loop.openSparks();assert(!loop.$('sparkJump').disabled);assert(!loop.$('sparkBack').disabled);loop.drawSparkEconomyHUD();assert(loop.$('sparkGoal').textContent.includes('Salto disponible'));
assert(loop.buySparkStyle('dust'));loop.sparkEconomy.goal='shop:dust';loop.drawSparkEconomyHUD();assert(loop.$('sparkGoal').textContent.includes('Meta cumplida'));
loop.S.rareBook={items:cards};for(let i=0;i<6;i++)loop.sparkTick(.1);loop.sparkEconomy.goal='set:band';loop.drawSparkEconomyHUD();assert(loop.$('sparkGoal').textContent.includes('Meta cumplida'));
loop.sparkEconomy.goal='none';loop.drawSparkEconomyHUD();assert(loop.$('sparkGoal').hidden);
console.log('PASS connected Camino/world guidance, active-only badge distance, consistent travel availability and completed optional goals');

const beyond=runtime({mode:'camino',todayKey:day,sparks:10,pathCrystals:Array.from({length:10},(_,i)=>'earned:'+i),todayLight:10,totalLight:10});
const beforeBeyond=structuredClone(beyond.S),extra={id:'path:extra',x:90,y:0,size:1,value:1};
assert(beyond.crystalTransaction(extra,'hit',true).broken);assert(beyond.savedCrystal(extra.id).collected);assert.equal(beyond.S.sparks,10);assert.deepEqual(beyond.S.pathCrystals,beforeBeyond.pathCrystals);assert.equal(beyond.S.todayLight,10);assert.equal(beyond.S.totalLight,10);assert.equal(beyond.sparkEconomy.stats.broken,0);
fail=true;assert.equal(beyond.crystalTransaction({...extra,id:'path:failed'},'hit',true),null);assert(!beyond.savedCrystal('path:failed'));fail=false;
console.log('PASS returning Camino crystals break without currency, daily light, objective or badge farming; failed writes roll back');

// The universe closes when every activity type, wonder, mischief scene and sculpture shape has been found.
const fullSet=(list,v=true)=>Object.fromEntries(list.map(d=>[d.id??d,v]));
const empty=universeProgress({});assert.equal(empty.need,ACTIVITIES.length+WONDERS.length+MISCHIEF.length+TOTEM_KINDS.length);assert.equal(empty.value,0);assert(!empty.complete);
const full={activities:{version:1,types:fullSet(ACTIVITIES)},musicalWonders:{version:1,found:fullSet(WONDERS),totems:fullSet(TOTEM_KINDS)},mischief:{version:1,counts:fullSet(MISCHIEF,1),sculptures:{}}};
assert(universeProgress(full).complete);delete full.musicalWonders.found[WONDERS[0].id];const almost=universeProgress(full);assert(!almost.complete);assert.equal(almost.value,almost.need-1);
assert.equal(SPARK_UNIVERSE.parts.length,4);
console.log('PASS universe completion counts every activity type, wonder, mischief scene and sculpture shape');
// Pieces in different slots are worn together; taking one off leaves the others.
{const w=runtime({mode:'world',todayKey:day,sparks:400,pathCrystals:[],playerProfile:{distanceUnits:0}});
for(const id of ['dust','facet','orbit'])assert(w.buySparkStyle(id));for(const id of ['dust','facet','orbit'])assert(w.equipSparkStyle(id));
assert.deepEqual(w.sparkEconomy.wear,{trail:'dust',pulse:'facet',companion:'orbit'});assert(w.unequipSparkStyle('facet'));assert.deepEqual(w.sparkEconomy.wear,{trail:'dust',companion:'orbit'});assert(!w.unequipSparkStyle('facet'));
const reloaded=normalizeSparkEconomy(structuredClone(saved.sparkEconomy),saved.sparks,day);assert.deepEqual(reloaded.wear,{trail:'dust',companion:'orbit'});
assert(w.equipSparkStyle(''));assert.deepEqual(w.sparkEconomy.wear,{});assert.equal(w.sparkEconomy.equipped,'');}
console.log('PASS pieces worn per slot, removal keeps the rest, saved wear survives reload and everything comes off at once');

// K2: every collected fragment keeps its value; rhythm is a bonus, not a condition.
for(const mult of [0,1,2,3]){const w=runtime({mode:'world',todayKey:day,sparks:0,pathCrystals:[]});const o={id:'base:'+mult,x:0,y:0,size:1,value:1};w.crystalTransaction(o,'hit',false,null,false,mult);w.crystalTransaction(o,'collect');assert.equal(w.S.sparks,Math.max(1,mult));w.crystalTransaction(o,'collect');assert.equal(w.S.sparks,Math.max(1,mult),'no duplicate credit');}
{const w=runtime({mode:'world',todayKey:day,sparks:0,pathCrystals:[]}),o={id:'legacy-zero',x:0,y:0,size:2,value:3};w.crystalTransaction(o,'hit');w.crystalTransaction(o,'hit');w.savedCrystal(o.id);w.sparkEconomy.sites[o.id].mult=0;w.crystalTransaction(o,'collect');assert.equal(w.S.sparks,3,'pending zero-multiplier fragments recover base value');const restored=runtime(structuredClone(w.S));restored.crystalTransaction(o,'collect');assert.equal(restored.S.sparks,3,'a reload never pays collected fragments again');}
