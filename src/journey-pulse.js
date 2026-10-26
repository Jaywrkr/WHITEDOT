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
// The cube's form (plan H2, Matsuura's Vibri): every four hits on time in a row it gains a form, up to three; a miss
// takes one away, never all. Testable without drawing.
export const FORM_EVERY=4,FORM_MAX=3;
export function formStep(f,on){const q={level:f?.level|0,run:f?.run|0};if(on){q.run++;if(q.run>=FORM_EVERY&&q.level<FORM_MAX){q.level++;q.run=0;}}else{q.level=Math.max(0,q.level-1);q.run=0;}return q;}
// The nearest beat to a time, from the recent beat times and the expected next one (null without beats).
export function nearestBeat(now,beats,bar){let best=null;const consider=b=>{if(best===null||Math.abs(now-b)<Math.abs(now-best))best=b;};for(const b of beats||[])consider(b);const last=beats?.[beats.length-1];if(last!==undefined&&bar>0)consider(last+bar);return best;}
// Distance from now to the nearest beat.
export function beatDistance(now,beats,bar){const b=nearestBeat(now,beats,bar);return b===null?Infinity:Math.abs(now-b);}
// How late the speaker or headphones play what the audio clock says (Bluetooth can add a fifth of a second).
// How long until a scheduled note reaches the estimated output; high-latency devices keep their full delay.
// How near the cursor is to a step it is coming to: 1 on it, falling to 0 four steps before (plan I3).
export const approach=(step,now)=>{const ahead=((step-now)%16+16)%16;return ahead<4?1-ahead/4:0;};
// Panel 10 (P3, Mizuguchi and Wong): the anticipation also reaches the cube, with light and not size. A thin ring closes
// on the cube over the four steps before each step the place counts, reaching its smallest radius on the same step as
// the Line's mark; gold on the «1». The cube (s) never changes. With calm motion it does not move: it only brightens.
export const CUBE_RING_GAP=5,CUBE_RING_TRAVEL=10;
export function cubeRing(now16,steps,s,still=false){if(!Number.isFinite(now16)||!(s>0))return null;let come=0,one=false;for(const st of steps||[]){const a=approach(st,now16);if(a>come){come=a;one=st===0;}}
 if(come<=0)return null;const min=s/2+CUBE_RING_GAP;return {r:still?min:min+(1-come)*CUBE_RING_TRAVEL,alpha:(still?.45:.6)*come,gold:one,come};}
// The Line's base: bright enough to read over a landscape (Wong: ≥ (90,90,90) measured), on a black band.
export const LINE_ALPHA=.38,LINE_BACK=.7,LINE_TICK_GAP=12;
export const landDelay=(beat,now,latency=0)=>[beat,now,latency].every(Number.isFinite)?Math.max(0,Math.round((beat+latency-now)*1000)):0;
// Same scheduling rule the pulse already uses; visuals follow the emitted note, not a past judged beat.
export const pulseNoteTime=(now,beat)=>Math.max(now+.01,Number.isFinite(beat)&&beat>now?beat:0);
// The player's own delay (see heardTime below), declared first: the light follows it too.
let NUDGE=0;
export const outputLatency=ac=>{const v=Number(ac?.outputLatency||ac?.baseLatency||0);return Number.isFinite(v)?Math.max(0,Math.min(.4,v)):0;};
// Panel 10 (P5, Mizuguchi): one clock for the light. Every light, cursor and glow waits for the moment the note is
// heard: the device's output latency plus the player's measured delay (the calibration, latencyNudge), never negative.
export const lightLatency=ac=>Math.max(0,outputLatency(ac)+NUDGE);
// The audio clock as the player hears it now; what the Line's cursor, the beat glows and every visual cue follow.
export const audibleTime=ac=>(ac?.currentTime||0)-lightLatency(ac);
// Milliseconds from now until a note scheduled at `time` on the audio clock is heard (0 without audio).
export const cueDelay=(ac,time)=>ac?landDelay(time,ac.currentTime||0,lightLatency(ac)):0;
// Visual callbacks follow the estimated audible output and expire on a surface change.
export function scheduleAudibleCue(runtime,time,paint){const state=runtime.S,ac=runtime.ac,mode=state.mode,layer=state.layer,wait=cueDelay(ac,time),due=performance.now()+wait;
 return setTimeout(()=>{if(runtime.S!==state||runtime.ac!==ac||state.mode!==mode||state.layer!==layer||globalThis.document?.hidden||ac?.state&&ac.state!=='running'||performance.now()-due>150||openSurface('.modal:not([hidden])'))return;paint();},wait);}
