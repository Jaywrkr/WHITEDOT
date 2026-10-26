import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const ACCEPTANCE_TASKS=['goal','firstAction','gardenFlower','nextPlace','ownPhrase'];
export const ACCEPTANCE_AXES=['visual','audio','creativity','sensation','cohesion','polish'];
export const ACCEPTANCE_DEVICES=['androidMidRange','iosSafari','speaker','headphones','bluetooth','screenReader'];
const digest=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
const evidence=v=>typeof v==='string'&&v.trim().length>0;
const median=values=>{if(!values.length)return null;const a=[...values].sort((x,y)=>x-y),n=a.length;return n%2?a[n>>1]:(a[n/2-1]+a[n/2])/2;};
// Supplied observations are not proof of identity, enjoyment or a perfect score.
// Never count fixtures, duplicate people, blank forms or another candidate as acceptance.
export function assessAcceptance(input={}){
 const blockers=[],candidate=input?.candidate||{},hash=candidate.runtimeDigest,valid=input?.schemaVersion===1&&digest(hash);
 if(!valid)blockers.push('Esquema o identidad del candidato sin confirmar.');
 const checks=['releaseAudit','nodeFull','browserFull','audioFull','ci'];
 const checked=record=>valid&&record?.status==='pass'&&record.runtimeDigest===hash&&evidence(record.evidence);
 for(const key of checks)if(!checked(input?.checks?.[key]))blockers.push('Pendiente: '+key+'.');
 const seen=new Set(),duplicates=[];
 function sessions(kind){const raw=Array.isArray(input?.rounds?.[kind])?input.rounds[kind]:[],out=[];
  for(const s of raw){if(s?.kind!=='human'||s.observed!==true||!/^P\d+$/.test(s.id||'')||!digest(s.runtimeDigest)||!evidence(s.evidence))continue;
   if(seen.has(s.id)){duplicates.push(s.id);continue;}seen.add(s.id);
   if(kind==='confirmation'&&s.runtimeDigest!==hash)continue;out.push(s);
  }return out;
 }
 const formative=sessions('formative'),confirmation=sessions('confirmation');
 if(formative.length<5)blockers.push('Faltan cinco sesiones formativas observadas.');
 if(confirmation.length<8)blockers.push('Falta confirmación independiente con al menos ocho personas.');
 if(duplicates.length)blockers.push('Hay participantes repetidos entre registros.');
 const tasks=Object.fromEntries(ACCEPTANCE_TASKS.map(task=>{const passed=confirmation.filter(s=>s.externalHelp===false&&s.tasks?.[task]===true).length;return [task,{passed,total:confirmation.length,ratio:confirmation.length?passed/confirmation.length:null}];}));
 for(const [task,result]of Object.entries(tasks))if(result.ratio===null||result.ratio<.8)blockers.push('Sin confirmar al 80 % sin ayuda externa: '+task+'.');
 const scores=Object.fromEntries(ACCEPTANCE_AXES.map(axis=>{const values=confirmation.map(s=>s.ratings?.[axis]).filter(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=10);return [axis,{n:values.length,median:median(values),min:values.length?Math.min(...values):null,max:values.length?Math.max(...values):null}];}));
 for(const [axis,summary]of Object.entries(scores))if(summary.n<8)blockers.push('Puntuación humana insuficiente: '+axis+'.');else if(summary.median<10)blockers.push('La mediana declarada aún no llega a diez: '+axis+'.');
 const continueCount=confirmation.filter(s=>s.wantsContinue===true).length;
 if(!confirmation.length||continueCount/confirmation.length<.8)blockers.push('Deseo de continuar aún sin confirmar al 80 %.');
 for(const key of ACCEPTANCE_DEVICES)if(!checked(input?.devices?.[key]))blockers.push('Dispositivo/escucha pendiente: '+key+'.');
 return {schemaVersion:1,candidate,status:blockers.length?'pending':'ready-for-release-review',criteriaMet:blockers.length===0,tenCertified:false,counts:{formative:formative.length,confirmation:confirmation.length},tasks,scores,wantsContinue:{yes:continueCount,total:confirmation.length},duplicates,blockers,scope:'Datos declarados; no autentica personas ni certifica diez. Las medianas describen respuestas, no una nota automática del panel.'};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const args=process.argv.slice(2),path=args.find(a=>!a.startsWith('--'));if(!path)throw Error('Uso: node scripts/acceptance-gate.mjs archivo.json [--require-ready]');const report=assessAcceptance(JSON.parse(readFileSync(path,'utf8')));console.log(JSON.stringify(report,null,2));if(args.includes('--require-ready')&&!report.criteriaMet)process.exitCode=2;}
 catch(error){console.error(error.message);process.exitCode=1;}
}
