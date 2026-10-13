import {claimInstallationBar} from './installations.js';
import {WORLD_VISUAL,elementInk} from './visual.js';
import {ROLES} from './journal.js';
const TAU=Math.PI*2,HALF=30;
const cross=(a,b)=>a.x*b.y-a.y*b.x;
export const mirrorAngle=a=>((a%Math.PI)+Math.PI)%Math.PI;

// Finite segments, positive ray distances, a total distance budget and a bounce cap.
export function traceMirrors(site,maxBounces=4){
 let p={...site.emitter},direction=site.rotation,remaining=800,last=-1;
 const segments=[],hits=[];
 for(let bounce=0;bounce<=maxBounces;bounce++){
  const d={x:Math.cos(direction),y:Math.sin(direction)};let best=remaining,index=-1;
  site.mirrors.forEach((m,i)=>{
   if(i===last)return;const v={x:Math.cos(m.angle),y:Math.sin(m.angle)},q={x:m.x-p.x,y:m.y-p.y},den=cross(d,v);
   if(Math.abs(den)<1e-6)return;const t=cross(q,v)/den,u=cross(q,d)/den;
   if(t>.01&&t<best&&Math.abs(u)<=HALF){best=t;index=i;}
  });
  const q={x:site.target.x-p.x,y:site.target.y-p.y},along=q.x*d.x+q.y*d.y,off=Math.abs(cross(q,d));
  if(hits.length&&along>.01&&along<best&&off<14){
   segments.push({from:p,to:{x:p.x+d.x*along,y:p.y+d.y*along}});return {segments,hits,connected:true};
  }
  const end={x:p.x+d.x*best,y:p.y+d.y*best};segments.push({from:p,to:end});
  if(index<0||bounce===maxBounces)break;
  hits.push(index);remaining-=best;if(remaining<.01)break;
  direction=2*site.mirrors[index].angle-direction;p=end;last=index;
 }
 return {segments,hits,connected:false};
}
export function normalizeMirrorSites(saved){
 const out={};for(const [id,e] of Object.entries(saved||{})){
  if(Object.keys(out).length>=64)break;
  if(!/^mirror:-?\d+,-?\d+$/.test(id)||!Array.isArray(e?.angles)||e.angles.length!==3||!e.angles.every(Number.isFinite))continue;
  out[id]={angles:e.angles.map(mirrorAngle),solved:!!e.solved};
 }return out;
}
export function createMirrorSite(region,size,seedOf,rng){
 if(region.sea||!/^(-?\d+),(-?\d+)$/.test(region.key)||!region.recipe?.elements.some(e=>e.id==='installation:mirror'&&e.present))return null;
 const [rx,ry]=region.key.split(',').map(Number),r=rng(seedOf(`mirror:v1:${region.key}`)),home=region.key==='0,0';
 const x=home?1600:(rx+.3+r()*.4)*size,y=home?900:(ry+.3+r()*.4)*size,rotation=home?0:Math.floor(r()*4)*Math.PI/2;
 const point=(a,b)=>({x:x+a*Math.cos(rotation)-b*Math.sin(rotation),y:y+a*Math.sin(rotation)+b*Math.cos(rotation)});
 const solution=[Math.PI/4,Math.PI/4,-Math.PI/4].map(a=>mirrorAngle(a+rotation));
 const mirrors=[[-80,0],[-80,90],[80,90]].map(([a,b],i)=>({...point(a,b),id:`mirror:${region.key}:${i}`,angle:home?mirrorAngle(solution[i]+(i===2?.35:0)):r()*Math.PI,material:'metal'}));
 return {id:`mirror:${region.key}`,x,y,rotation,emitter:point(-150,0),target:point(80,-60),mirrors,solution,region,hue:region.hue,glyph:Math.floor(r()*4),lit:0,lastInput:0};
}

