import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {anomalyAt,riverAt,ANOMALIES,TIERS} from '../src/wonders.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const RP=3600,sea=(x,y)=>r.continents.at(x,y).sea,isSeaPx=(x,y)=>sea(Math.floor(x/RP),Math.floor(y/RP)),region=(x,y)=>r.regionOfPos((x+.5)*RP,(y+.5)*RP);
// Rarezas: deterministas, lejos del Origen, solo en tierra, con frecuencia real por nivel.
const found={},tiers={raro:0,legendario:0,mitico:0};let land=0;
for(let x=-100;x<=100;x++)for(let y=-100;y<=100;y++){if(!sea(x,y))land++;const a=anomalyAt(x,y,sea,r.seedOf,r.rng);if(!a)continue;
 assert.deepEqual(a,anomalyAt(x,y,sea,r.seedOf,r.rng));assert(Math.max(Math.abs(x),Math.abs(y))>=4&&!sea(x,y));tiers[a.tier]++;found[a.type]??=[x,y];}
assert.deepEqual(Object.keys(found).sort(),Object.keys(ANOMALIES).sort(),'every rarity exists');
assert(tiers.raro>tiers.legendario*3&&tiers.legendario>tiers.mitico,`tiers ${JSON.stringify(tiers)}`);
assert(tiers.raro/land<TIERS.raro.p*2&&tiers.raro/land>TIERS.raro.p/2,'rare is rare');
// Sus reglas se notan en el ADN.
const origin=region(0,0),esp=region(...found.espejo),fr=region(...found.frenesi),luna=region(...found.luna);
assert.equal(esp.anomaly.type,'espejo');assert.equal(esp.genre,origin.genre);assert.deepEqual(esp.scale,origin.scale);
assert(fr.bpm>=Math.min(178,Math.round(r.GEN[fr.genre].bpm[0]*1.5)));assert(/^hsl\(4\d,/.test(luna.pal.main));
for(const k of ['reverso','canon','frenesi','detenido','espejo','luna'])assert(r.SAMPLES[k],`sample ${k}`);
// Ríos: escasos, continuos río abajo, con la energía subiendo, y nunca en el mar.
let on=0,tot=0;const rnd=r.rng(5);for(let i=0;i<30000;i++){const x=(rnd()-.5)*80*RP,y=(rnd()-.5)*80*RP;const q=riverAt(x,y,RP,isSeaPx);if(isSeaPx(x,y)){assert(!q);continue;}tot++;if(q?.on)on++;}
assert(on/tot>.002&&on/tot<.04,`river share ${on/tot}`);
let p=null;for(let i=0;i<30000&&!p;i++){const x=(rnd()-.5)*20*RP,y=(rnd()-.5)*20*RP,q=riverAt(x,y,RP,isSeaPx);if(q?.on&&q.edge<.2)p=[x,y];}
let [x,y]=p,steps=0;const d0=riverAt(x,y,RP,isSeaPx).down;for(;steps<200;steps++){const q=riverAt(x,y,RP,isSeaPx);if(!q?.on)break;x+=q.fx*30;y+=q.fy*30;}
assert(steps>=40,`river continuity ${steps}`);const dEnd=riverAt(x,y,RP,isSeaPx);assert(!dEnd||dEnd.down>=d0-.02,'energy does not fall downstream');
console.log(`PASS: ${tiers.raro} raro / ${tiers.legendario} legendario / ${tiers.mitico} mítico rarities with visible rules and unique samples; rivers ${(on/tot*100).toFixed(1)} % of land, followable ${steps*30} px downstream`);