// The moment the player heard, on the audio clock: when the finger touched (atMs, from performance.now(); a tap is
// judged when the finger goes down, not when it lifts) minus the output latency, because the player answers what
// reaches the ear, not what the clock scheduled.
// Plus the player's own delay, measured from their first pulses (rhythm-calibration.js, plan H2): some phones and
// headphones are later than they say, and some players hear the beat a little late.
export const latencyNudge=()=>NUDGE;
export function setLatencyNudge(v){NUDGE=Number.isFinite(v)?Math.max(-.08,Math.min(.3,v)):0;return NUDGE;}
export function heardTime(ac,atMs,nowMs){const late=Number.isFinite(atMs)&&Number.isFinite(nowMs)?Math.max(0,Math.min(1,(nowMs-atMs)/1000)):0;return (ac?.currentTime||0)-late-outputLatency(ac)-NUDGE;}
// Whether a touch at atMs was on a beat (shared by every system that asks «on time?»).
export const onTime=(ac,beats,bar,atMs,nowMs)=>!!ac&&beatDistance(heardTime(ac,atMs,nowMs),beats,bar)<=ON_TIME;
// A theme note in the scale of the place, as the chapters hear it.
export function themePitch(degree,scale,transpose=0){const sc=Array.isArray(scale)&&scale.length===7?scale:[0,2,3,5,7,8,10];let n=57+transpose+sc[((degree%7)+7)%7]+12*Math.floor(degree/7);while(n<48)n+=12;while(n>64)n-=12;return n;}
// The theme's voice in the chapters' Plenitude, the finale and the companion: a soft bowed tone. Triangle and sine, no
// sawtooth: a low sawtooth with vibrato sounded like a honk over the music.
// Recall preserves order and bar phase. Very long rests shorten by whole bars only.
// Legacy modulo-16 data cannot reveal original bars: equal/backward steps start a new bar.
export function phraseTimeline(notes=[],steps=[],ticks=[]){
 const count=notes.length,exact=Array.isArray(ticks)&&ticks.length===count&&ticks.every((v,i)=>Number.isSafeInteger(v)&&v>=0&&(!i||v>=ticks[i-1]));
 if(exact){const out=[];for(let i=0;i<count;i++){const gap=i?ticks[i]-ticks[i-1]:0;out.push(i?out[i-1]+(gap>64?16+gap%16:gap):ticks[0]%16);}return out;}
 if(Array.isArray(steps)&&steps.length===count&&steps.every(v=>Number.isInteger(v)&&v>=0&&v<16)){const out=[];for(const st of steps){let tick=st;if(out.length)while(tick<=out.at(-1))tick+=16;out.push(tick);}return out;}
 return notes.map((_,i)=>i*2);
}
export function playCello(ac,out,t,midi,seconds,volume){
 const hz=440*2**((midi-69)/12),o=ac.createOscillator(),o2=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain(),lfo=ac.createOscillator(),depth=ac.createGain(),end=t+seconds;
 o.type='triangle';o2.type='sine';o.frequency.setValueAtTime(hz,t);o2.frequency.setValueAtTime(hz*2,t);lfo.frequency.setValueAtTime(5,t);depth.gain.setValueAtTime(hz*.004,t);lfo.connect(depth);depth.connect(o.frequency);depth.connect(o2.frequency);
 f.type='lowpass';f.Q.setValueAtTime(.5,t);f.frequency.setValueAtTime(1600,t);f.frequency.linearRampToValueAtTime(2400,t+seconds*.4);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.06);g.gain.setValueAtTime(volume,t+seconds*.75);g.gain.exponentialRampToValueAtTime(.0001,end+.25);
 const g2=ac.createGain();g2.gain.setValueAtTime(.25,t);o.connect(f);o2.connect(g2);g2.connect(f);f.connect(g);g.connect(out);for(const n of [o,o2,lfo]){n.start(t);n.stop(end+.3);}return hz;}
