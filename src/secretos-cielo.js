// Secretos del cielo (Jay, 4 Nov 2026, alpha.247; docs/MUNDO.md#secretos): the second batch of secrets, all of space,
// in the free World after the Journey, never in a chapter, a round, a finale, an activity or the Refugio. The rules are
// in secretos-cielo-model.js.
// · Meteoros: a rare shower of shooting stars near the cube; a pulse on time catches one (without sound, passing through
//   it or any pulse near it). A whole shower pays like a living encounter, by universeReward.
// · Cristales de cometa: fifty at fixed points; the Bitácora counts them, never says where. All fifty: an ornament of
//   three small gold crystals round the cube (worn at once, taken off in Tu cubo › Secretos). No sparks.
// · Sondas perdidas: small empty probes that beep on the bars, louder as you come near; out of view, a «?» at the
//   screen's edge (the one layer of arrows, coherencia T2), with the sound on or off. One found gives a secret coordinate, a white «?» on the Mapa del universo.
// · Eclipse: a planet crosses a star on the device's clock; there at that moment, the music darkens for a few seconds
//   (audio.js's own comfort filter, which the engine exposes as runtime.comfortLowpass) and comes back by itself.
// One scene at a time: no shower and no eclipse while a living encounter, a figure or a mischief scene plays; while a
// shower or an eclipse lasts, the encounters and the figures wait (skySecretBusy). The music is untouched otherwise.
import {openSurface,prefersReducedMotion} from './frame-state.js';
import {freeOpen} from './journey-mode.js';
import {creditSparks} from './sparks-model.js';
import {SOUND_TRIM,edgeSpot,worldKey,rumorNow} from './descubrir-model.js';
import {nearestSatellite} from './recorrer-model.js';
import {scaleNote,secretFound} from './secretos-model.js';
import {glow,streak,bake,radial} from './fx-kit.js';
import {SKY_SECRETS_VERSION,COMETS,COMET_COUNT,COMET_TOUCH,COMET_PULSE,COMET_GLINT,PROBES,PROBE_HEAR,PROBE_TOUCH,PROBE_PULSE,COORD_ARRIVE,
 meteorInterval,METEOR_COUNT,METEOR_GAP,METEOR_LIFE,METEOR_LEAVE,meteorPath,meteorHead,meteorCaught,meteorReward,
 ECLIPSE_REACH,ECLIPSE_SEE,ECLIPSE_SECONDS,ECLIPSE_CUTOFF,ECLIPSE_TAU,ECLIPSE_TRAVEL,eclipseNear,eclipsePhase,
 normalizeSkySecrets,cometFound,cometCount,probeFound,probeCount,orbitEarned,orbitOn,skyPagesFound,SKY_PAGES,keepComet,keepProbe,fulfilCoord,
 PROBE_INSTRUMENT,METEOR_INSTRUMENT,COMET_INSTRUMENT,PROBE_GAIN,METEOR_GAIN,COMET_GAIN,PROBE_DEGREES,COMET_DEGREES,meteorDegree,probeLoudness} from './secretos-cielo-model.js';
const TAU=Math.PI*2,GOLD='#f0d27a',ICE='#cfe8ff';
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PAGE_NAMES=Object.freeze({meteoros:'Lluvia de estrellas',cometas:'Cristales de cometa',sondas:'Sondas perdidas',eclipse:'Eclipse'});
// Notes of the place's scale from a time on the grid (one every `spacing` sixteenths; 0: together), in an instrument of
// the album of sounds at its measured trim, far under the music. Returns how many were sent.
export function playSkySecretNotes(r,kind,degrees,start,{instrument=METEOR_INSTRUMENT,gain=METEOR_GAIN,spacing=1,octave=1}={}){if(!r.S?.sound||r.ac?.state!=='running')return 0;
 const d=r.regionOfPos?.(r.S.wx,r.S.wy),scale=r.MU?.dnaA?.scale||d?.scale,tonic=57+(r.MU?.tr||0)+12*octave,step=(r.SIX||.125)*spacing;let n=0;
 degrees.forEach((degree,k)=>{const note=scaleNote(scale,tonic,degree),at=start+k*step,emit=()=>{r.hookInst(instrument,note,at,r.vel(gain*(SOUND_TRIM[instrument]??1)),d);r.skySecretAudioCue?.({kind,instrument,note,time:at,gain,six:r.SIX});};
  if(r.withVoiceOrigin)r.withVoiceOrigin('player',emit);else emit();n++;});return n;}
