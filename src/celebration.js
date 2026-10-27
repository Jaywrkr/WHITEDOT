import {openSurface} from './frame-state.js';
import {BOX_SURPRISES} from './box-surprises-model.js';
import {installNoticeLane} from './notice-lane.js';
import {createCelebrationQueue,openingFragments} from './celebration-model.js';
import {playBoxCelebration} from './celebration-audio.js';
import {REWARD_RARITIES} from './rewards-model.js';
import {POWERS} from './expansion-music.js';
import {rarePortrait} from './rare-card-art.js';
import {cardSerial,cardKey} from './rare-card-model.js';
// Jay (27 Oct 2026, alpha.226): opening a magic box says one short, playful line, whole on a phone; the card with every
// detail stays one tap away («Ver»).
export const BOX_LINES=Object.freeze({campo:'¡Orejas de gato! Tu círculo suena más.',cometa:'¡Zum! Eres cometa: corre y suena.',brujula:'¡Brújula! Sigue su giro.',iman:'¡Imán! Lo pequeño baila contigo.',pincel:'¡Pincel! Tu camino canta.',companero:'¡Compañía! Alguien te contesta.'});
export function initialize(runtime){
 const $=runtime.$,lane=installNoticeLane(runtime),queue=createCelebrationQueue(),panel=$('celebration'),opening=[],motion=matchMedia('(prefers-reduced-motion: reduce)');let owner=runtime.S,current=null,age=0;const knownPowers=new Set();
 const active=()=>runtime.inWorld()&&!document.hidden&&!runtime.scanning&&!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])')&&!$('voice').classList.contains('expanded');
 function boxCard(card){return card.type.startsWith('box:');}
 function box(box){const power=POWERS[box.power];if(!power)return;const d=runtime.regionOfPos(box.x,box.y);
  opening.push({x:box.x,y:box.y,age:0,seed:runtime.seedOf('celebration:opening:v2:'+box.id),power:box.power});if(opening.length>6)opening.shift();
  const repeat=knownPowers.has(box.power)||!!runtime.S.ach?.['poder_'+box.power];knownPowers.add(box.power);
  const event={repeat,id:'box:'+box.id,serial:cardSerial(cardKey('box:'+box.power,box.id,runtime.worldIdentity)),gift:box.gift===true,name:power.name,rarity:repeat?'comun':'rara',power:box.power,effect:power.text,seconds:Math.ceil(runtime.powerSecondsLeft?.(box.power)||power.seconds),where:d.name,surprise:box.surprise||null,x:box.x,y:box.y};
  if(repeat)runtime.toast?.('Poder renovado · '+power.name,{level:1,category:'poder',coalesce:true});else{queue.enqueue(event);lane.request('celebration',{level:2});}
  runtime.beatSoon(time=>{if(active())playBoxCelebration(runtime,time,d);},null,'ambient');
 }
 function earned(piece){if(!piece||piece.type==='achievement'||piece.type==='houseObject'||piece.source.kind==='box'||piece.source.kind==='finding'||piece.source.kind==='default')return;
  // Panel 11 (Q1): between the Journey's credits and the first portal what is earned waits in Tu cubo, unannounced.
  if(runtime.achievementsCalm?.())return;
  runtime.toast?.('Ganaste · '+piece.name,{level:REWARD_RARITIES[piece.rarity]?.celebration>0?2:1,category:'ganado',coalesce:true});
 }
 function present(event){current=event;age=0;const tier=REWARD_RARITIES[event.rarity],inspect=false;panel.dataset.noticeLevel=inspect?'3':'2';panel.dataset.inspect=String(inspect);panel.dataset.layout=inspect?'full':'compact';panel.setAttribute('role',inspect?'dialog':'status');panel.setAttribute('aria-modal',String(inspect));panel.setAttribute('aria-labelledby','celebrationName');$('celebrationContinue').hidden=false;$('celebrationContinue').textContent='Ver';$('celebrationContinue').setAttribute('aria-label','Ver detalles');const line=$('celebrationLine');if(line){const fun=document.createElement('span'),time=document.createElement('small');fun.textContent=(event.power&&BOX_LINES[event.power])||event.name;time.textContent=event.seconds?' '+event.seconds+' s':'';line.replaceChildren(fun,time);}panel.dataset.level=String(tier.celebration);panel.dataset.power=event.power||'reward';$('celebrationName').textContent=event.name;$('celebrationTier').textContent=event.repeat?'Poder renovado · temporal':event.gift?'Regalo · poder temporal':event.power?'Poder encontrado · '+tier.name:tier.name;$('celebrationEffect').textContent=event.effect||'Conserva este encuentro.';$('celebrationSurpriseName').textContent=BOX_SURPRISES[event.surprise]?BOX_SURPRISES[event.surprise].name+' · '+BOX_SURPRISES[event.surprise].seconds+' s':'';$('celebrationSurprise').textContent=BOX_SURPRISES[event.surprise]?.text||'';$('celebrationTime').textContent=event.seconds?event.seconds+' s de juego':'';$('celebrationSignature').textContent=tier.celebration===2?'Simple.':'';
  $('celebrationPlace').textContent=event.where||'';$('celebrationPlace').title=event.where||'';$('celebrationSerial').textContent='#'+(event.serial||cardSerial(event.id));
  $('celebrationArt').innerHTML=event.power?rarePortrait({type:'box:'+event.power},{scene:true}):'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8L56 32L32 56L8 32Z" fill="none" stroke="currentColor"/><rect x="28" y="28" width="8" height="8" fill="currentColor"/></svg>';
  $('celebrationShare').hidden=!event.power;lane.show(panel);
 }
 function close(){const focused=panel.contains(document.activeElement);queue.dismiss();current=null;panel.dataset.inspect='false';lane.hide(panel);lane.release('celebration');if(queue.pending)lane.request('celebration',{level:2});if(focused)$('w').focus({preventScroll:true});}
 function tick(dt){if(owner!==runtime.S){owner=runtime.S;knownPowers.clear();queue.clear();current=null;opening.length=0;panel.dataset.inspect='false';lane.cancel('celebration');lane.hide(panel);}
  if(!runtime.inWorld()){queue.clear();current=null;opening.length=0;panel.dataset.inspect='false';lane.cancel('celebration');lane.hide(panel);return;}
  if(!active()||lane.blocked()){panel.hidden=true;return;}
  for(const o of opening)o.age+=Math.max(0,Math.min(1,dt));while(opening[0]?.age>=1.2)opening.shift();
  if(current){lane.show(panel);queue.tick(panel.dataset.inspect==='true'?0:dt,true,false);if(!queue.current)close();}
  else if(queue.pending){lane.request('celebration',{level:2});if(lane.claim('celebration')){const next=queue.tick(0,true);if(next)present(next);}}else lane.cancel('celebration');
  if(current)age+=Math.max(0,Math.min(1,dt));
 }
 function draw(){if(!active())return;const c=runtime.cx;c.save();c.fillStyle=c.strokeStyle=runtime.GOLD;c.lineWidth=1;
  for(const o of opening){const x=o.x+runtime.W/2-runtime.S.wx,y=o.y+runtime.H/2-runtime.S.wy,fade=runtime.worldOpacity?.(Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy))??1;
   const still=runtime.S.reducedMotion||motion.matches;
   if(!still)for(const p of openingFragments(o.seed,o.age,o.power)){c.globalAlpha=p.alpha*fade*.85;c.fillRect(x+p.x,y+p.y,2,2);}c.globalAlpha=Math.max(0,1-o.age/1.2)*fade;c.strokeRect(x-8,y-8-(still?0:o.age*12),16,8);}
  c.restore();
 }
 async function share(){const event=current;if(!event?.power)return;const canvas=document.createElement('canvas');canvas.width=512;canvas.height=640;const c=canvas.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,512,640);c.strokeStyle=runtime.GOLD;c.strokeRect(24,24,464,592);
  const svg=rarePortrait({type:'box:'+event.power}).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ').replace('class="rare-glyph"','stroke="#f0d27a" fill="none" stroke-width="1.5"').replace('class="rare-orbit"','stroke="#ffffff44" fill="none"').replace('class="rare-sparks"','stroke="#f0d27a" fill="none"');
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));try{await document.fonts.load('400 24px "Geist Mono"');const image=new Image();image.src=url;await image.decode();c.drawImage(image,96,80,320,240);c.textAlign='center';c.fillStyle='#fff';c.font='24px "Geist Mono", monospace';c.fillText(event.name.toUpperCase(),256,355,440);c.font='14px "Geist Mono",monospace';c.fillStyle=runtime.GOLD;c.fillText(event.gift?'Regalo · poder temporal':REWARD_RARITIES[event.rarity].name,256,390);c.fillStyle='#fff';c.fillText(event.seconds+' s de juego',256,420);c.font='12px "Geist Mono",monospace';const words=event.effect.split(' ');for(let i=0;i<words.length;i+=7)c.fillText(words.slice(i,i+7).join(' '),256,455+i/7*22);c.fillText('KUBONO · @jaywrkr',256,590);
   c.fillStyle='#ffffff99';c.font='11px "Geist Mono", monospace';c.fillText(event.where||'',256,540,420);c.fillText('#'+(event.serial||cardSerial(event.id)),256,563);
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('PNG');const out=URL.createObjectURL(blob),a=document.createElement('a');a.href=out;a.download='kubono-poder-'+event.power+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(out),1000);
  }catch(_){runtime.toast('Intenta compartir de nuevo. Tu hallazgo sigue guardado.');}finally{URL.revokeObjectURL(url);}
 }
 $('celebrationDismiss').onclick=close;$('celebrationContinue').onclick=()=>{if(current&&panel.dataset.layout==='compact'){panel.dataset.layout='full';panel.dataset.inspect='true';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');$('celebrationContinue').textContent='Volver';$('celebrationContinue').removeAttribute('aria-label');$('celebrationContinue').focus({preventScroll:true});}else close();};$('celebrationShare').onclick=share;
 Object.defineProperties(runtime,{celebrateBox:{get:()=>box},boxCardCelebration:{get:()=>boxCard},rewardEarned:{get:()=>earned},celebrationTick:{get:()=>tick},drawCelebration:{get:()=>draw},celebrationActive:{get:()=>!!queue.current&&lane.owner==='celebration'&&active()},celebrationState:{get:()=>({id:queue.current?.id||null,remaining:queue.remaining,pending:queue.pending,openings:opening.length})}});
}
