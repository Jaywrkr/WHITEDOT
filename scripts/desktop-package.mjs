// L4 · Desktop builds for itch.io (and later Steam). The game is the sale-edition folder from itch-package.mjs; desktop/
// adds the Electron wrapper (main.cjs, serve.cjs). @electron/packager lives in desktop/node_modules, outside Git and
// outside the game. Writes dist/desktop/Kubono-<platform>-<arch>/ and its archive. Usage:
//   (cd desktop && npm ci) && node scripts/desktop-package.mjs [--platform linux|win32|darwin|all] [--arch x64|arm64|universal]
//     [--out DIR] [--no-archive] [--revision SHA]
//   node scripts/desktop-package.mjs --run        stage the app and open it with the local Electron (development)
import {cpSync,readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync,existsSync,statSync,readdirSync,chmodSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync,spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {packageItch} from './itch-package.mjs';
const ROOT=resolve(fileURLToPath(new URL('..',import.meta.url))),DESKTOP=join(ROOT,'desktop');
const require=createRequire(join(DESKTOP,'package.json'));
export const {APP_ID}=require('./serve.cjs');
export const WRAPPER_FILES=Object.freeze(['main.cjs','serve.cjs']);
export const TARGETS=Object.freeze({linux:['x64'],win32:['x64'],darwin:['universal']});

// Icons from the game's own PNGs. ICO and ICNS may hold PNG data as is (Windows Vista+, macOS 10.7+): no image library.
export function makeIco(pngs){
 const header=Buffer.alloc(6);header.writeUInt16LE(1,2);header.writeUInt16LE(pngs.length,4);
 const entries=[],bodies=[];let offset=6+16*pngs.length;
 for(const png of pngs){const w=png.readUInt32BE(16),h=png.readUInt32BE(20),e=Buffer.alloc(16);
  e.writeUInt8(w>=256?0:w,0);e.writeUInt8(h>=256?0:h,1);e.writeUInt16LE(1,4);e.writeUInt16LE(32,6);e.writeUInt32LE(png.length,8);e.writeUInt32LE(offset,12);
  entries.push(e);bodies.push(png);offset+=png.length;}
 return Buffer.concat([header,...entries,...bodies]);
}
export function makeIcns(entries){ // [[type,png]], e.g. ['ic09',png512]
 const blocks=entries.map(([type,png])=>{const h=Buffer.alloc(8);h.write(type,0,'ascii');h.writeUInt32BE(png.length+8,4);return Buffer.concat([h,png]);});
 const size=8+blocks.reduce((n,b)=>n+b.length,0),h=Buffer.alloc(8);h.write('icns',0,'ascii');h.writeUInt32BE(size,4);
 return Buffer.concat([h,...blocks]);
}
// Windows wants a numeric x.y.z.w version: 2.3.0-alpha.225 → 2.3.0.225.
export function numericVersion(version){const m=/^(\d+)\.(\d+)\.(\d+)(?:-[a-z]+\.(\d+))?$/.exec(version);if(!m)throw Error('Unexpected version '+version);return `${m[1]}.${m[2]}.${m[3]}.${m[4]||0}`;}

// The app folder Electron runs: the wrapper, a package.json made here and game/ = the sealed sale edition.
export function stageApp({dir,revision}={}){
 const version=JSON.parse(readFileSync(join(ROOT,'package.json'),'utf8')).version;
 const scratch=mkdtempSync(join(tmpdir(),'kubono-desktop-'));
 try{
  const itch=packageItch({out:scratch,keepStage:true,...(revision?{revision}:{})});
  rmSync(dir,{recursive:true,force:true});mkdirSync(dir,{recursive:true});
  cpSync(itch.stage,join(dir,'game'),{recursive:true});rmSync(itch.stage,{recursive:true,force:true});
  for(const f of WRAPPER_FILES)cpSync(join(DESKTOP,f),join(dir,f));
  writeFileSync(join(dir,'package.json'),JSON.stringify({name:'kubono',productName:'Kubono',version,private:true,main:'main.cjs',description:'Kubono'},null,1)+'\n');
  return {dir,version,files:itch.files,bytes:itch.bytes};
 }finally{rmSync(scratch,{recursive:true,force:true});}
}

const sha256=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
const has=cmd=>spawnSync(cmd,['--help'],{stdio:'ignore'}).error===undefined;
const dirBytes=dir=>readdirSync(dir,{withFileTypes:true}).reduce((n,e)=>{const p=join(dir,e.name);return n+(e.isSymbolicLink()?0:e.isDirectory()?dirBytes(p):statSync(p).size);},0);

function archive(folder,platform,name){
 const parent=dirname(folder),base=folder.slice(parent.length+1);
 if(platform==='linux'){const out=join(parent,name+'.tar.gz');execFileSync('tar',['-czf',out,'-C',parent,base]);return out;}
 const out=join(parent,name+'.zip');rmSync(out,{force:true});
 // macOS: ditto keeps the bundle's symlinks, permissions and signatures; elsewhere zip -y keeps the symlinks.
 if(process.platform==='darwin')execFileSync('ditto',['-c','-k','--sequesterRsrc','--keepParent',folder,out]);
 else if(has('zip'))execFileSync('zip',['-qry9',out,base],{cwd:parent});
 else throw Error('zip is needed to archive the '+platform+' build');
 return out;
}

export async function packageDesktop({platforms=[process.platform],arch=null,out=join(ROOT,'dist','desktop'),archiveBuilds=true,revision}={}){
 const {packager}=await import(pathToFileURL(require.resolve('@electron/packager')).href);
 const electronVersion=JSON.parse(readFileSync(require.resolve('electron/package.json'),'utf8')).version;
 const work=mkdtempSync(join(tmpdir(),'kubono-desktop-app-'));
 try{
  const app=stageApp({dir:join(work,'app'),revision});
  const icons=join(work,'icons');mkdirSync(icons);
  const png=n=>readFileSync(join(app.dir,'game','icons',n));
  writeFileSync(join(icons,'kubono.ico'),makeIco([png('icon-192.png'),png('icon-512.png')]));
  writeFileSync(join(icons,'kubono.icns'),makeIcns([['ic09',png('icon-512.png')]]));
  writeFileSync(join(icons,'kubono.png'),png('icon-512.png'));
  mkdirSync(out,{recursive:true});const builds=[];
  for(const platform of platforms)for(const a of arch?[arch]:TARGETS[platform]){
   const [folder]=await packager({dir:app.dir,out,platform,arch:a,electronVersion,overwrite:true,asar:false,prune:false,quiet:true,
    name:'Kubono',executableName:platform==='linux'?'kubono':'Kubono',appVersion:app.version,buildVersion:numericVersion(app.version),
    appBundleId:APP_ID,appCategoryType:'public.app-category.music-games',appCopyright:'© 2026 Kubono',icon:join(icons,'kubono'),
    win32metadata:{CompanyName:'Kubono',FileDescription:'Kubono',ProductName:'Kubono',InternalName:'Kubono',OriginalFilename:'Kubono.exe'},
    ignore:[/^\/node_modules($|\/)/]});
   // macOS on a Mac: ad-hoc signature over the renamed bundle, so it opens as «unidentified developer», not «damaged».
   if(platform==='darwin'&&process.platform==='darwin')execFileSync('codesign',['--force','--deep','--sign','-',join(folder,'Kubono.app')]);
   chmodSync(folder,0o755);
   const build={platform,arch:a,folder,bytes:dirBytes(folder)};
   if(archiveBuilds){build.archive=archive(folder,platform,`kubono-${app.version}-${platform==='win32'?'windows':platform==='darwin'?'macos':'linux'}-${a}`);build.archiveBytes=statSync(build.archive).size;build.sha256=sha256(build.archive);}
   builds.push(build);
  }
  // One SHA256SUMS.txt for every archive in the folder: earlier lines for other files are kept.
  if(archiveBuilds){const sums=join(out,'SHA256SUMS.txt'),names=new Set(builds.map(b=>b.archive.slice(out.length+1)));
   const kept=existsSync(sums)?readFileSync(sums,'utf8').split('\n').filter(l=>l&&!names.has(l.split('  ')[1])&&existsSync(join(out,l.split('  ')[1]))):[];
   writeFileSync(sums,[...kept,...builds.map(b=>`${b.sha256}  ${b.archive.slice(out.length+1)}`)].sort((x,y)=>x.split('  ')[1].localeCompare(y.split('  ')[1])).join('\n')+'\n');}
  return {version:app.version,electronVersion,appId:APP_ID,gameFiles:app.files,gameBytes:app.bytes,builds};
 }finally{rmSync(work,{recursive:true,force:true});}
}

if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 try{
  if(!existsSync(join(DESKTOP,'node_modules','@electron','packager')))throw Error('Run first: (cd desktop && npm ci)');
  const flags=process.argv.slice(2),options={};let run=false;
  for(let i=0;i<flags.length;i++){
   const flag=flags[i];
   if(flag==='--run')run=true;
   else if(flag==='--no-archive')options.archiveBuilds=false;
   else if(flag==='--platform'&&flags[i+1]){const p=flags[++i];options.platforms=p==='all'?Object.keys(TARGETS):[p];if(!options.platforms.every(x=>TARGETS[x]))throw Error('Unknown platform '+p);}
   else if(['--arch','--out','--revision'].includes(flag)&&flags[i+1])options[flag.slice(2)]=flags[++i];
   else throw Error('Usage: node scripts/desktop-package.mjs [--platform linux|win32|darwin|all] [--arch x64|arm64|universal] [--out DIR] [--no-archive] [--revision SHA] | --run');
  }
  if(run){
   const dir=join(ROOT,'dist','desktop-dev');stageApp({dir});
   const electron=require('electron');
   const r=spawnSync(electron,[dir,...(process.getuid?.()===0?['--no-sandbox']:[])],{stdio:'inherit'});process.exitCode=r.status??1;
  }else{
   const result=await packageDesktop(options),mb=n=>(n/1024/1024).toFixed(1)+' MB';
   for(const b of result.builds)console.log(`${b.platform}-${b.arch}: ${b.folder} (${mb(b.bytes)})`+(b.archive?` → ${b.archive} (${mb(b.archiveBytes)})`:''));
   console.log(`Kubono ${result.version}, Electron ${result.electronVersion}, app ID ${result.appId} (provisional), game ${result.gameFiles} files.`);
  }
 }catch(error){console.error(error.stack||error.message);process.exitCode=1;}
}
