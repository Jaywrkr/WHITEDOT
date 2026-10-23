import {calmMotion} from './frame-state.js';
// The Journey's chapter games (Jay's decision of 23 October): every chapter keeps one rule, only a pulse on time does
// something, and adds one verb of its own: stick in the Llanura, chain in the Lago, and so on (docs/VIAJE.md). Each
// game fills the bar at the top and ends with something gold that one last pulse on time closes. While they are
// prototypes, «?clasico=1» (or the older «?faro=1») keeps the previous chapters to compare.
export const classicJourney=(search=globalThis.location?.search)=>/[?&](faro|clasico)=1\b/.test(search||'');
// How much the beat is sounding now, 1 on the beat fading to 0 over two sixteenths: what things breathe with.
export function beatGlow(runtime){if(calmMotion(runtime.S)||!runtime.ac||!runtime.MU?.bq?.length)return 0;const now=runtime.ac.currentTime;let last=-Infinity;for(const b of runtime.MU.bq)if(b<=now)last=Math.max(last,b);return Math.max(0,1-(now-last)/((runtime.SIX||.15)*2));}
export const worldCamera=runtime=>({x:runtime.camX??runtime.S.wx,y:runtime.camY??runtime.S.wy});
// One short line said a moment later, dropped if by then the player has left the chapter (the notice lane may hold it).
export function chapterToast(runtime,id,text,delay=600,ttl=15000){setTimeout(()=>runtime.toast?.(text,{level:2,ttl,coalesce:false,force:true,valid:()=>!!runtime.journeyGamePlaying?.(id)}),delay);}
// The chapter's rule, once per save, a moment after it starts.
export function sayOnce(runtime,flags,key,text,id,delay=1500){if(flags[key])return false;flags[key]=true;runtime.save?.();chapterToast(runtime,id,text,delay,12000);return true;}
export function initialize(runtime){
 const games={};
 const game=id=>classicJourney()?null:games[id]||null;
 // A game is playing when its chapter is the current one, not yet kept, in the Journey's World, on the surface.
 // Or a round of its place after the Journey (places.js, plan F4), in the free World.
 const surface=()=>runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie';
 const playing=id=>{if(!game(id)||!surface())return false;if(runtime.placeRun?.()?.id===id)return true;const ch=runtime.journeyChapter?.();return !!(ch&&ch.id===id&&!ch.done?.[id]&&runtime.journeyQuiet?.());};
 const current=()=>runtime.placeRun?.()?.id||runtime.journeyChapter?.()?.id;
 const now=()=>{const id=current();return playing(id)?games[id]:null;};
 Object.defineProperties(runtime,{registerJourneyGame:{get:()=>(id,g)=>{games[id]=g;}},journeyGame:{get:()=>game},journeyGamePlaying:{get:()=>playing},
  journeyGamePulse:{get:()=>(on,beat)=>{const g=now();if(!g)return null;runtime.placeHear?.(current(),on,beat||{});return g.pulse(on,beat||{});}},journeyGameProgress:{get:()=>id=>game(id)?.progress()??null},
  drawJourneyGamesUnder:{get:()=>(c,W,H,t)=>now()?.under?.(c,W,H,t)},drawJourneyGames:{get:()=>(c,W,H,t)=>now()?.over?.(c,W,H,t)},
  cubeGrowth:{get:()=>()=>now()?.growth?.()||1}});
}
