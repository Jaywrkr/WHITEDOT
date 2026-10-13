// Reproducible sample, not an estimate of the infinite coordinate space.
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {gravityOf} from '../src/gravity.js';import {createMirrorSite} from '../src/mirrors.js';import {createGlassSite} from '../src/glass.js';
const extent=Number(process.argv[2]||50);if(!Number.isInteger(extent)||extent<1||extent>150)throw Error('Use an integer extent from 1 to 150');
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const basic=new Set(),recipes=new Set(),music=new Set(),detailed=new Set(),biomes=new Set(),genres=new Set();let glass=0,mirrors=0,land=0;
for(let x=-extent;x<extent;x++)for(let y=-extent;y<extent;y++){
 const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600),p=d.recipe,g=gravityOf(d,r.seedOf).name;
 const hasGlass=!!createGlassSite(d,3600,r.seedOf,r.rng),hasMirror=!!createMirrorSite(d,3600,r.seedOf,r.rng);glass+=+hasGlass;mirrors+=+hasMirror;if(!d.sea)land++;
 biomes.add(r.BIOMES[d.z].id);genres.add(d.genre);basic.add(JSON.stringify([d.z,d.genre,g]));
 recipes.add(JSON.stringify([d.z,d.genre,g,p.archetype,p.material,p.layout,hasGlass,hasMirror]));
 music.add(JSON.stringify([d.z,d.genre,d.bpm,d.scale,d.track.bassI,d.track.hookI]));
 detailed.add(JSON.stringify([d.z,d.genre,g,d.bpm,d.scale,d.track.bassI,d.track.hookI,d.track.bass,d.track.hook,d.pat,d.hab,d.ground,d.air,p.archetype,p.material,p.layout,hasGlass,hasMirror]));
}
console.log(JSON.stringify({sample:extent*extent*4,extent,biomes:biomes.size,genres:genres.size,basic:basic.size,recipeClasses:recipes.size,musicClasses:music.size,detailed:detailed.size,land,glass,mirrors,notes:'No incluye nombres, coordenadas, IDs ni flotantes continuos como prueba de variedad. No mide diferencia perceptual, ni es el total del mapa.'},null,2));
