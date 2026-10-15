import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {EXPANDED_LIVING,EXTRA_RHYTHMS,EXTRA_STRIKES} from '../src/expanded-content.js';
import {expandedChunk,expandedRhythm,ecoregionAt} from '../src/ecoregions.js';
import {LIVING_CATALOG,livingChunk} from '../src/living-catalog.js';
import {RHYTHM_ELEMENTS,createRhythmElements} from '../src/percussion-model.js';
import {STRIKE_BODIES} from '../src/percussion-material.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);assert.equal(LIVING_CATALOG.length,48);assert.equal(EXPANDED_LIVING.length,20);assert.equal(Object.keys(RHYTHM_ELEMENTS).length,21);assert.equal(Object.keys(STRIKE_BODIES).length,21);const found=new Set(),percs=new Set(),ecos=new Set();
for(let x=-100;x<=100;x++)for(let y=-25;y<=25;y++){const d=r.regionOfPos((x+.5)*900,(y+.5)*900),b=r.BIOMES[d.z].id,base=livingChunk(x,y,900,d,b,r.seedOf,r.rng),before=JSON.stringify(base),extra=expandedChunk(x,y,900,d,b,base,r.seedOf,r.rng);assert.equal(JSON.stringify(base),before);assert(extra.length<=1);for(const o of extra){assert(o.id.startsWith('living:expansion:v1:'));assert(o.homeX===o.x&&o.homeY===o.y);found.add(o.kind);}const rhythm=createRhythmElements(x,y,900,d,r.seedOf,r.rng),e=expandedRhythm(x,y,900,d,b,rhythm,r.seedOf,r.rng);assert(!rhythm.length||!e.length);for(const o of e)percs.add(o.kind);ecos.add(ecoregionAt(d,b,r.seedOf).id);}
assert(found.size>=15,found.size);assert(percs.size>=10,percs.size);assert(ecos.size>=18,ecos.size);console.log('PASS additive ecology sample: '+found.size+' new lineages, '+percs.size+' acoustic bodies, '+ecos.size+' territorial profiles; old streams untouched');
