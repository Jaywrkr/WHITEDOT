import assert from 'node:assert/strict';
import {normalizeRareBook,storeRareCard,cardAbility,learnCardEncounter,nextCardTechnique} from '../src/rare-card-model.js';
import {normalizeHouse} from '../src/house-model.js';
const raw={version:8,items:[{type:'future:voice',id:'untouched',secret:{won:true}}],other:{earned:1}};
const future=normalizeRareBook(raw);assert.equal(future.version,8);assert.deepEqual(future.items,raw.items);assert.deepEqual(future.other,raw.other);assert.equal(storeRareCard(future,{id:'new'}),'readonly');
const old=normalizeRareBook({version:1,items:raw.items,extra:'keep'});assert.equal(old.extra,'keep');assert.equal(old.unrecognizedItems[0].id,'untouched');assert.equal(normalizeRareBook(old).unrecognizedItems.length,1);
assert.equal(cardAbility({type:'fossil'}).role,'perc');assert.equal(cardAbility({type:'living:deer',context:{role:'bajo'}}).name,'Cuerpo');
assert.deepEqual(normalizeHouse({objects:[{kind:'future:object',value:19}]}).objects,[{kind:'future:object',value:19}]);
console.log('PASS unknown collection/house ownership survives normalization, future books stay read-only and abilities describe actual musical roles');

const card={type:'living:deer',context:{role:'bajo'}};
assert(learnCardEncounter(card,{phase:'amanecer'}));assert(!learnCardEncounter(card,{phase:'amanecer'}));assert(learnCardEncounter(card,{phase:'noche'}));assert(learnCardEncounter(card,{phase:'noche',weather:'lluvia'}));assert.deepEqual(card.learning.techniques,['normal','muted','slide']);assert.equal(nextCardTechnique(card),'muted');assert.equal(nextCardTechnique(card),'slide');assert.equal(nextCardTechnique(card),'normal');
const futureLearning={type:'fossil',learning:{version:9,future:'won'}};assert(!learnCardEncounter(futureLearning,{}));assert.equal(futureLearning.learning.future,'won');
