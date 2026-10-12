// Mensajes y animación de la Voz del sistema.
export function initialize(runtime) {
  let voiceQ=[],voicing=false;
  function say(text,title){if(!text)return;if(voiceQ.length>=3)voiceQ.shift();voiceQ.push({text,title:title||"Sistema"});nextVoice();}
  function nextVoice(){if(voicing||!voiceQ.length)return;voicing=true;const v=voiceQ.shift(),el=document.getElementById("voice"),tx=document.getElementById("vX");document.getElementById("vT").textContent=v.title;tx.textContent="";el.classList.remove("expanded");el.setAttribute("aria-expanded","false");el.classList.add("on");
    let i=0;const iv=setInterval(()=>{i+=2;tx.textContent=v.text.slice(0,i);if(i>=v.text.length)clearInterval(iv);},22);
    setTimeout(()=>{el.classList.remove("on");setTimeout(()=>{voicing=false;nextVoice();},350);},Math.max(3800,v.text.length*55+1200));}

  const panel=document.getElementById('voice');
  const expand=()=>{const expanded=panel.classList.toggle('expanded');panel.setAttribute('aria-expanded',String(expanded));};
  panel.addEventListener('click',expand);
  panel.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();expand();}});

  Object.defineProperties(runtime, {
    say: { get: () => say },
  });
}
