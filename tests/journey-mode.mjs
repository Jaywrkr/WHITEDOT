import assert from 'node:assert/strict';
import {journeyDefault,normalizeJourney,JOURNEY_VERSION,freeOpen} from '../src/journey-mode.js';
// New players start in the Journey; anyone who reached the World keeps the free World; tests start free.
assert.equal(journeyDefault({pathCrystals:[]}),'viaje');assert.equal(journeyDefault({pathCrystals:Array(10).fill('x')}),'libre');assert.equal(journeyDefault({lastWorldDay:'2026-10-01'}),'libre');assert.equal(journeyDefault({mode:'world'}),'libre');assert.equal(journeyDefault({},true),'libre');
// Normalizing keeps a chosen mode, fills a missing one and leaves a future version untouched.
assert.deepEqual(normalizeJourney(undefined,{pathCrystals:[]}),{version:JOURNEY_VERSION,mode:'viaje',colors:{},free:false});
assert.deepEqual(normalizeJourney(undefined,{pathCrystals:[],zones:{lago:'x',bosque:'y'}}).colors,{lago:true,bosque:true},'explored colours are kept');assert.deepEqual(normalizeJourney({colors:{lago:true}},{zones:{bosque:'y'}}).colors,{lago:true},'only seeded once');
assert.deepEqual(normalizeJourney({mode:'libre',extra:1},{pathCrystals:[]}),{version:JOURNEY_VERSION,mode:'libre',extra:1,colors:{},free:true});
assert.deepEqual(normalizeJourney({mode:'raro'},{mode:'world'}),{version:JOURNEY_VERSION,mode:'libre',colors:{},free:true});
const future={version:9,mode:'otro',x:1};assert.equal(normalizeJourney(future,{}),future);assert.deepEqual(normalizeJourney([],{}).mode,'viaje');
// The free World opens at the end of the Journey (6A); a save that already reached it keeps it.
assert.equal(freeOpen(normalizeJourney({mode:'viaje'},{pathCrystals:[]})),false);assert.equal(freeOpen(normalizeJourney({mode:'viaje',finished:true},{})),true);
assert.equal(freeOpen(normalizeJourney({mode:'viaje',free:true},{})),true,'once open it stays open');assert.equal(freeOpen(normalizeJourney(undefined,{mode:'world'})),true);
console.log('PASS journey mode: free World closed until the end of the Journey or already reached; new players in the Journey, World players keep the free World, tests start free, chosen mode kept, future version untouched');
