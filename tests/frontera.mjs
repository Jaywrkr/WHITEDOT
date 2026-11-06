import assert from 'node:assert/strict';
// Niveles en orden: la frontera (Jay, 6 Nov 2026, docs/MUNDO.md#niveles-en-orden-frontera). The next place without ★
// calls you at its distance and its round starts by itself; you cannot walk past it (plus 200 m) until its ★; jumps land
// inside; a try without ★ offers «Otra vez» / «Salir», and after three (one in Modo niños) the easier round, which gives ★.
import {normalizePlaces,placeRadius,PLACE_IDS,ASSIST_GOAL} from '../src/places.js';
import {pendingPlace,frontierOf,clampStep,clampJump,insideSpot,migratePosition,normalizeFrontier,assistOffered,callLine,FRONTIER_MARGIN,FRONTIER_INSIDE,FRONTIER_SOFT,CALL_SECONDS,ASSIST_AFTER} from '../src/frontier-model.js';
import {initialize as frontierInit} from '../src/frontier.js';
import {nextPortal,placedSpots} from '../src/places-ring.js';
import {calmApplies} from '../src/tranquilo-model.js';
import {EN} from '../src/i18n-en.js';
const free={finished:true,free:true,done:{}},open={open:true,free:true,freeGiven:true,done:{}};
const won=(...ids)=>{const p=normalizePlaces(null,free);for(const id of ids)p.stars[id][0]=true;return p;};
// The frontier's place: the first without ★, in order; none in the Journey, with a future or locked format, or with all eleven.
assert.equal(pendingPlace(won(),free),'llanura');assert.equal(pendingPlace(won(),open),'llanura');assert.equal(pendingPlace(won(),{done:{}}),null,'the Journey has no frontier');
assert.deepEqual(frontierOf(won(),free),{id:'llanura',R:5000,F:5000+FRONTIER_MARGIN});assert.equal(FRONTIER_MARGIN,2000,'200 m past it');
assert.equal(pendingPlace(won('llanura','bosque','tormenta'),free),'lago','a place passed without ★ holds the frontier');
assert.equal(pendingPlace(won(...PLACE_IDS),free),null,'the eleven complete: no frontier');assert.equal(frontierOf(won(...PLACE_IDS),free),null);
assert.equal(pendingPlace({...won(),readOnly:true},free),null);assert.equal(pendingPlace({...won(),version:9},free),null);
// Walking out: held back more near the edge, never past it; along the circle and inward, free.
{const F=7000;let p={x:0,y:4000},pushed=false;for(let i=0;i<400;i++){const q=clampStep(p,{x:p.x,y:p.y+19},F);assert(Math.hypot(q.x,q.y)<=F+1e-6);if(q.pushed)pushed=true;p=q;}
 assert(pushed&&Math.hypot(p.x,p.y)>F-5,'at the edge, pushed');
 const free1=clampStep({x:0,y:4000},{x:0,y:4019},F);assert.deepEqual(free1,{x:0,y:4019,pushed:false},'far from the edge nothing changes');
 const soft=clampStep({x:0,y:F-FRONTIER_SOFT/2},{x:0,y:F-FRONTIER_SOFT/2+20},F);assert(soft.pushed&&soft.y<F-FRONTIER_SOFT/2+20&&soft.y>F-FRONTIER_SOFT/2,'softly: some of the step');
 const slide=clampStep({x:0,y:F},{x:19,y:F+1},F);assert(slide.x>15&&Math.abs(Math.hypot(slide.x,slide.y)-F)<1,'slides along the circle');
 assert.deepEqual(clampStep({x:0,y:F},{x:0,y:F-19},F),{x:0,y:F-19,pushed:false},'inward is free');
 assert.equal(clampStep({x:0,y:0},{x:0,y:9e9},Infinity).y,9e9,'no frontier, no limit');}
