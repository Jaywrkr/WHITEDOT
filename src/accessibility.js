// Menus trap keyboard focus; closing them returns to the control that opened them.
export function initialize(runtime){
 const canvas=runtime.$('w');canvas.tabIndex=0;canvas.setAttribute('aria-label','Mundo musical: arrastra para caminar, toca objetos para responder');
 const dialogs=[...document.querySelectorAll('.modal')],returnFocus=new WeakMap();
 for(const dialog of dialogs){
  dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
  const heading=dialog.querySelector('h2');if(heading){heading.id||=dialog.id+'Title';dialog.setAttribute('aria-labelledby',heading.id);heading.tabIndex=-1;}
  else dialog.setAttribute('aria-label',dialog.id==='mMenu'?'Menú':'Opciones del juego');
 }
 const open=()=>dialogs.filter(d=>!d.hidden).at(-1);
 const controls=d=>[...d.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex="0"]')].filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
 const observer=new MutationObserver(records=>{
  for(const {target:d}of records){
   if(!d.hidden){if(!returnFocus.has(d))returnFocus.set(d,document.activeElement);(d.querySelector('h2')||controls(d)[0])?.focus({preventScroll:true});}
   else{const target=returnFocus.get(d);returnFocus.delete(d);if(!open()){if(target?.isConnected&&target.getClientRects().length)target.focus({preventScroll:true});else canvas.focus({preventScroll:true});}}
  }
 });
 for(const dialog of dialogs)observer.observe(dialog,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('keydown',e=>{
  const d=open();if(!d)return;
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();d.hidden=true;runtime.save();return;}
  if(e.key!=='Tab')return;const items=controls(d);if(!items.length){e.preventDefault();return;}
  const index=items.indexOf(document.activeElement);
  if(index<0||e.shiftKey&&index===0||!e.shiftKey&&index===items.length-1){e.preventDefault();items[e.shiftKey?items.length-1:0].focus();}
 },true);
}
