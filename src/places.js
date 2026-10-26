import {audibleTime} from './journey-pulse.js';
import {findBiome,WORLD_CHAPTERS,CHAPTERS} from './journey-chapters.js';
import {freeOpen} from './journey-mode.js';
import {roundSparks} from './spark-rules.js';
import {creditSparks,normalizeSparkEconomy} from './sparks-model.js';
// The eleven places (plan F4, docs/MUNDO.md). After the Journey each chapter is a place you can play again: a round is
// the chapter's game from an empty bar, closed by its gold thing. Stars are for going forward and winning: ★ complete,
// ★★ with 75 % of pulses on time, ★★★ the Maestro version (unlocked by ★★: tempo +10 %, bar ×1.5, narrower window)
// with 70 % on time. Sparks come from playing: each round pays by spark-rules.js. Stars never pay sparks.
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
// Never round an unmet threshold up to an apparently earned star.
export const roundPercent=value=>String(Math.floor(Math.max(0,Math.min(1,Number(value)||0))*1000)/10).replace('.',',');
export function roundTime(ms){const seconds=Math.floor(Math.max(0,Number.isFinite(Number(ms))?Number(ms):0)/1000);return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');}
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const point=v=>object(v)&&Number.isFinite(v.x)&&Number.isFinite(v.y)?{x:Math.round(v.x),y:Math.round(v.y)}:null;
const share=(hits,total)=>total>0?Math.max(0,Math.min(1,hits/total)):0;
// Stars a round earns: ★ always on completion; ★★ with sound and 75 % on time; ★★★ only in a Maestro round, with 70 %.
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
 const noteTicks={};if(object(q.noteTicks))for(const id of Object.keys(notes)){const v=q.noteTicks[id];if(Array.isArray(v)&&v.length===notes[id].length&&v.every((n,i)=>Number.isSafeInteger(n)&&n>=0&&(!i||n>=v[i-1])))noteTicks[id]=[...v];}
 const noteSteps={};if(object(q.noteSteps))for(const id of Object.keys(notes)){const v=q.noteSteps[id];if(Array.isArray(v)&&v.length===notes[id].length&&v.every(s=>Number.isInteger(s)&&s>=0&&s<16))noteSteps[id]=[...v];}
 const kept={};if(object(q.kept))for(const id of PLACE_IDS)if(q.kept[id]===true)kept[id]=true;
 if(legacy){const have=PLACE_IDS.reduce((a,id)=>a+stars[id].filter(Boolean).length,0);for(const [id,need] of Object.entries(LEGACY_NEED))if(have>=need)kept[id]=true;}
 return {version:PLACES_VERSION,stars,best,rounds:{day:typeof q.rounds?.day==='string'?q.rounds.day:'',counts},journeyShare,center:point(q.center),ringFixed:q.ringFixed===true,seen,kept,notes,noteSteps,noteTicks,won:q.won===true,master:q.master===true,run:object(q.run)&&PLACE_IDS.includes(q.run.id)?q.run:null};}
export const starCount=places=>PLACE_IDS.reduce((a,id)=>a+(places?.stars?.[id]||[]).filter(Boolean).length,0);
// The place before this one on the path: the Journey's five open together; each later one follows the one before it.
export const previousPlace=id=>{const i=PLACE_IDS.indexOf(id);return i>WORLD_CHAPTERS.length-1?PLACE_IDS[i-1]:null;};
export const complete=(places,id)=>places?.stars?.[id]?.[0]===true;
export const allComplete=places=>PLACE_IDS.every(id=>complete(places,id));
export const placeOpen=(places,id,journey)=>{const p=PLACES.find(x=>x.id===id);if(!p||!p.game||places?.version>PLACES_VERSION||places?.readOnly||!freeOpen(journey))return false;const prev=previousPlace(id);
 return !prev||complete(places,prev)||complete(places,id)||places?.seen?.[id]===true||places?.kept?.[id]===true;};
