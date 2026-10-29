import assert from 'node:assert/strict';
import {curve,simulate,explorer,PROFILES,HORIZON,NOVELTY_GAP,CHECKPOINTS,ECONOMY_NOW,ECONOMY_BEFORE,ECONOMY_BEFORE_F1,SKY_NEAR} from '../scripts/play-curve.mjs';
import {SKY_REWARD} from '../src/sky-map-model.js';
import {ECONOMY_BEFORE_H1} from '../src/spark-rules.js';
import {ECONOMY_BEFORE_E1} from '../src/spark-rules.js';import {CUBE_SHOP} from '../src/cube-shop-model.js';
import {TOTAL_STARS} from '../src/places.js';
// Plan H7: the model is deterministic, plays the Journey first and the places in order.
const all=curve(),again=curve();assert.deepEqual(all.map(({events,...r})=>r),again.map(({events,...r})=>r));assert.equal(all.length,PROFILES.length);
for(const r of all){const kinds=r.events.map(e=>e.kind);assert.equal(kinds.slice(0,7).join(),'viaje,viaje,viaje,viaje,viaje,viaje,viaje');
 const order=r.events.filter(e=>e.kind==='lugar').map(e=>e.what);assert.deepEqual(order,['jardin','dunas','cristales','faros','ruinas','cueva']);
 // Everyone wins (the eleven places) within the first hour.
 assert(r.won&&r.won<60,r);assert.equal(r.interestMeasured,false);assert(r.completedInterpretations>0);assert.equal(r.novelties60,r.events.filter(e=>e.t<=60&&!['salvaje','interpretacion'].includes(e.kind)).length,'replayed interpretations are not new layers or discoveries');assert(r.interpretationGap<=r.songGap);assert(r.events.every(e=>e.t<=HORIZON));
 // Plan I6: the rule counts only what grows the song; pieces bought are reported apart and never pass it.
 assert.equal(r.rule,r.songGap<=NOVELTY_GAP);assert(r.withPurchasesGap<=r.songGap);assert.equal(r.quitAt===null,r.rule);}
const by=id=>all.find(r=>r.id===id);
// The 90 % player gets all 33 ★ within the two hours; the 75 % player's song keeps growing (★★ at 75 %, plan I5).
assert.equal(by('90').stars120,TOTAL_STARS);assert(by('90').rule);assert(by('75').rule,`75 %: ${by('75').songGap} min`);
assert(!simulate(PROFILES[1],{rhythmStar:.85,maestroStar:.8}).rule,'with the old 85 % the 75 % player stopped after the win');
// Panel 10 (P6, D1-B): the 60 % player gets no ★★, but each better round grows a ★ layer («crece»), so the song keeps
// growing until the two hours end. Measured, not hidden: the player without sound gets no ★★ and no growth (without
// sound the share is not raised), so their song stops after the win and the model marks the risk of leaving there.
{const r=by('60');assert(r.rule,`60 %: ${r.songGap} min from ${r.songGapFrom}`);assert(r.grew120>=6);assert(r.events.some(e=>e.kind==='crece'&&e.t>r.won));assert.equal(r.quitAt,null);
 assert(r.events.filter(e=>e.kind==='crece').every(e=>{const before=r.events.filter(q=>q.what===e.what&&q.t<=e.t);return !before.some(q=>q.kind==='★★');}),'only a layer below ★★ grows');}
{const r=by('sin sonido');assert(!r.rule);assert.equal(r.grew120,0);assert.equal(r.quitAt,r.songGapFrom);assert(Math.abs(r.quitAt-r.won)<1);}
// Without the growth the same 60 % player would stop after the win: «crece» is what passes the rule.
{const r=by('60'),after=r.events.filter(e=>e.t>r.won+.1&&['lugar','★★','★★★','victoria','maestro'].includes(e.kind));assert.deepEqual(after,[],'after the win only «crece» grows the 60 % player\'s song');}
assert.equal(by('sin sonido').stars120,11,'without sound only ★');
// E1 (Jay, 27 Oct 2026, «more sparks»): with rounds at 80–170 and living encounters, every player earns at least a third
// more in two hours and buys more pieces; the shop (17,030 ✦) is still far from bought: not everything in twenty minutes.
// (Kept as history: alpha.231, the last economy with sparks in the rounds, against the one before E1.)
const shop=CUBE_SHOP.reduce((a,p)=>a+p.cost,0),at231=curve({economy:ECONOMY_BEFORE});
{const before=curve({economy:ECONOMY_BEFORE_E1});
 for(const [i,r] of at231.entries()){const b=before[i];assert.deepEqual(Object.keys(r.earnedAt).map(Number),CHECKPOINTS);
  for(const m of CHECKPOINTS)assert(r.earnedAt[m]>=b.earnedAt[m],r.id+' '+m);assert(r.earnedAt[120]>=b.earnedAt[120]*1.33,`${r.id}: ${b.earnedAt[120]} → ${r.earnedAt[120]}`);
  assert(r.bought120>b.bought120,r.id);assert(r.earnedAt[30]<shop*.06&&r.earnedAt[120]<shop*.5,r.id);
  for(let k=1;k<CHECKPOINTS.length;k++)assert(r.earnedAt[CHECKPOINTS[k]]>=r.earnedAt[CHECKPOINTS[k-1]]);}}
