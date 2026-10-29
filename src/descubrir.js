// Descubrir (Jay, 29 Oct 2026, alpha.240; docs/MUNDO.md#descubrir): rumors and the album of sounds, in the free World
// after the Journey, never in a chapter, a round, a finale, an activity or the Refugio.
// Rumores: when you complete something in the open universe (a living encounter, a figure of the Mapa del cielo, an
// activity, a mischief scene) a short notice sometimes tells of something far and real. It is kept (three at most), drawn
// on the Mapa del universo with a white «?» whose card offers «Marcar», and listed in the Bitácora with «Soltar». Walking
// there fulfils it and the Bitácora notes it. No time limit, nothing lost.
// Álbum de sonidos: five rare sounds per biome, placed with hashKey. One sings softly every two bars as you come near
// (a dot of its biome's colour; white ring when near; a mark at the screen's edge while it is out of view). Pass through it,
// or pulse on time near it, and it is yours: sparks by the universe's rule, its page in the album, and a complete series
// lights a segment of the Aro de sonidos round the cube (gold: earned). In the album you choose up to four and they play
// together, in a soft loop on the music's own bars, on top of it, until you stop or close the album. The music is untouched.
import {openSurface,prefersReducedMotion} from './frame-state.js';
import {freeOpen} from './journey-mode.js';
import {creditSparks} from './sparks-model.js';
import {newRegionOf} from './universe-regions.js';
import {LIVE_COLORS} from './live-encounters-model.js';
import {RUMOR_VERSION,ALBUM_VERSION,RUMOR_OPEN_MAX,SOUNDS,SOUND_BIOMES,SOUND_BIOME_NAMES,SOUND_HEAR,SOUND_TOUCH,SOUND_PULSE,SOUND_NEAR,SOUND_CELL,SOUND_SING_GAIN,SOUND_KEEP_GAIN,SOUND_MIX_GAIN,SOUND_TRIM,MIX_MAX,
 soundById,biomeSounds,soundCell,soundNote,soundReward,normalizeRumors,normalizeAlbum,albumHas,albumCount,seriesProgress,keepSound,toggleMix,rumorDue,rumorFor,rumorArrived,rumorNow,worldKey} from './descubrir-model.js';
