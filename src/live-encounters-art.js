// Living encounters: simple shapes in the light of their biome, over the black of the World (docs/UNIVERSO.md).
// The cube stays small: the prey is about its size, a soft glow says where it is and an arrow where it went.
// Fleeing (batch 2): the threat shines in the biome's colour, the safe place is white (a ring, a dashed edge, a shelter)
// and a white arrow by the cube points to it; a thin white arc round the cube fills while lasting is enough.
// Doing (batch 3): the task in the biome's colour, the next step ringed in white with the white arrow on it, a counter of
// small squares under the cube and a thin white arc round it that empties with the time left.
import {liveDefinition,liveGoal,LIVE_COLORS,LIVE_FAREWELL,LIVE_PULSE_CATCH,LIVE_BURN} from './live-encounters-model.js';
const TAU=Math.PI*2;
function glow(c,x,y,r,color,alpha){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=alpha;c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function ring(c,x,y,r){c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();}
const line=(c,ax,ay,bx,by)=>{c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.stroke();};
// Batch 2: a mark that grows towards the beat it lands on (the falling stones, the flares).
function mark(c,q,ox,oy,s,color){const left=Math.max(0,q.land-(s.beats||0)-(s.phase||0)),k=Math.max(0,Math.min(1,1-left/2));c.globalAlpha=.16+.3*k;c.fillStyle=color;c.beginPath();c.arc(q.x+ox,q.y+oy,q.r,0,TAU);c.fill();c.globalAlpha=.85;c.lineWidth=1.5;ring(c,q.x+ox,q.y+oy,q.r);c.globalAlpha=.6;ring(c,q.x+ox,q.y+oy,q.r*(1+1.2*(1-k)));c.lineWidth=1;}
function fallen(c,list,ox,oy,age,color,star){for(const q of list){const k=(age-q.at)/.6;if(k>1)continue;c.globalAlpha=(1-k)*.9;c.fillStyle=color;if(star){for(let i=0;i<8;i++){const a=i*TAU/8,r=q.r*(.4+k*.8);c.fillRect(q.x+ox+Math.cos(a)*r-2,q.y+oy+Math.sin(a)*r-2,4,4);}}else{c.fillRect(q.x+ox-9,q.y+oy-9,18,18);c.strokeRect(q.x+ox-q.r*k,q.y+oy-q.r*k,q.r*2*k,q.r*2*k);}}}
// A long front (the wave, the sand) across the direction it travels.
function front(c,s,ox,oy,dir,t,color,sand){const fx=s.front.x+ox,fy=s.front.y+oy,px=-dir.y,py=dir.x,h=s.half;
 c.globalAlpha=.14;c.fillStyle=color;c.beginPath();c.moveTo(fx-px*h,fy-py*h);c.lineTo(fx+px*h,fy+py*h);c.lineTo(fx+px*h-dir.x*60,fy+py*h-dir.y*60);c.lineTo(fx-px*h-dir.x*60,fy-py*h-dir.y*60);c.closePath();c.fill();
 c.globalAlpha=.95;c.lineWidth=3;line(c,fx-px*h,fy-py*h,fx+px*h,fy+py*h);c.lineWidth=1;c.globalAlpha=.5;const b=sand?14:9;line(c,fx-px*h-dir.x*b,fy-py*h-dir.y*b,fx+px*h-dir.x*b,fy+py*h-dir.y*b);
 c.globalAlpha=.85;for(let i=-20;i<=20;i++){const k=i*40+((t*(sand?90:40))%40),w=sand?Math.sin(i*1.7+t*9)*6:Math.sin(i+t*4)*4;c.fillRect(fx+px*k+dir.x*w-1.5,fy+py*k+dir.y*w-1.5,3,3);}}
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
Object.assign(SHAPES,{
 // Batch 2 · huir: the threats.
 remolino(c,x,y,a,t,s){glow(c,x,y,40,c.strokeStyle,.35);c.globalAlpha=.95;c.lineWidth=2;for(let k=0;k<3;k++){c.beginPath();for(let i=0;i<=12;i++){const q=t*7+k*TAU/3+i*.32,r=3+i*1.5,px=x+Math.cos(q)*r,py=y+Math.sin(q)*r*.8;i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();}for(let i=0;i<6;i++){const q=-t*4+i*TAU/6;c.fillRect(x+Math.cos(q)*26-1.5,y+Math.sin(q)*21-1.5,3,3);}c.lineWidth=1;},
 enjambre(c,x,y,a,t,s,ox,oy){const hx=s.hive.x+ox,hy=s.hive.y+oy;c.globalAlpha=.9;c.lineWidth=1.5;c.beginPath();for(let i=0;i<=6;i++){const q=i*TAU/6+Math.PI/6;i?c.lineTo(hx+Math.cos(q)*13,hy+Math.sin(q)*13):c.moveTo(hx+Math.cos(q)*13,hy+Math.sin(q)*13);}c.stroke();c.globalAlpha=.4;c.fill();
  glow(c,x,y,34,c.strokeStyle,.4);c.globalAlpha=1;for(let i=0;i<10;i++){const q=i*2.4+t*(5+i%3),r=4+(i*7%11)+Math.sin(t*11+i)*2;c.fillRect(x+Math.cos(q)*r-1.5,y+Math.sin(q)*r-1.5,3,3);}c.lineWidth=1;},
 ola(c,x,y,a,t,s,ox,oy){front(c,s,ox,oy,s.dir,t,c.strokeStyle,false);},
 derrumbe(c,x,y,a,t,s,ox,oy){const color=c.fillStyle;fallen(c,s.fallen,ox,oy,s.age,color,false);for(const q of s.shadows)mark(c,q,ox,oy,s,color);},
 polen(c,x,y,a,t,s){const r=s.radius;glow(c,x,y,r*1.4,c.fillStyle,.45);c.globalAlpha=.75;c.lineWidth=1.5;ring(c,x,y,r);c.globalAlpha=.9;for(let i=0;i<16;i++){const q=i*2.39+t*.8,d=r*(.25+.7*((i*37%16)/16))+Math.sin(t*3+i)*3;c.fillRect(x+Math.cos(q)*d-1.5,y+Math.sin(q)*d-1.5,3,3);}c.lineWidth=1;},
 arena(c,x,y,a,t,s,ox,oy){front(c,s,ox,oy,{x:-s.dir.x,y:-s.dir.y},t,c.strokeStyle,true);c.globalAlpha=1;for(const q of s.stones){const sx=q.x+ox,sy=q.y+oy;c.beginPath();c.moveTo(sx-12,sy+8);c.lineTo(sx-9,sy-7);c.lineTo(sx+3,sy-11);c.lineTo(sx+12,sy-2);c.lineTo(sx+10,sy+9);c.closePath();c.fill();}},
 rayos(c,x,y,a,t,s){const armed=s.age>=1.4;glow(c,x,y,30,c.strokeStyle,.45);for(const b of s.angles){const ex=x+Math.cos(b)*s.length,ey=y+Math.sin(b)*s.length;c.globalAlpha=armed?.28:.12;c.lineWidth=9;line(c,x,y,ex,ey);c.globalAlpha=armed?1:.45;c.lineWidth=armed?2.5:1;line(c,x,y,ex,ey);
  // where it sweeps next: a faint wedge.
  if(armed){c.globalAlpha=.1;c.beginPath();c.moveTo(x,y);c.arc(x,y,s.length,s.spin>0?b:b-Math.PI/4,s.spin>0?b+Math.PI/4:b);c.closePath();c.fill();}}
  c.globalAlpha=1;c.lineWidth=1.5;c.beginPath();c.moveTo(x,y-11);c.lineTo(x+10,y+7);c.lineTo(x-10,y+7);c.closePath();c.fill();c.lineWidth=1;},
 ondas(c,x,y,a,t,s){const hot=(s.phase??1)<.25;glow(c,x,y,28,c.strokeStyle,.5);for(const q of s.rings){const fade=Math.max(0,1-q.r/520);c.globalAlpha=(hot?1:.38)*Math.max(.25,fade);c.lineWidth=hot?3:1.5;ring(c,x,y,q.r);}c.lineWidth=1;c.globalAlpha=1;c.fillRect(x-3,y-3,6,6);},
 llamaradas(c,x,y,a,t,s,ox,oy){const color=c.fillStyle;fallen(c,s.burnt,ox,oy,s.age,color,true);for(const q of s.flares)mark(c,q,ox,oy,s,color);},
 pozo(c,x,y,a,t,s){c.save();c.fillStyle='#000';c.globalAlpha=1;c.beginPath();c.arc(x,y,26,0,TAU);c.fill();c.restore();c.lineWidth=1.5;for(let i=0;i<4;i++){const k=((i/4)+(t*.5%1/4))%1,r=26+(1-k)*110;c.globalAlpha=.15+.75*k;ring(c,x,y,r);}c.globalAlpha=1;c.lineWidth=2;ring(c,x,y,26);c.lineWidth=1;},
 agujero(c,x,y,a,t,s){glow(c,x,y,70,'#ffffff',.18);c.save();c.globalAlpha=.9;c.lineWidth=2.5;c.beginPath();c.ellipse(x,y,44,15,t*.6,0,TAU);c.stroke();c.lineWidth=1;for(let i=0;i<14;i++){const q=i*TAU/14-t*(2+i%3),r=34+((i*13)%30)-((t*30+i*9)%30);c.fillRect(x+Math.cos(q)*r-1,y+Math.sin(q)*r*.6-1,2,2);}c.fillStyle='#000';c.globalAlpha=1;c.beginPath();c.arc(x,y,22,0,TAU);c.fill();c.restore();c.globalAlpha=1;c.lineWidth=1.5;ring(c,x,y,23);c.lineWidth=1;}
});
// Batch 3 · hacer: what the task asks for shines in the biome's colour on a dark disc (as the chase prey since alpha.228);
// numbers say the order; the next step has a white ring and the white arrow points to it; what is done turns white.
function spot(c,x,y,color,r=9,lit=false){glow(c,x,y,r*2.6,color,lit?.5:.32);c.globalAlpha=.6;c.fillStyle='#000';c.beginPath();c.arc(x,y,r+2,0,TAU);c.fill();c.globalAlpha=lit?1:.8;c.strokeStyle=lit?'#ffffff':color;c.lineWidth=1.5;ring(c,x,y,r);c.lineWidth=1;c.strokeStyle=c.fillStyle=color;}
function num(c,x,y,n,color='#ffffff'){c.save();c.globalAlpha=.95;c.fillStyle=color;c.font='10px "Geist Mono",monospace';c.textAlign='center';c.textBaseline='middle';c.fillText(String(n),x,y);c.restore();}
// A dashed edge (a destination or an area), white when it is where to go.
function dashed(c,x,y,r,t,color,alpha=.6){c.save();c.strokeStyle=color;c.globalAlpha=alpha;c.lineWidth=1.5;c.setLineDash([6,8]);c.lineDashOffset=-t*12;ring(c,x,y,r);c.restore();}
// A partial ring: how far a step has gone (a mote taking root, a sprout drinking, a pulsar warming, a sprout drying).
function arc(c,x,y,r,k,color,alpha=.9){if(!(k>0))return;c.save();c.strokeStyle=color;c.globalAlpha=alpha;c.lineWidth=2;c.beginPath();c.arc(x,y,r,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,k));c.stroke();c.restore();}
Object.assign(SHAPES,{
 motas(c,x,y,a,t,s,ox,oy){const color=c.fillStyle;s.items.forEach((q,i)=>{const px=q.x+ox,py=q.y+oy;if(q.done){c.globalAlpha=.9;c.fillStyle='#ffffff';c.fillRect(px-2.5,py-2.5,5,5);for(let k=0;k<4;k++){const b=k*TAU/4+t;c.fillRect(px+Math.cos(b)*6-1,py+Math.sin(b)*6-1,2,2);}c.fillStyle=color;return;}
  spot(c,px,py,color,8);c.globalAlpha=1;c.fillStyle=color;c.fillRect(px-1.5,py-1.5,3,3);arc(c,px,py,12,q.grow,'#ffffff');num(c,px+13,py-13,q.n);});},
 estrellita(c,x,y,a,t,s,ox,oy){const color=c.fillStyle,h=s.home,hx=h.x+ox,hy=h.y+oy;
  // Its cluster: a ring of stars round the marked spot, with one missing.
  dashed(c,hx,hy,h.r,t,s.star.held?'#ffffff':color,s.star.held?.8:.45);c.globalAlpha=.9;c.fillStyle=color;for(let i=0;i<6;i++){const b=i*TAU/6+t*.3;c.fillRect(hx+Math.cos(b)*16-1.5,hy+Math.sin(b)*16-1.5,3,3);}
  const st=s.star,sx=st.x+ox,sy=st.y+oy;spot(c,sx,sy,color,8,st.held);c.globalAlpha=1;c.fillStyle=color;c.beginPath();for(let i=0;i<10;i++){const b=i*TAU/10-Math.PI/2+t,r=i%2?2.5:6;i?c.lineTo(sx+Math.cos(b)*r,sy+Math.sin(b)*r):c.moveTo(sx+Math.cos(b)*r,sy+Math.sin(b)*r);}c.closePath();c.fill();},
 burbujas(c,x,y,a,t,s,ox,oy){const color=c.fillStyle;for(const b of s.bubbles){const px=b.x+ox,py=b.y+oy,fade=Math.max(0,Math.min(1,(3.4-b.age)/.6));
  // Filled and edged, so they stand out from the Marea's own drawn rings.
  glow(c,px,py,b.r*2.6,color,.45*fade);c.globalAlpha=.3*fade;c.fillStyle=color;c.beginPath();c.arc(px,py,b.r,0,TAU);c.fill();c.globalAlpha=fade;c.strokeStyle=color;c.lineWidth=2.5;ring(c,px,py,b.r);c.globalAlpha=.9*fade;c.fillStyle='#ffffff';c.fillRect(px-b.r*.5,py-b.r*.5,4,4);}
  for(const q of s.pops){const k=(s.age-q.at)/.5;if(k>1)continue;c.globalAlpha=(1-k)*.9;c.fillStyle='#ffffff';for(let i=0;i<6;i++){const b=i*TAU/6;c.fillRect(q.x+ox+Math.cos(b)*(8+k*16)-1.5,q.y+oy+Math.sin(b)*(8+k*16)-1.5,3,3);}}c.lineWidth=1;c.fillStyle=c.strokeStyle=color;},
 guardian(c,x,y,a,t,s){const color=c.fillStyle,shake=s.cool>0?Math.sin(s.age*60)*1.5:0;glow(c,x,y,46,color,.3);
  c.save();c.translate(x+shake,y);c.rotate(s.face);c.globalAlpha=.6;c.fillStyle='#000';c.fillRect(-24,-20,48,40);c.globalAlpha=1;c.strokeStyle=color;c.lineWidth=2;c.strokeRect(-22,-18,44,36);c.fillStyle=color;
  // Its eyes look ahead (where it faces); its three marks are on its back.
  c.fillRect(12,-9,5,5);c.fillRect(12,4,5,5);for(let i=0;i<3;i++){const lit=i<s.done;c.globalAlpha=lit?1:.55+.35*Math.abs(Math.sin(t*3+i));c.fillStyle=lit?'#ffffff':color;c.fillRect(-21,-13+i*10-3,6,6);}c.restore();
  // From the front it only nudges; its back is lit while you are behind it.
  c.save();c.strokeStyle='#ffffff';c.globalAlpha=s.behind?.9:.35;c.lineWidth=2;c.beginPath();c.arc(x,y,34,s.face+Math.PI-.8,s.face+Math.PI+.8);c.stroke();c.restore();c.fillStyle=c.strokeStyle=color;c.lineWidth=1;},
 brotes(c,x,y,a,t,s,ox,oy){const color=c.fillStyle;for(const q of s.sprouts){const px=q.x+ox,py=q.y+oy;if(q.done){c.globalAlpha=1;c.fillStyle='#ffffff';c.fillRect(px-1,py-8,2,9);c.fillRect(px-6,py-8,5,3);c.fillRect(px+1,py-11,5,3);c.fillStyle=color;continue;}
  if(q.dry){c.globalAlpha=.4;c.fillStyle=color;c.fillRect(px-4,py-1,8,2);continue;}
  const k=q.left/q.full;spot(c,px,py,color,9);c.globalAlpha=1;c.fillStyle=color;c.fillRect(px-1,py-5,2,7);c.fillRect(px-4,py-5,3,2);
  // What is left before it dries: a ring that empties (white while you water it).
  arc(c,px,py,13,k,color,.75);arc(c,px,py,17,q.wet,'#ffffff');}},
 caravana(c,x,y,a,t,s,ox,oy){const color=c.fillStyle,o=s.oasis;dashed(c,o.x+ox,o.y+oy,o.r,t,s.joined?'#ffffff':color,s.joined?.75:.45);glow(c,o.x+ox,o.y+oy,o.r*.6,color,.18);
  for(const q of s.stones){const sx=q.x+ox,sy=q.y+oy;c.globalAlpha=1;c.fillStyle=color;c.beginPath();c.moveTo(sx-16,sy+10);c.lineTo(sx-11,sy-9);c.lineTo(sx+4,sy-14);c.lineTo(sx+16,sy-2);c.lineTo(sx+13,sy+11);c.closePath();c.fill();c.globalAlpha=.25;c.strokeStyle=color;ring(c,sx,sy,q.r);}
  s.camels.forEach((q,i)=>{const px=q.x+ox,py=q.y+oy;if(!i)spot(c,px,py,color,8,s.joined);c.globalAlpha=q.stuck>0?.5:1;c.fillStyle=i?color:'#ffffff';c.fillRect(px-4,py-3,8,5);c.fillRect(px+2,py-6,3,3);});c.fillStyle=color;},
 nodos(c,x,y,a,t,s,ox,oy){const color=c.fillStyle;c.save();c.globalAlpha=.2;c.strokeStyle=color;c.beginPath();s.nodes.forEach((q,i)=>{const o=s.nodes[(i+1)%s.nodes.length];c.moveTo(q.x+ox,q.y+oy);c.lineTo(o.x+ox,o.y+oy);c.moveTo(q.x+ox,q.y+oy);c.lineTo(x,y);});c.stroke();c.restore();
  s.nodes.forEach(q=>{const px=q.x+ox,py=q.y+oy,flash=Math.max(0,1-(s.age-q.flash)/.45),wrong=s.age-q.wrong<.3;spot(c,px,py,color,9,q.done||flash>0);if(flash>0){glow(c,px,py,34,'#ffffff',.5*flash);}
   c.globalAlpha=wrong?.3:1;c.fillStyle=q.done?'#ffffff':color;c.save();c.translate(px,py);c.rotate(Math.PI/4);c.fillRect(-3.5,-3.5,7,7);c.restore();if(q.n)num(c,px+14,py-14,q.n,q.done?'#ffffff':'#dddddd');});c.fillStyle=color;},
 pulsares(c,x,y,a,t,s,ox,oy){const color=c.fillStyle;for(const q of s.lamps){const px=q.x+ox,py=q.y+oy,k=q.lit/LIVE_BURN;if(q.lit>0){glow(c,px,py,40,color,.55);c.globalAlpha=1;c.fillStyle='#ffffff';c.fillRect(px-3,py-3,6,6);const r=7+Math.abs(Math.sin(t*9))*3;c.strokeStyle='#ffffff';for(let i=0;i<4;i++){const b=i*TAU/4+t;c.beginPath();c.moveTo(px+Math.cos(b)*4,py+Math.sin(b)*4);c.lineTo(px+Math.cos(b)*r,py+Math.sin(b)*r);c.stroke();}
   // How long it still burns: a ring that empties.
   arc(c,px,py,15,k,'#ffffff',.85);c.strokeStyle=color;}else{spot(c,px,py,color,8);c.globalAlpha=.85;c.fillStyle=color;c.fillRect(px-2,py-2,4,4);arc(c,px,py,12,q.warm/.4,'#ffffff');}}c.fillStyle=color;},
 antena(c,x,y,a,t,s,ox,oy){const color=c.fillStyle,b=s.base,bx=b.x+ox,by=b.y+oy;dashed(c,bx,by,b.r,t,s.mast.held?'#ffffff':color,s.mast.held?.8:.45);
  // The base: a short tower with an empty socket.
  c.globalAlpha=1;c.fillStyle=color;c.fillRect(bx-7,by-2,14,12);c.fillRect(bx-2,by-14,4,12);
  const m=s.mast,mx=m.x+ox,my=m.y+oy;if(!m.held)spot(c,mx,my,color,10);c.globalAlpha=1;c.strokeStyle=m.held?'#ffffff':color;c.lineWidth=2;const tip=m.held?-Math.PI/2:.3;c.beginPath();c.moveTo(mx,my);c.lineTo(mx+Math.cos(tip)*14,my+Math.sin(tip)*14);c.stroke();c.fillStyle=c.strokeStyle;c.fillRect(mx+Math.cos(tip)*14-2,my+Math.sin(tip)*14-2,4,4);c.lineWidth=1;
  // A gust: streaks across the cube, faint one beat before and bright while it blows.
  const g=s.gust;if(g&&s.age<g.until){const on=s.age>=g.from;c.globalAlpha=on?.9:.35;c.fillStyle=color;for(let i=-3;i<=3;i++){const k=((t*160+i*37)%120)-60;c.fillRect(mx-g.y*i*9+g.x*k-3,my+g.x*i*9+g.y*k-1,6,2);}}c.fillStyle=c.strokeStyle=color;},
 luciernagas(c,x,y,a,t,s,ox,oy){const color=c.fillStyle,w=s.well;c.save();c.globalAlpha=.35;c.fillStyle='#000';c.beginPath();c.arc(w.x+ox,w.y+oy,w.r,0,TAU);c.fill();c.restore();dashed(c,w.x+ox,w.y+oy,w.r,t,color,.4);
  const done=s.got>=s.need,m=s.mouth;c.save();c.strokeStyle=done?'#ffffff':color;c.globalAlpha=done?.95:.5;c.lineWidth=2;ring(c,m.x+ox,m.y+oy,m.r);c.restore();
  for(const f of s.flies){const px=f.x+ox,py=f.y+oy,blink=.6+.4*Math.abs(Math.sin(t*4+f.ph));if(!f.got)spot(c,px,py,color,6);glow(c,px,py,14,f.got?'#ffffff':color,.5*blink);c.globalAlpha=blink;c.fillStyle=f.got?'#ffffff':color;c.fillRect(px-2,py-2,4,4);}c.fillStyle=color;},
 constelacion(c,x,y,a,t,s,ox,oy){const color=c.fillStyle;c.save();c.strokeStyle=color;c.globalAlpha=.22;c.setLineDash([3,6]);c.beginPath();for(const [i,j] of s.lines){c.moveTo(s.stars[i].x+ox,s.stars[i].y+oy);c.lineTo(s.stars[j].x+ox,s.stars[j].y+oy);}c.stroke();c.setLineDash([]);
  // What you drew: solid white lines, in the order you passed.
  c.strokeStyle='#ffffff';c.globalAlpha=.9;c.lineWidth=1.5;c.beginPath();for(const [i,j] of s.drawn){c.moveTo(s.stars[i].x+ox,s.stars[i].y+oy);c.lineTo(s.stars[j].x+ox,s.stars[j].y+oy);}c.stroke();c.restore();
  for(const q of s.stars){const px=q.x+ox,py=q.y+oy;spot(c,px,py,color,7,q.seen);c.globalAlpha=1;c.fillStyle=q.seen?'#ffffff':color;c.fillRect(px-2,py-2,4,4);c.beginPath();c.strokeStyle=c.fillStyle;c.moveTo(px-5,py);c.lineTo(px+5,py);c.moveTo(px,py-5);c.lineTo(px,py+5);c.stroke();}c.fillStyle=c.strokeStyle=color;}
});
export const LIVE_SHAPES=Object.freeze(Object.keys(SHAPES));
// Fleeing: the safe place in white. A ring to reach, the edge of a circle to leave, a shelter behind a stone.
function safety(c,s,ox,oy,t,reduced){c.save();c.strokeStyle=c.fillStyle='#ffffff';
 if(s.safe){const x=s.safe.x+ox,y=s.safe.y+oy,p=reduced?0:Math.sin(t*4);glow(c,x,y,s.safe.r+18,'#ffffff',.22);c.globalAlpha=.95;c.lineWidth=2;ring(c,x,y,s.safe.r);c.globalAlpha=.5;c.lineWidth=1;ring(c,x,y,s.safe.r+5+p*2);}
 if(s.rim){c.globalAlpha=.6;c.lineWidth=1.5;c.setLineDash([6,8]);c.lineDashOffset=reduced?0:-t*12;ring(c,s.rim.x+ox,s.rim.y+oy,s.rim.r);c.setLineDash([]);}
 if(s.stones)for(const q of s.stones){const x=q.shelter.x+ox,y=q.shelter.y+oy;c.globalAlpha=.9;c.lineWidth=1.5;ring(c,x,y,q.shelter.r*.55);c.globalAlpha=.25;ring(c,x,y,q.shelter.r);}
 c.restore();}
// By the cube (screen centre): a white shield while a pulse on time protects it; a thin arc that fills while lasting is enough.
function cubeMarks(r,s,def,reduced){const c=r.cx,x=r.W/2,y=r.H/2;c.save();c.strokeStyle='#ffffff';
 if(s.shield>0){c.globalAlpha=.85*Math.min(1,s.shield*1.5);c.lineWidth=2;ring(c,x,y,15+(reduced?0:(1-s.shield)*4));}
 if(def.survive){c.globalAlpha=.25;c.lineWidth=1.5;ring(c,x,y,20);c.globalAlpha=.9;c.beginPath();c.arc(x,y,20,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,s.age/def.life));c.stroke();}
 c.restore();}
