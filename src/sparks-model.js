import {fragmentMask} from './crystal-play-model.js';
import {livingDefinition} from './living-catalog.js';
// One local wallet. Claims and depletion travel with the exported save.
export const SPARK_JUMP_COST=20,SPARK_SITE_LIMIT=8192;
export const sparkNumber=n=>Number.isFinite(n)?Math.min(Number.MAX_SAFE_INTEGER,Math.max(0,Math.floor(n))):0;
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const safeKey=k=>typeof k==='string'&&k.length<180&&!['__proto__','constructor','prototype'].includes(k);
const record=raw=>Object.fromEntries(Object.entries(object(raw)?raw:{}).filter(([k])=>safeKey(k)).slice(0,512));
export const SPARK_SHOP=Object.freeze([
 {id:'dust',name:'Polvo viajero',cost:40,text:'Deja pequeñas chispas blancas al caminar.'},
 {id:'facet',name:'Pulso facetado',cost:80,text:'Añade facetas visuales sin cambiar el alcance.'},
 {id:'orbit',name:'Órbita personal',cost:150,text:'Tres luces acompañan a tu cubo.'}
]);
export const SPARK_SETS=Object.freeze([
 {id:'band',name:'Primera banda',need:4,reward:15,title:'Tengo una banda'},
 {id:'neighbors',name:'Vecinos extraños',need:3,reward:15,title:'Soy de aquí'},
 {id:'wonders',name:'Pequeñas maravillas',need:3,reward:25,title:'Ojos abiertos'}
]);
export const SPARK_BADGES=Object.freeze([
 {id:'inspector',name:'Inspector de piedras',text:'Pulsa cinco veces sobre el mismo cristal agotado.',reward:0},
 {id:'resident',name:'Ahora vivo aquí',text:'Permanece dos minutos en un mismo lugar.',reward:0},
 {id:'expedition',name:'Gran expedición',text:'Camina 500 metros y vuelve cerca del inicio.',reward:5},
 {id:'errand',name:'Venía por una cosa',text:'Descubre tres tarjetas distintas en un paseo.',reward:5},
 {id:'wrong',name:'No era por aquí',text:'Regresa antes de treinta segundos de tu salto.',reward:0},
 {id:'neighbors',name:'Coleccionista de vecinos',text:'Encuentra tres tipos de vecinos en un paseo.',reward:5},
 {id:'last',name:'Un último cristal',text:'Rompe diez cristales después del Camino.',reward:5},
 {id:'taxi',name:'Sin pedir un taxi',text:'Camina un kilómetro sin pagar un salto.',reward:5}
]);
export const SPARK_MILESTONES=Object.freeze([
 {meters:1000,title:'Ya salí de casa'}, {meters:5000,title:'Me fui un rato'}, {meters:10000,title:'Conozco el camino'}
]);
export function normalizeSparkEconomy(raw,balance=0,day=''){
 if(object(raw)&&Number.isInteger(raw.version)&&raw.version>1)return raw;
 const q=object(raw)?raw:{},sites={};
 if(q.day===day&&object(q.sites))for(const [id,p]of Object.entries(q.sites).slice(0,SPARK_SITE_LIMIT)){
  if(!safeKey(id)||!object(p)||![p.x,p.y].every(Number.isFinite)||![1,2,3].includes(p.size))continue;
  const hits=Math.min(p.size,sparkNumber(p.hits)),mask=fragmentMask(p),broken=hits>=p.size,fragments=broken?(p.collected===true?mask:sparkNumber(p.fragments)&mask):0;sites[id]={x:p.x,y:p.y,size:p.size,value:[1,3,5][p.size-1],hits,broken,rare:!id.startsWith('path:')&&p.rare===true,fragments,collected:broken&&fragments===mask};
 }
 const spent=Math.min(sparkNumber(q.spent),Number.MAX_SAFE_INTEGER-sparkNumber(balance));
 return {...q,version:1,day,sites,earned:sparkNumber(balance)+spent,spent,purchases:record(q.purchases),claims:record(q.claims),
  equipped:SPARK_SHOP.some(p=>p.id===q.equipped)&&q.purchases?.[q.equipped]?q.equipped:'',goal:typeof q.goal==='string'?q.goal.slice(0,60):'jump',title:typeof q.title==='string'?q.title.slice(0,60):'',
  stats:{...q.stats,broken:sparkNumber(q.stats?.broken),jumps:sparkNumber(q.stats?.jumps),sinceJump:sparkNumber(q.stats?.sinceJump)},
  log:(Array.isArray(q.log)?q.log:[]).filter(p=>object(p)&&typeof p.title==='string').slice(-80).map(p=>({title:p.title.slice(0,100),text:String(p.text||'').slice(0,180),at:String(p.at||'').slice(0,24)}))};
}
export function creditSparks(s,amount){const n=Math.min(sparkNumber(amount),Number.MAX_SAFE_INTEGER-sparkNumber(s.sparks),Number.MAX_SAFE_INTEGER-sparkNumber(s.sparkEconomy.earned));s.sparks=sparkNumber(s.sparks)+n;s.sparkEconomy.earned+=n;return n;}
export function debitSparks(s,amount){if(!Number.isSafeInteger(amount)||amount<0||sparkNumber(s.sparks)<amount)return false;s.sparks-=amount;s.sparkEconomy.spent+=amount;return true;}
export function claimSparkReward(s,id,amount,title,text=''){
 const q=s.sparkEconomy;if(!safeKey(id)||q.version!==1||Object.hasOwn(q.claims,id))return false;
 q.claims[id]=s.todayKey||true;creditSparks(s,amount);q.log.push({title,text,at:s.todayKey||''});q.log=q.log.slice(-80);return true;
}
export function sparkSetProgress(s){
 const cards=(s.rareBook?.items||[]).filter(c=>c&&!c.forced),roles=new Set(cards.map(c=>c.context?.role||(c.type==='fossil'?'perc':c.type?.startsWith('box:')?'transformacion':'lead')));
 const neighbors=new Set(cards.filter(c=>c.type?.startsWith('living:')&&livingDefinition(c.type.slice(7))?.group==='fauna').map(c=>c.type));
 const wonders=new Set(cards.filter(c=>/^(relic:|anomaly:|culture:|event:)/.test(c.type||'')).map(c=>c.type));
 return {band:['perc','bajo','lead','acorde'].filter(k=>roles.has(k)).length,neighbors:neighbors.size,wonders:wonders.size};
}
