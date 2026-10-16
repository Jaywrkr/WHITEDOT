import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {resolve,dirname,relative,sep} from 'node:path';
// A dependency selector, not a replacement for the complete release suite.
export function affectedTests(root,changes){
 root=resolve(root);const changed=new Set(changes.map(p=>p.replaceAll('\\','/'))),memo=new Map();
 const inside=p=>p===root||p.startsWith(root+sep),name=p=>relative(root,p).replaceAll('\\','/');
 function dependencies(file){
  if(memo.has(file))return memo.get(file);const deps=[],dirs=[];let uncertain=false;
  if(existsSync(file)&&/\.(?:m?js)$/.test(file)){
   const source=readFileSync(file,'utf8');
   // Follow imports and literal resource paths used by source-contract tests.
   for(const match of source.matchAll(/['"]((?:\.\.?\/|src\/|tests\/|scripts\/|styles\/)[^'"\n]+)['"]/g)){
    const spec=match[1],path=resolve(spec.startsWith('.')?dirname(file):root,spec);
    if(!inside(path))continue;
    if(existsSync(path)&&statSync(path).isDirectory())dirs.push(name(path)+'/');else deps.push(path);
   }
   uncertain=/\bimport\(\s*[^\s'"`]/.test(source);
   // Computed filesystem walks cannot be proven unrelated by this small selector.
   if(/\breaddirSync\s*\(/.test(source))uncertain=true;
  }
  const value={deps,dirs,uncertain};memo.set(file,value);return value;
 }
 return readdirSync(resolve(root,'tests')).filter(f=>f.endsWith('.mjs')&&f!=='audio_mix.mjs').sort().filter(test=>{
  const pending=[resolve(root,'tests',test)],seen=new Set();
  while(pending.length){const file=pending.pop();if(seen.has(file))continue;seen.add(file);if(changed.has(name(file)))return true;
   const d=dependencies(file);if(d.uncertain&&[...changed].some(p=>/^(src|scripts|tests)\//.test(p)))return true;
   if(d.dirs.some(dir=>[...changed].some(p=>p.startsWith(dir))))return true;pending.push(...d.deps);
  }return false;
 });
}
