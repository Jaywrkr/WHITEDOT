// Independent hashes only: play variants never move the original crystal lattice.
import {LOOSE_SPARK} from './spark-rules.js';
export const CRYSTAL_CHAIN_RADIUS=240,CRYSTAL_CHAIN_LIMIT=8;
export function crystalPlay(o,seedOf){
 if(o.id.startsWith('path:'))return {rare:false,runner:false};
 let h=seedOf('crystals:play:v1:'+o.id)>>>0;h=Math.imul(h^(h>>>16),0x7feb352d);h=Math.imul(h^(h>>>15),0x846ca68b);h=(h^(h>>>16))>>>0;
 return {rare:h%8===0,runner:o.size>1&&(h>>>8)%6===0};
}
// H1 (Jay, alpha.233): every fragment is a loose spark worth LOOSE_SPARK (1); a rare one, chased, 3 more (as before).
// A crystal of size 1, 2 or 3 still breaks into one, three and three fragments (until alpha.232 they were worth 1, 3 or 5
// in all), so a crystal half collected in a save keeps its mask.
export function crystalFragments(o,rare=o.rare===true){
 const total=[1,3,5][o.size-1]||1,count=Math.min(3,total);
 return Array.from({length:count},(_,i)=>({index:i,value:LOOSE_SPARK+(rare&&i===count-1?3:0),rare:rare&&i===count-1}));
}
// A rare fragment caught after it stopped running is a loose spark again.
export const DIM_FRAGMENT_SPARKS=LOOSE_SPARK;
export const fragmentMask=o=>(1<<crystalFragments(o,false).length)-1;
export function moveEscape(point,origin,player,dt,age,limit=90,speed=70,lasts=2){
 const dx=point.x-player.x,dy=point.y-player.y,d=Math.hypot(dx,dy)||1;
 if(age>lasts||d>150)return {...point};
 let x=point.x+dx/d*speed*dt,y=point.y+dy/d*speed*dt;
 const distance=Math.hypot(x-origin.x,y-origin.y);
 if(distance>limit){x=origin.x+(x-origin.x)*limit/distance;y=origin.y+(y-origin.y)*limit/distance;}
 return {x,y};
}
