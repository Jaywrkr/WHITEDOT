import {ecosystemField} from '../src/ecosystem-field.js';
import {writeFileSync,existsSync} from 'node:fs';
import {manifestCoverage,CONTENT_MANIFEST} from '../src/content-manifest.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {livingChunk} from '../src/living-catalog.js';import {populationProfile,populatedChunk} from '../src/living-populations.js';import {expandedChunk} from '../src/ecoregions.js';import {microChunk} from '../src/micro-instruments-model.js';
import {nativeVisualFamily} from '../src/native-visual.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);const count=Math.max(16,Math.min(4096,Number(process.argv[2])||256)),seen=new Map(),families=new Map(),styles=new Map();let land=0,native=0,visibleNative=0,living=0;
const add=(id)=>seen.set(id,(seen.get(id)||0)+1);
for(let i=0;i<count;i++){
 const a=i%32-16,b=Math.floor(i/32)-8,c=r.wchunk(a,b),d=r.regionOfPos((a+.5)*r.WCH,(b+.5)*r.WCH),biome=r.BIOMES[d.z].id;if(!d.sea)land++;
 families.set(d.worldFamily.id,(families.get(d.worldFamily.id)||0)+1);styles.set(nativeVisualFamily(d,r.seedOf),(styles.get(nativeVisualFamily(d,r.seedOf))||0)+1);native+=c.sp.length;const population=populationProfile(d,biome,r.seedOf,r.rng);visibleNative+=ecosystemField(c.sp,'sp',c.id,population,r.seedOf).length;
 const local=new Set();for(const o of [...populatedChunk(livingChunk(a,b,r.WCH,d,biome,r.seedOf,r.rng),a,b,r.WCH,d,populationProfile(d,biome,r.seedOf,r.rng),r.seedOf,r.rng)])local.add('living:'+o.kind);
 for(const o of expandedChunk(a,b,r.WCH,d,biome,[],r.seedOf,r.rng))local.add('living:'+o.kind);
 for(const o of microChunk(a,b,r.WCH,d,r.seedOf,r.rng))local.add('micro:'+o.kind);
 for(const o of c.playthings||[])local.add('toy:'+o.kind);for(const o of c.ecologyObjects||[])local.add('ecology:'+o.kind);
 for(const id of local)add(id);living+=local.size;
}
const missingRoutes=CONTENT_MANIFEST.flatMap(e=>[e.generator,e.renderer,e.audio].filter(f=>!existsSync(new URL('../src/'+f,import.meta.url))).map(file=>({id:e.id,file})));
const tracked=id=>/^(living|micro|toy|ecology):/.test(id);
const report={coverage:manifestCoverage(),sample:{chunks:count,landChunks:land,nativeIndividuals:native,visibleNativeIndividuals:visibleNative,observedFamilies:seen.size,worldFamilies:Object.fromEntries(families),visualStyles:Object.fromEntries(styles)},presence:CONTENT_MANIFEST.map(e=>({id:e.id,observedChunks:tracked(e.id)?seen.get(e.id)||0:null,denominator:tracked(e.id)?count:null,status:!tracked(e.id)?'not-instrumented':seen.has(e.id)?'observed':'not-observed-in-sample'})),missingRoutes,limits:['This is a deterministic spatial sample, not encounter probability per hour.','Absence in the sample is not proof of unreachable content.','Routes are declared; render, interaction and audio need their own checks.']};
if(process.argv[3])writeFileSync(process.argv[3],JSON.stringify(report,null,2)+'\n');
if(process.argv[4])writeFileSync(process.argv[4],['# Inventario del universo','',`Muestra determinista de ${count} chunks, antes de distancia y niebla. No es probabilidad por hora.`, '',`Familias coleccionables: ${report.coverage.families}. Entradas combinadas: ${report.coverage.entries}. Con práctica: ${report.coverage.practices}.`,'','Las rutas técnicas son declaraciones contrastadas con archivos. La presencia muestreada no demuestra visibilidad, interacción ni audio. Cero significa no observado en esta muestra.','', '| ID | Nombre | Práctica | Chunks observados | Generador → dibujo → audio |','|---|---|---|---|---|',...CONTENT_MANIFEST.map(e=>`| ${e.id} | ${e.name.replaceAll("|","/")} | ${e.labId||"Pendiente"} | ${tracked(e.id)?(seen.get(e.id)||0)+'/'+count:'Sin medición'} | ${e.generator} → ${e.renderer} → ${e.audio} |`),'','Regenerar: `node scripts/content-audit.mjs 1024 /tmp/contenido.json INVENTARIO_UNIVERSO.md`.',''].join('\n'));
console.log(JSON.stringify({coverage:report.coverage,sample:report.sample,missingRoutes},null,2));if(missingRoutes.length)process.exitCode=1;
