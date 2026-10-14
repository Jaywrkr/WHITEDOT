import {RARE_BOOK_LIMIT,RARE_PAGE_SIZE,CARD_TIERS,rareDefinition,rarityLabel,cardSerial,makeRareCard,normalizeRareBook,storeRareCard} from './rare-card-model.js';
import {rarePortrait} from './rare-card-art.js';
import {relicAt} from './relics.js';
import {encodePlace} from './share-tools.js';
import {sameWorld} from './world-identity.js';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function initialize(runtime){
 const $=runtime.$;let owner=null,queue=[],shown=null,remaining=0,page=0,fullNoticed=false;
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
   regionName:region?.name,biome:region?runtime.BIOMES[region.z]?.name:'',genre:region?.genre,artVariant:source?.s??source?.variant??0,
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
  const result=storeRareCard(book,card);
  if(result==='full'){if(!fullNoticed){fullNoticed=true;runtime.toast?.('Libro completo · conserva tus tarjetas con Progreso y respaldo.');}return false;}
  if(result!=='added')return false;
  // Collection never starts audio, touches the cube, changes a beat or opens a modal.
  runtime.unlock?.('tarjeta1');runtime.save();
  if(queue.length<4)queue.push(card); // All cards are saved, even if a burst exceeds the notice queue.
  return true;
 }
 function reveal(card){
  const def=rareDefinition(card.type),notice=$('rareNotice');notice.style.setProperty('--rare-ink',CARD_TIERS[card.odds.tier].ink);
  $('rareNoticeArt').innerHTML=rarePortrait(card);$('rareNoticeTier').textContent=card.forced?'Muestra de laboratorio':CARD_TIERS[card.odds.tier].name+' · Hallazgo';
  $('rareNoticeName').textContent=card.name;$('rareNoticeWhere').textContent=location(card);$('rareNoticeWhere').title=location(card);$('rareNoticeOdds').textContent=rarityLabel(card.type,card.odds);
  shown=card;remaining=8;notice.hidden=false;document.body.classList.add('rare-reveal');
 }
 function tick(dt){
  ensure();if(!runtime.inWorld()){queue=[];dismiss();return;}
  if(!active()){hide();return;}
  if(shown){$('rareNotice').hidden=false;document.body.classList.add('rare-reveal');remaining-=Math.max(0,Math.min(.1,dt));if(remaining<=0)dismiss();}
  else if(queue.length)reveal(queue.shift());
 }
 function cardHTML(card,index){
  const def=rareDefinition(card.type),tier=CARD_TIERS[card.odds.tier],address=card.address,canReturn=address&&sameWorld(address,runtime.worldIdentity),serial=cardSerial(card.id);
  const date=card.firstSeen?new Intl.DateTimeFormat('es-EC',{day:'numeric',month:'short',year:'numeric'}).format(new Date(card.firstSeen)):card.day||'Fecha original no registrada';
  return `<article class="rare-card" style="--rare-ink:${tier.ink}"><header><span>${escape(card.forced?'Laboratorio':tier.name)}</span><small>#${serial}</small></header>
   <div class="rare-portrait">${rarePortrait(card)}</div><h3>${escape(card.name)}</h3><p class="rare-flavour">${escape(def.text)}</p>
   <div class="rare-odds"><b>${escape(rarityLabel(card.type,card.odds))}</b><small>Aparición teórica · ${card.type.startsWith('petbox:')?'de compañía, no de esta especie':'de este tipo'}</small></div>
   <p class="rare-location">${escape(location(card))}</p><p class="rare-biome">${escape([card.biome,runtime.GEN[card.genre]?.name||card.genre,date].filter(Boolean).join(' · '))}</p>
   <p class="rare-biome">Semilla ${escape(card.world.seed||'original')} · ${escape(card.world.layout)} · ${escape(card.address?.layer||'capa no registrada')}</p>
   ${card.forced?'<p class="rare-provenance">Muestra forzada; no demuestra un encuentro natural.</p>':''}${card.legacy?'<p class="rare-provenance">Recuperada del progreso anterior; sin hora original.</p>':''}
   <details><summary>Cómo de raro es</summary><p>${escape(card.odds.condition)}</p></details>
   ${address?`<div class="rare-actions"><button data-rare-copy="${index}">Copiar lugar</button><button data-rare-return="${index}" ${canReturn?'':'disabled'}>Orientar</button></div>${canReturn?'':'<p class="rare-provenance">Para regresar, abre su semilla y versión desde Explorar mundos.</p>'}`:''}
  </article>`;
 }
 function cards(){
  const items=ensure().items,pages=Math.max(1,Math.ceil(items.length/RARE_PAGE_SIZE));page=Math.max(0,Math.min(page,pages-1));$('rareCodeFallback').hidden=true;
  if(!items.length)return '<article class="journal-card"><h3>Libro de hallazgos</h3><p>Lo raro deja una tarjeta: fósiles, reliquias, anomalías, cajas naturales y compañía de caja. Encuentra algo y el libro guardará su lugar.</p></article>';
  const list=items.map((c,index)=>({c,index})).reverse().slice(page*RARE_PAGE_SIZE,(page+1)*RARE_PAGE_SIZE);
  return `<div class="rare-book-head"><h3>Libro de hallazgos · ${items.length}</h3><p>Cada encuentro tiene su tarjeta. Volver al mismo ejemplar no duplica; otro lugar sí. El código conserva semilla, versiones, capa y coordenadas.</p></div><div class="rare-grid">${list.map(({c,index})=>cardHTML(c,index)).join('')}</div>
   <div class="rare-pager"><button data-rare-page="-1" ${page?'':'disabled'} aria-label="Página anterior de hallazgos">‹</button><span>${page+1} / ${pages}</span><button data-rare-page="1" ${page+1<pages?'':'disabled'} aria-label="Página siguiente de hallazgos">›</button></div>`;
 }
 async function action(event){
  const button=event.target.closest('button[data-rare-copy],button[data-rare-return],button[data-rare-page]');if(!button||button.disabled)return;
  if(button.dataset.rarePage){const delta=Number(button.dataset.rarePage);if(![-1,1].includes(delta))return;page+=delta;runtime.refreshJournal?.();(document.querySelector('[data-rare-page="'+button.dataset.rarePage+'"]:not(:disabled)')||document.querySelector('[data-rare-page]:not(:disabled)'))?.focus();return;}
  const index=Number(button.dataset.rareCopy??button.dataset.rareReturn),book=ensure(),card=Number.isInteger(index)&&book.items[index];if(!card?.address)return;
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
 $('rareNoticeDismiss').onclick=dismiss;
 $('rareNoticeOpen').onclick=()=>{if(!shown)return;const index=ensure().items.findIndex(c=>c.id===shown.id);page=Math.floor(Math.max(0,ensure().items.length-1-index)/RARE_PAGE_SIZE);dismiss();runtime.openJournal('rares');};
 runtime.VOZ.tarjeta1='Un hallazgo merece memoria. Su tarjeta conserva el lugar y la voz de este mundo.';
 runtime.ACH.push(['tarjeta1','Un hallazgo tiene memoria','Guardaste una tarjeta de un encuentro poco común.']);
 ensure();
 Object.defineProperties(runtime,{collectRareCard:{get:()=>collect},rareCardTick:{get:()=>tick},rareBookCards:{get:()=>cards},rareBookAction:{get:()=>action},rareCards:{get:()=>ensure().items},rareNoticeState:{get:()=>({shown:shown?.id||null,remaining,pending:queue.length})}});
}
