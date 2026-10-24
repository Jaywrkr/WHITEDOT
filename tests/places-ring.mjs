import assert from 'node:assert/strict';
import {RING_RADIUS,PORTAL_REACH,portalSpots,nextPortal,besidePortal} from '../src/places-ring.js';
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
console.log('PASS places ring: eleven fixed portals 30–60 s from the Refugio, moved off the sea, an arrow and a column of light to the next place on the path, back beside the portal, centre and entered portals kept');
