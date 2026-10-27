import assert from 'node:assert/strict';
import {tierStep,songChord,SONG_IDS,growthSteps,placeTier,fragmentStep,GROWTH_FROM,GROWTH_STEP} from '../src/song.js';
import {songPlan,stageEvents,stageCaption,tierInk,TIER_SATURATION,UNDER_PHRASE,MASTER_LINES,FINAL_LINES,THEME_BARS} from '../src/song-stage.js';
import {initialize as victory} from '../src/journey-victory.js';
import {initialize as places,FINALE_LEAD} from '../src/places.js';
// Panel 10, P6 · Tocar donde sea y Tu canción para todos.

// D1-B (Chen): a ★ layer grows with the best share on time; the stars' thresholds do not change.
const c=songChord([60,64,67]),beats=(id,tier,bars=8)=>{let n=0;for(let s=0;s<bars*16;s++)n+=tierStep(id,s,c,tier).length;return n;};
assert.equal(growthSteps(undefined),0);assert.equal(growthSteps(.5),0);assert.equal(growthSteps(GROWTH_FROM),0);assert.equal(growthSteps(GROWTH_FROM+GROWTH_STEP),1);assert.equal(growthSteps(.99),15,'never the whole layer below ★★');
for(let b=GROWTH_FROM;b<=.75;b+=.01)assert(growthSteps(Math.min(.75,b+.05))>growthSteps(b)||growthSteps(b)===15,`a better round by five points grows the layer from ${b.toFixed(2)}`);
// The Llanura's kick on every beat: ★ half of them, 62 % at 60 %, three quarters at 67 %, the whole layer with ★★.
const at=best=>1+growthSteps(best)/16;
assert.equal(beats('llanura',1),16);assert.equal(beats('llanura',at(.6)),20);assert.equal(beats('llanura',at(.67)),25);assert.equal(beats('llanura',2),32);
for(const id of SONG_IDS){let prev=-1;for(let k=0;k<=15;k++){const n=beats(id,1+k/16);assert(n>=prev,id);prev=n;}assert(prev<=beats(id,2),id);}
// What grows is a superset: every beat a smaller tier plays, a larger one plays too, unchanged.
for(let k=0;k<15;k++)for(let s=0;s<128;s++)if(fragmentStep(1+k/16,s))assert(fragmentStep(1+(k+1)/16,s));
assert.deepEqual(tierStep('jardin',16*7+12,c,at(.6)),tierStep('jardin',16*7+12,c,2),'a grown beat sounds as in the whole layer');
// The tier comes from the save: stars first, then the best share for ★ alone.
const save=(stars,onTime)=>({stars:{lago:stars},best:onTime===undefined?{}:{lago:{onTime,ms:1,rounds:1}}});
assert.equal(placeTier(save([false,false,false]),'lago'),0);assert.equal(placeTier(save([true,false,false]),'lago'),1);
assert.equal(placeTier(save([true,false,false],.6),'lago'),1.25);assert.equal(placeTier(save([true,true,false],.6),'lago'),2);assert.equal(placeTier(save([true,true,true],.9),'lago'),3);

// The round's close sounds as the level won: a ★ round programs half the bars of a ★★ one.
{const param=()=>({value:1,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){},setTargetAtTime(){}}),node=()=>({gain:param(),connect(x){return x;},disconnect(){}});
 const drop=tier=>{const hits=[],w={S:{sound:true},ac:{currentTime:0,createGain:node},bus:node(),SIX:.125,MU:{sq:[{t:.5,s:0}],tr:0},chordTones:()=>[60,64,67],songHit:(out,e,t)=>hits.push({...e,t})};victory(w);w.journeyVictory('jardin',tier===undefined?undefined:{tier});
  assert.equal(w.journeyVictoryState().tier,tier??2);let bars=0;for(let k=0;k<32;k++){w.victoryMusicStep(k%16,.5+k*.125);if(k===31)bars=w.journeyVictoryState()?.sounding;}
  return {bars:new Set(hits.map(h=>Math.floor((h.t-.5)/.125/16))).size,hits:hits.length};};
 const one=drop(1),two=drop(2),three=drop(3),chapter=drop();
 assert.equal(one.bars*2,two.bars,'★ half the bars of ★★');assert.equal(one.hits*2,two.hits);assert(three.hits>two.hits,'★★★ its variation');assert.deepEqual(chapter,two,'a Journey chapter: the whole layer, as before');}

