import assert from 'node:assert/strict';
import {initialize} from '../src/live-encounters.js';
import {initialize as mischief} from '../src/universe-mischief.js';
import {mischiefCell} from '../src/universe-mischief-model.js';
import {LIVE_ENCOUNTERS,LIVE_REWARD,LIVE_EVERY,liveInterval} from '../src/live-encounters-model.js';
// The engine inside a small runtime: when it appears, what pauses it, where it never appears, one at a time with the
// mischief scenes, what it pays (atomically) and what it leaves in the Bitácora.
let modal=false,fail=false,saves=0;globalThis.document={hidden:false,querySelector:()=>modal?{}:null};
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const BIOMES=LIVE_ENCOUNTERS.map(d=>({id:d.biome}));
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
// Reloading keeps what was caught and the count of encounters seen.
{const g=game(structuredClone(r.S));assert.equal(g.S.liveEncounters.kinds.polilla.caught,2);assert.equal(g.S.liveEncounters.count,r.S.liveEncounters.count);}
console.log('PASS living encounters runtime: travel counts only while moving (not standing, paused or in a menu); one appears ahead after 60–90 s in the biome\'s own kind; on time 15 ✦, walking 10 ✦; one Bitácora entry and one notice the first time; escape costs nothing; atomic save with bounded retries; never in chapters, rounds, finales, activities, the Refugio or underground; one at a time with mischief; future saves kept');
