import {POWERS} from './expansion-music.js';
import {livingDefinition} from './living-catalog.js';
import {RARE_BOOK_LIMIT,RARE_PAGE_SIZE,CARD_TIERS,rareDefinition,rarityLabel,cardSerial,makeRareCard,normalizeRareBook,storeRareCard} from './rare-card-model.js';
import {rarePortrait} from './rare-card-art.js';
import {relicAt} from './relics.js';
import {encodePlace} from './share-tools.js';
import {sameWorld} from './world-identity.js';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function initialize(runtime){
 const $=runtime.$;let owner=null,queue=[],shown=null,remaining=0,page=0,fullNoticed=false,filter='todo';
 const active=()=>runtime.inWorld()&&!document.hidden&&!runtime.scanning&&!$('voice').classList.contains('expanded')&&!document.querySelector('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 function hide(){ $('rareNotice').hidden=true;document.body.classList.remove('rare-reveal'); }
 function dismiss(){const focused=$('rareNotice').contains(document.activeElement);shown=null;remaining=0;hide();if(focused)$('w').focus({preventScroll:true});}
 function location(card){return card.precision==='unknown'?'Lugar original no registrado':`${card.regionName} · ${Math.round(card.address.x)}, ${Math.round(card.address.y)}${card.precision==='region'?' · centro aproximado':''}`;}
 function ensure(){
  if(owner!==runtime.S){owner=runtime.S;queue=[];dismiss();page=0;fullNoticed=false;
   const old=runtime.S.rareBook?.version===1;runtime.S.rareBook=normalizeRareBook(runtime.S.rareBook);if(!old)migrate();
  }return runtime.S.rareBook;
 }
 function descriptor(type,source,extra={}){
  const world=runtime.worldIdentity,valid=Number.isFinite(source?.x)&&Number.isFinite(source?.y),region=valid?runtime.regionOfPos(source.x,source.y):null;
  return makeRareCard({type,sourceId:source?.id,world,address:valid?{...world,x:source.x,y:source.y,layer:runtime.S.layer||'superficie'}:null,
   regionName:region?.name,biome:region?runtime.BIOMES[region.z]?.name:'',genre:region?.genre,artVariant:source?.s??source?.variant??0,appearance:source?.anatomy,
   firstSeen:new Date().toISOString(),day:runtime.S.todayKey,forced:source?.id?.startsWith('rhythm:lab:')||false,...extra});
 }
 function migrate(){
  // Only explicit saved evidence; never invent the original coordinates/time of a family flag.
  const book=runtime.S.rareBook,add=(type,source,day,precision='point')=>{
   const c=descriptor(type,source,{legacy:true,firstSeen:null,day,precision});if(c)storeRareCard(book,c);
  };
  if(runtime.S.rhythmFound?.fossil)add('fossil',{id:'legacy:fossil'},'','unknown');
  for(const star of (runtime.S.stars||[]).slice(-RARE_BOOK_LIMIT)){
   const match=typeof star.id==='string'&&star.id.match(/^site:v1:(-?\d+),(-?\d+)$/);if(!match)continue;
   const source=relicAt(Number(match[1]),Number(match[2]),runtime.WCH,runtime.seedOf,runtime.rng);
   if(source&&source.magical===!!star.magical)add(source.magical?'relic:magical':'relic:ordinary',source,star.d);
  }
  for(const [key,a]of Object.entries(runtime.S.anomalies||{}).slice(-RARE_BOOK_LIMIT)){
   if(!/^-?\d+,-?\d+$/.test(key)||!rareDefinition('anomaly:'+a?.type))continue;
   const [x,y]=key.split(',').map(Number),size=runtime.REG*runtime.WCH;
   add('anomaly:'+a.type,{id:'anomaly:'+key,x:(x+.5)*size,y:(y+.5)*size},a.day,'region');
  }
 }
 function collect(type,source,extra={}){
  const book=ensure();if(!runtime.inWorld()||!rareDefinition(type))return false;
  const card=descriptor(type,source,extra);if(!card)return false;
  const repeated=book.items.some(c=>c.type===type&&!c.forced);const result=storeRareCard(book,card);if(result==='added')runtime.recordRewardSource?.('finding',card.odds.tier==='legendario'?'singular':card.odds.tier);
  if(result==='full'){if(!fullNoticed){fullNoticed=true;runtime.toast?.('Libro completo. Guarda tus tarjetas: Menú → Guardar copia.');}return false;}
  if(result==='duplicate'&&card.context?.phase){const original=book.items.find(c=>c.id===card.id);const next={at:new Date().toISOString(),phase:card.context.phase,weather:card.context.weather||''};if(!original.observations.some(o=>o.phase===next.phase&&o.weather===next.weather)){original.observations.push(next);if(original.observations.length>8)original.observations.shift();runtime.save();}}
  if(result!=='added')return false;
  // Collection never starts audio, touches the cube, changes a beat or opens a modal.
  runtime.unlock?.('tarjeta1');runtime.save();
  if(!runtime.boxCardCelebration?.(card)){const tier=c=>['raro','singular','legendario','mitico'].indexOf(c.odds.tier),near=queue.findIndex(e=>e.card.address&&card.address&&sameWorld(e.card.address,card.address)&&e.card.address.layer===card.address.layer&&Math.hypot(e.card.address.x-card.address.x,e.card.address.y-card.address.y)<3);const event={card,repeated};if(near>=0){if(tier(card)>=tier(queue[near].card))queue[near]=event;}else if(queue.length<4)queue.push(event);} // All cards are saved, even if a burst exceeds the notice queue.
  return true;
 }
 function reveal({card,repeated}){
  const def=rareDefinition(card.type),notice=$('rareNotice');notice.style.setProperty('--rare-ink',CARD_TIERS[card.odds.tier].ink);
  $('rareNoticeArt').innerHTML=rarePortrait(card);$('rareNoticeTier').textContent=card.forced?'Muestra de laboratorio':CARD_TIERS[card.odds.tier].name+' · Hallazgo';
  $('rareNoticeName').textContent=card.name;$('rareNoticeWhere').textContent=location(card);$('rareNoticeWhere').title=location(card);$('rareNoticeOdds').textContent=rarityLabel(card.type,card.odds);
  shown=card;remaining=repeated?3:8;notice.dataset.repeat=String(repeated);notice.hidden=false;document.body.classList.add('rare-reveal');
 }
 function tick(dt){
  ensure();if(!runtime.inWorld()){queue=[];dismiss();return;}
  if(!active()||runtime.celebrationActive){hide();return;}
  if(shown){$('rareNotice').hidden=false;document.body.classList.add('rare-reveal');remaining-=Math.max(0,Math.min(.1,dt));if(remaining<=0)dismiss();}
  else if(queue.length)reveal(queue.shift());
 }
 function cardHTML(card,index){
  const power=card.type.startsWith('box:')?POWERS[card.type.slice(4)]:null;const powerInfo=power?'<p>'+escape(power.text)+'</p><p>'+power.seconds+' s por caja · máximo '+(power.seconds*2)+' s</p>':'';
  const def=rareDefinition(card.type),tier=CARD_TIERS[card.odds.tier],address=card.address,canReturn=address&&sameWorld(address,runtime.worldIdentity),serial=cardSerial(card.id);
  const date=card.firstSeen?new Intl.DateTimeFormat('es-EC',{day:'numeric',month:'short',year:'numeric'}).format(new Date(card.firstSeen)):card.day||'Fecha original no registrada';
  return `<article class="rare-card" style="--rare-ink:${tier.ink}"><header><span>${escape(card.forced?'Laboratorio':tier.name)}</span><small>#${serial}</small></header>
   <div class="rare-portrait">${rarePortrait(card)}</div><h3>${escape(card.name)}</h3><p class="rare-flavour">${escape(def.text)}</p>
   <div class="rare-odds"><b>${escape(rarityLabel(card.type,card.odds))}</b><small>Aparición teórica · ${card.type.startsWith('petbox:')?'de compañía, no de esta especie':'de este tipo'}</small></div>
   <p class="rare-location">${escape(location(card))}</p><p class="rare-biome">${escape([card.biome,runtime.GEN[card.genre]?.name||card.genre,date].filter(Boolean).join(' · '))}</p>
   <p class="rare-biome">Semilla ${escape(card.world.seed||'original')} · ${escape(card.world.layout)} · ${escape(card.address?.layer||'capa no registrada')}</p>
   ${Object.keys(card.context||{}).length?'<p class="rare-biome">'+escape(Object.values(card.context).join(' · '))+'</p>':''}${card.observations?.length?'<p class="rare-biome">'+card.observations.length+' observaciones posteriores</p>':''}
   ${card.forced?'<p class="rare-provenance">Muestra forzada; no demuestra un encuentro natural.</p>':''}${card.legacy?'<p class="rare-provenance">Recuperada del progreso anterior; sin hora original.</p>':''}
   <details><summary>Cómo de raro es</summary><p>${escape(card.odds.condition)}</p></details>
   ${powerInfo}${address?`<div class="rare-actions"><button data-rare-png="${index}">Imagen</button><button data-rare-copy="${index}">Copiar lugar</button><button data-rare-return="${index}" ${canReturn?'':'disabled'}>Orientar</button></div>${canReturn?'':'<p class="rare-provenance">Para volver: Menú → Otros mundos.</p>'}`:''}
  </article>`;
 }
 function cards(search=''){
  const items=ensure().items,mapped=items.map((c,index)=>({c,index})).filter(({c})=>filter==='todo'||(filter==='vida'?c.type.startsWith('living:'):filter==='culturas'?(c.type==='living:study'||c.type==='culture:artifact'):filter==='fenomenos'?c.type.startsWith('anomaly:')||c.type.startsWith('event:'):filter==='cajas'?c.type.startsWith('box:')||c.type.startsWith('petbox:'):livingDefinition(c.type.slice(7))?.group===filter)).filter(({c})=>!search||c.name.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es'))),pages=Math.max(1,Math.ceil(mapped.length/RARE_PAGE_SIZE));page=Math.max(0,Math.min(page,pages-1));$('rareCodeFallback').hidden=true;
  if(!items.length)return '<article class="journal-card"><h3>Libro de hallazgos</h3><p>Lo raro deja una tarjeta: fósiles, reliquias, anomalías, cajas naturales y compañía de caja. Encuentra algo y el libro guardará su lugar.</p></article>';
  const list=mapped.reverse().slice(page*RARE_PAGE_SIZE,(page+1)*RARE_PAGE_SIZE);
  return `<div class="rare-book-head"><label for="rareFilter">Colección</label><select id="rareFilter">${[['todo','Todos'],['vida','Universo vivo'],['flora','Flora'],['fauna','Fauna'],['architecture','Construcciones'],['culturas','Estudios'],['fenomenos','Fenómenos'],['cajas','Cajas y visitas']].map(([id,name])=>'<option value="'+id+'" '+(filter===id?'selected':'')+'>'+name+'</option>').join('')}</select><h3>Libro de hallazgos · ${items.length}</h3><p>Cada encuentro tiene su tarjeta. Volver al mismo ejemplar no duplica; otro lugar sí. El código conserva semilla, versiones, capa y coordenadas.</p></div><div class="rare-grid">${list.map(({c,index})=>cardHTML(c,index)).join('')}</div>
   <div class="rare-pager"><button data-rare-page="-1" ${page?'':'disabled'} aria-label="Página anterior de hallazgos">‹</button><span>${page+1} / ${pages}</span><button data-rare-page="1" ${page+1<pages?'':'disabled'} aria-label="Página siguiente de hallazgos">›</button></div>`;
 }
 async function exportPNG(card){
  await document.fonts.load('400 22px "Geist Mono"');
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=720;const c=canvas.getContext('2d');c.fillStyle='#080b0e';c.fillRect(0,0,512,720);c.strokeStyle=CARD_TIERS[card.odds.tier].ink;c.lineWidth=2;c.strokeRect(24,24,464,672);
  const svg=rarePortrait(card).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace('class="rare-glyph"','stroke="#d7c497" fill="none" stroke-width="1.3"').replace('class="rare-orbit"','stroke="#596268" fill="none"').replace('class="rare-sparks"','stroke="#d7c497" fill="none"');
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));try{const img=new Image();img.src=url;await img.decode();c.drawImage(img,96,110,320,240);c.fillStyle='#e5e9e9';c.font='22px "Geist Mono", monospace';c.textAlign='center';c.fillText(card.name.slice(0,33),256,395);c.font='14px "Geist Mono", monospace';[location(card),rarityLabel(card.type,card.odds),'Semilla '+(card.world.seed||'original'),card.world.layout+' · '+(card.address?.layer||'sin ubicación'),'WHITEDOT · #'+cardSerial(card.id)].forEach((text,i)=>c.fillText(text.slice(0,49),256,450+i*35));
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Imagen no disponible');const out=URL.createObjectURL(blob),a=document.createElement('a');a.href=out;a.download='whitedot-'+cardSerial(card.id)+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(out),1000);
  }catch(_){runtime.toast('No se pudo exportar la imagen. El código del lugar sigue disponible.');}finally{URL.revokeObjectURL(url);}
 }
 async function action(event){
  const button=event.target.closest('button[data-rare-copy],button[data-rare-return],button[data-rare-page],button[data-rare-png]');if(!button||button.disabled)return;
  if(button.dataset.rarePage){const delta=Number(button.dataset.rarePage);if(![-1,1].includes(delta))return;page+=delta;runtime.refreshJournal?.();(document.querySelector('[data-rare-page="'+button.dataset.rarePage+'"]:not(:disabled)')||document.querySelector('[data-rare-page]:not(:disabled)'))?.focus();return;}
  const index=Number(button.dataset.rareCopy??button.dataset.rareReturn??button.dataset.rarePng),book=ensure(),card=Number.isInteger(index)&&book.items[index];if(!card)return;
  if(button.dataset.rarePng!==undefined){await exportPNG(card);return;}if(!card.address)return;
  if(button.dataset.rareCopy!==undefined){
   const code=encodePlace(card.address,card.name);try{await navigator.clipboard.writeText(code);button.textContent='Copiado';}
   catch(_){$('rarePlaceCode').value=code;$('rareCodeFallback').hidden=false;$('rarePlaceCode').focus();$('rarePlaceCode').select();}return;
  }
  if(!sameWorld(card.address,runtime.worldIdentity))return;
  const existing=(runtime.favorites||[]).find(p=>sameWorld(p.address,card.address)&&p.layer===card.address.layer&&Math.hypot(p.x-card.address.x,p.y-card.address.y)<8);
  const point=existing||runtime.addFavoriteAddress?.(card.address,card.name);
  if(point&&runtime.selectDestination?.(point.id))$('mJournal').hidden=true;
  else if(!point)runtime.toast?.('Favoritos lleno · libera un lugar para orientarte.');
 }
 runtime.$('journalBody').addEventListener('change',event=>{if(event.target.id!=='rareFilter')return;filter=event.target.value;page=0;runtime.refreshJournal?.();document.getElementById('rareFilter')?.focus();});
 $('rareNoticeDismiss').onclick=dismiss;
 $('rareNoticeOpen').onclick=()=>{if(!shown)return;const index=ensure().items.findIndex(c=>c.id===shown.id);page=Math.floor(Math.max(0,ensure().items.length-1-index)/RARE_PAGE_SIZE);dismiss();runtime.openJournal('rares');};
 runtime.VOZ.tarjeta1='Un hallazgo merece memoria. Su tarjeta guarda el lugar.';
 runtime.ACH.push(['tarjeta1','Un hallazgo tiene memoria','Guardaste una tarjeta de un encuentro poco común.']);
 ensure();
 Object.defineProperties(runtime,{collectRareCard:{get:()=>collect},rareCardTick:{get:()=>tick},rareBookCards:{get:()=>cards},rareBookAction:{get:()=>action},rareCards:{get:()=>ensure().items},rareNoticeState:{get:()=>({shown:shown?.id||null,remaining,pending:queue.length})}});
}
