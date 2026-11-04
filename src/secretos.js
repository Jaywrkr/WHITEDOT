// Secretos (Jay, 3 Nov 2026, alpha.244; docs/MUNDO.md#secretos): the first easter eggs (F5). Nothing explains them and
// each one goes back by itself.
// · The arrow code (↑↑↓↓←→←→, keys or swipes): a white flash, an arpeggio on the harmony that sounds, and eight small
//   white squares round the cube for 20 s.
// · Seven taps on the logo of the menu: the cube puts on a strange face (two dots and a line) for 10 s. Silent.
// · The origin (0,0) and 42, 77 and 100 km from it: a page in the Bitácora and a short chord, once. At 100 km the cube
//   earns its gold frame (gold: earned), worn at once and taken off in Tu cubo. The cube never grows.
// · A secret asteroid with a short note, at a fixed point about 4 km out.
// · Real dates, from the device's clock: snow of stars at Christmas, fireworks at New Year, the real full moon at night,
//   and on 1 August balloons of light. Off with reduced motion. The year is never kept.
// Every secret found is kept in the Bitácora (Secretos), with no word of the ones still hidden. No sparks (decision 9).
// The music is untouched: the notes play on top, through hookInst, as the album of sounds does.
import {openSurface,prefersReducedMotion} from './frame-state.js';
import {freeOpen} from './journey-mode.js';
import {LIVE_COLORS} from './live-encounters-model.js';
import {SOUND_TRIM} from './descubrir-model.js';
import {radial,glow} from './fx-kit.js';
import {SECRETS,secretById,codeReader,KEY_DIRECTIONS,swipeDirection,tapCounter,CODE_EFFECT,FLASH_SECONDS,FACE_SECONDS,placesReached,ASTEROID,ASTEROID_NOTE,dateSecret,
 normalizeSecrets,secretFound,secretCount,findSecret,goldEarned,goldOn,ARPEGGIO_DEGREES,CHORD_DEGREES,SECRET_INSTRUMENT,SECRET_GAIN,scaleNote,sequence,SECRETS_VERSION} from './secretos-model.js';
const TAU=Math.PI*2,GOLD='#f0d27a';
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// The colours of the fireworks and the balloons: the places' own (never gold, which is for what is earned).
const PALETTE=['lago','bosque','jardin','cristales','tormenta','cueva','vacio'].map(id=>LIVE_COLORS[id]);
// Notes of the place's scale (the harmony that sounds) from a time on the grid, one every `spacing` sixteenths (0: all
// together), in the album of sounds' kalimba at its keeping level and measured trim. Returns how many were sent.
export function playSecretNotes(r,degrees,start,{spacing=1,octave=0,gain=SECRET_GAIN}={}){if(!r.S?.sound||r.ac?.state!=='running')return 0;
 const p={x:r.S.wx,y:r.S.wy},d=r.regionOfPos?.(p.x,p.y),scale=r.MU?.dnaA?.scale||d?.scale,tonic=57+(r.MU?.tr||0)+12*octave,step=(r.SIX||.125)*spacing;let n=0;
 degrees.forEach((degree,k)=>{const note=scaleNote(scale,tonic,degree),at=start+k*step;const emit=()=>{r.hookInst(SECRET_INSTRUMENT,note,at,r.vel(gain*(SOUND_TRIM[SECRET_INSTRUMENT]??1)),d);r.secretAudioCue?.({note,time:at,degree,gain,six:r.SIX});};
  if(r.withVoiceOrigin)r.withVoiceOrigin('player',emit);else emit();n++;});return n;}
