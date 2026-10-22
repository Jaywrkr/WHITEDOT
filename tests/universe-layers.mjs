import assert from 'node:assert/strict';
import {BORDER,LAYER_DEPTH,LAYER_CELL,REGION_SOUND_MAX,STYLES,rand,cellRegion,partAt,initialize} from '../src/universe-layers.js';
// Seen from above: three layers, the far one slowest; same cells for every region so borders line up.
assert(LAYER_DEPTH.far<LAYER_DEPTH.mid&&LAYER_DEPTH.mid<=LAYER_DEPTH.near);assert.deepEqual(Object.keys(LAYER_CELL),['far','mid','near']);
assert.equal(STYLES.vacio,null,'the Void draws nothing');for(const id of ['llanura','lago','bosque','tormenta'])assert(['far','mid','near'].every(k=>STYLES[id][k])&&STYLES[id].sound.gain<=REGION_SOUND_MAX,id+' has its three layers and a quiet air');assert(STYLES.lago.wake,'the Marea keeps the cube wake');
// The hash spreads neighbouring keys apart: no clumps.
const xs=Array.from({length:24},(_,i)=>rand('mid:3,4:x'+i)),buckets=new Set(xs.map(v=>Math.floor(v*8)));assert(buckets.size>=6,'points spread across the cell');
// Borders: far from an edge a cell is its own region; near it, both regions mix.
const map=(x)=>x<900?'llanura':'lago';assert.equal(cellRegion(450,450,900,map,'k'),'llanura');
const near=Array.from({length:200},(_,i)=>cellRegion(880,450,900,map,'k'+i));assert(near.includes('llanura')&&near.includes('lago'),'mixed at the edge');
assert.equal(Array.from({length:50},(_,i)=>cellRegion(900-BORDER-1,450,900,map,'k'+i)).every(r=>r==='llanura'),true);
// The furrow: points near the cube's path are pushed away and it closes in about 1.5 s.
const [ox,oy]=partAt(110,100,[{x:100,y:100,at:0}],100);assert(ox>0&&Math.abs(oy)<1e-9);assert.deepEqual(partAt(110,100,[{x:100,y:100,at:0}],2000),[0,0]);assert.deepEqual(partAt(300,100,[{x:100,y:100,at:0}],100),[0,0]);
// Runtime: Polvo draws its layers, the Void none; its air stays under the cap and stops when leaving the surface.
let clock=0;const realNow=performance.now.bind(performance);performance.now=()=>clock;globalThis.document={querySelectorAll:()=>[]};
const rects=[];const c=new Proxy({},{get:(o,k)=>k in o?o[k]:(...a)=>{if(k==='fillRect')rects.push(a);},set:(o,k,v)=>{o[k]=v;return true;}});
const gains=[];const node=()=>({connect(){},start(){},stop(){},frequency:{setValueAtTime(){}},Q:{setValueAtTime(){}},gain:{value:0,setValueAtTime(){},setTargetAtTime(v){gains.push(v);this.value=v;}}});
const ac={currentTime:0,sampleRate:8000,createBuffer:(n,len)=>({getChannelData:()=>new Float32Array(len)}),createBufferSource:node,createBiquadFilter:node,createGain:node};
const ids=['llanura','bosque','lago','ruinas','jardin','dunas','cristales','faros','tormenta','cueva','vacio'];let here='llanura';
const r={S:{wx:450,wy:450,sound:true},BIOMES:ids.map(id=>({id})),biomeOfPos:()=>ids.indexOf(here),WCH:900,cx:c,W:390,H:844,camX:450,camY:450,ac,bus:{},MU:{speed:200},inWorld:()=>true};
initialize(r);r.drawUniverseLayers(0,.5);const polvo=r.universeLayers();assert(polvo.cells>50&&polvo.regions.llanura===polvo.cells);assert(rects.length>500,'many small details');assert.equal(polvo.air,'llanura');
assert(gains.length&&Math.max(...gains)<=REGION_SOUND_MAX,'region sound far under the music');
// Marea, Cúmulo and Tormenta solar draw too, each with its own air.
for(const id of ['lago','bosque','tormenta']){here=id;const calls=[];const c2=new Proxy({},{get:(o,k)=>k in o?o[k]:(...a)=>calls.push(k),set:(o,k,v)=>{o[k]=v;return true;}});r.cx=c2;clock+=100;r.drawUniverseLayers(clock,.8);assert(r.universeLayers().regions[id]>50,id);assert(calls.length>100,id+' draws details');assert.equal(r.universeLayers().air,id);}
r.cx=c;here='vacio';rects.length=0;r.drawUniverseLayers(16,.5);assert.equal(r.universeLayers().cells,0);assert.equal(rects.length,0);assert.equal(r.universeLayers().air,'','the Void is silent');
r.inWorld=()=>false;r.drawUniverseLayers(32,.5);assert.equal(r.universeLayers().air,'');
performance.now=realNow;
console.log('PASS universe layers: three layers seen from above, Polvo, Marea, Cúmulo and Tormenta solar draw them and the Void nothing, points spread without clumps, regions mix at borders, the furrow closes, region sound stays under the cap');
