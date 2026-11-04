// Lo que hay más lejos, tanda D (alpha.252): 60 km and more. Registered by the bands' API (each thing from its km, a
// notice once), fixed sites from hashKey that start at their band and never run out; the portal of another rule (three
// motions, six lights, bumpers away from the lights); the station of the day (three doors, one challenge and one prize,
// made again each day, depending on the path); the sweep on the beat (pieces, columns that settle, 2×2 squares of one
// tone cleared by the line); the young ones (colour, notes and rhythm inherited, rare combinations, a pet as pet.js keeps
// it, never travelling unless chosen); the eclipse's corona and the pulse's trail; 15 ✦ by universeReward once a day;
// saves and migration; English; no random numbers; the wiring.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bandEntries,normalizeBandas,noteFar,bandRows} from '../src/bandas-model.js';
import * as D from '../src/viaje-d-model.js';
import {normalizePet,createPet,PET_SPECIES} from '../src/pet-model.js';
import {satelliteAt} from '../src/recorrer-model.js';
import {EN} from '../src/i18n-en.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const km=p=>Math.hypot(p.x,p.y)/10000;
// --- the band D, by km, with its notices; the bands of the other batches are untouched
assert.deepEqual(D.BAND_D.map(e=>[e.id,e.km]),[['portal-regla',60],['estacion',65],['barrido',70],['herencia',80],['eclipse-regla',90]]);
assert.ok(D.BAND_D.every(e=>e.batch==='D'&&e.notice),'a notice for each');
assert.deepEqual(bandEntries().map(e=>e.id),['portal-regla','estacion','barrido','herencia','eclipse-regla'],'only this batch in this process');
{const q=normalizeBandas(undefined);assert.deepEqual(noteFar(q,59.9,'2026-11-04'),[]);assert.deepEqual(noteFar(q,72,'2026-11-04').map(e=>e.id),['portal-regla','estacion','barrido'],'crossing three, nearest first');
 assert.deepEqual(noteFar(q,71),[],'once');assert.deepEqual(noteFar(q,95).map(e=>e.id),['herencia','eclipse-regla']);assert.ok(bandRows(q).every(b=>b.reached));
 const old=normalizeBandas(undefined,{far:82});assert.deepEqual(Object.keys(old.seen).sort(),['barrido','estacion','herencia','portal-regla'],'an old save that went far does not get them all at once');}
// --- sites: each from its km, and on beyond it (never runs out); fixed on every load
const W='mundo';
for(let i=-80;i<80;i+=3)for(let j=-80;j<80;j+=3){const p=D.portalAt(W,i,j),s=D.stationAt(W,i,j),n=D.nestAt(W,i,j);if(p)assert.ok(km(p)>=60);if(s)assert.ok(km(s)>=65);if(n)assert.ok(km(n)>=80);}
for(const d of [61,66,81,95,150,400]){const p={x:Math.cos(d)*d*10000,y:Math.sin(d)*d*10000};
 assert.ok(D.portalsNear(W,p,20000).length>=1,'a portal near '+d+' km');if(d>=66)assert.ok(D.stationsNear(W,p,26000).length>=1,'a station near '+d+' km');if(d>=81)assert.ok(D.nestsNear(W,p,24000).length>=1,'a nest near '+d+' km');}
