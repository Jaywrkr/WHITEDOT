// Una capa de flechas (coherencia T2): one white arrow language at the screen's edge. The model picks three at most
// (the most important, then the nearest), merges two offers for one thing, keeps arrows apart and points at a region
// only when nothing else is there. The runtime draws them in white, still with reduced motion, without halo in light
// quality; every system that had its own edge mark offers it to the layer instead.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {edgePick,edgeOffer,edgePlace,offScreen,EDGE_CAP,EDGE_RANK,EDGE_MERGE,EDGE_SCENE_RANK} from '../src/scanner-arrows-model.js';
import {initialize,EDGE_FADE} from '../src/scanner-arrows.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const view={W:390,H:844,cx:0,cy:0},p={x:0,y:0};
// ---------- the model ----------
assert.equal(EDGE_CAP,3,'three arrows at most');
const offers=[
 {key:'boya:1',kind:'boya',x:4000,y:0,label:'4 km'},{key:'caja:1',kind:'caja',x:0,y:2500,shape:'caja'},
 {key:'juego:1',kind:'juego',x:-2000,y:0,shape:'portal'},{key:'sonda:1',kind:'sonda',x:0,y:-2900,ask:true},
 {key:'hito:1',kind:'hito',x:3000,y:3000},{key:'region:1',kind:'region',x:-9000,y:-9000}];
const pick=edgePick(offers,view,p);
assert.equal(pick.length,3,'capped at three');
assert.deepEqual(pick.map(e=>e.key),['sonda:1','caja:1','juego:1'],'the most important first, then the nearest');
assert.ok(pick.every(e=>e.at&&Number.isFinite(e.at.x)&&Number.isFinite(e.at.a)),'each has its place at the edge');
assert.equal(pick[0].shape,'secreto','what is only heard is «?»');
// Escáner NMS: the kind decides the icon (one table, scan-icons.js), whatever shape a system offered.
assert.equal(pick[2].shape,'juego','a game offered as the old «portal» shows the game icon');
assert.equal(edgeOffer({kind:'hito',x:1,y:1,shape:'estrella'},p).shape,'hito');assert.equal(edgeOffer({kind:'satelite',x:1,y:1,shape:'portal'},p).shape,'satelite');
assert.equal(edgeOffer({kind:'carga',x:1,y:1,shape:'cometa'},p).shape,'cometa','the Carga points with the thing\'s own icon');assert.equal(pick[0].label,null,'«?» says nothing more');
assert.ok(!edgePick(offers,view,p,{cap:9}).some(e=>e.kind==='region'),'a region only when nothing else is there');
assert.deepEqual(edgePick([{kind:'region',x:-9000,y:0}],view,p).map(e=>e.kind),['region'],'alone, the region is pointed at');
// Two offers for one thing (the box from Descubrir and from the registry) are one arrow.
assert.equal(edgePick([{key:'a',kind:'caja',x:0,y:2500},{key:'scan:b',kind:'caja',x:EDGE_MERGE-50,y:2500}],view,p).length,1,'merged');
// Two arrows never sit on each other at the edge.
assert.equal(edgePick([{key:'a',kind:'caja',x:0,y:20000},{key:'b',kind:'juego',x:600,y:21000}],view,p).length,1,'kept apart');
// During a scene only the player's own stay.
const scene=edgePick([...offers,{key:'bengala',kind:'bengala',x:9000,y:9000}],view,p,{scene:true});
assert.deepEqual(scene.map(e=>e.kind),['bengala'],'a scene keeps only the flare and a challenge');
assert.ok(EDGE_RANK.reto>=EDGE_SCENE_RANK&&EDGE_RANK.bengala>=EDGE_SCENE_RANK&&EDGE_RANK.caja<EDGE_SCENE_RANK);
// Bad offers are dropped; an unknown kind is just a thing.
assert.equal(edgeOffer({x:NaN,y:1}),null);assert.equal(edgeOffer({kind:'nada',x:1,y:1},p).kind,'cosa');
assert.ok(offScreen(500,0,view)&&!offScreen(100,100,view),'off screen');
const at=edgePlace(0,9000,view);assert.ok(at.y<=844-104&&at.y>=104&&Math.abs(at.a-Math.PI/2)<1e-9,'below: at the bottom, off the bars');
// ---------- the runtime ----------
// A canvas that remembers every colour set and every call.
function canvas(){const log={calls:0,colors:new Set(),text:[],images:0};const c={save(){},restore(){},translate(){},rotate(){},beginPath(){},closePath(){},moveTo(){},lineTo(){},
 stroke(){log.calls++;},fill(){log.calls++;},strokeRect(){log.calls++;},fillRect(){log.calls++;},drawImage(){log.calls++;log.images++;},fillText(t){log.calls++;log.text.push(t);},arc(){}};
 return new Proxy(c,{set(o,k,v){if(k==='strokeStyle'||k==='fillStyle')log.colors.add(String(v).toLowerCase());o[k]=v;return true;},get(o,k){return k==='log'?log:k in o?o[k]:undefined;}});}
