// The first two hours (plan H7, docs/MUNDO.md): a model of three players, on time six, seven and a half and nine pulses in
// ten, from the Journey through the eleven places in order, then back for ★★ and the Maestro rounds. It records each
// novelty (a chapter, a new place, a star that grows the song, a piece bought, the win) and the longest stretch without
// one; the panel's rule is never more than 12 minutes. A model of play time, not a measurement of people.
// Plan I6 (Chen, third panel): the rule counts only what grows the song (a chapter, a place, a star, the win); pieces
// bought no longer pass it. A fourth player plays without sound (only ★ can be won), and each profile says when a
// player is likely to leave: the start of the first stretch longer than the rule. The calibration is not modelled.
import {PLACES,RHYTHM_STAR,MAESTRO_STAR,MAESTRO_TEMPO,MAESTRO_GOAL,TOTAL_STARS} from '../src/places.js';
import {roundSparks} from '../src/spark-rules.js';
import {CUBE_SHOP} from '../src/cube-shop-model.js';
import {hashKey} from '../src/universe-regions.js';
import {minePerMinute} from './spark-economy.mjs';
export const HORIZON=120,NOVELTY_GAP=12;
// The Journey (docs/VIAJE.md): the Camino and five chapters, then the Refugio's finale; each chapter keeps the ★ of its place.
export const JOURNEY=Object.freeze([['camino',2],['llanura',2.5],['lago',2.5],['bosque',3],['tormenta',2.5],['vacio',2.5],['final',1.5]]);
// Rounds at 75 % on time, in minutes, from the places' bot simulations (F9–F17); a better player fills the bar sooner.
export const ROUND_AT_75=Object.freeze({llanura:2.5,lago:2.5,bosque:2.5,tormenta:2.5,vacio:2.5,jardin:2.4,dunas:2.55,cristales:2.45,faros:2.47,ruinas:2.22,cueva:2.45});
export const WALK=.4,WANDER=2,WANDER_EVERY=3,RETRIES=3,PRACTICE=.015,PRACTICE_MAX=.06,SPREAD=.05,MAESTRO_COST=.07;
export const PROFILES=Object.freeze([{id:'60',onTime:.6},{id:'75',onTime:.75},{id:'90',onTime:.9},{id:'sin sonido',onTime:.6,sound:false}]);
const roundMinutes=(id,onTime,maestro)=>ROUND_AT_75[id]*Math.min(1.6,.75/Math.max(.3,onTime))*(maestro?MAESTRO_GOAL/MAESTRO_TEMPO:1);
export function simulate(profile,{mine=null,rhythmStar=RHYTHM_STAR,maestroStar=MAESTRO_STAR}={}){
 const rate=mine||{1:minePerMinute(1),2:minePerMinute(2),3:minePerMinute(3)},sound=profile.sound!==false;
 // Without sound there is no beat to meet: every pulse counts once (spark-rules.js).
 const world=!sound?rate[1]:profile.onTime*(profile.onTime>=.85?.5*rate[2]+.5*rate[3]:rate[2]);
 const stars=Object.fromEntries(PLACES.map(p=>[p.id,[false,false,false]])),tries={},shop=[...CUBE_SHOP].sort((a,b)=>a.cost-b.cost);
 const events=[];let t=0,sparks=0,rounds=0,won=null,master=null;
 const note=(kind,what)=>{if(t<=HORIZON)events.push({t:+t.toFixed(2),kind,what});};
 const count=()=>Object.values(stars).reduce((n,s)=>n+s.filter(Boolean).length,0);
 const buy=()=>{while(shop.length&&sparks>=shop[0].cost){const p=shop.shift();sparks-=p.cost;note('compra',p.id);}};
 // A round's share on time: the player's own, a little up or down each time, better with practice; narrower in a Maestro.
 const share=(id,maestro)=>{const n=tries[id]=(tries[id]||0)+1;return Math.max(0,Math.min(1,profile.onTime+(hashKey(`curve:${profile.id}:${id}:${n}`)-.5)*2*SPREAD+Math.min(PRACTICE_MAX,PRACTICE*(n-1))-(maestro?MAESTRO_COST:0)));};
 function round(id,maestro=false){const q=share(id,maestro),s=stars[id],had=s.filter(Boolean).length;t+=WALK+roundMinutes(id,q,maestro);rounds++;
  if(!s[0]){s[0]=true;note('lugar',id);}if(sound&&q>=rhythmStar&&!s[1]){s[1]=true;note('★★',id);}if(sound&&maestro&&q>=maestroStar&&!s[2]){s[2]=true;note('★★★',id);}
  sparks+=roundSparks(q,{maestro});buy();
  if(!won&&PLACES.every(p=>stars[p.id][0])){won=t;note('victoria','once lugares');}if(!master&&count()===TOTAL_STARS){master=t;note('maestro','33 ★');}
  if(rounds%WANDER_EVERY===0){t+=WANDER;sparks+=WANDER*world+15;note('salvaje','chispa');buy();}
  return s.filter(Boolean).length>had;}
 for(const [id,min] of JOURNEY){t+=min;if(stars[id])stars[id][0]=true;note('viaje',id);}
 // In order, like the tracks of a record: the six places after the Journey open one by one.
 for(const p of PLACES)if(!stars[p.id][0])round(p.id);
 // Then back for ★★ (a few tries each) and the Maestro rounds, while the two hours last.
 for(let pass=0;t<HORIZON&&pass<6;pass++){let any=false;
  for(const p of PLACES){if(t>=HORIZON)break;const s=stars[p.id];
   if(!s[1]){for(let k=0;k<RETRIES&&!s[1]&&t<HORIZON;k++)any=round(p.id)||any;}
   else if(!s[2]){for(let k=0;k<RETRIES&&!s[2]&&t<HORIZON;k++)any=round(p.id,true)||any;}}
  if(!any&&pass>1)break;}
 // The longest stretch without a novelty, up to the end of the two hours or the 33 ★ (after those, the free World
 // is all there is): once counting the pieces bought, once counting only what grows the song.
 const end=Math.min(HORIZON,master??HORIZON);
 function longest(kinds){const m=[0,...events.filter(e=>kinds.includes(e.kind)&&e.t<=end).map(e=>e.t),end];let gap=0,from=0;for(let i=1;i<m.length;i++)if(m[i]-m[i-1]>gap){gap=m[i]-m[i-1];from=m[i-1];}return {gap:+gap.toFixed(1),from:+from.toFixed(1)};}
 const any=longest(['viaje','lugar','★★','★★★','victoria','maestro','compra']),song=longest(['viaje','lugar','★★','★★★','victoria','maestro']);
 // When a player is likely to leave: the start of the first stretch without a song novelty longer than the rule.
 const marks=[0,...events.filter(e=>['viaje','lugar','★★','★★★','victoria','maestro'].includes(e.kind)&&e.t<=end).map(e=>e.t),end];let quit=null;for(let i=1;i<marks.length;i++)if(marks[i]-marks[i-1]>NOVELTY_GAP){quit=+marks[i-1].toFixed(1);break;}
 const at60=events.filter(e=>e.t<=60),starsAt=m=>events.filter(e=>e.t<=m&&['viaje','lugar','★★','★★★'].includes(e.kind)&&!(e.kind==='viaje'&&!stars[e.what])).length;
 return {id:profile.id,onTime:profile.onTime,won:won&&+won.toFixed(1),master:master&&+master.toFixed(1),stars60:starsAt(60),stars120:starsAt(HORIZON),bought120:events.filter(e=>e.kind==='compra').length,
  withPurchasesGap:any.gap,songGap:song.gap,songGapFrom:song.from,rule:song.gap<=NOVELTY_GAP,quitAt:quit,sound,novelties60:at60.filter(e=>e.kind!=='salvaje').length,events};}
