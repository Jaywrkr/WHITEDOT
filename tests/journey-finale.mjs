import assert from 'node:assert/strict';
import {finaleScore,chapterStarts,SEGMENT,noteLengths,scoreLength,MAJOR,EIGHTH,NOTES_PER_CHAPTER,CREDIT_LINES,FESTIVAL_LINES,CHAPTER_COLORS,initialize} from '../src/journey-finale.js';
import {THEME,themePitch} from '../src/journey-pulse.js';
// The score: your notes per chapter in the Journey's order (up to six each), then the theme twice in A major, the second a fifth up.
const score=finaleScore({lago:[60,62],llanura:[57,59,60,62,64,65,67,69],otro:[50],vacio:['x',64]});
assert.deepEqual(score.slice(0,NOTES_PER_CHAPTER).map(n=>n.midi),[60,62,64,65,67,69],'the last six of the Llanura first');
assert.deepEqual(score.slice(6,8).map(n=>n.chapter),['lago','lago']);assert.equal(score[8].chapter,'vacio');assert.equal(score[8].midi,64);
const theme=score.filter(n=>n.chapter==='refugio');assert.equal(theme.length,THEME.length*2);
assert.deepEqual(theme.slice(0,6).map(n=>n.midi),THEME.map(([d])=>themePitch(d,MAJOR,0)));assert.deepEqual(theme.slice(6).map(n=>n.midi),THEME.map(([d])=>themePitch(d,MAJOR,7)));
assert.equal(score[1].at,2*EIGHTH);assert.equal(scoreLength(finaleScore({})),32*EIGHTH,'an empty journey still plays the theme twice');
assert(Object.keys(CHAPTER_COLORS).length===6&&CREDIT_LINES[0]==='Tu mundo se abrió'&&CREDIT_LINES.includes('Once lugares te esperan')&&CREDIT_LINES.includes('Kubono'));
// Plan F7: each chapter takes two bars of your song, so its layer comes in on the bar; a longer rhythm is tightened.
assert.deepEqual(chapterStarts(score),{llanura:0,lago:SEGMENT*EIGHTH,vacio:2*SEGMENT*EIGHTH,refugio:3*SEGMENT*EIGHTH});
const long=finaleScore({llanura:[57,59,60,62,64,65]},['llanura'],{llanura:[0,12,24,36,48,60]});assert(long.filter(n=>n.chapter==='llanura').reduce((a,n)=>a+n.eighths,0)<=SEGMENT,'six long notes fit in two bars');
assert.equal(scoreLength(finaleScore({llanura:[57]},['llanura'])),SEGMENT*EIGHTH+32*EIGHTH);
// Phase 2: the finale plays your rhythm, from the sixteenths saved beside your notes; older saves play quarters.
assert.deepEqual(noteLengths([0,4,12,40],4),[2,4,6,2],'a quarter, a half, the longest gap capped, the last a quarter');assert.deepEqual(noteLengths(null,3),[2,2,2]);assert.deepEqual(noteLengths([0,4],3),[2,2,2],'mismatched steps are ignored');
const rhythm=finaleScore({lago:[60,'x',62,64]},['lago'],{lago:[0,2,8,10]});assert.deepEqual(rhythm.slice(0,3).map(n=>[n.midi,n.eighths]),[[60,4],[62,2],[64,2]],'the gap skips the dropped note');
// Runtime: the finale lands in the Refugio, keeps the end and opens the free World; it never plays twice.
let frames=[],landed=0,saves=0,clock=0,mode='viaje';const toasts=[];performance.now=()=>clock;
const el={hidden:true,children:[],setAttribute(){},querySelector:k=>k==='canvas'?canvas:k==='.journey-again'?null:credits,appendChild(b){this.children.push(b);}},canvas={width:0,height:0,getContext:()=>new Proxy({},{get:(o,k)=>k in o?o[k]:k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{},set:(o,k,v)=>{o[k]=v;return true;}})},credits={lines:[],replaceChildren(...l){this.lines=l;}};
let created=null;
globalThis.document={getElementById:()=>created,createElement:()=>{if(!created){created=el;return el;}return {style:{}};},body:{appendChild(){}},querySelectorAll:()=>[{hidden:false}]};
globalThis.innerWidth=390;globalThis.innerHeight=844;globalThis.devicePixelRatio=2;globalThis.requestAnimationFrame=f=>frames.push(f);
const r={S:{journey:{version:1,mode:'viaje',chapter:6,notes:{llanura:[57,59]}},sound:false},landHouse:()=>landed++,save:()=>{saves++;return true;},toast:t=>toasts.push(t),
 journeyMode:()=>mode,setJourneyMode:m=>{mode=m;r.S.journey.mode=m;return true;}};
