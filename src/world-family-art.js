import {prefersReducedMotion} from './frame-state.js';
import {ecosystemAt} from './ecosystem-field.js';
import {visualHash,distanceOpacity} from './world-visibility-model.js';
import {decorativeField} from './territory-presentation.js';
// Small ground structures; never a screen-filling illustration or a collision wall.
export function familyContour(c,terrain,s,t,phase,reduced=false){
 const motion=reduced?0:Math.sin(t/2400+phase)*2;
 c.beginPath();
 switch(terrain){
 case 'currents':for(let i=-1;i<=1;i++){c.moveTo(-s,i*6);c.bezierCurveTo(-s*.35,-s*.4+i*6+motion,s*.35,s*.4+i*6,s,i*6);}break;
 case 'roots':for(let i=0;i<3;i++){const a=i*Math.PI*2/3+phase;c.moveTo(0,0);c.quadraticCurveTo(Math.cos(a+.5)*s*.4,Math.sin(a+.5)*s*.4,Math.cos(a)*s,Math.sin(a)*s);c.moveTo(Math.cos(a)*s*.5,Math.sin(a)*s*.5);c.lineTo(Math.cos(a-.4)*s*.85,Math.sin(a-.4)*s*.85);}break;
 case 'terraces':for(let i=0;i<3;i++){c.moveTo(-s+i*6,s*.4-i*7);c.lineTo(-s*.2+i*4,s*.4-i*7);c.lineTo(s*.1+i*4,-s*.35-i*7);c.lineTo(s,-s*.35-i*7);}break;
 case 'orbits':for(let i=0;i<2;i++){c.moveTo(Math.cos(.3)*s*(1-i*.25),Math.sin(.3)*s*.48*(1-i*.25));c.ellipse(0,0,s*(1-i*.25),s*.48*(1-i*.25),0,.3,Math.PI*1.65);}break;
 case 'facets':for(let i=0;i<3;i++){const a=i*Math.PI*2/3+phase;c.moveTo(0,0);c.lineTo(Math.cos(a)*s,Math.sin(a)*s);c.lineTo(Math.cos(a+.6)*s*.55,Math.sin(a+.6)*s*.55);c.closePath();}break;
 case 'vaults':for(let i=0;i<3;i++){c.moveTo(-s+i*7,s*.25);c.bezierCurveTo(-s+i*7,-s,s-i*7,-s,s-i*7,s*.25);}break;
 case 'ridges':for(let i=0;i<3;i++){c.moveTo(-s,i*7);c.quadraticCurveTo(-s*.1,-s*.45+i*7+motion,s,i*7);}break;
 case 'islands':for(let i=-1;i<=1;i++){const x=i*s*.6,y=Math.sin(i*2+phase)*s*.3;c.moveTo(x+7,y);c.ellipse(x,y,7,3,0,0,Math.PI*2);c.moveTo(x,y);c.quadraticCurveTo(x+motion,y-8,x+motion,y-17);}break;
 }
 c.stroke();
}
export function initialize(runtime){
 const c=runtime.cx;let drawn=0,examined=0,clear=0;
 function draw(t){
  drawn=0;examined=0;clear=0;if(!runtime.inWorld()||runtime.S.layer!=='superficie'&&runtime.S.layer)return;
  const s=runtime.S,radius=runtime.worldVisibility?.radius||750,step=180,
   halfX=Math.min(runtime.W/2+90,radius),halfY=Math.min(runtime.H/2+90,radius);
  const reduced=runtime.S.reducedMotion||prefersReducedMotion();
  c.save();c.lineWidth=1;
  for(let x=Math.floor((s.wx-halfX)/step);x<=Math.floor((s.wx+halfX)/step);x++)for(let y=Math.floor((s.wy-halfY)/step);y<=Math.floor((s.wy+halfY)/step);y++){
   const wx=(x+.5)*step,wy=(y+.5)*step,d=runtime.regionOfPos(wx,wy),f=d.worldFamily;if(!f||f.quiet)continue;
   examined++;const field=decorativeField(wx,wy,runtime.seedOf);if(field<.002){clear++;continue;}
   const h=visualHash(x,y,f.seed),detail=runtime.visualDetail?.detailQuality??1;
   const presence=Math.max(0,Math.min(1,(.4+Math.min(2,detail)*.13-h)*12));if(!presence)continue;
   const px=wx+Math.sin(f.angle+y)*27,py=wy+Math.cos(f.angle+x)*27,
    alpha=field*presence*(.3+.7*ecosystemAt(f,px,py,runtime.seedOf).weight)*distanceOpacity(Math.hypot(px-s.wx,py-s.wy),radius)*(.16+h*.15);
   if(alpha<.002)continue;
   c.save();c.translate(px+runtime.W/2-s.wx,py+runtime.H/2-s.wy);c.rotate(f.angle*.35);
   c.globalAlpha=alpha;c.strokeStyle=f.ink||`hsl(${f.hue},${f.saturation}%,67%)`;
   familyContour(c,f.terrain,19+h*16,t,h*6.28,reduced);c.restore();drawn++;
  }
  c.restore();
 }
 Object.defineProperties(runtime,{drawWorldFamilyGround:{get:()=>draw},worldFamilyVisualStats:{get:()=>({drawn,examined,clear})}});
}
