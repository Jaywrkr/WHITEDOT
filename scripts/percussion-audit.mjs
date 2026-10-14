import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {createRhythmElements,rhythmVoice,rhythmPattern} from '../src/percussion-model.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const profiles=new Set(),families={},instruments={},genres=new Set();let chunks=0,empty=0,rare=0,total=0;
for(const seed of ['ritmo-a','ritmo-b','ritmo-c']){
 globalThis.location={search:'?testSeed='+seed+'&layout=vasto&generation=2'};const r={};data(r);progress(r);world(r);
 for(let i=0;i<4000;i++){
  const x=(i%80-40)*83,y=(Math.floor(i/80)-25)*61,d=r.regionOfPos((x+.5)*r.WCH,(y+.5)*r.WCH),list=createRhythmElements(x,y,r.WCH,d,r.seedOf,r.rng);
  chunks++;if(!list.length){empty++;continue;}genres.add(d.genre);total+=list.length;
  const recipe=list.map(o=>{families[o.kind]=(families[o.kind]||0)+1;if(o.kind==='fossil')rare++;const v=rhythmVoice('rhythm:'+o.kind+':'+o.variant,d,r.seedOf);instruments[v.instrument]=(instruments[v.instrument]||0)+1;return [o.kind,o.variant,v.instrument,v.degree,rhythmPattern(o.kind,d.genre,o.variant)];});
  profiles.add(createHash('sha256').update(JSON.stringify([d.genre,recipe])).digest('hex'));
 }
}
console.log(JSON.stringify({version:JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8')).version,sampledChunks:chunks,emptyChunks:empty,totalElements:total,fossils:rare,discretePercussionRecipes:profiles.size,representedGenres:genres.size,families,instruments,notes:'Three Vasto/Vivo preview seeds. Empty sea/land chunks included. Recipes exclude coordinates, IDs and world seed; this counts musical/object structures, not perceptually unique worlds or songs. Base terrain generator, 11 biomes, 33 ecologies and 52 genre IDs are unchanged.'},null,2));
