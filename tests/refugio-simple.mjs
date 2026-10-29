import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateSave} from '../src/save-store.js';
import {worldIdentity} from '../src/world-identity.js';
import {HOUSE_OBJECTS,HOUSE_ROOMS,HOUSE_VERSION,normalizeHouse,encodeHouse,decodeHouse,houseOwns} from '../src/house-model.js';
import {AUTO_RULE,autoRoom,autoSpot,autoTarget,autoDecorate,markMoved,markAway,favouriteVoices,autoGarden,voiceSpot,houseLook,houseNew,seenFrom,newBadge,newLine,roomOpensText} from '../src/house-auto.js';
// Refugio simple (Jay, 28 Oct 2026, alpha.234): what you earn places itself, deterministically; what you placed by hand
// stays; one notice, only for something new in view.
const id=worldIdentity(),load=v=>validateSave(v,{journal:{music:{}},studio:{}},id);
const ALL=['sala','jardin','azotea','sotano'];
// Everything owned: every reward item and achievement the catalog asks for.
const owner={rewards:{items:Object.fromEntries(HOUSE_OBJECTS.map(d=>[d.source,{}]))},ach:{}};
assert.equal(HOUSE_OBJECTS.filter(d=>houseOwns(d,owner)).length,40);

// 1 · Rooms with sense, spots that depend only on the kind and the room.
assert.equal(autoRoom('obj:origen'),'sala');assert.equal(autoRoom('obj:biome:bosque'),'azotea');assert.equal(autoRoom('obj:life:'+HOUSE_OBJECTS.find(d=>d.id.startsWith('obj:life:')).id.slice(9)),'jardin');assert.equal(autoRoom('obj:box:campo'),'sotano');
for(const room of ALL)for(const d of HOUSE_OBJECTS){const p=autoSpot(d.id,room);assert.equal(p.room,room);assert.ok(p.x>0&&p.x<1&&p.y>=.05&&p.y<=.95,d.id+' '+room);assert.deepEqual(autoSpot(d.id,room),p,'same kind, same spot');}
// No two objects of one room share a spot.
for(const room of ALL){const kinds=room==='sala'?HOUSE_OBJECTS:HOUSE_OBJECTS.filter(d=>autoRoom(d.id)===room),spots=new Set(kinds.map(d=>{const p=autoSpot(d.id,room);return p.x.toFixed(3)+':'+Math.round(p.y*20);}));assert.equal(spots.size,kinds.length,room+' spots are distinct');}
// A closed room lends its things to Eco.
assert.equal(autoTarget('obj:biome:bosque',['sala']).room,'sala');assert.equal(autoTarget('obj:biome:bosque',ALL).room,'azotea');

// 2 · Deterministic, and it never touches the random sequence.
{const random=Math.random;Math.random=()=>{throw Error('the old RNG is not used');};
 try{const a=normalizeHouse({objects:[]},{places:11,stars:33}),b=normalizeHouse({objects:[]},{places:11,stars:33});autoDecorate(a,owner);autoDecorate(b,owner);assert.deepEqual(a.objects,b.objects);assert.equal(a.objects.length,40);
  for(const o of a.objects){assert.equal(o.auto,true);assert.equal(o.room,autoRoom(o.kind),'every room open: each in its own room');}
  // Arriving one by one or all at once gives the same house.
  const c=normalizeHouse({objects:[]},{places:11,stars:33});for(let i=1;i<=HOUSE_OBJECTS.length;i++){const some={rewards:{items:Object.fromEntries(HOUSE_OBJECTS.slice(0,i).map(d=>[d.source,{}]))},ach:{}};autoDecorate(c,some);}
  const pos=h=>Object.fromEntries(h.objects.map(o=>[o.kind,[o.room,o.x,o.y]]));assert.deepEqual(pos(c),pos(a),'a new arrival never moves the others');}
 finally{Math.random=random;}}

// 3 · Migration: a v1 house with objects placed by hand. They stay exactly where they were, never marked automatic;
// the rest arrives without a flood of «nuevo».
{const v1={version:1,unlocked:['sala'],objects:[{kind:'obj:origen',room:'sala',x:.1,y:.2},{kind:'obj:biome:bosque',room:'sala',x:.9,y:.3,wonMetadata:{a:1}},{kind:'future:thing',room:'sala',x:.5,y:.5}],x:.4,playerRoom:'sala'};
 const saved=load({totalDays:0,ach:{},house:structuredClone(v1)}),h=normalizeHouse(saved.house,{places:5,stars:5});assert.equal(h.version,HOUSE_VERSION);
 const arrived=autoDecorate(h,owner);assert.equal(h.autoRule,AUTO_RULE);
 const hand=h.objects.filter(o=>o.kind==='obj:origen'||o.kind==='obj:biome:bosque');assert.deepEqual(hand.map(o=>[o.kind,o.room,o.x,o.y,o.auto]),[['obj:origen','sala',.1,.2,undefined],['obj:biome:bosque','sala',.9,.3,undefined]],'hand-placed objects are kept');
 assert.deepEqual(hand[1].wonMetadata,{a:1},'their extra fields too');assert.ok(h.objects.some(o=>o.kind==='future:thing'),'unknown objects are kept');
 assert.equal(arrived.length,38);assert.ok(h.objects.every(o=>!o.fresh),'the first placement is not «new»');
 // Rooms open: automatic ones move to their room, hand-placed ones do not.
 h.unlocked=ALL;autoDecorate(h,owner);assert.equal(h.objects.find(o=>o.kind==='obj:biome:bosque').room,'sala');assert.equal(h.objects.find(o=>o.kind==='obj:biome:lago').room,'azotea');
 // A visit code still opens in an older version (WH1 without decor) and carries every object.
 const code=encodeHouse(h);assert.match(code,/^WH1-/);assert.equal(decodeHouse(code).objects.length,40);}
