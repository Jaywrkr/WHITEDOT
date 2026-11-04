// Viaje lejos, tanda C (Jay, 4 Nov 2026, alpha.251; docs/MUNDO.md#lo-que-hay-más-lejos-tanda-c): the band from 30 to
// 60 km from the origin. The rules, with no page, canvas or sound. Each thing starts at its distance and keeps appearing
// beyond it (bandas-model.js):
// · Púlsar (30 km): a star that throws flashes of light, announced; a pulse on time at the flash's strike sends it back
//   as a note of the chord and adds to a run. Without sound the flash is dodged by stepping aside, and counts the same.
//   A rhythm game: nothing is hurt and nothing breaks.
// · Asteroide por capas (35 km): dug with pulses, layer by layer (3–5, each its colour), down to a core: a find.
// · Tirolina de luz (40 km): between two buoys you stepped on (recorrer-model.js) a pulse lays a line of light, kept;
//   riding it takes you quickly to the other buoy. Never a free jump: only between buoys you walked to.
// · Mar de polvo (45 km): a pulse in the dust sinks the cube; under it you pass below the rocks until you come out on
//   the other side. Down there there is sometimes something hidden.
// · Kit de herramientas (50 km): a net, a magnet and a rod, found once and kept for ever; each opens a kind of point of
//   this band (banks of light, satellite scrap, wells of stars), used by passing or pulsing near, with no new button.
// Small and repeatable pays by the universe's rule (universeReward); a tool is unique and pays nothing (its page).
// Nothing here draws a random number: every place comes from hashKey and nothing on the map moves.
import {hashKey} from './universe-regions.js';
import {UNIVERSE_BASE,DIFFICULTY,universeReward} from './spark-rules.js';
import {registerBand,bandSiteAt,bandSites,UNITS_PER_KM} from './bandas-model.js';
export const VIAJE_C_VERSION=1;
const TAU=Math.PI*2;
// ---------- the band: what starts where ----------
export const BAND_C=Object.freeze([
 registerBand({id:'pulsar',km:30,name:'Púlsares',notice:'Aquí empiezan los púlsares.',batch:'C'}),
 registerBand({id:'asteroide',km:35,name:'Asteroides por capas',notice:'Aquí empiezan los asteroides por capas.',batch:'C'}),
 registerBand({id:'tirolina',km:40,name:'Tirolinas de luz',notice:'Aquí empiezan las tirolinas de luz.',batch:'C'}),
 registerBand({id:'polvo',km:45,name:'Mares de polvo',notice:'Aquí empiezan los mares de polvo.',batch:'C'}),
 registerBand({id:'kit',km:50,name:'Kit de herramientas',notice:'Aquí empiezan las herramientas.',batch:'C'}),
]);
// ---------- sites (cells of hashKey; a site under its band does not exist) ----------
export const PULSAR=Object.freeze({cell:9000,share:.5,fromKm:30,margin:.25});
export const ROCK=Object.freeze({cell:10000,share:.5,fromKm:35,margin:.25});
export const DUST=Object.freeze({cell:12000,share:.5,fromKm:45,margin:.3});
export const CACHE=Object.freeze({cell:12000,share:.5,fromKm:50,margin:.25});
export const POINT=Object.freeze({cell:9000,share:.3,fromKm:50,margin:.25});
export const POINT_KINDS=Object.freeze(['banco','chatarra','pozo']);
export const ZIP_FROM_KM=40;
export const EDGE_REACH=4000;
// The dust patches keep their space: nothing else of the batch stands in one.
export const DUST_R=450,DUST_CLEAR=DUST_R+120;
export const dustAt=(world,i,j)=>bandSiteAt('polvo',i,j,{...DUST,world});
export const dustNear=(world,p,reach)=>bandSites('polvo',p,reach,{...DUST,world});
export const outOfDust=(world,s)=>!dustNear(world,s,DUST_CLEAR).length;
const near=(kind,opts)=>(world,p,reach)=>bandSites(kind,p,reach,{...opts,world}).filter(s=>outOfDust(world,s));
export const pulsarAt=(world,i,j)=>bandSiteAt('pulsar',i,j,{...PULSAR,world});
export const rockAt=(world,i,j)=>bandSiteAt('asteroide',i,j,{...ROCK,world});
export const cacheAt=(world,i,j)=>bandSiteAt('kit',i,j,{...CACHE,world});
export const pointAt=(kind,world,i,j)=>bandSiteAt(kind,i,j,{...POINT,world});
export const pulsarsNear=near('pulsar',PULSAR),rocksNear=near('asteroide',ROCK),cachesNear=near('kit',CACHE);
export const pointsNear=(world,p,reach)=>POINT_KINDS.flatMap(k=>near(k,POINT)(world,p,reach)).sort((a,b)=>a.d-b.d);
// ---------- the pulsar: flashes sent back ----------
// Inside PULSAR_ZONE a volley of VOLLEY flashes starts. With sound, each flash is thrown at a bar of the music and
// strikes at the next one: a pulse on time within RETURN_WINDOW of the strike sends it back. Without sound, each flash
// aims at where the cube stood when it was thrown: being DODGE or more away from that spot at the strike dodges it.
export const PULSAR_ZONE=350,PULSAR_OUT=600,VOLLEY=6,PULSAR_PAY_MIN=4,RETURN_WINDOW=.32,QUIET_WARN=1.6,QUIET_REST=.8,DODGE=90;
// A flash at its strike: returned (a pulse on time near the strike), dodged (without sound, away from its aim) or not.
// pulses: [{at, beat}] of this frame, at: the game clock when the pulse was heard.
export function flashReturned(flash,pulses){for(const w of pulses||[])if(w.beat&&Math.abs((w.at??0)-flash.strike)<=RETURN_WINDOW)return true;return false;}
export const flashDodged=(flash,p)=>Math.hypot(p.x-flash.aim.x,p.y-flash.aim.y)>=DODGE;
// The run: one more, or back to zero; the best kept.
export const runStep=(run,ok)=>{const cur=ok?(run.cur|0)+1:0;return {cur,best:Math.max(run.best|0,cur)};};
// A volley with a run of PULSAR_PAY_MIN or more pays once a day per pulsar, like a medium living encounter (15 ✦ from
// 30 km: base 5 × 1.5 × 2 for the distance).
export const pulsarReward=({x=0,y=0}={})=>universeReward(UNIVERSE_BASE.live,{difficulty:DIFFICULTY.medium,x,y});
// ---------- the layered asteroid ----------
export const LAYER_COLORS=Object.freeze(['#8a8f99','#b58a5a','#9a5b4b','#7fa8c9','#7d9a6a','#8c7aa8']);
export const CORES=Object.freeze(['Núcleo de hierro','Núcleo de hielo','Núcleo de cuarzo','Núcleo de ámbar','Núcleo de obsidiana','Núcleo de ópalo','Núcleo de estrella']);
export const CORE_COLORS=Object.freeze(['#c9c9cf','#cfe8ff','#f4f4f4','#f0b860','#5a5470','#e6d8f0','#ffffff']);
export const DIG_REACH=280;
// Its layers, outermost first (3–5, each its colour, the deeper ones harder) and its core.
export function rockLayers(s){const n=3+Math.min(2,Math.floor(hashKey(`capas:n:v1:${s.id}`)*3)),start=Math.floor(hashKey(`capas:c:v1:${s.id}`)*LAYER_COLORS.length),out=[];
 for(let k=0;k<n;k++)out.push({k,color:LAYER_COLORS[(start+k*(1+Math.floor(hashKey(`capas:s:v1:${s.id}`)*2)))%LAYER_COLORS.length],hits:2+(k>=2?1:0)});
 const core=Math.min(CORES.length-1,Math.floor(hashKey(`capas:core:v1:${s.id}`)*CORES.length));return {layers:out,core,name:CORES[core],color:CORE_COLORS[core]};}
