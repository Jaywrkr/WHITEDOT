import {openSurface,calmMotion} from './frame-state.js';
import {beatGlow} from './journey-games.js';
// The first pulse (plan F12, docs/MUNDO.md): someone who has not pulsed yet, in the Camino or a chapter of the Journey,
// sees the bar at the top beat softly with the music after a few seconds, so the beat is seen before it is understood.
// Before the sound starts (a phone starts it on the first touch) it beats at 120 BPM. The first pulse ends it.
export const BAR_HINT_AFTER=5000;
// How bright the bar is at a moment of the beat: 1 on it, fading over the first half of the beat.
export const barBeat=(ms,beatMs=500)=>{const k=((ms%beatMs)+beatMs)%beatMs/beatMs;return Math.max(0,1-k*2);};
export function initialize(runtime){
 let shown=false,readyAt=null;
 const pulses=()=>{const s=runtime.journeyPulseState?.()||{};return (s.hits||0)+(s.misses||0);};
 const where=()=>runtime.S.mode==='camino'||!!(runtime.journeyQuiet?.()&&runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie'&&!runtime.placeRun?.());
 // Five seconds counted from when nothing covers the game (the Camino's welcome, a sheet): not from the page loading.
 const wanted=()=>{const ready=pulses()===0&&where()&&!document.hidden&&!openSurface('.modal:not([hidden])')&&!runtime.journeyFinaleState?.().running;if(!ready){readyAt=null;return false;}readyAt??=performance.now();return performance.now()-readyAt>=BAR_HINT_AFTER;};
 function tick(){const bar=document.getElementById('bar');if(!bar)return;
  if(!wanted()){if(shown){bar.classList.remove('beat-hint');bar.style.removeProperty('--beat');shown=false;}return;}
  shown=true;bar.classList.add('beat-hint');const live=runtime.ac?.state==='running'&&runtime.MU?.bq?.length,b=calmMotion(runtime.S)?.5:live?beatGlow(runtime):barBeat(performance.now());bar.style.setProperty('--beat',b.toFixed(2));}
 Object.defineProperties(runtime,{barBeatHint:{get:()=>tick},barBeatHintState:{get:()=>()=>({shown,pulses:pulses()})}});
}
