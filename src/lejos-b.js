// Lejos, tanda B (Jay, 4 Nov 2026, alpha.249; docs/MUNDO.md#lejos-del-origen-tanda-b): five things from 10 to 30 km
// from the origin, in the free World after the Journey (never in a chapter, a round, a finale, an activity or the
// Refugio), except the fusion of sounds, which lives in the Refugio. The rules are in lejos-b-model.js.
// · Región apagada: grey and still, its music low (runtime.musicDuck, the one line of audio.js Jay authorised in
//   alpha.246; audio.js is not touched here). Four embers; pass by each and pulse on time (without sound, passing is
//   enough). Revived: colour, creatures and the music back, for good, and on the Mapa del universo.
// · Hábitat: a nest and its elements (rock, water, light). Pass through them and they go to the nest; together they bring
//   a creature that lives there and knows you when you come back.
// · Canción del cielo: four stones hint a phrase on the bars. Four notes in order and on time change the local sky for a
//   minute, with the existing drawings of the universe's layers (aurora, comets, nebula).
// · Fusión de sonidos: from the first time at 20 km, the Refugio (Más › Fusión de sonidos) joins two sounds of the album
//   into a new one for the album, fixed by the pair, in the harmony that sounds.
// · Postal de buscar: a dense patch of stars where a creature lost five things; finding them gives its postcard.
// One scene at a time: none of this answers while a living encounter, a figure, a mischief scene or a sky secret plays;
// while a postcard, a sky song or a grey region lasts, the encounters and the figures wait (lejosBBusy).
import {glow,radial,contactShadow} from './fx-kit.js';
import {drawAuroraSky} from './ambient-art.js';
import {audibleTime} from './journey-pulse.js';
import {openSurface,prefersReducedMotion} from './frame-state.js';
import {freeOpen} from './journey-mode.js';
import {creditSparks} from './sparks-model.js';
import {newRegionOf} from './universe-regions.js';
import {LIVE_COLORS} from './live-encounters-model.js';
import {SOUND_TRIM,SOUNDS,soundById,albumHas,edgeSpot,worldKey} from './descubrir-model.js';
import {playSoundMotif} from './descubrir.js';
import {scaleNote} from './secretos-model.js';
import {STYLES,rand} from './universe-layers.js';
import {LEJOS_B_VERSION,SITE_CELL,EDGE_REACH,kmOf,siteCell,sitesAround,DEAD_R,DEAD_DUCK,DEAD_TAU,embersOf,emberLit,reviveReward,ELEMENT_NAMES,NEST_R,ELEMENT_TOUCH,HAB_NEAR,HAB_LEAVE,recipeOf,elementsOf,habitatReward,
 SKY_EFFECT_NAMES,STONE_R,SONG_HINT,SONG_GAP,SONG_SECONDS,SONG_LOCAL,phraseOf,effectOf,stonesOf,songStep,songReward,POSTAL_R,POSTAL_LEAVE,LOST_TOUCH,LOST_LIGHT,postalCreatureOf,lostOf,postalStars,LOST_THINGS,
 fusionId,fusedSound,LEJOS_INSTRUMENT,LEJOS_GLASS,LEJOS_GAIN,LEJOS_HINT_GAIN,LEJOS_HUM_GAIN,REVIVE_DEGREES,HABITAT_CALL,POSTAL_DONE,normalizeLejosB,lightEmber,revived,placeElement,habitatDone,greet,singSong,findLost,postalDone,
 openFusion,fusionOpen,makeFusion,fusedIn,lejosPages,LEJOS_PAGES} from './lejos-b-model.js';
export {BAND_ITEMS} from './lejos-b-model.js';
const TAU=Math.PI*2;
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Notes of the place's scale from a time on the grid (one every `spacing` sixteenths), in an instrument of the album of
// sounds at its measured trim, far under the music. Returns how many were sent.
export function playLejosNotes(r,kind,degrees,start,{instrument=LEJOS_INSTRUMENT,gain=LEJOS_GAIN,spacing=2,octave=1}={}){if(!r.S?.sound||r.ac?.state!=='running')return 0;
 const d=r.regionOfPos?.(r.S.wx,r.S.wy),scale=r.MU?.dnaA?.scale||d?.scale,tonic=57+(r.MU?.tr||0)+12*octave,step=(r.SIX||.125)*spacing;let n=0;
 degrees.forEach((degree,k)=>{const note=scaleNote(scale,tonic,degree),at=start+k*step,emit=()=>{r.hookInst(instrument,note,at,r.vel(gain*(SOUND_TRIM[instrument]??1)),d);r.lejosAudioCue?.({kind,instrument,note,time:at,gain,six:r.SIX});};
  if(r.withVoiceOrigin)r.withVoiceOrigin('player',emit);else emit();n++;});return n;}
