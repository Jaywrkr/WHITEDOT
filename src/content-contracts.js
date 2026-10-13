import {ELEMENTS,MATERIAL_NAMES} from './catalog.js';
import {FAMILIES} from './encounter-families.js';
export const CONTENT_VERSION=1;
const ROLES=['bass','groove','melody','space'];
export function createContentDirectory(entries=[]){
 const definitions=new Map();
 function register(value){
  if(!value||typeof value.id!=='string'||!value.id||definitions.has(value.id)||typeof value.name!=='string'||!value.name||!['life','toy','installation','phenomenon','encounter','trail'].includes(value.kind))throw Error('Invalid or duplicate content identity');
  for(const key of ['biomes','actions','materials','roles'])if(!Array.isArray(value[key])||!value[key].length||value[key].some(x=>typeof x!=='string'||!x))throw Error('Incomplete content contract: '+key);
  if(value.roles.some(x=>!ROLES.includes(x))||value.materials.some(x=>!MATERIAL_NAMES[x])||!Number.isFinite(value.rarity)||value.rarity<=0||value.rarity>1||!['chunk','region'].includes(value.cell))throw Error('Invalid compatibility or rarity');
  const entry={...value,version:CONTENT_VERSION};for(const key of ['biomes','actions','materials','roles'])entry[key]=Object.freeze([...value[key]]);definitions.set(entry.id,Object.freeze(entry));return definitions.get(entry.id);
 }
 for(const entry of entries)register(entry);
 return Object.freeze({register,get:id=>definitions.get(id),list:()=>[...definitions.values()],compatible:biome=>[...definitions.values()].filter(d=>d.biomes.includes(biome))});
}
export function foundationContent(biomes){
 const all=biomes.map(b=>b.id),entries=ELEMENTS.map(e=>({...e,roles:ROLES,rarity:e.rarity??1,cell:e.kind==='installation'?'region':'chunk'}));
 for(const [id,f]of Object.entries(FAMILIES))entries.push({id:'encounter:'+id,name:f.name,kind:'encounter',biomes:all,actions:['touch','drag','hold','listen'],materials:['wood','air','metal'],roles:ROLES,rarity:1/24,cell:'chunk'});
 entries.push({id:'trail:musical',name:'Rastro musical',kind:'trail',biomes:all,actions:['listen','reply','hold'],materials:['wood'],roles:['bass','groove','melody'],rarity:1/16,cell:'region'});
 return createContentDirectory(entries);
}
// Expansion API: independent streams. Existing v1 placement stays in its original generators.
export function contentVariant(definition,cell,biome,seedOf,rng){
 if(!definition.biomes.includes(biome))return null;
 const draw=tag=>rng(seedOf(`content:v${definition.version}:${definition.id}:${cell}:${tag}`))();
 return {present:draw('presence')<definition.rarity,role:definition.roles[Math.floor(draw('role')*definition.roles.length)],material:definition.materials[Math.floor(draw('material')*definition.materials.length)],variant:Math.floor(draw('behavior')*16)};
}
