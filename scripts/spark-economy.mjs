// The spark economy of plan F3 (docs/MUNDO.md): how long the whole cube shop takes for two kinds of player. Mining is
// measured on the real economy and crystals (the route of sparks-calibration.mjs) at ×1, ×2 and ×3; rounds in places
// come from spark-rules.js. A model of play time, not a measurement of people.
import {initialize as economy} from '../src/sparks.js';
import {initialize as crystals} from '../src/crystal-sparks.js';
import {CUBE_SHOP} from '../src/cube-shop-model.js';
import {roundSparks} from '../src/spark-rules.js';
import {LIVE_REWARD,LIVE_EVERY} from '../src/live-encounters-model.js';
// E1 (Jay, 27 Oct 2026): living encounters while travelling, one every 60–90 s of travel (75 on average). The model
// assumes a player catches 45 % of them plus four tenths of their share on time (60 % on time → 69 %), and makes a
// share of those catches with a pulse on time equal to their share on time; without sound, half and none on time.
// Assumptions of a model, not measurements of people.
export const LIVE_GAP=(LIVE_EVERY.min+LIVE_EVERY.max)/2/60;
// E2 (Jay, 28 Oct 2026): the same timer now brings a chase or a flight, half and half (the roll of the hash). Escaping is a
// little easier than catching: in tests/live-encounters.mjs walking toward the arrow at once gets out of almost all of
// them, though 1.5 s late five of the eleven nearly always reach you. The model assumes a player escapes 55 % plus four tenths of
// their share on time (60 % on time → 79 %), 60 % without sound; the chase keeps batch 1's numbers. Assumptions, not measures.
export const LIVE_VERB_SHARE=Object.freeze({perseguir:.5,huir:.5});
export const liveChase=p=>p.sound===false?.5:.45+.4*p.onTime,liveFlight=p=>p.sound===false?.6:Math.min(.95,.55+.4*p.onTime);
export const liveCatch=p=>LIVE_VERB_SHARE.perseguir*liveChase(p)+LIVE_VERB_SHARE.huir*liveFlight(p);
export function livePerMinute(p,live=LIVE_REWARD){if(!live)return 0;const share=p.sound===false?0:p.onTime;return liveCatch(p)*(share*live.onTime+(1-share)*live.base)/LIVE_GAP;}
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
globalThis.document??={hidden:false,querySelector:()=>null};
// Ten minutes walking at a normal pace (100 units/s), a pulse every 0.9 s, every pulse at the given multiplier.
export function minePerMinute(mult){const nodes={},r={S:{mode:'world',todayKey:'2026-10-16',wx:0,wy:0,sparks:0,pathCrystals:[]},worldIdentity:{seed:'calibration'},seedOf,inWorld:()=>true,waves:[],save:()=>true,toast(){},$:id=>nodes[id]||=( {addEventListener(){},classList:{toggle(){}}} )};
 economy(r);crystals(r);r.crystalTick(.05);
 for(let i=1;i<=12000;i++){const t=i*.05;r.S.wx=t*100;r.S.wy=Math.sin(t/20)*140;for(const w of r.waves){w.prev=w.r;w.r+=21;}r.waves=r.waves.filter(w=>w.r<w.max);
  if(i%18===0)r.waves.push({x:r.S.wx,y:r.S.wy,r:0,prev:0,max:340,origin:'player',mult});r.crystalTick(.05);}
 return r.S.sparks/10;}
export const ROUND_MINUTES=2.75;
// Two players: one who plays on time six pulses in ten without long streaks, one who plays on time nine in ten.
export const PROFILES=Object.freeze([{id:'casual',onTime:.6,streakShare:0,placeShare:.5},{id:'ritmo',onTime:.9,streakShare:.6,placeShare:.5}]);
export function simulate(){const mine={0:0,1:minePerMinute(1),2:minePerMinute(2),3:minePerMinute(3)},shop=CUBE_SHOP.reduce((a,p)=>a+p.cost,0);
 const players=PROFILES.map(p=>{const off=1-p.onTime,on3=p.onTime*p.streakShare,on2=p.onTime-on3,live=livePerMinute(p,LIVE_REWARD),world=off*mine[1]+on2*mine[2]+on3*mine[3]+live,places=roundSparks(p.onTime)/ROUND_MINUTES,perMinute=p.placeShare*places+(1-p.placeShare)*world;
  return {...p,livePerMinute:+live.toFixed(1),worldPerMinute:+world.toFixed(1),placesPerMinute:+places.toFixed(1),perMinute:+perMinute.toFixed(1),shopHours:+(shop/perMinute/60).toFixed(1)};});
 return {shop,minePerMinute:Object.fromEntries(Object.entries(mine).map(([k,v])=>[k,+v.toFixed(1)])),players};}
if(import.meta.url===`file://${process.argv[1]}`)console.log(JSON.stringify({method:'Mining measured on the real economy (ten-minute route, pulse every 0.9 s) at ×1, ×2 and ×3 (off time earns its ×1 base since K2); rounds from spark-rules.js at 2.75 min; half the time in places; travelling in the World also meets living encounters (play-curve.mjs). A model, not people.',...simulate()},null,2));
