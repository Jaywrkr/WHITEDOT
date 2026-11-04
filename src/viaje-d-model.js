// Viaje lejos, tanda D (Jay, 4 Nov 2026, alpha.252; docs/MUNDO.md#tanda-d-60-km-o-más): the last band, 60 km and more
// from the origin, what only the ones who go farthest find. The rules, with no page, canvas or sound. Each thing starts at
// its distance and keeps appearing beyond it (bandas-model.js):
// · Portal de otra regla (60 km): for two minutes the cube moves by another rule (an orbit round a point, bounces, ice)
//   and six lights wait inside; leaving, the time or the six lights end it and everything is as before.
// · Estación del día (65 km): an orbital station where, room by room, you choose the next among three (a small challenge
//   or a small prize); it is made again every real day (the date and hashKey).
// · Barrido a tempo (70 km, inside the rest satellites): a grid of blocks in two tones; a line crosses it on the beat and
//   clears the 2×2 squares of one tone. 90 s, a score and a record.
// · Herencia (80 km): a nest where your pet can have a young one that inherits its colour, its notes and its rhythm, with
//   rare combinations. It travels with you only if you choose it.
// · Eclipse que cambia (90 km): an eclipse of secretos-cielo.js out here, while it lasts, brings an encounter of its own
//   (the corona's lights) and changes a verb: the pulse leaves a trail that catches too.
// Small and repeatable pays by the universe's rule (universeReward, easy: 15 ✦ out here), once a day per thing; the young
// ones pay nothing (their page and their place in the Refugio are the prize). Nothing here draws a random number: every
// place comes from hashKey and nothing on the map moves.
import {hashKey} from './universe-regions.js';
import {UNIVERSE_BASE,DIFFICULTY,universeReward} from './spark-rules.js';
import {registerBand,bandSiteAt,bandSites,UNITS_PER_KM} from './bandas-model.js';
import {PET_SPECIES,normalizePet} from './pet-model.js';
export const VIAJE_D_VERSION=1;
const TAU=Math.PI*2;
// ---------- the band: what starts where ----------
export const BAND_D=Object.freeze([
 registerBand({id:'portal-regla',km:60,name:'Portales de otra regla',notice:'Aquí empiezan los portales de otra regla.',batch:'D'}),
 registerBand({id:'estacion',km:65,name:'Estación del día',notice:'Aquí empieza la estación del día.',batch:'D'}),
 registerBand({id:'barrido',km:70,name:'Barrido a tempo',notice:'Aquí los satélites tienen un barrido a tempo.',batch:'D'}),
 registerBand({id:'herencia',km:80,name:'Nidos de crías',notice:'Aquí empiezan los nidos de crías.',batch:'D'}),
 registerBand({id:'eclipse-regla',km:90,name:'Eclipses que cambian',notice:'Aquí los eclipses cambian las reglas.',batch:'D'}),
]);
// ---------- sites (cells of hashKey; a site under its band does not exist) ----------
// About one portal every 4 km², one station every 7 km², one nest every 6 km²: walking with the marks at the edge
// (EDGE_REACH), a portal every two minutes or so.
export const PORTAL=Object.freeze({cell:14000,share:.5,fromKm:60,margin:.25});
export const STATION=Object.freeze({cell:18000,share:.45,fromKm:65,margin:.25});
export const NEST=Object.freeze({cell:16000,share:.45,fromKm:80,margin:.25});
export const SWEEP_FROM_KM=70,ECLIPSE_FROM_KM=90,EDGE_REACH=4000;
export const portalAt=(world,i,j)=>bandSiteAt('portal-regla',i,j,{...PORTAL,world});
export const stationAt=(world,i,j)=>bandSiteAt('estacion',i,j,{...STATION,world});
export const nestAt=(world,i,j)=>bandSiteAt('nido',i,j,{...NEST,world});
export const portalsNear=(world,p,reach)=>bandSites('portal-regla',p,reach,{...PORTAL,world});
export const stationsNear=(world,p,reach)=>bandSites('estacion',p,reach,{...STATION,world});
export const nestsNear=(world,p,reach)=>bandSites('nido',p,reach,{...NEST,world});
// ---------- the portal of another rule ----------
export const PORTAL_TOUCH=120,PORTAL_SECONDS=120,PORTAL_LEAVE=700,PORTAL_REST=600;
export const RULES=Object.freeze(['orbita','rebote','hielo']);
export const RULE_NAMES=Object.freeze({orbita:'Órbita',rebote:'Rebote',hielo:'Hielo'});
export const portalRule=s=>RULES[Math.min(RULES.length-1,Math.floor((s?.u||0)*RULES.length))];
export const LIGHTS=6,LIGHT_TOUCH=60,LIGHT_PULSE=140,BUMPERS=5,BUMPER_R=26,CUBE_R=6;
// The six lights round a portal, 6–34 m from it (in the orbit, at the radii the cube can reach).
export function portalLights(s){const out=[];for(let k=0;k<LIGHTS;k++){const a=(k+hashKey(`regla:la:v1:${s.id}:${k}`)*.7)/LIGHTS*TAU,rad=Math.round(60+280*hashKey(`regla:lr:v1:${s.id}:${k}`));out.push({k,x:Math.round(s.x+Math.cos(a)*rad),y:Math.round(s.y+Math.sin(a)*rad)});}return out;}
// The bumpers of a bouncing portal: five round posts 12–32 m from it, never on a light.
export function portalBumpers(s){const lights=portalLights(s),out=[];for(let k=0;k<BUMPERS*10&&out.length<BUMPERS;k++){const a=hashKey(`regla:ba:v1:${s.id}:${k}`)*TAU,rad=120+200*hashKey(`regla:br:v1:${s.id}:${k}`),b={k:out.length,x:Math.round(s.x+Math.cos(a)*rad),y:Math.round(s.y+Math.sin(a)*rad)};
 if(lights.some(l=>Math.hypot(l.x-b.x,l.y-b.y)<BUMPER_R+LIGHT_TOUCH+20)||out.some(o=>Math.hypot(o.x-b.x,o.y-b.y)<BUMPER_R*3))continue;out.push(b);}return out;}
