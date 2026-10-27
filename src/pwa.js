// App instalable y sin gestos del navegador: evita zoom, rebote y arrastres que muevan la página.
export function initialize(runtime){
 const scrollable=el=>el?.closest?.('.scroll,.modal .sheet,.glasspanel,#atlasBody,.atlas-filters,.voice.expanded,.journal-tabs,#fxPad');
 document.addEventListener('touchmove',e=>{if(e.touches.length>1||!scrollable(e.target))e.preventDefault();},{passive:false});
 for(const ev of ['gesturestart','gesturechange','gestureend'])document.addEventListener(ev,e=>e.preventDefault(),{passive:false});
 document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});
 let lastTouch=0;document.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTouch<300&&!scrollable(e.target)&&e.target.id==='w')e.preventDefault();lastTouch=now;},{passive:false});
 const update=runtime.$('pwaUpdate');let registration=null,reloading=false,pendingReload=false,hadController=!!navigator.serviceWorker?.controller;
 const offer=()=>{if(update)update.hidden=!(registration?.waiting||pendingReload);};
 if('serviceWorker' in navigator){
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
   if(!hadController){hadController=true;return;}
   if(!reloading&&registration?.active){if(runtime.setRecording){pendingReload=true;offer();runtime.toast('Termina la grabación antes de recargar la nueva versión.');return;}runtime.S.collected=[...runtime.collected];if(!runtime.save()){pendingReload=true;offer();runtime.toast('Hay progreso sin guardar. Exporta una copia antes de recargar la nueva versión.');return;}reloading=true;location.reload();}
  });
  // The itch.io build (scripts/itch-package.mjs) turns the worker off: the game runs framed from itch's CDN.
  if(location.protocol==='https:'&&!document.querySelector?.('meta[name="kubono-service-worker"][content="off"]'))addEventListener('load',async()=>{try{
   registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});offer();
   registration.addEventListener('updatefound',()=>registration.installing?.addEventListener('statechange',offer));
  }catch(_){} });
 }
 if(update)update.onclick=()=>{
  if(runtime.setRecording){runtime.toast('Termina la grabación antes de actualizar.');return;}
  runtime.S.collected=[...runtime.collected];if(!runtime.save()){runtime.toast('No se pudo guardar. Actualiza más tarde.');return;}
  runtime.stopAutopilot?.();if(pendingReload){location.reload();return;}registration?.waiting?.postMessage({type:'APPLY_UPDATE'});
 };
 runtime.standalone=matchMedia?.('(display-mode: standalone), (display-mode: fullscreen)').matches||navigator.standalone===true;
}
