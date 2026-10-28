import assert from 'node:assert/strict';
import {roundSparks} from '../src/spark-rules.js';
import {PLACES,PLACE_IDS,TOTAL_STARS,roundStars,roundPercent,roundTime,normalizePlaces,starCount,placeOpen,previousPlace,nextOnPath,allComplete,initialize} from '../src/places.js';
// Eleven places, 33 stars; the five of the Journey open after it, the six new ones in order, each after the one before
// it (plan H3).
assert.equal(PLACES.length,11);assert.equal(TOTAL_STARS,33);assert.deepEqual(PLACE_IDS.map(previousPlace),[null,null,null,null,null,'vacio','jardin','dunas','cristales','faros','ruinas']);
// Stars of a round: ★ always; ★★ 75 % on time with sound; ★★★ a Maestro round with 70 % (plan I5; 85 and 80 before).
assert.deepEqual(roundStars({onTime:.5}),[true,false,false]);assert.deepEqual(roundStars({onTime:.75}),[true,true,false]);assert.deepEqual(roundStars({onTime:.74}),[true,false,false]);assert.deepEqual(roundStars({onTime:.9,sound:false}),[true,false,false]);
assert.deepEqual(roundStars({onTime:.72,maestro:true}),[true,false,true]);assert.deepEqual(roundStars({onTime:.69,maestro:true}),[true,false,false]);assert.deepEqual(roundStars({onTime:.9,maestro:true}),[true,true,true]);
// Saves: a chapter kept in the Journey is a ★ of its place, even from before; a future version is kept untouched.
const n=normalizePlaces(null,{done:{llanura:true,lago:true}});assert.deepEqual(n.stars.llanura,[true,false,false]);assert.equal(starCount(n),2);
const future={version:9,x:1};assert.equal(normalizePlaces(future),future);
assert(!placeOpen(n,'llanura',{done:{}}),'closed during the Journey');assert(placeOpen(n,'llanura',{finished:true}));assert(!placeOpen(n,'jardin',{finished:true}),'the Jardín comes after the Vacío');assert(placeOpen(normalizePlaces(null,{done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}}),'jardin',{finished:true}),'with the five of the Journey the Jardín opens (plan F9)');assert(!placeOpen(normalizePlaces({stars:{jardin:[false,true]}},{}),'dunas',{finished:true}),'the Dunas wait for the Jardín complete, whatever the stars');
assert(placeOpen(normalizePlaces({stars:{jardin:[true]}},{}),'dunas',{finished:true}),'the Jardín complete opens the Dunas');
assert(placeOpen(normalizePlaces({stars:{dunas:[true]}},{}),'dunas',{finished:true}),'a place already complete stays open');
// A version-1 save keeps every door its stars had opened (old ladder 5, 8, 12…); a fresh one follows the path.
{const v1=normalizePlaces({version:1,stars:Object.fromEntries(['llanura','lago','bosque'].map(id=>[id,[true,true,true]]))},{});assert(v1.kept.jardin&&v1.kept.dunas&&!v1.kept.cristales);assert(placeOpen(v1,'dunas',{finished:true}));assert.equal(v1.version,2);
 assert.equal(nextOnPath(v1,{finished:true}).id,'tormenta','the next on the path: the first open and not complete');}
// Winning is the eleven complete; the 33 stars are the master version.
{const eleven=normalizePlaces({stars:Object.fromEntries(PLACE_IDS.map(id=>[id,[true]]))},{});assert(allComplete(eleven));assert.equal(starCount(eleven),11);assert.equal(nextOnPath(eleven,{finished:true}),null);}
// Runtime: a round of the Lago, stars, sparks, record, and the chapter's own state back as it was.
const realNow=Date.now;let clock=1e9;Date.now=()=>clock;globalThis.setTimeout=()=>0;
const r={S:{wx:0,wy:0,sound:true,sparks:5,todayKey:'2026-10-23',journey:{finished:true,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true},chain:{points:340,opened:true,hinted:true}}},
 BIOMES:[{id:'llanura'},{id:'lago'}],biomeOfPos:(x,y)=>x>1000?1:0,regionOfPos:()=>({}),MU:{},save:()=>true,hud(){},$:()=>null};