assert.equal(D.portalsNear(W,{x:300000,y:0},30000).length,0,'nothing of this band at 30 km');
assert.deepEqual((await import('../src/viaje-d-model.js?again')).portalsNear(W,{x:700000,y:0},20000).map(s=>[s.x,s.y]),D.portalsNear(W,{x:700000,y:0},20000).map(s=>[s.x,s.y]),'the same on every load');
{const kinds=new Set();for(let i=40;i<70;i++)for(let j=-6;j<6;j++){const s=D.portalAt(W,i,j);if(s)kinds.add(D.portalRule(s));}assert.deepEqual([...kinds].sort(),['hielo','orbita','rebote'],'the three rules');}
// --- the portal of another rule
const portal=D.portalsNear(W,{x:700000,y:0},20000)[0],lights=D.portalLights(portal),bumpers=D.portalBumpers(portal);
assert.equal(lights.length,6);for(const l of lights){const d=Math.hypot(l.x-portal.x,l.y-portal.y);assert.ok(d>=55&&d<=345,d);}
assert.equal(bumpers.length,5);for(const b of bumpers)assert.ok(lights.every(l=>Math.hypot(l.x-b.x,l.y-b.y)>=D.BUMPER_R+D.LIGHT_TOUCH),'no bumper on a light');
assert.ok(D.portalLightDone({x:0,y:0},{x:50,y:0},[]),'passing');assert.ok(D.portalLightDone({x:0,y:0},{x:900,y:0},[{x:100,y:0}]),'a pulse near');assert.ok(!D.portalLightDone({x:0,y:0},{x:900,y:0},[{x:400,y:0}]));
assert.equal(D.PORTAL_SECONDS,120,'two minutes');
{// Ice: it keeps sliding once you let go, and slows down by itself.
 const s={x:0,y:0,id:'p'},p={x:100,y:0},rule=D.newRule('hielo',s,p);let at={...p};for(let k=0;k<20;k++){const n=D.ruleStep(rule,at,{dx:1,dy:0},.05,190);at={x:n.x,y:n.y};}
 const pushed=at.x;for(let k=0;k<20;k++){const n=D.ruleStep(rule,at,{},.05,190);at={x:n.x,y:n.y};}assert.ok(at.x-pushed>60,'it slides with no input: '+(at.x-pushed));assert.ok(Math.hypot(rule.vx,rule.vy)<190*D.ICE_MAX,'never faster than the cap');
 const v0=Math.hypot(rule.vx,rule.vy);for(let k=0;k<200;k++){const n=D.ruleStep(rule,at,{},.05,190);at={x:n.x,y:n.y};}assert.ok(Math.hypot(rule.vx,rule.vy)<v0*.1,'and stops in the end');
 const fast=D.newRule('hielo',s,p);D.ruleStep(fast,p,{dx:1,dy:1},.05,190);const slow=D.newRule('hielo',s,p);D.ruleStep(slow,p,{dx:Math.SQRT1_2,dy:Math.SQRT1_2},.05,190);assert.ok(Math.abs(fast.vx-slow.vx)<1e-9,'two keys at once are no faster');}
{// The orbit: with no input the cube turns round the point; the stick in and out changes the radius.
 const s={x:0,y:0,id:'p'},rule=D.newRule('orbita',s,{x:200,y:0});let at={x:200,y:0};for(let k=0;k<40;k++){const n=D.ruleStep(rule,at,{},.05,190);at={x:n.x,y:n.y};}
 assert.ok(Math.abs(Math.hypot(at.x,at.y)-200)<1e-6,'same radius');assert.ok(Math.abs(Math.atan2(at.y,at.x)-D.ORBIT_OMEGA*2)<1e-6,'it turned');
 const out={x:Math.cos(rule.a),y:Math.sin(rule.a)};for(let k=0;k<20;k++){const n=D.ruleStep(rule,at,{dx:out.x,dy:out.y},.05,190);at={x:n.x,y:n.y};}assert.ok(Math.hypot(at.x,at.y)>240,'the stick out widens the orbit');
 for(let k=0;k<200;k++){const n=D.ruleStep(rule,at,{dx:-Math.cos(rule.a),dy:-Math.sin(rule.a)},.05,190);at={x:n.x,y:n.y};}assert.ok(Math.abs(rule.rad-D.ORBIT_MIN)<1e-6,'never into the point');}
{// Bounces: off a bumper, outwards, a little faster.
 const s={x:0,y:0,id:'p'},rule={...D.newRule('rebote',s,{x:0,y:0}),bumpers:[{k:0,x:100,y:0}]};rule.vx=200;rule.vy=0;const n=D.ruleStep(rule,{x:100-D.BUMPER_R-D.CUBE_R-2,y:0},{},.05,190);
 assert.ok(n.bounced,'it bounced');assert.ok(rule.vx<0,'back');assert.ok(Math.hypot(n.x-100,n.y)>=D.BUMPER_R+D.CUBE_R-1e-6,'never inside the post');}
