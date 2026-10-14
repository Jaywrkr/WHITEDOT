import {INSTRUMENTS} from './journal.js';
const counts=s=>({places:Object.keys(s.places||{}).length,forms:Object.keys(s.cat||{}).length,quests:Object.keys(s.retos||{}).length,relics:s.stars.length});
export function startSession(s,now=Date.now()) {
  return {version:1,day:s.todayKey,started:now,seconds:0,baseline:counts(s),visited:{},genres:{},instruments:{},interactions:0,pulses:0};
}
export function summarizeSession(session,s) {
  if(!session)return null;
  const current=counts(s),result={day:session.day,seconds:Math.floor(session.seconds),interactions:session.interactions,pulses:session.pulses,visited:Object.values(session.visited),genres:Object.keys(session.genres),instruments:Object.keys(session.instruments)};
  for(const key of Object.keys(current))result[key]=Math.max(0,current[key]-session.baseline[key]);
  return result;
}
export function initialize(runtime) {
  if(runtime.S.session?.version!==1)runtime.S.session=null;
  function beginSession(){if(!runtime.S.session)runtime.S.session=startSession(runtime.S);}
  function finishSession(){if(runtime.S.session){runtime.S.lastSession=summarizeSession(runtime.S.session,runtime.S);runtime.S.session=null;}}
  function syncSession(){if(runtime.S.session&&!runtime.inWorld()&&!(runtime.S.mode==='studio'&&runtime.S.prevMode==='world')){finishSession();runtime.save();}}
  function sessionTime(dt){if(runtime.S.session)runtime.S.session.seconds+=Math.max(0,Math.min(.05,dt));}
  function sessionAction(kind){const s=runtime.S.session;if(s&&runtime.inWorld()){if(kind==='pulse')s.pulses++;else s.interactions++;}}
  function sessionVisit(region){if(runtime.S.session)runtime.S.session.visited[region.key]=region.name;}
  function sessionInstrument(id,region){const s=runtime.S.session;if(s){s.instruments[id]=1;if(region)s.genres[region.genre]=1;}}
  const sessionSummary=()=>runtime.S.session?summarizeSession(runtime.S.session,runtime.S):runtime.S.lastSession||null;
  const musicText=summary=>summary.genres.map(id=>runtime.GEN[id]?.name||id).join(' · ');
  function openSession(){
    const s=sessionSummary(),body=runtime.$('sessionBody');body.replaceChildren();
    const line=(title,text)=>{const p=document.createElement('p'),b=document.createElement('strong');b.textContent=title+' ';p.append(b,document.createTextNode(text));body.append(p);};
    if(!s)line('Tu sesión espera.','Entra al Mundo para explorar y hacer música.');
    else{
      line(runtime.S.session?'Sesión en curso':'Última sesión',`${s.day} · ${Math.floor(s.seconds/60)} min ${s.seconds%60} s de exploración`);
      line('Descubrimientos',`${s.places} lugares · ${s.forms} formas · ${s.quests} retos · ${s.relics} hallazgos`);
      line('Tu actividad',`${s.interactions} interacciones · ${s.pulses} pulsos`);
      line('Lugares visitados',s.visited.slice(0,8).join(' · ')||'Sin lugares registrados');
      line('Música escuchada',musicText(s)||'Sin música registrada');
      line('Instrumentos',s.instruments.map(id=>INSTRUMENTS[id]?.[0]||id).slice(0,10).join(' · ')||'Activa el sonido para registrarlos');
    }
    runtime.$('sessionShare').disabled=!s;runtime.$('mSession').hidden=false;
  }
  function shareSession(){
    const s=sessionSummary();if(!s)return;
    const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');
    x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);x.fillStyle=runtime.GOLD;x.font='52px "Geist Mono", monospace';x.fillText('MI SESIÓN EN EL MUNDO',80,140);
    x.fillStyle='#8a8a8f';x.font='28px "Geist Mono", monospace';x.fillText(`${s.day} · ${Math.floor(s.seconds/60)} min ${s.seconds%60} s`,80,205);
    x.fillStyle='#fff';x.font='40px "Geist Mono", monospace';
    [`${s.places} lugares nuevos`,`${s.forms} formas descubiertas`,`${s.quests} retos cumplidos`,`${s.relics} hallazgos`,`${s.interactions} interacciones · ${s.pulses} pulsos`].forEach((text,i)=>x.fillText(text,80,330+i*85));
    x.fillStyle=runtime.GOLD;x.font='28px "Geist Mono", monospace';x.fillText('MÚSICA ESCUCHADA',80,850);
    const names=s.genres.map(id=>runtime.GEN[id]?.name||id);x.fillStyle='#fff';x.font='30px "Geist Mono", monospace';
    (names.length?names.slice(0,5):['Una sesión de exploración']).forEach((name,i)=>x.fillText(name,80,925+i*45,920));
    x.fillStyle='#8a8a8f';x.font='26px "Geist Mono", monospace';x.fillText('WHITEDOT · PIXEL BLANCO · @jaywrkr',80,1250);
    runtime.$('shareImg').src=c.toDataURL('image/png');runtime.$('shareImg').alt='Resumen de mi sesión en WHITEDOT';runtime.$('mSession').hidden=true;runtime.$('mShare').hidden=false;
  }
  Object.defineProperties(runtime,{syncSession:{get:()=>syncSession},beginSession:{get:()=>beginSession},finishSession:{get:()=>finishSession},sessionTime:{get:()=>sessionTime},sessionAction:{get:()=>sessionAction},sessionVisit:{get:()=>sessionVisit},sessionInstrument:{get:()=>sessionInstrument},sessionSummary:{get:()=>sessionSummary},openSession:{get:()=>openSession},shareSession:{get:()=>shareSession}});
  if(runtime.inWorld())beginSession();
}
