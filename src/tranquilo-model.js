// Modo tranquilo (Jay, 29 Oct 2026, alpha.239, «Con Luca»; docs/MUNDO.md#con-luca): a setting for a child. In the eleven
// places and the Journey it takes the clock out of each game (what used to fade, wilt or leave now waits), widens the
// window of a pulse on time and draws the signals bigger and brighter: the ring that closes on the cube, the steps on the
// Line and the thing to reach next. The cube keeps its size. No music changes, nothing punishes, nothing is lost: it can
// be switched on and off at any moment. The fair part: played in this mode a round (or a chapter) gives ★ but not ★★ or
// ★★★, because the wider window would make them too easy; they wait for the normal mode, nothing is taken away.
// No page or canvas here; tranquilo.js wires it.
export const TRANQUILO_VERSION=1;
// A pulse on time within 140 ms of its step (the game's window is 80 ms, journey-pulse.js ON_TIME).
export const CALM_WINDOW=.14;
// What used to run out: the Faros' boats follow for 32 bars (2), the Cristales ring for 64 beats (16), the Dunas' wave
// is ridden from 70 units (46); the Tormenta's circle and the Jardín's beds never run out.
export const CALM_FOLLOW_BARS=32,CALM_RING_BEATS=64,CALM_SURF_BAND=70;
// Bigger signals: the Line's counted steps grow by this much and the ring on the cube is this thick.
export const CALM_LINE=1.8,CALM_RING_WIDTH=2.5,CALM_TARGET_R=34;
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
// The save (S.tranquilo): whether it is on. Unknown fields are kept; a later version is left untouched and reads off.
export function normalizeTranquilo(raw){if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>TRANQUILO_VERSION)return raw;const q=plain(raw)?raw:{};
 return {...q,version:TRANQUILO_VERSION,on:q.on===true};}
export const tranquiloWritable=t=>t?.version===TRANQUILO_VERSION;
export const tranquiloOn=t=>tranquiloWritable(t)&&t.on===true;
// Where it acts: a round of a place that is not Maestro, or the Journey (the Camino and its five chapters, until it is
// finished). Never in the open World.
export function calmApplies({on=false,run=null,journey=false}={}){if(!on)return false;if(run)return !run.maestro;return journey===true;}
// A game's value, calm or as it was. Kinds: window, danceLife, gardenWilt, guideFollow, resonanceRing, surfBand.
export function calmValue(kind,normal,applies){if(!applies)return normal;const n=Number.isFinite(normal)?normal:0;
 switch(kind){case 'window':return Math.max(n,CALM_WINDOW);case 'danceLife':case 'gardenWilt':return Infinity;case 'guideFollow':return Math.max(n,CALM_FOLLOW_BARS);
  case 'resonanceRing':return Math.max(n,CALM_RING_BEATS);case 'surfBand':return Math.max(n,CALM_SURF_BAND);default:return normal;}}
// The stars of a calm round: its ★, never ★★ or ★★★ (places.js gives them only with sound; a calm round counts as one
// without it, so the best share and the song's layer are not raised by the wider window).
export const calmStars=stars=>[stars?.[0]===true,false,false];
// The thing to reach next in each game, from its own state (journey-*.js): its gold thing once it is there; before, the
// circle of the storm, the next wave, a crystal that is not ringing, the harbour when a boat follows you, the nearest
// boat, bed or pillar. Null when the game has nothing to point at (the Cueva listens, the Lago and the Bosque glow).
export const GAME_STATES=Object.freeze({llanura:'journeyStick',lago:'journeyChain',bosque:'journeyLasso',tormenta:'journeyDance',vacio:'journeyRelease',jardin:'journeyGarden',
 dunas:'journeySurf',cristales:'journeyResonance',faros:'journeyGuide',ruinas:'journeyRebuild',cueva:'journeyEcho'});
const GOLD=Object.freeze({llanura:'cloud',lago:'flower',bosque:'friend',tormenta:'eye',vacio:'light',jardin:'tree',cristales:'gold',faros:'gold',ruinas:'gold',cueva:'gold'});
const pt=v=>plain(v)&&Number.isFinite(v.x)&&Number.isFinite(v.y)?{x:v.x,y:v.y}:null;
function nearest(list,me){let best=null,d=Infinity;for(const p of list){const q=pt(p);if(!q)continue;const k=Math.hypot(q.x-me.x,q.y-me.y);if(k<d){d=k;best=q;}}return best;}
export function calmTarget(id,st,me={x:0,y:0}){if(!plain(st)||!GAME_STATES[id])return null;const gold=pt(st[GOLD[id]]);
 if(id==='tormenta')return pt(st.target)||gold;if(gold)return gold;
 if(id==='dunas'){const w=(Array.isArray(st.waves)?st.waves:[]).filter(w=>w&&!w.ridden&&pt(w)).sort((a,b)=>a.at-b.at)[0];return w?pt(w):null;}
 if(id==='cristales'){const ring=new Set(Array.isArray(st.ringing)?st.ringing:[]);return nearest((st.spots||[]).filter((_,i)=>!ring.has(i)),me);}
 if(id==='faros'){const boats=Array.isArray(st.boats)?st.boats:[];return boats.some(b=>b?.lit)?pt(st.center):nearest(boats,me);}
 if(id==='jardin'){const beds=Array.isArray(st.beds)?st.beds:[];return nearest((st.spots||[]).filter((_,i)=>(beds[i]?.stage??0)<4),me)||nearest(st.spots||[],me);}
 if(id==='ruinas')return nearest(st.spots||[],me);
 return null;}