// The eclipse on the output's comfort filter (audio.js's own, exposed as runtime.comfortLowpass): while on, held dark;
// off, handed back to audio.js (applyComfort), which eases it to where the music has it. Returns whether it acted.
export function eclipseFilter(r,on,time=r.ac?.currentTime||0){const f=r.comfortLowpass?.frequency;if(!f)return false;
 f.cancelScheduledValues(time);if(on){f.setTargetAtTime(Math.min(ECLIPSE_CUTOFF,f.value||ECLIPSE_CUTOFF),time,ECLIPSE_TAU);return true;}r.applyComfort?.(time);return true;}
export function initialize(r){
 const $=id=>r.$?.(id)||globalThis.document?.getElementById(id)||null;
 let owner=null,world='',clock=0,showerClock=0,shower=null,seen=new WeakSet(),glows=[],summary=null,drawn={},notes=0,beeps=0,offset=0,lastBar=-1,eclipse=null,dark=false,lastCycle='',cubeKey='';
 const reduced=()=>!!(r.S?.reducedMotion||prefersReducedMotion());
 // The free World's surface after the Journey, outside every level, activity, the Refugio and the finales.
 const allowed=()=>!!r.S&&r.inWorld?.()&&(r.S.layer||'superficie')==='superficie'&&freeOpen(r.S.journey)&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!r.houseActive?.()&&!r.travelInLevel?.()&&!r.placeRun?.()&&!r.placeCardDue?.()&&!r.songStageState?.()?.running&&!r.journeyFinaleState?.()?.running;
 const paused=()=>globalThis.document?.hidden||!!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 const scene=()=>!!r.liveEncounterActive?.()||!!r.skyMapActive?.()||!!(r.mischiefBusy?r.mischiefBusy():r.mischiefState?.scene)||!!r.bandBusy?.()||!!r.lejosBBusy?.();   // alpha.248: a scene of the bands   // alpha.249: a postcard, a sky song or a grey region (lejos-b.js)
 const words=()=>r.S.universeTexts!==false;
 // The save (S.skySecrets), normalised once per save; a later version is only read.
 function book(){if(owner!==r.S){owner=r.S;owner.skySecrets=normalizeSkySecrets(owner.skySecrets);shower=null;glows=[];summary=null;cubeKey='';}world=worldKey(r.worldIdentity);return owner.skySecrets;}
 const ok=()=>book().version===SKY_SECRETS_VERSION&&!book().readOnly;
 const me=()=>({x:r.S.wx,y:r.S.wy});
 const today=()=>r.S.todayKey||'';
 const sec=()=>Date.now()/1000+offset;
 const soon=fn=>{const state=r.S;if(state.sound&&r.ac?.state==='running'&&r.beatSoon)r.beatSoon(time=>{if(state===r.S)fn(time);},null,'player');};
 const sing=(kind,degrees,opts)=>soon(time=>{notes+=playSkySecretNotes(r,kind,degrees,time,opts);});
 // A change kept or nothing: a failed save puts the save (and the sparks) back as they were.
 function commit(change){const S=r.S,before={sky:structuredClone(book()),sparks:S.sparks,economy:S.sparkEconomy?structuredClone(S.sparkEconomy):undefined};const out=change(book());if(!out)return null;
  if(r.save?.()===false){S.skySecrets=before.sky;S.sparks=before.sparks;if(before.economy!==undefined)S.sparkEconomy=before.economy;owner=null;book();return null;}cubeKey='';if(!$('mJournal')?.hidden)r.refreshJournal?.();return out;}
 const newPage=(id,had)=>{if(!had&&skyPagesFound(book()).includes(id))r.toast?.(`<em>Secreto</em> · ${PAGE_NAMES[id]}`,{level:2,category:'ganado'});};
 // ---------- comet crystals ----------
 function keepCrystal(c){const had=skyPagesFound(book()).includes('cometas'),res=commit(q=>keepComet(q,c.i,today()));if(!res)return false;
  glows.push({x:c.x,y:c.y,at:clock,gold:res.all});sing('cometa',COMET_DEGREES,{instrument:COMET_INSTRUMENT,gain:COMET_GAIN,spacing:2,octave:1});
  summary={text:`Cristal de cometa · ${res.count} de ${COMET_COUNT}`,until:clock+3};newPage('cometas',had);
  if(res.all)r.toast?.('<em>Órbita de cometa</em> · Llévala o quítala en Tu cubo',{level:2,category:'ganado'});return true;}
 // ---------- lost probes ----------
 const look=()=>({asteroidFound:secretFound(r.S.secrets,'asteroide'),satellite:p=>{const s=nearestSatellite(world,p);return s?{id:'sat:'+world+':'+s.id,x:s.x,y:s.y}:null;}});
 function keepSonda(p){const had=skyPagesFound(book()).includes('sondas'),res=commit(q=>keepProbe(q,p.i,today(),look()));if(!res)return false;
  glows.push({x:p.x,y:p.y,at:clock});sing('sonda',[4,7,9],{instrument:PROBE_INSTRUMENT,gain:PROBE_GAIN,spacing:2,octave:1});
  summary={text:res.id?'Sonda perdida · Guardaba una coordenada':'Sonda perdida · Vacía',until:clock+3.4};newPage('sondas',had);
  if(res.id&&words())r.toast?.('Coordenada secreta · Mírala en el Mapa del universo',{level:2});return true;}
 const nearestProbe=(p,radius)=>{let best=null,bd=Infinity;for(const s of PROBES){if(probeFound(book(),s.i))continue;const d=Math.hypot(s.x-p.x,s.y-p.y);if(d<=radius&&d<bd){bd=d;best=s;}}return best?{probe:best,d:bd}:null;};
 // The beep: on the music's own bars (MU.sq), two high notes on the fifth, softer from further; never during a scene.
 function onBar(t){if(!r.S?.sound||r.ac?.state!=='running'||!allowed()||paused()||scene()||shower||eclipse||!ok())return;const near=nearestProbe(me(),PROBE_HEAR);if(!near)return;
  notes+=playSkySecretNotes(r,'sonda',PROBE_DEGREES,t,{instrument:PROBE_INSTRUMENT,gain:PROBE_GAIN*probeLoudness(near.d),spacing:2,octave:1});beeps++;}
 setInterval(()=>{try{const sq=r.MU?.sq,ac=r.ac;if(!ac||!sq?.length)return;for(const e of sq){if(e.s!==0||!(e.t>lastBar+1e-4))continue;lastBar=e.t;if(e.t>=ac.currentTime-.01)onBar(e.t);}}catch(_){}},50);
 // ---------- meteor showers ----------
 function startShower(){const q=book(),p=me(),n=q.meteors.n;shower={n,from:p,start:clock,meteors:Array.from({length:METEOR_COUNT},(_,k)=>({...meteorPath(n,k,p),caught:false,onTime:false})),caught:0};
  for(const w of r.waves||[])seen.add(w);showerClock=0;
  if(words())r.toast?.(r.S.sound?'Lluvia de estrellas. Pulsa a tiempo cuando pasen.':'Lluvia de estrellas. Pasa por ellas.',{level:2,ttl:3000});return true;}
 function endShower(paid=true){const s=shower;shower=null;if(!s||!paid)return;const had=skyPagesFound(book()).includes('meteoros'),onTime=s.caught===METEOR_COUNT&&s.meteors.every(m=>m.onTime);let amount=0;
  const res=commit(q=>{q.meteors.n=s.n+1;q.meteors.caught+=s.caught;if(s.caught===METEOR_COUNT)q.meteors.full++;
   const economy=r.S.sparkEconomy;if(s.caught&&economy&&economy.version===1){amount=creditSparks(r.S,meteorReward(s.caught,METEOR_COUNT,{x:s.from.x,y:s.from.y,onTime}));q.meteors.earned+=amount;economy.log.push({title:'Lluvia de estrellas',text:`Lluvia de estrellas · +${amount} chispas`,at:today()});economy.log=economy.log.slice(-80);}return true;});
  if(!res){amount=0;return;}if(amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});
  summary={text:`Lluvia de estrellas · ${s.caught} de ${METEOR_COUNT}${amount?' · +'+amount+' ✦':''}`,until:clock+3.2};newPage('meteoros',had);}
 function stepShower(p,pulses){const s=shower,age=clock-s.start;
  if(Math.hypot(p.x-s.from.x,p.y-s.from.y)>METEOR_LEAVE){endShower(true);return;}
  for(const m of s.meteors){const a=age-m.born;if(m.caught||a<0||a>METEOR_LIFE)continue;const head=meteorHead(m,a),got=meteorCaught(head,p,pulses,!!r.S.sound);if(!got)continue;
   m.caught=true;m.onTime=got.onTime;s.caught++;glows.push({x:head.x,y:head.y,at:clock});sing('meteoro',[meteorDegree(s.caught-1)],{instrument:METEOR_INSTRUMENT,gain:METEOR_GAIN,octave:1});}
  if(age>(METEOR_COUNT-1)*METEOR_GAP+METEOR_LIFE+.3)endShower(true);}
 // ---------- eclipses ----------
 function stepEclipse(p,live){
  if(eclipse){if(clock>=eclipse.until||!live||Math.hypot(p.x-eclipse.x,p.y-eclipse.y)>ECLIPSE_REACH*2){eclipse=null;}}
  if(!eclipse&&live){const s=eclipseNear(p,ECLIPSE_REACH);if(s){const f=eclipsePhase(s,sec()),key=s.id+':'+f.cycle;if(f.total&&key!==lastCycle&&!scene()&&!shower){lastCycle=key;eclipse={id:s.id,x:s.x,y:s.y,start:clock,until:clock+ECLIPSE_SECONDS};
   const had=skyPagesFound(book()).includes('eclipse');commit(q=>{q.eclipses.n++;if(!q.eclipses.first)q.eclipses.first=today();return true;});newPage('eclipse',had);}}}
  // The music: dark while it lasts (with sound), then handed back to audio.js.
  const want=!!eclipse&&!!r.S.sound&&r.ac?.state==='running';if(want){eclipseFilter(r,true);dark=true;}else if(dark){dark=false;eclipseFilter(r,false);}}
 // ---------- the frame ----------
 function tick(dt,modal=false){
  if(!r.S)return;book();
  if(!allowed()){if(shower)endShower(false);eclipse=null;if(dark){dark=false;eclipseFilter(r,false);}summary=null;return;}
  if(modal||paused()){if(dark){dark=false;eclipseFilter(r,false);}eclipse=null;return;}
  const step=Math.max(0,Math.min(.05,dt||0));clock+=step;if(summary&&clock>summary.until)summary=null;glows=glows.filter(g=>clock-g.at<1.3);
  const p=me(),pulses=[];for(const w of r.waves||[])if(!seen.has(w)){seen.add(w);if(w.origin==='player')pulses.push({x:w.x,y:w.y,beat:!!w.beat});}
  if(!ok()){stepEclipse(p,false);return;}
  for(const c of COMETS){if(cometFound(book(),c.i))continue;const d=Math.hypot(c.x-p.x,c.y-p.y);if(d>COMET_PULSE+400)continue;if(d<=COMET_TOUCH||pulses.some(w=>Math.hypot(w.x-c.x,w.y-c.y)<=COMET_PULSE))keepCrystal(c);}
  for(const s of PROBES){if(probeFound(book(),s.i))continue;const d=Math.hypot(s.x-p.x,s.y-p.y);if(d>PROBE_PULSE+400)continue;if(d<=PROBE_TOUCH||pulses.some(w=>Math.hypot(w.x-s.x,w.y-s.y)<=PROBE_PULSE))keepSonda(s);}
  for(const c of [...book().coords])if(Math.hypot(c.x-p.x,c.y-p.y)<=COORD_ARRIVE){const row=commit(q=>fulfilCoord(q,c.id,today()));if(row){const mark=r.universeMapState?.()?.book?.mark;if(mark&&mark.id===c.id)r.clearMapMark?.();if(words())r.toast?.('Coordenada cumplida',{level:2});}}
  if(shower){if(scene())endShower(true);else stepShower(p,pulses);}
  else if(!scene()&&!eclipse){showerClock+=step;if(showerClock>=meteorInterval(book().meteors.n))startShower();}
  stepEclipse(p,true);
 }
 // ---------- drawing ----------
 const at=(x,y)=>({x:x+r.W/2-r.camX,y:y+r.H/2-r.camY});
 const onScreen=(q,m=30)=>q.x>-m&&q.y>-m&&q.x<r.W+m&&q.y<r.H+m;
 // Visual 2 (alpha.254; docs/MUNDO.md, «Luz común»): the sky drawn with the shared kit. Light quality: the plain shapes
 // of before, no added light. Reduced motion: nothing new turns or moves.
 const light=()=>!!r.lightQuality?.();
 // A comet crystal: its coma of light and two tails (the ion tail, bluish and straight, and the dust tail, white and a
 // little apart) pointing away from the cube.
 function crystal(c,q,t){const k=reduced()?.8:.6+.4*Math.sin(t*3+q.x*.01);
  if(light()){c.globalAlpha=.35*k;c.strokeStyle=ICE;c.lineWidth=1;c.beginPath();c.moveTo(q.x+4,q.y-4);c.lineTo(q.x+16,q.y-14);c.stroke();}
  else{const a=Math.atan2(q.y-r.H/2,q.x-r.W/2)+Math.PI;glow(c,q.x,q.y,15,ICE,.32*k,true);streak(c,q.x,q.y,a,46,5,'#8fc8ff',.55*k);streak(c,q.x,q.y,a+.22,24,4,'#ffffff',.35*k);}
  c.globalAlpha=.95;c.fillStyle=ICE;c.beginPath();c.moveTo(q.x,q.y-6);c.lineTo(q.x+4,q.y);c.lineTo(q.x,q.y+6);c.lineTo(q.x-4,q.y);c.closePath();c.fill();c.globalAlpha=.9*k;c.fillStyle='#ffffff';c.fillRect(Math.round(q.x)-1,Math.round(q.y)-3,2,2);}
 // A lost probe, readable over a nebula: a dark disc behind it, a light outline, two framed panels with their cells and
 // a dish, drawn once (bake); its light blinks as an added glow.
 function probeArt(c){c.translate(17,13);c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.arc(0,0,10,0,TAU);c.fill();
  c.strokeStyle='#cfd3dc';c.lineWidth=1;c.beginPath();c.moveTo(-6,0);c.lineTo(-8,0);c.moveTo(6,0);c.lineTo(8,0);c.moveTo(1,-4);c.lineTo(3,-9);c.stroke();
  for(const side of [-1,1]){const x0=side<0?-16:8;c.fillStyle='#1d2433';c.fillRect(x0,-3.5,8,7);c.strokeStyle='#b9c6dc';c.strokeRect(x0+.5,-3,7,6);c.globalAlpha=.6;c.beginPath();c.moveTo(x0+4,-3);c.lineTo(x0+4,3);c.stroke();c.globalAlpha=1;}
  c.fillStyle='#2a2a31';c.fillRect(-6,-4,12,8);c.strokeStyle='#e4e6ec';c.lineWidth=1.2;c.strokeRect(-5.4,-3.4,10.8,6.8);c.fillStyle='#e4e6ec';c.fillRect(-3,-1,2,2);
  c.strokeStyle='#cfd3dc';c.lineWidth=1;c.beginPath();c.arc(3,-10,2.5,Math.PI*.15,Math.PI*.85,true);c.stroke();}
 function probe(c,q,t){const blink=reduced()?.7:(Math.sin(t*4)>.3?1:.15),s=bake('sonda',34,26,probeArt);
  if(!s){c.globalAlpha=.9;c.fillStyle='#55555c';c.fillRect(q.x-5,q.y-3,10,6);c.strokeStyle='#8a8a92';c.lineWidth=1;c.beginPath();c.moveTo(q.x,q.y-3);c.lineTo(q.x+3,q.y-10);c.moveTo(q.x-5,q.y);c.lineTo(q.x-10,q.y);c.moveTo(q.x+5,q.y);c.lineTo(q.x+10,q.y);c.stroke();}
  else{if(!light())glow(c,q.x,q.y,20,ICE,.16,true);c.globalAlpha=1;c.drawImage(s,q.x-17,q.y-13,34,26);}
  if(!light())glow(c,q.x+3,q.y-10,7,'#ffffff',.8*blink,true);c.globalAlpha=blink;c.fillStyle='#ffffff';c.fillRect(Math.round(q.x+3)-1,Math.round(q.y-10)-1,2,2);}
 // The eclipse's corona: a soft ring and eight thin rays of light, drawn once and turned slowly (still with reduced
 // motion); it shows as the planet covers the star, and past 70 % a diamond of light shines at the planet's edge.
 function coronaArt(c,w){const m=w/2,g=c.createRadialGradient(m,m,10,m,m,m);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(.3,'rgba(220,232,255,.22)');g.addColorStop(1,'rgba(220,232,255,0)');c.fillStyle=g;c.fillRect(0,0,w,w);
  c.translate(m,m);for(let i=0;i<8;i++){const len=m*(i%2?.62:.95),a=i*TAU/8;c.save();c.rotate(a);const v=c.createLinearGradient(12,0,len,0);v.addColorStop(0,'rgba(255,255,255,.3)');v.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=v;c.beginPath();c.moveTo(12,-1.2);c.lineTo(len,0);c.lineTo(12,1.2);c.closePath();c.fill();c.restore();}}
 function planetStar(c,s,q,f){const star={x:q.x,y:q.y},off=(f.u-.5)*ECLIPSE_TRAVEL,pl={x:q.x+Math.cos(s.side)*off,y:q.y+Math.sin(s.side)*off},cover=Math.max(0,1-Math.hypot(pl.x-star.x,pl.y-star.y)/26);
  c.globalAlpha=1;radial(c,star.x,star.y,36,'eclipse-star',[[.06,'rgba(255,255,255,.5)'],[1,'rgba(255,255,255,0)']],1-cover);
  const cor=cover>0?bake('corona',112,112,coronaArt):null;if(cor){const op=c.globalCompositeOperation;c.globalCompositeOperation='lighter';c.globalAlpha=(light()?.5:1)*Math.min(1,.12+.75*cover);c.save();c.translate(star.x,star.y);c.rotate(reduced()?0:clock*.05);c.drawImage(cor,-56,-56,112,112);c.restore();c.globalCompositeOperation=op;}
  c.globalAlpha=1;c.fillStyle='#ffffff';c.beginPath();c.arc(star.x,star.y,5,0,TAU);c.fill();
  if(onScreen(pl,30)){c.fillStyle='#000';c.beginPath();c.arc(pl.x,pl.y,14,0,TAU);c.fill();c.globalAlpha=.6;c.strokeStyle='#8a8a92';c.lineWidth=1;c.beginPath();c.arc(pl.x,pl.y,14,0,TAU);c.stroke();}
  if(cover>.7){c.globalAlpha=.5*cover;c.strokeStyle='#ffffff';c.beginPath();c.arc(star.x,star.y,15.5,0,TAU);c.stroke();
   if(!light()){const d=Math.hypot(star.x-pl.x,star.y-pl.y)||1,dx=(star.x-pl.x)/d,dy=(star.y-pl.y)/d;glow(c,star.x+dx*15,star.y+dy*15,11,'#ffffff',Math.min(1,(cover-.7)/.3)*.9,true);}}return cover;}
 // Coherencia T2: an offer to the one layer of arrows (scanner-arrows.js). A crystal and a probe are «?» (secret, heard).
 function edge(c,kind,o){const q=r.edgeOffer?.({key:kind+':'+(o.id??o.i),kind,x:o.x,y:o.y,shape:'estrella',ask:kind!=='eclipse'})||edgeSpot(r.W,r.H,o.x-r.camX,o.y-r.camY,22,104);return {x:Math.round(q.x),y:Math.round(q.y)};}
 function draw(){const out={comet:null,probe:null,edge:{},meteors:0,eclipse:null,dark:!!eclipse,shower:!!shower};if(!allowed()||!r.cx){drawn=out;return;}
  const c=r.cx,p=me(),t=performance.now()/1000,q=book(),still=paused();c.save();
  // The eclipse site: a star and its planet, and the darkness while it lasts.
  const site=eclipseNear(p,ECLIPSE_SEE);if(site){const s=at(site.x,site.y),f=eclipsePhase(site,sec());if(onScreen(s,60)){const cover=planetStar(c,site,s,f);out.eclipse={id:site.id,x:Math.round(s.x),y:Math.round(s.y),cover:Math.round(cover*100)/100,total:f.total};}
   else if(!scene()&&!still&&!busy())out.edge.eclipse=edge(c,'eclipse',site);}
  if(ok()){
   // A crystal glints at the screen's edge from COMET_GLINT (the nearest one), as the album's sounds do.
   let glint=null,gd=Infinity;for(const cr of COMETS){if(cometFound(q,cr.i))continue;const d=Math.hypot(cr.x-p.x,cr.y-p.y);if(d>COMET_GLINT)continue;const s=at(cr.x,cr.y);if(onScreen(s)){crystal(c,s,t);out.comet={i:cr.i,x:Math.round(s.x),y:Math.round(s.y)};}else if(d<gd){gd=d;glint=cr;}}
   if(glint&&!out.comet&&!scene()&&!still&&!busy())out.edge.cometa={...edge(c,'cometa',glint),i:glint.i};
   const near=nearestProbe(p,PROBE_HEAR);if(near){const s=at(near.probe.x,near.probe.y);if(onScreen(s)){probe(c,s,t);out.probe={i:near.probe.i,x:Math.round(s.x),y:Math.round(s.y)};}
    // Heard before seen: a «?» at the screen's edge, with the sound on too (coherencia T2: one mark for it).
    else if(!scene()&&!still&&!busy())out.edge.sonda=edge(c,'sonda',near.probe);}}
  if(shower){const age=clock-shower.start;for(const m of shower.meteors){const a=age-m.born;if(m.caught||a<0||a>METEOR_LIFE)continue;const hd=meteorHead(m,a),h=at(hd.x,hd.y),fade=Math.min(1,a/.3,(METEOR_LIFE-a)/.5);
    // A meteor: a head of light and a tail that fades back (one sprite, rotated); light quality: the two lines of before.
    if(light()){c.globalAlpha=.9*fade;c.strokeStyle='#ffffff';c.lineWidth=2;c.beginPath();c.moveTo(h.x,h.y);c.lineTo(h.x-m.dx*46,h.y-m.dy*46);c.stroke();c.globalAlpha=.35*fade;c.lineWidth=1;c.beginPath();c.moveTo(h.x-m.dx*46,h.y-m.dy*46);c.lineTo(h.x-m.dx*90,h.y-m.dy*90);c.stroke();}
    else{const a=Math.atan2(m.dy,m.dx);streak(c,h.x,h.y,a,96,5,'#dfe9ff',.85*fade);streak(c,h.x,h.y,a,40,3,'#ffffff',.9*fade);glow(c,h.x,h.y,11,'#ffffff',.75*fade,true);}
    c.globalAlpha=fade;c.fillStyle='#ffffff';c.fillRect(Math.round(h.x)-2,Math.round(h.y)-2,4,4);out.meteors++;}}
  for(const g of glows){const s=at(g.x,g.y),k=(clock-g.at)/1.3;if(!g.popped){g.popped=true;r.fxLayer?.pop(g.x,g.y,ICE,{gold:!!g.gold,size:.8,sparks:6});}c.globalAlpha=.8*(1-k);c.strokeStyle=g.gold?GOLD:'#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(s.x,s.y,reduced()?14:6+k*30,0,TAU);c.stroke();}
  if(eclipse){const a=clock-eclipse.start,k=Math.min(1,a/1.2,(eclipse.until-clock)/1.5);c.globalAlpha=Math.max(0,.32*k);c.fillStyle='#000';c.fillRect(0,0,r.W,r.H);}
  if(summary&&words()&&!scene()){c.globalAlpha=.92;c.fillStyle='#ffffff';c.textAlign='center';c.font='12px "Geist Mono", monospace';c.fillText(summary.text,r.W/2,Math.min(r.H-150,r.H/2+150),r.W-32);}
  c.restore();drawn=out;}
 // On the cube: the ornament of the fifty crystals, three small gold crystals going round it. The cube never grows.
 function drawCube(c,x,y,s,t){if(!r.S||!r.inWorld?.()||!ok()||!orbitOn(book()))return;c.save();const rad=Math.max(13,s*1.1)+5,turn=reduced()?0:t/2400;c.fillStyle=GOLD;c.globalAlpha=.95;
  for(let i=0;i<3;i++){const a=turn+i/3*TAU,px=Math.round(x+Math.cos(a)*rad),py=Math.round(y+Math.sin(a)*rad*.8);c.beginPath();c.moveTo(px,py-3);c.lineTo(px+2,py);c.lineTo(px,py+3);c.lineTo(px-2,py);c.closePath();c.fill();}c.restore();}
 // ---------- Tu cubo: the ornament, put on or taken off (secretos.js lists it beside the gold cube) ----------
 function toggleOrbit(){const q=book();if(!ok()||!orbitEarned(q))return false;const before=q.wear.orbit;if(before===false)delete q.wear.orbit;else q.wear.orbit=false;
  if(r.save?.()===false){if(before===false)q.wear.orbit=false;else delete q.wear.orbit;const h=$('cubeHint');if(h)h.textContent='No se guardó. Intenta otra vez.';}cubeKey='';return orbitOn(q);}
 const cubeOption=()=>{if(!r.S)return null;const q=book();if(!ok()||!orbitEarned(q))return null;return {id:'cubeSecretOrbit',label:'Órbita de cometa',title:'Juntaste los 50 cristales',on:orbitOn(q),toggle:toggleOrbit};};
 // ---------- the Bitácora (inside Secretos): what you found; nothing of the rest ----------
 function rows(){if(!r.S)return {html:'',found:0,total:SKY_PAGES.length};const q=book(),pages=skyPagesFound(q),p=me();let html='';
  if(pages.includes('meteoros'))html+=`<p class="secret-row" data-secret="meteoros"><span class="secret-name">Lluvia de estrellas</span> · ${q.meteors.caught} ${q.meteors.caught===1?'estrella cazada':'estrellas cazadas'}</p>`;
  if(pages.includes('cometas'))html+=`<p class="secret-row" data-secret="cometas"><span class="secret-name">Cristales de cometa</span> · ${cometCount(q)} de ${COMET_COUNT}${orbitEarned(q)?' <em class="sky-earned">Órbita de cometa</em>':''}</p>`;
  if(pages.includes('sondas')){html+=`<p class="secret-row" data-secret="sondas"><span class="secret-name">Sondas perdidas</span> · ${probeCount(q)} ${probeCount(q)===1?'encontrada':'encontradas'}</p>`;
   for(const c of q.coords)html+=`<p class="rumor-now" data-coord="${escape(c.id)}">Coordenada · ${escape(rumorNow(c,p))}</p>`;
   for(const c of q.coordsDone.slice(-3))html+=`<p class="rumor-now" data-coord-done="${escape(c.id)}">Coordenada cumplida</p>`;}
  if(pages.includes('eclipse'))html+=`<p class="secret-row" data-secret="eclipse"><span class="secret-name">Eclipse</span> · La música se oscureció un momento.</p>`;
  return {html,found:pages.length,total:SKY_PAGES.length};}
 // ---------- the map and tests ----------
 const forMap=()=>{if(!r.S)return [];const q=book();if(q.version!==SKY_SECRETS_VERSION)return [];return q.coords.map(c=>({id:c.id,x:c.x,y:c.y,name:'Coordenada secreta',text:'Una sonda guardaba esta coordenada.'}));};
 const busy=()=>!!shower||!!eclipse;
 Object.defineProperties(r,{
  skySecretTick:{get:()=>tick},drawSkySecrets:{get:()=>draw},drawSkySecretCube:{get:()=>drawCube},skySecretRows:{get:()=>rows},skySecretCubeOption:{get:()=>cubeOption},
  skySecretCoordsForMap:{get:()=>forMap},skySecretBusy:{get:()=>busy},
  // alpha.252 (tanda D, viaje-d.js): the eclipse now, where and which pass of the planet (its key), or null; nothing else.
  skyEclipse:{get:()=>()=>eclipse?{id:eclipse.id,x:eclipse.x,y:eclipse.y,key:lastCycle,left:Math.max(0,eclipse.until-clock)}:null},
  // Tests only (the runtime is never published): start a shower now, move the device's clock for the eclipses, the state.
  skySecretShower:{get:()=>()=>allowed()&&!scene()&&!shower&&ok()&&startShower()},
  skySecretSkip:{get:()=>seconds=>{offset+=Number(seconds)||0;return sec();}},
  skySecretState:{get:()=>()=>{const q=book();return {version:q.version,readOnly:!!q.readOnly,allowed:allowed(),book:structuredClone(q),comets:cometCount(q),probes:probeCount(q),pages:skyPagesFound(q),orbit:orbitOn(q),orbitEarned:orbitEarned(q),
   shower:shower?{n:shower.n,caught:shower.caught,age:clock-shower.start,meteors:shower.meteors.map(m=>({...m,head:meteorHead(m,clock-shower.start-m.born)}))}:null,showerClock,eclipse:eclipse?{...eclipse}:null,dark,notes,beeps,drawn,summary:summary?.text||'',now:sec(),world};}}
 });
}
