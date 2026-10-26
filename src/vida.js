import {cueDelay} from './journey-pulse.js';
import {openSurface} from './frame-state.js';
// Fase 5 · Vida e intercambio musical (runtime). El cubo es quien toca:
// - Pasar el cubo por un ave = tu llamada (más arriba en la bandada, más aguda). En dos compases te la devuelven.
// - Quieto cerca: confían y se acercan. Si después te mueves, te siguen en formación y repiten tu llamada
//   mientras viajas (un eco que vuela contigo). Correr muy rápido los dispersa.
// - Grullas: graves y lentas; cada nota sacude el suelo con ondas. Ave lira: copia lo último que tocaste.
// - Luciérnagas: quieto cerca se sincronizan. Flora: crece si te quedas; el cubo la riega al tocarla.
import {claimInstallationBar} from './installations.js';
import {WORLD_VISUAL,elementInk} from './visual.js';
import {SPECIES,createFlock,stepFlock,flockCall,answerCall,callDegree,callEvery,createPlants,plantGrowth,plantStage,growPlant,PLANT_ARP,SEASON_GROWTH,normalizeVida} from './vida-music.js';
const TAU=Math.PI*2,FOLLOW_SECONDS=45;

export function initialize(runtime){
 const S=()=>runtime.S,$=runtime.$,cache=new Map();let previousState=S(),tap=null,clock=0;
 const traveling=new Set();
 const normalizeGifts=()=>{S().formationGifts=Object.fromEntries(Object.entries(S().formationGifts||{}).filter(([id,v])=>/^flock:-?\d+,-?\d+$/.test(id)&&v===true));};
 normalizeGifts();
 const heard=[];   // últimas notas que causó el jugador (para el ave lira)
 S().vida=normalizeVida(S().vida);
 const surface=()=>runtime.inWorld()&&(S().layer||'superficie')==='superficie';
 const available=()=>surface()&&!document.hidden&&!runtime.scanning&&!openSurface('.modal:not([hidden])');
 const audible=()=>available()&&S().sound&&runtime.ac?.state==='running'&&runtime.currentPocket?.()?.kind!=='quiet';
 const season=()=>runtime.MU.season?.id||'';
 function region(x,y){
  const size=runtime.REG*runtime.WCH,key=`${x},${y}`;let entry=cache.get(key);
  if(!entry){const d=runtime.regionOfPos((x+.5)*size,(y+.5)*size),biome=runtime.BIOMES[d.z]?.id;entry={flock:createFlock(d,size,biome,runtime.seedOf,runtime.rng),plants:createPlants(d,size,biome,runtime.seedOf,runtime.rng)};
   cache.set(key,entry);while(cache.size>48)cache.delete(cache.keys().next().value);}
  return entry;
 }
 function around(){if(!surface())return [];const size=runtime.REG*runtime.WCH,rx=Math.floor(S().wx/size),ry=Math.floor(S().wy/size),out=[];for(let x=rx-1;x<=rx+1;x++)for(let y=ry-1;y<=ry+1;y++)out.push(region(x,y));return out;}
 const dist=o=>Math.hypot(o.x-S().wx,o.y-S().wy);
 const nearbyFlocks=(radius=500)=>[...new Set([...around().map(e=>e.flock),...traveling])].filter(f=>f&&dist(f)<radius);
 const nearbyPlants=(radius=400)=>around().flatMap(e=>e.plants).filter(p=>dist(p)<radius);
 const growth=p=>plantGrowth(S().vida.plants[p.id],Date.now());
 function see(kind){runtime.recordElement?.('life:'+kind,runtime.regionOfPos(S().wx,S().wy));if(S().vida.seen[kind])return;S().vida.seen[kind]=true;
  if(kind==='plant')runtime.say(runtime.VOZ.vida_plant,'Flora que crece');else runtime.say(runtime.VOZ['vida_'+kind]||runtime.VOZ.vida_flock,SPECIES[kind].name);
  if(kind==='lira')runtime.unlock('aveLira');runtime.save();}
 const played=[];
 function voice(kind,index,degree,time,volume,region,source,origin='ambient',full=false){played.push(`vida:${kind}:${index}`);if(played.length>64)played.shift();runtime.playVoice(`vida:${kind}:${index}`,degree,time,region,full,volume,source,origin);}
 const at=(time,fn)=>setTimeout(fn,cueDelay(runtime.ac,time));
 const fx=(f,m,kind)=>{m.flash=1;m.burst=1;(f.notes||=[]).push({x:m.x,y:m.y,a:1,kind});if(f.notes.length>24)f.notes.shift();if(f.species==='grulla')(f.ripples||=[]).push({x:m.x,y:m.y+18,r:6,a:1});};
 function sing(f,notes,time,origin='ambient',toCube=false){const local=runtime.regionOfPos(f.x,f.y);for(const n of notes){const t=time+n.step*runtime.SIX;voice(f.species,Math.min(9,n.member),n.degree,t,n.volume*(f.species==='grulla'?1.4:1),local,f,origin,f.species==='grulla');const m=f.members[n.member];if(m)at(t,()=>{fx(f,m,toCube?'answer':'call');if(toCube)f.toCube=1;});}}
 // ---------- tocar (cubo; el dedo solo en modo de prueba) ----------
 function touchBird(f,i){
  const m=f.members[i],now=performance.now();if(now-(m.touched||0)<380)return;m.touched=now;
  const degree=callDegree(m.y-f.y),step=runtime.MU.step%16;runtime.audio();see(f.species);
  runtime.beatSoon(t=>{voice(f.species,i,degree,t,f.species==='grulla'?.22:.16,f.region,f,'player',f.species==='grulla');at(t,()=>fx(f,m,'touch'));},null,'player');
  f.learned.push({step,degree});if(f.learned.length>6)f.learned.shift();f.answerBar=(runtime.MU.step>>4)+2;f.waiting=1;
  runtime.colorPulse?.(f.hue,.35);runtime.driveInfluence?.(f.region,SPECIES[f.species].channel,.45,degree);runtime.creativeAction?.(SPECIES[f.species].channel,'touch');
 }
 function waterPlant(pl){
  const now=Date.now();if(now-(pl.watered||0)<1500)return;pl.watered=now;runtime.audio();see('plant');S().vida.plants[pl.id]=growPlant(S().vida.plants[pl.id],now,.35);const stage=plantStage(growth(pl));
  runtime.beatSoon(t=>{PLANT_ARP[stage].forEach((d,j)=>voice('plant',j,d,t+j*runtime.SIX,.1,pl.region,pl,'player'));pl.lit=1;},null,'player');
  runtime.driveInfluence?.(pl.region,'space',.3,stage);runtime.creativeAction?.('space','cultivate');if(stage>=4)runtime.unlock('flor1');checkGarden();runtime.save();
 }
 const world=e=>({x:S().wx+e.clientX-runtime.W/2,y:S().wy+e.clientY-runtime.H/2});
 function down(e){
  if(tap)return true;if(!e.isPrimary||e.target!==$('w')||!available())return false;const p=world(e);
  for(const f of nearbyFlocks(400)){const i=f.members.findIndex(m=>Math.hypot(m.x-p.x,m.y-p.y)<20);if(i<0)continue;touchBird(f,i);tap={pointer:e.pointerId};runtime.ptr=null;runtime.tapStart=null;e.preventDefault();return true;}
  for(const pl of nearbyPlants(300)){const h=10+growth(pl)*14;if(Math.hypot(pl.x-p.x,pl.y-h/2-p.y)>Math.max(24,h/2+10))continue;waterPlant(pl);tap={pointer:e.pointerId};runtime.ptr=null;runtime.tapStart=null;e.preventDefault();return true;}
  return false;
 }
 const move=e=>tap?.pointer===e.pointerId?(e.preventDefault(),true):false;
 const up=e=>{if(tap?.pointer!==e.pointerId)return false;tap=null;return true;};
 function checkGarden(){const grown=Object.entries(S().vida.plants).filter(([,e])=>plantStage(plantGrowth(e,Date.now()))>=3).length;if(grown>=3)runtime.unlock('jardinVivo');}
 // Lo que el jugador hace sonar en cualquier parte: el ave lira lo copia.
 function hear(kind,index,time){if(String(kind).startsWith('vida:lira'))return;heard.push({index,time});while(heard.length>8)heard.shift();}
 // ---------- conducta (cada cuadro) ----------
 function tick(dt){
  if(previousState!==S()){cache.clear();traveling.clear();heard.length=0;played.length=0;tap=null;previousState=S();S().vida=normalizeVida(S().vida);normalizeGifts();}
  if(!available())return;clock+=dt;for(const f of traveling)if(!(f.follow>0))traveling.delete(f);
  const b=runtime.body||{speed:0,still:0},player={x:S().wx,y:S().wy,speed:b.jump?0:b.speed,still:b.still};
  for(const f of nearbyFlocks(900)){
   if(dist(f)<260)see(f.species);
   // Formación: si confían y te mueves, te siguen; se refresca mientras vayan contigo.
   if(f.trust>=.6&&player.speed>20&&dist(f)<200){if(!(f.follow>0)&&!S().help.vidaFormacion){S().help.vidaFormacion=true;runtime.toast('<em>Enjambre</em> · te siguen en formación y repiten tu llamada');}f.follow=FOLLOW_SECONDS;traveling.add(f);while(traveling.size>2)traveling.delete(traveling.values().next().value);}
   if(f.follow>0){f.follow-=dt;f.followTime=(f.followTime||0)+dt;if(f.followTime>30)runtime.unlock('formacion');}else f.followTime=0;
   if(f.species==='golondrina'){
    f.formation=(f.follow>0&&f.trust>=.6&&player.speed>20&&dist(f)<180)?(f.formation||0)+dt:0;
    if(f.formation>=120&&!S().formationGifts[f.id]){S().formationGifts[f.id]=true;runtime.spawnBox?.(S().wx+65,S().wy-40,'brujula');runtime.unlock('formacionDosMinutos');runtime.save();}
    f.hintBox=f.trust>=.6?runtime.boxesNear?.(650).sort((a,b)=>dist(a)-dist(b))[0]:null;
   }
   for(const ev of stepFlock(f,dt,clock,player)){
    if(ev==='scatter'&&audible()){runtime.beatSoon(t=>sing(f,[0,1,2].map(i=>({step:i,degree:4-i*2,volume:.07,member:i%f.members.length})),t),null,'ambient');}
    if(ev==='gather'){runtime.unlock('bandadaAmiga');if(!S().help.vidaConfianza){S().help.vidaConfianza=true;runtime.toast('<em>Enjambre</em> · confían en ti: se acercan y cantan más');}}
    if(ev==='sync')runtime.unlock('luciernagasSync');
   }
   runtime.petBond?.(f,dt);
   // Cuerpo: el cubo pasa por un ave.
   if(!runtime.fingerTouch||!tap)f.members.forEach((m,i)=>{if(Math.hypot(m.x-S().wx,m.y-S().wy)<15)touchBird(f,i);});
  }
  const rate=SEASON_GROWTH[season()]||1;
  for(const pl of nearbyPlants(170)){
   const h=10+growth(pl)*14;if(Math.hypot(pl.x-S().wx,pl.y-h/2-S().wy)<Math.max(16,h/2+6))waterPlant(pl);   // el cubo toca la mata
   if(b.still<1)continue;see('plant');const before=plantStage(growth(pl)),now=Date.now();S().vida.plants[pl.id]=growPlant(S().vida.plants[pl.id],now,dt/25*rate);
   const after=plantStage(growth(pl));if(after>before){pl.lit=1;if(after>=4)runtime.unlock('flor1');checkGarden();runtime.save();}}
 }
 // ---------- reloj musical ----------
 function step(s,bar,time){
  if(!audible())return;
  for(const f of nearbyFlocks(480)){
   if(s===0&&f.answerBar>=0&&bar>=f.answerBar){
    if(!f.learned.length){f.answerBar=-1;continue;}
    // El ave lira copia lo último que hiciste sonar (con adornos); las demás, tu llamada con su voz.
    let notes=answerCall(f,f.learned);
    if(f.species==='lira'&&heard.length){notes=heard.slice(-6).flatMap((h,i)=>[{step:i*2,degree:h.index,volume:.12,member:0},...(i%2?[{step:i*2+1,degree:h.index+1,volume:.06,member:0}]:[])]).filter(n=>n.step<16);f.copying=1;runtime.unlock('liraCopia');}
    sing(f,notes,time,'ambient',true);f.phrase=f.learned.slice();f.learned=[];f.answerBar=-1;f.waiting=0;runtime.unlock('bandada1');continue;}
   // A trusted crossing answers the other flock on alternating bars, within the shared budget.
   const partner=nearbyFlocks(400).find(other=>other!==f&&other.trust>=.6&&f.trust>=.6&&other.phrase?.length&&Math.hypot(other.x-f.x,other.y-f.y)<180);
   if(partner&&s===0&&bar%4===2&&claimInstallationBar(runtime,bar)){sing(f,answerCall(f,partner.phrase).slice(0,3).map(n=>({...n,volume:.045})),time);return;}
   // En formación repiten tu llamada cada dos compases mientras viajan contigo.
   if(s===0&&f.follow>0&&f.phrase?.length&&bar%2===0&&claimInstallationBar(runtime,bar)){sing(f,answerCall(f,f.phrase).map(n=>({...n,volume:.07})),time);return;}
   const every=callEvery(season(),f.trust);
   if(s===0&&f.scatter<.2&&bar%every===f.offset%every&&f.answerBar<0&&claimInstallationBar(runtime,bar)){sing(f,flockCall(f,bar),time);return;}
  }
  for(const pl of nearbyPlants(260)){const stage=plantStage(growth(pl));
   if(s===0&&growth(pl)>=1&&bar%4===pl.offset&&claimInstallationBar(runtime,bar)){PLANT_ARP[stage].forEach((d,j)=>voice('plant',j,d,time+j*runtime.SIX*2,.06,pl.region,pl));at(time,()=>{pl.lit=1;});return;}}
 }
 function sources(){return [...nearbyFlocks(260).map(f=>({object:f,kind:`vida:${f.species}:0`,name:SPECIES[f.species].name,distance:dist(f)})),...nearbyPlants(200).map(p=>({object:p,kind:'vida:plant:0',name:'Flora que crece',distance:dist(p)}))];}
 // ---------- dibujo ----------
 function label(ctx,text,x,y){ctx.globalAlpha=.8;ctx.fillStyle=WORLD_VISUAL.gold;ctx.font='11px "Geist Mono", monospace';ctx.textAlign='center';ctx.fillText(text,Math.max(120,Math.min(runtime.W-120,x)),y,runtime.W-24);}
 function draw(t,dt,ox,oy,radius){
  tick(dt);if(!surface())return;const ctx=runtime.cx;
  for(const pl of nearbyPlants(radius+120)){const fade=runtime.worldOpacity?.(dist(pl),radius+120)??1;
   const g=growth(pl),stage=plantStage(g),x=pl.x+ox,y=pl.y+oy,h=10+g*14,sway=Math.sin(t/900+pl.offset)*3+pl.lean*10;pl.lit=Math.max(0,pl.lit-dt*1.5);
   ctx.save();ctx.translate(x,y);ctx.lineWidth=WORLD_VISUAL.line;ctx.strokeStyle=elementInk('wood',pl.hue,pl.lit>.4);ctx.globalAlpha=(.55+pl.lit*.4)*fade;
   // Seen from above: a spore of light that opens a ray for each stage; open, it shines with five points around it.
   const turn=sway*.02,r=3+g*7;ctx.beginPath();for(let i=0;i<Math.max(1,stage+1);i++){const a=turn+i*TAU/Math.max(3,stage+1);ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.stroke();
   if(stage>=4){ctx.fillStyle=`hsl(${pl.hue},70%,62%)`;ctx.globalAlpha=(.7+pl.lit*.3)*fade;for(let k=0;k<5;k++){const a=k/5*TAU+t/2400;ctx.beginPath();ctx.arc(Math.cos(a)*(r+4),Math.sin(a)*(r+4),2.4,0,TAU);ctx.fill();}}
   else{ctx.fillStyle=elementInk('wood',pl.hue,true);ctx.globalAlpha=(.6)*fade;ctx.beginPath();ctx.arc(0,0,1.8+stage*.6,0,TAU);ctx.fill();}
   if(dist(pl)<120)label(ctx,stage>=4?'Abierta · tócala con el cubo':'Quédate cerca: crece · tócala con el cubo',0,18);
   ctx.restore();
  }
  for(const f of nearbyFlocks(radius+200)){const fade=runtime.worldOpacity?.(dist(f),radius+200)??1;
   const spec=SPECIES[f.species],ink=elementInk(f.species==='lira'?'metal':'glass',f.hue,false),col=`hsl(${f.hue},85%,64%)`;
   ctx.save();ctx.lineWidth=WORLD_VISUAL.line;
   // Grullas: ondas en el suelo con cada nota grave.
   f.ripples=(f.ripples||[]).filter(r=>(r.a-=dt*.7)>0);for(const r of f.ripples){r.r+=dt*70;ctx.globalAlpha=(r.a*.5)*fade;ctx.strokeStyle=col;ctx.beginPath();ctx.ellipse(r.x+ox,r.y+oy,r.r,r.r*.35,0,0,TAU);ctx.stroke();}
   // Respuesta: hilos de luz desde las aves hasta el cubo.
   f.toCube=Math.max(0,(f.toCube||0)-dt*1.2);if(f.toCube>0){ctx.globalAlpha=(f.toCube*.5)*fade;ctx.strokeStyle=col;for(const m of f.members){ctx.beginPath();ctx.moveTo(m.x+ox,m.y+oy);ctx.lineTo(runtime.W/2,runtime.H/2);ctx.stroke();}
    const g=ctx.createRadialGradient(runtime.W/2,runtime.H/2,0,runtime.W/2,runtime.H/2,40);g.addColorStop(0,`hsla(${f.hue},85%,64%,${f.toCube*.6})`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.globalAlpha=(1)*fade;ctx.fillStyle=g;ctx.fillRect(runtime.W/2-40,runtime.H/2-40,80,80);}
   // Notas que suben desde el ave que canta.
   f.notes=(f.notes||[]).filter(n=>(n.a-=dt*.9)>0);for(const n of f.notes){n.y-=dt*28;ctx.globalAlpha=(n.a)*fade;ctx.fillStyle=n.kind==='touch'?elementInk('air',f.hue,true):col;const x=n.x+ox,y=n.y+oy-12;ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(x-2,y+2,2.5,1.6,-.35,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(x,y+2);ctx.lineTo(x,y-8);ctx.lineTo(x+5,y-5);ctx.stroke();}
   for(const m of f.members){const x=m.x+ox,y=m.y+oy,a=Math.atan2(m.vy,m.vx)||0;m.burst=Math.max(0,(m.burst||0)-dt*1.6);
    if(m.burst>0){ctx.globalAlpha=(m.burst*.8)*fade;ctx.strokeStyle=elementInk('air',f.hue,true);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,6+(1-m.burst)*(f.species==='grulla'?60:36),0,TAU);ctx.stroke();ctx.lineWidth=WORLD_VISUAL.line;}
    if(f.species==='luciernaga'){ctx.globalAlpha=(.25+m.flash*.7)*fade;ctx.fillStyle=m.flash>.3?elementInk('air',f.hue,true):ink;ctx.beginPath();ctx.arc(x,y,1.6+m.flash*2.4,0,TAU);ctx.fill();if(m.flash>.3){ctx.globalAlpha=(m.flash*.18)*fade;ctx.beginPath();ctx.arc(x,y,9,0,TAU);ctx.fill();}continue;}
    const s=f.species==='grulla'?14:f.species==='lira'?10:6,flap=Math.sin(t/(f.species==='grulla'?320:110)+m.phase)*.5,lit=m.flash>.4;
    ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=(.65+m.flash*.35)*fade;ctx.strokeStyle=lit?elementInk('air',f.hue,true):ink;ctx.lineWidth=f.species==='grulla'?1.8:WORLD_VISUAL.line;
    ctx.beginPath();ctx.moveTo(-s,-s*(.6+flap));ctx.lineTo(0,0);ctx.lineTo(-s,s*(.6+flap));ctx.stroke();
    if(f.species==='grulla'){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(s*1.1,-s*.15);ctx.moveTo(-s*.4,0);ctx.lineTo(-s*1.6,0);ctx.stroke();}   // cuello largo y patas atrás
    if(f.species==='lira'){ctx.strokeStyle=WORLD_VISUAL.gold;ctx.globalAlpha=(.85)*fade;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(-s*.3,0);ctx.bezierCurveTo(-s*1.6,side*s*1.8,-s*3,side*s*1.6,-s*3.4,side*s*.3);ctx.stroke();}
     ctx.globalAlpha=(.4)*fade;ctx.beginPath();ctx.moveTo(-s*.3,0);ctx.lineTo(-s*3.2,0);ctx.stroke();
     if(m.flash>.2||f.copying>0){ctx.fillStyle=elementInk('air',f.hue,true);for(let k=0;k<4;k++){ctx.globalAlpha=(.6)*fade;ctx.fillRect(-s*(1+k*.7)+Math.sin(t/90+k)*3,Math.cos(t/70+k)*s,2,2);}}}
    ctx.restore();}
   f.copying=Math.max(0,(f.copying||0)-dt*.25);f.waiting=Math.max(0,(f.waiting||0)-dt*.05);
   if(f.hintBox){const a=Math.atan2(f.hintBox.y-f.y,f.hintBox.x-f.x);ctx.save();ctx.translate(f.x+ox,f.y+oy);ctx.rotate(a);ctx.strokeStyle=runtime.GOLD;ctx.globalAlpha=(.5)*fade;ctx.beginPath();ctx.moveTo(30,-4);ctx.lineTo(38,0);ctx.lineTo(30,4);ctx.stroke();ctx.restore();}
   if(dist(f)<220){
    const text=f.copying>0?'Quásar imitador · copia lo que tocaste':f.answerBar>=0?'Te contestan en dos compases…':f.follow>0?`${spec.name} · viajan contigo${f.species==='golondrina'?' · '+Math.min(120,Math.floor(f.formation||0))+'/120 s':''}`:f.trust>=.6?`${spec.name} · confían en ti · muévete y te siguen`:f.species==='luciernaga'?`Quieto: se sincronizan · ${Math.round(f.sync*100)} %`:'Pasa el cubo por el enjambre · quieto, se acercan';
    label(ctx,text,f.x+ox,f.y+oy+64);}
   ctx.restore();
  }
 }
 runtime.ACH.push(['formacionDosMinutos','Viajar juntos','Mantén una formación de meteoros en movimiento durante dos minutos.']);
 Object.defineProperties(runtime,{vidaPointerDown:{get:()=>down},vidaPointerMove:{get:()=>move},vidaPointerUp:{get:()=>up},drawVida:{get:()=>draw},vidaStep:{get:()=>step},vidaSources:{get:()=>sources},vidaHear:{get:()=>hear},
  nearbyFlocks:{get:()=>nearbyFlocks},nearbyPlants:{get:()=>nearbyPlants},vidaPlayed:{get:()=>played},touchBird:{get:()=>touchBird},waterPlant:{get:()=>waterPlant}});
}
