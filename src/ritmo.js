// Ritmo (Jay, 29 Oct 2026, alpha.237; docs/MUNDO.md#ritmo; the rules in ritmo-model.js): Eco, the Duelo final, the
// ghost and the combo. Loaded by the ring (places-ring.js). It never pays sparks, never touches the music under the
// game (the duel sings its rhythms softly on top, with the voices the places already use to sing their phrase) and
// never changes a round's rules: an Eco round is an ordinary round with the steps not drawn after the phrase is sung.
// You can always leave (the menu's «Dejar la ronda», or walking away from the duel) and you lose nothing.
import {PLACES,PLACE_IDS,roundTime,roundPercent} from './places.js';
import {elevenNoteSeen} from './eleven-note.js';
import {audibleTime,cueDelay} from './journey-pulse.js';
import {freeOpen} from './journey-mode.js';
import {openSurface,calmMotion} from './frame-state.js';
import {RITMO_VERSION,normalizeRitmo,echoOffered,duelOpen,ghostRecorder,ghostSample,ghostAt,ghostAlpha,ghostBetter,ghostFrom,comboStep,trailLength,COMBO_AT,TRAIL_FADE,
 DUEL_REACH,DUEL_LEAVE,duelList,duelJudge,duelClose,duelShare,duelKeep} from './ritmo-model.js';
