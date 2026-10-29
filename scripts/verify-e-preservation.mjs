import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const base='fd5dfc1939a4774714420d2098cfa3a2d38971bd';
// Panel 10 · P3–P8 (approved by Jay, 26 Oct 2026, D1–D6; PR #357 and #358 with full CI): main after P8. The files and
// musical sections those phases changed are held byte for byte to this commit instead of the E base.
const approved='5464612636520df3dfb69398bfe0b1edda0fb790';
// Panel 11 · Q1–Q6 (approved by Jay, 27 Oct 2026, D7, D10, D11): the files and sections those phases changed are held
// byte for byte to the end of Q6 and its CI fixes.
const approvedQ='4183856c414a84e18b2120ded87ee422703668e5';
// Panel 11 · Q7 (Jay heard the renders and approved them, 27 Oct 2026, D8, D9 and dub techno): both finales are held to
// the Q7 commit.
const approvedQ7='fce8496900f3ef3ac97928ba5449e8c30140cb0d';
// Launch · L1 and L2 (Jay, 27 Oct 2026): the sale edition without cloud and the English texts. main.js, messages.js and the
// offline shell (two new modules) are held to the end of L2.
const approvedL='57a6d579acb0aa751d509b21d0ba9dd191e85226';
const rebasedL=new Set(['src/main.js','src/messages.js']);
const approvedL4='12e02e9116469517e555dab72021bf6633a024e1';
const rebasedL4=new Set(['src/pwa.js']);
// Jay's notes on alpha.225 (27 Oct 2026, alpha.226): lighter rain, no jump inside levels and the jump after the Journey,
// the short magic box line and ?rapido=1. These protected files are held to that commit; the finale's score and
// arrangement stay held to Q7 by their own contract below.
const approvedR2='e19b0939dfecd292c0523980e7aead28eba4ffaf';
const rebasedR2=new Set(['src/chapter-test.js']);
const approvedM1='702ed7aa24907df53768791d16f9b7c7820d1c77';
const rebasedM1=new Set(['src/celebration.js','src/chapter-test.js','src/main.js','src/practice-travel.js','src/progress.js','src/sparks.js','src/world-weather.js']);
// Living encounters, batch 1 (Jay, 27 Oct 2026, alpha.227): the engine is hooked into the frame, main and the mischief
// scenes (one at a time), the Bitácora gets its group, and the sparks go up (rounds, activities, mischief). These protected
// files and the offline shell (three new modules) are held to that commit; the music's contracts below are untouched.
const approvedE1='8f0eabbce9a208afc739fe2a0b47ca6f93927be4';
const rebasedE1=new Set(['src/content-manifest.js','src/element-book-model.js','src/main.js','src/render.js','src/spark-rules.js','src/universe-activities.js','src/universe-mischief-art.js','src/universe-mischief.js']);
// Jay's fixes A–E after alpha.229 (28 Oct 2026, alpha.230): ?rapido=2 short for real (two Camino crystals, the portal
// after one second, the Vacío's sky kept), the jump and the other land only after the eleven places, «Estilos» hidden.
// These protected files are held to that commit; the music's contracts below are untouched.
const approvedAE='e937e85b2f2bf57be8649fdced7de2adb965067f';
const rebasedAE=new Set(['src/chapter-test.js','src/crystal-sparks.js','src/journey-chapters.js','src/journey-release.js','src/music-travel.js','src/practice-travel.js','src/sparks.js']);
// F1 · Mapa del cielo (Jay, 28 Oct 2026, alpha.231): the figures are hooked into main and the frame (tick, draw, the
// star halo round the cube), the mischief scenes wait for them (one at a time), Tu cubo's preview wears the halo, and
// the offline shell lists three new modules. These protected files and the shell are held to that commit; the music's
// contracts below are untouched.
const approvedF1='10c3c64ee64778c034885f05b0e51912faf0289b';
const rebasedF1=new Set(['src/cube.js','src/main.js','src/render.js','src/universe-mischief.js']);
// Jay's fixes G1–G3 after alpha.231 (28 Oct 2026, alpha.232): main loads the note after the eleven places, the «Paseo
// musical» achievement is retired with its button, and the offline shell lists one new module. These protected files
// and the shell are held to that commit; the music's contracts below are untouched.
const approvedG='cff410355ceff34c96c103e5b4d535018b477882';
const rebasedG=new Set(['src/achievement-metadata.js','src/main.js']);
// H1 · Chispas solo en el universo (Jay, 28 Oct 2026, alpha.233): levels give ★ and the song, never ✦ (rounds, remix,
// the Camino, nothing paid inside a level, the ✦ counter hidden there); the open universe pays more (crystals ×3,
// encounters, sky, activities, mischief, wild spark); help texts in English; the offline shell only changes its key.
// Jay's correction (PR #374): no inflation, a loose spark 1 (2 on time), the rest by one rule (base × difficulty ×
// distance × rarity). These protected files and the shell are held to that commit, after the merge of main (alpha.232,
// with G), so G's changes (main.js, the shell's new module) are in it; the music's contracts are untouched.
const approvedH1='00cbf87dd7d25e0d2233c9f57aa2a4bd3c0f8122';
const rebasedH1=new Set(['src/crystal-play-model.js','src/crystal-sparks.js','src/i18n-en.js','src/live-encounters-model.js','src/sky-map-model.js','src/spark-rules.js','src/sparks.js','src/universe-activities.js','src/universe-mischief.js','src/wild.js']);
// H2 · Refugio simple (Jay, 28 Oct 2026, alpha.234): the house plays its objects only while you listen (house-audio.js,
// same notes and rooms), the Prism and the Taller's disc leave Eco for «Más» (house-capsules.js) and one notice replaces
// the ready-capsule line (house-guide.js); the offline shell lists one new module. Held to the merge of main (alpha.233,
// with G and H1) into jay/h2-refugio, so the shell holds every module once.
const approvedH2='b8f103e711339f48b1a8cf2f2e8e0de47b3fd273';
const rebasedH2=new Set(['src/house-audio.js','src/house-capsules.js','src/house-guide.js']);
// Mapa del universo (Jay, 29 Oct 2026, alpha.235: «el mapa tiene que ser perfecto»): the map's English strings and the
// offline shell's three new modules. Held to the merge of main (alpha.234, with the Refugio) into jay/mapa-universo; the music's contracts
// are untouched (the map makes no sound).
const approvedM='b79757387779417bf82ed1f988235130dd28b5bb';
const rebasedM=new Set(['src/i18n-en.js']);
// Ganas de volver (Jay, 29 Oct 2026, alpha.236): main starts the sky of days and the universe letter, their English
// strings, and the offline shell's two new modules. Held to the commit of jay/volver; the music's contracts are untouched
// (nothing new sounds).
const approvedV='10fb6856f431c525b92146aa5ba086fd050ff8b9';
const rebasedV=new Set(['src/i18n-en.js','src/main.js']);
// Ritmo (Jay, 29 Oct 2026, alpha.237): Eco, the final duel, the ghost and the combo inside the eleven places. Their
// English strings and the offline shell's two new modules (ritmo.js, ritmo-model.js) are held to the merge of main (alpha.236) into jay/ritmo; the
// music's contracts are untouched (the duel sings on top with the voices the places already use for their phrase).
const approvedR='5e27c4d2b071c107f5a54fad4cf0c7b39567741e';
const rebasedR=new Set(['src/i18n-en.js']);
// Con Luca (Jay, 29 Oct 2026, alpha.239): the challenge for two and the calm mode for children. Their English strings,
// one line in each of four games (they ask runtime.tranquiloValue for their calm value; unchanged when it is off) and
// the offline shell's four new modules are held to the merge of jay/ritmo into jay/con-luca; the music's contracts are
// untouched (nothing new sounds).
const approvedL5='128cb15eb7b172d3230056b7e78eeef68e83c143';
const rebasedL5=new Set(['src/i18n-en.js','src/journey-dance.js','src/journey-guide.js','src/journey-resonance.js','src/journey-surf.js']);
// Descubrir (Jay, 29 Oct 2026, alpha.240): rumors and the album of sounds. main starts descubrir.js, the frame gives it its
// tick, its drawing and the ring of sounds round the cube, and the offline shell lists two new modules. Held to the merge
// of main (with Ritmo) into jay/descubrir; the music's contracts are untouched (the sounds play on top, measured by render).
const approvedD='9f7eec27ae24e36e25c675891f1d3def35b5df31';
const rebasedD=new Set(['src/main.js','src/render.js']);
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
// Changed by Q1–Q6: Q1 one notice after the Journey, Q2 the Cueva counts the echo, Q3 the layer that grows, Q4 Refugio
// rooms, Q5 the strike heard and the touch scheduled sooner, Q6 back where you were and one gesture in the World.
const rebasedQ=new Set(['src/achievements.js','src/celebration.js','src/crystal-sparks.js','src/discovery.js','src/house-capsules.js','src/house-model.js','src/interactions.js','src/journey-echo.js','src/journey-games.js','src/progress.js','src/render.js','src/song.js']);
const files=git('ls-tree','-r','--name-only','-z',base,'--','src','assets').toString().split('\0').filter(Boolean),protectedFiles=[];
for(const file of files.filter(f=>!allowed.has(f))){const a=before(file,rebasedD.has(file)?approvedD:rebasedL5.has(file)?approvedL5:rebasedR.has(file)?approvedR:rebasedV.has(file)?approvedV:rebasedM.has(file)?approvedM:rebasedH2.has(file)?approvedH2:rebasedH1.has(file)?approvedH1:rebasedG.has(file)?approvedG:rebasedF1.has(file)?approvedF1:rebasedAE.has(file)?approvedAE:rebasedR2.has(file)?approvedR2:rebasedE1.has(file)?approvedE1:rebasedM1.has(file)?approvedM1:rebasedL4.has(file)?approvedL4:rebasedL.has(file)?approvedL:rebasedQ.has(file)?approvedQ:rebased.has(file)?approved:base),b=readFileSync(file);if(!a.equals(b))throw Error('Protected content changed: '+file);protectedFiles.push({file,sha256:sha(b)});}
const contracts=[];
function section(text,from,to){const a=text.indexOf(from),b=text.indexOf(to,a+from.length);if(a<0||b<0)throw Error('Missing preservation boundary '+from);return text.slice(a,b);}
function sameSection(file,from,to,label,ref=base){const a=section(before(file,ref).toString(),from,to),b=section(source(file),from,to);if(a!==b)throw Error('Changed '+label);contracts.push({label,file,sha256:sha(b)});}
sameSection('src/song-stage.js','export function songPlan','export function initialize','complete final11 plan, notes, harmony and events as approved in P6 (D1, D5), Q3 and Q7 (dub techno)',approvedQ7);
sameSection('src/journey-finale.js','export const CHAPTER_COLORS','export function initialize','complete final5 score, arrangement and audio output as approved in P6 (D5-C) and Q7 (dub techno)',approvedQ7);
sameSection('src/journey-pulse.js',' function judge(',' function draw(','pulse judgement, note selection and recorded timing; Q2 passes the heard time to the games',approvedQ);
sameSection('src/journey-garden.js','import {calmMotion','export const gardenProgress','garden positions, rules, growth and save normalization as approved in P3',approved);
sameSection('src/places.js','const object=','export function gameObjective','star rules, migration and existing open places; Q3 keeps credited',approvedQ);
sameSection('src/places.js',' function start(',' // The round\'s card:','round execution, reward, restore and failed-save rollback as approved in P4–P6, Q2 and Q3; H1 takes the sparks out of the reward',approvedH1);
sameSection('src/collection-garden.js',' function build(',' function definition(','successful card voices, instruments, timbres and garden score');
sameSection('src/journey-rhythm.js','export const RHYTHMS','export function initialize','all rhythm patterns, judgement grid and timing rules');
sameSection('src/house.js',' function brush(',' function cubeAt(','Refugio object proximity and audible brush scheduling');
sameSection('src/house.js','housePulse:{get:()=>','houseSounds:{get:()=>','Refugio pulse notes, proximity, ordering and sound scheduling');
const singFrom=' function sing(',singTo=' // The step being sung now';
const oldSing=section(before('src/journey-rhythm.js').toString(),singFrom,singTo),newSing=section(source('src/journey-rhythm.js'),singFrom,singTo).replace('sung.push(singing.last);if(sung.length>32)sung.shift();','').replace('demoEnd=singing.start+singing.bars*16*(runtime.SIX||.15);','');
if(oldSing!==newSing)throw Error('Changed rhythm demonstration music');
contracts.push({label:'rhythm demonstration audio identical beyond visual history queue and the Q2 end of the demonstration',file:'src/journey-rhythm.js',sha256:sha(newSing)});
// The finale's scheduling: E added a visual history queue; P6 (D5-A) lets the finale start at the end of a round's drop.
sameSection('src/song-stage.js',' function step(',' // How hard a layer','finale audio scheduling as approved in P6 (D5-A) and Q7 (swing, no World radio)',approvedQ7);
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
if(audio!==before('src/audio.js',approved).toString())throw Error('Audio differs beyond the six authorized visual-only replacements');
// Q5: a touch off the beat is scheduled on the next free sixteenth (touchSoon); no note, voice or mix changes.
// Q7: the World's radio rests under the finale of eleven (songFinaleHush); no World note, voice or mix changes.
if(source('src/audio.js')!==before('src/audio.js',approvedQ7).toString())throw Error('Audio differs from the engine approved in Q5 and Q7');
contracts.push({label:'audio engine unchanged beyond six visual-only replacements, the Q5 touch scheduling and the Q7 finale hush',file:'src/audio.js',sha256:sha(source('src/audio.js'))});
const shell=source('sw.js').replace(/const CACHE\s*=\s*['"][^'"]+['"]/,"const CACHE='VERSION'");
if(shell!==before('sw.js',approvedD).toString().replace(/const CACHE\s*=\s*['"][^'"]+['"]/,"const CACHE='VERSION'"))throw Error('Offline shell changed beyond its release key');
const runtimeFiles=[...readdirSync('src').filter(n=>n.endsWith('.js')).sort().map(n=>'src/'+n),...readdirSync('styles').filter(n=>n.endsWith('.css')).sort().map(n=>'styles/'+n),'index.html','package.json','sw.js'],hash=createHash('sha256');
for(const file of runtimeFiles)hash.update(file+'\0').update(readFileSync(file));
const report={base,revision:git('rev-parse','HEAD').toString().trim(),version:JSON.parse(source('package.json')).version,runtimeDigest:hash.digest('hex'),runtimeDirty:spawnSync('git',['diff','--quiet','HEAD','--','src','styles','assets','index.html','package.json','sw.js']).status!==0,protectedFiles,contracts,scope:'Byte preservation and exact protected musical functions; no perceptual listening or human acceptance implied.'};
if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({version:report.version,protectedFiles:protectedFiles.length,contracts:contracts.length,runtimeDigest:report.runtimeDigest,runtimeDirty:report.runtimeDirty}));
