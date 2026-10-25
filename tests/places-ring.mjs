import assert from 'node:assert/strict';
import {RING_RADIUS,PORTAL_REACH,NEXT_HEAR,beaconGain,edgeColumn,portalSpots,nextPortal,besidePortal} from '../src/places-ring.js';
import {normalizePlaces,PLACE_IDS} from '../src/places.js';
// Eleven portals in a ring around the Refugio, about half a minute's walk (190 px/s) from its door.
const c={x:1000,y:-500},spots=portalSpots(c);assert.deepEqual(spots.map(s=>s.id),PLACE_IDS);
for(const s of spots){const d=Math.hypot(s.x-c.x,s.y-c.y);assert(Math.abs(d-RING_RADIUS)<2);assert(d/190>=30&&d/190<=60,'30–60 s on foot');}
const gaps=spots.map((s,i)=>{const n=spots[(i+1)%spots.length];return Math.hypot(n.x-s.x,n.y-s.y);});assert(Math.min(...gaps)>3000,'portals far enough apart to be different places');
assert.deepEqual(portalSpots(c),spots,'fixed: no randomness, the same ring every time');
// A portal at sea moves along its ray to land; with no land near, it stays.
const dry=portalSpots(c,(x,y)=>Math.hypot(x-c.x,y-c.y)<RING_RADIUS+200);for(const s of dry)assert.equal(Math.round(Math.hypot(s.x-c.x,s.y-c.y)),RING_RADIUS+300);
assert.deepEqual(portalSpots(c,()=>true),spots);
// The arrow and the column of light: the next place on the path (plan H3), wherever you stand; none during the Journey
// or when all eleven are complete.
const journey={finished:true,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}},places=normalizePlaces(null,journey);
assert.equal(nextPortal(spots,places,{done:{}},c),null,'nothing during the Journey');
assert.equal(nextPortal(spots,places,journey,{x:spots[2].x+10,y:spots[2].y}).id,'jardin','after the Journey: the Jardín, even beside the Bosque');
places.stars.jardin[0]=true;assert.equal(nextPortal(spots,places,journey,c).id,'dunas','the Jardín complete: the Dunas');
for(const id of ['dunas','cristales','faros','ruinas','cueva'])places.stars[id][0]=true;assert.equal(nextPortal(spots,places,journey,c),null,'all eleven complete');
// Before the Journey's places are all complete, the nearest open one still without its ★.
const early=normalizePlaces({stars:{llanura:[true]}},{finished:true,done:{}});assert.equal(nextPortal(spots,early,{finished:true,done:{}},c).id,'lago');
// Back from a round: beside the portal, toward the Refugio, out of its reach so it does not open again at once.
const b=besidePortal(spots[0],c),d=Math.hypot(b.x-spots[0].x,b.y-spots[0].y);assert(d>PORTAL_REACH*2);assert(Math.hypot(b.x-c.x,b.y-c.y)<RING_RADIUS);
// Saves: the ring's centre and the portals entered are kept; junk is dropped.
const n=normalizePlaces({center:{x:12.4,y:'x'},seen:{lago:true,bosque:1,nada:true}},journey);assert.equal(n.center,null);assert.deepEqual(n.seen,{lago:true});
assert.deepEqual(normalizePlaces({center:{x:12.4,y:-3}},journey).center,{x:12,y:-3});
// Plan H6: the next portal is heard from the Refugio (a ring's radius away), louder as you come near, not beyond its reach.
assert(beaconGain(RING_RADIUS)>0);assert(beaconGain(1000)>beaconGain(RING_RADIUS));assert.equal(beaconGain(NEXT_HEAR),0);assert(beaconGain(0)<.06,'a beacon stays under the music');
// Plan I2: off screen, the next portal's column stands at the screen edge on its side.
assert.equal(edgeColumn(-900,400,390,844).x,12);assert.equal(edgeColumn(5000,400,390,844).x,378);assert.equal(edgeColumn(200,-3000,390,844).x,200);
console.log('PASS places ring: eleven fixed portals 30–60 s from the Refugio, moved off the sea, an arrow and a column of light to the next place on the path, back beside the portal, centre and entered portals kept');

const {routeEdge}=await import('../src/places-ring.js');for(let i=0;i<8;i++){const a=i*Math.PI/4,e=routeEdge(Math.cos(a)*6000,Math.sin(a)*6000,390,844);assert(Math.abs(e.angle-a)<1e-6||Math.abs(e.angle-a+Math.PI*2)<1e-6);assert(e.x>=23&&e.x<=367&&e.y>=143&&e.y<=697);}assert(routeEdge(0,-6000,390,844).y<422&&routeEdge(0,6000,390,844).y>422);

const {initialize}=await import('../src/places-ring.js');let writable=false;const saved=normalizePlaces(null,journey),r={S:{mode:'world',wx:12,wy:34,studio:{x:100,y:200},journey},placesData:()=>saved,inWorld:()=>true,save:()=>writable};initialize(r);const beforeAnchor=structuredClone(saved);assert.deepEqual(r.ringState().center,{x:100,y:200});assert.deepEqual(saved,beforeAnchor,'failed migration preserves old save');writable=true;r.ringState();assert(saved.ringFixed);r.S.studio.x=30000;assert.deepEqual(r.ringState().center,{x:100,y:200});assert(normalizePlaces(saved,journey).ringFixed,'anchor survives reload');

r.S.mode='camino';r.enterWorld=()=>{r.S.mode='world';};const pos=[r.S.wx,r.S.wy];assert(r.ringGuide('jardin'));assert.deepEqual([r.S.wx,r.S.wy],pos,'Camino guidance enters the World without a portal warp in this fixture');assert(r.ringTravel('lago'),'a chapter already completed is an explicit free travel destination');assert(!r.ringTravel('dunas'),'locked places remain locked');

const {routeCompass}=await import('../src/places-ring.js');for(const [W,H] of [[320,568],[390,844],[844,390],[1280,800]])for(let i=0;i<8;i++){const a=i*Math.PI/4,e=routeCompass(Math.cos(a)*6000,Math.sin(a)*6000,W,H);assert(Math.abs(Math.hypot(e.x-W/2,e.y-H/2)-48)<1e-6);assert(Math.cos(e.angle-a)>.999);}
r.S.destination='studio';assert.equal(r.ringRoute(),null,'a chosen destination takes priority over the suggested ring');r.cancelDestination=()=>{r.S.destination=null;};assert(r.ringGuide('jardin'));assert.equal(r.ringRoute().id,'jardin','following the ring replaces the old destination');

assert.deepEqual(routeCompass(300,400,390,844,{x:18,y:-12}),{...routeCompass(300,400,390,844),x:routeCompass(300,400,390,844).x+18,y:routeCompass(300,400,390,844).y-12});
