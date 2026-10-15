import assert from 'node:assert/strict';
import {opticalFilter} from '../src/synth-colors.js';
const base={start:4200,end:1800,type:'lowpass',stages:2,slope:24,duration:.3};
assert.equal(opticalFilter(base,undefined,'lead'),base);const slopes=new Set();for(const p of [0,.3,.6,1]){const m=opticalFilter(base,p,'lead');slopes.add(m.slope);assert(m.start>=250&&m.end<=6500);assert(m.stages<=4);}assert.deepEqual([...slopes],[12,24,36,48]);assert(opticalFilter(base,0,'lead').start<opticalFilter(base,1,'lead').start);assert(opticalFilter(base,1,'bajo').stages<=2);assert(opticalFilter(base,1,'bajo').end<=1200);assert.equal(base.stages,2);assert.equal(opticalFilter({...base,type:'notch'},.8,'lead').slope,null);
console.log('PASS optical angle modulates real source cutoff/four filter slopes, leaves master untouched and protects low registers');
