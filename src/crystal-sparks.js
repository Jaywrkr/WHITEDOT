import {openSurface,prefersReducedMotion} from './frame-state.js';
import {crystalPlay,crystalFragments,moveEscape,CRYSTAL_CHAIN_RADIUS,CRYSTAL_CHAIN_LIMIT} from './crystal-play-model.js';
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
  const o={id:key,x:a*CELL+60+(h>>>8)%80,y:b*CELL+60+(h>>>16)%80,size,value:[1,3,5][size-1]};out.push({...o,...crystalPlay(o,seedOf)});
 }return out;
}
// In the Journey's Camino a crystal answers only a pulse on time, and each pulse breaks one: the nearest it reaches
// (phase 2 of the plan). Without music playing (sound off, audio not started) there is no beat to meet, so any pulse
// breaks one. The free Camino keeps breaking whatever the wave crosses.
export const pathWaveCounts=(wave,journey,timed=true)=>!journey||(wave.beat===true||!timed)&&!wave.spent;
export function pathCrystalField(px,pathY,day){
 const out=[],cell=Math.floor(px/160);
 for(let i=cell-4;i<=cell+4;i++){const x=i*160+90;out.push({id:'path:'+day+':'+i,x,y:pathY(x)+(i%2?18:-18),size:1,value:1});}return out;
}
export function initialize(runtime){
 let owner=null,scope='',sites=new Map(),seen=new WeakMap(),stale=new WeakSet(),near=[],seconds=0,shownUntil=0,gain=0,lastGain=0,cell='',chains=[],feedback=[];
 const S=()=>runtime.S,position=()=>runtime.inWorld()?{x:S().wx,y:S().wy}:{x:S().px,y:S().py};
 // Sparks belong to the free World (decision of 23 October): in the Journey the Camino's crystals give light but no
 // sparks, and the World's crystals are not there, so a pulse in a chapter only touches what the chapter asks for.
 const active=()=>(S().mode==='camino'||runtime.inWorld()&&(S().layer||'superficie')==='superficie'&&!runtime.journeyQuiet?.()&&!runtime.placeRun?.())&&!document.hidden&&!runtime.scanning&&!runtime.noticeLane?.inspecting&&!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 const reduced=()=>!!(S().reducedMotion||prefersReducedMotion());
 const journeyPath=()=>S().mode==='camino'&&!!runtime.journeyQuiet?.();
 const timed=()=>S().sound!==false;
 // A pulse off the beat in the Journey's Camino reaches the crystal but does not break it: it shivers, so the player
 // sees it was touched and learns it wants the beat. Crystals there also brighten on every beat.
 const missed=new Map();let misses=0;
 function miss(o,wave){let hits=seen.get(wave);if(!hits){hits=new Set();seen.set(wave,hits);}if(hits.has(o.id))return;hits.add(o.id);if(wave.spent||sites.get(o.id)?.broken)return;missed.set(o.id,seconds+.3);misses++;}
 function beatGlow(){if(!journeyPath()||!timed()||reduced()||!runtime.ac||!runtime.MU?.bq?.length)return 0;const ac=runtime.ac,bq=runtime.MU.bq;let last=-Infinity;for(const b of bq)if(b<=ac.currentTime)last=Math.max(last,b);return Math.max(0,1-(ac.currentTime-last)/((runtime.SIX||.15)*2));}
 function ensure(){
  const key=JSON.stringify(runtime.worldIdentity||{})+':'+S().todayKey;
  if(owner!==S()||scope!==key){owner=S();scope=key;sites=new Map();seen=new WeakMap();stale=new WeakSet(runtime.waves||[]);near=[];cell='';gain=0;shownUntil=0;seconds=0;chains=[];feedback=[];owner.sparks=normalizeSparks(owner.sparks);owner.pathCrystals||=[];}
 }
 function tick(dt,paused=false){
  ensure();if(paused||!active())return;
  const step=Math.max(0,Math.min(.05,dt||0));seconds+=step;feedback=feedback.filter(p=>seconds-p.at<.48);
  const pos=position(),path=S().mode==='camino',key=path?'path:'+S().todayKey+':'+Math.floor(pos.x/160):'world:'+Math.floor(pos.x/CELL)+','+Math.floor(pos.y/CELL);
  if(key!==cell){cell=key;near=path?pathCrystalField(pos.x,runtime.pathY,S().todayKey):crystalField(pos.x,pos.y,runtime.seedOf);}
  let completed=false;
  for(const o of near){
   if(path&&S().pathCrystals.includes(o.id)&&!sites.has(o.id))continue;
   if(runtime.crystalTransaction){const before=S().pathCrystals.length;processSaved(o,path,step,pos);if(path&&before<10&&S().pathCrystals.length===10)completed=true;continue;}
   let site=sites.get(o.id);
   if(!site&&sites.size>=MAX_SITES)continue;
   if(!site?.broken)for(const wave of runtime.waves||[]){
    if(stale.has(wave)||wave.origin!=='player'||!pulseCrossed(wave,o.x,o.y))continue;if(path&&!pathWaveCounts(wave,journeyPath(),timed())){miss(o,wave);continue;}
    let hits=seen.get(wave);if(!hits){hits=new Set();seen.set(wave,hits);}if(hits.has(o.id))continue;hits.add(o.id);if(path)wave.spent=true;
    if(!site){site={hits:0,flash:0,broken:false,collected:false};sites.set(o.id,site);}
    site.hits++;site.flash=seconds+.18;if(site.hits<o.size)impact(o,site);
    if(site.hits>=o.size){site.broken=true;if(path){if(S().pathCrystals.length<10){if(!S().pathCrystals.length)runtime.onFirstLight?.();S().pathCrystals.push(o.id);completed=S().pathCrystals.length===10;S().todayLight=(S().todayLight||0)+1;S().totalLight=(S().totalLight||0)+1;earn(o.value);}site.rewarded=true;runtime.hud?.();}
     site.particles=particles(o,{rare:false});impact(o,site);break;}
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
  if(!path&&runtime.crystalTransaction)tickChains();
  if(completed){runtime.waves=[];runtime.ptr=null;runtime.enterWorld?.({automatic:true});near=[];cell='';feedback=[];}
 }
 function impact(o,site,point=o){if(reduced())return;feedback.push({x:point.x,y:point.y,at:seconds,broken:site.broken,size:o.size});feedback=feedback.slice(-48);}
 function particles(o,site){return crystalFragments(o,site.rare===true).map(p=>({...p,x:(site.drop?.x??o.x)+Math.cos(p.index*2.399)*14,y:(site.drop?.y??o.y)+Math.sin(p.index*2.399)*14,home:site.drop||o,age:0,trail:[]}));}
 function hit(o,path,source=null,mult=1){
  const prior=sites.get(o.id)||runtime.savedCrystal(o.id);if(prior?.broken)return false;
  const before=S().sparks,next=runtime.crystalTransaction(o,'hit',path,null,false,source?.mult??mult);if(!next)return false;
  const site={...prior,...next,flash:seconds+.25};impact(o,site,prior?.run||o);
  if(o.runner&&!path&&!prior?.hits&&!site.broken){site.run={x:o.x,y:o.y,age:0,trail:[]};}
  if(site.broken){site.drop=site.run?{x:site.run.x,y:site.run.y}:o;site.run=null;site.particles=particles(o,site);if(!path){const chain=source||{hit:new Set([o.id]),budget:CRYSTAL_CHAIN_LIMIT,mult};chain.broken=(chain.broken||0)+1;chains.push({x:prior?.run?.x??o.x,y:prior?.run?.y??o.y,at:seconds,chain});chains=chains.slice(-12);}}
  sites.set(o.id,site);if(S().sparks>before)runtime.showSparkPickup?.(S().sparks-before,position(),source?.mult||mult);return true;
 }
 function tickChains(){
  // A bounded delayed front makes neighbouring breaks readable; chains never create musical pulses.
  for(const wave of [...chains]){
   const age=seconds-wave.at;if(age>.65||wave.done)continue;const radius=Math.min(CRYSTAL_CHAIN_RADIUS,age*900),chain=wave.chain;
   const targets=near.filter(o=>!chain.hit.has(o.id)&&Math.hypot((sites.get(o.id)?.run?.x??o.x)-wave.x,(sites.get(o.id)?.run?.y??o.y)-wave.y)<=radius).sort((a,b)=>Math.hypot(a.x-wave.x,a.y-wave.y)-Math.hypot(b.x-wave.x,b.y-wave.y));
   for(const o of targets){if(chain.budget<=0)break;chain.hit.add(o.id);if(sites.get(o.id)?.broken||runtime.savedCrystal(o.id)?.broken)continue;chain.budget--;hit(o,false,chain);}
   if(radius===CRYSTAL_CHAIN_RADIUS)wave.done=true;
  }
  chains=chains.filter(w=>seconds-w.at<.65);
 }
 function processSaved(o,path,step,pos){
  let site=sites.get(o.id),stored=runtime.savedCrystal(o.id);
  if(!site&&stored){site={...stored};sites.set(o.id,site);}
  if(site?.run){const old={x:site.run.x,y:site.run.y};site.run.age+=step;if(!reduced()&&!(runtime.autopilotState?.mode==='wander'&&!runtime.autopilotState.paused))Object.assign(site.run,moveEscape(site.run,o,pos,step,site.run.age));if(Math.hypot(site.run.x-old.x,site.run.y-old.y)>1){site.run.trail.push(old);site.run.trail=site.run.trail.slice(-6);}else site.run.trail=site.run.trail.slice(1);}
  const point=site?.run||o;
  for(const wave of runtime.waves||[]){
   if(stale.has(wave)||wave.origin!=='player'||!pulseCrossed(wave,point.x,point.y))continue;if(path&&!pathWaveCounts(wave,journeyPath(),timed())){miss(o,wave);continue;}
   let hits=seen.get(wave);if(!hits){hits=new Set();seen.set(wave,hits);}if(hits.has(o.id))continue;hits.add(o.id);
   if(site?.broken){runtime.inspectSpentCrystal?.(o.id);continue;}
   if(path)wave.spent=true;hit(o,path,null,wave.mult??1);site=sites.get(o.id);
  }
  if(!site?.broken||site.collected)return;
  site.particles||=particles(o,site);
  if(runtime.autopilotState?.mode==='wander'&&!runtime.autopilotState.paused)return;
  for(const p of site.particles){
   if((site.fragments||0)&(1<<p.index))continue;
   p.age+=step;const old={x:p.x,y:p.y};
   // A rare fragment runs for five seconds; caught while it runs it keeps its bonus, after that it dims to 1.
   if(p.rare&&!reduced())Object.assign(p,moveEscape(p,p.home,pos,step,p.age,180,120,5));
   const dx=pos.x-p.x,dy=pos.y-p.y,d=Math.hypot(dx,dy),reach=(p.rare&&!reduced()?32:70)*(runtime.cubeShopMagnet?.()||1);
   // Common fragments retain their original collection radius; rare ones invite a short chase.
   if(d<reach){
    const travel=step*180;if(!reduced()&&d>3){const k=Math.min(1,travel/d);p.x+=dx*k;p.y+=dy*k;}
    if(d<=travel+3||reduced()){
     const before=S().sparks,next=runtime.crystalTransaction(o,'collect',path,p.index,p.rare&&!reduced()&&p.age>5);
     if(next){Object.assign(site,next);if(S().sparks>before)runtime.showSparkPickup?.(S().sparks-before,{x:p.x,y:p.y},next.mult||1);}
    }
   }
   if(!reduced()&&Math.hypot(p.x-old.x,p.y-old.y)>.3){p.trail.push(old);p.trail=p.trail.slice(-5);}else p.trail=p.trail.slice(1);
  }
 }
 function earn(value){if(runtime.journeyQuiet?.())return;S().sparks=normalizeSparks(S().sparks+value);gain=seconds-lastGain<1?gain+value:value;lastGain=seconds;shownUntil=seconds+3;runtime.save?.();}
 function draw(){
  ensure();if(!active())return;
  const c=runtime.cx,pos=position(),ox=runtime.W/2-runtime.camX,oy=runtime.H/2-runtime.camY;
  c.save();c.lineWidth=1.2;
  for(const o of near){
   if(S().mode==='camino'&&S().pathCrystals.includes(o.id)&&!sites.has(o.id))continue;
   const site=sites.get(o.id),d=Math.hypot(o.x-pos.x,o.y-pos.y),opacity=runtime.worldOpacity?.(d)??Math.max(0,1-d/500);
   if(opacity<.01||(!site&&sites.size>=MAX_SITES))continue;
   c.globalAlpha=opacity;c.strokeStyle=c.fillStyle='#d3eef2';
   if(site?.broken){
    if(!site.collected)for(const p of site.particles||[]){
     if((site.fragments||0)&(1<<p.index))continue;
     const x=p.x+ox,y=p.y+oy+(reduced()?0:Math.sin(seconds*2+p.index)*2),dim=p.rare&&!reduced()&&p.age>5,ink=dim?'#7f8d92':p.rare?'#77e8ff':'#e9ca7d';
     c.fillStyle=c.strokeStyle=ink;for(let i=0;i<(p.trail?.length||0);i++){c.globalAlpha=opacity*.15*(i+1)/p.trail.length;c.fillRect(p.trail[i].x+ox-1,p.trail[i].y+oy-1,2,2);}
     c.globalAlpha=opacity*.3;c.beginPath();c.arc(x,y,p.rare?12:10,0,Math.PI*2);c.fill();
     c.globalAlpha=opacity*(reduced()?1:.85+.15*Math.sin(seconds*2));c.beginPath();c.moveTo(x,y-6);c.lineTo(x+4,y);c.lineTo(x,y+6);c.lineTo(x-4,y+1);c.closePath();c.fill();c.fillStyle='#fff';c.fillRect(x-1,y-2,2,3);
     if(p.rare){c.lineWidth=1;c.beginPath();c.moveTo(x+5,y-8);c.lineTo(x+5,y-3);c.moveTo(x+2.5,y-5.5);c.lineTo(x+7.5,y-5.5);c.stroke();if(d<130){c.font='11px "Geist Mono",monospace';c.textAlign='center';c.fillText('+'+(dim?1:p.value)+' ✦',x,y-15);}}
    }
    continue;
   }
   const flash=Math.max(site?.flash||0,missed.get(o.id)||0),recoil=!reduced()&&flash>seconds?Math.sin((flash-seconds)*55)*(flash-seconds)/.25:0,glow=beatGlow();
   const x=(site?.run?.x??o.x)+ox+recoil*1.8,y=(site?.run?.y??o.y)+oy+Math.abs(recoil)*.6;
   if(site?.run){if(!reduced()){c.fillStyle='#d3eef2';for(const p of site.run.trail){c.globalAlpha=opacity*.2;c.fillRect(p.x+ox,p.y+oy+6,1,1);}c.globalAlpha=opacity;}const leg=reduced()?0:Math.sin(seconds*24)*3;c.strokeStyle='#d3eef2';c.lineWidth=1.3;c.beginPath();c.moveTo(x-3,y+4);c.lineTo(x-6-leg,y+10);c.moveTo(x+3,y+4);c.lineTo(x+6+leg,y+10);c.stroke();}
   if(flash>seconds){c.strokeStyle='#fff';c.lineWidth=2;}else c.lineWidth=1.2;
   for(let i=0;i<o.size;i++){
    const px=x+(i-(o.size-1)/2)*6,h=9+(i%2)*4;
    c.beginPath();c.moveTo(px-3,y+4);c.lineTo(px-4,y-h+4);c.lineTo(px,y-h);c.lineTo(px+4,y-h+4);c.lineTo(px+3,y+4);c.closePath();c.globalAlpha=opacity*(.28+.45*glow);c.fill();c.globalAlpha=opacity;c.stroke();
    c.globalAlpha=opacity*.5;c.beginPath();c.moveTo(px,y-h);c.lineTo(px+1,y-h+5);c.lineTo(px,y+4);c.moveTo(px-4,y-h+4);c.lineTo(px+1,y-h+5);c.lineTo(px+4,y-h+4);c.stroke();c.globalAlpha=opacity;
   }
   if(site?.hits){c.strokeStyle='#fff';c.lineWidth=site.hits===o.size-1?2:1;c.shadowColor='#fff';c.shadowBlur=site.flash>seconds?8:0;c.beginPath();c.moveTo(x-4,y-5);c.lineTo(x+2,y-2);c.lineTo(x-1,y+2);if(site.hits>1)c.lineTo(x+5,y+3);c.stroke();c.shadowBlur=0;}
   if(d<85){c.globalAlpha=opacity*.8;c.font='11px "Geist Mono",monospace';c.textAlign='center';c.fillText(runtime.journeyQuiet?.()?'Pulso':'Lanza un pulso',x,y+19);}
  }
  if(!reduced())for(const p of feedback){
   const age=seconds-p.at,u=Math.min(1,age/.48),count=p.broken?3+p.size:3;c.globalAlpha=opacityForFeedback(p)*(1-u)**2*.7;c.strokeStyle=c.fillStyle='#d3eef2';c.lineWidth=1;
   for(let i=0;i<count;i++){
    const a=i*Math.PI*2/count-.8,d=(p.broken?22:10)*(1-(1-u)**3),x=p.x+ox+Math.cos(a)*d,y=p.y+oy-4+Math.sin(a)*d+(p.broken?u*u*9:0),size=p.broken?2:1;
    c.beginPath();c.moveTo(x,y-size*2);c.lineTo(x+size,y);c.lineTo(x-size,y+size);c.closePath();c.fill();
   }
  }
  // A chain's streak is readable: each ring brightens with the breaks so far, and from the third one the newest shows ×N.
  if(!reduced())for(const wave of chains){const age=seconds-wave.at,n=wave.chain?.broken||1;c.globalAlpha=Math.max(0,1-age/.65)*Math.min(.8,.3+(n-1)*.1);c.strokeStyle=n>2?'#e9ca7d':'#d3eef2';c.lineWidth=n>2?1.5:1;c.beginPath();c.arc(wave.x+ox,wave.y+oy,Math.min(CRYSTAL_CHAIN_RADIUS,age*900),0,Math.PI*2);c.stroke();}
  const streak=chains.filter(w=>(w.chain?.broken||0)>2).at(-1);if(streak){c.globalAlpha=Math.max(0,1-(seconds-streak.at)/.65);c.fillStyle='#e9ca7d';c.font='600 14px "Geist Mono",monospace';c.textAlign='center';c.fillText('×'+streak.chain.broken,streak.x+ox,streak.y+oy-22);}
  c.restore();
 }
 function opacityForFeedback(p){const pos=position(),d=Math.hypot(p.x-pos.x,p.y-pos.y);return runtime.worldOpacity?.(d)??Math.max(0,1-d/500);}
 function drawHUD(){
  if(runtime.drawSparkEconomyHUD)return;
  const counter=runtime.$?.('sparkCount'),total=runtime.$?.('sparkTotal'),delta=runtime.$?.('sparkGain');if(!counter||!total||!delta)return;
  counter.hidden=!['camino','world'].includes(S().mode);total.textContent='✦ '+normalizeSparks(S().sparks);
  const visible=seconds<shownUntil;counter.classList.toggle('collecting',visible);delta.textContent=visible?'+'+gain:'';
 }
 Object.defineProperties(runtime,{crystalTick:{get:()=>tick},drawCrystals:{get:()=>draw},drawSparkHUD:{get:()=>drawHUD},crystalState:{get:()=>({misses,total:normalizeSparks(S().sparks),sites:sites.size,feedback:feedback.length,near:near.map(o=>({...o,...sites.get(o.id)}))})}});
}
