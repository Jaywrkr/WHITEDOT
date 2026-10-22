import assert from 'node:assert/strict';
import {CHAPTERS,WORLD_CHAPTERS,STATE_CAP,normalizeChapters,chapterState,findBiome,initialize} from '../src/journey-chapters.js';
assert.deepEqual(CHAPTERS,['camino','llanura','lago','bosque','tormenta','vacio','refugio']);assert.equal(WORLD_CHAPTERS.length,5);
assert(STATE_CAP.silencio<STATE_CAP.llegada&&STATE_CAP.llegada<STATE_CAP.pertenencia&&STATE_CAP.pertenencia<STATE_CAP.plenitud);
// Saved chapters are cleaned; a player already in the World starts at chapter 1.
assert.deepEqual(normalizeChapters({}),{chapter:0,done:{},notes:{}});assert.equal(normalizeChapters({},true).chapter,1);
assert.deepEqual(normalizeChapters({chapter:3,done:{lago:true,x:true,bosque:'yes'},notes:{lago:[60,'a',200,62],otro:[60]}}),{chapter:3,done:{lago:true},notes:{lago:[60,62]}});
assert.equal(normalizeChapters({chapter:99}).chapter,0);
assert.equal(chapterState(0,false),'llegada');assert.equal(chapterState(3,false),'pertenencia');assert.equal(chapterState(0,true),'plenitud');
// The nearest place of a biome on the map.
const map=(x,y)=>x>=1200?'lago':y<=-900?'bosque':'llanura';assert.deepEqual(findBiome('lago',{x:0,y:0},map,()=>false),{x:1200,y:0});assert.equal(findBiome('nada',{x:0,y:0},map,()=>false,300,3),null);
assert(findBiome('lago',{x:0,y:0},map,(x)=>x<1500).x>=1500,'never the sea');
// Runtime: chapter 1 in the Llanura; on-time hits move to Pertenencia; the theme completes the chapter and opens a portal; walking into it travels to the Lago.
const ids=['llanura','lago','bosque','tormenta','vacio'];let saves=0,clock=0;const realNow=performance.now.bind(performance);performance.now=()=>clock;
globalThis.document={querySelectorAll:()=>[]};
const r={S:{journey:{version:1,mode:'viaje'},wx:0,wy:0,layer:'superficie',sound:false},MU:{},SIX:.125,BIOMES:ids.map(id=>({id})),curZone:0,camX:0,camY:0,
 inWorld:()=>true,journeyQuiet:()=>true,biomeOfPos:(x,y)=>ids.indexOf(map(x,y)),regionOfPos:()=>({sea:false}),save:()=>{saves++;return true;},enterFx:0};
initialize(r);const c=new Proxy({},{get:(o,k)=>k in o?o[k]:k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{},set:(o,k,v)=>{o[k]=v;return true;}});
r.drawJourneyChapters(c,390,844,0);assert.equal(r.journeyChapter().id,'llanura');assert.equal(r.journeyChapter().state,'llegada');assert.equal(r.MU.journeyCap,STATE_CAP.llegada);
for(let i=0;i<6;i++){clock+=400;r.journeyChapterPulse(true,57+i);}assert.equal(r.journeyChapter().state,'pertenencia');assert.deepEqual(r.journeyChapter().notes.llanura,[57,58,59,60,61,62]);
r.journeyChapterPulse(false);assert.equal(r.journeyChapter().hits,6,'misses do not count');
assert.equal(r.journeyPhrase(),true);assert.equal(r.journeyChapter().state,'plenitud');assert(r.journeyChapter().portal);assert.equal(r.journeyPhrase(),false,'only once');
r.S.wx=140;r.S.wy=-40;r.drawJourneyChapters(c,390,844,16);assert.equal(r.journeyChapter().id,'lago','walking into the portal travels');assert(r.S.wx>=1200,'now in the Lago');
r.curZone=0;r.drawJourneyChapters(c,390,844,20);assert.equal(r.journeyChapter().beacon,true,'away from the Lago, a beacon shows the way');
r.curZone=1;r.drawJourneyChapters(c,390,844,24);assert.equal(r.journeyChapter().beacon,false);clock+=60000;r.drawJourneyChapters(c,390,844,32);assert.equal(r.journeyChapter().state,'silencio','eight quiet bars: the music waits');assert.equal(r.MU.journeyCap,STATE_CAP.silencio);
// Leaving the Journey lifts every cap.
r.journeyQuiet=()=>false;r.drawJourneyChapters(c,390,844,48);
r.journeyQuiet=()=>true;
// The last world chapter leads to the Refugio and its finale.
let finale=0;r.journeyFinale=()=>finale++;r.S.journey.chapter=5;r.curZone=4;r.journeyPhrase();assert.equal(r.journeyTravel(),true);assert.equal(finale,1);assert.equal(r.journeyChapter().id,'refugio');
performance.now=realNow;
console.log('PASS journey chapters: seven chapters, saved state cleaned, three states and a waiting pedal as music caps, notes remembered, theme completes the chapter and opens a portal, walking in travels to the next biome, the Vacío leads to the finale');
