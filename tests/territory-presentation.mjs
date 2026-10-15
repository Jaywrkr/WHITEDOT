import assert from 'node:assert/strict';
import {auditRuntime} from '../scripts/encounter-model.mjs';
import {decorativeField,territorialOrchestra,territoryInstrument,blendProductionSpace} from '../src/territory-presentation.js';
import {musicDirection,productionSpace} from '../src/music-direction.js';
import {labScore,labArrangement,labNoteEvents} from '../src/lab-score.js';
import {createRadio} from '../src/radio.js';
const r=auditRuntime('presentation-test'),other=auditRuntime('another-presentation'),before=r.wchunk(-3,4),snapshot=JSON.stringify(before);let clear=0,visible=0,maxJump=0,changed=0;
for(let x=-30;x<30;x++)for(let y=-30;y<30;y++){
 const wx=x*240,wy=y*240,a=decorativeField(wx,wy,r.seedOf),b=decorativeField(wx+1,wy,r.seedOf);
 assert(a>=0&&a<=.7);assert.equal(a,decorativeField(wx,wy,r.seedOf));if(a===0)clear++;if(a>.35)visible++;if(a!==decorativeField(wx,wy,other.seedOf))changed++;maxJump=Math.max(maxJump,Math.abs(a-b));
}
assert(clear>600&&visible>200&&changed>500,{clear,visible,changed});assert(maxJump<.005,maxJump);assert.equal(JSON.stringify(r.wchunk(-3,4)),snapshot,'presentation leaves physical objects, saved sites and placement untouched');
for(const x of [-2400,0,2400])assert(Math.abs(decorativeField(x-.001,400,r.seedOf)-decorativeField(x+.001,400,r.seedOf))<.00001,'no decoration seam at negative/positive cell borders');
const a=productionSpace('minimal'),b=productionSpace('ambient');assert.deepEqual(blendProductionSpace(a,b,0),a);assert.deepEqual(blendProductionSpace(a,b,1),b);for(const key of Object.keys(a))assert.equal(blendProductionSpace(a,b,.5)[key],(a[key]+b[key])/2);
const orchestra=territorialOrchestra({key:'-4,2',genre:'deep'},['rhodes','feltpiano'],['pluckbody','rhodes'],r.seedOf),neighbor=territorialOrchestra({key:'-3,3',genre:'deep'},['rhodes','feltpiano'],['pluckbody','rhodes'],r.seedOf);assert.deepEqual(orchestra,neighbor,'neighbors share the phrase-level accent');
let guests=0;for(let bar=0;bar<48;bar++)if(territoryInstrument(orchestra,bar,Math.floor(bar/4))==='pluckbody')guests++;assert(guests>=12&&guests<=16,'secondary material visits without taking over');
const reachable=new Set();for(let x=-15;x<15;x++)for(let y=-15;y<15;y++){
 const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600);if(d.sea)continue;const radio=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true}),first=radio.advance(d,0),score=labScore(d,r.seedOf,r.rng);for(let bar=0;bar<48;bar+=4){const frame=labArrangement({...first,harmonyBar:bar},score);assert(score.leads.includes(frame.hookI));reachable.add(frame.hookI);}assert.equal(first.direction.id,musicDirection(d.genre).id);
}
assert(reachable.size>=15,reachable.size);
const harmonic={labScore:{genre:'deep',variant:1,scene:2},section:1,melodyRest:false,bass:Array(16).fill(-1),hook:Array(16).fill(-1)};assert(labNoteEvents(harmonic,0,8).some(e=>e.role==='acorde'));assert(!labNoteEvents(harmonic,0,9).some(e=>e.role==='acorde'));assert(!labNoteEvents({...harmonic,melodyRest:true},0,8).length,'harmony respects deliberate rests');
console.log('PASS broad clear/textured patches, smooth world-space seams, unchanged physical worlds, compatible neighboring guest phrases, bounded blends and reachable musical materials');
