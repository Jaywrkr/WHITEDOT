import {createMotion,WOW_LIMITS} from './wow-model.js';
export function initialize(runtime){
 const motion=createMotion();let owner=null,layer=null,dust=[],seconds=0;
 const reduced=()=>!!(runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 const blocked=()=>!runtime.inWorld()||document.hidden||runtime.scanning||runtime.$?.('rareNotice')?.dataset.inspect==='true'||!!document.querySelector('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 function tick(dt,paused=false){
  if(owner!==runtime.S||layer!==runtime.S.layer){owner=runtime.S;layer=runtime.S.layer;motion.reset();dust=[];}
  const stopped=paused||blocked(),step=motion.step(runtime.S.wx,runtime.S.wy,dt,stopped);
  seconds+=Math.max(0,Math.min(.05,dt||0));
  if(stopped||reduced()){dust=[];return;}
  dust=dust.filter(p=>seconds-p.at<.6);
  if(step.stopped){for(let i=0;i<3;i++)dust.push({x:step.x-Math.cos(step.angle)*(4+i*4),y:step.y-Math.sin(step.angle)*(4+i*4),at:seconds,side:i-1});dust=dust.slice(-WOW_LIMITS.brakes);}
 }
 function draw(){
  if(blocked())return;const c=runtime.cx,ox=runtime.W/2-runtime.camX,oy=runtime.H/2-runtime.camY;
  c.save();c.fillStyle='#fff';
  for(const p of dust){const age=seconds-p.at;c.globalAlpha=(1-age/.6)*.35;c.fillRect(p.x+ox+age*p.side*6,p.y+oy,1.5,1.5);}
  c.restore();
 }
 function cubeTransform(c,x,y){
  const p=motion.pose(reduced()||blocked());c.translate(x,y);c.rotate(p.angle);c.scale(p.x,p.y);c.rotate(-p.angle);c.translate(-x,-y);
 }
 Object.defineProperties(runtime,{wowTick:{get:()=>tick},drawWowWorld:{get:()=>draw},wowState:{get:()=>({dust:dust.length,seconds})},cubeVisualTransform:{get:()=>cubeTransform}});
}
