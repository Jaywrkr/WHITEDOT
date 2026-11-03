// Recorrer lejos (F2, first batch; alpha.245): buoys of light every km, rest satellites every 10 km and their door.
// Placed with hashKey (no Math.random, nothing moved), measured from the origin; the next buoy outward; satellites about
// 10 km apart; the save normalised and migrated (nothing lost, a later version untouched); entering a satellite keeps it
// and lowers the music a little evenly; the door only from inside a visited satellite, only to another visited
// one (or the ring); no sparks anywhere; English for every text; wiring.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RECORRER_VERSION,UNITS_PER_KM,BUOY_PASS,SAT_EVERY,SAT_INSIDE,SAT_DUCK,ringCount,buoyAt,satelliteAt,nearestBuoy,nextBuoy,buoyHere,nearestSatellite,satelliteHere,kmFromOrigin,normalizeRecorrer,noteSatellite,noteBuoy,visited,doorFrom,doorPoint} from '../src/recorrer-model.js';
import {initialize as recorrer,playRecorrerNotes,satelliteName} from '../src/recorrer.js';
import {cardActions,UMAP_PRIORITY} from '../src/universe-map-model.js';
import {worldKey} from '../src/descubrir-model.js';
import {EN} from '../src/i18n-en.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const W='abc',U=UNITS_PER_KM;
// ---------- buoys ----------
for(const k of [1,2,5,13,30,77]){const n=ringCount(k);assert.ok(n>=6);
 const all=Array.from({length:n},(_,j)=>buoyAt(W,k,j));
 for(const b of all){assert.ok(Math.abs(Math.hypot(b.x,b.y)/U-k)<1e-3,'on its km ring');assert.equal(b.km,k);}
 // About 1 km apart along the ring (each in its own sector, never two together).
 const gaps=all.map((b,j)=>{const c=all[(j+1)%n];return Math.hypot(b.x-c.x,b.y-c.y)/U;});
 if(k>=2){assert.ok(Math.min(...gaps)>.35&&Math.max(...gaps)<1.75,[k,Math.min(...gaps),Math.max(...gaps)]);}
 assert.deepEqual(buoyAt(W,k,3),buoyAt(W,k,3),'the same buoy every time');}
assert.notDeepEqual(buoyAt(W,13,3),buoyAt('otro',13,3),'each world its own');
// Not too many: about one per km² far out (here a 10 km square at 30 km).
{let n=0;for(let k=25;k<=36;k++)for(let j=0;j<ringCount(k);j++){const b=buoyAt(W,k,j);if(b.x>=25*U&&b.x<35*U&&b.y>=-5*U&&b.y<5*U)n++;}assert.ok(n>=70&&n<=140,n);}
// The next buoy is on your next km outward; the one you are passing counts within reach only.
{const p={x:12.4*U,y:300};const nb=nextBuoy(W,p);assert.equal(nb.km,13);const near=nearestBuoy(W,13,p);assert.equal(nb.id,near.id);
 assert.equal(nextBuoy(W,p,b=>b.id===near.id).km,14,'one just passed gives way to the next km');
 const b=buoyAt(W,13,0);assert.equal(buoyHere(W,{x:b.x+BUOY_PASS-1,y:b.y})?.id,b.id);assert.equal(buoyHere(W,{x:b.x+BUOY_PASS+5,y:b.y}),null);
 assert.equal(buoyHere(W,{x:100,y:0}),null,'no buoy at the origin');assert.equal(nextBuoy(W,{x:0,y:0}).km,1);}
