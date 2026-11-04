import {edgePick,edgePlace,offScreen,EDGE_CAP,EDGE_RANK} from './scanner-arrows-model.js';
import {drawEdgeArrows} from './scanner-art.js';
import {scanLevel,scanNear} from './scanner-model.js';
import {openSurface,prefersReducedMotion} from './frame-state.js';
// Una capa de flechas (coherencia T2, Jay, 4 Nov 2026; docs/MUNDO.md#una-capa-de-flechas). The one layer that says
// «hay algo allí» at the screen's edge. Every system that used to draw its own mark offers it here instead
// (r.edgeOffer, during its draw); from level 3 the scanner's registry offers what it reaches (four times a second).
// Once a frame (from the scanner's draw, over the World) the layer keeps EDGE_CAP at most and draws them in white.
// Reduced motion: an arrow is there at once (no fade in). Light quality: no halo. Gold never: it is for what is earned.
export const EDGE_FADE=.3;          // s an arrow takes to come in
export const EDGE_SCAN_EVERY=250;   // ms between two readings of the registry
const OFFERS_MAX=48;
// The registry's ids as the layer's kinds (their rank) and whether they show as «?» (heard or secret).
const KIND={cajas:'caja',hallazgos:'hallazgo',actividades:'juego',sondas:'sonda',rumores:'rumor',cometas:'cometa',asteroide:'secreto'};
const HEARD=new Set(['sondas']);
export function initialize(r){
 let offers=[],shown=[],fade=new Map(),reg=[],regAt=-Infinity,last=0,drawn={arrows:0,icons:0,labels:0},offered=0,kinds=[],level=null;
 const view=()=>({W:r.W,H:r.H,cx:r.camX??r.S.wx,cy:r.camY??r.S.wy});
 const surface=()=>(r.S?.layer||'superficie')==='superficie';
 const still=()=>!!r.S?.reducedMotion||prefersReducedMotion();
 const scene=()=>!!r.liveEncounterActive?.()||!!r.skyMapActive?.()||!!(r.mischiefBusy?r.mischiefBusy():r.mischiefState?.scene)||!!r.skySecretBusy?.()||!!r.bandBusy?.()||!!r.lejosBBusy?.();
 const live=()=>!!r.S&&!!r.inWorld?.()&&surface()&&r.W>0&&r.H>0;
 // A system's mark: {key, kind, x, y (world), shape, ask, label, far}. Returns where its arrow would sit (for its own
 // state). far: a thing of the batches past 10 km (B, C, D), a «?» until level 4 names it.
 function offer(o){if(!live()||!o||!Number.isFinite(o.x)||!Number.isFinite(o.y))return null;
  if(o.far===true&&(level||scanLevel(r.S)).level<4)o={...o,ask:true};if(offers.length<OFFERS_MAX)offers.push(o);return edgePlace(o.x,o.y,view());}
 // What the registry reaches from level 3: rare enough to point at (not the voices), not found yet; the rarer first.
 function readRegistry(now){if(now-regAt<EDGE_SCAN_EVERY)return;regAt=now;level=scanLevel(r.S);reg=[];if(!(level.arrows>0))return;
  let near=[];try{near=scanNear({x:r.S.wx,y:r.S.wy},r.S,{level,ctx:r,max:0,minRarity:1});}catch(_){near=[];}
  for(const it of near){if(it.done)continue;const kind=KIND[it.id]||(it.secret?'secreto':'cosa');reg.push({key:'scan:'+it.key,kind,x:it.x,y:it.y,shape:it.shape,ask:it.secret||HEARD.has(it.id),rank:Math.max(EDGE_RANK[kind],it.rarity)});}}
 function draw(){
  const now=performance.now(),dt=Math.min(.1,Math.max(0,(now-last)/1000));last=now;
  const mine=offers;offers=[];
  if(!live()||!r.cx||openSurface('.modal:not([hidden])')){shown=[];fade.clear();drawn={arrows:0,icons:0,labels:0};offered=0;kinds=[];return;}
  readRegistry(now);const v=view(),all=mine.concat(reg).filter(o=>offScreen(o.x,o.y,v,-8));offered=all.length;kinds=[...new Set(all.map(o=>o.kind))];
  shown=edgePick(all,v,{x:r.S.wx,y:r.S.wy},{cap:EDGE_CAP,scene:scene()});
  const calm=still(),keys=new Set(shown.map(e=>e.key));for(const k of fade.keys())if(!keys.has(k))fade.delete(k);
  for(const e of shown)fade.set(e.key,calm?1:Math.min(1,(fade.get(e.key)??0)+dt/EDGE_FADE));
  drawn=drawEdgeArrows(r.cx,shown,{light:!!r.lightQuality?.(),words:r.S.universeTexts!==false,fade});}
 // Tests only (the runtime is never published): what was offered and what the last frame drew.
 const state=()=>({offered,kinds,level:level?.id||null,shown:shown.map(({key,kind,shape,ask,label,rank,d,at})=>({key,kind,shape,ask,label,rank,m:Math.round(d/10),x:at?.x,y:at?.y,k:fade.get(key)??0})),drawn:{...drawn}});
 Object.defineProperties(r,{edgeOffer:{get:()=>offer},drawEdgeArrows:{get:()=>draw},edgeState:{get:()=>state}});
}
