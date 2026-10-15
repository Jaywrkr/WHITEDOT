import {musicalCharacter,hookPitch,hookInstruments} from './musical-character.js';
// Quietud viva y atmósfera de color.
// Si te quedas en un sitio, el lugar cambia por etapas: sube el color, entra una voz nueva, llegan visitas,
// la música gira (y se vuelve más experimental), te dejan un regalo (una caja misteriosa) y a los 5 minutos
// el lugar queda «escuchado»: al volver empieza más adelante.
// La atmósfera pinta nubes de color del lugar detrás de todo (más vivas con la quietud y con los logros).
import {QUIET_STAGES,quietStage,quietStart} from './expansion-music.js';
import {swatchOf} from './visual.js';
const TAU=Math.PI*2;

export function initialize(runtime){
 let owner=runtime.S;
 const S=()=>runtime.S,state={seconds:0,stage:0,anchor:null,key:null,visitors:[],bloom:0,pulse:0,pulseHue:0};
 function normalizeBook(){S().quietGifts=Object.fromEntries(Object.entries(S().quietGifts||{}).filter(([key,value])=>/^-?\d+,-?\d+:\d{4}-\d{2}-\d{2}$/.test(key)&&value===1));S().listened=Object.fromEntries(Object.entries(S().listened||{}).filter(([key,n])=>/^-?\d+,-?\d+$/.test(key)&&Number.isInteger(n)&&n>=0&&n<=6));}
 normalizeBook();
 function ensureOwner(){if(owner!==S()){owner=S();normalizeBook();reset();state.bloom=state.pulse=0;state.key=null;}}
 const surface=()=>runtime.inWorld()&&(S().layer||'superficie')==='superficie';
 function reset(){state.seconds=0;state.stage=0;state.anchor=null;state.visitors=[];}
 function enterStage(k){
  const st=QUIET_STAGES[k],d=runtime.MU.dnaT;state.stage=k;if(!st?.name)return;
  runtime.toast(`<em>${st.name}</em> · ${st.text}`);
  if(!S().help['quiet_'+st.id]){S().help['quiet_'+st.id]=true;if(runtime.VOZ['quiet_'+st.id])runtime.say(runtime.VOZ['quiet_'+st.id],st.name);}
  if(st.id==='visita'){state.visitors=Array.from({length:5},(_,i)=>({a:i/5*TAU,r:90+i*8,lit:0,hue:(d?.hue||0)+i*40}));for(const f of runtime.nearbyFlocks?.(700)||[])f.trust=1;}
  if(st.id==='giro'){runtime.MU.vari=((runtime.MU.vari||0)+2)%4;sweep();}
  if(st.id==='regalo'&&d){const k=`${d.key}:${runtime.dayKey?.()}`;if(!S().quietGifts[k]){const box=runtime.spawnBox?.(S().wx+70,S().wy-40);if(box){S().quietGifts[k]=1;runtime.save?.();}}}
  if(st.id==='ritual'&&d){runtime.unlock('quietud5');}
  if(st.id==='giro')runtime.unlock('quietud3');
  if(d){const book=S().listened;book[d.key]=Math.max(book[d.key]||0,k);}
 }
 function tick(dt){
  ensureOwner();
  if(!surface()||document.hidden){reset();return;}
  const b=runtime.body,d=runtime.MU.dnaT;if(!b?.ready)return;
  if(b.jump||!state.anchor||Math.hypot(S().wx-state.anchor.x,S().wy-state.anchor.y)>90||d?.key!==state.key){
   state.anchor={x:S().wx,y:S().wy};state.key=d?.key;state.seconds=quietStart(S().listened[d?.key]);state.stage=quietStage(state.seconds);state.visitors=[];return;}
  if(document.querySelector('.modal:not([hidden])')||runtime.scanning||!S().sound||runtime.ac?.state!=='running'||b.speed>12)return;
  state.seconds+=dt;const k=quietStage(state.seconds);if(k>state.stage)enterStage(k);
  state.bloom+=((state.stage>=1?Math.min(1,.35+state.stage*.13):0)-state.bloom)*Math.min(1,dt*.4);
  state.pulse=Math.max(0,state.pulse-dt*.35);
  for(const v of state.visitors){v.a+=dt*(.4+v.r/400);v.lit=Math.max(0,v.lit-dt*1.5);}
 }
 // Voz del lugar (etapa 2+): una línea lenta con el instrumento del lugar; las visitas puntean.
 function step(s,bar,time){
  if(!surface()||document.hidden||document.querySelector('.modal:not([hidden])')||runtime.scanning||!S().sound||runtime.ac?.state!=='running'||state.stage<2)return;const d=runtime.MU.dnaA;if(!d)return;
  const ct=runtime.chordTones?.()||[60,64,67],inst=runtime.MU.radio?.hookI||hookInstruments(d.genre,runtime.GEN[d.genre])[0],profile=musicalCharacter(d.genre);
  if(s===0&&bar%2===0)runtime.hookInst?.(inst,hookPitch(inst,ct[(bar/2)%ct.length],profile),time,runtime.vel?.(.045)||.045,d);
  if(s===8&&bar%4===1&&state.stage>=4)runtime.hookInst?.(inst,hookPitch(inst,ct[(bar+1)%ct.length],profile),time,runtime.vel?.(.03)||.03,d);
  if(state.visitors.length&&s%4===2&&Math.random()<.25){const v=state.visitors[Math.floor(Math.random()*state.visitors.length)];runtime.hookInst?.(inst,hookPitch(inst,ct[Math.floor(Math.random()*ct.length)],profile),time,.015,d);setTimeout(()=>{v.lit=1;},Math.max(0,(time-runtime.ac.currentTime)*1000));}
 }
 // Giro: el filtro baja y vuelve a abrir en dos compases (se oye que algo cambió).
 function sweep(){const fx=runtime.fx,ac=runtime.ac;if(!fx||!ac)return;const t=ac.currentTime,f=fx.lp.frequency;f.cancelScheduledValues(t);f.setValueAtTime(Math.max(200,f.value),t);f.exponentialRampToValueAtTime(420,t+runtime.SIX*16);f.exponentialRampToValueAtTime(20000,t+runtime.SIX*32);}
 function colorPulse(hue,amount=1){state.pulseHue=hue;state.pulse=Math.min(1.2,state.pulse+amount);}
 // ---------- atmósfera de color (fondo) ----------
 function drawAtmosphere(t){
  if(!surface())return;const d=runtime.MU.dnaT;if(!d)return;const c=runtime.cx,W=runtime.W,H=runtime.H;
  const base=.05+state.bloom*.16,hues=[d.hue,(d.hue+40)%360,(d.hue+200)%360];
  c.save();
  hues.forEach((h,i)=>{const [H0,S0,L0]=swatchOf(h),x=((Math.sin(t/23000+i*2.1)*.5+.5)*W*1.4-W*.2-(runtime.camX*.02*(i+1))%W),y=((Math.cos(t/31000+i*1.3)*.5+.5)*H*1.2-H*.1),R=Math.max(W,H)*(.45+i*.12);
   const g=c.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,`hsla(${H0},${S0}%,${Math.min(70,L0)}%,${base*(i===2?.5:1)})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);});
  if(state.pulse>0){const [H1,S1,L1]=swatchOf(state.pulseHue),g=c.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*.8);g.addColorStop(0,`hsla(${H1},${S1}%,${Math.min(70,L1)}%,${state.pulse*.22})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);}
  // Zonas experimentales: interferencias de color muy sutiles.
  const x=runtime.experimentalLevel?.()||0;if(x>.3){for(let i=0;i<Math.round(x*6);i++){if(Math.random()>.35)continue;const [H2,S2]=swatchOf(d.hue+i*60);c.globalAlpha=.05+x*.08;c.fillStyle=`hsl(${H2},${S2}%,60%)`;c.fillRect(Math.random()*W,Math.random()*H,20+Math.random()*120,1+Math.random()*2);}}
  c.restore();
 }
 // ---------- quietud (alrededor del cubo) ----------
 function draw(){
  if(!surface()||state.seconds<3)return;const c=runtime.cx,cx=runtime.W/2,cy=runtime.H/2,next=QUIET_STAGES[state.stage+1];
  c.save();
  if(next){const prev=QUIET_STAGES[state.stage].at,f=Math.min(1,(state.seconds-prev)/(next.at-prev));c.globalAlpha=.22;c.strokeStyle=runtime.GOLD;c.lineWidth=1;c.beginPath();c.arc(cx,cy,26,-Math.PI/2,-Math.PI/2+TAU*f);c.stroke();}
  for(const v of state.visitors){const [H0,S0,L0]=swatchOf(v.hue),x=cx+Math.cos(v.a)*v.r,y=cy+Math.sin(v.a)*v.r*.7;c.globalAlpha=.45+v.lit*.5;c.fillStyle=`hsl(${H0},${S0}%,${L0}%)`;c.beginPath();c.arc(x,y,2+v.lit*3,0,TAU);c.fill();if(v.lit>.2){c.globalAlpha=v.lit*.2;c.beginPath();c.arc(x,y,12,0,TAU);c.fill();}}
  c.restore();
 }
 function preview(seconds){ensureOwner();if(!runtime.labMode)return;reset();state.anchor={x:S().wx,y:S().wy};state.key=runtime.MU.dnaT?.key;state.seconds=seconds;for(let i=1;i<=quietStage(seconds);i++)enterStage(i);}
 Object.defineProperties(runtime,{quietReset:{get:()=>reset},quietPreview:{get:()=>preview},quietState:{get:()=>state},quietTick:{get:()=>tick},quietStep:{get:()=>step},drawQuietud:{get:()=>draw},drawAtmosphere:{get:()=>drawAtmosphere},colorPulse:{get:()=>colorPulse}});
}
