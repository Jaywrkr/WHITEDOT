import assert from 'node:assert/strict';
import {initialize} from '../src/data.js';
import {ECOLOGIES} from '../src/ecology-model.js';
import {ECOREGION_NAMES} from '../src/ecoregions.js';
import {LANDSCAPES} from '../src/house-view.js';
// The World is a universe (docs/UNIVERSO.md): places have cosmic names and clearly separate colours; ids stay, so
// maps, music and saves do not move.
const r={};initialize(r);
assert.deepEqual(r.BIOMES.map(b=>b.id),['llanura','bosque','lago','ruinas','jardin','dunas','cristales','faros','tormenta','cueva','vacio'],'ids unchanged');
assert.deepEqual(r.BIOMES.map(b=>b.name),['Polvo','Cúmulo','Marea','Restos','Esporas','Anillos','Prisma','Púlsares','Tormenta solar','Pozo','Vacío']);
// No word of a landscape on Earth in what names or describes a place.
const EARTH=/(?<!\p{L})(árbol|árboles|bosque|lago|pasto|colina|montaña|agua|lotos?|pilar|pilares|cactus|mar|ruinas?|jardín|dunas?|cueva|gruta|pradera|llanura|desierto|selva|río|estepa|tundra|manglar|laguna|humedal|acantilados?|hongos)(?!\p{L})/iu;
const texts=[...r.BIOMES.flatMap(b=>[b.name,b.desc]),...Object.values(r.ZINFO).flatMap(z=>z[2]),...Object.values(ECOLOGIES).flat().map(e=>e.name),...Object.values(ECOREGION_NAMES).flat(),r.VOZ.mar];
for(const t of texts)assert(!EARTH.test(t),'earthly word in: '+t);
assert.equal(new Set(Object.values(ECOLOGIES).flat().map(e=>e.name)).size,33,'every local ecology has its own name');
// Colours: every pair of places far apart (RGB distance), so no two regions read the same.
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),ids=Object.keys(LANDSCAPES);let closest=Infinity,pair='';
for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){const a=rgb(LANDSCAPES[ids[i]]),b=rgb(LANDSCAPES[ids[j]]),d=Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);if(d<closest){closest=d;pair=ids[i]+'/'+ids[j];}}
assert(closest>=70,`colours too close: ${pair} (${closest.toFixed(0)})`);
console.log(`PASS universe names: cosmic names for the 11 places with ids unchanged, no earthly words in names, tips and local ecologies, colours apart (closest ${pair} at ${closest.toFixed(0)})`);
