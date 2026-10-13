// World gestures describe music; no audio nodes or persistent recordings live here.
export const MAX_THREADS=6;
export const BOX_PARTS=['bass','groove','melody'];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function toggleThread(network,from,to){
 if(!from||!to||from.id===to.id||!Number.isFinite(from.x+from.y+to.x+to.y)||Math.hypot(to.x-from.x,to.y-from.y)>220)return false;
 network.edges||=[];const key=[from.id,to.id].sort().join('|'),index=network.edges.findIndex(e=>e.key===key);
 if(index>=0){network.edges.splice(index,1);return true;}
 if(network.edges.length>=MAX_THREADS)return false;
 network.edges.push({key,from:from.id,to:to.id,a:{x:from.x,y:from.y},b:{x:to.x,y:to.y}});return true;
}
export function threadScore(network,seedOf){
 const mask=Array(16).fill(false);[0,4,8,12].forEach(i=>mask[i]=true);
 const notes=[];
 for(const edge of (network?.edges||[]).slice(0,MAX_THREADS)){
  const length=Math.hypot(edge.b.x-edge.a.x,edge.b.y-edge.a.y),angle=Math.atan2(edge.b.y-edge.a.y,edge.b.x-edge.a.x);
  const step=[2,3,6,7,10,11,14,15][seedOf(edge.key)%8];mask[step]=true;
  notes.push({step,index:[0,2,4,6][(Math.floor(length/35)+Math.round((angle+Math.PI)*2))%4]});
 }
 // Edges remain free to form cycles visually; evaluation is a finite score, never recursion.
 return {mask,notes:notes.filter((n,i,a)=>a.findIndex(other=>other.step===n.step)===i).slice(0,4)};
}
export function createBox(region){
 const parts=BOX_PARTS.map((channel,i)=>({id:channel,enabled:true,steps:Array.from({length:16},(_,s)=>channel==='bass'?([0,6,10,14].includes(s)?0:-1):channel==='groove'?([2,6,10,14].includes(s)?0:-1):([0,3,8,11].includes(s)?[0,2,4,2][Math.floor(s/4)]:-1))}));
 if(region?.track?.bass?.length===16)parts[0].steps=region.track.bass.slice();
 if(region?.track?.hook?.length===16)parts[2].steps=region.track.hook.map(n=>n<0?-1:((n%7)+7)%7);
 return {parts,selected:0};
}
export function paintBoxStep(box,step,on){
 if(!Number.isInteger(step)||step<0||step>15)return false;const part=box.parts[box.selected];
 if(!part)return false;part.steps[step]=on?(part.id==='melody'?[0,2,4,2][Math.floor(step/4)]:0):-1;return true;
}
export function moveBoxPart(box,from,to){
 if(![from,to].every(i=>Number.isInteger(i)&&i>=0&&i<3)||from===to)return false;
 [box.parts[from],box.parts[to]]=[box.parts[to],box.parts[from]];box.selected=to;return true;
}
export function boxPart(box,channel){
 const index=box?.parts.findIndex(p=>p.id===channel)??-1;if(index<0)return null;
 const p=box.parts[index],steps=Array(16).fill(-1);p.steps.forEach((n,i)=>{steps[(i+index*2)%16]=p.enabled?n:-1;});return {...p,steps};
}
export function boundedTrack(track,bass=track.bass,hook=track.hook){
 const limit=Math.min(6,track.grammar?.hookLimit||5),trim=(part,n)=>{let used=0;return part.map(v=>v>=0&&++used>n?-1:v);};
 return {...track,bass:trim(bass,8),hook:trim(hook,limit),grammar:{...track.grammar}};
}
export function boxArrangement(track,box){
 const bass=boxPart(box,'bass'),hook=boxPart(box,'melody');return boundedTrack(track,bass?.steps||track.bass,hook?.steps||track.hook);
}
export function threadArrangement(track,network,channel,seedOf){
 const score=threadScore(network,seedOf);if(!score.notes.length)return track;
 if(channel==='bass'){const bass=Array(16).fill(-1);bass[0]=0;for(const n of score.notes)bass[n.step]=n.index;return boundedTrack(track,bass);}
 if(channel==='melody'){const hook=Array(16).fill(-1);hook[0]=0;for(const n of score.notes)hook[n.step]=n.index;return boundedTrack(track,track.bass,hook);}
 if(channel==='space')return boundedTrack(track,track.bass,track.hook.map((n,i)=>score.mask[i]?n:-1));
 return track;
}
export function startDialogue(){return {phase:'listening',elapsed:0,waitingAge:0,sinceInput:0,events:[],phrase:[],lastReplyBar:-Infinity,age:0};}
export function captureDialogue(dialogue,event){
 if(dialogue.phase!=='listening'||!Number.isFinite(event.step)||!Number.isFinite(event.degree))return false;
 const step=clamp(Math.round(event.step/2)*2,0,30),degree=((Math.round(event.degree)%7)+7)%7;
 if(dialogue.events.some(e=>e.step===step)||dialogue.events.length>=4)return false;
 dialogue.events.push({step,degree});dialogue.sinceInput=0;return true;
}
export function finishDialogue(dialogue){
 if(dialogue.phase!=='listening')return;
 const events=dialogue.events.slice().sort((a,b)=>a.step-b.step).slice(0,4);
 if(!events.length){dialogue.phase='idle';return;}
 const first=events[0],seen=new Set();dialogue.phrase=events.map(e=>({step:Math.min(14,Math.round((e.step-first.step)/4)*2),index:(e.degree-first.degree+7)%7})).filter(e=>{if(seen.has(e.step))return false;seen.add(e.step);return true;});
 dialogue.phase='replying';dialogue.age=0;
}
export function dialogueReply(dialogue,bar){
 if(!dialogue||dialogue.phase!=='replying'||bar-dialogue.lastReplyBar<4)return [];
 // Keep the contour recognisable; close alternate answers on the local tonic.
 return dialogue.phrase.map((n,i)=>({...n,index:bar%8>=4&&i===dialogue.phrase.length-1?0:n.index}));
}
