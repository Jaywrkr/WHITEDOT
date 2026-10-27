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
// last three bars the stabs play the whole theme once more at its first pitch, from a pickup half a bar early, so the
// tonic falls on a «1». Q7 in dub techno (Jay, after the first renders): the coda is the peak. Its first two bars rise
// (the chords' filter wide open, a noise riser); on the last bar's «1» the hit: the tonic on top of a held sus2 stab,
// the sub, the kick and an impact; at the next «1», the last one, a dry cut to silence, echo and room included.
// Nothing starts after the hit. The Faros melody keeps only the bars between theme and coda.
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
// notes change. Your phrase sounds in the dub voice of the finales (Q7), not the thin lead.
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
// The tonic chord of the World's key for the hit (the root A plus the transpose, as themePitch): sus2, its first, second
// and fifth degrees, dark in any mode.
export function tonicChord(scale,tr=0){const sc=Array.isArray(scale)&&scale.length===7?scale:[0,2,3,5,7,8,10];return songChord([0,1,4].map(i=>57+tr+sc[i]));}
// Panel 11 (Q7, dub techno; Jay: «más radical, electrónica underground»): both finales sound as dub techno, in their
// own voices, never the World's radio. A deep round kick, a sub bass, off-beat hats, a rim thrown into the echo, and
// the chord stabs: short, detuned, through a low-pass that opens over the finale (the rise), into a dotted-eighth echo
// with feedback and a long dark room. The theme rides on top of the stabs. Each finale ends rise, hit and dry cut: on
// its last «1» the whole output, echo and room included, drops to silence in a few milliseconds. Built per finale on
// the finale's own gain; the World's voices, delay and reverb are not used. Noise and room are deterministic.
export const DUB_ECHO=3,DUB_FEEDBACK=.56,DUB_OPEN=Object.freeze([260,5200]),DUB_CUT=.006,DUB_BODY=.25,DUB_CURVE=1.6,FINALE_LEVEL=.07;
// The rise, from 0 (closed) to 1 (the hit): the chords' cutoff opens exponentially, the body's level grows faster
// toward the end.
const unit=p=>Math.max(0,Math.min(1,Number.isFinite(p)?p:0));
export const dubCutoff=p=>DUB_OPEN[0]*Math.pow(DUB_OPEN[1]/DUB_OPEN[0],unit(p)),dubBody=p=>DUB_BODY+(1-DUB_BODY)*Math.pow(unit(p),DUB_CURVE);
// Where the finale of the eleven is in its rise at a bar: up to DUB_HOLD as the layers come in; under your phrases and
// the silence a breakdown (DUB_BREAK: the filter closes a little, the body steps back), so the room for them stays;
// then from DUB_HOLD on to the hit with the theme and the coda.
export const DUB_HOLD=.4,DUB_BREAK=.25;
export function dubRise(plan,bar){if(!plan?.final)return 1;const last=Math.max(plan.themeAt+1,plan.bars-1);if(bar<plan.notesAt)return DUB_HOLD*bar/Math.max(1,plan.notesAt);if(bar<plan.themeAt)return DUB_BREAK;return Math.min(1,DUB_HOLD+(1-DUB_HOLD)*(bar-plan.themeAt)/(last-plan.themeAt));}
const dubHz=m=>440*2**((m-69)/12);
function dubNoise(ac,seconds,dark=0){const n=Math.max(1,Math.floor(ac.sampleRate*seconds)),b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);let x=12345,y=0;
 for(let i=0;i<n;i++){x=(x*16807)%2147483647;const w=x/1073741823.5-1;y+=(1-dark)*(w-y);d[i]=dark?y*Math.pow(1-i/n,2.4)*2:w;}return b;}
// The stab's voicing under a note on top: the chord's tones brought just below it (in the octave under the top).
export function underTop(tones,top){return [...new Set(tones.map(m=>{let n=m;while(n>=top)n-=12;while(n<top-12)n+=12;return n;}))].filter(n=>n!==top).sort((a,b)=>a-b);}
// The stab of a degree: a minor seventh where the scale gives a minor third, otherwise sus2 (no bright major third).
export function dubChord(degree,scale,tr=0){const sc=Array.isArray(scale)&&scale.length===7?scale:[0,2,3,5,7,8,10],at=k=>57+tr+sc[(degree+k)%7]+12*Math.floor((degree+k)/7),third=((at(2)-at(0))%12+12)%12;
 return (third===3?[0,2,4,6]:[0,1,4]).map(at);}
