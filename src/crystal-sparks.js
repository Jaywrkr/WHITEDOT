import {pulseCrossed} from './pulse-forms.js';
const CELL=200,MAX_SITES=8192;
export const normalizeSparks=value=>Number.isFinite(value)?Math.min(Number.MAX_SAFE_INTEGER,Math.max(0,Math.floor(value))):0;
// Regional abundance and an independent lattice keep clear gaps between crystals.
export function crystalField(wx,wy,seedOf){
 const out=[],gx=Math.floor(wx/CELL),gy=Math.floor(wy/CELL);
 for(let a=gx-3;a<=gx+3;a++)for(let b=gy-3;b<=gy+3;b++){
  const region=seedOf('crystals:density:v2:'+Math.floor(a/6)+','+Math.floor(b/6))>>>0;
  const density=region%10<3?.08:region%10<8?.28:.7,key=a+','+b,h=seedOf('crystals:site:v2:'+key)>>>0;
  if(h/4294967296>=density)continue;
  const n=seedOf('crystals:shape:v2:'+key)>>>0,size=1+(n%10<6?0:n%10<9?1:2);
  out.push({id:key,x:a*CELL+60+(h>>>8)%80,y:b*CELL+60+(h>>>16)%80,size,value:[1,3,5][size-1]});
 }return out;
}
export function pathCrystalField(px,pathY,day){
 const out=[],cell=Math.floor(px/160);
 for(let i=cell-4;i<=cell+4;i++){const x=i*160+90;out.push({id:'path:'+day+':'+i,x,y:pathY(x)+(i%2?18:-18),size:1,value:1});}return out;
}
export function initialize(runtime){
 let owner=null,scope='',sites=new Map(),seen=new WeakMap(),stale=new WeakSet(),near=[],seconds=0,shownUntil=0,gain=0,lastGain=0,cell='';
 const S=()=>runtime.S,position=()=>runtime.inWorld()?{x:S().wx,y:S().wy}:{x:S().px,y:S().py};
 const active=()=>(S().mode==='camino'||runtime.inWorld()&&(S().layer||'superficie')==='superficie')&&!document.hidden&&!runtime.scanning&&!runtime.noticeLane?.inspecting&&!document.querySelector('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 const reduced=()=>!!(S().reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 function ensure(){
  const key=JSON.stringify(runtime.worldIdentity||{})+':'+S().todayKey;
  if(owner!==S()||scope!==key){owner=S();scope=key;sites=new Map();seen=new WeakMap();stale=new WeakSet(runtime.waves||[]);near=[];cell='';gain=0;shownUntil=0;seconds=0;owner.sparks=normalizeSparks(owner.sparks);owner.pathCrystals||=[];}
 }
 function tick(dt,paused=false){
  ensure();if(paused||!active())return;
  const step=Math.max(0,Math.min(.05,dt||0));seconds+=step;
  const pos=position(),path=S().mode==='camino',key=path?'path:'+S().todayKey+':'+Math.floor(pos.x/160):'world:'+Math.floor(pos.x/CELL)+','+Math.floor(pos.y/CELL);
  if(key!==cell){cell=key;near=path?pathCrystalField(pos.x,runtime.pathY,S().todayKey):crystalField(pos.x,pos.y,runtime.seedOf);}
  let completed=false;
  for(const o of near){
   if(path&&S().pathCrystals.length>=10)break;
   if(path&&S().pathCrystals.includes(o.id)&&!sites.has(o.id))continue;
   if(runtime.crystalTransaction){const before=S().pathCrystals.length;processSaved(o,path,step,pos);if(path&&before<10&&S().pathCrystals.length===10)completed=true;continue;}
   let site=sites.get(o.id);
   if(!site&&sites.size>=MAX_SITES)continue;
   if(!site?.broken)for(const wave of runtime.waves||[]){
    if(stale.has(wave)||wave.origin!=='player'||!pulseCrossed(wave,o.x,o.y))continue;
    let hits=seen.get(wave);if(!hits){hits=new Set();seen.set(wave,hits);}if(hits.has(o.id))continue;hits.add(o.id);
    if(!site){site={hits:0,flash:0,broken:false,collected:false};sites.set(o.id,site);}
    site.hits++;site.flash=seconds+.18;
    if(site.hits>=o.size){site.broken=true;if(path){if(!S().pathCrystals.length)runtime.onFirstLight?.();S().pathCrystals.push(o.id);completed=S().pathCrystals.length===10;S().todayLight=(S().todayLight||0)+1;S().totalLight=(S().totalLight||0)+1;earn(o.value);site.rewarded=true;runtime.hud?.();}
     site.particles=Array.from({length:Math.min(3,o.value)},(_,i)=>({x:o.x+Math.cos(i*2.399)*12,y:o.y+Math.sin(i*2.399)*12}));break;}
   }
   if(site?.broken&&!site.collected&&!(runtime.autopilotState?.mode==='wander'&&!runtime.autopilotState.paused)&&Math.hypot(o.x-pos.x,o.y-pos.y)<70){
    let arrived=true;
    for(const p of site.particles){
     const dx=pos.x-p.x,dy=pos.y-p.y,d=Math.hypot(dx,dy),travel=step*180;
     if(d>3&&!reduced()){const k=Math.min(1,travel/d);p.x+=dx*k;p.y+=dy*k;if(d>travel+3)arrived=false;}
    }
    if(arrived){site.collected=true;if(!site.rewarded)earn(o.value);}
   }
  }
  if(completed){runtime.waves=[];runtime.ptr=null;runtime.enterWorld?.({automatic:true});near=[];cell='';}
 }
 function processSaved(o,path,step,pos){
  let site=sites.get(o.id),stored=runtime.savedCrystal(o.id);
  if(!site&&stored){site={...stored};sites.set(o.id,site);}
  for(const wave of runtime.waves||[]){
   if(stale.has(wave)||wave.origin!=='player'||!pulseCrossed(wave,o.x,o.y))continue;
   let hits=seen.get(wave);if(!hits){hits=new Set();seen.set(wave,hits);}if(hits.has(o.id))continue;hits.add(o.id);
   if(site?.broken){runtime.inspectSpentCrystal?.(o.id);continue;}
   const next=runtime.crystalTransaction(o,'hit',path);if(!next)continue;
   site={...next,flash:seconds+.18};if(site.broken)site.particles=Array.from({length:Math.min(3,o.value)},(_,i)=>({x:o.x+Math.cos(i*2.399)*12,y:o.y+Math.sin(i*2.399)*12}));sites.set(o.id,site);
  }
  if(!site?.broken||site.collected)return;
  site.particles||=Array.from({length:Math.min(3,o.value)},(_,i)=>({x:o.x+Math.cos(i*2.399)*12,y:o.y+Math.sin(i*2.399)*12}));
  if(runtime.autopilotState?.mode==='wander'&&!runtime.autopilotState.paused||Math.hypot(o.x-pos.x,o.y-pos.y)>=70)return;
  let arrived=true;for(const p of site.particles){const dx=pos.x-p.x,dy=pos.y-p.y,d=Math.hypot(dx,dy),travel=step*180;if(d>3&&!reduced()){const k=Math.min(1,travel/d);p.x+=dx*k;p.y+=dy*k;if(d>travel+3)arrived=false;}}
  if(arrived){const next=runtime.crystalTransaction(o,'collect',path);if(next?.collected)site.collected=true;}
 }
 function earn(value){S().sparks=normalizeSparks(S().sparks+value);gain=seconds-lastGain<1?gain+value:value;lastGain=seconds;shownUntil=seconds+3;runtime.save?.();}
 function draw(){
  ensure();if(!active())return;
  const c=runtime.cx,pos=position(),ox=runtime.W/2-runtime.camX,oy=runtime.H/2-runtime.camY;
  c.save();c.lineWidth=1.2;
  for(const o of near){
   if(S().mode==='camino'&&S().pathCrystals.includes(o.id)&&!sites.has(o.id))continue;
   const site=sites.get(o.id),d=Math.hypot(o.x-pos.x,o.y-pos.y),opacity=runtime.worldOpacity?.(d)??Math.max(0,1-d/500);
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
    c.beginPath();c.moveTo(px-3,y+4);c.lineTo(px-4,y-h+4);c.lineTo(px,y-h);c.lineTo(px+4,y-h+4);c.lineTo(px+3,y+4);c.closePath();c.globalAlpha=opacity*.13;c.fill();c.globalAlpha=opacity;c.stroke();
    c.globalAlpha=opacity*.5;c.beginPath();c.moveTo(px,y-h);c.lineTo(px+1,y-h+5);c.lineTo(px,y+4);c.moveTo(px-4,y-h+4);c.lineTo(px+1,y-h+5);c.lineTo(px+4,y-h+4);c.stroke();c.globalAlpha=opacity;
   }
   if(site?.hits){c.strokeStyle='#fff';c.beginPath();c.moveTo(x-4,y-5);c.lineTo(x+2,y-2);c.lineTo(x-1,y+2);if(site.hits>1)c.lineTo(x+5,y+3);c.stroke();}
   if(d<85){c.globalAlpha=opacity*.8;c.font='10px "Geist Mono",monospace';c.textAlign='center';c.fillText('Lanza un pulso',x,y+19);}
  }
  c.restore();
 }
 function drawHUD(){
  if(runtime.drawSparkEconomyHUD)return;
  const counter=runtime.$?.('sparkCount'),total=runtime.$?.('sparkTotal'),delta=runtime.$?.('sparkGain');if(!counter||!total||!delta)return;
  counter.hidden=!['camino','world'].includes(S().mode);total.textContent='✦ '+normalizeSparks(S().sparks);
  const visible=seconds<shownUntil;counter.classList.toggle('collecting',visible);delta.textContent=visible?'+'+gain:'';
 }
 Object.defineProperties(runtime,{crystalTick:{get:()=>tick},drawCrystals:{get:()=>draw},drawSparkHUD:{get:()=>drawHUD},crystalState:{get:()=>({total:normalizeSparks(S().sparks),sites:sites.size,near:near.map(o=>({...o,...sites.get(o.id)}))})}});
}
