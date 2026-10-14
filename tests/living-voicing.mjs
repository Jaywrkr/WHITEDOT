import assert from 'node:assert/strict';import {leadVoicing} from '../src/living-voicing.js';
let last=[];for(const notes of [[48,51,55],[53,56,60],[55,58,62],[48,51,55]]){const v=leadVoicing(notes,last);assert(v.every(n=>n>=45&&n<=69));assert.deepEqual(v.map(n=>n%12).sort(),notes.map(n=>n%12).sort());if(last.length)assert(v.reduce((s,n,i)=>s+Math.abs(n-last[i]),0)<18);last=v;}
console.log('PASS bounded warm chord positions and nearby voice leading without changing pitch classes');
