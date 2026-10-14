// Bounded generator caches, discrete fingerprints, no coordinate/name/ID uniqueness.
import {createHash} from 'node:crypto';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {initialize as world} from '../src/world.js';
import {WORLD_VERSIONS,EXPANDED_WORLD_VERSIONS} from '../src/world-identity.js';
import {createGrammar} from '../src/grammar.js';
const samples=Number(process.argv[2]||10000),seedCount=Number(process.argv[3]||4),generation=Number(process.argv[4]||1),layout=process.argv[5]||'classic';
if(![1,2].includes(generation)||!['classic','wide','vasto'].includes(layout))throw Error('Use generation 1 or 2, layout classic, wide or vasto');
if(!Number.isInteger(samples)||samples<1||!Number.isInteger(seedCount)||seedCount<1||seedCount>64||samples*seedCount>1000000)throw Error('Use positive integers, up to 64 seeds and one million total candidates');
globalThis.localStorage={getItem:()=>null,setItem(){}};
const signatureVersion=2,retiredRecipeIDs=new Set(['installation:patch','trail:musical']);
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const all=new Set(),allMusic=new Set(),genreCounts={},ecologyCounts={},rows=[];let changedNeighbors=0,neighborPairs=0,landNeighborPairs=0,sameBiomeNeighbors=0,sameGenreNeighbors=0;
for(let seedIndex=0;seedIndex<seedCount;seedIndex++){
 const seed=seedIndex?'foundation-'+seedIndex:'original';globalThis.location={search:generation===1&&!seedIndex&&layout==='classic'?'':'?testSeed='+seed+'&layout='+layout+'&generation='+generation};
 const r={};data(r);progress(r);world(r);const size=r.REG*r.WCH,width=Math.ceil(Math.sqrt(samples)),profiles=new Set(),recipes=new Set();let land=0,previous=null;
 for(let i=0;i<samples;i++){
  const x=i%width-Math.floor(width/2),y=Math.floor(i/width)-Math.floor(width/2),d=r.regionOfPos((x+.5)*size,(y+.5)*size),p=d.recipe;
  const grammar=d.ecology?createGrammar(d,r.seedOf,r.rng):null,music=hash([d.z,d.genre,d.bpm,d.scale,d.track.bassI,d.track.hookI,d.track.bass,d.track.hook,d.pat,...(grammar?[[grammar.phraseBars,grammar.hookLimit,grammar.harmonyBars,grammar.progression]]:[])]);
  const detailed=hash([music,d.hab,d.ground,d.air,p.archetype,p.material,p.layout,p.elements.filter(e=>!retiredRecipeIDs.has(e.id)).map(e=>[e.id,e.present]),...(d.ecology?[d.ecology.signature]:[])]);
  if(!d.sea){land++;profiles.add(music);allMusic.add(music);}recipes.add(detailed);all.add(detailed);genreCounts[d.genre]=(genreCounts[d.genre]||0)+1;
  if(d.ecology)ecologyCounts[d.ecology.id]=(ecologyCounts[d.ecology.id]||0)+1;
  if(i%width&&previous){neighborPairs++;if(previous.music!==music)changedNeighbors++;if(!d.sea&&!previous.sea){landNeighborPairs++;if(previous.z===d.z)sameBiomeNeighbors++;if(previous.genre===d.genre)sameGenreNeighbors++;}}previous={music,z:d.z,genre:d.genre,sea:d.sea};
 }
 const caches=r.worldCacheStats();for(const stat of [caches.regions,caches.biomes,caches.worldChunks,caches.pathChunks,caches.continents.regions,caches.continents.seeds])if(stat.size>stat.limit)throw Error('Cache exceeded residence limit');
 rows.push({seed,samples,land,landMusicalFingerprints:profiles.size,detailedFingerprints:recipes.size,caches});
}
console.log(JSON.stringify({signatureVersion,excludedRetiredRecipeIDs:[...retiredRecipeIDs],versions:generation===2?EXPANDED_WORLD_VERSIONS:WORLD_VERSIONS,layout,candidates:samples*seedCount,seeds:seedCount,distinctDetailedFingerprints:all.size,distinctLandMusicalFingerprints:allMusic.size,neighborPairs,changedMusicalNeighborPairs:changedNeighbors,landNeighborPairs,sameBiomeNeighbors,sameGenreNeighbors,genreCounts,ecologyCounts,rows,notes:'Discrete structural fingerprints, not songs or perceptually unique experiences. Signature v2 excludes retired patch/trail flags and differs from previous universe-audit/world-variation fingerprints. Terrain caches stay bounded; aggregate SHA-256 sets grow with sample size. No player save is read or modified.'},null,2));
