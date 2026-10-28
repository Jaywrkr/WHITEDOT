// Living encounters: simple shapes in the light of their biome, over the black of the World (docs/UNIVERSO.md).
// The cube stays small: the prey is about its size, a soft glow says where it is and an arrow where it went.
import {liveDefinition,LIVE_COLORS,LIVE_FAREWELL,LIVE_PULSE_CATCH} from './live-encounters-model.js';
const TAU=Math.PI*2;
function glow(c,x,y,r,color,alpha){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=alpha;c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function ring(c,x,y,r){c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();}
// One shape per encounter: drawn at x,y, facing a, at time t (0 with reduced motion).
const SHAPES={
 polilla(c,x,y,a,t){const flap=.4+.6*Math.abs(Math.sin(t*18));c.save();c.translate(x,y);c.rotate(a+Math.PI/2);c.beginPath();c.moveTo(0,0);c.lineTo(-7*flap,-4);c.lineTo(-6*flap,4);c.closePath();c.moveTo(0,0);c.lineTo(7*flap,-4);c.lineTo(6*flap,4);c.closePath();c.fill();c.fillRect(-1,-4,2,8);c.restore();},
 racimo(c,x,y,a,t,s){for(let i=0;i<5;i++){const q=i*TAU/5+(s.hopIndex||0),r=i?5:0;c.fillRect(x+Math.cos(q)*r-1.5,y+Math.sin(q)*r-1.5,3,3);}},
 pez(c,x,y,a,t,s){if(s.hidden){c.globalAlpha*=.35;ring(c,x,y,7);return;}c.save();c.translate(x,y);c.rotate(a);c.beginPath();c.ellipse(0,0,7,3.5,0,0,TAU);c.fill();c.beginPath();c.moveTo(-6,0);c.lineTo(-11,-4);c.lineTo(-11,4);c.closePath();c.fill();c.restore();},
 tambor(c,x,y,a,t,s){c.lineWidth=1.5;ring(c,x,y,6);const spin=s.age*6;for(let i=0;i<3;i++){const q=spin+i*TAU/3;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(q)*6,y+Math.sin(q)*6);c.stroke();}c.lineWidth=1;},
 semilla(c,x,y,a,t){c.fillRect(x-2,y-2,4,4);for(let i=0;i<4;i++){const q=i*TAU/4+t*2;c.fillRect(x+Math.cos(q)*5-.5,y+Math.sin(q)*5-.5,1,1);}},
 cometa(c,x,y,a,t,s,ox,oy){c.save();c.translate(x,y);c.rotate(a+Math.PI/2);c.beginPath();c.moveTo(0,-7);c.lineTo(4,0);c.lineTo(0,5);c.lineTo(-4,0);c.closePath();c.fill();c.restore();c.beginPath();c.moveTo(x-Math.cos(a)*5,y-Math.sin(a)*5);for(let i=1;i<6;i++){const k=i*4;c.lineTo(x-Math.cos(a)*(5+k)+Math.sin(t*6+i)*2,y-Math.sin(a)*(5+k)+Math.cos(t*6+i)*2);}c.stroke();
  // The mark it flies to: reach the kite before it gets there.
  const gx=s.goal.x+ox,gy=s.goal.y+oy;c.globalAlpha=.8;c.beginPath();c.moveTo(gx,gy-18);c.lineTo(gx,gy+18);c.stroke();for(let i=0;i<3;i++)c.fillRect(gx+1+(i%2)*4,gy-18+i*4,4,4);},
 reflejo(c,x,y,a,t,s,ox,oy){c.save();c.globalAlpha*=.22;c.beginPath();for(let i=1;i<7;i++){const p=s.nodes[i],q=s.nodes[i%6+1];c.moveTo(s.nodes[0].x+ox,s.nodes[0].y+oy);c.lineTo(p.x+ox,p.y+oy);c.lineTo(q.x+ox,q.y+oy);}c.stroke();for(const p of s.nodes)c.fillRect(p.x+ox-1.5,p.y+oy-1.5,3,3);c.restore();c.strokeRect(Math.round(x-4)+.5,Math.round(y-4)+.5,8,8);c.fillRect(Math.round(x-1),Math.round(y-1),2,2);},
 pulsar(c,x,y,a,t,s){if(s.hidden)return;c.fillRect(x-2,y-2,4,4);const r=6+Math.abs(Math.sin(t*9))*3;for(let i=0;i<4;i++){const q=i*TAU/4+t;c.beginPath();c.moveTo(x+Math.cos(q)*3,y+Math.sin(q)*3);c.lineTo(x+Math.cos(q)*r,y+Math.sin(q)*r);c.stroke();}},
 llamarada(c,x,y,a,t,s,ox,oy){s.trail.forEach((p,i)=>{c.globalAlpha=.08+i/s.trail.length*.45;c.fillRect(p.x+ox-1.5,p.y+oy-1.5,3,3);});c.globalAlpha=.95;const f=4+Math.abs(Math.sin(t*14))*2;c.beginPath();c.moveTo(x+Math.cos(a)*f*1.6,y+Math.sin(a)*f*1.6);c.lineTo(x+Math.cos(a+2.4)*f,y+Math.sin(a+2.4)*f);c.lineTo(x+Math.cos(a-2.4)*f,y+Math.sin(a-2.4)*f);c.closePath();c.fill();},
 eco(c,x,y,a,t,s,ox,oy){const gx=s.goal.x+ox,gy=s.goal.y+oy;c.save();c.fillStyle='#000';c.globalAlpha=.9;c.beginPath();c.arc(gx,gy,16,0,TAU);c.fill();c.restore();c.globalAlpha=.5;ring(c,gx,gy,18+Math.sin(t*2)*1.5);c.globalAlpha=.9;for(let i=2;i>=0;i--){c.globalAlpha=.25+.3*(2-i);const k=i*7;c.strokeRect(Math.round(x-Math.cos(a)*k-4)+.5,Math.round(y-Math.sin(a)*k-4)+.5,8,8);}},
 estrella(c,x,y,a,t,s,ox,oy){c.lineWidth=1;s.trail.forEach((p,i)=>{c.globalAlpha=i/s.trail.length*.6;c.fillRect(p.x+ox-1,p.y+oy-1,2,2);});c.globalAlpha=1;c.fillRect(x-2,y-2,4,4);c.beginPath();c.moveTo(x-5,y);c.lineTo(x+5,y);c.moveTo(x,y-5);c.lineTo(x,y+5);c.stroke();}
};
export const LIVE_SHAPES=Object.freeze(Object.keys(SHAPES));
// The scene: the prey and its light; a ring while a pulse on time holds it; the catch opens in its colour; on escape it fades.
export function drawLive(r,s,{color,reduced=false,line='',clock=0}={}){
 if(!s)return;const c=r.cx,ox=r.W/2-r.camX,oy=r.H/2-r.camY,x=s.x+ox,y=s.y+oy,t=reduced?0:s.age,def=liveDefinition(s.kind);
 c.save();c.lineWidth=1;c.strokeStyle=c.fillStyle=color;
 if(s.stage==='run'){
  if(!s.hidden)glow(c,x,y,22,color,.32);c.globalAlpha=.95;c.strokeStyle=c.fillStyle=color;SHAPES[s.kind]?.(c,x,y,s.heading||0,t,s,ox,oy);
  if(s.hold>0){c.globalAlpha=.6*Math.min(1,s.hold);ring(c,x,y,13);}
  pointer(r,s,x,y,color,reduced);
 }else{
  const k=Math.min(1,s.over/LIVE_FAREWELL);
  if(s.stage==='caught'){c.globalAlpha=(1-k)*.85;ring(c,x,y,8+k*(reduced?14:40));for(let i=0;i<8;i++){const q=i*TAU/8,rad=6+k*(reduced?10:30);c.fillRect(x+Math.cos(q)*rad-1.5,y+Math.sin(q)*rad-1.5,3,3);}}
  else{c.globalAlpha=(1-k)*.7;SHAPES[s.kind]?.(c,x,y,s.heading||0,t,{...s,hidden:false,trail:[]},ox,oy);}
 }
 // One short line: when it appears, and its goodbye when it gets away. «Textos en el universo» hides both.
 if(line){c.globalAlpha=.78;c.fillStyle='#ddd';c.font='11px "Geist Mono",monospace';c.textAlign='center';c.fillText(line,r.W/2,Math.min(r.H-135,r.H/2+130));}
 c.restore();
}
// Where it went: an arrow by the cube while it is on screen and away; at the edge of the screen when it is beyond.
function pointer(r,s,x,y,color,reduced){
 const c=r.cx,cx=r.W/2,cy=r.H/2,dx=x-cx,dy=y-cy,l=Math.hypot(dx,dy);if(l<LIVE_PULSE_CATCH*.6)return;const a=Math.atan2(dy,dx),off=x<14||y<14||x>r.W-14||y>r.H-14;
 const pulse=reduced?.7:.55+.3*Math.sin(performance.now()/180);c.save();c.fillStyle=color;c.globalAlpha=pulse;
 let px=cx+Math.cos(a)*24,py=cy+Math.sin(a)*24,size=4;
 if(off){const k=Math.min((r.W/2-18)/Math.abs(Math.cos(a)||1e-6),(r.H/2-90)/Math.abs(Math.sin(a)||1e-6));px=cx+Math.cos(a)*k;py=cy+Math.sin(a)*k;size=7;}
 c.translate(px,py);c.rotate(a);c.beginPath();c.moveTo(size,0);c.lineTo(-size*.7,-size*.7);c.lineTo(-size*.7,size*.7);c.closePath();c.fill();c.restore();
}
