// Presentation only: no world RNG, physics, save or audio ownership.
export const WOW_LIMITS=Object.freeze({brakes:6,nearby:12});
export function createMotion(){
 let last=null,moving=false,age=9,angle=0;
 return {step(x,y,dt,blocked=false){
  dt=Math.max(0,Math.min(.05,Number.isFinite(dt)?dt:0));
  const dx=last?x-last.x:0,dy=last?y-last.y:0,d=Math.hypot(dx,dy);
  last={x,y};if(blocked||d>40){moving=false;age=9;return {moving:false,started:false,stopped:false,x,y};}
  const next=d>.08,started=next&&!moving,stopped=moving&&!next;
  if(started)age=0;else age+=dt;
  if(next)angle=Math.atan2(dy,dx);moving=next;
  return {moving,started,stopped,x,y,angle};
 },pose(reduced=false){const stretch=reduced?0:.11*Math.exp(-age*8)*Math.cos(age*18);return {x:1+stretch,y:1/(1+stretch),angle};},
 reset(){last=null;moving=false;age=9;}};
}

export function lookVector(dx,dy,reduced=false){
 if(reduced||!Number.isFinite(dx)||!Number.isFinite(dy))return {x:0,y:0};
 const d=Math.hypot(dx,dy)||1;return {x:dx/d*1.4,y:dy/d*1.4};
}

export function greetingPose(kind,age){
 if(!Number.isFinite(age)||age<0||age>=.75)return {turn:0,lift:0};
 const a=Math.sin(age/.75*Math.PI)*(1-age/.75);
 return {turn:kind===0?a*.18:kind===1?Math.sin(age*12)*a*.45:0,lift:kind===2?-a*8:0};
}

export function formationOffset(slot,seconds=0){
 const angle=slot*2.3999632297+seconds*.08,radius=32+(slot%4)*14;
 return {x:Math.cos(angle)*radius,y:Math.sin(angle)*radius};
}

export function cometStyle(hash,u){
 const h=hash>>>0,k=((h>>>8)%5-2)*.018;
 return {progress:u+Math.sin(u*Math.PI*2)*k,tail:22+(h>>>12)%35,width:.7+(h%3)*.2,pair:h%11===0};
}

export function cloudBreath(cloud,seconds,reduced=false){
 if(reduced)return {light:.9,scale:1};
 const phase=Number.isFinite(cloud.phase)?cloud.phase:0,a=seconds*Math.PI*2/(100+phase*6)+phase;
 return {light:.9+Math.sin(a)*.1,scale:1+Math.sin(a*.7)*.025};
}
