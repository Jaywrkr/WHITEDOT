// The first two hours (plan H7, docs/MUNDO.md): a model of three players, on time six, seven and a half and nine pulses in
// ten, from the Journey through the eleven places in order, then back for ★★ and the Maestro rounds. It records each
// novelty (a chapter, a new place, a star that grows the song, a piece bought, the win) and the longest stretch without
// one; the panel's rule is never more than 12 minutes. A model of play time, not a measurement of people.
// Plan I6 (Chen, third panel): the rule counts only what grows the song (a chapter, a place, a star, the win); pieces
// bought no longer pass it. A fourth player plays without sound (only ★ can be won), and each profile reports the
// start of its first structural gap longer than the rule (not a prediction of abandonment). The calibration is not modelled.
// Panel 10 (P6, D1-B, Chen): a ★ layer grows with the best share on time in its place (song.js growthSteps); a round
// with sound that grows it is the novelty «crece», and the rule counts it: the song grows.
import {PLACES,RHYTHM_STAR,MAESTRO_STAR,MAESTRO_TEMPO,MAESTRO_GOAL,TOTAL_STARS} from '../src/places.js';
import {roundSparks,LEVEL_SPARKS,ECONOMY_BEFORE_E1,ECONOMY_BEFORE_H1} from '../src/spark-rules.js';
import {WILD_SPARKS} from '../src/wild.js';
import {LIVE_REWARD} from '../src/live-encounters-model.js';
import {SKY_REWARD,SKY_FIGURES} from '../src/sky-map-model.js';
import {CUBE_SHOP} from '../src/cube-shop-model.js';
import {hashKey} from '../src/universe-regions.js';
import {minePerMinute,livePerMinute} from './spark-economy.mjs';
import {growthSteps} from '../src/song.js';
export const HORIZON=120,NOVELTY_GAP=12;
// The Journey (docs/VIAJE.md): the Camino and five chapters, then the Refugio's finale; each chapter keeps the ★ of its place.
export const JOURNEY=Object.freeze([['camino',2],['llanura',2.5],['lago',2.5],['bosque',3],['tormenta',2.5],['vacio',2.5],['final',1.5]]);
// Rounds at 75 % on time, in minutes, from the places' bot simulations (F9–F17); a better player fills the bar sooner.
export const ROUND_AT_75=Object.freeze({llanura:2.5,lago:2.5,bosque:2.5,tormenta:2.5,vacio:2.5,jardin:2.4,dunas:2.55,cristales:2.45,faros:2.47,ruinas:2.22,cueva:2.45});
export const WALK=.4,WANDER=2,WANDER_EVERY=3,RETRIES=3,PRACTICE=.015,PRACTICE_MAX=.06,SPREAD=.05,MAESTRO_COST=.07;
// E1 (Jay, 27 Oct 2026): living encounters while travelling (livePerMinute, spark-economy.mjs). Earnings are reported
// at 15, 30, 60 and 120 minutes, for today's economy and for the one before E1.
export const CHECKPOINTS=Object.freeze([15,30,60,120]);
// F1 (Jay, 28 Oct 2026, alpha.231): the Mapa del cielo pays 10 ✦ (15 with a pulse on time) the first time each figure is
// joined, never again. While travelling, about SKY_JOINED figures a minute are joined (a figure every few minutes of travel:
// about one in sight per km, most of them joined); within these two hours, near the ring, only the short figures of the
// first 5 km are there to find (SKY_NEAR), so the sparks of the sky stop when those are in the map.
export const SKY_JOINED=.12,SKY_NEAR=SKY_FIGURES.filter(f=>!f.km&&!f.night).length;
// H1 (Jay, 28 Oct 2026, alpha.233): levels give ★ and Tu canción, never ✦; sparks are of the open universe only. Its
// sources pay more (spark-rules.js: the World's crystals ×3, living encounters 30/45, the sky 20/30, the wild spark 45,
// activities 30, mischief 20). An economy says what each source pays: rounds (roundBase + roundPerTenth per tenth),
// living encounters (live), the sky (sky), the World's crystals against today's code (mine) and the wild spark (wild).
// The route is how long the player roams the free World between rounds: until H1, WANDER minutes every WANDER_EVERY
// rounds (the rounds paid, so there was little reason to roam); since H1 the sparks are out there, so the model has the
// player roam ROUTE_NOW.wander minutes after every round on the way to the next portal. An assumption, not a measure.
export const ROUTE_BEFORE=Object.freeze({wander:WANDER,every:WANDER_EVERY}),ROUTE_NOW=Object.freeze({wander:1.6,every:1});
export const ECONOMY_NOW=Object.freeze({roundBase:LEVEL_SPARKS,roundPerTenth:LEVEL_SPARKS,live:LIVE_REWARD,sky:SKY_REWARD,mine:1,wild:WILD_SPARKS,route:ROUTE_NOW});
// alpha.231/232: rounds paid 80–170 and the open universe a third (crystals) or half of today (spark-rules.js).
export const ECONOMY_BEFORE=Object.freeze({...ECONOMY_BEFORE_H1,route:ROUTE_BEFORE});
// alpha.230: alpha.231 without the Mapa del cielo, so the curves show what F1 added.
export const ECONOMY_BEFORE_F1=Object.freeze({...ECONOMY_BEFORE,sky:null});
// An economy without a route of its own (ECONOMY_BEFORE_E1) roams as the rounds of its time let it.
const routeOf=e=>e.route||(e.roundBase>0?ROUTE_BEFORE:ROUTE_NOW);
export const PROFILES=Object.freeze([{id:'60',onTime:.6},{id:'75',onTime:.75},{id:'90',onTime:.9},{id:'sin sonido',onTime:.6,sound:false}]);
const roundMinutes=(id,onTime,maestro)=>ROUND_AT_75[id]*Math.min(1.6,.75/Math.max(.3,onTime))*(maestro?MAESTRO_GOAL/MAESTRO_TEMPO:1);
export function simulate(profile,{mine=null,rhythmStar=RHYTHM_STAR,maestroStar=MAESTRO_STAR,economy=ECONOMY_NOW}={}){
 const measured=mine||{1:minePerMinute(1),2:minePerMinute(2),3:minePerMinute(3)},scale=economy.mine??1,rate={1:measured[1]*scale,2:measured[2]*scale,3:measured[3]*scale},sound=profile.sound!==false;
 const route=routeOf(economy),wild=economy.wild??WILD_SPARKS;
 // Without sound there is no beat to meet: every pulse counts once (spark-rules.js).
 const world=!sound?rate[1]:profile.onTime*(profile.onTime>=.85?.5*rate[2]+.5*rate[3]:rate[2]);
 const stars=Object.fromEntries(PLACES.map(p=>[p.id,[false,false,false]])),best={},tries={},shop=[...CUBE_SHOP].sort((a,b)=>a.cost-b.cost);
 const events=[],earnedAt={},live=livePerMinute(profile,economy.live);let t=0,sparks=0,earned=0,rounds=0,won=null,master=null,skyJoined=0;
 // The sky's sparks for some minutes of travel: new figures only, until the near ones are all in the map.
 const skyEach=economy.sky?(sound?profile.onTime*economy.sky.onTime+(1-profile.onTime)*economy.sky.base:economy.sky.base):0;
 const sky=minutes=>{if(!skyEach)return 0;const n=Math.min(SKY_NEAR-skyJoined,SKY_JOINED*minutes);skyJoined+=n;return n*skyEach;};
 // Time passes with what it earns: a checkpoint inside a stretch gets its share of that stretch.
 const advance=(minutes,gain)=>{for(const m of CHECKPOINTS)if(earnedAt[m]===undefined&&m>t&&m<=t+minutes)earnedAt[m]=Math.round(earned+gain*(m-t)/minutes);t+=minutes;earned+=gain;sparks+=gain;};
 const note=(kind,what)=>{if(t<=HORIZON)events.push({t:+t.toFixed(2),kind,what});};
 const count=()=>Object.values(stars).reduce((n,s)=>n+s.filter(Boolean).length,0);
 const buy=()=>{while(shop.length&&sparks>=shop[0].cost){const p=shop.shift();sparks-=p.cost;note('compra',p.id);}};
 // A round's share on time: the player's own, a little up or down each time, better with practice; narrower in a Maestro.
 const share=(id,maestro)=>{const n=tries[id]=(tries[id]||0)+1;return Math.max(0,Math.min(1,profile.onTime+(hashKey(`curve:${profile.id}:${id}:${n}`)-.5)*2*SPREAD+Math.min(PRACTICE_MAX,PRACTICE*(n-1))-(maestro?MAESTRO_COST:0)));};
 function round(id,maestro=false){const q=share(id,maestro),s=stars[id],had=s.filter(Boolean).length;advance(WALK+roundMinutes(id,q,maestro),(economy.roundBase||economy.roundPerTenth?roundSparks(q,{maestro,base:economy.roundBase,perTenth:economy.roundPerTenth}):0)+WALK*live+sky(WALK));rounds++;
  const grew=sound&&!s[1]&&s[0]&&q<rhythmStar&&growthSteps(q)>growthSteps(best[id]);if(sound)best[id]=Math.max(best[id]??0,q);
  if(!s[0]){s[0]=true;note('lugar',id);}if(sound&&q>=rhythmStar&&!s[1]){s[1]=true;note('★★',id);}if(grew){note('crece',id);}if(sound&&maestro&&q>=maestroStar&&!s[2]){s[2]=true;note('★★★',id);}
  note('interpretacion',id);buy();
  if(!won&&PLACES.every(p=>stars[p.id][0])){won=t;note('victoria','once lugares');}if(!master&&count()===TOTAL_STARS){master=t;note('maestro','33 ★');}
  if(rounds%route.every===0){advance(route.wander,route.wander*world+wild+route.wander*live+sky(route.wander));note('salvaje','chispa');buy();}
  return s.filter(Boolean).length>had||grew;}
 for(const [id,min] of JOURNEY){advance(min,0);if(stars[id])stars[id][0]=true;note('viaje',id);}
 // In order, like the tracks of a record: the six places after the Journey open one by one.
 for(const p of PLACES)if(!stars[p.id][0])round(p.id);
 // Then back for ★★ (a few tries each) and the Maestro rounds, while the two hours last.
 for(let pass=0;t<HORIZON&&pass<6;pass++){let any=false;
  for(const p of PLACES){if(t>=HORIZON)break;const s=stars[p.id];
   // P6: while the song grows the player stays; a second retry that adds nothing sends them to the next place.
   if(!s[1]){for(let k=0;k<RETRIES&&!s[1]&&t<HORIZON;k++){const grew=round(p.id);any=grew||any;if(!grew&&k>0)break;}}
   else if(!s[2]){for(let k=0;k<RETRIES&&!s[2]&&t<HORIZON;k++)any=round(p.id,true)||any;}}
  if(!any&&pass>1)break;}
 // The longest stretch without a novelty, up to the end of the two hours or the 33 ★ (after those, the free World
 // is all there is): once counting the pieces bought, once counting only what grows the song.
 // After the last round the player keeps travelling the free World: mining and encounters, for the earnings only.
 for(const m of CHECKPOINTS)if(earnedAt[m]===undefined)earnedAt[m]=Math.round(earned+(m-t)*(world+live)+sky(m-t));
 const end=Math.min(HORIZON,master??HORIZON);
 function longest(kinds){const m=[0,...events.filter(e=>kinds.includes(e.kind)&&e.t<=end).map(e=>e.t),end];let gap=0,from=0;for(let i=1;i<m.length;i++)if(m[i]-m[i-1]>gap){gap=m[i]-m[i-1];from=m[i-1];}return {gap:+gap.toFixed(1),from:+from.toFixed(1)};}
 const any=longest(['viaje','lugar','crece','★★','★★★','victoria','maestro','compra']),song=longest(['viaje','lugar','crece','★★','★★★','victoria','maestro']);
 // Structural gap only. quitAt retains its legacy field name; this model cannot predict abandonment or enjoyment.
 const marks=[0,...events.filter(e=>['viaje','lugar','crece','★★','★★★','victoria','maestro'].includes(e.kind)&&e.t<=end).map(e=>e.t),end];let quit=null;for(let i=1;i<marks.length;i++)if(marks[i]-marks[i-1]>NOVELTY_GAP){quit=+marks[i-1].toFixed(1);break;}
 const at60=events.filter(e=>e.t<=60),starsAt=m=>events.filter(e=>e.t<=m&&['viaje','lugar','★★','★★★'].includes(e.kind)&&!(e.kind==='viaje'&&!stars[e.what])).length;
 return {id:profile.id,onTime:profile.onTime,won:won&&+won.toFixed(1),master:master&&+master.toFixed(1),stars60:starsAt(60),stars120:starsAt(HORIZON),bought120:events.filter(e=>e.kind==='compra').length,grew120:events.filter(e=>e.kind==='crece').length,
  completedInterpretations:events.filter(e=>e.kind==='interpretacion').length,interpretationGap:longest(['viaje','lugar','crece','★★','★★★','victoria','maestro','interpretacion']).gap,interestMeasured:false,withPurchasesGap:any.gap,songGap:song.gap,songGapFrom:song.from,rule:song.gap<=NOVELTY_GAP,quitAt:quit,sound,earnedAt,novelties60:at60.filter(e=>!['salvaje','interpretacion'].includes(e.kind)).length,events};}
