// Secretos del cielo (Jay, 4 Nov 2026, alpha.247; docs/MUNDO.md#secretos): the second batch of secrets, all of space.
// The rules, with no page:
// · Meteoros: now and then (rarely) a shower of shooting stars crosses the sky near the cube. A pulse on time as one
//   passes catches it; with the sound off, passing through it or any pulse near it does (as wild.js since alpha.242).
//   Small and repeatable: a whole shower pays like a living encounter, by the universe's rule (universeReward).
// · Cristales de cometa: fifty, at fixed points from near to far (a few under 3 km). The Bitácora counts them and never
//   says where. All fifty earn an ornament for the cube (gold: earned). No sparks for a crystal.
// · Sondas perdidas: a few small empty probes that beep (heard before seen, louder as you come near). One found gives a
//   secret coordinate towards somewhere special that exists: a comet crystal, the secret asteroid or a rest satellite.
// · Eclipse: rare sites where a planet passes in front of a star, on the device's clock. Being there then darkens the
//   music for a few seconds (the output's comfort filter, which audio.js already exposes); it comes back by itself.
// Nothing here draws a random number: every place comes from hashKey and nothing on the map moves.
import {hashKey} from './universe-regions.js';
import {UNIVERSE_BASE,DIFFICULTY,universeReward} from './spark-rules.js';
import {ASTEROID} from './secretos-model.js';
export const SKY_SECRETS_VERSION=1,UNITS_PER_KM=10000;
const TAU=Math.PI*2;
// A fixed point at a distance from the origin (km) in a direction, both from hashKey; `away` keeps it clear of others.
function placeAt(key,minKm,maxKm,away=[],gap=0){
 for(let t=0;t<24;t++){const a=hashKey(key+':a:'+t)*TAU,u=hashKey(key+':r:'+t),km=minKm+(maxKm-minKm)*u,x=Math.round(Math.cos(a)*km*UNITS_PER_KM),y=Math.round(Math.sin(a)*km*UNITS_PER_KM);
  if(away.every(o=>Math.hypot(o.x-x,o.y-y)>=gap))return {x,y,km:Math.round(km*10)/10};}
 const a=hashKey(key+':a')*TAU,km=(minKm+maxKm)/2;return {x:Math.round(Math.cos(a)*km*UNITS_PER_KM),y:Math.round(Math.sin(a)*km*UNITS_PER_KM),km};}
function placeAll(prefix,bands,gap,away){const out=[];let i=0;for(const [minKm,maxKm,n] of bands)for(let k=0;k<n;k++,i++)out.push(Object.freeze({i,id:prefix+':'+i,...placeAt(prefix+':v1:'+i,minKm,maxKm,[...away,...out],gap)}));return Object.freeze(out);}
// ---------- comet crystals ----------
// Bands of distance (km from, km to, how many): four under 3 km, so someone finds the first one soon; the rest further.
export const COMET_COUNT=50;
export const COMET_BANDS=Object.freeze([[.9,2.8,4],[3,8,10],[8,20,14],[20,50,12],[50,95,10]]);
export const COMET_GAP=6000,COMET_TOUCH=120,COMET_PULSE=300,COMET_GLINT=1500;
const ORIGIN=Object.freeze({x:0,y:0}),ROCK=Object.freeze({x:ASTEROID.x,y:ASTEROID.y});
export const COMETS=placeAll('cometa',COMET_BANDS,COMET_GAP,[ORIGIN,ROCK]);
// ---------- lost probes ----------
export const PROBE_COUNT=12;
export const PROBE_BANDS=Object.freeze([[1.2,3,3],[4,12,4],[12,30,3],[30,60,2]]);
// Heard within PROBE_HEAR (louder as you come near); found by passing within PROBE_TOUCH or a pulse within PROBE_PULSE.
export const PROBE_HEAR=5000,PROBE_TOUCH=150,PROBE_PULSE=300,PROBE_GAP=8000;
export const PROBES=placeAll('sonda',PROBE_BANDS,PROBE_GAP,[ORIGIN,ROCK,...COMETS]);
// What each probe points to first (a comet crystal, the secret asteroid, a rest satellite), then the others in turn.
export const PROBE_PREFERS=Object.freeze(['cometa','asteroide','cometa','satelite']);
export const COORD_ARRIVE=300,COORDS_DONE_MAX=24;
// ---------- meteor showers ----------
// One every METEOR_EVERY seconds of play in the free World (hashKey of the count), never while another scene plays.
export const METEOR_EVERY=Object.freeze({min:300,max:540});
export const meteorInterval=n=>METEOR_EVERY.min+(METEOR_EVERY.max-METEOR_EVERY.min)*hashKey('meteoro:every:v1:'+n);
export const METEOR_COUNT=7,METEOR_GAP=1.7,METEOR_LIFE=3.4,METEOR_SPEED=170,METEOR_SIDE=110,METEOR_TOUCH=60,METEOR_PULSE=280,METEOR_LEAVE=2500;
// The k-th meteor of the n-th shower: it crosses past the cube's point (from), within METEOR_SIDE of it, in METEOR_LIFE s.
export function meteorPath(n,k,from){const a=hashKey(`meteoro:a:v1:${n}:${k}`)*TAU,off=(hashKey(`meteoro:o:v1:${n}:${k}`)*2-1)*METEOR_SIDE,dx=Math.cos(a),dy=Math.sin(a),half=METEOR_SPEED*METEOR_LIFE/2;
 return {k,dx,dy,x0:from.x-dx*half-dy*off,y0:from.y-dy*half+dx*off,born:k*METEOR_GAP};}