// ---------- satellites ----------
assert.equal(SAT_EVERY,10);
for(const m of [1,2,7]){const km=m*10,n=ringCount(km,10),all=Array.from({length:n},(_,j)=>satelliteAt(W,m,j));assert.ok(n>=6);
 for(const s of all)assert.ok(Math.abs(Math.hypot(s.x,s.y)/U-km)<1e-3);
 const gaps=all.map((s,j)=>Math.hypot(s.x-all[(j+1)%n].x,s.y-all[(j+1)%n].y)/U);assert.ok(Math.min(...gaps)>3.5&&Math.max(...gaps)<17.5,[km,gaps]);}
{const s=satelliteAt(W,7,4);assert.equal(satelliteHere(W,{x:s.x,y:s.y+SAT_INSIDE-1})?.id,s.id);assert.equal(satelliteHere(W,{x:s.x,y:s.y+SAT_INSIDE+20}),null);
 // From 77 km, a satellite is never far: the rings of 70 and 80 km.
 let worst=0;for(let a=0;a<360;a+=3){const p={x:Math.cos(a*Math.PI/180)*77*U,y:Math.sin(a*Math.PI/180)*77*U};worst=Math.max(worst,nearestSatellite(W,p).d/U);}assert.ok(worst<8.5,worst);
 assert.equal(nearestSatellite(W,{x:2*U,y:0}).km,10,'before 10 km, the first ring');}
// ---------- the save ----------
{const fresh=normalizeRecorrer(undefined);assert.deepEqual(fresh,{version:1,sats:[],last:null,far:0,buoys:0},'an older save starts empty');
 const raw={version:1,extra:{keep:true},far:12,buoys:30,last:'sat:2:3',sats:[{id:'sat:2:3',w:W,x:1,y:2,km:20,day:'2026-11-03',note:'mine'},{id:'sat:2:3',w:W,x:1,y:2,km:20},{id:'nope',w:W,x:0,y:0},{id:'sat:1:1',w:W,x:NaN,y:0},{id:'sat:1:1',w:'otro',x:5.4,y:6,km:10}]};
 const q=normalizeRecorrer(structuredClone(raw));assert.equal(q.sats.length,2,'one row each, invalid ones out');assert.equal(q.sats[0].note,'mine');assert.deepEqual(q.extra,{keep:true},'unknown fields kept');assert.equal(q.sats[1].x,5);
 assert.deepEqual(normalizeRecorrer(q),q,'stable');const later={version:2,future:[1]};assert.equal(normalizeRecorrer(later),later,'a later version untouched');
 assert.equal(normalizeRecorrer({far:-3,buoys:1.5}).far,0);}
{const q=normalizeRecorrer({}),s=satelliteAt(W,2,5);assert.deepEqual(noteSatellite(q,W,s,'d1'),{first:true});assert.deepEqual(noteSatellite(q,W,s,'d2'),{first:false});assert.equal(q.sats.length,1);assert.equal(q.sats[0].day,'d1');assert.equal(q.last,s.id);
 assert.equal(noteSatellite({version:2},W,s),null);assert.deepEqual(noteBuoy(q,{km:4}),{far:true});assert.deepEqual(noteBuoy(q,{km:3}),{far:false});assert.equal(q.far,4);assert.equal(q.buoys,2);
 // The door: closed outside a visited satellite; to the others visited in this world, nearest the origin first.
 const a=satelliteAt(W,1,0),b=satelliteAt(W,7,2),c=satelliteAt('otro',3,1);assert.deepEqual(doorFrom(q,W,a),[],'not visited: closed');
 noteSatellite(q,W,b);noteSatellite(q,'otro',c);noteSatellite(q,W,a);assert.deepEqual(doorFrom(q,W,a).map(e=>e.id),[s.id,b.id]);assert.deepEqual(doorFrom(q,W,null),[]);
 const pt=doorPoint(q.sats.find(e=>e.id===b.id));assert.equal(satelliteHere(W,pt)?.id,b.id,'the door leaves you inside');assert.equal(pt.layer,'superficie');assert.ok(visited(q,W,b.id)&&!visited(q,W,c.id));}
