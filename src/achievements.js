import {ADVENTURE_ACHIEVEMENTS,adventureProgress} from './adventure-achievements.js';
import {newAchievementRules,achievementMeta,achievementProgress} from './achievements-model.js';
export function initialize(runtime){const legacy=newAchievementRules(runtime.ACH),rules=[...legacy,...ADVENTURE_ACHIEVEMENTS.filter(p=>!runtime.ACH.some(a=>a[0]===p.id))];for(const p of rules)runtime.ACH.push([p.id,p.name,p.description,p.hidden?1:0]);let clock=0;if(runtime.S.achievementVersion!==2){for(const p of legacy)if(!runtime.S.ach[p.id]&&achievementProgress(p,runtime.S).ratio===1)runtime.S.ach[p.id]=runtime.S.todayKey||new Date().toISOString().slice(0,10);runtime.S.achievementVersion=2;}
 function check(dt=2){clock+=dt;if(clock<2||document.hidden||document.querySelector('.modal:not([hidden])'))return;clock=0;for(const p of legacy)if(!runtime.S.ach[p.id]&&achievementProgress(p,runtime.S).ratio===1){runtime.unlock(p.id);break;}
  if(runtime.labMode||runtime.S.previewSeed&&!runtime.realTravel||!runtime.inWorld()||runtime.activityActive)return;
  const earned=ADVENTURE_ACHIEVEMENTS.filter(p=>!runtime.S.ach[p.id]&&adventureProgress(p,runtime.S).ratio===1);if(!earned.length)return;
  const rewards=runtime.S.rewards?structuredClone(runtime.S.rewards):undefined;for(const p of earned)runtime.S.ach[p.id]=runtime.S.todayKey||new Date().toISOString().slice(0,10);
  if(runtime.save()===false){for(const p of earned)delete runtime.S.ach[p.id];if(rewards)runtime.S.rewards=rewards;return;}
}
 Object.defineProperties(runtime,{achievementRetired:{get:()=>id=>id==='dj'},achievementRules:{get:()=>rules},achievementMeta:{get:()=>a=>achievementMeta(a,rules)},achievementProgress:{get:()=>p=>p.adventure?adventureProgress(p,runtime.S):achievementProgress(p,runtime.S)},achievementsTick:{get:()=>check}});
}
