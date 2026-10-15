import {createRewardsCatalog,migrateRewards,awardReward,rewardSource,ownsReward,REWARD_RARITIES} from './rewards-model.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function initialize(runtime){
 const catalog=createRewardsCatalog(runtime.ACH),hidden=runtime.ACH.filter(a=>a[3]).map(a=>a[0]);let owner=null;
 function book(){if(owner!==runtime.S){runtime.S.rewards=migrateRewards(runtime.S,catalog,{hiddenAchievements:hidden});owner=runtime.S;}return runtime.S.rewards;}
 function changed(ids){if(ids.length&&runtime.save())for(const id of ids)runtime.rewardEarned?.(catalog.find(p=>p.id===id));return ids;}
 function award(id,options={}){return changed(awardReward(book(),id,catalog,{at:new Date().toISOString(),...options})?[id]:[]).length>0;}
 function source(kind,value,options={}){if(Object.hasOwn(book().sources,kind+':'+value))return [];return changed(rewardSource(book(),kind,value,catalog,{at:new Date().toISOString(),...options}));}
 function owns(id){return ownsReward(book(),id);}
 function card(){const b=book(),earned=catalog.filter(p=>ownsReward(b,p.id));return '<article class="journal-card"><h3>Tu colección</h3><p>'+earned.length+' de '+catalog.length+' piezas</p>'+Object.entries(REWARD_RARITIES).map(([id,r])=>'<p>'+escape(r.name)+' · '+earned.filter(p=>p.rarity===id).length+'</p>').join('')+'<p>Viste tu cubo. Haz música en tu casa.</p></article>';}
 book();Object.defineProperties(runtime,{rewardPieces:{get:()=>catalog.map(p=>({...p,...book().items[p.id],owned:ownsReward(book(),p.id),obtainedAt:book().items[p.id]?.obtainedAt||null}))},rewardCatalog:{get:()=>catalog},rewardBook:{get:()=>book()},awardReward:{get:()=>award},recordRewardSource:{get:()=>source},ownsReward:{get:()=>owns},rewardCollectionCard:{get:()=>card}});
}
