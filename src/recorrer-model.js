// Recorrer lejos (F2, first batch; Jay, 3 Nov 2026, alpha.245; docs/MUNDO.md#recorrer-lejos): the model, with no page,
// canvas or sound. Measured from the origin (0,0), as decision 5 of the catalogue says (docs/IDEAS_UNIVERSO.md):
// Boyas de luz (idea 59): on every whole km of distance from the origin, a ring of white buoys about 1 km apart, each
// with its number (its km). The next one outward is marked at the screen's edge; passing one plays a soft tic.
// Satélites de descanso (idea 66): on every ring of 10 km, satellites about 10 km apart, with a warm light. Inside one
// the music goes a little lower and the satellite is kept as a point of return.
// La puerta (decision 11, ideas 118 and 57): from inside a satellite you visited you can go to another one you visited
// (or back to the ring, as «Volver al anillo» always could). Never to a place you have not walked to: no free jump.
// Everything is placed with hashKey: no old random sequence is read and nothing on the map moves.
import {hashKey} from './universe-regions.js';
export const RECORRER_VERSION=1,UNITS_PER_KM=10000;
// Buoys: one ring per km (from 1 km), about 1 km apart along it. Passing within BUOY_PASS (15 m) plays its tic.
export const BUOY_PASS=150;
// Satellites: one ring every SAT_EVERY km, about SAT_EVERY km apart. Inside within SAT_INSIDE (16 m), the warm light
// reaches SAT_GLOW; the next one is marked at the edge from SAT_EDGE (6 km). Inside, the whole output goes to SAT_DUCK
// (alpha.246, runtime.musicDuck in audio.js's musicVolume): evenly lower, dry, room and echo alike (tests/recorrer_mix.py).
// The buoy's tic and a satellite's two notes: soft, far under the music (measured by render, tests/recorrer_mix.py).
export const BUOY_GAIN=.003,SAT_GAIN=.0035;
export const SAT_EVERY=10,SAT_INSIDE=160,SAT_GLOW=220,SAT_EDGE=60000,SAT_DUCK=.84,SAT_KEEP=200;
const TAU=Math.PI*2;
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const finite=v=>Number.isFinite(v)&&Math.abs(v)<1e12;
const count=v=>Number.isSafeInteger(v)&&v>0?v:0;
// How many on a ring of radius r km, so that they stand about `every` km apart (never fewer than six).
export const ringCount=(r,every=1)=>Math.max(6,Math.round(TAU*r/every));
// One spot of a ring: its sector, with its own angle inside the sector (hashKey of the world, the ring and the sector).
function spot(kind,world,ring,j,every){const km=ring*every,n=ringCount(km,every),jj=((j%n)+n)%n,a=(jj+.2+.6*hashKey(`recorrer:${kind}:v1:${world}:${ring}:${jj}`))/n*TAU;
 return {id:`${kind}:${ring}:${jj}`,ring,j:jj,km,x:Math.round(Math.cos(a)*km*UNITS_PER_KM),y:Math.round(Math.sin(a)*km*UNITS_PER_KM)};}
export const buoyAt=(world,k,j)=>({...spot('boya',world,k,j,1),kind:'buoy'});
export const satelliteAt=(world,m,j)=>({...spot('sat',world,m,j,SAT_EVERY),kind:'satellite'});
// The nearest one of a ring to a point: the sector of its angle and the two beside it.
function nearestOn(make,world,ring,every,p){if(ring<1)return null;const n=ringCount(ring*every,every);let a=Math.atan2(p.y,p.x);if(a<0)a+=TAU;const j0=Math.floor(a/TAU*n);let best=null,bd=Infinity;
 for(const j of [j0-1,j0,j0+1]){const s=make(world,ring,j),d=Math.hypot(s.x-p.x,s.y-p.y);if(d<bd){bd=d;best=s;}}return best?{...best,d:bd}:null;}
