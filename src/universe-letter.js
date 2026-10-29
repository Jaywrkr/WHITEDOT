// Carta del universo (Jay, 29 Oct 2026, alpha.236, «Ganas de volver»): opening the game after a few hours away, one short
// line says something that happened in the universe meanwhile («Una ola gigante pasó por el Lago»). It comes from real
// data of the game: the living encounters of each biome (live-encounters-model.js) and the constellations of the Mapa
// del cielo you joined, preferring what you met or the places you saw. Chosen with hashKey of the day, once per opening,
// silent: a small notice in the shared lane (ui.js toast) that a tap closes. Never in the Journey or the quiet view,
// never during a level, over a sheet or with the universe's texts off. No humans in the universe, no reward.
import {hashKey} from './universe-regions.js';
import {LIVE_ENCOUNTERS} from './live-encounters-model.js';
import {SKY_FIGURES} from './sky-map-model.js';
import {freeOpen} from './journey-mode.js';
export const LETTER_VERSION=1;
// How long away before a letter: a few hours (four).
export const LETTER_AWAY_MS=4*3600e3;
// How often the time seen is written while the game is open.
export const LETTER_BEAT_MS=30e3;
// A letter shows this long; a tap closes it before.
export const LETTER_SECONDS=7;
export const LETTER_TITLE='Mientras no estabas';
// Each biome with its article, as the line says it.
export const LETTER_PLACES=Object.freeze({llanura:'la Llanura',bosque:'el Bosque',lago:'el Lago',ruinas:'las Ruinas',jardin:'el Jardín',dunas:'las Dunas',cristales:'los Cristales',faros:'los Faros',tormenta:'la Tormenta',cueva:'la Cueva',vacio:'el Vacío'});
// What each living encounter did while you were away. «Tu reflejo» and «Tu eco» are yours: they wait for you.
export const LETTER_DEEDS=Object.freeze({
 polilla:'Una polilla de luz voló por {}.',racimo:'Un racimo saltarín saltó por {}.',pez:'Un pez de onda nadó por {}.',tambor:'Un tambor rodante rodó por {}.',
 semilla:'Una semilla traviesa rebotó por {}.',cometa:'Una cometa cruzó el viento de {}.',pulsar:'Un púlsar fugaz brilló sobre {}.',llamarada:'Una llamarada viva bailó en {}.',
 estrella:'Una estrella fugaz cruzó {}.',remolino:'Un remolino de polvo giró en {}.',enjambre:'Un enjambre volvió a su panal en {}.',ola:'Una ola gigante pasó por {}.',
 derrumbe:'Unas piedras cayeron al compás en {}.',polen:'Una nube de polen flotó sobre {}.',arena:'Una tormenta de arena cruzó {}.',rayos:'Los rayos del prisma se abrieron en {}.',
 ondas:'Las ondas de un púlsar llegaron a {}.',llamaradas:'Llovieron llamaradas sobre {}.',pozo:'Un pozo respiró hondo en {}.',agujero:'Un agujero negro bostezó en {}.',
 motas:'Cinco motas se juntaron en {}.',estrellita:'Una estrellita perdida buscó su camino en {}.',burbujas:'Unas burbujas subieron al ritmo en {}.',guardian:'Un guardián de piedra se desperezó en {}.',
 brotes:'Cinco brotes asomaron en {}.',caravana:'Una caravana acampó en {}.',nodos:'Unos nodos sonaron solos en {}.',pulsares:'Cuatro púlsares se encendieron en {}.',
 antena:'Una antena se balanceó en {}.',luciernagas:'Unas luciérnagas salieron del pozo en {}.',constelacion:'Una constelación se dibujó en {}.'});
export const FIGURE_DEED='{} brilló un rato sobre el Refugio.';
const object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const count=v=>Number.isSafeInteger(v)&&v>0?v:0;
// The saved letter: when the game was last seen open (ms), how many letters came and the last one. Unknown fields kept;
// a future version is only read.
export function normalizeLetter(raw){if(object(raw)&&Number.isInteger(raw.version)&&raw.version>LETTER_VERSION)return raw;const q=object(raw)?raw:{};
 return {...q,version:LETTER_VERSION,seenAt:Number.isFinite(q.seenAt)&&q.seenAt>0?q.seenAt:0,count:count(q.count),last:object(q.last)&&typeof q.last.text==='string'?{day:typeof q.last.day==='string'?q.last.day:'',text:q.last.text.slice(0,200)}:null};}
