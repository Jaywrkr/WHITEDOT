import {createReactiveEcology} from './reactive-ecology-model.js';
import {territoryInk} from './territory-transition.js';
export function initialize(runtime){
 let owner=null,model=null,scope='',pointer=null,pendingTap=null,active=false;
 const reduced=()=>!!(runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 function allowed(){return runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])');}
 function tick(dt){
  const currentScope=runtime.worldIdentity?.seed+':'+(runtime.S.layer||'superficie');
  if(owner!==runtime.S||scope!==currentScope){owner=runtime.S;scope=currentScope;model=createReactiveEcology(runtime.seedOf);pendingTap=null;}
  active=allowed();if(!active){model.tick(0,{},[],{key:''},'#fff',{paused:true});pendingTap=null;return;}
  const s=runtime.S,region=runtime.regionOfPos(s.wx,s.wy),radius=Math.min(380,runtime.worldVisibility?.radius||380),objects=[...(runtime.livingNear?.(radius)||[]),...(runtime.microNear?.(radius)||[])];
  model.tick(dt,{x:s.wx,y:s.wy},objects,region,territoryInk(region,'lead',runtime.seedOf),{reduced:reduced(),tap:pendingTap});pendingTap=null;
 }
 // Observe a real tap, leaving capture, drags and musical input to existing systems.
 const canvas=runtime.cv||document.getElementById('w');
 canvas?.addEventListener('pointerdown',e=>{if(!e.isPrimary||!allowed())return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,time:performance.now(),wx:runtime.S.wx,wy:runtime.S.wy};},{passive:true});
 addEventListener('pointerup',e=>{const p=pointer;pointer=null;if(!p||p.id!==e.pointerId||!allowed()||performance.now()-p.time>450||Math.hypot(e.clientX-p.x,e.clientY-p.y)>14||Math.hypot(runtime.S.wx-p.wx,runtime.S.wy-p.wy)>20)return;pendingTap={x:e.clientX-runtime.W/2+runtime.S.wx,y:e.clientY-runtime.H/2+runtime.S.wy};},{passive:true});
 addEventListener('pointercancel',()=>{pointer=null;pendingTap=null;},{passive:true});
 function draw(){if(!active||!model)return;const c=runtime.cx,s=runtime.S,state=model.snapshot(),still=reduced(),ox=runtime.W/2-s.wx,oy=runtime.H/2-s.wy,maxRadius=Math.min(52,Math.min(runtime.W,runtime.H)*.095);
  c.save();c.lineWidth=1;
  const line=(x,y,X,Y)=>{c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.stroke();};
  const arc=(x,y,r,a=0,b=Math.PI*2)=>{c.beginPath();c.arc(x,y,Math.max(.1,r),a,b);c.stroke();};
  for(const e of state.effects){
   const p=e.age/e.duration,envelope=Math.sin(Math.PI*p)*e.power,x=e.x+ox,y=e.y+oy;if(x< -60||x>runtime.W+60||y< -60||y>runtime.H+60)continue;
   c.strokeStyle=c.fillStyle=e.ink;c.globalAlpha=envelope*.72;
   if(still){arc(x,y,Math.min(maxRadius,e.size+9));continue;}
   const r=Math.min(maxRadius,e.size+12+envelope*14),phase=e.phase+e.age;
   if(e.type==='contorno'){for(let j=0;j<3;j++){c.beginPath();for(let k=0;k<=32;k++){const a=k*Math.PI/16,rr=(r+j*6)*(1+.1*Math.sin(a*3+phase)),px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr*.65;k?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();}}
   else if(e.type==='flor'){for(let j=0;j<6;j++){const a=j*Math.PI/3+phase*.12;c.beginPath();c.ellipse(x+Math.cos(a)*r*.45,y+Math.sin(a)*r*.45,3+envelope*4,r*.35,a-Math.PI/2,0,Math.PI*2);c.stroke();}for(let j=0;j<4;j++){const a=j*Math.PI/2+e.phase;c.fillRect(x+Math.cos(a)*r*(1+p),y+Math.sin(a)*r*(1+p),2,2);}}
   else if(e.type==='niebla'){for(let j=0;j<3;j++){c.beginPath();c.moveTo(x-r,y+(j-1)*9);c.bezierCurveTo(x-r*.2,y-r*.4,x+r*.2,y+r*.4,x+r,y+(j-1)*9);c.stroke();}}
   else if(e.type==='constelacion'){for(let j=0;j<5;j++){const a=j*Math.PI*2/5+e.phase;c.fillRect(x+Math.cos(a)*r-1,y+Math.sin(a)*r-1,3,3);if(j)line(x+Math.cos(a)*r,y+Math.sin(a)*r,x,y);}}
   else if(e.type==='elastica'){c.save();c.translate(x,y);c.rotate(Math.sin(phase)*envelope*.35);c.scale(1+envelope*.3,1-envelope*.15);arc(0,0,r);line(-r,0,r,0);c.restore();}
   else if(e.type==='color'){const tx=runtime.W/2,ty=runtime.H/2,amount=Math.min(1,p*2);arc(x+(tx-x)*amount,y+(ty-y)*amount,3+envelope*4);if(state.color){c.globalAlpha=envelope*.4;arc(tx,ty,13+envelope*6);}}
   else if(e.type==='eco'){state.trail.slice(-7).forEach((v,j)=>{c.globalAlpha=envelope*(j+1)*.06;const sz=5+j*.3;c.strokeRect(v.x+ox-sz/2,v.y+oy-sz/2,sz,sz);});}
   else if(e.type==='enjambre'){for(let j=0;j<10;j++){const a=j*Math.PI/5+phase*.7,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r*.7,dx=px-runtime.W/2,dy=py-runtime.H/2,d=Math.hypot(dx,dy)||1,push=Math.max(0,32-d)*envelope;c.fillRect(px+dx/d*push,py+dy/d*push,2,2);}}
   else if(e.type==='tejido'){for(let j=0;j<3;j++){c.beginPath();c.moveTo(x,y);c.quadraticCurveTo((x+runtime.W/2)/2+Math.sin(phase+j)*14,(y+runtime.H/2)/2+(j-1)*14,runtime.W/2,runtime.H/2);c.stroke();}}
   else if(e.type==='metamorfosis'){const sides=e.gesture==='rodear'?3:e.gesture==='esperar'?7:e.speed<28?6:4;c.beginPath();for(let j=0;j<=sides;j++){const a=j*Math.PI*2/sides+phase*.15,rr=r*(.8+Math.sin(phase+j)*envelope*.12);j?c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr):c.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.stroke();}
  }
  if(state.visits.length>1){c.strokeStyle=state.visits.at(-1).ink;c.globalAlpha=.22;for(let j=1;j<state.visits.length;j++){const a=state.visits[j-1],b=state.visits[j];if(Math.hypot(b.x-a.x,b.y-a.y)<230)line(a.x+ox,a.y+oy,b.x+ox,b.y+oy);}}
  c.restore();
 }
 function windows(){if(!active||!model||reduced())return [];return model.snapshot().effects.filter(e=>e.type==='niebla').slice(-3).map(e=>({x:e.x+runtime.W/2-runtime.S.wx,y:e.y+runtime.H/2-runtime.S.wy,radius:Math.sin(Math.PI*e.age/e.duration)*Math.min(38,runtime.W*.09)*e.power}));}
 Object.defineProperties(runtime,{reactiveTick:{get:()=>tick},drawReactiveWorld:{get:()=>draw},reactivePose:{get:()=>id=>active?model?.pose(id,reduced()):null},reactiveMistWindows:{get:()=>windows},reactiveState:{get:()=>model?.snapshot()}});
}
