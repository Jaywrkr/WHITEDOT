import {bake,halo,easeOutCubic} from './fx-kit.js';
// The scanner's light (coherencia T1; docs/MUNDO.md#el-escáner). Drawing only: a ring of white light leaves the cube,
// and what it touches lights up a moment with a small icon (and, from level 2, «Sonda · 120 m»). New things in white,
// found ones dim. No gradient per frame: the icons are baked once (fx-kit bake) and the ring is a stroke.
// Reduced motion: the ring does not travel (it shows at its reach and fades) and nothing pings. Light quality: no halo,
// no trailing ring and no ping.
const TAU=Math.PI*2;
export const SCAN_ICON=14;          // the icon's side on screen, px (the cube stays the biggest white thing)
export const SCAN_LABELS=5;         // names drawn on the canvas at most; the panel says the rest
export const SCAN_ICONS=24;         // icons drawn at most
export const SCAN_FLASH=.6;         // s: how long a touched thing shines before it settles
const FONT='12px "Geist Mono", monospace',CHAR=7.3;   // px per letter at 12 px
// The small white icons, one baked canvas each (14×14 units at 2×).
function paintIcon(shape){return (c,w,h)=>{const m=w/2;c.strokeStyle='#fff';c.fillStyle='#fff';c.lineWidth=1.25;c.lineJoin='miter';c.beginPath();
 switch(shape){
  case 'caja':c.strokeRect(3,3,w-6,h-6);c.fillRect(m-1,m-1,2,2);return;
  case 'hallazgo':c.moveTo(m,2);c.lineTo(w-2,m);c.lineTo(m,h-2);c.lineTo(2,m);c.closePath();c.stroke();return;
  case 'portal':c.arc(m,m,m-2,0,TAU);c.stroke();c.beginPath();c.arc(m,m,m-5,0,TAU);c.stroke();return;
  case 'sonda':c.moveTo(m,1.5);c.lineTo(m,h-1.5);c.moveTo(1.5,m);c.lineTo(w-1.5,m);c.stroke();c.strokeRect(m-2.5,m-2.5,5,5);return;
  case 'forma':c.moveTo(m,2.5);c.lineTo(w-2.5,h-3);c.lineTo(2.5,h-3);c.closePath();c.stroke();return;
  case 'voz':c.arc(m,m,m-2.5,0,TAU);c.stroke();c.fillRect(m-1.25,m-1.25,2.5,2.5);return;
  // T2: a buoy (a post and its light) and «?» (what is only heard, or secret).
  case 'boya':c.moveTo(m,h-1.5);c.lineTo(m,m);c.stroke();c.beginPath();c.arc(m,m-2.5,2.5,0,TAU);c.fill();return;
  case 'pregunta':c.lineWidth=1.6;c.arc(m,5,3,Math.PI,Math.PI*2.4);c.lineTo(m,9.4);c.stroke();c.fillRect(m-1,10.8,2,2);return;
  default:c.moveTo(m,1.5);c.lineTo(m+1.6,m-1.6);c.lineTo(w-1.5,m);c.lineTo(m+1.6,m+1.6);c.lineTo(m,h-1.5);c.lineTo(m-1.6,m+1.6);c.lineTo(1.5,m);c.lineTo(m-1.6,m-1.6);c.closePath();c.fill();
 }};}
export const scanIcon=shape=>bake('scan:'+shape,SCAN_ICON,SCAN_ICON,paintIcon(shape));
// ---------- the arrows at the edge (coherencia T2) ----------
// One small white arrowhead pointing out of the screen, the thing's icon just inside it and, when there is one, a short word
// («4 km»). Baked once (with a soft halo, and a plain one for the light quality); rotated, never rebuilt per frame.
export const EDGE_ICON=12,EDGE_INSET=15;
const paintArrow=soft=>(c,w,h)=>{const m=h/2;c.strokeStyle=c.fillStyle='#fff';c.lineJoin='round';const path=()=>{c.beginPath();c.moveTo(w-2.5,m);c.lineTo(w-9,m-4.5);c.lineTo(w-7.5,m);c.lineTo(w-9,m+4.5);c.closePath();};
 if(soft){c.globalAlpha=.2;c.lineWidth=3.5;path();c.stroke();c.globalAlpha=1;}path();c.fill();};
