// Mapa del universo: the drawing (docs/MUNDO.md#mapa-del-universo). Black, thin lines, colour only where you have been
// (the biome's), white for you, what is next and your mark, gold only for what is won (★, a distance ring fully
// discovered). Icons keep their size at every zoom; when two crowd the same spot the more important one is drawn.
import {toScreen,UNITS_PER_KM,UMAP_PRIORITY} from './universe-map-model.js';
import {formatDistance} from './player-profile-model.js';
export const UMAP_GOLD='#f0d27a',UMAP_FONT='12px "Geist Mono", monospace';
const TAU=Math.PI*2;
// The fog, cached: each region you visited is a soft disc of its biome's colour in a small canvas (k px per region),
// overlapping its neighbours, so a walked area reads as one patch with soft edges (no hard squares). Drawn smoothed.
// colorOf(cell) gives an rgba() or null. Rebuilt only when the regions you visited change.
export function buildFog(cells,colorOf,{max=1536,doc=globalThis.document}={}){
 if(!cells.length||!doc)return null;let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;for(const c of cells){x0=Math.min(x0,c.rx);y0=Math.min(y0,c.ry);x1=Math.max(x1,c.rx);y1=Math.max(y1,c.ry);}
 x0-=2;y0-=2;x1+=2;y1+=2;const w=x1-x0+1,h=y1-y0+1,k=Math.max(1,Math.min(8,Math.floor(max/Math.max(w,h)))),cw=Math.min(max,w*k),ch=Math.min(max,h*k);
 const canvas=doc.createElement('canvas');canvas.width=cw;canvas.height=ch;const c=canvas.getContext('2d');if(!c)return null;
 // One disc per colour, drawn once and stamped on every region of that colour.
 const sprites=new Map(),R=k*1.5,sprite=col=>{if(sprites.has(col))return sprites.get(col);const n=Math.ceil(R*2)+2,sp=doc.createElement('canvas');sp.width=n;sp.height=n;const x=sp.getContext('2d'),g=x.createRadialGradient(n/2,n/2,0,n/2,n/2,R);
  g.addColorStop(0,col);g.addColorStop(.4,col);g.addColorStop(1,col.replace(/[\d.]+\)$/,'0)'));x.fillStyle=g;x.fillRect(0,0,n,n);sprites.set(col,sp);return sp;};
 for(const cell of cells){const col=colorOf(cell);if(!col)continue;const px=(cell.rx-x0+.5)*k,py=(cell.ry-y0+.5)*k;if(px<0||py<0||px>=cw||py>=ch)continue;if(k<3){c.fillStyle=col;c.fillRect(px-k/2,py-k/2,k,k);continue;}const sp=sprite(col);c.drawImage(sp,px-sp.width/2,py-sp.height/2);}
 return {canvas,rx0:x0,ry0:y0,k};
}
export function drawFog(c,W,H,view,fog,RP){if(!fog)return;const [sx,sy]=toScreen(view,W,H,fog.rx0*RP,fog.ry0*RP),s=RP*view.scale/fog.k;
 c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(fog.canvas,sx,sy,fog.canvas.width*s,fog.canvas.height*s);c.restore();}
const star=(c,x,y,r,points=5)=>{c.beginPath();for(let i=0;i<points*2;i++){const q=i%2?r*.45:r,a=i/(points*2)*TAU-Math.PI/2;i?c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q):c.moveTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.closePath();};
// A word on black: a dark box under it so it reads over any colour.
export function label(c,t,x,y,{color='#ffffff',align='center',W=1e9,H=1e9}={}){if(!t)return;c.save();c.font=UMAP_FONT;c.textBaseline='middle';const w=c.measureText(t).width;let lx=align==='center'?x-w/2:align==='right'?x-w:x;lx=Math.max(6,Math.min(W-w-6,lx));const ly=Math.max(14,Math.min(H-14,y));
 c.globalAlpha=.78;c.fillStyle='#000';c.fillRect(lx-4,ly-9,w+8,18);c.globalAlpha=1;c.fillStyle=color;c.textAlign='left';c.fillText(t,lx,ly+.5);c.restore();}
