import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const base='fd5dfc1939a4774714420d2098cfa3a2d38971bd';
const git=(...args)=>execFileSync('git',args),before=path=>git('show',base+':'+path),source=path=>readFileSync(path,'utf8');
const sha=data=>createHash('sha256').update(data).digest('hex');
const allowed=new Set(['src/accessibility.js','src/audio.js','src/canvas.js','src/collection-garden.js','src/favorites.js','src/journal.js','src/journey-finale.js','src/journey-garden.js','src/journey-pulse.js','src/places.js','src/rare-cards.js','src/refugio-lugares.js','src/release-info.js','src/song-stage.js','src/voice-guide.js']);
const files=git('ls-tree','-r','--name-only','-z',base,'--','src','assets').toString().split('\0').filter(Boolean),protectedFiles=[];
for(const file of files.filter(f=>!allowed.has(f))){const a=before(file),b=readFileSync(file);if(!a.equals(b))throw Error('Protected content changed: '+file);protectedFiles.push({file,sha256:sha(b)});}
const contracts=[];
function section(text,from,to){const a=text.indexOf(from),b=text.indexOf(to,a+from.length);if(a<0||b<0)throw Error('Missing preservation boundary '+from);return text.slice(a,b);}
function sameSection(file,from,to,label){const a=section(before(file).toString(),from,to),b=section(source(file),from,to);if(a!==b)throw Error('Changed '+label);contracts.push({label,file,sha256:sha(b)});}
sameSection('src/song-stage.js','export function songPlan','export function initialize','complete final11 plan, notes, harmony and events');
sameSection('src/journey-finale.js','export const CHAPTER_COLORS','export function initialize','complete final5 score, arrangement and audio output');
sameSection('src/journey-pulse.js',' function judge(',' function draw(','pulse judgement, note selection and recorded timing');
sameSection('src/journey-garden.js','import {calmMotion','export const gardenProgress','garden positions, rules, growth and save normalization');
sameSection('src/places.js','const object=','export function gameObjective','star rules, migration and existing open places');
sameSection('src/places.js',' function start(',' // The round\'s card:','round execution, reward, restore and failed-save rollback');
sameSection('src/collection-garden.js',' function build(',' function definition(','successful card voices, instruments, timbres and garden score');
let audio=before('src/audio.js').toString();
const replacements=[
 ["import {onTime,audibleTime} from './journey-pulse.js';","import {onTime,audibleTime,scheduleAudibleCue} from './journey-pulse.js';"],
 ['runtime.studioHit[key]=performance.now()+(t-ac.currentTime)*1000','scheduleAudibleCue(runtime,t,()=>{runtime.studioHit[key]=performance.now();})'],
 ['f.hit=performance.now()+(t-ac.currentTime)*1000','scheduleAudibleCue(runtime,t,()=>{f.hit=performance.now();})'],
 ['setTimeout(()=>{o.lit=1;o.hit=1;},Math.max(0,(t-ac.currentTime)*1000))','scheduleAudibleCue(runtime,t,()=>{o.lit=1;o.hit=1;})'],
 ['setTimeout(()=>{o.lit=1;},Math.max(0,(t-ac.currentTime)*1000))','scheduleAudibleCue(runtime,t,()=>{o.lit=1;})'],
 ['setTimeout(it.vis,Math.max(0,(t2-ac.currentTime)*1000))','scheduleAudibleCue(runtime,t2,it.vis)']
];
for(const [a,b]of replacements){if(audio.split(a).length!==2)throw Error('Ambiguous visual-only change');audio=audio.replace(a,b);}
if(audio!==source('src/audio.js'))throw Error('Audio differs beyond the six authorized visual-only replacements');
contracts.push({label:'audio engine unchanged beyond six visual-only replacements',file:'src/audio.js',sha256:sha(audio)});
const shell=source('sw.js').replace(/const CACHE\s*=\s*['"][^'"]+['"]/,"const CACHE='VERSION'");
if(shell!==before('sw.js').toString().replace(/const CACHE\s*=\s*['"][^'"]+['"]/,"const CACHE='VERSION'"))throw Error('Offline shell changed beyond its release key');
const runtimeFiles=[...readdirSync('src').filter(n=>n.endsWith('.js')).sort().map(n=>'src/'+n),...readdirSync('styles').filter(n=>n.endsWith('.css')).sort().map(n=>'styles/'+n),'index.html','package.json','sw.js'],hash=createHash('sha256');
for(const file of runtimeFiles)hash.update(file+'\0').update(readFileSync(file));
const report={base,revision:git('rev-parse','HEAD').toString().trim(),version:JSON.parse(source('package.json')).version,runtimeDigest:hash.digest('hex'),runtimeDirty:spawnSync('git',['diff','--quiet','HEAD','--','src','styles','assets','index.html','package.json','sw.js']).status!==0,protectedFiles,contracts,scope:'Byte preservation and exact protected musical functions; no perceptual listening or human acceptance implied.'};
if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({version:report.version,protectedFiles:protectedFiles.length,contracts:contracts.length,runtimeDigest:report.runtimeDigest,runtimeDirty:report.runtimeDirty}));
