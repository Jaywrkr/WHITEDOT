import {pixelGenome,pixelGeometry} from './pixel-life-model.js';
import {drawTotem} from './sculpture-totems-art.js';
import {MISCHIEF} from './universe-mischief-model.js';
const TAU=Math.PI*2,shapes=new Map();
function creature(c,x,y,seed,seedOf,pose=0,ink='#bccbd0'){
 const key=String(seed);if(!shapes.has(key)){shapes.set(key,pixelGeometry(pixelGenome(key,seedOf)));while(shapes.size>32)shapes.delete(shapes.keys().next().value);}
 c.save();c.translate(x,y);c.rotate(pose);c.fillStyle=ink;for(const [a,b]of shapes.get(key))c.fillRect(a*1.7,b*1.7,1.7,1.7);c.restore();
}
function crystal(c,x,y,size=12){c.beginPath();c.moveTo(x,y-size);c.lineTo(x+size*.6,y);c.lineTo(x,y+size);c.lineTo(x-size*.6,y);c.closePath();c.stroke();c.beginPath();c.moveTo(x,y-size);c.lineTo(x,y+size);c.stroke();}
function ring(c,x,y,r){c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();}
export function drawMischief(r,s,reduced=false){
 if(!s)return;const c=r.cx,ox=r.W/2-r.camX,oy=r.H/2-r.camY,p={x:r.S.wx+ox,y:r.S.wy+oy},x=s.x+ox,y=s.y+oy,ax=s.actor.x+ox,ay=s.actor.y+oy,t=reduced?0:s.age,phase=s.stage;
 c.save();c.lineWidth=1;c.strokeStyle='#b9d3da';c.fillStyle='#b9d3da';c.globalAlpha=.85;
 switch(s.kind){
 case 'helper':
  crystal(c,ax,ay,10);if(s.target){const tx=s.target.x+ox,ty=s.target.y+oy;c.strokeStyle='#e9ca7d';ring(c,tx,ty,26+(reduced?0:Math.sin(t*3)*3));if(phase>0){c.setLineDash([2,6]);c.beginPath();c.moveTo(ax,ay);c.lineTo(tx,ty);c.stroke();c.setLineDash([]);}}break;
 case 'imitator':creature(c,ax,ay,s.seed,r.seedOf,reduced?0:s.wobble||0);if(s.still>.8)ring(c,ax,ay,15);break;
 case 'rain':
  s.drops.forEach((q,i)=>{if(s.collected.includes(i))return;const a=q.x+ox,b=q.y+oy-(q.rise||0);c.strokeStyle=i%3===0?'#8ae0dd':'#e9ca7d';crystal(c,a,b,4);c.globalAlpha=.25;c.beginPath();c.moveTo(a,b+3);c.lineTo(a,b+14);c.stroke();c.globalAlpha=.85;ring(c,q.x+ox,q.y+oy,10);});break;
 case 'shadow':
  c.fillStyle='#8d96ab';c.globalAlpha=.4;if(phase===0||s.done)c.fillRect(p.x+9,p.y+12,12,8);else{c.save();c.translate(ax,ay);c.rotate(-.4);c.fillRect(-7,-4,14,8);c.restore();}
  creature(c,ax,ay-10,s.seed,r.seedOf,0,'#c7abdb');if(phase>=1)s.drops.filter((q,i)=>i<6&&i%2===0).forEach((q,i)=>{if(i>s.clues.length)return;c.globalAlpha=s.clues.includes(i)?.3:.8;c.strokeStyle='#c7abdb';ring(c,q.x+ox,q.y+oy,13);c.fillRect(q.x+ox-1,q.y+oy-1,2,2);});break;
 case 'audience':
  for(let i=0;i<(s.watchers||1);i++){const a=i*TAU/6,q=phase>=2?s.followers[i]:{x:s.x+Math.cos(a)*70,y:s.y+Math.sin(a)*50};if(phase===0){c.fillRect(q.x+ox-3,q.y+oy,2,2);c.fillRect(q.x+ox+2,q.y+oy,2,2);}else creature(c,q.x+ox,q.y+oy,s.seed+i,r.seedOf,reduced?0:Math.sin(t*4+i)*.1);}
  if(s.festival&&phase>=3){c.strokeStyle='#e9ca7d';for(let i=0;i<3;i++)ring(c,p.x,p.y,35+i*20+(reduced?0:Math.sin(t*4)*4));}break;
 case 'dance':
  if(s.target){c.save();const q=s.target;c.translate(q.x+ox+(reduced?0:Math.sin(t*3)*Math.min(18,s.progress*3)),q.y+oy);drawTotem(c,q,{light:.7,lean:reduced?0:Math.sin(t*4)*.15,dance:t*8,still:reduced,progress:phase?3:0});c.restore();}
  c.strokeStyle='#e9ca7d';c.setLineDash([3,8]);ring(c,s.target?s.target.x+ox:x,s.target?s.target.y+oy:y,65);c.setLineDash([]);break;
 case 'race':
  creature(c,ax,ay,s.seed,r.seedOf);c.strokeStyle='#e9ca7d';c.beginPath();c.moveTo(s.goal.x+ox,s.goal.y+oy-20);c.lineTo(s.goal.x+ox,s.goal.y+oy+20);c.stroke();for(let i=0;i<4;i++)c.fillRect(s.goal.x+ox+2+(i%2)*4,s.goal.y+oy-20+i*4,4,4);
  if(phase===1){c.globalAlpha=.9;c.fillStyle='#e9ca7d';c.font='600 16px "Geist Mono",monospace';c.textAlign='center';c.fillText(String(3-Math.floor(s.count||0)),ax,ay-18);}break;
 case 'breath':
  c.strokeStyle='#b9d3da';c.globalAlpha=.25;ring(c,x,y,110);for(let i=0;i<12;i++){const a=i*TAU/12+(phase===1?0:t*.4),radius=phase===2?45+s.release*65:45;c.fillRect(x+Math.cos(a)*radius,y+Math.sin(a)*radius,3,3);}break;
 case 'twin':
  if(phase<3){const assemble=phase===2?1:Math.min(1,(s.stageAge||0)/1.5);for(let i=0;i<8;i++){const a=i*TAU/8,rad=(1-assemble)*38+6;c.fillRect(ax+Math.cos(a)*rad-2,ay+Math.sin(a)*rad-2,4,4);}if(phase===2){c.strokeRect(ax-7,ay-7,14,14);c.fillRect(ax-3,ay-2,2,2);c.fillRect(ax+2,ay-2,2,2);}}else s.drops.forEach((q,i)=>{if(!s.collected.includes(i)){c.fillStyle=i%3===0?'#8ae0dd':'#e9ca7d';c.fillRect(q.x+ox-3,q.y+oy-3,6,6);}});break;
 case 'farewell':
  creature(c,ax,ay,s.seed,r.seedOf);if(phase===2)for(let i=0;i<=s.relay;i++){const relay=s.relays?.[i%Math.max(1,s.relays.length)],qx=relay?relay.x+ox:x+Math.cos(i*.9)*i*85,qy=relay?relay.y+oy:y+Math.sin(i*.9)*i*65;c.globalAlpha=.65-i*.1;ring(c,qx,qy,15+(reduced?0:Math.sin(t*5)*3));c.fillRect(qx-2,qy-2,4,4);}break;
 }
 if(s.done){c.strokeStyle='#e9ca7d';c.globalAlpha=.65;for(let i=0;i<8;i++){const a=i*TAU/8,rad=24+(reduced?0:Math.min(1,s.celebration||0)*45);c.fillStyle=i%3?'#e9ca7d':'#8ae0dd';c.fillRect(p.x+Math.cos(a)*rad-2,p.y+Math.sin(a)*rad-2,4,4);}}
 if(Math.hypot(s.x-r.S.wx,s.y-r.S.wy)<180){c.globalAlpha=.75;c.fillStyle='#ddd';c.font='10px "Geist Mono",monospace';c.textAlign='center';const hints={helper:'Acompaña el cristal · rompe el grande',imitator:'Muévete · gira '+Math.min(s.turns||0,2)+'/2 · detente',rain:'Pasa entre los fragmentos',shadow:'Pista '+Math.min(3,(s.clues?.length||0)+1)+'/3 · luego alcanza tu sombra',audience:phase<2?'Espera un poco · después camina':'Te siguen · '+Math.min(220,Math.round(s.procession||0))+'/220 · camina o busca una escultura',dance:'Da una vuelta a la escultura',race:phase===0?'Acércate: una carrera':phase===1?'Prepárate · la meta está detrás':'¡Ya! · '+(s.raceTime||0).toFixed(1)+' s',breath:'Entra · espera · sal del círculo',twin:'Camina con tu copia · recoge sus fragmentos',farewell:'Camina · escucha la despedida'};c.fillText(s.done?(s.kind==='race'&&s.rank?(s.rank==='first'?'Ganaste la carrera · ':'Tu rival llegó primero · '):'')+(s.paid?(s.reward?'Encuentro guardado · +3 chispas':'Encuentro completado'):'Guardado pendiente'):hints[s.kind],r.W/2,Math.min(r.H-135,r.H/2+130));}
 c.restore();
}