export function curve(rules={}){const mine={1:minePerMinute(1),2:minePerMinute(2),3:minePerMinute(3)};return PROFILES.map(p=>simulate(p,{mine,...rules}));}
const line=r=>`${r.sound?r.id+' %':r.id}  victoria ${r.won??'—'} min · 33★ ${r.master??'—'} · ★ a los 60 min ${r.stars60}, a los 120 ${r.stars120} · ${r.bought120} piezas · sin que crezca la canción ${r.songGap} min desde el ${r.songGapFrom} ${r.rule?'(cumple 12 min)':'(NO cumple 12 min)'} · ${r.quitAt===null?'sin riesgo de abandono':'riesgo de abandono hacia el minuto '+r.quitAt} · con compras, mayor hueco ${r.withPurchasesGap} min`;
if(import.meta.url===`file://${process.argv[1]}`){const all=curve();
 console.log('Reglas de hoy (★★ 75 %, ★★★ 70 % en Maestro):');for(const r of all)console.log(line(r));
 console.log('Antes de I5 (★★ 85 %, ★★★ 80 %):');for(const r of curve({rhythmStar:.85,maestroStar:.8}))console.log(line(r));
 if(process.argv.includes('--json'))console.log(JSON.stringify(all.map(({events,...r})=>r),null,1));}
