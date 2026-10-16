import {manifestRows,manifestCoverage} from './content-manifest.js';
import {anatomyOf,anatomyPath} from './anatomy.js';
import {pixelCells} from './native-visual.js';
export function initialize(runtime){
 if(!runtime.labMode)return;const $=runtime.$,sheet=$('contentGallery'),rows=$('contentGalleryRows');if(!sheet||!rows)return;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function draw(){const matches=manifestRows($('contentGallerySearch').value),coverage=manifestCoverage();$('contentGalleryCount').textContent=matches.length+' entradas · '+coverage.families+' familias';rows.replaceChildren();
  for(const e of matches.slice(0,64)){const article=document.createElement('article');article.className='content-specimen';
   let svg='';if(e.shape){const a=anatomyOf({id:e.id,kind:e.id,shape:e.shape,group:e.group==='Arquitectura viva'?'architecture':'flora'});svg='<svg viewBox="-1.6 -1.6 3.2 3.2" aria-hidden="true"><path d="'+anatomyPath(a)+'"/></svg>';}
   if(e.id==='native:pixel')svg='<svg viewBox="-4 -4 8 8" aria-hidden="true">'+pixelCells(0b101010111010101).map(([x,y])=>'<rect x="'+x+'" y="'+y+'" width="1" height="1"/>').join('')+'</svg>';
   article.innerHTML=svg+'<h3>'+esc(e.name)+'</h3><small>'+esc(e.group)+'</small><details><summary>Ruta técnica</summary><small>'+esc(e.generator)+' → '+esc(e.renderer)+' → '+esc(e.audio)+'</small></details>';
   if(e.labId){const b=document.createElement('button');b.textContent='Ver en el mundo';b.onclick=()=>{sheet.hidden=true;runtime.labGo(e.labId);};article.append(b);}else{const p=document.createElement('p');p.textContent='Sin práctica individual';article.append(p);}
   rows.append(article);
  }
  $('contentGalleryMore').hidden=matches.length<=64;
 }
 const open=()=>{document.querySelectorAll?.('.modal:not([hidden])').forEach(e=>e.hidden=true);draw();sheet.hidden=false;$('contentGallerySearch').focus();};$('labGallery').onclick=open;
 if(new URLSearchParams(globalThis.location?.search||'').get('gallery')==='1')setTimeout(open,0);$('contentGallerySearch').oninput=draw;$('contentGalleryClose').onclick=()=>sheet.hidden=true;
}
