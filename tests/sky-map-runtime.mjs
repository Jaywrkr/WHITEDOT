import assert from 'node:assert/strict';
import {initialize as sky} from '../src/sky-map.js';
import {initialize as live} from '../src/live-encounters.js';
import {initialize as mischief} from '../src/universe-mischief.js';
import {SKY_REWARD,SKY_GLOW,SKY_LEAVE,SKY_STAR_GAIN,SKY_MOTIF_GAIN,skyStar,skyFigure,skySeries} from '../src/sky-map-model.js';
// The Mapa del cielo inside a small runtime: only in the free World after the Journey, one scene at a time with the
// living encounters and the mischief scenes (sharing their clock), half-done saved and resumed, paid once and
// atomically, the zodiac's halo, letting go from the Bitácora.
let modal=false,fail=false,saves=0;globalThis.document={hidden:false,querySelector:()=>modal?{}:null};
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
function game(){const toasts=[],queue=[],notes=[],r={S:{mode:'world',todayKey:'2026-10-28',layer:'superficie',wx:0,wy:0,sparks:0,sound:true,journey:{version:1,mode:'libre',free:true},sparkEconomy:{version:1,earned:0,spent:0,log:[]}},
 worldIdentity:{seed:'sky',generation:2},BIOMES:[{id:'llanura'}],seedOf,waves:[],regionOfPos:()=>({z:0,sea:false,genre:'deep',key:'0,0',scale:[0,2,3,5,7,9,10]}),inWorld(){return this.S.mode==='world';},save(){saves++;return !fail;},
 get sparkEconomy(){return this.S.sparkEconomy;},toast:(...a)=>toasts.push(a),showSparkPickup(){},recordElement(){return true;},
 chordTones:()=>[57,60,64,67],vel:n=>n,hookInst:(instrument,note,time,gain)=>notes.push({instrument,note,time,gain}),beatSoon:(fn,vis)=>queue.push({fn,vis}),totemNear:()=>[],inhabitantsNear:()=>[],MU:{step:0,tr:0},SIX:.125,ac:{state:'running',currentTime:0},toasts,queue,notes};
 mischief(r);live(r);sky(r);return r;}