// A jump past the place's distance lands just inside it, on its bearing; inside, untouched.
{const f=frontierOf(won('llanura'),free);const q=clampJump({x:300000,y:0},f);assert(q.moved);assert.deepEqual({x:q.x,y:q.y},{x:10000-FRONTIER_INSIDE,y:0});
 assert.deepEqual(clampJump({x:0,y:-9000},f),{x:0,y:-9000,moved:false});assert.deepEqual(insideSpot({x:0,y:0},5000),{x:0,y:-4800},'at the origin, north');}
// Old saves: past the frontier's place, just inside it; inside, nothing; all done, nothing; the Journey, nothing.
assert.deepEqual(migratePosition(won('llanura','bosque'),free,{x:0,y:50000}),{x:0,y:9800},'passed the Lago without ★ at 5 km: back to 0,98 km');
assert.equal(migratePosition(won('llanura'),free,{x:0,y:9000}),null);assert.equal(migratePosition(won(...PLACE_IDS),free,{x:0,y:400000}),null);assert.equal(migratePosition(won(),{done:{}},{x:0,y:400000}),null);
// The save: tries per place; unknown fields and a later version kept.
assert.deepEqual(normalizeFrontier(null),{version:1,fails:{}});assert.deepEqual(normalizeFrontier({fails:{lago:2,x:3,bosque:-1,cueva:500},extra:1}),{version:1,fails:{lago:2,cueva:99},extra:1});
{const later={version:2,whatever:[1]};assert.equal(normalizeFrontier(later),later);}
assert(!assistOffered(2)&&assistOffered(ASSIST_AFTER)&&assistOffered(1,true)&&!assistOffered(0,true));
// The easier round is a calm one (no clock, wider window), with a lower goal.
assert(calmApplies({on:true,run:{assist:true}}));assert(ASSIST_GOAL<1);
// The call, in Spanish and English.
assert.equal(callLine('llanura'),'La Llanura te llama.');assert.equal(callLine('dunas'),'Las Dunas te llaman.');for(const id of PLACE_IDS)assert(EN[callLine(id)],id);
// «Siguiente» and the arrow: only the frontier's place, never a later portal past it.
{const n=won();n.found={bosque:{x:0,y:20000}};assert.equal(nextPortal(placedSpots(n),n,free),null);n.found.llanura={x:0,y:5100};assert.equal(nextPortal(placedSpots(n),n,free).id,'llanura');}
// The runtime: walking out to 0,5 km calls once, the round starts after the call; leaving it without ★ counts a try and
// opens the sheet; the third try offers the easier round; its ★ moves the frontier on.
function el(){return {hidden:true,textContent:'',onclick:null,classList:{toggle(){}}};}
function world({kids=false,places=won(),at={x:0,y:-4700}}={}){const els={},toasts=[],starts=[];let run=null,saves=0;
 const r={S:{mode:'world',wx:at.x,wy:at.y,journey:free,lugares:places},$:id=>els[id]||(els[id]=el()),placesData:()=>places,ringActive:()=>true,save:()=>{saves++;return true;},toast:t=>toasts.push(t),
  placeRun:()=>run,tranquilo:()=>kids,startPlace:(id,o)=>{if(run)return false;starts.push({id,...o});run={id,from:o.from};return true;}};
 frontierInit(r);return {r,els,toasts,starts,setRun:v=>{run=v;},run:()=>run,saves:()=>saves};}
{const w=world(),{r}=w;r.frontierStep(1/60);
 for(let i=0;i<120&&!w.toasts.length;i++){r.S.wy-=3;r.frontierStep(1/60);}
 assert.deepEqual(w.toasts,['La Llanura te llama.']);assert.equal(r.frontierState().call.id,'llanura');assert.equal(w.starts.length,0,'the call first');
 for(let i=0;i<Math.ceil(CALL_SECONDS*60)+2;i++){r.S.wy-=3;r.frontierStep(1/60);}
 assert.equal(w.starts.length,1,'then its round, by itself');assert.equal(w.starts[0].id,'llanura');assert.equal(Math.round(Math.hypot(w.starts[0].from.x,w.starts[0].from.y)),5000-FRONTIER_INSIDE,'from just inside');
 for(let i=0;i<60;i++)r.frontierStep(1/60);assert.equal(w.toasts.length,1,'once');
 // Leaving the round without ★: a try, the sheet with «Otra vez» and «Salir».
 for(let k=1;k<=ASSIST_AFTER;k++){r.S.wx=0;r.S.wy=-4800;w.setRun(null);r.frontierStep(1/60);assert.equal(r.frontierState().fails.llanura,k);assert.equal(w.els.mFrontier.hidden,false,'the sheet');
  assert.equal(w.els.frontierEasy.hidden,k<ASSIST_AFTER,'the easier round after three tries');
  if(k<ASSIST_AFTER){w.els.frontierAgain.onclick();assert.equal(w.starts.length,k+1,'Otra vez');r.frontierStep(1/60);}}
 w.els.frontierEasy.onclick();assert.equal(w.run().assist,true,'the easier round');r.frontierStep(1/60);
 // Its ★: the try count goes, the frontier moves to the Lago.
 r.S.lugares.stars.llanura[0]=true;w.setRun(null);r.frontierStep(1/60);assert.deepEqual(r.frontierState().fails,{});assert.equal(r.frontierState().id,'lago');assert.equal(r.frontierState().F,10000+FRONTIER_MARGIN);}
