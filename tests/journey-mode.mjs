import assert from 'node:assert/strict';
import {journeyDefault,normalizeJourney,JOURNEY_VERSION} from '../src/journey-mode.js';
// New players start in the Journey; anyone who reached the World keeps the free World; tests start free.
assert.equal(journeyDefault({pathCrystals:[]}),'viaje');assert.equal(journeyDefault({pathCrystals:Array(10).fill('x')}),'libre');assert.equal(journeyDefault({lastWorldDay:'2026-10-01'}),'libre');assert.equal(journeyDefault({mode:'world'}),'libre');assert.equal(journeyDefault({},true),'libre');
// Normalizing keeps a chosen mode, fills a missing one and leaves a future version untouched.
assert.deepEqual(normalizeJourney(undefined,{pathCrystals:[]}),{version:JOURNEY_VERSION,mode:'viaje'});
assert.deepEqual(normalizeJourney({mode:'libre',extra:1},{pathCrystals:[]}),{version:JOURNEY_VERSION,mode:'libre',extra:1});
assert.deepEqual(normalizeJourney({mode:'raro'},{mode:'world'}),{version:JOURNEY_VERSION,mode:'libre'});
const future={version:9,mode:'otro',x:1};assert.equal(normalizeJourney(future,{}),future);assert.deepEqual(normalizeJourney([],{}).mode,'viaje');
console.log('PASS journey mode: new players in the Journey, World players keep the free World, tests start free, chosen mode kept, future version untouched');
