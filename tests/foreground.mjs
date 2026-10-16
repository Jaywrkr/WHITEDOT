import assert from 'node:assert/strict';
import {createStage,initialize} from '../src/foreground.js';
import {STRIKE_BODIES,strikeProfile} from '../src/percussion-material.js';
const gains=[],ac={currentTime:1,state:'running',createGain(){const calls=[],n={gain:{setTargetAtTime:(...v)=>calls.push(v),cancelAndHoldAtTime:t=>calls.push(['hold',t])},connect(to){n.output=to;},calls};gains.push(n);return n;}};
const outputs=[{id:'dry'},{id:'verb'},{id:'echo'}],stage=createStage(ac,outputs);assert.equal(gains.length,3);gains.forEach((n,i)=>assert.equal(n.output,outputs[i]));stage.focus(.2);assert.equal(stage.until,1.5);assert(gains.every(n=>n.calls[1][0]===.62));stage.focus(1.2);assert.equal(stage.until,1.7);
globalThis.document={hidden:false,querySelector:()=>null};const r={ac,bus:outputs[0],verbIn:outputs[1],dsend:outputs[2],inWorld:()=>true,S:{sound:true}};initialize(r);
assert.throws(()=>r.withAccompaniment(()=>{assert.notEqual(r.bus,outputs[0]);throw Error('test');}));assert.equal(r.bus,outputs[0]);const g=r.accompanimentStage().inputs;const before=g[0].calls.length;r.focusGesture(2,null,'perc');assert(g[0].calls.length>before);r.S.sound=false;const after=g[0].calls.length;r.focusGesture(3);assert.equal(g[0].calls.length,after);
const signatures=new Set();for(const kind of Object.keys(STRIKE_BODIES)){for(let variant=0;variant<8;variant++){const p=strikeProfile(kind,variant);assert(p.frequency>=45&&p.frequency<900&&p.decay<.5);signatures.add(JSON.stringify(p));}}assert.equal(signatures.size,Object.keys(STRIKE_BODIES).length*8);assert.equal(Object.keys(STRIKE_BODIES).length,27);
console.log('PASS three persistent backing paths, source-independent duck/recovery, throw restoration, mute and 216 bounded material strikes');
