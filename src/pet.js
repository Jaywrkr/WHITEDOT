import {PET_SPECIES,normalizePet,createPet,petStage,learnPet,growPet,petFormationEligible,petFromBox} from './pet-model.js';
import {musicalCharacter,hookPitch,inRegister} from './musical-character.js';
import {claimInstallationBar} from './installations.js';
import {elementInk,WORLD_VISUAL} from './visual.js';
const TAU=Math.PI*2;
export function initialize(runtime){
 const S=()=>runtime.S;let owner=S(),clock=0,lastHeard=-Infinity,lastBar=-1,reservedBar=-1,pending=null,contact=false,lastGuide=-Infinity,target=null,saveAt=0,lastPosition=null,bond=new Map();
 const state={x:S().wx+50,y:S().wy+25,ready:false,sleep:0,lit:0,trail:[],hint:null};
 S().pet=normalizePet(S().pet);
 const active=()=>runtime.inWorld()&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])');
 const audible=()=>active()&&S().sound&&runtime.ac?.state==='running'&&runtime.currentPocket?.()?.kind!=='quiet'&&!runtime.cultureListening;
 function reset(){pending=null;contact=false;lastBar=-1;reservedBar=-1;lastHeard=-Infinity;target=null;lastPosition=null;bond.clear();Object.assign(state,{ready:false,sleep:0,lit:0,trail:[],hint:null});}
 function ensure(){if(owner!==S()){owner=S();S().pet=normalizePet(S().pet);reset();}return S().pet;}
 function born(species,source,phrase=[]){
  if(ensure()||!Object.hasOwn(PET_SPECIES,species)||!active())return false;
  S().pet=createPet(species,runtime.seedOf(`pet:birth:v1:${source}`),phrase);reset();state.x=S().wx+50;state.y=S().wy+25;
  if(/^caja:/.test(source))runtime.collectRareCard?.('petbox:'+species,{id:source,x:S().wx,y:S().wy});
  runtime.recordElement?.('pet',runtime.regionOfPos(S().wx,S().wy));runtime.unlock('mascota1');runtime.toast(`<em>Alguien se queda</em> · ${PET_SPECIES[species].name}. Pasa el cubo cerca; escucha cómo aprende.`);runtime.save();return true;
 }
 function formation(f,dt){
  if(ensure()||!active()||!S().sound||runtime.ac?.state!=='running')return;
  if(petFormationEligible(f))born(f.species,f.id,(f.phrase||[]).slice(-4).map((n,i)=>({degree:((n.degree%7)+7)%7,step:i*2})));
  if(f.species==='luciernaga'){
   const close=Math.hypot(f.x-S().wx,f.y-S().wy)<180;
   const seconds=f.sync>=.9&&f.trust>=.6&&close&&runtime.body.still>1.5?(bond.get(f.id)||0)+Math.min(.1,dt):0;
   bond.set(f.id,seconds);while(bond.size>16)bond.delete(bond.keys().next().value);if(seconds>=20)born(f.species,f.id);
  }
 }
 function box(b){const species=!b.gift&&petFromBox(b.id,runtime.seedOf);if(species){runtime.collectRareCard?.('petbox:'+species,b);runtime.givePower?.('companero',species);runtime.say('~~Se queda para siempre~~ Te acompaña unos minutos. Para quedarse, viaja con su bandada.', 'Visita de '+PET_SPECIES[species].name);}}
 function hear({degree,time,source}){
  const p=ensure();if(!p||!audible()||!Number.isFinite(time)||time-lastHeard<.09||source&&Math.hypot(source.x-S().wx,source.y-S().wy)>360)return;
  lastHeard=time;learnPet(p,degree);pending={notes:[{degree:((Math.round(degree)%7)+7)%7,step:0}],tap:false};
 }
 function tick(dt){
  const p=ensure();if(!p)return;if(!active()){pending=null;contact=false;return;}
  dt=Math.max(0,Math.min(.05,dt));clock+=dt;
  const distance=Math.hypot(state.x-S().wx,state.y-S().wy),jump=distance>500;
  if(!state.ready||jump){state.x=S().wx+50;state.y=S().wy+25;state.ready=true;contact=false;target=null;}
  const moving=(S().layer||'superficie')==='superficie'?(runtime.body?.speed||0)>12:lastPosition&&Math.hypot(S().wx-lastPosition.x,S().wy-lastPosition.y)>dt*12;lastPosition={x:S().wx,y:S().wy};state.sleep=moving?0:Math.min(45,state.sleep+dt);
  if(!jump){growPet(p,dt,runtime.regionOfPos(S().wx,S().wy).key);if(clock-saveAt>15){saveAt=clock;runtime.save();}}
  if(petStage(p)>=1)runtime.unlock('mascotaCrece');
  if(clock-lastGuide>18){lastGuide=clock;target=null;
   if((S().layer||'superficie')==='superficie'&&moving){const candidates=[...(runtime.boxesNear?.(850)||[]),...(runtime.nearbyFlocks?.(850)||[]).filter(f=>f.species==='lira'),...(runtime.cultureTargets?.()||[])];target=candidates.filter(t=>{const d=Math.hypot(t.x-S().wx,t.y-S().wy);return d>120&&d<850&&!runtime.regionOfPos(t.x,t.y).sea;}).sort((a,b)=>Math.hypot(a.x-S().wx,a.y-S().wy)-Math.hypot(b.x-S().wx,b.y-S().wy))[0]||null;}
  }
  let tx=S().wx-45,ty=S().wy+24;
  if(target&&moving&&clock-lastGuide<6){const a=Math.atan2(target.y-S().wy,target.x-S().wx);tx=S().wx+Math.cos(a)*90;ty=S().wy+Math.sin(a)*90;state.hint=target;}else state.hint=null;
  const touch=Math.hypot(state.x-S().wx,state.y-S().wy)<15;
  if(touch&&!contact&&!jump&&audible())pending={notes:p.phrase.slice(0,3+petStage(p)),tap:true};contact=touch;
  state.x+=(tx-state.x)*(1-Math.exp(-dt*(state.sleep>20?1:2.3)));state.y+=(ty-state.y)*(1-Math.exp(-dt*2.3));state.lit=Math.max(0,state.lit-dt*2);
  if(petStage(p)>0&&moving){state.trail.push({x:state.x,y:state.y,a:.4});if(state.trail.length>24)state.trail.shift();}for(const t of state.trail)t.a-=dt*.6;state.trail=state.trail.filter(t=>t.a>0);
  if(!audible())pending=null;
 }
 function emit(p,n,time){
  const d=runtime.activeLayerRegion?.()||runtime.regionOfPos(S().wx,S().wy),spec=PET_SPECIES[p.species],stage=petStage(p),instrument=spec.pool[(p.seed+stage)%spec.pool.length];
  const degree=(n.degree+2)%7,level=(S().softMusic?.012:.022)*(state.sleep>20?.45:1);
  let note=57+runtime.BIOMES[d.z].tr+d.trOff+d.scale[degree];
  if(spec.role==='bass'){note=inRegister(note,36,52);runtime.bassInst(instrument,note,time,level,d);}
  else if(spec.role==='groove'){if(instrument==='wood')runtime.wood(time,level);else if(instrument==='conga')runtime.conga(time,100+degree*12,level);else runtime.rim(time,level);}
  else {note=hookPitch(instrument,note,musicalCharacter(d.genre));runtime.hookInst(instrument,note,time,level,d);}
  state.lit=1;runtime.petNoteCue?.({species:p.species,degree,note,time,role:spec.role});
 }
 function step(s,bar,time){
  const p=ensure();if(!p||!audible()||lastBar===bar)return;
  const automatic=!pending&&state.sleep>15&&bar%8===2;
  if(!pending&&!automatic)return;
  if(s===0&&claimInstallationBar(runtime,bar))reservedBar=bar;
  if(s!==2||reservedBar!==bar)return;
  const notes=(pending?.notes||p.phrase).slice(0,automatic?2+petStage(p):pending?.tap?3+petStage(p):1);
  pending=null;if(!notes.length)return;lastBar=bar;notes.forEach((n,i)=>emit(p,n,time+i*runtime.SIX*2));
 }
 function draw(t){
  const p=ensure();if(!p||!runtime.inWorld()||!state.ready)return;
  const c=runtime.cx,stage=petStage(p),col=elementInk('glass',PET_SPECIES[p.species].hue+(p.seed%45)),x=state.x+runtime.W/2-S().wx,y=state.y+runtime.H/2-S().wy,s=5+stage*1.3;
  c.save();c.strokeStyle=c.fillStyle=col;c.lineWidth=WORLD_VISUAL.line;for(const q of state.trail){c.globalAlpha=q.a;c.fillRect(q.x+runtime.W/2-S().wx,q.y+runtime.H/2-S().wy,1.5,1.5);}c.translate(x,y);c.globalAlpha=state.sleep>20?.4:.8;c.rotate(Math.sin(t/800)*.15);
  c.beginPath();if(p.species==='luciernaga'){c.ellipse(0,0,s*.55,s,0,0,TAU);c.moveTo(-s,0);c.quadraticCurveTo(0,-s*1.8,s,0);}else{const flap=state.sleep>20?.2:.5+Math.sin(t/(p.species==='grulla'?320:120))*.25;c.moveTo(-s*1.4,-s*flap);c.quadraticCurveTo(-s*.4,-s*.2,0,0);c.quadraticCurveTo(s*.4,-s*.2,s*1.4,-s*flap);if(p.species==='grulla'){c.moveTo(0,0);c.quadraticCurveTo(s,-s,s*1.3,-s*1.6);}}
  if(stage>=2){c.moveTo(-s,s*.35);c.quadraticCurveTo(0,s*1.2,s,s*.35);}if(stage>=3){c.moveTo(0,s*.4);c.bezierCurveTo(-s,s*1.8,s,s*1.8,0,s*2);}if(p.species==='luciernaga'&&stage){c.moveTo(-s*.3,-s);c.lineTo(-s*.7,-s*1.5);c.moveTo(s*.3,-s);c.lineTo(s*.7,-s*1.5);}c.stroke();for(let i=0;i<stage;i++){c.beginPath();c.arc(-s-i*3,s,1,0,TAU);c.fill();}if(state.lit){c.globalAlpha=state.lit*.35;c.beginPath();c.arc(0,0,s+state.lit*8,0,TAU);c.stroke();}c.restore();
 }
 function card(){const p=ensure();return p?`<article class="journal-card"><h3>Alguien viaja contigo</h3><p>${PET_SPECIES[p.species].name}. Aprende tus gestos, responde con ${PET_SPECIES[p.species].role==='bass'?'bajos':PET_SPECIES[p.species].role==='groove'?'ritmo':'melodía'} y cambia con los lugares compartidos. Pasa el cubo por ella para escuchar su frase; en quietud se duerme. No necesita alimento.</p></article>`:'';}
 runtime.ACH.push(['mascota1','Alguien se queda','Una pequeña criatura eligió viajar contigo.'],['mascotaCrece','Crecer juntos','Compartiste tiempo y lugares: tu compañera cambia.']);
 Object.defineProperties(runtime,{petBond:{get:()=>formation},petBox:{get:()=>box},petHear:{get:()=>hear},petTick:{get:()=>tick},petStep:{get:()=>step},drawPet:{get:()=>draw},petCard:{get:()=>card},petState:{get:()=>state}});
}
