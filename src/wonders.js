import {musicalCharacter,hookPitch,hookInstruments} from './musical-character.js';
// Asombro: rarezas que rompen las reglas del mundo y ríos que funcionan como un set de DJ.
// Todo es determinista (igual para todos). Lo raro se anuncia con rumores, no se regala.
import {valueNoise} from './continents.js';

// ---------- rarezas ----------
export const TIERS={raro:{name:'Raro',p:1/250},legendario:{name:'Legendario',p:1/1200},mitico:{name:'Mítico',p:1/6000}};
export const ANOMALIES={
 invertida:{tier:'raro',name:'Gravedad invertida',rule:'Arriba es abajo. Izquierda es derecha.',rumor:'arriba es abajo',sample:'reverso'},
 canon:{tier:'raro',name:'Región en canon',rule:'Todo lo que suena vuelve a sonar, un tiempo después, una y otra vez.',rumor:'todo lo que tocas te responde en canon',sample:'canon'},
 frenesi:{tier:'raro',name:'Frenesí',rule:'El tempo va a una vez y media. Nadie sabe por qué.',rumor:'la música va demasiado rápido',sample:'frenesi'},
 detenido:{tier:'legendario',name:'El tiempo se detiene',rule:'Si te quedas quieto, la música se frena y el mundo espera.',rumor:'el tiempo se detiene si te quedas quieto',sample:'detenido'},
 espejo:{tier:'legendario',name:'Espejo del Origen',rule:'Un reflejo del lugar donde empezaste, con los colores al revés.',rumor:'hay un reflejo de tu Origen',sample:'espejo'},
 luna:{tier:'mitico',name:'Luna de oro',rule:'Todo es dorado y todas las capas suenan a la vez.',rumor:'todo es de oro',sample:'luna'}
};
const BY_TIER={raro:['invertida','canon','frenesi'],legendario:['detenido','espejo'],mitico:['luna']};

// Rareza de una región o null. Solo en tierra y a partir de 4 regiones del Origen.
export function anomalyAt(rx,ry,isSea,seedOf,rng){
 if(Math.max(Math.abs(rx),Math.abs(ry))<4||isSea(rx,ry))return null;
 const r=rng(seedOf(`anomaly:v1:${rx},${ry}`)),u=r();let tier=null;
 if(u<TIERS.mitico.p)tier='mitico';else if(u<TIERS.mitico.p+TIERS.legendario.p)tier='legendario';else if(u<TIERS.mitico.p+TIERS.legendario.p+TIERS.raro.p)tier='raro';
 if(!tier)return null;
 const list=BY_TIER[tier],type=list[Math.floor(r()*list.length)];
 return {type,tier,...ANOMALIES[type],key:`${rx},${ry}`};
}
// Cambios de ADN que hacen sentir la regla desde que entras.
export function applyAnomaly(d,origin){
 const a=d.anomaly;if(!a)return d;
 if(a.type==='frenesi')d.bpm=Math.min(178,Math.round(d.bpm*1.5));
 if(a.type==='espejo'&&origin){d.genre=origin.genre;d.scale=origin.scale.slice();d.bpm=origin.bpm;d.trOff=origin.trOff;d.track={...origin.track};
  const h=(origin.hue+180)%360;d.hue=h;d.pal={main:`hsl(${h},32%,74%)`,soft:`hsl(${h},22%,50%)`,acc:`hsl(${(h+28)%360},72%,70%)`,sand:`hsl(${(h+40)%360},35%,68%)`};}
 if(a.type==='luna')d.pal={main:'hsl(44,85%,70%)',soft:'hsl(40,55%,48%)',acc:'hsl(48,95%,72%)',sand:'hsl(42,60%,62%)'};
 return d;
}

