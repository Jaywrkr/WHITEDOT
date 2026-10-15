import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';
import {initialize as progress} from '../src/progress.js';
import {initialize as world} from '../src/world.js';
import {MUSIC_DIRECTIONS,musicDirection,directedLeads,productionSpace,createProductionRooms} from '../src/music-direction.js';
import {INSTRUMENT_SPECS} from '../src/instruments.js';
import {createRadio} from '../src/radio.js';
import {effectProfile} from '../src/effects.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
for(const p of Object.values(MUSIC_DIRECTIONS)){
 for(const id of p.leads)assert(INSTRUMENT_SPECS[id]||id==='clav',id);
 assert(p.room>0&&p.room<1);assert(p.feedback<=.43);
}
assert.notEqual(musicDirection('minimal').id,musicDirection('deep').id);
assert.notEqual(musicDirection('organic').id,musicDirection('robotic').id);
assert(productionSpace('ambient').space>.5);assert.equal(productionSpace('minimal').space,0);
assert.deepEqual(productionSpace('minimal',{still:300}),productionSpace('minimal',{still:0}),'waiting never increases echoes by itself');
assert(productionSpace('dub').echo>productionSpace('minimal').echo);
assert(productionSpace('minimal',{cave:true}).room<.3,'a cave does not turn every style into a huge reverb');
assert.equal(productionSpace('minimal',{canon:true}).feedback,.6,'explicit canon remains audible and bounded');
const base=r.regionOfPos(900,900),signatures=new Set();
for(const genre of Object.keys(r.GEN)){
 const d={...base,key:'direction:'+genre,genre,track:{...base.track}},before=JSON.stringify(d.track),radio=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true});
 const frame=radio.advance(d,0);assert(frame.direction);assert(frame.expression.decayScale>=.35&&frame.expression.decayScale<=2);assert(frame.labScore.leads.includes(frame.hookI));assert.equal(JSON.stringify(d.track),before,'native saved recipe stays untouched');
 signatures.add(frame.direction.id);
 const shared=radio.advance(d,4,{room:'room'});assert(!shared.direction&&!shared.labScore,'duets retain their agreed composition');
 if(musicDirection(genre).space<=.5)for(let i=0;i<32;i++)assert.notEqual(effectProfile('source:'+i,d,'lead',r.seedOf,r.rng).type,'space');
}
assert.equal(signatures.size,Object.keys(MUSIC_DIRECTIONS).length);assert(!directedLeads('minimal',['duskpad'],['graincloud']).includes('graincloud'));
const gains=[],convolvers=[],ac={createGain(){const n={gain:{value:0,setTargetAtTime(v,t){assert(Number.isFinite(v)&&t>=0);this.value=v;}},connect(target){return target;}};gains.push(n);return n;},createConvolver(){const n={connect(target){return target;}};convolvers.push(n);return n;}};
const bank=createProductionRooms(ac,seconds=>({seconds}),{});bank.connect({connect(){}});bank.set(0,0);assert.equal(gains[0].gain.value,1);assert.equal(gains[1].gain.value,0);bank.set(1,1);assert.equal(gains[0].gain.value,0);assert.equal(gains[1].gain.value,1);assert.deepEqual(convolvers.map(c=>c.buffer.seconds),[.32,3.2]);
console.log('PASS production characters across all 52 genres, purposeful room/echo/pad contrast, dry local effects, articulation bounds, preserved native recipes/duets and persistent room crossfade');
