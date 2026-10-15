import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {initialize as world} from '../src/world.js';
import {WORLD_FAMILIES,createWorldFamily,familyHabitat,familyField} from '../src/world-families.js';
import {familyContour} from '../src/world-family-art.js';
import {populationProfile,populatedChunk} from '../src/living-populations.js';
import {livingChunk} from '../src/living-catalog.js';
import {musicIdentity} from '../src/musical-recipes.js';
import {synthProgram} from '../src/synth-colors.js';
import {interactionInstruments} from '../src/musical-character.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};data(r);progress(r);world(r);
const seen=new Map(),genres=new Set(),orig=r.regionOfPos(900,900),before=JSON.stringify(orig);let legacyRares=0;
for(let x=-22;x<=22;x++)for(let y=-22;y<=22;y++){
 const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600),biome=r.BIOMES[d.z].id,f=d.worldFamily;
 assert.deepEqual(f,createWorldFamily(d,biome,r.seedOf,r.rng));assert(Object.isFrozen(f));
 assert.equal(d.recipe.worldFamily,f);assert(d.recipe.music.genre===d.genre);
 const def=WORLD_FAMILIES.find(a=>a.id===f.id);assert(def.biomes.includes(biome));
 const identity=musicIdentity(d,r.seedOf,r.rng,r.GEN);assert(identity?.worldFamily===f.id);
 assert(identity.hooks.every(id=>interactionInstruments(d.genre,r.GEN[d.genre],'lead').includes(id)));
 assert(identity.brightness<=f.music.brightness);assert(identity.energyCap<=.7);
 const bass=synthProgram(d,'bajo','instrument',r.seedOf);assert(bass.type==='lowpass'&&bass.stages<=2);
 const p=populationProfile(d,biome,r.seedOf,r.rng);
 const cx=x*r.REG+1,cy=y*r.REG+1,base=livingChunk(cx,cy,r.WCH,d,biome,r.seedOf,r.rng),
  oldProfile=populationProfile({...d,worldFamily:null},biome,r.seedOf,r.rng),
  previous=populatedChunk(base,cx,cy,r.WCH,d,oldProfile,r.seedOf,r.rng),
  current=populatedChunk(base,cx,cy,r.WCH,d,p,r.seedOf,r.rng);
 for(const rare of previous.filter(o=>o.rare||o.group==='architecture')){
  assert.deepEqual(current.find(o=>o.id===rare.id),rare,'existing rare specimen/architecture must retain identity and coordinates');
  if(rare.rare)legacyRares++;
 }
 for(const group of ['flora','fauna']){
  const compatibles=def[group].filter(id=>p[group].includes(id));
  if(compatibles.length)assert(def[group].includes(p[group][0]),'the main inhabitant must fit the landscape');
 }
 if(!d.sea){seen.set(f.id,d);genres.add(d.genre);}
}
assert.equal(seen.size,8);assert.equal(genres.size,52,'landscape selection must not remove styles');
assert(legacyRares>0,'the preservation audit must actually sample old rare individuals');
const fields=new Set(),paths=new Set();
for(const d of seen.values()){
 const f=d.worldFamily,weights=[];
 for(let x=-700;x<=700;x+=33)for(let y=-300;y<=300;y+=37){const n=familyHabitat(f,x,y);assert(n>=.12&&n<=1.000001);weights.push(n.toFixed(2));}
 assert(new Set(weights).size>20);fields.add(weights.join(','));
 const calls=[],c=new Proxy({},{get:(_,k)=>(...v)=>{assert(v.every(Number.isFinite));calls.push([k,...v]);}});
 familyContour(c,f.terrain,30,1234,.8,true);paths.add(JSON.stringify(calls));
 assert(calls.some(([k])=>k==='stroke'));
 const objects=Array.from({length:300},(_,i)=>({x:i*10-1500,y:Math.sin(i)*500})),snapshot=JSON.stringify(objects),
  field=familyField(objects,'plants','sample',f,r.seedOf);
 assert(field.length>0&&field.length<objects.length);assert.equal(JSON.stringify(objects),snapshot);
 const rare={id:'nursery:old',x:100,y:200},specimen={s:{rare:true},x:200,y:300};
 assert.deepEqual(familyField([rare,specimen],'sp','sample',f,r.seedOf),[rare,specimen]);
}
assert.equal(fields.size,8);assert.equal(paths.size,8,'silhouette paths cannot be identical with different colors');
assert.equal(JSON.stringify(orig),before);
console.log('PASS eight real families, 52 retained genres, distinct spatial fields/contours, matched materials/music/populations, protected bass, raw DNA and rare specimens');