// ---------- ríos ----------
// Un río es una curva de nivel de un campo de ruido: infinito, continuo y sin cuadrícula.
// Río abajo = donde baja la "altura" (otro campo). En el mar mueren.
const RIVER_SCALE=7,RIVER_WIDTH=.025;   // en regiones: ~90 px a cada lado, un río de ~180 px
// Dos familias de ríos (campos distintos) que sí se cruzan: donde se juntan hay una confluencia.
const FAMILIES=[{scale:RIVER_SCALE,salt:71,ox:.37,oy:.11},{scale:RIVER_SCALE*1.35,salt:97,ox:.71,oy:.53}];
function riverOf(F,u,v,e){
 const f=(a,b)=>valueNoise(a/F.scale+F.ox,b/F.scale+F.oy,F.salt);
 const n=f(u,v),gx=(f(u+e,v)-f(u-e,v))/(2*e),gy=(f(u,v+e)-f(u,v-e))/(2*e),g=Math.hypot(gx,gy)||1e-6;
 const dist=Math.abs(n-.5)/g;if(dist>RIVER_WIDTH*2.2||Math.abs(n-.5)>.006)return null;   // tope absoluto: en zonas planas no se vuelve un lago enorme
 return {dist,gx,gy,g};
}
export function riverAt(x,y,regionPx,isSeaPx){
 const u=x/regionPx,v=y/regionPx,e=.02,hits=FAMILIES.map(F=>riverOf(F,u,v,e)).filter(Boolean);
 if(!hits.length)return null;
 if(isSeaPx&&isSeaPx(x,y))return null;
 const h=(a,b)=>valueNoise(a/11,b/11,83),hu=h(u,v),hx=(h(u+e,v)-h(u-e,v))/(2*e),hy=(h(u,v+e)-h(u,v-e))/(2*e);
 // Dirección del agua: a lo largo del río (perpendicular al gradiente), hacia donde baja la altura.
 const flow=k=>{let fx=-k.gy/k.g,fy=k.gx/k.g;if(fx*hx+fy*hy>0){fx=-fx;fy=-fy;}return [fx,fy];};
 hits.sort((a,b)=>a.dist-b.dist);const [fx,fy]=flow(hits[0]),on=hits.filter(k=>k.dist<RIVER_WIDTH);
 const out={on:on.length>0,edge:hits[0].dist/RIVER_WIDTH,down:1-hu,fx,fy,conf:on.length>1};
 if(out.conf){const [ax,ay]=flow(on[1]);out.other=[ax,ay];}   // dirección del otro río, para saber de dónde viene su música
 return out;
}

