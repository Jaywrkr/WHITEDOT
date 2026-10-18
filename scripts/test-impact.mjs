import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {affectedTests} from './test-impact-model.mjs';
import {runSelected} from './test-impact-runner.mjs';
const started=Date.now(),root=fileURLToPath(new URL('../',import.meta.url)),args=process.argv.slice(2),value=key=>args.includes(key)?args[args.indexOf(key)+1]:null,base=value('--base')||'HEAD',jobs=Number(value('--jobs')||2);
if(base.startsWith('-')||!base.match(/^[\w./-]+$/))throw Error('Invalid base');
if(![1,2].includes(jobs))throw Error('jobs must be 1 or 2');
function git(...args){const r=spawnSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024});if(r.status!==0)throw Error(r.stderr||'Git failed');return r.stdout;}
const reference=git('rev-parse','--verify',base+'^{commit}').trim(),changes=[...new Set((git('diff','--name-only',reference,'--')+'\n'+git('ls-files','--others','--exclude-standard')).split('\n').filter(Boolean))],selected=affectedTests(root,changes);
console.log(`Impact: ${changes.length} changed files → ${selected.length} Node suites; base ${reference.slice(0,7)}`);
const report={base:reference,changes,selected,results:[],completeSuite:false};let failed=false;
if(args.includes('--list'))console.log(selected.join('\n'));
else {
 // Hash all versioned/non-ignored files conservatively: computed resource reads must also invalidate passes.
 const hash=createHash('sha256'),add=value=>{const data=Buffer.from(value);hash.update(String(data.length)+':');hash.update(data);};
 add(JSON.stringify([process.version,process.platform,process.arch,process.execArgv,Object.entries(process.env).sort(),new Date().toDateString()]));
 for(const file of [...new Set(git('ls-files','--cached','--others','--exclude-standard','-z').split('\0').filter(Boolean))].sort()){
  add(file);const exists=existsSync(resolve(root,file));add(String(exists));if(exists)add(readFileSync(resolve(root,file)));
 }
 const fingerprint=hash.digest('hex'),cacheDir=join(tmpdir(),'whitedot-test-impact',createHash('sha256').update(root).digest('hex')),cacheFile=join(cacheDir,'passes.json');let cache={};
 try{cache=JSON.parse(readFileSync(cacheFile,'utf8'));if(!cache||Array.isArray(cache)||typeof cache!=='object')cache={};}catch{}
 const result=await runSelected({root,tests:selected,fingerprint,cache,jobs,reuse:!args.includes('--no-cache')&&!process.env.CI,onOutput:output=>process.stdout.write(output)});
 report.results=result.results;failed=result.failed;
 if(!process.env.CI){mkdirSync(cacheDir,{recursive:true});writeFileSync(cacheFile,JSON.stringify(result.cache));}
}
report.milliseconds=Date.now()-started;
if(value('--report'))writeFileSync(resolve(root,value('--report')),JSON.stringify(report,null,2)+'\n');
if(failed)process.exitCode=1;
if(!args.includes('--list'))console.log(`${failed?'FAIL':'PASS'}: ${report.results.filter(r=>r.status!=='cached').length} executed, ${report.results.filter(r=>r.status==='cached').length} cached, ${selected.length-report.results.length} skipped; ${report.milliseconds} ms. Full suite unchanged.`);