initialize(r);assert.equal(r.journeyFinale(),true);assert.equal(landed,1);assert.equal(el.hidden,false);
const st=r.journeyFinaleState();assert(st.running&&st.notes===2+12);
const step=s=>{clock+=s*1000;const f=frames.splice(0);f.forEach(fn=>fn());};
step(1);assert.equal(r.journeyFinaleState().credits,false);
step(st.seconds-7+.1);assert.equal(r.journeyFinaleState().credits,true,'credits after the silence');assert.equal(credits.lines.length,CREDIT_LINES.length);
step(7);assert.equal(r.journeyFinaleState().running,false);assert.equal(r.S.journey.finished,true);assert.equal(mode,'libre');assert.deepEqual(toasts,['Se abre el Mundo libre.']);
assert.equal(r.journeyFinale(),false,'only once');assert.equal(landed,2,'later it just lands in the Refugio');
// Skipping after two seconds ends it the same way.
const r2={...r,S:{journey:{version:1,mode:'viaje',chapter:6,notes:{}},sound:false}};mode='viaje';initialize(r2);created.hidden=true;r2.journeyFinale();clock+=1000;el.onclick();assert(r2.journeyFinaleState().running,'not in the first two seconds');clock+=1500;el.onclick();assert.equal(r2.journeyFinaleState().skipped,true);assert.equal(r2.S.journey.finished,true);
// A failed save keeps the Journey open.
const r3={...r,S:{journey:{version:1,mode:'libre',chapter:6,notes:{}},sound:false},save:()=>false};mode='libre';initialize(r3);r3.journeyFinale();r3.journeyFinaleSkip();assert.equal(r3.S.journey.finished,undefined);
// The festival build: the whole Journey since plan I5, your phrase stays on screen and «Otra persona» starts again.
assert.deepEqual([...new Set(finaleScore({llanura:[57],lago:[60],bosque:[55]},['llanura','lago']).map(n=>n.chapter))],['llanura','lago','refugio']);
let restarts=0;const r4={...r,S:{journey:{version:1,mode:'viaje',chapter:2,notes:{llanura:[57],bosque:[55]},finished:true},sound:false},festivalRestart:()=>restarts++};mode='viaje';el.children=[];initialize(r4);
assert.equal(r4.journeyFinale({festival:true}),true,'the festival plays even on a finished save');assert.equal(r4.journeyFinaleState().notes,2+12,'the Llanura and the Bosque, both in the festival');
clock+=1e6;frames.splice(0).forEach(f=>f());assert.equal(r4.journeyFinaleState().running,false);assert.equal(credits.lines.length,FESTIVAL_LINES.length);assert.equal(mode,'viaje','the festival never opens the free World');
const again=el.children.find(b=>b.id==='journeyAgain');assert(again&&again.textContent==='Otra persona');again.onclick();assert.equal(restarts,1);
console.log('PASS journey finale: your notes per chapter then the theme twice in major, gold sky and credits, the end is kept and the free World opens, once, skippable, safe on a failed save; the festival ends on your phrase and starts again for the next player');