// A light done: passing through it, or any pulse near it.
export function portalLightDone(l,p,pulses){if(Math.hypot(l.x-p.x,l.y-p.y)<=LIGHT_TOUCH)return true;return (pulses||[]).some(w=>Math.hypot(l.x-w.x,l.y-w.y)<=LIGHT_PULSE);}
// The motion of each rule. rule: {kind, cx, cy, vx, vy, a, rad, bumpers}. input: the stick or the keys (dx, dy; their
// length at most 1); speed: the World's walking speed. Returns where the cube is after dt and whether it bounced.
export const ICE_ACCEL=2,ICE_FRICTION=.45,ICE_MAX=1.3,BOUNCE_ACCEL=3,BOUNCE_FRICTION=.9,BOUNCE_MAX=1.5,BOUNCE_KICK=1.15,ORBIT_OMEGA=.5,ORBIT_MIN=40,ORBIT_RADIAL=.5;
export function newRule(kind,s,p){const rad=Math.max(ORBIT_MIN,Math.hypot(p.x-s.x,p.y-s.y)),a=Math.atan2(p.y-s.y,p.x-s.x);return {kind,cx:s.x,cy:s.y,vx:0,vy:0,a,rad,bumpers:kind==='rebote'?portalBumpers(s):[]};}
export function ruleStep(rule,p,{dx=0,dy=0}={},dt=0,speed=190){dt=Math.max(0,Math.min(.1,Number(dt)||0));let ix=Number(dx)||0,iy=Number(dy)||0;const len=Math.hypot(ix,iy);if(len>1){ix/=len;iy/=len;}
 // The orbit goes on from where the cube is (a jump of the World, a door, is respected): its angle and radius from it.
 if(rule.kind==='orbita'){const ox=p.x-rule.cx,oy=p.y-rule.cy;if(Math.hypot(ox,oy)>1e-6){rule.a=Math.atan2(oy,ox);rule.rad=Math.max(ORBIT_MIN,Math.hypot(ox,oy));}const ux=Math.cos(rule.a),uy=Math.sin(rule.a),radial=ix*ux+iy*uy,tangent=-ix*uy+iy*ux;
  rule.rad=Math.max(ORBIT_MIN,rule.rad+radial*speed*ORBIT_RADIAL*dt);rule.a+=(ORBIT_OMEGA+tangent*speed*.5/rule.rad)*dt;return {x:rule.cx+Math.cos(rule.a)*rule.rad,y:rule.cy+Math.sin(rule.a)*rule.rad,bounced:null};}
 const ice=rule.kind==='hielo',accel=(ice?ICE_ACCEL:BOUNCE_ACCEL)*speed,f=Math.exp(-(ice?ICE_FRICTION:BOUNCE_FRICTION)*dt),max=(ice?ICE_MAX:BOUNCE_MAX)*speed;
 rule.vx=(rule.vx+ix*accel*dt)*f;rule.vy=(rule.vy+iy*accel*dt)*f;const v=Math.hypot(rule.vx,rule.vy);if(v>max){rule.vx*=max/v;rule.vy*=max/v;}
 let x=p.x+rule.vx*dt,y=p.y+rule.vy*dt,bounced=null;
 for(const b of rule.bumpers||[]){const ox=x-b.x,oy=y-b.y,d=Math.hypot(ox,oy),min=BUMPER_R+CUBE_R;if(d>=min||d<1e-6)continue;const nx=ox/d,ny=oy/d,dot=rule.vx*nx+rule.vy*ny;x=b.x+nx*min;y=b.y+ny*min;
  if(dot<0){rule.vx-=2*dot*nx;rule.vy-=2*dot*ny;const w=Math.hypot(rule.vx,rule.vy),k=Math.min(max,Math.max(speed*.8,w*BOUNCE_KICK))/Math.max(w,1e-6);rule.vx*=k;rule.vy*=k;bounced=b;}}
 return {x,y,bounced};}