export function meteorHead(m,age){return {x:m.x0+m.dx*METEOR_SPEED*age,y:m.y0+m.dy*METEOR_SPEED*age};}
// Caught: with sound, by a pulse on time within reach; without it, the cube passing through it or any pulse within reach.
export function meteorCaught(head,player,pulses,sound){
 if(!sound&&Math.hypot(head.x-player.x,head.y-player.y)<=METEOR_TOUCH)return {by:'touch',onTime:false};
 for(const w of pulses||[])if((!sound||w.beat)&&Math.hypot(head.x-w.x,head.y-w.y)<=METEOR_PULSE)return {by:'pulse',onTime:!!(sound&&w.beat)};
 return null;}
// A whole shower pays like a living encounter, hard (base 5 × 2: 10 ✦ near the origin, 15 on time), by the share caught.
export function meteorReward(caught,total,{x=0,y=0,onTime=false}={}){if(!(caught>0)||!(total>0))return 0;return universeReward(UNIVERSE_BASE.live*Math.min(1,caught/total),{difficulty:DIFFICULTY.hard,x,y,onTime});}
// ---------- eclipses ----------
// One site in about one cell of 4 × 4 km out of three, away from the cell's edge. The planet crosses the star once a
// period (four to six minutes, on the device's clock); it covers it for ECLIPSE_TOTAL seconds.
export const ECLIPSE_CELL=40000,ECLIPSE_SHARE=.3,ECLIPSE_MARGIN=.2,ECLIPSE_TOTAL=12,ECLIPSE_REACH=700,ECLIPSE_SEE=3000,ECLIPSE_TRAVEL=900;
export const ECLIPSE_SECONDS=8,ECLIPSE_CUTOFF=650,ECLIPSE_TAU=.6;
export function eclipseCell(i,j){const k=i+','+j;if(hashKey('eclipse:has:v1:'+k)>=ECLIPSE_SHARE)return null;if(i===0&&j===0)return null;
 const span=1-2*ECLIPSE_MARGIN,x=Math.round((i+ECLIPSE_MARGIN+span*hashKey('eclipse:x:v1:'+k))*ECLIPSE_CELL),y=Math.round((j+ECLIPSE_MARGIN+span*hashKey('eclipse:y:v1:'+k))*ECLIPSE_CELL);
 const period=Math.round(240+120*hashKey('eclipse:p:v1:'+k)),phase=Math.round(hashKey('eclipse:f:v1:'+k)*period),side=hashKey('eclipse:s:v1:'+k)*TAU;
 return Object.freeze({id:'eclipse:'+k,x,y,period,phase,side});}
