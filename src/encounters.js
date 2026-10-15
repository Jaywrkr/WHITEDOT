import {FAMILIES,createFamilyState,familyInfluence,familyArrange,regionalFamilyInfluence,encounterRole} from './encounter-families.js';
import {claimInstallationBar} from './installations.js';
export function createEncounters(cx,cy,size,region,seedOf,rng){
 if(region.sea)return [];
 const candidates=[];
 for(const kind of Object.keys(FAMILIES)){
  const r=rng(seedOf(`encounter:v1:${kind}:${cx},${cy}`));if(r()>1/24)continue;
  candidates.push({id:`encounter:${kind}:${cx},${cy}`,kind,x:(cx+.2+r()*.6)*size,y:(cy+.2+r()*.6)*size,hue:region.hue,variant:Math.floor(r()*8),state:createFamilyState()});
 }
 candidates.sort((a,b)=>seedOf(a.id)-seedOf(b.id));return candidates.slice(0,1);
}
export function initialize(runtime){
 const cache=new Map();let visible=[],gesture=null,lastBar=-Infinity,previous=runtime.S;
 const active=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])')&&runtime.S.sound&&runtime.ac?.state==='running';
 const playable=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])');
 const requestedParam=new URLSearchParams(location.search).get('encounter'),requestedNow=()=>runtime.labEncounter||requestedParam;   // el laboratorio puede pedir una familia sin recargar
 function chunk(x,y){
  const key=`${x},${y}`;if(!cache.has(key)){
   const region=runtime.regionOfPos((x+.5)*runtime.WCH,(y+.5)*runtime.WCH),items=createEncounters(x,y,runtime.WCH,region,runtime.seedOf,runtime.rng);
   const home=runtime.REG/2,requested=requestedNow();
   if(runtime.S.previewSeed&&x===home&&y===home&&FAMILIES[requested]){items.length=0;items.push({id:`preview:${requested}`,kind:requested,x:x*runtime.WCH+100,y:y*runtime.WCH,hue:region.hue,variant:runtime.seedOf(requested)%8,state:createFamilyState()});}
   if(items[0]?.kind==='animal'){const first=items[0];items.push({...first,id:first.id+':partner',x:first.x+70,y:first.y+70,state:createFamilyState()});}
   cache.set(key,items);while(cache.size>64)cache.delete(cache.keys().next().value);
  }return cache.get(key);
 }
 function record(o,verb='model'){
  runtime.recordElement?.('encounter:'+o.kind,runtime.regionOfPos(o.x,o.y));
  o.state.active=16;o.state.used=true;const f=FAMILIES[o.kind];runtime.creativeAction?.(f.voiceRole?f.voiceRole(o.state):encounterRole(o.kind,runtime.regionOfPos(o.x,o.y),runtime.seedOf),verb);
  runtime.S.journal.encounters||={};runtime.S.journal.encounters[o.kind]=1;
  runtime.unlock('encounter:'+o.kind);
 }
 function tick(dt,paused){
  if(previous!==runtime.S){cache.clear();visible=[];gesture=null;previous=runtime.S;lastBar=-Infinity;}
  if(!playable()||paused){if(gesture)cancel();runtime.depthPause?.();return;}
  const x=Math.floor(runtime.S.wx/runtime.WCH),y=Math.floor(runtime.S.wy/runtime.WCH);visible=[];
  for(let a=x-1;a<=x+1;a++)for(let b=y-1;b<=y+1;b++)visible.push(...chunk(a,b));
  visible=visible.filter(o=>Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<460);runtime.depthUI?.();bodyEncounter();
  const closest=visible.slice().sort((a,b)=>Math.hypot(a.x-runtime.S.wx,a.y-runtime.S.wy)-Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy)).slice(0,2);
  if(!active())return;
  const combined={};
  for(const o of visible){const s=o.state,f=FAMILIES[o.kind],d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),near=d<75;
   s.phase+=dt*(.5+s.b*1.5)*(.75+o.variant*.07);s.active=Math.max(0,s.active-dt);s.charge=Math.max(0,Math.min(1,s.charge+dt*(near&&runtime.MU.speed<.06?1/5:-1/10)));
   f.tick?.(s,dt,near,{runtime,object:o,distance:d});runtime.depthTick?.(o,dt);
   if(s.charge>.9&&!s.held){s.held=true;record(o,'cultivate');}if(s.charge<.2)s.held=false;
   if(closest.includes(o)&&d<150&&(s.active>0||near))for(const [channel,value]of Object.entries(regionalFamilyInfluence(o.kind,s,runtime.regionOfPos(o.x,o.y),runtime.seedOf))){if(!s.used&&Math.abs(value)<.02)continue;combined[channel]??={level:0,variant:0};combined[channel].level+=value*Math.max(0,1-d/180);combined[channel].variant=(f.figure(s)+o.variant)%8;}
  }
  const region=runtime.regionOfPos(runtime.S.wx,runtime.S.wy);
  for(const [channel,input]of Object.entries(combined))runtime.driveInfluence?.(region,channel,Math.max(-1,Math.min(1,input.level)),input.variant);
 }
 // Cuerpo: entrar con el cubo = tocar; moverse dentro = moldear (como arrastrar); salir = soltar.
 let bodyGesture=null;
 function bodyEncounter(){
  const b=runtime.body,S=runtime.S;if(gesture||!b?.ready||!playable()||b.jump){bodyGesture=null;return;}
  if(bodyGesture){const g=bodyGesture,o=g.object;if(Math.hypot(o.x-S.wx,o.y-S.wy)>72){if(g.moved)record(o,'model');bodyGesture=null;return;}
   const dx=S.wx-g.x,dy=S.wy-g.y;g.moved||=Math.hypot(dx,dy)>9;
   if(g.moved){Object.assign(o.state,g.initial);FAMILIES[o.kind].drag(o.state,dx,dy,b.speed);o.state.active=16;}return;}
  const now=performance.now(),o=visible.find(o=>Math.hypot(o.x-S.wx,o.y-S.wy)<30&&now>(o.bodyNext||0));if(!o)return;
  runtime.audio();if(!runtime.depthTap?.(o,120))FAMILIES[o.kind].tap(o.state);record(o,'touch');o.bodyNext=now+1500;
  bodyGesture={object:o,initial:{...o.state},x:S.wx,y:S.wy,moved:false};
 }
 function cancel(){if(gesture){for(const k of Object.keys(gesture.object.state))delete gesture.object.state[k];Object.assign(gesture.object.state,gesture.initial);}gesture=null;}
 function down(e){
  if(!e.isPrimary||gesture||runtime.depthEngaged||!playable())return false;const x=runtime.S.wx+e.clientX-runtime.W/2,y=runtime.S.wy+e.clientY-runtime.H/2;
  const o=visible.find(o=>Math.hypot(o.x-x,o.y-y)<36);if(!o)return false;
  runtime.audio();runtime.stopAutopilot?.();gesture={id:e.pointerId,object:o,initial:{...o.state},x:e.clientX,y:e.clientY,t:performance.now(),moved:false};
  try{runtime.$('w').setPointerCapture(e.pointerId);}catch(_){}return true;
 }
 function move(e){
  if(!gesture||gesture.id!==e.pointerId)return false;if(!playable()){cancel();return true;}
  const g=gesture,dx=e.clientX-g.x,dy=e.clientY-g.y;g.moved||=Math.hypot(dx,dy)>9;
  if(g.moved){Object.assign(g.object.state,g.initial);FAMILIES[g.object.kind].drag(g.object.state,dx,dy,Math.hypot(dx,dy)/Math.max(.05,(performance.now()-g.t)/1000));g.object.state.active=16;}
  return true;
 }
 function up(e){
  if(!gesture||gesture.id!==e.pointerId)return false;
  if(e.type!=='pointerup'||!playable()){cancel();return true;}
  const g=gesture;gesture=null;const handled=!g.moved&&runtime.depthTap?.(g.object,performance.now()-g.t);if(!handled){if(!g.moved)FAMILIES[g.object.kind].tap(g.object.state);record(g.object,g.moved?'model':'touch');}return true;
 }
 function bar(time,bar){
  if(!active()||bar-lastBar<2||runtime.currentPocket?.()?.kind==='quiet')return;
  let o=visible.filter(o=>o.state.active>0&&o.state.used&&(o.kind!=='box'||o.state.a>.65)&&!FAMILIES[o.kind].silent&&Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<150).sort((a,b)=>Math.hypot(a.x-runtime.S.wx,a.y-runtime.S.wy)-Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy))[0];
  if(!o)return;if(o.kind==='animal'&&bar%4===2&&!runtime.depthHasPhrase?.(o)){const partner=visible.find(p=>p!==o&&p.kind==='animal'&&Math.hypot(p.x-o.x,p.y-o.y)<210&&Math.hypot(p.x-runtime.S.wx,p.y-runtime.S.wy)<200);if(partner)o=partner;}
  const phrase=runtime.depthPhrase?.(o,bar);if(phrase&&phrase.length===0)return;
  if(!claimInstallationBar(runtime,bar))return;lastBar=bar;
  const region=runtime.regionOfPos(o.x,o.y),f=FAMILIES[o.kind];
  if(phrase){const notes=phrase.slice(0,4);for(const n of notes){const kind='encounter:'+o.kind+(n.channel?':'+n.channel:f.voiceRole?':'+f.voiceRole(o.state):''),voice=runtime.getVoice(kind,region),index=n.relative?n.index-voice.degree:n.index;runtime.playVoice(kind,index,time+runtime.SIX*n.step,region,false,.25/notes.length,o,'ambient');}runtime.depthReplied?.(o,bar,time);}
  else{const at=time+runtime.SIX*[2,6,10,14][(f.figure(o.state)+o.variant+bar)%4];runtime.playVoice('encounter:'+o.kind+(f.voiceRole?':'+f.voiceRole(o.state):''),(f.figure(o.state)+o.variant)%7,at,region,false,.25,o,'ambient');}
 }
 function arrange(region,track){
  if(!active()||region.key!==runtime.regionOfPos(runtime.S.wx,runtime.S.wy).key)return track;
  const o=visible.filter(o=>o.state.used&&o.state.active>0&&(o.kind!=='box'||o.state.a>.65)&&(FAMILIES[o.kind].arrange||o.state.weave?.edges.length)&&Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<140).sort((a,b)=>Math.hypot(a.x-runtime.S.wx,a.y-runtime.S.wy)-Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy))[0];
  if(!o)return track;const shaped=familyArrange(o.kind,track,o.state);return runtime.depthArrangement?.(o,shaped,region)||shaped;
 }
 function draw(){
  if(!runtime.inWorld()||(runtime.S.layer||'superficie')!=='superficie')return;
  const c=runtime.cx,ox=runtime.W/2-runtime.S.wx,oy=runtime.H/2-runtime.S.wy;
  for(const o of visible){const s=o.state,f=FAMILIES[o.kind],d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy);if(d>360)continue;
   c.save();c.translate(o.x+ox,o.y+oy);c.globalAlpha=Math.max(.08,.55*(1-d/440));c.strokeStyle=`hsl(${o.hue},60%,65%)`;c.fillStyle=c.strokeStyle;c.lineWidth=1.2;
   drawShape(c,f.shape,s,o,runtime);runtime.depthDraw?.(o);c.restore();
  }
  if(!playable()||runtime.MU.speed>.1||runtime.scanning)return;
  const nearest=visible.slice().sort((a,b)=>Math.hypot(a.x-runtime.S.wx,a.y-runtime.S.wy)-Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy))[0];
  if(nearest&&Math.hypot(nearest.x-runtime.S.wx,nearest.y-runtime.S.wy)<140){c.save();c.fillStyle='#ddd';c.globalAlpha=.65;c.textAlign='center';c.font='10px "Geist Mono", monospace';const offset=nearest.kind==='box'&&nearest.state.a>.65?-132:72;c.fillText(FAMILIES[nearest.kind].name,runtime.W/2,runtime.H/2+offset,Math.min(300,runtime.W-32));c.fillText(nearest.kind==='weaver'?(runtime.depthHint?.(nearest)||FAMILIES.weaver.hint):runtime.fingerTouch?(runtime.depthHint?.(nearest)||FAMILIES[nearest.kind].hint):'Entra con el cubo para tocar · muévete dentro para moldear · quédate cerca',runtime.W/2,runtime.H/2+offset+15,Math.min(330,runtime.W-24));c.restore();}
 }
 function sources(){return visible.map(o=>({object:o,kind:'encounter:'+o.kind+(FAMILIES[o.kind].voiceRole?':'+FAMILIES[o.kind].voiceRole(o.state):''),name:FAMILIES[o.kind].name,hint:runtime.depthHint?.(o),distance:Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)})).filter(s=>s.distance<250);}
 function journal(){return Object.keys(runtime.S.journal.encounters||{}).filter(k=>FAMILIES[k]).map(k=>`<article class="journal-card"><h3>${FAMILIES[k].name}</h3><p>${FAMILIES[k].description||FAMILIES[k].hint}. Su papel y su timbre cambian con la región; los gestos transforman la composición existente.</p></article>`).join('');}
 for(const [kind,f]of Object.entries(FAMILIES)){runtime.VOZ['encounter:'+kind]=f.hint+'. Escucha cómo cambia este lugar.';runtime.ACH.push(['encounter:'+kind,f.name,'Aprende un gesto de este encuentro.']);}
 addEventListener('blur',cancel);
 Object.defineProperties(runtime,{encounterReset:{get:()=>()=>{cache.clear();visible=[];gesture=null;}},shapeEncounters:{get:()=>arrange},encounterTick:{get:()=>tick},encounterDraw:{get:()=>draw},encounterBar:{get:()=>bar},encounterEngaged:{get:()=>!!gesture},encounterBodyGesture:{get:()=>bodyGesture},encounterDown:{get:()=>down},encounterMove:{get:()=>move},encounterUp:{get:()=>up},encounterSources:{get:()=>sources},encounterJournal:{get:()=>journal},encounterObjects:{get:()=>visible},encounterCacheSize:{get:()=>cache.size}});
}
function drawShape(c,shape,s,o,runtime){
 const TAU=Math.PI*2;
 if(shape==='ground'){
  if(s.a<=.65){c.beginPath();c.ellipse(0,0,25,12,0,0,TAU);c.stroke();c.beginPath();c.ellipse(0,0,12,5,0,0,TAU);c.stroke();for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(i*9,9);c.quadraticCurveTo(i*14,17,i*18,20);c.stroke();}}
 }

 else if(shape==='shadow'){const a=s.a*TAU;c.beginPath();c.moveTo(-10,12);c.lineTo(0,-17);c.lineTo(12,12);c.closePath();c.stroke();c.beginPath();c.arc(Math.cos(a)*32,Math.sin(a)*32,3,0,TAU);c.fill();for(let i=0;i<8;i++){c.globalAlpha*=.96;const x=-28+i*8,len=((i+Math.floor(s.a*8))%8<1+Math.floor(s.b*3))?18:3;c.beginPath();c.moveTo(x,28);c.lineTo(x+Math.cos(a)*len,28+Math.sin(a)*len);c.stroke();}}
 else if(shape==='flower'){for(let i=0;i<4;i++){const a=i/4*TAU,rr=12+s.charge*13;c.save();c.rotate(a);c.beginPath();c.ellipse(rr,0,7+s.charge*3,4,0,0,TAU);c.stroke();if(i===Math.min(3,Math.floor(s.a*4)))c.fill();c.restore();}c.beginPath();c.arc(0,0,5,0,TAU);c.stroke();}
 else if(shape==='stream'){for(let j=-1;j<=1;j++){c.beginPath();for(let i=0;i<=16;i++){const x=-35+i*70/16,y=j*7+Math.sin(i*.5+s.phase*(s.a<.5?-1:1))*5;c[i?'lineTo':'moveTo'](x,y);}c.stroke();}if(s.c){c.beginPath();c.arc(0,0,12+s.b*8,s.phase,s.phase+TAU*.8);c.stroke();}}
 else if(shape==='animal'){c.rotate(Math.sin(s.phase)*.2);c.beginPath();c.ellipse(0,0,17,12,0,0,TAU);c.stroke();c.fillRect(-6,-3,2,2);c.fillRect(4,-3,2,2);for(let i=-1;i<=1;i+=2){c.beginPath();c.moveTo(i*10,9);c.lineTo(i*14,17+Math.sin(s.phase+i)*3);c.stroke();}if(s.c){c.beginPath();c.arc(0,0,25,-.7,.7);c.stroke();}}
 else if(shape==='peel'){c.rotate(s.b-.5);for(let i=0;i<3;i++){const open=Math.floor(s.a*3);c.beginPath();c.arc(0,0,14+i*6,i<open?.35:0,i<open?TAU-.35:TAU);c.stroke();}c.strokeRect(-4,-4,8,8);}
 else if(shape==='orbit'){c.strokeRect(-3,-3,6,6);if(s.c&&o&&runtime)c.translate(runtime.S.wx-o.x,runtime.S.wy-o.y);const r=18+s.b*35;c.beginPath();c.arc(0,0,r,0,TAU);c.stroke();for(let i=0;i<1+Math.floor(s.a*4);i++){const a=s.phase+i*TAU/(1+Math.floor(s.a*4));c.beginPath();c.arc(Math.cos(a)*r,Math.sin(a)*r,3,0,TAU);c.fill();}}
 else if(shape==='well'){for(let i=0;i<3;i++){c.beginPath();c.arc(0,0,12+i*(4+s.b*5),0,TAU);c.stroke();}c.fillStyle='#000';c.beginPath();c.arc(0,0,10,0,TAU);c.fill();const a=s.a*TAU;c.beginPath();c.moveTo(Math.cos(a)*12,Math.sin(a)*12);c.lineTo(Math.cos(a)*30,Math.sin(a)*30);c.stroke();}
 else if(shape==='weaver'&&runtime?.depthDraw){c.beginPath();c.arc(Math.cos(s.phase)*7,Math.sin(s.phase)*7,6,0,TAU);c.stroke();}
 else if(shape==='weaver'){const n=1+Math.floor(s.a*3);for(let i=0;i<3;i++){const a=i/3*TAU+s.b*1.2,x=Math.cos(a)*30,y=Math.sin(a)*30;c.strokeRect(x-3,y-3,6,6);if(i<n){c.beginPath();c.moveTo(Math.cos(s.phase)*7,Math.sin(s.phase)*7);c.lineTo(x,y);c.stroke();}}c.beginPath();c.arc(Math.cos(s.phase)*7,Math.sin(s.phase)*7,5,0,TAU);c.stroke();}
 else if(shape==='cloud'){c.scale(.8+s.b,.7+s.a*.7);c.beginPath();for(let i=0;i<=48;i++){const a=i/48*TAU,r=22+Math.sin(a*5+s.phase*.2)*4;c[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.stroke();}
 else {c.beginPath();c.arc(0,0,22,0,TAU);c.stroke();}
}
