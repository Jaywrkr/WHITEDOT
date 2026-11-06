import {openSurface,prefersReducedMotion} from './frame-state.js';
import {PLACES,PLACE_IDS,placeOpen,nextGoal,previousPlace,complete,placeFound,placeKm,placeRadius,kmText} from './places.js';
import {freeOpen} from './journey-mode.js';
import {directionPan} from './spatial.js';
import {formatDistance} from './player-profile-model.js';
import {initialize as ritmo} from './ritmo.js';
import {initialize as tranquilo} from './tranquilo.js';
import {initialize as duos} from './duos.js';
import {initialize as frontier} from './frontier.js';
// The eleven portals (plan F5, docs/MUNDO.md). Each portal sounds on the bar's «1», louder as you come near. Panel 10
// (P7, D4): an open portal is white; a complete one takes the colour of its place; gold is only for its stars.
// «Los lugares te encuentran» (Jay, 5 Nov 2026, alpha.264) and «Directo mundo abierto» (alpha.269): there is no ring.
// Every place, Llanura included, is found by distance: the first time you cross its distance from the origin on foot
// (PLACE_KM), its portal is fixed FOUND_AHEAD in front of you, on your heading, and saved (S.lugares.found). If you are
// already past the next place's distance (an old save, a jump), it is fixed ahead at your next step. A jump is not a
// crossing. The places an old save had on the ring were moved to their distance by the save's migration (places.js,
// version 4). The edge-arrow layer points to the next place not complete whose portal exists, with the «lugar» icon;
// before that, the line under the HUD says it is farther, at N km. The runtime names (ringState, ringGuide…) stay for
// the tests and the readers that call them. «Niveles en orden» (Jay, 6 Nov 2026, frontier.js): the next place without ★
// calls you at its distance and its round starts by itself; you cannot walk past it until its ★.
export const PORTAL_REACH=40,PORTAL_HEAR=1800;
// Plan H6: the next portal is heard from far, softly, on the bar's «3», from its side.
export const NEXT_HEAR=9600,NEXT_STEP=8;
// How far ahead a portal found by distance appears (150 m, about 8 s on foot), and the longest step that still counts
// as walking (a longer one is a jump or a round's return).
export const FOUND_AHEAD=1500,FOUND_SEA_STEP=300,FOUND_SEA_TRIES=6,FOUND_JUMP=1200;
// Which places a step from `from` to `to` fixes: the ones whose distance it crosses (out or in), and the next place not
// complete when you are already past its distance. Never one already found.
export function crossings(from,to,places){if(!from||!to)return [];const step=Math.hypot(to.x-from.x,to.y-from.y);if(!(step>.5)||step>FOUND_JUMP)return [];
 const r0=Math.hypot(from.x,from.y),r1=Math.hypot(to.x,to.y),next=PLACES.find(p=>p.game&&!complete(places,p.id));
 return PLACES.filter(p=>{if(!p.game||placeFound(places,p.id))return false;const R=placeRadius(p.id);return (r0<R)!==(r1<R)||p===next&&r1>=R;}).map(p=>p.id);}
// Where a found portal stands: FOUND_AHEAD on the heading from `at`; off the sea a few steps farther when it can.
export function foundSpot(at,heading,isSea=()=>false){const n=Math.hypot(heading.x,heading.y)||1,h={x:heading.x/n,y:heading.y/n},q=k=>({x:Math.round(at.x+h.x*(FOUND_AHEAD+k*FOUND_SEA_STEP)),y:Math.round(at.y+h.y*(FOUND_AHEAD+k*FOUND_SEA_STEP))});
 for(let k=0;k<=FOUND_SEA_TRIES;k++){const p=q(k);if(!isSea(p.x,p.y))return p;}return q(0);}
