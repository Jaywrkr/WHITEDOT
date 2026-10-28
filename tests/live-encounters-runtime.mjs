import assert from 'node:assert/strict';
import {initialize} from '../src/live-encounters.js';
import {initialize as mischief} from '../src/universe-mischief.js';
import {mischiefCell} from '../src/universe-mischief-model.js';
import {LIVE_ENCOUNTERS,LIVE_REWARD,LIVE_EVERY,LIVE_KNOCK_SPEED,liveInterval,liveFor} from '../src/live-encounters-model.js';
import {hashKey} from '../src/universe-regions.js';
// The engine inside a small runtime: when it appears, what pauses it, where it never appears, one at a time with the
// mischief scenes, what it pays (atomically) and what it leaves in the Bitácora.
let modal=false,fail=false,saves=0;globalThis.document={hidden:false,querySelector:()=>modal?{}:null};
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const BIOMES=LIVE_ENCOUNTERS.filter(d=>d.verb==='perseguir').map(d=>({id:d.biome}));
function game(raw,biome=0){const toasts=[],elements=[],queue=[],r={S:raw||{mode:'world',todayKey:'2026-10-27',layer:'superficie',wx:0,wy:0,sparks:0,sound:false,sparkEconomy:{version:1,earned:0,spent:0,log:[]}},
 worldIdentity:{seed:'live',generation:2},BIOMES,seedOf,waves:[],regionOfPos:()=>({z:biome,sea:false,genre:'deep'}),inWorld(){return this.S.mode==='world';},save(){saves++;return !fail;},
 get sparkEconomy(){return this.S.sparkEconomy;},toast:(...a)=>toasts.push(a),recordElement:(id)=>{elements.push(id);r.S.elementBook={version:1,found:{...(r.S.elementBook?.found||{}),[id]:{}}};return true;},showSparkPickup(){},
 chordTones:()=>[57,60,64,67],vel:n=>n,hookInst(){},beatSoon:fn=>queue.push(fn),totemNear:()=>[],inhabitantsNear:()=>[],MU:{step:0},ac:{state:'running'},toasts,elements,queue};
 mischief(r);initialize(r);return r;}