export function initialize(runtime){
 const state={hits:0,misses:0,phrases:0,next:0,lastOn:null,degree:null,vibrations:0,notes:[],noteSteps:[]};let form={level:0,run:0},formAt=0;let lastAt=-1e9;const marks=[];const pending=new Set();let lastLanding=null,epoch=0;
 const calm=()=>calmMotion(runtime.S);
 const haptics=()=>runtime.S.haptics!==false;
 function vibrate(ms){if(!haptics()||typeof navigator==='undefined'||typeof navigator.vibrate!=='function')return false;try{navigator.vibrate(ms);state.vibrations++;return true;}catch(_){return false;}}
 function scheduleLanding(time){const f=lastLanding;if(!f)return;if(f.timer!==undefined){clearTimeout(f.timer);pending.delete(f.timer);}
  const ac=runtime.ac,wait=runtime.S.sound&&ac?cueDelay(ac,time):0;state.landIn=wait;f.due=performance.now()+wait;
  const land=()=>{pending.delete(f.timer);if(f.epoch!==epoch||f.owner!==runtime.S||f.mode!==runtime.S.mode||f.layer!==runtime.S.layer||globalThis.document?.hidden||openSurface('.modal:not([hidden])')||performance.now()-f.due>150||runtime.S.sound&&runtime.ac?.state&&runtime.ac.state!=='running')return;
   if(f.waiting)return;vibrate(f.phrase?[12,40,18]:12);runtime.cubeGlow=1;runtime.cubeKick=calm()?0:1;runtime.flash=Math.max(runtime.flash||0,.7);};
  if(wait>0){f.timer=setTimeout(land,wait);pending.add(f.timer);if(pending.size>12){const first=pending.values().next().value;clearTimeout(first);pending.delete(first);}}else land();
 }
 function scaleNow(){const MU=runtime.MU||{};return {scale:MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale,tr:MU.tr||0};}
 // The Line's cursor follows what is heard: the audio clock minus the output latency.
 // The step of the bar at a time on the audio clock, from the steps the music scheduled.
 function absoluteStepAt(time){const sq=runtime.MU?.sq||[],six=runtime.SIX||.15;let last=null;for(const e of sq)if(e.t<=time)last=e;if(!last||!Number.isSafeInteger(last.tick))return null;return Math.max(0,Math.round(last.tick+(time-last.t)/six));}
 function stepAt(time){const sq=runtime.MU?.sq;if(!sq?.length)return 0;let last=null;for(const e of sq)if(e.t<=time)last=e;if(!last)return sq[0].s%16;return (last.s+Math.min(.99,Math.max(0,time-last.t)/(runtime.SIX||.15)))%16;}
 function stepNow(){const ac=runtime.ac;if(!ac)return 0;return stepAt(audibleTime(ac));}
 // Judge one player pulse touched at atMs (performance.now(); defaults to now). Returns whether it was on time; never
 // blocks the pulse itself. On time, state.midi is the theme note to play and state.beat the beat it answers.
 function judge(atMs){
  const ac=runtime.ac,now=performance.now();if(now-lastAt<PULSE_GAP)return null;lastAt=now;const at=Number.isFinite(atMs)?atMs:now;
  // With the sound off there is no beat to meet (phase 3 of the plan): every pulse counts, so the Journey can still be
  // played without hearing it; the chapters still ask for their moments and bars. While the music is only starting
  // (sound on, no beat yet) a pulse is simply not on time: the first touch must not teach that timing does not matter.
  const silent=!runtime.S.sound;
  // A place or chapter with a rhythm of its own (journey-rhythm.js, plan F14) counts its steps instead of the beat.
  const bar=(runtime.SIX||.15)*4,heard=ac?heardTime(ac,at,now):0,window=runtime.MU?.onTimeWindow||ON_TIME,own=ac&&!silent?runtime.journeyRhythmTarget?.(heard):null;
  const on=silent||(own?!!own.hit&&own.hit.dist<=window:beatDistance(heard,runtime.MU?.bq,bar)<=window);state.lastOn=on;runtime.sparkRhythmPulse?.(on);
  // The peak sits where you touched (what you heard then), and on time it sits on the beat you answered.
  const beatAt=on&&!silent?(own?own.hit.time:nearestBeat(heard,runtime.MU?.bq,bar)):null,step=!ac?0:beatAt!==null?(own?own.hit.step:Math.round(stepAt(beatAt))%16):stepAt(heard);marks.push({at:now,step,on});if(marks.length>24)marks.shift();
  if(on&&!silent)runtime.journeyRhythmHit?.(step);
  // How far from its target this touch was, signed, for the calibration of the first pulses.
  // Plan I3: only on the quarters (an eighth pattern could take the wrong step) and never while the place sings.
  if(ac&&!silent&&!runtime.rhythmSinging?.()&&(!own?.hit||own.hit.step%4===0)){const target=own?.hit?.time??nearestBeat(heard,runtime.MU?.bq,bar);if(Number.isFinite(target))runtime.calibrationSample?.(heard-target);}
  // The chapter game hears every pulse, with the step of the bar it answered (0 is the «1»).
  const played=on?(()=>{const [degree]=THEME[state.next],{scale,tr}=scaleNow();return {degree,scale,tr,midi:themePitch(degree,scale,tr)};})():null;
  const action=runtime.journeyGamePulse?.(on,{midi:played?.midi,tick:absoluteStepAt(beatAt??heard),step:Number.isFinite(step)?Math.round(step)%16:null,silent,at:Number.isFinite(beatAt)?beatAt:null});
  state.action=action||null;const waiting=action==='wait'||action==='crowded';marks[marks.length-1].waiting=waiting;
  // The wild World hears it too: a wild spark beside the cube hops on time (wild.js, plan F18).
  runtime.wildPulse?.(on);
  if(!silent&&!waiting){form=formStep(form,on);formAt=performance.now();}
  state.degree=null;state.midi=null;state.beat=null;if(!on){state.misses++;runtime.journeyChapterPulse?.(false);return false;}
  state.hits++;const {degree,scale,tr,midi}=played;state.degree=degree;state.midi=midi;state.scale=scale;state.tr=tr;state.beat=beatAt??nearestBeat(heard,runtime.MU?.bq,bar);state.next=(state.next+1)%THEME.length;
  // The chapter hears the note first, so the note that completes the theme counts.
  state.notes.push(midi);state.noteSteps.push(Number.isFinite(step)?Math.round(step)%16:null);if(state.notes.length>12){state.notes.shift();state.noteSteps.shift();}runtime.journeyChapterPulse?.(true,midi,Number.isFinite(step)?Math.round(step)%16:undefined,absoluteStepAt(beatAt??heard));
  if(state.next===0){state.phrases++;runtime.recoverJourneyColor?.();runtime.journeyPhrase?.();runtime.themeKeyPhrase?.();}
  // The cube glows gold for a beat on every hit, the phone vibrates where it can and the cube punches (plan H1). Plan
  // I3: all of it lands when the note is heard, not when the finger touched, so light, touch and sound are one instant.
  lastLanding={owner:runtime.S,mode:runtime.S.mode,layer:runtime.S.layer,phrase:state.next===0,waiting,epoch};
  scheduleLanding(ac?pulseNoteTime(ac.currentTime,state.beat):0);
  return true;}
 // A pulse the finger sent too soon after the last one: a faint grey mark, so a touch never vanishes unseen.
 function dropped(){marks.push({at:performance.now(),step:stepNow(),on:false,dropped:true});if(marks.length>24)marks.shift();}
 // The Line: the bar drawn across the lower part of the screen, a cursor on the current step and a peak where you played.
 function draw(c,W,H,t){
  if(!(runtime.inWorld?.()||runtime.S.mode==='camino')||runtime.activityActive||openSurface('.modal:not([hidden])'))return;const y=Math.round(H*.8)+.5,x0=Math.max(24,W*.12),x1=W-x0,w=x1-x0,now=performance.now();
  c.save();c.lineWidth=7;c.strokeStyle='#000000';c.globalAlpha=LINE_BACK;c.beginPath();c.moveTo(x0-4,y);c.lineTo(x1+4,y);c.stroke();c.lineWidth=1;c.strokeStyle='#ffffff';c.globalAlpha=LINE_ALPHA;c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();
  // One guide (plan H2): the steps the place counts stand up on the Line, the «1» in gold when it counts; the others
  // stay small. While the place sings its pattern (journey-rhythm.js) they glow on their beat.
  const counted=runtime.journeyRhythmState?.()?.steps||[0,4,8,12],sing=runtime.rhythmSinging?.()||null;
  // Plan I3: the Line anticipates; a counted step grows and brightens over the four steps before the cursor reaches it.
  const now16=stepNow(),gold=runtime.GOLD||'#f0d27a';
  for(let i=0;i<16;i++){const on=counted.includes(i),one=on&&i===0,lit=sing&&sing.step===i&&on?1-sing.age:0,come=on?approach(i,now16):0;c.globalAlpha=Math.min(1,on?.6+.35*lit+.35*come:(i%4?.22:.36));c.fillStyle=one?gold:'#fff';const hgt=on?(one?9:6)+6*lit+8*come:(i%4?2:3);c.fillRect(Math.round(x0+(i+.5)/16*w)-(on?1:0),y-hgt/2,one?3:on?2:1,hgt);}
  // Panel 10 (P4, Pope and Matsuura): during a round, one tick past the end of the Line lights gold while the share on
  // time reaches what the next star asks (runtime.roundTick, the card's own share). No number, no new word.
  const tick=runtime.roundTick?.();if(tick){const tx=Math.round(x1+LINE_TICK_GAP);c.globalAlpha=LINE_BACK;c.fillStyle='#000000';c.fillRect(tx-4,y-9,9,18);c.globalAlpha=tick.lit?.95:.4;c.fillStyle=tick.lit?gold:'#ffffff';const th=tick.lit?14:6;c.fillRect(tx-1,Math.round(y-th/2),2,th);}
  const step=stepNow(),cx=x0+(step+.5)/16*w;c.globalAlpha=.85;c.fillStyle='#ffffff';c.fillRect(Math.round(cx)-1,y-4,2,8);
  for(const m of marks){const age=(now-m.at)/1000,life=calm()?2.5:1.8;if(age>life)continue;const k=1-age/life,px=x0+(m.step+.5)/16*w,h=(m.on?18:m.dropped?4:8)*(calm()?1:.6+.4*k);c.globalAlpha=k*(m.on?.95:m.dropped?.3:.5);c.strokeStyle=m.on&&!m.waiting?(runtime.GOLD||'#f0d27a'):m.dropped?'#888888':'#ffffff';c.beginPath();
   // An open bracket means a good beat still waiting for the place's action.
   if(m.waiting){c.moveTo(px-5,y-5);c.lineTo(px-5,y-1);c.lineTo(px+5,y-1);c.lineTo(px+5,y-5);}else{c.moveTo(px-5,y);c.lineTo(px,y-h);c.lineTo(px+5,y);}c.stroke();}
  c.restore();}
 // The ring that closes on the cube before each counted step (cubeRing), with the Line's own clock and steps.
 const ringLive=()=>!!runtime.ac&&!!runtime.S.sound&&!!runtime.MU?.sq?.length&&!(runtime.ac.state&&runtime.ac.state!=='running');
 const ringNow=s=>ringLive()?cubeRing(stepNow(),runtime.journeyRhythmState?.()?.steps||[0,4,8,12],s,calm()):null;
 function drawRing(c,x,y,s){if(!(runtime.inWorld?.()||runtime.S.mode==='camino')||runtime.activityActive||openSurface('.modal:not([hidden])'))return;
  const ring=ringNow(s);if(!ring)return;
  c.save();c.lineWidth=1;c.globalAlpha=ring.alpha;c.strokeStyle=ring.gold?runtime.GOLD||'#f0d27a':'#ffffff';c.beginPath();c.arc(x,y,ring.r,0,6.283);c.stroke();c.restore();}
 // The cube's form around it: corners, then a diamond, then a gold double frame that turns. Drawn over the cube.
 function drawForm(c,x,y,s,t){drawRing(c,x,y,s);if(!form.level||!(runtime.inWorld?.()||runtime.S.mode==='camino'))return;const gold=runtime.GOLD||'#f0d27a',still=calm(),fresh=Math.max(0,1-(performance.now()-formAt)/400),r=s/2+6;c.save();c.lineWidth=1.5;
  c.globalAlpha=.8;c.strokeStyle='#ffffff';for(const [dx,dy] of [[-1,-1],[1,-1],[1,1],[-1,1]]){c.beginPath();c.moveTo(x+dx*r,y+dy*(r-4));c.lineTo(x+dx*r,y+dy*r);c.lineTo(x+dx*(r-4),y+dy*r);c.stroke();}
  if(form.level>=2){const d=r+6;c.globalAlpha=.6+.3*fresh;c.beginPath();c.moveTo(x,y-d);c.lineTo(x+d,y);c.lineTo(x,y+d);c.lineTo(x-d,y);c.closePath();c.stroke();}
  if(form.level>=3){const a=still?0:t/900,d=r+12;c.globalAlpha=.85;c.strokeStyle=gold;c.translate(x,y);c.rotate(a);c.strokeRect(-d,-d,d*2,d*2);c.rotate(Math.PI/4);c.strokeRect(-d*.8,-d*.8,d*1.6,d*1.6);}
  c.restore();}
 // Each chapter starts its theme from the first note.
 function reset(){state.next=0;epoch++;for(const timer of pending)clearTimeout(timer);pending.clear();lastLanding=null;}
 Object.defineProperties(runtime,{journeyPulse:{get:()=>judge},journeyPulseScheduled:{get:()=>scheduleLanding},journeyPulseReset:{get:()=>reset},journeyPulseDropped:{get:()=>dropped},drawJourneyLine:{get:()=>draw},journeyPulseState:{get:()=>()=>({...state,notes:[...state.notes],noteSteps:[...state.noteSteps],marks:marks.length,lastMark:marks.length?{...marks[marks.length-1]}:null})},journeyVibrate:{get:()=>vibrate},drawCubeForm:{get:()=>drawForm},cubeForm:{get:()=>()=>({...form})},journeyCubeRing:{get:()=>(s=12)=>ringNow(s)}});
}
