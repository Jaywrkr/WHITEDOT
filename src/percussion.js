import {openSurface} from './frame-state.js';
import {expandedRhythm} from './ecoregions.js';
import {RHYTHM_ELEMENTS,NEW_PERCUSSION,createRhythmElements,additionalRhythmElements,rhythmPattern} from './percussion-model.js';
import {contactEntry} from './contact.js';
import {polarDelta} from './body.js';
import {claimInstallationBar} from './installations.js';
import {WORLD_VISUAL,elementInk,elementAlpha} from './visual.js';
export function initialize(runtime){
 const cache=new Map();let owner=runtime.S,labKind=null,labObject=null,active=null,budget={bar:-1,hits:0,manual:0};
 const surface=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie';
 const available=()=>surface()&&!document.hidden&&!runtime.scanning&&!openSurface('.modal:not([hidden])');
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
   const key=a+','+b;if(!cache.has(key)){const region=runtime.regionOfPos((a+.5)*size,(b+.5)*size),base=createRhythmElements(a,b,size,region,runtime.seedOf,runtime.rng);const biome=runtime.BIOMES[region.z].id,legacy=[...base,...expandedRhythm(a,b,size,region,biome,base,runtime.seedOf,runtime.rng)];cache.set(key,[...legacy,...additionalRhythmElements(a,b,size,region,biome,runtime.seedOf,runtime.rng,legacy)]);while(cache.size>64)cache.delete(cache.keys().next().value);}
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
  o.visualAt=performance.now();
  const first=!runtime.S.rhythmFound?.[o.kind];
  if(o.kind==='fossil'){const voice=runtime.getVoice(kindOf(o),runtime.regionOfPos(o.x,o.y),o);runtime.collectRareCard?.('fossil',o,{context:{role:voice.role,instrument:voice.instrument}});}
  runtime.recordElement?.('rhythm:'+o.kind,runtime.regionOfPos(o.x,o.y));runtime.S.rhythmFound||={};runtime.S.rhythmFound[o.kind]=1;
  if(first&&o.kind==='fossil'){runtime.unlock?.('fosilRitmo');runtime.toast?.('<em>Fósil de ritmo</em> · Un pulso antiguo. Quédate para despertarlo.');}
  runtime.unlock?.('percusion1');if(Object.keys(runtime.S.rhythmFound).length>=4)runtime.unlock?.('percusion4');
  runtime.creativeAction?.('groove','model');runtime.touched?.();
  if(!audible())return;
  const state=runtime.S;runtime.beatSoon(t=>{if(state===runtime.S)emit(o,t,NEW_PERCUSSION[o.kind]?.8:.55);},null,'player');
 }
 function tick(dt){
  const objects=nearby(),b=runtime.body;
  if(!available()||runtime.noticeLane?.inspecting||!b?.ready||b.jump){active=null;for(const o of objects){o.touching=false;o.turn=0;}return;}
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
  if(!active||!audible()||runtime.noticeLane?.inspecting||active.held<.8||runtime.currentPocket?.()?.kind==='quiet'||runtime.cultureListening)return;
  const o=active,region=runtime.regionOfPos(o.x,o.y),pattern=rhythmPattern(o.kind,region.genre,o.variant+(o.kind==='fossil'?Math.floor(bar/4):0));
  if(s!==pattern[0]||!claimInstallationBar(runtime,bar))return;
  const swing=(runtime.GEN[region.genre].sw||0)*runtime.SIX;
  emit(o,time+((s%2)?swing:0),.28,'ambient',bar);
  emit(o,time+(pattern[1]-pattern[0])*runtime.SIX+((pattern[1]%2)?swing:0),.2,'ambient',bar);
 }
 function draw(t,dt,ox,oy,radius){
  const c=runtime.cx;
  for(const o of nearby(radius)){
   const elapsed=(runtime.ac?.currentTime||0)-(o.onset??-10),lit=Math.max(elapsed>=0?Math.max(0,1-elapsed/.3):0,Math.max(0,1-(performance.now()-(o.visualAt??-Infinity))/400));
   const spec=RHYTHM_ELEMENTS[o.kind],d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy);
   c.save();c.translate(o.x+ox,o.y+oy);c.globalAlpha=elementAlpha(d,radius,lit*.4);c.strokeStyle=elementInk(spec.material,runtime.regionOfPos(o.x,o.y).hue,lit>.1);c.fillStyle=c.strokeStyle;c.lineWidth=WORLD_VISUAL.line;
   c.beginPath();
   if(NEW_PERCUSSION[o.kind]){
    if(o.kind==='membrane'){c.ellipse(0,0,13+lit*3,7+lit*2,0,0,6.283);c.moveTo(-11,0);c.quadraticCurveTo(0,20-lit*6,11,0);c.moveTo(-6,-1);c.quadraticCurveTo(0,-5-lit*6,6,-1);}
    else if(o.kind==='leafbrush'){for(let i=0;i<4;i++){const x=(i-1.5)*6;c.moveTo(x,10);c.quadraticCurveTo(x-6-lit*4,-4,x+3,-14);c.quadraticCurveTo(x+7,-2,x,10);}}
    else if(o.kind==='clayshell'){c.ellipse(0,-3,13,5,0,0,6.283);c.moveTo(-13,-3);c.quadraticCurveTo(0,24-lit*4,13,-3);}
    else if(o.kind==='seedshaker'){for(let i=0;i<5;i++){const x=Math.cos(i*2.4)*(9+lit*3),y=Math.sin(i*2.4)*9;c.moveTo(x+2,y);c.ellipse(x,y,2,4,i,0,6.283);}}
    else if(o.kind==='pebblerim'){for(let i=0;i<3;i++){c.moveTo((i-1)*10+4,Math.abs(i-1)*5);c.ellipse((i-1)*10,Math.abs(i-1)*5,4,3+lit*2,i*.4,0,6.283);}}
    else{for(let i=0;i<5;i++){const a=i*6.283/5,r=13-lit*5;c.moveTo(0,0);c.quadraticCurveTo(Math.cos(a-.4)*r,Math.sin(a-.4)*r,Math.cos(a)*r,Math.sin(a)*r);c.quadraticCurveTo(Math.cos(a+.4)*r,Math.sin(a+.4)*r,0,0);}}
   }else if(spec.expansion){const n=3+spec.shape;for(let i=0;i<n;i++){const a=i*6.283/n,r=8+spec.shape*2;if(spec.shape===0){c.moveTo(0,0);c.quadraticCurveTo(Math.cos(a-.3)*r,Math.sin(a-.3)*r,Math.cos(a)*r,Math.sin(a)*r);}else if(spec.shape===1){c.moveTo(Math.cos(a)*r+3,Math.sin(a)*r);c.ellipse(Math.cos(a)*r,Math.sin(a)*r,3,5,a,0,6.283);}else if(spec.shape===2){c.moveTo(-12,i*4-6);c.quadraticCurveTo(0,i*4-9-lit*3,12,i*4-6);}else{c.moveTo(Math.cos(a)*r,Math.sin(a)*r);c.lineTo(Math.cos(a)*(r+5),Math.sin(a)*(r+5));}}}
   else if(o.kind==='fossil'){c.arc(0,0,13,.3,5.8);c.moveTo(8,0);c.arc(0,0,8,0,5.5);c.moveTo(3,0);c.arc(0,0,3,0,4);}
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
