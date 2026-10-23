import {openSurface,calmMotion} from './frame-state.js';
// The Journey, phase 1: playing on time. The pulse always sounds in the key; on the beat the pulse itself plays the
// next note of the cube's theme, in the voice of the place (no separate synth: a bowed tone of its own sounded like a
// honk over the music), vibrates and leaves a gold mark on the Line that draws the bar.
// The theme: scale degrees (0 = tonic) and lengths in eighths, two bars of 4/4 (see docs/VIAJE.md).
export const THEME=Object.freeze([[0,3],[1,1],[4,4],[3,2],[2,2],[0,4]].map(Object.freeze));
// How close to a beat counts as on time, in seconds either side. One window for the whole game: the Journey, portal
// rituals, «pulsos» challenges and the groove all use it (they used ±60 and ±90 ms before).
export const ON_TIME=.08;
// Shortest gap between two pulses: the grid already places them, this only keeps a finger from flooding it.
export const PULSE_GAP=120;
// The nearest beat to a time, from the recent beat times and the expected next one (null without beats).
export function nearestBeat(now,beats,bar){let best=null;const consider=b=>{if(best===null||Math.abs(now-b)<Math.abs(now-best))best=b;};for(const b of beats||[])consider(b);const last=beats?.[beats.length-1];if(last!==undefined&&bar>0)consider(last+bar);return best;}
// Distance from now to the nearest beat.
export function beatDistance(now,beats,bar){const b=nearestBeat(now,beats,bar);return b===null?Infinity:Math.abs(now-b);}
// How late the speaker or headphones play what the audio clock says (Bluetooth can add a fifth of a second).
export const outputLatency=ac=>{const v=Number(ac?.outputLatency||ac?.baseLatency||0);return Number.isFinite(v)?Math.max(0,Math.min(.4,v)):0;};
// The moment the player heard, on the audio clock: when the finger touched (atMs, from performance.now(); a tap is
// judged when the finger goes down, not when it lifts) minus the output latency, because the player answers what
// reaches the ear, not what the clock scheduled.
export function heardTime(ac,atMs,nowMs){const late=Number.isFinite(atMs)&&Number.isFinite(nowMs)?Math.max(0,Math.min(1,(nowMs-atMs)/1000)):0;return (ac?.currentTime||0)-late-outputLatency(ac);}
// Whether a touch at atMs was on a beat (shared by every system that asks «on time?»).
export const onTime=(ac,beats,bar,atMs,nowMs)=>!!ac&&beatDistance(heardTime(ac,atMs,nowMs),beats,bar)<=ON_TIME;
// A theme note in the scale of the place, as the chapters hear it.
export function themePitch(degree,scale,transpose=0){const sc=Array.isArray(scale)&&scale.length===7?scale:[0,2,3,5,7,8,10];let n=57+transpose+sc[((degree%7)+7)%7]+12*Math.floor(degree/7);while(n<48)n+=12;while(n>64)n-=12;return n;}
// The theme's voice in the chapters' Plenitude, the finale and the companion: a soft bowed tone. Triangle and sine, no
// sawtooth: a low sawtooth with vibrato sounded like a honk over the music.
export function playCello(ac,out,t,midi,seconds,volume){
 const hz=440*2**((midi-69)/12),o=ac.createOscillator(),o2=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain(),lfo=ac.createOscillator(),depth=ac.createGain(),end=t+seconds;
 o.type='triangle';o2.type='sine';o.frequency.setValueAtTime(hz,t);o2.frequency.setValueAtTime(hz*2,t);lfo.frequency.setValueAtTime(5,t);depth.gain.setValueAtTime(hz*.004,t);lfo.connect(depth);depth.connect(o.frequency);depth.connect(o2.frequency);
 f.type='lowpass';f.Q.setValueAtTime(.5,t);f.frequency.setValueAtTime(1600,t);f.frequency.linearRampToValueAtTime(2400,t+seconds*.4);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.06);g.gain.setValueAtTime(volume,t+seconds*.75);g.gain.exponentialRampToValueAtTime(.0001,end+.25);
 const g2=ac.createGain();g2.gain.setValueAtTime(.25,t);o.connect(f);o2.connect(g2);g2.connect(f);f.connect(g);g.connect(out);for(const n of [o,o2,lfo]){n.start(t);n.stop(end+.3);}return hz;}
