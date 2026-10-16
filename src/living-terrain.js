import {ecoregionAt} from './ecoregions.js';
import {decorativeField} from './territory-presentation.js';
export const MICROHABITATS=['cauce','anillo','fractura','valle','delta','isla','claro','cresta'];
export function microhabitat(x,y,size,seedOf){
 const cx=Math.floor(x/size),cy=Math.floor(y/size),h=seedOf(`living:terrain:v1:${cx},${cy}`);
 return {id:MICROHABITATS[h%MICROHABITATS.length],variant:h%256,x:(cx+.5)*size,y:(cy+.5)*size,quiet:h%11===0,slope:((h>>>8)%100)/100};
}
export function initialize(runtime){
 function draw(){if(!runtime.inWorld())return;const c=runtime.cx,size=runtime.WCH,cx=Math.floor(runtime.S.wx/size),cy=Math.floor(runtime.S.wy/size),layer=runtime.S.layer||'superficie';c.save();c.strokeStyle='#a7bdbe';c.lineWidth=.7;
  for(let x=cx-1;x<=cx+1;x++)for(let y=cy-1;y<=cy+1;y++){const f=microhabitat(x*size,y*size,size,runtime.seedOf),px=f.x+runtime.W/2-runtime.S.wx,py=f.y+runtime.H/2-runtime.S.wy;if(Math.hypot(px-runtime.W/2,py-runtime.H/2)>650)continue;const region=runtime.regionOfPos(f.x,f.y),eco=ecoregionAt(region,runtime.BIOMES[region.z].id,runtime.seedOf);c.strokeStyle=region.worldFamily?.ink||`hsl(${eco.hue},30%,65%)`;const field=decorativeField(f.x,f.y,runtime.seedOf);if(field<.002)continue;c.globalAlpha=(eco.variant?.14:.09)*field;c.beginPath();
   if(f.id==='anillo'||layer==='cielo'){c.ellipse(px,py,38,16,f.slope,0,Math.PI*2);}
   else if(f.id==='fractura'||f.id==='cresta'){c.moveTo(px-30,py+10);c.lineTo(px-8,py-8);c.lineTo(px+3,py+4);c.lineTo(px+30,py-16);}
   else if(['delta','cauce','valle'].includes(f.id)){for(let i=-1;i<=1;i++){c.moveTo(px-32,py+i*7);c.bezierCurveTo(px-15,py-18+i*7,px+15,py+18+i*7,px+32,py+i*7);}}
   else if(f.id==='isla'){c.ellipse(px,py,32,14,f.slope,0,Math.PI*2);}c.stroke();
  }c.restore();
 }
 Object.defineProperties(runtime,{localEcoregion:{get:()=>()=>{const d=runtime.regionOfPos(runtime.S.wx,runtime.S.wy);return ecoregionAt(d,runtime.BIOMES[d.z].id,runtime.seedOf);}},drawLivingTerrain:{get:()=>draw},microhabitat:{get:()=>()=>microhabitat(runtime.S.wx,runtime.S.wy,runtime.WCH,runtime.seedOf)}});
}
