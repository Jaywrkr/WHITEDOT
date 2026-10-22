import {newRegionById} from './universe-regions.js';
import {SUPERBIOME_RARITY} from './superbiome-rarity.js';
// Superbiomes (docs/UNIVERSO.md, phase 13): a region of the universe plus a music family. The 52 genres fold into 10
// families that are told apart by ear; every place already has a region and a genre, so its superbiome comes from
// data it already has and the map does not move. A superbiome seen for the first time is kept in S.universe.super.
export const FAMILIES=Object.freeze([
 ['ambient','Ambient','ambient heart berlin'],
 ['downtempo','Downtempo','downtempo boombap lofi gfunk trap'],
 ['dub','Dub','dub dubstep'],
 ['house','House','deep minimal rominimal progressive microhouse techhouse melodic chicago acidhouse garagehouse ghetto tropical organic'],
 ['techno','Techno','acid minimaltechno melodictechno detroit algorave idm'],
 ['breaks','Breaks','breaks garage baltimore jersey brokenbeat'],
 ['dnb','Drum & bass','dnb liquid footwork'],
 ['electro','Electro','electro robotic ebm detroitelectro miamibass'],
 ['tribal','Tribal','afro tribal andean amapiano'],
 ['disco','Disco','nudisco cosmic boogie electrofunk jazztronica soulful']
].map(([id,name,genres])=>Object.freeze({id,name,genres:Object.freeze(genres.split(' '))})));
const BY_GENRE=new Map(FAMILIES.flatMap(f=>f.genres.map(g=>[g,f])));
export const familyOf=genre=>BY_GENRE.get(genre)||null;
// Which combinations are valid: any region of the continents with any family, and the Abyss (the Void and its four
// new regions) only with Ambient, since the sea between continents is always quiet music.
export const LAND_REGIONS=Object.freeze(['llanura','bosque','lago','ruinas','jardin','dunas','cristales','faros','tormenta','cueva']);
export const ABYSS_REGIONS=Object.freeze(['vacio','aurora','cometas','constelaciones','nebulosa']);
export const valid=(region,family)=>LAND_REGIONS.includes(region)?FAMILIES.some(f=>f.id===family):ABYSS_REGIONS.includes(region)&&family==='ambient';
export const SUPERBIOME_COUNT=LAND_REGIONS.length*FAMILIES.length+ABYSS_REGIONS.length;
// How often each superbiome appears (phase 14, scripts/superbiome-census.mjs): comun, raro, muy-raro or ausente. The
// map is never changed to fill the rare ones; they are simply harder to find.
export const RARITY_LABEL=Object.freeze({raro:'raro','muy-raro':'muy raro'});
// The superbiome of a region id and a genre: its id is region:family and its name joins the two ("Polvo · House").
export function superbiome(region,genre,regionName){const f=familyOf(genre);if(!f||!valid(region,f.id))return null;const id=region+':'+f.id;
 return Object.freeze({id,region,family:f.id,name:(regionName||region)+' · '+f.name,rarity:SUPERBIOME_RARITY[id]||'comun'});}
export function initialize(runtime){
 const nameOf=id=>newRegionById(id)?.name||runtime.BIOMES?.find(b=>b.id===id)?.name||id;
 // The superbiome of a place (a region from regionOfPos), its new region in the Abyss when it has one.
 function of(d,x,y){if(!d)return null;const region=d.sea?runtime.newRegionAt?.(x,y)?.id||'vacio':runtime.BIOMES?.[d.z]?.id;return region?superbiome(region,d.genre,nameOf(region)):null;}
 function here(){return of(runtime.regionOfPos?.(runtime.S.wx,runtime.S.wy),runtime.S.wx,runtime.S.wy);}
 // Keep the first day each superbiome is heard; a failed save leaves nothing half written.
 function record(sb){if(!sb)return false;const u=(runtime.S.universe||={});if(!u.super||typeof u.super!=='object'||Array.isArray(u.super))u.super={};if(u.super[sb.id])return false;u.super[sb.id]=runtime.S.todayKey||1;if(runtime.save?.()===false){delete u.super[sb.id];return false;}return true;}
 Object.defineProperties(runtime,{superbiomeOf:{get:()=>of},superbiomeHere:{get:()=>here},recordSuperbiome:{get:()=>record}});
}
