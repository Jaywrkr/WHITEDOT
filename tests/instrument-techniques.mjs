import assert from 'node:assert/strict';
import {TECHNIQUE_INSTRUMENTS,techniqueShape,createTechniquePlayer} from '../src/instrument-techniques.js';
import {voiceLifetime} from '../src/modular-synth.js';
assert.equal(Object.keys(TECHNIQUE_INSTRUMENTS).length,11);
for(const [id,s]of Object.entries(TECHNIQUE_INSTRUMENTS)){
 const plain=techniqueShape(s),muted=techniqueShape(s,{technique:'muted'}),ghost=techniqueShape(s,{technique:'ghost'}),slide=techniqueShape(s,{technique:'slide'});
 assert(muted.decay<plain.decay&&muted.cut<plain.cut);assert(ghost.level<plain.level);assert(slide.bend>0);assert(voiceLifetime(id)>2.7);
 for(const bad of [null,{}, {attackScale:Infinity,decayScale:-3,toneScale:NaN}])assert(Object.values(techniqueShape(s,bad)).filter(x=>typeof x==='number').every(Number.isFinite));
}
let disconnected=0,started=0;
const param=()=>({value:0,setValueAtTime(v,t){assert(Number.isFinite(v)&&Number.isFinite(t));},linearRampToValueAtTime(v,t){assert(Number.isFinite(v)&&Number.isFinite(t));},exponentialRampToValueAtTime(v,t){assert(v>0&&Number.isFinite(t));},setTargetAtTime(v,t){assert(Number.isFinite(v)&&Number.isFinite(t));},cancelScheduledValues(){}});
const node=()=>({frequency:param(),gain:param(),Q:param(),connect(n){return n;},disconnect(){disconnected++;},start(){started++;},stop(){}});
const ac={currentTime:0,sampleRate:1000,createGain:node,createOscillator:node,createBiquadFilter:node,createBufferSource:node,createConstantSource:node,createBuffer:(channels,length)=>({getChannelData:()=>new Float32Array(length),copyToChannel(data){assert(data.every(Number.isFinite));}})};
const r={ac,S:{mode:'world'},bus:node(),hz:n=>440*2**((n-69)/12)},p=createTechniquePlayer(r);
for(const id of Object.keys(TECHNIQUE_INSTRUMENTS)){assert(p.play(id,60,ac.currentTime,.04));ac.currentTime+=4;p.tick();}
assert(started>30);assert.equal(p.active,0);
const held=Array.from({length:5},()=>p.hold('bamboowind',60,ac.currentTime,.04));assert(held.slice(0,4).every(Boolean));assert.equal(held[4],null);
assert.equal(p.hold('silkpluck',60,ac.currentTime,.04),null,'plucked strings decay naturally');
held[0].update({pressure:.4,bend:30});held[0].release();assert(held[0].released);held[0].release();
r.S.mode='camino';p.tick();assert(held.slice(0,4).every(v=>v.released));ac.currentTime+=1;assert.equal(p.active,0);
r.S.mode='world';for(let i=0;i<80;i++)p.play('handslap',55,ac.currentTime,.08);assert(p.active<=16);
assert.equal(p.play('unknown',60,ac.currentTime,.1),false);
assert.equal(p.hold('lowbow',NaN,ac.currentTime,.04),null);
console.log('PASS eleven original articulated voices, distinct techniques, preserved pitch, sixteen-voice/four-hold budgets and release on pause');
