// Mapa dibujado: solo muestra lo que viste. Las regiones visitadas se pintan con el color de su
// continente, los mares como puntos, los hitos a los que llegaste con su símbolo y los que solo
// oíste como "?". Todo lo demás queda negro: el mapa recuerda, no revela.

export function mapData(runtime){
 const S=runtime.S,RP=runtime.REG*runtime.WCH,cells=[];
 for(const key of Object.keys(S.places||{})){
  const [rx,ry]=key.split(',').map(Number);if(!Number.isFinite(rx)||!Number.isFinite(ry))continue;
  const d=runtime.regionOfPos((rx+.5)*RP,(ry+.5)*RP);
  cells.push({rx,ry,sea:!!d.sea,hue:d.continent?.hue??d.hue,cont:d.continent?.id||null,contName:d.continent?.name||null,strange:d.strange||0});
 }
 const reached=Object.keys(S.landmarks||{}).map(id=>{const [rx,ry]=id.slice(3).split(',').map(Number);const lm=runtime.landmarkAt?.(rx,ry);return lm?{...lm,reached:true}:null;}).filter(Boolean);
 const heard=Object.entries(S.heardLm||{}).filter(([id])=>!S.landmarks?.[id]).map(([id,[rx,ry,type]])=>({id,rx,ry,type}));
 const me=[Math.floor(S.wx/RP),Math.floor(S.wy/RP)],camp=S.studio?.x!=null?[S.studio.x/RP,S.studio.y/RP]:null;
 const continents=new Set(cells.filter(c=>c.cont&&!c.sea).map(c=>c.cont)).size;
 return {cells,reached,heard,me,pos:[S.wx/RP,S.wy/RP],camp,continents,record:S.maxRing||0,RP};
}