// The share of the six lights pays like an easy living encounter: 15 ✦ out here (×3 from 50 km), once a day per portal.
export const portalReward=(done,{x=0,y=0}={})=>done>0?universeReward(UNIVERSE_BASE.live*Math.min(1,done/LIGHTS),{difficulty:DIFFICULTY.easy,x,y}):0;
// ---------- the station of the day ----------
export const STATION_TOUCH=140,STATION_REST=600,STATION_DEPTH=5,STATION_FULL=3;
export const ROOMS=Object.freeze({
 compas:Object.freeze({kind:'reto',name:'Sala del compás',text:'Toca «Ahora» cuando se encienda la cuarta luz. Tres veces.'}),
 memoria:Object.freeze({kind:'reto',name:'Sala de memoria',text:'Mira el orden de las luces y repítelo.'}),
 rapida:Object.freeze({kind:'reto',name:'Sala de luces',text:'Toca cada luz antes de que se apague. Tres de cinco.'}),
 mirador:Object.freeze({kind:'premio',name:'Mirador',text:'Desde aquí se ve el universo entero. Un sello.'}),
 jardin:Object.freeze({kind:'premio',name:'Jardín orbital',text:'Algo crece sin tierra. Un sello.'}),
 archivo:Object.freeze({kind:'premio',name:'Archivo',text:'Una página guardada para ti. Un sello.'}),
});
const RETO_ROOMS=Object.freeze(['compas','memoria','rapida']),PRIZE_ROOMS=Object.freeze(['mirador','jardin','archivo']);
export const stationSeed=(world,day)=>`estacion:v1:${world}:${day}`;
const pick=(list,u)=>list[Math.min(list.length-1,Math.floor(u*list.length))];
// The three doors at a step: one challenge, one prize and one of either, in an order of their own. They depend on the
// day and on the rooms already chosen (the path), so each choice changes what comes next; the same day, the same doors.
export function stationOffer(world,day,step,path=[]){const k=`${stationSeed(world,day)}:${step}:${path.join(',')}`,reto=pick(RETO_ROOMS,hashKey(k+':r')),prize=pick(PRIZE_ROOMS,hashKey(k+':p'));
 const rest=[...RETO_ROOMS,...PRIZE_ROOMS].filter(t=>t!==reto&&t!==prize),third=pick(rest,hashKey(k+':t'));
 const doors=[reto,prize,third].map((type,i)=>({type,order:hashKey(`${k}:o:${i}`),seed:`${k}:${type}`}));return doors.sort((a,b)=>a.order-b.order).map(({type,seed})=>({type,seed,...ROOMS[type]}));}
