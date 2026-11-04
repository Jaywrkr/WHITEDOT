// Viaje lejos, tanda C (Jay, 4 Nov 2026, alpha.251; docs/MUNDO.md#lo-que-hay-más-lejos-tanda-c): the band from 30 to
// 60 km, in the free World after the Journey, never in a chapter, a round, a finale, an activity or the Refugio. The
// rules are in viaje-c-model.js; the bands (notices and the Bitácora page) in bandas.js.
// · Púlsar: a star throws announced flashes; a pulse on time at the strike sends each back as a note of the chord and
//   adds to a run. Without sound you step aside from it, and it counts the same. Nothing is hurt.
// · Asteroide por capas: pulses dig it layer by layer, each its colour, down to its core (a find).
// · Tirolina de luz: a pulse at a buoy you stepped on lays a line to the buoy you came from; a pulse at a buoy with a
//   line rides it. Only between buoys you walked to.
// · Mar de polvo: a pulse in the dust sinks the cube under it, below the ring of rocks; the music sounds muffled (the
//   output's comfort filter, as the eclipse); something is sometimes hidden in the middle.
// · Kit de herramientas: a box gives the net, then the magnet, then the rod, for ever; each opens its points.
// One scene at a time: a volley, a ride and the time under the dust are scenes (r.bandAttach busy); none starts while an
// encounter, a figure, a mischief scene, a sky's secret or another batch's scene plays. Sparks only by universeReward.
// The music is untouched: the notes play on top, on the grid, far under it.
import {openSurface,prefersReducedMotion} from './frame-state.js';
import {freeOpen} from './journey-mode.js';
import {creditSparks} from './sparks-model.js';
import {SOUND_TRIM,edgeSpot,worldKey} from './descubrir-model.js';
import {buoyHere} from './recorrer-model.js';
import {scaleNote,sequence} from './secretos-model.js';
import {hashKey} from './universe-regions.js';
import * as C from './viaje-c-model.js';
const TAU=Math.PI*2,GOLD='#f0d27a',DUSTY='#b8a88a',ROCKY='#6a6a72';
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
// Notes on the grid, far under the music, in an instrument of the album of sounds at its measured trim. chord: the
// degrees are steps of the chord that sounds. Returns how many were sent.
export function playViajeCNotes(r,kind,degrees,start,{instrument=C.ROCK_INSTRUMENT,gain=C.ROCK_GAIN,spacing=1,octave=1,chord=false}={}){if(!r.S?.sound||r.ac?.state!=='running')return 0;
 const d=r.regionOfPos?.(r.S.wx,r.S.wy),scale=r.MU?.dnaA?.scale||d?.scale,tonic=57+(r.MU?.tr||0)+12*octave,step=(r.SIX||.125)*spacing,tones=chord?(r.chordTones?.()||[]):[];let n=0;
 degrees.forEach((degree,k)=>{let note=scaleNote(scale,tonic,degree);if(chord&&tones.length){note=tones[((degree%3)+3)%3]+12*octave+12*Math.floor(degree/3);while(note>96)note-=12;while(note<36)note+=12;}
  const at=start+k*step,emit=()=>{r.hookInst(instrument,note,at,r.vel(gain*(SOUND_TRIM[instrument]??1)),d);r.viajeCAudioCue?.({kind,instrument,note,time:at,gain,six:r.SIX});};
  if(r.withVoiceOrigin)r.withVoiceOrigin('player',emit);else emit();n++;});return n;}
// Under the dust: the output's comfort filter (audio.js's own, runtime.comfortLowpass) held dark while it lasts; then
// handed back to audio.js (applyComfort), which eases it to where the music has it. Returns whether it acted.
export function dustFilter(r,on,time=r.ac?.currentTime||0){const f=r.comfortLowpass?.frequency;if(!f)return false;
 f.cancelScheduledValues(time);if(on){f.setTargetAtTime(Math.min(C.DUST_CUTOFF,f.value||C.DUST_CUTOFF),time,C.DUST_TAU);return true;}r.applyComfort?.(time);return true;}
