import assert from 'node:assert/strict';
import {THEME,ON_TIME,PULSE_GAP,beatDistance,nearestBeat,heardTime,onTime,outputLatency,themePitch,playCello,initialize,landDelay,approach} from '../src/journey-pulse.js';
// The theme: six notes, two bars of eighths, starting and ending on the tonic.
assert.equal(THEME.length,6);assert.equal(THEME.reduce((a,[,l])=>a+l,0),16);assert.equal(THEME[0][0],0);assert.equal(THEME.at(-1)[0],0);
// Distance to the nearest beat, including the one that is about to come.
assert.equal(beatDistance(10.02,[9,9.5,10],.5),.019999999999999574);assert(beatDistance(10.45,[9.5,10],.5)<.06,'the next beat counts');assert.equal(beatDistance(1,[],.5),Infinity);
// Theme notes follow the scale of each place and stay in one octave.
for(const scale of [[0,2,3,5,7,8,10],[0,2,4,6,7,9,11],[0,2,3,5,7,9,10]])for(const tr of [-7,-5,0,3,7])for(const [d] of THEME){const n=themePitch(d,scale,tr);assert(n>=48&&n<=64,n);assert(scale.includes(((n-57-tr)%12+12)%12),'in the scale');}
assert.equal(themePitch(0,null),57,'a missing scale falls back to minor on A');
// The theme's voice (chapters, finale): every node starts and stops, nothing loud, no sawtooth.
const nodes=[];const param=()=>({setValueAtTime(){},exponentialRampToValueAtTime(v){assert(v>0);},linearRampToValueAtTime(){}});
const node=k=>{const n={k,connect(o){return o;},start(t){this.at=t;},stop(t){this.end=t;},frequency:param(),detune:param(),gain:param(),Q:param()};nodes.push(n);return n;};
const ac0={createOscillator:()=>node('osc'),createBiquadFilter:()=>node('filter'),createGain:()=>node('gain')};
playCello(ac0,{},1,57,.5,.13);assert(nodes.filter(n=>n.k==='osc').every(n=>n.at===1&&n.end>1.5));assert(!nodes.some(n=>n.type==='sawtooth'));
// Runtime: off the beat it only marks; on the beat it gives the next theme degree to the pulse's own voice (no
// separate synth is queued), vibrates and counts the phrase.
const vib=[];Object.defineProperty(globalThis,"navigator",{value:{vibrate:p=>{vib.push(p);return true;}},configurable:true});
const queued=[];let clock=0;const realNow=performance.now.bind(performance);performance.now=()=>clock;
const realTimer=setTimeout,realClear=clearTimeout,timers=new Map();let timerId=0;
globalThis.setTimeout=(f,ms)=>{const id=++timerId;timers.set(id,{f,at:clock+ms});return id;};globalThis.clearTimeout=id=>timers.delete(id);
const flush=()=>{for(const [id,v] of [...timers]){clock=Math.max(clock,v.at);timers.delete(id);v.f();}};
const r={S:{sound:true,mode:'camino'},MU:{bq:[0,.5,1],sq:[{t:.9,s:6}],tr:0,biome:0},BIOMES:[{scale:[0,2,3,5,7,8,10]}],SIX:.125,ac:{currentTime:1.25},bus:{},soon:fn=>queued.push(fn),inWorld:()=>false,flash:0};
initialize(r);
clock=1000;assert.equal(r.journeyPulse(),false,'a quarter beat away is off time');assert.equal(queued.length,0);assert.equal(vib.length,0);
clock=1050;assert.equal(r.journeyPulse(),null,'too soon after the last pulse');
for(let i=0;i<6;i++){clock+=500;r.ac.currentTime=1.5+i*.5+.01;r.MU.bq=[r.ac.currentTime-.01];assert.equal(r.journeyPulse(),true);flush();}
const s=r.journeyPulseState();assert.equal(s.hits,6);assert.equal(s.misses,1);assert.equal(s.phrases,1,'six on-time pulses complete the theme');assert.equal(s.next,0);assert.equal(queued.length,0,'no separate synth');assert.equal(vib.length,6);assert.deepEqual(vib.at(-1),[12,40,18],'the end of the phrase feels different');
assert(r.flash>0,'a gold flash answers');
r.S.haptics=false;clock+=500;r.ac.currentTime+=.5;r.MU.bq=[r.ac.currentTime];r.journeyPulse();assert.equal(vib.length,6,'vibration can be turned off');
clock+=500;r.ac.currentTime+=.5;r.MU.bq=[r.ac.currentTime];r.journeyPulse();assert.equal(r.journeyPulseState().degree,THEME[1][0],'the next theme degree goes to the pulse');
clock+=500;r.ac.currentTime+=.25;r.MU.bq=[r.ac.currentTime-.25];r.journeyPulse();assert.equal(r.journeyPulseState().degree,null,'off the beat: no theme degree');
// Judged when the finger touches, not when it lifts: a touch on the beat lifted 150 ms later is on time; a touch 150 ms
// early is not. The output latency (headphones) is taken off: a touch 180 ms after a beat heard 180 ms late is on time.
clock+=500;r.ac.currentTime+=.5;r.MU.bq=[r.ac.currentTime];const touched=clock;clock+=150;r.ac.currentTime+=.15;assert.equal(r.journeyPulse(touched),true,'touched on the beat, lifted later');
clock+=500;r.ac.currentTime+=.5;r.MU.bq=[r.ac.currentTime+.15];assert.equal(r.journeyPulse(clock),false,'touched 150 ms before the beat');
clock+=500;r.ac.currentTime+=.5;r.MU.bq=[r.ac.currentTime-.18];r.ac.outputLatency=.18;assert.equal(r.journeyPulse(),true,'Bluetooth delay is taken off');assert.equal(outputLatency(r.ac),.18);r.ac.outputLatency=0;
assert.equal(outputLatency({outputLatency:5}),.4,'absurd latencies are capped');assert.equal(outputLatency(null),0);
assert.equal(nearestBeat(1.02,[0,.5,1],.5),1);assert.equal(nearestBeat(1.4,[0,.5,1],.5),1.5,'the next beat counts');assert.equal(nearestBeat(1,[],.5),null);
assert.equal(heardTime({currentTime:2,outputLatency:.1},900,1000),2-.1-.1);assert.equal(onTime({currentTime:2},[2.07],.5,1000,1000),true);assert.equal(onTime({currentTime:2},[2.09],.5,1000,1000),false,'one window for the whole game');
// On time, the state carries the theme note and the beat it answers; without vibration the cube glows instead.
clock+=500;r.ac.currentTime+=.5;r.MU.bq=[r.ac.currentTime];Object.defineProperty(globalThis,"navigator",{value:{},configurable:true});r.cubeGlow=0;r.S.haptics=true;assert.equal(r.journeyPulse(),true);
flush();const st=r.journeyPulseState();assert(Number.isFinite(st.midi)&&st.beat===r.MU.bq[0]&&Array.isArray(st.scale));assert.equal(r.cubeGlow,1,'iPhone: the cube glows gold');
// A pulse the finger sent too soon leaves a faint mark instead of vanishing.
const before=r.journeyPulseState().marks;r.journeyPulseDropped();assert.equal(r.journeyPulseState().marks,Math.min(24,before+1));
// The Line draws on an inert canvas.
const c=new Proxy({},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>{o[k]=v;return true;}});globalThis.document={querySelector:()=>null,querySelectorAll:()=>[]};r.drawJourneyLine(c,390,844,0);
flush();performance.now=realNow;globalThis.setTimeout=realTimer;globalThis.clearTimeout=realClear;
// Phase 3: with the sound off every pulse counts, so the Journey can be played without hearing it.
{const q={S:{sound:false,mode:'camino'},MU:{bq:[]},BIOMES:[{scale:[0,2,3,5,7,8,10]}],SIX:.125,inWorld:()=>false};initialize(q);assert.equal(q.journeyPulse(),true,'sound off: on time');}
// Plan I3: the hit lands when the note is heard (never before, including the full estimated output delay); the Line's steps grow as the cursor comes.
assert.equal(landDelay(10.1,10,0),100);assert.equal(landDelay(10.1,10,.05),150);assert.equal(landDelay(9.9,10,0),0);assert.equal(landDelay(11,10,0),1000);
assert.equal(approach(4,4),1);assert.equal(approach(4,3),.75);assert.equal(approach(4,0),0);assert.equal(approach(0,15),.75);assert.equal(approach(4,5),0);
console.log('PASS journey pulse: six-note theme in two bars, on-time window '+ON_TIME*1000+' ms, theme notes in every scale and range, phrase every six hits, vibration and its setting, judged at the touch with the headphones delay taken off, one window for the game, a glow without vibration, dropped pulses marked, the Line draws');
