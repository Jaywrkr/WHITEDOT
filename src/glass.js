import {claimInstallationBar} from './installations.js';
import {WORLD_VISUAL,elementInk} from './visual.js';
import {ROLES} from './journal.js';
const TAU=Math.PI*2;
export function glassParameters(angles){
 if(!Array.isArray(angles)||angles.length!==3||!angles.every(Number.isFinite))throw Error('Invalid glass angles');
 const a=angles.map(x=>((x%TAU)+TAU)%TAU),alignment=(3+Math.cos(a[0]-a[1])+Math.cos(a[1]-a[2])+Math.cos(a[2]-a[0]))/6;
 return {degrees:a.map(x=>Math.floor(x/TAU*7)%7),accents:a.map(x=>Math.floor(x/TAU*16)%16),alignment,stride:alignment>.75?2:4};
}
export function normalizeGlassSites(saved){
 const out={};for(const [id,entry] of Object.entries(saved||{})){
  if(Object.keys(out).length>=64)break;
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
  const saved=S().glassSites;if(!saved[site.id]&&Object.keys(saved).length>=64)delete saved[Object.keys(saved)[0]];
  saved[site.id]={angles:[...site.angles],seen:true};
 }
 function emit(site,pane,time,origin='ambient'){
  const p=glassParameters(site.angles),source=site.plates[pane];
  runtime.playVoice(`installation:glass:${pane}`,p.degrees[pane],time,site.region,false,.55,source,origin);
  setTimeout(()=>{site.lit=1;},Math.max(0,(time-runtime.ac.currentTime)*1000));
 }
 function turn(site,pane,angle){
  if(!Number.isFinite(angle)||!Number.isInteger(pane)||pane<0||pane>2||!onSurface()||!site||Math.hypot(site.x-S().wx,site.y-S().wy)>180)return false;
  site.angles[pane]=((angle%TAU)+TAU)%TAU;remember(site);runtime.stopAutopilot();runtime.unlock('vidrio1');
  if(glassParameters(site.angles).alignment>.985)runtime.unlock('vidrioArmonia');
  const now=performance.now();if(now-site.lastInput>220){site.lastInput=now;runtime.beatSoon(t=>emit(site,pane,t,'player'),null,'player');}
  renderPanel();return true;
 }
 function renderPanel(){
  const site=state.site;if(!site)return;
  for(let i=0;i<3;i++){$(`glassAngle${i}`).value=Math.round(site.angles[i]/TAU*360);$(`glassValue${i}`).textContent=`${Math.round(site.angles[i]/TAU*360)}°`;$(`glassAngle${i}`).style.accentColor=elementInk('glass',site.hue+i*120);}
  const roles=site.plates.map((_,i)=>ROLES[runtime.getVoice(`installation:glass:${i}`,site.region).role]);
  $('glassInfo').textContent=roles.join(' · ')+` · ${glassParameters(site.angles).alignment>.75?'Resonancia cercana':'Respuestas espaciadas'}`;
 }
 function open(site,pane){runtime.closeMirrors?.();runtime.closePatchGarden?.();state.site=site;state.pane=pane;remember(site);$('glassPanel').hidden=false;renderPanel();if(!S().help.glass){S().help.glass=true;runtime.say(runtime.VOZ.glass,'Vidrios musicales');}}
 function close(){state.drag=null;state.site=null;$('glassPanel').hidden=true;runtime.save();}
 const screen=site=>({x:runtime.W/2+site.x-S().wx,y:runtime.H/2+site.y-S().wy});
 function down(e){
  if(!onSurface()||e.target!==$('w'))return false;
  const modal=[...document.querySelectorAll('.modal')].some(m=>!m.hidden);if(modal||runtime.scanning)return false;
  let match=null,best=18;
  for(const site of nearby(180)){const p=screen(site);site.angles.forEach((angle,i)=>{const d=Math.hypot(e.clientX-p.x-Math.cos(angle)*66,e.clientY-p.y-Math.sin(angle)*66);if(d<best){best=d;match={site,pane:i};}});}
  if(!match)return false;
  runtime.audio();runtime.stopAutopilot();runtime.ptr=null;runtime.tapStart=null;open(match.site,match.pane);state.drag={pointer:e.pointerId};try{$('w').setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();return true;
 }
 function move(e){if(state.drag?.pointer!==e.pointerId)return false;const p=screen(state.site);turn(state.site,state.pane,Math.atan2(e.clientY-p.y,e.clientX-p.x));e.preventDefault();return true;}
 function up(e){if(state.drag?.pointer!==e.pointerId)return false;state.drag=null;runtime.save();return true;}
 function tick(){if(previousState!==S()){cache.clear();previousState=S();S().glassSites=normalizeGlassSites(S().glassSites);close();}if(state.site&&(!onSurface()||Math.hypot(state.site.x-S().wx,state.site.y-S().wy)>220))close();}
 function step(step,bar,time){
  if(!onSurface()||!S().sound||runtime.ac?.state!=='running'||runtime.currentPocket?.()?.kind==='quiet')return;
  for(const site of nearby(300)){
   if(!S().glassSites[site.id]?.seen)continue;const p=glassParameters(site.angles),pane=Math.floor(bar/p.stride)%3;
   if(bar%p.stride===0&&step===p.accents[pane]&&claimInstallationBar(runtime,bar)){emit(site,pane,time);break;}
  }
 }
 function sources(){return nearby(250).flatMap(site=>site.plates.map((o,i)=>({object:o,kind:`installation:glass:${i}`,name:o.name,distance:Math.hypot(o.x-S().wx,o.y-S().wy)})));}
 function draw(t,dt,ox,oy,radius){
  tick();if(!onSurface())return;const ctx=runtime.cx;
  for(const site of nearby(radius+120)){
   const distance=Math.hypot(site.x-S().wx,site.y-S().wy),x=site.x+ox,y=site.y+oy;site.lit=Math.max(0,site.lit-dt*2);
   const wave=runtime.waves.length&&runtime.hitW(site.x,site.y);if(wave&&site.wave!==wave){site.wave=wave;remember(site);runtime.wsoon(wave,time=>emit(site,0,time,'player'));}
   ctx.save();ctx.translate(x,y);ctx.lineWidth=WORLD_VISUAL.line;
   site.angles.forEach((angle,i)=>{
    const color=elementInk('glass',site.hue+i*120);ctx.save();ctx.rotate(angle);ctx.translate((i-1)*12,0);ctx.strokeStyle=color;ctx.fillStyle=color;
    ctx.globalAlpha=.16+site.lit*.12;ctx.globalCompositeOperation='screen';ctx.fillRect(-28,-46,56,92);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.65;ctx.strokeRect(-28,-46,56,92);
    ctx.beginPath();for(let line=-3;line<=3;line++){ctx.moveTo(-24,line*11);ctx.lineTo(24,line*11);}ctx.globalAlpha=.24;ctx.stroke();ctx.restore();
    ctx.globalAlpha=distance<180?.85:.35;ctx.strokeStyle=color;ctx.beginPath();ctx.arc(Math.cos(angle)*66,Math.sin(angle)*66,9,0,TAU);ctx.stroke();
   });
   if(distance<180){ctx.globalAlpha=.8;ctx.fillStyle=WORLD_VISUAL.gold;ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('Gira los aros · tres vidrios',0,88);}
   ctx.restore();
  }
 }
 $('glassClose').onclick=close;
 for(let i=0;i<3;i++){$(`glassAngle${i}`).oninput=e=>{runtime.audio();turn(state.site,i,Number(e.target.value)/360*TAU);};$(`glassAngle${i}`).onchange=()=>runtime.save();}
 addEventListener('blur',()=>{state.drag=null;runtime.save();});
 Object.defineProperties(runtime,{glassTick:{get:()=>tick},glassPointerDown:{get:()=>down},glassPointerMove:{get:()=>move},glassPointerUp:{get:()=>up},drawGlass:{get:()=>draw},glassStep:{get:()=>step},glassSources:{get:()=>sources},nearbyGlass:{get:()=>nearby},glassState:{get:()=>state},turnGlass:{get:()=>turn},closeGlass:{get:()=>close}});
}
