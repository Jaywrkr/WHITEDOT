import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const base='fd5dfc1939a4774714420d2098cfa3a2d38971bd';
// Panel 10 · P3–P8 (approved by Jay, 26 Oct 2026, D1–D6; PR #357 and #358 with full CI): main after P8. The files and
// musical sections those phases changed are held byte for byte to this commit instead of the E base.
const approved='5464612636520df3dfb69398bfe0b1edda0fb790';
const git=(...args)=>execFileSync('git',args),before=(path,ref=base)=>git('show',ref+':'+path),source=path=>readFileSync(path,'utf8');
const sha=data=>createHash('sha256').update(data).digest('hex');
const allowed=new Set(['src/accessibility.js','src/audio.js','src/canvas.js','src/collection-garden.js','src/favorites.js','src/journal.js','src/journey-finale.js','src/journey-garden.js','src/journey-pulse.js','src/journey-rhythm.js','src/house.js','src/places.js','src/rare-cards.js','src/refugio-lugares.js','src/release-info.js','src/song-stage.js','src/voice-guide.js',
 // Panel 10 · P1 (approved by Jay, 26 Oct 2026): visual only. The map legend as separate items; the off-screen portal light at the heading.
 'src/map.js','src/places-ring.js',
 // Panel 10 · P2 (approved by Jay, 26 Oct 2026): menus reordered and renamed, D6 = A (no sign-up or deletion while the cloud is paused).
 'src/account-entry.js','src/cloud-account.js','src/cloud-config.js','src/controls.js','src/creative.js','src/journey-mode.js','src/share-tools.js','src/ui.js']);
// Changed by P3–P8: P3 Journey lessons, P4 results and drops, P5 light at the heard note and the soft pulse, P6 the finale
// of the eleven (D5), P7 earned colour (D4), P8 counters and Refugio rooms (D3).
const rebased=new Set(['src/achievements.js','src/cajas.js','src/color-safe.js','src/crystal-sparks.js','src/cube-shop-sound.js','src/cube.js','src/cultures.js','src/data.js','src/discovery.js','src/ecology.js','src/encounter-depth.js','src/feedback.js','src/fxpad.js','src/glass.js','src/house-capsules.js','src/house-model.js','src/initiative.js','src/interactions.js','src/jam.js','src/journey-chain.js','src/journey-chapters.js','src/journey-dance.js','src/journey-echo.js','src/journey-games.js','src/journey-guide.js','src/journey-hint.js','src/journey-lasso.js','src/journey-moments.js','src/journey-rebuild.js','src/journey-resonance.js','src/journey-stick.js','src/journey-surf.js','src/journey-victory.js','src/landmarks.js','src/materia.js','src/micro-instruments.js','src/mirrors.js','src/onboarding-model.js','src/patches.js','src/percussion.js','src/phenomena.js','src/pixel-life.js','src/player-profile.js','src/quietud.js','src/render.js','src/save-store.js','src/sharing.js','src/song.js','src/sparks.js','src/studio.js','src/universe-layers.js','src/vida.js','src/world-fauna.js','src/world-light.js','src/world-sheet.js','src/world-visibility.js']);
const files=git('ls-tree','-r','--name-only','-z',base,'--','src','assets').toString().split('\0').filter(Boolean),protectedFiles=[];
for(const file of files.filter(f=>!allowed.has(f))){const a=before(file,rebased.has(file)?approved:base),b=readFileSync(file);if(!a.equals(b))throw Error('Protected content changed: '+file);protectedFiles.push({file,sha256:sha(b)});}
const contracts=[];
function section(text,from,to){const a=text.indexOf(from),b=text.indexOf(to,a+from.length);if(a<0||b<0)throw Error('Missing preservation boundary '+from);return text.slice(a,b);}
function sameSection(file,from,to,label,ref=base){const a=section(before(file,ref).toString(),from,to),b=section(source(file),from,to);if(a!==b)throw Error('Changed '+label);contracts.push({label,file,sha256:sha(b)});}
sameSection('src/song-stage.js','export function songPlan','export function initialize','complete final11 plan, notes, harmony and events as approved in P6 (D1, D5)',approved);
sameSection('src/journey-finale.js','export const CHAPTER_COLORS','export function initialize','complete final5 score, arrangement and audio output as approved in P6 (D5-C)',approved);
sameSection('src/journey-pulse.js',' function judge(',' function draw(','pulse judgement, note selection and recorded timing');
sameSection('src/journey-garden.js','import {calmMotion','export const gardenProgress','garden positions, rules, growth and save normalization as approved in P3',approved);
sameSection('src/places.js','const object=','export function gameObjective','star rules, migration and existing open places');
sameSection('src/places.js',' function start(',' // The round\'s card:','round execution, reward, restore and failed-save rollback as approved in P4–P6',approved);
sameSection('src/collection-garden.js',' function build(',' function definition(','successful card voices, instruments, timbres and garden score');
sameSection('src/journey-rhythm.js','export const RHYTHMS','export function initialize','all rhythm patterns, judgement grid and timing rules');
sameSection('src/house.js',' function brush(',' function cubeAt(','Refugio object proximity and audible brush scheduling');
sameSection('src/house.js','housePulse:{get:()=>','houseSounds:{get:()=>','Refugio pulse notes, proximity, ordering and sound scheduling');
const singFrom=' function sing(',singTo=' // The step being sung now';
const oldSing=section(before('src/journey-rhythm.js').toString(),singFrom,singTo),newSing=section(source('src/journey-rhythm.js'),singFrom,singTo).replace('sung.push(singing.last);if(sung.length>32)sung.shift();','');
if(oldSing!==newSing)throw Error('Changed rhythm demonstration music');
contracts.push({label:'rhythm demonstration audio identical beyond visual history queue',file:'src/journey-rhythm.js',sha256:sha(newSing)});
// The finale's scheduling: E added a visual history queue; P6 (D5-A) lets the finale start at the end of a round's drop.
sameSection('src/song-stage.js',' function step(',' // How hard a layer','finale audio scheduling as approved in P6 (D5-A)',approved);
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
if(shell!==before('sw.js',approved).toString().replace(/const CACHE\s*=\s*['"][^'"]+['"]/,"const CACHE='VERSION'"))throw Error('Offline shell changed beyond its release key');
const runtimeFiles=[...readdirSync('src').filter(n=>n.endsWith('.js')).sort().map(n=>'src/'+n),...readdirSync('styles').filter(n=>n.endsWith('.css')).sort().map(n=>'styles/'+n),'index.html','package.json','sw.js'],hash=createHash('sha256');
for(const file of runtimeFiles)hash.update(file+'\0').update(readFileSync(file));
const report={base,revision:git('rev-parse','HEAD').toString().trim(),version:JSON.parse(source('package.json')).version,runtimeDigest:hash.digest('hex'),runtimeDirty:spawnSync('git',['diff','--quiet','HEAD','--','src','styles','assets','index.html','package.json','sw.js']).status!==0,protectedFiles,contracts,scope:'Byte preservation and exact protected musical functions; no perceptual listening or human acceptance implied.'};
if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({version:report.version,protectedFiles:protectedFiles.length,contracts:contracts.length,runtimeDigest:report.runtimeDigest,runtimeDirty:report.runtimeDirty}));