// D5-B (Wintory): Wintory's measure, every layer at ★★ and six notes per place. While your phrases sound and during
// the theme's first pass only the pad and the bass go on; your notes are at least 40 % of each phrase bar's events and
// the theme's bars carry at most eight others. The layers come back with the second pass.
const SC=[0,2,4,5,7,9,11];
for(const tier of [2,3]){const notes=Object.fromEntries(SONG_IDS.map((id,i)=>[id,[60+i%5,62,64,65,67,69]])),plan=songPlan({final:true,notes,six:.125}),tiers=Object.fromEntries(SONG_IDS.map(id=>[id,tier]));
 const bar=b=>{const out=[];for(let k=b*16;k<(b+1)*16;k++)out.push(...stageEvents(plan,k,[57,61,64],{tiers,notes,scale:SC,tr:0}));return out;};
 for(let b=plan.notesAt;b<plan.silenceAt;b++){const ev=bar(b),mine=ev.filter(e=>e.mine);assert(mine.length/ev.length>=.4,`bar ${b} at tier ${tier}: ${mine.length} of ${ev.length}`);
  assert(ev.every(e=>e.mine||UNDER_PHRASE.includes(e.layer)),'only the pad and the bass under your phrase');assert(mine.every(e=>e.what==='dub'),'the dub voice of the finales (Q7)');}
 for(let b=plan.themeAt;b<plan.themeAt+THEME_BARS/2;b++){const ev=bar(b),other=ev.filter(e=>!e.theme);assert(other.length<=8,`theme bar ${b}: ${other.length} others`);assert(ev.some(e=>e.theme));}
 const second=bar(plan.themeAt+THEME_BARS/2);assert(second.some(e=>e.theme)&&second.some(e=>e.layer==='llanura')&&second.some(e=>e.layer==='jardin'),'the second pass: everything back');
 assert(bar(plan.notesAt-1).some(e=>e.layer==='llanura'),'the layers play before your phrases');
 assert.equal(bar(plan.silenceAt).length,0,'the bar of silence');}
// The silence carries no words.
{const plan=songPlan({final:true,notes:{lago:[60,62]},six:.125});assert.equal(stageCaption(plan,plan.silenceAt*16).text,'');assert.equal(stageCaption(plan,plan.silenceAt*16).phase,'space');assert.notEqual(stageCaption(plan,plan.themeAt*16).text,'');}
// D5-C: the authorship once, in the finale of the eleven; the master version only its own lines.
assert(FINAL_LINES.includes('Jay · diseño y código'));assert(!MASTER_LINES.some(l=>/Jay|Luca|Kubono/.test(l)));

// Iwai: on the ring ★, ★★ and ★★★ are told apart by saturation (the hue kept), the Vacío's white by brightness.
const chroma=hex=>{const n=parseInt(hex.slice(1),16),v=[n>>16&255,n>>8&255,n&255];return Math.max(...v)-Math.min(...v);},light=hex=>{const n=parseInt(hex.slice(1),16);return (n>>16&255)+(n>>8&255)+(n&255);};
for(const color of ['#eb9a3c','#5cc8ff','#b48cff','#ff4f3a']){const [a,b,d]=[1,2,3].map(t=>tierInk(color,t));assert(chroma(a)<chroma(b)&&chroma(b)<chroma(d),color);assert.equal(d,color,'★★★ the whole colour');assert(chroma(b)-chroma(a)>=30&&chroma(d)-chroma(b)>=25,'a visible step');}
assert(light(tierInk('#ffffff',1))<light(tierInk('#ffffff',2))&&light(tierInk('#ffffff',2))<light(tierInk('#ffffff',3)));assert.equal(tierInk('#eb9a3c',1.75),tierInk('#eb9a3c',1),'growth stays ★');
assert.deepEqual([...TIER_SATURATION],[0,.45,.75,1]);