// A pulse on the asteroid: one blow (two on time). Returns the new progress {l, h} and what broke: 'layer', 'core' or null.
export function dig(progress,plan,onTime){let l=progress.l|0,h=(progress.h|0)+(onTime?2:1),broke=null;if(l>=plan.layers.length)return {l,h:0,broke:null};
 if(h>=plan.layers[l].hits){l++;h=0;broke=l>=plan.layers.length?'core':'layer';}return {l,h,broke};}
// A core reached pays like a sky figure of medium difficulty (12 ✦ from 35 km).
export const coreReward=({x=0,y=0}={})=>universeReward(UNIVERSE_BASE.sky,{difficulty:DIFFICULTY.medium,x,y});
// ---------- the zip line of light ----------
// Between two buoys of 40 km or more that you stepped on, the one you just left and the one you stand on, at most
// ZIP_MAX apart: a pulse at the buoy lays the line. A pulse at a buoy with a line rides it to the other end.
export const ZIP_AT=150,ZIP_MAX=60000,ZIP_SPEED=8000,ZIP_MIN_S=1.2,ZIP_MAX_S=4.5,ZIP_KEEP=80,BUOYS_KEEP=400,ZIP_REST=300,ZIP_SETTLE=1.2;
export const zipId=(a,b)=>[a,b].sort().join('|');
export const zipBuoyOk=b=>!!b&&b.km>=ZIP_FROM_KM;
export function canLay(q,world,from,to){if(!zipBuoyOk(from)||!zipBuoyOk(to)||from.id===to.id)return false;const k=w=>world+'|'+w.id;
 if(!q?.buoys?.includes(k(from))||!q.buoys.includes(k(to)))return false;if(Math.hypot(from.x-to.x,from.y-to.y)>ZIP_MAX)return false;return !q.lines.some(l=>l.w===world&&l.id===zipId(from.id,to.id));}
