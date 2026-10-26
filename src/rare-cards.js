import {openSurface,calmMotion} from './frame-state.js';
import {installNoticeLane} from './notice-lane.js';
import {POWERS} from './expansion-music.js';
import {livingDefinition} from './living-catalog.js';
import {RARE_BOOK_LIMIT,RARE_PAGE_SIZE,CARD_TIERS,rareDefinition,rarityLabel,cardSerial,makeRareCard,normalizeRareBook,storeRareCard,cardAbility,learnCardEncounter,commitCardTechnique,CARD_TECHNIQUES} from './rare-card-model.js';
import {rarePortrait} from './rare-card-art.js';
import {relicAt} from './relics.js';
import {encodePlace} from './share-tools.js';
import {sameWorld} from './world-identity.js';
import {queueRareNotice} from './rare-card-model.js';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function initialize(runtime){
 const $=runtime.$,lane=installNoticeLane(runtime);let owner=null,queue=[],shown=null,remaining=0,page=0,fullNoticed=false,filter='todo',roleFilter='todo',effects=[],noticeTimes=new Map();
 const active=()=>runtime.inWorld()&&!document.hidden&&!runtime.scanning&&!$('voice').classList.contains('expanded')&&!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 function hide(){const notice=$('rareNotice');notice.dataset.inspect='false';lane.hide(notice);document.body.classList.remove('rare-reveal');}
 function dismiss(){const focused=$('rareNotice').contains(document.activeElement);shown=null;remaining=0;hide();lane.release('rare');if(queue.length)lane.request('rare',{level:2});if(focused)$('w').focus({preventScroll:true});}
 function location(card){return card.precision==='unknown'?'Lugar original no registrado':`${card.regionName} · ${Math.round(card.address.x)}, ${Math.round(card.address.y)}${card.precision==='region'?' · centro aproximado':''}`;}
 function ensure(){
  if(owner!==runtime.S){owner=runtime.S;queue=[];dismiss();page=0;filter=roleFilter='todo';noticeTimes.clear();fullNoticed=false;
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
  const book=ensure();if(book.readOnly||!runtime.inWorld()||!rareDefinition(type))return false;
  const demonstration=runtime.labMode||runtime.S.previewSeed&&!runtime.realTravel;const card=descriptor(type,source,demonstration?{...extra,forced:true}:extra);if(!card)return false;
  const repeated=book.items.some(c=>c.type===type&&!c.forced);const result=storeRareCard(book,card);if(result==='added')runtime.recordRewardSource?.('finding',card.odds.tier==='legendario'?'singular':card.odds.tier);
  const original=book.items.find(c=>c.id===card.id);if(original&&learnCardEncounter(original,card.context)&&result==='duplicate')runtime.save();
  if(result==='full'){if(!fullNoticed){fullNoticed=true;runtime.toast?.('Libro completo. No caben más tarjetas.');}return false;}
  if(result==='duplicate'&&card.context?.phase){const original=book.items.find(c=>c.id===card.id);const next={at:new Date().toISOString(),phase:card.context.phase,weather:card.context.weather||''};if(!original.observations.some(o=>o.phase===next.phase&&o.weather===next.weather)){original.observations.push(next);if(original.observations.length>8)original.observations.shift();runtime.save();}}
  if(result!=='added')return false;
  // Collection never starts audio, touches the cube, changes a beat or opens a modal.
  runtime.unlock?.('tarjeta1');runtime.save();if(!card.forced&&card.address){effects.push({x:card.address.x,y:card.address.y,layer:card.address.layer,ink:CARD_TIERS[card.odds.tier].ink,age:0});effects=effects.slice(-3);}if(['legendario','mitico'].includes(card.odds.tier)&&!card.forced)runtime.say?.('Una presencia excepcional dejó su voz contigo.','Hallazgo excepcional',{recordOnly:true});
  runtime.sparkCardFound?.(card);if(repeated)return true;
  if(!runtime.boxCardCelebration?.(card)){
   const important=!repeated&&(card.forced||card.type==='fossil'||card.type.startsWith('relic:')||['singular','legendario','mitico'].includes(card.odds.tier));
   if(!important){noticeTimes.set(card.type,performance.now());runtime.toast?.((repeated?'Otro ejemplar':'Nueva tarjeta')+' · '+card.name,{level:repeated?1:2,category:'hallazgo',coalesce:true});return true;}
   queueRareNotice(queue,{card,repeated});if(queue.length)lane.request('rare',{level:2});} // Every card is saved; the rarest pending finds get presentation priority.
  return true;
 }
 function reveal({card,repeated}){
  const def=rareDefinition(card.type),notice=$('rareNotice');notice.style.setProperty('--rare-ink',CARD_TIERS[card.odds.tier].ink);
  $('rareNoticeArt').innerHTML=rarePortrait(card,{scene:true});const ability=cardAbility(card);$('rareNoticeAbility').textContent=ability.name+' · '+ability.text;$('rareNoticeSerial').textContent='#'+cardSerial(card.id);$('rareNoticeTier').textContent=card.forced?'Muestra de laboratorio':CARD_TIERS[card.odds.tier].name+(repeated?' · Otro ejemplar':' · Primera voz');
  $('rareNoticeName').textContent=card.name;$('rareNoticeWhere').textContent=location(card);$('rareNoticeWhere').title=location(card);$('rareNoticeOdds').textContent=rarityLabel(card.type,card.odds);
  $('rareNoticeContinue').textContent='Ver tarjeta';$('rareNoticeOpen').textContent='Libro';noticeTimes.set(card.type,performance.now());shown=card;remaining=4.5;notice.dataset.noticeLevel='2';notice.dataset.earned=String(!repeated&&!card.forced&&!card.legacy);notice.dataset.repeat=String(repeated);notice.dataset.inspect='false';notice.dataset.layout='compact';notice.setAttribute('role','status');notice.setAttribute('aria-modal','false');notice.setAttribute('aria-labelledby','rareNoticeName');lane.show(notice);document.body.classList.add('rare-reveal');
 }
 function tick(dt){
  ensure();if(!runtime.inWorld()){effects=[];queue=[];dismiss();return;}
  if(!active()||lane.blocked()){$('rareNotice').hidden=true;return;}
  for(const e of effects)e.age+=Math.min(.1,Math.max(0,dt));effects=effects.filter(e=>e.age<2);
  if(shown){lane.show($('rareNotice'));if($('rareNotice').dataset.inspect!=='true')remaining-=Math.max(0,dt);if(remaining<=0)dismiss();}
  else if(queue.length){lane.request('rare',{level:2});if(lane.claim('rare'))reveal(queue.shift());}else lane.cancel('rare');
 }
 function cardHTML(card,index){
  const ability=cardAbility(card),context=[{contacto:'Contacto',quietud:'Quietud',orbita:'Órbita',presion:'Permanencia'}[card.context?.gesture],card.context?.phase,card.context?.weather].filter(v=>typeof v==='string'&&v);const power=card.type.startsWith('box:')?POWERS[card.type.slice(4)]:null;const powerInfo=power?'<p>'+escape(power.text)+'</p><p>'+power.seconds+' s por caja · sin acumulación</p>':'';
  const def=rareDefinition(card.type),tier=CARD_TIERS[card.odds.tier],address=card.address,canReturn=address&&sameWorld(address,runtime.worldIdentity),serial=cardSerial(card.id);
  const date=card.firstSeen?new Intl.DateTimeFormat('es-EC',{day:'numeric',month:'short',year:'numeric'}).format(new Date(card.firstSeen)):card.day||'Fecha original no registrada';
  return `<article class="rare-card" tabindex="-1" data-card-id="${escape(card.id)}" style="--rare-ink:${tier.ink}"><header><span>${escape(card.forced?'Laboratorio':tier.name)}</span><small>#${serial}</small></header>
   <div class="rare-portrait">${rarePortrait(card)}</div><h3>${escape(card.name)}</h3><div class="card-ability"><b>${escape(ability.name)}</b><span>${escape(ability.text)}</span></div><div class="rare-primary-actions"><button data-garden-add="${index}">Añadir al jardín</button><button data-atlas-start="${index}">Buscar una voz complementaria</button></div><details class="rare-card-details"><summary>Lugar, historia y uso</summary><p class="rare-flavour">${escape(def.text)}</p>
   <div class="rare-odds"><b>${escape(rarityLabel(card.type,card.odds))}</b><small>Aparición teórica · ${card.type.startsWith('petbox:')?'de compañía, no de esta especie':'de este tipo'}</small></div>
   <p class="rare-location">${escape(location(card))}</p><p class="rare-biome">${escape([card.biome,runtime.GEN[card.genre]?.name||card.genre,date].filter(Boolean).join(' · '))}</p>
   <p class="rare-biome">Semilla ${escape(card.world.seed||'original')} · ${escape(card.world.layout)} · ${escape(card.address?.layer||'capa no registrada')}</p>
   ${context.length?'<p class="rare-biome">'+escape(context.join(' · '))+'</p>':''}${card.observations?.length?'<p class="rare-biome">'+card.observations.length+' observaciones posteriores</p>':''}
   ${card.forced?'<p class="rare-provenance">Muestra forzada; no demuestra un encuentro natural.</p>':''}${card.legacy?'<p class="rare-provenance">Recuperada del progreso anterior; sin hora original.</p>':''}
   <details><summary>Cómo de raro es</summary><p>${escape(card.odds.condition)}</p></details>
   ${card.learning?.version===1?`<p class="rare-biome">${card.learning.contexts.length} encuentros distintos · ${card.learning.techniques.length} interpretaciones</p>${card.learning.techniques.length<2?'<small>Vuelve bajo otra luz o prueba otro gesto.</small>':''}<button data-rare-technique="${index}" ${card.learning.techniques.length<2?'disabled':''}>Interpretación · ${escape(CARD_TECHNIQUES[card.learning.selected]||'Natural')}</button>`:''}${powerInfo}${address?`<div class="rare-actions"><button data-rare-png="${index}">Imagen</button><button data-rare-copy="${index}">Copiar lugar</button><button data-rare-return="${index}" ${canReturn?'':'disabled'}>Orientar</button></div>${canReturn?'':'<p class="rare-provenance">Encontrada en otra semilla.</p>'}`:''}
  </details></article>`;
 }
 function cards(search=''){
  if(ensure().readOnly)return '<article class="journal-card"><h3>Colección conservada</h3><p>Este libro necesita una versión más reciente.</p></article>';
  const items=ensure().items,mapped=items.map((c,index)=>({c,index})).filter(({c})=>rareDefinition(c?.type)).filter(({c})=>filter==='todo'||(filter==='vida'?c.type.startsWith('living:'):filter==='culturas'?(c.type==='living:study'||c.type==='culture:artifact'):filter==='fenomenos'?c.type.startsWith('anomaly:')||c.type.startsWith('event:'):filter==='cajas'?c.type.startsWith('box:')||c.type.startsWith('petbox:'):livingDefinition(c.type.slice(7))?.group===filter)).filter(({c})=>roleFilter==='todo'||cardAbility(c).role===roleFilter).filter(({c})=>!search||[c.name,c.biome,runtime.GEN[c.genre]?.name,c.context?.instrument].filter(Boolean).join(' ').toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es'))),pages=Math.max(1,Math.ceil(mapped.length/RARE_PAGE_SIZE));page=Math.max(0,Math.min(page,pages-1));$('rareCodeFallback').hidden=true;
  if(!items.length)return '<article class="journal-card"><h3>Libro de hallazgos</h3><p>Descubre una voz rara. Su tarjeta guardará el lugar.</p></article>';
  const list=mapped.reverse().slice(page*RARE_PAGE_SIZE,(page+1)*RARE_PAGE_SIZE);
  return `<div class="rare-book-head"><label for="rareFilter">Colección</label><select id="rareFilter">${[['todo','Todos'],['vida','Universo vivo'],['flora','Flora'],['fauna','Fauna'],['architecture','Construcciones'],['culturas','Estudios'],['fenomenos','Fenómenos'],['cajas','Cajas y visitas']].map(([id,name])=>'<option value="'+id+'" '+(filter===id?'selected':'')+'>'+name+'</option>').join('')}</select><label for="rareRole">Función de jardín</label><select id="rareRole">${[['todo','Todas'],['bajo','Bajo'],['perc','Percusión'],['acorde','Acordes'],['lead','Melodía'],['agudo','Detalle'],['transformacion','Transformación']].map(([id,name])=>'<option value="'+id+'" '+(roleFilter===id?'selected':'')+'>'+name+'</option>').join('')}</select><h3>Libro de hallazgos · ${mapped.length} / ${items.length}</h3><p>Guarda voces. Combínalas en tu jardín sin gastar tarjetas.</p></div><div class="rare-grid">${list.length?list.map(({c,index})=>cardHTML(c,index)).join(''):'<p>No hay hallazgos con estos filtros.</p>'}</div>
   <div class="rare-pager"><button data-rare-page="-1" ${page?'':'disabled'} aria-label="Página anterior de hallazgos">‹</button><span>${page+1} / ${pages}</span><button data-rare-page="1" ${page+1<pages?'':'disabled'} aria-label="Página siguiente de hallazgos">›</button></div>${runtime.atlasBook?.()||''}`;
 }
 async function exportPNG(card){
  await document.fonts.load('400 22px "Geist Mono"');
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=720;const c=canvas.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,512,720);c.strokeStyle=CARD_TIERS[card.odds.tier].ink;c.lineWidth=2;c.strokeRect(24,24,464,672);
  const svg=rarePortrait(card).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace('class="rare-glyph"','stroke="#d7c497" fill="none" stroke-width="1.3"').replace('class="rare-orbit"','stroke="#596268" fill="none"').replace('class="rare-sparks"','stroke="#d7c497" fill="none"');
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));try{const img=new Image();img.src=url;await img.decode();c.drawImage(img,96,110,320,240);c.fillStyle='#e5e9e9';c.font='22px "Geist Mono", monospace';c.textAlign='center';c.fillText(card.name.slice(0,33),256,395);c.font='14px "Geist Mono", monospace';[location(card),rarityLabel(card.type,card.odds),'Semilla '+(card.world.seed||'original'),card.world.layout+' · '+(card.address?.layer||'sin ubicación'),'KUBONO · #'+cardSerial(card.id)].forEach((text,i)=>c.fillText(text.slice(0,49),256,450+i*35));
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Imagen no disponible');const out=URL.createObjectURL(blob),a=document.createElement('a');a.href=out;a.download='kubono-'+cardSerial(card.id)+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(out),1000);
  }catch(_){runtime.toast('No se pudo exportar la imagen. El código del lugar sigue disponible.');}finally{URL.revokeObjectURL(url);}
 }
 async function action(event){
  const button=event.target.closest('button[data-rare-copy],button[data-rare-return],button[data-rare-page],button[data-rare-png],button[data-rare-technique]');if(!button||button.disabled)return;
  if(button.dataset.rarePage){const delta=Number(button.dataset.rarePage);if(![-1,1].includes(delta))return;page+=delta;runtime.refreshJournal?.();(document.querySelector('[data-rare-page="'+button.dataset.rarePage+'"]:not(:disabled)')||document.querySelector('[data-rare-page]:not(:disabled)'))?.focus();return;}
  const index=Number(button.dataset.rareCopy??button.dataset.rareReturn??button.dataset.rarePng??button.dataset.rareTechnique),book=ensure(),card=Number.isInteger(index)&&book.items[index];if(!card||book.readOnly)return;
  if(button.dataset.rareTechnique!==undefined){const technique=commitCardTechnique(card,()=>runtime.save());if(technique)button.textContent='Interpretación · '+CARD_TECHNIQUES[technique];else runtime.toast?.('No se pudo guardar la interpretación.',{level:2});return;}
  if(button.dataset.rarePng!==undefined){await exportPNG(card);return;}if(!card.address)return;
  if(button.dataset.rareCopy!==undefined){
   const code=encodePlace(card.address,card.name);try{await navigator.clipboard.writeText(code);button.textContent='Copiado';}
   catch(_){$('rarePlaceCode').value=code;$('rareCodeFallback').hidden=false;$('rarePlaceCode').focus();$('rarePlaceCode').select();}return;
  }
  if(!sameWorld(card.address,runtime.worldIdentity))return;
  const existing=(runtime.favorites||[]).find(p=>sameWorld(p.address,card.address)&&p.layer===card.address.layer&&Math.hypot(p.x-card.address.x,p.y-card.address.y)<8);
  const point=existing||runtime.addFavoriteAddress?.(card.address,card.name);
  if(point&&runtime.selectDestination?.(point.id))$('mJournal').hidden=true;
  else if(!point)runtime.toast?.(runtime.storageStatus.kind==='ok'?'Favoritos lleno · libera un lugar para orientarte.':'No se pudo guardar en este dispositivo.');
 }
 function drawFinding(){const c=runtime.cx;if(!runtime.inWorld()||document.hidden)return;c.save();for(const e of effects){if(e.layer!==(runtime.S.layer||'superficie'))continue;const x=e.x-runtime.S.wx+runtime.W/2,y=e.y-runtime.S.wy+runtime.H/2,rr=12+(calmMotion(runtime.S)?0:e.age*16);c.globalAlpha=(1-e.age/2)*.7;c.strokeStyle=e.ink;c.lineWidth=1;for(let i=0;i<4;i++){const a=i*Math.PI/2;c.beginPath();c.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);c.lineTo(x+Math.cos(a)*(rr+5),y+Math.sin(a)*(rr+5));c.stroke();}}c.restore();}
 runtime.$('journalBody').addEventListener('change',event=>{if(!['rareFilter','rareRole'].includes(event.target.id))return;if(event.target.id==='rareFilter')filter=event.target.value;else roleFilter=event.target.value;page=0;runtime.refreshJournal?.();document.getElementById(event.target.id)?.focus();});
 $('rareNoticeDismiss').onclick=dismiss;$('rareNoticeContinue').onclick=()=>{if(!shown)return;const notice=$('rareNotice');if(notice.dataset.inspect==='true'){dismiss();return;}notice.dataset.layout='full';notice.dataset.inspect='true';notice.setAttribute('role','dialog');notice.setAttribute('aria-modal','true');$('rareNoticeContinue').textContent='Volver al mundo';$('rareNoticeOpen').textContent='Ver en mi libro';$('rareNoticeContinue').focus({preventScroll:true});};
 $('rareNoticeOpen').onclick=()=>{if(!shown)return;const id=shown.id,index=ensure().items.findIndex(c=>c.id===id);filter=roleFilter='todo';page=Math.floor(Math.max(0,ensure().items.length-1-index)/RARE_PAGE_SIZE);dismiss();runtime.openJournal('rares',{finding:id});};
 runtime.VOZ.tarjeta1='Un hallazgo merece memoria. Su tarjeta guarda el lugar.';
 runtime.ACH.push(['tarjeta1','Un hallazgo tiene memoria','Guardaste una tarjeta de un encuentro poco común.']);
 ensure();
 Object.defineProperties(runtime,{cardTechnique:{get:()=>source=>{if(!source?.id)return null;const b=ensure();if(b.readOnly)return null;const c=b.items.find(c=>c.sourceId===source.id&&sameWorld(c.world,runtime.worldIdentity));return c?.learning?.version===1&&Object.hasOwn(CARD_TECHNIQUES,c.learning.selected)?c.learning.selected:null;}},drawRareFinding:{get:()=>drawFinding},collectRareCard:{get:()=>collect},rareCardTick:{get:()=>tick},rareBookCards:{get:()=>cards},rareBookAction:{get:()=>action},rareCards:{get:()=>ensure().readOnly?[]:ensure().items},rareNoticeState:{get:()=>({shown:shown?.id||null,remaining,pending:queue.length})}});
}
