import {WORLD_VISUAL} from './visual.js';
// Capas del mundo: el Subsuelo (1 paso abajo = 8 arriba: atajo para viajar lejos, con graves y dub)
// y el Cielo (vista del continente desde arriba, para elegir dónde bajar).
// Se entra con un ritual: tocar el ritmo correcto con pulsos en el beat junto a un portal.
import {valueNoise} from './continents.js';
import {landmarkIn} from './landmarks.js';
import {pickRange} from './genre-tempo.js';

export const UNDER_SCALE=8,SKY_SCALE=60,UNDER_CELL=1400;
const UNDER_GENRES=['dub','heart','dubstep','berlin','minimaltechno'];

// Portales en la superficie: grietas al Subsuelo (1 de cada 14 regiones de tierra) y escaleras
// de luz al Cielo al pie de cada torre de luz.
export function portalsIn(rx,ry,regionPx,isSea,seedOf,rng){
 const out=[];if(Math.max(Math.abs(rx),Math.abs(ry))<1||isSea(rx,ry))return out;
 const r=rng(seedOf(`portal:v1:${rx},${ry}`));
 if(r()<1/14||(rx===1&&ry===1))out.push({id:`grieta:${rx},${ry}`,kind:'grieta',x:(rx+.25+.5*r())*regionPx,y:(ry+.25+.5*r())*regionPx,need:3+Math.floor(r()*3)});
 const lm=landmarkIn(rx,ry,regionPx,isSea,seedOf,rng);
 if(lm&&lm.type==='torre')out.push({id:`escalera:${rx},${ry}`,kind:'escalera',x:lm.x+60,y:lm.y+20,need:4});
 return out;
}
// Salidas del Subsuelo: una por celda (con algo de azar), solo donde arriba hay tierra.
export function exitIn(i,j,isSeaPx,seedOf,rng){
 const r=rng(seedOf(`salida:v1:${i},${j}`));if(r()>.55)return null;
 const x=(i+.2+.6*r())*UNDER_CELL,y=(j+.2+.6*r())*UNDER_CELL;
 return isSeaPx(x*UNDER_SCALE,y*UNDER_SCALE)?null:{id:`salida:${i},${j}`,x,y};
}

