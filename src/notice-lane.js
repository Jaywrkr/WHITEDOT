// One visible notice, with a real exit interval before the next entrance.
export function createNoticeLane(){
 let owner=null,exit=null,left=0;const waiting=[];
 const request=id=>{if(owner!==id&&!waiting.includes(id))waiting.push(id);};
 function claim(id){if(owner===id)return true;request(id);if(owner||exit||waiting[0]!==id)return false;waiting.shift();owner=id;return true;}
 function release(id){if(owner!==id)return;owner=null;exit=id;left=.36;}
 function cancel(id){const i=waiting.indexOf(id);if(i>=0)waiting.splice(i,1);release(id);}
 function tick(dt){if(exit){left-=Math.max(0,Math.min(.1,Number.isFinite(dt)?dt:0));if(left<=0){exit=null;left=0;}}}
 function clear(){owner=exit=null;left=0;waiting.length=0;}
 return {request,claim,release,cancel,tick,clear,get owner(){return owner;},get exiting(){return exit;},get pending(){return waiting.slice();}};
}
export function installNoticeLane(runtime){
 if(runtime.noticeLane)return runtime.noticeLane;
 const model=createNoticeLane(),timed=new Map(),callbacks=new Map(),hides=new WeakMap();let state=runtime.S,last=performance.now();
 const blocked=()=>!globalThis.document||document.hidden||!!document.querySelector('.modal:not([hidden]),.fxpanel:not([hidden]),.glasspanel:not([hidden]),#mirrorPanel:not([hidden])');
 const reduced=()=>runtime.S?.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 function show(panel){panel.inert=false;clearTimeout(hides.get(panel));panel.classList.remove('notice-leaving');if(panel.hidden)panel.hidden=false;if(!panel.classList.contains('on'))panel.classList.add('on');}
 function hide(panel){panel.inert=true;if(panel.hidden||panel.classList.contains('notice-leaving'))return;panel.classList.remove('on');panel.classList.add('notice-leaving');hides.set(panel,setTimeout(()=>{panel.hidden=true;panel.classList.remove('notice-leaving');},reduced()?0:260));}
 function enqueue(id,panel,render,seconds=2.5,key='',valid=()=>true){
  let slot=timed.get(id);if(!slot){slot={panel,queue:[],current:null,left:0};timed.set(id,slot);}
  if(key&&(slot.current?.key===key||slot.queue.some(e=>e.key===key)))return;
  slot.queue.push({render,seconds,key,valid});model.request(id);
 }
 const api={request:model.request,claim:id=>!blocked()&&model.claim(id),release:model.release,cancel:model.cancel,blocked,show,hide,enqueue,register:(id,fn)=>callbacks.set(id,fn),get owner(){return model.owner;},get pending(){return model.pending;},get inspecting(){return !!globalThis.document?.querySelector('[data-inspect="true"]:not([hidden]):not(.notice-leaving)');}};
 function tick(){const now=performance.now(),dt=Math.max(0,Math.min(.1,(now-last)/1000));last=now;
  if(state!==runtime.S){state=runtime.S;model.clear();for(const slot of timed.values()){slot.queue.length=0;slot.current=null;hide(slot.panel);}}
  if(!blocked())model.tick(dt);
  for(const [id,slot]of timed){
   if(['zone','phrase'].includes(id)&&document.body.classList.contains('first-journey')){slot.panel.hidden=true;if(slot.current){slot.queue.unshift(slot.current);slot.current=null;model.release(id);}model.cancel(id);continue;}
   if(blocked()){slot.panel.hidden=true;continue;}
   if(!slot.current){while(slot.queue.length&&!slot.queue[0].valid())slot.queue.shift();if(!slot.queue.length){model.cancel(id);continue;}if(!api.claim(id))continue;slot.current=slot.queue.shift();slot.left=slot.current.seconds;slot.current.render();show(slot.panel);}
   else{show(slot.panel);slot.left-=dt;if(slot.left<=0){hide(slot.panel);slot.current=null;model.release(id);if(slot.queue.length)model.request(id);}}
  }
  for(const fn of callbacks.values())fn(dt);
  document.body.dataset.notice=model.owner||model.exiting||'';document.body.classList.toggle('ui-reduced-motion',!!reduced());
 }
 Object.defineProperty(runtime,'noticeLane',{value:api});const timer=globalThis.document?setInterval(tick,50):null;timer?.unref?.();return api;
}
