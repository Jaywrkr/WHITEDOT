import {PLACES,TOTAL_STARS,starCount,placeOpen,previousPlace,allComplete,nextOnPath,gameObjective,roundPercent} from './places.js';
import {PORTAL_NOTES} from './places-ring.js';
import {roomBox} from './house-view.js';
// The Refugio as the centre (plan F6, docs/MUNDO.md): it says what you have, what is missing and where to go.
// In the Sala, a shelf of eleven trophies: each place's gold thing once it has its ★, an empty socket before. Above it,
// the wall of stars (★ N / 33, white since panel 11: the stars under the trophies are the gold). In the house bar,
// «Lugares» opens Lugares (no number since panel 11, Q1: the HUD counts them): the map table (every place with its stars,
// record and what it asks; fast travel to the ones already entered) and the door to the ring.
export const TROPHY_SHELF=Object.freeze({x:34,y:76,gap:19});
// What comes next on the path (plan H3): the first closed place and the one to complete before it; null once all are open.
export function nextUnlock(places,journey){for(const p of PLACES)if(p.game&&!placeOpen(places,p.id,journey)){const prev=PLACES.find(q=>q.id===previousPlace(p.id));return {id:p.id,name:p.name,after:prev?.id||null,afterName:prev?.name||''};}return null;}
// One line under the wall: the place to play next, or the song once the eleven are complete, or the master version.
export function nextLine(places,journey){const have=starCount(places);if(have>=TOTAL_STARS)return 'Las 33 ★. La versión maestra de tu canción.';if(allComplete(places))return `Tu canción está completa. ${TOTAL_STARS-have} ★ para la versión maestra.`;
 const n=nextOnPath(places,journey);return n?`Siguiente: ${n.name}.`:'';}
// A trophy for each verb: the gold thing of its game, drawn small.
function trophy(c,game,x,y,r){c.beginPath();
 if(game==='stick'){c.rect(x-r*.7,y-r*.7,r*1.4,r*1.4);c.fill();return;}
 if(game==='chain'){for(const d of [-1,0,1]){c.moveTo(x+d*r*.8+r*.35,y);c.arc(x+d*r*.8,y,r*.35,0,6.283);}c.fill();return;}
 if(game==='lasso'){c.lineWidth=Math.max(1,r*.3);c.arc(x,y,r*.75,0,6.283);c.stroke();return;}
 if(game==='resonance'){c.lineWidth=Math.max(1,r*.25);for(let k=0;k<6;k++){const a=-Math.PI/2+k/6*6.283;k?c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r):c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}c.closePath();c.stroke();c.fillRect(x-r*.25,y-r*.25,r*.5,r*.5);return;}
 if(game==='echo'){c.lineWidth=Math.max(1,r*.22);for(const k of [.35,.65,.95]){c.beginPath();c.arc(x-r*.5,y,r*k,-.9,.9);c.stroke();}return;}
 if(game==='rebuild'){c.lineWidth=Math.max(1,r*.3);c.moveTo(x-r*.7,y+r);c.lineTo(x-r*.7,y-r*.1);c.arc(x,y-r*.1,r*.7,Math.PI,0);c.lineTo(x+r*.7,y+r);c.stroke();return;}
 if(game==='guide'){c.moveTo(x-r*.45,y+r);c.lineTo(x+r*.45,y+r);c.lineTo(x+r*.25,y-r*.4);c.lineTo(x-r*.25,y-r*.4);c.closePath();c.fill();c.beginPath();c.arc(x,y-r*.75,r*.3,0,6.283);c.fill();return;}
 if(game==='surf'){c.lineWidth=Math.max(1,r*.3);c.moveTo(x-r,y+r*.3);c.quadraticCurveTo(x-r*.3,y-r*1.1,x+r*.2,y-r*.2);c.quadraticCurveTo(x-r*.2,y+r*.1,x+r,y+r*.3);c.stroke();return;}
 if(game==='garden'){for(let k=0;k<5;k++){const a=k*1.2566-Math.PI/2;c.moveTo(x+Math.cos(a)*r*.55+r*.35,y+Math.sin(a)*r*.55);c.arc(x+Math.cos(a)*r*.55,y+Math.sin(a)*r*.55,r*.35,0,6.283);}c.fill();return;}
 if(game==='dance'){c.lineWidth=Math.max(1,r*.25);for(let i=0;i<=24;i++){const a=i/24*9.4,q=r*.12+i/24*r*.8;i?c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q):c.moveTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.stroke();return;}
 for(let i=0;i<10;i++){const q=i%2?r*.42:r,a=i/10*6.283-Math.PI/2;i?c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q):c.moveTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.closePath();c.fill();}
