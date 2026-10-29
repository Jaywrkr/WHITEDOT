// Mapa del universo (Jay, 29 Oct 2026, alpha.235; docs/MUNDO.md#mapa-del-universo): the model, with no page or canvas.
// What you visited is painted with its biome's colour; the rest stays black (the fog). Three zooms: the ring, your
// region and the universe, with rings at 5, 20 and 50 km from the origin. A tap on a point opens its card: «Ir» where
// the rules of today already let you go, «Marcar» everywhere else (one mark at a time, the compass by the cube leads to
// it). Nothing here moves the map or uses the old random numbers.
export const UMAP_VERSION=1;
// Spans in world units (10 u are 1 m) of the shorter side of the screen for each zoom.
export const UMAP_LEVELS=Object.freeze(['anillo','region','universo']);
export const UMAP_LEVEL_NAMES=Object.freeze({anillo:'Anillo',region:'Región',universo:'Universo'});
export const UMAP_SPAN=Object.freeze({anillo:16000,region:30000,universo:110000});
export const UMAP_MIN_SPAN=3000,UMAP_MAX_SPAN=4000000;
// Distance rings around the origin (decision 5 of the catalogue: distance from 0,0), in km.
export const UMAP_BANDS=Object.freeze([5,20,50]);
export const UNITS_PER_KM=10000;
// The mark is reached within 30 m; at most 120 living encounters are kept on the map (the latest).
export const UMAP_ARRIVE=300,UMAP_LIVE_MAX=120,UMAP_NAME_MAX=60;
// A tap finds what is under the finger within 24 px.
export const UMAP_TOUCH=24;

const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const finite=v=>Number.isFinite(v)&&Math.abs(v)<1e12;
const text=(v,n=UMAP_NAME_MAX)=>typeof v==='string'?v.slice(0,n):'';
// The save (S.universeMap): the one mark, the living encounters seen, the distance rings fully discovered (the day) and
// the mini map setting. Unknown fields are kept; a later version is left untouched.
export function normalizeUniverseMap(raw){
 if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>UMAP_VERSION)return raw;
 const q=plain(raw)?raw:{};
 const m=plain(q.mark)&&finite(q.mark.x)&&finite(q.mark.y)?{...q.mark,x:q.mark.x,y:q.mark.y,name:text(q.mark.name)||'Tu marca',kind:text(q.mark.kind,24)||'spot',id:text(q.mark.id,120)}:null;
 const live=(Array.isArray(q.live)?q.live:[]).filter(e=>plain(e)&&typeof e.k==='string'&&e.k&&finite(e.x)&&finite(e.y)).map(e=>({...e,k:text(e.k,40),x:e.x,y:e.y,d:text(e.d,24),w:e.w===true})).slice(-UMAP_LIVE_MAX);
 const bands={};for(const [k,v] of Object.entries(plain(q.bands)?q.bands:{}))if(/^\d{1,3}$/.test(k)&&typeof v==='string')bands[k]=v.slice(0,24);
 return {...q,version:UMAP_VERSION,mark:m,live,bands,mini:q.mini===true};
}
// A living encounter seen: one per spot (within 60 m), the latest outcome wins.
export function noteLive(q,{kind,x,y,won=false,day=''}){
 if(!plain(q)||q.version!==UMAP_VERSION||typeof kind!=='string'||!finite(x)||!finite(y))return false;
 const near=q.live.findIndex(e=>e.k===kind&&Math.hypot(e.x-x,e.y-y)<600);const row={k:kind,x:Math.round(x),y:Math.round(y),d:text(day,24),w:!!won||(near>=0&&q.live[near].w)};
 if(near>=0)q.live.splice(near,1);q.live.push(row);if(q.live.length>UMAP_LIVE_MAX)q.live.splice(0,q.live.length-UMAP_LIVE_MAX);return true;
}

// The fog: the regions you walked through (S.places, keys «rx,ry» in regions).
export function fogCells(places){const out=[];for(const key of Object.keys(plain(places)?places:{})){if(!/^-?\d+,-?\d+$/.test(key))continue;const [rx,ry]=key.split(',').map(Number);if(Number.isSafeInteger(rx)&&Number.isSafeInteger(ry))out.push({rx,ry,key});}return out;}
// The regions whose centre lies within km of the origin.
export function bandCells(RP,km){const R=km*UNITS_PER_KM,n=Math.ceil(R/RP)+1,out=[];for(let rx=-n;rx<=n;rx++)for(let ry=-n;ry<=n;ry++)if(Math.hypot((rx+.5)*RP,(ry+.5)*RP)<=R)out.push(rx+','+ry);return out;}
// How much of a disc is discovered. pct is whole (floor); a single region already reads «1 %», never «0 %» once begun.
export function bandProgress(places,RP,km,cells=bandCells(RP,km)){const set=plain(places)?places:{};let done=0;for(const k of cells)if(set[k])done++;const total=cells.length;return {km,done,total,complete:total>0&&done>=total,pct:done?Math.max(1,Math.floor(done/total*100)):0};}
// The band to show: the first ring not yet complete beyond where you stand (or the last one).
export function currentBand(progress,distanceKm=0){return progress.find(p=>!p.complete&&p.km>=distanceKm)||progress.find(p=>!p.complete)||progress.at(-1)||null;}

