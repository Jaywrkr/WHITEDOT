import {GENRE_CHARACTERS,interactionInstruments} from './musical-character.js';
import {activeWorldFamily} from './world-families.js';
// Composition grammars, not arbitrary mixing of genre labels or recorded songs.
const style=(id,name,characters,instruments,steps,tones,progression,brightness,high,swing=0,harmony=false)=>({id,name,characters:characters.split(' '),instruments:instruments.split(' '),steps,tones,progression,brightness,high,swing,harmony});
export const HYBRID_STYLES=[
 style('guitar-machine','Guitarra y máquina','floor machine disco melodic','p_gutguitar p_barkkeys p_cellobody',[0,3,8,11],[0,2,4,5],[0,5,3,4],5400,69,.04,true),
 style('italo-current','Disco de secuencias','floor machine disco melodic','phasekeys p_fmharp clav',[0,2,6,10],[0,2,4,5],[0,5,3,4],6200,71,.02,true),
 style('blues-machine','Blues modular','floor warm machine','feltpiano pluckbody rhodes',[0,3,7,10],[0,2,3,4,6],[0,0,0,0,3,3,0,0,4,3,0,4],5200,67,.12),
 style('soul-glow','Soul eléctrico','warm disco melodic','feltpiano rhodes silkstrings',[0,6,10,14],[0,1,2,4,5],[0,5,1,4],5700,70,.12,true),
 style('jazz-tide','Jazz entre mareas','warm broken calm','feltpiano phasekeys airflute',[0,3,9,14],[0,1,2,4,6],[1,4,0,5],5400,69,.18,true),
 style('dub-roots','Raíces dub','floor organic calm','orbitorgan pluckbody graincloud',[0,6,14],[0,2,4],[0,0,3,0],4300,64,.03),
 style('funk-orbit','Funk orbital','disco warm machine','clav feltpiano wavetable',[0,3,6,10,14],[0,2,4,5],[0,5,3,4],6500,71,.1),
 style('folk-grain','Cuerdas de tierra','organic calm','airflute pluckbody graincloud',[0,3,10,14],[0,2,3,4,6],[0,3,5,4],5500,68,.08),
 style('afro-poly','Raíz polirrítmica','organic floor broken','membrane modaldrum pluckbody',[0,3,6,10,12],[0,2,4],[0,0,3,4],5800,67,.08),
 style('garage-soul','Soul entre pulsos','warm broken disco','feltpiano phasekeys rhodes',[0,3,7,14],[0,2,4,6],[0,5,3,4],5800,70,.2,true),
 style('cosmic-drift','Deriva cósmica','melodic disco calm','silkstrings wavetable choir',[0,4,10,14],[0,1,2,4,5],[0,3,5,4],6900,73,.03,true),
 style('industrial-soft','Máquina de terciopelo','machine floor bass','wavetable hollow phasekeys',[0,3,8,11],[0,2,4],[0,0,4,0],4700,65,0),
 style('liquid-soul','Soul líquido','bass melodic warm','feltpiano silkstrings phasekeys',[0,6,10],[0,2,4,6],[0,5,3,4],5600,69,.025,true),
 style('berlin-evolve','Secuencia del horizonte','machine melodic calm','wavetable silkstrings orbitorgan',[0,2,6,10,14],[0,2,4,3],[0,3,5,0],6100,70,0),
 style('ambient-tape','Cinta suspendida','calm warm organic','graincloud silkstrings feltpiano',[0,8],[0,2,4],[0,5,0,3],3900,64,0,true),
 style('modal-wind','Vientos modales','organic melodic calm','airflute reed bowed',[0,6,12],[0,1,3,4],[0,3,1,0],5100,67,.025),
 style('acid-dub','Resonancia dub','floor machine bass','hollow wavetable pluckbody',[0,3,8,14],[0,2,4],[0,0,4,0],4700,65,.025),
 style('silence-bass','Grave y espacio','floor bass calm','hollow graincloud bowed',[0,10],[0,4],[0,0,3,0],3400,62,0),
];
for(const h of HYBRID_STYLES){for(const v of Object.values(h))if(Array.isArray(v))Object.freeze(v);Object.freeze(h);}Object.freeze(HYBRID_STYLES);
const cache=new WeakMap();
export function hybridIdentity(region,seedOf,rng){
 const family=activeWorldFamily(region);if(!family||region.sea)return null;
 if(cache.has(region))return cache.get(region);
 const r=rng(seedOf(`music:hybrid:v1:${region.key}:${region.genre}`));if(r()<.22){cache.set(region,null);return null;}
 const character=GENRE_CHARACTERS[region.genre]||'warm',pool=HYBRID_STYLES.filter(h=>h.characters.includes(character)&&(h.id!=='blues-machine'||region.scale?.[2]===3));
 const original=pool.filter(h=>!['guitar-machine','italo-current'].includes(h.id)),base=original[Math.floor(r()*original.length)],extras=HYBRID_STYLES.filter(h=>['guitar-machine','italo-current'].includes(h.id)&&h.characters.includes(character)),extraSeed=seedOf('music:fusion-extension:v1:'+region.key+':'+region.genre)>>>0,selected=extras.length&&extraSeed%100<14?extras[(extraSeed>>>8)%extras.length]:base,out=Object.freeze({...selected,version:1,variant:Math.floor(r()*32),harmonyBars:selected.id==='blues-machine'?1:4+Math.floor(r()*3)*2});
 cache.set(region,out);return out;
}
export function hybridArrangement(track,region,bar,hybrid,genres){
 if(!hybrid)return track;
 const native=genres[region.genre],allowed=interactionInstruments(region.genre,native,'lead'),pool=hybrid.instruments.filter(id=>allowed.includes(id)),
  budget=Math.min(track.hook.filter(n=>n>=0).length,hybrid.id==='silence-bass'?1:hybrid.id==='ambient-tape'?2:4),
  answer=Math.floor(Math.max(0,bar)/4)%4,steps=hybrid.steps.slice(0,budget),hook=Array(16).fill(-1),tones=hybrid.tones;
 if(!track.melodyRest)steps.forEach((s,i)=>{hook[s]=i===0?0:tones[(i+hybrid.variant+(answer===1?1:answer===2?2:0))%tones.length];});
 if(answer===3)for(let s=1;s<16;s++)if(s%8)hook[s]=-1;
 const grammar={...track.grammar,progression:hybrid.progression,harmonyBars:hybrid.harmonyBars,
  brightness:Math.min(track.grammar.brightness,hybrid.brightness),hookLevel:track.grammar.hookLevel*.9,
  accents:hybrid.id==='afro-poly'?[3,6,10,14]:track.grammar.accents,accentInstrument:hybrid.id==='afro-poly'?'wood':track.grammar.accentInstrument};
 const hooks=pool.length?pool:track.identity.hooks,
  identity={...track.identity,hooks,swing:Math.min(.28,(track.identity.swing||0)*.6+hybrid.swing*.4),air:track.identity.air*(hybrid.high<66?.65:.9)};
 return {...track,hybrid,hook,grammar,identity,hookI:hooks[(hybrid.variant+track.section)%hooks.length],
  expression:{...track.expression,toneScale:track.expression.toneScale*(answer===3?.75:.9),attackScale:Math.min(2.25,track.expression.attackScale*(hybrid.high<66?1.2:1))}};
}
export function hybridRegister(voice,hybrid){
 if(!hybrid||['bajo','perc'].includes(voice.role))return voice;
 const high=Math.min(voice.high,hybrid.high),low=Math.min(voice.low,high-12);return {...voice,low,high};
}
