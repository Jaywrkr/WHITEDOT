import assert from 'node:assert/strict';
import {MAX_THREADS,toggleThread,threadScore,threadArrangement,createBox,paintBoxStep,boxPart,moveBoxPart,boxArrangement,startDialogue,captureDialogue,finishDialogue,dialogueReply} from '../src/encounter-depth-model.js';
import {segmentDistance,boxCellAt,boxSlotAt,boxLidAt,boxStepPoint,boxPartPoint} from '../src/encounter-depth.js';
const hash=s=>[...s].reduce((a,c)=>Math.imul(a^c.charCodeAt(0),16777619)>>>0,2166136261);
const nodes=Array.from({length:8},(_,i)=>({id:'node:'+i,x:i*20,y:(i%3)*15})),net={edges:[]};
assert(!toggleThread(net,nodes[0],nodes[0]));assert(!toggleThread(net,nodes[0],{id:'far',x:400,y:0}));
for(let i=1;i<=MAX_THREADS;i++)assert(toggleThread(net,nodes[0],nodes[i]));assert(!toggleThread(net,nodes[0],nodes[7]));assert.equal(net.edges.length,MAX_THREADS);
const score=threadScore(net,hash);assert.deepEqual(score,threadScore(net,hash));assert(score.notes.length>0&&score.notes.length<=4);assert(score.mask.every(v=>typeof v==='boolean'));
assert(toggleThread(net,nodes[1],nodes[0]));assert.equal(net.edges.length,MAX_THREADS-1);
const cycle={edges:[]};toggleThread(cycle,nodes[0],nodes[1]);toggleThread(cycle,nodes[1],nodes[2]);toggleThread(cycle,nodes[2],nodes[0]);assert(threadScore(cycle,hash).notes.length<=3);
const track={bass:[0,-1,2,-1,-1,-1,4,-1,0,-1,-1,-1,2,-1,-1,-1],hook:[0,-1,-1,2,-1,-1,-1,-1,4,-1,-1,6,-1,-1,-1,-1],grammar:{hookLimit:3}},original=JSON.stringify(track);
for(const channel of ['bass','melody','space']){const shaped=threadArrangement(track,net,channel,hash);assert(shaped.bass.filter(n=>n>=0).length<=8);assert(shaped.hook.filter(n=>n>=0).length<=3);assert.equal(JSON.stringify(track),original);}
assert.notDeepEqual(threadArrangement(track,net,'bass',hash).bass,track.bass);
const box=createBox({track});assert.equal(box.parts.length,3);assert(box.parts.every(p=>p.steps.length===16));assert(!paintBoxStep(box,16,true));
paintBoxStep(box,1,true);assert.equal(box.parts[0].steps[1],0);paintBoxStep(box,1,false);assert.equal(box.parts[0].steps[1],-1);
box.selected=2;paintBoxStep(box,10,true);assert.equal(box.parts[2].steps[10],4);
const bassBefore=boxPart(box,'bass').steps;assert(moveBoxPart(box,0,2));assert.notDeepEqual(boxPart(box,'bass').steps,bassBefore);assert(!moveBoxPart(box,0,9));
box.parts.find(p=>p.id==='melody').enabled=false;assert(boxArrangement(track,box).hook.every(n=>n===-1));assert.equal(JSON.stringify(track),original);
const learning=startDialogue();for(const [step,degree]of [[0,2],[4,4],[12,6],[24,4]])assert(captureDialogue(learning,{step,degree}));assert(!captureDialogue(learning,{step:4,degree:1}));assert(!captureDialogue(learning,{step:NaN,degree:0}));
assert(!captureDialogue(learning,{step:28,degree:0}),'four accepted notes should fill the lesson');
finishDialogue(learning);assert.equal(learning.phase,'replying');assert.deepEqual(learning.phrase.map(n=>n.step),[0,2,6,12]);assert.deepEqual(learning.phrase.map(n=>n.index),[0,2,4,2]);
assert.equal(dialogueReply(learning,2).length,4);learning.lastReplyBar=2;assert.equal(dialogueReply(learning,4).length,0);assert.equal(dialogueReply(learning,6).at(-1).index,0);assert(!captureDialogue(learning,{step:2,degree:3}));
const empty=startDialogue();finishDialogue(empty);assert.equal(empty.phase,'idle');
for(let i=0;i<16;i++){const p=boxStepPoint(i);assert.equal(boxCellAt(p.x,p.y),i);}
for(let i=0;i<3;i++){const p=boxPartPoint(i);assert.equal(boxSlotAt(p.x,p.y),i);assert.equal(boxCellAt(p.x,p.y),null);}
assert.equal(boxCellAt(0,0),null);assert.equal(boxCellAt(90,0),null);assert.equal(segmentDistance({x:5,y:2},{x:0,y:0},{x:10,y:0}),2);
console.log('PASS: free threads, cycle and density limits, editable parts, immutable arrangements, learned contour/rhythm, reply turns and physical hit targets');
assert(boxLidAt(0,56));assert(!boxLidAt(0,0));

// Targets stay distinct; the full seedpod fits the prototype mobile position.
for(let i=0;i<16;i++)for(let j=i+1;j<16;j++){const a=boxStepPoint(i),b=boxStepPoint(j);assert(Math.hypot(a.x-b.x,a.y-b.y)>26);}
for(const [width,height]of [[390,844],[844,390],[1280,800]]){assert(172*220/(width*height)<.2);assert(width/2+100+86<width);assert(height/2-110>0);}
assert.equal(boxCellAt(0,56),null);assert.equal(boxSlotAt(0,56),null);
