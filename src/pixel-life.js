import {PIXEL_CELL,pixelColony,pixelGeometry,moveInhabitant,migratingBeings} from './pixel-life-model.js';
import {contactEntry} from './contact.js';
export function initialize(runtime){
 const cache=new Map(),travellers=new Map(),geometry=new WeakMap();let owner=null,scope='',seconds=0,travelSeconds=0,items=[],lastCell='',queued=0,barKey='',pointer=null,tap=null;
 const reduced=()=>!!(runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches),
  surface=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie',
  active=()=>surface()&&!document.hidden&&!runtime.scanning&&!runtime.noticeLane?.inspecting&&!document.querySelector('.modal:not([hidden])');
 function reset(){owner=runtime.S;scope=runtime.worldIdentity?.seed;cache.clear();travellers.clear();items=[];seconds=travelSeconds=0;lastCell='';queued=0;barKey='';tap=pointer=null;}
 function neighbors(){
  const s=runtime.S,cx=Math.floor(s.wx/PIXEL_CELL),cy=Math.floor(s.wy/PIXEL_CELL),cell=cx+','+cy;
  if(cell===lastCell)return;lastCell=cell;const local=[];
  for(let a=cx-2;a<=cx+2;a++)for(let b=cy-2;b<=cy+2;b++){
   const key=a+','+b;if(!cache.has(key)){const d=runtime.regionOfPos((a+.5)*PIXEL_CELL,(b+.5)*PIXEL_CELL);cache.set(key,pixelColony(a,b,d,runtime.seedOf));}
   local.push(...cache.get(key));
  }
  while(cache.size>64)cache.delete(cache.keys().next().value);items=local;
 }
 function respond(o){
  if(!active()||seconds-(o.lastTouch??-10)<2)return false;o.lastTouch=seconds;o.lit=1;o.responseAt=seconds;runtime.visualGesture?.(o.x,o.y);
  const key=Math.floor((runtime.MU?.step||0)/16);if(barKey!==key){barKey=key;queued=0;}
  if(runtime.S.sound&&runtime.musicVolume?.()!==0&&runtime.ac?.state==='running'&&queued<2){
   queued++;const state=runtime.S,seed=scope;
   runtime.beatSoon(time=>{if(state!==runtime.S||seed!==runtime.worldIdentity?.seed||!active()||Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)>200)return;
    const d=runtime.regionOfPos(o.x,o.y);if(runtime.playVoice('habitante',0,time,d,false,.65,o,'player')===true){o.onset=runtime.musicalTime?.(time)??time;runtime.inhabitantNoteCue?.({id:o.id,time:o.onset,voice:runtime.getVoice('habitante',d,o)});}
   },null,'player');
  }return true;
 }
 function tick(dt){
  if(owner!==runtime.S||scope!==runtime.worldIdentity?.seed)reset();if(!active()){tap=null;return;}
  dt=Math.max(0,Math.min(.05,dt));seconds+=dt;neighbors();const s=runtime.S,player={x:s.wx,y:s.wy},still=reduced(),reach=Math.min(700,runtime.worldVisibility?.radius||500);
  if(!still)travelSeconds+=dt;
  const live=migratingBeings(s.wx,s.wy,travelSeconds,runtime.seedOf,reach+80),ids=new Set(live.map(o=>o.id));
  for(const fresh of live){const old=travellers.get(fresh.id);if(old){old.x=fresh.x;old.y=fresh.y;}else travellers.set(fresh.id,fresh);}
  for(const id of travellers.keys())if(!ids.has(id))travellers.delete(id);
  for(const o of [...items,...travellers.values()]){
   if(o.kind!=='viajero')moveInhabitant(o,player,seconds,dt,still);o.lit=Math.max(0,o.lit-dt*1.4);
   const inside=Math.hypot(o.x-s.wx,o.y-s.wy)<23;
   if(!runtime.body?.jump&&contactEntry(o,inside))respond(o);
  }
  if(tap){const candidates=nearby(700).filter(o=>Math.hypot(o.x-tap.x,o.y-tap.y)<30).sort((a,b)=>Math.hypot(a.x-tap.x,a.y-tap.y)-Math.hypot(b.x-tap.x,b.y-tap.y));if(candidates[0])respond(candidates[0]);tap=null;}
 }
 function nearby(reach=500){return [...items,...travellers.values()].filter(o=>Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<reach).sort((a,b)=>Math.hypot(a.x-runtime.S.wx,a.y-runtime.S.wy)-Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy)).slice(0,24);}
 function draw(){
  if(!surface()||owner!==runtime.S)return;const c=runtime.cx,s=runtime.S,still=reduced(),ox=runtime.W/2-s.wx,oy=runtime.H/2-s.wy;
  for(const o of nearby(Math.min(700,runtime.worldVisibility?.radius||500))){const d=Math.hypot(o.x-s.wx,o.y-s.wy),fade=runtime.worldOpacity?.(d)??Math.max(0,1-d/500);if(fade<.005)continue;
   const g=o.genome,p=still?0:seconds/g.period+g.phase,age=seconds-(o.responseAt??-10),response=age>=0&&age<1?Math.sin(age*Math.PI):0;
   let pixels=geometry.get(g);if(!pixels){pixels=pixelGeometry(g);geometry.set(g,pixels);}
   c.save();c.translate(o.x+ox,o.y+oy+(still?0:o.pose||0));if(!still){c.rotate((o.rotation||0)+Math.sin(p*2)*response*.25);c.scale(1+response*.16,1-response*.1);}
   c.globalAlpha=fade*(.65+o.lit*.35);c.fillStyle=runtime.musicInk?.(o,g.role)||'#bddbe0';
   const cell=1.5+(g.variant%3)*.2;for(const [x,y]of pixels)c.fillRect(Math.round(x*cell),Math.round(y*cell),cell,cell);
   if(o.kind==='viajero'&&!still){c.globalAlpha=fade*.2;for(let i=1;i<=3;i++)c.fillRect(-o.vx*.22*i,-o.vy*.22*i,2,2);}
   if(response){c.strokeStyle=c.fillStyle;c.lineWidth=1;c.globalAlpha=fade*response;c.beginPath();c.arc(0,0,still?15:12+age*12,0,Math.PI*1.7);c.stroke();}c.restore();
  }
 }
 const cv=runtime.cv||document.getElementById('w');
 cv?.addEventListener('pointerdown',e=>{if(!e.isPrimary||!active())return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,at:performance.now(),wx:runtime.S.wx,wy:runtime.S.wy};},{passive:true});
 globalThis.addEventListener('pointerup',e=>{const p=pointer;pointer=null;if(!p||p.id!==e.pointerId||!active()||performance.now()-p.at>450||Math.hypot(e.clientX-p.x,e.clientY-p.y)>14||Math.hypot(runtime.S.wx-p.wx,runtime.S.wy-p.wy)>20)return;
  const rect=cv.getBoundingClientRect();tap={x:(e.clientX-rect.left)*runtime.W/rect.width-runtime.W/2+runtime.S.wx,y:(e.clientY-rect.top)*runtime.H/rect.height-runtime.H/2+runtime.S.wy};
 },{passive:true});
 globalThis.addEventListener('pointercancel',()=>{pointer=tap=null;},{passive:true});
 function sources(){return nearby(250).map(object=>({object,kind:'habitante',name:object.kind==='viajero'?'Viajero del vacío':'Habitante · '+object.genome.activity,hint:'Acércate o toca su figura.',voice:runtime.getVoice('habitante',runtime.regionOfPos(object.x,object.y),object),distance:Math.hypot(object.x-runtime.S.wx,object.y-runtime.S.wy)}));}
 Object.defineProperties(runtime,{inhabitantTick:{get:()=>tick},drawInhabitants:{get:()=>draw},inhabitantsNear:{get:()=>nearby},inhabitantSources:{get:()=>sources},inhabitantTouch:{get:()=>respond},inhabitantState:{get:()=>({seconds,travelSeconds,cache:cache.size,travellers:travellers.size,visible:nearby().length})}});
}
