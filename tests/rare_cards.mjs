import assert from 'node:assert/strict';
import {RARE_CARDS,RARE_BOOK_LIMIT,rareDefinition,rarityLabel,cardKey,makeRareCard,normalizeRareBook,storeRareCard,cardSerial} from '../src/rare-card-model.js';
import {worldIdentity} from '../src/world-identity.js';import {encodePlace,decodePlace} from '../src/share-tools.js';import {rarePortrait} from '../src/rare-card-art.js';
import {RHYTHM_EMPTY_CHANCE,FOSSIL_DENOMINATOR} from '../src/percussion-model.js';import {RELIC_RATE,MAGICAL_RELIC_RATE} from '../src/relics.js';import {NATURAL_BOX_RATE,POWER_IDS} from '../src/expansion-music.js';
assert.equal(Object.keys(RARE_CARDS).length,72);assert.equal(rareDefinition('bad'),null);assert.equal(rareDefinition('__proto__'),null);
assert.equal(rareDefinition('fossil').probability,RHYTHM_EMPTY_CHANCE/FOSSIL_DENOMINATOR);assert.equal(rarityLabel('fossil'),'≈1/640 sectores de tierra');
assert.equal(rareDefinition('relic:ordinary').probability,RELIC_RATE-MAGICAL_RELIC_RATE);assert.equal(rareDefinition('relic:magical').probability,MAGICAL_RELIC_RATE);
assert.equal(rareDefinition('anomaly:canon').probability,1/750);assert.equal(rareDefinition('anomaly:espejo').probability,1/2400);assert.equal(rareDefinition('anomaly:luna').probability,1/6000);
assert.equal(rareDefinition('box:brujula').probability,NATURAL_BOX_RATE/POWER_IDS.length);assert.equal(rareDefinition('petbox:grulla').probability,1/128);
assert.equal(rareDefinition('living:moth').probability,null);assert.equal(rareDefinition('living:moth').variantProbability,1/256);assert.equal(rareDefinition('living:bridge').probability,1/32);assert.equal(rareDefinition('living:whale').probability,1/32);
assert.match(rareDefinition('living:moth').condition,/frecuencia conjunta no está medida/);assert.match(rarityLabel('living:moth'),/territorio sin medir/);
const world=worldIdentity('lugar-ñ','vasto',2),raw={type:'fossil',sourceId:'rhythm:fossil:v1:-12,34',world,address:{...world,x:-10850,y:30611,layer:'superficie'},regionName:'<img src=x>',genre:'ambient',firstSeen:'2026-10-14T12:04:22.000Z',day:'2026-10-14',artVariant:100,forced:true},card=makeRareCard(raw);
assert.equal(card.name,'Fósil de ritmo');assert(Math.abs(card.odds.probability-1/640)<1e-12);
const historic=normalizeRareBook({items:[{...card,name:'Fósil recordado',odds:{...card.odds,probability:1/900}}]}).items[0];assert.equal(historic.name,'Fósil recordado');assert.equal(rarityLabel(historic.type,historic.odds),'≈1/900 sectores de tierra','recorded odds survive normalization');
assert(card&&card.forced&&card.artVariant===4);assert.equal(card.address.x,-10850);assert.deepEqual(decodePlace(encodePlace(card.address,'Fósil')).address,card.address);
assert.equal(makeRareCard({...raw,world:{...world,generatorVersion:99}}),null);assert.equal(makeRareCard({...raw,address:{...raw.address,seed:'otro'}}),null);assert.equal(makeRareCard({...raw,address:{...raw.address,x:1e12}}),null);
assert.equal(makeRareCard({...raw,firstSeen:'2026-02-30T00:00:00Z'}).firstSeen,null);assert.equal(makeRareCard({...raw,sourceId:''}),null);
const duplicate={...raw,id:'not-trusted'},book=normalizeRareBook({items:[card,duplicate,{type:'bad'},null]});assert.equal(book.items.length,1);assert.equal(book.items[0].id,card.id);
assert.equal(storeRareCard(book,card),'duplicate');assert.equal(storeRareCard(book,makeRareCard({...raw,sourceId:'another'})),'added');
const other=makeRareCard({...raw,world:{...world,seed:'otro'},address:{...raw.address,seed:'otro'}});assert.notEqual(other.id,card.id,'same source id in another seed is another card');
const overflow=normalizeRareBook({items:Array.from({length:600},(_,i)=>makeRareCard({...raw,sourceId:'source-'+i}))});assert.equal(overflow.items.length,600,'existing valid cards survive a lower admission limit');assert.equal(storeRareCard(overflow,other),'full');assert.equal(overflow.items.length,600);
const unknown=makeRareCard({...raw,address:null,legacy:true});assert.equal(unknown.precision,'unknown');assert(unknown.legacy);
assert.equal(cardSerial(card.id).length,8);assert.equal(cardKey(card.type,card.sourceId,world),card.id);
for(const type of Object.keys(RARE_CARDS)){const art=rarePortrait({type,artVariant:11});assert(art.includes('<svg')&&art.includes('rare-glyph'));assert(!art.includes('<img'));assert(!art.includes('http'));}
console.log('PASS 72 rare card types with sourced conditional odds, place-code roundtrip, invalid-save normalization, encounter/seed dedupe, bounded book and original safe portraits');

const living=makeRareCard({...raw,type:'living:relation',context:{phase:'noche',weather:'calma'}});assert.equal(living.odds.probability,null);assert.match(rarityLabel(living.type,living.odds),/sin estimar/);assert.deepEqual(normalizeRareBook({items:[living]}).items[0].context,living.context);
const restored=normalizeRareBook({items:[card],unrecognizedItems:[{...raw,type:'living:lantern-bug',sourceId:'old:archived'}, {type:'future:rare',won:1},{type:'future:rare',won:1}]});assert.equal(restored.items.length,2);assert.equal(restored.items[1].type,'living:lantern-bug');assert.deepEqual(restored.unrecognizedItems,[{type:'future:rare',won:1}]);assert.deepEqual(normalizeRareBook(restored),restored,'recovery remains stable across reloads');

const futureAddressCard={...raw,world:{...world,generatorVersion:99},address:null};const futureArchived=normalizeRareBook({items:[futureAddressCard]});assert.equal(futureArchived.items.length,0);assert.deepEqual(futureArchived.unrecognizedItems,[futureAddressCard]);assert.deepEqual(normalizeRareBook(futureArchived),futureArchived,'a future world schema stays recoverable even for a known card type');
import {queueRareNotice} from '../src/rare-card-model.js';
const waiting=[],notice=(tier,n)=>({card:{id:String(n),odds:{tier}}});for(let i=0;i<4;i++)queueRareNotice(waiting,notice('raro',i));queueRareNotice(waiting,notice('mitico',9));assert.equal(waiting.length,4);assert.equal(waiting[0].card.id,'9');queueRareNotice(waiting,notice('raro',10));assert.equal(waiting[0].card.id,'9','routine arrivals cannot displace a pending exceptional finding');
