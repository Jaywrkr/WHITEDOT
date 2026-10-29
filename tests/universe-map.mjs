// Mapa del universo (alpha.235): the model with no page. Fog, layers, zooms, distances, what can be gone to, the mark,
// the save and its migration; and the wiring (one entry each in the offline shell, the hooks in the ring and the
// living encounters, the ids of the page).
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {UMAP_VERSION,UMAP_SPAN,UMAP_BANDS,UMAP_ARRIVE,UMAP_LIVE_MAX,normalizeUniverseMap,noteLive,fogCells,bandCells,bandProgress,currentBand,levelOf,viewFor,stepLevel,zoomAt,toScreen,toWorld,spanOf,universeSpan,clampScale,hitTest,cardActions,markOf,markRoute} from '../src/universe-map-model.js';
import {formatDistance} from '../src/player-profile-model.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const W=390,H=844,RP=3600;

// The save: empty, migrated from nothing, unknown fields kept, a later version untouched, bad rows dropped.
const fresh=normalizeUniverseMap(undefined);assert.deepEqual(fresh,{version:UMAP_VERSION,mark:null,live:[],bands:{},mini:false});
const later={version:9,mark:{x:'?'},future:true};assert.equal(normalizeUniverseMap(later),later,'a later version is left as it is');
const kept=normalizeUniverseMap({version:1,extra:{a:1},mark:{x:10,y:-20,name:'Orión',kind:'sky',id:'s1',note:'x'},live:[{k:'polilla',x:1,y:2,w:true},{k:'',x:1,y:1},{k:'ola',x:'n',y:2},null],bands:{5:'2026-10-29',x:'no',20:3},mini:true});
assert.deepEqual(kept.extra,{a:1});assert.equal(kept.mark.note,'x');assert.equal(kept.mark.name,'Orión');assert.equal(kept.live.length,1);assert.deepEqual(kept.bands,{5:'2026-10-29'});assert.equal(kept.mini,true);
assert.equal(normalizeUniverseMap({mark:{x:Infinity,y:0}}).mark,null,'a mark off the map is dropped');
assert.equal(normalizeUniverseMap({mini:'yes'}).mini,false,'the mini map is off unless it was turned on');
// Living encounters seen: one per spot, the latest outcome, at most UMAP_LIVE_MAX.
const q=normalizeUniverseMap({});assert.ok(noteLive(q,{kind:'polilla',x:100,y:100,won:false}));assert.ok(noteLive(q,{kind:'polilla',x:150,y:120,won:true}));assert.equal(q.live.length,1);assert.equal(q.live[0].w,true);
assert.ok(noteLive(q,{kind:'polilla',x:5000,y:100}));assert.equal(q.live.length,2);assert.equal(noteLive(q,{kind:'ola',x:NaN,y:0}),false);
for(let i=0;i<UMAP_LIVE_MAX+30;i++)noteLive(q,{kind:'ola',x:i*1000,y:9e5});assert.equal(q.live.length,UMAP_LIVE_MAX);assert.equal(q.live.at(-1).x,(UMAP_LIVE_MAX+29)*1000,'the latest stay');
assert.equal(noteLive(normalizeUniverseMap({version:4}),{kind:'ola',x:0,y:0}),false,'a later version is not written');

// The fog: only the regions visited, from S.places; nothing else is revealed.
const places={'0,0':1,'1,0':1,'-1,2':1,'bad':1,'1.5,2':1,'__proto__':1};
assert.deepEqual(fogCells(places).map(c=>c.key).sort(),['-1,2','0,0','1,0']);assert.deepEqual(fogCells(null),[]);
// The distance rings: the discs around the origin, how much of each is discovered, the band to show.
const five=bandCells(RP,5);assert.ok(five.length>550&&five.length<660,five.length);assert.ok(five.includes('0,0')&&five.includes('-1,-1'));assert.ok(!five.includes('14,0'),'beyond 5 km');
const p0=bandProgress({},RP,5,five);assert.deepEqual([p0.done,p0.pct,p0.complete],[0,0,false]);
const p1=bandProgress({'0,0':1},RP,5,five);assert.equal(p1.pct,1,'one region already reads 1 %');
const all=Object.fromEntries(five.map(k=>[k,1]));const p2=bandProgress(all,RP,5,five);assert.ok(p2.complete&&p2.pct===100);
const list=UMAP_BANDS.map(km=>bandProgress({'0,0':1},RP,km));assert.equal(currentBand(list,0).km,5);assert.equal(currentBand(list,8).km,20,'beyond 5 km the next ring');
assert.equal(currentBand([{...p2,km:5},{km:20,complete:false}],0).km,20,'a full ring gives way to the next');
assert.deepEqual(UMAP_BANDS,[5,20,50]);

