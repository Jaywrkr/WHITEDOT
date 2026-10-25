import {findBiome,WORLD_CHAPTERS} from './journey-chapters.js';
import {freeOpen} from './journey-mode.js';
import {roundSparks} from './spark-rules.js';
import {creditSparks,normalizeSparkEconomy} from './sparks-model.js';
// The eleven places (plan F4, docs/MUNDO.md). After the Journey each chapter is a place you can play again: a round is
// the chapter's game from an empty bar, closed by its gold thing. Stars are for going forward and winning: ★ complete,
// ★★ with 85 % of pulses on time, ★★★ the Maestro version (unlocked by ★★: tempo +10 %, bar ×1.5, narrower window)
// with 80 % on time. Sparks come from playing: each round pays by spark-rules.js. Stars never pay sparks.
// They live in S.lugares: S.places already holds the regions visited, for the map and the Bitácora.
// Plan H3 (24 October): the ring opens in order, like the tracks of a record: each place after the Journey opens when
// the one before it is complete. Completing all eleven wins the game; the 33 stars are the master version of your song.
// Version 2 keeps open every place a version-1 save had open by its stars (`kept`), so nobody loses a door.
export const PLACES_VERSION=2;
export const PLACES=Object.freeze([
 {id:'llanura',name:'Llanura',verb:'Pegar',game:'stick'},{id:'lago',name:'Lago',verb:'Encadenar',game:'chain'},{id:'bosque',name:'Bosque',verb:'Rodear',game:'lasso'},
 {id:'tormenta',name:'Tormenta',verb:'Bailar',game:'dance'},{id:'vacio',name:'Vacío',verb:'Soltar',game:'release'},
 {id:'jardin',name:'Jardín',verb:'Sembrar',game:'garden'},{id:'dunas',name:'Dunas',verb:'Surfear',game:'surf'},{id:'cristales',name:'Cristales',verb:'Resonar',game:'resonance'},
 {id:'faros',name:'Faros',verb:'Guiar',game:'guide'},{id:'ruinas',name:'Ruinas',verb:'Reconstruir',game:'rebuild'},{id:'cueva',name:'Cueva',verb:'Eco',game:'echo'}].map(Object.freeze));
