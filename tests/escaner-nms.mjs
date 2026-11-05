// Escáner NMS (Jay, 5 Nov 2026, alpha.263): the marks after a scan (on a ring round the cube that stops at the screen's
// edge; a cap; none covers another) and one icon table for every layer (the scanner, the arrows at the edge, the map).
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scanMarks,markRing,edgeReach,markBox,registerScan,unregisterScan,scanNear,scanLevel,SCAN_MARKS,SCAN_SHOW,MARK_SIDE,MARK_TOP,MARK_BOTTOM} from '../src/scanner-model.js';
import {SCAN_KINDS,ICON_KINDS,iconKind,scanIconSprite,drawScanIcon} from '../src/scan-icons.js';
import {edgeOffer,edgeKnown,EDGE_ICON,EDGE_RANK} from '../src/scanner-arrows-model.js';
import {umapIconOf,UMAP_ICON} from '../src/universe-map-art.js';
import '../src/scanner.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const hit=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
// ---------- the marks ----------
assert.equal(SCAN_MARKS,8,'eight marks at most');assert.ok(SCAN_SHOW>=6&&SCAN_SHOW<=8,'they stay 6–8 s');
for(const [W,H] of [[390,844],[1280,800],[844,390]]){
 const view={W,H,cx:W/2,cy:H/2},ring=markRing(W,H),inside=m=>m.x>=MARK_SIDE-.5&&m.x<=W-MARK_SIDE+.5&&m.y>=MARK_TOP-.5&&m.y<=H-MARK_BOTTOM+.5;
 // Far things (off the screen) sit on the perimeter, in their direction.
 const far=[0,1,2,3,4,5].map(i=>{const a=i/6*Math.PI*2;return {key:'f'+i,x:W/2+Math.cos(a)*5000,y:H/2+Math.sin(a)*5000,label:'Caja · 500 m'};});
 const m1=scanMarks(far,view);assert.equal(m1.length,6);
 for(const [i,m] of m1.entries()){assert.ok(m.edge&&!m.ring,'far: on the edge');assert.ok(inside(m),('kept inside the safe area',m));
  const a=Math.atan2(m.y-H/2,m.x-W/2),want=i/6*Math.PI*2;assert.ok(Math.abs(Math.atan2(Math.sin(a-want),Math.cos(a-want)))<.6,'in its direction');
  assert.ok(Math.abs(Math.hypot(m.x-W/2,m.y-H/2)-edgeReach(m.a,view))<2,'on the perimeter');}
 // A thing close to the cube is pushed out to the ring (never on the cube); one on the screen beyond the ring sits on itself.
 const [near]=scanMarks([{key:'n',x:W/2+10,y:H/2,label:'Voz · 1 m'}],view);assert.ok(near.ring&&!near.edge&&Math.abs(Math.hypot(near.x-W/2,near.y-H/2)-ring)<1.5,('near: on the ring',near,ring));
 const ox=W/2+Math.min(ring+40,edgeReach(0,view)-10),[own]=scanMarks([{key:'o',x:ox,y:H/2,label:'Juego · 20 m'}],view);assert.ok(!own.ring&&!own.edge&&Math.abs(own.x-ox)<1,('on itself',own));
 // A cap, in the order given, and none covers another (many in the same direction spread along the ring or the edge).
 const crowd=Array.from({length:20},(_,i)=>({key:'c'+i,x:W/2+3000+i*10,y:H/2+i*5,label:'Hallazgo · '+(300+i)+' m'}));
 const m2=scanMarks(crowd,view);assert.ok(m2.length>=2&&m2.length<=SCAN_MARKS,m2.length);assert.equal(m2[0].key,'c0','the first in order keeps its place');
 for(let i=0;i<m2.length;i++)for(let j=i+1;j<m2.length;j++)assert.ok(!hit(m2[i].box,m2[j].box),('no overlap',m2[i],m2[j]));
 for(const m of m2){assert.ok(m.box.x>=0&&m.box.x+m.box.w<=W+.5,('the words stay on the screen',m.box,W));}
 assert.equal(scanMarks(crowd,view,{cap:3}).length,3,'the cap');
}
assert.deepEqual(scanMarks([{key:'x',x:NaN,y:0}],{W:390,H:844,cx:195,cy:422}),[],'bad items are dropped');
assert.ok(markBox(380,400,'Cristal de cometa · 1,2 km',390).x+markBox(380,400,'Cristal de cometa · 1,2 km',390).w<=390,'a long label is kept inside');
// ---------- one icon per kind ----------
const kinds=Object.keys(SCAN_KINDS);assert.ok(kinds.length>=25);assert.deepEqual([...ICON_KINDS],kinds);
for(const k of ['caja','lugar','hallazgo','juego','sonda','satelite','boya','secreto','sonido','criatura','estacion','hito','cometa'])assert.ok(kinds.includes(k),'the table has '+k);
assert.equal(SCAN_KINDS.secreto,'?','«?» is the secret icon');
// The old words read as their kinds.
assert.equal(iconKind('portal'),'juego');assert.equal(iconKind('pregunta'),'secreto');assert.equal(iconKind('estrella'),'chispa');assert.equal(iconKind('nada'),'banda');
// Each kind has its own drawing (the painter's calls differ), baked once.
const icons=read('src/scan-icons.js');for(const k of kinds)assert.ok(icons.includes(' '+k+':c=>'),'every kind has a painter: '+k);
const bodies=kinds.map(k=>{const i=icons.indexOf(' '+k+':c=>');return icons.slice(i+k.length+2,icons.indexOf('\n',i));});
assert.equal(new Set(bodies).size,kinds.length,'no two kinds share a drawing');
// Without a canvas (Node) the icon is a plain square: still drawn, never broken.
let calls=0;drawScanIcon({strokeRect(){calls++;}},'caja',5,5);assert.equal(calls,1);assert.equal(scanIconSprite('caja'),scanIconSprite('caja'));
// The scanner's registry uses the table.
const S={journey:{finished:true},lugares:{won:true}};
registerScan({id:'prueba-icono',name:'Prueba',shape:'portal',level:1,rarity:1,sites:()=>[{key:'a',x:100,y:0}]});
const it=scanNear({x:0,y:0},S,{level:scanLevel(S),max:0}).find(i=>i.id==='prueba-icono');assert.equal(it.shape,'juego','the registry reads old shapes as kinds');unregisterScan('prueba-icono');
// A secret kind is «?» until one of its kind is found; then its own icon and name (comet crystals).
registerScan({id:'prueba-secreto',name:'Cristal de prueba',shape:'cometa',level:1,rarity:2,secret:true,known:S=>!!S.conocido,sites:()=>[{key:'s',x:200,y:0}]});
let sec=scanNear({x:0,y:0},S,{level:scanLevel(S),max:0}).find(i=>i.id==='prueba-secreto');assert.ok(sec.ask&&sec.shape==='secreto'&&sec.name==='?',sec);
sec=scanNear({x:0,y:0},{...S,conocido:true},{level:scanLevel(S),max:0}).find(i=>i.id==='prueba-secreto');assert.ok(!sec.ask&&sec.shape==='cometa'&&sec.name==='Cristal de prueba',sec);unregisterScan('prueba-secreto');
// The arrows use the table: each kind of the layer is a kind of the table (carga and cosa take the thing's own).
for(const k of Object.keys(EDGE_RANK))assert.ok(EDGE_ICON[k]===null||kinds.includes(EDGE_ICON[k]),'arrow kind '+k);
assert.equal(edgeOffer({kind:'caja',x:1,y:1,shape:'portal'}).shape,'caja','the kind decides');
assert.ok(!edgeKnown('cometa',{})&&edgeKnown('cometa',{skySecrets:{comets:{3:'d'}}})&&edgeKnown('hito',{})&&!edgeKnown('rumor',{skySecrets:{comets:{1:1}}}),'known kinds');
// The map uses the table: its point kinds are kinds of the table; «?» only for a rumour (not your flare or an order).
for(const k of Object.values(UMAP_ICON))assert.ok(kinds.includes(k),'map kind '+k);
assert.equal(umapIconOf({kind:'heard'}),'hito','a heard landmark is a landmark, not «?»');
assert.equal(umapIconOf({kind:'rumor'}),'secreto');assert.equal(umapIconOf({kind:'rumor',icon:'bengala'}),'bengala');assert.equal(umapIconOf({kind:'rumor',icon:'encargo'}),'encargo');
const art=read('src/universe-map-art.js');assert.ok(!/fillText\('\?'/.test(art),'the map draws no «?» of its own: the table does');
for(const f of ['src/scanner-art.js','src/scanner-arrows-model.js','src/universe-map-art.js','src/universe-map.js'])assert.match(read(f),/scan-icons\.js/,'uses the one table: '+f);
assert.equal(read('sw.js').split('"./src/scan-icons.js"').length-1,1,'once in the shell');
assert.ok(!/create(Radial|Linear)Gradient|shadowBlur/.test(read('src/scan-icons.js')+read('src/scanner-art.js')),'no gradient or shadow');
// No panel for the player: the ids stay in the page; the scanner never shows #scanner outside ?dev=1.
const html=read('index.html'),src=read('src/scanner.js');for(const id of ['scanner','scannerRegion','scannerSources','scannerHint'])assert.ok(html.includes(`id="${id}"`),id);
assert.match(src,/if\(dev\(\)\)devPanel\(items\)/);assert.ok(!/panel\.hidden=false/.test(src.replace(/function devPanel[\s\S]*?panel\.hidden=false;\}/,'')),'the panel shows only in dev mode');
assert.ok(!/scan-row'[^\n]*button|markRow|SCAN_KEEP/.test(src),'no tap-to-mark from a panel');
console.log('PASS escáner NMS: marks on a ring that stops at the screen\'s edge (far on the perimeter, near pushed to the ring, on screen on itself), eight at most, none covering another, words inside the screen; one icon per kind for the scanner, the arrows and the map, «?» only for what is not discovered, a heard landmark as a landmark; no panel for the player');