export function curve(rules={}){const mine={1:minePerMinute(1),2:minePerMinute(2),3:minePerMinute(3)};return PROFILES.map(p=>simulate(p,{mine,...rules}));}
// H1: a player who only roams the free World (no rounds) for some minutes, to check the shop is not given away: the
// World's crystals and living encounters, a wild spark every WILD_EVERY minutes and the near figures of the sky.
export const WILD_EVERY=1.5;
export function explorer(profile,minutes=20,{mine=null,economy=ECONOMY_NOW}={}){const measured=mine||{1:minePerMinute(1),2:minePerMinute(2),3:minePerMinute(3)},scale=economy.mine??1,sound=profile.sound!==false;
 const world=(!sound?measured[1]:profile.onTime*(profile.onTime>=.85?.5*measured[2]+.5*measured[3]:measured[2]))*scale,live=livePerMinute(profile,economy.live);
 const skyEach=economy.sky?(sound?profile.onTime*economy.sky.onTime+(1-profile.onTime)*economy.sky.base:economy.sky.base):0;
 const earned=Math.round(minutes*(world+live)+Math.floor(minutes/WILD_EVERY)*(economy.wild??WILD_SPARKS)+Math.min(SKY_NEAR,SKY_JOINED*minutes)*skyEach);
 let left=earned,bought=0;for(const p of [...CUBE_SHOP].sort((a,b)=>a.cost-b.cost)){if(left<p.cost)break;left-=p.cost;bought++;}
 return {id:profile.id,minutes,earned,bought,shopShare:+(earned/CUBE_SHOP.reduce((a,p)=>a+p.cost,0)).toFixed(3)};}
