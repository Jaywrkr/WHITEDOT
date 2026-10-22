import {prefersReducedMotion} from './frame-state.js';
import {LANDSCAPES} from './house-view.js';
// The Journey, phase 3: the World as a sheet. Each biome gets a light that breathes with the beat and two layers of
// large, faint silhouettes with slow parallax, so the screen has mass and a horizon. In the Journey the colour is
// earned: a biome stays pale until you complete the cube's theme on time there, then its colour comes back for good.
// Shapes come from a hash of the biome and the tile, never from the game's random sequence.
export function hash(text){let h=2166136261;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export const rand=(key)=>hash(key)/4294967296;
// Layers: how far they sit (parallax factor), where their base is and how tall they get, as fractions of the screen.
export const LAYERS=Object.freeze([{depth:.05,base:.74,tall:.22,tile:240,alpha:.06},{depth:.14,base:.9,tall:.3,tile:170,alpha:.1}].map(Object.freeze));
const rgba=(hex,a)=>{const n=parseInt(hex.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;};
// One silhouette, its base centred on (x,y), w wide and h tall, filled faintly and outlined a little stronger.
export function silhouette(c,shape,x,y,w,h,ink,alpha,seed,t,calm){
 c.fillStyle=rgba(ink,alpha);c.strokeStyle=rgba(ink,Math.min(1,alpha*2.4));c.lineWidth=1;const r=k=>rand(seed+':'+k);c.beginPath();
 if(shape==='hills'||shape==='dunes'){const k=shape==='dunes'?.45:1;c.moveTo(x-w*.8,y);c.bezierCurveTo(x-w*.4,y-h*k*(.6+r(1)*.4),x+w*.4,y-h*k*(.6+r(2)*.4),x+w*.8,y);c.lineTo(x-w*.8,y);}
 else if(shape==='trees'){const n=2+Math.floor(r(1)*3);for(let i=0;i<n;i++){const tx=x+(i-(n-1)/2)*w*.35,th=h*(.6+r(i+2)*.4);c.moveTo(tx-w*.12,y);c.lineTo(tx,y-th);c.lineTo(tx+w*.12,y);c.closePath();}}
 else if(shape==='water'){c.rect(x-w*.8,y-h*.08,w*1.6,h*.08);for(let i=0;i<3;i++)c.rect(x-w*(.5-i*.2),y+h*(.06+i*.06),w*(.6-i*.15),1);}
 else if(shape==='columns'){const n=1+Math.floor(r(1)*3);for(let i=0;i<n;i++){const cx=x+(i-(n-1)/2)*w*.4,ch=h*(.5+r(i+3)*.5)*(r(i+7)<.3?.6:1);c.rect(cx-w*.06,y-ch,w*.12,ch);c.rect(cx-w*.1,y-ch-h*.03,w*.2,h*.03);}}
 else if(shape==='stems'){const n=4+Math.floor(r(1)*4);for(let i=0;i<n;i++){const sx=x+(i-(n-1)/2)*w*.14,sh=h*(.3+r(i+2)*.5),sway=calm?0:Math.sin(t/1400+i)*3;c.moveTo(sx,y);c.quadraticCurveTo(sx+sway,y-sh*.5,sx+sway*1.5,y-sh);c.arc(sx+sway*1.5,y-sh,w*.025,0,6.283);}}
 else if(shape==='crystals'){const n=1+Math.floor(r(1)*3);for(let i=0;i<n;i++){const cx=x+(i-(n-1)/2)*w*.3,ch=h*(.5+r(i+2)*.5),cw=w*.12;c.moveTo(cx-cw,y);c.lineTo(cx-cw*.6,y-ch*.8);c.lineTo(cx,y-ch);c.lineTo(cx+cw*.6,y-ch*.8);c.lineTo(cx+cw,y);c.closePath();}}
 else if(shape==='towers'){if(r(1)<.55){c.rect(x-w*.05,y-h,w*.1,h);c.rect(x-w*.08,y-h-h*.06,w*.16,h*.06);}}
 else if(shape==='clouds'){const cy=y-h*1.4;for(let i=0;i<3;i++){c.moveTo(x+(i-1)*w*.3+w*.2,cy);c.arc(x+(i-1)*w*.3,cy+(i%2)*h*.05,w*.2,0,6.283);}}
 else if(shape==='caves'){const top=y-h*2.6;c.moveTo(x-w*.6,top);for(let i=0;i<=6;i++){const sx=x-w*.6+i*w*.2;c.lineTo(sx+w*.1,top+h*(.2+r(i+1)*.5));c.lineTo(sx+w*.2,top);}}
 else return;
 c.fill();c.stroke();
}
const SHAPES={llanura:'hills',bosque:'trees',lago:'water',ruinas:'columns',jardin:'stems',dunas:'dunes',cristales:'crystals',faros:'towers',tormenta:'clouds',cueva:'caves',vacio:null};
export const shapeOf=id=>Object.hasOwn(SHAPES,id)?SHAPES[id]:'hills';
// The colours recovered in the Journey: kept as biome ids.
export function normalizeColors(raw){const out={};if(raw&&typeof raw==='object'&&!Array.isArray(raw))for(const [k,v]of Object.entries(raw))if(v&&typeof k==='string'&&k.length<40)out[k]=true;return out;}
export function initialize(runtime){
 let owner=null,filter='',last=null;const reencuentro={at:-1e9,id:null};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 // The recovered colours live in S.journey.colors (seeded at load from explored biomes, see journey-mode.js).
 function colors(){const j=runtime.S.journey;if(!j||typeof j!=='object')return {};if(owner!==runtime.S||!j.colors){owner=runtime.S;j.colors=normalizeColors(j.colors);}return j.colors;}
 const biomeId=()=>runtime.BIOMES?.[Math.max(0,runtime.curZone)]?.id||'llanura';
 const pale=()=>runtime.journeyQuiet?.()&&runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie'&&!colors()[biomeId()];
 // Completing the theme on time gives the colour of the place back.
 function recover(){if(!runtime.journeyQuiet?.()||!runtime.inWorld?.())return false;const id=biomeId(),c=colors();if(c[id])return false;c[id]=true;if(runtime.save()===false){delete c[id];return false;}reencuentro.at=performance.now();reencuentro.id=id;runtime.enterFx=Math.max(runtime.enterFx||0,1);return true;}
 function applyFilter(){const want=pale()?'saturate(.12) brightness(.92)':'';if(want!==filter){filter=want;const cv=runtime.$('w');if(cv){cv.style.transition='filter 1.6s ease';cv.style.filter=want;}}}
 function draw(t,b){
  applyFilter();if(!runtime.inWorld?.()||(runtime.S.layer||'superficie')!=='superficie')return;const c=runtime.cx,W=runtime.W,H=runtime.H,id=biomeId(),ink=LANDSCAPES[id]||'#ffffff',still=calm(),beat=still?.4:b||0,shape=shapeOf(id);
  c.save();
  // The biome's light, breathing with the beat.
  const g=c.createRadialGradient(W*.5,H*.62,0,W*.5,H*.62,Math.max(W,H)*.75);g.addColorStop(0,rgba(ink,.05+.07*beat));g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=1;c.fillStyle=g;c.fillRect(0,0,W,H);
  if(shape)for(const [li,L] of LAYERS.entries()){const tile=Math.max(L.tile,W/4),off=(runtime.camX||0)*L.depth,first=Math.floor(off/tile)-1,count=Math.ceil(W/tile)+2;
   for(let i=first;i<first+count;i++){const key=id+':'+li+':'+i;if(rand(key+':skip')<.25)continue;const x=i*tile-off+tile*(.3+rand(key+':x')*.4),y=H*L.base-(runtime.camY||0)*L.depth*.2,w=tile*(.6+rand(key+':w')*.5),h=H*L.tall*(.5+rand(key+':h')*.5);
    silhouette(c,shape,x,y,w,h,ink,L.alpha,key,t,still);}}
  c.restore();last=id;}
 Object.defineProperties(runtime,{drawWorldSheet:{get:()=>draw},journeyColors:{get:()=>()=>({...colors()})},recoverJourneyColor:{get:()=>recover},worldSheetState:{get:()=>()=>({biome:biomeId(),pale:!!pale(),filter,reencuentro:{...reencuentro}})}});
}
