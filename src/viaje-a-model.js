// Viaje lejos, tanda A (Jay, 4 Nov 2026, alpha.248; docs/MUNDO.md#lo-que-hay-más-lejos): the first band, 0–10 km from
// the origin, what anyone finds first. The rules, with no page, canvas or sound. Each thing starts at its distance and
// keeps appearing beyond it (bandas-model.js):
// · Interruptor de reto (0,5 km): a loose button in the world; touching it starts a 30 s challenge with no menu. Pulses
//   on time in five rings (without sound: passing through them); from 5 km some switches are of lights to gather.
// · Radar de ritmo (1 km): a fixed post that counts your run of pulses on time while you pass, and keeps your record.
// · Pelota de luz (2 km): a ball kicked by the pulse, that bounces singing in the chord, and a goal between two rocks.
// · Bengala (0 km): a light you send up where you stand (Menú › Más); seen from far, heard from its side.
// · Tablón de encargos (10 km, the first rest satellite): three short orders of creatures that use what the universe
//   already has (a rare sound, a buoy, a living encounter or a challenge won).
// Small and repeatable pays by the universe's rule (universeReward): 10–15 ✦ near the origin, once a day per thing.
// Nothing here draws a random number: every place comes from hashKey and nothing on the map moves.
import {hashKey} from './universe-regions.js';
import {UNIVERSE_BASE,DIFFICULTY,universeReward} from './spark-rules.js';
import {registerBand,bandSiteAt,bandSites,UNITS_PER_KM} from './bandas-model.js';
import {buoyAt,nearestBuoy,ringCount} from './recorrer-model.js';
export const VIAJE_A_VERSION=1;
const TAU=Math.PI*2;
// ---------- the band: what starts where ----------
export const BAND_A=Object.freeze([
 registerBand({id:'bengala',km:0,name:'Bengala',hint:'Lánzala desde Menú › Más',batch:'A'}),
 registerBand({id:'interruptor',km:.5,name:'Interruptores de reto',batch:'A'}),
 registerBand({id:'radar',km:1,name:'Radares de ritmo',notice:'Radares de ritmo · Empiezan aquí.',batch:'A'}),
 registerBand({id:'pelota',km:2,name:'Pelotas de luz',notice:'Pelotas de luz · Empiezan aquí.',batch:'A'}),
 registerBand({id:'luces',km:5,name:'Retos de luces',notice:'Retos de luces · Empiezan aquí.',batch:'A'}),
 registerBand({id:'tablon',km:10,name:'Tablones de encargos',notice:'Tablones de encargos · Empiezan aquí.',batch:'A'}),
]);
// ---------- sites (cells of hashKey; a site under its band does not exist) ----------
// About one switch every 0,7 km², one radar every 1,3 km², one ball every 2 km²: walking with the marks at the edge
// (EDGE_REACH), a switch every minute or so, a radar every two, a ball every three.
export const SWITCH=Object.freeze({cell:6000,share:.5,fromKm:.5,margin:.2});
export const RADAR=Object.freeze({cell:8000,share:.5,fromKm:1,margin:.2});
export const BALL=Object.freeze({cell:10000,share:.5,fromKm:2,margin:.25});
export const LIGHTS_FROM_KM=5;
export const switchAt=(world,i,j)=>bandSiteAt('interruptor',i,j,{...SWITCH,world});
export const radarAt=(world,i,j)=>bandSiteAt('radar',i,j,{...RADAR,world});
export const ballAt=(world,i,j)=>bandSiteAt('pelota',i,j,{...BALL,world});
export const switchesNear=(world,p,reach)=>bandSites('interruptor',p,reach,{...SWITCH,world});
export const radarsNear=(world,p,reach)=>bandSites('radar',p,reach,{...RADAR,world});
export const ballsNear=(world,p,reach)=>bandSites('pelota',p,reach,{...BALL,world});
// What reaches the screen's edge as a mark (the nearest one not done), and from how far.
export const EDGE_REACH=4000;
// ---------- the switch and its challenge ----------
export const SWITCH_TOUCH=100,SWITCH_PULSE=300,RETO_SECONDS=30,RETO_LEAVE=900;
export const RING_COUNT=5,RING_REACH=70,RING_PASS=55,LIGHT_COUNT=8,LIGHT_TOUCH=50,LIGHT_PULSE=140;
// Under 5 km every switch is of rings; from there, about half are of lights.
export const switchKind=s=>s&&s.km>=LIGHTS_FROM_KM&&s.u<.5?'luces':'aros';
// The rings round a switch, in order, 16–28 m from it, about a fifth of a turn apart.
export function retoRings(s){let a=hashKey(`reto:a:v1:${s.id}`)*TAU;const out=[];for(let k=0;k<RING_COUNT;k++){const rad=160+120*hashKey(`reto:r:v1:${s.id}:${k}`);out.push({k,x:Math.round(s.x+Math.cos(a)*rad),y:Math.round(s.y+Math.sin(a)*rad)});a+=TAU/RING_COUNT*(.8+.4*hashKey(`reto:s:v1:${s.id}:${k}`));}return out;}
// The lights round a switch, 12–42 m from it.
export function retoLights(s){const out=[];for(let k=0;k<LIGHT_COUNT;k++){const a=(k+hashKey(`luz:a:v1:${s.id}:${k}`))/LIGHT_COUNT*TAU,rad=120+300*hashKey(`luz:r:v1:${s.id}:${k}`);out.push({k,x:Math.round(s.x+Math.cos(a)*rad),y:Math.round(s.y+Math.sin(a)*rad)});}return out;}
// A target done: a ring by a pulse on time inside it (without sound, by passing through it); a light by passing or any
// pulse near it. pulses: [{x,y,beat}] of this frame.
export function ringDone(ring,player,pulses,sound){if(!sound)return Math.hypot(ring.x-player.x,ring.y-player.y)<=RING_PASS?{onTime:false}:null;
 for(const w of pulses||[])if(w.beat&&Math.hypot(ring.x-w.x,ring.y-w.y)<=RING_REACH)return {onTime:true};return null;}