// The distance rings around the origin: dashed white; gold and solid once fully discovered (won).
function bands(c,W,H,view,list,words=true,drawn=[]){const [ox,oy]=toScreen(view,W,H,0,0);for(const b of list){const r=b.km*UNITS_PER_KM*view.scale;if(r<14||r>Math.hypot(W,H)*4)continue;drawn.push({kind:'band',id:String(b.km),complete:!!b.complete,x:Math.round(ox),y:Math.round(oy),r:Math.round(r)});c.save();c.strokeStyle=b.complete?UMAP_GOLD:'#ffffff';c.globalAlpha=b.complete?.8:.32;c.lineWidth=1;if(!b.complete)c.setLineDash([3,6]);c.beginPath();c.arc(ox,oy,r,0,TAU);c.stroke();c.restore();
  // Its name where the ring crosses the screen's top half, nearest the middle.
  let lx=ox,ly=oy-r;if(ly<100||ly>H-40){const dy=Math.max(100,Math.min(H*.45,oy))-oy,dx=Math.sqrt(Math.max(0,r*r-dy*dy));lx=Math.abs(ox+dx-W/2)<Math.abs(ox-dx-W/2)?ox+dx:ox-dx;ly=oy+dy;}
  if(words&&lx>-20&&lx<W+20&&ly>-20&&ly<H+20)label(c,b.km+' km',lx,ly,{color:b.complete?UMAP_GOLD:'#ffffffb0',W,H});}}