export function initialize(runtime){
 const state={hits:0,misses:0,phrases:0,next:0,lastOn:null,degree:null,vibrations:0,notes:[]};let lastAt=-1e9;const marks=[];
 const calm=()=>calmMotion(runtime.S);
 const haptics=()=>runtime.S.haptics!==false;
 function vibrate(ms){if(!haptics()||typeof navigator==='undefined'||typeof navigator.vibrate!=='function')return false;try{navigator.vibrate(ms);state.vibrations++;return true;}catch(_){return false;}}
 function scaleNow(){const MU=runtime.MU||{};return {scale:MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale,tr:MU.tr||0};}
 // The Line's cursor follows what is heard: the audio clock minus the output latency.
 // The step of the bar at a time on the audio clock, from the steps the music scheduled.
 function stepAt(time){const sq=runtime.MU?.sq;if(!sq?.length)return 0;let last=null;for(const e of sq)if(e.t<=time)last=e;if(!last)return sq[0].s%16;return (last.s+Math.min(.99,Math.max(0,time-last.t)/(runtime.SIX||.15)))%16;}
 function stepNow(){const ac=runtime.ac;if(!ac)return 0;return stepAt(ac.currentTime-outputLatency(ac));}
 // Judge one player pulse touched at atMs (performance.now(); defaults to now). Returns whether it was on time; never
 // blocks the pulse itself. On time, state.midi is the theme note to play and state.beat the beat it answers.
 function judge(atMs){
  const ac=runtime.ac,now=performance.now();if(now-lastAt<PULSE_GAP)return null;lastAt=now;const at=Number.isFinite(atMs)?atMs:now;
  // With the sound off there is no beat to meet (phase 3 of the plan): every pulse counts, so the Journey can still be
  // played without hearing it; the chapters still ask for their moments and bars. While the music is only starting
  // (sound on, no beat yet) a pulse is simply not on time: the first touch must not teach that timing does not matter.
  const silent=!runtime.S.sound;
  const bar=(runtime.SIX||.15)*4,heard=ac?heardTime(ac,at,now):0,on=silent||beatDistance(heard,runtime.MU?.bq,bar)<=ON_TIME;state.lastOn=on;
  // The peak sits where you touched (what you heard then), and on time it sits on the beat you answered.
  const beatAt=on&&!silent?nearestBeat(heard,runtime.MU?.bq,bar):null,step=!ac?0:beatAt!==null?Math.round(stepAt(beatAt))%16:stepAt(heard);marks.push({at:now,step,on});if(marks.length>24)marks.shift();
  state.degree=null;state.midi=null;state.beat=null;if(!on){state.misses++;runtime.journeyChapterPulse?.(false);return false;}
  state.hits++;const [degree]=THEME[state.next],{scale,tr}=scaleNow(),midi=themePitch(degree,scale,tr);state.degree=degree;state.midi=midi;state.scale=scale;state.tr=tr;state.beat=nearestBeat(heard,runtime.MU?.bq,bar);state.next=(state.next+1)%THEME.length;
  // The chapter hears the note first, so the note that completes the theme counts.
  state.notes.push(midi);if(state.notes.length>12)state.notes.shift();runtime.journeyChapterPulse?.(true,midi,Number.isInteger(runtime.MU?.step)?runtime.MU.step:undefined);
  if(state.next===0){state.phrases++;runtime.recoverJourneyColor?.();runtime.journeyPhrase?.();runtime.themeKeyPhrase?.();}
  // Without vibration (iPhone has none) the cube glows gold for a beat instead.
  if(!vibrate(state.next===0?[12,40,18]:12))runtime.cubeGlow=1;runtime.flash=Math.max(runtime.flash||0,.7);
  return true;}
 // A pulse the finger sent too soon after the last one: a faint grey mark, so a touch never vanishes unseen.
 function dropped(){marks.push({at:performance.now(),step:stepNow(),on:false,dropped:true});if(marks.length>24)marks.shift();}
 // The Line: the bar drawn across the lower part of the screen, a cursor on the current step and a peak where you played.
 function draw(c,W,H,t){
  if(!(runtime.inWorld?.()||runtime.S.mode==='camino')||runtime.activityActive||openSurface('.modal:not([hidden])'))return;const y=Math.round(H*.8)+.5,x0=Math.max(24,W*.12),x1=W-x0,w=x1-x0,now=performance.now();
  c.save();c.lineWidth=1;c.strokeStyle='#ffffff';c.globalAlpha=.16;c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();
  for(let i=0;i<16;i++){c.globalAlpha=i%4?.18:.35;c.fillStyle='#fff';c.fillRect(Math.round(x0+(i+.5)/16*w),y-(i%4?1:2),1,i%4?2:4);}
  const step=stepNow(),cx=x0+(step+.5)/16*w;c.globalAlpha=.8;c.fillStyle=runtime.GOLD||'#f0d27a';c.fillRect(Math.round(cx)-1,y-3,2,6);
  for(const m of marks){const age=(now-m.at)/1000,life=calm()?2.5:1.8;if(age>life)continue;const k=1-age/life,px=x0+(m.step+.5)/16*w,h=(m.on?18:m.dropped?4:8)*(calm()?1:.6+.4*k);c.globalAlpha=k*(m.on?.95:m.dropped?.3:.5);c.strokeStyle=m.on?(runtime.GOLD||'#f0d27a'):m.dropped?'#888888':'#ffffff';c.beginPath();c.moveTo(px-5,y);c.lineTo(px,y-h);c.lineTo(px+5,y);c.stroke();}
  c.restore();}
 // Each chapter starts its theme from the first note.
 function reset(){state.next=0;}
 Object.defineProperties(runtime,{journeyPulse:{get:()=>judge},journeyPulseReset:{get:()=>reset},journeyPulseDropped:{get:()=>dropped},drawJourneyLine:{get:()=>draw},journeyPulseState:{get:()=>()=>({...state,notes:[...state.notes],marks:marks.length,lastMark:marks.length?{...marks[marks.length-1]}:null})},journeyVibrate:{get:()=>vibrate}});
}
