// App instalable y sin gestos del navegador: evita zoom, rebote y arrastres que muevan la página.
export function initialize(runtime){
 const scrollable=el=>el?.closest?.('.scroll,#atlasBody,.atlas-filters,.voice.expanded,.journal-tabs');
 document.addEventListener('touchmove',e=>{if(e.touches.length>1||!scrollable(e.target))e.preventDefault();},{passive:false});
 for(const ev of ['gesturestart','gesturechange','gestureend'])document.addEventListener(ev,e=>e.preventDefault(),{passive:false});
 document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});
 let lastTouch=0;document.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTouch<300&&!scrollable(e.target)&&e.target.id==='w')e.preventDefault();lastTouch=now;},{passive:false});
 if('serviceWorker' in navigator&&location.protocol==='https:')addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
 runtime.standalone=matchMedia?.('(display-mode: standalone), (display-mode: fullscreen)').matches||navigator.standalone===true;
}