export function lightDone(light,player,pulses){if(Math.hypot(light.x-player.x,light.y-player.y)<=LIGHT_TOUCH)return {onTime:false};
 for(const w of pulses||[])if(Math.hypot(light.x-w.x,light.y-w.y)<=LIGHT_PULSE)return {onTime:!!w.beat};return null;}
// Small and repeatable: a whole challenge like a hard living encounter (10 ✦ near the origin; 15 if every ring was a
// pulse on time), by the share done; nothing if nothing was done.
export function retoReward(done,total,{x=0,y=0,onTime=false}={}){if(!(done>0)||!(total>0))return 0;return universeReward(UNIVERSE_BASE.live*Math.min(1,done/total),{difficulty:DIFFICULTY.hard,x,y,onTime});}
// ---------- the rhythm radar ----------
export const RADAR_ZONE=300,RADAR_OUT=420,RADAR_PAY_MIN=4;
// A pulse inside the zone: on time adds to the run, off time ends it. Returns the run {cur, best}.
export const radarPulse=(run,beat)=>{const cur=beat?(run.cur|0)+1:0;return {cur,best:Math.max(run.best|0,cur)};};
// A new record on a radar (a run of RADAR_PAY_MIN or more) pays once a day per radar, like a hard living encounter.
export const radarReward=({x=0,y=0}={})=>universeReward(UNIVERSE_BASE.live,{difficulty:DIFFICULTY.hard,x,y});
// ---------- the ball of light ----------
export const BALL_R=7,KICK_REACH=80,KICK_SPEED=560,NUDGE_REACH=16,NUDGE_SPEED=240,BALL_FRICTION=1.1,BALL_LEASH=1400,BALL_HOME=5;
export const GOAL_DIST=320,GOAL_HALF=75,ROCK_R=22,PARTY_SECONDS=2.6,BOUNCE_GAP=.22;
// The goal of a ball: two rocks 15 m apart, 32 m from where the ball rests.
export function goalFor(s){const a=hashKey(`gol:a:v1:${s.id}`)*TAU,cx=s.x+Math.cos(a)*GOAL_DIST,cy=s.y+Math.sin(a)*GOAL_DIST,px=-Math.sin(a),py=Math.cos(a);
 return {x:Math.round(cx),y:Math.round(cy),a,rocks:[{x:Math.round(cx+px*GOAL_HALF),y:Math.round(cy+py*GOAL_HALF)},{x:Math.round(cx-px*GOAL_HALF),y:Math.round(cy-py*GOAL_HALF)}]};}
