import {prefersReducedMotion} from './frame-state.js';
import {THEME,themePitch,playCello} from './journey-pulse.js';
import {WORLD_CHAPTERS} from './journey-chapters.js';
import {FESTIVAL_CHAPTERS} from './festival.js';
import {LANDSCAPES} from './house-view.js';
// The Journey, phase 5: the finale. In the Refugio the cube's journey plays back: the notes you played on time in
// each chapter, in order and with your rhythm, then the theme in A major twice, the second time a fifth up. The sky turns gold, the
// picture pulls back, a silence, the credits, and the free World opens.
export const CHAPTER_COLORS=Object.freeze({llanura:LANDSCAPES.llanura,lago:LANDSCAPES.lago,bosque:LANDSCAPES.bosque,tormenta:LANDSCAPES.tormenta,vacio:'#ffffff',refugio:'#f0d27a'});
export const MAJOR=Object.freeze([0,2,4,5,7,9,11]);
// Seconds: one eighth, the gathering before the first note, the silence after the last and the credits.
export const EIGHTH=.25,GATHER=1.6,SILENCE=3,CREDITS=7;
export const NOTES_PER_CHAPTER=6;
export const CREDIT_LINES=Object.freeze(['Kubono','Tu viaje','Jay · diseño y código','Luca · primer jugador','Gracias por tocar']);
// The festival build ends on your phrase, and the next player starts again.
export const FESTIVAL_LINES=Object.freeze(['Kubono','Tu frase','Los primeros 15 minutos','Gracias por tocar']);
// Your rhythm: the gap to your next note in the same chapter, in quarters (one to three), from the music's sixteenths
// saved beside the notes. Older saves without them play a quarter each.
export function noteLengths(steps,count){const out=Array(count).fill(2);if(!Array.isArray(steps)||steps.length!==count)return out;
 for(let i=0;i<count-1;i++){const gap=steps[i+1]-steps[i];if(Number.isFinite(gap)&&gap>0)out[i]=2*Math.max(1,Math.min(3,Math.round(gap/4)));}return out;}
// The score of the finale: up to six of your notes per chapter, with your rhythm, then the theme twice.
export function finaleScore(notes,chapters=WORLD_CHAPTERS,steps={}){
 const out=[];for(const id of chapters){const raw=Array.isArray(notes?.[id])?notes[id]:[],keep=raw.map((m,i)=>Number.isFinite(m)?i:-1).filter(i=>i>=0).slice(-NOTES_PER_CHAPTER),st=Array.isArray(steps?.[id])&&steps[id].length===raw.length?keep.map(i=>steps[id][i]):null,len=noteLengths(st,keep.length);
  keep.forEach((i,k)=>out.push({midi:raw[i],eighths:len[k],chapter:id}));}
 for(const shift of [0,7])for(const [d,l] of THEME)out.push({midi:themePitch(d,MAJOR,shift),eighths:l,chapter:'refugio'});
 let at=0;for(const n of out){n.at=at;at+=n.eighths*EIGHTH;}return out;}
