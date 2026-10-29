// Descubrir (alpha.240): rumors that point at something real, the album of sounds (five rare sounds per biome, placed with
// hashKey), the mix of up to four, the rewards by the universe's rule and the visible prize of a complete series; the
// saves migrate, keep unknown fields and leave a future version alone; no old random numbers, no humans, English for all.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const random=Math.random;Math.random=()=>{throw Error('Descubrir must not use Math.random');};
const M=await import('../src/descubrir-model.js');
const {SOUNDS,SOUND_BIOMES,SOUND_BIOME_NAMES,SOUND_CELL,SOUND_SHARE,MIX_MAX,RUMOR_OPEN_MAX,RUMOR_VERSION,ALBUM_VERSION,RUMOR_FIGURE_SAY,RUMOR_LANDMARK_SAY,RUMOR_DIRECTIONS,
 soundById,biomeSounds,soundCell,soundsAround,soundWeight,soundPick,soundNote,soundSay,soundReward,normalizeRumors,normalizeAlbum,albumHas,albumCount,seriesProgress,keepSound,toggleMix,
 rumorDue,rumorFor,rumorArrived,rumorNow,directionWord,worldKey,SOUND_SING_GAIN,SOUND_KEEP_GAIN,SOUND_MIX_GAIN}=M;
const {INSTRUMENT_SPECS}=await import('../src/instruments.js');
const {skyCell,skyFigure}=await import('../src/sky-map-model.js');
const {LEVEL_SPARKS,UNIVERSE_BASE,RARITY,universeReward}=await import('../src/spark-rules.js');
const {EN}=await import('../src/i18n-en.js');
const {PLACE_IDS}=await import('../src/places.js');
const {hashKey}=await import('../src/universe-regions.js');
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
// ---------- the catalogue ----------
assert.equal(SOUNDS.length,55);assert.deepEqual([...SOUND_BIOMES].sort(),[...PLACE_IDS].sort());
for(const b of SOUND_BIOMES){const list=biomeSounds(b);assert.equal(list.length,5,b);assert.deepEqual(list.map(s=>s.n),[0,1,2,3,4]);assert.ok(EN[SOUND_BIOME_NAMES[b]],b);}
assert.equal(new Set(SOUNDS.map(s=>s.id)).size,55);assert.equal(new Set(SOUNDS.map(s=>s.name)).size,55,'every name its own');
const HUMAN=/\b(persona|gente|hombre|mujer|niñ[oa]|alguien|viajer[oa]|pastor|pescador|explorador|habitante|vecin[oa]|músicos?|cantante)\b/i;
for(const s of SOUNDS){assert.ok(INSTRUMENT_SPECS[s.inst],'instrument '+s.inst);assert.ok(M.SOUND_TRIM[s.inst]>0&&M.SOUND_TRIM[s.inst]<=1,'trim '+s.inst);assert.equal(s.motif.length,s.steps.length,s.id);assert.ok(s.motif.length>=2&&s.motif.length<=5,s.id);
 assert.ok(s.steps.every((k,i)=>Number.isInteger(k)&&k>=0&&k<8&&(i===0||k>s.steps[i-1])),s.id);assert.ok([-1,0,1].includes(s.oct));
 assert.ok(!HUMAN.test(s.name)&&!HUMAN.test(s.a),s.id);assert.ok(s.name.length<=22,s.name);
 assert.ok(EN[s.name],'English for '+s.name);assert.ok(EN[s.a],'English for '+s.a);assert.ok(EN[s.say+' {}'],'English for '+s.say);assert.equal(soundById(s.id),s);}
