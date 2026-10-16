import assert from 'node:assert/strict';import {voiceExpression} from '../src/voice-expression.js';import {initialize as synthesis} from '../src/living-synthesis.js';import {snareBody} from '../src/electronic-ensemble.js';
const snapshot={id:'kept',variant:4,mind:{energy:.7,patience:.3}},before=JSON.stringify(snapshot),frame={time:2,six:.125,step:0};
for(const role of ['bajo','perc','acorde','lead','agudo']){
 const strong=voiceExpression({role},snapshot,frame,2),weak=voiceExpression({role},snapshot,frame,2.125);assert(strong.velocity>weak.velocity);assert.equal(JSON.stringify(snapshot),before);
 for(const value of [null,NaN,Infinity,-100]){const exp=voiceExpression({role},{variant:value,mind:{energy:value,patience:value}},frame,2);assert(Object.values(exp).filter(v=>typeof v==='number').every(Number.isFinite));}
 const legato=voiceExpression({role},{...snapshot,expression:'legato'}),short=voiceExpression({role},{...snapshot,expression:'staccato'});assert(legato.decayScale>short.decayScale);
}
assert(voiceExpression({role:'bajo'},snapshot).toneScale<voiceExpression({role:'lead'},snapshot).toneScale);
assert.equal(voiceExpression({},null).velocity,1,'unowned accompaniment keeps its authored level');
const calls=[],r={ac:{state:'running'},playNewInstrument:(...args)=>calls.push(args),recordInstrument:()=>{},chordTones:()=>[48,52,55]};synthesis(r);
for(const variant of [0,4,8,12]){assert(r.livingSynthesis({role:'lead',instrument:'p_gutguitar'},60,1,.05,{id:'voice:'+variant,variant}));assert.equal(calls.at(-1)[0],'p_gutguitar','a known native voice cannot become a generic oscillator');}
assert.equal(calls.length,4);assert(new Set([0,1,2,3].map(snareStyle=>JSON.stringify(snareBody({snareStyle})))).size===4);
assert.deepEqual(snareBody({seed:NaN}),snareBody({seed:0}));
console.log('PASS deterministic expressive roles, metrical accents, bounded invalid inputs, legato/staccato contrast, native instruments for all variants and four distinct dry snares');
// Real held-note routing must use the same onset for synth, patch, space and cue.
import {initialize as instruments} from '../src/instruments.js';
const onsets=[],frequencies=[];
const param=()=>({value:0,setValueAtTime(v,t){assert(Number.isFinite(v)&&Number.isFinite(t));frequencies.push([v,t]);},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){},cancelScheduledValues(){}});
const node=()=>({gain:param(),frequency:param(),Q:param(),connect(n){return n;},disconnect(){},start(){},stop(){}});
const ac={state:'running',currentTime:2,sampleRate:1000,createGain:node,createBiquadFilter:node,createOscillator:node,createConstantSource:node,createBufferSource:node,createBuffer:(c,n)=>({getChannelData:()=>new Float32Array(n)})},source={id:'held',kind:'breath-tree',x:0,y:0,size:18},region={scale:[0,2,3,5,7,8,10]},h={ac,bus:node(),S:{mode:'world',wx:0,wy:0},MU:{radio:{labScore:{}},deg:0,tr:0},hz:n=>440*2**((n-69)/12),livingNear:()=>[source],getVoice:()=>({instrument:'bamboowind',degree:0,role:'lead'}),regionOfPos:()=>region,musicalTime:()=>3,musicalFrame:()=>({region,degree:0,transposition:0,chords:[60,64,67]}),focusGesture:t=>onsets.push(t),soundCue:(o,role,t)=>onsets.push(t),techniqueNoteCue:n=>onsets.push(n.time)};
instruments(h);h.techniqueTick();ac.currentTime=2.4;h.techniqueTick();assert.equal(onsets.length,3);assert(onsets.every(t=>t===3));assert(frequencies.some(([v,t])=>Math.abs(v-h.hz(55))<.0001&&t===3));
console.log('PASS sustained native voices start on the shared grid with the active chord and synchronized visual cues');
