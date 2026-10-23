import {findBiome,WORLD_CHAPTERS} from './journey-chapters.js';
import {freeOpen} from './journey-mode.js';
import {roundSparks} from './spark-rules.js';
import {creditSparks,normalizeSparkEconomy} from './sparks-model.js';
// The eleven places (plan F4, docs/MUNDO.md). After the Journey each chapter is a place you can play again: a round is
// the chapter's game from an empty bar, closed by its gold thing. Stars are for going forward and winning: ★ complete,
// ★★ with 85 % of pulses on time, ★★★ the Maestro version (unlocked by ★★: tempo +10 %, bar ×1.5, narrower window)
// with 80 % on time. Sparks come from playing: each round pays by spark-rules.js. Stars never pay sparks.
// They live in S.lugares: S.places already holds the regions visited, for the map and the Bitácora.
export const PLACES_VERSION=1;
export const PLACES=Object.freeze([
 {id:'llanura',name:'Llanura',verb:'Pegar',game:'stick',need:0},{id:'lago',name:'Lago',verb:'Encadenar',game:'chain',need:0},{id:'bosque',name:'Bosque',verb:'Rodear',game:'lasso',need:0},
 {id:'tormenta',name:'Tormenta',verb:'Bailar',game:'dance',need:0},{id:'vacio',name:'Vacío',verb:'Soltar',game:'release',need:0},
 {id:'jardin',name:'Jardín',verb:'Sembrar',game:'garden',need:5},{id:'dunas',name:'Dunas',verb:'Surfear',game:'surf',need:8},{id:'cristales',name:'Cristales',verb:'Resonar',game:'resonance',need:12},
 {id:'faros',name:'Faros',verb:'Guiar',game:'guide',need:16},{id:'ruinas',name:'Ruinas',verb:'Reconstruir',game:null,need:20},{id:'cueva',name:'Cueva',verb:'Eco',game:null,need:24}].map(Object.freeze));
export const PLACE_IDS=Object.freeze(PLACES.map(p=>p.id));
export const RHYTHM_STAR=.85,MAESTRO_STAR=.8,MAESTRO_TEMPO=1.1,MAESTRO_GOAL=1.5,MAESTRO_WINDOW=.06,TOTAL_STARS=33;
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const point=v=>object(v)&&Number.isFinite(v.x)&&Number.isFinite(v.y)?{x:Math.round(v.x),y:Math.round(v.y)}:null;
const share=(hits,total)=>total>0?Math.max(0,Math.min(1,hits/total)):0;
// Stars a round earns: ★ always on completion; ★★ with sound and 85 % on time; ★★★ only in a Maestro round, with 80 %.
export function roundStars({onTime,maestro=false,sound=true}){return [true,!maestro&&sound&&onTime>=RHYTHM_STAR||maestro&&sound&&onTime>=RHYTHM_STAR,maestro&&sound&&onTime>=MAESTRO_STAR];}
export function normalizePlaces(raw,journey={}){if(object(raw)&&Number.isInteger(raw.version)&&raw.version>PLACES_VERSION)return raw;const q=object(raw)?raw:{};
 const stars={},best={};for(const id of PLACE_IDS){const s=Array.isArray(q.stars?.[id])?q.stars[id]:[];stars[id]=[0,1,2].map(i=>s[i]===true);
  const b=q.best?.[id];if(object(b))best[id]={onTime:Number.isFinite(b.onTime)?Math.max(0,Math.min(1,b.onTime)):0,ms:Number.isFinite(b.ms)&&b.ms>0?Math.round(b.ms):null,rounds:Number.isInteger(b.rounds)?Math.max(0,b.rounds):0};}
 // A chapter kept in the Journey, even before the places existed, is a ★ of its place.
 for(const id of WORLD_CHAPTERS)if(journey?.done?.[id]===true)stars[id][0]=true;
 const counts={};if(object(q.rounds?.counts))for(const [id,n] of Object.entries(q.rounds.counts))if(PLACE_IDS.includes(id)&&Number.isInteger(n))counts[id]=Math.max(0,Math.min(999,n));
 const journeyShare={};if(object(q.journeyShare))for(const id of WORLD_CHAPTERS){const j=q.journeyShare[id];if(object(j))journeyShare[id]={hits:Math.max(0,j.hits|0),total:Math.max(0,j.total|0),silent:j.silent===true};}
 // The ring (plan F5): its centre when there is no Refugio yet, and the portals already entered (for fast travel).
 const seen={};if(object(q.seen))for(const id of PLACE_IDS)if(q.seen[id]===true)seen[id]=true;
 return {version:PLACES_VERSION,stars,best,rounds:{day:typeof q.rounds?.day==='string'?q.rounds.day:'',counts},journeyShare,center:point(q.center),seen,won:q.won===true,run:object(q.run)&&PLACE_IDS.includes(q.run.id)?q.run:null};}
