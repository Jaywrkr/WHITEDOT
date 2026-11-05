// T3 «la carga» (Kubono coherente, decision 4 of Jay). The Brújula power is the Carga: opening its box raises the
// Scanner to its top level for 20 s and one white arrow, in the one arrow layer (T2), points at the rarest thing the
// registry reaches. The radar is always there without boxes; the charge only adds. The Compañero points the same way.
// The ids brujula and poder_brujula stay (no migration).
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {POWERS,POWER_IDS} from '../src/expansion-music.js';
import {BOX_LINES,boxLine} from '../src/celebration.js';
import {scanLevel,SCAN_LEVELS,registerScan,unregisterScan} from '../src/scanner-model.js';
import {EDGE_RANK,EDGE_SCENE_RANK} from '../src/scanner-arrows-model.js';
import {initialize as arrows} from '../src/scanner-arrows.js';
import {initialize as cajas} from '../src/cajas.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
// ---------- names and ids ----------
assert.ok(POWER_IDS.includes('brujula'),'the id stays');assert.equal(POWERS.brujula.name,'Carga');assert.equal(POWERS.brujula.seconds,20);
assert.equal(boxLine(POWERS.brujula.name,'brujula'),'Carga · '+BOX_LINES.brujula);assert.match(BOX_LINES.brujula,/Escáner/);
assert.match(read('src/data.js'),/\["poder_brujula","Carga",/,'the achievement keeps its id');
// ---------- the level ----------
const top=SCAN_LEVELS.at(-1);
for(const S of [{},{journey:{finished:true}},{journey:{finished:true},lugares:{won:true}}]){
 assert.equal(scanLevel(S,{charged:true}).id,top.id,'a charge is the top level from any save');
 assert.ok(scanLevel(S).rank<=3,'without a box the save keeps its own level');}
assert.equal(scanLevel({}).id,'1','the radar is there without boxes (level 1 from the start)');
// ---------- one arrow to the rarest ----------
globalThis.document??={querySelector:()=>null,querySelectorAll:()=>[]};
function canvas(){const log={colors:new Set(),arrows:0};const c={save(){},restore(){},translate(){},rotate(){},beginPath(){},closePath(){},moveTo(){},lineTo(){},stroke(){},fill(){},strokeRect(){},fillRect(){},drawImage(){},fillText(){},arc(){}};
 return new Proxy(c,{set(o,k,v){if(k==='strokeStyle'||k==='fillStyle')log.colors.add(String(v).toLowerCase());o[k]=v;return true;},get(o,k){return k==='log'?log:k in o?o[k]:undefined;}});}
// Three things off screen: a rare one 900 m away (only a charge reaches it), a common one at 100 m and a found one.
registerScan({id:'prueba-rara',name:'Rara',shape:'estrella',level:1,rarity:3,sites:()=>[{key:'r',x:9000,y:0}]});
registerScan({id:'prueba-comun',name:'Común',shape:'caja',level:1,rarity:1,sites:()=>[{key:'c',x:0,y:1000}]});
registerScan({id:'prueba-vista',name:'Vista',shape:'caja',level:1,rarity:3,sites:()=>[{key:'v',x:-1500,y:0}],done:()=>true});
function game({charged=false,mate=false,S={}}={}){const r={S:{wx:0,wy:0,layer:'superficie',...S},W:390,H:844,camX:0,camY:0,inWorld:()=>true,lightQuality:()=>false,cx:canvas(),scanCharged:()=>charged,companionPoints:()=>mate};arrows(r);r.drawEdgeArrows();return r;}
{const r=game({charged:true}),s=r.edgeState();
 assert.equal(s.charged,true);assert.equal(s.level,top.id);assert.equal(s.pointer?.key,'scan:prueba-rara:r','the rarest not found');
 const mine=s.shown.filter(e=>e.kind==='carga');assert.equal(mine.length,1,'one arrow of the charge');assert.equal(mine[0].label,'900 m','with its distance');
 assert.ok(s.shown.length<=3);assert.ok(!s.shown.some(e=>e.key==='scan:prueba-vista:v'),'what is found is not pointed at');
 assert.ok([...r.cx.log.colors].every(c=>c==='#fff'||c==='#ffffff'),'white, never gold: '+[...r.cx.log.colors]);}
{const r=game(),s=r.edgeState();assert.equal(s.pointer,null);assert.equal(s.shown.length,0,'level 1 without a box: no arrow');assert.equal(s.level,'1');}
{const r=game({mate:true,S:{journey:{finished:true}}}),s=r.edgeState();
 assert.equal(s.pointer?.key,'scan:prueba-comun:c','the Compañero points with the registry, at the reach the save has');assert.equal(s.shown.length,1);assert.equal(s.shown[0].kind,'carga');}
assert.ok(EDGE_RANK.carga>=EDGE_SCENE_RANK&&EDGE_RANK.carga<EDGE_RANK.reto,'the charge is the player\'s own: it stays in a scene, under a challenge');
for(const id of ['prueba-rara','prueba-comun','prueba-vista'])unregisterScan(id);
// ---------- the box: 20 s, then the save's own level ----------
{const S={wx:0,wy:0,layer:'superficie',help:{},boxes:{}};const r={S,inWorld:()=>true,WCH:900,seedOf:()=>1,rng:()=>()=>.99,regionOfPos:()=>({sea:false}),MU:{near:[]},body:{speed:0},toast:()=>{},say:()=>{},unlock:()=>{},save:()=>true};
 cajas(r);assert.equal(r.scanCharged(),false);r.givePower('brujula');assert.equal(r.scanCharged(),true,'the box charges the scanner');
 for(let i=0;i<19;i++)r.cajasTick(1);assert.equal(r.scanCharged(),true,'19 s: still charged');for(let i=0;i<2;i++)r.cajasTick(1);assert.equal(r.scanCharged(),false,'after 20 s it ends');
 r.givePower('companero');assert.equal(r.companionPoints(),true);
 r.S.layer='bajo';assert.equal(r.companionPoints(),false,'only on the surface');}
// ---------- no other compass ----------
const box=read('src/cajas.js');assert.doesNotMatch(box,/rareTargets|has\('brujula'\)\|\|companion\.on/,'the power draws no arrows of its own');
assert.doesNotMatch(box,/giveBoxSurprise/,'one box, one power');
assert.match(read('src/scanner.js'),/scanLevel\(runtime\.S,\{charged:charged\(\)\}\)/,'the held scanner reads the charge');
console.log(`PASS la carga (T3): the Brújula is the Carga (ids kept), 20 s at level ${top.id} from any save, one white arrow to the rarest not found, the Compañero points with the same registry, the radar is there without boxes`);
