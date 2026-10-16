import assert from 'node:assert/strict';import {regionalPhrase,interlockedBass} from '../src/regional-phrases.js';
const kinds=['minimal','machine','warm','disco','organic','afro','broken','bass','melodic','dub','ambient','guitar','italo','blues'],signatures=new Set();
for(const id of kinds)for(let variant=0;variant<16;variant++){
 const s={id,genre:id,territory:'2,5',variant,production:{id},hook:[0,3,7,12],bass:[0,-1,-1,2,-1,-1,-1,4,0,-1,-1,-1,2,-1,-1,-1]},before=JSON.stringify(s),at=bar=>regionalPhrase(s,{harmonyBar:bar,grammar:{hookLimit:4}});
 const a=at(0),answer=at(2),end=at(7);assert.deepEqual(at(0),a);assert.equal(JSON.stringify(s),before);assert.equal(end.hook.filter(n=>n>=0).length,1);assert.equal(end.hook.find(n=>n>=0),0);
 assert(regionalPhrase(s,{harmonyBar:0,grammar:{hookLimit:0}}).hook.every(n=>n<0),'authored zero-note budgets remain silent');
 assert(a.hook.every(n=>Number.isInteger(n)&&n>=-1&&n<7));assert(answer.answer);assert.notEqual(at(48).movement,a.movement);
 signatures.add(JSON.stringify(a.hook));const bass=interlockedBass(s,a.hook);assert.equal(bass[0],0);assert.equal(bass[8],0);assert(bass.filter(n=>n>=0).length<=s.bass.filter(n=>n>=0).length);
 const hybrid=regionalPhrase(s,{harmonyBar:0,hybrid:{tones:[0,2,4]},grammar:{hookLimit:4}});assert(hybrid.hook.every(n=>n<0||[0,2,4].includes(n)));
}
assert(signatures.size>=20,signatures.size);console.log('PASS 14 phrase grammars, deterministic whole-motif development, actual call/response/resolution, diatonic hybrids, root-preserving interlock and unchanged territory data');
import {labNoteEvents} from '../src/lab-score.js';
const f={labScore:{id:'silk',genre:'deep',variant:0,leads:['phasekeys','feltkeys'],ensemble:1,scene:0},bass:Array(16).fill(-1),hook:Array(16).fill(-1),hookI:'phasekeys',melodyRest:false,harmonyBar:2,section:2};f.hook[4]=5;
assert.equal(labNoteEvents(f,4,2).find(e=>e.role==='lead').degree,5,'playback must retain the composed answer instead of substituting the same three degrees everywhere');
