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
 }else if(q.kind==='brotes'){
  // Analytic stems: no particles, history buffers or growing allocations.
  for(let i=0;i<14;i++){const a=p+i*2.399,baseX=Math.cos(a)*r*.65,baseY=r*.8-i/14*r*.3,tipX=baseX+Math.sin(t*.12+i)*r*.18,tipY=-r*(.15+(i%5)*.16);c.strokeStyle=ink;c.lineWidth=.6;c.beginPath();c.moveTo(baseX,baseY);c.bezierCurveTo(baseX-r*.2,baseY-r*.5,tipX+r*.12,tipY+r*.35,tipX,tipY);c.stroke();c.fillStyle=i%3===0?'#fff':other;dot(tipX,tipY,1.3+energy*3);}
 }else if(q.kind==='nudo'){
  // Three folded ribbons, compact white crossings and a short tail.
  for(let i=0;i<3;i++){c.save();c.rotate(p+i*TAU/3+t*.025);const g=c.createLinearGradient(-r*.6,0,r*.6,0);g.addColorStop(0,ink);g.addColorStop(.45,'#fff');g.addColorStop(1,other);c.strokeStyle=g;c.lineWidth=r*(.07+energy*.025);c.beginPath();c.moveTo(-r*.7,r*.25);c.bezierCurveTo(-r*.2,-r*.9,r*.8,-r*.6,r*.55,0);c.bezierCurveTo(r*.1,r*.65,-r*.6,r*.6,-r*.35,-r*.2);c.stroke();c.restore();}
 }else if(q.kind==='telarana'){
  for(let center=0;center<2;center++){const xx=(center?1:-1)*r*.28,yy=(center?1:-1)*r*.12;c.strokeStyle=center?other:'#fff';c.lineWidth=.55;for(let ring=1;ring<=5;ring++){c.beginPath();for(let j=0;j<=36;j++){const a=j/36*TAU,rr=ring*r*.09*(1+.11*Math.sin(a*5+p+t*.07));c[j?'lineTo':'moveTo'](xx+Math.cos(a)*rr,yy+Math.sin(a)*rr);}c.stroke();}for(let j=0;j<12;j++){const a=j/12*TAU+p;c.beginPath();c.moveTo(xx+Math.cos(a)*r*.08,yy+Math.sin(a)*r*.08);c.lineTo(xx+Math.cos(a)*r*.48,yy+Math.sin(a)*r*.48);c.stroke();}}
 }else if(q.kind==='red-orbital'){
  for(let ring=1;ring<=4;ring++){const rr=r*(.13+ring*.15)*(1+energy*.06);c.strokeStyle=ink;c.beginPath();for(let j=0;j<=20;j++){const a=j/20*TAU+p+Math.sin(ring+t*.05)*.2;c[j?'lineTo':'moveTo'](Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();c.stroke();for(let j=0;j<20;j++){const a=j/20*TAU+p+Math.sin(ring+t*.05)*.2,x=Math.cos(a)*rr,y=Math.sin(a)*rr;c.fillStyle=other;dot(x,y,1+energy*2);if(ring<4){const next=a+Math.sin(ring+1+t*.05)*.2-Math.sin(ring+t*.05)*.2;c.beginPath();c.moveTo(x,y);c.lineTo(Math.cos(next)*r*(.13+(ring+1)*.15),Math.sin(next)*r*(.13+(ring+1)*.15));c.stroke();}}}
 }else{
  for(let i=1;i<=4;i++){c.beginPath();c.arc(-r*.55,r*.55,r*i*.36,-Math.PI/2,-.05);c.stroke();}for(let i=0;i<6;i++){const a=-Math.PI/2+i*.28;c.beginPath();c.moveTo(-r*.55,r*.55);c.lineTo(-r*.55+Math.cos(a)*r*1.5,r*.55+Math.sin(a)*r*1.5);c.stroke();}
 }
 c.restore();
}
