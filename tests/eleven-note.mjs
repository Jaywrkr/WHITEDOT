// Jay (28 Oct 2026, alpha.232, G3): after the finale of the eleven places, one note, once per save, with «Explorar»;
// Lugares keeps it. It waits for any round, finale or sheet; a failed save leaves it unseen on disk; future formats stay.
import assert from 'node:assert/strict';
import {PLACE_IDS,normalizePlaces} from '../src/places.js';
import {ELEVEN_NOTE_VERSION,normalizeElevenNote,elevenNoteSeen,elevenNoteDue,elevenNoteLines,initialize} from '../src/eleven-note.js';
const places=(stars=[true,false,false],extra={})=>({...normalizePlaces({version:2,stars:Object.fromEntries(PLACE_IDS.map(id=>[id,[...stars]]))}),...extra});
// The saved note: missing or broken is unseen; unknown fields kept; a future version counts as seen and stays as it is.
assert.deepEqual(normalizeElevenNote(undefined),{version:ELEVEN_NOTE_VERSION,seen:false});
assert.deepEqual(normalizeElevenNote([1]),{version:ELEVEN_NOTE_VERSION,seen:false});
assert.deepEqual(normalizeElevenNote({seen:true,keep:'x'}),{seen:true,keep:'x',version:ELEVEN_NOTE_VERSION});
const future={version:9,whatever:1};assert.equal(normalizeElevenNote(future),future);assert.equal(elevenNoteSeen(future),true);
assert.equal(elevenNoteSeen({seen:'yes'}),false);
// Due only with the eleven complete and their finale played (`won`), never twice, never on a read-only save.
assert.equal(elevenNoteDue(places(),undefined),false,'the finale has not played');
assert.equal(elevenNoteDue(places([true,false,false],{won:true}),undefined),true);
const ten=places([true,false,false],{won:true});ten.stars.cueva=[false,false,false];assert.equal(elevenNoteDue(ten,undefined),false);
assert.equal(elevenNoteDue(places([true,false,false],{won:true}),{seen:true}),false);
assert.equal(elevenNoteDue({...places([true,false,false],{won:true}),readOnly:true},undefined),false);
// Lines: the stars while any is left, the free jump while it is free.
assert.deepEqual(elevenNoteLines(places(),{}),{stars:true,free:true});
assert.deepEqual(elevenNoteLines(places([true,true,true]),{freeJumpUsed:true}),{stars:false,free:false});
// The module: shown once after the finale closes, in the World, with nothing else open; Lugares reopens it.
function element(id){return {id,hidden:true,textContent:'',onclick:null};}
const els=Object.fromEntries(['mEleven','elevenStars','elevenJump','elevenExplore','lugaresEleven','mLugares'].map(id=>[id,element(id)]));
let openModal=null,intervals=[];
globalThis.document={getElementById:id=>els[id]||null,querySelector:()=>openModal};
globalThis.setInterval=fn=>{intervals.push(fn);return intervals.length;};
let saves=0,saveOk=true;
const d=places([true,false,false]);
const runtime={S:{journey:{finished:true}},placesData:()=>d,save:()=>{saves++;return saveOk;},hud(){},inWorld:()=>true,placeRun:()=>null,songStageState:()=>({running:false}),houseActive:()=>false};
initialize(runtime);
assert.equal(intervals.length,1);assert.equal(els.lugaresEleven.hidden,false,'all eleven complete: the link in Lugares');
assert.equal(runtime.elevenNoteCheck(),false,'not before the finale');d.won=true;
// Never over a round, a finale, a sheet, the Refugio or the Camino.
runtime.placeRun=()=>({id:'cueva'});assert.equal(runtime.elevenNoteCheck(),false);runtime.placeRun=()=>null;
runtime.songStageState=()=>({running:true});assert.equal(runtime.elevenNoteCheck(),false);runtime.songStageState=()=>({running:false});
openModal={id:'mPlace'};assert.equal(runtime.elevenNoteCheck(),false);openModal=null;
runtime.inWorld=()=>false;assert.equal(runtime.elevenNoteCheck(),false);runtime.inWorld=()=>true;
runtime.houseActive=()=>true;assert.equal(runtime.elevenNoteCheck(),false);runtime.houseActive=()=>false;
// A failed save: shown now, unseen on disk (S as before), and not again in this session.
saveOk=false;assert.equal(runtime.elevenNoteCheck(),true);assert.equal(els.mEleven.hidden,false);assert.equal(runtime.S.elevenNote,undefined);
assert.equal(els.elevenStars.hidden,false);assert.match(els.elevenJump.textContent,/gratis/);
els.elevenExplore.onclick();assert.equal(els.mEleven.hidden,true);assert.equal(runtime.elevenNoteCheck(),false,'once per session');
// A new session with a working save: shown once and kept as seen.
saveOk=true;const r2={...runtime,S:{journey:{finished:true,freeJumpUsed:true},elevenNote:{keep:1}}};intervals=[];initialize(r2);
assert.equal(r2.elevenNoteCheck(),true);assert.deepEqual(r2.S.elevenNote,{keep:1,version:1,seen:true});assert.equal(els.elevenJump.textContent,'Ya puedes saltar a otro paisaje.');
els.elevenExplore.onclick();const r3={...runtime,S:{journey:{},elevenNote:r2.S.elevenNote}};initialize(r3);assert.equal(r3.elevenNoteCheck(),false,'seen in the save');
// Lugares: read it again, without touching the save.
const before=saves;els.mLugares.hidden=false;els.lugaresEleven.onclick();assert.equal(els.mLugares.hidden,true);assert.equal(els.mEleven.hidden,false);assert.equal(saves,before);
console.log('PASS eleven note: once after the finale of the eleven, never over a round, finale or sheet, failed save kept unseen, future format kept, Lugares reopens it');
