import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {initialize as world} from '../src/world.js';
import {initialize as travel,arrivalCell,nextArrivalPlace,normalizePracticeTravel} from '../src/practice-travel.js';
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
const interval=globalThis.setInterval;globalThis.setInterval=()=>0;
const buttons={bJump:{},bJumpBack:{},mMenu:{}};globalThis.document={querySelector:()=>null};
function runtime(){const r={};data(r);progress(r);world(r);r.$=id=>buttons[id];r.MU={};r.waves=[];r.hud=()=>{};r.toast=()=>{};return r;}
try{
 const first=runtime();first.S.mode='world';first.S.help.mundo=true;first.S.todayLight=1;first.S.ach.kept='earned';first.save();
 const old={x:first.S.wx,y:first.S.wy,layer:first.S.layer||'superficie'};
 const next=runtime();travel(next);assert.notEqual(next.S.wx,old.x);assert.deepEqual(next.S.practiceTravel.previous,old);assert.equal(next.S.practiceTravel.arrivals,1);assert.equal(next.dailyArrival(),false,'daily entry cannot jump twice on one page');
 assert.equal(next.S.ach.kept,'earned');const at={x:next.S.wx,y:next.S.wy,layer:next.S.layer};
 const reopened=runtime();travel(reopened);assert.equal(reopened.S.practiceTravel.arrivals,2);assert.deepEqual(reopened.S.practiceTravel.previous,at);assert.notEqual(reopened.S.wx,at.x);
 assert.equal(reopened.returnPracticePlace(),true);assert.equal(reopened.S.wx,at.x);
 globalThis.location={search:'?addr=explicit'};const linked=runtime(),before=linked.S.wx;travel(linked);assert.equal(linked.S.wx,before,'explicit place is never replaced');
 delete globalThis.location;const consumed=runtime();consumed.arrivedByAddress=true;const consumedX=consumed.S.wx;travel(consumed);assert.equal(consumed.S.wx,consumedX,'consumed address still protects arrival');const stay=runtime();stay.S.arrivalMode='continue';const x=stay.S.wx;travel(stay);assert.notEqual(stay.S.wx,x,'legacy continue preference no longer overrides fresh automatic arrivals');
 const cells=new Set();for(let i=0;i<10000;i++){const p=arrivalCell(i),key=p.x+','+p.y;assert(!cells.has(key));cells.add(key);}
 const probe=runtime(),seen=new Set();let allocation=normalizePracticeTravel(null);for(let i=0;i<150;i++){const next=nextArrivalPlace(probe,allocation);assert(next);assert(!seen.has(next.point.region.key));seen.add(next.point.region.key);assert(!next.point.region.sea);allocation={...allocation,arrivalOrigin:next.origin,arrivalCursor:next.cursor};}
 console.log('PASS contrasting fresh visits, one arrival per document, exact return, earned progress, explicit destination, 10,000 unique allocation cells and 150 nonrepeating land arrivals');
}finally{globalThis.setInterval=interval;delete globalThis.location;}
