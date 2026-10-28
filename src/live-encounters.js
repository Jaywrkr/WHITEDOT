// Living encounters in the free World (docs/HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos). One every 60–90 s of travel,
// ahead of the cube, never in a chapter, a round, under a finale, inside an activity or while a mischief scene plays.
// Each biome offers something to chase and something to flee; the hash of the world and the count picks one (liveFor).
// Completing one pays sparks (more with a pulse on time) and the first of each kind goes to the Bitácora; failing costs
// nothing: a threat that reaches the cube only nudges it aside a second. Sound: at most one quiet note of the place's
// harmony on the catch or the escape, far under the music; the music is untouched.
import {openSurface,prefersReducedMotion} from './frame-state.js';
import {audibleTime} from './journey-pulse.js';
import {hashKey} from './universe-regions.js';
import {creditSparks} from './sparks-model.js';
import {musicFamily} from './music-families.js';
import {LIVE_VERSION,LIVE_ENCOUNTERS,LIVE_COLORS,liveDefinition,liveFor,liveInterval,liveSpawnPoint,normalizeLive,createLive,stepLive,liveFinished,liveReward,liveForced,liveWon,liveLost} from './live-encounters-model.js';
import {drawLive} from './live-encounters-art.js';
// The catch note: one note of the harmony that sounds, an octave up, in the place's own lead, far under the music.
export const LIVE_NOTE_GAIN=.02;
export function playLiveNote(r,kind,time,point,gain=LIVE_NOTE_GAIN){
 if(!r.S.sound||r.ac?.state!=='running')return false;
 const d=r.regionOfPos(point.x,point.y),tones=r.chordTones?.()||[],index=Math.max(0,LIVE_ENCOUNTERS.findIndex(e=>e.id===kind));if(!tones.length)return false;
 const instrument=musicFamily(d.genre)?.leads[0]||'p_gutguitar',note=tones[index%tones.length]+12;
 const emit=()=>{r.hookInst(instrument,note,time,r.vel(gain),d);r.liveAudioCue?.({kind,instrument,note,time,gain});};
 if(r.withVoiceOrigin)r.withVoiceOrigin('player',emit);else emit();return true;
}
export function initialize(r){
 let owner=null,scope='',scene=null,travel=0,clock=0,last=null,heading=null,seen=new WeakSet(),line=null,queued=false;
 const forced=liveForced();
 const reduced=()=>!!(r.S.reducedMotion||prefersReducedMotion());
 // Where encounters live: the free World's surface, outside every level, activity, the Refugio and the finales.
 const allowed=()=>r.inWorld()&&(r.S.layer||'superficie')==='superficie'&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!r.houseActive?.()&&!r.travelInLevel?.()&&!r.placeRun?.()&&!r.placeCardDue?.()&&!r.songStageState?.()?.running&&!r.journeyFinaleState?.()?.running;
 // While a menu or a card is open, or the page is hidden, everything waits as it is.
 const paused=()=>document.hidden||!!r.scanning||!!r.noticeLane?.inspecting||!!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 const wandering=()=>r.autopilotState?.mode==='wander'&&!r.autopilotState.paused;
 // One at a time: no encounter while a mischief scene plays (universe-mischief.js waits for us in the same way).
 const mischiefBusy=()=>!!r.mischiefState?.scene;
 function book(){const key=JSON.stringify(r.worldIdentity)+':'+(r.S.layer||'superficie');if(owner!==r.S||scope!==key){const fresh=owner!==r.S;owner=r.S;scope=key;owner.liveEncounters=normalizeLive(owner.liveEncounters);scene=null;line=null;queued=false;last=null;if(fresh)travel=0;}return owner.liveEncounters;}
 const need=()=>forced?3:liveInterval(scope,book().count);
 const biomeAt=(x,y)=>{const d=r.regionOfPos(x,y);return d?.sea?'vacio':r.BIOMES?.[d?.z]?.id||'vacio';};
 const colorOf=s=>r.placeColor?.(s.biome,LIVE_COLORS[s.biome])||LIVE_COLORS[s.biome]||'#ffffff';
 function spawn(kind=null){
  const q=book();if(q.version!==LIVE_VERSION||scene)return false;const player={x:r.S.wx,y:r.S.wy},n=q.count;
  // Chase or flee: the same roll as batch 1 (below one half, the chase it always had; from one half up, the biome's «huir»).
  const def=kind?liveDefinition(kind):liveFor(biomeAt(player.x,player.y),hashKey('live:pick:v1:'+scope+':'+n));if(!def)return false;
  const point=liveSpawnPoint(player,heading??0,scope,n);scene=createLive(def,point,player,{now:clock});q.count=n+1;travel=0;
  // Pulses already in flight are not this encounter's.
  for(const w of r.waves||[])seen.add(w);
  line={text:def.line,until:clock+3};return true;
 }
 function phase(){const ac=r.ac,bq=r.MU?.bq,six=r.SIX;if(!ac||!r.S.sound||ac.state!=='running'||!bq?.length||!(six>0))return undefined;const now=audibleTime(ac),beat=bq.findLast(t=>t<=now);return beat===undefined?undefined:((now-beat)/(six*4))%1;}
 function pay(){
  const s=scene,q=book(),def=liveDefinition(s.kind);if(s.paid||clock<(s.retryAt||0))return;s.retryAt=clock+2;s.tries=(s.tries||0)+1;
  const economy=r.sparkEconomy;if(!economy||economy.version!==1||q.version!==LIVE_VERSION||s.tries>3){s.paid=true;s.reward=0;s.unsaved=s.tries>3;return;}
  const before={liveEncounters:structuredClone(q),sparkEconomy:structuredClone(economy),sparks:r.S.sparks,elementBook:r.S.elementBook===undefined?undefined:structuredClone(r.S.elementBook)};
  const k=q.kinds[s.kind]||={first:'',caught:0,onTime:0,escaped:0},first=!k.caught;if(first)k.first=r.S.todayKey||'';k.caught++;if(s.onTime)k.onTime++;q.caught++;
  const amount=creditSparks(r.S,liveReward(s));q.earned+=amount;economy.log.push({title:def.name,text:`Encuentro vivo · +${amount} chispas`,at:r.S.todayKey});economy.log=economy.log.slice(-80);
  // The first of each kind stays in the Bitácora, with the other finds (element-book-model.js).
  if(first)r.recordElement?.('live:'+s.kind,r.regionOfPos(s.x,s.y));
  if(r.save()===false){Object.assign(r.S,before);if(before.elementBook===undefined)delete r.S.elementBook;r.elementBookUI?.();return;}
  s.paid=true;s.reward=amount;r.showSparkPickup?.(amount,s.verb==='huir'?{x:r.S.wx,y:r.S.wy}:{x:s.x,y:s.y});
  // D3: one notice, naming only this encounter, the first time; later catches show only their sparks.
  if(first&&!r.achievementsCalm?.())r.toast?.('<em>Encuentro nuevo</em> · '+def.name,{level:2,category:'ganado'});
  if(!queued&&r.S.sound&&r.ac?.state==='running'&&r.beatSoon){queued=true;const state=r.S,mine=s;r.beatSoon(time=>{queued=false;if(state!==r.S||scene!==mine||!allowed())return;playLiveNote(r,mine.kind,time,mine);},null,'player');}
 }
 function tick(dt,modal=false){
  const q=book();if(q.version!==LIVE_VERSION){scene=null;return;}
  // Outside the free World, in a level, an activity or the Refugio it simply goes: nothing counted, nothing lost.
  if(!allowed()){scene=null;line=null;last=null;return;}
  if(modal||paused())return;const step=Math.max(0,Math.min(.05,dt||0));clock+=step;
  const player={x:r.S.wx,y:r.S.wy};let moving=false;
  if(last){const dx=player.x-last.x,dy=player.y-last.y,l=Math.hypot(dx,dy);if(l>.5&&l<60){const a=Math.atan2(dy,dx);heading=heading==null?a:heading+Math.atan2(Math.sin(a-heading),Math.cos(a-heading))*Math.min(1,step*6);moving=step>0&&l/step>25;}}last=player;
  if(line&&clock>line.until)line=null;
  if(!scene){if(moving&&!wandering()&&!mischiefBusy())travel+=step;if(travel>=need())spawn(forced);return;}
  const pulses=[];for(const w of r.waves||[])if(!seen.has(w)){seen.add(w);if(w.origin==='player')pulses.push({x:w.x,y:w.y,beat:!!w.beat});}
  const was=scene.stage;stepLive(scene,player,step,{pulses,beatPhase:phase()});
  // A threat's pull (the well, the black hole) and the short nudge when one reaches the cube move it a little.
  if(scene.drag){r.S.wx+=scene.drag.x*step;r.S.wy+=scene.drag.y*step;}
  if(liveLost(scene)&&was==='run'){const k=q.kinds[scene.kind]||={first:'',caught:0,onTime:0,escaped:0};k.escaped++;if(scene.stage==='hit')k.hit=(k.hit||0)+1;line={text:liveDefinition(scene.kind).bye,until:clock+1.6};}
  if(liveWon(scene))pay();
  if(liveFinished(scene)&&(liveLost(scene)||scene.paid)){scene=null;travel=0;}
 }
 function draw(){if(!allowed()||!scene&&!line)return;drawLive(r,scene,{color:scene?colorOf(scene):'#ffffff',reduced:reduced(),line:line?.text||'',clock});}
 Object.defineProperties(r,{
  liveTick:{get:()=>tick},drawLive:{get:()=>draw},
  liveEncounterActive:{get:()=>()=>!!scene},
  // Tests only (the runtime is never published): start one now, read the state.
  liveEncounterSpawn:{get:()=>kind=>allowed()&&!mischiefBusy()&&!!liveDefinition(kind)&&spawn(kind)},
  liveEncounterState:{get:()=>()=>({book:book(),scene,travel,need:need(),clock,line:line?.text||'',forced,allowed:allowed()})}
 });book();
}
