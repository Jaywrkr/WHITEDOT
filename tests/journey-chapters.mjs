import assert from 'node:assert/strict';
import {CHAPTERS,WORLD_CHAPTERS,STATE_CAP,STORM_FLOOR,STATE_FLOOR,stateFloor,VOID_CAP,VOID_ECHO_AFTER,stateCap,normalizeChapters,chapterState,findBiome,initialize,CHAPTER_BARS,PORTAL_WAIT,momentLived,barsLived,LOTUS_GOAL,FOLLOW_GOAL,BOLT_GOAL} from '../src/journey-chapters.js';
assert.deepEqual(CHAPTERS,['camino','llanura','lago','bosque','tormenta','vacio','refugio']);assert.equal(WORLD_CHAPTERS.length,5);
assert(STATE_CAP.silencio<STATE_CAP.llegada&&STATE_CAP.llegada<STATE_CAP.pertenencia&&STATE_CAP.pertenencia<STATE_CAP.plenitud);
// Saved chapters are cleaned; a player already in the World starts at chapter 1.
assert.deepEqual(normalizeChapters({}),{chapter:0,done:{},notes:{},steps:{},progress:{}});assert.equal(normalizeChapters({},true).chapter,1);
assert.deepEqual(normalizeChapters({chapter:3,done:{lago:true,x:true,bosque:'yes'},notes:{lago:[60,'a',200,62],otro:[60]}}),{chapter:3,done:{lago:true},notes:{lago:[60,62]},steps:{},progress:{}});
// Steps stay beside their notes (dropped with them); progress keeps only counts.
assert.deepEqual(normalizeChapters({notes:{lago:[60,'a',62]},steps:{lago:[4,8,12],bosque:[1]},progress:{lago:{bars:12.34,walk:-3,bolts:2.7,x:9},vacio:'no'}}),{chapter:0,done:{},notes:{lago:[60,62]},steps:{lago:[4,12]},progress:{lago:{bars:12.3,bolts:2}}});
assert.deepEqual(normalizeChapters({notes:{lago:[60,62]},steps:{lago:[4]}}).steps,{},'steps that do not match the notes are dropped');
// Phase 2: each chapter is lived (its moment) and stayed in (its bars), not only six hits.
assert.equal(momentLived('llanura',{},{faro:{reached:false}}),false);assert.equal(momentLived('llanura',{},{faro:{reached:true}}),true);
assert.equal(momentLived('lago',{},{lotos:{open:[true,true,false,false,false]}}),false);assert.equal(momentLived('lago',{},{lotos:{open:Array(5).fill(false).map((_,i)=>i<LOTUS_GOAL)}}),true);
assert.equal(momentLived('bosque',{walk:FOLLOW_GOAL},{}),false,'the creature must be there');assert.equal(momentLived('bosque',{walk:FOLLOW_GOAL},{companion:true}),true);
assert.equal(momentLived('tormenta',{bolts:BOLT_GOAL-1}),false);assert.equal(momentLived('vacio',{echoes:1}),true);
assert.equal(barsLived('lago',{bars:CHAPTER_BARS.lago-1}),false);assert.equal(barsLived('lago',{bars:CHAPTER_BARS.lago}),true);
assert(Object.values(CHAPTER_BARS).every(b=>b>=24),'each chapter lasts minutes, not seconds');
assert.equal(normalizeChapters({chapter:99}).chapter,0);
assert.equal(chapterState(0,false),'llegada');assert.equal(chapterState(3,false),'pertenencia');assert.equal(chapterState(0,true),'plenitud');
// The nearest place of a biome on the map.
const map=(x,y)=>x>=1200?'lago':y<=-900?'bosque':'llanura';assert.deepEqual(findBiome('lago',{x:0,y:0},map,()=>false),{x:1200,y:0});assert.equal(findBiome('nada',{x:0,y:0},map,()=>false,300,3),null);
assert(findBiome('lago',{x:0,y:0},map,(x)=>x<1500).x>=1500,'never the sea');assert.deepEqual(findBiome('vacio',{x:0,y:0},()=>'vacio',()=>true),{x:300,y:0},'the Vacío is the sea');
// Runtime: chapter 1 in the Llanura; on-time hits move to Pertenencia; the theme completes the chapter and opens a portal; walking into it travels to the Lago.
const ids=['llanura','lago','bosque','tormenta','vacio'];let saves=0,clock=0;const realNow=performance.now.bind(performance);performance.now=()=>clock;
globalThis.document={querySelectorAll:()=>[]};
const r={S:{journey:{version:1,mode:'viaje'},wx:0,wy:0,layer:'superficie',sound:false},MU:{},SIX:.125,BIOMES:ids.map(id=>({id})),curZone:0,camX:0,camY:0,
 inWorld:()=>true,journeyQuiet:()=>true,biomeOfPos:(x,y)=>ids.indexOf(map(x,y)),regionOfPos:()=>({sea:false}),save:()=>{saves++;return true;},enterFx:0};
