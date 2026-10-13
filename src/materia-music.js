// Música y geometría puras de las tres familias de materia: cuerdas tensables, prisma y membrana.
// Sin estado de runtime: se prueban en Node y se reutilizan en el dibujo y en las voces.
import {voiceRegister} from './musical-character.js';
const TAU=Math.PI*2;
export const MATERIA_KINDS=['strings','prism','membrane'];
export const MATERIA_NAMES={strings:'Cuerdas tensables',prism:'Prisma de luz',membrane:'Membrana resonante'};

// ---------- cuerdas ----------
export const STRING_COUNT=4,STRING_HALF=82,STRING_GAP=22,STRING_MAX_BEND=42;
export const stringY=i=>(i-(STRING_COUNT-1)/2)*STRING_GAP;
// Cada cuerda tiene su grado; tensar más sube la nota (hasta dos grados). Las dos graves llevan el bajo.
export function stringNote(i,bend){const base=[0,4,2,5][i]??0,amount=Math.min(1,Math.abs(bend)/STRING_MAX_BEND);return {degree:base+Math.round(amount*2),volume:.1+.22*amount,amount,channel:i<2?'bass':'melody'};}
// Índice de la cuerda bajo un punto local (o -1).
export function stringAt(lx,ly,tolerance=11){if(Math.abs(lx)>STRING_HALF+4)return -1;let best=-1,d=tolerance;for(let i=0;i<STRING_COUNT;i++){const e=Math.abs(ly-stringY(i));if(e<d){d=e;best=i;}}return best;}
// Cuerdas cruzadas al arrastrar de y0 a y1 (rasgueo).
export function stringsCrossed(y0,y1){const lo=Math.min(y0,y1),hi=Math.max(y0,y1),out=[];for(let i=0;i<STRING_COUNT;i++){const y=stringY(i);if(y>lo&&y<=hi)out.push(i);}return y1<y0?out.reverse():out;}

// ---------- prisma ----------
export const PRISM_RECEPTORS=5,PRISM_RADIUS=128,PRISM_RAYS=7;
export const receptorAngle=(k,offset)=>offset+k*TAU/PRISM_RECEPTORS;
// El haz entra por el oeste. El prisma desvía el abanico de colores según su giro y lo abre o cierra.
export function prismFan(angle){const a=((angle%TAU)+TAU)%TAU,center=Math.PI+a*2,spread=.3+2.5*Math.pow(Math.abs(Math.sin(a*1.5)),1.4);   // de un rayo fino a un abanico que abarca tres cristales
 return Array.from({length:PRISM_RAYS},(_,i)=>({angle:center-spread/2+spread*i/(PRISM_RAYS-1),hue:(i*360/PRISM_RAYS+200)%360}));}
const angDiff=(a,b)=>{let d=((a-b)%TAU+TAU)%TAU;return d>Math.PI?TAU-d:d;};
// Receptores encendidos: los que reciben algún rayo. Cada uno es un grado del acorde.
export function prismLit(angle,offset){const rays=prismFan(angle),lit=[];for(let k=0;k<PRISM_RECEPTORS;k++){if(rays.some(r=>angDiff(r.angle,receptorAngle(k,offset))<.22))lit.push(k);}return lit;}
export const PRISM_DEGREES=[0,2,4,6,9];

// ---------- membrana ----------
export const MEMBRANE_RADIUS=46;
// Centro grave y redondo; borde agudo y seco. El ángulo elige el grado; apretar hacia afuera sube.
export function membraneHit(lx,ly){const r=Math.hypot(lx,ly)/MEMBRANE_RADIUS;if(r>1.08)return null;const zone=r<.42?0:1,sector=Math.floor((((Math.atan2(ly,lx)%TAU)+TAU)%TAU)/TAU*4);
 return {zone,degree:[0,2,4,1][sector]+(zone?3:0),volume:zone?.16:.22,r:Math.min(1,r)};}

// ---------- voces ----------
const pick=(pool,n)=>pool[((n%pool.length)+pool.length)%pool.length];
export function materiaVoice(kind,index,region,genres,seedOf){
 const g=genres[region.genre]||genres.ambient,seed=tag=>seedOf(`materia-voice:${kind}:${region.key}:${tag}`);
 if(kind==='strings'){
  if(index<2)return {role:'bajo',instrument:pick(g.bassP||[g.bassI],seed('bass')),degree:0,response:4,low:36,high:52};
  return voiceRegister({role:'lead',instrument:pick(['bowed','reed','keys','kalimba'],seed('lead')),degree:0,response:4,low:52,high:72},region.genre);
 }
 if(kind==='prism')return voiceRegister({role:'lead',instrument:pick(['glass','kalimba','steel','metalkeys'],seed('prism')),degree:0,response:4,low:55,high:76},region.genre);
 if(kind==='membrane')return index===0?{role:'lead',instrument:'membrane',degree:0,response:4,low:38,high:55}:voiceRegister({role:'lead',instrument:pick(['membrane','hollow'],seed('edge')),degree:0,response:4,low:52,high:69},region.genre);
 return null;
}
export const materiaKindOf=kind=>{const m=/^installation:(strings|prism|membrane):(\d)$/.exec(kind);return m?{kind:m[1],index:Number(m[2])}:null;};

// ---------- sitios ----------
export const MATERIA_RARITY={strings:.2,prism:.14,membrane:.2};
export const HOME_MATERIA={strings:[1100,2550],prism:[1800,2700],membrane:[2500,2550]};
export function createMateriaSite(kind,region,regionSize,seedOf,rng){
 if(!MATERIA_KINDS.includes(kind)||region.sea||!/^-?\d+,-?\d+$/.test(region.key))return null;
 // Presencia con flujo propio: no toca la receta ni el catálogo, así ningún lugar existente cambia.
 const home=region.key==='0,0',biome=region.recipe?.biome;if(!home&&(biome==='vacio'||rng(seedOf(`materia:presence:v1:${kind}:${region.key}`))()>=MATERIA_RARITY[kind]))return null;
 const [rx,ry]=region.key.split(',').map(Number),r=rng(seedOf(`materia:v1:${kind}:${region.key}`));
 const [hx,hy]=HOME_MATERIA[kind];
 return {id:`${kind}:${region.key}`,kind,x:home?hx:(rx+.2+r()*.6)*regionSize,y:home?hy:(ry+.2+r()*.6)*regionSize,hue:(region.hue+[0,140,260][MATERIA_KINDS.indexOf(kind)])%360,
  angle:r()*TAU,offset:r()*TAU,bends:[0,0,0,0],lit:0,ripples:[],region};
}
export function normalizeMateriaSites(saved){
 const out={};for(const [id,entry] of Object.entries(saved||{})){
  if(Object.keys(out).length>=96)break;
  if(!/^(strings|prism|membrane):-?\d+,-?\d+$/.test(id)||!entry||typeof entry!=='object')continue;
  const clean={seen:!!entry.seen};if(id.startsWith('prism:')&&Number.isFinite(entry.angle))clean.angle=((entry.angle%TAU)+TAU)%TAU;
  out[id]=clean;
 }return out;
}
