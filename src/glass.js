import {claimInstallationBar} from './installations.js';
import {WORLD_VISUAL,elementInk} from './visual.js';
import {glassShape,glassColor} from './glass-music.js';
import {CHANNEL_NAMES} from './influence.js';
const TAU=Math.PI*2;
export const glassHandleRadius=pane=>50+pane*16;
export function glassParameters(angles){
 if(!Array.isArray(angles)||angles.length!==3||!angles.every(Number.isFinite))throw Error('Invalid glass angles');
 const a=angles.map(x=>((x%TAU)+TAU)%TAU),alignment=(3+Math.cos(a[0]-a[1])+Math.cos(a[1]-a[2])+Math.cos(a[2]-a[0]))/6;
 return {degrees:a.map(x=>Math.floor(x/TAU*7)%7),accents:a.map(x=>Math.floor(x/TAU*16)%16),alignment,stride:alignment>.75?2:4};
}
export function normalizeGlassSites(saved){
 const out={};for(const [id,entry] of Object.entries(saved||{})){
  if(!/^glass:-?\d+,-?\d+$/.test(id)||!Array.isArray(entry?.angles)||entry.angles.length!==3||!entry.angles.every(Number.isFinite))continue;
  out[id]={angles:entry.angles.map(x=>((x%TAU)+TAU)%TAU),seen:!!entry.seen};
 }return out;
}
export function createGlassSite(region,regionSize,seedOf,rng){
 if(region.sea||!region.recipe?.elements.find(e=>e.id==='installation:glass'&&e.present))return null;
 if(!/^-?\d+,-?\d+$/.test(region.key))return null;
 const [rx,ry]=region.key.split(',').map(Number),r=rng(seedOf(`glass:v1:${region.key}`)),home=region.key==='0,0';
 return {id:`glass:${region.key}`,x:home?1080:(rx+.25+r()*.5)*regionSize,y:home?900:(ry+.25+r()*.5)*regionSize,hue:region.hue,angles:[r()*TAU,r()*TAU,r()*TAU],lit:0,lastInput:0,region,plates:[]};
}
export function initialize(runtime){
 let previousState=runtime.S;
 const cache=new Map(),$=runtime.$,state={site:null,pane:0,drag:null},S=()=>runtime.S;
 S().glassSites=normalizeGlassSites(S().glassSites);
 const onSurface=()=>runtime.inWorld()&&(S().layer||'superficie')==='superficie';
 function nearby(radius=400){
  if(!onSurface())return [];const rp=runtime.REG*runtime.WCH,rx=Math.floor(S().wx/rp),ry=Math.floor(S().wy/rp),out=[];
  for(let x=rx-1;x<=rx+1;x++)for(let y=ry-1;y<=ry+1;y++){
   const key=`${x},${y}`;let site=cache.get(key);
   if(!cache.has(key)){const d=runtime.regionOfPos((x+.5)*rp,(y+.5)*rp);site=createGlassSite(d,rp,runtime.seedOf,runtime.rng);
    if(site){const saved=S().glassSites[site.id];if(saved)site.angles=[...saved.angles];site.plates=Array.from({length:3},(_,i)=>({id:`${site.id}:${i}`,name:`Vidrio cromático ${i+1}`,material:'glass',x:site.x,y:site.y}));}
    cache.set(key,site);while(cache.size>64)cache.delete(cache.keys().next().value);}
   if(site&&Math.hypot(site.x-S().wx,site.y-S().wy)<radius)out.push(site);
  }return out;
 }
 function remember(site){
  const saved=S().glassSites;
  saved[site.id]={angles:[...site.angles],seen:true};
 }
 function emit(site,pane,time,origin='ambient'){
  const p=glassShape(site.angles,pane,site.region,runtime.seedOf),source=site.plates[pane];
  runtime.playVoice(`installation:glass:${pane}`,p.degree,time,site.region,false,origin==='player'?.2:.12,source,origin);
  setTimeout(()=>{site.lit=1;},Math.max(0,(time-runtime.ac.currentTime)*1000));
 }
 function turn(site,pane,angle){
  if(!Number.isFinite(angle)||!Number.isInteger(pane)||pane<0||pane>2||!onSurface()||!site||Math.hypot(site.x-S().wx,site.y-S().wy)>180)return false;
  site.angles[pane]=((angle%TAU)+TAU)%TAU;remember(site);runtime.stopAutopilot();runtime.recordElement?.('installation:glass',site.region);runtime.unlock('vidrio1');
  if(glassParameters(site.angles).alignment>.985)runtime.unlock('vidrioArmonia');
  const now=performance.now();if(now-site.lastInput>220){site.lastInput=now;runtime.beatSoon(t=>emit(site,pane,t,'player'),null,'player');}
  const shape=glassShape(site.angles,pane,site.region,runtime.seedOf);runtime.driveInfluence?.(site.region,shape.channel,shape.amount,shape.variant);runtime.creativeAction?.(shape.channel,'model');return true;
 }
 function open(site,pane){runtime.closeMirrors?.();runtime.closePatchGarden?.();state.site=site;state.pane=pane;remember(site);if(!S().help.glass){S().help.glass=true;runtime.say(runtime.VOZ.glass,'Vidrios musicales');}}
 function cancel(){if(state.drag?.angles&&state.site){state.site.angles=[...state.drag.angles];remember(state.site);}state.drag=null;}
 function close(){cancel();state.site=null;runtime.save();}
 const screen=site=>({x:runtime.W/2+site.x-S().wx,y:runtime.H/2+site.y-S().wy});
 function down(e){
  if(state.drag)return true;
  if(!e.isPrimary||!onSurface()||e.target!==$('w'))return false;
  const modal=[...document.querySelectorAll('.modal')].some(m=>!m.hidden);if(modal||runtime.scanning)return false;
  let match=null,best=18;
  for(const site of nearby(180)){const p=screen(site);site.angles.forEach((angle,i)=>{const d=Math.hypot(e.clientX-p.x-Math.cos(angle)*glassHandleRadius(i),e.clientY-p.y-Math.sin(angle)*glassHandleRadius(i));if(d<best){best=d;match={site,pane:i};}});}
  if(!match)return false;
  runtime.audio();runtime.stopAutopilot();runtime.ptr=null;runtime.tapStart=null;open(match.site,match.pane);state.drag={pointer:e.pointerId,angles:[...match.site.angles]};try{$('w').setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();return true;
 }
 function move(e){if(state.drag?.pointer!==e.pointerId)return false;if(document.hidden||document.querySelector('.modal:not([hidden])')||!onSurface()){cancel();return true;}const p=screen(state.site);turn(state.site,state.pane,Math.atan2(e.clientY-p.y,e.clientX-p.x));e.preventDefault();return true;}
 function up(e){if(state.drag?.pointer!==e.pointerId)return false;if(e.type!=='pointerup')cancel();else state.drag=null;runtime.save();return true;}
 function tick(){if(document.hidden||document.querySelector('.modal:not([hidden])'))cancel();if(previousState!==S()){state.drag=null;state.site=null;cache.clear();previousState=S();S().glassSites=normalizeGlassSites(S().glassSites);close();}if(state.site&&(!onSurface()||Math.hypot(state.site.x-S().wx,state.site.y-S().wy)>220))close();}
 function step(step,bar,time){
  if(!onSurface()||document.hidden||document.querySelector('.modal:not([hidden])')||!S().sound||runtime.ac?.state!=='running'||runtime.currentPocket?.()?.kind==='quiet')return;
  for(const site of nearby(300)){
   if(!S().glassSites[site.id]?.seen)continue;const p=glassParameters(site.angles),pane=Math.floor(bar/p.stride)%3;
   if(bar%p.stride===0&&step===p.accents[pane]&&claimInstallationBar(runtime,bar)){emit(site,pane,time);break;}
  }
 }
 function sources(){return nearby(250).flatMap(site=>site.plates.map((o,i)=>({object:o,kind:`installation:glass:${i}`,name:o.name,distance:Math.hypot(o.x-S().wx,o.y-S().wy)})));}
 // Cuerpo: el cubo engancha el aro de un vidrio al pasar por su asa y lo arrastra girando a su alrededor.
 function bodyStep(){
  const b=runtime.body;if(state.drag||!b?.ready||document.querySelector('.modal:not([hidden])')||runtime.scanning)return;
  for(const site of nearby(200)){
   const cur={x:b.x-site.x,y:b.y-site.y},r=Math.hypot(cur.x,cur.y);
   if(site.grab!=null){const R=glassHandleRadius(site.grab);if(b.jump||Math.abs(r-R)>12){site.grab=null;remember(site);runtime.save();continue;}turn(site,site.grab,Math.atan2(cur.y,cur.x));continue;}
   for(let i=0;i<3;i++){const R=glassHandleRadius(i),hx=Math.cos(site.angles[i])*R,hy=Math.sin(site.angles[i])*R;
    if(Math.hypot(cur.x-hx,cur.y-hy)<14){runtime.audio();if(state.site!==site)open(site,i);state.pane=i;site.grab=i;break;}}
  }
 }
 function draw(t,dt,ox,oy,radius){
  tick();if(!onSurface())return;bodyStep();const ctx=runtime.cx;
  for(const site of nearby(radius+120)){
   const distance=Math.hypot(site.x-S().wx,site.y-S().wy),x=site.x+ox,y=site.y+oy;site.lit=Math.max(0,site.lit-dt*2);
   const wave=runtime.waves.length&&runtime.hitW(site.x,site.y);if(wave&&site.wave!==wave){site.wave=wave;remember(site);runtime.wsoon(wave,time=>emit(site,0,time,'player'));}
   ctx.save();ctx.translate(x,y);ctx.lineWidth=WORLD_VISUAL.line;
   site.angles.forEach((angle,i)=>{
    const color=elementInk('glass',glassColor(site.hue,angle,i));ctx.save();ctx.rotate(angle);ctx.translate((i-1)*12,0);ctx.strokeStyle=color;ctx.fillStyle=color;
    // Three light blades: no filled panels or dense internal grid.
    ctx.globalAlpha=.5+site.lit*.15;ctx.beginPath();ctx.ellipse(0,0,16,38,0,0,TAU);ctx.stroke();
    ctx.globalAlpha=.28;ctx.beginPath();ctx.moveTo(0,-34);ctx.quadraticCurveTo(Math.sin(site.angles[(i+1)%3]-angle)*12,0,0,34);ctx.stroke();ctx.restore();
    ctx.globalAlpha=distance<180?.85:.35;ctx.strokeStyle=site.grab===i?elementInk('glass',site.hue,true):color;ctx.lineWidth=site.grab===i?2.4:WORLD_VISUAL.line;ctx.beginPath();ctx.arc(Math.cos(angle)*glassHandleRadius(i),Math.sin(angle)*glassHandleRadius(i),site.grab===i?10:7,0,TAU);ctx.stroke();ctx.lineWidth=WORLD_VISUAL.line;
   });
   const resonance=glassParameters(site.angles).alignment;if(resonance>.65){ctx.strokeStyle=elementInk('glass',site.hue);ctx.globalAlpha=(resonance-.65)*.6;ctx.beginPath();for(let i=0;i<=48;i++){const a=i/48*TAU,r=25+Math.cos(a*3+site.angles[0])*9;ctx[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r);}ctx.stroke();}
   if(distance<180){ctx.globalAlpha=.8;ctx.fillStyle=elementInk('glass',site.hue,true);ctx.font='10px "Geist Mono", monospace';ctx.textAlign='center';const channel=glassShape(site.angles,state.site===site?state.pane:0,site.region,runtime.seedOf).channel;ctx.fillText(`Rodea un asa · ${CHANNEL_NAMES[channel]}`,0,106);}
   ctx.restore();
  }
 }
 addEventListener('blur',()=>{cancel();runtime.save();});
 Object.defineProperties(runtime,{glassTick:{get:()=>tick},glassPointerDown:{get:()=>down},glassPointerMove:{get:()=>move},glassPointerUp:{get:()=>up},drawGlass:{get:()=>draw},glassStep:{get:()=>step},glassSources:{get:()=>sources},nearbyGlass:{get:()=>nearby},glassState:{get:()=>state},turnGlass:{get:()=>turn},closeGlass:{get:()=>close}});
}
