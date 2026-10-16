import assert from 'node:assert/strict';
import {distantCloud,cloudPresence} from '../src/distant-colors.js';
import {ambientSoloist} from '../src/ambient-score.js';
import {connectionGrove,groveNodes} from '../src/connection-groves.js';
import {labScore,labArrangement,labNoteEvents} from '../src/lab-score.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const clouds=[];for(let x=-5;x<5;x++)for(let y=-5;y<5;y++){const q=distantCloud(x,y,r.seedOf);assert.deepEqual(q,distantCloud(x,y,r.seedOf));if(q){clouds.push(q);assert(q.radius>=220&&q.radius<=329);for(let t=0;t<180;t++){assert(cloudPresence(q,t)>=0&&cloudPresence(q,t)<=1);assert(Math.abs(cloudPresence(q,t+.01)-cloudPresence(q,t))<.002);}assert.equal(cloudPresence(q,0,true),cloudPresence(q,100,true));}}
assert(clouds.length>0&&clouds.length<100);assert(new Set(clouds.map(q=>q.hue)).size>30);
const sources=Array.from({length:8},(_,i)=>({id:'s'+i,x:i*10,y:0,snd(){}})),region=r.regionOfPos(900,900),solo=[];
for(let bar=0;bar<8;bar++)for(let step=0;step<16;step++){const p=ambientSoloist(region,bar,step,sources,r.seedOf);if(p)solo.push(p.id);assert.equal(ambientSoloist(region,bar,step,sources,r.seedOf,{quiet:true}),null);}
assert.equal(solo.length,6);assert.equal(new Set(solo).size,1,'a phrase must retain its soloist');assert.equal(ambientSoloist(region,0,6,sources,r.seedOf,{rest:true}),null);assert.equal(ambientSoloist(region,0,6,[{x:300,y:300,snd(){}}],r.seedOf),null);
let groves=0,clear=0;const sizes=new Set(),styles=new Set();let rich=0,sparse=0;
for(let x=-22;x<22;x++)for(let y=-22;y<22;y++){
 const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600),before=JSON.stringify(d),profile=connectionGrove(d,r.seedOf),nodes=groveNodes(x*4,y*4,900,d,r.seedOf);
 assert.equal(JSON.stringify(d),before);assert.deepEqual(nodes,groveNodes(x*4,y*4,900,d,r.seedOf));assert(nodes.length<=16);
 if(profile){groves++;styles.add(profile.style);assert.equal(new Set(nodes.map(o=>o.groveRole)).size,4);assert.equal(nodes.length,16);}else{clear++;assert.equal(nodes.length,0);}
 const score=labScore(d,r.seedOf,r.rng);if(!score)continue;sizes.add(score.ensemble);
 const f={phrase:2,section:2,harmonyBar:17,bass:Array(16).fill(-1),hook:Array(16).fill(-1),identity:{air:.3},grammar:{hookLimit:4,brightness:7000,hookLevel:1},expression:{toneScale:1,attackScale:1}},frame=labArrangement(f,score);
 const events=Array.from({length:16},(_,s)=>labNoteEvents(frame,s,17)).flat(),answers=events.filter(e=>e.part==='answer');
 if(score.ensemble>1){rich+=answers.length;assert(answers.every(e=>e.instrument!==frame.hookI&&e.level<=.62));}else{sparse++;assert.equal(answers.length,0);}
 const rest=Array.from({length:16},(_,s)=>labNoteEvents({...frame,melodyRest:true},s,17)).flat();assert(!rest.some(e=>e.part==='answer'));
 if(score.ensemble>1){
  const arrival=labArrangement({...f,section:0,melodyRest:true,harmonyBar:0},score);
  assert.equal(arrival.melodyRest,false,'rich territories must not all arrive as drums and bass');
  assert(labNoteEvents(arrival,0,0).some(e=>e.part==='comp'),'rich arrival needs an actual harmonic instrument');
  assert.equal(labArrangement({...f,section:0,melodyRest:true,harmonyBar:0},score,{quiet:true}).melodyRest,true,'real quiet pockets stay quiet');
 }
}
assert(groves>0&&clear>groves&&styles.size===3);assert.equal(sizes.size,3);assert(rich>0&&sparse>0);
assert.deepEqual(groveNodes(0,0,900,{...region,sea:true},r.seedOf),[]);
console.log('PASS gradual multicolor fields, stable eight-bar soloists, three additive four-role grove populations and sparse/rich complementary ensembles');
