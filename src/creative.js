import {openSurface} from './frame-state.js';
import {influenceProfile} from './influence.js';
// A first visit has a direction, without obliging anyone to record a loop.
export const JOURNEY=['Camino','Escuchar un lugar','Transformar su música','Crear en el Estudio'];
export function journeyStep(state){return state.studio?3:state.transformed?2:state.world?1:0;}
export function gestureHint(kind){if(kind.startsWith('encounter:'))return 'Toca, modela con el dedo o permanece cerca';return kind==='toy:rotor'?'Arrastra para girar · quédate para cultivar':kind==='toy:resonator'?'Arrastra para modelar · quédate para cultivar':kind.startsWith('forma:')?'Acércate para escuchar · toca para responder':'Toca para responder · escucha el cambio';}
export function advanceOpenChallenge(state,channel,verb){
 state.channels||=[];if(channel&&!state.channels.includes(channel))state.channels.push(channel);
 state.verbs||=[];if(verb&&!state.verbs.includes(verb))state.verbs.push(verb);
 state.done=state.channels.length>=2&&state.verbs.length>=2;return state.done;
}
export function initialize(runtime){
 runtime.VOZ.composicionAbierta='Tocar, quitar, cultivar, modelar. El lugar ya te responde.';
 runtime.ACH.push(['composicionAbierta','Otra forma de componer','Transforma dos partes musicales de dos maneras en un lugar.']);
 const modeButton=runtime.$('bCreateMode');
 function modeUI(){modeButton.setAttribute('aria-pressed',String(!!runtime.S.relaxedCreate));modeButton.querySelector('span').textContent=runtime.S.relaxedCreate?'Modo: crear':'Modo: explorar';}
 modeButton.onclick=()=>{runtime.S.relaxedCreate=!runtime.S.relaxedCreate;modeUI();runtime.save();runtime.hud();};modeUI();
 const state=()=>runtime.S.creativeJourney||=( {world:false,transformed:false,studio:false} );
 let previousMode=null,subtractIndex=0,gesture=null,lastAction=-Infinity,hintClock=0;
 const available=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'&&!runtime.scanning&&!document.hidden&&!openSurface('.modal:not([hidden])');
 function down(e){
  if(!available()||!e.isPrimary||gesture)return false;
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
 function tapSelf(x,y){if(runtime.jam?.loop.rec||runtime.jam?.loop.armed)return false;if(!runtime.inWorld()||Math.hypot(x-runtime.W/2,y-runtime.H/2)>Math.max(18,runtime.pxSize()/2+4))return false;const channel=['melody','groove','bass'][subtractIndex++%3],region=runtime.activeLayerRegion?.()||runtime.regionOfPos(runtime.S.wx,runtime.S.wy);runtime.subtractInfluence?.(region,channel);runtime.burst(runtime.S.wx,runtime.S.wy,3,false);runtime.showPhrase({melody:'Menos motivo',groove:'Menos percusión',bass:'Menos bajo'}[channel]);return true;}
 function rareFind(site){
  runtime.S.expressiveFinds||={};runtime.S.expressiveFinds[site.magical?'harmonic':'hold']=true;
  runtime.showPhrase(site.magical?'Descubriste la respiración armónica':'Descubriste el sostén');runtime.save();
 }
 function tick(dt,paused){
  if(!paused&&available()&&runtime.MU.speed<.05&&runtime.S.expressiveFinds?.hold){
   const nearest=(runtime.MU.near||[]).find(o=>o.kind==='resonator'&&Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<48);
   if(nearest){const region=runtime.regionOfPos(nearest.x,nearest.y),p=influenceProfile(region,'toy:resonator',nearest,runtime.seedOf,runtime.rng);runtime.driveInfluence(region,p.channel,.65,p.variant);if(runtime.S.expressiveFinds.harmonic)runtime.driveInfluence(region,'melody',.35,Math.floor((runtime.MU.step>>4)/4)%8);}
  }
  if(runtime.inWorld())state().world=true;
  if(!paused&&runtime.inWorld()){
   hintClock+=dt;
   if(hintClock>180&&runtime.MU.speed>.1){hintClock=0;runtime.say(state().transformed?'Ya cambiaste este lugar. Puedes seguir una pista, retirar una capa o entrar al Estudio.':'Quédate cerca de un aro para cultivar una parte; arrastrarlo también cambia su figura.','Una posibilidad');}
  }
  if(runtime.S.mode==='studio'&&state().transformed)state().studio=true;
  if(previousMode!==runtime.S.mode){previousMode=runtime.S.mode;runtime.S.help.creativeVisit??=false;if(runtime.inWorld()&&!runtime.S.help.creativeVisit){runtime.S.help.creativeVisit=true;if(!runtime.firstJourneyState?.next)runtime.say('Acerca el cubo a una criatura. Escucha cómo cambia la música.','Tu primera voz');}}
 }
 function action(channel,verb='touch'){
  if(!runtime.inWorld())return;lastAction=performance.now();hintClock=0;state().transformed=true;
  const region=runtime.activeLayerRegion?.()||runtime.regionOfPos(runtime.S.wx,runtime.S.wy),book=runtime.S.openChallenges||={};
  const challenge=book[region.key]||={channels:[],verbs:[],done:false},wasDone=challenge.done;
  if(advanceOpenChallenge(challenge,channel,verb)&&!wasDone){runtime.unlock('composicionAbierta');runtime.S.journal.creative||={};runtime.S.journal.creative[region.key]='Dos partes transformadas de dos maneras';}
 }
 function draw(){
  if(!runtime.inWorld()||runtime.scanning||document.hidden||openSurface('.modal:not([hidden])')||runtime.MU.speed>.12)return;
  const nearest=(runtime.MU.near||[]).filter(o=>o.kind==='rotor'||o.kind==='resonator').sort((a,b)=>Math.hypot(a.x-runtime.S.wx,a.y-runtime.S.wy)-Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy))[0];
  if(!nearest||Math.hypot(nearest.x-runtime.S.wx,nearest.y-runtime.S.wy)>65)return;
  if(runtime.nearbyMateria?.(200).length)return;   // la materia ya muestra su propia ayuda: no se pisan los textos
  const c=runtime.cx;c.save();c.globalAlpha=.65;c.fillStyle='#ddd';c.textAlign='center';c.font='10px "Geist Mono", monospace';c.fillText(runtime.fingerTouch?gestureHint('toy:'+nearest.kind):'Choca con el cubo · quédate cerca para cultivar',runtime.W/2,runtime.H/2+74,Math.min(300,runtime.W-32));c.restore();
 }
 function card(){const s=state(),step=journeyStep(s),challenges=Object.values(runtime.S.openChallenges||{}),done=challenges.filter(c=>c.done).length;return `<article class="journal-card"><h3>Tu recorrido creativo</h3><p>${JOURNEY.map((name,i)=>`${i<=step?'●':'○'} ${name}`).join(' → ')}</p><p>Explora a tu ritmo. Reto abierto: transforma dos partes de dos maneras distintas (tocar, cultivar, modelar o retirar). Lugares resueltos: ${done}. Toca tu punto blanco para retirar motivo, percusión o bajo por turnos. Las capas regresan suavemente. Los ecos antiguos enseñan a sostener una parte permaneciendo junto a un aro; una constelación rara añade evolución del motivo. Descubrimientos: ${['hold','harmonic'].filter(k=>runtime.S.expressiveFinds?.[k]).map(k=>k==='hold'?'sostén':'respiración armónica').join(", ")||"aún ninguno"}. Fijar sonidos es opcional; el Estudio permite colocar y retirar muestras.</p></article>`;}
 Object.defineProperties(runtime,{creativeModeUI:{get:()=>modeUI},lastCreativeAction:{get:()=>lastAction},rareCreativeFind:{get:()=>rareFind},creativePointerDown:{get:()=>down},creativePointerMove:{get:()=>move},creativePointerUp:{get:()=>up},creativeTap:{get:()=>tapSelf},creativeDraw:{get:()=>draw},gestureHint:{get:()=>gestureHint},creativeTick:{get:()=>tick},creativeAction:{get:()=>action},creativeCard:{get:()=>card}});
}
