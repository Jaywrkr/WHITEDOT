import {ecosystemField} from './ecosystem-field.js';
import {elementInk} from './visual.js';
import {populationProfile} from './living-populations.js';
export function blobHabitat(region,seed,seedOf){return !region.sea&&(/^blobs/i.test(seed||'')||seedOf(`blob-habitat:v1:${region.key}`)%100<14);}
export function blobTraits(species,seedOf,rng){
 const r=rng(seedOf(`blob:v1:${species.id}`));return {size:8+r()*7,lobes:3+Math.floor(r()*4),period:1500+r()*1800,bounce:2+r()*4,hueOffset:r()*30-15};
}
export function blobVoice(kind,region,genres,seedOf,rng){
 const r=rng(seedOf(`blob-voice:v1:${region.key}:${kind}`)),g=genres[region.genre],roles=['bajo','perc','acorde','lead'],role=roles[Math.floor(r()*roles.length)];
 const pool=role==='bajo'?(g.bassP||[g.bassI,'sub']):role==='perc'?(g.percP||['tom','wood','conga','rim']):g.hookP;
 return {role,instrument:pool[Math.floor(r()*pool.length)],degree:Math.floor(r()*7),response:4,low:role==='bajo'?36:role==='acorde'?48:53,high:role==='bajo'?55:role==='acorde'?67:72};
}
const RATIOS={grass:.22,plants:.35,sp:.4,props:.5,crystals:.45,pillars:.55,playthings:.5,flies:1,walkers:1};
export function calmField(items,field,chunkId,seedOf){
 const ratio=RATIOS[field];if(!ratio||items.length<3)return items;
 return items.filter((item,i)=>(typeof item.id==='string'&&item.id.startsWith('nursery:'))||i===0||seedOf(`breathing:v1:${chunkId}:${field}:${i}`)%1000<ratio*1000);
}
export function initialize(runtime){
 const views=new WeakMap(),traits=new Map();
 function sceneChunk(chunk){
  let entry=views.get(chunk);if(!entry){const [x,y]=chunk.id.split(',').map(Number),d=runtime.regionOfPos((x+.5)*runtime.WCH,(y+.5)*runtime.WCH);entry={view:{...chunk},sources:{},family:d.worldFamily,population:populationProfile(d,runtime.BIOMES[d.z].id,runtime.seedOf,runtime.rng)};views.set(chunk,entry);}
  for(const [field,value] of Object.entries(chunk)){
   if(!RATIOS[field]){entry.view[field]=value;continue;}
   if(entry.sources[field]!==value||entry.sources[field+':length']!==value.length){entry.sources[field]=value;entry.sources[field+':length']=value.length;entry.view[field]=ecosystemField(value,field,chunk.id,entry.population,runtime.seedOf);}
  }return entry.view;
 }
 function habitat(region){return blobHabitat(region,runtime.S.worldSeed,runtime.seedOf);}
 function draw(species,object,x,y,t,beat){
  if(!traits.has(species.id)){traits.set(species.id,blobTraits(species,runtime.seedOf,runtime.rng));while(traits.size>128)traits.delete(traits.keys().next().value);}
  const p=traits.get(species.id),d=runtime.regionOfPos(object.x,object.y),c=runtime.cx,r=p.size*(1+object.lit*.12)*Math.max(.8,Math.min(2,(species.cell||2)/2)),bounce=Math.sin(t/p.period+object.ph)*p.bounce;
  c.save();c.translate(x,y-bounce);c.strokeStyle=object.lit>.1?(runtime.musicInk?.(object)||'#fff'):elementInk('air',d.hue+p.hueOffset);c.fillStyle=c.strokeStyle;c.lineWidth=1.2;c.beginPath();
  for(let i=0;i<=40;i++){const a=i/40*Math.PI*2,rad=r*(1+.1*Math.sin(a*p.lobes+t/p.period+object.ph));const px=Math.cos(a)*rad,py=Math.sin(a)*rad*.84;if(i)c.lineTo(px,py);else c.moveTo(px,py);}
  c.closePath();const alpha=c.globalAlpha;c.globalAlpha=alpha*.12;c.fill();c.globalAlpha=alpha;c.stroke();
  c.globalAlpha=alpha*.6;const eye=2+beat*.4;c.fillRect(-4,-eye,1.5,1.5);c.fillRect(3,-eye,1.5,1.5);c.restore();
 }
 Object.defineProperties(runtime,{sceneChunk:{get:()=>sceneChunk},blobHabitat:{get:()=>habitat},drawBlob:{get:()=>draw}});
}
