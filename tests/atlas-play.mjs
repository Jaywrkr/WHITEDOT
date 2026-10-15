import assert from 'node:assert/strict';
import {normalizeAtlas,startAtlas,resolveAtlas} from '../src/atlas-model.js';
const a=normalizeAtlas({other:{won:1}}),card={id:'card',sourceId:'from',name:'Madera',address:{layer:'superficie'},context:{role:'bajo'}};
assert(startAtlas(a,card));assert.equal(a.active.role,'perc');assert.equal(resolveAtlas(a,{id:'from'},'perc','superficie'),null);assert.equal(resolveAtlas(a,{id:'next'},'bajo','superficie'),null);assert.equal(resolveAtlas(a,{id:'next'},'perc','cielo'),null);assert(resolveAtlas(a,{id:'next',x:1,y:2,name:'Piedra'},'perc','superficie'));assert.equal(a.completed.length,1);assert.equal(a.other.won,1);assert(startAtlas(a,card));resolveAtlas(a,{id:'next'},'perc','superficie');assert.equal(a.completed.length,1);assert(!startAtlas(normalizeAtlas({version:9,completed:[]}),card));
console.log('PASS complementary-role expeditions require an actual different source/layer, deduplicate and preserve future progress');
