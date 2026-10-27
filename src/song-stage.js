import {prefersReducedMotion} from './frame-state.js';
import {SONG_LAYERS,SONG_IDS,SONG_STEPS,tierStep,songChord,chordAt,placeTier} from './song.js';
import {THEME,themePitch,phraseTimeline,audibleTime} from './journey-pulse.js';
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
// Plan I4 (Simogo, Wintory): your notes are those of all eleven places (the Journey's chapters included), played on the
// steps you played them and in the World's scale; the theme keeps silent until its moment (the Faros layer too), a bar
// of silence comes before it, the cello plays it twice (the second time a fifth up) and the credits come at the end.
// The finale lasts a minute at least.
// Panel 11 (Q7, D9-C, Wintory, Simogo): the finale ends on a written coda, not on the Faros layer at its tier. In its
// last three bars the cello plays the whole theme once more at its first pitch, from a pickup half a bar early, so the
// tonic falls on a «1»; that last bar holds the tonic over the pad and the bass on the tonic chord, and the song stops
// at the next «1». Nothing starts after the last «1». The Faros melody keeps only the bars between theme and coda.
export const FINAL_ENTRY_BARS=1,CODA_BARS=3,SONG_BARS_OPEN=8,THEME_BARS=4,SILENCE_BARS=1,FINAL_MIN_SECONDS=60;
// Where the coda's theme starts, in sixteenths from its first bar: its first five notes fill a bar and a half.
export const CODA_PICKUP=16*(CODA_BARS-1)-THEME.slice(0,-1).reduce((a,[,l])=>a+l*2,0);
// A note brought into the World's scale: the nearest pitch of the scale (root A + transpose), the lower one on a tie.
export function snapToScale(m,scale,tr=0){const sc=Array.isArray(scale)&&scale.length===7?scale:[0,2,3,5,7,8,10];let best=m,far=99;for(let o=-2;o<=8;o++)for(const s of sc){const n=57+tr+s+12*(o-1);const d=Math.abs(n-m);if(d<far||d===far&&n<best){far=d;best=n;}}return best;}
// Panel 10 (P6, D5-C, Simogo): the credits of authorship come once, in the finale of the eleven; the Journey's finale
// says only «Tu mundo se abrió» and the master version only its own two lines.
export const FINAL_LINES=Object.freeze(['Los 11 lugares','Tu canción está completa','Kubono','Jay · diseño y código','Luca · primer jugador']);
export const MASTER_LINES=Object.freeze(['Las 33 ★','La versión maestra']);
// Panel 11 (Q3, Simogo): the credits once for real. Once shown, the place's save keeps `credited`; a later finale of the
// eleven ends on this line alone. The finale closes by itself a while after its last bar, like the Journey's.
export const REPLAY_LINES=Object.freeze(['Tu canción está completa']),STAGE_LINGER=7;
// Panel 10 (P6, D5-B, Wintory): while your phrases sound and during the theme's first pass only the pad (Vacío) and the
// bass (Lago) keep playing; the other layers come back with the second pass. An arrangement of entries: no layer's
// notes change. Your phrase sounds in the soft voice of the Journey's finale (its arpeggio), not the thin lead.
export const UNDER_PHRASE=Object.freeze(['vacio','lago']);
export const held=(plan,bar)=>!!plan?.final&&(bar>=plan.notesAt&&bar<plan.silenceAt||bar>=plan.themeAt&&bar<plan.themeAt+THEME_BARS/2);
// Panel 10 (P6, Iwai): the rings tell ★, ★★ and ★★★ apart by saturation: ★ pale, ★★ fuller, ★★★ the whole colour.
// A colour without hue (the Vacío's white) is told apart by its brightness.
export const TIER_SATURATION=Object.freeze([0,.45,.75,1]);
export function tierInk(color,tier){const m=/^#([0-9a-f]{6})$/i.exec(String(color||''));if(!m)return color;const k=TIER_SATURATION[Math.max(0,Math.min(3,Math.floor(tier)||0))],n=parseInt(m[1],16),c=[n>>16&255,n>>8&255,n&255];
 const grey=.299*c[0]+.587*c[1]+.114*c[2],flat=Math.max(...c)-Math.min(...c)<16,out=c.map(v=>Math.round(flat?v*(.55+.45*k):grey+(v-grey)*k));return '#'+out.map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('');}
