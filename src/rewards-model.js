import {CUBE_COLORS,CUBE_TRAILS,CUBE_HALOS} from './cube-model.js';
import {LIVING_CATALOG} from './living-catalog.js';
import {LIVING_STUDIES} from './living-studies.js';
import {POWER_IDS,POWERS} from './expansion-music.js';

// White describes availability. Gold describes ownership, never a rarity tint.
export const REWARD_RARITIES=Object.freeze({
 comun:Object.freeze({name:'Común',color:'#ffffff66',celebration:0}),
 poco_comun:Object.freeze({name:'Poco común',color:'#ffffff99',celebration:0}),
 rara:Object.freeze({name:'Rara',color:'#ffffffbb',celebration:1}),
 epica:Object.freeze({name:'Épica',color:'#ffffffdd',celebration:2}),
 mitica:Object.freeze({name:'Mítica',color:'#ffffff',celebration:2})
});
export const REWARDS_VERSION=1;
const piece=(id,name,type,rarity,kind,key,hint,extra={})=>Object.freeze({id,name,type,rarity,source:Object.freeze({kind,key}),hint,...extra});
export function createRewardsCatalog(achievements=[]){
 const colors=CUBE_COLORS.map(([hex,name,ach],i)=>piece('cube:color:'+hex.slice(1),name,'color',['comun','rara','rara','poco_comun','epica','epica'][i],ach?'achievement':'default',ach||'start',ach?'Descubre el logro de este color.':'Empieza en blanco.',{value:hex}));
 const trails=CUBE_TRAILS.map((p,i)=>piece('cube:trail:'+p.id,p.name,'trail',['comun','poco_comun','rara','epica'][i],p.ach?'achievement':'default',p.ach||'start',p.ach?'Sigue el logro de esta estela.':'Camina sin estela.',{value:p.id}));
 const halos=CUBE_HALOS.map((p,i)=>piece('cube:halo:'+p.id,p.name,'halo',['comun','poco_comun','rara'][i],p.ach?'achievement':'default',p.ach||'start',p.ach?'Sigue el logro de este halo.':'Conserva el brillo suave.',{value:p.id}));
 const biomes=['llanura','bosque','lago','dunas','cristales','jardin','ruinas','cueva','tormenta','faros','vacio'];
 const catalog=[...colors,...trails,...halos,
  ...biomes.map(id=>piece('biome:'+id,'Huella · '+id,'material','poco_comun','biome',id,'Explora este bioma.')),
  ...LIVING_CATALOG.map(d=>piece('lineage:'+d.id,d.name,'material',d.id==='whale'?'epica':'rara','lineage',d.id,'Encuentra y toca este linaje.')),
  ...LIVING_STUDIES.map(d=>piece('study:'+d.id,d.name,'memory','epica','study',d.id,'Despierta una construcción que guarde este estudio.')),
  ...POWER_IDS.map(id=>piece('box:'+id,POWERS[id].name,'memory','rara','box',id,'Abre una caja con este poder.')),
  ...[1,3,7,14,30,90,180].map((days,i)=>piece('days:'+days,'Constancia · '+days,'memory',['comun','poco_comun','poco_comun','rara','rara','epica','mitica'][i],'constancy',String(days),'Juega '+days+' días; no necesitan ser seguidos.')),
  ...['lluvia','tormenta','convergencia'].map((id,i)=>piece('weather:'+id,'Clima · '+id,'memory',['poco_comun','rara','epica'][i],'weather',id,'Escucha este clima dentro del mundo.')),
  ...['superficie','bajo','cielo'].map((id,i)=>piece('layer:'+id,['Superficie','Subsuelo','Cielo'][i],'memory',i?'rara':'comun','layer',id,'Visita esta capa.')),
  ...['raro','singular','mitico'].map((id,i)=>piece('finding:'+id,'Hallazgo · '+id,'memory',['rara','epica','mitica'][i],'finding',id,'Encuentra una tarjeta de esta rareza.')),
  ...achievements.map(a=>piece('achievement:'+a[0],a[1],'achievement',a[3]?'epica':'comun','achievement',a[0],'Completa este logro.'))
 ];
 if(new Set(catalog.map(p=>p.id)).size!==catalog.length)throw Error('Recompensas duplicadas');
 return Object.freeze(catalog);
}
export const REWARDS_CATALOG=createRewardsCatalog();
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const key=v=>typeof v==='string'&&/^[a-zA-Z0-9:#_.-]{1,100}$/.test(v)&&!['__proto__','constructor','prototype'].includes(v);
export function rewardDate(v){
 if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?$/.test(v)||!Number.isFinite(Date.parse(v)))return null;
 return new Date(v).toISOString().slice(0,10)===v.slice(0,10)?v:null;
}
export function normalizeRewards(raw){
 const items={},sources={};
 if(object(raw?.items))for(const [id,p]of Object.entries(raw.items))if(key(id)&&object(p))items[id]={obtainedAt:rewardDate(p.obtainedAt),source:typeof p.source==='string'?p.source.slice(0,120):'legacy',legacy:p.legacy===true};
 if(object(raw?.sources))for(const [id,v]of Object.entries(raw.sources))if(key(id))sources[id]={at:rewardDate(v?.at),legacy:v?.legacy===true};
 return {version:REWARDS_VERSION,items,sources};
}
export function awardReward(book,id,catalog=REWARDS_CATALOG,{at=null,source='earned',legacy=false}={}){
 if(!catalog.some(p=>p.id===id)||Object.hasOwn(book.items,id))return false;
 book.items[id]={obtainedAt:rewardDate(at),source:String(source).slice(0,120),legacy:legacy===true};return true;
}
export function rewardSource(book,kind,value,catalog=REWARDS_CATALOG,{at=null,legacy=false}={}){
 const evidence=kind+':'+value;if(!key(evidence))return [];
 if(!Object.hasOwn(book.sources,evidence))book.sources[evidence]={at:rewardDate(at),legacy:legacy===true};
 const original=book.sources[evidence],earned=[];
 for(const p of catalog)if(p.source.kind===kind&&p.source.key===String(value)&&awardReward(book,p.id,catalog,{at:original.at,source:evidence,legacy:original.legacy}))earned.push(p.id);
 return earned;
}
// Pure reconciliation: no fabricated location, clock, or loss of unknown future pieces.
export function migrateRewards(state,catalog=REWARDS_CATALOG,{at=null,legacy=true,hiddenAchievements=[]}={}){
 const book=normalizeRewards(state.rewards);
 const give=(kind,value,date=at)=>rewardSource(book,kind,value,catalog,{at:date,legacy});
 give('default','start',null);
 for(const [id,date]of Object.entries(state.ach||{}))if(date){give('achievement',id,rewardDate(date));if(hiddenAchievements.includes(id))give('achievement','oculto',rewardDate(date));}
 for(const [id,date]of Object.entries(state.zones||{}))if(date)give('biome',id,rewardDate(date)||at);
 for(const [id,entry]of Object.entries(state.livingSeen||{}))give('lineage',id,rewardDate(entry?.day)||at);
 for(const days of [1,3,7,14,30,90,180])if((state.totalDays||0)>=days)give('constancy',String(days));
 if(state.ach?.mundo)give('layer','superficie',rewardDate(state.ach.mundo));
 if(state.ach?.bajo1)give('layer','bajo',rewardDate(state.ach.bajo1));
 if(state.ach?.cielo1)give('layer','cielo',rewardDate(state.ach.cielo1));
 for(const [id,date]of Object.entries(state.ach||{}))if(date&&id.startsWith('poder_'))give('box',id.slice(6),rewardDate(date));
 for(const card of state.rareBook?.items||[])if(card&&typeof card.type==='string'){give('finding',(card.odds?.tier||card.tier)==='legendario'?'singular':(card.odds?.tier||card.tier),rewardDate(card.firstSeen)||rewardDate(card.day));if(card.type==='event:convergence')give('weather','convergencia',rewardDate(card.firstSeen));}
 // A selected legacy cosmetic is evidence of ownership even if its old flag is absent.
 for(const [type,value]of [['color',state.cube?.color||state.color],['trail',state.cube?.trail],['halo',state.cube?.halo]]){
  const p=catalog.find(p=>p.type===type&&p.value===value);if(p)awardReward(book,p.id,catalog,{source:'legacy:selection',legacy:true});
 }
 // Source records permit a future catalogue to add pieces without replaying events.
 for(const [id,v]of Object.entries(book.sources)){const split=id.indexOf(':');rewardSource(book,id.slice(0,split),id.slice(split+1),catalog,{at:v.at,legacy:v.legacy});}
 return book;
}
export function ownsReward(book,id){return Object.hasOwn(book?.items||{},id);}
