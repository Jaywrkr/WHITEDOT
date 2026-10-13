import assert from 'node:assert/strict';
import {installationSignal,nextSignalSource,normalizeSignalSource} from '../src/installation-signals.js';
import {createMirrorSite} from '../src/mirrors.js';
import {normalizePatchSites} from '../src/patchgarden.js';
assert.equal(normalizeSignalSource('bad'),'clock');assert.equal(nextSignalSource('clock'),'glass');assert.equal(nextSignalSource('glass'),'mirror');assert.equal(nextSignalSource('mirror'),'clock');
assert.equal(installationSignal('glass'),null);assert.equal(installationSignal('mirror'),null);assert.equal(installationSignal('glass',{glass:{seen:true,angles:[NaN,0,0]}}),null);
const aligned=installationSignal('glass',{glass:{seen:true,angles:[0,0,0]}}),turned=installationSignal('glass',{glass:{seen:true,angles:[Math.PI,0,0]}});
assert.notEqual(aligned.variant,turned.variant);assert(aligned.amount>turned.amount);assert.equal(aligned.stride,2);assert.equal(turned.stride,4);
const mirror=createMirrorSite({key:'0,0',recipe:{elements:[{id:'installation:mirror',present:true}]}},3600,()=>1,()=>()=>.5);
mirror.mirrors.forEach((m,i)=>m.angle=mirror.solution[i]);const solved=installationSignal('mirror',{mirror});assert.equal(solved.amount,1);assert.equal(solved.stride,2);
mirror.mirrors[2].angle+=.35;const incomplete=installationSignal('mirror',{mirror});assert.equal(incomplete.amount,.45);assert.equal(incomplete.stride,4);
mirror.mirrors[0].angle=0;assert.equal(installationSignal('mirror',{mirror}),null);
const saved=normalizePatchSites({'patch:0,0':{source:'mirror',connections:[1],pattern:2,amount:-.8},'patch:1,0':{source:'garbage',connections:[]}});assert.equal(saved['patch:0,0'].source,'mirror');assert.equal(saved['patch:1,0'].source,'clock');assert.deepEqual(saved,normalizePatchSites(JSON.parse(JSON.stringify(saved))));
for(const s of [aligned,turned,solved,incomplete]){assert(s.amount>=0&&s.amount<=1);assert(s.variant>=0&&s.variant<8);assert([1,2,4].includes(s.stride));}
console.log('PASS: actual glass angles and finite mirror routes control bounded regional signals; missing discoveries stay silent; sources survive save normalization');
