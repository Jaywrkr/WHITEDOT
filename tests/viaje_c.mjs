// Lo que hay más lejos, tanda C (alpha.251): the band from 30 to 60 km registered with the bands' API (notices at 30, 35,
// 40, 45 and 50 km), each thing from its km and on beyond it, from hashKey; pulsars whose flashes go back on time or are
// dodged without sound; layered asteroids dug to their core; zip lines only between buoys stepped on; seas of dust whose
// ring of rocks stops the cube on the surface and hides something; the kit of tools and its points; rewards by the
// universe's rule; saves and migration; English; no random numbers; the music untouched; the wiring.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bandEntries,bandGroups,normalizeBandas,noteFar} from '../src/bandas-model.js';
import * as A from '../src/viaje-a-model.js';
import * as C from '../src/viaje-c-model.js';
import {buoyAt,nearestBuoy} from '../src/recorrer-model.js';
import {EN} from '../src/i18n-en.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const km=p=>Math.hypot(p.x,p.y)/10000,W='mundo';
// --- the bands: batch C after batch A, by km; their notices once, nearest first
const c=bandEntries().filter(e=>e.batch==='C');
assert.deepEqual(c.map(e=>[e.id,e.km]),[['pulsar',30],['asteroide',35],['tirolina',40],['polvo',45],['kit',50]]);
assert.ok(c.every(e=>e.notice&&e.notice.startsWith('Aquí empiezan ')),'a notice for each');
assert.deepEqual(bandGroups().map(g=>g.km),[0,.5,1,2,5,10,30,35,40,45,50],'one band per km, A and C');
const q=normalizeBandas(undefined);noteFar(q,12);assert.deepEqual(noteFar(q,41).map(e=>e.id),['pulsar','asteroide','tirolina']);assert.deepEqual(noteFar(q,38),[]);assert.deepEqual(noteFar(q,60).map(e=>e.id),['polvo','kit']);
assert.deepEqual(Object.keys(normalizeBandas(undefined,{far:47}).seen).filter(k=>c.some(e=>e.id===k)).sort(),['asteroide','polvo','pulsar','tirolina'],'an old save far away is seeded quietly');
// --- sites: never under their band, fixed, on and on beyond it, and none inside a sea of dust
for(let i=-90;i<90;i+=3)for(let j=-90;j<90;j+=3){const p=C.pulsarAt(W,i,j),r=C.rockAt(W,i,j),d=C.dustAt(W,i,j),k=C.cacheAt(W,i,j);if(p)assert.ok(km(p)>=30);if(r)assert.ok(km(r)>=35);if(d)assert.ok(km(d)>=45);if(k)assert.ok(km(k)>=50);
 for(const kind of C.POINT_KINDS){const s=C.pointAt(kind,W,i,j);if(s)assert.ok(km(s)>=50);}}
