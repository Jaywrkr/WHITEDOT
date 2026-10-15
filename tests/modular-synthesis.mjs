import assert from 'node:assert/strict';
import {physicalString,ADVANCED_INSTRUMENTS,voiceLifetime} from '../src/modular-synth.js';
import {compileThreadGraph,routeThreadGraph} from '../src/modular-routing.js';
const seedOf=s=>[...s].reduce((a,c)=>Math.imul(a^c.charCodeAt(0),16777619)>>>0,2166136261);
for(const hz of [82.4069,220,440]){
 const a=physicalString(48000,hz,1.2),b=physicalString(48000,hz,1.2);assert.deepEqual(a,b);assert(a.every(Number.isFinite));assert(Math.max(...a.map(Math.abs))<1);
 let sum=0,late=0;for(let i=0;i<12000;i++)sum+=a[i]*a[i];for(let i=a.length-12000;i<a.length;i++)late+=a[i]*a[i];assert(sum>0&&late<sum,'physical string must damp naturally');
 // Compare autocorrelation around the actual period, rather than checking metadata.
 const period=48000/hz,energy=lag=>{let value=0;for(let i=12000;i<24000;i++)value+=a[i]*a[i-Math.round(lag)];return value;};
 assert(energy(period)>energy(period*.5),'resonance must retain the requested fundamental');
}
assert.equal(Object.keys(ADVANCED_INSTRUMENTS).length,7);assert(voiceLifetime('silkstrings')>2.6);
const graph=compileThreadGraph({edges:[{from:'w:anchor:0',to:'w:anchor:1'},{from:'w:anchor:2',to:'w:anchor:1'}]},seedOf);
assert(graph.filter&&graph.modulation&&graph.routes.length===2);assert(graph.routes.every(r=>r.from!==r.to));
let connections=0,filters=0,oscillators=0;const param=()=>({value:0,setValueAtTime(v){assert(Number.isFinite(v));}}),node=()=>({frequency:param(),gain:param(),Q:param(),delayTime:param(),connect(other){assert(other);connections++;return other;},start(){},stop(t){assert.equal(t,3);}});
const ac={createGain:node,createBiquadFilter(){filters++;return node();},createOscillator(){oscillators++;return node();},createDelay:node};
const nodes=routeThreadGraph(ac,node(),node(),graph,1,3);assert(filters===1&&oscillators===1&&nodes.length>2&&connections>3,'connections must create real signal/control nodes');
for(let i=0;i<100;i++){const g=compileThreadGraph({edges:Array.from({length:12},(_,n)=>({from:'from'+n,to:'to'+i}))},seedOf);assert(g.routes.length<=6&&g.routes.every(r=>r.from!==r.to));}
console.log('PASS seven original engines, deterministic damped pitch-preserving physical strings, finite typed routes and actual signal/control graph connections');
