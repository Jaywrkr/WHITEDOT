import {createSoundTrail,normalizeSoundTrails,captureTrailTap} from './sound-trail-model.js';
import {claimInstallationBar} from './installations.js';
import {elementInk,WORLD_VISUAL} from './visual.js';
const LABELS=['Escucha la huella','Responde al ritmo','Despierta el instrumento','Instrumento despierto'];
export function initialize(runtime){
 const S=()=>runtime.S,cache=new Map(),forcedParam=new URLSearchParams(location.search).get('encounter')==='trail',forced=()=>forcedParam||!!runtime.labTrail;let previous=S(),gesture=null,elapsed=0,sequence=null,sequenceTrail=null,focus=null,lastBar=-Infinity;
 S().soundTrails=normalizeSoundTrails(S().soundTrails);
 const available=()=>runtime.inWorld()&&(S().layer||'superficie')==='superficie'&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])');
 const audible=()=>available()&&S().sound&&runtime.ac?.state==='running';
 const distance=p=>Math.hypot(p.x-S().wx,p.y-S().wy);
 function nearby(radius=700){
  if(!runtime.inWorld()||(S().layer||'superficie')!=='superficie')return [];
  const size=runtime.REG*runtime.WCH,rx=Math.floor(S().wx/size),ry=Math.floor(S().wy/size),out=[];
  for(let x=rx-1;x<=rx+1;x++)for(let y=ry-1;y<=ry+1;y++){
   const key=`${x},${y}`;if(!cache.has(key)){cache.set(key,createSoundTrail(runtime.regionOfPos((x+.5)*size,(y+.5)*size),size,runtime.seedOf,runtime.rng,forced()&&!!S().previewSeed&&key==='0,0'));while(cache.size>64)cache.delete(cache.keys().next().value);}
   const trail=cache.get(key);if(trail&&trail.nodes.some(p=>distance(p)<radius))out.push(trail);
  }return out;
 }
 const entry=t=>S().soundTrails[t.id]||{stage:0,seen:false};
 function remember(t,stage){const book=S().soundTrails;if(!book[t.id]&&Object.keys(book).length>=64)delete book[Object.keys(book)[0]];book[t.id]={stage,seen:true};runtime.save();}
 function advance(t,stage){remember(t,stage);elapsed=0;sequence=null;sequenceTrail=null;if(stage===3){runtime.unlock('instrumentoDespierto');runtime.save();}}
 function pause(){gesture=null;elapsed=0;sequence=null;sequenceTrail=null;}
 function tick(dt,paused){
  if(previous!==S()){previous=S();cache.clear();focus=null;lastBar=-Infinity;S().soundTrails=normalizeSoundTrails(S().soundTrails);pause();}
  if(paused||!available()){pause();return;}
  const closest=nearby().map(t=>({t,node:t.nodes[Math.min(2,entry(t).stage)]})).sort((a,b)=>distance(a.node)-distance(b.node))[0];
  if(focus!==closest?.t){elapsed=0;sequence=null;sequenceTrail=null;focus=closest?.t||null;}
  if(!focus)return;const e=entry(focus),node=focus.nodes[Math.min(2,e.stage)];
  if(distance(node)>65){elapsed=0;sequence=null;sequenceTrail=null;return;}
  if(!e.seen)remember(focus,e.stage);
  if(!audible()){elapsed=0;sequence=null;sequenceTrail=null;return;}
  if(e.stage===0&&runtime.MU.speed<.06){elapsed+=Math.max(0,Math.min(.25,dt));if(elapsed>=2)advance(focus,1);}else elapsed=0;
 }
 function hit(e){
  const x=S().wx+e.clientX-runtime.W/2,y=S().wy+e.clientY-runtime.H/2;
  for(const t of nearby(400)){const stage=entry(t).stage,node=t.nodes[Math.min(2,stage)];if(Math.hypot(node.x-x,node.y-y)<28&&distance(node)<180)return {t,node,stage};}return null;
 }
 function down(e){if(gesture)return true;if(!e.isPrimary||!available())return false;const target=hit(e);if(!target)return false;
  runtime.audio();runtime.stopAutopilot?.();gesture={...target,id:e.pointerId,time:performance.now(),x:e.clientX,y:e.clientY,moved:false};try{runtime.$('w').setPointerCapture(e.pointerId);}catch(_){}return true;
 }
 function move(e){if(gesture?.id!==e.pointerId)return false;if(!available()){pause();return true;}gesture.moved||=Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>10;return true;}
 function emit(t,node,time,origin='ambient',index=0){runtime.playVoice(`encounter:animal:${t.channel}`,index,time,t.region,false,origin==='player'?.14:.04,node,origin);}
 function up(e){if(gesture?.id!==e.pointerId)return false;const g=gesture;gesture=null;
  if(e.type!=='pointerup'||!audible()||g.moved||entry(g.t).stage!==g.stage||hit(e)?.t!==g.t)return true;
  if(g.stage===1){if(sequenceTrail!==g.t.id)sequence=null;sequenceTrail=g.t.id;sequence=captureTrailTap(sequence,performance.now()/1000,runtime.SIX,g.t.rhythm);if(sequence.count===3)advance(g.t,2);}
  if(g.stage===2&&performance.now()-g.time>=650){advance(g.t,3);runtime.driveInfluence(g.t.region,g.t.channel,.5,g.t.variant);runtime.creativeAction?.(g.t.channel,'cultivate');}
  if(g.stage!==2||entry(g.t).stage===3)runtime.beatSoon(time=>emit(g.t,g.node,time,'player'),null,'player');return true;
 }
 function bar(time,bar){
  if(!audible()||!focus||entry(focus).stage>1||distance(focus.nodes[entry(focus).stage])>140||bar-lastBar<4||runtime.currentPocket?.()?.kind==='quiet'||!claimInstallationBar(runtime,bar))return;
  lastBar=bar;const node=focus.nodes[entry(focus).stage];for(const step of focus.rhythm)emit(focus,node,time+runtime.SIX*step);
 }
 function draw(){
  if(!available())return;const c=runtime.cx;
  for(const t of nearby(500)){
   const e=entry(t),index=Math.min(2,e.stage),node=t.nodes[index],d=distance(node);if(d>400)continue;
   const x=runtime.W/2+node.x-S().wx,y=runtime.H/2+node.y-S().wy;
   c.save();c.strokeStyle=elementInk('wood',t.region.hue);c.fillStyle=c.strokeStyle;c.globalAlpha=.55;c.lineWidth=WORLD_VISUAL.line;
   c.beginPath();c.ellipse(x,y,23,12,0,0,Math.PI*2);c.stroke();
   for(let i=0;i<3;i++){c.beginPath();c.arc(x+(i-1)*12,y,i< (e.stage===1?(sequenceTrail===t.id?sequence?.count||0:0):e.stage===0?(focus===t?Math.floor(elapsed/2*3):0):3)?3:1.5,0,Math.PI*2);c.fill();}
   if(e.stage>=2){c.beginPath();c.moveTo(x-14,y+7);c.quadraticCurveTo(x,y-(e.stage===3?35:15),x+14,y+7);c.stroke();}
   if(d<95){c.font='9px monospace';c.textAlign='center';c.fillText(LABELS[e.stage],x,y+34,Math.min(240,runtime.W-32));c.fillText(e.stage===0?'Quédate quieto · Música activada':e.stage===1?'Escucha sus tres golpes · responde al ritmo':e.stage===2?'Mantén la huella para despertar':'Toca para hacerlo sonar',x,y+49,Math.min(280,runtime.W-32));}
   if(e.seen&&e.stage>0&&e.stage<3&&d>95&&d<650){const a=Math.atan2(node.y-S().wy,node.x-S().wx);c.globalAlpha=.2;for(let i=0;i<3;i++){c.beginPath();c.arc(runtime.W/2+Math.cos(a)*(70+i*8),runtime.H/2+Math.sin(a)*(70+i*8),1.5,0,Math.PI*2);c.fill();}}
   c.restore();
  }
 }
 function card(){const entries=Object.values(S().soundTrails||{});return entries.some(e=>e.seen)?`<article class="journal-card"><h3>Rastros musicales</h3><p>${entries.filter(e=>e.seen).length} rastros encontrados · ${entries.filter(e=>e.stage===3).length} instrumentos despertados. Escucha la primera huella, sigue sus puntos, responde al ritmo y mantén la última. Las etapas se conservan; las respuestas a medias se reinician al alejarte o pausar.</p></article>`:'';}
 runtime.ACH.push(['instrumentoDespierto','Algo estaba dormido','Sigue tres huellas musicales y despierta su instrumento.']);runtime.VOZ.instrumentoDespierto='Escuchar, responder y cuidar: este lugar vuelve a tener voz.';
 addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
 Object.defineProperties(runtime,{trailReset:{get:()=>()=>{cache.clear();}},trailTick:{get:()=>tick},trailDraw:{get:()=>draw},trailBar:{get:()=>bar},trailDown:{get:()=>down},trailMove:{get:()=>move},trailUp:{get:()=>up},trailEngaged:{get:()=>!!gesture},nearbyTrails:{get:()=>nearby},trailCard:{get:()=>card}});
}
