import {lightOfHour} from './world-light-model.js';
import {prefersReducedMotion} from './frame-state.js';
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
  if(L.dawn>.01||L.dusk>.01){const a=.08*Math.max(L.dawn,L.dusk),rgb=L.dawn>L.dusk?'255,174,107':'255,127,168',g=c.createRadialGradient(x,y,0,x,y,Math.max(W,H)*.45);g.addColorStop(0,`rgba(${rgb},${a.toFixed(3)})`);g.addColorStop(1,`rgba(${rgb},0)`);c.globalAlpha=1;c.fillStyle=g;c.fillRect(0,0,W,H);}
  if(L.darkness>.01){const lantern=Math.max(70,(runtime.lightR?.()||120)*.9),g=c.createRadialGradient(x,y,lantern*.35,x,y,lantern*1.6);g.addColorStop(0,'rgba(4,8,24,0)');g.addColorStop(1,'rgba(4,8,24,'+L.darkness.toFixed(3)+')');c.globalAlpha=1;c.fillStyle=g;c.fillRect(0,0,W,H);}
  // Fireflies live in screen space and drift with the world, so a few dozen points cost almost nothing.
  while(flies.length<L.fireflies)flies.push({x:Math.random()*W,y:Math.random()*H,p:Math.random()*6.28,z:.4+Math.random()*.6});if(flies.length>L.fireflies)flies.length=L.fireflies;
  const dx=runtime.camX-(draw.cx??runtime.camX),dy=runtime.camY-(draw.cy??runtime.camY);draw.cx=runtime.camX;draw.cy=runtime.camY;
  for(const f of flies){if(!calm){f.x=((f.x-dx*f.z+Math.sin(t/900+f.p)*.35)%W+W)%W;f.y=((f.y-dy*f.z+Math.cos(t/1100+f.p)*.3)%H+H)%H;}const glow=calm?.6:.35+.65*Math.max(0,Math.sin(t/420+f.p));c.globalAlpha=glow*L.night;c.fillStyle='#d8f27a';c.fillRect(Math.round(f.x),Math.round(f.y),2,2);c.globalAlpha=glow*L.night*.25;c.fillRect(Math.round(f.x)-1,Math.round(f.y)-1,4,4);}
  c.restore();
 }
 Object.defineProperties(runtime,{drawWorldLight:{get:()=>draw},worldLight:{get:()=>()=>current},worldFireflies:{get:()=>()=>flies.map(f=>[Math.round(f.x),Math.round(f.y)])}});
}