initialize(r);const c=new Proxy({},{get:(o,k)=>k in o?o[k]:k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{},set:(o,k,v)=>{o[k]=v;return true;}});
let resets=0;r.journeyPulseReset=()=>resets++;
r.drawJourneyChapters(c,390,844,0);assert.equal(r.journeyChapter().id,'llanura');assert.equal(r.journeyChapter().state,'llegada');assert.equal(r.MU.journeyCap,STATE_CAP.llegada);
for(let i=0;i<6;i++){clock+=400;r.journeyChapterPulse(true,57+i,i*4);}assert.equal(r.journeyChapter().state,'pertenencia');assert.deepEqual(r.journeyChapter().notes.llanura,[57,58,59,60,61,62]);assert.deepEqual(r.S.journey.steps.llanura,[0,4,8,12,16,20],'when each note sounded');
r.journeyChapterPulse(false);assert.equal(r.journeyChapter().hits,6,'misses do not count');
// Bars count while you play in the chapter: a bar is two seconds at this tempo.
for(let i=0;i<8;i++){clock+=250;r.drawJourneyChapters(c,390,844,i);}assert(Math.abs(r.journeyChapter().progress.bars-1)<.01,r.journeyChapter().progress);
assert.equal(r.journeyPhrase(),false,'six hits are not enough: the lighthouse is not reached');
r.S.journey.moments={faro:{x:500,y:0,reached:true}};assert.equal(r.journeyChapter().lived,true);assert.equal(r.journeyPhrase(),false,'nor the bars');
r.S.journey.progress.llanura.bars=CHAPTER_BARS.llanura;assert.equal(r.journeyPhrase(),true);assert.equal(r.journeyChapter().state,'plenitud');assert(r.journeyChapter().portal);assert.equal(r.journeyPhrase(),false,'only once');
// The portal opens after the theme in tutti.
assert.equal(r.journeyChapter().portalOpen,false);r.S.wx=140;r.S.wy=-40;r.drawJourneyChapters(c,390,844,10);assert.equal(r.journeyChapter().id,'llanura','not before the theme sounds');
clock+=PORTAL_WAIT;r.drawJourneyChapters(c,390,844,16);assert.equal(r.journeyChapter().id,'lago','walking into the portal travels');assert(r.S.wx>=1200,'now in the Lago');assert.equal(resets,1,'a new chapter: its theme starts from the first note');
r.curZone=0;r.drawJourneyChapters(c,390,844,20);assert.equal(r.journeyChapter().beacon,true,'away from the Lago, a beacon shows the way');
r.curZone=1;r.drawJourneyChapters(c,390,844,24);assert.equal(r.journeyChapter().beacon,false);clock+=60000;r.drawJourneyChapters(c,390,844,32);assert.equal(r.journeyChapter().state,'silencio','eight quiet bars: the music waits');assert.equal(r.MU.journeyCap,STATE_CAP.silencio);
// Leaving the Journey lifts every cap.
r.journeyQuiet=()=>false;r.drawJourneyChapters(c,390,844,48);
r.journeyQuiet=()=>true;
// The last world chapter leads to the Refugio and its finale.
// The Tormenta: each note on time brings a bolt down on the beat; its Plenitud is a bar of bolts.
assert.equal(stateCap('plenitud','vacio'),VOID_CAP);assert.equal(stateFloor('plenitud','lago'),STATE_FLOOR.plenitud);assert.equal(stateFloor('pertenencia','lago'),null);assert.equal(stateFloor('plenitud','vacio'),null);assert(stateFloor('plenitud','tormenta')>STATE_FLOOR.plenitud,'the climax');assert.equal(stateCap('llegada','lago'),STATE_CAP.llegada);
r.ac={currentTime:10};r.S.journey.chapter=4;r.curZone=3;clock+=1000;r.drawJourneyChapters(c,390,844,60);assert.equal(r.journeyChapter().id,'tormenta');
assert.equal(r.MU.journeyFloor,null,'the climax waits for you');r.journeyChapterPulse(true,52);assert.equal(r.journeyChapter().moments.bolts,1);r.drawJourneyChapters(c,390,844,61);assert.equal(r.MU.boltAt,10,'the bolt falls now');assert.equal(r.MU.journeyFloor,STORM_FLOOR.pertenencia,'playing holds the storm up');
assert.equal(r.MU.boltMine,true,'your bolt');assert.equal(r.MU.journeyOwnBolts,true,'the storm stops its own bolts');
r.MU.boltAt=0;for(let i=0;i<5;i++)r.journeyChapterPulse(true,52);r.MU.boltAt=1;r.S.journey.progress.tormenta.bars=CHAPTER_BARS.tormenta;assert.equal(r.journeyPhrase(),true);assert.equal(r.journeyChapter().moments.bolts,10,'five more and a bar of four');
r.biomeOfPos=(x,y)=>y>=600?4:3;r.journeyTravel();assert.equal(r.journeyChapter().id,'vacio');assert.equal(r.journeyChapter().moments.storm,0,'bolts stay in the Tormenta');
// The Vacío: the cube alone; after eight notes the creatures repeat each note; the phrase needs them.
r.curZone=4;r.drawJourneyChapters(c,390,844,70);assert.equal(r.MU.journeyCap,VOID_CAP);assert.equal(r.MU.journeyFloor,null);
for(let i=0;i<VOID_ECHO_AFTER;i++)r.journeyChapterPulse(true,60);assert.equal(r.journeyChapter().moments.echoes,0);assert.equal(r.journeyPhrase(),false,'not before the creatures come back');
for(let i=0;i<4;i++)r.journeyChapterPulse(true,62);assert.equal(r.journeyChapter().moments.echoes,4);r.drawJourneyChapters(c,390,844,80);assert.equal(r.journeyPhrase(),false,'the Vacío also asks for its bars');r.S.journey.progress.vacio.bars=CHAPTER_BARS.vacio;assert.equal(r.journeyPhrase(),true);
// A chapter kept before a reload opens its portal again beside you.
r.S={...r.S,journey:JSON.parse(JSON.stringify(r.S.journey))};r.drawJourneyChapters(c,390,844,81);assert(r.journeyChapter().portal,'the portal is back');
let finale=0;r.journeyFinale=()=>finale++;assert.equal(r.journeyTravel(),true);assert.equal(finale,1);assert.equal(r.journeyChapter().id,'refugio');
performance.now=realNow;
console.log('PASS journey chapters: seven chapters, saved state cleaned, three states and a waiting pedal as music caps, notes remembered, theme completes the chapter and opens a portal, walking in travels to the next biome, the Tormenta brings bolts on the beat, the Vacío keeps the cube alone until the creatures echo, then leads to the finale; phase 2: each chapter asks for its moment and its bars, the portal waits for the theme, your bolts silence the storm, a kept chapter reopens its portal');
