// Constelación y tarjetas para compartir.
export function initialize(runtime) {
  /* ---------- constelación ---------- */
  function starPos(){
    const out=[];let x=0,y=0,a=0;
    runtime.S.stars.forEach((st,i)=>{const r=runtime.rng(runtime.seedOf("estrella"+i+st.d));const same=i>0&&runtime.S.stars[i-1].d===st.d;a+=(r()-.5)*(same?1.6:2.6);const L=same?1:1.8;x+=Math.cos(a)*L;y+=Math.sin(a)*L;out.push({x,y,d:st.d,s:st.s});});
    return out;
  }
  function drawSky(x,X,Y,Wd,Hd){
    const P=starPos();
    if(!P.length){x.fillStyle="#8a8a8f";x.font='24px "Geist Mono", monospace';x.textAlign="center";x.fillText("Tu primera estrella está en el Mundo.",X+Wd/2,Y+Hd/2);x.textAlign="left";return;}
    let a=Infinity,b=Infinity,e=-Infinity,f=-Infinity;P.forEach(p=>{a=Math.min(a,p.x);b=Math.min(b,p.y);e=Math.max(e,p.x);f=Math.max(f,p.y);});
    const s=Math.min(Wd/Math.max(1,e-a),Hd/Math.max(1,f-b),Wd/4),ox=X+(Wd-(e-a)*s)/2-a*s,oy=Y+(Hd-(f-b)*s)/2-b*s;
    const r2=runtime.rng(7);x.fillStyle="#fff";for(let i=0;i<160;i++){x.globalAlpha=.05+r2()*.15;x.fillRect(X+r2()*Wd,Y+r2()*Hd,1.5,1.5);}
    for(let i=1;i<P.length;i++){const same=P[i].d===P[i-1].d;x.globalAlpha=same?.55:.18;x.strokeStyle=same?runtime.GOLD:"#fff";x.lineWidth=same?2:1;x.beginPath();x.moveTo(ox+P[i-1].x*s,oy+P[i-1].y*s);x.lineTo(ox+P[i].x*s,oy+P[i].y*s);x.stroke();}
    P.forEach((p,i)=>{const last=i===P.length-1;x.globalAlpha=.2;x.fillStyle=runtime.GOLD;x.beginPath();x.arc(ox+p.x*s,oy+p.y*s,last?16:10,0,6.283);x.fill();
      x.globalAlpha=1;x.fillStyle=last?"#fff":runtime.GOLD;const z=last?8:5;x.fillRect(ox+p.x*s-z/2,oy+p.y*s-z/2,z,z);});
    x.globalAlpha=1;
  }
  function openSky(){
    const c=runtime.$("skyCv"),x=c.getContext("2d");x.fillStyle="#000";x.fillRect(0,0,720,720);drawSky(x,50,50,620,620);
    const days=new Set(runtime.S.stars.map(s=>s.d));
    runtime.$("kStars").textContent=runtime.S.stars.length;runtime.$("kDays").textContent=days.size;runtime.$("kStreak").textContent=runtime.shownStreak();
    runtime.$("kList").innerHTML=runtime.S.stars.length?runtime.S.stars.slice().reverse().map((s,i)=>`<div class="q"><span class="px"></span><span>${runtime.ECOS[s.p]}<small>ESTRELLA ${runtime.S.stars.length-i} · ${s.d}${s.name?" · "+s.name:""}</small></span></div>`).join(""):`<div><span class="px"></span><span class="q">Completa el camino, entra al Mundo y busca ecos antiguos.</span></div>`;
    runtime.$("mSky").hidden=false;
  }

  /* ---------- tarjetas ---------- */
  async function shareCard(kind){
    await Promise.all([document.fonts.load('400 14px "Geist Mono"'),document.fonts.load('600 14px "Geist Mono"'),document.fonts.load('400 24px "Geist Mono"')]);
    const c=document.createElement("canvas");c.width=1080;c.height=1350;const x=c.getContext("2d");
    x.fillStyle="#000";x.fillRect(0,0,1080,1350);
    if(kind==="sky")drawSky(x,100,300,880,700);
    else{
      const tr=runtime.S.trail.length?runtime.S.trail:[[0,0]];
      let a=Infinity,b=Infinity,e=-Infinity,f=-Infinity;for(const[p,q]of tr){a=Math.min(a,p);b=Math.min(b,q);e=Math.max(e,p);f=Math.max(f,q);}
      const bw=880,bh=640,s=Math.min(bw/Math.max(1,e-a),bh/Math.max(1,f-b),3),offx=100+(bw-(e-a)*s)/2,offy=330+(bh-(f-b)*s)/2;
      x.fillStyle="#fff";
      tr.forEach(([p,q],i)=>{x.globalAlpha=.25+.6*(i/tr.length);x.fillRect(offx+(p-a)*s-2,offy+(q-b)*s-2,4,4);});
      const last=tr[tr.length-1],ps=Math.max(14,runtime.pxSize()*1.4);x.globalAlpha=1;x.fillRect(offx+(last[0]-a)*s-ps/2,offy+(last[1]-b)*s-ps/2,ps,ps);
    }
    x.globalAlpha=1;x.textBaseline="top";x.fillStyle="#fff";
    x.font='96px "Geist Mono", monospace';x.fillText(kind==="sky"?runtime.S.stars.length+" ESTRELLAS":"DÍA "+runtime.displayDay(),100,96);
    x.font='28px "Geist Mono", monospace';x.fillStyle="#8a8a8f";x.fillText((kind==="sky"?"MI CONSTELACIÓN · "+Object.keys(runtime.S.zones).length+" ZONAS":"ERA "+runtime.era(runtime.displayDay())).toUpperCase(),104,216);
    x.fillStyle="#fff";x.font='600 34px "Geist Mono", monospace';
    x.fillText("RACHA "+runtime.shownStreak(),100,1040);x.fillText("ESTRELLAS "+runtime.S.stars.length,430,1040);x.fillText("TAMAÑO "+runtime.level(),800,1040);
    x.font='40px "Geist Mono", monospace';x.fillText(runtime.shownStreak()>1?"No fallé. "+runtime.shownStreak()+" días seguidos.":"Hoy sumé.",100,1120);
    x.fillStyle="#8a8a8f";x.font='26px "Geist Mono", monospace';x.fillText("KUBONO  ·  @jaywrkr",100,1236);x.fillStyle="#fff";x.font='30px "Geist Mono", monospace';x.textAlign="right";x.fillText("SIMPLE.",980,1232);x.textAlign="left";
    runtime.$("shareImg").alt=kind==="sky"?"Mi constelación en Kubono":"Mi día en Kubono";
    runtime.$("shareImg").src=c.toDataURL("image/png");runtime.$("mShare").hidden=false;
  }


  Object.defineProperties(runtime, {
    drawSky: {get:()=>drawSky},
    openSky: { get: () => openSky },
    shareCard: { get: () => shareCard },
  });
}
