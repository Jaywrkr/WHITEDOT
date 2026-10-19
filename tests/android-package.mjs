import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
execFileSync(process.execPath,['scripts/android-assets.mjs'],{stdio:'inherit'});
const out='android/app/build/generated/gameAssets/game';
function compare(path){for(const item of readdirSync(path,{withFileTypes:true})){const p=join(path,item.name);if(item.isDirectory())compare(p);else assert.deepEqual(readFileSync(join(out,p)),readFileSync(p),p);}}
for(const path of ['src','styles','assets','icons'])compare(path);
assert(!existsSync(join(out,'sw.js')),'APK updates must not retain an old service-worker shell');
assert(existsSync(join(out,'android-host.js')));
const html=readFileSync(join(out,'index.html'),'utf8');
assert(html.indexOf('android-host.js')<html.indexOf('src/main.js'));
assert(!existsSync(join(out,'.git'))&&!existsSync(join(out,'tests')));
console.log('PASS unchanged game assets, early native host adapter, offline shell and no development/private files');
