import {vividColor,WORLD_VISUAL} from './visual.js';
import {LIVE_COLORS} from './live-encounters-model.js';
// The World's shared light (visual 1, alpha.250; docs/MUNDO.md, «Luz común»). Drawing only: nothing here reads the old
// random sequence, moves an object, touches a collision, the save or the sound.
// - glow: a soft light from a sprite drawn once per colour (no gradient built every frame); `add` paints it with
//   'lighter', so black stays black and lights only add up.
// - halo: the same thin line once more, three times as wide and faint, added: a fine double contour.
// - appear: the first frames an object is seen it grows in from 0.85 with a little overshoot.
// - the layer (createFxLayer): one pop when you touch or win something (a ring, a few sparks, a flash), and a fixed pool
//   of sparks. Gold is only for what is earned.
// - breath, contactShadow, biomeTone: the beat's breath, a fake shadow under things that stand, and the biome's tone.
// With reduced motion nothing new moves (no pop, no growing in); with light quality, fewer sparks and no added halos.
export const FX_GOLD=WORLD_VISUAL.gold;
export const FX_POOL=Object.freeze({full:256,light:96});
export const FX_POPS=24;
export const FX_SPRITES=40;
const TAU=Math.PI*2;
// Easing, 0..1 in and out.
export const easeOutCubic=k=>1-(1-k)**3;
export const easeOutBack=k=>{const c=1.70158;return 1+(c+1)*(k-1)**3+c*(k-1)**2;};
export const easeInOut=k=>k<.5?2*k*k:1-(-2*k+2)**2/2;
const clamp01=v=>v<0?0:v>1?1:v;
// Offscreen canvases. Without a document (Node) there is none and every primitive falls back to the plain drawing it
// replaced, so the old contracts still hold there.
let factory=(w,h)=>{try{if(typeof document!=='undefined'&&document.createElement){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}if(typeof OffscreenCanvas==='function')return new OffscreenCanvas(w,h);}catch(_){}return null;};
const sprites=new Map();
export function setFxCanvas(fn){factory=typeof fn==='function'?fn:()=>null;sprites.clear();}
export const fxSpriteCount=()=>sprites.size;
// A small LRU: a sprite used again moves to the end; the oldest leaves past FX_SPRITES.
function sprite(key,size,paint){let s=sprites.get(key);if(s!==undefined){sprites.delete(key);sprites.set(key,s);return s;}
 const cv=factory(size,size),c=cv?.getContext?.('2d');s=null;if(c){try{paint(c,size);s=cv;}catch(_){s=null;}}
 sprites.set(key,s);while(sprites.size>FX_SPRITES)sprites.delete(sprites.keys().next().value);return s;}
