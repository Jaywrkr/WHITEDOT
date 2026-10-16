// Form develops over bars; no per-hit lottery and no change to world seeds.
const FORMS=['statement','answer','build','release','return','bridge'];
export function arrangementPhrase(bar,variant=0){
 const b=Math.max(0,Math.floor(bar)),name=b<8?'statement':FORMS[(Math.floor((b-8)/8)+variant%6)%FORMS.length];
 return Object.freeze({name,bar:b,local:b%8,turn:Math.floor(b/48)%4,energy:({answer:.88,build:1.03,release:.66,bridge:.78})[name]||1});
}
export function phraseNotes(events,phrase,step){
 if(!phrase)return events;
 return events.filter(e=>{
  if(phrase.name==='release'&&['sequence','air','answer'].includes(e.part))return false;
  if(phrase.name==='bridge'&&e.role==='lead')return e.part==='answer'||step===0&&phrase.local%2===0;
  if(phrase.name==='answer'&&e.role==='lead'&&!e.part&&phrase.local%2)return false;
  return true;
 }).map(e=>({...e,degree:e.role==='lead'&&step%4!==0&&phrase.turn?(e.degree+[0,2,4,2][phrase.turn])%7:e.degree,
  level:e.level*(phrase.name==='answer'&&e.part!=='answer'?.82:phrase.name==='release'?.82:1)}));
}
export function phraseDrums(events,phrase,step){
 if(!phrase||!['release','bridge'].includes(phrase.name))return events;
 return events.filter(e=>e.instrument==='kick'||/snare|clap/.test(e.instrument)||step%4===2&&/hat|shaker/.test(e.instrument));
}
