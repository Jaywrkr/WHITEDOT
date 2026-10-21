import {prefersReducedMotion} from './frame-state.js';
// V5: game feel without moving the camera away from the cube. One transform wraps the whole world and the cube,
// so every system stays aligned: the view leads a little in the direction of travel (not while a finger is down,
// so taps still land where they are aimed), a crystal break punches the
// zoom, chains and thunder shake it softly. Controls and notices stay put. Nothing of this under reduced motion.
export function initialize(runtime){
 let open=false,leadX=0,leadY=0,lastX=null,lastY=null,punch=0,shake=0,broken=null,flash=0;
 const calm=()=>!!runtime.S.reducedMotion||prefersReducedMotion();
 function kick(zoom=0,tremor=0){if(calm())return;punch=Math.min(.06,Math.max(punch,zoom));shake=Math.min(4,Math.max(shake,tremor));}
 function begin(dt){
  open=false;if(!runtime.inWorld()||calm()){leadX=leadY=punch=shake=0;lastX=null;return;}
  const S=runtime.S;if(lastX!==null&&dt>0){const vx=(S.wx-lastX)/dt,vy=(S.wy-lastY)/dt,k=Math.min(1,dt*3);const touch=!!runtime.ptr,tx=touch||Math.abs(vx)>400?0:-Math.max(-18,Math.min(18,vx*.09)),ty=touch||Math.abs(vy)>400?0:-Math.max(-18,Math.min(18,vy*.09));leadX+=(tx-leadX)*k;leadY+=(ty-leadY)*k;}lastX=S.wx;lastY=S.wy;
  const b=runtime.sparkEconomy?.stats?.broken||0;if(broken===null)broken=b;if(b>broken)kick(b-broken>=3?.045:.02,b-broken>=3?2.5:0);broken=b;
  const f=runtime.weather?.flash||0;if(f>flash+.05)kick(0,1.5+f*2);flash=f;
  const W=runtime.W,H=runtime.H,c=runtime.cx,z=1+punch,sx=shake?(Math.random()*2-1)*shake:0,sy=shake?(Math.random()*2-1)*shake:0;
  punch=Math.max(0,punch-dt*.1);shake=Math.max(0,shake-dt*8);
  if(Math.abs(leadX)<.05&&Math.abs(leadY)<.05&&!punch&&!sx&&!sy)return;
  c.save();c.translate(W/2+leadX+sx,H/2+leadY+sy);c.scale(z,z);c.translate(-W/2,-H/2);open=true;
 }
 function end(){if(open){runtime.cx.restore();open=false;}}
 // Where on screen a world point is drawn now, for code that maps taps to the world.
 const offset=()=>({x:leadX,y:leadY,zoom:1+punch});
 Object.defineProperties(runtime,{cameraBegin:{get:()=>begin},cameraEnd:{get:()=>end},cameraKick:{get:()=>kick},cameraOffset:{get:()=>offset}});
}