// A kick: away from the pulse, harder the nearer it is. Returns the new velocity or null.
export function kick(ball,from,reach=KICK_REACH,speed=KICK_SPEED){const dx=ball.x-from.x,dy=ball.y-from.y,d=Math.hypot(dx,dy);if(d>reach)return null;const ux=d>1e-6?dx/d:1,uy=d>1e-6?dy/d:0,k=speed*(.75+.25*(1-d/reach));return {vx:ux*k,vy:uy*k};}
// One step of the ball: it rolls, slows down and bounces off the rocks. Returns {bounced} (a rock it hit, or null).
export function stepBall(ball,dt,rocks){const f=Math.exp(-BALL_FRICTION*dt);ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;ball.vx*=f;ball.vy*=f;if(Math.hypot(ball.vx,ball.vy)<BALL_HOME){ball.vx=0;ball.vy=0;}
 let bounced=null;for(const r of rocks||[]){const dx=ball.x-r.x,dy=ball.y-r.y,d=Math.hypot(dx,dy),min=ROCK_R+BALL_R;if(d<min&&d>1e-6){const nx=dx/d,ny=dy/d,dot=ball.vx*nx+ball.vy*ny;ball.x=r.x+nx*min;ball.y=r.y+ny*min;if(dot<0){ball.vx-=2*dot*nx;ball.vy-=2*dot*ny;ball.vx*=.8;ball.vy*=.8;bounced=r;}}}
 return {bounced};}
// A goal: the ball's path in this step crosses the line between the two rocks (from either side).
export function crossedGoal(a,b,goal){const [p,q]=goal.rocks,d1=(q.x-p.x)*(a.y-p.y)-(q.y-p.y)*(a.x-p.x),d2=(q.x-p.x)*(b.y-p.y)-(q.y-p.y)*(b.x-p.x);if(d1===0&&d2===0||d1*d2>0)return false;
 const e1=(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x),e2=(b.x-a.x)*(q.y-a.y)-(b.y-a.y)*(q.x-a.x);return e1*e2<=0;}
// The first goal of the day with a ball pays like a hard living encounter (×1.5 if the last kick was on time).
export const goalReward=({x=0,y=0,onTime=false}={})=>universeReward(UNIVERSE_BASE.live,{difficulty:DIFFICULTY.hard,x,y,onTime});
// ---------- the flare ----------
// Heard within FLARE_HEAR (once every FLARE_EVERY bars, from its side, softer further); seen at the screen's edge from
// anywhere; returning to it (within FLARE_ARRIVE, after being FLARE_AWAY from it) puts it out.
export const FLARE_ARRIVE=300,FLARE_AWAY=2000,FLARE_HEAR=30000,FLARE_EVERY=4,FLARE_RISE=1.4,FLARE_HEIGHT=110;
export const flareLoudness=d=>{const k=Math.max(0,1-d/FLARE_HEAR);return .25+.75*k*k;};
export const flarePan=(dx,d)=>d>1e-6?Math.max(-.85,Math.min(.85,dx/d*.85)):0;
// ---------- the board of orders (by every rest satellite) ----------
export const BOARD_OFF=300,BOARD_READ=450,BOARD_TAKE=260,ORDER_MAX=6,ORDER_ARRIVE=300,TAKEN_KEEP=120;
export const boardFor=(world,sat)=>{const a=hashKey(`tablon:v1:${world}:${sat.id}`)*TAU;return {id:'tablon:'+sat.id,sat:sat.id,km:sat.km,x:Math.round(sat.x+Math.cos(a)*BOARD_OFF),y:Math.round(sat.y+Math.sin(a)*BOARD_OFF)};};
export const CREATURES=Object.freeze(['La ballena','El búho','La medusa','El zorro','La tortuga','La rana','El colibrí','El pulpo','La luciérnaga','El ciervo']);
// Three orders a day on every board: bring a rare sound, go to a buoy, catch something (a living encounter or a
// challenge won). The creature, the buoy and what to catch come from hashKey of the board and the day.
export function ordersFor(world,board,day){const key=`encargo:v1:${world}:${board.id}:${day}`,who=k=>CREATURES[Math.floor(hashKey(key+':c:'+k)*CREATURES.length)%CREATURES.length];
 const off=[-2,-1,1,2][Math.floor(hashKey(key+':k')*4)%4],ring=Math.max(1,(board.km|0)+off),near=nearestBuoy(world,ring,board),n=ringCount(ring,1),j=((near.j+Math.floor(hashKey(key+':j')*5)-2)%n+n)%n,buoy=buoyAt(world,ring,j);
 const hunt=hashKey(key+':h')<.5?'encuentro':'reto';
 return [
  {id:`${board.id}:${day}:0`,board:board.id,kind:'sonido',who:who(0),text:`${who(0)} quiere oír un sonido raro.`},
  {id:`${board.id}:${day}:1`,board:board.id,kind:'sitio',who:who(1),text:`${who(1)} perdió algo en la boya del km ${buoy.km}.`,x:buoy.x,y:buoy.y,km:buoy.km},
  {id:`${board.id}:${day}:2`,board:board.id,kind:hunt,who:who(2),text:hunt==='encuentro'?`${who(2)} quiere ver un encuentro vivo.`:`${who(2)} quiere ver un reto ganado.`},
 ].map(o=>({...o,bx:board.x,by:board.y}));}