// The three zooms: the ring on its centre, the region on you, the universe on the origin with at least the 5 km ring.
const ctx={me:{x:20000,y:-3000},ring:{x:4659,y:4890},points:[{x:0,y:0},{x:4000,y:4000}]};
const vr=viewFor('anillo',ctx,W,H),vg=viewFor('region',ctx,W,H),vu=viewFor('universo',ctx,W,H);
assert.deepEqual([vr.x,vr.y],[4659,4890]);assert.deepEqual([vg.x,vg.y],[20000,-3000]);assert.deepEqual([vu.x,vu.y],[0,0]);
assert.equal(levelOf(vr,W,H),'anillo');assert.equal(levelOf(vg,W,H),'region');assert.equal(levelOf(vu,W,H),'universo');
assert.ok(spanOf(vu,W,H)>=UMAP_SPAN.universo&&spanOf(vr,W,H)<spanOf(vg,W,H),'farther out, more is seen');
assert.ok(universeSpan([{x:300000,y:0}])>=600000,'the universe fits what you discovered far away');
// With room for the buttons the ring fits between them.
const inset={x:64,y:84},vi=viewFor('anillo',ctx,W,H,inset);assert.ok(6000*vi.scale<(W/2-64),'the ring is not under the buttons');assert.equal(levelOf(vi,W,H,inset),'anillo');
for(const [w,h] of [[390,844],[1280,800],[844,390]])for(const l of ['anillo','region','universo'])assert.equal(levelOf(viewFor(l,ctx,w,h,inset),w,h,inset),l,`${l} at ${w}×${h}`);
// + and −: step to the next zoom; at the ends there is no step.
assert.equal(levelOf(stepLevel(vu,1,W,H,ctx),W,H),'region');assert.equal(levelOf(stepLevel(vg,1,W,H,ctx),W,H),'anillo');assert.equal(stepLevel(vr,1,W,H,ctx),null);
assert.equal(levelOf(stepLevel(vr,-1,W,H,ctx),W,H),'region');assert.equal(stepLevel(vu,-1,W,H,ctx),null);
// A pinch keeps the point under the fingers; the screen and the world map back and forth.
const z=zoomAt(vg,2,100,200,W,H),[wx,wy]=toWorld(vg,W,H,100,200),[sx,sy]=toScreen(z,W,H,wx,wy);assert.ok(Math.abs(sx-100)<1e-6&&Math.abs(sy-200)<1e-6);
assert.ok(clampScale(1e9,W,H)<1e9&&clampScale(1e-12,W,H)>1e-12,'zoom has limits');

// A tap: the nearest within reach; when two overlap, the more important.
const items=[{kind:'heard',x:0,y:0},{kind:'place',id:'lago',x:30,y:0},{kind:'live',x:4000,y:0}],v={x:0,y:0,scale:.1};
assert.equal(hitTest(items,v,W,H,W/2+3,H/2).kind,'place','a place over a rumour a few px away');assert.equal(hitTest(items,v,W,H,W/2+400*.1,H/2),null,'nothing out of reach');
assert.equal(hitTest(items,v,W,H,W/2+400,H/2).kind,'live');