// The camera: its centre in world units and its scale in screen pixels per unit.
const room=(W,H,inset={x:0,y:0})=>Math.max(60,Math.min(W-2*(inset?.x||0),H-2*(inset?.y||0)));
export const spanOf=(view,W,H,inset)=>room(W,H,inset)/view.scale;
export function levelOf(view,W,H,inset){const span=spanOf(view,W,H,inset);return span<Math.sqrt(UMAP_SPAN.anillo*UMAP_SPAN.region)?'anillo':span<Math.sqrt(UMAP_SPAN.region*UMAP_SPAN.universo)?'region':'universo';}
export function clampScale(scale,W,H){const s=Math.min(W,H);return Math.max(s/UMAP_MAX_SPAN,Math.min(s/UMAP_MIN_SPAN,scale));}
// The universe fits what you discovered around the origin, never less than the 5 km ring.
export function universeSpan(points){let r=0;for(const p of points||[])if(p&&finite(p.x)&&finite(p.y))r=Math.max(r,Math.hypot(p.x,p.y));return Math.min(UMAP_MAX_SPAN,Math.max(UMAP_SPAN.universo,r*2.3));}
// Each zoom's own centre: the ring on its centre, the region on you, the universe on the origin.
// inset: room kept free at each side (the buttons), so the ring is not under them.
export function viewFor(level,{me,ring,points}={},W=390,H=844,inset={x:0,y:0}){
 const s=room(W,H,inset),at=level==='anillo'&&ring?ring:level==='universo'?{x:0,y:0}:me||{x:0,y:0};
 const span=level==='universo'?universeSpan([...(points||[]),me].filter(Boolean)):UMAP_SPAN[level]||UMAP_SPAN.region;
 return {x:at.x,y:at.y,scale:clampScale(s/span,W,H)};
}
// One step closer (+1) or farther (−1); from a zoom between two steps it goes to the next one in that direction.
export function stepLevel(view,dir,W,H,context,inset){const span=spanOf(view,W,H,inset),spans=UMAP_LEVELS.map(l=>viewFor(l,context,W,H,inset)).map(v=>({v,span:spanOf(v,W,H,inset)}));
 if(dir>0){const next=[...spans].reverse().find(e=>e.span<span*.98);return next?.v||null;}const next=spans.find(e=>e.span>span*1.02);return next?.v||null;}
// Zoom around a point of the screen (the pinch's middle, the mouse): that point stays under the finger.
export function zoomAt(view,factor,px,py,W,H){const scale=clampScale(view.scale*factor,W,H),wx=view.x+(px-W/2)/view.scale,wy=view.y+(py-H/2)/view.scale;return {x:wx-(px-W/2)/scale,y:wy-(py-H/2)/scale,scale};}
export const toScreen=(view,W,H,x,y)=>[W/2+(x-view.x)*view.scale,H/2+(y-view.y)*view.scale];
export const toWorld=(view,W,H,px,py)=>[view.x+(px-W/2)/view.scale,view.y+(py-H/2)/view.scale];

// What a tap finds: the nearest point within reach, the more important first when two overlap.
// A rumor (Descubrir, alpha.240) is something to go to: right after your favourites.
export const UMAP_PRIORITY=Object.freeze({me:0,mark:1,place:2,ringHome:3,refugio:4,favorite:5,rumor:5.5,sky:6,live:7,landmark:8,heard:9,rare:10});
export function hitTest(items,view,W,H,px,py,reach=UMAP_TOUCH){let best=null,bd=Infinity;for(const it of items||[]){const [sx,sy]=toScreen(view,W,H,it.x,it.y),d=Math.hypot(sx-px,sy-py);if(d>reach)continue;const score=d+(UMAP_PRIORITY[it.kind]??12)*2;if(score<bd){bd=score;best=it;}}return best;}

// What a card offers. go: the move of today's rules (a place of the ring you can travel to, «Volver al anillo», a
// favourite); otherwise «Marcar». A point that is the mark offers «Quitar marca». You yourself: nothing.
export function cardActions(item,{canTravel=false,canHome=false,canFavorite=false,mark=null}={}){
 if(!item||item.kind==='me')return {go:null,mark:null};
 const marked=!!mark&&(item.kind==='mark'||Math.hypot(mark.x-item.x,mark.y-item.y)<1);
 const go=item.kind==='place'&&canTravel?'place':(item.kind==='ringHome'||item.home)&&canHome?'ring':item.kind==='favorite'&&canFavorite?'favorite':null;
 return {go,mark:marked?'unmark':go?null:'mark'};
}
// A mark from an item: where it is and its name, nothing else.
export function markOf(item){if(!item||!finite(item.x)||!finite(item.y))return null;return {x:Math.round(item.x),y:Math.round(item.y),name:item.kind==='spot'?'Tu marca':text(item.name)||'Tu marca',kind:text(item.kind,24)||'spot',id:text(String(item.id??''),120)};}
// The mark as a heading for the compass by the cube; null once reached.
export function markRoute(mark,from){if(!mark||!from)return null;const dx=mark.x-from.x,dy=mark.y-from.y,distance=Math.hypot(dx,dy);return {id:'mark',name:mark.name&&mark.name!=='Tu marca'?`Tu marca · ${mark.name}`:'Tu marca',x:mark.x,y:mark.y,dx,dy,distance,arrived:distance<=UMAP_ARRIVE};}