// Running out fast never goes past the edge, and the place calls.
{const w=world({at:{x:0,y:4790}}),{r}=w;r.frontierStep(1/60);w.setRun(null);
 for(let i=0;i<300;i++){r.S.wy+=19*4;r.frontierStep(1/60);assert(Math.hypot(r.S.wx,r.S.wy)<=5000+FRONTIER_MARGIN+1);if(r.frontierState().call)break;}
 assert.equal(w.toasts.length,1);}
// A round that cannot start (a failed save): pushing at the edge calls again.
{const w=world({at:{x:0,y:4990}}),{r}=w;r.startPlace=()=>false;r.frontierStep(1/60);for(let i=0;i<60*12&&w.toasts.length<2;i++){r.S.wy+=19;r.frontierStep(1/60);assert(Math.hypot(r.S.wx,r.S.wy)<=5000+FRONTIER_MARGIN+1);}
 assert.equal(w.toasts.length,2,'called again while pushing');}
// Reload or an old save past the frontier: moved just inside on the first moment, everything else kept.
{const places=won('llanura','bosque'),w=world({places,at:{x:30000,y:40000}});w.r.frontierStep(1/60);assert.deepEqual({x:w.r.S.wx,y:w.r.S.wy},{x:5880,y:7840});assert(places.stars.bosque[0],'the Bosque keeps its ★');}
// A jump far out (a door, music travel): clamped.
{const w=world({places:won('llanura')});w.r.frontierStep(1/60);assert.deepEqual(w.r.frontierClampPoint({x:0,y:-300000,layer:'superficie'}),{x:0,y:-9800});assert.equal(w.r.frontierClampPoint({x:0,y:-3000}),null);}
// Modo niños: the easier round from the first try.
{const w=world({kids:true}),{r}=w;r.frontierStep(1/60);w.setRun({id:'llanura'});r.frontierStep(1/60);w.setRun(null);r.frontierStep(1/60);assert.equal(w.els.frontierEasy.hidden,false);}
// All eleven: no frontier, walk anywhere.
{const w=world({places:won(...PLACE_IDS),at:{x:0,y:390000}});w.r.frontierStep(1/60);w.r.S.wy+=19;w.r.frontierStep(1/60);assert.equal(w.r.S.wy,390019);assert.equal(w.r.frontierState().id,null);assert.equal(w.toasts.length,0);}
// The Journey: no frontier either.
{const w=world({at:{x:0,y:90000}});w.r.S.journey={done:{}};w.r.frontierStep(1/60);assert.equal(w.r.S.wy,90000);}
assert.equal(placeRadius('lago'),10000);
console.log('PASS niveles en orden: the frontier at the first place without ★ (+200 m), soft at its edge and sliding along it, jumps and old saves just inside, the call once and its round by itself, tries counted with «Otra vez»/«Salir» and the easier round after three (one in Modo niños), its ★ moving the frontier on; no frontier in the Journey or with the eleven');
