import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,copyFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawnSync} from 'node:child_process';
const dir=mkdtempSync(join(tmpdir(),'whitedot-version-'));
try{
 for(const folder of ['scripts','src'])mkdirSync(join(dir,folder));
 const files=['scripts/bump-version.mjs','src/release-info.js','package.json','index.html','sw.js','README.md'];
 for(const file of files)copyFileSync(new URL('../'+file,import.meta.url),join(dir,file));
 const before=files.map(file=>readFileSync(join(dir,file),'utf8'));
 const run=version=>spawnSync(process.execPath,[join(dir,'scripts/bump-version.mjs'),version],{encoding:'utf8'});
 assert.notEqual(run('bad').status,0);assert.deepEqual(files.map(file=>readFileSync(join(dir,file),'utf8')),before,'invalid version cannot partly update files');
 const result=run('2.3.0-alpha.12');assert.equal(result.status,0,result.stderr);
 assert.equal(JSON.parse(readFileSync(join(dir,'package.json'))).version,'2.3.0-alpha.12');
 for(const file of ['src/release-info.js','index.html','sw.js','README.md'])assert(readFileSync(join(dir,file),'utf8').includes('2.3.0-alpha.12'),file);
 assert.match(readFileSync(join(dir,'src/release-info.js'),'utf8'),/deployedAt:\s*null/);
 console.log('PASS atomic version validation, synchronized app/package/fallback/cache/docs and no invented deployment timestamp');
}finally{rmSync(dir,{recursive:true,force:true});}
