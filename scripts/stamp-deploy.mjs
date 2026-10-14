// The host supplies its publication timestamp; this tool never guesses from Git or the clock.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {deploymentTime,releaseVersion} from '../src/release-model.js';
export function stampDeployment({directory,deployedAt,revision}){
 if(!directory)throw Error('Supply --dir with the publication artifact directory');
 const time=deploymentTime(deployedAt);if(!time)throw Error('Supply a real --deployed-at ISO UTC timestamp');
 if(!/^[a-f0-9]{7,40}$/.test(revision||''))throw Error('Supply --revision with the published Git revision');
 const dir=resolve(directory),version=JSON.parse(readFileSync(join(dir,'package.json'),'utf8')).version;
 if(!releaseVersion(version))throw Error('Invalid release version');
 const swPath=join(dir,'sw.js'),sw=readFileSync(swPath,'utf8');
 if(!/const CACHE='[^']+';/.test(sw))throw Error('Missing SW release cache');
 const info=join(dir,'src/release-info.js');readFileSync(info,'utf8');
 const release={version,deployedAt:time,revision};
 writeFileSync(info,'// Publication metadata supplied by the host.\nexport const RELEASE=Object.freeze('+JSON.stringify(release)+');\n');
 const cache=`whitedot-${version}-${time.replace(/[^0-9]/g,'')}-${revision.slice(0,7)}`;
 writeFileSync(swPath,sw.replace(/const CACHE='[^']+';/,`const CACHE='${cache}';`));
 return {directory:dir,...release,cache};
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 try{
  const flags=process.argv.slice(2),allowed=['--dir','--deployed-at','--revision'];
  if(flags.length!==6||flags.some((f,i)=>i%2===0&&!allowed.includes(f))||new Set(flags.filter((_,i)=>i%2===0)).size!==3)throw Error('Usage: node scripts/stamp-deploy.mjs --dir ARTIFACT --deployed-at ISO_UTC --revision SHA');
  const args=Object.fromEntries(flags.flatMap((f,i)=>i%2===0?[[f,flags[i+1]]]:[]));
  console.log(JSON.stringify(stampDeployment({directory:args['--dir'],deployedAt:args['--deployed-at'],revision:args['--revision']}),null,2));
 }catch(error){console.error(error.message);process.exitCode=1;}
}
