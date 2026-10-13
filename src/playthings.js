import {contactEntry} from './contact.js';
import {influenceProfile,CHANNEL_NAMES} from './influence.js';
import {WORLD_VISUAL,elementInk,elementAlpha} from './visual.js';
import {chooseRecipeElement} from './catalog.js';
// Nuevos elementos con generación separada del paisaje existente.
export const TOY_NAMES={spark:'Luz fugitiva',spring:'Brote saltarín',kite:'Cometa flotante',rotor:'Prisma giratorio',resonator:'Aro resonante'};
const POOLS={llanura:['spark','spring','resonator'],bosque:['spring','kite','spark'],lago:['kite','resonator','spark'],ruinas:['rotor','resonator','spring'],jardin:['spring','rotor','spark'],dunas:['kite','rotor','spark'],cristales:['rotor','spark','resonator'],faros:['resonator','kite','spark'],tormenta:['spark','rotor','kite'],cueva:['resonator','spring','rotor'],vacio:['spark','resonator']};
export function createPlaythings(cx,cy,size,density,biome,seedOf,rng,config=null) {
  const random=rng(seedOf(`playthings:v1:${cx},${cy}`)),pool=POOLS[biome];
  const recipe=config?.recipe,catalog=config?.catalog;
  const count=recipe?Math.max(0,Math.min(recipe.budgets.objects,Math.round(18*density*recipe.objectDensity))):Math.max(2,Math.min(40,Math.round((biome==='vacio'?4:18)*density)));
  return Array.from({length:count},(_,i)=>{
    const x=cx*size+random()*size,y=cy*size+random()*size;
    const definition=recipe&&catalog?chooseRecipeElement(recipe,catalog,'toy',random):null;
    return {id:`${cx},${cy}:${i}`,kind:definition?.id.slice(4)||pool[Math.floor(random()*pool.length)],...(definition?{name:definition.name,motion:definition.motion,material:definition.materials.includes(recipe.material)?recipe.material:definition.materials[0]}:{}),x,y,hx:x,hy:y,size:5+random()*5,phase:random()*Math.PI*2,rotation:0,lit:0,jump:0,vx:0,vy:0,cd:0};
  });
}
export function reactPlaything(o,x,y) {
  const dx=o.x-x,dy=o.y-y,d=Math.hypot(dx,dy)||1;
  const p=o.personality||{mass:1,speed:1,spin:8};
  o.lit=1;
  if(o.kind==='spark'||o.kind==='kite'){o.vx=dx/d*170*p.speed/p.mass+(d===1?80*p.speed/p.mass:0);o.vy=dy/d*170*p.speed/p.mass;o.jump=1;}
  else if(o.kind==='spring'){o.jump=1;o.vx=dx/d*60/p.mass;o.vy=dy/d*60/p.mass;}
  else if(o.kind==='rotor')o.spin=p.spin;
  else if(o.motion==='flight'){o.vx=dx/d*150*p.speed/p.mass;o.vy=dy/d*150*p.speed/p.mass;}else o.ring=1;
}
export function stepPlaything(o,dt) {
  const p=o.personality||{recovery:1,home:.7,drag:1,speed:1};
  o.lit=Math.max(0,o.lit-dt*p.recovery);o.jump=Math.max(0,o.jump-dt*.7*p.recovery);o.ring=Math.max(0,(o.ring||0)-dt*.8);
  o.rotation+=(.15*p.speed+(o.spin||0))*dt;o.spin=(o.spin||0)*Math.exp(-dt*2*p.drag);
  if(o.kind!=='rotor'&&o.kind!=='resonator'){
    o.vx+= (o.hx-o.x)*dt*p.home;o.vy+=(o.hy-o.y)*dt*p.home;
    o.vx*=Math.exp(-dt*1.5*p.drag);o.vy*=Math.exp(-dt*1.5*p.drag);o.x+=o.vx*dt;o.y+=o.vy*dt;
  }
}
export function initialize(runtime) {
  function drawPlaythings(chunk,t,dt,ox,oy,radius,near) {
    const ctx=runtime.cx,now=performance.now();
    for(const o of chunk.playthings||[]) {
      stepPlaything(o,dt);
      const distance=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),wave=runtime.waves.length&&runtime.hitW(o.x,o.y);
      const contact=distance<Math.min(runtime.pxSize(),22)/2+o.size+6,entered=contactEntry(o,contact,!runtime.scanning&&!document.hidden&&!document.querySelector('.modal:not([hidden])'));
      if(now>o.cd&&(entered||wave)) {
        o.cd=now+(o.personality?.cooldown||850);reactPlaything(o,runtime.S.wx,runtime.S.wy);runtime.MU.act+=.15;runtime.touched();
        if(wave)runtime.wsoon(wave,o.snd);else runtime.beatSoon(o.snd);
        runtime.burst(o.x,o.y,5,true);
      }
      if(o.kind==='resonator'||o.kind==='rotor'){
        const active=runtime.S.sound&&runtime.ac?.state==='running'&&!runtime.scanning&&!document.hidden&&!document.querySelector('.modal:not([hidden])');
        const tending=active&&distance<48&&runtime.MU.speed<.08;
        if(active)o.growth=Math.max(0,Math.min(1,(o.growth||0)+dt*(tending?1/6:-1/12)));
        if(tending){const region=runtime.regionOfPos(o.hx,o.hy),p=influenceProfile(region,'toy:'+o.kind,o,runtime.seedOf,runtime.rng);runtime.driveInfluence?.(region,p.channel,o.growth,p.variant);o.influenceName=CHANNEL_NAMES[p.channel];if(o.growth>.95)runtime.unlock('cultivarMusica');}
      }
      if(distance<radius)near.push(o);
      if(distance>radius*1.3&&!o.lit)continue;
      const x=o.x+ox,y=o.y+oy-Math.sin(o.jump*Math.PI)*(o.personality?.jump||22);
      ctx.globalAlpha=elementAlpha(distance,radius,o.lit);
      ctx.strokeStyle=elementInk(o.material,runtime.regionOfPos(o.hx,o.hy).hue,o.lit>0);ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=WORLD_VISUAL.line;
      ctx.save();ctx.translate(x,y);ctx.scale(1+(o.growth||0)*.4,1+(o.growth||0)*.4);
      if(o.kind==='spark'){ctx.rotate(o.rotation);ctx.fillRect(-2,-2,4,4);ctx.strokeRect(-o.size,-o.size,o.size*2,o.size*2);}
      else if(o.kind==='spring'){ctx.beginPath();ctx.arc(0,0,o.size,Math.PI,0);ctx.stroke();ctx.fillRect(-1,0,2,7);}
      else if(o.kind==='kite'){ctx.rotate(Math.sin(t/(o.personality?.period||1100)+o.phase)*.3);ctx.beginPath();ctx.moveTo(0,-o.size);ctx.lineTo(o.size,0);ctx.lineTo(0,o.size);ctx.lineTo(-o.size,0);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(0,o.size);ctx.lineTo(Math.sin(t/300+o.phase)*8,o.size+15);ctx.stroke();}
      else if(o.kind==='rotor'||o.motion==='spin'){ctx.rotate(o.rotation);ctx.strokeRect(-o.size,-o.size,o.size*2,o.size*2);ctx.fillRect(-1,-1,2,2);}
      else {ctx.beginPath();ctx.arc(0,0,o.size+3,0,Math.PI*2);ctx.stroke();if(o.ring>0){ctx.beginPath();ctx.arc(0,0,o.size+3+(1-o.ring)*35,0,Math.PI*2);ctx.stroke();}}
      if(o.growth>.04){ctx.globalAlpha=.5;ctx.beginPath();ctx.arc(0,0,o.size+10,-Math.PI/2,-Math.PI/2+o.growth*Math.PI*2);ctx.stroke();if(distance<48){ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(o.influenceName||'',0,o.size+24);}}
      if(!TOY_NAMES[o.kind]){ctx.beginPath();ctx.moveTo(0,-o.size);ctx.lineTo(o.size,0);ctx.lineTo(0,o.size);ctx.lineTo(-o.size,0);ctx.closePath();ctx.stroke();}
      ctx.restore();
    }
  }
  Object.defineProperties(runtime,{drawPlaythings:{get:()=>drawPlaythings}});
}
