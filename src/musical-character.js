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
 floor:{acorde:['organ','hollow','pad'],lead:['clav','plucked','hollow']},
 bass:{acorde:['pad','rhodes'],lead:['plucked','machine','rhodes']},
 warm:{acorde:['rhodes','strings','pad'],lead:['rhodes','plucked','reed']},
 organic:{acorde:['bowed','strings','pad'],lead:['reed','plucked','kalimba','steel']},
 melodic:{acorde:['strings','bowed','pad'],lead:['saw','plucked','strings','reed']},
 disco:{acorde:['rhodes','strings','organ'],lead:['clav','brass','plucked','strings']},
 calm:{acorde:['pad','bowed','strings'],lead:['bowed','plucked','hollow','flute']},
 machine:{acorde:['hollow','pad','strings'],lead:['machine','hollow','metalkeys','plucked']},
 broken:{acorde:['pad','rhodes','bowed'],lead:['membrane','metalkeys','plucked','reed']}
};
for(const p of Object.values(INTERACTIONS)){Object.freeze(p.acorde);Object.freeze(p.lead);Object.freeze(p);}
Object.freeze(INTERACTIONS);
export function interactionInstruments(genre,definition,role){
 const profile=INTERACTIONS[GENRE_CHARACTERS[genre]||'warm'];
 return role==='acorde'?profile.acorde:[...new Set([...hookInstruments(genre,definition),...profile.lead])];
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
