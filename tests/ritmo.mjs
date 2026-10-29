// Ritmo (Jay, 29 Oct 2026, alpha.237): Eco, the Duelo final, the ghost and the combo, as rules with no page. The save
// migrates without losing anything, a later version is never touched, nothing pays sparks and the old random numbers are
// never used (the Cueva's duel pattern comes from a hash).
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PLACE_IDS,normalizePlaces} from '../src/places.js';
import {RHYTHMS,PLACE_RHYTHMS} from '../src/journey-rhythm.js';
import {LEVEL_SPARKS} from '../src/spark-rules.js';
import {RITMO_VERSION,ECHO_PLACES,GHOST_EVERY,GHOST_MAX,GHOST_ALPHA,COMBO_AT,TRAIL_MAX,DUEL_RAPID,normalizeRitmo,normalizeGhost,echoOffered,duelOpen,ghostRecorder,ghostSample,ghostAt,ghostAlpha,ghostBetter,ghostFrom,
 comboStep,trailLength,duelPattern,duelList,duelJudge,duelClose,duelShare,duelKeep} from '../src/ritmo-model.js';
const places=(stars=[true,false,false],extra={})=>({...normalizePlaces({version:2,stars:Object.fromEntries(PLACE_IDS.map(id=>[id,[...stars]]))}),...extra});
// ---------- the save ----------
const blank=normalizeRitmo(undefined);
assert.deepEqual(blank,{version:RITMO_VERSION,echo:{},ghosts:{},duel:{won:false,day:'',best:0,echoes:0,rounds:0,wear:true},said:{duel:false}});
assert.deepEqual(normalizeRitmo([1,2]),blank,'an array is nothing');
const future={version:RITMO_VERSION+1,anything:[1]};assert.equal(normalizeRitmo(future),future,'a later version is kept as it is');
// Unknown fields stay, broken values are made safe, the Cueva has no Eco, a broken ghost is dropped.
const old=normalizeRitmo({version:1,keep:'x',echo:{lago:{best:3,rounds:2.5,extra:1},cueva:{best:.5,rounds:1},nada:{best:1}},ghosts:{lago:{ms:9000,every:600,pts:[[0,0],[10,-4],[1.5,2],'x']},bosque:{ms:-1,every:600,pts:[[0,0],[1,1]]},cristales:{ms:1000,every:600,pts:[[0,0]]}},
 duel:{won:true,day:'2026-10-29',best:.6,echoes:9,rounds:2,wear:false,note:'k'},said:{duel:true,other:1}});