// Panel 11 (Q3, Iwai, Pope): the share of a layer that sounds at its tier, in its own hits over the song's eight bars
// (the Faros in the notes of the theme). The ring's arc is this share: the growth between ★ and ★★ is seen, without a
// number. A layer whose fragment already plays all its hits (Vacío, Cueva) shows a whole arc at ★.
export const farosNotes=tier=>tier>=2?THEME.length:3+Math.floor(Math.round((tier-1)*16)/6);
const shares=new Map();
export function layerShare(id,tier){if(!(tier>0))return 0;if(tier>=2)return 1;if(id==='faros')return Math.min(THEME.length,farosNotes(tier))/THEME.length;const key=id+':'+tier;if(shares.has(key))return shares.get(key);
 let n=0,all=0;for(let s=0;s<SONG_STEPS;s++){const c=chordAt(s);n+=tierStep(id,s,c,tier).length;all+=tierStep(id,s,c,2).length;}const v=all?n/all:1;shares.set(key,v);return v;}
export function ringLayout(W,H,n=SONG_IDS.length){const R=Math.min(W*.36,H*.3),cx=W/2,cy=H*.44,r=Math.max(14,Math.min(26,Math.min(W,H)*.045));
 return Array.from({length:n},(_,i)=>{const a=-Math.PI/2+i/n*2*Math.PI;return {x:cx+Math.cos(a)*R,y:cy+Math.sin(a)*R,r};});}
// Draw the rings: `lit` says which layers sound, `beat(id)` how hard each is hitting now (0–1), `shown` how many to draw.
export function drawSongRings(c,W,H,{ids=SONG_IDS,lit=()=>false,beat=()=>0,shown=ids.length,names=true,still=false,color=(id,fallback)=>fallback,tier=null}={}){
 const spots=ringLayout(W,H,ids.length);c.save();c.textAlign='center';c.textBaseline='top';
 ids.forEach((id,i)=>{if(i>=shown)return;const p=spots[i],on=lit(id),k=on?beat(id):0,base=color(id,SONG_LAYERS[id]?.color||'#ffffff'),ink=tier?tierInk(base,tier(id)):base;
  // Panel 11 (Q3, Iwai): with tiers the shape tells the stars apart: ★ an arc as long as what sounds, no fill; ★★ the
  // whole ring filled; ★★★ also a thin outer ring. The beat swells the fill, or thickens a ★ arc.
  const t=on&&tier?tier(id):null;
  if(on&&t!==null&&t<2){const share=layerShare(id,t),a0=-Math.PI/2;c.globalAlpha=.22;c.strokeStyle=ink;c.lineWidth=1;c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.stroke();
   c.globalAlpha=.95;c.lineWidth=2+(still?0:1.5*k);c.beginPath();c.arc(p.x,p.y,p.r,a0,a0+share*2*Math.PI);c.stroke();}
  else if(on&&t!==null){c.globalAlpha=.45+.3*k;c.fillStyle=ink;c.beginPath();c.arc(p.x,p.y,p.r*(1+(still?0:.12*k)),0,6.283);c.fill();c.globalAlpha=.95;c.strokeStyle=ink;c.lineWidth=2;c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.stroke();
   if(t>=3){c.globalAlpha=.8;c.lineWidth=1;c.beginPath();c.arc(p.x,p.y,p.r+4,0,6.283);c.stroke();}}
  else if(on){c.globalAlpha=.16+.3*k;c.fillStyle=ink;c.beginPath();c.arc(p.x,p.y,p.r*(1+(still?0:.18*k)),0,6.283);c.fill();c.globalAlpha=.95;c.strokeStyle=ink;c.lineWidth=2;c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.stroke();}
  else{c.globalAlpha=.35;c.strokeStyle='#ffffff';c.lineWidth=1;c.setLineDash?.([3,4]);c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.stroke();c.setLineDash?.([]);}
  if(names){const place=PLACES.find(q=>q.id===id);c.globalAlpha=1;c.fillStyle=on?'#ffffff':'#a0a0a0';c.font='11px "Geist Mono", monospace';c.fillText(place?.name||id,p.x,p.y+p.r+6);}});
 c.restore();return spots;}
