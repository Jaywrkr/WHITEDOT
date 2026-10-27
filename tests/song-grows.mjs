import assert from 'node:assert/strict';
import {SONG_IDS,growthSteps,layerGrew,placeTier} from '../src/song.js';
import {drawSongRings,layerShare,songPlan,stageEvents,REPLAY_LINES,FINAL_LINES,STAGE_LINGER} from '../src/song-stage.js';
import {initialize as places,normalizePlaces,roundStars,RHYTHM_STAR,PLACE_IDS} from '../src/places.js';
// Panel 11 (Q3, Iwai, Pope, Chen, Simogo): the layer that grows is seen in its ring, ★, ★★ and ★★★ differ by shape,
// the card names the growth, and the finale of the eleven closes on the song.

// A canvas that records what is drawn.
function canvas(){const calls=[];const c={calls,save(){},restore(){},beginPath(){},setLineDash(){},fillText(){},
 arc(x,y,r,a,b){calls.push({kind:'arc',x,y,r,a,b,lineWidth:this.lineWidth,alpha:this.globalAlpha});},stroke(){calls.push({kind:'stroke'});},fill(){calls.push({kind:'fill'});}};return c;}
function drawn(id,tier){const c=canvas();drawSongRings(c,390,844,{ids:[id],lit:()=>true,beat:()=>0,still:true,names:false,tier:()=>tier});return c.calls;}
const TAU=2*Math.PI;
// What sounds of a layer over the eight bars of the song, at a tier, from the stage's own events.
function heard(id,tier){const plan=songPlan({ids:[id]}),count=t=>{let n=0;for(let k=0;k<plan.bars*16;k++)n+=stageEvents(plan,k,[57,61,64],{tiers:{[id]:t},scale:[0,2,4,5,7,9,11]}).filter(e=>e.layer===id).length;return n;};return count(tier)/count(2);}
// 1. The arc of a ★ ring is the share that sounds: within 1/16 of the heard hits, for every layer.
for(const id of SONG_IDS)for(const tier of [1,1.5,1.94]){const arc=drawn(id,tier).find(a=>a.kind==='arc'&&Math.abs(a.a+Math.PI/2)<1e-9);assert(arc,`${id} ${tier}: an arc from the top`);
 const fraction=(arc.b-arc.a)/TAU;assert(Math.abs(fraction-heard(id,tier))<=1/16,`${id} at ${tier}: arc ${fraction.toFixed(3)} vs heard ${heard(id,tier).toFixed(3)}`);assert(Math.abs(fraction-layerShare(id,tier))<1e-9);}
// Three distinct arcs at 1, 1,5 and 1,94 (Iwai: 12/24, 16/24, 23/24 for the Lago).
{const arcs=[1,1.5,1.94].map(t=>layerShare('lago',t));assert.deepEqual(arcs.map(a=>Math.round(a*24)),[12,16,23]);assert(arcs[0]<arcs[1]&&arcs[1]<arcs[2]&&arcs[2]<1);
 for(const id of SONG_IDS.filter(id=>!['vacio','cueva'].includes(id)))assert(new Set([1,1.5,1.94].map(t=>layerShare(id,t))).size===3,id+': three arcs');}
// 2. By shape: ★ no fill; ★★ a filled ring; ★★★ also a thin outer ring. The colour steps stay.
for(const id of ['ruinas','lago']){const one=drawn(id,1),two=drawn(id,2),three=drawn(id,3),r=one.find(a=>a.kind==='arc').r;
 assert(!one.some(x=>x.kind==='fill'),'★: no fill');assert(two.some(x=>x.kind==='fill'),'★★: filled');assert(!two.some(x=>x.kind==='arc'&&x.r>r+1),'★★: no outer ring');
 assert(three.some(x=>x.kind==='fill')&&three.some(x=>x.kind==='arc'&&Math.abs(x.r-(r+4))<1e-9&&x.lineWidth===1),'★★★: a thin outer ring');}
// Without tiers (the Journey's finale) the rings are drawn as before: a glow and a ring.
{const c=canvas();drawSongRings(c,390,844,{ids:['lago'],lit:()=>true,still:true,names:false});assert(c.calls.some(x=>x.kind==='fill'));}