export const scoreLength=score=>score.reduce((s,n)=>s+n.eighths*EIGHTH,0);
export function initialize(runtime){
 let run=null;const state={played:0,skipped:false,finished:0};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const now=()=>performance.now()/1000;
 function overlay(){let el=document.getElementById('journeyFinale');if(!el){el=document.createElement('div');el.id='journeyFinale';el.setAttribute('role','dialog');el.setAttribute('aria-label','Final del Viaje');el.innerHTML='<canvas></canvas><div class="journey-credits" aria-live="polite"></div>';document.body.appendChild(el);}el.hidden=false;return el;}
 // Sound: through its own gain, so skipping fades it out.
 // A soft held tone: the Refugio's pedal and chord under the cube's voice.
 function hold(ac,out,t,midi,seconds,volume){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(440*2**((midi-69)/12),t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+1.2);g.gain.setValueAtTime(volume,t+Math.max(1.2,seconds-1.5));g.gain.exponentialRampToValueAtTime(.0001,t+seconds);o.connect(g);g.connect(out);o.start(t);o.stop(t+seconds+.1);}
 function play(score){const ac=runtime.ac;if(!runtime.S.sound||!ac||!runtime.bus)return null;const out=ac.createGain();out.gain.setValueAtTime(1,ac.currentTime);out.connect(runtime.bus);const t0=ac.currentTime+GATHER;
  const theme=score.find(n=>n.chapter==='refugio')?.at??0,end=scoreLength(score);if(theme>0)hold(ac,out,t0,45,theme+1,.05);for(const m of [45,57,61,64])hold(ac,out,t0+theme,m,end-theme+1.5,m===45?.05:.03);
  // Everything together under the theme: a soft heartbeat on every quarter, and the creature that followed you
  // answering each note an octave down, half a bar later.
  for(let at=theme;at<end;at+=EIGHTH*2){const t=t0+at,o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(82,t);o.frequency.exponentialRampToValueAtTime(48,t+.18);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.09,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);g.connect(out);o.start(t);o.stop(t+.35);}
  if(runtime.S.journey?.moments?.companion)for(const n of score)if(n.chapter==='refugio')playCello(ac,out,t0+n.at+EIGHTH*4,n.midi-12,n.eighths*EIGHTH,.045);
  for(const n of score){const len=n.eighths*EIGHTH,last=n.chapter==='refugio';playCello(ac,out,t0+n.at,n.midi,len,last?.14:.12);if(last)playCello(ac,out,t0+n.at,n.midi-12,len,.07);}return out;}
 function start(options={}){const j=runtime.S.journey,festival=!!options.festival;if(run||!j||(j.finished&&!festival)){if(!run)runtime.landHouse?.();return false;}
  document.querySelectorAll('.modal').forEach(m=>{m.hidden=true;});runtime.landHouse?.();const score=finaleScore(j.notes,festival?FESTIVAL_CHAPTERS:WORLD_CHAPTERS,j.steps),el=overlay();el.querySelector('.journey-again')?.remove();el.querySelector('.journey-credits').replaceChildren();
  run={el,score,festival,at:now(),length:scoreLength(score),gain:play(score),credits:false};state.played++;
  el.onclick=()=>{if(run&&now()-run.at>2)finish(true);};requestAnimationFrame(frame);return true;}
 function finish(skipped=false){if(!run)return;const j=runtime.S.journey,ac=runtime.ac;if(run.gain&&ac){run.gain.gain.setTargetAtTime(.0001,ac.currentTime,.3);}
  // The festival keeps your phrase on screen and waits for the next player.
  if(run.festival){const el=run.el;el.onclick=null;if(!run.credits)credits(run);const again=document.createElement('button');again.className='journey-again';again.id='journeyAgain';again.textContent='Otra persona';again.onclick=()=>runtime.festivalRestart?.();el.appendChild(again);run=null;state.skipped=skipped;state.finished++;return;}
  run.el.hidden=true;run.el.onclick=null;run=null;state.skipped=skipped;
  // The end of the Journey is kept; the free World opens.
  j.finished=true;const kept=runtime.journeyMode?.()==='libre'?runtime.save()!==false:!!runtime.setJourneyMode?.('libre');if(!kept){delete j.finished;return;}
  state.finished++;runtime.toast?.('Se abre el Mundo libre.');unveil();}
 // From the quiet Journey to everything at once was abrupt (phase 6 of the plan): the counters and buttons of the free
 // World fade in one after another, and the menu marks that it has new things until it is opened.
 // The finale lands in the Refugio: the unveiling waits until you step out into the World (for up to ten minutes).
 function unveil(waited=0){const body=document.body;if(typeof runtime.inWorld==='function'&&!runtime.inWorld()&&waited<600){setTimeout(()=>unveil(waited+1),1000);if(waited)return;}else{body?.classList?.add('journey-unveil');setTimeout(()=>body?.classList?.remove('journey-unveil'),7000);if(waited)return;}
  const menu=document.getElementById('bMenu'),sheet=document.getElementById('mMenu');if(!menu?.classList)return;menu.classList.add('has-new');
  if(sheet&&typeof MutationObserver==='function'){const seen=new MutationObserver(()=>{if(!sheet.hidden){menu.classList.remove('has-new');seen.disconnect();}});seen.observe(sheet,{attributes:true,attributeFilter:['hidden']});}}
 function credits(r){r.credits=true;const box=r.el.querySelector('.journey-credits');box.replaceChildren(...(r.festival?FESTIVAL_LINES:CREDIT_LINES).map((line,i)=>{const p=document.createElement('p');p.textContent=line;p.style.animationDelay=`${i*.9}s`;if(i===0)p.className='journey-title';return p;}));}
 function frame(){if(!run)return;const el=run.el,cv=el.querySelector('canvas'),W=innerWidth,H=innerHeight,dpr=Math.min(2,devicePixelRatio||1);if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}
  const c=cv.getContext('2d'),t=now()-run.at,music=t-GATHER,end=run.length,still=calm();c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#000';c.fillRect(0,0,W,H);
  // The sky turns gold while your journey plays, and goes dark in the silence.
  const glow=(music<0?Math.max(0,1+music/GATHER)*.3:.35+.65*Math.min(1,music/end))*(music>end?Math.max(0,1-(music-end)/SILENCE):1);const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(240,210,122,${.32*glow})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  // The line of your journey: one peak per note, coloured by its chapter; the picture pulls back as it grows.
  const zoom=still?.7:1-.35*Math.max(0,Math.min(1,music/end)),y=H*.55,x0=W/2-W*.42*zoom,w=W*.84*zoom;c.globalAlpha=.3*Math.max(glow,.4);c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.moveTo(x0,y+.5);c.lineTo(x0+w,y+.5);c.stroke();
  for(const n of run.score){const age=music-n.at;if(age<0)break;const x=x0+(n.at+n.eighths*EIGHTH/2)/end*w,h=(10+(n.midi-44)*2.2)*zoom*(still?1:Math.min(1,.4+age*3));c.globalAlpha=music>end&&!run.festival?Math.max(0,1-(music-end)/SILENCE):.9;c.strokeStyle=runtime.placeColor?runtime.placeColor(n.chapter,CHAPTER_COLORS[n.chapter]||'#ffffff'):CHAPTER_COLORS[n.chapter]||'#ffffff';c.beginPath();c.moveTo(x-4*zoom,y);c.lineTo(x,y-h);c.lineTo(x+4*zoom,y);c.stroke();}
  c.globalAlpha=1;
  // Credits after the silence.
  if(music>end+SILENCE&&!run.credits)credits(run);
  if(music>end+SILENCE+CREDITS){finish(false);return;}
  requestAnimationFrame(frame);}
 Object.defineProperties(runtime,{journeyFinale:{get:()=>start},journeyFinaleSkip:{get:()=>()=>finish(true)},journeyFinaleState:{get:()=>()=>({...state,running:!!run,credits:!!run?.credits,notes:run?.score.length||0,seconds:run?GATHER+run.length+SILENCE+CREDITS:0})}});
}
