import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {runSelected} from '../scripts/test-impact-runner.mjs';
const root=mkdtempSync(join(tmpdir(),'whitedot-runner-'));
try{
 mkdirSync(join(root,'tests'));
 for(const name of ['a','b','c'])writeFileSync(join(root,'tests',name+'.mjs'),`import {writeFileSync} from 'node:fs';writeFileSync('${name}.start',String(Date.now()));await new Promise(r=>setTimeout(r,180));writeFileSync('${name}.end',String(Date.now()));`);
 const options={root,tests:['a.mjs','b.mjs','c.mjs'],fingerprint:'one'};
 const cold=await runSelected(options);assert.equal(cold.results.length,3);assert(cold.results.every(r=>r.status==='passed'));
 const events=['a','b','c'].flatMap(n=>[['start',1],['end',-1]].map(([s,d])=>[Number(readFileSync(join(root,n+'.'+s))),d])).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 let active=0,max=0;for(const [,delta]of events){active+=delta;max=Math.max(max,active);}assert.equal(max,2);
 const warm=await runSelected({...options,cache:cold.cache});assert(warm.results.every(r=>r.status==='cached'));
 const changed=await runSelected({...options,cache:cold.cache,fingerprint:'two'});assert(changed.results.every(r=>r.status==='passed'));
 const forced=await runSelected({...options,cache:changed.cache,fingerprint:'two',reuse:false});assert(forced.results.every(r=>r.status==='passed'));
 const expired=await runSelected({...options,cache:forced.cache,fingerprint:'two',now:Date.now()+3600001});assert(expired.results.every(r=>r.status==='passed'));
 writeFileSync(join(root,'tests/fail.mjs'),'process.exit(7)');
 const bad={root,tests:['fail.mjs','a.mjs'],fingerprint:'bad',jobs:1};
 const first=await runSelected(bad);assert(first.failed);assert.equal(first.results[0].exit,7);assert.equal(first.results.length,1);assert(!first.cache['fail.mjs']);
 const retry=await runSelected({...bad,cache:first.cache});assert.equal(retry.results[0].status,'failed');
 writeFileSync(join(root,'tests/signal.mjs'),"process.kill(process.pid,'SIGTERM')");assert((await runSelected({...bad,tests:['signal.mjs']})).failed);
 await assert.rejects(runSelected({...options,jobs:3}));
 console.log('PASS real subprocesses: bounded concurrency, warm cache, changed fingerprint, forced/expired runs, failure retry, fail-fast and signals');
}finally{rmSync(root,{recursive:true,force:true});}
