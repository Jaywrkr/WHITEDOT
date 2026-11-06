// Niveles en orden: la frontera (Jay, 6 Nov 2026; rules in frontier-model.js; docs/MUNDO.md#niveles-en-orden-frontera).
// Each frame of the World (render.js, frontierStep): the call of the next place without ★, its round started by itself,
// the soft edge you cannot walk past until its ★, jumps kept inside, and the sheet after a try without ★ («Otra vez»,
// «Más fácil» after three tries, «Salir»). Loaded by the ring (places-ring.js). No sound: the edge is a faint line.
// Automated browsers keep the old open World unless «?abierto=1» or «?frontera=1» asks for the player's one, as
// journey-mode.js does for the start.
import {openSurface} from './frame-state.js';
import {PLACES,complete} from './places.js';
import {frontierOf,clampStep,clampJump,isJump,insideSpot,normalizeFrontier,frontierWritable,assistOffered,callLine,FRONTIER_INSIDE,FRONTIER_REARM,FRONTIER_SOFT,CALL_SECONDS,RECALL_SECONDS} from './frontier-model.js';
function wanted(){try{const q=new URLSearchParams(globalThis.location?.search||'');if(q.get('frontera')==='1'||q.get('abierto')==='1')return true;return !globalThis.navigator?.webdriver;}catch(_){return true;}}
export function initialize(runtime){
 const $=id=>runtime.$?.(id)||globalThis.document?.getElementById?.(id)||null,on=wanted();
 let owner=null,state=null,last=null,armed=true,call=null,pushT=0,watch=null,live=false,sheet=null,edge=null;
 function own(){if(owner!==runtime.S){owner=runtime.S;runtime.S.frontera=normalizeFrontier(runtime.S.frontera);state=runtime.S.frontera;last=null;armed=true;call=null;pushT=0;watch=null;}return state;}
 const data=()=>runtime.placesData?.()||null;
 const active=()=>!!runtime.ringActive?.()&&(runtime.S.layer||'superficie')==='superficie';
 const frontier=()=>on&&runtime.S?frontierOf(data(),runtime.S.journey):null;
 const name=id=>PLACES.find(p=>p.id===id)?.name||id;
 const kids=()=>!!runtime.tranquilo?.();
 const pos=()=>({x:runtime.S.wx,y:runtime.S.wy});
 function place(q){runtime.S.wx=q.x;runtime.S.wy=q.y;last={x:q.x,y:q.y};}
 // Into the round, as through its portal: from just inside the place's distance, where «Salir» brings you back.
 function begin(id,{assist=false}={}){const f=frontier(),d=data();if(!f||f.id!==id||!d||runtime.placeRun?.())return false;const p=pos(),from=Math.hypot(p.x,p.y)>f.R-FRONTIER_INSIDE?insideSpot(p,f.R):{x:Math.round(p.x),y:Math.round(p.y)};
  runtime.stopAutopilot?.();if(runtime.S.destination)runtime.cancelDestination?.();if(d.seen)d.seen[id]=true;runtime.narrate?.('portal');
  const ok=runtime.startPlace?.(id,{from})===true;if(ok&&assist){const r=runtime.placeRun?.();if(r){r.assist=true;runtime.save?.();}}return ok;}
 function startCall(id){call={id,left:CALL_SECONDS};armed=false;pushT=0;runtime.toast?.(callLine(id),{force:true,level:2,category:'lejos'});}
 // A try without ★: the sheet, and its count kept.
 function failed(id){const s=own();if(frontierWritable(s)){s.fails[id]=Math.min(99,(s.fails[id]||0)+1);runtime.save?.();}armed=true;open(id);}
 function open(id){const box=$('mFrontier');if(!box)return;const n=own().fails?.[id]||0,easy=assistOffered(n,kids());sheet=id;
  $('frontierTitle').textContent=name(id);$('frontierLine').textContent=easy?'Sin ★ todavía. La versión más fácil también da ★.':'Sin ★ todavía. Su ★ abre el camino.';
  const e=$('frontierEasy'),a=$('frontierAgain'),l=$('frontierLeave');if(e){e.hidden=!easy;e.classList?.toggle('gold',easy);e.onclick=()=>{close();begin(id,{assist:true});};}
  if(a){a.classList?.toggle('gold',!easy);a.onclick=()=>{close();begin(id);};}if(l)l.onclick=()=>{close();leave();};box.hidden=false;}
 function close(){const box=$('mFrontier');if(box)box.hidden=true;sheet=null;}
 // «Salir»: you stay just inside the place's distance; the next steps out call again.
 function leave(){const f=frontier();armed=true;if(!f)return;const p=pos();if(Math.hypot(p.x,p.y)>f.R-FRONTIER_INSIDE){place(insideSpot(p,f.R));runtime.save?.();}}
 function step(dt=0){const S=runtime.S;if(!S)return;own();const d=data(),r=runtime.placeRun?.()||null;
  // The round of the frontier's place: watched until it ends; ended without its ★, it was a try.
  if(watch&&!r){const id=watch;watch=null;if(d&&!complete(d,id))failed(id);else if(frontierWritable(state)&&state.fails[id]){delete state.fails[id];runtime.save?.();}}
  const f=frontier();if(r){if(f&&r.id===f.id&&!r.free)watch=r.id;call=null;last=null;live=false;return;}
  if(!f||!active()){live=false;last=null;edge=null;if(call){call=null;armed=true;}return;}
  live=true;const p=pos();
  // A jump, a return or the first moment here: never past the place's distance (an old save that walked on, too).
  if(isJump(last,p)){const q=clampJump(p,f);if(q.moved){place(q);runtime.save?.();armed=true;}last={x:S.wx,y:S.wy};edge={f,r:Math.hypot(S.wx,S.wy)};return;}
  const q=clampStep(last,p,f.F);if(q.x!==p.x||q.y!==p.y){S.wx=q.x;S.wy=q.y;}const r1=Math.hypot(S.wx,S.wy);last={x:S.wx,y:S.wy};edge={f,r:r1};
  if(!call&&r1<f.R-FRONTIER_REARM)armed=true;
  if(q.pushed&&!call)pushT+=dt;else if(!q.pushed)pushT=0;
  if(!call&&(armed&&r1>=f.R||pushT>=RECALL_SECONDS))startCall(f.id);
  // A sheet open or the Refugio holds the call; then the round starts by itself.
  if(call){if(call.id!==f.id){call=null;return;}if(openSurface('.modal:not([hidden])')||runtime.houseActive?.())return;call.left-=dt;if(call.left<=0){const id=call.id;call=null;begin(id);}}}
 // The edge: a faint dotted line on the circle, only when you are near it.
 function draw(c,W,H){if(!live||!edge||openSurface('.modal:not([hidden])'))return;const {f,r}=edge,gap=f.F-r;if(gap>FRONTIER_SOFT*1.5)return;const S=runtime.S,cx=runtime.camX??S.wx,cy=runtime.camY??S.wy,ox=W/2-cx,oy=H/2-cy,a=Math.atan2(S.wy,S.wx),span=Math.min(Math.PI,(W+H)/Math.max(1,f.F));
  c.save();c.strokeStyle='#ffffff';c.lineWidth=1;c.globalAlpha=.12+.38*Math.max(0,Math.min(1,1-gap/(FRONTIER_SOFT*1.5)));c.setLineDash?.([2,10]);c.beginPath();c.arc(ox,oy,f.F,a-span,a+span);c.stroke();c.setLineDash?.([]);c.restore();}
 // Jumps from the map, a door or music travel (practice-travel.js): never past the place's distance.
 function clampPoint(point){if(!point||(point.layer&&point.layer!=='superficie'))return null;const f=frontier();if(!f||!runtime.ringActive?.())return null;const q=clampJump(point,f);return q.moved?{x:q.x,y:q.y}:null;}
 Object.defineProperties(runtime,{frontierStep:{get:()=>step},drawFrontier:{get:()=>draw},frontierClampPoint:{get:()=>clampPoint},
  // The ring asks: how far the fast travel may land, and whether a place is calling (its «Una señal» waits).
  frontierRadius:{get:()=>()=>frontier()?.F??Infinity},frontierCalls:{get:()=>id=>!!call&&call.id===id},
  // Tests only (the runtime is never published).
  frontierState:{get:()=>()=>{const f=frontier();return {on,live,id:f?.id||null,R:f?.R??null,F:f?.F??null,armed,call:call?{...call}:null,fails:{...(own().fails||{})},sheet,watch};}}});
}