// The next place on the path: the first one open and not complete, in order; null once all eleven are.
export const nextOnPath=(places,journey)=>PLACES.find(p=>p.game&&placeOpen(places,p.id,journey)&&!complete(places,p.id))||null;
// A read-only objective shared by guide, menu and progress sheets. It never moves the player or spends currency.
export function gameObjective(s,places=normalizePlaces(s.lugares,s.journey)){
 if(places?.readOnly||places?.version>PLACES_VERSION)return {kind:'update',id:null,line:'Estos lugares necesitan una versión más reciente.',progress:'Tu progreso se conserva.'};
 if(!freeOpen(s.journey)){
  const n=Math.min(10,s.pathCrystals?.length||0),chapter=Math.max(0,Math.min(CHAPTERS.length-1,s.journey?.chapter||0)),id=CHAPTERS[chapter];
  if(!chapter&&n<10)return {kind:'journey',id:'camino',line:'Toca a tiempo junto a los cristales.',progress:`${n}/10 cristales · abre el Mundo`};
  if(id==='refugio')return {kind:'journey',id,line:'Escucha tu canción. Después se abre el Mundo.',progress:'Tu viaje reúne sus cinco capítulos.'};
  const next=s.journey?.done?.[id]?CHAPTERS[chapter+1]:id==='camino'?'llanura':id,name=PLACES.find(p=>p.id===next)?.name||'Tu canción';
  return {kind:'journey',id:next,line:s.journey?.done?.[id]?`Cruza el portal hacia ${name}.`:`Toca a tiempo en ${name}.`,progress:'El Viaje · escucha y sigue la luz.'};
 }
 const completed=PLACE_IDS.filter(id=>complete(places,id)).length,stars=starCount(places),next=nextOnPath(places,s.journey);
 // Panel 10 (P4, D1): once the eleven are complete, the place nearest its next star; «Explora a tu ritmo» only with 33 ★.
 const aim=next?null:starGoal(places,s.journey),line=next?`Siguiente: ${next.name}.`:aim?`Siguiente: ${'★'.repeat(aim.tier)} en ${aim.name}${aim.best!==null&&aim.tier===2?` · ${roundPercent(aim.best)} %`:''}.`:'Tu canción está completa. Explora a tu ritmo.';
 return {kind:next||aim?'place':'create',id:next?.id||aim?.id||null,name:next?.name||aim?.name||null,...(aim?{tier:aim.tier}:{}),remaining:PLACE_IDS.length-completed,line,progress:`${completed}/11 lugares · ★ ${stars}/33`,completed,stars};
}
// After the victory (panel 10, P4, D1): the place without ★★ with the best share on time; with every ★★, the one without
// ★★★ with the best share. Null before the eleven are complete, during the Journey and with the 33 ★.
export function starGoal(places,journey){if(!allComplete(places))return null;const best=id=>{const b=places?.best?.[id];if(b&&Number.isFinite(b.onTime))return b.onTime;const j=places?.journeyShare?.[id];return j?.total>0?share(j.hits,j.total):null;};
 for(const tier of [2,3]){let aim=null;for(const p of PLACES){if(places.stars?.[p.id]?.[tier-1]||!placeOpen(places,p.id,journey))continue;const b=best(p.id);if(!aim||(b??-1)>(aim.best??-1))aim={id:p.id,name:p.name,tier,best:b};}if(aim)return aim;}return null;}