// A v2 house with hand-placed objects, decor, tints and capsules: nothing is lost.
{const v2={version:2,roomRule:2,unlocked:['sala','jardin'],objects:[{kind:'obj:life:'+HOUSE_OBJECTS.find(d=>d.id.startsWith('obj:life:')).id.slice(9),room:'sala',x:.33,y:.44}],decor:[{id:'decor:reloj',room:'sala',x:.06,y:.12}],tints:{'obj:origen':'#ff8a8a'},capsules:{count:3,items:{'decor:reloj':true}},knownVisitors:{deer:true},visitedHouses:{v1:true},seen:{cards:2,ach:5}};
 const s=load({totalDays:3,ach:{},house:structuredClone(v2)}),h=normalizeHouse(s.house,{places:6,stars:9});autoDecorate(h,owner);
 assert.deepEqual(h.objects[0],{...v2.objects[0]},'the hand-placed object is untouched');assert.deepEqual(h.decor,v2.decor);assert.deepEqual(h.tints,v2.tints);assert.equal(h.capsules.count,3);assert.deepEqual(h.knownVisitors,v2.knownVisitors);assert.deepEqual(h.visitedHouses,v2.visitedHouses);
 assert.equal(h.seen.cards,2,'old seen fields stay for older versions');
 // Put away by hand: it stays away. Moved by hand: it keeps the new place.
 const kind='obj:origen',o=h.objects.find(o=>o.kind===kind);assert.equal(o.auto,true);h.objects=h.objects.filter(p=>p!==o);markAway(h,kind);autoDecorate(h,owner);assert.ok(!h.objects.some(p=>p.kind===kind),'away stays away');
 const moved=h.objects.find(p=>p.auto);moved.x=.01;moved.y=.99;markMoved(h,moved.kind);h.unlocked=ALL;autoDecorate(h,owner);const again=h.objects.find(p=>p.kind===moved.kind);assert.deepEqual([again.x,again.y,again.auto],[.01,.99,undefined]);
 // After the first time, a new arrival is fresh (it is the «nuevo»).
 const less={rewards:{items:Object.fromEntries(HOUSE_OBJECTS.slice(0,10).map(d=>[d.source,{}]))},ach:{}},n=normalizeHouse({objects:[]},{places:11});autoDecorate(n,less);assert.ok(n.objects.every(o=>!o.fresh));autoDecorate(n,owner);assert.equal(n.objects.filter(o=>o.fresh).length,30);}
// A future house is never touched; a read-only one neither.
{const future={version:HOUSE_VERSION+1,objects:[],unlocked:['sala']},copy=structuredClone(future);assert.deepEqual(autoDecorate(future,owner),[]);assert.deepEqual(future,copy);const ro=normalizeHouse(future);assert.deepEqual(autoDecorate(ro,owner),[]);assert.equal(ro.objects.length,0);}

// 4 · The Jardín de voces fills itself with the four most heard voices; your own choice stays yours.
{const card=(id,contexts,tier='raro',obs=0)=>({id,odds:{tier},learning:{contexts:Array.from({length:contexts},(_,i)=>'c'+i)},observations:Array.from({length:obs},()=>({}))});
 const cards=[card('a',1),card('b',5),card('c',2,'mitico'),card('d',2),card('e',0,'raro',4),card('f',0)];
 assert.deepEqual(favouriteVoices(cards),['b','e','c','d'],'most heard, then rarest, then newest');
 const g={version:1,cards:[],positions:{},sets:[]};assert.equal(autoGarden(g,cards,{jardin:false}),false,'only once the Jardín is open');
 assert.equal(autoGarden(g,cards,{jardin:true}),true);assert.deepEqual(g.cards,['b','e','c','d']);assert.equal(g.auto,true);assert.deepEqual(g.positions.b,voiceSpot(0));assert.equal(autoGarden(g,cards,{jardin:true}),false,'stable');
 cards.push(card('g',9));assert.equal(autoGarden(g,cards,{jardin:true}),true,'an automatic garden follows your voices');assert.equal(g.cards[0],'g');
 const mine={version:1,cards:['a'],positions:{a:{room:'sala',x:.5,y:.5}},sets:[{name:'Jardín 1',cards:['a'],positions:{}}]};assert.equal(autoGarden(mine,cards,{jardin:true}),false,'a chosen garden is respected');assert.deepEqual(mine.cards,['a']);
 const manual={version:1,cards:[],positions:{},sets:[],manual:true};assert.equal(autoGarden(manual,cards,{jardin:true}),false,'emptied by hand stays empty');
 assert.equal(autoGarden({version:2,readOnly:true,cards:[]},cards,{jardin:true}),false,'a future garden is read only');}

