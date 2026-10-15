// Localized distant color, independent of sound, terrain and collectible RNG streams.
export function distantCloud(cx,cy,seedOf){
 const h=seedOf(`distant:colors:v1:${cx},${cy}`)>>>0;
 if(h%5===0)return null;
 return {id:`${cx},${cy}`,x:(cx+.2+((h>>>5)%600)/1000)*900,y:(cy+.2+((h>>>15)%600)/1000)*900,
  hue:(h>>>3)%360,spread:35+(h>>>11)%95,radius:65+(h>>>17)%50,phase:(h%1000)/1000*Math.PI*2,period:95+(h>>>7)%65};
}
export function cloudPresence(cloud,seconds,reduced=false){
 if(reduced)return .5;
 const v=Math.max(0,Math.sin(seconds*Math.PI*2/cloud.period+cloud.phase));return v*v*(3-2*v);
}
export function initialize(runtime){
 const cache=new Map();let seconds=0;
 function draw(outside=false){
  if(!runtime.inWorld()||(runtime.S.layer||'superficie')==='bajo')return;
  if(!outside&&!document.hidden&&!document.querySelector('.modal:not([hidden])'))seconds+=Math.min(.05,runtime.activeFrameSeconds||0);
  const c=runtime.cx,px=runtime.S.wx*.14,py=runtime.S.wy*.14,w=runtime.W,h=runtime.H,reduced=runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const items=[];
  for(let x=Math.floor((px-w/2-140)/900);x<=Math.floor((px+w/2+140)/900);x++)for(let y=Math.floor((py-h/2-140)/900);y<=Math.floor((py+h/2+140)/900);y++){
   const key=x+','+y;if(!cache.has(key)){cache.set(key,distantCloud(x,y,runtime.seedOf));while(cache.size>64)cache.delete(cache.keys().next().value);}
   const q=cache.get(key);if(!q)continue;
   const sx=q.x-px+w/2,sy=q.y-py+h/2,alpha=cloudPresence(q,seconds,reduced);if(alpha<.001||sx+q.radius<0||sy+q.radius<0||sx-q.radius>w||sy-q.radius>h)continue;
   items.push({q,sx,sy,alpha});
  }
  c.save();c.globalAlpha=1;
  if(outside){const reach=runtime.worldVisibility?.radius||220;c.beginPath();c.rect(0,0,w,h);c.arc(w/2,h/2,reach*.82,0,Math.PI*2);c.clip('evenodd');}
  for(const {q,sx,sy,alpha}of items.slice(0,2)){
   const radius=Math.min(q.radius,w*.29,h*.26);c.save();c.translate(sx,sy);c.rotate(q.phase);c.scale(1,.65);
   for(let i=0;i<3;i++){
    const x=(i-1)*radius*.32,g=c.createRadialGradient(x,0,0,x,0,radius*(i===1?.75:1));
    g.addColorStop(0,`hsla(${(q.hue+i*q.spread)%360},70%,52%,${alpha*.15})`);g.addColorStop(.45,`hsla(${(q.hue+i*q.spread+20)%360},65%,35%,${alpha*.07})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x-radius,-radius,radius*2,radius*2);
   }c.restore();
  }c.restore();
 }
 Object.defineProperty(runtime,'drawDistantColors',{get:()=>draw});
}
