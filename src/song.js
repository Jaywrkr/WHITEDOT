import {THEME,themePitch,playCello} from './journey-pulse.js';
// Tu canción (plan F7, docs/MUNDO.md): each of the eleven places gives one layer of one song, eight bars of house at
// 120 BPM in A major (A, E, F♯m, D; two bars each). The Journey's finale builds it from your five chapters; the
// Refugio plays it with the layers you have won; with the 33 stars all eleven sound together: that is winning.
export const SONG_BPM=120,SONG_SIX=60/SONG_BPM/4,SONG_BARS=8,SONG_STEPS=SONG_BARS*16;
export const SONG_MAJOR=Object.freeze([0,2,4,5,7,9,11]);
// Two bars per chord: bass root, and the chord's three notes around A3.
export const SONG_CHORDS=Object.freeze([{root:45,tones:[57,61,64]},{root:40,tones:[56,59,64]},{root:42,tones:[54,57,61]},{root:38,tones:[54,57,62]}].map(Object.freeze));
export const chordAt=step=>SONG_CHORDS[Math.floor((((step%SONG_STEPS)+SONG_STEPS)%SONG_STEPS)/32)];
// Each place's layer: what it plays and its colour; the order is the order of the places.
export const SONG_LAYERS=Object.freeze({
 llanura:{name:'Bombo',color:'#eb9a3c'},lago:{name:'Bajo dub',color:'#5cc8ff'},bosque:{name:'Palmas y platillos',color:'#6fe08a'},
 tormenta:{name:'Ácido',color:'#b48cff'},vacio:{name:'Colchón',color:'#ffffff'},jardin:{name:'Arpegio',color:'#ff8fc8'},
 dunas:{name:'Percusión',color:'#f3e6b0'},cristales:{name:'Campanas',color:'#9ef0e6'},faros:{name:'Melodía',color:'#fff36a'},
 ruinas:{name:'Acordes',color:'#a88c6a'},cueva:{name:'Eco',color:'#ff4f3a'}});
export const SONG_IDS=Object.freeze(Object.keys(SONG_LAYERS));
const ACID=[0,0,12,0,7,0,12,0,0,0,12,7,0,12,0,7];
// The hits of one layer at one sixteenth, over a chord {root,tones}: the song uses its own chords, a place's victory
// the chord the world is playing (journey-victory.js).
export function layerStep(id,s,c){const out=[],b=s%16,add=(what,extra={})=>out.push({s,what,...extra});
 if(id==='llanura'&&b%4===0)add('kick');
 if(id==='lago'&&[0,6,10].includes(b))add('bass',{midi:c.root,len:3});
 if(id==='bosque'){if(b%4===2)add('hat');if(b%8===4)add('clap');}
 if(id==='tormenta')add('acid',{midi:c.root+12+ACID[b],accent:b%4===0});
 if(id==='vacio'&&s%32===0)add('pad',{tones:c.tones,len:32});
 if(id==='jardin'&&b%2===0)add('arp',{midi:c.tones[[0,1,2,1][(b/2)%4]]+12});
 if(id==='dunas'){add('shaker',{accent:b%4===2});if(b===3||b===11)add('conga',{midi:b===3?62:57});}
 if(id==='cristales'&&b%8===4)add('bell',{midi:c.tones[2]+12+(b===12?0:-3)});
 if(id==='ruinas'&&b%8===6)add('stab',{tones:c.tones});
 if(id==='cueva'&&s%32===8)add('echo',{midi:c.tones[1]+12});
 return out;}
// Any chord brought to the song's registers: the bass root between D2 and C♯3, the three notes from F♯3.
export function songChord(tones){let root=tones[0],shift=0;while(root>49)root-=12;while(root<38)root+=12;while(tones[0]+shift>65)shift-=12;while(tones[0]+shift<54)shift+=12;
 return {root,tones:tones.slice(0,3).map(m=>m+shift)};}
// A layer as the stars have grown it (plan H4): ★ a fragment (every other bar), ★★ the whole layer, ★★★ its variation
// (the notes doubled an octave up, softer, and the beats answered two sixteenths later, softer). 0 is silent.
const PITCHED=new Set(['bass','acid','arp','bell','lead','echo','conga']),CHORDAL=new Set(['pad','stab']);
export function tierStep(id,s,c,tier){if(!(tier>0))return [];if(tier===1&&Math.floor(s/16)%2===1)return [];const out=layerStep(id,s,c).map(e=>({...e}));
 if(tier>=3){for(const e of layerStep(id,s,c)){if(PITCHED.has(e.what))out.push({...e,midi:e.midi+12,soft:true});else if(CHORDAL.has(e.what))out.push({...e,tones:e.tones.map(m=>m+12),soft:true});}
  for(const e of layerStep(id,s-2,c))if(!PITCHED.has(e.what)&&!CHORDAL.has(e.what)&&!out.some(q=>q.what===e.what))out.push({...e,s,soft:true});}
 return out;}
// The hits of one layer over the eight bars, in sixteenths: testable without sound.
export function layerEvents(id){const out=[];for(let s=0;s<SONG_STEPS;s++)out.push(...layerStep(id,s,chordAt(s)));
 // The Faros carry the cube's theme twice, in the song's key.
 if(id==='faros')for(const start of [0,64]){let at=start;for(const [d,l] of THEME){out.push({s:at,what:'lead',midi:themePitch(d,SONG_MAJOR,0)+12,len:l*2});at+=l*2;}}
 return out.sort((a,b)=>a.s-b.s);}