// 5 · One notice, only for something new in view.
{const look=houseLook({places:5,stars:7,objects:['obj:origen'],sky:['orion'],rooms:['sala'],gallery:['x']});
 assert.deepEqual(houseNew(undefined,look),{count:0,parts:[]},'without a v2 «seen» nothing is announced (the migration counts as seen)');
 const seen=seenFrom(look,{cards:1,ach:2});assert.equal(seen.cards,1);assert.equal(seen.v,2);assert.equal(houseNew(seen,look).count,0,'nothing new, no notice');
 const later=houseLook({...look,places:6,stars:9,objects:['obj:origen','obj:biome:lago'],sky:['orion','casiopea']});const n=houseNew(seen,later);
 assert.equal(n.count,5);assert.deepEqual(n.parts.map(p=>p.text),['1 trofeo','2 ★','1 objeto','1 constelación']);assert.equal(newBadge(n.count),'5 nuevos');assert.equal(newBadge(1),'1 nuevo');assert.equal(newLine(n),'Nuevo: 1 trofeo, 2 ★, 1 objeto');
 assert.equal(houseNew(seenFrom(later,seen),later).count,0,'seen once, the notice goes off');
 // Something that left the view (an object put away) is not news.
 assert.equal(houseNew(seenFrom(later,seen),houseLook({...later,objects:['obj:origen']})).count,0);}

// 6 · A closed room says only the nearer condition, with one number; the rule (D3) is unchanged.
{const cielo=HOUSE_ROOMS.find(r=>r.id==='azotea');assert.equal(roomOpensText(cielo,{places:5,stars:5}),'se abre con 3 lugares más');assert.equal(roomOpensText(cielo,{places:2,stars:12}),'se abre con 3 ★ más');assert.equal(roomOpensText(cielo,{places:7,stars:0}),'se abre con 1 lugar más');assert.equal(roomOpensText(cielo,{places:0,stars:14}),'se abre con 1 ★ más');assert.equal(roomOpensText(cielo,{places:8}),'');}

// 7 · The view: three buttons in sight, the rest under «Más», every old id kept; the menu dot; nothing walks.
{const html=readFileSync(new URL('../index.html',import.meta.url),'utf8'),panel=html.slice(html.indexOf('<div id="housePanel"'),html.indexOf('<div class="modal" id="mHouseCode"'));
 const main=panel.slice(panel.indexOf('house-main'),panel.indexOf('id="houseMore"')),more=panel.slice(panel.indexOf('id="houseMore"'));
 assert.deepEqual([...main.matchAll(/<button id="(\w+)"/g)].map(m=>m[1]),['houseListen','housePlace','houseExit']);
 for(const idd of ['houseStars','houseWorkshop','houseCapsule','houseShare','houseOverview','houseGardenTools','gardenSave','gardenSets'])assert.match(more,new RegExp(`id="${idd}"`),idd+' under «Más»');
 for(const idd of ['houseCount','houseHint','houseSummary','housePick','houseObjects','houseNew'])assert.match(panel,new RegExp(`id="${idd}"`),idd+' kept');
 const house=readFileSync(new URL('../src/house.js',import.meta.url),'utf8');assert.doesNotMatch(house,/walkStep\(h,step,dx,dy\)/,'nothing walks');assert.match(house,/overview=true/);assert.match(house,/simple:true/);
 const guide=readFileSync(new URL('../src/house-guide.js',import.meta.url),'utf8');assert.doesNotMatch(guide,/Prisma listo/,'no insisting');assert.match(guide,/classList\.toggle\('has-new'/);
 const css=readFileSync(new URL('../styles/estilo-j.css',import.meta.url),'utf8');assert.match(css,/#bStudio\.has-new span::after\{[^}]*background:var\(--ink\)/,'the dot is white, a state');
 const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');assert.equal(sw.split('"./src/house-auto.js"').length,2,'listed once in the offline shell');}
console.log('PASS Refugio simple: deterministic places with sense, v1/v2 houses keep what was placed by hand, away and moved respected, the garden fills with the most heard voices, one notice only for what is new in view, closed rooms say one number, three buttons and «Más»');
