// Viaje lejos, tanda D (Jay, 4 Nov 2026, alpha.252; docs/MUNDO.md#tanda-d-60-km-o-más): the band of 60 km and more, in
// the free World after the Journey, never in a chapter, a round, a finale, an activity or the Refugio (the young ones
// only show there). The rules are in viaje-d-model.js; the two games on a sheet of their own in viaje-d-juegos.js; the
// bands (notices and the Bitácora page) in bandas.js, which this batch attaches to (r.bandAttach).
// · Portal de otra regla: touching one, for two minutes the cube moves by another rule (r.motionRule, asked by the
//   frame's worldStep before it moves the cube); six lights inside; leaving it, everything is as before.
// · Estación del día: touching a station opens its sheet; room by room, one of three doors.
// · Barrido a tempo: in a rest satellite from 70 km, its console opens the sweep.
// · Herencia: a nest where your pet can have a young one (S.pet as pet.js keeps it is never replaced unless you choose).
// · Eclipse que cambia: an eclipse of secretos-cielo.js from 90 km brings the corona's lights, and the pulse leaves a
//   trail that catches them too.
// One scene at a time: a portal and the sheet are scenes (r.bandAttach busy); nothing starts while an encounter, a figure,
// a mischief scene, a sky's secret or another batch's scene plays. Sparks only by universeReward, once a day per thing.
// The music is untouched: the notes play on top, on the grid, far under it (playViajeNotes of viaje-a.js).
import {glow,halo,contactShadow,createAppear,appearAlpha,appearScale} from './fx-kit.js';
import {openSurface,prefersReducedMotion} from './frame-state.js';
import {freeOpen} from './journey-mode.js';
import {creditSparks} from './sparks-model.js';
import {edgeSpot,worldKey} from './descubrir-model.js';
import {satelliteHere} from './recorrer-model.js';
import {kmOf} from './bandas-model.js';
import {PET_SPECIES,normalizePet} from './pet-model.js';
import {elementInk} from './visual.js';
import {FLOORS} from './house-view.js';
import {playViajeNotes} from './viaje-a.js';
import {createGames} from './viaje-d-juegos.js';
import {VIAJE_D_VERSION,EDGE_REACH,SWEEP_FROM_KM,ECLIPSE_FROM_KM,portalsNear,stationsNear,nestsNear,
 PORTAL_TOUCH,PORTAL_SECONDS,PORTAL_LEAVE,PORTAL_REST,RULE_NAMES,portalRule,portalLights,portalLightDone,newRule,ruleStep,portalReward,BUMPER_R,LIGHTS,
 STATION_TOUCH,STATION_REST,STATION_DEPTH,stationToday,noteRoom,stationWon,payStation,stationReward,
 consoleFor,CONSOLE_TOUCH,CONSOLE_REST,noteSweep,sweepPaysToday,sweepReward,
 NEST_TOUCH,NEST_READ,BROOD_MAX,nestReady,hatch,travelWith,comeHome,criaName,RARE_NAMES,NOTE_NAMES,rhythmText,
 CORONA,coronaPieces,coronaAt,coronaCaught,coronaReward,coronaPaysToday,noteCorona,TRAIL_SECONDS,TRAIL_EVERY,TRAIL_LIFE,
 normalizeViajeD,viajeDReadOnly,portalPaysToday,notePortal,
 PORTAL_INSTRUMENT,LIGHT_INSTRUMENT,SWEEP_INSTRUMENT,CRIA_INSTRUMENT,CORONA_INSTRUMENT,PORTAL_GAIN,LIGHT_GAIN,BOUNCE_GAIN,SWEEP_GAIN,CRIA_GAIN,CORONA_GAIN,lightDegree,OPEN_DEGREES,END_DEGREES} from './viaje-d-model.js';
