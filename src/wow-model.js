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
