import assert from 'node:assert/strict';
import {initialize} from '../src/save-tools.js';
// Starting over is only offered without an account: with one, the cloud would take the empty game as the newest.
const el=()=>({hidden:false,disabled:false,textContent:'',value:'',onclick:null,onchange:null,querySelector:()=>({firstChild:{textContent:''}}),addEventListener(){}});
const els={};const $=id=>els[id]||(els[id]=el());globalThis.MutationObserver=class{observe(){}};const store=new Map();globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
let user=null,restored=0;const r={$,storageStatus:{kind:'ok',message:''},saveStore:{key:'k',restore(){restored++;},save:()=>true},fresh:()=>({}),accountClient:{user:()=>user}};
initialize(r);user={id:'x'};assert.equal(r.startOver(),false);assert.equal(r.startOver(),false,'not even on the second tap');assert.equal(restored,0);
store.set('k:before-restore','{}');assert.equal(r.hasPreviousSave(),true);assert.equal(r.previousSave(),false,'nor going back');assert.equal(restored,0);
console.log('PASS start over: never offered with an account open, the previous game is detected');
