import {ACTIVITY_TILE as T} from './universe-activities-model.js';
const palette=['#9de0d6','#d2b1ed','#e9ca7d','#c7db9a','#a8bfdc'];
function symbol(c,x,y,shape,r=8){c.beginPath();if(shape%6===0)c.arc(x,y,r,0,Math.PI*2);else if(shape%6===1)c.rect(x-r,y-r,r*2,r*2);else{const count=3+shape%4;for(let i=0;i<=count;i++){const a=i*Math.PI*2/count-Math.PI/2;i?c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r):c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}c.closePath();}c.stroke();}
export function drawActivity(r,l,s,t,paid=false){
 const c=r.cx,id=l.def.id,ink=palette[l.def.index%5],ox=r.W/2-s.x*T,oy=r.H/2-s.y*T,still=r.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,clock=still?0:s.time;
 c.save();c.globalAlpha=1;c.fillStyle='#000';c.fillRect(0,0,r.W,r.H);c.lineWidth=1;
 const minX=Math.max(0,Math.floor(-ox/T)-1),maxX=Math.min(l.n,Math.ceil((r.W-ox)/T)+1),minY=Math.max(0,Math.floor(-oy/T)-1),maxY=Math.min(l.n,Math.ceil((r.H-oy)/T)+1);
 for(let y=minY;y<maxY;y++)for(let x=minX;x<maxX;x++){
  const px=x*T+ox,py=y*T+oy;
  if(!l.floor[y*l.n+x]){c.fillStyle='#101318';c.fillRect(px,py,T,T);c.strokeStyle='#334048';c.strokeRect(px+.5,py+.5,T-1,T-1);}
  else{c.fillStyle=(x+y)%2?'#040607':'#07090b';c.fillRect(px,py,T,T);}
 }
 const point=p=>({x:p.x*T+ox,y:p.y*T+oy});
 if(id==='islands'){
  c.fillStyle='#02090e';c.fillRect(0,0,r.W,r.H);for(const [i,p]of l.route.entries()){const q=point(p);c.strokeStyle=i<s.next?'#e9ca7d':ink;c.globalAlpha=.55+(still?0:.2*Math.sin(clock*2+i));c.beginPath();c.arc(q.x,q.y,T*.7,0,Math.PI*2);c.stroke();}c.globalAlpha=1;
 }
 if(id==='giant'){const q=point({x:8,y:8});c.strokeStyle=ink;c.globalAlpha=.4;c.beginPath();c.ellipse(q.x,q.y,6*T,5*T,-.3,0,Math.PI*2);c.moveTo(q.x-2*T,q.y-5*T);c.lineTo(q.x-3*T,q.y-6*T);c.moveTo(q.x+2*T,q.y-5*T);c.lineTo(q.x+3*T,q.y-6*T);c.stroke();c.globalAlpha=1;}
 if(['race','tracks','echoes'].includes(id))for(const [i,p]of l.route.entries()){
  if(id==='tracks'&&i>s.next+2)continue;const q=point(p);c.strokeStyle=i===s.next?'#fff':ink;c.globalAlpha=i<s.next?.25:1;symbol(c,q.x,q.y,id==='tracks'?i%2:0,i===s.next?10:4);
 }c.globalAlpha=1;
 if(id==='race'&&s.ghost?.length){const p=s.ghost.find(p=>p[2]>=s.time)||s.ghost.at(-1);const q=point({x:p[0],y:p[1]});c.globalAlpha=.35;c.fillStyle=ink;c.fillRect(q.x-5,q.y-5,10,10);c.globalAlpha=1;}
 if(l.def.family==='rotate'){
  c.strokeStyle=ink;c.globalAlpha=.3;c.beginPath();const first=point(l.nodes[0]);c.moveTo(first.x-T,first.y);for(const node of l.nodes){const q=point(node);c.lineTo(q.x,q.y);}c.stroke();c.globalAlpha=1;
  if(id==='observatory'||id==='fold'){const q=point({x:8.5,y:8.5});for(let i=0;i<4;i++){c.save();c.translate(q.x,q.y);c.rotate(s.values[i]*Math.PI/2);c.strokeStyle=s.values[i]===l.solution[i]?'#e9ca7d':ink;c.beginPath();c.ellipse(0,0,(2+i*.5)*T,(.6+i*.4)*T,0,0,Math.PI*1.7);c.stroke();c.restore();}}
  if(id==='train'){const a=Math.min(l.nodes.length-1,Math.floor(s.flow)),p=l.nodes[a],next=l.nodes[Math.min(a+1,l.nodes.length-1)],u=s.flow-a,q=point({x:p.x+(next.x-p.x)*u,y:p.y+(next.y-p.y)*u});c.fillStyle='#fff';c.fillRect(q.x-10,q.y-6,20,12);}
 }
 for(const [i,node]of l.nodes.entries()){
  if(['push','escort','herd','attract','dig'].includes(l.def.family)||['maze','islands','race','tracks','echoes'].includes(id))continue;
  const q=point(node),correct=l.def.family==='rotate'?s.values[i]===l.solution[i]:s.values[i]===l.solution[i]||s.visited[i];c.strokeStyle=correct?'#e9ca7d':ink;c.fillStyle=correct?'#e9ca7d':'#101418';c.lineWidth=1;
  if(l.def.family==='rotate'){
   if(id==='waves'){for(let k=0;k<3;k++){c.globalAlpha=.7-k*.15;c.beginPath();c.arc(q.x,q.y,8+(clock*14+k*10+s.values[i]*8)%36,0,Math.PI*2);c.stroke();}c.globalAlpha=1;}
   else if(id==='storm'){c.strokeRect(q.x-12,q.y-25,24,50);c.globalAlpha=.4;c.fillRect(q.x-10,q.y+23-(s.levels[i]/3)*46,20,(s.levels[i]/3)*46);c.globalAlpha=1;c.beginPath();c.moveTo(q.x-16,q.y+23-l.solution[i]/3*46);c.lineTo(q.x+16,q.y+23-l.solution[i]/3*46);c.stroke();}
   else{c.save();c.translate(q.x,q.y);c.rotate(s.values[i]*Math.PI/2);if(id==='domino')c.strokeRect(-5,-17,10,34);else{c.beginPath();c.moveTo(-15,0);c.lineTo(0,0);c.lineTo(0,-15);c.stroke();}c.restore();}
   c.beginPath();c.arc(q.x,q.y,22,0,Math.PI*2);c.stroke();
   c.globalAlpha=.35;const a=l.solution[i]*Math.PI/2;c.beginPath();c.moveTo(q.x+Math.sin(a)*24,q.y-Math.cos(a)*24);c.lineTo(q.x+Math.sin(a)*29,q.y-Math.cos(a)*29);c.stroke();c.globalAlpha=1;
  }else if(l.def.family==='doors'){
   c.strokeRect(q.x-15,q.y-24,30,48);symbol(c,q.x,q.y-4,node.shape,8);
  }else if(id==='city'){c.fillStyle=s.values[i]?'#e9ca7d':'#13202b';c.fillRect(q.x-14,q.y-16,28,32);c.strokeRect(q.x-14,q.y-16,28,32);c.fillStyle='#000';c.fillRect(q.x-6,q.y-8,4,4);c.fillRect(q.x+2,q.y-8,4,4);}
  else {c.globalAlpha=.25;c.fillRect(q.x-16,q.y-16,32,32);c.globalAlpha=1;
   if(id==='orchestra'){c.beginPath();if(i===0){c.moveTo(q.x-10,q.y+12);c.lineTo(q.x-7,q.y-12);c.lineTo(q.x+9,q.y-8);for(let k=0;k<4;k++){c.moveTo(q.x-5+k*4,q.y-8);c.lineTo(q.x-5+k*4,q.y+10);}}else if(i===1){c.ellipse(q.x,q.y,11,6,0,0,Math.PI*2);c.moveTo(q.x-11,q.y);c.lineTo(q.x-8,q.y+12);c.lineTo(q.x+8,q.y+12);c.lineTo(q.x+11,q.y);}else if(i===2){c.moveTo(q.x-3,q.y-14);c.lineTo(q.x-3,q.y+14);c.lineTo(q.x+3,q.y+14);c.lineTo(q.x+3,q.y-14);for(let k=0;k<3;k++)c.rect(q.x-1,q.y-7+k*6,2,2);}else for(let k=0;k<4;k++)c.rect(q.x-11+k*6,q.y-9,4,18);c.stroke();}
   else symbol(c,q.x,q.y,node.shape,11);
  }
 }
 for(const [i,target]of l.targets.entries())if(['push','escort','herd','attract'].includes(l.def.family)){
  const q=point(target);c.strokeStyle=palette[i%5];c.setLineDash([3,4]);symbol(c,q.x,q.y,i,17);c.setLineDash([]);
 }
 for(const [i,b]of s.blocks.entries())if(['push','escort','herd','attract'].includes(l.def.family)){
  const q=point(b);c.strokeStyle=c.fillStyle=palette[b.index%5];c.globalAlpha=s.locked[i]?1:.8;
  if(id==='garden'){const grow=Math.min(1,s.growth[i]/2);c.beginPath();c.moveTo(q.x,q.y+6);c.lineTo(q.x,q.y-6-grow*20);c.stroke();for(let k=0;k<3;k++){c.beginPath();c.arc(q.x+Math.sin(k*2.1)*grow*10,q.y-6-grow*20+Math.cos(k*2.1)*grow*6,2+grow*3,0,Math.PI*2);c.stroke();}}
  else if(['caravan','fireflies','theatre'].includes(id)){symbol(c,q.x,q.y,b.index,7);c.fillStyle='#fff';c.fillRect(q.x-3,q.y-2,1,2);c.fillRect(q.x+2,q.y-2,1,2);}
  else symbol(c,q.x,q.y,b.index,10);c.globalAlpha=1;
 }
 if(id==='excavation')for(const cell of l.digCells){const q=point({x:cell%l.n+.5,y:Math.floor(cell/l.n)+.5});c.strokeStyle=s.dug.includes(cell)?'#e9ca7d':'#344049';symbol(c,q.x,q.y,3,s.dug.includes(cell)?12:5);}
 if(l.def.family==='doors'||l.def.family==='sequence'){
  const target=l.sequence[l.def.family==='doors'?(id==='tower'?s.stage:s.next):s.next];if(target!==undefined){c.strokeStyle='#fff';symbol(c,r.W/2,95,target,12);}
 }
 const goal=point(l.goal),exit=point(l.exit);c.strokeStyle=s.done?'#e9ca7d':ink;symbol(c,goal.x,goal.y,3,16);
 if(s.done){c.globalAlpha=.5;for(let i=0;i<3;i++){c.beginPath();c.arc(goal.x,goal.y,22+i*12+(still?0:Math.sin(clock+i)*3),0,Math.PI*2);c.stroke();}c.globalAlpha=1;}
 c.strokeStyle='#fff';c.strokeRect(exit.x-12,exit.y-16,24,32);c.beginPath();c.moveTo(exit.x,exit.y-4);c.lineTo(exit.x,exit.y+9);c.lineTo(exit.x-5,exit.y+4);c.moveTo(exit.x,exit.y+9);c.lineTo(exit.x+5,exit.y+4);c.stroke();
 const reset=point({x:3.5,y:l.n-1.5});if(id!=='maze'&&id!=='islands'){c.strokeStyle='#7d8b95';c.beginPath();c.arc(reset.x,reset.y,10,.5,Math.PI*2);c.stroke();}
 c.fillStyle='#fff';c.fillRect(r.W/2-5,r.H/2-5,10,10);
 if(r.S.universeTexts!==false){c.fillStyle='#fff';c.textAlign='center';c.font='14px "Geist Mono",monospace';c.fillText(l.def.name,r.W/2,32,r.W-30);c.fillStyle='#b0bdc4';c.font='11px "Geist Mono",monospace';c.fillText(s.done?(paid?'Completado · +5 ✦':'Completado · Recuerdo conservado'):l.def.hint,r.W/2,54,r.W-30);c.fillText('Puerta ↓ salir · Círculo ↻ reiniciar',r.W/2,r.H-86,r.W-30);}
 c.restore();
}
export function drawActivityPortal(r,o,definition,done,fill=0){
 const c=r.cx,x=o.x+r.W/2-r.camX,y=o.y+r.H/2-r.camY;c.save();c.strokeStyle=done?'#e9ca7d':'#9de0d6';c.lineWidth=1.2;
 symbol(c,x,y,definition.index%6,28);c.beginPath();c.arc(x,y,35,-Math.PI/2,-Math.PI/2+Math.PI*2*(fill||1));c.stroke();
 if(r.S.universeTexts!==false&&Math.hypot(o.x-r.S.wx,o.y-r.S.wy)<160){c.textAlign='center';c.font='11px "Geist Mono",monospace';c.fillStyle='#fff';c.fillText(definition.name,x,y-45);c.fillText(done?'Puedes volver a jugar':'Quédate dentro del portal',x,y+52);}c.restore();
}
