import {FAMILIES,encounterRole} from './encounter-families.js';
import {MAX_THREADS,toggleThread,threadScore,threadArrangement,createBox,paintBoxStep,moveBoxPart,boxPart,boxArrangement,startDialogue,captureDialogue,finishDialogue,dialogueReply} from './encounter-depth-model.js';
import {CHANNEL_NAMES} from './influence.js';
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
export function boxCellAt(x,y){const col=Math.floor((x+80)/40),row=Math.floor((y+60)/40);return col>=0&&col<4&&row>=0&&row<4?row*4+col:null;}
export function boxLidAt(x,y){return Math.abs(x)<74&&y>-145&&y<-112;}
export function boxSlotAt(x,y){if(Math.abs(y+87)>19)return null;const index=Math.round((x+54)/54);return index>=0&&index<3&&Math.abs(x-(-54+index*54))<24?index:null;}
export function initialize(runtime){
 let gesture=null,armed=null,previous=runtime.S;const identities=new WeakMap();let nextId=0;
 const playable=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])');
 const active=()=>playable()&&runtime.S.sound&&runtime.ac?.state==='running';
 const point=e=>({x:runtime.S.wx+e.clientX-runtime.W/2,y:runtime.S.wy+e.clientY-runtime.H/2});
 const objects=()=>runtime.encounterObjects||[];
 function anchors(o){
  const out=Array.from({length:3},(_,i)=>{const a=-Math.PI/2+i*Math.PI*2/3;return {id:o.id+':anchor:'+i,x:o.x+Math.cos(a)*54,y:o.y+Math.sin(a)*54};});
  for(const source of runtime.MU.near||[]){if(distance(source,o)>145||distance(source,o)<32)continue;if(!identities.has(source))identities.set(source,'source:'+nextId++);out.push({id:identities.get(source),x:source.x,y:source.y});if(out.length>=8)break;}
  for(const other of objects()){if(other===o||distance(other,o)>145||out.length>=10)continue;out.push({id:other.id,x:other.x,y:other.y});}
  return out;
 }
 function ensure(o){if(o.kind==='weaver')o.state.weave||={edges:[]};if(o.kind==='box')o.state.box||=createBox(runtime.regionOfPos(o.x,o.y));}
 function mark(o,verb,channel=null){
  o.state.used=true;o.state.active=16;runtime.S.journal.encounters||={};runtime.S.journal.encounters[o.kind]=1;
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
  else if(g.type==='lid'&&!g.moved){o.state.a=.15;mark(o,'subtract');}
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
  if(o.kind!=='animal'||duration<500)return false;
  o.state.dialogue=startDialogue();mark(o,'listen');runtime.stopAutopilot?.();return true;
 }
 function tick(o,dt){
  if(previous!==runtime.S){cancel();previous=runtime.S;}
  ensure(o);if(!active())return;
  if(o.kind==='weaver'){const nodes=anchors(o);for(const edge of o.state.weave.edges){const a=nodes.find(n=>n.id===edge.from),b=nodes.find(n=>n.id===edge.to);if(a)edge.a={x:a.x,y:a.y};if(b)edge.b={x:b.x,y:b.y};}}
  if(armed&&(distance(armed.object,{x:runtime.S.wx,y:runtime.S.wy})>190||!objects().includes(armed.object)))armed=null;
  const d=o.state.dialogue;if(!d)return;
  if(distance(o,{x:runtime.S.wx,y:runtime.S.wy})>200){d.phase='idle';return;}
  if(d.phase==='listening'){d.elapsed+=dt;o.state.active=16;if(d.elapsed>=runtime.SIX*32)finishDialogue(d);}
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
  if(o.kind==='weaver'&&o.state.weave?.edges.length)return threadScore(o.state.weave,runtime.seedOf).notes.slice(0,3);
  if(o.kind==='box'&&o.state.box&&o.state.a>.65){const out=[];for(const channel of ['bass','groove','melody']){const part=boxPart(o.state.box,channel);if(!part?.enabled)continue;const notes=part.steps.map((index,step)=>({step,index})).filter(n=>n.index>=0);if(notes.length)out.push({...notes[Math.floor(bar/2)%notes.length],channel});}return out;}
  return null;
 }
 function replied(o,bar){if(o.state.dialogue?.phase==='replying'){o.state.dialogue.lastReplyBar=bar;runtime.S.journal.depth||={};runtime.S.journal.depth.dialogue=true;runtime.unlock('respuestaAnimal');}}
 function arrangement(o,track,region){
  if(o.kind==='weaver'&&o.state.weave?.edges.length)return threadArrangement(track,o.state.weave,encounterRole('weaver',region,runtime.seedOf),runtime.seedOf);
  if(o.kind==='box'&&o.state.box&&o.state.a>.65)return boxArrangement(track,o.state.box);
  return track;
 }
 function gate(step){
  if(!active())return true;
  const nearby=objects().filter(o=>o.state.used&&o.state.active>0&&distance(o,{x:runtime.S.wx,y:runtime.S.wy})<140).sort((a,b)=>distance(a,{x:runtime.S.wx,y:runtime.S.wy})-distance(b,{x:runtime.S.wx,y:runtime.S.wy}));
  for(const o of nearby){
   if(o.kind==='weaver'&&o.state.weave?.edges.length&&encounterRole('weaver',runtime.regionOfPos(o.x,o.y),runtime.seedOf)==='groove')return threadScore(o.state.weave,runtime.seedOf).mask[step];
   if(o.kind==='box'&&o.state.box&&o.state.a>.65){const part=boxPart(o.state.box,'groove');return !!part?.enabled&&part.steps[step]>=0;}
  }return true;
 }
 function hint(o){
  if(o.kind==='weaver')return armed?.object===o?'Elige otro punto · toca un hilo para retirarlo':'Une dos puntos con el dedo · toca hilos para retirar';
  if(o.kind==='box')return o.state.a>.65?'Tapa: cerrar · pasos: tocar · piezas: mover/mantener':'Toca para abrir · edita las piezas dentro';
  if(o.kind==='animal')return !runtime.S.sound?'Activa Música para enseñarle una frase':o.state.dialogue?.phase==='listening'?'Está escuchando · toca el mundo durante dos compases':o.state.dialogue?.phase==='replying'?'Te responde · mantén para otra frase':'Mantén para enseñar · toca para cambiar papel';
  return FAMILIES[o.kind].hint;
 }
 function draw(o){
  ensure(o);const c=runtime.cx,near=distance(o,{x:runtime.S.wx,y:runtime.S.wy})<180;
  if(o.kind==='weaver'){
   for(const edge of o.state.weave.edges){const nodes=anchors(o),a=nodes.find(n=>n.id===edge.from)||edge.a,b=nodes.find(n=>n.id===edge.to)||edge.b;c.beginPath();c.moveTo(a.x-o.x,a.y-o.y);c.lineTo(b.x-o.x,b.y-o.y);c.stroke();}
   if(near){for(const a of anchors(o)){c.beginPath();c.arc(a.x-o.x,a.y-o.y,armed?.node.id===a.id?7:4,0,Math.PI*2);c.stroke();}if(gesture?.object===o&&gesture.type==='anchor'){c.beginPath();c.moveTo(gesture.node.x-o.x,gesture.node.y-o.y);c.lineTo(gesture.now.x-o.x,gesture.now.y-o.y);c.stroke();}}
   c.font='8px monospace';c.textAlign='center';c.fillText(`${o.state.weave.edges.length}/${MAX_THREADS} hilos`,0,34);
  }
  if(o.kind==='box'&&o.state.a>.65&&near){
   c.fillStyle='rgba(0,0,0,.92)';c.fillRect(-82,-146,164,251);c.fillStyle=c.strokeStyle;c.font='9px monospace';c.textAlign='center';
   c.beginPath();c.moveTo(-74,-118);c.lineTo(0,-137);c.lineTo(74,-118);c.stroke();c.fillText('Cerrar tapa',0,-121);
   for(let i=0;i<3;i++){const p=o.state.box.parts[i],x=-54+i*54;c.globalAlpha=p.enabled?.9:.3;c.strokeRect(x-25,-105,50,36);c.fillText(CHANNEL_NAMES[p.id],x,-83);if(i===o.state.box.selected)c.strokeRect(x-26,-106,52,38);}
   const part=o.state.box.parts[o.state.box.selected],beat=runtime.MU.step%16;c.globalAlpha=part.enabled?.8:.3;
   for(let i=0;i<16;i++){const x=-60+(i%4)*40,y=-40+Math.floor(i/4)*40;c.strokeRect(x-16,y-16,32,32);if(part.steps[i]>=0)c.fillRect(x-4,y-4,8,8);if(i===beat){c.beginPath();c.arc(x,y,12,0,Math.PI*2);c.stroke();}}
  }
  const d=o.state.dialogue;if(o.kind==='animal'&&d&&d.phase!=='idle'){
   const progress=d.phase==='listening'?Math.min(1,d.elapsed/(runtime.SIX*32)):1;c.beginPath();c.arc(0,0,29,-Math.PI/2,-Math.PI/2+progress*Math.PI*2);c.stroke();c.font='9px monospace';c.textAlign='center';c.fillText(d.phase==='listening'?`Escucha · ${d.events.length}`:'Respuesta',0,42);
  }
 }
 for(const [id,title,description]of [['tejidoVivo','Tejer un groove','Une dos pares de puntos en una red musical.'],['respuestaAnimal','Te escuché','Enseña una frase a un animal y escucha su respuesta.'],['cajaEditable','Una máquina propia','Edita dos partes de una caja musical.']]){runtime.ACH.push([id,title,description]);runtime.VOZ[id]=description;}
 addEventListener('blur',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
 Object.defineProperties(runtime,{depthUI:{get:()=>ui},depthPause:{get:()=>cancel},depthDown:{get:()=>down},depthMove:{get:()=>move},depthUp:{get:()=>up},depthTap:{get:()=>tap},depthTick:{get:()=>tick},depthHear:{get:()=>hear},depthPhrase:{get:()=>phrase},depthReplied:{get:()=>replied},depthArrangement:{get:()=>arrangement},depthGate:{get:()=>gate},depthDraw:{get:()=>draw},depthHint:{get:()=>hint},depthEngaged:{get:()=>!!gesture},depthHasPhrase:{get:()=>o=>['listening','replying'].includes(o.state.dialogue?.phase)},depthAnchors:{get:()=>anchors},depthConnect:{get:()=>connect}});
}
