import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
const run=(...args)=>spawnSync('python3',['scripts/browser-processes.py',...args],{encoding:'utf8',timeout:5000});
const failure=run('python3','-c','raise SystemExit(7)');assert.equal(failure.status,7,failure.stderr);
if(process.platform==='linux'){
 const orphan=run('python3','-c','import os,time; pid=os.fork(); print(pid,flush=True) if pid else time.sleep(30)');
 assert.equal(orphan.status,0,orphan.stderr);const pid=Number(orphan.stdout.trim());assert(pid>0);assert(!existsSync('/proc/'+pid),'own orphan must be reaped, not adopted by the container');
}
const timeout=run('--timeout=.15','python3','-c','import time;time.sleep(30)');assert.equal(timeout.status,124,timeout.stderr);
console.log('PASS browser wrapper preserves failure status, bounds time and reaps its own orphan children');
