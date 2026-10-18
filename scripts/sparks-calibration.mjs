// Reproducible route simulation; not a human play-time or retention measurement.
import {initialize as economy} from '../src/sparks.js';
import {initialize as crystals} from '../src/crystal-sparks.js';
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
globalThis.document={hidden:false,querySelector:()=>null};
const results=[];
for(const speed of [40,80,120]){
 const nodes={},r={S:{mode:'world',todayKey:'2026-10-16',wx:0,wy:0,sparks:0,pathCrystals:[]},worldIdentity:{seed:'calibration'},seedOf,inWorld:()=>true,waves:[],save:()=>true,toast(){},$:id=>nodes[id]||=( {addEventListener(){},classList:{toggle(){}}} )};economy(r);crystals(r);r.crystalTick(.05);
 for(let i=1;i<=12000;i++){
  const t=i*.05;r.S.wx=t*speed;r.S.wy=Math.sin(t/20)*140;
  for(const w of r.waves){w.prev=w.r;w.r+=21;}r.waves=r.waves.filter(w=>w.r<w.max);
  if(i%18===0)r.waves.push({x:r.S.wx,y:r.S.wy,r:0,prev:0,max:340,origin:'player'});
  r.crystalTick(.05);
 }
 results.push({seconds:600,speedUnitsPerSecond:speed,manualPulseEverySeconds:.9,crystals:Object.values(r.sparkEconomy.sites).filter(p=>p.collected).length,sparks:r.S.sparks});
}
console.log(JSON.stringify({method:'Three ten-minute simulated walking routes, sinusoidal lateral movement, real pulse crossings/mining and collection. No player steering towards deposits, no human timing claim.',results},null,2));
