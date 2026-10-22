import assert from 'node:assert/strict';
import {LAYERS,hash,rand,shapeOf,silhouette,normalizeColors,initialize} from '../src/world-sheet.js';
// Shapes are fixed by biome and tile, never by the game's random sequence.
assert.equal(hash('a'),hash('a'));assert.notEqual(hash('a'),hash('b'));assert(rand('x')>=0&&rand('x')<1);
assert.equal(shapeOf('bosque'),'trees');assert.equal(shapeOf('vacio'),null,'the Void stays empty');assert.equal(shapeOf('desconocido'),'hills');
assert(LAYERS.every((l,i)=>!i||l.depth>LAYERS[i-1].depth),'nearer layers move more');
// Every shape draws on an inert canvas.
const calls=[];const c=new Proxy({},{get:(o,k)=>k in o?o[k]:k==='createRadialGradient'?()=>({addColorStop(){}}):(...a)=>calls.push(k),set:(o,k,v)=>{o[k]=v;return true;}});
for(const s of ['hills','trees','water','columns','stems','dunes','crystals','towers','clouds','caves'])silhouette(c,s,100,300,120,80,'#8ad1ff',.1,'k:'+s,0,false);assert(calls.includes('fill'));
assert.deepEqual(normalizeColors({lago:true,x:false,[`${'y'.repeat(50)}`]:true}),{lago:true});assert.deepEqual(normalizeColors(null),{});
// Runtime: in the Journey a new biome is pale until the theme is completed there; explored biomes keep their colour.
const style={};globalThis.document={querySelectorAll:()=>[]};
const r={S:{journey:{version:1,mode:'viaje',colors:{llanura:true}},zones:{llanura:'2026-10-01',lago:'2026-10-02'},layer:'superficie'},BIOMES:[{id:'llanura'},{id:'lago'}],curZone:1,camX:0,camY:0,W:390,H:844,cx:c,$:()=>({style}),inWorld:()=>true,journeyQuiet:()=>true,save:()=>true,enterFx:0};
initialize(r);assert.deepEqual(r.journeyColors(),{llanura:true},'explored before: colour kept');
r.drawWorldSheet(0,.5);assert.equal(r.worldSheetState().pale,true);assert.match(style.filter,/saturate/);
assert.equal(r.recoverJourneyColor(),true);assert.equal(r.journeyColors().lago,true);r.drawWorldSheet(16,.5);assert.equal(style.filter,'','colour back');assert.equal(r.recoverJourneyColor(),false,'only once');
r.curZone=0;r.journeyQuiet=()=>false;r.drawWorldSheet(32,.2);assert.equal(r.worldSheetState().pale,false,'the free World is always in colour');
r.save=()=>false;r.journeyQuiet=()=>true;r.BIOMES.push({id:'bosque'});r.curZone=2;assert.equal(r.recoverJourneyColor(),false);assert.equal(r.journeyColors().bosque,undefined,'a failed save keeps it pale');
console.log('PASS world sheet: fixed shapes per biome and tile, empty Void, ten silhouettes draw, colours kept for explored biomes, pale until the theme is completed, back once, free World always in colour, failed save keeps it pale');
