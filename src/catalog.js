// Content recipes are data: adding one entry does not consume another system's RNG.
import {familyOf} from './rhythms.js';
export const RECIPE_VERSION=1;
export const MATERIAL_NAMES={wood:'Madera cálida',glass:'Cristal suave',metal:'Metal filtrado',air:'Aire sedoso'};
const all=['llanura','bosque','lago','ruinas','jardin','dunas','cristales','faros','tormenta','cueva','vacio'];
export const ELEMENTS=[
 {id:'installation:patch',name:'Jardín modular',kind:'installation',biomes:all.filter(b=>b!=='vacio'),motion:'static',actions:['connect','disconnect','listen'],materials:['metal','wood'],rarity:.18,home:true},
 {id:'installation:mirror',name:'Espejos musicales',kind:'installation',biomes:all.filter(b=>b!=='vacio'),motion:'rotate',actions:['rotate','pulse','listen'],materials:['metal','glass'],rarity:.22,home:true},
 {id:'installation:glass',name:'Tres vidrios cromáticos',kind:'installation',biomes:all.filter(b=>b!=='vacio'),motion:'rotate',actions:['rotate','pulse','listen'],materials:['glass'],rarity:.32,home:true},
 {id:'toy:spark',name:'Luz fugitiva',kind:'toy',biomes:all.filter(b=>b!=='cueva'),motion:'flight',actions:['touch','pulse'],materials:['glass','air']},
 {id:'toy:spring',name:'Brote saltarín',kind:'toy',biomes:['llanura','bosque','ruinas','jardin','cueva'],motion:'jump',actions:['touch','pulse'],materials:['wood','air']},
 {id:'toy:kite',name:'Cometa flotante',kind:'toy',biomes:['bosque','lago','dunas','faros','tormenta'],motion:'flight',actions:['touch','pulse'],materials:['air','glass']},
 {id:'toy:rotor',name:'Prisma giratorio',kind:'toy',biomes:['ruinas','jardin','dunas','cristales','tormenta','cueva'],motion:'spin',actions:['touch','pulse'],materials:['glass','metal']},
 {id:'toy:resonator',name:'Aro resonante',kind:'toy',biomes:['llanura','lago','ruinas','cristales','faros','cueva','vacio'],motion:'static',actions:['touch','pulse'],materials:['wood','metal','glass']},
 {id:'flora',name:'Flora musical',kind:'life',biomes:all,motion:'sway',actions:['touch','pulse'],materials:['wood','air']},
 {id:'fauna',name:'Fauna musical',kind:'life',biomes:all,motion:'follow',actions:['touch','pulse'],materials:['wood','air','glass']},
 {id:'phenomenon:bird',name:'Ave de eco',kind:'phenomenon',biomes:['llanura','bosque','lago','jardin','dunas','faros'],motion:'flight',actions:['listen','touch','pulse'],materials:['air'],rarity:.18},
 {id:'phenomenon:shaker',name:'Semillero de caja',kind:'phenomenon',biomes:all.filter(b=>!['faros','vacio'].includes(b)),motion:'shake',actions:['touch','pulse'],materials:['wood','metal']},
 {id:'phenomenon:cloud',name:'Nube de pulso',kind:'phenomenon',biomes:['ruinas','cristales','faros','tormenta','cueva','vacio'],motion:'float',actions:['touch','pulse'],materials:['air','metal']}
];
export const ARCHETYPES={quiet:'Espacio de escucha',balanced:'Ensamble abierto',organic:'Jardín de respuestas',mechanical:'Mecanismos resonantes',melodic:'Paisaje melódico',rhythmic:'Patio de ritmo'};
export function createElementCatalog(entries=ELEMENTS){
 const catalog=new Map();
 function register(entry){
  if(!entry?.id||!entry.name||!entry.kind||!Array.isArray(entry.biomes)||!entry.biomes.length||!entry.actions?.length||!entry.materials?.length)throw Error('Incomplete element definition');
  if(catalog.has(entry.id))throw Error(`Duplicate element: ${entry.id}`);
  if(entry.materials.some(id=>!MATERIAL_NAMES[id]))throw Error('Unknown material');
  if(entry.rarity!==undefined&&!(entry.rarity>0&&entry.rarity<=1))throw Error('Invalid rarity');
  const copy={...entry};for(const key of ['biomes','actions','materials','roles'])if(copy[key])copy[key]=Object.freeze([...copy[key]]);
  catalog.set(entry.id,Object.freeze(copy));return catalog.get(entry.id);
 }
 entries.forEach(register);
 return Object.freeze({register,get:id=>catalog.get(id),list:()=>[...catalog.values()],compatible:biome=>[...catalog.values()].filter(e=>e.biomes.includes(biome))});
}
export function createRegionalRecipe(region,biome,seedOf,rng,catalog=createElementCatalog()){
 const random=tag=>rng(seedOf(`recipe:v${RECIPE_VERSION}:${region.key}:${tag}`)),r=random('identity');
 const quiet=region.sea||biome==='vacio',styles=['balanced','organic','mechanical','melodic','rhythmic'];
 const archetype=quiet?'quiet':region.key==='0,0'?'balanced':styles[Math.floor(r()*styles.length)];
 const materialPool=archetype==='mechanical'?['metal','glass']:archetype==='organic'?['wood','air']:Object.keys(MATERIAL_NAMES);
 const material=materialPool[Math.floor(r()*materialPool.length)],layout=['clusters','scattered','rings'][Math.floor(r()*3)];
 const elements=catalog.compatible(biome).map(e=>{const draw=random(`element:${e.id}`),present=draw()< (e.rarity??1)||Boolean(e.home&&region.key==='0,0');return {id:e.id,present,weight:present?.4+draw()*1.6:0};});
 return Object.freeze({version:RECIPE_VERSION,key:region.key,archetype,name:ARCHETYPES[archetype],biome,layer:region.key.startsWith('bajo:')?'bajo':region.key.startsWith('cielo:')?'cielo':'superficie',
  material,materialName:MATERIAL_NAMES[material],layout,activity:quiet?.3:.65+r()*.35,objectDensity:quiet?.25:.45+r()*1.05,
  elements:Object.freeze(elements.map(Object.freeze)),music:Object.freeze({genre:region.genre,family:familyOf(region.genre),bpm:region.bpm,scale:Object.freeze([...region.scale])}),
  worldFamily:region.worldFamily||null,
  visual:Object.freeze({hue:region.hue,material,background:'#000',motion:archetype==='mechanical'?'precise':'breathing'}),
  budgets:Object.freeze({objects:quiet?8:40,ambientPerBar:1,activeVoices:4}),influences:Object.freeze([])});
}

export function chooseRecipeElement(recipe,catalog,kind,random){
 const pool=recipe.elements.filter(e=>e.present&&catalog.get(e.id)?.kind===kind).map(e=>{
  const definition=catalog.get(e.id),motion=definition.motion;
  const affinity=recipe.archetype==='mechanical'?(['spin','static'].includes(motion)?2:.6):recipe.archetype==='organic'?(['jump','flight','sway'].includes(motion)?1.8:.6):recipe.archetype==='rhythmic'?(['jump','static','shake'].includes(motion)?1.8:.8):1;
  return {definition,weight:e.weight*affinity};
 });
 if(!pool.length)return null;let pick=random()*pool.reduce((n,e)=>n+e.weight,0);
 for(const e of pool){pick-=e.weight;if(pick<=0)return e.definition;}return pool.at(-1).definition;
}
