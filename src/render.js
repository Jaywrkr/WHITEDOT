import {windLevel} from './territory-journey.js';
import {moveWalker,drawWalker} from './walker-forms.js';
import {contactEntry} from './contact.js';
import { movementMultiplier } from './gravity.js';

// Loop, simulación y dibujo del juego.
export function initialize(runtime) {
  /* ---------- glifos ---------- */
  function glyph(x,i,px,py,s){
    x.save();x.translate(px,py);x.strokeStyle=x.fillStyle;x.lineWidth=Math.max(1.5,s/6);x.beginPath();
    switch(i){
      case 0:x.moveTo(0,-s);x.lineTo(s*.87,s*.5);x.lineTo(-s*.87,s*.5);x.closePath();x.stroke();break;
      case 1:x.arc(0,0,s*.8,0,6.283);x.stroke();break;
      case 2:x.moveTo(-s,0);x.lineTo(s,0);x.moveTo(0,-s);x.lineTo(0,s);x.stroke();break;
      case 3:x.moveTo(0,-s);x.lineTo(s,0);x.lineTo(0,s);x.lineTo(-s,0);x.closePath();x.stroke();break;
      case 4:x.arc(0,0,s*.85,0,6.283);x.stroke();x.fillRect(-s*.2,-s*.2,s*.4,s*.4);break;
      case 5:x.strokeRect(-s*.45,-s,s*.9,s*.9);x.strokeRect(-s*.45,s*.1,s*.9,s*.9);break;
      case 6:x.moveTo(-s*.8,-s*.8);x.lineTo(s*.8,s*.8);x.moveTo(s*.8,-s*.8);x.lineTo(-s*.8,s*.8);x.stroke();break;
      case 7:for(let k=0;k<6;k++){const a=k*1.0472;x[k?"lineTo":"moveTo"](Math.cos(a)*s,Math.sin(a)*s);}x.closePath();x.stroke();break;
      case 8:x.arc(0,s*.35,s*.85,Math.PI,0);x.stroke();break;
      case 9:[-1,0,1].forEach(k=>x.fillRect(k*s*.7-s*.18,-s*.18,s*.36,s*.36));break;
      case 10:x.moveTo(-s*.6,-s);x.lineTo(-s*.6,s*.6);x.lineTo(s,s*.6);x.stroke();break;
      case 11:x.strokeRect(-s,-s,2*s,2*s);x.fillRect(-s*.35,-s*.35,s*.7,s*.7);break;
    }
    x.restore();
  }

  /* ---------- loop ---------- */
  let scheduledFrame=null;
  function frame(t){
    if(scheduledFrame!==null)cancelAnimationFrame(scheduledFrame);
    runtime.achievementsTick?.(Math.min(.1,Math.max(0,(t-(frame.l||t))/1000)));runtime.connectionTick?.();runtime.saveToolsTick?.();runtime.focusUITick?.();runtime.syncSession();runtime.glassTick?.();runtime.mirrorTick?.();
    if(!runtime.inWorld()||!runtime.S.sound)runtime.clearSoundCues();
    if(!runtime.inWorld())runtime.clearRelicProgress();
    runtime.activeFrameSeconds=Math.max(0,Math.min(1,(t-(frame.l||t))/1000));
    const dt=Math.max(0,Math.min(.05,(t-(frame.l||t))/1000));frame.l=t;runtime.worldVisualBegin?.(dt,runtime.activeFrameSeconds);runtime.celebrationTick?.(runtime.activeFrameSeconds);runtime.rareCardTick?.(runtime.activeFrameSeconds);
    const modal=runtime.noticeLane?.inspecting||[...document.querySelectorAll(".modal")].some(m=>!m.hidden&&!m.classList.contains("lite"));
    let dx=(runtime.keys.arrowright||runtime.keys.d?1:0)-(runtime.keys.arrowleft||runtime.keys.a?1:0), dy=(runtime.keys.arrowdown||runtime.keys.s?1:0)-(runtime.keys.arrowup||runtime.keys.w?1:0);
    if(runtime.ptr){const jx=runtime.ptr.ox??runtime.W/2,jy=runtime.ptr.oy??runtime.H/2,rad=runtime.ptr.ox!=null?55:80;dx=runtime.ptr.x-jx;dy=runtime.ptr.y-jy;const l=Math.hypot(dx,dy);if(l<6){dx=dy=0;}else{const k=Math.min(1,l/rad);dx=dx/l*k;dy=dy/l*k;}}
    else{const l=Math.hypot(dx,dy);if(l){dx/=l;dy/=l;}}
    const manual=Math.hypot(dx,dy)>.01,automatic=runtime.autopilotVector?.(dt,manual,modal||runtime.scanning||document.hidden||runtime.S.mode==="studio");
    if(!manual&&automatic){dx=automatic.dx;dy=automatic.dy;}
    if(modal||runtime.scanning||runtime.S.mode==="studio"){dx=dy=0;}
    const sp=Math.hypot(dx,dy);
    runtime.MU.speed+=(sp-runtime.MU.speed)*Math.min(1,dt*3);
    runtime.MU.act*=Math.pow(.5,dt/2.5);
    const target=runtime.S.mode==="studio"?runtime.clamp(.15+Object.keys(runtime.S.studio.slots).length*.035,0,.85):runtime.clamp(sp*.55+Math.min(1,runtime.MU.act)*.55,0,1);
    runtime.MU.E+=(target-runtime.MU.E)*Math.min(1,dt/(target>runtime.MU.E?2.5:6));
    runtime.MU.still=sp<.05?runtime.MU.still+dt:0;
    runtime.MU.dirY+=(dy*sp-runtime.MU.dirY)*Math.min(1,dt*1.5);
    const movementSpeed=runtime.SPEED*(runtime.inWorld()?movementMultiplier(runtime.S.wx,runtime.S.wy,runtime.REG*runtime.WCH,runtime.regionOfPos,runtime.seedOf):1);
    runtime.MU.dist+=sp*movementSpeed*dt;if(runtime.MU.dist>650)runtime.MU.pending=true;
    if(runtime.S.mode!=="studio"){
      if(dx<-.6&&Math.abs(dy)<.35)runtime.leftT+=dt;else if(dx>-.2||Math.abs(dy)>.5)runtime.leftT=0;if(runtime.leftT>=90)runtime.unlock("alreves");
      if(runtime.MU.mel<=67&&performance.now()-runtime.lastNoteMs<1500)runtime.lowT+=dt;else if(runtime.MU.mel>67)runtime.lowT=0;if(runtime.lowT>=45)runtime.unlock("bajista");
      if(runtime.inWorld()){
        if(["techno","garage","tribal","broken","half"].includes(runtime.BI().kit)&&runtime.MU.still>=60)runtime.unlock("silencio");
        if(runtime.BI().id==="tormenta"&&runtime.MU.E>.85)runtime.unlock("under");
        if(sp>.3)runtime.dodgeT+=dt;if(runtime.dodgeT>=45)runtime.unlock("esquivador");
        if(runtime.inPond)runtime.pondT+=dt;else runtime.pondT=0;if(runtime.pondT>=90)runtime.unlock("ballena");
      }
      if(runtime.S.mode==="camino"&&!runtime.isFree()&&runtime.MU.still>25&&!runtime.idleSaid&&runtime.S.help.camino){runtime.idleSaid=true;runtime.say(runtime.VOZ.idle);}
    }
    if(runtime.windG)runtime.windG.gain.setTargetAtTime(runtime.inWorld()&&(runtime.BI().id==="dunas"||(runtime.MU.dnaT&&runtime.MU.dnaT.air==="polvo"))?windLevel(runtime.MU.speed,runtime.MU.E):0,runtime.ac.currentTime,.8);
    if(runtime.windF)runtime.windF.frequency.setTargetAtTime(180+runtime.MU.speed*220,runtime.ac.currentTime,.8);

    runtime.surpriseTick?.(dt,modal);
    runtime.navigationTick?.();
    runtime.initiativeTick?.(dt,sp>.01,modal);
    runtime.influenceTick?.(dt,modal||runtime.scanning);
    runtime.creativeTick?.(dt,modal||runtime.scanning||document.hidden);
    runtime.encounterTick?.(dt,modal||runtime.scanning||document.hidden);
    runtime.ecologyTick?.(dt,modal||runtime.scanning||document.hidden);
    runtime.voiceGuideTick?.(dt,modal||runtime.scanning||document.hidden);
    runtime.performanceTick?.();runtime.firstJourneyTick?.();
    runtime.updateScanner();runtime.fxTick?.(dt);
    const b=runtime.beat();runtime.drawCubePreview?.(t,b);
    runtime.cx.fillStyle="#000";runtime.cx.fillRect(0,0,runtime.W,runtime.H);
    runtime.drawDistantColors?.();
    if(runtime.inWorld()||runtime.S.mode==="studio"){ambientStars(t,dt,b);if(runtime.inWorld())runtime.drawAtmosphere?.(t);ambient(t,dt,b);}
    const ds=runtime.S.mode==="studio"?runtime.studioStep(t,dt,b):runtime.inWorld()?(runtime.S.layer&&runtime.S.layer!=='superficie'?runtime.layerStep(t,dt,dx,dy,b,modal,runtime.SPEED):worldStep(t,dt,dx,dy,b,modal,movementSpeed)):caminoStep(t,dt,dx,dy,b);
    runtime.crystalTick?.(dt,modal);runtime.wowTick?.(dt,modal);runtime.profileTick?.(runtime.activeFrameSeconds,modal);runtime.reactiveTick?.(dt);runtime.inhabitantTick?.(dt);runtime.drawInhabitants?.();
    if(runtime.inWorld()&&runtime.S.layer&&runtime.S.layer!=='superficie'){runtime.drawLivingTerrain?.();runtime.livingTick?.(dt);runtime.drawLiving?.(t);}
    runtime.drawDuet?.();runtime.petTick?.(dt);runtime.drawPet?.(t);
    runtime.clueTick?.();runtime.clueDraw?.();runtime.encounterDraw?.();if(!runtime.encounterSources?.().length)runtime.creativeDraw?.();
    runtime.drawCrystals?.();runtime.drawWowWorld?.();runtime.drawFavoriteReturn?.();runtime.drawReactiveWorld?.();runtime.drawAtlas?.();runtime.drawRareFinding?.();runtime.drawCelebration?.();runtime.drawWorldFog?.(t);runtime.drawDistantColors?.(true);
    const ox=runtime.W/2-runtime.camX,oy=runtime.H/2-runtime.camY;
    runtime.parts=runtime.parts.filter(p=>(p.l-=dt*1.6)>0);
    for(const p of runtime.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.94;p.vy*=.94;runtime.cx.globalAlpha=p.l;runtime.cx.fillStyle=p.g?runtime.musicInk?.(p)||'#fff':runtime.S.color;runtime.cx.fillRect(p.x+ox-1,p.y+oy-1,2,2);}
    runtime.pulse=Math.max(0,runtime.pulse-dt*1.5);
    const s=ds*(1+runtime.pulse*.6+b*.08)*(runtime.inWorld()?runtime.surpriseStyle?.scale||1:1);
    runtime.drawCubeStyle?.(t,dt,b,s);runtime.drawSurprises?.(t,ox,oy);
    const playerColor=runtime.inWorld()?(runtime.cubeColor?.()||'#fff'):'#fff';
    if(runtime.pulse){runtime.cx.globalAlpha=runtime.pulse*.5;runtime.cx.strokeStyle=playerColor;runtime.cx.lineWidth=1;const rr=s*(1+(1-runtime.pulse)*4);runtime.cx.strokeRect(runtime.W/2-rr/2,runtime.H/2-rr/2,rr,rr);}
    // En tiempo: respuesta musical local y contador.
    if(runtime.grooveFx>0){runtime.grooveFx=Math.max(0,runtime.grooveFx-dt*2.2);runtime.cx.globalAlpha=runtime.grooveFx;runtime.cx.strokeStyle=runtime.musicInk?.(null,'perc')||'#fff';runtime.cx.lineWidth=1.5;const rr=s+(1-runtime.grooveFx)*40;runtime.cx.beginPath();runtime.cx.arc(runtime.W/2,runtime.H/2,rr,0,6.283);runtime.cx.stroke();
      if(runtime.MU.groove>=2){runtime.cx.fillStyle=runtime.musicInk?.(null,'perc')||'#fff';runtime.cx.font='600 12px "Geist Mono", monospace';runtime.cx.textAlign="center";runtime.cx.fillText("EN TIEMPO ×"+runtime.MU.groove,runtime.W/2,runtime.H/2-s-18-(1-runtime.grooveFx)*10);runtime.cx.textAlign="left";}}
    runtime.cx.save();runtime.cubeVisualTransform?.(runtime.cx,runtime.W/2,runtime.H/2);runtime.cx.globalAlpha=1;runtime.cx.fillStyle=playerColor;
    const ritual=runtime.inWorld()&&(runtime.quietState?.stage>=6||runtime.hasPower?.('cometa'));
    if(runtime.inWorld()&&runtime.drawSurpriseBody?.(runtime.cx,runtime.W/2,runtime.H/2,s,t)){}else if(ritual){runtime.cx.translate(runtime.W/2,runtime.H/2);runtime.cx.rotate(Math.sin(t/600)*.12);runtime.cx.fillRect(-s/2,-s/2,s,s);}else runtime.cx.fillRect(Math.round(runtime.W/2-s/2),Math.round(runtime.H/2-s/2),Math.round(s),Math.round(s));runtime.cx.restore();
    if(!runtime.inWorld()||runtime.surpriseStyle?.shape==='cube')runtime.drawCubeSurface?.(t,b,s);
    // El pixel siempre se distingue: halo suave y anillo fino en el Mundo.
    if(runtime.inWorld()){const c=runtime.cx,hx=runtime.W/2,hy=runtime.H/2,g=c.createRadialGradient(hx,hy,0,hx,hy,s*2.6);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(hx-s*2.6,hy-s*2.6,s*5.2,s*5.2);
      c.globalAlpha=.55;c.strokeStyle='#fff';c.lineWidth=1;c.strokeRect(Math.round(hx-s/2)-3.5,Math.round(hy-s/2)-3.5,Math.round(s)+7,Math.round(s)+7);c.globalAlpha=1;}
    // Joystick visible mientras arrastras.
    if(runtime.ptr?.ox!=null){const c=runtime.cx;c.globalAlpha=.28;c.strokeStyle='#fff';c.lineWidth=1.5;c.beginPath();c.arc(runtime.ptr.ox,runtime.ptr.oy,55,0,6.283);c.stroke();c.globalAlpha=.5;c.fillStyle='#fff';c.beginPath();c.arc(runtime.ptr.x,runtime.ptr.y,9,0,6.283);c.fill();c.globalAlpha=1;}
    if(runtime.flash>0){runtime.flash=Math.max(0,runtime.flash-dt*2.5);runtime.cx.globalAlpha=runtime.flash*.6;runtime.cx.strokeStyle=runtime.GOLD;runtime.cx.lineWidth=1.2;runtime.cx.beginPath();runtime.cx.arc(runtime.W/2,runtime.H/2,24+(1-runtime.flash)*42,0,Math.PI*2);runtime.cx.stroke();}
    if(runtime.enterFx>0){runtime.enterFx=Math.max(0,runtime.enterFx-dt*.6);const still=runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches,k=still?.6:1-runtime.enterFx;runtime.cx.globalAlpha=runtime.enterFx*.35;runtime.cx.strokeStyle=runtime.musicInk?.(null,'acorde')||'#fff';runtime.cx.lineWidth=1.2;
      for(let i=0;i<3;i++){const rr=Math.max(0,k-i*.12)*Math.min(54,runtime.W*.14,runtime.H*.14);runtime.cx.beginPath();runtime.cx.arc(runtime.W/2,runtime.H/2,rr,0,6.283);runtime.cx.stroke();}
      // Keep the entry response local; the world background stays black.
    }
    runtime.cx.globalAlpha=1;
    runtime.drawSparkHUD?.();
    scheduledFrame=requestAnimationFrame(frame);
  }

  function ambient(t,dt,b){
    const dn=runtime.inWorld()?runtime.MU.dnaT:null,air=dn?dn.air:"claro";
    if(runtime.inWorld()){drawAir(dn,1-runtime.MU.nbW,t,0);if(runtime.MU.nb)drawAir(runtime.MU.nb,runtime.MU.nbW,t,37);}
  }
  function drawAir(dn,wt,t,off){const air=dn?dn.air:"claro",pal=dn?dn.pal:null;
    if(air!=="claro"&&wt>.02){const n=Math.round((air==="niebla"?18:70)*wt);
      for(let i=0;i<n;i++){const s=runtime.STARS[(i+off)%runtime.STARS.length],z=.25+(i%5)*.12;let x,y,col,al,w=1,h=1;
        if(air==="polvo"){x=((s.x*runtime.W*3+t*(.05+runtime.MU.speed*.12)*(1+z)-runtime.camX*z)%runtime.W+runtime.W)%runtime.W;y=((s.y*runtime.H*2+Math.sin(t/900+i)*8-runtime.camY*z)%runtime.H+runtime.H)%runtime.H;col=pal.sand;al=.22;w=2;}
        else if(air==="esporas"){x=((s.x*runtime.W*2+Math.sin(t/2500+i)*20-runtime.camX*z)%runtime.W+runtime.W)%runtime.W;y=((s.y*runtime.H*2-t*.012*(1+z)-runtime.camY*z)%runtime.H+runtime.H)%runtime.H;col=pal.acc;al=.12+.2*Math.max(0,Math.sin(t/600+i));w=h=2;}
        else if(air==="ceniza"){x=((s.x*runtime.W*2+t*.006-runtime.camX*z)%runtime.W+runtime.W)%runtime.W;y=((s.y*runtime.H*2+t*.02*(1+z)-runtime.camY*z)%runtime.H+runtime.H)%runtime.H;col="#9a9a9f";al=.22;w=h=2;}
        else{x=((s.x*runtime.W*2+t*.004-runtime.camX*.3)%runtime.W+runtime.W)%runtime.W;y=((s.y*runtime.H*2-runtime.camY*.3)%runtime.H+runtime.H)%runtime.H;const g=runtime.cx.createRadialGradient(x,y,0,x,y,160);g.addColorStop(0,'rgba('+[runtime.worldVisibility?.red??150,runtime.worldVisibility?.green??185,runtime.worldVisibility?.blue??225].map(Math.round).join(',')+',.045)');g.addColorStop(1,"rgba(200,200,210,0)");runtime.cx.globalAlpha=1;runtime.cx.fillStyle=g;runtime.cx.fillRect(x-160,y-160,320,320);continue;}
        runtime.cx.globalAlpha=Math.min(1,al);runtime.cx.fillStyle=col;runtime.cx.fillRect(x,y,w,h);}}
  }
  function ambientStars(t,dt,b){const dn=runtime.inWorld()?runtime.MU.dnaT:null,air=dn?dn.air:"claro";
    const id=runtime.BIOMES[runtime.S.mode==="studio"?(runtime.S.studio.biome||0):Math.max(0,runtime.curZone)].id,starA=(id==="vacio"?2.5:id==="cueva"?.2:1)*(air==="niebla"?.3:1);
    runtime.cx.fillStyle="#fff";
    for(const s of runtime.STARS){const x=((s.x*runtime.W*2-runtime.camX*.03)%runtime.W+runtime.W)%runtime.W,y=((s.y*runtime.H*2-runtime.camY*.03)%runtime.H+runtime.H)%runtime.H;runtime.cx.globalAlpha=Math.min(1,s.a*starA*(.7+.3*Math.sin(t/900+s.x*50)));runtime.cx.fillRect(x,y,s.s,s.s);}
    const wind=id==="dunas"?40+runtime.MU.speed*120:id==="tormenta"?25:5;
    for(const d of runtime.DUST){d.x+=dt*wind;d.y+=Math.sin(t/2000+d.ph)*dt*4;const x=((d.x-runtime.camX*d.z)%runtime.W+runtime.W)%runtime.W,y=((d.y-runtime.camY*d.z)%runtime.H+runtime.H)%runtime.H;runtime.cx.globalAlpha=Math.min(1,(id==="dunas"?.18:.07)+.08*d.z+b*.05);runtime.cx.fillRect(x,y,id==="dunas"?2:1,1);}
  }

  function caminoStep(t,dt,dx,dy,b){
    if(dx||dy){runtime.S.px+=dx*runtime.SPEED*dt;runtime.S.py+=dy*runtime.SPEED*dt;runtime.recordWalk?.(Math.hypot(dx,dy)*runtime.SPEED*dt);}
    if(!runtime.lastTrail||Math.hypot(runtime.S.px-runtime.lastTrail[0],runtime.S.py-runtime.lastTrail[1])>22){runtime.lastTrail=[Math.round(runtime.S.px),Math.round(runtime.S.py)];runtime.S.trail.push(runtime.lastTrail);if(runtime.S.trail.length>4000)runtime.S.trail=runtime.S.trail.filter((_,i)=>i%2===0);}
    runtime.camX=runtime.S.px;runtime.camY=runtime.S.py;
    const free=runtime.isFree(), R=runtime.lightR()*(1+b*.04), sz=runtime.pxSize(), ox=runtime.W/2-runtime.S.px, oy=runtime.H/2-runtime.S.py;
    const g=runtime.cx.createRadialGradient(runtime.W/2,runtime.H/2,0,runtime.W/2,runtime.H/2,R);
    g.addColorStop(0,"rgba(255,255,255,"+(.06+b*.04+runtime.MU.E*.03)+")");g.addColorStop(1,"rgba(255,255,255,0)");
    runtime.cx.fillStyle=g;runtime.cx.fillRect(runtime.W/2-R,runtime.H/2-R,R*2,R*2);
    runtime.updWaves(dt,ox,oy);
    runtime.cx.fillStyle=runtime.S.color;
    for(let i=Math.max(0,runtime.S.trail.length-600);i<runtime.S.trail.length;i++){const[p,q]=runtime.S.trail[i];const d=Math.hypot(p-runtime.S.px,q-runtime.S.py);if(d>R*1.6)continue;runtime.cx.globalAlpha=.22*(1-d/(R*1.6));runtime.cx.fillRect(p+ox-1,q+oy-1,2,2);}
    runtime.cx.fillStyle="#fff";
    for(let x=runtime.S.px-R;x<runtime.S.px+R;x+=9){const y=runtime.pathY(x),d=Math.hypot(x-runtime.S.px,y-runtime.S.py);if(d>R)continue;runtime.cx.globalAlpha=Math.pow(1-d/R,1.6)*.45;runtime.cx.fillRect(x+ox-1,y+oy-1,2,2);}
    return sz;
  }

  function worldStep(t,dt,dx,dy,b,paused=false,movementSpeed=runtime.SPEED){
    const sz=runtime.pxSize(),ds=Math.min(sz,22);
    if(runtime.MU.anomaly==='invertida'){dx=-dx;dy=-dy;}   // rareza: arriba es abajo
    if(dx||dy){runtime.S.wx+=dx*movementSpeed*dt;runtime.S.wy+=dy*movementSpeed*dt;runtime.recordWalk?.(Math.hypot(dx,dy)*movementSpeed*dt);}
    runtime.camX=runtime.S.wx;runtime.camY=runtime.S.wy;
    if(!paused&&!runtime.scanning)runtime.sessionTime(dt);
    const z=runtime.biomeOfPos(runtime.S.wx,runtime.S.wy),rg=runtime.regionOfPos(runtime.S.wx,runtime.S.wy);
    if(rg.key!==runtime.curRegion){runtime.curRegion=rg.key;runtime.enterRegion(rg,z);}
    {// Vitalidad local: el vacío adelgaza la música; llegar a un oasis después de un desierto es un drop.
     runtime.riverStep?.(dt);runtime.aliveStep?.(dt);
     const MU=runtime.MU,v=runtime.vitalityAt(runtime.S.wx,runtime.S.wy);MU.vit=MU.vit==null?v:MU.vit+(v-MU.vit)*Math.min(1,dt*.8);
     if(MU.vit<.22)MU.lowT=(MU.lowT||0)+dt;
     if(MU.vit>.6&&(MU.lowT||0)>12){MU.lowT=0;MU.E=Math.max(MU.E,.75);runtime.flash=Math.max(runtime.flash,.5);
      if(runtime.S.sound)runtime.soon(q=>runtime.dropHit(q,runtime.chordTones()));
      runtime.showPhrase("Oasis");if(!runtime.S.help.oasis){runtime.S.help.oasis=true;runtime.say(runtime.VOZ.oasis);}runtime.S.oasisN=(runtime.S.oasisN||0)+1;}
     else if(MU.vit>.45&&(MU.lowT||0)>0)MU.lowT=Math.max(0,MU.lowT-dt*.5);}
    {const RS=runtime.REG*runtime.WCH,lx=((runtime.S.wx%RS)+RS)%RS,ly=((runtime.S.wy%RS)+RS)%RS,ed=[lx,RS-lx,ly,RS-ly],i=ed.indexOf(Math.min(...ed)),de=ed[i],BAND=900;
     if(de<BAND){runtime.MU.nb=runtime.regionOfPos(runtime.S.wx+[-1,1,0,0][i]*(de+10),runtime.S.wy+[0,0,-1,1][i]*(de+10));runtime.MU.nbW=.5*(1-de/BAND);}else{runtime.MU.nb=null;runtime.MU.nbW=0;}}
    if(runtime.MU.confNb&&runtime.MU.confNb!==runtime.MU.dnaT){runtime.MU.nb=runtime.MU.confNb;runtime.MU.nbW=Math.max(runtime.MU.nbW,.45);}   // confluencia de ríos
    const evt=runtime.eventOf(rg),ev=(runtime.MU.storm||0)>.15?'lluvia':evt?evt[0]:null;   // dentro de una tormenta llueven notasif(runtime.RP&&runtime.RP.type==="quieto"&&runtime.MU.still>0)runtime.retoSet("quieto",runtime.MU.still);
    const id=runtime.BIOMES[z].id;
    if(ev==="aurora"){runtime.cx.lineWidth=6;for(let i=0;i<3;i++){runtime.cx.strokeStyle=`hsl(${(rg.hue+i*35)%360},80%,65%)`;runtime.cx.globalAlpha=.16+b*.06;runtime.cx.beginPath();for(let x=0;x<=runtime.W;x+=10){const y=70+i*20+Math.sin(x/130+t/1500+i)*16;x?runtime.cx.lineTo(x,y):runtime.cx.moveTo(x,y);}runtime.cx.stroke();}}
    const soundR=(ev==="eclipse"?.6:1)*runtime.clamp(runtime.lightR()*1.1,170,360)*(1+Math.min(runtime.shownStreak(),30)/30*.7)*(id==="cueva"?.6:1)*(1+b*.05),R=(runtime.worldVisibility?.lightRadius??soundR/(1+b*.05))*(1+b*.05),ox=runtime.W/2-runtime.S.wx,oy=runtime.H/2-runtime.S.wy,ms=performance.now();
    const g=runtime.cx.createRadialGradient(runtime.W/2,runtime.H/2,0,runtime.W/2,runtime.H/2,R);
    g.addColorStop(0,"rgba(255,255,255,"+(.05+b*.04+runtime.MU.E*.03)+")");g.addColorStop(1,"rgba(255,255,255,0)");
    runtime.cx.fillStyle=g;runtime.cx.fillRect(runtime.W/2-R,runtime.H/2-R,R*2,R*2);
    if(ev==="eclipse"){runtime.cx.globalAlpha=.25+b*.35;runtime.cx.strokeStyle=runtime.GOLD;runtime.cx.lineWidth=1.5;runtime.cx.beginPath();runtime.cx.arc(runtime.W/2,runtime.H/2,R*.95,0,6.283);runtime.cx.stroke();}
    if(ev==="lluvia"){if(Math.random()<dt*7*(1+3*(runtime.MU.storm||0)))runtime.rain.push({x:runtime.S.wx+(Math.random()-.5)*R*2.4,y:runtime.S.wy-R*1.3,vy:110+Math.random()*60});
      for(let i=runtime.rain.length-1;i>=0;i--){const q=runtime.rain[i];q.y+=q.vy*dt;const d=Math.hypot(q.x-runtime.S.wx,q.y-runtime.S.wy);if(d<runtime.pxSize()/2+14){runtime.rain.splice(i,1);runtime.playerNote(.12);runtime.burst(q.x,q.y,5,true);continue;}
        if(q.y>runtime.S.wy+R*1.4){runtime.rain.splice(i,1);continue;}runtime.cx.globalAlpha=Math.min(1,Math.max(.15,1-d/(R*1.3)))*(runtime.worldOpacity?.(d,R*1.4)??1);runtime.cx.fillStyle=runtime.musicInk?.(q,'perc')||'#fff';runtime.cx.fillRect(q.x+ox-1,q.y+oy-6,2,7);}}else if(runtime.rain.length)runtime.rain=[];
    runtime.drawVJWorld?.(t,dt,ox,oy,paused);
    runtime.drawDepthGround?.(t);runtime.drawWorldFamilyGround?.(t);runtime.drawGround(ox,oy,R,t);
    runtime.drawRivers?.(t,ox,oy);runtime.drawAlive?.(t,dt,ox,oy,'ground');
    runtime.updWaves(dt,ox,oy);
    const span=Math.max(R*1.8+60,(runtime.worldVisibility?.radius||0)+100);
    const a0=Math.floor((runtime.S.wx-span)/runtime.WCH),a1=Math.floor((runtime.S.wx+span)/runtime.WCH),b0=Math.floor((runtime.S.wy-span)/runtime.WCH),b1=Math.floor((runtime.S.wy+span)/runtime.WCH);
    let pondNow=false;const flowersNear=[],nearO=[],singers=[];
    // suelo
    for(let a=a0;a<=a1;a++)for(let bb=b0;bb<=b1;bb++){
      const raw=runtime.wchunk(a,bb),c=runtime.sceneChunk?.(raw)||raw;
      runtime.drawEcology?.(c,t,ox,oy,R);
      runtime.drawPocketHints(c,ox,oy,R);
      runtime.drawPlaythings(c,t,dt,ox,oy,R,nearO);
      if(c.dunes){runtime.cx.fillStyle="#fff";const y0=Math.floor((runtime.S.wy-R)/38)*38;
        for(let y=y0;y<runtime.S.wy+R;y+=38){if(y<bb*runtime.WCH||y>=(bb+1)*runtime.WCH)continue;for(let x=Math.max(a*runtime.WCH,runtime.S.wx-R);x<Math.min((a+1)*runtime.WCH,runtime.S.wx+R);x+=6){const yy=y+Math.sin(x/130+y*.07+t/4000)*12,d=Math.hypot(x-runtime.S.wx,yy-runtime.S.wy);if(d>R)continue;runtime.cx.globalAlpha=Math.pow(1-d/R,1.4)*.35*decorativeField(x,yy,runtime.seedOf);runtime.cx.fillRect(x+ox,yy+oy,2,1);}}}
      for(const p of c.ponds){const d=Math.hypot(p.x-runtime.S.wx,p.y-runtime.S.wy);
        if(d<p.r)pondNow=true;
        if(d-p.r<R){if(d<R+p.r*.3)runtime.seen("estanque");const fall=Math.max(0,1-Math.max(0,d-p.r*.6)/R);
          runtime.cx.globalAlpha=.05*fall;runtime.cx.fillStyle="#fff";runtime.cx.beginPath();runtime.cx.arc(p.x+ox,p.y+oy,p.r,0,6.283);runtime.cx.fill();
          runtime.cx.strokeStyle="#fff";runtime.cx.lineWidth=1;const ph=(t/2600)%1;
          for(let i=0;i<3;i++){const q=(ph+i/3)%1;runtime.cx.globalAlpha=Math.min(1,(.25+b*.3)*(1-q)*fall);runtime.cx.beginPath();runtime.cx.arc(p.x+ox,p.y+oy,p.r*q,0,6.283);runtime.cx.stroke();}}}
      for(const l of c.lotus){l.vx=(l.vx||0)+Math.sin(t/3000+l.deg)*dt*6;l.vy=(l.vy||0)+Math.cos(t/3500+l.deg)*dt*6;runtime.physics(l,dt,c.lotus,l.pond);const d=Math.hypot(l.x-runtime.S.wx,l.y-runtime.S.wy);if(d<soundR)nearO.push(l);
        const lw=runtime.waves.length&&runtime.hitW(l.x,l.y);if(lw){l.lit=1;runtime.wsoon(lw,l.snd);}
        if(contactEntry(l,d<ds/2+14,!paused&&!runtime.scanning)&&ms>l.cd){l.cd=ms+1500;runtime.MU.act+=.3;runtime.touched();if(!l.given){l.given=1;runtime.gain("loto");}runtime.pushO(l,runtime.S.wx,runtime.S.wy,140);runtime.beatSoon(q=>runtime.playVoice('loto',l.deg,q,runtime.regionOfPos(l.x,l.y),true,1,l),()=>{l.lit=1;runtime.burst(l.x,l.y,8,true);});}
        l.lit=Math.max(0,l.lit-dt*.4);if(d>R*1.3)continue;const al=Math.max(Math.max(0,1-d/(R*1.3))*.6,l.lit);
        runtime.cx.globalAlpha=Math.min(1,al)*(runtime.worldOpacity?.(d,R*1.3)??1);runtime.cx.strokeStyle=l.lit>.1?runtime.musicInk?.(l)||'#fff':(c.pal?c.pal.main:"#fff");runtime.cx.lineWidth=1.5;runtime.cx.beginPath();runtime.cx.arc(l.x+ox,l.y+oy,7+l.lit*6+b*2,0,6.283);runtime.cx.stroke();if(l.lit<.1)runtime.touchRing(l.x+ox,l.y+oy,d,R,b);}
      for(const o of c.plants){const d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),w=runtime.waves.length&&runtime.hitW(o.x,o.y);
        const plantEntered=contactEntry(o,d<14,!paused&&!runtime.scanning);
        if(ms>o.cd&&(plantEntered||w)){o.cd=ms+(o.personality?.cooldown||1600);o.lit=1;o.sw=1;if(o.pt.t!=="hierba"&&runtime.rnd()<(w?.5:.4))runtime.beatSoon(q=>runtime.plantSound(o.pt,q,runtime.regionOfPos(o.x,o.y),o.personality,o));}
        o.lit=Math.max(0,o.lit-dt/4);o.sw=Math.max(0,o.sw-dt*1.5*(o.personality?.recovery||1));if(d>R+20&&o.lit<=0)continue;
        runtime.cx.globalAlpha=Math.min(1,Math.max(Math.pow(Math.max(0,1-d/R),.7)*.95,o.lit*.9))*(runtime.worldOpacity?.(d,R+20)??1);runtime.drawPlant(o,o.x+ox,o.y+oy,t,b);}
      for(const gr of c.grass){
        const d=Math.hypot(gr.x-runtime.S.wx,gr.y-runtime.S.wy);
        const treeEntered=contactEntry(gr,d<(gr.tall?34:26),!paused&&!runtime.scanning);
        const treeWave=gr.tall&&runtime.waves.length&&runtime.hitW(gr.x,gr.y);
        if(treeWave&&ms>(gr.cd||0)){gr.cd=ms+(gr.personality?.cooldown||1500);gr.lit=1;runtime.wsoon(treeWave,q=>runtime.playVoice('arbol',gr.personality?.degree||0,q,runtime.regionOfPos(gr.x,gr.y),false,.5*(gr.personality?.volume||1),gr));}
        if(d<(gr.tall?34:26)){if(gr.tall&&!gr.given&&runtime.rnd()<.04){gr.given=1;runtime.gain("arbol");}if(gr.tall&&treeEntered&&ms>(gr.cd||0)){gr.cd=ms+(gr.personality?.cooldown||1500);runtime.beatSoon(q=>runtime.playVoice('arbol',gr.personality?.degree||0,q,runtime.regionOfPos(gr.x,gr.y),false,.5*(gr.personality?.volume||1),gr));};gr.lit=1;}else if(gr.lit>0)gr.lit=Math.max(0,gr.lit-dt*(gr.personality?.recovery||1)/9);
        if(d>R+30&&gr.lit<=0)continue;
        if(gr.tall&&d<R)runtime.seen("arbol");
        const al=Math.max(Math.max(0,1-d/R)*(gr.tall?.5:.4),gr.lit*.6);if(al<.02)continue;
        const sw=Math.sin(t/(gr.personality?.period||(gr.tall?1300:800))+gr.ph)*gr.h*(gr.personality?.sway||(gr.tall?.15:.3))+(gr.lit>0?b*2:0);
        runtime.cx.globalAlpha=Math.min(1,al)*(runtime.worldOpacity?.(d,R+30)??1);runtime.cx.fillStyle=gr.lit>.6?(gr.tall?runtime.musicInk?.(gr)||'#fff':"#fff"):c.pal?c.pal.soft:"#c9c9cf";
        runtime.cx.fillRect(gr.x+ox,gr.y+oy-gr.h,1,gr.h);runtime.cx.fillRect(gr.x+ox+sw,gr.y+oy-gr.h-2,1,2);
        if(gr.tall&&gr.lit>.2){runtime.cx.globalAlpha=gr.lit*.5*(runtime.worldOpacity?.(d,R+30)??1);runtime.cx.fillRect(gr.x+ox+sw-1,gr.y+oy-gr.h-3,3,3);}
      }
      // pilares: tambores
      for(const p of c.pillars){const d=Math.hypot(p.x-runtime.S.wx,p.y-runtime.S.wy);
        const pw=runtime.waves.length&&runtime.hitW(p.x,p.y);if(pw){p.hit=1;runtime.wsoon(pw,p.snd);}
        if(contactEntry(p,d<p.w/2+ds/2+6,!paused&&!runtime.scanning)&&ms>p.cd){p.cd=ms+(p.personality?.cooldown||600);runtime.MU.act+=.35;runtime.touched();p.hits=(p.hits||0)+1;if(p.hits>=25)runtime.unlock("insistente");if(!p.given){p.given=1;runtime.gain("pilar");}runtime.chain(c.pillars,p,0,new Set(),5);runtime.S.drums++;if(runtime.S.drums>=8)runtime.unlock("tambor");runtime.burst(p.x,p.y-p.h/2,6,false);}
        if(d<soundR)nearO.push(p);p.hit=Math.max(0,p.hit-dt*3);if(d>R+80&&!p.hit)continue;const al=Math.max(0,1-d/(R+80));
        runtime.cx.globalAlpha=Math.min(1,al*.5+p.hit*.6)*(runtime.worldOpacity?.(d,R+80)??1);runtime.cx.strokeStyle=p.hit>.1?runtime.musicInk?.(p,'perc')||'#fff':(c.pal?c.pal.main:"#fff");runtime.cx.lineWidth=1;runtime.cx.strokeRect(p.x+ox-p.w/2,p.y+oy-p.h,p.w,p.h);
        runtime.cx.globalAlpha=Math.min(1,al*.12+p.hit*.4)*(runtime.worldOpacity?.(d,R+80)??1);runtime.cx.fillStyle=p.hit>.1?runtime.musicInk?.(p,'perc')||'#fff':"#fff";runtime.cx.fillRect(p.x+ox-p.w/2,p.y+oy-p.h,p.w,p.h);if(p.hit<.1)runtime.touchRing(p.x+ox,p.y+oy-p.h/2,d,R,b);}
      // cristales: arpegios
      for(const k of c.crystals){const d=Math.hypot(k.x-runtime.S.wx,k.y-runtime.S.wy);
        const kw=runtime.waves.length&&runtime.hitW(k.x,k.y);if(kw){k.lit=1;runtime.wsoon(kw,k.snd);}
        if(contactEntry(k,d<k.s+ds/2+4,!paused&&!runtime.scanning)&&ms>k.cd){k.cd=ms+(k.personality?.cooldown||1500);runtime.MU.act+=.3;runtime.touched();if(!k.given){k.given=1;runtime.gain("cristal");}runtime.chain(c.crystals,k,0,new Set(),7);runtime.burst(k.x,k.y,6,true);}
        if(d<soundR)nearO.push(k);
        k.lit=Math.max(0,k.lit-dt*.25);if(d>R*1.2&&k.lit<=0)continue;const al=Math.max(Math.max(0,1-d/(R*1.2))*.55,k.lit);
        runtime.cx.save();runtime.cx.translate(k.x+ox,k.y+oy);runtime.cx.rotate(k.rot+b*.1);runtime.cx.globalAlpha=Math.min(1,al)*(runtime.worldOpacity?.(d,R*1.2)??1);runtime.cx.strokeStyle=k.lit>.1?runtime.musicInk?.(k,'acorde')||'#fff':(c.pal?c.pal.acc:"#fff");runtime.cx.lineWidth=1.2;
        runtime.cx.beginPath();runtime.cx.moveTo(0,-k.s*1.6);runtime.cx.lineTo(k.s*.5,0);runtime.cx.lineTo(0,k.s*.6);runtime.cx.lineTo(-k.s*.5,0);runtime.cx.closePath();runtime.cx.stroke();
        if(k.lit>.1){runtime.cx.globalAlpha=k.lit*.35*(runtime.worldOpacity?.(d,R*1.2)??1);runtime.cx.fillStyle=runtime.musicInk?.(k,'acorde')||'#fff';runtime.cx.fill();}runtime.cx.restore();if(k.lit<.1)runtime.touchRing(k.x+ox,k.y+oy,d,R,b);}
      for(const p2 of c.props){runtime.physics(p2,dt,c.props);const d=Math.hypot(p2.x-runtime.S.wx,p2.y-runtime.S.wy),w=runtime.waves.length&&runtime.hitW(p2.x,p2.y);
        if(w){p2.lit=1;runtime.wsoon(w,p2.snd);}
        if(contactEntry(p2,d<ds/2+12,!paused&&!runtime.scanning)&&ms>p2.cd){p2.cd=ms+(p2.personality?.cooldown||700);runtime.MU.act+=.3;runtime.touched();runtime.burst(p2.x,p2.y,6,true);
          if(p2.k==="campanilla"||p2.k==="antena"||p2.k==="astro")runtime.chain(c.props,p2,0,new Set(),5);
          else if(p2.k==="hongo")runtime.beatSoon(q=>{runtime.playVoice(p2.k,p2.i,q,runtime.regionOfPos(p2.x,p2.y),true,1,p2);},()=>{p2.lit=1;p2.jump=1;for(let k=0;k<3;k++)runtime.parts.push({x:p2.x,y:p2.y-8,vx:(Math.random()-.5)*60,vy:-60-Math.random()*40,l:1.4,g:true});});
          else{runtime.pushO(p2,runtime.S.wx,runtime.S.wy,170);runtime.beatSoon(p2.snd,()=>{p2.lit=1;});}}
        if(d<soundR)nearO.push(p2);
        p2.lit=Math.max(0,p2.lit-dt*.8);p2.jump=Math.max(0,(p2.jump||0)-dt*2.2);if(d>R*1.2&&p2.lit<=0)continue;
        runtime.cx.globalAlpha=Math.min(1,Math.max(Math.max(0,1-d/(R*1.2))*.7,p2.lit))*(runtime.worldOpacity?.(d,R*1.2)??1);runtime.drawProp(p2,p2.x+ox,p2.y+oy-Math.sin(p2.jump*Math.PI)*14,c.pal&&c.pal.main);if(p2.lit<.1)runtime.touchRing(p2.x+ox,p2.y+oy,d,R,b);}
      // faros: instrumentos
      for(const f of c.beacons){const d=Math.hypot(f.x-runtime.S.wx,f.y-runtime.S.wy);
        if(d<ds/2+16&&!f.on&&!runtime.MU.layers.has(f.layer)){f.on=true;runtime.MU.layers.add(f.layer);runtime.flash=.7;runtime.gain("faro");runtime.burst(f.x,f.y-40,24,true);
          runtime.toast("<em>Faro</em> · "+runtime.LAYERS[f.layer]+" · "+runtime.MU.layers.size+" / 3");runtime.unlock("faro");if(runtime.MU.layers.size>=3)runtime.unlock("banda");}
        if(d<ds/2+16&&!f.on&&runtime.MU.layers.has(f.layer))f.on=true;
        if(d>R*2.2)continue;const al=Math.max(0,1-d/(R*2.2)),on=f.on||runtime.MU.layers.has(f.layer);
        runtime.cx.globalAlpha=al*.6;runtime.cx.fillStyle="#fff";runtime.cx.fillRect(f.x+ox-1,f.y+oy-46,2,46);
        runtime.cx.globalAlpha=Math.min(1,al*(on?1:.5)+(on?b*.3:0))*(runtime.worldOpacity?.(d,R*2.2)??1);runtime.cx.fillStyle=on?runtime.musicInk?.(f)||'#fff':"#fff";runtime.cx.fillRect(f.x+ox-4,f.y+oy-54,8,8);
        if(on){runtime.cx.globalAlpha=al*.15;runtime.cx.beginPath();runtime.cx.arc(f.x+ox,f.y+oy-50,24+b*20,0,6.283);runtime.cx.fill();}}
      // cueva: estalactitas que gotean
      for(const s2 of c.stal){const d=Math.hypot(s2.x-runtime.S.wx,s2.y-runtime.S.wy);if(d>R*1.3)continue;const al=Math.max(0,1-d/(R*1.3));runtime.cx.globalAlpha=al*.5;runtime.cx.fillStyle="#fff";
        for(let i=0;i<s2.h;i+=3)runtime.cx.fillRect(s2.x+ox,s2.y+oy+i,1,1);
        const dp=((t/1000+s2.ph*3)%4)/4;runtime.cx.globalAlpha=al*(1-dp);runtime.cx.fillRect(s2.x+ox,s2.y+oy+s2.h+dp*30,1,2);
        if(d<soundR*.8&&dp<.02&&runtime.rnd()<.3)runtime.beatSoon(q=>runtime.playVoice('gota',0,q,runtime.regionOfPos(s2.x,s2.y),false,.3,s2),null,'ambient');}
      // jardín: flores sembradas
      for(const f of c.flowers){flowersNear.push(f);const d=Math.hypot(f.x-runtime.S.wx,f.y-runtime.S.wy);if(d>R*1.6)continue;
        const k=Math.max(0,1-(ms-(f.hit||0))/400),al=Math.max(0,1-d/(R*1.6))*.7+k*.3,s2=4+k*4;
        runtime.cx.globalAlpha=Math.min(1,al);runtime.cx.fillStyle=runtime.GOLD;runtime.cx.fillRect(f.x+ox-s2,f.y+oy-.75,s2*2,1.5);runtime.cx.fillRect(f.x+ox-.75,f.y+oy-s2,1.5,s2*2);
        runtime.cx.globalAlpha=al*.5;runtime.cx.fillRect(f.x+ox-.5,f.y+oy,1,10);}
    }
    runtime.MU.flowers=flowersNear.filter(f=>Math.hypot(f.x-runtime.S.wx,f.y-runtime.S.wy)<900);
    // sembrar en el jardín: quieto 1.2 s
    if(id==="jardin"){
      if(runtime.MU.still>1.2&&!runtime.planted&&runtime.ac){const c=runtime.wchunk(Math.floor(runtime.S.wx/runtime.WCH),Math.floor(runtime.S.wy/runtime.WCH));
        if(c.flowers.length<10){runtime.planted=true;const n=runtime.nextMel(),st=(runtime.MU.step+2)%16&~1;c.flowers.push({x:runtime.S.wx,y:runtime.S.wy+12,n,st,hit:0});runtime.gardenN++;runtime.gain("flor");
          runtime.burst(runtime.S.wx,runtime.S.wy,12,true);runtime.showPhrase("Sembraste una nota. Muévete y vuelve a quedarte quieto.");if(runtime.gardenN>=4)runtime.unlock("jardinero");}}
      if(runtime.MU.still===0)runtime.planted=false;
    }
    if(pondNow!==runtime.inPond){runtime.inPond=pondNow;if(runtime.mfilt)runtime.mfilt.frequency.setTargetAtTime(runtime.inPond?650:18000,runtime.ac.currentTime,.25);if(runtime.inPond)runtime.beatSoon(q=>runtime.playVoice('agua',0,q,rg));}
    // tormenta: rayos en el beat
    if(runtime.MU.boltAt&&runtime.ac&&runtime.ac.currentTime>=runtime.MU.boltAt){runtime.MU.boltAt=0;if(id==="tormenta"){const a=runtime.rnd()*6.28,d=60+runtime.rnd()*R,x=runtime.S.wx+Math.cos(a)*d,y=runtime.S.wy+Math.sin(a)*d;
      const pts=[[x,y-runtime.H]];for(let i=1;i<=8;i++)pts.push([x+(runtime.rnd()-.5)*60*(1-i/9),y-runtime.H+runtime.H*i/8]);runtime.bolts.push({pts,l:1});runtime.flash=Math.max(runtime.flash,.5);runtime.now(q=>runtime.thunder(q,{x,y}));}}
    runtime.bolts=runtime.bolts.filter(bo=>(bo.l-=dt*3)>0);
    for(const bo of runtime.bolts){runtime.cx.globalAlpha=bo.l;runtime.cx.strokeStyle="#fff";runtime.cx.lineWidth=2;runtime.cx.beginPath();bo.pts.forEach(([x,y],i)=>runtime.cx[i?"lineTo":"moveTo"](x+ox,y+oy));runtime.cx.stroke();}
    // vida
    let follow=false,followers=0;runtime.MU.walkerFollowers=[];
    for(let a=a0;a<=a1;a++)for(let bb=b0;bb<=b1;bb++){
      const raw=runtime.wchunk(a,bb),c=runtime.sceneChunk?.(raw)||raw;
      for(const f of c.flies){
        const tx=f.hx+Math.sin(t/1000*f.a+f.ph)*90,ty=f.hy+Math.cos(t/1300*f.a+f.ph*1.3)*70;
        const ddx=f.x-runtime.S.wx,ddy=f.y-runtime.S.wy,d=Math.hypot(ddx,ddy)||1;
        const fw=runtime.waves.length&&runtime.hitW(f.x,f.y);if(fw){f.fx+=ddx/d*120;f.fy+=ddy/d*120;runtime.wsoon(fw,q=>runtime.playVoice('luciernaga',0,q,runtime.regionOfPos(f.x,f.y),false,.7,f));}
        if(d<90){f.fx+=ddx/d*dt*260;f.fy+=ddy/d*dt*260;}
        f.fx*=Math.exp(-dt*1.8*(f.personality?.drag||1));f.fy*=Math.exp(-dt*1.8*(f.personality?.drag||1));f.x=tx+f.fx;f.y=ty+f.fy;
        if(d<ds/2+10&&ms>f.cd){f.cd=ms+3000;if(!f.given){f.given=1;runtime.gain("luciernaga");}f.fx+=ddx/d*160;f.fy+=ddy/d*160;runtime.beatSoon(q=>runtime.playVoice('luciernaga',0,q,runtime.regionOfPos(f.x,f.y),false,.7,f));}
        const vis=R*1.8;if(d>vis)continue;if(d<R*1.2)runtime.seen("luciernaga");
        const bl=Math.max(0,Math.sin(t/260+f.ph*3));runtime.cx.globalAlpha=Math.min(1,(.15+.85*bl*bl)*(1-d/vis)+b*.15)*(runtime.worldOpacity?.(d,vis)??1);runtime.cx.fillStyle=runtime.GOLD;runtime.cx.fillRect(f.x+ox-1,f.y+oy-1,2,2);
      }
      for(const o of c.sp){const sp=o.s;
        if(ev==="migracion"&&sp.id.startsWith(rg.key+":"))o.hx+=dt*55;
        if(!runtime.nativeLifeTick&&sp.mob==="orbita"){o.x=o.hx+Math.cos(t/1000*sp.spd*(o.personality?.speed||1)+o.ph)*50;o.y=o.hy+Math.sin(t/1000*sp.spd*(o.personality?.speed||1)+o.ph)*50;}
        else if(!runtime.nativeLifeTick&&sp.mob==="salta"){o.x=o.hx+Math.sin(t/2000*sp.spd*(o.personality?.speed||1)+o.ph)*30;o.y=o.hy-b*(o.personality?.jump||12);}
        else if(!runtime.nativeLifeTick&&sp.mob==="deriva"){o.x=o.hx+Math.sin(t/3000*sp.spd*(o.personality?.speed||1)+o.ph)*120;o.y=o.hy+Math.cos(t/3700*sp.spd*(o.personality?.speed||1)+o.ph)*90;}
        if(o.follow>0){o.follow-=dt;const spot=runtime.wowFollowTarget?.(o)||{x:runtime.S.wx+Math.cos(o.ph+t/900)*40,y:runtime.S.wy+Math.sin(o.ph+t/900)*40},tx=spot.x,ty=spot.y;o.hx+=(tx-o.hx)*Math.min(1,dt*2*(o.personality?.speed||1));o.hy+=(ty-o.hy)*Math.min(1,dt*2*(o.personality?.speed||1));if(sp.mob==='timida'){o.x=o.hx;o.y=o.hy;}if(!Object.values(runtime.jam?.band.members||{}).some(m=>m.sp.id===sp.id))singers.push(o);}
        else if(!sp.mob)runtime.physics(o,dt,c.sp);
        if(sp.mob==="timida"&&o.follow>0){}
        else if(!runtime.nativeLifeTick&&sp.mob==="timida"){const ax=o.x-runtime.S.wx,ay=o.y-runtime.S.wy,dd=Math.hypot(ax,ay)||1;if(dd<110){o.x+=ax/dd*dt*120*(o.personality?.speed||1);o.y+=ay/dd*dt*120*(o.personality?.speed||1);}else{o.x+=(o.hx-o.x)*dt*.3;o.y+=(o.hy-o.y)*dt*.3;}}
        runtime.nativeLifeTick?.(o,sp,paused?0:dt,t/1000,c.sp);
        const d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),w=runtime.waves.length&&runtime.hitW(o.x,o.y);
        if(w){o.lit=1;runtime.wsoon(w,q=>runtime.speciesSound(sp,q,false,o.personality,o));}
        if(contactEntry(o,d<ds/2+12,!paused&&!runtime.scanning)&&ms>o.cd){o.cd=ms+(o.personality?.cooldown||1100);runtime.MU.act+=.3;runtime.touched();runtime.burst(o.x,o.y,8,true);runtime.discover(sp);if(runtime.S.autoPins)runtime.bandJoin?.(o,sp);
          if(sp.mob){o.follow=runtime.S.autoPins?(o.personality?.stamina||20):0;runtime.beatSoon(q=>runtime.speciesSound(sp,q,true,o.personality,o),()=>{o.lit=1;});}
          else{runtime.pushO(o,runtime.S.wx,runtime.S.wy,120);let mate=null,md=320;for(const x of c.sp){if(x!==o&&x.s===sp){const dd=Math.hypot(x.x-o.x,x.y-o.y);if(dd<md){md=dd;mate=x;}}}
            runtime.beatSoon(q=>{runtime.speciesSound(sp,q,true,o.personality,o);if(mate){runtime.speciesSound(sp,q+runtime.SIX*16,true,mate.personality,mate);setTimeout(()=>{mate.lit=1;runtime.beams.push({x1:o.x,y1:o.y,x2:mate.x,y2:mate.y,l:1});},Math.max(0,(q+runtime.SIX*16-runtime.ac.currentTime)*1000));}},()=>{o.lit=1;});}if(runtime.RP&&runtime.RP.type==="cantar"&&sp.id.startsWith(runtime.RP.key+":")){runtime.RP.set.add(sp.id);runtime.retoSet("cantar",runtime.RP.set.size);}}
        if(d<soundR)nearO.push(o);o.lit=Math.max(0,o.lit-dt*.8);const vis=sp.mob?R*1.6:R*1.2;if(d>vis&&o.lit<=0)continue;
        runtime.cx.globalAlpha=Math.min(1,Math.max(Math.max(0,1-d/vis)*.9,o.lit))*(runtime.worldOpacity?.(d,vis)??1);
        if(runtime.drawNativeSpecies)runtime.drawNativeSpecies(sp,o,o.x+ox,o.y+oy,t,b,!!runtime.blobHabitat?.(runtime.regionOfPos(o.x,o.y)));else if(runtime.blobHabitat?.(runtime.regionOfPos(o.x,o.y)))runtime.drawBlob(sp,o,o.x+ox,o.y+oy,t,b);else runtime.drawSprite(sp.bits,o.x+ox,o.y+oy,sp.cell*(1+o.lit*.4+(sp.mob?b*.15:0)),o.lit>.1?"#fff":sp.col);
        if(o.lit<.1&&!runtime.S.cat[sp.id])runtime.touchRing(o.x+ox,o.y+oy,d,R,b);}
      for(const k of c.walkers){
        const form=k.walkerForm,kd=paused?0:dt;moveWalker(k,form,{x:runtime.S.wx,y:runtime.S.wy},kd,t,runtime.wowFollowTarget?.(k));
        const d=Math.hypot(k.x-runtime.S.wx,k.y-runtime.S.wy)||1;
        if(k.follow>0){k.follow-=kd;follow=true;followers++;if(runtime.MU.walkerFollowers.length<2)runtime.MU.walkerFollowers.push(k);}
        else{
          if(d<80){k.near+=kd;if(!paused&&k.near>form.patience&&!k.done){k.done=true;k.follow=form.following;runtime.recordWalkerForm(form);runtime.unlock("compania");runtime.showPhrase(form.name+" · escucha tu música");runtime.soon(q=>runtime.playVoice('caminante',0,q,runtime.regionOfPos(k.x,k.y),true,1,k),'player');}}
          else k.near=Math.max(0,k.near-kd);
        }
        if(!k.lt||Math.hypot(k.x-k.lt[0],k.y-k.lt[1])>12){k.lt=[k.x,k.y];k.trail.push(k.lt);if(k.trail.length>30)k.trail.shift();}
        const vis=R*1.7;if(d>vis+400)continue;if(d<R*1.2)runtime.seen("caminante");
        runtime.cx.fillStyle="#fff";
        k.trail.forEach(([p,q],i)=>{const e=Math.hypot(p-runtime.S.wx,q-runtime.S.wy),al=(i/k.trail.length)*.25*Math.max(0,1-e/vis);if(al>.01){runtime.cx.globalAlpha=al;runtime.cx.fillRect(p+ox-1,q+oy-1,2,2);}});
        if(d<vis){runtime.cx.globalAlpha=Math.max(0,1-d/vis)*(runtime.worldOpacity?.(d,vis)??1);runtime.cx.strokeStyle=runtime.musicInk?.(k)||'#fff';drawWalker(runtime.cx,form,k.x+ox,k.y+oy,t,runtime.S.reducedMotion);if(k.follow>0&&d<140){runtime.cx.globalAlpha*=.65;runtime.cx.font='10px "Geist Mono",monospace';runtime.cx.textAlign='center';runtime.cx.fillText(form.name,k.x+ox,k.y+oy-16);}}
      }
      for(let i=c.motes.length-1;i>=0;i--){const m=c.motes[i],d=Math.hypot(m.x-runtime.S.wx,m.y-runtime.S.wy);
        if(d<ds/2+10){c.motes.splice(i,1);runtime.playerNote(.13);runtime.burst(m.x,m.y,5,runtime.grooveFx>.9);continue;}
        const mw=runtime.waves.length&&runtime.hitW(m.x,m.y);if(mw){m.fl=1;runtime.wsoon(mw,q=>runtime.playVoice('luz',Math.floor(d/30),q,runtime.regionOfPos(m.x,m.y),false,1,m));}m.fl=Math.max(0,(m.fl||0)-dt*2);
        if(d>R&&!m.fl)continue;runtime.cx.globalAlpha=Math.min(1,Math.max(m.fl,Math.pow(Math.max(0,1-d/R),1.3)*(.5+.25*Math.sin(t/400+m.ph)+b*.35)))*(runtime.worldOpacity?.(d,R)??1);runtime.cx.fillStyle=m.fl>.1?runtime.musicInk?.(m)||'#fff':"#fff";runtime.cx.fillRect(m.x+ox-1.5,m.y+oy-1.5,3,3);}
    }
    runtime.MU.follower=follow;if(followers>=2)runtime.unlock("fiesta");runtime.MU.near=runtime.currentPocket()?.kind==='quiet'?[]:nearO;runtime.MU.singers=singers;
    runtime.beams=runtime.beams.filter(be=>(be.l-=dt*1.6)>0);runtime.cx.lineWidth=1.2;for(const be of runtime.beams){runtime.cx.globalAlpha=be.l*.8;runtime.cx.strokeStyle=runtime.musicInk?.({x:be.x1,y:be.y1},'acorde')||'#fff';runtime.cx.beginPath();runtime.cx.moveTo(be.x1+ox,be.y1+oy);runtime.cx.lineTo(be.x2+ox,be.y2+oy);runtime.cx.stroke();}
    {const cc=runtime.wchunk(Math.floor(runtime.S.wx/runtime.WCH),Math.floor(runtime.S.wy/runtime.WCH));if(cc.var!==runtime.MU.vari){runtime.MU.vari=cc.var;}}
    // tu Estudio en el mapa
    if(runtime.S.studio.x!=null){const d=Math.hypot(runtime.S.studio.x-runtime.S.wx,runtime.S.studio.y-runtime.S.wy);if(d<R*2.5){const x=runtime.S.studio.x+ox,y=runtime.S.studio.y+oy;runtime.cx.globalAlpha=Math.min(1,1.2-d/(R*2.5))*(runtime.worldOpacity?.(d,R*2.5)??1);runtime.cx.strokeStyle=runtime.S.color;runtime.cx.lineWidth=1.5;runtime.cx.strokeRect(x-8,y-8,16,16);runtime.cx.beginPath();runtime.cx.moveTo(x-11,y-8);runtime.cx.lineTo(x,y-17);runtime.cx.lineTo(x+11,y-8);runtime.cx.stroke();}}
    // bandadas en cielo abierto
    if(["llanura","lago","dunas","vacio"].includes(id)&&runtime.flocks.length<2&&Math.random()<dt*.06){
      const an=Math.random()*6.28,dd=R*1.6+200,fx=runtime.S.wx+Math.cos(an)*dd,fy=runtime.S.wy+Math.sin(an)*dd;
      runtime.flocks.push({x:fx,y:fy,h:Math.atan2(runtime.S.wy-fy,runtime.S.wx-fx)+(Math.random()-.5)*.8,close:0,done:false,b:Array.from({length:14},()=>({ox:(Math.random()-.5)*60,oy:(Math.random()-.5)*40,ph:Math.random()*6.28}))});
    }
    runtime.flocks=runtime.flocks.filter(f=>Math.hypot(f.x-runtime.S.wx,f.y-runtime.S.wy)<2200);
    for(const f of runtime.flocks){
      f.h+=Math.sin(t/1500+f.b[0].ph)*dt*.3;f.x+=Math.cos(f.h)*80*dt;f.y+=Math.sin(f.h)*80*dt;
      const d=Math.hypot(f.x-runtime.S.wx,f.y-runtime.S.wy),vis=R*1.5;
      if(d<90){f.close+=dt;if(f.close>2.5&&!f.done){f.done=true;runtime.unlock("vuelo");runtime.soon(q=>runtime.playVoice('bandada',0,q,runtime.regionOfPos(f.x,f.y),true,1,f));}}
      if(d<R*1.2)runtime.seen("bandada");
      runtime.cx.fillStyle="#fff";
      for(const q of f.b){const x=f.x+q.ox+Math.sin(t/400+q.ph)*6,y=f.y+q.oy+Math.cos(t/520+q.ph)*5,e=Math.hypot(x-runtime.S.wx,y-runtime.S.wy);if(e>vis)continue;
        const flap=Math.sin(t/90+q.ph)>0;runtime.cx.globalAlpha=Math.max(0,1-e/vis);runtime.cx.fillRect(x+ox-1,y+oy-(flap?1:0),flap?3:2,flap?1:2);}
    }
    runtime.drawLandmarks?.(t,dt,ox,oy);runtime.drawPortals?.(t,ox,oy,b);
    // Only local clues: no global arrow or player-relative spawning.
    let nd=0;
    runtime.pruneRelics();
    runtime.relicEchoTick?.();runtime.drawRelicEchoes?.(ox,oy,R);
    for(const rl of runtime.nearbyRelics()){
      const d=Math.hypot(rl.x-runtime.S.wx,rl.y-runtime.S.wy);
      if(!rl.id&&d<ds/2+16){runtime.takeRelic(rl);continue;}
      if(runtime.visitRelic(rl,paused||runtime.scanning?0:dt))continue;
      if(d>R)continue;
      nd=nd?Math.min(nd,d):d;
      const al=Math.max(0,1-d/R),progress=runtime.relicProgress(rl),need=rl.magical?5:3,ink=rl.magical?'#c9b9ff':'#c8e9ee';
      runtime.cx.globalAlpha=al;runtime.cx.strokeStyle=runtime.cx.fillStyle=ink;runtime.cx.lineWidth=1;
      const x=rl.x+ox,y=rl.y+oy,size=rl.magical?16:10;
      glyph(runtime.cx,rl.s,x,y,size*(1+b*.2));
      for(let i=0;i<need;i++){const a=i/need*6.283+t/6000;runtime.cx.globalAlpha=al*(i<progress.pulses ? .9 : .25);runtime.cx.beginPath();runtime.cx.arc(x+Math.cos(a)*28,y+Math.sin(a)*28,2,0,6.283);runtime.cx.stroke();}
      runtime.cx.globalAlpha=al*.6;runtime.cx.beginPath();runtime.cx.arc(x,y,36,-Math.PI/2,-Math.PI/2+6.283*(progress.dwell/(rl.magical?12:6)));runtime.cx.stroke();
      if(d<100){runtime.cx.globalAlpha=.8;runtime.cx.fillStyle=ink;runtime.cx.font="10px 'Geist Mono', monospace";runtime.cx.textAlign="center";runtime.cx.fillText(rl.name||"Reliquia",x,y-44);runtime.cx.fillText(`Escucha ${Math.floor(progress.dwell)}/${rl.magical?12:6}s · ${progress.pulses}/${need} pulsos`,x,y+52);}
    }
    runtime.bodyTick?.(dt);runtime.quietTick?.(dt);runtime.cajasTick?.(dt);runtime.cultureTick?.(dt);   // el cubo primero: los objetos leen su contacto en este cuadro
    runtime.drawGlass?.(t,dt,ox,oy,R);
    runtime.drawMirrors?.(t,dt,ox,oy,R);
    runtime.drawMateria?.(t,dt,ox,oy,R);
    runtime.drawVida?.(t,dt,ox,oy,R);
    runtime.drawQuietud?.();
    runtime.drawLivingTerrain?.();runtime.livingTick?.(dt);runtime.drawLiving?.(t);
    runtime.drawCajas?.(t,dt,ox,oy);runtime.drawCultures?.();
    runtime.percussionTick?.(dt);runtime.drawPercussion?.(t,dt,ox,oy,R);runtime.microTick?.(dt);runtime.drawMicro?.(t,ox,oy,R);
    runtime.drawPhenomena(t,dt,ox,oy,R);
    runtime.drawJam?.(t,dt,ox,oy,b);
    runtime.drawAlive?.(t,dt,ox,oy,'sky');
    runtime.drawSoundCues(ox,oy,R);
    runtime.drawFirstJourney?.();
    if((runtime.hudT+=dt)>.5){runtime.hudT=0;runtime.hud(nd);}
    return ds;
  }


  document.addEventListener('visibilitychange',()=>{frame.l=performance.now();runtime.activeFrameSeconds=0;});
  Object.defineProperties(runtime, {
    frame: { get: () => frame },
  });
}
import {decorativeField} from './territory-presentation.js';
