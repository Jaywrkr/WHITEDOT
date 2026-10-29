import {hashKey} from './universe-regions.js';
import {prefersReducedMotion,openSurface} from './frame-state.js';
import {freeOpen} from './journey-mode.js';
import {PLACES,placeOpen} from './places.js';
import {RHYTHMS,PLACE_RHYTHMS} from './journey-rhythm.js';
import {creditSparks,normalizeSparkEconomy} from './sparks-model.js';
import {directionPan} from './spatial.js';
// The wild World (plan F18, docs/MUNDO.md): exploring far gives something every one or two minutes. A wild spark
// turns up ahead of the cube, singing on the beat from its side (plan H6); five pulses on time beside it within 30 s catch it (15 ✦: a
// spark you chase is worth more than a loose one). And every day one place is remixed: its game with another place's rhythm. Until H1 it paid 30 ✦
// more, and 20 more for beating the day's best; since H1 it is a level like any round: ★, never ✦.
export const WILD_AFTER=60000,WILD_SURE=120000,WILD_WALK=1200,WILD_LIFE=30000,WILD_HOPS=5,WILD_REACH=120,WILD_HOP=150,WILD_AHEAD=150,WILD_SPARKS=15;
export const REMIX_SPARKS=30,REMIX_RECORD=20;
// Plan H6: the spark is found by ear. It sings on every beat from its side, louder as you come near; the arrow at the
// edge of the screen is only for playing without sound.
export const WILD_HEAR=900;
export const wildGain=d=>.02+.07*Math.max(0,1-d/WILD_HEAR)**2;
// Places whose game reads the beat in its own way keep their rhythm: the Jardín, Dunas, Vacío and Cueva are not remixed.
export const REMIX_PLACES=Object.freeze(['llanura','lago','bosque','tormenta','cristales','faros','ruinas']);
export const REMIX_RHYTHMS=Object.freeze(['contra','mezcla','acorde','faro','ruina']);
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
export function normalizeWild(raw){const q=object(raw)?raw:{},r=object(q.remix)?q.remix:{};
 return {day:typeof q.day==='string'?q.day:'',caught:Number.isInteger(q.caught)?Math.max(0,q.caught):0,today:Number.isInteger(q.today)?Math.max(0,q.today):0,
  remix:{day:typeof r.day==='string'?r.day:'',best:Number.isFinite(r.best)?Math.max(0,Math.min(1,r.best)):0,done:Number.isInteger(r.done)?Math.max(0,r.done):0}};}
// Today's remix: one open place and a rhythm that is not its own, both from the day's key; null with none open.
export function dailyRemix(day,places,journey,own=id=>null){const open=REMIX_PLACES.filter(id=>placeOpen(places,id,journey));if(!open.length||!day)return null;
 const id=open[Math.floor(hashKey('remix:place:'+day)*open.length)],pool=REMIX_RHYTHMS.filter(k=>k!==own(id)),rhythm=pool[Math.floor(hashKey('remix:rhythm:'+day)*pool.length)];return {id,rhythm};}
