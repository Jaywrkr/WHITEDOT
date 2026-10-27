// L4: the desktop wrapper serves only the sealed sale edition, never reaches the network, keeps the save under the app ID
// and is built by hand from a manual workflow. Runs without Electron installed (the Linux build is driven by desktop_smoke.py).
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,sep} from 'node:path';
import {createRequire} from 'node:module';
import {makeIco,makeIcns,numericVersion,stageApp,APP_ID,WRAPPER_FILES,TARGETS} from '../scripts/desktop-package.mjs';
const root=new URL('../',import.meta.url),read=f=>readFileSync(new URL(f,root),'utf8');
const require=createRequire(import.meta.url);
const {resolveGameFile,isAllowedRequest,contentType,START_URL}=require('../desktop/serve.cjs');

// app://kubono/… maps into the game folder and nowhere else.
const game=resolve('/opt/kubono/game');
assert.equal(START_URL,'app://kubono/index.html');
assert.equal(resolveGameFile(game,'app://kubono/index.html'),join(game,'index.html'));
assert.equal(resolveGameFile(game,'app://kubono/'),join(game,'index.html'));
assert.equal(resolveGameFile(game,'app://kubono/src/main.js?v=1#x'),join(game,'src','main.js'));
assert.equal(resolveGameFile(game,'app://kubono/assets/a%20b.png'),join(game,'assets','a b.png'));
for(const bad of ['app://kubono/../secret','app://kubono/%2e%2e/secret','app://kubono/..%2f..%2fetc/passwd','app://other/index.html','file:///etc/passwd','https://kubono/index.html','app://kubono/%00','app://kubono/%E0%A4%A'])
 {const r=resolveGameFile(game,bad);assert.ok(r===null||r.startsWith(game+sep),bad+' → '+r);}
assert.equal(resolveGameFile(game,'app://kubono/../../etc/passwd'),join(game,'etc','passwd'),'URL parsing folds the dots inside the game');
assert.equal(contentType('a/b.js'),'text/javascript; charset=utf-8','ES modules need a JavaScript type');
assert.equal(contentType('index.html'),'text/html; charset=utf-8');assert.equal(contentType('m.webmanifest'),'application/manifest+json; charset=utf-8');
assert.equal(contentType('x.unknown'),'application/octet-stream');
for(const ok of ['app://kubono/index.html','data:image/png;base64,AA','blob:app://kubono/1234'])assert.ok(isAllowedRequest(ok),ok);
for(const no of ['https://example.com/','http://127.0.0.1/','wss://x','ws://localhost','file:///etc/passwd','app://other/','ftp://x','chrome-extension://x/'])assert.ok(!isAllowedRequest(no),no);