// The next step after a round or from the ring: the path first, then the nearest star.
export const nextGoal=(places,journey)=>nextOnPath(places,journey)||starGoal(places,journey);
// Panel 10 (P4, Pope and Matsuura): the live count of a round, without words. A tick at the end of the Line lights while
// the round is at the share its next star asks (75 %, or 70 % in a Maestro round). Same share as the card's.
export function roundTick(run,sound=true){if(!run||run.free||!sound||run.silent)return null;const threshold=run.maestro?MAESTRO_STAR:RHYTHM_STAR,now=share(run.hits,run.total);return {lit:run.total>0&&now>=threshold,share:now,threshold};}
// A near miss on the card: between 70 and 74,9 % without ★★, the tenths still missing (never rounded up).
export const NEAR_STAR=.7;
export function nearMiss(onTime){const tenths=Math.floor(Math.max(0,Math.min(1,Number(onTime)||0))*1000);return tenths>=NEAR_STAR*1000&&tenths<RHYTHM_STAR*1000?String((RHYTHM_STAR*1000-tenths)/10).replace('.',','):null;}
function restoreTree(target,copy){for(const k of Object.keys(target))if(!Object.hasOwn(copy,k))delete target[k];for(const [k,v] of Object.entries(copy)){if(object(v)&&object(target[k]))restoreTree(target[k],v);else if(Array.isArray(v)&&Array.isArray(target[k]))target[k].splice(0,target[k].length,...v);else target[k]=v;}}
export function initialize(runtime){
 let owner=null,state=null,shown=null,cardDue=null;
 function own(){if(owner!==runtime.S){if(owner){const card=runtime.$?.('mPlace');if(card)card.hidden=true;}shown=null;owner=runtime.S;runtime.S.lugares=normalizePlaces(runtime.S.lugares,runtime.S.journey);state=runtime.S.lugares;
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
  const daily=remix?runtime.dailyRemix?.():null;if(remix&&(maestro||!daily||daily.id!==id||daily.rhythm!==remix))return false;const position={wx:runtime.S.wx,wy:runtime.S.wy},j=runtime.S.journey||(runtime.S.journey={}),key=gameKey(id),stash=j[key];
  const spot=findBiome(id,{x:runtime.S.wx,y:runtime.S.wy},(x,y)=>runtime.BIOMES[runtime.biomeOfPos(x,y)]?.id,(x,y)=>!!runtime.regionOfPos?.(x,y)?.sea);
  s.run={id,maestro:!!maestro,...(remix?{remix}:{}),...(free?{free:true}:{}),from:point(from),startedAt:Date.now(),hits:0,total:0,silent:false,notes:[],noteSteps:[],noteTicks:[],stash:stash===undefined?undefined:JSON.parse(JSON.stringify(stash))};
  j[key]={hinted:stash?.hinted===true};if(spot){runtime.S.wx=spot.x;runtime.S.wy=spot.y;}
  const MU=runtime.MU,prior=MU?{scale:MU.tempoScale,window:MU.onTimeWindow,hasScale:Object.hasOwn(MU,'tempoScale'),hasWindow:Object.hasOwn(MU,'onTimeWindow')}:null;if(MU){MU.tempoScale=maestro?MAESTRO_TEMPO:1;MU.onTimeWindow=maestro?MAESTRO_WINDOW:null;}
  if(runtime.save?.()===false){restore(s.run);s.run=null;Object.assign(runtime.S,position);if(MU){if(prior.hasScale)MU.tempoScale=prior.scale;else delete MU.tempoScale;if(prior.hasWindow)MU.onTimeWindow=prior.window;else delete MU.onTimeWindow;}return false;}runtime.enterFx=1;return true;}
 // Every pulse a game hears while a round or a Journey chapter is being played.
 function hear(id,on,beat={}){const s=own();if(s.readOnly)return;if(s.run&&s.run.id===id){s.run.total++;if(on){s.run.hits++;if(Number.isInteger(beat.midi)&&beat.midi>=36&&beat.midi<=96){(s.run.notes||=[]).push(beat.midi);(s.run.noteTicks||=[]).push(Number.isSafeInteger(beat.tick)&&beat.tick>=0?beat.tick:null);(s.run.noteSteps||=[]).push(Number.isInteger(beat.step)&&beat.step>=0&&beat.step<16?beat.step:null);if(s.run.notes.length>8){s.run.notes.shift();s.run.noteSteps.shift();s.run.noteTicks.shift();}}}if(beat.silent)s.run.silent=true;return;}
  if(WORLD_CHAPTERS.includes(id)){const j=s.journeyShare[id]||(s.journeyShare[id]={hits:0,total:0,silent:false});j.total++;if(on)j.hits++;if(beat.silent)j.silent=true;}}
 function grant(id,stars){const s=own(),got=s.stars[id],fresh=stars.map((x,i)=>x&&!got[i]);stars.forEach((x,i)=>{if(x)got[i]=true;});return fresh;}
 // A Journey chapter kept: its ★, and its ★★ if it was played on time with sound.
 function chapterKept(id){const s=own();if(s.readOnly||!WORLD_CHAPTERS.includes(id))return;const j=s.journeyShare[id]||{hits:0,total:0};grant(id,[true,!j.silent&&share(j.hits,j.total)>=RHYTHM_STAR,false]);}
 // The gold thing of a round closed: stars, sparks, record, and the chapter's state back as it was.
 function finish(id){const s=own(),r=s.run;if(s.readOnly||!r||r.id!==id)return false;
  // Reward, record, personal notes, remix and restored chapter are one durable operation.
  const game=gameKey(id),playing=runtime.S.journey?.[game];
  const keys=['lugares','journey','sparkEconomy','sparks','wild','rewards'],before=Object.fromEntries(keys.map(k=>[k,structuredClone(runtime.S[k])])),tempo=runtime.MU?.tempoScale,window=runtime.MU?.onTimeWindow;
  function rollback(){if(runtime.S.journey&&game){if(playing===undefined)delete runtime.S.journey[game];else runtime.S.journey[game]=playing;}for(const k of keys){if(before[k]===undefined)delete runtime.S[k];else if(object(before[k])&&object(runtime.S[k]))restoreTree(runtime.S[k],before[k]);else runtime.S[k]=before[k];}if(runtime.MU){runtime.MU.tempoScale=tempo;runtime.MU.onTimeWindow=window;}return false;}
  function commit(){return runtime.save?.()!==false;}
  // Libre (plan H3): only the music of the place; no stars, no sparks, no card. Back to its portal.
  if(r.free){const pos={wx:runtime.S.wx,wy:runtime.S.wy};restore(r);s.run=null;back(r.from);if(!commit()){Object.assign(runtime.S,pos);return rollback();}shown=null;runtime.journeyVictory?.(id);runtime.hud?.();return true;}const onTime=share(r.hits,r.total),sound=runtime.S.sound!==false&&!r.silent,ms=Date.now()-r.startedAt;
  if(s.rounds.day!==today()){s.rounds.day=today();s.rounds.counts={};}const roundsToday=s.rounds.counts[id]||0;s.rounds.counts[id]=roundsToday+1;
  const stars=roundStars({onTime,maestro:r.maestro,sound}),fresh=grant(id,stars);
  runtime.S.sparkEconomy=normalizeSparkEconomy(runtime.S.sparkEconomy,runtime.S.sparks,runtime.S.todayKey);const sparks=creditSparks(runtime.S,roundSparks(onTime,{maestro:r.maestro,roundsToday}));
  const extra=r.remix?runtime.remixDone?.(onTime)||null:null;
  const b=s.best[id]||(s.best[id]={onTime:0,ms:null,rounds:0});const record=onTime>b.onTime||b.ms===null||ms<b.ms;b.onTime=Math.max(b.onTime,onTime);b.ms=b.ms===null?ms:Math.min(b.ms,ms);b.rounds++;
  const j=runtime.S.journey;if(j&&typeof j==='object'){if(!j.colors||typeof j.colors!=='object')j.colors={};j.colors[id]=true;}
  {const all=(r.notes||[]).map((n,i)=>[n,r.noteSteps?.[i],r.noteTicks?.[i]]).filter(([n])=>Number.isInteger(n)&&n>=36&&n<=96).slice(-8);if(all.length){s.notes[id]=all.map(([n])=>n);s.noteSteps||={};if(all.every(([,st])=>Number.isInteger(st)))s.noteSteps[id]=all.map(([,st])=>st);else delete s.noteSteps[id];s.noteTicks||={};if(all.every((a,i)=>Number.isSafeInteger(a[2])&&a[2]>=0&&(!i||a[2]>=all[i-1][2])))s.noteTicks[id]=all.map(a=>a[2]);else delete s.noteTicks[id];}}
  const personal=s.notes[id]?.length?JSON.stringify([s.notes[id],s.noteSteps?.[id],s.noteTicks?.[id]])!==JSON.stringify([before.lugares.notes?.[id],before.lugares.noteSteps?.[id],before.lugares.noteTicks?.[id]])?'changed':'kept':null;
  const result={id,personal,from:r.from,maestro:r.maestro,remix:r.remix||null,extra,onTime,ms,stars,fresh,sparks,record,roundsToday,sound};restore(r);s.run=null;if(!commit())return rollback();shown=result;runtime.narrateRound?.(shown);runtime.quietAchievements?.();runtime.journeyVictory?.(id);runtime.hud?.();afterDrop(result);return true;}
 // Panel 10 (P4, Simogo): the card waits for the end of the round's two-bar drop, as heard (audio clock minus the
 // output latency); never before journeyVictoryState().end. Without sound or drop, after 1,2 s as before.
 function afterDrop(result){const born=Date.now();let end=null;
  const check=()=>{if(shown!==result||run())return;const v=runtime.journeyVictoryState?.(),ac=runtime.ac;if(v&&v.id===result.id){if(Number.isFinite(v.end))end=v.end;else if(Date.now()-born<12000){setTimeout(check,250);return;}}
   const heard=audibleTime(ac);
   if(end!==null&&ac&&heard<end&&Date.now()-born<12000){setTimeout(check,Math.min(1000,Math.max(30,Math.ceil((end-heard)*1000)+30)));return;}
   cardDue=null;results();};
  cardDue=result;setTimeout(check,1200);}
 // Leaving a round from the menu: nothing earned, the chapter's state back, and you are at the portal again.
 function abandon(){const s=own(),r=s.run;if(!r||s.readOnly)return false;const key=gameKey(r.id),playing=runtime.S.journey?.[key],position={wx:runtime.S.wx,wy:runtime.S.wy},tempo=runtime.MU?.tempoScale,window=runtime.MU?.onTimeWindow;restore(r);s.run=null;back(r.from);
  if(runtime.save?.()===false){s.run=r;if(playing===undefined)delete runtime.S.journey[key];else runtime.S.journey[key]=playing;Object.assign(runtime.S,position);if(runtime.MU){runtime.MU.tempoScale=tempo;runtime.MU.onTimeWindow=window;}runtime.toast?.('No se pudo salir. Tu ronda sigue aquí.',{level:2});return false;}
  runtime.narrate?.('abandon');runtime.hud?.();return true;}
 // The round's card: the three stars, what each asks, and what you earned. Silent buttons.
 function results(){const box=runtime.$?.('mPlace'),r=shown;if(!box||!r)return;if(globalThis.document?.querySelector?.('.modal:not([hidden]):not(#mPlace)')){setTimeout(()=>{if(shown===r&&!run())results();},300);return;}const pct=roundPercent(r.onTime),near=!r.maestro&&r.sound&&!own().stars[r.id][1]?nearMiss(r.onTime):null;box.toggleAttribute?.('data-near',!!near);
  runtime.$('placeTitle').textContent=(PLACES.find(p=>p.id===r.id)?.name||r.id)+' · '+(r.maestro?'Maestro':r.remix?'Remezcla':'Completo');
  runtime.$('placeStars').setAttribute('aria-label','Tu colección de estrellas');runtime.$('placeRows').setAttribute('aria-label','Esta ronda');runtime.$('placeStars').innerHTML='<small>Tu colección</small>'+['★','★','★'].map((x,i)=>`<span class="${own().stars[r.id][i]?'got':''}${r.fresh[i]?' new':''}">${x}</span>`).join('');
  runtime.$('placeRows').innerHTML=['<li>Esta ronda</li>',`<li>${r.stars[0]?'✓':'·'} Completar</li>`,`<li>${r.stars[1]?'✓':'·'} Ritmo · ${pct} % / 75 % a tiempo</li>`,near?`<li class="place-near">A ${near} de ★★</li>`:'',`<li>${r.stars[2]?'✓':'·'} Maestro${r.maestro?` · ${pct} % / 70 %`:' · otra ronda'}</li>`].join('')+(r.sound?'':'<li>Con sonido: ★★ y ★★★.</li>')+(r.personal?`<li>${r.personal==='changed'?'Tu frase queda':'Tu frase sigue'} en el final de Tu canción.</li>`:'');
  runtime.$('placeEarned').textContent=`${roundTime(r.ms)} · +${r.sparks+(r.extra?.sparks||0)} ✦${r.record||r.extra?.record?' · récord':''}`;box.hidden=false;
  // Panel 10 (P4, Chen, Matsuura, Pope): the card speaks only of the round; new achievements wait in the Bitácora.
  runtime.quietAchievements?.();const nar=runtime.$('placeNarrator');if(nar){nar.hidden=true;nar.textContent='';}
  runtime.$('placeAgain').onclick=()=>{box.hidden=true;start(r.id,{maestro:r.maestro,from:r.from,remix:r.remix});};runtime.$('placeMaestro').hidden=!own().stars[r.id][1]||r.maestro;runtime.$('placeMaestro').onclick=()=>{box.hidden=true;start(r.id,{maestro:true,from:r.from});};runtime.$('placeClose').onclick=()=>{box.hidden=true;back(r.from);runtime.save?.();runtime.songFinaleCheck?.();};
  // The next track on the path, straight from the card (plan H3); after the eleven, the place nearest its next star.
  // Near ★★, «Otra vez» stands beside it (CSS: #mPlace[data-near]).
  const next=nextGoal(own(),runtime.S.journey),nb=runtime.$('placeNext');if(nb){nb.hidden=!next||next.id===r.id||!runtime.ringGo;if(next){nb.textContent=`Seguir hacia ${next.name}`;nb.onclick=()=>{box.hidden=true;back(r.from);if(runtime.songFinaleCheck?.())return;runtime.ringGuide?.(next.id);};}}}
 Object.defineProperties(runtime,{placeRun:{get:()=>run},startPlace:{get:()=>start},abandonPlace:{get:()=>abandon},placeHear:{get:()=>hear},placeFinish:{get:()=>finish},placeChapterKept:{get:()=>chapterKept},placesData:{get:()=>own},
  placeGoalScale:{get:()=>()=>run()?.maestro?MAESTRO_GOAL:1},placeNext:{get:()=>()=>nextGoal(own(),runtime.S.journey)?.id||null},placeCardDue:{get:()=>()=>!!cardDue&&cardDue===shown&&!run()},roundTick:{get:()=>()=>roundTick(run(),runtime.S.sound!==false)},places:{get:()=>()=>{const s=own();return {stars:JSON.parse(JSON.stringify(s.stars)),count:starCount(s),best:JSON.parse(JSON.stringify(s.best)),run:s.run?{id:s.run.id,maestro:s.run.maestro,...(s.run.remix?{remix:s.run.remix}:{}),...(s.run.free?{free:true}:{}),hits:s.run.hits,total:s.run.total}:null,last:shown?{...shown}:null};}}});
}
