import {openSurface,prefersReducedMotion} from './frame-state.js';
import {PLACES,placeOpen,starCount,nextOnPath,previousPlace} from './places.js';
import {freeOpen} from './journey-mode.js';
// The ring (plan F5, docs/MUNDO.md): the eleven places as gold portals around the Refugio, about half a minute's walk
// from its door. Each portal sounds on the bar's «1», louder as you come near; a closed one shows the stars it asks for.
// An arrow at the edge of the screen points to the next place on the path (plan H3: in order, like the tracks of a
// record), a column of gold light stands over its portal, and the map shows them all.
// The ring follows the Refugio when it moves; before there is one, it stays where the free World opened.
export const RING_RADIUS=6000,PORTAL_REACH=40,PORTAL_HEAR=1800,RING_SEA_STEP=300,RING_SEA_TRIES=6;
// Notes of the portals, a pentatonic over two octaves: each place has its own.
export const PORTAL_NOTES=Object.freeze([0,2,4,7,9,12,14,16,19,21,24]);
// Each portal at a fixed angle, from the north clockwise; a spot at sea moves along its ray, out and in, to land.
export function portalSpots(center,isSea=()=>false){return PLACES.map((p,i)=>{const a=-Math.PI/2+i/PLACES.length*2*Math.PI,at=r=>({x:Math.round(center.x+Math.cos(a)*r),y:Math.round(center.y+Math.sin(a)*r)});
 for(let k=0;k<=RING_SEA_TRIES*2;k++){const q=at(RING_RADIUS+(k%2?1:-1)*Math.ceil(k/2)*RING_SEA_STEP);if(!isSea(q.x,q.y))return {id:p.id,...q};}return {id:p.id,...at(RING_RADIUS)};});}
