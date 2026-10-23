import assert from 'node:assert/strict';
import {normalizeSessions,summarize,playtestParam,PLAYTEST_SESSIONS} from '../src/playtest.js';
// The switch is in the address: ?prueba=1 starts, ?prueba=ver shows, ?prueba=0 stops.
assert.equal(playtestParam('?prueba=1'),'1');assert.equal(playtestParam('?festival=1&prueba=ver'),'ver');assert.equal(playtestParam(''),null);
// Broken notes never stop the game; the list stays bounded and unknown places are dropped.
assert.deepEqual(normalizeSessions(null),[]);assert.deepEqual(normalizeSessions([{},null,{start:'x'}]),[]);
assert.equal(normalizeSessions(Array.from({length:40},(_,i)=>({start:i}))).length,PLAYTEST_SESSIONS);
const s=normalizeSessions([{start:Date.UTC(2026,9,23,10,14),ms:754000,festival:true,finished:false,version:'2.3.0-alpha.136',order:['camino','llanura','nada'],chapters:{camino:{ms:130000,hits:18,misses:7,still:14200,stills:0,hints:1,done:true},llanura:{ms:300000,hits:40,misses:10,still:31000,stills:2,hints:0},nada:{ms:1}}}])[0];
assert.deepEqual(s.order,['camino','llanura']);assert(!('nada' in s.chapters));
// One block per person, one line per chapter, in Spanish.
const text=summarize([s]);
assert.match(text,/^Persona 1 · .* · 12:34 · festival · 2\.3\.0-alpha\.136/);
assert.match(text,/\nCamino 2:10 ✓ · 18\/25 a tiempo \(72%\) · quieto máx 14 s · dedo 1/);
assert.match(text,/\nLlanura 5:00 · 40\/50 a tiempo \(80%\) · quieto máx 31 s \(2 veces más de 15 s\)$/);
assert.equal(summarize([]),'Sin pruebas todavía.');assert.equal(summarize([{start:1,ms:2000,order:['camino'],chapters:{}},{start:2,ms:60000,order:[],chapters:{}}]),'Sin pruebas todavía.','empty or tiny sessions are left out');
console.log('PASS playtest notes: switched by the address, broken notes dropped, bounded, one Spanish line per chapter with time, pulses on time, stillness and the ghost finger');
