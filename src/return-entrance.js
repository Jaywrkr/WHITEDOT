import {openSurface} from './frame-state.js';
// A short, silent greeting precedes the first guide and returning visits.
const phrases=['Otra voz te espera.','Volvamos a explorar.','Tu siguiente sonido está cerca.','El universo sigue sonando.','Escucha hacia dónde ir.','Hay otra música por descubrir.'];
export function initialize(runtime){
 const panel=runtime.$('returnEntrance');let timer=null,hiddenAt=null,guide=null;
 function close(){clearTimeout(timer);timer=null;if(!panel.hidden)panel.hidden=true;if(guide){guide.hidden=false;guide=null;}}
 function show(){
  // The Journey has no words (docs/VIAJE.md): it opens on black and the point of light, without a greeting.
  if(document.hidden||!panel.hidden||runtime.journeyQuiet?.())return false;
  const modal=openSurface('.modal:not([hidden])');if(modal&&modal.id!=='mHelpC')return false;
  if(modal){guide=modal;guide.hidden=true;}
  runtime.$('returnPhrase').textContent=phrases[runtime.seedOf('return:phrase:v1:'+(runtime.S.practiceTravel?.arrivals||0))%phrases.length];
  panel.hidden=false;clearTimeout(timer);timer=setTimeout(close,2400);return true;
 }
 runtime.$('returnContinue').onclick=close;
 // Escape also closes dialogs through the shared accessibility handler.
 new MutationObserver(()=>{if(panel.hidden)close();}).observe(panel,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){hiddenAt=Date.now();close();}
  else{if(hiddenAt!==null&&Date.now()-hiddenAt>90000)show();hiddenAt=null;}
 });
 Object.defineProperty(runtime,'showReturnEntrance',{get:()=>show});show();
}
