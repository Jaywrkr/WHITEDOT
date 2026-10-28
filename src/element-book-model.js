import {MICRO_INSTRUMENTS} from './micro-instruments-model.js';
import {LIVING_CATALOG} from './living-catalog.js';
import {TOY_NAMES} from './playthings.js';
import {PHENOMENON_NAMES} from './phenomena.js';
import {RHYTHM_ELEMENTS} from './percussion-model.js';
import {ECOLOGY_CONTENT} from './ecology-model.js';
import {FAMILIES} from './encounter-families.js';
import {CULTURES} from './culture-model.js';
import {SPECIES} from './vida-music.js';
import {LIVE_ENCOUNTERS} from './live-encounters-model.js';
const rows=(group,entries,prefix='')=>Object.entries(entries).map(([id,value])=>({id:prefix+id,name:typeof value==='string'?value:value.name,group}));
export const DISCOVERY_ELEMENTS=Object.freeze([
 ...LIVING_CATALOG.map(d=>({id:'living:'+d.id,name:d.name,group:d.group==='architecture'?'Arquitectura viva':'Universo vivo'})),
 ...rows('Paisaje',{piedra:'Piedra',hongo:'Hongo',campanilla:'Campanilla',cactus:'Cactus',antena:'Antena',gota:'Gota',astro:'Astro',arbol:'Árbol de luz',loto:'Loto',cristal:'Cristal',pilar:'Pilar',faro:'Faro pequeño',luz:'Mota de luz',pulso:'Luz de pulso',luciernaga:'Luciérnaga',agua:'Agua',caminante:'Caminante',bandada:'Bandada',form:'Forma procedural',blob:'Blob'}),
 ...rows('Flora',{hierba:'Hierba',flor:'Flor',arbusto:'Arbusto',helecho:'Helecho',junco:'Junco',coral:'Coral'},'planta:'),
 ...rows('Juguetes',TOY_NAMES,'toy:'),...rows('Fenómenos',PHENOMENON_NAMES,'phenomenon:'),
 ...rows('Instrumentos vivos',MICRO_INSTRUMENTS,'micro:'),
 ...rows('Percusión',RHYTHM_ELEMENTS,'rhythm:'),...ECOLOGY_CONTENT.map(e=>({id:e.id,name:e.name,group:'Paisajes vivos'})),
 ...rows('Encuentros',FAMILIES,'encounter:'),
 ...rows('Instalaciones',{glass:'Vidrios cromáticos',mirror:'Espejos musicales',strings:'Cuerdas tensables',prism:'Prisma de luz',membrane:'Membrana resonante'},'installation:'),
 ...rows('Vida',SPECIES,'life:'),{id:'life:plant',name:'Flora que crece',group:'Vida'},
 ...rows('Guardianes',CULTURES,'culture:'),
 ...rows('Hallazgos',{box:'Caja misteriosa',relic:'Reliquia',landmark:'Hito de horizonte',pet:'Compañía ganada'}),
 // Living encounters (Jay, 27 Oct 2026): the first completion of each kind. Appended last, so earlier ids keep their place.
 ...LIVE_ENCOUNTERS.map(d=>({id:'live:'+d.id,name:d.name,group:'Encuentros vivos'}))
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
const plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
export function knownElementFound(book){return Object.fromEntries(Object.entries(plain(book?.found)?book.found:{}).filter(([id,e])=>directory.has(id)&&plain(e)));}
export function normalizeElementBook(raw){
 const previous=plain(raw)?raw:{};if(Number.isInteger(previous.version)&&previous.version>1)return previous;
 const pending=new Map(Object.entries(plain(previous.unrecognizedFound)?previous.unrecognizedFound:{})),found={};
 for(const [id,e]of Object.entries(plain(previous.found)?previous.found:{}))pending.set(id,e);
 for(const [id,e]of pending){
  if(!directory.has(id)||!plain(e))continue;
  found[id]={...e,day:typeof e.day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(e.day)?e.day:'',genre:typeof e.genre==='string'?e.genre.slice(0,40):''};pending.delete(id);
 }
 return {...previous,version:1,found,...(pending.size||previous.unrecognizedFound?{unrecognizedFound:Object.fromEntries(pending)}:{})};
}
// Migrate only explicit evidence; old catN is never inflated into every object family.
export function migrateElementBook(state){
 const b=normalizeElementBook(state.elementBook);if(b.version>1)return b;const add=id=>{if(directory.has(id)&&!b.found[id])b.found[id]={day:'',genre:''};};
 for(const [k,v]of Object.entries(state.rhythmFound||{}))if(v)add('rhythm:'+k);
 for(const [k,v]of Object.entries(state.journal?.ecologyObjects||{}))if(v)add('ecology:'+k);
 for(const [k,v]of Object.entries(state.journal?.encounters||{}))if(v)add('encounter:'+k);
 if(Object.keys(state.glassSites||{}).length)add('installation:glass');if(Object.keys(state.mirrorSites||{}).length)add('installation:mirror');
 for(const [k,v]of Object.entries(state.materiaSites||{}))if(v?.seen)add('installation:'+k.split(':')[0]);
 for(const [k,v]of Object.entries(state.cultures?.collections||{}))if(v>0)add('culture:'+k);
 for(const [k,v]of Object.entries(state.vida?.seen||{}))if(v)add('life:'+k);
 for(const kind of Object.keys(state.livingSeen||{}))add('living:'+kind);
 for(const [k,v]of Object.entries(state.liveEncounters?.kinds||{}))if(v?.caught>0)add('live:'+k);
 if(state.boxesOpened>0)add('box');if(['golondrina','grulla','luciernaga'].includes(state.pet?.species))add('pet');if((state.stars||[]).length)add('relic');if(state.landmarksN>0)add('landmark');
 return b;
}