// What a remixed round paid on top until H1 (kept for the record): 30, and 20 more for a better share than the day's best.
export const remixSparks=(onTime,best)=>REMIX_SPARKS+(onTime>best?REMIX_RECORD:0);
// Should a wild spark turn up now: far enough walked and long enough since the last. `draw` (0–1, drawn once after
// each spark) places the moment between one and two minutes.
export function wildDue(sinceMs,walked,draw){return walked>=WILD_WALK&&sinceMs>=WILD_AFTER+Math.max(0,Math.min(1,draw))*(WILD_SURE-WILD_AFTER);}
export function initialize(runtime){
 let owner=null,state=null,spark=null,heard=0,last=performance.now(),walked=0,prev=null,roll=Math.random();const glows=[];
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const today=()=>runtime.S.todayKey||'';
 function own(){if(owner!==runtime.S){owner=runtime.S;runtime.S.wild=normalizeWild(runtime.S.wild);state=runtime.S.wild;spark=null;}if(state.day!==today()){state.day=today();state.today=0;}return state;}
 // Out in the free World, on the surface, with no round or chapter game going on.
 function active(){const S=runtime.S;return !!(S&&runtime.inWorld?.()&&S.mode==='world'&&(S.layer||'superficie')==='superficie'&&freeOpen(S.journey)&&!runtime.placeRun?.()&&!runtime.journeyFinaleState?.().running&&!runtime.houseActive?.());}
 function spawn(){const S=runtime.S,a=prev&&(S.wx!==prev.x||S.wy!==prev.y)?Math.atan2(S.wy-prev.y,S.wx-prev.x):hashKey('wild:a:'+Date.now())*6.283,n=own().caught+own().today;
  spark={x:Math.round(S.wx+Math.cos(a)*WILD_AHEAD),y:Math.round(S.wy+Math.sin(a)*WILD_AHEAD),hops:0,born:performance.now(),n,flash:0};runtime.toast?.('Una chispa salvaje.',{level:2,ttl:2500});}
 function tick(){if(!active()){prev=null;return;}const S=runtime.S,now=performance.now();if(prev)walked+=Math.min(200,Math.hypot(S.wx-prev.x,S.wy-prev.y));prev={x:S.wx,y:S.wy};
  if(spark){if(now-spark.born>WILD_LIFE){spark=null;last=now;walked=0;roll=Math.random();runtime.toast?.('Se fue.',{level:2,ttl:2000});}return;}
  if(!openSurface('.modal:not([hidden])')&&wildDue(now-last,walked,roll))spawn();}
 // A pulse in the World: on time and beside the spark, it hops away; the fifth catches it.
 function pulse(on){if(!spark||!on||!active())return null;const S=runtime.S;if(Math.hypot(spark.x-S.wx,spark.y-S.wy)>WILD_REACH)return 'far';spark.hops++;spark.flash=1;glows.push({x:spark.x,y:spark.y,at:performance.now()});
  runtime.soon?.(t=>{const ct=runtime.chordTones?.()||[60,64,67];runtime.pluck?.(ct[spark?.hops%3||0]+24,t,.08,2);},'player');
  if(spark.hops>=WILD_HOPS){const s=own();runtime.S.sparkEconomy=normalizeSparkEconomy(runtime.S.sparkEconomy,runtime.S.sparks,today());const got=creditSparks(runtime.S,WILD_SPARKS);s.caught++;s.today++;spark=null;last=performance.now();walked=0;roll=Math.random();runtime.save?.();runtime.hud?.();runtime.toast?.(`Atrapada · +${got} ✦`,{level:2,ttl:3000});return 'caught';}
  const a=hashKey(`wild:hop:${spark.n}:${spark.hops}`)*6.283;spark.x=Math.round(spark.x+Math.cos(a)*WILD_HOP);spark.y=Math.round(spark.y+Math.sin(a)*WILD_HOP);return 'hop';}
 function draw(c,W,H,t){tick();if(!spark||!active()||openSurface('.modal:not([hidden])'))return;const S=runtime.S,cx=runtime.camX??S.wx,cy=runtime.camY??S.wy,x=W/2+spark.x-cx,y=H/2+spark.y-cy,gold=runtime.GOLD||'#f0d27a',still=calm(),now=performance.now(),left=1-(now-spark.born)/WILD_LIFE;c.save();
  if(x>-30&&x<W+30&&y>-30&&y<H+30){const r=10+(still?0:Math.sin(t/200)*2);c.globalAlpha=.3;c.fillStyle=gold;c.beginPath();c.arc(x,y,r*2.2,0,6.283);c.fill();
   c.globalAlpha=1;c.strokeStyle=gold;c.lineWidth=2;c.beginPath();for(let i=0;i<=30;i++){const a=i/30*9.4+(still?0:t/300),q=2+i/30*r;i?c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q):c.moveTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.stroke();
   c.globalAlpha=.8;c.beginPath();c.arc(x,y,r+8,-Math.PI/2,-Math.PI/2+Math.max(0,left)*6.283);c.stroke();
   for(let k=0;k<WILD_HOPS;k++){c.globalAlpha=k<spark.hops?1:.3;c.fillStyle=k<spark.hops?gold:'#ffffff';c.fillRect(Math.round(x-WILD_HOPS*4+k*8+2),Math.round(y+r+12),4,4);}}
  else if(!S.sound){const a=Math.atan2(y-H/2,x-W/2),m=24,k=Math.min((W/2-m)/Math.abs(Math.cos(a)||1e-6),(H/2-m)/Math.abs(Math.sin(a)||1e-6)),ex=W/2+Math.cos(a)*k,ey=H/2+Math.sin(a)*k;c.globalAlpha=.9;c.fillStyle=gold;c.beginPath();c.moveTo(ex+Math.cos(a)*9,ey+Math.sin(a)*9);c.lineTo(ex+Math.cos(a+2.5)*7,ey+Math.sin(a+2.5)*7);c.lineTo(ex+Math.cos(a-2.5)*7,ey+Math.sin(a-2.5)*7);c.closePath();c.fill();}
  for(let i=glows.length-1;i>=0;i--){const g=glows[i],k=(now-g.at)/500;if(k>1){glows.splice(i,1);continue;}c.globalAlpha=.8*(1-k);c.strokeStyle=gold;c.lineWidth=1.5;c.beginPath();c.arc(W/2+g.x-cx,H/2+g.y-cy,10+k*30,0,6.283);c.stroke();}
  c.restore();}
 // On every beat the spark sings a note of the chord, from where it is.
 function musicStep(step,time){if(step%4||!spark||!runtime.S.sound||!active()||!runtime.pluck)return;const S=runtime.S,ct=runtime.chordTones?.()||[60,64,67],d=Math.hypot(spark.x-S.wx,spark.y-S.wy),
  emit=()=>runtime.pluck(ct[(step/4)%ct.length|0]+24,time,wildGain(d),2),pan=directionPan(spark,S.wx,S.wy,WILD_HEAR*.6);heard++;runtime.withPan?runtime.withPan(pan,emit):emit();}
 // Today's remix, for the Lugares sheet and the places' rounds.
 function remix(){const d=runtime.placesData?.();if(!d)return null;return dailyRemix(today(),d,runtime.S.journey,id=>PLACE_RHYTHMS[id]);}
 // A remixed round closed: the day's best kept. Since H1 (Jay, alpha.233) a remix is a level and pays no sparks.
 function remixDone(onTime){const s=own().remix;if(s.day!==today()){s.day=today();s.best=0;}const record=onTime>s.best;s.best=Math.max(s.best,onTime);s.done++;return {sparks:0,record};}
 const remixName=key=>RHYTHMS[key]?.name||key;
 Object.defineProperties(runtime,{drawWild:{get:()=>draw},wildMusicStep:{get:()=>musicStep},wildPulse:{get:()=>pulse},dailyRemix:{get:()=>remix},remixDone:{get:()=>remixDone},remixName:{get:()=>remixName},
  wildState:{get:()=>()=>{const s=own();return {active:active(),heard,caught:s.caught,today:s.today,walked,since:performance.now()-last,spark:spark?{x:spark.x,y:spark.y,hops:spark.hops}:null,remix:remix(),remixBest:s.remix.day===today()?s.remix.best:0};}},
  wildSpawn:{get:()=>()=>{if(active())spawn();return !!spark;}}});
}
