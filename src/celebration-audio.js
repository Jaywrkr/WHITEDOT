import {hookInstruments,hookPitch,musicalCharacter} from './musical-character.js';
// A world event, never a sound attached to navigation or export.
export function playBoxCelebration(runtime,time,region){
 if(!runtime.S.sound||runtime.ac?.state!=='running'||!region)return false;
 const tones=runtime.chordTones(),genre=runtime.GEN[region.genre],character=musicalCharacter(region.genre),inst=hookInstruments(region.genre,genre)[0];
 let bass=tones[0];while(bass>52)bass-=12;while(bass<36)bass+=12;
 const bassInst=runtime.MU.radio?.bassI||genre.bassI;runtime.bassInst(Array.isArray(bassInst)?bassInst[0]:bassInst||'sub',bass,time,runtime.vel(.025));
 for(const [i,note]of tones.slice(0,2).entries())runtime.hookInst(inst,hookPitch(inst,note-12,character),time+runtime.SIX*(i+1)*2,runtime.vel(.012),region);
 runtime.celebrationAudioCue?.({at:time,genre:region.genre,bass,notes:tones.slice(0,2)});return true;
}
