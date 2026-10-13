import { POCKET_NAMES } from './pockets.js';

import { gravityOf } from './gravity.js';

// HUD, avisos y transiciones del Mundo.
export function initialize(runtime) {
  /* ---------- HUD ---------- */
  const $=id=>document.getElementById(id);
  const fmt=s=>Math.floor(s/60)+":"+runtime.pad2(Math.floor(s%60));
  function era(d){return runtime.ERAS.find(e=>d<=e[0])[1];}
  function hud(dist){
    const d=runtime.displayDay();
    const pocket=runtime.currentPocket?.();
    $("day").textContent="DÍA "+d;$("era").textContent=runtime.inWorld()?(runtime.MU.dnaT?runtime.MU.dnaT.name+" · "+(pocket?POCKET_NAMES[pocket.kind]:gravityOf(runtime.MU.dnaT,runtime.seedOf).name):"El Mundo"):"Era "+era(d);
    $("streak").textContent=runtime.shownStreak();$("starsN").textContent=runtime.S.stars.length;$("size").textContent=runtime.level();
    $("bar").classList.toggle("free",runtime.isFree());
    const fill=$("barfill"),goal=$("goal"),gr=$("goalR");
    $("bDeploy").hidden=!runtime.inWorld();
    if(runtime.S.mode==="studio"){const n=Object.keys(runtime.S.studio.slots).length;$("era").textContent="Estudio · "+runtime.BIOMES[runtime.S.studio.biome||0].name;fill.style.width=(n/64*100)+"%";goal.textContent="Estudio · "+n+" sonando";gr.textContent="Toca un punto";}
    else if(runtime.inWorld()){const l=runtime.lampLeft();fill.style.width=(l/runtime.lampMax()*100)+"%";
      goal.textContent=dist?"Eco cercano · escucha y pulsa":"Lugares "+(runtime.S.placesN||0)+" · Formas "+(runtime.S.catN||0);
      gr.textContent=fmt(l);}
    else if(runtime.isFree()){const l=runtime.lampLeft();fill.style.width="100%";goal.textContent=l>0?"Camino completo · entra al Mundo":"Vuelve mañana";gr.textContent=l>0?"Linterna "+fmt(l):"";}
    else{fill.style.width=(runtime.S.todayLight/runtime.CAP*100)+"%";goal.textContent="Recoge luz · "+runtime.S.todayLight+" / "+runtime.CAP;gr.textContent="Toca en el beat";}
    const canWorld=runtime.S.mode==="camino"&&runtime.isFree()&&runtime.lampLeft()>0,bp=$("bPrimary");$("bWorld").querySelector("span").textContent=runtime.inWorld()?"Camino":"Mundo";
    bp.hidden=!(canWorld||runtime.inWorld());$("bPrimaryL").textContent=runtime.inWorld()?"Camino":"Entrar al Mundo";bp.classList.toggle("gold",canWorld);bp.querySelector("svg").style.transform=runtime.inWorld()?"scaleX(-1)":"";
  }
  let phT;function showPhrase(t,big){const p=$("phrase");p.textContent=t;p.classList.toggle("big",!!big);p.classList.add("on");clearTimeout(phT);phT=setTimeout(()=>p.classList.remove("on"),big?5000:3200);}
  let toastQ=[],toasting=false;
  function toast(html){toastQ.push(html);nextToast();}
  function unlock(id){if(runtime.S.ach[id])return;const prev=new Set(runtime.COLORS.filter(runtime.colorOk).map(c=>c[0]));runtime.S.ach[id]=runtime.S.todayKey;const a=runtime.ACH.find(x=>x[0]===id);runtime.say(runtime.VOZ[id]||"Bien. Sigue.","Logro · "+a[1]);
    runtime.COLORS.forEach(c=>{if(runtime.colorOk(c)&&!prev.has(c[0]))toast("<em>Color nuevo</em> · "+c[1]+" · úsalo en tu Estudio");});runtime.save();}
  function nextToast(){if(toasting||!toastQ.length)return;toasting=true;const el=$("toast");el.innerHTML=toastQ.shift();el.classList.add("on");setTimeout(()=>{el.classList.remove("on");setTimeout(()=>{toasting=false;nextToast();},350);},2200);}

  function enterWorld(){
    if(!runtime.isFree()){toast("<em>Mundo</em> · Primero completa el camino de hoy");return;}
    if(runtime.lampLeft()<=0){toast("<em>Linterna</em> · Vuelve mañana");return;}
    runtime.beginSession();runtime.audio();if(runtime.S.lastWorldDay!==runtime.S.todayKey){if(runtime.S.studio.x!=null){runtime.S.wx=runtime.S.studio.x;runtime.S.wy=runtime.S.studio.y;{const rp=runtime.REG*runtime.WCH,ring=Math.max(Math.abs(Math.floor(runtime.S.wx/rp)),Math.abs(Math.floor(runtime.S.wy/rp)));if(ring>=3)setTimeout(()=>runtime.toast(`<em>Campamento</em> · a ${ring} regiones del Origen`),2600);if(ring>=3&&!runtime.S.help.camp){runtime.S.help.camp=true;setTimeout(()=>runtime.say(runtime.VOZ.campamento),4000);}}}runtime.S.lastWorldDay=runtime.S.todayKey;}runtime.zoneHops=0;runtime.S.mode="world";runtime.curZone=-1;{const rg=runtime.regionOfPos(runtime.S.wx,runtime.S.wy);runtime.curRegion=rg.key;runtime.enterRegion(rg,rg.z);}runtime.MU.layers=new Set();
    runtime.todayRelics();runtime.enterFx=1;runtime.flocks=[];
    runtime.soon(q=>[0,7,12,15,19,24].forEach((k,i)=>runtime.pluck(45+runtime.BIOMES[runtime.curZone].tr+k,q+i*runtime.SIX*2,.07,2)));
    runtime.jamUI?.();
    unlock("mundo");
    if(!runtime.S.help.mundo){$("mHelpW").hidden=false;}
    runtime.save();hud();
  }
  function exitWorld(out){
    runtime.finishSession();
    runtime.closeGlass?.();runtime.closeMirrors?.();runtime.closePatchGarden?.();runtime.stopAutopilot?.();runtime.resetJam?.();runtime.fxReset?.();    runtime.S.layer='superficie';runtime.MU.layer='superficie';runtime.resetContinent?.();runtime.MU.vit=null;runtime.MU.lowT=0;runtime.S.mode="camino";runtime.setBiome(0);runtime.MU.dnaT=null;runtime.MU.vari=-1;runtime.MU.near=[];runtime.MU.singers=[];runtime.curRegion=null;runtime.RP=null;runtime.retoUI();runtime.MU.layers=new Set();runtime.MU.flowers=[];runtime.MU.follower=false;if(runtime.inPond&&runtime.mfilt){runtime.inPond=false;runtime.mfilt.frequency.setTargetAtTime(18000,runtime.ac.currentTime,.2);}runtime.save();hud();
    if(out){runtime.say(runtime.VOZ.lampOut);$("oToday").textContent=runtime.relicsGot();$("oStars").textContent=runtime.S.stars.length;$("oStreak").textContent=runtime.shownStreak();$("mOut").hidden=false;}
  }
  function openCap(){$("cDay").textContent=runtime.displayDay();$("cStreak").textContent=runtime.shownStreak();$("cSize").textContent=runtime.level();$("cLamp").textContent=Math.round(runtime.lampLeft()/60)+" min";$("mCap").hidden=false;}
  function openAch(){
    const got=runtime.ACH.filter(a=>runtime.S.ach[a[0]]).length;
    $("achBody").innerHTML=`<div class="sub">Catálogo · ${runtime.S.catN||0} formas · ${runtime.S.placesN||0} lugares · ${runtime.S.retosN||0} retos</div><div class="list">${(runtime.S.catRecent||[]).length?(runtime.S.catRecent||[]).slice(0,12).map(c=>`<div class="life got"><span class="px"></span><span><strong>${c.n}</strong><small>Vive en ${c.r}</small></span></div>`).join(""):`<div><span class="px"></span><span><strong>Vacío</strong><small>Las formas con anillo dorado son nuevas. Tócalas para nombrarlas.</small></span></div>`}</div>
    <div class="sub">Familias · ${Object.keys(runtime.S.zones).length} / ${runtime.BIOMES.length}</div><div class="list">${runtime.BIOMES.map(B=>`<div class="life ${runtime.S.zones[B.id]?"got":""}"><span class="px"></span><span><strong>${runtime.S.zones[B.id]?B.name:"???"}</strong><small>${runtime.S.zones[B.id]?B.desc:B.minD>=4?"Muy lejos del centro.":B.minD>=3?"Lejos del centro.":"Más allá de la llanura."}</small></span></div>`).join("")}</div>
    <div class="sub">Vida · ${Object.keys(runtime.S.species).length} / ${runtime.SPECIES.length}</div><div class="list">${runtime.SPECIES.map(([id,n,d])=>`<div class="life ${runtime.S.species[id]?"got":""}"><span class="px"></span><span><strong>${runtime.S.species[id]?n:"???"}</strong><small>${runtime.S.species[id]?d:"Aún no la encuentras."}</small></span></div>`).join("")}</div>
    <div class="sub">Logros · ${got} / ${runtime.ACH.length}</div><div class="list">${runtime.ACH.map(([id,n,d,h])=>{const g=runtime.S.ach[id],hid=h&&!g;return `<div class="${g?"got":""}"><span class="px"></span><span><strong>${hid?"???":n}</strong><small>${hid?"Logro oculto. Nadie te va a decir cómo.":d}</small></span></div>`;}).join("")}</div>`;
    $("mAch").hidden=false;
  }


  Object.defineProperties(runtime, {
    $: { get: () => $ },
    era: { get: () => era },
    hud: { get: () => hud },
    showPhrase: { get: () => showPhrase },
    toast: { get: () => toast },
    unlock: { get: () => unlock },
    enterWorld: { get: () => enterWorld },
    exitWorld: { get: () => exitWorld },
    openCap: { get: () => openCap },
    openAch: { get: () => openAch },
  });
}
