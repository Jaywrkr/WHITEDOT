import assert from 'node:assert/strict';
import {ECHO_GOAL,ECHO_MIN,ECHO_MAX,echoValue,echoPattern,echoJudge,normalizeEcho,echoClose,echoProgress} from '../src/journey-echo.js';
// Patterns are fixed by hashes, start on the «1», have the length asked (two to five) and different eighths.
for(let n=0;n<40;n++)for(let len=ECHO_MIN;len<=ECHO_MAX;len++){const p=echoPattern(n,len);assert.equal(p.length,len);assert.equal(p[0],0);assert(p.every(s=>s%2===0&&s<16));assert.equal(new Set(p).size,len);assert.deepEqual(echoPattern(n,len),p);}
assert.notDeepEqual(echoPattern(1,4),echoPattern(2,4),'patterns change');
// An echo has every step and nothing else.
assert(echoJudge([0,6,10],[10,0,6]));assert(!echoJudge([0,6,10],[0,6]));assert(!echoJudge([0,6,10],[0,6,10,12]));
// Saves: junk dropped, the length kept in 2–5.
const g=normalizeEcho({points:-1,len:9,n:'x'});assert.equal(g.points,0);assert.equal(g.len,ECHO_MAX);assert.equal(g.n,0);
// An echo scores 6 and 2 a step and lengthens the next pattern; a wrong answer scores 2 a right step and shortens it.
const s=normalizeEcho({});let r=echoClose(s,echoPattern(0,2));assert(r.ok);assert.equal(r.gained,echoValue(2));assert.equal(echoValue(2),10);assert.equal(echoValue(5),16);assert.equal(s.len,3);assert.equal(s.n,1);
r=echoClose(s,[0]);assert(!r.ok);assert.equal(r.gained,2,'two for the right step');assert.equal(s.len,2);r=echoClose(s,[]);assert.equal(s.len,2,'no answer: same length');assert.equal(s.points,12);
assert.equal(echoProgress(ECHO_GOAL/2),.5);
// Pacing: at 120 BPM a call and its answer take 4 s; a simulated player hits each step on time with a chance and,
// with a smaller chance per step, adds a wrong one. Averaged over 30 players a round should take about 2:30; playing on
// time is much faster here, because longer patterns are worth more.
function simulate(onTime,goal=ECHO_GOAL,seed=3){let rnd=seed;const rand=()=>(rnd=(rnd*16807)%2147483647)/2147483647;const st=normalizeEcho({});let t=0;
 while(st.points<goal&&t<1200){const p=echoPattern(st.n,st.len),ans=p.filter(()=>rand()<onTime);if(rand()<(1-onTime)*.5)ans.push(p.includes(2)?4:2);echoClose(st,ans,{goal});t+=4;}return t;}
const avg=(o,g)=>{let sum=0;for(let k=1;k<=30;k++)sum+=simulate(o,g,k*7919);return Math.round(sum/30);};
const casual=avg(.75,ECHO_GOAL),skilled=avg(.9,ECHO_GOAL),maestro=avg(.8,ECHO_GOAL*1.5);
assert(casual>=130&&casual<=180,'a round of the Cueva lasts about 2:30, not '+casual+' s');assert(skilled<casual);assert(maestro>=180&&maestro<=280,'the Maestro one, not '+maestro+' s');
console.log(`PASS journey echo: fixed patterns of two to five eighths from the «1», an echo has every step and nothing else, lengthens the next and a wrong one shortens it; simulated round ${casual} s (on time ${skilled} s, Maestro ${maestro} s)`);
