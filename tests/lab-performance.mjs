import assert from 'node:assert/strict';
import {LAB_BANDS,labDrumEvents,labNoteEvents} from '../src/lab-score.js';
const score={...LAB_BANDS[0],variant:5,kick:[0,4,8,12]},frame={labScore:score,bass:Array(16).fill(0),hook:[0,-1,-1,-1,-1,-1,2,-1,-1,-1,4,-1,-1,-1,-1,-1],bassI:'reedbass',hookI:'silkpluck'};
const events=bar=>Array.from({length:16},(_,step)=>labDrumEvents(score,step,bar,.65).map(e=>({...e,at:step+e.offset}))).flat();
const cross=events(0).filter(e=>e.instrument==='handslap');
assert(cross.some(e=>Math.abs(e.at-8/3)<1e-7));assert(cross.some(e=>Math.abs(e.at-16/3)<1e-7));
assert(events(7).length<events(0).length);
const notes=bar=>Array.from({length:16},(_,s)=>labNoteEvents(frame,s,bar)).flat();
assert.notDeepEqual(notes(0),notes(2));assert(notes(3).length<notes(0).length);
assert.deepEqual(notes(0),notes(8));assert(notes(3).filter(e=>e.role==='lead').every(e=>e.degree===0));
for(const band of LAB_BANDS)for(let bar=0;bar<32;bar++)for(let s=0;s<16;s++){
 const list=labDrumEvents({...band,kick:[0,4,8,12]},s,bar,.65);
 assert(list.length<=3);assert(list.every(e=>e.offset>=0&&e.offset<1&&e.gain<=.2&&Number.isFinite(e.pitch)));
}
assert.deepEqual(labNoteEvents(null,0,0),[]);
console.log('PASS actual fractional 3:2 strokes, binary anchor, answer/resolution/rest phrases, pickups and bounded event budgets');
