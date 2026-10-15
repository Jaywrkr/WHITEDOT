import {createCelebrationQueue,openingFragments} from './celebration-model.js';
import {playBoxCelebration} from './celebration-audio.js';
import {REWARD_RARITIES} from './rewards-model.js';
import {POWERS} from './expansion-music.js';
import {rarePortrait} from './rare-card-art.js';
import {cardSerial,cardKey} from './rare-card-model.js';
export function initialize(runtime){
 const $=runtime.$,queue=createCelebrationQueue(),panel=$('celebration'),opening=[],motion=matchMedia('(prefers-reduced-motion: reduce)');let owner=runtime.S,current=null,age=0;
 const active=()=>runtime.inWorld()&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])')&&!$('voice').classList.contains('expanded');
 function boxCard(card){return card.type.startsWith('box:');}
 function box(box){const power=POWERS[box.power];if(!power)return;const d=runtime.regionOfPos(box.x,box.y);
  opening.push({x:box.x,y:box.y,age:0,seed:runtime.seedOf('celebration:opening:v2:'+box.id),power:box.power});if(opening.length>6)opening.shift();
  queue.enqueue({id:'box:'+box.id,serial:cardSerial(cardKey('box:'+box.power,box.id,runtime.worldIdentity)),gift:box.gift===true,name:power.name,rarity:'rara',power:box.power,effect:power.text,seconds:Math.ceil(runtime.powerSecondsLeft?.(box.power)||power.seconds),where:d.name,x:box.x,y:box.y});
  runtime.beatSoon(time=>{if(active())playBoxCelebration(runtime,time,d);},null,'ambient');
 }
 function earned(piece){if(!piece||piece.type==='achievement'||piece.type==='houseObject'||piece.source.kind==='box'||piece.source.kind==='finding'||piece.source.kind==='default')return;
  queue.enqueue({id:'reward:'+piece.id,name:piece.name,rarity:piece.rarity,effect:'Guárdala en tu colección.',where:runtime.MU.dnaT?.name||''});
 }
 function present(event){current=event;age=0;const tier=REWARD_RARITIES[event.rarity];panel.dataset.level=String(tier.celebration);panel.dataset.power=event.power||'reward';$('celebrationName').textContent=event.name;$('celebrationTier').textContent=event.gift?'Regalo · poder temporal':event.power?'Poder encontrado · '+tier.name:tier.name;$('celebrationEffect').textContent=event.effect||'Conserva este encuentro.';$('celebrationTime').textContent=event.seconds?event.seconds+' s de juego':'';$('celebrationSignature').textContent=tier.celebration===2?'Simple.':'';
  $('celebrationPlace').textContent=event.where||'';$('celebrationPlace').title=event.where||'';$('celebrationSerial').textContent='#'+(event.serial||cardSerial(event.id));
  $('celebrationArt').innerHTML=event.power?rarePortrait({type:'box:'+event.power}):'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8L56 32L32 56L8 32Z" fill="none" stroke="currentColor"/><rect x="28" y="28" width="8" height="8" fill="currentColor"/></svg>';
  $('celebrationShare').hidden=!event.power;panel.hidden=false;
 }
 function tick(dt){if(owner!==runtime.S){owner=runtime.S;queue.clear();current=null;opening.length=0;panel.hidden=true;}
  if(!runtime.inWorld()){queue.clear();current=null;opening.length=0;panel.hidden=true;return;}
  const allowed=active()&&!runtime.rareNoticeState?.shown;
  if(!allowed){panel.hidden=true;return;}
  for(const o of opening)o.age+=Math.max(0,Math.min(1,dt));while(opening[0]?.age>=1.2)opening.shift();
  const next=queue.tick(dt,allowed);if(next)present(next);else if(!queue.current){current=null;panel.hidden=true;}else panel.hidden=false;
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
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));try{await document.fonts.load('400 24px "Geist Mono"');const image=new Image();image.src=url;await image.decode();c.drawImage(image,96,80,320,240);c.textAlign='center';c.fillStyle='#fff';c.font='24px "Geist Mono", monospace';c.fillText(event.name.toUpperCase(),256,355,440);c.font='14px "Geist Mono",monospace';c.fillStyle=runtime.GOLD;c.fillText(event.gift?'Regalo · poder temporal':REWARD_RARITIES[event.rarity].name,256,390);c.fillStyle='#fff';c.fillText(event.seconds+' s de juego',256,420);c.font='12px "Geist Mono",monospace';const words=event.effect.split(' ');for(let i=0;i<words.length;i+=7)c.fillText(words.slice(i,i+7).join(' '),256,455+i/7*22);c.fillText('WHITEDOT · @jaywrkr',256,590);
   c.fillStyle='#ffffff99';c.font='11px "Geist Mono", monospace';c.fillText(event.where||'',256,540,420);c.fillText('#'+(event.serial||cardSerial(event.id)),256,563);
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('PNG');const out=URL.createObjectURL(blob),a=document.createElement('a');a.href=out;a.download='whitedot-poder-'+event.power+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(out),1000);
  }catch(_){runtime.toast('Intenta compartir de nuevo. Tu hallazgo sigue guardado.');}finally{URL.revokeObjectURL(url);}
 }
 $('celebrationDismiss').onclick=()=>{queue.dismiss();current=null;panel.hidden=true;};$('celebrationShare').onclick=share;
 Object.defineProperties(runtime,{celebrateBox:{get:()=>box},boxCardCelebration:{get:()=>boxCard},rewardEarned:{get:()=>earned},celebrationTick:{get:()=>tick},drawCelebration:{get:()=>draw},celebrationActive:{get:()=>!!queue.current&&active()},celebrationState:{get:()=>({id:queue.current?.id||null,remaining:queue.remaining,pending:queue.pending,openings:opening.length})}});
}