// Under the music: as quiet as the living encounters' and the sky's notes, never louder.
assert.ok(SOUND_SING_GAIN<=.012&&SOUND_KEEP_GAIN<=.02&&SOUND_MIX_GAIN<=.012&&MIX_MAX===4);
// Notes stay in the scale and in range.
{const scale=[0,2,4,5,7,9,11];for(const s of SOUNDS)for(const d of s.motif){const n=soundNote(scale,57,d,s.oct);assert.ok(n>=36&&n<=96,n);assert.ok(scale.includes(((n-57)%12+12)%12),[s.id,d,n]);}}
// ---------- placement: hashKey only, the same every time, one in about six cells ----------
const under=(x,y)=>({biome:SOUND_BIOMES[Math.floor(hashKey('biome:'+Math.floor(x/3600)+','+Math.floor(y/3600))*11)],region:null});
{let n=0,far5=0,near5=0;const total=4000;for(let i=0;i<total;i++){const a=soundCell('w1',i%80-40,Math.floor(i/80)-25,under),b=soundCell('w1',i%80-40,Math.floor(i/80)-25,under);assert.deepEqual(a,b);if(!a)continue;n++;
  assert.equal(a.biome,under(a.x,a.y).biome,'a sound of the biome it is in');assert.equal(soundById(a.sound).biome,a.biome);
  const cx=(i%80-40)*SOUND_CELL,cy=(Math.floor(i/80)-25)*SOUND_CELL;assert.ok(a.x>=cx+SOUND_CELL*.2-1e-6&&a.x<=cx+SOUND_CELL*.8+1e-6&&a.y>=cy+SOUND_CELL*.2-1e-6&&a.y<=cy+SOUND_CELL*.8+1e-6,'off the edges');}
 const share=n/total;assert.ok(Math.abs(share-SOUND_SHARE)<.03,share);}
// The fifth of a series is rare near the origin and common from 20 km; the fourth from 5 km.
assert.ok(soundWeight(4,1)<.2&&soundWeight(4,25)>=1&&soundWeight(3,1)<soundWeight(3,6)&&soundWeight(0,0)===1);
{let five=0;for(let i=0;i<2000;i++)if(soundPick('lago',1,i/2000).n===4)five++;assert.ok(five>0&&five<2000*.04,five);let far=0;for(let i=0;i<2000;i++)if(soundPick('lago',30,i/2000).n===4)far++;assert.ok(far>2000*.18,far);}
assert.ok(soundsAround('w1',{x:0,y:0},20000,under).every(s=>Math.hypot(s.x,s.y)<=20000));
// ---------- rewards: the universe's rule, never a level ----------
assert.equal(LEVEL_SPARKS,0);
assert.equal(soundReward({first:true}),universeReward(UNIVERSE_BASE.live,{rarity:RARITY.rare}));assert.equal(soundReward({first:true}),8);assert.equal(soundReward({first:true,onTime:true}),11);
assert.equal(soundReward({first:true,x:600000}),23,'far, three times as much');assert.equal(soundReward({first:false}),1);assert.equal(soundReward({first:false,onTime:true}),2);assert.equal(soundReward({first:false,x:600000}),3);
// ---------- the album save ----------
{const q=normalizeAlbum(undefined);assert.deepEqual(q,{version:ALBUM_VERSION,sounds:{},spots:[],series:{},mix:[],wear:{},earned:0});
 const old=normalizeAlbum({sounds:{'lago:pez':{first:'2026-10-29',count:2,onTime:5,x:1},'bad':5,['__proto__']:{}},spots:['a','a','b',7],series:{lago:'2026-10-29'},mix:['lago:pez','lago:ola','lago:pez'],other:9});
 assert.equal(old.other,9);assert.equal(old.sounds['lago:pez'].onTime,2);assert.equal(old.sounds['lago:pez'].x,1);assert.ok(!old.sounds.bad);assert.deepEqual(old.spots,['a','b']);assert.deepEqual(old.mix,['lago:pez'],'only sounds you have, once');assert.equal(old.wear.ring,true);
 const future={version:ALBUM_VERSION+1,sounds:5};assert.equal(normalizeAlbum(future),future);assert.equal(keepSound(future,{id:'s',sound:'lago:pez'}),null);assert.equal(toggleMix(future,'lago:pez'),false);
 assert.equal(normalizeAlbum({spots:Array.from({length:900},(_,i)=>'s'+i)}).spots.length,400);}
