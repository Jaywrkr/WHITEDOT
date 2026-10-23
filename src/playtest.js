import {RELEASE} from './release-info.js';
// Tests with people (phase 7 of the Journey's plan, docs/PRUEBAS_CON_PERSONAS.md). Opened once with ?prueba=1 on the
// phone used for the tests, it notes on that phone only how each person plays: time in each chapter, pulses on time,
// the longest stillness and the ghost finger. Nothing is sent anywhere and the game is unchanged. ?prueba=ver shows
// the notes to copy; ?prueba=0 stops it. Notes live in their own key, never in the save.
export const PLAYTEST_KEY='kubono:prueba',PLAYTEST_ON='kubono:prueba:on',PLAYTEST_SESSIONS=30,PLAYTEST_STILL=15000;
export const CHAPTER_NAMES=Object.freeze({camino:'Camino',llanura:'Llanura',lago:'Lago',bosque:'Bosque',tormenta:'Tormenta',vacio:'Vacío',refugio:'Refugio',libre:'Mundo libre',menu:'Inicio'});
const store=()=>{try{return globalThis.localStorage||null;}catch(_){return null;}};
export function playtestParam(search=globalThis.location?.search){try{return new URLSearchParams(search||'').get('prueba');}catch(_){return null;}}
// Old or broken notes never stop the game: anything unreadable is dropped, the rest is kept.
export function normalizeSessions(raw){const list=Array.isArray(raw)?raw:[];return list.filter(s=>s&&typeof s==='object'&&Number.isFinite(s.start)).slice(-PLAYTEST_SESSIONS).map(s=>({
 start:s.start,ms:Number.isFinite(s.ms)?Math.max(0,s.ms):0,festival:s.festival===true,version:typeof s.version==='string'?s.version.slice(0,40):'',finished:s.finished===true,
 order:Array.isArray(s.order)?s.order.filter(id=>typeof id==='string'&&CHAPTER_NAMES[id]).slice(0,20):[],
 chapters:Object.fromEntries(Object.entries(s.chapters&&typeof s.chapters==='object'?s.chapters:{}).filter(([id])=>CHAPTER_NAMES[id]).map(([id,c])=>[id,{
  ms:Math.max(0,+c?.ms||0),hits:Math.max(0,Math.round(+c?.hits||0)),misses:Math.max(0,Math.round(+c?.misses||0)),still:Math.max(0,+c?.still||0),stills:Math.max(0,Math.round(+c?.stills||0)),hints:Math.max(0,Math.round(+c?.hints||0)),done:c?.done===true}]))}));}
