import {prefersReducedMotion} from './frame-state.js';
import {LANDSCAPES} from './house-view.js';
// The Journey, phase 3: the World's light. The World is always seen from above and has no horizon (only the Refugio
// is seen from the side), so each biome gets a light around the cube that breathes with the beat. In the Journey the
// colour is earned: a biome stays pale until you complete the cube's theme on time there, then its colour comes back.
// Plan H1: the grey is painted on the ground only, before the games, the cube and the gold are drawn, so the gold
// never turns grey. Panel 10 (P7, Roset): a recovered biome is not washed with a flat veil; its colour goes into the
// shapes, as pigment (a «color» blend keeps black black), and coming back takes one bar (2,4–3 s) opening from the cube.
// Hashes stay available for detail placed on the map; nothing uses the game's random sequence.
export function hash(text){let h=2166136261;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export const rand=(key)=>hash(key)/4294967296;
// How long the colour takes to come back: one bar of the music, kept between 2,4 and 3 seconds.
export const recoverMs=six=>Math.round(Math.max(2400,Math.min(3000,(Number(six)>0?six:.15625)*16*1000)));
// The opening's ease: slow out of the cube, slow onto the edges.
export const ease=k=>{const x=Math.max(0,Math.min(1,k));return x*x*(3-2*x);};
// Panel 10 (P7, Roset #5): Lago, Dunas and Ruinas carry less texture on the ground (ripples, stripes, marks), so the
// cube and its goal are the figure. A weight on the alpha of that decoration; nothing moves and no seed is read.
export const TEXTURE_WEIGHT=Object.freeze({lago:.45,dunas:.4,ruinas:.45});
export const textureWeight=id=>TEXTURE_WEIGHT[id]??1;
// The pigment of a recovered biome: how much of its colour goes into the shapes.
export const PIGMENT=.7;
const rgba=(hex,a)=>{const n=parseInt(hex.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;};
// The colours recovered in the Journey: kept as biome ids.
export function normalizeColors(raw){const out={};if(raw&&typeof raw==='object'&&!Array.isArray(raw))for(const [k,v]of Object.entries(raw))if(v&&typeof k==='string'&&k.length<40)out[k]=true;return out;}
export function initialize(runtime){
 let owner=null,filter='',last=null;const reencuentro={at:-1e9,id:null,ms:2400};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 // The recovered colours live in S.journey.colors (seeded at load from explored biomes, see journey-mode.js).
 function colors(){const j=runtime.S.journey;if(!j||typeof j!=='object')return {};if(owner!==runtime.S||!j.colors){owner=runtime.S;j.colors=normalizeColors(j.colors);}return j.colors;}
 const biomeId=()=>runtime.BIOMES?.[Math.max(0,runtime.curZone)]?.id||'llanura';
 const pale=()=>runtime.journeyQuiet?.()&&runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie'&&!colors()[biomeId()];
 // Completing the theme on time gives the colour of the place back.
 function recover(){if(!runtime.journeyQuiet?.()||!runtime.inWorld?.())return false;const id=biomeId(),c=colors();if(c[id])return false;c[id]=true;if(runtime.save()===false){delete c[id];return false;}reencuentro.at=performance.now();reencuentro.id=id;reencuentro.ms=recoverMs(runtime.SIX);runtime.enterFx=Math.max(runtime.enterFx||0,1);return true;}
 // The moment the colour comes back: 0 → 1 over one bar while you stay in that biome; null when there is none.
 function opening(now=performance.now()){if(reencuentro.id!==biomeId()||!runtime.inWorld?.())return null;const k=(now-reencuentro.at)/(reencuentro.ms||2400);return k>=0&&k<1?k:null;}
 // The grey fades in and out over a second and a half, like the old screen filter did.
 let grey=0,greyAt=null;
 function applyFilter(){const want=pale()?'saturate(.12) brightness(.92)':'';if(want!==filter){filter=want;const cv=runtime.$('w');if(cv&&cv.style.filter)cv.style.filter='';}
  const now=performance.now(),dt=greyAt===null?1:Math.min(1,(now-greyAt)/1600),k=opening(now);greyAt=now;if(k!==null){grey=1-ease(k);return;}grey+=((pale()?1:0)-grey)*(calm()?1:Math.min(1,dt*6));}
 // The ground made pale: its colour taken away and a little darker, on the canvas, under what is drawn after it.
 let front=null;
 const inkOf=id=>runtime.placeColor?runtime.placeColor(id,LANDSCAPES[id]||'#ffffff'):LANDSCAPES[id]||'#ffffff';
 // While the colour comes back, the grey stays outside a circle that grows from the cube to the farthest corner, with
 // a thin ring of the biome's colour on its front; with reduced motion the grey simply fades over the same bar.
 // A recovered biome then takes its colour as pigment: a «color» blend over what is drawn, so black stays black.
 function drawGrey(){if(!runtime.inWorld?.()||(runtime.S.layer||'superficie')!=='superficie')return;const c=runtime.cx,w=c.canvas?.width||runtime.W,h=c.canvas?.height||runtime.H,id=biomeId(),k=opening(),still=calm();
  const tinted=!pale()&&colors()[id],ink=tinted||k!==null?inkOf(id):null;
  if(tinted&&ink!=='#ffffff'){c.save();c.setTransform?.(1,0,0,1,0,0);c.globalCompositeOperation='color';c.globalAlpha=PIGMENT*(k===null?1:ease(k));c.fillStyle=ink;c.fillRect(0,0,w,h);c.restore();}
  if(grey<.01){front=null;return;}c.save();c.setTransform?.(1,0,0,1,0,0);let full=.88*grey,dark=.08*grey;
  if(k!==null&&!still){const sx=w/(runtime.W||w),cx=(runtime.W||w)/2*sx,cy=(runtime.H||h)/2*sx,reach=Math.hypot(Math.max(cx,w-cx),Math.max(cy,h-cy)),r=ease(k)*reach;
   c.beginPath();c.rect(0,0,w,h);c.moveTo(cx+r,cy);c.arc(cx,cy,r,0,6.283);c.clip('evenodd');full=.88;dark=.08;front={r:r/sx,reach:reach/sx,k};}else front=null;
  c.globalCompositeOperation='saturation';c.globalAlpha=full;c.fillStyle='#808080';c.fillRect(0,0,w,h);c.globalCompositeOperation='source-over';c.globalAlpha=dark;c.fillStyle='#000';c.fillRect(0,0,w,h);c.restore();
  if(front&&ink){c.save();c.globalAlpha=.55*(1-front.k);c.strokeStyle=ink;c.lineWidth=2;c.beginPath();c.arc((runtime.W||w)/2,(runtime.H||h)/2,front.r,0,6.283);c.stroke();c.restore();}}
 function draw(t,b){
  applyFilter();if(!runtime.inWorld?.()||(runtime.S.layer||'superficie')!=='superficie')return;const c=runtime.cx,W=runtime.W,H=runtime.H,id=biomeId(),ink=inkOf(id),still=calm(),beat=still?.4:b||0;
  c.save();
  // The biome's light around the cube, breathing with the beat: seen from above, centred, with no horizon. Panel 10
  // (P7): a small pool of light, so the ground around stays black; the colour of a recovered biome is in its shapes.
  const g=c.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,Math.max(W,H)*.42);g.addColorStop(0,rgba(ink,pale()?.04+.05*beat:.1+.08*beat));g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=1;c.fillStyle=g;c.fillRect(0,0,W,H);
  c.restore();last=id;}
 Object.defineProperties(runtime,{groundTexture:{get:()=>()=>textureWeight(biomeId())},drawWorldSheet:{get:()=>draw},drawWorldSheetGrey:{get:()=>drawGrey},journeyColors:{get:()=>()=>({...colors()})},recoverJourneyColor:{get:()=>recover},worldSheetState:{get:()=>()=>({biome:biomeId(),pale:!!pale(),filter,grey,opening:opening(),front:front&&{...front},pigment:!pale()&&!!colors()[biomeId()],reencuentro:{...reencuentro}})}});
}
