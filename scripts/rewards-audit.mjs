import {REWARDS_CATALOG,REWARD_RARITIES,normalizeRewards,rewardSource} from '../src/rewards-model.js';
// Explicit hypothetical daily sessions: an estimate to tune, not observed player telemetry.
const players=160,days=365,minutesPerDay=20;
const trials=[],first=Object.fromEntries(Object.keys(REWARD_RARITIES).map(id=>[id,[]]));
function random(seed){return ()=>{seed=Math.imul(seed^seed>>>15,2246822519);return (seed>>>0)/4294967296;};}
for(let player=1;player<=players;player++){
 const r=random(player),book=normalizeRewards(),seen=new Set(),timeline={};
 const grant=(kind,key,day)=>{for(const id of rewardSource(book,kind,key,REWARDS_CATALOG,{at:new Date(Date.UTC(2026,0,day)).toISOString()})){const p=REWARDS_CATALOG.find(p=>p.id===id);if(!seen.has(p.rarity)){seen.add(p.rarity);first[p.rarity].push(day);}}};
 grant('default','start',0);
 for(let day=1;day<=days;day++){
  for(const n of [1,3,7,14,30,90,180])if(day>=n)grant('constancy',String(n),day);
  for(const kind of ['biome','lineage','box','study','layer','weather']){
   const chance={biome:.5,lineage:.7,box:.08,study:.06,layer:.05,weather:.15}[kind];
   if(r()<chance){const options=REWARDS_CATALOG.filter(p=>p.source.kind===kind);grant(kind,options[Math.floor(r()*options.length)].source.key,day);}
  }
  if([7,14,30,90,180].includes(day))timeline[day]=Object.keys(book.items).length;
 }
 trials.push(timeline);
}
const percentile=(v,q)=>v.toSorted((a,b)=>a-b)[Math.min(v.length-1,Math.floor(v.length*q))]??null;
console.log(JSON.stringify({catalogue:REWARDS_CATALOG.length,cosmetics:13,players,days,assumptions:{minutesPerDay,biomeVisitsPerSession:.5,lineageContactsPerSession:.7,boxChancePerSession:.08,studyChancePerSession:.06,layerChancePerSession:.05,weatherChancePerSession:.15,scope:'Catalogue foundation only; excludes achievement awards and future 50-piece wardrobe. Assumptions are hypothetical, not world occurrence odds.'},firstPieceByRarity:Object.fromEntries(Object.keys(first).map(id=>[id,{players:first[id].length,medianDay:percentile(first[id],.5),p90Day:percentile(first[id],.9),medianMinutes:percentile(first[id],.5)*minutesPerDay}])),collectionByDay:Object.fromEntries([7,14,30,90,180].map(day=>[day,{medianPieces:percentile(trials.map(t=>t[day]),.5)}])),notes:'First reward in a tier is not completing that tier. No six-month guarantee for every mythical source; cadence of the 50 cosmetics belongs to phase 3.'},null,2));
