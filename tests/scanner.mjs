import assert from 'node:assert/strict';
import { nearbySources } from '../src/scanner.js';
const sources=new Map([['0,0',{props:[{x:10,y:0,k:'piedra'}],grass:[{x:2,y:0,tall:false},{x:5,y:0,tall:true}],sp:[{x:20,y:0,s:{id:'0,0:0',name:'Forma'}}],plants:[{x:1,y:0,pt:{t:'hierba'}},{x:6,y:0,pt:{t:'flor'}}],crystals:[{x:800,y:0}]}]]);
const found=nearbySources(sources,0,0);
assert.deepEqual(found.map(s=>s.kind),['arbol','planta:flor','piedra','forma:0,0:0']);
assert.equal(nearbySources(sources,5000,5000).length,0);
assert.equal(nearbySources(new Map([['dense',{motes:Array.from({length:100},(_,i)=>({x:i,y:0}))}]]),0,0).length,5);
console.log('PASS: nearby musical sources sorted, silent grass excluded, range and display limit respected');