// The grey region's music: the whole output lower, evenly, through runtime.musicDuck (audio.js's musicVolume multiplies
// by it), eased; off, back to 1 (only if the duck is still this one: a rest satellite keeps its own).
export function deadDuck(r,on,time=r.ac?.currentTime||0){if(on)r.musicDuck=DEAD_DUCK;else if(r.musicDuck===DEAD_DUCK)r.musicDuck=1;else return false;const m=r.master;if(m?.gain&&r.musicVolume)m.gain.setTargetAtTime(r.musicVolume(),time,DEAD_TAU);return true;}
export function initialize(r){
 const $=id=>r.$?.(id)||globalThis.document?.getElementById(id)||null;
 let owner=null,world='',clock=0,seen=new WeakSet(),cells=new Map(),glows=[],flights=[],summary=null,drawn={},notes=0,lastBar=-1,ducked=false,reviving=null,song={site:null,next:0,at:0},hint=null,effect=null,postal=null,lights=new Map(),away=new Map(),greeting=null,houseKey='',told=new Set(),memo=new Map();
 const reduced=()=>!!(r.S?.reducedMotion||prefersReducedMotion());
 const allowed=()=>!!r.S&&r.inWorld?.()&&(r.S.layer||'superficie')==='superficie'&&freeOpen(r.S.journey)&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!r.houseActive?.()&&!r.travelInLevel?.()&&!r.placeRun?.()&&!r.placeCardDue?.()&&!r.songStageState?.()?.running&&!r.journeyFinaleState?.()?.running;
 const paused=()=>globalThis.document?.hidden||!!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 // Another scene plays (a living encounter, a figure, a mischief scene that moves on, a meteor shower or an eclipse, a
 // scene of another batch of the bands: a challenge of tanda A).
 const scene=()=>!!r.liveEncounterActive?.()||!!r.skyMapActive?.()||!!(r.mischiefBusy?r.mischiefBusy():r.mischiefState?.scene)||!!r.skySecretBusy?.()||!!r.bandBusy?.('B');
 const words=()=>r.S.universeTexts!==false;
 function book(){if(owner!==r.S){owner=r.S;owner.lejosB=normalizeLejosB(owner.lejosB);glows=[];flights=[];summary=null;reviving=null;song={site:null,next:0,at:0};effect=null;postal=null;away=new Map();greeting=null;houseKey='';}
  const w=worldKey(r.worldIdentity);if(w!==world){world=w;cells=new Map();}return owner.lejosB;}
 const ok=()=>book().version===LEJOS_B_VERSION&&!book().readOnly;
 const me=()=>({x:r.S.wx,y:r.S.wy});
 const today=()=>r.S.todayKey||'';
 const soon=fn=>{const state=r.S;if(state.sound&&r.ac?.state==='running'&&r.beatSoon)r.beatSoon(time=>{if(state===r.S)fn(time);},null,'player');};
 const sing=(kind,degrees,opts)=>soon(time=>{notes+=playLejosNotes(r,kind,degrees,time,opts);});
 const under=(x,y)=>{const d=r.regionOfPos?.(x,y);return d?.sea?'vacio':r.BIOMES?.[d?.z]?.id||'vacio';};
 const colorOf=biome=>r.placeColor?.(biome,LIVE_COLORS[biome])||LIVE_COLORS[biome]||'#ffffff';
 function cell(w,i,j){const k=i+','+j;if(!cells.has(k)){cells.set(k,siteCell(w,i,j));while(cells.size>400)cells.delete(cells.keys().next().value);}return cells.get(k);}
 const near=(p,radius)=>sitesAround(world,p,radius,cell);
 // The fixed points of a site (embers, elements, stones, lost things, stars), computed once.
 const fixed=(tag,site,fn)=>{const k=tag+':'+site.id;if(!memo.has(k)){memo.set(k,fn(site));while(memo.size>240)memo.delete(memo.keys().next().value);}return memo.get(k);};
 const embersAt=s=>fixed('e',s,embersOf),elementsAt=s=>fixed('l',s,elementsOf),stonesAt=s=>fixed('s',s,stonesOf),lostAt=s=>fixed('p',s,lostOf),starsAt=s=>fixed('t',s,postalStars);
 // A change kept or nothing: a failed save puts this save, the album and the sparks back as they were.
 function commit(change){const S=r.S,before={q:structuredClone(book()),album:S.soundAlbum?structuredClone(S.soundAlbum):undefined,sparks:S.sparks,economy:S.sparkEconomy?structuredClone(S.sparkEconomy):undefined};const out=change(book());if(!out)return null;
  if(r.save?.()===false){S.lejosB=before.q;if(before.album!==undefined)S.soundAlbum=before.album;S.sparks=before.sparks;if(before.economy!==undefined)S.sparkEconomy=before.economy;owner=null;book();return null;}if(!$('mJournal')?.hidden)r.refreshJournal?.();return out;}
 // Sparks by the universe's rule, inside the same change (so a failed save takes them back too).
 function pay(q,amount,title){const economy=r.S.sparkEconomy;if(!amount||!economy||economy.version!==1)return 0;const n=creditSparks(r.S,amount);q.earned+=n;economy.log.push({title,text:`${title} · +${n} chispas`,at:today()});economy.log=economy.log.slice(-80);return n;}
 const newPage=(id,had,name)=>{if(!had&&lejosPages(book()).includes(id)&&words())r.toast?.(`<em>${escape(name)}</em> · En la Bitácora`,{level:2,category:'ganado'});};
 const pagesNow=()=>lejosPages(book());
 // ---------- región apagada ----------
 function stepDead(site,p,pulses){const q=book(),e=q.dead[site.id];if(e?.done)return;const lit=new Set(e?.lit||[]);
  for(const em of embersAt(site)){if(lit.has(em.k))continue;const got=emberLit(em,p,pulses,!!r.S.sound);if(!got)continue;
   const had=pagesNow().includes('apagada');let amount=0;
   const res=commit(q=>{const out=lightEmber(q,site,em.k,{day:today(),biome:under(site.x,site.y)});if(!out)return null;const e=q.dead[site.id];if(got.onTime)e.onTime=(e.onTime|0)+1;
    if(out.revived)amount=pay(q,reviveReward(site.x,site.y,!!r.S.sound&&e.onTime>=4),'Región revivida');return out;});
   if(!res)continue;glows.push({x:em.x,y:em.y,at:clock,color:colorOf(under(site.x,site.y))});
   if(res.revived){reviving={id:site.id,until:clock+2.5};deadDuck(r,false);ducked=false;sing('revivir',REVIVE_DEGREES,{spacing:2});if(amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});
    summary={text:`Región revivida${amount?' · +'+amount+' ✦':''}`,until:clock+3.4};if(words())r.toast?.('<em>Región revivida</em> · Queda en el Mapa del universo',{level:2,category:'ganado'});newPage('apagada',had,'Regiones revividas');}
   else{sing('brasa',[res.lit*2-2],{spacing:1});summary={text:`Brasa · ${res.lit} de 4`,until:clock+2.4};}}}
 // ---------- hábitat ----------
 function stepHabitat(site,p){const q=book(),h=q.habitats[site.id];
  if(!h?.done){const placed=new Set(h?.placed||[]);for(const el of elementsAt(site)){if(placed.has(el.el)||Math.hypot(el.x-p.x,el.y-p.y)>ELEMENT_TOUCH)continue;const had=pagesNow().includes('habitat');let amount=0;
    const res=commit(q=>{const out=placeElement(q,site,el.el,today());if(out?.done)amount=pay(q,habitatReward(site.x,site.y,out.three),'Hábitat');return out;});if(!res)continue;
    flights.push({from:{x:el.x,y:el.y},to:{x:site.x,y:site.y},el:el.el,at:clock});sing('elemento',[res.placed*2],{spacing:1});
    if(res.done){away.set(site.id,false);greeting={id:site.id,until:clock+3.2};sing('habitat',[0,4,7],{spacing:2,instrument:LEJOS_GLASS});if(amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});
     summary={text:`${res.creature} · vive aquí${amount?' · +'+amount+' ✦':''}`,until:clock+3.6};if(words())r.toast?.(`<em>Hábitat</em> · ${escape(res.creature)} vive aquí`,{level:2,category:'ganado'});newPage('habitat',had,'Hábitats');}
    else summary={text:`${ELEMENT_NAMES[el.el]} · ${res.placed} de ${res.total}`,until:clock+2.4};}return;}
  // It knows you when you come back: a visit, its call and it comes to the cube for a moment.
  const d=Math.hypot(site.x-p.x,site.y-p.y);if(d>HAB_LEAVE){away.set(site.id,true);return;}
  if(d<=HAB_NEAR&&away.get(site.id)!==false){away.set(site.id,false);const res=commit(q=>greet(q,site.id,today()));if(!res)return;greeting={id:site.id,until:clock+3.2};sing('saludo',HABITAT_CALL,{spacing:2,instrument:LEJOS_GLASS});
   summary={text:`Te reconoce · ${res.creature} · ${res.visits} ${res.visits===1?'visita':'visitas'}`,until:clock+3.4};}}
 // ---------- canción del cielo ----------
 function stepSong(site,p,pulses){if(effect&&clock<effect.until)return;if(song.site!==site.id){song={site:site.id,next:0,at:clock};}
  if(song.next&&clock-song.at>SONG_GAP)song.next=0;const res=songStep(stonesAt(site),song.next,p,pulses,!!r.S.sound);if(!res)return;
  if(res==='wrong'){if(song.next)summary={text:'Otra vez desde la primera',until:clock+2};song.next=0;return;}
  const phrase=phraseOf(site);sing('piedra',[phrase[song.next]],{spacing:1});glows.push({...stonesAt(site)[song.next],at:clock});song.next++;song.at=clock;
  if(song.next<4){summary={text:`Canción del cielo · ${song.next} de 4`,until:clock+2.2};return;}
  song.next=0;const had=pagesNow().includes('cancion');let amount=0;const res2=commit(q=>{const out=singSong(q,site,today());if(out?.first)amount=pay(q,songReward(site.x,site.y,!!r.S.sound),'Canción del cielo');return out;});if(!res2)return;
  effect={id:site.id,x:site.x,y:site.y,kind:res2.effect,start:clock,until:clock+SONG_SECONDS};if(amount)r.showSparkPickup?.(amount,{x:r.S.wx,y:r.S.wy});
  summary={text:`${SKY_EFFECT_NAMES[res2.effect]} · un minuto${amount?' · +'+amount+' ✦':''}`,until:clock+3.6};if(words())r.toast?.(`<em>Canción del cielo</em> · ${SKY_EFFECT_NAMES[res2.effect]}`,{level:2,category:'ganado'});newPage('cancion',had,'Canción del cielo');}
 // ---------- postal de buscar ----------
 function stepPostal(site,p,pulses){const q=book();if(postalDone(q,site.id))return;
  if(!postal||postal.id!==site.id){postal={id:site.id,site,start:clock};if(!told.has(site.id)&&words()){told.add(site.id);r.toast?.(`${escape(postalCreatureOf(site))} perdió cinco cosas. Búscalas entre las estrellas.`,{level:2,ttl:4000});}}
  const lost=lostAt(site);for(const w of pulses)for(const t of lost)if(Math.hypot(t.x-w.x,t.y-w.y)<=LOST_LIGHT)lights.set(site.id+':'+t.k,clock);
  const found=new Set(q.postals[site.id]?.found||[]);for(const t of lost){if(found.has(t.k)||Math.hypot(t.x-p.x,t.y-p.y)>LOST_TOUCH)continue;const had=pagesNow().includes('postal');const res=commit(q=>findLost(q,site,t.k,today()));if(!res)continue;
   glows.push({x:t.x,y:t.y,at:clock});sing('perdido',[res.found+1],{spacing:1});summary={text:`${t.name} · ${res.found} de ${LOST_THINGS.length}`,until:clock+2.4};
   if(res.done){postal=null;sing('postal',POSTAL_DONE,{spacing:2});summary={text:`Postal · ${res.creature}`,until:clock+3.6};if(words())r.toast?.(`<em>Postal</em> · ${escape(res.creature)} · Gracias por encontrar mis cosas.`,{level:2,category:'ganado'});newPage('postal',had,'Postales');break;}}}
 // ---------- the frame ----------
 function tick(dt,modal=false){
  if(!r.S)return;book();syncHouse();
  if(!allowed()){if(ducked){ducked=false;deadDuck(r,false);}postal=null;summary=null;return;}
  if(modal||paused())return;const step=Math.max(0,Math.min(.05,dt||0));clock+=step;
  if(summary&&clock>summary.until)summary=null;glows=glows.filter(g=>clock-g.at<1.4);flights=flights.filter(f=>clock-f.at<1);if(reviving&&clock>reviving.until)reviving=null;if(greeting&&clock>greeting.until)greeting=null;if(effect&&clock>=effect.until)effect=null;
  const p=me(),pulses=[];for(const w of r.waves||[])if(!seen.has(w)){seen.add(w);if(w.origin==='player')pulses.push({x:w.x,y:w.y,beat:!!w.beat});}
  if(!ok()){if(ducked){ducked=false;deadDuck(r,false);}return;}
  // The fusion opens the first time you reach 20 km. T0 (bug 15): its band notice tells it («La fusión de sonidos te espera
  // en el Refugio.»); no second toast.
  const q=book();if(!fusionOpen(q)&&kmOf(p)>=20){const res=commit(q=>openFusion(q,kmOf(p),today()));if(res)syncHouse(true);}
  const list=near(p,HAB_LEAVE+400),other=scene();
  const dead=list.find(s=>s.kind==='apagada'&&s.d<=DEAD_R&&!revived(q,s.id));
  if(dead&&!other)stepDead(dead,p,pulses);
  const wantDuck=!!dead&&!revived(book(),dead.id)&&!!r.S.sound&&r.ac?.state==='running';if(wantDuck!==ducked){ducked=wantDuck;deadDuck(r,wantDuck);}
  for(const s of list){if(s.kind!=='habitat')continue;if(!other)stepHabitat(s,p);}
  for(const [id,v] of away)if(v===false&&!list.some(s=>s.id===id))away.set(id,true);
  const sg=list.find(s=>s.kind==='cancion'&&s.d<=STONE_R*2.4);if(sg&&!other)stepSong(sg,p,pulses);else if(!sg)song.next=0;
  const ps=list.find(s=>s.kind==='postal'&&s.d<=POSTAL_R&&!postalDone(q,s.id));if(ps&&!other)stepPostal(ps,p,pulses);
  if(postal&&(other||Math.hypot(postal.site.x-p.x,postal.site.y-p.y)>POSTAL_LEAVE||postalDone(book(),postal.id)))postal=null;
 }
 // On the music's own bars: the stones hint their phrase every two bars (quarter notes, very soft); a revived region hums.
 function onBar(t,bar){if(!r.S?.sound||r.ac?.state!=='running'||!allowed()||paused()||scene()||!ok())return;const p=me(),list=near(p,SONG_HINT+SITE_CELL/4);
  const sg=list.find(s=>s.kind==='cancion'&&s.d<=SONG_HINT);if(sg&&!(effect&&clock<effect.until)&&bar%2===0){notes+=playLejosNotes(r,'pista',phraseOf(sg),t,{instrument:LEJOS_GLASS,gain:LEJOS_HINT_GAIN,spacing:4});hint={id:sg.id,t};}
  const rv=list.find(s=>s.kind==='apagada'&&s.d<=DEAD_R&&revived(book(),s.id));if(rv&&bar%4===0)notes+=playLejosNotes(r,'zumbido',[0],t,{gain:LEJOS_HUM_GAIN,octave:0});}
 setInterval(()=>{try{const sq=r.MU?.sq,ac=r.ac;if(!ac||!sq?.length)return;for(const e of sq){if(e.s!==0||!(e.t>lastBar+1e-4))continue;lastBar=e.t;if(e.t>=ac.currentTime-.01)onBar(e.t,e.tick>>4);}}catch(_){}},50);
 // ---------- drawing ----------
 const at=(x,y)=>({x:x+r.W/2-r.camX,y:y+r.H/2-r.camY});
 const onScreen=(q,m=30)=>q.x>-m&&q.y>-m&&q.x<r.W+m&&q.y<r.H+m;
 const say=(c,t,x,y)=>{const w=c.measureText(t).width;c.fillText(t,Math.max(8+w/2,Math.min(r.W-8-w/2,x)),y);};
 const pulse=k=>reduced()?.8:.6+.4*Math.sin(clock*3+k);
 // Visual 2 (alpha.254; docs/MUNDO.md, «Luz común»): embers, elements, stones and lost things carry a small added light
 // (none in light quality); what you complete pops in the shared layer.
 const light=()=>!!r.lightQuality?.();
 function grey(c,q){c.save();c.beginPath();c.arc(q.x,q.y,DEAD_R,0,TAU);c.clip();c.globalCompositeOperation='saturation';c.globalAlpha=1;c.fillStyle='#808080';c.fillRect(q.x-DEAD_R,q.y-DEAD_R,DEAD_R*2,DEAD_R*2);
  c.globalCompositeOperation='source-over';c.fillStyle='rgba(0,0,0,.22)';c.fillRect(q.x-DEAD_R,q.y-DEAD_R,DEAD_R*2,DEAD_R*2);c.restore();
  c.globalAlpha=.35;c.strokeStyle='#8a8a8f';c.lineWidth=1;c.setLineDash([3,5]);c.beginPath();c.arc(q.x,q.y,DEAD_R,0,TAU);c.stroke();c.setLineDash([]);}
 function drawDead(c,site,q,out){const b=book(),e=b.dead[site.id],done=!!e?.done,col=colorOf(e?.b||under(site.x,site.y));
  if(!done){grey(c,q);const lit=new Set(e?.lit||[]);for(const em of embersAt(site)){const s=at(em.x,em.y);if(!onScreen(s))continue;const on=lit.has(em.k);if(!light())glow(c,s.x,s.y,on?18:11,on?col:'#ffe0b0',on?.5:.2*pulse(em.k),true);
    c.globalAlpha=on?1:.55*pulse(em.k);c.fillStyle=on?col:'#9a9aa0';c.beginPath();c.arc(s.x,s.y,on?4:3,0,TAU);c.fill();c.globalAlpha=on?.6:.4;c.strokeStyle=on?col:'#ffffff';c.lineWidth=1;c.beginPath();c.arc(s.x,s.y,on?9:7+(reduced()?0:Math.sin(clock*2+em.k)),0,TAU);c.stroke();}
   out.dead={id:site.id,lit:lit.size,x:Math.round(q.x),y:Math.round(q.y),grey:true};return;}
  // Revived: its colour in a soft ring and a few small fish of light going round.
  const fade=reviving&&reviving.id===site.id?Math.min(1,1-(reviving.until-clock)/2.5):1;c.globalAlpha=.1*fade;c.fillStyle=col;c.beginPath();c.arc(q.x,q.y,DEAD_R,0,TAU);c.fill();c.globalAlpha=.35*fade;c.strokeStyle=col;c.lineWidth=1;c.beginPath();c.arc(q.x,q.y,DEAD_R,0,TAU);c.stroke();
  for(let k=0;k<6;k++){const a=(reduced()?0:clock*.25)+k*TAU/6+rand(site.id+':pez'+k),rr=DEAD_R*(.35+.45*rand(site.id+':pr'+k)),x=q.x+Math.cos(a)*rr,y=q.y+Math.sin(a)*rr;if(!onScreen({x,y}))continue;c.globalAlpha=.85*fade;c.fillStyle=col;c.fillRect(Math.round(x)-1.5,Math.round(y)-1.5,3,3);
   c.globalAlpha=.35*fade;c.strokeStyle=col;c.beginPath();c.moveTo(x,y);c.lineTo(x-Math.cos(a+Math.PI/2)*8,y-Math.sin(a+Math.PI/2)*8);c.stroke();}
  out.dead={id:site.id,x:Math.round(q.x),y:Math.round(q.y),grey:false};}
 function element(c,el,x,y,a=1){if(!light())glow(c,x,y,11,el==='agua'?'#8fd0ff':el==='roca'?'#c8c8d0':'#ffffff',.22*a,true);c.globalAlpha=a;if(el==='roca'){c.fillStyle='#8a8a8f';c.beginPath();c.moveTo(x-4,y+2);c.lineTo(x-2,y-3);c.lineTo(x+3,y-3);c.lineTo(x+4,y+2);c.lineTo(x,y+4);c.closePath();c.fill();}
  else if(el==='agua'){c.fillStyle='#8fd0ff';c.beginPath();c.moveTo(x,y-5);c.quadraticCurveTo(x+4,y+1,x,y+4);c.quadraticCurveTo(x-4,y+1,x,y-5);c.fill();}
  else{c.fillStyle='#ffffff';c.fillRect(Math.round(x)-1,Math.round(y)-4,2,8);c.fillRect(Math.round(x)-4,Math.round(y)-1,8,2);c.globalAlpha=a*.3;c.beginPath();c.arc(x,y,7,0,TAU);c.fill();}}
 function creature(c,name,x,y,t){c.globalAlpha=.95;c.strokeStyle='#ffffff';c.fillStyle='#ffffff';c.lineWidth=1.2;const bob=reduced()?0:Math.sin(t*3)*1.5;y+=bob;
  if(name==='Tortuga de cometa'){c.beginPath();c.arc(x,y,6,Math.PI,0);c.closePath();c.stroke();for(const dx of [-5,5])c.fillRect(x+dx-1,y,2,3);c.fillStyle='#8fd0ff';c.fillRect(x+7,y-2,2,2);}
  else if(name==='Luciérnaga de piedra'){c.fillStyle='#8a8a8f';c.beginPath();c.arc(x,y,3.5,0,TAU);c.fill();c.globalAlpha=reduced()?.7:.4+.5*Math.abs(Math.sin(t*2));c.fillStyle='#fff7c0';c.beginPath();c.arc(x+3,y+3,3,0,TAU);c.fill();}
  else if(name==='Medusa de luz'){c.beginPath();c.arc(x,y,6,Math.PI,0);c.closePath();c.stroke();c.globalAlpha=.6;for(const dx of [-4,0,4]){c.beginPath();c.moveTo(x+dx,y);c.lineTo(x+dx+(reduced()?0:Math.sin(t*4+dx)*1.5),y+8);c.stroke();}}
  else if(name==='Ballena de bolsillo'){c.beginPath();c.ellipse(x,y,8,4,0,0,TAU);c.stroke();c.beginPath();c.moveTo(x-8,y);c.lineTo(x-12,y-3);c.lineTo(x-12,y+3);c.closePath();c.stroke();c.fillRect(x+4,y-1,1.5,1.5);}
  else if(name==='Tortuga lunar'){c.beginPath();c.arc(x,y,6,Math.PI,0);c.closePath();c.stroke();for(const dx of [-5,5])c.fillRect(x+dx-1,y,2,3);c.beginPath();c.arc(x+8,y-3,2,0,TAU);c.stroke();}
  else if(name==='Pulpo de nebulosa'){c.beginPath();c.arc(x,y-1,5,Math.PI,0);c.closePath();c.stroke();c.globalAlpha=.6;for(const dx of [-4,-1.5,1.5,4]){c.beginPath();c.moveTo(x+dx,y-1);c.quadraticCurveTo(x+dx*1.6,y+4,x+dx+(reduced()?0:Math.sin(t*3+dx)*1.5),y+8);c.stroke();}}
  else if(name==='Polilla de cometa'){c.beginPath();c.moveTo(x,y);c.lineTo(x-7,y-5);c.lineTo(x-6,y+4);c.closePath();c.moveTo(x,y);c.lineTo(x+7,y-5);c.lineTo(x+6,y+4);c.closePath();c.stroke();c.fillRect(x-1,y-3,2,7);}
  else if(name==='Búho de estrellas'){c.beginPath();c.arc(x,y,6,0,TAU);c.stroke();c.fillRect(x-3,y-2,2,2);c.fillRect(x+1,y-2,2,2);c.beginPath();c.moveTo(x-5,y-5);c.lineTo(x-3,y-8);c.moveTo(x+5,y-5);c.lineTo(x+3,y-8);c.stroke();}
  else if(name==='Pez de luz'){c.beginPath();c.ellipse(x,y,6,3.5,0,0,TAU);c.stroke();c.beginPath();c.moveTo(x-6,y);c.lineTo(x-10,y-3);c.lineTo(x-10,y+3);c.closePath();c.stroke();c.fillRect(x+3,y-1,1.5,1.5);}
  else{c.beginPath();c.arc(x,y,5,0,TAU);c.stroke();c.fillRect(x-1,y-1,2,2);}}
 function drawHabitat(c,site,q,out,t){const h=book().habitats[site.id],recipe=recipeOf(site),placed=new Set(h?.placed||[]);
  c.globalAlpha=.5;c.strokeStyle='#ffffff';c.lineWidth=1;c.setLineDash([2,3]);c.beginPath();c.arc(q.x,q.y,18,0,TAU);c.stroke();c.setLineDash([]);
  recipe.forEach((el,k)=>{const a=-Math.PI/2+k*TAU/recipe.length,x=q.x+Math.cos(a)*28,y=q.y+Math.sin(a)*28;if(placed.has(el))element(c,el,x,y,.95);else{c.globalAlpha=.35;c.strokeStyle='#ffffff';c.strokeRect(x-4,y-4,8,8);}});
  if(h?.done){const g=greeting&&greeting.id===site.id,p=me(),s=g?at((site.x*2+p.x)/3,(site.y*2+p.y)/3):{x:q.x+Math.cos(t*.6)*NEST_R*.4,y:q.y+Math.sin(t*.6)*NEST_R*.25};creature(c,h.c,s.x,s.y,t);out.habitat={id:site.id,creature:h.c,x:Math.round(s.x),y:Math.round(s.y),greet:!!g};return;}
  for(const el of elementsAt(site)){if(placed.has(el.el))continue;const s=at(el.x,el.y);if(onScreen(s))element(c,el.el,s.x,s.y,.6+.35*pulse(el.k));}
  out.habitat={id:site.id,x:Math.round(q.x),y:Math.round(q.y),placed:placed.size,total:recipe.length};}
 function drawSong(c,site,q,out){const stones=stonesAt(site),now=r.ac?audibleTime(r.ac):0,beat=(r.SIX||.125)*4;let lit=-1;
  if(r.S.sound&&hint&&hint.id===site.id){const k=Math.floor((now-hint.t)/beat);if(k>=0&&k<4)lit=k;}else if(!r.S.sound){const k=Math.floor((clock%5)/.5);if(k<4)lit=k;}
  for(const s of stones){const p=at(s.x,s.y),done=song.site===site.id&&s.k<song.next,next=song.site===site.id?song.next===s.k:s.k===0;if((done||lit===s.k)&&!light())glow(c,p.x,p.y,16,'#ffffff',lit===s.k?.45:.2,true);contactShadow(c,p.x,p.y+6,7,2,.4);c.globalAlpha=done||lit===s.k?1:.5;c.fillStyle=done?'#ffffff':lit===s.k?'#ffffff':'#55555c';c.fillRect(p.x-4,p.y-4,8,8);
   c.globalAlpha=.6;c.strokeStyle='#ffffff';c.lineWidth=1;c.strokeRect(p.x-4.5,p.y-4.5,9,9);if(next&&!(effect&&effect.id===site.id)){c.globalAlpha=.45*pulse(s.k);c.beginPath();c.arc(p.x,p.y,11,0,TAU);c.stroke();}}
  out.song={id:site.id,x:Math.round(q.x),y:Math.round(q.y),next:song.site===site.id?song.next:0,lit};}
 // The sky changed: the universe's own layer drawings (universe-layers.js) over the screen, in cells of the World.
 function drawEffect(c,p,t){if(!effect)return null;const d=Math.hypot(effect.x-p.x,effect.y-p.y),k=Math.max(0,Math.min(1,(clock-effect.start)/2,(effect.until-clock)/2))*Math.max(0,1-d/SONG_LOCAL);if(k<=0)return null;
  const size=120,f={ink:effect.kind==='aurora'?'#7dffc8':effect.kind==='nebulosa'?'#ff7ad9':'#ffffff',accent:effect.kind==='aurora'?'#ff7ad9':'#8fd0ff',beat:r.beat?.()||0,t:performance.now(),still:reduced(),cubeX:r.W/2,cubeY:r.H/2,part:()=>[0,0],done:false,beatIndex:0};
  const style=effect.kind==='aurora'?STYLES.aurora:effect.kind==='nebulosa'?STYLES.nebulosa:STYLES.cometas,ox=r.camX-r.W/2,oy=r.camY-r.H/2;c.save();c.globalAlpha=k;
  // The nebula's two clouds from sprites (they were two screen-sized gradients per frame).
  if(effect.kind==='nebulosa'){for(const [dx,dy,col] of [[-.2,-.25,'rgba(255,122,217,.10)'],[.25,.1,'rgba(143,208,255,.08)']])radial(c,r.W*(.5+dx),r.H*(.5+dy),Math.max(r.W,r.H)*.5,'nebula:'+col,[[0,col],[1,'rgba(0,0,0,0)']]);}
  // Visual 3 (alpha.255): the band from the baked aurora strip (ambient-art.js); light quality keeps the three lines.
  if(effect.kind==='aurora'&&!drawAuroraSky(c,r.W,f.t,150,k*.18,{still:reduced(),light:!!r.lightQuality?.()})){c.lineWidth=6;for(let i=0;i<3;i++){c.strokeStyle=`hsl(${(150+i*35)%360},80%,65%)`;c.globalAlpha=k*.18;c.beginPath();for(let x=0;x<=r.W;x+=10){const y=70+i*20+Math.sin(x/130+f.t/1500+i)*16;x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}c.globalAlpha=k;c.lineWidth=1;}
  for(let i=Math.floor(ox/size);i*size<ox+r.W;i++)for(let j=Math.floor(oy/size);j*size<oy+r.H;j++){const key='lejos-cielo:'+i+','+j;f.ux=i*size;f.uy=j*size;try{style.mid.draw(c,i*size-ox,j*size-oy,size,key,f);if(effect.kind==='estrellas')style.far.draw(c,i*size-ox,j*size-oy,size,key,f);}catch(_){}}
  c.restore();return {kind:effect.kind,alpha:Math.round(k*100)/100};}
 function lostThing(c,name,x,y,a){c.globalAlpha=a;c.strokeStyle='#ffffff';c.fillStyle='#ffffff';c.lineWidth=1;
  if(name==='Campanita'){c.beginPath();c.arc(x,y,3.5,Math.PI,0);c.lineTo(x+4.5,y+2);c.lineTo(x-4.5,y+2);c.closePath();c.stroke();c.fillRect(x-.75,y+2,1.5,1.5);}
  else if(name==='Semilla'){c.beginPath();c.ellipse(x,y,2,3.5,.5,0,TAU);c.fill();}
  else if(name==='Pluma'){c.beginPath();c.moveTo(x-4,y+4);c.lineTo(x+4,y-4);for(let k=-2;k<=2;k++){c.moveTo(x+k*1.5,y-k*1.5);c.lineTo(x+k*1.5+2,y-k*1.5+1);}c.stroke();}
  else if(name==='Farolito'){c.strokeRect(x-2.5,y-3,5,6);c.fillRect(x-1,y-1,2,2);c.globalAlpha=a*.3;c.beginPath();c.arc(x,y,6,0,TAU);c.fill();}
  else{c.beginPath();c.arc(x,y+2,4,Math.PI,0);c.stroke();for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(x,y+2);c.lineTo(x+k*3,y-1.5);c.stroke();}}}
 function drawPostal(c,site,q,out,t){const b=book(),found=new Set(b.postals[site.id]?.found||[]),done=postalDone(b,site.id),who=postalCreatureOf(site);
  // A dense patch of stars and a few faint lines between them.
  const stars=starsAt(site);let prev=null;for(const [k,s] of stars.entries()){const p=at(s.x,s.y);if(!onScreen(p,4)){prev=null;continue;}c.globalAlpha=.18+.5*s.b;c.fillStyle='#ffffff';const sz=s.b>.85?2:1;c.fillRect(Math.round(p.x),Math.round(p.y),sz,sz);
   if(k%11<3&&prev){c.globalAlpha=.1;c.strokeStyle='#ffffff';c.beginPath();c.moveTo(prev.x,prev.y);c.lineTo(p.x,p.y);c.stroke();}prev=p;}
  creature(c,who,q.x,q.y,t);
  let shown=0;for(const th of lostAt(site)){if(found.has(th.k)){lostThing(c,th.name,q.x-20+th.k*10,q.y+18,.9);continue;}if(done)continue;const p=at(th.x,th.y);if(!onScreen(p))continue;const lit=clock-(lights.get(site.id+':'+th.k)??-9)<1.5;if(lit&&!light())glow(c,p.x,p.y,14,'#ffffff',.4,true);lostThing(c,th.name,p.x,p.y,lit?1:.42);shown++;}
  out.postal={id:site.id,creature:who,found:found.size,done,x:Math.round(q.x),y:Math.round(q.y),shown};}
 // Coherencia T2: the band's one mark is an offer to the one layer of arrows (scanner-arrows.js); a «?» until the
 // scanner's level 4 names the things past 10 km.
 function edge(c,kind,o){const q=r.edgeOffer?.({key:'B:'+kind+':'+(o.id||Math.round(o.x)+','+Math.round(o.y)),kind:'banda',x:o.x,y:o.y,shape:'portal',far:true})||edgeSpot(r.W,r.H,o.x-r.camX,o.y-r.camY,22,104);return {x:Math.round(q.x),y:Math.round(q.y),id:o.id};}
 const pending=(q,s)=>s.kind==='apagada'?!revived(q,s.id):s.kind==='habitat'?!habitatDone(q,s.id):s.kind==='postal'?!postalDone(q,s.id):!(q.songs[s.id]?.n>0);
 function draw(){const out={edge:{},dead:null,habitat:null,song:null,postal:null,effect:null,busy:busy()};if(!allowed()||!r.cx){drawn=out;return;}
  const c=r.cx,p=me(),t=performance.now()/1000,q=book();c.save();
  if(ok()){const list=near(p,Math.max(EDGE_REACH,DEAD_R*2.2));
   for(const s of list){const sp=at(s.x,s.y);
    if(s.kind==='apagada'&&s.d<=DEAD_R+Math.hypot(r.W,r.H)/2)drawDead(c,s,sp,out);
    else if(s.kind==='habitat'&&s.d<=900)drawHabitat(c,s,sp,out,t);
    else if(s.kind==='cancion'&&s.d<=900)drawSong(c,s,sp,out);
    else if(s.kind==='postal'&&s.d<=POSTAL_R*2.4)drawPostal(c,s,sp,out,t);}
   for(const f of flights){const k=Math.min(1,(clock-f.at)/.8),s=at(f.from.x+(f.to.x-f.from.x)*k,f.from.y+(f.to.y-f.from.y)*k);element(c,f.el,s.x,s.y,1-k*.3);}
   out.effect=drawEffect(c,p,t);
   // One mark for the batch (coherencia T2): the nearest thing not done, out of view (quiet while a scene plays).
   if(!scene()&&!paused()&&!busy()){const view=s=>onScreen(at(s.x,s.y),-8);let best=null;for(const s of list){if(s.d>EDGE_REACH||!pending(q,s))continue;if(!best||s.d<best.d)best=s;}if(best&&!view(best))out.edge[best.kind]=edge(c,best.kind,best);}
   // Its words, short: what to do next, near it.
   if(words()&&!scene()){c.globalAlpha=1;c.fillStyle='#ffffff';c.textAlign='center';c.font='12px "Geist Mono", monospace';const top=Math.max(196,r.H/2-152);
    if(out.dead?.grey){say(c,'Región apagada',r.W/2,top);c.globalAlpha=.75;c.font='12px "Geist Mono", monospace';say(c,r.S.sound?'Pasa por sus brasas y pulsa a tiempo':'Pasa por sus brasas',r.W/2,top+18);}
    else if(postal){const n=out.postal?.found||0;say(c,`${postalCreatureOf(postal.site)} perdió cinco cosas · ${n} de 5`,r.W/2,top);c.globalAlpha=.75;c.font='12px "Geist Mono", monospace';say(c,r.S.sound?'Pasa por ellas. Un pulso las ilumina.':'Pasa por ellas',r.W/2,top+18);}
    else if(out.song&&!effect&&list.some(s=>s.id===out.song.id&&s.d<=SONG_HINT/2)){say(c,'Cuatro piedras',r.W/2,top);c.globalAlpha=.75;c.font='12px "Geist Mono", monospace';say(c,r.S.sound?'Tócalas en orden, a tiempo':'Pásalas en orden',r.W/2,top+18);}
    else if(out.habitat&&out.habitat.total&&list.some(s=>s.id===out.habitat.id&&s.d<=600)){say(c,'Un nido vacío',r.W/2,top);c.globalAlpha=.75;c.font='12px "Geist Mono", monospace';say(c,'Trae lo que falta. Pasa por ello.',r.W/2,top+18);}
    if(summary){c.globalAlpha=.92;c.font='12px "Geist Mono", monospace';c.fillText(summary.text,r.W/2,Math.min(r.H-150,r.H/2+150),r.W-32);}}
   for(const g of glows){const s=at(g.x,g.y),k=(clock-g.at)/1.4;if(!g.popped){g.popped=true;r.fxLayer?.pop(g.x,g.y,g.color||'#ffffff',{size:.8,sparks:6});}c.globalAlpha=.8*(1-k);c.strokeStyle=g.color||'#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(s.x,s.y,reduced()?14:6+k*30,0,TAU);c.stroke();}}
  c.restore();drawn=out;}
 // ---------- one scene at a time ----------
 // A postcard being searched, the sky changed near you, a grey region you are in, a region coming back to life.
 function busy(){if(!r.S||!allowed())return false;if(postal||reviving)return true;const p=me();if(effect&&Math.hypot(effect.x-p.x,effect.y-p.y)<SONG_LOCAL)return true;return ducked||(ok()&&near(p,DEAD_R).some(s=>s.kind==='apagada'&&!revived(book(),s.id)));}
 // ---------- the Refugio: Más › Fusión de sonidos ----------
 const box=$('mSoundFusion'),list=$('soundFusionList'),make=$('soundFusionMake'),note=$('soundFusionNote');let picked=[];
 // The button waits hidden under «Más» (index.html) until the first time at 20 km.
 function syncHouse(force=false){const b=$('houseFusion');if(!b)return;const open=ok()&&fusionOpen(book()),key=String(open);if(!force&&key===houseKey)return;houseKey=key;
  if(!b.onclick)b.onclick=()=>{const more=$('houseMore');if(more)more.open=false;openFusion_();};b.hidden=!open;}
 const album=()=>r.S.soundAlbum&&typeof r.S.soundAlbum==='object'?r.S.soundAlbum:null;
 function renderFusion(){if(!box||!list)return;const a=album(),mine=SOUNDS.filter(s=>albumHas(a,s.id)),fused=fusedIn(a);$('soundFusionCount').textContent=fused.length?`${fused.length} ${fused.length===1?'fusión':'fusiones'}`:'';
  list.innerHTML=`<div class="sound-chips">${mine.map(s=>`<button type="button" class="sound-chip" data-fuse-id="${s.id}" aria-pressed="${picked.includes(s.id)}">${escape(s.name)}</button>`).join('')||'<span class="sound-chip">?</span>'}</div>`+
   (fused.length?`<section class="sound-biome"><h3>Fusiones · ${fused.length}</h3><div class="sound-chips">${fused.map(f=>`<span class="sound-chip fused-chip" data-fused="${f.id}">${escape(f.name)}</span>`).join('')}</div></section>`:'');
  const id=picked.length===2?fusionId(picked[0],picked[1]):null,s=id&&fusedSound(id),has=!!s&&!!a?.sounds?.[id];if(make)make.disabled=!s||has||!ok();
  if(note)note.textContent=mine.length<2?'Necesitas dos sonidos en tu álbum.':!s?'Elige dos sonidos.':has?`Ya en tu álbum · ${s.name}`:`Nuevo · ${s.name}`;}
 function openFusion_(){if(!box||!ok()||!fusionOpen(book()))return false;picked=[];box.hidden=false;renderFusion();return true;}
 function fuse(a,b){const day=today();const res=commit(q=>makeFusion(q,r.S.soundAlbum,a,b,day));if(!res){if(note)note.textContent='No se guardó. Intenta otra vez.';return null;}
  if(r.S.sound&&r.ac?.state==='running'&&r.beatSoon)r.beatSoon(time=>playSoundMotif(r,res,time,me()),null,'player');picked=[];renderFusion();if(note)note.textContent=`${res.name} · en tu álbum`;return res;}
 if(box){list?.addEventListener('click',e=>{const b=e.target.closest?.('[data-fuse-id]');if(!b)return;const id=b.dataset.fuseId;const i=picked.indexOf(id);if(i>=0)picked.splice(i,1);else{picked.push(id);if(picked.length>2)picked.shift();}
   if(picked.includes(id)&&r.S.sound&&r.ac?.state==='running'&&r.beatSoon)r.beatSoon(time=>playSoundMotif(r,id,time,me()),null,'player');renderFusion();});
  make?.addEventListener('click',()=>{if(picked.length===2)fuse(picked[0],picked[1]);});$('soundFusionClose')?.addEventListener('click',()=>{box.hidden=true;});}
 const house=$('housePanel');if(house&&globalThis.MutationObserver)new MutationObserver(()=>syncHouse(true)).observe(house,{attributes:true,attributeFilter:['hidden']});
 // ---------- the Bitácora: what you found; nothing of the rest ----------
 function section(){if(!r.S)return '';const q=book(),pages=lejosPages(q);let html='';
  const mineW=id=>id.startsWith('lejos:'+world+':');
  if(pages.includes('apagada')){const n=Object.entries(q.dead).filter(([id,e])=>e.done&&mineW(id)).length;html+=`<p class="secret-row" data-lejos="apagada"><span class="secret-name">Regiones revividas</span> · ${n}</p>`;}
  if(pages.includes('habitat')){const done=Object.values(q.habitats).filter(h=>h.done);html+=`<p class="secret-row" data-lejos="habitat"><span class="secret-name">Hábitats</span> · ${done.length}</p>`;
   for(const h of done.slice(-6))html+=`<p class="rumor-now">${escape(h.c)} · ${h.visits?`${h.visits} ${h.visits===1?'visita':'visitas'}`:'vive allí'}</p>`;}
  if(pages.includes('cancion')){const n=Object.values(q.songs).reduce((a,s)=>a+(s.n||0),0),fx=Object.keys(SKY_EFFECT_NAMES).filter(k=>q.effects[k]>0).map(k=>SKY_EFFECT_NAMES[k]);html+=`<p class="secret-row" data-lejos="cancion"><span class="secret-name">Canción del cielo</span> · ${n} ${n===1?'cantada':'cantadas'}</p>`;if(fx.length)html+=`<p class="rumor-now">${fx.map(escape).join(' · ')}</p>`;}
  if(pages.includes('fusion')){const n=fusedIn(album()).length;html+=`<p class="secret-row" data-lejos="fusion"><span class="secret-name">Fusión de sonidos</span> · ${n} ${n===1?'fusión':'fusiones'}</p><p class="rumor-now">En tu Refugio, en «Más»</p>`;}
  if(pages.includes('postal'))for(const c of Object.keys(q.cards))html+=`<div class="lejos-postal" data-postal="${escape(c)}"><p><span class="secret-name">Postal · ${escape(c)}</span></p><p>Gracias por encontrar mis cosas.</p></div>`;
  return `<details class="journal-section" data-journal-detail="Lejos del origen" id="journalLejosB"><summary>Lejos del origen · ${pages.length}</summary>${html||'<p>Más allá de 10 km hay cosas nuevas. Sigue.</p>'}</details>`;}
 // ---------- the map and tests ----------
 const forMap=()=>{if(!r.S)return [];book();const q=book(),out=[],mine=id=>id.startsWith('lejos:'+world+':');
  for(const [id,e] of Object.entries(q.dead))if(e.done&&mine(id))out.push({kind:'revived',id,x:e.x,y:e.y,name:'Región revivida',color:colorOf(e.b||'vacio')});
  for(const [id,h] of Object.entries(q.habitats))if(h.done&&mine(id))out.push({kind:'habitat',id,x:h.x,y:h.y,name:h.c});return out;};
 // The distance bands (bandas.js): this batch's scene (one scene at a time; tanda A's challenges wait for it) and its
 // line under each name in «Lo que hay más lejos». The map keeps its own points (lejosBForMap: rings, not rumors).
 const plural=(n,one,many)=>`${n} ${n===1?one:many}`,mineW=id=>id.startsWith('lejos:'+world+':');
 const lines={
  'region-apagada':()=>{const n=Object.entries(book().dead).filter(([id,e])=>e.done&&mineW(id)).length;return n?plural(n,'revivida','revividas'):'Cuatro brasas a tiempo la reviven.';},
  habitat:()=>{const n=Object.values(book().habitats).filter(h=>h.done).length;return n?plural(n,'criatura','criaturas'):'Junta sus elementos en el nido.';},
  'cancion-del-cielo':()=>{const n=Object.values(book().songs).reduce((a,s)=>a+(s.n||0),0);return n?plural(n,'cantada','cantadas'):'Cuatro notas en orden y a tiempo.';},
  'fusion-de-sonidos':()=>{const n=fusedIn(album()).length;return n?plural(n,'fusión','fusiones'):'En tu Refugio, en «Más»';},
  postal:()=>{const n=Object.keys(book().cards).length;return n?plural(n,'postal','postales'):'Cinco cosas perdidas entre estrellas.';},
 };
 for(const id of Object.keys(lines))r.bandAttach?.(id,{line:lines[id],...(id==='region-apagada'?{busy}:{})});
 Object.defineProperties(r,{
  lejosBTick:{get:()=>tick},drawLejosB:{get:()=>draw},lejosBSection:{get:()=>section},lejosBForMap:{get:()=>forMap},lejosBBusy:{get:()=>busy},
  fusedSound:{get:()=>fusedSound},fusedAlbum:{get:()=>()=>fusedIn(album())},openSoundFusion:{get:()=>openFusion_},
  // Tests only (the runtime is never published): fuse a pair, the state.
  lejosBFuse:{get:()=>fuse},
  lejosBState:{get:()=>()=>{const q=book();return {version:q.version,readOnly:!!q.readOnly,allowed:allowed(),world,book:structuredClone(q),pages:lejosPages(q),busy:busy(),ducked,musicDuck:r.musicDuck??1,song:{...song},effect:effect?{...effect}:null,postal:postal?{id:postal.id}:null,notes,drawn,summary:summary?.text||'',km:kmOf(me())};}}
 });
}