assert.equal(C.pulsarsNear(W,{x:200000,y:0},40000).length,0,'nothing of the band at 20 km');
for(const d of [31,38,44,52,60,80,120]){const a=d/7,p={x:Math.cos(a)*d*10000,y:Math.sin(a)*d*10000};
 if(d>=31)assert.ok(C.pulsarsNear(W,p,20000).length>=1,'a pulsar near '+d+' km');if(d>=38)assert.ok(C.rocksNear(W,p,20000).length>=1,'an asteroid near '+d+' km');
 if(d>=44)assert.ok(C.dustNear(W,p,20000).length>=1,'dust near '+d+' km');if(d>=52){assert.ok(C.cachesNear(W,p,20000).length>=1,'a box near '+d+' km');for(const kind of C.POINT_KINDS)assert.ok(C.pointsNear(W,p,20000).some(s=>s.kind===kind),kind+' near '+d+' km');}}
{const p={x:600000,y:0};for(const s of [...C.pulsarsNear(W,p,40000),...C.rocksNear(W,p,40000),...C.cachesNear(W,p,40000),...C.pointsNear(W,p,40000)])for(const d of C.dustNear(W,s,2000))assert.ok(Math.hypot(d.x-s.x,d.y-s.y)>C.DUST_CLEAR,'none in the dust');}
assert.deepEqual((await import('../src/viaje-c-model.js?again')).rocksNear(W,{x:400000,y:0},12000).map(s=>[s.x,s.y]),C.rocksNear(W,{x:400000,y:0},12000).map(s=>[s.x,s.y]),'the same on every load');
// --- the pulsar: returned on time at the strike, dodged without sound; a run; the reward
const flash={strike:10,aim:{x:0,y:0}};assert.equal(C.flashReturned(flash,[{at:10.2,beat:true}]),true);assert.equal(C.flashReturned(flash,[{at:10.2,beat:false}]),false,'on time only');
assert.equal(C.flashReturned(flash,[{at:9.5,beat:true}]),false,'at its strike');assert.equal(C.flashDodged(flash,{x:100,y:0}),true);assert.equal(C.flashDodged(flash,{x:40,y:0}),false);
let run={cur:0,best:0};for(const ok of [true,true,false,true,true,true,true])run=C.runStep(run,ok);assert.deepEqual(run,{cur:4,best:4});
assert.equal(C.pulsarReward({x:300000,y:0}),15,'15 ✦ from 30 km');assert.equal(C.pulsarReward({x:500000,y:0}),23,'more beyond 50 km');
const v=C.normalizeViajeC(undefined);assert.deepEqual(C.noteVolley(v,'pulsar:1,1',3,4,'2026-11-04'),{pays:false},'a short run pays nothing');assert.equal(C.noteVolley(v,'pulsar:1,1',5,5,'2026-11-04').pays,true);
assert.equal(C.noteVolley(v,'pulsar:1,1',6,6,'2026-11-04').pays,false,'once a day');assert.equal(C.noteVolley(v,'pulsar:1,1',6,6,'2026-11-05').pays,true);assert.deepEqual([v.volleys.n,v.volleys.best,v.volleys.returned],[4,6,21]);
// --- the asteroid: 3–5 layers, each its colour, the deeper ones harder, a core; dug blow by blow, kept layer by layer
const rock=C.rocksNear(W,{x:400000,y:0},20000)[0],plan=C.rockLayers(rock);assert.ok(plan.layers.length>=3&&plan.layers.length<=5);assert.ok(plan.layers.every(l=>C.LAYER_COLORS.includes(l.color)));
assert.ok(new Set(plan.layers.map(l=>l.color)).size>=2,'colours');assert.ok(C.CORES.includes(plan.name));
{const counts=new Set();for(const s of C.rocksNear(W,{x:450000,y:0},60000))counts.add(C.rockLayers(s).layers.length);assert.deepEqual([...counts].sort(),[3,4,5]);}
let prog={l:0,h:0},blows=0,broke=[];while(prog.l<plan.layers.length&&blows<40){const res=C.dig(prog,plan,false);blows++;if(res.broke)broke.push(res.broke);prog=res;}
assert.equal(blows,plan.layers.reduce((a,l)=>a+l.hits,0));assert.equal(broke.at(-1),'core');assert.equal(broke.length,plan.layers.length);
assert.deepEqual(C.dig({l:0,h:0},plan,true),{l:1,h:0,broke:'layer'},'a pulse on time is two blows');
const g=C.normalizeViajeC({});assert.equal(C.noteLayer(g,rock,plan,1),'layer');assert.deepEqual(g.rocks[rock.id],{l:1,h:0});assert.equal(C.noteLayer(g,rock,plan,1),null,'never backwards');
assert.equal(C.noteLayer(g,rock,plan,plan.layers.length),'core');assert.equal(g.cores[rock.id],plan.core);assert.ok(!g.rocks[rock.id]);assert.equal(C.noteLayer(g,rock,plan,9),null,'dug once');
assert.equal(C.coreReward({x:350000,y:0}),12);assert.equal(C.coreCount(g),1);assert.equal(C.coreKinds(g),1);
// --- the zip line: only between buoys of 40 km or more that you stepped on, at most 6 km apart, once; rides back and forth
const b1=buoyAt(W,41,10),b2=buoyAt(W,41,11),b3=buoyAt(W,42,nearestBuoy(W,42,b2).j),far=buoyAt(W,41,40),low=buoyAt(W,39,5);
const z=C.normalizeViajeC({});assert.equal(C.canLay(z,W,b1,b2),false,'not stepped on');
for(const b of [b1,b2,b3,far,low])C.noteZipBuoy(z,W,b);assert.equal(z.buoys.length,4,'only from 40 km');assert.equal(C.noteZipBuoy(z,W,b1),false,'known');
assert.equal(C.canLay(z,W,b1,b2),true);assert.equal(C.canLay(z,W,b1,far),false,'too far apart');assert.equal(C.canLay(z,W,b1,b1),false);assert.equal(C.canLay(z,'otro',b1,b2),false,'each world its own');
const line=C.layLine(z,W,b1,b2,'2026-11-04');assert.equal(line.id,C.zipId(b2.id,b1.id));assert.equal(C.canLay(z,W,b2,b1),false,'once');assert.equal(C.layLine(z,W,b2,b1,''),null);
C.layLine(z,W,b2,b3,'2026-11-04');assert.deepEqual(C.linesAt(z,W,b2.id).map(l=>C.zipOther(l,b2.id).id),[b3.id,b1.id],'the newest first');
const d12=Math.hypot(b1.x-b2.x,b1.y-b2.y);assert.ok(C.zipSeconds(d12)>=C.ZIP_MIN_S&&C.zipSeconds(d12)<=C.ZIP_MAX_S&&C.zipSeconds(d12)<d12/190/2,'much faster than walking');
assert.deepEqual(C.zipPoint(b1,b2,0),{x:b1.x,y:b1.y});assert.deepEqual(C.zipPoint(b1,b2,1),{x:b2.x,y:b2.y});
// --- the sea of dust: the ring of rocks stops the cube on the surface; something hidden in the middle, sometimes
const dust=C.dustNear(W,{x:500000,y:0},30000);const sea=dust[0],rocks=C.dustRocks(sea);assert.equal(rocks.length,C.DUST_ROCKS);
for(let k=0;k<rocks.length;k++){const a=rocks[k],b=rocks[(k+1)%rocks.length],gap=Math.hypot(a.x-b.x,a.y-b.y)-2*C.DUST_ROCK_R;assert.ok(gap<2*C.CUBE_R,'it looks too narrow for the cube: '+gap);}
for(let k=0;k<rocks.length*2;k++){const a=k/(rocks.length*2)*Math.PI*2;for(const dir of [1,-1]){let p={x:sea.x+Math.cos(a)*(dir>0?420:60),y:sea.y+Math.sin(a)*(dir>0?420:60)},prev=p,min=1e9,max=0;
 for(let i=0;i<200;i++){const next={x:p.x-dir*Math.cos(a)*7,y:p.y-dir*Math.sin(a)*7};p=C.ringWall(next,prev,sea);prev=p;const r=Math.hypot(p.x-sea.x,p.y-sea.y);min=Math.min(min,r);max=Math.max(max,r);}
 if(dir>0)assert.ok(min>=C.DUST_RING+C.DUST_WALL-1e-6,'walking in stops at the ring: '+min);else assert.ok(max<=C.DUST_RING-C.DUST_WALL+1e-6,'and out from the middle: '+max);}}
