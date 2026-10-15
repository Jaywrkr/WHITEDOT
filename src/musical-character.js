// Arrangement policy, separate from world generation: old coordinates keep their DNA.
// MIDI registers refer to the audible fundamental, including octave-shifting instruments.
const CHARACTERS = {
  floor: {low:45,high:65,budget:[0,1,2,0],level:.62,air:.65,ceiling:7200,upper:false},
  bass: {low:48,high:68,budget:[0,2,3,0],level:.7,air:.8,ceiling:8200,upper:false},
  warm: {low:50,high:71,budget:[0,2,4,1],level:.8,air:.85,ceiling:9500,upper:false},
  organic: {low:52,high:72,budget:[0,2,4,1],level:.78,air:.8,ceiling:9500,upper:false},
  melodic: {low:53,high:76,budget:[0,3,5,1],level:.85,air:.9,ceiling:10500,upper:true},
  disco: {low:52,high:76,budget:[0,3,5,2],level:.82,air:.95,ceiling:10500,upper:true},
  calm: {low:45,high:67,budget:[0,1,2,0],level:.65,air:.55,ceiling:7200,upper:false},
  machine: {low:48,high:70,budget:[0,2,4,1],level:.72,air:.8,ceiling:9000,upper:false},
  broken: {low:50,high:72,budget:[0,2,4,1],level:.78,air:.8,ceiling:9500,upper:false},
};
export const GENRE_CHARACTERS = Object.freeze(Object.fromEntries(Object.entries({
  floor:'minimal rominimal microhouse minimaltechno dub acid acidhouse techhouse ebm',
  bass:'breaks dubstep dnb footwork miamibass trap',
  warm:'deep garage amapiano jazztronica chicago soulful garagehouse boombap lofi',
  organic:'afro tribal tropical andean organic',
  melodic:'progressive melodic melodictechno berlin detroit liquid gfunk',
  disco:'nudisco cosmic boogie',
  calm:'ambient heart downtempo',
  machine:'electro robotic ghetto baltimore jersey electrofunk detroitelectro',
  broken:'idm algorave brokenbeat',
}).flatMap(([character,ids])=>ids.split(' ').map(id=>[id,character]))));
for(const p of Object.values(CHARACTERS)){Object.freeze(p.budget);Object.freeze(p);}
export function musicalCharacter(genre){return CHARACTERS[GENRE_CHARACTERS[genre]||'warm'];}
const HOOKS={organic:['reed','kalimba'],andean:['reed','flute'],tribal:['membrane','marimba'],idm:['membrane','metalkeys'],ambient:['bowed','flute'],heart:['hollow','organ','flute'],electro:['hollow','metalkeys'],dub:['organ'],minimal:['keys','clav'],garage:['rhodes','keys'],downtempo:['rhodes','flute'],minimaltechno:['organ']};
for(const pool of Object.values(HOOKS))Object.freeze(pool);
export function hookInstruments(genre,definition){return HOOKS[genre]||definition.hookP;}
// Interaction palettes are separate from the radio: each object keeps its role and register.
const INTERACTIONS={
 floor:{acorde:['organ','hollow','pad','orbitorgan'],lead:['clav','plucked','hollow','resonantpluck','phasekeys']},
 bass:{acorde:['pad','rhodes','analogpad'],lead:['plucked','machine','rhodes','phasekeys','resonantpluck']},
 warm:{acorde:['rhodes','strings','pad','analogpad','choir'],lead:['rhodes','plucked','reed','phasekeys','resonantpluck']},
 organic:{acorde:['bowed','strings','pad','choir'],lead:['reed','plucked','kalimba','steel','resonantpluck','granularair']},
 melodic:{acorde:['strings','bowed','pad','analogpad'],lead:['saw','plucked','strings','reed','fmglass','phasekeys']},
 disco:{acorde:['rhodes','strings','organ','orbitorgan'],lead:['clav','brass','plucked','strings','phasekeys','orbitorgan']},
 calm:{acorde:['pad','bowed','strings','analogpad','choir'],lead:['bowed','plucked','hollow','flute','granularair','choir']},
 machine:{acorde:['hollow','pad','strings','analogpad'],lead:['machine','hollow','metalkeys','plucked','phasekeys','fmglass']},
 broken:{acorde:['pad','rhodes','bowed','analogpad'],lead:['membrane','metalkeys','plucked','reed','phasekeys','granularair']}
};
const ADVANCED_PALETTES={floor:['pluckbody','wavetable'],bass:['feltpiano','wavetable','pluckbody'],warm:['feltpiano','airflute','pluckbody'],organic:['airflute','pluckbody','feltpiano'],melodic:['silkstrings','wavetable','airflute'],disco:['feltpiano','pluckbody','wavetable'],calm:['graincloud','airflute','silkstrings'],machine:['wavetable','pluckbody','modaldrum'],broken:['modaldrum','wavetable','feltpiano']};
for(const [key,p]of Object.entries(INTERACTIONS)){p.lead=[...p.lead,...ADVANCED_PALETTES[key]];p.acorde=[...p.acorde,'silkstrings','graincloud'];Object.freeze(p.acorde);Object.freeze(p.lead);Object.freeze(p);}
Object.freeze(INTERACTIONS);
export function interactionInstruments(genre,definition,role){
 const profile=INTERACTIONS[GENRE_CHARACTERS[genre]||'warm'];
 return role==='acorde'?profile.acorde:[...new Set([...hookInstruments(genre,definition),...profile.lead])];
}
export function expressiveBassInstruments(genre,definition){
 const native=definition.bassP||[definition.bassI];
 return ['deep','dub','ambient','downtempo','organic','liquid','lofi'].includes(genre)?[...new Set([...native,'velvetbass'])]:native;
}
export function voiceRegister(voice,genre){
  if(voice.role==='bajo'||voice.role==='perc')return voice;
  const high=Math.min(voice.high,musicalCharacter(genre).high),low=Math.min(voice.low,high-12);
  return high===voice.high&&low===voice.low?voice:{...voice,low,high};
}
export function inRegister(note,low,high){
  while(note<low)note+=12;
  while(note>high)note-=12;
  return note;
}
// Glass synthesis adds an octave. Bound its audible note before passing it to the synth.
export function hookPitch(instrument,note,profile){
  return inRegister(note,profile.low,profile.high)-(instrument==='glass'?12:0);
}