// Keeping: new, the same spot again (nothing), another spot of a sound you have (repeat), the series complete.
{const q=normalizeAlbum({}),lago=biomeSounds('lago');let r=keepSound(q,{id:'sp1',sound:lago[0].id},{day:'d1'});assert.ok(r.first&&!r.series);assert.equal(keepSound(q,{id:'sp1',sound:lago[0].id}),null,'a spot once');
 r=keepSound(q,{id:'sp2',sound:lago[0].id},{onTime:true});assert.ok(!r.first);assert.equal(q.sounds[lago[0].id].count,2);assert.equal(q.sounds[lago[0].id].onTime,1);
 for(let i=1;i<4;i++)assert.ok(!keepSound(q,{id:'x'+i,sound:lago[i].id},{day:'d2'}).series);assert.deepEqual(seriesProgress(q,'lago'),{done:4,total:5});
 r=keepSound(q,{id:'x4',sound:lago[4].id},{day:'d3'});assert.equal(r.series,'lago');assert.equal(q.series.lago,'d3');assert.equal(q.wear.ring,true);assert.equal(albumCount(q),5);
 // The mix: only sounds you have, at most four, a second tap takes one out.
 assert.equal(toggleMix(q,'bosque:buho'),false);for(let i=0;i<4;i++)assert.ok(toggleMix(q,lago[i].id));assert.equal(toggleMix(q,lago[4].id),false,'four at most');assert.ok(toggleMix(q,lago[0].id));assert.deepEqual(q.mix,[lago[1].id,lago[2].id,lago[3].id]);
 assert.deepEqual(normalizeAlbum(JSON.parse(JSON.stringify(q))),q,'a kept album reads back the same');}
// ---------- rumors ----------
{const q=normalizeRumors(undefined);assert.deepEqual(q,{version:RUMOR_VERSION,open:[],done:[],n:0,given:0});
 const row=i=>({id:'rumor:'+i,kind:'sound',key:'k'+i,name:'N',text:'Dicen que…',x:i,y:0,at:'d'});
 const old=normalizeRumors({open:[row(1),row(2),{id:'x'},row(3),row(4)],done:[{...row(9),done:'d2'}],n:4,given:3,extra:1});assert.equal(old.open.length,3);assert.equal(old.open[0].id,'rumor:2');assert.equal(old.done[0].done,'d2');assert.equal(old.extra,1);
 const future={version:RUMOR_VERSION+1,open:'?'};assert.equal(normalizeRumors(future),future);assert.equal(rumorDue(future,'w'),false);
 // The first one always comes; then about one in two; never with three open.
 assert.equal(rumorDue({...q,n:0},'w'),true);let yes=0;for(let n=1;n<400;n++)if(rumorDue({...q,n},'w'))yes++;assert.ok(yes>120&&yes<240,yes);
 assert.equal(rumorDue({...q,n:0,open:[row(1),row(2),row(3)]},'w'),false);assert.equal(RUMOR_OPEN_MAX,3);}
// Where a rumor points: always something real, at the distance and in the direction it says.
const world=worldKey({seed:7});
const landmarkAt=(rx,ry)=>hashKey('lm:'+rx+','+ry)<.1?{id:'lm:'+rx+','+ry,type:['torre','arbol','ciudad','monolito'][Math.floor(hashKey('t:'+rx+','+ry)*4)],x:(rx+.5)*3600,y:(ry+.5)*3600}:null;
const anomalyAt=(rx,ry)=>{const u=hashKey('an:'+rx+','+ry);return u<.03?{tier:u<.004?'mitico':u<.012?'legendario':'raro',name:'Frenesí',rumor:'la música va demasiado rápido'}:null;};
const look={under,landmarkAt,anomalyAt,RP:3600};
const kinds={};
for(let n=0;n<120;n++){const from={x:(n%7-3)*9000,y:(n%5-2)*9000},r=rumorFor(from,world,n,look);kinds[r.kind]=(kinds[r.kind]||0)+1;
 const km=Math.max(1,Math.round(Math.hypot(r.x-from.x,r.y-from.y)/10000)),dir=directionWord(from,r);assert.equal(r.text,`Dicen que ${dir}, a ${km} km, ${r.what}.`);assert.ok(RUMOR_DIRECTIONS.includes(dir));
 assert.ok(km>=1&&km<=56,km);assert.ok(r.text.length<=90,r.text);assert.ok(!HUMAN.test(r.text),r.text);
 // Real: re-read the world at that point.
 if(r.kind==='figure'){const [i,j]=r.key.split(':').at(-1).split(',').map(Number),s=skyCell(world,i,j,under,{night:false});assert.ok(s&&s.id===r.key&&Math.round(s.x)===r.x&&s.fig===r.fig,r);}
 else if(r.kind==='sound'){const [i,j]=r.key.split(':').at(-1).split(',').map(Number),s=soundCell(world,i,j,under);assert.ok(s&&s.sound===r.sound&&Math.round(s.x)===r.x,r);assert.ok(r.what===soundSay(soundById(r.sound)));}
 else if(r.kind==='landmark'){const [rx,ry]=r.key.slice(3).split(',').map(Number);assert.ok(landmarkAt(rx,ry)&&Math.round(landmarkAt(rx,ry).x)===r.x);assert.equal(r.what,RUMOR_LANDMARK_SAY[r.type]);}
 else if(r.kind==='rare'){const [rx,ry]=r.key.slice(5).split(',').map(Number);assert.ok(anomalyAt(rx,ry));}
 else assert.equal(r.kind,'region');
 assert.equal(rumorFor(from,world,n,look).text,r.text,'the same rumor for the same count');}
