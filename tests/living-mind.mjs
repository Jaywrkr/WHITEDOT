import assert from 'node:assert/strict';
import {LIVING_CATALOG,livingChunk,livingVoice} from '../src/living-catalog.js';
import {mindProfile,mindDecision,updateMind,MIND_CAPABILITIES} from '../src/living-mind.js';
const seedOf=s=>Array.from(s).reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261),rng=a=>()=>((a=Math.imul(a,1664525)+1013904223>>>0)/4294967296);
const region={key:'0,0',genre:'deep',hue:200},genres={deep:{bassP:['sub','fm'],hookP:['rhodes'],sw:.12}};
const snapshot=JSON.stringify(livingChunk(3,2,900,region,'bosque',seedOf,rng));
for(const def of LIVING_CATALOG){
 const intents=new Set(),voices=new Set(),profiles=new Set(),sameStimuli=Array.from({length:4},()=>new Set());
 for(let i=0;i<32;i++){
  const o={id:`living:v1:3,2:${i}`,kind:def.id,group:def.group,variant:25,personality:'curiosa',activeAt:0,size:14,x:0,y:0,homeX:0,homeY:0,awake:1,energy:.4};
  o.mind=mindProfile(o,seedOf,rng);assert.deepEqual(o.mind,mindProfile(o,seedOf,rng));const {id,...traits}=o.mind;profiles.add(JSON.stringify(traits));
  const peer={id:'peer',group:def.group,x:20,y:20};
  for(const [j,[speed,stimulus,awake]] of [[0,false,1],[180,false,1],[0,true,1],[0,false,.45]].entries()){
   o.stimulusAt=stimulus?0:undefined;o.awake=awake;o.energy=awake<.5?0:.4;
   const decision=mindDecision(o,50,{x:50,y:0,speed},0,[o,peer]);
   assert(MIND_CAPABILITIES[def.group].includes(decision),`${def.id}: invalid species action ${decision}`);intents.add(decision);sameStimuli[j].add(decision);
   const copy={...o,nextDecision:0};for(let frame=0;frame<100;frame++)updateMind(copy,.05,frame*.05,50,{x:50,y:0,speed},[copy,peer]);
   assert(Math.hypot(copy.x,copy.y)<=68.0001);assert(copy.openness>=.72&&copy.openness<=1.1);
   if(def.group!=='fauna')assert.equal(copy.x,0,'plants/buildings should express decisions without walking');
  }
  voices.add(JSON.stringify(livingVoice('living:'+def.id,region,genres,seedOf,rng,o)));
 }
 assert.equal(profiles.size,32);assert(intents.size>=3,`${def.id}: no contrasting actions`);assert(sameStimuli.some(s=>s.size>=2),`${def.id}: different seeds made identical choices for the same stimuli`);assert(voices.size>=8,`${def.id}: individual has no audible parameters`);
}
const turtle={id:'turtle:motion',kind:'turtle',group:'fauna',variant:25,activeAt:0,size:14,x:0,y:0,homeX:0,homeY:0,awake:1,energy:.4};
turtle.mind={...mindProfile(turtle,seedOf,rng),curiosity:1,caution:0};
for(let i=0;i<1000;i++)updateMind(turtle,.05,i*.05,60,{x:60,y:0,speed:0});assert(turtle.x>5,'the turtle must reach its slow movement strategy');
assert.equal(JSON.stringify(livingChunk(3,2,900,region,'bosque',seedOf,rng)),snapshot,'mind sampling consumed placement RNG');
console.log('PASS 48 lineage capability profiles, 32 distinct seeds each, 3+ observable decisions, bounded fauna/immobile flora, individual voices and slow turtle motion');