const clock=ms=>{const s=Math.round(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
const when=t=>{const d=new Date(t);return d.toLocaleDateString('es',{day:'numeric',month:'short'})+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');};
// One block per person, one line per chapter: what Jay copies and sends.
export function summarize(sessions){const list=normalizeSessions(sessions).filter(s=>s.order.length&&s.ms>=5000);if(!list.length)return 'Sin pruebas todavía.';
 return list.map((s,i)=>{const head='Persona '+(i+1)+' · '+when(s.start)+' · '+clock(s.ms)+(s.festival?' · festival':'')+(s.finished?' · terminó':'')+(s.version?' · '+s.version:'');
  const lines=s.order.map(id=>{const c=s.chapters[id]||{},all=c.hits+c.misses;return CHAPTER_NAMES[id]+' '+clock(c.ms)+(c.done?' ✓':'')+' · '+c.hits+'/'+all+' a tiempo'+(all?' ('+Math.round(c.hits/all*100)+'%)':'')+' · quieto máx '+Math.round(c.still/1000)+' s'+(c.stills?' ('+c.stills+(c.stills===1?' vez':' veces')+' más de 15 s)':'')+(c.hints?' · dedo '+c.hints:'');});
  return [head,...lines].join('\n');}).join('\n\n');}
export function initialize(runtime){
 const param=playtestParam(),db=store();
 if(param==='0'){try{db?.removeItem(PLAYTEST_ON);}catch(_){}}
 if(param==='1'){try{db?.setItem(PLAYTEST_ON,'1');}catch(_){}}
 const on=(()=>{try{return db?.getItem(PLAYTEST_ON)==='1';}catch(_){return false;}})();
 const read=()=>{try{return normalizeSessions(JSON.parse(db?.getItem(PLAYTEST_KEY)||'[]'));}catch(_){return [];}};
 let sessions=read(),session=null,last=0,lastInput=0,still=0,hits=null,misses=null,hinting=false,current=null;
 // Where the person is now: the Journey's chapter, the free World, or the first screen.
 function place(){if(runtime.journeyQuiet?.()===false)return 'libre';const id=runtime.journeyChapter?.()?.id;return CHAPTER_NAMES[id]?id:'menu';}
 function write(){if(!session)return;try{db?.setItem(PLAYTEST_KEY,JSON.stringify(sessions));}catch(_){}}
 function chapter(id){if(!session.chapters[id])session.chapters[id]={ms:0,hits:0,misses:0,still:0,stills:0,hints:0,done:false};if(session.order[session.order.length-1]!==id&&session.order.length<20)session.order.push(id);return session.chapters[id];}
 function input(){const now=performance.now();if(session&&current){const gap=now-lastInput;const c=chapter(current);if(gap>c.still)c.still=gap;}lastInput=now;still=0;}
 function tick(){if(!session||document.hidden)return;const now=performance.now(),dt=Math.min(2000,now-last);last=now;const id=place();
  if(id==='menu'&&!session.order.length){lastInput=now;return;}
  if(id!==current){current=id;lastInput=now;still=0;}const c=chapter(id);c.ms+=dt;session.ms+=dt;
  const p=runtime.journeyPulseState?.();if(p){if(hits!==null){c.hits+=Math.max(0,p.hits-hits);c.misses+=Math.max(0,p.misses-misses);}hits=p.hits;misses=p.misses;}
  const quiet=now-lastInput;if(quiet>c.still)c.still=quiet;if(quiet>=PLAYTEST_STILL&&!still){still=1;c.stills++;}
  const showing=!!runtime.journeyHint?.()?.showing;if(showing&&!hinting)c.hints++;hinting=showing;
  const done=runtime.journeyChapter?.()?.done||{};for(const k of Object.keys(done))if(session.chapters[k]&&done[k])session.chapters[k].done=true;
  if(runtime.journeyFinaleState?.()?.running||id==='libre'&&session.order.includes('refugio'))session.finished=true;}
 // Only what a person plays is noted: opening the notes is not a session.
 if(on&&param!=='ver'){session={start:Date.now(),ms:0,festival:runtime.festival===true,version:RELEASE.version,finished:false,order:[],chapters:{}};
  sessions.push(session);if(sessions.length>PLAYTEST_SESSIONS)sessions.splice(0,sessions.length-PLAYTEST_SESSIONS);last=lastInput=performance.now();
  for(const k of ['pointerdown','keydown','touchstart'])globalThis.addEventListener?.(k,input,{passive:true,capture:true});
  setInterval(()=>{tick();},1000);setInterval(write,5000);document.addEventListener?.('visibilitychange',()=>{if(document.hidden)write();else last=lastInput=performance.now();});globalThis.addEventListener?.('pagehide',write);}
 // ?prueba=ver: the notes on screen, to copy and send, or to clear before a new day of tests.
 function show(){const box=document.getElementById('mPlaytest');if(!box)return;const text=summarize(read());document.getElementById('playtestText').textContent=text;box.hidden=false;
  const status=document.getElementById('playtestStatus');status.textContent='';
  document.getElementById('playtestCopy').onclick=async()=>{try{await navigator.clipboard.writeText(text);status.textContent='Copiado.';}catch(_){const r=document.createRange();r.selectNodeContents(document.getElementById('playtestText'));const sel=getSelection();sel.removeAllRanges();sel.addRange(r);status.textContent='Selecciona y copia.';}};
  const clear=document.getElementById('playtestClear');clear.textContent='Borrar notas';clear.onclick=()=>{if(clear.dataset.sure!=='1'){clear.dataset.sure='1';clear.textContent='Toca otra vez para borrar';return;}clear.dataset.sure='';try{db?.removeItem(PLAYTEST_KEY);}catch(_){}sessions=session?[session]:[];if(session){session.order=[];session.chapters={};session.ms=0;}document.getElementById('playtestText').textContent=summarize([]);status.textContent='Borradas.';clear.textContent='Borrar notas';};
  document.getElementById('playtestClose').onclick=()=>{box.hidden=true;};}
 if(param==='ver')setTimeout(show,300);
 Object.defineProperties(runtime,{playtest:{get:()=>()=>({on,sessions:read().length,current:session?JSON.parse(JSON.stringify(session)):null})},playtestShow:{get:()=>show},playtestTick:{get:()=>tick},playtestWrite:{get:()=>write}});
}