assert.equal(D.portalReward(6,{x:650000,y:0}),15,'15 ✦ out here');assert.equal(D.portalReward(3,{x:650000,y:0}),8,'the share done');assert.equal(D.portalReward(0,{x:650000,y:0}),0);
// --- the station of the day
const day='2026-11-04',offer=D.stationOffer(W,day,0,[]);assert.equal(offer.length,3);assert.ok(offer.some(d=>d.kind==='reto')&&offer.some(d=>d.kind==='premio'),'one challenge and one prize at least');
assert.equal(new Set(offer.map(d=>d.type)).size,3,'three different doors');assert.deepEqual(D.stationOffer(W,day,0,[]),offer,'the same day, the same doors');
{let other=0;for(let k=0;k<30;k++){const d2=`2026-12-${String(k+1).padStart(2,'0')}`;if(JSON.stringify(D.stationOffer(W,d2,0,[]).map(d=>d.type))!==JSON.stringify(offer.map(d=>d.type)))other++;}assert.ok(other>15,'made again every day: '+other);}
{let differ=0;for(const t of Object.keys(D.ROOMS))for(const u of Object.keys(D.ROOMS))if(JSON.stringify(D.stationOffer(W,day,2,[t,u]))!==JSON.stringify(D.stationOffer(W,day,2,[u,t])))differ++;assert.ok(differ>5,'what you chose changes what comes');}
{const m=D.memorySequence('x');assert.ok(m.length>=3&&m.length<=4&&m.every(c=>c>=0&&c<4)&&m.every((c,i)=>!i||c!==m[i-1]));const q=D.rapidSequence('x');assert.equal(q.length,5);assert.ok(q.every(c=>c>=0&&c<9));}
assert.equal(D.stationReward(3,{x:700000,y:0}),15);assert.equal(D.stationReward(1,{x:700000,y:0}),5);assert.equal(D.stationReward(0,{x:700000,y:0}),0);
// --- the sweep on the beat
{const g=D.emptyGrid();assert.equal(g.length,D.SWEEP_ROWS);assert.equal(g[0].length,D.SWEEP_COLS);
 const p={x:0,y:0,cells:[1,1,2,2]};assert.ok(D.fits(g,p));assert.ok(D.lockPiece(g,p));assert.deepEqual([g[7][0],g[7][1],g[6][0],g[6][1]],[2,2,1,1],'each column falls to the floor');
 assert.deepEqual(D.rotatePiece({cells:[1,2,3,4]}).cells,[3,1,4,2],'turned clockwise');assert.ok(!D.fits(g,{x:-1,y:0,cells:[1,1,1,1]}),'not out of the grid');
 // Two pieces side by side make a 2×2 square of one tone at the bottom: marked, and cleared by the line once it passes it.
 const h=D.emptyGrid();D.lockPiece(h,{x:2,y:0,cells:[2,1,1,1]});D.lockPiece(h,{x:4,y:0,cells:[1,1,1,1]});const m=D.markSquares(h);
 assert.equal(m[7][3]+m[7][4]+m[6][3]+m[6][4],4,'the square across both');assert.equal(m[6][2],0,'a cell of the other tone is not marked');
 const sw={doomed:new Set()};let cleared=0;for(let c=0;c<=D.SWEEP_COLS;c++)cleared+=D.sweepStep(h,sw,c<D.SWEEP_COLS?c:-1);
 assert.ok(cleared>=6,'the squares go: '+cleared);assert.equal(h[7][2],1,'the rest settles down');assert.ok(D.markSquares(h).every(r=>r.every(v=>!v))||cleared>=6);
 let full=D.emptyGrid();for(let y=0;y<D.SWEEP_ROWS;y++)for(let x=0;x<D.SWEEP_COLS;x++)full[y][x]=(x+y)%2+1;assert.ok(!D.fits(full,D.sweepPiece('s',0)),'a full grid ends the game');
 const tones=new Set();for(let n=0;n<40;n++)for(const c of D.sweepPiece('seed',n).cells)tones.add(c);assert.deepEqual([...tones].sort(),[1,2],'two tones');
 assert.deepEqual(D.sweepPiece('seed',3),D.sweepPiece('seed',3),'the same pieces for the same seed');}
