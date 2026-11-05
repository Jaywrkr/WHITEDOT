import assert from 'node:assert/strict';
// «Los lugares te encuentran» (Jay, 5 Nov 2026, alpha.264): each place at a fixed distance from the origin, its portal
// fixed ahead of you the first time you cross that distance, saved; each trophy upgrades the radar; the Journey is one
// place. Since alpha.269 («Directo mundo abierto») there is no ring: tests/mundo_abierto.mjs covers the version 4
// migration of the places an old save had there.
import {PLACES,PLACE_IDS,PLACE_KM,PLACES_VERSION,normalizePlaces,placeFound,placeOpen,placeRadius,gameObjective,complete,legacySpot} from '../src/places.js';
import {crossings,foundSpot,placedSpots,placeHint,portalSpots,nextPortal,FOUND_AHEAD,FOUND_JUMP,initialize} from '../src/places-ring.js';
import {scanLevel,scanReach,scanTrophies,TROPHY_REACH,UNITS_PER_M} from '../src/scanner-model.js';
import {shortNext,CHAPTERS} from '../src/journey-chapters.js';
import {EDGE_RANK,EDGE_ICON,edgeOffer} from '../src/scanner-arrows-model.js';
// Distances: 0,5 · 1 · 2 · 3 · 5 · 8 · 12 · 17 · 23 · 30 · 40 km, in the order of the places.
assert.equal(PLACES_VERSION,4);assert.deepEqual(PLACE_KM,[.5,1,2,3,5,8,12,17,23,30,40]);assert.equal(placeRadius('llanura'),5000);assert.equal(placeRadius('cueva'),400000);
const free={finished:true,free:true,done:{}};
// A fresh save in the free World: nothing found, no ring; every place open, the next is the Llanura, far.
const fresh=normalizePlaces(null,free);assert.equal(fresh.ring,undefined);assert.deepEqual(fresh.found,{});
for(const id of PLACE_IDS)assert(placeOpen(fresh,id,free),id);assert.deepEqual(placeHint([],fresh,free),{id:'llanura',name:'Llanura',km:.5});
assert.equal(gameObjective({journey:free},fresh).line,'Siguiente: Llanura. Está más lejos, a 0,5 km.');
// Four directions: crossing 0,5 km fixes the Llanura ahead, on the heading, at its distance (plus a short step).
for(const [hx,hy] of [[1,0],[-1,0],[0,1],[0,-1]]){const from={x:hx*4990,y:hy*4990},to={x:hx*5003,y:hy*5003};assert.deepEqual(crossings(from,to,fresh),['llanura']);
 const s=foundSpot(to,{x:to.x-from.x,y:to.y-from.y});assert.equal(Math.round(Math.hypot(s.x-to.x,s.y-to.y)),FOUND_AHEAD);assert((s.x-to.x)*hx+(s.y-to.y)*hy>0,'ahead');
 const r=Math.hypot(s.x,s.y);assert(r>=5000&&r<=5000+FOUND_AHEAD+10,'at its distance');}
// A diagonal crossing, and a crossing inward.
assert.deepEqual(crossings({x:7060,y:7060},{x:7075,y:7075},fresh),['llanura','lago'],'a diagonal crossing of 1 km, and the Llanura already behind');
assert.deepEqual(crossings({x:20010,y:0},{x:19990,y:0},{...fresh,found:{llanura:{x:1,y:1},lago:{x:2,y:2}},stars:{...fresh.stars,llanura:[true],lago:[true]}}),['bosque'],'crossing inward counts');
// Not a step on foot: standing still, or a jump.
assert.deepEqual(crossings({x:4999,y:0},{x:4999,y:0},fresh),[]);assert.deepEqual(crossings({x:0,y:0},{x:FOUND_JUMP+5000,y:0},fresh),[],'a jump is not a crossing');
// Past the next place's distance without its portal (an old save, a jump): it is fixed at the next step, and only that one.
assert.deepEqual(crossings({x:60000,y:0},{x:60010,y:0},fresh),['llanura']);
// Off the sea: farther on the heading when it can.
{const s=foundSpot({x:0,y:0},{x:1,y:0},(x)=>x<FOUND_AHEAD+500);assert(s.x>=FOUND_AHEAD+500&&s.y===0);}
// Saved and kept: found portals are points, junk dropped; a version-3 ring place moves to its distance (version 4).
{const n=normalizePlaces({version:3,found:{lago:{x:12.6,y:-3},bosque:{x:'a'},nada:{x:1,y:1}},ring:{llanura:true,lago:'x'}},free);assert.deepEqual(n.found,{lago:{x:13,y:-3},llanura:legacySpot('llanura')});assert.equal(n.ring,undefined);assert.deepEqual(n.moved,{llanura:true});
 const again=normalizePlaces(JSON.parse(JSON.stringify(n)),free);assert.deepEqual(again.found,n.found);assert.deepEqual(again.moved,n.moved);assert(placeFound(again,'lago')&&placeFound(again,'llanura')&&!placeFound(again,'bosque'));}
const journeyFive={finished:true,free:true,chapter:6,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}};
// · mid-Journey: its kept chapters are trophies, at their distance; the shortened Journey re-locks nothing.
{const j={mode:'viaje',chapter:3,done:{llanura:true,lago:true}},n=normalizePlaces({version:2,stars:{llanura:[true,true,false],lago:[true,false,false]},journeyShare:{bosque:{hits:3,total:4}}},j);
 assert.deepEqual(n.stars.llanura,[true,true,false]);assert.deepEqual(Object.keys(n.found),['llanura','lago']);assert.deepEqual(n.journeyShare.bosque,{hits:3,total:4,silent:false});
 assert.equal(shortNext(3),CHAPTERS.length-1,'the Bosque in progress, then the Refugio');assert.equal(shortNext(0),1,'the Camino leads to the Llanura');assert.equal(shortNext(1,true),2,'the festival keeps its five');}