const TAU=Math.PI*2;
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clockText=s=>{const k=Math.max(0,Math.ceil(s)),m=Math.floor(k/60);return `${m}:${String(k%60).padStart(2,'0')}`;};
// A young one's colour, as pet.js draws its pet (the kind's hue and the seed's remainder).
export const criaInk=c=>elementInk('glass',(PET_SPECIES[c.species]?.hue||0)+(c.hue|0));
export function initialize(r){
 const $=id=>r.$?.(id)||globalThis.document?.getElementById(id)||null;
 let owner=null,world='',clock=0,seen=new WeakSet(),rule=null,restAt=null,corona=null,lastCorona='',trails=[],glows=[],summary=null,drawn={},notes=0,bounces=0,lastBounce=-Infinity,saidNest='',houseDrawn=0;
 const reduced=()=>!!(r.S?.reducedMotion||prefersReducedMotion());
 const allowed=()=>!!r.S&&r.inWorld?.()&&(r.S.layer||'superficie')==='superficie'&&freeOpen(r.S.journey)&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!r.houseActive?.()&&!r.travelInLevel?.()&&!r.placeRun?.()&&!r.placeCardDue?.()&&!r.songStageState?.()?.running&&!r.journeyFinaleState?.()?.running;
 const paused=()=>globalThis.document?.hidden||!!r.scanning||!!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 const words=()=>r.S.universeTexts!==false;
 // The save (S.viajeD), normalised once per save; a later version is only read.
 function book(){if(owner!==r.S){owner=r.S;owner.viajeD=normalizeViajeD(owner.viajeD);rule=null;corona=null;trails=[];glows=[];summary=null;restAt=null;games?.close();}world=worldKey(r.worldIdentity);return owner.viajeD;}
 const ok=()=>book().version===VIAJE_D_VERSION&&!viajeDReadOnly(book());
 const me=()=>({x:r.S.wx,y:r.S.wy});
 const today=()=>r.S.todayKey||'';
 const soon=fn=>{const state=r.S;if(state.sound&&r.ac?.state==='running'&&r.beatSoon)r.beatSoon(time=>{if(state===r.S)fn(time);},null,'player');};
 const sing=(kind,degrees,opts)=>soon(time=>{notes+=playViajeNotes(r,kind,degrees,time,opts);});
 const clear=s=>{const c=r.ringState?.()?.center;if(c&&Math.hypot(s.x-c.x,s.y-c.y)<600)return false;for(const q of r.ringPortals?.()||[])if(Math.hypot(s.x-q.x,s.y-q.y)<500)return false;
  const sat=satelliteHere(world,s,700);return !sat;};
 // This batch's own scene (a rule, the sheet) and every other scene of the world.
 const mine=()=>!!rule||!!games?.visible();
 const scene=()=>!!r.liveEncounterActive?.()||!!r.skyMapActive?.()||!!(r.mischiefBusy?r.mischiefBusy():r.mischiefState?.scene)||!!r.bandBusy?.('D');   // another batch's scene (the bands leave D's own out)
 // A change kept or nothing: a failed save puts the save (the pet and the sparks too) back as they were.
 function commit(change){const S=r.S,before={v:structuredClone(book()),pet:S.pet===undefined?undefined:structuredClone(S.pet),sparks:S.sparks,economy:S.sparkEconomy?structuredClone(S.sparkEconomy):undefined};const out=change(book());if(!out)return null;
  if(r.save?.()===false){S.viajeD=before.v;if(before.pet!==undefined)S.pet=before.pet;S.sparks=before.sparks;if(before.economy!==undefined)S.sparkEconomy=before.economy;owner=null;const sheet=games?.visible();book();if(sheet)games.close();return null;}
  if(!$('mJournal')?.hidden)r.refreshJournal?.();return out;}
 function pay(title,amount){const economy=r.S.sparkEconomy;if(!(amount>0)||!economy||economy.version!==1)return 0;const n=creditSparks(r.S,amount);economy.log.push({title,text:`${title} · +${n} chispas`,at:today()});economy.log=economy.log.slice(-80);return n;}
 // ---------- the portal of another rule ----------
 function startRule(s){const kind=portalRule(s),p=me();rule={id:s.id,kind,x:s.x,y:s.y,start:clock,lights:portalLights(s).map(l=>({...l,done:false})),done:0,motion:newRule(kind,s,p)};
  for(const w of r.waves||[])seen.add(w);glows.push({x:s.x,y:s.y,at:clock});sing('regla',OPEN_DEGREES,{instrument:PORTAL_INSTRUMENT,gain:PORTAL_GAIN,spacing:2});
  if(words())r.toast?.(`Otra regla · ${RULE_NAMES[kind]} · Recoge las seis luces.`,{level:2,ttl:3600});return true;}
 function endRule(){const g=rule;rule=null;if(!g)return;let amount=0;
  const res=commit(q=>{const pays=g.done>0&&portalPaysToday(q,g.id,today());if(pays)amount=pay('Otra regla',portalReward(g.done,{x:g.x,y:g.y}));return notePortal(q,g.id,g.done,today(),amount);});
  if(!res)amount=0;if(amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});if(res?.won)sing('regla',END_DEGREES,{instrument:PORTAL_INSTRUMENT,gain:PORTAL_GAIN,spacing:2});
  summary={text:`Otra regla · ${g.done} de ${LIGHTS}${amount?' · +'+amount+' ✦':''}`,until:clock+3.4};}
 function stepRule(p,pulses){const g=rule;if(clock-g.start>=PORTAL_SECONDS||Math.hypot(p.x-g.x,p.y-g.y)>PORTAL_LEAVE){endRule();return;}
  for(const l of g.lights){if(l.done||!portalLightDone(l,p,pulses))continue;l.done=true;g.done++;glows.push({x:l.x,y:l.y,at:clock});sing('regla',[lightDegree(g.done-1)],{instrument:LIGHT_INSTRUMENT,gain:LIGHT_GAIN});}
  if(g.done>=LIGHTS)endRule();}
 // Asked by the frame (render.js worldStep) before it moves the cube: during a rule, where the cube goes instead of the
 // stick's straight walk; otherwise null and the World moves as always.
 function motion(dx,dy,dt,speed){if(!rule||!r.S||!allowed()||paused())return null;const p=me(),res=ruleStep(rule.motion,p,{dx,dy},dt,speed);
  if(res.bounced){bounces++;if(clock-lastBounce>.2){lastBounce=clock;sing('regla',[1+(bounces%3)],{instrument:LIGHT_INSTRUMENT,gain:BOUNCE_GAIN,chord:true});}}
  return {x:res.x-p.x,y:res.y-p.y};}
 // ---------- the station and the sweep (their sheet) ----------
 let games=null,sheetFor=null;
 games=createGames(r,{
  room:(type,result)=>{const res=commit(q=>noteRoom(q,today(),type,result));return res?book().station:null;},
  finish:()=>{const s=book().station;if(!s||!s.done||s.paid===s.day)return {amount:0};let amount=0;const at=sheetFor||me();
   const res=commit(q=>{amount=pay('Estación del día',stationReward(stationWon(q.station),at));return payStation(q,amount);});if(!res)return {amount:0};if(amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});return {amount};},
  sweepEnd:score=>{let amount=0;const at=sheetFor||me();const res=commit(q=>{if(sweepPaysToday(q,today(),score))amount=pay('Barrido a tempo',sweepReward(at));return noteSweep(q,score,today(),amount);});
   if(!res)return {record:false,amount:0};if(amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});return {record:res.record,amount};},
  sing:(kind,degrees)=>sing(kind,degrees,{instrument:SWEEP_INSTRUMENT,gain:SWEEP_GAIN}),
  closed:()=>{sheetFor=null;if(!$('mJournal')?.hidden)r.refreshJournal?.();},
 });
 function openStation(s){const st=commit(q=>stationToday(q,today()));if(!st)return false;sheetFor={id:s.id,x:s.x,y:s.y};return games.openStation({world,day:today(),state:book().station});}
 function openSweep(c){sheetFor={id:c.id,x:c.x,y:c.y};return games.openSweep({seed:`barrido:v1:${world}:${today()}:${c.id}:${book().sweep.plays}`,best:book().sweep.best});}
 const consoleNow=p=>{const sat=satelliteHere(world,p);return sat&&sat.km>=SWEEP_FROM_KM?consoleFor(world,sat):null;};
 // ---------- the nests ----------
 function stepNest(p){const n=nestsNear(world,p,NEST_TOUCH).find(clear);if(!n)return;const q=book();if(!nestReady(q,n.id,today()))return;
  const pet=normalizePet(r.S.pet);if(!pet)return;
  const row=commit(x=>hatch(x,n,pet,today()));if(!row)return;glows.push({x:n.x,y:n.y,at:clock});sing('cria',row.notes,{instrument:CRIA_INSTRUMENT,gain:CRIA_GAIN,spacing:row.rare==='eco'?1:2});
  if(words())r.toast?.(`<em>Una cría</em> · ${criaName(row)} · Hereda color, nota y ritmo.`+(row.rare?` · Combinación rara · ${RARE_NAMES[row.rare]}`:''),{level:2,category:'ganado',ttl:30000,coalesce:false});}
 function choose(id){if(!ok()||!r.S)return false;const res=commit(q=>travelWith(q,r.S,id));if(!res)return false;if(words())r.toast?.('Una cría viaja contigo. Tu mascota te espera en la Bitácora.',{level:2});return true;}
 function home(){if(!ok()||!r.S)return false;const res=commit(q=>comeHome(q,r.S));if(!res)return false;if(words())r.toast?.('Tu mascota vuelve contigo.',{level:2});return true;}
 // ---------- the eclipse that changes ----------
 function stepCorona(p,pulses,step){const e=r.skyEclipse?.();
  if(corona&&(!e||e.key!==corona.key)){endCorona();return;}
  if(!corona&&e&&e.key!==lastCorona&&kmOf(e)>=ECLIPSE_FROM_KM){lastCorona=e.key;const cycle=Number(String(e.key).split(':').pop())||0;
   corona={key:e.key,id:e.id,x:e.x,y:e.y,start:clock,pieces:coronaPieces(e,cycle).map(c=>({...c,done:false})),caught:0,sound:!!r.S.sound};trails=[];}
  if(!corona)return;const age=clock-corona.start;
  // The verb that changes: each pulse leaves a trail behind the cube for a moment, and the trail catches too.
  for(const w of pulses)trails.push({born:clock,last:-Infinity,pts:[{x:w.x,y:w.y,at:clock}]});
  for(const t of trails)if(clock-t.born<=TRAIL_SECONDS&&clock-t.last>=TRAIL_EVERY){t.last=clock;t.pts.push({x:p.x,y:p.y,at:clock});}
  for(const t of trails)t.pts=t.pts.filter(q=>clock-q.at<=TRAIL_LIFE);trails=trails.filter(t=>t.pts.length);const pts=trails.flatMap(t=>t.pts);
  for(const c of corona.pieces){if(c.done)continue;const q=coronaAt(corona,c,age);if(!coronaCaught(q,p,pulses,pts,corona.sound))continue;c.done=true;corona.caught++;glows.push({x:q.x,y:q.y,at:clock});sing('corona',[7+lightDegree(corona.caught-1)],{instrument:CORONA_INSTRUMENT,gain:CORONA_GAIN,octave:1});}}
 function endCorona(){const g=corona;corona=null;trails=[];if(!g)return;let amount=0;
  const res=commit(q=>{const pays=g.caught>0&&coronaPaysToday(q,g.id,today());if(pays)amount=pay('Corona del eclipse',coronaReward(g.caught,{x:g.x,y:g.y}));return noteCorona(q,g.id,g.caught,today(),amount);});
  if(!res)amount=0;if(amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});summary={text:`Corona · ${g.caught} de ${CORONA}${amount?' · +'+amount+' ✦':''}`,until:clock+3.4};
  if(res?.first)r.toast?.('<em>Eclipse que cambia</em> · Corona del eclipse',{level:2,category:'ganado',ttl:30000,coalesce:false});}
 // ---------- the frame ----------
 function tick(dt,modal=false){
  if(!r.S)return;book();
  if(!allowed()){if(rule)endRule();if(corona)endCorona();summary=null;if(games.visible())games.close();clock+=Math.max(0,Math.min(.05,dt||0));return;}
  if(modal||paused())return;
  const step=Math.max(0,Math.min(.05,dt||0));clock+=step;if(summary&&clock>summary.until)summary=null;glows=glows.filter(g=>clock-g.at<1.3);
  const p=me(),pulses=[];for(const w of r.waves||[])if(!seen.has(w)){seen.add(w);if(w.origin==='player')pulses.push({x:w.x,y:w.y,beat:!!w.beat});}
  if(!ok())return;
  stepCorona(p,pulses,step);
  if(rule){if(scene())endRule();else stepRule(p,pulses);return;}
  if(scene())return;
  if(restAt&&Math.hypot(p.x-restAt.x,p.y-restAt.y)>restAt.reach)restAt=null;
  for(const s of portalsNear(world,p,PORTAL_TOUCH)){if(!clear(s)||restAt?.id===s.id)continue;startRule(s);restAt={id:s.id,x:s.x,y:s.y,reach:PORTAL_REST};return;}
  for(const s of stationsNear(world,p,STATION_TOUCH)){if(!clear(s)||restAt?.id===s.id)continue;restAt={id:s.id,x:s.x,y:s.y,reach:STATION_REST};openStation(s);return;}
  const c=consoleNow(p);if(c&&restAt?.id!==c.id&&Math.hypot(c.x-p.x,c.y-p.y)<=CONSOLE_TOUCH){restAt={id:c.id,x:c.x,y:c.y,reach:CONSOLE_REST};openSweep(c);return;}
  stepNest(p);
 }
 // ---------- drawing ----------
 const at=(x,y)=>({x:x+r.W/2-r.camX,y:y+r.H/2-r.camY});
 const onScreen=(q,m=30)=>q.x>-m&&q.y>-m&&q.x<r.W+m&&q.y<r.H+m;
 const say=(c,t,x,y,max=r.W-32)=>{c.fillText(t,Math.max(16+Math.min(max,c.measureText(t).width)/2,Math.min(r.W-16-Math.min(max,c.measureText(t).width)/2,x)),y,max);};
 // Visual 2 (alpha.254; docs/MUNDO.md, «Luz común»): the band's objects with the shared kit, soft shadows under what
 // stands, added light where something shines, fine double contours, and a portal that grows in when first seen. Light
 // quality: no added light and no double contour; reduced motion: nothing new moves.
 const light=()=>!!r.lightQuality?.(),seenAt=createAppear();
 function drawPortal(c,q,kind,spent,id=''){const pulse=reduced()?1:.75+.25*Math.sin(clock*2.4),k=seenAt.k(id,performance.now(),reduced()),grow=appearScale(k);c.save();c.translate(q.x,q.y);c.scale(grow,grow);c.translate(-q.x,-q.y);c.globalAlpha=appearAlpha(k);
  contactShadow(c,q.x,q.y+12,10,2.5,(spent?.25:.5)*appearAlpha(k));if(!spent&&!light())glow(c,q.x,q.y-1,30,'#dfe9ff',.22*pulse*appearAlpha(k),true);
  const a0=appearAlpha(k);c.globalAlpha=(spent?.45:.95)*a0;c.fillStyle='#000';c.strokeStyle='#ffffff';c.lineWidth=1.5;c.fillRect(q.x-7,q.y-12,14,22);c.beginPath();c.rect(q.x-7,q.y-12,14,22);if(!spent&&!light())halo(c);c.stroke();
  if(!spent&&!light())glow(c,q.x,q.y-1,9,'#ffffff',.35*pulse*a0,true);
  c.globalAlpha=(spent?.4:.9)*pulse;c.lineWidth=1;c.beginPath();
  if(kind==='orbita'){c.arc(q.x,q.y-1,4,0,TAU);c.moveTo(q.x+6,q.y-1);c.arc(q.x,q.y-1,6,0,TAU);}
  else if(kind==='rebote'){c.moveTo(q.x-4,q.y+5);c.lineTo(q.x-1,q.y-6);c.lineTo(q.x+1,q.y+4);c.lineTo(q.x+4,q.y-6);}
  else{for(const a of [0,Math.PI/3,2*Math.PI/3]){c.moveTo(q.x-Math.cos(a)*5,q.y-1-Math.sin(a)*5);c.lineTo(q.x+Math.cos(a)*5,q.y-1+Math.sin(a)*5);}}c.globalAlpha*=a0;c.stroke();c.restore();}
 function drawStation(c,q,lit){const spin=reduced()?0:clock*.4;if(!light())glow(c,q.x,q.y,lit?30:22,'#ffffff',lit?.26:.16,true);c.globalAlpha=.9;c.strokeStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(q.x,q.y,13,0,TAU);if(!light())halo(c);c.stroke();c.fillStyle='#000';
  for(let k=0;k<4;k++){const a=spin+k*TAU/4,x=q.x+Math.cos(a)*13,y=q.y+Math.sin(a)*13;c.fillRect(x-3,y-3,6,6);c.strokeRect(x-3,y-3,6,6);}c.globalAlpha=lit?1:.7;c.fillStyle='#ffffff';c.fillRect(Math.round(q.x)-2,Math.round(q.y)-2,4,4);}
 function drawConsole(c,q,lit){contactShadow(c,q.x,q.y+8,10,2.5,.45);if(!light())glow(c,q.x,q.y-1,lit?20:14,'#dfe9ff',lit?.28:.14,true);c.globalAlpha=.95;c.fillStyle='#000';c.strokeStyle='#ffffff';c.lineWidth=1.5;c.fillRect(q.x-7,q.y-6,14,11);c.beginPath();c.rect(q.x-7,q.y-6,14,11);if(!light())halo(c);c.stroke();c.globalAlpha=lit?.95:.6;c.fillStyle='#ffffff';
  c.fillRect(Math.round(q.x-5),Math.round(q.y+1),4,2);c.fillStyle='#7c7c86';c.fillRect(Math.round(q.x-1),Math.round(q.y+1),4,2);c.fillStyle='#ffffff';const line=reduced()?0:Math.floor((clock*4)%5);c.fillRect(Math.round(q.x-5+line*2),Math.round(q.y-4),1,7);}
 function drawNest(c,q,ready){if(ready&&!light())glow(c,q.x,q.y-2,16,'#fff2d8',.22,true);c.globalAlpha=ready?.9:.45;c.fillStyle='#ffffff';for(let k=0;k<7;k++){const a=k/7*TAU+(reduced()?0:clock*.2);c.fillRect(Math.round(q.x+Math.cos(a)*9)-1,Math.round(q.y+Math.sin(a)*5)-1,2,2);}
  c.globalAlpha=ready?.8:.35;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.ellipse(q.x,q.y-2,2.6,3.4,0,0,TAU);c.stroke();}
 function drawCria(c,x,y,cria,t,size=3){const col=criaInk(cria);c.save();c.translate(x,y);if(!light())glow(c,0,0,size*3.4,col,.2,true);c.strokeStyle=c.fillStyle=col;c.lineWidth=1;c.globalAlpha=.85;
  if(cria.species==='luciernaga'){c.beginPath();c.ellipse(0,0,size*.55,size,0,0,TAU);c.stroke();}else{const flap=.4+Math.sin(t/(cria.species==='grulla'?320:140))*.25;c.beginPath();c.moveTo(-size*1.4,-size*flap);c.quadraticCurveTo(0,0,0,0);c.lineTo(size*1.4,-size*flap);c.stroke();}
  if(cria.rare){c.globalAlpha=.6;c.fillRect(-1,size+1,2,2);}c.restore();}
 // Coherencia T2: the band's one mark is an offer to the one layer of arrows (scanner-arrows.js); a «?» until the
 // scanner's level 4 names the things past 10 km.
 function edge(c,kind,o){const q=r.edgeOffer?.({key:'D:'+kind+':'+(o.id||Math.round(o.x)+','+Math.round(o.y)),kind:'banda',x:o.x,y:o.y,shape:'portal',far:true})||edgeSpot(r.W,r.H,o.x-r.camX,o.y-r.camY,22,104);return {x:Math.round(q.x),y:Math.round(q.y),id:o.id||kind};}
 function draw(){const out={portal:null,station:null,console:null,nest:null,edge:{},rule:null,corona:null,trail:0};if(!allowed()||!r.cx||!ok()){drawn=out;return;}
  const c=r.cx,p=me(),t=performance.now()/1000,q=book(),still=paused(),quiet=scene()&&!rule;c.save();c.textAlign='center';const mark=[];
  for(const s of portalsNear(world,p,EDGE_REACH)){if(!clear(s))continue;const sp=at(s.x,s.y),spent=!portalPaysToday(q,s.id,today());if(onScreen(sp)){drawPortal(c,sp,portalRule(s),spent,s.id);out.portal=out.portal||{id:s.id,kind:portalRule(s),x:Math.round(sp.x),y:Math.round(sp.y)};}else if(!spent&&!rule)mark.push({kind:'portal',o:s,d:s.d});}
  const done=q.station?.day===today()&&q.station.done;
  for(const s of stationsNear(world,p,EDGE_REACH)){if(!clear(s))continue;const sp=at(s.x,s.y);if(onScreen(sp)){drawStation(c,sp,s.d<=STATION_TOUCH*3);out.station=out.station||{id:s.id,x:Math.round(sp.x),y:Math.round(sp.y)};
    if(s.d<=STATION_TOUCH*3&&words()&&!quiet&&!rule){c.globalAlpha=.8;c.fillStyle='#ffffff';c.font='12px "Geist Mono", monospace';say(c,done?'Estación del día · Vuelve mañana':'Estación del día',sp.x,sp.y-22);}}else if(!done&&!rule)mark.push({kind:'estacion',o:s,d:s.d});}
  const con=consoleNow(p);if(con){const sp=at(con.x,con.y),near=Math.hypot(con.x-p.x,con.y-p.y)<=CONSOLE_TOUCH*4;if(onScreen(sp)){drawConsole(c,sp,near);out.console={id:con.id,x:Math.round(sp.x),y:Math.round(sp.y)};
    if(near&&words()&&!quiet){c.globalAlpha=.8;c.fillStyle='#ffffff';c.font='12px "Geist Mono", monospace';say(c,q.sweep.best?`Barrido a tempo · Récord · ${q.sweep.best}`:'Barrido a tempo',sp.x,sp.y-16);}}}
  for(const s of nestsNear(world,p,EDGE_REACH)){if(!clear(s))continue;const sp=at(s.x,s.y),ready=nestReady(q,s.id,today());if(onScreen(sp)){drawNest(c,sp,ready);out.nest=out.nest||{id:s.id,x:Math.round(sp.x),y:Math.round(sp.y),ready};
    if(s.d<=NEST_READ&&words()&&!quiet&&!rule){c.globalAlpha=.8;c.fillStyle='#ffffff';c.font='12px "Geist Mono", monospace';const line=!ready?'Nido · Vuelve mañana':r.S.pet?'Nido · Acércate con tu mascota':'Nido · Hace falta una mascota';say(c,line,sp.x,sp.y-16);out.nest.text=line;}}
   else if(ready&&r.S.pet&&!rule)mark.push({kind:'nido',o:s,d:s.d});}
  // The rule: a thin frame round the screen (another rule), its lights, its bumpers or its centre, and its clock.
  if(rule){const g=rule;c.globalAlpha=.28;c.strokeStyle='#ffffff';c.lineWidth=1;c.strokeRect(6.5,6.5,r.W-13,r.H-13);
   if(g.kind==='orbita'){const sp=at(g.x,g.y);c.globalAlpha=.25;c.setLineDash([2,6]);c.beginPath();c.arc(sp.x,sp.y,g.motion.rad,0,TAU);c.stroke();c.setLineDash([]);c.globalAlpha=.8;c.fillStyle='#ffffff';c.fillRect(Math.round(sp.x)-2,Math.round(sp.y)-2,4,4);}
   for(const b of g.motion.bumpers){const sp=at(b.x,b.y);if(!onScreen(sp))continue;c.globalAlpha=.9;c.fillStyle='#55555c';c.beginPath();c.arc(sp.x,sp.y,BUMPER_R,0,TAU);c.fill();c.strokeStyle='#ffffff';c.globalAlpha=.6;c.beginPath();c.arc(sp.x,sp.y,BUMPER_R,0,TAU);c.stroke();}
   let shown=0;for(const l of g.lights){if(l.done)continue;const sp=at(l.x,l.y);shown++;if(!light())glow(c,sp.x,sp.y,14,'#ffffff',.35,true);c.globalAlpha=.95;c.fillStyle='#ffffff';c.beginPath();c.arc(sp.x,sp.y,3.5,0,TAU);c.fill();c.globalAlpha=.3*(reduced()?1:.7+.3*Math.sin(clock*5+l.k));c.beginPath();c.arc(sp.x,sp.y,9,0,TAU);c.fill();}
   const left=PORTAL_SECONDS-(clock-g.start);out.rule={kind:g.kind,done:g.done,total:g.lights.length,left,shown};
   if(words()){c.globalAlpha=1;c.fillStyle='#ffffff';c.font='12px "Geist Mono", monospace';say(c,`Otra regla · ${RULE_NAMES[g.kind]} · ${clockText(left)} · ${g.done} de ${LIGHTS}`,r.W/2,Math.max(196,r.H/2-152));}}
  // The corona: its lights turning round the star, and the trails the pulse leaves.
  if(corona){const age=clock-corona.start;for(const t0 of trails)for(const pt of t0.pts){const sp=at(pt.x,pt.y);c.globalAlpha=Math.max(0,.7*(1-(clock-pt.at)/TRAIL_LIFE));c.fillStyle='#ffffff';c.fillRect(Math.round(sp.x)-1.5,Math.round(sp.y)-1.5,3,3);out.trail++;}
   let shown=0;for(const k of corona.pieces){if(k.done)continue;const cq=coronaAt(corona,k,age),sp=at(cq.x,cq.y);if(!onScreen(sp,10))continue;shown++;const s=reduced()?4:4+Math.sin(clock*6+k.k);if(!light())glow(c,sp.x,sp.y,13,'#fff2d8',.45,true);c.globalAlpha=.95;c.strokeStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.moveTo(sp.x-s,sp.y);c.lineTo(sp.x+s,sp.y);c.moveTo(sp.x,sp.y-s);c.lineTo(sp.x,sp.y+s);c.stroke();}
   out.corona={caught:corona.caught,total:corona.pieces.length,shown};if(words()){c.globalAlpha=1;c.fillStyle='#ffffff';c.font='12px "Geist Mono", monospace';say(c,`Corona · ${corona.caught} de ${CORONA}`,r.W/2,Math.max(196,r.H/2-152));c.globalAlpha=.75;c.font='12px "Geist Mono", monospace';say(c,'Atrapa sus luces. Tu pulso deja estela.',r.W/2,Math.max(196,r.H/2-152)+16);out.corona.hint=true;}}
  if(!quiet&&!still&&!rule&&!corona){mark.sort((a,b)=>a.d-b.d);const m=mark[0];if(m)out.edge[m.kind]=edge(c,m.kind,m.o);}
  for(const g of glows){const sp=at(g.x,g.y),k=(clock-g.at)/1.3;if(!g.popped){g.popped=true;r.fxLayer?.pop(g.x,g.y,'#ffffff',{size:.8,sparks:6});}c.globalAlpha=.8*(1-k);c.strokeStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(sp.x,sp.y,reduced()?14:6+k*30,0,TAU);c.stroke();}
  if(summary&&words()&&(!quiet||rule)){c.globalAlpha=.92;c.fillStyle='#ffffff';c.font='12px "Geist Mono", monospace';c.fillText(summary.text,r.W/2,Math.min(r.H-150,r.H/2+150),r.W-32);}
  c.restore();drawn=out;}
 // The Refugio: the young ones (the newest four, not the one travelling) walk by the cube on its floor.
 function drawHouse(c,{toScreen,t=performance.now(),calm=false,cube}={}){if(!r.S||!cube||!toScreen)return 0;const q=r.S.viajeD;if(!q||q.version!==VIAJE_D_VERSION||!Array.isArray(q.brood))return 0;
  const list=q.brood.filter(b=>b.id!==q.travel?.id).slice(-4);const floor=FLOORS[cube.floor];if(!floor)return 0;
  list.forEach((b,i)=>{const bob=calm?0:Math.sin(t/300+i)*2,p=toScreen(cube.x+30+i*14,floor.bottom-12-bob);drawCria(c,p.x,p.y,b,t,3);});houseDrawn=list.length;return list.length;}
 // ---------- the Bitácora ----------
 const plural=(n,one,many)=>`${n} ${n===1?one:many}`;
 const lines={
  'portal-regla':()=>{const g=book().portal;return g.n?`${plural(g.won,'portal superado','portales superados')} de ${g.n}`:'Entra y cambia cómo te mueves.';},
  estacion:()=>{const q=book(),s=q.station;const now=s&&s.day===today()?(s.done?'Hoy · completa':`Hoy · sala ${s.path.length+1} de ${STATION_DEPTH}`):'Se rehace cada día.';return q.seals?`${now} · ${plural(q.seals,'sello','sellos')}`:now;},
  barrido:()=>{const b=book().sweep.best;return b?`Récord · ${b}`:'En los satélites lejanos.';},
  herencia:()=>{const n=book().brood.length;return n?plural(n,'cría','crías'):r.S?.pet?'Lleva tu mascota a un nido.':'Hace falta una mascota.';},
  'eclipse-regla':()=>{const g=book().corona;return g.n?plural(g.caught,'luz de corona','luces de corona'):'Espera un eclipse aquí.';},
 };
 function section(){if(!r.S)return '';const q=book();if(!ok()||!q.brood.length)return '';const travel=q.travel?.id;
  const rows=q.brood.map(b=>{const going=travel===b.id;return `<div class="cria-row" data-cria="${escape(b.id)}"><p><span class="cria-swatch" style="color:${criaInk(b)}" aria-hidden="true">■</span> ${escape(criaName(b))}${b.rare?` · Combinación rara · ${escape(RARE_NAMES[b.rare])}`:''}</p>
   <p class="rumor-now">Notas · ${b.notes.map(d=>NOTE_NAMES[d]).join(' · ')}</p><p class="rumor-now">Ritmo · <span translate="no">${rhythmText(b)}</span></p>
   <div class="row">${going?'<button type="button" data-cria-home>Vuelve tu mascota</button>':`<button type="button" data-cria-travel="${escape(b.id)}">Que viaje contigo</button>`}</div></div>`;}).join('');
  const lead=travel?'<p>Una cría viaja contigo. Tu mascota te espera aquí.</p>':'<p>Tu mascota sigue contigo. Una cría solo viaja si la eliges.</p>';
  return `<details class="journal-section" data-journal-detail="Crías" id="journalCrias"><summary>Crías · ${q.brood.length} de ${BROOD_MAX}</summary>${lead}${rows}</details>`;}
 $('journalBody')?.addEventListener('click',e=>{const t=e.target.closest?.('[data-cria-travel],[data-cria-home]');if(!t)return;e.stopPropagation();if(t.dataset.criaTravel?choose(t.dataset.criaTravel):home())r.refreshJournal?.();});
 for(const id of Object.keys(lines))r.bandAttach?.(id,{line:lines[id],...(id==='portal-regla'?{busy:mine,mapPoints:()=>[]}:{})});
 Object.defineProperties(r,{
  viajeDTick:{get:()=>tick},drawViajeD:{get:()=>draw},drawHouseBrood:{get:()=>drawHouse},viajeDSection:{get:()=>section},motionRule:{get:()=>motion},viajeDBusy:{get:()=>mine},
  criaTravel:{get:()=>choose},criaHome:{get:()=>home},
  // Tests only (the runtime is never published): the state, and the sheet's games.
  viajeDState:{get:()=>()=>{const q=book();return {version:q.version,allowed:allowed(),world,book:structuredClone(q),rule:rule?{id:rule.id,kind:rule.kind,done:rule.done,lights:rule.lights.map(l=>({...l})),age:clock-rule.start,motion:{...rule.motion,bumpers:rule.motion.bumpers.map(b=>({...b}))}}:null,
   corona:corona?{key:corona.key,caught:corona.caught,pieces:corona.pieces.map(k=>({...k,...coronaAt(corona,k,clock-corona.start)})),trail:trails.reduce((a,t)=>a+t.pts.length,0)}:null,drawn,houseDrawn,summary:summary?.text||'',notes,bounces,restAt:restAt?{...restAt}:null,games:games.state()};}},
  viajeDGames:{get:()=>games},
 });
}
