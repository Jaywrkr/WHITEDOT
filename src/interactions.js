import {decorativeField} from './territory-presentation.js';
import {selectedPulse,pulseCrossed,drawPulse} from './pulse-forms.js';
// Pulsos, física y respuestas de los objetos.
export function initialize(runtime) {
  let emptyP=0,waves=[],lastSonar=0,tapStart=null,rain=[],beams=[];
  function beatSoon(fn,vis,origin="player"){if(runtime.ac)runtime.MU.q8.push({fn:q=>runtime.withVoiceOrigin?runtime.withVoiceOrigin(origin,()=>fn(q)):fn(q),vis});else if(vis)vis();}
  function pushO(o,fx,fy,force){const dx=o.x-fx,dy=o.y-fy,d=Math.hypot(dx,dy)||1;o.vx=(o.vx||0)+dx/d*force/(o.personality?.mass||1);o.vy=(o.vy||0)+dy/d*force/(o.personality?.mass||1);}
  function physics(o,dt,list,bound){
    if(!o.vx&&!o.vy)return;o.x+=o.vx*dt;o.y+=o.vy*dt;const f=Math.pow(.15,dt*(o.personality?.drag||1));o.vx*=f;o.vy*=f;
    if(bound){const dx=o.x-bound.x,dy=o.y-bound.y,dd=Math.hypot(dx,dy)||1;if(dd>bound.r-12){o.x=bound.x+dx/dd*(bound.r-12);o.y=bound.y+dy/dd*(bound.r-12);o.vx*=-.6;o.vy*=-.6;}}
    const sp=Math.hypot(o.vx,o.vy);if(sp<8){o.vx=o.vy=0;return;}
    if(sp>45){const n=performance.now();for(const p of list){if(p===o)continue;if(Math.abs(p.x-o.x)<16&&Math.abs(p.y-o.y)<16&&n>(p.cd||0)){p.cd=n+450;p.vx=(p.vx||0)+o.vx*.6;p.vy=(p.vy||0)+o.vy*.6;o.vx*=.4;o.vy*=.4;if(p.snd)beatSoon(p.snd,()=>{p.lit=1;p.hit=1;},"ambient");}}}
  }
  function chain(list,o,depth,seen,maxD){seen.add(o);
    beatSoon(q=>o.snd&&o.snd(q,depth),()=>{o.lit=1;o.hit=1;if(depth>=(maxD||6))return;let best=null,bd=240;
      for(const p of list){if(seen.has(p))continue;const d=Math.hypot(p.x-o.x,p.y-o.y);if(d<bd){bd=d;best=p;}}
      if(best){beams.push({x1:o.x,y1:o.y,x2:best.x,y2:best.y,l:1});chain(list,best,depth+1,seen,maxD);}});}
  function hitW(x,y){for(const w of waves){if(!pulseCrossed(w,x,y))continue;if(!w.form||w.form.id==='ring-0'){runtime.wowPulseHit?.(x,y,w);return w;}const key=x.toFixed(2)+','+y.toFixed(2);w.contacts||=new Set();if(w.contacts.has(key)||w.contacts.size>=256)continue;w.contacts.add(key);runtime.wowPulseHit?.(x,y,w);return w;}return null;}
  function wsoon(w,fn){if(w.n++<12)runtime.soon(fn,w.origin||"player");}
  function updWaves(dt,ox,oy){for(const w of waves){w.prev=w.r;w.r+=dt*420;if(w.r>=w.max&&runtime.inWorld()){if(runtime.RP&&runtime.RP.type==="pulsoGrande")runtime.retoSet("pulsoGrande",Math.max(runtime.RP.val,w.n));if(w.n===0){emptyP++;if(emptyP>=10)runtime.unlock("dj");}else emptyP=0;}}waves=waves.filter(w=>w.r<w.max);
    for(const w of waves){runtime.cx.globalAlpha=(1-w.r/w.max)*.6;runtime.cx.strokeStyle=w.color||runtime.S.color;runtime.cx.lineWidth=1.5;drawPulse(runtime.cx,w.form||selectedPulse({}),w.x+ox,w.y+oy,w.r,!!runtime.S.reducedMotion);}}
  function sonar(origin='player'){
    if(runtime.activityActive)return;
    origin=origin==='ambient'?'ambient':'player';
    if(runtime.S.mode==="studio")return;runtime.audio();const ms=performance.now();if(ms-lastSonar<700)return;lastSonar=ms;
    if(origin==='player'){runtime.markInput?.();runtime.visualGesture?.();}
    if(origin==='player')runtime.firstJourneyEvent?.('pulse');
    if(runtime.inWorld()&&runtime.S.layer&&runtime.S.layer!=='superficie'){runtime.layerPulse?.();return;}
    if(runtime.inWorld())runtime.microPulse?.(origin);
    if(origin==='player'&&runtime.inWorld())runtime.portalPulse?.(runtime.onBeatNow());   // ritual de portales: pulsos seguidos en el beat
    if(runtime.inWorld()&&(runtime.S.layer||"superficie")!=="superficie")return;
    if(origin==='player'&&runtime.inWorld()){runtime.sessionAction("pulse");runtime.pulseRelics();}
    const x=runtime.inWorld()?runtime.S.wx:runtime.S.px,y=runtime.inWorld()?runtime.S.wy:runtime.S.py;waves.push({x,y,r:0,prev:0,max:runtime.inWorld()?340:260,n:0,origin,form:runtime.inWorld()?selectedPulse(runtime.S):selectedPulse({}),color:runtime.inWorld()?runtime.cubeColor?.():null});
    if(origin==='player'&&runtime.inWorld()&&runtime.RP&&runtime.RP.type==="pulsos"){runtime.RP.pst=runtime.onBeatNow()?runtime.RP.pst+1:0;runtime.retoSet("pulsos",runtime.RP.pst);}
    runtime.MU.act+=.25;runtime.pulse=Math.max(runtime.pulse,.6);runtime.soon(t=>{if(runtime.inWorld())runtime.playVoice('pulso',0,t,runtime.regionOfPos(x,y),true,1,{x,y},origin);else{const ct=runtime.chordTones();[0,1,2].forEach(i=>runtime.pluck(ct[i]+12,t,runtime.vel(.08),2));}},origin);
  }
  function boing(m,t,v){const o=runtime.ac.createOscillator(),g=runtime.ac.createGain();o.type="sine";o.frequency.setValueAtTime(runtime.hz(m+12),t);o.frequency.exponentialRampToValueAtTime(runtime.hz(m),t+.12);runtime.env(g,t,.004,v,.35);o.connect(g).connect(runtime.bus);const sv=runtime.ac.createGain();sv.gain.value=.3;g.connect(sv).connect(runtime.verbIn);o.start(t);o.stop(t+.5);}
  function propSound(k,i,t,region){runtime.playVoice(k,i,t,region||runtime.regionOfPos(runtime.S.wx,runtime.S.wy));}
  function drawProp(p,x,y,base){const s=6+p.lit*3,c=p.lit>.1?runtime.musicInk?.(p)||'#fff':(base||"#fff");runtime.cx.strokeStyle=c;runtime.cx.fillStyle=c;runtime.cx.lineWidth=1.3;runtime.cx.beginPath();
    switch(p.k){
      case "piedra":runtime.cx.arc(x,y,s*.7,0,6.283);runtime.cx.stroke();break;
      case "hongo":runtime.cx.arc(x,y,s,Math.PI,0);runtime.cx.closePath();runtime.cx.stroke();runtime.cx.fillRect(x-.75,y,1.5,s*.8);break;
      case "campanilla":runtime.cx.moveTo(x-s*.6,y+s*.4);runtime.cx.lineTo(x,y-s*.7);runtime.cx.lineTo(x+s*.6,y+s*.4);runtime.cx.closePath();runtime.cx.stroke();runtime.cx.fillRect(x-1,y+s*.5,2,2);break;
      case "cactus":runtime.cx.fillRect(x-.75,y-s,1.5,s*2);runtime.cx.fillRect(x-s*.6,y-s*.3,s*.6,1.5);runtime.cx.fillRect(x-s*.6,y-s*.8,1.5,s*.5);runtime.cx.fillRect(x,y,s*.6,1.5);runtime.cx.fillRect(x+s*.6-1.5,y-s*.5,1.5,s*.5);break;
      case "antena":runtime.cx.fillRect(x-.75,y-s*1.4,1.5,s*2.4);runtime.cx.arc(x,y-s*1.4,2.5,0,6.283);runtime.cx.fill();break;
      case "gota":runtime.cx.moveTo(x,y-s);runtime.cx.quadraticCurveTo(x+s*.8,y+s*.3,x,y+s*.6);runtime.cx.quadraticCurveTo(x-s*.8,y+s*.3,x,y-s);runtime.cx.stroke();break;
      case "astro":runtime.cx.fillRect(x-s,y-.75,s*2,1.5);runtime.cx.fillRect(x-.75,y-s,1.5,s*2);runtime.cx.fillRect(x-1.5,y-1.5,3,3);break;}}
  function plantSound(pt,q,region,traits,source){runtime.playVoice('planta:'+pt.t,traits?.degree||0,q,region||runtime.regionOfPos(runtime.S.wx,runtime.S.wy),false,traits?.volume||1,source);}
  function drawPlant(o,x,y,t,b){if(runtime.drawNativePlant?.(o,x,y,t))return;const pt=o.pt,h=o.h,sw=Math.sin(t/(o.personality?.period||1100)+o.ph)*h*(o.personality?.sway||.08)+o.sw*Math.sin(t/60)*3,lit=o.lit>.1,c=lit?runtime.musicInk?.(o)||'#fff':`hsl(${pt.hue},28%,${lit?70:52}%)`,c2=lit?"#fff":`hsl(${pt.hue},60%,70%)`;
    runtime.cx.fillStyle=c;runtime.cx.strokeStyle=c;runtime.cx.lineWidth=1;
    switch(pt.t){
      case "hierba":runtime.cx.fillRect(x,y-h*.5,1,h*.5);runtime.cx.fillRect(x+sw*.5,y-h*.5-2,1,2);break;
      case "flor":runtime.cx.beginPath();runtime.cx.moveTo(x,y);runtime.cx.quadraticCurveTo(x,y-h*.6,x+sw,y-h);runtime.cx.stroke();runtime.cx.fillStyle=c2;for(let i=0;i<pt.pet;i++){const a=i/pt.pet*6.283+o.ph;runtime.cx.fillRect(x+sw+Math.cos(a)*3-1,y-h+Math.sin(a)*3-1,2,2);}runtime.cx.fillStyle=lit?runtime.musicInk?.(o)||'#fff':"#fff";runtime.cx.fillRect(x+sw-1,y-h-1,2,2);break;
      case "arbusto":for(let i=0;i<5;i++){const a=-Math.PI/2+(i-2)*.38,l=h*.55*(i%2?.8:1);runtime.cx.beginPath();runtime.cx.moveTo(x,y);runtime.cx.lineTo(x+Math.cos(a)*l+sw*.5,y+Math.sin(a)*l);runtime.cx.stroke();runtime.cx.fillStyle=c2;runtime.cx.fillRect(x+Math.cos(a)*l+sw*.5-1,y+Math.sin(a)*l-1,2,2);runtime.cx.fillStyle=c;}break;
      case "helecho":runtime.cx.beginPath();runtime.cx.moveTo(x,y);runtime.cx.quadraticCurveTo(x+h*.3,y-h*.6,x+sw+h*.15,y-h);runtime.cx.stroke();for(let i=1;i<6;i++){const k=i/6,px=x+(sw+h*.15)*k*k+h*.3*k*(1-k)*2,py=y-h*k;runtime.cx.fillRect(px-3,py,3,1);runtime.cx.fillRect(px+1,py-1,3,1);}break;
      case "junco":runtime.cx.fillRect(x+sw*.3,y-h*1.3,1,h*1.3);runtime.cx.fillStyle=c2;runtime.cx.fillRect(x+sw*.3-1,y-h*1.3-4,3,5);break;
      case "coral":runtime.cx.beginPath();runtime.cx.moveTo(x,y);runtime.cx.lineTo(x,y-h*.5);runtime.cx.lineTo(x-h*.3+sw*.3,y-h);runtime.cx.moveTo(x,y-h*.5);runtime.cx.lineTo(x+h*.3+sw*.3,y-h*.85);runtime.cx.moveTo(x-h*.15,y-h*.75);runtime.cx.lineTo(x-h*.35,y-h*.7);runtime.cx.stroke();break;}}
  function hash2(a,b){let h=(a*374761393+b*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;}
  function drawGround(ox,oy,R,t){const G=24,x0=Math.floor((runtime.S.wx-R)/G),x1=Math.floor((runtime.S.wx+R)/G),y0=Math.floor((runtime.S.wy-R)/G),y1=Math.floor((runtime.S.wy+R)/G);let lastC=null,lastK="";
    for(let ix=x0;ix<=x1;ix++)for(let iy=y0;iy<=y1;iy++){const wx=ix*G,wy=iy*G,d=Math.hypot(wx-runtime.S.wx,wy-runtime.S.wy);if(d>R)continue;
      const field=decorativeField(wx,wy,runtime.seedOf);if(field<.002)continue;
      const ck=Math.floor(wx/runtime.WCH)+","+Math.floor(wy/runtime.WCH);if(ck!==lastK){lastK=ck;lastC=runtime.wchunks.get(ck);}if(!lastC)continue;
      let gt=lastC.ground,pal=lastC.pal;
      {const RS=runtime.REG*runtime.WCH,lx=((wx%RS)+RS)%RS,ly=((wy%RS)+RS)%RS,ed=[lx,RS-lx,ly,RS-ly],i=ed.indexOf(Math.min(...ed)),de=ed[i];if(de<900&&hash2(ix+11,iy-7)<.5*(1-de/900)){const nb=runtime.regionOfPos(wx+[-1,1,0,0][i]*(de+10),wy+[0,0,-1,1][i]*(de+10));gt=nb.ground;pal=nb.pal;}}
      if(!gt)continue;
      const h=hash2(ix,iy),al=Math.pow(1-d/R,1.2)*field,gx=wx+ox+h*G,gy=wy+oy+((h*7)%1)*G;
      switch(gt){
        case "arena":runtime.cx.globalAlpha=al*.45;runtime.cx.fillStyle=pal.sand;runtime.cx.fillRect(gx,gy,h>.7?2:1,1);if(h<.25){runtime.cx.fillRect(gx+5,gy+3,1,1);}break;
        case "piedra":if(h<.45){runtime.cx.globalAlpha=al*.38;runtime.cx.strokeStyle=pal.soft;runtime.cx.lineWidth=1;runtime.cx.beginPath();runtime.cx.moveTo(gx,gy);runtime.cx.lineTo(gx+4+h*8,gy+(h-.2)*8);runtime.cx.stroke();}break;
        case "musgo":runtime.cx.globalAlpha=al*.4;runtime.cx.fillStyle=pal.soft;runtime.cx.fillRect(gx,gy,2,2);runtime.cx.fillRect(gx+6,gy+(h*9)%5,1,1);break;
        case "ceniza":if(h<.4){runtime.cx.globalAlpha=al*.42;runtime.cx.fillStyle="#8d8d92";runtime.cx.fillRect(gx,gy,1,1);}break;
        case "cristal":if(h<.3){runtime.cx.globalAlpha=al*.42;runtime.cx.strokeStyle=pal.acc;runtime.cx.lineWidth=1;runtime.cx.beginPath();runtime.cx.moveTo(gx,gy-3);runtime.cx.lineTo(gx+3,gy+2);runtime.cx.lineTo(gx-3,gy+2);runtime.cx.closePath();runtime.cx.stroke();}break;
        case "agua":{const sh=Math.sin(t/700+h*12);runtime.cx.globalAlpha=al*(.22+.15*sh);runtime.cx.fillStyle=pal.main;runtime.cx.fillRect(gx,gy,6+sh*3,1);break;}}}}
  function touchRing(x,y,d,R,b){if(d<R&&b>.25){runtime.cx.globalAlpha=b*.3*(1-d/R);runtime.cx.strokeStyle=runtime.musicInk?.({x:x-runtime.W/2+runtime.S.wx,y:y-runtime.H/2+runtime.S.wy})||'#fff';runtime.cx.lineWidth=1;runtime.cx.beginPath();runtime.cx.arc(x,y,13+b*5,0,6.283);runtime.cx.stroke();}}
  function drawSprite(bits,x,y,c,col){runtime.cx.fillStyle=col;for(let row=0;row<5;row++)for(let k=0;k<3;k++)if(bits>>(row*3+k)&1){runtime.cx.fillRect(x+(k-2)*c,y+(row-2.5)*c,c,c);if(k<2)runtime.cx.fillRect(x+(2-k)*c,y+(row-2.5)*c,c,c);}}
  function speciesSound(sp,t,full,traits,source){
    const key=sp.id.split(':')[0],coords=key.split(',').map(Number);
    const region=runtime.regionOfPos(coords[0]*runtime.REG*runtime.WCH+1,coords[1]*runtime.REG*runtime.WCH+1);
    runtime.playVoice('forma:'+sp.id,sp.deg+(traits?.degree||0),t,region,full,traits?.volume||1,source);
  }

  Object.defineProperties(runtime, {
    waves: { get: () => waves, set: value => { waves = value; } },
    tapStart: { get: () => tapStart, set: value => { tapStart = value; } },
    rain: { get: () => rain, set: value => { rain = value; } },
    beams: { get: () => beams, set: value => { beams = value; } },
    beatSoon: { get: () => beatSoon },
    pushO: { get: () => pushO },
    physics: { get: () => physics },
    chain: { get: () => chain },
    hitW: { get: () => hitW },
    wsoon: { get: () => wsoon },
    updWaves: { get: () => updWaves },
    sonar: { get: () => sonar },
    boing: { get: () => boing },
    propSound: { get: () => propSound },
    drawProp: { get: () => drawProp },
    plantSound: { get: () => plantSound },
    drawPlant: { get: () => drawPlant },
    drawGround: { get: () => drawGround },
    touchRing: { get: () => touchRing },
    drawSprite: { get: () => drawSprite },
    speciesSound: { get: () => speciesSound },
  });
}
