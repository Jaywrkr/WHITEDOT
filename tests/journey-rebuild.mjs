import assert from 'node:assert/strict';
import {RUINS_PILLARS,RUINS_STONES,RUINS_REACH,RUINS_VALUES,RUINS_GOAL,RUINS_MAX,RUINS_START,pillarSpots,normalizeRebuild,pillarAt,rebuildPulse,ruinsProgress} from '../src/journey-rebuild.js';
// Eight pillars in a fixed ring; some stones still standing.
const c={x:1000,y:500},spots=pillarSpots(c);assert.equal(spots.length,RUINS_PILLARS);assert.deepEqual(pillarSpots(c),spots);
const s=normalizeRebuild({center:c});assert.deepEqual(s.stones,[...RUINS_START]);
// Saves: junk dropped, heights kept in 0–7.
const g=normalizeRebuild({points:-2,stones:[9,'x',-1],arches:[true,'y']});assert.equal(g.points,0);assert.equal(g.stones[0],7);assert.equal(g.stones[1],RUINS_START[1]);assert.equal(g.stones[2],0);assert.deepEqual(g.arches.slice(0,2),[true,false]);
assert.equal(pillarAt(s,spots[3]),3);assert.equal(pillarAt(s,{x:c.x,y:c.y}),null,'the middle is far from every pillar');
// Three steps of the pattern in one bar beside a pillar lay one stone; a fourth in that bar lays nothing more.
const at=spots[1];let r=rebuildPulse(s,at,{bar:10,step:0});assert.equal(r.gained,0);r=rebuildPulse(s,at,{bar:10,step:6});assert.equal(r.gained,0);
r=rebuildPulse(s,at,{bar:10,step:8});assert.equal(r.gained,RUINS_VALUES.stone);assert.equal(s.stones[1],1);r=rebuildPulse(s,at,{bar:10,step:12});assert.equal(r.gained,0);
// Steps across two bars, or a step off the pattern, do not add up.
rebuildPulse(s,at,{bar:11,step:0});rebuildPulse(s,at,{bar:11,step:6});r=rebuildPulse(s,at,{bar:12,step:8});assert.equal(s.stones[1],1);
r=rebuildPulse(s,at,{bar:13,step:0});r=rebuildPulse(s,at,{bar:13,step:4});r=rebuildPulse(s,at,{bar:13,step:2});assert.equal(s.stones[1],1,'only the pattern counts');
// The Maestro asks for all four.
const m=normalizeRebuild({center:c});for(const st of [0,6,8])rebuildPulse(m,spots[1],{bar:1,step:st,need:4});assert.equal(m.stones[1],0);rebuildPulse(m,spots[1],{bar:1,step:12,need:4});assert.equal(m.stones[1],1);
// A whole pillar beside a whole one raises the arch between them.
const w=normalizeRebuild({center:c,stones:[7,6,0,0,0,0,0,0]});let bar=0;for(const st of [0,6,8])r=rebuildPulse(w,spots[1],{bar,step:st});assert.equal(w.stones[1],7);assert(r.events.some(e=>e.kind==='arch'&&e.from===0&&e.to===1));assert.equal(r.gained,RUINS_VALUES.stone+RUINS_VALUES.arch);assert(w.arches[0]);
assert(RUINS_GOAL<RUINS_MAX&&RUINS_GOAL*1.5>=RUINS_MAX,'the Maestro builds the whole ruin');assert.equal(ruinsProgress(RUINS_GOAL/2),.5);
// Pacing: a simulated player at 120 BPM (a bar is 2 s) plays the four steps of the pattern each bar, each on time with
// a chance, at the pillar with the fewest stones missing near it, walking 150 px/s to the next. About 2:30 a round.
function simulate(onTime,need=3,goal=RUINS_GOAL,seed=5){let rnd=seed;const rand=()=>(rnd=(rnd*16807)%2147483647)/2147483647;const st=normalizeRebuild({center:c});let t=0,b=0,at=0;
 while(st.points<goal&&t<1200){if(st.stones[at]>=RUINS_STONES){const next=(at+1)%RUINS_PILLARS;t+=Math.hypot(spots[next].x-spots[at].x,spots[next].y-spots[at].y)/150;at=next;b=Math.ceil(t/2);continue;}
  for(const step of [0,6,8,12])if(rand()<onTime)rebuildPulse(st,spots[at],{bar:b,step,need,goal});b++;t+=2;}return t;}
const casual=simulate(.75),skilled=simulate(.9),maestro=simulate(.8,4,Math.min(RUINS_MAX,RUINS_GOAL*1.5));
assert(casual>=130&&casual<=180,'a round of the Ruinas lasts about 2:30, not '+Math.round(casual)+' s');assert(skilled<casual);assert(maestro>=180&&maestro<=330,'the Maestro one, not '+Math.round(maestro)+' s');
console.log(`PASS journey rebuild: eight pillars in a fixed ring, three steps of the pattern in a bar lay a stone (four in Maestro), whole neighbours raise an arch; simulated round ${Math.round(casual)} s (on time ${Math.round(skilled)} s, Maestro ${Math.round(maestro)} s)`);
