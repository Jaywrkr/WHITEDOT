import assert from 'node:assert/strict';import {favoriteSignature,favoriteSignatureSVG} from '../src/wow-memory.js';
const p={name:'Lugar',address:{seed:'a',layout:'vasto',generatorVersion:1,x:120,y:-85,layer:'superficie'},genre:'dub',material:'glass'};
assert.deepEqual(favoriteSignature(p),favoriteSignature({...p,name:'Renombrado',created:Date.now()}),'renaming never changes the place signature');
const changed=favoriteSignature({...p,address:{...p.address,seed:'b'}});assert(JSON.stringify(changed)!==JSON.stringify(favoriteSignature(p)));
for(const p of [null,{}, {address:{x:Infinity,y:NaN}}, {name:'<script>alert(1)</script>',material:'<svg onload="evil">'}]){
 const s=favoriteSignature(p);assert(s.nodes.length<=8&&s.edges.length<=8);assert(s.nodes.every(p=>Number.isFinite(p.x)&&Math.abs(p.x)<=.85&&Math.abs(p.y)<=.8));
 assert(!favoriteSignatureSVG(p).includes('<script'));assert(!favoriteSignatureSVG(p).includes('onload'));
}
console.log('PASS address-based favorite signatures, stable renaming, foreign seeds and safe bounded SVG');
