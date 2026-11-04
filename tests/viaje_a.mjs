// Lo que hay más lejos (alpha.248): the bands of distance (registry, fixed sites from hashKey, the save, the notices
// crossed once) and the first batch, 0–10 km: challenge switches, rhythm radars, balls of light and their goals, the flare
// and the request boards by the rest satellites. Each thing starts at its km and keeps appearing beyond it; rewards by
// the universe's rule (10–15 ✦ near the origin, once a day per thing); saves and migration; English; no random numbers;
// the music untouched; the wiring.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {registerBand,bandEntries,bandGroups,bandSiteAt,bandSites,normalizeBandas,noteFar,bandRows,bandReached,formatKm,kmOf,BANDAS_VERSION} from '../src/bandas-model.js';
import * as A from '../src/viaje-a-model.js';
import {satelliteAt,buoyAt,SAT_GLOW,SAT_INSIDE} from '../src/recorrer-model.js';
import {EN} from '../src/i18n-en.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const km=p=>Math.hypot(p.x,p.y)/10000;
// --- the registry: batch A, by km; an id twice must agree; a bad entry is refused
assert.deepEqual(bandEntries().map(e=>[e.id,e.km]),[['bengala',0],['interruptor',.5],['radar',1],['pelota',2],['luces',5],['tablon',10]]);
assert.deepEqual(bandGroups().map(g=>g.km),[0,.5,1,2,5,10]);
assert.deepEqual(bandEntries().filter(e=>e.notice).map(e=>e.km),[1,2,5,10],'a notice at 1, 2, 5 and 10 km');
assert.ok(bandEntries().every(e=>e.batch==='A'));
assert.equal(registerBand({id:'radar',km:1,name:'Radares de ritmo',notice:'Radares de ritmo · Empiezan aquí.',batch:'A'}).id,'radar','the same entry again is harmless');
assert.throws(()=>registerBand({id:'radar',km:3,name:'Otro'}),/twice/);assert.throws(()=>registerBand({id:'Mal id',km:1,name:'x'}));assert.throws(()=>registerBand({id:'x',km:-1,name:'x'}));
assert.equal(formatKm(0),'0 km');assert.equal(formatKm(.5),'500 m');assert.equal(formatKm(10),'10 km');assert.equal(formatKm(2.5),'2,5 km');
// --- sites: fixed, one per cell at most, never under their band
const opts={cell:5000,share:.5,fromKm:3,world:'w'};let n=0,c=0;
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){c++;const s=bandSiteAt('prueba',i,j,opts);if(!s)continue;n++;assert.deepEqual(s,bandSiteAt('prueba',i,j,opts));assert.ok(km(s)>=3);assert.ok(s.x>=i*5000&&s.x<(i+1)*5000&&s.y>=j*5000&&s.y<(j+1)*5000);}
assert.ok(n/c>.3&&n/c<.55,'share '+n/c);
{let differ=0;for(let i=20;i<40;i++)if(JSON.stringify(bandSiteAt('prueba',i,3,opts))!==JSON.stringify(bandSiteAt('prueba',i,3,{...opts,world:'otro'})))differ++;assert.ok(differ>5,'each world its own');}
const near=bandSites('prueba',{x:50000,y:0},9000,opts);assert.ok(near.length>0&&near.every((s,k)=>s.d<=9000&&(!k||s.d>=near[k-1].d)));
// --- the save S.bandas: fresh, seeded, old, future
const fresh=normalizeBandas(undefined);assert.deepEqual(fresh,{version:1,far:0,seen:{}});
const seeded=normalizeBandas(undefined,{far:6.3});assert.equal(seeded.far,6.3);assert.deepEqual(Object.keys(seeded.seen).sort(),['luces','pelota','radar'],'an old save does not get them all at once');
const kept=normalizeBandas({version:1,far:'x',seen:{radar:'2026-11-04','Mal':'x',pelota:'nope'},otro:7},{far:9});assert.equal(kept.far,0);assert.deepEqual(kept.seen,{radar:'2026-11-04',pelota:''});assert.equal(kept.otro,7,'unknown fields kept');
const later={version:2,far:40,seen:{}};assert.equal(normalizeBandas(later),later);assert.deepEqual(noteFar(later,50),[]);assert.equal(later.far,40,'a later version is never written');
const q=normalizeBandas(undefined);assert.deepEqual(noteFar(q,.9,'2026-11-04'),[]);assert.deepEqual(noteFar(q,2.2,'2026-11-04').map(e=>e.id),['radar','pelota'],'crossing two, nearest first');
assert.deepEqual(noteFar(q,1.5),[],'once');assert.equal(q.far,2.2,'the farthest is kept');assert.deepEqual(noteFar(q,11).map(e=>e.id),['luces','tablon']);
assert.deepEqual(bandRows(normalizeBandas({version:1,far:1.2})).map(b=>b.reached),[true,true,true,false,false,false]);assert.ok(bandReached({far:0},{km:0}),'the flare from the start');
// --- batch A: each thing from its km, and on beyond it (never runs out)
const W='mundo';const around=(fn,p,reach)=>fn(W,p,reach);
for(let i=-40;i<40;i++)for(let j=-40;j<40;j++){const s=A.switchAt(W,i,j),r=A.radarAt(W,i,j),b=A.ballAt(W,i,j);if(s)assert.ok(km(s)>=.5);if(r)assert.ok(km(r)>=1);if(b)assert.ok(km(b)>=2);
 if(s&&km(s)<5)assert.equal(A.switchKind(s),'aros','only rings under 5 km');}
