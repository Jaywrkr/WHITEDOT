import {territoryInk} from './territory-transition.js';
import {deviceDetail,fogTarget,blendFog,distanceOpacity,preloadCells,visualHash,DEPTH_PLANES,planePoint} from './world-visibility-model.js';
export function initialize(runtime){
 let fog=null,owner=null,lastCell='',pending=[],frames=0,averageMs=16.7,slow=0,quality=deviceDetail({memory:navigator.deviceMemory||4,cores:navigator.hardwareConcurrency||4}),hardware=quality,detailQuality=quality,lastPos=null,footprints=[];
 const c=runtime.cx,groundKinds=new Map();let groundSeed=0;
 function begin(dt,elapsed){
  if(!runtime.inWorld()){lastPos=null;return;}
  if(owner!==runtime.S){owner=runtime.S;fog=null;lastCell='';pending=[];footprints=[];lastPos=null;groundKinds.clear();groundSeed=runtime.seedOf('visual:depth:v2');}
  if(elapsed>0&&elapsed<.25){averageMs+=(elapsed*1000-averageMs)*.02;frames++;slow=averageMs>23?slow+1:Math.max(0,slow-2);if(slow>120&&quality>0){quality--;slow=0;}}
  detailQuality+=(quality-detailQuality)*Math.min(1,dt*.7);
  const s=runtime.S,d=runtime.regionOfPos(s.wx,s.wy),biome=runtime.BIOMES[d.z].id;
  const surface=d.sea||biome==='lago'?'agua':biome;if(!groundKinds.size)groundKinds.set(surface,1);else if(!groundKinds.has(surface))groundKinds.set(surface,0);
  for(const [id,value]of groundKinds){const next=value+((id===surface?1:0)-value)*(1-Math.exp(-dt*1.5));if(next<.001&&id!==surface)groundKinds.delete(id);else groundKinds.set(id,next);}
  const target=fogTarget({biome,air:d.air,storm:runtime.weather?.i||0,seconds:s.livingSeconds||0,phaseOffset:runtime.seedOf('living:climate:v1:'+d.key)%4,lamp:1,layer:s.layer||'superficie',width:runtime.W,height:runtime.H,tint:territoryInk(d,'acorde',runtime.seedOf).slice(1).match(/../g).map(h=>parseInt(h,16))});target.lightRadius=(runtime.eventOf(d)?.[0]==='eclipse'?.6:1)*Math.max(170,Math.min(360,runtime.lightR()*1.1))*(1+Math.min(runtime.shownStreak(),30)/30*.7)*(biome==='cueva'?.6:1);fog=blendFog(fog,target,dt);
  const cell=(s.layer||'superficie')+':'+Math.floor(s.wx/runtime.WCH)+','+Math.floor(s.wy/runtime.WCH)+':'+runtime.W+','+runtime.H;
  if(cell!==lastCell){lastCell=cell;pending=preloadCells(s.wx,s.wy,runtime.WCH,runtime.W,runtime.H).filter(([x,y])=>!runtime.wchunks.has(x+','+y));runtime.preloadLiving?.(fog.radius+runtime.WCH);}
  // Bound work per frame; visible cells are already loaded by worldStep.
  for(let i=0;i<2&&pending.length;i++){const [x,y]=pending.shift();runtime.wchunk(x,y);}
  if(!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])')){
   if(lastPos&&Math.hypot(s.wx-lastPos.x,s.wy-lastPos.y)>20&&Math.hypot(s.wx-lastPos.x,s.wy-lastPos.y)<150){footprints.push({x:s.wx,y:s.wy,age:0,layer:s.layer||'superficie'});lastPos={x:s.wx,y:s.wy};}
   if(!lastPos||Math.hypot(s.wx-lastPos.x,s.wy-lastPos.y)>=150)lastPos={x:s.wx,y:s.wy};
   for(const p of footprints)p.age+=dt*(1+fog.wet*2);footprints=footprints.filter(p=>p.age<12).slice(-80);
  }
 }
 function opacity(distance,radius=fog?.radius||750){return distanceOpacity(distance,radius);}
 function ground(t){if(!runtime.inWorld()||!fog)return;const s=runtime.S,d=runtime.regionOfPos(s.wx,s.wy),water=groundKinds.get('agua')||0;
  c.save();c.lineWidth=1;c.fillStyle=c.strokeStyle='#fff';
  for(const plane of DEPTH_PLANES){
   const span=fog.radius/plane,step=72/plane;
   const x0=Math.floor((s.wx-span)/step),x1=Math.ceil((s.wx+span)/step),y0=Math.floor((s.wy-span)/step),y1=Math.ceil((s.wy+span)/step);
   for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){
    const h=visualHash(x,y,groundSeed+Math.round(plane*100));const population=1- Math.max(0,Math.min(1,(h-(.10+.075*Math.min(2,detailQuality)))*20));if(!population)continue;
    const wx=(x+h)*step,wy=(y+visualHash(y,x,groundSeed))*step,p=planePoint(wx,wy,s.wx,s.wy,runtime.W,runtime.H,plane),dist=Math.hypot(p.x-runtime.W/2,p.y-runtime.H/2);
    if(p.x<-16||p.x>runtime.W+16||p.y<-16||p.y>runtime.H+16)continue;
    c.globalAlpha=population*opacity(dist)*(.028+(plane===1?.04:0))*(.6+fog.day*.4)*(.15+decorativeField(wx,wy,runtime.seedOf));
    const alpha=c.globalAlpha;for(const [biome,weight]of groundKinds){c.globalAlpha=alpha*weight;
    if(biome==='agua'){const wave=Math.sin(t/1800+h*9)*3;c.fillRect(p.x+wave,p.y,4+plane*4,1);}
    else if(['bosque','jardin','llanura'].includes(biome)&&plane===1){const sway=Math.sin(t/1400+h*12)*3*(.4+Math.abs(runtime.livingEnvironment?.wind||0));c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x+sway,p.y-4-h*5);c.stroke();}
    else{c.fillRect(p.x,p.y,plane===1?2:1,1);if(biome==='ruinas'||biome==='cueva'){c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x+4,p.y-2);c.stroke();}}}
   }
  }
  for(const p of footprints){if(p.layer!==(s.layer||'superficie'))continue;c.globalAlpha=(1-p.age/12)*.16*opacity(Math.hypot(p.x-s.wx,p.y-s.wy));c.fillRect(p.x+runtime.W/2-s.wx,p.y+runtime.H/2-s.wy,2,1);}
  if(detailQuality>.01){const near=runtime.livingNear?.(220)||[];
   for(const o of near){const x=o.x+runtime.W/2-s.wx,y=o.y+runtime.H/2-s.wy;c.globalAlpha=.07*Math.min(1,detailQuality)*opacity(Math.hypot(o.x-s.wx,o.y-s.wy));c.fillStyle='#000';c.shadowColor='#000';c.shadowBlur=4;c.beginPath();c.ellipse(x+4,y+4,Math.min(18,o.size*.8),3,0,0,Math.PI*2);c.fill();c.shadowBlur=0;
    if(water){c.globalAlpha=.1*water*Math.min(1,detailQuality)*opacity(Math.hypot(o.x-s.wx,o.y-s.wy));c.fillStyle='#fff';c.fillRect(x-4+Math.sin(t/1500+o.variant)*2,y+o.size+4,8,1);}}
  }
  if(fog.wet>.1&&detailQuality>.01){c.fillStyle='#fff';for(let k=0;k<12;k++){const h=visualHash(k,Math.floor(t/2400),groundSeed),x=h*runtime.W,y=visualHash(k+12,Math.floor(t/2400),groundSeed)*runtime.H,age=(t%2400)/2400;c.globalAlpha=fog.wet*.07*Math.min(1,detailQuality)*Math.sin(age*Math.PI);c.fillRect(x-3,y,6+age*4,1);}}
  c.restore();
 }
 function cover(t){if(!runtime.inWorld()||!fog)return;const x=runtime.W/2,y=runtime.H/2,reach=fog.radius,flicker=fog.lamp<.12?1-Math.pow(1-fog.lamp/.12,2)*(.018+.012*Math.sin(t/57)*Math.sin(t/113)):1;
  c.save();c.globalAlpha=1;const g=c.createRadialGradient(x,y,0,x,y,reach*flicker);
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.18,'rgba(0,0,0,0)');g.addColorStop(.52,'rgba(0,0,0,'+fog.density*.42+')');g.addColorStop(.82,'rgba(0,0,0,.66)');g.addColorStop(1,'#000');c.fillStyle=g;c.fillRect(0,0,runtime.W,runtime.H);
  // Noise darkens existing light; it never paints a grey panel over black space.
  if(detailQuality>.01){c.fillStyle='#000';for(let i=0;i<16;i++){const a=i*Math.PI*2/16+t/180000,rr=reach*(.42+visualHash(i,0,groundSeed)*.35),px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr;const n=c.createRadialGradient(px,py,0,px,py,reach*.17);n.addColorStop(0,'rgba(0,0,0,'+fog.density*.13*Math.min(1,detailQuality)+')');n.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=n;c.fillRect(px-reach*.17,py-reach*.17,reach*.34,reach*.34);}}
  const mist=c.createRadialGradient(x,y,reach*.2,x,y,reach*.8),rgb=[fog.red,fog.green,fog.blue].map(Math.round).join(',');mist.addColorStop(0,'rgba('+rgb+',0)');mist.addColorStop(.55,'rgba('+rgb+','+fog.density*.065+')');mist.addColorStop(1,'rgba('+rgb+',0)');c.fillStyle=mist;c.fillRect(x-reach,y-reach,reach*2,reach*2);
  // Emitters at night stay local and underneath the darkness.
  c.restore();
 }
 Object.defineProperties(runtime,{worldVisualBegin:{get:()=>begin},drawDepthGround:{get:()=>ground},drawWorldFog:{get:()=>cover},worldOpacity:{get:()=>opacity},worldVisibility:{get:()=>fog},visualDetail:{get:()=>({quality,detailQuality,hardware,averageMs,frames,pending:pending.length,footprints:footprints.length})}});
}
import {decorativeField} from './territory-presentation.js';
