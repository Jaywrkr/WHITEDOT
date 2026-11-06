// Niveles en orden: la frontera (Jay, 6 Nov 2026, docs/MUNDO.md#niveles-en-orden-frontera). The rules, with no page or
// canvas; frontier.js wires them. The next place without ★, in the order of PLACES (by distance), calls you when you reach
// its distance on foot, and its round starts by itself. Until its first ★ you cannot go farther from the origin than its
// distance and a short margin: the world holds you back softly and slides you along the circle. A jump never lands past
// its distance. Leaving its round without ★ offers «Otra vez» and «Salir»; after three tries (one in Modo niños), an
// easier round. Maestro (★★★) stays optional. With the eleven complete there is no frontier.
import {PLACES,PLACE_IDS,PLACES_VERSION,ASSIST_GOAL,complete,placeRadius} from './places.js';
import {freeOpen} from './journey-mode.js';
export const FRONTIER_VERSION=1;
// How far past the place's distance you can still walk (200 m), the band where the world starts holding you back (60 m),
// and where «Salir», a jump or an old save leaves you: 20 m inside the place's distance, so the next steps out call again.
export const FRONTIER_MARGIN=2000,FRONTIER_SOFT=600,FRONTIER_INSIDE=200,FRONTIER_REARM=100;
// The call: a short line, then the round (2 s of play; a sheet open holds it). Pushing at the edge calls again (1,5 s).
export const CALL_SECONDS=2,RECALL_SECONDS=1.5;
// Tries without ★ before the easier round is offered: three, or one in Modo niños. The easier round is the calm one
// (tranquilo-model.js: no clock, ±140 ms) with a lower goal (ASSIST_GOAL, places.js); it gives ★ like any round, never ★★ or ★★★.
export const ASSIST_AFTER=3,ASSIST_AFTER_KIDS=1;
export {ASSIST_GOAL};
// The longest step that still counts as walking (the same as places-ring.js FOUND_JUMP: 120 m).
export const WALK_STEP=1200;
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
// The place that holds the frontier: the first without ★, in order. None during the Journey, with a locked or future
// format of the places, or once the eleven are complete.
export function pendingPlace(places,journey){if(!plain(places)||places.readOnly||places.version>PLACES_VERSION||!freeOpen(journey))return null;return PLACES.find(p=>p.game&&!complete(places,p.id))?.id||null;}
// Its distance from the origin and the frontier, in world units; null without a frontier.
export function frontierOf(places,journey){const id=pendingPlace(places,journey);if(!id)return null;const R=placeRadius(id);return {id,R,F:R+FRONTIER_MARGIN};}
// A point at radius `r` on the bearing of `p` from the origin (north at the origin itself).
export function onBearing(p,r){const d=Math.hypot(p?.x||0,p?.y||0);if(!(d>0))return {x:0,y:-Math.round(r)};return {x:Math.round(p.x/d*r),y:Math.round(p.y/d*r)};}
// Just inside the place's distance, on your bearing.
export const insideSpot=(p,R)=>onBearing(p,Math.max(0,R-FRONTIER_INSIDE));
// One step on foot from `from` to `to` with the frontier at F: moving out, the world holds you back more as you come near
// F (none until FRONTIER_SOFT before it, to a twentieth of the step just before it, all at F); along the circle and inward you move freely. Never past F.
export function clampStep(from,to,F){if(!Number.isFinite(F))return {x:to.x,y:to.y,pushed:false};const r0=Math.hypot(from.x,from.y),r1=Math.hypot(to.x,to.y);
 if(r1<=r0||r1<=F-FRONTIER_SOFT)return r1<=F?{x:to.x,y:to.y,pushed:false}:{...onBearing(to,F),pushed:true};
 const k=r0>=F?0:Math.max(.05,Math.min(1,(F-r0)/FRONTIER_SOFT)),r=Math.min(F,r0+(r1-r0)*k);
 if(r>=r1-1e-6)return {x:to.x,y:to.y,pushed:false};const q=onBearing(to,r);return {x:q.x,y:q.y,pushed:true};}
// A jump (or the first moment in the World): never past the place's distance; past it, just inside, on your bearing.
export function clampJump(to,frontier){if(!frontier)return {x:to.x,y:to.y,moved:false};if(Math.hypot(to.x,to.y)<=frontier.R)return {x:to.x,y:to.y,moved:false};return {...insideSpot(to,frontier.R),moved:true};}
// Whether a step is a jump.
export const isJump=(from,to)=>!from||Math.hypot(to.x-from.x,to.y-from.y)>WALK_STEP;
// The save (S.frontera): the tries without ★ of each place. Unknown fields are kept; a later version is left untouched.
export function normalizeFrontier(raw){if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>FRONTIER_VERSION)return raw;const q=plain(raw)?raw:{};
 const fails={};if(plain(q.fails))for(const id of PLACE_IDS){const n=q.fails[id];if(Number.isInteger(n)&&n>0)fails[id]=Math.min(99,n);}
 return {...q,version:FRONTIER_VERSION,fails};}
export const frontierWritable=f=>f?.version===FRONTIER_VERSION;
// Whether the easier round is offered for a place.
export const assistOffered=(fails,kids=false)=>(Number.isInteger(fails)?fails:0)>=(kids?ASSIST_AFTER_KIDS:ASSIST_AFTER);
// On load: an old save that stands past the place's distance (it walked on and left places behind without ★) is moved
// just inside it; everything else stays. Returns the point, or null when nothing moves.
export function migratePosition(places,journey,pos){const f=frontierOf(places,journey);if(!f||!pos||!Number.isFinite(pos.x)||!Number.isFinite(pos.y))return null;const q=clampJump(pos,f);return q.moved?{x:q.x,y:q.y}:null;}
// The call, as the line says it: «La Llanura te llama.»
const CALLS=Object.freeze({llanura:'La Llanura te llama.',lago:'El Lago te llama.',bosque:'El Bosque te llama.',tormenta:'La Tormenta te llama.',vacio:'El Vacío te llama.',
 jardin:'El Jardín te llama.',dunas:'Las Dunas te llaman.',cristales:'Los Cristales te llaman.',faros:'Los Faros te llaman.',ruinas:'Las Ruinas te llaman.',cueva:'La Cueva te llama.'});
export const callLine=id=>CALLS[id]||'';
