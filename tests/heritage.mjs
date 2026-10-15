import assert from 'node:assert/strict';
import {CULTURE_IDS} from '../src/culture-model.js';
import {culturalResidents,culturalResonators,heritageVoice,relicVoice} from '../src/heritage.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);
const pairs=new Set(),roles=new Set(),instruments=new Set();
for(const culture of CULTURE_IDS){const site={id:'sanctuary:2,4',key:'2,4',x:50,y:100,culture},a=culturalResidents(site,r.seedOf);assert.deepEqual(a,culturalResidents(site,r.seedOf));assert.equal(a.length,2);assert.deepEqual(a.map(o=>o.group),['flora','fauna']);assert(a.every(o=>Math.hypot(o.x-site.x,o.y-site.y)<110&&!o.rare));pairs.add(a.map(o=>o.kind).join('|'));
 for(let earned=0;earned<=3;earned++){const echoes=culturalResonators(site,earned);assert.equal(echoes.length,earned);echoes.forEach(o=>{const v=heritageVoice(o.voice);assert(v);roles.add(v.role);});}}
assert(pairs.size>=7);assert.equal(roles.size,3);assert.equal(heritageVoice('heritage:bad:0'),null);
for(let i=0;i<128;i++){const source={id:'site:v1:'+i+',0'},v=relicVoice({key:'0,0'},source,r.seedOf);assert.deepEqual(v,relicVoice({key:'0,0'},source,r.seedOf));roles.add(v.role);instruments.add(v.instrument);assert(v.low<v.high&&v.high<=67);}
assert.equal(roles.size,4);assert(instruments.has('feltpiano')&&instruments.has('silkstrings')&&instruments.has('airflute'));
console.log('PASS coherent sanctuary flora/fauna, three earned resonators, four deterministic relic roles, low/mid instrumental range and unchanged source seeds');