function game({reduced=false,light=false,level3=false}={}){const r={S:{wx:0,wy:0,layer:'superficie',reducedMotion:reduced,journey:{finished:true},lugares:{won:level3}},W:390,H:844,camX:0,camY:0,
 inWorld:()=>true,lightQuality:()=>light,cx:canvas()};globalThis.document??={querySelector:()=>null,querySelectorAll:()=>[]};initialize(r);return r;}
globalThis.document??={querySelector:()=>null,querySelectorAll:()=>[]};
{const r=game();for(const o of offers)r.edgeOffer(o);r.drawEdgeArrows();const s=r.edgeState();
 assert.equal(s.offered,offers.length);assert.equal(s.shown.length,3);assert.equal(s.drawn.arrows,3);
 assert.ok([...r.cx.log.colors].every(c=>c==='#fff'||c==='#ffffff'),'white only, never gold: '+[...r.cx.log.colors]);
 assert.ok(r.cx.log.calls<=3*3,'a few calls per arrow');
 r.drawEdgeArrows();assert.equal(r.edgeState().shown.length,0,'offers are for one frame');}
// The buoy's km is written; nothing else asks for words.
{const r=game();r.edgeOffer({key:'boya:4',kind:'boya',x:4000,y:0,shape:'boya',label:'4 km'});r.drawEdgeArrows();assert.deepEqual(r.cx.log.text,['4 km']);}
// Reduced motion: an arrow is there at once; otherwise it comes in over EDGE_FADE.
{const r=game({reduced:true});r.edgeOffer(offers[1]);r.drawEdgeArrows();assert.equal(r.edgeState().drawn.arrows,1);}
assert.ok(EDGE_FADE>0&&EDGE_FADE<=.5);
// Light quality draws no more than the full one.
{const full=game(),light=game({light:true});for(const g of [full,light]){for(const o of offers)g.edgeOffer(o);g.drawEdgeArrows();}assert.ok(light.cx.log.calls<=full.cx.log.calls);}
// Out of the World (or under it) nothing is offered.
{const r=game();r.S.layer='bajo';assert.equal(r.edgeOffer(offers[0]),null);}
// ---------- every old mark is now an offer ----------
for(const f of ['descubrir','recorrer','secretos-cielo','viaje-a','viaje-c','viaje-d','lejos-b','clues','wild','landmarks','distant-colors','vida']){
 assert.match(read(`src/${f}.js`),/edgeOffer\?\.\(/,f+' offers its mark to the one layer');}
for(const f of ['recorrer','secretos-cielo','viaje-a','viaje-c','viaje-d','lejos-b'])
 assert.ok(!/function edge\(c,kind,o(,p)?\)\{const q=edgeSpot/.test(read(`src/${f}.js`)),f+' draws no mark of its own');
assert.ok(!/#9fe8ff/i.test(read('src/clues.js')),'no cyan dots');
assert.ok(!/hintBox[^\n]*GOLD/.test(read('src/vida.js')),'no gold arrow from the flock');
assert.ok(!/fillStyle=gold;c\.beginPath\(\);c\.moveTo\(ex/.test(read('src/wild.js')),'no gold arrow for the wild spark');
assert.ok(!/signal:'\+rgb/.test(read('src/distant-colors.js')),'no coloured light at the edge');
// Tanda B leaves one mark; the probe has its mark with the sound on too.
assert.ok(!/seenKinds/.test(read('src/lejos-b.js')),'batch B: one mark');
assert.ok(!/!r\.S\.sound&&!scene\(\)&&!still&&!busy\(\)\)out\.edge\.sonda/.test(read('src/secretos-cielo.js')),'the probe is marked with sound too');
const art=read('src/scanner-art.js'),layer=read('src/scanner-arrows.js')+read('src/scanner-arrows-model.js');
assert.ok(!/create(Radial|Linear)Gradient|shadowBlur|GOLD|gold/i.test(art.slice(art.indexOf('the arrows at the edge'),art.indexOf('// The same icon without'))+layer.replace(/Gold never[^\n]*/,'')),'no gradient, shadow or gold');
const sw=read('sw.js');for(const m of ['"./src/scanner-arrows.js"','"./src/scanner-arrows-model.js"'])assert.equal(sw.split(m).length-1,1,'once in the shell: '+m);
console.log('PASS one layer of arrows: three at most (the most important, then the nearest), one per thing, apart at the edge, a region only alone, a scene keeps the flare; white only, «?» for what is heard, the buoy\'s km; reduced motion and light quality; every old edge mark offers to the layer');
