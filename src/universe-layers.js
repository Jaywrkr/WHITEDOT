import {prefersReducedMotion} from './frame-state.js';
import {LANDSCAPES} from './house-view.js';
import {hash} from './world-sheet.js';
// A hash with full avalanche: keys that differ in one character land far apart (no clumps of points).
export function rand(key){let h=hash(key);h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return (h>>>0)/4294967296;}
// The universe seen from above (docs/UNIVERSO.md): every region draws three layers on the World's surface.
// - far: small and slow (parallax under 1), it gives the feeling of looking down into depth;
// - mid: the texture of the region;
// - near: details that answer the cube.
// Layers move in both directions, never have a horizon, and come from hashes of the cell, never the old random
// sequence. Near a border the cells of both regions mix over about 300 px. A region's own sound stays far under the
// music (REGION_SOUND_MAX).
export const BORDER=150;   // half of the mixing band on each side of a region's edge
export const REGION_SOUND_MAX=.012;   // gain cap for any region sound (about −38 dB), under the music
export const LAYER_DEPTH=Object.freeze({far:.35,mid:.7,near:1});
// Cell size of each layer on screen, the same for every region so cells line up at borders.
export const LAYER_CELL=Object.freeze({far:150,mid:120,near:110});
const rgba=(hex,a)=>{const n=parseInt(hex.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${Math.max(0,Math.min(1,a))})`;};
// Which region draws a cell: its own, or near an edge sometimes the neighbour's, more often closer to the edge.
export function cellRegion(x,y,size,regionAt,key){const own=regionAt(x,y),fx=((x%size)+size)%size,fy=((y%size)+size)%size,toEdge=Math.min(fx,size-fx,fy,size-fy);
 if(toEdge>=BORDER)return own;const nx=fx<size/2?x-BORDER*2:x+BORDER*2,ny=fy<size/2?y-BORDER*2:y+BORDER*2,ex=Math.min(fx,size-fx),ey=Math.min(fy,size-fy),other=ex<ey?regionAt(nx,y):regionAt(x,ny);
 if(other===own)return own;return rand(key+':mix')<.5*(1-toEdge/BORDER)?other:own;}
// The regions' layers. Each draws one cell: (x,y) its top-left corner on screen, s its size, key its hash key.
export const STYLES={
 vacio:null,
 llanura:{
  // Polvo: far haze of faint grains; mid grains of 1 px drifting with the region's wind; near motes that part for the cube.
  far:{draw(c,x,y,s,key,f){c.fillStyle=rgba(f.ink,.22+.08*f.beat);for(let i=0;i<5;i++)c.fillRect(Math.round(x+rand(key+':x'+i)*s),Math.round(y+rand(key+':y'+i)*s),1,1);}},
  mid:{draw(c,x,y,s,key,f){const a=f.wind,speed=f.still?0:8+rand(key+':v')*10;c.fillStyle=rgba(f.ink,.7+.3*f.beat);
   for(let i=0;i<24;i++){const d=(f.t/1000*speed*(.6+rand(key+':s'+i)*.8))%s,px=x+((rand(key+':x'+i)*s+Math.cos(a)*d)%s+s)%s,py=y+((rand(key+':y'+i)*s+Math.sin(a)*d)%s+s)%s;c.fillRect(Math.round(px),Math.round(py),1,1);if(i%3===0){c.fillRect(Math.round(px-Math.cos(a)*2),Math.round(py-Math.sin(a)*2),1,1);c.fillRect(Math.round(px-Math.cos(a)*4),Math.round(py-Math.sin(a)*4),1,1);}}}},
  near:{draw(c,x,y,s,key,f){c.fillStyle=rgba(f.ink,.7+.3*f.beat);
   for(let i=0;i<6;i++){let px=x+rand(key+':x'+i)*s,py=y+rand(key+':y'+i)*s;const [ox,oy]=f.part(px,py);c.fillRect(Math.round(px+ox)-1,Math.round(py+oy)-1,2,2);}}},
  sound:{kind:'hiss',band:6000,gain:.006,bySpeed:.006}
 },
 lago:{
  // Marea: far, huge faint rings opening slowly; mid, wave sources that send a ring on every bar; near, small floating
  // rings. The cube leaves its own wake (`wake`).
  far:{draw(c,x,y,s,key,f){const p=f.still?.5:(f.t/9000+rand(key+':p'))%1;c.strokeStyle=rgba(f.ink,.1*(1-p));c.lineWidth=1;c.beginPath();c.arc(x+rand(key+':x')*s,y+rand(key+':y')*s,8+p*90,0,6.283);c.stroke();}},
  mid:{draw(c,x,y,s,key,f){if(rand(key+':on')<.45)return;const cx=x+rand(key+':x')*s,cy=y+rand(key+':y')*s;c.fillStyle=rgba(f.ink,.7);c.fillRect(Math.round(cx)-1,Math.round(cy)-1,2,2);c.lineWidth=1;
   for(let k=0;k<2;k++){const p=f.still?.3+k*.4:(f.bar+k*.5)%1;c.strokeStyle=rgba(f.ink,(.45+.2*f.beat)*(1-p));c.beginPath();c.arc(cx,cy,4+p*60,0,6.283);c.stroke();}}},
  near:{draw(c,x,y,s,key,f){c.lineWidth=1;for(let i=0;i<2;i++){const px=x+rand(key+':x'+i)*s,py=y+rand(key+':y'+i)*s,[ox,oy]=f.part(px,py),r=2+rand(key+':r'+i)*3;c.strokeStyle=rgba(f.ink,.5+.3*f.beat);c.beginPath();c.arc(px+ox,py+oy,r,0,6.283);c.stroke();}}},
  wake:true,
  sound:{kind:'hiss',band:260,q:4,gain:.007,bySpeed:.003}
 },
 bosque:{
  // Cúmulo: far, little galaxies; mid, clusters of 5–12 stars that light in sequence when the cube comes near;
  // near, single bright stars that blink on the beat.
  far:{draw(c,x,y,s,key,f){c.fillStyle=rgba(f.ink,.12);const cx=x+rand(key+':x')*s,cy=y+rand(key+':y')*s;for(let i=0;i<5;i++)c.fillRect(Math.round(cx+(rand(key+':a'+i)-.5)*10),Math.round(cy+(rand(key+':b'+i)-.5)*5),1,1);}},
  mid:{draw(c,x,y,s,key,f){if(rand(key+':on')<.35)return;const cx=x+rand(key+':x')*s,cy=y+rand(key+':y')*s,n=5+Math.floor(rand(key+':n')*8),near=Math.hypot(cx-f.cubeX,cy-f.cubeY)<130,seq=f.still?n:Math.floor(f.t/110)%(n+4);
   for(let i=0;i<n;i++){const a=rand(key+':a'+i)*6.283,d=4+rand(key+':d'+i)*16,lit=near&&i<seq,tw=f.still?.5:.5+.5*Math.sin(f.t/600+i*1.7);c.fillStyle=rgba(lit?'#ffffff':f.ink,lit?.95:.3+.35*tw);const z=lit||i===0?2:1;c.fillRect(Math.round(cx+Math.cos(a)*d),Math.round(cy+Math.sin(a)*d),z,z);}}},
  near:{draw(c,x,y,s,key,f){if(rand(key+':on')<.5)return;const px=x+rand(key+':x')*s,py=y+rand(key+':y')*s,on=(Math.floor(rand(key+':k')*4)===f.beatIndex%4);c.fillStyle=rgba(f.ink,on?.6+.4*f.beat:.35);c.fillRect(Math.round(px)-1,Math.round(py)-1,2,2);}},
  sound:{kind:'hiss',band:9500,q:2,gain:.004,bySpeed:.002}
 },
 tormenta:{
  // Tormenta solar: far, the boiling surface of a star; mid, plasma arcs between two points that flicker; near,
  // flares that fall on the beat and leave a ring, a few in red.
  far:{draw(c,x,y,s,key,f){for(let i=0;i<2;i++){const r=10+rand(key+':r'+i)*22,b=f.still?.5:.5+.5*Math.sin(f.t/1700+rand(key+':p'+i)*6);c.fillStyle=rgba(f.ink,.05+.05*b);c.beginPath();c.arc(x+rand(key+':x'+i)*s,y+rand(key+':y'+i)*s,r,0,6.283);c.fill();}}},
  mid:{draw(c,x,y,s,key,f){if(rand(key+':on')<.4)return;const ax=x+rand(key+':x')*s,ay=y+rand(key+':y')*s,a=rand(key+':a')*6.283,l=24+rand(key+':l')*40,bx=ax+Math.cos(a)*l,by=ay+Math.sin(a)*l,h=(f.still?.6:.4+.6*Math.abs(Math.sin(f.t/180+rand(key+':f')*9)))*(10+l*.4);
   c.strokeStyle=rgba(f.ink,.35+.45*f.beat);c.lineWidth=1;c.beginPath();c.moveTo(ax,ay);c.quadraticCurveTo((ax+bx)/2-Math.sin(a)*h,(ay+by)/2+Math.cos(a)*h,bx,by);c.stroke();}},
  near:{draw(c,x,y,s,key,f){if(f.still||rand(key+':on')<.55)return;const pick=Math.floor(rand(key+':b')*4);if(pick!==f.beatIndex%4)return;const px=x+rand(key+':x')*s,py=y+rand(key+':y')*s,red=rand(key+':red')<.2,ink=red?'#ff6a6a':f.ink,p=1-f.beat;
   c.fillStyle=rgba(ink,f.beat);c.fillRect(Math.round(px)-2,Math.round(py)-2,4,4);c.strokeStyle=rgba(ink,.6*(1-p));c.lineWidth=1;c.beginPath();c.arc(px,py,4+p*26,0,6.283);c.stroke();}},
  sound:{kind:'hiss',band:1800,q:.6,gain:.006,bySpeed:.004}
 },
 ruinas:{
  // Restos: whole thin orbits far away, broken arcs turning very slowly, small fragments that part for the cube.
  // The only region that does not beat: it feels old.
  far:{draw(c,x,y,s,key,f){if(rand(key+':on')<.5)return;c.strokeStyle=rgba(f.ink,.08);c.lineWidth=1;c.beginPath();c.ellipse(x+rand(key+':x')*s,y+rand(key+':y')*s,40+rand(key+':r')*50,18+rand(key+':q')*20,rand(key+':a')*3.14,0,6.283);c.stroke();}},
  mid:{draw(c,x,y,s,key,f){c.strokeStyle=rgba(f.ink,.38);c.lineWidth=1;for(let i=0;i<2;i++){if(rand(key+':on'+i)<.35)continue;const cx=x+rand(key+':x'+i)*s,cy=y+rand(key+':y'+i)*s,r=14+rand(key+':r'+i)*26,a=rand(key+':a'+i)*6.283+(f.still?0:f.t/24000);
   for(let k=0;k<3;k++){const from=a+k*2.1,len=.5+rand(key+':l'+i+k)*.9;c.beginPath();c.arc(cx,cy,r,from,from+len);c.stroke();}}}},
  near:{draw(c,x,y,s,key,f){c.strokeStyle=rgba(f.ink,.6);c.lineWidth=1;for(let i=0;i<3;i++){const px=x+rand(key+':x'+i)*s,py=y+rand(key+':y'+i)*s,[ox,oy]=f.part(px,py),a=rand(key+':a'+i)*3.14;c.beginPath();c.moveTo(px+ox-Math.cos(a)*3,py+oy-Math.sin(a)*3);c.lineTo(px+ox+Math.cos(a)*3,py+oy+Math.sin(a)*3);c.stroke();}}},
  sound:{kind:'hiss',band:520,q:1.4,gain:.004,bySpeed:.003}
 },
 jardin:{
  // Esporas: far pink points breathing; mid seeds that breathe; near, if the cube stays still, seeds open into
  // four-pointed stars that beat.
  far:{draw(c,x,y,s,key,f){const b=f.still?.5:.5+.5*Math.sin(f.t/1800+rand(key+':p')*6);c.fillStyle=rgba(f.ink,.08+.1*b);for(let i=0;i<3;i++)c.fillRect(Math.round(x+rand(key+':x'+i)*s),Math.round(y+rand(key+':y'+i)*s),1,1);}},
  mid:{draw(c,x,y,s,key,f){for(let i=0;i<6;i++){const b=f.still?.5:.5+.5*Math.sin(f.t/900+i*1.3+rand(key+':p'+i)*6);c.fillStyle=rgba(f.ink,.3+.4*b);c.fillRect(Math.round(x+rand(key+':x'+i)*s),Math.round(y+rand(key+':y'+i)*s),2,2);}}},
  near:{draw(c,x,y,s,key,f){for(let i=0;i<3;i++){const px=x+rand(key+':x'+i)*s,py=y+rand(key+':y'+i)*s,d=Math.hypot(px-f.cubeX,py-f.cubeY),open=d<110?Math.min(1,f.rest):0,r=1+open*(4+3*f.beat);
   c.fillStyle=rgba(open>.1?'#ffffff':f.ink,.5+.5*open);c.fillRect(Math.round(px)-1,Math.round(py)-1,2,2);if(open>.1){c.strokeStyle=rgba(f.ink,.8*open);c.lineWidth=1;c.beginPath();c.moveTo(px-r,py);c.lineTo(px+r,py);c.moveTo(px,py-r);c.lineTo(px,py+r);c.stroke();}}}},
  sound:{kind:'hiss',band:4200,q:3,gain:.003,bySpeed:.002}
 },
 dunas:{
  // Anillos: the ring of a planet seen from above. Far, wide faint bands; mid, thin curved bands that slide; near,
  // pebbles riding the bands, each at its own speed, changing band on the beat.
  far:{draw(c,x,y,s,key,f){c.strokeStyle=rgba(f.ink,.07);c.lineWidth=6;band(c,x,y,s,f,70,0);}},
  mid:{draw(c,x,y,s,key,f){c.strokeStyle=rgba(f.ink,.3);c.lineWidth=1;band(c,x,y,s,f,22,f.still?0:f.t/90);}},
  near:{draw(c,x,y,s,key,f){c.fillStyle=rgba(f.ink,.75);for(let i=0;i<3;i++){const lane=Math.floor(rand(key+':l'+i)*5)+(f.beatIndex+Math.floor(rand(key+':k'+i)*4))%2,v=20+rand(key+':v'+i)*40,u=((rand(key+':x'+i)*s+(f.still?0:f.t/1000*v))%s+s)%s,px=x+u,wy=f.uy+lane*22+Math.sin((f.ux+u)/700)*30,py=y+(wy-f.uy)%s;c.fillRect(Math.round(px)-1,Math.round(py)-1,2,2);}}},
  sound:{kind:'hiss',band:2600,q:.7,gain:.003,bySpeed:.007}
 },
 cristales:{
  // Prisma: a crystal lattice. Far, a faint triangular mesh; mid, nodes and edges, one node lighting per beat;
  // near, your pulse runs through the mesh outwards and lights the edges as it passes.
  far:{draw(c,x,y,s,key,f){c.strokeStyle=rgba(f.ink,.07);c.lineWidth=1;lattice(c,x,y,s,f,60,()=>1);}},
  mid:{draw(c,x,y,s,key,f){c.lineWidth=1;lattice(c,x,y,s,f,36,(px,py,k)=>{const lit=Math.floor(rand(key+':n'+k)*16)===f.beatIndex%16;const wave=f.pulseAge<1.6?Math.max(0,1-Math.abs(Math.hypot(px-f.cubeX,py-f.cubeY)-f.pulseAge*260)/40):0;c.strokeStyle=rgba(wave>.05?'#ffffff':f.ink,.22+.7*wave+(lit?.4:0));return 1;});}},
  near:{draw(c,x,y,s,key,f){if(rand(key+':on')<.6)return;const px=x+rand(key+':x')*s,py=y+rand(key+':y')*s;c.fillStyle=rgba('#ffffff',.5+.4*f.beat);c.fillRect(Math.round(px)-1,Math.round(py)-1,2,2);}},
  sound:{kind:'hiss',band:7200,q:6,gain:.0025,bySpeed:.0015}
 },
 faros:{
  // Púlsares: far flashes each with its own period; mid, a few pulsars with a sweeping beam and a flash on the beat;
  // near, small sparks.
  far:{draw(c,x,y,s,key,f){const period=1.2+rand(key+':p')*3,on=f.still?.3:((f.t/1000/period+rand(key+':o'))%1)<.08?1:.15;c.fillStyle=rgba(f.ink,.5*on);c.fillRect(Math.round(x+rand(key+':x')*s),Math.round(y+rand(key+':y')*s),on>.5?2:1,on>.5?2:1);}},
  mid:{draw(c,x,y,s,key,f){if(rand(key+':on')<.72)return;const px=x+rand(key+':x')*s,py=y+rand(key+':y')*s,a=(f.still?0:f.t/(700+rand(key+':s')*900))+rand(key+':a')*6.283;
   c.fillStyle=rgba(f.ink,.1+.08*f.beat);c.beginPath();c.moveTo(px,py);c.lineTo(px+Math.cos(a-.1)*120,py+Math.sin(a-.1)*120);c.lineTo(px+Math.cos(a+.1)*120,py+Math.sin(a+.1)*120);c.closePath();c.fill();c.fillStyle=rgba('#ffffff',.6+.4*f.beat);c.fillRect(Math.round(px)-2,Math.round(py)-2,4,4);}},
  near:{draw(c,x,y,s,key,f){c.fillStyle=rgba(f.ink,.45+.4*f.beat);for(let i=0;i<2;i++)c.fillRect(Math.round(x+rand(key+':x'+i)*s),Math.round(y+rand(key+':y'+i)*s),1,1);}},
  sound:{kind:'hiss',band:3200,q:8,gain:.0025,bySpeed:.001}
 },
 cueva:{
  // Pozo: a black hole. Far, faint spiral arcs; mid, rare dark discs with a turning ring of light; near, dust that
  // circles in towards the cell's centre.
  far:{draw(c,x,y,s,key,f){if(rand(key+':on')<.5)return;const cx=x+s/2,cy=y+s/2,a0=rand(key+':a')*6.283+(f.still?0:f.t/9000);c.strokeStyle=rgba(f.ink,.08);c.lineWidth=1;c.beginPath();for(let k=0;k<=24;k++){const a=a0+k*.25,r=6+k*2.6;k?c.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r):c.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}c.stroke();}},
  mid:{draw(c,x,y,s,key,f){if(rand(key+':on')<.82)return;const cx=x+rand(key+':x')*s,cy=y+rand(key+':y')*s,r=14+rand(key+':r')*18,a=f.still?0:f.t/(500-200*f.beat);
   c.fillStyle='#000';c.beginPath();c.arc(cx,cy,r,0,6.283);c.fill();c.strokeStyle=rgba(f.ink,.75);c.lineWidth=2;c.setLineDash?.([5,4]);c.lineDashOffset=-a*8;c.beginPath();c.ellipse(cx,cy,r+6,(r+6)*.45,.3,0,6.283);c.stroke();c.setLineDash?.([]);c.lineWidth=1;}},
  near:{draw(c,x,y,s,key,f){c.fillStyle=rgba(f.ink,.55);for(let i=0;i<4;i++){const p=f.still?.5:((f.t/6000+rand(key+':p'+i))%1),a=rand(key+':a'+i)*6.283+p*9,r=(1-p)*s*.5;c.fillRect(Math.round(x+s/2+Math.cos(a)*r),Math.round(y+s/2+Math.sin(a)*r),1,1);}}},
  sound:{kind:'hiss',band:120,q:2,gain:.006,bySpeed:.002}
 }
};
// Curved bands of a planetary ring, on the layer's plane so they continue across cells.
function band(c,x,y,s,f,gap,slide){const u0=f.ux,v0=f.uy;for(let k=Math.floor(v0/gap)-2;k<=Math.ceil((v0+s)/gap)+2;k++){c.beginPath();let started=false;for(let u=0;u<=s;u+=12){const wy=k*gap+Math.sin((u0+u+slide)/700)*30;if(wy<v0-2||wy>v0+s+2){started=false;continue;}const px=x+u,py=y+(wy-v0);started?c.lineTo(px,py):c.moveTo(px,py);started=true;}c.stroke();}}
// A triangular lattice on the layer's plane; each edge is drawn after style(px,py,k) sets its colour.
function lattice(c,x,y,s,f,gap,style){const h=gap*.866,j0=Math.floor(f.uy/h),j1=Math.ceil((f.uy+s)/h);let k=0;for(let j=j0;j<=j1;j++){const off=(j&1)*gap/2,i0=Math.floor((f.ux-off)/gap),i1=Math.ceil((f.ux+s-off)/gap);for(let i=i0;i<=i1;i++){const wx=i*gap+off,wy=j*h;if(wx<f.ux||wx>f.ux+s||wy<f.uy||wy>f.uy+s)continue;const px=x+(wx-f.ux),py=y+(wy-f.uy);
 style(px,py,k++);c.beginPath();c.moveTo(px,py);c.lineTo(px+gap,py);c.moveTo(px,py);c.lineTo(px+gap/2,py+h);c.moveTo(px,py);c.lineTo(px-gap/2,py+h);c.stroke();c.fillRect?.(Math.round(px),Math.round(py),1,1);}}}
// How far a point is pushed by the cube's recent path: the furrow it opens closes in about a second and a half.
export function partAt(px,py,trail,now,radius=70,push=18){let ox=0,oy=0;for(const p of trail){const age=(now-p.at)/1500;if(age>=1)continue;const dx=px-p.x,dy=py-p.y,d=Math.hypot(dx,dy);if(d<1||d>=radius)continue;const k=(1-d/radius)*(1-age)*push/d;ox+=dx*k;oy+=dy*k;}const m=Math.hypot(ox,oy);return m>push?[ox/m*push,oy/m*push]:[ox,oy];}
export function initialize(runtime){
 const trail=[];let lastTrail=0,air=null,airFor='',rest=0,lastPulse=-1e9;const stats={cells:0,regions:{}};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const ids=()=>runtime.BIOMES.map(b=>b.id);
 const regionAt=(x,y)=>ids()[runtime.biomeOfPos(x,y)]||'vacio';
 // The region's own air: one quiet looped noise, filtered, its gain far under the music.
 function sound(id,speed){const st=STYLES[id]?.sound,ac=runtime.ac;if(!ac||!runtime.bus||!runtime.S.sound){stopAir();return 0;}
  if(!st){stopAir();return 0;}if(!air||airFor!==id){stopAir();const len=ac.sampleRate*2,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);let seed=hash('air:'+id);for(let i=0;i<len;i++){seed=Math.imul(seed^seed>>>15,2246822519)>>>0;d[i]=seed/2147483648-1;}
   const src=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();src.buffer=buf;src.loop=true;f.type='bandpass';f.frequency.setValueAtTime(st.band,ac.currentTime);f.Q.setValueAtTime(st.q||.8,ac.currentTime);g.gain.setValueAtTime(.0001,ac.currentTime);src.connect(f);f.connect(g);g.connect(runtime.bus);src.start();air={src,g};airFor=id;}
  const v=Math.min(REGION_SOUND_MAX,st.gain+st.bySpeed*Math.min(1,speed));air.g.gain.setTargetAtTime(Math.max(.0001,v),ac.currentTime,.4);return v;}
 // Where we are in the bar (0..1) and which beat, from the scheduler's beat times.
 function barPhase(){const ac=runtime.ac,bq=runtime.MU?.bq;if(!ac||!bq?.length)return (performance.now()/2000)%1;const bar=(runtime.SIX||.15)*16,last=bq[bq.length-1];return (((ac.currentTime-last)/bar)%1+1)%1;}
 function beatCount(){const ac=runtime.ac,bq=runtime.MU?.bq;if(!ac||!bq?.length)return Math.floor(performance.now()/500);return Math.floor((ac.currentTime-bq[0])/((runtime.SIX||.15)*4));}
 function stopAir(){if(!air)return;const ac=runtime.ac;try{air.g.gain.setTargetAtTime(.0001,ac.currentTime,.3);air.src.stop(ac.currentTime+1.2);}catch(_){}air=null;airFor='';}
 function draw(t,b){
  const surface=runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie';if(!surface){stopAir();return;}
  const c=runtime.cx,W=runtime.W,H=runtime.H,camX=runtime.camX??runtime.S.wx,camY=runtime.camY??runtime.S.wy,still=calm(),beat=still?.3:b||0,now=performance.now();
  if(now-lastTrail>80){trail.push({x:runtime.S.wx,y:runtime.S.wy,at:now});lastTrail=now;if(trail.length>24)trail.shift();}
  // How long the cube has rested (Esporas open): 0 moving, 1 after about a second still.
  const speed=runtime.MU?.speed||0;rest=speed<12?Math.min(1,rest+.03):0;
  const screenTrail=still?[]:trail.map(p=>({x:W/2+(p.x-camX),y:H/2+(p.y-camY),at:p.at})),bar=barPhase(),beatIndex=beatCount();stats.cells=0;stats.regions={};c.save();c.globalAlpha=1;c.globalCompositeOperation="source-over";c.shadowBlur=0;
  for(const layer of ['far','mid','near']){const depth=LAYER_DEPTH[layer];
   // Cells live on a plane that moves at `depth` of the camera; the region of a cell is the one under its centre now.
   const size=LAYER_CELL[layer],ox=camX*depth-W/2,oy=camY*depth-H/2,i0=Math.floor(ox/size)-1,j0=Math.floor(oy/size)-1,i1=Math.ceil((ox+W)/size),j1=Math.ceil((oy+H)/size);
   for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const sx=i*size-ox,sy=j*size-oy,wx=camX+(sx+size/2-W/2),wy=camY+(sy+size/2-H/2),key=layer+':'+i+','+j,id=cellRegion(wx,wy,runtime.WCH||900,regionAt,key),st=STYLES[id]?.[layer];if(!st)continue;
    const f={t,beat,still,bar,beatIndex,ux:i*size,uy:j*size,rest,pulseAge:(now-lastPulse)/1000,cubeX:W/2+(runtime.S.wx-camX),cubeY:H/2+(runtime.S.wy-camY),ink:runtime.placeColor?runtime.placeColor(id,LANDSCAPES[id]||'#ffffff'):LANDSCAPES[id]||'#ffffff',wind:rand('wind:'+id+':'+Math.floor(wx/(runtime.WCH||900))+','+Math.floor(wy/(runtime.WCH||900)))*Math.PI*2,
     part:(px,py)=>layer!=='near'?[0,0]:partAt(px,py,screenTrail,now)};
    st.draw(c,sx,sy,size,id+':'+key,f);stats.cells++;stats.regions[id]=(stats.regions[id]||0)+1;}}
  // The cube's wake in regions that have one (Marea): rings spreading from where it passed.
  const hereId=regionAt(runtime.S.wx,runtime.S.wy);if(STYLES[hereId]?.wake&&!still){const ink=runtime.placeColor?runtime.placeColor(hereId,LANDSCAPES[hereId]):LANDSCAPES[hereId];c.lineWidth=1;
   for(const p of screenTrail.filter((_,i)=>i%5===0)){const age=(now-p.at)/1600;if(age>=1)continue;c.strokeStyle=rgba(ink,.4*(1-age));c.beginPath();c.arc(p.x,p.y,6+age*34,0,6.283);c.stroke();}}
  c.restore();
  sound(regionAt(runtime.S.wx,runtime.S.wy),Math.min(1,(runtime.MU?.speed||0)/200));}
 Object.defineProperties(runtime,{universePulse:{get:()=>()=>{lastPulse=performance.now();}},drawUniverseLayers:{get:()=>draw},universeLayers:{get:()=>()=>({cells:stats.cells,regions:{...stats.regions},air:airFor,airGain:air?air.g.gain.value:0})}});
}
