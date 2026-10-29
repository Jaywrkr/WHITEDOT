// Ritmo (Jay, 29 Oct 2026, alpha.237; docs/MUNDO.md#ritmo): four ways of playing inside the eleven places, with no page
// or canvas here. They give ★ and grow Tu canción like any round, never sparks (LEVEL_SPARKS, spark-rules.js).
// 1. Eco: a place already complete, played from memory: it sings its phrase as always and then the Line and the ring on
//    the cube stop showing the steps it counts. 2. Duelo final: after the eleven (and their note, eleven-note.js), a last
//    place in the centre of the ring sings the eleven rhythms one after another, a bar each, and you answer each in the
//    next bar; it gives its own ★ (outside the 33) and the Corona de los once, an ornament for the cube, with its entry
//    in the Bitácora. 3. Fantasma: your best time in each place is kept with its path, a few spaced samples, and a faint
//    outline of the cube runs it with you the next time. 4. Combo: eight hits on time in a row and the cube leaves a
//    trail that grows until a miss; it then fades softly. Only a drawing. Nothing here uses the old random numbers.
import {PLACE_IDS,complete,allComplete} from './places.js';
import {RHYTHMS,PLACE_RHYTHMS} from './journey-rhythm.js';
import {hashKey} from './universe-regions.js';
export const RITMO_VERSION=1;
// The Cueva already plays from memory (its game sings a new phrase each bar and asks for it back): no Eco there.
export const ECHO_PLACES=Object.freeze(PLACE_IDS.filter(id=>id!=='cueva'));
// A ghost: one sample of the path every 600 ms, at most 160; past that the samples halve and the gap doubles, so a long
// round still fits (a few kilobytes per place). Points are offsets from where the round started, in whole units.
export const GHOST_EVERY=600,GHOST_MAX=160,GHOST_FADE=1500,GHOST_COORD=1e6;
// The combo: from the eighth hit in a row; the trail grows by two points a hit, up to 40, and fades in 0,8 s.
export const COMBO_AT=8,TRAIL_BASE=6,TRAIL_STEP=2,TRAIL_MAX=40,TRAIL_FADE=800;
// The duel: its portal sits in the centre of the ring; it opens within 40 units, and walking 1200 away ends it, losing
// nothing. A step of the answer is on time within 90 ms of its eighth.
export const DUEL_REACH=40,DUEL_LEAVE=1200,DUEL_WINDOW=.09;
// ?rapido=1 and ?rapido=2 play four of the eleven: the first, the Vacío, the Faros and the Cueva.
export const DUEL_RAPID=Object.freeze(['llanura','vacio','faros','cueva']);
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const share=v=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):0;
const count=v=>Number.isInteger(v)?Math.max(0,Math.min(99999,v)):0;
const day=v=>typeof v==='string'?v.slice(0,24):'';
// A kept ghost, or null: a time, the gap between samples and the samples themselves.
export function normalizeGhost(raw){if(!plain(raw)||!Number.isFinite(raw.ms)||raw.ms<=0||!Number.isInteger(raw.every)||raw.every<100||raw.every>600000||!Array.isArray(raw.pts))return null;
 const pts=raw.pts.filter(p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isInteger(n)&&Math.abs(n)<=GHOST_COORD)).map(p=>[p[0],p[1]]).slice(0,GHOST_MAX);
 return pts.length>=2?{ms:Math.round(raw.ms),every:raw.every,pts}:null;}
// The save (S.ritmo): Eco per place, a ghost per place, the duel and the notices already given. Unknown fields are kept;
// a later version is left untouched (and nothing is written to it).
export function normalizeRitmo(raw){if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>RITMO_VERSION)return raw;const q=plain(raw)?raw:{};
 const echo={},ghosts={};for(const id of PLACE_IDS){const e=q.echo?.[id];if(plain(e)&&ECHO_PLACES.includes(id))echo[id]={...e,best:share(e.best),rounds:count(e.rounds)};const g=normalizeGhost(q.ghosts?.[id]);if(g)ghosts[id]=g;}
 const d=plain(q.duel)?q.duel:{};const duel={...d,won:d.won===true,day:day(d.day),best:share(d.best),echoes:count(d.echoes),rounds:count(d.rounds),wear:d.wear!==false};
 const said=plain(q.said)?{...q.said,duel:q.said.duel===true}:{duel:false};
 return {...q,version:RITMO_VERSION,echo,ghosts,duel,said};}
