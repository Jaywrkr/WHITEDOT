import assert from 'node:assert/strict';
import {AMBIENCE_LEVEL,BREATH,breath,inKey,initialize} from '../src/ambience.js';
// Under the music: the shared level halves every bed.
assert(AMBIENCE_LEVEL<=.5&&AMBIENCE_LEVEL>0);
// It breathes with the beat: lowest on the beat, back to full before the next one, never silent.
assert.equal(breath(0),1-BREATH);assert.equal(breath(.5),1);assert(breath(.2)>breath(.05));assert.equal(breath(1),breath(0));assert(breath(-.1)>0);
// Pitched beds land on notes of the key.
const minor=[0,2,3,5,7,8,10],note=hz=>Math.round(69+12*Math.log2(hz/440));
for(const hz of [90,260,3200,4300,7200])for(const tr of [-5,0,3]){const k=inKey(hz,minor,tr);assert(minor.includes((((note(k)-57-tr)%12)+12)%12),hz+' '+tr);assert(Math.abs(note(k)-note(hz))<=1);}
assert.equal(inKey(440,null),440,'no scale: unchanged');
// Runtime: one shared gain on the bus, made once per audio context; the tick follows the beat.
const made=[];const gainNode=()=>{const n={gain:{value:0,targets:[],setTargetAtTime(v){this.targets.push(v);}},connect(o){n.to=o;return o;}};made.push(n);return n;};
const bus={},r={ac:{currentTime:10,createGain:gainNode},bus,MU:{bq:[10],tr:0,biome:0},BIOMES:[{scale:minor}],SIX:.125};
initialize(r);r.ambienceTick();assert.equal(made.length,0,'nothing is made before a bed asks for it');
const a=r.ambienceBus;assert.equal(a,r.ambienceBus);assert.equal(made.length,1);assert.equal(a.to,bus);assert.equal(a.gain.value,AMBIENCE_LEVEL);
r.ambienceTick();assert.equal(a.gain.targets.at(-1),AMBIENCE_LEVEL*(1-BREATH),'on the beat it dips');
r.ac.currentTime=10.25;r.ambienceTick();assert.equal(a.gain.targets.at(-1),AMBIENCE_LEVEL,'between beats it is back');
assert(minor.includes((((note(r.ambienceInKey(4500))-57)%12)+12)%12));
r.ac={currentTime:0,createGain:gainNode};assert.notEqual(r.ambienceBus,a,'a new audio context gets its own gain');
console.log('PASS ambience: half level under the music, a dip on every beat, pitched beds in the key, one shared gain per audio context');