export const edgeArrowSprite=(light=false)=>bake(light?'scan:arrow':'scan:arrow:soft',16,16,paintArrow(!light));
// arrows: [{key, at:{x,y,a}, shape, label}]; fade: Map key → 0..1 (how far each has come in). Returns the calls made.
export function drawEdgeArrows(c,arrows,{light=false,words=true,fade=null,write=(q,t,x,y)=>q.fillText(t,x,y)}={}){
 const out={arrows:0,icons:0,labels:0};if(!arrows?.length)return out;const sprite=edgeArrowSprite(light);c.save();c.font=FONT;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';
 for(const e of arrows){const at=e.at;if(!at)continue;const k=fade?.get(e.key)??1;if(!(k>0))continue;const cos=Math.cos(at.a),sin=Math.sin(at.a);
  c.globalAlpha=.88*k;
  c.save();c.translate(at.x,at.y);c.rotate(at.a);
  if(sprite)c.drawImage(sprite,-12.5,-8,16,16);else{c.fillStyle='#fff';c.beginPath();c.moveTo(1,0);c.lineTo(-5.5,-4.5);c.lineTo(-4,0);c.lineTo(-5.5,4.5);c.closePath();c.fill();}
  c.restore();out.arrows++;
  if(e.shape){c.globalAlpha=.8*k;icon(c,e.shape,at.x-cos*EDGE_INSET,at.y-sin*EDGE_INSET,EDGE_ICON);out.icons++;}
  // The word further in, past the icon, its half width along the arrow's line so it never runs off the screen.
  if(words&&e.label){const half=e.label.length*CHAR/2,d=EDGE_INSET+(e.shape?EDGE_ICON/2+4:0);c.globalAlpha=.75*k;write(c,e.label,at.x-cos*(d+half*Math.abs(cos)),at.y-sin*(d+7*Math.abs(sin)));out.labels++;}
 }
 c.restore();return out;}
// The same icon without a canvas (Node): a square outline.
function icon(c,shape,x,y,size){const s=scanIcon(shape);if(s){c.drawImage(s,x-size/2,y-size/2,size,size);return;}c.strokeStyle='#fff';c.lineWidth=1;c.strokeRect(x-size/2,y-size/2,size,size);}
// How far the ring has gone (0..1) at age a of a wave of `dur` seconds; still: it is already there.
export const waveProgress=(age,dur,still=false)=>still?1:easeOutCubic(Math.max(0,Math.min(1,age/Math.max(.05,dur))));
// One frame. state: {age, dur, reach (px), still, light, fade (0..1, 1 while held), names, items:[{key,x,y,shape,name,
// dist,done}] in screen px, lit: Map key → age when touched, write?(c, text, x, y)}. Returns what was drawn (for tests).
export function drawScanWave(c,cx,cy,W,H,state){
 const {age,dur,reach,still,light,fade=1,names,items,lit,write=(q,t,x,y)=>q.fillText(t,x,y)}=state,k=waveProgress(age,dur,still),
  // The ring crosses what the screen shows in its time, however far the level reaches (the panel says the rest).
  radius=Math.min(reach,Math.hypot(W,H)/2+24)*k,out={ring:false,icons:0,labels:0,radius};
 if(!(fade>0))return out;
 c.save();
 // The ring: thin white, fading as it goes; a halo (added) and a trailing ring unless the light quality asks for less.
 const ringA=(still?.35*Math.max(0,1-age/.6):.9*(1-k)**.5)*fade;
 if(ringA>.01&&radius>2){out.ring=true;c.globalAlpha=ringA;c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(cx,cy,radius,0,TAU);
  if(!light&&!still)halo(c,null,{width:5,alpha:.3});c.stroke();
  if(!light&&!still&&radius>24){c.globalAlpha=ringA*.35;c.lineWidth=1;c.beginPath();c.arc(cx,cy,radius*.86,0,TAU);c.stroke();}}
 // What it touched: the icon; a short ping when touched; the name under it from level 2.
 const size=SCAN_ICON,taken=[];let labels=0,icons=0;c.font=FONT;c.textAlign='center';c.textBaseline='top';
 for(const it of items){
  if(icons>=SCAN_ICONS)break;const d=Math.hypot(it.x-cx,it.y-cy);
  if(!still&&d>radius+1&&!lit.has(it.key))continue;
  if(!lit.has(it.key))lit.set(it.key,age);
  const since=age-lit.get(it.key),flash=still?0:Math.max(0,1-since/SCAN_FLASH),base=it.done?.35:.9,a=Math.min(1,(base+flash*.4))*fade;
  if(it.x<-size||it.y<-size||it.x>W+size||it.y>H+size)continue;
  c.globalAlpha=a;icon(c,it.shape,it.x,it.y,size);icons++;
  if(flash>0&&!light){const g=size*(1+(1-flash)*1.4);c.globalAlpha=flash*.6*fade;c.strokeStyle='#fff';c.lineWidth=1;c.strokeRect(it.x-g/2,it.y-g/2,g,g);}
  if(names&&it.name&&labels<SCAN_LABELS){const text=`${it.name} · ${it.dist}`,w=text.length*CHAR+6,box={x:it.x-w/2,y:it.y+size/2+3,w,h:16};
   // A name never covers another: the first in the scanner's order keeps its place (Geist Mono: every letter as wide).
   if(!taken.some(b=>b.x<box.x+box.w&&box.x<b.x+b.w&&b.y<box.y+box.h&&box.y<b.y+b.h)){taken.push(box);c.globalAlpha=(it.done?.5:.92)*fade;c.fillStyle='#fff';write(c,text,it.x,it.y+size/2+4);labels++;}}
 }
 out.icons=icons;out.labels=labels;c.restore();return out;}