// Eco is offered for a place already complete (never the first time), with sound (the phrase is heard), outside the Cueva.
export const echoOffered=(places,id,sound=true)=>!!places&&!places.readOnly&&ECHO_PLACES.includes(id)&&complete(places,id)&&sound!==false;
// The duel opens once the eleven are complete, their finale played and their note seen.
export function duelOpen(places,noteSeen){return !!places&&!places.readOnly&&places.won===true&&allComplete(places)&&noteSeen===true;}
// ---------- the ghost ----------
export function ghostRecorder(){return {every:GHOST_EVERY,pts:[]};}
// The samples due by `ms` from the start, at the place the cube is now (a late look, a hidden tab, fills the gap); the
// recorder halves itself when full.
export function ghostSample(rec,ms,dx,dy){if(!rec||!Number.isFinite(ms)||!Number.isFinite(dx)||!Number.isFinite(dy))return false;const p=[Math.max(-GHOST_COORD,Math.min(GHOST_COORD,Math.round(dx))),Math.max(-GHOST_COORD,Math.min(GHOST_COORD,Math.round(dy)))];let added=false;
 while(ms>=rec.pts.length*rec.every){if(rec.pts.length>=GHOST_MAX){rec.pts=rec.pts.filter((_,i)=>i%2===0);rec.every*=2;continue;}rec.pts.push([...p]);added=true;}return added;}
// Where the ghost is at `ms`: between its samples, and resting on the last one once its time is over.
export function ghostAt(g,ms){if(!g?.pts?.length)return null;const f=Math.max(0,ms)/g.every,i=Math.floor(f);if(i>=g.pts.length-1){const p=g.pts[g.pts.length-1];return {x:p[0],y:p[1],done:ms>=g.ms};}
 const a=g.pts[i],b=g.pts[i+1],k=f-i;return {x:a[0]+(b[0]-a[0])*k,y:a[1]+(b[1]-a[1])*k,done:ms>=g.ms};}
// How faint it is: steady while it runs, gone 1,5 s after its time.
export const GHOST_ALPHA=.55;
export const ghostAlpha=(g,ms)=>!g?0:ms<=g.ms?GHOST_ALPHA:Math.max(0,GHOST_ALPHA*(1-(ms-g.ms)/GHOST_FADE));
// A finished round keeps its path when it is the best time of the place (or the first one with a path).
export const ghostBetter=(old,ms)=>Number.isFinite(ms)&&ms>0&&(!old||ms<old.ms);
export function ghostFrom(rec,ms){return normalizeGhost({ms,every:rec?.every,pts:rec?.pts});}
// ---------- the combo ----------
// Hits and misses since the last look: a miss ends the streak (and its trail fades); hits add to it.
export function comboStep(c,{hits=0,misses=0}={}){const q={streak:c?.streak|0,broke:false};if(misses>0){q.broke=q.streak>=COMBO_AT;q.streak=0;}q.streak+=Math.max(0,hits|0);return q;}
export const trailLength=streak=>streak<COMBO_AT?0:Math.min(TRAIL_MAX,TRAIL_BASE+(streak-COMBO_AT)*TRAIL_STEP);
// ---------- the duel ----------
// The steps a place asks for in the duel: its rhythm; the Cueva, whose phrase changes, gives four eighths from a hash.
export function duelPattern(id){const key=PLACE_RHYTHMS[id];if(key==='eco'){const rest=[2,4,6,8,10,12,14].sort((a,b)=>hashKey('duelo:cueva:'+a)-hashKey('duelo:cueva:'+b));return [0,...rest.slice(0,3)].sort((a,b)=>a-b);}
 return [...(RHYTHMS[key]?.steps||[0,4,8,12])];}
export const duelList=(rapid=false)=>(rapid?DUEL_RAPID:PLACE_IDS).map(id=>({id,steps:duelPattern(id)}));
// A touch heard `k` sixteenths into the answer bar: the eighth it is nearest and whether it is one of the pattern's, on time.
export function duelJudge(pattern,k,six,window=DUEL_WINDOW){if(!Number.isFinite(k)||!(six>0))return null;const e=Math.round(k/2)*2;if(e<0||e>=16)return null;return {step:e,ok:pattern.includes(e)&&Math.abs(k-e)*six<=window};}
// The answer bar closes: its right steps and the extra ones count; an echo is every step and nothing else.
export function duelClose(score,pattern,steps,wrong=0){const right=pattern.filter(s=>steps.includes(s)).length,echo=right===pattern.length&&wrong===0;
 return {right:score.right+right,total:score.total+pattern.length,wrong:score.wrong+wrong,echoes:score.echoes+(echo?1:0),echo,answered:steps.length+wrong>0};}
// The share on time: right steps over everything asked and everything extra.
export const duelShare=score=>{const d=(score?.total||0)+(score?.wrong||0);return d>0?share((score.right||0)/d):0;};
// The result kept: the ★ on completion (no threshold, no punishment), the best share and echoes, the first day.
// `fresh` says it is the first ★ (the ornament is new and put on).
export function duelKeep(saved,score,today){const was=saved?.won===true,s=duelShare(score);return {kept:{...saved,won:true,day:was&&saved.day?saved.day:day(today),best:Math.max(share(saved?.best),s),echoes:Math.max(count(saved?.echoes),count(score.echoes)),rounds:count(saved?.rounds)+1,wear:was?saved.wear!==false:true},fresh:!was,share:s};}
