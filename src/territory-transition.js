import {GENRE_CHARACTERS} from './musical-character.js';
export function approachTempo(current,target){
 if(!Number.isFinite(target)||target<=0)return current;const goal=Math.max(40,Math.min(200,target));
 if(!Number.isFinite(current)||current<=0)return goal;const d=goal-current;
 return Math.abs(d)<=8?goal:current+Math.sign(d)*Math.min(Math.abs(d),Math.max(8,Math.min(24,Math.round(Math.abs(d)*.45))));
}
export const transitionGain=bars=>bars<1?.65:bars<2?.85:1;
export const sparseFoundationGain=parts=>parts===1?2.8:parts===2?1.8:parts===3?1.3:1;
const hueSafe=h=>{h=((h%360)+360)%360;return h>=30&&h<=75?(h+95)%360:h;};
function hex(h,s,l){h=hueSafe(h)/360;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h*12)%12;return Math.round((l-a*Math.max(-1,Math.min(k-3,9-k,1)))*255).toString(16).padStart(2,'0');};return '#'+f(0)+f(8)+f(4);}
export function territoryPalette(region,seedOf,storm=false){
 const kind=GENRE_CHARACTERS[region.genre]||'warm',palettes={floor:[205,335,0],machine:[0,330,205],bass:[265,0,210],disco:[315,165,205],organic:[145,15,185],warm:[345,15,195],calm:[195,255,145],melodic:[265,315,190],broken:[185,305,145]},
 h=seedOf('territory:presentation:v1:'+region.key+':'+region.genre)>>>0,monochrome=h%3===0,hue=storm&&['machine','bass','floor'].includes(kind)?[0,330][h%2]:(palettes[kind]||palettes.warm)[(h>>>4)%3];
 return {monochrome,hue,ink:hex(hue,.58,.68),kind};
}
export function territoryInk(region,role,seedOf){
 const base=territoryPalette(region,seedOf),f=region.worldFamily,valid=f?.key===region.key&&f.genre===region.genre,p=valid?{...base,hue:f.musicHue??base.hue,monochrome:f.paletteMode==='monochrome'}:base,shift=p.monochrome?0:({bajo:-12,perc:20,acorde:36,lead:0,agudo:-26})[role]||0;
 return hex(p.hue+shift,.58,.68);
}
