import assert from 'node:assert/strict';
import {gameObjective,normalizePlaces,PLACE_IDS,nextOnPath} from '../src/places.js';
let s={journey:{chapter:0},pathCrystals:['a']};assert.equal(gameObjective(s).id,'camino');assert.match(gameObjective(s).progress,/1\/10/);
s.pathCrystals=Array(10).fill('x');assert.equal(gameObjective(s).id,'llanura');s.journey.chapter=2;assert.equal(gameObjective(s).id,'lago');s.journey.done={lago:true};assert.equal(gameObjective(s).id,'bosque');
s={journey:{finished:true},sparks:0};let d=normalizePlaces(null,s.journey);
for(const id of PLACE_IDS){const goal=gameObjective(s,d);assert.equal(goal.id,nextOnPath(d,s.journey).id);assert.equal(goal.id,id);d.stars[id][0]=true;}
const all=gameObjective(s,d);assert.equal(all.kind,'create');assert.equal(all.completed,11);assert.equal(all.stars,11);assert.match(all.progress,/11\/11/);s.sparks=100000;assert.deepEqual(gameObjective(s,d),all,'wallet never substitutes for progression');
assert.equal(gameObjective(s,{version:9}).kind,'update');assert.deepEqual(s,{journey:{finished:true},sparks:100000},'objective cannot mutate progress');
console.log('PASS one objective for the Camino, chapters and eleven places; mastery and wallet distinct, future-safe and read-only');
