export const TRAIL_RHYTHM=[0,4,10];
export const TRAIL_RHYTHMS=[TRAIL_RHYTHM,[0,3,8],[0,6,12],[0,2,7]];
export function normalizeSoundTrails(saved){
 const out={};for(const [id,s]of Object.entries(saved||{})){
  if(Object.keys(out).length>=64)break;
  if(!/^trail:-?\d+,-?\d+$/.test(id)||!Number.isInteger(s?.stage)||s.stage<0||s.stage>3)continue;
  out[id]={stage:s.stage,seen:!!s.seen};
 }return out;
}
export function createSoundTrail(region,size,seedOf,rng,forced=false){
 if(region.sea||!/^(-?\d+),(-?\d+)$/.test(region.key))return null;
 const r=rng(seedOf(`sound-trail:v1:${region.key}`));if(r()>1/16&&!forced)return null;
 const [rx,ry]=region.key.split(',').map(Number),x=(rx+.35+r()*.2)*size,y=(ry+.35+r()*.2)*size,angle=r()*Math.PI*2;
 const nodes=[[0,0],[260,70],[440,-110]].map(([a,b],i)=>({id:`trail:${region.key}:${i}`,x:x+a*Math.cos(angle)-b*Math.sin(angle),y:y+a*Math.sin(angle)+b*Math.cos(angle),material:'wood'}));
 return {id:`trail:${region.key}`,region,nodes,channel:['bass','groove','melody'][Math.floor(r()*3)],variant:Math.floor(r()*8),rhythm:[...TRAIL_RHYTHMS[Math.floor(r()*TRAIL_RHYTHMS.length)]]};
}
// Relative timing: start anywhere in the bar; the first tap captures the local tempo.
export function captureTrailTap(sequence,time,six,rhythm=TRAIL_RHYTHM){
 if(!Number.isFinite(time)||!Number.isFinite(six)||six<=0)return sequence;
 if(!sequence||sequence.count>=3||time<sequence.start)return {start:time,six,count:1,rhythm:[...rhythm]};
 const step=(time-sequence.start)/sequence.six,target=sequence.rhythm[sequence.count];
 if(Math.abs(step-target)>1.5)return {start:time,six,count:1,rhythm:[...rhythm]};
 return {...sequence,count:sequence.count+1};
}