r.S.places={'0,0':1,'3,-2':1};initialize(r);assert.equal(r.places().count,5);assert.deepEqual(r.S.places,{'0,0':1,'3,-2':1},'the visited regions of the map are never touched');assert(r.S.lugares.stars);
assert.equal(r.startPlace('lago',{maestro:true}),false,'Maestro asks ★★ first');
assert.equal(r.startPlace('lago'),true);assert(r.S.wx>1000,'taken to the Lago');assert.deepEqual(r.S.journey.chain,{hinted:true},'an empty bar, the rule already told');
for(let i=0;i<20;i++)r.placeHear('lago',i<18,{});assert.deepEqual(r.places().run,{id:'lago',maestro:false,hits:18,total:20});
clock+=150000;assert.equal(r.placeFinish('lago'),true);
let st=r.places();assert.deepEqual(st.stars.lago,[true,true,false]);assert.equal(st.last.sparks,roundSparks(.9),'80 + 9×9');assert.equal(roundSparks(.9),161);assert.equal(r.S.sparks,5+161);assert.equal(st.best.lago.ms,150000);assert.equal(st.run,null);
assert.deepEqual(r.S.journey.chain,{points:340,opened:true,hinted:true},'the Journey chapter as it was');
// Maestro now open: ★★★ with 70 %, tempo and window while it lasts, sparks doubled.
assert.equal(r.startPlace('lago',{maestro:true}),true);assert.equal(r.MU.tempoScale,1.1);assert.equal(r.MU.onTimeWindow,.06);assert.equal(r.placeGoalScale(),1.5);
for(let i=0;i<10;i++)r.placeHear('lago',i<8,{});r.placeFinish('lago');st=r.places();assert.deepEqual(st.stars.lago,[true,true,true]);assert.equal(st.last.sparks,2*(80+72));assert.equal(r.MU.tempoScale,1);assert.equal(st.count,7);
// From the fourth round of the day in a place, half.
for(let k=0;k<2;k++){r.startPlace('lago');r.placeHear('lago',true,{});r.placeFinish('lago');}assert.equal(r.places().last.sparks,85);
// Without sound: only ★.
r.startPlace('bosque');r.placeHear('bosque',true,{silent:true});r.placeFinish('bosque');assert.deepEqual(r.places().stars.bosque,[true,false,false]);
// A round left open by a reload is dropped and the chapter's state restored.
r.startPlace('tormenta');r.S.journey.dance={points:99};const saved=JSON.parse(JSON.stringify(r.S));const r2={...r,S:saved};initialize(r2);assert.equal(r2.places().run,null);assert.equal(r2.S.journey.dance,undefined);
// The Journey: a chapter played on time gives its ★★ when kept.
const r3={...r,S:{wx:0,wy:0,sound:true,journey:{done:{}}}};initialize(r3);for(let i=0;i<10;i++)r3.placeHear('llanura',true,{});r3.placeChapterKept('llanura');assert.deepEqual(r3.places().stars.llanura,[true,true,false]);
Date.now=realNow;
// Plan I4: the steps of your notes are kept beside them, only when there is one for each note.
{const n=normalizePlaces({version:2,notes:{lago:[60,62],cueva:[67]},noteSteps:{lago:[0,6],cueva:[1,2],jardin:[3]}});assert.deepEqual(n.noteSteps,{lago:[0,6]});assert.deepEqual(normalizePlaces({}).noteSteps,{});}
console.log('PASS places: eleven places and 33 stars, the Journey gives ★ (★★ if played on time), a round gives stars, sparks and a record and gives back the chapter, Maestro opens with ★★ (tempo, window, ×1.5), half from the fourth round, only ★ without sound, an open round dropped on reload');

// Display precision must never announce a rhythm threshold that was not earned.
for(const ratio of [.6999,.7,.746,.74999,.75,1]){const display=Number(roundPercent(ratio).replace(',','.'));assert(display<=ratio*100+1e-9);if(display>=75)assert(roundStars({onTime:ratio})[1]);}
assert.equal(roundPercent(.746),'74,6');
for(const [ms,text] of [[59999,'0:59'],[60000,'1:00'],[119999,'1:59'],[120000,'2:00'],[-1,'0:00'],[NaN,'0:00'],[Infinity,'0:00']])assert.equal(roundTime(ms),text);