const tick=(r,n=1,dt=.05)=>{for(let i=0;i<n;i++){r.liveTick(dt);r.skyMapTick(dt);}};
const flush=r=>{for(const q of r.queue.splice(0)){q.fn(1);q.vis?.();}};
const goTo=(r,k)=>{const s=r.skyMapState().scene,p=skyStar(s.site,k);r.S.wx=p.x;r.S.wy=p.y;tick(r);};
// Only in the free World after the Journey: not before it is open, not in a level.
let r=game();r.S.journey={version:1,mode:'viaje',free:false};assert(!r.skyMapState().allowed);assert(!r.skyMapSpawn('gato'));
r=game();r.travelInLevel=()=>true;assert(!r.skyMapSpawn('gato'),'not in a level');
r=game();assert(r.skyMapState().allowed);
// A figure starts with its name; while it runs, no living encounter starts and their clock waits.
assert(r.skyMapSpawn('gato'));let st=r.skyMapState();assert.equal(st.title,'Mapa del cielo · Gato');assert.equal(st.hint,'Pasa por sus estrellas en orden.');
assert(!r.liveEncounterSpawn('polilla'),'one scene at a time');assert(!r.skyMapSpawn('cubo'));
for(let i=0;i<150;i++){r.S.wx+=2;tick(r);}assert(r.skyMapState().scene);assert.equal(r.liveEncounterState().travel,0,'the encounters\' clock waits');
// In order: touching another star first does nothing; the next one lights with its note, and the figure is saved.
const site=r.skyMapState().scene.site;goTo(r,3);assert.equal(site.lit,0);
goTo(r,0);goTo(r,1);assert.equal(site.lit,2);assert(r.S.skyMap.sites[site.id],'saved with its first star');assert.equal(r.S.skyMap.sites[site.id].lit,2);
assert.equal(r.queue.length,2);flush(r);assert.equal(r.notes.length,2);assert(r.notes.every(n=>n.gain===SKY_STAR_GAIN&&n.note>=57&&n.note<=96));
// Walking away leaves it half-done, saved where it was; the encounters' clock starts again.
r.S.wx=site.x+SKY_LEAVE+50;r.S.wy=site.y;tick(r);st=r.skyMapState();assert(!st.scene);assert.equal(st.summary,'Gato · 2 de 5 · guardada');assert.equal(r.S.skyMap.sites[site.id].lit,2);assert.equal(r.liveEncounterState().travel,0);
// Coming back resumes it as it was.
r.S.wx=site.x;r.S.wy=site.y;tick(r);st=r.skyMapState();assert(st.scene&&st.scene.site.id===site.id);assert.equal(st.title,'Gato · 2 de 5');assert.equal(st.hint,'La dejaste aquí. Sigue.');
// A pulse on time near the next star lights it; walking does the rest; complete: the motif and 30 ✦, once, one notice.
const p2=skyStar(site,2);r.waves.push({x:p2.x+20,y:p2.y,origin:'player',beat:true});r.S.wx=p2.x+300;tick(r);assert(site.lit>=3&&site.onTime);
for(let k=site.lit;k<5;k++)goTo(r,k);assert(site.done);st=r.skyMapState();assert.equal(st.scene.stage,'done');
assert.equal(r.S.sparks,SKY_REWARD.onTime);assert.equal(r.S.skyMap.earned,SKY_REWARD.onTime);assert.equal(r.S.skyMap.figures.gato.done,1);assert.equal(r.S.skyMap.figures.gato.onTime,1);
assert.equal(r.toasts.length,1);assert.match(r.toasts[0][0],/Constelación nueva.*Gato/);assert.equal(r.S.sparkEconomy.log.at(-1).text,`Mapa del cielo · +${SKY_REWARD.onTime} chispas`);
const before=r.notes.length;flush(r);const motif=r.notes.slice(before).filter(n=>n.gain===SKY_MOTIF_GAIN);assert.equal(motif.length,skyFigure('gato').motif.length,'its motif, note by note');
assert(motif.every((n,i)=>i===0||Math.abs(n.time-motif[i-1].time-.25)<1e-9),'on the eighths');
tick(r,Math.ceil(SKY_GLOW/.05)+2);st=r.skyMapState();assert(!st.scene);assert.equal(st.summary,'Gato · completa · +30 ✦');assert(r.S.skyMap.sites[site.id].done,'it stays as a faint drawing');
// Another Gato elsewhere: the music and the light, no sparks and no notice (once per figure).
r.S.wx+=5000;tick(r);assert(r.skyMapSpawn('gato'));assert.equal(r.skyMapState().title,'Gato · ya en tu mapa');let again=r.skyMapState().scene.site;for(let k=0;k<5;k++)goTo(r,k);
assert.equal(r.S.sparks,SKY_REWARD.onTime);assert.equal(r.toasts.length,1);assert.equal(r.S.skyMap.figures.gato.done,2);tick(r,Math.ceil(SKY_GLOW/.05)+2);assert.equal(r.skyMapState().summary,'Gato · completa · ya en tu mapa');
// A failed save keeps nothing, retries a bounded number of times and ends kindly.
r.S.wx+=5000;tick(r);assert(r.skyMapSpawn('cubo'));const bank=structuredClone({sparks:r.S.sparks,figures:r.S.skyMap.figures,economy:r.S.sparkEconomy});fail=true;const n0=saves;
let c=r.skyMapState().scene.site;for(let k=0;k<4;k++)goTo(r,k);tick(r,200);fail=false;
assert.equal(r.S.sparks,bank.sparks);assert.deepEqual(r.S.skyMap.figures,bank.figures);assert.deepEqual(r.S.sparkEconomy,bank.economy);assert(saves-n0<=8,'bounded');assert(!r.skyMapState().scene);
// A living encounter keeps the stars asleep: near a half-done figure nothing starts while it runs.
r.S.wx+=5000;tick(r);assert(r.skyMapSpawn('lira'));const half=r.skyMapState().scene.site;goTo(r,0);r.S.wx=half.x+2000;tick(r);assert(!r.skyMapState().scene);
assert(r.liveEncounterSpawn('polilla'));r.S.wx=half.x;r.S.wy=half.y;tick(r,3);assert(!r.skyMapState().scene,'one at a time');
// The Bitácora: the half-done one with where it is, the series, and letting it go.
const html=r.skyMapSection();assert.match(html,/Mapa del cielo · 1 de 28/);assert.match(html,/Lira · 1 de 5 · aquí/);assert.match(html,/data-sky-release/);assert.match(html,/Zodiaco · 0 de 12/);assert.match(html,/data-sky-figure="mano"[^>]*><svg[\s\S]*?<h4>\?\?\?<\/h4>/,'La Mano stays a secret');
assert(r.skyMapRelease(half.id));assert(!r.S.skyMap.sites[half.id]);assert.doesNotMatch(r.skyMapSection(),/Lira · 1 de 5/);
// The zodiac complete: the star halo, one notice naming it, worn at once; taken off and on again.
r=game();for(const f of skySeries('zodiaco').slice(0,11))r.S.skyMap.figures[f.id]={first:'',done:1,onTime:0};
assert(r.skyMapSpawn('piscis'));for(let k=0;k<5;k++)goTo(r,k);
assert(r.S.skyMap.halo&&r.S.skyMap.wear.halo===true&&r.skyMapState().halo);assert.equal(r.toasts.length,1);assert.match(r.toasts[0][0],/Halo de estrellas/);assert.equal(r.S.sparks,SKY_REWARD.base);
assert(r.skyMapToggleHalo());assert.equal(r.S.skyMap.wear.halo,false);assert(!r.skyMapState().halo);assert(r.skyMapToggleHalo());assert(r.skyMapState().halo);
assert.match(r.skyMapSection(),/Zodiaco · 12 de 12 <em class="sky-earned">Halo de estrellas<\/em>/);
console.log('PASS sky map runtime: only in the free World after the Journey and never in a level; one scene at a time with the living encounters (their clock waits and starts again); joined in order with its notes, saved with the first star, left half-done and resumed; complete: the motif on the eighths and 30 ✦ once, one notice; a repeat pays nothing; a failed save keeps nothing; the Bitácora lets it go; the zodiac gives the halo, worn and taken off');