// The challenges of the rooms, from the room's seed: an order of four lights (three or four long), five lights of nine.
export const memorySequence=seed=>{const n=hashKey(seed+':n')<.5?3:4,out=[];for(let i=0;i<n;i++){let c=Math.floor(hashKey(`${seed}:m:${i}`)*4)%4;if(out.length&&c===out.at(-1))c=(c+1)%4;out.push(c);}return out;};
export const RAPID_COUNT=5,RAPID_NEED=3,RAPID_SECONDS=1.4,COMPAS_NEED=3,COMPAS_TRIES=8;
export const rapidSequence=seed=>{const out=[];for(let i=0;i<RAPID_COUNT;i++){let c=Math.floor(hashKey(`${seed}:q:${i}`)*9)%9;if(out.length&&c===out.at(-1))c=(c+4)%9;out.push(c);}return out;};
// The station's sparks: by the challenges won (three for all of it), once a day.
export const stationReward=(won,{x=0,y=0}={})=>won>0?universeReward(UNIVERSE_BASE.live*Math.min(1,won/STATION_FULL),{difficulty:DIFFICULTY.easy,x,y}):0;
// ---------- the sweep on the beat ----------
export const SWEEP_COLS=10,SWEEP_ROWS=8,SWEEP_SECONDS=90,SWEEP_PAY=16,CONSOLE_OFF=90,CONSOLE_TOUCH=60,CONSOLE_REST=400;
export const consoleFor=(world,sat)=>{const a=hashKey(`barrido:v1:${world}:${sat.id}`)*TAU;return {id:'barrido:'+sat.id,sat:sat.id,km:sat.km,x:Math.round(sat.x+Math.cos(a)*CONSOLE_OFF),y:Math.round(sat.y+Math.sin(a)*CONSOLE_OFF)};};
export const emptyGrid=()=>Array.from({length:SWEEP_ROWS},()=>Array(SWEEP_COLS).fill(0));
// A piece: 2×2 cells of the two tones (1, 2): [top left, top right, bottom left, bottom right]. Never all of one tone in
// a row of three pieces, so a square is always to be made and never given.
export function sweepPiece(seed,n){const c=[0,1,2,3].map(i=>hashKey(`${seed}:p:${n}:${i}`)<.5?1:2);return {x:Math.floor(SWEEP_COLS/2)-1,y:0,cells:c};}
export const rotatePiece=p=>({...p,cells:[p.cells[2],p.cells[0],p.cells[3],p.cells[1]]});
const cellsOf=p=>[[0,0,p.cells[0]],[1,0,p.cells[1]],[0,1,p.cells[2]],[1,1,p.cells[3]]];
export function fits(grid,p){for(const [dx,dy] of cellsOf(p)){const x=p.x+dx,y=p.y+dy;if(x<0||x>=SWEEP_COLS||y>=SWEEP_ROWS)return false;if(y>=0&&grid[y][x])return false;}return true;}
// Each column falls on its own (as the blocks do): the cells settle down to the floor or the cells under them.
export function settle(grid){for(let x=0;x<SWEEP_COLS;x++){const col=[];for(let y=SWEEP_ROWS-1;y>=0;y--)if(grid[y][x])col.push(grid[y][x]);for(let y=SWEEP_ROWS-1,k=0;y>=0;y--,k++)grid[y][x]=col[k]||0;}return grid;}
// The piece placed: its cells in the grid, then each column settles. Returns false if it does not fit (the grid is full).
export function lockPiece(grid,p){if(!fits(grid,p))return false;for(const [dx,dy,c] of cellsOf(p))if(p.y+dy>=0)grid[p.y+dy][p.x+dx]=c;settle(grid);return true;}
// The cells that belong to any 2×2 square of one tone.
export function markSquares(grid){const m=emptyGrid();for(let y=0;y<SWEEP_ROWS-1;y++)for(let x=0;x<SWEEP_COLS-1;x++){const c=grid[y][x];if(c&&grid[y][x+1]===c&&grid[y+1][x]===c&&grid[y+1][x+1]===c)m[y][x]=m[y][x+1]=m[y+1][x]=m[y+1][x+1]=1;}return m;}
// The line at a column: the marked cells there are doomed; when the line reaches a column with none (or leaves the grid),
// every doomed cell is cleared at once and the columns settle. sweep: {doomed: Set of "x,y"}. Returns the cells cleared.
export function sweepStep(grid,sweep,col){const m=markSquares(grid);let any=false;if(col>=0&&col<SWEEP_COLS)for(let y=0;y<SWEEP_ROWS;y++)if(m[y][col]&&grid[y][col]){sweep.doomed.add(col+','+y);any=true;}
 if(any&&col<SWEEP_COLS-1)return 0;let n=0;for(const k of sweep.doomed){const [x,y]=k.split(',').map(Number);if(grid[y][x]){grid[y][x]=0;n++;}}sweep.doomed.clear();if(n)settle(grid);return n;}
