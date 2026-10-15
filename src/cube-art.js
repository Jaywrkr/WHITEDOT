// Minimal surfaces and borders keep the cube's original square silhouette.
export function cubeSurface(c,s,x,y,size,t,beat){
 c.save();c.translate(x,y);const r=size/2;c.strokeStyle=c.fillStyle='#000';c.lineWidth=1;
 if(s.material!=='plain'){c.save();c.beginPath();c.rect(-r,-r,size,size);c.clip();c.globalAlpha=.25;
  if(s.material==='grain'){for(let i=0;i<5;i++)c.fillRect((i*7%size)-r,(i*11%size)-r,1.5,1.5);}
  else if(s.material==='wood'){for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(-r,i*size/4);c.quadraticCurveTo(0,i*size/4+2,r,i*size/4);c.stroke();}}
  else if(s.material==='glass'){c.globalAlpha=.35;c.strokeRect(-r+2,-r+2,size-4,size-4);c.beginPath();c.moveTo(-r,-r/2);c.lineTo(r/2,-r);c.stroke();}
  else if(s.material==='metal'){c.fillRect(-r,-r/3,size,1);c.fillRect(-r,r/3,size,1);c.globalAlpha=.1;c.fillRect(-r,-r,size/3,size);}
  else if(s.material==='water'){for(let j=-1;j<=1;j++){c.beginPath();for(let i=0;i<=size;i+=2){const yy=j*size/4+Math.sin(i/5+t/600)*1.5;i?c.lineTo(i-r,yy):c.moveTo(i-r,yy);}c.stroke();}}
  else if(s.material==='cloth'){for(let i=2;i<size;i+=4){c.fillRect(i-r,-r,1,size);c.fillRect(-r,i-r,size,1);}}
  else if(s.material==='star'){for(let i=0;i<4;i++)c.fillRect(Math.sin(i*3)*r*.7,Math.cos(i*2)*r*.7,1,1);c.globalAlpha=.4;c.fillRect(-1,-r,2,size);c.fillRect(-r,-1,size,2);}
  c.restore();
 }
 c.strokeStyle=c.fillStyle=s.color;c.globalAlpha=.42;c.lineWidth=1;
 if(s.form==='double')c.strokeRect(-r-4,-r-4,size+8,size+8);
 else if(s.form==='cut'){for(const [a,b]of [[-1,-1],[1,-1],[-1,1],[1,1]]){c.beginPath();c.moveTo(a*(r+5),b*r);c.lineTo(a*(r+5),b*(r+5));c.lineTo(a*r,b*(r+5));c.stroke();}}
 else if(s.form==='bars'){for(let i=-1;i<=1;i++){c.fillRect(r+3,i*3,3,1);c.fillRect(-r-6,i*3,3,1);}}
 else if(s.form==='corners'){for(const [a,b]of [[-1,-1],[1,-1],[-1,1],[1,1]])c.fillRect(a*(r+4)-1,b*(r+4)-1,2,2);}
 else if(s.form==='beating'){const q=3+beat*3;c.strokeRect(-r-q,-r-q,size+q*2,size+q*2);}
 c.restore();
}
export function cubeAura(c,s,x,y,t,beat){if(s.aura==='none')return;c.save();c.translate(x,y);c.strokeStyle=c.fillStyle=s.color;c.lineWidth=1;
 const n=s.aura==='constellation'?5:6;for(let i=0;i<n;i++){const a=i/n*Math.PI*2+t/(s.aura==='firefly'?6000:15000),r=19+Math.sin(t/1200+i)*3;c.globalAlpha=.06+.13*(.5+.5*Math.sin(t/900+i));
  const px=Math.cos(a)*r,py=Math.sin(a)*r;if(s.aura==='rain')c.fillRect(px,py+(t/90+i*4)%10-5,1,3);else if(s.aura==='moss')c.fillRect(px,py,2,1);else{c.fillRect(px,py,1.5,1.5);if(s.aura==='constellation'&&i){const old=(i-1)/n*Math.PI*2+t/15000;c.beginPath();c.moveTo(Math.cos(old)*r,Math.sin(old)*r);c.lineTo(px,py);c.stroke();}}}
 c.restore();
}
export function cubeHalo(c,s,x,y,size,t,beat){if(s.halo==='soft')return;c.save();c.strokeStyle=s.color;c.globalAlpha=.1+beat*.15;c.lineWidth=1;const r=Math.min(25,size*(s.halo==='pulse'?2+beat:s.halo==='breath'?1.7+.2*Math.sin(t/1800):1.4));c.beginPath();if(s.halo==='split'){c.arc(x-2,y,r,-Math.PI/2,Math.PI/2);c.arc(x+2,y,r,Math.PI/2,Math.PI*1.5);}else if(s.halo==='dusk')c.rect(x-r,y-r,r*2,r*2);else c.arc(x,y,r,0,Math.PI*2);c.stroke();c.restore();}
export function cubeTrailPreview(c,s,x,y,t){if(s.trail==='none')return;c.save();c.strokeStyle=c.fillStyle=s.color;c.lineWidth=1;for(let i=1;i<=5;i++){c.globalAlpha=(1-i/7)*.3;const px=x-i*8,py=y+Math.sin(t/900+i)*2;if(s.trail==='line'){c.fillRect(px,py,7,1);}else if(s.trail==='notes'){c.fillRect(px,py,2,2);c.fillRect(px+2,py-5,1,6);}else if(s.trail==='orbit'){c.beginPath();c.arc(px,py,2,0,Math.PI*2);c.stroke();}else if(s.trail==='steps')c.fillRect(px,py+(i%2?2:-2),1,3);else if(s.trail==='weave'){c.beginPath();c.moveTo(px-2,py-2);c.lineTo(px+2,py+2);c.stroke();}else if(s.trail==='grains'){c.fillRect(px-1,py,1,1);c.fillRect(px+2,py-1,1,1);}else c.fillRect(px,py,2,2);}c.restore();}
