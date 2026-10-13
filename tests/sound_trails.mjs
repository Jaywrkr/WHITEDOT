import assert from 'node:assert/strict';
import {createSoundTrail,normalizeSoundTrails,captureTrailTap} from '../src/sound-trail-model.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const rhythms=new Set();let count=0;for(let x=-20;x<20;x++)for(let y=-20;y<20;y++){
 const region=r.regionOfPos((x+.5)*3600,(y+.5)*3600),t=createSoundTrail(region,3600,r.seedOf,r.rng);if(!t)continue;count++;rhythms.add(t.rhythm.join());
 assert.deepEqual(t,createSoundTrail(region,3600,r.seedOf,r.rng));assert.equal(t.nodes.length,3);assert(!region.sea);
 for(const node of t.nodes){assert(node.x>x*3600&&node.x<(x+1)*3600);assert(node.y>y*3600&&node.y<(y+1)*3600);}
 assert(Math.hypot(t.nodes[0].x-t.nodes[1].x,t.nodes[0].y-t.nodes[1].y)>200);
}
assert.equal(rhythms.size,4);assert(count>35&&count<130,'rarity escaped bounds');assert.equal(createSoundTrail({key:'0,0',sea:true},3600,r.seedOf,r.rng,true),null);
const t=createSoundTrail(r.regionOfPos(900,900),3600,r.seedOf,r.rng,true);assert(t);
let s=captureTrailTap(null,10,.12);s=captureTrailTap(s,10.48,.2);s=captureTrailTap(s,11.2,.2);assert.equal(s.count,3,'tempo should be captured on first tap');
s=captureTrailTap(null,10,.12);s=captureTrailTap(s,10.1,.12);assert.equal(s.count,1,'rapid taps must not solve rhythm');s=captureTrailTap(s,10.58,.12);assert.equal(s.count,2);assert.equal(captureTrailTap(s,NaN,.12),s);
const saved=normalizeSoundTrails({'trail:0,0':{stage:2,seen:true},'trail:1,0':{stage:6},bad:{stage:1}});assert.deepEqual(saved,{'trail:0,0':{stage:2,seen:true}});assert.deepEqual(saved,normalizeSoundTrails(JSON.parse(JSON.stringify(saved))));
const many=Object.fromEntries(Array.from({length:100},(_,i)=>['trail:'+i+',0',{stage:3,seen:true}]));assert.equal(Object.keys(normalizeSoundTrails(many)).length,64);
console.log(`PASS: ${count} rare deterministic trails, three spaced local nodes, relative rhythm with tempo capture, retries and bounded saved stages`);

const alternate=[0,2,7];let answer=captureTrailTap(null,20,.1,alternate);answer=captureTrailTap(answer,20.2,.1,alternate);answer=captureTrailTap(answer,20.7,.1,alternate);assert.equal(answer.count,3);assert.deepEqual(answer.rhythm,alternate);
