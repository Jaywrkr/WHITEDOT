// El Escáner (coherencia T1): the registry, the levels and the order of what is near. The model is pure; scanner.js
// registers the game's own providers (voices, boxes, finds, games, probes) when it loads.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {registerScan,unregisterScan,scanEntries,scanEntry,scanLevel,scanEarned,scanReach,scanNear,scanPage,scanVisible,scanDistance,scanSiteAt,scanBandEntry,scanBandLevel,SCAN_LEVELS,SCAN_OPEN,SCAN_ROWS,UNITS_PER_M} from '../src/scanner-model.js';
import '../src/scanner.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
// The game's providers, registered once on load.
for(const id of ['voces','cajas','hallazgos','actividades','sondas'])assert.ok(scanEntry(id),id);
assert.equal(scanEntry('sondas').level,2,'the probes are named from level 2');
// Registering an id twice throws; a bad entry throws.
assert.throws(()=>registerScan({id:'voces',name:'Otra',sites:()=>[]}),/twice/);
assert.throws(()=>registerScan({id:'Mal id',name:'x',sites:()=>[]}),/Invalid/);
assert.throws(()=>registerScan({id:'sin-sitios',name:'x'}),/Invalid/);
// ---------- levels ----------
assert.deepEqual(SCAN_LEVELS.map(L=>[L.id,L.reach]),[['1',40],['2',120],['3',300],['4a',600],['4b',900],['4c',1200]]);
assert.equal(SCAN_OPEN,2,'T1 opens levels 1 and 2; later batches raise it');
assert.equal(scanLevel({}).id,'1','level 1 from the start');
assert.equal(scanLevel({journey:{chapter:3}}).id,'1','still 1 during the Journey');
assert.equal(scanLevel({journey:{finished:true}}).id,'2','level 2 after the Journey');
assert.equal(scanLevel({journey:{free:true}}).id,'2','or with the World open');
// 3 and 4 are written and earned, but stay closed until their batch.
const late={journey:{finished:true},lugares:{won:true},bandas:{far:35}};
assert.equal(scanEarned(late),5,'the eleven places and 35 km earn 4b');
assert.equal(scanLevel(late).id,'2','capped at SCAN_OPEN');
assert.equal(scanLevel(late,{open:6}).id,'4b');
assert.equal(scanLevel({journey:{finished:true},bandas:{far:80}},{open:6}).id,'2','no level 4 without level 3');
assert.equal(scanLevel({},{charged:true}).id,'4c','a charge (T3) is the whole ladder');
assert.equal(scanReach(scanLevel({})),40*UNITS_PER_M);assert.equal(scanReach('2'),1200);
// A band's thing: under 10 km it is named at level 2; from 10/30/60 km, its tier.
assert.equal(scanBandLevel(5),2);assert.equal(scanBandLevel(12),4);
const tier=(km)=>({level:4,km});
assert.ok(!scanVisible(tier(25),'3')&&scanVisible(tier(25),'4a')&&!scanVisible(tier(45),'4a')&&scanVisible(tier(45),'4b')&&scanVisible(tier(90),'4c'));
// ---------- distances ----------
assert.deepEqual([3,55,1234,9999,12345].map(scanDistance),['1 m','6 m','120 m','1000 m','1,2 km']);
// ---------- what is near, in order ----------
for(const e of scanEntries())unregisterScan(e.id);   // only the test entries from here
const S={journey:{finished:true},found:{'b:1':true}};
registerScan({id:'luces',name:'Luz',shape:'voz',rarity:0,sites:(p,reach)=>[{key:'1',x:p.x+50,y:p.y},{key:'2',x:p.x+300,y:p.y},{key:'3',x:p.x+2000,y:p.y}]});
registerScan({id:'b',name:'Caja',shape:'caja',rarity:2,sites:p=>[{key:'1',x:p.x+900,y:p.y},{key:'2',x:p.x+100,y:p.y}],done:(S,s)=>!!S.found['b:'+s.key]});
registerScan({id:'lejos',name:'Sonda',shape:'sonda',level:2,rarity:1,sites:p=>[{key:'x',x:p.x,y:p.y+600,name:'Sonda perdida'}]});
registerScan({id:'roto',name:'Roto',sites:()=>{throw Error('a broken provider never breaks the scanner');}});
registerScan({id:'secreto',name:'Secreto',level:3,secret:true,sites:p=>[{key:'s',x:p.x+10,y:p.y}]});
const p={x:1000,y:-500};
const one=scanNear(p,{},{max:0});
assert.deepEqual(one.map(i=>i.key),['b:2','luces:1','luces:2'],'level 1: 40 m, rarest first, then nearest; no level-2 or level-3 entry');
assert.ok(one.every(i=>i.name===null),'level 1 says no names');
const two=scanNear(p,S,{max:0});
assert.deepEqual(two.map(i=>i.key),['b:2','b:1','lejos:x','luces:1','luces:2'],'level 2: 120 m and the probe');
assert.deepEqual(two.map(i=>i.name),['Caja','Caja','Sonda perdida','Luz','Luz'],'names (a site may bring its own)');
assert.deepEqual(two.map(i=>i.done),[false,true,false,false,false],'found ones are marked');
assert.equal(scanNear(p,S).length,SCAN_ROWS,'the panel shows three');
assert.ok(!two.some(i=>i.id==='secreto'),'a level-3 secret stays hidden at level 2');
// Same distance and rarity: the one not found comes first.
registerScan({id:'par',name:'Par',rarity:3,sites:p=>[{key:'a',x:p.x+20,y:p.y},{key:'z',x:p.x-20,y:p.y}],done:(S,s)=>s.key==='a'});
assert.deepEqual(scanNear(p,S,{max:2}).map(i=>i.key),['par:z','par:a']);
assert.deepEqual(scanNear(null,S),[]);
// The page for the Bitácora lists what the level shows, never a secret.
assert.deepEqual(scanPage(S).map(e=>e.id).sort(),['b','lejos','luces','par','roto']);
// ---------- positions from hashKey ----------
const a=scanSiteAt('prueba',3,-4,{cell:1000,share:1}),b=scanSiteAt('prueba',3,-4,{cell:1000,share:1});
assert.deepEqual(a,b,'the same cell gives the same site');assert.ok(a.x>=3200&&a.x<=3800&&a.y>=-3800&&a.y<=-3200,'inside its cell, off the edge');
assert.equal(scanSiteAt('prueba',3,-4,{cell:1000,share:0}),null);
// The band hook: a band's entry registers by its km.
const band=scanBandEntry({id:'radares',km:12,name:'Radares de ritmo',batch:'B'},{sites:()=>[]});
assert.equal(band.id,'banda-radares');assert.equal(band.level,4);assert.equal(band.km,12);
// ---------- the page ----------
const html=read('index.html'),sw=read('sw.js'),src=read('src/scanner.js'),model=read('src/scanner-model.js');
for(const id of ['scanner','scannerRegion','scannerSources','scannerHint'])assert.ok(html.includes(`id="${id}"`),'the scanner keeps its ids: '+id);
assert.match(html,/<h2>Cerca<\/h2>/,'the panel is «Cerca»');
for(const m of ['"./src/scanner-model.js"','"./src/scanner-art.js"'])assert.equal(sw.split(m).length-1,1,'once in the shell: '+m);
assert.ok(!/BPM|Math\.random|\.rng\(/.test(model),'the model shows no BPM and draws no random number');
assert.ok(!/region\.bpm|BPM/.test(src),'the panel shows no BPM (bug 16)');
assert.ok(!/RP\)|'reto'/.test(src),'the region challenge left the panel');
// Bug 8: scanning silences no beacon and undoes no darkness.
for(const f of ['descubrir','viaje-a','lejos-b','recorrer','secretos-cielo','viaje-c'])assert.ok(!/const paused=\(\)=>[^;]*r\.scanning/.test(read(`src/${f}.js`)),'scanning does not pause '+f);
// Drawing: no gradient built per frame, icons baked once.
const art=read('src/scanner-art.js');assert.ok(!/create(Radial|Linear)Gradient|shadowBlur/.test(art));assert.match(art,/bake\(/);
console.log('PASS scanner model: registry once per id, levels 1–2 open (3–4 written), reach 40/120 m, order by rarity, distance and found, names from level 2, hashKey sites, band hook, «Cerca» ids kept, no BPM or challenge, scanning pauses no beacon');