for(const d of [3,6,9,30,80]){const p={x:Math.cos(d)*d*10000,y:Math.sin(d)*d*10000};
 assert.ok(around(A.switchesNear,p,9000).length>=1,'a switch near '+d+' km');assert.ok(around(A.radarsNear,p,12000).length>=1,'a radar near '+d+' km');assert.ok(around(A.ballsNear,p,15000).length>=1,'a ball near '+d+' km');}
let lights=0,rings=0;for(let i=10;i<40;i++)for(let j=-5;j<5;j++){const s=A.switchAt(W,i,j);if(!s)continue;if(A.switchKind(s)==='luces')lights++;else rings++;}assert.ok(lights>5&&rings>5,'from 5 km, both kinds: '+lights+' '+rings);
assert.deepEqual((await import('../src/viaje-a-model.js?again')).switchesNear(W,{x:20000,y:0},8000).map(s=>[s.x,s.y]),A.switchesNear(W,{x:20000,y:0},8000).map(s=>[s.x,s.y]),'the same on every load');
// --- the challenge of a switch
const sw=A.switchesNear(W,{x:20000,y:0},8000)[0],ringsOf=A.retoRings(sw),lightsOf=A.retoLights(sw);
assert.equal(ringsOf.length,5);for(const g of ringsOf){const d=Math.hypot(g.x-sw.x,g.y-sw.y);assert.ok(d>=150&&d<=290,d);}assert.equal(lightsOf.length,8);assert.equal(A.RETO_SECONDS,30);
const ring={x:0,y:0};assert.deepEqual(A.ringDone(ring,{x:30,y:0},[],false),{onTime:false},'without sound, passing through');assert.equal(A.ringDone(ring,{x:30,y:0},[],true),null,'with sound, a pulse on time is needed');
assert.equal(A.ringDone(ring,{x:0,y:0},[{x:0,y:0,beat:false}],true),null);assert.deepEqual(A.ringDone(ring,{x:900,y:0},[{x:20,y:0,beat:true}],true),{onTime:true});
assert.deepEqual(A.lightDone(ring,{x:20,y:0},[]),{onTime:false});assert.deepEqual(A.lightDone(ring,{x:900,y:0},[{x:100,y:0,beat:true}]),{onTime:true});assert.equal(A.lightDone(ring,{x:900,y:0},[{x:400,y:0}]),null);
assert.equal(A.retoReward(5,5,{x:0,y:0}),10);assert.equal(A.retoReward(5,5,{x:0,y:0,onTime:true}),15);assert.ok(A.retoReward(2,5)<10&&A.retoReward(1,5)>=1);assert.equal(A.retoReward(0,5),0);assert.equal(A.retoReward(8,8,{x:60000,y:0}),15,'×1.5 from 5 km');
// --- the radar
let run={cur:0,best:0};for(const beat of [true,true,true,false,true,true,true,true,true])run=A.radarPulse(run,beat);assert.deepEqual(run,{cur:5,best:5});assert.equal(A.radarReward({x:10000,y:0}),10);
const v=A.normalizeViajeA(undefined);assert.deepEqual(A.noteRadar(v,'radar:1,1',3,'2026-11-04'),{record:true,pays:false,before:3},'under the minimum: a record, no sparks');
assert.equal(A.noteRadar(v,'radar:1,1',6,'2026-11-04').pays,true);assert.equal(A.noteRadar(v,'radar:1,1',8,'2026-11-04').pays,false,'once a day');assert.equal(A.radarRecord(v,'radar:1,1'),8);
assert.deepEqual(A.noteRadar(v,'radar:1,1',2,'2026-11-05'),{record:false,pays:false,before:8});assert.equal(A.noteRadar(v,'radar:1,1',9,'2026-11-05').pays,true,'a new day, a new record pays');assert.equal(A.radarBest(v),9);
// --- the ball: a kick from just behind it reaches the goal, between the rocks (for a child: generous)
const ball={id:'pelota:9,0',x:100000,y:3000},goal=A.goalFor(ball);assert.equal(Math.round(Math.hypot(goal.x-ball.x,goal.y-ball.y)),A.GOAL_DIST);assert.ok(Math.hypot(goal.rocks[0].x-goal.rocks[1].x,goal.rocks[0].y-goal.rocks[1].y)>=140,'15 m wide');
for(const aim of [-.12,0,.12]){const a=Math.atan2(goal.y-ball.y,goal.x-ball.x)+aim,b={x:ball.x,y:ball.y,vx:0,vy:0},from={x:b.x-Math.cos(a)*40,y:b.y-Math.sin(a)*40};Object.assign(b,A.kick(b,from));
 let scored=false;for(let k=0;k<400&&!scored;k++){const prev={x:b.x,y:b.y};A.stepBall(b,1/60,goal.rocks);scored=A.crossedGoal(prev,b,goal);}assert.ok(scored,'a goal aiming '+aim);}
