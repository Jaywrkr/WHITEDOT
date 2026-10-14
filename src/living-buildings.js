import {studyOf,JAY_STORY} from './living-studies.js';
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function bridgeContact(progress,index){return index===progress?Math.min(3,progress+1):index===0?1:0;}
export function initialize(runtime){
 function memory(o){const s=runtime.S;const book=s.livingSites&&typeof s.livingSites==='object'&&!Array.isArray(s.livingSites)?s.livingSites:(s.livingSites={});
  if(!book[o.id]){if(Object.keys(book).length>=512)delete book[Object.keys(book)[0]];book[o.id]={open:false,visits:0};}return book[o.id];
 }
 function open(o){const m=memory(o);if(m.open)return;m.open=true;m.visits=Math.min(999,(m.visits||0)+1);o.energy=1;const study=studyOf(o);runtime.unlock('umbralVivo');runtime.say(study.name+' · '+study.reference+'.','Un recuerdo despierta');runtime.livingBuildingFound?.(o,study);runtime.save();}
 function tick(o,dt,clock,d){if(o.group!=='architecture')return;const m=memory(o);o.open=m.open;
  if(o.kind==='bridge'){
   const index=[-22,0,22].findIndex(x=>Math.hypot(o.x+x-runtime.S.wx,o.y-runtime.S.wy)<10),previous=o.bridgeTouch??-1;
   if(index>=0&&index!==previous){o.bridgeProgress=bridgeContact(o.bridgeProgress||0,index);runtime.livingInteract(o);if(o.bridgeProgress===3)open(o);}o.bridgeTouch=index;
  }else if(o.kind==='observatory'){
   const target=o.variant/256*Math.PI*2,angle=Math.atan2(runtime.S.wy-o.y,runtime.S.wx-o.x);o.align=d>20&&d<65&&Math.abs(Math.atan2(Math.sin(angle-target),Math.cos(angle-target)))<.2?(o.align||0)+dt:0;if(o.align>2)open(o);
  }else if(o.kind==='mill'||o.kind==='mirror-grove'){if(o.orbit>Math.PI*.8)open(o);o.phase+=dt*(o.energy+(runtime.livingEnvironment?.wind||0)*.2);}
  else if(o.dwell>6)open(o);
  if(m.open&&d<90){const study=studyOf(o);for(const peer of runtime.livingNear(180))if(peer.kind===study.flora||peer.kind===study.fauna){peer.energy=Math.max(.26,peer.energy);peer.hue=(o.hue+12)%360;}}
  const found=Object.keys(runtime.S.livingSeen||{}).length,story=runtime.S.jayStory||={};
  for(const fragment of JAY_STORY)if(found>=fragment.need&&!story[fragment.id]){story[fragment.id]=runtime.dayKey();runtime.say(fragment.text,'El Camino · '+fragment.id);break;}
 }
 function card(){const ids=Object.keys(runtime.S.jayStory||{});return '<article class="journal-card"><h3>Recuerdos del Camino</h3>'+ids.map(id=>'<p>'+safe(JAY_STORY.find(f=>f.id===id)?.text||'')+'</p>').join('')+'<p>Escuchar, crear, volver y compartir. No hay una obligación diaria para seguir explorando.</p></article>';
 }
 runtime.ACH.push(['umbralVivo','Un recuerdo despierta','Escuchaste y activaste una construcción del universo vivo.']);
 Object.defineProperties(runtime,{livingBuildingTick:{get:()=>tick},livingStoryCard:{get:()=>card}});
}
