import assert from 'node:assert/strict';
import {NEW_REGIONS,NEW_REGION_SHARE,newRegionOf,newRegionById,initialize} from '../src/universe-regions.js';
import {STYLES,REGION_SOUND_MAX,initialize as layers} from '../src/universe-layers.js';
// Four new regions, only in the Abyss, fixed by the region key, about 40 % of it; the rest stays Void.
assert.deepEqual(NEW_REGIONS.map(r=>r.id),['aurora','cometas','constelaciones','nebulosa']);
assert.equal(newRegionOf('3,4',false),null,'never on a continent');
let n=0;const kinds={};for(let x=-60;x<60;x++)for(let y=-20;y<20;y++){const r=newRegionOf(x+','+y,true);if(r){n++;kinds[r.id]=(kinds[r.id]||0)+1;}}
assert(Math.abs(n/4800-NEW_REGION_SHARE)<.03,'share '+n/4800);assert.equal(Object.keys(kinds).length,4);for(const k of Object.values(kinds))assert(k>n/4*.8&&k<n/4*1.2,'kinds balanced');
assert.equal(newRegionOf('7,-2',true),newRegionOf('7,-2',true),'fixed');assert.equal(newRegionById('nebulosa').name,'Nebulosa oscura');
for(const r of NEW_REGIONS)assert(['far','mid','near'].every(k=>STYLES[r.id][k])&&STYLES[r.id].sound.gain<=REGION_SOUND_MAX,r.id);
// Runtime: in the free World a sea region may show one; in the Journey never.
const seaKey=[...Array(200).keys()].map(i=>i+',0').find(k=>newRegionOf(k,true)?.id==='constelaciones');
const r={S:{wx:0,wy:0},regionOfPos:()=>({key:seaKey,sea:true}),journeyQuiet:()=>false};initialize(r);assert.equal(r.newRegionHere().id,'constelaciones');
r.journeyQuiet=()=>true;assert.equal(r.newRegionHere(),null,'not in the Journey');
// Completing the theme in a constellation joins it for good; the layers draw it and the Nebulosa darkens around the cube.
let phrases=0,saves=0;globalThis.document={querySelectorAll:()=>[]};const calls=[];const c=new Proxy({},{get:(o,k)=>k in o?o[k]:k==='createRadialGradient'?()=>{calls.push(k);return {addColorStop(){}};}:(...a)=>calls.push(k),set:(o,k,v)=>{o[k]=v;return true;}});
const ids=['llanura','bosque','lago','ruinas','jardin','dunas','cristales','faros','tormenta','cueva','vacio'];
const rt={S:{wx:450,wy:450,sound:false},BIOMES:ids.map(id=>({id})),biomeOfPos:()=>10,WCH:900,cx:c,W:390,H:844,camX:450,camY:450,MU:{speed:0},inWorld:()=>true,journeyQuiet:()=>false,save:()=>{saves++;return true;},journeyPulseState:()=>({phrases}),regionOfPos:()=>({key:seaKey,sea:true})};
initialize(rt);layers(rt);rt.drawUniverseLayers(0,.5);assert.equal(rt.universeLayers().here,'constelaciones');assert(rt.universeLayers().regions.constelaciones>50);
phrases=1;rt.drawUniverseLayers(16,.5);assert.equal(rt.S.universe.constellations[seaKey],true,'the theme completed here joins the figure');assert.equal(rt.universeLayers().constellations,1);
const neb=[...Array(400).keys()].map(i=>i+',1').find(k=>newRegionOf(k,true)?.id==='nebulosa');rt.regionOfPos=()=>({key:neb,sea:true});calls.length=0;rt.drawUniverseLayers(32,.5);assert.equal(rt.universeLayers().here,'nebulosa');assert(calls.includes('createRadialGradient'),'darkness around the cube');
rt.journeyQuiet=()=>true;rt.drawUniverseLayers(48,.5);assert.equal(rt.universeLayers().here,'vacio','the Journey keeps the Void');
console.log('PASS universe regions: Aurora, Cometas, Constelaciones and Nebulosa oscura fill about 40 % of the Abyss by region key, never on continents or in the Journey; constellations join for good when the theme is completed there; the Nebulosa darkens all but the cube');
