import assert from 'node:assert/strict';
import {SURF_GOAL,SURF_BAND,SURF_NEAR,SURF_FAR,surfValue,surfProgress,waveSpot,rides,normalizeSurf} from '../src/journey-surf.js';
// Waves are worth more in a row: two, three, then four.
assert.deepEqual([0,1,2,6].map(surfValue),[2,3,4,4]);
// Each wave's ring: fixed by its number, 90–170 px from where the cube was.
const from={x:500,y:-200};for(let n=0;n<40;n++){const w=waveSpot(n,from),d=Math.hypot(w.x-from.x,w.y-from.y);assert(d>=SURF_NEAR-1&&d<=SURF_FAR+1);assert.deepEqual(waveSpot(n,from),w);}
// A ride: on that wave's beat, inside its ring.
const w={x:0,y:0,at:10};assert(rides(w,{x:20,y:10},10));assert(!rides(w,{x:SURF_BAND+5,y:0},10),'outside the ring');assert(!rides(w,{x:0,y:0},10.5),'another beat');assert(!rides(w,{x:30,y:0},10,{band:20}),'narrower in Maestro');
assert.deepEqual(normalizeSurf({points:-2,streak:'x',gold:1}),{points:0,streak:0,best:0,rides:0,n:0,gold:false,opened:false,hinted:false});
assert.equal(surfProgress(SURF_GOAL),1);
// Pacing: one wave every bar (about two seconds); a player who catches a share of them, losing the streak on each
// miss; the average of 200 rounds.
function simulate(p,goal,seed){let r=seed,pts=0,streak=0,t=0;const rand=()=>(r=(r*16807)%2147483647)/2147483647;while(pts<goal&&t<900){t+=2;if(rand()<p){pts+=surfValue(streak);streak++;}else streak=0;}return t;}
const avg=(p,goal=SURF_GOAL)=>Math.round(Array.from({length:200},(_,i)=>simulate(p,goal,i*7919+11)).reduce((a,b)=>a+b)/200);
const casual=avg(.65),skilled=avg(.85),maestro=avg(.65,SURF_GOAL*1.5);
assert(casual>=140&&casual<=180,'a round of the Dunas lasts about 2:30, not '+casual+' s');assert(skilled<casual);assert(maestro>=180&&maestro<=250,'Maestro 3–4 min, not '+maestro+' s');
console.log(`PASS journey surf: waves worth more in a row, fixed rings 90–170 px away, a ride only on its beat inside its ring; simulated round ${casual} s (skilled ${skilled} s, Maestro ${maestro} s)`);