// 3. The card names the growth exactly when play-curve.mjs counts a «crece».
const curveGrew=({had,best,q,sound})=>sound&&!had[1]&&had[0]&&q<RHYTHM_STAR&&growthSteps(q)>growthSteps(best);
for(const had of [[false,false,false],[true,false,false],[true,true,false]])for(const best of [undefined,.5,.56,.6,.66,.74])for(const q of [.4,.55,.57,.6,.62,.7,.74,.75,.9])for(const sound of [true,false]){
 const before=normalizePlaces({stars:{lago:had},...(best===undefined?{}:{best:{lago:{onTime:best,ms:1,rounds:1}}})},{}),after=structuredClone(before),got=roundStars({onTime:q,sound});
 got.forEach((x,i)=>{if(x)after.stars.lago[i]=true;});if(sound){const b=after.best.lago||(after.best.lago={onTime:0,ms:null,rounds:0});b.onTime=Math.max(b.onTime,q);}
 assert.equal(layerGrew(before,after,'lago'),curveGrew({had,best,q,sound}),JSON.stringify({had,best,q,sound}));}
// In a real round: the line on the card when the layer grew, and in no other round.
{const realNow=Date.now,realTimeout=globalThis.setTimeout;let clock=1e9,timers=[];Date.now=()=>clock;globalThis.setTimeout=(f,ms=0)=>{timers.push({at:clock+ms,f});return timers.length;};
 const advance=ms=>{const until=clock+ms;for(;;){timers.sort((a,b)=>a.at-b.at);const t=timers[0];if(!t||t.at>until)break;timers.shift();clock=t.at;t.f();}clock=until;};
 const el={},$=id=>el[id]||(el[id]={id,hidden:true,textContent:'',innerHTML:'',attrs:{},setAttribute(k,v){this.attrs[k]=v;},toggleAttribute(k,on){if(on)this.attrs[k]='';else delete this.attrs[k];}});
 const r={S:{wx:0,wy:0,sound:true,sparks:0,todayKey:'2026-10-26',journey:{finished:true,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}}},BIOMES:[{id:'lago'}],biomeOfPos:()=>0,regionOfPos:()=>({}),MU:{},save:()=>true,hud(){},$,quietAchievements(){}};
 places(r);const round=(id,pct)=>{$('mPlace').hidden=true;assert(r.startPlace(id));for(let i=0;i<100;i++)r.placeHear(id,i<pct,{});r.placeFinish(id);advance(1300);assert.equal($('mPlace').hidden,false);return $('placeRows').innerHTML;};
 const line=/Tu capa de Lago creció/;
 assert.doesNotMatch(round('lago',50),line,'below 55 %: nothing grows');
 assert.match(round('lago',60),line,'60 %: the layer grew');assert.equal(r.places().last.grew,true);
 assert.doesNotMatch(round('lago',58),line,'below the best: nothing new');
 assert.match(round('lago',66),line,'a higher best: it grows again');
 assert.doesNotMatch(round('lago',80),line,'★★ is a star, not growth');
 assert.doesNotMatch(round('lago',70),/creció/,'after ★★ nothing grows');
 r.S.sound=false;assert.doesNotMatch(round('bosque',90),/creció/,'without sound nothing grows');
 // The Jardín's first round brings its ★: not growth either.
 r.S.sound=true;assert.doesNotMatch(round('jardin',70),/creció/);assert.match(round('jardin',72),/Tu capa de Jardín creció/);
 Date.now=realNow;globalThis.setTimeout=realTimeout;}

// 4. Saves: `credited` is kept, false by default, and nothing else is dropped.
{const n=normalizePlaces({won:true,stars:{lago:[true,true,false]},notes:{lago:[60,62]}},{});assert.equal(n.credited,false);assert.equal(n.won,true);assert.deepEqual(n.stars.lago,[true,true,false]);assert.deepEqual(n.notes.lago,[60,62]);
 const c=normalizePlaces({won:true,credited:true},{});assert.equal(c.credited,true);assert.equal(normalizePlaces(c,{}).credited,true,'stable');
 assert.equal(normalizePlaces({credited:'yes'},{}).credited,false);const future={version:99,credited:true,x:1};assert.equal(normalizePlaces(future),future,'a future format untouched');}
assert.deepEqual([...REPLAY_LINES],['Tu canción está completa']);assert(FINAL_LINES.includes('Tu canción está completa'));assert(!REPLAY_LINES.some(l=>/Jay|Luca/.test(l)));
assert(STAGE_LINGER>=5&&STAGE_LINGER<=10,'the finale closes 5–10 s after its last bar');
assert(PLACE_IDS.every(id=>placeTier(normalizePlaces(null,{}),id)===0));
console.log('PASS song grows (Q3): the ★ arc is what sounds (≤ 1/16 of the heard hits; 12, 16 and 23 of 24 for the Lago), ★ arc, ★★ filled, ★★★ outer ring, the card says «Tu capa de … creció» exactly when play-curve counts «crece», and `credited` is kept in the save');