assert.equal(old.keep,'x');assert.deepEqual(old.echo,{lago:{best:1,rounds:0,extra:1}});
assert.deepEqual(old.ghosts,{lago:{ms:9000,every:600,pts:[[0,0],[10,-4]]}},'only whole points; too short or broken is no ghost');
assert.deepEqual(old.duel,{won:true,day:'2026-10-29',best:.6,echoes:9,rounds:2,wear:false,note:'k'});assert.deepEqual(old.said,{duel:true,other:1});
assert.deepEqual(normalizeRitmo(old),old,'normalizing twice changes nothing');
assert.equal(normalizeGhost({ms:5,every:600,pts:[[0,0],[1,2]]}).ms,5);assert.equal(normalizeGhost({ms:5,every:50,pts:[[0,0],[1,2]]}),null,'samples at least 100 ms apart');
// ---------- Eco ----------
assert.equal(ECHO_PLACES.length,10);assert.ok(!ECHO_PLACES.includes('cueva'),'the Cueva already plays from memory');
const ten=places();ten.stars.lago=[false,false,false];
assert.equal(echoOffered(ten,'lago'),false,'never the first time');assert.equal(echoOffered(ten,'llanura'),true);
assert.equal(echoOffered(ten,'llanura',false),false,'without sound there is no phrase to remember');assert.equal(echoOffered(ten,'cueva'),false);
assert.equal(echoOffered({...ten,readOnly:true},'llanura'),false);assert.equal(echoOffered(null,'llanura'),false);
// ---------- the duel opens after the eleven, their finale and their note ----------
assert.equal(duelOpen(places([true,false,false],{won:true}),true),true);
assert.equal(duelOpen(places([true,false,false],{won:true}),false),false,'the note of the eleven first');
assert.equal(duelOpen(places([true,false,false]),true),false,'the finale first');
const almost=places([true,false,false],{won:true});almost.stars.cueva=[false,false,false];assert.equal(duelOpen(almost,true),false,'all eleven');
assert.equal(duelOpen({...places([true,false,false],{won:true}),readOnly:true},true),false);
// Its rhythms: the eleven places in order, each with its own steps; the Cueva's from a hash, fixed, on the «1».
const list=duelList();assert.deepEqual(list.map(x=>x.id),PLACE_IDS);
for(const {id,steps} of list){if(id==='cueva')continue;assert.deepEqual(steps,[...RHYTHMS[PLACE_RHYTHMS[id]].steps],id);}
const cave=duelPattern('cueva');assert.equal(cave.length,4);assert.equal(cave[0],0);assert.ok(cave.every(s=>s%2===0&&s<16));assert.deepEqual(duelPattern('cueva'),cave,'the same every time');
assert.deepEqual(duelList(true).map(x=>x.id),[...DUEL_RAPID]);
// A touch: the nearest eighth, on time within 90 ms; outside the bar, nothing.
const six=.15;assert.deepEqual(duelJudge([0,4,6],4.2,six),{step:4,ok:true});assert.deepEqual(duelJudge([0,4,6],4.7,six),{step:4,ok:false},'0,7 of a sixteenth is 105 ms');
assert.deepEqual(duelJudge([0,4,6],2,six),{step:2,ok:false},'not a step of the pattern');assert.equal(duelJudge([0],15.5,six),null);assert.equal(duelJudge([0],-1.2,six),null);
// The answer closes: right steps, extras, the echo (all and nothing else); the share counts the extras against.
let score={right:0,total:0,wrong:0,echoes:0};
let r=duelClose(score,[0,4,6],[0,4,6]);assert.equal(r.echo,true);score=r;r=duelClose(score,[2,6,10,14],[2,6],1);assert.equal(r.echo,false);score=r;r=duelClose(score,[0],[]);assert.equal(r.answered,false);score=r;
assert.deepEqual({right:score.right,total:score.total,wrong:score.wrong,echoes:score.echoes},{right:5,total:8,wrong:1,echoes:1});assert.equal(duelShare(score),5/9);assert.equal(duelShare({}),0);
// The ★ comes with completing it, whatever the share (no punishment); the first time the ornament is new and worn.
const first=duelKeep(blank.duel,{right:0,total:40,wrong:0,echoes:0},'2026-10-29');assert.equal(first.fresh,true);assert.deepEqual(first.kept,{won:true,day:'2026-10-29',best:0,echoes:0,rounds:1,wear:true});
const again=duelKeep({...first.kept,wear:false},{right:30,total:40,wrong:0,echoes:6},'2026-11-02');assert.equal(again.fresh,false);
assert.deepEqual(again.kept,{won:true,day:'2026-10-29',best:.75,echoes:6,rounds:2,wear:false},'first day, best share and echoes kept; the ornament stays as you left it');
assert.equal(duelKeep(again.kept,{right:1,total:40,wrong:0,echoes:0},'x').kept.best,.75,'a worse duel never lowers the best');
// ---------- the ghost ----------
const rec=ghostRecorder();for(let ms=0;ms<=6000;ms+=60)ghostSample(rec,ms,ms/10,-ms/20);
assert.equal(rec.every,GHOST_EVERY);assert.equal(rec.pts.length,11,'one sample every 600 ms');assert.deepEqual(rec.pts[1],[60,-30]);
const long=ghostRecorder();for(let ms=0;ms<=400000;ms+=100)ghostSample(long,ms,ms/100,0);
assert.ok(long.pts.length<=GHOST_MAX&&long.every>GHOST_EVERY,'a long round halves its samples');
for(let i=0;i<long.pts.length;i++)assert.ok(Math.abs(long.pts[i][0]-i*long.every/100)<=1,'each sample stays at its time');
assert.ok(JSON.stringify(long.pts).length<2500,'a few kilobytes at most');
const g=ghostFrom(rec,6000);assert.deepEqual(g,{ms:6000,every:600,pts:rec.pts});
assert.deepEqual(ghostAt(g,900),{x:90,y:-45,done:false},'between two samples');assert.deepEqual(ghostAt(g,9000),{x:600,y:-300,done:true},'resting at the end');
assert.equal(ghostAlpha(g,100),GHOST_ALPHA);assert.ok(ghostAlpha(g,6700)<GHOST_ALPHA&&ghostAlpha(g,6700)>0);assert.equal(ghostAlpha(g,8000),0);assert.equal(ghostAlpha(null,1),0);
assert.equal(ghostBetter(null,5000),true);assert.equal(ghostBetter(g,5999),true);assert.equal(ghostBetter(g,6000),false);assert.equal(ghostBetter(g,NaN),false);
const gap=ghostRecorder();assert.equal(ghostSample(gap,2000,5.4,-2.6),true);assert.deepEqual(gap.pts,[[5,-3],[5,-3],[5,-3],[5,-3]],'a late look fills the samples due, where the cube is');assert.equal(ghostSample(gap,2100,9,9),false);
assert.equal(ghostSample(null,1,1,1),false);assert.equal(ghostFrom(ghostRecorder(),100),null,'no path, no ghost');
// ---------- the combo ----------
let c={streak:0};for(let i=0;i<7;i++)c=comboStep(c,{hits:1});assert.equal(trailLength(c.streak),0,'seven is not yet a combo');
c=comboStep(c,{hits:1});assert.equal(c.streak,COMBO_AT);assert.ok(trailLength(c.streak)>0,'the eighth lights the trail');
const short=trailLength(c.streak);for(let i=0;i<5;i++)c=comboStep(c,{hits:1});assert.ok(trailLength(c.streak)>short,'it grows');
assert.equal(trailLength(500),TRAIL_MAX,'up to a limit');c=comboStep(c,{misses:1});assert.equal(c.broke,true);assert.equal(c.streak,0);
assert.equal(comboStep({streak:3},{misses:1}).broke,false,'a short run ending is not a broken combo');
// ---------- no sparks, no old random numbers, the shell and the hooks ----------
assert.equal(LEVEL_SPARKS,0,'levels give no sparks');
const src=readFileSync(new URL('../src/ritmo.js',import.meta.url),'utf8')+readFileSync(new URL('../src/ritmo-model.js',import.meta.url),'utf8');
assert.ok(!/Math\.random|\bS\.sparks\b|addSparks|sparkEarn|earnSparks|payUniverse/.test(src),'Ritmo neither draws random numbers nor pays sparks');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');for(const f of ['./src/ritmo.js','./src/ritmo-model.js'])assert.equal(sw.split(`"${f}"`).length,2,f+' once in the shell');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');for(const id of ['mDuel','duelTitle','duelStars','duelLines','duelPlay','duelClose','placeEcho','portalEcho','lugaresDuel','cubeRitmoSection','cubeRitmoOptions'])assert.ok(html.includes(`id="${id}"`),id);
const pulse=readFileSync(new URL('../src/journey-pulse.js',import.meta.url),'utf8');assert.ok(pulse.includes('runtime.ritmoHideSignals?.()?[]:'),'the Line hides the steps in Eco');assert.ok(pulse.includes('runtime.drawRitmoCube?.('));
const ring=readFileSync(new URL('../src/places-ring.js',import.meta.url),'utf8');assert.ok(ring.includes('runtime.ritmoMusicStep?.(step,time)')&&ring.includes('runtime.drawRitmoRing?.(')&&ring.includes("import {initialize as ritmo} from './ritmo.js'"));
console.log('PASS ritmo: save migrates and keeps later versions; Eco only on complete places with sound, not the Cueva; the duel after the eleven, their finale and note, the eleven rhythms in order, ★ on completion and the ornament once; the ghost in spaced samples that halve, between samples and fading; the combo from eight hits, growing, broken by a miss; no sparks or random numbers; shell and hooks');
