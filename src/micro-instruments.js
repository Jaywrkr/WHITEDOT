import {audibleTime} from './journey-pulse.js';
import {openSurface,prefersReducedMotion} from './frame-state.js';
import {MICRO_INSTRUMENTS,microChunk,microVoice,microPath,microPattern} from './micro-instruments-model.js';
import {contactEntry} from './contact.js';
import {polarDelta} from './body.js';
import {claimInstallationBar} from './installations.js';
export function initialize(runtime){
 const cache=new Map();let owner=runtime.S,clock=0,lastAmbient=-1;
 const surface=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'&&!runtime.labMode;
 const active=()=>surface()&&!document.hidden&&!runtime.scanning&&!runtime.noticeLane?.inspecting&&!openSurface('.modal:not([hidden])');
 function reset(){owner=runtime.S;cache.clear();clock=0;lastAmbient=-1;}
 function nearby(radius=500){
  if(owner!==runtime.S)reset();if(!surface())return [];radius=Math.max(0,Math.min(1200,radius));const out=[],size=runtime.WCH,{wx,wy}=runtime.S;
  for(let x=Math.floor((wx-radius)/size);x<=Math.floor((wx+radius)/size);x++)for(let y=Math.floor((wy-radius)/size);y<=Math.floor((wy+radius)/size);y++){
   const key=x+','+y;if(!cache.has(key)){const region=runtime.regionOfPos((x+.5)*size,(y+.5)*size);cache.set(key,microChunk(x,y,size,region,runtime.seedOf,runtime.rng));while(cache.size>64)cache.delete(cache.keys().next().value);}
   out.push(...cache.get(key).filter(o=>Math.hypot(o.x-wx,o.y-wy)<radius));
  }return out.sort((a,b)=>Math.hypot(a.x-wx,a.y-wy)-Math.hypot(b.x-wx,b.y-wy));
 }
 function emit(o,time,origin='player',index=0){
  if(!active()||!runtime.S.sound||runtime.ac?.state!=='running'||Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)>180)return false;
  const d=runtime.regionOfPos(o.x,o.y);if(runtime.playVoice('micro:'+o.kind,index,time,d,false,origin==='player'?.7:.3,o,origin)!==true)return false;
  o.onset=runtime.musicalTime?.(time)??time;runtime.microNoteCue?.({id:o.id,family:o.kind,voice:runtime.getVoice('micro:'+o.kind,d,o),time:o.onset,origin});return true;
 }
 function touch(o,origin='player'){
  if(!active()||clock-(o.last??-100)<.7)return false;o.last=clock;o.entry++;o.charge=1;
  const d=runtime.regionOfPos(o.x,o.y),def=MICRO_INSTRUMENTS[o.kind],voice=microVoice('micro:'+o.kind,o);
  if(origin==='player'){runtime.visualGesture?.(o.x,o.y);runtime.recordElement?.('micro:'+o.kind,d);runtime.touched?.();runtime.creativeAction?.(def.role==='perc'?'groove':def.role==='bajo'?'bass':'melody','model');}
  if(origin==='player'&&['grain','ring'].includes(o.kind)&&o.variant===63)runtime.collectRareCard?.('micro:'+o.kind,o,{context:{role:voice.role,instrument:voice.instrument,gesture:'contacto'}});
  if(origin==='player')runtime.save();const state=runtime.S;if(runtime.S.sound&&runtime.ac?.state==='running')runtime.beatSoon(time=>{if(state===runtime.S)emit(o,time,origin);},null,origin);return true;
 }
 function tick(dt){
  if(owner!==runtime.S)reset();if(!active())return;dt=Math.max(0,Math.min(.1,dt));clock+=dt;
  const body=runtime.body;if(!body?.ready||body.jump)return;
  for(const o of nearby(450)){
   const distance=Math.hypot(o.x-body.x,o.y-body.y),inside=distance<30;
   o.charge=Math.max(0,o.charge-dt*.18);o.dwell=inside?(o.dwell||0)+dt:0;
   if(contactEntry(o,inside))touch(o);
   if(distance<85){
    if(['acid','ring'].includes(o.kind)){o.turn+=polarDelta(o,{x:body.px,y:body.py},body);o.parameter=.5+Math.sin(o.turn)*.5;}
    else o.parameter=Math.max(.1,Math.min(1,1-distance/100));
    o.opticalPosition=o.parameter;
   }
  }
 }
 function step(s,bar,time){
  if(!active()||!runtime.S.sound||runtime.ac?.state!=='running')return;
  const o=nearby(110)[0];if(!o)return;const distance=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),held=distance<30&&(o.dwell||0)>.5,pattern=microPattern(o.kind,o.variant);
  if(held&&pattern.includes(s)){o.charge=1;const previous=o.playStep;o.playStep=s;
   try{emit(o,time,'player',o.kind==='arp'?pattern.indexOf(s)*2:0);}finally{if(previous===undefined)delete o.playStep;else o.playStep=previous;}return;}
  if(distance>=30&&distance<100&&s===0&&bar!==lastAmbient&&runtime.currentPocket?.()?.kind!=='quiet'&&claimInstallationBar(runtime,bar)){lastAmbient=bar;emit(o,time,'ambient');}
 }
 function pulse(origin='player'){if(!active())return false;let changed=false;for(const o of nearby(170).slice(0,2))changed=touch(o,origin)||changed;return changed;}
 function draw(t,ox,oy,radius){
  if(!surface())return;const c=runtime.cx,now=runtime.ac?audibleTime(runtime.ac):-100,still=runtime.S.reducedMotion||prefersReducedMotion();
  for(const o of nearby(Math.min(radius+40,1200))){const distance=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),elapsed=now-(o.onset??-1000),lit=runtime.S.sound&&elapsed>=0?Math.max(0,1-elapsed/.65):0,fade=runtime.worldOpacity?.(distance)??Math.max(0,1-distance/radius);if(fade<=.001)continue;
   c.save();c.translate(o.x+ox,o.y+oy);const response=runtime.reactivePose?.(o.id);if(response){c.translate(response.x,response.y);c.rotate(response.rotation);c.scale(response.sx,response.sy);}c.globalAlpha=fade*(.45+lit*.55);c.strokeStyle=runtime.musicInk?.(o,MICRO_INSTRUMENTS[o.kind].role)||'#fff';c.fillStyle=c.strokeStyle;c.lineWidth=lit?1.4:1;
   const scale=1+(still?0:lit*.15);c.scale(scale,scale);c.stroke(new Path2D(microPath(o.kind)));
   if(distance<100){c.globalAlpha=fade*(.25+lit*.55);c.beginPath();c.arc(0,0,27,-Math.PI/2,-Math.PI/2+(o.parameter||.35)*Math.PI*1.8);c.stroke();}
   if(lit){for(let i=0;i<3;i++){const a=o.phase+i*2.094+(still?0:elapsed*2),r=25+(still?0:elapsed*18);c.fillRect(Math.cos(a)*r-1,Math.sin(a)*r-1,2,2);}}
   c.restore();
  }
 }
 function sources(){return nearby(250).map(object=>({object,kind:'micro:'+object.kind,name:MICRO_INSTRUMENTS[object.kind].name,hint:MICRO_INSTRUMENTS[object.kind].hint,voice:runtime.getVoice('micro:'+object.kind,runtime.regionOfPos(object.x,object.y),object),distance:Math.hypot(object.x-runtime.S.wx,object.y-runtime.S.wy)}));}
 Object.defineProperties(runtime,{microNear:{get:()=>nearby},microTick:{get:()=>tick},microStep:{get:()=>step},microPulse:{get:()=>pulse},drawMicro:{get:()=>draw},microSources:{get:()=>sources},microTouch:{get:()=>touch},microCacheSize:{get:()=>cache.size}});
}
