import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {audibleTime,cueDelay,lightLatency,outputLatency,setLatencyNudge,latencyNudge,heardTime,scheduleAudibleCue,initialize as initPulse} from '../src/journey-pulse.js';
import {heardStep} from '../src/journey-hint.js';
import {initialize as initInteractions,SOFT_PULSE} from '../src/interactions.js';
// Panel 10 (P5, Mizuguchi and Iwai): one clock for light and sound, calibration included, and no touch is mute.

// 1. No light waits on the raw audio clock: the informe's own grep finds nothing.
const raw=[];for(const f of readdirSync(new URL('../src/',import.meta.url)))if(f.endsWith('.js'))readFileSync(new URL('../src/'+f,import.meta.url),'utf8').split('\n').forEach((line,i)=>{if(line.includes('currentTime')&&line.includes('*1000')&&!/outputLatency|landDelay/.test(line))raw.push(f+':'+(i+1));});
assert.deepEqual(raw,[],'raw audio-clock timers left');
// Every module that lights a source when its note sounds goes through cueDelay.
for(const f of ['glass','mirrors','materia','vida','initiative','landmarks','quietud','cajas','render','feedback','patches','journey-echo','journey-victory','cube-shop-sound','jam'])assert.match(readFileSync(new URL(`../src/${f}.js`,import.meta.url),'utf8'),/cueDelay\(/,f);

// 2. With outputLatency 0.25 every glow lands when its note is heard (≤ 20 ms after it, never before).
const realNow=performance.now.bind(performance),realTimer=setTimeout,realClear=clearTimeout;let clock=0;const timers=new Map();let id=0;
performance.now=()=>clock;globalThis.setTimeout=(f,ms=0)=>{const k=++id;timers.set(k,{f,at:clock+ms});return k;};globalThis.clearTimeout=k=>timers.delete(k);
const run=until=>{for(const [k,v] of [...timers].sort((a,b)=>a[1].at-b[1].at)){if(v.at>until)continue;clock=Math.max(clock,v.at);timers.delete(k);v.f();}clock=Math.max(clock,until);};
setLatencyNudge(0);
const ac={currentTime:10,outputLatency:.25};
for(const note of [10,10.05,10.3,11.2]){const heard=note+outputLatency(ac),wait=cueDelay(ac,note)/1000;assert(wait+ac.currentTime>=heard-1e-9&&wait+ac.currentTime-heard<=.02,`glow at ${note}`);}
{const rt={S:{mode:'world',layer:'superficie'},ac};let at=null;clock=0;scheduleAudibleCue(rt,10.1,()=>{at=clock;});run(1000);const heard=(10.1+.25-10)*1000;assert(at!==null&&at>=heard-.5&&at-heard<=20,'scheduleAudibleCue lands on the heard note: '+at);}
// A module of the World (glass.js lights its site with cueDelay): measured through its own timer.
{const src=readFileSync(new URL('../src/glass.js',import.meta.url),'utf8');assert.match(src,/setTimeout\(\(\)=>\{site\.lit=1;\},cueDelay\(runtime\.ac,time\)\)/);}

// 3. The calibration moves the light and the Line's cursor too: with latencyNudge 0.15 the cursor crosses step 0 in
// the same frame (±16 ms) as its kick is heard; the judgement keeps using the nudge as before.
assert.equal(setLatencyNudge(.15),.15);assert.equal(latencyNudge(),.15);
{const a={currentTime:20,outputLatency:0};assert.equal(lightLatency(a),.15);assert.equal(audibleTime(a),20-.15);assert.equal(heardTime(a,1000,1000),20-.15,'judging keeps the nudge');
 assert.equal(cueDelay(a,20),150,'a note at now is heard 150 ms later');
 const kick=20,six=.15,rt={MU:{sq:[{t:kick-six,s:15},{t:kick,s:0},{t:kick+six,s:1}]},SIX:six,ac:a};
 // Frame by frame (16 ms): the first frame the cursor shows step 0 is within one frame of the heard kick.
 let first=null;for(let ms=0;ms<400;ms+=16){a.currentTime=kick+ms/1000-.05;const st=heardStep(rt);if(first===null&&st!==null&&st<1)first=a.currentTime;}
 const heardKick=kick+.15;assert(first!==null&&Math.abs(first-heardKick)<=.016,`cursor at step 0 ${first} vs kick heard ${heardKick}`);
 // The Line itself (journey-pulse.js) draws its cursor from the same clock.
 const r={S:{sound:true,mode:'camino'},MU:{bq:[kick],sq:rt.MU.sq},SIX:six,ac:a,inWorld:()=>false};initPulse(r);
 const rects=[];const c=new Proxy({},{get:(o,k)=>k==='fillRect'?(x,y,w,h)=>rects.push({x,w,h,alpha:o.globalAlpha}):k in o?o[k]:()=>{},set:(o,k,v)=>{o[k]=v;return true;}});globalThis.document={querySelector:()=>null,querySelectorAll:()=>[]};
 const W=390,x0=Math.max(24,W*.12),w=W-2*x0,cursorX=()=>rects.filter(q=>q.w===2&&q.h===8&&q.alpha===.85).at(-1)?.x;
 a.currentTime=kick+.15;rects.length=0;r.drawJourneyLine(c,W,844,0);assert.equal(cursorX(),Math.round(x0+.5/16*w)-1,'on the heard kick the cursor sits on step 0');
 a.currentTime=kick+.15-.017;rects.length=0;r.drawJourneyLine(c,W,844,0);assert.notEqual(cursorX(),Math.round(x0+.5/16*w)-1,'one frame before, it is still on step 15');
 // The hit's landing (gold glow, kick, vibration) waits for the nudge as well.
 a.currentTime=kick+.15;r.MU.bq=[kick];clock=5000;assert.equal(r.journeyPulse(),true,'touched on the heard kick');assert(r.journeyPulseState().landIn>=160&&r.journeyPulseState().landIn<=160+20,'landing waits for the heard note: '+r.journeyPulseState().landIn);}
setLatencyNudge(-.08);assert.equal(lightLatency({currentTime:1,outputLatency:.05}),0,'never earlier than the clock');setLatencyNudge(0);

// 4. One hit, one image; and no touch is mute.
function world(){const queue=[],plucks=[],voices=[];let judged=null;
 const rt={S:{mode:'camino',px:0,py:0,sound:true},MU:{act:0,queue},ac:{currentTime:30},activityActive:false,pulse:0,audio(){},inWorld:()=>false,soon:(fn)=>queue.push(fn),chordTones:()=>[60,64,67],pluck:(m,t,v)=>plucks.push({m,t,v}),vel:v=>v,playVoice:(...a)=>voices.push(a),
  journeyPulse:()=>judged?.(),journeyPulseState:()=>({beat:30.2,midi:57,degree:0}),journeyPulseScheduled:()=>{},journeyPulseDropped:()=>{rt.dropped=(rt.dropped||0)+1;}};
 initInteractions(rt);return {rt,queue,plucks,voices,judge:f=>{judged=f;}};}
{const {rt,queue,plucks,judge}=world();judge(()=>false);
 // Ten touches at 8 Hz: the ones closer than the gap are not judged, but each one sounds.
 clock=10000;for(let i=0;i<10;i++){clock=10000+i*125;rt.sonar('player',clock);}
 assert.equal(rt.pulse,0,'the cube does not swell at the touch');assert(rt.dropped>=4,'some touches were too close');
 const st=rt.softPulseState();assert.equal(st.scheduled,rt.dropped,'every dropped touch is scheduled softly');
 // The music's queue plays at most four per sixteenth (audio.js): drain it step by step.
 const perStep=[];let t=30;while(queue.length){let n=0;while(queue.length&&n<4){queue.shift()(t);n++;}perStep.push(n);t+=.15;}
 const sounds=plucks.length/3;assert.equal(sounds,10,'ten touches, ten sounds');assert(perStep.every(n=>n<=4),'never more than four per sixteenth');
 const soft=plucks.filter(p=>Math.abs(p.v-.08*SOFT_PULSE)<1e-9).length/3,full=plucks.filter(p=>p.v===.08).length/3;assert.equal(soft,rt.dropped,'the dropped ones are soft');assert.equal(full,10-rt.dropped);
 assert.deepEqual([...new Set(plucks.map(p=>p.m))].sort(),[72,76,79],'the same notes as a normal pulse');
 // The miss's cube swell lands with its note.
 rt.ac.currentTime=30;run(clock+1000);assert.equal(rt.pulse,.6,'the cube swells when the note is heard');}
{const {rt,judge}=world();judge(()=>true);clock=20000;rt.sonar('player',clock);run(clock+1000);assert.equal(rt.pulse,0,'a hit: no swell at the touch, only the landing kick');}
{const {rt,queue,voices,judge}=world();rt.inWorld=()=>true;rt.S.wx=5;rt.S.wy=6;rt.S.layer='superficie';rt.regionOfPos=()=>'r';rt.cubeColor=()=>'#fff';rt.sessionAction=()=>{};rt.pulseRelics=()=>{};rt.onBeatNow=()=>false;judge(()=>false);clock=30000;rt.sonar('player',clock);clock+=100;rt.sonar('player',clock);
 while(queue.length)queue.shift()(31);assert.equal(voices.length,2,'in the World both touches sound');assert.equal(voices[0][0],'pulso');assert.equal(voices[1][0],'pulso');assert.equal(voices[0][5],1);assert.equal(voices[1][5],SOFT_PULSE,'the same voice, softer');}
performance.now=realNow;globalThis.setTimeout=realTimer;globalThis.clearTimeout=realClear;
console.log('PASS one clock: no raw timers, glows on the heard note with 250 ms latency, calibration moves the cursor and the landing, one image per hit, ten touches ten sounds, at most four per sixteenth');
