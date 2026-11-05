import assert from 'node:assert/strict';
import {nextUnlock,nextLine} from '../src/refugio-lugares.js';
import {normalizePlaces,PLACE_IDS} from '../src/places.js';
// The Refugio says what comes next on the path (plan H3): the next place to play, and the first closed one with the place
// to complete before it.
const journey={finished:true,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}},p=normalizePlaces(null,journey);
assert.equal(nextUnlock(p,journey),null,'alpha.264: every place open after the Journey');
assert.equal(nextLine(p,journey),'Siguiente: Jardín. Está más lejos, a 8 km.','not found yet: its distance');p.found.jardin={x:1,y:2};assert.equal(nextLine(p,journey),'Siguiente: Jardín.');
const three=normalizePlaces({stars:{llanura:[true],lago:[true],bosque:[true]}},{finished:true,done:{}});assert.equal(nextLine(three,{finished:true,done:{}}),'Siguiente: Tormenta. Está más lejos, a 3 km.');
const eleven=normalizePlaces({stars:Object.fromEntries(PLACE_IDS.map(id=>[id,[true]]))},journey);assert.equal(nextLine(eleven,journey),'Tu canción está completa. 22 ★ para la versión maestra.');
const all=normalizePlaces({stars:Object.fromEntries(PLACE_IDS.map(id=>[id,[true,true,true]]))},journey);
assert.equal(nextLine(all,journey),'Las 33 ★. La versión maestra de tu canción.');
console.log('PASS refugio lugares: the next place on the path and the one to complete before a closed place, the song once the eleven are complete, the master version with 33');
