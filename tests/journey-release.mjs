import assert from 'node:assert/strict';
import {initialize as games} from '../src/journey-games.js';
import {RELEASE_MIN,RELEASE_MAX,releaseTotal,releaseProgress,releaseScale,starSpot,normalizeRelease,initialize} from '../src/journey-release.js';
// The cube carries what stuck in the Llanura, between twelve and twenty-four; it is bigger while full.
assert.deepEqual([undefined,3,17,90].map(releaseTotal),[RELEASE_MIN,RELEASE_MIN,17,RELEASE_MAX]);
assert.equal(releaseProgress(6,12),.5);assert.equal(releaseProgress(1,0),0);assert(releaseScale(0,12)>2);assert.equal(releaseScale(12,12),1);
for(let n=0;n<30;n++){const p=starSpot(n,{x:0,y:0});assert(p.y<0,'stars rise');assert.deepEqual(p,starSpot(n,{x:0,y:0}));}
assert.deepEqual(normalizeRelease(null),{total:0,released:0,stars:[],light:null,lit:false,hinted:false,spaceHint:false});
// With the sound off any pulse counts as the 1.

assert.equal(normalizeRelease({total:12,released:40}).released,12);
// Runtime: the load comes from the Llanura; on time one thing becomes a star; off time nothing.
let clock=0;const realNow=performance.now.bind(performance);performance.now=()=>clock;const timers=[];globalThis.setTimeout=f=>{timers.push(f);return 0;};
const toasts=[],done=[];
const r={S:{wx:0,wy:0,sound:false,journey:{stick:{gone:Array.from({length:15},(_,i)=>i+',0')}}},BIOMES:[{id:'vacio'}],biomeOfPos:()=>0,journeyChapter:()=>({id:'vacio',done:{}}),journeyQuiet:()=>true,inWorld:()=>true,save:()=>true,toast:m=>toasts.push(m),journeyComplete:id=>done.push(id)};
games(r);initialize(r);
const draws=[];const ctx=new Proxy({},{get:(o,k)=>k in o?o[k]:()=>draws.push(k),set:(o,k,v)=>{o[k]=v;return true;}});
const frame=()=>{r.drawJourneyGamesUnder(ctx,390,844,clock);r.drawJourneyGames(ctx,390,844,clock);};
frame();let st=r.journeyRelease();assert.equal(st.total,15,'what stuck in the Llanura');assert(r.cubeGrowth()>2,'the cube arrives carrying it');
assert.equal(r.journeyGamePulse(false),'miss');assert.equal(r.journeyRelease().released,0);
assert.equal(r.journeyGamePulse(true,{step:4}),'wait','on time but not on the 1');assert.equal(r.journeyRelease().released,0);
assert.equal(r.journeyGamePulse(true,{step:0}),'release');st=r.journeyRelease();assert.equal(st.released,1);assert.equal(st.stars,1);assert(r.S.journey.release.stars[0].y<0);
assert.equal(r.journeyGamePulse(true,{step:0}),'crowded','each star wants its own sky');assert.equal(r.journeyRelease().released,1);
for(let i=1;i<15;i++){r.S.wx+=400;assert.equal(r.journeyGamePulse(true,{step:0}),'release');}st=r.journeyRelease();assert.equal(st.released,15);assert.equal(r.cubeGrowth(),1,'tiny again');assert(st.light,'its gold light comes');
frame();timers.splice(0).forEach(f=>f());assert(toasts.some(t=>/estrella/.test(t))&&toasts.some(t=>/Tu luz/.test(t)));
assert.equal(r.journeyGamePulse(false),'miss');assert.deepEqual(done,[]);assert.equal(r.journeyGamePulse(true,{step:8}),'light','the light closes on any beat');assert.deepEqual(done,['vacio']);
assert(draws.includes('arc')&&draws.includes('fillRect'));
// Without a Llanura game the cube still carries twelve.
const r2={...r,S:{wx:0,wy:0,sound:false,journey:{}}};games(r2);initialize(r2);assert.equal(r2.journeyRelease().total,RELEASE_MIN);
performance.now=realNow;
console.log('PASS journey release: the cube carries what stuck in the Llanura (12–24), off time nothing, each pulse on time lets one go as a rising star, the cube shrinks to its size, its gold light comes and a pulse on time ends the Vacío once');
