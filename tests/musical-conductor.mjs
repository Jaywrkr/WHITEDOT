import assert from 'node:assert/strict';
import {createMusicalConductor,consonantPitch,fitRegister} from '../src/musical-conductor.js';
const a={key:'a',scale:[0,2,3,5,7,8,10]},b={key:'b',scale:[0,2,4,5,7,9,11]},c=createMusicalConductor();
c.remember(1,0,a,0,.125,0,[57,60,64]);c.remember(1.125,1,a,0,.125,0,[57,60,64]);
assert.equal(c.align(1.04,.95),1);assert.equal(c.align(1.04,1.03),1.125);
assert.equal(c.align(1.126,1),1.126,'preserve scheduled microtiming');
c.remember(1.25,2,b,3,.1,0,[60,64,67]);assert.equal(c.at(1.24).region,a);assert.equal(c.at(1.26).region,b);
assert.equal(c.align(1.345,1.3),1.345);assert.equal(c.align(1.39,1.3),1.35,'tempo extrapolation uses the new sixteenth');
const swing=createMusicalConductor();swing.remember(2,0,a,0,.125,.2,[57,60,64]);assert.equal(swing.align(2.13,2),2.15);
assert.equal(consonantPitch(61,[60,64,67],45,69),60);assert.equal(fitRegister(81,45,67),57);
for(let i=0;i<100;i++)c.remember(3+i*.125,i,a,0,.125,0,[57,60,64]);assert.equal(c.size,48);c.clear();assert.equal(c.size,0);assert.equal(c.at(0),null);
// Real source routing adopts the active harmony; its identity still comes from its territory.
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {initialize as voices} from '../src/voices.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const main={...r.regionOfPos(900,900),key:'conductor-main',trOff:0,scale:[0,2,4,5,7,9,11]},other={...main,key:'conductor-source',trOff:5,scale:[0,2,3,5,7,8,10]};
const notes=[],frame={region:main,degree:0,chords:[57,61,64],step:0,time:1,six:.125};
Object.assign(r,{ac:{},MU:{deg:4},SIX:.125,vel:v=>v,musicalTime:()=>1,musicalFrame:()=>frame,hookInst:(id,n,t)=>notes.push({n,t}),bassInst:(id,n,t)=>notes.push({n,t})});
for(const id of ['kick','conga','wood','rim','shaker','tom','guiro','timbale','clap','hatHit','snare'])r[id]=()=>{};voices(r);
for(let i=0;i<24;i++)r.playVoice('reliquia',i,1.04,other,false,.5,{id:'conductor:'+i});
assert(notes.length>0);assert(notes.every(n=>n.t===1&&frame.chords.some(c=>((c-n.n)%12+12)%12===0)),'border sources must support the current chord, regardless of source key');
console.log('PASS shared source clock, tempo change, swing, harmonic boundary, strong-beat consonance, register and bounded frame history');

// A pet on the new territory still accompanies the harmony actually audible at its onset.
import {initialize as pet} from '../src/pet.js';import {createPet} from '../src/pet-model.js';
globalThis.document={hidden:false,querySelector:()=>null};
for(const species of ['golondrina','grulla','luciernaga'])for(const composed of [false,true]){
 const cues=[],played=[],heard={region:main,transposition:2,chords:[59,62,66]},q={S:{pet:createPet(species,12),wx:0,wy:0,sound:true},ACH:[],BIOMES:r.BIOMES,ac:{state:'running'},SIX:.125,inWorld:()=>true,regionOfPos:()=>other,musicalTime:t=>composed?1.15:t,musicalFrame:()=>composed?heard:null,hookInst:(id,n,t)=>played.push({n,t}),bassInst:(id,n,t)=>played.push({n,t}),petNoteCue:n=>cues.push(n)};
 for(const id of ['wood','conga','rim'])q[id]=()=>{};
 pet(q);q.petHear({degree:1,time:.5});q.petStep(0,0,1);q.petStep(2,0,1.04);
 assert.equal(cues.length,1);assert.equal(cues[0].time,composed?1.15:1.04);
 if(species!=='luciernaga'&&composed)assert(heard.chords.some(n=>(n-played[0].n)%12===0),'a companion must not use the neighboring destination key');
 if(species==='grulla')assert(cues[0].note>=36&&cues[0].note<=52);
}
console.log('PASS companion responses use the audible territory clock/chord across borders; explicit legacy playback and species registers remain');
