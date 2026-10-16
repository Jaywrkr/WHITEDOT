// Articulation belongs to an individual and its metrical role, never a pitch lottery.
const bounded=(n,fallback,low,high)=>Number.isFinite(n)?Math.max(low,Math.min(high,n)):fallback;
export function voiceExpression(voice={},source=null,frame=null,time=0){
 const role=voice.role||'lead',energy=bounded(source?.mind?.energy,.5,0,1),patience=bounded(source?.mind?.patience,.5,0,1),
  variant=Math.abs(Math.trunc(bounded(source?.variant,0,-1e6,1e6)))%8,
  step=frame&&frame.six>0&&Number.isFinite(frame.time)&&Number.isFinite(time)?Math.round((time-frame.time)/frame.six)+(frame.step||0):0,
  strong=((step%4)+4)%4===0,gesture=source?.expression,
  shape=({bajo:[.85,.78,.8],perc:[.75,.8,.96],acorde:[1.1,1.06,.84],agudo:[.95,.82,.68],lead:[.95,.96,.92]})[role]||[1,1,1],
  technique=gesture==='staccato'?'muted':gesture==='glide'?'slide':voice.technique||'normal';
 return Object.freeze({technique,
  attackScale:bounded(shape[0]*(.9+patience*.2)*(gesture==='legato'?1.2:1),1,.5,1.6),
  decayScale:bounded(shape[1]*(.85+energy*.2)*(gesture==='legato'?1.18:gesture==='staccato'?.7:1),1,.35,1.4),
  toneScale:bounded(shape[2]*(.94+energy*.12),1,.5,1.1),
  velocity:source?bounded((strong?1:.87)*(.9+energy*.12)*(1+(variant-3.5)*.012),1,.72,1.1):1,
  pressure:bounded(source?.parameter,.35,0,1),glide:gesture==='glide'?.35:0,tremolo:gesture==='tremolo'?3.5:0,
 });
}
