import assert from 'node:assert/strict';
import {createGrammar,shapeMotif,harmonicDegree,createVoiceCurator} from '../src/grammar.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';
import {createRadio} from '../src/radio.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const profiles=new Set();
for(let i=0;i<1000;i++){
 const region={key:`${i-500},-2`,genre:'minimal'},g=createGrammar(region,r.seedOf,r.rng);
 assert.deepEqual(g,createGrammar(region,r.seedOf,r.rng));
 assert(g.accents.every(n=>Number.isInteger(n)&&n>=0&&n<16));assert.equal(new Set(g.accents).size,g.accents.length);
 assert(g.brightness>=6000&&g.brightness<=10500);assert(g.hookLimit<=3);
 profiles.add(JSON.stringify([g.accents,g.accentInstrument,g.progression,g.motifRotation,g.phraseBars]));
 const recipe=Array.from({length:16},(_,s)=>[0,3,6,10,14].includes(s)?0:-1),motif=shapeMotif(recipe,g);
 assert.equal(motif.length,16);assert.equal(motif[0],0);assert(motif.filter(n=>n>=0).length<=5);
 assert.equal(harmonicDegree(g,0),g.progression[0]);assert.equal(harmonicDegree(g,g.harmonyBars),g.progression[1]);
}
assert(profiles.size>700,'regions collapsed to a small set of musical identities');
const region=r.regionOfPos(900,900),dna=JSON.stringify(region),a=createRadio(r.seedOf,r.rng,r.GEN),b=createRadio(r.seedOf,r.rng,r.GEN);
for(let bar=100;bar<300;bar++){
 const first=a.advance(region,bar),second=b.advance(region,bar);assert.deepEqual(first,second);assert.equal(first.harmonyBar,bar-100);
 assert(first.hook.filter(n=>n>=0).length<=first.grammar.hookLimit);
}
assert.equal(JSON.stringify(region),dna);
const c=createVoiceCurator();assert.equal(c.gain(1,.125,'bajo'),1);assert(c.gain(1,.125,'bajo')<.5);
const regular=c.gain(2,.125,'agudo');c.clear();assert(c.gain(2,.125,'agudo',true)<regular);
let previous=1;for(let i=0;i<20;i++){const gain=c.gain(3,.125,'lead');assert(gain>0&&gain<=previous);previous=gain;}
assert.equal(c.gain(4,.125,'lead'),1);
for(let i=0;i<1000;i++)c.gain(10+i,.125,'lead');assert.equal(c.gain(1,.125,'bajo'),1);
console.log(`PASS: ${profiles.size} distinct regional grammars, deterministic stationary evolution, anchored motifs, harmonic clock and density/brightness curation`);
