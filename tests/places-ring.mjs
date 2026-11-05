import assert from 'node:assert/strict';
import {TEST_RADIUS,PORTAL_REACH,NEXT_HEAR,beaconGain,edgeColumn,portalSpots,nextPortal,besidePortal,originSpot} from '../src/places-ring.js';
import {normalizePlaces,PLACE_IDS} from '../src/places.js';
// The test layout («?anillo=1», «?lugar=»; since alpha.269 the game has no ring): eleven spots around an anchor.
const c={x:1000,y:-500},spots=portalSpots(c);assert.deepEqual(spots.map(s=>s.id),PLACE_IDS);
for(const s of spots){const d=Math.hypot(s.x-c.x,s.y-c.y);assert(Math.abs(d-TEST_RADIUS)<2);}
const gaps=spots.map((s,i)=>{const n=spots[(i+1)%spots.length];return Math.hypot(n.x-s.x,n.y-s.y);});assert(Math.min(...gaps)>3000,'portals far enough apart to be different places');
assert.deepEqual(portalSpots(c),spots,'fixed: no randomness, the same ring every time');
// A portal at sea moves along its ray to land; with no land near, it stays.
const dry=portalSpots(c,(x,y)=>Math.hypot(x-c.x,y-c.y)<TEST_RADIUS+200);for(const s of dry)assert.equal(Math.round(Math.hypot(s.x-c.x,s.y-c.y)),TEST_RADIUS+300);
assert.deepEqual(portalSpots(c,()=>true),spots);
// The arrow and the column of light: the next place on the path (plan H3), wherever you stand; none during the Journey
// or when all eleven are complete.
const journey={finished:true,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}},places=normalizePlaces(null,journey);
assert.equal(nextPortal(spots,places,{done:{}},c),null,'nothing during the Journey');
assert.equal(nextPortal(spots,places,journey,{x:spots[2].x+10,y:spots[2].y}).id,'jardin','after the Journey: the Jardín, even beside the Bosque');
places.stars.jardin[0]=true;assert.equal(nextPortal(spots,places,journey,c).id,'dunas','the Jardín complete: the Dunas');
for(const id of ['dunas','cristales','faros','ruinas','cueva'])places.stars[id][0]=true;
// Panel 10 (P4, D1): all eleven complete, the column stands over the place without ★★ with the best share on time.
places.best.lago={onTime:.62,ms:1,rounds:1};places.best.cueva={onTime:.746,ms:1,rounds:1};assert.equal(nextPortal(spots,places,journey,c).id,'cueva','after the victory: nearest its ★★');
places.stars.cueva[1]=true;assert.equal(nextPortal(spots,places,journey,c).id,'lago','then the next best');
for(const id of PLACE_IDS)places.stars[id]=[true,true,true];assert.equal(nextPortal(spots,places,journey,c),null,'none with the 33 ★');
// Before the Journey's places are all complete, the nearest open one still without its ★.
const early=normalizePlaces({stars:{llanura:[true]}},{finished:true,done:{}});assert.equal(nextPortal(spots,early,{finished:true,done:{}},c).id,'lago');
// Back from a round: beside the portal, toward the origin, out of its reach so it does not open again at once.
{const p={x:30000,y:-40000},b=besidePortal(p),d=Math.hypot(b.x-p.x,b.y-p.y);assert(d>PORTAL_REACH*2);assert(Math.hypot(b.x,b.y)<Math.hypot(p.x,p.y));const o=besidePortal({x:0,y:0});assert(Math.hypot(o.x,o.y)>PORTAL_REACH*2,'a portal at the origin still steps away');}
// Saves: the portals entered are kept; junk is dropped. The old ring's centre is gone (alpha.269).
const n=normalizePlaces({center:{x:12.4,y:'x'},seen:{lago:true,bosque:1,nada:true}},journey);assert.equal(n.center,undefined);assert.deepEqual(n.seen,{lago:true});
assert.equal(normalizePlaces({center:{x:12.4,y:-3},ringFixed:true},journey).ringFixed,undefined);
// The Duelo final's spot: the origin, off the sea a step at a time.
assert.deepEqual(originSpot(),{x:0,y:0});{const o=originSpot((x,y)=>Math.hypot(x,y)<500);assert(Math.hypot(o.x,o.y)>=500&&Math.hypot(o.x,o.y)<1000,o);}
// Plan H6: the next portal is heard from far, louder as you come near, not beyond its reach.
assert(beaconGain(6000)>0);assert(beaconGain(1000)>beaconGain(6000));assert.equal(beaconGain(NEXT_HEAR),0);assert(beaconGain(0)<.06,'a beacon stays under the music');
// Plan I2: off screen, the next portal's column stands at the screen edge on its side.
assert.equal(edgeColumn(-900,400,390,844).x,12);assert.equal(edgeColumn(5000,400,390,844).x,378);assert.equal(edgeColumn(200,-3000,390,844).x,200);
// Panel 10 · P1: off screen the light sits at the height of the heading, a band away from the corners, not down the whole edge.
{const right=edgeColumn(5000,422,390,844),up=edgeColumn(5000,-3000,390,844),down=edgeColumn(195,9000,390,844);
 assert.ok(Math.abs(right.y-422)<1,'straight right: the light stands at mid height');assert.ok(up.y<right.y&&up.y>=70,'up and right: higher on the edge');assert.equal(down.y,844-70);assert.equal(edgeColumn(200,-3000,390,844).y,70);}
