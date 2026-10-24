import assert from 'node:assert/strict';
import {initialize as games} from '../src/journey-games.js';
import {DANCE_GOAL,DANCE_RADIUS,DANCE_NEAR,DANCE_FAR,danceValue,danceProgress,danceSpot,normalizeDance,initialize} from '../src/journey-dance.js';
// Returned in a row: 10, 15, then 20; circles fall between DANCE_NEAR and DANCE_FAR from the cube, by hash of their count.
assert.deepEqual([1,2,3,7].map(danceValue),[10,15,20,20]);assert.equal(DANCE_GOAL,250);assert.equal(danceProgress(DANCE_GOAL),1);
for(let n=0;n<50;n++){const p=danceSpot(n,{x:0,y:0}),d=Math.hypot(p.x,p.y);assert(d>=DANCE_NEAR-1&&d<=DANCE_FAR+1);assert.deepEqual(p,danceSpot(n,{x:0,y:0}));}
assert.deepEqual(normalizeDance(null),{points:0,count:0,returned:0,best:0,eye:null,closed:false,hinted:false});
// Runtime.
let clock=0;const realNow=performance.now.bind(performance);performance.now=()=>clock;const timers=[];globalThis.setTimeout=f=>{timers.push(f);return 0;};
const toasts=[],done=[];
const r={S:{wx:0,wy:0,sound:false,journey:{}},SIX:.125,BIOMES:[{id:'tormenta'}],biomeOfPos:()=>0,journeyChapter:()=>({id:'tormenta',done:{}}),journeyQuiet:()=>true,inWorld:()=>true,save:()=>true,toast:m=>toasts.push(m),journeyComplete:id=>done.push(id),MU:{journeyFloor:0,journeyCap:.4}};
games(r);initialize(r);
const draws=[];const ctx=new Proxy({},{get:(o,k)=>k in o?o[k]:()=>draws.push(k),set:(o,k,v)=>{o[k]=v;return true;}});
const frame=()=>{r.drawJourneyGamesUnder(ctx,390,844,clock);r.drawJourneyGames(ctx,390,844,clock);};
frame();let st=r.journeyDance();assert(st.target,'a circle appears');assert(r.journeyDance().inside,'the first one right beside the cube');r.S.wx=500;assert(r.MU.journeyOwnBolts,'the storm only strikes where the circles are');
// Outside the circle, on time: nothing. Inside, off time: nothing. Inside, on time: the bolt goes back up.
assert.equal(r.journeyGamePulse(true),'outside');assert.equal(r.journeyDance().points,0);
r.S.wx=st.target.x;r.S.wy=st.target.y;assert.equal(r.journeyGamePulse(false),'miss');assert.equal(r.journeyDance().points,0);
assert.equal(r.journeyGamePulse(true),'return');assert.equal(r.journeyDance().points,10);assert.equal(r.journeyDance().target,null);
// The next circle comes half a second later; returned in a row it is worth more.
clock+=600;frame();st=r.journeyDance();assert(st.target&&st.target.n===1);r.S.wx=st.target.x;r.S.wy=st.target.y;r.journeyGamePulse(true);assert.equal(r.journeyDance().points,25);
// A bolt not returned falls white after a bar and a half, and the row starts again.
clock+=600;frame();st=r.journeyDance();r.S.wx=st.target.x+500;clock+=.125*16*1000*1.5+10;frame();assert.equal(r.journeyDance().fallen,1);assert.equal(r.journeyDance().row,0);
clock+=700;frame();st=r.journeyDance();r.S.wx=st.target.x;r.S.wy=st.target.y;r.journeyGamePulse(true);assert.equal(r.journeyDance().points,35,'a new row starts at ten');
frame();assert(r.S.journey.dance.hinted);timers.splice(0).forEach(f=>f());assert(!toasts.some(t=>/círculo/.test(t)),'the Journey has no lines (plan H5)');
// Full bar: no more circles; the eye comes beside the cube; a pulse on time closes it, once.
r.S.journey.dance.points=DANCE_GOAL;frame();st=r.journeyDance();assert(st.eye&&!st.target);timers.splice(0).forEach(f=>f());assert(!toasts.some(t=>/ojo de la tormenta/.test(t)),'the Journey has no lines (plan H5)');
assert.equal(r.journeyGamePulse(false),'miss');assert.deepEqual(done,[]);assert.equal(r.journeyGamePulse(true),'close');assert.deepEqual(done,['tormenta']);
assert(draws.includes('arc'));
performance.now=realNow;
console.log('PASS journey dance: circles by hash near the cube, only inside and on time the bolt goes back up, returns in a row worth more, a missed bolt falls and resets the row, the full bar brings the eye and a pulse on time closes it once');
