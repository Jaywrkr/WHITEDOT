import assert from 'node:assert/strict';
import {ensureJournal,regionFromKey} from '../src/journal.js';
const old={cat:{'0,0:0':1},places:{'0,0':1},stars:[{d:'2026-10-12',s:1}],events:{'aurora:-2,32026-10-12':1}};
const j=ensureJournal(old);
assert.deepEqual(old.cat,{'0,0:0':1});assert.equal(old.stars.length,1);
assert.deepEqual(j.relics,{});assert.equal(j.events['-2,3'],1);
old.stars.push({region:'2,-3'});ensureJournal(old);assert.equal(j.relics['2,-3'],1);
assert.deepEqual(ensureJournal(JSON.parse(JSON.stringify(old))),j);
assert.equal(regionFromKey('<script>',{}),null);
assert.equal(regionFromKey('2,-3',{REG:4,WCH:900,regionOfPos:(x,y)=>[x,y]})[0],7201);
console.log('PASS: legacy discoveries retained, event locations recovered, old relic locations not fabricated, journal survives serialization');
// T0 (bug 21): Bitácora › Hoy and Logros say «1 lugar», never «1 lugares», and a day as «4 nov», never «2026-11-04».
{const {plural,journalDay}=await import('../src/journal-model.js');assert.equal(plural(1,'lugar','lugares'),'1 lugar');assert.equal(plural(0,'lugar','lugares'),'0 lugares');assert.equal(plural(3,'forma','formas'),'3 formas');
 assert.equal(journalDay('2026-11-04'),'4 nov');assert.equal(journalDay('2026-01-31'),'31 ene');assert.equal(journalDay('ayer'),'ayer');assert.equal(journalDay(''),'');
 const {readFileSync}=await import('node:fs'),src=readFileSync(new URL('../src/journal.js',import.meta.url),'utf8');assert(!src.includes('${summary.places} lugares'),'no fixed plural');assert(!src.includes("(date?date:'Pendiente')"),'no ISO date in Logros');
 console.log('PASS journal: plurals by number and short dates in Hoy and Logros');}
