import {wonderScore} from './musical-wonders-model.js';
// One original short phrase, in the current harmony. No samples, master-volume changes or UI sounds.
export function playWonderNote(r,d,index,time){
 if(!r.S.sound||r.ac?.state!=='running')return false;
 const note=wonderScore(d,r.chordTones())[index];if(!note)return false;
 const emit=()=>r.hookInst(note.instrument,note.note,time,r.vel(note.gain),r.regionOfPos(r.S.wx,r.S.wy));if(r.withVoiceOrigin)r.withVoiceOrigin('player',emit);else emit();r.wonderAudioCue?.({...note,id:d.id,at:time});return true;
}
export function playWonderPhrase(r,d,time){if(!r.S.sound||r.ac?.state!=='running')return 0;let count=0;for(const [i,note]of wonderScore(d,r.chordTones()).entries())if(playWonderNote(r,d,i,time+note.step*r.SIX))count++;return count;}
