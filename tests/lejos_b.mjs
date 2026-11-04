// Lejos del origen, tanda B (alpha.249): the five things of 10–30 km at fixed places from hashKey (each from its band
// on, and beyond), the faded region and its embers, the habitat and its creature that knows you, the song of the sky
// (four notes in order and on time), the sound fusion (fixed by the pair, in the scale, opened at 20 km), the search
// postcard, the rewards by the universe's rule (none for what is special), the save and its migration, the band list
// for tanda A, the English, no random numbers, and the wiring.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as M from '../src/lejos-b-model.js';
import {SOUNDS,soundNote,normalizeAlbum} from '../src/descubrir-model.js';
import {nearestSatellite} from '../src/recorrer-model.js';
import {EN} from '../src/i18n-en.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const W='prueba';
// --- the band list for tanda A: five things, their km and names, in order
assert.deepEqual(M.BAND_ITEMS.map(b=>[b.id,b.km]),[['region-apagada',10],['habitat',12],['cancion-del-cielo',15],['fusion-de-sonidos',20],['postal',25]]);
for(const b of M.BAND_ITEMS)assert.ok(b.name&&EN[b.name],b.name);
assert.ok(Object.isFrozen(M.BAND_ITEMS)&&Object.isFrozen(M.BAND_ITEMS[0]));
assert.deepEqual((await import('../src/lejos-b.js')).BAND_ITEMS,M.BAND_ITEMS,'the game module exposes the same list');
// --- registered in the bands of tanda A (bandas-model.js): each with its notice (in English too), batch B, after A's bands
const B=await import('../src/bandas-model.js');
for(const b of M.BAND_ITEMS){const e=B.bandEntry(b.id);assert.ok(e&&e.km===b.km&&e.name===b.name&&e.batch==='B'&&e.notice===b.notice,b.id);assert.ok(EN[e.notice],e.notice);}
assert.deepEqual(B.bandGroups().filter(g=>g.km>=10).map(g=>g.km),[10,12,15,20,25],'B starts at 10 km, where tanda A ends');
{const q=B.normalizeBandas(null);assert.deepEqual(B.noteFar(q,16).filter(e=>e.batch==='B').map(e=>e.id),['region-apagada','habitat','cancion-del-cielo'],'notices once, nearest first');assert.deepEqual(B.noteFar(q,16),[]);}
// --- places: fixed, each from its band on and beyond, none near a rest satellite, none before 10 km
const counts={},below=[];let n=0;
for(let i=-50;i<50;i++)for(let j=-50;j<50;j++){const s=M.siteCell(W,i,j);if(!s)continue;n++;counts[s.kind]=(counts[s.kind]||0)+1;
 if(M.kmOf(s)<M.SITE_KINDS[s.kind])below.push(s);const sat=nearestSatellite(W,s);assert.ok(!sat||sat.d>=M.SITE_CLEAR,'clear of a satellite');
 assert.deepEqual(M.siteCell(W,i,j),s,'fixed');assert.ok(s.x>=i*M.SITE_CELL&&s.x<(i+1)*M.SITE_CELL&&s.y>=j*M.SITE_CELL&&s.y<(j+1)*M.SITE_CELL);}
assert.deepEqual(below,[],'nothing before its band');assert.ok(n>2000,n);
for(const k of Object.keys(M.SITE_KINDS))assert.ok(counts[k]>300,k+' '+counts[k]);
assert.equal(M.nearestSite(W,{x:0,y:0},null,6),null,'nothing near the origin (under 10 km)');
for(const [kind,km] of Object.entries(M.SITE_KINDS)){const s=M.nearestSite(W,{x:(km+1)*10000,y:0},kind);assert.ok(s&&s.kind===kind&&M.kmOf(s)>=km,kind);
 // Beyond its band it keeps appearing.
 const far=M.nearestSite(W,{x:-(km+20)*10000,y:15000},kind);assert.ok(far&&M.kmOf(far)>km+10,kind+' beyond');}
