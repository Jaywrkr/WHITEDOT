import {MICRO_INSTRUMENTS} from './micro-instruments-model.js';
import {ECOLOGY_CONTENT} from './ecology-model.js';
import {HYBRID_STYLES} from './musical-hybrids.js';
import {LAB_BANDS} from './lab-score.js';
import {TECHNIQUE_INSTRUMENTS} from './instrument-techniques.js';
import {ADVANCED_INSTRUMENTS} from './modular-synth.js';
import {LIVING_CATALOG} from './living-catalog.js';
import {MUSIC_IDENTITIES} from './musical-recipes.js';
import {WORLD_FAMILIES} from './world-families.js';
import {SYNTH_PROGRAMS} from './synth-colors.js';
import {RHYTHM_ELEMENTS} from './percussion-model.js';
import {CULTURES} from './culture-model.js';
import {POWERS,EXPERIMENTAL_NAMES} from './expansion-music.js';
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
 {id:'responds',label:'Responde bien al cubo'},
 {id:'sound',label:'Suena bien con la música'},
 {id:'look',label:'Se ve bien'},
 {id:'fun',label:'Dan ganas de repetir'}
];
export const LAB_VERDICTS={ok:'Bien',fix:'Mejorar',cut:'Quitar'};

const home=(x,y)=>({type:'home',x,y});
const BASE=[
 {id:'materia:strings',group:'Materia',name:'Cuerdas tensables',find:home(...HOME_MATERIA.strings),try:['Cruza despacio con el cubo para enganchar una cuerda; empuja para tensarla.','Sal por un lado para soltarla, o cruza rápido para rasguear.']},
 {id:'materia:prism',group:'Materia',name:'Prisma de luz',find:home(...HOME_MATERIA.prism),try:['Rodea el prisma con el cubo para girar el abanico.','Busca el ángulo que enciende más cristales (hasta 5).','Sal del anillo: responde el acorde de los cristales encendidos.']},
 {id:'materia:membrane',group:'Materia',name:'Membrana resonante',find:home(...HOME_MATERIA.membrane),try:['Entra con el cubo: la velocidad cambia el golpe.','Permanece encima para redoblar; sal para detenerlo.']},
 {id:'glass',group:'Instalaciones',name:'Vidrios',find:home(1080,900),try:['Pasa el cubo por el asa de un aro; rodea el centro para girarlo.','Mira el color que toma y escucha el canal que cambia.']},
 {id:'mirrors',group:'Instalaciones',name:'Espejos',find:home(1600,900),try:['Empuja un espejo con el cubo: gira como una puerta.','Lleva la luz al rombo: suena un acorde, el lugar se tiñe y queda una capa sonando.']},
];
const life=[
 ...Object.entries(SPECIES).map(([kind,s])=>({id:'life:'+kind,group:'Vida',name:s.name,find:{type:'flock',species:kind},
  try:kind==='luciernaga'?['Quédate quieto cerca: se van sincronizando (mira el %).','Al sincronizarse, sus destellos caen en un groove.','Pasa el cubo por una: te contesta.','Sin mascota todavía, comparte 20 s adicionales con la bandada sincronizada: una se queda.']
   :['Pasa el cubo por un ave; en dos compases la bandada responde.','Quédate quieto unos segundos: confían y se acercan.','Entra corriendo: se dispersan.',...(kind==='golondrina'||kind==='grulla'?['Si aún no tienes mascota, viaja en formación 30 s: una puede quedarse.']:[])]})),
 {id:'life:plant',group:'Vida',name:'Flora que crece',find:{type:'home',x:HOME_PLANTS[0][0],y:HOME_PLANTS[0][1]},try:['Quédate cerca y quieto: crece y suma notas a su arpegio.','Pasa el cubo por ella para regarla.','Si no vuelves, se seca con las horas.']}
];
const families=Object.entries(FAMILIES).map(([id,f])=>({id:'family:'+id,group:'Encuentros',name:f.name,find:{type:'family',family:id},try:['Entra con el cubo para responder; muévete dentro para modelar.','Sal para soltar. La edición fina de partes/hilos permanece solo en modo dedo (?dedo=1).']}));
const toys=Object.entries(TOY_NAMES).map(([kind,name])=>({id:'toy:'+kind,group:'Juguetes',name,find:{type:'toy',kind},
 try:kind==='rotor'?['Pasa con el cubo para hacerlo girar.','Quédate cerca para cultivar.']:kind==='resonator'?['Entra con el cubo para responder.','Quédate cerca para cultivar.']:['Pasa a través o tócalo.','Escucha cómo responde.']}));