// The lines from a buoy, the newest first.
export const linesAt=(q,world,id)=>(q?.lines||[]).filter(l=>l.w===world&&(l.a.id===id||l.b.id===id)).reverse();
export const zipOther=(line,id)=>line.a.id===id?line.b:line.a;
export const zipSeconds=d=>Math.max(ZIP_MIN_S,Math.min(ZIP_MAX_S,d/ZIP_SPEED));
// Where the ride is at k (0–1): eased in and out along the line.
export const zipPoint=(from,to,k)=>{const t=Math.max(0,Math.min(1,k)),e=t*t*(3-2*t);return {x:from.x+(to.x-from.x)*e,y:from.y+(to.y-from.y)*e};};
// ---------- the sea of dust ----------
// A ring of rocks round the middle of the patch, too close together for the cube to pass on the surface; under the
// dust it passes below them. The middle sometimes keeps something hidden, seen only from under the dust.
export const DUST_ROCKS=14,DUST_RING=200,DUST_ROCK_R=40,CUBE_R=6,HIDDEN_SHARE=.6,HIDDEN_FIND=150,DUST_CUTOFF=1200,DUST_TAU=.25;
export const HIDDEN=Object.freeze(['Fósil de estrella','Campana de polvo','Llave de cometa','Semilla de luz','Caracola de polvo','Reloj de arena','Eco dormido']);
export function dustRocks(s){const a0=hashKey(`polvo:a:v1:${s.id}`)*TAU,out=[];for(let k=0;k<DUST_ROCKS;k++){const a=a0+k/DUST_ROCKS*TAU;out.push({k,x:s.x+Math.cos(a)*DUST_RING,y:s.y+Math.sin(a)*DUST_RING});}return out;}
export const dustHidden=s=>s.u<HIDDEN_SHARE?{x:s.x,y:s.y,name:HIDDEN[Math.min(HIDDEN.length-1,Math.floor(hashKey(`polvo:h:v1:${s.id}`)*HIDDEN.length))]}:null;
// On the surface the ring of rocks stops the cube: a wall as thick as a rock, crossed by nothing. The cube stays on the
// side it came from (prev: where it was the frame before; from inside the wall itself, the nearer side). Returns the
// point (the same if free).
export const DUST_WALL=DUST_ROCK_R+CUBE_R;
export function ringWall(p,prev,s){const r=Math.hypot(p.x-s.x,p.y-s.y);if(Math.abs(r-DUST_RING)>=DUST_WALL)return p;const pr=prev?Math.hypot(prev.x-s.x,prev.y-s.y):r,
 inside=Math.abs(pr-DUST_RING)>=DUST_WALL?pr<DUST_RING:r<DUST_RING,to=inside?DUST_RING-DUST_WALL:DUST_RING+DUST_WALL,ux=r>1e-6?(p.x-s.x)/r:1,uy=r>1e-6?(p.y-s.y)/r:0;return {x:s.x+ux*to,y:s.y+uy*to};}
