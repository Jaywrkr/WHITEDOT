import {cometStyle} from './wow-model.js';
// Spatial visual streams never consume terrain, life or music randomness.
export const VJ_TD_FORMS=Object.freeze(['brotes','nudo','telarana','red-orbital']);
export const VJ_FORMS=Object.freeze(['orbitas','circuitos','cintas','vidrio','islas','partitura','abanico','organismo',...VJ_TD_FORMS]);
export const VJ_CELL=1000;
const TAU=Math.PI*2;
export function visualSegment(cx,cy,seedOf){
 const h=seedOf(`vj:terrain:v1:${cx},${cy}`)>>>0;if(h%10<6)return null;
 const extra=seedOf(`vj:td-reference:v1:${cx},${cy}`)>>>0,kind=extra%7===0?VJ_TD_FORMS[(extra>>>6)%4]:VJ_FORMS[(h>>>4)%8];
 return {id:`vj:${cx},${cy}`,kind,x:(cx+.2+(h>>>8)%600/1000)*VJ_CELL,y:(cy+.2+(h>>>18)%600/1000)*VJ_CELL,radius:84+(h>>>11)%46,hue:(h>>>3)%360,phase:h%1000/1000*TAU,seed:h};
}
export function segmentOpacity(segment,x,y,reach){const d=Math.hypot(segment.x-x,segment.y-y),k=Math.max(0,Math.min(1,(reach+segment.radius-d)/Math.max(1,segment.radius*2)));return k*k*(3-2*k);}
export function encounterOf(cx,cy,seedOf){
 const h=seedOf(`vj:visitor:v1:${cx},${cy}`)>>>0;if(h%7>1)return null;
 return {id:`visitor:${cx},${cy}`,kind:h%2?'curioso':'esquivo',x:(cx+.3+(h>>>8)%400/1000)*VJ_CELL,y:(cy+.3+(h>>>18)%400/1000)*VJ_CELL,hue:(h>>>3)%360,phase:h%1000/1000*TAU};
}
export function moveVisitor(o,player,seconds,dt,reduced=false){
 const d=Math.hypot(player.x-o.x,player.y-o.y),home=o.home||{x:o.x,y:o.y};o.home=home;
 const near=d<150,angle=Math.atan2(o.y-player.y,o.x-player.x);
 let tx=home.x+Math.cos(seconds*.3+o.phase)*22,ty=home.y+Math.sin(seconds*.4+o.phase)*18;
 if(near){const radius=o.kind==='curioso'?40:130;tx=player.x+Math.cos(angle)*radius;ty=player.y+Math.sin(angle)*radius;}
 const bound=220,dx=tx-home.x,dy=ty-home.y,dist=Math.hypot(dx,dy);if(dist>bound){tx=home.x+dx/dist*bound;ty=home.y+dy/dist*bound;}
 const mix=reduced?0:1-Math.exp(-Math.max(0,Math.min(.05,dt))*(o.kind==='curioso'?1.7:2.6));o.x+=(tx-o.x)*mix;o.y+=(ty-o.y)*mix;return o;
}
export function cometOf(cx,cy,seedOf,seconds,presentation=false){
 const h=seedOf(`vj:comet:v1:${cx},${cy}`)>>>0;if(h%3)return null;
 const cycle=110+h%50,phase=((seconds+(h>>>5)%cycle)%cycle+cycle)%cycle;if(phase>9)return null;
 const originalU=phase/9,style=presentation?cometStyle(seedOf('wow:comet:v1:'+cx+','+cy),originalU):null,u=style?.progress??originalU,angle=(h>>>9)%628/100,homeX=(cx+.5)*VJ_CELL,homeY=(cy+.5)*VJ_CELL;
 return {id:`comet:${cx},${cy}`,x:homeX+Math.cos(angle)*(u-.5)*560,y:homeY+Math.sin(angle)*(u-.5)*560,angle,hue:(h>>>14)%360,alpha:Math.sin(originalU*Math.PI),...(style||{})};
}
