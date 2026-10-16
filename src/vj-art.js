const TAU=Math.PI*2;
// Bounded original vector scenes, inspired by Jay's reference collection.
export function drawVisualSegment(c,q,{x,y,radius,time=0,energy=0,alpha=1,reduced=false}={}){
 const r=radius,t=reduced?0:time,p=q.phase,ink=`hsl(${q.hue} 65% 68%)`,other=`hsl(${(q.hue+90)%360} 65% 65%)`;
 c.save();c.translate(x,y);c.beginPath();c.arc(0,0,r,0,TAU);c.clip();c.globalAlpha=alpha*.28;c.strokeStyle=ink;c.fillStyle=ink;c.lineWidth=.8;
 const dot=(dx,dy,s=2)=>{c.beginPath();c.arc(dx,dy,s,0,TAU);c.fill();};
 if(q.kind==='orbitas'){
  for(let i=1;i<5;i++){const rr=r*i/5,a=p+i*.7+t*.03*(i%2?1:-1);c.beginPath();c.arc(0,0,rr,a,a+TAU*.8);c.stroke();dot(Math.cos(a)*rr,Math.sin(a)*rr,1.4);}
  c.beginPath();c.moveTo(-r*.18,0);c.lineTo(r*.18,0);c.moveTo(0,-r*.18);c.lineTo(0,r*.18);c.stroke();
 }else if(q.kind==='circuitos'){
  for(let i=-2;i<=2;i++){const z=i*r*.3;c.strokeStyle=i%2?ink:other;c.beginPath();c.moveTo(-r,z);c.lineTo(-r*.25,z);c.bezierCurveTo(r*.2,z,r*.2,-z,r*.5,-z);c.lineTo(r,-z);c.stroke();const u=(t*.08+p+i+10)%1;dot(-r+2*r*u,z*Math.cos(u*Math.PI),2+energy);}
 }else if(q.kind==='cintas'){
  for(let i=-2;i<=2;i++){const z=i*r*.34,w=5+Math.sin(t*.3+i+p)*2;const g=c.createLinearGradient(z-w,-r,z+w,r);g.addColorStop(0,'transparent');g.addColorStop(.35,ink);g.addColorStop(.58,other);g.addColorStop(1,'transparent');c.strokeStyle=g;c.lineWidth=w;c.beginPath();c.moveTo(z,-r);c.bezierCurveTo(z+r*.4,-r*.3,z-r*.4,r*.3,z,r);c.stroke();}
 }else if(q.kind==='vidrio'){
  for(let i=0;i<3;i++){c.save();c.rotate(p+i*1.2+t*.025);c.scale(1,.65);const g=c.createRadialGradient(r*.13,-r*.2,2,0,0,r*.68);g.addColorStop(0,'transparent');g.addColorStop(.55,ink);g.addColorStop(.8,other);g.addColorStop(1,'transparent');c.fillStyle=g;c.beginPath();c.arc(r*.12,0,r*.68,0,TAU);c.fill();c.restore();}
 }else if(q.kind==='islas'||q.kind==='organismo'){
  for(let layer=0;layer<4;layer++){const rr=r*(.3+layer*.16);c.beginPath();for(let i=0;i<=64;i++){const a=i/64*TAU,rad=rr*(1+.13*Math.sin(a*3+p+t*.07)+.1*Math.cos(a*5-p));c[i?'lineTo':'moveTo'](Math.cos(a)*rad,Math.sin(a)*rad);}c.closePath();c.stroke();}
  if(q.kind==='organismo')for(let i=0;i<4;i++){const a=p+i*TAU/4;dot(Math.cos(a)*r*.43,Math.sin(a)*r*.43,3);}
 }else if(q.kind==='partitura'){
  for(let i=-2;i<=2;i++){const yy=i*r*.3;c.beginPath();c.moveTo(-r,yy);c.lineTo(r,yy);c.stroke();for(let j=0;j<3;j++)dot(Math.sin(p+i*2+j*3)*r*.7,yy,j===i%3?4:1.8);}
  c.strokeStyle=other;c.lineWidth=2;c.beginPath();for(let i=0;i<=24;i++){const yy=-r+i/24*r*2,xx=Math.sin(yy/r*3+p+t*.1)*r*.6;c[i?'lineTo':'moveTo'](xx,yy);}c.stroke();
 }else{
  for(let i=1;i<=4;i++){c.beginPath();c.arc(-r*.55,r*.55,r*i*.36,-Math.PI/2,-.05);c.stroke();}for(let i=0;i<6;i++){const a=-Math.PI/2+i*.28;c.beginPath();c.moveTo(-r*.55,r*.55);c.lineTo(-r*.55+Math.cos(a)*r*1.5,r*.55+Math.sin(a)*r*1.5);c.stroke();}
 }
 c.restore();
}
