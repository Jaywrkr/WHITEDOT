import {explorationContext} from './exploration-context.js';
import {territoryNucleus} from './territory-journey.js';
import {territoryInk} from './territory-transition.js';
export const GALAXY_PARALLAX=.065;
// Localized distant color, independent of sound, terrain and collectible RNG streams.
export function distantDirections(x,y,size,width,height,regionAt,seedOf){
 const rx=Math.floor(x/size),ry=Math.floor(y/size),here=regionAt(x,y),out=[];
 for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]]){
  const a=rx+dx,b=ry+dy,region=regionAt((a+.5)*size,(b+.5)*size);if(region.sea)continue;
  const target=territoryNucleus(a,b,size,seedOf),vx=target.x-x,vy=target.y-y,distance=Math.hypot(vx,vy),radius=Math.min(150,Math.min(width,height)*.38);
  const edge=Math.min((width/2+radius*.12)/Math.max(.001,Math.abs(vx)),(height/2+radius*.12)/Math.max(.001,Math.abs(vy)));
  out.push({key:region.key,target,genre:region.genre,ink:territoryInk(region,'lead',seedOf),x:width/2+vx*edge,y:height/2+vy*edge,radius,score:(region.genre!==here.genre?1.25:1)*(explorationContext(region,target.x,target.y,seedOf).style!==explorationContext(here,x,y,seedOf).style?1.3:1)/Math.max(1,distance)});
 }
 return out.sort((a,b)=>b.score-a.score).slice(0,2);
}
export function distantCloud(cx,cy,seedOf){
 const h=seedOf(`distant:colors:v1:${cx},${cy}`)>>>0;
 if(h%5===0)return null;
 return {id:`${cx},${cy}`,x:(cx+.2+((h>>>5)%600)/1000)*900,y:(cy+.2+((h>>>15)%600)/1000)*900,
  hue:(h>>>3)%360,spread:35+(h>>>11)%95,radius:220+(h>>>17)%110,phase:(h%1000)/1000*Math.PI*2,period:130+(h>>>7)%95};
}
export function cloudPresence(cloud,seconds,reduced=false){
 if(reduced)return .5;
 const v=Math.max(0,Math.sin(seconds*Math.PI*2/cloud.period+cloud.phase));return v*v*(3-2*v);
}
export function initialize(runtime){
 const cache=new Map(),signals=new Map();let seconds=0,owner=null,hintCell='';
 function draw(outside=false){
  if(!runtime.inWorld()||(runtime.S.layer||'superficie')==='bajo')return;
  if(!outside&&!document.hidden&&!document.querySelector('.modal:not([hidden])'))seconds+=Math.min(.05,runtime.activeFrameSeconds||0);
  const c=runtime.cx,px=runtime.S.wx*GALAXY_PARALLAX,py=runtime.S.wy*GALAXY_PARALLAX,w=runtime.W,h=runtime.H,reduced=runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const items=[];
  for(let x=Math.floor((px-w/2-340)/900);x<=Math.floor((px+w/2+340)/900);x++)for(let y=Math.floor((py-h/2-340)/900);y<=Math.floor((py+h/2+340)/900);y++){
   const key=x+','+y;if(!cache.has(key)){cache.set(key,distantCloud(x,y,runtime.seedOf));while(cache.size>64)cache.delete(cache.keys().next().value);}
   const q=cache.get(key);if(!q)continue;
   const sx=q.x-px+w/2,sy=q.y-py+h/2,alpha=cloudPresence(q,seconds,reduced);if(alpha<.001||sx+q.radius<0||sy+q.radius<0||sx-q.radius>w||sy-q.radius>h)continue;
   items.push({q,sx,sy,alpha});
  }
  c.save();c.globalAlpha=1;
  if(outside){const reach=Math.min((runtime.worldVisibility?.radius||220)*.55,w*.28,h*.25);c.beginPath();c.rect(0,0,w,h);c.arc(w/2,h/2,reach,0,Math.PI*2);c.clip('evenodd');}
  for(const {q,sx,sy,alpha}of items.slice(0,2)){
   const radius=Math.min(q.radius,w*.7,h*.6);c.save();c.translate(sx,sy);c.rotate(q.phase);c.scale(1,.8);
   for(let i=0;i<3;i++){
    const x=(i-1)*radius*.32,g=c.createRadialGradient(x,0,0,x,0,radius*(i===1?.75:1));
    g.addColorStop(0,`hsla(${(q.hue+i*q.spread)%360},65%,45%,${alpha*.085})`);g.addColorStop(.3,`hsla(${(q.hue+i*q.spread+20)%360},60%,32%,${alpha*.045})`);g.addColorStop(.72,`hsla(${(q.hue+i*q.spread+30)%360},55%,24%,${alpha*.012})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x-radius,-radius,radius*2,radius*2);
   }c.restore();
  }
  if(outside){
   if(owner!==runtime.S){owner=runtime.S;signals.clear();hintCell='';}
   const cell=[Math.floor(runtime.S.wx/runtime.WCH),Math.floor(runtime.S.wy/runtime.WCH),w,h].join(':');
   if(cell!==hintCell){hintCell=cell;const targets=distantDirections(runtime.S.wx,runtime.S.wy,runtime.REG*runtime.WCH,w,h,runtime.regionOfPos,runtime.seedOf);for(const s of signals.values())s.wanted=false;for(const s of targets)signals.set(s.key,{...s,opacity:signals.get(s.key)?.opacity||0,wanted:true});}
   const ease=1-Math.exp(-Math.min(.05,runtime.activeFrameSeconds||0)*1.4);
   for(const [key,q]of signals){q.opacity+=((q.wanted?1:0)-q.opacity)*ease;if(!q.wanted&&q.opacity<.005){signals.delete(key);continue;}
    const vx=q.target.x-runtime.S.wx,vy=q.target.y-runtime.S.wy,edge=Math.min((w/2+q.radius*.12)/Math.max(.001,Math.abs(vx)),(h/2+q.radius*.12)/Math.max(.001,Math.abs(vy))),sx=w/2+vx*edge,sy=h/2+vy*edge,rgb=q.ink.slice(1).match(/../g).map(h=>parseInt(h,16)).join(',');
    const g=c.createRadialGradient(sx,sy,0,sx,sy,q.radius);g.addColorStop(0,'rgba('+rgb+','+q.opacity*.2+')');g.addColorStop(.48,'rgba('+rgb+','+q.opacity*.075+')');g.addColorStop(1,'rgba('+rgb+',0)');c.fillStyle=g;c.fillRect(sx-q.radius,sy-q.radius,q.radius*2,q.radius*2);
   }
  }c.restore();
 }
 Object.defineProperties(runtime,{drawDistantColors:{get:()=>draw},distantSignals:{get:()=>[...signals.values()].map(({key,target,ink,opacity})=>({key,target,ink,opacity}))}});
}
