import {ACH_CATEGORIES,legacyAchievementCategory,RETIRED_ACHIEVEMENTS} from './achievement-metadata.js';
export {ACH_CATEGORIES,legacyAchievementCategory,RETIRED_ACHIEVEMENTS} from './achievement-metadata.js';
const count=x=>Object.keys(x||{}).length;
export function achievementMetrics(s){return {days:s.totalDays||0,light:s.totalLight||0,places:count(s.places),biomes:count(s.zones),genres:count(s.journal?.music?.genres),instruments:count(s.journal?.music?.instruments),lineages:count(s.livingSeen),flora:count(s.vida?.plants),petPlaces:s.pet?.places?.length||0,petTime:Math.floor((s.pet?.seconds||0)/60),elements:count(s.elementBook?.found),cards:s.rareBook?.items?.length||0,cube:count(Object.fromEntries(Object.entries(s.rewards?.items||{}).filter(([id])=>id.startsWith('cube:')))),rooms:s.house?.visited?(s.house.unlocked?.length||0):0,houseObjects:s.house?.objects?.length||0,houseVisits:count(s.house?.knownVisitors),sets:s.setCount||0,layers:['mundo','bajo1','cielo1'].filter(id=>s.ach?.[id]).length,studies:count(Object.fromEntries(Object.entries(s.rewards?.sources||{}).filter(([id])=>id.startsWith('study:'))))};}
const groups=[
 ['Camino','days','Días compartidos',[2,5,14,21,45,60,90,120,180,240,300,365]],
 ['Mundo','places','Horizontes',[2,5,10,20,35,50,75,100,150,250]],
 ['Mundo','biomes','Paisajes',[2,4,6,8,11]],
 ['Mundo','layers','Capas',[2,3]],
 ['Música','genres','Voces del universo',[2,4,6,8,10,14,18,22,26,32,40,46,52]],
 ['Música','instruments','Timbres',[2,4,6,8,10,14,18,22,26,30,36,40]],
 ['Vida','lineages','Vida compartida',[2,4,6,8,10,14,18,22,25,28]],
 ['Vida','petPlaces','Viajar juntos',[2,4,8,12,20,30]],
 ['Vida','petTime','Escuchar juntos',[5,15,30,60,120,240]],
 ['Colección','elements','Maneras de tocar',[5,15,25,40,55,70,85,100,109]],
 ['Colección','cards','Encuentros memorables',[2,5,10,20,35,50,75,100]],
 ['Colección','cube','Tu forma',[10,15,20,25,30,35,40,45,50]],
 ['Casa','rooms','Habitaciones',[1,2,3,4]],
 ['Casa','houseObjects','Objetos que escuchan',[1,3,5,8,12,20,30,40]],
 ['Casa','houseVisits','Puertas abiertas',[1,3,7,14,22]],
 ['Secretos','studies','Recuerdos del mundo',[1,2,3,4,6,8,10,12]]
];
export function newAchievementRules(existing,target=250){const candidates=groups.flatMap(([category,metric,title,thresholds])=>thresholds.map((threshold,index)=>({id:`v2:${metric}:${threshold}`,name:title+' · '+threshold,description:({days:'Comparte',places:'Explora',biomes:'Escucha',genres:'Escucha',instruments:'Escucha',lineages:'Encuentra',petPlaces:'Comparte',petTime:'Acompaña',elements:'Descubre',cards:'Conserva',cube:'Gana',rooms:'Abre',houseObjects:'Coloca',houseVisits:'Recibe',studies:'Despierta'})[metric]+' '+threshold+' '+({days:'días distintos.',places:'lugares.',biomes:'biomas.',genres:'géneros.',instruments:'timbres.',lineages:'linajes.',petPlaces:'lugares con tu mascota.',petTime:'minutos a tu mascota.',elements:'familias de elementos.',cards:'tarjetas de encuentros.',cube:'piezas del cubo.',rooms:'habitaciones.',houseObjects:'objetos musicales.',houseVisits:'visitas diferentes.',studies:'estudios del mundo.'})[metric],category,metric,threshold,tier:index<thresholds.length/3?'bronce':index<thresholds.length*2/3?'plata':'oro',hidden:category==='Secretos'})));
 // Round-robin categories keeps a finite target from truncating Casa or Secretos.
 const queues=ACH_CATEGORIES.map(category=>candidates.filter(p=>p.category===category)),out=[];while(out.length<Math.max(0,target-existing.length)&&queues.some(q=>q.length))for(const q of queues)if(q.length&&out.length<target-existing.length)out.push(q.shift());return out;}
export function achievementMeta(a,rules=[]){const r=rules.find(p=>p.id===a[0]);return r||{id:a[0],category:legacyAchievementCategory(a),tier:a[3]?'oro':'bronce',hidden:!!a[3],retired:RETIRED_ACHIEVEMENTS.has(a[0])};}
export function achievementProgress(rule,state){const value=achievementMetrics(state)[rule.metric]||0;return {value,target:rule.threshold,ratio:Math.min(1,value/rule.threshold)};}
