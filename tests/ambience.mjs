import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {AMBIENCE_LEVEL,AMBIENCE_CUT,MUSIC_DUCK,BREATH,breath,inKey,initialize} from '../src/ambience.js';
import {THUNDER,initialize as weather} from '../src/world-weather.js';
// Under the music (Sonido limpio, Jay, 6 Nov 2026): the shared level is about −18 dB on every bed, −24 dB while the
// music plays, through a low-pass under the hiss, with a shallow breath.
assert(AMBIENCE_LEVEL<=.125&&AMBIENCE_LEVEL>0,'at most −18 dB');assert(MUSIC_DUCK<=.5&&MUSIC_DUCK>0);assert(20*Math.log10(AMBIENCE_LEVEL*MUSIC_DUCK)<=-24,'−24 dB or lower under the music');
assert(AMBIENCE_CUT>=1000&&AMBIENCE_CUT<=3000,'the hiss above the cut never reaches the mix');assert(BREATH<=.25,'a shallow breath: a bed that pumps is heard as a sound');
// It breathes with the beat: lowest on the beat, back to full before the next one, never silent.
assert.equal(breath(0),1-BREATH);assert.equal(breath(.5),1);assert(breath(.2)>breath(.05));assert.equal(breath(1),breath(0));assert(breath(-.1)>0);
// Pitched beds land on notes of the key.
const minor=[0,2,3,5,7,8,10],note=hz=>Math.round(69+12*Math.log2(hz/440));
for(const hz of [90,260,3200,4300,7200])for(const tr of [-5,0,3]){const k=inKey(hz,minor,tr);assert(minor.includes((((note(k)-57-tr)%12)+12)%12),hz+' '+tr);assert(Math.abs(note(k)-note(hz))<=1);}
assert.equal(inKey(440,null),440,'no scale: unchanged');
// Runtime: one shared gain on the bus, made once per audio context; the tick follows the beat.
const made=[];const gainNode=()=>{const n={gain:{value:0,targets:[],setTargetAtTime(v){this.targets.push(v);}},frequency:{value:0},Q:{value:0},connect(o){n.to=o;return o;}};made.push(n);return n;};
const bus={},r={ac:{currentTime:10,createGain:gainNode,createBiquadFilter:gainNode},bus,MU:{bq:[10],tr:0,biome:0},BIOMES:[{scale:minor}],SIX:.125,S:{sound:true}};
initialize(r);r.ambienceTick();assert.equal(made.length,0,'nothing is made before a bed asks for it');
const a=r.ambienceBus;assert.equal(a,r.ambienceBus);assert.equal(made.length,2,'a gain and its low-pass');assert.equal(a.to.type,'lowpass');assert.equal(a.to.frequency.value,AMBIENCE_CUT);assert.equal(a.to.to,bus);assert.equal(a.gain.value,AMBIENCE_LEVEL);
r.ambienceTick();assert.equal(a.gain.targets.at(-1),AMBIENCE_LEVEL*(1-BREATH),'on the beat it dips');
r.ac.currentTime=10.25;r.ambienceTick();assert.equal(a.gain.targets.at(-1),AMBIENCE_LEVEL,'between beats it is back');
r.MU.radio={};r.ambienceTick();assert.equal(a.gain.targets.at(-1),AMBIENCE_LEVEL*MUSIC_DUCK,'under the music it dips further');assert.equal(r.ambienceLevel(),AMBIENCE_LEVEL*MUSIC_DUCK);
r.S.sound=false;assert.equal(r.ambienceLevel(),AMBIENCE_LEVEL);r.S.sound=true;delete r.MU.radio;
assert(minor.includes((((note(r.ambienceInKey(4500))-57)%12)+12)%12));
r.ac={currentTime:0,createGain:gainNode};assert.notEqual(r.ambienceBus,a,'a new audio context gets its own gain');
// Without a low-pass in the context (an old browser), the gain goes straight to the bus.
{const q={ac:{currentTime:0,createGain:gainNode},bus,MU:{},S:{}};initialize(q);assert.equal(q.ambienceBus.to,bus);}
// Thunder in the World (world-weather.js): the engine's own thunder, far quieter, with the same calls and draws.
{const calls=[],engine=[];let draws=0;const w={S:{todayKey:'2026-11-06'},MU:{dnaA:{key:'3,4'},step:37*16},seedOf:k=>{let h=0;for(const c of k)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h;},noiseHit:(...a)=>{draws++;calls.push(['noise',...a]);},tom:(...a)=>calls.push(['tom',...a]),soundCue:()=>calls.push(['cue']),stormStrikeCue:o=>calls.push(['strike',o])};
 weather(w);const variation=w.seedOf('storm:articulation:v1:3,4:37')%8;
 // What audio.js's thunder() plays at its own level (noise, tom, a second noise on odd variations).
 engine.push(['noise',1,'lowpass',420+variation*55,.6,.16,.45+variation*.04,variation%3===0],['tom',1,48+variation*5,.085]);if(variation%2)engine.push(['noise',1,'bandpass',900+variation*100,.7,.025,.07]);
 w.weatherThunder(1,{x:0,y:0});assert.equal(calls.filter(c=>c[0]!=='cue'&&c[0]!=='strike').length,engine.length,'the same calls: the same random draws');
 for(const [i,c] of engine.entries()){const got=calls[i],vi=c[0]==='tom'?3:5;assert.deepEqual(got.filter((_,k)=>k!==vi),c.filter((_,k)=>k!==vi));assert.ok(Math.abs(got[vi]-c[vi]*THUNDER.storm)<1e-12,'quieter by THUNDER.storm');}
 assert.ok(calls.some(c=>c[0]==='strike'),'a bolt still marks its strike');
 calls.length=0;w.weatherThunder(2,null,true);assert.ok(Math.abs(calls[0][5]-.16*THUNDER.far)<1e-12,'a distant storm, quieter still');assert.ok(!calls.some(c=>c[0]==='cue'||c[0]==='strike'));
 assert.ok(20*Math.log10(THUNDER.storm)<=-27&&THUNDER.far<THUNDER.storm,'about −30 and −38 dB under the engine\'s thunder');}
// The callers in the World use it: a storm nearby and the Tormenta's bolts; the Tormenta round keeps its own.
{const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');assert.match(read('src/alive.js'),/runtime\.weatherThunder\(at,null,true\)/);assert.match(read('src/render.js'),/\(runtime\.weatherThunder\|\|runtime\.thunder\)\(q,\{x,y\}\)/);
 assert.match(read('src/render.js'),/windLevel\(runtime\.MU\.speed,runtime\.MU\.E\)\*\(runtime\.ambienceLevel\?\.\(\)\?\?AMBIENCE_LEVEL\)/,'the wind follows the ambience under the music');}
console.log('PASS ambience: −18 dB under every bed, −24 dB under the music, a low-pass under the hiss, a shallow dip on the beat, pitched beds in the key, one shared gain per audio context, the World\'s thunder far under the music with the same draws');
