import {createMotion,WOW_LIMITS,lookVector,greetingPose,formationOffset} from './wow-model.js';
export function initialize(runtime){
 const greetings=new WeakMap(),formation=new WeakMap(),seenBeams=new WeakSet();let nextSlot=0;
 const motion=createMotion();let owner=null,layer=null,dust=[],seconds=0,nearby=[],pending=[],ripples=[],flashes=[],memory=[],lastPosition=null;
 const reduced=()=>!!(runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 function sources(){
  const pool=[...(runtime.MU?.near||[]),...(runtime.MU?.walkerFollowers||[]),...(runtime.livingNear?.(140)||[]),...(runtime.microNear?.(140)||[]),...(runtime.inhabitantsNear?.(140)||[])].map(o=>o.object||o);
  return [...new Set(pool)].filter(o=>Number.isFinite(o.x)&&Number.isFinite(o.y)&&Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<140).sort((a,b)=>Math.hypot(a.x-runtime.S.wx,a.y-runtime.S.wy)-Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy)).slice(0,WOW_LIMITS.nearby);
 }
 const blocked=()=>!runtime.inWorld()||document.hidden||runtime.scanning||runtime.$?.('rareNotice')?.dataset.inspect==='true'||!!document.querySelector('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 function tick(dt,paused=false){
  if(owner!==runtime.S||layer!==runtime.S.layer){owner=runtime.S;layer=runtime.S.layer;motion.reset();dust=[];pending=[];ripples=[];flashes=[];memory=[];}
  const jumped=lastPosition&&Math.hypot(runtime.S.wx-lastPosition.x,runtime.S.wy-lastPosition.y)>40;
  lastPosition={x:runtime.S.wx,y:runtime.S.wy};
  const stopped=paused||blocked()||jumped,step=motion.step(runtime.S.wx,runtime.S.wy,dt,stopped);
  seconds+=Math.max(0,Math.min(.05,dt||0));
  nearby=stopped?[]:sources();
  if(stopped||reduced()){dust=[];pending=[];ripples=[];flashes=[];memory=[];return;}
  dust=dust.filter(p=>seconds-p.at<.6);memory=memory.filter(p=>seconds-p.at<2.8);
  for(const be of (runtime.beams||[]).slice(0,8)){
   if(seenBeams.has(be)||be.l<=0||![be.x1,be.y1,be.x2,be.y2].every(Number.isFinite))continue;
   seenBeams.add(be);memory.push({x1:be.x1,y1:be.y1,x2:be.x2,y2:be.y2,at:seconds,ink:runtime.musicInk?.({x:be.x1,y:be.y1},'acorde')||'#bddbe0'});
  }memory=memory.slice(-8);
  ripples=ripples.filter(p=>seconds-p.at<.55);flashes=flashes.filter(p=>seconds-p.at<.45);
  const audioNow=runtime.ac?.currentTime;
  const ready=pending.filter(p=>p.at<=audioNow);pending=pending.filter(p=>p.at>audioNow);
  for(const note of ready){
   if(audioNow-note.at>.3||note.owner!==runtime.S||note.layer!==runtime.S.layer)continue;
   const o=note.source;if(Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)>220)continue;
   flashes.push({x:o.x,y:o.y,at:seconds,role:note.role,ink:runtime.musicInk?.(o,note.role)||'#fff'});
   const neighbors=nearby.filter(n=>n!==o&&Math.hypot(n.x-o.x,n.y-o.y)<100).slice(0,3);
   neighbors.forEach((n,i)=>ripples.push({x:n.x,y:n.y,at:seconds+.08*(i+1),ink:runtime.musicInk?.(o,note.role)||'#bddbe0'}));
  }
  ripples=ripples.slice(-8);flashes=flashes.slice(-8);
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
  c.save();
  for(const p of memory){const a=1-(seconds-p.at)/2.8;c.globalAlpha=a*.13;c.strokeStyle=c.fillStyle=p.ink;c.lineWidth=.65;c.beginPath();c.moveTo(p.x1+ox,p.y1+oy);c.lineTo(p.x2+ox,p.y2+oy);c.stroke();c.fillRect(p.x1+ox-1,p.y1+oy-1,2,2);c.fillRect(p.x2+ox-1,p.y2+oy-1,2,2);}
  drawConnections(c,ox,oy);c.fillStyle='#fff';
  for(const p of flashes){
   const age=(seconds-p.at)/.45,r=5+age*8;c.globalAlpha=(1-age)*.8;c.strokeStyle=c.fillStyle=p.ink;c.lineWidth=p.role==='bajo'?2:1.2;
   const x=p.x+ox,y=p.y+oy;c.fillRect(x-1.5,y-1.5,3,3);c.beginPath();
   if(p.role==='perc'){c.moveTo(x-r,y);c.lineTo(x+r,y);c.moveTo(x,y-r);c.lineTo(x,y+r);}
   else if(p.role==='bajo'){c.moveTo(x-r,y+r);c.lineTo(x+r,y+r);c.moveTo(x-r*.6,y+r+4);c.lineTo(x+r*.6,y+r+4);}
   else if(p.role==='acorde'){for(let i=-1;i<=1;i++){c.moveTo(x+i*5,y-r);c.lineTo(x+i*5,y+r);}}
   else c.arc(x,y,r,-Math.PI*.5,Math.PI*.8);c.stroke();
  }
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
 function drawConnections(c,ox,oy){
  if(reduced())return;
  for(const be of (runtime.beams||[]).slice(0,8)){
   const length=Math.hypot(be.x2-be.x1,be.y2-be.y1);
   if(!Number.isFinite(length)||length<1||be.l<=0)continue;
   c.fillStyle=runtime.musicInk?.({x:be.x1,y:be.y1},'acorde')||'#fff';c.globalAlpha=Math.min(.65,be.l*.65);
   for(let i=0;i<3;i++){const p=((1-be.l)+i/3)%1;c.fillRect(be.x1+(be.x2-be.x1)*p+ox-1,be.y1+(be.y2-be.y1)*p+oy-1,2,2);}
  }
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
 Object.defineProperties(runtime,{wowTick:{get:()=>tick},drawWowWorld:{get:()=>draw},wowObjectTransform:{get:()=>objectTransform},wowEyes:{get:()=>eyes},wowFollowTarget:{get:()=>followTarget},wowSoundCue:{get:()=>noteCue},wowState:{get:()=>({dust:dust.length,seconds,pending:pending.length,ripples:ripples.length,flashes:flashes.length,constellations:memory.length})},cubeVisualTransform:{get:()=>cubeTransform}});
}
