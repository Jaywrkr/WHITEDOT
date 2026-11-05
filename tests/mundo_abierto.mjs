import assert from 'node:assert/strict';
// «Directo mundo abierto» (Jay, 5 Nov 2026, alpha.269): a new player starts in the open World, with no Journey and no
// ring; the eleven places (Llanura included) are found by distance; the radar starts at its weakest level. Every save
// keeps its progress: the places an old save had on the ring move to their distance, on their old ring angle.
import {PLACES,PLACE_IDS,PLACE_KM,PLACES_VERSION,normalizePlaces,legacySpot,placeRadius,placeFound,placeOpen,gameObjective,starCount,allComplete} from '../src/places.js';
import {normalizeJourney,openLoad,freeOpen,noJourney} from '../src/journey-mode.js';
import {crossings,placedSpots,placeHint,nextPortal,FOUND_AHEAD} from '../src/places-ring.js';
import {scanLevel,scanTrophies} from '../src/scanner-model.js';
import {readFileSync} from 'node:fs';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const clone=v=>JSON.parse(JSON.stringify(v));
// The distances: Llanura first at 0,5 km, the other ten as in alpha.264.
assert.deepEqual(PLACE_KM,[.5,1,2,3,5,8,12,17,23,30,40]);assert.equal(PLACES_VERSION,4);

// ---------- which loads give the open World ----------
assert.equal(openLoad({search:''}),true,'a player');
assert.equal(openLoad({search:'',automated:true}),false,'automation keeps its old start');assert.equal(openLoad({search:'?abierto=1',automated:true}),true,'unless it asks');
for(const q of ['?festival=1','?capitulo=lago','?viaje=1'])assert.equal(openLoad({search:q}),false,q);assert.equal(openLoad({search:'',festival:true}),false);

// ---------- the Journey, on an open load ----------
const open={open:true};
// · fresh: free at once, in the full view; marked open (no Journey) and freeGiven (the radar starts low).
{const j=normalizeJourney(undefined,{},false,open);assert(freeOpen(j)&&noJourney(j));assert.equal(j.mode,'libre');assert.equal(j.freeGiven,true);assert.equal(j.finished,undefined,'never «finished»: there was no Journey');
 assert.deepEqual(normalizeJourney(clone(j),{},false,open),j,'idempotent');}
// · mid-Journey: everything kept (chapter, done, notes, colours), set free in the full view.
{const raw={version:1,mode:'viaje',chapter:3,done:{llanura:true,lago:true},notes:{llanura:[57,60,62]},colors:{llanura:true},progress:{bosque:{bars:12}},moments:{faro:{reached:true}}};
 const j=normalizeJourney(clone(raw),{},false,open);for(const k of ['chapter','done','notes','colors','progress','moments'])assert.deepEqual(j[k],raw[k],k);assert(freeOpen(j)&&noJourney(j)&&j.freeGiven);assert.equal(j.mode,'libre');}
// · after the Journey: its view and «finished» stay; not freeGiven (its radar does not go down).
{const raw={version:1,mode:'viaje',free:true,finished:true,chapter:6,done:{llanura:true},freeJumpUsed:true};const j=normalizeJourney(clone(raw),{},false,open);assert.equal(j.mode,'viaje');assert(j.finished&&j.freeJumpUsed&&noJourney(j));assert.equal(j.freeGiven,undefined);}
// · a save that reached the World before the Journey existed: free already, not freeGiven.
{const j=normalizeJourney(undefined,{lastWorldDay:'2026-01-01'},false,open);assert(freeOpen(j));assert.equal(j.freeGiven,undefined);}
// · a future format is never touched; a load that keeps the Journey changes nothing.
{const f={version:2,mode:'viaje',x:1};assert.equal(normalizeJourney(f,{},false,open),f);const j=normalizeJourney({mode:'viaje',chapter:1},{},false,{open:false});assert(!freeOpen(j)&&!noJourney(j));}

