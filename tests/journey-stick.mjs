import assert from 'node:assert/strict';
import {STICK_GOAL,STICK_CELL,STICK_KINDS,cellItem,stickProgress,cubeScale,normalizeStick,initialize} from '../src/journey-stick.js';
// Places come from hashes of the cell: the same map for everyone, and about seven cells in ten hold something.
let found=0;const kinds={};for(let i=0;i<40;i++)for(let j=0;j<40;j++){const it=cellItem(i,j);if(!it)continue;found++;kinds[it.kind]=(kinds[it.kind]||0)+1;assert.deepEqual(it,cellItem(i,j));assert(it.x>=i*STICK_CELL&&it.x<(i+1)*STICK_CELL&&it.y>=j*STICK_CELL&&it.y<(j+1)*STICK_CELL);}
assert(found>900&&found<1350,'about seven in ten: '+found);assert(STICK_KINDS.every(k=>kinds[k.id]>0),'every kind appears');
// Small things are many and fill a little; big ones are few and fill a lot (decision of 23 October).
assert.deepEqual(STICK_KINDS.map(k=>k.value),[1,3,8,20]);assert(kinds.mota>kinds.chispa&&kinds.chispa>kinds.piedra&&kinds.piedra>kinds.cometa);
assert.equal(stickProgress(0),0);assert.equal(stickProgress(STICK_GOAL),1);assert.equal(stickProgress(STICK_GOAL*2),1);
assert.equal(cubeScale(0),1);assert(cubeScale(STICK_GOAL)>3);
// Saves: bad values return to the start, the first prototype's size becomes points, the list of taken things is bounded.
assert.deepEqual(normalizeStick(null),{points:0,cloud:null,gone:[],swallowed:false,hinted:false});
assert.deepEqual(normalizeStick({points:50.5,cloud:{x:10.4,y:-3},gone:['1,2','bad',3,'-4,5'],swallowed:true,hinted:true}),{points:50.5,cloud:{x:10,y:-3},gone:['1,2','-4,5'],swallowed:true,hinted:true});
assert.equal(normalizeStick({size:40}).points,STICK_GOAL);assert.equal(normalizeStick({size:3}).points,0);assert.equal(normalizeStick({points:999}).points,STICK_GOAL);
assert.equal(normalizeStick({gone:Array.from({length:900},(_,i)=>i+',0')}).gone.length,800);
// Runtime: on time near something it sticks and fills the bar by its value; off time nothing moves.
let clock=0;const realNow=performance.now.bind(performance);performance.now=()=>clock;const timers=[];globalThis.setTimeout=f=>{timers.push(f);return 0;};
const toasts=[],done=[];
const r={S:{wx:0,wy:0,sound:false,journey:{}},BIOMES:[{id:'llanura'}],biomeOfPos:()=>0,regionOfPos:()=>({}),journeyChapter:()=>({id:'llanura',done:{}}),journeyQuiet:()=>true,inWorld:()=>true,save:()=>true,toast:m=>toasts.push(m),journeyComplete:id=>done.push(id),MU:{journeyFloor:0,journeyCap:.4}};
initialize(r);
const find=kind=>{for(let i=0;i<80;i++)for(let j=0;j<80;j++){const it=cellItem(i,j);if(it&&it.kind===kind&&!r.S.journey.stick?.gone?.includes(it.id))return it;}};
let comet=find('cometa');r.S.wx=comet.x+3;r.S.wy=comet.y;
const before=JSON.stringify(r.journeyStick().near);assert.equal(r.journeyStickPulse(false),'miss');assert.equal(JSON.stringify(r.journeyStick().near),before,'off time: everything stays');assert.equal(r.journeyStick().points,0);
assert.equal(r.journeyStickPulse(true),'stick');assert.equal(r.journeyStick().points,20,'a comet fills twenty, even on a tiny cube');assert(!r.journeyStick().near.some(n=>n.id===comet.id),'taken things are gone');assert(r.S.journey.stick.gone.includes(comet.id),'and saved');
let mota=find('mota');r.S.wx=mota.x;r.S.wy=mota.y;const p0=r.journeyStick().points;r.journeyStickPulse(true);assert(r.journeyStick().points>p0);
// Far from everything a pulse on time does nothing; there is no cloud before the bar is full.
r.BIOMES=[{id:'llanura'},{id:'lago'}];r.biomeOfPos=()=>1;assert.equal(r.journeyStickPulse(true),null,'nothing to stick outside the Llanura');r.biomeOfPos=()=>0;assert.equal(r.journeyStick().cloud,null);
// Draw: the place dims, things shine, the hint is told once.
const draws=[];const ctx=new Proxy({},{get:(o,k)=>k in o?o[k]:()=>draws.push(k),set:(o,k,v)=>{o[k]=v;return true;}});
r.S.wx=mota.x;r.S.wy=mota.y;r.drawJourneyStickUnder(ctx,390,844,0);r.drawJourneyStick(ctx,390,844,16);assert(draws.includes('arc')&&draws.includes('fillRect'));assert(r.S.journey.stick.hinted);timers.splice(0).forEach(f=>f());assert(toasts.some(t=>/brilla/.test(t)));
// Full bar: the gold cloud comes beside the cube and follows it; off time it waits; one pulse on time swallows it, once.
r.S.journey.stick.points=STICK_GOAL;r.drawJourneyStickUnder(ctx,390,844,32);const c=r.journeyStick().cloud;assert(c&&Math.hypot(c.x-r.S.wx,c.y-r.S.wy)<100,'beside the cube');timers.splice(0).forEach(f=>f());assert(toasts.some(t=>/nube dorada/.test(t)));
r.S.wx+=500;for(let i=0;i<120;i++)r.drawJourneyStickUnder(ctx,390,844,40+i);const c2=r.journeyStick().cloud;assert(Math.hypot(c2.x-r.S.wx,c2.y-r.S.wy)<100,'it follows');
assert.equal(r.journeyStickPulse(false),'miss');assert.deepEqual(done,[]);
assert.equal(r.journeyStickPulse(true),'swallow');assert.deepEqual(done,['llanura']);assert(r.journeyStick().swallowed);
assert(r.MU.journeyFloor>=.8,'the music has grown with the bar');
// Outside the Llanura chapter it does nothing.
r.journeyChapter=()=>({id:'lago',done:{}});assert.equal(r.journeyStickPulse(true),null);assert.equal(r.cubeGrowth(),1);
performance.now=realNow;
console.log('PASS journey stick: things placed by cell hash, many small and few big filling the bar by value, off time nothing moves, the full bar brings the gold cloud beside the cube and one pulse on time swallows it once');