export function eclipseNear(p,radius=ECLIPSE_SEE){const i0=Math.floor(p.x/ECLIPSE_CELL),j0=Math.floor(p.y/ECLIPSE_CELL);let best=null;
 for(let i=i0-1;i<=i0+1;i++)for(let j=j0-1;j<=j0+1;j++){const s=eclipseCell(i,j);if(!s)continue;const d=Math.hypot(s.x-p.x,s.y-p.y);if(d<=radius&&(!best||d<best.d))best={...s,d};}return best;}
// Where the planet is in its pass (u from 0 to 1, the star covered around .5) and which pass it is, at a time in seconds.
export function eclipsePhase(site,sec){const t=sec+site.phase,cycle=Math.floor(t/site.period),u=(t-cycle*site.period)/site.period;return {u,cycle,total:Math.abs(u-.5)*site.period<=ECLIPSE_TOTAL/2};}
// Seconds until the next covering begins (0 while it lasts).
export function eclipseWait(site,sec){const f=eclipsePhase(site,sec);if(f.total)return 0;const start=.5-ECLIPSE_TOTAL/2/site.period;return ((start-f.u+1)%1)*site.period;}
// ---------- the save: S.skySecrets ----------
// version 1: comets (index → day), probes (index → day), coords (open), coordsDone (fulfilled, the last 24), meteors
// (showers seen, stars caught, whole showers, sparks earned), eclipses (how many seen, the first day), wear.orbit (the
// ornament, on unless taken off). Unknown fields are kept; a later version is only read (readOnly) and never written.
const plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
const dayKey=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:'';
const count=v=>Number.isSafeInteger(v)&&v>0?v:0;
const indexSet=(raw,max)=>{const out={};if(plain(raw))for(const [k,v] of Object.entries(raw)){const i=Number(k);if(Number.isInteger(i)&&i>=0&&i<max&&String(i)===k)out[k]=dayKey(v);}return out;};
const KINDS=new Set(['cometa','asteroide','satelite']);
const coordOk=e=>plain(e)&&typeof e.id==='string'&&e.id.length<64&&KINDS.has(e.kind)&&Number.isFinite(e.x)&&Number.isFinite(e.y)&&Number.isInteger(e.probe);
export function normalizeSkySecrets(raw){
 if(plain(raw)&&Number.isSafeInteger(raw.version)&&raw.version>SKY_SECRETS_VERSION)return Object.assign(raw,{readOnly:true});
 const q=plain(raw)?raw:{};const m=plain(q.meteors)?q.meteors:{},e=plain(q.eclipses)?q.eclipses:{},wear=plain(q.wear)?q.wear:{};
 if(wear.orbit!==false)delete wear.orbit;
 const seen=new Set(),coords=(Array.isArray(q.coords)?q.coords:[]).filter(c=>coordOk(c)&&!seen.has(c.id)&&seen.add(c.id)).slice(0,PROBE_COUNT);
 const done=(Array.isArray(q.coordsDone)?q.coordsDone:[]).filter(coordOk).slice(-COORDS_DONE_MAX);
 const out=Object.assign(q,{version:SKY_SECRETS_VERSION,comets:indexSet(q.comets,COMET_COUNT),probes:indexSet(q.probes,PROBE_COUNT),coords,coordsDone:done,
  meteors:Object.assign(m,{n:count(m.n),caught:count(m.caught),full:count(m.full),earned:count(m.earned)}),eclipses:Object.assign(e,{n:count(e.n),first:dayKey(e.first)}),wear});
 delete out.readOnly;return out;}
