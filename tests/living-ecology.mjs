import assert from 'node:assert/strict';import {ecologyFrame,ecologyRelation} from '../src/living-ecology.js';
const d={key:'0,0'},hash=()=>0;assert.equal(ecologyFrame(d,0,hash).name,'amanecer');assert.equal(ecologyFrame(d,450,hash).name,'noche');assert.equal(ecologyFrame(d,300,hash,.6).convergence,true);
const a={kind:'moth',x:0,y:0},b={kind:'pressure-flower',x:40,y:0};assert.equal(ecologyRelation(a,b,ecologyFrame(d,0,hash)),'polinizacion');assert.equal(ecologyRelation(a,{...b,x:300},ecologyFrame(d,0,hash)),null);
for(let sec=0;sec<3600;sec++){const f=ecologyFrame(d,sec,hash,.8);assert(f.humidity<=1&&f.tide>=0&&f.tide<=1&&Math.abs(f.wind)<=1);}
console.log('PASS ecological day/night, tides, bounded humidity, seasonal context and genuinely local symbioses');