assert.ok(kinds.sound&&kinds.landmark&&kinds.figure,JSON.stringify(kinds));
// Far from the origin, rare things first: from 50 km, a legend or a rarity when one is near.
{let rare=0;for(let n=0;n<40;n++){const r=rumorFor({x:620000,y:0},world,n,look);if(r.kind==='rare'||(r.kind==='figure'&&(skyFigure(r.fig).km>=20||skyFigure(r.fig).legend)))rare++;}assert.ok(rare>=30,rare);}
// What you have is skipped: a skip of every key leaves the biome, which is always there.
{const r=rumorFor({x:0,y:0},world,3,{...look,skip:()=>true});assert.equal(r.kind,'region');assert.match(r.text,/^Dicen que al [a-z]+, a \d+ km, se extiende (el|la|los|las) [A-ZÁÉÍÓÚ]/);}
// Arriving fulfils; the Bitácora says where it is now.
{const r={x:50000,y:0,kind:'sound'};assert.ok(!rumorArrived(r,{x:0,y:0}));assert.ok(rumorArrived(r,{x:49000,y:0}));assert.ok(rumorArrived({x:0,y:2000,kind:'region'},{x:0,y:0}));
 assert.equal(rumorNow(r,{x:0,y:0}),'al este, a 5 km');assert.equal(rumorNow({x:0,y:-6000},{x:0,y:0}),'al norte, a 600 m');assert.equal(rumorNow(r,{x:49500,y:0}),'aquí');}
// English for every phrase a rumor can say.
for(const k of ['Dicen que {}, a {} km, {}.','brillan las estrellas de {}','se extiende {}',...Object.values(RUMOR_FIGURE_SAY),...Object.values(RUMOR_LANDMARK_SAY)])assert.ok(EN[k],'English for '+k);
// ---------- wiring ----------
const sw=read('sw.js');for(const m of ['"./src/descubrir.js"','"./src/descubrir-model.js"'])assert.equal(sw.split(m).length-1,1,m);
const main=read('src/main.js');assert.match(main,/import \{initialize as descubrir\} from '\.\/descubrir\.js';/);assert.match(main,/universeLetter\(runtime\);descubrir\(runtime\);/);
const render=read('src/render.js');for(const h of ['runtime.discoverTick?.(dt,modal)','runtime.drawDiscover?.()','runtime.drawSoundRing?.('])assert.ok(render.includes(h),h);
const html=read('index.html');for(const id of ['mSoundAlbum','soundAlbumList','soundMixPlay','soundMixNote','soundAlbumClose','soundAlbumCount','cubeSoundSection','cubeSoundOptions'])assert.equal(html.split(`id="${id}"`).length-1,1,id);
assert.ok(read('src/journal.js').includes("runtime.discoverSection?.()"));
const umap=read('src/universe-map.js');assert.ok(umap.includes('runtime.rumorsForMap?.()')&&umap.includes("case 'rumor':")&&umap.includes('setMapMark'));assert.ok(read('src/universe-map-art.js').includes("case 'rumor':"));
const code=read('src/descubrir.js')+read('src/descubrir-model.js');assert.ok(!/Math\.random|runtime\.rng|\brnd\(/.test(code),'hashKey only');
Math.random=random;
console.log('PASS Descubrir: 55 sounds (5 per biome) placed with hashKey in their biome, rarer far ones, notes in the scale far under the music; rewards by the universe rule (8 ✦ a new sound, 1 a repeat, none in a level); album and rumor saves migrate and keep a future version; rumors point at a real figure, sound, landmark, rarity or biome at the distance and direction they say, rare far away, three at most, arriving fulfils; English for all; wired once');