assert.ok(Array.from({length:30},(_,k)=>JSON.stringify(M.siteCell('otro',20+k,0))!==JSON.stringify(M.siteCell(W,20+k,0))).filter(Boolean).length>10,'each world has its own');
// --- faded region: four embers inside it; lit by a pulse on time with sound, by passing without
const dead=M.nearestSite(W,{x:110000,y:0},'apagada'),embers=M.embersOf(dead);
assert.equal(embers.length,4);for(const e of embers){const d=Math.hypot(e.x-dead.x,e.y-dead.y);assert.ok(d>=M.EMBER_MIN-1&&d<=M.EMBER_MAX+1&&d<M.DEAD_R);}
const e0=embers[0];
assert.equal(M.emberLit(e0,{x:e0.x,y:e0.y},[],true),null,'with sound, passing alone is not enough');
assert.equal(M.emberLit(e0,{x:e0.x,y:e0.y},[{x:e0.x,y:e0.y,beat:false}],true),null,'a pulse off time does nothing');
assert.deepEqual(M.emberLit(e0,{x:0,y:0},[{x:e0.x+50,y:e0.y,beat:true}],true),{onTime:true});
assert.deepEqual(M.emberLit(e0,{x:e0.x+20,y:e0.y},[],false),{onTime:false},'without sound, passing');
assert.ok(M.DEAD_DUCK<.4&&M.DEAD_DUCK>.2,'the music about 10 dB lower');
let q=M.normalizeLejosB(undefined);assert.equal(q.version,1);
for(const k of [0,1,2])assert.deepEqual(M.lightEmber(q,dead,k,{day:'2026-11-04',biome:'lago'}),{lit:k+1,revived:false});
assert.equal(M.lightEmber(q,dead,1,{}),null,'once each');assert.ok(!M.revived(q,dead.id));
assert.deepEqual(M.lightEmber(q,dead,3,{day:'2026-11-04'}),{lit:4,revived:true});assert.ok(M.revived(q,dead.id));assert.equal(q.dead[dead.id].b,'lago');
assert.equal(M.lightEmber(q,dead,0,{}),null,'revived for good');
assert.equal(M.reviveReward(dead.x,dead.y,false),8);assert.equal(M.reviveReward(dead.x,dead.y,true),11);assert.equal(M.reviveReward(250000,0,true),15);
// --- habitat: its recipe of two or three elements, the creature, it knows you when you come back
const hab=M.nearestSite(W,{x:130000,y:0},'habitat'),recipe=M.recipeOf(hab),els=M.elementsOf(hab);
assert.ok(recipe.length>=2&&recipe.length<=3&&recipe.every(e=>M.ELEMENTS.includes(e)));assert.deepEqual(els.map(e=>e.el),[...recipe]);
for(const e of els){const d=Math.hypot(e.x-hab.x,e.y-hab.y);assert.ok(d>=M.ELEMENT_MIN-1&&d<=M.ELEMENT_MAX+1);}
assert.equal(M.placeElement(q,hab,'nada',''),null);
recipe.forEach((el,k)=>{const r=M.placeElement(q,hab,el,'2026-11-04');assert.equal(r.placed,k+1);assert.equal(r.done,k===recipe.length-1);});
assert.ok(M.habitatDone(q,hab.id));assert.equal(q.habitats[hab.id].c,M.creatureOf(recipe));assert.ok(M.CREATURES.includes(q.habitats[hab.id].c));
assert.deepEqual(M.greet(q,hab.id,'2026-11-05'),{visits:1,creature:q.habitats[hab.id].c});assert.equal(M.greet(q,hab.id,'').visits,2);
assert.equal(new Set(M.RECIPES.map(M.creatureOf)).size,4,'one creature per recipe');
assert.ok(M.habitatReward(hab.x,hab.y,false)>=8&&M.habitatReward(hab.x,hab.y,true)<=15);
// --- the song of the sky: four stones, the phrase, in order and on time; a wrong stone starts again
const song=M.nearestSite(W,{x:160000,y:0},'cancion'),stones=M.stonesOf(song),phrase=M.phraseOf(song);
assert.equal(stones.length,4);assert.equal(phrase.length,4);assert.ok(M.SKY_EFFECTS.includes(M.effectOf(song)));
for(const s of stones)assert.ok(Math.abs(Math.hypot(s.x-song.x,s.y-song.y)-M.STONE_R)<2);
const at=(k,beat=true)=>[{x:stones[k].x,y:stones[k].y,beat}];
assert.equal(M.songStep(stones,0,{x:0,y:0},at(0),true),'next');assert.equal(M.songStep(stones,1,{x:0,y:0},at(3),true),'wrong','another stone');
assert.equal(M.songStep(stones,1,{x:0,y:0},at(1,false),true),'wrong','off time');assert.equal(M.songStep(stones,1,{x:0,y:0},[{x:song.x+5000,y:song.y,beat:true}],true),null,'far away: nothing');
assert.equal(M.songStep(stones,2,stones[2],[],false),'next','without sound: passing in order');assert.equal(M.songStep(stones,2,stones[1],[],false),null,'still on the last one');
assert.equal(M.songStep(stones,2,stones[0],[],false),'wrong');
const sung=M.singSong(q,song,'2026-11-04');assert.equal(sung.first,true);assert.equal(q.effects[sung.effect],1);assert.equal(M.singSong(q,song,'').first,false,'pays once per site');
assert.equal(M.SONG_SECONDS,60,'a minute');assert.equal(M.songReward(song.x,song.y,true),11);
// --- the postcard: five lost things in the stars; all five give the postcard (once per creature)
const post=M.nearestSite(W,{x:260000,y:0},'postal'),lost=M.lostOf(post);
assert.equal(lost.length,5);assert.deepEqual(lost.map(t=>t.name),[...M.LOST_THINGS]);for(const t of lost)assert.ok(Math.hypot(t.x-post.x,t.y-post.y)<=M.LOST_MAX+1);
assert.ok(M.postalStars(post).length>=200,'a dense patch of stars');assert.ok(M.POSTAL_CREATURES.includes(M.postalCreatureOf(post)));
for(const k of [0,1,2,3]){const r=M.findLost(q,post,k,'2026-11-04');assert.equal(r.found,k+1);assert.equal(r.done,false);}
const card=M.findLost(q,post,4,'2026-11-04');assert.deepEqual(card,{found:5,done:true,card:true,creature:M.postalCreatureOf(post)});assert.ok(M.postalDone(q,post.id));
assert.equal(M.findLost(q,post,4,''),null);
// --- the fusion: opened at 20 km; fixed by the pair, either order; in the album; in the scale
const album=normalizeAlbum({sounds:{'llanura:grillo':{first:'2026-11-01',count:1},'lago:ballena':{first:'2026-11-01',count:1}}});
assert.equal(M.makeFusion(q,album,'llanura:grillo','lago:ballena','2026-11-04'),null,'closed before 20 km');
assert.equal(M.openFusion(q,19.9,'x'),false);assert.equal(M.openFusion(q,20.1,'2026-11-04'),true);assert.equal(M.openFusion(q,30,''),false,'once');
const id=M.fusionId('llanura:grillo','lago:ballena');assert.equal(id,M.fusionId('lago:ballena','llanura:grillo'),'either order');assert.equal(M.fusionId('lago:ballena','lago:ballena'),null);
const f=M.fusedSound(id);assert.ok(f&&M.FUSION_NAMES.includes(f.name)&&f.motif.length>=2&&f.motif.length<=5);assert.deepEqual(M.fusedSound(id),f,'fixed by the pair');
assert.ok(['kalimba','choir'].includes(f.inst));assert.equal(f.steps.length,f.motif.length);assert.ok(f.steps.every(s=>s>=0&&s<=7));
const scale=[0,2,3,5,7,8,10];for(const d of f.motif){const note=soundNote(scale,57,d,f.oct),pc=((note-57)%12+12)%12;assert.ok(scale.includes(pc),'in the harmony: '+note);}
assert.equal(M.fusedSound('fusion:lago:ballena+llanura:grillo').id,id);assert.equal(M.fusedSound('fusion:llanura:grillo+lago:ballena'),null,'only sorted ids');
assert.equal(M.makeFusion(q,album,'llanura:grillo','lago:pez',''),null,'only sounds of your album');
const made=M.makeFusion(q,album,'lago:ballena','llanura:grillo','2026-11-04');assert.equal(made.id,id);assert.ok(album.sounds[id].fusion);assert.equal(q.fusion.made[id],'2026-11-04');
assert.equal(M.makeFusion(q,album,'llanura:grillo','lago:ballena',''),null,'once per pair');assert.deepEqual(M.fusedIn(album).map(s=>s.id),[id]);
const again=normalizeAlbum(structuredClone(album));assert.ok(again.sounds[id],'the album keeps a fused sound');again.mix=[id];assert.deepEqual(normalizeAlbum(again).mix,[id],'and it can be in your mix');
const names=new Set();for(let a=0;a<SOUNDS.length;a++)for(let b=a+1;b<SOUNDS.length;b++){const s=M.fusedSound(M.fusionId(SOUNDS[a].id,SOUNDS[b].id));assert.ok(s,'every pair');names.add(s.name);}
assert.equal(names.size,M.FUSION_NAMES.length,'all the names are used');
// --- the pages, nothing of the rest
assert.deepEqual(M.lejosPages(M.normalizeLejosB({})),[]);assert.deepEqual(M.lejosPages(q),['apagada','habitat','cancion','fusion','postal']);
// --- the save: migration, unknown fields kept, a later version only read, bad rows dropped
const old=M.normalizeLejosB({extra:{a:1},dead:{'lejos:w:1,2':{lit:[0,0,9,'x',2],done:'2026-11-04',x:1,y:2,b:'lago',mine:true},'__proto__':{x:1,y:1},bad:{lit:[1]}},habitats:{h:{placed:['roca','roca','oro'],c:'Gato',x:1,y:1,visits:-3}},
 songs:{s:{n:2.5}},effects:{aurora:3,otro:1},fusion:{open:'nunca',made:{'fusion:lago:ballena+llanura:grillo':'2026-11-04','x':'1'}},postals:{p:{found:[0,0,7],c:'Pulpo de nebulosa',done:''}},cards:{'Pulpo de nebulosa':'2026-11-04',Gato:'x'},earned:-1});