export function createDub(ac,dest,{six=.125,level=1}={}){
 if(!ac||!dest||!['createGain','createOscillator','createBiquadFilter','createDelay','createConvolver','createBuffer','createBufferSource'].every(k=>typeof ac[k]==='function'))return null;
 const gain=v=>{const g=ac.createGain();g.gain.value=v;return g;},filter=(type,f,q=.7)=>{const n=ac.createBiquadFilter();n.type=type;n.frequency.value=f;n.Q.value=q;return n;};
 // `out` carries the level and the cut; `body` the rise (a quarter of the level at the start, all of it at the hit).
 const out=gain(level),body=gain(1);out.connect(dest);body.connect(out);
 const drums=gain(1);drums.connect(body);
 // The echo: dotted eighth, its repeats darker and thinner each time; it feeds the room as well.
 const echo=gain(1),delay=ac.createDelay(2),fb=gain(DUB_FEEDBACK),dhp=filter('highpass',260),dlp=filter('lowpass',1900),ret=gain(.85);delay.delayTime.value=Math.min(1.9,six*DUB_ECHO);
 echo.connect(delay);delay.connect(dhp);dhp.connect(dlp);dlp.connect(fb);fb.connect(delay);dlp.connect(ret);ret.connect(body);
 const room=gain(1),verb=ac.createConvolver(),vret=gain(.55);verb.buffer=dubNoise(ac,2.8,.7);room.connect(verb);verb.connect(vret);vret.connect(body);const er=gain(.35);ret.connect(er);er.connect(room);
 // The chords' low-pass: closed at the start, open at the hit.
 const chords=gain(1),lp=filter('lowpass',DUB_OPEN[0],1.1);chords.connect(lp);lp.connect(body);const ce=gain(.6),cr=gain(.3);lp.connect(ce);ce.connect(echo);lp.connect(cr);cr.connect(room);
 const hats=filter('highpass',7000);hats.connect(body);
 const noise=dubNoise(ac,1);
 const env=(g,t,v,a,hold,end)=>{g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,v),t+a);if(hold>t+a)g.gain.setValueAtTime(Math.max(.0002,v),hold);g.gain.exponentialRampToValueAtTime(.0001,Math.max(end,hold+.01,t+a+.01));};
 const osc=(type,f,t,end,to)=>{const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);o.connect(to);o.start(t);o.stop(end+.05);return o;};
 const burst=(t,dur,v,type,f,q,to,sends=[])=>{const s=ac.createBufferSource(),fl=filter(type,f,q),g=ac.createGain();s.buffer=noise;env(g,t,v,.001,t,t+dur);s.connect(fl);fl.connect(g);g.connect(to);for(const [bus,k] of sends){const sg=gain(k);g.connect(sg);sg.connect(bus);}s.start(t);s.stop(t+dur+.05);return {s,fl,g};};
 const send=(g,bus,k)=>{const sg=gain(k);g.connect(sg);sg.connect(bus);};
 function kick(t,v){const g=ac.createGain(),o=osc('sine',150,t,t+.6,g);o.frequency.exponentialRampToValueAtTime(52,t+.07);o.frequency.exponentialRampToValueAtTime(44,t+.45);env(g,t,v,.002,t+.03,t+.55);g.connect(drums);burst(t,.012,v*.12,'bandpass',2600,1,drums);}
 // The sub: a sine, with its octave for small speakers.
 function sub(m,t,dur,v){const g=ac.createGain(),lpf=filter('lowpass',240);osc('sine',dubHz(m),t,t+dur,g);const h=gain(.3);osc('triangle',dubHz(m)*2,t,t+dur,h);h.connect(g);env(g,t,v,.008,t+dur*.85,t+dur);g.connect(lpf);lpf.connect(drums);}
 function hat(t,v){burst(t,.035,v,'highpass',8000,.7,hats,[[echo,.12]]);}
 function rim(t,v){burst(t,.09,v,'bandpass',1700,1.4,body,[[echo,.55],[room,.3]]);const g=ac.createGain();osc('sine',380,t,t+.05,g);env(g,t,v*.5,.001,t,t+.04);g.connect(body);send(g,echo,.4);}
 // A stab: detuned saws under its own short filter envelope, into the chords' bus. `top` sounds a little louder.
 // A stab: detuned saws under their own short filter envelope, into the chords' bus. A note on `top` (the theme) gets
 // a voice of its own, louder and brighter than the chord under it, so the melody reads through the echo.
 function stab(tones,top,t,dur,v,held=false){const hasTop=Number.isFinite(top),g=ac.createGain(),f=filter('lowpass',held?3600:2400,held?1.2:2.4);
  f.frequency.setValueAtTime(held?3600:2400,t);f.frequency.exponentialRampToValueAtTime(held?900:420,t+(held?dur:.2));
  for(const m of tones)for(const d of [-8,8]){const o=osc('sawtooth',dubHz(m),t,t+dur,f);o.detune.setValueAtTime(d,t);}
  env(g,t,(hasTop?.5:1)*v/Math.sqrt(Math.max(1,tones.length)),.004,held?t+dur-.02:t+Math.min(dur*.4,.08),t+dur);f.connect(g);g.connect(chords);
  if(hasTop){const tg=ac.createGain(),tf=filter('lowpass',3200,2);tf.frequency.setValueAtTime(3200,t);tf.frequency.exponentialRampToValueAtTime(held?1400:900,t+Math.min(dur,.35));osc('square',dubHz(top),t,t+dur,tf);const o=osc('sawtooth',dubHz(top),t,t+dur,tf);o.detune.setValueAtTime(5,t);
   env(tg,t,v*.8,.004,held?t+dur-.02:t+Math.min(dur*.6,.3),t+dur);tf.connect(tg);tg.connect(chords);send(tg,echo,.35);}}
 // One note of a phrase in the dub voice: square and saw through a closing resonant filter, thrown into the echo. Your
 // own notes (`free`) keep clear of the chords' closed filter, so they are heard from the first bar.
 function dub(m,t,dur,v,wet=.7,free=false){const g=ac.createGain(),f=filter('lowpass',1700,3);f.frequency.setValueAtTime(1700,t);f.frequency.exponentialRampToValueAtTime(380,t+.18);osc('square',dubHz(m),t,t+dur,f);const o=osc('sawtooth',dubHz(m),t,t+dur,f);o.detune.setValueAtTime(6,t);
  env(g,t,v,.004,t+Math.min(dur*.5,.12),t+dur);f.connect(g);g.connect(free?body:chords);send(g,echo,wet);}
 function drone(tones,t,dur,v){const g=ac.createGain(),f=filter('lowpass',420,.6);for(const m of tones)for(const d of [-5,5]){const o=osc('sawtooth',dubHz(m-12),t,t+dur,f);o.detune.setValueAtTime(d,t);}
  env(g,t,v,Math.min(.8,dur*.3),t+dur*.7,t+dur);f.connect(g);g.connect(body);send(g,room,.5);burst(t,dur,v*.35,'bandpass',4200,.5,body);}
 function riser(t,dur,v){const {fl,g}=burst(t,dur,v,'bandpass',300,1.6,body,[[room,.4]]);fl.frequency.setValueAtTime(300,t);fl.frequency.exponentialRampToValueAtTime(7000,t+dur);g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+dur-.01);g.gain.setValueAtTime(.0001,t+dur);}
 function hit(e,t,six=.125){const v=(e.level??1)*(e.soft?.5:1),dur=Math.max(.05,(e.len||1)*six);switch(e.what){
  case 'kick':return kick(t,.95*v);
  case 'bass':case 'sub':return sub(e.midi,t,Math.max(dur,six*2),.4*v);
  case 'hat':return hat(t,.16*v);
  case 'shaker':return burst(t,.02,.035*v,'highpass',9500,.7,hats);
  case 'clap':return rim(t,.22*v);
  case 'stab':return stab(e.tones||[],Number.isFinite(e.midi)?e.midi:NaN,t,e.golpe?dur:Math.min(dur,e.theme?.45:.24),(e.golpe?.5:e.theme?.42:.3)*v,!!e.golpe);
  case 'lead':return stab(e.tones||[],e.midi,t,Math.min(dur,.45),.36*v);
  case 'dub':case 'arp':{const own=!!(e.mine||e.group==='phrase');return dub(e.midi,t,Math.min(.3,dur),(own?.14:.08)*v,own?.6:.4,own);}
  case 'acid':return dub(e.midi,t,.09,(e.accent?.05:.035)*v,.3);
  case 'echo':return dub(e.midi,t,.18,.07*v,1);
  case 'bell':return dub(e.midi,t,.12,.045*v,.8);
  case 'conga':{const g=ac.createGain(),o=osc('sine',dubHz(e.midi)*1.6,t,t+.2,g);o.frequency.exponentialRampToValueAtTime(dubHz(e.midi-12),t+.06);env(g,t,.12*v,.002,t,t+.18);g.connect(body);send(g,echo,.35);return;}
  case 'pad':case 'drone':return drone(e.tones||[],t,dur,.05*v);
  case 'impact':return burst(t,.6,.25*v,'lowpass',5000,.5,body,[[room,.8]]);
  case 'riser':return riser(t,dur,.12*v);}}
 // The rise: from one point of the rise to another (0 closed, 1 the hit), the chords' low-pass and the body's level;
 // and the echo's time with the tempo.
 function open(t0,p0,t1,p1){lp.frequency.setValueAtTime(dubCutoff(p0),t0);lp.frequency.exponentialRampToValueAtTime(dubCutoff(p1),t1);body.gain.setValueAtTime(dubBody(p0),t0);body.gain.linearRampToValueAtTime(dubBody(p1),t1);}
 function tempo(t,s){delay.delayTime.setTargetAtTime(Math.min(1.9,s*DUB_ECHO),t,.05);}
 // The dry cut: everything, echo and room included, to silence by `at`; the feedback stops so nothing comes back.
 function cut(at){const now=ac.currentTime||0,from=Math.max(now,at-DUB_CUT);out.gain.setValueAtTime(level,from);out.gain.linearRampToValueAtTime(0,Math.max(from,at));for(const g of [fb,echo,room])g.gain.setValueAtTime(0,Math.max(from,at)+.002);}
 return {out,hit,open,tempo,cut,level};}
