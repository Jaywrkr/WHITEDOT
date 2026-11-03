// Secretos (Jay, 3 Nov 2026, alpha.244; docs/MUNDO.md#secretos): the first easter eggs of F5 (docs/IDEAS_UNIVERSO.md,
// rows 33, 38, 42, 101 and 102; decisions 7, 9 and 10). The rules, with no page: what each secret is, how the arrow code
// is read from keys and swipes, the special distances, the real dates (Christmas, New Year, the real full moon, the
// first of August) and the save. Nothing here draws a random number: every place is fixed and nothing on the map moves.
// The special pays no sparks (decision 9): a page in the Bitácora, and the gold cube at 100 km.
export const SECRETS_VERSION=1;
// Each secret: its id, its name in the Bitácora and one short line. The names of the ones not found are never shown.
export const SECRETS=Object.freeze([
 {id:'flechas',kind:'gesto',name:'Ocho flechas',line:'Un código clásico. Un destello y un arpegio.'},
 {id:'logo',kind:'gesto',name:'Siete toques',line:'El cubo puso una cara rara.'},
 {id:'origen',kind:'lugar',name:'El origen',line:'0,0 · donde empieza todo.'},
 {id:'km42',kind:'lugar',name:'42 km',line:'Un número con fama de respuesta.'},
 {id:'km77',kind:'lugar',name:'77 km',line:'Dos sietes seguidos.'},
 {id:'km100',kind:'lugar',name:'100 km',line:'Tan lejos que el cubo se volvió dorado.'},
 {id:'asteroide',kind:'lugar',name:'Asteroide secreto',line:'Alguien dejó una nota.'},
 {id:'navidad',kind:'fecha',name:'Nieve de estrellas',line:'Cae en Navidad.'},
 {id:'anonuevo',kind:'fecha',name:'Fuegos de año nuevo',line:'El cielo cambia de año.'},
 {id:'luna',kind:'fecha',name:'Luna llena',line:'La de verdad, la de esta noche.'},
 {id:'especial',kind:'fecha',name:'Un día especial',line:'Globos de luz, una vez al año.'}
]);
export const secretById=id=>SECRETS.find(s=>s.id===id)||null;
// ---------- the arrow code ----------
// ↑↑↓↓←→←→: a classic homage, with no brand. Keys or swipes; a pause longer than CODE_GAP starts it again.
export const ARROW_CODE=Object.freeze(['up','up','down','down','left','right','left','right']);
export const CODE_GAP=2500,CODE_EFFECT=20,FLASH_SECONDS=.6;
export const KEY_DIRECTIONS=Object.freeze({ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'});
// A swipe: a short, quick stroke, mostly along one axis. Returns its direction or null.
export const SWIPE_MIN=36,SWIPE_MS=450;
export function swipeDirection(dx,dy,ms){const ax=Math.abs(dx),ay=Math.abs(dy);if(!(ms>=0&&ms<=SWIPE_MS))return null;if(Math.max(ax,ay)<SWIPE_MIN)return null;if(Math.min(ax,ay)>Math.max(ax,ay)*.6)return null;return ax>ay?(dx>0?'right':'left'):(dy>0?'down':'up');}
// The code reader: push a direction at a time (ms), it answers true when the eight are complete. A wrong step keeps the
// longest start that still matches (↑↑↑ is still ↑↑).
export function codeReader(code=ARROW_CODE,gap=CODE_GAP){let got=[],last=-Infinity;
 return {push(dir,at){if(!dir)return false;if(at-last>gap)got=[];last=at;got.push(dir);
  while(got.length&&!got.every((d,i)=>d===code[i]))got.shift();
  if(got.length===code.length){got=[];return true;}return false;},get progress(){return got.length;},reset(){got=[];last=-Infinity;}};}
// ---------- the logo ----------
// Seven taps on the logo of the menu, each within TAP_GAP of the one before: the cube puts on a strange face for 10 s.
export const LOGO_TAPS=7,TAP_GAP=1200,FACE_SECONDS=10;
export function tapCounter(n=LOGO_TAPS,gap=TAP_GAP){let count=0,last=-Infinity;return {tap(at){count=at-last>gap?1:count+1;last=at;if(count>=n){count=0;return true;}return false;},get count(){return count;}};}
// ---------- the special places ----------
// Distances from the origin (decision 5), 10000 units to a km. The origin is a point (20 m); the others, a distance
// reached in any direction. The asteroid sits at a fixed point (π and e, in tenths of a metre: about 4 km out).
export const UNITS_PER_KM=10000,ORIGIN_REACH=200;
export const DISTANCE_SECRETS=Object.freeze([['km42',42],['km77',77],['km100',100]]);
export const ASTEROID=Object.freeze({x:31416,y:-27183,reach:250,see:900});
export const ASTEROID_NOTE='Estuvimos aquí. Sigue explorando.';
// Which places a point reaches now.
export function placesReached(x,y){const d=Math.hypot(Number(x)||0,Number(y)||0),out=[];if(d<=ORIGIN_REACH)out.push('origen');
 for(const [id,km] of DISTANCE_SECRETS)if(d>=km*UNITS_PER_KM)out.push(id);
 if(Math.hypot((Number(x)||0)-ASTEROID.x,(Number(y)||0)-ASTEROID.y)<=ASTEROID.reach)out.push('asteroide');return out;}
// ---------- the real dates ----------
// Read from the device's own clock, in its own time zone; no network. The year is never kept.
// The full moon: the mean synodic month from a known new moon (6 Jan 2000, 18:14 UTC). The mean phase is within about
// half a day of the true one; «full» is a day either side, and only at night (18:00 to 7:00, local).
export const SYNODIC_DAYS=29.530588853,NEW_MOON_MS=Date.UTC(2000,0,6,18,14),FULL_WINDOW_DAYS=1;
export function moonAge(ms){const days=(ms-NEW_MOON_MS)/864e5;return ((days%SYNODIC_DAYS)+SYNODIC_DAYS)%SYNODIC_DAYS;}
export const fullMoonNear=ms=>Math.abs(moonAge(ms)-SYNODIC_DAYS/2)<=FULL_WINDOW_DAYS;
// Which date secret today is, if any: navidad (24 and 25 Dec), anonuevo (31 Dec and 1 Jan), especial (1 Aug), luna
// (the full moon at night). One at a time, in that order.
export function dateSecret(date){if(!(date instanceof Date)||!Number.isFinite(date.getTime()))return null;const m=date.getMonth()+1,d=date.getDate(),h=date.getHours();
 if(m===12&&(d===24||d===25))return 'navidad';if((m===12&&d===31)||(m===1&&d===1))return 'anonuevo';if(m===8&&d===1)return 'especial';
 if((h>=18||h<7)&&fullMoonNear(date.getTime()))return 'luna';return null;}
// ---------- the save: S.secrets ----------
// version 1: found (id → {at: the day, or nothing for the dates}), wear.gold (the gold cube, on unless taken off). Unknown
// fields are kept; a later version is only read (readOnly) and never written.
const plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
const dayKey=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:null;
export function normalizeSecrets(raw){
 if(plain(raw)&&Number.isSafeInteger(raw.version)&&raw.version>SECRETS_VERSION)return Object.assign(raw,{readOnly:true});
 const q=plain(raw)?raw:{};const found={};
 if(plain(q.found))for(const [id,v] of Object.entries(q.found)){if(!secretById(id))continue;const at=secretById(id).kind==='fecha'?null:dayKey(v?.at);found[id]=at?{at}:{};}
 const wear=plain(q.wear)?q.wear:{};if(wear.gold!==false)delete wear.gold;
 const out=Object.assign(q,{version:SECRETS_VERSION,found,wear});delete out.readOnly;return out;}
export const secretFound=(q,id)=>!!q?.found?.[id];
export const secretCount=q=>SECRETS.filter(s=>secretFound(q,s.id)).length;
// Marks one found. Dates keep no day (and so no year). Returns false if it was already there or the save is read only.
export function findSecret(q,id,day){if(!q||q.readOnly||!secretById(id)||secretFound(q,id))return false;const at=secretById(id).kind==='fecha'?null:dayKey(day);q.found[id]=at?{at}:{};return true;}
export const goldEarned=q=>secretFound(q,'km100');
export const goldOn=q=>goldEarned(q)&&q.wear?.gold!==false;
// ---------- sound ----------
// Notes on the place's scale (the harmony that sounds), far under the music, through the same voices the album of sounds
// uses, with its measured trims. The arpeggio climbs the chord in eight sixteenths; the chord of a place is three notes.
export const ARPEGGIO_DEGREES=Object.freeze([0,2,4,7,9,11,14,16]),CHORD_DEGREES=Object.freeze([0,2,4]);
export const SECRET_INSTRUMENT='kalimba',SECRET_GAIN=.02;
export function scaleNote(scale,tonic,degree){const sc=Array.isArray(scale)&&scale.length===7?scale:[0,2,4,5,7,9,11],i=((degree%7)+7)%7,o=Math.floor(degree/7);let n=tonic+sc[i]+12*o;while(n>96)n-=12;while(n<36)n+=12;return n;}
// A small deterministic sequence for the drawing (snow, fireworks, balloons): no browser random and never the game's RNG.
export function sequence(seed=1){let s=seed>>>0||1;return ()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
