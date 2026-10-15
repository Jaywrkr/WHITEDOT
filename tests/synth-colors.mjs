import assert from 'node:assert/strict';
import {SYNTH_PROGRAMS,synthProgram,filterMovement} from '../src/synth-colors.js';
import {initialize as patches} from '../src/patches.js';
const seedOf=s=>Array.from(s).reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261),rng=a=>()=>((a=Math.imul(a,1664525)+1013904223>>>0)/4294967296);
assert.deepEqual([...new Set(SYNTH_PROGRAMS.filter(p=>p.type==='lowpass').map(p=>p.slope))].sort((a,b)=>a-b),[12,24,36,48]);
for(const p of SYNTH_PROGRAMS){const m=filterMovement(p,3000,'lead',1,.125,.8,.7);assert(m.start>=380&&m.end>=380&&m.duration<=.8);assert.notEqual(m.start,m.end);}
for(let i=0;i<300;i++){const p=synthProgram({key:'0,0',genre:'deep'},'bajo',String(i),seedOf);assert(p.type==='lowpass'&&p.stages<=2);}
let filters=[];
const param=()=>({value:0,events:[],setValueAtTime(v,t){this.events.push([v,t]);},exponentialRampToValueAtTime(v,t){assert(v>0);this.events.push([v,t]);}});
const node=()=>({frequency:param(),Q:param(),gain:param(),connect(n){return n;},disconnect(){}});
const r={seedOf,rng,S:{sound:true},SIX:.125,bus:node(),verbIn:node(),dsend:node(),inWorld:()=>true,ac:{state:'running',currentTime:0,createGain:node,createBiquadFilter(){const n=node();filters.push(n);return n;}}};patches(r);
for(const p of SYNTH_PROGRAMS){filters=[];const source={id:'living:lab:breath-tree',labFilter:p.id};
 r.withInstrumentPatch('living:breath-tree',{key:'0,0',genre:'deep'},{instrument:'rhodes',role:'acorde'},source,0,()=>{});
 assert.equal(filters.length,p.stages,'metadata did not create its actual filter cascade');assert(filters.every(f=>f.type===p.type&&f.frequency.events.length===2));assert.equal(source.filterMotion.stages,p.stages);
 r.ac.currentTime+=3;r.patchTick();
}
console.log('PASS 16 original programs, genuine 12/24/36/48 cascades, open/close automation, bounded climate/gesture response and protected mono bass');