const line=r=>`${r.sound?r.id+' %':r.id}  victoria ${r.won??'—'} min · 33★ ${r.master??'—'} · ★ a los 60 min ${r.stars60}, a los 120 ${r.stars120} · ${r.bought120} piezas · ${r.grew120} veces crece · sin nuevas capas ${r.songGap} min desde el ${r.songGapFrom} ${r.rule?'(cumple 12 min)':'(NO cumple 12 min)'} · ${r.completedInterpretations} interpretaciones · disfrute no medido · con compras, mayor hueco ${r.withPurchasesGap} min`;
const compare=(title,before,all)=>{console.log(title);for(const [i,r] of all.entries()){const b=before[i];console.log(`${r.sound?r.id+' %':r.id}  `+CHECKPOINTS.map(m=>`${m} min ${b.earnedAt[m]} → ${r.earnedAt[m]}`).join(' · ')+` · piezas ${b.bought120} → ${r.bought120}`);}};
if(import.meta.url===`file://${process.argv[1]}`){const all=curve();
 console.log('Reglas de hoy (★★ 75 %, ★★★ 70 % en Maestro):');for(const r of all)console.log(line(r));
 console.log('Antes de I5 (★★ 85 %, ★★★ 80 %):');for(const r of curve({rhythmStar:.85,maestroStar:.8}))console.log(line(r));
 compare('Chispas ganadas a los '+CHECKPOINTS.join(', ')+' min · antes de E1 → hoy (piezas compradas a los 120 min):',curve({economy:ECONOMY_BEFORE_E1}),all);
 compare('Chispas ganadas a los '+CHECKPOINTS.join(', ')+' min · alpha.231 → hoy, chispas solo en el universo (H1):',curve({economy:ECONOMY_BEFORE}),all);
 compare('Lo mismo si el jugador no recorriera más el Mundo que en alpha.231 (recorrido antiguo):',curve({economy:ECONOMY_BEFORE}),curve({economy:{...ECONOMY_NOW,route:ROUTE_BEFORE}}));
 compare('alpha.230 → alpha.231, con el Mapa del cielo (F1):',curve({economy:ECONOMY_BEFORE_F1}),curve({economy:ECONOMY_BEFORE}));
 console.log('Solo explorando el Mundo libre 20 min, sin rondas · alpha.231 → hoy:');for(const p of PROFILES){const b=explorer(p,20,{economy:ECONOMY_BEFORE}),r=explorer(p,20);console.log(`${p.sound===false?p.id:p.id+' %'}  ${b.earned} → ${r.earned} ✦ · piezas ${b.bought} → ${r.bought} · ${Math.round(r.shopShare*100)} % de la tienda`);}
 if(process.argv.includes('--json'))console.log(JSON.stringify(all.map(({events,...r})=>r),null,1));}