// The map's card: «Ir por la puerta» only when the door is open.
assert.deepEqual(cardActions({kind:'satellite',x:0,y:0},{canDoor:true}),{go:'door',mark:null});assert.deepEqual(cardActions({kind:'satellite',x:0,y:0},{}),{go:null,mark:'mark'});assert.ok(UMAP_PRIORITY.satellite>UMAP_PRIORITY.refugio);
// ---------- the game, with a stand-in runtime ----------
const canvas=new Proxy({},{get:(t,k)=>k in t?t[k]:()=>({width:0}),set:(t,k,v)=>{t[k]=v;return true;}});
function game(){const els={};const el=id=>els[id]||(els[id]={hidden:id==='mJournal'?false:true,addEventListener(){},});
 const targets=[],cues=[],toasts=[],moves=[];const identity={seed:'s1'};
 const r={S:{mode:'world',layer:'superficie',journey:{finished:true,free:true},todayKey:'2026-11-03',wx:0,wy:0,sparks:7,sound:true},worldIdentity:identity,$:el,inWorld:()=>true,save:()=>r.saveOk,saveOk:true,toast:t=>toasts.push(t),
  ac:{state:'running',currentTime:1},master:{gain:{value:1,setTargetAtTime(v){targets.push(v);this.value=v;}}},musicVolume(){return this.musicDuck??1;},beatSoon:fn=>fn(2),chordTones:()=>[57,60,64,67,71],SIX:.125,vel:v=>v,hookInst:(...a)=>cues.push(a),
  canPracticeTravel:()=>true,travelPracticePoint:p=>{moves.push(p);r.S.wx=p.x;r.S.wy=p.y;return true;},ringHome:()=>{moves.push('ring');return true;},ringHomePoint:()=>({x:0,y:0}),W:390,H:844,camX:0,camY:0,cx:canvas,targets,cues,toasts,moves};
 recorrer(r);return r;}
{const r=game(),w=worldKey(r.worldIdentity);const step=(n=3)=>{for(let i=0;i<n;i++){r.camX=r.S.wx;r.camY=r.S.wy;r.recorrerTick(.05);r.drawRecorrer();}};
 // A buoy: one soft note of the chord, an octave up; counted; nothing paid.
 const b=nearestBuoy(w,3,{x:3*U,y:0});r.S.wx=b.x;r.S.wy=b.y;step();let st=r.recorrerState();assert.equal(st.tics,1);assert.equal(st.book.far,3);assert.equal(r.cues.length,1);
 const [inst,note,,gain]=r.cues[0];assert.equal(inst,'feltpiano');assert.ok([69,72,76].includes(note),note);assert.ok(gain<=.004);step(5);assert.equal(r.recorrerState().tics,1,'once while you stay');
 assert.match(st.summary,/^Boya · 3 km/);assert.equal(r.S.sparks,7,'buoys pay nothing');
 // The edge: the next buoy outward is marked while out of view.
 r.S.wx=3.3*U;r.S.wy=0;step();st=r.recorrerState();assert.equal(st.drawn.edge.buoy?.km,4);
 // A satellite: kept, its notice, the music a little lower (the whole output, evenly), its door closed while it is the only one.
 const s1=satelliteAt(w,1,0);r.S.wx=s1.x;r.S.wy=s1.y;step();st=r.recorrerState();assert.equal(st.inside?.id,s1.id);assert.equal(st.book.sats.length,1);assert.equal(r.musicDuck,SAT_DUCK);assert.ok(SAT_DUCK>=.7&&SAT_DUCK<1);
 assert.match(r.toasts.at(-1),/Satélite de descanso<\/em> · 10 km · Punto de retorno guardado/);assert.deepEqual(st.doors,[]);assert.equal(r.S.sparks,7,'satellites pay nothing');
 r.S.wx=s1.x+SAT_INSIDE*2;step();assert.equal(r.musicDuck,1,'out of it, the music as it was');assert.equal(r.recorrerState().inside,null);
 // Outside a satellite the door is closed, even to one visited.
 assert.equal(r.satelliteDoor(s1.id),false);
 // A second satellite: from inside it the door leads to the first; going there is a move to where you walked.
 const s2=satelliteAt(w,2,3);r.S.wx=s2.x;r.S.wy=s2.y;step();assert.deepEqual(r.recorrerState().doors,[s1.id]);assert.equal(r.satelliteDoorOpen(s1.id),true);assert.equal(r.satelliteDoorOpen('sat:9:9'),false,'never to one you have not visited');
 const sec=r.recorrerSection();assert.match(sec,/Recorrer lejos · 2 satélites/);assert.match(sec,/data-sat-door="sat:1:0"/);assert.match(sec,/data-sat-ring/);assert.match(sec,/Estás aquí/);
 const forMap=r.satellitesForMap();assert.equal(forMap.length,2);assert.equal(forMap.find(e=>e.id===s2.id).here,true);
 assert.equal(r.satelliteDoor(s1.id),true);assert.equal(r.moves.length,1);assert.equal(satelliteHere(w,{x:r.S.wx,y:r.S.wy})?.id,s1.id,'arrives inside the other');assert.equal(r.S.sparks,7,'the door costs nothing and pays nothing');
 step();assert.equal(r.recorrerState().inside.id,s1.id);assert.equal(r.recorrerState().book.sats.length,2);assert.equal(r.satelliteRing(),true);assert.equal(r.moves.at(-1),'ring');
 // A failed save leaves the satellite unkept.
 const r2=game();r2.saveOk=false;const s3=satelliteAt(worldKey(r2.worldIdentity),3,1);r2.S.wx=s3.x;r2.S.wy=s3.y;r2.recorrerTick(.05);assert.equal(r2.recorrerState().book.sats.length,0);
 // Outside the free World (a round, the Refugio): nothing, and the music as it was.
 const r3=game();r3.S.wx=s1.x;r3.S.wy=s1.y;r3.recorrerTick(.05);assert.equal(r3.musicDuck,SAT_DUCK);r3.placeRun=()=>({id:'lago'});r3.recorrerTick(.05);assert.equal(r3.musicDuck,1);assert.equal(r3.recorrerState().allowed,false);
 // With the sound off, no note and no duck.
 const r4=game();r4.S.sound=false;r4.S.wx=s1.x;r4.S.wy=s1.y;r4.recorrerTick(.05);assert.equal(r4.cues.length,0);assert.equal((r4.musicDuck??1),1);
 assert.equal(playRecorrerNotes({S:{sound:false}},0),0);}
