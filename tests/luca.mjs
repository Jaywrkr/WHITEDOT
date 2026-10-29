// Con Luca (Jay, 29 Oct 2026, alpha.239): the challenge for two and the calm mode for children, as rules with no page.
// Both saves migrate without losing anything, a later version is never touched, nothing pays sparks, nothing uses the
// old random numbers and the cube keeps its size; the wiring reaches the games, the Line, the card and the shell.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PLACE_IDS,normalizePlaces,roundStars} from '../src/places.js';
import {ghostRecorder,ghostSample,ghostFrom} from '../src/ritmo-model.js';
import {ON_TIME} from '../src/journey-pulse.js';
import {DANCE_LIFE_BARS} from '../src/journey-dance.js';
import {GUIDE_FOLLOW_BARS} from '../src/journey-guide.js';
import {RES_RING_BEATS} from '../src/journey-resonance.js';
import {SURF_BAND} from '../src/journey-surf.js';
import {GARDEN_WILT_BARS,gardenWilt} from '../src/journey-garden.js';
import {TRANQUILO_VERSION,CALM_WINDOW,normalizeTranquilo,tranquiloOn,tranquiloWritable,calmApplies,calmValue,calmStars,calmTarget,GAME_STATES} from '../src/tranquilo-model.js';
import {DUOS_VERSION,DUO_SYMBOLS,DUO_DEFAULTS,DUO_NAME_MAX,normalizeDuos,normalizeMark,duoOffered,duoPlaces,duoCompare,duoKeep,gapText,markLine,resultLine,cleanName,other} from '../src/duos-model.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const places=(stars=[true,false,false],extra={})=>({...normalizePlaces({version:2,stars:Object.fromEntries(PLACE_IDS.map(id=>[id,[...stars]]))}),...extra});
// ---------- the calm mode: save ----------
const off=normalizeTranquilo(undefined);assert.deepEqual(off,{version:TRANQUILO_VERSION,on:false});assert.equal(tranquiloOn(off),false,'off by default');
assert.deepEqual(normalizeTranquilo([1]),off,'an array is nothing');
const kept=normalizeTranquilo({version:1,on:true,keep:'x'});assert.equal(kept.keep,'x');assert.equal(tranquiloOn(kept),true);assert.deepEqual(normalizeTranquilo(kept),kept,'normalizing twice changes nothing');
assert.equal(tranquiloOn(normalizeTranquilo({version:1,on:'yes'})),false,'only true turns it on');
const later={version:TRANQUILO_VERSION+1,on:true,other:[1]};assert.equal(normalizeTranquilo(later),later,'a later version is kept as it is');assert.equal(tranquiloWritable(later),false);assert.equal(tranquiloOn(later),false,'and it reads off');
// Where it acts: rounds that are not Maestro and the Journey; never the open World.
assert.equal(calmApplies({on:true,run:{id:'lago'}}),true);assert.equal(calmApplies({on:true,run:{id:'lago',maestro:true},journey:true}),false,'never Maestro');
assert.equal(calmApplies({on:true,run:null,journey:true}),true,'the Journey');assert.equal(calmApplies({on:true,run:null,journey:false}),false,'not the open World (sparks there keep their rule)');
assert.equal(calmApplies({on:false,run:{id:'lago'},journey:true}),false);
// The values: a wider window, no clock where something ran out, more room on the wave; untouched when it does not apply.
assert.ok(CALM_WINDOW>ON_TIME);assert.equal(calmValue('window',ON_TIME,true),CALM_WINDOW);assert.equal(calmValue('window',.2,true),.2,'never narrower');assert.equal(calmValue('window',ON_TIME,false),ON_TIME);
assert.equal(calmValue('danceLife',DANCE_LIFE_BARS,true),Infinity,'the storm circle waits');assert.equal(calmValue('danceLife',DANCE_LIFE_BARS,false),DANCE_LIFE_BARS);
assert.equal(calmValue('gardenWilt',GARDEN_WILT_BARS,true),Infinity,'beds never wilt');
assert.ok(calmValue('guideFollow',GUIDE_FOLLOW_BARS,true)>=8*GUIDE_FOLLOW_BARS);assert.ok(calmValue('resonanceRing',RES_RING_BEATS,true)>=4*RES_RING_BEATS);assert.ok(calmValue('surfBand',SURF_BAND,true)>SURF_BAND);
assert.equal(calmValue('nothing',7,true),7,'an unknown kind is left as it was');
// A calm bed: Infinity in the garden's own rule never wilts.
{const st={beds:[{stage:3,care:0}]};assert.deepEqual(gardenWilt(st,1e12,2,Infinity),[]);assert.equal(st.beds[0].stage,3);assert.deepEqual(gardenWilt({beds:[{stage:3,care:0}]},1e6,2,GARDEN_WILT_BARS),[0],'normal beds still wilt');}
// The stars: a calm round is a round without sound (places.js): ★ yes, ★★ and ★★★ never.
assert.deepEqual(roundStars({onTime:1,sound:false}),[true,false,false]);assert.deepEqual(calmStars([true,true,true]),[true,false,false]);
// The target of each game: the gold thing first; the storm's circle; the next wave; a silent crystal; the harbour.
assert.equal(Object.keys(GAME_STATES).length,11);
assert.deepEqual(calmTarget('llanura',{cloud:{x:5,y:6}}),{x:5,y:6});assert.equal(calmTarget('llanura',{cloud:null}),null);
assert.deepEqual(calmTarget('tormenta',{target:{x:1,y:2},eye:{x:9,y:9}}),{x:1,y:2},'the circle before the eye');assert.deepEqual(calmTarget('tormenta',{target:null,eye:{x:9,y:9}}),{x:9,y:9});
assert.deepEqual(calmTarget('dunas',{waves:[{x:1,y:1,at:3,ridden:false},{x:2,y:2,at:2,ridden:false},{x:3,y:3,at:1,ridden:true}]}),{x:2,y:2},'the next wave not ridden');
assert.deepEqual(calmTarget('cristales',{spots:[{x:0,y:0},{x:50,y:0}],ringing:[0]},{x:0,y:0}),{x:50,y:0},'a crystal still silent');
assert.deepEqual(calmTarget('faros',{boats:[{x:300,y:0,lit:true}],center:{x:10,y:10}}),{x:10,y:10},'a boat follows: the harbour');assert.deepEqual(calmTarget('faros',{boats:[{x:300,y:0,lit:false},{x:30,y:0,lit:false}],center:{x:0,y:0}},{x:0,y:0}),{x:30,y:0},'else the nearest boat');
assert.deepEqual(calmTarget('cristales',{gold:{x:7,y:7},spots:[]}),{x:7,y:7});assert.equal(calmTarget('cueva',{gold:null}),null);assert.equal(calmTarget('nada',{gold:{x:1,y:1}}),null);
// ---------- the challenge for two: save ----------
const blank=normalizeDuos(undefined);
assert.deepEqual(blank,{version:DUOS_VERSION,players:[{name:'Uno',sym:'●'},{name:'Dos',sym:'▲'}],turn:0,place:null,marks:{}});
assert.deepEqual(normalizeDuos('x'),blank);const future={version:DUOS_VERSION+1,marks:{lago:1}};assert.equal(normalizeDuos(future),future,'a later version is kept as it is');
const g=ghostRecorder();for(let ms=0;ms<=3000;ms+=600)ghostSample(g,ms,ms/10,0);const path=ghostFrom(g,3000);
const old=normalizeDuos({version:1,keep:1,players:[{name:'  Luca<script> ',sym:'★',extra:2},{name:'',sym:'◆'}],turn:1,place:'lago',
 marks:{lago:{by:1,ms:42000.4,onTime:2,day:'2026-10-29',ghost:path,mine:'k'},bosque:{by:2,ms:5},cristales:{by:0,ms:-1},nada:{by:0,ms:9},faros:{by:0,ms:3000,ghost:{ms:1,every:5,pts:[]}}}});