// What an order asks, in two words: under it on the board.
export const ORDER_DO=Object.freeze({sonido:'Recoge uno.',sitio:'Ve a buscarlo.',encuentro:'Completa uno.',reto:'Gana un interruptor.'});
// An order done: a sound, an encounter or a challenge since you took it (the count went up); a buoy reached.
export function orderDone(o,look,p){if(o.kind==='sitio')return Math.hypot(o.x-p.x,o.y-p.y)<=ORDER_ARRIVE;const v=look?.[o.kind]?.();return Number.isFinite(v)&&v>(o.base|0);}
export const orderReward=o=>universeReward(UNIVERSE_BASE.live,{difficulty:DIFFICULTY.hard,x:o.bx||0,y:o.by||0});
// ---------- the save: S.viajeA ----------
// version 1: retos (played, won, sparks), switches (id → the day it paid), radars (id → {best, day, paid}), balls
// (id → the day it paid), goals, flare (where it shines: x, y, world, day; or null), flares, orders (open, up to six),
// taken (the orders already taken, so a done one never comes back the same day), ordersDone, earned (all sparks of the
// batch). Unknown fields are kept; a later version is left untouched (and never written).
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const count=v=>Number.isSafeInteger(v)&&v>0?Math.min(v,1e9):0;
const dayKey=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:'';
const safeId=k=>typeof k==='string'&&k.length>0&&k.length<=96&&!['__proto__','constructor','prototype'].includes(k);
const finite=v=>Number.isFinite(v)&&Math.abs(v)<1e12;
export const KEEP=300;
const days=(raw)=>{const out={};for(const [k,v] of Object.entries(plain(raw)?raw:{}).slice(-KEEP))if(safeId(k))out[k]=dayKey(v);return out;};
const ORDER_KINDS=new Set(['sonido','sitio','encuentro','reto']);
const orderOk=o=>plain(o)&&safeId(o.id)&&safeId(o.board)&&ORDER_KINDS.has(o.kind)&&typeof o.text==='string'&&o.text.length<=160&&(o.kind!=='sitio'||finite(o.x)&&finite(o.y));
export const viajeReadOnly=q=>plain(q)&&Number.isInteger(q.version)&&q.version>VIAJE_A_VERSION;
export function normalizeViajeA(raw){
 if(viajeReadOnly(raw))return raw;const q=plain(raw)?raw:{},retos=plain(q.retos)?q.retos:{};
 const radars={};for(const [k,v] of Object.entries(plain(q.radars)?q.radars:{}).slice(-KEEP))if(safeId(k)&&plain(v))radars[k]={...v,best:count(v.best),day:dayKey(v.day),paid:dayKey(v.paid)};
 const f=q.flare,flare=plain(f)&&finite(f.x)&&finite(f.y)?{...f,x:Math.round(f.x),y:Math.round(f.y),w:typeof f.w==='string'?f.w.slice(0,40):'',day:dayKey(f.day),away:!!f.away}:null;
 const seen=new Set(),orders=(Array.isArray(q.orders)?q.orders:[]).filter(o=>orderOk(o)&&!seen.has(o.id)&&seen.add(o.id)).slice(0,ORDER_MAX).map(o=>({...o,base:count(o.base)}));
 const taken=[...new Set((Array.isArray(q.taken)?q.taken:[]).filter(safeId))].slice(-TAKEN_KEEP);
 return {...q,version:VIAJE_A_VERSION,retos:{...retos,n:count(retos.n),won:count(retos.won),earned:count(retos.earned)},switches:days(q.switches),radars,balls:days(q.balls),goals:count(q.goals),
  flare,flares:count(q.flares),orders,taken,ordersDone:count(q.ordersDone),earned:count(q.earned)};}
