import assert from 'node:assert/strict';
import {FUSION,fusionOf,snapAxis,createClock,blend,createBorder} from '../src/superbiome-fusion.js';
import {FAMILIES} from '../src/superbiomes.js';
import {initialize} from '../src/universe-layers.js';
// Every family has its motion; calm music runs slow and fast music fast.
assert.deepEqual(Object.keys(FUSION).sort(),FAMILIES.map(f=>f.id).sort());
assert(FUSION.ambient.speed<FUSION.dub.speed&&FUSION.dub.speed<FUSION.house.speed&&FUSION.house.speed<FUSION.techno.speed&&FUSION.techno.speed<FUSION.dnb.speed);
for(const f of Object.values(FUSION))for(const b of [0,.25,.5,.75,1]){const v=f.beat(b);assert(v>=0&&v<=1,v);}
assert(FUSION.ambient.beat(1)<.5,'ambient barely pulses');assert(FUSION.house.beat(.25)>FUSION.techno.beat(.25),'house pumps, techno is sharp');assert.equal(FUSION.electro.beat(.4),0);
assert.equal(fusionOf('nada').speed,1);assert.equal(snapAxis(.3),0);assert.equal(snapAxis(1.4),Math.PI/2);
// The clock: the frame time at speed 1, slower or faster with the family, never jumping when the family changes.
const clock=createClock();assert.equal(clock(1000),1000);assert.equal(clock(1100),1100);assert.equal(clock(1200,.5),1150);assert.equal(clock(1300,2),1350);assert.equal(clock(1250,1),1350,'never runs back');
// Borders: a mix of two motions, and a change that waits for the downbeat and mixes over one bar.
const half=blend(FUSION.ambient,FUSION.dnb,.5);assert.equal(half.speed,(FUSION.ambient.speed+FUSION.dnb.speed)/2);assert.equal(half.burst,3);assert.equal(blend(FUSION.ambient,FUSION.dnb,0),FUSION.ambient);
const step=createBorder();assert.equal(step('house',.1,0,2000).family,'house');assert.equal(step('dub',.3,100,2000).k,1,'mid-bar: still house');assert.equal(step('dub',.6,200,2000).family,'house');assert.equal(step.state().pending,'dub');
let m=step('dub',.02,300,2000);assert.equal(m.family,'dub');assert.equal(m.k,0,'the downbeat starts the mix');m=step('dub',.5,1300,2000);assert(m.k>.4&&m.k<.6);assert(m.fx.speed<FUSION.house.speed&&m.fx.speed>FUSION.dub.speed);
m=step('dub',.03,2400,2000);assert.equal(m.k,1);assert.equal(m.fx,FUSION.dub);assert.equal(step.state().mixing,false);
step('house',.5,2500,2000);step('dub',.7,2600,2000);assert.equal(step.state().pending,null,'going back before the downbeat cancels the change');
// Runtime: the layers follow the family the music plays.
let now=0;const realNow=performance.now.bind(performance);performance.now=()=>now;globalThis.document={querySelectorAll:()=>[]};
const calls=[];const c=new Proxy({},{get:(o,k)=>k in o?o[k]:(...a)=>calls.push(k),set:(o,k,v)=>{o[k]=v;return true;}});
const ids=['llanura','bosque','lago','ruinas','jardin','dunas','cristales','faros','tormenta','cueva','vacio'];let family='house';
const genre={house:'deep',dub:'dub',disco:'nudisco',techno:'detroit'};const r={S:{wx:450,wy:450,sound:false},BIOMES:ids.map(id=>({id})),biomeOfPos:()=>0,WCH:900,cx:c,W:390,H:844,camX:450,camY:450,MU:{speed:0,get dnaA(){return {genre:genre[family]};}},inWorld:()=>true};
initialize(r);const frame=()=>{now+=300;calls.length=0;r.drawUniverseLayers(now,.5);return r.universeLayers();};
// Without beat times the bar is two seconds: settle runs frames until the change has landed and fully mixed.
const settle=()=>{let s;for(let i=0;i<40;i++){s=frame();if(s.family===family&&s.familyMix===1&&i>8)break;}return s;};
const house=settle();assert.equal(house.family,'house');
family='dub';const dub=settle();assert.equal(dub.family,'dub');assert(dub.cells>house.cells,'dub draws an echo of the middle layer');
family='disco';settle();frame();assert(calls.includes('rotate'),'disco sways');
family='techno';settle();frame();assert(!calls.includes('rotate'));
r.S.reducedMotion=true;family='disco';settle();frame();assert(!calls.includes('rotate'),'reduced motion: no sway');
performance.now=realNow;
console.log('PASS superbiome fusion: ten families with their own speed and beat, a clock that never jumps, changes on the downbeat mixed over a bar, dub echo, disco sway, straight techno, calm with reduced motion');
