import {prefersReducedMotion} from './frame-state.js';
import {THEME,themePitch,playCello} from './journey-pulse.js';
import {WORLD_CHAPTERS} from './journey-chapters.js';
import {FESTIVAL_CHAPTERS} from './festival.js';
import {LANDSCAPES} from './house-view.js';
import {SONG_IDS} from './song.js';
import {drawSongRings} from './song-stage.js';
import {PLACES} from './places.js';
// The Journey, phase 5: the finale. In the Refugio the cube's journey plays back as your song (plan F7, song.js): each
// chapter takes two bars, its layer comes in under the notes you played on time there, with your rhythm, and its ring
// lights with its name and verb; then the theme in A major twice over the five layers, the second time a fifth up.
// Six dim rings say what is still to come; the sky turns gold, a silence, «Tu mundo se abrió» and «Explorar».
export const CHAPTER_COLORS=Object.freeze({llanura:LANDSCAPES.llanura,lago:LANDSCAPES.lago,bosque:LANDSCAPES.bosque,tormenta:LANDSCAPES.tormenta,vacio:'#ffffff',refugio:'#f0d27a'});
export const MAJOR=Object.freeze([0,2,4,5,7,9,11]);
// Seconds: one eighth, the gathering before the first note, the silence after the last and the credits.
export const EIGHTH=.25,GATHER=1.6,SILENCE=2,CREDITS=7,SEGMENT=16;
export const NOTES_PER_CHAPTER=6;
export const CREDIT_LINES=Object.freeze(['Tu mundo se abrió','11 lugares · 33 ★','Kubono','Jay · diseño y código','Luca · primer jugador']);
// The festival build ends on your phrase, and the next player starts again.
export const FESTIVAL_LINES=Object.freeze(['Kubono','Tu frase','Los primeros 15 minutos','Gracias por tocar']);
// Your rhythm: the gap to your next note in the same chapter, in quarters (one to three), from the music's sixteenths
// saved beside the notes. Older saves without them play a quarter each.
export function noteLengths(steps,count){const out=Array(count).fill(2);if(!Array.isArray(steps)||steps.length!==count)return out;
 for(let i=0;i<count-1;i++){const gap=steps[i+1]-steps[i];if(Number.isFinite(gap)&&gap>0)out[i]=2*Math.max(1,Math.min(3,Math.round(gap/4)));}return out;}
// The score of the finale: up to six of your notes per chapter, with your rhythm, each chapter in two bars of its own
// (a longer rhythm is tightened to fit), then the theme twice.
export function finaleScore(notes,chapters=WORLD_CHAPTERS,steps={}){
 const out=[];let at=0;for(const id of chapters){const raw=Array.isArray(notes?.[id])?notes[id]:[],keep=raw.map((m,i)=>Number.isFinite(m)?i:-1).filter(i=>i>=0).slice(-NOTES_PER_CHAPTER),st=Array.isArray(steps?.[id])&&steps[id].length===raw.length?keep.map(i=>steps[id][i]):null,len=noteLengths(st,keep.length);
  if(!keep.length)continue;while(len.reduce((a,b)=>a+b,0)>SEGMENT){const i=len.indexOf(Math.max(...len));len[i]-=2;}
  let t=at;keep.forEach((i,k)=>{out.push({midi:raw[i],eighths:len[k],chapter:id,at:t});t+=len[k]*EIGHTH;});at+=SEGMENT*EIGHTH;}
 for(const shift of [0,7])for(const [d,l] of THEME){out.push({midi:themePitch(d,MAJOR,shift),eighths:l,chapter:'refugio',at});at+=l*EIGHTH;}return out;}
