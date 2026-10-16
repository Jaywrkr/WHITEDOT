import {createMotion,WOW_LIMITS,lookVector,greetingPose,formationOffset} from './wow-model.js';
export function initialize(runtime){
 const greetings=new WeakMap(),formation=new WeakMap();let nextSlot=0;
 const motion=createMotion();let owner=null,layer=null,dust=[],seconds=0,nearby=[],pending=[],ripples=[],lastPosition=null;
 const reduced=()=>!!(runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 function sources(){
  const pool=[...(runtime.MU?.near||[]),...(runtime.MU?.walkerFollowers||[]),...(runtime.livingNear?.(140)||[]),...(runtime.microNear?.(140)||[]),...(runtime.inhabitantsNear?.(140)||[])].map(o=>o.object||o);
  return [...new Set(pool)].filter(o=>Number.isFinite(o.x)&&Number.isFinite(o.y)&&Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<140).sort((a,b)=>Math.hypot(a.x-runtime.S.wx,a.y-runtime.S.wy)-Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy)).slice(0,WOW_LIMITS.nearby);
 }
 const blocked=()=>!runtime.inWorld()||document.hidden||runtime.scanning||runtime.$?.('rareNotice')?.dataset.inspect==='true'||!!document.querySelector('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 function tick(dt,paused=false){
  if(owner!==runtime.S||layer!==runtime.S.layer){owner=runtime.S;layer=runtime.S.layer;motion.reset();dust=[];}
  const jumped=lastPosition&&Math.hypot(runtime.S.wx-lastPosition.x,runtime.S.wy-lastPosition.y)>40;
  lastPosition={x:runtime.S.wx,y:runtime.S.wy};
  const stopped=paused||blocked()||jumped,step=motion.step(runtime.S.wx,runtime.S.wy,dt,stopped);
  seconds+=Math.max(0,Math.min(.05,dt||0));
  nearby=stopped?[]:sources();
  if(stopped||reduced()){dust=[];pending=[];ripples=[];return;}
  dust=dust.filter(p=>seconds-p.at<.6);
  ripples=ripples.filter(p=>seconds-p.at<.55);
  const audioNow=runtime.ac?.currentTime;
  const ready=pending.filter(p=>p.at<=audioNow);pending=pending.filter(p=>p.at>audioNow);
  for(const note of ready){
   if(audioNow-note.at>.3||note.owner!==runtime.S||note.layer!==runtime.S.layer)continue;
   const o=note.source;if(Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)>220)continue;
   const neighbors=nearby.filter(n=>n!==o&&Math.hypot(n.x-o.x,n.y-o.y)<100).slice(0,3);
   neighbors.forEach((n,i)=>ripples.push({x:n.x,y:n.y,at:seconds+.08*(i+1),ink:runtime.musicInk?.(o,note.role)||'#bddbe0'}));
  }
  ripples=ripples.slice(-8);
  if(step.stopped){for(let i=0;i<3;i++)dust.push({x:step.x-Math.cos(step.angle)*(4+i*4),y:step.y-Math.sin(step.angle)*(4+i*4),at:seconds,side:i-1});dust=dust.slice(-WOW_LIMITS.brakes);}
 }
 function noteCue(source,role,at){
  if(blocked()||reduced()||!Number.isFinite(at)||!Number.isFinite(source?.x)||!Number.isFinite(source?.y))return;
  pending.push({source,role,at,owner:runtime.S,layer:runtime.S.layer});pending=pending.slice(-16);
 }
 function followTarget(o){
  let slot=formation.get(o);if(slot===undefined){slot=nextSlot++%512;formation.set(o,slot);}
  const p=formationOffset(slot,reduced()?0:seconds);return {x:runtime.S.wx+p.x,y:runtime.S.wy+p.y};
 }
 function eyes(o,c,x=0,y=0){
  if(blocked()||Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)>130)return;
  const v=lookVector(runtime.S.wx-o.x,runtime.S.wy-o.y,reduced());
  c.save();c.fillStyle='#fff';
  for(const p of ripples){const age=seconds-p.at;if(age<0)continue;c.strokeStyle=p.ink;c.globalAlpha=(1-age/.55)*.38;c.lineWidth=.8;c.beginPath();c.arc(p.x+ox,p.y+oy,8+age*15,0,Math.PI*1.7);c.stroke();}c.globalAlpha*=.85;
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
 Object.defineProperties(runtime,{wowTick:{get:()=>tick},drawWowWorld:{get:()=>draw},wowObjectTransform:{get:()=>objectTransform},wowEyes:{get:()=>eyes},wowFollowTarget:{get:()=>followTarget},wowSoundCue:{get:()=>noteCue},wowState:{get:()=>({dust:dust.length,seconds,pending:pending.length,ripples:ripples.length})},cubeVisualTransform:{get:()=>cubeTransform}});
}