assert.equal(old.keep,1);assert.equal(old.players[0].extra,2);assert.deepEqual(old.players[1],{name:'Dos',sym:'◆'},'an empty name is the default');
assert.ok(old.players[0].name.length<=DUO_NAME_MAX&&!/[<>]/.test(old.players[0].name),'a name is short and plain');assert.equal(old.players[0].sym,'●','★ is earned gold, never a player symbol');
assert.equal(old.turn,1);assert.equal(old.place,'lago');assert.deepEqual(Object.keys(old.marks).sort(),['faros','lago']);
assert.deepEqual(old.marks.lago,{by:1,ms:42000,onTime:1,sound:true,calm:false,day:'2026-10-29',ghost:path,mine:'k'});assert.equal(old.marks.faros.ghost,undefined,'a broken path is dropped, the mark stays');
assert.deepEqual(normalizeDuos(old),old,'normalizing twice changes nothing');
assert.equal(cleanName('Papá',''),'Papá');assert.equal(cleanName('123456789','x'),'12345678');assert.equal(cleanName('<<>>','Uno'),'Uno');assert.equal(cleanName(7,'Dos'),'Dos');
assert.ok(!DUO_SYMBOLS.includes('★')&&!DUO_SYMBOLS.includes('✦'),'gold is only for what is earned');assert.equal(DUO_DEFAULTS.length,2);
assert.equal(normalizeMark({by:0,ms:0}),null);assert.equal(normalizeMark({by:3,ms:9}),null);
// Offered in places already complete; never in a locked or future save.
const ten=places();ten.stars.lago=[false,false,false];assert.equal(duoOffered(ten,'lago'),false);assert.equal(duoOffered(ten,'llanura'),true);assert.equal(duoOffered({...ten,readOnly:true},'llanura'),false);
assert.equal(duoPlaces(ten).length,10);assert.deepEqual(duoPlaces(places([false,false,false])),[]);
// The comparison, by tenths, without punishment.
assert.deepEqual(duoCompare(null,5000),{kind:'first',gap:0});assert.deepEqual(duoCompare({ms:42000},40800),{kind:'record',gap:1200});
assert.deepEqual(duoCompare({ms:42000},42040),{kind:'tie',gap:0});assert.deepEqual(duoCompare({ms:42000},43200),{kind:'near',gap:1200});assert.equal(duoCompare({ms:42000},60000).kind,'far');assert.equal(duoCompare({ms:1},0),null);
assert.equal(gapText(1200),'1,2');assert.equal(gapText(12340),'12,3');
assert.equal(resultLine({kind:'near',gap:1200}),'Casi: a 1,2 s.');assert.equal(resultLine({kind:'record',gap:5}),'¡Nueva marca!');assert.equal(resultLine({kind:'far',gap:15000}),'A 15,0 s de la marca.');
assert.ok(!/fall|perd|mal\b/i.test([resultLine({kind:'first'}),resultLine({kind:'tie'}),resultLine({kind:'near',gap:1}),resultLine({kind:'far',gap:20000})].join(' ')),'no word of failure');
assert.deepEqual(markLine({ms:42000}),{lead:'Marca de',time:'0:42',ask:'¿la superas?'});assert.equal(markLine(null),null);
// The mark kept: the first, a better time; a slower one or a tie keeps the old mark.
let k=duoKeep({},'lago',{by:0,ms:42000,ghost:path,day:'d'});assert.ok(k.changed&&k.mark.by===0&&k.mark.ghost);
k=duoKeep({lago:k.mark},'lago',{by:1,ms:43000});assert.equal(k.changed,false);assert.equal(k.mark.by,0);assert.equal(k.cmp.kind,'near');
k=duoKeep({lago:k.mark},'lago',{by:1,ms:41000,calm:true});assert.ok(k.changed);assert.equal(k.mark.by,1);assert.equal(k.mark.calm,true);assert.equal(k.mark.ghost,undefined,'no path, no ghost');
assert.equal(other(0),1);assert.equal(other(1),0);
// ---------- no sparks, no old random numbers, the cube unchanged ----------
for(const f of ['src/tranquilo-model.js','src/tranquilo.js','src/duos-model.js','src/duos.js']){const src=read(f);assert.ok(!/Math\.random|runtime\.R\(|\bR\(\)/.test(src),f+': no random numbers');assert.ok(!/sparks|gain\(|addSparks/.test(src.replace(/no sparks|never sparks|sparks\)|No sparks|sparks\./g,'')),f+': no sparks');assert.ok(!/cubeSize|cubeScale|S\.size\b/.test(src),f+': the cube keeps its size');}
// ---------- wiring ----------
const sw=read('sw.js');for(const m of ['tranquilo.js','tranquilo-model.js','duos.js','duos-model.js'])assert.equal(sw.split('"./src/'+m+'"').length-1,1,m+' once in the offline shell');
const ring=read('src/places-ring.js');assert.match(ring,/import \{initialize as tranquilo\} from '\.\/tranquilo\.js';/);assert.match(ring,/ritmo\(runtime\);tranquilo\(runtime\);duos\(runtime\);/);assert.match(ring,/portalMaestro'\)\.hidden=!stars\(id\)\[1\]\|\|!!runtime\.tranquilo\?\.\(\)/);
for(const [f,kind] of [['src/journey-dance.js','danceLife'],['src/journey-garden.js','gardenWilt'],['src/journey-guide.js','guideFollow'],['src/journey-resonance.js','resonanceRing'],['src/journey-surf.js','surfBand']])assert.ok(read(f).includes(`runtime.tranquiloValue?.('${kind}'`),f);
const pulse=read('src/journey-pulse.js');assert.ok(pulse.includes('runtime.tranquiloSignals?.()')&&pulse.includes('runtime.drawTranquilo?.(c,W,H,t)'));
const pl=read('src/places.js');assert.ok(pl.includes('runtime.duoCard?.(r)')&&pl.includes('runtime.tranquiloCard?.(r)')&&pl.includes("duo?'Reto':'Completo'"));
assert.ok(read('src/ritmo.js').includes('runtime.duoGhost?.(run)'),'the rival runs as the ghost');assert.ok(read('src/refugio-lugares.js').includes('runtime.duoLugares?.()'));
const html=read('index.html');for(const id of ['mDuo','duoTitle','duoPlace','duoP0','duoP1','duoMark','duoEdit','duoName0','duoName1','duoSym0','duoSym1','duoClearAll','duoMarks','duoPlay','duoNames','duoClear','duoClose','duoLive','portalDuo','placeDuo','lugaresDuo','calmKids','calmKidsHint'])assert.equal(html.split(`id="${id}"`).length-1,1,id);
for(const id of ['portalEcho','placeEcho','lugaresDuel','colorSafe','placeNext','placeAgain'])assert.ok(html.includes(`id="${id}"`),'ids kept: '+id);
assert.match(html,/<input id="duoName0"[^>]*translate="no"/);
console.log('PASS Con Luca: calm mode (save, where it acts, no clock in the five games, wider window, ★ without ★★/★★★, targets), challenge for two (save and migration, names, one mark per place with its path, comparison without punishment), no sparks, no random numbers, wiring');
