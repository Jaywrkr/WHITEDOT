import {glassParameters} from './glass.js';
import {traceMirrors} from './mirrors.js';
export const SIGNAL_SOURCES=['clock','glass','mirror'];
export const SIGNAL_NAMES={clock:'Reloj',glass:'Vidrios',mirror:'Espejos'};
export const normalizeSignalSource=value=>SIGNAL_SOURCES.includes(value)?value:'clock';
export const nextSignalSource=value=>SIGNAL_SOURCES[(SIGNAL_SOURCES.indexOf(normalizeSignalSource(value))+1)%3];
// Control data only: no oscillators, recursive routes or extra ambient events.
export function installationSignal(source,{glass,mirror}={}){
 if(source==='clock')return {variant:0,amount:1,stride:1};
 if(source==='glass'){
  if(!glass?.seen||!Array.isArray(glass.angles)||glass.angles.length!==3||!glass.angles.every(Number.isFinite))return null;
  const p=glassParameters(glass.angles);
  return {variant:(p.degrees[0]+p.degrees[1]*2+p.degrees[2]*3)%8,amount:.35+p.alignment*.65,stride:p.stride};
 }
 if(source==='mirror'){
  if(!mirror?.mirrors?.length||!mirror.mirrors.every(m=>Number.isFinite(m.angle)&&Number.isFinite(m.x)&&Number.isFinite(m.y)))return null;
  const route=traceMirrors(mirror);if(!route.hits.length)return null;
  const variant=route.hits.reduce((sum,i)=>sum+Math.floor(mirror.mirrors[i].angle/Math.PI*8)+i,0)%8;
  return {variant,amount:route.connected?1:.45,stride:route.connected?2:4};
 }
 return null;
}
