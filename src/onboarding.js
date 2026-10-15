import {normalizeFirstJourney,firstJourneyNext,advanceFirstJourney} from './onboarding-model.js';
export function initialize(runtime){
 const $=runtime.$,panel=$('firstJourney'),GLOBAL_DONE='whitedot:first-journey:v1';let owner=null,anchor=null,last='';
 function globalDone(){try{return localStorage.getItem(GLOBAL_DONE)==='1';}catch(_){return false;}}
 function rememberDone(){try{localStorage.setItem(GLOBAL_DONE,'1');}catch(_){} }
 function book(){if(owner!==runtime.S){owner=runtime.S;const demo=!!owner.previewSeed&&!runtime.realTravel,experienced=demo||globalDone()||runtime.scopeHadSave&&(!!owner.ach?.mundo||!!owner.help?.creativeVisit);owner.firstJourney=normalizeFirstJourney(owner.firstJourney,{experienced});if(!demo&&!owner.firstJourney.readOnly&&!firstJourneyNext(owner.firstJourney))rememberDone();anchor={x:owner.px,y:owner.py};last='';}return owner.firstJourney;}
 function visible(show){if(panel.hidden!==!show)panel.hidden=!show;if(document.body.classList.contains('first-journey')!==show)document.body.classList.toggle('first-journey',show);}
 function event(id){const b=book();if(advanceFirstJourney(b,id)){if(!firstJourneyNext(b))rememberDone();runtime.save();}}
 function tick(){const s=runtime.S,b=book();if(s.mode==='camino'&&Math.hypot(s.px-anchor.x,s.py-anchor.y)>20)event('move');if(runtime.worldReady())event('light');if(runtime.inWorld())event('world');
  let next=firstJourneyNext(b);const blocked=document.hidden||runtime.scanning||!['camino','world'].includes(s.mode)||document.querySelector('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])')||$('voice').classList.contains('expanded');
  if(next&&s.mode==='camino')next=!runtime.worldReady()?(b.facts.move?['light','Recoge una luz. Abre el Mundo de hoy.']:['move','Arrastra para acercarte a una luz.']):['world','Entra al Mundo con el botón de abajo.'];
  visible(!!next&&!blocked);if(panel.hidden)return;
  const text=next[0]==='voice'&&(!s.sound||runtime.musicVolume()===0)?'Activa el sonido para escuchar este encuentro.':next[1];if(text!==last){$('firstJourneyText').textContent=text;last=text;}panel.dataset.step=next[0];document.body.classList.add('first-journey');
 }
 function replay(){if(book().readOnly){runtime.toast('Esta guía requiere una versión más reciente.');return;}runtime.S.firstJourney=normalizeFirstJourney(null);owner=null;book();if(runtime.inWorld()){for(const id of ['move','light','world'])event(id);}panel.hidden=false;$('mGuide').hidden=true;tick();}
 function draw(){if(panel.hidden||panel.dataset.step!=='voice'||!runtime.inWorld())return;const s=runtime.S,near=[...(runtime.MU.near||[]).filter(o=>typeof o.snd==='function'),...(runtime.livingNear?.(170)||[])],source=near.filter(o=>Math.hypot(o.x-s.wx,o.y-s.wy)>20&&Math.hypot(o.x-s.wx,o.y-s.wy)<170).sort((a,b)=>Math.hypot(a.x-s.wx,a.y-s.wy)-Math.hypot(b.x-s.wx,b.y-s.wy))[0];if(!source)return;const c=runtime.cx,x=source.x-s.wx+runtime.W/2,y=source.y-s.wy+runtime.H/2;c.save();c.globalAlpha=.55;c.strokeStyle='#fff';c.lineWidth=1;c.beginPath();c.moveTo(x-11,y-5);c.lineTo(x-11,y-11);c.lineTo(x-5,y-11);c.moveTo(x+11,y+5);c.lineTo(x+11,y+11);c.lineTo(x+5,y+11);c.stroke();c.restore();}
 $('firstJourneySkip').onclick=()=>{const b=book();if(b.readOnly)return;const focused=panel.contains(document.activeElement);b.skipped=true;rememberDone();runtime.save();tick();if(focused)$('w').focus({preventScroll:true});};$('guidePractice').onclick=replay;
 book();Object.defineProperties(runtime,{firstJourneyTick:{get:()=>tick},drawFirstJourney:{get:()=>draw},firstJourneyEvent:{get:()=>event},firstJourneyState:{get:()=>({next:firstJourneyNext(book())?.[0]||null,skipped:book().skipped===true})}});
}
