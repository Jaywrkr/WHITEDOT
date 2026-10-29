// Ganas de volver (alpha.236) · racha suave: each played day lights a star in the Refugio's sky; days in a row share a
// thread; missing a day takes nothing away; milestones go to the Bitácora; no sparks; saves migrate without loss.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SKY_STREAK_VERSION,RUN_MARKS,TOTAL_MARKS,normalizeSkyStreak,skyLit,aliveRun,recordDay,skyCaption,skyLayout,skyCard,markText,SKY_TAP,diffDays} from '../src/sky-streak.js';
const fresh=()=>normalizeSkyStreak(undefined,{});
// A new game: nothing lit, the next step said.
{const s=fresh();assert.equal(s.version,SKY_STREAK_VERSION);assert.equal(skyLit(s),0);assert.equal(skyCaption(s,'2026-10-29'),'Juega hoy y se enciende una estrella.');assert.equal(skyCard(s),'');}
// Three days in a row: three stars on one thread, a milestone on the third.
{const s=fresh();assert.deepEqual(recordDay(s,'2026-10-27'),[]);recordDay(s,'2026-10-28');const got=recordDay(s,'2026-10-29');
 assert.deepEqual(got,['run:3']);assert.equal(skyLit(s),3);assert.equal(s.run,3);assert.equal(aliveRun(s,'2026-10-29'),3);
 assert.equal(skyCaption(s,'2026-10-29'),'Hito: 3 días seguidos');assert.equal(skyCaption(s,'2026-10-30'),'3 estrellas · 3 días seguidos','yesterday still counts');
 // The same day twice, or a clock gone back, changes nothing.
 assert.deepEqual(recordDay(s,'2026-10-29'),[]);assert.deepEqual(recordDay(s,'2026-10-20'),[]);assert.equal(skyLit(s),3);
 // A missed day: the stars stay, the old thread is kept, a new one starts. No sad words.
 assert.equal(aliveRun(s,'2026-10-31'),0);const cap=skyCaption(s,'2026-10-31');assert.equal(cap,'3 estrellas');assert.ok(!/perd|rot|0 días|lástima|vuelve a empezar/i.test(cap));
 recordDay(s,'2026-11-01');assert.equal(skyLit(s),4,'nothing is lost');assert.deepEqual(s.runs,[3]);assert.equal(s.run,1);assert.equal(s.best,3);
 assert.equal(skyCaption(s,'2026-11-01'),'4 estrellas');
 const lay=skyLayout(s,{x:0,y:0,w:300,h:40});assert.equal(lay.stars.length,4);assert.equal(lay.lines.length,2,'the old run keeps its two threads; a lone day has none');
 assert.ok(lay.stars.at(-1).newest&&lay.stars.at(-1).current);assert.ok(lay.stars.slice(0,3).every(p=>!p.current));
 // Positions depend only on the star's number: tomorrow's star never moves today's.
 recordDay(s,'2026-11-02');const next=skyLayout(s,{x:0,y:0,w:300,h:40});for(let i=0;i<4;i++){assert.equal(next.stars[i].x,lay.stars[i].x);assert.equal(next.stars[i].y,lay.stars[i].y);}
 assert.equal(next.lines.length,3);}
// Milestones: runs and totals, once each, with their day; the Bitácora card lists them.
{const s=fresh();let day=Date.UTC(2026,0,1);const key=ms=>new Date(ms).toISOString().slice(0,10);const all=[];
 for(let i=0;i<31;i++){all.push(...recordDay(s,key(day)));day+=864e5;}
 assert.deepEqual(all,['run:3','run:7','total:10','run:14','run:30','total:30']);
 assert.equal(s.marks['run:7'],'2026-01-07');assert.equal(s.marks['total:10'],'2026-01-10');
 const card=skyCard(s);assert.match(card,/Cielo del Refugio/);assert.match(card,/31 estrellas · la racha más larga, 31 días/);assert.match(card,/<p>Hitos<\/p>/);assert.match(card,/7 ene · 7 días seguidos|7 ene\. · 7 días seguidos/);
 assert.equal(markText('total:100'),'100 estrellas');}
