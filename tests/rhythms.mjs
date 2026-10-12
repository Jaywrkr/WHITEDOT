import assert from 'node:assert/strict';
import {RHYTHM_GENRES,FAMILIES,familyOf,rhythmPattern} from '../src/rhythms.js';
import {REFERENCE_GENRES,referenceRhythm} from '../src/references.js';
import {INSTRUMENTS} from '../src/journal.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {buildAtlas} from '../src/atlas.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const ids=Object.keys(RHYTHM_GENRES);
assert(ids.length>=18,'first batch has at least 18 rhythms');
const FIELDS=new Set(['kick','snare','clap','clapRoll','rim','hat','hatO','hatRoll','conga','tom','cowbell','shaker','chord']);
const patterns=new Set(Object.keys(REFERENCE_GENRES).map(id=>JSON.stringify(referenceRhythm(id,0))));
for(const id of ids){
 const g=RHYTHM_GENRES[id];
 assert(r.GEN[id],`${id} missing from GEN`);assert(FAMILIES[g.family],`${id}: unknown family`);
 assert(g.bpm[0]<=g.bpm[1]&&g.bpm[0]>=60&&g.bpm[1]<=180,`${id}: tempo`);
 assert(g.guide&&g.guide.length>30,`${id}: guide text for the Bitácora`);
 for(const inst of [...g.bassP,...g.hookP,...g.percP])assert(INSTRUMENTS[inst],`${id}: instrument without explanation ${inst}`);
 assert(g.bassP.includes(g.bassI));
 assert.equal(g.bass.length,16);assert.equal(g.bass[0],0,`${id}: bass starts on the root`);
 assert(g.bass.every(n=>n===-1||(n>=0&&n<=9)));
 assert(g.steps.includes(0)&&g.steps.length>=4,`${id}: melodic recipe too thin`);
 for(let v=0;v<3;v++){const p=rhythmPattern(id,v);assert(p.kick?.length,`${id}: no kick`);
  for(const [field,steps]of Object.entries(p)){assert(FIELDS.has(field),`${id}: unknown drum field ${field}`);steps.forEach(s=>assert(Number.isInteger(s)&&s>=0&&s<16));}}
 const sig=JSON.stringify(rhythmPattern(id,0));assert(!patterns.has(sig),`${id}: drum pattern duplicates another style`);patterns.add(sig);
}
for(const id of Object.keys(r.GEN))assert(FAMILIES[familyOf(id)],`${id}: no family`);
// Reparto: todos alcanzables y sin estilos que acaparen el mundo.
const a=buildAtlas(r);assert.deepEqual(a.missing,[]);
const share=Object.fromEntries(a.list.map(e=>[e.id,e.count/a.total]));
for(const [id,s]of Object.entries(share)){
 if(id!=='ambient')assert(s<=.036,`${id} takes ${(s*100).toFixed(1)} % of the world`); // ambient también ocupa el Vacío
 assert(s>=.005,`${id} is too rare (${(s*100).toFixed(2)} %)`);
}
console.log(`PASS: ${ids.length} new rhythms with complete recipes, distinct drums, ${Object.keys(r.GEN).length} styles balanced (max ${(Math.max(...Object.entries(share).filter(([k])=>k!=='ambient').map(([,v])=>v))*100).toFixed(1)} %, min ${(Math.min(...Object.values(share))*100).toFixed(1)} %)`);
