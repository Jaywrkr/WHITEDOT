import {bake,halo,easeOutCubic} from './fx-kit.js';
import {scanIconSprite,drawScanIcon} from './scan-icons.js';
// The scanner's light (coherencia T1; docs/MUNDO.md#el-escáner). Drawing only: a ring of white light leaves the cube,
// and what it touches becomes a mark (Escáner NMS, alpha.263): its icon and, from level 2, «Sonda · 120 m», on a ring
// round the cube or on the screen's edge. New things in white, found ones dim. No gradient per frame: the icons are
// baked once (scan-icons.js, fx-kit bake) and the ring is a stroke.
// Reduced motion: the ring does not travel (it shows at its reach and fades) and nothing pings. Light quality: no halo,
// no trailing ring and no ping.
const TAU=Math.PI*2;
export const SCAN_ICON=14;          // = ICON_SIZE (scan-icons.js): the icon's side on screen, px (the cube stays the biggest white thing)
export const SCAN_FLASH=.6;         // s: how long a touched thing shines before it settles
const FONT='12px "Geist Mono", monospace',CHAR=7.3;   // px per letter at 12 px
// The icons are the one table (scan-icons.js, Escáner NMS): the same pictogram for a kind everywhere.
export const scanIcon=shape=>scanIconSprite(shape);
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
const icon=(c,shape,x,y,size)=>drawScanIcon(c,shape,x,y,size);
// How far the ring has gone (0..1) at age a of a wave of `dur` seconds; still: it is already there.
// The ring crosses what the screen shows in its time, however far the level reaches.
export const waveRadius=(reach,W,H)=>Math.min(reach,Math.hypot(W,H)/2+24);
export const waveProgress=(age,dur,still=false)=>still?1:easeOutCubic(Math.max(0,Math.min(1,age/Math.max(.05,dur))));
// One frame of the ring. state: {age, dur, reach (px), still, light, fade (0..1, 1 while held)}. Escáner NMS: what it
// touches is no longer drawn on the thing; it becomes a mark (drawScanMarks). Returns what was drawn (for tests).
export function drawScanWave(c,cx,cy,W,H,state){
 const {age,dur,reach,still,light,fade=1}=state,k=waveProgress(age,dur,still),
  // The ring crosses what the screen shows in its time, however far the level reaches (the panel says the rest).
  radius=waveRadius(reach,W,H)*k,out={ring:false,icons:0,labels:0,radius};
 if(!(fade>0))return out;
 c.save();
 // The ring: thin white, fading as it goes; a halo (added) and a trailing ring unless the light quality asks for less.
 const ringA=(still?.35*Math.max(0,1-age/.6):.9*(1-k)**.5)*fade;
 if(ringA>.01&&radius>2){out.ring=true;c.globalAlpha=ringA;c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(cx,cy,radius,0,TAU);
  if(!light&&!still)halo(c,null,{width:5,alpha:.3});c.stroke();
  if(!light&&!still&&radius>24){c.globalAlpha=ringA*.35;c.lineWidth=1;c.beginPath();c.arc(cx,cy,radius*.86,0,TAU);c.stroke();}}
 c.restore();return out;}
// ---------- the marks (Escáner NMS, alpha.263) ----------
// marks: [{key, x, y, shape, label, done, flash (0..1, just touched)}] in screen px, placed by scanMarks
// (scanner-model.js). Each is its icon and, under it, its words: white for what is new, dim for what you found. A mark
// just touched rings once with a small square (not with reduced motion, not with the light quality). alpha: the fade.
export function drawScanMarks(c,marks,{alpha=1,light=false,still=false,W=1e9,write=(q,t,x,y)=>q.fillText(t,x,y)}={}){
 const out={icons:0,labels:0};if(!marks?.length||!(alpha>0))return out;c.save();c.font=FONT;c.textAlign='center';c.textBaseline='top';c.fillStyle='#fff';c.strokeStyle='#fff';
 for(const m of marks){const base=m.done?.5:.95;c.globalAlpha=base*alpha;icon(c,m.shape,m.x,m.y,SCAN_ICON);out.icons++;
  const f=still||light?0:Math.max(0,Math.min(1,m.flash||0));if(f>0){const g=SCAN_ICON*(1+(1-f)*1.4);c.globalAlpha=f*.6*alpha;c.lineWidth=1;c.strokeRect(m.x-g/2,m.y-g/2,g,g);}
  if(m.label){const lx=m.box?.lx??Math.max(6,Math.min(W-6,m.x));c.globalAlpha=(m.done?.55:.92)*alpha;write(c,m.label,lx,m.y+SCAN_ICON/2+4);out.labels++;}}
 c.restore();return out;}
