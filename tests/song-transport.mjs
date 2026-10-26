import assert from 'node:assert/strict';
import {initialize,songPlan} from '../src/song-stage.js';
import {finaleScore} from '../src/journey-finale.js';
const old={document:globalThis.document,requestAnimationFrame:globalThis.requestAnimationFrame,cancelAnimationFrame:globalThis.cancelAnimationFrame,setTimeout:globalThis.setTimeout};
const node=()=>({hidden:false,textContent:'',replaceChildren(){},remove(){},style:{}}),children=new Map(),el={...node(),querySelector:s=>{if(!children.has(s))children.set(s,node());return children.get(s);}};
globalThis.document={getElementById:id=>id==='songStage'?el:null,querySelectorAll:()=>[]};globalThis.requestAnimationFrame=()=>1;let canceled=0;globalThis.cancelAnimationFrame=()=>canceled++;globalThis.setTimeout=()=>0;
try {
 const made=[],pauses=[],resume=[],notes={lago:[60,62]},ticks={lago:[16,20]},stars={lago:[true,true,false]},gain=()=>({gain:{value:1,setTargetAtTime(){}},connect(){},disconnect(){}});
 const r={S:{sound:true,journey:{}},SIX:.125,ac:{currentTime:0,createGain:gain},bus:{},MU:{dnaA:{scale:[0,2,3,5,7,8,10]}},placesData:()=>({stars,notes,noteTicks:ticks}),audio(){},songHit:(out,e,t)=>{if(e.mine)made.push(t);},silenceSongMix:t=>pauses.push(t),restoreSongMix:t=>resume.push(t)};initialize(r);r.openSong({final:true});
 const plan=songPlan({final:true,notes,ticks});let t=1;
 for(let k=0;k<plan.bars*16;k++){if(k===16)r.SIX=.1;if(k===32)r.SIX=.2;r.songStageStep(k%16,t,k+1000);assert.equal(r.songStageState().k,k,'tempo changes never skip or repeat musical steps');t+=r.SIX;}
 assert.equal(made.length,2);assert.equal(pauses.length,1);assert.equal(resume.length,1);assert(resume[0]>pauses[0]);r.closeSong();assert.equal(canceled,1);assert.equal(resume.length,2,'closing restores even an interrupted pause');
 const score=finaleScore({llanura:[60,62,64]},['llanura'],{llanura:[12,0,4]},{llanura:[12,16,20]});assert.deepEqual(score.filter(n=>n.chapter==='llanura').map(n=>n.at),[1.5,2,2.5],'final5 honors captured phase and bar crossing');
 r.S.sound=false;r.openSong({final:true});r.songStageStep(0,1,1);assert.equal(r.songStageState().k,-1,'muted scene uses its visual clock without a second scheduler');r.closeSong();
 console.log('PASS stage transport: independent tempo changes, ordered events, pause/theme boundaries, cancellation, final5 captured timing');
}finally{Object.assign(globalThis,old);}
// A scheduler interrupted during silence can resume beyond the entire scene.
// Use the same real initializer with a tiny independent DOM/audio harness.
{
 const saved={document:globalThis.document,requestAnimationFrame:globalThis.requestAnimationFrame,cancelAnimationFrame:globalThis.cancelAnimationFrame};
 const elements=new Map(),element={hidden:false,querySelector:s=>{if(!elements.has(s))elements.set(s,{hidden:false,replaceChildren(){}});return elements.get(s);}};
 globalThis.document={getElementById:()=>element,querySelectorAll:()=>[]};globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};
 try {let paused=0,resumed=0;const r={S:{sound:true,journey:{}},ac:{createGain:()=>({gain:{setTargetAtTime(){}},connect(){}}),currentTime:0},bus:{},SIX:.125,placesData:()=>({stars:{lago:[true]}}),audio(){},silenceSongMix:()=>paused++,restoreSongMix:()=>resumed++};initialize(r);r.openSong({final:true});const p=songPlan({final:true,six:.125});r.songStageStep(0,1,0);r.songStageStep(0,1+p.silenceAt*2,p.silenceAt*16);assert.equal(paused,1);r.songStageStep(0,1+p.bars*2,p.bars*16);assert.equal(resumed,1,'end of plan always releases a skipped theme pause');}finally{Object.assign(globalThis,saved);}
}
