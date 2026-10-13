// A first visit has a direction, without obliging anyone to record a loop.
export const JOURNEY=['Camino','Escuchar un lugar','Transformar su música','Crear en el Estudio'];
export function journeyStep(state){return state.studio?3:state.transformed?2:state.world?1:0;}
export function initialize(runtime){
 const state=()=>runtime.S.creativeJourney||=( {world:false,transformed:false,studio:false} );
 let previousMode=null;
 function tick(dt,paused){
  if(runtime.inWorld())state().world=true;
  if(runtime.S.mode==='studio'&&state().transformed)state().studio=true;
  if(previousMode!==runtime.S.mode){previousMode=runtime.S.mode;runtime.S.help.creativeVisit??=false;if(runtime.inWorld()&&!runtime.S.help.creativeVisit){runtime.S.help.creativeVisit=true;runtime.say('Escucha este lugar. Toca algo, quédate junto a un aro o conecta un módulo. Después puedes llevar lo descubierto a tu Estudio.','Tu recorrido');}}
 }
 function action(){if(runtime.inWorld())state().transformed=true;}
 function card(){const s=state(),step=journeyStep(s);return `<article class="journal-card"><h3>Tu recorrido creativo</h3><p>${JOURNEY.map((name,i)=>`${i<=step?'●':'○'} ${name}`).join(' → ')}</p><p>Explora a tu ritmo. Fijar sonidos es opcional; el Estudio permite colocar y retirar muestras.</p></article>`;}
 Object.defineProperties(runtime,{creativeTick:{get:()=>tick},creativeAction:{get:()=>action},creativeCard:{get:()=>card}});
}