// D5-A (Simogo): the round that completes the eleven flows into the finale without pressing anything: the stage opens
// before the drop ends and its first bar may start there; the card waits for the finale to close. A round without
// sound does not raise the best share (it grows no layer).
{const realNow=Date.now,realTimeout=globalThis.setTimeout;let clock=1e9,timers=[];Date.now=()=>clock;globalThis.setTimeout=(f,ms=0)=>{timers.push({at:clock+ms,f});return timers.length;};
 const ac={currentTime:0,outputLatency:.1};
 function advance(ms){const until=clock+ms;for(;;){timers.sort((a,b)=>a.at-b.at);const t=timers[0];if(!t||t.at>until)break;timers.shift();clock=t.at;ac.currentTime=(clock-1e9)/1000;t.f();}clock=until;ac.currentTime=(clock-1e9)/1000;}
 const el={},$=id=>el[id]||(el[id]={id,hidden:true,textContent:'',innerHTML:'',attrs:{},setAttribute(k,v){this.attrs[k]=v;},toggleAttribute(k,on){if(on)this.attrs[k]='';else delete this.attrs[k];},classList:{toggle(){}}});
 let drop=null,opened=[],tiers=[];
 const r={S:{wx:0,wy:0,sound:true,sparks:0,todayKey:'2026-10-26',journey:{finished:true,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}}},
  BIOMES:[{id:'cueva'}],biomeOfPos:()=>0,regionOfPos:()=>({}),MU:{},save:()=>true,hud(){},$,ac,ringGo(){},quietAchievements(){},
  journeyVictory(id,o){tiers.push(o?.tier);drop={id,drop:1.5,end:1.5+4};return (drop.end-ac.currentTime)*1000;},journeyVictoryState:()=>drop,
  songFinaleCheck(o){const d=r.placesData();if(d.won)return false;d.won=true;opened.push({at:o?.at,time:ac.currentTime,card:!$('mPlace').hidden});return true;}};
 places(r);const d=r.placesData();for(const id of SONG_IDS)if(id!=='cueva')d.stars[id][0]=true;
 // A ★ round with sound at 62 %: the close plays its grown tier; the best share is kept.
 assert.equal(r.startPlace('cueva'),true);for(let i=0;i<100;i++)r.placeHear('cueva',i<62,{});r.placeFinish('cueva');assert.equal(tiers[0],1+growthSteps(.62)/16);
 advance(200);assert.equal(opened.length,0);advance(4800);assert.equal(opened.length,0,"not while the drop plays");advance(400);
 assert.equal(opened.length,1,'the finale opens by itself');assert.equal(opened[0].card,false,'no card in front');assert.equal(opened[0].at,5.5,'its first bar may start at the end of the drop');
 assert(opened[0].time<5.5-.12&&opened[0].time>=5.5-FINALE_LEAD-.05,`before the sequencer schedules the next «1» (${opened[0].time})`);
 assert.equal($('mPlace').hidden,true);r.placeFinaleClosed();advance(2000);assert.equal($('mPlace').hidden,true,'panel 11 (Q3): no card after the finale');assert.equal(d.stars.cueva[0],true,'the round is kept');
 // Without sound: no change to the best share and no growth; the card as before (the finale already played).
 $('mPlace').hidden=true;r.S.sound=false;drop=null;r.journeyVictory=()=>0;const before=d.best.cueva.onTime;r.startPlace('cueva');for(let i=0;i<10;i++)r.placeHear('cueva',true,{silent:true});r.placeFinish('cueva');
 assert.equal(d.best.cueva.onTime,before,'a silent round does not raise the best share');advance(1200);assert.equal($('mPlace').hidden,false);assert.equal(opened.length,1);
 Date.now=realNow;globalThis.setTimeout=realTimeout;}
console.log('PASS song for everyone (P6): a ★ layer grows a beat every 1,25 points of best share from 55 %, the close sounds as the level won (★ half the bars of ★★), the finale holds all but pad and bass under your phrase (≥ 40 % yours, ≤ 8 others in the theme) in the soft voice, the silence has no words, authorship once, rings by saturation, the eleventh round flows into the finale and no card follows it');