// Describe the audible section without changing its notes, rhythm or mix.
export function stageCaption(plan,k){
 if(!Number.isFinite(k)||k<0)return {phase:'waiting',text:'Tu canción está por empezar.'};
 if(!plan?.final)return {phase:'layers',text:'Capas ganadas · Tus frases llegan al final.'};
 const bar=Math.floor(k/16);
 if(bar<plan.notesAt)return {phase:'layers',text:'Se unen los lugares que descubriste.'};
 if(bar<plan.silenceAt){const id=[...(plan.noteOrder||[])].reverse().find(id=>bar>=plan.noteStarts[id]);return {phase:'phrase:'+id,text:'Tu frase · '+(PLACES.find(p=>p.id===id)?.name||'Tu interpretación')};}
 if(bar<plan.themeAt)return {phase:'space',text:''};   // the silence speaks for itself (Wintory)
 if(bar<plan.endAt)return {phase:'theme',text:'El tema reúne tu viaje.'};
 return {phase:'ending',text:'Tu canción sigue contigo.'};
}
// A future scheduled onset must not replace the event currently reaching the speaker.
export function layerPulse(events,id,time,length){const hit=events?.findLast(e=>e.layer===id&&e.t<=time);return hit?Math.max(0,1-(time-hit.t)/length):0;}
// The plan of a playing: how many bars, when each layer enters, when your notes and the theme come. Pure.
export function songPlan({final=false,ids=SONG_IDS,notes={},steps={},ticks={},six=0}={}){const entry={};if(final)ids.forEach((id,i)=>{entry[id]=i*FINAL_ENTRY_BARS;});else ids.forEach(id=>{entry[id]=0;});
 if(!final)return {final:false,entry,bars:SONG_BARS_OPEN,notesAt:null,themeAt:null};
 const notesAt=ids.length*FINAL_ENTRY_BARS,withNotes=ids.filter(id=>notes[id]?.length),noteTimings={},noteStarts={};let silenceAt=notesAt;
 for(const id of withNotes){const timing=phraseTimeline(notes[id],steps[id],ticks[id]);noteTimings[id]=timing;noteStarts[id]=silenceAt;silenceAt+=Math.max(1,Math.ceil(((timing.at(-1)||0)+2)/16));}
 const themeAt=silenceAt+SILENCE_BARS,endAt=themeAt+THEME_BARS;
 // At least a minute: the layers keep playing after the theme until then; the coda closes it.
 const minBars=six>0?Math.ceil(FINAL_MIN_SECONDS/(16*six)):0,bars=Math.max(endAt+CODA_BARS,minBars);
 return {final:true,entry,bars,notesAt,silenceAt,themeAt,endAt,codaAt:bars-CODA_BARS,noteOrder:withNotes,noteTimings,noteStarts};}
