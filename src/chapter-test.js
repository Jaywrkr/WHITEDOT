import {CHAPTERS} from './journey-chapters.js';
// A chapter on its own, to test it (plan F0, docs/MUNDO.md): «?capitulo=lago» opens the Journey right in that chapter,
// with the ones before it kept, on a save of its own and without an account, so it never touches the player's game
// or the cloud. Every load starts the chapter again from an empty bar.
export const CHAPTER_TEST_KEY='kubono:capitulo';
export const TEST_CHAPTERS=Object.freeze(['llanura','lago','bosque','tormenta','vacio']);
// Each chapter game keeps its state under its own name in S.journey.
export const CHAPTER_GAME_STATE=Object.freeze({llanura:'stick',lago:'chain',bosque:'lasso',tormenta:'dance',vacio:'release'});
export function chapterTest(search=globalThis.location?.search){try{const id=new URLSearchParams(search||'').get('capitulo');return TEST_CHAPTERS.includes(id)?id:null;}catch(_){return null;}}
// The save as it should be on arrival: the Camino and earlier chapters done, this chapter fresh.
export function prepareChapterTest(S,id){const j=S.journey||(S.journey={}),index=CHAPTERS.indexOf(id);if(index<1)return false;
 j.mode='viaje';j.done=j.done&&typeof j.done==='object'?j.done:{};for(const k of TEST_CHAPTERS.slice(0,index-1))j.done[k]=true;for(const k of TEST_CHAPTERS.slice(index-1))delete j.done[k];
 delete j[CHAPTER_GAME_STATE[id]];if(j.progress)delete j.progress[id];j.chapter=index===1?0:index-1;
 if(S.firstJourney&&typeof S.firstJourney==='object')S.firstJourney.skipped=true;S.help={...(S.help&&typeof S.help==='object'?S.help:{}),camino:true,mundo:true};S.pathCrystals=Array.from({length:10},(_,i)=>'capitulo:'+i);return true;}
export function initialize(runtime){
 const id=chapterTest();Object.defineProperty(runtime,'chapterTest',{get:()=>id});if(!id)return;
 // Once the game is ready: into the World, and through to the chapter's place.
 let tries=0;const start=()=>{if(!runtime.S?.journey||!runtime.journeyChapter||!runtime.enterWorld||!runtime.worldReady){if(tries++<200)setTimeout(start,50);return;}
  prepareChapterTest(runtime.S,id);for(const m of ['mHelpC','mHelpW','returnEntrance'])runtime.$?.(m)&&(runtime.$(m).hidden=true);runtime.applyJourneyMode?.();runtime.save?.();if(runtime.worldReady())runtime.enterWorld({automatic:true});
  if(CHAPTERS.indexOf(id)>1)setTimeout(()=>{runtime.journeyTravel?.();runtime.save?.();},300);};
 setTimeout(start,0);
}
