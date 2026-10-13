import {WORLD_VISUAL,jamHudTop} from './visual.js';
// Hacer música en un lugar: looper de ecos y banda de criaturas (estilo Incredibox).
// - Looper: el botón ⟳ graba 2 compases de lo que TÚ haces sonar (pulsos, toques, luces) y lo deja
//   en el mundo como un "eco" que se repite mientras estás cerca. Máximo 4 ecos. Junto a un eco, el
//   botón lo borra.
// - Banda: al tocar una criatura, se une con su papel musical (bajo, percusión, acordes o melodía) y te
//   sigue tocando su parte a tempo. Un papel por criatura; una nueva del mismo papel reemplaza a la anterior.
//   Combos: banda completa, familia (todas del mismo continente) y viajeros (cuatro continentes).

export const LOOP_STEPS=32,MAX_ECOS=4,MAX_EVENTS=48;
export const BAND_ROLES=[['bajo','B','Bajo'],['perc','P','Percusión'],['acorde','A','Acordes'],['melodia','M','Melodía']];
const roleSlot=r=>r==='bajo'?'bajo':r==='perc'?'perc':r==='acorde'?'acorde':'melodia';

// Partes de la banda: qué paso del compás toca cada papel (grado relativo, volumen, nota completa).
export function bandHits(slot,s,bar,motif){
 switch(slot){
  case 'bajo':return ({0:[0,1],6:[0,.7],10:[4,.8],14:[2,.5]})[s]||null;
  case 'perc':return s===4||s===12?[0,1]:s%4===2?[1,.45]:null;
  case 'acorde':return s===0&&bar%2===0?[0,.9,true]:s===8&&bar%2===1?[2,.6,true]:null;
  case 'melodia':{if(bar%2===0)return null;const i=[0,3,8,11].indexOf(s);return i<0?null:[motif[i%motif.length]%7,.8];}
 }
 return null;
}