assert.equal(D.SWEEP_SECONDS,90);assert.equal(D.sweepReward({x:700000,y:0}),15);
{const sat=satelliteAt(W,7,3);const c=D.consoleFor(W,sat);assert.ok(Math.hypot(c.x-sat.x,c.y-sat.y)<160,'the console is inside the satellite');}
// --- the young ones
{const parent=createPet('golondrina',777,[{degree:1,step:0},{degree:3,step:2},{degree:5,step:4}]);let rare={cruce:0,eco:0,'':0},near=0;
 for(let k=0;k<400;k++){const c=D.inheritPet(parent,'nido:'+k);rare[c.rare]++;assert.equal(c.seed%45,c.hue,'its colour as pet.js draws it');if(Math.abs(c.hue-parent.seed%45)<=6)near++;
  assert.equal(c.notes.filter((d,i)=>d!==[1,3,5][i]).length,1,'one note changed');assert.ok(c.rhythm.every((s,i)=>s>=0&&s<16&&(!i||s>c.rhythm[i-1])),'a rhythm in order');
  if(c.rare==='cruce')assert.notEqual(c.species,parent.species);else assert.equal(c.species,parent.species);
  const pet=D.criaPet(c);assert.deepEqual(normalizePet(pet),pet,'a pet as pet.js keeps it');assert.equal(pet.phrase.length,c.rare==='eco'?6:3);}
 assert.equal(near,400,'a colour near the parent');assert.ok(rare.cruce>5&&rare.eco>5&&rare['']>300,'rare combinations, rarely: '+JSON.stringify(rare));
 assert.deepEqual(D.inheritPet(parent,'a'),D.inheritPet(parent,'a'),'nothing random');assert.equal(D.inheritPet(null,'a'),null,'no pet, no young one');
 assert.equal(D.rhythmText({rhythm:[0,2,5]}),'x·x··x··········');assert.equal(D.notesText({notes:[0,2,4]}),'Do Mi Sol');}
// --- the save S.viajeD: fresh, garbage dropped, unknown kept, a later version untouched
const fresh=D.normalizeViajeD(undefined);assert.equal(fresh.version,1);assert.deepEqual(fresh.brood,[]);assert.equal(fresh.travel,null);assert.equal(fresh.station,null);
const old=D.normalizeViajeD({version:1,portals:{'portal-regla:1,1':'2026-11-04',__proto__:{}},portal:{n:2,won:-1,mine:1},station:{day:'2026-11-04',path:['mirador','nada','compas'],results:['premio',true,5]},
 brood:[{id:'c1',species:'grulla',seed:90,notes:[1,2,3],rhythm:[0,4,8],rare:'x',pet:{species:'grulla',seed:90,phrase:[]}},{id:'c1',species:'grulla',seed:90,notes:[1,2,3],rhythm:[0,4,8]},{id:'c2',species:'perro',seed:1,notes:[1,2,3],rhythm:[0,4,8]}],
 travel:{id:'c1',home:{species:'golondrina',seed:5,phrase:[]}},sweep:{best:12,mine:2},futuro:{k:1}});
assert.deepEqual(old.portal,{n:2,won:0,earned:0,mine:1});assert.deepEqual(old.station.path,['mirador','compas']);assert.deepEqual(old.station.results,['premio',true]);assert.equal(old.brood.length,1);assert.equal(old.brood[0].rare,'');
assert.equal(old.brood[0].hue,0);assert.deepEqual(old.brood[0].pet,normalizePet({species:'grulla',seed:90,phrase:[]}));assert.equal(old.travel.home.species,'golondrina');assert.equal(old.sweep.mine,2);assert.deepEqual(old.futuro,{k:1},'unknown fields kept');
assert.equal(D.normalizeViajeD({version:1,travel:{id:'nadie',home:{species:'grulla',seed:1}}}).travel,null,'a travel without its young one is dropped');
const future={version:2,brood:[{x:1}],whatever:true};assert.equal(D.normalizeViajeD(future),future);assert.equal(D.notePortal(future,'x',6,day,15),null);assert.equal(D.hatch(future,{id:'n'},createPet('grulla',1),day),null);assert.equal(D.travelWith(future,{pet:createPet('grulla',1)},'x'),null);
// The station through a day: five rooms, prizes give seals, done once; tomorrow a new one.
{const q=D.normalizeViajeD({});const s=D.stationToday(q,day);for(const [t,res] of [['compas',true],['mirador',false],['memoria',false],['rapida',true],['jardin',true]])D.noteRoom(q,day,t,res);
 assert.ok(s.done);assert.deepEqual(s.results,[true,'premio',false,true,'premio']);assert.equal(q.seals,2);assert.equal(q.stations,1);assert.equal(D.stationWon(s),2);assert.equal(D.noteRoom(q,day,'compas',true),null,'no sixth room');
 assert.ok(D.payStation(q,10));assert.ok(!D.payStation(q,10),'once a day');assert.equal(q.earned,10);const t=D.stationToday(q,'2026-11-05');assert.deepEqual([t.day,t.path.length,t.done],['2026-11-05',0,false]);assert.equal(q.seals,2,'the seals stay');}