export const scoreLength=score=>score.reduce((s,n)=>Math.max(s,n.at+n.eighths*EIGHTH),0);
// Where each chapter's two bars start, in seconds: its layer comes in there.
export const chapterStarts=score=>{const out={};for(const n of score)if(!(n.chapter in out))out[n.chapter]=n.at;return out;};
export function initialize(runtime){
 let run=null;const state={played:0,skipped:false,finished:0};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const now=()=>performance.now()/1000;
 function overlay(){let el=document.getElementById('journeyFinale');if(!el){el=document.createElement('div');el.id='journeyFinale';el.setAttribute('role','dialog');el.setAttribute('aria-label','Final del Viaje');el.innerHTML='<canvas></canvas><div class="journey-credits" aria-live="polite"></div>';document.body.appendChild(el);}el.hidden=false;return el;}
 // Sound: your song (song.js) through its own gain, so skipping fades it out. Each chapter's layer comes in at its two
 // bars; your notes and the theme ride on top.
 function play(score){const ac=runtime.ac;if(!runtime.S.sound||!ac||!runtime.bus||!runtime.playSong)return null;const t0=ac.currentTime+GATHER,starts=chapterStarts(score),bar=16*EIGHTH/2,from={};
  const theme=starts.refugio??0;for(const id of SONG_IDS.slice(0,5))if(id in starts||theme>0)from[id]=Math.round((starts[id]??theme)/bar);
  const ids=Object.keys(from),h=runtime.playSong(ids,{at:t0,bars:Math.ceil(scoreLength(score)/bar)+1,from,six:EIGHTH/2});if(!h)return null;
  for(const n of score){const last=n.chapter==='refugio';runtime.songNote?.(h,n.midi+12,t0+n.at,n.eighths*EIGHTH*.92,last?.07:.055);}return h.out;}
 function start(options={}){const j=runtime.S.journey,festival=!!options.festival;if(run||!j||(j.finished&&!festival)){if(!run)runtime.landHouse?.();return false;}
  document.querySelectorAll('.modal').forEach(m=>{m.hidden=true;});runtime.landHouse?.();const score=finaleScore(j.notes,festival?FESTIVAL_CHAPTERS:WORLD_CHAPTERS,j.steps),el=overlay();el.querySelector('.journey-again')?.remove();el.querySelector('.journey-explore')?.remove?.();el.querySelector('.journey-credits').replaceChildren();
  run={el,score,festival,at:now(),length:scoreLength(score),gain:play(score),credits:false};state.played++;
  el.onclick=()=>{if(run&&now()-run.at>2)finish(true);};requestAnimationFrame(frame);return true;}
 function finish(skipped=false){if(!run)return;const j=runtime.S.journey,ac=runtime.ac;if(run.gain&&ac){run.gain.gain.setTargetAtTime(.0001,ac.currentTime,.3);}
  // The festival keeps your phrase on screen and waits for the next player.
  if(run.festival){const el=run.el;el.onclick=null;if(!run.credits)credits(run);const again=document.createElement('button');again.className='journey-again';again.id='journeyAgain';again.textContent='Otra persona';again.onclick=()=>runtime.festivalRestart?.();el.appendChild(again);run=null;state.skipped=skipped;state.finished++;return;}
  run.el.hidden=true;run.el.onclick=null;run.el.querySelector?.('.journey-explore')?.remove?.();run=null;state.skipped=skipped;
  // The end of the Journey is kept; the free World opens.
  j.finished=true;const kept=runtime.journeyMode?.()==='libre'?runtime.save()!==false:!!runtime.setJourneyMode?.('libre');if(!kept){delete j.finished;return;}
  state.finished++;runtime.toast?.('Se abre el Mundo libre.');unveil();}
 // From the quiet Journey to everything at once was abrupt (phase 6 of the plan): the counters and buttons of the free
 // World fade in one after another, and the menu marks that it has new things until it is opened.
 // The sparks earned on the way were hidden in the Journey: once in the free World, Tu cubo is marked and one short
 // notice says what they are for (once per game).
 function sparksHint(){const j=runtime.S.journey;if(!j||j.sparksHint)return;j.sparksHint=true;runtime.save?.();const cube=document.getElementById('bCube');
  if(cube?.classList){cube.classList.add('has-new');cube.addEventListener('click',()=>cube.classList.remove('has-new'),{once:true});}
  setTimeout(()=>runtime.toast?.('Tus ✦ cambian tu cubo: Menú → Tu cubo.',{level:2,ttl:60000,coalesce:false}),2600);}
 // The finale lands in the Refugio: the unveiling waits until you step out into the World (for up to ten minutes).
 function unveil(waited=0){const body=document.body;if(typeof runtime.inWorld==='function'&&!runtime.inWorld()&&waited<600){setTimeout(()=>unveil(waited+1),1000);if(waited)return;}else{body?.classList?.add('journey-unveil');setTimeout(()=>body?.classList?.remove('journey-unveil'),7000);sparksHint();if(waited)return;}
  const menu=document.getElementById('bMenu'),sheet=document.getElementById('mMenu');if(!menu?.classList)return;menu.classList.add('has-new');
  if(sheet&&typeof MutationObserver==='function'){const seen=new MutationObserver(()=>{if(!sheet.hidden){menu.classList.remove('has-new');seen.disconnect();}});seen.observe(sheet,{attributes:true,attributeFilter:['hidden']});}}
 function credits(r){r.credits=true;const box=r.el.querySelector('.journey-credits');box.replaceChildren(...(r.festival?FESTIVAL_LINES:CREDIT_LINES).map((line,i)=>{const p=document.createElement('p');p.textContent=line;p.style.animationDelay=`${i*.9}s`;if(i===0)p.className='journey-title';return p;}));
  // «Explorar»: straight into the free World, without waiting for the credits to end.
  if(!r.festival){const go=document.createElement('button');go.className='journey-explore';go.id='journeyExplore';go.textContent='Explorar';go.onclick=e=>{e?.stopPropagation?.();finish(false);};r.el.appendChild(go);}}
 function frame(){if(!run)return;const el=run.el,cv=el.querySelector('canvas'),W=innerWidth,H=innerHeight,dpr=Math.min(2,devicePixelRatio||1);if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}
  const c=cv.getContext('2d'),t=now()-run.at,music=t-GATHER,end=run.length,still=calm();c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#000';c.fillRect(0,0,W,H);
  // The sky turns gold while your journey plays, and goes dark in the silence.
  const glow=(music<0?Math.max(0,1+music/GATHER)*.3:.35+.65*Math.min(1,music/end))*(music>end?Math.max(0,1-(music-end)/SILENCE):1);const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(240,210,122,${.32*glow})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  // Your song's rings: each chapter's lights when its two bars begin, with its name and verb in the middle; with the
  // theme, the six places still to come appear dim. They fade in the silence.
  const starts=chapterStarts(run.score),chapters=SONG_IDS.filter(id=>id in starts),theme=starts.refugio??0,fade=music>end&&!run.festival?Math.max(0,1-(music-end)/SILENCE):1;
  const current=[...chapters].reverse().find(id=>music>=starts[id]&&music<theme),beatAt=(music/(EIGHTH*2))%1;c.globalAlpha=fade;
  if(fade>0){c.save();c.globalAlpha=fade;drawSongRings(c,W,H,{lit:id=>id in starts&&music>=starts[id]||music>=theme&&SONG_IDS.indexOf(id)<5&&!run.festival,beat:()=>still?.4:Math.max(0,1-beatAt*2),shown:music>=theme&&!run.festival?SONG_IDS.length:Math.max(1,chapters.length),still,color:(id,f)=>runtime.placeColor?.(id,CHAPTER_COLORS[id]||f)||CHAPTER_COLORS[id]||f});
   const place=PLACES.find(p=>p.id===current),cy=H*.44;c.textAlign='center';c.textBaseline='middle';
   if(place){c.fillStyle='#ffffff';c.font='22px "Geist Mono", monospace';c.fillText(place.name,W/2,cy-12);c.fillStyle='#f0d27a';c.font='13px "Geist Mono", monospace';c.fillText(place.verb,W/2,cy+16);}
   else if(music>=theme&&music<end){c.fillStyle='#f0d27a';c.font='18px "Geist Mono", monospace';c.fillText('Tu canción',W/2,cy);}c.restore();}
  // With the words, the eleven rings come back small below them: your five lit, six still to find.
  if(music>end&&!run.festival){const k=still?1:Math.min(1,(music-end)/SILENCE);c.save();c.globalAlpha=.85*k;c.translate(W/2,H*.68);c.scale(.55,.55);c.translate(-W/2,-H*.44);
   drawSongRings(c,W,H,{lit:id=>SONG_IDS.indexOf(id)<5,beat:()=>still?.4:Math.max(0,1-beatAt*2)*.6,names:false,still,color:(id,f)=>runtime.placeColor?.(id,CHAPTER_COLORS[id]||f)||CHAPTER_COLORS[id]||f});c.restore();}
  c.globalAlpha=1;
  // Credits after the silence.
  if(music>end+SILENCE&&!run.credits)credits(run);
  if(music>end+SILENCE+CREDITS){finish(false);return;}
  requestAnimationFrame(frame);}
 Object.defineProperties(runtime,{journeyFinale:{get:()=>start},journeyFinaleSkip:{get:()=>()=>finish(true)},journeyFinaleState:{get:()=>()=>({...state,running:!!run,credits:!!run?.credits,notes:run?.score.length||0,seconds:run?GATHER+run.length+SILENCE+CREDITS:0})}});
}
