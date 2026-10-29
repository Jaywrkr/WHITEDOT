import {openSurface} from './frame-state.js';
import {WONDERS} from './musical-wonders-model.js';
import {playWonderNote} from './musical-wonders-audio.js';
import {ACTIVITIES,ACTIVITY_CELL,ACTIVITY_TILE,activityCell,activityDefinition,activityLevel,activityState,moveActivity,updateActivity,normalizeActivities} from './universe-activities-model.js';
import {drawActivity,drawActivityPortal} from './universe-activities-art.js';
import {creditSparks} from './sparks-model.js';
import {activityReward} from './spark-rules.js';
export function initialize(r){
 let owner=null,scope='',cache=new Map(),current=null,clock=0,last=null,waiting=null,hold=0,blocked=null,retry=0;
 const ready=()=>r.inWorld()&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!document.hidden&&!r.scanning&&!r.noticeLane?.inspecting;
 function book(){const key=JSON.stringify(r.worldIdentity)+':'+(r.S.layer||'superficie');if(owner!==r.S||scope!==key){owner=r.S;scope=key;owner.activities=normalizeActivities(owner.activities);if(owner.activities.version===1){const types={...owner.activities.types};for(const [id,done]of Object.entries(owner.activities.done)){const m=id.match(/^activity:v1:(superficie|bajo|cielo):(-?\d+),(-?\d+)$/);if(done&&m){const kind=activityCell(Number(m[2]),Number(m[3]),r.seedOf,m[1])[0]?.kind;if(kind)types[kind]=true;}}owner.activities.types=types;}cache=new Map();current=null;document.body?.classList.toggle('activity-open',false);last=null;waiting=null;hold=0;blocked=null;}return owner.activities;}
 function portals(){book();const out=[],x=Math.floor(r.S.wx/ACTIVITY_CELL),y=Math.floor(r.S.wy/ACTIVITY_CELL);for(let a=x-1;a<=x+1;a++)for(let b=y-1;b<=y+1;b++){const key=a+','+b;if(!cache.has(key)){cache.set(key,activityCell(a,b,r.seedOf,r.S.layer||'superficie'));while(cache.size>48)cache.delete(cache.keys().next().value);}out.push(...cache.get(key).filter(o=>Math.hypot(o.x-r.S.wx,o.y-r.S.wy)<750));}return out;}
 function enter(o){const q=book();if(q.version!==1||!ready())return false;const level=activityLevel(o.kind,o.seed),oldProgress={...q.progress},raw=q.progress[o.id],state=activityState(level,raw?.done?null:raw);if(raw?.done&&Array.isArray(raw.trace))state.ghost=raw.trace;
  delete q.progress[o.id];q.progress[o.id]=state;for(const k of Object.keys(q.progress).slice(0,-32))delete q.progress[k];if(r.save()===false){q.progress=oldProgress;return false;}
  current={o,level,state,scope,paid:false,resetHold:0,retryAt:0};document.body?.classList.toggle('activity-open',true);r.stopAutopilot?.();r.ptr=null;r.waves=[];r.MU.near=[];r.MU.singers=[];return true;
 }
 function leave(){if(!current)return false;blocked=current.o.id;r.save();r.stopAutopilot?.();current=null;document.body?.classList.toggle('activity-open',false);waiting=null;hold=0;r.ptr=null;return true;}
 function finish(){const q=book(),a=current;if(!a||q.version!==1)return false;if(q.done[a.o.id])return true;
  if(clock<a.retryAt)return false;a.retryAt=clock+2;if(Object.keys(q.done).length>=8192)return true;
  const economy=r.sparkEconomy;if(!economy||economy.version!==1)return false;const before={balance:r.S.sparks,economy:structuredClone(economy)};
  const previousTypes={...q.types};q.types={...q.types,[a.o.kind]:true};q.done[a.o.id]=true;const amount=creditSparks(r.S,activityReward(a.o.kind,a.o.x,a.o.y));economy.log.push({title:a.level.def.name,text:'Actividad completada · +'+amount+' chispas',at:r.S.todayKey});economy.log=economy.log.slice(-80);
  if(r.save()===false){delete q.done[a.o.id];q.types=previousTypes;r.S.sparks=before.balance;r.S.sparkEconomy=before.economy;return false;}a.paid=true;
  const active=a;if(r.S.sound&&r.ac?.state==='running')r.beatSoon?.(time=>{if(current!==active||!ready()||openSurface('.modal:not([hidden])')||!r.S.sound)return;const tones=r.chordTones();for(let i=0;i<3;i++)r.hookInst('feltpiano',tones[i%tones.length],time+i*(r.SIX||.125)*2,r.vel(.06),r.regionOfPos(r.S.wx,r.S.wy));},null,'player');return true;
 }
 // H1 (alpha.233): activities are of the open universe; none opens inside a level (a chapter, a round, the finale).
 function tick(dt,paused=false){book();if(current||paused||!ready()||r.travelInLevel?.()||r.placeRun?.()||openSurface('.modal:not([hidden])'))return;clock+=Math.max(0,Math.min(.05,dt||0));const p={x:r.S.wx,y:r.S.wy},moved=last?Math.hypot(p.x-last.x,p.y-last.y):0;last=p;
  if(r.autopilotState?.mode==='wander'&&!r.autopilotState.paused)return;
  const near=portals().find(o=>Math.hypot(o.x-p.x,o.y-p.y)<38);if(blocked&&!portals().some(o=>o.id===blocked&&Math.hypot(o.x-p.x,o.y-p.y)<120))blocked=null;
  if(!near||near.id===blocked||moved>2){hold=0;waiting=null;return;}
  if(waiting!==near.id){waiting=near.id;hold=0;}hold+=Math.max(0,Math.min(.05,dt||0));if(hold>=.7&&clock>=retry){if(!enter(near))retry=clock+2;}
 }
 function frame(t,dt,dx,dy,paused=false){
  book();if(!current)return;if(!r.inWorld()||current.scope!==scope){leave();return;}const a=current,s=a.state,l=a.level,stopped=paused||!ready();
  if(!stopped){clock+=Math.max(0,Math.min(.05,dt||0));const speed=(r.SPEED||250)/ACTIVITY_TILE,walk=moveActivity(l,s,dx*speed*dt,dy*speed*dt);if(walk)r.recordWalk?.(walk*ACTIVITY_TILE);
   const result=updateActivity(l,s,dt);
   if(result.event&&!s.done&&l.def.id!=='silence'&&r.S.sound&&r.ac?.state==='running'){const instance=a,note=s.touch[0]??s.next%6;r.beatSoon?.(time=>{if(current===instance&&ready()&&!openSurface('.modal:not([hidden])'))playWonderNote(r,WONDERS[(l.def.index+note)%20],note%6,time);},null,'player');}
   if(s.done)finish();
   if(Math.hypot(s.x-l.exit.x,s.y-l.exit.y)<.6){leave();return;}
   if(l.def.id!=='maze'&&l.def.id!=='islands'&&Math.hypot(s.x-3.5,s.y-(l.n-1.5))<.55){a.resetHold+=dt;if(a.resetHold>1.2){const ghost=s.ghost;a.state=activityState(l);if(ghost)a.state.ghost=ghost;book().progress[a.o.id]=a.state;a.resetHold=0;r.save();}}else a.resetHold=0;
  }
  drawActivity(r,l,a.state,t,a.paid);r.drawCubePreview?.(t,r.beat());
 }
 function draw(){if(!ready()||current)return;const q=book();for(const o of portals())drawActivityPortal(r,o,activityDefinition(o.kind),q.done?.[o.id],waiting===o.id?hold/.7:0);}
 Object.defineProperties(r,{activityWorldTick:{get:()=>tick},drawActivityPortals:{get:()=>draw},activityFrame:{get:()=>frame},activityActive:{get:()=>!!current},activityNear:{get:()=>portals},activityState:{get:()=>({id:current?.o.id||null,kind:current?.o.kind||null,level:current?.level||null,player:current?.state||null,book:book(),cache:cache.size})}});book();
}
