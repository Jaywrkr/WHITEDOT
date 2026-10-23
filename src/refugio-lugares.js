import {PLACES,TOTAL_STARS,starCount,placeOpen} from './places.js';
import {PORTAL_NOTES} from './places-ring.js';
import {roomBox} from './house-view.js';
// The Refugio as the centre (plan F6, docs/MUNDO.md): it says what you have, what is missing and where to go.
// In the Sala, a shelf of eleven trophies: each place's gold thing once it has its ★, an empty socket before. Above it,
// the wall of stars (★ N / 33). In the house bar, «★ N / 33» opens Lugares: the map table (every place with its stars,
// record and what it asks; fast travel to the ones already entered) and the door to the ring.
export const TROPHY_SHELF=Object.freeze({x:34,y:76,gap:19});
// What comes next: the first closed place and the stars it still asks for; null once every place is open.
export function nextUnlock(places,journey){const have=starCount(places);for(const p of PLACES)if(!placeOpen(places,p.id,journey)&&p.need>0)return {id:p.id,name:p.name,need:p.need,missing:Math.max(0,p.need-have),ready:have>=p.need&&!p.game};return null;}
// One line under the wall: the next place to open, or the song once all 33 are won.
export function nextLine(places,journey){const have=starCount(places);if(have>=TOTAL_STARS)return 'Las 33 ★. Tu canción está completa.';const n=nextUnlock(places,journey);
 if(!n)return `Faltan ${TOTAL_STARS-have} ★ para tu canción.`;return n.ready?`${n.name} llega pronto. Ya tienes sus ${n.need} ★.`:`${n.name} se abre con ${n.need} ★. Faltan ${n.missing}.`;}
// A trophy for each verb: the gold thing of its game, drawn small.
function trophy(c,game,x,y,r){c.beginPath();
 if(game==='stick'){c.rect(x-r*.7,y-r*.7,r*1.4,r*1.4);c.fill();return;}
 if(game==='chain'){for(const d of [-1,0,1]){c.moveTo(x+d*r*.8+r*.35,y);c.arc(x+d*r*.8,y,r*.35,0,6.283);}c.fill();return;}
 if(game==='lasso'){c.lineWidth=Math.max(1,r*.3);c.arc(x,y,r*.75,0,6.283);c.stroke();return;}
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
 // The trophy plays its layer of your song for two bars (song.js); without it, its own note rising three steps.
 function layer(id,index){runtime.audio?.();if(!runtime.playSong?.([id],{bars:2}))chime(index);}
 function chime(index){if(!runtime.S.sound||!runtime.pluck||!runtime.now)return;runtime.audio?.();runtime.now(t=>{const base=60+(runtime.MU?.tr||0)+PORTAL_NOTES[index],six=runtime.SIX||.125;[0,4,7].forEach((d,i)=>runtime.pluck(base+d,t+i*six*2,.09,2));});}
 // A touch on the shelf: the trophy's place and stars, or the wall opening Lugares.
 function look(px,py){if(visiting())return null;const h=hits.find(b=>px>=b.x&&px<=b.x+b.w&&py>=b.y&&py<=b.y+b.h);if(!h)return null;if(h.open){open();return '';}
  const p=PLACES[h.index],d=data(),best=d?.best?.[p.id];lastTap=p.id;if(stars(p.id)[0]){layer(p.id,h.index);runtime.narrate?.('trophy');}
  if(!placeOpen(d,p.id,runtime.S.journey))return p.game?`${p.name} · se abre con ${p.need} ★`:`${p.name} · pronto`;
  return `${p.name} ${glyphs(p.id)}${best?` · ${Math.round(best.onTime*100)} % a tiempo`:''}`;}
 // Lugares: every place with its stars and what it asks; «Ir» to the ones already entered; the door to the ring.
 function open(){const box=$('mLugares'),d=data();if(!box||!d)return;const have=starCount(d);$('lugaresCount').textContent=`★ ${have} / ${TOTAL_STARS}`;$('lugaresNext').textContent=nextLine(d,runtime.S.journey);
  const list=$('lugaresList');list.replaceChildren();for(const p of PLACES){const li=document.createElement('li'),openNow=placeOpen(d,p.id,runtime.S.journey),best=d.best?.[p.id];
   const name=document.createElement('span');name.className='lugar-name';name.textContent=p.name;const st=document.createElement('span');st.className='lugar-stars';st.setAttribute('aria-label',`${stars(p.id).filter(Boolean).length} de 3 estrellas`);
   stars(p.id).forEach(x=>{const s=document.createElement('i');s.textContent='★';if(x)s.className='got';st.appendChild(s);});
   const note=document.createElement('small');note.textContent=!openNow?(p.game?`★ ${p.need}`:'Pronto'):best?`${Math.round(best.onTime*100)} %`:d.seen?.[p.id]?'':'Sin visitar';
   li.append(name,st,note);if(openNow&&d.seen?.[p.id]){const go=document.createElement('button');go.textContent='Ir';go.onclick=()=>travel(p.id);li.appendChild(go);}if(!openNow)li.className='closed';list.appendChild(li);}
  box.hidden=false;}
 // Out of the Refugio and on to a place: the house stays where it is.
 function travel(id){$('mLugares').hidden=true;if(runtime.houseActive?.())runtime.exitHouse?.();return runtime.ringTravel?.(id);}
 function door(){$('mLugares').hidden=true;if(runtime.houseActive?.())runtime.exitHouse?.();}
 // The house bar shows the wall too, and opens Lugares.
 function bar(){const b=$('houseStars'),d=data();if(!b)return;b.hidden=!d||visiting();if(d)b.textContent=`★ ${starCount(d)} / ${TOTAL_STARS}`;}
 if($('houseStars'))$('houseStars').onclick=open;if($('lugaresClose'))$('lugaresClose').onclick=()=>{$('mLugares').hidden=true;};if($('lugaresDoor'))$('lugaresDoor').onclick=door;if($('lugaresSong'))$('lugaresSong').onclick=()=>{$('mLugares').hidden=true;runtime.openSong?.();};
 Object.defineProperties(runtime,{drawHouseLugares:{get:()=>(c,o)=>{bar();draw(c,o);}},houseLugaresLook:{get:()=>look},openLugares:{get:()=>open},houseLugaresState:{get:()=>()=>({hits:hits.map(h=>({...h})),last:lastTap})}});
}
