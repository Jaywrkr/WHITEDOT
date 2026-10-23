import assert from 'node:assert/strict';
import {GUIDE_GOAL,GUIDE_BOATS,GUIDE_REACH,GUIDE_HARBOR,GUIDE_NEAR,GUIDE_FAR,dockValue,boatSpot,normalizeGuide,guideFill,guidePulse,guideStep,guideProgress,lit} from '../src/journey-guide.js';
// Six boats out in the dark, between 220 and 430 px from the harbour; fixed by hashes, never random.
const c={x:1000,y:500},s=guideFill(normalizeGuide({center:c}));assert.equal(s.boats.length,GUIDE_BOATS);
assert.deepEqual(boatSpot(3,c),boatSpot(3,c));for(const b of s.boats){const d=Math.hypot(b.x-c.x,b.y-c.y);assert(d>=GUIDE_NEAR-1&&d<=GUIDE_FAR+1,d);}
// Saves: junk dropped, lights not kept across a reload.
const g=normalizeGuide({points:-1,boats:[{n:2,x:1,y:2,until:9e15},{x:'a'}],center:{x:1.4,y:2}});assert.equal(g.points,0);assert.equal(g.boats.length,1);assert.equal(g.boats[0].until,0);
// A convoy is worth more: four for one boat, two more for each other lit boat, up to three.
assert.deepEqual([1,2,3,4,6].map(dockValue),[4,6,8,10,10]);
// A pulse lights the boats within reach; far ones stay dark.
const b0=s.boats[0];let r=guidePulse(s,{x:b0.x+GUIDE_REACH-5,y:b0.y},0,{followMs:4000});assert(r.events.some(e=>e.boat===b0.n&&e.kind==='light'));assert(lit(b0,1));
r=guidePulse(s,{x:b0.x,y:b0.y},100,{followMs:4000});assert(r.events.some(e=>e.boat===b0.n&&e.kind==='keep'));
// A lit boat follows the cube; an unlit one only drifts.
const far=s.boats.find(b=>!lit(b,200)),fx=far.x;const pos={x:b0.x+200,y:b0.y},bx=b0.x;guideStep(s,pos,200,.5);assert(b0.x>bx+50,'it follows');assert(Math.abs(far.x-fx)<10,'it drifts');
// Its light runs out: it stops following.
guideStep(s,pos,5000,.5);const stopped=b0.x;guideStep(s,{x:pos.x+500,y:pos.y},5100,.5);assert(Math.abs(b0.x-stopped)<10);
// Brought home lit, it docks: points, and a new boat replaces it out in the dark.
b0.until=1e9;b0.x=c.x+GUIDE_HARBOR-5;b0.y=c.y;const n0=b0.n;r=guideStep(s,{x:c.x,y:c.y},6000,.016);assert.equal(r.docked.length,1);assert.equal(r.gained,4);assert.equal(s.points,4);assert(!s.boats.some(b=>b.n===n0));assert.equal(s.boats.length,GUIDE_BOATS);assert.equal(s.docked,1);
assert.equal(guideProgress(GUIDE_GOAL/2),.5);
// Pacing: a simulated player (150 px/s, a pulse a second on the Faros' three steps) lights the nearest boat, takes a
// second one along if it is near, then sails home, pulsing on the way to keep them lit. A round should take about 2:30.
function simulate(onTime,goal=GUIDE_GOAL,followMs=4000,seed=11){let rnd=seed;const rand=()=>(rnd=(rnd*16807)%2147483647)/2147483647;const st=guideFill(normalizeGuide({center:c})),p={...c};let t=0,lastPulse=-9;
 const dt=.1;while(st.points<goal&&t<1200){const now=t*1000,on=st.boats.filter(b=>lit(b,now)),target=on.length>=2||(on.length&&!st.boats.some(b=>!lit(b,now)&&Math.hypot(b.x-p.x,b.y-p.y)<200))?c:st.boats.filter(b=>!lit(b,now)).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
  const d=Math.hypot(target.x-p.x,target.y-p.y);if(d>30){const k=Math.min(d,150*dt);p.x+=(target.x-p.x)/d*k;p.y+=(target.y-p.y)/d*k;}
  if(t-lastPulse>=1&&(d<GUIDE_REACH*.8||on.length)){lastPulse=t;if(rand()<onTime)guidePulse(st,p,now,{followMs});}
  guideStep(st,p,now,dt,{goal});t+=dt;}return t;}
const casual=simulate(.75),skilled=simulate(.9),maestro=simulate(.8,GUIDE_GOAL*1.5,3000);
assert(casual>=130&&casual<=180,'a round of the Faros lasts about 2:30, not '+Math.round(casual)+' s');assert(skilled<=casual,'playing on time is not slower');assert(maestro>=180&&maestro<=270,'the Maestro one lasts 3–4 min, not '+Math.round(maestro)+' s');
console.log(`PASS journey guide: six boats in fixed spots, lit on time they follow, dark they drift, home lit they dock and a convoy is worth more; simulated round ${Math.round(casual)} s (on time ${Math.round(skilled)} s, Maestro ${Math.round(maestro)} s)`);
