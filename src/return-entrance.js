// A short, silent greeting for experienced players. First-time guidance stays intact.
const phrases=['Otra voz te espera.','Volvamos a explorar.','Tu siguiente sonido está cerca.','El universo sigue sonando.','Escucha hacia dónde ir.','Hay otra música por descubrir.'];
export function initialize(runtime){
 const panel=runtime.$('returnEntrance');let timer=null,hiddenAt=null;
 function close(){clearTimeout(timer);timer=null;panel.hidden=true;}
 function show(){
  if(!runtime.scopeHadSave||!runtime.S.help.camino||runtime.firstJourneyState?.next||document.hidden||document.querySelector('.modal:not([hidden])'))return false;
  runtime.$('returnPhrase').textContent=phrases[runtime.seedOf('return:phrase:v1:'+(runtime.S.practiceTravel?.arrivals||0))%phrases.length];
  panel.hidden=false;const reduced=runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  clearTimeout(timer);timer=setTimeout(close,reduced?700:1400);return true;
 }
 runtime.$('returnContinue').onclick=close;
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){hiddenAt=Date.now();close();}
  else{if(hiddenAt!==null&&Date.now()-hiddenAt>90000)show();hiddenAt=null;}
 });
 Object.defineProperty(runtime,'showReturnEntrance',{get:()=>show});show();
}
