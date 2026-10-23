import {CHAPTERS} from './journey-chapters.js';
// A chapter on its own, to test it (plan F0, docs/MUNDO.md): «?capitulo=lago» opens the Journey right in that chapter,
// with the ones before it kept, on a save of its own and without an account, so it never touches the player's game
// or the cloud. Every load starts the chapter again from an empty bar.
export const CHAPTER_TEST_KEY='kubono:capitulo';
export const TEST_CHAPTERS=Object.freeze(['llanura','lago','bosque','tormenta','vacio']);
// Each chapter game keeps its state under its own name in S.journey.
export const CHAPTER_GAME_STATE=Object.freeze({llanura:'stick',lago:'chain',bosque:'lasso',tormenta:'dance',vacio:'release'});
// «?lugar=lago» (plan F4): a round of that place after the Journey, on its own save; «&maestro=1» plays the Maestro one.
export const PLACE_TEST_KEY='kubono:lugar';
export function placeTest(search=globalThis.location?.search){try{const q=new URLSearchParams(search||''),id=q.get('lugar');return TEST_CHAPTERS.includes(id)?{id,maestro:q.get('maestro')==='1'}:null;}catch(_){return null;}}
export function chapterTest(search=globalThis.location?.search){try{const id=new URLSearchParams(search||'').get('capitulo');return TEST_CHAPTERS.includes(id)?id:null;}catch(_){return null;}}
// The save as it should be on arrival: the Camino and earlier chapters done, this chapter fresh.
export function prepareChapterTest(S,id){const j=S.journey||(S.journey={}),index=CHAPTERS.indexOf(id);if(index<1)return false;
 j.mode='viaje';j.done=j.done&&typeof j.done==='object'?j.done:{};for(const k of TEST_CHAPTERS.slice(0,index-1))j.done[k]=true;for(const k of TEST_CHAPTERS.slice(index-1))delete j.done[k];
 delete j[CHAPTER_GAME_STATE[id]];if(j.progress)delete j.progress[id];j.chapter=index===1?0:index-1;
 if(S.firstJourney&&typeof S.firstJourney==='object')S.firstJourney.skipped=true;S.help={...(S.help&&typeof S.help==='object'?S.help:{}),camino:true,mundo:true};S.pathCrystals=Array.from({length:10},(_,i)=>'capitulo:'+i);return true;}
export function initialize(runtime){
 const id=chapterTest(),place=placeTest();Object.defineProperty(runtime,'chapterTest',{get:()=>id});
 if(place){let tries=0;const go=()=>{if(!runtime.S?.journey||!runtime.startPlace||!runtime.enterWorld||!runtime.worldReady){if(tries++<200)setTimeout(go,50);return;}
  // The Journey finished: every chapter kept, the free World open; then the round (and its ★★ first, for a Maestro one).
  const S=runtime.S,j=S.journey;j.mode='viaje';j.free=true;j.finished=true;j.chapter=6;j.done={...(j.done||{}),llanura:true,lago:true,bosque:true,tormenta:true,vacio:true};S.pathCrystals=Array.from({length:10},(_,i)=>'lugar:'+i);S.help={...(S.help||{}),camino:true,mundo:true};if(S.firstJourney&&typeof S.firstJourney==='object')S.firstJourney.skipped=true;
  for(const m of ['mHelpC','mHelpW','returnEntrance'])runtime.$?.(m)&&(runtime.$(m).hidden=true);runtime.applyJourneyMode?.();runtime.save?.();if(runtime.worldReady())runtime.enterWorld({automatic:true});
  if(place.maestro){const st=runtime.S.lugares?.stars?.[place.id];if(st)st[1]=true;else{runtime.places?.();runtime.S.lugares.stars[place.id][1]=true;}}runtime.startPlace(place.id,{maestro:place.maestro});};setTimeout(go,0);return;}
 if(!id)return;
 // Once the game is ready: into the World, and through to the chapter's place.
 let tries=0;const start=()=>{if(!runtime.S?.journey||!runtime.journeyChapter||!runtime.enterWorld||!runtime.worldReady){if(tries++<200)setTimeout(start,50);return;}
  prepareChapterTest(runtime.S,id);for(const m of ['mHelpC','mHelpW','returnEntrance'])runtime.$?.(m)&&(runtime.$(m).hidden=true);runtime.applyJourneyMode?.();runtime.save?.();if(runtime.worldReady())runtime.enterWorld({automatic:true});
  if(CHAPTERS.indexOf(id)>1)setTimeout(()=>{runtime.journeyTravel?.();runtime.save?.();},300);};
 setTimeout(start,0);
}
