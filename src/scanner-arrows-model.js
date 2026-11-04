// Una capa de flechas (coherencia T2, Jay, 4 Nov 2026; docs/MUNDO.md#una-capa-de-flechas). «Hay algo allí» has one
// language: a small white arrow at the screen's edge, with the scanner's icon of the thing (or «?» for what is only
// heard or secret). The model only: which offers become arrows and where they sit. No canvas, sound or save.
// · Each system offers what it used to mark at the edge (scanner-arrows.js, r.edgeOffer); from level 3 the scanner's
//   registry offers too. edgePick keeps EDGE_CAP at most: the most important first (EDGE_RANK), then the nearest.
// · Two offers for the same thing (closer than EDGE_MERGE) are one arrow; two arrows never sit on each other at the edge
//   (EDGE_APART px). A region is only pointed to when nothing else is (alone).
// · During a scene only the player's own (the flare, the next ring of a challenge) stay (EDGE_SCENE_RANK).
import {edgeSpot} from './descubrir-model.js';
export const EDGE_CAP=3;
export const EDGE_MERGE=300;       // units (30 m)
export const EDGE_APART=26;        // px between two arrows on the edge
export const EDGE_SIDE=22,EDGE_TOP=104;   // px kept off the sides and the bars (as the old marks)
export const EDGE_SCENE_RANK=4;
// What matters most first. The player's own; then what is rare or secret; then what can be done; then the way.
export const EDGE_RANK=Object.freeze({reto:5,bengala:4,secreto:3,rumor:3,sonda:3,chispa:3,eclipse:3,caja:2,cometa:2,
 banda:2,hallazgo:2,juego:1.5,sonido:1.5,satelite:1.5,hito:1,boya:1,cosa:1,region:0});
export const EDGE_SHAPES=Object.freeze(['voz','caja','hallazgo','portal','sonda','forma','estrella','boya','pregunta']);
const finite=v=>Number.isFinite(v);
const text=(v,n)=>typeof v==='string'&&v?v.slice(0,n):null;
// An offer, made safe: {key, kind, x, y (world units), shape, ask (true: «?»), label (a short word: «4 km»), rank, d}.
export function edgeOffer(o,p){
 if(!o||!finite(o.x)||!finite(o.y))return null;const kind=typeof o.kind==='string'&&o.kind in EDGE_RANK?o.kind:'cosa';
 const ask=o.ask===true,shape=ask?'pregunta':EDGE_SHAPES.includes(o.shape)?o.shape:null;
 return {key:text(String(o.key??''),120)||`${kind}:${Math.round(o.x)},${Math.round(o.y)}`,kind,x:o.x,y:o.y,shape,ask,label:ask?null:text(o.label,12),
  rank:finite(o.rank)?o.rank:EDGE_RANK[kind],alone:kind==='region',d:p&&finite(p.x)&&finite(p.y)?Math.hypot(o.x-p.x,o.y-p.y):finite(o.d)?o.d:0};}
// Where an arrow sits on the screen (W×H) for a thing at world (x,y), seen from the camera (cx,cy): edgeSpot's point and
// the angle it points at.
export function edgePlace(x,y,{W,H,cx,cy}){const q=edgeSpot(W,H,x-cx,y-cy,EDGE_SIDE,EDGE_TOP);return {x:Math.round(q.x),y:Math.round(q.y),a:q.a};}
// The arrows to draw, in order. offers: raw offers (edgeOffer is applied); view: {W,H,cx,cy}; p: where the cube is.
export function edgePick(offers,view,p,{cap=EDGE_CAP,scene=false}={}){
 const list=[];for(const o of offers||[]){const e=edgeOffer(o,p);if(e&&(!scene||e.rank>=EDGE_SCENE_RANK))list.push(e);}
 list.sort((a,b)=>b.rank-a.rank||a.d-b.d||(a.key<b.key?-1:a.key>b.key?1:0));
 const kept=[],seen=new Set();
 for(const e of list){
  if(kept.length>=cap)break;if(e.alone&&kept.length)continue;if(seen.has(e.key))continue;
  if(kept.some(k=>Math.hypot(k.x-e.x,k.y-e.y)<EDGE_MERGE))continue;
  const at=view?edgePlace(e.x,e.y,view):null;if(at&&kept.some(k=>k.at&&Math.hypot(k.at.x-at.x,k.at.y-at.y)<EDGE_APART))continue;
  seen.add(e.key);kept.push({...e,at});
  if(e.alone)break;
 }
 return kept;}
// Out of view: what the screen (in world units, a margin of m px) does not show.
export function offScreen(x,y,{W,H,cx,cy},m=8){const sx=x-cx+W/2,sy=y-cy+H/2;return sx<-m||sy<-m||sx>W+m||sy>H+m;}
