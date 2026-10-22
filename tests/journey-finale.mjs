import assert from 'node:assert/strict';
import {finaleScore,scoreLength,MAJOR,EIGHTH,NOTES_PER_CHAPTER,CREDIT_LINES,CHAPTER_COLORS,initialize} from '../src/journey-finale.js';
import {THEME,themePitch} from '../src/journey-pulse.js';
// The score: your notes per chapter in the Journey's order (up to six each), then the theme twice in A major, the second a fifth up.
const score=finaleScore({lago:[60,62],llanura:[57,59,60,62,64,65,67,69],otro:[50],vacio:['x',64]});
assert.deepEqual(score.slice(0,NOTES_PER_CHAPTER).map(n=>n.midi),[60,62,64,65,67,69],'the last six of the Llanura first');
assert.deepEqual(score.slice(6,8).map(n=>n.chapter),['lago','lago']);assert.equal(score[8].chapter,'vacio');assert.equal(score[8].midi,64);
const theme=score.filter(n=>n.chapter==='refugio');assert.equal(theme.length,THEME.length*2);
assert.deepEqual(theme.slice(0,6).map(n=>n.midi),THEME.map(([d])=>themePitch(d,MAJOR,0)));assert.deepEqual(theme.slice(6).map(n=>n.midi),THEME.map(([d])=>themePitch(d,MAJOR,7)));
assert.equal(score[1].at,2*EIGHTH);assert.equal(scoreLength(finaleScore({})),32*EIGHTH,'an empty journey still plays the theme twice');
assert(Object.keys(CHAPTER_COLORS).length===6&&CREDIT_LINES[0]==='Kubono');
// Runtime: the finale lands in the Refugio, keeps the end and opens the free World; it never plays twice.
let frames=[],landed=0,saves=0,clock=0,mode='viaje';const toasts=[];performance.now=()=>clock;
const el={hidden:true,children:[],setAttribute(){},querySelector:k=>k==='canvas'?canvas:credits,appendChild(){}},canvas={width:0,height:0,getContext:()=>new Proxy({},{get:(o,k)=>k in o?o[k]:k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{},set:(o,k,v)=>{o[k]=v;return true;}})},credits={lines:[],replaceChildren(...l){this.lines=l;}};
let created=null;
globalThis.document={getElementById:()=>created,createElement:()=>{if(!created){created=el;return el;}return {style:{},set textContent(v){this.text=v;}};},body:{appendChild(){}},querySelectorAll:()=>[{hidden:false}]};
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
console.log('PASS journey finale: your notes per chapter then the theme twice in major, gold sky and credits, the end is kept and the free World opens, once, skippable, safe on a failed save');
