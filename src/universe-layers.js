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
 }
};
// How far a point is pushed by the cube's recent path: the furrow it opens closes in about a second and a half.
export function partAt(px,py,trail,now,radius=70,push=18){let ox=0,oy=0;for(const p of trail){const age=(now-p.at)/1500;if(age>=1)continue;const dx=px-p.x,dy=py-p.y,d=Math.hypot(dx,dy);if(d<1||d>=radius)continue;const k=(1-d/radius)*(1-age)*push/d;ox+=dx*k;oy+=dy*k;}const m=Math.hypot(ox,oy);return m>push?[ox/m*push,oy/m*push]:[ox,oy];}
export function initialize(runtime){
 const trail=[];let lastTrail=0,air=null,airFor='';const stats={cells:0,regions:{}};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const ids=()=>runtime.BIOMES.map(b=>b.id);
 const regionAt=(x,y)=>ids()[runtime.biomeOfPos(x,y)]||'vacio';
 // The region's own air: one quiet looped noise, filtered, its gain far under the music.
 function sound(id,speed){const st=STYLES[id]?.sound,ac=runtime.ac;if(!ac||!runtime.bus||!runtime.S.sound){stopAir();return 0;}
  if(!st){stopAir();return 0;}if(!air||airFor!==id){stopAir();const len=ac.sampleRate*2,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);let seed=hash('air:'+id);for(let i=0;i<len;i++){seed=Math.imul(seed^seed>>>15,2246822519)>>>0;d[i]=seed/2147483648-1;}
   const src=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();src.buffer=buf;src.loop=true;f.type='bandpass';f.frequency.setValueAtTime(st.band,ac.currentTime);f.Q.setValueAtTime(.8,ac.currentTime);g.gain.setValueAtTime(.0001,ac.currentTime);src.connect(f);f.connect(g);g.connect(runtime.bus);src.start();air={src,g};airFor=id;}
  const v=Math.min(REGION_SOUND_MAX,st.gain+st.bySpeed*Math.min(1,speed));air.g.gain.setTargetAtTime(Math.max(.0001,v),ac.currentTime,.4);return v;}
 function stopAir(){if(!air)return;const ac=runtime.ac;try{air.g.gain.setTargetAtTime(.0001,ac.currentTime,.3);air.src.stop(ac.currentTime+1.2);}catch(_){}air=null;airFor='';}
 function draw(t,b){
  const surface=runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie';if(!surface){stopAir();return;}
  const c=runtime.cx,W=runtime.W,H=runtime.H,camX=runtime.camX??runtime.S.wx,camY=runtime.camY??runtime.S.wy,still=calm(),beat=still?.3:b||0,now=performance.now();
  if(now-lastTrail>80){trail.push({x:runtime.S.wx,y:runtime.S.wy,at:now});lastTrail=now;if(trail.length>24)trail.shift();}
  const screenTrail=still?[]:trail.map(p=>({x:W/2+(p.x-camX),y:H/2+(p.y-camY),at:p.at}));stats.cells=0;stats.regions={};c.save();c.globalAlpha=1;c.globalCompositeOperation="source-over";c.shadowBlur=0;
  for(const layer of ['far','mid','near']){const depth=LAYER_DEPTH[layer];
   // Cells live on a plane that moves at `depth` of the camera; the region of a cell is the one under its centre now.
   const size=LAYER_CELL[layer],ox=camX*depth-W/2,oy=camY*depth-H/2,i0=Math.floor(ox/size)-1,j0=Math.floor(oy/size)-1,i1=Math.ceil((ox+W)/size),j1=Math.ceil((oy+H)/size);
   for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const sx=i*size-ox,sy=j*size-oy,wx=camX+(sx+size/2-W/2),wy=camY+(sy+size/2-H/2),key=layer+':'+i+','+j,id=cellRegion(wx,wy,runtime.WCH||900,regionAt,key),st=STYLES[id]?.[layer];if(!st)continue;
    const f={t,beat,still,ink:runtime.placeColor?runtime.placeColor(id,LANDSCAPES[id]||'#ffffff'):LANDSCAPES[id]||'#ffffff',wind:rand('wind:'+id+':'+Math.floor(wx/(runtime.WCH||900))+','+Math.floor(wy/(runtime.WCH||900)))*Math.PI*2,
     part:(px,py)=>layer!=='near'?[0,0]:partAt(px,py,screenTrail,now)};
    st.draw(c,sx,sy,size,id+':'+key,f);stats.cells++;stats.regions[id]=(stats.regions[id]||0)+1;}}
  c.restore();
  sound(regionAt(runtime.S.wx,runtime.S.wy),Math.min(1,(runtime.MU?.speed||0)/200));}
 Object.defineProperties(runtime,{drawUniverseLayers:{get:()=>draw},universeLayers:{get:()=>()=>({cells:stats.cells,regions:{...stats.regions},air:airFor,airGain:air?air.g.gain.value:0})}});
}
