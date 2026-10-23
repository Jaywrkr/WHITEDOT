import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {NARRATOR_LINES,NARRATOR_ACHIEVEMENTS,roundAchievements,narratorLine,initialize} from '../src/narrator.js';
// Every line belongs to an achievement that exists, old or new; nothing earned is renamed.
const data=readFileSync(new URL('../src/data.js',import.meta.url),'utf8'),legacy=new Set([...data.matchAll(/\["([A-Za-z0-9_]+)","/g)].map(m=>m[1])),fresh=new Set(NARRATOR_ACHIEVEMENTS.map(a=>a[0]));
for(const id of Object.keys(NARRATOR_LINES))assert(legacy.has(id)||fresh.has(id),'a line for '+id);
for(const a of NARRATOR_ACHIEVEMENTS){assert(!legacy.has(a[0]),'new ids never reuse an old one: '+a[0]);assert(NARRATOR_LINES[a[0]],'each new one has its line');}
// Short lines: one or two sentences, never more than twenty words.
for(const [id,line] of Object.entries(NARRATOR_LINES))assert(line.split(/\s+/).length<=20&&line.split(/[.?!]\s/).length<=4,'short: '+id);
assert(Object.keys(NARRATOR_LINES).length>=60&&NARRATOR_ACHIEVEMENTS.length>=20);
// What a round earns.
const base={fresh:[true,false,false],stars:[true,false,false],onTime:.7,ms:150000,roundsToday:0,record:true,roundsBefore:0,sound:true};
assert.deepEqual(roundAchievements(base,{stars:6}),['lugarEstrella']);
assert.deepEqual(roundAchievements({...base,stars:[true,true,true],onTime:1,ms:90000,roundsToday:3,roundsBefore:2,sound:true},{stars:20,maestros:5,places:['lago','bosque','vacio'],hour:2}).sort(),
 ['estrellas10','estrellas20','lugarEstrella','lugarInquilino','lugarMaestro','lugarMaestro5','lugarNoche','lugarPerfecto','lugarRapido','lugarRecord','lugarRitmo','lugarTres'].sort());
assert(roundAchievements({...base,onTime:.3,ms:400000,sound:false}).includes('lugarCasi')&&roundAchievements({...base,sound:false}).includes('lugarValiente')&&roundAchievements({...base,ms:400000}).includes('lugarLento'));
assert(!roundAchievements({...base,onTime:1,sound:false}).includes('lugarPerfecto'),'perfect asks for sound');
// Runtime: new ones join the list once, their voice replaces the old one, events unlock them.
const unlocked=[];const r={S:{ach:{},todayKey:'2026-10-23'},ACH:[['dia1','Día 1','x']],VOZ:{dia1:'old'},unlock:id=>{unlocked.push(id);r.S.ach[id]=1;},placesData:()=>({stars:{lago:[true,false,false]},best:{lago:{rounds:1}},seen:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}})};
initialize(r);const again={...r,ACH:r.ACH};delete again.narrate;delete again.narrateRound;delete again.narratorLine;initialize(again);assert.equal(r.ACH.length,1+NARRATOR_ACHIEVEMENTS.length,'added once');assert.equal(r.VOZ.dia1,NARRATOR_LINES.dia1);assert.equal(narratorLine('nada'),null);
r.narrate('locked');r.narrate('portal');for(let i=0;i<10;i++)r.narrate('travel');for(let i=0;i<4;i++)r.narrate('song');assert(!unlocked.includes('cancionFan'));r.narrate('song');
assert.deepEqual(unlocked,['portalCerrado','portales5','viajeRapido10','cancionFan']);
r.narrateRound({...base,id:'lago'});assert(unlocked.includes('lugarEstrella'));
console.log('PASS narrator: every line belongs to an achievement, nothing earned is renamed, short lines, a round earns what it should, events unlock once');
