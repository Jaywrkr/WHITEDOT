import assert from 'node:assert/strict';
import {initialize as discovery} from '../src/discovery.js';
const interval=globalThis.setInterval,doc=globalThis.document;globalThis.setInterval=()=>0;
const nodes=Object.fromEntries(['zone','zMood','zName','zDo'].map(id=>[id,{id,textContent:''}]));
globalThis.document={hidden:false,querySelector:()=>null,getElementById:id=>nodes[id]};
try{
 const r={S:{},GEN:{minimal:{name:'Minimal'}},seedOf:()=>1,rng:()=>()=>.5,seasonOf:()=>({name:'Primavera'})};discovery(r);
 r.showRegion({key:'1,2',genre:'minimal',name:'Tierra',bpm:124,continent:{id:'a',name:'Continente'}},true);
 assert.match(nodes.zDo.textContent,/Continente/);assert.match(nodes.zMood.textContent,/Primavera/);
 // Same key is coalesced/rate-limited, but the current metadata is still refreshed.
 r.showRegion({key:'1,2',genre:'minimal',name:'Mar',bpm:85,sea:true},false);
 assert.match(nodes.zDo.textContent,/Abismo de silencio/);assert.match(nodes.zMood.textContent,/85 BPM/);assert.equal(nodes.zName.textContent,'Mar');
 r.showRegion({key:'0,0',genre:'minimal',name:'Origen',bpm:110},false);assert.match(nodes.zDo.textContent,/Gravedad normal/);
 console.log('PASS current sea, gravity, tempo and season metadata survives notice coalescing without extra presentations');
}finally{globalThis.setInterval=interval;globalThis.document=doc;}
