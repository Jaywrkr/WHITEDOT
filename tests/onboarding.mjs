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