export function initialize(runtime){
 const $=id=>runtime.$?.(id),hits=[];let lastTap=null;
 const data=()=>runtime.placesData?.();const nameOf=id=>PLACES.find(p=>p.id===id)?.name||'el Mundo';
 const stars=id=>data()?.stars?.[id]||[false,false,false];
 const glyphs=id=>stars(id).map(x=>x?'★':'☆').join('');
 const visiting=()=>!!runtime.houseVisiting?.();
 // The shelf and the wall, in the Sala of your own Refugio.
 function draw(c,{toScreen,k,t,calm,house,note}){hits.length=0;const d=data();if(!d||visiting()||!(house?.unlocked||['sala']).includes('sala'))return;const sala=roomBox('sala'),gold='#f0d27a',have=starCount(d);c.save();
  // Refugio simple (alpha.234): the whole house on one screen. Small (a phone), the wall's «★ N / 33» would sit on the
  // room's name and the HUD already says it, so only the shelf is drawn; it still opens Lugares.
  const label=toScreen(sala.x+TROPHY_SHELF.x,sala.y+TROPHY_SHELF.y-20);c.font='11px "Geist Mono", monospace';c.letterSpacing='2px';c.textAlign='left';c.textBaseline='alphabetic';c.fillStyle='#ffffff';c.globalAlpha=.9;if(k>=.5){c.fillText(`★ ${have} / ${TOTAL_STARS}`,label.x,label.y);note?.(c,`★ ${have} / ${TOTAL_STARS}`,label.x,label.y);}c.letterSpacing='0px';
  // Small, the wall's touch area is only as wide as the shelf, clear of the card panels beside it.
  const lw=Math.max(k>=.5?140:0,(PLACES.length-1)*TROPHY_SHELF.gap*k+12);hits.push({x:label.x-4,y:label.y-14,w:lw,h:20,open:true});
  PLACES.forEach((p,i)=>{const q=toScreen(sala.x+TROPHY_SHELF.x+i*TROPHY_SHELF.gap,sala.y+TROPHY_SHELF.y),r=Math.min(Math.max(4,6*k),Math.max(2.5,TROPHY_SHELF.gap*k*.45)),got=stars(p.id),won=got[0],shine=got.filter(Boolean).length;
   // A socket under every trophy; the trophy itself only once the place has its ★, brighter with each star.
   c.globalAlpha=.35;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.moveTo(q.x-r*1.2,q.y+r*1.5);c.lineTo(q.x+r*1.2,q.y+r*1.5);c.stroke();
   // Panel 10 (P7, D4): the trophy of a complete place has that place's colour; its stars below stay gold.
   if(won){c.globalAlpha=.55+.15*shine;c.fillStyle=c.strokeStyle=runtime.earnedColor?.(p.id)||'#ffffff';if(shine===3&&!calm){c.save();c.globalAlpha=.18+.1*Math.sin(t/600+i);c.beginPath();c.arc(q.x,q.y,r*2,0,6.283);c.fill();c.restore();}trophy(c,p.game,q.x,q.y,r);}
   else{c.globalAlpha=.3;c.setLineDash?.([2,2]);c.strokeStyle='#ffffff';c.strokeRect(Math.round(q.x-r*.7)+.5,Math.round(q.y-r*.7)+.5,Math.round(r*1.4),Math.round(r*1.4));c.setLineDash?.([]);}
   for(let s=0;s<3;s++){c.globalAlpha=got[s]?.95:.25;c.fillStyle=got[s]?gold:'#ffffff';c.fillRect(Math.round(q.x-r+s*r*.8),Math.round(q.y+r*2.1),Math.max(1,Math.round(r*.4)),Math.max(1,Math.round(r*.4)));}
   hits.push({x:q.x-r*1.6,y:q.y-r*1.6,w:r*3.2,h:r*4.4,id:p.id,index:i});});
  c.restore();}
 // The trophy plays its layer of your song for two bars (song-stage.js); without sound, its own note rising three steps.
 // Since plan H4 over the music that is playing, at the stars it has, like the song itself.
 function layer(id,index){runtime.audio?.();if(!runtime.songLayerPreview?.(id))chime(index);}
 function chime(index){if(!runtime.S.sound||!runtime.pluck||!runtime.now)return;runtime.audio?.();runtime.now(t=>{const base=60+(runtime.MU?.tr||0)+PORTAL_NOTES[index],six=runtime.SIX||.125;[0,4,7].forEach((d,i)=>runtime.pluck(base+d,t+i*six*2,.09,2));});}
 // A touch on the shelf: the trophy's place and stars, or the wall opening Lugares.
 function look(px,py){if(visiting())return null;const h=hits.find(b=>px>=b.x&&px<=b.x+b.w&&py>=b.y&&py<=b.y+b.h);if(!h)return null;if(h.open){open();return '';}
  const p=PLACES[h.index],d=data(),best=d?.best?.[p.id];lastTap=p.id;if(stars(p.id)[0]){layer(p.id,h.index);runtime.narrate?.('trophy');}
  if(!placeOpen(d,p.id,runtime.S.journey)){const prev=PLACES.find(q=>q.id===previousPlace(p.id));return p.game&&prev?`${p.name} · tras ${prev.name}`:`${p.name} · pronto`;}
  return `${p.name} ${glyphs(p.id)}${best?` · ${roundPercent(best.onTime)} % a tiempo`:''}`;}
 // Lugares: every place with its stars and what it asks; «Ir» to the ones already entered; the door to the ring.
 function open(){const box=$('mLugares'),d=data();if(!box||!d)return;const have=starCount(d),goal=gameObjective(runtime.S,d);$('lugaresCount').textContent=d.readOnly?'':`${goal.completed||0} / 11`;if($('lugaresDoor'))$('lugaresDoor').textContent=goal.id?`Seguir hacia ${nameOf(goal.id)}`:'Explorar';$('lugaresNext').textContent=d.readOnly?goal.line:`${nextLine(d,runtime.S.journey)} · ★ ${have}/${TOTAL_STARS}`;
  const list=$('lugaresList');list.replaceChildren();for(const p of PLACES){const li=document.createElement('li'),openNow=placeOpen(d,p.id,runtime.S.journey),best=d.best?.[p.id];
   li.dataset.placeId=p.id;if(p.id===goal.id)li.setAttribute('aria-current','step');const name=document.createElement('span');name.className='lugar-name';name.textContent=p.name;const st=document.createElement('span');st.className='lugar-stars';st.setAttribute('aria-label',`${stars(p.id).filter(Boolean).length} de 3 estrellas`);
   stars(p.id).forEach(x=>{const s=document.createElement('i');s.textContent='★';if(x)s.className='got';st.appendChild(s);});
   const note=document.createElement('small');note.textContent=!openNow?(p.game?'Cerrado':'Pronto'):best?`${roundPercent(best.onTime)} %`:d.seen?.[p.id]||stars(p.id)[0]?'':'Sin visitar';
   // Panel 11 (Q4): «Seguir» and «Ir» share one width and sit on the name's line, in their own column.
   const acts=document.createElement('span');acts.className='lugar-actions';li.append(name,st,acts,note);if(openNow&&!stars(p.id)[0]){const follow=document.createElement('button');follow.textContent='Seguir';follow.onclick=()=>runtime.ringGuide?.(p.id);acts.appendChild(follow);}if(openNow&&(d.seen?.[p.id]||stars(p.id)[0]||runtime.ringCanTravel?.(p.id))){const go=document.createElement('button');go.textContent='Ir';go.onclick=()=>travel(p.id);acts.appendChild(go);}if(!openNow)li.className='closed';list.appendChild(li);}
  // Ritmo (alpha.237, ritmo.js): «Eco» on each complete place, and the Duelo final once it is open.
  runtime.ritmoLugares?.(list);
  // Con Luca (alpha.239, duos.js): «Reto entre dos ›» once a place is complete.
  runtime.duoLugares?.();
  // Jay (28 Oct 2026, alpha.230): «Volver al anillo», always there after the Journey, free; first when you are far away.
  const ring=$('lugaresRing');if(ring){const show=runtime.S.journey?.finished===true&&!d.readOnly&&!runtime.placeRun?.();ring.hidden=!show;ring.classList.toggle('next',show&&!!runtime.ringAway?.());ring.onclick=home;}
  // Today's remix (wild.js, plan F18): one open place with another place's rhythm, worth more sparks.
  const mix=runtime.dailyRemix?.(),line=$('lugaresRemixLine'),btn=$('lugaresRemix');if(line&&btn){const place=mix&&PLACES.find(p=>p.id===mix.id);line.hidden=btn.hidden=!place;
   if(place){const quote=document.createElement('span');quote.style.whiteSpace='nowrap';quote.textContent=`${place.name} en «${runtime.remixName?.(mix.rhythm)||mix.rhythm}».`;line.replaceChildren('Remezcla de hoy: ',quote);btn.onclick=()=>remixGo(mix);}}
  list.style.maxHeight='';box.hidden=false;(globalThis.requestAnimationFrame||((fn)=>fn()))(()=>{if(box.hidden)return;align(list);scrollCue();});}
 // The list opens on whole rows (panel 10, Nesbitt #3): the row before the next place sits at the top edge, and the
 // list ends on the last row that fits whole; scrolling still shows the rest.
 function align(list){const next=list.querySelector('[aria-current=step]'),first=next?.previousElementSibling||next;if(!list.getBoundingClientRect)return;
  if(first)list.scrollTop+=first.getBoundingClientRect().top-list.getBoundingClientRect().top-list.clientTop;if(list.scrollHeight<=list.clientHeight+2)return;
  const top=list.getBoundingClientRect().top+list.clientTop,bottom=top+list.clientHeight,rows=[...list.children].map(li=>li.getBoundingClientRect()),whole=rows.filter(r=>r.top>=top-1&&r.bottom<=bottom+1);if(!whole.length)return;
  // Near the end the scroll cannot lift the row to the top: the list then ends with the list and starts on a whole row.
  if(whole[0].top>top+1){list.style.maxHeight=Math.floor(bottom-whole[0].top+list.clientTop*2)+'px';list.scrollTop=list.scrollHeight;return;}
  const last=whole.at(-1);if(last.bottom<bottom-1)list.style.maxHeight=Math.ceil(last.bottom-top+list.clientTop*2)+'px';}
 // Two cues: «↓» while rows wait below, «↑ N más arriba» while whole rows are hidden above (panel 11, Q4: what you
 // already won is above the next place, and the list opens there).
 function scrollCue(){const list=$('lugaresList'),hint=$('lugaresScrollHint'),up=$('lugaresScrollUp');if(!list)return;if(hint)hint.hidden=list.scrollHeight<=list.clientHeight+2||list.scrollTop+list.clientHeight>=list.scrollHeight-2;
  if(up){const top=list.getBoundingClientRect?.().top??0,above=list.scrollTop>2?[...list.children].filter(li=>li.getBoundingClientRect().bottom<=top+list.clientTop+1).length:0;up.hidden=!above;if(above)up.textContent=`↑ ${above} más arriba`;}}
 $('lugaresList')?.addEventListener?.('scroll',scrollCue,{passive:true});globalThis.addEventListener?.('resize',()=>{if(!$('mLugares')?.hidden)scrollCue();});
 function remixGo(mix){$('mLugares').hidden=true;if(runtime.houseActive?.())runtime.exitHouse?.();return runtime.startPlace?.(mix.id,{remix:mix.rhythm,from:{x:runtime.S.wx,y:runtime.S.wy}});}
 // Out of the Refugio and on to a place: the house stays where it is.
 function travel(id){$('mLugares').hidden=true;if(runtime.houseActive?.())runtime.exitHouse?.();return runtime.ringTravel?.(id);}
 function door(){runtime.ringGuide?.();}
 // Out of the Refugio and back to the ring's centre; if it cannot move (a recording, a failed save), Lugares stays open.
 function home(){if(runtime.houseActive?.())runtime.exitHouse?.();if(runtime.ringHome?.()){$('mLugares').hidden=true;return true;}runtime.toast?.('Ahora no se puede volver. Inténtalo otra vez.');return false;}
 // The house bar shows the wall too, and opens Lugares.
 function bar(){const b=$('houseStars'),d=data();if(!b)return;b.hidden=!d||visiting();if(d)b.textContent=d.readOnly?'Actualizar lugares':'Lugares';}
 if($('houseStars'))$('houseStars').onclick=open;if($('lugaresClose'))$('lugaresClose').onclick=()=>{$('mLugares').hidden=true;};if($('lugaresDoor'))$('lugaresDoor').onclick=door;if($('lugaresSong'))$('lugaresSong').onclick=()=>{$('mLugares').hidden=true;if(runtime.replaySong)runtime.replaySong();else runtime.openSong?.();};
 // Plan I6: Lugares is one of the menu's six entries.
 const entry=$('bLugares');if(entry)entry.onclick=()=>{$('mMenu')&&($('mMenu').hidden=true);open();};
 Object.defineProperties(runtime,{drawHouseLugares:{get:()=>(c,o)=>{bar();draw(c,o);}},houseLugaresLook:{get:()=>look},openLugares:{get:()=>open},houseLugaresState:{get:()=>()=>({hits:hits.map(h=>({...h})),last:lastTap})}});
}
