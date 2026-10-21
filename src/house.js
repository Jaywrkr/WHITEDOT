import {openSurface,prefersReducedMotion,frameMemo} from './frame-state.js';
import {HOUSE_ROOMS,HOUSE_OBJECTS,HOUSE_VERSION,normalizeHouse,houseOwns,placeHouseObject,encodeHouse,decodeHouse} from './house-model.js';
import {livingGlyph} from './living-art.js';
import {cubeSurface,cubeHalo,cubeAura} from './cube-art.js';
import {makeStage,drawStage} from './cube-shop-preview.js';
import {HOUSE_W,HOUSE_H,ROOF,FLOORS,SLAB,STAIRS,roomBox,wallPoint,roomAt,walk,stairFor,viewScale,houseNight,createShellCache,paintBackdrop} from './house-view.js';
export function initialize(runtime){const $=runtime.$,signals=new Map();let owner=null,knownDays=null,visit=null,active=false,action='walk',selected='obj:origen',drag=null,selectedObject=null;
 // The dollhouse view: where the cube stands (floor and position along it), the camera and the walk it is doing.
 let pulseAt=-1e9,lastCube=null,settled=0,lastBand='',floor=1,fx=280,climb=null,target=null,overview=false,cam=null,lastT=null,savedAt=0,stage=null,cues=[];const shell=createShellCache();
 function own(){if(owner!==runtime.S||owner.house?.version>HOUSE_VERSION&&!owner.house.readOnly){owner=runtime.S;knownDays=owner.totalDays;owner.house=normalizeHouse(owner.house,owner.totalDays);visit=null;selected='obj:origen';action='walk';}else if(!owner.house.readOnly&&knownDays!==owner.totalDays){knownDays=owner.totalDays;owner.house.unlocked=normalizeHouse(owner.house,owner.totalDays).unlocked;}return owner.house;}
 const current=()=>visit||own();
 const items=h=>[...h.objects.filter(o=>o&&HOUSE_OBJECTS.some(d=>d.id===o.kind)),...(runtime.gardenObjects?.(h)||[])];
 const definition=o=>HOUSE_OBJECTS.find(p=>p.id===o.kind)||runtime.gardenDefinition?.(o);
 function place(kind,point){if(kind.startsWith('garden:'))return runtime.moveGardenObject?.(kind,point);return placeHouseObject(own(),kind,point.room,point.x,point.y);}
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 // Free screen above the house panel.
 // Free screen between the top counters and the house panel.
 const view=()=>frameMemo('house:view',()=>{const bottom=$('housePanel').hidden?runtime.H:$('housePanel').getBoundingClientRect().top-8,hud=Math.max(0,...[...document.querySelectorAll('.hud,#goal')].filter(e=>e.offsetParent).map(e=>e.getBoundingClientRect().bottom)),top=Math.min(Math.max(0,hud+8),bottom-160);return {top,bottom:Math.max(top+160,Math.min(runtime.H,bottom))};});
 const viewH=()=>{const v=view();return v.bottom-v.top;};
 const geometry=()=>{const k=viewScale(runtime.W,viewH(),overview);return {k,overview,W:runtime.W,H:viewH(),cam:cam||{x:HOUSE_W/2,y:HOUSE_H/2}};};
 const toScreen=(hx,hy)=>{const g=geometry();return {x:runtime.W/2+(hx-g.cam.x)*g.k,y:view().top+g.H/2+(hy-g.cam.y)*g.k};};
 const toHouse=(px,py)=>{const g=geometry();return {x:g.cam.x+(px-runtime.W/2)/g.k,y:g.cam.y+(py-view().top-g.H/2)/g.k};};
 // The wall area of a room on screen: objects use x (beat) and y (height) inside it.
 function roomRect(id){const b=roomBox(id);if(!b)return null;const a=toScreen(...Object.values(wallPoint(b,0,0))),z=toScreen(...Object.values(wallPoint(b,1,1)));return {x:a.x,y:a.y,w:z.x-a.x,h:z.y-a.y,size:z.x-a.x};}
 // Where the cube stands, from the saved room and position.
 function standFromSave(h){const b=roomBox(HOUSE_ROOMS.some(r=>r.id===h.playerRoom)?h.playerRoom:'sala');floor=b.floor;fx=b.x+18+(Number.isFinite(h.x)?h.x:.5)*(b.w-36);climb=null;target=null;}
 function saveStand(h,force=false){if(visit||h.readOnly)return;const room=roomAt(floor,fx),b=roomBox(room),x=Math.max(0,Math.min(1,(fx-b.x-18)/(b.w-36)));if(h.playerRoom===room&&Math.abs((h.x??.5)-x)<.02&&!force)return;h.playerRoom=room;h.x=x;const now=performance.now();if(force||now-savedAt>2000){savedAt=now;runtime.save();}}
 const stairsTo=(from,to)=>STAIRS.find(s=>s.from===from&&s.to===to);
 // A walk goal on another floor goes by the stairs, one floor at a time.
 function stepTowards(h,dt){if(!target||climb)return 0;if(target.floor===floor){const d=target.fx-fx;if(Math.abs(d)<3){target=null;return 0;}return Math.sign(d)*Math.min(Math.abs(d),260*dt);}
  const next=target.floor<floor?floor-1:floor+1,s=stairsTo(floor,next);if(!s||!h.unlocked.includes(s.room)){target=null;return 0;}const mid=(s.x0+s.x1)/2;if(Math.abs(mid-fx)>3)return Math.sign(mid-fx)*Math.min(Math.abs(mid-fx),260*dt);startClimb(s);return 0;}
 function startClimb(s){const fromY=FLOORS[s.from].bottom,toY=FLOORS[s.to].bottom,up=s.to<s.from;climb={s,t:0,x0:fx,y0:fromY,x1:up?s.x1-10:s.x0+10,y1:toY};}
 function walkStep(h,dt,dx,dy){
  if(climb){climb.t+=dt/(calm()?.01:.7);if(climb.t>=1){floor=climb.s.to;fx=climb.x1;climb=null;saveStand(h,true);}return;}
  if(Math.abs(dy)>.5){const s=stairFor(floor,fx,dy<0?-1:1,h.unlocked);if(s){target=null;startClimb(s);return;}}
  const step=Math.abs(dx)>.05?(target=null,dx*240*dt):stepTowards(h,dt);if(step){fx=walk(floor,fx,step,h.unlocked);}
  saveStand(h);
 }
 function cubeAt(){if(climb){const k=climb.t<.5?2*climb.t*climb.t:1-2*(1-climb.t)**2;return {x:climb.x0+(climb.x1-climb.x0)*k,y:climb.y0+(climb.y1-climb.y0)*k};}return {x:fx,y:FLOORS[floor].bottom};}
 function camera(dt){const g=geometry(),c=cubeAt(),half=runtime.W/2/g.k,tx=overview?HOUSE_W/2:Math.max(half-50,Math.min(HOUSE_W+50-half,c.x)),fy=climb?(FLOORS[climb.s.from].top+FLOORS[climb.s.to].bottom)/2:(FLOORS[floor].top+FLOORS[floor].bottom)/2,ty=overview?(HOUSE_H-ROOF)/2:fy-8;
  if(!cam||calm())cam={x:tx,y:ty};else{const f=Math.min(1,dt*5);cam={x:cam.x+(tx-cam.x)*f,y:cam.y+(ty-cam.y)*f};}
  // Settled once the camera has arrived and the free band has kept its size for a few frames.
  const band=view().top+':'+view().bottom;settled=Math.abs(tx-cam.x)<.5&&Math.abs(ty-cam.y)<.5&&band===lastBand?settled+1:0;lastBand=band;}
 function palette(){const h=own();$('houseGardenTools').hidden=!!visit||!!h.readOnly;$('houseObjects').replaceChildren();for(const d of HOUSE_OBJECTS){const o=document.createElement('option');o.value=d.id;o.disabled=!houseOwns(d,runtime.S);o.textContent=(o.disabled?'□ ':'')+d.name;$('houseObjects').append(o);}$('houseObjects').value=selected;$('houseShare').disabled=!!h.readOnly;for(const [id,mode]of [['houseWalk','walk'],['housePlace','place'],['houseErase','erase']])$(id).setAttribute('aria-pressed',String(action===mode));$('housePick').hidden=action!=='place'||!!visit||!!h.readOnly;$('houseCount').textContent=h.objects.filter(o=>o&&HOUSE_OBJECTS.some(d=>d.id===o.kind)).length+' de 40';$('houseObjects').disabled=!!visit||!!h.readOnly;$('housePlace').disabled=!!visit||!!h.readOnly;$('houseErase').disabled=!!visit||!!h.readOnly;$('houseHint').textContent=h.readOnly?'Esta casa necesita una versión más reciente.':visit?'Visita esta casa. Tu colección sigue contigo.':action==='place'?'Toca una pared para colocar.':action==='erase'?'Toca un objeto para retirarlo.':'Toca para caminar o escuchar. Arrastra un objeto para moverlo.';$('houseOverview').setAttribute('aria-pressed',String(overview));runtime.hud();}
 function enter(){visit=null;action='walk';overview=false;cam=null;runtime.enterStudio({house:true});active=true;standFromSave(own());if(!own().readOnly)own().visited=true;runtime.save();$('studioPanel').hidden=true;$('housePanel').hidden=false;palette();}
 function exit(){if(active)saveStand(current(),true);drag=null;active=false;visit=null;$('housePanel').hidden=true;runtime.exitStudio();}
 function workshop(){drag=null;active=false;visit=null;$('housePanel').hidden=true;runtime.renderBag();$('studioPanel').hidden=false;}
 function tap(px,py){const h=current();if(h.readOnly)return;for(const r of HOUSE_ROOMS){const rect=roomRect(r.id),b=roomBox(r.id),top=toScreen(b.x,b.y),bottom=toScreen(b.x+b.w,b.y+b.h+12);if(px<top.x||py<top.y||px>bottom.x||py>bottom.y)continue;if(!h.unlocked.includes(r.id)){runtime.toast('Juega '+r.days+' días para abrir '+r.name+'.');return;}const x=Math.max(0,Math.min(1,(px-rect.x)/rect.w)),y=Math.max(0,Math.min(1,(py-rect.y)/rect.h));const nearest=items(h).filter(o=>o.room===r.id&&(!o.gardenSeed||action==='walk')).sort((a,b)=>Math.hypot((a.x-x)*rect.w,(a.y-y)*rect.h)-Math.hypot((b.x-x)*rect.w,(b.y-y)*rect.h))[0],near=nearest&&Math.hypot((nearest.x-x)*rect.w,(nearest.y-y)*rect.h)<24;
   if(!visit&&!h.readOnly&&action==='place'){const d=HOUSE_OBJECTS.find(p=>p.id===selected);if(!houseOwns(d,runtime.S))return;placeHouseObject(h,selected,r.id,x,y);runtime.now(t=>runtime.playHouseObject(h.objects.find(p=>p.kind===selected),t,h));}
   else if(!visit&&!h.readOnly&&action==='erase'){if(near){if(nearest.gardenCard){const b=runtime.gardenState;b.cards=b.cards.filter(id=>id!==nearest.cardId);}else h.objects=h.objects.filter(o=>o!==nearest);}}
   else if(near)runtime.now(t=>runtime.playHouseObject(nearest,t,h));
   else{const look=action==='walk'&&runtime.houseCollectionLook?.(px,py);if(look){runtime.toast(look);return;}target={floor:b.floor,fx:toHouse(px,py).x};}
   if(!visit&&!h.readOnly)runtime.save();palette();return;}}
 function draw(t,dt,beat,dx=0,dy=0){const c=runtime.cx,h=current(),step=lastT===null?0:Math.min(.1,Math.max(0,(t-lastT)/1000));lastT=t;
  if(!h.readOnly&&!openSurface('.modal:not([hidden])'))walkStep(h,step,dx,dy);camera(step);const g=geometry(),k=g.k,o0=toScreen(0,0),night=houseNight(),ink=runtime.musicInk?.(null,'lead')||'#f0d27a';
  const dpr=Math.max(1,runtime.cx.getTransform?.().a||1),cache=shell(k,dpr,{night,unlocked:h.unlocked,ink});
  c.save();c.globalAlpha=1;paintBackdrop(c,runtime.W,runtime.H,toScreen(0,FLOORS[2].top-SLAB).y,night,t,calm());
  // The house stays in its own band: the counters above keep plain sky behind them.
  const v=view();c.save();c.beginPath();c.rect(0,v.top,runtime.W,v.bottom-v.top+8);c.clip();
  if(cache)c.drawImage(cache,o0.x-cache.pad*k,o0.y-(ROOF+cache.pad)*k,cache.width/dpr,cache.height/dpr);
  // The bar walks across each open room: a soft light on the current step.
  const now=runtime.ac?.currentTime??0;while(cues.length>1&&cues[1].time<=now)cues.shift();const cue=cues[0]&&cues[0].time<=now&&now-cues[0].time<.6?cues[0]:null;
  for(const r of HOUSE_ROOMS){const b=roomBox(r.id),rect=roomRect(r.id),ok=h.unlocked.includes(r.id),label=toScreen(b.x+10,b.y+18);c.font='11px "Geist Mono", monospace';c.fillStyle=ok?'#ffffffb3':'#ffffff66';c.fillText(ok?r.name:r.name+' · se abre con '+r.days+' días',label.x,label.y);
   if(!ok)continue;
   if(cue&&runtime.S.sound&&!calm()){const x=rect.x+(cue.s+.5)/16*rect.w,grad=c.createLinearGradient(0,rect.y,0,rect.y+rect.h);grad.addColorStop(0,'rgba(255,255,255,0)');grad.addColorStop(.5,'rgba(255,255,255,.10)');grad.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=grad;c.fillRect(x-rect.w/32,rect.y-10,rect.w/16,rect.h+20);}
   c.fillStyle='#ffffff26';for(let i=0;i<16;i++)c.fillRect(Math.round(rect.x+(i+.5)/16*rect.w),Math.round(rect.y+rect.h+14),i%4?1:2,i%4?2:3);
   for(const o of items(h).filter(o=>o.room===r.id)){const def=definition(o);if(!def)continue;const px=rect.x+o.x*rect.w,py=rect.y+o.y*rect.h,response=Math.max(0,1-(t-(signals.get(o.kind)??-Infinity))/650),col=h.tints?.[o.kind]||def.ink||(def.source==='cube:color:ffffff'?'#fff':'#f0d27a');
    c.save();c.translate(px,py);c.strokeStyle='#ffffff40';c.beginPath();c.moveTo(-9,11);c.lineTo(9,11);c.stroke();if(response){c.fillStyle=col;c.globalAlpha=response*.25;c.beginPath();c.arc(0,0,14+(1-response)*10,0,6.283);c.fill();c.globalAlpha=1;}
    c.strokeStyle=c.fillStyle=col;livingGlyph(c,{shape:def.shape,anatomy:def.appearance,size:Math.max(6,8*Math.min(1.3,k*1.4))+response*2,phase:o.x*6},t);if(o.kind===selectedObject){c.strokeStyle='#fff';c.strokeRect(-13,-13,26,26);}c.restore();}}
  if(drag?.point){const rr=roomRect(drag.point.room),def=HOUSE_OBJECTS.find(p=>p.id===drag.kind);c.save();c.globalAlpha=.55;c.translate(rr.x+drag.point.x*rr.w,rr.y+drag.point.y*rr.h);c.strokeStyle='#fff';livingGlyph(c,{shape:def?.shape||'seed',size:9,phase:0},t);c.strokeRect(-14,-14,28,28);c.restore();}
  // Frames, trophies, showcases, garden plants and visiting creatures.
  runtime.drawHouseCollection?.(c,{toScreen,k,t,dt:step,calm:calm(),house:h,cube:{floor,x:cubeAt().x}});
  // The cube, dressed with everything it wears, standing on its floor.
  const at=cubeAt(),size=Math.max(12,30*k),p=toScreen(at.x,at.y-15),color=runtime.cubeColor(),settings=runtime.cubeSettings();
  if(!stage){stage=makeStage({W:runtime.W,H:runtime.H});}stage.rt.sparkEconomy=runtime.sparkEconomy||stage.rt.sparkEconomy;stage.rt.musicInk=(a,b)=>runtime.musicInk?.(a,b)||'#fff';stage.S.reducedMotion=calm();stage.S.wx=at.x;stage.S.wy=at.y;stage.clock.t=t;stage.clock.beat=beat;
  lastCube={x:p.x,y:p.y,size};
  const ring=(performance.now()-pulseAt)/600;if(ring>=0&&ring<1&&!calm()){c.strokeStyle='#ffffff';c.globalAlpha=(1-ring)*.6;c.lineWidth=1.5;c.beginPath();c.arc(p.x,p.y,size*(.8+ring*5),0,6.283);c.stroke();c.lineWidth=1;c.globalAlpha=1;}
  c.fillStyle='#00000066';c.beginPath();c.ellipse(p.x,p.y+size/2+2,size*.6,size*.18,0,0,6.283);c.fill();
  cubeHalo(c,settings,p.x,p.y,size,t,beat);cubeAura(c,settings,p.x,p.y,t,beat);c.globalAlpha=1;drawStage(stage,c,p.x,p.y,size,color,{pulseLook:false});cubeSurface(c,settings,p.x,p.y,size,t,beat);
  c.restore();c.restore();return 0;}
 function pointerPoint(e){for(const r of HOUSE_ROOMS){const rect=roomRect(r.id);if(e.clientX>=rect.x-12&&e.clientX<=rect.x+rect.w+12&&e.clientY>=rect.y-12&&e.clientY<=rect.y+rect.h+12&&current().unlocked.includes(r.id))return {room:r.id,x:Math.max(0,Math.min(1,(e.clientX-rect.x)/rect.w)),y:Math.max(0,Math.min(1,(e.clientY-rect.y)/rect.h))};}return null;}
 function down(e){if(!active||runtime.S.mode!=='studio'||!e.isPrimary||e.target!==$('w')||openSurface('.modal:not([hidden])'))return false;const point=pointerPoint(e),h=current();if(!point||h.readOnly)return true;if(runtime.S.sound)runtime.audio();const rect=roomRect(point.room),nearest=items(h).filter(o=>o.room===point.room&&definition(o)&&(!o.gardenSeed||action==='walk')).find(o=>Math.hypot((o.x-point.x)*rect.w,(o.y-point.y)*rect.h)<24);
  if(nearest?.gardenSeed){tap(e.clientX,e.clientY);return true;}
  if(!visit&&!h.readOnly&&action!=='erase'&&(action==='place'||nearest)){const kind=action==='place'?selected:nearest.kind;if(!kind.startsWith('garden:')&&!houseOwns(HOUSE_OBJECTS.find(d=>d.id===kind),runtime.S))return true;selectedObject=kind;drag={pointer:e.pointerId,kind,point,start:{x:e.clientX,y:e.clientY},moved:false};try{$('w').setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();return true;}
  tap(e.clientX,e.clientY);return true;
 }
 function move(e){if(drag?.pointer!==e.pointerId)return false;drag.point=pointerPoint(e);drag.moved||=Math.hypot(e.clientX-drag.start.x,e.clientY-drag.start.y)>8;return true;}
 function up(e){if(drag?.pointer!==e.pointerId)return false;const d=drag;drag=null;if(e.type==='pointerup'&&d.point&&!visit&&!own().readOnly&&!document.hidden&&!openSurface('.modal:not([hidden])')){if(action==='walk'&&!d.moved){tap(e.clientX,e.clientY);return true;}place(d.kind,d.point);runtime.now(t=>runtime.playHouseObject(items(own()).find(o=>o.kind===d.kind),t,own()));runtime.save();palette();}return true;}
 addEventListener('blur',()=>drag=null);addEventListener('visibilitychange',()=>{if(document.hidden)drag=null;});
 $('housePlace').onclick=()=>{drag=null;action='place';palette();};$('houseOverview').onclick=()=>{overview=!overview;palette();};$('bStudio').onclick=enter;$('houseExit').onclick=exit;$('houseWorkshop').onclick=workshop;$('houseWalk').onclick=()=>{drag=null;action='walk';palette();};$('houseErase').onclick=()=>{drag=null;action='erase';palette();};$('houseObjects').onchange=e=>{drag=null;selected=e.target.value;action='place';palette();};
 $('houseShare').onclick=()=>{$('houseCode').value=encodeHouse(own());$('mHouseCode').hidden=false;};$('houseCodeClose').onclick=()=>{$('mHouseCode').hidden=true;};$('houseVisit').onclick=()=>{let h;try{h=decodeHouse($('houseCode').value);}catch(e){$('houseCodeInfo').textContent=e.message;return;}runtime.enterStudio({house:true});active=true;visit=h;overview=false;cam=null;standFromSave(h);$('mHouseCode').hidden=true;$('mMenu').hidden=true;$('studioPanel').hidden=true;$('housePanel').hidden=false;palette();};
 Object.defineProperties(runtime,{houseVisualCue:{get:()=>((o,time)=>signals.set(o.kind,performance.now()+Math.max(0,(time-runtime.ac.currentTime)*1000)))},housePointerDown:{get:()=>down},housePointerMove:{get:()=>move},housePointerUp:{get:()=>up},houseActive:{get:()=>()=>active&&runtime.S.mode==='studio'},currentHouse:{get:()=>current},enterHouse:{get:()=>enter},houseTap:{get:()=>tap},houseStep:{get:()=>draw},houseStepCue:{get:()=>(s,time)=>{cues.push({s,time});if(cues.length>32)cues.splice(0,cues.length-32);}},houseSettled:{get:()=>()=>settled>=3&&!target&&!climb},exitHouse:{get:()=>exit},housePulse:{get:()=>()=>{if(!active)return;pulseAt=performance.now();runtime.houseCollectionPulse?.({floor,x:cubeAt().x});}},houseCube:{get:()=>()=>lastCube},houseStand:{get:()=>()=>({floor,fx,room:roomAt(floor,fx),climbing:!!climb,overview,target:!!target})},houseWalkTo:{get:()=>(room,x)=>{const b=roomBox(room);if(b)target={floor:b.floor,fx:b.x+18+x*(b.w-36)};}},houseGeometry:{get:()=>geometry},houseRoomRect:{get:()=>roomRect},houseOwns:{get:()=>d=>houseOwns(d,runtime.S)},houseObjects:{get:()=>HOUSE_OBJECTS}});own();
}
