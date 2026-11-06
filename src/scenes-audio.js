// Escenas musicales (alpha.241; docs/UNIVERSO.md#escenas-musicales): the sound of the stages, in Web Audio, on a bus of
// its own. Every voice here is new and plays on top of the place's music; none of the music's voices, notes, filters or
// mix is touched, and no draw of the game's random sequence is made (variation comes from hashKey, in scenes-model.js).
// The bus: the drums, and the synths through the scene's own low-pass (the Almacén's sweep), with an echo → its own
// high-pass (the Patio's sweep) → a light glue
// compressor → a soft clip (recorte) and a ceiling → the section's level → the approach (rises as you come near) → a trim → the output
// stage after the music's compressor, so the music's own dynamics are not pushed by the scene; the limiter, the peak
// guard, the volume and the finale's gate still hold the whole. On every beat the scene ducks under the music's kick
// (a sidechain): the club pumps and the sum keeps its peaks.
// The scene's level at a drop, by scene (measured by render: the drop some 5 dB over the music, peaks under 0.93).
export const SCENE_TRIM=Object.freeze({almacen:.27,patio:.31});
function softClip(n=2048){const c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=Math.tanh(1.4*x)/Math.tanh(1.4);}return c;}
export function createSceneBus(ac,dest){
 const input=ac.createGain(),synth=ac.createGain(),hp=ac.createBiquadFilter(),top=ac.createBiquadFilter(),lp=ac.createBiquadFilter(),glue=ac.createDynamicsCompressor(),clip=ac.createWaveShaper(),ceiling=ac.createDynamicsCompressor(),section=ac.createGain(),duck=ac.createGain(),approach=ac.createGain(),trim=ac.createGain();
 hp.type='highpass';hp.frequency.value=20;hp.Q.value=.8;lp.type='lowpass';lp.frequency.value=18000;lp.Q.value=1.1;top.type='lowpass';top.frequency.value=10000;top.Q.value=.7;
 if(glue.threshold){glue.threshold.value=-20;glue.knee.value=8;glue.ratio.value=4;glue.attack.value=.01;glue.release.value=.18;}
 if(ceiling.threshold){ceiling.threshold.value=-12;ceiling.knee.value=2;ceiling.ratio.value=20;ceiling.attack.value=.001;ceiling.release.value=.08;}clip.curve=softClip();clip.oversample='2x';section.gain.value=0;approach.gain.value=0;trim.gain.value=0;
 // The echo (vocal chops, metal, stabs): dotted eighth, darkened, inside the scene's filters.
 const echoIn=ac.createGain(),delay=ac.createDelay(2),fb=ac.createGain(),tone=ac.createBiquadFilter();echoIn.gain.value=1;fb.gain.value=.36;tone.type='lowpass';tone.frequency.value=3200;
 echoIn.connect(delay).connect(tone).connect(fb).connect(delay);tone.connect(input);
 // The acid line's own drive.
 const drive=ac.createWaveShaper(),driveIn=ac.createGain();{const n=1024,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=Math.tanh(3*x)/Math.tanh(3);}drive.curve=c;}driveIn.gain.value=1;driveIn.connect(drive).connect(synth);
 synth.connect(lp).connect(input);input.connect(hp).connect(top).connect(glue).connect(clip).connect(ceiling).connect(section).connect(duck).connect(approach).connect(trim).connect(dest);
 const nodes=[input,synth,hp,top,lp,glue,clip,ceiling,section,duck,approach,trim,echoIn,delay,fb,tone,drive,driveIn];
 return {input,synth,hp,lp,section,duck,approach,trim,echoIn,delay,driveIn,dest,disconnect(){for(const n of nodes){try{n.disconnect();}catch(_){}}}};
}
// The voices. hz is the place's own tuning (runtime.hz, so a detuned land stays in tune); noise is the music's noise
// buffer (read, never redrawn). Each voice builds its few nodes, plays once and lets them go.
export function sceneVoices(ac,bus,noise,hz){
 const out=bus.input,syn=bus.synth;let voices=0;
 const g=(v=0)=>{const n=ac.createGain();n.gain.value=v;return n;};
 const filt=(type,f,q=.7)=>{const n=ac.createBiquadFilter();n.type=type;n.frequency.value=f;n.Q.value=q;return n;};
 const osc=(type,f)=>{const o=ac.createOscillator();o.type=type;o.frequency.value=f;return o;};
 // A percussive envelope: up in 2 ms (or attack), down exponentially over decay.
 const hit=(param,t,v,decay,attack=.002)=>{param.setValueAtTime(0,t);param.linearRampToValueAtTime(v,t+attack);param.setTargetAtTime(0,t+attack,decay/4);};
 const noiseAt=(t,len,offset=0,rate=1)=>{const s=ac.createBufferSource();s.buffer=noise;s.loop=true;s.playbackRate.value=rate;const d=noise.duration||2;s.start(t,(offset*d)%d);s.stop(t+len);return s;};
 const end=(src,t)=>{src.stop(t);voices++;};
 const api={
  get voices(){return voices;},
  // Almacén: the long kick, a low sine falling to the kit's pitch just after the music's own kick (its tail, not a
  // second attack).
  kick(t,v,kit){const at=t+.05,o=osc('sine',110),a=g();o.frequency.setValueAtTime(110,at);o.frequency.exponentialRampToValueAtTime(kit.kick,at+.06);hit(a.gain,at,v,kit.decay,.012);o.connect(a).connect(out);o.start(at);end(o,at+kit.decay+.1);},
  // The rumble: the chord's root two octaves down, driven and darkened, stepping down over the three sixteenths after
  // the kick (the warehouse's rolling low end).
  rumble(t,v,note,six,kit){const o=osc('triangle',hz(note)),sh=filt('lowpass',130,1.2),a=g();const k=v*kit.rumble;
   a.gain.setValueAtTime(0,t);[1,.62,.36].forEach((m,i)=>{const at=t+i*six;a.gain.setValueAtTime(0,at);a.gain.linearRampToValueAtTime(k*m,at+.006);a.gain.setTargetAtTime(0,at+.01,six*.35);});
   o.connect(sh).connect(a).connect(out);o.start(t);end(o,t+3*six+.1);},
  // Hats: noise high-passed at the kit's tone; open ones ring longer.
  hat(t,v,tone,decay=.035,offset=0){const s=noiseAt(t,decay*6+.02,offset,1.2),hf=filt('highpass',tone,.9),bp=filt('peaking',tone*1.35,1),a=g();bp.gain.value=4;hit(a.gain,t,v,decay,.003);s.connect(hf).connect(bp).connect(a).connect(out);voices++;},
  // The ride with air: three square partials (inharmonic) and a breath of noise, long.
  ride(t,v,offset=0){const a=g(),hf=filt('highpass',5200,.7),bp=filt('bandpass',8400,.6);hit(a.gain,t,v,.9,.002);
   for(const f of [3150,4630,6590]){const o=osc('triangle',f),og=g(.3);o.connect(og).connect(bp);o.start(t);o.stop(t+1);}
   const n=noiseAt(t,1,offset,1),ng=g(.6);n.connect(ng).connect(bp);bp.connect(hf).connect(a).connect(out);voices++;},
  // The 303: a saw or square into a resonant low-pass whose envelope opens on the note (higher on an accent), with slides.
  acid(t,v,note,prev,{slide=false,accent=false,cut=400,env=2000,res=14,wave='sawtooth',len=.1}={}){const o=osc(wave,hz(prev??note)),f=filt('lowpass',cut,res),a=g();
   if(slide&&prev!=null){o.frequency.setValueAtTime(hz(prev),t);o.frequency.linearRampToValueAtTime(hz(note),t+.055);}else o.frequency.setValueAtTime(hz(note),t);
   const peak=Math.min(16000,cut+env*(accent?1.6:1));f.frequency.setValueAtTime(peak,t);f.frequency.setTargetAtTime(cut,t+.005,accent?.09:.05);
   const vv=v*(accent?1.35:1);a.gain.setValueAtTime(0,t);a.gain.linearRampToValueAtTime(vv,t+.004);a.gain.setValueAtTime(vv,t+len*.8);a.gain.linearRampToValueAtTime(0,t+len+.02);
   o.connect(f).connect(a).connect(bus.driveIn);o.start(t);end(o,t+len+.05);},
  // A metal strike: FM, a chord tone high up with an inharmonic modulator, into the echo.
  metal(t,v,note){const c=osc('sine',hz(note)),m=osc('sine',hz(note)*3.51),mg=g(),a=g(),hf=filt('highpass',900),e=g(.35);
   mg.gain.setValueAtTime(hz(note)*4,t);mg.gain.setTargetAtTime(hz(note)*.4,t,.04);m.connect(mg).connect(c.frequency);hit(a.gain,t,v,.32,.003);c.connect(a).connect(hf);hf.connect(syn);hf.connect(e).connect(bus.echoIn);
   c.start(t);m.start(t);m.stop(t+.5);end(c,t+.5);},
  // The drop: a crash of noise and a deep boom on the chord's root.
  impact(t,v,note,offset=0){const n=noiseAt(t,2,offset,.9),hf=filt('highpass',3800,.6),a=g();hit(a.gain,t,v*.7,1.6,.006);n.connect(hf).connect(a).connect(out);
   const o=osc('sine',hz(note)*2),b=g();o.frequency.setValueAtTime(hz(note)*2,t);o.frequency.exponentialRampToValueAtTime(hz(note),t+.25);hit(b.gain,t,v,1.1,.004);o.connect(b).connect(out);o.start(t);end(o,t+1.4);},
  // A chord stab of the breakdown (three chord tones), dark, into the echo.
  stab(t,v,notes){const f=filt('lowpass',1500,2),a=g(),e=g(.5);f.frequency.setValueAtTime(2600,t);f.frequency.setTargetAtTime(700,t,.12);hit(a.gain,t,v,.5,.004);
   for(const n of notes){const o=osc('sawtooth',hz(n)),og=g(1/notes.length);o.connect(og).connect(f);o.start(t);o.stop(t+.7);voices++;}f.connect(a);a.connect(syn);a.connect(e).connect(bus.echoIn);},
  // Patio: congas and tumba (tuned to chord tones), open, muted, slapped or ghosted.
  conga(t,v,note,stroke){const f=hz(note),o=osc('sine',f*1.3),a=g(),decay=stroke==='open'?.22:stroke==='ghost'?.05:.08;o.frequency.setValueAtTime(f*1.3,t);o.frequency.exponentialRampToValueAtTime(f,t+.025);
   hit(a.gain,t,v*(stroke==='ghost'?.35:1),decay,.003);o.connect(a).connect(out);o.start(t);end(o,t+decay+.12);
   if(stroke==='slap'||stroke==='mute'){const n=noiseAt(t,.05,note/97,1),bp=filt('bandpass',stroke==='slap'?2600:1500,1.4),na=g();hit(na.gain,t,v*(stroke==='slap'?.8:.35),.03,.001);n.connect(bp).connect(na).connect(out);}},
  bongo(t,v,note,stroke){const f=hz(note),o=osc('sine',f*1.2),a=g(),decay=stroke==='open'?.12:.06;o.frequency.setValueAtTime(f*1.2,t);o.frequency.exponentialRampToValueAtTime(f,t+.015);
   hit(a.gain,t,v,decay,.003);o.connect(a).connect(out);o.start(t);end(o,t+decay+.08);const n=noiseAt(t,.03,note/89,1.3),bp=filt('bandpass',4200,1.2),na=g();hit(na.gain,t,v*.3,.012,.001);n.connect(bp).connect(na).connect(out);},
  // Timbal: a shell that rings (two partials of a chord tone) and the cáscara, sticks on the shell.
  timbal(t,v,note){const f=hz(note),a=g();hit(a.gain,t,v,.3,.003);for(const [k,m] of [[1,1],[2.76,.45]]){const o=osc('sine',f*k),og=g(m);o.connect(og).connect(a);o.start(t);o.stop(t+.45);voices++;}a.connect(out);
   const e=g(.2);a.connect(e).connect(bus.echoIn);},
  cascara(t,v,offset=0){const n=noiseAt(t,.04,offset,1.1),bp=filt('bandpass',3300,2.2),a=g();hit(a.gain,t,v,.022,.003);n.connect(bp).connect(a).connect(out);voices++;},
  // The cowbell in clave: two squares a fifth-and-a-bit apart on a chord tone, through a band.
  cowbell(t,v,note){const f=hz(note),bp=filt('bandpass',f*1.2,1.6),a=g();hit(a.gain,t,v,.09,.003);for(const k of [1,1.48]){const o=osc('square',f*k),og=g(.5);o.connect(og).connect(bp);o.start(t);o.stop(t+.25);voices++;}bp.connect(a).connect(out);},
  // The shaker: noise high in the band, soft attack.
  shaker(t,v,tone,offset=0){const n=noiseAt(t,.09,offset,1.4),bp=filt('bandpass',tone,1.1),hf=filt('highpass',4200,.7),a=g();hit(a.gain,t,v,.045,.007);n.connect(bp).connect(hf).connect(a).connect(out);voices++;},
  // The rolling bass: short notes on the off-beat sixteenths, round and low.
  bass(t,v,note,len,wave='sine'){const o=osc(wave,hz(note)),f=filt('lowpass',420,1.4),a=g();a.gain.setValueAtTime(0,t);a.gain.linearRampToValueAtTime(v,t+.004);a.gain.setTargetAtTime(0,t+len*.6,len*.35);
   o.connect(f).connect(a).connect(out);o.start(t);end(o,t+len*2+.05);},
  // A vocal chop of formants only: a buzzing source on a chord tone through three resonances that glide from one vowel
  // to another (no recording, no human voice), into the echo.
  chop(t,v,note,from,to,len,vowels){const s=osc('sawtooth',hz(note)),vib=osc('sine',5.5),vg=g(hz(note)*.012),a=g(),e=g(.55);vib.connect(vg).connect(s.frequency);
   a.gain.setValueAtTime(0,t);a.gain.linearRampToValueAtTime(v,t+.012);a.gain.setValueAtTime(v,t+len*.7);a.gain.linearRampToValueAtTime(0,t+len+.04);
   const A=vowels[from],B=vowels[to];A.forEach((fa,i)=>{const bp=filt('bandpass',fa,i?14:9),bg=g([1,.6,.3][i]);bp.frequency.setValueAtTime(fa,t);bp.frequency.setTargetAtTime(B[i],t+len*.25,len*.25);s.connect(bp).connect(bg).connect(a);});
   a.connect(out);a.connect(e).connect(bus.echoIn);s.start(t);vib.start(t);vib.stop(t+len+.1);end(s,t+len+.1);}
 };
 return api;
}