// Due when the game was seen before and has been away a few hours. A first opening has nothing to tell.
export const letterDue=(letter,now)=>!!letter&&!(letter.version>LETTER_VERSION)&&letter.seenAt>0&&now-letter.seenAt>=LETTER_AWAY_MS;
// The lines it may say, from real data: encounters you met, those of the places you saw and the constellations you
// joined; with none of these yet, any encounter of the universe.
export function letterPool(state={}){
 const met=new Set(Object.keys(object(state.liveEncounters?.kinds)?state.liveEncounters.kinds:{})),seen=new Set(Object.keys(object(state.lugares?.seen)?state.lugares.seen:{}).filter(id=>state.lugares.seen[id]===true));
 const deed=d=>({id:'live:'+d.id,text:LETTER_DEEDS[d.id].replace('{}',LETTER_PLACES[d.biome])});
 const live=LIVE_ENCOUNTERS.filter(d=>LETTER_DEEDS[d.id]&&LETTER_PLACES[d.biome]),mine=live.filter(d=>met.has(d.id)||seen.has(d.biome)).map(deed);
 const figures=object(state.skyMap?.figures)?SKY_FIGURES.filter(f=>count(state.skyMap.figures[f.id]?.done)>0).map(f=>({id:'sky:'+f.id,text:FIGURE_DEED.replace('{}',f.name)})):[];
 const pool=[...mine,...figures];return pool.length?pool:live.map(deed);}
// The day's letter: hashKey of the day and of how many letters came, so two openings on one day can differ.
export function letterFor(state,day,n=0){const pool=letterPool(state);return pool[Math.min(pool.length-1,Math.floor(hashKey('carta:v1:'+day+':'+n)*pool.length))];}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const letterHTML=text=>`<em>${LETTER_TITLE}</em><br>${escape(text)}`;
export function initialize(runtime){
 const $=id=>globalThis.document?.getElementById(id);let owner=null,pending=null,shown=null,frozen=false,hiddenAt=null;
 function own(){const S=runtime.S;if(owner!==S||S.universeLetter?.version===undefined){owner=S;S.universeLetter=normalizeLetter(S.universeLetter);}return S.universeLetter;}
 // On opening: was the game away a few hours? Read before the first beat writes the time again.
 function arm(now=Date.now()){const q=own();if(letterDue(q,now))pending={at:now};}
 // Busy: the Journey or the quiet view, a level, a sheet or dialog, an activity, a living encounter, the finales, or
 // the universe's texts switched off. The letter waits for a free moment of this opening.
 const busy=()=>!!runtime.journeyQuiet?.()||!freeOpen(runtime.S.journey)||!!runtime.placeRun?.()||!!runtime.placeCardDue?.()||!!runtime.activityActive||!!runtime.liveEncounterActive?.()||!!runtime.songStageState?.()?.running||runtime.S.universeTexts===false||!!globalThis.document?.querySelector('.modal:not([hidden]),#journeyFinale:not([hidden]),#songStage:not([hidden]),#returnEntrance:not([hidden])')||!!globalThis.document?.hidden||document.body.classList.contains('first-journey');
 function show(){const q=own();if(q.version>LETTER_VERSION||!pending||busy())return false;const day=runtime.S.todayKey||new Date().toISOString().slice(0,10),letter=letterFor(runtime.S,day,q.count);if(!letter){pending=null;return false;}
  const el=$('toast'),lane=runtime.noticeLane;if(!el||!lane)return false;
  const ok=lane.enqueue('toast',el,()=>{el.innerHTML=letterHTML(letter.text);},LETTER_SECONDS,'carta:'+day+':'+q.count,()=>true,{category:'carta',detail:'carta',ttl:60000});
  if(!ok)return false;pending=null;shown={id:letter.id,text:letter.text,day};const before={...q};q.count++;q.last={day,text:letter.text};q.seenAt=Date.now();if(runtime.save?.()===false)Object.assign(q,before);return true;}
 // While open, the time seen is written now and then (and when the page hides), so the next opening knows the gap.
 function beat(force=false){if(frozen||!force&&globalThis.document?.hidden)return;const q=own();if(q.version>LETTER_VERSION)return;q.seenAt=Date.now();}
 const el=$('toast');if(el){el.addEventListener('click',()=>{if(el.dataset.detail==='carta')runtime.noticeLane?.cancel('toast');});}
 globalThis.document?.addEventListener('visibilitychange',()=>{if(document.hidden){hiddenAt=Date.now();beat(true);runtime.save?.();}else{const away=hiddenAt;hiddenAt=null;if(away!==null&&!frozen){const q=own();if(letterDue({...q,seenAt:away},Date.now()))pending={at:Date.now()};}beat();}});
 globalThis.addEventListener?.('pagehide',()=>{beat(true);if(!frozen)runtime.save?.();});
 arm();const wasDue=!!pending;beat();
 setInterval(()=>{if(pending)show();},500);setInterval(()=>beat(),LETTER_BEAT_MS);
 Object.defineProperties(runtime,{universeLetterCheck:{get:()=>show},universeLetterState:{get:()=>()=>({pending:!!pending,shown,wasDue,busy:busy(),...own()})},
  // Test hook: pretend the last time seen was `hours` ago and stop writing it in this page (the next opening reads it).
  universeLetterAway:{get:()=>hours=>{frozen=true;own().seenAt=Date.now()-hours*3600e3;return runtime.save?.()!==false;}}});
}
