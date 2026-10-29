// Reto entre dos (Jay, 29 Oct 2026, alpha.239, «Con Luca»; the rules in duos-model.js; docs/MUNDO.md#con-luca). The
// sheet (from a place's portal sheet or from Lugares): the place, who plays, the mark («Marca de Dos: 0:42 · ¿la
// superas?»), «Jugar», the names and erasing the mark. A challenge round is an ordinary round of places.js (same ★, same
// song, no sparks); this module only keeps its own path and, when the round closes, compares it with the mark. The rival's
// ghost runs with you through ritmo.js (runtime.duoGhost). You can leave as from any round and lose nothing; the mark
// stays. Loaded by the ring (places-ring.js).
import {PLACES,roundTime} from './places.js';
import {freeOpen} from './journey-mode.js';
import {openSurface} from './frame-state.js';
import {ghostRecorder,ghostSample,ghostFrom} from './ritmo-model.js';
import {DUOS_VERSION,DUO_SYMBOLS,DUO_DEFAULTS,DUO_NAME_MAX,normalizeDuos,duoOffered,duoPlaces,duoKeep,markLine,resultLine,cleanName,other} from './duos-model.js';
export function initialize(runtime){
 const $=id=>globalThis.document?.getElementById(id),doc=globalThis.document;
 const placeName=id=>PLACES.find(p=>p.id===id)?.name||id;
 const places=()=>runtime.placesData?.();
 let owner=null,state=null;
 function own(){if(owner!==runtime.S){owner=runtime.S;runtime.S.duos=normalizeDuos(runtime.S.duos);state=runtime.S.duos;pending=null;active=null;finished=null;}return state;}
 const writable=()=>own().version===DUOS_VERSION;
 // Every write goes back as it was when the save fails.
 function commit(change){if(!writable())return false;const before=structuredClone(own());change(state);if(runtime.save?.()===false){runtime.S.duos=before;state=before;return false;}return true;}
 // A player as it is shown: symbol and name. A default name («Uno», «Dos») is the game's and is translated; a name the
 // players wrote is theirs and stays as written (translate="no").
 const who=i=>{const p=own().players?.[i]||DUO_DEFAULTS[i];return {text:`${p.sym} ${p.name}`,mine:p.name!==DUO_DEFAULTS[i].name};};
 function nameNode(i){const w=who(i),s=doc.createElement('span');s.className='duo-who';s.textContent=w.text;if(w.mine)s.setAttribute('translate','no');return s;}
 const esc=v=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const nameHTML=i=>{const w=who(i);return `<span class="duo-who"${w.mine?' translate="no"':''}>${esc(w.text)}</span>`;};
 // ---------- a challenge round ----------
 let pending=null,active=null,finished=null;
 const roundsOf=id=>places()?.best?.[id]?.rounds||0;
 // The round just started is a challenge when it is the place asked for, played as an ordinary round.
 function adopt(){own();const run=runtime.placeRun?.();if(!run||!pending)return active;if(run.id===pending.id&&!run.maestro&&!run.remix&&!run.free&&(!active||active.run!==run)){const m=own().marks[run.id];
   active={id:run.id,by:pending.by,run,origin:{x:runtime.S.wx,y:runtime.S.wy},rec:ghostRecorder(),rounds:roundsOf(run.id),mark:m?structuredClone(m):null,calm:false,shown:''};}pending=null;return active;}
 // The round is the same object from start to close (places.js keeps it in S.lugares.run).
 const live=()=>{const run=runtime.placeRun?.();adopt();return run&&active&&active.run===run?active:null;};
 // Start a challenge: from the portal (beside it) or from Lugares (to its portal, like «Ir»).
 function start(id,by,{from=null}={}){const d=places();if(!writable()||!duoOffered(d,id)||runtime.placeRun?.()||runtime.ritmoDuelActive?.())return false;const was={turn:state.turn,place:state.place};state.turn=by===1?1:0;state.place=id;pending={id,by:state.turn};let ok=false;
  if(from)ok=!!runtime.startPlace?.(id,{from});else{if(runtime.houseActive?.())runtime.exitHouse?.();if(runtime.S.mode==='camino'&&freeOpen(runtime.S.journey))runtime.enterWorld?.({automatic:true});ok=!!runtime.ringGo?.(id);}
  if(!ok){pending=null;Object.assign(state,was);return false;}adopt();if(!active)return false;runtime.save?.();live_();return true;}
 // A round closed (its ★ already kept by places.js): the time against the mark; the mark kept when it is the first or better.
 function done(a,last){const day=runtime.S.todayKey||'',kept=duoKeep(own().marks,a.id,{by:a.by,ms:last.ms,onTime:last.onTime,sound:last.sound!==false,calm:a.calm,day,ghost:a.rec.pts.length>=2?ghostFrom(a.rec,last.ms):null});
  let saved=true;if(!commit(s=>{if(kept.changed)s.marks[a.id]=kept.mark;s.turn=other(a.by);}))saved=false;
  finished={id:a.id,ms:last.ms,by:a.by,cmp:kept.cmp,holder:a.mark?a.mark.by:null,saved:saved||!kept.changed};}
 function track(){const run=runtime.placeRun?.(),S=runtime.S;adopt();
  if(active&&run&&run===active.run){ghostSample(active.rec,Date.now()-run.startedAt,S.wx-active.origin.x,S.wy-active.origin.y);if(runtime.tranquiloApplies?.())active.calm=true;return;}
  if(active){const a=active;active=null;if(roundsOf(a.id)>a.rounds){const last=runtime.places?.()?.last;if(last&&last.id===a.id)done(a,last);}}}
 // ---------- the line on screen while you play ----------
 // Who plays, their time and the mark: «● Uno · 0:12 / 0:42». No words to read in a hurry.
 function live_(){const box=$('duoLive');if(!box)return;const a=live(),show=!!a&&!openSurface('.modal:not([hidden])');if(box.hidden===show)box.hidden=!show;if(!show)return;
  const run=runtime.placeRun?.(),t=roundTime(Date.now()-run.startedAt)+(a.mark?' / '+roundTime(a.mark.ms):''),key=a.by+':'+t+':'+who(a.by).text;if(a.shown===key)return;a.shown=key;box.replaceChildren(nameNode(a.by),doc.createTextNode(' · '+t));}
 function tick(){if(!runtime.S)return;own();track();live_();}
 setInterval(()=>{try{tick();}catch(_){}},60)?.unref?.();
 // ---------- the card ----------
 // The round's card: who played and the time, then the comparison; «Le toca a …» starts the other player's round.
 function card(r){if(!finished||finished.id!==r?.id||finished.ms!==r.ms)return null;const f=finished,rows=[`Reto · ${nameHTML(f.by)} · ${roundTime(f.ms)}`],line=resultLine(f.cmp);if(line)rows.push(esc(line));
  if(f.cmp&&f.cmp.kind!=='first'&&f.cmp.kind!=='record'&&f.holder!==null){const lead='La marca es de';rows.push(`${lead} ${nameHTML(f.holder)}.`);}if(!f.saved)rows.push('No se pudo guardar la marca.');
  const next=other(f.by);return {rows,turn:{by:next,node:()=>{const frag=doc.createDocumentFragment();frag.append(doc.createTextNode('Le toca a '),nameNode(next));return frag;},go:from=>start(r.id,next,{from})}};}
 // ---------- the sheet ----------
 let sheetFrom=null,sheetId=null,chosen=0,clearAsked=false;
 function fillPlayers(){for(const i of [0,1]){const b=$('duoP'+i);if(!b)continue;b.replaceChildren(nameNode(i));b.setAttribute('aria-pressed',String(chosen===i));b.onclick=()=>{chosen=i;fillPlayers();};}}
 function fillMark(){const p=$('duoMark');if(!p)return;const m=own().marks[sheetId],l=markLine(m);clearAsked=false;
  if(l)p.replaceChildren(doc.createTextNode(l.lead+' '),nameNode(m.by),doc.createTextNode(': '),doc.createTextNode(l.time),doc.createTextNode(' · '),doc.createTextNode(l.ask));else p.textContent='Sin marca todavía. La primera ronda la deja.';
  const clear=$('duoClear');if(clear){clear.hidden=!m||!writable();clear.textContent='Borrar marca';}}
 function fillMarks(){const ul=$('duoMarks');if(!ul)return;ul.replaceChildren();const marks=own().marks;for(const p of PLACES){const m=marks[p.id];if(!m)continue;const li=doc.createElement('li');
   li.append(doc.createTextNode(p.name+' · '),nameNode(m.by),doc.createTextNode(' · '+roundTime(m.ms)));if(m.calm)li.append(doc.createTextNode(' · tranquilo'));ul.appendChild(li);}
  ul.hidden=!ul.children.length;const all=$('duoClearAll');if(all)all.hidden=!ul.children.length;}
 function fillPlace(){const sel=$('duoPlace'),ids=duoPlaces(places());if(!sel)return;sel.replaceChildren();for(const id of ids){const o=doc.createElement('option');o.value=id;o.textContent=placeName(id);sel.appendChild(o);}sel.value=sheetId;
  const fixed=!!sheetFrom;sel.hidden=fixed;const lab=$('duoPlaceLabel');if(lab)lab.hidden=fixed;sel.onchange=()=>{sheetId=sel.value;fill();};}
 function fill(){$('duoTitle').textContent=`Reto · ${placeName(sheetId)}`;fillPlace();fillPlayers();fillMark();fillMarks();}
 function fillEdit(){for(const i of [0,1]){const p=own().players[i],input=$('duoName'+i),sym=$('duoSym'+i);if(input){input.value=p.name;input.maxLength=DUO_NAME_MAX;
    input.onchange=()=>{const v=cleanName(input.value,DUO_DEFAULTS[i].name);if(!commit(s=>{s.players[i].name=v;}))input.value=own().players[i].name;else input.value=v;fill();};}
   if(sym){sym.textContent=p.sym;sym.onclick=()=>{const n=DUO_SYMBOLS[(DUO_SYMBOLS.indexOf(own().players[i].sym)+1)%DUO_SYMBOLS.length];commit(s=>{s.players[i].sym=n;});fillEdit();fill();};}}}
 // Open the sheet for a place (from its portal: `from`, beside it) or for the last place chosen (from Lugares).
 function open({id=null,from=null}={}){const box=$('mDuo'),d=places();if(!box||!writable())return false;const ids=duoPlaces(d);if(!ids.length)return false;
  sheetFrom=from;sheetId=id&&ids.includes(id)?id:ids.includes(own().place)?own().place:ids[0];chosen=own().turn;const edit=$('duoEdit');if(edit)edit.hidden=true;fill();
  $('duoPlay').onclick=()=>{box.hidden=true;if(!start(sheetId,chosen,{from:sheetFrom}))runtime.toast?.('Ahora no se puede. Inténtalo en el Mundo.',{force:true});};
  const names=$('duoNames');names.textContent='Nombres';names.onclick=()=>{const e=$('duoEdit');if(!e)return;e.hidden=!e.hidden;names.textContent=e.hidden?'Nombres':'Listo';if(!e.hidden)fillEdit();};
  $('duoClear').onclick=()=>{const b=$('duoClear');if(!clearAsked){clearAsked=true;b.textContent='¿Borrar? Toca otra vez';return;}if(commit(s=>{delete s.marks[sheetId];}))runtime.toast?.('Marca borrada.',{force:true});fill();};
  const all=$('duoClearAll');if(all){let asked=false;all.textContent='Borrar todas las marcas';all.onclick=()=>{if(!asked){asked=true;all.textContent='¿Borrar todas? Toca otra vez';return;}if(commit(s=>{s.marks={};}))runtime.toast?.('Marcas borradas.',{force:true});all.textContent='Borrar todas las marcas';asked=false;fill();};}
  $('duoClose').onclick=()=>{box.hidden=true;};box.hidden=false;return true;}
 // Lugares: one line, «Reto entre dos ›», after the Journey (like «Volver al anillo») once a place is complete.
 // Far from the ring, «Volver al anillo» leads Lugares; the challenge waits until you are back (and «Cerrar» stays whole).
 function lugares(){const link=$('lugaresDuo'),d=places();if(!link)return;const show=writable()&&!!d&&!d.readOnly&&runtime.S.journey?.finished===true&&duoPlaces(d).length>0&&!runtime.placeRun?.()&&!runtime.ringAway?.();link.hidden=!show;
  link.onclick=()=>{$('mLugares')&&($('mLugares').hidden=true);if(!open())runtime.toast?.('Ahora no se puede. Inténtalo en el Mundo.',{force:true});};}
 // ritmo.js asks, for a round, which ghost runs: undefined when it is not a challenge; the mark's path (or none) when it is.
 function ghost(run){if(!run)return undefined;adopt();if(!active||active.run!==run)return undefined;return active.mark?.ghost||null;}
 own();
 Object.defineProperties(runtime,{duoOpen:{get:()=>open},duoStart:{get:()=>start},duoCard:{get:()=>card},duoLugares:{get:()=>lugares},duoGhost:{get:()=>ghost},
  duoOffered:{get:()=>id=>writable()&&duoOffered(places(),id)&&!runtime.placeRun?.()},
  // Tests only (the runtime is never published).
  duoState:{get:()=>()=>({save:structuredClone(own()),active:active?{id:active.id,by:active.by,mark:!!active.mark,samples:active.rec.pts.length,calm:active.calm}:null,pending:pending?{...pending}:null,finished:finished?structuredClone(finished):null})}});
}
