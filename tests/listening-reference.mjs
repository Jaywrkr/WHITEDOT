import assert from 'node:assert/strict';
import {LISTENING_REFERENCES,listeningReference,listeningReport} from '../src/listening-reference.js';
import {labElement} from '../src/lab-catalog.js';
assert.equal(LISTENING_REFERENCES.length,10);assert.equal(new Set(LISTENING_REFERENCES.map(r=>r.id)).size,10);
for(const reference of LISTENING_REFERENCES){assert(labElement(reference.a),reference.a);assert(labElement(reference.b),reference.b);assert.notEqual(reference.a,reference.b);assert.equal(reference.seconds,90);assert(reference.goal.split(/\s+/).length<=12);}
assert.equal(listeningReference('unknown'),null);assert.equal(listeningReport({}), '');
assert.equal(listeningReport({'band:interlock':{checks:{},text:'',verdict:''}}),'');
const report=listeningReport({'band:interlock':{verdict:'fix',text:'Tapa el gesto'}},id=>labElement(id)?.name);
assert.match(report,/Piel y madera/);assert.match(report,/Membranas entrelazadas: Mejorar/);assert.match(report,/Cantera de pulsos: sin veredicto/);assert.match(report,/Una nota no acredita la pareja completa/);assert(!report.includes('Dos fiestas'));
console.log('PASS ten real listening comparisons, compact prompts and honest export of partial reviews');