console.log('PASS places ring: the test layout of eleven spots, moved off the sea, an arrow and a column of light to the next place on the path, back beside the portal toward the origin, entered portals kept, no ring centre, the Duelo at the origin');

const {routeEdge}=await import('../src/places-ring.js');for(let i=0;i<8;i++){const a=i*Math.PI/4,e=routeEdge(Math.cos(a)*6000,Math.sin(a)*6000,390,844);assert(Math.abs(e.angle-a)<1e-6||Math.abs(e.angle-a+Math.PI*2)<1e-6);assert(e.x>=23&&e.x<=367&&e.y>=143&&e.y<=697);}assert(routeEdge(0,-6000,390,844).y<422&&routeEdge(0,6000,390,844).y>422);

const {initialize}=await import('../src/places-ring.js');let writable=true;const saved=normalizePlaces(null,journey),r={S:{mode:'world',wx:12,wy:34,studio:{x:100,y:200},journey},placesData:()=>saved,inWorld:()=>true,save:()=>writable};initialize(r);
// Alpha.269: no ring centre, nothing written for it; the test anchor exists only on a test load.
{const before=structuredClone(saved);assert.equal(r.ringState().center,undefined);assert.equal(r.ringState().anchor,null);assert.deepEqual(saved,before,'reading the state writes nothing');assert.equal(r.ringHome,undefined,'no «Volver al anillo»');assert.deepEqual(r.originSpot(),{x:0,y:0,layer:'superficie'});}

assert(!r.ringGuide('jardin'),'alpha.264: no portal yet, nothing to follow');assert.deepEqual(r.ringState().hint,{id:'jardin',name:'Jardín',km:8},'only its distance');saved.found.jardin={x:80000,y:0};
r.S.mode='camino';r.enterWorld=()=>{r.S.mode='world';};const pos=[r.S.wx,r.S.wy];assert(r.ringGuide('jardin'));assert.deepEqual([r.S.wx,r.S.wy],pos,'Camino guidance enters the World without a portal warp in this fixture');saved.found.lago={x:10000,y:0};assert(r.ringTravel('lago'),'a chapter already completed is an explicit free travel destination');assert(!r.ringTravel('dunas'),'a place not found cannot be reached by travel');

const {routeCompass}=await import('../src/places-ring.js');
// The compass by the cube is for a mark of the universe map; a place is shown by the edge-arrow layer (alpha.269).for(const [W,H] of [[320,568],[390,844],[844,390],[1280,800]])for(let i=0;i<8;i++){const a=i*Math.PI/4,e=routeCompass(Math.cos(a)*6000,Math.sin(a)*6000,W,H);assert(Math.abs(Math.hypot(e.x-W/2,e.y-H/2)-48)<1e-6);assert(Math.cos(e.angle-a)>.999);}
r.S.destination='studio';assert.equal(r.ringRoute(),null,'a chosen destination takes priority over the suggested ring');r.cancelDestination=()=>{r.S.destination=null;};assert(r.ringGuide('jardin'));assert.equal(r.ringRoute().id,'jardin','following the ring replaces the old destination');
// T0 (bug 11): while a round's card waits for its drop, the route does not move on to the next place yet.
{const due=r.placeCardDue;r.placeCardDue=()=>true;assert.equal(r.ringRoute(),null,'no new route before the card');r.placeCardDue=due;assert.notEqual(r.ringRoute(),null);}

assert.deepEqual(routeCompass(300,400,390,844,{x:18,y:-12}),{...routeCompass(300,400,390,844),x:routeCompass(300,400,390,844).x+18,y:routeCompass(300,400,390,844).y-12});
