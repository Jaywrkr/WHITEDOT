import {pulseCrossed} from './pulse-forms.js';
const CELL=240,MAX_SITES=8192;
export const normalizeSparks=value=>Number.isFinite(value)?Math.min(Number.MAX_SAFE_INTEGER,Math.max(0,Math.floor(value))):0;
// Independent hashes never consume the world's random stream.
export function crystalField(wx,wy,seedOf){
 const out=[],gx=Math.floor(wx/CELL),gy=Math.floor(wy/CELL);
 for(let a=gx-2;a<=gx+2;a++)for(let b=gy-2;b<=gy+2;b++){
  const key=a+','+b,h=seedOf('crystals:v1:'+key)>>>0;
  if(h%5===0)continue;
  const count=1+(h%3);
  for(let i=0;i<count;i++){
   const n=seedOf('crystals:v1:'+key+':'+i)>>>0,size=1+(n%10<6?0:n%10<9?1:2);
   out.push({id:key+':'+i,x:a*CELL+45+(h>>>8)%130+i*24,y:b*CELL+45+(h>>>16)%130+(i%2)*26,size,value:[1,3,5][size-1]});
  }
 }return out;
}
export function initialize(runtime){
 let owner=null,scope='',sites=new Map(),seen=new WeakMap(),stale=new WeakSet(),near=[],seconds=0,shownUntil=0,gain=0,lastGain=0,cell='';
 const S=()=>runtime.S;
 const active=()=>runtime.inWorld()&&(S().layer||'superficie')==='superficie'&&!document.hidden&&!runtime.scanning&&!runtime.noticeLane?.inspecting&&!document.querySelector('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 const reduced=()=>!!(S().reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 function ensure(){
  const key=JSON.stringify(runtime.worldIdentity||{});
  if(owner!==S()||scope!==key){owner=S();scope=key;sites=new Map();seen=new WeakMap();stale=new WeakSet(runtime.waves||[]);near=[];cell='';gain=0;shownUntil=0;seconds=0;owner.sparks=normalizeSparks(owner.sparks);}
 }
 function tick(dt,paused=false){
  ensure();if(paused||!active())return;
  const step=Math.max(0,Math.min(.05,dt||0));seconds+=step;
  const key=Math.floor(S().wx/CELL)+','+Math.floor(S().wy/CELL);
  if(key!==cell){cell=key;near=crystalField(S().wx,S().wy,runtime.seedOf);}
  for(const o of near){
   let site=sites.get(o.id);
   if(!site&&sites.size>=MAX_SITES)continue;
   if(!site?.broken)for(const wave of runtime.waves||[]){
    if(stale.has(wave)||wave.origin!=='player'||!pulseCrossed(wave,o.x,o.y))continue;
    let hits=seen.get(wave);if(!hits){hits=new Set();seen.set(wave,hits);}if(hits.has(o.id))continue;hits.add(o.id);
    if(!site){site={hits:0,flash:0,broken:false,collected:false};sites.set(o.id,site);}
    site.hits++;site.flash=seconds+.18;
    if(site.hits>=o.size){site.broken=true;site.particles=Array.from({length:Math.min(3,o.value)},(_,i)=>({x:o.x+Math.cos(i*2.399)*12,y:o.y+Math.sin(i*2.399)*12}));break;}
   }
   if(site?.broken&&!site.collected&&!(runtime.autopilotState?.mode==='wander'&&!runtime.autopilotState.paused)&&Math.hypot(o.x-S().wx,o.y-S().wy)<70){
    let arrived=true;
    for(const p of site.particles){
     const dx=S().wx-p.x,dy=S().wy-p.y,d=Math.hypot(dx,dy),travel=step*180;
     if(d>3&&!reduced()){const k=Math.min(1,travel/d);p.x+=dx*k;p.y+=dy*k;if(d>travel+3)arrived=false;}
    }
    if(arrived){site.collected=true;S().sparks=normalizeSparks(S().sparks+o.value);gain=seconds-lastGain<1?gain+o.value:o.value;lastGain=seconds;shownUntil=seconds+3;runtime.save?.();}
   }
  }
 }
 function draw(){
  ensure();if(!active())return;
  const c=runtime.cx,ox=runtime.W/2-runtime.camX,oy=runtime.H/2-runtime.camY;
  c.save();c.lineWidth=1.2;
  for(const o of near){
   const site=sites.get(o.id),d=Math.hypot(o.x-S().wx,o.y-S().wy),opacity=runtime.worldOpacity?.(d)??Math.max(0,1-d/500);
   if(opacity<.01||(!site&&sites.size>=MAX_SITES))continue;
   c.globalAlpha=opacity;c.strokeStyle=c.fillStyle='#bddbe0';
   if(site?.broken){
    if(!site.collected){c.fillStyle='#e9ca7d';for(const p of site.particles)c.fillRect(p.x+ox-1.5,p.y+oy-1.5,3,3);}
    continue;
   }
   const x=o.x+ox,y=o.y+oy;
   if(site?.flash>seconds){c.strokeStyle='#fff';c.lineWidth=2;}else c.lineWidth=1.2;
   for(let i=0;i<o.size;i++){
    const px=x+(i-(o.size-1)/2)*6,h=9+(i%2)*4;
    c.beginPath();c.moveTo(px-3,y+4);c.lineTo(px-4,y-h+4);c.lineTo(px,y-h);c.lineTo(px+4,y-h+4);c.lineTo(px+3,y+4);c.closePath();c.stroke();
   }
   if(site?.hits){c.strokeStyle='#fff';c.beginPath();c.moveTo(x-4,y-5);c.lineTo(x+2,y-2);c.lineTo(x-1,y+2);if(site.hits>1)c.lineTo(x+5,y+3);c.stroke();}
   if(d<85){c.globalAlpha=opacity*.8;c.font='10px "Geist Mono",monospace';c.textAlign='center';c.fillText('Lanza un pulso',x,y+19);}
  }
  c.restore();
 }
 function drawHUD(){
  if(!active())return;const c=runtime.cx,visible=seconds<shownUntil;
  c.save();c.globalAlpha=visible?1:.3;c.fillStyle='#e9ca7d';c.font='12px "Geist Mono",monospace';c.textAlign='right';
  c.fillText('✦ '+normalizeSparks(S().sparks),runtime.W-18,48);
  if(visible){c.globalAlpha=Math.min(1,shownUntil-seconds);c.fillText('+'+gain,runtime.W-18,67);}c.restore();
 }
 Object.defineProperties(runtime,{crystalTick:{get:()=>tick},drawCrystals:{get:()=>draw},drawSparkHUD:{get:()=>drawHUD},crystalState:{get:()=>({total:normalizeSparks(S().sparks),sites:sites.size,near:near.map(o=>({...o,...sites.get(o.id)}))})}});
}
