import {REWARD_RARITIES} from './rewards-model.js';
export function celebrationDuration(rarity){const level=REWARD_RARITIES[rarity]?.celebration||0;return level===0?2:level===1?5:4;}
export function createCelebrationQueue(limit=12){
 const pending=[];let current=null,remaining=0;
 function enqueue(event){if(!event?.id||!REWARD_RARITIES[event.rarity])return false;
  if(current?.id===event.id)return false;const existing=pending.find(p=>p.id===event.id);if(existing){Object.assign(existing,event);return false;}
  if(pending.length>=limit){const minor=pending.findIndex(p=>REWARD_RARITIES[p.rarity].celebration===0);pending.splice(minor>=0?minor:0,1);}
  pending.push({...event});return true;
 }
 function tick(dt,active){if(!active)return null;if(current){remaining-=Math.max(0,Math.min(1,Number.isFinite(dt)?dt:0));if(remaining<=0){current=null;remaining=0;}}
  if(!current&&pending.length){current=pending.shift();remaining=celebrationDuration(current.rarity);return {...current};}return null;
 }
 function dismiss(){current=null;remaining=0;}
 function clear(){dismiss();pending.length=0;}
 return {enqueue,tick,dismiss,clear,get current(){return current;},get remaining(){return remaining;},get pending(){return pending.length;}};
}
export function openingFragments(seed,seconds,power){const k=Math.max(0,Math.min(1,seconds/1.2)),alpha=(1-k)*(1-k);return Array.from({length:16},(_,i)=>{const angle=i/16*Math.PI*2+(seed%100)/100,radius=8+k*(14+i%3*8);let x=Math.cos(angle)*radius,y=Math.sin(angle)*radius-k*8;
 if(power==='cometa'){x=(i-8)*3*k;y=-k*(8+i*2);}
 else if(power==='campo'){x=Math.cos(angle)*(12+k*26);y=Math.sin(angle)*(12+k*26);}
 else if(power==='brujula'){x=Math.round(Math.cos(angle))*radius;y=Math.round(Math.sin(angle))*radius;}
 else if(power==='iman'){x=(i%2?1:-1)*(24-k*18);y=(Math.floor(i/2)-4)*5*k;}
 else if(power==='pincel'){x=(i-8)*4*k;y=Math.sin(i*.6+k*3)*14*k;}
 else if(power==='companero'){x=(i%2?1:-1)*14+Math.cos(angle)*10*k;y=Math.sin(angle)*12*k-k*12;}
 return {x,y,alpha};});}