export function initialize(r){
 const $=id=>r.$?.(id)||globalThis.document?.getElementById(id)||null;
 let owner=null,world='',clock=0,seen=new WeakSet(),volley=null,pulsarRest=null,ride=null,zipRest=null,zipLast=null,zipPrev=null,zipHere=null,layAt=-Infinity,sunk=null,dark=false,
  lastPos=null,hits=new Map(),shake=new Map(),glows=[],streaks=[],summary=null,drawn={},notes=0,sites=null,grains=new Map(),lastBar=-1;
 const reduced=()=>!!(r.S?.reducedMotion||prefersReducedMotion());
 const allowed=()=>!!r.S&&r.inWorld?.()&&(r.S.layer||'superficie')==='superficie'&&freeOpen(r.S.journey)&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!r.houseActive?.()&&!r.travelInLevel?.()&&!r.placeRun?.()&&!r.placeCardDue?.()&&!r.songStageState?.()?.running&&!r.journeyFinaleState?.()?.running;
 const paused=()=>globalThis.document?.hidden||!!r.scanning||!!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 // A scene of this batch (a volley, a ride, the time under the dust).
 const mine=()=>!!volley||!!ride||!!sunk;
 // Another scene plays: a living encounter, a figure, a mischief scene that moves on, a sky's secret, or another batch's
 // scene (while one of ours plays, the bands are busy with it: then only batch A's challenge is asked).
 const others=()=>!!r.liveEncounterActive?.()||!!r.skyMapActive?.()||!!(r.mischiefBusy?r.mischiefBusy():r.mischiefState?.scene)||!!r.skySecretBusy?.()||(mine()?!!r.viajeBusy?.():!!r.bandBusy?.());
 const words=()=>r.S.universeTexts!==false;
 function book(){if(owner!==r.S){owner=r.S;owner.viajeC=C.normalizeViajeC(owner.viajeC);volley=null;ride=null;sunk=null;zipLast=zipPrev=zipHere=null;hits=new Map();glows=[];streaks=[];summary=null;}world=worldKey(r.worldIdentity);return owner.viajeC;}
 const ok=()=>book().version===C.VIAJE_C_VERSION&&!C.viajeCReadOnly(book());
 const me=()=>({x:r.S.wx,y:r.S.wy});
 const today=()=>r.S.todayKey||'';
 const soon=fn=>{const state=r.S;if(state.sound&&r.ac?.state==='running'&&r.beatSoon)r.beatSoon(time=>{if(state===r.S)fn(time);},null,'player');};
 const sing=(kind,degrees,opts)=>soon(time=>{notes+=playViajeCNotes(r,kind,degrees,time,opts);});
 // A change kept or nothing: a failed save puts the save (and the sparks) back as they were.
 function commit(change){const S=r.S,before={v:structuredClone(book()),sparks:S.sparks,economy:S.sparkEconomy?structuredClone(S.sparkEconomy):undefined};const out=change(book());if(!out)return null;
  if(r.save?.()===false){S.viajeC=before.v;S.sparks=before.sparks;if(before.economy!==undefined)S.sparkEconomy=before.economy;owner=null;book();return null;}if(!$('mJournal')?.hidden)r.refreshJournal?.();return out;}
 function pay(title,amount){const economy=r.S.sparkEconomy;if(!(amount>0)||!economy||economy.version!==1)return 0;const n=creditSparks(r.S,amount);economy.log.push({title,text:`${title} · +${n} chispas`,at:today()});economy.log=economy.log.slice(-80);return n;}
 const gained=(n,p=me())=>{if(n)r.showSparkPickup?.(n,{x:p.x,y:p.y});};
 // What of the batch is near (once a frame, for the tick and the drawing); nothing is looked for under its band.
 function look(p){const km=Math.hypot(p.x,p.y)/C.UNITS_PER_KM,reach=C.EDGE_REACH,within=from=>km+reach/C.UNITS_PER_KM>=from;
  sites={pulsars:within(30)?C.pulsarsNear(world,p,reach):[],rocks:within(35)?C.rocksNear(world,p,reach):[],dust:within(45)?C.dustNear(world,p,reach):[],
   caches:within(50)&&C.nextTool(book())?C.cachesNear(world,p,reach):[],points:within(50)?C.pointsNear(world,p,reach):[]};return sites;}
 // ---------- the pulsar ----------
 function startVolley(s){const sound=!!r.S.sound&&r.ac?.state==='running';volley={id:s.id,x:s.x,y:s.y,sound,flash:null,thrown:0,returned:0,run:{cur:0,best:0},next:clock+.8,idle:clock};
  glows.push({x:s.x,y:s.y,at:clock});if(words())r.toast?.(sound?'Púlsar · Pulsa a tiempo cuando llegue su destello.':'Púlsar · Apártate de su destello.',{level:2,ttl:3000});}
 function throwFlash(strike){const p=me();volley.flash={k:volley.thrown,thrown:clock,strike,aim:{x:p.x,y:p.y}};volley.thrown++;volley.idle=clock;}
 // With sound, a flash is thrown on a bar of the music and strikes on the next one (MU.sq, as the flare listens).
 // A bar that comes while the last flash is still striking throws the next one as soon as that one is done (one a bar).
 function onBar(t){const v=volley;if(!v||!v.sound||v.thrown>=C.VOLLEY||paused()||!r.ac)return;if(v.flash){v.bar=t;return;}throwFlash(clock+(t+16*(r.SIX||.125)-r.ac.currentTime));}
 setInterval(()=>{try{const sq=r.MU?.sq,ac=r.ac;if(!ac||!sq?.length)return;for(const e of sq){if(e.s!==0||!(e.t>lastBar+1e-4))continue;lastBar=e.t;if(e.t>=ac.currentTime-.01)onBar(e.t);}}catch(_){}},50);
 function resolve(okay){const v=volley,f=v.flash;v.flash=null;v.run=C.runStep(v.run,okay);v.next=clock+C.QUIET_REST;
  if(v.sound&&v.bar!=null&&v.thrown<C.VOLLEY&&r.ac){const strike=clock+(v.bar+16*(r.SIX||.125)-r.ac.currentTime);v.bar=null;if(strike-clock>.6){throwFlash(strike);v.flash.thrown=clock;}}
  if(okay){v.returned++;streaks.push({from:me(),to:{x:v.x,y:v.y},at:clock});sing('pulsar',[Math.min(8,v.run.cur-1)],{instrument:C.PULSAR_INSTRUMENT,gain:C.PULSAR_GAIN,chord:true});}
  else glows.push({x:f.aim.x,y:f.aim.y,at:clock,dim:true});}
 function endVolley(){const v=volley;volley=null;if(!v)return;pulsarRest=v.id;if(!v.thrown)return;let amount=0;
  const res=commit(q=>{const n=C.noteVolley(q,v.id,v.run.best,v.returned,today());if(n?.pays){amount=pay('Púlsar',C.pulsarReward(v));q.earned+=amount;}return n;});
  if(!res)amount=0;gained(amount);summary={text:`Púlsar · racha ${v.run.best} de ${C.VOLLEY}${amount?' · +'+amount+' ✦':''}`,until:clock+3.4};}
 function stepPulsar(p,pulses){
  if(volley){const v=volley;if(others()||dist(p,v)>C.PULSAR_OUT){endVolley();return;}
   // Without sound (or without the music's bars), the flashes keep their own clock.
   if(!v.flash&&v.thrown<C.VOLLEY&&clock>=v.next&&(!v.sound||clock-v.idle>3))throwFlash(clock+C.QUIET_WARN);
   const f=v.flash;if(f){if(v.sound){if(C.flashReturned(f,pulses))resolve(true);else if(clock>f.strike+C.RETURN_WINDOW)resolve(false);}else if(clock>=f.strike)resolve(C.flashDodged(f,p));}
   if(!v.flash&&v.thrown>=C.VOLLEY)endVolley();return;}
  if(pulsarRest&&!sites.pulsars.some(s=>s.id===pulsarRest&&s.d<=C.PULSAR_OUT))pulsarRest=null;
  if(others()||mine())return;const s=sites.pulsars.find(x=>x.d<=C.PULSAR_ZONE&&x.id!==pulsarRest);if(s)startVolley(s);}
 // ---------- the asteroids ----------
 function stepRocks(pulses){if(others()||mine()||!pulses.length)return;const q=book();
  for(const w of pulses){const s=C.rocksNear(world,w,C.DIG_REACH)[0];if(!s||Object.hasOwn(q.cores,s.id))continue;const plan=C.rockLayers(s),was=q.rocks[s.id]?.l|0,res=C.dig({l:was,h:hits.get(s.id)||0},plan,w.beat);shake.set(s.id,clock);
   if(!res.broke){hits.set(s.id,res.h);continue;}hits.delete(s.id);let amount=0;
   const done=commit(q=>{const n=C.noteLayer(q,s,plan,res.l);if(n==='core'){amount=pay('Asteroide',C.coreReward(s));q.earned+=amount;}return n;});
   if(!done){hits.set(s.id,0);continue;}glows.push({x:s.x,y:s.y,at:clock,color:done==='core'?plan.color:plan.layers[Math.min(plan.layers.length-1,res.l)]?.color});
   if(done==='layer')sing('capa',[C.layerDegree(res.l-1)],{instrument:C.ROCK_INSTRUMENT,gain:C.ROCK_GAIN});
   else{sing('nucleo',C.CORE_DEGREES,{instrument:C.ROCK_INSTRUMENT,gain:C.ROCK_GAIN,spacing:2});gained(amount);const n=Object.values(book().cores).filter(k=>k===plan.core).length;
    summary={text:`${plan.name}${n===1?' · nuevo':` · ${n}`}${amount?' · +'+amount+' ✦':''}`,until:clock+3.4};}}}
 // ---------- the zip lines ----------
 const linesHere=id=>C.linesAt(book(),world,id);
 function startRide(line,from){const to=C.zipOther(line,from.id),d=dist(from,to);ride={line,from:{x:from.x,y:from.y,id:from.id,km:from.km},to,start:clock,secs:C.zipSeconds(d)};zipRest=null;
  sing('tirolina',C.ZIP_DEGREES,{instrument:C.ZIP_INSTRUMENT,gain:C.ZIP_GAIN,spacing:2});}
 function arrive(){const g=ride;ride=null;r.S.wx=g.to.x;r.S.wy=g.to.y;zipRest={id:g.to.id,x:g.to.x,y:g.to.y};zipLast=g.to;zipPrev=null;zipHere=g.to;commit(q=>{q.rides++;return true;});glows.push({x:g.to.x,y:g.to.y,at:clock});
  sing('tirolina',[9,4],{instrument:C.ZIP_INSTRUMENT,gain:C.ZIP_GAIN,spacing:2});summary={text:`Tirolina · km ${g.to.km}`,until:clock+2.6};}
 function stepZip(p,pulses){
  if(ride){const k=(clock-ride.start)/ride.secs,pt=C.zipPoint(ride.from,ride.to,k);r.S.wx=pt.x;r.S.wy=pt.y;if(k>=1)arrive();return;}
  const b=buoyHere(world,p,C.ZIP_AT);
  if(zipRest&&dist(p,zipRest)>C.ZIP_REST)zipRest=null;
  if(!b||!C.zipBuoyOk(b)){zipHere=null;return;}
  if(zipHere?.id!==b.id){zipHere=b;if(zipLast&&zipLast.id!==b.id)zipPrev=zipLast;zipLast=b;const q=book();if(!q.buoys.includes(world+'|'+b.id))commit(q=>C.noteZipBuoy(q,world,b));}
  if(zipRest?.id===b.id||others()||mine()||!pulses.length)return;const q=book();
  if(zipPrev&&C.canLay(q,world,zipPrev,b)){const from=zipPrev,line=commit(q=>C.layLine(q,world,from,b,today()));if(line){layAt=clock;zipPrev=null;glows.push({x:from.x,y:from.y,at:clock});glows.push({x:b.x,y:b.y,at:clock});
    sing('tirolina',C.ZIP_DEGREES,{instrument:C.ZIP_INSTRUMENT,gain:C.ZIP_GAIN,spacing:2});if(words())r.toast?.(`<em>Tirolina de luz</em> · hasta el km ${from.km}`,{level:2});summary={text:`Tirolina tendida · km ${from.km}`,until:clock+3};}return;}
  if(clock-layAt<C.ZIP_SETTLE)return;const line=linesHere(b.id)[0];if(line)startRide(line,b);}
 // ---------- the sea of dust ----------
 function surface(){const s=sunk;sunk=null;if(dark){dark=false;dustFilter(r,false);}if(!s)return;const p=me();glows.push({x:p.x,y:p.y,at:clock,color:DUSTY});
  sing('polvo',[4],{instrument:C.DUST_INSTRUMENT,gain:C.DUST_GAIN});summary={text:'Fuera del polvo',until:clock+2.2};}
 function stepDust(p,pulses){
  if(sunk){const h=C.dustHidden(sunk);if(dist(p,sunk)>C.DUST_R||others()){surface();return;}
   if(h&&!Object.hasOwn(book().dust,sunk.id)&&dist(p,h)<=C.HIDDEN_FIND){let amount=0;const s=sunk,res=commit(q=>{const n=C.noteHidden(q,s.id,today());if(n){amount=pay('Bajo el polvo',C.hiddenReward(s));q.earned+=amount;}return n;});
    if(res){gained(amount);glows.push({x:h.x,y:h.y,at:clock,color:GOLD});sing('hallazgo',C.FIND_DEGREES,{instrument:C.DUST_INSTRUMENT,gain:C.DUST_GAIN,spacing:2});if(words())r.toast?.(`<em>Bajo el polvo</em> · ${h.name}`+(amount?` · +${amount} ✦`:''),{level:2,category:'ganado'});summary={text:`${h.name}${amount?' · +'+amount+' ✦':''}`,until:clock+3.4};}}
   const want=!!r.S.sound&&r.ac?.state==='running';if(want){dustFilter(r,true);dark=true;}else if(dark){dark=false;dustFilter(r,false);}return;}
  const s=sites.dust.find(x=>x.d<=C.DUST_R+C.DUST_RING);if(!s)return;
  // On the surface the ring of rocks stops the cube.
  if(!ride){const out=C.ringWall(p,lastPos,s);if(out.x!==p.x||out.y!==p.y){r.S.wx=out.x;r.S.wy=out.y;}}
  if(others()||mine()||!pulses.length||dist(p,s)>C.DUST_R)return;
  sunk={id:s.id,x:s.x,y:s.y,u:s.u,at:clock};commit(q=>{q.sinks++;return true;});sing('polvo',[0],{instrument:C.DUST_INSTRUMENT,gain:C.DUST_GAIN});
  if(words())r.toast?.('Bajo el polvo · Sal por el otro lado.',{level:2,ttl:2600});}
 // ---------- the kit ----------
 function stepKit(p,pulses){if(others()||mine())return;const q=book(),near=s=>s.d<=C.CACHE_TOUCH||pulses.some(w=>dist(w,s)<=C.CACHE_PULSE);
  if(C.nextTool(q))for(const s of sites.caches){if(s.d>C.CACHE_PULSE+200)break;if(Object.hasOwn(q.caches,s.id)||!near(s))continue;const t=commit(q=>C.takeTool(q,s.id,today()));
   if(t){glows.push({x:s.x,y:s.y,at:clock,color:GOLD});sing('herramienta',C.FIND_DEGREES,{instrument:C.KIT_INSTRUMENT,gain:C.KIT_GAIN,spacing:2});if(words())r.toast?.(`<em>${C.TOOL_NAMES[t]}</em> · ${C.TOOL_LINES[t]}`,{level:2,category:'ganado'});summary={text:`${C.TOOL_NAMES[t]} · para siempre`,until:clock+3.4};}break;}
  for(const s of sites.points){if(s.d>C.POINT_PULSE+200)break;const def=C.POINT_DEFS[s.kind];if(!book().tools[def.tool]||!C.pointPaysToday(book(),s.id,today())||!(s.d<=C.POINT_TOUCH||pulses.some(w=>dist(w,s)<=C.POINT_PULSE)))continue;let amount=0;
   const res=commit(q=>{const n=C.notePoint(q,s,today());if(n){amount=pay(def.name,C.pointReward(s));q.earned+=amount;}return n;});
   if(res){gained(amount);streaks.push({from:{x:s.x,y:s.y},to:me(),at:clock,tool:def.tool});sing('punto',C.POINT_DEGREES,{instrument:C.KIT_INSTRUMENT,gain:C.KIT_GAIN});summary={text:`${def.name}${amount?' · +'+amount+' ✦':''}`,until:clock+3};}break;}}
 // ---------- the frame ----------
 function tick(dt,modal=false){
  if(!r.S)return;book();
  if(!allowed()){if(volley)endVolley();if(ride){const g=ride;ride=null;zipRest={id:g.to.id,x:g.to.x,y:g.to.y};}if(sunk){sunk=null;}if(dark){dark=false;dustFilter(r,false);}summary=null;return;}
  if(modal||paused()){if(dark){dark=false;dustFilter(r,false);}return;}
  const step=Math.max(0,Math.min(.05,dt||0));clock+=step;if(summary&&clock>summary.until)summary=null;glows=glows.filter(g=>clock-g.at<1.3);streaks=streaks.filter(g=>clock-g.at<.7);
  const p=me(),pulses=[];for(const w of r.waves||[])if(!seen.has(w)){seen.add(w);if(w.origin==='player')pulses.push({x:w.x,y:w.y,beat:!!w.beat,at:clock});}
  if(!ok())return;look(p);
  stepZip(p,pulses);if(ride){lastPos=me();return;}
  stepPulsar(p,pulses);stepDust(me(),pulses);stepRocks(pulses);stepKit(me(),pulses);lastPos=me();
 }
 // ---------- drawing ----------
 const at=(x,y)=>({x:x+r.W/2-r.camX,y:y+r.H/2-r.camY});
 const onScreen=(q,m=30)=>q.x>-m&&q.y>-m&&q.x<r.W+m&&q.y<r.H+m;
 const say=(c,t,x,y,max=r.W-32)=>{const w=Math.min(max,c.measureText(t).width);c.fillText(t,Math.max(16+w/2,Math.min(r.W-16-w/2,x)),y,max);};
 function drawPulsar(c,q,lit){const k=reduced()?1:.75+.25*Math.sin(clock*5);c.globalAlpha=.95;c.fillStyle='#ffffff';c.strokeStyle='#ffffff';c.lineWidth=1.2;c.beginPath();c.arc(q.x,q.y,3,0,TAU);c.fill();
  c.beginPath();for(let i=0;i<4;i++){const a=i/4*TAU+(reduced()?0:clock*.6);c.moveTo(q.x+Math.cos(a)*5,q.y+Math.sin(a)*5);c.lineTo(q.x+Math.cos(a)*(8+3*k),q.y+Math.sin(a)*(8+3*k));}c.stroke();
  c.globalAlpha=lit?.3:.12;c.setLineDash([3,6]);c.beginPath();c.arc(q.x,q.y,C.PULSAR_ZONE,0,TAU);c.stroke();c.setLineDash([]);}
 function drawRock(c,s,q,plan,l,h){const left=plan.layers.length-l,rad=6+4*left,jolt=reduced()?0:Math.max(0,.18-(clock-(shake.get(s.id)??-9)))*12,ox=q.x+Math.sin(clock*60)*jolt,layer=plan.layers[l];
  c.globalAlpha=.95;c.fillStyle=layer.color;c.beginPath();for(let k=0;k<9;k++){const a=k/9*TAU,rr=rad*(.82+.18*hashKey(`capas:p:${s.id}:${k}`));c.lineTo(ox+Math.cos(a)*rr,q.y+Math.sin(a)*rr);}c.closePath();c.fill();
  const inner=plan.layers[l+1]?.color||plan.color;c.globalAlpha=.8;c.strokeStyle=inner;c.lineWidth=1.5;c.beginPath();c.arc(ox,q.y,Math.max(2,rad-4),0,TAU);c.stroke();
  c.globalAlpha=.7;c.strokeStyle='#000';c.lineWidth=1;for(let k=0;k<h;k++){const a=hashKey(`capas:g:${s.id}:${l}:${k}`)*TAU;c.beginPath();c.moveTo(ox+Math.cos(a)*rad,q.y+Math.sin(a)*rad);c.lineTo(ox+Math.cos(a)*(rad-5),q.y+Math.sin(a)*(rad-5));c.stroke();}}
 function drawHollow(c,q,color){c.globalAlpha=.5;c.strokeStyle=ROCKY;c.lineWidth=2;c.beginPath();c.arc(q.x,q.y,6,0,TAU);c.stroke();c.globalAlpha=.6;c.fillStyle=color;c.fillRect(Math.round(q.x)-1,Math.round(q.y)-1,2,2);}
 function grainsOf(s){let g=grains.get(s.id);if(!g){const next=sequence(Math.floor(hashKey('polvo:g:'+s.id)*4294967296));g=[];for(let k=0;k<170;k++){const a=next()*TAU,rr=Math.sqrt(next())*C.DUST_R;g.push({x:s.x+Math.cos(a)*rr,y:s.y+Math.sin(a)*rr,big:next()<.2});}grains.set(s.id,g);if(grains.size>24)grains.delete(grains.keys().next().value);}return g;}
 function drawDust(c,s){const q0=at(s.x,s.y);if(!onScreen(q0,C.DUST_R+40))return false;c.fillStyle=DUSTY;
  for(const g of grainsOf(s)){const q=at(g.x,g.y);if(!onScreen(q,4))continue;c.globalAlpha=g.big?.55:.35;const z=g.big?3:2;c.fillRect(Math.round(q.x),Math.round(q.y),z,z);}
  c.globalAlpha=.12;c.strokeStyle=DUSTY;c.lineWidth=1;c.beginPath();c.arc(q0.x,q0.y,C.DUST_R,0,TAU);c.stroke();
  for(const k of C.dustRocks(s)){const q=at(k.x,k.y);if(!onScreen(q,C.DUST_ROCK_R))continue;c.globalAlpha=sunk&&sunk.id===s.id?.4:.95;c.fillStyle=ROCKY;c.beginPath();for(let i=0;i<7;i++){const a=i/7*TAU,rr=C.DUST_ROCK_R*(.85+.15*Math.sin(k.k*2.3+i*1.7));c.lineTo(q.x+Math.cos(a)*rr,q.y+Math.sin(a)*rr);}c.closePath();c.fill();}
  const h=C.dustHidden(s);if(h&&sunk&&sunk.id===s.id&&!Object.hasOwn(book().dust,s.id)){const q=at(h.x,h.y),k=reduced()?1:.6+.4*Math.sin(clock*4);c.globalAlpha=.9*k;c.fillStyle='#ffffff';c.beginPath();c.moveTo(q.x,q.y-4);c.lineTo(q.x+3,q.y);c.lineTo(q.x,q.y+4);c.lineTo(q.x-3,q.y);c.closePath();c.fill();return 'hidden';}
  return true;}
 function drawCache(c,q){c.globalAlpha=.95;c.fillStyle='#000';c.strokeStyle='#ffffff';c.lineWidth=1.5;c.fillRect(q.x-7,q.y-5,14,10);c.strokeRect(q.x-7,q.y-5,14,10);c.beginPath();c.moveTo(q.x-3,q.y-5);c.lineTo(q.x-3,q.y-8);c.lineTo(q.x+3,q.y-8);c.lineTo(q.x+3,q.y-5);c.stroke();c.fillStyle='#ffffff';c.fillRect(Math.round(q.x)-1,Math.round(q.y)-1,2,2);}
 function drawPoint(c,s,q,open){c.globalAlpha=open?.95:.45;
  if(s.kind==='banco'){c.fillStyle='#ffffff';for(let k=0;k<7;k++){const a=k/7*TAU+(reduced()?0:clock*.8),rr=5+3*Math.sin(k*1.9);c.fillRect(Math.round(q.x+Math.cos(a)*rr)-1,Math.round(q.y+Math.sin(a)*rr*.6)-1,2,2);}}
  else if(s.kind==='chatarra'){c.fillStyle='#9a9aa2';c.fillRect(q.x-5,q.y-2,6,4);c.fillRect(q.x+1,q.y+1,5,3);c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.moveTo(q.x-6,q.y-4);c.lineTo(q.x-1,q.y-7);c.stroke();}
  else{c.fillStyle='#000';c.strokeStyle='#ffffff';c.lineWidth=1.2;c.beginPath();c.arc(q.x,q.y,7,0,TAU);c.fill();c.stroke();c.fillStyle='#ffffff';for(const [dx,dy] of [[-2,-1],[2,1],[0,3]])c.fillRect(Math.round(q.x+dx),Math.round(q.y+dy),1,1);}}
 function edge(c,kind,o){const q=edgeSpot(r.W,r.H,o.x-r.camX,o.y-r.camY,22,104),x=Math.round(q.x),y=Math.round(q.y);c.globalAlpha=.7;c.strokeStyle='#ffffff';c.fillStyle='#ffffff';c.lineWidth=1.5;
  if(kind==='pulsar'){c.beginPath();for(let i=0;i<4;i++){const a=i/4*TAU;c.moveTo(x,y);c.lineTo(x+Math.cos(a)*4,y+Math.sin(a)*4);}c.stroke();}else if(kind==='asteroide'){c.beginPath();c.arc(x,y,3.5,0,TAU);c.stroke();}
  else if(kind==='kit'){c.strokeRect(x-4,y-3,8,6);}else{c.fillRect(x-1,y-1,2,2);c.beginPath();c.arc(x,y,4,0,TAU);c.stroke();}
  return {x,y,id:o.id};}
 function draw(){const out={pulsar:null,rocks:[],dust:null,caches:[],points:[],lines:0,edge:{},volley:null,ride:!!ride,sunk:!!sunk,hint:''};if(!allowed()||!r.cx||!ok()||!sites){drawn=out;return;}
  const c=r.cx,p=me(),q=book(),still=paused(),quiet=others()&&!mine();c.save();c.textAlign='center';const mark=[];
  for(const s of sites.dust){const d=drawDust(c,s);if(d&&!out.dust)out.dust={id:s.id,hidden:d==='hidden'};}
  // Zip lines of this world near you: a thin line of light with a light that runs along it.
  for(const l of q.lines){if(l.w!==world)continue;const a=at(l.a.x,l.a.y),b=at(l.b.x,l.b.y);if(Math.max(a.x,b.x)<-20||Math.min(a.x,b.x)>r.W+20||Math.max(a.y,b.y)<-20||Math.min(a.y,b.y)>r.H+20)continue;out.lines++;
   c.globalAlpha=ride&&ride.line===l?.85:.45;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();
   const k=reduced()?.5:(clock*.35+hashKey('zip:'+l.id))%1;c.globalAlpha=.8;c.fillStyle='#ffffff';c.fillRect(Math.round(a.x+(b.x-a.x)*k)-1,Math.round(a.y+(b.y-a.y)*k)-1,2,2);}
  for(const s of sites.pulsars){const sp=at(s.x,s.y);if(onScreen(sp)){drawPulsar(c,sp,!!volley&&volley.id===s.id);out.pulsar=out.pulsar||{id:s.id,x:Math.round(sp.x),y:Math.round(sp.y)};}else if(q.pulsars[s.id]!==today()&&s.id!==pulsarRest)mark.push({kind:'pulsar',o:s,d:s.d});}
  for(const s of sites.rocks){const sp=at(s.x,s.y),dug=Object.hasOwn(q.cores,s.id);if(onScreen(sp)){const plan=C.rockLayers(s);if(dug)drawHollow(c,sp,C.CORE_COLORS[q.cores[s.id]]);else drawRock(c,s,sp,plan,q.rocks[s.id]?.l|0,hits.get(s.id)||0);out.rocks.push({id:s.id,dug,l:q.rocks[s.id]?.l|0,x:Math.round(sp.x),y:Math.round(sp.y)});}else if(!dug)mark.push({kind:'asteroide',o:s,d:s.d});}
  for(const s of sites.caches){if(Object.hasOwn(q.caches,s.id))continue;const sp=at(s.x,s.y);if(onScreen(sp)){drawCache(c,sp);out.caches.push({id:s.id,x:Math.round(sp.x),y:Math.round(sp.y)});}else mark.push({kind:'kit',o:s,d:s.d});}
  for(const s of sites.points){const def=C.POINT_DEFS[s.kind],has=!!q.tools[def.tool],open=has&&C.pointPaysToday(q,s.id,today()),sp=at(s.x,s.y);if(onScreen(sp)){drawPoint(c,s,sp,open);out.points.push({id:s.id,kind:s.kind,open,x:Math.round(sp.x),y:Math.round(sp.y)});
    if(s.d<=C.POINT_READ&&words()&&!quiet&&!summary){c.globalAlpha=.75;c.fillStyle='#ffffff';c.font='10px "Geist Mono", monospace';const t=has?def.name:`${def.name} · ${def.need}`;say(c,t,sp.x,sp.y-14);out.hint=t;}}else if(open)mark.push({kind:'punto',o:s,d:s.d});}
  // The volley: the flash on its way to you (or to the spot it aims at), the ring that closes at its strike, the run.
  if(volley){const v=volley,ps=at(v.x,v.y);out.volley={thrown:v.thrown,returned:v.returned,run:v.run.cur,best:v.run.best,sound:v.sound,flash:v.flash?{strike:v.flash.strike,left:v.flash.strike-clock}:null};
   if(v.flash){const f=v.flash,aim=v.sound?p:f.aim,ta=at(aim.x,aim.y),k=Math.max(0,Math.min(1,(clock-f.thrown)/Math.max(.2,f.strike-f.thrown)));c.globalAlpha=.25;c.strokeStyle='#ffffff';c.lineWidth=1;c.setLineDash([2,5]);c.beginPath();c.moveTo(ps.x,ps.y);c.lineTo(ta.x,ta.y);c.stroke();c.setLineDash([]);
    const hx=ps.x+(ta.x-ps.x)*k,hy=ps.y+(ta.y-ps.y)*k;c.globalAlpha=.95;c.fillStyle='#ffffff';c.beginPath();c.arc(hx,hy,3,0,TAU);c.fill();c.globalAlpha=.4+.5*k;c.lineWidth=1.5;c.beginPath();c.arc(ta.x,ta.y,8+30*(1-k),0,TAU);c.stroke();}
   if(words()){c.globalAlpha=1;c.fillStyle='#ffffff';c.font='12px "Geist Mono", monospace';say(c,`Racha · ${v.run.cur} · ${v.thrown} de ${C.VOLLEY}`,r.W/2,Math.max(196,r.H/2-152));}}
  for(const g of streaks){const k=(clock-g.at)/.7,a=at(g.from.x,g.from.y),b=at(g.to.x,g.to.y);c.globalAlpha=.9*(1-k);c.strokeStyle=g.tool?'#ffffff':GOLD;c.lineWidth=1.5;c.beginPath();c.moveTo(a.x+(b.x-a.x)*Math.max(0,k-.3),a.y+(b.y-a.y)*Math.max(0,k-.3));c.lineTo(a.x+(b.x-a.x)*k,a.y+(b.y-a.y)*k);c.stroke();}
  // At a buoy of 40 km or more: what a pulse does there.
  if(zipHere&&!ride&&!volley&&!sunk&&words()&&!quiet&&!summary){const b=zipHere,line=zipRest?.id===b.id?null:linesHere(b.id)[0],lay=zipPrev&&C.canLay(q,world,zipPrev,b),sp=at(b.x,b.y);
   const t=lay?`Pulsa · tirolina al km ${zipPrev.km}`:line?`Pulsa · tirolina al km ${C.zipOther(line,b.id).km}`:'';if(t){c.globalAlpha=.8;c.fillStyle='#ffffff';c.font='10px "Geist Mono", monospace';say(c,t,sp.x,sp.y+26);out.hint=t;}}
  if(ride&&!reduced()){for(let k=1;k<5;k++){c.globalAlpha=.5/k;c.fillStyle='#ffffff';const back=C.zipPoint(ride.from,ride.to,(clock-ride.start)/ride.secs-k*.04),sp=at(back.x,back.y);c.fillRect(Math.round(sp.x)-1,Math.round(sp.y)-1,2,2);}}
  if(!quiet&&!still&&!mine()&&!r.skySecretBusy?.()){mark.sort((a,b)=>a.d-b.d);const m=mark[0];if(m)out.edge[m.kind]=edge(c,m.kind,m.o);}
  for(const g of glows){const sp=at(g.x,g.y),k=(clock-g.at)/1.3;c.globalAlpha=(g.dim?.4:.8)*(1-k);c.strokeStyle=g.color||'#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(sp.x,sp.y,reduced()?14:6+k*30,0,TAU);c.stroke();}
  if(summary&&words()&&!quiet){c.globalAlpha=.92;c.fillStyle='#ffffff';c.font='12px "Geist Mono", monospace';c.fillText(summary.text,r.W/2,Math.min(r.H-150,r.H/2+150),r.W-32);}
  c.restore();drawn=out;}
 // Under the dust the cube is covered by it: grains over the cube (the cube itself stays as it is).
 function drawCube(c,x,y,s){if(!sunk||!allowed())return;c.save();c.globalAlpha=.75;c.fillStyle='#000';c.fillRect(Math.round(x-s/2)-1,Math.round(y-s/2)-1,Math.round(s)+2,Math.round(s)+2);c.fillStyle=DUSTY;
  for(let k=0;k<10;k++){const a=k/10*TAU+(reduced()?0:clock*1.5),rr=s/2+2+(k%3)*2;c.globalAlpha=.55;c.fillRect(Math.round(x+Math.cos(a)*rr)-1,Math.round(y+Math.sin(a)*rr)-1,2,2);}
  c.globalAlpha=.5;for(let k=0;k<5;k++)c.fillRect(Math.round(x-s/2+((k*7)%Math.max(2,s))),Math.round(y-s/2+((k*5)%Math.max(2,s))),2,2);c.restore();}
 // ---------- the Bitácora lines ----------
 const plural=(n,one,many)=>`${n} ${n===1?one:many}`;
 const lines={
  pulsar:()=>{const v=book().volleys;return v.best?`Mejor racha · ${v.best}`:'Devuelve su destello con un pulso.';},
  asteroide:()=>{const n=C.coreCount(book());return n?`${plural(n,'núcleo','núcleos')} · ${C.coreKinds(book())} de ${C.CORES.length} clases`:'Excávalo capa a capa con pulsos.';},
  tirolina:()=>{const q=book(),n=q.lines.filter(l=>l.w===world).length;return n?`${plural(n,'tirolina tendida','tirolinas tendidas')} · ${plural(q.rides,'viaje','viajes')}`:'Entre dos boyas que pisaste.';},
  polvo:()=>{const n=Object.keys(book().dust).length;return n?plural(n,'hallazgo bajo el polvo','hallazgos bajo el polvo'):'Un pulso te hunde en el polvo.';},
  kit:()=>{const q=book(),have=C.TOOLS.filter(t=>q.tools[t]).map(t=>C.TOOL_NAMES[t]),n=Object.values(q.gathered).reduce((a,b)=>a+b,0);return have.length?`${have.join(', ')}${n?` · ${plural(n,'recogida','recogidas')}`:''}`:'Tres herramientas que se guardan.';},
 };
 for(const id of Object.keys(lines))r.bandAttach?.(id,{line:lines[id],...(id==='pulsar'?{busy:mine}:{})});
 Object.defineProperties(r,{
  viajeCTick:{get:()=>tick},drawViajeC:{get:()=>draw},drawViajeCCube:{get:()=>drawCube},viajeCBusy:{get:()=>mine},
  // Tests only (the runtime is never published): the state.
  viajeCState:{get:()=>()=>{const q=book();return {version:q.version,allowed:allowed(),world,clock,book:structuredClone(q),busy:mine(),
   volley:volley?{id:volley.id,sound:volley.sound,thrown:volley.thrown,returned:volley.returned,run:{...volley.run},flash:volley.flash?{...volley.flash,left:volley.flash.strike-clock}:null}:null,
   ride:ride?{to:ride.to.id,secs:ride.secs,k:(clock-ride.start)/ride.secs}:null,sunk:sunk?{id:sunk.id}:null,dark,zip:{last:zipLast?.id||null,prev:zipPrev?.id||null,here:zipHere?.id||null,rest:zipRest},
   hits:Object.fromEntries(hits),drawn,summary:summary?.text||'',notes,rest:pulsarRest};}}
 });
}
