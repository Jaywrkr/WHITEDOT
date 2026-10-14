import assert from 'node:assert/strict';
import {mkdtempSync,copyFileSync,mkdirSync,readFileSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {deploymentTime,normalizeRelease,releaseLabels} from '../src/release-model.js';
import {stampDeployment} from '../scripts/stamp-deploy.mjs';
assert.equal(deploymentTime('2026-02-30T12:00:00Z'),null);assert.equal(deploymentTime('yesterday'),null);assert.equal(deploymentTime('2026-10-14T12:00:00+00:00'),null);
assert.deepEqual(normalizeRelease({version:'x',deployedAt:5,revision:'<script>'}),{version:'desconocida',deployedAt:null,revision:null});
assert.equal(releaseLabels({version:'1.0.0-rc.3'}).date,'deploy sin registrar');
const release={version:'1.0.0-rc.3',deployedAt:'2026-10-14T12:04:00Z',revision:'abcdef0'};
const labels=releaseLabels(release,{timeZone:'UTC'});assert.match(labels.date,/14\/10\/26.*12:04/);assert.match(labels.title,/2026-10-14T12:04:00.000Z/);
const dir=mkdtempSync(join(tmpdir(),'whitedot-release-'));try{
 mkdirSync(join(dir,'src'));for(const f of ['sw.js','package.json','src/release-info.js'])copyFileSync(new URL('../'+f,import.meta.url),join(dir,f));
 const original=readFileSync(join(dir,'sw.js'),'utf8');assert.throws(()=>stampDeployment({directory:dir,deployedAt:'now',revision:'abcdef0'}));assert.equal(readFileSync(join(dir,'sw.js'),'utf8'),original,'invalid input cannot partly stamp');
 const result=stampDeployment({directory:dir,deployedAt:release.deployedAt,revision:release.revision});assert.equal(result.deployedAt,'2026-10-14T12:04:00.000Z');assert(readFileSync(join(dir,'sw.js'),'utf8').includes(result.cache));
 const stamped=await import(join(dir,'src/release-info.js'));assert.equal(stamped.RELEASE.deployedAt,result.deployedAt);assert.equal(stamped.RELEASE.revision,release.revision);
}finally{rmSync(dir,{recursive:true,force:true});}
console.log('PASS version and genuine UTC deployment metadata, local label, invalid inputs, artifact stamping and unique PWA publication cache');
