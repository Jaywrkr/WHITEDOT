import assert from 'node:assert/strict';
import {hash,rand,normalizeColors,initialize} from '../src/world-sheet.js';
// Hashes for detail placed on the map, never the game's random sequence.
assert.equal(hash('a'),hash('a'));assert.notEqual(hash('a'),hash('b'));assert(rand('x')>=0&&rand('x')<1);
// The light is the only thing drawn: the World is seen from above, so there are no horizon shapes.
const calls=[];const c=new Proxy({},{get:(o,k)=>k in o?o[k]:k==='createRadialGradient'?()=>({addColorStop(){}}):(...a)=>calls.push(k),set:(o,k,v)=>{o[k]=v;return true;}});
assert.deepEqual(normalizeColors({lago:true,x:false,[`${'y'.repeat(50)}`]:true}),{lago:true});assert.deepEqual(normalizeColors(null),{});
// Runtime: in the Journey a new biome is pale until the theme is completed there; explored biomes keep their colour.
const style={};globalThis.document={querySelectorAll:()=>[]};
const r={S:{journey:{version:1,mode:'viaje',colors:{llanura:true}},zones:{llanura:'2026-10-01',lago:'2026-10-02'},layer:'superficie'},BIOMES:[{id:'llanura'},{id:'lago'}],curZone:1,camX:0,camY:0,W:390,H:844,cx:c,$:()=>({style}),inWorld:()=>true,journeyQuiet:()=>true,save:()=>true,enterFx:0};
initialize(r);assert.deepEqual(r.journeyColors(),{llanura:true},'explored before: colour kept');
r.drawWorldSheet(0,.5);assert.deepEqual(calls.filter(k=>k!=='save'&&k!=='restore'),['fillRect'],'only the light, no shapes or horizon');assert.equal(r.worldSheetState().pale,true);assert.match(r.worldSheetState().filter,/saturate/);assert.equal(style.filter,undefined,'the screen itself is never filtered: the gold stays gold (plan H1)');
// The grey goes on the ground only, as a saturation blend drawn before the games, the cube and the gold.
for(let k=0;k<40;k++)r.drawWorldSheet(k,.5);assert(r.worldSheetState().grey>.9);calls.length=0;r.drawWorldSheetGrey();assert(calls.filter(k=>k==='fillRect').length===2,'grey and a little darker');
assert.equal(r.recoverJourneyColor(),true);assert.equal(r.journeyColors().lago,true);r.drawWorldSheet(16,.5);assert.equal(r.worldSheetState().filter,'','colour back');assert.equal(r.recoverJourneyColor(),false,'only once');
r.curZone=0;r.journeyQuiet=()=>false;r.drawWorldSheet(32,.2);assert.equal(r.worldSheetState().pale,false,'the free World is always in colour');
r.save=()=>false;r.journeyQuiet=()=>true;r.BIOMES.push({id:'bosque'});r.curZone=2;assert.equal(r.recoverJourneyColor(),false);assert.equal(r.journeyColors().bosque,undefined,'a failed save keeps it pale');
console.log('PASS world sheet: seen from above with only the light (no horizon shapes), colours kept for explored biomes, pale until the theme is completed, back once, free World always in colour, failed save keeps it pale');