export const cometFound=(q,i)=>!!q&&plain(q.comets)&&Object.hasOwn(q.comets,String(i));
export const cometCount=q=>COMETS.filter(c=>cometFound(q,c.i)).length;
export const probeFound=(q,i)=>!!q&&plain(q.probes)&&Object.hasOwn(q.probes,String(i));
export const probeCount=q=>PROBES.filter(p=>probeFound(q,p.i)).length;
export const orbitEarned=q=>cometCount(q)>=COMET_COUNT;
export const orbitOn=q=>orbitEarned(q)&&q.wear?.orbit!==false;
// The pages of the Bitácora: each one only once it is found (nothing is said of the rest).
export const SKY_PAGES=Object.freeze(['meteoros','cometas','sondas','eclipse']);
export function skyPagesFound(q){if(!q||q.version!==SKY_SECRETS_VERSION&&!q.readOnly)return [];return SKY_PAGES.filter(id=>id==='meteoros'?count(q.meteors?.caught)>0:id==='cometas'?cometCount(q)>0:id==='sondas'?probeCount(q)>0:count(q.eclipses?.n)>0);}
// A crystal kept: once. Returns {count, all} or null.
export function keepComet(q,i,day){if(!plain(q)||q.readOnly||q.version!==SKY_SECRETS_VERSION||!COMETS[i]||cometFound(q,i))return null;q.comets[String(i)]=dayKey(day);const n=cometCount(q);return {count:n,all:n===COMET_COUNT};}
// The coordinate a probe gives: its first preference, then the others; never a place already found or already pointed at.
// look: {asteroidFound, satellite(p) → {id,x,y} | null}.
export function probeTarget(q,i,look={}){const probe=PROBES[i];if(!probe)return null;const taken=new Set([...(q?.coords||[]),...(q?.coordsDone||[])].map(c=>c.target));
 const first=PROBE_PREFERS[i%PROBE_PREFERS.length],order=[first,...['cometa','asteroide','satelite'].filter(k=>k!==first)];
 for(const kind of order){
  if(kind==='cometa'){let best=null,bd=Infinity;for(const c of COMETS){if(cometFound(q,c.i)||taken.has(c.id))continue;const d=Math.hypot(c.x-probe.x,c.y-probe.y);if(d<bd){bd=d;best=c;}}if(best)return {kind,target:best.id,x:best.x,y:best.y};}
  if(kind==='asteroide'&&!look.asteroidFound&&!taken.has('asteroide'))return {kind,target:'asteroide',x:ASTEROID.x,y:ASTEROID.y};
  if(kind==='satelite'){const s=look.satellite?.(probe);if(s&&!taken.has(s.id))return {kind,target:s.id,x:s.x,y:s.y};}}
 return null;}
// A probe found: kept once, with the coordinate it gives (if any place is left to point at). Returns the coordinate or {}.
export function keepProbe(q,i,day,look){if(!plain(q)||q.readOnly||q.version!==SKY_SECRETS_VERSION||!PROBES[i]||probeFound(q,i))return null;q.probes[String(i)]=dayKey(day);
 const t=probeTarget(q,i,look);if(!t)return {};const c={id:'coord:'+i,probe:i,...t,at:dayKey(day)};q.coords.push(c);return c;}
// Arriving at a coordinate fulfils it (kept among the last fulfilled).
export function fulfilCoord(q,id,day){if(!plain(q)||q.readOnly)return null;const k=q.coords.findIndex(c=>c.id===id);if(k<0)return null;const [c]=q.coords.splice(k,1);const row={...c,done:dayKey(day)};q.coordsDone.push(row);if(q.coordsDone.length>COORDS_DONE_MAX)q.coordsDone.splice(0,q.coordsDone.length-COORDS_DONE_MAX);return row;}
// ---------- sound ----------
// Notes of the place's scale, far under the music, through the voices and measured trims of the album of sounds: a
// probe's beep (two high notes on the fifth, softer from further), a meteor caught (one high note, climbing the chord), a
// crystal kept (three notes).
export const PROBE_INSTRUMENT='fmglass',METEOR_INSTRUMENT='kalimba',COMET_INSTRUMENT='kalimba';
export const PROBE_GAIN=.012,METEOR_GAIN=.02,COMET_GAIN=.02;
export const PROBE_DEGREES=Object.freeze([4,4]),COMET_DEGREES=Object.freeze([0,2,4]);
export const meteorDegree=k=>[0,2,4,7,9,11,14][((k%7)+7)%7];
export const probeLoudness=d=>{const k=Math.max(0,1-d/PROBE_HEAR);return .2+.8*k*k;};
