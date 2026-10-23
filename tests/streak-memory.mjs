import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {initialize as data} from '../src/data.js';
// Decision 5A: the streak stops punishing. Days you came back only add up (S.totalDays); missing a day takes nothing
// from the World, and the habit and discipline phrases are gone. Saved streak and best stay as they are.
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8'),src=readdirSync(new URL('../src/',import.meta.url)).filter(f=>f.endsWith('.js')).map(f=>[f,read('src/'+f)]);
for(const [f,s] of src)for(const bad of ['Disciplina','Sin atajos','No fallé','Hoy también','Constancia','Compite con ayer','La mayoría no llega','Es hábito','Fallaste','sin fallar','con o sin racha'])assert(!s.includes(bad),f+': '+bad);
const render=read('src/render.js');assert(!/shownStreak\(\)/.test(render),'the World radius does not follow the streak');assert(/Math\.min\(runtime\.S\.totalDays\|\|0,30\)/.test(render));
const progress=read('src/progress.js');assert(/lampMax\(\)\{return Math\.min\(60,10\+\(S\.totalDays\|\|0\)\)\*60;\}/.test(progress));assert(/streak:0,best:0/.test(progress),'the saved fields are kept');
const html=read('index.html');for(const id of ['streak','cStreak','oStreak','kStreak'])assert(html.includes(`id="${id}"`),id+' keeps its id');assert(!/>Racha</.test(html)&&!/RACHA/.test(html),'shown as days, not a streak');
const d={};globalThis.document={getElementById:()=>({}),querySelectorAll:()=>[],addEventListener(){}};data(d);assert.equal(d.ECOS.length,34,'old stars keep pointing at a phrase');
console.log('PASS streak as memory: the World radius and the lamp follow the days you came back, no discipline phrases, saved streak and HTML ids kept, every star still has its phrase');
