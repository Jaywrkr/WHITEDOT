// Vida del mundo en el tiempo real: tormentas que se desplazan (y se pueden perseguir),
// estaciones semanales por continente y huellas que el mundo recuerda.
// Todo depende del reloj real y de la semilla: es igual para todos los jugadores.
import {valueNoise} from './continents.js';

// ---------- tormentas ----------
const STORM_CELL=12,STORM_SLOT=40*60*1000,STORM_P=.38,STORM_TRAVEL=18;   // regiones, ms, prob., regiones recorridas por ventana
function hash(a,b,c){let h=Math.imul(a|0,374761393)^Math.imul(b|0,668265263)^Math.imul(c|0,1274126177);h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296;}
// Viento del día: todas las tormentas viajan en la misma dirección durante un día.
export function windOf(now){const day=Math.floor(now/864e5),a=hash(day,7,3)*Math.PI*2;return [Math.cos(a),Math.sin(a)];}
// Tormentas activas cerca de (u,v) en regiones, en el instante now (ms).
export function stormsNear(u,v,now){
 const out=[],slot=Math.floor(now/STORM_SLOT),k=(now%STORM_SLOT)/STORM_SLOT,[wx,wy]=windOf(now),ci=Math.floor(u/STORM_CELL),cj=Math.floor(v/STORM_CELL);
 for(let s=slot-1;s<=slot;s++)for(let i=ci-2;i<=ci+2;i++)for(let j=cj-2;j<=cj+2;j++){
  if(hash(i*31+s,j,11)>=STORM_P)continue;
  const t=(s===slot?k:k+1)/2;if(t>1)continue;               // cada tormenta vive dos ventanas (80 min)
  const sx=(i+hash(i,j,s+5))*STORM_CELL-wx*STORM_TRAVEL*.5+wx*STORM_TRAVEL*t,sy=(j+hash(j,i,s+9))*STORM_CELL-wy*STORM_TRAVEL*.5+wy*STORM_TRAVEL*t;
  const life=Math.sin(Math.PI*t),r=(.9+.8*hash(i,j,s+13))*(.4+.6*life);
  out.push({id:`${i},${j},${s}`,x:sx,y:sy,r,life,d:Math.hypot(u-sx,v-sy)});
 }
 return out.sort((a,b)=>a.d-b.d);
}
// Intensidad de tormenta (0..1) en un punto.
export function stormAt(u,v,now){const s=stormsNear(u,v,now)[0];if(!s||s.d>s.r)return {i:0,storm:s||null};return {i:Math.min(1,(1-s.d/s.r)*1.6)*s.life,storm:s};}

// ---------- estaciones ----------
export const SEASONS=[
 {id:'primavera',name:'Primavera',bpm:1,bright:1,particle:'polen'},
 {id:'verano',name:'Verano',bpm:3,bright:1.1,particle:'brillo'},
 {id:'otono',name:'Otoño',bpm:-1,bright:.85,particle:'hojas'},
 {id:'invierno',name:'Invierno',bpm:-4,bright:.7,particle:'nieve'}
];
// Cada continente cambia de estación cada semana real, desfasado del resto.
export function seasonOf(continentId,now){
 const week=Math.floor((now/864e5+3)/7);let h=0;for(const c of String(continentId||'0'))h=(h*31+c.charCodeAt(0))>>>0;
 return SEASONS[(week+h)%4];
}

