import {openSurface,prefersReducedMotion} from './frame-state.js';
import {VJ_CELL,visualSegment,segmentOpacity,encounterOf,moveVisitor,cometOf} from './vj-model.js';
import {drawVisualSegment,distantSegmentLayout,visualPlate} from './vj-art.js';
export function initialize(runtime){
 const cache=new Map(),visitors=new Map(),plates=new Map(),gestures=[];let owner=runtime.S,seconds=0,lastGesture=-10;
 const reduced=()=>runtime.S.reducedMotion||prefersReducedMotion();
 const active=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie';
 function reset(){cache.clear();visitors.clear();plates.clear();gestures.length=0;seconds=0;lastGesture=-10;owner=runtime.S;}
 function nearby(){if(owner!==runtime.S)reset();if(!active())return [];const out=[],cx=Math.floor(runtime.S.wx/VJ_CELL),cy=Math.floor(runtime.S.wy/VJ_CELL);
  for(let x=cx-1;x<=cx+1;x++)for(let y=cy-1;y<=cy+1;y++){const key=x+','+y;if(!cache.has(key)){const q=visualSegment(x,y,runtime.seedOf),v=encounterOf(x,y,runtime.seedOf);cache.set(key,q);if(v)visitors.set(key,v);}const q=cache.get(key);if(q)out.push(q);}
  while(cache.size>48){const key=cache.keys().next().value;cache.delete(key);visitors.delete(key);}return out;
 }
 function gesture(x=runtime.S.wx,y=runtime.S.wy){if(!active()||seconds-lastGesture<.18)return;lastGesture=seconds;gestures.push({x,y,at:seconds,hue:(runtime.seedOf('vj:gesture:'+Math.round(x/50)+','+Math.round(y/50))>>>0)%360});if(gestures.length>8)gestures.shift();}
 function draw(t,dt,ox,oy,paused=false){if(!active())return;const items=nearby(),still=reduced(),blocked=paused||document.hidden||runtime.scanning||runtime.noticeLane?.inspecting||openSurface('.modal:not([hidden])');if(!blocked)seconds+=Math.min(.05,Math.max(0,dt));
  const c=runtime.cx,reach=runtime.worldVisibility?.radius||650;
  for(const q of items){const alpha=segmentOpacity(q,runtime.S.wx,runtime.S.wy,reach);if(alpha<.001)continue;
   const {x,y,radius:r}=distantSegmentLayout(q,{x:runtime.S.wx,y:runtime.S.wy},runtime.W,runtime.H);if(x+r<0||x-r>runtime.W||y+r<0||y-r>runtime.H)continue;
   if(!plates.has(q.id)){plates.set(q.id,visualPlate(q));while(plates.size>12)plates.delete(plates.keys().next().value);}const plate=plates.get(q.id);
   if(plate){c.save();c.globalAlpha=alpha*.48;c.translate(x,y);if(!still)c.rotate(Math.sin(seconds*.015+q.phase)*.025);c.drawImage(plate,-r,-r,r*2,r*2);c.restore();}
   else drawVisualSegment(c,q,{x,y,radius:r,time:0,energy:0,alpha:alpha*.32,reduced:true});
  }
  c.save();c.lineWidth=1;
  for(const o of visitors.values()){if(Math.hypot((o.home?.x??o.x)-runtime.S.wx,(o.home?.y??o.y)-runtime.S.wy)>1000)continue;moveVisitor(o,{x:runtime.S.wx,y:runtime.S.wy},seconds,blocked?0:dt,still);const d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),fade=runtime.worldOpacity?.(d,reach)??Math.max(0,1-d/reach);c.globalAlpha=fade*.6;c.strokeStyle=`hsl(${o.hue} 60% 75%)`;const x=o.x+ox,y=o.y+oy;c.beginPath();if(o.kind==='curioso'){c.arc(x,y,4,0,Math.PI*1.6);c.moveTo(x+8,y);c.arc(x,y,8,0,Math.PI*.7);}else{c.moveTo(x-5,y+3);c.quadraticCurveTo(x,y-7,x+5,y+3);}c.stroke();}
  if(!still){const cx=Math.floor(runtime.S.wx/VJ_CELL),cy=Math.floor(runtime.S.wy/VJ_CELL);for(let x=cx-1;x<=cx+1;x++)for(let y=cy-1;y<=cy+1;y++){const q=cometOf(x,y,runtime.seedOf,seconds,true);if(!q)continue;const d=Math.hypot(q.x-runtime.S.wx,q.y-runtime.S.wy);c.globalAlpha=q.alpha*.6*(runtime.worldOpacity?.(d,reach)??Math.max(0,1-d/reach));c.strokeStyle=`hsl(${q.hue} 60% 80%)`;const alpha=c.globalAlpha;c.lineWidth=q.width||1;
    for(let j=0;j<(q.pair?2:1);j++){const side=j?9:0,back=j?12:0,px=q.x+ox-Math.sin(q.angle)*side-Math.cos(q.angle)*back,py=q.y+oy+Math.cos(q.angle)*side-Math.sin(q.angle)*back;
     for(let k=0;k<3;k++){c.globalAlpha=alpha*(1-k*.28)*(j?.6:1);c.beginPath();c.moveTo(px-Math.cos(q.angle)*(q.tail||34)*k/3,py-Math.sin(q.angle)*(q.tail||34)*k/3);c.lineTo(px-Math.cos(q.angle)*(q.tail||34)*(k+1)/3,py-Math.sin(q.angle)*(q.tail||34)*(k+1)/3);c.stroke();}
    }c.lineWidth=1;}}
  while(gestures[0]&&seconds-gestures[0].at>1)gestures.shift();for(const g of gestures){const age=seconds-g.at;c.globalAlpha=(1-age)*.7;c.strokeStyle=`hsl(${g.hue} 65% 75%)`;c.beginPath();const r=still?16:10+age*28;for(let i=0;i<3;i++){const a=i*Math.PI*2/3+(still?0:age*.7);c.moveTo(g.x+ox+Math.cos(a)*r,g.y+oy+Math.sin(a)*r);c.arc(g.x+ox,g.y+oy,r,a,a+.45);}c.stroke();}c.restore();
 }
 Object.defineProperties(runtime,{drawVJWorld:{get:()=>draw},visualGesture:{get:()=>gesture},nearbyVisualSegments:{get:()=>nearby},vjState:{get:()=>({cache:cache.size,plates:plates.size,visitors:visitors.size,gestures:gestures.length,seconds})}});
}
