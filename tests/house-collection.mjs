import assert from 'node:assert/strict';
import {galleryCards,trophyShelf,showcasePieces,visitors,GALLERY,SHOWCASES} from '../src/house-collection.js';
import {ACH_CATEGORIES} from '../src/achievement-metadata.js';
// Frames: rarest first, newest among equals, never more than the wall holds.
const cards=[{id:'a',odds:{tier:'raro'}},{id:'b',odds:{tier:'mitico'}},{id:'c',odds:{tier:'raro'}},{id:'d',odds:{tier:'singular'}},{id:'e'},{id:'f',odds:{tier:'legendario'}},null,{nope:1}];
assert.deepEqual(galleryCards(cards).map(c=>c.id),['b','f','d','c']);assert.equal(galleryCards(cards).length,GALLERY.length);assert.deepEqual(galleryCards(null),[]);
// Trophies: one per category, counted from the catalog, retired ones left out.
const catalog=[['a'],['b'],['c'],['d',0,0,1]],meta=a=>({a:{category:'Camino'},b:{category:'Camino'},c:{category:'Mundo',retired:true},d:{category:'Secretos'}})[a[0]];
const shelf=trophyShelf({a:true,d:true},catalog,meta);assert.equal(shelf.length,ACH_CATEGORIES.length);
assert.deepEqual(shelf.find(r=>r.category==='Camino'),{category:'Camino',earned:1,total:2});assert.deepEqual(shelf.find(r=>r.category==='Mundo'),{category:'Mundo',earned:0,total:0});assert.equal(shelf.find(r=>r.category==='Secretos').earned,1);
// Showcases: the latest real purchases, in the order they were bought.
const economy={purchases:{dust:'2026-10-01','acc:hat':true,'future:thing':true,'eyes:curious':'2026-10-02','pet:cloud':true,'body:dice':true,'motion:roll':true,'trail:comet':true,unbought:false}};
assert.deepEqual(showcasePieces(economy),['acc:hat','eyes:curious','pet:cloud','body:dice','motion:roll','trail:comet']);assert.equal(showcasePieces(economy).length,SHOWCASES.length);assert.deepEqual(showcasePieces({}),[]);
// Visitors: steady (by name), only real creatures, the pet first.
assert.deepEqual(visitors({turtle:true,moth:true,nope:true},null),['moth','turtle']);assert.deepEqual(visitors({moth:true},{species:'grulla'}),['pet:grulla','moth']);assert.deepEqual(visitors(null,null),[]);
console.log('PASS house collection: rarest frames, one trophy per category, latest showcases, steady visitors');
