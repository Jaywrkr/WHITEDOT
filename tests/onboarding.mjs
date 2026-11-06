import assert from 'node:assert/strict';
import {FIRST_JOURNEY_STEPS,normalizeFirstJourney,firstJourneyNext,advanceFirstJourney} from '../src/onboarding-model.js';
import {initialize as guide} from '../src/voice-guide.js';
const state=normalizeFirstJourney(null);assert.equal(firstJourneyNext(state)[0],'move');assert(advanceFirstJourney(state,'light'));assert(state.facts.move);assert.equal(firstJourneyNext(state)[0],'world');assert(!advanceFirstJourney(state,'light'));
advanceFirstJourney(state,'world');assert.equal(firstJourneyNext(state)[0],'voice');advanceFirstJourney(state,'pulse');assert.equal(firstJourneyNext(state)[0],'voice','a pulse alone does not prove an encounter was heard');advanceFirstJourney(state,'voice');assert.equal(firstJourneyNext(state)[0],'save');advanceFirstJourney(state,'save');assert.equal(firstJourneyNext(state),null);
assert.equal(firstJourneyNext(normalizeFirstJourney(null,{experienced:true})),null);assert.equal(firstJourneyNext(normalizeFirstJourney({version:1,facts:{move:true}},{experienced:true}))[0],'light','an explicit unfinished lesson resumes');
const future=normalizeFirstJourney({version:7,facts:{future:true},extra:{reward:'kept'}});assert(future.readOnly);assert(!advanceFirstJourney(future,'save'));assert.equal(future.extra.reward,'kept');assert(future.facts.future);
const extended=normalizeFirstJourney({version:1,extension:{earned:7},facts:{move:true,unknown:true}});assert.equal(extended.extension.earned,7);assert(extended.facts.unknown);
assert(FIRST_JOURNEY_STEPS.every(([,text])=>text.split(/\s+/).length<=12));
const controls=new Map(),events=[],messages=[],source={x:10,y:20,role:'bajo'},r={S:{sound:true,voiceMode:'guia'},ac:{state:'running'},musicVolume:()=>1,$:id=>{if(!controls.has(id))controls.set(id,{});return controls.get(id);},save(){},getVoice(kind,region,o){assert.equal(o,source);return {role:o.role};},say:text=>messages.push(text),firstJourneyEvent:id=>events.push(id)};
guide(r);r.voiceGuideHear('living:cactus',{},source,'player');assert(r.S.voiceLearned.bajo);assert.match(messages[0],/graves/);assert.deepEqual(events,['voice']);
r.voiceGuideHear('living:cactus',{},source,'player');assert.equal(events.length,2,'replaying guidance still detects a previously learned role');
r.S.sound=false;r.voiceGuideHear('living:cactus',{},source,'player');r.S.sound=true;r.ac.state='suspended';r.voiceGuideHear('living:cactus',{},source,'player');r.ac.state='running';r.musicVolume=()=>0;r.voiceGuideHear('living:cactus',{},source,'player');assert.equal(events.length,2);
r.musicVolume=()=>1;r.voiceGuideHear('living:cactus',{},source,'ambient');r.voiceGuideHear('pulso',{},source,'player');assert.equal(events.length,2,'ambient and empty pulses cannot complete the encounter lesson');
console.log('PASS optional factual first journey, reload/future preservation, short hints, actual source roles and audible player-only learning');
let options;r.firstJourneyState={next:'pulse'};r.say=(text,title,value)=>options=value;source.role='perc';r.voiceGuideHear('living:cactus',{},source,'player');assert.equal(options.recordOnly,true,'learning records context without stacking another spoken hint over the tutorial');

assert(FIRST_JOURNEY_STEPS[1][1].includes('diez cristales'));assert(FIRST_JOURNEY_STEPS[2][1].includes('automáticamente'));

