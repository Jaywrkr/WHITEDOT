import {arrangementPhrase,phraseNotes,phraseDrums} from './arrangement-phrases.js';
import {productionIdentity} from './production-identities.js';
import {RHYTHM_GENRES,rhythmPattern} from './rhythms.js';
import {REFERENCE_GENRES,REFERENCE_STEPS,referenceRhythm} from './references.js';
import {hybridIdentity} from './musical-hybrids.js';
import {directedLeads} from './music-direction.js';
import {territorialOrchestra,territoryInstrument} from './territory-presentation.js';
import {electronicEnsemble,ensembleVoices} from './electronic-ensemble.js';
// Playback-only musical territories. Independent seeds never move existing objects.
const pattern=s=>Object.freeze([...s].map(n=>n==='.'?-1:Number(n)));
const band=(id,name,characters,leads,bass,hook,drums,ceiling,swing,progression)=>Object.freeze({
 id,name,festive:['patio','aurora','verbena'].includes(id),characters:Object.freeze(characters.split(' ')),leads:Object.freeze(leads.split(' ')),
 bass:pattern(bass),hook:Object.freeze(hook),drums:Object.freeze(Object.fromEntries(Object.entries(drums).map(([id,steps])=>[id,Object.freeze(steps)]))),ceiling,swing,progression:Object.freeze(progression),version:1,
});
export const LAB_BANDS=Object.freeze([
 band('interlock','Membranas entrelazadas','organic floor broken','membrane pluckbody kalimba','0..0..4..0..2...',[0,6,10],{conga:[0,3,6,10,12],wood:[2,8,14],shaker:[3,7,11,15]},4400,.06,[0,0,3,4]),
 band('silk','Jardín de cuerdas','floor organic melodic calm','pluckbody bowed silkstrings','0.......4...0...',[0,7,10],{rim:[6,14],wood:[3,11]},3600,.04,[0,3,5,4]),
 band('breath','Ruinas de aire','calm organic melodic','airflute reed graincloud','0...........4...',[0,6],{tom:[0,10],shaker:[6,14]},3000,0,[0,5,0,3]),
 band('heavy','Cantera de pulsos','broken bass machine','hollow wavetable membrane','0..0...4..0...2.',[0,3,10],{snare:[4,12],tom:[7,14],wood:[11]},3900,0,[0,0,4,0]),
 band('warm','Tejido eléctrico','warm disco melodic','feltpiano rhodes phasekeys','0..0..4.2...0.4.',[0,6,10,14],{rim:[4,12],shaker:[2,6,10,14]},4200,.12,[0,5,3,4]),
 band('patio','Patio tropical','organic warm floor','p_gutguitar p_panreed p_feltmallet','0..0..4.2.0...4.',[0,3,6,10],{conga:[0,3,6,10,14],wood:[7,15],shaker:[2,6,10,14]},3900,.11,[0,3,4,0]),
 band('aurora','Jardín disco','disco warm floor','p_tinepiano p_barkkeys p_fogorgan','0..0.4.2..0.4.2.',[0,6,10,14],{rim:[4,12],wood:[3,11],shaker:[2,6,10,14]},4200,.14,[0,5,3,4]),
 band('verbena','Verbena eléctrica','organic disco warm floor','p_wireharp p_ebonypiano p_softhorn','0..4..0.2.0...4.',[0,3,8,14],{conga:[3,6,11],rim:[4,12],shaker:[2,10,14]},4000,.08,[0,3,0,4]),
 band('pulse','Circuitos de madera','machine floor bass disco','clav orbitorgan resonantpluck','0.....0...4.....',[0,7,14],{wood:[3,11],rim:[14]},3400,.035,[0,0,3,0]),
]);
// Original festive interpretations, selected only in compatible dance territories.
const FESTIVE_GENRES=new Set('deep techhouse tropical afro nudisco cosmic boogie electrofunk chicago soulful garagehouse acidhouse'.split(' '));
export function festiveBand(region,seedOf){if(!region||region.sea||!FESTIVE_GENRES.has(region.genre))return null;const p=String(region.key).match(/(-?\d+),(-?\d+)$/);if(!p)return null;const zone=Math.floor(Number(p[1])/2)+','+Math.floor(Number(p[2])/2),h=seedOf('festival:territory:v1:'+zone);if(h%100>=65)return null;const ids=region.genre==='tropical'||region.genre==='afro'?['patio','verbena']:region.genre==='nudisco'||region.genre==='cosmic'||region.genre==='boogie'||region.genre==='electrofunk'?['aurora','verbena']:['patio','aurora','verbena'];return LAB_BANDS.find(b=>b.id===ids[(h>>>8)%ids.length]);}
const FOUR=[0,4,8,12],OFF=[2,6,10,14],EIGHT=[0,2,4,6,8,10,12,14];
const BASE_DRUMS={
 minimal:{kick:FOUR,rim:[14],hat:[6,14]},deep:{kick:FOUR,clap:[4,12],hat:OFF,wood:[7]},
 rominimal:{kick:FOUR,rim:[5,13],shaker:[3,7,11,15]},microhouse:{kick:FOUR,wood:[3,11],hat:[2,7,10,15]},
 minimaltechno:{kick:FOUR,wood:[3,11],hat:OFF},acid:{kick:FOUR,clap:[4,12],hat:[2,6,10,14,15]},
 dub:{kick:FOUR,rim:[12],hat:[6,14]},breaks:{kick:[0,7,10],snare:[4,12],hat:EIGHT},
 garage:{kick:[0,6,10],snare:[4,12],hat:[2,3,6,10,11,14]},dubstep:{kick:[0,7,10],snare:[8],hat:[2,6,14]},
 dnb:{kick:[0,6,10],snare:[4,12],hat:EIGHT},afro:{kick:FOUR,conga:[0,3,6,10,12],shaker:[3,7,11,15]},
 tribal:{kick:[0,8],conga:[0,3,6,10,12],wood:[2,8,14]},downtempo:{kick:[0,10],rim:[4,12],shaker:[6,14]},
 ambient:{kick:[],wood:[0]},heart:{kick:[0,3],wood:[14]},
 progressive:{kick:FOUR,clap:[4,12],hat:OFF,rim:[11]},melodic:{kick:FOUR,rim:[4,12],hat:[6,14]},
 tropical:{kick:FOUR,conga:[3,6,10,14],shaker:OFF},nudisco:{kick:FOUR,clap:[4,12],hat:OFF,wood:[3,15]},
 robotic:{kick:[0,6,10],snare:[4,12],hat:EIGHT},electro:{kick:[0,6,10],clap:[4,12],hat:EIGHT},
};
const character=genre=>({ambient:'calm',heart:'calm',downtempo:'organic',organic:'organic',afro:'organic',tribal:'organic',andean:'organic',tropical:'organic',breaks:'broken',garage:'broken',idm:'broken',algorave:'broken',brokenbeat:'broken',footwork:'broken',jersey:'broken',baltimore:'broken',dubstep:'bass',trap:'bass',amapiano:'bass',miamibass:'bass',dnb:'bass',liquid:'bass',robotic:'machine',ebm:'machine',berlin:'machine',electro:'machine',detroitelectro:'machine',melodic:'melodic',melodictechno:'melodic',progressive:'melodic',detroit:'melodic',cosmic:'disco',nudisco:'disco',boogie:'disco',electrofunk:'disco',deep:'warm',soulful:'warm',jazztronica:'warm',lofi:'warm',boombap:'warm',gfunk:'warm',chicago:'warm',garagehouse:'warm'}[genre]||'floor');
export function labScore(region,seedOf,rng){
 if(!region||region.sea)return null;
 const kind=character(region.genre),pool=LAB_BANDS.filter(p=>!p.festive&&p.characters.includes(kind));
 const pair=String(region.key).match(/(-?\d+),(-?\d+)$/),territory=pair?`${Math.floor(Number(pair[1])/2)},${Math.floor(Number(pair[2])/2)}`:region.key;
 const r=rng(seedOf(`lab:band:v1:${territory}:${kind}`)),base=festiveBand(region,seedOf)||pool[Math.floor(r()*pool.length)];
 const individual=rng(seedOf(`lab:individual:v1:${region.key}:${region.genre}`));
 const leads={interlock:['silkpluck','skinpluck','handslap'],silk:['silkpluck','skinpluck','lowbow'],breath:['bamboowind','clayflute','duskpad'],heavy:['feltkeys','lowbow','skinpluck'],warm:['feltkeys','lowbow','duskpad'],pulse:['skinpluck','feltkeys','duskpad']}[base.id]||base.leads;
 const hybrid=hybridIdentity(region,seedOf,rng),production=productionIdentity(region,seedOf,hybrid),native=RHYTHM_GENRES[region.genre]||REFERENCE_GENRES[region.genre],variant=Math.floor(individual()*16),
  nativeDrums=RHYTHM_GENRES[region.genre]?rhythmPattern(region.genre,variant%3):referenceRhythm(region.genre,variant%3)||BASE_DRUMS[region.genre],
  bassPool=native?.bassP||[region.track?.bassI||'hollow','reedbass','velvetbass'],
  primary=[...new Set([...production.leads,...(base.festive?leads:directedLeads(region.genre,leads,[],native?.hookP||[])).slice(0,1)])],
  orchestra=territorialOrchestra(region,primary,base.festive?hybrid?.instruments||[]:directedLeads(region.genre,leads,hybrid?.instruments||[],native?.hookP||[]),seedOf);
 const ensembleSeed=seedOf('territory:ensemble:v1:'+territory+':'+region.genre)>>>0,
  ensemble=['ambient','heart'].includes(region.genre)?1:1+ensembleSeed%3;
 const plan=electronicEnsemble(region,kind,ensemble,seedOf),electronic=Object.freeze({...plan,pool:Object.freeze([...new Set([production.comp,production.answer,...plan.pool])])});
 return Object.freeze({...base,production,orchestra,ensemble,electronic,leads:Object.freeze([...orchestra.primary,...orchestra.secondary]),
  nativeDrums:nativeDrums?Object.freeze(Object.fromEntries(Object.entries(nativeDrums).map(([id,steps])=>[id,Object.freeze([...steps])]))):null,hook:Object.freeze([...(base.festive?base.hook:hybrid?.steps||native?.steps||REFERENCE_STEPS[region.genre]||base.hook)]),
  bass:Object.freeze([...(native?.bass||region.track?.bass||base.bass)]),version:6,territory,variant,genre:region.genre,
  bassI:native?.bassP?bassPool[Math.floor(individual()*bassPool.length)]:production.bassI,
  ceiling:region.genre==='ambient'?Math.min(3000,base.ceiling):base.ceiling,
  swing:Math.min(.28,native?.sw??region.track?.swing??base.swing),
  kick:Object.freeze([...(nativeDrums?.kick||(kind==='calm'?[]:kind==='broken'||kind==='bass'?[0,7,10]:FOUR))]),
 });
}
export function labArrangement(frame,score,environment={}){
 if(!score)return frame;
 const chapter=Math.floor(Math.max(0,frame.harmonyBar||0)/16),quiet=(environment.initiative||0)>.35,
  scene=chapter%6,orchestra=(score.variant+chapter+(quiet?1:0))%score.leads.length,
  phrasing=score.production?arrangementPhrase(frame.harmonyBar||0,score.variant):null,evolved={...score,phrasing,scene,quiet,listenQuiet:environment.quiet===true},
  foundation=frame.section===0&&(score.ensemble>1||score.electronic?.count===1)&&!environment.quiet,
  rest=frame.melodyRest&&!foundation||scene===5,cycle=Math.floor(Math.max(0,frame.phrase)/2)%4,hook=Array(16).fill(-1),budget=Math.min(4,frame.grammar.hookLimit);
 if(!rest)score.hook.slice(0,budget).forEach((s,i)=>{if(cycle!==3||i===0)hook[s]=(frame.hybrid?.tones||[0,2,4,3])[(i+(cycle===2?1:0)+score.variant)%(frame.hybrid?.tones?.length||4)];});
 const bass=score.bass.map((n,s)=>frame.section===0&&s!==0&&s%8!==0?-1:n);
 const floor=environment.quiet||scene===5?.16:(score.electronic?.count||0)>=8?.48:(score.electronic?.count||0)>=6?.38:.22;
 return {...frame,phrasing,energy:Math.min(.86,Math.max(frame.energy??.25,floor)*(phrasing?.energy||1)),labScore:evolved,labEvolution:{chapter,scene,quiet},hybrid:frame.hybrid||null,melodyRest:rest,hook,bass,bassI:score.bassI,hookI:score.orchestra?territoryInstrument(score.orchestra,Math.floor(Math.max(0,frame.harmonyBar||0)/4),chapter+(quiet?1:0)):score.leads[orchestra],
  identity:{...frame.identity,id:`lab:${score.id}`,name:score.name,hooks:score.leads,bassI:score.bassI,swing:score.swing,air:Math.min(.5,frame.identity?.air??.5)},
  grammar:{...frame.grammar,progression:frame.hybrid?.progression||score.progression,harmonyBars:frame.hybrid?.harmonyBars||8,brightness:Math.min(frame.grammar.brightness,score.ceiling),hookLevel:frame.grammar.hookLevel*(scene===1?.55:.85),accents:[]},
  expression:{...frame.expression,harmony:false,toneScale:Math.min(1,frame.expression.toneScale),attackScale:frame.expression.attackScale*(score.id==='breath'?1.4:1)},
 };
}
// All event offsets are fractions of one sixteenth; the electronic clock stays shared.
export function labNoteEvents(frame,step,bar){
 if(!frame?.labScore||!Number.isInteger(step)||step<0||step>15)return [];
 const score=frame.labScore,cycle=Math.floor(Math.max(0,bar))%8,answer=cycle%4===2,rest=cycle%4===3,
  events=[],bass=frame.bass[step],hook=frame.hook[step],variant=score.variant;
 if((!score.electronic||score.electronic.layers.includes('bass'))&&bass>=0&&(!rest||step===0||step===8))events.push({role:'bajo',degree:answer&&step!==0?Math.min(7,bass+2):bass,
  instrument:frame.bassI,offset:0,level:step%4===0?1:.8,technique:cycle%2?'muted':'normal'});
 if(!frame.melodyRest&&hook>=0&&(!rest||step===0)){
  const degree=rest?0:answer?[4,2,0][(hook+variant)%3]:hook;
  events.push({role:'lead',degree,instrument:frame.hookI,offset:score.id==='breath'?.22:0,
   level:step===0?.85:.68,technique:answer&&['silk','breath'].includes(score.id)?'slide':step%4?'ghost':'normal'});
 }
 // Sparse voiced harmony belongs to the arrangement, never a continuous organ bed.
 const kind=character(score.genre);
 if(!score.electronic&&step===0&&bar%8===0&&frame.section>0&&!frame.melodyRest&&score.scene!==5&&(frame.hybrid?.harmony||['warm','disco'].includes(kind)))
  events.push({role:'acorde',degree:0,instrument:['warm','disco'].includes(kind)?'p_tinepiano':'p_cellobody',offset:0,level:.45,technique:'muted'});
 // Rich territories are full ensembles from arrival, with a deliberate release each fourth bar.
 // Complementary voices share harmony; no new random pitch is generated per hit.
 const localBar=Math.floor(Math.max(0,frame.harmonyBar??bar)),position=localBar%4,
  answerSteps=score.ensemble===3?[4,12]:[12],voices=(score.leads||[]).filter(id=>id!==frame.hookI),
  harmonyPools={warm:['p_tinepiano','p_cellobody','p_gutguitar'],disco:['rhodes','p_softhorn','p_cellobody'],organic:['p_cellobody','p_tinepiano','p_gutguitar'],machine:['p_barkkeys','p_feltmallet','phasekeys'],broken:['p_tinepiano','p_gutguitar','p_cellobody'],bass:['p_cellobody','p_barkkeys','p_tinepiano'],melodic:['p_cellobody','p_tinepiano','p_gutguitar'],floor:['rhodes','p_gutguitar','p_cellobody']},
  harmony=(harmonyPools[kind]||harmonyPools.floor).filter(id=>id!==frame.hookI),
  group=score.electronic?ensembleVoices(score.electronic,frame.hookI,score.variant):null,
  comp=group?.chords||harmony[score.variant%harmony.length],answerVoice=group?.counter||voices.find(id=>id!==comp),
  enriched=(score.electronic?score.electronic.layers.includes('chords'):score.ensemble>1)&&!frame.melodyRest&&score.scene!==5&&!score.listenQuiet;
 if(enriched&&position!==3){
  if(step===0&&(score.ensemble===3||position%2===0)||score.ensemble===3&&step===8&&position===1){
   // Replace the sparse harmonic entry when it coincides with this comping part.
   const existing=events.findIndex(e=>e.role==='acorde');if(existing>=0)events.splice(existing,1);
   events.push({role:'acorde',part:'comp',degree:0,instrument:comp,offset:0,level:score.ensemble===3?.85:.7,technique:'muted'});
  }
  if(answerVoice&&(!score.electronic||score.electronic.layers.includes('counter'))&&position>0&&answerSteps.includes(step)&&hook<0){
   const index=answerSteps.indexOf(step),degree=[2,4,2,0][((position-1)*2+index)%4];
   events.push({role:'lead',part:'answer',degree,instrument:answerVoice,offset:0,level:score.ensemble===3?.62:.5,technique:'muted'});
  }
 }
 if(group&&!frame.melodyRest&&!score.listenQuiet&&score.scene!==5&&position!==3){
  if(score.electronic.layers.includes('sequence')&&[2,6,10,14].includes(step)&&hook<0)
   events.push({role:'lead',part:'sequence',degree:[0,2,4,2][(step-2)/4],instrument:group.sequence,offset:0,level:.38,technique:position===2?'slide':'muted'});
  if(score.electronic.layers.includes('air')&&step===8&&position===0)
   events.push({role:'lead',part:'air',degree:4,instrument:group.air,offset:0,level:.52,technique:'normal'});
 }
 return phraseNotes(events,frame.phrasing,step);
}
export function labDrumEvents(score,step,bar,energy){
 if(!score||!Number.isInteger(step)||step<0||step>15||!Number.isFinite(energy)||energy<=.12)return [];
 const out=[],cycle=((Math.floor(bar)%8)+8)%8,rest=cycle===7||score.scene===5,
  layer=instrument=>instrument==='kick'?'kick':instrument==='rim'||/snare|clap/i.test(instrument)?'snare':/hat|shaker/.test(instrument)?'hats':'percussion',
  push=(instrument,gain,pitch,offset=0,technique='normal')=>{if(!score.electronic||score.electronic.layers.includes(layer(instrument)))out.push({instrument,gain,pitch,offset,technique});};
 if(score.kick.includes(step)&&(!rest||step===0||step===8))push('kick',score.id==='heavy'?.2:.16,48);
 if(energy>.24&&!rest&&score.scene!==1)for(const [original,steps]of Object.entries(score.nativeDrums||score.drums))if(steps.includes(step)){
  if(original==='kick'||original==='chord')continue;
  if(energy<.4&&step%4!==0&&(step+bar)%2)continue;
  const instrument=score.electronic?original:original==='conga'?'handslap':original==='tom'?'skinbass':['snare','clap','clapRoll'].includes(original)?'acousticsnare':['hat','hatO','hatRoll'].includes(original)?'shaker':original;
  push(instrument,/hat|shaker/.test(instrument)?.011:/snare|clap/.test(instrument)?.046:.035,
   ['handslap','conga'].includes(instrument)?48+(step%3)*3:['skinbass','tom'].includes(instrument)?40+step%3*2:/snare|clap/.test(instrument)?48+step%2*2:72+step%3*18,0,step%4?'ghost':'accent');
 }
 if(score.nativeDrums&&energy>.32&&!rest&&score.scene!==1)for(const [original,steps]of Object.entries(score.drums)){
  const instrument=score.electronic?original:original==='conga'?'handslap':original==='tom'?'skinbass':original==='snare'?'acousticsnare':original;
  if(steps.includes(step)&&!out.some(e=>e.instrument===instrument))push(instrument,.022,instrument==='handslap'?50:instrument==='skinbass'?43:instrument==='acousticsnare'?48:72);
 }
 // Three hand strokes span two beats against the binary kick (3:2).
 if(score.id==='interlock'&&energy>.38&&!rest&&score.scene!==1){
  for(const at of [0,8/3,16/3])if(Math.floor(at)===step%8)push('handslap',.028,50+cycle%3,at-Math.floor(at),step%8===0?'accent':'normal');
 }
 // A short pickup once per eight bars; it replaces density rather than piling up.
 if(cycle===6&&energy>.42&&[14,15].includes(step)&&!['breath','silk'].includes(score.id)){
  push('skinbass',.025,43+(step-14)*3,.5,'muted');
 }
 return phraseDrums(out.slice(0,3),score.phrasing,step);
}

