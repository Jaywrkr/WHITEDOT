import {prefersReducedMotion} from './frame-state.js';
// V4: the world breathes the music. Sounding sources send out a soft ring of light, the first beat of every bar
// swells the world's colour (stronger every fourth bar), and grass keeps a little of the beat. A few strokes per frame.
export function initialize(runtime){
 let lastBar=null,swell=0,strong=false;
 const calm=()=>!!runtime.S.reducedMotion||prefersReducedMotion();
 const playing=()=>runtime.inWorld()&&runtime.S.sound&&runtime.ac?.state==='running';
 function sway(b,h){return calm()?0:b*h*.08;}
 function draw(t,dt){
  if(!playing()){lastBar=null;swell=0;return;}const c=runtime.cx,W=runtime.W,H=runtime.H,bar=Math.floor((runtime.MU?.step||0)/16);
  if(lastBar!==null&&bar!==lastBar&&!calm()){swell=1;strong=bar%4===0;}lastBar=bar;
  c.save();
  if(swell>0){c.globalAlpha=swell*(strong?.06:.035);c.fillStyle=runtime.musicInk?.(null,'acorde')||'#fff';c.fillRect(0,0,W,H);swell=Math.max(0,swell-dt/.45);}
  const cues=runtime.soundCuesNow?.()||[];c.lineWidth=1;let n=0;
  for(const q of cues){if(n++>=10)break;const x=q.source.x-runtime.camX+W/2,y=q.source.y-runtime.camY+H/2;if(x<-60||y<-60||x>W+60||y>H+60)continue;const r=calm()?10:6+q.age*42;c.globalAlpha=.2*(1-q.age);c.strokeStyle=runtime.musicInk?.(q.source,q.role)||'#fff';c.beginPath();c.arc(x,y,r,0,6.283);c.stroke();}
  c.restore();
 }
 Object.defineProperties(runtime,{musicSway:{get:()=>sway},drawWorldMusic:{get:()=>draw},worldMusicState:{get:()=>()=>({swell,strong,bar:lastBar})}});
}
