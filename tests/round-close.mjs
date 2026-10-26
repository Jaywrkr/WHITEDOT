import assert from 'node:assert/strict';
import {initialize,nearMiss,roundTick,roundStars,roundPercent,RHYTHM_STAR,MAESTRO_STAR} from '../src/places.js';
import {initialize as achievements} from '../src/achievements.js';
// Panel 10, P4 · El cierre de la ronda.

// Near ★★: the tenths still missing between 70 and 74,9 %, never rounded up; nothing outside that band.
for(const [v,text] of [[.746,'0,4'],[.7,'5'],[.7499,'0,1'],[.70001,'5'],[.6999,null],[.75,null],[.9,null],[0,null]])assert.equal(nearMiss(v),text,String(v));
for(let k=0;k<200;k++){const v=.7+k/4000,gap=nearMiss(v);if(!gap)continue;assert(Number(roundPercent(v).replace(',','.'))+Number(gap.replace(',','.'))<=75+1e-9||roundPercent(v)==='75','the gap and the percent add to 75 at most');}

// The live tick: the same share and threshold the card uses, in ten seeded rounds; Maestro asks 70 %; none in Libre
// or without sound.
let seed=7;const rand=()=>(seed=(seed*1103515245+12345)%2147483648)/2147483648;
for(let n=0;n<10;n++){const total=40+Math.floor(rand()*200),p=.6+rand()*.3;let hits=0;for(let i=0;i<total;i++)if(rand()<p)hits++;
 const run={hits,total,maestro:false},tick=roundTick(run);assert.equal(tick.lit,roundStars({onTime:hits/total})[1],`round ${n}: tick and card agree`);assert.equal(tick.threshold,RHYTHM_STAR);}
assert.equal(roundTick({hits:7,total:10,maestro:true}).lit,true);assert.equal(roundTick({hits:7,total:10,maestro:true}).threshold,MAESTRO_STAR);
assert.equal(roundTick({hits:0,total:0}).lit,false,'dark before the first pulse');
assert.equal(roundTick({hits:9,total:10,free:true}),null);assert.equal(roundTick({hits:9,total:10,silent:true}),null);assert.equal(roundTick({hits:9,total:10},false),null);assert.equal(roundTick(null),null);

// The card waits for the end of the drop, as heard; carries no achievement line; near ★★ it says the gap and sets
// «Otra vez» beside «Seguir hacia».
const realNow=Date.now,realTimeout=globalThis.setTimeout;let clock=1e9,timers=[];Date.now=()=>clock;globalThis.setTimeout=(f,ms=0)=>{timers.push({at:clock+ms,f});return timers.length;};
function advance(ms){const until=clock+ms;for(;;){timers.sort((a,b)=>a.at-b.at);const t=timers[0];if(!t||t.at>until)break;timers.shift();clock=t.at;ac.currentTime=(clock-1e9)/1000;t.f();}clock=until;ac.currentTime=(clock-1e9)/1000;}
const el={};const $=id=>el[id]||(el[id]={id,hidden:true,textContent:'',innerHTML:'',attrs:{},setAttribute(k,v){this.attrs[k]=v;},toggleAttribute(k,on){if(on)this.attrs[k]='';else delete this.attrs[k];},classList:{toggle(){}}});
const ac={currentTime:0,outputLatency:.1};let victory=null,quieted=0;
const r={S:{wx:0,wy:0,sound:true,sparks:0,todayKey:'2026-10-26',journey:{finished:true,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}}},
 BIOMES:[{id:'lago'}],biomeOfPos:()=>0,regionOfPos:()=>({}),MU:{},save:()=>true,hud(){},$,ac,ringGo(){},quietAchievements(){quieted++;},
 journeyVictory(){victory={id:'lago',drop:1.5,end:1.5+4.8};return (victory.end-ac.currentTime)*1000;},journeyVictoryState:()=>victory};
initialize(r);assert.equal(r.startPlace('lago'),true);for(let i=0;i<500;i++)r.placeHear('lago',i<373,{});
assert.equal(r.roundTick().lit,false,'74,6 %: the tick stays dark');
r.placeFinish('lago');assert.equal(quieted,1,'what the round earned goes to the Bitácora');assert.equal(r.placeCardDue(),true,'toasts wait while the card is due');
advance(1200);assert.equal($('mPlace').hidden,true,'not at 1,2 s: the drop is still sounding');
advance(5000);assert.equal($('mPlace').hidden,true,'not before the end is heard (end + output latency)');
// The victory ends itself just before its last step: the end already seen still holds.
victory=null;advance(150);assert.equal($('mPlace').hidden,true);
advance(200);assert.equal($('mPlace').hidden,false,'the card once the drop has been heard');assert(ac.currentTime-ac.outputLatency>=6.3,'never before journeyVictoryState().end');
assert.equal(r.placeCardDue(),false);assert.equal(quieted,2);
assert.doesNotMatch($('placeRows').innerHTML,/logro/i);assert.equal($('placeNarrator').hidden,true);assert.equal($('placeNarrator').textContent,'');
assert.match($('placeRows').innerHTML,/A 0,4 de ★★/);assert.ok('data-near' in $('mPlace').attrs,'«Otra vez» beside «Seguir hacia»');
assert.equal($('placeNext').hidden,false);assert.equal($('placeNext').textContent,'Seguir hacia Jardín');
// A round with ★★ is not near; without sound the card comes after 1,2 s as before.
$('mPlace').hidden=true;r.startPlace('lago');for(let i=0;i<10;i++)r.placeHear('lago',i<8,{});victory=null;r.journeyVictory=()=>0;r.placeFinish('lago');advance(1199);assert.equal($('mPlace').hidden,true);advance(1);assert.equal($('mPlace').hidden,false);
assert.ok(!('data-near' in $('mPlace').attrs));assert.doesNotMatch($('placeRows').innerHTML,/de ★★<\/li>/);
// The place already has ★★: a later 72 % round does not say the gap.
$('mPlace').hidden=true;r.startPlace('lago');for(let i=0;i<100;i++)r.placeHear('lago',i<72,{});r.placeFinish('lago');advance(1200);assert.ok(!('data-near' in $('mPlace').attrs));
Date.now=realNow;globalThis.setTimeout=realTimeout;

// Achievements: quiet() drops the pending notice (no toast) and keeps the Bitácora's unread mark.
{const notices=[],classes=new Set(),button={classList:{toggle:(k,on)=>on?classes.add(k):classes.delete(k)},setAttribute(){}};let due=false;
 globalThis.document={hidden:false,querySelector:()=>null};
 const a={ACH:[['new','Nuevo','x']],S:{achievementVersion:2,ach:{},journal:{},todayKey:'2026-10-26'},$:id=>id==='bAch'?button:null,save:()=>true,toast:(t,o)=>{notices.push(t);return true;},inWorld:()=>false,placeCardDue:()=>due};
 achievements(a);a.S.ach.new='2026-10-26';a.achievementEarned(['new']);due=true;a.achievementsTick(2);assert.equal(notices.length,0,'no toast while the card is due');
 a.quietAchievements();due=false;a.achievementsTick(2);assert.equal(notices.length,0,'no toast after the card');assert(classes.has('has-unread'),'waiting in the Bitácora');
 delete globalThis.document;}
console.log('PASS round close: the card waits for the heard drop, no achievement line, near ★★ shows the gap and «Otra vez» beside «Seguir hacia», the live tick agrees with the card, quiet achievements wait in the Bitácora');
