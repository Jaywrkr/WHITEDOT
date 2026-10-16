import {createMotion} from './wow-model.js';
export function initialize(runtime){
 const motion=createMotion();let owner=null,layer=null;
 const reduced=()=>!!(runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 const blocked=()=>!runtime.inWorld()||document.hidden||runtime.scanning||runtime.$?.('rareNotice')?.dataset.inspect==='true'||!!document.querySelector('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 function tick(dt,paused=false){
  if(owner!==runtime.S||layer!==runtime.S.layer){owner=runtime.S;layer=runtime.S.layer;motion.reset();}
  motion.step(runtime.S.wx,runtime.S.wy,dt,paused||blocked());
 }
 function cubeTransform(c,x,y){
  const p=motion.pose(reduced()||blocked());c.translate(x,y);c.rotate(p.angle);c.scale(p.x,p.y);c.rotate(-p.angle);c.translate(-x,-y);
 }
 Object.defineProperties(runtime,{wowTick:{get:()=>tick},cubeVisualTransform:{get:()=>cubeTransform}});
}