const phenomena=Object.entries(PHENOMENON_NAMES).map(([kind,name])=>({id:'phenomenon:'+kind,group:'Fenómenos',name,find:{type:'phenomenon',kind},try:['Acércate y escucha.','Toca cerca y espera su respuesta.']}));
const tools=[
 {id:'tool:fx',group:'Herramientas',name:'Mesa de efectos',find:{type:'tool',tool:'fx'},try:['Arrastra en el pad: horizontal filtro, vertical espacio.','Prueba Eco, Robot, Chorus, Phaser, Freeze y Stop.','Activa Fijar y suelta el dedo.']},
 {id:'tool:sonar',group:'Herramientas',name:'Pulso / sonar',find:{type:'tool',tool:'sonar'},try:['Toca un espacio vacío: lanza un pulso.','Mira qué objetos responden y cómo suena.']},
 {id:'tool:place-code',group:'Herramientas',name:'Código de lugar',find:{type:'tool',tool:'favorites'},try:['Copia el código de aquí.','Muévete, pégalo y ábrelo: debe orientarte.']},
 {id:'tool:record',group:'Herramientas',name:'Grabar set',find:{type:'tool',tool:'record'},try:['Graba 10–20 s tocando algo.','Revisa video, audio y que se pueda compartir.']}
];
const exploration=[...Object.entries(CULTURES).map(([id,c])=>({id:'culture:'+id,group:'Guardianes',name:c.name,find:{type:'culture',culture:id},try:['Quédate junto al guardián para escuchar su llamada completa.','Sigue las dos huellas; recorre las cuatro piedras con el cubo en el orden que escuchaste.','Alcanza el instrumento y vuelve: hay tres recuerdos por estudio.']})),
 ...Object.entries(POWERS).map(([id,p])=>({id:'power:'+id,group:'Poderes',name:p.name,find:{type:'box',power:id},try:['Acércate con el cubo a la caja para abrirla.',p.text,'Cambiar elemento en el laboratorio limpia los poderes anteriores.']})),
 ...[20,90,200,300].map(seconds=>({id:'quiet:'+seconds,group:'Quietud',name:'Quietud · '+seconds+' s',find:{type:'quiet',seconds},try:['La prueba empieza en esta etapa sin esperar todo el tiempo.','Permanece, muévete y abre un menú: revisa pausa y retorno.']})),
 ...Object.entries(EXPERIMENTAL_NAMES).map(([mode,name])=>({id:'experimental:'+mode,group:'Experimental',name,find:{type:'experimental',mode},try:['Escucha el modo sin llenar el paisaje de objetos.','Compara normal y suave; anota si fatiga o tapa otras voces.']}))];
export const LAB_ELEMENTS=[...BASE,...life,...families,...toys,...phenomena,...tools,...exploration,...Object.entries(RHYTHM_ELEMENTS).map(([kind,e])=>({id:'rhythm:'+kind,group:'Percusión',name:e.name,find:{type:'rhythm',kind},try:[e.hint,'Prueba Solo para escuchar el golpe; vuelve a la mezcla para oírlo con el género.']})),...LIVING_CATALOG.filter(d=>['flora','fauna','architecture'].includes(d.group)).map(d=>({id:'living:'+d.id,group:d.group==='flora'?'Flora viva':d.group==='fauna'?'Fauna viva':'Arquitectura viva',name:d.name,find:{type:'living',kind:d.id},try:['Acércate con el cubo: '+d.gesture+'.','Escucha el material y su respuesta en Solo y en la mezcla.']})),
 ...MUSIC_IDENTITIES.map(r=>({id:'music:'+r.id,group:'Música',name:r.name,find:{type:'music',identity:r.id},
  try:['Escucha dos minutos; deja que la frase respire.','Compara bajo, groove, instrumentos y silencios.','Camina para tocar; vuelve aquí para comparar.']})),
 ...[['analogpad','Pad analógico'],['phasekeys','Teclas de fase'],['fmglass','Cristal FM'],['choir','Coro sintético'],['resonantpluck','Cuerda resonante'],['velvetbass','Bajo de terciopelo'],['granularair','Aire granular'],['orbitorgan','Órgano orbital']].map(([instrument,name])=>({id:'synth:'+instrument,group:'Síntesis',name,find:{type:'synth',instrument},try:['Toca la rama con el cubo; escucha su timbre.','Prueba Solo para comparar sin la música del lugar.']})),
 ...Object.entries(ADVANCED_INSTRUMENTS).map(([instrument,spec])=>({id:'synth:'+instrument,group:'Síntesis',name:spec.name,find:{type:'synth',instrument},try:['Toca la rama; escucha ataque, cuerpo y caída.','Compara Solo y mezcla; prueba notas graves y medias.']})),
 ...SYNTH_PROGRAMS.map(p=>({id:'filter:'+p.id,group:'Filtros',name:p.name+(p.slope?' · '+p.slope+' dB':p.type==='bandpass'?' · Banda':' · Muesca'),find:{type:'filter',program:p.id},try:['Toca la rama; escucha cómo abre o cierra.','Mira los aros del filtro junto al elemento.','Compara Solo y mezcla.']})),
 ...WORLD_FAMILIES.map(f=>({id:'landscape:'+f.id,group:'Paisajes',name:f.name,find:{type:'landscape',family:f.id},
  try:['Camina; compara formas, espacios, habitantes y música.','Toca una criatura; escucha su material y filtro.','Este lugar existe fuera del laboratorio.']})),
 ...HYBRID_STYLES.map(h=>({id:'hybrid:'+h.id,group:'Cruces',name:h.name,find:{type:'hybrid',hybrid:h.id},try:['Escucha frases y armonía; compáralas con otro cruce.','Camina para tocar; la influencia pertenece a este lugar.']}))];