export function initialize(runtime){
 let current=null;const hz=m=>440*2**((m-69)/12);
 function env(g,t,v,a,d){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,v),t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d);}
 function tone(ac,out,m,t,dur,type,v,cut=3000,detune=[0],q=.7,sweep=0){const f=ac.createBiquadFilter(),g=ac.createGain();f.type='lowpass';f.Q.value=q;f.frequency.setValueAtTime(cut,t);if(sweep)f.frequency.exponentialRampToValueAtTime(cut*sweep,t+dur*.6);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+Math.min(.02,dur*.2));g.gain.setValueAtTime(v*.85,t+dur*.7);g.gain.exponentialRampToValueAtTime(.0001,t+dur);f.connect(g);g.connect(out);
  for(const d of detune){const o=ac.createOscillator();o.type=type;o.frequency.value=hz(m);o.detune.value=d;o.connect(f);o.start(t);o.stop(t+dur+.05);}}
 function noise(ac,out,t,dur,v,type,freq,q=1){const buf=runtime.noiseBuffer;if(!buf)return;const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=buf;f.type=type;f.frequency.value=freq;f.Q.value=q;env(g,t,v,.002,dur);s.connect(f);f.connect(g);g.connect(out);s.start(t);s.stop(t+dur+.05);}
 function kick(ac,out,t,v){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);env(g,t,v,.003,.32);o.connect(g);g.connect(out);o.start(t);o.stop(t+.4);}
 function conga(ac,out,t,m,v){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(hz(m)*1.3,t);o.frequency.exponentialRampToValueAtTime(hz(m),t+.05);env(g,t,v,.003,.18);o.connect(g);g.connect(out);o.start(t);o.stop(t+.25);}
 // One hit of a layer, at its time: every voice goes through the song's own gain, so stopping fades all of it.
 function hit(ac,out,e,t,six){switch(e.what){
  case 'cello':return playCello(ac,out,t,e.midi,e.len*six,e.soft?.05:.09);
  case 'kick':return kick(ac,out,t,.5);
  case 'bass':return tone(ac,out,e.midi,t,e.len*six,'square',.11,500,[0],2);
  case 'hat':return noise(ac,out,t,.09,.1,'highpass',7000);
  case 'clap':noise(ac,out,t,.16,.24,'bandpass',1500,.8);return noise(ac,out,t+.012,.14,.16,'bandpass',1500,.8);
  case 'acid':return tone(ac,out,e.midi,t,six*.95,'sawtooth',e.accent?.06:.045,e.accent?900:500,[0],9,2.6);
  case 'pad':return e.tones.forEach(m=>tone(ac,out,m+12,t,e.len*six,'sawtooth',.016,1100,[-10,10]));
  case 'arp':return tone(ac,out,e.midi,t,six*1.6,'triangle',.05,4000);
  case 'shaker':return noise(ac,out,t,.05,e.accent?.07:.04,'bandpass',6500,1.5);
  case 'conga':return conga(ac,out,t,e.midi,.12);
  case 'bell':tone(ac,out,e.midi,t,1.2,'sine',.05,6000);return tone(ac,out,e.midi+19,t,.5,'sine',.012,8000);
  case 'lead':return tone(ac,out,e.midi,t,e.len*six*.92,'square',.035,2600,[-6,6]);
  case 'stab':return e.tones.forEach(m=>tone(ac,out,m+12,t,six*1.2,'sawtooth',.036,2200,[-8,8]));
  case 'echo':for(let k=0;k<4;k++)tone(ac,out,e.midi,t+k*six*3,six*2.5,'triangle',.08*Math.pow(.5,k),1800);return;}}
 // Play layers from a time: `from` per layer is the bar it comes in at (0 by default); `bars` how long it plays.
 function play(ids,{at,bars=SONG_BARS,from={},gain=.62,six=SONG_SIX}={}){const ac=runtime.ac;if(!runtime.S.sound||!ac||!runtime.bus)return null;const t0=at??ac.currentTime+.08,out=ac.createGain();out.gain.value=gain;out.connect(runtime.bus);
  const steps=bars*16;for(const id of ids){if(!SONG_LAYERS[id])continue;const enter=(from[id]||0)*16,events=layerEvents(id);for(let base=0;base<steps;base+=SONG_STEPS)for(const e of events){const s=base+e.s;if(s<enter||s>=steps)continue;hit(ac,out,e,t0+s*six,six);}}
  const handle={out,t0,six,bars,ids:[...ids],from:{...from},stop(){try{out.gain.setTargetAtTime(.0001,ac.currentTime,.15);setTimeout(()=>out.disconnect(),1200);}catch(_){}if(current===handle)current=null;}};current=handle;return handle;}
 // When each layer last hit, for the rings that pulse with it.
 function pulse(handle,id,time){if(!handle)return 0;const s=(time-handle.t0)/handle.six;if(s<(handle.from[id]||0)*16||s>handle.bars*16)return 0;const local=((s%SONG_STEPS)+SONG_STEPS)%SONG_STEPS;let last=null;for(const e of layerEvents(id))if(e.s<=local)last=e;else break;return last?Math.max(0,1-(local-last.s)/4):0;}
 Object.defineProperties(runtime,{playSong:{get:()=>play},songPulse:{get:()=>pulse},songNote:{get:()=>(handle,m,t,dur,v=.06)=>{if(handle&&runtime.ac)tone(runtime.ac,handle.out,m,t,dur,'square',v,3200,[-7,7]);}},songHit:{get:()=>(out,e,t,six=SONG_SIX)=>{if(runtime.ac)hit(runtime.ac,out,e,t,six);}},songPlaying:{get:()=>()=>!!current&&!!runtime.ac&&runtime.ac.currentTime<current.t0+current.bars*16*current.six},stopSong:{get:()=>()=>current?.stop()}});
}