const TAU=Math.PI*2,GOLD='#f0d27a';
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// A sound's motif: its notes on its eighths from the start of a bar, in the place's scale, in its own instrument, far
// under the music. Returns how many notes were sent (none with sound off).
export function playSoundMotif(r,sound,start,point,gain=SOUND_KEEP_GAIN){
 const s=typeof sound==='string'?soundById(sound):sound;if(!s||!r.S.sound||r.ac?.state!=='running')return 0;
 const d=r.regionOfPos(point.x,point.y),scale=r.MU?.dnaA?.scale||d?.scale,tonic=57+(r.MU?.tr||0),eighth=(r.SIX||.125)*2;let n=0;
 s.motif.forEach((degree,k)=>{const note=soundNote(scale,tonic,degree,s.oct),time=start+s.steps[k]*eighth;
  const emit=()=>{r.hookInst(s.inst,note,time,r.vel(gain*(SOUND_TRIM[s.inst]??1)),d);r.discoverAudioCue?.({sound:s.id,instrument:s.inst,note,time,gain});};
  if(r.withVoiceOrigin)r.withVoiceOrigin('player',emit);else emit();n++;});
 return n;
}
export function initialize(r){
 const $=id=>r.$?.(id)||globalThis.document?.getElementById(id)||null;
 let drawn={hint:false};
 let owner=null,scope='',world='',cells=new Map(),extra=new Map(),baseline=null,clock=0,seen=new WeakSet(),summary=null,glows=[],sang=new Map(),lastBar=-1,mixOn=false,albumFromJournal=false,cubeKey='',heard=0,pending=false;
 const reduced=()=>!!(r.S.reducedMotion||prefersReducedMotion());
 // Where it lives: the free World's surface after the Journey, outside every level, activity, the Refugio and the finales.
 const allowed=()=>!!r.S&&r.inWorld?.()&&(r.S.layer||'superficie')==='superficie'&&freeOpen(r.S.journey)&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!r.houseActive?.()&&!r.travelInLevel?.()&&!r.placeRun?.()&&!r.placeCardDue?.()&&!r.songStageState?.()?.running&&!r.journeyFinaleState?.()?.running;
 const paused=()=>globalThis.document?.hidden||!!r.scanning||!!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 // A scene of its own is playing (a living encounter, a figure, a mischief scene): the sounds wait quietly.
 const scene=()=>!!r.liveEncounterActive?.()||!!r.skyMapActive?.()||!!r.mischiefState?.scene;
 // The saves (S.rumors, S.soundAlbum): normalised once per save; a later version is only read.
 function book(){const key=JSON.stringify(r.worldIdentity)+':'+(r.S.layer||'superficie');if(owner!==r.S||scope!==key){const fresh=owner!==r.S;owner=r.S;scope=key;owner.rumors=normalizeRumors(owner.rumors);owner.soundAlbum=normalizeAlbum(owner.soundAlbum);world=worldKey(r.worldIdentity);cells=new Map();extra=new Map();sang=new Map();if(fresh){baseline=null;pending=false;summary=null;glows=[];}}return owner;}
 const rumors=()=>book().rumors,album=()=>book().soundAlbum;
 const rumorsOk=()=>rumors().version===RUMOR_VERSION,albumOk=()=>album().version===ALBUM_VERSION;
 const today=()=>r.S.todayKey||'';
 // What is under a point, as the Mapa del cielo reads it (so a rumor of a figure points at a figure that is there).
 const under=(x,y)=>{const d=r.regionOfPos(x,y);return {biome:d?.sea?'vacio':r.BIOMES?.[d?.z]?.id||'vacio',region:d?.sea?newRegionOf(d.key,true)?.id||null:null};};
 const RP=()=>r.REG*r.WCH;
 const colorOf=biome=>r.placeColor?.(biome,LIVE_COLORS[biome])||LIVE_COLORS[biome]||'#ffffff';
 // ---------- the sounds in the World ----------
 function cell(i,j){const k=i+','+j;if(!cells.has(k)){cells.set(k,soundCell(world,i,j,under));while(cells.size>96)cells.delete(cells.keys().next().value);}return cells.get(k);}
 function around(p,radius){const out=[],n=Math.ceil(radius/SOUND_CELL),i0=Math.floor(p.x/SOUND_CELL),j0=Math.floor(p.y/SOUND_CELL);
  for(let i=i0-n;i<=i0+n;i++)for(let j=j0-n;j<=j0+n;j++){const s=cell(i,j);if(s&&Math.hypot(s.x-p.x,s.y-p.y)<=radius)out.push(s);}
  for(const s of extra.values())if(Math.hypot(s.x-p.x,s.y-p.y)<=radius)out.push(s);return out;}
 const kept=s=>albumOk()&&album().spots.includes(s.id);
 function nearest(p,radius=SOUND_HEAR){let best=null,bd=Infinity;for(const s of around(p,radius)){if(kept(s))continue;const d=Math.hypot(s.x-p.x,s.y-p.y);if(d<bd){bd=d;best=s;}}return best?{spot:best,d:bd}:null;}
 // Keeping one: sparks by the universe's rule (a new one as a rare encounter, one you have as a loose spark), the album,
 // a series complete gives its segment of the Aro. A failed save leaves everything as it was.
 function keep(spot,onTime=false){
  const q=album();if(!albumOk()||q.readOnly)return false;const S=r.S,before={album:structuredClone(q),sparks:S.sparks,economy:r.sparkEconomy?structuredClone(r.sparkEconomy):null};
  const res=keepSound(q,spot,{day:today(),onTime});if(!res)return false;
  let amount=0;const economy=r.sparkEconomy;if(economy&&economy.version===1){amount=creditSparks(S,soundReward({first:res.first,x:spot.x,y:spot.y,onTime}));q.earned+=amount;economy.log.push({title:res.sound.name,text:`Álbum de sonidos · +${amount} chispas`,at:today()});economy.log=economy.log.slice(-80);}
  if(r.save?.()===false){S.soundAlbum=before.album;S.sparks=before.sparks;if(before.economy)S.sparkEconomy=before.economy;owner=null;book();return false;}
  if(amount)r.showSparkPickup?.(amount,{x:spot.x,y:spot.y});glows.push({x:spot.x,y:spot.y,at:clock,gold:true});
  const state=S;if(S.sound&&r.ac?.state==='running'&&r.beatSoon)r.beatSoon(time=>{if(state!==r.S)return;playSoundMotif(r,res.sound,time,spot,SOUND_KEEP_GAIN);},null,'player');
  const p=seriesProgress(q,res.sound.biome);
  summary={text:`${res.sound.name} · ${res.first?SOUND_BIOME_NAMES[res.sound.biome]+' · '+p.done+' de '+p.total:'otra vez'}${amount?' · +'+amount+' ✦':''}`,until:clock+3.2};
  if(!r.achievementsCalm?.()){if(res.series)r.toast?.(`<em>Aro de sonidos</em> · Serie completa: ${SOUND_BIOME_NAMES[res.series]}`,{level:2,category:'ganado'});else if(res.first)r.toast?.(`<em>Sonido nuevo</em> · ${res.sound.name}`,{level:2,category:'ganado'});}
  cubeKey='';return true;}
 // ---------- rumors ----------
 // Everything completed in the open universe so far (each system's own count); a rise means something was completed.
 const count=v=>Number.isSafeInteger(v)&&v>0?v:0;
 function completed(){const S=r.S;let n=count(S.liveEncounters?.caught);for(const e of Object.values(S.skyMap?.figures||{}))n+=count(e?.done);n+=Object.keys(S.activities?.done||{}).length+Object.keys(S.mischief?.done||{}).length;return n;}
 function skipKey(key){const q=rumors(),S=r.S;if(q.open.some(e=>e.key===key)||q.done.some(e=>e.key===key))return true;
  if(key.startsWith('sky:'))return !!S.skyMap?.sites?.[key]?.done;if(key.startsWith('rare:'))return !!S.anomalies?.[key.slice(5)];if(key.startsWith('lm:'))return !!S.landmarks?.[key];if(key.startsWith('sonido:'))return albumOk()&&album().spots.includes(key);return false;}
 const look=()=>({under,RP:RP(),landmarkAt:(rx,ry)=>r.landmarkAt?.(rx,ry),anomalyAt:(rx,ry)=>r.anomalyAt?.(rx,ry),skip:skipKey,known:id=>albumOk()&&albumHas(album(),id)});
 // A rumor now (force: without the roll, still never more than three open). Saved before it is told.
 function give(force=false){if(!rumorsOk())return null;const q=rumors();if(q.readOnly||q.open.length>=RUMOR_OPEN_MAX)return null;
  const due=force||rumorDue(q,world),n=q.n;q.n=n+1;if(!due){r.save?.();return null;}
  const rumor={...rumorFor({x:r.S.wx,y:r.S.wy},world,n,look()),at:today()};q.open.push(rumor);q.given++;
  if(r.save?.()===false){q.open.pop();q.given--;q.n=n;return null;}
  if(r.S.universeTexts!==false)r.toast?.(`Rumor · ${escape(rumor.text)}`,{level:2,category:'rumor'});
  return rumor;}
 function fulfil(rumor){const q=rumors(),i=q.open.indexOf(rumor);if(i<0)return false;q.open.splice(i,1);const row={...rumor,done:today()};q.done.push(row);if(q.done.length>24)q.done.splice(0,q.done.length-24);
  if(r.save?.()===false){q.done.pop();q.open.splice(i,0,rumor);return false;}
  const mark=r.universeMapState?.()?.book?.mark;if(mark&&mark.id===rumor.id)r.clearMapMark?.();
  r.toast?.(`Rumor cumplido · ${escape(rumor.name)}`,{level:2,category:'rumor'});return true;}
 function drop(id){if(!rumorsOk())return false;const q=rumors(),i=q.open.findIndex(e=>e.id===id);if(i<0)return false;const [row]=q.open.splice(i,1);if(r.save?.()===false){q.open.splice(i,0,row);return false;}const mark=r.universeMapState?.()?.book?.mark;if(mark&&mark.id===id)r.clearMapMark?.();return true;}
 function markRumor(id){const e=rumors().open.find(x=>x.id===id);if(!e)return false;const ok=!!r.setMapMark?.({kind:'rumor',id:e.id,x:e.x,y:e.y,name:e.name});if(ok)r.toast?.('Marca puesta · la brújula te lleva');return ok;}
 // ---------- the frame ----------
 function tick(dt,modal=false){
  if(!r.S)return;book();syncCube();
  // Something completed (an activity ends inside its portal): the roll waits until you are back in the open World.
  const c=completed();if(baseline===null||c<baseline)baseline=c;else if(c>baseline){baseline=c;pending=true;}
  if(pending&&allowed()){pending=false;give();}
  if(!allowed()){summary=null;return;}
  if(modal||paused())return;const step=Math.max(0,Math.min(.05,dt||0));clock+=step;
  if(summary&&clock>summary.until)summary=null;glows=glows.filter(g=>clock-g.at<1.2);
  const p={x:r.S.wx,y:r.S.wy};
  // Rumors: arriving fulfils them.
  if(rumorsOk())for(const e of [...rumors().open])if(rumorArrived(e,p))fulfil(e);
  // Sounds: the cube within reach keeps one; a pulse on time near one keeps it (on time).
  const pulses=[];for(const w of r.waves||[])if(!seen.has(w)){seen.add(w);if(w.origin==='player'&&w.beat)pulses.push(w);}
  if(!albumOk())return;for(const s of around(p,SOUND_NEAR)){if(kept(s))continue;const d=Math.hypot(s.x-p.x,s.y-p.y);if(d<=SOUND_TOUCH){keep(s,false);continue;}if(pulses.some(w=>Math.hypot(w.x-s.x,w.y-s.y)<=SOUND_PULSE))keep(s,true);}
 }
 // On the music's own bars: a sound near you sings every two bars (softer from further), and your mix plays every bar.
 function onBar(t,bar){
  if(!r.S?.sound||r.ac?.state!=='running')return;
  if(mixOn&&albumOk()&&!$('mSoundAlbum')?.hidden){for(const id of album().mix)playSoundMotif(r,id,t,{x:r.S.wx,y:r.S.wy},SOUND_MIX_GAIN);}
  if(!allowed()||paused()||scene()||bar%2)return;const near=nearest({x:r.S.wx,y:r.S.wy});if(!near)return;
  const k=1-near.d/SOUND_HEAR,gain=SOUND_SING_GAIN*(.25+.75*k*k);if(playSoundMotif(r,near.spot.sound,t,near.spot,gain)){sang.set(near.spot.id,{t,clock});heard++;}}
 // The bars, read from the music's schedule (MU.sq keeps the latest sixteenths with their step in the bar).
 setInterval(()=>{try{const sq=r.MU?.sq,ac=r.ac;if(!ac||!sq?.length)return;for(const e of sq){if(e.s!==0||!(e.t>lastBar+1e-4))continue;lastBar=e.t;if(e.t>=ac.currentTime-.01)onBar(e.t,e.tick>>4);}}catch(_){}},50);
 // ---------- drawing ----------
 const at=(x,y)=>({x:x+r.W/2-r.camX,y:y+r.H/2-r.camY});
 // A word centred on a point, kept inside the screen.
 const say=(c,t,x,y)=>{const w=c.measureText(t).width;c.fillText(t,Math.max(8+w/2,Math.min(r.W-8-w/2,x)),y);};
 function draw(){if(!allowed()||!albumOk())return;const c=r.cx,p={x:r.S.wx,y:r.S.wy},still=reduced(),words=r.S.universeTexts!==false,ac=r.ac,now=ac?ac.currentTime:0;
  let hint=null;c.save();
  for(const s of around(p,SOUND_HEAR)){if(kept(s))continue;const q=at(s.x,s.y),d=Math.hypot(s.x-p.x,s.y-p.y),off=q.x<-12||q.y<-12||q.x>r.W+12||q.y>r.H+12;
   if(off){if(!hint||d<hint.d)hint={...q,d};continue;}
   const near=d<SOUND_NEAR,col=colorOf(s.biome),song=sang.get(s.id),age=song?now-song.t:9;
   // While it sings: a ring of its colour grows out (still with reduced motion: a steady ring).
   if(age>=0&&age<1.2){c.globalAlpha=.6*(1-age/1.2);c.strokeStyle=col;c.lineWidth=1;c.beginPath();c.arc(q.x,q.y,still?14:7+age*22,0,TAU);c.stroke();}
   c.globalAlpha=1;c.fillStyle='#000';c.beginPath();c.arc(q.x,q.y,6,0,TAU);c.fill();c.fillStyle=col;c.globalAlpha=.9;c.beginPath();c.arc(q.x,q.y,3,0,TAU);c.fill();
   // Near: the white ring says what to do next.
   if(near){c.globalAlpha=.9;c.strokeStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(q.x,q.y,10+(still?0:Math.sin(clock*4)*1.5),0,TAU);c.stroke();
    if(words){const known=albumHas(album(),s.sound);c.globalAlpha=1;c.fillStyle='#ffffff';c.font='12px "Geist Mono", monospace';c.textAlign='center';say(c,known?soundById(s.sound).name:'Sonido raro',q.x,q.y-18);c.globalAlpha=.75;c.font='11px "Geist Mono", monospace';say(c,'Pasa por él o toca a tiempo',q.x,q.y+24);}}}
  // Out of view: a small white ring at the screen's edge, toward the nearest one you can hear.
  if(hint&&!scene()){const cx=r.W/2,cy=r.H/2,a=Math.atan2(hint.y-cy,hint.x-cx),k=Math.min((r.W/2-18)/Math.abs(Math.cos(a)||1e-6),(r.H/2-100)/Math.abs(Math.sin(a)||1e-6));c.globalAlpha=.3+.4*(1-hint.d/SOUND_HEAR);c.strokeStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(cx+Math.cos(a)*k,cy+Math.sin(a)*k,4,0,TAU);c.stroke();}
  for(const g of glows){const q=at(g.x,g.y),k=(clock-g.at)/1.2;c.globalAlpha=.85*(1-k);c.strokeStyle=GOLD;c.lineWidth=1.5;c.beginPath();c.arc(q.x,q.y,still?16:8+k*30,0,TAU);c.stroke();}
  if(summary&&words&&!scene()){c.globalAlpha=.92;c.fillStyle='#ffffff';c.font='12px "Geist Mono", monospace';c.textAlign='center';c.fillText(summary.text,r.W/2,Math.min(r.H-135,r.H/2+130),r.W-32);}
  c.restore();drawn={hint:!!hint};}
 // The Aro de sonidos round the cube: one short gold arc per biome whose series is complete, turning slowly.
 const wearing=()=>albumOk()&&Object.keys(album().series).length>0&&album().wear?.ring!==false;
 function drawRing(c,x,y,size,t){if(!r.S||!r.inWorld?.()||!wearing())return;const done=SOUND_BIOMES.map((b,i)=>album().series[b]?i:-1).filter(i=>i>=0),rad=Math.max(30,size*2.8),turn=reduced()?0:t/12000;
  c.save();c.strokeStyle=GOLD;c.fillStyle=GOLD;c.lineWidth=2;c.globalAlpha=.85;for(const i of done){const a=turn+i/11*TAU-Math.PI/2;c.beginPath();c.arc(x,y,rad,a-.2,a+.2);c.stroke();c.fillRect(Math.round(x+Math.cos(a)*(rad+5))-1,Math.round(y+Math.sin(a)*(rad+5))-1,2,2);}c.restore();}
 // ---------- Tu cubo: the Aro, put on or taken off ----------
 function syncCube(){const box=$('cubeSoundSection'),list=$('cubeSoundOptions');if(!box||!list)return;const q=album(),earned=albumOk()&&Object.keys(q.series).length>0,on=earned&&q.wear?.ring!==false,key=(earned?1:0)+':'+(on?1:0)+':'+Object.keys(q.series||{}).length;if(key===cubeKey)return;cubeKey=key;box.hidden=!earned;if(!earned){list.replaceChildren();return;}
  let b=document.getElementById('cubeSoundRing');if(!b){b=document.createElement('button');b.type='button';b.id='cubeSoundRing';b.className='cube-option';b.dataset.earned='true';b.textContent='Aro de sonidos';b.title='Series completas del Álbum de sonidos';b.onclick=toggleRing;list.replaceChildren(b);}b.setAttribute('aria-pressed',String(on));}
 function toggleRing(){const q=album();if(!albumOk()||!Object.keys(q.series).length)return false;const before=q.wear.ring;q.wear.ring=before===false;if(r.save?.()===false){q.wear.ring=before;const h=$('cubeHint');if(h)h.textContent='No se guardó. Intenta otra vez.';}cubeKey='';syncCube();return q.wear.ring!==before;}
 // ---------- the album and your mix ----------
 const box=$('mSoundAlbum'),list=$('soundAlbumList'),play=$('soundMixPlay'),note=$('soundMixNote');
 function renderAlbum(){if(!box||!list)return;const q=album(),ok=albumOk();$('soundAlbumCount').textContent=`${ok?albumCount(q):0} de ${SOUNDS.length}`;
  list.innerHTML=SOUND_BIOMES.map(b=>{const p=seriesProgress(q,b),done=ok&&!!q.series[b];
   return `<section class="sound-biome" data-sound-biome="${b}"><h3>${escape(SOUND_BIOME_NAMES[b])} · ${p.done} de ${p.total}${done?' <em class="sky-earned">Aro</em>':''}</h3><div class="sound-chips">`+biomeSounds(b).map(s=>{const has=ok&&albumHas(q,s.id),on=has&&q.mix.includes(s.id);
    return has?`<button type="button" class="sound-chip" data-sound-id="${s.id}" aria-pressed="${on}">${escape(s.name)}</button>`:`<span class="sound-chip" data-sound-missing="${s.id}">?</span>`;}).join('')+'</div></section>';}).join('');
  playUI();}
 function playUI(){if(!play||!note)return;const q=album(),n=albumOk()?q.mix.length:0,sound=!!r.S.sound;
  play.disabled=!n||!sound;play.textContent=mixOn?'Parar':'Escuchar mezcla';play.classList.toggle('gold',!mixOn&&n>0&&sound);
  note.textContent=!albumCount(q)?'Busca sonidos raros en el universo. Se oyen antes de verse.':!sound?'Activa el sonido para escuchar tu mezcla.':mixOn?(n===1?'Suena tu mezcla · 1 sonido':`Suena tu mezcla · ${n} sonidos`):n?`Tu mezcla · ${n} de ${MIX_MAX}`:`Elige hasta ${MIX_MAX} sonidos para tu mezcla.`;}
 function openAlbum(fromJournal=false){if(!box)return false;book();albumFromJournal=fromJournal;const j=$('mJournal');if(fromJournal&&j)j.hidden=true;mixOn=false;box.hidden=false;renderAlbum();return true;}
 function closeAlbum(){if(!box||box.hidden)return;box.hidden=true;}
 function stopMix(){mixOn=false;playUI();}
 if(box){list?.addEventListener('click',e=>{const b=e.target.closest?.('[data-sound-id]');if(!b)return;const q=album(),id=b.dataset.soundId;
   if(!toggleMix(q,id)){if(note)note.textContent=`Tu mezcla ya tiene ${MIX_MAX}. Quita uno antes.`;return;}
   if(r.save?.()===false){toggleMix(q,id);if(note)note.textContent='No se guardó. Intenta otra vez.';return;}
   // Chosen: heard once now, on the next eighth.
   if(q.mix.includes(id)&&r.S.sound&&r.ac?.state==='running'&&r.beatSoon&&!mixOn)r.beatSoon(time=>playSoundMotif(r,id,time,{x:r.S.wx,y:r.S.wy},SOUND_MIX_GAIN),null,'player');
   if(!q.mix.length)mixOn=false;renderAlbum();});
  play?.addEventListener('click',()=>{if(mixOn){stopMix();return;}if(!albumOk()||!album().mix.length||!r.S.sound)return;if(r.ac?.state!=='running')r.audio?.();mixOn=true;playUI();});
  $('soundAlbumClose')?.addEventListener('click',closeAlbum);
  // Closed in any way (the button, Escape, the phone's back): the mix stops; from the Bitácora, back to it.
  new MutationObserver(()=>{if(box.hidden){const was=albumFromJournal;mixOn=false;albumFromJournal=false;playUI();if(was)r.openJournal?.('places');}}).observe(box,{attributes:true,attributeFilter:['hidden']});}
 // ---------- the Bitácora ----------
 function section(){if(!r.S)return '';book();const p={x:r.S.wx,y:r.S.wy},q=rumors(),a=album(),mark=r.universeMapState?.()?.book?.mark;let out='';
  if(rumorsOk()){const rows=q.open.map(e=>`<div class="rumor-open" data-rumor="${escape(e.id)}"><p>${escape(e.text)}</p><p class="rumor-now">Ahora · ${escape(rumorNow(e,p))}</p><div class="row">${mark&&mark.id===e.id?'<button type="button" disabled>Marcado</button>':`<button type="button" data-rumor-mark="${escape(e.id)}">Marcar</button>`}<button type="button" data-rumor-drop="${escape(e.id)}">Soltar</button></div></div>`).join('');
   const done=q.done.slice(-6).reverse().map(e=>`<p class="rumor-done">Cumplido · ${escape(e.name)}</p>`).join('');
   out+=`<details class="journal-section" data-journal-detail="Rumores" id="journalRumors"${q.open.length?' open':''}><summary>Rumores · ${q.open.length} de ${RUMOR_OPEN_MAX}</summary>${rows||'<p>Completa encuentros, figuras o actividades. A veces te cuentan algo lejano.</p>'}${done}</details>`;}
  if(albumOk()){const lines=SOUND_BIOMES.map(b=>{const s=seriesProgress(a,b);return `<p>${escape(SOUND_BIOME_NAMES[b])} · ${s.done} de ${s.total}${a.series[b]?' <em class="sky-earned">Aro</em>':''}</p>`;}).join('');
   out+=`<details class="journal-section" data-journal-detail="Álbum de sonidos" id="journalSounds"><summary>Álbum de sonidos · ${albumCount(a)} de ${SOUNDS.length}</summary><p>Cada paisaje guarda cinco sonidos raros. Se oyen antes de verse.</p>${lines}<div class="row"><button type="button" data-sound-album>Abrir el álbum</button></div></details>`;}
  return out;}
 $('journalBody')?.addEventListener('click',e=>{const t=e.target.closest?.('[data-rumor-mark],[data-rumor-drop],[data-sound-album]');if(!t)return;e.stopPropagation();
  if(t.dataset.soundAlbum!==undefined){openAlbum(true);return;}if(t.dataset.rumorMark&&markRumor(t.dataset.rumorMark))r.refreshJournal?.();else if(t.dataset.rumorDrop&&drop(t.dataset.rumorDrop))r.refreshJournal?.();});
 const cube=$('mCube');if(cube&&globalThis.MutationObserver)new MutationObserver(()=>{if(!cube.hidden){cubeKey='';syncCube();}}).observe(cube,{attributes:true,attributeFilter:['hidden']});
 // ---------- the map and tests ----------
 const forMap=()=>{if(!r.S)return [];book();return rumorsOk()?rumors().open.map(e=>({id:e.id,x:e.x,y:e.y,name:e.name,text:e.text,kind:e.kind})):[];};
 function spawnSound(id,dx=240,dy=0){const s=soundById(id);if(!s||!allowed())return null;book();const x=Math.round(r.S.wx+dx),y=Math.round(r.S.wy+dy),spot={id:'sonido:prueba:'+id+':'+x+','+y,sound:s.id,biome:s.biome,x,y};extra.set(spot.id,spot);while(extra.size>16)extra.delete(extra.keys().next().value);return spot;}
 Object.defineProperties(r,{
  discoverTick:{get:()=>tick},drawDiscover:{get:()=>draw},drawSoundRing:{get:()=>drawRing},discoverSection:{get:()=>section},rumorsForMap:{get:()=>forMap},
  openSoundAlbum:{get:()=>openAlbum},
  // Tests only (the runtime is never published): a rumor now, a sound placed ahead of the cube, the state.
  rumorGive:{get:()=>()=>allowed()?give(true):null},rumorDrop:{get:()=>drop},rumorMark:{get:()=>markRumor},soundSpawn:{get:()=>spawnSound},soundToggleRing:{get:()=>toggleRing},
  discoverState:{get:()=>()=>{book();return {rumors:rumors(),album:album(),allowed:allowed(),baseline,completed:completed(),mixOn,heard,summary:summary?.text||'',near:nearest({x:r.S.wx,y:r.S.wy}),drawn,wearing:wearing(),albumOpen:!!box&&!box.hidden};}}
 });
}
