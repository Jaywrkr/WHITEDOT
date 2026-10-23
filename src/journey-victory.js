import {THEME,themePitch} from './journey-pulse.js';
import {layerStep,songChord} from './song.js';
// The sound of a place kept (plan F13, docs/MUNDO.md): it comes out of the music already playing. For a bar the
// music's filter closes under a rising noise; the last half beat is silence; on the «1» the same music comes back in
// its key and tempo, with the place's layer of Tu canción (song.js) in the live chord and the cube's theme on top.
// Jay asked for it after F12: the old drops in their own genres did not sit with the rest of the music.
export const VICTORY_LEADS=Object.freeze({llanura:'square',lago:'triangle',bosque:'sawtooth',tormenta:'acid',vacio:'bell',jardin:'triangle',dunas:'square',cristales:'bell',faros:'square',ruinas:'sawtooth',cueva:'triangle'});
export const RISER_BARS=1,DROP_BARS=2,SILENCE_BEATS=.5;
// The whole close in seconds, for a sixteenth of the given length: the build (its last half beat silent) and the drop.
export const victorySeconds=six=>(RISER_BARS+DROP_BARS)*16*six;
// When the silence starts, in sixteenths from the start of the build.
export const silenceStep=()=>RISER_BARS*16-SILENCE_BEATS*4;
// What the place adds in the drop, sixteenth by sixteenth, over the chord the world plays in each bar.
export function dropEvents(id,chordAt){const out=[];for(let s=0;s<DROP_BARS*16;s++)out.push(...layerStep(id,s,songChord(chordAt(Math.floor(s/16)))));return out;}
export function initialize(runtime){
 const hz=m=>440*2**((m-69)/12);let run=null;
 // A short synth voice for the theme: detuned oscillators through a low-pass with its own envelope.
 function synth(ac,out,m,t,dur,type,v,cut=2400,detune=[-8,0,8],sweep=0){const f=ac.createBiquadFilter(),g=ac.createGain();f.type='lowpass';f.Q.value=sweep?9:.7;f.frequency.setValueAtTime(cut,t);if(sweep){f.frequency.exponentialRampToValueAtTime(cut*sweep,t+dur*.4);f.frequency.exponentialRampToValueAtTime(cut,t+dur);}
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.01);g.gain.setValueAtTime(v*.8,t+dur*.6);g.gain.exponentialRampToValueAtTime(.0001,t+dur);f.connect(g);g.connect(out);
  for(const d of detune){const o=ac.createOscillator();o.type=type==='acid'?'sawtooth':type;o.frequency.value=hz(m);o.detune.value=d;o.connect(f);o.start(t);o.stop(t+dur+.05);}}
 function riser(ac,out,t,len){const buf=runtime.noiseBuffer;if(!buf)return;const s=ac.createBufferSource();s.buffer=buf;s.loop=true;const f=ac.createBiquadFilter(),g=ac.createGain();f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(7000,t+len);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.09,t+len*.95);g.gain.exponentialRampToValueAtTime(.0001,t+len);s.connect(f);f.connect(g);g.connect(out);s.start(t);s.stop(t+len+.05);}
 function crash(ac,out,t){const buf=runtime.noiseBuffer;if(!buf)return;const s=ac.createBufferSource();s.buffer=buf;const f=ac.createBiquadFilter(),g=ac.createGain();f.type='highpass';f.frequency.value=5000;g.gain.setValueAtTime(.08,t);g.gain.exponentialRampToValueAtTime(.0001,t+1.6);s.connect(f);f.connect(g);g.connect(out);s.start(t);s.stop(t+1.7);}
 // The music closes its filter under the riser and opens again on the drop: the build every DJ uses.
 function filterBuild(t,len,drop){const lp=runtime.fx?.lp;if(!lp)return;const f=lp.frequency,open=Math.max(2000,f.value);f.cancelScheduledValues(t);f.setValueAtTime(open,t);f.exponentialRampToValueAtTime(380,t+len);f.setValueAtTime(open,drop);}
 // Half a beat of real silence: the whole output dips, reverb tails too, and is back whole on the «1».
 function hush(from,drop){const g=runtime.outputStage?.headroom?.gain;if(!g)return;const keep=g.value>.5?g.value:.92;g.cancelScheduledValues(from-.02);g.setValueAtTime(keep,from-.02);g.linearRampToValueAtTime(.0001,from);g.setValueAtTime(.0001,drop-.004);g.linearRampToValueAtTime(keep,drop);}
 // The next «1» the music scheduled, or a moment from now.
 function nextBar(now){const sq=runtime.MU?.sq||[];let best=null;for(const e of sq)if(e.s%16===0&&e.t>now+.05&&(best===null||e.t<best))best=e.t;return best??now+.08;}
 // The world's chord now, from the sequencer (audio.js), or A minor without it.
 const chord=()=>runtime.chordTones?.()||[57,60,64];
 function play(id){const lead=VICTORY_LEADS[id],ac=runtime.ac,bus=runtime.bus;if(!lead||!runtime.S.sound||!ac||!bus)return 0;run?.out.disconnect?.();
  // Its own level, under the music's: the place sits on top of what is already playing.
  const out=ac.createGain();out.gain.value=.6;out.connect(bus);const six=runtime.SIX||.15,MU=runtime.MU||{},scale=MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale,tr=MU.tr||0;
  const t0=nextBar(ac.currentTime),build=RISER_BARS*16*six,quiet=t0+silenceStep()*six,drop=t0+build;
  riser(ac,out,t0,quiet-t0);filterBuild(t0,quiet-t0,drop);hush(quiet,drop);crash(ac,out,drop);runtime.kick?.(drop,.3);
  // The place's layer follows the music step by step (victoryMusicStep), so it plays the chord the world plays.
  run={id,out,drop,six,end:drop+DROP_BARS*16*six,played:new Set(),bars:{}};
  // The cube's theme on the lead, an octave up, in the music's key, from the drop.
  let at=drop;const eighth=six*2;for(const [d,l] of THEME){const m=themePitch(d,scale,tr)+12,len=l*eighth;
   if(lead==='bell')for(let k=0;k<3;k++)runtime.pluck?.(m,at+k*six*3,.08*.6*Math.pow(.45,k),2);
   else synth(ac,out,m,at,len*.9,lead,.05,lead==='acid'?700:3200,lead==='acid'?[0]:[-6,0,6],lead==='acid'?6:0);
   at+=len;}
  return (run.end-ac.currentTime)*1000;}
 // Called by the sequencer on every sixteenth: inside the drop, the place's layer hits in the chord just set.
 function step(s,t){if(!run)return;if(t>=run.end+.01){run=null;return;}const k=Math.round((t-run.drop)/run.six);if(k<0||k>=DROP_BARS*16||run.played.has(k))return;run.played.add(k);
  const bar=Math.floor(k/16);if(!run.bars[bar])run.bars[bar]=chord().slice();
  for(const e of layerStep(run.id,k,songChord(run.bars[bar])))runtime.songHit?.(run.out,e,t,run.six);}
 Object.defineProperties(runtime,{journeyVictory:{get:()=>play},victoryMusicStep:{get:()=>step},journeyVictoryState:{get:()=>()=>run?{id:run.id,drop:run.drop,end:run.end,played:run.played.size,chords:{...run.bars}}:null}});
}
