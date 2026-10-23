import {THEME,themePitch} from './journey-pulse.js';
// The sound of a chapter kept (plan F2, docs/MUNDO.md): Jay found the cello theme sad and not electronic. Now it is a
// drop in the chapter's own genre: a bar of rising noise while the music is filtered down, half a beat of silence,
// then two bars with the full beat and the cube's theme on a synth lead. Each chapter has its style.
export const VICTORY_STYLES=Object.freeze({
 llanura:Object.freeze({genre:'house',kick:'four',clap:true,hat:'off',chords:'off',bass:null,lead:'square',echo:false}),
 lago:Object.freeze({genre:'dub',kick:'half',clap:true,hat:'off',chords:'echo',bass:'root',lead:'triangle',echo:true}),
 bosque:Object.freeze({genre:'disco',kick:'four',clap:true,hat:'sixteen',chords:'off',bass:'octave',lead:'sawtooth',echo:false}),
 tormenta:Object.freeze({genre:'techno',kick:'four',clap:true,hat:'sixteen',chords:null,bass:'rumble',lead:'acid',echo:false}),
 vacio:Object.freeze({genre:'ambient',kick:null,clap:false,hat:null,chords:'pad',bass:null,lead:'bell',echo:true}),
 jardin:Object.freeze({genre:'garage',kick:'four',clap:true,hat:'sixteen',chords:'echo',bass:'octave',lead:'triangle',echo:true})});
export const RISER_BARS=1,DROP_BARS=2,SILENCE_BEATS=.5;
// The whole drop in seconds, for a sixteenth of the given length: riser, silence and the drop.
export const victorySeconds=six=>(RISER_BARS*16+SILENCE_BEATS*4+DROP_BARS*16)*six;
// When each hit falls inside the drop, in sixteenths from its start: what the style plays, testable without audio.
export function dropPattern(style){const hits=[];for(let s=0;s<DROP_BARS*16;s++){const beat=s%4===0,off=s%4===2;
 if(style.kick==='four'&&beat||style.kick==='half'&&s%8===0)hits.push({s,what:'kick'});
 if(style.clap&&(style.kick==='half'?s%16===8:s%8===4))hits.push({s,what:'clap'});
 if(style.hat==='off'&&off||style.hat==='sixteen')hits.push({s,what:'hat',open:style.hat==='off'});
 if((style.chords==='off'||style.chords==='echo')&&off)hits.push({s,what:'chord'});
 if(style.bass==='octave'&&s%2===0)hits.push({s,what:'bass',octave:(s/2)%2===1});
 if(style.bass==='root'&&s%8===0)hits.push({s,what:'bass'});
 if(style.bass==='rumble'&&!beat&&s%2===0)hits.push({s,what:'bass'});}
 if(style.chords==='pad')hits.push({s:0,what:'pad'});return hits;}
