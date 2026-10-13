import assert from 'node:assert/strict';import {directionTo} from '../src/navigation.js';
assert.equal(directionTo(0,0,null),null);
const north=directionTo(0,0,{x:0,y:-100,layer:'superficie'});assert.equal(north.angle,0);assert.equal(north.dy,-1);assert.equal(north.distance,100);assert(!north.arrived);
const negative=directionTo(-400,-500,{x:-700,y:-900,layer:'superficie'});assert.equal(negative.distance,500);assert.equal(negative.dx,-.6);assert.equal(negative.dy,-.8);
const under=directionTo(0,0,{x:800,y:0,layer:'bajo'},'bajo');assert.equal(under.distance,100);assert(under.sameLayer);
assert(!directionTo(0,0,{x:0,y:0,layer:'cielo'}).sameLayer);
const arrived=directionTo(10,10,{x:10,y:10,layer:'superficie'});assert(arrived.arrived);assert.equal(arrived.dx,0);assert.equal(arrived.dy,0);
console.log('PASS: cardinal/negative directions, arrival, layer boundaries and underground coordinate scale');