// Once a day for the sweep (in any satellite), from SWEEP_PAY cells cleared, like an easy living encounter.
export const sweepReward=({x=0,y=0}={})=>universeReward(UNIVERSE_BASE.live,{difficulty:DIFFICULTY.easy,x,y});
// ---------- the nests and the young ones ----------
export const NEST_TOUCH=120,NEST_READ=400,BROOD_MAX=12;
export const NOTE_NAMES=Object.freeze(['Do','Re','Mi','Fa','Sol','La','Si']);
export const RARE_NAMES=Object.freeze({cruce:'Cruce',eco:'Eco doble'});
const SPECIES=Object.keys(PET_SPECIES);
// A young one of a pet, from the nest and the parent: the same kind (a rare «cruce», another kind), a colour near the
// parent's (its hue is the seed's remainder, as pet.js draws it), the parent's notes with one changed by a step, the
// parent's rhythm with one beat moved by a sixteenth (a rare «eco doble», the phrase twice). Nothing random.
export function inheritPet(parent,key){const p=normalizePet(parent);if(!p)return null;const h=k=>hashKey(`cria:v1:${key}:${p.seed}:${k}`);
 const rare=h('rare')<.07?'cruce':h('rare')<.14?'eco':'',species=rare==='cruce'?SPECIES.filter(s=>s!==p.species)[Math.floor(h('sp')*(SPECIES.length-1))%(SPECIES.length-1)]:p.species;
 const hue=Math.max(0,Math.min(44,p.seed%45+Math.round((h('hue')-.5)*12)));
 const base=(p.phrase.length?p.phrase:[{degree:0,step:0},{degree:2,step:4},{degree:4,step:8}]).slice(0,3);while(base.length<3)base.push({degree:(base.at(-1).degree+2)%7,step:Math.min(15,base.at(-1).step+4)});
 const change=Math.floor(h('n')*3)%3,move=Math.floor(h('r')*3)%3;
 const notes=base.map((n,i)=>i===change?((n.degree+(h('d')<.5?1:6))%7):n.degree);
 let rhythm=base.map((n,i)=>Math.max(0,Math.min(15,n.step+(i===move?(h('s')<.5?-1:1):0))));rhythm=rhythm.map((s,i)=>i&&s<=rhythm[i-1]?Math.min(15,rhythm[i-1]+1):s);
 const seed=(Math.floor(h('seed')*67108864)*45+hue)>>>0;
 return {species,seed,hue,notes,rhythm,rare,from:p.species};}
