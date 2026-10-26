import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {validateSave} from '../src/save-store.js';
import {worldIdentity} from '../src/world-identity.js';
import {HOUSE_ROOMS,HOUSE_ROOM_RULE,normalizeHouse,roomAsks} from '../src/house-model.js';
// Panel 10 (P8 · Menos contadores, D3 = A + B).
const id=worldIdentity(),load=v=>validateSave(v,{journal:{music:{}},studio:{}},id);
// D3-B: an old house keeps every room the days-or-achievements rule had opened; the new rule never reads days.
{const s=load({totalDays:14,ach:{},house:{version:2,objects:[],unlocked:['sala']}});assert.deepEqual(s.house.unlocked,['sala','jardin','azotea','sotano'],'14 days kept all four rooms');assert.equal(s.house.roomRule,HOUSE_ROOM_RULE);
 const again=normalizeHouse(s.house,{places:5,stars:5});assert.deepEqual(again.unlocked,['sala','jardin','azotea','sotano'],'the migrated rooms stay open under the new rule');}
{const ach=Object.fromEntries(Array.from({length:20},(_,i)=>['a'+i,'2026-01-01']));const s=load({totalDays:1,ach,house:{unlocked:['sala']}});assert.deepEqual(s.house.unlocked,['sala','jardin','azotea'],'20 achievements kept the Cielo');}
{const s=load({totalDays:30,ach:{},house:{version:2,unlocked:['sala'],roomRule:2}});assert.deepEqual(s.house.unlocked,['sala'],'a migrated house never opens rooms by days again');}
{const future={version:9,unlocked:['sala'],rooms3d:{a:1}};const s=load({totalDays:30,house:future});assert.deepEqual(s.house,future,'a newer house is kept untouched');}
{const s=load({totalDays:30});assert.equal(s.house,undefined,'no house is invented');}
{const s=load({totalDays:3,ach:{},house:{unlocked:['sala'],objects:[{kind:'obj:origen',room:'sala',x:.5,y:.5}],decor:[{id:'deco:x',room:'sala',x:.1,y:.1}]}});assert.equal(s.house.objects.length,1);assert.equal(s.house.decor.length,1,'nothing placed is lost');assert.deepEqual(s.house.unlocked,['sala','jardin']);}
// No room mentions days; each asks places or ★.
for(const r of HOUSE_ROOMS.slice(1)){assert.doesNotMatch(roomAsks(r),/d[ií]as/);assert.match(roomAsks(r),/^\d+ lugares o \d+ ★$/);}
const house=readFileSync(new URL('../src/house.js',import.meta.url),'utf8');assert.doesNotMatch(house,/d[ií]as o /,'no room label asks days');
// D3-A: one ★. The relics (S.stars) are «Reliquias»; «Estrellas», ★ and ESTRELLA never sit beside them.
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const files=readdirSync(new URL('../src/',import.meta.url)).filter(f=>f.endsWith('.js')).map(f=>[f,readFileSync(new URL('../src/'+f,import.meta.url),'utf8')]);
for(const [f,text]of files)for(const line of text.split('\n'))if(/\bS\.stars\b/.test(line))assert.doesNotMatch(line,/Estrella|ESTRELLA|★/,f+': relics are not stars');
for(const k of ['kStars','oStars','starsN']){const near=html.slice(html.indexOf(`id="${k}"`)-80,html.indexOf(`id="${k}"`)+80);assert.doesNotMatch(near,/Estrellas|★/,k+' is a count of relics');assert.match(near,/Reliquias/);}
const ui=readFileSync(new URL('../src/ui.js',import.meta.url),'utf8');assert.doesNotMatch(ui,/\$\("starsN"\)/,'the HUD no longer writes the relic count');
// The full view's three numbers, and the counters the HUD no longer shows.
assert.match(html,/id="hudStars"/);assert.match(html,/id="hudPlaces"/);assert.match(ui,/"★ "\+starCount\(d\)\+"\/"\+TOTAL_STARS/);
const css=readFileSync(new URL('../styles/estilo-j.css',import.meta.url),'utf8');assert.match(css,/\.hud :is\(#day,#walkDistance,#elementCount,\.stats,#sparkGoal\)\{display:none!important\}/);
for(const id of ['day','era','walkDistance','elementCount','streak','starsN','size','sparkGoal','mRegions','mConts','mRecord','oStars','kStars','houseCount'])assert.match(html,new RegExp(`id="${id}"`),id+' keeps its id');
// At most one achievement per notice.
const ach=readFileSync(new URL('../src/achievements.js',import.meta.url),'utf8');assert.doesNotMatch(ach,/\.length\+' logros/,'never a count of achievements in a notice');assert.match(ach,/'✦ Logro · '\+escape/);
console.log('PASS fewer counters: old houses keep their rooms, rooms by places or ★, one ★ (relics are Reliquias), three numbers in the HUD, one achievement per notice');
