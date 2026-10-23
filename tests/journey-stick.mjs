import assert from 'node:assert/strict';
import {STICK_START,STICK_TARGET,STICK_CELL,STICK_KINDS,cellItem,canStick,grow,stickProgress,cubeScale,normalizeStick,initialize} from '../src/journey-stick.js';
// Places come from hashes of the cell: the same map for everyone, and about seven cells in ten hold something.
let found=0;const kinds={};for(let i=0;i<40;i++)for(let j=0;j<40;j++){const it=cellItem(i,j);if(!it)continue;found++;kinds[it.kind]=(kinds[it.kind]||0)+1;assert.deepEqual(it,cellItem(i,j));assert(it.x>=i*STICK_CELL&&it.x<(i+1)*STICK_CELL&&it.y>=j*STICK_CELL&&it.y<(j+1)*STICK_CELL);}
assert(found>900&&found<1350,'about seven in ten: '+found);assert(STICK_KINDS.every(k=>kinds[k.id]>0),'every kind appears');assert(kinds.mota>kinds.cometa*4,'small things are common');
// Only things up to half your size stick; you grow by half of what sticks; the cube is drawn bigger as it grows.
assert(canStick(1,STICK_START)&&!canStick(2,STICK_START)&&canStick(2,4)&&!canStick(8,15)&&canStick(8,16));
assert.equal(grow(3,2),4);assert.equal(grow(STICK_TARGET*1.5,8),STICK_TARGET*1.5);
assert.equal(stickProgress(STICK_START),0);assert.equal(stickProgress(STICK_TARGET),1);assert.equal(stickProgress(0),0);
assert.equal(cubeScale(STICK_START),1);assert(cubeScale(STICK_TARGET)>3);assert.equal(cubeScale(1e6),3.2);
// Saves: bad values return to the start, the list of taken things is bounded, nothing else is lost.
assert.deepEqual(normalizeStick(null),{size:STICK_START,giant:null,gone:[],swallowed:false,hinted:false});
assert.deepEqual(normalizeStick({size:12.5,giant:{x:10.4,y:-3},gone:['1,2','bad',3,'-4,5'],swallowed:true,hinted:true}),{size:12.5,giant:{x:10,y:-3},gone:['1,2','-4,5'],swallowed:true,hinted:true});
assert.equal(normalizeStick({size:999}).size,STICK_TARGET*1.5);assert.equal(normalizeStick({gone:Array.from({length:900},(_,i)=>i+',0')}).gone.length,800);
// Runtime: on time near something small, it sticks and the cube grows; off time it bounces away; the giant waits.
let clock=0;const realNow=performance.now.bind(performance);performance.now=()=>clock;globalThis.setTimeout=f=>0;
const toasts=[],done=[];
const r={S:{wx:0,wy:0,sound:false,journey:{}},BIOMES:[{id:'llanura'}],biomeOfPos:()=>0,regionOfPos:()=>({}),journeyChapter:()=>({id:'llanura',done:{}}),journeyQuiet:()=>true,inWorld:()=>true,save:()=>true,toast:m=>toasts.push(m),journeyComplete:id=>done.push(id),MU:{journeyFloor:0,journeyCap:.4}};
initialize(r);
// Put the cube on a small thing.
let spot=null;for(let i=0;i<30&&!spot;i++)for(let j=0;j<30&&!spot;j++){const it=cellItem(i,j);if(it&&it.value===1)spot=it;}
r.S.wx=spot.x+5;r.S.wy=spot.y;
const near=r.journeyStick().near;assert(near.some(n=>n.id===spot.id&&n.stick));
assert.equal(r.journeyStickPulse(true),'stick');assert.equal(r.journeyStick().size,STICK_START+.5);assert(!r.journeyStick().near.some(n=>n.id===spot.id),'taken things are gone');assert(r.S.journey.stick.gone.includes(spot.id),'and saved');
// Off time: the nearest thing is pushed away, nothing sticks.
let other=null;for(let i=0;i<30&&!other;i++)for(let j=0;j<30&&!other;j++){const it=cellItem(i,j);if(it&&it.value===1&&it.id!==spot.id)other=it;}
r.S.wx=other.x;r.S.wy=other.y;const size=r.journeyStick().size;assert.equal(r.journeyStickPulse(false),'bounce');assert.equal(r.journeyStick().size,size);assert.equal(r.journeyStick().boings,1);
// A streak of three on time pulls up to three things at once.
r.S.journey.stick.size=30;const before=r.journeyStick().stuck;let pulls=0;for(let k=0;k<3;k++){const it=r.journeyStick().near;if(!it.length)break;r.journeyStickPulse(true);pulls++;}
assert(r.journeyStick().stuck>=before+pulls);
// Too big: a cometa does not stick to a tiny cube.
r.S.journey.stick.size=STICK_START;let comet=null;for(let i=0;i<60&&!comet;i++)for(let j=0;j<60&&!comet;j++){const it=cellItem(i,j);if(it&&it.kind==='cometa')comet=it;}
r.S.wx=comet.x;r.S.wy=comet.y;const onlyComet=r.journeyStick().near.every(n=>n.value>STICK_START*.5);if(onlyComet)assert.equal(r.journeyStickPulse(true),'too-big');
// Draw: things, the giant and the cube are drawn, and the hint is told once.
const draws=[];const ctx=new Proxy({},{get:(o,k)=>k in o?o[k]:()=>draws.push(k),set:(o,k,v)=>{o[k]=v;return true;}});
r.drawJourneyStick(ctx,390,844,0);r.drawJourneyStick(ctx,390,844,16);assert(draws.includes('arc')&&draws.includes('fillRect'));assert(r.S.journey.stick.hinted);const g=r.journeyStick().giant;assert(g,'the giant is placed');
// Touching the giant while small: pushed back. At full size: swallowed, the chapter ends once.
clock=1000;r.S.wx=g.x;r.S.wy=g.y;r.drawJourneyStick(ctx,390,844,32);assert(Math.hypot(r.S.wx-g.x,r.S.wy-g.y)>50,'pushed back');assert.deepEqual(done,[]);
r.S.journey.stick.size=STICK_TARGET;r.S.wx=g.x;r.S.wy=g.y;r.drawJourneyStick(ctx,390,844,48);assert.deepEqual(done,['llanura']);assert(r.journeyStick().swallowed);r.drawJourneyStick(ctx,390,844,64);assert.deepEqual(done,['llanura'],'once');
assert(r.MU.journeyFloor>=.8,'the music has grown with the cube');assert.equal(r.cubeGrowth()>3,true);
// Outside the Llanura chapter it does nothing.
r.journeyChapter=()=>({id:'lago',done:{}});assert.equal(r.journeyStickPulse(true),null);assert.equal(r.cubeGrowth(),1);
performance.now=realNow;
console.log('PASS journey stick: things placed by cell hash, only half your size sticks, you grow by half, off time bounces, streaks pull three, saves bounded, the giant pushes back until you are big and is swallowed once');
