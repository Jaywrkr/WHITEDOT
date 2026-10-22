import assert from 'node:assert/strict';
import {heardOf,superbiomeProgress,superbiomeSection,FIGURE} from '../src/superbiome-journal.js';
import {SUPERBIOME_COUNT} from '../src/superbiomes.js';
// Heard superbiomes: only known ids; malformed or future data is ignored, never thrown on.
assert.deepEqual(heardOf({}),{});assert.deepEqual(heardOf({universe:{super:[1]}}),{});assert.deepEqual(heardOf({universe:{super:'x'}}),{});
const S={universe:{super:{'lago:dub':'2026-10-22','faros:techno':1,'futuro:x':'2027-01-01'},constellations:{'1,2':true,'3,4':true}}};
assert.deepEqual(Object.keys(heardOf(S)).sort(),['faros:techno','lago:dub']);assert.deepEqual(superbiomeProgress(S),{heard:2,total:SUPERBIOME_COUNT});
// The grid: every valid superbiome once, heard ones gold with their day, rare and absent ones marked.
const html=superbiomeSection(S,id=>({lago:'Marea',faros:'Púlsares'})[id]);
assert.equal((html.match(/data-superbiome=/g)||[]).length,SUPERBIOME_COUNT);assert.equal((html.match(/super-cell got/g)||[]).length,2);
assert.match(html,/Superbiomas · 2\/105/);assert.match(html,/Marea · Dub · oído el 22 oct/);assert.match(html,/data-superbiome="ruinas:dnb" title="[^"]*no aparece"/);assert.match(html,/Marea · Dub \(raro\)|Marea · Breaks · raro/);
// Constellations joined appear as their figure, at most twelve drawn.
assert.match(html,/Constelaciones unidas · 2/);assert.equal((html.match(/<svg/g)||[]).length,2);assert.equal(FIGURE.length,7);
const many={universe:{constellations:Object.fromEntries(Array.from({length:30},(_,i)=>[i+',0',true]))}};assert.equal((superbiomeSection(many,()=>null).match(/<svg/g)||[]).length,12);
assert.match(superbiomeSection({},()=>null),/Completa el tema/);
assert(!/<script|onerror/.test(superbiomeSection({universe:{super:{'<img onerror=1>':'x'}}},()=>'<b>')),'names are escaped');
console.log('PASS superbiome journal: 105 cells, heard in gold with their day, rare and absent marked, malformed and future saves ignored, constellation figures');
