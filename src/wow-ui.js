import {cardTilt} from './wow-model.js';
export function initialize(runtime){
 let active=null,pressed=null,selected=null;
 const reduced=()=>!!(runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 function unselect(){selected?.classList.remove('wow-selected');selected=null;}
 function select(target){
  const node=target?.closest?.('.rare-card[data-card-id]');if(!node?.dataset?.cardId)return;
  if(selected!==node)unselect();selected=node;selected.classList.add('wow-selected');
 }
 function focusTick(){if(selected&&(!selected.isConnected||selected.closest('[hidden]')))unselect();}
 function clear(){if(active){active.style.removeProperty('--wow-tilt-x');active.style.removeProperty('--wow-tilt-y');active.classList.remove('wow-depth');}active=null;}
 function portrait(target){return target?.closest?.('.rare-portrait,#rareNoticeArt')||null;}
 function move(e){
  const node=portrait(e.target);if(!node||reduced()||(e.pointerType==='touch'&&pressed!==e.pointerId)){clear();return;}
  if(active!==node)clear();active=node;
  const p=cardTilt(node.getBoundingClientRect(),e.clientX,e.clientY);
  node.style.setProperty('--wow-tilt-x',p.x+'deg');node.style.setProperty('--wow-tilt-y',p.y+'deg');node.classList.add('wow-depth');
 }
 document.addEventListener('pointerdown',e=>{select(e.target);pressed=e.pointerId;move(e);},{passive:true});
 document.addEventListener('pointermove',move,{passive:true});
 document.addEventListener('focusin',e=>select(e.target));
 for(const name of ['pointerup','pointercancel'])document.addEventListener(name,()=>{pressed=null;clear();},{passive:true});
 document.addEventListener('pointerout',e=>{if(active&&!active.contains(e.relatedTarget))clear();},{passive:true});
 document.addEventListener('scroll',clear,{capture:true,passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){clear();unselect();}});
 globalThis.addEventListener?.('blur',clear);globalThis.addEventListener?.('resize',clear);
 Object.defineProperties(runtime,{resetCardDepth:{get:()=>clear},cardFocusTick:{get:()=>focusTick}});
}