export const nearestBuoy=(world,k,p)=>nearestOn(buoyAt,world,k,1,p);
export const nearestSatelliteOn=(world,m,p)=>nearestOn(satelliteAt,world,m,SAT_EVERY,p);
export const kmFromOrigin=p=>Math.hypot(p.x,p.y)/UNITS_PER_KM;
// The next buoy: the nearest one of your next km outward; one you just passed gives way to the km after it.
export function nextBuoy(world,p,skip=()=>false){const k=Math.floor(kmFromOrigin(p))+1;for(const ring of [k,k+1]){const b=nearestBuoy(world,ring,p);if(b&&!skip(b))return b;}return nearestBuoy(world,k+2,p);}
// The buoy you are passing, if any: on the nearest km ring, within reach.
export function buoyHere(world,p,reach=BUOY_PASS){const k=Math.round(kmFromOrigin(p));if(k<1)return null;const b=nearestBuoy(world,k,p);return b&&b.d<=reach?b:null;}
// The nearest satellite: of the rings on either side of you.
export function nearestSatellite(world,p){const m=Math.floor(kmFromOrigin(p)/SAT_EVERY);let best=null;for(const ring of [m,m+1]){const s=nearestSatelliteOn(world,ring,p);if(s&&(!best||s.d<best.d))best=s;}return best;}
export function satelliteHere(world,p,reach=SAT_INSIDE){const s=nearestSatellite(world,p);return s&&s.d<=reach?s:null;}
// The save (S.recorrer): the satellites you visited (one row each, with its world and day), the last one you were in,
// the farthest buoy you passed (km) and how many you passed. Unknown fields are kept; a later version is left untouched.
export function normalizeRecorrer(raw){
 if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>RECORRER_VERSION)return raw;
 const q=plain(raw)?raw:{},seen=new Set(),sats=[];
 for(const e of Array.isArray(q.sats)?q.sats:[]){if(!plain(e)||typeof e.id!=='string'||!/^sat:\d{1,6}:\d{1,7}$/.test(e.id)||typeof e.w!=='string'||!finite(e.x)||!finite(e.y))continue;const key=e.w+'|'+e.id;if(seen.has(key))continue;seen.add(key);
  sats.push({...e,id:e.id,w:e.w.slice(0,40),x:Math.round(e.x),y:Math.round(e.y),km:count(e.km),day:typeof e.day==='string'?e.day.slice(0,24):''});}
 return {...q,version:RECORRER_VERSION,sats:sats.slice(-SAT_KEEP),last:typeof q.last==='string'&&q.last.length<=48?q.last:null,far:count(q.far),buoys:count(q.buoys)};
}
export const visited=(q,world,id)=>!!q&&Array.isArray(q.sats)&&q.sats.some(e=>e.w===world&&e.id===id);
// Entering a satellite: kept once (first) and remembered as the last one. Returns {first} or null (a later version).
export function noteSatellite(q,world,s,day=''){if(!plain(q)||q.version!==RECORRER_VERSION||!s)return null;const first=!visited(q,world,s.id);
 if(first){q.sats.push({id:s.id,w:world,x:s.x,y:s.y,km:s.km,day});if(q.sats.length>SAT_KEEP)q.sats.splice(0,q.sats.length-SAT_KEEP);}q.last=s.id;return {first};}
// Passing a buoy: counted, and the farthest km kept. Returns whether it is your farthest yet.
export function noteBuoy(q,b){if(!plain(q)||q.version!==RECORRER_VERSION||!b)return null;q.buoys=count(q.buoys)+1;const far=b.km>count(q.far);if(far)q.far=b.km;return {far};}
// The door: from inside a satellite you visited, to every other one you visited in this world (nearest to the origin first).
// From anywhere else, or from one you have not been to, it is closed.
export function doorFrom(q,world,here){if(!here||!visited(q,world,here.id))return [];return q.sats.filter(e=>e.w===world&&e.id!==here.id).sort((a,b)=>a.km-b.km||a.id.localeCompare(b.id));}
// Where the door leaves you: inside the satellite, a little south of its middle (inside, so you arrive in its light).
export const doorPoint=e=>({x:e.x,y:e.y+Math.round(SAT_INSIDE/2),layer:'superficie'});
