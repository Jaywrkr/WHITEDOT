import {audibleTime} from './journey-pulse.js';
import {calmMotion} from './frame-state.js';
// The Journey's chapter games (Jay's decision of 23 October): every chapter keeps one rule, only a pulse on time does
// something, and adds one verb of its own: stick in the Llanura, chain in the Lago, and so on (docs/VIAJE.md). Each
// game fills the bar at the top and ends with something gold that one last pulse on time closes. While they are
// prototypes, «?clasico=1» (or the older «?faro=1») keeps the previous chapters to compare.
export const classicJourney=(search=globalThis.location?.search)=>/[?&](faro|clasico)=1\b/.test(search||'');
// How much the beat is sounding now, 1 on the beat fading to 0 over two sixteenths: what things breathe with.
export function beatGlow(runtime){if(calmMotion(runtime.S)||!runtime.ac||!runtime.MU?.bq?.length)return 0;const now=audibleTime(runtime.ac);let last=-Infinity;for(const b of runtime.MU.bq)if(b<=now)last=Math.max(last,b);return Math.max(0,1-(now-last)/((runtime.SIX||.15)*2));}
export const worldCamera=runtime=>({x:runtime.camX??runtime.S.wx,y:runtime.camY??runtime.S.wy});
// A lesson is learned only after its notice was actually presented, never while merely queued.
const lessonTickets=new WeakMap();
export function chapterToast(runtime,id,text,delay=600,ttl=15000,onShown=()=>{}){
 const owner=runtime.S;if(!owner||owner.journey?.version>1||!runtime.placeRun?.()&&runtime.journeyQuiet?.())return false;
 if(owner.journey?.lines?.[text])return false;let pending=lessonTickets.get(owner);if(!pending){pending=new Map();lessonTickets.set(owner,pending);}const key=id+':'+text,now=performance.now();if((pending.get(key)||0)>now)return false;pending.set(key,now+delay+ttl+1000);
 const valid=()=>runtime.S===owner&&!(owner.journey?.version>1)&&!!runtime.journeyGamePlaying?.(id);
 setTimeout(()=>{if(!valid()){pending.delete(key);return;}const accepted=runtime.toast?.(text,{level:2,category:'aprendizaje',ttl,coalesce:false,force:true,valid,onShown:()=>{if(!valid())return;pending.delete(key);const j=owner.journey||(owner.journey={}),had=Object.hasOwn(j,'lines'),old=j.lines,entry=old&&typeof old==='object'?Object.getOwnPropertyDescriptor(old,text):null;j.lines=old&&typeof old==='object'&&!Array.isArray(old)?old:{};j.lines[text]=true;const undo=onShown();if(runtime.save?.()===false){if(entry)Object.defineProperty(j.lines,text,entry);else delete j.lines[text];if(had)j.lines=old;else delete j.lines;undo?.();pending.set(key,performance.now()+5000);}}});if(accepted===false||accepted==null)pending.delete(key);},delay);return true;
}
export function sayOnce(runtime,flags,key,text,id,delay=1500){if(flags[key])return false;return chapterToast(runtime,id,text,delay,12000,()=>{const old=flags[key];flags[key]=true;return ()=>{if(old===undefined)delete flags[key];else flags[key]=old;};});}
// Recoverable, silent explanations for every existing verb. One step at a time, no permanent HUD.
export const PLACE_LESSONS=Object.freeze({
 llanura:['Acércate a lo que brilla.','Pulsa en el golpe para que se pegue.','Llena la barra. Pulsa la nube dorada.'],
 lago:['Acércate a una flor.','Pulsa en el golpe: la onda conecta flores.','Pulsa la flor dorada al llenar la barra.'],
 bosque:['Rodea un grupo de luciérnagas.','Cierra la vuelta y pulsa en el golpe.','Pulsa la criatura dorada al llenar la barra.'],
 tormenta:['Entra en el círculo.','Pulsa cuando llega el rayo, siguiendo la Línea.','Pulsa el ojo dorado al llenar la barra.'],
 vacio:['Pulsa en el primer golpe del compás.','Muévete para dejar espacio entre estrellas.','Pulsa tu luz dorada al llenar la barra.'],
 jardin:['Entra en un círculo vacío.','En el golpe siembras; entre golpes riegas.','Al florecer, pulsa en el golpe para cosechar.'],
 dunas:['Espera dentro del círculo.','Pulsa entre golpes cuando pase la ola.','Sube a la ola dorada para terminar.'],
 cristales:['Acércate a un grupo de cristales.','Sigue la Línea: haz resonar tres distintos juntos.','Pulsa el cristal dorado para terminar.'],
 faros:['Acércate a un barco.','Sigue la Línea para encenderlo y guiarlo.','Llévalos al puerto. Enciende el barco dorado.'],
 ruinas:['Ponte junto a una columna.','Sigue la Línea para colocar sus piedras.','Coloca la piedra dorada para terminar.'],
 cueva:['Escucha y mira la frase de la cueva.','Repítela con tus pulsos.','Atrapa la gota dorada para terminar.']
});
// The chapter/round owns the save: never persist a closed object before its reward commits.
export const commitJourneyClose=(runtime,id)=>runtime.journeyComplete?runtime.journeyComplete(id)!==false:runtime.save?.()!==false;
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
  drawJourneyGamesUnder:{get:()=>(c,W,H,t)=>now()?.under?.(c,W,H,t)},drawJourneyGames:{get:()=>(c,W,H,t)=>{const g=now();if(!g)return;g.over?.(c,W,H,t);runtime.drawRhythmGuide?.(c,W,H,t);}},
  cubeGrowth:{get:()=>()=>now()?.growth?.()||1}});
}