export function initialize(runtime){
 const RP=()=>runtime.REG*runtime.WCH,isSea=(rx,ry)=>runtime.continents.at(rx,ry).sea,isSeaPx=(x,y)=>isSea(Math.floor(x/RP()),Math.floor(y/RP()));
 const S=()=>runtime.S,layer=()=>S().layer||'superficie';
 const ritual={id:null,count:0,need:0,shown:0};let dnaKey=null,trip=null;

 function nearPortals(){const s=S(),rx=Math.floor(s.wx/RP()),ry=Math.floor(s.wy/RP()),out=[];
  for(let i=rx-1;i<=rx+1;i++)for(let j=ry-1;j<=ry+1;j++)out.push(...portalsIn(i,j,RP(),isSea,runtime.seedOf,runtime.rng));
  return out.map(p=>({...p,d:Math.hypot(p.x-s.wx,p.y-s.wy)})).sort((a,b)=>a.d-b.d);}

 // Pulso junto a un portal: cuenta pulsos seguidos en el beat. Fuera de tiempo, vuelve a cero.
 function portalPulse(onBeat){
  if(layer()!=='superficie')return;const p=nearPortals()[0];if(!p||p.d>150)return;
  if(ritual.id!==p.id){ritual.id=p.id;ritual.count=0;ritual.need=p.need;}
  ritual.count=onBeat?ritual.count+1:0;
  if(!onBeat)runtime.toast('<em>Ritual</em> · fuera de tiempo. Otra vez, en el beat');
  if(ritual.count>=ritual.need){ritual.count=0;ritual.id=null;enter(p.kind==='grieta'?'bajo':'cielo');}
 }
 function clearSurfaceSources(){const m=runtime.MU;m.near=[];m.singers=[];m.q8=[];m.queue=[];runtime.waves=[];runtime.inPond=false;if(runtime.mfilt&&runtime.ac)runtime.mfilt.frequency.setTargetAtTime(18000,runtime.ac.currentTime,.2);runtime.cancelLoopRecording?.();}
 function enter(to){
  clearSurfaceSources();
  const s=S();s.layer=to;runtime.flash=1;runtime.MU.E=Math.max(runtime.MU.E,.6);dnaKey=null;
  if(to==='bajo'){s.under={x:s.wx/UNDER_SCALE,y:s.wy/UNDER_SCALE};trip={x:s.wx,y:s.wy};
   runtime.soon?.(q=>{runtime.kick(q,runtime.vel(.4));runtime.softBass(runtime.root()-12,q,runtime.vel(.2));});
   runtime.say(runtime.VOZ.bajo,'Subsuelo');runtime.unlock('bajo1');}
  else{runtime.soon?.(q=>runtime.chordTones().forEach((n,i)=>runtime.pluck(n+24,q+i*runtime.SIX,runtime.vel(.05),4)));
   runtime.say(runtime.VOZ.cielo,'Cielo');runtime.unlock('cielo1');}
  runtime.MU.layer=to;runtime.save();
 }
 function surface(x,y,msg){
  clearSurfaceSources();
  const s=S();s.layer='superficie';s.wx=x;s.wy=y;runtime.MU.layer='superficie';runtime.flash=.8;dnaKey=null;runtime.curRegion=null;runtime.resetContinent?.();
  if(trip){const far=Math.hypot(x-trip.x,y-trip.y)/RP();if(far>=40)runtime.unlock('atajo');trip=null;}
  runtime.soon?.(q=>runtime.chordTones().forEach((n,i)=>runtime.pluck(n+12,q+i*runtime.SIX*2,runtime.vel(.06),2)));
  if(msg)runtime.toast(msg);runtime.save();
 }
 // En el Cielo, un toque baja en el punto de abajo (si es tierra).
 function layerPulse(){
  const s=S();if(layer()==='cielo'&&runtime.cubeShopGlide?.())return;
  if(layer()==='cielo'){if(isSeaPx(s.wx,s.wy)){runtime.toast('<em>Cielo</em> · abajo hay mar. Busca tierra para bajar');return;}surface(s.wx,s.wy,'<em>Bajaste</em> · '+(runtime.regionOfPos(s.wx,s.wy).name));}
  else if(layer()==='bajo')runtime.toast('<em>Subsuelo</em> · busca una columna de luz para salir');
 }
 // Música de la capa: una región sintética (no se registra como lugar visitado).
 function layerDNA(){
  const s=S(),base=runtime.regionOfPos(s.wx,s.wy);let key,d;
  if(layer()==='bajo'){if(!s.under)s.under={x:s.wx/UNDER_SCALE,y:s.wy/UNDER_SCALE};const i=Math.floor(s.under.x/UNDER_CELL),j=Math.floor(s.under.y/UNDER_CELL),r=runtime.rng(runtime.seedOf(`subsuelo:${i},${j}`)),g=UNDER_GENRES[Math.floor(r()*UNDER_GENRES.length)],G=runtime.GEN[g];
   key=`bajo:${i},${j}`;d={...base,key,genre:g,bpm:Math.round(pickRange(g,G)[0]+r()*(pickRange(g,G)[1]-pickRange(g,G)[0])),name:'Subsuelo bajo '+base.name,z:runtime.BIOMES.findIndex(b=>b.id==='cueva'),track:{...base.track,bassI:G.bassI,hookI:G.hookP[0]},anomaly:null,sea:false,strange:0,tuneCents:0};}
  else{key=`cielo:${base.continent?.id||'mar'}`;const G=runtime.GEN.ambient;d={...base,key,genre:'ambient',bpm:G.bpm[0]+4,name:'Cielo sobre '+(base.continent?.name||'el mar'),z:runtime.BIOMES.findIndex(b=>b.id==='vacio'),track:{...base.track,bassI:G.bassI,hookI:G.hookP[0]},anomaly:null,sea:false};}
  d.recipe=runtime.recipeFor?.(d);
  if(key!==dnaKey||runtime.MU.dnaT?.key!==key){dnaKey=key;runtime.setBiome?.(d.z);runtime.MU.dnaT=d;runtime.MU.nb=null;runtime.MU.nbW=0;runtime.MU.anomaly=null;runtime.MU.river=0;runtime.MU.confNb=null;runtime.MU.storm=0;runtime.MU.season=null;runtime.MU.seasonBpm=0;runtime.MU.tune=0;runtime.MU.vit=.8;runtime.showRegion?.(d,false);}
  return runtime.MU.dnaT;
 }

 // Paso de juego en el Subsuelo o el Cielo (reemplaza al del Mundo en superficie).
 function layerStep(t,dt,dx,dy,b,paused,speed){
  const s=S(),cx=runtime.cx,W=runtime.W,H=runtime.H,L=layer(),ds=Math.min(runtime.pxSize(),22);
  if(L==='bajo'&&!s.under)s.under={x:s.wx/UNDER_SCALE,y:s.wy/UNDER_SCALE};runtime.MU.layer=L;runtime.MU.near=[];runtime.MU.singers=[];
  if(!paused&&!runtime.scanning)runtime.sessionTime(dt);
  if(L==='bajo'){
   if(dx||dy){s.under.x+=dx*speed*dt;s.under.y+=dy*speed*dt;runtime.recordWalk?.(Math.hypot(dx,dy)*speed*dt*UNDER_SCALE);}s.wx=s.under.x*UNDER_SCALE;s.wy=s.under.y*UNDER_SCALE;
   runtime.camX=s.under.x;runtime.camY=s.under.y;const ox=W/2-s.under.x,oy=H/2-s.under.y;layerDNA();
   // Cueva: vetas que brillan con el beat, gotas y columnas de luz que son salidas.
   cx.globalAlpha=1;cx.fillStyle=WORLD_VISUAL.background;cx.fillRect(0,0,W,H);
   const step=16,x0=Math.floor((s.under.x-W/2)/step)*step,y0=Math.floor((s.under.y-H/2)/step)*step;
   for(let x=x0;x<s.under.x+W/2+step;x+=step)for(let y=y0;y<s.under.y+H/2+step;y+=step){const n=valueNoise(x/260,y/260,131),m=valueNoise(x/170,y/170,139);
    if(Math.abs(n-.5)<.05){cx.globalAlpha=(.3+.45*b)*(1-Math.abs(n-.5)/.05);cx.fillStyle='#e0a85c';cx.fillRect(x+ox-1.5,y+oy-1.5,4,4);}        // vetas de oro que laten con el beat
    else if(Math.abs(m-.5)<.03){cx.globalAlpha=.22+.2*b;cx.fillStyle='#7fb7c9';cx.fillRect(x+ox-1,y+oy-1,3,3);}                              // vetas frías
    else if(valueNoise(x/40,y/40,137)>.9){cx.globalAlpha=.3;cx.fillStyle='#8a7a66';cx.fillRect(x+ox,y+oy,2,6);}}
   const ci=Math.floor(s.under.x/UNDER_CELL),cj=Math.floor(s.under.y/UNDER_CELL);let nearest=null;
   for(let i=ci-2;i<=ci+2;i++)for(let j=cj-2;j<=cj+2;j++){const e=exitIn(i,j,isSeaPx,runtime.seedOf,runtime.rng);if(!e)continue;const d=Math.hypot(e.x-s.under.x,e.y-s.under.y);if(!nearest||d<nearest.d)nearest={...e,d};
    const px=e.x+ox,py=e.y+oy;if(px<-60||px>W+60||py<-60||py>H+60)continue;const g=cx.createLinearGradient(px,py-140,px,py);g.addColorStop(0,'rgba(255,240,200,0)');g.addColorStop(1,'rgba(255,240,200,.55)');cx.globalAlpha=1;cx.fillStyle=g;cx.fillRect(px-10,py-140,20,140);cx.fillStyle='#fff3d1';cx.fillRect(px-4,py-4,8,8);}
   if(nearest&&nearest.d<40)surface(nearest.x*UNDER_SCALE,nearest.y*UNDER_SCALE,'<em>Saliste</em> · '+runtime.regionOfPos(nearest.x*UNDER_SCALE,nearest.y*UNDER_SCALE).name);
   else if(nearest&&nearest.d>W*.45){const a=Math.atan2(nearest.y-s.under.y,nearest.x-s.under.x),ex=W/2+Math.cos(a)*W*.45,ey=H/2+Math.sin(a)*H*.45,g=cx.createRadialGradient(ex,ey,0,ex,ey,120);g.addColorStop(0,'rgba(255,230,180,.16)');g.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g;cx.fillRect(ex-120,ey-120,240,240);}
  }else{
   if(dx||dy){s.wx+=dx*speed*6*dt;s.wy+=dy*speed*6*dt;runtime.recordWalk?.(Math.hypot(dx,dy)*speed*6*dt);}runtime.camX=s.wx;runtime.camY=s.wy;layerDNA();
   // Vista del continente: cada región es un cuadro; mares oscuros, tierra con el color del continente.
   cx.globalAlpha=1;cx.fillStyle=WORLD_VISUAL.background;cx.fillRect(0,0,W,H);
   const k=1/SKY_SCALE,rp=RP(),cell=rp*k,rx0=Math.floor((s.wx-W/2/k)/rp),ry0=Math.floor((s.wy-H/2/k)/rp),rx1=Math.ceil((s.wx+W/2/k)/rp),ry1=Math.ceil((s.wy+H/2/k)/rp),labels=new Map();
   for(let i=rx0;i<=rx1;i++)for(let j=ry0;j<=ry1;j++){const c=runtime.continents.at(i,j),px=W/2+(i*rp-s.wx)*k,py=H/2+(j*rp-s.wy)*k;
    if(c.sea){cx.globalAlpha=.25;cx.fillStyle='#24405a';cx.fillRect(px+cell/2-1,py+cell/2-1,2,2);continue;}
    const visited=!!s.places?.[i+','+j];cx.globalAlpha=visited?.55:.28;cx.fillStyle=`hsl(${c.continent.hue},45%,${visited?58:40}%)`;cx.strokeStyle=cx.fillStyle;cx.lineWidth=WORLD_VISUAL.line;cx.beginPath();
    for(const [di,dj,ax,ay,bx,by] of [[-1,0,0,0,0,cell],[1,0,cell,0,cell,cell],[0,-1,0,0,cell,0],[0,1,0,cell,cell,cell]]){const edge=runtime.continents.at(i+di,j+dj);if(edge.sea||edge.continent?.id!==c.continent.id){cx.moveTo(px+ax,py+ay);cx.lineTo(px+bx,py+by);}}cx.stroke();
    if(visited){cx.globalAlpha=.45;cx.fillRect(px+cell/2-1,py+cell/2-1,2,2);}
    const L2=labels.get(c.continent.id)||{n:0,x:0,y:0,name:c.continent.name,hue:c.continent.hue};L2.n++;L2.x+=px+cell/2;L2.y+=py+cell/2;labels.set(c.continent.id,L2);
    const lm=runtime.landmarkAt?.(i,j);if(lm){cx.globalAlpha=.9;cx.fillStyle='#fff';cx.fillRect(W/2+(lm.x-s.wx)*k-2,H/2+(lm.y-s.wy)*k-2,4,4);}}
   cx.textAlign='center';cx.font='12px "Geist Mono", monospace';for(const g of labels.values()){if(g.n<6)continue;cx.globalAlpha=.85;cx.fillStyle=`hsl(${g.hue},80%,82%)`;cx.fillText(g.name,g.x/g.n,g.y/g.n);}
   // Nubes que pasan.
   for(let q=0;q<7;q++){const x=((q*173+t*.012*(1+q%3)-s.wx*k*.4)%(W+300)+W+300)%(W+300)-150,y=((q*251-s.wy*k*.4)%(H+200)+H+200)%(H+200)-100;cx.globalAlpha=.06;cx.fillStyle='#fff';cx.beginPath();cx.ellipse(x,y,140,40,0,0,6.283);cx.fill();}
   cx.globalAlpha=.8;cx.fillStyle='#fff';cx.font='11px "Geist Mono", monospace';cx.fillText('Toca para bajar aquí',W/2,H/2+46);
  }
  cx.globalAlpha=1;if((runtime.hudT+=dt)>.5){runtime.hudT=0;runtime.hud();}
  return ds;
 }

 // En la superficie: el portal cercano muestra cuántos pulsos en el beat necesita.
 function drawPortals(t,ox,oy,b){
  if(layer()!=='superficie')return;const cx=runtime.cx;
  for(const p of nearPortals()){if(p.d>700)break;const x=p.x+ox,y=p.y+oy,al=Math.min(1,(700-p.d)/300),done=ritual.id===p.id?ritual.count:0;
   cx.globalAlpha=al;cx.strokeStyle=p.kind==='grieta'?'#d9a25a':'#cfe6ff';cx.lineWidth=WORLD_VISUAL.line;
   if(p.kind==='grieta'){cx.beginPath();cx.moveTo(x-22,y-4);cx.lineTo(x-8,y+3);cx.lineTo(x+2,y-5);cx.lineTo(x+12,y+4);cx.lineTo(x+24,y-2);cx.stroke();}
   else{for(let i=0;i<5;i++){cx.globalAlpha=al*(.25+.15*i);cx.strokeRect(x-10+i*2,y-12-i*14,20-i*4,8);}}
   for(let i=0;i<p.need;i++){const a=-Math.PI/2+i/p.need*6.283;cx.globalAlpha=al*(i<done?1:.3);cx.fillStyle=cx.strokeStyle;cx.beginPath();cx.arc(x+Math.cos(a)*34,y+Math.sin(a)*34,3+(i<done?b*2:0),0,6.283);cx.fill();}
   if(p.d<220){cx.globalAlpha=al;cx.fillStyle=cx.strokeStyle;cx.font='11px "Geist Mono", monospace';cx.textAlign='center';cx.fillText(`${p.kind==='grieta'?'Grieta al Subsuelo':'Escalera al Cielo'} · ${p.need} pulsos en el beat`,x,y+54);}}
  cx.globalAlpha=1;
 }

 Object.defineProperties(runtime,{
  layerStep:{get:()=>layerStep},portalPulse:{get:()=>portalPulse},layerPulse:{get:()=>layerPulse},drawPortals:{get:()=>drawPortals},
  activeLayerRegion:{get:()=>()=>layer()==='superficie'?null:layerDNA()},restoreLayerMusic:{get:()=>()=>{dnaKey=null;return layerDNA();}},
  nearPortals:{get:()=>nearPortals},enterLayer:{get:()=>enter},surfaceLayer:{get:()=>surface}
 });
}
