// The new regions of the universe (docs/UNIVERSO.md, phase 5): Aurora, Cometas, Constelaciones and Nebulosa oscura.
// They live in the Abyss of silence, the open space between continents, which was all alike. The map does not change:
// continents, regions and the music of every place stay as they were; part of the Abyss now shows one of these
// phenomena and the rest stays pure Void. They come from a hash of the region, never the old random sequence.
export const NEW_REGIONS=Object.freeze([
 Object.freeze({id:'aurora',name:'Aurora',color:'#7dffc8',accent:'#ff7ad9'}),
 Object.freeze({id:'cometas',name:'Cometas',color:'#a8d8ff'}),
 Object.freeze({id:'constelaciones',name:'Constelaciones',color:'#ffffff',accent:'#f0d27a'}),
 Object.freeze({id:'nebulosa',name:'Nebulosa oscura',color:'#ff5a5a'})
]);
// Share of the Abyss that holds one of the new regions; the rest is the Void.
export const NEW_REGION_SHARE=.4;
export function hashKey(text){let h=2166136261;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return (h>>>0)/4294967296;}
// The new region of an Abyss region, by its key, or null for the Void.
export function newRegionOf(key,sea){if(!sea||key==null)return null;if(hashKey('new-region:v1:'+key)>=NEW_REGION_SHARE)return null;return NEW_REGIONS[Math.floor(hashKey('new-region:kind:v1:'+key)*NEW_REGIONS.length)];}
export const newRegionById=id=>NEW_REGIONS.find(r=>r.id===id)||null;
export function initialize(runtime){
 // Not in the Journey: its Void chapter keeps the cube alone.
 const enabled=()=>!runtime.journeyQuiet?.();
 function at(x,y){if(!enabled())return null;const d=runtime.regionOfPos?.(x,y);return d?newRegionOf(d.key,!!d.sea):null;}
 Object.defineProperties(runtime,{newRegionAt:{get:()=>at},newRegionHere:{get:()=>()=>at(runtime.S.wx,runtime.S.wy)}});
}