export function initialize(runtime){
 const hz=m=>440*2**((m-69)/12);
 // A short synth voice: detuned oscillators through a low-pass with its own envelope.
 function synth(ac,out,m,t,dur,type,v,cut=2400,detune=[-8,0,8],sweep=0){const f=ac.createBiquadFilter(),g=ac.createGain();f.type='lowpass';f.Q.value=sweep?9:.7;f.frequency.setValueAtTime(cut,t);if(sweep){f.frequency.exponentialRampToValueAtTime(cut*sweep,t+dur*.4);f.frequency.exponentialRampToValueAtTime(cut,t+dur);}
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.01);g.gain.setValueAtTime(v*.8,t+dur*.6);g.gain.exponentialRampToValueAtTime(.0001,t+dur);f.connect(g);g.connect(out);
  for(const d of detune){const o=ac.createOscillator();o.type=type==='acid'?'sawtooth':type;o.frequency.value=hz(m);o.detune.value=d;o.connect(f);o.start(t);o.stop(t+dur+.05);}}
 // Echo for dub and ambient: the same send repeated on dotted eighths, fading.
 function withEcho(fn,t,six,times=3){for(let k=0;k<=times;k++)fn(t+k*six*3,Math.pow(.45,k));}
 function riser(ac,out,t,len){const buf=runtime.noiseBuffer;if(!buf)return;const s=ac.createBufferSource();s.buffer=buf;s.loop=true;const f=ac.createBiquadFilter(),g=ac.createGain();f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(7000,t+len);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.09,t+len*.95);g.gain.exponentialRampToValueAtTime(.0001,t+len);s.connect(f);f.connect(g);g.connect(out);s.start(t);s.stop(t+len+.05);}
 function crash(ac,out,t){const buf=runtime.noiseBuffer;if(!buf)return;const s=ac.createBufferSource();s.buffer=buf;const f=ac.createBiquadFilter(),g=ac.createGain();f.type='highpass';f.frequency.value=5000;g.gain.setValueAtTime(.08,t);g.gain.exponentialRampToValueAtTime(.0001,t+1.6);s.connect(f);f.connect(g);g.connect(out);s.start(t);s.stop(t+1.7);}
 // The music under the riser closes its filter and opens again on the drop: the build every DJ uses.
 function filterBuild(t,len){const lp=runtime.fx?.lp;if(!lp)return;const f=lp.frequency,open=Math.max(2000,f.value);f.cancelScheduledValues(t);f.setValueAtTime(open,t);f.exponentialRampToValueAtTime(380,t+len);f.setValueAtTime(open,t+len+SILENCE_BEATS*4*(runtime.SIX||.15));}
 // The next «1» of the bar the music scheduled, or a moment from now.
 function nextBar(now){const sq=runtime.MU?.sq||[];let best=null;for(const e of sq)if(e.s%16===0&&e.t>now+.05&&(best===null||e.t<best))best=e.t;return best??now+.08;}
 function play(id){const style=VICTORY_STYLES[id],ac=runtime.ac,bus=runtime.bus;if(!style||!runtime.S.sound||!ac||!bus)return 0;
  // Its own level, under the music's: the drop sits on top of what is already playing.
  const out=ac.createGain();out.gain.value=.72;out.connect(bus);const six=runtime.SIX||.15,MU=runtime.MU||{},scale=MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale,tr=MU.tr||0;
  const t0=nextBar(ac.currentTime),riserLen=RISER_BARS*16*six,drop=t0+riserLen+SILENCE_BEATS*4*six,ct=runtime.chordTones?.()||[57,60,64],root=Math.min(...ct)%12+36;
  riser(ac,out,t0,riserLen);filterBuild(t0,riserLen);crash(ac,out,drop);if(runtime.kick)runtime.kick(drop,.45*.72);
  for(const h of dropPattern(style)){const t=drop+h.s*six;
   if(h.what==='kick'&&h.s>0)runtime.kick?.(t,(style.genre==='techno'?.45:.38)*.72);
   else if(h.what==='clap')runtime.clap?.(t,.3*.72);
   else if(h.what==='hat')runtime.hatHit?.(t,(h.open?.12:.07)*.72);
   else if(h.what==='chord'){const fn=(at,k)=>ct.forEach(m=>synth(ac,out,m+12,at,six*1.6,'sawtooth',.035*k,2600));style.echo?withEcho(fn,t,six,2):fn(t,1);}
   else if(h.what==='bass')synth(ac,out,root+(h.octave?12:0),t,six*(style.bass==='root'?6:1.6),style.bass==='rumble'?'sawtooth':'square',style.bass==='rumble'?.05:.07,style.bass==='rumble'?300:900,[0]);
   else if(h.what==='pad')ct.forEach(m=>synth(ac,out,m+12,t,DROP_BARS*16*six,'sawtooth',.03,900,[-12,-4,4,12]));}
  // The cube's theme on the lead, two octaves of brightness, starting on the drop.
  let at=drop;const eighth=six*2;for(const [d,l] of THEME){const m=themePitch(d,scale,tr)+12,len=l*eighth;
   if(style.lead==='bell')withEcho((tt,k)=>runtime.pluck?.(m,tt,.08*.72*k,2),at,six,2);
   else{const fn=(tt,k)=>synth(ac,out,m,tt,len*.9,style.lead,.06*k,style.lead==='acid'?700:3200,style.lead==='acid'?[0]:[-6,0,6],style.lead==='acid'?6:0);style.echo?withEcho(fn,at,six,1):fn(at,1);}
   at+=len;}
  return (drop+DROP_BARS*16*six-ac.currentTime)*1000;}
 Object.defineProperties(runtime,{journeyVictory:{get:()=>play}});
}
