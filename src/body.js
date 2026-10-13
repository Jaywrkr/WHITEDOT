// El cubo es el único que toca el mundo. El dedo mueve el cubo (y un toque lanza el pulso desde el cubo);
// las cosas responden al contacto, al paso y a la quietud del cubo.
// Este módulo lleva el estado del cuerpo: posición, velocidad, quietud y entradas/salidas de contacto.
// «Tocar con el dedo» queda solo como modo de prueba: ?dedo=1 o automatización (navigator.webdriver).
export function createBody(){
 const b={x:0,y:0,px:0,py:0,vx:0,vy:0,speed:0,still:0,jump:false,ready:false};
 function step(x,y,dt){
  dt=Math.max(1e-3,Math.min(.1,dt));
  if(!b.ready){Object.assign(b,{x,y,px:x,py:y,ready:true});return b;}
  b.px=b.x;b.py=b.y;b.x=x;b.y=y;const dx=x-b.px,dy=y-b.py,moved=Math.hypot(dx,dy);
  b.jump=moved>400;   // teletransporte (laboratorio, cambio de mundo): no es movimiento
  if(b.jump){b.vx=b.vy=b.speed=0;b.still=0;return b;}
  b.vx=b.vx*.7+dx/dt*.3;b.vy=b.vy*.7+dy/dt*.3;b.speed=Math.hypot(b.vx,b.vy);b.still=b.speed<12?b.still+dt:0;return b;
 }
 return {state:b,step};
}
// ¿El segmento recorrido por el cubo cruzó la línea y=lineY dentro de |x|<=half? (coordenadas locales)
export function crossedLine(prev,cur,lineY,half){
 if((prev.y-lineY)*(cur.y-lineY)>0||prev.y===cur.y)return false;
 const t=(lineY-prev.y)/(cur.y-prev.y),x=prev.x+(cur.x-prev.x)*t;return Math.abs(x)<=half;
}
// Distancia de un punto a un segmento (a,b).
export function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
// Cambio de ángulo polar del cubo alrededor de un centro entre dos cuadros (para girar cosas rodeándolas).
export function polarDelta(center,prev,cur){
 let d=Math.atan2(cur.y-center.y,cur.x-center.x)-Math.atan2(prev.y-center.y,prev.x-center.x);
 if(d>Math.PI)d-=Math.PI*2;if(d<-Math.PI)d+=Math.PI*2;return d;
}
export function initialize(runtime){
 const body=createBody(),params=new URLSearchParams(location.search);
 // Modo dedo: solo para pruebas automáticas o si se pide explícitamente.
 let finger=params.has('dedo')||navigator.webdriver===true;
 function tick(dt){if(!runtime.inWorld())return;body.step(runtime.S.wx,runtime.S.wy,dt);}
 Object.defineProperties(runtime,{body:{get:()=>body.state},bodyTick:{get:()=>tick},fingerTouch:{get:()=>finger,set:v=>{finger=!!v;}}});
}
