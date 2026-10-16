import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {initialize as voices} from '../src/voices.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);r.S.mode='world';r.S.wx=r.S.wy=900;const d=r.regionOfPos(900,900);let hits=0,recorded=0;
Object.assign(r,{unifiedMusic:true,ac:{},MU:{deg:0,step:0,dnaA:d},SIX:.125,vel:v=>v,soundCue:()=>hits++,loopTap:()=>recorded++,hookInst(){},bassInst(){}});
for(const name of ['kick','conga','wood','rim','shaker','tom','guiro','timbale','clap','hatHit','snare'])r[name]=()=>{};voices(r);
const source={id:'budget',x:900,y:900};for(let i=0;i<30;i++)r.playVoice('reliquia',i,1,d,false,.5,source,'player');assert(hits>=3&&hits<=6,'held source cannot flood a bar');
for(let i=0;i<100;i++)r.playVoice('reliquia',i,1,d,false,.5,{id:'budget:'+i,x:900,y:900},'player');assert.equal(hits,16);assert.equal(recorded,hits,'a suppressed hit cannot enter the looper or teach a companion');
r.MU.step=16;r.playVoice('reliquia',0,2,d,false,.5,source,'player');assert.equal(hits,17,'new bar rearms the gesture budget');
r.playVoice('reliquia',0,2,d,false,.5,{id:'far',x:1800,y:900},'player');assert.equal(hits,17,'stale distant contact cannot fire later');
r.playVoice('reliquia',0,2,d,false,.5,source,'band');assert.equal(hits,18,'deliberate band playback has its own existing policy');
console.log('PASS audible manual source limits, no inaudible recording/teaching, rearm by musical bar, distant contact rejection and independent band');
const {initialize:living}=await import('../src/living-synthesis.js'),chordNotes=[];
const timed={ac:{state:'running'},musicalFrame:()=>({chords:[60,64,67]}),chordTones:()=>[61,65,68],playNewInstrument:(id,n)=>chordNotes.push(n)};living(timed);timed.livingSynthesis({role:'acorde',instrument:'p_tinepiano',labTerritory:'test',score:{decay:.2,attack:.01}},60,1,.04,{id:'timed',variant:0});assert.equal(chordNotes.length,3);assert(chordNotes.every(n=>[0,4,7].includes(n%12)),'living chords use the frame at their onset, not the newest lookahead chord');

const beforePulse=hits;for(let i=0;i<8;i++)r.playVoice('pulso',0,2,d,false,.5,{id:'pulse-probe',x:900,y:900},'player');assert.equal(hits-beforePulse,8,'the deliberate sonar keeps its response in slow territories');