// · a future format is never touched.
{const f={version:PLACES_VERSION+1,ring:'?',found:[1]};assert.equal(normalizePlaces(f,free),f);}
// The next portal: the first place without its ★ whose portal exists; complete places are skipped.
{const n=normalizePlaces({version:3,ring:{llanura:true},stars:{llanura:[true]},found:{bosque:{x:1,y:2},lago:{x:9,y:9}}},free),spots=placedSpots(n);assert.equal(nextPortal(spots,n,free).id,'lago');
 n.stars.lago[0]=true;assert.equal(nextPortal(spots,n,free).id,'bosque');}
// The arrow: kind «lugar» in the edge layer, its icon, under the player's own, above the rare.
assert.equal(EDGE_ICON.lugar,'lugar');assert(EDGE_RANK.lugar<EDGE_RANK.bengala&&EDGE_RANK.lugar>EDGE_RANK.secreto);assert.equal(edgeOffer({key:'lugar:lago',kind:'lugar',x:1,y:1,label:'200 m'},{x:0,y:0}).shape,'lugar');
// The radar by trophies (a place complete): level 2 after the Journey, level 3 from five, reach grows with each.
// (A World given at the start, alpha.269, begins at level 1: tests/mundo_abierto.mjs.)
{const S=t=>({journey:{finished:true},lugares:{stars:Object.fromEntries(PLACE_IDS.slice(0,t).map(id=>[id,[true]]))}});let last=0;
 for(let t=0;t<=11;t++){const L=scanLevel(S(t));assert.equal(scanTrophies(S(t)),t);assert.equal(L.id,t>=5?'3':'2',`${t} trophies`);assert.equal(L.reach,TROPHY_REACH[t]);assert(L.reach>=last,'never less');if(t>1)assert(L.reach>last,'each trophy reaches farther');last=L.reach;assert.equal(scanReach(L),L.reach*UNITS_PER_M);}
 assert.equal(scanLevel(S(11)).reach,300,'the eleven: 300 m as before');assert.equal(scanLevel({journey:{finished:true},lugares:{won:true}}).reach,300,'a won save keeps 300 m');
 assert.equal(scanLevel({journey:{finished:true,done:{llanura:true}}}).reach,120,'the Journey`s Llanura: the first trophy');
 assert.equal(scanLevel({journey:{chapter:1,done:{llanura:true}}}).id,'1','still level 1 during the Journey');assert.equal(scanLevel(S(3),{charged:true}).reach,1200,'the Carga is still the whole ladder');}
// The runtime: walking out from the origin in four directions finds the Llanura ahead; the portal is saved; a failed save
// keeps nothing; a jump finds nothing.
for(const [hx,hy] of [[1,0],[-1,0],[0,1],[0,-1]]){let ok=true,toasts=[];const d=normalizePlaces(null,free),r={S:{mode:'world',wx:hx*4900,wy:hy*4900,journey:free},placesData:()=>d,inWorld:()=>true,save:()=>ok,toast:t=>toasts.push(t),edgeOffer:()=>null,$:()=>null};initialize(r);
 const c={save(){},restore(){},beginPath(){},arc(){},stroke(){},fill(){},fillRect(){},fillText(){},moveTo(){},lineTo(){},closePath(){},translate(){},rotate(){},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})};
 r.drawPlacesRing(c,390,844,0);assert.equal(r.ringState().spots.length,0);
 for(let k=1;k<=12;k++){r.S.wx=hx*(4900+k*10);r.S.wy=hy*(4900+k*10);r.drawPlacesRing(c,390,844,k);}
 const f=d.found.llanura;assert(f,'found');assert((f.x-r.S.wx)*hx+(f.y-r.S.wy)*hy>FOUND_AHEAD-50,'ahead of the cube');assert.equal(r.ringState().next,'llanura');assert.deepEqual(toasts,['Una señal: Llanura.']);
 assert.equal(r.ringRoute().id,'llanura');assert(!complete(d,'llanura'));
 // A failed save keeps nothing.
 ok=false;r.S.wx=hx*9990;r.S.wy=hy*9990;r.drawPlacesRing(c,390,844,20);r.S.wx=hx*10010;r.S.wy=hy*10010;r.drawPlacesRing(c,390,844,21);assert.equal(d.found.lago,undefined);
 ok=true;r.S.wx=hx*9990;r.S.wy=hy*9990;r.drawPlacesRing(c,390,844,22);r.S.wx=hx*10010;r.S.wy=hy*10010;r.drawPlacesRing(c,390,844,23);assert(d.found.lago,'then the Lago, at 1 km');
 r.S.wx=hx*30000;r.S.wy=hy*30000;r.drawPlacesRing(c,390,844,24);assert.equal(d.found.tormenta,undefined,'a jump past 2 and 3 km finds nothing');}
console.log('PASS los lugares te encuentran: eleven distances, the portal fixed ahead on crossing in four directions (and inward, and past it once), never on a jump, saved and kept; old ring places moved to their distance (version 4); future format untouched; the arrow «lugar»; the radar grows with each trophy (level 3 from five, 300 m with the eleven); the Journey is one place');
