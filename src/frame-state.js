// Answers that cannot change while one frame is drawn, asked once per frame instead of once per module.
// Outside a frame (input handlers, timers) every question goes straight to the document.
let active=false,query=null,motion=null;const seen=new Map();
export function beginFrame(){active=true;seen.clear();}
export function endFrame(){active=false;seen.clear();}
// document.querySelector for "is something open?" checks; the same selector costs one lookup per frame.
export function openSurface(selector){
 const doc=globalThis.document;if(!doc?.querySelector)return null;if(!active)return doc.querySelector(selector);
 if(seen.has(selector))return seen.get(selector);const found=doc.querySelector(selector);seen.set(selector,found);return found;
}
// The system setting, kept current by its change event rather than asked dozens of times per frame.
export function prefersReducedMotion(){
 if(!query){const mm=globalThis.matchMedia;if(typeof mm!=='function')return false;query=mm.call(globalThis,'(prefers-reduced-motion: reduce)');motion=!!query?.matches;query?.addEventListener?.('change',e=>{motion=!!e.matches;});}
 return motion;
}
// Calm motion: the player's setting or the system's preference, whichever asks for less movement. Use this, not
// S.reducedMotion alone (nothing in the game sets it outside previews).
export const calmMotion=S=>!!(S?.reducedMotion||prefersReducedMotion());
// A value computed at most once per frame (for example the creatures near the cube); callers get their own copy of arrays.
export function frameMemo(key,compute){if(!active){return compute();}if(!seen.has('memo:'+key))seen.set('memo:'+key,compute());const v=seen.get('memo:'+key);return Array.isArray(v)?v.slice():v;}