export function initialize(runtime){
 const $=id=>globalThis.document?.getElementById(id),doc=globalThis.document;
 const name=id=>PLACES.find(p=>p.id===id)?.name||id;
 const places=()=>runtime.placesData?.();
 const calm=()=>calmMotion(runtime.S);
 const sound=()=>!!runtime.S.sound;
 const rapid=()=>(runtime.rapidScale||1)<1;
 const modal=()=>openSurface('.modal:not([hidden])');
 let owner=null,state=null;
 function own(){if(owner!==runtime.S){owner=runtime.S;runtime.S.ritmo=normalizeRitmo(runtime.S.ritmo);state=runtime.S.ritmo;round=null;pendingEcho=null;finished=null;combo={streak:0};trail.length=0;fade=null;if(duel)duel=null;}return state;}
 const writable=()=>own().version===RITMO_VERSION;
 // Every write goes back as it was when the save fails.
 function commit(change){if(!writable())return false;const before=structuredClone(own());change(state);if(runtime.save?.()===false){runtime.S.ritmo=before;state=before;return false;}return true;}
 // ---------- a round: Eco and the ghost ----------
 let round=null,pendingEcho=null,finished=null;
 const roundsOf=id=>places()?.best?.[id]?.rounds||0;
 function track(){own();const run=runtime.placeRun?.(),S=runtime.S;
  if(run&&(!round||round.startedAt!==run.startedAt)){const plain=!run.free&&!run.maestro&&!run.remix;
   round={id:run.id,startedAt:run.startedAt,echo:pendingEcho===run.id&&plain,origin:{x:S.wx,y:S.wy},rec:plain?ghostRecorder():null,rounds:roundsOf(run.id),ghost:plain&&writable()?state.ghosts?.[run.id]||null:null};pendingEcho=null;}
  if(run&&round){if(round.rec)ghostSample(round.rec,Date.now()-run.startedAt,S.wx-round.origin.x,S.wy-round.origin.y);return;}
  if(!run&&round){const r=round;round=null;if(roundsOf(r.id)>r.rounds){const last=runtime.places?.()?.last;if(last&&last.id===r.id)done(r,last);}}}
 // A round closed (its ★ already kept by places.js): Eco's best, and the path when it is the best time.
 function done(r,last){const info={id:r.id,ms:last.ms,echo:r.echo,ghost:null};
  if(r.rec&&r.rec.pts.length>=2){const old=writable()?state.ghosts?.[r.id]||null:null,better=ghostBetter(old,last.ms),kept=better?ghostFrom(r.rec,last.ms):null;info.ghost={had:old?.ms??null,record:!!(better&&kept)};
   if(kept&&!commit(s=>{s.ghosts[r.id]=kept;}))info.ghost.record=false;}
  if(r.echo)commit(s=>{const e=s.echo[r.id]||{best:0,rounds:0};e.rounds++;if(last.sound)e.best=Math.max(e.best,last.onTime||0);s.echo[r.id]=e;});
  finished=info;}
 // Eco starts like any round, from the card (beside its portal) or from Lugares and the portal (to its portal).
 function startEcho(id,{from=null}={}){const d=places();if(!echoOffered(d,id,sound())||runtime.placeRun?.()||duel)return false;pendingEcho=id;let ok=false;
  if(from)ok=!!runtime.startPlace?.(id,{from});else{if(runtime.houseActive?.())runtime.exitHouse?.();if(runtime.S.mode==='camino'&&freeOpen(runtime.S.journey))runtime.enterWorld?.({automatic:true});ok=!!runtime.ringGo?.(id);}
  if(!ok){pendingEcho=null;return false;}track();return true;}
 const live=()=>{const run=runtime.placeRun?.();return run&&round&&round.startedAt===run.startedAt?round:null;};
 // The steps are not drawn once the place has sung its phrase; without sound (nothing to remember) they come back.
 const hideSignals=()=>{const r=live();return !!(r?.echo&&sound()&&!runtime.rhythmDemo?.());};
 // The card's words for this round: «Eco» and the ghost.
 function card(r){if(!finished||finished.id!==r?.id||finished.ms!==r.ms)return null;const rows=[];if(finished.echo)rows.push('De memoria, sin señales.');const g=finished.ghost;
  if(g)rows.push(g.had===null?'Tu fantasma correrá contigo la próxima vez.':g.record?`Le ganaste a tu fantasma · ${roundTime(g.had)}.`:`Tu fantasma · ${roundTime(g.had)}.`);return {echo:finished.echo,rows};}
 // ---------- the combo ----------
 let combo={streak:0},seen={hits:0,misses:0,at:null},fade=null;const trail=[];
 function comboTick(){const st=runtime.journeyPulseState?.();if(!st)return;const dh=Math.max(0,(st.hits|0)-seen.hits),dm=Math.max(0,(st.misses|0)-seen.misses);seen.hits=st.hits|0;seen.misses=st.misses|0;
  const playing=!!runtime.placeRun?.()||!!duel;if(!playing||runtime.rhythmDemo?.()){if(combo.streak>=COMBO_AT)fadeOut();combo={streak:0};return;}
  if(!dh&&!dm)return;const next=comboStep(combo,{hits:dh,misses:dm});if(next.broke)fadeOut();combo=next;}
 function fadeOut(){if(trail.length)fade={at:performance.now(),points:trail.splice(0)};}
 function trailTick(){const n=trailLength(combo.streak);if(!n){if(trail.length)fadeOut();return;}const S=runtime.S,last=trail[trail.length-1];if(!last||Math.hypot(last.x-S.wx,last.y-S.wy)>=3)trail.push({x:S.wx,y:S.wy});while(trail.length>n)trail.shift();}
 // ---------- the duel ----------
 let duel=null,lastMark=null;
 const noteSeen=()=>elevenNoteSeen(runtime.S.elevenNote);
 const open=()=>writable()&&duelOpen(places(),noteSeen());
 const ring=()=>runtime.ringState?.()||{};
 const center=()=>ring().center||null;
 const ringActive=()=>!!ring().active;
 const six=()=>runtime.SIX||.15;
 function start(){if(!open()||duel||runtime.placeRun?.()||!sound()||!ringActive())return false;const c=center();if(!c)return false;
  if(runtime.S.destination)runtime.cancelDestination?.();runtime.stopAutopilot?.();
  duel={list:duelList(rapid()),i:0,phase:null,score:{right:0,total:0,wrong:0,echoes:0},center:c,startedAt:Date.now(),glows:[],done:false};lastMark=runtime.journeyPulseState?.()?.lastMark?.at??null;runtime.enterFx=1;return true;}
 function quit(text){if(!duel)return false;duel=null;fadeOut();combo={streak:0};if(text)runtime.toast?.(text,{force:true});runtime.hud?.();return true;}
 // The music's sixteenths drive it (places-ring.js passes them on): a bar of call, sung; a bar of answer, heard.
 function musicStep(s,t){if(!duel||duel.done)return;const bar=six()*16,item=duel.list[duel.i];
  if(s===0){const p=duel.phase;if(p?.kind==='answer'){const r=duelClose(duel.score,p.pattern,p.steps,p.wrong);duel.score={right:r.right,total:r.total,wrong:r.wrong,echoes:r.echoes};duel.glows.push({at:performance.now()+cueDelay(runtime.ac,t),kind:r.echo?'echo':r.answered?'some':'none'});if(duel.glows.length>12)duel.glows.shift();
    duel.i++;if(duel.i>=duel.list.length){const d=duel;d.phase=null;d.done=true;setTimeout(()=>win(d),700);return;}duel.phase={kind:'call',start:t,end:t+bar,id:duel.list[duel.i].id,pattern:duel.list[duel.i].steps};}
   else if(p?.kind==='call')duel.phase={kind:'answer',start:t,end:t+bar,id:p.id,pattern:p.pattern,steps:[],wrong:0};
   else duel.phase={kind:'call',start:t,end:t+bar,id:item.id,pattern:item.steps};}
  const p=duel.phase;if(p?.kind==='call'&&t>=p.start-1e-3&&p.pattern.includes(s)&&sound()){
   // Like a place singing its phrase (journey-rhythm.js): a click and a soft note on each step it counts.
   runtime.hatHit?.(t,s===0?.14:.09);const ct=runtime.chordTones?.()||[60,64,67];let m=ct[0]+24+(s===0?0:7);while(m>88)m-=12;runtime.pluck?.(m,t,s===0?.07:.05,2);}}
 // A pulse heard at `heard` on the audio clock: inside the answer bar it answers the nearest eighth; in the call it
 // is early and does not count.
 function hear(heard){const p=duel?.phase;if(!p||p.kind!=='answer'||!(heard>=p.start-.1&&heard<=p.end+.1))return null;const v=duelJudge(p.pattern,(heard-p.start)/six(),six());if(!v)return null;
  if(v.ok){if(!p.steps.includes(v.step))p.steps.push(v.step);return 'answer';}p.wrong++;return 'wrong';}
 function pulseTick(){const m=runtime.journeyPulseState?.()?.lastMark;if(!m||m.at===lastMark)return;lastMark=m.at;if(!duel||m.dropped||!runtime.ac)return;hear(audibleTime(runtime.ac)-Math.max(0,performance.now()-m.at)/1000);}
 function win(d){if(!duel||duel!==d)return;const score=duel.score;let fresh=false,shareNow=duelShare(score);
  const ok=commit(s=>{const k=duelKeep(s.duel,score,runtime.S.todayKey||'');s.duel=k.kept;fresh=k.fresh;});duel=null;fadeOut();combo={streak:0};
  if(!ok){runtime.toast?.('No se pudo guardar el duelo. Inténtalo otra vez.',{level:2,force:true});return;}
  result({score,share:shareNow,fresh});runtime.hud?.();}
 // ---------- the sheets ----------
 function sheet(kind){const box=$('mDuel');if(!box)return false;const d=own().duel,lines=$('duelLines'),add=t=>{const p=doc.createElement('p');p.textContent=t;lines.appendChild(p);};lines.replaceChildren();box.dataset.kind=kind;
  $('duelStars').innerHTML=`<span class="${d.won?'got':''}">★</span>`;return {box,add,d};}
 // At the portal: what it is, its ★, and «Jugar»; «Ahora no» closes. Without sound it says it needs it.
 function ask(){const s=sheet('ask');if(!s)return false;$('duelTitle').textContent='Duelo final';s.add('Los once ritmos, uno tras otro.');s.add('Escucha un compás. Repítelo en el siguiente.');
  if(s.d.won)s.add(`Tu mejor duelo · ${roundPercent(s.d.best)} % a tiempo.`);if(!sound())s.add('Con sonido: actívalo en Ajustes.');
  const play=$('duelPlay');play.hidden=!sound();play.textContent='Jugar';play.onclick=()=>{s.box.hidden=true;if(!start())runtime.toast?.('Ahora no se puede. Vuelve al centro del anillo.',{force:true});};
  const close=$('duelClose');close.textContent='Ahora no';close.onclick=()=>{s.box.hidden=true;};s.box.hidden=false;return true;}
 // The end, on black: its ★ in gold, how it went and, the first time, the ornament. «Explorar» goes on.
 function result({score,share:sh,fresh}){const s=sheet('result');if(!s)return false;$('duelTitle').textContent='Duelo final · Completo';s.add(`Ecos · ${score.echoes} de ${duelList(rapid()).length}`);s.add(`${roundPercent(sh)} % a tiempo`);
  if(fresh){s.add('Nuevo adorno: Corona de los once. Está en Tu cubo.');s.add('Queda en la Bitácora.');}
  const play=$('duelPlay');play.hidden=false;play.textContent='Explorar';play.onclick=()=>{s.box.hidden=true;runtime.hud?.();};
  const close=$('duelClose');close.textContent='Otra vez';close.onclick=()=>{s.box.hidden=true;if(!start())runtime.toast?.('Ahora no se puede. Vuelve al centro del anillo.',{force:true});};s.box.hidden=false;return true;}
 // ---------- each tick ----------
 let inside=null;
 function duelTick(){if(!duel){if(!open()||!ringActive()){inside=null;return;}const c=center(),S=runtime.S;if(!c)return;
   // Announced once, when the ring first shows it.
   if(!state.said.duel&&!modal()&&runtime.toast?.('Duelo final · en el centro del anillo',{force:true})!==false)commit(s=>{s.said.duel=true;});
   // It asks when you walk into it, not when you already stand there (a load, a return to the ring).
   const near=Math.hypot(S.wx-c.x,S.wy-c.y)<DUEL_REACH;if(inside===null)inside=near;else if(near&&!inside&&!modal()){inside=true;ask();}else if(!near)inside=false;return;}
  const S=runtime.S,c=duel.center;
  if(!runtime.inWorld?.()||(S.layer||'superficie')!=='superficie'||runtime.houseActive?.()||runtime.placeRun?.()||!sound()||Math.hypot(S.wx-c.x,S.wy-c.y)>DUEL_LEAVE)quit('Saliste del duelo. No perdiste nada.');}
 function tick(){if(!runtime.S)return;own();track();comboTick();pulseTick();duelTick();}
 // A timer that never keeps a process alive on its own (the Node tests load the ring).
 setInterval(tick,60)?.unref?.();
 // ---------- drawing ----------
 const gold=()=>runtime.GOLD||'#f0d27a',drawn={ghost:null};
 // In the ring (places-ring.js): the duel's portal in the centre, white while it is the next thing (a diamond and a
 // column of light), with its ★ once won.
 function drawRing(c,W,H,t){if(!open()||duel)return;const at=center();if(!at)return;const S=runtime.S,cx=runtime.camX??S.wx,cy=runtime.camY??S.wy,x=W/2+at.x-cx,y=H/2+at.y-cy;if(x<-90||x>W+90||y<-260||y>H+90)return;
  const won=own().duel.won,turn=calm()?0:t/900,r=22;c.save();
  if(!won){const g=c.createLinearGradient(x,y,x,y-220);g.addColorStop(0,'rgba(255,255,255,.26)');g.addColorStop(1,'rgba(255,255,255,0)');c.globalAlpha=calm()?.8:.7+.3*Math.sin(t/600);c.fillStyle=g;c.fillRect(x-8,y-220,16,220);}
  c.globalAlpha=won?.7:.95;c.strokeStyle='#ffffff';c.lineWidth=1.5;for(let i=0;i<2;i++){const q=r*(1-i*.35),a=turn*(i?-1:1);c.beginPath();for(let k=0;k<4;k++){const b=a+k*Math.PI/2;k?c.lineTo(x+Math.cos(b)*q,y+Math.sin(b)*q):c.moveTo(x+Math.cos(b)*q,y+Math.sin(b)*q);}c.closePath();c.stroke();}
  c.globalAlpha=1;c.fillStyle=won?gold():'#ffffff40';c.beginPath();for(let i=0;i<10;i++){const q=i%2?2.5:5.5,a=i/10*6.283-Math.PI/2;i?c.lineTo(x+Math.cos(a)*q,y+r+14+Math.sin(a)*q):c.moveTo(x+Math.cos(a)*q,y+r+14+Math.sin(a)*q);}c.closePath();c.fill();
  c.textAlign='center';c.textBaseline='top';c.font='12px "Geist Mono", monospace';c.fillStyle='#ffffff';c.fillText('Duelo final',x,y+r+24);c.restore();}
 // On the cube (journey-pulse.js drawForm): the ghost, the trail, the duel's sockets and the ornament. x, y: the cube.
 function drawCube(c,x,y,s,t){if(!runtime.S||!runtime.inWorld?.()||modal())return;const S=runtime.S,at=p=>({x:x+p.x-S.wx,y:y+p.y-S.wy}),still=calm(),now=performance.now();c.save();
  // The ghost: the outline of the cube where your best round was at this moment.
  const r=live();drawn.ghost=null;if(r?.ghost){const ms=Date.now()-r.startedAt,p=ghostAt(r.ghost,ms),a=ghostAlpha(r.ghost,ms);if(p&&a>0){const q=at({x:r.origin.x+p.x,y:r.origin.y+p.y});c.globalAlpha=a;c.strokeStyle='#ffffff';c.lineWidth=1.5;c.setLineDash?.([3,2]);c.strokeRect(Math.round(q.x-s/2)+.5,Math.round(q.y-s/2)+.5,Math.round(s),Math.round(s));c.setLineDash?.([]);drawn.ghost={x:q.x-x,y:q.y-y,alpha:a};}}
  // The trail: small squares on the path just walked, fainter and smaller toward the end; it fades after a miss.
  const paint=(pts,k)=>{pts.forEach((p,i)=>{const f=(i+1)/pts.length,q=at(p),z=Math.max(1,s*.55*f);c.globalAlpha=k*.5*f;c.fillStyle='#ffffff';c.fillRect(Math.round(q.x-z/2),Math.round(q.y-z/2),Math.round(z),Math.round(z));});};
  trailTick();if(trail.length>1)paint(trail.slice(0,-1),1);if(fade){const k=1-(now-fade.at)/TRAIL_FADE;if(k<=0)fade=null;else paint(fade.points,k);}
  if(duel)drawDuel(c,x,y,s,t,still);
  // The Corona de los once: eleven small gold squares round the cube, once the duel is won and while it is worn.
  if(writable()&&state.duel.won&&state.duel.wear!==false&&!duel){const turn=still?0:t/2600,rr=s/2+15;c.globalAlpha=.75;c.fillStyle=gold();for(let i=0;i<11;i++){const a=turn+i/11*6.283-Math.PI/2;c.fillRect(Math.round(x+Math.cos(a)*rr)-1,Math.round(y+Math.sin(a)*rr)-1,2,2);}}
  c.restore();}
 // The duel near the cube: the place whose rhythm it is, eight sockets (lit as it sings; waiting, then gold, as you
 // answer) and eleven small squares for the way through, white the ones done.
 function drawDuel(c,x,y,s,t,still){const p=duel.phase,h=runtime.ac?audibleTime(runtime.ac):0,sx=six(),n=duel.list.length;
  const y0=y+s/2+30;c.globalAlpha=.9;c.fillStyle='#ffffff';c.textAlign='center';c.textBaseline='top';c.font='12px "Geist Mono", monospace';c.fillText(p?`${name(p.id)} · ${p.kind==='call'?'escucha':'repite'}`:'Duelo final',x,y0+24);
  const x0=x-42;for(let i=0;i<8;i++){const st=i*2,sx0=x0+i*12,inPat=p?.pattern?.includes(st),cur=p&&h>=p.start&&h<p.end&&Math.floor((h-p.start)/(sx*2))===i;let fill=null,alpha=.25;
   if(p?.kind==='call'&&inPat){const sung=h>=p.start+st*sx-.02;fill=sung?'#ffffff':null;alpha=sung?.95:.5;}
   if(p?.kind==='answer'){const hit=p.steps.includes(st);if(hit){fill=gold();alpha=1;}else alpha=inPat?.75:.25;}
   c.globalAlpha=alpha;c.strokeStyle='#ffffff';c.lineWidth=cur?2:1;c.strokeRect(Math.round(sx0-3.5)+.5,Math.round(y0-3.5)+.5,7,7);if(fill){c.fillStyle=fill;c.fillRect(Math.round(sx0-3.5)+1,Math.round(y0-3.5)+1,6,6);}}
  for(let k=0;k<n;k++){c.globalAlpha=k<duel.i?.85:k===duel.i?.6:.2;c.fillStyle='#ffffff';c.fillRect(Math.round(x-n*3+k*6+1),Math.round(y0+12),3,3);}
  const now=performance.now();for(const g of duel.glows){const k=(now-g.at)/800;if(k<0||k>1)continue;c.globalAlpha=.85*(1-k);c.strokeStyle=g.kind==='echo'?gold():'#ffffff';c.lineWidth=g.kind==='echo'?2:1;c.beginPath();c.arc(x,y,18+(still?10:k*(g.kind==='echo'?44:20)),0,6.283);c.stroke();}}
 // The Line during the duel: the steps of the rhythm being sung or answered.
 const lineSteps=()=>duel?.phase?[...duel.phase.pattern]:null;
 // ---------- Tu cubo, Lugares and the Bitácora ----------
 function syncCube(){const box=$('cubeRitmoSection'),list=$('cubeRitmoOptions');if(!box||!list)return;const d=writable()?state.duel:null,earned=!!d?.won;box.hidden=!earned;if(!earned){list.replaceChildren();return;}
  let b=doc.getElementById('cubeRitmoCrown');if(!b){b=doc.createElement('button');b.type='button';b.id='cubeRitmoCrown';b.className='cube-option';b.dataset.earned='true';b.textContent='Corona de los once';b.title='Duelo final';b.onclick=toggleCrown;list.replaceChildren(b);}b.setAttribute('aria-pressed',String(d.wear!==false));}
 function toggleCrown(){if(!writable()||!state.duel.won)return false;const was=state.duel.wear!==false;const ok=commit(s=>{s.duel.wear=!was;});if(!ok){const h=$('cubeHint');if(h)h.textContent='No se guardó. Intenta otra vez.';}syncCube();return ok;}
 const cube=$('mCube');if(cube&&globalThis.MutationObserver)new MutationObserver(()=>{if(!cube.hidden)syncCube();}).observe(cube,{attributes:true,attributeFilter:['hidden']});
 // Lugares: «Eco» on each place that offers it, and the duel's line once it is open (to the centre of the ring).
 function lugares(list){const d=places();if(!d||!list)return;for(const li of list.children){const id=li.dataset?.placeId,acts=li.querySelector?.('.lugar-actions');if(!id||!acts||!echoOffered(d,id,sound()))continue;
   const b=doc.createElement('button');b.textContent='Eco';b.dataset.echo=id;b.title='De memoria, sin señales';b.onclick=()=>{$('mLugares')&&($('mLugares').hidden=true);if(!startEcho(id))runtime.toast?.('Ahora no se puede. Inténtalo en el Mundo.',{force:true});};acts.prepend(b);}
  const link=$('lugaresDuel');if(link){link.hidden=!open();if(open()){link.textContent=own().duel.won?'Duelo final ★ · en el centro del anillo ›':'Duelo final · en el centro del anillo ›';link.onclick=()=>{if(runtime.ringHome?.()){$('mLugares')&&($('mLugares').hidden=true);}else runtime.toast?.('Ahora no se puede volver. Inténtalo otra vez.');};}}}
 const esc=v=>String(v).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
 // The Bitácora (Lugares tab): the duel, the ornament, the places played from memory and the ghosts kept.
 function section(){if(!writable())return '';const d=state.duel,echo=Object.keys(state.echo).filter(id=>state.echo[id].rounds>0),ghosts=PLACE_IDS.filter(id=>state.ghosts[id]);if(!d.won&&!open()&&!echo.length&&!ghosts.length)return '';
  const rows=[];if(d.won)rows.push(`<p>Duelo final <span class="ritmo-star">★</span> · ${roundPercent(d.best)} % a tiempo · ${d.echoes} ecos</p><p>Corona de los once · tu adorno</p>`);else if(open())rows.push('<p>Duelo final · en el centro del anillo</p>');
  if(echo.length)rows.push(`<p>Eco · ${esc(echo.map(name).join(', '))}</p>`);if(ghosts.length)rows.push(`<p>Fantasmas · ${esc(ghosts.map(id=>`${name(id)} ${roundTime(state.ghosts[id].ms)}`).join(' · '))}</p>`);
  return `<details class="journal-section" data-journal-detail="Ritmo" id="journalRitmo"><summary>Ritmo</summary>${rows.join('')}</details>`;}
 own();
 Object.defineProperties(runtime,{ritmoHideSignals:{get:()=>hideSignals},ritmoLineSteps:{get:()=>lineSteps},ritmoMusicStep:{get:()=>musicStep},drawRitmoRing:{get:()=>drawRing},drawRitmoCube:{get:()=>drawCube},
  ritmoEchoOffered:{get:()=>id=>echoOffered(places(),id,sound())&&!runtime.placeRun?.()&&!duel},ritmoStartEcho:{get:()=>startEcho},ritmoCard:{get:()=>card},ritmoLugares:{get:()=>lugares},ritmoSection:{get:()=>section},
  ritmoDuelActive:{get:()=>()=>!!duel},ritmoDuelQuit:{get:()=>()=>quit('Saliste del duelo. No perdiste nada.')},ritmoDuelOpen:{get:()=>open},ritmoDuelAsk:{get:()=>ask},ritmoDuelStart:{get:()=>start},
  // Tests only (the runtime is never published): a pulse heard at a time on the audio clock, and the state.
  ritmoDuelPulse:{get:()=>heard=>hear(heard)},ritmoToggleCrown:{get:()=>toggleCrown},
  ritmoState:{get:()=>()=>({save:structuredClone(own()),round:round?{id:round.id,echo:round.echo,ghost:!!round.ghost,samples:round.rec?.pts.length||0,every:round.rec?.every||0}:null,hidden:hideSignals(),drawn:{...drawn},combo:combo.streak,trail:trail.length,fading:!!fade,finished:finished?structuredClone(finished):null,
   duel:duel?{i:duel.i,n:duel.list.length,phase:duel.phase?{kind:duel.phase.kind,id:duel.phase.id,start:duel.phase.start,end:duel.phase.end,pattern:[...duel.phase.pattern],steps:[...(duel.phase.steps||[])],wrong:duel.phase.wrong||0}:null,score:{...duel.score},center:{...duel.center}}:null,open:open()})}});
}
