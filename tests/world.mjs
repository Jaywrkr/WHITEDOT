import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {createContinents} from '../src/continents.js';import {landmarkIn,LANDMARK_TYPES} from '../src/landmarks.js';import {familyOf} from '../src/rhythms.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const C=r.continents,C2=createContinents(r.seedOf,r.rng,r.GEN),N=30,sizes=new Map();let sea=0,land=0,match=0;
for(let x=-N;x<=N;x++)for(let y=-N;y<=N;y++){const a=C.at(x,y),b=C2.at(x,y);
 assert.equal(a.sea,b.sea);assert.equal(a.continent?.id,b.continent?.id,'continents are deterministic');
 if(a.sea){sea++;continue;}land++;sizes.set(a.continent.id,(sizes.get(a.continent.id)||0)+1);
 const d=r.regionOfPos(x*3600+1800,y*3600+1800);assert(!d.sea);if(familyOf(d.genre)===d.continent.family)match++;}
assert(!C.at(0,0).sea&&C.at(0,0).continent.name==='Tierra de Origen');for(let x=-2;x<=2;x++)for(let y=-2;y<=2;y++)assert(!C.at(x,y).sea,'origin is surrounded by land');
const seaShare=sea/(sea+land),sz=[...sizes.values()].sort((a,b)=>a-b),median=sz[Math.floor(sz.length/2)];
assert(seaShare>.2&&seaShare<.42,`seas ${seaShare}`);assert(sz.at(-1)>=5*median,'a few continents are much larger');assert(sz[0]<=6,'there are small islands');
assert(match/land>.45,`continents keep a musical family (${match/land})`);
for(let x=-6;x<=6;x++)for(let y=-6;y<=6;y++){const d=r.regionOfPos(x*3600+1800,y*3600+1800);if(d.sea)assert.equal(r.BIOMES[d.z].id,'vacio','seas are silent');}
// Vitalidad: contraste real (desiertos y oasis en tierra) y Origen nunca vacío.
let lo=0,hi=0;const RP=3600;for(let x=-80;x<80;x++)for(let y=-80;y<80;y++){const v=C.vitality(x*900+450,y*900+450,RP);assert(v>=0&&v<=1);if(C.at(Math.floor(x/4),Math.floor(y/4)).sea)continue;if(v<.05)lo++;if(v>.9)hi++;}
assert(lo>200&&hi>200,`density contrast ${lo}/${hi}`);assert(C.vitality(1800,1800,RP)>=.55);
// Hitos: deterministas, escasos, todos los tipos existen, y uno se oye desde el Origen.
const isSea=(x,y)=>C.at(x,y).sea,types=new Set();let lm=0;
assert.equal(landmarkIn(2,0,RP,isSea,r.seedOf,r.rng).type,'torre');assert.equal(landmarkIn(0,0,RP,isSea,r.seedOf,r.rng),null);
for(let x=-N;x<=N;x++)for(let y=-N;y<=N;y++){const a=landmarkIn(x,y,RP,isSea,r.seedOf,r.rng),b=landmarkIn(x,y,RP,isSea,r.seedOf,r.rng);assert.deepEqual(a,b);if(a){lm++;types.add(a.type);assert.equal(a.type==='faro',isSea(x,y));assert(a.steps[0]===0&&a.steps.length===a.motif.length);}}
assert.deepEqual([...types].sort(),Object.keys(LANDMARK_TYPES).sort());const per=lm/((2*N+1)**2);assert(per>.06&&per<.16,`landmark density ${per}`);
console.log(`PASS: ${sizes.size} continents (largest ${sz.at(-1)}, smallest ${sz[0]} regions), ${(seaShare*100).toFixed(0)} % seas, ${(match/land*100).toFixed(0)} % family identity, density contrast, ${lm} landmarks of ${types.size} types`);