// ---------- the radar starts at its weakest level ----------
{const fresh={journey:normalizeJourney(undefined,{},false,open),lugares:normalizePlaces(null)};assert.equal(scanLevel(fresh).id,'1','a new player: level 1');
 fresh.lugares.stars.llanura[0]=true;assert.equal(scanLevel(fresh).id,'2','the first trophy: level 2');
 for(const id of ['lago','bosque','tormenta','vacio'])fresh.lugares.stars[id][0]=true;assert.equal(scanLevel(fresh).id,'3','five trophies: level 3');
 // Nothing goes down: a World earned before keeps level 2 with no trophy.
 assert.equal(scanLevel({journey:normalizeJourney({free:true,finished:true},{},false,open),lugares:normalizePlaces(null)}).id,'2');}

// ---------- a new player in the open World: the Llanura appears ahead at 0,5 km ----------
{const j=normalizeJourney(undefined,{},false,open),d=normalizePlaces(null,j);assert.deepEqual(d.found,{});assert.equal(d.ring,undefined);assert.deepEqual(placedSpots(d),[],'no portal, no ring');
 for(const id of PLACE_IDS)assert(placeOpen(d,id,j),id);assert.deepEqual(placeHint([],d,j),{id:'llanura',name:'Llanura',km:.5});assert.equal(gameObjective({journey:j},d).line,'Siguiente: Llanura. Está más lejos, a 0,5 km.');
 // From the start (900, 900), walking out to the north-east: the Llanura at 0,5 km, nothing before.
 let p={x:900,y:900},hit=null;for(let k=0;k<400&&!hit;k++){const q={x:p.x+10,y:p.y+10},ids=crossings(p,q,d);if(ids.length)hit={ids,at:q};p=q;}
 assert.deepEqual(hit.ids,['llanura']);assert(Math.abs(Math.hypot(hit.at.x,hit.at.y)-placeRadius('llanura'))<20,'crossed at 0,5 km');}

// ---------- the places, version 3 → 4 ----------
const angle=id=>-Math.PI/2+PLACE_IDS.indexOf(id)/PLACES.length*2*Math.PI;
// The spot: its distance, on its old angle, deterministic; at sea a step along the ray.
for(const id of PLACE_IDS){const s=legacySpot(id);assert(Math.abs(Math.hypot(s.x,s.y)-placeRadius(id))<1.5,id);assert(Math.abs(Math.atan2(s.y,s.x)-Math.atan2(Math.sin(angle(id)),Math.cos(angle(id))))<1e-3,id);assert.deepEqual(legacySpot(id),s);}
{const wet=(x,y)=>Math.hypot(x,y)<5100,s=legacySpot('llanura',wet);assert.equal(Math.round(Math.hypot(s.x,s.y)),5300);}
const all3=()=>Object.fromEntries(PLACE_IDS.map(id=>[id,[true,true,true]]));
const keep=(before,after)=>{for(const k of ['stars','best','rounds','journeyShare','seen','kept','notes','noteSteps','noteTicks'])for(const [id,v] of Object.entries(before[k]||{}))assert.deepEqual(after[k][id],v,k+'.'+id);for(const k of ['won','master','credited'])assert.equal(after[k],before[k]===true,k);};
// · fresh: nothing to move.
{const n=normalizePlaces(null,{});assert.deepEqual(n.found,{});assert.deepEqual(n.moved,{});}
// · mid-Journey (version 2, no portals): its kept chapters are trophies, at their distance.
{const j={mode:'viaje',chapter:2,done:{llanura:true}},raw={version:2,stars:{llanura:[true,true,false]},journeyShare:{llanura:{hits:9,total:10,silent:false}}};const n=normalizePlaces(clone(raw),j);
 assert.deepEqual(n.stars.llanura,[true,true,false]);assert.deepEqual(n.found,{llanura:legacySpot('llanura')});assert.deepEqual(n.moved,{llanura:true});assert(!placeFound(n,'lago'),'the Lago is still found by walking');}
