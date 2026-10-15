import {GENRE_CHARACTERS} from './musical-character.js';
// Playback-only production choices. Never changes maps, native patterns or saved ownership.
const profile=(id,name,room,space,echo,feedback,attack,decay,leads)=>Object.freeze({id,name,room,space,echo,feedback,attack,decay,leads:Object.freeze(leads.split(' '))});
export const MUSIC_DIRECTIONS=Object.freeze({
 floor:profile('dry','Pulso seco',.25,0,.18,.22,.7,.62,'feltkeys clav skinpluck p_barkkeys'),
 bass:profile('body','Cuerpo grave',.22,0,.12,.2,.8,.72,'feltkeys membrane p_bassclarinet p_claypot'),
 warm:profile('warm','Calor eléctrico',.36,.04,.2,.24,.9,.95,'rhodes feltpiano p_tinepiano p_gutguitar'),
 organic:profile('earth','Madera y piel',.34,.03,.2,.25,.85,.8,'pluckbody p_gutguitar p_panreed kalimba'),
 machine:profile('mechanical','Máquina cercana',.22,0,.2,.24,.65,.55,'phasekeys machine p_fmharp metalkeys'),
 broken:profile('elastic','Síncopa y textura',.28,.02,.16,.22,.75,.72,'feltkeys membrane p_brushkit resonantpluck'),
 melodic:profile('chamber','Cuerdas y movimiento',.43,.12,.26,.28,1.05,1.1,'lowbow feltpiano p_cellobody phasekeys'),
 disco:profile('disco','Disco cálido',.32,.03,.18,.23,.75,.78,'p_barkkeys p_tinepiano clav p_softhorn'),
 calm:profile('tape','Cinta y respiración',.4,.14,.24,.3,1.1,1.05,'p_tapepiano bamboowind lowbow pluckbody'),
 dub:profile('dub','Acorde y eco',.3,.07,.65,.43,.85,.8,'orbitorgan hollow p_barkkeys pluckbody'),
 open:profile('open','Espacio abierto',.72,.78,.55,.39,1.25,1.3,'graincloud silkstrings airflute p_stringcloud')
});
export function musicDirection(genre){
 if(['ambient','cosmic'].includes(genre))return MUSIC_DIRECTIONS.open;
 if(genre==='dub')return MUSIC_DIRECTIONS.dub;
 return MUSIC_DIRECTIONS[GENRE_CHARACTERS[genre]]||MUSIC_DIRECTIONS.warm;
}
const FLOATING=new Set(['graincloud','granularair','choir','duskpad','p_stringcloud','p_breathingpad','p_velvetchoir']);
export function directedLeads(genre,base,hybrid=[],native=[]){
 const p=musicDirection(genre),adapt=id=>({organ:'p_barkkeys',strings:'p_cellobody',keys:'p_tinepiano',flute:'p_panreed',saw:'resonantpluck'})[id]||id,
  pool=p.space>.5?[...native,...base,...hybrid]:[...native.map(adapt),...p.leads,...hybrid.filter(id=>!FLOATING.has(id)).slice(0,2)];
 return [...new Set(pool)];
}
export function directedFrame(frame,genre){
 const p=musicDirection(genre);
 return {...frame,direction:p,expression:{...frame.expression,
  attackScale:Math.max(.4,Math.min(2.25,(frame.expression?.attackScale||1)*p.attack)),
  decayScale:Math.max(.35,Math.min(2,(frame.expression?.decayScale||1)*p.decay))}};
}
export function productionSpace(genre,{cave=false,fog=false,canon=false}={}){
 const p=musicDirection(genre);
 return {room:Math.min(.9,p.room*(cave?1.15:fog?1.06:1)),space:p.space,
  echo:p.echo,feedback:canon?.6:p.feedback};
}
// Two persistent rooms; crossfade gains, never replace an impulse during a phrase.
export function createProductionRooms(ac,makeImpulse,output){
 const rooms=[.32,3.2].map(seconds=>{const input=ac.createGain(),verb=ac.createConvolver();verb.buffer=makeImpulse(seconds);input.gain.value=0;input.connect(verb).connect(output);return input;});
 function set(space,time){space=Math.max(0,Math.min(1,space));rooms[0].gain.setTargetAtTime(1-space,time,.4);rooms[1].gain.setTargetAtTime(space,time,.4);}
 return {connect(input){for(const room of rooms)input.connect(room);},set};
}
