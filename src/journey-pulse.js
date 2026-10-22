import {openSurface,prefersReducedMotion} from './frame-state.js';
// The Journey, phase 1: playing on time. The pulse always sounds in the key; on the beat it also plays the next
// note of the cube's theme in its own voice, vibrates and leaves a gold mark on the Line that draws the bar.
// The theme: scale degrees (0 = tonic) and lengths in eighths, two bars of 4/4 (see docs/VIAJE.md).
export const THEME=Object.freeze([[0,3],[1,1],[4,4],[3,2],[2,2],[0,4]].map(Object.freeze));
// How close to a beat counts as on time, in seconds either side.
export const ON_TIME=.06;
// Shortest gap between two pulses: the grid already places them, this only keeps a finger from flooding it.
export const PULSE_GAP=120;
// Distance from now to the nearest beat, from the recent beat times and the expected next one.
export function beatDistance(now,beats,bar){let best=Infinity;for(const b of beats||[])best=Math.min(best,Math.abs(now-b));const last=beats?.[beats.length-1];if(last!==undefined&&bar>0)best=Math.min(best,Math.abs(now-(last+bar)));return best;}
// A theme note in the scale of the place, kept in the cello's range.
export function themePitch(degree,scale,transpose=0){const sc=Array.isArray(scale)&&scale.length===7?scale:[0,2,3,5,7,8,10];let n=57+transpose+sc[((degree%7)+7)%7]+12*Math.floor(degree/7);while(n<48)n+=12;while(n>64)n-=12;return n;}
// The cube's own voice: a bowed tone, the same everywhere.
export function playCello(ac,out,t,midi,seconds,volume){
 const hz=440*2**((midi-69)/12),o=ac.createOscillator(),o2=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain(),lfo=ac.createOscillator(),depth=ac.createGain(),end=t+seconds;
 o.type='sawtooth';o2.type='triangle';o.frequency.setValueAtTime(hz,t);o2.frequency.setValueAtTime(hz,t);o2.detune.setValueAtTime(4,t);lfo.frequency.setValueAtTime(5.2,t);depth.gain.setValueAtTime(hz*.006,t);lfo.connect(depth);depth.connect(o.frequency);depth.connect(o2.frequency);
 f.type='lowpass';f.Q.setValueAtTime(.7,t);f.frequency.setValueAtTime(900,t);f.frequency.linearRampToValueAtTime(2200,t+seconds*.4);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.08);g.gain.setValueAtTime(volume,t+seconds*.75);g.gain.exponentialRampToValueAtTime(.0001,end+.25);
 o.connect(f);o2.connect(f);f.connect(g);g.connect(out);for(const n of [o,o2,lfo]){n.start(t);n.stop(end+.3);}return hz;}
export function initialize(runtime){
 const state={hits:0,misses:0,phrases:0,next:0,lastOn:null,vibrations:0,notes:[]};let lastAt=-1e9;const marks=[];
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const haptics=()=>runtime.S.haptics!==false;
 function vibrate(ms){if(!haptics()||typeof navigator==='undefined'||typeof navigator.vibrate!=='function')return false;try{navigator.vibrate(ms);state.vibrations++;return true;}catch(_){return false;}}
 function scaleNow(){const MU=runtime.MU||{};return {scale:MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale,tr:MU.tr||0};}
 function stepNow(){const ac=runtime.ac,sq=runtime.MU?.sq;if(!ac||!sq?.length)return 0;let last=null;for(const e of sq)if(e.t<=ac.currentTime)last=e;if(!last)return sq[0].s%16;return (last.s+Math.min(.99,(ac.currentTime-last.t)/(runtime.SIX||.15)))%16;}
 // Judge one player pulse. Returns whether it was on time; never blocks the pulse itself.
 function judge(){
  const ac=runtime.ac,now=performance.now();if(now-lastAt<PULSE_GAP)return null;lastAt=now;
  const on=!!ac&&beatDistance(ac.currentTime,runtime.MU?.bq,(runtime.SIX||.15)*4)<=ON_TIME;state.lastOn=on;marks.push({at:now,step:stepNow(),on});if(marks.length>24)marks.shift();
  if(!on){state.misses++;return false;}
  state.hits++;const [degree,eighths]=THEME[state.next],{scale,tr}=scaleNow(),midi=themePitch(degree,scale,tr);state.next=(state.next+1)%THEME.length;if(state.next===0)state.phrases++;
  state.notes.push(midi);if(state.notes.length>12)state.notes.shift();
  vibrate(state.next===0?[12,40,18]:12);runtime.flash=Math.max(runtime.flash||0,.7);
  if(runtime.S.sound&&ac)runtime.soon?.(t=>{if(runtime.bus)playCello(ac,runtime.bus,t,midi,eighths*(runtime.SIX||.15)*2,.13);},'player');
  return true;}
 // The Line: the bar drawn across the lower part of the screen, a cursor on the current step and a peak where you played.
 function draw(c,W,H,t){
  if(!(runtime.inWorld?.()||runtime.S.mode==='camino')||runtime.activityActive||openSurface('.modal:not([hidden])'))return;const y=Math.round(H*.8)+.5,x0=Math.max(24,W*.12),x1=W-x0,w=x1-x0,now=performance.now();
  c.save();c.lineWidth=1;c.strokeStyle='#ffffff';c.globalAlpha=.16;c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();
  for(let i=0;i<16;i++){c.globalAlpha=i%4?.18:.35;c.fillStyle='#fff';c.fillRect(Math.round(x0+(i+.5)/16*w),y-(i%4?1:2),1,i%4?2:4);}
  const step=stepNow(),cx=x0+(step+.5)/16*w;c.globalAlpha=.8;c.fillStyle=runtime.GOLD||'#f0d27a';c.fillRect(Math.round(cx)-1,y-3,2,6);
  for(const m of marks){const age=(now-m.at)/1000,life=calm()?2.5:1.8;if(age>life)continue;const k=1-age/life,px=x0+(m.step+.5)/16*w,h=(m.on?18:8)*(calm()?1:.6+.4*k);c.globalAlpha=k*(m.on?.95:.5);c.strokeStyle=m.on?(runtime.GOLD||'#f0d27a'):'#ffffff';c.beginPath();c.moveTo(px-5,y);c.lineTo(px,y-h);c.lineTo(px+5,y);c.stroke();}
  c.restore();}
 Object.defineProperties(runtime,{journeyPulse:{get:()=>judge},drawJourneyLine:{get:()=>draw},journeyPulseState:{get:()=>()=>({...state,notes:[...state.notes],marks:marks.length})},journeyVibrate:{get:()=>vibrate}});
}
