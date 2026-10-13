// Fase 5 · Vida: bandadas (rareza, especies por bioma, conducta, llamadas y respuestas), luciérnagas que
// se sincronizan, flora que crece y decrece, voces con explicación y guardado mínimo.
import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {SPECIES,SPECIES_IDS,FLOCK_RARITY,PLANT_RARITY,createFlock,stepFlock,flockCall,fireflyPattern,answerCall,callDegree,callEvery,createPlants,plantGrowth,plantStage,growPlant,PLANT_ARP,PLANT_DECAY_MS,vidaVoice,vidaKindOf,normalizeVida,HOME_FLOCK} from '../src/vida-music.js';
import {INSTRUMENTS} from '../src/journal.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const size=r.REG*r.WCH,origin=r.regionOfPos(size/2,size/2),biome=d=>r.BIOMES[d.z].id;
// El Origen siempre tiene golondrinas y tres matas; el resto con su rareza, nunca en mar ni vacío.
const home=createFlock(origin,size,biome(origin),r.seedOf,r.rng);assert.equal(home.species,'golondrina');assert.deepEqual([home.x,home.y],HOME_FLOCK);
assert.equal(createPlants(origin,size,biome(origin),r.seedOf,r.rng).length,3);
const count=Object.fromEntries(SPECIES_IDS.map(k=>[k,0]));let land=0,flocks=0,plants=0;
for(let x=-30;x<=30;x++)for(let y=-30;y<=30;y++){if(!x&&!y)continue;const d=r.regionOfPos((x+.5)*size,(y+.5)*size),b=biome(d);if(!d.sea&&b!=='vacio')land++;
 const f=createFlock(d,size,b,r.seedOf,r.rng),g=createFlock(d,size,b,r.seedOf,r.rng);assert.equal(JSON.stringify(f&&[f.species,f.x,f.members.length]),JSON.stringify(g&&[g.species,g.x,g.members.length]),'deterministic');
 if(f){assert(!d.sea&&b!=='vacio');flocks++;count[f.species]++;assert(Math.floor(f.x/size)===x&&Math.floor(f.y/size)===y);const n=f.members.length,c=SPECIES[f.species].count;assert(n>=c[0]&&n<=c[1]);}
 const p=createPlants(d,size,b,r.seedOf,r.rng);if(p.length){plants++;assert(!d.sea);}}
assert(flocks/land>FLOCK_RARITY*.75&&flocks/land<FLOCK_RARITY*1.25,`flock share ${flocks/land}`);assert(plants/land>PLANT_RARITY*.75&&plants/land<PLANT_RARITY*1.25,`plant share ${plants/land}`);
assert(count.lira>0&&count.lira<flocks*.1,`lira rare ${count.lira}/${flocks}`);for(const k of ['golondrina','grulla','luciernaga'])assert(count[k]>flocks*.1,k);
// Conducta: quieto cerca gana confianza y se acercan; correr los dispersa y quita la confianza.
const f=createFlock(origin,size,biome(origin),r.seedOf,r.rng);let ev=[];
for(let i=0;i<400;i++)ev.push(...stepFlock(f,1/60,i/60,{x:f.hx+60,y:f.hy,speed:0,still:3}));
assert(ev.includes('gather')&&f.trust>=.6);const close=f.members.every(m=>Math.hypot(m.x-(f.hx+60),m.y-f.hy)<120);assert(close,'members gather around the player');
f.follow=0;ev=stepFlock(f,1/60,7,{x:f.x,y:f.y,speed:300,still:0});assert(ev.includes('scatter')&&f.trust===0&&f.scatter>.9);
for(let i=0;i<30;i++)stepFlock(f,1/60,7+i/60,{x:f.x,y:f.y,speed:300,still:0});assert(f.members.some(m=>Math.hypot(m.vx,m.vy)>100),'they fly away');
// Llamadas: dentro del compás, grullas en el bajo, golondrinas con canon; la respuesta conserva tu ritmo.
for(let bar=0;bar<16;bar++){const c=flockCall(f,bar);assert(c.length>=3&&c.every(n=>n.step>=0&&n.step<16&&n.member<f.members.length&&n.volume<=.12));}
const learned=[{step:0,degree:2},{step:3,degree:4},{step:6,degree:3}],ans=answerCall(f,learned);assert.deepEqual(ans.map(n=>n.step),[0,3,6]);assert.deepEqual(ans.map(n=>n.degree),[4,6,5]);
assert(callDegree(-60)>callDegree(60));assert.equal(callEvery('invierno'),8);assert.equal(callEvery('primavera'),2);assert.equal(callEvery('otono',.8),2);
// Luciérnagas: sin sincronía no hay groove; sincronizadas caen en él.
const groove=new Set([0,3,6,8,11,14]);assert(fireflyPattern(1,8,5).every(s=>groove.has(s)));assert(fireflyPattern(.1,8,5).some(s=>!groove.has(s)));
// Flora: crece, florece, decrece con las horas sin visitas.
let e=null;const t0=1e12;for(let i=0;i<5;i++)e=growPlant(e,t0,1);assert.equal(plantStage(plantGrowth(e,t0)),4);assert.equal(PLANT_ARP[4].length,5);
assert.equal(plantStage(plantGrowth(e,t0+PLANT_DECAY_MS*2.5)),1);assert.equal(plantGrowth(e,t0+PLANT_DECAY_MS*10),0);assert.equal(plantGrowth(null,t0),0);
// Voces con explicación en la Bitácora y registros sensatos; bajo para grullas.
for(const k of [...SPECIES_IDS,'plant'])for(let i=0;i<3;i++){const v=vidaVoice(k,i,origin,r.GEN,r.seedOf);assert(v&&INSTRUMENTS[v.instrument],`${k} ${v?.instrument}`);assert(v.low<v.high);}
assert.equal(vidaVoice('grulla',0,origin,r.GEN,r.seedOf).role,'bajo');assert.deepEqual(vidaKindOf('vida:lira:3'),{kind:'lira',index:3});assert.equal(vidaKindOf('vida:dragon:1'),null);
// Guardado: solo especies vistas y crecimiento; nada de confianza, llamadas ni posiciones.
const saved=normalizeVida({seen:{golondrina:1,dragon:1,plant:1},plants:{'plant:0,0:1':{g:9,t:5,trust:1},'malo':{g:1,t:1},'plant:2,3:0':{g:'x',t:1}},trust:{}});
assert.deepEqual(saved,{seen:{golondrina:true,plant:true},plants:{'plant:0,0:1':{g:4,t:5}}});
console.log(`PASS: ${flocks} flocks in ${land} land regions (${Object.entries(count).map(([k,v])=>k+' '+v).join(', ')}), ${plants} gardens; trust gathers, running scatters, calls answered in rhythm, fireflies sync into groove, flora grows and withers`);