// The portal the arrow shows: the nearest open place never entered, or still without its ★; none once all are done.
export function nextPortal(spots,places,journey,from){const path=nextOnPath(places,journey);return path&&spots.find(q=>q.id===path.id)||null;}
// Where you stand when you come back from a round: a step from the portal, toward the Refugio, outside its reach.
export function besidePortal(spot,center){const d=Math.hypot(center.x-spot.x,center.y-spot.y)||1;return {x:Math.round(spot.x+(center.x-spot.x)/d*PORTAL_REACH*3),y:Math.round(spot.y+(center.y-spot.y)/d*PORTAL_REACH*3)};}
export function initialize(runtime){
 const $=id=>runtime.$?.(id),calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 let cache=null,inside=null,said=null;
 const data=()=>runtime.placesData?.();
 const name=id=>PLACES.find(p=>p.id===id)?.name||id;
 function active(){const S=runtime.S;return !!(S&&runtime.inWorld?.()&&S.mode==='world'&&(S.layer||'superficie')==='superficie'&&freeOpen(S.journey)&&!runtime.placeRun?.()&&!runtime.journeyFinaleState?.().running&&data());}
 // The Refugio is the centre; before the first one, the spot where the free World opened, kept in the save.
 function center(){const S=runtime.S,st=S.studio;if(st&&Number.isFinite(st.x)&&Number.isFinite(st.y))return {x:st.x,y:st.y};const d=data();if(!d)return null;if(!d.center){d.center={x:Math.round(S.wx),y:Math.round(S.wy)};runtime.save?.();}return d.center;}
 function spots(){const c=center();if(!c)return [];if(!cache||cache.x!==c.x||cache.y!==c.y)cache={x:c.x,y:c.y,spots:portalSpots(c,(x,y)=>!!runtime.regionOfPos?.(x,y)?.sea)};return cache.spots;}
 const stars=id=>data()?.stars?.[id]||[false,false,false];
 // Into a portal: a round; with its ★★, first the choice of the Maestro one.
 function enter(spot){const d=data(),from=besidePortal(spot,center()||spot);if(!placeOpen(d,spot.id,runtime.S.journey)){const p=PLACES.find(x=>x.id===spot.id),prev=PLACES.find(x=>x.id===previousPlace(spot.id));if(said!==spot.id){said=spot.id;runtime.toast?.(p.game&&prev?`${p.name} se abre al completar ${prev.name}.`:`${p.name}: pronto.`,{force:true});}runtime.narrate?.('locked');return;}
  d.seen[spot.id]=true;runtime.narrate?.('portal');if(stars(spot.id)[0]){choose(spot.id,from);return;}runtime.startPlace?.(spot.id,{from});}
 function choose(id,from){const box=$('mPortal');if(!box){runtime.startPlace?.(id,{from});return;}$('portalTitle').textContent=name(id);$('portalStars').innerHTML=stars(id).map(x=>`<span class="${x?'got':''}">★</span>`).join('');
  // A place already complete offers its round, the Maestro one once it has ★★, and Libre: its music with no bar or stars.
  const go=opts=>{box.hidden=true;runtime.startPlace?.(id,{...opts,from});};$('portalPlay').onclick=()=>go({});$('portalMaestro').hidden=!stars(id)[1];$('portalMaestro').onclick=()=>go({maestro:true});if($('portalFree'))$('portalFree').onclick=()=>go({free:true});$('portalClose').onclick=()=>{box.hidden=true;};box.hidden=false;}
 // Straight to a portal and into its round: the card's «Siguiente».
 function go(id){if(!active())return false;const s=spots().find(q=>q.id===id);if(!s||!placeOpen(data(),id,runtime.S.journey))return false;const from=besidePortal(s,center()||s);runtime.S.wx=from.x;runtime.S.wy=from.y;inside=id;data().seen[id]=true;runtime.enterFx=1;return runtime.startPlace?.(id,{from});}
 function tick(){if(!active()||openSurface('.modal:not([hidden])')){inside=null;return;}const S=runtime.S,near=spots().find(s=>Math.hypot(s.x-S.wx,s.y-S.wy)<PORTAL_REACH);
  // A portal acts once each time you walk into it.
  if(near&&inside!==near.id){inside=near.id;enter(near);}else if(!near){inside=null;said=null;}}
 // A star drawn, not written: the quiet screen of the Journey draws no words in the World (journey-mode.js).
 function star(c,x,y,r){c.beginPath();for(let i=0;i<10;i++){const q=i%2?r*.45:r,a=i/10*6.283-Math.PI/2;i?c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q):c.moveTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.closePath();c.fill();}
 // The portals on screen and, when the next one is not in view, a gold arrow at the edge pointing to it.
 function draw(c,W,H,t){tick();if(!active()||openSurface('.modal:not([hidden])'))return;const S=runtime.S,d=data(),cx=runtime.camX??S.wx,cy=runtime.camY??S.wy,still=calm(),gold=runtime.GOLD||'#f0d27a';c.save();
  for(const s of spots()){const x=W/2+s.x-cx,y=H/2+s.y-cy;if(x<-80||x>W+80||y<-80||y>H+80)continue;const open=placeOpen(d,s.id,S.journey),r=24,turn=still?0:t/700;
   if(open){const g=c.createRadialGradient(x,y,0,x,y,r*2.4);g.addColorStop(0,'rgba(240,210,122,.32)');g.addColorStop(1,'rgba(240,210,122,0)');c.globalAlpha=1;c.fillStyle=g;c.fillRect(x-r*2.4,y-r*2.4,r*4.8,r*4.8);}
   c.strokeStyle=open?gold:'#8a8a8f';c.lineWidth=1.5;for(let i=0;i<3;i++){c.globalAlpha=(open?.9:.45)-i*.2;c.beginPath();c.arc(x,y,r*(1-i*.25),turn+i,turn+i+Math.PI*1.6);c.stroke();}
   // Open: its three stars below, gold the ones won. Closed: a grey ring and star; it opens when the one before is complete.
   const p=PLACES.find(q=>q.id===s.id);c.globalAlpha=1;if(open)stars(s.id).forEach((g,i)=>{c.fillStyle=g?gold:'#ffffff40';star(c,x+(i-1)*14,y+r+14,5.5);});
   else{c.globalAlpha=.25;c.strokeStyle='#ffffff';c.lineWidth=2;c.beginPath();c.arc(x,y,r+7,0,6.283);c.stroke();c.globalAlpha=.6;c.fillStyle='#8a8a8f';star(c,x,y,6);}
   // With «Todo a la vista», its name and what it asks are written too.
   c.globalAlpha=1;c.textAlign='center';c.textBaseline='top';c.font='12px "Geist Mono", monospace';c.fillStyle=open?'#ffffff':'#8a8a8f';c.fillText(p.name,x,y+r+(open?24:14));}
  const next=nextPortal(spots(),d,S.journey,{x:S.wx,y:S.wy});if(next){const x=W/2+next.x-cx,y=H/2+next.y-cy;
   // The next place on the path: a column of gold light over its portal, seen from far.
   if(x>-60&&x<W+60&&y>-40){const col=c.createLinearGradient(x,y,x,Math.max(0,y-H));col.addColorStop(0,'rgba(240,210,122,.38)');col.addColorStop(1,'rgba(240,210,122,0)');c.globalAlpha=still?.8:.7+.3*Math.sin(t/600);c.fillStyle=col;c.fillRect(x-9,Math.max(0,y-H),18,Math.min(H,y));}if(x<0||x>W||y<0||y>H){const a=Math.atan2(next.y-S.wy,next.x-S.wx),bx=Math.max(14,Math.min(W-14,W/2+Math.cos(a)*(W/2-18))),by=Math.max(70,Math.min(H-120,H/2+Math.sin(a)*(H/2-60))),glow=still?.8:.55+.3*Math.sin(t/500);
   c.globalAlpha=.25*glow;c.strokeStyle=gold;c.lineWidth=1;c.beginPath();c.arc(bx,by,10,0,6.283);c.stroke();c.globalAlpha=glow;c.fillStyle=gold;c.fillRect(Math.round(bx)-2,Math.round(by)-2,4,4);
   c.beginPath();c.moveTo(bx+Math.cos(a)*16,by+Math.sin(a)*16);c.lineTo(bx+Math.cos(a+2.5)*9,by+Math.sin(a+2.5)*9);c.moveTo(bx+Math.cos(a)*16,by+Math.sin(a)*16);c.lineTo(bx+Math.cos(a-2.5)*9,by+Math.sin(a-2.5)*9);c.stroke();}}
  c.restore();}
 // On each bar's «1», the nearest portal sounds its note, louder the closer you are; a closed one, softer.
 function musicStep(step,time){if(step!==0||!runtime.S.sound||!active()||!runtime.pluck)return;const S=runtime.S;let best=null,far=PORTAL_HEAR,index=0;
  spots().forEach((s,i)=>{const d=Math.hypot(s.x-S.wx,s.y-S.wy);if(d<far){far=d;best=s;index=i;}});if(!best)return;
  const near=1-far/PORTAL_HEAR,open=placeOpen(data(),best.id,S.journey);runtime.pluck(60+(runtime.MU?.tr||0)+PORTAL_NOTES[index],time,(open?.09:.035)*near*near,2);}
 // Fast travel from the map to the places already entered: beside their portal, free.
 function travel(id){if(!active())return false;const s=spots().find(q=>q.id===id);if(!s||!data().seen[id])return false;const p=besidePortal(s,center()||s);runtime.S.wx=p.x;runtime.S.wy=p.y;runtime.narrate?.('travel');runtime.enterFx=1;$('mJournal')&&($('mJournal').hidden=true);runtime.save?.();return true;}
 function travelList(){const box=$('ringTravel');if(!box)return;const d=data(),seen=active()?PLACES.filter(p=>d.seen[p.id]):[];box.hidden=!seen.length;box.innerHTML=seen.length?'<h3>Ir a</h3><div class="row"></div>':'';
  const row=box.querySelector('.row');for(const p of seen){const b=document.createElement('button');b.textContent=`${p.name} ${'★'.repeat(stars(p.id).filter(Boolean).length)}`.trim();b.onclick=()=>travel(p.id);row.appendChild(b);}}
 // Leaving a round from the menu: only shown while a round is being played.
 const leave=$('bLeavePlace');if(leave){leave.onclick=()=>{$('mMenu')&&($('mMenu').hidden=true);runtime.abandonPlace?.();};$('bMenu')?.addEventListener('click',()=>{leave.hidden=!runtime.placeRun?.();});}
 // The portals for the map: where each is, and whether it is open, with its stars.
 function forMap(){if(!data()||!freeOpen(runtime.S.journey))return [];const d=data();return spots().map(s=>({...s,name:name(s.id),open:placeOpen(d,s.id,runtime.S.journey),stars:stars(s.id).filter(Boolean).length}));}
 Object.defineProperties(runtime,{drawPlacesRing:{get:()=>draw},ringMusicStep:{get:()=>musicStep},ringPortals:{get:()=>forMap},ringTravel:{get:()=>travel},ringGo:{get:()=>go},renderRingTravel:{get:()=>travelList},
  ringState:{get:()=>()=>({center:center(),spots:spots().map(s=>({...s})),next:nextPortal(spots(),data(),runtime.S.journey,{x:runtime.S.wx,y:runtime.S.wy})?.id||null,active:active()})}});
}
