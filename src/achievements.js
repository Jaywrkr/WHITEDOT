import {openSurface} from './frame-state.js';
import {ADVENTURE_ACHIEVEMENTS,adventureProgress} from './adventure-achievements.js';
import {HOUSE_ACHIEVEMENTS} from './house-capsules.js';
import {newAchievementRules,achievementMeta,achievementProgress} from './achievements-model.js';
export function initialize(runtime){const legacy=newAchievementRules(runtime.ACH),rules=[...legacy,...[...ADVENTURE_ACHIEVEMENTS,...HOUSE_ACHIEVEMENTS].filter(p=>!runtime.ACH.some(a=>a[0]===p.id))];for(const p of rules)runtime.ACH.push([p.id,p.name,p.description,p.hidden?1:0]);let clock=0;if(runtime.S.achievementVersion!==2){for(const p of legacy)if(!runtime.S.ach[p.id]&&achievementProgress(p,runtime.S).ratio===1)runtime.S.ach[p.id]=runtime.S.todayKey||new Date().toISOString().slice(0,10);runtime.S.achievementVersion=2;}
 let owner=null,seen=[],pending=[];
 function sync(){if(owner!==runtime.S){owner=runtime.S;owner.journal||={};const raw=owner.journal.achievementSeen;seen=raw&&typeof raw==='object'&&!Array.isArray(raw)?Object.keys(raw):Object.keys(owner.ach);owner.journal.achievementSeen=Object.fromEntries(seen.map(id=>[id,true]));pending=[];}const unread=runtime.ACH.some(a=>owner.ach[a[0]]&&!seen.includes(a[0]));const button=runtime.$?.('bAch');button?.classList?.toggle('has-unread',unread);button?.setAttribute?.('aria-label',unread?'Bitácora · logros nuevos':'Bitácora');}
 function earnedNotice(ids){sync();pending.push(...ids);}
 // Panel 10 (P4): what a round earns goes only to the Bitácora (its mark of unread stays); no card line and no toast.
 function quiet(){sync();pending=[];}
 function acknowledge(){sync();if(!Object.keys(owner.ach).some(id=>!seen.includes(id))){pending=[];return;}const before=seen;seen=Object.keys(owner.ach);owner.journal.achievementSeen=Object.fromEntries(seen.map(id=>[id,true]));if(runtime.save()===false){seen=before;owner.journal.achievementSeen=Object.fromEntries(seen.map(id=>[id,true]));}else pending=[];sync();}
 // In the Journey achievements are earned in silence; they are announced once back in the free World.
 // Plan H5: nor during a round of a place, nor while its card waits for the drop (quiet() sends them to the Bitácora).
 // Plan I1: the narrator speaks only on a round's card and in the Bitácora; between the credits and the first portal
 // nothing is announced (what was earned there waits in the Bitácora).
 function calm(){const j=runtime.S.journey;if(!j?.finished)return false;const d=runtime.placesData?.();return !!d&&!Object.values(d.seen||{}).some(Boolean);}
 // Panel 10 (P8, D3): one achievement per notice, never a count; the rest wait, unread, in the Bitácora.
 function announce(){if(!pending.length||runtime.journeyQuiet?.()||runtime.placeRun?.()||runtime.placeCardDue?.())return;if(calm()){pending=[];return;}const state=runtime.S,ids=[...new Set(pending)],a=runtime.ACH.find(a=>a[0]===ids[0]),escape=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const accepted=runtime.toast?.('✦ Logro · '+escape(a?.[1]||'Nuevo descubrimiento'),{level:2,category:'logros',coalesce:true,ttl:120000,valid:()=>runtime.S===state&&ids.some(id=>!seen.includes(id))});if(accepted!==false)pending=[];}
 sync();
 function check(dt=2){if(owner!==runtime.S)sync();clock+=dt;if(clock<2||document.hidden||openSurface('.modal:not([hidden])'))return;clock=0;sync();announce();for(const p of legacy)if(!runtime.S.ach[p.id]&&achievementProgress(p,runtime.S).ratio===1){runtime.unlock(p.id);break;}
  if(runtime.labMode||runtime.S.previewSeed&&!runtime.realTravel||runtime.activityActive)return;
  // World achievements are earned in the World; house ones wherever the house changed.
  const ready=p=>!runtime.S.ach[p.id]&&adventureProgress(p,runtime.S).ratio===1,earned=[...(runtime.inWorld()?ADVENTURE_ACHIEVEMENTS.filter(ready):[]),...HOUSE_ACHIEVEMENTS.filter(ready)];if(!earned.length)return;
  const rewards=runtime.S.rewards?structuredClone(runtime.S.rewards):undefined;for(const p of earned)runtime.S.ach[p.id]=runtime.S.todayKey||new Date().toISOString().slice(0,10);
  if(runtime.save()===false){for(const p of earned)delete runtime.S.ach[p.id];if(rewards)runtime.S.rewards=rewards;return;}
  earnedNotice(earned.map(p=>p.id));
}
 Object.defineProperties(runtime,{achievementsCalm:{get:()=>calm},achievementEarned:{get:()=>earnedNotice},quietAchievements:{get:()=>quiet},acknowledgeAchievements:{get:()=>acknowledge},achievementRetired:{get:()=>id=>id==='dj'},achievementRules:{get:()=>rules},achievementMeta:{get:()=>a=>achievementMeta(a,rules)},achievementProgress:{get:()=>p=>p.adventure?adventureProgress(p,runtime.S):achievementProgress(p,runtime.S)},achievementsTick:{get:()=>check}});
}