export function initialize(runtime){
 const $=runtime.$,S=()=>runtime.S,cache=new Map();let previous=S(),selected=null;
 S().mirrorSites=normalizeMirrorSites(S().mirrorSites);
 const surface=()=>runtime.inWorld()&&(S().layer||'superficie')==='superficie';
 function nearby(radius=600){
  if(!surface())return [];const size=runtime.REG*runtime.WCH,rx=Math.floor(S().wx/size),ry=Math.floor(S().wy/size),out=[];
  for(let x=rx-1;x<=rx+1;x++)for(let y=ry-1;y<=ry+1;y++){
   const key=`${x},${y}`;let site=cache.get(key);
   if(!cache.has(key)){
    site=createMirrorSite(runtime.regionOfPos((x+.5)*size,(y+.5)*size),size,runtime.seedOf,runtime.rng);
    if(site){const saved=S().mirrorSites[site.id];if(saved)site.mirrors.forEach((m,i)=>m.angle=saved.angles[i]);}
    cache.set(key,site);while(cache.size>64)cache.delete(cache.keys().next().value);
   }
   if(site&&Math.hypot(site.x-S().wx,site.y-S().wy)<radius)out.push(site);
  }return out;
 }
 function remember(site,solved=false){
  const saved=S().mirrorSites;if(!saved[site.id]&&Object.keys(saved).length>=64)delete saved[Object.keys(saved)[0]];
  saved[site.id]={angles:site.mirrors.map(m=>m.angle),solved:solved||!!saved[site.id]?.solved};
 }
 function emit(site,i,time,origin='ambient'){
  const route=traceMirrors(site),m=site.mirrors[i],degree=route.connected?i*2:Math.floor(m.angle/Math.PI*7)%7;
  runtime.playVoice(`installation:mirror:${i}`,degree,time,site.region,false,.4,m,origin);
  setTimeout(()=>site.lit=1,Math.max(0,(time-runtime.ac.currentTime)*1000));
 }
 function panel(){
  if(!selected)return;const route=traceMirrors(selected);
  for(let i=0;i<3;i++){$(`mirrorAngle${i}`).value=Math.round(selected.mirrors[i].angle/Math.PI*180);$(`mirrorValue${i}`).textContent=`${Math.round(selected.mirrors[i].angle/Math.PI*180)}°`;}
  const roles=selected.mirrors.map((m,i)=>ROLES[runtime.getVoice(`installation:mirror:${i}`,selected.region).role]);
  $('mirrorInfo').textContent=(route.connected?'Conexión completa · figura revelada':`${route.hits.length} reflejos · lleva la luz al rombo`)+` · ${roles.join(' / ')}`;
 }
 function turn(site,i,angle){
  if(!surface()||!site||!Number.isInteger(i)||i<0||i>2||!Number.isFinite(angle)||Math.hypot(site.x-S().wx,site.y-S().wy)>250)return false;
  site.mirrors[i].angle=mirrorAngle(angle);const route=traceMirrors(site);remember(site,route.connected);runtime.stopAutopilot();runtime.unlock('espejo1');
  if(route.connected)runtime.unlock('espejoRuta');
  const now=performance.now();if(now-site.lastInput>220){site.lastInput=now;runtime.beatSoon(t=>emit(site,i,t,'player'),null,'player');}
  panel();return true;
 }
 function open(site){runtime.closeGlass?.();runtime.closePatchGarden?.();selected=site;remember(site);$('mirrorPanel').hidden=false;panel();if(!S().help.mirrors){S().help.mirrors=true;runtime.say(runtime.VOZ.mirrors,'Espejos musicales');}}
 function close(){selected=null;$('mirrorPanel').hidden=true;runtime.save();}
 function tap(x,y){
  if(!surface()||runtime.scanning||[...document.querySelectorAll('.modal')].some(m=>!m.hidden))return false;
  const wx=S().wx+x-runtime.W/2,wy=S().wy+y-runtime.H/2;
  for(const site of nearby(250))for(const m of site.mirrors)if(Math.hypot(m.x-wx,m.y-wy)<34){runtime.stopAutopilot();open(site);return true;}
  return false;
 }
 function tick(){
  if(previous!==S()){previous=S();cache.clear();S().mirrorSites=normalizeMirrorSites(S().mirrorSites);close();}
  if(selected&&(!surface()||Math.hypot(selected.x-S().wx,selected.y-S().wy)>280))close();
 }
 function step(step,bar,time){
  if(!surface()||!S().sound||runtime.ac?.state!=='running'||runtime.currentPocket?.()?.kind==='quiet'||bar%2)return;
  // One response per two bars, irrespective of how many reflections the beam makes.
  for(const site of nearby(400)){
   if(!S().mirrorSites[site.id])continue;const route=traceMirrors(site);if(!route.hits.length)continue;
   const i=route.hits[Math.floor(bar/2)%route.hits.length],accent=Math.floor(site.mirrors[i].angle/Math.PI*16)%16;
   if(step===accent&&claimInstallationBar(runtime,bar)){emit(site,i,time);break;}
  }
 }
 function sources(){return nearby(300).flatMap(site=>site.mirrors.map((m,i)=>({object:m,kind:`installation:mirror:${i}`,name:`Espejo musical ${i+1}`,distance:Math.hypot(m.x-S().wx,m.y-S().wy)})));}
 function draw(t,dt,ox,oy,radius){
  if(!surface())return;const ctx=runtime.cx;
  for(const site of nearby(radius+260)){
   site.lit=Math.max(0,site.lit-dt*2);const route=traceMirrors(site),color=elementInk('metal',site.hue);
   ctx.save();ctx.lineWidth=WORLD_VISUAL.line;ctx.strokeStyle=route.connected?WORLD_VISUAL.gold:color;ctx.globalAlpha=.22+site.lit*.3;
   ctx.beginPath();for(const segment of route.segments){ctx.moveTo(segment.from.x+ox,segment.from.y+oy);ctx.lineTo(segment.to.x+ox,segment.to.y+oy);}ctx.stroke();
   ctx.globalAlpha=.85;ctx.fillStyle=WORLD_VISUAL.gold;ctx.beginPath();ctx.arc(site.emitter.x+ox,site.emitter.y+oy,4,0,TAU);ctx.fill();
   site.mirrors.forEach((m,i)=>{ctx.strokeStyle=color;ctx.beginPath();const dx=Math.cos(m.angle)*HALF,dy=Math.sin(m.angle)*HALF;ctx.moveTo(m.x+ox-dx,m.y+oy-dy);ctx.lineTo(m.x+ox+dx,m.y+oy+dy);ctx.stroke();ctx.beginPath();ctx.arc(m.x+ox,m.y+oy,8,0,TAU);ctx.stroke();ctx.fillStyle=color;ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText(String(i+1),m.x+ox,m.y+oy-14);});
   const x=site.target.x+ox,y=site.target.y+oy;ctx.strokeStyle=route.connected?WORLD_VISUAL.gold:color;ctx.beginPath();ctx.moveTo(x,y-12);ctx.lineTo(x+12,y);ctx.lineTo(x,y+12);ctx.lineTo(x-12,y);ctx.closePath();ctx.stroke();
   if(route.connected){ctx.globalAlpha=.65;ctx.beginPath();const sides=3+site.glyph;for(let i=0;i<=sides;i++){const a=i*TAU/sides;const px=x+Math.cos(a)*32,py=y+Math.sin(a)*32;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}ctx.stroke();}
   if(Math.hypot(site.x-S().wx,site.y-S().wy)<250){ctx.globalAlpha=.7;ctx.fillStyle=color;ctx.fillText('Toca un espejo · dirige la luz al rombo',site.x+ox,site.y+oy+145);}
   const wave=runtime.waves.length&&runtime.hitW(site.emitter.x,site.emitter.y);
   if(wave&&site.wave!==wave){site.wave=wave;remember(site,route.connected);runtime.wsoon(wave,time=>emit(site,route.hits[0]??0,time,'player'));}
   ctx.restore();
  }
 }
 $('mirrorClose').onclick=close;
 for(let i=0;i<3;i++){$(`mirrorAngle${i}`).oninput=e=>{runtime.audio();turn(selected,i,Number(e.target.value)/180*Math.PI);};$(`mirrorAngle${i}`).onchange=()=>runtime.save();}
 Object.defineProperties(runtime,{nearbyMirrors:{get:()=>nearby},mirrorState:{get:()=>({site:selected})},turnMirror:{get:()=>turn},tapMirror:{get:()=>tap},mirrorTick:{get:()=>tick},mirrorStep:{get:()=>step},mirrorSources:{get:()=>sources},drawMirrors:{get:()=>draw},closeMirrors:{get:()=>close}});
}
