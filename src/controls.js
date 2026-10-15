// Eventos de botones y controles de prototipo.
export function initialize(runtime) {
  /* ---------- botones ---------- */
  runtime.$("bSession").onclick=runtime.openSession;
  runtime.$("oSession").onclick=()=>{runtime.$("mOut").hidden=true;runtime.openJournal("today");};
  runtime.$("sessionClose").onclick=()=>{runtime.$("mSession").hidden=true;};
  runtime.$("sessionShare").onclick=runtime.shareSession;
  runtime.$("hcGo").onclick=()=>{runtime.S.help.camino=true;runtime.$("mHelpC").hidden=true;runtime.audio();if(!runtime.S.voiceStart){runtime.S.voiceStart=true;setTimeout(()=>runtime.say(runtime.VOZ.start),900);}runtime.save();};
  runtime.$("bMenu").onclick=()=>{runtime.$("mMenu").hidden=false;};runtime.$("mnClose").onclick=()=>{runtime.$("mMenu").hidden=true;};
  document.querySelectorAll("#mMenu .tiles button,#mMenu .devbox button").forEach(b=>b.addEventListener("click",()=>{if(b.id!=="dReset")runtime.$("mMenu").hidden=true;}));
  runtime.$("bPrimary").onclick=()=>{if(runtime.inWorld())runtime.exitWorld(false);else runtime.enterWorld();};
  runtime.$("bStudio").onclick=runtime.enterStudio;runtime.$("bDeploy").onclick=runtime.deployStudio;runtime.$("stExit").onclick=runtime.exitStudio;
  runtime.$("oDeploy").onclick=()=>{runtime.$("mOut").hidden=true;runtime.deployStudio();};
  runtime.$("bag").onclick=e=>{const b=e.target.closest("button");if(!b)return;runtime.selSample=b.dataset.s;runtime.renderBag();};
  runtime.$("swatches").onclick=e=>{const b=e.target.closest("button");if(!b||b.disabled)return;runtime.S.color=runtime.COLORS[+b.dataset.c][0];runtime.S.cube={...runtime.cubeSettings?.(),color:runtime.S.color};runtime.renderBag();runtime.save();};
  let armC=false;runtime.$("stClear").onclick=e=>{if(!armC){armC=true;e.target.textContent="¿Seguro?";setTimeout(()=>{armC=false;e.target.textContent="Vaciar";},2500);return;}for(const k in runtime.S.studio.slots){const t=runtime.S.studio.slots[k];runtime.S.bag[t]=Math.min(9,(runtime.S.bag[t]||0)+1);}runtime.S.studio.slots={};armC=false;e.target.textContent="Vaciar";runtime.renderBag();runtime.save();runtime.hud();};
  runtime.$("hwGo").onclick=()=>{runtime.S.help.mundo=true;runtime.save();runtime.$("mHelpW").hidden=true;runtime.showRegion(runtime.regionOfPos(runtime.S.wx,runtime.S.wy),true);};
  runtime.$("bShare").onclick=()=>runtime.shareCard(runtime.inWorld()||runtime.S.stars.length?"sky":"day");runtime.$("cShare").onclick=()=>{runtime.$("mCap").hidden=true;runtime.shareCard("day");};
  runtime.$("cExplore").onclick=()=>{runtime.$("mCap").hidden=true;runtime.enterWorld();};
  runtime.$("bWorld").onclick=()=>{if(runtime.inWorld())runtime.exitWorld(false);else runtime.enterWorld();};
  runtime.$("bSky").onclick=runtime.openSky;runtime.$("kClose").onclick=()=>{runtime.$("mSky").hidden=true;};runtime.$("kShare").onclick=()=>{runtime.$("mSky").hidden=true;runtime.shareCard("sky");};
  runtime.$("oSky").onclick=()=>{runtime.$("mOut").hidden=true;runtime.openJournal("places");};runtime.$("oClose").onclick=()=>{runtime.$("mOut").hidden=true;};
  runtime.$("bAch").onclick=runtime.openJournal;runtime.$("aClose").onclick=()=>{runtime.$("mAch").hidden=true;};
  runtime.$("sClose").onclick=()=>{runtime.$("mShare").hidden=true;};
  runtime.$("bSoft").onclick=()=>{runtime.S.softMusic=!runtime.S.softMusic;runtime.$("bSoft").setAttribute('aria-pressed',String(runtime.S.softMusic));runtime.audio();runtime.applyComfort();runtime.toast(runtime.S.softMusic?'Calma · sí':'Calma · no');runtime.save();};
  runtime.$("bSoft").setAttribute('aria-pressed',String(!!runtime.S.softMusic));
  const livingUI=()=>{runtime.$('bLivingMusic').setAttribute('aria-pressed',String(runtime.S.livingMusic!==false));runtime.$('bLivingMusic').textContent=runtime.S.livingMusic===false?'Paisaje clásico':'Paisaje vivo';};
  runtime.$('bLivingMusic').onclick=()=>{runtime.S.livingMusic=runtime.S.livingMusic===false;livingUI();runtime.save();};livingUI();
  runtime.$("bMusicSettings").onclick=()=>{styleUI();runtime.$("mMusic").hidden=false;};
  const rs=runtime.$("rStyle");
  const styleName=I=>I<.2?"Ambiente":I<.45?"Minimal":I<.72?"Deep":"Underground";
  function styleUI(){runtime.$("bSoft").setAttribute("aria-pressed",String(!!runtime.S.softMusic));runtime.$("rVolume").value=Math.round((runtime.S.outputVolume??1)*100);const I=runtime.style();rs.value=Math.round(I*100);runtime.$("styleNow").textContent=styleName(I);runtime.$("muMute").textContent=runtime.S.sound?"Silenciar":"Activar sonido";runtime.$("bSound").querySelector("span").textContent=runtime.S.sound?"Sonido: sí":"Sonido: no";runtime.$("bSound").setAttribute('aria-pressed',String(!!runtime.S.sound));}
  rs.oninput=()=>{runtime.S.style=rs.value/100;styleUI();runtime.audio();if(runtime.S.style>=.9)runtime.unlock("under");};
  rs.onchange=()=>runtime.save();
  runtime.$("bSound").onclick=()=>{runtime.S.sound=!runtime.S.sound;styleUI();runtime.audio();if(runtime.master)runtime.master.gain.setTargetAtTime(runtime.musicVolume(),runtime.ac.currentTime,.05);runtime.toast(runtime.S.sound?"<em>Música</em> · activada":"<em>Música</em> · en silencio");runtime.save();};
  runtime.$("bSettings").onclick=()=>{runtime.$("mMenu").hidden=true;runtime.$("mSettings").hidden=false;};
  runtime.$("settingsClose").onclick=()=>runtime.$("mSettings").hidden=true;
  runtime.$("rVolume").oninput=e=>{runtime.S.outputVolume=Math.max(0,Math.min(1,+e.target.value/100));if(runtime.master)runtime.master.gain.setTargetAtTime(runtime.musicVolume(),runtime.ac.currentTime,.05);};
  runtime.$("rVolume").onchange=()=>runtime.save();
  for(const id of ['bSky','bSession'])runtime.$(id).addEventListener('click',()=>runtime.$('mJournal').hidden=true);
  runtime.$("muClose").onclick=()=>{runtime.$("mMusic").hidden=true;runtime.save();};
  runtime.$("muMute").onclick=()=>{runtime.S.sound=!runtime.S.sound;styleUI();runtime.audio();if(runtime.master)runtime.master.gain.setTargetAtTime(runtime.musicVolume(),runtime.ac.currentTime,.05);runtime.save();};
  runtime.$("dFill").onclick=()=>{if(runtime.isFree())return;if(runtime.S.lastDay!==runtime.S.todayKey)runtime.onFirstLight();const add=runtime.CAP-runtime.S.todayLight;runtime.S.todayLight=runtime.CAP;runtime.S.totalLight+=add;runtime.S.capShown=true;runtime.unlock("tope");runtime.hud();runtime.openCap();};
  runtime.$("dNext").onclick=()=>{runtime.S.offset+=1;runtime.checkDay(true);runtime.hud();runtime.showPhrase("Nuevo día. Recoge una luz para entrar.");};
  runtime.$("dSkip").onclick=()=>{runtime.S.offset+=2;runtime.checkDay(true);runtime.hud();runtime.showPhrase("Tu crecimiento sigue aquí. Recoge una luz para volver.");};
  let armed=false;runtime.$("dReset").onclick=e=>{if(!armed){armed=true;e.target.textContent="¿Seguro?";setTimeout(()=>{armed=false;e.target.textContent="Reiniciar";},2500);return;}const snd=runtime.S.sound,st=runtime.S.style;runtime.stopAutopilot?.();runtime.resetJam?.();runtime.clearPowers?.();runtime.quietReset?.();runtime.fxReset?.();runtime.MU.q8=[];runtime.MU.queue=[];runtime.S=runtime.fresh();runtime.S.sound=snd;runtime.S.style=st;runtime.S.help={camino:true,mundo:false};runtime.S.py=runtime.pathY(0);runtime.jamUI?.();runtime.creativeModeUI?.();styleUI();runtime.collected=new Set();runtime.chunks.clear();runtime.wchunks.clear();runtime.checkDay();runtime.hud();runtime.save();e.target.textContent="Reiniciar";armed=false;};


  Object.defineProperties(runtime, {
    styleUI: { get: () => styleUI },
  });
}
