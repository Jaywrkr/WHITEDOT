import assert from 'node:assert/strict';
import {VICTORY_STYLES,RISER_BARS,DROP_BARS,victorySeconds,dropPattern,initialize} from '../src/journey-victory.js';
// One electronic style per chapter, in its genre, and one for each place built after them (the Jardín, plan F9).
assert.deepEqual(Object.keys(VICTORY_STYLES),['llanura','lago','bosque','tormenta','vacio','jardin','dunas','cristales']);
assert.deepEqual(Object.values(VICTORY_STYLES).map(s=>s.genre),['house','dub','disco','techno','ambient','garage','afro','trance']);
// A bar of riser, half a beat of silence and two bars of drop.
assert.equal(RISER_BARS,1);assert.equal(DROP_BARS,2);assert.equal(victorySeconds(.125),(16+2+32)*.125);
const count=(id,what)=>dropPattern(VICTORY_STYLES[id]).filter(h=>h.what===what).length;
// House and disco: four on the floor and claps on two and four; techno too, with sixteenth hats and no chords.
for(const id of ['llanura','bosque','tormenta'])assert.equal(count(id,'kick'),8,id);
for(const id of ['llanura','bosque','tormenta'])assert.equal(count(id,'clap'),4,id);
assert.equal(count('tormenta','hat'),32);assert.equal(count('tormenta','chord'),0);assert.equal(count('llanura','chord'),8,'offbeat stabs');
assert.equal(count('bosque','bass'),16,'disco octave bass on eighths');
// Dub: half-time kick, the clap on three.
assert.equal(count('lago','kick'),4);assert.deepEqual(dropPattern(VICTORY_STYLES.lago).filter(h=>h.what==='clap').map(h=>h.s),[8,24]);
// Ambient: no beat, a pad.
assert.equal(count('vacio','kick'),0);assert.equal(count('vacio','pad'),1);
// Every hit falls inside the drop.
for(const s of Object.values(VICTORY_STYLES))for(const h of dropPattern(s))assert(h.s>=0&&h.s<DROP_BARS*16);
// Without sound, or an unknown chapter, nothing plays and the chapter falls back to its usual wait.
const r={S:{sound:false},ac:{},bus:{}};initialize(r);assert.equal(r.journeyVictory('llanura'),0);r.S.sound=true;assert.equal(r.journeyVictory('refugio'),0);
console.log('PASS journey victory: one electronic drop per chapter in its genre (house, dub, disco, techno, ambient), a bar of riser, half a beat of silence and two bars of beat, silent without sound');
