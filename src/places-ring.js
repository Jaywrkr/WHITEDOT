import {openSurface,prefersReducedMotion} from './frame-state.js';
import {PLACES,placeOpen,starCount,nextOnPath,previousPlace} from './places.js';
import {freeOpen} from './journey-mode.js';
import {directionPan} from './spatial.js';
import {formatDistance} from './player-profile-model.js';
// The ring (plan F5, docs/MUNDO.md): the eleven places as gold portals around the Refugio, about half a minute's walk
// from its door. Each portal sounds on the bar's «1», louder as you come near; a closed one shows the stars it asks for.
// An arrow at the edge of the screen points to the next place on the path (plan H3: in order, like the tracks of a
// record), a column of gold light stands over its portal, and the map shows them all.
// The ring keeps its migrated anchor even when the portable Refugio moves.
export const RING_RADIUS=6000,PORTAL_REACH=40,PORTAL_HEAR=1800,RING_SEA_STEP=300,RING_SEA_TRIES=6;
// Plan H6: the next portal on the path is heard from the Refugio and beyond, softly, on the bar's «3», from its side.
export const NEXT_HEAR=RING_RADIUS*1.6,NEXT_STEP=8;
// How loud the beacon of the next portal is at a distance: a floor far away, more as you come near; 0 beyond its reach.
export const beaconGain=d=>d>=NEXT_HEAR?0:.012+.04*(1-d/NEXT_HEAR)**2;
// Notes of the portals, a pentatonic over two octaves: each place has its own.
export const PORTAL_NOTES=Object.freeze([0,2,4,7,9,12,14,16,19,21,24]);
// Each portal at a fixed angle, from the north clockwise; a spot at sea moves along its ray, out and in, to land.
export function portalSpots(center,isSea=()=>false){return PLACES.map((p,i)=>{const a=-Math.PI/2+i/PLACES.length*2*Math.PI,at=r=>({x:Math.round(center.x+Math.cos(a)*r),y:Math.round(center.y+Math.sin(a)*r)});
 for(let k=0;k<=RING_SEA_TRIES*2;k++){const q=at(RING_RADIUS+(k%2?1:-1)*Math.ceil(k/2)*RING_SEA_STEP);if(!isSea(q.x,q.y))return {id:p.id,...q};}return {id:p.id,...at(RING_RADIUS)};});}
