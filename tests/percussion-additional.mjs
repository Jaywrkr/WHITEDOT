import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as world} from '../src/world.js';import {initialize as progress} from '../src/progress.js';
import {NEW_PERCUSSION,RHYTHM_KINDS,RHYTHM_ELEMENTS,additionalRhythmElements,createRhythmElements,rhythmPattern,rhythmVoice} from '../src/percussion-model.js';
import {strikeProfile} from '../src/percussion-material.js';
import {initialize as boxes,magnetFollowers} from '../src/cajas.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};globalThis.document={hidden:false,querySelector:()=>null};
const r={};data(r);progress(r);world(r);assert.equal(Object.keys(NEW_PERCUSSION).length,6);assert.equal(RHYTHM_KINDS.length,8);
const found=new Set(),counts=[];
for(let x=-30;x<30;x++)for(let y=-15;y<15;y++){
 const d=r.regionOfPos(x*900+450,y*900+450),biome=r.BIOMES[d.z].id,base=createRhythmElements(x,y,900,d,r.seedOf,r.rng),old=JSON.stringify(base),list=additionalRhythmElements(x,y,900,d,biome,r.seedOf,r.rng,base);counts.push(list.length);assert.deepEqual(list,additionalRhythmElements(x,y,900,d,biome,r.seedOf,r.rng,base));assert.equal(JSON.stringify(base),old);assert(list.length<=1);assert(base.length+list.length<=3);
 for(const o of list){found.add(o.kind);assert(NEW_PERCUSSION[o.kind].affinity.includes(biome));assert(o.id.startsWith('rhythm:additional:v1:'));assert(base.every(b=>Math.hypot(b.x-o.x,b.y-o.y)>=110));}
}assert.equal(found.size,6);assert(counts.filter(n=>n===1).length>50&&counts.filter(n=>n===0).length>900);
const d=r.regionOfPos(900,900);assert.deepEqual(additionalRhythmElements(0,0,900,{...d,sea:true},'bosque',r.seedOf,r.rng),[]);
for(const k of Object.keys(NEW_PERCUSSION))for(const genre of Object.keys(r.GEN)){
 const v=rhythmVoice('rhythm:'+k+':4',{...d,genre},r.seedOf);assert.equal(v.role,'perc');assert(RHYTHM_ELEMENTS[k].voices.includes(v.instrument)||['wood','rim'].includes(v.instrument));const p=rhythmPattern(k,genre,3);assert(p.length===2&&p[1]>p[0]&&p.every(i=>i>=0&&i<16));assert(strikeProfile(k,4));
}
const hits=[],sources=Array.from({length:12},(_,i)=>({id:'follower:'+i,x:20+i*10,y:0,snd:t=>hits.push(t)})),far={x:400,y:0,snd(){throw Error('far source');}},pond={x:10,y:0,pond:true,snd(){throw Error('pond');}};
assert.equal(magnetFollowers([...sources,far,pond],0,0).length,8);assert(!magnetFollowers([...sources,far,pond],0,0).includes(far));
const magnetic=[],q={S:{wx:0,wy:0,mode:'world',sound:true,help:{}},MU:{near:[...sources,far,pond]},ac:{state:'running',currentTime:0},inWorld:()=>true,toast(){},say(){},withVoiceOrigin:(origin,fn)=>{assert.equal(origin,'field');return fn();},withMagnetVoice:(o,fn)=>{magnetic.push(o.id);return fn();}};boxes(q);q.givePower('iman');for(let s=0;s<16;s++)q.cajasStep(s,0,s*.125);assert.equal(hits.length,4);assert.equal(new Set(magnetic).size,4);assert(sources.filter(o=>Number.isFinite(o.magnetOnset)).length===4);
q.S.sound=false;q.cajasStep(0,1,3);assert.equal(hits.length,4);q.S.sound=true;q.noticeLane={inspecting:true};q.cajasStep(0,1,3);assert.equal(hits.length,4);q.noticeLane.inspecting=false;q.clearPowers();q.cajasStep(0,1,3);assert.equal(hits.length,4);
console.log('PASS six regional percussion habitats, original stream intact, empty space, body/voice/pattern coverage and four bounded magnetic voices per bar with mute/inspection/expiry');
