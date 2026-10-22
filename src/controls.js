import {initialize as controlMotion} from './control-motion.js';
// Eventos de botones y controles de prototipo.
export function initialize(runtime) {
  const motion=controlMotion(runtime);
  /* ---------- botones ---------- */
  runtime.$("bSession").onclick=runtime.openSession;
  runtime.$("oSession").onclick=()=>{runtime.$("mOut").hidden=true;runtime.openJournal("today");};
  runtime.$("sessionClose").onclick=()=>{runtime.$("mSession").hidden=true;};
  runtime.$("sessionShare").onclick=runtime.shareSession;
  runtime.$("hcGo").onclick=()=>{runtime.S.help.camino=true;runtime.$("mHelpC").hidden=true;if(runtime.S.sound)runtime.audio();if(!runtime.S.voiceStart){runtime.S.voiceStart=true;setTimeout(()=>runtime.say(runtime.VOZ.start),900);}runtime.save();};
  // The menu opens on who you are and where: name, cube, sparks and place.
  function menuSummary(){const S=runtime.S,$=runtime.$,name=(S.playerProfile?.name||'').trim();$("menuTitle").textContent=name||'Kubono';$("menuAvatar").style.background=runtime.cubeColor?.()||'#fff';
   const place=S.mode==='studio'?'Refugio':runtime.inWorld()?((S.layer&&S.layer!=='superficie')?(S.layer==='bajo'?'Subsuelo':'Cielo'):runtime.regionOfPos?.(S.wx,S.wy)?.name):'Camino';$("menuSummary").textContent=['✦ '+Math.floor(S.sparks||0)+' chispas',place].filter(Boolean).join(' · ');}
  runtime.$("bMenu").onclick=()=>{volumeUI();menuSummary();runtime.houseMenuNote?.();runtime.$("mMenu").hidden=false;};runtime.$("mnClose").onclick=()=>{runtime.$("mMenu").hidden=true;};
  document.querySelectorAll("#mMenu .tiles button,#mMenu .devbox button").forEach(b=>b.addEventListener("click",()=>{if(b.id!=="dReset")runtime.$("mMenu").hidden=true;}));
  runtime.$("bPrimary").onclick=()=>{if(runtime.inWorld())runtime.exitWorld(false);else motion.enter(runtime.$('bPrimary'));};
  runtime.$("bStudio").onclick=runtime.enterStudio;runtime.$("bDeploy").onclick=runtime.deployStudio;runtime.$("stExit").onclick=()=>runtime.houseBack();
  runtime.$("oDeploy").onclick=()=>{runtime.$("mOut").hidden=true;runtime.deployStudio();};
  runtime.$("bag").onclick=e=>{const b=e.target.closest("button");if(!b)return;runtime.selSample=b.dataset.s;runtime.renderBag();};
  runtime.$("swatches").onclick=e=>{const b=e.target.closest("button"),cube=runtime.cubeSettings?.();if(!b||b.disabled||cube&&cube.version!==2)return;runtime.S.color=runtime.COLORS[+b.dataset.c][0];runtime.S.cube={...cube,color:runtime.S.color};runtime.renderBag();runtime.save();};
  let armC=false;runtime.$("stClear").onclick=e=>{if(!armC){armC=true;e.target.textContent="¿Seguro?";setTimeout(()=>{armC=false;e.target.textContent="Vaciar";},2500);return;}for(const k in runtime.S.studio.slots){const t=runtime.S.studio.slots[k];runtime.S.bag[t]=Math.min(9,(runtime.S.bag[t]||0)+1);}runtime.S.studio.slots={};armC=false;e.target.textContent="Vaciar";runtime.renderBag();runtime.save();runtime.hud();};
  runtime.$("hwGo").onclick=()=>{runtime.S.help.mundo=true;runtime.save();runtime.$("mHelpW").hidden=true;runtime.showRegion(runtime.regionOfPos(runtime.S.wx,runtime.S.wy),true);};
  runtime.$("bShare").onclick=()=>runtime.shareCard(runtime.inWorld()||runtime.S.stars.length?"sky":"day");runtime.$("cShare").onclick=()=>{runtime.$("mCap").hidden=true;runtime.shareCard("day");};
  runtime.$("cExplore").onclick=()=>motion.enter(runtime.$('cExplore'),()=>runtime.$('mCap').hidden=true);
  runtime.$("bWorld").onclick=()=>{if(runtime.inWorld())runtime.exitWorld(false);else runtime.enterWorld();};
  runtime.$("bSky").onclick=runtime.openSky;runtime.$("kClose").onclick=()=>{runtime.$("mSky").hidden=true;};runtime.$("kShare").onclick=()=>{runtime.$("mSky").hidden=true;runtime.shareCard("sky");};
  runtime.$("oSky").onclick=()=>{runtime.$("mOut").hidden=true;runtime.openJournal("places");};runtime.$("oClose").onclick=()=>{runtime.$("mOut").hidden=true;};
  runtime.$("bAch").onclick=runtime.openJournal;
  runtime.$("sClose").onclick=()=>{runtime.$("mShare").hidden=true;};
  runtime.$("bSoft").onclick=()=>{runtime.S.softMusic=!runtime.S.softMusic;runtime.$("bSoft").setAttribute('aria-pressed',String(runtime.S.softMusic));runtime.audio();runtime.applyComfort();runtime.toast(runtime.S.softMusic?'Calma · sí':'Calma · no');runtime.save();};
  runtime.$("bSoft").setAttribute('aria-pressed',String(!!runtime.S.softMusic));
  const livingUI=()=>{runtime.$('bLivingMusic').hidden=true;runtime.$('bLivingMusic').textContent='Música electrónica generativa';};
  Object.defineProperty(runtime,'refreshLivingMusic',{get:()=>livingUI});
  runtime.$('bLivingMusic').onclick=()=>{};livingUI();
  runtime.$("bMusicSettings").onclick=()=>{styleUI();runtime.$("mMusic").hidden=false;};
  const rs=runtime.$("rStyle");
  const styleName=I=>I<.3?'Suave':I<.7?'Equilibrada':'Energética';
  function styleUI(){livingUI();runtime.$("bSoft").setAttribute("aria-pressed",String(!!runtime.S.softMusic));runtime.$("rVolume").value=Math.round((runtime.S.outputVolume??1)*100);const I=Number.isFinite(runtime.S.musicEnergy)?Math.max(0,Math.min(1,runtime.S.musicEnergy)):.5;rs.value=Math.round(I*100);rs.setAttribute('aria-valuetext',styleName(I)+' · '+Math.round(I*100)+'%');runtime.$("styleNow").textContent=styleName(I);runtime.$("muMute").textContent=runtime.S.sound?"Silenciar":"Activar sonido";runtime.$("bSound").querySelector("span").textContent=runtime.S.sound?"Sonido: sí":"Sonido: no";runtime.$("bSound").setAttribute('aria-pressed',String(!!runtime.S.sound));}
  rs.oninput=()=>{runtime.S.musicEnergy=runtime.S.style=rs.value/100;styleUI();};
  rs.onchange=()=>runtime.save();
  runtime.$("bSound").onclick=()=>{runtime.S.sound=!runtime.S.sound;styleUI();runtime.audio();if(runtime.master)runtime.master.gain.setTargetAtTime(runtime.musicVolume(),runtime.ac.currentTime,.05);runtime.toast(runtime.S.sound?"<em>Música</em> · activada":"<em>Música</em> · en silencio");runtime.save();};
  runtime.$("bSettings").onclick=()=>{runtime.$("mMenu").hidden=true;runtime.$("haptics").checked=runtime.S.haptics!==false;runtime.$("colorSafe").checked=!!runtime.S.colorSafe;runtime.$("mSettings").hidden=false;};runtime.$("haptics").onchange=e=>{runtime.S.haptics=e.target.checked;runtime.save();if(e.target.checked)runtime.journeyVibrate?.(12);};
  runtime.$("settingsClose").onclick=()=>runtime.$("mSettings").hidden=true;
  function volumeUI(){const value=Math.round(Math.max(0,Math.min(1,Number.isFinite(runtime.S.outputVolume)?runtime.S.outputVolume:1))*100);for(const id of ['rVolume','rMenuVolume']){if(!runtime.$(id))continue;runtime.$(id).value=value;runtime.$(id).setAttribute('aria-valuetext',value+'%');}for(const id of ['volumeNow','menuVolumeNow'])if(runtime.$(id))runtime.$(id).textContent=value+'%';}
  for(const id of ['rVolume','rMenuVolume']){if(!runtime.$(id))continue;runtime.$(id).oninput=e=>{const value=Number(e.target.value);if(!Number.isFinite(value))return;runtime.S.outputVolume=Math.max(0,Math.min(1,value/100));volumeUI();if(runtime.master)runtime.master.gain.setTargetAtTime(runtime.musicVolume(),runtime.ac.currentTime,.05);};runtime.$(id).onchange=()=>runtime.save();}volumeUI();
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
