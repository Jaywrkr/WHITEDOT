import assert from 'node:assert/strict';
import {HOUSE_OBJECTS,HOUSE_ROOMS,HOUSE_VERSION,normalizeHouse,placeHouseObject,encodeHouse,decodeHouse,houseStep,houseDegree} from '../src/house-model.js';
// Version 1 migrates without losing objects, rooms, position or unknown fields; the sequencer reads the same.
const v1={version:1,objects:[{kind:'obj:origen',room:'sala',x:.25,y:.75,wonMetadata:{a:1}},{kind:'future:thing',room:'patio',x:.1}],unlocked:['sala','jardin'],playerRoom:'jardin',x:.3,y:.6,visited:true,knownVisitors:{'pet:grulla':true},extra:{keep:true}};
const h=normalizeHouse(structuredClone(v1),0);
assert.equal(HOUSE_VERSION,2);assert.equal(h.version,2);assert.deepEqual(h.unlocked,['sala','jardin']);assert.equal(h.playerRoom,'jardin');assert.equal(h.visited,true);assert.deepEqual(h.extra,{keep:true});
assert.equal(h.objects.length,2);assert.deepEqual(h.objects[0].wonMetadata,{a:1});assert.equal(h.objects[1].kind,'future:thing','unknown earned objects stay');
assert.equal(houseStep(h.objects[0]),houseStep(v1.objects[0]));assert.equal(houseDegree(h.objects[0]),houseDegree(v1.objects[0]));
assert.deepEqual(h.decor,[]);assert.deepEqual(h.tints,{});assert.deepEqual(h.capsules,{count:0,items:{}});
assert.deepEqual(normalizeHouse(structuredClone(h)),h,'normalizing twice changes nothing');
// New fields are cleaned, never trusted.
const dirty=normalizeHouse({version:2,decor:[{id:'deco:lamp',room:'sala',x:9,y:-2},{id:'',room:'sala'},{id:'deco:future',room:'mirador',z:1},null,...Array.from({length:80},(_,i)=>({id:'d'+i,room:'sala'}))],tints:{'obj:origen':'#ABCDEF',bad:'red','__proto__':'#000000',x:'#12345'},capsules:{count:-3,items:{'deco:lamp':true,'':true},future:7}});
assert.equal(dirty.decor.length,60);assert.deepEqual(dirty.decor[0],{id:'deco:lamp',room:'sala',x:1,y:0});assert.deepEqual(dirty.decor[1],{id:'deco:future',room:'mirador',z:1},'decor for unknown rooms stays as it was');
assert.deepEqual(dirty.tints,{'obj:origen':'#abcdef'});assert.equal(dirty.capsules.count,0);assert.deepEqual(dirty.capsules.items,{'deco:lamp':true});assert.equal(dirty.capsules.future,7);
// Codes: objects only keeps WH1 for older versions; decor or colours use WH2; both decode.
assert.match(encodeHouse(h),/^WH1-/);const back=decodeHouse(encodeHouse(h));assert.deepEqual(back.objects,[{kind:'obj:origen',room:'sala',x:.25,y:.75}]);
const styled=normalizeHouse({...h,decor:[{id:'deco:lamp',room:'sala',x:.5,y:.2}],tints:{'obj:origen':'#f0d27a'}});const code=encodeHouse(styled);assert.match(code,/^WH2-/);
const visit=decodeHouse(code);assert.deepEqual(visit.decor,[{id:'deco:lamp',room:'sala',x:.5,y:.2}]);assert.deepEqual(visit.tints,{'obj:origen':'#f0d27a'});assert.equal(visit.version,2);
for(const bad of ['WH2-','WH2-'+btoa('{"v":1,"o":[]}'),'WH2-'+btoa(JSON.stringify({v:2,o:[],d:'x'})),'WH3-'+btoa('{}'),'WH2-'+btoa(JSON.stringify({v:2,o:[['obj:origen','sala',null,1]],d:[]}))])assert.throws(()=>decodeHouse(bad),undefined,bad);
// A newer house stays exactly as it was and opens read-only.
const future={version:3,objects:[{kind:'x',room:'y'}],rooms3d:{a:1}};const kept=normalizeHouse(future);assert.equal(kept.readOnly,true);assert.equal(kept.version,3);assert.deepEqual(kept.rooms3d,{a:1});assert.throws(()=>encodeHouse(kept));assert(!placeHouseObject(kept,'obj:origen','sala',.5,.5));
// Size: a full house with all objects, decor and colours stays small inside the save.
const full=normalizeHouse({objects:HOUSE_OBJECTS.map((d,i)=>({kind:d.id,room:HOUSE_ROOMS[i%4].id,x:i/40,y:.5})),unlocked:HOUSE_ROOMS.map(r=>r.id),decor:Array.from({length:60},(_,i)=>({id:'deco:'+i,room:'sala',x:.5,y:.5})),tints:Object.fromEntries(HOUSE_OBJECTS.map(d=>[d.id,'#ffffff'])),capsules:{count:999,items:Object.fromEntries(Array.from({length:60},(_,i)=>['deco:'+i,true]))}},14);
assert(JSON.stringify(full).length<50000,JSON.stringify(full).length);assert(encodeHouse(full).length<16000);assert.equal(decodeHouse(encodeHouse(full)).objects.length,40);
console.log('PASS house v2: v1 migrates in place, sequencer unchanged, new fields cleaned, WH1 kept for plain houses, WH2 for decor and colours, newer houses read-only, full house under 50 KB');
