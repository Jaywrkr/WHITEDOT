// Viaje lejos, tanda D (alpha.252; docs/MUNDO.md#tanda-d-60-km-o-más): the two games that open on a sheet of their own
// (#mViajeD), while the World waits behind it (a sheet open pauses every scene): the station of the day, room by room,
// and the sweep on the beat inside a far rest satellite. The rules are in viaje-d-model.js; viaje-d.js opens the sheet,
// keeps the save and pays. The buttons are silent, as every menu; only the sweep clearing sings, far under the music.
// Leaving is always possible («Salir», Escape): the station keeps today's rooms, the sweep keeps its score.
import {STATION_DEPTH,ROOMS,stationOffer,memorySequence,rapidSequence,RAPID_SECONDS,RAPID_NEED,COMPAS_NEED,COMPAS_TRIES,
 SWEEP_COLS,SWEEP_ROWS,SWEEP_SECONDS,emptyGrid,sweepPiece,rotatePiece,fits,lockPiece,markSquares,sweepStep} from './viaje-d-model.js';
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clockText=s=>{const k=Math.max(0,Math.ceil(s)),m=Math.floor(k/60);return `${m}:${String(k%60).padStart(2,'0')}`;};
const TONES=Object.freeze(['#000000','#ffffff','#7c7c86']);
// hooks: room(type, result) → the station after it (or null if it could not be kept); finish() → {amount} once the
// station is complete; sweepEnd(score) → {record, amount}; sing(kind, degrees, opts).
export function createGames(r,hooks){
 const $=id=>r.$?.(id)||globalThis.document?.getElementById(id)||null;
 const box=$('mViajeD'),title=$('viajeDTitle'),status=$('viajeDStatus'),body=$('viajeDBody'),canvas=$('viajeDCanvas'),pad=$('viajeDPad');
 let mode=null,station=null,room=null,sweep=null,raf=0,last=0;
 const now=()=>performance.now()/1000;
 const six=()=>Math.max(.07,Math.min(.25,Number(r.SIX)||.125));
 const visible=()=>!!box&&!box.hidden;
 function show(kind){mode=kind;if(!box)return;box.hidden=false;canvas.hidden=kind!=='sweep';pad.hidden=kind!=='sweep';title.textContent=kind==='sweep'?'Barrido a tempo':'Estación del día';loop();}
 function close(){if(!box)return;if(sweep&&!sweep.over)endSweep();box.hidden=true;mode=null;room=null;station=null;sweep=null;cancelAnimationFrame(raf);raf=0;hooks.closed?.();}
 // ---------- the station of the day ----------
 // ctx: {world, day, state (the save's station of today)}.
 function openStation(ctx){station={...ctx};room=null;show('station');renderStation();return true;}
 function doors(){const s=station.state;return stationOffer(station.world,station.day,s.path.length,s.path);}
 function renderStation(){if(!station)return;const s=station.state,k=s.path.length;
  if(s.done){const won=s.results.filter(v=>v===true).length,seals=s.results.filter(v=>v==='premio').length;status.textContent=`Estación completa · ${won} ${won===1?'reto':'retos'} · ${seals} ${seals===1?'sello':'sellos'}${station.paid?` · +${station.paid} ✦`:''}`;
   body.innerHTML='<p>Mañana será otra estación.</p>';return;}
  if(!room){status.textContent=`Sala ${k+1} de ${STATION_DEPTH} · Elige la puerta`;
   body.innerHTML=`<div class="viajed-doors">${doors().map((d,i)=>`<button type="button" data-door="${i}" data-room="${d.type}"><span>${escape(d.name)}</span><small>${d.kind==='reto'?'Reto':'Premio'}</small></button>`).join('')}</div>`;return;}
  status.textContent=`Sala ${k+1} de ${STATION_DEPTH} · ${ROOMS[room.type].name}`;
  if(room.result!==undefined){body.innerHTML=`<p>${room.result==='premio'?'Un sello más.':room.result?'Superada.':'Esta vez no. Sigue igual.'}</p><div class="row"><button type="button" data-next>Seguir</button></div>`;return;}
  const def=ROOMS[room.type];if(def.kind==='premio'){body.innerHTML=`<p>${escape(def.text)}</p><div class="row"><button type="button" data-seal>Tomar el sello</button></div>`;return;}
  if(room.type==='compas')body.innerHTML=`<p>${escape(def.text)}</p><div class="viajed-beat">${[0,1,2,3].map(i=>`<i data-beat="${i}"></i>`).join('')}</div><p class="viajed-count" data-count></p><div class="row"><button type="button" data-now>Ahora</button></div>`;
  else body.innerHTML=`<p>${escape(def.text)}</p><div class="viajed-cells viajed-cells-${room.type==='memoria'?4:9}">${Array.from({length:room.type==='memoria'?4:9},(_,i)=>`<button type="button" data-cell="${i}" aria-label="Luz ${i+1}"></button>`).join('')}</div><p class="viajed-count" data-count></p>`;
  stepRoom();}
 function choose(i){const d=doors()[i];if(!d||room)return;room={type:d.type,seed:d.seed,start:now(),hits:0,tries:0,input:[],seq:d.type==='memoria'?memorySequence(d.seed):d.type==='rapida'?rapidSequence(d.seed):[],lit:-1,taken:new Set()};renderStation();}
 function finishRoom(result){if(!room||room.result!==undefined)return;const s=hooks.room(room.type,result);if(!s){close();return;}station.state=s;room.result=ROOMS[room.type].kind==='premio'?'premio':!!result;
  if(s.done){const out=hooks.finish?.();station.paid=out?.amount||0;}renderStation();}
 function next(){if(!room||room.result===undefined)return;room=null;renderStation();}
 // The challenges, on the clock of the frames (the compás on the music's beat: four sixteenths).
 function stepRoom(){if(!room||room.result!==undefined||mode!=='station')return;const t=now()-room.start,count=body.querySelector('[data-count]');
  if(room.type==='compas'){const beat=six()*4,lit=Math.floor(t/beat)%4;room.lit=lit;for(const e of body.querySelectorAll('[data-beat]'))e.classList.toggle('on',Number(e.dataset.beat)===lit);
   if(count)count.textContent=`${room.hits} de ${COMPAS_NEED}`;if(room.tries>=COMPAS_TRIES||t>24)finishRoom(false);}
  else if(room.type==='memoria'){const show=.6,showing=t<room.seq.length*show+.4;room.lit=showing&&t>=.4?room.seq[Math.floor((t-.4)/show)]??-1:-1;room.showing=showing;
   for(const e of body.querySelectorAll('[data-cell]'))e.classList.toggle('on',Number(e.dataset.cell)===room.lit);if(count)count.textContent=showing?'Mira…':`${room.input.length} de ${room.seq.length}`;}
  else if(room.type==='rapida'){const k=Math.floor(t/RAPID_SECONDS);room.lit=k<room.seq.length&&!room.taken.has(k)?room.seq[k]:-1;room.k=k;
   for(const e of body.querySelectorAll('[data-cell]'))e.classList.toggle('on',Number(e.dataset.cell)===room.lit);if(count)count.textContent=`${room.hits} de ${RAPID_NEED}`;
   if(k>=room.seq.length)finishRoom(room.hits>=RAPID_NEED);}}
 function tap(cell){if(!room||room.result!==undefined)return;
  if(room.type==='memoria'){if(room.showing)return;room.input.push(cell);if(room.seq[room.input.length-1]!==cell){finishRoom(false);return;}if(room.input.length>=room.seq.length)finishRoom(true);}
  else if(room.type==='rapida'){if(cell===room.lit&&!room.taken.has(room.k)){room.taken.add(room.k);room.hits++;if(room.hits>=RAPID_NEED)finishRoom(true);}}}
 function nowButton(){if(!room||room.type!=='compas'||room.result!==undefined)return;room.tries++;if(room.lit===3){room.hits++;if(room.hits>=COMPAS_NEED)finishRoom(true);}}
 // ---------- the sweep on the beat ----------
 // ctx: {seed, best}. The grid fills from the pieces of today's seed; the line moves a column every eighth note and the
 // piece falls a row every beat (four sixteenths of the music that sounds).
 function openSweep(ctx){sweep={seed:ctx.seed,best:ctx.best|0,grid:emptyGrid(),n:0,piece:null,score:0,left:SWEEP_SECONDS,col:-1,lineAt:0,fallAt:0,doomed:new Set(),over:false,result:null,cleared:0};spawn();show('sweep');renderSweep();return true;}
 function spawn(){const p=sweepPiece(sweep.seed,sweep.n++);if(!fits(sweep.grid,p)){endSweep();return false;}sweep.piece=p;return true;}
 function move(dx){if(!sweep||sweep.over||!sweep.piece)return;const p={...sweep.piece,x:sweep.piece.x+dx};if(fits(sweep.grid,p))sweep.piece=p;}
 function turn(){if(!sweep||sweep.over||!sweep.piece)return;const p=rotatePiece(sweep.piece);if(fits(sweep.grid,p))sweep.piece=p;}
 function drop(){if(!sweep||sweep.over||!sweep.piece)return;let p=sweep.piece;while(fits(sweep.grid,{...p,y:p.y+1}))p={...p,y:p.y+1};land(p);}
 function land(p){lockPiece(sweep.grid,p);sweep.piece=null;spawn();}
 function fall(){const p=sweep.piece;if(!p)return;const q={...p,y:p.y+1};if(fits(sweep.grid,q))sweep.piece=q;else land(p);}
 function stepSweep(dt){const s=sweep;if(!s||s.over)return;s.left-=dt;if(s.left<=0){endSweep();return;}
  s.fallAt+=dt;const beat=six()*4;while(s.fallAt>=beat&&!s.over){s.fallAt-=beat;fall();}
  s.lineAt+=dt;const eighth=six()*2;while(s.lineAt>=eighth&&!s.over){s.lineAt-=eighth;s.col=s.col+1>SWEEP_COLS?0:s.col+1;const n=sweepStep(s.grid,s,s.col>=SWEEP_COLS?-1:s.col);if(n){s.score+=n;s.cleared++;hooks.sing?.('barrido',[Math.min(7,Math.floor(n/4))]);}}}
 function endSweep(){const s=sweep;if(!s||s.over)return;s.over=true;s.piece=null;s.result=hooks.sweepEnd?.(s.score)||{record:false,amount:0};renderSweep();}
 function renderSweep(){const s=sweep;if(!s)return;const rec=Math.max(s.best,s.score);
  if(s.over){status.textContent=`Barrido · ${s.score}`+(s.result?.record?' · récord nuevo':` · Récord · ${rec}`)+(s.result?.amount?` · +${s.result.amount} ✦`:'');
   body.innerHTML='<div class="row"><button type="button" data-again>Otra vez</button></div>';}
  else{status.textContent=`Barrido · ${clockText(s.left)} · ${s.score}`;if(body.dataset.sweep!=='on'){body.dataset.sweep='on';body.innerHTML='<p>Coloca las piezas. La línea borra los cuadrados de un solo tono.</p>';}}
  drawSweep();}
 function drawSweep(){const s=sweep,c=canvas?.getContext?.('2d');if(!s||!c)return;const cw=canvas.width/SWEEP_COLS,ch=(canvas.height-8)/SWEEP_ROWS,m=markSquares(s.grid);c.fillStyle='#000';c.fillRect(0,0,canvas.width,canvas.height);
  c.strokeStyle='#ffffff30';c.lineWidth=1;c.strokeRect(.5,8.5,canvas.width-1,canvas.height-9);
  const cell=(x,y,t,a=1)=>{c.globalAlpha=a;c.fillStyle=TONES[t];c.fillRect(Math.round(x*cw)+2,Math.round(8+y*ch)+2,Math.round(cw)-4,Math.round(ch)-4);};
  for(let y=0;y<SWEEP_ROWS;y++)for(let x=0;x<SWEEP_COLS;x++)if(s.grid[y][x]){cell(x,y,s.grid[y][x],s.doomed.has(x+','+y)?.45:1);if(m[y][x]){c.globalAlpha=1;c.strokeStyle='#ffffff';c.strokeRect(Math.round(x*cw)+.5,Math.round(8+y*ch)+.5,Math.round(cw)-1,Math.round(ch)-1);}}
  if(s.piece){const p=s.piece;[[0,0],[1,0],[0,1],[1,1]].forEach(([dx,dy],i)=>{if(p.y+dy>=0)cell(p.x+dx,p.y+dy,p.cells[i]);});}
  c.globalAlpha=1;if(s.col>=0&&s.col<SWEEP_COLS){const x=Math.round((s.col+Math.min(1,s.lineAt/(six()*2)))*cw);c.fillStyle='#ffffff';c.fillRect(x-1,0,2,canvas.height);c.fillRect(x-4,0,8,3);}
  c.globalAlpha=1;}
 // ---------- the frame of the sheet ----------
 function loop(){cancelAnimationFrame(raf);last=now();const frame=()=>{if(!visible()){if(mode)close();return;}const t=now(),dt=Math.min(.1,Math.max(0,t-last));last=t;
   if(mode==='station')stepRoom();else if(mode==='sweep'){stepSweep(dt);if(!sweep?.over)renderSweep();}raf=requestAnimationFrame(frame);};raf=requestAnimationFrame(frame);}
 body?.addEventListener('click',e=>{const t=e.target.closest?.('button');if(!t)return;
  if(t.dataset.door!==undefined)choose(Number(t.dataset.door));else if(t.dataset.cell!==undefined)tap(Number(t.dataset.cell));else if(t.dataset.now!==undefined)nowButton();
  else if(t.dataset.seal!==undefined)finishRoom('premio');else if(t.dataset.next!==undefined)next();else if(t.dataset.again!==undefined&&sweep){const best=Math.max(sweep.best,sweep.score);delete body.dataset.sweep;openSweep({seed:sweep.seed+':'+(sweep.n),best});}});
 $('viajeDClose')?.addEventListener('click',close);
 $('viajeDLeft')?.addEventListener('click',()=>move(-1));$('viajeDRight')?.addEventListener('click',()=>move(1));$('viajeDTurn')?.addEventListener('click',turn);$('viajeDDrop')?.addEventListener('click',drop);
 globalThis.document?.addEventListener('keydown',e=>{if(!visible()||mode!=='sweep'||e.target?.matches?.('input,textarea,select'))return;const k=e.key;
  if(k==='ArrowLeft'||k==='a'){move(-1);e.preventDefault();}else if(k==='ArrowRight'||k==='d'){move(1);e.preventDefault();}else if(k==='ArrowUp'||k==='w'){turn();e.preventDefault();}else if(k==='ArrowDown'||k==='s'||k===' '){drop();e.preventDefault();}});
 return {openStation,openSweep,close,visible,mode:()=>mode,
  // Tests only (the runtime is never published): the state, and a sweep set to a grid and a time left.
  state:()=>({mode,visible:visible(),room:room?{type:room.type,lit:room.lit,hits:room.hits,tries:room.tries,seq:[...room.seq],result:room.result,showing:!!room.showing,k:room.k}:null,station:station?{...station.state,paid:station.paid||0}:null,
   sweep:sweep?{score:sweep.score,left:sweep.left,over:sweep.over,col:sweep.col,piece:sweep.piece?{...sweep.piece}:null,grid:sweep.grid.map(r=>[...r]),cleared:sweep.cleared,result:sweep.result}:null}),
  sweepSet:({grid,left}={})=>{if(!sweep)return false;if(grid){sweep.grid=grid.map(r=>[...r]);sweep.col=-1;sweep.lineAt=0;sweep.doomed.clear();}if(Number.isFinite(left))sweep.left=left;return true;}};
}