export function initialize(runtime){
 const RP=()=>runtime.REG*runtime.WCH,S=()=>runtime.S;
 const weather={i:0,storm:null,near:null,seen:{},lastThunder:0,parts:[]};

 function step(dt){
  const s=S(),u=s.wx/RP(),v=s.wy/RP(),now=Date.now(),w=stormAt(u,v,now),MU=runtime.MU;
  weather.i+=(w.i-weather.i)*Math.min(1,dt*.7);weather.storm=w.storm;MU.storm=weather.i;
  weather.near=stormsNear(u,v,now).find(q=>q.d<q.r+2.5)||null;
  if(weather.i>.4&&w.storm&&!weather.seen[w.storm.id]){weather.seen[w.storm.id]=1;s.storms=(s.storms||0)+1;
   if(!s.help.tormenta){s.help.tormenta=true;runtime.say(runtime.VOZ.tormenta,'Tormenta');}if(s.storms>=3)runtime.unlock('tormenta3');runtime.save();}
  // Estación del continente actual.
  const d=MU.dnaT,se=d&&!d.sea&&d.continent?seasonOf(d.continent.id,now):null;MU.season=se;MU.seasonBpm=se?se.bpm:0;
  // Huellas: un punto cada 160 px recorridos en el Mundo, hasta 4000.
  const steps=(s.steps||=[]),last=steps[steps.length-1];
  if(!last||Math.hypot(last[0]-s.wx,last[1]-s.wy)>160){steps.push([Math.round(s.wx),Math.round(s.wy)]);if(steps.length>4000)steps.splice(0,steps.length-4000);}
 }
 // Truenos lejanos cuando una tormenta está cerca; más cerca, más fuertes.
 function stormBar(t){
  if(!runtime.S.sound||!weather.near)return;const near=Math.max(0,1-Math.max(0,weather.near.d-weather.near.r)/2.5);
  if(Math.random()<.18+near*.3){runtime.thunder(t+runtime.SIX*Math.floor(Math.random()*8));weather.flash=near;}
 }
 function draw(t,dt,ox,oy,layer){
  const cx=runtime.cx,W=runtime.W,H=runtime.H,s=S();
  if(layer==='ground'){drawMemory(cx,W,H,s,ox,oy);return;}
  // Tormenta cerca pero fuera: masa oscura en el borde, en su dirección, con relámpagos.
  const n=weather.near;
  if(n&&weather.i<.05){const a=Math.atan2(n.y*RP()-s.wy,n.x*RP()-s.wx),ex=W/2+Math.cos(a)*W*.5,ey=H/2+Math.sin(a)*H*.5,k=Math.max(0,1-Math.max(0,n.d-n.r)/2.5);
   const g=cx.createRadialGradient(ex,ey,0,ex,ey,260);g.addColorStop(0,`rgba(120,130,160,${.18*k+(weather.flash||0)*.25})`);g.addColorStop(1,'rgba(0,0,0,0)');cx.globalAlpha=1;cx.fillStyle=g;cx.fillRect(ex-260,ey-260,520,520);}
  // Dentro: cielo más oscuro y relámpagos.
  if(weather.i>.05){cx.globalAlpha=weather.i*.28;cx.fillStyle='#05060a';cx.fillRect(0,0,W,H);
   // Cortina de lluvia inclinada con el viento.
   const [wx]=windOf(Date.now()),n=Math.round(40+90*weather.i);cx.strokeStyle='#9fb4d8';cx.lineWidth=1;cx.globalAlpha=.18+.22*weather.i;cx.beginPath();
   for(let k=0;k<n;k++){const sx=((k*97.3+t*.9*(1+k%3))%(W+80))-40,sy=((k*57.1+t*1.4*(1+k%2))%(H+60))-30;cx.moveTo(sx,sy);cx.lineTo(sx-wx*6,sy+14);}cx.stroke();
   if((weather.flash||0)>.05){cx.globalAlpha=weather.flash*.22*weather.i;cx.fillStyle='#dfe8ff';cx.fillRect(0,0,W,H);}}
  weather.flash=Math.max(0,(weather.flash||0)-dt*3);
  // Partículas de la estación (pocas, en pantalla).
  const se=runtime.MU.season;
  if(se&&!runtime.MU.dnaT?.sea){const P=weather.parts;while(P.length<26)P.push({x:Math.random()*W,y:Math.random()*H,v:.5+Math.random(),p:Math.random()*6});
   for(const q of P){q.y+=(se.particle==='nieve'?22:se.particle==='hojas'?30:se.particle==='polen'?-6:0)*q.v*dt;q.x+=Math.sin(t/1400+q.p)*(se.particle==='hojas'?24:8)*dt;
    if(q.y>H+5)q.y=-5;if(q.y<-5)q.y=H+5;if(q.x<-5)q.x=W+5;if(q.x>W+5)q.x=-5;
    cx.globalAlpha=se.particle==='brillo'?.12+.12*Math.sin(t/300+q.p):.35;
    cx.fillStyle=se.particle==='nieve'?'#f2f6ff':se.particle==='hojas'?'#d98a3a':se.particle==='polen'?'#e8e27a':'#fff6c8';
    cx.fillRect(q.x,q.y,se.particle==='hojas'?3:2,se.particle==='hojas'?2:2);}}
  cx.globalAlpha=1;
 }
 // Huellas: el mundo recuerda por dónde pasaste. Estudios antiguos como casas apagadas.
 function drawMemory(cx,W,H,s,ox,oy){
  cx.fillStyle='#fff';
  for(const [x,y] of s.steps||[]){const px=x+ox,py=y+oy;if(px<-10||py<-10||px>W+10||py>H+10)continue;cx.globalAlpha=.1;cx.fillRect(px-1,py-1,2,2);}
  for(const c of s.camps||[]){const px=c[0]+ox,py=c[1]+oy;if(px<-30||py<-30||px>W+30||py>H+30)continue;cx.globalAlpha=.35;cx.strokeStyle=runtime.GOLD;cx.lineWidth=1;cx.beginPath();cx.moveTo(px-8,py);cx.lineTo(px,py-8);cx.lineTo(px+8,py);cx.lineTo(px+8,py+8);cx.lineTo(px-8,py+8);cx.closePath();cx.stroke();}
  cx.globalAlpha=1;
 }
 Object.defineProperties(runtime,{
  aliveStep:{get:()=>step},seasonOf:{get:()=>id=>seasonOf(id,Date.now())},stormBar:{get:()=>stormBar},drawAlive:{get:()=>draw},weather:{get:()=>weather}
 });
}