export const PLACE_IDS=Object.freeze(PLACES.map(p=>p.id));
// Plan I5 (Jay, 24 October, third panel): ★★ at 75 % on time and ★★★ at 70 % in the Maestro round (they were 85 and
// 80 %; the two-hour model showed the song stopping after the win for anyone below 85 %).
export const RHYTHM_STAR=.75,MAESTRO_STAR=.7,MAESTRO_TEMPO=1.1,MAESTRO_GOAL=1.5,MAESTRO_WINDOW=.06,TOTAL_STARS=33;
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const point=v=>object(v)&&Number.isFinite(v.x)&&Number.isFinite(v.y)?{x:Math.round(v.x),y:Math.round(v.y)}:null;
const share=(hits,total)=>total>0?Math.max(0,Math.min(1,hits/total)):0;
// Stars a round earns: ★ always on completion; ★★ with sound and 85 % on time; ★★★ only in a Maestro round, with 80 %.
export function roundStars({onTime,maestro=false,sound=true}){return [true,!maestro&&sound&&onTime>=RHYTHM_STAR||maestro&&sound&&onTime>=RHYTHM_STAR,maestro&&sound&&onTime>=MAESTRO_STAR];}
export function normalizePlaces(raw,journey={}){if(object(raw)&&Number.isInteger(raw.version)&&raw.version>PLACES_VERSION)return raw;const q=object(raw)?raw:{};
 // A version-1 save: every place its stars had open stays open (the old ladder asked 5, 8, 12, 16, 20 and 24 ★).
 const legacy=Number.isInteger(q.version)&&q.version<2,LEGACY_NEED={jardin:5,dunas:8,cristales:12,faros:16,ruinas:20,cueva:24};
 const stars={},best={};for(const id of PLACE_IDS){const s=Array.isArray(q.stars?.[id])?q.stars[id]:[];stars[id]=[0,1,2].map(i=>s[i]===true);
  const b=q.best?.[id];if(object(b))best[id]={onTime:Number.isFinite(b.onTime)?Math.max(0,Math.min(1,b.onTime)):0,ms:Number.isFinite(b.ms)&&b.ms>0?Math.round(b.ms):null,rounds:Number.isInteger(b.rounds)?Math.max(0,b.rounds):0};}
 // A chapter kept in the Journey, even before the places existed, is a ★ of its place.
 for(const id of WORLD_CHAPTERS)if(journey?.done?.[id]===true)stars[id][0]=true;
 const counts={};if(object(q.rounds?.counts))for(const [id,n] of Object.entries(q.rounds.counts))if(PLACE_IDS.includes(id)&&Number.isInteger(n))counts[id]=Math.max(0,Math.min(999,n));
 const journeyShare={};if(object(q.journeyShare))for(const id of WORLD_CHAPTERS){const j=q.journeyShare[id];if(object(j))journeyShare[id]={hits:Math.max(0,j.hits|0),total:Math.max(0,j.total|0),silent:j.silent===true};}
 // The ring (plan F5): its centre when there is no Refugio yet, and the portals already entered (for fast travel).
 const seen={};if(object(q.seen))for(const id of PLACE_IDS)if(q.seen[id]===true)seen[id]=true;
 // Your notes from each place's last round (plan H4): up to eight, for the finale of your song.
 const notes={};if(object(q.notes))for(const id of PLACE_IDS){const v=q.notes[id];if(Array.isArray(v)){const m=v.filter(n=>Number.isInteger(n)&&n>=36&&n<=96).slice(-8);if(m.length)notes[id]=m;}}
 // And the step of the bar each was played on (plan I4), kept only while every note has one.
 const noteSteps={};if(object(q.noteSteps))for(const id of Object.keys(notes)){const v=q.noteSteps[id];if(Array.isArray(v)&&v.length===notes[id].length&&v.every(s=>Number.isInteger(s)&&s>=0&&s<16))noteSteps[id]=[...v];}
 const kept={};if(object(q.kept))for(const id of PLACE_IDS)if(q.kept[id]===true)kept[id]=true;
 if(legacy){const have=PLACE_IDS.reduce((a,id)=>a+stars[id].filter(Boolean).length,0);for(const [id,need] of Object.entries(LEGACY_NEED))if(have>=need)kept[id]=true;}
 return {version:PLACES_VERSION,stars,best,rounds:{day:typeof q.rounds?.day==='string'?q.rounds.day:'',counts},journeyShare,center:point(q.center),seen,kept,notes,noteSteps,won:q.won===true,master:q.master===true,run:object(q.run)&&PLACE_IDS.includes(q.run.id)?q.run:null};}
export const starCount=places=>PLACE_IDS.reduce((a,id)=>a+(places?.stars?.[id]||[]).filter(Boolean).length,0);
// The place before this one on the path: the Journey's five open together; each later one follows the one before it.
export const previousPlace=id=>{const i=PLACE_IDS.indexOf(id);return i>WORLD_CHAPTERS.length-1?PLACE_IDS[i-1]:null;};
export const complete=(places,id)=>places?.stars?.[id]?.[0]===true;
export const allComplete=places=>PLACE_IDS.every(id=>complete(places,id));
export const placeOpen=(places,id,journey)=>{const p=PLACES.find(x=>x.id===id);if(!p||!p.game||places?.version>PLACES_VERSION||places?.readOnly||!freeOpen(journey))return false;const prev=previousPlace(id);
 return !prev||complete(places,prev)||complete(places,id)||places?.seen?.[id]===true||places?.kept?.[id]===true;};