// What travels: a pet as pet.js keeps it (pet-model.js normalizePet), the notes on its rhythm (twice for «eco doble»).
export function criaPet(c){const one=c.notes.map((d,i)=>({degree:d,step:c.rhythm[i]}));const phrase=c.rare==='eco'?[...one,...one.map(n=>({degree:n.degree,step:Math.min(15,n.step+8)}))]:one;
 return normalizePet({species:c.species,seed:c.seed,seconds:0,places:[],phrase});}
export const criaName=c=>`${PET_SPECIES[c.species]?.name||'Cría'} · cría`;
export const notesText=c=>c.notes.map(d=>NOTE_NAMES[((d%7)+7)%7]).join(' ');
export const rhythmText=c=>{const on=new Set(c.rhythm);return Array.from({length:16},(_,i)=>on.has(i)?'x':'·').join('');};
// ---------- the eclipse that changes ----------
export const CORONA=6,CORONA_TOUCH=60,CORONA_PULSE=120,TRAIL_SECONDS=1.6,TRAIL_EVERY=.08,TRAIL_TOUCH=55,TRAIL_LIFE=2.2;
// The corona's lights: six round the eclipse's star, 15–45 m from it, turning slowly; where each is at `age` seconds.
export function coronaPieces(site,cycle){const out=[];for(let k=0;k<CORONA;k++){const key=`corona:v1:${site.id}:${cycle}:${k}`;out.push({k,a0:(k+hashKey(key+':a')*.6)/CORONA*TAU,rad:Math.round(150+300*hashKey(key+':r')),w:(.18+.12*hashKey(key+':w'))*(k%2?-1:1)});}return out;}
export const coronaAt=(site,piece,age)=>({x:site.x+Math.cos(piece.a0+piece.w*age)*piece.rad,y:site.y+Math.sin(piece.a0+piece.w*age)*piece.rad});
// A light of the corona caught: by passing (without sound, as the meteors), by a pulse near it, or by the trail a pulse
// leaves during the eclipse (its points: [{x, y}]).
export function coronaCaught(q,p,pulses,trail,sound){if(!sound&&Math.hypot(q.x-p.x,q.y-p.y)<=CORONA_TOUCH)return true;if((pulses||[]).some(w=>Math.hypot(q.x-w.x,q.y-w.y)<=CORONA_PULSE))return true;return (trail||[]).some(t=>Math.hypot(q.x-t.x,q.y-t.y)<=TRAIL_TOUCH);}
export const coronaReward=(done,{x=0,y=0}={})=>done>0?universeReward(UNIVERSE_BASE.live*Math.min(1,done/CORONA),{difficulty:DIFFICULTY.easy,x,y}):0;
// ---------- the save: S.viajeD ----------
// version 1: portals (id → the day it paid), portal (played, won, sparks), station (today's: day, path, results, step,
// done, paid; or null), seals, stations (completed), sweep (best, plays, the day it paid, sparks), brood (the young ones,
// up to twelve: id, species, seed, hue, notes, rhythm, rare, from, day, pet), nests (id → the day a young one was born),
// travel (null, or the young one travelling and the pet that stays: {id, home}), corona (eclipses, lights, whole ones,
// the first day, id → the day it paid), earned (all sparks of the batch). Unknown fields are kept; a later version is
// left untouched (and never written).
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const count=v=>Number.isSafeInteger(v)&&v>0?Math.min(v,1e9):0;
const dayKey=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:'';
const safeId=k=>typeof k==='string'&&k.length>0&&k.length<=96&&!['__proto__','constructor','prototype'].includes(k);
export const KEEP=300;
const days=raw=>{const out={};for(const [k,v] of Object.entries(plain(raw)?raw:{}).slice(-KEEP))if(safeId(k))out[k]=dayKey(v);return out;};
const ROOM_TYPES=new Set(Object.keys(ROOMS));
function normalizeStation(s){if(!plain(s)||!dayKey(s.day))return null;const path=(Array.isArray(s.path)?s.path:[]).filter(t=>ROOM_TYPES.has(t)).slice(0,STATION_DEPTH);
 const results=(Array.isArray(s.results)?s.results:[]).slice(0,path.length).map(v=>v===true||v==='premio'?v:false);while(results.length<path.length)results.push(false);
 return {...s,day:s.day,path,results,done:path.length>=STATION_DEPTH,paid:dayKey(s.paid)};}