// Where the column of the next portal stands when the portal is off screen: at the edge on its side (plan I2).
export function routeEdge(dx,dy,W,H){const cx=W/2,cy=H/2,top=Math.min(144,H*.28),bottom=Math.max(top+32,H-148),rx=Math.max(1,cx-24),ry=dy<0?Math.max(1,cy-top):Math.max(1,bottom-cy),k=Math.min(1,rx/Math.max(1,Math.abs(dx)),ry/Math.max(1,Math.abs(dy)));return {x:cx+dx*k,y:cy+dy*k,angle:Math.atan2(dy,dx)};}
export function edgeColumn(x,y,W,H,m=12){return {x:Math.max(m,Math.min(W-m,x))};}
// The portal the arrow shows: the nearest open place never entered, or still without its ★; none once all are done.
export function nextPortal(spots,places,journey,from){const path=nextOnPath(places,journey);return path&&spots.find(q=>q.id===path.id)||null;}
// Where you stand when you come back from a round: a step from the portal, toward the Refugio, outside its reach.
export function besidePortal(spot,center){const d=Math.hypot(center.x-spot.x,center.y-spot.y)||1;return {x:Math.round(spot.x+(center.x-spot.x)/d*PORTAL_REACH*3),y:Math.round(spot.y+(center.y-spot.y)/d*PORTAL_REACH*3)};}
export function initialize(runtime){
 const $=id=>runtime.$?.(id),calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 let cache=null,inside=null,said=null,target=null,owner=null;
 const data=()=>runtime.placesData?.();
 const name=id=>PLACES.find(p=>p.id===id)?.name||id;
 function active(){const S=runtime.S;return !!(S&&runtime.inWorld?.()&&S.mode==='world'&&(S.layer||'superficie')==='superficie'&&freeOpen(S.journey)&&!runtime.placeRun?.()&&!runtime.journeyFinaleState?.().running&&data());}
 // The Refugio is the centre; before the first one, the spot where the free World opened, kept in the save.
 function center(){const S=runtime.S,d=data();if(!d)return null;if(d.ringFixed&&d.center)return d.center;
  const st=S.studio,p=st&&Number.isFinite(st.x)&&Number.isFinite(st.y)?{x:Math.round(st.x),y:Math.round(st.y)}:d.center||{x:Math.round(S.wx),y:Math.round(S.wy)};
  if(d.readOnly)return p;const before=d.center,fixed=d.ringFixed;d.center=p;d.ringFixed=true;if(runtime.save?.()===false){d.center=before;d.ringFixed=fixed;}return p;}
 function route(){if(owner!==runtime.S){owner=runtime.S;target=null;}if(!active())return null;const d=data(),next=nextPortal(spots(),d,runtime.S.journey),aim=target&&spots().find(s=>s.id===target&&placeOpen(d,s.id,runtime.S.journey)&&!stars(s.id)[0])||next;if(!aim)return null;return {...aim,name:name(aim.id),dx:aim.x-runtime.S.wx,dy:aim.y-runtime.S.wy,distance:Math.hypot(aim.x-runtime.S.wx,aim.y-runtime.S.wy)};}
 function guide(id){for(const key of ['mMenu','mLugares','mPlace','mGuide'])if($(key))$(key).hidden=true;if(runtime.houseActive?.())runtime.exitHouse?.();if(runtime.S.mode==='camino'&&freeOpen(runtime.S.journey))runtime.enterWorld?.({automatic:true});if(!active())return false;const aim=spots().find(s=>s.id===(id||nextPortal(spots(),data(),runtime.S.journey)?.id)&&placeOpen(data(),s.id,runtime.S.journey));if(!aim)return false;owner=runtime.S;target=aim.id;runtime.stopAutopilot?.();return true;}

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
 function draw(c,W,H,t){tick();const info=$('ringRoute'),aim=route(),visible=!!aim&&!openSurface('.modal:not([hidden])');if(info){info.hidden=!visible;if(visible)info.textContent=`${aim.name} · ${formatDistance(aim.distance)}`;}if(!active()||openSurface('.modal:not([hidden])'))return;const S=runtime.S,d=data(),cx=runtime.camX??S.wx,cy=runtime.camY??S.wy,still=calm(),gold=runtime.GOLD||'#f0d27a';c.save();
  for(const s of spots()){const x=W/2+s.x-cx,y=H/2+s.y-cy;if(x<-80||x>W+80||y<-80||y>H+80)continue;const open=placeOpen(d,s.id,S.journey),r=24,turn=still?0:t/700;
   if(open){const g=c.createRadialGradient(x,y,0,x,y,r*2.4);g.addColorStop(0,'rgba(240,210,122,.32)');g.addColorStop(1,'rgba(240,210,122,0)');c.globalAlpha=1;c.fillStyle=g;c.fillRect(x-r*2.4,y-r*2.4,r*4.8,r*4.8);}
   c.strokeStyle=open?gold:'#8a8a8f';c.lineWidth=1.5;for(let i=0;i<3;i++){c.globalAlpha=(open?.9:.45)-i*.2;c.beginPath();c.arc(x,y,r*(1-i*.25),turn+i,turn+i+Math.PI*1.6);c.stroke();}
   // Open: its three stars below, gold the ones won. Closed: a grey ring and star; it opens when the one before is complete.
   const p=PLACES.find(q=>q.id===s.id);c.globalAlpha=1;if(open)stars(s.id).forEach((g,i)=>{c.fillStyle=g?gold:'#ffffff40';star(c,x+(i-1)*14,y+r+14,5.5);});
   else{c.globalAlpha=.25;c.strokeStyle='#ffffff';c.lineWidth=2;c.beginPath();c.arc(x,y,r+7,0,6.283);c.stroke();c.globalAlpha=.6;c.fillStyle='#8a8a8f';star(c,x,y,6);}
   // With «Todo a la vista», its name and what it asks are written too.
   c.globalAlpha=1;c.textAlign='center';c.textBaseline='top';c.font='12px "Geist Mono", monospace';c.fillStyle=open?'#ffffff':'#8a8a8f';c.fillText(p.name,x,y+r+(open?24:14));}
  const next=nextPortal(spots(),d,S.journey,{x:S.wx,y:S.wy});if(next){const x=W/2+next.x-cx,y=H/2+next.y-cy;
   // The next place on the path: a column of gold light over its portal. Plan I2: seen from anywhere; off screen the
   // column stands at the edge on its side (it replaces the old arrow), fainter the farther the portal is.
   const col=(cx2,from,to,a)=>{const g=c.createLinearGradient(cx2,from,cx2,to);g.addColorStop(0,'rgba(240,210,122,.38)');g.addColorStop(1,'rgba(240,210,122,0)');c.globalAlpha=a*(still?.8:.7+.3*Math.sin(t/600));c.fillStyle=g;c.fillRect(cx2-9,Math.min(from,to),18,Math.abs(to-from));};
   if(x>-60&&x<W+60&&y>-40&&y<H+40)col(x,Math.min(H,y),Math.max(0,y-H),1);
   else{const e=edgeColumn(x,y,W,H),far=Math.hypot(next.x-S.wx,next.y-S.wy);col(e.x,H,0,Math.max(.45,1-far/(RING_RADIUS*2)));}}
  if(aim&&!runtime.firstJourneyState?.next){const e=routeEdge(aim.dx,aim.dy,W,H);c.save();c.translate(e.x,e.y);c.rotate(e.angle);c.globalAlpha=.9;c.strokeStyle='#fff';c.lineWidth=1.5;c.beginPath();c.moveTo(-7,-5);c.lineTo(1,0);c.lineTo(-7,5);c.stroke();c.restore();}
  c.restore();}
 // On each bar's «1», the nearest portal sounds its note, louder the closer you are; a closed one, softer.
 // Each from its side (plan H6), so a portal off screen can be found by ear.
 const sounds=[];
 function sound(spot,index,time,v){const S=runtime.S,emit=()=>runtime.pluck(60+(runtime.MU?.tr||0)+PORTAL_NOTES[index],time,v,2),pan=directionPan(spot,S.wx,S.wy,900);
  sounds.push({id:spot.id,time,v,pan});if(sounds.length>16)sounds.shift();return runtime.withPan?runtime.withPan(pan,emit):emit();}
 function musicStep(step,time){if((step!==0&&step!==NEXT_STEP)||!runtime.S.sound||!active()||!runtime.pluck)return;const S=runtime.S;
  if(step===NEXT_STEP){const next=nextPortal(spots(),data(),S.journey);if(!next)return;const d=Math.hypot(next.x-S.wx,next.y-S.wy);if(d<PORTAL_HEAR*.5)return;const v=beaconGain(d);if(v>0)sound(next,spots().findIndex(q=>q.id===next.id),time,v);return;}
  let best=null,far=PORTAL_HEAR,index=0;spots().forEach((s,i)=>{const d=Math.hypot(s.x-S.wx,s.y-S.wy);if(d<far){far=d;best=s;index=i;}});if(!best)return;
  const near=1-far/PORTAL_HEAR,open=placeOpen(data(),best.id,S.journey);sound(best,index,time,(open?.09:.035)*near*near);}
 // Fast travel from the map to the places already entered: beside their portal, free.
 function travel(id){if(!active())return false;const s=spots().find(q=>q.id===id);if(!s||!placeOpen(data(),id,runtime.S.journey)||!data().seen[id]&&!stars(id)[0])return false;const p=besidePortal(s,center()||s);runtime.S.wx=p.x;runtime.S.wy=p.y;runtime.narrate?.('travel');runtime.enterFx=1;$('mJournal')&&($('mJournal').hidden=true);runtime.save?.();return true;}
 function travelList(){const box=$('ringTravel');if(!box)return;const d=data(),seen=active()?PLACES.filter(p=>d.seen[p.id]||stars(p.id)[0]):[];box.hidden=!seen.length;box.innerHTML=seen.length?'<h3>Ir a</h3><div class="row"></div>':'';
  const row=box.querySelector('.row');for(const p of seen){const b=document.createElement('button');b.textContent=`${p.name} ${'★'.repeat(stars(p.id).filter(Boolean).length)}`.trim();b.onclick=()=>travel(p.id);row.appendChild(b);}}
 // Leaving a round from the menu: only shown while a round is being played.
 const leave=$('bLeavePlace');if(leave){leave.onclick=()=>{$('mMenu')&&($('mMenu').hidden=true);runtime.abandonPlace?.();};$('bMenu')?.addEventListener('click',()=>{leave.hidden=!runtime.placeRun?.();});}
 // The portals for the map: where each is, and whether it is open, with its stars.
 function forMap(){if(!data()||!freeOpen(runtime.S.journey))return [];const d=data();return spots().map(s=>({...s,name:name(s.id),open:placeOpen(d,s.id,runtime.S.journey),stars:stars(s.id).filter(Boolean).length}));}
 Object.defineProperties(runtime,{drawPlacesRing:{get:()=>draw},ringMusicStep:{get:()=>musicStep},ringPortals:{get:()=>forMap},ringTravel:{get:()=>travel},ringGo:{get:()=>go},ringGuide:{get:()=>guide},ringRoute:{get:()=>route},renderRingTravel:{get:()=>travelList},
  ringState:{get:()=>()=>({center:center(),spots:spots().map(s=>({...s})),next:nextPortal(spots(),data(),runtime.S.journey,{x:runtime.S.wx,y:runtime.S.wy})?.id||null,active:active()})},ringSounds:{get:()=>()=>sounds.map(s=>({...s}))}});
}
