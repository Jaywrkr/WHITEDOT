import {TOTEMS,TOTEM_CELL,totemCell} from './sculpture-totems-model.js';
import {drawTotem} from './sculpture-totems-art.js';
import {pulseCrossed} from './pulse-forms.js';
import {crystalField} from './crystal-sparks.js';
// Reuse quiet native voices and the existing harmonic frame and per-bar budgets.
export function playTotemResponse(runtime,objects,time){
 if(!runtime.inWorld()||!runtime.S.sound||runtime.ac?.state!=='running'||document.hidden||runtime.scanning||runtime.noticeLane?.inspecting||document.querySelector('.modal:not([hidden])'))return 0;
 let count=0;for(const [i,o]of objects.slice(0,3).entries()){
  if(Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)>220||!TOTEMS[o.kind])continue;
  const at=time+i*(runtime.SIX||.125)*2,gain=i?.14:.28;
  if(runtime.playVoice(TOTEMS[o.kind].voice,i*2,at,runtime.regionOfPos(o.x,o.y),false,gain,o,i?'ambient':'player')===true){count++;runtime.totemNoteCue?.({kind:o.kind,at,gain});}
 }return count;
}
export function initialize(runtime){
 let owner=null,scope='',cache=new Map(),clock=0,seen=new WeakMap(),replied=new WeakSet();
 const layer=()=>runtime.S.layer||'superficie';
 const active=()=>runtime.inWorld()&&!runtime.labMode&&!document.hidden&&!runtime.scanning&&!runtime.noticeLane?.inspecting&&!document.querySelector('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 const reduced=()=>runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
 function nearby(radius=650){
  const key=JSON.stringify(runtime.worldIdentity)+':'+layer()+':'+runtime.S.todayKey;
  if(owner!==runtime.S||scope!==key){owner=runtime.S;scope=key;cache=new Map();clock=0;seen=new WeakMap();replied=new WeakSet(runtime.waves||[]);}
  const s=runtime.S,out=[],gx=Math.floor(s.wx/TOTEM_CELL),gy=Math.floor(s.wy/TOTEM_CELL);
  for(let x=gx-1;x<=gx+1;x++)for(let y=gy-1;y<=gy+1;y++){
   const cell=x+','+y;if(!cache.has(cell)){cache.set(cell,totemCell(x,y,runtime.seedOf,layer()));while(cache.size>48)cache.delete(cache.keys().next().value);}
   out.push(...cache.get(cell).filter(o=>Math.hypot(o.x-s.wx,o.y-s.wy)<radius));
  }return out.sort((a,b)=>Math.hypot(a.x-s.wx,a.y-s.wy)-Math.hypot(b.x-s.wx,b.y-s.wy));
 }
 function respond(o,wave=null){
  if(wave&&replied.has(wave))return;if(wave)replied.add(wave);
  const objects=[o,...nearby().filter(p=>p.id!==o.id&&p.group===o.group)].slice(0,3);for(const p of objects)p.lit=clock+1;
  if(!runtime.S.sound||runtime.ac?.state!=='running')return;
  const state=runtime.S,oldScope=scope;
  runtime.beatSoon?.(time=>{if(state===runtime.S&&oldScope===JSON.stringify(runtime.worldIdentity)+':'+layer()+':'+runtime.S.todayKey&&active())playTotemResponse(runtime,objects,time);},null,'player');
 }
 function finish(o){
  const result=runtime.rewardTotem?.(o.id);if(result===false)return false;
  o.done=clock+8;o.progress=0;o.lit=clock+2;o.ball=null;
  runtime.collectRareCard?.('totem:'+o.kind,{...o,id:'totem:'+((runtime.labMode||runtime.S.previewSeed&&!runtime.realTravel)?'sample:':'shape:')+o.kind},{context:{role:'lead',instrument:TOTEMS[o.kind].voice,gesture:'despertar'}});return true;
 }
 function guide(o){
  const candidates=layer()==='superficie'?crystalField(o.x,o.y,runtime.seedOf).filter(p=>!runtime.savedCrystal?.(p.id)?.broken&&Math.hypot(p.x-o.x,p.y-o.y)<550):[];
  let target=candidates.sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y))[0]||nearby().find(p=>p.id!==o.id);
  if(!target){const x=Math.floor(o.x/TOTEM_CELL),y=Math.floor(o.y/TOTEM_CELL),others=[];for(let a=x-2;a<=x+2;a++)for(let b=y-2;b<=y+2;b++)others.push(...totemCell(a,b,runtime.seedOf,layer()).filter(p=>p.id!==o.id));target=others.sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y))[0];}
  if(target)o.target={x:target.x,y:target.y,crystal:!!target.size};
 }
 function tick(dt,paused=false){
  const list=nearby();if(paused||!active())return;clock+=Math.max(0,Math.min(.05,dt||0));
  const automatic=runtime.autopilotState?.mode==='wander'&&!runtime.autopilotState.paused;
  for(const o of list){
   if(o.ball){o.ball.age+=Math.max(0,Math.min(.05,dt||0));const b=o.ball;
    if(b.phase==='out'&&b.age>.7&&!automatic&&Math.hypot(runtime.S.wx-o.x-b.direction*55,runtime.S.wy-o.y+10)<30){b.phase='home';b.age=0;}
    if(b.phase==='out'&&b.age>12){o.ball=null;o.progress=0;}
    else if(b.phase==='home'&&b.age>.7&&clock-(o.lastFinish??-10)>1){o.lastFinish=clock;if(finish(o))respond(o);}
   }
   if(automatic||o.done>clock||o.ball||Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)>180||clock-(o.last??-10)<.7)continue;
   for(const wave of runtime.waves||[]){
    if(wave.origin!=='player'||!pulseCrossed(wave,o.x,o.y))continue;
    let hits=seen.get(wave);if(!hits){hits=new Set();seen.set(wave,hits);}if(hits.has(o.id))continue;hits.add(o.id);o.last=clock;o.lit=clock+1;respond(o,wave);
    const action=TOTEMS[o.kind].action;
    if(action==='stack'){o.progress=(o.progress||0)+1;if(o.progress>=3){if(!finish(o))o.progress=2;}}
    else if(action==='orb'){o.progress=1;o.ball={direction:runtime.S.wx>o.x?-1:1,age:0,phase:'out'};}
    else{guide(o);finish(o);}break;
   }
  }
 }
 function draw(){
  if(!runtime.inWorld()||runtime.labMode)return;const s=runtime.S,c=runtime.cx,still=reduced(),ox=runtime.W/2-runtime.camX,oy=runtime.H/2-runtime.camY;
  for(const o of nearby()){
   const distance=Math.hypot(o.x-s.wx,o.y-s.wy),fade=runtime.worldOpacity?.(distance)??Math.max(0,1-distance/650);if(fade<.01)continue;
   const lit=Math.min(1,Math.max(0,(o.lit||0)-clock)),b=o.ball,amount=b?Math.min(1,b.age/.7):0,ball=b?(b.phase==='out'?amount:1-amount)*55*b.direction:0;
   c.save();c.translate(o.x+ox,o.y+oy);c.globalAlpha=fade*.9;
   const lean=o.target&&o.done>clock?(o.target.x>o.x?.12:-.12):0;
   drawTotem(c,o,{light:lit,progress:o.progress||0,ball:still?(b?.phase==='out'?55*b.direction:0):ball,lean,dance:clock*8,still});
   if(b){const tx=b.direction*55,ty=-10;c.strokeStyle='#ffffff66';c.lineWidth=1;c.setLineDash([2,5]);c.beginPath();c.arc(tx,ty,18,0,Math.PI*2);c.stroke();c.setLineDash([]);}
   if(o.target&&o.done>clock){const dx=o.target.x-o.x,dy=o.target.y-o.y,d=Math.hypot(dx,dy)||1;c.strokeStyle='#fff';c.lineWidth=1;c.setLineDash([2,5]);c.beginPath();c.moveTo(0,-35);c.lineTo(dx/d*75,dy/d*75-35);c.stroke();c.setLineDash([]);c.fillStyle='#fff';c.fillRect(dx/d*75-2,dy/d*75-37,4,4);}
   if(distance<150){c.globalAlpha=fade*.85;c.font='10px "Geist Mono",monospace';c.textAlign='center';c.fillStyle='#fff';const action=TOTEMS[o.kind].action,text=o.done>clock?(o.target?(o.target.crystal?'Un cristal por aquí':'Otra voz por aquí'):'Despierto') : b?'Acompaña la esfera':action==='stack'?'Pulsa · '+(o.progress||0)+'/3':'Lanza un pulso';c.fillText(text,0,19);}
   c.restore();
  }
 }
 Object.defineProperties(runtime,{totemTick:{get:()=>tick},drawTotems:{get:()=>draw},totemNear:{get:()=>nearby},totemState:{get:()=>({cache:cache.size,clock,near:nearby().map(o=>({...o}))})}});
}