// One icon per kind, at a fixed size.
function icon(c,it,x,y,view,{names=false,W,H}){c.save();c.lineWidth=1.5;
 switch(it.kind){
  case 'place':{const r=7;c.fillStyle='#000';c.strokeStyle=it.ink||'#ffffff';c.globalAlpha=it.open?1:.55;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();if(it.complete){c.fillStyle=it.ink;c.globalAlpha=.85;c.beginPath();c.arc(x,y,3,0,TAU);c.fill();}
   c.globalAlpha=1;for(let i=0;i<3;i++){c.fillStyle=i<it.stars?UMAP_GOLD:'#ffffff38';star(c,x+(i-1)*8,y+r+7,3.4);c.fill();}
   if(names)label(c,it.name,x,y+r+20,{color:it.open?'#ffffff':'#8a8a8f',W,H});break;}
  case 'ringHome':{c.strokeStyle='#ffffff';c.globalAlpha=.7;c.setLineDash([2,3]);c.beginPath();c.arc(x,y,5,0,TAU);c.stroke();break;}
  case 'refugio':{const z=7;c.strokeStyle='#ffffff';c.fillStyle='#000';c.beginPath();c.moveTo(x-z,y);c.lineTo(x,y-z);c.lineTo(x+z,y);c.lineTo(x+z,y+z);c.lineTo(x-z,y+z);c.closePath();c.fill();c.stroke();break;}
  case 'favorite':{c.strokeStyle='#ffffff';c.globalAlpha=.8;c.fillStyle='#000';c.beginPath();c.moveTo(x,y-6);c.lineTo(x+5,y);c.lineTo(x,y+6);c.lineTo(x-5,y);c.closePath();c.fill();c.stroke();break;}
  case 'sky':{const big=it.stars&&it.stars.length&&160*view.scale>=7;
   if(big){c.strokeStyle='#ffffff';c.lineWidth=1;const P=s=>toScreen(view,W,H,s.x,s.y);for(const [a,b] of it.lines||[]){const on=a<it.lit&&b<it.lit;c.globalAlpha=on?.85:.22;const [ax,ay]=P(it.stars[a]),[bx,by]=P(it.stars[b]);c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.stroke();}
    it.stars.forEach((s,k)=>{const [sx,sy]=P(s);c.globalAlpha=k<it.lit?1:.35;c.fillStyle='#ffffff';c.fillRect(sx-1.5,sy-1.5,3,3);});}
   else{c.fillStyle='#ffffff';c.strokeStyle='#ffffff';star(c,x,y,6,4);if(it.done){c.globalAlpha=.95;c.fill();}else{c.globalAlpha=.85;c.lineWidth=1;c.stroke();}}break;}
  case 'live':{c.translate(x,y);c.rotate(Math.PI/4);c.fillStyle=it.won?it.color:'#000';c.strokeStyle=it.color||'#ffffff';c.lineWidth=1.5;c.fillRect(-3.5,-3.5,7,7);c.strokeRect(-3.5,-3.5,7,7);break;}
  case 'landmark':{const z=6;c.strokeStyle='#ffffff';c.fillStyle='#ffffff';c.globalAlpha=.9;c.lineWidth=1.2;
   if(it.type==='torre'){c.fillRect(x-1.5,y-z,3,z*2);}else if(it.type==='arbol'){c.beginPath();c.arc(x,y,z*.8,0,TAU);c.stroke();}
   else if(it.type==='ciudad'){c.strokeRect(x-z*.8,y-z*.8,z*1.6,z*1.6);c.fillRect(x-1.5,y-1.5,3,3);}else if(it.type==='monolito'){c.strokeRect(x-2.5,y-z,5,z*2);}
   else{c.beginPath();c.moveTo(x,y-z);c.lineTo(x+z*.8,y+z*.6);c.lineTo(x-z*.8,y+z*.6);c.closePath();c.stroke();}break;}
  // A rumor someone told you (Descubrir): a white «?» in a small square, white because it is somewhere to go.
  case 'rumor':{c.fillStyle='#000';c.strokeStyle='#ffffff';c.lineWidth=1.2;c.fillRect(x-7,y-7,14,14);c.strokeRect(x-6.5,y-6.5,13,13);c.font=UMAP_FONT;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#ffffff';c.fillText('?',x,y+.5);break;}
  case 'heard':{c.font=UMAP_FONT;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#8a8a8f';c.fillText('?',x,y);break;}
  case 'rare':{c.fillStyle='#ffffff';c.globalAlpha=.8;star(c,x,y,5,6);c.fill();break;}
  case 'mark':{c.strokeStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(x,y,8,0,TAU);c.stroke();c.beginPath();c.moveTo(x-13,y);c.lineTo(x-4,y);c.moveTo(x+4,y);c.lineTo(x+13,y);c.moveTo(x,y-13);c.lineTo(x,y-4);c.moveTo(x,y+4);c.lineTo(x,y+13);c.stroke();break;}
 }c.restore();}
// You: the small white cube and, ahead of it, a chevron along your heading.
export function drawMe(c,x,y,heading=-Math.PI/2,size=8){c.save();c.fillStyle='#ffffff';c.strokeStyle='#000';c.lineWidth=2;c.strokeRect(x-size/2,y-size/2,size,size);c.fillRect(x-size/2,y-size/2,size,size);
 c.translate(x,y);c.rotate(heading);c.strokeStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.moveTo(size+2,-4);c.lineTo(size+7,0);c.lineTo(size+2,4);c.stroke();c.restore();}
// From you to a point: a thin white line (dashed for the mark), cut at the screen's edge.
function lineTo(c,W,H,view,from,to,{dash=null,alpha=.85}={}){const [ax,ay]=toScreen(view,W,H,from.x,from.y),[bx,by]=toScreen(view,W,H,to.x,to.y);c.save();c.strokeStyle='#ffffff';c.globalAlpha=alpha;c.lineWidth=1;if(dash)c.setLineDash(dash);c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.stroke();c.restore();
 // Where to write its distance: at the point if it is on screen, otherwise where the line leaves the screen.
 const inside=bx>8&&bx<W-8&&by>8&&by<H-8;if(inside)return [bx,by,true];const dx=bx-ax,dy=by-ay,t=Math.min(1,...[dx>0?(W-24-ax)/dx:dx<0?(24-ax)/dx:Infinity,dy>0?(H-24-ay)/dy:dy<0?(72-ay)/dy:Infinity].filter(v=>v>=0));return [ax+dx*t,ay+dy*t,false];}
// The scale: a bar of a round length, bottom right.
function scaleBar(c,W,H,view,bottom){const steps=[50,100,200,500,1000,2000,5000,10000,20000,50000,100000,200000,500000,1000000,2000000],target=90/view.scale,u=steps.find(v=>v>=target*.6)||steps.at(-1),w=u*view.scale,x=W-16-w,y=H-bottom;
 c.save();c.strokeStyle='#ffffff';c.globalAlpha=.6;c.lineWidth=1;c.beginPath();c.moveTo(x,y-4);c.lineTo(x,y);c.lineTo(x+w,y);c.lineTo(x+w,y-4);c.stroke();c.restore();label(c,formatDistance(u),x+w/2,y-14,{color:'#ffffffb0',W,H});}
// The whole map. scene: {fog,RP,items,me,next,mark,bands,level}. Returns the icons drawn (for tests and taps).
export function drawUniverseMap(c,W,H,view,scene,{names=null,bottom=24,scale=true,words=true}={}){
 const drawn=[];c.save();c.fillStyle='#000';c.fillRect(0,0,W,H);
 drawFog(c,W,H,view,scene.fog,scene.RP);
 bands(c,W,H,view,scene.bands||[],words,drawn);
 const showNames=names??(scene.level==='anillo');
 // The next place: a thin white line from you with its distance; the mark: dashed.
 if(scene.me&&scene.mark){const [lx,ly,on]=lineTo(c,W,H,view,scene.me,scene.mark,{dash:[4,4],alpha:.7});if(!on&&words)label(c,formatDistance(Math.hypot(scene.mark.x-scene.me.x,scene.mark.y-scene.me.y)),lx,ly,{W,H});}
 if(scene.me&&scene.next){const [lx,ly,on]=lineTo(c,W,H,view,scene.me,scene.next);if(words&&Math.hypot(scene.next.x-scene.me.x,scene.next.y-scene.me.y)*view.scale>40){const [mx,my]=toScreen(view,W,H,scene.me.x,scene.me.y);label(c,`${scene.next.name} · ${formatDistance(Math.hypot(scene.next.x-scene.me.x,scene.next.y-scene.me.y))}`,on?(mx+lx)/2:lx,on?(my+ly)/2:ly,{W,H});}}
 // Icons: the important ones always; the rest only where nothing more important is drawn (14 px cells).
 // Far out, the eleven places become one small ring with their colours (tapping it opens the ring's card).
 const ringR=scene.center?6000*view.scale:Infinity,compact=ringR<34;
 if(compact&&scene.center){const [x,y]=toScreen(view,W,H,scene.center.x,scene.center.y),r=Math.max(5,ringR);c.save();c.strokeStyle='#ffffff';c.globalAlpha=.7;c.lineWidth=1;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();c.globalAlpha=1;
  for(const it of scene.items||[])if(it.kind==='place'){const a=Math.atan2(it.y-scene.center.y,it.x-scene.center.x);c.fillStyle=it.complete?it.ink:it.open?'#ffffff':'#8a8a8f';c.fillRect(x+Math.cos(a)*r-1.5,y+Math.sin(a)*r-1.5,3,3);}c.restore();drawn.push({kind:'ring',x:Math.round(x),y:Math.round(y)});}
 const taken=new Set(),order=[...(scene.items||[])].filter(it=>!compact||(it.kind!=='place'&&it.kind!=='ringHome')).sort((a,b)=>(UMAP_PRIORITY[b.kind]??12)-(UMAP_PRIORITY[a.kind]??12));
 const keep=[];for(const it of order.reverse()){const [x,y]=toScreen(view,W,H,it.x,it.y);if(x<-30||x>W+30||y<-30||y>H+30)continue;const cell=Math.floor(x/14)+','+Math.floor(y/14),always=(UMAP_PRIORITY[it.kind]??12)<=UMAP_PRIORITY.refugio;if(!always&&taken.has(cell))continue;taken.add(cell);keep.push([it,x,y]);}
 for(const [it,x,y] of keep.reverse()){icon(c,it,x,y,view,{names:showNames,W,H});drawn.push({kind:it.kind,id:it.id,x:Math.round(x),y:Math.round(y)});}
 if(scene.me){const [x,y]=toScreen(view,W,H,scene.me.x,scene.me.y);drawMe(c,x,y,scene.me.heading);drawn.push({kind:'me',x:Math.round(x),y:Math.round(y)});}
 if(scale)scaleBar(c,W,H,view,bottom);
 c.restore();return drawn;
}
