import assert from 'node:assert/strict';
import {PULSE_FORMS,PULSE_FAMILIES,ownedPulses,selectedPulse,pulsePaths,pulseCrossed,pulseHint,drawPulse} from '../src/pulse-forms.js';
import {DISCOVERY_ELEMENTS} from '../src/element-book-model.js';import {normalizeCube} from '../src/cube-model.js';
assert.equal(PULSE_FORMS.length,50);assert.equal(PULSE_FAMILIES.length,10);assert.equal(new Set(PULSE_FORMS.map(p=>p.id)).size,50);
const state={cube:{pulse:'laser-3',extension:{earned:9}},elementBook:{version:1,found:{}}},locked=JSON.stringify(state);assert.equal(selectedPulse(state).id,'ring-0');assert.deepEqual([...ownedPulses(state)],['ring-0']);assert.equal(JSON.stringify(state),locked);
for(const d of DISCOVERY_ELEMENTS.slice(0,49))state.elementBook.found[d.id]={day:'2026-10-16',genre:'deep'};assert.equal(ownedPulses(state).size,50);assert.equal(selectedPulse(state).id,'laser-3');assert.equal(normalizeCube(state.cube).pulse,'laser-3');assert.deepEqual(normalizeCube(state.cube).extension,{earned:9});
const future={cube:{version:9,pulse:'future-pulse'},elementBook:{version:9,found:{'future:species':{value:9}},custom:{keep:true}}},snapshot=JSON.stringify(future);assert.equal(selectedPulse(future).id,'ring-0');ownedPulses(future);assert.equal(JSON.stringify(future),snapshot);
const geometry=new Set(),coverage=new Set();let balance=0,segments=0;const c=new Proxy({save(){balance++;},restore(){balance--;}},{get:(o,k)=>k in o?o[k]:(...args)=>{for(const a of args)if(typeof a==='number')assert(Number.isFinite(a));segments++;}});
for(const form of PULSE_FORMS){const paths=pulsePaths(form,100);assert(paths.length>0&&paths.flat().length<=200);for(const [x,y]of paths.flat()){assert(Number.isFinite(x)&&Number.isFinite(y));assert(Math.hypot(x,y)<=101);}
 geometry.add(JSON.stringify(paths));let hits='';for(let x=-90;x<=90;x+=15)for(let y=-90;y<=90;y+=15)hits+=pulseCrossed({x:0,y:0,r:100,prev:0,form},x,y)?'1':'0';coverage.add(hits);assert(pulseHint(form.id).split(/\s+/).length<=12);drawPulse(c,form,0,0,100);drawPulse(c,form,0,0,100,true);}
assert.equal(geometry.size,50);assert(coverage.size>=25,'shapes must change the spatial response, not only the drawing');assert.equal(balance,0);assert(segments>500);
for(let x=-100;x<100;x+=11)for(let y=-100;y<100;y+=13){const d=Math.hypot(x,y);assert.equal(pulseCrossed({x:0,y:0,r:80,prev:50},x,y),d<=80&&d>50,'default pulse preserves the previous physical footprint');}
const legacy={mirrorSites:{'mirror:earned':{seen:true}}};assert(ownedPulses(legacy).size>1,'old explicit discoveries unlock forms without replay');
console.log(`PASS 50 distinct pulse geometries, ${coverage.size} spatial footprints, ten families, earned/legacy gates, unchanged default, future/unknown progress and reduced-motion drawing`);
