// Jay (28 Oct 2026, alpha.232, G3): once the eleven places are complete and their finale has closed, one short note
// says what is left: more stars in each place, the jump to another landscape (alpha.230: open only after the eleven,
// the first one free) and the endless universe. Once per save (`S.elevenNote.seen`); Lugares keeps it to read again.
// It never opens over a round, a finale or another sheet, and the finale's music is not touched.
import {allComplete,starCount,TOTAL_STARS} from './places.js';
export const ELEVEN_NOTE_VERSION=1;
const object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
// The saved note: unknown fields are kept; a future version counts as seen and is never rewritten.
export function normalizeElevenNote(raw){if(!object(raw))return {version:ELEVEN_NOTE_VERSION,seen:false};if(Number.isInteger(raw.version)&&raw.version>ELEVEN_NOTE_VERSION)return raw;return {...raw,version:ELEVEN_NOTE_VERSION,seen:raw.seen===true};}
export const elevenNoteSeen=raw=>{const n=normalizeElevenNote(raw);return n.version>ELEVEN_NOTE_VERSION||n.seen===true;};
// Whether the note is due now: the eleven complete and their finale already played (`won`), never seen.
export function elevenNoteDue(places,note){return !!places&&!places.readOnly&&places.won===true&&allComplete(places)&&!elevenNoteSeen(note);}
// The lines it shows: the stars line only while stars are left; the free jump only while it is still free.
export function elevenNoteLines(places,journey){return {stars:starCount(places)<TOTAL_STARS,free:journey?.freeJumpUsed!==true};}
export function initialize(runtime){
 const $=id=>globalThis.document?.getElementById(id);let shownHere=false;
 const data=()=>runtime.placesData?.();
 const busy=()=>!!globalThis.document?.querySelector('.modal:not([hidden]),#journeyFinale:not([hidden]),#songStage:not([hidden])')||!!runtime.songStageState?.()?.running||!!runtime.placeRun?.()||!runtime.inWorld?.()||!!runtime.houseActive?.();
 function fill(){const d=data(),lines=elevenNoteLines(d,runtime.S.journey);$('elevenStars').hidden=!lines.stars;$('elevenJump').textContent=lines.free?'Ya puedes saltar a otro paisaje. El primer salto es gratis.':'Ya puedes saltar a otro paisaje.';}
 // Shown once: the save remembers it; if writing fails it stays unseen on disk and is not shown again this session.
 function show({again=false}={}){const box=$('mEleven');if(!box)return false;fill();box.hidden=false;
  if(!again){shownHere=true;const before=runtime.S.elevenNote;runtime.S.elevenNote={...normalizeElevenNote(before),seen:true};if(runtime.save?.()===false){if(before===undefined)delete runtime.S.elevenNote;else runtime.S.elevenNote=before;}}
  return true;}
 function explore(){const box=$('mEleven');if(box)box.hidden=true;runtime.hud?.();}
 function check(){if(shownHere||busy())return false;const d=data();if(!elevenNoteDue(d,runtime.S.elevenNote))return false;return show();}
 if($('elevenExplore'))$('elevenExplore').onclick=explore;
 // Lugares keeps the note to read again once the eleven are complete.
 const link=$('lugaresEleven'),lugares=$('mLugares');
 function linkState(){if(link){const d=data();link.hidden=!d||d.readOnly||!allComplete(d);}}
 if(link)link.onclick=()=>{if(lugares)lugares.hidden=true;show({again:true});};
 if(lugares&&globalThis.MutationObserver)new MutationObserver(()=>{if(!lugares.hidden)linkState();}).observe(lugares,{attributes:true,attributeFilter:['hidden']});
 linkState();setInterval(check,400);
 Object.defineProperties(runtime,{elevenNoteCheck:{get:()=>check},openElevenNote:{get:()=>()=>show({again:true})},elevenNoteState:{get:()=>()=>({seen:elevenNoteSeen(runtime.S.elevenNote),open:!$('mEleven')?.hidden,shownHere})}});
}
