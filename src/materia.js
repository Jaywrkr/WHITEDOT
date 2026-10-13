// Tres familias nuevas de materia (fase 4): cuerdas tensables, prisma de luz y membrana resonante.
// Gestos directos sobre el objeto, sin paneles: tensar y soltar, rasguear, girar, apretar y redoblar.
// Todo cuantizado a tempo con la escala del lugar; presupuesto ambiental compartido con otras instalaciones.
import {claimInstallationBar} from './installations.js';
import {WORLD_VISUAL,elementInk} from './visual.js';
import {MATERIA_KINDS,MATERIA_NAMES,STRING_COUNT,STRING_HALF,STRING_MAX_BEND,stringY,stringNote,stringAt,stringsCrossed,
 PRISM_RECEPTORS,PRISM_RADIUS,prismFan,prismLit,receptorAngle,PRISM_DEGREES,MEMBRANE_RADIUS,membraneHit,createMateriaSite,normalizeMateriaSites} from './materia-music.js';
const TAU=Math.PI*2;

export function initialize(runtime){
 const cache=new Map(),S=()=>runtime.S,$=runtime.$;let previousState=runtime.S,drag=null;
 S().materiaSites=normalizeMateriaSites(S().materiaSites);
 const surface=()=>runtime.inWorld()&&(S().layer||'superficie')==='superficie';
 const available=()=>surface()&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])');
 function nearby(radius=600){
  if(!surface())return [];const size=runtime.REG*runtime.WCH,rx=Math.floor(S().wx/size),ry=Math.floor(S().wy/size),out=[];
  for(let x=rx-1;x<=rx+1;x++)for(let y=ry-1;y<=ry+1;y++){
   const key=`${x},${y}`;let sites=cache.get(key);
   if(!sites){const region=runtime.regionOfPos((x+.5)*size,(y+.5)*size);sites=MATERIA_KINDS.map(k=>createMateriaSite(k,region,size,runtime.seedOf,runtime.rng)).filter(Boolean);
    for(const site of sites){const saved=S().materiaSites[site.id];if(site.kind==='prism'&&Number.isFinite(saved?.angle))site.angle=saved.angle;}
    cache.set(key,sites);while(cache.size>64)cache.delete(cache.keys().next().value);}
   for(const site of sites)if(Math.hypot(site.x-S().wx,site.y-S().wy)<radius)out.push(site);
  }return out;
 }
 function remember(site){
  if(drag?.site===site&&site.kind==='prism')return;   // una vista previa no se guarda hasta soltar
  const saved=S().materiaSites;if(!saved[site.id]&&Object.keys(saved).length>=96)delete saved[Object.keys(saved)[0]];
  const first=!saved[site.id]?.seen;saved[site.id]={seen:true,...(site.kind==='prism'?{angle:site.angle}:{})};
  if(first){if(!S().help[site.kind]){S().help[site.kind]=true;runtime.say(runtime.VOZ[`materia_${site.kind}`],MATERIA_NAMES[site.kind]);}
   const kinds=new Set(Object.keys(saved).map(id=>id.split(':')[0]));if(kinds.size>=3)runtime.unlock('materia3');}
 }
 const lightUp=(site,time,extra)=>setTimeout(()=>{site.lit=1;extra?.();},Math.max(0,(time-(runtime.ac?.currentTime||0))*1000));
 const played=[];   // últimas voces de materia (diagnóstico y pruebas)
 function voice(site,index,degree,time,volume,origin='player'){played.push(`installation:${site.kind}:${index}`);if(played.length>64)played.shift();runtime.playVoice(`installation:${site.kind}:${index}`,degree,time,site.region,false,volume,site,origin);}
 // ---------- cuerdas ----------
 function pluck(site,i,bend,origin='player'){
  const n=stringNote(i,bend);runtime.beatSoon(t=>{voice(site,i,n.degree,t,n.volume,origin);lightUp(site,t,()=>{site.vib=Object.assign(site.vib||[],{[i]:1});});},null,origin);
  if(origin==='player'){runtime.driveInfluence?.(site.region,n.channel,.3+n.amount*.4,i);runtime.creativeAction?.(n.channel,'model');runtime.unlock('cuerda1');if(n.amount>.85)runtime.unlock('cuerdaTensa');}
 }
 // ---------- prisma ----------
 function prismChord(site,origin='player'){
  const lit=prismLit(site.angle,site.offset);if(!lit.length)return;
  runtime.beatSoon(t=>{lit.forEach((k,j)=>voice(site,Math.min(4,k),PRISM_DEGREES[k],t+j*runtime.SIX,.1,origin));lightUp(site,t);},null,origin);
  if(origin==='player'){runtime.driveInfluence?.(site.region,lit.length>2?'space':'melody',.25+lit.length*.1,lit.length);runtime.creativeAction?.('melody','model');runtime.unlock('prisma1');if(lit.length>=3)runtime.unlock('prismaArcoiris');}
 }
 // ---------- membrana ----------
 function strike(site,hit,origin='player'){
  runtime.beatSoon(t=>{voice(site,hit.zone,hit.degree,t,hit.volume,origin);lightUp(site,t,()=>site.ripples.push({r:hit.r*MEMBRANE_RADIUS,a:1}));},null,origin);
  if(origin==='player'){runtime.driveInfluence?.(site.region,hit.zone?'groove':'bass',.35,hit.degree);runtime.creativeAction?.(hit.zone?'groove':'bass','model');runtime.unlock('membrana1');}
 }
 // ---------- gestos ----------
 const local=(site,e)=>({x:S().wx+e.clientX-runtime.W/2-site.x,y:S().wy+e.clientY-runtime.H/2-site.y});
 function down(e){
  if(drag)return true;if(!e.isPrimary||e.target!==$('w')||!available())return false;
  let match=null;
  for(const site of nearby(260)){const p=local(site,e);
   if(site.kind==='strings'&&Math.abs(p.x)<STRING_HALF+6&&Math.abs(p.y)<STRING_COUNT*12){const i=stringAt(p.x,p.y);match={site,mode:i>=0?'bend':'strum',string:i,y0:p.y,x0:p.x};break;}
   if(site.kind==='prism'&&Math.hypot(p.x,p.y)<40){match={site,mode:'rotate',start:Math.atan2(p.y,p.x),angle:site.angle};break;}
   if(site.kind==='membrane'){const hit=membraneHit(p.x,p.y);if(hit){match={site,mode:'press',hit,p};break;}}
  }
  if(!match)return false;
  runtime.audio();runtime.stopAutopilot?.();runtime.ptr=null;runtime.tapStart=null;drag={...match,pointer:e.pointerId,owner:S()};remember(match.site);
  if(match.mode==='press'){strike(match.site,match.hit);drag.rollFrom=runtime.MU.step;}
  try{$('w').setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();return true;
 }
 function move(e){
  if(drag?.pointer!==e.pointerId)return false;if(!available()||drag.owner!==S()){cancel();return true;}
  const site=drag.site,p=local(site,e);
  if(drag.mode==='bend')site.bends[drag.string]=Math.max(-STRING_MAX_BEND,Math.min(STRING_MAX_BEND,p.y-stringY(drag.string)));
  else if(drag.mode==='strum'){for(const i of stringsCrossed(drag.y0,p.y))pluck(site,i,8);drag.y0=p.y;}
  else if(drag.mode==='rotate'){site.angle=((drag.angle+Math.atan2(p.y,p.x)-drag.start)%TAU+TAU)%TAU;}
  else if(drag.mode==='press'){const hit=membraneHit(p.x,p.y);if(hit)drag.hit=hit;drag.p=p;}
  e.preventDefault();return true;
 }
 function up(e){
  if(drag?.pointer!==e.pointerId)return false;const d=drag;drag=null;
  if(e.type!=='pointerup'){cancelDrag(d);return true;}
  if(d.mode==='bend'){const b=d.site.bends[d.string];d.site.bends[d.string]=0;if(Math.abs(b)>4)pluck(d.site,d.string,b);else pluck(d.site,d.string,0);}
  else if(d.mode==='rotate'){remember(d.site);prismChord(d.site);runtime.save();}
  return true;
 }
 function cancelDrag(d){if(!d)return;if(d.mode==='rotate')d.site.angle=d.angle;if(d.mode==='bend')d.site.bends[d.string]=0;}
 function cancel(){const d=drag;drag=null;cancelDrag(d);}
 function tick(){if(previousState!==S()){cancel();cache.clear();previousState=S();S().materiaSites=normalizeMateriaSites(S().materiaSites);}if(drag&&!available())cancel();}
 // ---------- reloj musical ----------
 function step(s,bar,time){
  // Redoble: mantener la membrana toca en cada corchea, siguiendo el dedo.
  if(drag?.mode==='press'&&s%2===0&&runtime.MU.step!==drag.rollFrom&&available())strike(drag.site,{...drag.hit,volume:drag.hit.volume*.7},'player');
  if(!surface()||document.hidden||document.querySelector('.modal:not([hidden])')||!S().sound||runtime.ac?.state!=='running'||runtime.currentPocket?.()?.kind==='quiet')return;
  for(const site of nearby(320)){
   if(!S().materiaSites[site.id]?.seen||drag?.site===site)continue;
   if(site.kind==='prism'&&bar%2===0&&s===0){const lit=prismLit(site.angle,site.offset);if(lit.length&&claimInstallationBar(runtime,bar)){const k=lit[Math.floor(bar/2)%lit.length];voice(site,Math.min(4,k),PRISM_DEGREES[k],time,.07,'ambient');lightUp(site,time);break;}}
   if(site.kind==='strings'&&bar%4===1&&s===8&&claimInstallationBar(runtime,bar)){voice(site,bar%8<4?0:2,0,time,.08,'ambient');lightUp(site,time);break;}
   if(site.kind==='membrane'&&bar%4===2&&(s===0||s===10)&&claimInstallationBar(runtime,bar)){voice(site,0,0,time,.1,'ambient');lightUp(site,time,()=>site.ripples.push({r:4,a:.6}));break;}
  }
 }
 function sources(){return nearby(260).map(site=>({object:site,kind:`installation:${site.kind}:0`,name:MATERIA_NAMES[site.kind],distance:Math.hypot(site.x-S().wx,site.y-S().wy)}));}
 // ---------- dibujo ----------
 function draw(t,dt,ox,oy,radius){
  tick();if(!surface())return;const ctx=runtime.cx;
  for(const site of nearby(radius+160)){
   const distance=Math.hypot(site.x-S().wx,site.y-S().wy),x=site.x+ox,y=site.y+oy,near=distance<200;site.lit=Math.max(0,site.lit-dt*2);
   const wave=runtime.waves.length&&runtime.hitW(site.x,site.y);
   if(wave&&site.wave!==wave){site.wave=wave;remember(site);runtime.wsoon(wave,time=>{if(site.kind==='prism'){const lit=prismLit(site.angle,site.offset);lit.forEach((k,j)=>voice(site,Math.min(4,k),PRISM_DEGREES[k],time+j*runtime.SIX,.09));}else if(site.kind==='strings'){[0,1,2,3].forEach(i=>voice(site,i,stringNote(i,0).degree,time+i*runtime.SIX*.5,.09));}else voice(site,0,0,time,.16);lightUp(site,time);});}
   ctx.save();ctx.translate(x,y);ctx.lineWidth=WORLD_VISUAL.line;const ink=elementInk(site.kind==='membrane'?'wood':site.kind==='prism'?'glass':'metal',site.hue,site.lit>.5);
   if(site.kind==='strings'){
    site.vib=(site.vib||[]).map(v=>Math.max(0,(v||0)-dt*1.6));
    ctx.strokeStyle=ink;ctx.globalAlpha=.75;ctx.beginPath();ctx.moveTo(-STRING_HALF-8,-46);ctx.lineTo(-STRING_HALF-8,46);ctx.moveTo(STRING_HALF+8,-46);ctx.lineTo(STRING_HALF+8,46);ctx.stroke();
    for(let i=0;i<STRING_COUNT;i++){const sy=stringY(i),bend=site.bends[i],vib=(site.vib[i]||0)*7*Math.sin(t/18+i);
     ctx.strokeStyle=elementInk('metal',site.hue+i*18,(site.vib[i]||0)>.4);ctx.globalAlpha=.55+(site.vib[i]||0)*.4;ctx.lineWidth=i<2?2:1.2;
     ctx.beginPath();ctx.moveTo(-STRING_HALF,sy);ctx.quadraticCurveTo(drag?.site===site&&drag.string===i?drag.x0:0,sy+bend*2+vib,STRING_HALF,sy);ctx.stroke();}
    if(near){ctx.globalAlpha=.8;ctx.fillStyle=WORLD_VISUAL.gold;ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('Tensa y suelta · o rasguea',0,72);}
   }else if(site.kind==='prism'){
    // Haz blanco que entra por el oeste y sale abierto en colores que se superponen (mezcla aditiva).
    ctx.globalAlpha=.5;ctx.strokeStyle='#fff';ctx.beginPath();ctx.moveTo(-PRISM_RADIUS-20,0);ctx.lineTo(0,0);ctx.stroke();
    const rays=prismFan(site.angle),lit=prismLit(site.angle,site.offset);ctx.globalCompositeOperation='screen';
    for(const ray of rays){ctx.globalAlpha=.18+site.lit*.2;ctx.fillStyle=`hsl(${(ray.hue+site.hue)%360},80%,60%)`;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,PRISM_RADIUS+10,ray.angle-.07,ray.angle+.07);ctx.closePath();ctx.fill();}
    ctx.globalCompositeOperation='source-over';
    for(let k=0;k<PRISM_RECEPTORS;k++){const a=receptorAngle(k,site.offset),rx=Math.cos(a)*PRISM_RADIUS,ry=Math.sin(a)*PRISM_RADIUS,on=lit.includes(k);
     ctx.globalAlpha=on?.9:.35;ctx.strokeStyle=on?WORLD_VISUAL.gold:elementInk('glass',site.hue+k*40);ctx.beginPath();ctx.moveTo(rx,ry-8);ctx.lineTo(rx+6,ry);ctx.lineTo(rx,ry+8);ctx.lineTo(rx-6,ry);ctx.closePath();ctx.stroke();}
    ctx.rotate(site.angle);ctx.globalAlpha=.85;ctx.strokeStyle=ink;ctx.beginPath();for(let i=0;i<3;i++){const a=i/3*TAU-Math.PI/2;ctx[i?'lineTo':'moveTo'](Math.cos(a)*26,Math.sin(a)*26);}ctx.closePath();ctx.stroke();ctx.globalAlpha=.12;ctx.fillStyle=ink;ctx.fill();ctx.rotate(-site.angle);
    if(near){ctx.globalAlpha=.8;ctx.fillStyle=WORLD_VISUAL.gold;ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText(`Gira el prisma · ${lit.length} de ${PRISM_RECEPTORS} cristales`,0,PRISM_RADIUS+30);}
   }else{
    site.ripples=site.ripples.filter(r=>(r.a-=dt*1.4)>0);for(const r of site.ripples){r.r+=dt*60;ctx.globalAlpha=r.a*.6;ctx.strokeStyle=ink;ctx.beginPath();ctx.arc(0,0,Math.min(MEMBRANE_RADIUS,r.r),0,TAU);ctx.stroke();}
    ctx.globalAlpha=.8;ctx.strokeStyle=ink;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,MEMBRANE_RADIUS,0,TAU);ctx.stroke();ctx.lineWidth=WORLD_VISUAL.line;
    ctx.globalAlpha=.3;ctx.beginPath();ctx.arc(0,0,MEMBRANE_RADIUS*.42,0,TAU);ctx.stroke();
    if(drag?.site===site&&drag.p){ctx.globalAlpha=.6;ctx.fillStyle=WORLD_VISUAL.gold;ctx.beginPath();ctx.arc(drag.p.x,drag.p.y,6,0,TAU);ctx.fill();}
    if(near){ctx.globalAlpha=.8;ctx.fillStyle=WORLD_VISUAL.gold;ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('Toca · mantén para redoblar',0,MEMBRANE_RADIUS+24);}
   }
   ctx.restore();
  }
 }
 addEventListener('blur',()=>{cancel();runtime.save();});
 Object.defineProperties(runtime,{materiaPlayed:{get:()=>played},materiaPointerDown:{get:()=>down},materiaPointerMove:{get:()=>move},materiaPointerUp:{get:()=>up},drawMateria:{get:()=>draw},materiaStep:{get:()=>step},
  materiaSources:{get:()=>sources},nearbyMateria:{get:()=>nearby},materiaDrag:{get:()=>drag},cancelMateria:{get:()=>cancel},materiaPluck:{get:()=>pluck},materiaStrike:{get:()=>strike},materiaPrismChord:{get:()=>prismChord}});
}
