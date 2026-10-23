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
// The arrow: the nearest open place not yet entered or without its ★; none during the Journey or when all are done.
const journey={finished:true,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}},places=normalizePlaces(null,journey);
assert.equal(nextPortal(spots,places,{done:{}},c),null,'nothing during the Journey');
const near=nextPortal(spots,places,journey,{x:spots[2].x+10,y:spots[2].y});assert.equal(near.id,'bosque');
for(const id of ['llanura','lago','bosque','tormenta','vacio'])places.seen[id]=true;assert.equal(nextPortal(spots,places,journey,c).id,'jardin','the five entered and with their ★: the Jardín, opened by them (F9), is next');places.seen.jardin=true;places.stars.jardin[0]=true;assert.equal(nextPortal(spots,places,journey,c),null,'the Dunas ask eight stars');
// Back from a round: beside the portal, toward the Refugio, out of its reach so it does not open again at once.
const b=besidePortal(spots[0],c),d=Math.hypot(b.x-spots[0].x,b.y-spots[0].y);assert(d>PORTAL_REACH*2);assert(Math.hypot(b.x-c.x,b.y-c.y)<RING_RADIUS);
// Saves: the ring's centre and the portals entered are kept; junk is dropped.
const n=normalizePlaces({center:{x:12.4,y:'x'},seen:{lago:true,bosque:1,nada:true}},journey);assert.equal(n.center,null);assert.deepEqual(n.seen,{lago:true});
assert.deepEqual(normalizePlaces({center:{x:12.4,y:-3}},journey).center,{x:12,y:-3});
console.log('PASS places ring: eleven fixed portals 30–60 s from the Refugio, moved off the sea, an arrow to the next place to enter, back beside the portal, centre and entered portals kept');