const okNotes=v=>Array.isArray(v)&&v.length===3&&v.every(d=>Number.isInteger(d)&&d>=0&&d<7);
const okRhythm=v=>Array.isArray(v)&&v.length===3&&v.every(s=>Number.isInteger(s)&&s>=0&&s<16);
function normalizeCria(c){if(!plain(c)||!safeId(c.id)||!Object.hasOwn(PET_SPECIES,c.species)||!Number.isInteger(c.seed)||!okNotes(c.notes)||!okRhythm(c.rhythm))return null;
 const pet=c.pet===undefined||c.pet===null?null:normalizePet(c.pet);return {...c,seed:c.seed>>>0,hue:Number.isInteger(c.hue)&&c.hue>=0&&c.hue<45?c.hue:(c.seed>>>0)%45,rare:Object.hasOwn(RARE_NAMES,c.rare)?c.rare:'',from:Object.hasOwn(PET_SPECIES,c.from)?c.from:c.species,day:dayKey(c.day),pet};}
export const viajeDReadOnly=q=>plain(q)&&Number.isInteger(q.version)&&q.version>VIAJE_D_VERSION;
export function normalizeViajeD(raw){
 if(viajeDReadOnly(raw))return raw;const q=plain(raw)?raw:{},portal=plain(q.portal)?q.portal:{},sweep=plain(q.sweep)?q.sweep:{},corona=plain(q.corona)?q.corona:{};
 const seen=new Set(),brood=(Array.isArray(q.brood)?q.brood:[]).map(normalizeCria).filter(c=>c&&!seen.has(c.id)&&seen.add(c.id)).slice(-BROOD_MAX);
 const t=q.travel,home=plain(t)?normalizePet(t.home):null,travel=plain(t)&&safeId(t.id)&&home&&brood.some(c=>c.id===t.id)?{...t,id:t.id,home}:null;
 return {...q,version:VIAJE_D_VERSION,portals:days(q.portals),portal:{...portal,n:count(portal.n),won:count(portal.won),earned:count(portal.earned)},station:normalizeStation(q.station),seals:count(q.seals),stations:count(q.stations),
  sweep:{...sweep,best:count(sweep.best),plays:count(sweep.plays),paid:dayKey(sweep.paid),earned:count(sweep.earned)},brood,nests:days(q.nests),travel,
  corona:{...corona,n:count(corona.n),caught:count(corona.caught),full:count(corona.full),first:dayKey(corona.first),paid:days(corona.paid)},earned:count(q.earned)};}
const writable=q=>plain(q)&&q.version===VIAJE_D_VERSION;
const trim=(o,max=KEEP)=>{const k=Object.keys(o);for(let i=0;i<k.length-max;i++)delete o[k[i]];};
// The portal played: counted; if it paid today, spent for sparks until tomorrow.
export const portalPaysToday=(q,id,day)=>!!day&&q?.portals?.[id]!==day;
export function notePortal(q,id,done,day,paid){if(!writable(q))return null;q.portal.n++;if(done>=LIGHTS)q.portal.won++;if(paid>0){q.portals[id]=day;trim(q.portals);q.portal.earned+=paid;q.earned+=paid;}return {won:done>=LIGHTS};}
// Today's station: the one kept if it is today's; otherwise a new one (yesterday's is left behind, nothing lost: its
// seals are already counted).
export function stationToday(q,day){if(!writable(q)||!day)return null;if(!q.station||q.station.day!==day)q.station={day,path:[],results:[],done:false,paid:''};return q.station;}
// A room chosen and played: its result (true, false or 'premio'); a prize room gives a seal. Returns the station.
export function noteRoom(q,day,type,result){const s=stationToday(q,day);if(!s||s.done||!ROOM_TYPES.has(type))return null;s.path.push(type);const r=ROOMS[type].kind==='premio'?'premio':!!result;s.results.push(r);if(r==='premio')q.seals++;
 if(s.path.length>=STATION_DEPTH){s.done=true;q.stations++;}return s;}