// What can be gone to: a place you may travel to, «Volver al anillo», a favourite; the rest is marked.
assert.deepEqual(cardActions({kind:'place',x:1,y:1},{canTravel:true}),{go:'place',mark:null});
assert.deepEqual(cardActions({kind:'place',x:1,y:1},{canTravel:false}),{go:null,mark:'mark'},'a place you cannot travel to yet is marked');
assert.deepEqual(cardActions({kind:'ringHome',x:1,y:1},{canHome:true}),{go:'ring',mark:null});
assert.deepEqual(cardActions({kind:'refugio',home:true,x:1,y:1},{canHome:true}),{go:'ring',mark:null},'the Refugio at the ring centre takes you back to the ring');
assert.deepEqual(cardActions({kind:'refugio',x:1,y:1},{canHome:true}),{go:null,mark:'mark'});
assert.deepEqual(cardActions({kind:'favorite',x:1,y:1},{canFavorite:true}),{go:'favorite',mark:null});
for(const kind of ['sky','live','landmark','heard','rare','spot'])assert.deepEqual(cardActions({kind,x:5,y:5},{}),{go:null,mark:'mark'},kind);
assert.deepEqual(cardActions({kind:'me',x:0,y:0},{}),{go:null,mark:null});
const mark=markOf({kind:'sky',x:1234.4,y:-5.6,name:'Orión',id:'s'});assert.deepEqual(mark,{x:1234,y:-6,name:'Orión',kind:'sky',id:'s'});
assert.equal(markOf({kind:'spot',x:1,y:1,name:'Este punto'}).name,'Tu marca');assert.equal(markOf({x:NaN,y:0}),null);
assert.deepEqual(cardActions({kind:'sky',x:1234,y:-6},{mark}),{go:null,mark:'unmark'},'the marked point offers to remove it');
assert.deepEqual(cardActions({kind:'mark',x:1234,y:-6},{mark}),{go:null,mark:'unmark'});
// The mark as the compass's heading; reached within 30 m.
const r=markRoute(mark,{x:0,y:0});assert.equal(r.id,'mark');assert.equal(r.name,'Tu marca · Orión');assert.ok(r.distance>1200&&!r.arrived);assert.equal(formatDistance(r.distance),'123 m');
assert.ok(markRoute(mark,{x:1234-UMAP_ARRIVE+1,y:-6}).arrived);assert.equal(markRoute(null,{x:0,y:0}),null);assert.equal(markRoute({...mark,name:'Tu marca'},{x:0,y:0}).name,'Tu marca');

// Wiring: one entry each in the offline shell; loaded by map.js; the ring's compass asks for the mark; the living
// encounters leave their spot; the page keeps the old ids of the Bitácora's map and adds the new ones.
const sw=read('sw.js');for(const m of ['universe-map-model.js','universe-map-art.js','universe-map.js'])assert.equal(sw.split(`"./src/${m}"`).length-1,1,m);
assert.match(read('src/map.js'),/import \{initialize as universeMap\} from '\.\/universe-map\.js';/);
const ring=read('src/places-ring.js');assert.match(ring,/const mark=runtime\.mapMarkRoute\?\.\(\);if\(mark\)return mark;/);assert.match(ring,/runtime\.clearMapMark\?\.\(\)/);
assert.match(read('src/live-encounters.js'),/r\.mapNoteLive\?\.\(\{kind:scene\.kind,x:scene\.x,y:scene\.y,won:liveWon\(scene\)\}\)/);
const html=read('index.html');for(const id of ['miniMapRow','mapCv','mapNote','ringTravel','mapZoom','mapShare','mapClose','bMap','mUniverseMap','umapCv','umapIn','umapOut','umapMe','umapClose','umapLegend','umapCard','umapGo','umapMark','bUniverseMap','miniMap','miniMapCv','miniMapSetting'])assert.equal(html.split(`id="${id}"`).length-1,1,id);
// The mini map is off by default: its box is checked only by the save.
assert.doesNotMatch(html,/id="miniMapSetting"[^>]*checked/);
// Gold only for what is won: in the drawing, gold is used for ★ and the full distance ring.
const art=read('src/universe-map-art.js');assert.equal((art.match(/UMAP_GOLD/g)||[]).length,4,'gold: its definition, the stars of the places and the full ring (stroke and label)');
console.log('PASS universe map: save and migration, fog, distance rings, three zooms, taps, Ir and Marcar, the mark, wiring');
