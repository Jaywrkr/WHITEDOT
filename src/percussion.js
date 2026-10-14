import {RHYTHM_ELEMENTS,createRhythmElements,rhythmPattern} from './percussion-model.js';
import {contactEntry} from './contact.js';
import {polarDelta} from './body.js';
import {claimInstallationBar} from './installations.js';
import {WORLD_VISUAL,elementInk,elementAlpha} from './visual.js';
export function initialize(runtime){
 const cache=new Map();let owner=runtime.S,labKind=null,labObject=null,active=null,budget={bar:-1,hits:0,manual:0};
 const surface=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie';
 const available=()=>surface()&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])');
 const audible=()=>available()&&runtime.S.sound&&runtime.ac?.state==='running';
 function reset(){cache.clear();active=null;labObject=null;budget={bar:-1,hits:0,manual:0};owner=runtime.S;}
 function nearby(radius=400){
  if(owner!==runtime.S)reset();if(!surface())return [];
  if(labKind!==runtime.labRhythm){labKind=runtime.labRhythm;labObject=null;active=null;}
  if(RHYTHM_ELEMENTS[labKind]){
   if(!labObject){const h=Math.floor(runtime.REG/2)*runtime.WCH;labObject={id:'rhythm:lab:'+labKind,kind:labKind,x:h+80,y:h,variant:0,phase:0,touching:false,lit:0,cooldown:0,turn:0};}
   return Math.hypot(labObject.x-runtime.S.wx,labObject.y-runtime.S.wy)<radius?[labObject]:[];
  }
  const out=[],size=runtime.WCH,{wx:x,wy:y}=runtime.S;
  for(let a=Math.floor((x-radius)/size);a<=Math.floor((x+radius)/size);a++)for(let b=Math.floor((y-radius)/size);b<=Math.floor((y+radius)/size);b++){
   const key=a+','+b;if(!cache.has(key)){cache.set(key,createRhythmElements(a,b,size,runtime.regionOfPos((a+.5)*size,(b+.5)*size),runtime.seedOf,runtime.rng));while(cache.size>64)cache.delete(cache.keys().next().value);}
   out.push(...cache.get(key).filter(o=>Math.hypot(o.x-x,o.y-y)<radius));
  }return out.sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y));
 }
 const kindOf=o=>`rhythm:${o.kind}:${o.variant}`;
 function emit(o,time,strength=.55,origin='player',musicalBar=null){
  if(owner!==runtime.S||!audible()||Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)>120)return false;
  const bar=musicalBar??Math.max(0,Math.floor((runtime.MU?.step||0)/16));if(budget.bar!==bar)budget={bar,hits:0,manual:0};
  const counter=origin==='player'?'manual':'hits',limit=origin==='player'?4:2;
  if(budget[counter]>=limit)return false;budget[counter]++;
  const region=runtime.regionOfPos(o.x,o.y);
  // Short, dry-ish source patches, genre timing and the existing curated mix/spatial stage.
  runtime.playVoice(kindOf(o),o.variant,time,region,false,strength,o,origin);
  o.onset=time;runtime.percussionCue?.({kind:o.kind,instrument:runtime.getVoice(kindOf(o),region).instrument,time,origin});
  return true;
 }
 function gesture(o){
  const first=!runtime.S.rhythmFound?.[o.kind];
  if(o.kind==='fossil')runtime.collectRareCard?.('fossil',o);
  runtime.recordElement?.('rhythm:'+o.kind,runtime.regionOfPos(o.x,o.y));runtime.S.rhythmFound||={};runtime.S.rhythmFound[o.kind]=1;
  if(first&&o.kind==='fossil'){runtime.unlock?.('fosilRitmo');runtime.toast?.('<em>Fósil de ritmo</em> · Un pulso antiguo. Quédate para despertarlo.');}
  runtime.unlock?.('percusion1');if(Object.keys(runtime.S.rhythmFound).length>=4)runtime.unlock?.('percusion4');
  runtime.creativeAction?.('groove','model');runtime.touched?.();
  if(!audible())return;
  const state=runtime.S;runtime.beatSoon(t=>{if(state===runtime.S)emit(o,t);},null,'player');
 }
 function tick(dt){
  const objects=nearby(),b=runtime.body;
  if(!available()||!b?.ready||b.jump){active=null;for(const o of objects){o.touching=false;o.turn=0;}return;}
  active=null;
  for(const o of objects){
   o.lit=Math.max(0,o.lit-dt*2.5);o.cooldown=Math.max(0,o.cooldown-dt);
   const d=Math.hypot(b.x-o.x,b.y-o.y),spec=RHYTHM_ELEMENTS[o.kind],inside=d<25;
   const entered=contactEntry(o,inside);
   let action=entered;
   if(spec.gesture==='brush'&&inside&&b.speed>22&&o.cooldown===0)action=true;
   if(spec.gesture==='orbit'&&d>25&&d<65){o.turn+=Math.abs(polarDelta(o,{x:b.px,y:b.py},b));if(o.turn>Math.PI/3){o.turn=0;action=true;}}else if(!inside)o.turn=0;
   if(action&&o.cooldown===0){o.cooldown=.65;gesture(o);}
   if(inside&&spec.gesture==='hold'&&!active){active=o;if(entered)o.held=0;else o.held=(o.held||0)+dt;}
  }
 }
 function step(s,bar,time){
  if(owner!==runtime.S){reset();return;}
  if(!active||!audible()||active.held<.8||runtime.currentPocket?.()?.kind==='quiet'||runtime.cultureListening)return;
  const o=active,region=runtime.regionOfPos(o.x,o.y),pattern=rhythmPattern(o.kind,region.genre,o.variant+(o.kind==='fossil'?Math.floor(bar/4):0));
  if(s!==pattern[0]||!claimInstallationBar(runtime,bar))return;
  const swing=(runtime.GEN[region.genre].sw||0)*runtime.SIX;
  emit(o,time+((s%2)?swing:0),.28,'ambient',bar);
  emit(o,time+(pattern[1]-pattern[0])*runtime.SIX+((pattern[1]%2)?swing:0),.2,'ambient',bar);
 }
 function draw(t,dt,ox,oy,radius){
  const c=runtime.cx;
  for(const o of nearby(radius)){
   const elapsed=(runtime.ac?.currentTime||0)-(o.onset??-10),lit=elapsed>=0?Math.max(0,1-elapsed/.3):0;
   const spec=RHYTHM_ELEMENTS[o.kind],d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy);
   c.save();c.translate(o.x+ox,o.y+oy);c.globalAlpha=elementAlpha(d,radius,lit*.4);c.strokeStyle=elementInk(spec.material,runtime.regionOfPos(o.x,o.y).hue,lit>.1);c.fillStyle=c.strokeStyle;c.lineWidth=WORLD_VISUAL.line;
   c.beginPath();
   if(o.kind==='fossil'){c.arc(0,0,13,.3,5.8);c.moveTo(8,0);c.arc(0,0,8,0,5.5);c.moveTo(3,0);c.arc(0,0,3,0,4);}
   else if(o.kind==='stone'){c.ellipse(0,0,13+lit*2,9+lit*2,.2,0,6.283);c.moveTo(-5,0);c.lineTo(5,0);}
   else if(o.kind==='hollow'){c.ellipse(0,0,7,12,1,0,6.283);c.moveTo(-15,-8);c.lineTo(-9,-12);c.moveTo(9,12);c.lineTo(15,8);}
   else if(o.kind==='roots'){for(let i=0;i<3;i++){c.moveTo(-15,6-i*6);c.quadraticCurveTo(0,-5+lit*3,15,-6+i*6);}}
   else if(o.kind==='reeds'){for(let i=0;i<3;i++){c.moveTo((i-1)*9,12);c.quadraticCurveTo((i-1)*9+lit*4,-2,(i-1)*9+4,-14+i*3);}}
   else if(o.kind==='pods'){for(let i=0;i<3;i++){c.moveTo((i-1)*9+3,0);c.ellipse((i-1)*9,0,3,7,.2+lit*.6,0,6.283);}}
   else if(o.kind==='shell'){c.arc(0,0,12,0,Math.PI*1.6);c.moveTo(6,0);c.arc(0,0,6,0,Math.PI*1.6);}
   else if(o.kind==='dust'){for(let i=0;i<7;i++){const a=i*2.4+o.phase,r=6+i*1.5-lit*4;c.moveTo(Math.cos(a)*r+1,Math.sin(a)*r);c.arc(Math.cos(a)*r,Math.sin(a)*r,1,0,6.283);}}
   else {c.ellipse(0,0,15,8,0,0,6.283);c.moveTo(7,0);c.ellipse(0,0,7+lit*3,3+lit*2,0,0,6.283);}
   c.stroke();
   if(d<55){c.globalAlpha=.3;c.beginPath();c.arc(0,0,23,-Math.PI/2,-Math.PI/2+.8+(o.held||0)*.35);c.stroke();}
   c.restore();
  }
 }
 function sources(){return nearby(250).map(o=>({object:o,kind:kindOf(o),name:RHYTHM_ELEMENTS[o.kind].name,voice:runtime.getVoice(kindOf(o),runtime.regionOfPos(o.x,o.y)),distance:Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),hint:RHYTHM_ELEMENTS[o.kind].hint}));}
 Object.defineProperties(runtime,{nearbyPercussion:{get:()=>nearby},percussionTick:{get:()=>tick},percussionStep:{get:()=>step},drawPercussion:{get:()=>draw},percussionSources:{get:()=>sources},percussionCacheSize:{get:()=>cache.size}});
}
