// L4 · itch.io web build. Copies only the game's own files to a staged folder, stamps the sale edition (no account, no
// cloud) and turns the service worker off, then writes dist/kubono-itch-<version>.zip with index.html at its root.
// No npm dependencies: the zip is written here with node:zlib. Usage:
//   node scripts/itch-package.mjs [--out DIR] [--keep-stage] [--revision SHA] [--deployed-at ISO_UTC]
import {cpSync,readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync,readdirSync,statSync,existsSync} from 'node:fs';
import {resolve,join,relative,sep} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {deflateRawSync} from 'node:zlib';
import {setEdition} from './set-edition.mjs';
import {stampDeployment} from './stamp-deploy.mjs';
const ROOT=resolve(fileURLToPath(new URL('..',import.meta.url)));
// Only what the game loads. Tests, docs, android, server, scripts, supabase, tools, .github, renders, captures and
// recovery.html (the account page) stay out because they are never listed here.
export const GAME_PATHS=Object.freeze(['index.html','manifest.webmanifest','src','styles','assets','icons']);
// Inside those folders: the share image is for links to the web site, not for the game.
const SKIP=new Set(['icons/og-1200x630.png']);
// itch.io limits for HTML5 uploads (checked at packaging; see docs/ITCH.md).
export const ITCH_LIMITS=Object.freeze({files:1000,bytes:500*1024*1024});
export const SW_OFF='<meta name="kubono-service-worker" content="off">';

const listFiles=dir=>readdirSync(dir).sort().flatMap(name=>{const path=join(dir,name);return statSync(path).isDirectory()?listFiles(path):[path];});

// The itch.io page frames the game from its own CDN: no service worker, no links to the web preview.
export function prepareIndex(html){
 const charset='<meta charset="utf-8">';if(!html.includes(charset))throw Error('index.html has no charset meta');
 const out=html.split('\n').filter(line=>!/<meta property="og:(url|image)/.test(line)).join('\n').replace(charset,charset+'\n'+SW_OFF);
 if(/vercel\.app/.test(out))throw Error('index.html still points to the web preview');
 return out;
}

// Minimal zip writer (stored or deflated entries, no extras). Entries keep a fixed date so the same tree gives the same zip.
const CRC=new Uint32Array(256).map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;return c>>>0;});
export function crc32(buffer){let c=0xFFFFFFFF;for(const b of buffer)c=CRC[(c^b)&0xFF]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
export function zipFiles(entries){
 const locals=[],centrals=[];let offset=0;
 const time=0,date=((2026-1980)<<9)|(1<<5)|1;
 for(const {name,data} of entries){
  const nameBytes=Buffer.from(name,'utf8'),deflated=deflateRawSync(data,{level:9}),useDeflate=deflated.length<data.length,body=useDeflate?deflated:data,crc=crc32(data);
  const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50,0);local.writeUInt16LE(20,4);local.writeUInt16LE(0x0800,6);local.writeUInt16LE(useDeflate?8:0,8);
  local.writeUInt16LE(time,10);local.writeUInt16LE(date,12);local.writeUInt32LE(crc,14);local.writeUInt32LE(body.length,18);local.writeUInt32LE(data.length,22);local.writeUInt16LE(nameBytes.length,26);local.writeUInt16LE(0,28);
  const central=Buffer.alloc(46);central.writeUInt32LE(0x02014b50,0);central.writeUInt16LE(20,4);central.writeUInt16LE(20,6);central.writeUInt16LE(0x0800,8);central.writeUInt16LE(useDeflate?8:0,10);
  central.writeUInt16LE(time,12);central.writeUInt16LE(date,14);central.writeUInt32LE(crc,16);central.writeUInt32LE(body.length,20);central.writeUInt32LE(data.length,24);central.writeUInt16LE(nameBytes.length,28);
  central.writeUInt32LE(offset,42);
  locals.push(local,nameBytes,body);centrals.push(central,nameBytes);offset+=30+nameBytes.length+body.length;
 }
 const centralSize=centrals.reduce((n,b)=>n+b.length,0),end=Buffer.alloc(22);
 end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(centralSize,12);end.writeUInt32LE(offset,16);
 if(entries.length>0xFFFF||offset>0xFFFFFFFF)throw Error('Too large for a plain zip');
 return Buffer.concat([...locals,...centrals,end]);
}

function gitRevision(){try{return execFileSync('git',['-C',ROOT,'rev-parse','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch(_){return null;}}

export function packageItch({out=join(ROOT,'dist'),keepStage=false,revision=gitRevision(),deployedAt=new Date().toISOString().replace(/\.\d{3}Z$/,'Z')}={}){
 const version=JSON.parse(readFileSync(join(ROOT,'package.json'),'utf8')).version;
 const stage=mkdtempSync(join(tmpdir(),'kubono-itch-'));
 try{
  for(const path of GAME_PATHS)cpSync(join(ROOT,path),join(stage,path),{recursive:true});
  for(const path of SKIP)rmSync(join(stage,path),{force:true});
  setEdition({directory:stage,edition:'store'});
  // The build says which commit and when it was packaged; the worker copy exists only for the stamp and is then removed.
  if(revision){cpSync(join(ROOT,'sw.js'),join(stage,'sw.js'));cpSync(join(ROOT,'package.json'),join(stage,'package.json'));
   stampDeployment({directory:stage,revision,deployedAt});rmSync(join(stage,'sw.js'));rmSync(join(stage,'package.json'));}
  writeFileSync(join(stage,'index.html'),prepareIndex(readFileSync(join(stage,'index.html'),'utf8')));
  const files=listFiles(stage).map(path=>({name:relative(stage,path).split(sep).join('/'),data:readFileSync(path)}));
  if(!files.some(f=>f.name==='index.html'))throw Error('index.html must sit at the root of the zip');
  const bytes=files.reduce((n,f)=>n+f.data.length,0);
  if(files.length>=ITCH_LIMITS.files||bytes>=ITCH_LIMITS.bytes)throw Error(`Over the itch.io HTML5 limits: ${files.length} files, ${bytes} bytes`);
  const zip=zipFiles(files),dir=resolve(out);mkdirSync(dir,{recursive:true});
  const file=join(dir,`kubono-itch-${version}.zip`);writeFileSync(file,zip);
  return {zip:file,version,edition:'store',revision:revision||null,files:files.length,bytes,zipBytes:zip.length,stage:keepStage?stage:null};
 }finally{if(!keepStage&&existsSync(stage))rmSync(stage,{recursive:true,force:true});}
}

if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 try{
  const flags=process.argv.slice(2),options={};
  for(let i=0;i<flags.length;i++){
   const flag=flags[i];
   if(flag==='--keep-stage')options.keepStage=true;
   else if(['--out','--revision','--deployed-at'].includes(flag)&&flags[i+1])options[{'--out':'out','--revision':'revision','--deployed-at':'deployedAt'}[flag]]=flags[++i];
   else throw Error('Usage: node scripts/itch-package.mjs [--out DIR] [--keep-stage] [--revision SHA] [--deployed-at ISO_UTC]');
  }
  const result=packageItch(options),mb=n=>(n/1024/1024).toFixed(2)+' MB';
  console.log(JSON.stringify(result,null,1));
  console.log(`itch.io zip: ${result.zip}\n${result.files} files (limit ${ITCH_LIMITS.files}), ${mb(result.bytes)} unpacked, ${mb(result.zipBytes)} zipped (limit ${mb(ITCH_LIMITS.bytes)}).`);
 }catch(error){console.error(error.message);process.exitCode=1;}
}
