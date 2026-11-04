import {lightOfHour} from './world-light-model.js';
import {prefersReducedMotion} from './frame-state.js';
import {radial} from './fx-kit.js';
// V1: the world's hour becomes visible. Night darkens everything but a lantern around the cube, dawn warms
// and dusk blushes, and fireflies come out. One gradient and a handful of dots per frame.
export function initialize(runtime){
 let last=null,rising=true,current=lightOfHour(1,true),flies=[];
 const surface=()=>runtime.inWorld()&&(!runtime.S.layer||runtime.S.layer==='superficie');
 function update(){
  const day=runtime.worldVisibility?.day;if(Number.isFinite(day)){if(last!==null&&Math.abs(day-last)>1e-4)rising=day>last;last=day;}
  current=lightOfHour(day??1,rising,new Date().getHours());return current;
 }
 function draw(t){
  if(!surface()){flies=[];return;}const L=update(),c=runtime.cx,W=runtime.W,H=runtime.H,x=W/2,y=H/2,calm=!!runtime.S.reducedMotion||prefersReducedMotion();
  c.save();
  // Panel 10 (P7, Roset): dawn and dusk warm the light around the cube, not the whole screen, so the ground stays black.
  // Visual 2 (alpha.254): both lights from sprites, their strength as alpha (they were two gradients per frame); the
  // night's dark keeps its flat colour outside the lantern's square.
  if(L.dawn>.01||L.dusk>.01){const a=+(.08*Math.max(L.dawn,L.dusk)).toFixed(3),rgb=L.dawn>L.dusk?'255,174,107':'255,127,168';c.globalAlpha=1;radial(c,x,y,Math.max(W,H)*.45,'dawn:'+rgb,[[0,`rgba(${rgb},1)`],[1,`rgba(${rgb},0)`]],a);}
  if(L.darkness>.01){const lantern=Math.max(70,(runtime.lightR?.()||120)*.9),R=lantern*1.6,d=+L.darkness.toFixed(3);c.globalAlpha=1;radial(c,x,y,R,'night',[[0,'rgba(4,8,24,0)'],[.35/1.6,'rgba(4,8,24,0)'],[1,'rgba(4,8,24,1)']],d);
   c.globalAlpha=d;c.fillStyle='rgb(4,8,24)';c.fillRect(0,0,W,Math.max(0,y-R));c.fillRect(0,y+R,W,Math.max(0,H-y-R));c.fillRect(0,y-R,Math.max(0,x-R),R*2);c.fillRect(x+R,y-R,Math.max(0,W-x-R),R*2);c.globalAlpha=1;}
  // Fireflies live in screen space and drift with the world, so a few dozen points cost almost nothing.
  while(flies.length<L.fireflies)flies.push({x:Math.random()*W,y:Math.random()*H,p:Math.random()*6.28,z:.4+Math.random()*.6});if(flies.length>L.fireflies)flies.length=L.fireflies;
  const dx=runtime.camX-(draw.cx??runtime.camX),dy=runtime.camY-(draw.cy??runtime.camY);draw.cx=runtime.camX;draw.cy=runtime.camY;
  for(const f of flies){if(!calm){f.x=((f.x-dx*f.z+Math.sin(t/900+f.p)*.35)%W+W)%W;f.y=((f.y-dy*f.z+Math.cos(t/1100+f.p)*.3)%H+H)%H;}const glow=calm?.6:.35+.65*Math.max(0,Math.sin(t/420+f.p));c.globalAlpha=glow*L.night;c.fillStyle='#d8f27a';c.fillRect(Math.round(f.x),Math.round(f.y),2,2);c.globalAlpha=glow*L.night*.25;c.fillRect(Math.round(f.x)-1,Math.round(f.y)-1,4,4);}
  c.restore();
 }
 Object.defineProperties(runtime,{drawWorldLight:{get:()=>draw},worldLight:{get:()=>()=>current},worldFireflies:{get:()=>()=>flies.map(f=>[Math.round(f.x),Math.round(f.y)])}});
}