// The tonic chord of the World's key, for the coda's last bar (the root A plus the transpose, as themePitch).
export function tonicChord(scale,tr=0){const sc=Array.isArray(scale)&&scale.length===7?scale:[0,2,3,5,7,8,10];return songChord([0,2,4].map(i=>57+tr+sc[i]));}
// What sounds at sixteenth k of a playing: the layers already in at their tier, your notes in their bar, the theme. Pure.
export function stageEvents(plan,k,chord,{tiers={},notes={},steps={},scale,tr=0}={}){if(k<0||k>=plan.bars*16)return [];const bar=Math.floor(k/16),b=k%16,out=[],c=songChord(chord);
 // The bar of silence before the theme: nothing at all.
 if(plan.final&&bar>=plan.silenceAt&&bar<plan.themeAt)return out;
 // The coda's last bar (Q7, D9-C): on its «1» the tonic on the cello, the pad and the bass on the tonic chord, a bar
 // long; then the cut. Nothing else starts.
 const coda=plan.final&&Number.isFinite(plan.codaAt)&&bar>=plan.codaAt;
 if(coda&&bar===plan.bars-1){if(b!==0)return out;const home=tonicChord(scale,tr);
  return [{what:'cello',midi:snapToScale(themePitch(THEME.at(-1)[0],scale,tr)+12,scale,tr),len:16,theme:true,coda:true,layer:'faros'},{what:'pad',tones:home.tones,len:16,layer:'vacio'},{what:'bass',midi:home.root,len:16,layer:'lago'}];}
 const hold=held(plan,bar);for(const [id,at] of Object.entries(plan.entry))if(bar>=at&&(!hold||UNDER_PHRASE.includes(id)))for(const e of tierStep(id,k-at*16,c,tiers[id]||0))out.push({...e,layer:id});
 // The Faros' layer is the melody: the cube's theme in the World's key, two bars long (★ its first three notes, a fourth
 // and a fifth as it grows by six and twelve beats, ★★ all of it, ★★★ also an octave up).
 if(plan.entry.faros!==undefined&&bar>=plan.entry.faros&&(tiers.faros||0)>0&&(!plan.final||bar>=plan.endAt&&!coda)){const local=(k-plan.entry.faros*16)%32;let at=0;const notes=farosNotes(tiers.faros);THEME.forEach(([d,l],i)=>{if(at===local&&i<notes){const m=themePitch(d,scale,tr)+12;out.push({what:'lead',midi:m,len:l*2,layer:'faros'});if(tiers.faros>=3)out.push({what:'lead',midi:m+12,len:l*2,layer:'faros',soft:true});}at+=l*2;});}
 if(plan.final&&bar>=plan.notesAt&&bar<plan.silenceAt){const id=[...plan.noteOrder].reverse().find(id=>bar>=plan.noteStarts[id]),ns=notes[id]||[],timing=plan.noteTimings[id],local=k-plan.noteStarts[id]*16;
  for(let i=0;i<ns.length;i++)if(timing[i]===local&&Number.isFinite(ns[i]))out.push({what:'arp',midi:snapToScale(ns[i],scale,tr)+12,len:2,layer:id,mine:true});}
 if(plan.final&&bar>=plan.themeAt&&bar<plan.endAt){const local=k-plan.themeAt*16,pass=local>=32?1:0;let at=0;for(const [d,l] of THEME){if(at===local-pass*32)out.push({what:'cello',midi:snapToScale(themePitch(d,scale,tr)+12+(pass?7:0),scale,tr),len:l*2,theme:true,second:!!pass});at+=l*2;}}
 // The coda's theme (Q7, D9-C): all six notes at the first pass's pitch, whatever the Faros tier; the sixth is the
 // tonic on the last bar's «1» (above).
 if(coda){const local=k-plan.codaAt*16;let at=CODA_PICKUP;for(const [d,l] of THEME.slice(0,-1)){if(at===local)out.push({what:'cello',midi:snapToScale(themePitch(d,scale,tr)+12,scale,tr),len:l*2,theme:true,coda:true,layer:'faros'});at+=l*2;}}
 return out;}
