// Static release integrity, complementary to runtime/browser/audio verification.
import {readFileSync,readdirSync,existsSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url))),read=p=>readFileSync(join(root,p),'utf8'),errors=[],warnings=[];
const html=read('index.html'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]),idSet=new Set(ids);
if(ids.length!==idSet.size)errors.push('Duplicate HTML IDs');
const files=readdirSync(join(root,'src')).filter(n=>n.endsWith('.js')),imports=[],missingIDs=[];
for(const name of files){const source=read('src/'+name);
 for(const m of source.matchAll(/(?:from\s+|import\s*\()(['"])(\.[^'"]+)\1/g)){
  if(m[2].includes('${'))continue;const path=resolve(root,'src',m[2]);if(!existsSync(path))errors.push('Missing import: '+name+' → '+m[2]);imports.push([name,m[2]]);
 }
 for(const m of source.matchAll(/(?:runtime\.)?\$\((['"])([^'"]+)\1\)/g))if(!idSet.has(m[2]))missingIDs.push(name+': '+m[2]);
}
if(missingIDs.length)errors.push(...missingIDs.map(s=>'Missing UI ID: '+s));
const sw=read('sw.js'),shell=[...sw.match(/const SHELL=\[([\s\S]*?)\];/)[1].matchAll(/"([^"]+)"/g)].map(m=>m[1]);
for(const file of shell)if(!existsSync(resolve(root,file)))errors.push('Missing shell asset: '+file);
for(const file of files)if(!shell.includes('./src/'+file))errors.push('Uncached module: '+file);
const manifest=JSON.parse(read('manifest.webmanifest'));
for(const icon of manifest.icons)if(!shell.includes('./'+icon.src))errors.push('Uncached manifest icon: '+icon.src);
for(const name of ['silkscreen-OFL.txt','jetbrainsmono-OFL.txt'])if(!read('assets/fonts/'+name).includes('SIL OPEN FONT LICENSE'))errors.push('Missing font license: '+name);
for(const item of JSON.parse(read('assets/fonts/sources.json'))){const digest=createHash('sha256').update(readFileSync(join(root,'assets/fonts',item.file))).digest('hex');if(item.sha256!==digest)errors.push('Font/source hash mismatch: '+item.file);}
if(/https:\/\/fonts\./.test(html))errors.push('External font dependency remains');
for(const file of readdirSync(root).filter(n=>n.endsWith('.md'))){for(const m of read(file).matchAll(/\]\(([^)]+)\)/g)){const href=m[1].replace(/^<|>$/g,'').split('#')[0];if(href&&!href.includes('://')&&!existsSync(resolve(root,href)))warnings.push('Markdown reference: '+file+' → '+href);}}
const report={version:JSON.parse(read('package.json')).version,sourceModules:files.length,htmlIDs:ids.length,staticImports:imports.length,shellAssets:shell.length,errors,warnings,notes:['Checks source/UI/shell presence and font licenses/hashes; browser/audio/manual acceptance are separate.','Historical generator metadata retains retired patch/trail IDs for map compatibility; these are not playable systems.']};
const output=process.argv[2];if(output)writeFileSync(resolve(root,output),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));if(errors.length||warnings.length)process.exitCode=1;