assert.equal(A.kick({x:0,y:0},{x:500,y:0}),null,'too far to kick');const roll={x:0,y:0,vx:300,vy:0};for(let k=0;k<600;k++)A.stepBall(roll,1/60,[]);assert.equal(roll.vx,0,'it stops');
const hit={x:-30,y:0,vx:300,vy:0};let bounced=null;for(let k=0;k<30&&!bounced;k++)bounced=A.stepBall(hit,1/60,[{x:0,y:0}]).bounced;assert.ok(bounced&&hit.vx<0,'it bounces off a rock');
assert.equal(A.crossedGoal({x:0,y:-10},{x:0,y:10},{rocks:[{x:-5,y:0},{x:5,y:0}]}),true);assert.equal(A.crossedGoal({x:20,y:-10},{x:20,y:10},{rocks:[{x:-5,y:0},{x:5,y:0}]}),false,'outside the posts');
assert.equal(A.goalReward({x:30000,y:0}),10);assert.equal(A.goalReward({x:30000,y:0,onTime:true}),15);
assert.equal(A.noteGoal(v,ball.id,'2026-11-04').pays,true);assert.equal(A.noteGoal(v,ball.id,'2026-11-04').pays,false,'once a day');assert.equal(v.goals,2);
// --- the flare
assert.deepEqual(A.setFlare(v,{x:12.4,y:-7},'w','2026-11-04'),{x:12,y:-7,w:'w',day:'2026-11-04',away:false});assert.equal(v.flares,1);
assert.ok(A.flareLoudness(0)===1&&A.flareLoudness(A.FLARE_HEAR)===.25&&A.flareLoudness(5000)>A.flareLoudness(20000),'softer further');assert.equal(A.flarePan(100,100),.85);assert.equal(A.flarePan(-50,100),-.425);assert.equal(A.flarePan(0,0),0);
// --- the boards: one by every rest satellite, outside its light; three orders a day that use what exists
for(const [m,j] of [[1,0],[1,3],[2,7],[5,11]]){const sat=satelliteAt(W,m,j),b=A.boardFor(W,sat);assert.deepEqual(b,A.boardFor(W,sat));const d=Math.hypot(b.x-sat.x,b.y-sat.y);assert.ok(d>SAT_INSIDE&&d>=SAT_GLOW,d);
 const list=A.ordersFor(W,b,'2026-11-04');assert.equal(list.length,3);assert.deepEqual(list.map(o=>o.kind).slice(0,2),['sonido','sitio']);assert.ok(['encuentro','reto'].includes(list[2].kind));
 const s=list[1],buoy=buoyAt(W,s.km,0);assert.ok(Math.abs(s.km-sat.km)<=2&&s.km>=1);assert.equal(Math.round(Math.hypot(s.x,s.y)/10000*10)/10,s.km,'a real buoy at its km');assert.ok(buoy);
 assert.ok(list.every(o=>A.CREATURES.includes(o.who)&&o.text.startsWith(o.who)));assert.deepEqual(A.ordersFor(W,b,'2026-11-04'),list);assert.notDeepEqual(A.ordersFor(W,b,'2026-11-05').map(o=>o.id),list.map(o=>o.id),'new ones tomorrow');}
