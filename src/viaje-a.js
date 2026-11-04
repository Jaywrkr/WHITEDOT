// Viaje lejos, tanda A (Jay, 4 Nov 2026, alpha.248; docs/MUNDO.md#lo-que-hay-más-lejos): the first band of things,
// 0–10 km from the origin, in the free World after the Journey, never in a chapter, a round, a finale, an activity or the
// Refugio. The rules are in viaje-a-model.js; the bands (notices and the Bitácora page) in bandas.js.
// · Interruptor de reto: touching a loose switch starts a 30 s challenge, drawn on the world with no menu.
// · Radar de ritmo: a post that counts your run of pulses on time as you pass and keeps your record.
// · Pelota de luz: a ball kicked by the pulse that bounces in the chord; a goal between two rocks is a small party.
// · Bengala: Menú › Más › «Lanzar bengala» sends a light up where you stand; seen from far, heard from its side.
// · Tablón de encargos: by every rest satellite, three orders of creatures for today.
// One scene at a time: a challenge is a scene (r.bandAttach busy); nothing starts while an encounter, a figure, a mischief
// scene or a sky's secret plays. Sparks only by universeReward, once a day per thing. The music is untouched: the notes
// play on top, on the grid, far under it.
import {openSurface,prefersReducedMotion} from './frame-state.js';
import {freeOpen} from './journey-mode.js';
import {creditSparks} from './sparks-model.js';
import {SOUND_TRIM,edgeSpot,worldKey,rumorNow} from './descubrir-model.js';
import {nearestSatellite} from './recorrer-model.js';
import {scaleNote} from './secretos-model.js';
import {VIAJE_A_VERSION,EDGE_REACH,switchesNear,radarsNear,ballsNear,switchKind,SWITCH_TOUCH,SWITCH_PULSE,RETO_SECONDS,RETO_LEAVE,retoRings,retoLights,ringDone,lightDone,retoReward,
 RADAR_ZONE,RADAR_OUT,radarPulse,radarReward,BALL_R,KICK_REACH,NUDGE_REACH,NUDGE_SPEED,BALL_LEASH,ROCK_R,PARTY_SECONDS,BOUNCE_GAP,goalFor,kick,stepBall,crossedGoal,goalReward,
 FLARE_ARRIVE,FLARE_AWAY,FLARE_HEAR,FLARE_EVERY,FLARE_RISE,FLARE_HEIGHT,flareLoudness,flarePan,boardFor,BOARD_READ,BOARD_TAKE,ORDER_MAX,ordersFor,ORDER_DO,orderDone,orderReward,
 normalizeViajeA,viajeReadOnly,switchPaysToday,noteReto,noteRadar,radarRecord,radarBest,noteGoal,setFlare,takeOrders,finishOrder,
 RETO_INSTRUMENT,RADAR_INSTRUMENT,BALL_INSTRUMENT,FLARE_INSTRUMENT,RETO_GAIN,RADAR_GAIN,BALL_GAIN,GOAL_GAIN,FLARE_GAIN,retoDegree,WIN_DEGREES,GOAL_DEGREES,FLARE_DEGREES} from './viaje-a-model.js';
const TAU=Math.PI*2,GOLD='#f0d27a',ROCK='#6a6a72';
const clockText=s=>{const k=Math.max(0,Math.ceil(s));return `0:${String(Math.min(59,k)).padStart(2,'0')}`;};
// Notes on the grid, far under the music, in an instrument of the album of sounds at its measured trim. chord: the
// degrees are steps of the chord that sounds (r.chordTones) instead of the place's scale. pan: heard from a side.
// Returns how many were sent.
export function playViajeNotes(r,kind,degrees,start,{instrument=RETO_INSTRUMENT,gain=RETO_GAIN,spacing=1,octave=1,chord=false,pan=0}={}){if(!r.S?.sound||r.ac?.state!=='running')return 0;
 const d=r.regionOfPos?.(r.S.wx,r.S.wy),scale=r.MU?.dnaA?.scale||d?.scale,tonic=57+(r.MU?.tr||0)+12*octave,step=(r.SIX||.125)*spacing,tones=chord?(r.chordTones?.()||[]):[];let n=0;
 degrees.forEach((degree,k)=>{let note=scaleNote(scale,tonic,degree);if(chord&&tones.length){note=tones[((degree%3)+3)%3]+12*octave;while(note>96)note-=12;while(note<36)note+=12;}
  const at=start+k*step,emit=()=>{r.hookInst(instrument,note,at,r.vel(gain*(SOUND_TRIM[instrument]??1)),d);r.viajeAudioCue?.({kind,instrument,note,time:at,gain,six:r.SIX,pan});};
  const voiced=()=>r.withVoiceOrigin?r.withVoiceOrigin('player',emit):emit();if(pan&&r.withPan)r.withPan(pan,voiced);else voiced();n++;});return n;}
