import assert from 'node:assert/strict';
import {initialize as games} from '../src/journey-games.js';
import {LASSO_GOAL,LASSO_CELL,cellFireflies,lassoValue,lassoProgress,loopArea,insideLoop,closedLoop,normalizeLasso,initialize} from '../src/journey-lasso.js';
// Fireflies come in groups by cell hash: one cell in two, three to six each, close to their centre.
let groups=0;for(let i=0;i<40;i++)for(let j=0;j<40;j++){const g=cellFireflies(i,j);if(!g.length)continue;groups++;assert.deepEqual(g,cellFireflies(i,j));assert(g.length>=3&&g.length<=6);}
assert(groups>650&&groups<950,'about half: '+groups);
assert.deepEqual([1,3,5,8].map(lassoValue),[1,3,3,3]);assert.equal(lassoProgress(LASSO_GOAL),1);
// Geometry: a square of side 100 has area 10000; its centre is inside, a point beyond is not.
const sq=[{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:0,y:100}];assert.equal(loopArea(sq),10000);assert(insideLoop(sq,50,50));assert(!insideLoop(sq,150,50));
// A trail closes only when the cube comes back near a point at least half a second old and the loop is wide.
const ring=Array.from({length:30},(_,i)=>({x:Math.cos(i/30*6.283)*80,y:Math.sin(i/30*6.283)*80,at:i*100}));
assert(closedLoop(ring,{x:80,y:5},3000),'back at the start');assert.equal(closedLoop(ring,{x:300,y:0},3000),null,'far away');
assert.equal(closedLoop([{x:0,y:0,at:0},{x:10,y:0,at:100}],{x:5,y:0},3000),null,'a line has no area');
assert.deepEqual(normalizeLasso(null),{points:0,caught:[],friend:null,joined:false,hinted:false,best:0});
// Runtime: walk around a group, pulse on time: all inside are caught, each worth as many as were caught.
let clock=0;const realNow=performance.now.bind(performance);performance.now=()=>clock;const timers=[];globalThis.setTimeout=f=>{timers.push(f);return 0;};
const toasts=[],done=[];
const r={S:{wx:0,wy:0,sound:false,journey:{}},BIOMES:[{id:'bosque'},{id:'lago'}],biomeOfPos:()=>0,journeyChapter:()=>({id:'bosque',done:{}}),journeyQuiet:()=>true,inWorld:()=>true,save:()=>true,toast:m=>toasts.push(m),journeyComplete:id=>done.push(id),MU:{journeyFloor:0,journeyCap:.4}};
games(r);initialize(r);
const draws=[];const ctx=new Proxy({},{get:(o,k)=>k in o?o[k]:()=>draws.push(k),set:(o,k,v)=>{o[k]=v;return true;}});
const frame=()=>{r.drawJourneyGamesUnder(ctx,390,844,clock);r.drawJourneyGames(ctx,390,844,clock);};
let group=null;for(let i=2;i<30&&!group;i++)for(let j=2;j<30&&!group;j++){const g=cellFireflies(i,j);if(g.length>=4)group=g;}
const cx=group.reduce((a,f)=>a+f.x,0)/group.length,cy=group.reduce((a,f)=>a+f.y,0)/group.length;
const walk=(fn,steps)=>{for(let i=0;i<=steps;i++){const p=fn(i/steps);r.S.wx=p.x;r.S.wy=p.y;clock+=40;frame();}};
// Pulse on time with an open trail: nothing.
walk(k=>({x:cx-300+k*100,y:cy-300}),10);assert.equal(r.journeyGamePulse(true),'open');assert.equal(r.journeyLasso().points,0);
// Around the group, then off time: nothing; on time: caught.
walk(k=>({x:cx+Math.cos(k*6.283)*110,y:cy+Math.sin(k*6.283)*110}),60);
const st=r.journeyLasso();assert(st.closed&&st.inside===group.length,JSON.stringify(st));
assert.equal(r.journeyGamePulse(false),'miss');assert.equal(r.journeyLasso().points,0);
assert.equal(r.journeyGamePulse(true),'catch');const n=group.length;assert.equal(r.journeyLasso().points,lassoValue(n)*n);assert.equal(r.journeyLasso().caught,n);assert.equal(r.journeyLasso().trail,0,'the trail starts again');
// Caught fireflies are gone: the same circle again catches nothing.
walk(k=>({x:cx+Math.cos(k*6.283)*110,y:cy+Math.sin(k*6.283)*110}),60);assert.notEqual(r.journeyGamePulse(true),'catch');
frame();assert(r.S.journey.lasso.hinted);timers.splice(0).forEach(f=>f());assert(!toasts.some(t=>/luciérnagas/.test(t)),'the Journey has no lines (plan H5)');
// Full bar: the creature comes beside the cube and joins with a pulse on time; it becomes the companion.
r.S.journey.lasso.points=LASSO_GOAL;frame();assert(r.journeyLasso().friend);timers.splice(0).forEach(f=>f());assert(!toasts.some(t=>/criatura/.test(t)),'the Journey has no lines (plan H5)');
assert.equal(r.journeyGamePulse(false),'miss');assert.deepEqual(done,[]);assert.equal(r.journeyGamePulse(true),'join');assert.deepEqual(done,['bosque']);assert.equal(r.S.journey.moments.companion,true);
assert(draws.includes('arc')&&draws.includes('lineTo'));
performance.now=realNow;
console.log('PASS journey lasso: fireflies in groups by cell hash, the trail closes only around a wide loop, off time nothing, a pulse on time catches all inside worth their count each, the full bar brings the creature that joins as companion with a pulse on time');
