import {musicalCharacter,inRegister} from './musical-character.js';
import {elementInk,WORLD_VISUAL} from './visual.js';
// Hitos y horizonte sonoro. Un hito grande primero se OYE (apagado y desde su dirección),
// luego se INTUYE (brillo en el borde de la pantalla) y por último se VE.
// Posiciones fijas por semilla, iguales para todos. Sin flechas ni brújula.

export const LANDMARK_TYPES={
 torre:{name:'Torre de luz',sea:false},
 arbol:{name:'Árbol madre',sea:false},
 ciudad:{name:'Ciudad de formas',sea:false},
 monolito:{name:'Monolito',sea:false},
 faro:{name:'Faro',sea:true}
};
export const HEAR=11000,SENSE=5500,MAX_AUDIBLE=2;
const LAND_P=1/10,SEA_P=1/6;   // escasos: un hito tiene que ser un acontecimiento

// Hito de una región (o null). Puro: depende solo de la semilla y del mar/tierra de la región.
export function landmarkIn(rx,ry,regionPx,isSea,seedOf,rng){
 if(rx===0&&ry===0)return null;
 const r=rng(seedOf(`landmark:v1:${rx},${ry}`)),forced=rx===2&&ry===0;   // uno se oye ya desde el Origen
 const sea=isSea(rx,ry);if(!forced&&r()>=(sea?SEA_P:LAND_P))return null;
 const land=['torre','arbol','ciudad','monolito'],type=forced?'torre':sea?'faro':land[Math.floor(r()*land.length)];
 const x=(rx+.2+.6*r())*regionPx,y=(ry+.2+.6*r())*regionPx;
 const motif=Array.from({length:3+Math.floor(r()*2)},()=>Math.floor(r()*4));
 const pool=[3,4,6,8,10,11,12,14];for(let i=pool.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 const steps=[0,...pool.slice(0,motif.length-1)].sort((a,b)=>a-b);
 return {id:`lm:${rx},${ry}`,type,rx,ry,x,y,hue:Math.floor(r()*360),motif,steps,phase:Math.floor(r()*4),size:.8+r()*.5};
}

export function initialize(runtime){
 const cache=new Map(),RPX=()=>runtime.REG*runtime.WCH;
 const isSea=(rx,ry)=>runtime.continents.at(rx,ry).sea;
 function inRegion(rx,ry){const k=rx+','+ry;if(cache.has(k))return cache.get(k);
  const lm=landmarkIn(rx,ry,RPX(),isSea,runtime.seedOf,runtime.rng);
  if(lm){const reg=runtime.regionOfPos(lm.x,lm.y);lm.name=`${LANDMARK_TYPES[lm.type].name} de ${reg.name}`;lm.lit=0;}
  if(cache.size>4000)cache.clear();cache.set(k,lm);return lm;}
 function nearby(x,y,radius=HEAR){
  const rp=RPX(),cx=Math.floor(x/rp),cy=Math.floor(y/rp),n=Math.ceil(radius/rp),out=[];
  for(let i=cx-n;i<=cx+n;i++)for(let j=cy-n;j<=cy+n;j++){const lm=inRegion(i,j);if(!lm)continue;const d=Math.hypot(lm.x-x,lm.y-y);if(d<=radius)out.push([d,lm]);}
  return out.sort((a,b)=>a[0]-b[0]).map(([d,lm])=>({...lm,d,ref:lm}));
 }

 // Se llama al inicio de cada compás en el Mundo. Máximo dos hitos suenan, cada uno cada dos compases.
 function horizonBar(t,bar){
  const ac=runtime.ac;if(!ac||!runtime.S.sound)return;
  const list=nearby(runtime.S.wx,runtime.S.wy).slice(0,MAX_AUDIBLE);
  for(const lm of list){
   if((bar+lm.phase)%4||lm.d<160)continue;   // cada cuatro compases; al llegar ya no suena de lejos
   {const S=runtime.S,h=(S.heardLm||={});if(!h[lm.id]&&!S.landmarks?.[lm.id]&&Object.keys(h).length<600)h[lm.id]=[lm.rx,lm.ry,lm.type];}   // el mapa recuerda lo que oíste
   const near=1-lm.d/HEAR,ct=runtime.chordTones(),six=runtime.SIX;
   const gain=.075*Math.pow(near,1.5),cut=450+6500*near*near,pan=Math.max(-1,Math.min(1,(lm.x-runtime.S.wx)/2600));
   lm.motif.forEach((deg,i)=>{const at=t+lm.steps[i]*six,midi=ct[deg%ct.length]+(lm.type==='monolito'?-12:lm.type==='faro'||lm.type==='torre'?12:0);
    const profile=musicalCharacter(runtime.MU.dnaA?.genre||runtime.regionOfPos(runtime.S.wx,runtime.S.wy).genre);
    voice(lm.type,inRegister(midi,lm.type==='monolito'?36:profile.low,lm.type==='monolito'?55:profile.high),at,gain*(i?0.8:1),cut,pan);
    setTimeout(()=>{lm.ref.lit=1;},Math.max(0,(at-ac.currentTime)*1000));});
  }
 }
 // Timbre propio por tipo de hito; cadena aparte con filtro (lejanía) y paneo (dirección).
 function voice(type,midi,t,v,cut,pan){
  const ac=runtime.ac,hz=runtime.hz(midi),f=ac.createBiquadFilter(),g=ac.createGain();
  f.type='lowpass';f.frequency.value=cut;
  const partials={torre:[[1,'sine',1],[2.76,'sine',.35],[5.4,'sine',.12]],faro:[[1,'sine',1],[3.01,'sine',.25]],arbol:[[1,'triangle',1],[2,'sine',.3]],ciudad:[[1,'sine',1],[4,'sine',.2]],monolito:[[1,'sine',1],[1.5,'sine',.3]]}[type];
  const dec={torre:2.2,faro:2.6,arbol:1.2,ciudad:.45,monolito:2.8}[type];
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+(type==='monolito'?.25:.008));g.gain.exponentialRampToValueAtTime(.0001,t+dec);
  partials.forEach(([m,wave,a])=>{const o=ac.createOscillator(),og=ac.createGain();o.type=wave;o.frequency.value=hz*m;og.gain.value=a;o.connect(og).connect(f);o.start(t);o.stop(t+dec+.1);});
  let out=f.connect(g);
  if(ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=pan;out=out.connect(p);}
  out.connect(runtime.bus);if(runtime.verbIn){const s=ac.createGain();s.gain.value=.45;out.connect(s).connect(runtime.verbIn);}
 }

 // Dibujo: silueta enorme si está en pantalla; brillo en el borde si solo se intuye.
 function drawLandmarks(t,dt,ox,oy){
  const cx=runtime.cx,W=runtime.W,H=runtime.H,S=runtime.S;
  for(const lm of nearby(S.wx,S.wy,SENSE)){
   const ref=lm.ref;ref.lit=Math.max(0,(ref.lit||0)-dt*1.6);
   const sx=lm.x+ox,sy=lm.y+oy,on=sx>-260&&sx<W+260&&sy>-120&&sy<H+420,col=elementInk(lm.type==='arbol'?'wood':'glass',lm.hue),near=1-lm.d/SENSE;
   if(on)shape(cx,lm,sx,sy,t,Math.min(1,.25+near*.9),col,ref.lit);
   else{const a=Math.atan2(lm.y-S.wy,lm.x-S.wx),ex=W/2+Math.cos(a)*W*.48,ey=H/2+Math.sin(a)*H*.48;
    const g=cx.createRadialGradient(ex,ey,0,ex,ey,150);g.addColorStop(0,`hsla(${lm.hue},70%,70%,${(.16+ref.lit*.22)*(.35+.65*near)})`);g.addColorStop(1,'rgba(0,0,0,0)');
    cx.globalAlpha=1;cx.fillStyle=g;cx.fillRect(ex-150,ey-150,300,300);}
   if(lm.d<170&&!S.landmarks?.[lm.id])reach(lm);
  }
  cx.globalAlpha=1;
 }
 function shape(cx,lm,x,y,t,al,col,lit){
  const s=lm.size;cx.save();cx.strokeStyle=col;cx.fillStyle=col;
  switch(lm.type){
   case 'torre':{const h=280*s;const g=cx.createLinearGradient(x,y-h,x,y);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,col);
    cx.globalAlpha=al*(.55+lit*.45);cx.fillStyle=g;cx.fillRect(x-7,y-h,14,h);cx.globalAlpha=al*(.2+lit*.3);cx.fillRect(x-16,y-h,32,h);cx.globalAlpha=al;cx.fillStyle=col;cx.fillRect(x-10,y-8,20,8);
    cx.globalAlpha=al*(.15+lit*.3);cx.beginPath();cx.arc(x,y-h*.9,18+lit*16,0,6.283);cx.fill();break;}
   case 'arbol':{cx.globalAlpha=al*.8;cx.lineWidth=5*s;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x,y-110*s);cx.stroke();
    for(let i=0;i<7;i++){const a=i/7*6.283+Math.sin(t/3000)*.05,r=55*s,px=x+Math.cos(a)*r*.9,py=y-130*s+Math.sin(a)*r*.6;cx.globalAlpha=al*(.18+lit*.25);cx.beginPath();cx.arc(px,py,34*s,0,6.283);cx.fill();}break;}
   case 'ciudad':{for(let i=0;i<26;i++){const a=i*2.4,r=24+i*5.5,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r*.6,w=6+(i%4)*3;cx.globalAlpha=al*(.45+((i+Math.floor(t/400))%5===0?lit*.5:0));cx.strokeRect(px-w/2,py-w,w,w);}
    cx.globalAlpha=al*.6;cx.fillRect(x-3,y-3,6,6);break;}
   case 'monolito':{cx.globalAlpha=al;cx.fillStyle='#000';cx.fillRect(x-18*s,y-170*s,36*s,170*s);cx.lineWidth=WORLD_VISUAL.line;cx.strokeStyle=runtime.GOLD;cx.globalAlpha=al*(.5+lit*.5);cx.strokeRect(x-18*s,y-170*s,36*s,170*s);break;}
   case 'faro':{cx.globalAlpha=al;cx.fillRect(x-5,y-60,10,60);const a=t/1400;cx.globalAlpha=al*(.12+lit*.2);cx.beginPath();cx.moveTo(x,y-58);cx.arc(x,y-58,420,a-.12,a+.12);cx.closePath();cx.fill();break;}
  }
  cx.restore();
  if(lm.d<420){cx.globalAlpha=Math.min(1,(420-lm.d)/200);cx.fillStyle=col;cx.font='10px monospace';cx.textAlign='center';cx.fillText(lm.name,x,y+22);cx.globalAlpha=1;}
 }
 function reach(lm){
  const S=runtime.S;S.landmarks||={};S.landmarks[lm.id]=S.todayKey;S.landmarksN=(S.landmarksN||0)+1;
  runtime.toast(`<em>Hito</em> · ${lm.name}`);if(S.landmarksN===1)runtime.say(runtime.VOZ.hito);
  runtime.unlock('hito1');if(S.landmarksN>=10)runtime.unlock('hito10');runtime.save();
 }

 Object.defineProperties(runtime,{
  nearbyLandmarks:{get:()=>nearby},landmarkAt:{get:()=>inRegion},horizonBar:{get:()=>horizonBar},drawLandmarks:{get:()=>drawLandmarks}
 });
}