assert.deepEqual(old.extra,{a:1});assert.deepEqual(old.dead['lejos:w:1,2'].lit,[0,2]);assert.equal(old.dead['lejos:w:1,2'].mine,true);assert.ok(!old.dead.bad);
assert.deepEqual(old.habitats.h.placed,['roca']);assert.equal(old.habitats.h.c,'');assert.equal(old.habitats.h.visits,0);assert.equal(old.songs.s.n,0);assert.equal(old.effects.aurora,3);assert.equal(old.effects.otro,1);
assert.equal(old.fusion.open,'');assert.deepEqual(Object.keys(old.fusion.made),['fusion:lago:ballena+llanura:grillo']);assert.deepEqual(old.postals.p.found,[0]);assert.deepEqual(Object.keys(old.cards),['Pulpo de nebulosa']);assert.equal(old.earned,0);
const future=M.normalizeLejosB({version:9,dead:{x:1}});assert.equal(future.version,9);assert.ok(future.readOnly);assert.equal(M.lightEmber(future,dead,0,{}),null,'a later version is never written');assert.equal(M.openFusion(future,30,''),false);
assert.deepEqual(M.normalizeLejosB(JSON.parse(JSON.stringify(q))),q,'stable');
// --- English
for(const k of ['Región apagada','Pasa por sus brasas y pulsa a tiempo','Pasa por sus brasas','Región revivida','Regiones revividas','Brasa','Hábitat','Hábitats','{} vive aquí','Te reconoce','Un nido vacío','Trae lo que falta. Pasa por ello.',
 'Canción del cielo','Cuatro piedras','Tócalas en orden, a tiempo','Pásalas en orden','Otra vez desde la primera','Aurora','Lluvia de estrellas','Nebulosa','{} perdió cinco cosas','{} perdió cinco cosas. Búscalas entre las estrellas.','Postal','Gracias por encontrar mis cosas.',
 'Fusión de sonidos','Fusionar','Elige dos sonidos de tu álbum. Juntos dan uno nuevo.','Ya en tu álbum','Fusiones','Lejos del origen','Más allá de 10 km hay cosas nuevas. Sigue.',...M.FUSION_NAMES,...M.CREATURES,...M.POSTAL_CREATURES,...M.LOST_THINGS,'Roca','Agua','Luz'])assert.ok(EN[k],k);
