// Recorrer lejos (F2, first batch; Jay, 3 Nov 2026, alpha.245; docs/MUNDO.md#recorrer-lejos): buoys of light every km,
// rest satellites every 10 km and their door, in the free World after the Journey, never in a chapter, a round, a
// finale, an activity or the Refugio. The model is recorrer-model.js.
// Boyas: a white buoy with its number on every km from the origin; the next one outward is marked at the screen's edge;
// passing one plays one soft note of the chord that sounds, on the beat. They pay nothing: they show the way.
// Satélites: a warm light every 10 km; inside it the music goes a little lower (the mix's bus, never audio.js) and the
// satellite is kept as a point of return. Its page is in the Bitácora and on the Mapa del universo; no sparks.
// La puerta: from inside a satellite you visited, to another one you visited or back to the ring (the map's card or the
// Bitácora). Only to where you have walked, so it is no free jump.
import {openSurface,prefersReducedMotion} from './frame-state.js';
import {freeOpen} from './journey-mode.js';
import {edgeSpot,worldKey,rumorNow} from './descubrir-model.js';
import {RECORRER_VERSION,BUOY_GAIN,SAT_GAIN,SAT_INSIDE,SAT_GLOW,SAT_EDGE,SAT_DUCK,normalizeRecorrer,nextBuoy,buoyHere,nearestBuoy,nearestSatellite,satelliteHere,kmFromOrigin,noteSatellite,noteBuoy,visited,doorFrom,doorPoint} from './recorrer-model.js';
const TAU=Math.PI*2,WARM='#ffd2a0';
export const satelliteName=km=>`Satélite · ${km} km`;
// The tic of a buoy and the two notes of a satellite: notes of the chord that sounds, an octave up, soft, on the beat.
export function playRecorrerNotes(r,time,count=1,gain=BUOY_GAIN,step=0){
 if(!r.S?.sound||r.ac?.state!=='running')return 0;const tones=r.chordTones?.()||[];if(!tones.length)return 0;const eighth=(r.SIX||.125)*2;let n=0;
 for(let i=0;i<count;i++){const note=tones[(step+i*2)%Math.min(3,tones.length)]+12,at=time+i*eighth,emit=()=>{r.hookInst?.('feltpiano',note,at,r.vel?r.vel(gain):gain);r.recorrerAudioCue?.({note,time:at,gain,six:r.SIX});};
  if(r.withVoiceOrigin)r.withVoiceOrigin('player',emit);else emit();n++;}
 return n;
}
export function initialize(r){
 const $=id=>r.$?.(id)||globalThis.document?.getElementById(id)||null;
 let owner=null,world='',clock=0,passed=new Map(),inside=null,ducked=false,glows=[],summary=null,drawn={buoy:null,sat:null,next:null,edge:{}},tics=0;
 const reduced=()=>!!(r.S.reducedMotion||prefersReducedMotion());
 // Where it lives: the free World's surface after the Journey, outside every level, activity, the Refugio and the finales.
 const allowed=()=>!!r.S&&r.inWorld?.()&&(r.S.layer||'superficie')==='superficie'&&freeOpen(r.S.journey)&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!r.houseActive?.()&&!r.travelInLevel?.()&&!r.placeRun?.()&&!r.placeCardDue?.()&&!r.songStageState?.()?.running&&!r.journeyFinaleState?.()?.running;
 const paused=()=>globalThis.document?.hidden||!!r.scanning||!!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 const scene=()=>!!r.liveEncounterActive?.()||!!r.skyMapActive?.()||!!(r.mischiefBusy?r.mischiefBusy():r.mischiefState?.scene);
 // The save (S.recorrer): normalised once per save; a later version is only read.
 function book(){if(owner!==r.S){owner=r.S;owner.recorrer=normalizeRecorrer(owner.recorrer);passed=new Map();inside=null;glows=[];summary=null;}world=worldKey(r.worldIdentity);return owner.recorrer;}
 const ok=()=>book().version===RECORRER_VERSION;
 const me=()=>({x:r.S.wx,y:r.S.wy});
 const today=()=>r.S.todayKey||'';
 const soon=fn=>{const state=r.S;if(state.sound&&r.ac?.state==='running'&&r.beatSoon)r.beatSoon(time=>{if(state===r.S)fn(time);},null,'player');};
 // The music a little lower inside a satellite: the mix's bus (where the voices meet before the room), eased in and out.
 // Alpha.246 (Jay): the whole output a little lower, evenly (dry, room and echo alike), through audio.js's musicVolume.
 function duck(on){const ac=r.ac;if(!ac||on===ducked)return;ducked=on;r.musicDuck=on?SAT_DUCK:1;const m=r.master;if(m?.gain&&r.musicVolume)m.gain.setTargetAtTime(r.musicVolume(),ac.currentTime,.6);}
 // Entering a satellite: kept once, with its notice; each time, the last one you were in.
 function enter(s){const q=book();if(!ok()||q.readOnly)return false;const before=structuredClone(q),res=noteSatellite(q,world,s,today());if(!res)return false;
  if(r.save?.()===false){owner.recorrer=before;return false;}
  soon(time=>playRecorrerNotes(r,time,2,SAT_GAIN,1));glows.push({x:s.x,y:s.y,at:clock,warm:true});
  if(res.first){summary={text:satelliteName(s.km)+' · Punto de retorno guardado',until:clock+4};if(r.S.universeTexts!==false)r.toast?.(`<em>Satélite de descanso</em> · ${s.km} km · Punto de retorno guardado`,{level:2});}
  return true;}
 // Passing a buoy: its tic, counted once in a while (the same buoy again only after you have left it).
 function pass(b){const q=book();passed.set(b.id,{at:clock,x:b.x,y:b.y});while(passed.size>24)passed.delete(passed.keys().next().value);if(!ok()||q.readOnly)return;
  const before={buoys:q.buoys,far:q.far},res=noteBuoy(q,b);if(r.save?.()===false){Object.assign(q,before);return;}tics++;
  soon(time=>playRecorrerNotes(r,time,1,BUOY_GAIN,b.km));glows.push({x:b.x,y:b.y,at:clock});
  summary={text:res?.far?`Boya · ${b.km} km · la más lejana`:`Boya · ${b.km} km`,until:clock+2.6};}
 // ---------- the frame ----------
 function tick(dt,modal=false){
  if(!r.S)return;book();
  if(!allowed()){if(inside)inside=null;duck(false);summary=null;return;}
  if(modal||paused()){return;}const step=Math.max(0,Math.min(.05,dt||0));clock+=step;
  if(summary&&clock>summary.until)summary=null;glows=glows.filter(g=>clock-g.at<1.4);
  const p=me(),s=satelliteHere(world,p);
  if(s&&inside?.id!==s.id){inside=s;enter(s);}else if(!s&&inside&&Math.hypot(inside.x-p.x,inside.y-p.y)>SAT_INSIDE*1.3)inside=null;
  duck(!!inside&&!!r.S.sound);
  const b=buoyHere(world,p);if(b&&!passed.has(b.id))pass(b);
  // A buoy left behind may sing again next time you come by.
  for(const [id,e] of passed)if(clock-e.at>8&&Math.hypot(e.x-p.x,e.y-p.y)>1500)passed.delete(id);
 }
 // ---------- drawing ----------
 const at=(x,y)=>({x:x+r.W/2-r.camX,y:y+r.H/2-r.camY});
 const onScreen=(q,m=40)=>q.x>-m&&q.y>-m&&q.x<r.W+m&&q.y<r.H+m;
 const say=(c,t,x,y)=>{const w=c.measureText(t).width;c.fillText(t,Math.max(8+w/2,Math.min(r.W-8-w/2,x)),y);};
 function drawBuoy(c,b,q,dim){c.globalAlpha=dim?.5:.95;c.strokeStyle='#ffffff';c.fillStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.moveTo(q.x,q.y+12);c.lineTo(q.x,q.y+3);c.stroke();
  c.fillStyle='#000';c.beginPath();c.arc(q.x,q.y,5,0,TAU);c.fill();c.fillStyle='#ffffff';c.beginPath();c.arc(q.x,q.y,2.5,0,TAU);c.fill();
  if(!reduced()){c.globalAlpha=(dim?.2:.4)*(.6+.4*Math.sin(clock*2));c.beginPath();c.arc(q.x,q.y,9,0,TAU);c.stroke();}
  c.globalAlpha=dim?.6:1;c.font='11px "Geist Mono", monospace';c.textAlign='center';c.fillText(String(b.km),q.x,q.y-12);}
 function drawSatellite(c,s,q,mine){
  // Its warm light: a still disc and a soft ring at the edge of the inside.
  c.globalAlpha=.07;c.fillStyle=WARM;c.beginPath();c.arc(q.x,q.y,SAT_GLOW,0,TAU);c.fill();c.globalAlpha=.25;c.strokeStyle=WARM;c.lineWidth=1;c.beginPath();c.arc(q.x,q.y,SAT_INSIDE,0,TAU);c.stroke();
  // The body and its two panels.
  c.globalAlpha=1;c.fillStyle='#000';c.strokeStyle='#ffffff';c.lineWidth=1.5;c.fillRect(q.x-6,q.y-6,12,12);c.strokeRect(q.x-6,q.y-6,12,12);
  for(const side of [-1,1]){c.beginPath();c.moveTo(q.x+side*6,q.y);c.lineTo(q.x+side*10,q.y);c.stroke();c.strokeRect(q.x+side*10-(side<0?18:0),q.y-5,18,10);c.globalAlpha=.5;c.beginPath();c.moveTo(q.x+side*19,q.y-5);c.lineTo(q.x+side*19,q.y+5);c.stroke();c.globalAlpha=1;}
  c.fillStyle=WARM;c.beginPath();c.arc(q.x,q.y,2.5,0,TAU);c.fill();
  if(mine){c.globalAlpha=.8;c.strokeStyle='#ffffff';c.setLineDash([2,3]);c.beginPath();c.arc(q.x,q.y,26,0,TAU);c.stroke();c.setLineDash([]);}}
 function edge(c,kind,o,p){const q=edgeSpot(r.W,r.H,o.x-r.camX,o.y-r.camY,24,108),x=Math.round(q.x),y=Math.round(q.y);c.globalAlpha=.75;c.strokeStyle='#ffffff';c.fillStyle='#ffffff';c.lineWidth=1.5;
  if(kind==='buoy'){c.beginPath();c.moveTo(x,y+5);c.lineTo(x,y-1);c.stroke();c.beginPath();c.arc(x,y-3,2.5,0,TAU);c.fill();c.globalAlpha=.7;c.font='10px "Geist Mono", monospace';c.textAlign='center';c.fillText(String(o.km),x+(q.x>r.W/2?-12:12),y-1);}
  else{c.strokeRect(x-2.5,y-2.5,5,5);c.beginPath();c.moveTo(x-8,y);c.lineTo(x-3,y);c.moveTo(x+3,y);c.lineTo(x+8,y);c.stroke();}
  return {x,y,d:Math.round(Math.hypot(o.x-p.x,o.y-p.y)),id:o.id,km:o.km};}
 function draw(){const out={buoy:null,sat:null,next:null,edge:{},inside:inside?.id||null};if(!allowed()||!ok()){drawn=out;return;}
  const c=r.cx,p=me(),words=r.S.universeTexts!==false,q=book();c.save();
  // Buoys near you: the nearest of your km and of the ones on either side.
  const k=Math.round(kmFromOrigin(p));for(const ring of [k-1,k,k+1]){const b=nearestBuoy(world,ring,p);if(!b)continue;const s=at(b.x,b.y);if(!onScreen(s))continue;drawBuoy(c,b,s,passed.has(b.id));out.buoy={id:b.id,km:b.km,x:Math.round(s.x),y:Math.round(s.y)};}
  const sat=nearestSatellite(world,p);let satShown=false;
  if(sat){const s=at(sat.x,sat.y);if(onScreen(s,SAT_GLOW)){drawSatellite(c,sat,s,visited(q,world,sat.id));satShown=onScreen(s,12);out.sat={id:sat.id,km:sat.km,x:Math.round(s.x),y:Math.round(s.y)};}}
  for(const g of glows){const s=at(g.x,g.y),t=(clock-g.at)/1.4;c.globalAlpha=.8*(1-t);c.strokeStyle=g.warm?WARM:'#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(s.x,s.y,reduced()?16:8+t*34,0,TAU);c.stroke();}
  // The next buoy outward and the nearest satellite, at the screen's edge while out of view (none while a scene plays).
  if(!scene()&&!paused()){const nb=nextBuoy(world,p,b=>passed.has(b.id));out.next=nb?{id:nb.id,km:nb.km}:null;
   if(nb&&!onScreen(at(nb.x,nb.y),-8))out.edge.buoy=edge(c,'buoy',nb,p);
   if(sat&&!satShown&&sat.d<=SAT_EDGE&&!(inside&&inside.id===sat.id))out.edge.sat=edge(c,'sat',sat,p);}
  // Inside a satellite: its name, the point of return, and where its door is.
  c.globalAlpha=1;c.fillStyle='#ffffff';c.textAlign='center';
  if(inside&&words&&!scene()){const doors=doorFrom(q,world,inside).length;c.font='12px "Geist Mono", monospace';say(c,satelliteName(inside.km),r.W/2,Math.max(196,r.H/2-152));c.globalAlpha=.75;c.font='11px "Geist Mono", monospace';say(c,doors?'Puerta · en el mapa o la Bitácora':'Punto de retorno guardado',r.W/2,Math.max(214,r.H/2-134));}
  else if(summary&&words&&!scene()){c.globalAlpha=.92;c.font='12px "Geist Mono", monospace';c.fillText(summary.text,r.W/2,Math.min(r.H-150,r.H/2+150),r.W-32);}
  c.restore();drawn=out;}
 // ---------- the door ----------
 // Open only from inside a satellite you visited, to another one you visited in this world.
 const here=()=>allowed()&&inside&&visited(book(),world,inside.id)?inside:null;
 const doors=()=>{const h=here();return h&&ok()?doorFrom(book(),world,h):[];};
 const doorOpen=id=>!!r.canPracticeTravel?.()&&doors().some(e=>e.id===id);
 function goDoor(id){const e=doors().find(x=>x.id===id);if(!e||!r.canPracticeTravel?.())return false;const point=doorPoint(e);if(!r.travelPracticePoint?.(point))return false;
  inside={id:e.id,km:e.km,x:e.x,y:e.y};book().last=e.id;r.save?.();soon(time=>playRecorrerNotes(r,time,2,SAT_GAIN,1));if(r.S.universeTexts!==false)r.toast?.(`Puerta · ${satelliteName(e.km)}`);return true;}
 function goRing(){if(!here())return false;return !!r.ringHome?.();}
 // ---------- the Bitácora ----------
 function section(){if(!r.S)return '';book();if(!ok())return '';const q=book(),p=me(),mine=q.sats.filter(e=>e.w===world).sort((a,b)=>a.km-b.km||a.id.localeCompare(b.id)),h=here();
  const rows=mine.map(e=>{const hereNow=h&&h.id===e.id;return `<div class="recorrer-sat" data-satellite="${e.id}"><p>${satelliteName(e.km)}</p><p class="rumor-now">${hereNow?'Estás aquí':`Ahora · ${rumorNow(e,p)}`}</p>${h&&!hereNow&&doorOpen(e.id)?`<div class="row"><button type="button" data-sat-door="${e.id}">Ir por la puerta</button></div>`:''}</div>`;}).join('');
  const ring=h&&r.ringHomePoint?.()?'<div class="row"><button type="button" data-sat-ring>Volver al anillo</button></div>':'';
  return `<details class="journal-section" data-journal-detail="Recorrer lejos" id="journalRecorrer"><summary>Recorrer lejos · ${mine.length} ${mine.length===1?'satélite':'satélites'}</summary><p>${q.far?`Boya más lejana · ${q.far} km`:'Cada km tiene sus boyas de luz. Sigue la siguiente.'}</p><p>Cada 10 km, un satélite de descanso. Dentro, su puerta lleva a otro satélite visitado o al anillo.</p>${rows}${ring}</details>`;}
 $('journalBody')?.addEventListener('click',e=>{const t=e.target.closest?.('[data-sat-door],[data-sat-ring]');if(!t)return;e.stopPropagation();const ok=t.dataset.satDoor?goDoor(t.dataset.satDoor):goRing();if(ok){const j=$('mJournal');if(j)j.hidden=true;}else r.refreshJournal?.();});
 // ---------- the map and tests ----------
 const forMap=()=>{if(!r.S)return [];book();if(!ok())return [];const h=here();return book().sats.filter(e=>e.w===world).map(e=>({id:e.id,x:e.x,y:e.y,km:e.km,name:satelliteName(e.km),here:!!h&&h.id===e.id}));};
 Object.defineProperties(r,{
  recorrerTick:{get:()=>tick},drawRecorrer:{get:()=>draw},recorrerSection:{get:()=>section},satellitesForMap:{get:()=>forMap},
  satelliteDoorOpen:{get:()=>doorOpen},satelliteDoor:{get:()=>goDoor},satelliteRing:{get:()=>goRing},
  // Tests only (the runtime is never published): the state.
  recorrerState:{get:()=>()=>{book();const p=me();return {allowed:allowed(),world,book:book(),inside:inside?{...inside}:null,ducked,musicDuck:r.musicDuck??1,tics,doors:doors().map(e=>e.id),next:nextBuoy(world,p,b=>passed.has(b.id)),sat:nearestSatellite(world,p),km:kmFromOrigin(p),drawn,summary:summary?.text||''};}}
 });
}
