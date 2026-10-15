import assert from 'node:assert/strict';
import {populationProfile,populatedChunk,populationField} from '../src/living-populations.js';
import {livingChunk,LIVING_CATALOG} from '../src/living-catalog.js';
const seedOf=s=>Array.from(s).reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261),rng=a=>()=>((a=Math.imul(a,1664525)+1013904223>>>0)/4294967296);
const region={key:'0,0',genre:'deep',hue:200,species:[{id:'A'},{id:'B'},{id:'C'}],plants:[{t:'flor'},{t:'junco'},{t:'coral'}]},p=populationProfile(region,'bosque',seedOf,rng);
const neighbor=populationProfile({...region,key:'1,1'},'bosque',seedOf,rng);assert.deepEqual(p.flora,neighbor.flora);assert.deepEqual(p.fauna,neighbor.fauna);assert.equal(p.density,neighbor.density);
const signatures=new Set(),densities=new Set(),counts=[];
for(let x=-12;x<12;x++)for(let y=-12;y<12;y++){
 const d={...region,key:x+','+y},profile=populationProfile(d,'bosque',seedOf,rng);signatures.add(profile.signature);densities.add(profile.density);
 const base=livingChunk(x,y,900,d,'bosque',seedOf,rng),before=JSON.stringify(base),out=populatedChunk(base,x,y,900,d,profile,seedOf,rng);
 assert.deepEqual(out,populatedChunk(base,x,y,900,d,profile,seedOf,rng));assert.equal(JSON.stringify(base),before);
 assert(out.length<=5&&new Set(out.map(o=>o.id)).size===out.length);
 for(const o of out)assert(o.rare||o.group==='architecture'||LIVING_CATALOG.find(s=>s.id===o.kind).affinity.includes('bosque'));
 for(const old of base.filter(o=>o.rare||o.group==='architecture'))assert(out.includes(old),'rare/structure addresses must be retained');counts.push(out.length);
}
assert(signatures.size>20&&densities.size===4);assert(Math.min(...counts)===0&&Math.max(...counts)>=4);
const objects=Array.from({length:600},(_,i)=>({s:{id:['A','B','C'][i%3]},x:i}));
const selected=populationField(objects,'sp','test',p,seedOf),dominant=selected.filter(o=>o.s.id===p.animal).length;
assert(dominant>selected.length*.6,'a territory has no meaningful species dominance');assert.equal(objects.length,600);
assert.equal(populationProfile(region,'vacio',seedOf,rng).flora.length,0,'do not put unrelated plants into an empty biome');
console.log('PASS territorial A/B communities, coherent neighbors, 4 densities, strong native dominance, clustered bounded additions, original coordinates and rare structures preserved');
