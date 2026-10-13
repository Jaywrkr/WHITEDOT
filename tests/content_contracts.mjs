import assert from 'node:assert/strict';
import {foundationContent,contentVariant} from '../src/content-contracts.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};globalThis.location={search:''};const r={};data(r);progress(r);world(r);const directory=r.contentDirectory;
assert(directory.get('flora'));assert(directory.get('trail:musical'));assert(directory.get('encounter:animal'));assert(directory.get('encounter:box').name==='Suelo resonante');const d=directory.get('installation:glass'),before=contentVariant(d,'4,7','llanura',r.seedOf,r.rng),region=JSON.stringify(r.regionOfPos(1800,1800));
directory.register({id:'future:strings',name:'Cuerdas',kind:'installation',biomes:['llanura'],actions:['stretch'],materials:['wood'],roles:['bass'],rarity:.15,cell:'region'});
assert.deepEqual(contentVariant(d,'4,7','llanura',r.seedOf,r.rng),before);assert.equal(JSON.stringify(r.regionOfPos(1800,1800)),region);assert.equal(contentVariant(directory.get('future:strings'),'4,7','cueva',r.seedOf,r.rng),null);
assert.throws(()=>directory.register({...d}));assert.throws(()=>directory.register({...d,id:'bad',roles:['high-only']}));assert.throws(()=>directory.register({...d,id:'bad',rarity:2}));
console.log('PASS: unified versioned content contracts, guarded compatibility/rarity, independent streams and unchanged legacy worlds');
