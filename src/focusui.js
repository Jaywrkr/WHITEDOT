// Exploration gets the screen; tools and detailed counters are explicit choices.
export function initialize(runtime){
 const $=runtime.$;let mode=null,details=null;
 function closeTools(){document.body.classList.remove('tools-open');$('bTools').setAttribute('aria-expanded','false');}
 function sync(){
  const world=runtime.inWorld(),show=!!runtime.S.worldDetails;
  if(mode===world&&details===show)return;mode=world;details=show;
  document.body.classList.toggle('world-mode',world);document.body.classList.toggle('world-focus',world&&!show);
  $('bTools').hidden=!world;$('bDetails').hidden=!world;$('bDetails').setAttribute('aria-pressed',String(show));$('bDetails').querySelector('span').textContent=show?'Ocultar datos':'Datos del mundo';
  if(!world)closeTools();
 }
 $('bTools').onclick=()=>{const open=document.body.classList.toggle('tools-open');$('bTools').setAttribute('aria-expanded',String(open));if(open)queueMicrotask(()=>$('bFx').focus({preventScroll:true}));};
 $('bDetails').onclick=()=>{runtime.S.worldDetails=!runtime.S.worldDetails;sync();runtime.save();};
 $('bMenu').addEventListener('click',closeTools);
 for(const id of ['bFx','bLoop','bDeploy'])$(id).addEventListener('click',closeTools);
 addEventListener('pointerdown',e=>{if(e.target===$('w'))closeTools();});
 addEventListener('keydown',e=>{if(e.key==='Escape'){closeTools();if(!document.querySelector('.modal:not([hidden])')){if(runtime.fxState?.open)$('fxClose').click();runtime.closeMirrors?.();runtime.stopScanner?.();}}});
 sync();Object.defineProperties(runtime,{focusUITick:{get:()=>sync},closeWorldTools:{get:()=>closeTools}});
}
