import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {MATERIA_KINDS,MATERIA_RARITY,createMateriaSite,normalizeMateriaSites,stringNote,stringAt,stringsCrossed,stringY,STRING_COUNT,prismFan,prismLit,PRISM_RECEPTORS,membraneHit,materiaVoice,materiaKindOf} from '../src/materia-music.js';
import {INSTRUMENTS} from '../src/journal.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const size=r.REG*r.WCH,origin=r.regionOfPos(size/2,size/2);
// El Origen tiene las tres familias; en el resto aparecen con su rareza propia y nunca en el mar.
for(const k of MATERIA_KINDS)assert(createMateriaSite(k,origin,size,r.seedOf,r.rng),`home ${k}`);
const count={strings:0,prism:0,membrane:0};let land=0;
for(let x=-30;x<=30;x++)for(let y=-30;y<=30;y++){if(!x&&!y)continue;const d=r.regionOfPos((x+.5)*size,(y+.5)*size);if(!d.sea)land++;
 for(const k of MATERIA_KINDS){const a=createMateriaSite(k,d,size,r.seedOf,r.rng),b=createMateriaSite(k,d,size,r.seedOf,r.rng);assert.equal(!!a,!!b);if(a){assert(!d.sea);assert.equal(a.x,b.x);count[k]++;assert(Math.floor(a.x/size)===x&&Math.floor(a.y/size)===y,'site stays inside its region');}}}
for(const k of MATERIA_KINDS){const share=count[k]/land;assert(share>MATERIA_RARITY[k]*.6&&share<MATERIA_RARITY[k]*1.4,`${k} rarity ${share}`);}
// Cuerdas: tensar sube la nota y el volumen; rasgueo cruza en orden.
assert(stringNote(2,40).degree>stringNote(2,0).degree&&stringNote(2,40).volume>stringNote(2,0).volume);assert.equal(stringNote(0,0).channel,'bass');assert.equal(stringNote(3,0).channel,'melody');
assert.equal(stringAt(0,stringY(1)),1);assert.equal(stringAt(200,0),-1);assert.deepEqual(stringsCrossed(-60,60),[0,1,2,3]);assert.deepEqual(stringsCrossed(60,-60),[3,2,1,0]);assert.equal(STRING_COUNT,4);
// Prisma: girar cambia qué cristales se encienden; siempre hay ángulos con 1 y con 3 o más.
const counts=new Set();for(let a=0;a<Math.PI*2;a+=.05)counts.add(prismLit(a,.3).length);assert(counts.has(1)&&[...counts].some(n=>n>=3),[...counts]);
assert.equal(prismFan(1).length,7);assert(prismLit(0,.3).every(k=>k>=0&&k<PRISM_RECEPTORS));
// Membrana: centro grave, borde con otro grado; fuera no suena.
assert.equal(membraneHit(0,0).zone,0);assert.equal(membraneHit(40,0).zone,1);assert.equal(membraneHit(80,0),null);
// Voces: cada una tiene explicación en la Bitácora y registros sensatos.
for(const [k,n] of [['strings',4],['prism',5],['membrane',2]])for(let i=0;i<n;i++){const v=materiaVoice(k,i,origin,r.GEN,r.seedOf);assert(v&&INSTRUMENTS[v.instrument],`${k}:${i} ${v?.instrument}`);assert(v.low<v.high);}
assert.deepEqual(materiaKindOf('installation:prism:3'),{kind:'prism',index:3});assert.equal(materiaKindOf('installation:glass:1'),null);
// Guardado: solo campos válidos, ángulo del prisma normalizado, límite de 96.
const many=Object.fromEntries(Array.from({length:120},(_,i)=>[`strings:${i},0`,{seen:true}]));assert.equal(Object.keys(normalizeMateriaSites(many)).length,96);
assert.deepEqual(normalizeMateriaSites({'prism:1,2':{seen:1,angle:7},'bad':{seen:true},'membrane:0,0':{seen:true,angle:3}}),{'prism:1,2':{seen:true,angle:7-Math.PI*2},'membrane:0,0':{seen:true}});
console.log(`PASS: materia families (strings ${count.strings}, prism ${count.prism}, membrane ${count.membrane} in ${land} land regions), gestures, voices and saves`);