// Migration: a save from before alpha.236 lights every day it already played; the current run keeps its thread.
{const old={totalDays:9,streak:4,best:6,lastDay:'2026-10-28'},s=normalizeSkyStreak(undefined,old);
 assert.equal(skyLit(s),9);assert.equal(s.run,4);assert.equal(s.loose,5);assert.equal(s.best,6);assert.equal(s.lastDay,'2026-10-28');
 // The next day carries the run on; a day already counted is not counted twice.
 assert.deepEqual(recordDay(s,'2026-10-28'),[]);recordDay(s,'2026-10-29');assert.equal(s.run,5);assert.equal(skyLit(s),10);assert.ok(s.marks['total:10']);
 // Broken or odd data is cleaned without losing what is valid; unknown fields are kept.
 const odd=normalizeSkyStreak({version:1,loose:-3,runs:[2,'x',0,5],run:2,lastDay:'ayer',marks:{'run:3':'2026-10-01',bad:'x','total:10':5},extra:{keep:true}});
 assert.equal(odd.loose,0);assert.deepEqual(odd.runs,[2,5]);assert.equal(odd.run,0,'no valid day, no live run');assert.deepEqual(odd.marks,{'run:3':'2026-10-01'});assert.deepEqual(odd.extra,{keep:true});assert.equal(odd.best,5);
 // A future version is only read.
 const future={version:SKY_STREAK_VERSION+1,whatever:1};assert.equal(normalizeSkyStreak(future),future);assert.deepEqual(recordDay(future,'2026-10-29'),[]);assert.equal(skyLit(future),0);assert.equal(skyCard(future),'');}
// Long histories: the latest rows stay in view, the count says all.
{const s=fresh();let day=Date.UTC(2025,0,1);for(let i=0;i<400;i++){recordDay(s,new Date(day).toISOString().slice(0,10));day+=(i%5===4?2:1)*864e5;}
 assert.equal(skyLit(s),400);const lay=skyLayout(s,{x:0,y:0,w:280,h:90});assert.ok(lay.stars.length<=lay.cols*lay.rows&&lay.stars.length>0);assert.equal(lay.stars.at(-1).i,399);assert.ok(lay.hidden>0);
 assert.ok(lay.stars.every(p=>p.x>=0&&p.x<=280&&p.y>=0&&p.y<=90),'inside the strip');
 assert.ok(s.runs.length<=400);assert.equal(diffDays('2026-10-28','2026-11-02'),5);}
assert.equal(SKY_TAP,'Cada día que juegas enciende una estrella. Si faltas, se quedan.');
assert.deepEqual([...RUN_MARKS],[3,7,14,30,60,100,365]);assert.deepEqual([...TOTAL_MARKS],[10,30,100,365]);
// No sparks: the module never touches the economy (lo especial no paga chispas).
const src=readFileSync(new URL('../src/sky-streak.js',import.meta.url),'utf8');
assert.ok(!/spark|chispa|✦|Math\.random|runtime\.rng\(/i.test(src.replace(/\/\/.*$/gm,'')),'no sparks and no random sequence');
// Wired once: main initializes it, the offline shell lists it once, the Refugio draws it and the Bitácora shows its card.
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8'),sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8'),house=readFileSync(new URL('../src/house.js',import.meta.url),'utf8'),journal=readFileSync(new URL('../src/journal.js',import.meta.url),'utf8');
assert.equal(sw.split('"./src/sky-streak.js"').length,2);assert.match(main,/skyStreak\(runtime\)/);assert.match(house,/drawRefugioSky\?\.\(/);assert.match(house,/refugioSkyLook\?\.\(/);assert.match(journal,/skyStreakCard\?\.\(\)/);
console.log('PASS sky streak: a star per played day, threads for days in a row, nothing lost on a missed day, milestones in the Bitácora, stable positions, migration from the old day counter, no sparks');
