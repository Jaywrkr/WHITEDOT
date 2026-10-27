// L4: the itch.io zip holds only the game, sealed as the sale edition, with index.html at its root and no service worker.
import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdtempSync,rmSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {packageItch,prepareIndex,zipFiles,crc32,GAME_PATHS,ITCH_LIMITS,SW_OFF} from '../scripts/itch-package.mjs';
const root=new URL('../',import.meta.url),read=f=>readFileSync(new URL(f,root),'utf8');
assert.equal(crc32(Buffer.from('123456789')),0xCBF43926,'standard CRC-32');
// Central directory of a zip written here: names, sizes and the root index.html.
const entries=zip=>{const end=zip.lastIndexOf(Buffer.from([0x50,0x4b,0x05,0x06]));assert.ok(end>0);const count=zip.readUInt16LE(end+10);let at=zip.readUInt32LE(end+16);const out=[];
 for(let i=0;i<count;i++){assert.equal(zip.readUInt32LE(at),0x02014b50);const n=zip.readUInt16LE(at+28),extra=zip.readUInt16LE(at+30),comment=zip.readUInt16LE(at+32);out.push({name:zip.toString('utf8',at+46,at+46+n),size:zip.readUInt32LE(at+24)});at+=46+n+extra+comment;}return out;};
assert.deepEqual(entries(zipFiles([{name:'a.txt',data:Buffer.from('x'.repeat(200))},{name:'b/c.js',data:Buffer.from('1')}])).map(e=>e.name),['a.txt','b/c.js']);
// index.html: no worker, no link to the web preview, everything else untouched.
const html=read('index.html'),prepared=prepareIndex(html);
assert.ok(prepared.includes('<meta charset="utf-8">\n'+SW_OFF));assert.doesNotMatch(prepared,/vercel\.app|og:url|og:image/);
assert.deepEqual([...prepared.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]),[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]),'every HTML id kept');
assert.doesNotMatch(prepared,/(?:href|src)="\//,'only relative paths');
// The package itself.
const out=mkdtempSync(join(tmpdir(),'kubono-itch-out-'));let stage=null;
try{
 const result=packageItch({out,keepStage:true,revision:'0123456789abcdef0123456789abcdef01234567',deployedAt:'2026-10-27T12:00:00Z'});stage=result.stage;
 const version=JSON.parse(read('package.json')).version;
 assert.equal(result.zip,join(out,`kubono-itch-${version}.zip`));assert.equal(result.edition,'store');
 const list=entries(readFileSync(result.zip)),names=list.map(e=>e.name);
 assert.equal(list.length,result.files);assert.ok(names.includes('index.html'),'index.html at the root');
 assert.ok(result.files<ITCH_LIMITS.files/2&&result.bytes<ITCH_LIMITS.bytes/50,'far from the itch.io limits');
 assert.ok(names.every(n=>GAME_PATHS.includes(n.split('/')[0])),'only the game: '+names.filter(n=>!GAME_PATHS.includes(n.split('/')[0])));
 for(const gone of ['sw.js','recovery.html','package.json','icons/og-1200x630.png'])assert.ok(!names.includes(gone),gone);
 const modules=readdirSync(new URL('src/',root)).filter(f=>f.endsWith('.js'));
 for(const m of modules)assert.ok(names.includes('src/'+m),'module packed: '+m);
 assert.match(readFileSync(join(stage,'src/edition.js'),'utf8'),/export const EDITION='store';/);
 assert.match(readFileSync(join(stage,'src/release-info.js'),'utf8'),/"revision":"0123456789abcdef0123456789abcdef01234567"/);
 assert.ok(readFileSync(join(stage,'index.html'),'utf8').includes(SW_OFF));
 assert.equal(read('src/edition.js').match(/export const EDITION='([^']*)';/)[1],'web','the source stays the web edition');
 assert.ok(!existsSync(join(stage,'sw.js')));
}finally{rmSync(out,{recursive:true,force:true});if(stage)rmSync(stage,{recursive:true,force:true});}
// The worker registers on the web, but not in a build that turns it off; dist/ never enters Git.
assert.match(read('src/pwa.js'),/location\.protocol==='https:'&&!document\.querySelector\?\.\('meta\[name="kubono-service-worker"\]\[content="off"\]'\)\)addEventListener\('load'/);
assert.match(read('.gitignore'),/^dist\/$/m);
// Behaviour: on https the web registers ./sw.js; with the itch.io mark nothing is registered.
const {initialize:pwa}=await import('../src/pwa.js');
for(const off of [false,true]){
 const events={},registered=[];
 globalThis.document={addEventListener(){},querySelector:q=>off&&q==='meta[name="kubono-service-worker"][content="off"]'?{}:null};
 globalThis.addEventListener=(k,f)=>{events[k]=f;};globalThis.matchMedia=()=>({matches:false});globalThis.location={protocol:'https:'};
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{serviceWorker:{controller:null,addEventListener(){},register:async(url,o)=>{registered.push(url);return {addEventListener(){}};}}}});
 pwa({$:()=>null,S:{},toast(){}});if(events.load)await events.load();
 assert.deepEqual(registered,off?[]:['./sw.js'],off?'itch.io build: no worker':'web: worker registered');
}
console.log('PASS itch package: only the game, sale edition, index.html at the root, no service worker, no preview links, far from the itch.io limits');
