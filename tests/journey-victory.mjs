import assert from 'node:assert/strict';
import {DROP_BARS,victorySeconds,dropEvents,initialize} from '../src/journey-victory.js';
import {SONG_IDS} from '../src/song.js';
// A close uses its won layer without changing the radio or output.
assert.equal(DROP_BARS,2);assert.equal(victorySeconds(.125),32*.125);
const C=[60,64,67,71,74],F=[65,69,72,76,79],chords=bar=>bar?F:C,pcs=ev=>new Set(ev.map(e=>e.midi%12));
const of=(id,what)=>dropEvents(id,chords).filter(e=>e.what===what);
// The Llanura's kick on every beat, the Bosque's claps on two and four: two bars of the place's own layer.
assert.equal(of('llanura','kick').length,8);assert.equal(of('bosque','clap').length,4);
// The layer plays the chord the world plays, not the song's A major: C in the first bar, F in the second.
assert.deepEqual([...pcs(of('jardin','arp').filter(e=>e.s<16))].sort((a,b)=>a-b),[0,4,7]);
assert.deepEqual([...pcs(of('jardin','arp').filter(e=>e.s>=16))].sort((a,b)=>a-b),[0,5,9]);
assert.deepEqual(of('lago','bass').map(e=>e.midi%12),[0,0,0,5,5,5]);
assert(of('lago','bass').every(e=>e.midi>=38&&e.midi<=49),'the bass in its register');
assert.deepEqual(of('vacio','pad').map(e=>e.tones.map(m=>m%12)),[[0,4,7]]);
// Every hit falls inside the drop.
for(const id of SONG_IDS)for(const e of dropEvents(id,chords))assert(e.s>=0&&e.s<DROP_BARS*16,id);
// Without sound, or an unknown place, nothing plays and the chapter falls back to its usual wait.
const r={S:{sound:false},ac:{},bus:{}};initialize(r);assert.equal(r.journeyVictory('llanura'),0);r.S.sound=true;assert.equal(r.journeyVictory('refugio'),0);
// With the sequencer: the layer follows the steps from the drop, in the chord set at each bar.
const param=()=>({value:1,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){},setTargetAtTime(){}}),node=()=>({gain:param(),frequency:param(),Q:param(),detune:param(),connect(x){return x;},disconnect(){},start(){},stop(){}});
const ac={currentTime:0,createGain:node,createBiquadFilter:node,createOscillator:node,createBufferSource:node};let tones=C;const hits=[];
const w={S:{sound:true},ac,bus:node(),SIX:.125,MU:{sq:[{t:.5,s:0}],tr:0},chordTones:()=>tones,songHit:(out,e,t)=>hits.push({...e,t})};initialize(w);
const ms=w.journeyVictory('jardin');assert(Math.abs(ms-(.5+32*.125)*1000)<1e-6);const drop=.5;
for(let k=-4;k<40;k++){if(k===16)tones=F;w.victoryMusicStep(((k%16)+16)%16,drop+k*.125);}
assert.equal(hits.length,16);assert(hits.every(h=>h.t>=drop-1e-9&&h.t<drop+32*.125));
assert.deepEqual([...pcs(hits.filter(h=>h.s<16))].sort((a,b)=>a-b),[0,4,7]);assert.deepEqual([...pcs(hits.filter(h=>h.s>=16))].sort((a,b)=>a-b),[0,5,9]);
assert.equal(w.journeyVictoryState(),null,'over once the drop ends');
// No new oscillator/noise/filter or master-output automation is allowed for the close.
const onlyGain={...ac,createOscillator(){throw Error('independent synth');},createBufferSource(){throw Error('noise');},createBiquadFilter(){throw Error('filter');}};
const v={...w,ac:onlyGain,MU:{sq:[{t:.5,s:0}]}};initialize(v);v.journeyVictory('lago');v.victoryMusicStep(0,.5);assert(v.journeyVictoryState());v.cancelJourneyVictory();const n=hits.length;v.victoryMusicStep(4,1);assert.equal(hits.length,n,'no old notes after cancellation');assert.equal(v.journeyVictoryState(),null);
console.log('PASS victory uses the existing song layer and live chord, never automates the radio, and cancels old notes on travel');

// Two live bars, including a tempo change: the close counts sequencer steps instead of fixed seconds.
{const heard=[],r={...w,MU:{sq:[]},SIX:.125,songHit:(out,e,t)=>heard.push({...e,t})};initialize(r);r.journeyVictory('jardin');let t=1;
 for(let k=0;k<=32;k++){r.SIX=k<16?.125:.09;r.victoryMusicStep(k%16,t);t+=r.SIX;}
 assert.equal(heard.length,16);assert.equal(r.journeyVictoryState(),null,'two bars end on the live grid after the tempo changes');}