export function initialize(runtime){
 const RP=()=>runtime.REG*runtime.WCH,isSea=(rx,ry)=>runtime.continents.at(rx,ry).sea,isSeaPx=(x,y)=>isSea(Math.floor(x/RP()),Math.floor(y/RP()));
 const at=(rx,ry)=>anomalyAt(rx,ry,isSea,runtime.seedOf,runtime.rng);

 // Al entrar a una región: activa su regla y, si es nueva, la registra y da su muestra única.
 function enterAnomaly(d){
  const a=d.anomaly,MU=runtime.MU,S=runtime.S;MU.anomaly=a?a.type:null;
  if(!a)return;
  runtime.collectRareCard?.('anomaly:'+a.type,{id:'anomaly:'+a.key,x:S.wx,y:S.wy}, {regionName:d.name,genre:d.genre});
  S.anomalies||={};const isNew=!S.anomalies[a.key];
  runtime.say(`${a.rule}${isNew?' Te llevas una muestra que no existe en ningún otro lado.':''}`,`${TIERS[a.tier].name} · ${a.name}`);
  if(!isNew)return;
  S.anomalies[a.key]={type:a.type,tier:a.tier,day:S.todayKey};S.anomaliesN=(S.anomaliesN||0)+1;
  S.bag[a.sample]=Math.min(9,(S.bag[a.sample]||0)+3);runtime.toast(`<em>Muestra única</em> · ${runtime.SAMPLES[a.sample]}`);
  runtime.unlock(a.tier==='raro'?'rareza1':a.tier==='legendario'?'leyenda1':'mito1');runtime.flash=Math.max(runtime.flash,.7);runtime.save();
 }

 // Rumores: la Voz apunta a la rareza no descubierta más cercana, con dirección y distancia aproximada.
 const DIRS=['al este','al sureste','al sur','al suroeste','al oeste','al noroeste','al norte','al noreste'];
 function nearestUnknown(maxRing=45){
  const rp=RP(),cx=Math.floor(runtime.S.wx/rp),cy=Math.floor(runtime.S.wy/rp),known=runtime.S.anomalies||{};
  for(let ring=1;ring<=maxRing;ring++)for(let i=-ring;i<=ring;i++)for(const [x,y] of [[cx+i,cy-ring],[cx+i,cy+ring],[cx-ring,cy+i],[cx+ring,cy+i]]){
   const a=at(x,y);if(a&&!known[a.key])return {...a,dx:x-cx,dy:y-cy,ring};}
  return null;
 }
 function rumor(force=false){
  const S=runtime.S,now=Date.now();if(!force&&now-(S.rumorAt||0)<180000)return null;
  const a=nearestUnknown();if(!a)return null;S.rumorAt=now;
  const ang=Math.atan2(a.dy,a.dx),dir=DIRS[(Math.round(ang/(Math.PI/4))+8)%8],far=a.ring<=6?'no muy lejos':`a unas ${Math.round(a.ring/5)*5||5} regiones`;
  const text=`Dicen que ${dir}, ${far}, ${a.rumor}. Yo no fui. Me dio flojera.`;
  runtime.say(text,'Rumor');return {text,...a};
 }

 // Ríos: dibujo (agua que corre río abajo) y música (la energía sube río abajo, gotas a tempo).
 const riverState={on:false,down:0,time:0};
 function drawRivers(t,ox,oy){
  const cx=runtime.cx,W=runtime.W,H=runtime.H,S=runtime.S,step=20,x0=Math.floor((S.wx-W/2)/step)*step,y0=Math.floor((S.wy-H/2)/step)*step;
  for(let x=x0;x<S.wx+W/2+step;x+=step)for(let y=y0;y<S.wy+H/2+step;y+=step){
   const j=Math.sin(x*12.9898+y*78.233)*43758.5453,jx=(j-Math.floor(j)-.5)*step,jy=((j*7)%1-.5)*step;   // sin aspecto de cuadrícula
   const r=riverAt(x+jx,y+jy,RP(),isSeaPx);if(!r||!r.on)continue;
   // Trazos que corren río abajo; más brillantes y rápidos donde la energía es mayor.
   const k=((t/(900-300*r.down)+(x*r.fx+y*r.fy)/140)%1+1)%1,px=x+jx+ox+r.fx*k*30,py=y+jy+oy+r.fy*k*30,a=(1-r.edge)*(.35+.4*r.down);
   cx.globalAlpha=a;cx.strokeStyle=`hsl(${195-40*r.down},75%,${62+15*r.down}%)`;cx.lineWidth=r.down>.6?2:1.5;
   cx.beginPath();cx.moveTo(px-r.fx*7,py-r.fy*7);cx.lineTo(px+r.fx*7,py+r.fy*7);cx.stroke();
  }
  cx.globalAlpha=1;
 }
 function riverStep(dt){
  const S=runtime.S,r=riverAt(S.wx,S.wy,RP(),isSeaPx),on=!!(r&&r.on);
  riverState.on=on;riverState.down=on?r.down:0;runtime.MU.river=on?r.down:0;
  // Confluencia: el otro río trae la música de río arriba; se mezcla como en una frontera.
  if(on&&r.conf){runtime.MU.confNb=runtime.regionOfPos(S.wx-r.other[0]*2*RP(),S.wy-r.other[1]*2*RP());
   if(!riverState.inConf){riverState.inConf=true;S.confluences=(S.confluences||0)+1;runtime.toast('<em>Confluencia</em> · dos ríos, dos músicas');runtime.unlock('confluencia');}}
  else{runtime.MU.confNb=null;riverState.inConf=false;}
  if(on){riverState.time+=dt;if(!S.help.rio){S.help.rio=true;runtime.say(runtime.VOZ.rio,'Río');}if(riverState.time>60)runtime.unlock('rio1');}
 }
 // Cada compás en un río: unas gotas descendentes a tempo; más río abajo, más gotas.
 function riverBar(t){
  if(!riverState.on||!runtime.S.sound||runtime.MU.radio?.melodyRest)return;
  const region=runtime.MU.dnaA||runtime.regionOfPos(runtime.S.wx,runtime.S.wy),profile=musicalCharacter(region.genre),g=runtime.GEN[region.genre];
  const instrument=runtime.MU.radio?.hookI||hookInstruments(region.genre,g)[0],ct=runtime.chordTones(),six=runtime.SIX,n=Math.min(3,1+Math.round(riverState.down*2));
  for(let i=0;i<n;i++)runtime.hookInst(instrument,hookPitch(instrument,ct[(n-i)%ct.length],profile),t+(i*2+1)*six,runtime.vel(.018+.012*riverState.down),region);
 }

 Object.defineProperties(runtime,{
  anomalyAt:{get:()=>at},enterAnomaly:{get:()=>enterAnomaly},rumor:{get:()=>rumor},
  drawRivers:{get:()=>drawRivers},riverStep:{get:()=>riverStep},riverBar:{get:()=>riverBar},riverAt:{get:()=>(x,y)=>riverAt(x,y,RP(),isSeaPx)}
 });
}
