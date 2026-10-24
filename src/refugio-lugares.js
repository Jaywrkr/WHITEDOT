import {PLACES,TOTAL_STARS,starCount,placeOpen,previousPlace,allComplete,nextOnPath} from './places.js';
import {PORTAL_NOTES} from './places-ring.js';
import {roomBox} from './house-view.js';
// The Refugio as the centre (plan F6, docs/MUNDO.md): it says what you have, what is missing and where to go.
// In the Sala, a shelf of eleven trophies: each place's gold thing once it has its ★, an empty socket before. Above it,
// the wall of stars (★ N / 33). In the house bar, «★ N / 33» opens Lugares: the map table (every place with its stars,
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
 const data=()=>runtime.placesData?.();
 const stars=id=>data()?.stars?.[id]||[false,false,false];
 const glyphs=id=>stars(id).map(x=>x?'★':'☆').join('');
 const visiting=()=>!!runtime.houseVisiting?.();
 // The shelf and the wall, in the Sala of your own Refugio.
 function draw(c,{toScreen,k,t,calm,house}){hits.length=0;const d=data();if(!d||visiting()||!(house?.unlocked||['sala']).includes('sala'))return;const sala=roomBox('sala'),gold='#f0d27a',have=starCount(d);c.save();
  const label=toScreen(sala.x+TROPHY_SHELF.x,sala.y+TROPHY_SHELF.y-20);c.font='11px "Geist Mono", monospace';c.letterSpacing='2px';c.textAlign='left';c.textBaseline='alphabetic';c.fillStyle=gold;c.globalAlpha=.9;c.fillText(`LUGARES · ★ ${have} / ${TOTAL_STARS}`,label.x,label.y);c.letterSpacing='0px';
  const lw=Math.max(140,(PLACES.length-1)*TROPHY_SHELF.gap*k+12);hits.push({x:label.x-4,y:label.y-14,w:lw,h:20,open:true});
  PLACES.forEach((p,i)=>{const q=toScreen(sala.x+TROPHY_SHELF.x+i*TROPHY_SHELF.gap,sala.y+TROPHY_SHELF.y),r=Math.max(4,6*k),got=stars(p.id),won=got[0],shine=got.filter(Boolean).length;
   // A socket under every trophy; the trophy itself only once the place has its ★, brighter with each star.
   c.globalAlpha=.35;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.moveTo(q.x-r*1.2,q.y+r*1.5);c.lineTo(q.x+r*1.2,q.y+r*1.5);c.stroke();
   if(won){c.globalAlpha=.55+.15*shine;c.fillStyle=c.strokeStyle=gold;if(shine===3&&!calm){c.save();c.globalAlpha=.18+.1*Math.sin(t/600+i);c.beginPath();c.arc(q.x,q.y,r*2,0,6.283);c.fill();c.restore();}trophy(c,p.game,q.x,q.y,r);}
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
  return `${p.name} ${glyphs(p.id)}${best?` · ${Math.round(best.onTime*100)} % a tiempo`:''}`;}
 // Lugares: every place with its stars and what it asks; «Ir» to the ones already entered; the door to the ring.
 function open(){const box=$('mLugares'),d=data();if(!box||!d)return;const have=starCount(d);$('lugaresCount').textContent=`★ ${have} / ${TOTAL_STARS}`;$('lugaresNext').textContent=nextLine(d,runtime.S.journey);
  const list=$('lugaresList');list.replaceChildren();for(const p of PLACES){const li=document.createElement('li'),openNow=placeOpen(d,p.id,runtime.S.journey),best=d.best?.[p.id];
   const name=document.createElement('span');name.className='lugar-name';name.textContent=p.name;const st=document.createElement('span');st.className='lugar-stars';st.setAttribute('aria-label',`${stars(p.id).filter(Boolean).length} de 3 estrellas`);
   stars(p.id).forEach(x=>{const s=document.createElement('i');s.textContent='★';if(x)s.className='got';st.appendChild(s);});
   const note=document.createElement('small');note.textContent=!openNow?(p.game?'Cerrado':'Pronto'):best?`${Math.round(best.onTime*100)} %`:d.seen?.[p.id]||stars(p.id)[0]?'':'Sin visitar';
   li.append(name,st,note);if(openNow&&d.seen?.[p.id]){const go=document.createElement('button');go.textContent='Ir';go.onclick=()=>travel(p.id);li.appendChild(go);}if(!openNow)li.className='closed';list.appendChild(li);}
  // Today's remix (wild.js, plan F18): one open place with another place's rhythm, worth more sparks.
  const mix=runtime.dailyRemix?.(),line=$('lugaresRemixLine'),btn=$('lugaresRemix');if(line&&btn){const place=mix&&PLACES.find(p=>p.id===mix.id);line.hidden=btn.hidden=!place;
   if(place){line.textContent=`Remezcla de hoy: ${place.name} en «${runtime.remixName?.(mix.rhythm)||mix.rhythm}».`;btn.onclick=()=>remixGo(mix);}}
  box.hidden=false;}
 function remixGo(mix){$('mLugares').hidden=true;if(runtime.houseActive?.())runtime.exitHouse?.();return runtime.startPlace?.(mix.id,{remix:mix.rhythm,from:{x:runtime.S.wx,y:runtime.S.wy}});}
 // Out of the Refugio and on to a place: the house stays where it is.
 function travel(id){$('mLugares').hidden=true;if(runtime.houseActive?.())runtime.exitHouse?.();return runtime.ringTravel?.(id);}
 function door(){$('mLugares').hidden=true;if(runtime.houseActive?.())runtime.exitHouse?.();}
 // The house bar shows the wall too, and opens Lugares.
 function bar(){const b=$('houseStars'),d=data();if(!b)return;b.hidden=!d||visiting();if(d)b.textContent=`★ ${starCount(d)} / ${TOTAL_STARS}`;}
 if($('houseStars'))$('houseStars').onclick=open;if($('lugaresClose'))$('lugaresClose').onclick=()=>{$('mLugares').hidden=true;};if($('lugaresDoor'))$('lugaresDoor').onclick=door;if($('lugaresSong'))$('lugaresSong').onclick=()=>{$('mLugares').hidden=true;runtime.openSong?.();};
 // Plan I6: Lugares is one of the menu's six entries.
 const entry=$('bLugares');if(entry)entry.onclick=()=>{$('mMenu')&&($('mMenu').hidden=true);open();};
 Object.defineProperties(runtime,{drawHouseLugares:{get:()=>(c,o)=>{bar();draw(c,o);}},houseLugaresLook:{get:()=>look},openLugares:{get:()=>open},houseLugaresState:{get:()=>()=>({hits:hits.map(h=>({...h})),last:lastTap})}});
}
