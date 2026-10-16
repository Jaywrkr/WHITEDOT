import {createMotion,WOW_LIMITS,lookVector,greetingPose} from './wow-model.js';
export function initialize(runtime){
 const greetings=new WeakMap();
 const motion=createMotion();let owner=null,layer=null,dust=[],seconds=0,nearby=[];
 const reduced=()=>!!(runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 function sources(){
  const pool=[...(runtime.MU?.near||[]),...(runtime.MU?.walkerFollowers||[]),...(runtime.livingNear?.(140)||[]),...(runtime.microNear?.(140)||[]),...(runtime.inhabitantsNear?.(140)||[])].map(o=>o.object||o);
  return [...new Set(pool)].filter(o=>Number.isFinite(o.x)&&Number.isFinite(o.y)&&Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<140).sort((a,b)=>Math.hypot(a.x-runtime.S.wx,a.y-runtime.S.wy)-Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy)).slice(0,WOW_LIMITS.nearby);
 }
 const blocked=()=>!runtime.inWorld()||document.hidden||runtime.scanning||runtime.$?.('rareNotice')?.dataset.inspect==='true'||!!document.querySelector('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 function tick(dt,paused=false){
  if(owner!==runtime.S||layer!==runtime.S.layer){owner=runtime.S;layer=runtime.S.layer;motion.reset();dust=[];}
  const stopped=paused||blocked(),step=motion.step(runtime.S.wx,runtime.S.wy,dt,stopped);
  seconds+=Math.max(0,Math.min(.05,dt||0));
  nearby=stopped?[]:sources();
  if(stopped||reduced()){dust=[];return;}
  dust=dust.filter(p=>seconds-p.at<.6);
  if(step.stopped){for(let i=0;i<3;i++)dust.push({x:step.x-Math.cos(step.angle)*(4+i*4),y:step.y-Math.sin(step.angle)*(4+i*4),at:seconds,side:i-1});dust=dust.slice(-WOW_LIMITS.brakes);}
 }
 function eyes(o,c,x=0,y=0){
  if(blocked()||Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)>130)return;
  const v=lookVector(runtime.S.wx-o.x,runtime.S.wy-o.y,reduced());
  c.save();c.fillStyle='#fff';c.globalAlpha*=.85;
  c.fillRect(x-3+v.x,y-2+v.y,1.4,1.4);c.fillRect(x+1.6+v.x,y-2+v.y,1.4,1.4);c.restore();
 }
 function objectTransform(c,o){
  if(blocked()||reduced())return;
  const distance=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy);
  let g=greetings.get(o);if(!g){const key=o.id||o.s?.id||[o.hx??o.x,o.hy??o.y].join(',');g={inside:false,at:-10,kind:(runtime.seedOf('wow:greeting:v1:'+key)>>>0)%3};greetings.set(o,g);}
  if(distance>135)g.inside=false;
  if(distance<80&&!g.inside&&seconds-g.at>8){g.at=seconds;g.inside=true;}
  const pose=greetingPose(g.kind,seconds-g.at);c.translate(0,pose.lift);c.rotate(pose.turn);
  const proximity=Math.max(0,1-Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)/100);
  c.rotate(Math.sign(runtime.S.wx-o.x)*proximity*.035);c.scale(1+proximity*.035,1+proximity*.06);
 }
 function draw(){
  if(blocked())return;const c=runtime.cx,ox=runtime.W/2-runtime.camX,oy=runtime.H/2-runtime.camY;
  c.save();c.fillStyle='#fff';
  for(const o of nearby){const weight=Math.max(0,1-Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)/100);if(!weight)continue;c.globalAlpha=weight*.24;c.strokeStyle=runtime.musicInk?.(o)||'#bddbe0';c.lineWidth=.7;c.beginPath();c.arc(o.x+ox,o.y+oy,13,Math.PI*.1,Math.PI*.8);c.stroke();}
  for(const p of dust){const age=seconds-p.at;c.globalAlpha=(1-age/.6)*.35;c.fillRect(p.x+ox+age*p.side*6,p.y+oy,1.5,1.5);}
  c.restore();
 }
 function cubeTransform(c,x,y){
  const p=motion.pose(reduced()||blocked());c.translate(x,y);c.rotate(p.angle);c.scale(p.x,p.y);c.rotate(-p.angle);c.translate(-x,-y);
 }
 Object.defineProperties(runtime,{wowTick:{get:()=>tick},drawWowWorld:{get:()=>draw},wowObjectTransform:{get:()=>objectTransform},wowEyes:{get:()=>eyes},wowState:{get:()=>({dust:dust.length,seconds})},cubeVisualTransform:{get:()=>cubeTransform}});
}