// · after the Journey, version 3, some places won: the ring ones move to their distance; a place found by distance
//   stays where it was found; one seen without ★ is found by walking. Stars, records, notes and flags stay.
{const raw={version:3,center:{x:3000,y:-2000},ringFixed:true,stars:{llanura:[true,true,false],lago:[true,false,false],jardin:[true,true,true],dunas:[false,false,false]},
  best:{jardin:{onTime:.81,ms:90000,rounds:4}},rounds:{day:'2026-11-04',counts:{jardin:2}},seen:{jardin:true,dunas:true},kept:{dunas:true},notes:{jardin:[60,62,64]},noteSteps:{jardin:[0,4,8]},noteTicks:{jardin:[0,4,8]},
  ring:{llanura:true,lago:true},found:{jardin:{x:-50000,y:61000}},journeyShare:{},won:false,master:false,credited:false};
 const n=normalizePlaces(clone(raw),{finished:true,free:true,done:{llanura:true,lago:true}});keep(raw,n);assert.equal(n.version,4);
 assert.deepEqual(n.found,{llanura:legacySpot('llanura'),lago:legacySpot('lago'),jardin:{x:-50000,y:61000}});assert.deepEqual(n.moved,{llanura:true,lago:true});
 for(const k of ['ring','center','ringFixed'])assert.equal(n[k],undefined,'no ring: '+k);assert(!placeFound(n,'dunas'));
 assert.deepEqual(placedSpots(n).map(s=>s.id),['llanura','lago','jardin']);assert.deepEqual(placeHint(placedSpots(n),n,{finished:true}),{id:'bosque',name:'Bosque',km:2});
 const again=normalizePlaces(clone(n),{finished:true});assert.deepEqual(again,n,'idempotent: moved once, saved');}
// · all eleven (version 3, all on the ring): all eleven at their distance, won, master and credited kept; the song's
//   finale and its master version stay reachable (allComplete, 33 ★).
{const raw={version:3,stars:all3(),ring:Object.fromEntries(PLACE_IDS.map(id=>[id,true])),won:true,master:true,credited:true,best:{cueva:{onTime:.9,ms:1,rounds:9}}};
 const n=normalizePlaces(clone(raw),{finished:true});keep(raw,n);assert.equal(Object.keys(n.found).length,11);for(const id of PLACE_IDS)assert.deepEqual(n.found[id],legacySpot(id));
 assert(allComplete(n));assert.equal(starCount(n),33);assert.equal(nextPortal(placedSpots(n),n,{finished:true}),null);
 assert.equal(scanTrophies({lugares:n}),11,'radar trophies kept');}
// · version 2 with the eleven: the same.
{const n=normalizePlaces({version:2,stars:all3(),won:true},{finished:true});assert.equal(Object.keys(n.found).length,11);assert(n.won);}
// · a future version is never touched (and the game reads it read-only, places.js).
{const f={version:PLACES_VERSION+1,ring:{llanura:true},found:{}};assert.equal(normalizePlaces(f),f);}

// ---------- no ring left in the game ----------
const ringJs=read('src/places-ring.js'),lugares=read('src/refugio-lugares.js'),map=read('src/universe-map.js'),ritmo=read('src/ritmo.js'),recorrer=read('src/recorrer.js');
assert.doesNotMatch(ringJs,/ringHome|RING_RADIUS|ringFixed/);assert.doesNotMatch(map,/Volver al anillo|Centro del anillo/);assert.doesNotMatch(ritmo+recorrer,/anillo/);
assert.match(lugares,/ring\.hidden=true/,'#lugaresRing stays in the page, hidden');assert.equal(read('index.html').split('id="lugaresRing"').length-1,1);
assert.match(read('src/main.js'),/runtime\.openWorldStart\?\.\(\)/,'the open start is called at load');
console.log('PASS mundo abierto: a new player in the open World (no Journey, no ring), the radar at level 1 and up by trophies, the Llanura ahead at 0,5 km; the Journey and the places migrated from every save shape (fresh, mid-Journey, after it, some won, all eleven, future untouched) with every star, record, note and flag kept and the old ring places at their distance on their old angle');
