import assert from 'node:assert/strict';
import {labArrangement,LAB_BANDS} from '../src/lab-score.js';
import {supportedMusic,placeAddress,worldIdentity} from '../src/world-identity.js';
import {encodePlace,decodePlace} from '../src/share-tools.js';
import {normalizeFavorites} from '../src/favorites.js';
import {musicalDistance} from '../src/memory-model.js';
const score={...LAB_BANDS[0],variant:3,leads:['silkpluck','lowbow','duskpad'],bassI:'reedbass'},frame={phrase:0,section:2,bass:Array(16).fill(0),hook:Array(16).fill(-1),identity:{air:.5},grammar:{hookLimit:4,brightness:7000,hookLevel:1},expression:{toneScale:1,attackScale:1}};
const scenes=new Set(),voices=new Set();for(let chapter=0;chapter<6;chapter++){const a=labArrangement({...frame,harmonyBar:chapter*16},score);scenes.add(a.labEvolution.scene);voices.add(a.hookI);assert.equal(a.labScore.id,score.id);assert.equal(a.bassI,score.bassI);assert(a.grammar.brightness<=score.ceiling);if(chapter===5)assert(a.hook.every(n=>n<0));}
assert.equal(scenes.size,6);assert.equal(voices.size,3);assert(labArrangement(frame,score,{initiative:.8}).labEvolution.quiet);
const identity=worldIdentity('memory','wide',2),address=placeAddress({...identity,musicVersion:1,musicMode:'classic'},-154.2,912.7);
const result=decodePlace(encodePlace(address,'Recuerdo')).address;assert.equal(result.musicMode,'classic');assert.equal(result.musicVersion,1);assert.equal(result.x,-154);assert.equal(result.y,913);assert(supportedMusic(result));
const old=placeAddress(identity,1,2);assert(supportedMusic(old));assert.deepEqual(decodePlace(encodePlace(old)).address,old);
const future={...address,musicVersion:7},point={id:'a',name:'Future',...future,address:future};assert(!supportedMusic(future));assert.throws(()=>encodePlace(future));assert.equal(normalizeFavorites({items:[point]},identity).items[0].address.musicVersion,7);
assert(musicalDistance({band:'silk',palette:'a',rhythm:'a'},{band:'heavy',palette:'b',rhythm:'b'})>=7);
console.log('PASS six evolving sections, changed orchestration, quiet response, legacy/current music addresses and future metadata preservation');
