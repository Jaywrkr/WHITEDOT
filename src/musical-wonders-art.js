import {wonderDefinition} from './musical-wonders-model.js';
const shapes=new Map();
export function wonderPortrait(id){const d=wonderDefinition(id);return d?'<svg viewBox="-40 -40 80 80" aria-hidden="true"><circle class="rare-orbit" r="34"/><path class="rare-glyph" d="'+d.path+'" stroke="'+d.color+'" fill="none" stroke-width="1.5"/></svg>':'';}
export function drawWonder(c,d,x,y,seconds,still=false){
 c.save();c.translate(x,y);c.strokeStyle=d.color;c.fillStyle=d.color;c.lineWidth=1.4;
 if(!shapes.has(d.id))shapes.set(d.id,new Path2D(d.path));c.stroke(shapes.get(d.id));
 for(let i=0;i<3;i++){const a=i*2.1+(still?0:seconds*.35);c.globalAlpha=.5;c.fillRect(Math.cos(a)*36,Math.sin(a)*27,2,2);}c.restore();
}
export function drawWonderGift(c,d,x,y,size,seconds,still=false){
 if(!d)return;c.save();c.translate(x,y);c.strokeStyle=c.fillStyle=d.color;c.lineWidth=1;const r=size/2+7,t=still?0:seconds;
 switch(d.index){
 case 0:c.fillRect(-2,-2,4,4);break;
 case 1:c.beginPath();c.ellipse(0,0,r,r*.45,0,0,Math.PI*2);c.stroke();break;
 case 2:for(let i=0;i<3;i++){c.beginPath();c.arc(0,0,r+i*3,.1,Math.PI*1.3);c.stroke();}break;
 case 3:c.beginPath();c.moveTo(0,-size/2);c.quadraticCurveTo(-12,-r-6,-2,-r);c.quadraticCurveTo(10,-r-8,0,-r);c.stroke();break;
 case 4:c.strokeRect(-r,-r,r*2,r*2);break;
 case 5:for(let i=0;i<4;i++)c.fillRect(-r-4+i*7,r+3+(i%2)*3,2,3);break;
 case 6:c.save();c.translate(Math.cos(t*.6)*r,Math.sin(t*.6)*r);c.beginPath();c.moveTo(-5,0);c.lineTo(4,-3);c.lineTo(4,3);c.closePath();c.stroke();c.restore();break;
 case 7:c.fillStyle='#f07848';c.fillRect(-2,-2,4,4);c.fillStyle='#ffd0a0';c.fillRect(-1,-2,1,2);break;
 case 8:c.beginPath();c.moveTo(2,-size/2+1);c.lineTo(-2,0);c.lineTo(2,0);c.lineTo(-1,size/2-1);c.stroke();break;
 case 9:c.strokeRect(-r,-r,r*2,r*2);c.fillRect(r-1,-2,2,4);break;
 case 10:for(let i=0;i<5;i++)c.fillRect(Math.sin(i*3)*size*.35,Math.cos(i*7)*size*.35,1,1);break;
 case 11:c.beginPath();c.moveTo(-size/2,-size/2);c.lineTo(size/2,size/2);c.moveTo(size/2,-size/2);c.lineTo(-size/2,size/2);c.stroke();break;
 case 12:c.beginPath();for(let i=0;i<9;i++){const px=-r-i*3,py=Math.sin(i*.8+t)*3;i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();break;
 case 13:for(let i=-1;i<2;i++){c.beginPath();c.moveTo(-size/2,i*3);c.quadraticCurveTo(0,i*3+3,size/2,i*3);c.stroke();}break;
 case 14:c.beginPath();c.arc(r,-r,5,.4,Math.PI*1.8);c.stroke();break;
 case 15:c.setLineDash([2,4]);c.beginPath();c.moveTo(-r*2,r);c.lineTo(r,r);c.stroke();break;
 case 16:c.beginPath();c.arc(0,0,r+2,Math.PI*1.1,Math.PI*1.9);c.stroke();for(let i=0;i<3;i++)c.fillRect(-8+i*8,-r-4,1,3);break;
 case 17:c.beginPath();c.moveTo(-size/2,size/2);c.lineTo(0,-size/2);c.lineTo(size/2,size/2);c.moveTo(0,-size/2);c.lineTo(0,size/2);c.stroke();break;
 case 18:for(let i=0;i<6;i++){c.globalAlpha=1-i/6;c.fillRect(-r-i*4,Math.sin(i*.4+t)*2,2,2);}break;
 case 19:for(let i=0;i<3;i++){c.strokeStyle=['#8ae0dd','#d3a0ed','#e9ca7d'][i];c.strokeRect(-size/2+i,-size/2+i,size-i*2,size-i*2);}break;
 }c.restore();
}
export function drawMagicShow(c,o,age,variant,color,still=false){
 const u=Math.min(1,Math.max(0,age/4.8)),power=Math.sin(u*Math.PI);c.save();c.translate(o.x,o.y);c.strokeStyle=c.fillStyle=color;c.lineWidth=1;
 for(let i=0;i<24;i++){
  const a=i*Math.PI*2/24+(still?0:age*(variant===1?-.35:.22)),r=still?65:25+power*130,x=Math.cos(a)*r,y=Math.sin(a)*r*.6-35;
  c.globalAlpha=power*.65;c.beginPath();
  if(variant===0){c.rect(x-3,y-9,6,18);}
  else if(variant===1){c.arc(x,y,2+i%3,0,Math.PI*2);}
  else if(variant===2){c.ellipse(0,-35,r,r*.45,a,0,Math.PI*2);}
  else if(variant===3){c.moveTo(x,y-7);c.lineTo(x+5,y);c.lineTo(x,y+7);c.lineTo(x-5,y);c.closePath();}
  else if(variant===4){c.arc(x,y-(!still?power*30:0),4,0,Math.PI*2);c.moveTo(x,y);c.lineTo(x,y+9);}
  else {c.moveTo(x,y);c.lineTo(Math.cos(a+.3)*r,Math.sin(a+.3)*r*.6-35);c.fillRect(x-1,y-1,2,2);}
  c.stroke();
 }
 c.globalAlpha=power*.9;c.beginPath();c.arc(0,-35,still?25:15+power*35,0,Math.PI*2);c.stroke();c.restore();
}