const walk=(r,seconds,{dx=10,modal:m=false}={})=>{for(let i=0;i<seconds/.05;i++){r.S.wx+=dx;r.liveTick(.05,m);}};
// Travel counts only while moving in the free World: standing still, a menu or a paused game add nothing.
let r=game();const first=liveInterval(JSON.stringify(r.worldIdentity)+':superficie',0);assert(first>=LIVE_EVERY.min&&first<=LIVE_EVERY.max);
walk(r,30,{dx:0});assert.equal(r.liveEncounterState().travel,0,'standing still is not travel');
walk(r,30,{modal:true});assert.equal(r.liveEncounterState().travel,0,'a paused game is not travel');
modal=true;walk(r,30);modal=false;assert.equal(r.liveEncounterState().travel,0,'an open menu is not travel');
walk(r,first-1);assert(!r.liveEncounterState().scene);walk(r,1.2);const s=r.liveEncounterState().scene;assert(s,'one appears after its 60–90 s of travel');
assert.equal(s.kind,'polilla','the biome where the cube travels (Polvo) chooses it');assert(s.x-r.S.wx>=250&&s.x-r.S.wx<=360,'ahead of the cube');assert.equal(r.liveEncounterState().line,'Una polilla de luz. Atrápala.');
assert.equal(r.liveEncounterState().book.count,1);
// A pulse on time near it catches it: 15 ✦, once in the Bitácora, one notice naming it.
r.waves.push({x:s.x-40,y:s.y,origin:'player',beat:true});r.liveTick(.05);assert.equal(r.liveEncounterState().scene.stage,'caught');
assert.equal(r.S.sparks,LIVE_REWARD.onTime);assert.deepEqual(r.elements,['live:polilla']);assert.equal(r.toasts.length,1);assert.match(r.toasts[0][0],/Encuentro nuevo.*Polilla de luz/);assert(!/Logro/.test(r.toasts[0][0]));
assert.equal(r.S.sparkEconomy.log.at(-1).title,'Polilla de luz');assert.equal(r.S.liveEncounters.kinds.polilla.caught,1);assert.equal(r.S.liveEncounters.kinds.polilla.onTime,1);
for(let i=0;i<40;i++)r.liveTick(.05);assert(!r.liveEncounterState().scene,'its goodbye ends');
// The next one waits its own 60–90 s; caught by walking into it: 10 ✦, no second notice, no second Bitácora entry.
assert(r.liveEncounterSpawn('polilla'));let t=r.liveEncounterState().scene;r.S.wx=t.x-10;r.S.wy=t.y;r.liveTick(.05);assert.equal(r.S.sparks,LIVE_REWARD.onTime+LIVE_REWARD.base);assert.equal(r.toasts.length,1);assert.equal(r.elements.length,1);
for(let i=0;i<40;i++)r.liveTick(.05);
// Getting away costs nothing.
assert(r.liveEncounterSpawn('estrella'));const before=r.S.sparks;for(let i=0;i<400&&r.liveEncounterState().scene?.stage!=='escaped';i++)r.liveTick(.05);assert.equal(r.liveEncounterState().scene.stage,'escaped');assert.equal(r.liveEncounterState().line,'La estrella pasó de largo.');assert.equal(r.S.sparks,before);assert.equal(r.S.liveEncounters.kinds.estrella.escaped,1);
for(let i=0;i<40;i++)r.liveTick(.05);assert(!r.liveEncounterState().scene);
// A failed save keeps nothing and retries a bounded number of times; then it simply ends.
assert(r.liveEncounterSpawn('pez'));t=r.liveEncounterState().scene;fail=true;const bank=structuredClone(r.S);r.waves.push({x:t.x,y:t.y,origin:'player',beat:true});const n0=saves;for(let i=0;i<200;i++)r.liveTick(.05);
assert.equal(r.S.sparks,bank.sparks);assert.deepEqual(r.S.liveEncounters,bank.liveEncounters);assert.deepEqual(r.S.sparkEconomy,bank.sparkEconomy);assert(!r.S.elementBook?.found?.['live:pez']);assert(saves-n0<=3,'bounded retries');assert(!r.liveEncounterState().scene);fail=false;
// Never in a chapter of the Journey, a round, under a finale, in an activity or the Refugio: the encounter just goes.
for(const [key,value] of [['travelInLevel',()=>true],['placeRun',()=>({})],['songStageState',()=>({running:true})],['journeyFinaleState',()=>({running:true})],['activityActive',true],['houseActive',()=>true]]){
 const g=game();g[key]=value;walk(g,95);assert(!g.liveEncounterState().scene,key);assert.equal(g.liveEncounterState().travel,0,key);assert(!g.liveEncounterSpawn('polilla'),key);
 const h=game();assert(h.liveEncounterSpawn('polilla'));h[key]=value;h.liveTick(.05);assert(!h.liveEncounterState().scene,key+' ends it');assert.equal(h.S.sparks,0);}
{const g=game();g.S.layer='bajo';assert(!g.liveEncounterSpawn('polilla'),'only on the surface');}
// One at a time with the mischief scenes, both ways.
{const site=(()=>{for(let x=-40;x<40;x++)for(let y=-40;y<40;y++)for(const o of mischiefCell(x,y,seedOf))if(o.kind==='rain')return o;})();
 const g=game();g.S.wx=site.x-60;g.S.wy=site.y;assert(g.liveEncounterSpawn('polilla'));g.S.wx=site.x;g.mischiefTick(.05);assert(!g.mischiefState.scene,'no mischief while an encounter runs');
 const h=game();h.S.wx=site.x;h.S.wy=site.y;h.mischiefTick(.05);assert(h.mischiefState.scene,'mischief starts');assert(!h.liveEncounterSpawn('polilla'),'no encounter while a mischief scene plays');for(let i=0;i<1900;i++){h.S.wx=site.x+(i%2?10:-10);h.mischiefTick(.05);h.liveTick(.05);}assert(h.mischiefState.scene,'still playing');assert(!h.liveEncounterState().scene);assert.equal(h.liveEncounterState().travel,0,'travel waits while a mischief scene plays');}
// Another biome offers its own; the forced shortcut and a later save version.
{const g=game(null,6);for(let i=0;i<2000&&!g.liveEncounterState().scene;i++)walk(g,.05);assert.equal(g.liveEncounterState().scene.kind,'reflejo');}
{const future={version:3,opaque:1},g=game({mode:'world',todayKey:'2026-10-27',layer:'superficie',wx:0,wy:0,sparks:0,sparkEconomy:{version:1,earned:0,log:[]},liveEncounters:future});walk(g,100);assert(!g.liveEncounterState().scene);assert.equal(g.S.liveEncounters,future);}
// Batch 2 · huir. The same timer picks chase or flight in the biome from the hash: both come, in the order of the hash.
{const g=game(),scope=JSON.stringify(g.worldIdentity)+':superficie',kinds=[];for(let n=0;n<12;n++){const want=liveFor('llanura',hashKey('live:pick:v1:'+scope+':'+n)).id;for(let i=0;i<3000&&g.liveEncounterState().book.count===n;i++)walk(g,.05);const sc=g.liveEncounterState().scene;assert.equal(sc.kind,want,'the hash picks it');kinds.push(sc.kind);g.liveEncounterState().scene.stage='escaped';g.liveEncounterState().scene.result='escaped';g.liveEncounterState().scene.over=9;g.liveTick(.05);}
 assert(kinds.includes('polilla')&&kinds.includes('remolino'),kinds.join());}
