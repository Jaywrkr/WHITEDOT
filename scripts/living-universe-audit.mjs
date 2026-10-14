import {createHash} from 'node:crypto';import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {livingChunk,musicRecipe,LIVING_CATALOG} from '../src/living-catalog.js';import {microhabitat} from '../src/living-terrain.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const detailed=new Set(),music=new Set(),types=new Set(),genres=new Set(),biomes=new Set();let land=0,objects=0,rare=0;
for(let seed=0;seed<20;seed++){
 globalThis.location={search:'?testSeed=vivo-'+seed+'&layout=immense&generation=2'};const r={};data(r);progress(r);world(r);const size=r.REG*r.WCH;
 for(let i=0;i<500;i++){
  const x=i%25-12,y=Math.floor(i/25)-10,d=r.regionOfPos((x+.5)*size,(y+.5)*size);genres.add(d.genre);biomes.add(r.BIOMES[d.z].id);
  const score=musicRecipe(d,r.seedOf,r.rng),recipe=[d.z,d.genre,d.bpm,d.scale,d.track.bass,d.track.hook,score];const fingerprint=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
  if(!d.sea){land++;music.add(fingerprint(recipe));}
  const cx=Math.floor((x+.5)*r.REG),cy=Math.floor((y+.5)*r.REG),scene=[];
  for(let a=cx-1;a<=cx+1;a++)for(let b=cy-1;b<=cy+1;b++)scene.push(...livingChunk(a,b,r.WCH,d,r.BIOMES[d.z].id,r.seedOf,r.rng));
  for(const o of scene){objects++;rare+=o.rare?1:0;types.add(o.kind);}
  // Remove names, IDs, coordinates and the recipe's key from uniqueness evidence.
  detailed.add(fingerprint([recipe,scene.map(o=>[o.kind,o.variant,o.personality,o.activeAt,o.studyVariant]),microhabitat(cx*r.WCH,cy*r.WCH,r.WCH,r.seedOf).id]));
 }
}
console.log(JSON.stringify({sampledRegions:10000,seeds:20,generation:2,layout:'immense',regionSide:100800,landRegions:land,detailedSignatures:detailed.size,landMusicSignatures:music.size,genres:genres.size,biomes:biomes.size,catalogFamilies:LIVING_CATALOG.length,foundFamilies:types.size,objects,rare,notes:'A sample of structural recipes, not a count of songs, total worlds or perceptually distinct experiences. No extrapolation to millions and no multiplication of correlated variables. Additional content uses independent namespaces; old favorites keep their layout and versions.'},null,2));
