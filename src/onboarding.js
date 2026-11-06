import {openSurface} from './frame-state.js';
import {FIRST_JOURNEY_STEPS,OPEN_WORLD_STEPS,normalizeFirstJourney,firstJourneyNext,advanceFirstJourney,lessonAvailable} from './onboarding-model.js';
import {noJourney,caminoPast} from './journey-mode.js';
import {PLACES,placeFound,complete} from './places.js';
export function initialize(runtime){
 const $=runtime.$,panel=$('firstJourney'),GLOBAL_DONE='whitedot:first-journey:v1';let owner=null,anchor=null,last='',replaying=false,start=null,after=null;
 // Listo 1 (alpha.273): a save of the open World that never had the Camino follows OPEN_WORLD_STEPS; the Journey, and
 // any save that had the Camino, keep their six steps as they were (practice included).
 const open=()=>noJourney(runtime.S?.journey)&&!caminoPast(runtime.S),steps=()=>open()?OPEN_WORLD_STEPS:FIRST_JOURNEY_STEPS,nextStep=b=>firstJourneyNext(b,steps());
 function globalDone(){try{return localStorage.getItem(GLOBAL_DONE)==='1';}catch(_){return false;}}
 function rememberDone(){try{localStorage.setItem(GLOBAL_DONE,'1');}catch(_){} }
 function book(){if(owner!==runtime.S){owner=runtime.S;replaying=false;const demo=!!owner.previewSeed&&!runtime.realTravel,experienced=demo||globalDone()||runtime.scopeHadSave&&(!!owner.ach?.mundo||!!owner.help?.creativeVisit);owner.firstJourney=normalizeFirstJourney(owner.firstJourney,{experienced});if(!demo&&!owner.firstJourney.readOnly&&!nextStep(owner.firstJourney))rememberDone();anchor={x:owner.px,y:owner.py};start=after=null;last='';}return owner.firstJourney;}
 function visible(show){if(panel.hidden!==!show)panel.hidden=!show;if(document.body.classList.contains('first-journey')!==show)document.body.classList.toggle('first-journey',show);
  // In the open World the line under the HUD (#ringRoute, «Llanura · más lejos · 0,5 km») stays in view with the guide.
  const world=show&&open();if(document.body.classList.contains('first-journey-open')!==world)document.body.classList.toggle('first-journey-open',world);}
 function event(id){const b=book();if(advanceFirstJourney(b,id,steps())){if(id==='result')after=null;if(!nextStep(b))rememberDone();runtime.save();}}
 // The open World's steps, from the save and the World: where you stand, the first place's portal, its round.
 const first=PLACES.find(p=>p.game);
 function openFacts(s,b){const d=runtime.placesData?.(),run=runtime.placeRun?.(),here={x:s.wx,y:s.wy},away=(a,r)=>!!a&&Math.hypot(here.x-a.x,here.y-a.y)>r;if(!d||!runtime.inWorld())return;start||={...here};
  if(away(start,20))event('move');if(placeFound(d,first.id))event('find');if(run?.id===first.id)event('portal');
  if(complete(d,first.id))event('round');
  // The card closed and a few steps taken, or the next round started: the result is seen. The walk counts from where
  // you stand once the card is gone (the round puts you back beside its portal).
  const card=!!runtime.placeCardDue?.()||!!openSurface('.modal:not([hidden])');
  if(b.facts.round&&!b.facts.result){if(!after&&!run&&!card)after={...here};if(run&&run.id!==first.id||away(after,400))event('result');}
  else if(b.facts.result&&!b.facts.explore){if(!after&&!card)after={...here};if(PLACES.some(p=>p.id!==first.id&&placeFound(d,p.id))||away(after,2000))event('explore');}}
 function openText(id){if(id==='round'&&runtime.placeRun?.()?.id!==first.id)return OPEN_WORLD_STEPS[2][1];return OPEN_WORLD_STEPS.find(([key])=>key===id)[1];}
 function tick(){const s=runtime.S,b=book(),world=open();if(world)openFacts(s,b);else if(s.mode==='camino'&&(Math.hypot(s.px-anchor.x,s.py-anchor.y)>20||(s.pathCrystals?.length||0)>0))event('move');if(!world&&runtime.worldReady())event('light');if(!world&&runtime.inWorld())event('world');
  if(!lessonAvailable(s.journey,replaying)){visible(false);return;}let step=nextStep(b);const blocked=document.hidden||runtime.scanning||!['camino','world'].includes(s.mode)||openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])')||$('voice').classList.contains('expanded');
  if(step&&!world&&s.mode==='camino')step=!runtime.worldReady()?(b.facts.move?['light','Abre el Mundo con diez cristales.']:['move','Arrastra para acercarte a un cristal.']):['world','Entra al Mundo al romper diez cristales.'];
  visible(!!step&&!blocked);if(panel.hidden)return;const next=step,list=steps();
  const text=world?openText(next[0]):next[0]==='voice'&&(!s.sound||runtime.musicVolume()===0)?'Activa el sonido para escuchar este encuentro.':next[1];if(text!==last){$('firstJourneyText').textContent=text;last=text;}const n=list.findIndex(([id])=>id===next[0])+1;const crystals=!world&&s.mode==='camino'&&next[0]==='light';$('firstJourneyProgress').textContent=crystals?Math.min(10,s.pathCrystals?.length||0)+'/10':n+'/'+list.length;$('firstJourneyProgress').setAttribute('aria-label',crystals?(s.pathCrystals?.length||0)+' de 10 cristales rotos':'Paso '+n+' de '+list.length);panel.dataset.step=next[0];document.body.classList.add('first-journey');
 }
 function replay(){if(book().readOnly){runtime.toast('Esta guía requiere una versión más reciente.');return;}runtime.S.firstJourney=normalizeFirstJourney(null);owner=null;book();replaying=true;if(runtime.inWorld()&&!open()){for(const id of ['move','light','world'])event(id);}runtime.noticeLane?.quietRoutine();runtime.quietGuideVoice?.();panel.hidden=false;$('mGuide').hidden=true;tick();}
 function draw(){if(panel.hidden||panel.dataset.step!=='voice'||!runtime.inWorld())return;const s=runtime.S,near=[...(runtime.MU.near||[]).filter(o=>typeof o.snd==='function'),...(runtime.livingNear?.(170)||[]),...(runtime.microNear?.(170)||[])],source=near.filter(o=>Math.hypot(o.x-s.wx,o.y-s.wy)>20&&Math.hypot(o.x-s.wx,o.y-s.wy)<170).sort((a,b)=>Math.hypot(a.x-s.wx,a.y-s.wy)-Math.hypot(b.x-s.wx,b.y-s.wy))[0];if(!source)return;const c=runtime.cx,x=source.x-s.wx+runtime.W/2,y=source.y-s.wy+runtime.H/2;c.save();c.globalAlpha=.55;c.strokeStyle='#fff';c.lineWidth=1;c.beginPath();c.moveTo(x-11,y-5);c.lineTo(x-11,y-11);c.lineTo(x-5,y-11);c.moveTo(x+11,y+5);c.lineTo(x+11,y+11);c.lineTo(x+5,y+11);c.stroke();c.restore();}
 $('firstJourneySkip').onclick=()=>{const b=book();if(b.readOnly)return;const focused=panel.contains(document.activeElement);b.skipped=true;rememberDone();runtime.save();tick();if(focused)$('w').focus({preventScroll:true});};$('guidePractice').onclick=replay;
 book();Object.defineProperties(runtime,{firstJourneyTick:{get:()=>tick},drawFirstJourney:{get:()=>draw},firstJourneyEvent:{get:()=>event},firstJourneyState:{get:()=>{const b=book();return {next:lessonAvailable(runtime.S.journey,replaying)?nextStep(b)?.[0]||null:null,skipped:b.skipped===true,open:open()};}}});
}