// Doing: the time left (an arc that empties) and the steps (small squares under the cube, white when done).
function doMarks(r,s,def){const c=r.cx,x=r.W/2,y=r.H/2;c.save();c.strokeStyle=c.fillStyle='#ffffff';
 const left=Math.max(0,1-s.age/(def.life+(s.bonus||0)));c.globalAlpha=.2;c.lineWidth=1.5;ring(c,x,y,20);c.globalAlpha=.85;c.beginPath();c.arc(x,y,20,-Math.PI/2,-Math.PI/2+TAU*left);c.stroke();
 const n=s.need,w=n*7-3;for(let i=0;i<n;i++){c.globalAlpha=i<s.done?1:.3;c.fillRect(Math.round(x-w/2+i*7),Math.round(y+27),4,4);}c.restore();}
// The next step: a white ring that breathes.
function nextMark(c,x,y,t,reduced){c.save();c.strokeStyle='#ffffff';c.globalAlpha=.9;c.lineWidth=1.5;ring(c,x,y,15+(reduced?0:Math.sin(t*5)*1.5));c.restore();}
// The scene: the prey and its light; a ring while a pulse on time holds it; the catch opens in its colour; on escape it fades.
export function drawLive(r,s,{color,reduced=false,line='',clock=0}={}){
 if(!s)return;const c=r.cx,ox=r.W/2-r.camX,oy=r.H/2-r.camY,x=s.x+ox,y=s.y+oy,t=reduced?0:s.age,def=liveDefinition(s.kind),flee=s.verb==='huir',doing=s.verb==='hacer',atCube=flee||doing;
 c.save();c.lineWidth=1;c.strokeStyle=c.fillStyle=color;
 if(s.stage==='run'){
  if(doing){c.globalAlpha=.95;SHAPES[s.kind]?.(c,x,y,s.heading||0,t,s,ox,oy);const g=liveGoal(s,{x:r.S.wx,y:r.S.wy});if(g){nextMark(c,g.x+ox,g.y+oy,s.age,reduced);pointer(r,s,g.x+ox,g.y+oy,'#ffffff',reduced);}doMarks(r,s,def);}
  else if(flee){safety(c,s,ox,oy,t,reduced);c.strokeStyle=c.fillStyle=color;c.globalAlpha=.95;SHAPES[s.kind]?.(c,x,y,s.heading||0,t,s,ox,oy);cubeMarks(r,s,def,reduced);const g=liveGoal(s,{x:r.S.wx,y:r.S.wy});if(g)pointer(r,s,g.x+ox,g.y+oy,'#ffffff',reduced);}
  else{
  // Batch 1, brighter (Jay asked whether they read too small): a wider glow, a dark disc and a thin ring in its colour keep
  // the prey clear on any light without making it bigger.
  if(!s.hidden){glow(c,x,y,30,color,.42);c.save();c.globalAlpha=.55;c.fillStyle='#000';c.beginPath();c.arc(x,y,12,0,TAU);c.fill();c.globalAlpha=.5;c.strokeStyle=color;ring(c,x,y,12.5);c.restore();}c.globalAlpha=1;c.strokeStyle=c.fillStyle=color;SHAPES[s.kind]?.(c,x,y,s.heading||0,t,s,ox,oy);
  if(s.hold>0){c.globalAlpha=.6*Math.min(1,s.hold);ring(c,x,y,13);}
  pointer(r,s,x,y,color,reduced);}
 }else{
  const k=Math.min(1,s.over/LIVE_FAREWELL),won=s.stage==='caught'||s.stage==='safe'||s.stage==='done',bx=atCube?r.W/2:x,by=atCube?r.H/2:y;
  if(won){c.globalAlpha=(1-k)*.85;ring(c,bx,by,8+k*(reduced?14:40));for(let i=0;i<8;i++){const q=i*TAU/8,rad=6+k*(reduced?10:30);c.fillRect(bx+Math.cos(q)*rad-1.5,by+Math.sin(q)*rad-1.5,3,3);}}
  if(!won||atCube){c.globalAlpha=(1-k)*.7;SHAPES[s.kind]?.(c,x,y,s.heading||0,t,{...s,hidden:false,trail:[]},ox,oy);}
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
