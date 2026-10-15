import assert from 'node:assert/strict';import {normalizeFavorites,storeFavorite,FAVORITE_LIMIT} from '../src/favorites.js';
const s={},base={name:'Mi lugar',x:-123.5,y:444,layer:'superficie',created:1,genre:'dub',scale:[0,2,3,5,7,8,10]};
const first=storeFavorite(s,base);assert(first);assert.equal(s.favorites.version,1);assert.equal(first.x,-123.5);
const same=storeFavorite(s,{...base,name:'Nuevo nombre',x:-124,created:2});assert.equal(same.id,first.id);assert.equal(s.favorites.items.length,1);
const lower=storeFavorite(s,{...base,layer:'bajo'});assert.notEqual(lower.id,first.id);
assert.deepEqual(normalizeFavorites(JSON.parse(JSON.stringify(s.favorites))),s.favorites);
const future={...first,address:{...first.address,generatorVersion:2}},normalized=normalizeFavorites({items:[future]});assert.deepEqual(normalized.items[0].address,future.address);assert.deepEqual(normalizeFavorites(JSON.parse(JSON.stringify(normalized))),normalized,'future addresses must not become legacy favorites on repeated normalization');
assert.equal(normalizeFavorites({items:[{...first,address:null}]}).items[0].address,null);
const invalid=normalizeFavorites({items:[{id:'a',layer:'superficie',x:NaN,y:1},{id:'b',layer:'unknown',x:1,y:1},{...first,name:'x'.repeat(100)},first]});assert.equal(invalid.items.length,1);assert.equal(invalid.items[0].name.length,60);
for(let i=s.favorites.items.length;i<FAVORITE_LIMIT;i++)assert(storeFavorite(s,{...base,x:i*100,created:10+i}));assert.equal(storeFavorite(s,{...base,x:99999,created:100}),null);
const larger=normalizeFavorites({items:Array.from({length:80},(_,i)=>({...first,id:'old:'+i,x:i*100}))});assert.equal(larger.items.length,80,'a new admission cap never truncates existing saved places');
console.log('PASS: persistent named coordinates, layer distinction, local deduplication, safe normalization and bounded favorite list');

const worlds={worldIdentity:first.address};const a=storeFavorite(worlds,{...base,address:first.address}),b=storeFavorite(worlds,{...base,address:{...first.address,seed:'otro'}});assert.notEqual(a.id,b.id);assert.equal(normalizeFavorites(worlds.favorites).items.length,2,'simultaneous foreign places never share an ID');
assert.equal(normalizeFavorites({items:[{...first,x:null},first]}).items.length,1,'invalid duplicate cannot shadow a later valid place');
