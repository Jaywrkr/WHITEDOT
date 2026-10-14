import {TOY_NAMES} from './playthings.js';
import {PHENOMENON_NAMES} from './phenomena.js';
import {RHYTHM_ELEMENTS} from './percussion-model.js';
import {ECOLOGY_CONTENT} from './ecology-model.js';
import {FAMILIES} from './encounter-families.js';
import {CULTURES} from './culture-model.js';
import {SPECIES} from './vida-music.js';
const rows=(group,entries,prefix='')=>Object.entries(entries).map(([id,value])=>({id:prefix+id,name:typeof value==='string'?value:value.name,group}));
export const DISCOVERY_ELEMENTS=Object.freeze([
 ...rows('Paisaje',{piedra:'Piedra',hongo:'Hongo',campanilla:'Campanilla',cactus:'Cactus',antena:'Antena',gota:'Gota',astro:'Astro',arbol:'Árbol de luz',loto:'Loto',cristal:'Cristal',pilar:'Pilar',faro:'Faro pequeño',luz:'Mota de luz',pulso:'Luz de pulso',luciernaga:'Luciérnaga',agua:'Agua',caminante:'Caminante',bandada:'Bandada',form:'Forma procedural',blob:'Blob'}),
 ...rows('Flora',{hierba:'Hierba',flor:'Flor',arbusto:'Arbusto',helecho:'Helecho',junco:'Junco',coral:'Coral'},'planta:'),
 ...rows('Juguetes',TOY_NAMES,'toy:'),...rows('Fenómenos',PHENOMENON_NAMES,'phenomenon:'),
 ...rows('Percusión',RHYTHM_ELEMENTS,'rhythm:'),...ECOLOGY_CONTENT.map(e=>({id:e.id,name:e.name,group:'Paisajes vivos'})),
 ...rows('Encuentros',FAMILIES,'encounter:'),
 ...rows('Instalaciones',{glass:'Vidrios cromáticos',mirror:'Espejos musicales',strings:'Cuerdas tensables',prism:'Prisma de luz',membrane:'Membrana resonante'},'installation:'),
 ...rows('Vida',SPECIES,'life:'),{id:'life:plant',name:'Flora que crece',group:'Vida'},
 ...rows('Guardianes',CULTURES,'culture:'),
 ...rows('Hallazgos',{box:'Caja misteriosa',relic:'Reliquia',landmark:'Hito de horizonte',pet:'Compañía ganada'})
].map(Object.freeze));
const directory=new Map(DISCOVERY_ELEMENTS.map(e=>[e.id,e]));
export const discoveryElement=id=>directory.get(id)||null;
export function elementFamily(kind,blob=false){
 if(typeof kind!=='string')return null;
 if(kind.startsWith('forma:'))return blob?'blob':'form';
 if(kind.startsWith('vida:'))return 'life:'+kind.split(':')[1];
 const parts=kind.split(':'),id=parts.length>1?parts.slice(0,2).join(':'):kind;
 return directory.has(id)?id:null;
}
export function normalizeElementBook(raw){
 const found={};if(raw?.found&&typeof raw.found==='object'&&!Array.isArray(raw.found))for(const [id,e]of Object.entries(raw.found)){
  if(!directory.has(id)||!e||typeof e!=='object')continue;
  found[id]={day:typeof e.day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(e.day)?e.day:'',genre:typeof e.genre==='string'?e.genre.slice(0,40):''};
 }return {version:1,found};
}
// Migrate only explicit evidence; old catN is never inflated into every object family.
export function migrateElementBook(state){
 const b=normalizeElementBook(state.elementBook),add=id=>{if(directory.has(id)&&!b.found[id])b.found[id]={day:'',genre:''};};
 for(const [k,v]of Object.entries(state.rhythmFound||{}))if(v)add('rhythm:'+k);
 for(const [k,v]of Object.entries(state.journal?.ecologyObjects||{}))if(v)add('ecology:'+k);
 for(const [k,v]of Object.entries(state.journal?.encounters||{}))if(v)add('encounter:'+k);
 if(Object.keys(state.glassSites||{}).length)add('installation:glass');if(Object.keys(state.mirrorSites||{}).length)add('installation:mirror');
 for(const [k,v]of Object.entries(state.materiaSites||{}))if(v?.seen)add('installation:'+k.split(':')[0]);
 for(const [k,v]of Object.entries(state.cultures?.collections||{}))if(v>0)add('culture:'+k);
 for(const [k,v]of Object.entries(state.vida?.seen||{}))if(v)add('life:'+k);
 if(state.boxesOpened>0)add('box');if(['golondrina','grulla','luciernaga'].includes(state.pet?.species))add('pet');if((state.stars||[]).length)add('relic');if(state.landmarksN>0)add('landmark');
 return b;
}
