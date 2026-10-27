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
// Panel 11 (Q7, D9-B, Wintory): the World's radio keeps silent under the finale of the eleven, from its first «1» until
// the stage closes; the finale's odd sixteenths take the World's swing, so both would fall together (±2 ms). Tu canción
// from Lugares keeps the radio and its straight time.
{
 const saved={document:globalThis.document,requestAnimationFrame:globalThis.requestAnimationFrame,cancelAnimationFrame:globalThis.cancelAnimationFrame,setTimeout:globalThis.setTimeout};
 const elements=new Map(),element={hidden:false,querySelector:s=>{if(!elements.has(s))elements.set(s,{hidden:false,textContent:'',replaceChildren(){}});return elements.get(s);}};
 globalThis.document={getElementById:()=>element,querySelectorAll:()=>[]};globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};globalThis.setTimeout=()=>0;
 try {const hits=[],gain=()=>({gain:{value:1,setTargetAtTime(){}},connect(){},disconnect(){}}),ids=['llanura','lago','bosque','tormenta','vacio','jardin','dunas','cristales','faros','ruinas','cueva'];
  // Q7 in dub: the finale of the eleven plays its own voices (createDub); every source it starts is a hit here.
  const param=()=>({value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){},setTargetAtTime(){},cancelScheduledValues(){}}),node=(more={})=>({connect:n=>n,disconnect(){},gain:param(),frequency:param(),Q:param(),detune:param(),delayTime:param(),...more}),source=()=>node({start:t=>dubHits.push({t}),stop(){}}),dubHits=[];
  const ac={currentTime:0,sampleRate:8000,createGain:()=>node(),createBiquadFilter:()=>node(),createDelay:()=>node(),createConvolver:()=>node(),createOscillator:source,createBufferSource:source,createBuffer:(c,n)=>({getChannelData:()=>new Float32Array(n)})};
  const r={S:{sound:true,journey:{}},SIX:.125,ac,bus:{},MU:{tr:0},placesData:()=>({stars:Object.fromEntries(ids.map(id=>[id,[true,true,false]]))}),audio(){},songHit:(out,e,t)=>hits.push({e,t}),silenceSongMix(){},restoreSongMix(){}};initialize(r);
  assert.equal(r.songFinaleHush(0,1),false,'no stage, the radio plays');
  r.openSong({final:true,at:2});assert.equal(r.songFinaleHush(0,1.5),false,'before its first «1» the radio still plays');assert.equal(r.songFinaleHush(3,2.2),false);assert.equal(r.songFinaleHush(0,2),true,'from the first «1» it keeps silent');
  const swing=.031,six=.125;let t=2,worst=0,odd=0;for(let k=0;k<64;k++){const s=k%16,world=s%2?t+swing:t,before=dubHits.length;r.songStageStep(s,t,k,world);for(const h of dubHits.slice(before)){worst=Math.max(worst,Math.abs(h.t-world));if(s%2)odd++;}assert.equal(r.songFinaleHush(s,t),true);t+=six;}
  assert(odd>0,'the finale has odd sixteenths to swing');assert.equal(hits.length,0,'the finale plays its dub voices, not the song\'s');assert(worst<=.002,`odd sixteenths on the World's swing (${worst})`);assert.equal(r.songStageState().k,63,'its clock stays on the straight time');
  r.closeSong();assert.equal(r.songFinaleHush(0,t),false,'closed, the radio comes back');
  hits.length=0;r.openSong();t=10;let straight=true;for(let k=0;k<32;k++){const s=k%16,before=hits.length;r.songStageStep(s,t,k,s%2?t+swing:t);if(hits.slice(before).some(h=>h.t!==t))straight=false;assert.equal(r.songFinaleHush(s,t),false,'Tu canción keeps the radio');t+=six;}assert(straight);r.closeSong();
  console.log('PASS finale over a silent radio: hush from its first «1» to closing, odd sixteenths on the World\'s swing; Tu canción unchanged');
 }finally{Object.assign(globalThis,saved);}
}
