// Shared hierarchy: black space, local colored ink, gold audio response, white player.
export const WORLD_VISUAL=Object.freeze({background:'#000',line:1.2,maxElementAlpha:.88,gold:'#f0d27a',echo:'#9fe8ff'});
export function elementInk(material,hue=190,active=false){
 if(active)return WORLD_VISUAL.gold;
 const saturation={wood:38,glass:65,metal:42,air:28}[material]||42;
 return `hsl(${((hue%360)+360)%360},${saturation}%,68%)`;
}
export function elementAlpha(distance,radius,activity=0){return Math.max(0,Math.min(WORLD_VISUAL.maxElementAlpha,(1-distance/(radius*1.3))*.7+activity*.5));}
export function jamHudTop(height,panelTop=null,notice=false){return Math.max(120,Math.min(height-140,panelTop==null?height-140:panelTop-44)-(notice?34:0));}
