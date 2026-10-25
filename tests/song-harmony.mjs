import assert from 'node:assert/strict';
import {initialize} from '../src/data.js';
import {layerStep,songChord} from '../src/song.js';
import {songPlan,stageEvents} from '../src/song-stage.js';
const r={};initialize(r);let checked=0;
for(const biome of r.BIOMES)for(let tr=0;tr<12;tr++){
 const scale=biome.scale,allowed=new Set(scale.map(n=>(57+tr+n)%12));
 for(let d=0;d<7;d++){
  const chord=[0,2,4].map(k=>57+tr+scale[(d+k)%7]+12*Math.floor((d+k)/7));
  for(let step=0;step<32;step++)for(const e of layerStep('cristales',step,songChord(chord)))assert(allowed.has(e.midi%12),`${biome.id}/${tr}/${d}: Cristales ${e.midi}`);
 }
 const plan=songPlan({final:true,ids:['faros']}),events=[];
 for(let k=plan.themeAt*16;k<plan.endAt*16;k++)events.push(...stageEvents(plan,k,[57+tr,60+tr,64+tr],{tiers:{},scale,tr}).filter(e=>e.theme));
 assert(events.some(e=>e.second));for(const e of events)assert(allowed.has(e.midi%12),`${biome.id}/${tr}: final ${e.midi}`);checked++;
}
console.log(`PASS Cristales and final theme stay in the actual world scales, all degrees and 12 transpositions (${checked} contexts)`);