const GLOW=96;   // the glow sprite's side; scaled to any radius (a smooth fall-off reads the same)
// The canvas of the World passes hsl colours through the living palette; the sprites take the same colour.
const ink=color=>vividColor(String(color||'#ffffff'));
const CLEAR='rgba(0,0,0,0)';
export function glowSprite(color,end=CLEAR){const col=ink(color),to=ink(end);return sprite('g:'+col+'>'+to,GLOW,(c,s)=>{const g=c.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,col);g.addColorStop(1,to);c.fillStyle=g;c.fillRect(0,0,s,s);});}
// A soft light of radius r at x,y, the gradient the World used to build every frame (color to `end`). `add` adds it
// ('lighter'); otherwise it is painted over, as the gradients were.
export function glow(c,x,y,r,color,alpha=1,add=false,end=CLEAR){
 if(!(r>0)||!(alpha>0))return;const s=glowSprite(color,end);c.globalAlpha=Math.min(1,alpha);
 if(!s){const g=c.createRadialGradient?.(x,y,0,x,y,r);if(!g?.addColorStop)return;g.addColorStop(0,color);g.addColorStop(1,end);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);return;}
 if(add){const op=c.globalCompositeOperation;c.globalCompositeOperation='lighter';c.drawImage(s,x-r,y-r,r*2,r*2);c.globalCompositeOperation=op;}else c.drawImage(s,x-r,y-r,r*2,r*2);
}
// Any radial gradient whose stops only change together by one alpha, cached by key (stops: [[offset,colour],…] at full
// strength). Drawn over its square of radius r at the current globalAlpha times alpha, which is left as it was;
// without a canvas, the gradient itself with alpha in its stops, as the World built it before.
export function gradientSprite(key,stops){return sprite('r:'+key,GLOW,(c,s)=>{const g=c.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);for(const [o,col]of stops)g.addColorStop(o,ink(col));c.fillStyle=g;c.fillRect(0,0,s,s);});}
const ALPHA_AT=/^(rgba|hsla)\((.*),\s*([\d.]+)\s*\)$/;
export const scaleAlpha=(col,k)=>{const m=ALPHA_AT.exec(col);return m?`${m[1]}(${m[2]},${+m[3]*k})`:col;};
export function radial(c,x,y,r,key,stops,alpha=1){if(!(r>0)||!(alpha>0))return;const s=gradientSprite(key,stops);
 if(s){const ga=c.globalAlpha;c.globalAlpha=Math.min(1,ga*alpha);c.drawImage(s,x-r,y-r,r*2,r*2);c.globalAlpha=ga;return;}
 const g=c.createRadialGradient?.(x,y,0,x,y,r);if(!g?.addColorStop)return;for(const [o,col]of stops)g.addColorStop(o,scaleAlpha(col,alpha));c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
// A black puff (fog noise, darkness) of radius r: the sprite is opaque black at its centre, alpha sets how dark.
export function shadePuff(c,x,y,r,alpha){if(!(r>0)||!(alpha>0))return;const s=sprite('shade',GLOW,(q,n)=>{const g=q.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g;q.fillRect(0,0,n,n);});
 c.globalAlpha=Math.min(1,alpha);if(s){c.drawImage(s,x-r,y-r,r*2,r*2);return;}const g=c.createRadialGradient?.(x,y,0,x,y,r);if(!g?.addColorStop)return;g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
// A fake contact shadow: a soft dark ellipse under something that stands (w and h are its half sizes).
export function contactShadow(c,x,y,w,h,alpha=.35){if(!(w>0)||!(h>0)||!(alpha>0))return;const s=sprite('contact',64,(q,n)=>{const g=q.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.6,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g;q.fillRect(0,0,n,n);});
 c.globalAlpha=Math.min(1,alpha);if(s){c.drawImage(s,x-w,y-h,w*2,h*2);return;}c.fillStyle='#000';c.beginPath();c.ellipse(x,y,w,h,0,0,TAU);c.fill();}
// The fine double contour: before the thin line, the same path three times as wide, faint and added.
export function halo(c,path=null,{width=3,alpha=.15}={}){const a=c.globalAlpha,op=c.globalCompositeOperation,w=c.lineWidth;
 c.globalCompositeOperation='lighter';c.globalAlpha=a*alpha;c.lineWidth=w*width;if(path)c.stroke(path);else c.stroke();c.lineWidth=w;c.globalAlpha=a;c.globalCompositeOperation=op;}
// The beat's breath (b from runtime.beat(), 0..1): a scale for shapes that are not the cube and a glow strength.
export function breath(b,still=false){const k=still?0:clamp01(b||0);return {scale:1+.035*k,glow:.45+.3*k};}
// The biome's tone for a halo, the same colours the living encounters use; white in the Void and the new regions.
export function biomeTone(runtime,x,y){const id=runtime?.BIOMES?.[runtime.biomeOfPos?.(x,y)]?.id;return LIVE_COLORS[id]||'#ffffff';}
// Growing in: k (0..1) since an object was first seen this time; seen again after half a second away starts over.
export function createAppear(ms=280){const seen=new Map();
 return {k(key,now,still=false){if(still)return 1;let e=seen.get(key);if(!e||now-e.last>500){e={at:now,last:now};seen.set(key,e);if(seen.size>256)seen.delete(seen.keys().next().value);}e.last=now;return clamp01((now-e.at)/ms);},size:()=>seen.size,clear:()=>seen.clear()};}
export const appearAlpha=k=>easeOutCubic(clamp01(k));
export const appearScale=k=>k>=1?1:.85+.15*easeOutBack(clamp01(k));
// The small spark sprite: a bright core and a soft fall-off, one per colour.
export function sparkSprite(color){const col=ink(color);return sprite('s:'+col,12,(c,s)=>{const g=c.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,col);g.addColorStop(.3,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,s,s);});}
// The shared layer: pops and sparks in world coordinates, drawn after the World's grey sheet so they keep their colour
// in the Journey too. A fixed pool: typed arrays for the sparks, a ring of pop slots; nothing is allocated per frame.
export function createFxLayer({capacity=FX_POOL.full,light=()=>false,reduced=()=>false}={}){
 const n=capacity,X=new Float32Array(n),Y=new Float32Array(n),VX=new Float32Array(n),VY=new Float32Array(n),L=new Float32Array(n),M=new Float32Array(n),C=new Uint8Array(n);
 const colors=[],colorIndex=new Map(),pops=Array.from({length:FX_POPS},()=>({on:false,x:0,y:0,age:0,life:.55,r:24,color:'#fff',flash:0}));
 let live=0,next=0,popNext=0,spawned=0;
 const slot=color=>{let i=colorIndex.get(color);if(i===undefined){if(colors.length>=255){colorIndex.clear();colors.length=0;}i=colors.length;colors.push(color);colorIndex.set(color,i);}return i;};
 const limit=()=>light()?Math.min(n,FX_POOL.light):n;
 // One spark: position, speed (px/s), life (s) and colour. Past the pool's size the oldest is reused.
 function spark(x,y,vx,vy,life=.6,color='#ffffff'){if(live>=limit()){let o=0;for(let i=1;i<live;i++)if(L[i]<L[o])o=i;put(o,x,y,vx,vy,life,color);return;}put(live++,x,y,vx,vy,life,color);}
 function put(i,x,y,vx,vy,life,color){X[i]=x;Y[i]=y;VX[i]=vx;VY[i]=vy;L[i]=M[i]=Math.max(.05,life);C[i]=slot(color);spawned++;}
 // A pop: a ring opening fast and slowing (easeOutCubic), sparks and one short flash. Gold only for what is earned.
 function pop(x,y,color='#ffffff',{gold=false,size=1,sparks=8}={}){if(reduced()||!Number.isFinite(x)||!Number.isFinite(y))return false;const col=gold?FX_GOLD:color,p=pops[popNext];popNext=(popNext+1)%FX_POPS;
  Object.assign(p,{on:true,x,y,age:0,life:.55,r:24*size,color:col,flash:1});const k=Math.max(0,Math.round(light()?sparks/2:sparks));
  for(let i=0;i<k;i++){const a=i*TAU/k+(x*.013+y*.007)%TAU,v=(70+(i%3)*28)*size;spark(x,y,Math.cos(a)*v,Math.sin(a)*v,.45+(i%2)*.15,col);}return true;}
 // Going away: a small ring that closes and four sparks.
 function vanish(x,y,color='#ffffff'){if(reduced()||!Number.isFinite(x))return false;const p=pops[popNext];popNext=(popNext+1)%FX_POPS;Object.assign(p,{on:true,x,y,age:0,life:.4,r:-14,color,flash:0});
  for(let i=0;i<4;i++){const a=i*TAU/4+.4;spark(x,y,Math.cos(a)*40,Math.sin(a)*40,.4,color);}return true;}
 function update(dt){dt=Math.max(0,Math.min(.05,dt||0));const drag=Math.pow(.06,dt);let w=0;
  for(let i=0;i<live;i++){const l=L[i]-dt;if(l<=0)continue;if(w!==i){X[w]=X[i];Y[w]=Y[i];VX[w]=VX[i];VY[w]=VY[i];M[w]=M[i];C[w]=C[i];}L[w]=l;X[w]+=VX[w]*dt;Y[w]+=VY[w]*dt;VX[w]*=drag;VY[w]*=drag;w++;}
  live=w;for(const p of pops)if(p.on){p.age+=dt;p.flash=Math.max(0,1-p.age/.12);if(p.age>=p.life)p.on=false;}}
 // ox, oy: where the world's origin is on screen.
 function draw(c,ox,oy){if(!live&&!pops.some(p=>p.on))return 0;c.save();const add=!light();let drawn=0;
  for(const p of pops){if(!p.on)continue;const k=clamp01(p.age/p.life),e=easeOutCubic(k),x=p.x+ox,y=p.y+oy;
   if(p.flash>0&&add)glow(c,x,y,p.r*1.6,p.color,.5*p.flash,true);
   const r=p.r>0?4+e*p.r:-p.r*(1-e)+1;c.globalAlpha=.85*(1-k);c.strokeStyle=p.color;c.lineWidth=1.5;c.beginPath();c.arc(x,y,Math.max(.5,r),0,TAU);c.stroke();
   if(p.r>0&&add){c.globalAlpha=.35*(1-k);c.lineWidth=1;c.beginPath();c.arc(x,y,Math.max(.5,r*.72),0,TAU);c.stroke();}drawn++;}
  if(add)c.globalCompositeOperation='lighter';
  for(let i=0;i<live;i++){const a=L[i]/M[i],col=colors[C[i]],x=X[i]+ox,y=Y[i]+oy;c.globalAlpha=a;const s=add?sparkSprite(col):null;
   if(s)c.drawImage(s,x-3,y-3,6,6);else{c.fillStyle=col;c.fillRect(x-1,y-1,2,2);}drawn++;}
  c.restore();return drawn;}
 function clear(){live=0;for(const p of pops)p.on=false;}
 return {spark,pop,vanish,update,draw,clear,count:()=>live,pops:()=>pops.filter(p=>p.on).length,spawned:()=>spawned,capacity:n};
}
