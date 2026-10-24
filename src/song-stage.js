import {prefersReducedMotion} from './frame-state.js';
import {SONG_LAYERS,SONG_IDS,tierStep,songChord} from './song.js';
import {THEME,themePitch} from './journey-pulse.js';
import {PLACES,TOTAL_STARS,starCount,allComplete} from './places.js';
// The song seen (plan F7): eleven rings, one per place. A layer you have won lights its ring in its colour and the ring
// beats with it; one you have not is a dim dashed ring, so what is missing is plain without words. The Refugio's
// «Tu canción» plays what you have; with the eleven places complete, every layer comes in one bar after another: that
// is winning (plan H3). With the 33 stars the same moment comes again as the master version.
// Plan H4: the song is the game's own music. The World keeps playing in its key and tempo, and the music's sequencer
// (songStageStep, called on every sixteenth) adds each place's layer over the chord it plays, grown by its stars:
// ★ a fragment, ★★ the whole layer, ★★★ its variation. The finale brings the layers in one bar after another, then
// your notes from each place in order (one bar each), then the cube's theme over everything; the master version
// plays every layer in its variation.
export const FINAL_ENTRY_BARS=1,FINAL_TAIL_BARS=2,SONG_BARS_OPEN=8,THEME_BARS=4;
export const FINAL_LINES=Object.freeze(['Los 11 lugares','Tu canción está completa','Kubono','Jay · diseño y código','Luca · primer jugador']);
export const MASTER_LINES=Object.freeze(['Las 33 ★','La versión maestra','Kubono','Jay · diseño y código','Luca · primer jugador']);
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
// The plan of a playing: how many bars, when each layer enters, when your notes and the theme come. Pure.
export function songPlan({final=false,ids=SONG_IDS,notes={}}={}){const entry={};if(final)ids.forEach((id,i)=>{entry[id]=i*FINAL_ENTRY_BARS;});else ids.forEach(id=>{entry[id]=0;});
 if(!final)return {final:false,entry,bars:SONG_BARS_OPEN,notesAt:null,themeAt:null};
 const notesAt=ids.length*FINAL_ENTRY_BARS,withNotes=ids.filter(id=>notes[id]?.length),themeAt=notesAt+withNotes.length;
 return {final:true,entry,bars:themeAt+THEME_BARS+FINAL_TAIL_BARS,notesAt,themeAt,noteOrder:withNotes};}
// What sounds at sixteenth k of a playing: the layers already in at their tier, your notes in their bar, the theme. Pure.
export function stageEvents(plan,k,chord,{tiers={},notes={},scale,tr=0}={}){if(k<0||k>=plan.bars*16)return [];const bar=Math.floor(k/16),b=k%16,out=[],c=songChord(chord);
 for(const [id,at] of Object.entries(plan.entry))if(bar>=at)for(const e of tierStep(id,k-at*16,c,tiers[id]||0))out.push({...e,layer:id});
 // The Faros' layer is the melody: the cube's theme in the World's key, two bars long (★ its first three notes, ★★ all of
 // it, ★★★ also an octave up).
 if(plan.entry.faros!==undefined&&bar>=plan.entry.faros&&(tiers.faros||0)>0){const local=(k-plan.entry.faros*16)%32;let at=0;THEME.forEach(([d,l],i)=>{if(at===local&&(tiers.faros>1||i<3)){const m=themePitch(d,scale,tr)+12;out.push({what:'lead',midi:m,len:l*2,layer:'faros'});if(tiers.faros>2)out.push({what:'lead',midi:m+12,len:l*2,layer:'faros',soft:true});}at+=l*2;});}
 if(plan.final&&bar>=plan.notesAt&&bar<plan.themeAt&&b%2===0){const id=plan.noteOrder[bar-plan.notesAt],m=notes[id]?.[b/2];if(Number.isFinite(m))out.push({what:'lead',midi:m+12,len:2,layer:id,mine:true});}
 if(plan.final&&bar>=plan.themeAt&&bar<plan.themeAt+THEME_BARS){let at=(plan.themeAt)*16;for(const [d,l] of THEME){if(at===k)out.push({what:'lead',midi:themePitch(d,scale,tr)+24,len:l*2,theme:true});at+=l*2;}}
 return out;}
