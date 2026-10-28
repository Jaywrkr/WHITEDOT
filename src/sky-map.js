// Mapa del cielo (F1, Jay, 28 Oct 2026; docs/IDEAS_UNIVERSO.md#f1--constelaciones). Faint stars in the free World, after
// the Journey, never in a chapter, a round, a finale, an activity, the Refugio or another scene. Walking near a figure
// starts it: its name, the next star ringed in white and the white arrow. Pass through its stars in order; a pulse on
// time near the next one lights it (and the one after, if near too). Each star is a note of the place's scale; the line
// grows in one beat; the complete figure plays its motif of five to eight notes, an octave up, far under the music,
// and shines a moment. Walking away leaves it half-done and saved where it was (rules 2 and 4); coming back resumes it.
// Nothing is ever lost. One scene at a time with the living encounters and the mischief scenes, and the encounters'
// clock starts again after a figure (decision 11). Sparks once per figure; the zodiac complete gives the star halo.
import {openSurface,prefersReducedMotion} from './frame-state.js';
import {hashKey,newRegionOf} from './universe-regions.js';
import {creditSparks} from './sparks-model.js';
import {musicFamily} from './music-families.js';
import {freeOpen} from './journey-mode.js';
import {SKY_VERSION,SKY_CELL,SKY_START,SKY_LEAVE,SKY_HINT,SKY_SCALE,SKY_NOTICE,SKY_SUMMARY,SKY_GLOW,SKY_STAR_GAIN,SKY_MOTIF_GAIN,SKY_MAX_OPEN,SKY_FIGURES,SKY_SERIES,skyFigure,skySeries,skyCell,skyStar,skyNote,skyStarDegree,skyStep,skyReward,skyNight,skyDirection,skyForced,skySeriesProgress,skyZodiacComplete,normalizeSkyMap} from './sky-map-model.js';
import {drawSkySite,drawSkyScene,drawSkyHint,drawSkyWords,drawSkyHalo,skyFigureSvg} from './sky-map-art.js';
// One note of the place's scale (the harmony that sounds), in the place's own lead, far under the music. octave: 1 for a
// star, 2 for the motif (an octave above the stars).
export function playSkyNote(r,fig,degree,time,point,gain=SKY_STAR_GAIN,octave=1){
 if(!r.S.sound||r.ac?.state!=='running')return false;
 const d=r.regionOfPos(point.x,point.y),scale=r.MU?.dnaA?.scale||d?.scale;let note=skyNote(scale,57+(r.MU?.tr||0)+12*octave,degree);while(note>96)note-=12;
 const instrument=musicFamily(d?.genre)?.leads[0]||'p_gutguitar';
 const emit=()=>{r.hookInst(instrument,note,time,r.vel(gain),d);r.skyAudioCue?.({fig,instrument,note,time,gain,degree,octave});};
 if(r.withVoiceOrigin)r.withVoiceOrigin('player',emit);else emit();return true;
}
// The motif: its notes on the eighths, from a time on the grid.
export function playSkyMotif(r,fig,time,point,gain=SKY_MOTIF_GAIN){const f=skyFigure(fig);if(!f)return 0;const step=(r.SIX||.125)*2;let n=0;f.motif.forEach((degree,k)=>{if(playSkyNote(r,fig,degree,time+k*step,point,gain,2))n++;});return n;}
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function initialize(r){
 let owner=null,scope='',world='',cache=new Map(),born=new Map(),extra=new Map(),scene=null,clock=0,last=null,heading=null,travel=0,seen=new WeakSet(),notice=null,summary=null,cubeKey='';
 const forced=skyForced(),el=id=>r.$?.(id)||null;
 const reduced=()=>!!(r.S.reducedMotion||prefersReducedMotion());
 // Where it lives: the free World's surface after the Journey, outside every level, activity, the Refugio and the finales.
 const allowed=()=>r.inWorld()&&(r.S.layer||'superficie')==='superficie'&&freeOpen(r.S.journey)&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!r.houseActive?.()&&!r.travelInLevel?.()&&!r.placeRun?.()&&!r.placeCardDue?.()&&!r.songStageState?.()?.running&&!r.journeyFinaleState?.()?.running;
 const paused=()=>document.hidden||!!r.scanning||!!r.noticeLane?.inspecting||!!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 const wandering=()=>r.autopilotState?.mode==='wander'&&!r.autopilotState.paused;
 // One scene at a time: a living encounter or a mischief scene keeps the stars asleep.
 const busy=()=>!!r.liveEncounterActive?.()||!!r.mischiefState?.scene;
 function book(){const key=JSON.stringify(r.worldIdentity)+':'+(r.S.layer||'superficie');if(owner!==r.S||scope!==key){const fresh=owner!==r.S;owner=r.S;scope=key;owner.skyMap=normalizeSkyMap(owner.skyMap);world=Math.floor(hashKey(JSON.stringify(r.worldIdentity))*4294967296).toString(36);cache=new Map();born=new Map();extra=new Map();scene=null;notice=null;summary=null;last=null;if(fresh)travel=0;}return owner.skyMap;}
 const today=()=>r.S.todayKey||'';
 const under=(x,y)=>{const d=r.regionOfPos(x,y);return {biome:d?.sea?'vacio':r.BIOMES?.[d?.z]?.id||'vacio',region:d?.sea?newRegionOf(d.key,true)?.id||null:null};};
 function cell(i,j,night){const key=i+','+j+':'+(night?1:0);if(!cache.has(key)){cache.set(key,skyCell(world,i,j,under,{night}));while(cache.size>64)cache.delete(cache.keys().next().value);}return cache.get(key);}
 // The figures around a point: those of the nine cells around it, then the saved ones (and this session's forced ones),
 // a saved entry standing for its site.
 function around(p,radius){const q=book(),night=skyNight(),out=new Map(),i0=Math.floor(p.x/SKY_CELL),j0=Math.floor(p.y/SKY_CELL);
  for(let i=i0-1;i<=i0+1;i++)for(let j=j0-1;j<=j0+1;j++){const s=cell(i,j,night);if(s&&Math.hypot(s.x-p.x,s.y-p.y)<radius)out.set(s.id,{...s,lit:0,done:false,onTime:false});}
  for(const s of extra.values())if(Math.hypot(s.x-p.x,s.y-p.y)<radius)out.set(s.id,s);
  if(q.version===SKY_VERSION)for(const [id,s] of Object.entries(q.sites))if(skyFigure(s.fig)&&Math.hypot(s.x-p.x,s.y-p.y)<radius)out.set(id,Object.assign(s,{id}));
  if(scene)out.set(scene.site.id,scene.site);return [...out.values()];}
 const nameOf=(f,shown)=>f.secret&&!shown?'???':f.name;
 const known=fig=>(book().figures?.[fig]?.done||0)>0;
 function say(title,hint=''){notice={title,hint,until:clock+SKY_NOTICE};summary=null;}
 function start(site){const f=skyFigure(site.fig),n=f.stars.length;scene={site,age:0,stage:'run',over:0,litAt:{},tries:0,paid:false,reward:0};travel=0;for(const w of r.waves||[])seen.add(w);
  // A short notice with its name (rule 1); a figure left half-done says where you are in it.
  if(site.lit>0)say(nameOf(f,known(f.id))+' · '+site.lit+' de '+n,'La dejaste aquí. Sigue.');
  else if(known(f.id))say(f.name+' · ya en tu mapa','Únela otra vez, si quieres.');
  else say('Mapa del cielo · '+nameOf(f,false),'Pasa por sus estrellas en orden.');}
 // A new figure is saved with its first star (rule 4); the unfinished ones keep a bounded list, the oldest go first.
 function keep(site){const q=book();if(q.version!==SKY_VERSION)return;if(!q.sites[site.id]){const {id,fig,x,y,turn,lit,done,onTime}=site;q.sites[id]=site;Object.assign(site,{id,fig,x,y,turn:turn||0,lit,done,onTime,at:today()});delete site.kind;extra.delete(id);
   const open=Object.keys(q.sites).filter(k=>!q.sites[k].done);while(open.length>SKY_MAX_OPEN)delete q.sites[open.shift()];}
  site.at=today();r.save();}
 function light(k){const s=scene,site=s.site,f=skyFigure(site.fig),state=r.S;s.litAt[k]=null;
  // Its note, on the next eighth; the line grows from when it is heard. Without sound the line grows now.
  if(r.S.sound&&r.ac?.state==='running'&&r.beatSoon)r.beatSoon(time=>{if(state!==r.S||scene!==s)return;playSkyNote(r,site.fig,skyStarDegree(f,k),time,skyStar(site,k));},()=>{if(scene===s)s.litAt[k]=clock;},'player');else s.litAt[k]=clock;}
 function pay(){const s=scene,q=book(),site=s.site,f=skyFigure(site.fig);if(s.paid||clock<(s.retryAt||0))return;s.retryAt=clock+2;s.tries++;
  const economy=r.sparkEconomy;if(!economy||economy.version!==1||q.version!==SKY_VERSION||s.tries>3){s.paid=true;s.reward=0;return;}
  const had=q.figures[f.id],before={figure:had?{...had}:undefined,earned:q.earned,halo:q.halo,wear:{...q.wear},sparks:r.S.sparks,sparkEconomy:structuredClone(economy),saved:!!q.sites[site.id]};
  const k=q.figures[f.id]||={first:'',done:0,onTime:0},first=!k.done;if(first)k.first=today();k.done++;if(site.onTime)k.onTime++;
  let amount=0;if(first){amount=creditSparks(r.S,skyReward(site,true));q.earned+=amount;economy.log.push({title:f.name,text:`Mapa del cielo · +${amount} chispas`,at:today()});economy.log=economy.log.slice(-80);}
  // The zodiac complete: the star halo, on at once (Tu cubo → Llevar takes it off).
  const halo=first&&!q.halo&&skyZodiacComplete(q);if(halo){q.halo={at:today()};q.wear.halo=true;}
  if(!q.sites[site.id])keep(site);else site.at=today();
  if(r.save()===false){if(before.figure)q.figures[f.id]=before.figure;else delete q.figures[f.id];q.earned=before.earned;q.halo=before.halo;q.wear=before.wear;r.S.sparks=before.sparks;r.S.sparkEconomy=before.sparkEconomy;if(!before.saved)delete q.sites[site.id];return;}
  s.paid=true;s.reward=amount;s.first=first;s.halo=halo;if(amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});
  // One notice, naming one thing, the first time: the figure, or the halo when it closes the zodiac.
  if(!r.achievementsCalm?.()){if(halo)r.toast?.('<em>Halo de estrellas</em> · Zodiaco completo',{level:2,category:'ganado'});else if(first)r.toast?.('<em>Constelación nueva</em> · '+f.name,{level:2,category:'ganado'});}
  cubeKey='';}
 function complete(){const s=scene,site=s.site,state=r.S;s.stage='done';s.over=0;site.done=true;
  // The motif, an octave up, from the next eighth; quiet, never with sound off.
  if(r.S.sound&&r.ac?.state==='running'&&r.beatSoon)r.beatSoon(time=>{if(state!==r.S)return;playSkyMotif(r,site.fig,time,{x:site.x,y:site.y});},null,'player');
  pay();}
 // The end of a scene: the summary line, and the encounters' clock starts again (one scene every 60–90 s, decision 11).
 function end(text){summary=text?{text,until:clock+SKY_SUMMARY}:null;notice=null;scene=null;travel=0;r.liveEncounterRest?.();}
 function leave(){const s=scene,site=s.site,f=skyFigure(site.fig);if(s.stage==='done'){if(!s.paid)pay();end('');return;}
  // Half-done stays saved where it was; nothing joined, nothing to keep.
  end(site.lit>0?nameOf(f,known(f.id))+' · '+site.lit+' de '+f.stars.length+' · guardada':'');}
 function spawnForced(fig){const f=skyFigure(fig);if(!f)return false;const a=heading??0,x=r.S.wx+Math.cos(a)*170,y=r.S.wy+Math.sin(a)*170,id='cielo:'+fig+':'+Math.round(x)+':'+Math.round(y);
  const site={id,fig,x,y,turn:0,lit:0,done:false,onTime:false};extra.set(id,site);while(extra.size>16)extra.delete(extra.keys().next().value);start(site);return true;}
 function nearest(p){let best=null,bd=Infinity;for(const s of around(p,SKY_START+1)){if(s.done)continue;const d=Math.hypot(s.x-p.x,s.y-p.y);if(d<SKY_START&&d<bd){best=s;bd=d;}}return best;}
 function tick(dt,modal=false){
  const q=book();syncCube();if(q.version!==SKY_VERSION){scene=null;return;}
  // Outside the free World (a level, an activity, the Refugio, a finale) the stars simply wait; nothing is lost.
  if(!allowed()){if(scene){if(scene.stage==='done'&&!scene.paid)pay();scene=null;}notice=null;summary=null;last=null;return;}
  if(modal||paused())return;const step=Math.max(0,Math.min(.05,dt||0));clock+=step;
  const player={x:r.S.wx,y:r.S.wy};let moving=false;
  if(last){const dx=player.x-last.x,dy=player.y-last.y,l=Math.hypot(dx,dy);if(l>.5&&l<60){const a=Math.atan2(dy,dx);heading=heading==null?a:heading+Math.atan2(Math.sin(a-heading),Math.cos(a-heading))*Math.min(1,step*6);moving=step>0&&l/step>25;}}last=player;
  if(notice&&clock>notice.until)notice=null;if(summary&&clock>summary.until)summary=null;
  if(!scene){if(busy()||wandering())return;
   const s=nearest(player);if(s){start(s);return;}
   if(forced){if(moving)travel+=step;if(travel>=3)spawnForced(forced);}return;}
  const s=scene,site=s.site;s.age+=step;
  if(s.stage==='done'){s.over+=step;if(!s.paid)pay();if(s.over>=SKY_GLOW){const f=skyFigure(site.fig);end(f.name+' · completa · '+(s.reward>0?'+'+s.reward+' ✦':s.first===false?'ya en tu mapa':'sin premio'));}return;}
  if(Math.hypot(site.x-player.x,site.y-player.y)>SKY_LEAVE){leave();return;}
  const pulses=[];for(const w of r.waves||[])if(!seen.has(w)){seen.add(w);if(w.origin==='player')pulses.push({x:w.x,y:w.y,beat:!!w.beat});}
  const before=site.lit;skyStep(site,player,pulses);
  if(site.lit>before){for(let k=before;k<site.lit;k++)light(k);notice=null;if(site.done)complete();else keep(site);}
 }
 function draw(){if(!allowed())return;const q=book();if(q.version!==SKY_VERSION)return;const p={x:r.S.wx,y:r.S.wy},view=Math.hypot(r.W,r.H)/2+SKY_SCALE+40,still=reduced();
  let hint=null,hd=Infinity;
  for(const s of around(p,SKY_HINT)){const d=Math.hypot(s.x-p.x,s.y-p.y);
   if(d<view&&s!==scene?.site){if(!born.has(s.id)){born.set(s.id,clock);while(born.size>128)born.delete(born.keys().next().value);}drawSkySite(r,s,{appear:Math.min(1,(clock-born.get(s.id))/.8),reduced:still});}
   const sx=s.x+r.W/2-r.camX,sy=s.y+r.H/2-r.camY,off=sx<-SKY_SCALE*.5||sy<-SKY_SCALE*.5||sx>r.W+SKY_SCALE*.5||sy>r.H+SKY_SCALE*.5;if(!s.done&&off&&d<hd){hint={x:sx,y:sy};hd=d;}}
  if(scene)drawSkyScene(r,scene,{reduced:still,clock,beat:(r.SIX||.125)*4});
  else if(hint&&!busy())drawSkyHint(r,hint.x,hint.y,.35+.25*(1-hd/SKY_HINT));
  drawSkyWords(r,{title:notice?.title||'',hint:notice?.hint||'',summary:scene?'':summary?.text||''});}
 // The star halo round the cube (gold: it is earned), in the World and in Tu cubo's preview.
 const wearingHalo=()=>{const q=book();return q.version===SKY_VERSION&&!!q.halo&&q.wear?.halo!==false;};
 function haloDraw(c,x,y,size,t,still){if(!wearingHalo())return;if(c===r.cx&&!r.inWorld())return;drawSkyHalo(c,x,y,size,t,{reduced:still??reduced()});}
 // Tu cubo → Llevar: the halo, once earned, is put on or taken off like the other earned pieces.
 function syncCube(){const box=el('cubeSkySection'),list=el('cubeSkyOptions');if(!box||!list)return;const q=book(),earned=q.version===SKY_VERSION&&!!q.halo,on=earned&&q.wear?.halo!==false,key=(earned?1:0)+':'+(on?1:0)+':'+(el('mCube')?.hidden?0:1);if(key===cubeKey)return;cubeKey=key;box.hidden=!earned;if(!earned){list.replaceChildren();return;}
  let b=el('cubeSkyHalo');if(!b){b=document.createElement('button');b.type='button';b.id='cubeSkyHalo';b.className='cube-option';b.dataset.earned='true';b.textContent='Halo de estrellas';b.title='Zodiaco completo';b.onclick=toggleHalo;list.replaceChildren(b);}b.setAttribute('aria-pressed',String(on));}
 function toggleHalo(){const q=book();if(q.version!==SKY_VERSION||!q.halo)return false;const before=q.wear.halo;q.wear.halo=before===false;if(r.save()===false){q.wear.halo=before;const h=el('cubeHint');if(h)h.textContent='No se guardó. Intenta otra vez.';}cubeKey='';syncCube();return q.wear.halo!==before;}
 // Letting go of a half-done figure (rule 5): its stars go back to faint, nothing else changes.
 function release(id){const q=book();if(q.version!==SKY_VERSION)return false;const site=q.sites[id];if(!site||site.done)return false;delete q.sites[id];if(r.save()===false){q.sites[id]=site;return false;}if(scene?.site===site)scene=null;extra.delete(id);born.delete(id);site.lit=0;site.onTime=false;return true;}
 // The Bitácora: the half-done figures first, then each series with its figures drawn (silhouettes until joined).
 function section(){const q=book();if(q.version!==SKY_VERSION)return '';const p={x:r.S.wx,y:r.S.wy},open=Object.entries(q.sites).filter(([,s])=>!s.done&&skyFigure(s.fig)).slice(-5).reverse(),total=SKY_FIGURES.length,done=SKY_FIGURES.filter(f=>known(f.id)).length;
  const half=new Map();for(const [,s] of open)if(!known(s.fig))half.set(s.fig,Math.max(half.get(s.fig)||0,s.lit));
  const rows=open.map(([id,s])=>{const f=skyFigure(s.fig);return `<div class="sky-open"><span>${escape(nameOf(f,known(f.id)))} · ${s.lit} de ${f.stars.length} · ${escape(skyDirection(p,s))}</span><button type="button" data-sky-release="${escape(id)}">Soltar</button></div>`;}).join('');
  const series=SKY_SERIES.map(se=>{const pr=skySeriesProgress(q,se.id),prize=se.id==='zodiaco'&&q.halo?' <em class="sky-earned">Halo de estrellas</em>':'';
   return `<h3 class="sky-series" data-sky-series="${se.id}">${escape(se.name)} · ${pr.done} de ${pr.total}${prize}</h3><div class="sky-album">`+skySeries(se.id).map(f=>{const ok=known(f.id),lit=half.get(f.id)||0;return `<article class="sky-figure" data-sky-figure="${f.id}" data-state="${ok?'done':lit?'half':'none'}">${skyFigureSvg(f,lit,ok)}<h4>${escape(nameOf(f,ok))}</h4></article>`;}).join('')+'</div>';}).join('');
  return `<details class="journal-section" data-journal-detail="Mapa del cielo" id="journalSkyMap"><summary>Mapa del cielo · ${done} de ${total}</summary>${open.length?'<h3 class="sky-series">A medias</h3>'+rows:''}${series}</details>`;}
 el('journalBody')?.addEventListener('click',e=>{const b=e.target.closest?.('[data-sky-release]');if(!b)return;e.stopPropagation();if(release(b.dataset.skyRelease))r.refreshJournal?.();});
 Object.defineProperties(r,{
  skyMapTick:{get:()=>tick},drawSkyMap:{get:()=>draw},drawSkyMapHalo:{get:()=>haloDraw},
  skyMapActive:{get:()=>()=>!!scene},skyMapSection:{get:()=>section},
  // Tests only (the runtime is never published): bring a figure now, read the state, let go of one, the halo button.
  skyMapSpawn:{get:()=>fig=>allowed()&&!scene&&!busy()&&!!skyFigure(fig)&&spawnForced(fig)},
  skyMapRelease:{get:()=>release},skyMapToggleHalo:{get:()=>toggleHalo},
  skyMapState:{get:()=>()=>({book:book(),scene,clock,travel,forced,allowed:allowed(),title:notice?.title||'',hint:notice?.hint||'',summary:summary?.text||'',near:around({x:r.S.wx,y:r.S.wy},SKY_HINT).map(s=>({id:s.id,fig:s.fig,x:s.x,y:s.y,lit:s.lit,done:s.done})),halo:wearingHalo()})}
 });book();
}
