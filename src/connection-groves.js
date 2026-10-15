import {createFamilyState} from './encounter-families.js';
// Additive neighborhoods. Existing encounters, plants, rare sites and saved addresses stay put.
export function connectionGrove(region,seedOf){
 if(!region||region.sea||region.worldFamily?.quiet)return null;
 const pair=String(region.key).match(/(-?\d+),(-?\d+)$/);if(!pair)return null;
 const zone=Math.floor(Number(pair[1])/2)+','+Math.floor(Number(pair[2])/2),h=seedOf('connection:grove:v1:'+zone)>>>0;
 if(h%7!==0)return null;
 return {zone,style:['chain','garden','relay'][(h>>>7)%3],phase:(h>>>12)%4};
}
export function groveNodes(cx,cy,size,region,seedOf){
 const grove=connectionGrove(region,seedOf);if(!grove)return [];
 const nodes=[],step=size/5;
 for(let a=0;a<4;a++)for(let b=0;b<4;b++){
  const id=`grove:v1:${cx},${cy}:${a},${b}`,h=seedOf(id)>>>0;
  nodes.push({id,kind:'weaver',groveStyle:grove.style,groveRole:['bass','groove','melody','space'][(a+b+grove.phase)%4],
   x:cx*size+step*(a+1)+(h%13-6),y:cy*size+step*(b+1)+((h>>>8)%13-6),hue:(region.hue+(a-b)*12+360)%360,variant:h%8,state:createFamilyState()});
 }return nodes;
}
