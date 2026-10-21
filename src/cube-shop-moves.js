import {prefersReducedMotion} from './frame-state.js';
import {wearing} from './cube-shop-model.js';
import {SHOP_PULSES} from './cube-shop-pulse.js';
// Cube shop batch 4: gestures and the bought pulse look. Drawing only: they never move the cube, change reach or play sound.
// Each gesture is set off by something that already happens: standing still, two quick pulses, an achievement,
// circling, or finishing an activity.
export function initialize(runtime){
 let owner=null,lastT=null,lastX=0,lastY=0,stopped=0,speed=0,sector=null,turns=[],taps=[],flipAt=-1e9,danceUntil=-1,victoryAt=-1e9,victoryPending=false,wins=null,awards=null,confetti=[];
 const q=()=>runtime.sparkEconomy||{},has=id=>runtime.inWorld()&&wearing(q(),id);
 const still=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const count=v=>v&&typeof v==='object'?Object.keys(v).length:0;
 function sample(t){
  const S=runtime.S;if(owner!==S){owner=S;lastT=null;wins=awards=null;confetti=[];victoryPending=false;}
  if(lastT===null||t<lastT||t-lastT>500){lastT=t;lastX=S.wx;lastY=S.wy;return;}
  const dt=(t-lastT)/1000,dx=S.wx-lastX,dy=S.wy-lastY;lastT=t;lastX=S.wx;lastY=S.wy;speed=Math.hypot(dx,dy)/Math.max(dt,.001);stopped=speed<8?stopped+dt:0;
  if(speed>20&&speed<2000){const k=((Math.round(Math.atan2(dy,dx)/(Math.PI/2))%4)+4)%4;if(k!==sector){if(sector!==null)turns.push(t);sector=k;}}
  turns=turns.filter(x=>t-x<2500);if(has('gesture:dance')&&turns.length>=4)danceUntil=t+3000;
  const won=count(S.activities?.done);if(wins===null)wins=won;if(won>wins&&has('gesture:victory'))victoryPending=true;wins=won;
  const got=count(S.ach)+count(q().claims);if(awards===null)awards=got;if(got>awards&&has('gesture:confetti'))burst(t,18);awards=got;
  if(victoryPending&&!runtime.activityActive){victoryPending=false;victoryAt=t;burst(t,12);}
  confetti=confetti.filter(p=>t-p.t<1600);
 }
 function burst(t,n){if(still()){for(let i=0;i<n;i++)confetti.push({t,x:(i%6-2.5)*6,y:-12-Math.floor(i/6)*5,vx:0,vy:0,c:i%3});return;}for(let i=0;i<n;i++){const a=-Math.PI/2+(i/n-.5)*2.4;confetti.push({t,x:0,y:0,vx:Math.cos(a)*(50+i%5*14),vy:Math.sin(a)*(70+i%4*16),c:i%3});}}
 function tap(t=performance.now()){taps=taps.filter(x=>t-x<380);taps.push(t);if(taps.length>=2&&has('gesture:flip')){flipAt=t;taps=[];}}
 // Inside the cube's transform, after the other pieces: how gestures move the body.
 function transform(c,x,y,s,t){
  if(!runtime.inWorld())return;sample(t);const calm=still();let rot=0,oy=0,sx=1,sy=1;
  const flip=(t-flipAt)/520;if(flip>=0&&flip<1)rot+=calm?(flip<.5?.35:0):Math.PI*2*(flip<.5?2*flip*flip:1-2*(1-flip)**2);
  if(has('gesture:pose')&&stopped>5){rot+=-.26;oy-=2;}
  if(t<danceUntil){const b=calm?0:Math.sin(t/160);oy-=Math.abs(b)*4;rot+=calm?.2:Math.sign(Math.sin(t/320))*.2;}
  const v=(t-victoryAt)/1800;if(v>=0&&v<1){const hop=calm?.5:Math.abs(Math.sin(v*Math.PI*3));oy-=hop*8;sx*=1-hop*.08;sy*=1+hop*.12;if(!calm&&v>.66)rot+=Math.PI*2*(v-.66)/.34;}
  if(rot||oy||sx!==1||sy!==1){c.translate(x,y+oy);c.rotate(rot);c.scale(sx,sy);c.translate(-x,-y);}
 }
 // After the cube: the pose sparkle and confetti.
 function draw(c,x,y,s,t){
  if(!runtime.inWorld())return;const calm=still();c.save();
  if(has('gesture:pose')&&stopped>5){const tw=calm?1:.5+.5*Math.sin(t/180);c.fillStyle='#fff';c.globalAlpha=.9*tw;const sx=Math.round(x+s/2+6),sy=Math.round(y-s/2-6);c.fillRect(sx-3,sy,7,1);c.fillRect(sx,sy-3,1,7);c.fillRect(sx-1,sy-1,3,3);}
  const flip=(t-flipAt)/520;if(flip>=0&&flip<1&&!calm){c.strokeStyle='#fff';c.globalAlpha=.6*(1-flip);c.lineWidth=1;c.beginPath();c.arc(x,y,s*.9+3,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,flip*1.4));c.stroke();}
  if(t<danceUntil){c.fillStyle=runtime.musicInk?.(null,'lead')||'#fff';c.globalAlpha=.9;for(const side of [-1,1]){const nx=Math.round(x+side*(s/2+7)),ny=Math.round(y-s/2-2+(calm?0:Math.sin(t/160+side)*3));c.fillRect(nx,ny+3,2,2);c.fillRect(nx+1,ny-1,1,4);c.fillRect(nx+2,ny-1,1,1);}}
  const colors=['#f0d27a','#fff',runtime.musicInk?.(null,'lead')||'#7cf'];
  for(const p of confetti){const age=(t-p.t)/1000;c.fillStyle=colors[p.c];c.globalAlpha=Math.max(0,1-age/1.6);c.fillRect(Math.round(x+p.x+p.vx*age),Math.round(y+p.y+p.vy*age+(calm?0:90*age*age)),2,2);}
  c.restore();
 }
 const look=()=>{const id=q().wear?.pulse||'';return runtime.inWorld()&&SHOP_PULSES.includes(id)?id:'';};
 Object.defineProperties(runtime,{cubeShopGestureTransform:{get:()=>transform},drawCubeShopGestures:{get:()=>draw},cubeShopTap:{get:()=>tap},cubeShopPulseLook:{get:()=>look},
  cubeShopMoves:{get:()=>()=>({posing:has('gesture:pose')&&stopped>5,flipped:flipAt>0,dancing:danceUntil>0,victory:victoryAt>0,confetti:confetti.length>0})}});
}
