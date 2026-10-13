import {CHANNEL_NAMES} from './influence.js';
import {elementInk,WORLD_VISUAL} from './visual.js';
const CHANNELS=['bass','groove','melody','space'];
export function normalizePatchSites(saved){
 const out={};for(const [id,s] of Object.entries(saved||{})){
  if(Object.keys(out).length>=64)break;
  if(!/^patch:-?\d+,-?\d+$/.test(id)||!Array.isArray(s?.connections))continue;
  out[id]={connections:[...new Set(s.connections.filter(n=>Number.isInteger(n)&&n>=0&&n<3))],pattern:Number.isInteger(s.pattern)?Math.max(0,Math.min(3,s.pattern)):0,amount:Number.isFinite(s.amount)?Math.max(-1,Math.min(1,s.amount)):.8};
 }return out;
}
export function createPatchSite(region,size,seedOf,rng){
 if(region.sea||!/^(-?\d+),(-?\d+)$/.test(region.key)||!region.recipe?.elements.some(e=>e.id==='installation:patch'&&e.present))return null;
 const [rx,ry]=region.key.split(',').map(Number),r=rng(seedOf(`patch:v1:${region.key}`)),home=region.key==='0,0';
 const x=home?2050:(rx+.28+r()*.44)*size,y=home?900:(ry+.28+r()*.44)*size;
 const pool=CHANNELS.slice();for(let i=pool.length-1;i;i--){const j=Math.floor(r()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 return {id:`patch:${region.key}`,x,y,region,hue:region.hue,variant:Math.floor(r()*8),connections:[],pattern:0,amount:.8,out:{x:x-68,y},inputs:(home?['bass','groove','melody']:pool.slice(0,3)).map((channel,i)=>({x:x+52,y:y+(i-1)*60,channel})),lit:0};
}
export function initialize(runtime){
 const $=runtime.$,S=()=>runtime.S,cache=new Map();let previous=S(),selected=null,armed=null,drag=null;
 S().patchSites=normalizePatchSites(S().patchSites);
 const surface=()=>runtime.inWorld()&&(S().layer||'superficie')==='superficie';
 function nearby(radius=500){
  if(!surface())return [];const size=runtime.REG*runtime.WCH,rx=Math.floor(S().wx/size),ry=Math.floor(S().wy/size),out=[];
  for(let x=rx-1;x<=rx+1;x++)for(let y=ry-1;y<=ry+1;y++){
   const key=`${x},${y}`;let site=cache.get(key);if(!cache.has(key)){
    site=createPatchSite(runtime.regionOfPos((x+.5)*size,(y+.5)*size),size,runtime.seedOf,runtime.rng);
    if(site&&S().patchSites[site.id])Object.assign(site,S().patchSites[site.id],{connections:[...S().patchSites[site.id].connections]});
    cache.set(key,site);while(cache.size>64)cache.delete(cache.keys().next().value);
   }if(site&&Math.hypot(site.x-S().wx,site.y-S().wy)<radius)out.push(site);
  }return out;
 }
 function remember(site){const saved=S().patchSites;if(!saved[site.id]&&Object.keys(saved).length>=64)delete saved[Object.keys(saved)[0]];saved[site.id]={connections:[...site.connections],pattern:site.pattern,amount:site.amount};}
 function panel(){if(!selected)return;$('patchPattern').value=selected.pattern;$('patchAmount').value=Math.round(selected.amount*100);$('patchValue').textContent=`${Math.round(selected.amount*100)} %`;$('patchInfo').textContent=selected.connections.length?selected.connections.map(i=>CHANNEL_NAMES[selected.inputs[i].channel]).join(' · ')+' conectado':'Sin cables · conecta el reloj a una entrada';}
 function close(){selected=armed=drag=null;$('patchPanel').hidden=true;runtime.save();}
 function open(site){runtime.closeGlass?.();runtime.closeMirrors?.();selected=site;$('patchPanel').hidden=false;panel();if(!S().help.patch){S().help.patch=true;runtime.say(runtime.VOZ.patch,'Jardín modular');}}
 function connect(site,i){
  if(!surface()||!site||!Number.isInteger(i)||i<0||i>=3||Math.hypot(site.x-S().wx,site.y-S().wy)>230)return false;
  if(site.connections.includes(i))site.connections=site.connections.filter(n=>n!==i);else site.connections.push(i);
  remember(site);runtime.stopAutopilot();runtime.unlock('patch1');panel();runtime.save();return true;
 }
 function at(x,y){
  if(!surface()||runtime.scanning||document.querySelector('.modal:not([hidden])'))return null;
  const wx=x-runtime.W/2+S().wx,wy=y-runtime.H/2+S().wy;
  for(const site of nearby(230)){
   if(Math.hypot(wx-site.out.x,wy-site.out.y)<22)return {site,index:-1};
   for(let i=0;i<3;i++)if(Math.hypot(wx-site.inputs[i].x,wy-site.inputs[i].y)<22)return {site,index:i};
   if(wx>site.out.x-48&&wx<site.out.x&&Math.abs(wy-site.out.y)<22)return {site,index:-2};
   for(const input of site.inputs)if(wx>input.x&&wx<input.x+65&&Math.abs(wy-input.y)<22)return {site,index:-2};
  }return null;
 }
 function down(e){const hit=at(e.clientX,e.clientY);if(!hit||hit.index!==-1||e.target!==$('w'))return false;
  runtime.audio();runtime.stopAutopilot();runtime.closeGlass?.();runtime.closeMirrors?.();close();armed=hit.site;drag={pointer:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY};runtime.ptr=null;runtime.tapStart=null;try{$('w').setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();return true;
 }
 function move(e){if(drag?.pointer!==e.pointerId)return false;drag.x=e.clientX;drag.y=e.clientY;e.preventDefault();return true;}
 function up(e){if(drag?.pointer!==e.pointerId)return false;const hit=at(e.clientX,e.clientY);
  if(e.type==='pointerup'&&hit?.site===armed&&hit.index>=0){connect(armed,hit.index);armed=null;}
  if(!hit&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>14)armed=null;
  if(e.type==='pointercancel'||e.type==='lostpointercapture')armed=null;drag=null;return true;
 }
 function tap(x,y){const hit=at(x,y);if(!hit)return false;
  if(hit.index===-2)open(hit.site);
  else if(hit.index===-1){armed=hit.site;}
  else if(armed===hit.site||hit.site.connections.includes(hit.index)){connect(hit.site,hit.index);armed=null;}
  else if(!S().help.patch){S().help.patch=true;runtime.say(runtime.VOZ.patch,'Jardín modular');}return true;
 }
 function tick(){
  if(previous!==S()){previous=S();cache.clear();S().patchSites=normalizePatchSites(S().patchSites);close();}
  if(selected&&(!surface()||Math.hypot(selected.x-S().wx,selected.y-S().wy)>260))close();
  if(document.hidden||document.querySelector('.modal:not([hidden])')){drag=null;armed=null;}
 }
 function step(step,bar,time){
  if(!surface()||!S().sound||runtime.ac?.state!=='running'||document.hidden||document.querySelector('.modal:not([hidden])')||runtime.currentPocket?.()?.kind==='quiet'||step!==0)return;
  const sites=nearby(300).filter(s=>s.connections.length).sort((a,b)=>Math.hypot(a.x-S().wx,a.y-S().wy)-Math.hypot(b.x-S().wx,b.y-S().wy));
  const site=sites[0];if(!site)return;
  const r=runtime.rng(runtime.seedOf(`patch-mod:v1:${site.id}:${site.pattern}:${Math.floor(bar/4)}`));
  const variant=(site.variant+site.pattern*2+Math.floor(r()*3))%8;
  // One modulation update on the bar; no new oscillators or feedback graph.
  for(const i of site.connections)runtime.driveInfluence(site.region,site.inputs[i].channel,site.amount,variant);
  setTimeout(()=>site.lit=1,Math.max(0,(time-runtime.ac.currentTime)*1000));
 }
 function draw(t,dt,ox,oy,radius){
  if(!surface())return;const c=runtime.cx;
  for(const site of nearby(radius+160)){
   site.lit=Math.max(0,site.lit-dt*2);const ink=elementInk('metal',site.hue);c.save();c.strokeStyle=ink;c.fillStyle=ink;c.lineWidth=WORLD_VISUAL.line;c.globalAlpha=.6+site.lit*.2;
   c.strokeRect(site.out.x+ox-48,site.out.y+oy-22,48,44);c.font='9px monospace';c.textAlign='center';c.fillText('Reloj',site.out.x+ox-24,site.out.y+oy+3);
   site.inputs.forEach((input,i)=>{c.strokeRect(input.x+ox,input.y+oy-22,65,44);c.fillText(CHANNEL_NAMES[input.channel],input.x+ox+32,input.y+oy+3);c.beginPath();c.arc(input.x+ox,input.y+oy,8,0,Math.PI*2);c.stroke();if(site.connections.includes(i)){c.strokeStyle=WORLD_VISUAL.gold;c.beginPath();c.moveTo(site.out.x+ox,site.out.y+oy);c.bezierCurveTo(site.x+ox,site.out.y+oy+20,site.x+ox,input.y+oy+20,input.x+ox,input.y+oy);c.stroke();c.strokeStyle=ink;}});
   c.beginPath();c.arc(site.out.x+ox,site.out.y+oy,8,0,Math.PI*2);c.stroke();
   if(drag&&armed===site){c.strokeStyle=WORLD_VISUAL.gold;c.beginPath();c.moveTo(site.out.x+ox,site.out.y+oy);c.lineTo(drag.x,drag.y);c.stroke();}
   if(Math.hypot(site.x-S().wx,site.y-S().wy)<230){c.globalAlpha=.65;c.fillText(armed===site?'Toca una entrada':'Arrastra del reloj a una entrada',site.x+ox,site.y+oy+105);}
   c.restore();
  }
 }
 $('patchClose').onclick=close;
 $('patchPattern').onchange=e=>{if(!selected)return;selected.pattern=Number(e.target.value);remember(selected);panel();runtime.save();};
 $('patchAmount').oninput=e=>{if(!selected)return;selected.amount=Number(e.target.value)/100;remember(selected);panel();};$('patchAmount').onchange=()=>runtime.save();
 $('patchClear').onclick=()=>{if(!selected)return;selected.connections=[];remember(selected);panel();runtime.save();};
 addEventListener('blur',()=>{drag=armed=null;});
 Object.defineProperties(runtime,{nearbyPatches:{get:()=>nearby},patchGardenTick:{get:()=>tick},patchGardenStep:{get:()=>step},patchPointerDown:{get:()=>down},patchPointerMove:{get:()=>move},patchPointerUp:{get:()=>up},tapPatch:{get:()=>tap},drawPatchGarden:{get:()=>draw},closePatchGarden:{get:()=>close},connectPatch:{get:()=>connect}});
}