const learnedOnPath=normalizeFirstJourney(null);advanceFirstJourney(learnedOnPath,'pulse');advanceFirstJourney(learnedOnPath,'world');advanceFirstJourney(learnedOnPath,'voice');assert.equal(firstJourneyNext(normalizeFirstJourney(learnedOnPath))[0],'save','a pulse learned on Camino is not taught again after reload');

const {lessonAvailable}=await import('../src/onboarding-model.js');assert(lessonAvailable({finished:false}));assert(!lessonAvailable({finished:true}));assert(lessonAvailable({finished:true},true));

// Listo 1 (alpha.273): the open World's guide. Six short steps, from 1, each a real event; a later event proves the
// earlier ones; the Journey's steps and facts are untouched; a finished Camino guide counts as finished; reload keeps it.
{const {OPEN_WORLD_STEPS}=await import('../src/onboarding-model.js');
 assert.deepEqual(OPEN_WORLD_STEPS.map(([id])=>id),['move','find','portal','round','result','explore']);
 assert(OPEN_WORLD_STEPS.every(([,text])=>text.split(/\s+/).length<=12));assert(!OPEN_WORLD_STEPS.some(([,text])=>/cristal|Camino/i.test(text)),'no Camino in the open guide');
 const o=normalizeFirstJourney(null);assert.equal(firstJourneyNext(o,OPEN_WORLD_STEPS)[0],'move','the open guide starts at its first step');
 assert(advanceFirstJourney(o,'portal',OPEN_WORLD_STEPS));assert(o.facts.move&&o.facts.find,'entering the portal proves the walk');assert.equal(firstJourneyNext(o,OPEN_WORLD_STEPS)[0],'round');
 assert(!advanceFirstJourney(o,'light',OPEN_WORLD_STEPS),'a Journey step is not an open step');assert.equal(firstJourneyNext(o)[0],'light','the Journey keeps its own next step');
 const back=normalizeFirstJourney(JSON.parse(JSON.stringify(o)));assert.equal(firstJourneyNext(back,OPEN_WORLD_STEPS)[0],'round','kept on reload');
 const done=normalizeFirstJourney({version:1,facts:Object.fromEntries(FIRST_JOURNEY_STEPS.map(([id])=>[id,true]))});assert.equal(firstJourneyNext(done,OPEN_WORLD_STEPS),null,'a finished Camino guide is not repeated');
 for(const id of ['result','explore'])advanceFirstJourney(back,id,OPEN_WORLD_STEPS);assert.equal(firstJourneyNext(back,OPEN_WORLD_STEPS),null);
 const {normalizeJourney,caminoPast,categoryLabel,hiddenAchievement}=await import('../src/journey-mode.js');
 const fresh={pathCrystals:[],ach:{}};fresh.journey=normalizeJourney(null,fresh,false,{open:true});assert(!caminoPast(fresh),'a new player of the open World never had the Camino');
 assert.equal(categoryLabel('Camino',fresh),'Días');assert.equal(categoryLabel('Casa',fresh),'Refugio');assert(hiddenAchievement('tope',fresh));assert(!hiddenAchievement('dia1',fresh));
 const mid={pathCrystals:[],ach:{}};mid.journey=normalizeJourney({version:1,mode:'viaje',done:{llanura:true}},mid,false,{open:true});assert(caminoPast(mid),'a save from the middle of the Journey had the Camino');
 const reached={pathCrystals:[1,2],lastWorldDay:'x',ach:{mundo:'x'}};reached.journey=normalizeJourney(null,reached,false,{open:true});assert(caminoPast(reached),'a save that reached the World by the Camino keeps it');
 const journey={pathCrystals:[],ach:{}};journey.journey=normalizeJourney(null,journey,false);assert(caminoPast(journey)&&categoryLabel('Camino',journey)==='Camino'&&!hiddenAchievement('tope',journey),'the Journey is untouched');
 const won={...fresh,ach:{tope:'x'}};assert(!hiddenAchievement('tope',won),'an earned «tope» stays listed');
 console.log('PASS open World guide: six real steps from 1, Journey facts untouched, finished guides kept, Camino named only where it was played');}