// --- no random numbers, sparks only by the universe's rule and only in the open universe, the music untouched
const src=read('src/lejos-b.js')+read('src/lejos-b-model.js');
assert.ok(!/Math\.random|runtime\.rng|r\.rng|\brnd\(/.test(src),'no random number');assert.ok(!/fetch\(|XMLHttpRequest|localStorage/.test(src),'no network, no storage of its own');
assert.equal((read('src/lejos-b.js').match(/creditSparks\(/g)||[]).length,1,'one place pays');assert.ok(/universeReward\(/.test(read('src/lejos-b-model.js')));
for(const fn of ['reviveReward','habitatReward','songReward'])assert.ok(read('src/lejos-b.js').includes(fn+'('),fn);
assert.ok(!/pay\([^)]*(findLost|makeFusion|openFusion)/.test(read('src/lejos-b.js')),'the postcard and the fusion pay nothing');
assert.ok(M.LEJOS_GAIN<=.02&&M.LEJOS_HINT_GAIN<=.012&&M.LEJOS_HUM_GAIN<=.012,'as quiet as the album of sounds');
assert.ok(!read('src/audio.js').includes('lejos')&&!read('src/audio.js').includes('DEAD_DUCK'),'audio.js untouched');assert.ok(read('src/lejos-b.js').includes('r.musicDuck=DEAD_DUCK'),'the grey region uses runtime.musicDuck');
// --- wiring
const sw=read('sw.js');for(const m of ['"./src/lejos-b.js"','"./src/lejos-b-model.js"'])assert.equal(sw.split(m).length-1,1,m);
assert.ok(read('src/main.js').includes("import {initialize as lejosB} from './lejos-b.js';")&&read('src/main.js').includes('lejosB(runtime);'));
const render=read('src/render.js');for(const h of ['runtime.lejosBTick?.(dt,modal)','runtime.drawLejosB?.()'])assert.ok(render.includes(h),h);
for(const f of ['src/live-encounters.js','src/sky-map.js','src/descubrir.js','src/recorrer.js','src/secretos-cielo.js'])assert.ok(read(f).includes('r.lejosBBusy?.()'),'one scene at a time: '+f);
{const g=read('src/lejos-b.js');assert.ok(g.includes("r.bandAttach?.(id,{line:lines[id],...(id==='region-apagada'?{busy}:{})})")&&g.includes("r.bandBusy?.('B')"),'B attaches its scene and lines to the bands and waits for the other batches');assert.ok(read('src/viaje-a.js').includes("r.bandBusy?.('A')"),'A waits for the other batches');}
assert.ok(read('src/universe-map.js').includes('runtime.lejosBForMap?.()')&&read('src/journal.js').includes('runtime.lejosBSection?.()'));
assert.ok(read('src/descubrir.js').includes('r.fusedSound?.(sound)')&&read('src/descubrir.js').includes('r.fusedAlbum?.()'));
const html=read('index.html');for(const id of ['houseFusion','mSoundFusion','soundFusionList','soundFusionMake','soundFusionClose','soundFusionNote','soundFusionCount'])assert.equal(html.split(`id="${id}"`).length-1,1,id);
console.log('PASS lejos del origen (tanda B): faded regions from 10 km, habitats from 12, sky songs from 15, the fusion at 20 and postcards from 25, fixed by hashKey and beyond their band; embers on time or passing, creatures that know you, four notes in order, fusions fixed by the pair and in the scale, five lost things; rewards by the universe rule, none for the special; save and migration; English; no random numbers; wiring');
