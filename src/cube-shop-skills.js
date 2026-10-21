import {prefersReducedMotion} from './frame-state.js';
import {wearing} from './cube-shop-model.js';
// Cube shop batch 7: skills, the only pieces that help you play. Each is small and has its own limit.
export const SHOP_SKILLS=Object.freeze(['skill:magnet','skill:sprint','skill:glide']);
// Imán corto: common and rare fragments come from a little further.
export const MAGNET_SCALE=1.35;
// Sprint: starting to move after standing still gives a short burst, then it recharges.
export const SPRINT={still:.5,seconds:1,boost:.7,recharge:6};
export function sprintBoost(age){if(!(age>=0)||age>=SPRINT.seconds)return 1;return 1+SPRINT.boost*.5*(1+Math.cos(Math.PI*age/SPRINT.seconds));}
// Planeo: a tap in the Sky glides down for a while, steering, and lands where it ends over land.
export const GLIDE={seconds:2.5,longest:6};
export function initialize(runtime){
 let owner=null,still=0,sprintAt=-1e9,clock=0,glide=null;
 const counts={sprints:0,glides:0,landed:0};
 const q=()=>runtime.sparkEconomy||{},has=id=>runtime.inWorld()&&wearing(q(),id);
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 function own(){if(owner!==runtime.S){owner=runtime.S;still=0;sprintAt=-1e9;glide=null;}}
 const magnet=()=>has('skill:magnet')?MAGNET_SCALE:1;
 // Called once per frame with the player's own input; returns the speed multiplier.
 function boost(dt,moving){
  own();clock+=dt;if(!has('skill:sprint')){still=0;return 1;}
  if(!moving){still+=dt;return 1;}
  if(still>=SPRINT.still&&clock-sprintAt>=SPRINT.recharge){sprintAt=clock;counts.sprints++;}
  still=0;return sprintBoost(clock-sprintAt);
 }
 const sprinting=()=>has('skill:sprint')&&clock-sprintAt<SPRINT.seconds;
 const ready=()=>has('skill:sprint')&&clock-sprintAt>=SPRINT.recharge;
 // The Sky's tap: start a glide instead of dropping straight down.
 function startGlide(){own();if(!has('skill:glide')||(runtime.S.layer||'superficie')!=='cielo')return false;if(!glide){glide={age:0};counts.glides++;runtime.toast?.('<em>Planeo</em> · dirige la bajada');}return true;}
 function glideTick(dt){
  if(!glide)return;if((runtime.S.layer||'superficie')!=='cielo'||!has('skill:glide')){glide=null;return;}glide.age+=dt;
  if(glide.age<GLIDE.seconds)return;const S=runtime.S,sea=!!runtime.regionOfPos?.(S.wx,S.wy)?.sea;
  if(!sea){glide=null;counts.landed++;runtime.surfaceLayer?.(S.wx,S.wy,'<em>Aterrizaste</em> · '+(runtime.regionOfPos?.(S.wx,S.wy)?.name||''));return;}
  if(glide.age>=GLIDE.longest){glide=null;runtime.toast?.('<em>Cielo</em> · abajo hay mar. Busca tierra para bajar');}
 }
 let lastT=null;
 function draw(c,x,y,s,t){
  if(!runtime.inWorld())return;own();const dt=lastT===null||t<lastT||t-lastT>500?0:(t-lastT)/1000;lastT=t;glideTick(dt);const reduced=calm();c.save();c.globalAlpha=1;
  if(sprinting()){const k=1-(clock-sprintAt)/SPRINT.seconds;c.strokeStyle='#fff';c.globalAlpha=.5*k;c.lineWidth=1;for(let i=0;i<3;i++){const oy=(i-1)*s*.35;c.beginPath();c.moveTo(Math.round(x-s/2-4-(reduced?0:i*3)),Math.round(y+oy)+.5);c.lineTo(Math.round(x-s/2-14-(reduced?0:i*4)),Math.round(y+oy)+.5);c.stroke();}}
  else if(has('skill:sprint')){c.fillStyle=ready()?'#f0d27a':'#ffffff44';c.fillRect(Math.round(x-s/2-5),Math.round(y+s/2+3),3,1);}
  if(has('skill:magnet')){c.strokeStyle='#ffffff99';c.globalAlpha=.8;c.lineWidth=1;const mx=Math.round(x+s/2+4),my=Math.round(y+s/2+2);c.beginPath();c.arc(mx+2,my+2,2.5,Math.PI,0,true);c.stroke();c.fillStyle='#f0d27a';c.fillRect(mx-1,my+2,2,2);c.fillRect(mx+4,my+2,2,2);}
  if(glide){const k=Math.min(1,glide.age/GLIDE.seconds),r=s*(2-1.2*k);c.strokeStyle='#cfe6ff';c.globalAlpha=.7;c.setLineDash?.([3,3]);c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke();c.setLineDash?.([]);c.fillStyle='#cfe6ff';c.globalAlpha=.3;c.fillRect(Math.round(x-s*.6),Math.round(y+s*(1.4-k*.6)),Math.round(s*1.2),2);
   if(!reduced){c.globalAlpha=.6;c.strokeStyle='#fff';for(const side of [-1,1]){c.beginPath();c.moveTo(x+side*s*.5,y);c.lineTo(x+side*s*1.4,y-s*.3+Math.sin(t/160)*2);c.stroke();}}}
  else if(has('skill:glide')&&(runtime.S.layer||'superficie')==='cielo'){c.strokeStyle='#cfe6ff';c.globalAlpha=.5;for(const side of [-1,1]){c.beginPath();c.moveTo(x+side*s*.5,y);c.lineTo(x+side*s*1.2,y-s*.25);c.stroke();}}
  c.restore();
 }
 Object.defineProperties(runtime,{cubeShopMagnet:{get:()=>magnet},cubeShopBoost:{get:()=>boost},cubeShopGlide:{get:()=>startGlide},drawCubeShopSkills:{get:()=>draw},
  cubeShopSkills:{get:()=>()=>({...counts,sprinting:sprinting(),ready:ready(),gliding:glide?glide.age:null,magnet:magnet()})}});
}