for(const k of rocks)assert.ok(Math.abs(Math.hypot(k.x-sea.x,k.y-sea.y)-C.DUST_RING)<1,'the rocks draw the wall');
assert.deepEqual(C.ringWall({x:sea.x+600,y:sea.y},null,sea),{x:sea.x+600,y:sea.y},'free away from it');
{const hid=dust.filter(s=>C.dustHidden(s)).length;assert.ok(hid>0&&hid<dust.length,'sometimes: '+hid+' of '+dust.length);}
const hidden=dust.map(C.dustHidden).find(Boolean);assert.ok(C.HIDDEN.includes(hidden.name));
const hz=C.normalizeViajeC({});assert.equal(C.noteHidden(hz,sea.id,'2026-11-04'),true);assert.equal(C.noteHidden(hz,sea.id,'2026-11-05'),null,'once per sea');assert.equal(C.hiddenReward({x:450000,y:0}),12);
// --- the kit: the net, the magnet, the rod, once each and for ever; each opens its points, once a day each
const kit=C.normalizeViajeC({});assert.equal(C.nextTool(kit),'red');assert.equal(C.takeTool(kit,'kit:1,1','2026-11-04'),'red');assert.equal(C.takeTool(kit,'kit:1,1','2026-11-04'),null,'a box once');
assert.equal(C.takeTool(kit,'kit:2,1','2026-11-04'),'iman');assert.equal(C.takeTool(kit,'kit:3,1','2026-11-05'),'cana');assert.equal(C.nextTool(kit),null);assert.equal(C.takeTool(kit,'kit:4,1','2026-11-05'),null,'three tools');
assert.deepEqual(Object.values(C.POINT_DEFS).map(d=>d.tool),['red','iman','cana']);
const pt={id:'banco:3,3',kind:'banco'};assert.equal(C.notePoint(kit,pt,'2026-11-04'),true);assert.equal(C.notePoint(kit,pt,'2026-11-04'),null,'once a day');assert.equal(C.notePoint(kit,pt,'2026-11-05'),true);assert.equal(kit.gathered.banco,2);
assert.equal(C.pointReward({x:500000,y:0}),12,'12 ✦ from 50 km');
// --- the save S.viajeC: fresh, garbage dropped, unknown kept, a later version untouched
const fresh=C.normalizeViajeC(undefined);assert.equal(fresh.version,1);assert.deepEqual([fresh.lines,fresh.buoys,fresh.tools,fresh.earned],[[],[],{},0]);
const old=C.normalizeViajeC({version:1,pulsars:{'pulsar:1,1':'2026-11-04',x:'mal'},rocks:{'asteroide:1,1':{l:2,h:1,mine:1},bad:3},cores:{'asteroide:2,2':3,'asteroide:3,3':99},
 lines:[{id:C.zipId('boya:41:1','boya:41:2'),w:'w',a:{id:'boya:41:1',x:1,y:2,km:41},b:{id:'boya:41:2',x:3,y:4,km:41}},{id:'mal',w:'w',a:{id:'a',x:1,y:1},b:{id:'b',x:1,y:1}}],
 tools:{red:'2026-11-04',lanza:'2026-11-04'},gathered:{banco:-3,pozo:2},buoys:['w|boya:41:1','w|boya:41:1',7],futuro:{k:1}});