export function initialize(runtime){
 let run=null;const state={opened:0,finals:0};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const data=()=>runtime.placesData?.();
 const won=()=>SONG_IDS.filter(id=>data()?.stars?.[id]?.[0]);
 // Each layer's tier is its stars (1–3); the master version plays all of them in their variation.
 const tiersOf=(ids,master=false)=>Object.fromEntries(ids.map(id=>[id,master?3:Math.max(1,(data()?.stars?.[id]||[]).filter(Boolean).length)]));
 function overlay(){let el=document.getElementById('songStage');if(!el){el=document.createElement('div');el.id='songStage';el.setAttribute('role','dialog');el.setAttribute('aria-label','Tu canción');
  el.innerHTML='<canvas></canvas><div class="song-stage-text" aria-live="polite"></div><div class="song-stage-row"><button id="songAgain">Otra vez</button><button id="songClose">Cerrar</button></div>';document.body.appendChild(el);}el.hidden=false;return el;}
 // A playing: over the World's music, from its next «1». Without the stage (a trophy), just its layer for two bars.
 function begin({ids,final=false,master=false,preview=false}){const ac=runtime.ac;let out=null,soft=null;if(runtime.S.sound&&ac&&runtime.bus){out=ac.createGain();out.gain.value=.55;out.connect(runtime.bus);soft=ac.createGain();soft.gain.value=.25;soft.connect(runtime.bus);}
  const notes=data()?.notes||{},plan=preview?{final:false,entry:Object.fromEntries(ids.map(id=>[id,0])),bars:2,notesAt:null,themeAt:null}:songPlan({final,ids,notes});
  return {ids:[...ids],final,master,preview,plan,tiers:tiersOf(ids,master),notes,out,soft,start:null,k:-1,last:{},at:performance.now()};}
 // Open the stage: your song as it is, or (final) the eleven layers coming in one after another.
 function open({final=false,master=false}={}){const ids=won();if(!ids.length&&!final){runtime.toast?.('Gana una ★ y empieza tu canción.',{level:2});return false;}if(run)close();
  document.querySelectorAll('.modal').forEach(m=>{m.hidden=true;});const el=overlay(),text=el.querySelector('.song-stage-text'),list=final?SONG_IDS:ids;runtime.audio?.();
  run={...begin({ids:list,final,master}),el};
  if(final){state.finals++;text.replaceChildren();runtime.narrate?.('won');}else{runtime.narrate?.('song');text.textContent=`Tu canción · ${ids.length} de ${SONG_IDS.length}`;}state.opened++;
  el.querySelector('#songAgain').hidden=final;el.querySelector('#songAgain').onclick=()=>open();el.querySelector('#songClose').textContent=final?'Seguir':'Cerrar';el.querySelector('#songClose').onclick=close;
  requestAnimationFrame(frame);return true;}
 // A trophy in the Refugio: its layer, at its stars, for two bars over the music.
 function preview(id){if(run&&!run.preview)return false;if(!runtime.S.sound||!runtime.ac||!runtime.bus)return false;run=begin({ids:[id],preview:true});return true;}
 function release(r){if(!r)return;const ac=runtime.ac;for(const g of [r.out,r.soft])if(g&&ac){try{g.gain.setTargetAtTime(.0001,ac.currentTime,.15);setTimeout(()=>g.disconnect(),1200);}catch(_){}}}
 function close(){if(!run)return;release(run);if(run.el)run.el.hidden=true;run=null;}
 // The sequencer's sixteenth: what the playing adds now, in the chord the World plays.
 function step(s,t){if(!run)return;if(run.start===null){if(s!==0)return;run.start=t;}const six=runtime.SIX||.15,k=Math.round((t-run.start)/six);if(k<=run.k)return;run.k=k;
  if(k>=run.plan.bars*16){if(run.preview){release(run);run=null;}else run.done=true;return;}
  if(!run.out)return;const MU=runtime.MU||{},scale=MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale,chord=runtime.chordTones?.()||[57,60,64];
  for(const e of stageEvents(run.plan,k,chord,{tiers:run.tiers,notes:run.notes,scale,tr:MU.tr||0})){runtime.songHit?.(e.soft?run.soft:run.out,e,t,six);if(e.layer)run.last[e.layer]=t;}}
 // How hard a layer is hitting now, for its ring.
 function pulse(id,time){const t=run?.last?.[id];if(!Number.isFinite(t))return 0;return Math.max(0,1-(time-t)/((runtime.SIX||.15)*4));}
 // Whether a layer sounds now: won, and already in (the final brings them in one bar after another).
 function sounding(id){if(!run||!run.ids.includes(id))return false;const bar=run.k<0?-1:Math.floor(run.k/16);return run.start!==null&&bar>=(run.plan.entry[id]||0);}
 function frame(){if(!run||!run.el)return;const el=run.el,cv=el.querySelector('canvas'),W=innerWidth,H=innerHeight,dpr=Math.min(2,devicePixelRatio||1);if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}
  const c=cv.getContext('2d'),ms=performance.now()-run.at,still=calm(),time=runtime.ac?.currentTime??0,bar=run.k<0?0:Math.floor(run.k/16);c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#000';c.fillRect(0,0,W,H);
  const full=run.ids.filter(id=>sounding(id)).length/SONG_IDS.length,g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(240,210,122,${.08+.3*full})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  // Without sound the stage still opens: the layers come in by the clock, at the World's tempo.
  if(!run.out&&run.k<run.plan.bars*16)run.k=Math.floor(ms/1000/((runtime.SIX||.125)))-1,run.start=run.start??0;
  const shown=run.final?Math.min(SONG_IDS.length,bar+1):SONG_IDS.length;
  drawSongRings(c,W,H,{lit:id=>sounding(id)||!run.final&&run.ids.includes(id),beat:id=>pulse(id,time)||(still?0:.3+.3*Math.sin(ms/300+id.length)),shown,still,color:(id,f)=>runtime.placeColor?.(id,f)||f});
  // The final: once every layer is in, the words and the credits.
  if(run.final&&bar>=SONG_IDS.length*FINAL_ENTRY_BARS&&!run.credits){run.credits=true;const box=el.querySelector('.song-stage-text');box.replaceChildren(...(run.master?MASTER_LINES:FINAL_LINES).map((line,i)=>{const p=document.createElement('p');p.textContent=line;p.style.animationDelay=`${i*.8}s`;if(i===0)p.className='journey-title';return p;}));}
  requestAnimationFrame(frame);}
 // With the eleven places complete, once: the true finale, after the round's card is closed. With the 33 stars, once
 // more: the master version.
 function check(){const d=data();if(!d)return false;
  if(!d.won&&allComplete(d)){d.won=true;if(runtime.save?.()===false){delete d.won;return false;}return open({final:true});}
  if(d.won&&!d.master&&starCount(d)>=TOTAL_STARS){d.master=true;if(runtime.save?.()===false){d.master=false;return false;}return open({final:true,master:true});}
  return false;}
 Object.defineProperties(runtime,{openSong:{get:()=>open},closeSong:{get:()=>close},songFinaleCheck:{get:()=>check},songStageStep:{get:()=>step},songLayerPreview:{get:()=>preview},
  songStageState:{get:()=>()=>({...state,running:!!run&&!run.preview,preview:!!run?.preview,final:!!run?.final,master:!!run?.master,ids:run?[...run.ids]:[],credits:!!run?.credits,k:run?.k??-1,bars:run?.plan?.bars||0,tiers:run?{...run.tiers}:{}})}});
}