export function initialize(runtime){
 let run=null,raf=null,replacing=false;const state={opened:0,finals:0};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const data=()=>runtime.placesData?.();
 const won=()=>SONG_IDS.filter(id=>data()?.stars?.[id]?.[0]);
 // Each layer's tier is its stars (1–3), a ★ layer grown by your best share (D1-B); the master version plays all of
 // them in their variation.
 const tiersOf=(ids,master=false)=>Object.fromEntries(ids.map(id=>[id,master?3:Math.max(1,placeTier(data(),id))]));
 function overlay(){let el=document.getElementById('songStage');if(!el){el=document.createElement('div');el.id='songStage';el.setAttribute('role','dialog');el.setAttribute('aria-label','Tu canción');
  // The hidden title takes the opening focus, so «Otra vez» does not look chosen (panel 10, Nesbitt #15).
  el.innerHTML='<h2 class="sr-only" tabindex="-1">Tu canción</h2><canvas></canvas><div class="song-stage-text" aria-live="polite"></div><div class="song-stage-row"><button id="songAgain">Otra vez</button><button id="songClose">Cerrar</button></div>';document.body.appendChild(el);}el.hidden=false;return el;}
 // A playing: over the World's music, from its next «1». Without the stage (a trophy), just its layer for two bars.
 function begin({ids,final=false,master=false,preview=false}){const ac=runtime.ac;let out=null,soft=null;if(runtime.S.sound&&ac&&runtime.bus){out=ac.createGain();out.gain.value=.55;out.connect(runtime.bus);soft=ac.createGain();soft.gain.value=.25;soft.connect(runtime.bus);}
  const {notes,steps,ticks}=yourNotes(),plan=preview?{final:false,entry:Object.fromEntries(ids.map(id=>[id,0])),bars:2,notesAt:null,themeAt:null}:songPlan({final,ids,notes,steps,ticks,six:runtime.SIX||.125});
  return {ids:[...ids],final,master,preview,plan,tiers:tiersOf(ids,master),notes,steps,ticks,out,soft,start:null,k:-1,last:{},hits:[],at:performance.now()};}
 // Your notes for the finale (plan I4): each place's last round, and for the Journey's five, its chapter if not replayed.
 function yourNotes(){const d=data()||{},j=runtime.S.journey||{},notes={},steps={},ticks={};for(const id of SONG_IDS){const own=d.notes?.[id];if(own?.length){notes[id]=own;if(d.noteSteps?.[id])steps[id]=d.noteSteps[id];if(d.noteTicks?.[id])ticks[id]=d.noteTicks[id];continue;}
   const ch=Array.isArray(j.notes?.[id])?j.notes[id].filter(Number.isFinite).slice(-8):[];if(ch.length){notes[id]=ch;const st=Array.isArray(j.steps?.[id])?j.steps[id].slice(-8):null;if(st&&st.length===ch.length)steps[id]=st.map(s=>Math.round(s)%16);const ts=j.ticks?.[id]?.slice(-8);if(ts?.length===ch.length)ticks[id]=ts;}}
  return {notes,steps,ticks};}
 // Open the stage: your song as it is, or (final) the eleven layers coming in one after another.
 // `at`: the audio time its first bar may start (the end of a round's drop, D5-A); by default the next «1».
 function open({final=false,master=false,at=null}={}){const ids=won();if(!ids.length&&!final){runtime.toast?.('Gana una ★ y empieza tu canción.',{level:2});return false;}if(run){replacing=true;try{close();}finally{replacing=false;}}
  document.querySelectorAll('.modal').forEach(m=>{m.hidden=true;});const el=overlay(),text=el.querySelector('.song-stage-text'),list=final?SONG_IDS:ids;runtime.audio?.();
  run={...begin({ids:list,final,master}),el,startAt:Number.isFinite(at)?at:null};
  if(final){state.finals++;text.replaceChildren();runtime.narrate?.('won');}else{runtime.narrate?.('song');const personal=ids.filter(id=>run.notes[id]?.length).length;text.textContent=`Tu canción · ${ids.length} de ${SONG_IDS.length}\n`+(personal?`Frases guardadas · ${personal} ${personal===1?'lugar':'lugares'} · para el final`:'Capas ganadas · Tus frases llegan al final.');}state.opened++;
  el.querySelector('#songAgain').hidden=final;el.querySelector('#songAgain').onclick=()=>open({final,master});el.querySelector('#songClose').textContent=final?'Seguir':'Cerrar';el.querySelector('#songClose').onclick=close;
  raf=requestAnimationFrame(frame);return true;}
 // A trophy in the Refugio: its layer, at its stars, for two bars over the music.
 function preview(id){if(run&&!run.preview)return false;if(!runtime.S.sound||!runtime.ac||!runtime.bus)return false;run=begin({ids:[id],preview:true});return true;}
 function release(r){if(!r)return;const ac=runtime.ac;for(const g of [r.out,r.soft])if(g&&ac){try{g.gain.setTargetAtTime(.0001,ac.currentTime,.15);setTimeout(()=>g.disconnect(),1200);}catch(_){}}}
 function close(){if(!run)return;const final=run.final;runtime.restoreSongMix?.();if(raf!==null)cancelAnimationFrame(raf);raf=null;release(run);if(run.el)run.el.hidden=true;run=null;if(final&&!replacing)runtime.placeFinaleClosed?.();}
 // The sequencer's sixteenth: what the playing adds now, in the chord the World plays. `swung`: when the World's
 // swing would play this sixteenth (audio.js); the finale's odd sixteenths take it (Q7, D9-B), so its groove is the
 // World's own. Its clock stays on the straight time.
 function step(s,t,tick,swung){if(!run||!run.out||Number.isFinite(run.lastTime)&&t<=run.lastTime)return;
  const first=run.start===null;if(first){if(s!==0||run.startAt!==null&&t<run.startAt-.001)return;run.start=t;}
  const six=runtime.SIX||.15,delta=first?0:Number.isSafeInteger(tick)&&Number.isSafeInteger(run.lastTick)&&tick>run.lastTick?tick-run.lastTick:(s-run.lastStep+16)%16||16,k=first?0:run.k+delta;
  run.lastTime=t;run.lastStep=s;run.lastTick=tick;run.k=k;(run.clock||=[]).push({k,t,six});if(run.clock.length>128)run.clock.shift();
  if(k>=run.plan.bars*16){if(run.pauseScheduled&&!run.resumeScheduled){run.resumeScheduled=true;runtime.restoreSongMix?.(t);}if(run.preview){release(run);run=null;}else run.done=true;return;}
  if(run.final&&!run.pauseScheduled&&k>=run.plan.silenceAt*16&&k<run.plan.themeAt*16){run.pauseScheduled=true;runtime.silenceSongMix?.(t);}
  if(run.pauseScheduled&&!run.resumeScheduled&&k>=run.plan.themeAt*16){run.resumeScheduled=true;runtime.restoreSongMix?.(t);}
  if(!run.out)return;const MU=runtime.MU||{},scale=MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale,chord=runtime.chordTones?.()||[57,60,64];
  const at=run.final&&s%2===1&&Number.isFinite(swung)&&swung>=t?swung:t;
  for(const e of stageEvents(run.plan,k,chord,{tiers:run.tiers,notes:run.notes,steps:run.steps,scale,tr:MU.tr||0})){runtime.songHit?.(e.soft?run.soft:run.out,e,at,six);if(e.layer){run.last[e.layer]=at;run.hits.push({layer:e.layer,t:at});if(run.hits.length>256)run.hits.shift();}}}
 // Panel 11 (Q7, D9-B, Wintory): the World's radio keeps silent under the finale of the eleven, from its first «1»
 // until the stage closes, as it does under the Journey's finale. The World still advances (its chords lead the
 // layers); only what it plays is held. Tu canción from Lugares and a trophy's preview keep the radio.
 function hushWorld(s,t){return !!run&&run.final&&!run.preview&&!!run.out&&(run.start!==null||s===0&&(run.startAt===null||t>=run.startAt-.001));}
 // How hard a layer is hitting now, for its ring.
 function pulse(id,time){if(!run)return 0;const bar=Math.floor(visualStep()/16);if(run.final&&bar>=run.plan.silenceAt&&bar<run.plan.themeAt)return 0;return layerPulse(run.hits,id,time,(runtime.SIX||.15)*4);}
 // Whether a layer sounds now: won, and already in (the final brings them in one bar after another).
 function visualStep(){if(!run?.out||!runtime.ac)return run?.k??-1;const now=audibleTime(runtime.ac),entry=run.clock?.findLast(e=>e.t<=now);return entry?entry.k+Math.min(.99,Math.max(0,(now-entry.t)/entry.six)):-1;}
 function sounding(id){if(!run||!run.ids.includes(id))return false;const k=visualStep(),bar=k<0?-1:Math.floor(k/16);return run.start!==null&&bar>=(run.plan.entry[id]||0);}
 function frame(){if(!run||!run.el)return;const el=run.el,cv=el.querySelector('canvas'),W=innerWidth,H=innerHeight,dpr=Math.min(2,devicePixelRatio||1);if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}
  const c=cv.getContext('2d'),ms=performance.now()-run.at,still=calm(),time=runtime.ac?audibleTime(runtime.ac):0,cursor=visualStep(),bar=Math.max(0,Math.floor(cursor/16));c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#000';c.fillRect(0,0,W,H);
  // The gold veil is the finale's alone (panel 11, Q3): Tu canción opened from Lugares stays on black.
  if(run.final){const full=run.ids.filter(id=>sounding(id)).length/SONG_IDS.length,g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(240,210,122,${.08+.3*full})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);}
  // Without sound the stage still opens: the layers come in by the clock, at the World's tempo.
  if(!run.out&&run.k<run.plan.bars*16)run.k=Math.floor(ms/1000/((runtime.SIX||.125)))-1,run.start=run.start??0;
  const shown=run.final?Math.min(SONG_IDS.length,bar+1):SONG_IDS.length;
  run.rings=drawSongRings(c,W,H,{lit:id=>sounding(id)||!run.final&&run.ids.includes(id),beat:id=>run.out&&runtime.S.sound?pulse(id,time):(still?0:.3+.3*Math.sin(ms/300+id.length)),shown,still,color:(id,f)=>runtime.placeColor?.(id,f)||f,tier:id=>run.tiers[id]||1});
  if(run.final&&!run.credits){const cue=stageCaption(run.plan,run.start===null?-1:cursor),label=cue.text?(runtime.S.sound===false||runtime.musicVolume?.()===0?'Vista silenciosa · ':'')+cue.text:'';if(label!==run.caption){run.caption=label;el.querySelector('.song-stage-text').textContent=label;}}
  // The final: the words and the credits once the theme has sounded (plan I4: at the end, not before your notes).
  if(run.final&&bar>=run.plan.endAt&&!run.credits){run.credits=true;el.querySelector('#songAgain').hidden=false;const box=el.querySelector('.song-stage-text');box.replaceChildren(...credits().map((line,i)=>{const p=document.createElement('p');p.textContent=line;p.style.animationDelay=`${i*.8}s`;if(i===0)p.className='journey-title';return p;}));}
  // Panel 11 (Q3, Simogo): the finale ends by itself, STAGE_LINGER seconds after its last bar is heard.
  if(run.final&&cursor>=run.plan.bars*16){run.endedAt??=performance.now();if(performance.now()-run.endedAt>=STAGE_LINGER*1000){raf=null;close();return;}}
  raf=requestAnimationFrame(frame);}
 // The credits of authorship once for real (panel 11, Q3): the first finale of the eleven that reaches them keeps
 // `credited` in the save; later ones end on «Tu canción está completa». The master version keeps its own lines.
 function credits(){if(run.master)return MASTER_LINES;const d=data();if(d?.credited)return REPLAY_LINES;
  if(d&&!d.readOnly){d.credited=true;if(runtime.save?.()===false)d.credited=false;}return FINAL_LINES;}
 // With the eleven places complete, once: the true finale, straight after the round that completes them (D5-A). With
 // the 33 stars, once more: the master version, after the round's card is closed.
 function check({at=null}={}){const d=data();if(!d)return false;
  if(!d.won&&allComplete(d)){d.won=true;if(runtime.save?.()===false){delete d.won;return false;}return open({final:true,at});}
  if(d.won&&!d.master&&starCount(d)>=TOTAL_STARS){d.master=true;if(runtime.save?.()===false){d.master=false;return false;}return open({final:true,master:true});}
  return false;}
 Object.defineProperties(runtime,{openSong:{get:()=>open},replaySong:{get:()=>()=>open({final:allComplete(data()),master:starCount(data())>=TOTAL_STARS})},closeSong:{get:()=>close},songFinaleCheck:{get:()=>check},songStageStep:{get:()=>step},songFinaleHush:{get:()=>hushWorld},songLayerPreview:{get:()=>preview},
  songStageState:{get:()=>()=>({...state,running:!!run&&!run.preview,preview:!!run?.preview,final:!!run?.final,master:!!run?.master,ids:run?[...run.ids]:[],credits:!!run?.credits,ended:run?.endedAt!=null,rings:run?.rings?run.rings.map((p,i)=>({id:SONG_IDS[i],x:p.x,y:p.y,r:p.r})):[],k:run?.k??-1,start:run?.start??null,six:runtime.SIX||null,caption:run?.caption??null,bars:run?.plan?.bars||0,tiers:run?{...run.tiers}:{},pulses:run?Object.fromEntries(run.ids.map(id=>[id,pulse(id,runtime.ac?audibleTime(runtime.ac):0)])):{},personalNotes:run?Object.fromEntries(Object.entries(run.notes).map(([id,ns])=>[id,[...ns]])):{}})}});
}
