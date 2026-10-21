import {openSurface,prefersReducedMotion} from './frame-state.js';
import {TOTEM_DAILY_LIMIT} from './sculpture-totems-model.js';
import {CUBE_SHOP_SLOTS,shopPiece,shopSlot,wearing} from './cube-shop-model.js';
import {pieceImage} from './cube-shop-preview.js';
import {SHOP_PULSES} from './cube-shop-pulse.js';
import {crystalFragments,fragmentMask} from './crystal-play-model.js';
import {POWERS,POWER_IDS} from './expansion-music.js';
import {SPARK_JUMP_COST,SPARK_SITE_LIMIT,SPARK_SHOP,SPARK_SETS,SPARK_BADGES,SPARK_MILESTONES,SPARK_UNIVERSE,universeProgress,sparkNumber,normalizeSparkEconomy,creditSparks,debitSparks,claimSparkReward,sparkSetProgress} from './sparks-model.js';
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function initialize(runtime){
 const $=runtime.$;let owner=null,day='',clock=0,refresh=0,lastDistance=0,sessionDistance=0,segment=0,anchor=null,home=null,homeTime=0,newCards=new Set(),neighbors=new Set(),worldBroken=0,inspector={id:'',count:0},lastJump=null,delta=0,deltaUntil=0,trail=[],lastTrail=null,pickups=[],jumpAvailable=false,jumpUntil=0;
 const active=()=>runtime.inWorld()&&!document.hidden&&!runtime.scanning&&!runtime.noticeLane?.inspecting&&!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 function book(){
  if(owner!==runtime.S){owner=runtime.S;owner.sparkEconomy=normalizeSparkEconomy(owner.sparkEconomy,owner.sparks,owner.todayKey);day=owner.todayKey;clock=0;refresh=0;lastDistance=sparkNumber(owner.playerProfile?.distanceUnits);sessionDistance=0;segment=0;anchor=home=null;homeTime=0;newCards=new Set();neighbors=new Set();worldBroken=0;inspector={id:'',count:0};lastJump=null;trail=[];lastTrail=null;delta=0;deltaUntil=0;pickups=[];jumpAvailable=owner.sparkEconomy.earned>=SPARK_JUMP_COST;jumpUntil=0;}
  const q=owner.sparkEconomy;if(q.version===1&&day!==owner.todayKey){day=owner.todayKey;q.day=day;q.sites={};q.totems={};}
  return q;
 }
 function commit(change){const q=book();if(q.version!==1)return false;const before={sparks:owner.sparks,sparkEconomy:structuredClone(q),pathCrystals:owner.pathCrystals?.slice(),todayLight:owner.todayLight,totalLight:owner.totalLight};
  if(change(q)===false){Object.assign(owner,before);return false;}
  if(runtime.save()===false){Object.assign(owner,before);return false;}return true;
 }
 function changeNotice(amount){if(!amount)return;delta=clock<deltaUntil&&Math.sign(delta)===Math.sign(amount)?delta+amount:amount;deltaUntil=clock+1.5;if(amount>0&&!jumpAvailable&&book().earned>=SPARK_JUMP_COST){jumpAvailable=true;jumpUntil=clock+3;notice('Ya puedes saltar');}}
 function notice(title,text=''){runtime.toast?.(title+(text?' · '+text:''),{level:2,category:'spark-result',detail:'sparks',ttl:120000});}
 function crystal(o,action,path=false,fragment=null,dim=false){
  const q=book();if(q.version!==1||runtime.labMode||owner.previewSeed&&!runtime.realTravel)return null;
  const prior=q.sites[o.id];if(!prior&&Object.keys(q.sites).length>=SPARK_SITE_LIMIT)return null;
  if(action==='hit'&&prior?.broken||action==='collect'&&(!prior?.broken||prior.collected))return prior?{...prior}:null;
  if(path&&owner.pathCrystals.includes(o.id))return prior?{...prior}:null;
  let amount=0,result=null,first=false;
  const ok=commit(next=>{const p=next.sites[o.id]||{x:o.x,y:o.y,size:o.size,value:o.value,hits:0,broken:false,collected:false,rare:!path&&o.rare===true,fragments:0};
   if(action==='hit'){p.hits++;p.broken=p.hits>=o.size;if(p.broken){if(!path||owner.pathCrystals.length<10)next.stats.broken++;if(path){p.collected=true;p.fragments=fragmentMask(p);if(owner.pathCrystals.length<10){first=!owner.pathCrystals.length;owner.pathCrystals.push(o.id);owner.todayLight=(owner.todayLight||0)+1;owner.totalLight=(owner.totalLight||0)+1;amount=creditSparks(owner,o.value);}}}}
   else if(action==='collect'){const remaining=crystalFragments(p,p.rare===true).filter(f=>!((p.fragments||0)&(1<<f.index))&&(fragment===null||fragment===f.index));if(!remaining.length)return false;for(const f of remaining){p.fragments=(p.fragments||0)|(1<<f.index);amount+=creditSparks(owner,dim&&f.rare?1:f.value);}p.collected=p.fragments===fragmentMask(p);}else return false;
   next.sites[o.id]=p;result={...p};
  });
  if(!ok)return null;if(amount)changeNotice(amount);if(action==='hit'&&result.broken&&!path)worldBroken++;if(first)runtime.onFirstLight?.();if(path)runtime.hud?.();return result;
 }
 function rewardTotem(id){
  const q=book();if(q.version!==1||typeof id!=='string'||!id.startsWith('totem:v1:')||id.length>=120)return false;
  if(runtime.labMode||owner.previewSeed&&!runtime.realTravel||q.totems[id]||Object.keys(q.totems).length>=TOTEM_DAILY_LIMIT)return {amount:0};
  let amount=0;if(!commit(next=>{next.totems[id]=true;amount=creditSparks(owner,2);} ))return false;
  changeNotice(amount);if(amount)pickup(amount,{x:owner.wx,y:owner.wy});return {amount};
 }
 function reserveJump(){const q=book();if(q.version!==1||sparkNumber(owner.sparks)<SPARK_JUMP_COST){notice('Necesitas '+Math.max(0,SPARK_JUMP_COST-sparkNumber(owner.sparks))+' chispas más');return false;}
  const ticket={balance:owner.sparks,economy:structuredClone(q)};debitSparks(owner,SPARK_JUMP_COST);q.stats.jumps++;q.stats.sinceJump=0;return ticket;
 }
 function cancelJump(ticket){if(ticket){owner.sparks=ticket.balance;owner.sparkEconomy=ticket.economy;}}
 function confirmJump(place=''){lastJump={at:clock};segment=0;anchor=null;sessionDistance=0;newCards=new Set();neighbors=new Set();trail=[];lastTrail=null;changeNotice(-SPARK_JUMP_COST);notice(place?'Llegaste · '+place:'Salto realizado','Vuelve gratis al punto anterior');}
 function returned(){if(lastJump&&clock-lastJump.at<30)award('badge:wrong',0,'No era por aquí','Volviste antes de treinta segundos.');lastJump=null;}
 function award(id,value,title,text){if(Object.hasOwn(book().claims,id))return false;let amount=0;const ok=commit(()=>{const before=owner.sparks;if(!claimSparkReward(owner,id,value,title,text))return false;amount=owner.sparks-before;});if(ok){changeNotice(amount);notice(title,text+(amount?' · +'+amount+' chispas':''));}return ok;}
 function inspect(id){if(inspector.id!==id)inspector={id,count:0};inspector.count++;}
 function found(card){if(card.forced||runtime.labMode||owner.previewSeed&&!runtime.realTravel)return;newCards.add(card.type);if(sparkSetProgress({rareBook:{items:[card]}}).neighbors)neighbors.add(card.type);}
 function tick(dt,paused=false){
  const q=book();if(q.version!==1)return;const step=Math.max(0,Math.min(.1,dt||0));if(document.hidden)return;
  clock+=step;const dist=sparkNumber(owner.playerProfile?.distanceUnits),walk=Math.max(0,dist-lastDistance);lastDistance=dist;
  if(paused||!active()||runtime.labMode||owner.previewSeed&&!runtime.realTravel)return;
  sessionDistance+=walk;segment+=walk;q.stats.sinceJump+=walk;
  const point={x:owner.wx,y:owner.wy,layer:owner.layer||'superficie'};
  if(!anchor)anchor={...point};if(!home||home.layer!==point.layer||Math.hypot(home.x-point.x,home.y-point.y)>70){home={...point};homeTime=0;}else homeTime+=step;
  refresh+=step;if(refresh<.25)return;refresh=0;
  const progress=sparkSetProgress(owner),earned=[];
  for(const set of SPARK_SETS)if(progress[set.id]>=set.need&&!q.claims['set:'+set.id])earned.push({id:'set:'+set.id,value:set.reward,title:set.title,text:set.name+' completa'});
  for(const m of SPARK_MILESTONES)if(dist>=m.meters*10&&!q.claims['distance:'+m.meters])earned.push({id:'distance:'+m.meters,value:0,title:m.title,text:m.meters+' metros caminados'});
  if(!q.claims['universe:complete']&&universeProgress(owner).complete)earned.push({id:'universe:complete',value:0,title:SPARK_UNIVERSE.title,text:SPARK_UNIVERSE.name});
  const checks={inspector:inspector.count>=5,resident:homeTime>=120,expedition:sessionDistance>=5000&&anchor.layer===point.layer&&Math.hypot(anchor.x-point.x,anchor.y-point.y)<80,errand:newCards.size>=3,neighbors:neighbors.size>=3,last:worldBroken>=10,taxi:q.stats.sinceJump>=10000};
  for(const b of SPARK_BADGES)if(checks[b.id]&&!q.claims['badge:'+b.id])earned.push({id:'badge:'+b.id,value:b.reward,title:b.name,text:b.text});
  if(earned.length){let amount=0;const ok=commit(()=>{for(const e of earned){const before=owner.sparks;claimSparkReward(owner,e.id,e.value,e.title,e.text);amount+=owner.sparks-before;}});if(ok){changeNotice(amount);notice(earned.length===1?earned[0].title:earned.length+' objetivos completados',amount?'+'+amount+' chispas':'Consúltalos en Tu cubo · Viaje');}}
 }
 function buy(id){const p=SPARK_SHOP.find(p=>p.id===id),q=book();if(!p||q.version!==1||q.purchases[id])return false;
  if(sparkNumber(owner.sparks)<p.cost){$('cubeHint').textContent='Te faltan '+(p.cost-sparkNumber(owner.sparks))+' ✦ para '+p.name+'.';return false;}
  if(!commit(next=>{if(!debitSparks(owner,p.cost))return false;next.purchases[id]=owner.todayKey||true;next.log.push({title:p.name,text:'Compra permanente · '+p.cost+' chispas',at:owner.todayKey});next.log=next.log.slice(-80);})){ $('cubeHint').textContent='No se guardó. Conservamos tus chispas.';return false;}
  changeNotice(-p.cost);equip(id);if(p.slot==='trail'&&runtime.cubeSettings?.()?.trail!=='none')runtime.chooseCubeStyle?.('trail','none');if(SHOP_PULSES.includes(id)&&(runtime.cubeSettings?.()?.pulse||'ring-0')!=='ring-0')runtime.chooseCubeStyle?.('pulse','ring-0');if(p.slot==='pulseVoice'&&(runtime.cubeSettings?.()?.voice||'natural')!=='natural')runtime.chooseCubeStyle?.('voice','natural');render();runtime.renderCube?.();$('cubeHint').textContent='Ya llevas '+p.name+'. Está en Llevar.';notice('Compraste '+p.name,'Ya lo llevas');return true;
 }
 // Each slot holds one piece (or several where the slot allows many); '' takes everything off.
 function equip(id){const q0=book();if(q0.version!==1)return false;if(id&&(!q0.purchases[id]||!shopPiece(id)))return false;const ok=commit(q=>{q.wear={...(q.wear||{})};q.on={...(q.on||{})};if(!id){q.wear={};q.on={};q.equipped='';return;}const p=shopPiece(id);if(shopSlot(p.slot)?.many)q.on[id]=true;else q.wear[p.slot]=id;q.equipped=id;});if(ok){trail=[];render();}return ok;}
 function unequip(id){const q0=book();if(q0.version!==1||!wearing(q0,id))return false;const ok=commit(q=>{const p=shopPiece(id);q.wear={...(q.wear||{})};q.on={...(q.on||{})};if(shopSlot(p.slot)?.many)delete q.on[id];else delete q.wear[p.slot];if(q.equipped===id)q.equipped=Object.values(q.wear).find(v=>shopPiece(v))||'';});if(ok){trail=[];render();}return ok;}
 function goalText(){const q=book(),progress=sparkSetProgress(owner),goal=q.goal;
  if(goal==='none')return '';if(goal==='jump')return owner.sparks>=SPARK_JUMP_COST?'Salto disponible · '+SPARK_JUMP_COST+' ✦':'Próximo salto · '+sparkNumber(owner.sparks)+'/'+SPARK_JUMP_COST+' ✦';
  const p=SPARK_SHOP.find(p=>'shop:'+p.id===goal);if(p)return q.purchases[p.id]?p.name+' · Meta cumplida':p.name+' · '+Math.min(owner.sparks,p.cost)+'/'+p.cost+' ✦';
  const set=SPARK_SETS.find(p=>'set:'+p.id===goal);if(set)return set.name+' · '+(q.claims['set:'+set.id]?'Meta cumplida':Math.min(progress[set.id],set.need)+'/'+set.need);
  if(goal==='universe'){const u=universeProgress(owner);return q.claims['universe:complete']?SPARK_UNIVERSE.name+' · Meta cumplida':'Universo · '+u.value+'/'+u.need;}
  const m=SPARK_MILESTONES.find(p=>'distance:'+p.meters===goal);if(m)return q.claims['distance:'+m.meters]?m.title+' · Meta cumplida':'Camina · '+Math.min(Math.floor((owner.playerProfile?.distanceUnits||0)/10),m.meters)+'/'+m.meters+' m';return '';
 }
 function render(){const q=book();if(q.version!==1){$('sparkStatus').textContent='Actualiza para usar estas chispas.';$('sparkShop').innerHTML='';$('sparkJump').disabled=true;return;}const p=sparkSetProgress(owner);$('sparkBalance').textContent='✦ '+sparkNumber(owner.sparks);$('sparkLedger').textContent='Ganadas '+q.earned+' · Gastadas '+q.spent;
  const ink=runtime.musicInk?.(null,'lead')||'#fff',color=runtime.cubeColor?.()||'#fff',reduced=!!(owner.reducedMotion||prefersReducedMotion()),left=SPARK_SHOP.filter(p=>!q.purchases[p.id]);
  // The shop lists only what you do not have; each picture is drawn by the game itself.
  $('sparkShop').innerHTML=left.length?CUBE_SHOP_SLOTS.filter(slot=>left.some(p=>p.slot===slot.id)).map(slot=>'<h4 class="spark-slot">'+slot.name+'</h4>'+left.filter(p=>p.slot===slot.id).map(p=>'<article data-slot="'+slot.id+'" data-piece="'+p.id+'" data-afford="'+(sparkNumber(owner.sparks)>=p.cost)+'"><img class="spark-picture" alt="" src="'+pieceImage(p.id,{color,ink,reduced})+'"><h3>'+p.name+' <span>'+p.cost+' ✦</span></h3><p>'+p.text+'</p><button data-spark-buy="'+p.id+'" aria-label="Comprar '+p.name+' por '+p.cost+' chispas">'+(sparkNumber(owner.sparks)>=p.cost?'Comprar':'Faltan '+(p.cost-sparkNumber(owner.sparks))+' ✦')+'</button></article>').join('')).join(''):'<p class="spark-empty">Ya tienes todo lo de la tienda.</p>';
  const u=universeProgress(owner);
  $('sparkSets').innerHTML='<article><h3>'+SPARK_UNIVERSE.name+'</h3><p>'+u.parts.map(x=>x.name+' '+x.value+'/'+x.need).join(' · ')+'</p><p>'+u.value+'/'+u.need+' · '+(q.claims['universe:complete']?'Completado':'Título · '+SPARK_UNIVERSE.title)+'</p></article>'+SPARK_SETS.map(s=>'<article><h3>'+s.name+'</h3><p>'+({band:'Encuentra tarjetas de percusión, bajo, melodía y acordes.',neighbors:'Encuentra tres especies distintas de fauna viva.',wonders:'Encuentra tres tipos de reliquias, anomalías o fenómenos.'}[s.id])+'</p><p>'+Math.min(p[s.id],s.need)+'/'+s.need+' · '+(q.claims['set:'+s.id]?'Completada':'+'+s.reward+' ✦ · '+s.title)+'</p></article>').join('');
  $('sparkBadges').innerHTML=SPARK_BADGES.map(b=>'<p>'+ (q.claims['badge:'+b.id]?'<b>'+b.name+'</b> · '+b.text:'Logro secreto · Sigue explorando.')+'</p>').join('')+SPARK_MILESTONES.map(m=>'<p>'+m.meters+' m · '+m.title+(q.claims['distance:'+m.meters]?' · Ganado':'')+'</p>').join('');
  const titles=Object.keys(q.claims).map(id=>SPARK_BADGES.find(b=>'badge:'+b.id===id)?.name||SPARK_SETS.find(s=>'set:'+s.id===id)?.title||SPARK_MILESTONES.find(m=>'distance:'+m.meters===id)?.title||(id==='universe:complete'?SPARK_UNIVERSE.title:undefined)).filter(Boolean);
  $('sparkTitle').innerHTML='<option value="">Sin título</option>'+titles.map(t=>'<option '+(q.title===t?'selected':'')+'>'+escape(t)+'</option>').join('');
  $('sparkGoalSelect').innerHTML=[['none','Sin meta'],['jump','Ahorrar para un salto'],...SPARK_SHOP.map(p=>['shop:'+p.id,p.name]),...SPARK_SETS.map(p=>['set:'+p.id,p.name]),['universe',SPARK_UNIVERSE.name],...SPARK_MILESTONES.map(p=>['distance:'+p.meters,p.meters+' metros'])].map(([id,t])=>'<option value="'+id+'" '+(q.goal===id?'selected':'')+'>'+t+'</option>').join('');
  $('sparkLog').innerHTML=q.log.slice().reverse().map(e=>'<p><b>'+escape(e.title)+'</b> · '+escape(e.text)+'</p>').join('')||'<p>Tu recorrido empieza aquí.</p>';
  $('sparkStatus').textContent=!runtime.inWorld()?'Rompe diez cristales para entrar al Mundo.':sparkNumber(owner.sparks)<SPARK_JUMP_COST?'Rompe cristales y recoge sus fragmentos. Te faltan '+(SPARK_JUMP_COST-sparkNumber(owner.sparks))+' chispas para saltar.':(SPARK_SHOP.some(p=>!book().purchases?.[p.id])?'Puedes saltar o ahorrar para una apariencia permanente.':'Tienes todas las apariencias. Usa tus chispas para saltar.');const travel=runtime.inWorld()&&runtime.canPracticeTravel?.()!==false;$('sparkBack').disabled=!travel||!owner.practiceTravel?.previous;$('sparkJump').disabled=!travel||sparkNumber(owner.sparks)<SPARK_JUMP_COST;
 }
 function open(tab='travel'){runtime.openCube?.(tab);render();}
 function hud(){const q=book(),total=$('sparkTotal'),gain=$('sparkGain');if(!total)return;total.textContent='✦ '+sparkNumber(owner.sparks)+' chispas';gain.textContent=clock<deltaUntil?(delta>0?'+':'')+delta:'';$('sparkCount').classList.toggle('collecting',clock<deltaUntil);$('bJump').classList.toggle('spark-ready',clock<jumpUntil);$('sparkGoal').textContent=goalText();$('sparkGoal').hidden=!runtime.inWorld()||!goalText();$('sparkTitleHud').textContent=q.title||'';const powers=POWER_IDS.filter(id=>(runtime.powerSecondsLeft?.(id)||0)>0);$('sparkPowerHud').hidden=!runtime.inWorld()||!powers.length;$('sparkPowerText').textContent=powers.map(id=>POWERS[id].name+' '+Math.ceil(runtime.powerSecondsLeft(id))+' s').join(' · ');}
 function pickup(amount,point){
  if(!(amount>0))return;const q=book(),last=pickups.at(-1);
  if(last&&clock-last.at<.12){last.amount+=amount;return;}
  pickups.push({amount,at:clock,x:runtime.W/2+(point.x-(runtime.inWorld()?owner.wx:owner.px)),y:runtime.H/2+(point.y-(runtime.inWorld()?owner.wy:owner.py))});pickups=pickups.slice(-5);
 }
 function drawPickups(){
  pickups=pickups.filter(p=>clock-p.at<1);if(!pickups.length)return;
  const c=runtime.cx,still=owner.reducedMotion||prefersReducedMotion(),rect=$('sparkTotal').getBoundingClientRect?.(),target={x:rect?rect.x+rect.width/2:runtime.W-40,y:rect?rect.y+rect.height/2:45};
  c.save();c.font='600 14px "Geist Mono",monospace';c.textAlign='center';c.fillStyle='#e9ca7d';
  for(const p of pickups){const age=clock-p.at,k=still?0:age*age;c.globalAlpha=Math.min(1,(1-age)*2);c.fillText('+'+p.amount+' ✦',p.x+(target.x-p.x)*k,p.y-18+(target.y-p.y+18)*k);if(!still){c.strokeStyle='#fff';c.globalAlpha=(1-age)*.35;c.beginPath();c.arc(p.x,p.y,4+age*12,0,Math.PI*2);c.stroke();}}
  c.restore();
 }
 function draw(t){const q=book();if(active())drawPickups();if(!active()||!Object.keys(q.wear||{}).length&&!Object.keys(q.on||{}).length)return;const c=runtime.cx,x=runtime.W/2,y=runtime.H/2,still=owner.reducedMotion||prefersReducedMotion();c.save();c.strokeStyle=c.fillStyle='#fff';c.lineWidth=.8;
  if(wearing(q,'orbit')){for(let i=0;i<3;i++){const a=i*Math.PI*2/3+(still?0:t/1300);c.globalAlpha=.55;c.fillRect(x+Math.cos(a)*20-1,y+Math.sin(a)*20-1,2,2);}}
  if(wearing(q,'facet'))for(const w of runtime.waves||[]){c.globalAlpha=Math.max(0,1-w.r/w.max)*.3;c.beginPath();c.moveTo(w.x+runtime.W/2-owner.wx,w.y+runtime.H/2-owner.wy-w.r);c.lineTo(w.x+runtime.W/2-owner.wx+w.r,w.y+runtime.H/2-owner.wy);c.lineTo(w.x+runtime.W/2-owner.wx,w.y+runtime.H/2-owner.wy+w.r);c.lineTo(w.x+runtime.W/2-owner.wx-w.r,w.y+runtime.H/2-owner.wy);c.closePath();c.stroke();}
  // Reduced motion keeps the purchase visible: a still scatter of dust at the cube's feet instead of a moving trail.
  if(wearing(q,'dust')&&still){c.globalAlpha=.5;for(const [dx,dy] of [[-11,13],[-5,16],[2,14],[8,17],[13,12],[-14,9]])c.fillRect(x+dx,y+dy,1,1);}
  if(wearing(q,'dust')&&!still){if(!lastTrail||Math.hypot(owner.wx-lastTrail.x,owner.wy-lastTrail.y)>400){trail=[];lastTrail={x:owner.wx,y:owner.wy};}if(Math.hypot(owner.wx-lastTrail.x,owner.wy-lastTrail.y)>9){trail.push({x:owner.wx,y:owner.wy,at:clock});lastTrail={x:owner.wx,y:owner.wy};}trail=trail.filter(p=>clock-p.at<.8).slice(-20);for(const p of trail){c.globalAlpha=(1-(clock-p.at)/.8)*.5;c.fillRect(p.x+x-owner.wx,p.y+y-owner.wy,1,1);}}
  c.restore();
 }
 $('sparkGoal').onclick=()=>open();
 for(const id of ['bJump','sparkJump'])$(id).textContent='Saltar · '+SPARK_JUMP_COST+' ✦';
 $('sparkJump').onclick=()=>{if(sparkNumber(runtime.S.sparks)<SPARK_JUMP_COST){$('sparkStatus').textContent='Necesitas '+(SPARK_JUMP_COST-sparkNumber(runtime.S.sparks))+' chispas más.';return;}$('mCube').hidden=true;runtime.jumpPracticePlace();};
 $('sparkBack').onclick=()=>{$('mCube').hidden=true;runtime.returnPracticePlace();};
 $('sparkShop').onclick=e=>{const b=e.target.closest('[data-spark-buy]');if(b)buy(b.dataset.sparkBuy);};
 $('sparkGoalSelect').onchange=e=>{commit(q=>{q.goal=e.target.value;});};$('sparkTitle').onchange=e=>{commit(q=>{q.title=e.target.value;});};
 $('toast').addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&$('toast').dataset.detail==='save'){e.preventDefault();runtime.noticeLane?.cancel('toast');runtime.openSaveTools?.();}});
 $('sparkPowerUndo').onclick=()=>runtime.undoBoxPowers?.();
 $('toast').addEventListener('click',()=>{if($('toast').dataset.detail==='sparks')open();if($('toast').dataset.detail==='save'){runtime.noticeLane?.cancel('toast');runtime.openSaveTools?.();}});
 Object.defineProperties(runtime,{rewardTotem:{get:()=>rewardTotem},showSparkPickup:{get:()=>pickup},sparkEconomy:{get:()=>book()},sparkTick:{get:()=>tick},drawSparkEconomyHUD:{get:()=>hud},drawSparkCosmetics:{get:()=>draw},openSparks:{get:()=>open},renderSparks:{get:()=>render},buySparkStyle:{get:()=>buy},equipSparkStyle:{get:()=>equip},unequipSparkStyle:{get:()=>unequip},crystalTransaction:{get:()=>crystal},savedCrystal:{get:()=>id=>book().sites?.[id]},inspectSpentCrystal:{get:()=>inspect},sparkCardFound:{get:()=>found},sparkJumpEarned:{get:()=>()=>book().version===1&&(book().earned>=SPARK_JUMP_COST||book().stats.jumps>0)},canAffordSparkJump:{get:()=>()=>book().version===1&&sparkNumber(runtime.S.sparks)>=SPARK_JUMP_COST},reserveSparkJump:{get:()=>reserveJump},cancelSparkJump:{get:()=>cancelJump},confirmSparkJump:{get:()=>confirmJump},sparkReturn:{get:()=>returned}});book();
}