export function initialize(r){
 const $=id=>r.$?.(id)||globalThis.document?.getElementById(id)||null;
 let owner=null,world='',clock=0,seen=new WeakSet(),reto=null,rest=null,radar=null,balls=new Map(),glows=[],summary=null,drawn={},notes=0,flareAt=-Infinity,lastBar=-1,bars=0,flareBeeps=0,buttonAt=-1,lastBounce=-Infinity,saidBoard='';
 const reduced=()=>!!(r.S?.reducedMotion||prefersReducedMotion());
 const allowed=()=>!!r.S&&r.inWorld?.()&&(r.S.layer||'superficie')==='superficie'&&freeOpen(r.S.journey)&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!r.houseActive?.()&&!r.travelInLevel?.()&&!r.placeRun?.()&&!r.placeCardDue?.()&&!r.songStageState?.()?.running&&!r.journeyFinaleState?.()?.running;
 const paused=()=>globalThis.document?.hidden||!!r.scanning||!!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 // Another scene plays (a living encounter, a figure, a mischief scene that moves on, a sky's secret, another batch's).
 const scene=()=>!!r.liveEncounterActive?.()||!!r.skyMapActive?.()||!!(r.mischiefBusy?r.mischiefBusy():r.mischiefState?.scene)||!!r.skySecretBusy?.()||!!r.bandBusy?.('A');
 const words=()=>r.S.universeTexts!==false;
 // The save (S.viajeA), normalised once per save; a later version is only read.
 function book(){if(owner!==r.S){owner=r.S;owner.viajeA=normalizeViajeA(owner.viajeA);reto=null;rest=null;radar=null;balls=new Map();glows=[];summary=null;}world=worldKey(r.worldIdentity);return owner.viajeA;}
 const ok=()=>book().version===VIAJE_A_VERSION&&!viajeReadOnly(book());
 const me=()=>({x:r.S.wx,y:r.S.wy});
 const today=()=>r.S.todayKey||'';
 const soon=fn=>{const state=r.S;if(state.sound&&r.ac?.state==='running'&&r.beatSoon)r.beatSoon(time=>{if(state===r.S)fn(time);},null,'player');};
 const sing=(kind,degrees,opts)=>soon(time=>{notes+=playViajeNotes(r,kind,degrees,time,opts);});
 // Away from the eleven portals and the ring's centre: nothing of this batch stands on them.
 const clear=s=>{const c=r.ringState?.()?.center;if(c&&Math.hypot(s.x-c.x,s.y-c.y)<600)return false;for(const q of r.ringPortals?.()||[])if(Math.hypot(s.x-q.x,s.y-q.y)<500)return false;return true;};
 // A change kept or nothing: a failed save puts the save (and the sparks) back as they were.
 function commit(change){const S=r.S,before={v:structuredClone(book()),sparks:S.sparks,economy:S.sparkEconomy?structuredClone(S.sparkEconomy):undefined};const out=change(book());if(!out)return null;
  if(r.save?.()===false){S.viajeA=before.v;S.sparks=before.sparks;if(before.economy!==undefined)S.sparkEconomy=before.economy;owner=null;book();return null;}if(!$('mJournal')?.hidden)r.refreshJournal?.();return out;}
 // Sparks by the universe's rule, inside a commit: credited and written in the economy's log. Returns what was credited.
 function pay(title,amount){const economy=r.S.sparkEconomy;if(!(amount>0)||!economy||economy.version!==1)return 0;const n=creditSparks(r.S,amount);economy.log.push({title,text:`${title} · +${n} chispas`,at:today()});economy.log=economy.log.slice(-80);return n;}
 // ---------- the challenge of a switch ----------
 function startReto(s){const kind=switchKind(s),targets=kind==='luces'?retoLights(s):retoRings(s);reto={id:s.id,kind,x:s.x,y:s.y,start:clock,targets:targets.map(t=>({...t,done:false,onTime:false})),done:0,sound:!!r.S.sound};
  for(const w of r.waves||[])seen.add(w);glows.push({x:s.x,y:s.y,at:clock});sing('reto',[0,4],{instrument:RETO_INSTRUMENT,gain:RETO_GAIN,spacing:2});
  if(words())r.toast?.(kind==='luces'?'Reto · Recoge las luces.':r.S.sound?'Reto · Pulsa a tiempo en cada aro.':'Reto · Pasa por cada aro.',{level:2,ttl:3000});return true;}
 function endReto(){const g=reto;reto=null;if(!g)return;rest=g.id;const total=g.targets.length,onTime=g.kind==='aros'&&g.sound&&g.done===total&&g.targets.every(t=>t.onTime);let amount=0;
  const res=commit(q=>{const pays=g.done>0&&switchPaysToday(q,g.id,today());if(pays)amount=pay('Reto',retoReward(g.done,total,{x:g.x,y:g.y,onTime}));return noteReto(q,g.id,g.done,total,today(),amount);});
  if(!res)amount=0;if(amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});if(res?.won)sing('reto',WIN_DEGREES,{instrument:RETO_INSTRUMENT,gain:RETO_GAIN,spacing:2});
  summary={text:`Reto · ${g.done} de ${total}${amount?' · +'+amount+' ✦':''}`,until:clock+3.2};}
 function stepReto(p,pulses){const g=reto;if(clock-g.start>=RETO_SECONDS||Math.hypot(p.x-g.x,p.y-g.y)>RETO_LEAVE){endReto();return;}
  // Rings in their order (the next one only); lights in any order.
  const open=g.kind==='aros'?g.targets.filter(t=>!t.done).slice(0,1):g.targets.filter(t=>!t.done);
  for(const t of open){const got=g.kind==='aros'?ringDone(t,p,pulses,g.sound):lightDone(t,p,pulses);if(!got)continue;t.done=true;t.onTime=got.onTime;g.done++;glows.push({x:t.x,y:t.y,at:clock});sing('reto',[retoDegree(g.done-1)],{instrument:RETO_INSTRUMENT,gain:RETO_GAIN});}
  if(g.done>=g.targets.length)endReto();}
 // ---------- the radar ----------
 function endRadar(){const run=radar;radar=null;if(!run||!(run.best>0))return;let amount=0;
  const res=commit(q=>{const n=noteRadar(q,run.id,run.best,today());if(n?.pays){amount=pay('Radar de ritmo',radarReward({x:run.x,y:run.y}));q.earned+=amount;}return n;});
  if(!res)return;if(amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});
  summary={text:`Radar de ritmo · racha ${run.best}`+(res.record?' · ¡récord!':` · récord ${res.before}`)+(amount?` · +${amount} ✦`:''),until:clock+3.4};}
 function stepRadar(p,pulses){const site=radarsNear(world,p,RADAR_OUT).find(clear);
  if(radar&&(!site||site.id!==radar.id||site.d>RADAR_OUT)){endRadar();}
  if(!site||site.d>RADAR_ZONE||!r.S.sound)return;if(!radar)radar={id:site.id,x:site.x,y:site.y,cur:0,best:0,record:radarRecord(book(),site.id)};
  for(const w of pulses){if(Math.hypot(w.x-site.x,w.y-site.y)>RADAR_ZONE)continue;const next=radarPulse(radar,w.beat);radar.cur=next.cur;radar.best=next.best;if(w.beat)sing('radar',[4+Math.min(7,radar.cur)],{instrument:RADAR_INSTRUMENT,gain:RADAR_GAIN,octave:1});}}
 // ---------- the balls ----------
 function ballFor(s){let b=balls.get(s.id);if(!b){b={id:s.id,home:{x:s.x,y:s.y},x:s.x,y:s.y,vx:0,vy:0,goal:goalFor(s),onTime:false,party:null,back:null};balls.set(s.id,b);}return b;}
 function goal(b){b.party={at:clock,x:b.goal.x,y:b.goal.y};b.vx*=.3;b.vy*=.3;let amount=0;
  const res=commit(q=>{const n=noteGoal(q,b.id,today());if(n?.pays){amount=pay('Gol',goalReward({x:b.home.x,y:b.home.y,onTime:b.onTime}));q.earned+=amount;}return n;});
  if(res&&amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});sing('gol',GOAL_DEGREES,{instrument:BALL_INSTRUMENT,gain:GOAL_GAIN});
  summary={text:`¡Gol!${amount?' · +'+amount+' ✦':''}`,until:clock+2.6};}
 function stepBalls(p,pulses,dt){const quiet=scene();
  for(const s of ballsNear(world,p,2600))if(clear(s))ballFor(s);
  for(const [id,b] of balls){if(Math.hypot(b.home.x-p.x,b.home.y-p.y)>3600){balls.delete(id);continue;}
   if(b.party&&clock-b.party.at>PARTY_SECONDS){b.party=null;b.back={at:clock};}
   if(b.back){if(clock-b.back.at>.8){b.x=b.home.x;b.y=b.home.y;b.vx=b.vy=0;b.back=null;}continue;}
   for(const w of pulses){const v=kick(b,w);if(!v)continue;b.vx=v.vx;b.vy=v.vy;b.onTime=!!w.beat;if(!quiet)sing('pelota',[0],{instrument:BALL_INSTRUMENT,gain:BALL_GAIN,chord:true});}
   const near=Math.hypot(b.x-p.x,b.y-p.y);if(near<NUDGE_REACH+BALL_R&&Math.hypot(b.vx,b.vy)<NUDGE_SPEED*.6){const v=kick(b,p,NUDGE_REACH+BALL_R+1,NUDGE_SPEED);if(v){b.vx=v.vx;b.vy=v.vy;b.onTime=false;}}
   for(let k=0;k<2;k++){const a={x:b.x,y:b.y},res=stepBall(b,dt/2,b.goal.rocks);
    if(res.bounced&&clock-lastBounce>BOUNCE_GAP&&!quiet){lastBounce=clock;sing('pelota',[1+(Math.round(clock*4)%2)],{instrument:BALL_INSTRUMENT,gain:BALL_GAIN*.7,chord:true});}
    if(!b.party&&crossedGoal(a,b,b.goal)){goal(b);break;}}
   // Too far from home and still: it rolls home by itself.
   if(!b.party&&Math.hypot(b.x-b.home.x,b.y-b.home.y)>BALL_LEASH&&!b.vx&&!b.vy)b.back={at:clock};}}
 // ---------- the flare ----------
 const flare=()=>{const f=book().flare;return f&&f.w===world?f:null;};
 function launch(){if(!allowed()||!ok()||!r.S)return false;const p=me(),res=commit(q=>setFlare(q,p,world,today()));if(!res)return false;flareAt=clock;glows.push({x:p.x,y:p.y,at:clock});
  sing('bengala',FLARE_DEGREES,{instrument:FLARE_INSTRUMENT,gain:FLARE_GAIN*2,spacing:2,octave:1});if(words())r.toast?.('Bengala · Vuelve cuando quieras.',{level:2,ttl:3000});return true;}
 function stepFlare(p){const f=flare();if(!f)return;const d=Math.hypot(f.x-p.x,f.y-p.y);if(d>FLARE_AWAY&&!f.away){f.away=true;}
  if(f.away&&d<=FLARE_ARRIVE){const res=commit(q=>{q.flare=null;return true;});if(res){glows.push({x:f.x,y:f.y,at:clock});summary={text:'Volviste a tu bengala',until:clock+3};const mark=r.universeMapState?.()?.book?.mark;if(mark&&mark.id==='bengala')r.clearMapMark?.();}}}
 // Heard from its side: two high notes every FLARE_EVERY bars of the music (MU.sq), softer from further.
 function onBar(t){bars++;if(bars%FLARE_EVERY||!r.S?.sound||r.ac?.state!=='running'||!allowed()||paused()||scene()||reto||!ok())return;const f=flare();if(!f)return;const p=me(),d=Math.hypot(f.x-p.x,f.y-p.y);if(d<=FLARE_ARRIVE||d>FLARE_HEAR)return;
  notes+=playViajeNotes(r,'bengala',FLARE_DEGREES,t,{instrument:FLARE_INSTRUMENT,gain:FLARE_GAIN*flareLoudness(d),spacing:2,octave:1,pan:flarePan(f.x-p.x,d)});flareBeeps++;}
 setInterval(()=>{try{const sq=r.MU?.sq,ac=r.ac;if(!ac||!sq?.length)return;for(const e of sq){if(e.s!==0||!(e.t>lastBar+1e-4))continue;lastBar=e.t;if(e.t>=ac.currentTime-.01)onBar(e.t);}}catch(_){}},50);
 // ---------- the board of orders ----------
 const look=()=>({sonido:()=>Object.values(r.S.soundAlbum?.sounds||{}).reduce((a,e)=>a+(Number(e?.count)||0),0),encuentro:()=>Number(r.S.liveEncounters?.caught)||0,reto:()=>book().retos.won});
 const boardNow=p=>{const sat=nearestSatellite(world,p);return sat?boardFor(world,sat):null;};
 function stepBoard(p){const b=boardNow(p);if(!b||Math.hypot(b.x-p.x,b.y-p.y)>BOARD_TAKE)return;const list=ordersFor(world,b,today()),fresh=list.filter(o=>!book().taken.includes(o.id));if(!fresh.length)return;
  if(book().orders.length>=ORDER_MAX){if(saidBoard!==b.id+today()&&words()){saidBoard=b.id+today();r.toast?.('Tablón · Ya llevas seis encargos.',{level:2});}return;}
  const got=commit(q=>{const t=takeOrders(q,fresh,look());return t.length?t:null;});if(got&&words())r.toast?.(`<em>Tablón de encargos</em> · ${got.length} ${got.length===1?'encargo':'encargos'}`,{level:2});}
 function stepOrders(p){const L=look();for(const o of [...book().orders]){if(!orderDone(o,L,p))continue;let amount=0;const row=commit(q=>{const reward=pay('Encargo',orderReward(o));amount=reward;return finishOrder(q,o.id,reward);});
  if(!row)continue;if(amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});sing('encargo',WIN_DEGREES,{instrument:RETO_INSTRUMENT,gain:RETO_GAIN,spacing:2});
  if(o.kind==='sitio'){const mark=r.universeMapState?.()?.book?.mark;if(mark&&mark.id==='encargo:'+o.id)r.clearMapMark?.();}
  if(words())r.toast?.(`Encargo cumplido · ${o.who} da las gracias`+(amount?` · +${amount} ✦`:''),{level:2,category:'ganado'});}}
 // ---------- the frame ----------
 function syncButton(){const b=$('bFlare');if(!b)return;const show=allowed()&&ok();if(b.hidden===show)b.hidden=!show;}
 function tick(dt,modal=false){
  if(!r.S)return;book();if(clock-buttonAt>.4||clock<buttonAt){buttonAt=clock;syncButton();}
  if(!allowed()){if(reto)endReto();radar=null;summary=null;clock+=Math.max(0,Math.min(.05,dt||0));return;}
  if(modal||paused())return;
  const step=Math.max(0,Math.min(.05,dt||0));clock+=step;if(summary&&clock>summary.until)summary=null;glows=glows.filter(g=>clock-g.at<1.3);
  const p=me(),pulses=[];for(const w of r.waves||[])if(!seen.has(w)){seen.add(w);if(w.origin==='player')pulses.push({x:w.x,y:w.y,beat:!!w.beat});}
  if(!ok())return;
  stepFlare(p);
  if(reto){if(scene())endReto();else stepReto(p,pulses);}
  else{if(rest){const s=switchesNear(world,p,SWITCH_PULSE*2).find(x=>x.id===rest);if(!s)rest=null;}
   if(!scene())for(const s of switchesNear(world,p,SWITCH_PULSE+200)){if(s.id===rest||!clear(s))continue;if(s.d<=SWITCH_TOUCH||pulses.some(w=>Math.hypot(w.x-s.x,w.y-s.y)<=SWITCH_PULSE)){startReto(s);break;}}}
  if(!scene()&&!reto)stepRadar(p,pulses);else if(radar)endRadar();
  stepBalls(p,pulses,step);
  if(!scene())stepBoard(p);stepOrders(p);
 }
 // ---------- drawing ----------
 const at=(x,y)=>({x:x+r.W/2-r.camX,y:y+r.H/2-r.camY});
 const onScreen=(q,m=30)=>q.x>-m&&q.y>-m&&q.x<r.W+m&&q.y<r.H+m;
 const say=(c,t,x,y,max=r.W-32)=>{c.fillText(t,Math.max(16+Math.min(max,c.measureText(t).width)/2,Math.min(r.W-16-Math.min(max,c.measureText(t).width)/2,x)),y,max);};
 function drawSwitch(c,q,kind,spent){c.globalAlpha=spent?.45:.95;c.fillStyle='#000';c.strokeStyle='#ffffff';c.lineWidth=1.5;c.fillRect(q.x-6,q.y-6,12,12);c.strokeRect(q.x-6,q.y-6,12,12);c.fillStyle='#ffffff';
  if(kind==='luces')for(const [dx,dy] of [[-2,-2],[2,-2],[-2,2],[2,2]])c.fillRect(Math.round(q.x+dx)-1,Math.round(q.y+dy)-1,2,2);else{c.beginPath();c.arc(q.x,q.y,2.5,0,TAU);c.fill();}
  if(!spent&&!reduced()){c.globalAlpha=.3*(.6+.4*Math.sin(clock*3));c.beginPath();c.arc(q.x,q.y,11,0,TAU);c.stroke();}}
 function drawRadar(c,q,inside){c.globalAlpha=.9;c.strokeStyle='#ffffff';c.fillStyle='#ffffff';c.lineWidth=1;c.beginPath();c.moveTo(q.x,q.y+10);c.lineTo(q.x,q.y-4);c.stroke();c.fillStyle='#000';c.fillRect(q.x-5,q.y-9,10,6);c.strokeRect(q.x-5,q.y-9,10,6);
  c.fillStyle='#ffffff';c.fillRect(Math.round(q.x)-1,Math.round(q.y-7),2,2);for(const k of [1,2]){c.globalAlpha=(inside?.7:.35)/k;c.beginPath();c.arc(q.x,q.y-6,6+k*4,-Math.PI*.8,-Math.PI*.2);c.stroke();}
  c.globalAlpha=inside?.35:.14;c.setLineDash([3,6]);c.beginPath();c.arc(q.x,q.y,RADAR_ZONE,0,TAU);c.stroke();c.setLineDash([]);}
 function drawRock(c,q,seed){c.globalAlpha=.95;c.fillStyle=ROCK;c.beginPath();for(let k=0;k<7;k++){const a=k/7*TAU,rad=ROCK_R*(.8+.2*Math.sin(seed+k*1.7));c.lineTo(q.x+Math.cos(a)*rad,q.y+Math.sin(a)*rad);}c.closePath();c.fill();c.fillStyle='#4a4a52';c.beginPath();c.arc(q.x-5,q.y-3,4,0,TAU);c.fill();}
 function drawBall(c,b,t){const q=at(b.x,b.y),fade=b.back?Math.max(0,1-(clock-b.back.at)/.8):1;const g=c.createRadialGradient(q.x,q.y,1,q.x,q.y,BALL_R*2.6);g.addColorStop(0,`rgba(255,255,255,${.45*fade})`);g.addColorStop(1,'rgba(255,255,255,0)');
  c.globalAlpha=1;c.fillStyle=g;c.fillRect(q.x-BALL_R*2.6,q.y-BALL_R*2.6,BALL_R*5.2,BALL_R*5.2);c.globalAlpha=fade;c.fillStyle='#ffffff';c.beginPath();c.arc(q.x,q.y,BALL_R,0,TAU);c.fill();
  c.globalAlpha=.5*fade;c.fillStyle='#000';const spin=reduced()?0:(b.x+b.y)/14;c.fillRect(Math.round(q.x+Math.cos(spin)*3)-1,Math.round(q.y+Math.sin(spin)*3)-1,2,2);return q;}
 function drawParty(c,b){const k=(clock-b.party.at)/PARTY_SECONDS,q=at(b.party.x,b.party.y);for(let i=0;i<14;i++){const a=i/14*TAU+(i%2)*.2,rad=(reduced()?24:10+k*70)*(.7+.3*((i*7)%5)/4);c.globalAlpha=Math.max(0,.95*(1-k));c.fillStyle=i%3?'#ffffff':GOLD;c.fillRect(Math.round(q.x+Math.cos(a)*rad)-1.5,Math.round(q.y+Math.sin(a)*rad-k*14)-1.5,3,3);}}
 function drawBoard(c,q,lit){c.globalAlpha=.95;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.moveTo(q.x-6,q.y+5);c.lineTo(q.x-6,q.y+12);c.moveTo(q.x+6,q.y+5);c.lineTo(q.x+6,q.y+12);c.stroke();c.fillStyle='#000';c.fillRect(q.x-9,q.y-7,18,12);c.lineWidth=1.5;c.strokeRect(q.x-9,q.y-7,18,12);
  c.globalAlpha=lit?.95:.6;c.fillStyle='#ffffff';for(let k=0;k<3;k++)c.fillRect(Math.round(q.x-6),Math.round(q.y-4+k*3),k===1?8:11,1);}
 function drawFlare(c,f){const q=at(f.x,f.y),rise=Math.min(1,(clock-flareAt)/FLARE_RISE),h=FLARE_HEIGHT*(flareAt>-Infinity&&f===flare()&&rise<1?rise:1),top={x:q.x,y:q.y-h},pulse=reduced()?1:.75+.25*Math.sin(clock*4);
  c.globalAlpha=.35;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.moveTo(q.x,q.y);c.lineTo(top.x,top.y);c.stroke();
  const g=c.createRadialGradient(top.x,top.y,1,top.x,top.y,22);g.addColorStop(0,`rgba(255,255,255,${.55*pulse})`);g.addColorStop(1,'rgba(255,255,255,0)');c.globalAlpha=1;c.fillStyle=g;c.fillRect(top.x-22,top.y-22,44,44);
  c.fillStyle='#ffffff';c.beginPath();c.arc(top.x,top.y,3,0,TAU);c.fill();c.globalAlpha=.6;c.fillRect(Math.round(q.x)-1.5,Math.round(q.y)-1.5,3,3);return {x:Math.round(top.x),y:Math.round(top.y)};}
 function edge(c,kind,o,p){const q=edgeSpot(r.W,r.H,o.x-r.camX,o.y-r.camY,22,104),x=Math.round(q.x),y=Math.round(q.y);c.globalAlpha=.7;c.strokeStyle='#ffffff';c.fillStyle='#ffffff';c.lineWidth=1.5;
  if(kind==='interruptor'){c.strokeRect(x-3,y-3,6,6);c.fillRect(x-1,y-1,2,2);}else if(kind==='radar'){c.beginPath();c.moveTo(x,y+4);c.lineTo(x,y-2);c.stroke();c.beginPath();c.arc(x,y-2,4,-Math.PI*.8,-Math.PI*.2);c.stroke();}
  else if(kind==='pelota'){c.beginPath();c.arc(x,y,3.5,0,TAU);c.fill();}else if(kind==='tablon'){c.strokeRect(x-4,y-3,8,6);}
  // The flare: a small burst (a buoy's mark is a post and a dot), with how far it is.
  else{c.beginPath();c.arc(x,y,2.5,0,TAU);c.fill();c.lineWidth=1;c.beginPath();for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){c.moveTo(x+dx*4.5,y+dy*4.5);c.lineTo(x+dx*7.5,y+dy*7.5);}c.stroke();c.globalAlpha=.7;c.font='10px "Geist Mono", monospace';c.textAlign='center';const d=Math.hypot(o.x-p.x,o.y-p.y)/10000;c.fillText(d<1?`${Math.round(d*1000)} m`:`${Math.round(d)} km`,x+(q.x>r.W/2?-22:22),y+3);}
  return {x,y,id:o.id||kind};}
 function draw(){const out={switch:null,radar:null,balls:[],board:null,flare:null,edge:{},reto:null,targets:0};if(!allowed()||!r.cx||!ok()){drawn=out;return;}
  const c=r.cx,p=me(),t=performance.now()/1000,q=book(),still=paused(),quiet=scene();c.save();c.textAlign='center';
  const mark=[];
  // Switches: the nearest ones; spent for sparks today, dimmer.
  for(const s of switchesNear(world,p,EDGE_REACH)){if(!clear(s))continue;const sp=at(s.x,s.y),spent=!switchPaysToday(q,s.id,today());if(onScreen(sp)){drawSwitch(c,sp,switchKind(s),spent);out.switch=out.switch||{id:s.id,kind:switchKind(s),x:Math.round(sp.x),y:Math.round(sp.y)};}else if(!spent&&!reto)mark.push({kind:'interruptor',o:s,d:s.d});}
  for(const s of radarsNear(world,p,EDGE_REACH)){if(!clear(s))continue;const sp=at(s.x,s.y);if(onScreen(sp,RADAR_ZONE)){drawRadar(c,sp,!!radar&&radar.id===s.id);if(onScreen(sp))out.radar=out.radar||{id:s.id,x:Math.round(sp.x),y:Math.round(sp.y)};}else mark.push({kind:'radar',o:s,d:s.d});}
  for(const b of balls.values()){const g=b.goal;for(const [k,rk] of g.rocks.entries()){const sp=at(rk.x,rk.y);if(onScreen(sp))drawRock(c,sp,k*3+g.a);}
   const a=at(g.rocks[0].x,g.rocks[0].y),z=at(g.rocks[1].x,g.rocks[1].y);if(onScreen(a,80)||onScreen(z,80)){c.globalAlpha=.25;c.strokeStyle='#ffffff';c.setLineDash([2,5]);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(z.x,z.y);c.stroke();c.setLineDash([]);}
   const sp=at(b.x,b.y);if(onScreen(sp)){drawBall(c,b,t);out.balls.push({id:b.id,x:Math.round(sp.x),y:Math.round(sp.y)});}else if(Math.hypot(b.x-p.x,b.y-p.y)<=EDGE_REACH)mark.push({kind:'pelota',o:b,d:Math.hypot(b.x-p.x,b.y-p.y)});
   if(b.party)drawParty(c,b);}
  // The board by the nearest satellite.
  const bd=boardNow(p);if(bd){const sp=at(bd.x,bd.y),d=Math.hypot(bd.x-p.x,bd.y-p.y);if(onScreen(sp)){drawBoard(c,sp,d<=BOARD_READ);out.board={id:bd.id,x:Math.round(sp.x),y:Math.round(sp.y)};}else if(d<=EDGE_REACH&&ordersFor(world,bd,today()).some(o=>!q.taken.includes(o.id)))mark.push({kind:'tablon',o:bd,d});
   if(d<=BOARD_READ&&words()&&!quiet){const list=ordersFor(world,bd,today()),openIds=new Set(q.orders.map(o=>o.id)),y0=Math.min(r.H-190,r.H/2+96);c.fillStyle='#ffffff';c.globalAlpha=1;c.font='12px "Geist Mono", monospace';say(c,'Tablón de encargos',r.W/2,y0);c.font='11px "Geist Mono", monospace';
    list.forEach((o,k)=>{const done=q.taken.includes(o.id)&&!openIds.has(o.id),open=openIds.has(o.id);c.globalAlpha=done?.5:open?.95:.6;say(c,done?`Hecho · ${o.text}`:o.text,r.W/2,y0+18+k*30);if(open){c.globalAlpha=.6;say(c,ORDER_DO[o.kind],r.W/2,y0+32+k*30);}});out.boardText=list.length;}}
  // The challenge: its targets on the world and its clock above.
  if(reto){const next=reto.kind==='aros'?reto.targets.find(x=>!x.done):null;for(const g of reto.targets){if(g.done)continue;const sp=at(g.x,g.y);out.targets++;
    if(reto.kind==='aros'){const first=g===next;c.globalAlpha=first?.95:.25;c.strokeStyle='#ffffff';c.lineWidth=first?2:1;c.beginPath();c.arc(sp.x,sp.y,first&&!reduced()?28+2*Math.sin(clock*6):28,0,TAU);c.stroke();if(first&&!onScreen(sp,-8))edge(c,'interruptor',g,p);}
    else{c.globalAlpha=.95;c.fillStyle='#ffffff';c.beginPath();c.arc(sp.x,sp.y,3.5,0,TAU);c.fill();c.globalAlpha=.3;c.beginPath();c.arc(sp.x,sp.y,8,0,TAU);c.fill();}}
   out.reto={kind:reto.kind,done:reto.done,total:reto.targets.length,left:Math.max(0,RETO_SECONDS-(clock-reto.start))};
   if(words()){c.globalAlpha=1;c.fillStyle='#ffffff';c.font='12px "Geist Mono", monospace';say(c,`Reto · ${clockText(RETO_SECONDS-(clock-reto.start))} · ${reto.done} de ${reto.targets.length}`,r.W/2,Math.max(196,r.H/2-152));}}
  // The radar you are in: your run and its record.
  if(radar&&words()&&!quiet){const sp=at(radar.x,radar.y);c.globalAlpha=1;c.fillStyle='#ffffff';c.font='13px "Geist Mono", monospace';say(c,String(radar.cur),sp.x,sp.y-22);c.globalAlpha=.7;c.font='10px "Geist Mono", monospace';say(c,`Récord · ${Math.max(radar.record,radar.best)}`,sp.x,sp.y-36);out.radarRun={cur:radar.cur,best:radar.best};}
  else if(!r.S.sound&&words()&&!quiet){const s=radarsNear(world,p,RADAR_ZONE).find(clear);if(s){const sp=at(s.x,s.y);c.globalAlpha=.7;c.fillStyle='#ffffff';c.font='10px "Geist Mono", monospace';say(c,'Radar de ritmo · con sonido',sp.x,sp.y-24);}}
  // The flare: its light, and its mark at the screen's edge from anywhere.
  const f=flare();if(f){const sp=at(f.x,f.y);if(onScreen({x:sp.x,y:sp.y-FLARE_HEIGHT/2},40)){out.flare=drawFlare(c,f);}else if(!still)out.edge.bengala=edge(c,'bengala',f,p);}
  // One mark at the edge for the nearest thing of the band, never during a scene.
  if(!quiet&&!still&&!reto&&!r.skySecretBusy?.()){mark.sort((a,b)=>a.d-b.d);const m=mark[0];if(m)out.edge[m.kind]=edge(c,m.kind,m.o,p);}
  for(const g of glows){const sp=at(g.x,g.y),k=(clock-g.at)/1.3;c.globalAlpha=.8*(1-k);c.strokeStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(sp.x,sp.y,reduced()?14:6+k*30,0,TAU);c.stroke();}
  if(summary&&words()&&!quiet){c.globalAlpha=.92;c.fillStyle='#ffffff';c.font='12px "Geist Mono", monospace';c.fillText(summary.text,r.W/2,Math.min(r.H-150,r.H/2+150),r.W-32);}
  c.restore();drawn=out;}
 // ---------- the Bitácora lines and the map ----------
 const plural=(n,one,many)=>`${n} ${n===1?one:many}`;
 const lines={
  bengala:()=>{const f=flare();return f?`Encendida · ${rumorNow(f,me())}`:'';},
  interruptor:()=>{const g=book().retos;return g.n?`${plural(g.won,'reto ganado','retos ganados')} de ${g.n}`:'Tócalo y empieza un reto de 30 s.';},
  radar:()=>{const b=radarBest(book());return b?`Mejor racha · ${b}`:'Pasa junto a uno pulsando a tiempo.';},
  pelota:()=>{const g=book().goals;return g?plural(g,'gol','goles'):'Patéala con un pulso.';},
  luces:()=>'Recoge todas en 30 s.',
  tablon:()=>{const n=book().ordersDone,o=book().orders.length;return n||o?`${plural(n,'encargo cumplido','encargos cumplidos')}${o?` · ${o} abiertos`:''}`:'Junto a cada satélite.';},
 };
 const mapPoints=()=>{if(!r.S||!ok())return [];const out=[],f=flare();if(f)out.push({kind:'rumor',id:'bengala',x:f.x,y:f.y,name:'Bengala',text:'Tu bengala. Vuelve cuando quieras.'});
  for(const o of book().orders)if(o.kind==='sitio')out.push({kind:'rumor',id:'encargo:'+o.id,x:o.x,y:o.y,name:'Encargo',text:o.text});return out;};
 for(const id of Object.keys(lines))r.bandAttach?.(id,{line:lines[id],...(id==='interruptor'?{busy:()=>!!reto,mapPoints}:{})});
 $('bFlare')?.addEventListener('click',()=>{if(launch()){const m=$('mMenu');if(m)m.hidden=true;}});
 Object.defineProperties(r,{
  viajeTick:{get:()=>tick},drawViaje:{get:()=>draw},viajeFlare:{get:()=>launch},viajeBusy:{get:()=>()=>!!reto},
  // Tests only (the runtime is never published): the state.
  viajeState:{get:()=>()=>{const q=book();return {version:q.version,allowed:allowed(),world,book:structuredClone(q),reto:reto?{...reto,targets:reto.targets.map(x=>({...x}))}:null,radar:radar?{...radar}:null,
   balls:[...balls.values()].map(b=>({id:b.id,x:b.x,y:b.y,vx:b.vx,vy:b.vy,home:b.home,goal:b.goal,party:!!b.party})),drawn,summary:summary?.text||'',notes,flareBeeps,bars,rest};}}
 });
}
