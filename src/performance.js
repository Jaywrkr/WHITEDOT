import {GENRE_CHARACTERS} from './musical-character.js';
import {PERFORMANCE_INSTRUMENTS} from './performance-instruments.js';
const form=(id,name,characters,steps,degrees,keys)=>Object.freeze({id,name,characters:characters.split(' '),steps,degrees,keys:keys.split(' ')});
export const FIELD_FUSIONS=Object.freeze([
 form('delta','Delta modular','floor warm machine',[3,7],[2,0],'gutguitar fmharp'),form('funk','Corte de funk','disco warm floor',[2,5],[4,2],'barkkeys tinepiano'),form('modal','Aire modal','organic calm melodic',[4,9],[1,0],'bassclarinet duskwind'),
 form('height','Cuerdas de altura','organic calm',[3,8],[4,2],'wireharp panreed'),form('bronze','Bronce entrelazado','organic broken',[3,6],[2,0],'bronzebody claypot'),form('patio','Patio eléctrico','organic disco floor',[2,6],[0,4],'gutguitar woodrim'),
 form('desert','Cañas del desierto','organic calm bass',[5,10],[3,0],'bassclarinet panreed'),form('breath','Respiración de barro','calm melodic',[4,11],[2,0],'duskwind breathingpad'),form('liquid','Arco líquido','bass broken melodic',[3,7],[4,2],'cellobody tinepiano'),
 form('machine','Máquina de fibras','machine floor broken',[2,5],[0,3],'foldbass barkkeys'),form('disco','Disco de lengüetas','disco warm',[2,6],[2,4],'tinepiano fogorgan'),form('dub','Cuerda y espacio','floor calm bass',[4,10],[4,0],'gutguitar fogorgan'),
 form('minimal','Madera mínima','floor machine',[3,9],[0,0],'woodrim feltmallet'),form('broken','Pulso quebrado','broken bass',[3,6],[2,0],'waterdrum claypot'),form('organic','Semillas y arco','organic warm',[3,8],[4,0],'seedshake violaswell'),
 form('soul','Teclas de alma','warm disco melodic',[3,7],[2,4],'ebonypiano velvetchoir'),form('drum','Marcos cruzados','broken organic floor',[3,5],[0,2],'framedrum brushkit'),form('chamber','Cámara suspendida','calm melodic warm',[5,11],[4,0],'cellobody violaswell'),
 form('acid','Grave plegado','machine bass floor',[2,7],[0,4],'foldbass roundbass'),form('cosmic','Bronce orbital','disco melodic calm',[4,9],[2,0],'roundbell stringcloud'),form('sequence','Arpa secuenciada','machine melodic',[3,6],[4,2],'fmharp barkkeys'),
 form('tape','Fieltro en cinta','warm calm organic',[5,10],[2,0],'tapepiano feltmallet'),form('body','Cuerpo de tierra','bass organic broken',[3,8],[0,0],'woodybass lowgong'),form('quiet','Espacio respirado','calm floor melodic',[7,12],[0,0],'breathingpad duskwind'),
]);
const pools={bajo:['roundbass','woodybass','foldbass','softreese'],perc:['framedrum','claypot','waterdrum','brushkit','seedshake','woodrim','bronzebody','lowgong'],acorde:['velvetchoir','fogorgan','stringcloud','breathingpad','cellobody','violaswell'],lead:['wireharp','gutguitar','bassclarinet','softhorn','panreed','duskwind','tinepiano','feltmallet','ebonypiano','celestabody','fmharp','roundbell','barkkeys','tapepiano']};
export function fieldFusion(region,source,seedOf){const character=GENRE_CHARACTERS[region.genre]||'warm',pool=FIELD_FUSIONS.filter(f=>f.characters.includes(character)&&(f.id!=='delta'||region.scale?.[2]===3));return pool[seedOf('performance:fusion:v1:'+region.key+':'+source.id)%pool.length];}
export function performanceVoice(raw,region,kind,source,seedOf){
 if(!raw||!source?.id||source.labSynth||kind==='pulso'||kind==='reliquia'||kind.startsWith('heritage:')||kind.startsWith('rhythm:'))return raw;
 if(source.performanceInstrument&&PERFORMANCE_INSTRUMENTS[source.performanceInstrument])return {...raw,instrument:source.performanceInstrument};
 const h=seedOf('performance:voice:v1:'+region.key+':'+kind+':'+source.id);if(h%3)return raw;
 const role=pools[raw.role]?raw.role:'lead',pool=pools[role],instrument='p_'+pool[(h>>>3)%pool.length];
 return {...raw,instrument,low:role==='bajo'||role==='perc'?36:45,high:role==='bajo'?54:role==='perc'?57:67};
}
export function initialize(runtime){let owner=null,queue=[],last=-Infinity;
 const active=()=>runtime.inWorld()&&runtime.S.sound&&runtime.ac?.state==='running'&&!runtime.duetRoom&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])');
 function tick(){if(owner!==runtime.S){owner=runtime.S;queue=[];last=-Infinity;}if(!active())queue=[];}
 function reply(o,time,region){tick();if(!active()||!runtime.MU.radio?.labScore||o.id?.startsWith('living:lab:')||runtime.MU.step-last<64)return;last=runtime.MU.step;const f=fieldFusion(region,o,runtime.seedOf);if(!f)return;
  const role=runtime.getVoice('living:'+o.kind,region,o).role,pool=pools[role]||pools.lead;
  queue=f.steps.slice(0,2).map((offset,i)=>({at:runtime.MU.step+offset,layer:runtime.S.layer||'superficie',source:{...o,performanceInstrument:'p_'+(role==='lead'||role==='acorde'?f.keys[i%f.keys.length]:pool[(o.variant+i)%pool.length])},region,index:(runtime.MU.deg+f.degrees[i])%7,fusion:f.id}));
 }
 function step(s,bar,time){tick();if(!active())return;const due=queue.filter(n=>n.at<=runtime.MU.step);queue=queue.filter(n=>n.at>runtime.MU.step);for(const n of due){if(n.layer!==(runtime.S.layer||'superficie')||Math.hypot(n.source.x-runtime.S.wx,n.source.y-runtime.S.wy)>360)continue;runtime.playVoice('living:'+n.source.kind,n.index,time,n.region,false,.28,n.source,'field');runtime.performanceCue?.({fusion:n.fusion,instrument:n.source.performanceInstrument,time});}}
 Object.defineProperties(runtime,{performanceTick:{get:()=>tick},performanceReply:{get:()=>reply},performanceStep:{get:()=>step},performanceIdentity:{get:()=>((o,d)=>fieldFusion(d,o,runtime.seedOf))}});
}