export function initialize(runtime){
 const S=()=>runtime.S,MU=()=>runtime.MU,layer=()=>S().layer||"superficie";
 const loop={armed:false,rec:null,ecos:[],replaying:false,inputMs:0};
 const band={members:{},combos:{}};
 const suppressed=new Map();

 // ---------- looper ----------
 const markInput=()=>{loop.inputMs=performance.now();};
 function eraseEcho(index){
  if(index<0)return false;const removed=loop.ecos[index];if(removed.auto)suppressed.set(removed.sourceKey,{x:removed.x,y:removed.y,layer:removed.layer});loop.ecos.splice(index,1);runtime.toast('<em>Eco</em> · borrado');ui();return true;
 }
 function tapEcho(x,y){
  if(!runtime.inWorld()||runtime.scanning||[...document.querySelectorAll('.modal')].some(m=>!m.hidden))return false;
  const wx=S().wx+x-runtime.W/2,wy=S().wy+y-runtime.H/2;
  let nearest=-1,distance=32;
  loop.ecos.forEach((e,i)=>{if((e.layer||'superficie')!==layer())return;const d=Math.hypot(e.x-wx,e.y-wy);if(d<distance){nearest=i;distance=d;}});
  if(eraseEcho(nearest))return true;
  if(layer()!=='superficie')return false;
  let slot=null;distance=24;for(const [key,member] of Object.entries(band.members)){const d=Math.hypot(member.x-wx,member.y-wy);if(d<distance){slot=key;distance=d;}}
  if(slot){if(band.members[slot].source)band.members[slot].source.follow=0;delete band.members[slot];runtime.toast('Banda · voz soltada');ui();return true;}return false;
 }
 function loopButton(){
  if(!runtime.inWorld())return;const s=S(),near=loop.ecos.findIndex(e=>(e.layer||"superficie")===layer()&&Math.hypot(e.x-s.wx,e.y-s.wy)<90);
  if(near>=0&&!loop.rec&&!loop.armed){eraseEcho(near);return;}
  if(loop.rec||loop.armed){loop.armed=false;loop.rec=null;runtime.toast('<em>Eco</em> · cancelado');ui();return;}
  loop.armed=true;runtime.toast('<em>Eco</em> · graba en el próximo compás: toca, pulsa, junta luces');ui();
  if(!s.help.eco){s.help.eco=true;runtime.say(runtime.VOZ.eco,'Eco');}
 }
 // Llamado por playVoice: guarda lo que suena por acciones del jugador durante la grabación.
 function autoPin(kind,index,region,volume,source,origin){
  if(!S().autoPins||origin!=='player'||loop.replaying||loop.armed||loop.rec||!runtime.inWorld()||!region||!source||!Number.isFinite(source.x)||!Number.isFinite(source.y)||kind==='pulso'||kind==='luz'||kind.startsWith('forma:'))return;
  const sourceKey=`${layer()}:${kind}:${source.id||`${source.x},${source.y}`}`;
  if(suppressed.has(sourceKey))return;
  const voice=runtime.getVoice(kind,region),slot=roleSlot(voice.role),existing=loop.ecos.find(e=>e.auto&&e.slot===slot);
  const ev={step:0,kind,index,region,full:false,volume:(volume??1)*.5,source:{id:source.id,personality:source.personality}};
  if(existing?.sourceKey===sourceKey){existing.events=[ev];return;}
  const replacement=loop.ecos.findIndex(e=>e.auto&&e.slot===slot);if(replacement>=0)loop.ecos.splice(replacement,1);
  if(loop.ecos.length>=MAX_ECOS)loop.ecos.shift();
  loop.ecos.push({x:source.x,y:source.y,layer:layer(),start:Math.ceil(runtime.MU.step/16)*16,events:[ev],lit:0,id:Math.random().toString(36).slice(2,7),auto:true,slot,sourceKey});
  runtime.unlock('fijarSonido');ui();
 }
 function togglePins(){
  S().autoPins=!S().autoPins;suppressed.clear();
  if(!S().autoPins){loop.ecos=loop.ecos.filter(e=>!e.auto);for(const member of Object.values(band.members))if(member.source)member.source.follow=0;band.members={};band.combos={};runtime.MU.singers=[];}
  runtime.toast(S().autoPins?'Sonidos fijos · toca un objeto para fijar su voz':'Sonidos libres · los ecos automáticos se soltaron');ui();runtime.save();
 }
 function loopTap(kind,index,time,region,full,volume,source,origin){
  autoPin(kind,index,region,volume,source,origin);
  const r=loop.rec;if(!r||loop.replaying||origin!=='player'||r.layer!==layer())return;   // solo lo que causaste tú
  const step=Math.round((time-r.t0)/runtime.SIX);if(step<0||step>=LOOP_STEPS||r.events.length>=MAX_EVENTS)return;
  r.events.push({step,kind,index,regionKey:region.key,region,source:source?{id:source.id,personality:source.personality}:null,full:!!full,volume:volume??1});
 }
 // Cada semicorchea en el Mundo: empezar o terminar la grabación y reproducir los ecos cercanos.
 function loopStep(s,step,t){
  const st=S();
  for(const [id,point] of suppressed)if(point.layer!==layer()||Math.hypot(point.x-st.wx,point.y-st.wy)>75)suppressed.delete(id);
  while(suppressed.size>64)suppressed.delete(suppressed.keys().next().value);
  if(loop.armed&&s===0){loop.armed=false;loop.rec={t0:t,start:step,events:[],x:st.wx,y:st.wy,layer:layer()};ui();}
  else if(loop.rec&&step-loop.rec.start>=LOOP_STEPS){const r=loop.rec;loop.rec=null;
   if(!r.events.length)runtime.toast('<em>Eco</em> · no sonó nada tuyo. Toca algo mientras graba');
   else{if(loop.ecos.length>=MAX_ECOS)loop.ecos.shift();loop.ecos.push({x:r.x,y:r.y,layer:r.layer,start:step,events:r.events,lit:0,id:Math.random().toString(36).slice(2,7)});
    st.ecosN=(st.ecosN||0)+1;runtime.toast(`<em>Eco</em> · ${r.events.length} sonidos en bucle`);runtime.unlock('eco1');if(loop.ecos.length>=MAX_ECOS)runtime.unlock('eco4');}
   ui();}
  for(const e of loop.ecos){if((e.layer||"superficie")!==layer())continue;const d=Math.hypot(e.x-st.wx,e.y-st.wy);if(d>900)continue;const idx=((step-e.start)%LOOP_STEPS+LOOP_STEPS)%LOOP_STEPS;
   for(const ev of e.events){if(ev.step!==idx)continue;const region=ev.region;if(!region)continue;
    loop.replaying=true;try{runtime.playVoice(ev.kind,ev.index,t,region,ev.full,ev.volume,{...ev.source,x:e.x,y:e.y},"echo");}finally{loop.replaying=false;}
    setTimeout(()=>{e.lit=1;},Math.max(0,(t-runtime.ac.currentTime)*1000));}}
 }

 // ---------- banda ----------
 function bandJoin(o,sp){
  if(!S().autoPins)return;
  const s=S(),key=sp.id.split(':')[0].split(',').map(Number),region=runtime.regionOfPos((key[0]+.5)*runtime.REG*runtime.WCH,(key[1]+.5)*runtime.REG*runtime.WCH);
  const voice=runtime.getVoice?.('forma:'+sp.id,region);if(!voice)return;const slot=roleSlot(voice.role);
  const prev=band.members[slot];if(prev&&prev.sp.id===sp.id)return;
  if(prev?.source)prev.source.follow=0;
  band.members[slot]={source:o,sp,region,slot,personality:o.personality,x:o.x,y:o.y,lit:0,continent:region.continent?.id||null};
  runtime.toast(`<em>Banda</em> · ${sp.name} toca ${BAND_ROLES.find(r=>r[0]===slot)[2].toLowerCase()}`);
  if(!s.help.banda){s.help.banda=true;runtime.say(runtime.VOZ.banda,'Banda');}
  checkCombos();
 }
 function checkCombos(){
  const m=Object.values(band.members);if(m.length<4)return;
  runtime.unlock('banda4');if(!band.combos.full){band.combos.full=true;runtime.toast('<em>Banda completa</em> · todo suena');runtime.flash=Math.max(runtime.flash,.6);}
  const conts=new Set(m.map(x=>x.continent));
  if(conts.size===1&&m[0].continent)runtime.unlock('familia');
  if(conts.size===4)runtime.unlock('viajeros');
 }
 function bandStep(s,bar,t){
  if(layer()!=="superficie"||!S().autoPins)return;
  const m=band.members,list=Object.values(m);if(list.length<2)return;   // con una sola criatura no hay banda todavía
  if(list.length===4)MU().E=Math.max(MU().E,.7);
  for(const x of list){const h=bandHits(x.slot,s,bar,x.sp.motif||[0,2,4]);if(!h)continue;
   runtime.playVoice('forma:'+x.sp.id,(x.sp.deg||0)+h[0],t,x.region,!!h[2],h[1]*(x.personality?.volume||1),x,"band");
   setTimeout(()=>{x.lit=1;},Math.max(0,(t-runtime.ac.currentTime)*1000));}
 }

 // ---------- dibujo ----------
 function draw(t,dt,ox,oy,b){
  const cx=runtime.cx,s=S(),W=runtime.W,H=runtime.H;
  // Ecos: anillos que laten cuando suenan.
  for(const e of loop.ecos){if((e.layer||"superficie")!==layer())continue;e.lit=Math.max(0,e.lit-dt*3);const x=e.x+ox,y=e.y+oy;if(x<-60||y<-60||x>W+60||y>H+60)continue;
   cx.globalAlpha=.35+.5*e.lit;cx.strokeStyle=WORLD_VISUAL.echo;cx.lineWidth=WORLD_VISUAL.line;cx.beginPath();cx.arc(x,y,14+e.lit*8,0,6.283);cx.stroke();
   cx.globalAlpha=.2;cx.beginPath();cx.arc(x,y,26,0,6.283);cx.stroke();cx.globalAlpha=.8;cx.fillStyle='#9fe8ff';cx.font='9px monospace';cx.textAlign='center';cx.fillText(e.auto?'fijo · toca para soltar':'eco · toca para borrar',x,y+40);cx.beginPath();cx.moveTo(x-4,y-4);cx.lineTo(x+4,y+4);cx.moveTo(x+4,y-4);cx.lineTo(x-4,y+4);cx.stroke();}
  // Banda: siguen al pixel en formación, cada una en su lugar.
  const slots=['bajo','perc','acorde','melodia'];
  slots.forEach((sl,i)=>{const x=band.members[sl];if(!x)return;x.lit=Math.max(0,x.lit-dt*2.5);
   const a=Math.PI*.6+i*Math.PI*.27,tx=s.wx+Math.cos(a)*58,ty=s.wy+Math.sin(a)*58+Math.sin(t/400+i)*4;x.x+=(tx-x.x)*Math.min(1,dt*4);x.y+=(ty-x.y)*Math.min(1,dt*4);
   cx.globalAlpha=.5;cx.strokeStyle=WORLD_VISUAL.echo;cx.lineWidth=1;cx.beginPath();cx.arc(x.x+ox,x.y+oy,12,0,Math.PI*2);cx.stroke();
   cx.globalAlpha=.85;runtime.drawSprite(x.sp.bits,x.x+ox,x.y+oy,(x.sp.cell||2)*(1+x.lit*.5),x.lit>.1?'#fff':x.sp.col);});
  // Ranuras de la banda (abajo, discretas).
  const n=Object.keys(band.members).length;if(n){const panels=['fxPanel','glassPanel','mirrorPanel','patchPanel','scanner','routeHud','autopilotHud'].map(id=>runtime.$(id)).filter(p=>p&&!p.hidden),panelTop=panels.length?Math.min(...panels.map(p=>p.getBoundingClientRect().top)):null;
   const y0=jamHudTop(H,panelTop,runtime.$('toast')?.classList.contains('on')),w=26;
   BAND_ROLES.forEach(([sl,l],i)=>{const x=W/2+(i-1.5)*(w+6),on=!!band.members[sl];cx.globalAlpha=on?.9:.3;cx.strokeStyle=on?runtime.GOLD:'#fff';cx.lineWidth=1;cx.strokeRect(x-w/2,y0,w,18);
    cx.fillStyle=on?runtime.GOLD:'#fff';cx.font='10px monospace';cx.textAlign='center';cx.fillText(l,x,y0+13);});
   if(loop.rec){const k=Math.min(1,(runtime.MU.step-loop.rec.start)/LOOP_STEPS);cx.globalAlpha=.9;cx.fillStyle='#ff6b6b';cx.fillRect(W/2-60,y0-10,120*k,3);cx.globalAlpha=.4;cx.strokeStyle='#ff6b6b';cx.strokeRect(W/2-60,y0-10,120,3);}}
  if(loop.rec||loop.armed){const progress=loop.rec?Math.min(1,(runtime.MU.step-loop.rec.start)/LOOP_STEPS):1;cx.globalAlpha=.8;cx.strokeStyle=loop.rec?'#ff6b6b':runtime.GOLD;cx.lineWidth=2;cx.beginPath();cx.arc(W/2,H/2,30,-Math.PI/2,-Math.PI/2+progress*Math.PI*2);cx.stroke();}
  cx.globalAlpha=1;
 }
 function ui(){const option=runtime.$('bAutoPins');if(option){option.setAttribute('aria-pressed',String(!!S().autoPins));option.querySelector('span').textContent=S().autoPins?'Fijar sonidos: sí':'Fijar sonidos: no';}const btn=runtime.$('bLoop');if(!btn)return;btn.hidden=!runtime.inWorld();btn.classList.toggle('rec',!!loop.rec);btn.classList.toggle('armed',loop.armed);}
 function cancelRecording(){loop.armed=false;loop.rec=null;ui();}
 function reset(){for(const member of Object.values(band.members))if(member.source)member.source.follow=0;suppressed.clear();loop.armed=false;loop.rec=null;loop.ecos=[];band.members={};band.combos={};ui();}

 runtime.$('bAutoPins').onclick=togglePins;ui();
 const btn=runtime.$('bLoop');if(btn)btn.onclick=e=>{e.stopPropagation();btn.blur();runtime.audio();loopButton();};
 Object.defineProperties(runtime,{
  toggleSoundPins:{get:()=>togglePins},tapEcho:{get:()=>tapEcho},cancelLoopRecording:{get:()=>cancelRecording},loopTap:{get:()=>loopTap},loopStep:{get:()=>loopStep},markInput:{get:()=>markInput},loopButton:{get:()=>loopButton},
  bandJoin:{get:()=>bandJoin},bandStep:{get:()=>bandStep},drawJam:{get:()=>draw},jamUI:{get:()=>ui},resetJam:{get:()=>reset},
  jam:{get:()=>({loop,band})}
 });
}