// The portals that exist in a save, in the order of PLACES: the ones found by distance (or moved there in version 4).
export function placedSpots(places){return PLACES.map(p=>{const f=places?.found?.[p.id];return f&&Number.isFinite(f.x)&&Number.isFinite(f.y)?{id:p.id,x:f.x,y:f.y,found:true}:null;}).filter(Boolean);}
// Before its portal exists: the next place not complete, its name and its distance from the origin (km).
export function placeHint(spots,places,journey){if(!freeOpen(journey)||places?.readOnly)return null;const p=PLACES.find(q=>q.game&&!complete(places,q.id));if(!p||spots.some(q=>q.id===p.id))return null;return {id:p.id,name:p.name,km:placeKm(p.id)};}
// The Duelo final (ritmo.js) is at the origin, the centre the eleven distances are measured from; off the sea along
// the north, then the other seven directions, a step at a time.
export const ORIGIN_STEP=300,ORIGIN_TRIES=12;
export function originSpot(isSea=()=>false){if(!isSea(0,0))return {x:0,y:0};for(let k=1;k<=ORIGIN_TRIES;k++)for(let i=0;i<8;i++){const a=-Math.PI/2+i/8*2*Math.PI,q={x:Math.round(Math.cos(a)*k*ORIGIN_STEP),y:Math.round(Math.sin(a)*k*ORIGIN_STEP)};if(!isSea(q.x,q.y))return q;}return {x:0,y:0};}
// How loud the beacon of the next portal is at a distance: a floor far away, more as you come near; 0 beyond its reach.
export const beaconGain=d=>d>=NEXT_HEAR?0:.012+.04*(1-d/NEXT_HEAR)**2;
// Notes of the portals, a pentatonic over two octaves: each place has its own.
export const PORTAL_NOTES=Object.freeze([0,2,4,7,9,12,14,16,19,21,24]);
// Tests only («?anillo=1», «?lugar=», chapter-test.js): eleven spots around an anchor, TEST_RADIUS away, so a test can
// walk to any portal. They are saved as found portals; the game itself never draws a ring.
export const TEST_RADIUS=6000,TEST_SEA_STEP=300,TEST_SEA_TRIES=6;
export function portalSpots(center,isSea=()=>false){return PLACES.map((p,i)=>{const a=-Math.PI/2+i/PLACES.length*2*Math.PI,at=r=>({x:Math.round(center.x+Math.cos(a)*r),y:Math.round(center.y+Math.sin(a)*r)});
 for(let k=0;k<=TEST_SEA_TRIES*2;k++){const q=at(TEST_RADIUS+(k%2?1:-1)*Math.ceil(k/2)*TEST_SEA_STEP);if(!isSea(q.x,q.y))return {id:p.id,...q};}return {id:p.id,...at(TEST_RADIUS)};});}
// Where the column of the next portal stands when the portal is off screen: at the edge on its side (plan I2).
export function routeEdge(dx,dy,W,H){const cx=W/2,cy=H/2,top=Math.min(144,H*.28),bottom=Math.max(top+32,H-148),rx=Math.max(1,cx-24),ry=dy<0?Math.max(1,cy-top):Math.max(1,bottom-cy),k=Math.min(1,rx/Math.max(1,Math.abs(dx)),ry/Math.max(1,Math.abs(dy)));return {x:cx+dx*k,y:cy+dy*k,angle:Math.atan2(dy,dx)};}
// A quiet compass around the small cube, outside its body and ordinary pulse frames, toward a mark of the universe map
// (since alpha.269 a place is shown by the edge-arrow layer, not by the compass). Only a drawing: no hit region.
export function routeCompass(dx,dy,W,H,offset={x:0,y:0}){const angle=Math.atan2(dy,dx),r=Math.min(48,W*.16,H*.16);return {x:W/2+offset.x+Math.cos(angle)*r,y:H/2+offset.y+Math.sin(angle)*r,angle};}
// Off screen, the light stands on the edge where the heading crosses it: x on that edge, y at the height of the heading
// (kept a band away from the corners), so it reads as a light on your side, not a stripe painted down the screen.
export function edgeColumn(x,y,W,H,m=12,band=70){const dx=x-W/2,dy=y-H/2,t=Math.min(dx?(W/2-m)/Math.abs(dx):Infinity,dy?(H/2-m)/Math.abs(dy):Infinity),k=Number.isFinite(t)?Math.min(1,t):0;
 return {x:Math.max(m,Math.min(W-m,x)),y:Math.max(band,Math.min(H-band,H/2+dy*k))};}
