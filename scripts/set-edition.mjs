// Stamp the edition into a staged copy of the game (L1). Packagers (Android release, itch.io zip) run it on their
// copy; the source tree keeps 'web'. Usage: node scripts/set-edition.mjs --dir STAGED_COPY --edition store
import {readFileSync,writeFileSync,realpathSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {EDITIONS} from '../src/edition.js';
const ROOT=resolve(fileURLToPath(new URL('..',import.meta.url)));
const PATTERN=/export const EDITION='[^']*';/;
export function setEdition({directory,edition}){
 if(!directory)throw Error('Supply --dir with the staged copy of the game');
 if(!EDITIONS.includes(edition))throw Error('Edition must be one of: '+EDITIONS.join(', '));
 const dir=resolve(directory);
 if(realpathSync(dir)===realpathSync(ROOT))throw Error('Stamp a staged copy, never the source tree');
 const file=join(dir,'src/edition.js'),source=readFileSync(file,'utf8');
 if(!PATTERN.test(source))throw Error('Missing edition flag in '+file);
 writeFileSync(file,source.replace(PATTERN,`export const EDITION='${edition}';`));
 return {directory:dir,edition};
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 try{
  const flags=process.argv.slice(2),args=Object.fromEntries(flags.flatMap((f,i)=>i%2===0?[[f,flags[i+1]]]:[]));
  if(flags.length!==4||!('--dir' in args)||!('--edition' in args))throw Error('Usage: node scripts/set-edition.mjs --dir STAGED_COPY --edition store|web');
  console.log(JSON.stringify(setEdition({directory:args['--dir'],edition:args['--edition']})));
 }catch(error){console.error(error.message);process.exitCode=1;}
}
