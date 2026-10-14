import assert from 'node:assert/strict';
import {playBoxCelebration} from '../src/celebration-audio.js';
const notes=[];const r={S:{sound:true},ac:{state:'running'},GEN:{minimal:{bassI:'sub',hookP:['keys']}},MU:{radio:{}},SIX:.15,chordTones:()=>[60,63,67],vel:v=>v,bassInst:(i,n,t,v)=>notes.push({i,n,t,v}),hookInst:(i,n,t,v)=>notes.push({i,n,t,v})};
assert(playBoxCelebration(r,2,{genre:'minimal'}));assert.equal(notes.length,3);assert(notes[0].n>=36&&notes[0].n<=52);assert(notes.every(n=>n.t>=2&&n.v<=.025));
r.S.sound=false;assert(!playBoxCelebration(r,3,{genre:'minimal'}));assert.equal(notes.length,3);r.S.sound=true;r.ac.state='suspended';assert(!playBoxCelebration(r,3,{genre:'minimal'}));
console.log('PASS tonal world-only box remate, bounded three notes, low register, silence and suspended-audio guard');