// Escaping on foot: 10 ✦, its own Bitácora entry and one notice; with a pulse on time, 15 ✦; reached, nothing but a nudge.
{const g=game();assert(g.liveEncounterSpawn('ola'));const s=g.liveEncounterState().scene;assert.equal(s.verb,'huir');assert.equal(g.liveEncounterState().line,'Una ola gigante. Llega al anillo.');
 g.S.wx=s.safe.x;g.S.wy=s.safe.y;g.liveTick(.05);assert.equal(s.stage,'safe');assert.equal(g.S.sparks,LIVE_REWARD.base);assert.deepEqual(g.elements,['live:ola']);assert.match(g.toasts.at(-1)[0],/Encuentro nuevo.*Ola gigante/);assert.equal(g.S.liveEncounters.kinds.ola.caught,1);
 for(let i=0;i<40;i++)g.liveTick(.05);assert(!g.liveEncounterState().scene);
 assert(g.liveEncounterSpawn('arena'));const a=g.liveEncounterState().scene;g.waves.push({x:g.S.wx,y:g.S.wy,origin:'player',beat:true});g.liveTick(.05);assert(a.onTime&&a.shield>0,'a pulse on time shields');const shelter=a.stones[0].shelter;g.S.wx=shelter.x;g.S.wy=shelter.y;
 for(let i=0;i<200&&a.stage==='run';i++)g.liveTick(.05);assert.equal(a.stage,'safe');assert.equal(g.S.sparks,LIVE_REWARD.base+LIVE_REWARD.onTime);assert.equal(g.toasts.length,2);
 for(let i=0;i<40;i++)g.liveTick(.05);
 // Reached: no sparks taken, none given, a nudge of a second, its kind goodbye; the next one can come.
 assert(g.liveEncounterSpawn('pozo'));const w=g.liveEncounterState().scene,bank=g.S.sparks,from={x:g.S.wx,y:g.S.wy};for(let i=0;i<200&&w.stage==='run';i++)g.liveTick(.05);
 assert.equal(w.stage,'hit');assert(Math.hypot(g.S.wx-from.x,g.S.wy-from.y)>100,'the well pulled the cube');assert.equal(g.liveEncounterState().line,'Tocaste fondo. Ya saliste.');
 const at={x:g.S.wx,y:g.S.wy};for(let i=0;i<40;i++)g.liveTick(.05);assert(Math.hypot(g.S.wx-at.x,g.S.wy-at.y)<=LIVE_KNOCK_SPEED+3,'a soft nudge only');assert(!g.liveEncounterState().scene);
 assert.equal(g.S.sparks,bank);assert.equal(g.S.liveEncounters.kinds.pozo.hit,1);assert.equal(g.S.liveEncounters.kinds.pozo.caught,0);assert(!g.elements.includes('live:pozo'));
 // One at a time, whatever the verb.
 assert(g.liveEncounterSpawn('rayos'));assert(!g.liveEncounterSpawn('polilla'));assert(!g.liveEncounterSpawn('ondas'));
 // Never in a level: the threat just goes, and its pull stops.
 g.travelInLevel=()=>true;const x=g.S.wx;g.liveTick(.05);assert(!g.liveEncounterState().scene);g.liveTick(.05);assert.equal(g.S.wx,x);}
// Batch 3 · hacer. The roll in thirds brings the three verbs of the biome over enough encounters, in the order of the hash.
{const g=game(),scope=JSON.stringify(g.worldIdentity)+':superficie',kinds=new Set();for(let n=0;n<24;n++){const want=liveFor('llanura',hashKey('live:pick:v1:'+scope+':'+n)).id;for(let i=0;i<3000&&g.liveEncounterState().book.count===n;i++)walk(g,.05);const sc=g.liveEncounterState().scene;assert.equal(sc.kind,want);kinds.add(sc.kind);sc.stage=sc.result='escaped';sc.over=9;g.liveTick(.05);}
 assert(kinds.has('polilla')&&kinds.has('remolino')&&kinds.has('motas'),[...kinds].join());}
