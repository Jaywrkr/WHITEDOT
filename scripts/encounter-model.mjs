// Offline spatial model. Never imports a player save or awards progress.
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {initialize as world} from '../src/world.js';
import {livingChunk,aquaticChunk} from '../src/living-catalog.js';
import {populationProfile,populatedChunk} from '../src/living-populations.js';
import {expandedChunk,expandedRhythm} from '../src/ecoregions.js';
import {createRhythmElements} from '../src/percussion-model.js';
import {boxAt} from '../src/expansion-music.js';
import {relicAt} from '../src/relics.js';
import {createFlock,createPlants} from '../src/vida-music.js';
import {createSanctuary} from '../src/culture-model.js';
import {segmentDistance} from '../src/body.js';

export const ENCOUNTER_MODEL_VERSION=1;
export const ENCOUNTER_LIMITS=Object.freeze([
 'Spatial proximity, not player telemetry, audible contribution or cards earned.',
 'Initial source positions; no creature movement, fog, climate, attention or quest resolution.',
 'Surface only. Starts on random land away from the origin, not a new player introduction.',
 'Nominal speed only; no water/anomaly modifiers, powers, Saltar or directed search.',
 'Routes share seeds; Wilson ranges describe the route sample, not all sources of uncertainty.',
 'Only the listed source generators are covered. No observation does not mean impossible.'
]);
export function wilsonInterval(hits,total){
 if(!Number.isInteger(total)||total<=0||!Number.isInteger(hits)||hits<0||hits>total)throw Error('Invalid encounter counts');
 const z=1.96,p=hits/total,den=1+z*z/total,center=(p+z*z/(2*total))/den,
  half=z*Math.sqrt(p*(1-p)/total+z*z/(4*total*total))/den;
 return [hits===0?0:Math.max(0,center-half),hits===total?1:Math.min(1,center+half)];
}
export function observationKeys(o){
 switch(o.category){
  case 'living':return ['living:'+o.kind,...(o.rare?['rare-source:living:'+o.kind]:[])];
  case 'rhythm':return ['rhythm:'+o.kind];
  case 'relic':return ['relic','relic:'+(o.magical?'magical':'ordinary')];
  case 'box':return ['box','power:'+o.power];
  case 'flock':return ['life:'+o.species];
  case 'plant':return ['life:plant'];
  case 'culture':return ['culture:'+o.culture];
  default:return [];
 }
}
export function auditRuntime(seed,layout='classic',generation=2){
 if(typeof seed!=='string'||seed.length>40||!['classic','wide','vasto','grand','immense'].includes(layout)||![1,2].includes(generation))throw Error('Invalid model world');
 const previous=Object.fromEntries(['location','localStorage'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
 try{
  Object.defineProperty(globalThis,'location',{value:{search:'?'+new URLSearchParams({testSeed:seed,layout,generation:String(generation)})},configurable:true,writable:true});
  Object.defineProperty(globalThis,'localStorage',{value:{getItem:()=>null,setItem(){}},configurable:true,writable:true});
  const r={};data(r);progress(r);world(r);return r;
 }finally{for(const [k,d]of Object.entries(previous))if(d)Object.defineProperty(globalThis,k,d);else delete globalThis[k];}
}
export function sampleEncounterHour({seed='encuentros-0',route=0,layout='classic',generation=2,mode='explore',radius=180}={}){
 if(!Number.isInteger(route)||route<0||!['explore','still'].includes(mode)||!Number.isFinite(radius)||radius<64||radius>500)throw Error('Invalid route profile');
 const r=auditRuntime(seed,layout,generation),W=r.WCH,R=r.REG*W,random=r.rng(r.seedOf('audit:encounter:route:v1:'+route)),chunks=new Map(),regions=new Map(),seen=new Set();
 let p;for(let t=0;t<100;t++){const candidate={x:(Math.floor(random()*800)-400+.5)*R,y:(Math.floor(random()*800)-400+.5)*R};if(!r.regionOfPos(candidate.x,candidate.y).sea){p=candidate;break;}}
 if(!p)throw Error('No eligible start found');const start={...p};let angle=random()*Math.PI*2;
 function chunk(cx,cy){const key=cx+','+cy;if(chunks.has(key))return chunks.get(key);
  const d=r.regionOfPos((cx+.5)*W,(cy+.5)*W),b=r.BIOMES[d.z].id;
  const base=d.sea&&generation===2?aquaticChunk(cx,cy,W,d,r.seedOf,r.rng):livingChunk(cx,cy,W,d,b,r.seedOf,r.rng),
   life=populatedChunk(base,cx,cy,W,d,populationProfile(d,b,r.seedOf,r.rng),r.seedOf,r.rng);
  life.push(...expandedChunk(cx,cy,W,d,b,life,r.seedOf,r.rng));
  const percussion=createRhythmElements(cx,cy,W,d,r.seedOf,r.rng);percussion.push(...expandedRhythm(cx,cy,W,d,b,percussion,r.seedOf,r.rng));
  const out=life.map(o=>({...o,category:'living'})).concat(percussion.map(o=>({...o,category:'rhythm'})));
  const relic=relicAt(cx,cy,W,r.seedOf,r.rng);if(relic)out.push({...relic,category:'relic'}); // Eligible at sea too.
  const box=!d.sea&&boxAt(cx,cy,W,r.seedOf,r.rng);if(box)out.push({...box,category:'box'});
  chunks.set(key,out);return out;
 }
 function region(d){if(regions.has(d.key))return regions.get(d.key);
  const b=r.BIOMES[d.z].id,flock=createFlock(d,R,b,r.seedOf,r.rng),site=createSanctuary(d,R,r.regionOfPos,r.seedOf,r.rng),out=[];
  if(flock)out.push({...flock,category:'flock'});if(site)out.push({...site,category:'culture'});
  out.push(...createPlants(d,R,b,r.seedOf,r.rng).map(o=>({...o,category:'plant'})));regions.set(d.key,out);return out;
 }
 function profile(position){const d=r.regionOfPos(position.x,position.y);
  if(!d.sea){seen.add('biome:'+r.BIOMES[d.z].id);seen.add('genre:'+d.genre);if(d.worldFamily)seen.add('world-family:'+d.worldFamily.id);}
  if(d.anomaly)seen.add('anomaly:'+d.anomaly.type);
 }
 function observe(o){for(const key of observationKeys(o))seen.add(key);}
 const steps=mode==='still'?1:120;
 for(let step=0;step<steps;step++){
  if(step%4===0)angle+=(random()-.5)*Math.PI*.8;
  // Each explore segment represents 15 seconds moving + 15 listening.
  const distance=mode==='still'?0:190*15,q={x:p.x+Math.cos(angle)*distance,y:p.y+Math.sin(angle)*distance},nearRegions=new Map();
  const minX=Math.floor((Math.min(p.x,q.x)-radius)/W),maxX=Math.floor((Math.max(p.x,q.x)+radius)/W),minY=Math.floor((Math.min(p.y,q.y)-radius)/W),maxY=Math.floor((Math.max(p.y,q.y)+radius)/W);
  for(let cx=minX;cx<=maxX;cx++)for(let cy=minY;cy<=maxY;cy++){
   if(segmentDistance({x:(cx+.5)*W,y:(cy+.5)*W},p,q)>radius+W/Math.SQRT2)continue;
   for(const o of chunk(cx,cy))if(segmentDistance(o,p,q)<=radius)observe(o);
   const d=r.regionOfPos((cx+.5)*W,(cy+.5)*W);nearRegions.set(d.key,d);
  }
  for(const d of nearRegions.values())for(const o of region(d))if(segmentDistance(o,p,q)<=radius)observe(o);
  profile(p);profile({x:(p.x+q.x)/2,y:(p.y+q.y)/2});profile(q);p=q;
 }
 return {seed,route,layout,generation,mode,radius,seconds:3600,movingSeconds:mode==='still'?0:1800,listeningSeconds:mode==='still'?3600:1800,start,end:p,generatedChunks:chunks.size,generatedRegions:regions.size,seen:[...seen].sort()};
}
export function summarizeEncounters(samples){
 if(!Array.isArray(samples)||!samples.length)throw Error('No completed routes');
 const hits={};for(const sample of samples)for(const key of new Set(sample.seen))hits[key]=(hits[key]||0)+1;
 return Object.fromEntries(Object.keys(hits).sort().map(key=>[key,{routes:hits[key],total:samples.length,proportion:hits[key]/samples.length,wilson95:wilsonInterval(hits[key],samples.length)}]));
}
