import assert from 'node:assert/strict';import {favoriteSignature,favoriteSignatureSVG} from '../src/wow-memory.js';
const p={name:'Lugar',address:{seed:'a',layout:'vasto',generatorVersion:1,x:120,y:-85,layer:'superficie'},genre:'dub',material:'glass'};
assert.deepEqual(favoriteSignature(p),favoriteSignature({...p,name:'Renombrado',created:Date.now()}),'renaming never changes the place signature');
const changed=favoriteSignature({...p,address:{...p.address,seed:'b'}});assert(JSON.stringify(changed)!==JSON.stringify(favoriteSignature(p)));
for(const p of [null,{}, {address:{x:Infinity,y:NaN}}, {name:'<script>alert(1)</script>',material:'<svg onload="evil">'}]){
 const s=favoriteSignature(p);assert(s.nodes.length<=8&&s.edges.length<=8);assert(s.nodes.every(p=>Number.isFinite(p.x)&&Math.abs(p.x)<=.85&&Math.abs(p.y)<=.8));
 assert(!favoriteSignatureSVG(p).includes('<script'));assert(!favoriteSignatureSVG(p).includes('onload'));
}
console.log('PASS address-based favorite signatures, stable renaming, foreign seeds and safe bounded SVG');

const {initialize}=await import('../src/wow-memory.js');
const storage=new Map();globalThis.sessionStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};globalThis.matchMedia=()=>({matches:false});
const address={seed:'a',layout:'vasto',generatorVersion:1,catalogVersion:1,layoutVersion:1,x:120,y:-85,layer:'superficie'};
const state={wx:120,wy:-85,layer:'superficie'},ctx=new Proxy({},{get:()=>()=>{},set:()=>true});
const r={S:state,worldIdentity:address,arrivedByAddress:false,inWorld:()=>true,W:390,H:844,cx:ctx};initialize(r);
r.rememberFavoriteReturn({address,genre:'dub'});assert.equal(storage.size,1);
const arrived={...r};for(const k of ['rememberFavoriteReturn','clearFavoriteReturn','favoriteReturnTick','drawFavoriteReturn','favoriteReturnState'])delete arrived[k];arrived.arrivedByAddress=true;initialize(arrived);
assert(arrived.favoriteReturnState.pending);assert.equal(storage.size,0);
arrived.favoriteReturnTick(.02);assert(arrived.favoriteReturnState.visible);arrived.drawFavoriteReturn();
arrived.favoriteReturnTick(.02,true);assert(!arrived.favoriteReturnState.visible);
for(let i=0;i<60;i++)arrived.favoriteReturnTick(.05);assert(!arrived.favoriteReturnState.pending);
globalThis.sessionStorage={getItem:()=>{throw Error('denied')},setItem:()=>{throw Error('denied')},removeItem:()=>{throw Error('denied')}};
r.rememberFavoriteReturn({address});r.clearFavoriteReturn();
console.log('PASS exact one-shot favorite return, expiry, pause and blocked storage');
