// Mapa del cielo: points and thin lines over the black of the World (docs/IDEAS_UNIVERSO.md, Ken Wong's list).
// A loose star is a faint white point on a small dark disc, so it reads on any region's light; the next star is white
// with a breathing ring and the white arrow by the cube points to it; a lit star is bright; a line grows from star to
// star in one beat; a complete figure shines a moment and then stays as a faint drawing. Gold only for what is won:
// the star halo round the cube. The cube never grows.
import {skyFigure,skyLines,skyStar,SKY_GLOW,SKY_TOUCH} from './sky-map-model.js';
const TAU=Math.PI*2;
export const SKY_GOLD='#f0d27a';
function glow(c,x,y,r,color,alpha){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=alpha;c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function ring(c,x,y,r){c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();}
// A star: a dark disc for contrast, then the point (2 px faint, 3 px lit) and, when lit, a small cross of light.
function star(c,x,y,{lit=false,alpha=1,twinkle=0}={}){
 c.globalAlpha=.5*alpha;c.fillStyle='#000';c.beginPath();c.arc(x,y,lit?6:5,0,TAU);c.fill();
 if(lit){glow(c,x,y,12,'#ffffff',.35*alpha);c.globalAlpha=alpha;c.fillStyle='#ffffff';c.fillRect(Math.round(x)-1.5,Math.round(y)-1.5,3,3);const k=4+twinkle*2;c.globalAlpha=.7*alpha;c.fillRect(Math.round(x)-k,Math.round(y)-.5,k*2,1);c.fillRect(Math.round(x)-.5,Math.round(y)-k,1,k*2);}
 else{glow(c,x,y,9,'#ffffff',.22*alpha);c.globalAlpha=.75*alpha;c.fillStyle='#ffffff';c.fillRect(Math.round(x)-1,Math.round(y)-1,2,2);c.globalAlpha=.3*alpha;c.fillRect(Math.round(x)-3,Math.round(y)-.5,6,1);c.fillRect(Math.round(x)-.5,Math.round(y)-3,1,6);}
}
// Where a site is drawn: its stars on screen, grown from the centre while it appears (k from 0 to 1).
function points(r,site,k){const ox=r.W/2-r.camX,oy=r.H/2-r.camY,f=skyFigure(site.fig);return f.stars.map((_,i)=>{const s=skyStar(site,i);return {x:site.x+ox+(s.x-site.x)*k,y:site.y+oy+(s.y-site.y)*k};});}
// A dormant figure (not started, left half-done, or finished long ago): faint points; lit ones and their lines a little
// brighter; a finished one as a faint drawing.
export function drawSkySite(r,site,{appear=1,reduced=false,t=0}={}){
 const f=skyFigure(site.fig);if(!f)return;const c=r.cx,k=reduced?1:1-(1-appear)*(1-appear),p=points(r,site,k),lit=site.done?f.stars.length:site.lit||0;
 c.save();c.strokeStyle='#ffffff';c.lineWidth=1;
 for(const [a,b] of skyLines(f)){if(a<lit&&b<lit){c.globalAlpha=(site.done?.28:.4)*appear;c.beginPath();c.moveTo(p[a].x,p[a].y);c.lineTo(p[b].x,p[b].y);c.stroke();}}
 p.forEach((q,i)=>star(c,q.x,q.y,{lit:i<lit&&!site.done,alpha:appear*(site.done?.6:1)}));
 c.restore();
}
// The figure being joined: lit stars, lines growing in one beat, the next star ringed in white with the arrow; when
// complete it shines SKY_GLOW seconds, brightest at first.
export function drawSkyScene(r,scene,{reduced=false,clock=0,beat=.5}={}){
 const site=scene.site,f=skyFigure(site.fig);if(!f)return;const c=r.cx,p=points(r,site,1),lit=site.lit,shine=scene.stage==='done'?Math.max(0,1-scene.over/SKY_GLOW):0;
 c.save();c.strokeStyle='#ffffff';
 for(const [a,b] of skyLines(f)){if(!(a<lit&&b<lit))continue;
  // A new line grows from the star it comes from, in one beat, from when its note is heard.
  const at=scene.litAt?.[Math.max(a,b)],grow=reduced||at===undefined?1:at===null?0:Math.max(0,Math.min(1,(clock-at)/Math.max(.2,beat))),from=p[a],to=p[b];
  if(grow<=0)continue;c.globalAlpha=.75+.25*shine;c.lineWidth=1+shine*.8;c.beginPath();c.moveTo(from.x,from.y);c.lineTo(from.x+(to.x-from.x)*grow,from.y+(to.y-from.y)*grow);c.stroke();
  if(shine>0){c.globalAlpha=.18*shine;c.lineWidth=5;c.stroke();}}
 c.lineWidth=1;
 p.forEach((q,i)=>{const on=i<lit;if(on&&shine>0)glow(c,q.x,q.y,26,'#ffffff',.4*shine);star(c,q.x,q.y,{lit:on,alpha:1,twinkle:on&&!reduced?Math.max(0,Math.sin(clock*4+i*1.7)):0});});
 // The next star: a white ring that breathes (still with reduced motion) and the arrow by the cube.
 if(scene.stage==='run'&&lit<p.length){const q=p[lit];c.globalAlpha=.9;c.lineWidth=1.5;ring(c,q.x,q.y,(reduced?1:Math.min(1,scene.age/.5))*(13+(reduced?0:Math.sin(clock*5)*1.5)));c.lineWidth=1;pointer(r,q.x,q.y,reduced);}
 c.restore();
}
// The arrow to the next star: by the cube while it is on screen, at the edge of the screen beyond.
function pointer(r,x,y,reduced){
 const c=r.cx,cx=r.W/2,cy=r.H/2,dx=x-cx,dy=y-cy,l=Math.hypot(dx,dy);if(l<SKY_TOUCH)return;const a=Math.atan2(dy,dx),off=x<14||y<14||x>r.W-14||y>r.H-14;
 c.save();c.fillStyle='#ffffff';c.globalAlpha=reduced?.7:.55+.3*Math.sin(performance.now()/180);let px=cx+Math.cos(a)*24,py=cy+Math.sin(a)*24,size=4;
 if(off){const k=Math.min((r.W/2-18)/Math.abs(Math.cos(a)||1e-6),(r.H/2-90)/Math.abs(Math.sin(a)||1e-6));px=cx+Math.cos(a)*k;py=cy+Math.sin(a)*k;size=7;}
 c.translate(px,py);c.rotate(a);c.beginPath();c.moveTo(size,0);c.lineTo(-size*.7,-size*.7);c.lineTo(-size*.7,size*.7);c.closePath();c.fill();c.restore();
}
// A figure nearby but off screen: one faint four-pointed star at the edge, toward it. Something to see, never an order.
export function drawSkyHint(r,x,y,alpha=.4){const c=r.cx,cx=r.W/2,cy=r.H/2,a=Math.atan2(y-cy,x-cx),k=Math.min((r.W/2-16)/Math.abs(Math.cos(a)||1e-6),(r.H/2-96)/Math.abs(Math.sin(a)||1e-6)),px=cx+Math.cos(a)*k,py=cy+Math.sin(a)*k;
 c.save();c.globalAlpha=alpha;c.fillStyle='#ffffff';c.beginPath();for(let i=0;i<8;i++){const q=i*TAU/8-Math.PI/2,rad=i%2?1.4:4.5;i?c.lineTo(px+Math.cos(q)*rad,py+Math.sin(q)*rad):c.moveTo(px+Math.cos(q)*rad,py+Math.sin(q)*rad);}c.closePath();c.fill();c.restore();}
// Words under the cube, where the living encounters write theirs (the two never run at once): the notice with the
// figure's name, then the summary. «Textos en el universo» hides them (universe-texts.js).
export function drawSkyWords(r,{title='',hint='',summary=''}={}){if(!title&&!summary)return;const c=r.cx,ty=Math.min(r.H-135,r.H/2+130),width=r.W-32;c.save();c.textAlign='center';
 if(title){c.globalAlpha=1;c.fillStyle='#ffffff';c.font='12px "Geist Mono",monospace';c.fillText(title,r.W/2,ty,width);if(hint){c.globalAlpha=.78;c.fillStyle='#ddd';c.font='11px "Geist Mono",monospace';c.fillText(hint,r.W/2,ty+18,width);}}
 else{c.globalAlpha=.92;c.fillStyle='#ffffff';c.font='12px "Geist Mono",monospace';c.fillText(summary,r.W/2,ty,width);}
 c.restore();}
// The zodiac's prize: twelve small gold stars round the cube, turning slowly (still with reduced motion). Earned, so gold.
export function drawSkyHalo(c,x,y,size,t=0,{reduced=false,alpha=1}={}){const rad=Math.min(24,Math.max(14,size*2.1)),turn=reduced?0:t/9000;c.save();c.fillStyle=SKY_GOLD;
 for(let i=0;i<12;i++){const a=turn+i*TAU/12,px=x+Math.cos(a)*rad,py=y+Math.sin(a)*rad,tw=reduced?.8:.6+.4*Math.max(0,Math.sin(t/500+i*1.3));c.globalAlpha=alpha*tw;c.fillRect(Math.round(px)-1,Math.round(py)-1,2,2);if(i%3===0){c.globalAlpha=alpha*tw*.6;c.fillRect(Math.round(px)-3,Math.round(py),6,1);c.fillRect(Math.round(px),Math.round(py)-3,1,6);}}
 c.restore();}
// The Bitácora: one figure as a small drawing. done: white; half: the lit part white, the rest a silhouette; none: a
// silhouette (faint dashes and points).
export function skyFigureSvg(f,lit=0,done=false){const P=([x,y])=>[(x*40).toFixed(1),(y*40).toFixed(1)],n=done?f.stars.length:lit;
 const lines=skyLines(f).map(([a,b])=>{const on=a<n&&b<n,[x1,y1]=P(f.stars[a]),[x2,y2]=P(f.stars[b]);return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${on?' class="on"':''}/>`;}).join('');
 const dots=f.stars.map((s,i)=>{const [x,y]=P(s);return `<rect x="${(x-1.5).toFixed(1)}" y="${(y-1.5).toFixed(1)}" width="3" height="3"${i<n?' class="on"':''}/>`;}).join('');
 return `<svg viewBox="-50 -50 100 100" aria-hidden="true">${lines}${dots}</svg>`;}
