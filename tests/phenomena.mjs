import assert from 'node:assert/strict';
import {createPhenomena,cueIntensity,initialize} from '../src/phenomena.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);r.S.mode='world';
const examples=new Map();let birds=0,total=0;
for(let i=-100;i<100;i++)for(const biome of ['bosque','ruinas','tormenta']){
 const list=createPhenomena(i,2,900,biome,r.seedOf,r.rng);assert.deepEqual(list,createPhenomena(i,2,900,biome,r.seedOf,r.rng));assert(list.length<=2);
 for(const o of list){examples.set(o.kind,o);birds+=o.kind==='bird'?1:0;total++;assert(o.x>=i*900&&o.x<(i+1)*900);assert(o.y>=1800&&o.y<2700);}
}
assert.equal(examples.size,3);assert(birds>10&&birds<total*.2);
assert.equal(cueIntensity([2],1.9),0);assert.equal(cueIntensity([2],2),1);assert.equal(cueIntensity([2],3),0);
const heard=[],cues=[];let quiet=false;
Object.assign(r,{ac:{currentTime:1,state:'running'},SIX:.125,chordTones:()=>[60,64,67],root:()=>43,currentPocket:()=>quiet?{kind:'quiet'}:null,
 hookInst:(id,n,t,v)=>heard.push({id,n,t,v}),bassInst:(id,n,t,v)=>heard.push({id,n,t,v}),noiseHit:(t,...args)=>heard.push({id:'noise',t,args}),snareHit:(t,v)=>heard.push({id:'snare',t,v}),soundCue:(o,role,t)=>cues.push({o,role,t}),curatedVoiceGain:()=>1,
 withSpatialVoice:(o,t,emit)=>emit(1),withVoiceEffect:(kind,region,voice,t,emit)=>emit()});
initialize(r);
for(const [kind,o]of examples){r.S.wx=o.x;r.S.wy=o.y;heard.length=0;assert(r.triggerPhenomenon(o,2));assert.equal(cueIntensity(o.cues,1.9),0);assert(cueIntensity(o.cues,2)>0);assert(!r.triggerPhenomenon(o,2.01));if(kind==='bird'){assert.equal(heard.length,2);assert.equal(heard[1].t,2.25);assert(heard.every(n=>n.n<=76&&n.v<=.035));}else if(kind==='shaker')assert.equal(heard[0].id,'snare');else assert(heard.some(n=>n.n===43));}
r.S.sound=false;assert(!r.triggerPhenomenon({...examples.get('bird'),next:0},4));r.S.sound=true;
let automatic=false;for(let x=0;x<30&&!automatic;x++)for(let y=0;y<10&&!automatic;y++){
 r.S.wx=x*900+450;r.S.wy=y*900+450;const list=r.nearbyPhenomena();if(!list.length)continue;
 const o=list[0];r.S.wx=o.x;r.S.wy=o.y;heard.length=0;quiet=true;r.phenomenaStep(o.kind==='bird'?14:o.kind==='cloud'?0:12,o.offset,10);assert.equal(heard.length,0);
 quiet=false;r.phenomenaStep(o.kind==='bird'?14:o.kind==='cloud'?0:12,o.offset,10);automatic=heard.length>0;
 if(automatic){const length=heard.length;r.phenomenaStep(14,o.offset,10.2);assert.equal(heard.length,length);}
}
assert(automatic);
let percussionVisual=false;
for(let x=0;x<30&&!percussionVisual;x++){
 r.S.wx=x*900+450;r.S.wy=450;const o=r.nearbyPhenomena().find(o=>o.kind==='shaker');if(!o)continue;
 r.S.wx=o.x;r.S.wy=o.y;o.cues=[];heard.length=0;r.phenomenonPercussionCue(15);assert(o.cues.includes(15));assert.equal(heard.length,0);percussionVisual=true;
}
assert(percussionVisual);
for(let x=0;x<100;x++){r.S.wx=x*900;r.nearbyPhenomena();}assert(r.phenomenonCacheSize<=64);
globalThis.document={hidden:false,querySelector:()=>({})};assert(!r.triggerPhenomenon({...examples.get('bird'),next:0},20),'open menu must not trigger a phenomenon');document.querySelector=()=>null;document.hidden=true;assert(!r.triggerPhenomenon({...examples.get('bird'),next:0},20),'hidden tab must not trigger');document.hidden=false;
console.log('PASS: seeded sparse phenomena, rare birds, audio-onset visuals, melodic answers/snare/cloud voices, mute, quiet clearings and bounded cache');
