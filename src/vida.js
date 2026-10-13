// Fase 5 · Vida e intercambio musical (runtime): bandadas que llaman y responden, luciérnagas que se
// sincronizan y flora que crece contigo. Gestos: tocar un ave (llamada), quedarte quieto (confianza),
// entrar corriendo (dispersión), tocar una mata (riego). Presupuesto ambiental compartido con instalaciones.
import {claimInstallationBar} from './installations.js';
import {WORLD_VISUAL,elementInk} from './visual.js';
import {SPECIES,createFlock,stepFlock,flockCall,answerCall,callDegree,callEvery,createPlants,plantGrowth,plantStage,growPlant,PLANT_ARP,SEASON_GROWTH,normalizeVida} from './vida-music.js';
const TAU=Math.PI*2;

export function initialize(runtime){
 const S=()=>runtime.S,$=runtime.$,cache=new Map();let previousState=S(),tap=null,last={x:S().wx,y:S().wy},still=0,speed=0,clock=0;
 S().vida=normalizeVida(S().vida);
 const surface=()=>runtime.inWorld()&&(S().layer||'superficie')==='superficie';
 const available=()=>surface()&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])');
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
 const nearbyFlocks=(radius=500)=>around().map(e=>e.flock).filter(f=>f&&dist(f)<radius);
 const nearbyPlants=(radius=400)=>around().flatMap(e=>e.plants).filter(p=>dist(p)<radius);
 const growth=p=>plantGrowth(S().vida.plants[p.id],Date.now());
 function see(kind){if(S().vida.seen[kind])return;S().vida.seen[kind]=true;
  if(kind==='plant')runtime.say(runtime.VOZ.vida_plant,'Flora que crece');else runtime.say(runtime.VOZ['vida_'+kind]||runtime.VOZ.vida_flock,SPECIES[kind].name);
  if(kind==='lira')runtime.unlock('aveLira');runtime.save();}
 const played=[];
 function voice(kind,index,degree,time,volume,region,source,origin='ambient'){played.push(`vida:${kind}:${index}`);if(played.length>64)played.shift();runtime.playVoice(`vida:${kind}:${index}`,degree,time,region,false,volume,source,origin);}
 const flashAt=(time,fn)=>setTimeout(fn,Math.max(0,(time-(runtime.ac?.currentTime||0))*1000));
 function sing(f,notes,time,origin='ambient'){for(const n of notes){const at=time+n.step*runtime.SIX;voice(f.species,Math.min(9,n.member),n.degree,at,n.volume,f.region,f,origin);const m=f.members[n.member];if(m)flashAt(at,()=>{m.flash=1;});}}
 // ---------- gestos ----------
 const world=e=>({x:S().wx+e.clientX-runtime.W/2,y:S().wy+e.clientY-runtime.H/2});
 function down(e){
  if(tap)return true;if(!e.isPrimary||e.target!==$('w')||!available())return false;const p=world(e);
  for(const f of nearbyFlocks(400)){const i=f.members.findIndex(m=>Math.hypot(m.x-p.x,m.y-p.y)<20);if(i<0)continue;
   // Llamada: tu nota (más arriba = más aguda) suena ahora y la bandada la aprende para devolvértela.
   const degree=callDegree(p.y-f.y),step=runtime.MU.step%16;runtime.audio();see(f.species);
   runtime.beatSoon(t=>{voice(f.species,i,degree,t,.12,f.region,f,'player');f.members[i].flash=1;},null,'player');
   f.learned.push({step,degree});if(f.learned.length>6)f.learned.shift();f.answerBar=(runtime.MU.step>>4)+2;
   runtime.driveInfluence?.(f.region,SPECIES[f.species].channel,.35,degree);runtime.creativeAction?.(SPECIES[f.species].channel,'touch');
   tap={pointer:e.pointerId};runtime.ptr=null;runtime.tapStart=null;e.preventDefault();return true;}
  for(const pl of nearbyPlants(300)){const h=10+growth(pl)*14;if(Math.hypot(pl.x-p.x,pl.y-h/2-p.y)>Math.max(24,h/2+10))continue;
   // Riego: la mata suena su arpegio y crece un poco.
   runtime.audio();see('plant');const now=Date.now();S().vida.plants[pl.id]=growPlant(S().vida.plants[pl.id],now,.35);const stage=plantStage(growth(pl));
   runtime.beatSoon(t=>{PLANT_ARP[stage].forEach((d,j)=>voice('plant',j,d,t+j*runtime.SIX,.09,pl.region,pl,'player'));pl.lit=1;},null,'player');
   runtime.driveInfluence?.(pl.region,'space',.3,stage);runtime.creativeAction?.('space','cultivate');if(stage>=4)runtime.unlock('flor1');checkGarden();runtime.save();
   tap={pointer:e.pointerId};runtime.ptr=null;runtime.tapStart=null;e.preventDefault();return true;}
  return false;
 }
 const move=e=>tap?.pointer===e.pointerId?(e.preventDefault(),true):false;
 const up=e=>{if(tap?.pointer!==e.pointerId)return false;tap=null;return true;};
 function checkGarden(){const grown=Object.entries(S().vida.plants).filter(([,e])=>plantStage(plantGrowth(e,Date.now()))>=3).length;if(grown>=3)runtime.unlock('jardinVivo');}
 // ---------- conducta (cada cuadro) ----------
 function tick(dt){
  if(previousState!==S()){cache.clear();tap=null;previousState=S();S().vida=normalizeVida(S().vida);}
  clock+=dt;const moved=Math.hypot(S().wx-last.x,S().wy-last.y);last={x:S().wx,y:S().wy};
  if(moved>400){still=0;speed=0;}else{speed=speed*.8+(moved/Math.max(dt,1e-3))*.2;still=speed<12?still+dt:0;}   // un salto (teletransporte) no cuenta como correr
  if(!surface())return;
  const player={x:S().wx,y:S().wy,speed,still};
  for(const f of nearbyFlocks(900)){
   if(dist(f)<260)see(f.species);
   for(const ev of stepFlock(f,dt,clock,player)){
    if(ev==='scatter'&&audible()){runtime.beatSoon(t=>sing(f,[0,1,2].map(i=>({step:i,degree:4-i*2,volume:.06,member:i%f.members.length})),t),null,'ambient');}
    if(ev==='gather'){runtime.unlock('bandadaAmiga');if(!S().help.vidaConfianza){S().help.vidaConfianza=true;runtime.toast('<em>Bandada</em> · confían en ti: se acercan y cantan más');}}
    if(ev==='sync')runtime.unlock('luciernagasSync');
   }
  }
  // Flora: crece mientras estás cerca y quieto (o tocando), al ritmo de la estación.
  const rate=SEASON_GROWTH[season()]||1;
  for(const pl of nearbyPlants(170)){if(still<1)continue;see('plant');const before=plantStage(growth(pl)),now=Date.now();S().vida.plants[pl.id]=growPlant(S().vida.plants[pl.id],now,dt/25*rate);
   const after=plantStage(growth(pl));if(after>before){pl.lit=1;if(after>=4)runtime.unlock('flor1');checkGarden();runtime.save();}}
 }
 // ---------- reloj musical ----------
 function step(s,bar,time){
  if(!audible())return;
  for(const f of nearbyFlocks(480)){
   if(s===0&&f.answerBar>=0&&bar>=f.answerBar){if(!f.learned.length){f.answerBar=-1;continue;}sing(f,answerCall(f,f.learned),time);f.learned=[];f.answerBar=-1;runtime.unlock('bandada1');continue;}
   const every=callEvery(season(),f.trust);
   if(s===0&&f.scatter<.2&&bar%every===f.offset%every&&f.answerBar<0&&claimInstallationBar(runtime,bar)){sing(f,flockCall(f,bar),time);return;}
  }
  for(const pl of nearbyPlants(260)){const stage=plantStage(growth(pl));
   if(s===0&&growth(pl)>=1&&bar%4===pl.offset&&claimInstallationBar(runtime,bar)){PLANT_ARP[stage].forEach((d,j)=>voice('plant',j,d,time+j*runtime.SIX*2,.06,pl.region,pl));flashAt(time,()=>{pl.lit=1;});return;}}
 }
 function sources(){return [...nearbyFlocks(260).map(f=>({object:f,kind:`vida:${f.species}:0`,name:SPECIES[f.species].name,distance:dist(f)})),...nearbyPlants(200).map(p=>({object:p,kind:'vida:plant:0',name:'Flora que crece',distance:dist(p)}))];}
 // ---------- dibujo ----------
 function draw(t,dt,ox,oy,radius){
  tick(dt);if(!surface())return;const ctx=runtime.cx;
  for(const pl of nearbyPlants(radius+120)){
   const g=growth(pl),stage=plantStage(g),x=pl.x+ox,y=pl.y+oy,h=10+g*14,sway=Math.sin(t/900+pl.offset)*3+pl.lean*10;pl.lit=Math.max(0,pl.lit-dt*1.5);
   ctx.save();ctx.translate(x,y);ctx.lineWidth=WORLD_VISUAL.line;ctx.strokeStyle=elementInk('wood',pl.hue,pl.lit>.4);ctx.globalAlpha=.55+pl.lit*.4;
   ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(sway*.5,-h*.5,sway,-h);ctx.stroke();
   for(let i=0;i<Math.max(1,stage+1);i++){const ly=-h*(.25+i*.18),side=i%2?1:-1;ctx.beginPath();ctx.moveTo(sway*(.25+i*.18),ly);ctx.quadraticCurveTo(sway*.3+side*8,ly-6,sway*.3+side*(10+pl.form*2),ly-1);ctx.stroke();}
   if(stage>=4){ctx.fillStyle=`hsl(${pl.hue},70%,62%)`;ctx.globalAlpha=.7+pl.lit*.3;for(let k=0;k<5;k++){const a=k/5*TAU+t/2400;ctx.beginPath();ctx.arc(sway+Math.cos(a)*5,-h+Math.sin(a)*5,2.4,0,TAU);ctx.fill();}}
   else{ctx.fillStyle=elementInk('wood',pl.hue,true);ctx.globalAlpha=.6;ctx.beginPath();ctx.arc(sway,-h,1.8+stage*.6,0,TAU);ctx.fill();}
   if(dist(pl)<120){ctx.globalAlpha=.75;ctx.fillStyle=WORLD_VISUAL.gold;ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText(stage>=4?'Florecida · tócala':'Quédate cerca: crece · tócala',0,18);}
   ctx.restore();
  }
  for(const f of nearbyFlocks(radius+200)){
   const spec=SPECIES[f.species],ink=elementInk(f.species==='lira'?'metal':'glass',f.hue,false);
   ctx.save();ctx.lineWidth=WORLD_VISUAL.line;
   for(const m of f.members){const x=m.x+ox,y=m.y+oy,a=Math.atan2(m.vy,m.vx)||0;
    if(f.species==='luciernaga'){ctx.globalAlpha=.25+m.flash*.7;ctx.fillStyle=m.flash>.3?WORLD_VISUAL.gold:ink;ctx.beginPath();ctx.arc(x,y,1.6+m.flash*2.4,0,TAU);ctx.fill();if(m.flash>.3){ctx.globalAlpha=m.flash*.18;ctx.beginPath();ctx.arc(x,y,9,0,TAU);ctx.fill();}continue;}
    const s=f.species==='grulla'?9:f.species==='lira'?8:5,flap=Math.sin(t/(f.species==='grulla'?260:110)+m.phase)*.5;
    ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=.6+m.flash*.4;ctx.strokeStyle=m.flash>.4?WORLD_VISUAL.gold:ink;
    ctx.beginPath();ctx.moveTo(-s,-s*(.6+flap));ctx.lineTo(0,0);ctx.lineTo(-s,s*(.6+flap));ctx.stroke();
    if(f.species==='grulla'){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(s*.9,0);ctx.stroke();}
    if(f.species==='lira'){ctx.strokeStyle=WORLD_VISUAL.gold;ctx.beginPath();ctx.moveTo(-s*.4,0);ctx.bezierCurveTo(-s*2,-s*1.4,-s*2.6,s*1.4,-s*3.4,0);ctx.stroke();}
    ctx.restore();}
   if(dist(f)<200){ctx.globalAlpha=.75;ctx.fillStyle=WORLD_VISUAL.gold;ctx.font='10px monospace';ctx.textAlign='center';
    const label=f.trust>=.6?`${spec.name} · confían en ti`:f.species==='luciernaga'?`Quieto: se sincronizan · ${Math.round(f.sync*100)} %`:'Toca un ave: te contesta · quieto, se acercan';ctx.fillText(label,Math.max(120,Math.min(runtime.W-120,f.x+ox)),f.y+oy+64,runtime.W-24);}
   ctx.restore();
  }
 }
 Object.defineProperties(runtime,{vidaPointerDown:{get:()=>down},vidaPointerMove:{get:()=>move},vidaPointerUp:{get:()=>up},drawVida:{get:()=>draw},vidaStep:{get:()=>step},vidaSources:{get:()=>sources},
  nearbyFlocks:{get:()=>nearbyFlocks},nearbyPlants:{get:()=>nearbyPlants},vidaPlayed:{get:()=>played},vidaPlayer:{get:()=>({speed,still})}});
}