// Done on foot: 10 ✦, its Bitácora entry and one notice; with a pulse on time, 15 ✦; walking away, nothing lost or given.
{const g=game();assert(g.liveEncounterSpawn('motas'));const s=g.liveEncounterState().scene;assert.equal(s.verb,'hacer');assert.equal(g.liveEncounterState().line,'Siembra cinco motas en orden.');
 for(const q of s.items)for(let i=0;i<20&&!q.done;i++){g.S.wx=q.x;g.S.wy=q.y;g.liveTick(.05);}assert.equal(s.stage,'done');assert.equal(g.S.sparks,LIVE_REWARD.base);assert.deepEqual(g.elements,['live:motas']);assert.match(g.toasts.at(-1)[0],/Encuentro nuevo.*Cinco motas/);assert.equal(g.S.liveEncounters.kinds.motas.caught,1);
 for(let i=0;i<40;i++)g.liveTick(.05);assert(!g.liveEncounterState().scene);
 assert(g.liveEncounterSpawn('constelacion'));const c=g.liveEncounterState().scene;g.S.wx=c.stars[0].x;g.S.wy=c.stars[0].y;g.waves.push({x:g.S.wx,y:g.S.wy,origin:'player',beat:true});g.liveTick(.05);assert(c.onTime&&c.bonus===1);
 for(const q of c.stars){g.S.wx=q.x;g.S.wy=q.y;g.liveTick(.05);}assert.equal(c.stage,'done');assert.equal(g.S.sparks,LIVE_REWARD.base+LIVE_REWARD.onTime);assert.equal(g.S.liveEncounters.kinds.constelacion.onTime,1);
 for(let i=0;i<40;i++)g.liveTick(.05);
 assert(g.liveEncounterSpawn('brotes'));const b=g.liveEncounterState().scene,bank=g.S.sparks;g.S.wx+=2000;g.liveTick(.05);assert.equal(b.stage,'escaped');assert.equal(g.liveEncounterState().line,'Los brotes esperarán la lluvia.');
 for(let i=0;i<40;i++)g.liveTick(.05);assert(!g.liveEncounterState().scene);assert.equal(g.S.sparks,bank);assert.equal(g.S.liveEncounters.kinds.brotes.escaped,1);assert.equal(g.S.liveEncounters.kinds.brotes.caught,0);assert(!g.elements.includes('live:brotes'));
 // One at a time, whatever the verb; never in a level.
 assert(g.liveEncounterSpawn('caravana'));assert(!g.liveEncounterSpawn('polilla'));assert(!g.liveEncounterSpawn('ola'));assert(!g.liveEncounterSpawn('nodos'));
 g.travelInLevel=()=>true;g.liveTick(.05);assert(!g.liveEncounterState().scene);}
// The prism's nodes: each one sounds as it lights (one quiet note, under the catch note), only with sound on.
{const notes=[],g=game();g.S.sound=true;g.liveAudioCue=n=>notes.push(n);assert(g.liveEncounterSpawn('nodos'));const s=g.liveEncounterState().scene;for(let i=0;i<200&&s.show;i++)g.liveTick(.05);
 assert.equal(notes.length,5);assert(notes.every(n=>n.gain<=.012&&Number.isInteger(n.step)));assert.deepEqual(notes.map(n=>n.step),s.seq);
 const h=game();assert(h.liveEncounterSpawn('nodos'));const q=h.liveEncounterState().scene;const heard=[];h.liveAudioCue=n=>heard.push(n);for(let i=0;i<200&&q.show;i++)h.liveTick(.05);assert(!q.show);assert.equal(heard.length,0,'no sound, no note');}
// Reloading keeps what was caught and the count of encounters seen.
{const g=game(structuredClone(r.S));assert.equal(g.S.liveEncounters.kinds.polilla.caught,2);assert.equal(g.S.liveEncounters.count,r.S.liveEncounters.count);}
console.log('PASS living encounters runtime: travel counts only while moving (not standing, paused or in a menu); one appears ahead after 60–90 s in the biome\'s own kind; on time 15 ✦, walking 10 ✦; one Bitácora entry and one notice the first time; escape costs nothing; atomic save with bounded retries; never in chapters, rounds, finales, activities, the Refugio or underground; one at a time with mischief; future saves kept; batch 2: the hash picks chase or flight, escaping pays 10 ✦ (15 ✦ with a pulse on time), being reached costs nothing and nudges a second; batch 3: the roll in thirds brings «hacer» too, done pays 10 ✦ (15 ✦ with a pulse on time), walking away costs nothing, the prism\'s nodes sound quietly only with sound on');
