// Menus trap keyboard focus; closing them returns to the control that opened them.
export function initialize(runtime){
 const canvas=runtime.$('w');canvas.tabIndex=0;canvas.setAttribute('aria-label','Mundo musical: arrastra para caminar; el cubo toca los objetos. Un toque vacío lanza el pulso.');
 const stage=d=>d.id==='journeyFinale'||d.id==='songStage';
 const visible=d=>!d.hidden&&(d.matches('.modal')||d.dataset.inspect==='true'||stage(d));
 const dialogs=[...document.querySelectorAll('.modal,#rareNotice,#celebration')],returnFocus=new WeakMap(),opened=[],managedInert=new Set(),hiddenState=new Map(dialogs.map(d=>[d,!visible(d)]));
 const closers={mPlace:'placeClose',mLugares:'lugaresClose',mPortal:'portalClose',mProfile:'profileClose',mGuide:'guideClose',mHouseCode:'houseCodeClose',mSettings:'settingsClose',mConnection:'connectionClose',mCube:'cubeClose',mSeeds:'seedClose',mSaveTools:'saveToolsClose',mSky:'kClose',mMap:'mapClose',mJournal:'journalClose',mMusic:'muClose',mSession:'sessionClose',mShare:'sClose',mAtlas:'atlasClose',mFavorites:'favoritesClose',mMusicTravel:'musicTravelClose',contentGallery:'contentGalleryClose',mLab:'labClose',mSet:'setClose',mOut:'oClose'};
 for(const dialog of dialogs.filter(d=>d.matches('.modal'))){
  dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
  const heading=dialog.querySelector('h2');if(heading){heading.id||=dialog.id+'Title';dialog.setAttribute('aria-labelledby',heading.id);heading.tabIndex=-1;
   if(!heading.closest('header')){const header=document.createElement('header');header.className='panel-heading';heading.before(header);header.append(heading);
    if(closers[dialog.id]){const close=document.createElement('button');close.type='button';close.className='sheet-close';close.setAttribute('aria-label','Cerrar '+(heading.textContent||'panel'));close.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';close.onclick=()=>runtime.$(closers[dialog.id]).click();header.append(close);}
   }
  }
  else dialog.setAttribute('aria-label',dialog.id==='mMenu'?'Menú':'Opciones del juego');
 }
 const open=()=>opened.filter(visible).at(-1)||dialogs.filter(visible).at(-1);
 // Geometry alone can include closed <details> content; keep only its summary.
 const controls=d=>[...d.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],summary,[tabindex="0"]')].filter(el=>{
  const closed=el.closest('details:not([open])');
  return (!closed||el===closed.querySelector(':scope > summary'))&&!el.closest('[inert]')&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
 });
 function isolate(){
  for(const el of managedInert)el.inert=false;managedInert.clear();const active=open();
  if(active)for(const el of document.body.children){if(el!==active&&el.tagName!=='SCRIPT'&&!el.inert){el.inert=true;managedInert.add(el);}}
  runtime.$('bMenu').setAttribute('aria-expanded',String(!runtime.$('mMenu').hidden));
 }
 const observer=new MutationObserver(records=>{
  const targets=[];for(const record of records){if(record.type==='childList'){for(const node of record.addedNodes){if(node.nodeType!==1)continue;for(const d of [node,...node.querySelectorAll('#journeyFinale,#songStage')])if(stage(d)&&!dialogs.includes(d)){dialogs.push(d);hiddenState.set(d,true);d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.dataset.inspect='true';d.tabIndex=-1;observer.observe(d,{attributes:true,attributeFilter:['hidden','data-inspect']});targets.push(d);}}}else targets.push(record.target);}
  const changedDialogs=[...new Set(targets)].filter(d=>hiddenState.get(d)!==!visible(d));
  if(!changedDialogs.length)return;
  let closedTarget=null,changed=false;
  for(const d of changedDialogs){
   hiddenState.set(d,!visible(d));
   const index=opened.indexOf(d);
   if(visible(d)){if(!returnFocus.has(d))returnFocus.set(d,document.activeElement);if(index>=0)opened.splice(index,1);opened.push(d);changed=true;}
   else{if(index>=0)opened.splice(index,1);closedTarget=returnFocus.get(d)||closedTarget;returnFocus.delete(d);}
  }
  isolate();const active=open();
  if(active&&(changed||!active.contains(document.activeElement)))(active.querySelector('h2')||controls(active)[0]||active)?.focus({preventScroll:true});
  else if(!active){const target=closedTarget;if(target?.isConnected&&target!==document.body&&target!==document.documentElement&&!target.closest('[inert]')&&target.getClientRects().length&&getComputedStyle(target).visibility!=='hidden')target.focus({preventScroll:true});else canvas.focus({preventScroll:true});}
 });
 for(const dialog of dialogs)observer.observe(dialog,{attributes:true,attributeFilter:['hidden','data-inspect']});
 observer.observe(document.body,{childList:true});
 runtime.$('bMenu').setAttribute('aria-haspopup','dialog');
 isolate();
 document.addEventListener('keydown',e=>{
  const d=open();if(!d)return;
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(d.id==='journeyFinale')runtime.journeyFinaleSkip?.();else if(d.id==='songStage')runtime.closeSong?.();else if(d.id==='rareNotice'||d.id==='celebration')runtime.$(d.id==='rareNotice'?'rareNoticeDismiss':'celebrationDismiss').click();else{d.hidden=true;runtime.save();}return;}
  if(stage(d)&&(/^(Arrow|[wasd]$)/i.test(e.key)||e.key===' '&&!e.target.matches('button,summary,a'))&&!e.target.matches('input,textarea,select')){e.preventDefault();e.stopPropagation();return;}
  if(e.key!=='Tab')return;const items=controls(d);if(!items.length){e.preventDefault();return;}
  const index=items.indexOf(document.activeElement);
  if(index<0||e.shiftKey&&index===0||!e.shiftKey&&index===items.length-1){e.preventDefault();items[e.shiftKey?items.length-1:0].focus();}
 },true);
}