// F1 (alpha.231): the Mapa del cielo adds a little and stops: new figures only, at most the near ones in two hours.
{const before=curve({economy:ECONOMY_BEFORE_F1});for(const [i,r] of at231.entries()){const b=before[i],gain=r.earnedAt[120]-b.earnedAt[120];
 assert(gain>0&&gain<=SKY_NEAR*ECONOMY_BEFORE_H1.sky.onTime+1,`${r.id}: +${gain}`);assert(gain<=b.earnedAt[120]*.03,r.id);for(const m of CHECKPOINTS)assert(r.earnedAt[m]>=b.earnedAt[m]);}}
// H1 (Jay, 28 Oct 2026, alpha.233): levels give ★ and the song, never ✦. In the model the rounds pay nothing: without
// the open universe's sources nobody earns a spark. Jay's correction: no inflation. A loose spark is 1 (2 on time, no
// ×3), the wild spark 15 and what appears pays by difficulty, distance and rarity; near the ring that is a few sparks a
// thing. So the two hours earn much less than alpha.231 (the rounds paid most of it) and less than the open universe
// alone gave then; the shop stays far. Measured and reported (docs/HALLAZGOS_Y_ACTIVIDADES.md), not tuned: prices are
// Jay's to change. Assumptions of a model, not people.
{const none=curve({economy:{...ECONOMY_NOW,live:null,sky:null,mine:0,wild:0}});for(const r of none)for(const m of CHECKPOINTS)assert.equal(r.earnedAt[m],0,`${r.id} ${m}: the rounds pay no sparks`);
 for(const [i,r] of all.entries()){const b=at231[i];for(const m of CHECKPOINTS.slice(1))assert(r.earnedAt[m]>0&&r.earnedAt[m]<b.earnedAt[m]*.5,`${r.id} ${m} min: ${b.earnedAt[m]} → ${r.earnedAt[m]}`);
  assert(r.bought120>0&&r.bought120<b.bought120,`${r.id}: ${b.bought120} → ${r.bought120} pieces`);assert(r.earnedAt[120]<shop*.15,r.id);assert(r.won&&r.won<60);}
 for(const p of PROFILES){const e=explorer(p,20),b=explorer(p,20,{economy:ECONOMY_BEFORE});assert(e.earned>0&&e.earned<b.earned,`${p.id}: ${b.earned} → ${e.earned} ✦ in 20 min of exploring`);assert(e.shopShare<.06);}
 assert(SKY_REWARD.base<ECONOMY_BEFORE_H1.sky.base,'the near figures pay less than the flat 10 of alpha.231');}
console.log(`PASS play curve: four players, the Journey then the places in order, the win before an hour; the ${NOVELTY_GAP}-minute rule counts only what grows the song (not purchases); 60, 75 and 90 % keep growing (60 % by «crece»), no sound stops after the win and the risk of leaving is marked there; E1 earns a third more in two hours and buys more, the shop still far away; the Mapa del cielo adds under 3 % and stops; H1: the rounds pay no sparks and the open universe is not inflated (under half of alpha.231\'s curve, the shop far)`);
