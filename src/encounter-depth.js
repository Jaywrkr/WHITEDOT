import {audibleTime} from './journey-pulse.js';
import {openSurface,calmMotion} from './frame-state.js';
import {FAMILIES,encounterRole} from './encounter-families.js';
import {MAX_THREADS,toggleThread,threadScore,threadArrangement,createBox,paintBoxStep,moveBoxPart,boxPart,boxArrangement,startDialogue,captureDialogue,finishDialogue,dialogueReply} from './encounter-depth-model.js';
import {CHANNEL_NAMES} from './influence.js';
import {compileThreadGraph} from './modular-routing.js';
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
export function boxStepPoint(index){const angle=-Math.PI/2+index*Math.PI/8;return {x:Math.cos(angle)*68,y:Math.sin(angle)*92};}
export function boxPartPoint(index){return [{x:-28,y:20},{x:28,y:20},{x:0,y:-28}][index];}
export function boxCellAt(x,y){let best=null,nearest=18;for(let i=0;i<16;i++){const d=distance({x,y},boxStepPoint(i));if(d<nearest){nearest=d;best=i;}}return best;}
export function boxLidAt(x,y){return Math.hypot(x,y-56)<16;}
export function boxSlotAt(x,y){for(let i=0;i<3;i++)if(distance({x,y},boxPartPoint(i))<20)return i;return null;}
export function initialize(runtime){
 let gesture=null,armed=null,guidedAnimal=null,previous=runtime.S;const identities=new WeakMap();
 const playable=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'&&!document.hidden&&!runtime.scanning&&!openSurface('.modal:not([hidden])');
 const active=()=>playable()&&runtime.S.sound&&runtime.ac?.state==='running';
 const point=e=>({x:runtime.S.wx+e.clientX-runtime.W/2,y:runtime.S.wy+e.clientY-runtime.H/2});
 const objects=()=>runtime.encounterObjects||[];
 function anchors(o){
  const out=Array.from({length:3},(_,i)=>{const a=-Math.PI/2+i*Math.PI*2/3;return {id:o.id+':anchor:'+i,x:o.x+Math.cos(a)*54,y:o.y+Math.sin(a)*54};});
  for(const source of runtime.MU.near||[]){if(distance(source,o)>145||distance(source,o)<32)continue;if(!identities.has(source))identities.set(source,source.id||`source:${source.s?.id||source.kind||'voice'}:${source.hx??source.x},${source.hy??source.y}`);out.push({id:identities.get(source),x:source.x,y:source.y});if(out.length>=8)break;}
  for(const other of objects()){if(other===o||distance(other,o)>(o.groveStyle?215:145)||out.length>=10)continue;out.push({id:other.id,x:other.x,y:other.y});}
  return out;
 }
 function ensure(o){runtime.restoreEncounter?.(o);if(o.kind==='weaver')o.state.weave||={edges:[]};if(o.kind==='box')o.state.box||=createBox(runtime.regionOfPos(o.x,o.y));}
 function mark(o,verb,channel=null){
  o.state.used=true;o.state.active=16;runtime.rememberEncounter?.(o);runtime.S.journal.encounters||={};runtime.S.journal.encounters[o.kind]=1;
  const region=runtime.regionOfPos(o.x,o.y),f=FAMILIES[o.kind];channel||=o.kind==='box'&&o.state.box?o.state.box.parts[o.state.box.selected].id:f.voiceRole?f.voiceRole(o.state):encounterRole(o.kind,region,runtime.seedOf);runtime.creativeAction?.(channel,verb);
  runtime.unlock('encounter:'+o.kind);
 }
 function connect(o,a,b){ensure(o);if(!toggleThread(o.state.weave,a,b))return false;mark(o,'connect');runtime.S.journal.depth||={};runtime.S.journal.depth.threads=true;if(o.state.weave.edges.length>=2)runtime.unlock('tejidoVivo');return true;}
 function ui(){document.body.classList.toggle('encounter-editing',playable()&&objects().some(o=>o.kind==='box'&&o.state.a>.65&&distance(o,{x:runtime.S.wx,y:runtime.S.wy})<180));}
 function cancel(){if(!playable())document.body.classList.remove('encounter-editing');if(gesture?.initialBox)gesture.object.state.box=gesture.initialBox;gesture=null;armed=null;}
 function start(e,data){runtime.audio();runtime.stopAutopilot?.();gesture={...data,id:e.pointerId,start:point(e),now:point(e),time:performance.now(),moved:false};try{runtime.$('w').setPointerCapture(e.pointerId);}catch(_){}return true;}
 function down(e){
  if(gesture)return true;if(!e.isPrimary||!playable())return false;const p=point(e);
  for(const o of objects().filter(o=>distance(o,{x:runtime.S.wx,y:runtime.S.wy})<180)){
   ensure(o);
   if(o.kind==='weaver'){
    const nodes=anchors(o),node=nodes.find(a=>distance(a,p)<18);
    if(node)return start(e,{type:'anchor',object:o,node});
    const edge=o.state.weave.edges.find(edge=>segmentDistance(p,edge.a,edge.b)<12);
    if(edge)return start(e,{type:'thread',object:o,edgeKey:edge.key});
   }
   if(o.kind==='box'&&o.state.a>.65){const x=p.x-o.x,y=p.y-o.y,slot=boxSlotAt(x,y),cell=boxCellAt(x,y);
    if(boxLidAt(x,y))return start(e,{type:'lid',object:o});
    if(slot!==null)return start(e,{type:'part',object:o,slot,initialBox:structuredClone(o.state.box)});
    if(cell!==null)return start(e,{type:'cell',object:o,cell,on:o.state.box.parts[o.state.box.selected].steps[cell]<0,initialBox:structuredClone(o.state.box),painted:new Set()});
   }
  }return false;
 }
 function move(e){
  if(!gesture||gesture.id!==e.pointerId)return false;if(!playable()){cancel();return true;}
  const g=gesture;g.now=point(e);g.moved||=distance(g.start,g.now)>10;
  if(g.type==='cell'&&g.moved){for(const p of [g.start,g.now]){const cell=boxCellAt(p.x-g.object.x,p.y-g.object.y);if(cell!==null&&!g.painted.has(cell)){paintBoxStep(g.object.state.box,cell,g.on);g.painted.add(cell);}}}
  return true;
 }
 function up(e){
  if(!gesture||gesture.id!==e.pointerId)return false;if(e.type!=='pointerup'||!playable()){cancel();return true;}
  const g=gesture;gesture=null;const p=point(e),o=g.object;
  if(g.type==='anchor'){
   const target=anchors(o).find(a=>distance(a,p)<22);
   if(g.moved){if(target)connect(o,g.node,target);armed=null;}
   else if(armed?.object===o&&armed.node.id!==g.node.id){connect(o,armed.node,g.node);armed=null;}
   else armed={object:o,node:g.node};
  }else if(g.type==='thread'&&!g.moved){o.state.weave.edges=o.state.weave.edges.filter(edge=>edge.key!==g.edgeKey);mark(o,'subtract');}
  else if(g.type==='lid'&&!g.moved){o.state.a=.15;o.state.rested=true;mark(o,'subtract');}
  else if(g.type==='cell'){
   if(!g.moved)paintBoxStep(o.state.box,g.cell,g.on);mark(o,'model');o.state.box.edited||=[];const id=o.state.box.parts[o.state.box.selected].id;if(!o.state.box.edited.includes(id))o.state.box.edited.push(id);runtime.S.journal.depth||={};runtime.S.journal.depth.box=true;if(o.state.box.edited.length>=2)runtime.unlock('cajaEditable');
  }else if(g.type==='part'){
   const target=boxSlotAt(p.x-o.x,p.y-o.y);
   if(g.moved&&target!==null){moveBoxPart(o.state.box,g.slot,target);mark(o,'model');}
   else if(!g.moved&&performance.now()-g.time>=500){o.state.box.parts[g.slot].enabled=!o.state.box.parts[g.slot].enabled;mark(o,'subtract',o.state.box.parts[g.slot].id);}
   else if(!g.moved)o.state.box.selected=g.slot;
  }
  return true;
 }
 function tap(o,duration){
  if(o.kind!=='animal')return false;guidedAnimal=o;
  if(duration>=500){FAMILIES.animal.tap(o.state);o.state.voiceFeedback={channel:FAMILIES.animal.voiceRole(o.state),until:performance.now()+1600};mark(o,'model');return true;}
  const d=o.state.dialogue;
  if(d?.phase==='listening'){
   if(d.events.length){finishDialogue(d);runtime.rememberEncounter?.(o);}else{d.phase='idle';d.empty=true;}
  }else{o.state.dialogue=startDialogue();mark(o,'listen');}
  runtime.stopAutopilot?.();return true;
 }
 function tick(o,dt){
  if(previous!==runtime.S){cancel();previous=runtime.S;}
  ensure(o);if(!active())return;
  if(o.kind==='box'){
   const d=distance(o,{x:runtime.S.wx,y:runtime.S.wy});if(d>75)o.state.rested=false;
   if(d>180)o.state.a=.15;
   else if(d<60&&runtime.MU.speed<.06&&o.state.charge>.45&&!o.state.rested&&o.state.a<=.65){o.state.a=.85;mark(o,'cultivate');}
  }
  if(o.kind==='weaver'){const nodes=anchors(o);for(const edge of o.state.weave.edges){const a=nodes.find(n=>n.id===edge.from),b=nodes.find(n=>n.id===edge.to);if(a)edge.a={x:a.x,y:a.y};if(b)edge.b={x:b.x,y:b.y};}
   // Cube-first patching: pass one anchor, then another. Dwell cuts a nearby thread.
   const p={x:runtime.S.wx,y:runtime.S.wy},at=nodes.find(n=>distance(n,p)<15);
   if(at&&o.state.cubeAnchor!==at.id){if(o.state.cubeAnchor){const from=nodes.find(n=>n.id===o.state.cubeAnchor);if(from)connect(o,from,at);}o.state.cubeAnchor=at.id;}
   if(!at&&nodes.every(n=>distance(n,p)>80))o.state.cubeAnchor=null;
   const edge=nodes.every(n=>distance(n,p)>18)&&o.state.weave.edges.find(e=>segmentDistance(p,e.a,e.b)<9);o.state.threadDwell=edge&&runtime.MU.speed<.03?(o.state.threadDwell||0)+dt:0;
   if(edge&&o.state.threadDwell>1.3){o.state.weave.edges=o.state.weave.edges.filter(e=>e!==edge);o.state.threadDwell=0;mark(o,'subtract');}
  }
  if(armed&&(distance(armed.object,{x:runtime.S.wx,y:runtime.S.wy})>190||!objects().includes(armed.object)))armed=null;
  const d=o.state.dialogue;if(!d)return;
  if(distance(o,{x:runtime.S.wx,y:runtime.S.wy})>200){d.phase='idle';return;}
  if(d.phase==='listening'){
   o.state.active=16;
   if(!d.events.length){d.waitingAge=(d.waitingAge||0)+dt;if(d.waitingAge>20){d.phase='idle';d.empty=true;}}
   else{d.elapsed+=dt;d.sinceInput=(d.sinceInput||0)+dt;if(d.elapsed>=runtime.SIX*32||d.sinceInput>=Math.max(1.2,runtime.SIX*8)){finishDialogue(d);runtime.rememberEncounter?.(o);}}
  }
  if(d.phase==='replying'){d.age+=dt;o.state.active=16;if(d.age>90)d.phase='idle';}
 }
 function hear(event){
  if(event.origin!=='player'||!active()||event.layer&&event.layer!=='superficie')return;
  for(const o of objects()){
   const d=o.state.dialogue;if(o.kind!=='animal'||!d||d.phase!=='listening'||distance(o,{x:runtime.S.wx,y:runtime.S.wy})>200||runtime.regionOfPos(o.x,o.y).key!==event.region?.key)continue;
   captureDialogue(d,{step:d.elapsed/runtime.SIX,degree:event.degree});
  }
 }
 function phrase(o,bar){
  if(o.kind==='animal'&&o.state.dialogue?.phase==='listening')return [];
  if(o.kind==='animal'&&o.state.dialogue?.phase==='replying')return dialogueReply(o.state.dialogue,bar).map(n=>({...n,relative:true}));
  if(o.kind==='weaver'&&o.state.weave?.edges.length){const notes=threadScore(o.state.weave,runtime.seedOf).notes.slice(0,3);
   return o.groveStyle==='garden'?notes.map((n,i)=>({...n,index:[0,2,4][i]})):o.groveStyle==='relay'?notes.map(n=>({...n,step:(n.step+2)%16})):notes;
  }
  if(o.kind==='box'&&o.state.box&&o.state.a>.65){const out=[];for(const channel of ['bass','groove','melody']){const part=boxPart(o.state.box,channel);if(!part?.enabled)continue;const notes=part.steps.map((index,step)=>({step,index})).filter(n=>n.index>=0);if(notes.length)out.push({...notes[Math.floor(bar/2)%notes.length],channel});}return out;}
  return null;
 }
 function replied(o,bar,time=runtime.ac.currentTime){if(o.state.dialogue?.phase==='replying'){o.state.dialogue.lastReplyBar=bar;o.state.dialogue.replyAt=time;o.state.dialogue.replyEnd=time+runtime.SIX*((o.state.dialogue.phrase.at(-1)?.step||0)+3);runtime.S.journal.depth||={};runtime.S.journal.depth.dialogue=true;runtime.unlock('respuestaAnimal');}}
 function arrangement(o,track,region){
  if(o.kind==='weaver'&&o.state.weave?.edges.length)return threadArrangement(track,o.state.weave,o.groveRole||encounterRole('weaver',region,runtime.seedOf),runtime.seedOf);
  if(o.kind==='box'&&o.state.box&&o.state.a>.65)return boxArrangement(track,o.state.box);
  return track;
 }
 function gate(step){
  if(!active())return true;
  const nearby=objects().filter(o=>o.state.used&&o.state.active>0&&distance(o,{x:runtime.S.wx,y:runtime.S.wy})<140).sort((a,b)=>distance(a,{x:runtime.S.wx,y:runtime.S.wy})-distance(b,{x:runtime.S.wx,y:runtime.S.wy}));
  for(const o of nearby){
   if(o.kind==='weaver'&&o.state.weave?.edges.length&&(o.groveRole||encounterRole('weaver',runtime.regionOfPos(o.x,o.y),runtime.seedOf))==='groove')return threadScore(o.state.weave,runtime.seedOf).mask[step];
   if(o.kind==='box'&&o.state.box&&o.state.a>.65){const part=boxPart(o.state.box,'groove');return !!part?.enabled&&part.steps[step]>=0;}
  }return true;
 }
 function hint(o){
  if(o.kind==='weaver')return o.groveStyle?'Toca para conectar · permanece sobre un hilo para retirarlo':'Cruza dos anclas · permanece sobre un hilo para retirarlo';
  if(o.kind==='box')return o.state.a>.65?'Raíces: tocar · núcleos: mover/mantener · arco: reposar':'Toca el suelo o permanece cerca para despertarlo';
  if(o.kind==='animal')return !runtime.S.sound?'Activa Música para enseñarle una frase':o.state.dialogue?.phase==='listening'?'Te escucho. Toca objetos o pulsa el vacío.':o.state.dialogue?.phase==='replying'?'Escucha mi respuesta. Vuelve a tocarme para enseñarme.':'Acércate. Enséñame una frase tocando el mundo.';
  return FAMILIES[o.kind].hint;
 }
 function draw(o){
  ensure(o);const c=runtime.cx,near=distance(o,{x:runtime.S.wx,y:runtime.S.wy})<180;
  if(o.kind==='weaver'){
   for(const edge of o.state.weave.edges){const nodes=anchors(o),a=nodes.find(n=>n.id===edge.from)||edge.a,b=nodes.find(n=>n.id===edge.to)||edge.b;c.beginPath();c.moveTo(a.x-o.x,a.y-o.y);c.lineTo(b.x-o.x,b.y-o.y);c.stroke();
    if(o.groveStyle&&!calmMotion(runtime.S)&&o.state.active>0&&runtime.ac?.state==='running'){const phase=((audibleTime(runtime.ac)/(runtime.SIX*4))%1+1)%1;c.beginPath();c.arc(a.x-o.x+(b.x-a.x)*phase,a.y-o.y+(b.y-a.y)*phase,2,0,Math.PI*2);c.fill();}}
   if(near&&(!o.groveStyle||distance(o,{x:runtime.S.wx,y:runtime.S.wy})<85)){for(const [index,a]of anchors(o).entries()){const x=a.x-o.x,y=a.y-o.y;c.beginPath();if(index===1){c.moveTo(x,y-5);c.lineTo(x+4,y);c.lineTo(x,y+5);c.lineTo(x-4,y);c.closePath();}else if(index===2){c.moveTo(x-5,y);c.bezierCurveTo(x-2,y-7,x+2,y+7,x+5,y);}else c.arc(x,y,armed?.node.id===a.id?7:4,0,Math.PI*2);c.stroke();if(index<3&&o.state.cubeAnchor===a.id){c.font='11px "Geist Mono", monospace';c.fillText(['Fuente','Filtro','Modulador'][index],x-20,y+16);}}if(gesture?.object===o&&gesture.type==='anchor'){c.beginPath();c.moveTo(gesture.node.x-o.x,gesture.node.y-o.y);c.lineTo(gesture.now.x-o.x,gesture.now.y-o.y);c.stroke();}}
   if(!o.groveStyle||distance(o,{x:runtime.S.wx,y:runtime.S.wy})<85){c.font='11px "Geist Mono", monospace';c.textAlign='center';c.fillText(`${o.state.weave.edges.length}/${MAX_THREADS} hilos`,0,34);}
  }
  if(o.kind==='box'&&o.state.a>.65&&near){
   c.fillStyle=c.strokeStyle;c.font='11px "Geist Mono", monospace';c.textAlign='center';
   const part=o.state.box.parts[o.state.box.selected],beat=runtime.MU.step%16,core=boxPartPoint(o.state.box.selected);
   // The visible contour and the gesture targets share the same geometry.
   for(let i=0;i<16;i++){
    const p=boxStepPoint(i),on=part.steps[i]>=0;c.globalAlpha=part.enabled?(on?.65:.22):.16;
    c.beginPath();c.moveTo(core.x,core.y);c.quadraticCurveTo(p.x*.35,p.y*.65,p.x,p.y);c.stroke();
    c.save();c.translate(p.x,p.y);c.rotate(Math.atan2(p.y,p.x));c.beginPath();c.ellipse(0,0,on?10:7,4,0,0,Math.PI*2);if(on)c.fill();else c.stroke();c.restore();
    if(i===beat){c.globalAlpha=.75;c.beginPath();c.arc(p.x,p.y,14,0,Math.PI*2);c.stroke();}
   }
   for(let i=0;i<3;i++){
    const p=o.state.box.parts[i],q=boxPartPoint(i);c.globalAlpha=p.enabled?.9:.3;
    c.beginPath();c.ellipse(q.x,q.y,18,15,i*Math.PI/3,0,Math.PI*2);c.stroke();
    if(i===o.state.box.selected){c.beginPath();c.arc(q.x,q.y,3,0,Math.PI*2);c.fill();}
    c.fillText(CHANNEL_NAMES[p.id],q.x,q.y+5);
   }
   c.globalAlpha=.6;c.beginPath();c.moveTo(-9,60);c.quadraticCurveTo(0,38,9,60);c.stroke();
   c.fillText('reposar',0,74);

  }
  const d=o.state.dialogue;if(o.kind==='animal'&&near){
   const listening=d?.phase==='listening',speaking=d?.phase==='replying'&&Number.isFinite(d.replyAt)&&audibleTime(runtime.ac)>=d.replyAt&&audibleTime(runtime.ac)<d.replyEnd;
   c.font='11px "Geist Mono", monospace';c.textAlign='center';
   const width=Math.min(220,runtime.W-24),sx=runtime.W/2+o.x-runtime.S.wx,sy=runtime.H/2+o.y-runtime.S.wy,lx=Math.max(width/2+12,Math.min(runtime.W-width/2-12,sx))-sx,ly=sy>runtime.H-70?-38:48;
   const guide=guidedAnimal&&objects().includes(guidedAnimal)&&distance(guidedAnimal,{x:runtime.S.wx,y:runtime.S.wy})<180?guidedAnimal:objects().filter(a=>a.kind==='animal').sort((a,b)=>distance(a,{x:runtime.S.wx,y:runtime.S.wy})-distance(b,{x:runtime.S.wx,y:runtime.S.wy}))[0];
   const label=(text,y=ly)=>{if(guide===o)c.fillText(text,lx,y,width);};
   if(o.state.voiceFeedback?.until>performance.now())label(`Voz: ${CHANNEL_NAMES[o.state.voiceFeedback.channel]}`,ly>0?-34:-56);
   if(!runtime.S.sound)label('Activa Música para que te escuche');
   else if(listening){
    c.beginPath();c.arc(-14,-11,9,Math.PI,Math.PI*1.8);c.arc(14,-11,9,Math.PI*1.2,Math.PI*2);c.stroke();
    for(let i=0;i<4;i++){c.beginPath();c.arc(-15+i*10,31,i<d.events.length?3:1,0,Math.PI*2);c.fill();}
    label(d.events.length?`${d.events.length} notas · tócame para responder`:'Te escucho · toca objetos o el vacío');
   }else if(speaking){c.beginPath();c.arc(0,0,26+(Math.sin(o.state.phase*6)+1)*2,-.8,.8);c.stroke();label('Mi turno');}
   else if(d?.phase==='replying')label(d.replyAt?'Tócame para enseñarme otra frase':'Espera · respondo con la música');
   else if(d?.empty)label('No escuché notas · tócame otra vez');
   else label('Tócame para empezar');
  }

 }
 for(const [id,title,description]of [['tejidoVivo','Tejer un groove','Une dos pares de puntos en una red musical.'],['respuestaAnimal','Te escuché','Enseña una frase a un animal y escucha su respuesta.'],['cajaEditable','Un suelo propio','Transforma dos partes musicales de un suelo resonante.']]){runtime.ACH.push([id,title,description]);runtime.VOZ[id]=description;}
 addEventListener('blur',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
 function modularForSource(kind,region,source){const p=source||{x:runtime.S.wx,y:runtime.S.wy};
  const o=objects().find(o=>o.kind==='weaver'&&o.state.weave?.edges.length&&runtime.regionOfPos(o.x,o.y).key===region.key&&distance(o,p)<180&&(!source||source===o||o.state.weave.edges.some(e=>distance(e.a,p)<28||distance(e.b,p)<28)));
  if(!o)return null;const graph=compileThreadGraph(o.state.weave,runtime.seedOf);return graph.routes.length?graph:null;
 }
 Object.defineProperties(runtime,{modularForSource:{get:()=>modularForSource},depthUI:{get:()=>ui},depthPause:{get:()=>cancel},depthDown:{get:()=>down},depthMove:{get:()=>move},depthUp:{get:()=>up},depthTap:{get:()=>tap},depthTick:{get:()=>tick},depthHear:{get:()=>hear},depthPhrase:{get:()=>phrase},depthReplied:{get:()=>replied},depthArrangement:{get:()=>arrangement},depthGate:{get:()=>gate},depthDraw:{get:()=>draw},depthHint:{get:()=>hint},depthEngaged:{get:()=>!!gesture},depthHasPhrase:{get:()=>o=>['listening','replying'].includes(o.state.dialogue?.phase)},depthAnchors:{get:()=>anchors},depthConnect:{get:()=>connect}});
}
