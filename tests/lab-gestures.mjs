import assert from 'node:assert/strict';
import {LAB_BANDS,labInteractionVoice} from '../src/lab-score.js';
const seed=s=>[...s].reduce((h,c)=>(Math.imul(h,31)+c.charCodeAt(0))>>>0,7),instruments=new Set();
for(const base of LAB_BANDS){const score={...base,leads:{interlock:['silkpluck','skinpluck'],silk:['silkpluck','lowbow'],breath:['bamboowind','clayflute'],heavy:['feltkeys','skinpluck'],warm:['feltkeys','duskpad'],pulse:['skinpluck','feltkeys']}[base.id]||base.leads};
 for(const role of ['bajo','perc','acorde','lead','agudo'])for(let i=0;i<25;i++){
  const raw={role,instrument:'glass'},source={id:'living:'+i},voice=labInteractionVoice(raw,score,'living:tree',source,seed);
  assert.equal(voice.role,role);assert(voice.low>=36&&voice.high<=69);assert.deepEqual(voice,labInteractionVoice(raw,score,'living:tree',source,seed));assert.equal(raw.instrument,'glass');instruments.add(voice.instrument);
 }
 for(const kind of ['pulso','reliquia','heritage:koto','rhythm:stone']){const raw={role:'lead',instrument:'old'};assert.equal(labInteractionVoice(raw,score,kind,null,seed),raw);}
}
assert(instruments.size>=11);const raw={role:'lead',instrument:'glass'};assert.equal(labInteractionVoice(raw,null,'tree',null,seed),raw);
console.log('PASS all five roles remain learnable while territory/specimen change instruments, preserve heritage/material voices and bound registers');