// The sweep: record and pay once a day from SWEEP_PAY.
{const q=D.normalizeViajeD({});assert.ok(!D.sweepPaysToday(q,day,D.SWEEP_PAY-1));assert.ok(D.sweepPaysToday(q,day,D.SWEEP_PAY));assert.deepEqual(D.noteSweep(q,20,day,15),{record:true});assert.ok(!D.sweepPaysToday(q,day,40));assert.deepEqual(D.noteSweep(q,10,day,0),{record:false});assert.deepEqual([q.sweep.best,q.sweep.plays,q.earned],[20,2,15]);}
// The young ones: born once a day per nest, twelve at most; travelling only if chosen; the pet that stays is kept whole.
{const q=D.normalizeViajeD({}),S={pet:createPet('luciernaga',4242)};S.pet.seconds=900;S.pet.places=['1,1','2,2','3,3'];const home=structuredClone(S.pet);
 const c=D.hatch(q,{id:'nido:1,1'},S.pet,day);assert.ok(c);assert.equal(D.hatch(q,{id:'nido:1,1'},S.pet,day),null,'once a day per nest');assert.deepEqual(S.pet,home,'a young one born does not replace the pet');
 for(let k=0;k<20;k++)D.hatch(q,{id:'nido:'+k+',9'},S.pet,day);assert.equal(q.brood.length,D.BROOD_MAX);
 const id=q.brood[3].id,pet=D.travelWith(q,S,id);assert.ok(pet);assert.deepEqual(S.pet,D.criaPet(q.brood[3]));assert.deepEqual(q.travel.home,home,'the pet waits, whole');
 S.pet.seconds=120;S.pet.places=['9,9'];const id2=q.brood[5].id;D.travelWith(q,S,id2);assert.equal(q.brood[3].pet.seconds,120,'what the young one lived is kept');assert.deepEqual(q.travel.home,home);S.pet.seconds=60;
 for(let k=0;k<5;k++)D.hatch(q,{id:'nido:'+k+',8'},S.pet,day);assert.ok(q.brood.some(b=>b.id===id2),'the one travelling is never dropped');
 D.comeHome(q,S);assert.deepEqual(S.pet,home,'the pet comes back as it was');assert.equal(q.travel,null);assert.equal(D.comeHome(q,S),null);
 D.travelWith(q,S,id2);assert.equal(S.pet.seconds,60,'the young one goes on where it was');assert.equal(D.travelWith(q,{pet:null},id),null,'no pet, no choice');}
// The corona: six lights round the star, turning; caught by passing (without sound), a pulse or the trail.
{const site={id:'eclipse:3,0',x:950000,y:0},ps=D.coronaPieces(site,7);assert.equal(ps.length,6);for(const k of ps){const a=D.coronaAt(site,k,0),b=D.coronaAt(site,k,4);const d=Math.hypot(a.x-site.x,a.y-site.y);assert.ok(d>=150&&d<=450);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>10,'they turn');}
 assert.deepEqual(D.coronaPieces(site,7),ps);assert.notDeepEqual(D.coronaPieces(site,8),ps,'each pass its own');
 const q={x:0,y:0};assert.ok(D.coronaCaught(q,{x:40,y:0},[],[],false));assert.ok(!D.coronaCaught(q,{x:40,y:0},[],[],true),'with sound, a pulse or the trail');assert.ok(D.coronaCaught(q,{x:900,y:0},[],[{x:30,y:20}],true),'the trail catches');
 assert.equal(D.coronaReward(6,{x:950000,y:0}),15);const s=D.normalizeViajeD({});assert.deepEqual(D.noteCorona(s,site.id,6,day,15),{first:true});assert.ok(!D.coronaPaysToday(s,site.id,day));assert.deepEqual([s.corona.n,s.corona.caught,s.corona.full,s.earned],[1,6,1,15]);}
