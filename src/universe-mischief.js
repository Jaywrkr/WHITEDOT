import {openSurface,prefersReducedMotion} from './frame-state.js';
import {MISCHIEF,MISCHIEF_CELL,mischiefCell,normalizeMischief,createMischief,stepMischief} from './universe-mischief-model.js';
import {drawMischief,drawMischiefClue} from './universe-mischief-art.js';
import {crystalField} from './crystal-sparks.js';
import {creditSparks} from './sparks-model.js';
import {musicFamily} from './music-families.js';
import {mischiefReward} from './spark-rules.js';
export function playMischiefNote(r,index,time,source=null){
 if(!r.S.sound||r.ac?.state!=='running')return false;
 const d=r.regionOfPos(source?.x??r.S.wx,source?.y??r.S.wy),tones=r.chordTones(),instrument=musicFamily(d.genre)?.leads[0]||'p_gutguitar';if(!tones.length)return false;
 const emit=()=>{for(let i=0;i<(index===6?3:1);i++){const at=time+i*(r.SIX||.125)*2,note=tones[(index===6?i:index)%tones.length];r.hookInst(instrument,note,at,r.vel(index===6?.09:.06),d);r.mischiefAudioCue?.({instrument,note,time:at,index,gain:index===6?.09:.06});}};
 if(r.withVoiceOrigin)r.withVoiceOrigin('player',emit);else emit();return true;
}
// Arreglos de la media hora (Jay, alpha.242): a scene that does not move on says goodbye by itself after MISCHIEF_IDLE
// seconds of play (it bowed out of the way of nothing for minutes before), and from MISCHIEF_HOLD seconds without a step
// it holds nothing back: a living encounter or a figure of the sky may start, and the idle scene then goes quietly.
// A step is anything the scene counts: its stage, its turn round a sculpture, the drops, clues or relays, the imitator's
// turns (up to three), the march, the countdown, the breath held (up to 8 s).
export const MISCHIEF_IDLE=40,MISCHIEF_HOLD=10;
export const mischiefMark=s=>[s.stage,Math.floor((s.progress||0)*2),s.collected?.length||0,s.clues?.length||0,s.relay||0,s.kind==='imitator'?Math.min(3,s.turns||0):0,Math.floor((s.procession||0)/60),Math.floor(s.count||0),Math.min(8,Math.floor(s.held||0)),s.rank||'',s.done?1:0].join(',');
export function initialize(r){
 let farewell=null,owner=null,scope='',cache=new Map(),scene=null,clock=0,cooldown=0,streakUntil=0,blocked=null,queued=false,musicBar=-1,musicHits=0,frozenTimes=new WeakMap();
 const reach=s=>s&&['twin','farewell'].includes(s.kind)?1400:650;
 const reduced=()=>!!(r.S.reducedMotion||prefersReducedMotion()),
  active=()=>r.inWorld()&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!document.hidden&&!r.scanning&&!r.noticeLane?.inspecting&&!r.houseActive?.()&&!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 function book(){const key=JSON.stringify(r.worldIdentity)+':'+(r.S.layer||'superficie')+':'+r.S.todayKey;if(owner!==r.S||scope!==key){owner=r.S;scope=key;owner.mischief=normalizeMischief(owner.mischief);cache=new Map();scene=null;frozenTimes=new WeakMap();clock=cooldown=0;blocked=null;queued=false;farewell=null;}return owner.mischief;}
 function sites(){book();const out=[],x=Math.floor(r.S.wx/MISCHIEF_CELL),y=Math.floor(r.S.wy/MISCHIEF_CELL);for(let a=x-1;a<=x+1;a++)for(let b=y-1;b<=y+1;b++){const key=a+','+b;if(!cache.has(key)){cache.set(key,mischiefCell(a,b,r.seedOf,r.S.layer||'superficie'));while(cache.size>48)cache.delete(cache.keys().next().value);}for(const o of cache.get(key))if(Math.hypot(o.x-r.S.wx,o.y-r.S.wy)<650&&!r.regionOfPos(o.x,o.y).sea)out.push(o);}
  for(const o of r.totemNear?.(550)||[])out.push({id:'mischief:'+o.id,kind:'dance',x:o.x,y:o.y,seed:r.seedOf('mischief:dance:'+o.id)>>>0,target:o});return out;
 }
 function prepare(o){const s=createMischief(o,{x:r.S.wx,y:r.S.wy});if(o.kind==='helper'){s.target=crystalField(o.x,o.y,r.seedOf).filter(q=>q.size===3&&!r.savedCrystal?.(q.id)?.broken&&Math.hypot(q.x-o.x,q.y-o.y)<450).sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y))[0];if(!s.target)return null;}
  if(o.kind==='dance'&&!s.target){s.target=r.totemNear?.(500)?.[0];if(!s.target)return null;}
  if(o.kind==='farewell')s.relays=[...(r.inhabitantsNear?.(550)||[]),...(r.totemNear?.(600)||[])].slice(0,4).map(q=>({x:q.x,y:q.y}));
  s.replay=!!book().done[o.id];s.retryAt=0;return s;
 }
 function finish(){const s=scene,q=book();if(!s||q.version!==1)return false;if(q.done[s.id]){s.paid=true;s.reward=0;return true;}if(clock<s.retryAt)return false;s.retryAt=clock+2;
  const economy=r.sparkEconomy;if(!economy||economy.version!==1)return false;if(Object.keys(q.done).length>=4096){s.paid=true;s.reward=0;return true;}
  const before={mischief:structuredClone(q),sparkEconomy:structuredClone(economy),sparks:r.S.sparks,rewards:r.S.rewards?structuredClone(r.S.rewards):undefined};
  q.done[s.id]={kind:s.kind,at:r.S.todayKey};q.counts[s.kind]=Math.min(100000,(Number.isSafeInteger(q.counts[s.kind])?q.counts[s.kind]:0)+1);for(const flag of s.flags)q.tricks[flag]=true;
  if(s.target?.kind&&s.kind==='dance')q.sculptures[s.target.kind]=true;if(s.festival)q.tricks.festivalManager=true;
  const amount=creditSparks(r.S,mischiefReward(s.kind,s.x,s.y));economy.log.push({title:MISCHIEF.find(d=>d.id===s.kind).name,text:'Encuentro completado · +'+amount+' chispas',at:r.S.todayKey});economy.log=economy.log.slice(-80);
  if(r.save()===false){Object.assign(r.S,before);return false;}s.paid=true;s.reward=amount;r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});s.notes=[6];r.mischiefCompletionCue?.({kind:s.kind,id:s.id,amount});return true;
 }
 function music(){if(!scene?.notes.length||queued||!r.S.sound||r.ac?.state!=='running')return;const bar=Math.floor((r.MU.step||0)/16);if(bar!==musicBar){musicBar=bar;musicHits=0;}if(musicHits>=(scene.kind==='farewell'?6:2))return;musicHits++;const s=scene,state=r.S,key=scope,index=s.notes.shift();queued=true;
  r.beatSoon?.(time=>{queued=false;if(scene!==s||state!==r.S||scope!==key||key!==JSON.stringify(r.worldIdentity)+':'+(r.S.layer||'superficie')+':'+r.S.todayKey||!active()||Math.hypot(s.x-r.S.wx,s.y-r.S.wy)>reach(s))return;playMischiefNote(r,index,time,s.kind==='farewell'&&s.relays?.length?s.relays[Math.max(0,index-1)%s.relays.length]:null);},null,'player');
 }
 // H1 (alpha.233): mischief is of the open universe; inside a level (a chapter, a round, the finale) no scene stays or starts.
 function tick(dt,paused=false){const q=book();if(!r.inWorld()||r.activityActive||r.travelInLevel?.()||r.placeRun?.()){scene=null;queued=false;return;}if(paused||!active()||q.version!==1)return;const step=Math.max(0,Math.min(.05,dt||0));clock+=step;
  if(r.autopilotState?.mode==='wander'&&!r.autopilotState.paused){scene=null;return;}
  const player={x:r.S.wx,y:r.S.wy};if(scene&&Math.hypot(scene.x-player.x,scene.y-player.y)>reach(scene)){blocked=scene.id;scene=null;cooldown=clock+15;queued=false;}
  // One at a time: while a living encounter runs (live-encounters.js) no scene starts.
  // Idle long enough, it gives way to a living encounter or a figure; idle for MISCHIEF_IDLE, it says goodbye.
  if(scene&&!scene.done){const idle=clock-scene.movedAt;if(idle>=MISCHIEF_IDLE||idle>=MISCHIEF_HOLD&&(r.liveEncounterActive?.()||r.skyMapActive?.())){if(idle>=MISCHIEF_IDLE)farewell={x:scene.x,y:scene.y,until:clock+2.5};blocked=scene.id;scene=null;cooldown=clock+15;queued=false;}}
  if(!scene){if(clock<cooldown||r.liveEncounterActive?.()||r.skyMapActive?.())return;const candidates=sites().filter(o=>o.id!==blocked&&Math.hypot(o.x-player.x,o.y-player.y)<95);for(const o of candidates){scene=prepare(o);if(scene){frozenTimes=new WeakMap();scene.movedAt=clock;scene.mark=mischiefMark(scene);break;}}if(!scene){if(!sites().some(o=>o.id===blocked&&Math.hypot(o.x-player.x,o.y-player.y)<150))blocked=null;return;}}
  if(scene.done){if(!scene.paid)finish();scene.celebration=(scene.celebration||0)+step;music();if(scene.paid&&scene.celebration>3){blocked=scene.id;scene=null;cooldown=clock+12;streakUntil=clock+32;queued=false;}return;}
  if(scene.kind==='helper'&&scene.target){const view=r.crystalState?.near?.find(o=>o.id===scene.target.id),point=view&&(view.run||view.drop||view);if(point)scene.target={...scene.target,x:point.x,y:point.y};}
  const before=scene.stage;stepMischief(scene,player,step,{reduced:reduced(),broken:!!(scene.target&&r.savedCrystal?.(scene.target.id)?.broken),totem:r.totemNear?.(110)?.[0]});
  if(scene.kind==='audience'&&scene.stage===3&&before!==3&&scene.festival){const t=r.totemNear?.(110)?.[0];if(t)r.celebrateTotem?.(t);}
  {const mark=mischiefMark(scene);if(mark!==scene.mark){scene.mark=mark;scene.movedAt=clock;}}
  if(scene.done)finish();music();
 }
 // A scene busy enough to keep the others waiting: it is moving on (or celebrating).
 const busy=()=>!!scene&&(scene.done||clock-(scene.movedAt??clock)<MISCHIEF_HOLD);
 function drawFarewell(){if(!farewell||clock>farewell.until||r.S.universeTexts===false)return;const c=r.cx;c.save();c.globalAlpha=.8*Math.min(1,farewell.until-clock);c.fillStyle='#ddd';c.font='12px "Geist Mono",monospace';c.textAlign='center';c.fillText('Se despidió.',farewell.x+r.W/2-r.camX,farewell.y+r.H/2-r.camY+28);c.restore();}
 const frozen=o=>r.inWorld()&&!r.activityActive&&!!scene&&scene.kind==='breath'&&scene.stage===1&&!scene.done&&Math.hypot(o.x-scene.x,o.y-scene.y)<130;
 Object.defineProperties(r,{mischiefTick:{get:()=>tick},drawMischief:{get:()=>()=>{if(active()){if(!scene&&clock>=cooldown&&!r.liveEncounterActive?.()&&!r.skyMapActive?.()&&!(r.autopilotState?.mode==='wander'&&!r.autopilotState.paused))drawMischiefClue(r,sites(),reduced(),clock<streakUntil?600:320);drawMischief(r,scene,reduced());drawFarewell();}}},mischiefBusy:{get:()=>busy},mischiefFrozen:{get:()=>frozen},mischiefTime:{get:()=>(o,t)=>{if(!frozen(o))return t;if(!frozenTimes.has(o))frozenTimes.set(o,t);return frozenTimes.get(o);}},mischiefHush:{get:()=>active()&&!!scene&&scene.kind==='breath'&&scene.stage===1&&!scene.done},mischiefDancing:{get:()=>id=>!!scene&&scene.kind==='dance'&&scene.target?.id===id},mischiefNear:{get:()=>sites},mischiefState:{get:()=>({book:book(),scene,cache:cache.size,clock})}});book();
}
