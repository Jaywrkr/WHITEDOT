// Secuenciador, muestras, colores y checkpoint.
// Las muestras únicas de rarezas solo aparecen en la bolsa cuando ya las tienes.
const SPECIAL=new Set(['reverso','canon','frenesi','detenido','espejo','luna']);
export function initialize(runtime) {
  const colorOk=c=>!c[2]||Object.hasOwn(runtime.S.rewards?.items||{},'cube:color:'+c[0].slice(1))||(c[2]==="oculto"?runtime.ACH.some(a=>a[3]&&runtime.S.ach[a[0]]):!!runtime.S.ach[c[2]]);
  function gain(type){const before=runtime.S.bag[type]||0,n=Math.min(9,before+1);if(n===before)return;runtime.S.bag[type]=n;runtime.toast("<em>Muestra</em> · "+runtime.SAMPLES[type]+" · "+n);runtime.save();}
  function playSample(ty,r,t,ct,Rt){const n=ct[r];switch(ty){
    case "luz":runtime.pluck(n+12,t,runtime.vel(.08),0);break;
    case "cristal":runtime.pluck(n+24,t,runtime.vel(.05),4);break;
    case "pilar":runtime.tom(t,[60,80,105,135][r],runtime.vel(.2));break;
    case "loto":runtime.pluck(n+12,t,runtime.vel(.07),2);break;
    case "arbol":runtime.pluck(n+12,t,runtime.vel(.08),1);break;
    case "luciernaga":runtime.pluck(n+36,t,runtime.vel(.035),4);break;
    case "flor":runtime.pluck(n+12,t,runtime.vel(.08),3);break;
    case "faro":runtime.softBass(Rt+[0,7,12,5][r],t,runtime.vel(.16));break;
    // Muestras únicas de las rarezas.
    case "reverso":runtime.hookInst("strings",n+12,t,runtime.vel(.07));break;
    case "canon":[0,1,2].forEach(i=>runtime.pluck(n+12+[0,4,7][i],t+i*runtime.SIX*2,runtime.vel(.07-i*.015),2));break;
    case "frenesi":[0,1,2,3].forEach(i=>runtime.pluck(n+12+(i%2?7:0),t+i*runtime.SIX/2,runtime.vel(.05),0));break;
    case "detenido":runtime.pluck(n+24,t,runtime.vel(.06),4);runtime.softBass(Rt,t,runtime.vel(.1));break;
    case "espejo":runtime.pluck(n+12,t,runtime.vel(.06),1);runtime.pluck(n,t,runtime.vel(.05),1);break;
    case "luna":ct.slice(0,4).forEach((k,i)=>runtime.pluck(k+12+(i>2?12:0),t+i*.012,runtime.vel(.05),4));break;}}
  function drawSample(ty,x,y,s,col){runtime.cx.fillStyle=col;runtime.cx.strokeStyle=col;runtime.cx.lineWidth=1.5;runtime.cx.beginPath();
    switch(ty){
      case "luz":runtime.cx.fillRect(x-s/2,y-s/2,s,s);break;
      case "cristal":runtime.cx.moveTo(x,y-s);runtime.cx.lineTo(x+s*.55,y);runtime.cx.lineTo(x,y+s*.6);runtime.cx.lineTo(x-s*.55,y);runtime.cx.closePath();runtime.cx.stroke();break;
      case "pilar":runtime.cx.strokeRect(x-s*.3,y-s,s*.6,s*2);break;
      case "loto":runtime.cx.arc(x,y,s*.8,0,6.283);runtime.cx.stroke();break;
      case "arbol":runtime.cx.fillRect(x-.75,y-s,1.5,s*2);runtime.cx.fillRect(x-s*.45,y-s,s*.9,s*.5);break;
      case "luciernaga":runtime.cx.fillRect(x-s*.6,y-1.5,3,3);runtime.cx.fillRect(x+s*.3,y-1.5,3,3);break;
      case "flor":runtime.cx.fillRect(x-s,y-.75,s*2,1.5);runtime.cx.fillRect(x-.75,y-s,1.5,s*2);break;
      case "faro":runtime.cx.fillRect(x-.75,y-s*.2,1.5,s*1.2);runtime.cx.fillRect(x-s*.45,y-s,s*.9,s*.8);break;
      case "reverso":runtime.cx.moveTo(x-s,y+s*.6);runtime.cx.lineTo(x,y-s*.6);runtime.cx.lineTo(x+s,y+s*.6);runtime.cx.stroke();break;
      case "canon":for(let i=0;i<3;i++){runtime.cx.moveTo(x-s+i*s*.8+s*.3,y);runtime.cx.arc(x-s+i*s*.8,y,s*.3,0,6.283);}runtime.cx.stroke();break;
      case "frenesi":for(let i=0;i<4;i++)runtime.cx.fillRect(x-s+i*s*.6,y-s*.5,1.5,s);break;
      case "detenido":runtime.cx.arc(x,y,s*.8,0,6.283);runtime.cx.moveTo(x,y);runtime.cx.lineTo(x,y-s*.6);runtime.cx.moveTo(x,y);runtime.cx.lineTo(x+s*.4,y);runtime.cx.stroke();break;
      case "espejo":runtime.cx.fillRect(x-s,y-s*.5,s*.8,s);runtime.cx.strokeRect(x+s*.2,y-s*.5,s*.8,s);break;
      case "luna":runtime.cx.arc(x,y,s*.85,0,6.283);runtime.cx.fill();break;}}
  const geo=()=>{const m=Math.min(runtime.W,runtime.H-260);return{X:runtime.W/2,Y:runtime.H/2,base:m*.13,gap:m*.095};};
  function visStep(){if(!runtime.ac)return -1;const n=runtime.ac.currentTime;let s=-1;for(const q of runtime.MU.sq)if(q.t<=n)s=q.s;return s;}
  function studioStep(t,dt,b){
    if(runtime.houseActive?.())return runtime.houseStep(t,dt,b);
    runtime.camX=0;runtime.camY=0;
    const {X,Y,base,gap}=geo(),col=runtime.S.color,cur=visStep(),ms=performance.now();
    runtime.cx.strokeStyle=col;runtime.cx.lineWidth=1;
    for(let r=0;r<4;r++){runtime.cx.globalAlpha=.12+b*.06;runtime.cx.beginPath();runtime.cx.arc(X,Y,base+gap*r,0,6.283);runtime.cx.stroke();}
    if(cur>=0){const a=-Math.PI/2+cur/16*6.283;runtime.cx.globalAlpha=.35;runtime.cx.beginPath();runtime.cx.moveTo(X+Math.cos(a)*(base-gap*.5),Y+Math.sin(a)*(base-gap*.5));runtime.cx.lineTo(X+Math.cos(a)*(base+gap*3.5),Y+Math.sin(a)*(base+gap*3.5));runtime.cx.stroke();}
    for(let r=0;r<4;r++)for(let s=0;s<16;s++){
      const a=-Math.PI/2+s/16*6.283,rr=base+gap*r,x=X+Math.cos(a)*rr,y=Y+Math.sin(a)*rr,key=r+","+s,it=runtime.S.studio.slots[key];
      if(it){const h=Math.max(0,1-(ms-(runtime.studioHit[key]||-1e9))/350);
        if(h>0&&h<=1){runtime.cx.globalAlpha=h*.3;runtime.cx.fillStyle=col;runtime.cx.beginPath();runtime.cx.arc(x,y,10+h*8,0,6.283);runtime.cx.fill();}
        runtime.cx.globalAlpha=Math.min(1,.75+h*.25);drawSample(it,x,y,6+h*3,col);}
      else{runtime.cx.globalAlpha=s===cur?.55:s%4===0?.3:.13;runtime.cx.fillStyle="#fff";runtime.cx.fillRect(x-1.5,y-1.5,3,3);}
    }
    if((runtime.hudT+=dt)>.5){runtime.hudT=0;runtime.hud();}
    return 10;
  }
  function studioTap(px,py){
    if(runtime.houseActive?.())return runtime.houseTap(px,py);
    const {X,Y,base,gap}=geo(),dx=px-X,dy=py-Y,d=Math.hypot(dx,dy),r=Math.round((d-base)/gap);
    if(r<0||r>3||Math.abs(d-(base+gap*r))>gap*.5)return;
    let a=Math.atan2(dy,dx)+Math.PI/2;if(a<0)a+=6.283;
    const s=Math.round(a/6.283*16)%16,key=r+","+s,sl=runtime.S.studio.slots,ang=-Math.PI/2+s/16*6.283;
    if(sl[key]){runtime.S.bag[sl[key]]=Math.min(9,(runtime.S.bag[sl[key]]||0)+1);delete sl[key];}
    else{
      if(!((runtime.S.bag[runtime.selSample]||0)>0)){runtime.toast("<em>Estudio</em> · No te quedan muestras de "+runtime.SAMPLES[runtime.selSample]);return;}
      runtime.S.bag[runtime.selSample]--;sl[key]=runtime.selSample;runtime.burst(Math.cos(ang)*(base+gap*r),Math.sin(ang)*(base+gap*r),8,false);
      const ty=runtime.selSample;runtime.now(q=>playSample(ty,r,q,runtime.chordTones(),runtime.root()));
      if(Object.keys(sl).length===1)runtime.say(runtime.VOZ.firstPlace);
    }
    renderBag();runtime.save();runtime.hud();
  }
  function renderBag(){
    document.getElementById("bag").innerHTML=Object.keys(runtime.SAMPLES).filter(k=>!SPECIAL.has(k)||(runtime.S.bag[k]||0)>0||Object.values(runtime.S.studio.slots||{}).includes(k)).map(k=>`<button data-s="${k}" class="${k===runtime.selSample?"on":""} ${(runtime.S.bag[k]||0)?"":"zero"}">${runtime.SAMPLES[k]} ${runtime.S.bag[k]||0}</button>`).join("");
    document.getElementById("swatches").innerHTML='<span>COLOR</span>'+runtime.COLORS.map((c,i)=>`<button data-c="${i}" title="${c[1]}${colorOk(c)?"":" · se gana con un logro"}" aria-label="${c[1]}" style="background:${c[0]}" class="${runtime.S.color===c[0]?"on":""}" ${colorOk(c)?"":"disabled"}></button>`).join("");
  }
  function enterStudio(){
    runtime.audio();document.getElementById("reto").hidden=true;if(runtime.S.mode!=="studio")runtime.S.prevMode=runtime.S.mode;runtime.S.mode="studio";runtime.setBiome(runtime.S.studio.biome||0);runtime.MU.dnaT=runtime.S.studio.x!=null?runtime.regionOfPos(runtime.S.studio.x,runtime.S.studio.y):null;runtime.parts=[];
    document.getElementById("dock").hidden=true;document.getElementById("studioPanel").hidden=false;renderBag();
    if(!Object.keys(runtime.S.studio.slots).length)runtime.say(runtime.VOZ.studioEmpty);
    runtime.save();runtime.hud();
  }
  function exitStudio(){
    const back=runtime.S.prevMode==="world"&&runtime.worldReady()?"world":"camino";runtime.S.mode=back;
    if(back==="world"&&(runtime.S.layer||"superficie")!=="superficie"){runtime.restoreLayerMusic?.();}else if(back==="world"){runtime.curZone=runtime.biomeOfPos(runtime.S.wx,runtime.S.wy);runtime.setBiome(runtime.curZone);const rg=runtime.regionOfPos(runtime.S.wx,runtime.S.wy);runtime.MU.dnaT=rg;runtime.curRegion=rg.key;}else{runtime.setBiome(0);runtime.MU.dnaT=null;}
    runtime.parts=[];document.getElementById("dock").hidden=false;document.getElementById("studioPanel").hidden=true;runtime.retoUI();runtime.save();runtime.hud();
  }
  function deployStudio(){{const st=runtime.S.studio;if(st.x!=null&&Math.hypot(st.x-runtime.S.wx,st.y-runtime.S.wy)>400){(runtime.S.camps||=[]).push([Math.round(st.x),Math.round(st.y)]);if(runtime.S.camps.length>30)runtime.S.camps.shift();}}   // el campamento anterior queda como recuerdo
    runtime.S.studio.x=runtime.S.wx;runtime.S.studio.y=runtime.S.wy;runtime.S.studio.biome=runtime.biomeOfPos(runtime.S.wx,runtime.S.wy);runtime.say(runtime.VOZ.deploy);runtime.save();enterStudio();}

  Object.defineProperties(runtime, {
    colorOk: { get: () => colorOk },
    gain: { get: () => gain },
    playSample: { get: () => playSample },
    studioStep: { get: () => studioStep },
    studioTap: { get: () => studioTap },
    renderBag: { get: () => renderBag },
    enterStudio: { get: () => enterStudio },
    exitStudio: { get: () => exitStudio },
    deployStudio: { get: () => deployStudio },
  });
}
