import {spawn} from 'node:child_process';
// Only successful runs of the exact snapshot may be reused. Full suites bypass this runner.
export async function runSelected({root,tests,fingerprint,cache={},jobs=2,reuse=true,now=Date.now(),ttl=3600000,onOutput=()=>{}}){
 if(![1,2].includes(jobs))throw Error('jobs must be 1 or 2');
 const results=[];let next=0,failed=false;
 async function worker(){
  while(!failed&&next<tests.length){
   const test=tests[next++],entry=cache[test];
   if(reuse&&entry?.fingerprint===fingerprint&&now>=entry.at&&now-entry.at<ttl){results.push({test,exit:0,status:'cached',milliseconds:0});continue;}
   delete cache[test];const started=Date.now();
   const result=await new Promise(resolve=>{
    const child=spawn(process.execPath,['tests/'+test],{cwd:root,env:process.env});let output='';
    child.stdout.on('data',data=>output+=data);child.stderr.on('data',data=>output+=data);
    child.on('error',error=>output+=error.message);
    child.on('close',(code,signal)=>resolve({test,exit:code??1,signal,milliseconds:Date.now()-started,status:code===0?'passed':'failed',output}));
   });
   onOutput(result.output);delete result.output;results.push(result);
   if(result.exit===0)cache[test]={fingerprint,at:Date.now()};else failed=true;
  }
 }
 await Promise.all(Array.from({length:jobs},worker));return {results,failed,cache};
}