// What sounds at sixteenth k of a playing: the layers already in at their tier, your notes in their bar, the theme. Pure.
export function stageEvents(plan,k,chord,{tiers={},notes={},steps={},scale,tr=0}={}){if(k<0||k>=plan.bars*16)return [];const bar=Math.floor(k/16),b=k%16,out=[],c=songChord(chord);
 // The bar of silence before the theme: nothing at all.
 if(plan.final&&bar>=plan.silenceAt&&bar<plan.themeAt)return out;
 // The coda's last bar (Q7, D9-C, dub): on its «1» the hit, a bar long: the tonic on top of the held sus2 stab, the sub
 // on the root, the kick and an impact; then the dry cut on the next «1». Nothing else starts.
 const coda=plan.final&&Number.isFinite(plan.codaAt)&&bar>=plan.codaAt;
 if(coda&&bar===plan.bars-1){if(b!==0)return out;const home=tonicChord(scale,tr),top=snapToScale(themePitch(THEME.at(-1)[0],scale,tr)+12,scale,tr);
  return [{what:'stab',midi:top,tones:underTop(home.tones,top),len:16,theme:true,coda:true,golpe:true,layer:'faros'},{what:'sub',midi:home.root,len:16,golpe:true,layer:'lago'},{what:'kick',golpe:true,layer:'llanura'},{what:'impact',len:16,golpe:true,layer:'cueva'}];}
 // The rise: a noise riser over the coda's first two bars, into the hit.
 if(coda&&k===plan.codaAt*16)out.push({what:'riser',len:(CODA_BARS-1)*16,layer:'vacio'});
 const hold=held(plan,bar);for(const [id,at] of Object.entries(plan.entry))if(bar>=at&&(!hold||UNDER_PHRASE.includes(id)))for(const e of tierStep(id,k-at*16,c,tiers[id]||0))out.push({...e,layer:id});
 // The Faros' layer is the melody: the cube's theme in the World's key, two bars long (★ its first three notes, a fourth
 // and a fifth as it grows by six and twelve beats, ★★ all of it, ★★★ also an octave up).
 if(plan.entry.faros!==undefined&&bar>=plan.entry.faros&&(tiers.faros||0)>0&&(!plan.final||bar>=plan.endAt&&!coda)){const local=(k-plan.entry.faros*16)%32;let at=0;const notes=farosNotes(tiers.faros);THEME.forEach(([d,l],i)=>{if(at===local&&i<notes){const m=themePitch(d,scale,tr)+12;out.push({what:'lead',midi:m,len:l*2,layer:'faros',...(plan.final?{tones:underTop(c.tones,m)}:{})});if(tiers.faros>=3)out.push({what:'lead',midi:m+12,len:l*2,layer:'faros',soft:true,...(plan.final?{tones:underTop(c.tones,m+12)}:{})});}at+=l*2;});}
 if(plan.final&&bar>=plan.notesAt&&bar<plan.silenceAt){const id=[...plan.noteOrder].reverse().find(id=>bar>=plan.noteStarts[id]),ns=notes[id]||[],timing=plan.noteTimings[id],local=k-plan.noteStarts[id]*16;
  for(let i=0;i<ns.length;i++)if(timing[i]===local&&Number.isFinite(ns[i]))out.push({what:'dub',midi:snapToScale(ns[i],scale,tr)+12,len:2,layer:id,mine:true});}
 if(plan.final&&bar>=plan.themeAt&&bar<plan.endAt){const local=k-plan.themeAt*16,pass=local>=32?1:0;let at=0;for(const [d,l] of THEME){if(at===local-pass*32){const m=snapToScale(themePitch(d,scale,tr)+12+(pass?7:0),scale,tr);out.push({what:'stab',midi:m,tones:underTop(c.tones,m),len:l*2,theme:true,second:!!pass});}at+=l*2;}}
 // The coda's theme (Q7, D9-C): all six notes at the first pass's pitch on top of the stabs, whatever the Faros tier;
 // the sixth is the tonic of the hit on the last bar's «1» (above).
 if(coda){const local=k-plan.codaAt*16;let at=CODA_PICKUP;for(const [d,l] of THEME.slice(0,-1)){if(at===local){const m=snapToScale(themePitch(d,scale,tr)+12,scale,tr);out.push({what:'stab',midi:m,tones:underTop(c.tones,m),len:l*2,theme:true,coda:true,layer:'faros'});}at+=l*2;}}
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
 // The finale of the eleven plays in its own dub voices (Q7); Tu canción from Lugares and a trophy keep the song's.
 function begin({ids,final=false,master=false,preview=false}){const ac=runtime.ac;let out=null,soft=null,dub=null;if(runtime.S.sound&&ac&&runtime.bus){dub=final&&!preview?createDub(ac,runtime.bus,{six:runtime.SIX||.125,level:FINALE_LEVEL}):null;if(dub)out=dub.out;else{out=ac.createGain();out.gain.value=.55;out.connect(runtime.bus);soft=ac.createGain();soft.gain.value=.25;soft.connect(runtime.bus);}}
  const {notes,steps,ticks}=yourNotes(),plan=preview?{final:false,entry:Object.fromEntries(ids.map(id=>[id,0])),bars:2,notesAt:null,themeAt:null}:songPlan({final,ids,notes,steps,ticks,six:runtime.SIX||.125});
  return {ids:[...ids],final,master,preview,plan,tiers:tiersOf(ids,master),notes,steps,ticks,out,soft,dub,start:null,k:-1,last:{},hits:[],at:performance.now()};}
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
  const at=run.final&&s%2===1&&Number.isFinite(swung)&&swung>=t?swung:t,dub=run.dub;
  // The rise (Q7, dub): bar by bar the chords' filter opens, wide at the hit; the echo follows the tempo. The hit's
  // bar ends in the dry cut on the last «1».
  if(dub&&k%16===0){const bar=k/16;dub.tempo(t,six);dub.open(t,dubRise(run.plan,bar),t+16*six,dubRise(run.plan,bar+1));if(bar===run.plan.bars-1)dub.cut(t+16*six);}
  for(const e of stageEvents(run.plan,k,chord,{tiers:run.tiers,notes:run.notes,steps:run.steps,scale,tr:MU.tr||0})){if(dub)dub.hit(e,at,six);else runtime.songHit?.(e.soft?run.soft:run.out,e,at,six);if(e.layer){run.last[e.layer]=at;run.hits.push({layer:e.layer,t:at});if(run.hits.length>256)run.hits.shift();}}}
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
