import {wearing} from './cube-shop-model.js';
// Batch 1 of the cube shop: movement and body pieces. Drawing only: collisions, reach, saves and music are untouched.
// Every piece has a still variant, so nothing bought disappears when motion is reduced.
export function initialize(runtime){
 let lastT=null,lastX=null,lastY=null,vx=0,vy=0,speed=0,lastSpeed=0,squash=0,roll=0,travel=0,heat=0,lastBroken=null,stopped=0,blinkAt=-1;
 const wear=()=>runtime.sparkEconomy?.wear||{};
 const on=slot=>runtime.inWorld()?wear()[slot]||'':'';
 const still=()=>!!(runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 // Movement is read from the player's world position, once per frame.
 function sample(t){
  if(lastT===null||t-lastT>500||t<lastT){lastT=t;lastX=runtime.S.wx;lastY=runtime.S.wy;return 0;}
  const dt=Math.max(.001,(t-lastT)/1000),dx=runtime.S.wx-lastX,dy=runtime.S.wy-lastY;lastT=t;lastX=runtime.S.wx;lastY=runtime.S.wy;
  const k=Math.min(1,dt*12);vx+=(dx/dt-vx)*k;vy+=(dy/dt-vy)*k;lastSpeed=speed;speed=Math.hypot(vx,vy);travel+=Math.hypot(dx,dy);
  stopped=speed<8?stopped+dt:0;
  const broken=runtime.sparkEconomy?.stats?.broken||0;if(lastBroken===null)lastBroken=broken;if(broken>lastBroken)heat=Math.min(8,heat+broken-lastBroken);lastBroken=broken;heat=Math.max(0,heat-dt*.6);
  return dt;
 }
 const ink=()=>runtime.musicInk?.(null,'lead')||'#fff';
 // Under the cube: shadows, legs and floor lights.
 function under(c,x,y,s,t){
  if(!runtime.inWorld())return;const dt=sample(t),motion=on('motion'),body=on('body'),calm=still();
  if(motion==='motion:pogo'||motion==='motion:float'){const lift=motion==='motion:float'?(calm?5:6+Math.sin(t/500)*2):(calm?3:Math.abs(Math.sin(t/120))*7*Math.min(1,speed/60));c.save();c.globalAlpha=.28-lift*.015;c.fillStyle='#fff';c.beginPath();c.ellipse(x,y+s/2+3,s*.55-lift*.3,2,0,0,6.283);c.fill();c.restore();}
  if(motion==='motion:legs'){c.save();c.strokeStyle='#fff';c.lineWidth=1;const step=calm||speed<8?0:Math.sin(t/90)*2.5,feet=s>=14?[-.45,-.15,.15,.45]:[-.5,.5],len=Math.max(4,s*.45);feet.forEach((f,i)=>{const fx=Math.round(x+f*(s+4))+.5,swing=i%2?step:-step;c.beginPath();c.moveTo(fx,y+s/2+1);c.lineTo(fx+swing,y+s/2+1+len);c.stroke();});c.restore();}
  if(motion==='motion:skate'){c.save();c.globalAlpha=.6;c.strokeStyle='#fff';c.lineWidth=1;c.beginPath();c.moveTo(x-s*.5,y+s/2+3);c.lineTo(x+s*.5,y+s/2+3);c.stroke();if(!calm&&speed>20){c.globalAlpha=.3;const a=Math.atan2(vy,vx);for(const o of [-3,3]){c.beginPath();c.moveTo(x-Math.cos(a)*s*.7-Math.sin(a)*o,y-Math.sin(a)*s*.7+Math.cos(a)*o);c.lineTo(x-Math.cos(a)*s*1.4-Math.sin(a)*o,y-Math.sin(a)*s*1.4+Math.cos(a)*o);c.stroke();}}c.restore();}
  if(body==='body:disco'){c.save();c.fillStyle='#fff';const turn=calm?0:t/1400;for(let i=0;i<12;i++){const a=turn+i*.5236,r=s*(1.6+(i%3)*.5);c.globalAlpha=.35+(i%2)*.2;c.fillRect(x+Math.cos(a)*r,y+Math.sin(a)*r*.55+s*.2,2,2);}c.restore();}
  if(dt&&motion==='motion:blink'&&!calm&&speed>20){const b=runtime.beat?.()||0;if(b>.92&&blinkAt<0)blinkAt=t;if(blinkAt>=0&&t-blinkAt>140)blinkAt=-1;}
 }
 // Inside the cube's own transform: how the body moves.
 function transform(c,x,y,s,t){
  if(!runtime.inWorld())return;const motion=on('motion'),body=on('body'),calm=still();let sx=1,sy=1,rot=0,ox=0,oy=0;
  if(motion==='motion:roll'){if(calm)rot=.21;else{const dir=Math.abs(vx)>=Math.abs(vy)?Math.sign(vx):Math.sign(vy);if(speed>8)roll+=dir*speed/(s*1.6)*.016;else roll+=(Math.round(roll/(Math.PI/2))*(Math.PI/2)-roll)*.2;rot=roll;}}
  if(motion==='motion:jelly'){if(calm){sx=1.1;sy=.9;}else{const target=Math.max(-.22,Math.min(.22,(lastSpeed-speed)/40));squash+=(target-squash)*.25;squash*=.92;sx=1+squash;sy=1-squash;}}
  if(motion==='motion:pogo')oy=calm?-3:-Math.abs(Math.sin(t/120))*7*Math.min(1,speed/60);
  if(motion==='motion:float')oy=calm?-5:-6-Math.sin(t/500)*2;
  if(motion==='motion:skate'&&!calm&&speed>8)rot=Math.max(-.14,Math.min(.14,-vx/1500));
  if(motion==='motion:worm'){const a=Math.atan2(vy,vx),k=calm?.25:speed>8?Math.sin(t/110)**2*.3:0;c.translate(x,y);c.rotate(calm?0:a);c.scale(1+k,1/(1+k));c.rotate(calm?0:-a);c.translate(-x,-y);}
  if(motion==='motion:blink'&&blinkAt>=0&&speed>0){ox=vx/speed*5;oy+=vy/speed*5;}
  if(body==='body:beat'&&!calm){const b=1+(runtime.beat?.()||0)*.12;sx*=b;sy*=b;}
  if(body==='body:streak'){const g=1+heat*.04;sx*=g;sy*=g;}
  if(sx!==1||sy!==1||rot||ox||oy){c.translate(x+ox,y+oy);c.rotate(rot);c.scale(sx,sy);c.translate(-x,-y);}
 }
 // The body itself. Returns true when it replaced the plain square.
 function body(c,x,y,s,t,color){
  if(!runtime.inWorld())return false;const piece=on('body'),calm=still(),L=Math.round(x-s/2),T=Math.round(y-s/2),S=Math.round(s);
  if(!piece&&on('motion')!=='motion:blink')return false;
  c.fillStyle=piece==='body:chameleon'?ink():color;
  if(on('motion')==='motion:blink'&&(calm||blinkAt>=0)){c.save();c.globalAlpha=.3;c.strokeStyle=c.fillStyle;c.strokeRect(L-(calm?5:Math.sign(vx)*5)+.5,T+.5,S-1,S-1);c.restore();}
  if(piece==='body:swarm'){const m=Math.max(3,Math.round(s*.42)),gap=2,go=calm?0:Math.min(1,speed/90),ux=speed>1?vx/speed:0,uy=speed>1?vy/speed:0;[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([i,j],k)=>{const hx=x+i*(m+gap)/2,hy=y+j*(m+gap)/2,lx=x-ux*k*(m+gap),ly=y-uy*k*(m+gap),px=hx+(lx-hx)*go,py=hy+(ly-hy)*go;c.fillRect(Math.round(px-m/2),Math.round(py-m/2),m,m);});return true;}
  if(piece==='body:assembly'){const n=4,cell=S/n,gap=calm?1:Math.min(3,stopped*3);for(let i=0;i<n;i++)for(let j=0;j<n;j++){const off=(i-1.5)*gap,offy=(j-1.5)*gap;c.fillRect(Math.round(L+i*cell+off),Math.round(T+j*cell+offy),Math.ceil(cell-.6),Math.ceil(cell-.6));}return true;}
  if(piece==='body:fish'){c.save();c.globalAlpha=.32;c.fillRect(L,T,S,S);c.globalAlpha=.9;c.strokeStyle=c.fillStyle;c.lineWidth=1;c.strokeRect(L+.5,T+.5,S-1,S-1);const fx=x+(calm?0:Math.sin(t/700)*s*.22),fy=y+(calm?0:Math.sin(t/430)*s*.12),face=calm||Math.cos(t/700)>0?1:-1;c.fillStyle='#fff';c.globalAlpha=1;c.fillRect(Math.round(fx-2),Math.round(fy-1),4,2);c.fillRect(Math.round(fx-face*3),Math.round(fy-2),1,4);c.restore();return true;}
  c.fillRect(L,T,S,S);
  c.save();c.strokeStyle='#000';c.fillStyle='#000';c.lineWidth=1;
  if(piece==='body:dice'){const n=((runtime.sparkEconomy?.stats?.broken||0)%6)+1,p=S/4,pip=Math.max(1,Math.round(S/9)),spots={1:[[2,2]],2:[[1,1],[3,3]],3:[[1,1],[2,2],[3,3]],4:[[1,1],[3,1],[1,3],[3,3]],5:[[1,1],[3,1],[2,2],[1,3],[3,3]],6:[[1,1],[3,1],[1,2],[3,2],[1,3],[3,3]]}[n];for(const [i,j] of spots)c.fillRect(Math.round(L+i*p-pip/2),Math.round(T+j*p-pip/2),pip,pip);}
  if(piece==='body:streak'){c.restore();c.save();c.strokeStyle=color;c.globalAlpha=.45;const g=2+Math.round(heat);c.strokeRect(L-g-.5,T-g-.5,S+g*2+1,S+g*2+1);}
  if(piece==='body:beat'&&calm)c.strokeRect(L+S*.25+.5,T+S*.25+.5,S*.5-1,S*.5-1);
  if(piece==='body:origami'){const open=calm?0:runtime.pulse||0;c.globalAlpha=.55;c.beginPath();c.moveTo(L,T);c.lineTo(L+S,T+S);c.moveTo(L+S,T);c.lineTo(L,T+S);c.stroke();if(open>0){c.restore();c.save();c.fillStyle=color;c.globalAlpha=.7*open;const f=S*.5*open;c.beginPath();c.moveTo(L,T);c.lineTo(L+S,T);c.lineTo(x,T-f);c.closePath();c.moveTo(L,T+S);c.lineTo(L+S,T+S);c.lineTo(x,T+S+f);c.closePath();c.moveTo(L,T);c.lineTo(L,T+S);c.lineTo(L-f,y);c.closePath();c.moveTo(L+S,T);c.lineTo(L+S,T+S);c.lineTo(L+S+f,y);c.closePath();c.fill();}}
  if(piece==='body:disco'){c.globalAlpha=.45;for(let i=1;i<4;i++){c.beginPath();c.moveTo(L+i*S/4,T);c.lineTo(L+i*S/4,T+S);c.moveTo(L,T+i*S/4);c.lineTo(L+S,T+i*S/4);c.stroke();}}
  c.restore();return true;
 }
 Object.defineProperties(runtime,{drawCubeShopUnder:{get:()=>under},cubeShopTransform:{get:()=>transform},drawCubeShopBody:{get:()=>body},cubeShopWearing:{get:()=>id=>wearing(runtime.sparkEconomy,id)}});
}