assert.ok(!A.CREATURES.some(c=>/niñ|hombre|mujer|señor|persona/i.test(c)),'no people');
const o=A.normalizeViajeA({});const sat=satelliteAt(W,1,0),bd=A.boardFor(W,sat),list=A.ordersFor(W,bd,'2026-11-04'),look={sonido:()=>4,encuentro:()=>2,reto:()=>0};
const took=A.takeOrders(o,list,look);assert.equal(took.length,3);assert.deepEqual(o.orders.map(x=>x.base),[4,0,list[2].kind==='encuentro'?2:0]);assert.deepEqual(A.takeOrders(o,list,look),[],'never twice');
assert.equal(A.orderDone(o.orders[0],look,{x:0,y:0}),false);assert.equal(A.orderDone(o.orders[0],{sonido:()=>5},{x:0,y:0}),true,'a new sound');assert.equal(A.orderDone(o.orders[1],look,{x:o.orders[1].x+100,y:o.orders[1].y}),true,'the buoy reached');
assert.equal(A.orderReward(o.orders[0]),15,'×1.5 at 10 km');assert.equal(A.finishOrder(o,o.orders[0].id,15).kind,'sonido');assert.equal(o.ordersDone,1);assert.equal(o.orders.length,2);assert.deepEqual(A.takeOrders(o,list,look),[],'a done one does not come back today');
for(let k=0;k<4;k++){const more=A.ordersFor(W,A.boardFor(W,satelliteAt(W,2,k)),'2026-11-04');A.takeOrders(o,more,look);}assert.equal(o.orders.length,A.ORDER_MAX,'six at most');
// --- the save S.viajeA: fresh, garbage dropped, unknown kept, a later version untouched
const old=A.normalizeViajeA({version:1,retos:{n:3,won:-2,mine:1},switches:{'interruptor:1,1':'2026-11-04','x':'bad',__proto__:{}},radars:{'radar:1,1':{best:7,day:'2026-11-04',paid:'',note:'k'},'radar:2,2':5},flare:{x:3,y:'4'},
 orders:[{id:'a',board:'b',kind:'sitio',text:'t',x:1,y:2},{id:'a',board:'b',kind:'sitio',text:'t',x:1,y:2},{id:'c',board:'b',kind:'otro',text:'t'}],taken:['a','a',7],futuro:{k:1}});
assert.deepEqual(old.retos,{n:3,won:0,earned:0,mine:1});assert.deepEqual(old.switches,{'interruptor:1,1':'2026-11-04',x:''});assert.deepEqual(Object.keys(old.radars),['radar:1,1']);assert.equal(old.radars['radar:1,1'].note,'k');
assert.equal(old.flare,null);assert.equal(old.orders.length,1);assert.deepEqual(old.taken,['a']);assert.deepEqual(old.futuro,{k:1});
const future={version:2,retos:{n:1},whatever:true};assert.equal(A.normalizeViajeA(future),future);assert.equal(A.setFlare(future,{x:0,y:0},'w',''),null);assert.equal(A.noteGoal(future,'x','d'),null);assert.deepEqual(A.takeOrders(future,list,look),[]);
assert.equal(A.switchPaysToday(old,'interruptor:1,1','2026-11-04'),false);assert.equal(A.switchPaysToday(old,'interruptor:1,1','2026-11-05'),true);
const r0=A.normalizeViajeA({});A.noteReto(r0,'interruptor:2,2',5,5,'2026-11-04',10);assert.deepEqual([r0.retos.n,r0.retos.won,r0.retos.earned,r0.earned,r0.switches['interruptor:2,2']],[1,1,10,10,'2026-11-04']);
// --- T0 (bug 10): the page does not count bands reached as things found, and says nothing false past the last band.
{const b=read('src/bandas.js');assert.ok(!b.includes('Lo que hay más lejos · ${reached} de ${rows.length}'),'no count of bands reached');assert.ok(!b.includes('Más lejos hay más.'),'nothing promised past the last band');}
// --- English
for(const e of bandEntries()){assert.ok(EN[e.name],e.name);if(e.notice)assert.ok(e.notice.split(' · ').every(p=>EN[p]),e.notice);if(e.hint)assert.ok(EN[e.hint],e.hint);}
for(const k of ['Lo que hay más lejos','Llegaste a todo.','Lo más lejos · {}','Lanzar bengala','Marca este sitio','Volviste a tu bengala','Tablón de encargos','Encargo cumplido','{} da las gracias','Reto · Pulsa a tiempo en cada aro.','Reto · Pasa por cada aro.','Reto · Recoge las luces.','Radar de ritmo · con sonido','Gol',
 '{} quiere oír un sonido raro.','{} perdió algo en la boya del km {}.','{} quiere ver un encuentro vivo.','{} quiere ver un reto ganado.',...A.CREATURES,...Object.values(A.ORDER_DO)])assert.ok(EN[k],k);