// A hidden thing found pays like a sky figure of medium difficulty (12 ✦ from 45 km), once per patch.
export const hiddenReward=({x=0,y=0}={})=>universeReward(UNIVERSE_BASE.sky,{difficulty:DIFFICULTY.medium,x,y});
// ---------- the kit of tools ----------
export const TOOLS=Object.freeze(['red','iman','cana']);
export const TOOL_NAMES=Object.freeze({red:'Red',iman:'Imán',cana:'Caña'});
export const TOOL_LINES=Object.freeze({red:'Abre los bancos de luz.',iman:'Abre la chatarra de satélite.',cana:'Abre los pozos de estrellas.'});
export const POINT_DEFS=Object.freeze({banco:{tool:'red',name:'Banco de luz',need:'Hace falta una red.'},chatarra:{tool:'iman',name:'Chatarra de satélite',need:'Hace falta un imán.'},pozo:{tool:'cana',name:'Pozo de estrellas',need:'Hace falta una caña.'}});
export const CACHE_TOUCH=150,CACHE_PULSE=300,POINT_TOUCH=150,POINT_PULSE=300,POINT_READ=320;
// The next tool a box gives: the first one missing (the net, then the magnet, then the rod); none with the three.
export const nextTool=q=>TOOLS.find(t=>!q?.tools?.[t])||null;
// A point gathered with its tool pays a little, like an easy sky figure (12 ✦ from 50 km), once a day per point.
export const pointReward=({x=0,y=0}={})=>universeReward(UNIVERSE_BASE.sky,{difficulty:DIFFICULTY.easy,x,y});
// ---------- the save: S.viajeC ----------
// version 1: pulsars (id → the day it paid), volleys {n, best, returned}, rocks (id → {l, h}: layers broken and blows in
// the next; kept unfinished), cores (id → core index, the asteroids dug out), buoys (world|id of the buoys of 40 km or
// more you stepped on), lines (the zip lines laid: id, w, a, b, day), rides, dust (patch id → the day its hidden thing
// was found), sinks, tools (tool → the day found), caches (box id → day), points (point id → the day it paid), gathered
// (kind → count), earned (all sparks of the batch). Unknown fields are kept; a later version is left untouched.
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const count=v=>Number.isSafeInteger(v)&&v>0?Math.min(v,1e9):0;
const dayKey=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:'';
const safeId=k=>typeof k==='string'&&k.length>0&&k.length<=96&&!['__proto__','constructor','prototype'].includes(k);
const finite=v=>Number.isFinite(v)&&Math.abs(v)<1e12;
export const KEEP=300;
const days=raw=>{const out={};for(const [k,v] of Object.entries(plain(raw)?raw:{}).slice(-KEEP))if(safeId(k))out[k]=dayKey(v);return out;};
const end=e=>plain(e)&&safeId(e.id)&&finite(e.x)&&finite(e.y)?{id:e.id,x:Math.round(e.x),y:Math.round(e.y),km:Number.isFinite(e.km)?Math.round(e.km*10)/10:0}:null;
export const viajeCReadOnly=q=>plain(q)&&Number.isInteger(q.version)&&q.version>VIAJE_C_VERSION;
export function normalizeViajeC(raw){
 if(viajeCReadOnly(raw))return raw;const q=plain(raw)?raw:{},v=plain(q.volleys)?q.volleys:{};
 const rocks={};for(const [k,e] of Object.entries(plain(q.rocks)?q.rocks:{}).slice(-KEEP))if(safeId(k)&&plain(e))rocks[k]={l:Math.min(5,count(e.l)),h:Math.min(9,count(e.h))};
 const cores={};for(const [k,e] of Object.entries(plain(q.cores)?q.cores:{}).slice(-KEEP))if(safeId(k)&&Number.isInteger(e)&&e>=0&&e<CORES.length)cores[k]=e;
 const seen=new Set(),lines=[];for(const l of Array.isArray(q.lines)?q.lines:[]){if(!plain(l)||!safeId(l.id)||typeof l.w!=='string')continue;const a=end(l.a),b=end(l.b);if(!a||!b||l.id!==zipId(a.id,b.id))continue;const key=l.w+'|'+l.id;if(seen.has(key))continue;seen.add(key);lines.push({...l,w:l.w.slice(0,40),a,b,day:dayKey(l.day)});}
 const tools={};for(const t of TOOLS)if(plain(q.tools)&&typeof q.tools[t]==='string')tools[t]=dayKey(q.tools[t])||'—';
 const gathered={};for(const k of POINT_KINDS)gathered[k]=count(plain(q.gathered)?q.gathered[k]:0);
 return {...q,version:VIAJE_C_VERSION,pulsars:days(q.pulsars),volleys:{...v,n:count(v.n),best:count(v.best),returned:count(v.returned)},rocks,cores,
  buoys:[...new Set((Array.isArray(q.buoys)?q.buoys:[]).filter(k=>typeof k==='string'&&k.length<=140))].slice(-BUOYS_KEEP),lines:lines.slice(-ZIP_KEEP),rides:count(q.rides),
  dust:days(q.dust),sinks:count(q.sinks),tools,caches:days(q.caches),points:days(q.points),gathered,earned:count(q.earned)};}
