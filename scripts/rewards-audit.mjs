import {REWARDS_CATALOG,REWARD_RARITIES,migrateRewards} from '../src/rewards-model.js';
import {CUBE_WARDROBE} from '../src/wardrobe-model.js';
// Hypothetical daily sessions; these assumptions are not telemetry or spawn odds.
const players=160,days=365,minutesPerDay=20,trials=[],first=Object.fromEntries(Object.keys(REWARD_RARITIES).map(id=>[id,[]]));
const percentile=(v,q)=>v.toSorted((a,b)=>a-b)[Math.min(v.length-1,Math.floor(v.length*q))]??null;
function random(seed){return ()=>{seed=Math.imul(seed^seed>>>15,2246822519);return (seed>>>0)/4294967296;};}
for(let player=1;player<=players;player++){
 const randomDay=random(player),state={ach:{},livingSeen:{},zones:{},totalDays:0},timeline={},seen=new Set();
 for(let day=1;day<=days;day++){
  state.totalDays=day;
  if(randomDay()<.7){const id='lineage-'+Math.floor(randomDay()*28);state.livingSeen[id]={day:'2026-01-01'};}
  for(const p of CUBE_WARDROBE.filter(p=>p.ach))if(randomDay()<.16)state.ach[p.ach==='oculto'?'secret':p.ach]='2026-01-01';
  state.rewards=migrateRewards(state,REWARDS_CATALOG,{at:new Date(Date.UTC(2026,0,day)).toISOString(),legacy:false,hiddenAchievements:['secret']});
  const owned=CUBE_WARDROBE.filter(p=>state.rewards.items[p.id]);
  for(const p of owned)if(!seen.has(p.rarity)){seen.add(p.rarity);first[p.rarity].push(day);}
  if([7,14,30,90,180,240,365].includes(day))timeline[day]=owned.length;
 }
 trials.push(timeline);
}
console.log(JSON.stringify({catalogue:REWARDS_CATALOG.length,cosmetics:CUBE_WARDROBE.length,players,days,assumptions:{minutesPerDay,lineageContactsPerSession:.7,legacyAchievementChancePerSession:.16,scope:'Wardrobe daily-session simulation; not telemetry or world occurrence odds. Real players may progress slower.'},firstPieceByRarity:Object.fromEntries(Object.keys(first).map(id=>[id,{players:first[id].length,medianDay:percentile(first[id],.5),p90Day:percentile(first[id],.9)}])),collectionByDay:Object.fromEntries([7,14,30,90,180,240,365].map(day=>[day,{medianPieces:percentile(trials.map(t=>t[day]),.5)}])),notes:'Days are distinct play days. Existing thirteen pieces retain their legacy unlocks. New rare pieces require 30–90 days; mythical pieces 180–240 days and sixteen lineages.'},null,2));
