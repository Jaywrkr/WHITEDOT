import {openSurface,prefersReducedMotion} from './frame-state.js';
// One visible notice, ordered by importance, with a real exit interval.
export const NOTICE_STYLES=Object.freeze({
 1:Object.freeze({seconds:1.8,ttl:8000,cooldown:18000,pending:1}),
 2:Object.freeze({seconds:3,ttl:120000,cooldown:2000,pending:8}),
 3:Object.freeze({seconds:0,ttl:Infinity,cooldown:0,pending:4})
});
const levelOf=value=>[1,2,3].includes(value)?value:2;
export function createNoticeLane(){
 let owner=null,exit=null,left=0;const waiting=[],levels=new Map();
 function request(id,options={}){if(options.level!==undefined||!levels.has(id))levels.set(id,levelOf(options.level));if(owner!==id&&!waiting.includes(id))waiting.push(id);}
 function claim(id){if(owner===id)return true;request(id);const next=waiting.reduce((best,x)=>best===null||levels.get(x)>levels.get(best)?x:best,null);if(owner||exit||next!==id)return false;waiting.splice(waiting.indexOf(id),1);owner=id;return true;}
 function release(id){if(owner!==id)return;owner=null;exit=id;left=.36;}
 function cancel(id){const i=waiting.indexOf(id);if(i>=0)waiting.splice(i,1);release(id);levels.delete(id);}
 function tick(dt){if(exit){left-=Math.max(0,Math.min(.1,Number.isFinite(dt)?dt:0));if(left<=0){exit=null;left=0;}}}
 function clear(){owner=exit=null;left=0;waiting.length=0;levels.clear();}
 return {request,claim,release,cancel,tick,clear,level:id=>levels.get(id)||2,get owner(){return owner;},get exiting(){return exit;},get pending(){return waiting.slice();}};
}
export function installNoticeLane(runtime){
 if(runtime.noticeLane)return runtime.noticeLane;
 const model=createNoticeLane(),timed=new Map(),callbacks=new Map(),hides=new WeakMap(),recent=new Map(),started=new Map(),panelIDs={rareNotice:'rare'};let state=runtime.S,last=performance.now(),quiet=0;
 const blocked=()=>!globalThis.document||document.hidden||!!runtime.setRecording||!!runtime.jam?.loop?.rec||!!runtime.jam?.loop?.armed||!!openSurface('.modal:not([hidden]),.fxpanel:not([hidden]),.glasspanel:not([hidden]),#mirrorPanel:not([hidden])');
 const reduced=()=>runtime.S?.reducedMotion||prefersReducedMotion();
 const idOf=panel=>panelIDs[panel.id]||panel.id;
 const panels=()=>document.querySelectorAll('#toast,#phrase,#zone,#voice,#rareNotice,#celebration');
 function show(panel){
  // Stale producers cannot reopen a panel after losing their ticket.
  if(blocked()||model.owner!==idOf(panel)){panel.hidden=true;return false;}
  for(const other of panels())if(other!==panel){other.hidden=true;other.classList.remove('on');}
  panel.inert=false;clearTimeout(hides.get(panel));panel.classList.remove('notice-leaving');panel.hidden=false;panel.classList.add('on');return true;
 }
 function hide(panel){panel.inert=true;panel.classList.remove('on');if(panel.hidden||panel.classList.contains('notice-leaving'))return;panel.classList.add('notice-leaving');hides.set(panel,setTimeout(()=>{panel.hidden=true;panel.classList.remove('notice-leaving');},reduced()?0:260));}
 function release(id){if(model.owner===id&&model.level(id)===3)quiet=4;model.release(id);}
 function request(id,options={}){model.request(id,options);}
 function claim(id,options){if(options)request(id,options);return !blocked()&&quiet<=0&&model.claim(id);}
 function enqueue(id,panel,render,seconds=2.5,key='',valid=()=>true,options={}){
  const now=performance.now(),level=levelOf(options.level),style=NOTICE_STYLES[level],category=options.category||id,duplicate=category+':'+key;
  if(category==='ganado'&&(model.level(model.owner)===3||model.pending.some(x=>model.level(x)===3)))return false;
  if(level===1&&(quiet>0||model.level(model.owner)===3||model.pending.some(x=>model.level(x)===3)||now-(started.get(1)??-Infinity)<style.cooldown))return false;
  if(key&&now-(recent.get(duplicate)??-Infinity)<(options.cooldown??style.cooldown))return false;
  if(options.coalesce&&level===1)for(const [other,slot]of timed)if(other!==id){slot.queue=slot.queue.filter(e=>e.level!==1);if(!slot.current&&!slot.queue.length)model.cancel(other);}
  let slot=timed.get(id);if(!slot){slot={panel,queue:[],current:null,left:0};timed.set(id,slot);}
  if(key&&(slot.current?.key===key||slot.queue.some(e=>e.key===key)))return false;
  if(options.coalesce)slot.queue=slot.queue.filter(e=>e.category!==category);
  slot.queue.push({render,seconds:options.persistent?Infinity:options.level?style.seconds:seconds,detail:options.detail|| (options.persistent?'save':''),key,category,level,valid,paced:options.level!==undefined,expires:now+(options.ttl??style.ttl)});
  slot.queue.sort((a,b)=>b.level-a.level);while(slot.queue.length>(slot.queue.every(e=>e.level===1)?1:8))slot.queue.pop();
  recent.set(duplicate,now);if(recent.size>120)recent.delete(recent.keys().next().value);
  request(id,{level:Math.max(...slot.queue.map(e=>e.level),slot.current?.level||1)});return true;
 }
 function quietRoutine(){for(const [id,slot]of timed)if(['zone','phrase','toast'].includes(id)){slot.queue.length=0;slot.current=null;model.cancel(id);slot.panel.hidden=true;slot.panel.classList.remove('on');}if(['zone','phrase','toast'].includes(document.body.dataset.notice))document.body.dataset.notice='';}
 const api={quietRoutine,request,claim,release,cancel:model.cancel,blocked,show,hide,enqueue,register:(id,fn)=>callbacks.set(id,fn),get owner(){return model.owner;},get pending(){return model.pending;},get inspecting(){return !!openSurface('[data-inspect="true"]:not([hidden]):not(.notice-leaving)');}};
 function tick(){const now=performance.now(),dt=Math.max(0,Math.min(.1,(now-last)/1000));last=now;
  if(state!==runtime.S){state=runtime.S;model.clear();recent.clear();started.clear();quiet=0;for(const slot of timed.values()){slot.queue.length=0;slot.current=null;hide(slot.panel);}}
  for(const [id,slot]of timed)if(slot.current?.seconds===Infinity&&runtime.storageStatus?.kind==='ok'){slot.current=null;hide(slot.panel);release(id);}
  const paused=blocked();if(!paused){model.tick(dt);quiet=Math.max(0,quiet-dt);}
  for(const [id,slot]of timed){
   // Routine context gets stale during lessons. Never replay it afterwards.
   if(['zone','phrase','toast'].includes(id)&&document.body.classList.contains('first-journey')&&slot.current?.seconds!==Infinity&&!slot.queue.some(e=>e.seconds===Infinity)){slot.panel.hidden=true;slot.queue.length=0;slot.current=null;model.cancel(id);continue;}
   if(paused){slot.panel.hidden=true;continue;}
   slot.queue=slot.queue.filter(e=>e.expires>now&&e.valid());
   if(slot.current&&model.owner!==id){slot.current=null;slot.panel.hidden=true;}
   if(!slot.current){
    while(slot.queue[0]?.level===1&&now-(started.get(1)??-Infinity)<NOTICE_STYLES[1].cooldown)slot.queue.shift();
    if(!slot.queue.length){model.cancel(id);continue;}
    request(id,{level:slot.queue[0].level});if(slot.queue[0].paced&&slot.queue[0].level===2&&now-(started.get(2)??-Infinity)<NOTICE_STYLES[2].cooldown)continue;if(!claim(id))continue;
    slot.current=slot.queue.shift();slot.left=slot.current.seconds;started.set(slot.current.level,now);slot.panel.dataset.detail=slot.current.detail;slot.panel.dataset.noticeLevel=String(slot.current.level);slot.current.render();if(slot.current.seconds===Infinity){slot.panel.setAttribute('role','button');slot.panel.tabIndex=0;}else{slot.panel.removeAttribute('role');slot.panel.removeAttribute('tabindex');}show(slot.panel);
   }else if(show(slot.panel)){slot.left-=dt;if(slot.left<=0){hide(slot.panel);slot.current=null;release(id);if(slot.queue.length)request(id,{level:slot.queue[0].level});}}
  }
  for(const fn of callbacks.values())fn(dt);
  // A producer bypassing show() still cannot display a second notice.
  for(const panel of panels())if(idOf(panel)!==model.owner&&idOf(panel)!==model.exiting){panel.hidden=true;panel.classList.remove('on');}
  document.body.dataset.notice=model.owner||model.exiting||'';document.body.classList.toggle('ui-reduced-motion',!!reduced());
 }
 Object.defineProperty(runtime,'noticeLane',{value:api});const timer=globalThis.document?setInterval(tick,50):null;timer?.unref?.();return api;
}
