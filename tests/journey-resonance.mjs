import assert from 'node:assert/strict';
import {RES_GOAL,RES_REACH,RES_VALUES,crystalSpots,normalizeResonance,resonancePulse,ringing,resonanceProgress} from '../src/journey-resonance.js';
// Nine fixed crystals, three of each note.
const c={x:0,y:0},spots=crystalSpots(c);assert.equal(spots.length,9);assert.deepEqual([0,1,2].map(n=>spots.filter(s=>s.note===n).length),[3,3,3]);assert.deepEqual(crystalSpots(c),spots);
const n=normalizeResonance({points:-1,until:[5,'x']});assert.equal(n.points,0);assert.equal(n.until[0],5);assert.equal(n.until[1],0);
// A pulse on time rings what is within reach; it keeps ringing for its time.
const s=normalizeResonance({center:c});let r=resonancePulse(s,spots[0],0,{ringMs:4000});assert.deepEqual(r.events,[{kind:'ring',crystal:0,note:0}]);assert.equal(r.gained,RES_VALUES.ring);
assert.deepEqual(ringing(s,3999),[0]);assert.deepEqual(ringing(s,4001),[]);
r=resonancePulse(s,spots[0],100,{ringMs:4000});assert.equal(r.gained,0,'ringing again only keeps it sounding');
r=resonancePulse(s,{x:9999,y:0},200);assert.deepEqual(r.events,[],'far from every crystal nothing rings');
// Three different notes at once: a chord, worth far more, and they fall silent.
resonancePulse(s,spots[1],1000,{ringMs:4000});r=resonancePulse(s,spots[2],2000,{ringMs:4000});assert(r.events.some(e=>e.kind==='chord'));assert.equal(s.chords,1);assert.deepEqual(ringing(s,2001),[]);
assert(r.gained>=RES_VALUES.chord);assert.equal(resonanceProgress(RES_GOAL/2),.5);
// Pacing: a simulated player (150 px/s, one pulse a second, a second to settle) walks crystal to crystal, a different
// note each time; the average of 100 rounds. A round should take about 2:30, Maestro (shorter ring, bar ×1.5) 3–4 min.
function simulate(p,goal,ring,seed){let r0=seed;const rand=()=>(r0=(r0*16807)%2147483647)/2147483647;const st=normalizeResonance({center:c}),pos={...spots[0]};let t=0,at=0,pause=1;
 while(st.points<goal&&t<1200){const target=spots[at],d=Math.hypot(target.x-pos.x,target.y-pos.y);
  if(d>20){const k=Math.min(d,150);pos.x+=(target.x-pos.x)/d*k;pos.y+=(target.y-pos.y)/d*k;}else if(pause>0)pause--;else if(rand()<p){resonancePulse(st,pos,t*1000,{ringMs:ring,goal});at=(at+1)%9;pause=1;}
  t++;}return t;}
const avg=(p,goal=RES_GOAL,ring=8000)=>Math.round(Array.from({length:100},(_,i)=>simulate(p,goal,ring,i*7919+3)).reduce((a,b)=>a+b)/100);
const casual=avg(.7),skilled=avg(.9),maestro=avg(.75,RES_GOAL*1.5,7500);
assert(casual>=140&&casual<=180,'a round of the Cristales lasts about 2:30, not '+casual+' s');assert(skilled<casual);assert(maestro>=180&&maestro<=250,'Maestro 3–4 min, not '+maestro+' s');
console.log(`PASS journey resonance: nine fixed crystals, ring on time within reach, three notes at once make a chord; simulated round ${casual} s (skilled ${skilled} s, Maestro ${maestro} s)`);
