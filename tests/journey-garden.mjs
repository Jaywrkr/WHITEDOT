import assert from 'node:assert/strict';
import {GARDEN_GOAL,GARDEN_BEDS,GARDEN_REACH,GARDEN_VALUES,bedSpots,normalizeGarden,gardenPulse,gardenWilt,gardenProgress} from '../src/journey-garden.js';
// Eight beds around the centre, near and far in turn; fixed, never random.
const c={x:1000,y:500},spots=bedSpots(c);assert.equal(spots.length,GARDEN_BEDS);assert.deepEqual(bedSpots(c),spots);
assert(spots.every((p,i)=>Math.abs(Math.hypot(p.x-c.x,p.y-c.y)-(i%2?230:150))<1));
// Saves: junk is dropped, stages kept in 0–4.
const g=normalizeGarden({points:-3,beds:[{stage:9,care:5},{stage:'x'}],center:{x:1000.4,y:500}});assert.equal(g.points,0);assert.equal(g.beds[0].stage,4);assert.equal(g.beds[1].stage,0);assert.deepEqual(g.center,{x:1000,y:500});
// A pulse on an empty bed sows; beside it, others grow; on a flower, it is picked.
const s=normalizeGarden({center:c});let r=gardenPulse(s,spots[0],0);assert.deepEqual(r.events,[{kind:'sow',bed:0}]);assert.equal(r.gained,GARDEN_VALUES.sow);
r=gardenPulse(s,spots[0],1);assert.deepEqual(r.events,[{kind:'grow',bed:0,stage:2}],'the bed underneath grows once it is sown');
r=gardenPulse(s,spots[0],2);r=gardenPulse(s,spots[0],3);assert.equal(r.events[0].kind,'bloom');assert.equal(s.blooms,1);
r=gardenPulse(s,spots[0],4);assert.equal(r.events[0].kind,'pick');assert.equal(s.beds[0].stage,0);
r=gardenPulse(s,{x:c.x+5000,y:c.y},5);assert.deepEqual(r.events,[],'far from every bed nothing happens');
// With its rhythm (plan F14): on the beat sows and picks but does not grow; on the «y» waters what is in reach.
{const q=normalizeGarden({center:c});assert.deepEqual(gardenPulse(q,spots[0],0,{mode:'water'}).events,[],'water on an empty bed sows nothing');
 assert.deepEqual(gardenPulse(q,spots[0],1,{mode:'sow'}).events,[{kind:'sow',bed:0}]);assert.deepEqual(gardenPulse(q,spots[0],2,{mode:'sow'}).events,[],'the beat does not grow');
 assert.deepEqual(gardenPulse(q,spots[0],3,{mode:'water'}).events,[{kind:'grow',bed:0,stage:2}]);gardenPulse(q,spots[0],4,{mode:'water'});assert.equal(gardenPulse(q,spots[0],5,{mode:'water'}).events[0].kind,'bloom');
 assert.deepEqual(gardenPulse(q,spots[0],6,{mode:'water'}).events,[],'a flower is not picked on the «y»');assert.equal(gardenPulse(q,spots[0],7,{mode:'sow'}).events[0].kind,'pick');}
// Untended plants wilt one step after eight bars (two seconds a bar here).
s.beds[1].stage=3;s.beds[1].care=0;assert.deepEqual(gardenWilt(s,15999,2),[]);assert.deepEqual(gardenWilt(s,16001,2),[1]);assert.equal(s.beds[1].stage,2);
assert.equal(gardenProgress(GARDEN_GOAL/2),.5);
// Pacing: a simulated player (150 px/s, one pulse a second, a second to settle at each bed) stays at a bed until its
// flower is picked, then goes to the nearest other one. A round should take 2:30–3:00 like the other places (plan F1);
// a person is a little slower than this player.
function simulate(onTime,goal=GARDEN_GOAL,seed=7,wiltBars=8){let rnd=seed;const rand=()=>(rnd=(rnd*16807)%2147483647)/2147483647;const st=normalizeGarden({center:c}),pos={...c};let t=0,pause=0,at=-1,picked=false;
 while(st.points<goal&&t<1200){if(at<0||picked){const next=spots.map((p,i)=>({i,d:Math.hypot(p.x-pos.x,p.y-pos.y)})).filter(e=>e.i!==at).sort((a,b)=>a.d-b.d)[0];at=next.i;pause=1;picked=false;}
  const p=spots[at],d=Math.hypot(p.x-pos.x,p.y-pos.y);if(d>20){const step=Math.min(d,150);pos.x+=(p.x-pos.x)/d*step;pos.y+=(p.y-pos.y)/d*step;}
  else if(pause>0)pause--;else if(rand()<onTime){const b=st.beds[at].stage,mode=b===0||b===4?'sow':'water';const r=gardenPulse(st,pos,t*1000,{goal,mode});picked=r.events.some(e=>e.kind==='pick'&&e.bed===at);}
  gardenWilt(st,t*1000,2,wiltBars);t++;}return t;}
const casual=simulate(.75),skilled=simulate(.9),maestro=simulate(.8,GARDEN_GOAL*1.5,7,6);
assert(casual>=130&&casual<=180,'a round of the Jardín lasts about 2:30, not '+casual+' s');assert(skilled<casual,'playing on time is faster');assert(maestro>=180&&maestro<=260,'the Maestro one lasts 3–4 min, not '+maestro+' s');
console.log(`PASS journey garden: eight fixed beds, sow, grow, bloom and pick on time, untended plants wilt; simulated round ${Math.round(casual)} s (on time ${Math.round(skilled)} s, Maestro ${Math.round(maestro)} s)`);
