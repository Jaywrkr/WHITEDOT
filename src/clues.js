import {openSurface} from './frame-state.js';
import {claimInstallationBar} from './installations.js';
export function clueDirection(x,y,sites){
 const site=sites.filter(s=>!s.got).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];
 if(!site)return null;const dx=site.x-x,dy=site.y-y,distance=Math.hypot(dx,dy);return {site,distance,angle:Math.atan2(dy,dx)};
}
export function initialize(runtime){
 let direction=null,lastBar=-Infinity;
 function tick(){direction=runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'?clueDirection(runtime.S.wx,runtime.S.wy,runtime.nearbyRelics()):null;}
 // Coherencia T2: the nearest find not kept, out of view, is an offer to the one layer of arrows (scanner-arrows.js);
 // it was three cyan dots round the cube.
 function draw(){
  if(!direction||direction.distance<100||direction.distance>900||openSurface('.modal:not([hidden])'))return;
  const s=direction.site,W=runtime.W,H=runtime.H,sx=s.x-(runtime.camX??runtime.S.wx)+W/2,sy=s.y-(runtime.camY??runtime.S.wy)+H/2;
  if(sx<-8||sy<-8||sx>W+8||sy>H+8)runtime.edgeOffer?.({key:'hallazgo:'+(s.id??Math.round(s.x)+','+Math.round(s.y)),kind:'hallazgo',x:s.x,y:s.y,shape:'hallazgo'});
 }
 function bar(time,bar){
  if(!direction||direction.distance>900||bar-lastBar<8||document.hidden||!runtime.S.sound||runtime.ac?.state!=='running'||openSurface('.modal:not([hidden])')||!claimInstallationBar(runtime,bar))return;
  lastBar=bar;const region=runtime.MU.dnaA;if(!region)return;
  // Quiet, locally tuned clue; no high chime and no extra continuous layer.
  const n=runtime.chordTones()[0]-12;runtime.hookInst(region.track.hookI,n,time+runtime.SIX*7,.012*Math.max(.15,1-direction.distance/1000),region);
 }
 Object.defineProperties(runtime,{clueTick:{get:()=>tick},clueDraw:{get:()=>draw},clueBar:{get:()=>bar},clueState:{get:()=>direction}});
}
