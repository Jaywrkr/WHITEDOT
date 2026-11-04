import {bake,glow,glowSprite,streak} from './fx-kit.js';
import {hashKey} from './universe-regions.js';
import {audibleTime} from './journey-pulse.js';
import {LANDSCAPES} from './house-view.js';
import {calmMotion} from './frame-state.js';
// Visual 3 (alpha.255; docs/MUNDO.md, «Visual 3»): the World's ambience, drawn once and reused. Drawing only: nothing
// here reads the old random sequence (positions come from hashKey), moves anything on the map, touches the save or the
// sound. Without a canvas (Node) every piece returns false and the caller draws as before.
// - Stars: three layers repeating a tile's pattern at three depths behind everything (the sky reads deep); with reduced
//   motion one depth.
// - Aurora: the sky's band and the region's curtains from periodic strips that slide, instead of hundreds of strokes.
// - Ground: a quiet texture of its own for the Bosque (dust clouds, clumps, filaments) and the Jardín (tendrils, spores).
// - Scenes: while a stage sounds (only with «Escenas» on), beams from its side and a floor that beats with its genre.
// - Refugio: a warm light in each open room, and the step's light from one baked strip.
const TAU=Math.PI*2;
const h=(...k)=>hashKey('ambient:v1:'+k.join(':'));
const scaleOf=c=>{const a=Math.abs(c?.getTransform?.().a||1);return a>=1.5?2:1;};
const rgba=(hex,a)=>{const n=parseInt(String(hex).slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${Math.max(0,Math.min(1,a))})`;};
// ---------- stars ----------
// far, mid, near: depth (share of the camera's motion), tile side, stars per tile, size, alpha range, glow, tinted share.
// Each layer repeats one pattern of stars per tile, placed once by hashKey and kept. Measured in the browser, whole-tile
// images cost more to composite than the points they hold, so far and mid are drawn as a few paths (one per colour and
// alpha step) and only the near stars, with their glow, come from a small sprite each.
export const STAR_LAYERS=Object.freeze([
 Object.freeze({depth:.03,tile:320,n:30,size:1,lo:.3,hi:.65,glow:0,tint:0}),
 Object.freeze({depth:.07,tile:352,n:12,size:1,lo:.5,hi:.95,glow:0,tint:.35}),
 Object.freeze({depth:.14,tile:384,n:4,size:2,lo:.75,hi:1,glow:.32,tint:.5})
]);
// How bright the layers are against the old 110 points: the old alpha .08–.30 times the sky's own factor.
export const STAR_GAIN=.42,STAR_STEPS=3;
const TINTS=['#cfdcff','#fff0dc','#dff6ff'];
const pointsCache=new Map(),groupsCache=new Map();
export function starPoints(L){let out=pointsCache.get(L);if(out)return out;const ly=STAR_LAYERS[L],m=6;out=[];for(let i=0;i<ly.n;i++){const x=m+h('s',L,i,'x')*(ly.tile-2*m),y=m+h('s',L,i,'y')*(ly.tile-2*m),a=ly.lo+h('s',L,i,'a')*(ly.hi-ly.lo),col=h('s',L,i,'c')<ly.tint?TINTS[Math.floor(h('s',L,i,'k')*TINTS.length)%TINTS.length]:'#ffffff';out.push(Object.freeze({x,y,a,col}));}
 Object.freeze(out);pointsCache.set(L,out);return out;}
// A layer's stars by colour and alpha step (STAR_STEPS between lo and hi): one path each per frame.
export function starGroups(L){let g=groupsCache.get(L);if(g)return g;const ly=STAR_LAYERS[L],by=new Map();
 for(const p of starPoints(L)){const k=Math.min(STAR_STEPS-1,Math.floor((p.a-ly.lo)/(ly.hi-ly.lo+1e-9)*STAR_STEPS)),key=p.col+':'+k;let e=by.get(key);if(!e)by.set(key,e={col:p.col,a:ly.lo+(k+.5)/STAR_STEPS*(ly.hi-ly.lo),xs:[],ys:[]});e.xs.push(Math.round(p.x));e.ys.push(Math.round(p.y));}
 g=[...by.values()];groupsCache.set(L,g);return g;}
// A near star: its glow and its 2 px core, once per colour.
const starSprite=col=>bake('star:'+col,12,12,q=>{const g=q.createRadialGradient(6,6,0,6,6,5);g.addColorStop(0,rgba(col,STAR_LAYERS[2].glow));g.addColorStop(1,rgba(col,0));q.fillStyle=g;q.fillRect(1,1,10,10);q.fillStyle=col;q.fillRect(5,5,2,2);},2);
// The near layer's first star in each tile glints now and then (added light); never with reduced motion or light quality.
const glintPhase=(i,j)=>hashKey('ambient:glint:'+i+','+j)*TAU;
export function drawStarfield(c,W,H,camX,camY,{alpha=1,t=0,still=false,light=false}={}){
 if(!(alpha>0))return true;const layers=light?2:3;if(!starSprite('#ffffff'))return false;   // no canvas: the caller draws the old points
 const ga=c.globalAlpha,fs=c.fillStyle;let drawn=0;
 for(let L=0;L<layers;L++){const ly=STAR_LAYERS[L],T=ly.tile,d=still?STAR_LAYERS[0].depth:ly.depth,ox=-(((camX*d)%T)+T)%T,oy=-(((camY*d)%T)+T)%T,k=Math.min(1,alpha*STAR_GAIN*(still?1:.9+.1*Math.sin(t/(1700+L*500)+L*2.1)));
  if(L<2){for(const g of starGroups(L)){c.globalAlpha=Math.min(1,k*g.a);c.fillStyle=g.col;c.beginPath();
    for(let x=Math.round(ox);x<W;x+=T)for(let y=Math.round(oy);y<H;y+=T)for(let n=0;n<g.xs.length;n++){const px=x+g.xs[n],py=y+g.ys[n];if(px>=0&&px<W&&py>=0&&py<H)c.rect(px,py,ly.size,ly.size);}
    c.fill();drawn++;}continue;}
  const pts=starPoints(2),i0=Math.floor(camX*d/T),j0=Math.floor(camY*d/T);let i=i0;
  for(let x=Math.round(ox);x<W;x+=T,i++){let j=j0;for(let y=Math.round(oy);y<H;y+=T,j++){
   for(const p of pts){const px=x+Math.round(p.x),py=y+Math.round(p.y);if(px<-6||px>W+6||py<-6||py>H+6)continue;c.globalAlpha=Math.min(1,k*p.a);c.drawImage(starSprite(p.col),px-5,py-5,12,12);drawn++;}
   if(!still&&!light){const p=pts[0],g=Math.max(0,Math.sin(t/1100+glintPhase(i,j)))**8;if(g>.05){glow(c,x+p.x,y+p.y,7,'#ffffff',Math.min(1,alpha*.5*g),true);drawn++;}}}}}
 c.globalAlpha=ga;c.fillStyle=fs;state.stars={layers,drawn,still};return true;}
// ---------- aurora ----------
// The sky's band: three waves y=top+20i+16·sin(x/130+t/1500+i). The wave is periodic in x (2π·130 ≈ 816 px) and time
// only slides it, so one strip per hue is baked once (soft glow, a bright crest and curtains falling under it) and
// drawn sliding. Light quality keeps the old three lines (returns false).
export const AURORA_PERIOD=816,AURORA_TOP=-34,AURORA_H=150;
const auroraWave=(u,i)=>20*i+16*Math.sin(u*TAU/AURORA_PERIOD+i);
function paintAurora(q,hue){q.globalCompositeOperation='lighter';q.translate(0,-AURORA_TOP);
 for(let i=0;i<3;i++){const col=`hsl(${(hue+i*35)%360},80%,65%)`,alpha=a=>`hsla(${(hue+i*35)%360},80%,65%,${a})`;
  for(let u=0;u<AURORA_PERIOD;u+=3){const y=auroraWave(u,i),len=24+30*(.5+.5*Math.sin(u/37+i*2))*(.6+.4*Math.sin(u/91+i*1.3)),g=q.createLinearGradient(0,y,0,y+len);g.addColorStop(0,alpha(.26));g.addColorStop(1,alpha(0));q.fillStyle=g;q.fillRect(u,y-1,2,len);}
  for(const [w,a] of [[12,.12],[5,.3],[1.5,.85]]){q.strokeStyle=col;q.globalAlpha=a;q.lineWidth=w;q.beginPath();for(let u=-12;u<=AURORA_PERIOD+12;u+=6){const y=auroraWave(u,i);u>-12?q.lineTo(u,y):q.moveTo(u,y);}q.stroke();}q.globalAlpha=1;}}
export function drawAuroraSky(c,W,t,hue,alpha,{still=false,light=false,top=70}={}){
 if(light)return false;if(!(alpha>0))return true;const key=Math.round(((hue%360)+360)%360/5)*5,s=bake('aurora:'+key,AURORA_PERIOD,AURORA_H,q=>paintAurora(q,key),scaleOf(c));if(!s)return false;
 const slide=still?0:(130*t/1500)%AURORA_PERIOD,ga=c.globalAlpha,op=c.globalCompositeOperation;c.globalAlpha=Math.min(1,alpha*2.2);c.globalCompositeOperation='lighter';let n=0;
 for(let x=-Math.round(slide);x<W;x+=AURORA_PERIOD){c.drawImage(s,x,Math.round(top+AURORA_TOP),AURORA_PERIOD,AURORA_H);n++;}
 c.globalCompositeOperation=op;c.globalAlpha=ga;state.aurora={drawn:n,at:t};return true;}
// The region's curtains (universe-layers.js, STYLES.aurora.mid; the Canción del cielo draws them too): columns every 5
// px along y=base+amp·sin((ux+u)/110+t/1500+ph), each falling 14–22 px. Periodic in 2π·110 ≈ 691 px: one strip per ink,
// a cell takes its slice. The cells within reach of the cube (the curtains part for it) keep the old columns.
export const CURTAIN_PERIOD=691,CURTAIN_AMP=13,CURTAIN_Y=18,CURTAIN_H=64;
function paintCurtain(q,ink){q.lineWidth=1;
 for(let u=0;u<CURTAIN_PERIOD;u+=5){const y=CURTAIN_Y+CURTAIN_AMP*Math.sin(u*TAU/CURTAIN_PERIOD),len=14+8*Math.sin(u*TAU*3/CURTAIN_PERIOD)+6,g=q.createLinearGradient(0,y,0,y+len);g.addColorStop(0,rgba(ink,.42));g.addColorStop(1,rgba(ink,0));q.strokeStyle=g;q.beginPath();q.moveTo(u+.5,y);q.lineTo(u+.5,y+len);q.stroke();}
 q.globalCompositeOperation='lighter';q.strokeStyle=rgba(ink,.1);q.lineWidth=4;q.beginPath();for(let u=-8;u<=CURTAIN_PERIOD+8;u+=6){const y=CURTAIN_Y+CURTAIN_AMP*Math.sin(u*TAU/CURTAIN_PERIOD);u>-8?q.lineTo(u,y):q.moveTo(u,y);}q.stroke();}
export function drawCurtainCell(c,x,base,s,ux,phase,ink){const sc=scaleOf(c),strip=bake('curtain:'+ink,CURTAIN_PERIOD,CURTAIN_H,q=>paintCurtain(q,ink),sc);if(!strip)return false;
 const P=CURTAIN_PERIOD,u0=Math.round((((ux+phase*110)%P)+P)%P)%P,first=Math.min(s,P-u0),y=Math.round(base-CURTAIN_Y);x=Math.round(x);
 c.drawImage(strip,u0*sc,0,first*sc,CURTAIN_H*sc,x,y,first,CURTAIN_H);if(first<s)c.drawImage(strip,0,0,(s-first)*sc,CURTAIN_H*sc,x+first,y,s-first,CURTAIN_H);state.curtains++;return true;}
// ---------- ground of the Bosque and the Jardín ----------
// A plane at GROUND.depth of the camera, cells of GROUND.cell px; each cell takes one of a few baked variants by
// hashKey, painted inside its margins (nothing crosses a cell's edge, so cells never cut a shape). Static: only the
// whole layer breathes a little with the beat (not with reduced motion). Cells fade with their distance to the cube and
// the farthest are not drawn (less to paint). Light quality leaves it out.
export const GROUND=Object.freeze({depth:.55,cell:256,variants:5,margin:8,reach:.34});
const GROUND_BIOMES=new Set(['bosque','jardin']);
function paintBosque(q,v,ink){const S=GROUND.cell,M=GROUND.margin,r=k=>h('gb',v,k);
 for(let i=0;i<3;i++){const R=30+r('cr'+i)*28,x=M+R+r('cx'+i)*(S-2*M-2*R),y=M+R+r('cy'+i)*(S-2*M-2*R),g=q.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,rgba(ink,.07));g.addColorStop(1,rgba(ink,0));q.fillStyle=g;q.fillRect(x-R,y-R,2*R,2*R);}
 const clumps=[];for(let i=0;i<3;i++){const x=M+22+r('kx'+i)*(S-2*M-44),y=M+22+r('ky'+i)*(S-2*M-44);clumps.push([x,y]);
  for(let n=0;n<14;n++){const a=r('ka'+i+n)*TAU,d=Math.pow(r('kd'+i+n),1.6)*18;q.globalAlpha=.16+.3*r('kl'+i+n);q.fillStyle=n%5?ink:'#ffffff';q.fillRect(Math.round(x+Math.cos(a)*d),Math.round(y+Math.sin(a)*d),1,1);}}
 q.globalAlpha=.08;q.strokeStyle=ink;q.lineWidth=1;q.beginPath();for(let i=0;i<2;i++){const [x0,y0]=clumps[i],[x1,y1]=clumps[i+1];q.moveTo(x0,y0);q.quadraticCurveTo((x0+x1)/2+(r('fx'+i)-.5)*60,(y0+y1)/2+(r('fy'+i)-.5)*60,x1,y1);}q.stroke();
 for(let n=0;n<26;n++){q.globalAlpha=.08+.12*r('pa'+n);q.fillStyle=ink;q.fillRect(Math.round(M+r('px'+n)*(S-2*M)),Math.round(M+r('py'+n)*(S-2*M)),1,1);}q.globalAlpha=1;}
function paintJardin(q,v,ink){const S=GROUND.cell,M=GROUND.margin,r=k=>h('gj',v,k);
 for(let i=0;i<2;i++){const R=26+r('br'+i)*24,x=M+R+r('bx'+i)*(S-2*M-2*R),y=M+R+r('by'+i)*(S-2*M-2*R),g=q.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,rgba(ink,.055));g.addColorStop(1,rgba(ink,0));q.fillStyle=g;q.fillRect(x-R,y-R,2*R,2*R);}
 q.strokeStyle=ink;q.lineWidth=1;for(let i=0;i<4;i++){const x=M+30+r('tx'+i)*(S-2*M-60),y=M+30+r('ty'+i)*(S-2*M-60),a=r('ta'+i)*TAU,L=18+r('tl'+i)*14,bx=x+Math.cos(a)*L,by=y+Math.sin(a)*L,cx=x+Math.cos(a+1.2)*L*.7,cy=y+Math.sin(a+1.2)*L*.7;
  q.globalAlpha=.16;q.beginPath();q.moveTo(x,y);q.quadraticCurveTo(cx,cy,bx,by);q.arc(bx-Math.cos(a)*3,by-Math.sin(a)*3,3,a,a+4.2);q.stroke();
  q.globalAlpha=.2;q.fillStyle=ink;for(let n=1;n<3;n++){const k=n/3,lx=(1-k)*(1-k)*x+2*k*(1-k)*cx+k*k*bx,ly=(1-k)*(1-k)*y+2*k*(1-k)*cy+k*k*by;q.beginPath();q.ellipse(lx,ly,2.4,1,a+n,0,TAU);q.fill();}}
 for(let i=0;i<4;i++){const x=M+10+r('fx'+i)*(S-2*M-20),y=M+10+r('fy'+i)*(S-2*M-20);q.fillStyle=ink;q.globalAlpha=.3;for(let p=0;p<5;p++){const a=p*TAU/5+r('fa'+i);q.fillRect(Math.round(x+Math.cos(a)*3),Math.round(y+Math.sin(a)*3),1,1);}q.globalAlpha=.32;q.fillStyle='#ffffff';q.fillRect(Math.round(x),Math.round(y),1,1);}
 for(let n=0;n<22;n++){q.globalAlpha=.08+.12*r('sa'+n);q.fillStyle=ink;q.fillRect(Math.round(M+r('sx'+n)*(S-2*M)),Math.round(M+r('sy'+n)*(S-2*M)),1,1);}q.globalAlpha=1;}
export const groundVariant=(i,j)=>Math.floor(hashKey('ambient:ground:'+i+','+j)*GROUND.variants)%GROUND.variants;
// ---------- scenes ----------
// Colours by scene and genre: the Almacén cold white with an accent (acid green, EBM red, Detroit blue); the Patio
// coral and turquoise (deep and tropical, magenta). Never gold: gold is only for what is earned.
export function sceneColors(scene,genre){if(scene==='patio')return {base:'#ff8a6a',accent:/deep|tropical|amapiano|organic/.test(genre||'')?'#ff7ad9':'#5fe0c8'};
 return {base:'#d8e4ff',accent:/acid/.test(genre||'')?'#b8ff5c':/ebm|robotic|electro/.test(genre||'')?'#ff6b6b':/detroit|melodic/.test(genre||'')?'#8fb8ff':'#ffffff'};}
export const SCENE_LEVEL=Object.freeze({intro:.4,build:.6,drop:1,breakdown:.15,return:1});
export const SCENE_FLOOR=Object.freeze({n:5,tile:26,gap:6});
const CLAVE=Object.freeze({son:[0,3,6,10,12],rumba:[0,3,7,10,12]});
// ---------- Refugio ----------
// The warm light of an open room: a lamp under its ceiling and a pool on its floor, added (black stays black).
export const REFUGIO_WARM='#ffc98a';
export function refugioRoomLight(c,x,y,w,h,floorY,night=0){const s=glowSprite(REFUGIO_WARM);if(!s)return false;const ga=c.globalAlpha,op=c.globalCompositeOperation;c.globalCompositeOperation='lighter';
 c.globalAlpha=ga*(.16+.08*night);c.drawImage(s,x+w*.1,y-h*.35,w*.8,h*1.1);
 c.globalAlpha=ga*(.22+.08*night);c.drawImage(s,x+w*.12,floorY-Math.max(6,h*.06),w*.76,Math.max(12,h*.12));
 c.globalCompositeOperation=op;c.globalAlpha=ga;return true;}
// The light of the bar's current step (it was a linear gradient per room and frame): one baked strip, clear to white.
export function stepLight(c,x,y,w,h){const s=bake('refugio:step',4,64,q=>{const g=q.createLinearGradient(0,0,0,64);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,255,255,.10)');q.fillStyle=g;q.fillRect(0,0,4,64);},1);if(!s)return false;c.drawImage(s,x,y,w,h);return true;}
// ---------- what was drawn (tests read it through runtime.ambientState) ----------
const state={stars:null,aurora:null,curtains:0,ground:{cells:0},scene:null};
export const ambientState=()=>({stars:state.stars&&{...state.stars},aurora:state.aurora&&{...state.aurora},curtains:state.curtains,ground:{...state.ground},scene:state.scene&&{...state.scene}});
// The frame's pieces, for render.js.
export function createAmbient(runtime){
 const calm=()=>calmMotion(runtime.S);
 const light=()=>!!runtime.lightQuality?.();
 const ids=()=>runtime.BIOMES?.map(b=>b.id)||[];
 const variants=new Map();
 function beatIndex(){const ac=runtime.ac,bq=runtime.MU?.bq;if(!ac||!bq?.length)return Math.floor(performance.now()/500);return Math.floor((audibleTime(ac)-bq[0])/((runtime.SIX||.15)*4));}
 function sixteenth(){const ac=runtime.ac,bq=runtime.MU?.bq;if(!ac||!bq?.length)return Math.floor(performance.now()/125)%16;const bar=(runtime.SIX||.15)*16,ph=((((audibleTime(ac)-bq[bq.length-1])/bar)%1)+1)%1;return Math.floor(ph*16)%16;}
 // The background stars, behind everything in the World and the studio. starA is the sky's factor (biome, air, hour).
 function stars(t,starA){state.curtains=0;return drawStarfield(runtime.cx,runtime.W,runtime.H,runtime.camX||0,runtime.camY||0,{alpha:starA,t,still:calm(),light:light()});}
 // The sky's aurora (a region's event): false in light quality, so the old lines are drawn.
 const aurora=(t,hue,alpha)=>drawAuroraSky(runtime.cx,runtime.W,t,hue,alpha,{still:calm(),light:light()});
 // The ground of the Bosque and the Jardín.
 function ground(t,b){state.ground={cells:0};if(light()||!runtime.inWorld?.()||(runtime.S.layer||'superficie')!=='superficie')return;const c=runtime.cx,W=runtime.W,H=runtime.H,camX=runtime.camX??runtime.S.wx,camY=runtime.camY??runtime.S.wy,list=ids(),sc=1;
  const G=GROUND.cell,d=GROUND.depth,ox=camX*d-W/2,oy=camY*d-H/2,i0=Math.floor(ox/G),j0=Math.floor(oy/G),i1=Math.floor((ox+W)/G),j1=Math.floor((oy+H)/G),still=calm();let n=0;
  // The ground fades away from the cube like the rest of the World: far cells are fainter, the farthest are left out.
  const ga=c.globalAlpha,k0=still?1:.9+.1*(b||0),reach=Math.max(W,H)*GROUND.reach,cx=W/2+(runtime.S.wx-camX),cy=H/2+(runtime.S.wy-camY);
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const sx=i*G-ox,sy=j*G-oy,wx=camX+(sx+G/2-W/2),wy=camY+(sy+G/2-H/2),id=list[runtime.biomeOfPos(wx,wy)];if(!GROUND_BIOMES.has(id))continue;
   const fade=Math.min(1,1.3-Math.hypot(sx+G/2-cx,sy+G/2-cy)/reach);if(fade<.12)continue;c.globalAlpha=k0*fade;
   const key=i+','+j;let v=variants.get(key);if(v===undefined){v=groundVariant(i,j);if(variants.size>4000)variants.clear();variants.set(key,v);}
   const ink=runtime.placeColor?runtime.placeColor(id,LANDSCAPES[id]):LANDSCAPES[id],s=bake('ground:'+id+':'+v+':'+ink,G,G,q=>(id==='bosque'?paintBosque:paintJardin)(q,v,ink),sc);if(!s)break;c.drawImage(s,Math.round(sx),Math.round(sy),G,G);n++;}
  c.globalAlpha=ga;state.ground={cells:n};}
 // The print of a scene that sounds: nothing unless «Escenas» is on and a stage is heard (sceneState, scenes.js).
 function scene(t){const st=runtime.sceneState?.();if(!st?.on||!st.stage||!(st.prox>0)||!runtime.inWorld?.()){state.scene=null;return;}
  const c=runtime.cx,W=runtime.W,H=runtime.H,camX=runtime.camX??runtime.S.wx,camY=runtime.camY??runtime.S.wy,stage=st.stage,still=calm(),lite=light(),col=sceneColors(stage.scene,stage.genre);
  const k=st.prox*(st.fading?.5:1)*(SCENE_LEVEL[st.section]??.4),b=still?.35:runtime.beat?.()||0,beat=still?0:beatIndex(),sx=stage.x-camX+W/2,sy=stage.y-camY+H/2;
  const out={scene:stage.scene,k:+k.toFixed(3),beams:0,floor:false,bulbs:0};if(!(k>.01)){state.scene=out;return;}
  c.save();
  // Beams from the stage's side: from the stage, or from just past the screen's edge towards it. They fan out over the
  // screen and sweep slowly; on the beat they are brighter. Not in light quality; still with reduced motion.
  if(!lite){const dx=sx-W/2,dy=sy-H/2,dist=Math.hypot(dx,dy),R=Math.max(W,H)*.62,ox=dist>R?W/2+dx/dist*R:sx,oy=dist>R?H/2+dy/dist*R:sy,toward=dist>40?Math.atan2(-dy,-dx):-Math.PI/2,n=stage.scene==='patio'?2:3,len=Math.max(W,H)*1.05;
   for(let i=0;i<n;i++){const off=(i-(n-1)/2)*.42,sweep=still?0:Math.sin(t/(2600+i*700)+i*1.7)*.32,a=toward+off+sweep,cl=i===1||n===2&&i===0?col.accent:col.base;
    streak(c,ox,oy,a+Math.PI,len,22,cl,k*.16*(.55+.45*b),true);out.beams++;}}
  // The floor at the stage: five by five tiles; on each beat three light in the accent (by hashKey of the stage and the
  // beat); in the Patio a ring of sixteen bulbs where the clave falls.
  const F=SCENE_FLOOR,size=F.n*F.tile+(F.n-1)*F.gap,x0=sx-size/2,y0=sy-size/2;
  if(x0<W+40&&x0+size>-40&&y0<H+40&&y0+size>-40){out.floor=true;c.globalAlpha=Math.min(1,.07*k+.03);c.strokeStyle=col.base;c.lineWidth=1;c.beginPath();for(let i=0;i<F.n;i++)for(let j=0;j<F.n;j++)c.rect(Math.round(x0+i*(F.tile+F.gap))+.5,Math.round(y0+j*(F.tile+F.gap))+.5,F.tile,F.tile);c.stroke();
   c.fillStyle=col.accent;for(let m=0;m<3;m++){const q=Math.floor(hashKey('ambient:floor:'+stage.key+':'+beat+':'+m)*F.n*F.n),i=q%F.n,j=Math.floor(q/F.n);c.globalAlpha=Math.min(1,k*(.1+.22*b));c.fillRect(Math.round(x0+i*(F.tile+F.gap))+1,Math.round(y0+j*(F.tile+F.gap))+1,F.tile-1,F.tile-1);}
   if(stage.scene==='patio'){const clave=CLAVE[stage.hand?.clave]||CLAVE.son,now=still?-1:sixteenth(),R=size*.72;
    for(let s=0;s<16;s++){const a=s/16*TAU-Math.PI/2,bx=sx+Math.cos(a)*R,by=sy+Math.sin(a)*R,on=clave.includes(s),hit=on&&s===now;c.globalAlpha=Math.min(1,k*(hit?.95:on?.45:.18));c.fillStyle=on?col.base:'#ffffff';c.fillRect(Math.round(bx)-1,Math.round(by)-1,2,2);
     if(hit&&!lite)glow(c,bx,by,9,col.base,k*.6,true);out.bulbs++;}}}
  c.restore();state.scene=out;}
 return {stars,aurora,ground,scene};
}