export function drawMap(runtime,x,X,Y,W,H,zoom){
 const m=mapData(runtime);let x0,y0,x1,y1;
 if(zoom==='cerca'){x0=m.pos[0]-7;x1=m.pos[0]+7;y0=m.pos[1]-7;y1=m.pos[1]+7;}
 else{x0=Math.min(-1,m.pos[0]-1);y0=Math.min(-1,m.pos[1]-1);x1=Math.max(2,m.pos[0]+2);y1=Math.max(2,m.pos[1]+2);
  for(const c of m.cells){x0=Math.min(x0,c.rx-1);y0=Math.min(y0,c.ry-1);x1=Math.max(x1,c.rx+2);y1=Math.max(y1,c.ry+2);}
  for(const h of m.heard){x0=Math.min(x0,h.rx-1);y0=Math.min(y0,h.ry-1);x1=Math.max(x1,h.rx+2);y1=Math.max(y1,h.ry+2);}
  const span=Math.max(x1-x0,y1-y0,12),cx=(x0+x1)/2,cy=(y0+y1)/2;x0=cx-span/2;x1=cx+span/2;y0=cy-span/2;y1=cy+span/2;}
 const s=Math.min(W/(x1-x0),H/(y1-y0)),ox=X+(W-(x1-x0)*s)/2-x0*s,oy=Y+(H-(y1-y0)*s)/2-y0*s,P=(a,b)=>[ox+a*s,oy+b*s];
 x.save();x.beginPath();x.rect(X,Y,W,H);x.clip();
 x.fillStyle='#000';x.fillRect(X,Y,W,H);
 const r2=runtime.rng(11);x.fillStyle='#fff';for(let i=0;i<120;i++){x.globalAlpha=.04+r2()*.1;x.fillRect(X+r2()*W,Y+r2()*H,1.5,1.5);}
 // Regiones visitadas.
 for(const c of m.cells){const [px,py]=P(c.rx,c.ry);
  if(c.sea){x.globalAlpha=.35;x.fillStyle='#7f97a8';const d=Math.max(1.5,s*.12);for(let i=1;i<3;i++)for(let j=1;j<3;j++)x.fillRect(px+s*i/3-d/2,py+s*j/3-d/2,d,d);continue;}
  x.globalAlpha=.55+.25*c.strange;x.fillStyle=`hsl(${c.hue},${Math.round(45+45*c.strange)}%,${Math.round(55+8*c.strange)}%)`;x.fillRect(px+.5,py+.5,Math.max(1,s-1),Math.max(1,s-1));}
 // Ríos que pasan por lo visitado (muestreo de 6×6 puntos por región).
 if(runtime.riverAt&&m.cells.length<900){x.fillStyle='#7fd3ff';const n=s>=8?8:5;
  for(const c of m.cells){if(c.sea)continue;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const q=runtime.riverAt((c.rx+(i+.5)/n)*m.RP,(c.ry+(j+.5)/n)*m.RP);if(q?.on){const [px,py]=P(c.rx+(i+.5)/n,c.ry+(j+.5)/n);x.globalAlpha=.85;x.fillRect(px-1,py-1,Math.max(2,s/n*.6),Math.max(2,s/n*.6));}}}}
 // Nombres de continentes en el centro de lo visitado.
 if(s>=5){const groups=new Map();for(const c of m.cells){if(!c.cont||c.sea)continue;const g=groups.get(c.cont)||{n:0,x:0,y:0,name:c.contName,hue:c.hue};g.n++;g.x+=c.rx+.5;g.y+=c.ry+.5;groups.set(c.cont,g);}
  x.textAlign='center';x.font=`${Math.round(Math.min(30,Math.max(20,s*.9)))}px "JetBrains Mono", monospace`;
  for(const g of groups.values()){if(g.n<2)continue;const [px,py]=P(g.x/g.n,g.y/g.n);x.globalAlpha=.95;x.fillStyle='#000';x.fillText(g.name,px+1,py+1);x.fillStyle=`hsl(${g.hue},80%,82%)`;x.fillText(g.name,px,py);}}
 // Hitos que solo oíste: un "?" donde venía el sonido.
 x.textAlign='center';x.font=`${Math.round(Math.max(20,s*.7))}px "JetBrains Mono", monospace`;
 for(const h of m.heard){const [px,py]=P(h.rx+.5,h.ry+.5);x.globalAlpha=.55;x.fillStyle='#8a8a8f';x.fillText('?',px,py+4);}
 // Hitos a los que llegaste.
 for(const lm of m.reached){const [px,py]=P(lm.x/m.RP,lm.y/m.RP),z=Math.max(4,Math.min(10,s*.35));x.globalAlpha=1;x.fillStyle=runtime.GOLD;x.strokeStyle=runtime.GOLD;
  if(lm.type==='torre')x.fillRect(px-z*.25,py-z*1.4,z*.5,z*1.4);
  else if(lm.type==='arbol'){x.beginPath();x.arc(px,py-z*.6,z*.7,0,6.283);x.fill();}
  else if(lm.type==='ciudad'){x.strokeRect(px-z*.7,py-z*.7,z*1.4,z*1.4);x.fillRect(px-z*.2,py-z*.2,z*.4,z*.4);}
  else if(lm.type==='monolito'){x.lineWidth=1.5;x.strokeRect(px-z*.3,py-z*1.4,z*.6,z*1.4);}
  else{x.beginPath();x.moveTo(px,py-z);x.lineTo(px+z*.7,py+z*.4);x.lineTo(px-z*.7,py+z*.4);x.closePath();x.fill();}}
 // Rarezas encontradas: estrella con el color de su nivel.
 for(const [key,a] of Object.entries(runtime.S.anomalies||{})){const [rx,ry]=key.split(',').map(Number),[px,py]=P(rx+.5,ry+.5),z=Math.max(6,Math.min(13,s*.45)),col=a.tier==='mitico'?runtime.GOLD:a.tier==='legendario'?'#c9a2ff':'#9fe8ff';
  x.globalAlpha=1;x.fillStyle=col;x.beginPath();for(let i=0;i<10;i++){const r=i%2?z*.45:z,an=i/10*6.283-Math.PI/2;i?x.lineTo(px+Math.cos(an)*r,py+Math.sin(an)*r):x.moveTo(px+Math.cos(an)*r,py+Math.sin(an)*r);}x.closePath();x.fill();}
 // Origen, campamento y tú.
 {const [px,py]=P(.5,.5);x.globalAlpha=.8;x.strokeStyle='#fff';x.lineWidth=1.5;x.beginPath();x.arc(px,py,Math.max(5,s*.35),0,6.283);x.stroke();}
 if(m.camp){const [px,py]=P(m.camp[0],m.camp[1]),z=Math.max(6,Math.min(12,s*.45));x.globalAlpha=1;x.strokeStyle=runtime.GOLD;x.lineWidth=2;x.beginPath();x.moveTo(px-z,py);x.lineTo(px,py-z);x.lineTo(px+z,py);x.lineTo(px+z,py+z);x.lineTo(px-z,py+z);x.closePath();x.stroke();}
 {const [px,py]=P(m.pos[0],m.pos[1]),z=Math.max(6,Math.min(12,s*.4));x.globalAlpha=1;x.fillStyle='#fff';x.fillRect(px-z/2,py-z/2,z,z);}
 x.restore();x.globalAlpha=1;
 return m;
}

