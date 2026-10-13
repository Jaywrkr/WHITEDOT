// Laboratorio: lista de elementos interactivos para probarlos uno por uno y anotar qué mejorar.
// Puro (sin DOM): se prueba en Node. Cada elemento dice dónde encontrarlo y qué probar.
import {FAMILIES} from './encounter-families.js';
import {TOY_NAMES} from './playthings.js';
import {PHENOMENON_NAMES} from './phenomena.js';
import {HOME_MATERIA} from './materia-music.js';
import {SPECIES,HOME_PLANTS} from './vida-music.js';

// Preguntas iguales para todos: así las notas se comparan entre elementos.
export const LAB_CHECKS=[
 {id:'clear',label:'Se entiende qué hacer'},
 {id:'responds',label:'Responde bien al dedo'},
 {id:'sound',label:'Suena bien con la música'},
 {id:'look',label:'Se ve bien'},
 {id:'fun',label:'Dan ganas de repetir'}
];
export const LAB_VERDICTS={ok:'Bien',fix:'Mejorar',cut:'Quitar'};

const home=(x,y)=>({type:'home',x,y});
const BASE=[
 {id:'materia:strings',group:'Materia',name:'Cuerdas tensables',find:home(...HOME_MATERIA.strings),try:['Arrastra una cuerda hacia arriba o abajo y suéltala: más tensión, nota más alta.','Cruza las cuatro cuerdas de un trazo para rasguear.','Comprueba que el pixel no se mueve mientras tocas.']},
 {id:'materia:prism',group:'Materia',name:'Prisma de luz',find:home(...HOME_MATERIA.prism),try:['Arrastra alrededor del triángulo para girarlo.','Busca el ángulo que enciende más cristales (hasta 5).','Suelta: suena el acorde de los cristales encendidos.']},
 {id:'materia:membrane',group:'Materia',name:'Membrana resonante',find:home(...HOME_MATERIA.membrane),try:['Toca el centro (grave) y el borde (agudo).','Mantén el dedo para redoblar; muévelo para cambiar la nota.']},
 {id:'glass',group:'Instalaciones',name:'Vidrios',find:home(1080,900),try:['Gira los aros arrastrando.','Mira el color que toma y escucha el canal que cambia.']},
 {id:'mirrors',group:'Instalaciones',name:'Espejos',find:home(1600,900),try:['Empuja un espejo con el cubo: gira como una puerta.','Lleva la luz al rombo: suena un acorde, el lugar se tiñe y queda una capa sonando.']},
];
const life=[
 ...Object.entries(SPECIES).map(([kind,s])=>({id:'life:'+kind,group:'Vida',name:s.name,find:{type:'flock',species:kind},
  try:kind==='luciernaga'?['Quédate quieto cerca: se van sincronizando (mira el %).','Al sincronizarse, sus destellos caen en un groove.','Toca una: te contesta.']
   :['Toca un ave (más arriba, más agudo). En dos compases la bandada te devuelve tu llamada.','Quédate quieto unos segundos: confían y se acercan.','Entra corriendo: se dispersan.']})),
 {id:'life:plant',group:'Vida',name:'Flora que crece',find:{type:'home',x:HOME_PLANTS[0][0],y:HOME_PLANTS[0][1]},try:['Quédate cerca y quieto: crece y suma notas a su arpegio.','Tócala para regarla: suena y crece un poco.','Si no vuelves, se seca con las horas.']}
];
const families=Object.entries(FAMILIES).map(([id,f])=>({id:'family:'+id,group:'Encuentros',name:f.name,find:{type:'family',family:id},try:f.hint.split(' · ').map(s=>s[0].toUpperCase()+s.slice(1)+'.')}));
const toys=Object.entries(TOY_NAMES).map(([kind,name])=>({id:'toy:'+kind,group:'Juguetes',name,find:{type:'toy',kind},
 try:kind==='rotor'?['Arrastra para girarlo.','Quédate cerca para cultivar.']:kind==='resonator'?['Arrastra para modelar el aro.','Quédate cerca para cultivar.']:['Pasa a través o tócalo.','Escucha cómo responde.']}));
