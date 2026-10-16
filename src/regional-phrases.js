// Phrase-level variation: a territory remembers a motif, develops it and returns home.
const cells=Object.freeze({
 minimal:[[0,0,2,0],[0,2,0,4],[0,0,4,2]],machine:[[0,2,4,2],[0,4,3,0],[0,2,0,3]],
 warm:[[0,2,4,3],[0,1,2,0],[2,4,3,0]],disco:[[0,2,4,2],[0,4,5,4],[2,0,4,3]],
 organic:[[0,2,3,2],[0,3,4,0],[2,4,2,0]],afro:[[0,2,0,4],[0,3,2,0],[2,0,4,2]],
 broken:[[0,4,2,0],[2,3,2,0],[0,2,5,4]],bass:[[0,0,4,2],[0,2,3,0],[0,4,0,2]],
 melodic:[[0,2,4,5],[0,3,4,2],[2,4,3,0]],dub:[[0,2,0,0],[0,4,2,0],[2,0,3,0]],
 ambient:[[0,4,2,0],[0,2,4,2],[2,0,4,0]],guitar:[[0,2,3,2],[0,4,2,0],[2,3,4,2]],
 italo:[[0,4,2,4],[0,2,4,5],[2,4,3,0]],blues:[[0,2,3,2],[0,3,2,0],[2,3,4,2]]
});
function hash(text){let h=2166136261;for(const c of text)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function regionalPhrase(score,frame){
 const hook=Array(16).fill(-1),variant=Number.isInteger(score.variant)?score.variant:0,h=hash(`${score.territory||score.id}:${score.genre}:${variant}`),
  pool=cells[score.production?.id]||cells.warm,cell=pool[h%pool.length],bar=Math.max(0,Math.floor(frame.harmonyBar||0)),line=bar%8,
  movement=Math.floor(bar/48)%3,answer=line===2||line===6,closing=line===7,tones=frame.hybrid?.tones,
  budget=Number.isFinite(frame.grammar?.hookLimit)?Math.max(0,Math.min(4,Math.trunc(frame.grammar.hookLimit))):4,steps=score.hook.slice(0,budget);
 steps.forEach((step,i)=>{
  if(!Number.isInteger(step)||step<0||step>15||closing&&i>0)return;
  let degree=cell[(i+(movement===1?1:0))%cell.length];
  if(answer)degree=cell[(cell.length-1-i+cell.length)%cell.length];
  if(movement===2&&i===1)degree=(degree+2)%7;
  if(tones?.length)degree=tones[degree%tones.length];
  if(closing||i===steps.length-1&&line===3)degree=0;
  hook[step]=Math.max(0,Math.min(6,degree));
 });
 return {hook,id:`${score.production?.id||'warm'}:${h%pool.length}`,movement,line,answer,closing};
}
export function interlockedBass(score,hook,opening=false){
 return score.bass.map((degree,step)=>{
  if(opening&&step!==0&&step%8!==0)return -1;
  // Preserve the root and native groove. Thin only one competing weak subdivision.
  if(step%4!==0&&hook[step]>=0&&(step+(score.variant||0))%3===0)return -1;
  return degree;
 });
}
