import assert from 'node:assert/strict';
import {territoryNucleus,territoryField,createTerritoryJourney,approachJourneyTempo,windLevel} from '../src/territory-journey.js';
import {distantDirections} from '../src/distant-colors.js';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};data(r);progress(r);world(r);const size=r.REG*r.WCH;
for(const [x,y]of [[0,0],[-2,3],[10,-9]]){
 const p=territoryNucleus(x,y,size,r.seedOf),before=JSON.stringify(r.regionOfPos(p.x,p.y));
 assert.deepEqual(territoryNucleus(x,y,size,r.seedOf),p);
 assert(p.x>x*size&&p.x<(x+1)*size&&p.y>y*size&&p.y<(y+1)*size);
 const field=territoryField(p.x,p.y,size,r.regionOfPos,r.seedOf);
 assert.equal(field.primary.key,x+','+y);assert.equal(field.mix,0);assert.equal(field.core,1);
 assert.equal(JSON.stringify(r.regionOfPos(p.x,p.y)),before,'playback geography does not mutate terrain');
}
const A={key:'A'},B={key:'B'},C={key:'C'},journey=createTerritoryJourney();
const field=(a,b=null,mix=0)=>({primary:a,secondary:b,mix,core:.8});
let previous=journey.advance(field(A),0),lastPrimary=0,firstGuest=null,swaps=0;
for(let bar=1;bar<40;bar++){
 const desired=bar<19?field(B,A,.15):field(C,B,.1),next=journey.advance(desired,bar);
 if(next.secondary?.key!==previous.secondary?.key&&!next.swap){assert.equal(bar%4,0);firstGuest=bar;}
 if(next.primary.key!==previous.primary.key){assert.equal(bar%8,0);assert(bar-lastPrimary>=8);assert(next.swap);assert(bar-firstGuest>=4);assert.equal(next.from,1-previous.to);lastPrimary=bar;swaps++;}
 else assert.equal(next.from,previous.to,'bar weights join without a gain discontinuity');
 assert(Math.abs(next.to-next.from)<=.125+1e-8);assert(next.to>=0&&next.to<=1);
 assert.equal(journey.advance(desired,bar).to,next.to,'repeated scheduling does not accelerate a fade');previous=next;
}
assert(swaps>=2);assert.equal(previous.primary.key,'C');
const flutter=createTerritoryJourney();flutter.advance(field(A),0);let primary=A.key,changedAt=0;
for(let bar=1;bar<128;bar++){
 const next=flutter.advance(field(bar%2?B:A,bar%2?A:B,.49),bar);
 if(next.primary.key!==primary){assert(bar-changedAt>=8);primary=next.primary.key;changedAt=bar;}
}
let bpm=140;for(let bar=0;bar<32;bar++){const next=approachJourneyTempo(bpm,92);assert(Math.abs(next-bpm)<=2);bpm=next;}assert.equal(bpm,92);
assert(windLevel(1,.2)<=.0012);assert(windLevel(1,.8)<windLevel(1,.2));assert.equal(windLevel(Infinity),0);
console.log('PASS deterministic off-center nuclei, intact terrain, complete phrase ownership, radio swaps without gain jumps, stable border jitter and gentle tempo/wind');

const signals=distantDirections(size*.5,size*.5,size,390,844,r.regionOfPos,r.seedOf);assert(signals.length<=2);assert(signals.length>0);for(const signal of signals){const region=r.regionOfPos(signal.target.x,signal.target.y);assert.equal(region.key,signal.key);assert(!region.sea);assert(signal.x<60||signal.x>330||signal.y<60||signal.y>784,'directional blobs stay at the edges');assert(/^#[0-9a-f]{6}$/i.test(signal.ink));}
