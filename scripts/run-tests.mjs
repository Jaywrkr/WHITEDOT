import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const files=readdirSync(new URL('../tests/',import.meta.url)).filter(f=>f.endsWith('.mjs')&&f!=='audio_mix.mjs').sort();
for(const file of files){const result=spawnSync(process.execPath,['tests/'+file],{stdio:'inherit'});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);}
console.log(`PASS: ${files.length} Node suites with assertions (Web Audio helper excluded)`);