const phenomena=Object.entries(PHENOMENON_NAMES).map(([kind,name])=>({id:'phenomenon:'+kind,group:'Fenómenos',name,find:{type:'phenomenon',kind},try:['Acércate y escucha.','Toca cerca y espera su respuesta.']}));
const tools=[
 {id:'tool:fx',group:'Herramientas',name:'Mesa de efectos',find:{type:'tool',tool:'fx'},try:['Arrastra en el pad: horizontal filtro, vertical espacio.','Prueba Eco, Robot, Chorus, Phaser, Freeze y Stop.','Activa Fijar y suelta el dedo.']},
 {id:'tool:sonar',group:'Herramientas',name:'Pulso / sonar',find:{type:'tool',tool:'sonar'},try:['Toca un espacio vacío: lanza un pulso.','Mira qué objetos responden y cómo suena.']},
 {id:'tool:place-code',group:'Herramientas',name:'Código de lugar',find:{type:'tool',tool:'favorites'},try:['Copia el código de aquí.','Muévete, pégalo y ábrelo: debe orientarte.']},
 {id:'tool:record',group:'Herramientas',name:'Grabar set',find:{type:'tool',tool:'record'},try:['Graba 10–20 s tocando algo.','Revisa video, audio y que se pueda compartir.']}
];
export const LAB_ELEMENTS=[...BASE,...life,...families,...toys,...phenomena,...tools];
export const LAB_GROUPS=[...new Set(LAB_ELEMENTS.map(e=>e.group))];
export const labElement=id=>LAB_ELEMENTS.find(e=>e.id===id)||null;
export function labStep(id,delta){const i=Math.max(0,LAB_ELEMENTS.findIndex(e=>e.id===id));return LAB_ELEMENTS[(i+delta+LAB_ELEMENTS.length)%LAB_ELEMENTS.length];}

// Notas: solo lo que el jugador escribió. Validadas para no romper con datos viejos o editados.
export function normalizeLabNotes(raw){
 const out={};if(!raw||typeof raw!=='object')return out;
 for(const [id,n] of Object.entries(raw)){
  if(!labElement(id)||!n||typeof n!=='object')continue;
  const checks={};for(const c of LAB_CHECKS)if(n.checks?.[c.id]===true||n.checks?.[c.id]===false)checks[c.id]=n.checks[c.id];
  out[id]={verdict:LAB_VERDICTS[n.verdict]?n.verdict:'',checks,text:typeof n.text==='string'?n.text.slice(0,1200):'',at:Number.isFinite(n.at)?n.at:0};
 }return out;
}
export const labTested=n=>!!(n&&(n.verdict||n.text||Object.keys(n.checks||{}).length));
// Informe en Markdown para pegar en ChatGPT/Claude o guardar en el repo.
export function labReport(notes,{date='',build=''}={}){
 const clean=normalizeLabNotes(notes),tested=LAB_ELEMENTS.filter(e=>labTested(clean[e.id]));
 const count=v=>tested.filter(e=>clean[e.id].verdict===v).length;
 const lines=[`# Laboratorio WHITEDOT${date?' · '+date:''}`,'',`Probados: ${tested.length} de ${LAB_ELEMENTS.length} · Bien ${count('ok')} · Mejorar ${count('fix')} · Quitar ${count('cut')}${build?' · '+build:''}`,''];
 for(const group of LAB_GROUPS){
  const items=tested.filter(e=>e.group===group);if(!items.length)continue;lines.push(`## ${group}`,'');
  for(const e of items){const n=clean[e.id];lines.push(`### ${e.name}${n.verdict?' — '+LAB_VERDICTS[n.verdict]:''}`);
   const bad=LAB_CHECKS.filter(c=>n.checks[c.id]===false).map(c=>c.label),good=LAB_CHECKS.filter(c=>n.checks[c.id]===true).map(c=>c.label);
   if(bad.length)lines.push(`- Falla: ${bad.join(', ')}`);if(good.length)lines.push(`- Funciona: ${good.join(', ')}`);if(n.text.trim())lines.push(`- Nota: ${n.text.trim().replace(/\n+/g,' / ')}`);lines.push('');}
 }
 const untested=LAB_ELEMENTS.filter(e=>!labTested(clean[e.id]));if(untested.length)lines.push('## Sin probar','',untested.map(e=>e.name).join(', '),'');
 return lines.join('\n');
}
