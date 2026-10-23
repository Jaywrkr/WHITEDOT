import assert from 'node:assert/strict';
import {VICTORY_LEADS,RISER_BARS,DROP_BARS,SILENCE_BEATS,victorySeconds,silenceStep,dropEvents,initialize} from '../src/journey-victory.js';
import {SONG_IDS} from '../src/song.js';
// Every place closes with its lead on the cube's theme over its own layer of Tu canción (plan F13).
assert.deepEqual(Object.keys(VICTORY_LEADS),[...SONG_IDS]);
// A bar of build whose last half beat is silence, then two bars on the «1».
assert.equal(RISER_BARS,1);assert.equal(DROP_BARS,2);assert.equal(SILENCE_BEATS,.5);assert.equal(silenceStep(),14);assert.equal(victorySeconds(.125),48*.125);
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
const param=()=>({value:1,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){}}),node=()=>({gain:param(),frequency:param(),Q:param(),detune:param(),connect(x){return x;},disconnect(){},start(){},stop(){}});
const ac={currentTime:0,createGain:node,createBiquadFilter:node,createOscillator:node,createBufferSource:node};let tones=C;const hits=[];
const w={S:{sound:true},ac,bus:node(),SIX:.125,MU:{sq:[{t:.5,s:0}],tr:0},chordTones:()=>tones,songHit:(out,e,t)=>hits.push({...e,t})};initialize(w);
const ms=w.journeyVictory('jardin');assert(Math.abs(ms-(.5+48*.125)*1000)<1e-6);const drop=.5+16*.125;
for(let k=-4;k<40;k++){if(k===16)tones=F;w.victoryMusicStep(((k%16)+16)%16,drop+k*.125);}
assert.equal(hits.length,16);assert(hits.every(h=>h.t>=drop-1e-9&&h.t<drop+32*.125));
assert.deepEqual([...pcs(hits.filter(h=>h.s<16))].sort((a,b)=>a-b),[0,4,7]);assert.deepEqual([...pcs(hits.filter(h=>h.s>=16))].sort((a,b)=>a-b),[0,5,9]);
assert.equal(w.journeyVictoryState(),null,'over once the drop ends');
console.log('PASS journey victory: each place closes out of the live music (a bar of build, half a beat of silence, two bars on the «1») with its layer in the chord the world plays and its lead on the theme');
