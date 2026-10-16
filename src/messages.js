import {installNoticeLane} from './notice-lane.js';
import {rememberVoice} from './voice-guide.js';
export function voiceMaySpeak(state,title,{world=false,requested=false,exceptional=false}={}){
 if(!world||requested||exceptional)return true;
 if(!state?.help?.mundo)return true;
 const lesson=state.firstJourney;
 return !!lesson&&!lesson.skipped&&!lesson.readOnly&&['voice','pulse'].some(id=>lesson.facts?.[id]!==true);
}
// Mensajes y animación de la Voz del sistema.
export function initialize(runtime) {
  const lane=installNoticeLane(runtime);let state=runtime.S,voiceQ=[],voicing=false,lastText=null,lastAt=-Infinity,remaining=0,typeTimer;
  function say(text,title,options={}){if(!text)return;rememberVoice(runtime.S||{},text,title,{region:runtime.MU?.dnaT?.key||''});if(options.recordOnly)return;if(!voiceMaySpeak(runtime.S,title,{world:runtime.inWorld?.(),...options}))return;const now=performance.now();if(text===lastText&&now-lastAt<60000)return;if(!options.requested&&!options.exceptional&&runtime.inWorld?.()&&!title?.startsWith('Logro')&&(document.querySelector('.glasspanel:not([hidden])')||(runtime.MU.speed<.08&&now-(runtime.lastCreativeAction??-Infinity)<15000)))return;lastText=text;lastAt=now;if(!options.requested)voiceQ=voiceQ.filter(v=>v.requested);voiceQ.push({text,title:title||"Sistema",requested:!!options.requested,expires:now+(options.requested?60000:15000)});if(voiceQ.length>3)voiceQ.shift();lane.request('voice',{level:2});nextVoice();}
  function nextVoice(){voiceQ=voiceQ.filter(v=>v.expires>performance.now());if(!voiceQ.length&&!voicing)lane.cancel('voice');if(voicing||!voiceQ.length||!lane.claim('voice'))return;voicing=true;const v=voiceQ.shift(),el=document.getElementById("voice"),tx=document.getElementById("vX");document.getElementById("vT").textContent=v.title;tx.textContent="";
    // Estilo J: "~~antes~~ después" shows the struck phrase at once and types the correction.
    const strike=/^~~(.+?)~~\s*(.*)$/.exec(v.text),text=strike?strike[2]:v.text;
    el.querySelectorAll('s').forEach(s=>s.remove());if(strike){const s=document.createElement('s');s.textContent=strike[1];tx.before(s);}el.classList.remove("expanded");el.setAttribute("aria-expanded","false");el.setAttribute('aria-label','Ampliar mensaje del sistema');el.tabIndex=0;el.dataset.noticeLevel='2';lane.show(el);document.getElementById('voiceAnnouncement').textContent=v.title+' · '+text;
    let i=0;clearInterval(typeTimer);typeTimer=setInterval(()=>{i+=2;tx.textContent=text.slice(0,i);if(i>=text.length)clearInterval(typeTimer);},22);
    remaining=Math.min(9,Math.max(3.8,v.text.length*.055+1.2));}

  function hide(){const el=document.getElementById('voice'),focused=document.activeElement===el;if(el.classList.contains('expanded'))return;clearInterval(typeTimer);lane.hide(el);el.tabIndex=-1;voicing=false;lane.release('voice');if(voiceQ.length)lane.request('voice');if(focused&&!document.querySelector('.modal:not([hidden])'))document.getElementById('w').focus({preventScroll:true});}
  lane.register('voice',dt=>{const el=document.getElementById('voice');if(state!==runtime.S){state=runtime.S;voiceQ=[];voicing=false;clearInterval(typeTimer);lane.hide(el);el.tabIndex=-1;el.classList.remove('expanded');}
   if(lane.blocked()){el.hidden=true;return;}if(voicing){lane.show(el);if(!el.classList.contains('expanded')){remaining-=dt;if(remaining<=0)hide();}}else nextVoice();});

  const panel=document.getElementById('voice');
  const expand=()=>{const expanded=panel.classList.toggle('expanded');panel.setAttribute('aria-expanded',String(expanded));panel.setAttribute('aria-label',expanded?'Contraer mensaje del sistema':'Ampliar mensaje del sistema');if(!expanded)remaining=3.8;};
  panel.addEventListener('click',expand);
  panel.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();expand();}if(event.key==='Escape'&&panel.classList.contains('expanded')){event.preventDefault();expand();}});

  Object.defineProperties(runtime, {
    say: { get: () => say },
  });
}
