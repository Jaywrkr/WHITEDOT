// Bounded generator caches, discrete fingerprints, no coordinate/name/ID uniqueness.
import {createHash} from 'node:crypto';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {initialize as world} from '../src/world.js';
import {WORLD_VERSIONS} from '../src/world-identity.js';
const samples=Number(process.argv[2]||10000),seedCount=Number(process.argv[3]||4);
if(!Number.isInteger(samples)||samples<1||!Number.isInteger(seedCount)||seedCount<1||seedCount>64||samples*seedCount>1000000)throw Error('Use positive integers, up to 64 seeds and one million total candidates');
globalThis.localStorage={getItem:()=>null,setItem(){}};
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const all=new Set(),allMusic=new Set(),genreCounts={},rows=[];let changedNeighbors=0,neighborPairs=0;
for(let seedIndex=0;seedIndex<seedCount;seedIndex++){
 const seed=seedIndex?'foundation-'+seedIndex:'original';globalThis.location={search:seedIndex?'?testSeed='+seed+'&layout=classic':''};
 const r={};data(r);progress(r);world(r);const size=r.REG*r.WCH,width=Math.ceil(Math.sqrt(samples)),profiles=new Set(),recipes=new Set();let land=0,previous=null;
 for(let i=0;i<samples;i++){
  const x=i%width-Math.floor(width/2),y=Math.floor(i/width)-Math.floor(width/2),d=r.regionOfPos((x+.5)*size,(y+.5)*size),p=d.recipe;
  const music=hash([d.z,d.genre,d.bpm,d.scale,d.track.bassI,d.track.hookI,d.track.bass,d.track.hook,d.pat]);
  const detailed=hash([music,d.hab,d.ground,d.air,p.archetype,p.material,p.layout,p.elements.map(e=>[e.id,e.present])]);
  if(!d.sea){land++;profiles.add(music);allMusic.add(music);}recipes.add(detailed);all.add(detailed);genreCounts[d.genre]=(genreCounts[d.genre]||0)+1;
  if(i%width&&previous){neighborPairs++;if(previous!==music)changedNeighbors++;}previous=music;
 }
 const caches=r.worldCacheStats();for(const stat of [caches.regions,caches.biomes,caches.worldChunks,caches.pathChunks,caches.continents.regions,caches.continents.seeds])if(stat.size>stat.limit)throw Error('Cache exceeded residence limit');
 rows.push({seed,samples,land,landMusicalFingerprints:profiles.size,detailedFingerprints:recipes.size,caches});
}
console.log(JSON.stringify({versions:WORLD_VERSIONS,candidates:samples*seedCount,seeds:seedCount,distinctDetailedFingerprints:all.size,distinctLandMusicalFingerprints:allMusic.size,neighborPairs,changedMusicalNeighborPairs:changedNeighbors,genreCounts,rows,notes:'Discrete structural fingerprints, not songs or perceptually unique experiences. Signature differs from world-variation.mjs. Terrain caches stay bounded; aggregate SHA-256 sets grow with sample size. No player save is read or modified.'},null,2));