export function initialize(r){
 const $=id=>r.$?.(id)||globalThis.document?.getElementById(id)||null;
 let owner=null,clock=0,codeAt=-Infinity,faceUntil=-Infinity,dateId=null,dateChecked=-Infinity,cubeKey='',fx={snow:[],bursts:[],balloons:[],nextBurst:0},drawn={},notes=0;
 const reader=codeReader(),taps=tapCounter(),rand=sequence(245);
 const reduced=()=>!!(r.S?.reducedMotion||prefersReducedMotion());
 // The free World's surface after the Journey, outside every level, activity, the Refugio and the finales (as Descubrir).
 const world=()=>!!r.S&&r.inWorld?.()&&!r.activityActive&&!r.labMode&&!r.houseActive?.()&&!r.travelInLevel?.()&&!r.placeRun?.()&&!r.songStageState?.()?.running&&!r.journeyFinaleState?.()?.running;
 const allowed=()=>world()&&(r.S.layer||'superficie')==='superficie'&&freeOpen(r.S.journey)&&!(r.S.previewSeed&&!r.realTravel);
 const modalOpen=()=>!!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 const paused=()=>globalThis.document?.hidden||!!r.scanning||modalOpen();
 // The save (S.secrets), normalised once per save; a later version is only read.
 function book(){if(owner!==r.S){owner=r.S;owner.secrets=normalizeSecrets(owner.secrets);cubeKey='';}return owner.secrets;}
 const ok=()=>book().version===SECRETS_VERSION&&!book().readOnly;
 // Found: kept first (a failed save leaves it as it was), then a short notice. The dates keep no day.
 function find(id){const q=book();if(!ok()||secretFound(q,id))return false;const before=structuredClone(q.found);if(!findSecret(q,id,r.S.todayKey))return false;
  if(r.save?.()===false){q.found=before;return false;}
  const s=secretById(id);r.toast?.(`<em>Secreto</em> · ${escape(s.name)}`,{level:2,category:'ganado'});
  if(id==='km100')r.toast?.('<em>Cubo dorado</em> · Llévalo o quítalo en Tu cubo',{level:2,category:'ganado'});
  cubeKey='';syncCube();if(!$('mJournal')?.hidden)r.refreshJournal?.();return true;}
 // ---------- sound: notes on the harmony, far under the music ----------
 function playNotes(degrees,spacing,octave=0){if(!r.S?.sound||r.ac?.state!=='running'||!r.beatSoon)return false;const state=r.S;
  r.beatSoon(time=>{if(state!==r.S)return;notes+=playSecretNotes(r,degrees,time,{spacing,octave});},null,'player');return true;}
 const arpeggio=()=>playNotes(ARPEGGIO_DEGREES,1);
 const chord=()=>playNotes(CHORD_DEGREES,0);
 // ---------- the arrow code: keys and swipes ----------
 const codeHere=()=>world()&&!modalOpen();
 function onCode(){if(!codeHere())return false;codeAt=clock;arpeggio();find('flechas');return true;}
 const push=dir=>{if(reader.push(dir,performance.now()))onCode();};
 const typing=t=>!!t?.closest?.('input,textarea,select,[contenteditable="true"]');
 globalThis.addEventListener?.('keydown',e=>{if(e.repeat||typing(e.target))return;const dir=KEY_DIRECTIONS[e.key];if(!dir)return;if(!codeHere()){reader.reset();return;}push(dir);},{capture:true,passive:true});
 const canvas=$('w');let stroke=null;
 canvas?.addEventListener('pointerdown',e=>{if(e.isPrimary===false)return;stroke={id:e.pointerId,x:e.clientX,y:e.clientY,at:performance.now()};},{passive:true});
 globalThis.addEventListener?.('pointerup',e=>{const s=stroke;stroke=null;if(!s||s.id!==e.pointerId||!codeHere())return;const dir=swipeDirection(e.clientX-s.x,e.clientY-s.y,performance.now()-s.at);if(dir)push(dir);},{capture:true,passive:true});
 globalThis.addEventListener?.('pointercancel',()=>{stroke=null;},{capture:true,passive:true});
 // ---------- the logo: seven taps ----------
 const logo=globalThis.document?.querySelector?.('#mMenu .menu-who');
 logo?.addEventListener('click',()=>{if(!taps.tap(performance.now()))return;faceUntil=clock+FACE_SECONDS;const a=$('menuAvatar');if(a){a.classList.add('secret-face');setTimeout(()=>a.classList.remove('secret-face'),FACE_SECONDS*1000);}find('logo');});
 // ---------- the frame ----------
 function tick(dt,modal=false){
  if(!r.S)return;book();syncCube();if(modal||paused())return;clock+=Math.max(0,Math.min(.05,dt||0));
  if(!allowed())return;const p={x:r.S.wx,y:r.S.wy};
  // The places: the first arrival is kept and heard (a chord), once.
  if(ok())for(const id of placesReached(p.x,p.y))if(!secretFound(book(),id)&&find(id))chord();
  // The date, read every few seconds from the device's own clock.
  if(clock-dateChecked>=5||dateChecked>clock){dateChecked=clock;dateId=dateSecret(new Date());}
  if(dateId&&!reduced())find(dateId);
 }
 // ---------- drawing ----------
 const light=()=>!!r.lightQuality?.();
 function snow(c,dt){const n=light()?18:36;while(fx.snow.length<n)fx.snow.push({x:rand()*r.W,y:rand()*r.H,v:10+rand()*22,s:1+Math.round(rand()*2),k:rand()*TAU});fx.snow.length=n;
  c.fillStyle='#ffffff';for(const f of fx.snow){f.y+=f.v*dt;f.k+=dt;f.x+=Math.sin(f.k)*6*dt;if(f.y>r.H+6){f.y=-6;f.x=rand()*r.W;}if(f.x<-6)f.x=r.W+6;if(f.x>r.W+6)f.x=-6;
   c.globalAlpha=.55;const x=Math.round(f.x),y=Math.round(f.y);c.fillRect(x-f.s,y,f.s*2+1,1);c.fillRect(x,y-f.s,1,f.s*2+1);}}
 function fireworks(c,dt){fx.nextBurst-=dt;if(fx.nextBurst<=0&&fx.bursts.length<(light()?2:4)){fx.nextBurst=.7+rand()*.8;const col=PALETTE[Math.floor(rand()*PALETTE.length)],x=r.W*(.15+.7*rand()),y=r.H*(.12+.38*rand()),n=light()?12:20,parts=[];
   for(let i=0;i<n;i++){const a=i/n*TAU,v=60+rand()*50;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v});}fx.bursts.push({col,age:0,parts});}
  for(const b of fx.bursts){b.age+=dt;c.fillStyle=b.col;c.globalAlpha=Math.max(0,1-b.age/2.2);for(const q of b.parts){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.97;q.vy=q.vy*.97+18*dt;c.fillRect(Math.round(q.x)-1,Math.round(q.y)-1,3,3);}}
  fx.bursts=fx.bursts.filter(b=>b.age<2.2);return fx.bursts.length;}
 function balloons(c,dt){const n=light()?4:7;const first=!fx.balloons.length;while(fx.balloons.length<n)fx.balloons.push({x:r.W*(.08+.84*rand()),y:first?r.H*(.25+.75*rand()):r.H+20+rand()*r.H*.5,v:16+rand()*14,k:rand()*TAU,col:PALETTE[Math.floor(rand()*PALETTE.length)]});fx.balloons.length=n;
  for(const b of fx.balloons){b.y-=b.v*dt;b.k+=dt*.8;if(b.y<-40){b.y=r.H+30;b.x=r.W*(.08+.84*rand());}const x=b.x+Math.sin(b.k)*8,y=b.y;
   c.globalAlpha=.75;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.moveTo(x,y+8);c.quadraticCurveTo(x+3,y+15,x,y+22);c.stroke();c.fillStyle=b.col;c.beginPath();c.ellipse(x,y,6,8,0,0,TAU);c.fill();}}
 function moon(c){const x=r.W-58,y=Math.max(118,r.H*.18);
  // Visual 2 (alpha.254): its halo from a sprite, not a gradient per frame.
  c.globalAlpha=1;radial(c,x,y,46,'moon',[[14/46,'rgba(235,235,242,.18)'],[1,'rgba(235,235,242,0)']]);c.globalAlpha=.6;c.fillStyle='#ebebf2';c.beginPath();c.arc(x,y,18,0,TAU);c.fill();c.globalAlpha=.16;c.fillStyle='#000';
  for(const [dx,dy,s] of [[-6,-4,4],[5,3,3],[-2,8,2.5]]){c.beginPath();c.arc(x+dx,y+dy,s,0,TAU);c.fill();}}
 const at=(x,y)=>({x:x+r.W/2-r.camX,y:y+r.H/2-r.camY});
 function asteroid(c){const p={x:r.S.wx,y:r.S.wy},d=Math.hypot(p.x-ASTEROID.x,p.y-ASTEROID.y);if(d>ASTEROID.see)return false;const q=at(ASTEROID.x,ASTEROID.y);
  if(q.x<-40||q.y<-40||q.x>r.W+40||q.y>r.H+40)return false;
  // Visual 2: a faint added light behind it and a rim lit from above on the left, so it reads as a rock in space.
  if(!r.lightQuality?.())glow(c,q.x,q.y,24,'#c8ccd8',.16,true);
  c.globalAlpha=.9;c.fillStyle='#55555c';c.beginPath();[[-11,-3],[-6,-10],[4,-9],[11,-2],[8,8],[-2,11],[-10,6]].forEach(([x,y],i)=>i?c.lineTo(q.x+x,q.y+y):c.moveTo(q.x+x,q.y+y));c.closePath();c.fill();
  c.globalAlpha=.55;c.strokeStyle='#c8ccd8';c.lineWidth=1;c.beginPath();c.moveTo(q.x-10,q.y+6);c.lineTo(q.x-11,q.y-3);c.lineTo(q.x-6,q.y-10);c.lineTo(q.x+4,q.y-9);c.stroke();c.globalAlpha=.9;
  c.fillStyle='#ffffff';c.fillRect(Math.round(q.x)-3,Math.round(q.y)-4,7,5);
  if(d<=ASTEROID.reach*1.6&&r.S.universeTexts!==false){c.globalAlpha=1;c.font='12px "Geist Mono", monospace';c.textAlign='center';const y=q.y-22;c.fillText('Una nota',q.x,y-16,r.W-32);c.globalAlpha=.8;c.fillText(ASTEROID_NOTE,q.x,y,r.W-32);}
  return true;}
 let lastDraw=0;
 function draw(){if(!r.S||!r.cx)return;const c=r.cx,now=performance.now(),dt=Math.min(.05,Math.max(0,(now-(lastDraw||now))/1000));lastDraw=now;const out={};c.save();
  if(allowed()&&!paused()){
   if(dateId&&!reduced()){out.date=dateId;if(dateId==='navidad')snow(c,dt);else if(dateId==='anonuevo')out.bursts=fireworks(c,dt);else if(dateId==='especial')balloons(c,dt);else if(dateId==='luna')moon(c);}
   out.asteroid=asteroid(c);}
  // The flash of the code: white over the World, fading in FLASH_SECONDS (softer with reduced motion).
  const age=clock-codeAt;if(age>=0&&age<FLASH_SECONDS&&world()){c.globalAlpha=(1-age/FLASH_SECONDS)*(reduced()?.35:.75);c.fillStyle='#ffffff';c.fillRect(0,0,r.W,r.H);out.flash=true;}
  c.restore();drawn=out;}
 // On the cube: the gold frame (earned at 100 km), the strange face, the eight squares of the code.
 function drawCube(c,x,y,s,t){if(!r.S||!r.inWorld?.())return;c.save();const still=reduced(),half=Math.round(s)/2;
  if(ok()&&goldOn(book())){c.globalAlpha=.95;c.strokeStyle=GOLD;c.lineWidth=1.5;c.strokeRect(Math.round(x-half)-1.25,Math.round(y-half)-1.25,Math.round(s)+2.5,Math.round(s)+2.5);
   if(!still){const k=(t/2600)%1;if(k<.35){c.globalAlpha=.9*(1-Math.abs(k/.35*2-1));c.fillStyle='#ffffff';c.fillRect(Math.round(x-half+k/.35*s)-1,Math.round(y-half)-2,2,2);}}}
  if(clock<faceUntil&&world()){const e=Math.max(1,Math.round(s*.14));c.globalAlpha=1;c.fillStyle='#000';
   c.fillRect(Math.round(x-s*.24),Math.round(y-s*.16),e,e);c.fillRect(Math.round(x+s*.12),Math.round(y-s*.2),e+1,e+1);
   c.save();c.translate(x,y+s*.2);c.rotate(-.18);c.fillRect(Math.round(-s*.22),0,Math.max(2,Math.round(s*.44)),Math.max(1,Math.round(s*.08)));c.restore();}
  const age=clock-codeAt;if(age>=0&&age<CODE_EFFECT&&world()){const fade=Math.min(1,(CODE_EFFECT-age)/2,age/.3),rad=Math.max(22,s*2.2)+6,turn=still?0:age*1.4;c.fillStyle='#ffffff';
   for(let i=0;i<8;i++){const a=turn+i/8*TAU;c.globalAlpha=.85*fade;c.fillRect(Math.round(x+Math.cos(a)*rad)-1.5,Math.round(y+Math.sin(a)*rad)-1.5,3,3);}}
  c.restore();}
 // ---------- Tu cubo: the gold cube, put on or taken off ----------
 // Alpha.247: beside it, the ornament of the fifty comet crystals (secretos-cielo.js, skySecretCubeOption).
 function syncCube(){const box=$('cubeSecretSection'),list=$('cubeSecretOptions');if(!box||!list)return;const q=book(),earned=ok()&&goldEarned(q),options=[];
  if(earned)options.push({id:'cubeSecretGold',label:'Cubo dorado',title:'Llegaste a 100 km',on:goldOn(q),toggle:toggleGold});const sky=r.skySecretCubeOption?.();if(sky)options.push(sky);
  const key=options.map(o=>o.id+':'+(o.on?1:0)).join(',');if(key===cubeKey)return;cubeKey=key;box.hidden=!options.length;if(!options.length){list.replaceChildren();return;}
  const buttons=options.map(o=>{let b=globalThis.document.getElementById(o.id);if(!b){b=globalThis.document.createElement('button');b.type='button';b.id=o.id;b.className='cube-option';b.dataset.earned='true';b.textContent=o.label;b.title=o.title;}b.onclick=()=>{o.toggle();cubeKey='';syncCube();};b.setAttribute('aria-pressed',String(!!o.on));return b;});
  if(buttons.some((b,i)=>list.children[i]!==b)||list.children.length!==buttons.length)list.replaceChildren(...buttons);}
 function toggleGold(){const q=book();if(!ok()||!goldEarned(q))return false;const before=q.wear.gold;if(before===false)delete q.wear.gold;else q.wear.gold=false;
  if(r.save?.()===false){if(before===false)q.wear.gold=false;else delete q.wear.gold;const h=$('cubeHint');if(h)h.textContent='No se guardó. Intenta otra vez.';}cubeKey='';syncCube();return goldOn(q);}
 // The sky's secrets (alpha.247) can change the cube's options at any time: their key is read each frame.
 const cube=$('mCube');if(cube&&globalThis.MutationObserver)new MutationObserver(()=>{if(!cube.hidden){cubeKey='';syncCube();}}).observe(cube,{attributes:true,attributeFilter:['hidden']});
 // ---------- the Bitácora: what you found; of the rest, only that there is more ----------
 // Alpha.247: the sky's secrets (secretos-cielo.js) add their pages, found or not, in the same way.
 function section(){if(!r.S)return '';const q=book(),sky=r.skySecretRows?.()||{html:'',found:0,total:0},n=secretCount(q)+sky.found,left=SECRETS.length+sky.total-n;
  const rows=SECRETS.filter(s=>secretFound(q,s.id)).map(s=>`<p class="secret-row" data-secret="${s.id}"><span class="secret-name">${escape(s.name)}</span> · ${escape(s.line)}${s.id==='asteroide'?` «${escape(ASTEROID_NOTE)}»`:''}${s.id==='km100'?' <em class="sky-earned">Cubo dorado</em>':''}</p>`).join('')+sky.html;
  const rest=left?`<p class="secret-missing" aria-label="Secretos sin encontrar">${'<span aria-hidden="true">?</span>'.repeat(left)}</p>`:'<p>Encontraste todos los de ahora.</p>';
  return `<details class="journal-section" data-journal-detail="Secretos" id="journalSecrets"><summary>Secretos · ${n}</summary>${n?'':'<p>Hay secretos en el universo. Ninguno se explica.</p>'}${rows}${rest}</details>`;}
 // ---------- tests (the runtime is never published) ----------
 Object.defineProperties(r,{
  secretTick:{get:()=>tick},drawSecrets:{get:()=>draw},drawSecretCube:{get:()=>drawCube},secretSection:{get:()=>section},
  secretSkip:{get:()=>seconds=>{clock+=Math.max(0,Number(seconds)||0);}},secretToggleGold:{get:()=>toggleGold},
  secretState:{get:()=>()=>{const q=book();return {version:q.version,found:structuredClone(q.found),count:secretCount(q),gold:goldOn(q),goldEarned:goldEarned(q),codeLeft:Math.max(0,CODE_EFFECT-(clock-codeAt)),faceLeft:Math.max(0,faceUntil-clock),date:dateId,allowed:allowed(),drawn,notes,progress:reader.progress,taps:taps.count};}}
 });
}