// The next place on the path: the first one open and not complete, in order; null once all eleven are.
export const nextOnPath=(places,journey)=>PLACES.find(p=>p.game&&placeOpen(places,p.id,journey)&&!complete(places,p.id))||null;
function restoreTree(target,copy){for(const k of Object.keys(target))if(!Object.hasOwn(copy,k))delete target[k];for(const [k,v] of Object.entries(copy)){if(object(v)&&object(target[k]))restoreTree(target[k],v);else if(Array.isArray(v)&&Array.isArray(target[k]))target[k].splice(0,target[k].length,...v);else target[k]=v;}}
export function initialize(runtime){
 let owner=null,state=null,shown=null;
 function own(){if(owner!==runtime.S){owner=runtime.S;runtime.S.lugares=normalizePlaces(runtime.S.lugares,runtime.S.journey);state=runtime.S.lugares;
   // A future format remains untouched on disk and in S; readers get a safe, locked view.
   if(state.version>PLACES_VERSION)state={...normalizePlaces(null),version:state.version,readOnly:true};
   // A round left open by a reload is dropped: the chapter's own state comes back as it was.
   if(state.run){restore(state.run);back(state.run.from);state.run=null;}}
  // A chapter kept in the Journey is always a ★ of its place, whenever it was kept.
  if(state.version===PLACES_VERSION)for(const id of WORLD_CHAPTERS)if(runtime.S.journey?.done?.[id]===true)state.stars[id][0]=true;
  return state;}
 const gameKey=id=>PLACES.find(p=>p.id===id)?.game;
 function restore(run){const j=runtime.S.journey||{},key=gameKey(run.id);if(key){if(run.stash===undefined)delete j[key];else j[key]=run.stash;}const MU=runtime.MU;if(MU){MU.tempoScale=1;MU.onTimeWindow=null;}}
 // Back to the portal the round was entered from.
 function back(from){runtime.cancelJourneyVictory?.();const p=point(from);if(p){runtime.S.wx=p.x;runtime.S.wy=p.y;runtime.enterFx=1;}}
 const today=()=>runtime.S.todayKey||'';
 const run=()=>own().run;
 // Start a round: the chapter's game from an empty bar, in the place's biome. The Journey's own state is kept aside.
 function start(id,{maestro=false,from=null,remix=null,free=false}={}){const s=own();if(s.run||!placeOpen(s,id,runtime.S.journey)||maestro&&!s.stars[id][1]||free&&(maestro||remix||!complete(s,id)))return false;
  runtime.cancelJourneyVictory?.();
  // Today's remix (wild.js, plan F18): only the day's place, with the day's rhythm, never as Maestro.
  const daily=remix?runtime.dailyRemix?.():null;if(remix&&(maestro||!daily||daily.id!==id||daily.rhythm!==remix))return false;const j=runtime.S.journey||(runtime.S.journey={}),key=gameKey(id),stash=j[key];
  const spot=findBiome(id,{x:runtime.S.wx,y:runtime.S.wy},(x,y)=>runtime.BIOMES[runtime.biomeOfPos(x,y)]?.id,(x,y)=>!!runtime.regionOfPos?.(x,y)?.sea);
  s.run={id,maestro:!!maestro,...(remix?{remix}:{}),...(free?{free:true}:{}),from:point(from),startedAt:Date.now(),hits:0,total:0,silent:false,stash:stash===undefined?undefined:JSON.parse(JSON.stringify(stash))};
  j[key]={hinted:stash?.hinted===true};if(spot){runtime.S.wx=spot.x;runtime.S.wy=spot.y;}
  const MU=runtime.MU;if(MU){MU.tempoScale=maestro?MAESTRO_TEMPO:1;MU.onTimeWindow=maestro?MAESTRO_WINDOW:null;}
  if(runtime.save?.()===false){restore(s.run);s.run=null;return false;}runtime.enterFx=1;return true;}
 // Every pulse a game hears while a round or a Journey chapter is being played.
 function hear(id,on,beat={}){const s=own();if(s.readOnly)return;if(s.run&&s.run.id===id){s.run.total++;if(on)s.run.hits++;if(beat.silent)s.run.silent=true;return;}
  if(WORLD_CHAPTERS.includes(id)){const j=s.journeyShare[id]||(s.journeyShare[id]={hits:0,total:0,silent:false});j.total++;if(on)j.hits++;if(beat.silent)j.silent=true;}}
 function grant(id,stars){const s=own(),got=s.stars[id],fresh=stars.map((x,i)=>x&&!got[i]);stars.forEach((x,i)=>{if(x)got[i]=true;});return fresh;}
 // A Journey chapter kept: its ★, and its ★★ if it was played on time with sound.
 function chapterKept(id){const s=own();if(s.readOnly||!WORLD_CHAPTERS.includes(id))return;const j=s.journeyShare[id]||{hits:0,total:0};grant(id,[true,!j.silent&&share(j.hits,j.total)>=RHYTHM_STAR,false]);}
 // The gold thing of a round closed: stars, sparks, record, and the chapter's state back as it was.
 function finish(id){const s=own(),r=s.run;if(s.readOnly||!r||r.id!==id)return false;
  // Reward, record, personal notes, remix and restored chapter are one durable operation.
  const keys=['lugares','journey','sparkEconomy','sparks','wild','rewards'],before=Object.fromEntries(keys.map(k=>[k,structuredClone(runtime.S[k])])),tempo=runtime.MU?.tempoScale,window=runtime.MU?.onTimeWindow;
  function rollback(){for(const k of keys){if(before[k]===undefined)delete runtime.S[k];else if(object(before[k])&&object(runtime.S[k]))restoreTree(runtime.S[k],before[k]);else runtime.S[k]=before[k];}if(runtime.MU){runtime.MU.tempoScale=tempo;runtime.MU.onTimeWindow=window;}return false;}
  function commit(){return runtime.save?.()!==false;}
  // Libre (plan H3): only the music of the place; no stars, no sparks, no card. Back to its portal.
  if(r.free){const pos={wx:runtime.S.wx,wy:runtime.S.wy};restore(r);s.run=null;back(r.from);if(!commit()){Object.assign(runtime.S,pos);return rollback();}shown=null;runtime.journeyVictory?.(id);runtime.hud?.();return true;}const onTime=share(r.hits,r.total),sound=runtime.S.sound!==false&&!r.silent,ms=Date.now()-r.startedAt;
  if(s.rounds.day!==today()){s.rounds.day=today();s.rounds.counts={};}const roundsToday=s.rounds.counts[id]||0;s.rounds.counts[id]=roundsToday+1;
  const stars=roundStars({onTime,maestro:r.maestro,sound}),fresh=grant(id,stars);
  runtime.S.sparkEconomy=normalizeSparkEconomy(runtime.S.sparkEconomy,runtime.S.sparks,runtime.S.todayKey);const sparks=creditSparks(runtime.S,roundSparks(onTime,{maestro:r.maestro,roundsToday}));
  const extra=r.remix?runtime.remixDone?.(onTime)||null:null;
  const b=s.best[id]||(s.best[id]={onTime:0,ms:null,rounds:0});const record=onTime>b.onTime||b.ms===null||ms<b.ms;b.onTime=Math.max(b.onTime,onTime);b.ms=b.ms===null?ms:Math.min(b.ms,ms);b.rounds++;
  const j=runtime.S.journey;if(j&&typeof j==='object'){if(!j.colors||typeof j.colors!=='object')j.colors={};j.colors[id]=true;}
  {const ps=runtime.journeyPulseState?.()||{},all=(ps.notes||[]).map((n,i)=>[n,ps.noteSteps?.[i]]).filter(([n])=>Number.isInteger(n)).slice(-8);if(all.length){s.notes[id]=all.map(([n])=>n);s.noteSteps||={};if(all.every(([,st])=>Number.isInteger(st)))s.noteSteps[id]=all.map(([,st])=>st);else delete s.noteSteps[id];}}
  const result={id,from:r.from,maestro:r.maestro,remix:r.remix||null,extra,onTime,ms,stars,fresh,sparks,record,roundsToday,sound};restore(r);s.run=null;if(!commit())return rollback();shown=result;runtime.narrateRound?.(shown);runtime.journeyVictory?.(id);runtime.hud?.();setTimeout(()=>{if(shown===result&&!run())results();},1200);return true;}
 // Leaving a round from the menu: nothing earned, the chapter's state back, and you are at the portal again.
 function abandon(){const s=own();if(!s.run)return false;const from=s.run.from;restore(s.run);s.run=null;back(from);runtime.narrate?.('abandon');runtime.save?.();runtime.hud?.();return true;}
 // The round's card: the three stars, what each asks, and what you earned. Silent buttons.
 function results(){const box=runtime.$?.('mPlace'),r=shown;if(!box||!r)return;const pct=Math.round(r.onTime*100),mm=Math.floor(r.ms/60000),ss=String(Math.round(r.ms/1000)%60).padStart(2,'0');
  runtime.$('placeTitle').textContent=r.maestro?'Maestro':r.remix?'Remezcla':'Completo';
  runtime.$('placeStars').innerHTML=['★','★','★'].map((x,i)=>`<span class="${own().stars[r.id][i]?'got':''}${r.fresh[i]?' new':''}">${x}</span>`).join('');
  runtime.$('placeRows').innerHTML=[`<li>${r.stars[0]?'✓':'·'} Completar</li>`,`<li>${r.stars[1]?'✓':'·'} Ritmo · ${pct} % a tiempo</li>`,`<li>${r.stars[2]?'✓':'·'} Maestro</li>`].join('')+(r.sound?'':'<li>Con sonido: ★★ y ★★★.</li>');
  runtime.$('placeEarned').textContent=`${mm}:${ss} · +${r.sparks+(r.extra?.sparks||0)} ✦${r.record||r.extra?.record?' · récord':''}`;box.hidden=false;
  // The narrator speaks here, in the card, never during play (plan H5).
  const said=runtime.takePendingLine?.(),nar=runtime.$('placeNarrator');if(nar){nar.hidden=!said;nar.textContent=said?`${said.title} · ${said.line}`:'';}
  runtime.$('placeAgain').onclick=()=>{box.hidden=true;start(r.id,{maestro:r.maestro,from:r.from,remix:r.remix});};runtime.$('placeMaestro').hidden=!own().stars[r.id][1]||r.maestro;runtime.$('placeMaestro').onclick=()=>{box.hidden=true;start(r.id,{maestro:true,from:r.from});};runtime.$('placeClose').onclick=()=>{box.hidden=true;back(r.from);runtime.save?.();runtime.songFinaleCheck?.();};
  // The next track on the path, straight from the card (plan H3); none once all eleven are complete.
  const next=nextOnPath(own(),runtime.S.journey),nb=runtime.$('placeNext');if(nb){nb.hidden=!next||next.id===r.id||!runtime.ringGo;if(next){nb.textContent=`Siguiente · ${next.name}`;nb.onclick=()=>{box.hidden=true;back(r.from);if(runtime.songFinaleCheck?.())return;runtime.ringGo?.(next.id);};}}}
 Object.defineProperties(runtime,{placeRun:{get:()=>run},startPlace:{get:()=>start},abandonPlace:{get:()=>abandon},placeHear:{get:()=>hear},placeFinish:{get:()=>finish},placeChapterKept:{get:()=>chapterKept},placesData:{get:()=>own},
  placeGoalScale:{get:()=>()=>run()?.maestro?MAESTRO_GOAL:1},placeNext:{get:()=>()=>nextOnPath(own(),runtime.S.journey)?.id||null},places:{get:()=>()=>{const s=own();return {stars:JSON.parse(JSON.stringify(s.stars)),count:starCount(s),best:JSON.parse(JSON.stringify(s.best)),run:s.run?{id:s.run.id,maestro:s.run.maestro,...(s.run.remix?{remix:s.run.remix}:{}),...(s.run.free?{free:true}:{}),hits:s.run.hits,total:s.run.total}:null,last:shown?{...shown}:null};}}});
}