const writable=q=>plain(q)&&q.version===VIAJE_C_VERSION;
const trim=(o,max=KEEP)=>{const k=Object.keys(o);for(let i=0;i<k.length-max;i++)delete o[k[i]];};
// A volley ended: counted; a run of PULSAR_PAY_MIN or more pays once a day per pulsar. Returns {pays}.
export function noteVolley(q,id,run,returned,day){if(!writable(q))return null;q.volleys.n++;q.volleys.returned+=returned|0;q.volleys.best=Math.max(q.volleys.best,run|0);
 const pays=(run|0)>=PULSAR_PAY_MIN&&!!day&&q.pulsars[id]!==day;if(pays){q.pulsars[id]=day;trim(q.pulsars);}return {pays};}
// A layer of an asteroid broken (l: how many are broken now): kept, so an asteroid left half dug stays so; the last one
// reaches the core and the asteroid is dug out. Returns 'layer', 'core' or null. (The blows inside a layer are not saved.)
export function noteLayer(q,s,plan,l){if(!writable(q)||Object.hasOwn(q.cores,s.id)||!(l>(q.rocks[s.id]?.l|0)))return null;
 if(l>=plan.layers.length){delete q.rocks[s.id];q.cores[s.id]=plan.core;trim(q.cores);return 'core';}q.rocks[s.id]={l,h:0};trim(q.rocks);return 'layer';}
export const coreCount=q=>Object.keys(q?.cores||{}).length;
export const coreKinds=q=>new Set(Object.values(q?.cores||{})).size;
// A buoy of 40 km or more stepped on: kept (the oldest go first). Returns whether it is new.
export function noteZipBuoy(q,world,b){if(!writable(q)||!zipBuoyOk(b))return false;const k=world+'|'+b.id,had=q.buoys.includes(k);if(had)q.buoys.splice(q.buoys.indexOf(k),1);q.buoys.push(k);if(q.buoys.length>BUOYS_KEEP)q.buoys.splice(0,q.buoys.length-BUOYS_KEEP);return !had;}
export function layLine(q,world,from,to,day){if(!writable(q)||!canLay(q,world,from,to))return null;const pin=b=>({id:b.id,x:Math.round(b.x),y:Math.round(b.y),km:b.km});
 const line={id:zipId(from.id,to.id),w:world,a:pin(from),b:pin(to),day};q.lines.push(line);if(q.lines.length>ZIP_KEEP)q.lines.splice(0,q.lines.length-ZIP_KEEP);return line;}
export function noteHidden(q,id,day){if(!writable(q)||Object.hasOwn(q.dust,id))return null;q.dust[id]=day||'—';trim(q.dust);return true;}
export function takeTool(q,cacheId,day){if(!writable(q))return null;const t=nextTool(q);if(!t||Object.hasOwn(q.caches,cacheId))return null;q.tools[t]=day||'—';q.caches[cacheId]=day;trim(q.caches);return t;}
export const pointPaysToday=(q,id,day)=>!!day&&q?.points?.[id]!==day;
export function notePoint(q,s,day){if(!writable(q)||!pointPaysToday(q,s.id,day))return null;q.points[s.id]=day;trim(q.points);q.gathered[s.kind]=(q.gathered[s.kind]|0)+1;return true;}
// ---------- sound ----------
// Notes of the chord that sounds or the place's scale, far under the music, through the voices and measured trims of the
// album of sounds: a flash sent back (one note of the chord, climbing with the run), a layer broken (one note, lower as
// you go deeper), a core (three), a line laid or ridden (two), surfacing from the dust (one), a hidden thing (three), a
// tool (three) and a point gathered (two). Under the dust, the output's comfort filter is held dark (DUST_CUTOFF).
export const PULSAR_INSTRUMENT='fmglass',ROCK_INSTRUMENT='kalimba',ZIP_INSTRUMENT='fmglass',DUST_INSTRUMENT='kalimba',KIT_INSTRUMENT='kalimba';
export const PULSAR_GAIN=.018,ROCK_GAIN=.02,ZIP_GAIN=.012,DUST_GAIN=.016,KIT_GAIN=.018;
export const layerDegree=k=>[7,4,2,0,-3][Math.max(0,Math.min(4,k|0))];
export const CORE_DEGREES=Object.freeze([0,4,7]),ZIP_DEGREES=Object.freeze([4,9]),FIND_DEGREES=Object.freeze([0,2,7]),POINT_DEGREES=Object.freeze([2,4]);
export {UNITS_PER_KM};
