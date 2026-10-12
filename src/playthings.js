// Nuevos elementos con generación separada del paisaje existente.
export const TOY_NAMES={spark:'Luz fugitiva',spring:'Brote saltarín',kite:'Cometa flotante',rotor:'Prisma giratorio',resonator:'Aro resonante'};
const POOLS={llanura:['spark','spring','resonator'],bosque:['spring','kite','spark'],lago:['kite','resonator','spark'],ruinas:['rotor','resonator','spring'],jardin:['spring','rotor','spark'],dunas:['kite','rotor','spark'],cristales:['rotor','spark','resonator'],faros:['resonator','kite','spark'],tormenta:['spark','rotor','kite'],cueva:['resonator','spring','rotor'],vacio:['spark','resonator']};
export function createPlaythings(cx,cy,size,density,biome,seedOf,rng) {
  const random=rng(seedOf(`playthings:v1:${cx},${cy}`)),pool=POOLS[biome];
  const count=Math.max(2,Math.min(40,Math.round((biome==='vacio'?4:18)*density)));
  return Array.from({length:count},(_,i)=>{
    const x=cx*size+random()*size,y=cy*size+random()*size;
    return {id:`${cx},${cy}:${i}`,kind:pool[Math.floor(random()*pool.length)],x,y,hx:x,hy:y,size:5+random()*5,phase:random()*Math.PI*2,rotation:0,lit:0,jump:0,vx:0,vy:0,cd:0};
  });
}
export function reactPlaything(o,x,y) {
  const dx=o.x-x,dy=o.y-y,d=Math.hypot(dx,dy)||1;
  o.lit=1;
  if(o.kind==='spark'||o.kind==='kite'){o.vx=dx/d*170+(d===1?80:0);o.vy=dy/d*170;o.jump=1;}
  else if(o.kind==='spring'){o.jump=1;o.vx=dx/d*60;o.vy=dy/d*60;}
  else if(o.kind==='rotor')o.spin=8;
  else o.ring=1;
}
export function stepPlaything(o,dt) {
  o.lit=Math.max(0,o.lit-dt);o.jump=Math.max(0,o.jump-dt*.7);o.ring=Math.max(0,(o.ring||0)-dt*.8);
  o.rotation+=(.15+(o.spin||0))*dt;o.spin=(o.spin||0)*Math.exp(-dt*2);
  if(o.kind!=='rotor'&&o.kind!=='resonator'){
    o.vx+= (o.hx-o.x)*dt*.7;o.vy+=(o.hy-o.y)*dt*.7;
    o.vx*=Math.exp(-dt*1.5);o.vy*=Math.exp(-dt*1.5);o.x+=o.vx*dt;o.y+=o.vy*dt;
  }
}
export function initialize(runtime) {
  function drawPlaythings(chunk,t,dt,ox,oy,radius,near) {
    const ctx=runtime.cx,now=performance.now();
    for(const o of chunk.playthings||[]) {
      stepPlaything(o,dt);
      const distance=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),wave=runtime.waves.length&&runtime.hitW(o.x,o.y);
      if(now>o.cd&&(distance<Math.min(runtime.pxSize(),22)/2+o.size+6||wave)) {
        o.cd=now+850;reactPlaything(o,runtime.S.wx,runtime.S.wy);runtime.MU.act+=.15;runtime.touched();
        if(wave)runtime.wsoon(wave,o.snd);else runtime.beatSoon(o.snd);
        runtime.burst(o.x,o.y,5,true);
      }
      if(distance<radius)near.push(o);
      if(distance>radius*1.3&&!o.lit)continue;
      const x=o.x+ox,y=o.y+oy-Math.sin(o.jump*Math.PI)*22;
      ctx.globalAlpha=Math.min(1,Math.max(0,1-distance/(radius*1.3))*.8+o.lit*.7);
      ctx.strokeStyle=o.lit>0?runtime.GOLD:chunk.pal.acc;ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=1.2;
      ctx.save();ctx.translate(x,y);
      if(o.kind==='spark'){ctx.rotate(o.rotation);ctx.fillRect(-2,-2,4,4);ctx.strokeRect(-o.size,-o.size,o.size*2,o.size*2);}
      else if(o.kind==='spring'){ctx.beginPath();ctx.arc(0,0,o.size,Math.PI,0);ctx.stroke();ctx.fillRect(-1,0,2,7);}
      else if(o.kind==='kite'){ctx.rotate(Math.sin(t/1100+o.phase)*.3);ctx.beginPath();ctx.moveTo(0,-o.size);ctx.lineTo(o.size,0);ctx.lineTo(0,o.size);ctx.lineTo(-o.size,0);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(0,o.size);ctx.lineTo(Math.sin(t/300+o.phase)*8,o.size+15);ctx.stroke();}
      else if(o.kind==='rotor'){ctx.rotate(o.rotation);ctx.strokeRect(-o.size,-o.size,o.size*2,o.size*2);ctx.fillRect(-1,-1,2,2);}
      else {ctx.beginPath();ctx.arc(0,0,o.size+3,0,Math.PI*2);ctx.stroke();if(o.ring>0){ctx.beginPath();ctx.arc(0,0,o.size+3+(1-o.ring)*35,0,Math.PI*2);ctx.stroke();}}
      ctx.restore();
    }
  }
  Object.defineProperties(runtime,{drawPlaythings:{get:()=>drawPlaythings}});
}
