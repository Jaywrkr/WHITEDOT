import {freeOpen} from './journey-mode.js';
import {explorationContext} from './exploration-context.js';
import {installNoticeLane} from './notice-lane.js';
import { POCKET_NAMES } from './pockets.js';
import {starCount,complete,PLACE_IDS,TOTAL_STARS} from './places.js';


// HUD, avisos y transiciones del Mundo.
export function initialize(runtime) {
  /* ---------- HUD ---------- */
  const $=id=>document.getElementById(id),lane=installNoticeLane(runtime);
  const fmt=s=>Math.floor(s/60)+":"+runtime.pad2(Math.floor(s%60));
  function era(d){return runtime.ERAS.find(e=>d<=e[0])[1];}
  function hud(dist){
    const d=runtime.displayDay();
    const pocket=runtime.currentPocket?.();
    $("day").textContent="DÍA "+d;$("era").textContent=runtime.inWorld()?(runtime.MU.dnaT?runtime.MU.dnaT.name+(runtime.S.worldDetails?" · "+(pocket?POCKET_NAMES[pocket.kind]:explorationContext(runtime.MU.dnaT,runtime.S.wx,runtime.S.wy,runtime.seedOf).label):''):"El Mundo"):"Era "+era(d);
    $("quickSave").hidden=!runtime.inWorld();$("era").disabled=!runtime.inWorld();
    $("streak").textContent=runtime.S.totalDays||0;$("size").textContent=runtime.level();
    // Panel 10 (P8, D3-A): the full view keeps three numbers: ★ of 33, ✦ (#sparkCount) and places of 11. One ★ only:
    // the relics (S.stars) are «Reliquias» in the Constellation; #starsN stays in the page, hidden and unused.
    {const d=runtime.placesData?.(),show=!!d&&!d.readOnly&&freeOpen(runtime.S.journey),st=$("hudStars"),pl=$("hudPlaces");
     if(st){st.hidden=!show;if(show)st.textContent="★ "+starCount(d)+"/"+TOTAL_STARS;}
     if(pl){pl.hidden=!show;if(show)pl.textContent=PLACE_IDS.filter(id=>complete(d,id)).length+"/11 lugares";}}
    $("bar").classList.toggle("free",runtime.isFree());
    runtime.elementBookUI?.();
    const fill=$("barfill"),goal=$("goal"),gr=$("goalR");
    $("bDeploy").hidden=!runtime.inWorld();
    if(runtime.S.mode==="studio"){const house=runtime.houseActive?.(),n=house?runtime.currentHouse().objects.length:Object.keys(runtime.S.studio.slots).length;$("era").textContent=(house?"Refugio · ":"Taller · ")+runtime.BIOMES[runtime.S.studio.biome||0].name;fill.style.width=(n/(house?40:64)*100)+"%";goal.textContent=(house?"Refugio":"Taller")+(n?" · "+n+" sonando":"");gr.textContent=house?"Camina. Coloca. Escucha.":"Toca un punto";}
    else if(runtime.inWorld()){if(!runtime.journeyQuiet?.())fill.style.width="100%";   // in the Journey the chapter sets it (journey-chapters.js)
      goal.textContent=dist?"Eco cercano · escucha y pulsa":"Explora a tu ritmo";   // regions and forms are counted in the Bitácora
      gr.textContent="Sin reloj";}
    else{const need=runtime.rapidLevel===2?2:10,n=Math.min(need,runtime.S.pathCrystals.length);fill.style.width=(n/need*100)+"%";goal.textContent="Cristales · "+n+" / "+need;gr.textContent="Acércate y lanza un pulso";}
    // Panel 10 (P2): one way to go at a time. In the World, «Volver al Camino» (#bPrimary) heads «Más › Ir» and #bWorld
    // hides; elsewhere #bPrimary stays in the dock and #bWorld («Explorar») enters the World or leaves the Refugio.
    const canWorld=runtime.S.mode==="camino"&&runtime.worldReady(),bp=$("bPrimary"),bw=$("bWorld"),world=runtime.inWorld();bw.querySelector("span").firstChild.nodeValue="Explorar";$("bWorldHint").textContent=world?"Volver al Camino":"Explorar el Mundo";
    bw.hidden=world||!(runtime.worldReady()||(freeOpen(runtime.S.journey)&&runtime.houseActive?.()));
    const destination=world?$('menuMore')?.querySelector('.tiles'):$('dock');if(destination&&bp.parentElement!==destination){if(world)bw.before(bp);else destination.insertBefore(bp,destination.firstChild);}
    bp.hidden=!(canWorld||world);$("bPrimaryL").textContent=world?"Volver al Camino":"Entrar al Mundo";bp.classList.toggle("gold",canWorld);bp.querySelector("svg").style.transform=world?"scaleX(-1)":"";runtime.tidyMenu?.();
  }
  function showPhrase(t,big){const p=$('phrase');lane.enqueue('phrase',p,()=>{p.textContent=t;p.classList.toggle('big',!!big);},big?5:3.2,String(t),()=>true,{level:big?2:1,category:'ambiente',coalesce:true});}
  function toast(html,options={}){const el=$('toast'),important=/no se pudo|no pudo|no pudimos|necesita atención|no disponible|fall[oó]|sin espacio|guardar copia|recoge una luz|libro completo/i.test(html);// The Journey has no words while you play (docs/VIAJE.md): everyday notices wait; problems still show.
    if(!important&&!options.force&&runtime.journeyQuiet?.()&&(runtime.inWorld?.()||runtime.S?.mode==='camino'))return false;
    return lane.enqueue('toast',el,()=>{el.innerHTML=html;},2.5,String(html),options.valid||(()=>true),{level:important?2:1,category:important?'atención':'cotidiano',coalesce:true,persistent:/no pudimos guardar|no se pudo guardar|otra pestaña cambió|progreso necesita atención/i.test(html),...options});}
  function unlock(id){if(runtime.S.ach[id]||runtime.achievementRetired?.(id))return;const prev=new Set(runtime.COLORS.filter(runtime.colorOk).map(c=>c[0]));runtime.S.ach[id]=runtime.S.todayKey;const a=runtime.ACH.find(x=>x[0]===id);runtime.say(runtime.VOZ[id]||"Bien. Sigue.","Logro · "+a[1],{recordOnly:true});
    // Achievement notices share the existing silent lane.
    // Panel 11 (Q1): between the Journey's credits and the first portal a new colour waits in Tu cubo, unannounced.
    if(!runtime.achievementsCalm?.())runtime.COLORS.forEach(c=>{if(runtime.colorOk(c)&&!prev.has(c[0]))toast("<em>Color nuevo</em> · "+c[1],{level:2,category:'ganado'});});if(runtime.save()!==false)runtime.achievementEarned?.([id]);}


  function enterWorld({automatic=false}={}){
    if(!runtime.worldReady()){toast("Abre el Mundo con diez cristales del Camino.");return;}
    runtime.beginSession();if(runtime.S.sound)runtime.audio();if(runtime.S.lastWorldDay!==runtime.S.todayKey){if(runtime.dailyArrival?.()){ /* Previous place remains available through Volver al salto. */ }else if(runtime.S.studio.x!=null){runtime.S.wx=runtime.S.studio.x;runtime.S.wy=runtime.S.studio.y;{const rp=runtime.REG*runtime.WCH,ring=Math.max(Math.abs(Math.floor(runtime.S.wx/rp)),Math.abs(Math.floor(runtime.S.wy/rp)));if(ring>=3)setTimeout(()=>runtime.toast(`<em>Campamento</em> · a ${ring} regiones del Origen`),2600);if(ring>=3&&!runtime.S.help.camp){runtime.S.help.camp=true;setTimeout(()=>runtime.say(runtime.VOZ.campamento),4000);}}}runtime.S.lastWorldDay=runtime.S.todayKey;}runtime.zoneHops=0;runtime.S.mode="world";runtime.curZone=-1;{const rg=runtime.regionOfPos(runtime.S.wx,runtime.S.wy);runtime.curRegion=rg.key;runtime.enterRegion(rg,rg.z);}runtime.MU.layers=new Set();
    runtime.todayRelics();runtime.enterFx=1;runtime.flocks=[];
    runtime.jamUI?.();
    unlock("mundo");
    if(automatic){runtime.S.help.mundo=true;$("mHelpW").hidden=true;}else if(!runtime.S.help.mundo){$("mHelpW").hidden=false;}
    runtime.save();hud();
  }
  function exitWorld(out){
    runtime.cancelJourneyVictory?.();
    runtime.finishSession();
    runtime.closeGlass?.();runtime.closeMirrors?.();runtime.stopAutopilot?.();runtime.resetJam?.();runtime.fxReset?.();    runtime.S.layer='superficie';runtime.MU.layer='superficie';runtime.resetContinent?.();runtime.MU.vit=null;runtime.MU.lowT=0;runtime.S.mode="camino";runtime.setBiome(0);runtime.MU.dnaT=null;runtime.MU.vari=-1;runtime.MU.near=[];runtime.MU.singers=[];runtime.curRegion=null;runtime.RP=null;runtime.retoUI();runtime.MU.layers=new Set();runtime.MU.flowers=[];runtime.MU.follower=false;if(runtime.inPond&&runtime.mfilt){runtime.inPond=false;runtime.mfilt.frequency.setTargetAtTime(18000,runtime.ac.currentTime,.2);}runtime.save();hud();
    if(out){runtime.say(runtime.VOZ.lampOut);$("oToday").textContent=runtime.relicsGot();$("oStars").textContent=runtime.S.stars.length;$("oStreak").textContent=runtime.S.totalDays||0;$("mOut").hidden=false;}
  }
  function openCap(){$("cDay").textContent=runtime.displayDay();$("cStreak").textContent=runtime.S.totalDays||0;$("cSize").textContent=runtime.level();$("cLamp").textContent="Explora sin límite de tiempo.";$("mCap").hidden=false;}


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
  });
}