// Keep each species' role; territory and individual choose the playing material.
export function labInteractionVoice(raw,score,kind,source,seedOf){
 if(!score||!raw||kind==='pulso'||kind==='reliquia'||kind.startsWith('heritage:')||kind.startsWith('rhythm:'))return raw;
 const key=source?.id||`${source?.x??0},${source?.y??0}`,h=seedOf(`lab:gesture:v1:${score.id}:${kind}:${key}`),
  pool=raw.role==='bajo'?['reedbass','velvetbass','hollow']:raw.role==='perc'?score.id==='heavy'?['acousticsnare','skinbass','handslap']:['skinbass','handslap','wood']:
   raw.role==='acorde'?['duskpad','lowbow','feltkeys']:score.leads,
  festivePools={bajo:['p_roundbass','p_woodybass'],perc:['p_claypot','p_seedshake','p_woodrim'],acorde:['p_fogorgan','p_velvetchoir']},
  voices=score.festive?(festivePools[raw.role]||score.leads):pool;
 return {...raw,instrument:voices[h%voices.length],labTerritory:score.id,low:raw.role==='bajo'||raw.role==='perc'?36:45,
  high:raw.role==='bajo'?54:raw.role==='perc'?57:69,technique:['normal','muted','slide','normal'][Math.floor(h/7)%4]};
}