export const starCount=places=>PLACE_IDS.reduce((a,id)=>a+(places?.stars?.[id]||[]).filter(Boolean).length,0);
export const placeOpen=(places,id,journey)=>{const p=PLACES.find(x=>x.id===id);return !!(p&&p.game&&freeOpen(journey)&&starCount(places)>=p.need);};
export function initialize(runtime){
 let owner=null,state=null,shown=null;
 function own(){if(owner!==runtime.S){owner=runtime.S;runtime.S.lugares=normalizePlaces(runtime.S.lugares,runtime.S.journey);state=runtime.S.lugares;
   // A round left open by a reload is dropped: the chapter's own state comes back as it was.
   if(state.run){restore(state.run);back(state.run.from);state.run=null;}}
  // A chapter kept in the Journey is always a ★ of its place, whenever it was kept.
  if(state.version===PLACES_VERSION)for(const id of WORLD_CHAPTERS)if(runtime.S.journey?.done?.[id]===true)state.stars[id][0]=true;
  return state;}
 const gameKey=id=>PLACES.find(p=>p.id===id)?.game;
 function restore(run){const j=runtime.S.journey||{},key=gameKey(run.id);if(key){if(run.stash===undefined)delete j[key];else j[key]=run.stash;}const MU=runtime.MU;if(MU){MU.tempoScale=1;MU.onTimeWindow=null;}}
 // Back to the portal the round was entered from.
 function back(from){const p=point(from);if(p){runtime.S.wx=p.x;runtime.S.wy=p.y;runtime.enterFx=1;}}
 const today=()=>runtime.S.todayKey||'';
 const run=()=>own().run;
 // Start a round: the chapter's game from an empty bar, in the place's biome. The Journey's own state is kept aside.
 function start(id,{maestro=false,from=null}={}){const s=own();if(s.run||!placeOpen(s,id,runtime.S.journey)||maestro&&!s.stars[id][1])return false;const j=runtime.S.journey||(runtime.S.journey={}),key=gameKey(id),stash=j[key];
  const spot=findBiome(id,{x:runtime.S.wx,y:runtime.S.wy},(x,y)=>runtime.BIOMES[runtime.biomeOfPos(x,y)]?.id,(x,y)=>!!runtime.regionOfPos?.(x,y)?.sea);
  s.run={id,maestro:!!maestro,from:point(from),startedAt:Date.now(),hits:0,total:0,silent:false,stash:stash===undefined?undefined:JSON.parse(JSON.stringify(stash))};
  j[key]={hinted:stash?.hinted===true};if(spot){runtime.S.wx=spot.x;runtime.S.wy=spot.y;}
  const MU=runtime.MU;if(MU){MU.tempoScale=maestro?MAESTRO_TEMPO:1;MU.onTimeWindow=maestro?MAESTRO_WINDOW:null;}
  if(runtime.save?.()===false){restore(s.run);s.run=null;return false;}runtime.enterFx=1;return true;}
 // Every pulse a game hears while a round or a Journey chapter is being played.
 function hear(id,on,beat={}){const s=own();if(s.run&&s.run.id===id){s.run.total++;if(on)s.run.hits++;if(beat.silent)s.run.silent=true;return;}
  if(WORLD_CHAPTERS.includes(id)){const j=s.journeyShare[id]||(s.journeyShare[id]={hits:0,total:0,silent:false});j.total++;if(on)j.hits++;if(beat.silent)j.silent=true;}}
 function grant(id,stars){const s=own(),got=s.stars[id],fresh=stars.map((x,i)=>x&&!got[i]);stars.forEach((x,i)=>{if(x)got[i]=true;});return fresh;}
 // A Journey chapter kept: its ★, and its ★★ if it was played on time with sound.
 function chapterKept(id){const s=own();if(!WORLD_CHAPTERS.includes(id))return;const j=s.journeyShare[id]||{hits:0,total:0};grant(id,[true,!j.silent&&share(j.hits,j.total)>=RHYTHM_STAR,false]);}
 // The gold thing of a round closed: stars, sparks, record, and the chapter's state back as it was.
 function finish(id){const s=own(),r=s.run;if(!r||r.id!==id)return false;const onTime=share(r.hits,r.total),sound=runtime.S.sound!==false&&!r.silent,ms=Date.now()-r.startedAt;
  if(s.rounds.day!==today()){s.rounds.day=today();s.rounds.counts={};}const roundsToday=s.rounds.counts[id]||0;s.rounds.counts[id]=roundsToday+1;
  const stars=roundStars({onTime,maestro:r.maestro,sound}),fresh=grant(id,stars);
  runtime.S.sparkEconomy=normalizeSparkEconomy(runtime.S.sparkEconomy,runtime.S.sparks,runtime.S.todayKey);const sparks=creditSparks(runtime.S,roundSparks(onTime,{maestro:r.maestro,roundsToday}));
  const b=s.best[id]||(s.best[id]={onTime:0,ms:null,rounds:0});const record=onTime>b.onTime||b.ms===null||ms<b.ms;b.onTime=Math.max(b.onTime,onTime);b.ms=b.ms===null?ms:Math.min(b.ms,ms);b.rounds++;
  shown={id,from:r.from,maestro:r.maestro,onTime,ms,stars,fresh,sparks,record,roundsToday,sound};restore(r);s.run=null;runtime.narrateRound?.(shown);runtime.journeyVictory?.(id);runtime.save?.();runtime.hud?.();setTimeout(results,1200);return true;}
 // Leaving a round from the menu: nothing earned, the chapter's state back, and you are at the portal again.
 function abandon(){const s=own();if(!s.run)return false;const from=s.run.from;restore(s.run);s.run=null;back(from);runtime.narrate?.('abandon');runtime.save?.();runtime.hud?.();return true;}
 // The round's card: the three stars, what each asks, and what you earned. Silent buttons.
 function results(){const box=runtime.$?.('mPlace'),r=shown;if(!box||!r)return;const pct=Math.round(r.onTime*100),mm=Math.floor(r.ms/60000),ss=String(Math.round(r.ms/1000)%60).padStart(2,'0');
  runtime.$('placeTitle').textContent=r.maestro?'Maestro':'Completo';
  runtime.$('placeStars').innerHTML=['★','★','★'].map((x,i)=>`<span class="${own().stars[r.id][i]?'got':''}${r.fresh[i]?' new':''}">${x}</span>`).join('');
  runtime.$('placeRows').innerHTML=[`<li>${r.stars[0]?'✓':'·'} Completar</li>`,`<li>${r.stars[1]?'✓':'·'} Ritmo: ${pct} % a tiempo (85 %)</li>`,`<li>${r.stars[2]?'✓':'·'} Maestro: 80 % a tiempo</li>`].join('')+(r.sound?'':'<li>Con sonido: ★★ y ★★★.</li>');
  runtime.$('placeEarned').textContent=`${mm}:${ss} · +${r.sparks} ✦${r.record?' · récord':''}`;box.hidden=false;
  runtime.$('placeAgain').onclick=()=>{box.hidden=true;start(r.id,{maestro:r.maestro,from:r.from});};runtime.$('placeMaestro').hidden=!own().stars[r.id][1]||r.maestro;runtime.$('placeMaestro').onclick=()=>{box.hidden=true;start(r.id,{maestro:true,from:r.from});};runtime.$('placeClose').onclick=()=>{box.hidden=true;back(r.from);runtime.save?.();runtime.songFinaleCheck?.();};}
 Object.defineProperties(runtime,{placeRun:{get:()=>run},startPlace:{get:()=>start},abandonPlace:{get:()=>abandon},placeHear:{get:()=>hear},placeFinish:{get:()=>finish},placeChapterKept:{get:()=>chapterKept},placesData:{get:()=>own},
  placeGoalScale:{get:()=>()=>run()?.maestro?MAESTRO_GOAL:1},places:{get:()=>()=>{const s=own();return {stars:JSON.parse(JSON.stringify(s.stars)),count:starCount(s),best:JSON.parse(JSON.stringify(s.best)),run:s.run?{id:s.run.id,maestro:s.run.maestro,hits:s.run.hits,total:s.run.total}:null,last:shown?{...shown}:null};}}});
}
