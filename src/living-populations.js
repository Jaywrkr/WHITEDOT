import {LIVING_CATALOG} from './living-catalog.js';
import {activeWorldFamily,worldFamilyDefinition,familyHabitat} from './world-families.js';
// Territorial composition, separate from legacy placement. Empty areas stay meaningful.
const DENSITIES=[.25,.55,.9,1.25];
export function populationProfile(region,biome,seedOf,rng){
 const [rx,ry]=region.key.split(',').map(Number),zone=`${Math.floor((rx||0)/3)},${Math.floor((ry||0)/3)}:${biome}`;
 const family=activeWorldFamily(region),definition=worldFamilyDefinition(family?.id),random=rng(seedOf(`population:territory:v1:${zone}`));
 const choose=group=>{const compatible=LIVING_CATALOG.filter(d=>d.group===group&&d.affinity.includes(biome)&&d.id!=='whale');
  const pool=compatible;if(!pool.length)return [];
  const preferred=pool.filter(d=>definition?.[group].includes(d.id)),dominants=preferred.length?preferred:pool;
  const first=dominants[Math.floor(random()*dominants.length)],other=pool.filter(d=>d!==first),mix=random();
  if(mix<.3||!other.length)return [first.id];const second=other[Math.floor(random()*other.length)],third=other.filter(d=>d!==second);
  return [first.id,second.id,...(mix>.75&&third.length?[third[Math.floor(random()*third.length)].id]:[])];};
 const flora=choose('flora'),fauna=choose('fauna'),density=DENSITIES[Math.floor(random()*DENSITIES.length)],share=.2+random()*.6,
  faunaShare=definition?share*definition.life.fauna/(share*definition.life.fauna+(1-share)*definition.life.flora):share;
 const h=seedOf(`population:native:v1:${region.key}`),species=region.species||[],plants=region.plants||[];
 return Object.freeze({version:1,zone,biome,density,faunaShare,family,flora:Object.freeze(flora),fauna:Object.freeze(fauna),
  animal:species.length?species[h%species.length].id:'',plant:plants.length?plants[(h>>>8)%plants.length].t:'',
  signature:`${flora.join('+')}:${fauna.join('+')}:${density}:${Math.round(faunaShare*10)}${family?':'+family.id:''}`});
}
export function populatedChunk(base,cx,cy,size,region,profile,seedOf,rng){
 const random=rng(seedOf(`population:inhabitants:v1:${cx},${cy}`));
 if(region.sea&&random()>.12)return base;
 const out=base.filter(o=>o.rare||o.group==='architecture'||profile[o.group]?.includes(o.kind)&&
  seedOf(`population:keep:v1:${o.id}`)%1000<(profile[o.group]?.[0]===o.kind?900:profile[o.group]?.[1]===o.kind?550:250)*Math.min(1,profile.density));
 const n=Math.min(2,Math.floor(profile.density*1.5+random()));
 const ax=(cx+.25+random()*.5)*size,ay=(cy+.25+random()*.5)*size;
 for(let i=0;i<n;i++){
  const groupRoll=random();let group=groupRoll<profile.faunaShare?'fauna':'flora';if(!region.sea&&!profile[group].length)group=group==='flora'?'fauna':'flora';if(!region.sea&&!profile[group].length)continue;
  let pool=region.sea?(group==='fauna'?['jelly','manta','turtle']:['reeds']):profile[group];
  const pick=random(),variant=Math.floor(random()*256);
  if(variant===255&&profile.family){
   // M1's rare added individuals already have collectible IDs: retain their species too.
   const legacy=populationProfile({...region,worldFamily:null},profile.biome,seedOf,rng);
   group=groupRoll<legacy.faunaShare?'fauna':'flora';if(!region.sea&&!legacy[group].length)group=group==='flora'?'fauna':'flora';
   pool=region.sea?(group==='fauna'?['jelly','manta','turtle']:['reeds']):legacy[group];
  }
  const kind=pool[pick<.72?0:pick<.94?1:2]||pool[0],def=LIVING_CATALOG.find(d=>d.id===kind);
  const a=random()*Math.PI*2,r=30+random()*95,x=ax+Math.cos(a)*r,y=ay+Math.sin(a)*r;
  // Only common additions are projected into the new niches. Rares keep their address.
  if(variant!==255&&profile.family&&seedOf(`world:inhabitant:v1:${cx},${cy}:${i}`)%1000>=(.3+.7*familyHabitat(profile.family,x,y))*1000)continue;
  out.push({id:`living:v1:${cx},${cy}:${10+i}`,kind,shape:def.shape,group,variant,x,y,homeX:x,homeY:y,hue:(region.hue+variant%35)%360,
   size:9+variant%12,phase:variant/256*Math.PI*2,studyVariant:0,personality:['timida','curiosa','social'][variant%3],activeAt:variant%4,rare:variant===255,
   lit:0,energy:0,phrase:[],touching:false,...(region.sea?{aquatic:true}:{})});
 }return out;
}
export function populationField(items,field,chunkId,profile,seedOf){
 if(!['sp','plants','grass','flies','walkers'].includes(field)||items.length<2)return items;
 return items.filter((o,i)=>{
  if(o.id?.startsWith('nursery:')||o.s?.rare||i===0)return true;
  const dominant=field==='sp'?o.s?.id===profile.animal:field==='plants'?o.pt?.t===profile.plant:true;
  const weight=(dominant?.95:.18)*Math.min(1,profile.density);
  return seedOf(`population:field:v1:${chunkId}:${field}:${i}`)%1000<weight*1000;
 });
}