export function initialize(runtime){
 let zoom='mundo';const $=runtime.$;
 function render(){
  const c=$("mapCv"),x=c.getContext("2d"),m=drawMap(runtime,x,0,0,c.width,c.height,zoom);
  $("mRegions").textContent=m.cells.length;$("mConts").textContent=m.continents;$("mRecord").textContent=m.record;
  $("mapZoom").textContent=zoom==='mundo'?'Ver cerca':'Ver todo';
  $("mapNote").textContent=`${m.reached.length} hitos visitados · ${m.heard.length} oídos sin visitar (?) · ${Object.keys(runtime.S.anomalies||{}).length} rarezas (✶)${m.camp?' · ⌂ tu Estudio':''}`;
 }
 function open(){$("mMap").hidden=false;render();runtime.unlock('mapa1');}
 function share(){
  const c=document.createElement("canvas");c.width=1080;c.height=1350;const x=c.getContext("2d");x.fillStyle="#000";x.fillRect(0,0,1080,1350);
  const m=drawMap(runtime,x,100,250,880,880,'mundo');
  x.textBaseline="top";x.fillStyle="#fff";x.font='96px Silkscreen, monospace';x.fillText("MI MAPA",100,96);
  x.font='28px "JetBrains Mono", monospace';x.fillStyle="#8a8a8f";x.fillText(`DÍA ${runtime.displayDay()} · SOLO LO QUE VI`,104,206);
  x.fillStyle="#fff";x.font='600 34px "JetBrains Mono", monospace';x.fillText(`REGIONES ${m.cells.length}`,100,1160);x.fillText(`CONTINENTES ${m.continents}`,440,1160);x.fillText(`RÉCORD ${m.record}`,820,1160);
  x.fillStyle="#8a8a8f";x.font='26px "JetBrains Mono", monospace';x.fillText("PIXEL BLANCO  ·  @jaywrkr",100,1250);
  runtime.$("shareImg").alt="Mi mapa en WHITEDOT";runtime.$("shareImg").src=c.toDataURL("image/png");$("mMap").hidden=true;runtime.$("mShare").hidden=false;
 }
 $("bMap").onclick=open;$("mapClose").onclick=()=>{$("mMap").hidden=true;};
 $("mapZoom").onclick=()=>{zoom=zoom==='mundo'?'cerca':'mundo';render();};$("mapShare").onclick=share;
 Object.defineProperties(runtime,{openMap:{get:()=>open}});
}