assert.equal(satelliteName(20),'Satélite · 20 km');
// ---------- no old random numbers, English, wiring ----------
for(const f of ['src/recorrer.js','src/recorrer-model.js']){const src=read(f);assert.ok(!/Math\.random|runtime\.rng|r\.rng\(/.test(src),f);}
for(const k of ['Satélite','Satélite de descanso','Punto de retorno guardado','Ir por la puerta','Recorrer lejos','Puerta · {}','Boya','la más lejana','Boya más lejana','Estás aquí'])assert.ok(EN[k],k);
const main=read('src/main.js'),render=read('src/render.js'),sw=read('sw.js'),journal=read('src/journal.js'),umap=read('src/universe-map.js'),audio=read('src/audio.js');
assert.match(main,/import \{initialize as recorrer\} from '\.\/recorrer\.js';/);assert.match(main,/descubrir\(runtime\);recorrer\(runtime\);/);
assert.match(render,/runtime\.discoverTick\?\.\(dt,modal\);runtime\.recorrerTick\?\.\(dt,modal\);/);assert.match(render,/runtime\.drawRecorrer\?\.\(\);/);
for(const m of ['"./src/recorrer.js"','"./src/recorrer-model.js"'])assert.equal(sw.split(m).length-1,1,m);
assert.match(journal,/runtime\.recorrerSection\?\.\(\)/);assert.match(umap,/satellitesForMap/);assert.match(umap,/a\.go==='door'/);
assert.ok(!audio.includes('recorrer'),'audio.js untouched');
console.log('PASS recorrer lejos: buoys on every km about 1 km apart (hashKey, nothing moved), the next one outward; satellites every 10 km about 10 km apart; the save normalised, migrated and a later version untouched; a satellite kept with the music a little lower; the door only from a visited satellite to another one or the ring; nothing paid; English; wiring');
