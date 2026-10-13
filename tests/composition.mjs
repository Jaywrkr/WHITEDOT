import assert from 'node:assert/strict';
import {compositionFrame,phraseAccent} from '../src/composition.js';
import {initialize as data} from '../src/data.js';
import {INSTRUMENT_SPECS,initialize as instruments} from '../src/instruments.js';
const r={};data(r);
for(const genre of Object.keys(r.GEN)){
 const frames=Array.from({length:32},(_,phrase)=>compositionFrame(genre,phrase,2));
 assert.equal(new Set(frames.map(f=>f.stage)).size,4);
 assert.deepEqual(frames,Array.from({length:32},(_,phrase)=>compositionFrame(genre,phrase,2)));
 for(const frame of frames)for(let step=0;step<16;step++){
  assert(phraseAccent(frame,step)>0&&phraseAccent(frame,step)<=1);
  assert(frame.attackScale>0&&frame.attackScale<=2.25);
  assert(frame.decayScale>0&&frame.decayScale<=1.4);
 }
 assert.equal(compositionFrame(genre,4,0).harmony,false,'rest section introduced automatic chords');
}
assert.notDeepEqual(compositionFrame('minimal',0,1),compositionFrame('ambient',0,1));
// Verify articulation reaches actual synth envelopes/filter automation, not just metadata.
let events=[];
const param=()=>({value:0,setValueAtTime(v,t){assert(Number.isFinite(v)&&Number.isFinite(t));events.push(v);},exponentialRampToValueAtTime(v,t){assert(v>0&&Number.isFinite(t));events.push(v);}});
const node=()=>({frequency:param(),gain:param(),Q:param(),detune:param(),connect(n){return n;},start(){},stop(t){assert(t<=2);}});
r.ac={createOscillator:node,createGain:node,createBiquadFilter:node};r.bus=node();r.verbIn=node();r.hz=m=>440*2**((m-69)/12);r.env=(g,t,a,v,d)=>events.push(a,v,d);instruments(r);
for(const id of ['reed','membrane','bowed','hollow']){
 assert(INSTRUMENT_SPECS[id]);events=[];r.playNewInstrument(id,60,0,.1,compositionFrame('minimal',0,1));const dry=events.slice();
 events=[];r.playNewInstrument(id,60,0,.1,compositionFrame('ambient',6,1));assert.notDeepEqual(events,dry);
}
console.log('PASS: 52 style phrase arcs, deliberate-rest protection and real new-synth articulations');