// --- English
for(const e of D.BAND_D){assert.ok(EN[e.name],e.name);assert.ok(EN[e.notice],e.notice);}
for(const k of [...Object.values(D.RULE_NAMES),...Object.values(D.ROOMS).flatMap(r=>[r.name,r.text]),...Object.values(D.RARE_NAMES),'Otra regla','Recoge las seis luces.','Estación completa','Sala {n} de {n}','Elige la puerta','Tomar el sello','Ahora','Barrido',
 'Coloca las piezas. La línea borra los cuadrados de un solo tono.','Girar','Bajar','Izquierda','Derecha','Una cría','cría','Hereda color, nota y ritmo.','Combinación rara','Que viaje contigo','Vuelve tu mascota','Crías','Corona','Corona del eclipse','Atrapa sus luces. Tu pulso deja estela.'])assert.ok(EN[k]&&EN[k]!==k||k==='Corona',k);
// --- no random numbers, sparks only by the universe's rule, quiet notes, audio.js and pet.js untouched
const src=read('src/viaje-d.js')+read('src/viaje-d-model.js')+read('src/viaje-d-juegos.js');
assert.ok(!/Math\.random|runtime\.rng|r\.rng|\brnd\(/.test(src),'no random number');assert.ok(!/fetch\(|XMLHttpRequest/.test(src),'no network');
assert.equal((read('src/viaje-d.js').match(/creditSparks\(/g)||[]).length,1,'one place pays');assert.ok(!read('src/viaje-d-juegos.js').includes('creditSparks'));
assert.equal((read('src/viaje-d-model.js').match(/universeReward\(/g)||[]).length,4,'every reward by universeReward: portal, station, sweep, corona');assert.ok(!/hatch[^\n]*universeReward/.test(read('src/viaje-d-model.js')),'the young ones pay nothing');
assert.ok(D.PORTAL_GAIN<=.02&&D.LIGHT_GAIN<=.02&&D.BOUNCE_GAIN<=.012&&D.SWEEP_GAIN<=.012&&D.CRIA_GAIN<=.02&&D.CORONA_GAIN<=.02,'as quiet as the album of sounds');
assert.ok(!/viaje|motionRule/.test(read('src/audio.js')),'audio.js untouched');assert.ok(!/viajeD|criaPet|travelWith/.test(read('src/pet.js')+read('src/pet-model.js')),'pet.js untouched');
// --- wiring
const shell=read('sw.js');for(const m of ['viaje-d-model.js','viaje-d-juegos.js','viaje-d.js'])assert.equal(shell.split(`"./src/${m}"`).length-1,1,m);
const main=read('src/main.js');assert.ok(main.includes("import {initialize as viajeD} from './viaje-d.js';"));assert.ok(main.includes('bandas(runtime);viajeA(runtime);viajeD(runtime);'),'after the bands it attaches to');
const render=read('src/render.js');for(const h of ['runtime.viajeDTick?.(dt,modal)','runtime.drawViajeD?.()','runtime.motionRule?.(dx,dy,dt,movementSpeed)'])assert.ok(render.includes(h),h);
assert.ok(read('src/journal.js').includes("(runtime.viajeDSection?.()||'')"));assert.ok(read('src/house.js').includes('runtime.drawHouseBrood?.('));assert.ok(read('src/secretos-cielo.js').includes('skyEclipse:{get:'));
const html=read('index.html');for(const id of ['mViajeD','viajeDTitle','viajeDStatus','viajeDCanvas','viajeDBody','viajeDPad','viajeDLeft','viajeDTurn','viajeDRight','viajeDDrop','viajeDClose'])assert.equal(html.split(`id="${id}"`).length-1,1,id);
assert.equal(D.VIAJE_D_VERSION,1);assert.ok(PET_SPECIES.grulla);
console.log('PASS lo que hay más lejos, tanda D: five things from 60 to 90 km by the bands\' API, each from its km and on beyond it; portals of another rule (orbit, bounce, ice; six lights; two minutes), the station of the day (three doors, one challenge and one prize, made again daily, the path matters), the sweep on the beat (columns that settle, squares cleared by the line), young ones that inherit colour, notes and rhythm (rare crosses and double echoes) and travel only if chosen, the eclipse\'s corona and the pulse\'s trail; 15 ✦ by universeReward once a day; saves and migration; English; no random numbers; wiring');
