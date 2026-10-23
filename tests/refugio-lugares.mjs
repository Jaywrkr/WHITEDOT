import assert from 'node:assert/strict';
import {nextUnlock,nextLine} from '../src/refugio-lugares.js';
import {normalizePlaces} from '../src/places.js';
// The Refugio says what comes next: the first closed place and the stars it still asks for.
const journey={finished:true,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}},p=normalizePlaces(null,journey);
assert.deepEqual(nextUnlock(p,journey),{id:'jardin',name:'Jardín',need:5,missing:0,ready:true},'five ★ from the Journey: the Jardín has its stars but no game yet');
assert.equal(nextLine(p,journey),'Jardín llega pronto. Ya tienes sus 5 ★.');
const three=normalizePlaces({stars:{llanura:[true],lago:[true],bosque:[true]}},{finished:true,done:{}});assert.equal(nextLine(three,{finished:true,done:{}}),'Jardín se abre con 5 ★. Faltan 2.');
const all=normalizePlaces({stars:Object.fromEntries(['llanura','lago','bosque','tormenta','vacio','jardin','dunas','cristales','faros','ruinas','cueva'].map(id=>[id,[true,true,true]]))},journey);
assert.equal(nextLine(all,journey),'Las 33 ★. Tu canción está completa.');
console.log('PASS refugio lugares: the next place to open and the stars it still asks, the song once all 33 are won');