assert.deepEqual(old.pulsars,{'pulsar:1,1':'2026-11-04',x:''});assert.deepEqual(old.rocks,{'asteroide:1,1':{l:2,h:1}});assert.deepEqual(old.cores,{'asteroide:2,2':3});assert.equal(old.lines.length,1);
assert.deepEqual(old.tools,{red:'2026-11-04'});assert.deepEqual(old.gathered,{banco:0,chatarra:0,pozo:2});assert.deepEqual(old.buoys,['w|boya:41:1']);assert.deepEqual(old.futuro,{k:1},'unknown fields kept');
const future={version:2,tools:{red:'x'},whatever:true};assert.equal(C.normalizeViajeC(future),future);assert.equal(C.takeTool(future,'kit:9,9','d'),null);assert.equal(C.noteVolley(future,'p',9,9,'d'),null);assert.equal(C.layLine(future,W,b1,b2,''),null);assert.equal(C.notePoint(future,pt,'d'),null);
// --- English
for(const e of c){assert.ok(EN[e.name],e.name);assert.ok(EN[e.notice],e.notice);}
for(const k of [...C.CORES,...C.HIDDEN,...Object.values(C.TOOL_NAMES),...Object.values(C.TOOL_LINES),...Object.values(C.POINT_DEFS).flatMap(d=>[d.name,d.need]),'Púlsar · Pulsa a tiempo cuando llegue su destello.','Púlsar · Apártate de su destello.',
 'racha {n} de {n}','Racha · {n}','Tirolina de luz','hasta el km {n}','tirolina al km {n}','Bajo el polvo · Sal por el otro lado.','Fuera del polvo','para siempre','{n} de {n} clases'])assert.ok(EN[k],k);
