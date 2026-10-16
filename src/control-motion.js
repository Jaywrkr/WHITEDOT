// Visual feedback stays silent. Resume audio in the original touch gesture.
export function initialize(runtime){
 const reduced=()=>runtime.S?.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.addEventListener('click',event=>{const button=event.target.closest('button');if(!button||button.disabled||reduced())return;
  button.getAnimations().filter(a=>a.id==='control-press').forEach(a=>a.cancel());
  const animation=button.animate([{scale:'.98',translate:'0 1px'},{scale:'1',translate:'0 0'}],{duration:160,easing:'ease-out'});animation.id='control-press';
 },true);
 let entering=false;
 async function enter(button,before=()=>{}){if(entering||runtime.inWorld())return;entering=true;button.disabled=true;button.setAttribute('aria-busy','true');runtime.audio();
  try{if(!reduced()){const arrow=button.querySelector('svg');if(arrow){const a=arrow.getBoundingClientRect(),b=button.getBoundingClientRect(),padding=parseFloat(getComputedStyle(button).paddingRight)||0,dx=Math.max(0,b.right-padding-2-(a.left+a.width*19/24));
    button.classList.add('entering-world');await arrow.animate([{transform:'translateX(0)',opacity:1},{transform:`translateX(${dx}px)`,opacity:1,offset:.82},{transform:`translateX(${dx}px)`,opacity:0}],{duration:360,easing:'cubic-bezier(.2,.6,.3,1)'}).finished;
   }}before();runtime.enterWorld();
  }finally{entering=false;button.disabled=false;button.removeAttribute('aria-busy');button.classList.remove('entering-world');}
 }
 return {enter};
}