LAB_ELEMENTS.push(...LAB_BANDS.map(b=>({id:'band:'+b.id,group:'Paisaje vivo',name:b.name,find:{type:'band',band:b.id},try:['Escucha el ritmo, bajo y frase del territorio.','Toca sus elementos; compara con otra banda.']})));
LAB_ELEMENTS.push(...Object.entries(TECHNIQUE_INSTRUMENTS).map(([id,s])=>({id:'synth:'+id,group:'Síntesis',name:s.name,find:{type:'synth',instrument:id},try:['Toca la rama. Escucha su ataque y cuerpo.','Compara notas graves y medias con Solo.']})));
LAB_ELEMENTS.push(...[['membrane','Organismos de membrana'],['filament','Seres filamentosos'],['facets','Seres de cristal'],['anatomy','Organismos de raíces']].map(([style,name])=>({id:'native:'+style,group:'Especies originales',name,find:{type:'native',style},try:['Acércate; compara silueta, movimiento y reacción.']})));
LAB_ELEMENTS.push({id:'native:pixel',group:'Especies originales',name:'Colonia pixelada',find:{type:'native',style:'pixel'},try:['Acércate y toca las figuras pequeñas.','Sus píxeles y voces conservan el origen.']},...Object.entries(MICRO_INSTRUMENTS).map(([kind,m])=>({id:'micro:'+kind,group:'Instrumentos vivos',name:m.name,find:{type:'micro',kind},try:[m.hint,'Compara cerca, lejos y en silencio.']})),...ECOLOGY_CONTENT.map(e=>({id:e.id,group:'Paisajes vivos',name:e.name,find:{type:'ecology',kind:e.id.split(':')[1]},try:['Toca, permanece y observa su respuesta.']})));
LAB_ELEMENTS.push({id:'inhabitants:colony',group:'Habitantes',name:'Vecinos pixelados',find:{type:'inhabitants',kind:'colony'},try:['Toca una figura; observa cómo responde.','Quédate y compara conductas entre sus vecinos.']},{id:'inhabitants:traveller',group:'Habitantes',name:'Viajeros del vacío',find:{type:'inhabitants',kind:'traveller'},try:['Espera; cruzan el universo por su cuenta.','Toca un viajero para escuchar su voz.']});
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
 const lines=[`# Laboratorio Kubono${date?' · '+date:''}`,'',`Probados: ${tested.length} de ${LAB_ELEMENTS.length} · Bien ${count('ok')} · Mejorar ${count('fix')} · Quitar ${count('cut')}${build?' · '+build:''}`,''];
 for(const group of LAB_GROUPS){
  const items=tested.filter(e=>e.group===group);if(!items.length)continue;lines.push(`## ${group}`,'');
  for(const e of items){const n=clean[e.id];lines.push(`### ${e.name}${n.verdict?' — '+LAB_VERDICTS[n.verdict]:''}`);
   const bad=LAB_CHECKS.filter(c=>n.checks[c.id]===false).map(c=>c.label),good=LAB_CHECKS.filter(c=>n.checks[c.id]===true).map(c=>c.label);
   if(bad.length)lines.push(`- Falla: ${bad.join(', ')}`);if(good.length)lines.push(`- Funciona: ${good.join(', ')}`);if(n.text.trim())lines.push(`- Nota: ${n.text.trim().replace(/\n+/g,' / ')}`);lines.push('');}
 }
 const untested=LAB_ELEMENTS.filter(e=>!labTested(clean[e.id]));if(untested.length)lines.push('## Sin probar','',untested.map(e=>e.name).join(', '),'');
 return lines.join('\n');
}