// --- no random numbers, sparks only by the universe's rule, quiet notes, audio.js untouched
const src=read('src/viaje-a.js')+read('src/viaje-a-model.js')+read('src/bandas.js')+read('src/bandas-model.js');
assert.ok(!/Math\.random|runtime\.rng|r\.rng|\brnd\(/.test(src),'no random number');assert.ok(!/fetch\(|XMLHttpRequest/.test(src),'no network');
assert.equal((read('src/viaje-a.js').match(/creditSparks\(/g)||[]).length,1,'one place pays');assert.ok(!read('src/bandas.js').includes('creditSparks'));
assert.equal((read('src/viaje-a-model.js').match(/universeReward\(/g)||[]).length,4,'every reward by universeReward: challenge, radar, goal, order');
assert.ok(A.RETO_GAIN<=.02&&A.RADAR_GAIN<=.012&&A.BALL_GAIN<=.02&&A.GOAL_GAIN<=.02&&A.FLARE_GAIN<=.012,'as quiet as the album of sounds');
assert.ok(!/viaje|bandBusy|bandas/.test(read('src/audio.js')),'audio.js untouched');
// --- wiring
const shell=read('sw.js');for(const m of ['bandas-model.js','bandas.js','viaje-a-model.js','viaje-a.js'])assert.equal(shell.split(`"./src/${m}"`).length-1,1,m);
const main=read('src/main.js');assert.ok(main.includes("import {initialize as bandas} from './bandas.js';")&&main.includes("import {initialize as viajeA} from './viaje-a.js';"));assert.ok(main.includes('bandas(runtime);viajeA(runtime);'),'bands before the batch that attaches to them');
const render=read('src/render.js');for(const h of ['runtime.bandTick?.(dt,modal)','runtime.viajeTick?.(dt,modal)','runtime.drawViaje?.()'])assert.ok(render.includes(h),h);
for(const f of ['src/live-encounters.js','src/sky-map.js','src/descubrir.js','src/recorrer.js','src/secretos-cielo.js'])assert.ok(read(f).includes('r.bandBusy?.()'),'one scene at a time: '+f);
assert.ok(read('src/universe-map.js').includes('runtime.bandMapPoints?.()'));assert.ok(read('src/journal.js').includes("(runtime.bandasSection?.()||'')"));
const html=read('index.html'),more=html.slice(html.indexOf('id="menuMore"'),html.indexOf('</details>',html.indexOf('id="menuMore"')));assert.ok(more.includes('<button id="bFlare" class="free-only" hidden>'),'the flare under Más, no new control elsewhere');assert.equal(html.split('id="bFlare"').length-1,1);
assert.equal(BANDAS_VERSION,1);assert.equal(A.VIAJE_A_VERSION,1);assert.ok(kmOf({x:30000,y:40000})===5);
console.log('PASS lo que hay más lejos: bands registered by km (notices at 1, 2, 5 and 10 km, once, an old save seeded quietly), fixed sites from hashKey that start at their band and never run out; switches with 30 s challenges (rings, lights from 5 km), radars with records, balls whose goal a kick from behind reaches, the flare, three orders a day by every satellite (six at most); 10–15 ✦ by universeReward once a day; saves and migration; English; no random numbers; wiring');