// One nearby invitation; no interaction, text, rewards or new procedural sites.
// reach grows to 600 u for a while after a solved encounter, so the next one is easy to chain.
export function drawMischiefClue(r,sites,reduced=false,reach=320){
 const site=sites.filter(o=>!r.S.mischief?.done?.[o.id]).map(o=>({o,d:Math.hypot(o.x-r.S.wx,o.y-r.S.wy)})).filter(q=>q.d>=95&&q.d<reach).sort((a,b)=>a.d-b.d)[0];if(!site)return;
 const {o,d}=site,c=r.cx;let x=o.x+r.W/2-r.camX,y=o.y+r.H/2-r.camY;
 // Beyond the screen (only during a streak), the clue waits at the edge in its direction.
 if(x<12||y<12||x>r.W-12||y>r.H-12){if(reach<=320)return;x=Math.max(18,Math.min(r.W-18,x));y=Math.max(90,Math.min(r.H-150,y));}
 const t=reduced?0:performance.now()/1000;c.save();c.globalAlpha=.55*(1-(d-95)/(reach-95));c.fillStyle=c.strokeStyle='#e9ca7d';c.lineWidth=1;
 for(let i=0;i<3;i++){const a=i*TAU/3+t*.35,rad=9+(reduced?0:Math.sin(t*1.5)*2);c.fillRect(x+Math.cos(a)*rad-1,y+Math.sin(a)*rad-1,3,3);}c.restore();
}
