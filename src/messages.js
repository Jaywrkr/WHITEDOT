import {rememberVoice} from './voice-guide.js';
// Mensajes y animación de la Voz del sistema.
export function initialize(runtime) {
  let voiceQ=[],voicing=false,lastText=null,lastAt=-Infinity,hideTimer;
  function say(text,title){if(!text)return;rememberVoice(runtime.S||{},text,title,{region:runtime.MU?.dnaT?.key||''});const now=performance.now();if(text===lastText&&now-lastAt<60000)return;if(runtime.inWorld?.()&&!title?.startsWith('Logro')&&(document.querySelector('.glasspanel:not([hidden])')||(runtime.MU.speed<.08&&now-(runtime.lastCreativeAction??-Infinity)<15000)))return;lastText=text;lastAt=now;if(voiceQ.length>=3)voiceQ.shift();voiceQ.push({text,title:title||"Sistema"});nextVoice();}
  function nextVoice(){if(voicing||!voiceQ.length)return;voicing=true;const v=voiceQ.shift(),el=document.getElementById("voice"),tx=document.getElementById("vX");document.getElementById("vT").textContent=v.title;tx.textContent="";
    // Estilo J: "~~antes~~ después" shows the struck phrase at once and types the correction.
    const strike=/^~~(.+?)~~\s*(.*)$/.exec(v.text),text=strike?strike[2]:v.text;
    el.querySelectorAll('s').forEach(s=>s.remove());if(strike){const s=document.createElement('s');s.textContent=strike[1];tx.before(s);}el.classList.remove("expanded");el.setAttribute("aria-expanded","false");el.setAttribute('aria-label','Ampliar mensaje del sistema');el.tabIndex=0;el.classList.add("on");document.getElementById('voiceAnnouncement').textContent=v.title+' · '+text;
    let i=0;const iv=setInterval(()=>{i+=2;tx.textContent=text.slice(0,i);if(i>=text.length)clearInterval(iv);},22);
    hideTimer=setTimeout(hide,Math.max(3800,v.text.length*55+1200));}

  function hide(){const el=document.getElementById('voice');if(el.classList.contains('expanded'))return;el.classList.remove('on');setTimeout(()=>el.querySelectorAll('s').forEach(s=>s.remove()),340);el.tabIndex=-1;if(document.activeElement===el&&!document.querySelector('.modal:not([hidden])'))document.getElementById('w').focus({preventScroll:true});setTimeout(()=>{voicing=false;nextVoice();},350);}

  const panel=document.getElementById('voice');
  const expand=()=>{const expanded=panel.classList.toggle('expanded');panel.setAttribute('aria-expanded',String(expanded));panel.setAttribute('aria-label',expanded?'Contraer mensaje del sistema':'Ampliar mensaje del sistema');clearTimeout(hideTimer);if(!expanded)hideTimer=setTimeout(hide,3800);};
  panel.addEventListener('click',expand);
  panel.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();expand();}if(event.key==='Escape'&&panel.classList.contains('expanded')){event.preventDefault();expand();}});

  Object.defineProperties(runtime, {
    say: { get: () => say },
  });
}
