import {writeFileSync} from 'node:fs';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {createRadio} from '../src/radio.js';import {labNoteEvents,labScore} from '../src/lab-score.js';import {nativeVisualFamily} from '../src/native-visual.js';
import {populationProfile} from '../src/living-populations.js';import {ecosystemField} from '../src/ecosystem-field.js';import {manifestCoverage} from '../src/content-manifest.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const rows=[],checks=[],errors=[];
const check=(name,ok,details)=>{checks.push({name,passed:!!ok,details});if(!ok)errors.push(name);};
for(const generation of [1,2]){
 globalThis.location={search:generation===2?'?testSeed=reencuentro-audit&layout=wide&generation=2':''};
 const r={};data(r);progress(r);world(r);const genres=new Map(),families=new Set(),styles=new Set(),parts=new Set(),R=r.REG*r.WCH;
 for(let x=-32;x<32;x++)for(let y=-32;y<32;y++){const d=r.regionOfPos((x+.5)*R,(y+.5)*R);families.add(d.worldFamily.id);if(!d.sea){parts.add(labScore(d,r.seedOf,r.rng).electronic.count);styles.add(nativeVisualFamily(d,r.seedOf));if(!genres.has(d.genre))genres.set(d.genre,d);}}
 check('families-g'+generation,families.size===8,[...families]);check('styles-g'+generation,styles.size===5,[...styles]);check('genres-g'+generation,genres.size===52,genres.size);
 const footprints=new Set();let primaryNotes=0,notes=0,invalid=0,raw=0,visible=0;
 for(const [genre,d]of genres){const before=JSON.stringify(d),radio=createRadio(r.seedOf,r.rng,r.GEN,{living:()=>true,reference:()=>true}),instruments=new Set();
  for(let bar=0;bar<64;bar++){const f=radio.advance(d,bar);if(f.referenceOrigin!=='acd766f')invalid++;if(f.labScore)parts.add(f.labScore.electronic.count);
   footprints.add(JSON.stringify([genre,f.hook,f.bass,f.hookI,f.grammar.progression]));
   for(let step=0;step<16;step++)for(const event of labNoteEvents(f,step,bar)){notes++;if(!event.part&&event.role==='lead')primaryNotes++;instruments.add(event.instrument);if(!Number.isInteger(event.degree)||event.degree<0||event.degree>9||!event.instrument||!Number.isFinite(event.level))invalid++;}
  }
  check('map-intact-g'+generation+'-'+genre,JSON.stringify(d)===before,d.key);rows.push({generation,genre,key:d.key,family:d.worldFamily.id,visual:nativeVisualFamily(d,r.seedOf),instruments:[...instruments]});
 }
 for(let i=0;i<256;i++){const a=i%32-16,b=Math.floor(i/32)-8,c=r.wchunk(a,b),d=r.regionOfPos((a+.5)*r.WCH,(b+.5)*r.WCH),p=populationProfile(d,r.BIOMES[d.z].id,r.seedOf,r.rng);raw+=c.sp.length;visible+=ecosystemField(c.sp,'sp',c.id,p,r.seedOf).length;}
 check('finite-composed-events-g'+generation,invalid===0&&primaryNotes>1000,{invalid,primaryNotes,notes});check('phrase-diversity-g'+generation,footprints.size>=100,footprints.size);check('populated-but-bounded-g'+generation,visible>0&&visible<raw,{raw,visible});check('sparse-and-rich-g'+generation,Math.min(...parts)<=2&&Math.max(...parts)>=9,[...parts].sort((a,b)=>a-b));
}
const report={reference:'acd766f',checks,rows,coverage:manifestCoverage(),errors,limits:['Compositional decisions, declared routes and spatial presence only.','Recording graphs and Node render adapters are not DSP, raster or physical listening.','Per-hour rarity cannot be inferred from this deterministic spatial sample.','CI browser/audio and listening approval remain publication gates.']};if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({checks:checks.length,errors,coverage:report.coverage,styles:rows.length},null,2));if(errors.length)process.exitCode=1;
