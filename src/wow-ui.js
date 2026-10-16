import {cardTilt} from './wow-model.js';
export function initialize(runtime){
 let active=null,pressed=null;
 const reduced=()=>!!(runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 function clear(){if(active){active.style.removeProperty('--wow-tilt-x');active.style.removeProperty('--wow-tilt-y');active.classList.remove('wow-depth');}active=null;}
 function portrait(target){return target?.closest?.('.rare-portrait,#rareNoticeArt')||null;}
 function move(e){
  const node=portrait(e.target);if(!node||reduced()||(e.pointerType==='touch'&&pressed!==e.pointerId)){clear();return;}
  if(active!==node)clear();active=node;
  const p=cardTilt(node.getBoundingClientRect(),e.clientX,e.clientY);
  node.style.setProperty('--wow-tilt-x',p.x+'deg');node.style.setProperty('--wow-tilt-y',p.y+'deg');node.classList.add('wow-depth');
 }
 document.addEventListener('pointerdown',e=>{pressed=e.pointerId;move(e);},{passive:true});
 document.addEventListener('pointermove',move,{passive:true});
 for(const name of ['pointerup','pointercancel'])document.addEventListener(name,()=>{pressed=null;clear();},{passive:true});
 document.addEventListener('pointerout',e=>{if(active&&!active.contains(e.relatedTarget))clear();},{passive:true});
 document.addEventListener('scroll',clear,{capture:true,passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
 globalThis.addEventListener?.('blur',clear);
 Object.defineProperties(runtime,{resetCardDepth:{get:()=>clear}});
}