// --- no random numbers, sparks only by the universe's rule, quiet notes, audio.js untouched
const src=read('src/viaje-c.js')+read('src/viaje-c-model.js');
assert.ok(!/Math\.random|runtime\.rng|r\.rng|\brnd\(/.test(src),'no random number');assert.ok(!/fetch\(|XMLHttpRequest/.test(src),'no network');
assert.equal((read('src/viaje-c.js').match(/creditSparks\(/g)||[]).length,1,'one place pays');
assert.equal((read('src/viaje-c-model.js').match(/universeReward\(/g)||[]).length,4,'every reward by universeReward: pulsar, core, hidden, point');
assert.ok(!/pay\('(Red|Imán|Caña)'/.test(read('src/viaje-c.js'))&&!/takeTool[^;]*pay\(/.test(read('src/viaje-c.js')),'a tool pays nothing');
assert.ok([C.PULSAR_GAIN,C.ROCK_GAIN,C.ZIP_GAIN,C.DUST_GAIN,C.KIT_GAIN].every(x=>x<=.02),'as quiet as the album of sounds');assert.ok(C.DUST_CUTOFF>=800&&C.DUST_CUTOFF<=2000);
assert.ok(!/viaje|bandBusy|bandas/.test(read('src/audio.js')),'audio.js untouched');
assert.ok(!C.CORES.concat(C.HIDDEN).some(t=>/niñ|hombre|mujer|señor|persona|arma|espada|bomba/i.test(t)),'no people, no weapons');
// --- one scene at a time, and the wiring
const shell=read('sw.js');for(const m of ['viaje-c-model.js','viaje-c.js'])assert.equal(shell.split(`"./src/${m}"`).length-1,1,m);
const main=read('src/main.js');assert.ok(main.includes("import {initialize as viajeC} from './viaje-c.js';"));assert.ok(main.includes('bandas(runtime);viajeA(runtime);viajeC(runtime);'),'after the bands');
const render=read('src/render.js');for(const h of ['runtime.viajeCTick?.(dt,modal)','runtime.drawViajeC?.()','runtime.drawViajeCCube?.('])assert.ok(render.includes(h),h);
assert.ok(read('src/viaje-c.js').includes("r.bandAttach?.(id,{line:lines[id],...(id==='pulsar'?{busy:mine}:{})})"),'its scenes in r.bandBusy');
assert.ok(read('src/viaje-a.js').includes('(!reto&&!!r.bandBusy?.())'),'no challenge starts over another batch\'s scene');
assert.ok(!/<button/.test(read('src/viaje-c.js')),'no new button');
assert.equal(C.VIAJE_C_VERSION,1);assert.equal(A.VIAJE_A_VERSION,1);
console.log('PASS lo que hay más lejos, tanda C: bands at 30, 35, 40, 45 and 50 km with their notices once; pulsars, layered asteroids, seas of dust, tool boxes and points from hashKey that start at their band and never run out; flashes sent back on time or dodged without sound; asteroids dug to their core and kept layer by layer; zip lines only between buoys stepped on; the ring of rocks under the dust; the net, the magnet and the rod once and for ever; 12–15 ✦ by universeReward; saves and migration; English; no random numbers; wiring');
