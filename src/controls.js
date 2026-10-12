// Eventos de botones y controles de prototipo.
export function initialize(runtime) {
  /* ---------- botones ---------- */
  runtime.$("hcGo").onclick=()=>{runtime.S.help.camino=true;runtime.$("mHelpC").hidden=true;runtime.audio();if(!runtime.S.voiceStart){runtime.S.voiceStart=true;setTimeout(()=>runtime.say(runtime.VOZ.start),900);}runtime.save();};
  runtime.$("bMenu").onclick=()=>{runtime.$("mMenu").hidden=false;};runtime.$("mnClose").onclick=()=>{runtime.$("mMenu").hidden=true;};
  document.querySelectorAll("#mMenu .tiles button,#mMenu .devbox button").forEach(b=>b.addEventListener("click",()=>{if(b.id!=="dReset")runtime.$("mMenu").hidden=true;}));
  runtime.$("bPrimary").onclick=()=>{if(runtime.inWorld())runtime.exitWorld(false);else runtime.enterWorld();};
  runtime.$("bStudio").onclick=runtime.enterStudio;runtime.$("bDeploy").onclick=runtime.deployStudio;runtime.$("stExit").onclick=runtime.exitStudio;
  runtime.$("oDeploy").onclick=()=>{runtime.$("mOut").hidden=true;runtime.deployStudio();};
  runtime.$("bag").onclick=e=>{const b=e.target.closest("button");if(!b)return;runtime.selSample=b.dataset.s;runtime.renderBag();};
  runtime.$("swatches").onclick=e=>{const b=e.target.closest("button");if(!b||b.disabled)return;runtime.S.color=runtime.COLORS[+b.dataset.c][0];runtime.renderBag();runtime.save();};
  let armC=false;runtime.$("stClear").onclick=e=>{if(!armC){armC=true;e.target.textContent="¿Seguro?";setTimeout(()=>{armC=false;e.target.textContent="Vaciar";},2500);return;}for(const k in runtime.S.studio.slots){const t=runtime.S.studio.slots[k];runtime.S.bag[t]=Math.min(9,(runtime.S.bag[t]||0)+1);}runtime.S.studio.slots={};armC=false;e.target.textContent="Vaciar";runtime.renderBag();runtime.save();runtime.hud();};
  runtime.$("hwGo").onclick=()=>{runtime.S.help.mundo=true;runtime.save();runtime.$("mHelpW").hidden=true;runtime.showRegion(runtime.regionOfPos(runtime.S.wx,runtime.S.wy),true);};
  runtime.$("bShare").onclick=()=>runtime.shareCard(runtime.inWorld()||runtime.S.stars.length?"sky":"day");runtime.$("cShare").onclick=()=>{runtime.$("mCap").hidden=true;runtime.shareCard("day");};
  runtime.$("cExplore").onclick=()=>{runtime.$("mCap").hidden=true;runtime.enterWorld();};
  runtime.$("bWorld").onclick=()=>{if(runtime.inWorld())runtime.exitWorld(false);else runtime.enterWorld();};
  runtime.$("bSky").onclick=runtime.openSky;runtime.$("kClose").onclick=()=>{runtime.$("mSky").hidden=true;};runtime.$("kShare").onclick=()=>{runtime.$("mSky").hidden=true;runtime.shareCard("sky");};
  runtime.$("oSky").onclick=()=>{runtime.$("mOut").hidden=true;runtime.openSky();};runtime.$("oClose").onclick=()=>{runtime.$("mOut").hidden=true;};
  runtime.$("bAch").onclick=runtime.openAch;runtime.$("aClose").onclick=()=>{runtime.$("mAch").hidden=true;};
  runtime.$("sClose").onclick=()=>{runtime.$("mShare").hidden=true;};
  const rs=runtime.$("rStyle");
  const styleName=I=>I<.2?"Ambiente":I<.45?"Minimal":I<.72?"Deep":"Underground";
  function styleUI(){const I=runtime.style();rs.value=Math.round(I*100);runtime.$("styleNow").textContent=styleName(I);runtime.$("muMute").textContent=runtime.S.sound?"Silenciar":"Activar sonido";runtime.$("bSound").querySelector("span").textContent=runtime.S.sound?"Música":"Silencio";}
  rs.oninput=()=>{runtime.S.style=rs.value/100;styleUI();runtime.audio();if(runtime.S.style>=.9)runtime.unlock("under");};
  rs.onchange=()=>{const n=Date.now();runtime.styleMoves=runtime.styleMoves.filter(x=>n-x<60000);runtime.styleMoves.push(n);if(runtime.styleMoves.length>=12)runtime.unlock("dj");runtime.save();};
  runtime.$("bSound").onclick=()=>{runtime.S.sound=!runtime.S.sound;styleUI();runtime.audio();if(runtime.master)runtime.master.gain.setTargetAtTime(runtime.S.sound?.85:0,runtime.ac.currentTime,.05);runtime.toast(runtime.S.sound?"<em>Música</em> · activada":"<em>Música</em> · en silencio");runtime.save();};
  runtime.$("muClose").onclick=()=>{runtime.$("mMusic").hidden=true;runtime.save();};
  runtime.$("muMute").onclick=()=>{runtime.S.sound=!runtime.S.sound;styleUI();runtime.audio();if(runtime.master)runtime.master.gain.setTargetAtTime(runtime.S.sound?.85:0,runtime.ac.currentTime,.05);runtime.save();};
  runtime.$("dFill").onclick=()=>{runtime.audio();if(runtime.isFree())return;if(runtime.S.lastDay!==runtime.S.todayKey)runtime.onFirstLight();const add=runtime.CAP-runtime.S.todayLight;runtime.S.todayLight=runtime.CAP;runtime.S.totalLight+=add;runtime.S.capShown=true;runtime.unlock("tope");runtime.hud();runtime.openCap();};
  runtime.$("dNext").onclick=()=>{runtime.S.offset+=1;runtime.checkDay();runtime.hud();runtime.showPhrase("Nuevo día. Tu luz se recargó.");};
  runtime.$("dSkip").onclick=()=>{runtime.S.offset+=2;runtime.checkDay();runtime.hud();runtime.showPhrase("Fallaste un día. Tu crecimiento sigue aquí.");};
  let armed=false;runtime.$("dReset").onclick=e=>{if(!armed){armed=true;e.target.textContent="¿Seguro?";setTimeout(()=>{armed=false;e.target.textContent="Reiniciar";},2500);return;}const snd=runtime.S.sound,st=runtime.S.style;runtime.S=runtime.fresh();runtime.S.sound=snd;runtime.S.style=st;runtime.S.help={camino:true,mundo:false};runtime.S.py=runtime.pathY(0);runtime.collected=new Set();runtime.chunks.clear();runtime.wchunks.clear();runtime.checkDay();runtime.hud();runtime.save();e.target.textContent="Reiniciar";armed=false;};


  Object.defineProperties(runtime, {
    styleUI: { get: () => styleUI },
  });
}
