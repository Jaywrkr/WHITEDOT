import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {strangeness,STRANGE_START} from '../src/continents.js';import {mapData} from '../src/map.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const RP=3600,at=(rx,ry)=>r.regionOfPos((rx+.5)*RP,(ry+.5)*RP);
// Cerca de casa todo es normal; lejos, más raro.
assert.equal(strangeness(0,0),0);assert.equal(strangeness(STRANGE_START-2,0),0);assert(strangeness(80,0)>.99);assert(strangeness(30,0)>0&&strangeness(30,0)<strangeness(45,0));
for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++)assert.equal(at(x,y).tuneCents,0,'home is in tune');
let bent=0,far=0;for(let i=0;i<40;i++){const d=at(70+i,-70);far++;if(Math.abs(d.tuneCents)>5)bent++;assert(Math.abs(d.tuneCents)<=55);assert(d.strange>.99);}
assert(bent>far*.6,'far lands are out of tune');
const near=at(1,1),farR=at(75,75);assert(Math.max(...farR.species.map(s=>s.cell))>Math.max(...near.species.map(s=>s.cell))*1.5,'far creatures are bigger');
assert(/hsl\(\d+,(9\d|8\d)%/.test(farR.pal.main),'far colours are saturated');
// Determinismo: otra instancia da los mismos valores.
const r2={};data(r2);progress(r2);world(r2);const b=r2.regionOfPos(75.5*RP,75.5*RP);assert.equal(b.tuneCents,farR.tuneCents);assert.equal(b.pal.main,farR.pal.main);
// El mapa solo muestra lo visitado, y los hitos oídos aparecen como "?".
r.S.places={'0,0':1,'1,0':1,'2,0':1,'-3,4':1};r.S.wx=1800;r.S.wy=1800;r.S.landmarks={};r.S.heardLm={'lm:2,0':[2,0,'torre'],'lm:9,9':[9,9,'arbol']};r.S.maxRing=3;
r.landmarkAt=()=>null;const m=mapData(r);
assert.equal(m.cells.length,4);assert.equal(m.heard.length,2);assert.equal(m.record,3);assert(m.continents>=1);
r.S.landmarks={'lm:2,0':'2026-10-12'};r.landmarkAt=(rx,ry)=>({id:`lm:${rx},${ry}`,type:'torre',x:9000,y:1800});const m2=mapData(r);
assert.equal(m2.heard.length,1,'reached landmarks stop being question marks');assert.equal(m2.reached.length,1);
console.log(`PASS: home in tune, far lands bent (${bent}/${far}), bigger creatures and impossible colours, deterministic; map shows only visited places and heard landmarks`);
