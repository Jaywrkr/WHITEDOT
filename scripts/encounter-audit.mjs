import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {sampleEncounterHour,summarizeEncounters,ENCOUNTER_MODEL_VERSION,ENCOUNTER_LIMITS} from './encounter-model.mjs';
const args=process.argv.slice(2),options={routes:192,layout:'classic',generation:2,output:null};
for(let i=0;i<args.length;i+=2){const key=args[i]?.replace(/^--/,'');if(!['routes','layout','generation','output'].includes(key)||args[i+1]===undefined)throw Error('Use --routes N --layout classic|wide|vasto|grand|immense --generation 1|2 --output file.json');options[key]=['routes','generation'].includes(key)?Number(args[i+1]):args[i+1];}
if(!Number.isInteger(options.routes)||options.routes<1||options.routes>4096)throw Error('Use 1–4096 routes per profile');
const profiles={};for(const mode of ['explore','still']){
 const samples=Array.from({length:options.routes},(_,route)=>sampleEncounterHour({seed:'encuentros-'+route%6,route,layout:options.layout,generation:options.generation,mode}));
 profiles[mode]={protocol:{seconds:3600,movingSeconds:samples[0].movingSeconds,listeningSeconds:samples[0].listeningSeconds,nominalSpeed:190,proximityRadius:180,layout:options.layout,generation:options.generation,seeds:Math.min(6,options.routes),routeCount:samples.length},outcomes:summarizeEncounters(samples),routes:samples.map(({seen,...details})=>({...details,types:seen.length}))};
}
const sourceHash=createHash('sha256');
for(const name of readdirSync(new URL('../src/',import.meta.url)).filter(n=>n.endsWith('.js')).sort())sourceHash.update(name).update(readFileSync(new URL('../src/'+name,import.meta.url)));
for(const name of ['encounter-model.mjs','encounter-audit.mjs'])sourceHash.update(name).update(readFileSync(new URL(name,import.meta.url)));
const report={modelVersion:ENCOUNTER_MODEL_VERSION,sourceTreeSHA256:sourceHash.digest('hex'),packageVersion:JSON.parse(readFileSync(new URL('../package.json',import.meta.url))).version,limits:ENCOUNTER_LIMITS,missingOutcomes:'An absent key is unobserved, not impossible. Cards earned and audible music are not estimated.',profiles};
if(options.output)writeFileSync(options.output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(options.output?{output:options.output,modelVersion:ENCOUNTER_MODEL_VERSION,profiles:Object.fromEntries(Object.entries(profiles).map(([mode,p])=>[mode,{...p.protocol,observedTypes:Object.keys(p.outcomes).length,boxes:p.outcomes.box||null,magicalRelic:p.outcomes['relic:magical']||null}]))}:report,null,2));
