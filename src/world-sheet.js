import {prefersReducedMotion} from './frame-state.js';
import {LANDSCAPES} from './house-view.js';
// The Journey, phase 3: the World's light. The World is always seen from above and has no horizon (only the Refugio
// is seen from the side), so each biome gets a light around the cube that breathes with the beat. In the Journey the
// colour is earned: a biome stays pale until you complete the cube's theme on time there, then its colour comes back.
// Hashes stay available for detail placed on the map; nothing uses the game's random sequence.
export function hash(text){let h=2166136261;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export const rand=(key)=>hash(key)/4294967296;
const rgba=(hex,a)=>{const n=parseInt(hex.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;};
// The colours recovered in the Journey: kept as biome ids.
export function normalizeColors(raw){const out={};if(raw&&typeof raw==='object'&&!Array.isArray(raw))for(const [k,v]of Object.entries(raw))if(v&&typeof k==='string'&&k.length<40)out[k]=true;return out;}
export function initialize(runtime){
 let owner=null,filter='',last=null;const reencuentro={at:-1e9,id:null};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 // The recovered colours live in S.journey.colors (seeded at load from explored biomes, see journey-mode.js).
 function colors(){const j=runtime.S.journey;if(!j||typeof j!=='object')return {};if(owner!==runtime.S||!j.colors){owner=runtime.S;j.colors=normalizeColors(j.colors);}return j.colors;}
 const biomeId=()=>runtime.BIOMES?.[Math.max(0,runtime.curZone)]?.id||'llanura';
 const pale=()=>runtime.journeyQuiet?.()&&runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie'&&!colors()[biomeId()];
 // Completing the theme on time gives the colour of the place back.
 function recover(){if(!runtime.journeyQuiet?.()||!runtime.inWorld?.())return false;const id=biomeId(),c=colors();if(c[id])return false;c[id]=true;if(runtime.save()===false){delete c[id];return false;}reencuentro.at=performance.now();reencuentro.id=id;runtime.enterFx=Math.max(runtime.enterFx||0,1);return true;}
 function applyFilter(){const want=pale()?'saturate(.12) brightness(.92)':'';if(want!==filter){filter=want;const cv=runtime.$('w');if(cv){cv.style.transition='filter 1.6s ease';cv.style.filter=want;}}}
 function draw(t,b){
  applyFilter();if(!runtime.inWorld?.()||(runtime.S.layer||'superficie')!=='superficie')return;const c=runtime.cx,W=runtime.W,H=runtime.H,id=biomeId(),ink=runtime.placeColor?runtime.placeColor(id,LANDSCAPES[id]||'#ffffff'):LANDSCAPES[id]||'#ffffff',still=calm(),beat=still?.4:b||0;
  c.save();
  // The biome's light around the cube, breathing with the beat: seen from above, centred, with no horizon.
  const g=c.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,Math.max(W,H)*.75);g.addColorStop(0,rgba(ink,.05+.07*beat));g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=1;c.fillStyle=g;c.fillRect(0,0,W,H);
  c.restore();last=id;}
 Object.defineProperties(runtime,{drawWorldSheet:{get:()=>draw},journeyColors:{get:()=>()=>({...colors()})},recoverJourneyColor:{get:()=>recover},worldSheetState:{get:()=>()=>({biome:biomeId(),pale:!!pale(),filter,reencuentro:{...reencuentro}})}});
}
