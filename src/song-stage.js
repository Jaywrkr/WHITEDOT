import {prefersReducedMotion} from './frame-state.js';
import {SONG_LAYERS,SONG_IDS,SONG_SIX} from './song.js';
import {PLACES,TOTAL_STARS,starCount} from './places.js';
// The song seen (plan F7): eleven rings, one per place. A layer you have won lights its ring in its colour and the ring
// beats with it; one you have not is a dim dashed ring, so what is missing is plain without words. The Refugio's
// «Tu canción» plays what you have; with the 33 stars, every layer comes in one bar after another: that is winning.
export const FINAL_ENTRY_BARS=1,FINAL_TAIL_BARS=4;
export const FINAL_LINES=Object.freeze(['Las 33 ★','Tu canción está completa','Kubono','Jay · diseño y código','Luca · primer jugador']);
export function ringLayout(W,H,n=SONG_IDS.length){const R=Math.min(W*.36,H*.3),cx=W/2,cy=H*.44,r=Math.max(14,Math.min(26,Math.min(W,H)*.045));
 return Array.from({length:n},(_,i)=>{const a=-Math.PI/2+i/n*2*Math.PI;return {x:cx+Math.cos(a)*R,y:cy+Math.sin(a)*R,r};});}
// Draw the rings: `lit` says which layers sound, `beat(id)` how hard each is hitting now (0–1), `shown` how many to draw.
export function drawSongRings(c,W,H,{ids=SONG_IDS,lit=()=>false,beat=()=>0,shown=ids.length,names=true,still=false,color=(id,fallback)=>fallback}={}){
 const spots=ringLayout(W,H,ids.length);c.save();c.textAlign='center';c.textBaseline='top';
 ids.forEach((id,i)=>{if(i>=shown)return;const p=spots[i],on=lit(id),k=on?beat(id):0,ink=color(id,SONG_LAYERS[id]?.color||'#ffffff');
  if(on){c.globalAlpha=.16+.3*k;c.fillStyle=ink;c.beginPath();c.arc(p.x,p.y,p.r*(1+(still?0:.18*k)),0,6.283);c.fill();c.globalAlpha=.95;c.strokeStyle=ink;c.lineWidth=2;c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.stroke();}
  else{c.globalAlpha=.35;c.strokeStyle='#ffffff';c.lineWidth=1;c.setLineDash?.([3,4]);c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.stroke();c.setLineDash?.([]);}
  if(names){const place=PLACES.find(q=>q.id===id);c.globalAlpha=on?.9:.4;c.fillStyle=on?'#ffffff':'#8a8a8f';c.font='11px "Geist Mono", monospace';c.fillText(place?.name||id,p.x,p.y+p.r+6);}});
 c.restore();return spots;}
export function initialize(runtime){
 let run=null;const state={opened:0,finals:0};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const data=()=>runtime.placesData?.();
 const won=()=>SONG_IDS.filter(id=>data()?.stars?.[id]?.[0]);
 function overlay(){let el=document.getElementById('songStage');if(!el){el=document.createElement('div');el.id='songStage';el.setAttribute('role','dialog');el.setAttribute('aria-label','Tu canción');
  el.innerHTML='<canvas></canvas><div class="song-stage-text" aria-live="polite"></div><div class="song-stage-row"><button id="songAgain">Otra vez</button><button id="songClose">Cerrar</button></div>';document.body.appendChild(el);}el.hidden=false;return el;}
 // Open the stage: your song as it is, or (final) the eleven layers coming in one after another.
 function open({final=false}={}){const ids=won();if(!ids.length&&!final){runtime.toast?.('Gana una ★ y empieza tu canción.',{level:2});return false;}if(run)close();
  document.querySelectorAll('.modal').forEach(m=>{m.hidden=true;});const el=overlay(),text=el.querySelector('.song-stage-text');
  const from={};if(final)SONG_IDS.forEach((id,i)=>{from[id]=i*FINAL_ENTRY_BARS;});const bars=final?SONG_IDS.length*FINAL_ENTRY_BARS+FINAL_TAIL_BARS:8,list=final?SONG_IDS:ids;
  runtime.audio?.();const handle=runtime.playSong?.(list,{bars,from})||null;run={el,final,handle,ids:list,from,bars,at:performance.now(),length:bars*16*SONG_SIX*1000};
  if(final){state.finals++;text.replaceChildren();}else{text.textContent=`Tu canción · ${ids.length} de ${SONG_IDS.length}`;}state.opened++;
  el.querySelector('#songAgain').hidden=final;el.querySelector('#songAgain').onclick=()=>open();el.querySelector('#songClose').textContent=final?'Seguir':'Cerrar';el.querySelector('#songClose').onclick=close;
  requestAnimationFrame(frame);return true;}
 function close(){if(!run)return;run.handle?.stop();run.el.hidden=true;run=null;}
 // Whether a layer sounds at this moment: won, and already in (the final brings them in one bar after another).
 function sounding(id,ms){if(!run.ids.includes(id))return false;const bar=ms/1000/(16*SONG_SIX);return bar>=(run.from[id]||0);}
 function frame(){if(!run)return;const el=run.el,cv=el.querySelector('canvas'),W=innerWidth,H=innerHeight,dpr=Math.min(2,devicePixelRatio||1);if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}
  const c=cv.getContext('2d'),ms=performance.now()-run.at,still=calm(),time=runtime.ac?.currentTime??0;c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#000';c.fillRect(0,0,W,H);
  const full=run.ids.filter(id=>sounding(id,ms)).length/SONG_IDS.length,g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(240,210,122,${.08+.3*full})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  const shown=run.final?Math.min(SONG_IDS.length,Math.floor(ms/1000/(16*SONG_SIX))+1):SONG_IDS.length;
  drawSongRings(c,W,H,{lit:id=>sounding(id,ms),beat:id=>runtime.songPulse?.(run.handle,id,time)||(still?0:.3+.3*Math.sin(ms/300+id.length)),shown,still,color:(id,f)=>runtime.placeColor?.(id,f)||f});
  // The final: once every layer is in, the words and the credits.
  if(run.final&&ms>=SONG_IDS.length*FINAL_ENTRY_BARS*16*SONG_SIX*1000&&!run.credits){run.credits=true;const box=el.querySelector('.song-stage-text');box.replaceChildren(...FINAL_LINES.map((line,i)=>{const p=document.createElement('p');p.textContent=line;p.style.animationDelay=`${i*.8}s`;if(i===0)p.className='journey-title';return p;}));}
  if(ms>run.length+1500&&!run.final){el.querySelector('.song-stage-text').textContent=`Tu canción · ${run.ids.length} de ${SONG_IDS.length}`;}
  requestAnimationFrame(frame);}
 // With the 33 stars, once: the true finale, after the round's card is closed.
 function check(){const d=data();if(!d||d.won||starCount(d)<TOTAL_STARS)return false;d.won=true;if(runtime.save?.()===false){delete d.won;return false;}return open({final:true});}
 Object.defineProperties(runtime,{openSong:{get:()=>open},closeSong:{get:()=>close},songFinaleCheck:{get:()=>check},songStageState:{get:()=>()=>({...state,running:!!run,final:!!run?.final,ids:run?[...run.ids]:[],credits:!!run?.credits})}});
}
