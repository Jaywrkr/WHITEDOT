import {audibleTime,scheduleAudibleCue} from './journey-pulse.js';
import {openSurface,prefersReducedMotion,frameMemo} from './frame-state.js';
import {HOUSE_ROOMS,HOUSE_OBJECTS,HOUSE_VERSION,normalizeHouse,houseOwns,placeHouseObject,encodeHouse,decodeHouse} from './house-model.js';
import {livingGlyph} from './living-art.js';
import {cubeSurface,cubeHalo,cubeAura} from './cube-art.js';
import {makeStage,drawStage} from './cube-shop-preview.js';
import {hash} from './house-capsules.js';
import {HOUSE_W,HOUSE_H,ROOF,EDGE,THREADS,FLOORS,SLAB,STAIRS,roomBox,wallPoint,roomAt,walk,stairFor,viewScale,houseNight,createShellCache,paintBackdrop} from './house-view.js';
export function initialize(runtime){const $=runtime.$,signals=new Map();let owner=null,knownDays=null,visit=null,active=false,action='walk',selected='obj:origen',drag=null,selectedObject=null;
 // The dollhouse view: where the cube stands (floor and position along it), the camera and the walk it is doing.
 const LANDING=1100;let landing=null,gardenRoom=null,brushed=new Map(),counts={brush:0,pulse:0},pulseAt=-1e9,lastCube=null,settled=0,lastBand='',floor=1,fx=280,climb=null,target=null,overview=false,cam=null,lastT=null,savedAt=0,stage=null,cues=[];const shell=createShellCache();
 function own(){if(owner!==runtime.S||owner.house?.version>HOUSE_VERSION&&!owner.house.readOnly){owner=runtime.S;knownDays=growth();owner.house=normalizeHouse(owner.house,owner.totalDays,found());visit=null;selected='obj:origen';action='walk';}else if(!owner.house.readOnly&&knownDays!==growth()){knownDays=growth();owner.house.unlocked=normalizeHouse(owner.house,owner.totalDays,found()).unlocked;}return owner.house;}
 const found=()=>Object.keys(runtime.S.ach||{}).length,growth=()=>runtime.S.totalDays+':'+found();
 const current=()=>visit||own();
 const items=h=>[...h.objects.filter(o=>o&&HOUSE_OBJECTS.some(d=>d.id===o.kind)),...(runtime.gardenObjects?.(h)||[]),...(runtime.capsuleObjects?.(h)||[])];
 const definition=o=>HOUSE_OBJECTS.find(p=>p.id===o.kind)||runtime.gardenDefinition?.(o)||runtime.capsuleDefinition?.(o);
 // A placement is committed once; failure restores the arrangement, never discovery ownership.
 function edit(change){const h=own(),objects=structuredClone(h.objects),decor=structuredClone(h.decor),garden=structuredClone(runtime.gardenState);if(change()===false)return false;if(runtime.save()===false){h.objects=objects;h.decor=decor;if(garden)runtime.S.collectionGarden=garden;runtime.toast('No se pudo guardar. Tu refugio sigue intacto.',{level:2});return false;}return true;}
 function putAway(kind){const h=own(),o=items(h).find(o=>o.kind===kind);if(!o||o.capsule||o.gardenSeed)return;const ok=edit(()=>{if(o.gardenCard){const b=runtime.gardenState;if(b.readOnly)return false;b.cards=b.cards.filter(id=>id!==o.cardId);}else h.objects=h.objects.filter(p=>p!==o);});if(ok){selectedObject=null;runtime.toast('Objeto guardado.');}palette();}
 function place(kind,point){if(kind.startsWith('garden:'))return runtime.moveGardenObject?.(kind,point);if(kind.startsWith('sound:')){const d=own().decor.find(d=>d.id===kind);if(!d)return false;Object.assign(d,{room:point.room,x:point.x,y:point.y});return true;}return placeHouseObject(own(),kind,point.room,point.x,point.y);}
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 // Free screen between the top counters and the house panel.
 const view=()=>frameMemo('house:view',()=>{const bottom=$('housePanel').hidden?runtime.H:$('housePanel').getBoundingClientRect().top-8,hud=Math.max(0,...[...document.querySelectorAll('.hud,#goal')].filter(e=>e.offsetParent).map(e=>e.getBoundingClientRect().bottom)),top=Math.min(Math.max(0,hud+8),bottom-160);return {top,bottom:Math.max(top+160,Math.min(runtime.H,bottom))};});
 const viewH=()=>{const v=view();return v.bottom-v.top;};
 const geometry=()=>{const k=viewScale(runtime.W,viewH(),overview);return {k,overview,W:runtime.W,H:viewH(),cam:cam||{x:HOUSE_W/2,y:HOUSE_H/2}};};
 // While it opens, the Refugio unfolds out of the cube: 0 folded, 1 open.
 const unfold=()=>{if(!landing)return 1;const p=(performance.now()-landing.at)/LANDING;if(p>=1||calm()){landing=null;return 1;}return 1-(1-p)**3;};
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
  const step=Math.abs(dx)>.05?(target=null,dx*240*dt):stepTowards(h,dt);if(step){fx=walk(floor,fx,step,h.unlocked);brush(h);}
  saveStand(h);
 }
 // Walking past an object makes it sound once; it rests a moment before it can again.
 function brush(h){const room=roomAt(floor,fx),b=roomBox(room),now=performance.now();for(const o of items(h)){if(o.room!==room||!definition(o))continue;const ox=b.x+18+o.x*(b.w-36);if(Math.abs(ox-fx)>22||now-(brushed.get(o.kind)||-1e9)<2500)continue;brushed.set(o.kind,now);counts.brush++;runtime.now(t=>runtime.playHouseObject(o,t,h));}}
 function cubeAt(){if(climb){const k=climb.t<.5?2*climb.t*climb.t:1-2*(1-climb.t)**2;return {x:climb.x0+(climb.x1-climb.x0)*k,y:climb.y0+(climb.y1-climb.y0)*k};}return {x:fx,y:FLOORS[floor].bottom};}
 function camera(dt){const g=geometry(),c=cubeAt(),half=runtime.W/2/g.k,tx=overview?HOUSE_W/2:Math.max(half-50,Math.min(HOUSE_W+50-half,c.x)),fy=climb?(FLOORS[climb.s.from].top+FLOORS[climb.s.to].bottom)/2:(FLOORS[floor].top+FLOORS[floor].bottom)/2,ty=overview?(EDGE.top+EDGE.bottom)/2:fy-8;
  if(!cam||calm())cam={x:tx,y:ty};else{const f=Math.min(1,dt*5);cam={x:cam.x+(tx-cam.x)*f,y:cam.y+(ty-cam.y)*f};}
  // Settled once the camera has arrived and the free band has kept its size for a few frames.
  const band=view().top+':'+view().bottom;settled=Math.abs(tx-cam.x)<.5&&Math.abs(ty-cam.y)<.5&&band===lastBand?settled+1:0;lastBand=band;}
 function palette(){const h=own();$('houseGardenTools').hidden=!!visit||!!h.readOnly||roomAt(floor,fx)!=='jardin';gardenRoom=null;$('houseObjects').replaceChildren();for(const available of [true,false]){const group=document.createElement('optgroup');group.label=available?'Puedes colocar':'Por descubrir';for(const d of HOUSE_OBJECTS){const owned=houseOwns(d,runtime.S);if(!!owned!==available)continue;const o=document.createElement('option');o.value=d.id;o.disabled=!owned;o.textContent=d.name;group.append(o);}if(group.children.length)$('houseObjects').append(group);}$('houseObjects').value=selected;$('houseShare').disabled=!!h.readOnly;$('housePlace').setAttribute('aria-pressed',String(action==='place'));$('housePick').hidden=action!=='place'||!!visit||!!h.readOnly;$('houseCount').textContent=h.objects.filter(o=>o&&HOUSE_OBJECTS.some(d=>d.id===o.kind)).length+' de 40';$('houseObjects').disabled=!!visit||!!h.readOnly;$('housePlace').disabled=!!visit||!!h.readOnly;$('houseHint').textContent=h.readOnly?'Este refugio necesita una versión más reciente.':visit?'De visita en otro refugio. Tu colección sigue contigo.':action==='place'?'Toca una pared para colocar. Arrastra fuera para guardar.':'Toca para caminar. Arrastra un objeto para moverlo.';$('houseOverview').setAttribute('aria-pressed',String(overview));runtime.hud();}
 function land(){const S=runtime.S;if(runtime.inWorld?.()){const st=S.studio;if(st.x!=null&&Math.hypot(st.x-S.wx,st.y-S.wy)>400){(S.camps||=[]).push([Math.round(st.x),Math.round(st.y)]);if(S.camps.length>30)S.camps.shift();}st.x=S.wx;st.y=S.wy;st.biome=runtime.biomeOfPos(S.wx,S.wy);}
  const first=!own().landed;enter();if(!calm())landing={at:performance.now()};if(!own().readOnly&&first){own().landed=true;runtime.save();runtime.say?.(runtime.VOZ.houseFirst);}else if(runtime.inWorld?.()===false&&runtime.S.prevMode==='world')runtime.toast('<em>Refugio</em> · se abrió en '+(runtime.BIOMES?.[runtime.S.studio.biome||0]?.name||'el Mundo'));}
 function back(){$('studioPanel').hidden=true;active=true;cam=null;$('housePanel').hidden=false;palette();runtime.hud();}
 function enter(){visit=null;action='walk';overview=false;cam=null;runtime.enterStudio({house:true});active=true;standFromSave(own());if(!own().readOnly){own().visited=true;own().seen=runtime.houseSeenNow?.();}runtime.save();$('studioPanel').hidden=true;$('housePanel').hidden=false;palette();}
 // What arrived while you were inside (a trophy unlocked a moment later) counts as seen too.
 function exit(){if(active&&!visit&&!own().readOnly)own().seen=runtime.houseSeenNow?.();if(active)saveStand(current(),true);drag=null;active=false;visit=null;$('housePanel').hidden=true;runtime.exitStudio();}
 function workshop(){drag=null;active=false;visit=null;$('housePanel').hidden=true;runtime.renderBag();$('studioPanel').hidden=false;}
 function tap(px,py){const h=current();if(h.readOnly)return;for(const r of HOUSE_ROOMS){const rect=roomRect(r.id),b=roomBox(r.id),top=toScreen(b.x,b.y),bottom=toScreen(b.x+b.w,b.y+b.h+12);if(px<top.x||py<top.y||px>bottom.x||py>bottom.y)continue;if(!h.unlocked.includes(r.id)){runtime.toast(r.name+': juega '+r.days+' días o gana '+r.found+' logros.');return;}const x=Math.max(0,Math.min(1,(px-rect.x)/rect.w)),y=Math.max(0,Math.min(1,(py-rect.y)/rect.h));const nearest=items(h).filter(o=>o.room===r.id&&(!o.gardenSeed||action==='walk')).sort((a,b)=>Math.hypot((a.x-x)*rect.w,(a.y-y)*rect.h)-Math.hypot((b.x-x)*rect.w,(b.y-y)*rect.h))[0],near=nearest&&Math.hypot((nearest.x-x)*rect.w,(nearest.y-y)*rect.h)<24;
   if(!visit&&!h.readOnly&&action==='place'){const d=HOUSE_OBJECTS.find(p=>p.id===selected);if(!houseOwns(d,runtime.S))return;if(edit(()=>placeHouseObject(h,selected,r.id,x,y)))runtime.now(t=>runtime.playHouseObject(h.objects.find(p=>p.kind===selected),t,h));palette();return;}
   else if(!visit&&!h.readOnly&&action==='erase'){if(near)putAway(nearest.kind);return;}
   else if(near)runtime.now(t=>runtime.playHouseObject(nearest,t,h));
   else{const hp=toHouse(px,py);if(action==='walk'&&runtime.houseCapsuleTap?.(hp.x,hp.y))return;const shelf=action==='walk'?runtime.houseLugaresLook?.(px,py):null;if(shelf!=null){if(shelf)runtime.toast(shelf,{level:2,category:'refugio'});return;}const look=action==='walk'&&runtime.houseCollectionLook?.(px,py);if(look){runtime.toast(look);return;}target={floor:b.floor,fx:toHouse(px,py).x};}
   if(!visit&&!h.readOnly)runtime.save();palette();return;}}
 function draw(t,dt,beat,dx=0,dy=0){const c=runtime.cx,h=current(),step=lastT===null?0:Math.min(.1,Math.max(0,(t-lastT)/1000));lastT=t;
  if(!h.readOnly&&!landing&&!openSurface('.modal:not([hidden])'))walkStep(h,step,dx,dy);camera(step);const g=geometry(),k=g.k,o0=toScreen(0,0),night=houseNight(),ink=runtime.musicInk?.(null,'lead')||'#f0d27a';
  const dpr=Math.max(1,runtime.cx.getTransform?.().a||1),cache=shell(k,dpr,{unlocked:h.unlocked,ink});
  c.save();c.globalAlpha=1;paintBackdrop(c,runtime.W,runtime.H,night,t,calm(),{biome:visit?'llanura':runtime.BIOMES?.[runtime.S.studio?.biome||0]?.id});
  // The house stays in its own band: the counters above keep plain sky behind them.
  const v=view();c.save();c.beginPath();c.rect(0,v.top,runtime.W,v.bottom-v.top+8);c.clip();
  // Unfolding: everything grows out of the cube and fades in.
  const open=unfold(),at0=cubeAt(),o=toScreen(at0.x,at0.y-15);c.save();if(open<1){c.translate(o.x,o.y);c.scale(open,open);c.translate(-o.x,-o.y);c.globalAlpha=Math.min(1,open*1.4);}const fade=c.globalAlpha;
  if(cache)c.drawImage(cache,o0.x-cache.pad*k,o0.y-(ROOF+cache.pad)*k,cache.width/dpr,cache.height/dpr);
  // A gold point travels each open thread between chambers.
  for(const th of THREADS)if(th.rooms.every(r=>h.unlocked.includes(r))){const d=toScreen(th.x,th.y0+(calm()?.5:(t/3200)%1)*(th.y1-th.y0));c.fillStyle=ink;c.fillRect(Math.round(d.x-1.5),Math.round(d.y-1.5),3,3);}
  // The bar walks across each open room: a soft light on the current step.
  const now=runtime.ac?audibleTime(runtime.ac):0;while(cues.length>1&&cues[1].time<=now)cues.shift();const cue=cues[0]&&cues[0].time<=now&&now-cues[0].time<.6?cues[0]:null;
  for(const r of HOUSE_ROOMS){const b=roomBox(r.id),rect=roomRect(r.id),ok=h.unlocked.includes(r.id),label=toScreen(b.x+26,b.y+22);c.font='11px "Geist Mono", monospace';c.letterSpacing='2px';c.fillStyle=ok?'#ffffff8c':'#ffffff4d';c.fillText((ok?r.name:r.name+' · '+r.days+' días o '+r.found+' logros').toLocaleUpperCase('es'),label.x,label.y);c.letterSpacing='0px';
   if(!ok)continue;
   if(cue&&runtime.S.sound&&!calm()){const x=rect.x+(cue.s+.5)/16*rect.w,grad=c.createLinearGradient(0,rect.y,0,rect.y+rect.h);grad.addColorStop(0,'rgba(255,255,255,0)');grad.addColorStop(1,'rgba(255,255,255,.10)');c.fillStyle=grad;c.fillRect(x-rect.w/40,rect.y-20,rect.w/20,rect.h+46);}
   // The bar under each chamber: sixteen ticks, the current one in gold.
   for(let i=0;i<16;i++){c.fillStyle=cue&&cue.s===i?ink:'#ffffff40';c.fillRect(Math.round(rect.x+(i+.5)/16*rect.w),Math.round(rect.y+rect.h+30),i%4?1:2,i%4?2:4);}
   for(const o of items(h).filter(o=>o.room===r.id)){const def=definition(o);if(!def)continue;const px=rect.x+o.x*rect.w,py=rect.y+o.y*rect.h,response=Math.max(0,1-(t-(signals.get(o.kind)??-Infinity))/650),col=h.tints?.[o.kind]||def.ink||(def.source==='cube:color:ffffff'?'#fff':'#f0d27a');
    c.save();c.translate(px,py);if(response){c.fillStyle=col;c.globalAlpha=response*.25;c.beginPath();c.arc(0,0,14+(1-response)*10,0,6.283);c.fill();c.globalAlpha=1;}
    c.strokeStyle=c.fillStyle=col;livingGlyph(c,{shape:def.shape,anatomy:def.appearance,size:Math.max(6,8*Math.min(1.3,k*1.4))+response*2,phase:o.x*6},t);if(o.kind===selectedObject){c.strokeStyle='#fff';c.strokeRect(-13,-13,26,26);}c.restore();}}
  c.globalAlpha=fade;if(drag?.point){const rr=roomRect(drag.point.room),def=HOUSE_OBJECTS.find(p=>p.id===drag.kind);c.save();c.globalAlpha=.55;c.translate(rr.x+drag.point.x*rr.w,rr.y+drag.point.y*rr.h);c.strokeStyle='#fff';livingGlyph(c,{shape:def?.shape||'seed',size:9,phase:0},t);c.strokeRect(-14,-14,28,28);c.restore();}
  runtime.cubeShopSoundTick?.(t);
  // Frames, trophies, showcases, garden plants and visiting creatures.
  runtime.drawHouseCollection?.(c,{toScreen,k,t,dt:step,calm:calm(),house:h,cube:{floor,x:cubeAt().x}});runtime.drawHouseLugares?.(c,{toScreen,k,t,calm:calm(),house:h});
  // Capsule decorations, the capsule machine and the Taller label.
  runtime.drawHouseCapsules?.(c,{toScreen,k,t,calm:calm(),house:h,cube:{floor,x:cubeAt().x},night});runtime.houseGuideTick?.();
  c.restore();
  const here=roomAt(floor,fx)==='jardin'&&!visit&&!h.readOnly;if(here!==gardenRoom){gardenRoom=here;$('houseGardenTools').hidden=!here;}
  // The cube, dressed with everything it wears, standing on its floor.
  const at=cubeAt(),size=Math.max(12,30*k),p=toScreen(at.x,at.y-15),color=runtime.cubeColor(),settings=runtime.cubeSettings();
  if(!stage){stage=makeStage({W:runtime.W,H:runtime.H});}stage.rt.sparkEconomy=runtime.sparkEconomy||stage.rt.sparkEconomy;stage.rt.musicInk=(a,b)=>runtime.musicInk?.(a,b)||'#fff';stage.S.reducedMotion=calm();stage.S.wx=at.x;stage.S.wy=at.y;stage.clock.t=t;stage.clock.beat=beat;
  lastCube={x:p.x,y:p.y,size};
  const ring=(performance.now()-pulseAt)/600;if(ring>=0&&ring<1&&!calm()){c.strokeStyle='#ffffff';c.globalAlpha=(1-ring)*.6;c.lineWidth=1.5;c.beginPath();c.arc(p.x,p.y,size*(.8+ring*5),0,6.283);c.stroke();c.lineWidth=1;c.globalAlpha=1;}
  if(open<1&&!calm()){c.strokeStyle='#ffffff';c.globalAlpha=.6*(1-open);c.beginPath();c.arc(p.x,p.y,size*(1+open*6),0,6.283);c.stroke();c.globalAlpha=1;}
  cubeHalo(c,settings,p.x,p.y,size,t,beat);cubeAura(c,settings,p.x,p.y,t,beat);c.globalAlpha=1;drawStage(stage,c,p.x,p.y,size,color,{pulseLook:false});cubeSurface(c,settings,p.x,p.y,size,t,beat);
  c.restore();c.restore();return 0;}
 function pointerPoint(e){for(const r of HOUSE_ROOMS){const rect=roomRect(r.id);if(e.clientX>=rect.x-12&&e.clientX<=rect.x+rect.w+12&&e.clientY>=rect.y-12&&e.clientY<=rect.y+rect.h+12&&current().unlocked.includes(r.id))return {room:r.id,x:Math.max(0,Math.min(1,(e.clientX-rect.x)/rect.w)),y:Math.max(0,Math.min(1,(e.clientY-rect.y)/rect.h))};}return null;}
 function down(e){if(!active||runtime.S.mode!=='studio'||!e.isPrimary||e.target!==$('w')||openSurface('.modal:not([hidden])'))return false;const point=pointerPoint(e),h=current();if(h.readOnly)return true;if(!point){tap(e.clientX,e.clientY);return true;}if(runtime.S.sound)runtime.audio();const rect=roomRect(point.room),nearest=items(h).filter(o=>o.room===point.room&&definition(o)&&(!o.gardenSeed||action==='walk')).find(o=>Math.hypot((o.x-point.x)*rect.w,(o.y-point.y)*rect.h)<24);
  if(nearest?.gardenSeed){tap(e.clientX,e.clientY);return true;}
  if(!visit&&!h.readOnly&&action!=='erase'&&(action==='place'||nearest)){const kind=action==='place'?selected:nearest.kind;if(!/^(garden|sound):/.test(kind)&&!houseOwns(HOUSE_OBJECTS.find(d=>d.id===kind),runtime.S))return true;selectedObject=kind;drag={pointer:e.pointerId,kind,point,start:{x:e.clientX,y:e.clientY},moved:false};try{$('w').setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();return true;}
  tap(e.clientX,e.clientY);return true;
 }
 function move(e){if(drag?.pointer!==e.pointerId)return false;drag.point=pointerPoint(e);drag.moved||=Math.hypot(e.clientX-drag.start.x,e.clientY-drag.start.y)>8;return true;}
 function up(e){if(drag?.pointer!==e.pointerId)return false;const d=drag;drag=null;if(e.type==='pointerup'&&!d.point&&d.moved&&!visit&&!own().readOnly&&!openSurface('.modal:not([hidden])')){const hp=toHouse(e.clientX,e.clientY);if(hp.x<-10||hp.x>HOUSE_W+10||hp.y<EDGE.top||hp.y>EDGE.bottom){putAway(d.kind);return true;}}if(e.type==='pointerup'&&d.point&&!visit&&!own().readOnly&&!document.hidden&&!openSurface('.modal:not([hidden])')){if(action==='walk'&&!d.moved){tap(e.clientX,e.clientY);return true;}if(edit(()=>place(d.kind,d.point)))runtime.now(t=>runtime.playHouseObject(items(own()).find(o=>o.kind===d.kind),t,own()));palette();}return true;}
 addEventListener('blur',()=>drag=null);addEventListener('visibilitychange',()=>{if(document.hidden)drag=null;});
 $('housePlace').onclick=()=>{drag=null;action=action==='place'?'walk':'place';palette();};$('houseOverview').onclick=()=>{overview=!overview;palette();};$('bStudio').onclick=()=>{$('mMenu').hidden=true;land();};$('houseExit').onclick=exit;$('houseObjects').onchange=e=>{drag=null;selected=e.target.value;action='place';palette();};
 $('houseShare').onclick=()=>{$('houseCode').value=encodeHouse(own());$('mHouseCode').hidden=false;};$('houseCodeClose').onclick=()=>{$('mHouseCode').hidden=true;};$('houseVisit').onclick=()=>{let h;const code=$('houseCode').value.trim();try{h=decodeHouse(code);}catch(e){$('houseCodeInfo').textContent=e.message;return;}
  // Each different house visited is kept once; your own code is not. Creatures that visit you live in knownVisitors.
  const mine=own();let yours=false;try{yours=!mine.readOnly&&code===encodeHouse(mine);}catch(_){}if(!mine.readOnly&&!yours){const id='v'+hash(code);mine.visitedHouses=mine.visitedHouses&&typeof mine.visitedHouses==='object'&&!Array.isArray(mine.visitedHouses)?mine.visitedHouses:{};if(!mine.visitedHouses[id]){mine.visitedHouses[id]=runtime.S.todayKey||true;runtime.save();}}
  if(active)saveStand(mine,true);drag=null;action='walk';runtime.enterStudio({house:true});active=true;visit=h;overview=false;cam=null;standFromSave(h);$('mHouseCode').hidden=true;$('mMenu').hidden=true;$('studioPanel').hidden=true;$('housePanel').hidden=false;palette();};
 Object.defineProperties(runtime,{houseVisualCue:{get:()=>((o,time)=>{const h=current();scheduleAudibleCue(runtime,time,()=>{if(active&&current()===h)signals.set(o.kind,performance.now());});})},housePointerDown:{get:()=>down},housePointerMove:{get:()=>move},housePointerUp:{get:()=>up},houseActive:{get:()=>()=>active&&runtime.S.mode==='studio'},currentHouse:{get:()=>current},enterHouse:{get:()=>enter},houseTap:{get:()=>tap},houseStep:{get:()=>draw},houseStepCue:{get:()=>(s,time)=>{cues.push({s,time});if(cues.length>32)cues.splice(0,cues.length-32);}},houseSettled:{get:()=>()=>settled>=3&&!target&&!climb&&!landing},houseMotion:{get:()=>()=>({x:cubeAt().x,y:cubeAt().y})},exitHouse:{get:()=>exit},housePulse:{get:()=>()=>{if(!active)return;pulseAt=performance.now();counts.pulse++;const at=cubeAt(),h=current();runtime.houseCollectionPulse?.({floor,x:at.x});
   if(!runtime.S.sound||h.readOnly)return;runtime.audio();const region=runtime.regionOfPos(runtime.S.wx,runtime.S.wy);
   const near=items(h).filter(o=>definition(o)&&roomBox(o.room)?.floor===floor).map(o=>{const b=roomBox(o.room);return {o,d:Math.abs(b.x+18+o.x*(b.w-36)-at.x)};}).filter(e=>e.d<220).sort((a,b)=>a.d-b.d).slice(0,4);
   runtime.now(t=>{runtime.playVoice('pulso',0,t,region,false,.5,null,'player');near.forEach((e,i)=>runtime.playHouseObject(e.o,t+(i+1)*(runtime.SIX||.125),h));});}},houseSounds:{get:()=>()=>({...counts,ambience:runtime.houseAmbience?.()||''})},houseCube:{get:()=>()=>lastCube},houseStand:{get:()=>()=>({floor,fx,room:roomAt(floor,fx),climbing:!!climb,overview,target:!!target})},houseWalkTo:{get:()=>(room,x)=>{const b=roomBox(room);if(b)target={floor:b.floor,fx:b.x+18+x*(b.w-36)};}},houseGeometry:{get:()=>geometry},houseRoomRect:{get:()=>roomRect},houseOpenWorkshop:{get:()=>workshop},landHouse:{get:()=>land},houseBack:{get:()=>back},houseLanding:{get:()=>()=>!!landing},houseVisiting:{get:()=>()=>!!visit},houseToScreen:{get:()=>toScreen},houseOwns:{get:()=>d=>houseOwns(d,runtime.S)},houseObjects:{get:()=>HOUSE_OBJECTS}});own();
}