const writable=q=>plain(q)&&q.version===VIAJE_A_VERSION;
const trim=(o,max=KEEP)=>{const k=Object.keys(o);for(let i=0;i<k.length-max;i++)delete o[k[i]];};
// A challenge played: counted; if it paid today, the switch is spent for sparks until tomorrow. Returns whether it pays.
export const switchPaysToday=(q,id,day)=>!!day&&q?.switches?.[id]!==day;
export function noteReto(q,id,done,total,day,paid){if(!writable(q))return null;q.retos.n++;if(done>=total)q.retos.won++;if(paid>0){q.switches[id]=day;trim(q.switches);q.retos.earned+=paid;q.earned+=paid;}return {won:done>=total};}
// A pass by a radar: the record kept. Returns {record, pays} (pays once a day per radar, from RADAR_PAY_MIN).
export function noteRadar(q,id,best,day){if(!writable(q)||!(best>0))return null;const e=q.radars[id]||{best:0,day:'',paid:''},record=best>e.best;
 const pays=record&&best>=RADAR_PAY_MIN&&e.paid!==day&&!!day;if(record){e.best=best;e.day=day;}if(pays)e.paid=day;q.radars[id]=e;trim(q.radars);return {record,pays,before:record?best:e.best};}
export const radarRecord=(q,id)=>q?.radars?.[id]?.best|0;
export const radarBest=q=>Object.values(q?.radars||{}).reduce((a,e)=>Math.max(a,e.best|0),0);
export function noteGoal(q,id,day){if(!writable(q))return null;q.goals++;const pays=!!day&&q.balls[id]!==day;if(pays){q.balls[id]=day;trim(q.balls);}return {pays};}
export function setFlare(q,p,world,day){if(!writable(q))return null;q.flare={x:Math.round(p.x),y:Math.round(p.y),w:world,day,away:false};q.flares++;return q.flare;}
// The orders of a board: taken (with what each count is now), up to six open; never one already taken.
export function takeOrders(q,list,look){if(!writable(q))return [];const out=[];for(const o of list){if(q.orders.length>=ORDER_MAX)break;if(q.taken.includes(o.id))continue;const base=o.kind==='sitio'?0:Number(look?.[o.kind]?.())||0;const row={...o,base:Math.max(0,Math.floor(base))};q.orders.push(row);q.taken.push(o.id);out.push(row);}
 if(q.taken.length>TAKEN_KEEP)q.taken.splice(0,q.taken.length-TAKEN_KEEP);return out;}
export function finishOrder(q,id,paid){if(!writable(q))return null;const k=q.orders.findIndex(o=>o.id===id);if(k<0)return null;const [o]=q.orders.splice(k,1);q.ordersDone++;q.earned+=paid|0;return o;}
// ---------- sound ----------
// Notes of the chord that sounds or the place's scale, far under the music, through the voices and measured trims of the
// album of sounds (as the sky's secrets): a ring or a light (one note, climbing), a challenge won (three), a radar's tick
// (one high note), a kick and a bounce (one note of the chord), a goal (four), the flare (two high notes, from its side).
export const RETO_INSTRUMENT='kalimba',RADAR_INSTRUMENT='fmglass',BALL_INSTRUMENT='kalimba',FLARE_INSTRUMENT='fmglass';
export const RETO_GAIN=.02,RADAR_GAIN=.012,BALL_GAIN=.018,GOAL_GAIN=.02,FLARE_GAIN=.008;
export const retoDegree=k=>[0,2,4,7,9,11,14,16][((k%8)+8)%8];
export const WIN_DEGREES=Object.freeze([0,4,7]),GOAL_DEGREES=Object.freeze([0,2,4,7]),FLARE_DEGREES=Object.freeze([4,7]);
export {UNITS_PER_KM};