// The portal the column shows: the next place on the path; once the eleven are complete (panel 10, P4, D1), the place
// without ★★ with the best share on time (then ★★★); none with the 33 ★.
// Since alpha.264, a place not found yet has no portal. «Niveles en orden» (frontier.js): then none, not a later place
// past the frontier; the line under the HUD says how far the next one is.
export function nextPortal(spots,places,journey,from){const path=nextGoal(places,journey);if(!path)return null;return spots.find(q=>q.id===path.id)||null;}
// Where you stand when you come back from a round: a step from the portal, toward the origin, outside its reach.
export function besidePortal(spot,toward={x:0,y:0}){let dx=toward.x-spot.x,dy=toward.y-spot.y,d=Math.hypot(dx,dy);if(!(d>0)){dx=0;dy=1;d=1;}return {x:Math.round(spot.x+dx/d*PORTAL_REACH*3),y:Math.round(spot.y+dy/d*PORTAL_REACH*3)};}
export function initialize(runtime){
 const $=id=>runtime.$?.(id),calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 let cache=null,inside=null,said=null,target=null,owner=null,walked=null;
 const data=()=>runtime.placesData?.();
 const name=id=>PLACES.find(p=>p.id===id)?.name||id;
 function active(){const S=runtime.S;return !!(S&&runtime.inWorld?.()&&S.mode==='world'&&(S.layer||'superficie')==='superficie'&&freeOpen(S.journey)&&!runtime.placeRun?.()&&!runtime.journeyFinaleState?.().running&&data());}
 // Tests only: the anchor of the test layout (portalSpots), the Refugio or where you stood when it was first filled;
 // kept in the test save (S.testAnchor, only on «?anillo=1» / «?lugar=», which play on a save of their own).
 function testAnchor(){const S=runtime.S,q=S.testAnchor;if(q&&Number.isFinite(q.x)&&Number.isFinite(q.y))return {x:q.x,y:q.y};const st=S.studio,p=st&&Number.isFinite(st.x)&&Number.isFinite(st.y)?{x:Math.round(st.x),y:Math.round(st.y)}:{x:Math.round(S.wx),y:Math.round(S.wy)};S.testAnchor=p;return {...p};}
 // T0 (Kubono coherente, bug 11): while a round's card waits for its drop, no route yet: it moves on once the card is there.
 function route(){if(owner!==runtime.S){owner=runtime.S;target=null;}if(!active()||runtime.S.destination||runtime.placeCardDue?.())return null;
  // Mapa del universo (alpha.235): while there is a mark, the compass and the line under the HUD lead to it.
  const mark=runtime.mapMarkRoute?.();if(mark)return {...mark,mark:true};const d=data(),next=nextPortal(spots(),d,runtime.S.journey),aim=target&&spots().find(s=>s.id===target&&placeOpen(d,s.id,runtime.S.journey)&&!stars(s.id)[0])||next;if(!aim)return null;return {...aim,name:name(aim.id),dx:aim.x-runtime.S.wx,dy:aim.y-runtime.S.wy,distance:Math.hypot(aim.x-runtime.S.wx,aim.y-runtime.S.wy)};}
 function guide(id,{say=false}={}){for(const key of ['mMenu','mLugares','mPlace','mGuide'])if($(key))$(key).hidden=true;if(runtime.houseActive?.())runtime.exitHouse?.();if(runtime.S.mode==='camino'&&freeOpen(runtime.S.journey))runtime.enterWorld?.({automatic:true});if(!active())return false;const aim=spots().find(s=>s.id===(id||nextPortal(spots(),data(),runtime.S.journey)?.id)&&placeOpen(data(),s.id,runtime.S.journey));
  // «Niveles en orden»: with no portal yet, the way is to walk out; with nothing left on the path, explore. A button the
  // player pressed (say) is never silent; the end of the Journey's finale asks quietly.
  if(!aim){if(!say)return false;const h=placeHint(spots(),data(),runtime.S.journey);runtime.toast?.(h?`Camina recto. ${h.name} está a ${kmText(h.km)} km.`:'Explora a tu ritmo.',{force:true});return false;}if(runtime.S.destination)runtime.cancelDestination?.();runtime.clearMapMark?.();owner=runtime.S;target=aim.id;runtime.stopAutopilot?.();return true;}

 const sea=(x,y)=>!!runtime.regionOfPos?.(x,y)?.sea;
 let testFilled=null;
 // «?anillo=1» / «?lugar=» (chapter-test.js): every portal not placed yet is found at its spot of the test layout.
 function testFill(d){if(!runtime.ringTestFound||testFilled===runtime.S||d.readOnly)return;testFilled=runtime.S;let added=false;d.found||={};for(const s of portalSpots(testAnchor(),sea))if(!placeFound(d,s.id)){d.found[s.id]={x:s.x,y:s.y};added=true;}if(added)runtime.save?.();}
 function spots(){const d=data();if(!d)return [];testFill(d);const key=JSON.stringify(d.found||{});if(!cache||cache.key!==key)cache={key,spots:placedSpots(d)};return cache.spots;}
 // A step on foot: the places whose distance it crosses get their portal, ahead of you, kept in the save.
 function discover(){const S=runtime.S,d=data(),to={x:S.wx,y:S.wy},from=walked;walked=to;if(!d||d.readOnly||!from)return;const ids=crossings(from,to,d);if(!ids.length)return;
  const before=JSON.stringify(d.found||{}),heading={x:to.x-from.x,y:to.y-from.y};d.found||={};for(const id of ids)d.found[id]=foundSpot(to,heading,sea);
  if(runtime.save?.()===false){d.found=JSON.parse(before);return;}cache=null;if(!runtime.frontierCalls?.(ids[0]))runtime.toast?.(`Una señal: ${name(ids[0])}.`);}
 const stars=id=>data()?.stars?.[id]||[false,false,false];
 // Into a portal: a round; with its ★★, first the choice of the Maestro one.
 function enter(spot){const d=data(),from=besidePortal(spot);if(!placeOpen(d,spot.id,runtime.S.journey)){if(d?.readOnly||d?.version>4){if(said!==spot.id){said=spot.id;runtime.toast?.('Estos lugares necesitan una versión más reciente.',{force:true});}return;}const p=PLACES.find(x=>x.id===spot.id),prev=PLACES.find(x=>x.id===previousPlace(spot.id));if(said!==spot.id){said=spot.id;runtime.toast?.(p.game&&prev?`${p.name} se abre al completar ${prev.name}.`:`${p.name}: pronto.`,{force:true});}runtime.narrate?.('locked');return;}
  d.seen[spot.id]=true;runtime.narrate?.('portal');if(stars(spot.id)[0]){choose(spot.id,from);return;}runtime.startPlace?.(spot.id,{from});}
 function choose(id,from){const box=$('mPortal');if(!box){runtime.startPlace?.(id,{from});return;}$('portalTitle').textContent=name(id);$('portalStars').innerHTML=stars(id).map(x=>`<span class="${x?'got':''}">★</span>`).join('');
  // A place already complete offers its round, the Maestro one once it has ★★, and Libre: its music with no bar or stars.
  const go=opts=>{box.hidden=true;runtime.startPlace?.(id,{...opts,from});};$('portalPlay').onclick=()=>go({});$('portalMaestro').hidden=!stars(id)[1]||!!runtime.tranquilo?.();$('portalMaestro').onclick=()=>go({maestro:true});if($('portalFree'))$('portalFree').onclick=()=>go({free:true});
  // Ritmo (alpha.237): Eco, the place from memory, once it is complete (ritmo.js).
  const echo=$('portalEcho');if(echo){echo.hidden=!runtime.ritmoEchoOffered?.(id);echo.onclick=()=>{box.hidden=true;runtime.ritmoStartEcho?.(id,{from});};}
  // Con Luca (alpha.239, duos.js): a challenge for two, with its own sheet (who plays, the mark); Maestro waits while the
  // calm mode is on (tranquilo.js: it would give no ★★★).
  const duo=$('portalDuo');if(duo){duo.hidden=!runtime.duoOffered?.(id);duo.onclick=()=>{box.hidden=true;runtime.duoOpen?.({id,from});};}$('portalClose').onclick=()=>{box.hidden=true;};box.hidden=false;}
 // Straight to a portal and into its round: the card's «Siguiente».
 function go(id){if(!active())return false;const s=spots().find(q=>q.id===id);if(!s||!placeOpen(data(),id,runtime.S.journey))return false;const from=besidePortal(s);runtime.S.wx=from.x;runtime.S.wy=from.y;inside=id;data().seen[id]=true;runtime.enterFx=1;return runtime.startPlace?.(id,{from});}
 function tick(){if(!active()){inside=null;walked=null;return;}discover();
  // A sheet open keeps the portal you stand in: closing its card must not open it again (alpha.256).
  if(openSurface('.modal:not([hidden])'))return;const S=runtime.S,near=spots().find(s=>Math.hypot(s.x-S.wx,s.y-S.wy)<PORTAL_REACH);
  // A portal acts once each time you walk into it.
  if(near&&inside!==near.id){inside=near.id;enter(near);}else if(!near){inside=null;said=null;}}
 // The colour of a portal: its place's once complete, white while open, grey while closed.
 const rgba=(hex,a)=>{const n=parseInt(hex.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;};
 function portalInk(id,open,d=data()){return !open?'#8a8a8f':complete(d,id)?runtime.earnedColor?.(id)||'#ffffff':'#ffffff';}
 // A star drawn, not written: the quiet screen of the Journey draws no words in the World (journey-mode.js).
 function star(c,x,y,r){c.beginPath();for(let i=0;i<10;i++){const q=i%2?r*.45:r,a=i/10*6.283-Math.PI/2;i?c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q):c.moveTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.closePath();c.fill();}
 // The portals on screen and, when the next one is not in view, a soft light at the edge on its side.
 function draw(c,W,H,t){tick();const info=$('ringRoute'),aim=route(),hint=!aim&&active()&&!runtime.S.destination&&!runtime.placeCardDue?.()?placeHint(spots(),data(),runtime.S.journey):null,visible=!!(aim||hint)&&!openSurface('.modal:not([hidden])'),offset=runtime.cameraOffset?.()||{x:0,y:0};if(info){info.hidden=!visible;if(visible){info.textContent=aim?`${aim.name} · ${formatDistance(aim.distance)}`:`${hint.name} · más lejos · ${kmText(hint.km)} km`;info.style.setProperty('--route-x',offset.x+'px');info.style.setProperty('--route-y',offset.y+'px');}}if(!active()||openSurface('.modal:not([hidden])'))return;const S=runtime.S,d=data(),cx=runtime.camX??S.wx,cy=runtime.camY??S.wy,still=calm(),gold=runtime.GOLD||'#f0d27a';c.save();
  for(const s of spots()){const x=W/2+s.x-cx,y=H/2+s.y-cy;if(x<-80||x>W+80||y<-80||y>H+80)continue;const open=placeOpen(d,s.id,S.journey),r=24,turn=still?0:t/700;
   const ink=portalInk(s.id,open,d);
   if(open){const g=c.createRadialGradient(x,y,0,x,y,r*2.4);g.addColorStop(0,rgba(ink,complete(d,s.id)?.32:.16));g.addColorStop(1,rgba(ink,0));c.globalAlpha=1;c.fillStyle=g;c.fillRect(x-r*2.4,y-r*2.4,r*4.8,r*4.8);}
   c.strokeStyle=ink;c.lineWidth=1.5;for(let i=0;i<3;i++){c.globalAlpha=(open?.9:.45)-i*.2;c.beginPath();c.arc(x,y,r*(1-i*.25),turn+i,turn+i+Math.PI*1.6);c.stroke();}
   // Open: its three stars below, gold the ones won. Closed: a grey ring and star; it opens when the one before is complete.
   const p=PLACES.find(q=>q.id===s.id);c.globalAlpha=1;if(open)stars(s.id).forEach((g,i)=>{c.fillStyle=g?gold:'#ffffff40';star(c,x+(i-1)*14,y+r+14,5.5);});
   else{c.globalAlpha=.25;c.strokeStyle='#ffffff';c.lineWidth=2;c.beginPath();c.arc(x,y,r+7,0,6.283);c.stroke();c.globalAlpha=.6;c.fillStyle='#8a8a8f';star(c,x,y,6);}
   // With «Todo a la vista», its name and what it asks are written too.
   c.globalAlpha=1;c.textAlign='center';c.textBaseline='top';c.font='12px "Geist Mono", monospace';c.fillStyle=open?'#ffffff':'#8a8a8f';c.fillText(p.name,x,y+r+(open?24:14));}
  runtime.drawRitmoRing?.(c,W,H,t);runtime.drawFrontier?.(c,W,H,t);
  const next=!S.destination&&nextPortal(spots(),d,S.journey,{x:S.wx,y:S.wy});if(next){const x=W/2+next.x-cx,y=H/2+next.y-cy;
   // The next place on the path: a column of white light over its portal (a state, not something earned). Plan I2: seen from anywhere; off screen the
   // column stands at the edge on its side (it replaces the old arrow), fainter the farther the portal is.
   const col=(cx2,from,to,a)=>{const g=c.createLinearGradient(cx2,from,cx2,to);g.addColorStop(0,'rgba(255,255,255,.3)');g.addColorStop(1,'rgba(255,255,255,0)');c.globalAlpha=a*(still?.8:.7+.3*Math.sin(t/600));c.fillStyle=g;c.fillRect(cx2-9,Math.min(from,to),18,Math.abs(to-from));};
   // Off screen (alpha.264): one arrow of the edge layer, with the «lugar» icon and its distance (it replaces the glow).
   if(x>-60&&x<W+60&&y>-40&&y<H+40)col(x,Math.min(H,y),Math.max(0,y-H),1);
   else runtime.edgeOffer?.({key:'lugar:'+next.id,kind:'lugar',x:next.x,y:next.y,shape:'lugar',label:formatDistance(Math.hypot(next.x-S.wx,next.y-S.wy))});}
  if(aim?.mark&&!runtime.firstJourneyState?.next){const e=routeCompass(aim.dx,aim.dy,W,H,offset);c.save();c.translate(e.x,e.y);c.rotate(e.angle);c.globalAlpha=.8;c.strokeStyle='#fff';c.lineWidth=1.5;c.beginPath();c.moveTo(-7,-5);c.lineTo(1,0);c.lineTo(-7,5);c.stroke();c.restore();}
  c.restore();}
 // On each bar's «1», the nearest portal sounds its note, louder the closer you are; a closed one, softer.
 // Each from its side (plan H6), so a portal off screen can be found by ear.
 const sounds=[];
 function sound(spot,index,time,v){const S=runtime.S,emit=()=>runtime.pluck(60+(runtime.MU?.tr||0)+PORTAL_NOTES[index],time,v,2),pan=directionPan(spot,S.wx,S.wy,900);
  sounds.push({id:spot.id,time,v,pan});if(sounds.length>16)sounds.shift();return runtime.withPan?runtime.withPan(pan,emit):emit();}
 function musicStep(step,time){runtime.ritmoMusicStep?.(step,time);if((step!==0&&step!==NEXT_STEP)||!runtime.S.sound||!active()||!runtime.pluck)return;const S=runtime.S;
  if(step===NEXT_STEP){const next=nextPortal(spots(),data(),S.journey);if(!next)return;const d=Math.hypot(next.x-S.wx,next.y-S.wy);if(d<PORTAL_HEAR*.5)return;const v=beaconGain(d);if(v>0)sound(next,PLACE_IDS.indexOf(next.id),time,v);return;}
  let best=null,far=PORTAL_HEAR,index=0;spots().forEach(s=>{const d=Math.hypot(s.x-S.wx,s.y-S.wy);if(d<far){far=d;best=s;index=PLACE_IDS.indexOf(s.id);}});if(!best)return;
  const near=1-far/PORTAL_HEAR,open=placeOpen(data(),best.id,S.journey);sound(best,index,time,(open?.09:.035)*near*near);}
 // Fast travel from the map to the places already entered: beside their portal, free. Jay (27 Oct 2026, alpha.226):
 // far away (beyond where its next portal is heard) the next place on the path can be reached the same way, so a jump
 // never leaves you far, far away from it.
 function far(id){const s=spots().find(q=>q.id===id),next=nextPortal(spots(),data(),runtime.S.journey);return !!(s&&next&&next.id===id&&Math.hypot(s.x-runtime.S.wx,s.y-runtime.S.wy)>=NEXT_HEAR);}
 // The origin: the Duelo final's spot (ritmo.js) and «Volver al origen» from a satellite (recorrer.js). Going there is
 // the same move as any travel (practice-travel.js), so «Volver al punto anterior» brings you back. Since alpha.269
 // there is no ring and no «Volver al anillo».
 const originPoint=()=>active()?{...originSpot(sea),layer:'superficie'}:null;
 function originHome(){if(runtime.houseActive?.())runtime.exitHouse?.();if(runtime.S.mode==='camino'&&freeOpen(runtime.S.journey))runtime.enterWorld?.({automatic:true});const o=originPoint();if(!o)return false;if(runtime.S.destination)runtime.cancelDestination?.();const p={x:o.x,y:o.y+160,layer:'superficie'};
  const moved=runtime.travelPracticePoint?runtime.travelPracticePoint(p):(()=>{const was={wx:runtime.S.wx,wy:runtime.S.wy};runtime.S.wx=p.x;runtime.S.wy=p.y;if(runtime.save?.()===false){Object.assign(runtime.S,was);return false;}return true;})();
  if(!moved)return false;owner=runtime.S;target=null;inside=null;runtime.enterFx=1;runtime.narrate?.('travel');return true;}
 // «Niveles en orden» (frontier.js): never to a portal past the frontier.
 const within=id=>{const s=spots().find(q=>q.id===id);return !s||Math.hypot(s.x,s.y)<=(runtime.frontierRadius?.()??Infinity);};
 const canTravel=id=>!!(active()&&placeOpen(data(),id,runtime.S.journey)&&(data().seen[id]||stars(id)[0]||far(id))&&within(id));
 function travel(id){if(!active())return false;const s=spots().find(q=>q.id===id);if(!s||!canTravel(id))return false;const p=besidePortal(s);runtime.S.wx=p.x;runtime.S.wy=p.y;runtime.narrate?.('travel');runtime.enterFx=1;$('mJournal')&&($('mJournal').hidden=true);runtime.save?.();return true;}
 function travelList(){const box=$('ringTravel');if(!box)return;const d=data(),placed=spots(),seen=active()?PLACES.filter(p=>(d.seen[p.id]||stars(p.id)[0])&&placed.some(s=>s.id===p.id)):[];box.hidden=!seen.length;box.innerHTML=seen.length?'<h3>Ir a</h3><div class="row"></div>':'';
  const row=box.querySelector('.row');for(const p of seen){const b=document.createElement('button');b.textContent=`${p.name} ${'★'.repeat(stars(p.id).filter(Boolean).length)}`.trim();b.onclick=()=>travel(p.id);row.appendChild(b);}}
 // Leaving a round from the menu: only shown while a round is being played.
 const leave=$('bLeavePlace');if(leave){leave.onclick=()=>{$('mMenu')&&($('mMenu').hidden=true);if(runtime.ritmoDuelActive?.())runtime.ritmoDuelQuit?.();else runtime.abandonPlace?.();};$('bMenu')?.addEventListener('click',()=>{leave.hidden=!runtime.placeRun?.()&&!runtime.ritmoDuelActive?.();});}
 // The portals for the map: where each is, and whether it is open, with its stars.
 function forMap(){if(!data()||!freeOpen(runtime.S.journey))return [];const d=data();return spots().map(s=>{const open=placeOpen(d,s.id,runtime.S.journey);return {...s,name:name(s.id),open,complete:complete(d,s.id),ink:portalInk(s.id,open,d),stars:stars(s.id).filter(Boolean).length};});}
 ritmo(runtime);tranquilo(runtime);duos(runtime);frontier(runtime);
 Object.defineProperties(runtime,{drawPlacesRing:{get:()=>draw},ringMusicStep:{get:()=>musicStep},ringPortals:{get:()=>forMap},ringTravel:{get:()=>travel},ringCanTravel:{get:()=>canTravel},ringGo:{get:()=>go},ringGuide:{get:()=>guide},ringRoute:{get:()=>route},renderRingTravel:{get:()=>travelList},
  originSpot:{get:()=>originPoint},ringActive:{get:()=>active},originHome:{get:()=>originHome},
  ringState:{get:()=>()=>({anchor:runtime.ringTestFound?testAnchor():null,spots:spots().map(s=>({...s,ink:portalInk(s.id,placeOpen(data(),s.id,runtime.S.journey))})),next:nextPortal(spots(),data(),runtime.S.journey,{x:runtime.S.wx,y:runtime.S.wy})?.id||null,hint:active()?placeHint(spots(),data(),runtime.S.journey):null,found:{...(data()?.found||{})},moved:Object.keys(data()?.moved||{}),active:active()})},ringHint:{get:()=>()=>active()?placeHint(spots(),data(),runtime.S.journey):null},ringSounds:{get:()=>()=>sounds.map(s=>({...s}))}});
}
