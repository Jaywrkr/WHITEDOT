import assert from 'node:assert/strict';
import {slowSample,qualityOf,SAMPLE} from '../src/frame-quality.js';
import {recordError,readErrors,errorReport,ERROR_LIMIT} from '../src/error-log.js';
// Quality: a full sample of slow frames asks for light mode; pauses and short samples never do.
assert.equal(slowSample(Array(SAMPLE).fill(16.7)),false);assert.equal(slowSample(Array(SAMPLE).fill(33)),true);
assert.equal(slowSample(Array(20).fill(40)),false,'too few frames');assert.equal(slowSample([...Array(SAMPLE-10).fill(16),...Array(10).fill(2000)]),false,'pauses are ignored');
assert.equal(qualityOf('ligera'),'ligera');assert.equal(qualityOf('nope'),'auto');assert.equal(qualityOf(undefined),'auto');
// Errors: kept on the device, short, repeated ones counted, never more than the limit.
const mem=new Map(),storage={getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,v)};
recordError(storage,{message:'boom',file:'https://x.test/src/render.js?v=2',line:12,version:'v1'},1000);
recordError(storage,{message:'boom',file:'https://x.test/src/render.js?v=2',line:12,version:'v1'},3000);
let list=readErrors(storage);assert.equal(list.length,1);assert.equal(list[0].count,2);assert.equal(list[0].where,'render.js:12');
recordError(storage,{kind:'promesa',message:{toString:()=>'x'.repeat(500)}},20000);list=readErrors(storage);assert.equal(list[1].kind,'promesa');assert.equal(list[1].message.length,200);
for(let i=0;i<40;i++)recordError(storage,{message:'e'+i},30000+i*10000);assert.equal(readErrors(storage).length,ERROR_LIMIT);
assert.match(errorReport(readErrors(storage),{version:'v2'}),/^Kubono v2\n20 errores registrados/);assert.match(errorReport([],{version:'v2'}),/Sin errores registrados/);
assert.deepEqual(readErrors({getItem:()=>'{bad'}),[]);recordError({getItem:()=>null,setItem:()=>{throw Error('full');}},{message:'x'});
console.log('PASS quality: slow samples ask for light mode, pauses ignored; errors: local, short, counted and capped');
