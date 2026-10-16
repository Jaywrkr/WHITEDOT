import {writeFileSync} from 'node:fs';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';import {createRadio} from '../src/radio.js';import {labScore,labNoteEvents,labDrumEvents} from '../src/lab-score.js';import {HYBRID_STYLES,hybridIdentity} from '../src/musical-hybrids.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);const native=new Map(),pure=new Map(),fusions=new Map();
for(let x=-40;x<=40;x++)for(let y=-40;y<=40;y++){
 const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600),score=labScore(d,r.seedOf,r.rng);if(!score)continue;const h=hybridIdentity(d,r.seedOf,r.rng);
 if(!native.has(d.genre))native.set(d.genre,d);if(!h&&score.electronic.count>=8&&!pure.has(d.genre))pure.set(d.genre,d);if(h&&!fusions.has(h.id))fusions.set(h.id,d);
}
const failures=[],checks=[],rows=[],check=(id,ok,actual)=>{checks.push({id,passed:!!ok,actual});if(!ok)failures.push(id);};
check('all-native-styles',native.size===52,native.size);check('all-compositional-influences',fusions.size===HYBRID_STYLES.length,fusions.size);
const footprints=new Set(),tempos=[];
for(const [genre,fallback]of native){
 const d=pure.get(genre)||fallback,score=labScore(d,r.seedOf,r.rng),radio=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true}),forms=new Set(),signatures=new Set(),instruments=new Set();let notes=0,repeated=0,last='',invalid=0;
 for(let bar=0;bar<128;bar++){
  const f=radio.advance(d,bar),signature=JSON.stringify([f.hook,f.hookI]);forms.add(f.phrasing.name);signatures.add(signature);if(signature===last)repeated++;last=signature;
  for(let s=0;s<16;s++)for(const e of labNoteEvents(f,s,bar)){notes++;instruments.add(e.instrument);if(!Number.isInteger(e.degree)||e.degree<0||e.degree>9||!Number.isFinite(e.level)||e.level<=0)invalid++;}
 }
 const frame=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true}).advance(d,0),drums=Array.from({length:16},(_,s)=>labDrumEvents(frame.labScore,s,0,.65));footprints.add(JSON.stringify(drums.map(v=>v.map(e=>[e.instrument,e.offset]))));tempos.push(d.bpm);
 const row={genre,key:d.key,parts:score.electronic.count,bpm:d.bpm,swing:frame.identity.swing,forms:forms.size,motifVersions:signatures.size,repeatedBarPairs:repeated,noteEvents:notes,instruments:[...instruments],drums:drums.map((events,step)=>({step,instruments:events.map(e=>e.instrument)})).filter(e=>e.instruments.length)};rows.push(row);
 check('composed-'+genre,notes>0&&invalid===0&&forms.size===6&&signatures.size>=4&&repeated>=16,{notes,invalid,forms:forms.size,motifs:signatures.size,repeated});
 if(['minimaltechno','nudisco','afro'].includes(genre))check('quarter-floor-'+genre,[0,4,8,12].every(s=>drums[s].some(e=>e.instrument==='kick')),row.drums);
 if(['garage','dnb'].includes(genre))check('backbeat-'+genre,[4,12].every(s=>drums[s].some(e=>/snare|clap/.test(e.instrument))),row.drums);
 if(genre==='garage')check('garage-swing',frame.identity.swing>=.12,frame.identity.swing);
 if(genre==='dnb')check('fast-dnb',d.bpm>=150,d.bpm);
 if(genre==='afro')check('layered-afro',new Set(drums.flat().map(e=>e.instrument).filter(id=>id!=='kick')).size>=2,row.drums);
 if(genre==='minimaltechno'&&!score.hybridId)check('restrained-minimal',!drums.flat().some(e=>e.instrument==='handslap'||e.instrument==='conga'),row.drums);
}
for(const id of ['blues-machine','guitar-machine','italo-current']){
 const d=fusions.get(id),h=d&&hybridIdentity(d,r.seedOf,r.rng),score=d&&labScore(d,r.seedOf,r.rng);check('real-fusion-'+id,!!h,{key:d?.key,production:score?.production.id});
 if(id==='blues-machine')check('twelve-bar-blues',h?.progression.length===12&&h.harmonyBars===1,{progression:h?.progression,barsPerChord:h?.harmonyBars});
 if(id==='guitar-machine')check('guitar-protagonist',score?.production.id==='guitar'&&score.leads.includes('p_gutguitar'),score?.leads);
 if(id==='italo-current')check('synth-sequence-protagonist',score?.production.id==='italo'&&score.leads.includes('phasekeys'),score?.leads);
}
check('rhythmic-contrast',footprints.size>=24,footprints.size);check('tempo-contrast',Math.max(...tempos)-Math.min(...tempos)>=80,{min:Math.min(...tempos),max:Math.max(...tempos)});
export const report={result:failures.length?'failed':'passed',scope:'Symbolic events of actual seeded territories; reference criteria from documented styles, not artist recording analysis.',nativeStyles:native.size,influences:fusions.size,barsPerStyle:128,checks,failures,rows,external:{artistRecordingAnalysis:'not performed: public preview download returned HTTP 403',physicalListening:'pending'}};
if(process.argv[1]?.endsWith('music-quality-audit.mjs')){const output=process.argv[2];if(output)writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({result:report.result,nativeStyles:native.size,influences:fusions.size,checks:checks.length,failures,rhythmicGrammars:footprints.size},null,2));}if(failures.length)process.exitCode=1;
