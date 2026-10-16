import {nativeVisualFamily,nativeVisualDescriptor,facetPoints} from './native-visual.js';
import {anatomyOf,drawAnatomy} from './anatomy.js';
import {elementInk,musicalInk} from './visual.js';
// Weak ownership: visiting more places cannot grow an anatomy registry indefinitely.
export function initialize(runtime){
 const profiles=new WeakMap(),c=runtime.cx;
 const reduce=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 function profile(o,definition,d){let a=profiles.get(o);if(!a){a=anatomyOf(definition,d.worldFamily,runtime.seedOf);profiles.set(o,a);}return a;}
 function species(sp,o,x,y,t,beat,blob=false){
  const d=runtime.regionOfPos(o.hx??o.x,o.hy??o.y);
  if(!blob&&nativeVisualFamily(d,runtime.seedOf)==='pixel'&&runtime.drawSprite){runtime.drawSprite(sp.bits,x,y,sp.cell*(1+o.lit*.3),o.lit>.1?(runtime.musicInk?.(o,sp.role)||'#fff'):elementInk('metal',d.hue));return;}
  const visual=nativeVisualDescriptor(sp,d,runtime.seedOf),still=runtime.S.reducedMotion||reduce();
  if((blob||visual.style==='membrane')&&runtime.drawBlob){runtime.drawBlob(sp,o,x,y,still?0:t,still?0:beat);return;}
  if(visual.style==='facets'){const points=facetPoints(sp.bits,still?0:t/2400),size=Math.min(22,8+(sp.cell||2)*3);c.save();c.translate(x,y);c.strokeStyle=o.lit>.1?(runtime.musicInk?.(o,sp.role)||'#fff'):elementInk('glass',d.hue);c.lineWidth=1.2;c.beginPath();points.forEach(([px,py],i)=>i?c.lineTo(px*size,py*size):c.moveTo(px*size,py*size));c.closePath();c.stroke();c.globalAlpha*=.5;for(const [px,py]of points){c.beginPath();c.moveTo(0,0);c.lineTo(px*size,py*size);c.stroke();}c.restore();return;}
  const group=sp.mob?'fauna':'flora',choices=group==='fauna'?['manta','beetle','worm','crab','deer','jelly']:['branch','network','pods','reeds','flower','lichen'],
   shape=visual.shape||choices[runtime.seedOf(`anatomy:native:v1:${sp.id}`)%choices.length],
   a=profile(o,{id:`${sp.id}:${o.hx??o.x},${o.hy??o.y}`,kind:sp.id,shape,group,role:sp.role,variant:sp.bits},d),
   phase=still?0:t/(1500+(a.individual%1800))+(o.ph||0);
  c.save();c.translate(x,y);c.scale(visual.width,visual.height);c.strokeStyle=o.lit>.1?(runtime.musicInk?.(o,sp.role)||musicalInk(d.hue,sp.role)):d.worldFamily?.ink||elementInk(d.worldFamily?.material||'air',d.worldFamily?.hue??d.hue);c.lineWidth=1.1;
  drawAnatomy(c,a,Math.min(24,9+(sp.cell||2)*3)*(1+o.lit*.08)*(o.nativeOpenness||1),phase);c.restore();
 }
 function plant(o,x,y,t){
  const d=runtime.regionOfPos(o.x,o.y),shape={hierba:'reeds',flor:'flower',arbusto:'branch',helecho:'branch',junco:'reeds',coral:'network'}[o.pt.t];if(!shape)return false;
  const role=runtime.getVoice?.('planta:'+o.pt.t,d,o)?.role||'acorde',a=profile(o,{id:`plant:${o.x},${o.y}`,kind:o.pt.t,shape,group:'flora',role},d);
  c.save();c.translate(x,y-o.h*.45);c.lineWidth=1;c.strokeStyle=o.lit>.1?(runtime.musicInk?.(o,role)||musicalInk(d.hue,role)):d.worldFamily?.ink||elementInk(d.worldFamily?.material||'wood',o.pt.hue);
  drawAnatomy(c,a,Math.max(5,Math.min(22,o.h*.6))*(runtime.nativePlantScale?.(o)||1),reduce()?0:t/(o.personality?.period||1800)+o.ph);c.restore();return true;
 }
 Object.defineProperties(runtime,{drawNativeSpecies:{get:()=>species},drawNativePlant:{get:()=>plant}});
}