export const stationWon=s=>(s?.results||[]).filter(v=>v===true).length;
export function payStation(q,amount){const s=q?.station;if(!writable(q)||!s||!s.done||s.paid===s.day)return false;s.paid=s.day;q.earned+=amount|0;return true;}
export function noteSweep(q,score,day,paid){if(!writable(q))return null;q.sweep.plays++;const record=score>q.sweep.best;if(record)q.sweep.best=score;if(paid>0){q.sweep.paid=day;q.sweep.earned+=paid;q.earned+=paid;}return {record};}
export const sweepPaysToday=(q,day,score)=>!!day&&score>=SWEEP_PAY&&q?.sweep?.paid!==day;
// A young one born at a nest (once a day per nest; twelve at most, the oldest that is not travelling leaves the list).
export const nestReady=(q,id,day)=>!!day&&q?.nests?.[id]!==day;
export function hatch(q,nest,parent,day){if(!writable(q)||!nestReady(q,nest.id,day))return null;const c=inheritPet(parent,`${nest.id}:${day}`);if(!c)return null;
 const row={id:`cria:${nest.id}:${day}`,...c,day,pet:null};if(q.brood.some(b=>b.id===row.id))return null;q.brood.push(row);
 while(q.brood.length>BROOD_MAX){const k=q.brood.findIndex(b=>b.id!==q.travel?.id);q.brood.splice(k<0?0:k,1);}q.nests[nest.id]=day;trim(q.nests);return row;}
// The player chooses: a young one travels (the pet that stays is kept, whole, as pet.js saved it), or the pet comes back.
// S: the game's state (its pet is S.pet). Returns the pet now travelling, or null.
export function travelWith(q,S,id){if(!writable(q))return null;const c=q.brood.find(b=>b.id===id);const now=normalizePet(S?.pet);if(!c||!now||q.travel?.id===id)return null;
 if(q.travel){const was=q.brood.find(b=>b.id===q.travel.id);if(was)was.pet=now;}else q.travel={id,home:now};q.travel.id=id;S.pet=c.pet?normalizePet(c.pet):criaPet(c);return S.pet;}
export function comeHome(q,S){if(!writable(q)||!q.travel)return null;const was=q.brood.find(b=>b.id===q.travel.id),now=normalizePet(S?.pet);if(was&&now)was.pet=now;S.pet=normalizePet(q.travel.home);q.travel=null;return S.pet;}
export const coronaPaysToday=(q,id,day)=>!!day&&q?.corona?.paid?.[id]!==day;
export function noteCorona(q,id,done,day,paid){if(!writable(q))return null;const first=!q.corona.n;q.corona.n++;q.corona.caught+=done|0;if(done>=CORONA)q.corona.full++;if(!q.corona.first)q.corona.first=day;
 if(paid>0){q.corona.paid[id]=day;trim(q.corona.paid);q.earned+=paid;}return {first};}
// ---------- sound ----------
// Notes of the place's scale or the chord that sounds, far under the music, through the voices and measured trims of the
// album of sounds (playViajeNotes of viaje-a.js): a portal opening (two), a light (one, climbing), a bounce (one of the
// chord), the rule ending (three), a sweep clearing (one per sweep), a young one born (its three notes), a corona's light
// (one, high).
export const PORTAL_INSTRUMENT='fmglass',LIGHT_INSTRUMENT='kalimba',SWEEP_INSTRUMENT='kalimba',CRIA_INSTRUMENT='kalimba',CORONA_INSTRUMENT='fmglass';
export const PORTAL_GAIN=.016,LIGHT_GAIN=.018,BOUNCE_GAIN=.012,SWEEP_GAIN=.012,CRIA_GAIN=.016,CORONA_GAIN=.014;
export const lightDegree=k=>[0,2,4,7,9,11][((k%6)+6)%6];
export const OPEN_DEGREES=Object.freeze([0,7]),END_DEGREES=Object.freeze([0,4,7]);
export {UNITS_PER_KM};