// The main process: what the release promises.
const main=read('desktop/main.cjs');
assert.equal(APP_ID,'com.playkubono.kubono');
assert.match(main,/app\.setPath\('userData',path\.join\(app\.getPath\('appData'\),APP_ID\)\)/,'save under the app ID');
assert.match(main,/registerSchemesAsPrivileged\(\[\{scheme:SCHEME,privileges:\{standard:true,secure:true/);
assert.match(main,/ses\.protocol\.handle\(SCHEME,serve\)/);
assert.match(main,/webRequest\.onBeforeRequest\(\(details,callback\)=>\{if\(isAllowedRequest\(details\.url\)\)callback\(\{\}\);else\{blocked\(details\.url\);callback\(\{cancel:true\}\);\}\}\)/,'network blocked');
assert.match(main,/setSpellCheckerLanguages\(\[\]\)/,'no dictionary download');
assert.match(main,/width:1280,height:800/);assert.match(main,/devTools:!app\.isPackaged/);assert.match(main,/sandbox:true,contextIsolation:true,nodeIntegration:false/);
assert.match(main,/Menu\.setApplicationMenu\(process\.platform==='darwin'\?Menu\.buildFromTemplate\(\[\{role:'appMenu'\},\{role:'editMenu'\},\{role:'windowMenu'\}\]\):null\)/,'no Electron menus');
assert.match(main,/input\.key==='F11'/);assert.match(main,/app\.on\('window-all-closed',\(\)=>app\.quit\(\)\)/);assert.match(main,/requestSingleInstanceLock/);
assert.match(main,/setWindowOpenHandler/);assert.match(main,/will-navigate/);
assert.doesNotMatch(main,/openDevTools|nodeIntegration:true|webSecurity:false|allowRunningInsecureContent/);

// Packaging helpers.
const png=readFileSync(new URL('icons/icon-512.png',root)),small=readFileSync(new URL('icons/icon-192.png',root));
const ico=makeIco([small,png]);assert.deepEqual([ico.readUInt16LE(0),ico.readUInt16LE(2),ico.readUInt16LE(4)],[0,1,2]);
assert.equal(ico.readUInt8(6),192);assert.equal(ico.readUInt8(22),0,'512 is stored as 0 (≥256)');
assert.ok(ico.subarray(ico.readUInt32LE(18),ico.readUInt32LE(18)+8).equals(small.subarray(0,8)),'PNG data inside the ICO');
const icns=makeIcns([['ic09',png]]);assert.equal(icns.toString('ascii',0,4),'icns');assert.equal(icns.readUInt32BE(4),icns.length);assert.equal(icns.toString('ascii',8,12),'ic09');
assert.equal(numericVersion('2.3.0-alpha.225'),'2.3.0.225');assert.equal(numericVersion('2.3.0'),'2.3.0.0');assert.throws(()=>numericVersion('banana'));
assert.deepEqual(Object.keys(TARGETS),['linux','win32','darwin']);
// The staged app: the wrapper plus the itch.io sale-edition folder as game/.
const dir=mkdtempSync(join(tmpdir(),'kubono-desktop-stage-'));
try{
 const staged=stageApp({dir:join(dir,'app'),revision:'0123456789abcdef0123456789abcdef01234567'});
 const version=JSON.parse(read('package.json')).version,pkg=JSON.parse(readFileSync(join(staged.dir,'package.json'),'utf8'));
 assert.equal(pkg.version,version);assert.equal(pkg.main,'main.cjs');assert.equal(pkg.productName,'Kubono');assert.ok(!pkg.dependencies&&!pkg.devDependencies,'nothing to install');
 for(const f of WRAPPER_FILES)assert.equal(readFileSync(join(staged.dir,f),'utf8'),read('desktop/'+f));
 assert.match(readFileSync(join(staged.dir,'game/src/edition.js'),'utf8'),/export const EDITION='store';/,'sale edition');
 assert.ok(readFileSync(join(staged.dir,'game/index.html'),'utf8').includes('<meta name="kubono-service-worker" content="off">'));
 for(const gone of ['sw.js','recovery.html','package.json','tests','docs','android','desktop'])assert.ok(!existsSync(join(staged.dir,'game',gone)),gone);
 assert.equal(read('src/edition.js').match(/export const EDITION='([^']*)';/)[1],'web','the source stays the web edition');
}finally{rmSync(dir,{recursive:true,force:true});}

// Wrapper dependencies: exact versions, outside the game, outside Git. The workflow only runs by hand and uploads artifacts.
const desk=JSON.parse(read('desktop/package.json'));
for(const [name,v] of Object.entries(desk.devDependencies))assert.match(v,/^\d+\.\d+\.\d+$/,name+' pinned');
assert.ok(!desk.dependencies,'the wrapper ships no npm packages');
assert.ok(!JSON.parse(read('package.json')).dependencies&&!JSON.parse(read('package.json')).devDependencies,'the game stays without npm dependencies');
assert.match(read('.gitignore'),/^node_modules\/$/m);
const flow=read('.github/workflows/desktop-builds.yml');
assert.match(flow,/^on:\n  workflow_dispatch:/m);assert.doesNotMatch(flow,/^\s+(push|pull_request|schedule|release):/m,'manual only');
assert.match(flow,/actions\/upload-artifact@v4/);assert.doesNotMatch(flow,/butler|itch\.io\/api|secrets\./,'nothing is uploaded to itch.io');
assert.match(flow,/tests\/desktop_smoke\.py/);
assert.match(read('tests/creative_regression.py'),/'desktop_smoke\.py'/,'the Electron flow stays out of the browser shards');
console.log('PASS desktop package: app:// serves only the game folder, network blocked, no dictionary download, save under '+APP_ID+', no menus or DevTools in release, sale edition staged, pinned wrapper, manual workflow');
