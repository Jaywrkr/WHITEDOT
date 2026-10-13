import {influenceProfile} from './influence.js';
// A first visit has a direction, without obliging anyone to record a loop.
export const JOURNEY=['Camino','Escuchar un lugar','Transformar su música','Crear en el Estudio'];
export function journeyStep(state){return state.studio?3:state.transformed?2:state.world?1:0;}
export function gestureHint(kind){return kind==='toy:rotor'?'Arrastra para girar · quédate para cultivar':kind==='toy:resonator'?'Arrastra para modelar · quédate para cultivar':kind.startsWith('forma:')?'Acércate para escuchar · toca para responder':'Toca para responder · escucha el cambio';}
export function initialize(runtime){
 const state=()=>runtime.S.creativeJourney||=( {world:false,transformed:false,studio:false} );
 let previousMode=null,subtractIndex=0,gesture=null;
 const available=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'&&!runtime.scanning&&!document.hidden&&!document.querySelector('.modal:not([hidden])');
 function down(e){
  if(!available()||!e.isPrimary)return false;
  const x=runtime.S.wx+e.clientX-runtime.W/2,y=runtime.S.wy+e.clientY-runtime.H/2;
  const object=(runtime.MU.near||[]).find(o=>['rotor','resonator'].includes(o.kind)&&Math.hypot(o.x-x,o.y-y)<22);
  if(!object)return false;
  runtime.audio();gesture={id:e.pointerId,object,x:e.clientX,y:e.clientY,moved:false};
  try{runtime.$('w').setPointerCapture(e.pointerId);}catch(_){}return true;
 }
 function move(e){
  if(!gesture||e.pointerId!==gesture.id)return false;
  if(!available()){gesture=null;return true;}
  const {object,x,y}=gesture,dx=e.clientX-x,dy=e.clientY-y;
  if(Math.hypot(dx,dy)>10)gesture.moved=true;
  if(gesture.moved){const region=runtime.regionOfPos(object.hx,object.hy),p=influenceProfile(region,'toy:'+object.kind,object,runtime.seedOf,runtime.rng);object.rotation=dx/40;object.growth=Math.max(0,Math.min(1,.5-dy/120));runtime.driveInfluence(region,p.channel,Math.max(-1,Math.min(1,-dy/80)),Math.abs(Math.round(dx/25))%8);runtime.creativeAction(p.channel,'model');}
  return true;
 }
 function up(e){
  if(!gesture||e.pointerId!==gesture.id)return false;
  const g=gesture;gesture=null;
  if(e.type==='pointerup'&&available()&&!g.moved){runtime.beatSoon(g.object.snd);g.object.lit=1;runtime.creativeAction();}
  return true;
 }
 addEventListener('blur',()=>{gesture=null;});
 function tapSelf(x,y){if(runtime.jam?.loop.rec||runtime.jam?.loop.armed)return false;if(!runtime.inWorld()||Math.hypot(x-runtime.W/2,y-runtime.H/2)>18)return false;const channel=['melody','groove','bass'][subtractIndex++%3],region=runtime.activeLayerRegion?.()||runtime.regionOfPos(runtime.S.wx,runtime.S.wy);runtime.subtractInfluence?.(region,channel);runtime.burst(runtime.S.wx,runtime.S.wy,3,false);runtime.showPhrase({melody:'Menos motivo',groove:'Menos percusión',bass:'Menos bajo'}[channel]);return true;}
 function tick(dt,paused){
  if(runtime.inWorld())state().world=true;
  if(runtime.S.mode==='studio'&&state().transformed)state().studio=true;
  if(previousMode!==runtime.S.mode){previousMode=runtime.S.mode;runtime.S.help.creativeVisit??=false;if(runtime.inWorld()&&!runtime.S.help.creativeVisit){runtime.S.help.creativeVisit=true;runtime.say('Escucha este lugar. Toca algo, quédate junto a un aro o conecta un módulo. Después puedes llevar lo descubierto a tu Estudio.','Tu recorrido');}}
 }
 function action(){if(runtime.inWorld())state().transformed=true;}
 function draw(){
  if(!runtime.inWorld()||runtime.scanning||document.hidden||document.querySelector('.modal:not([hidden])')||runtime.MU.speed>.12)return;
  const nearest=(runtime.MU.near||[]).filter(o=>o.kind==='rotor'||o.kind==='resonator').sort((a,b)=>Math.hypot(a.x-runtime.S.wx,a.y-runtime.S.wy)-Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy))[0];
  if(!nearest||Math.hypot(nearest.x-runtime.S.wx,nearest.y-runtime.S.wy)>65)return;
  const c=runtime.cx;c.save();c.globalAlpha=.65;c.fillStyle='#ddd';c.textAlign='center';c.font='10px monospace';c.fillText(gestureHint('toy:'+nearest.kind),runtime.W/2,runtime.H/2+74,Math.min(300,runtime.W-32));c.restore();
 }
 function card(){const s=state(),step=journeyStep(s);return `<article class="journal-card"><h3>Tu recorrido creativo</h3><p>${JOURNEY.map((name,i)=>`${i<=step?'●':'○'} ${name}`).join(' → ')}</p><p>Explora a tu ritmo. Toca tu punto blanco para retirar motivo, percusión o bajo por turnos. Las capas regresan suavemente. Fijar sonidos es opcional; el Estudio permite colocar y retirar muestras.</p></article>`;}
 Object.defineProperties(runtime,{creativePointerDown:{get:()=>down},creativePointerMove:{get:()=>move},creativePointerUp:{get:()=>up},creativeTap:{get:()=>tapSelf},creativeDraw:{get:()=>draw},gestureHint:{get:()=>gestureHint},creativeTick:{get:()=>tick},creativeAction:{get:()=>action},creativeCard:{get:()=>card}});
}
