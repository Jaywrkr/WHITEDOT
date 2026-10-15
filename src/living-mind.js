// Stable individual preferences, independent of every world placement stream.
export const MIND_VERSION=1;
export const MIND_CAPABILITIES=Object.freeze({
 fauna:Object.freeze(['observe','approach','retreat','cooperate','rest','explore','respond']),
 flora:Object.freeze(['listen','open','retract','transmit','rest','respond']),
 architecture:Object.freeze(['listen','resonate','seal','transmit','rest','respond']),
});
export function mindProfile(o,seedOf,rng){
 const r=rng(seedOf(`living:mind:v1:${o.id}:${o.kind}`)),legacy=o.personality;
 const shy=legacy==='timida',curious=legacy==='curiosa',social=legacy==='social';
 return Object.freeze({version:MIND_VERSION,id:o.id,
  curiosity:r()*.7+(curious?.3:0),caution:r()*.7+(shy?.3:0),sociability:r()*.7+(social?.3:0),
  patience:r(),energy:.35+r()*.65,territory:28+r()*40,motionSensitivity:.3+r()*.7,
  musicInterest:.3+r()*.7,lightPreference:r(),activity:o.activeAt??Math.floor(r()*4),
  memorySpan:3+Math.floor(r()*4),phaseRate:.14+r()*.4,decisionPeriod:.35+r()*.65,
  instrumentChoice:Math.floor(r()*16),degree:Math.floor(r()*7),
 });
}
export function mindDecision(o,d,player,clock,neighbors=[]){
 const p=o.mind,group=o.group||'fauna';if(!p)return null;
 const danger=player.speed>55+55*(1-p.motionSensitivity)&&d<65+p.caution*65;
 if(danger&&p.caution>.35)return group==='fauna'?'retreat':group==='flora'?'retract':'seal';
 if(o.stimulusAt!==undefined&&clock-o.stimulusAt<2+p.patience*3&&p.musicInterest>.45)return 'respond';
 const daylight=[.35,1,.4,.05][o.ecology?.phase??p.activity];
 if(o.awake<.5&&o.energy<.2&&(p.energy<.7||Math.abs(daylight-p.lightPreference)>.5))return 'rest';
 if(d<175&&p.curiosity>.58)return group==='fauna'?'approach':group==='flora'?'open':'resonate';
 if(p.sociability>.6&&neighbors.some(n=>n!==o&&n.group===group&&Math.hypot(n.x-o.x,n.y-o.y)<150))return group==='fauna'?'cooperate':'transmit';
 if(d<160&&p.patience>.5)return group==='fauna'?'observe':'listen';
 return group==='fauna'?'explore':'listen';
}
export function updateMind(o,dt,clock,d,player,neighbors=[]){
 const p=o.mind;if(!p)return;
 if(clock>=(o.nextDecision??0)){o.intent=mindDecision(o,d,player,clock,neighbors);o.nextDecision=clock+p.decisionPeriod;}
 const intent=o.intent||'listen',fauna=o.group==='fauna',targetAngle=Math.atan2(player.y-o.y,player.x-o.x);
 const open=['retract','seal','rest'].includes(intent)?.72:['open','resonate','respond'].includes(intent)?1.1:1;
 o.openness=(o.openness??1)+(open-(o.openness??1))*Math.min(1,dt*3);
 o.attentionAngle=targetAngle+(intent==='retreat'?Math.PI:0);
 o.expression=player.speed>100?'staccato':intent==='rest'||p.patience>.65?'legato':p.energy>.7?'tremolo':'glide';
 if(!fauna)return;
 const amplitude=Math.min(p.territory,o.kind==='whale'?50:o.kind==='beetle'?18:38);
 let tx=o.homeX+Math.sin(clock*p.phaseRate+o.variant)*amplitude,ty=o.homeY+Math.cos(clock*p.phaseRate*.7+o.variant)*amplitude*.65;
 if(['observe','rest','respond'].includes(intent)){tx=o.x;ty=o.y;}
 else if(intent==='approach'){const a=Math.atan2(player.y-o.homeY,player.x-o.homeX),stop=22+o.size;tx=player.x-Math.cos(a)*stop;ty=player.y-Math.sin(a)*stop;}
 else if(intent==='retreat'){tx=o.homeX-Math.cos(targetAngle)*p.territory;ty=o.homeY-Math.sin(targetAngle)*p.territory;}
 else if(intent==='cooperate'){const peer=neighbors.find(n=>n!==o&&n.group==='fauna'&&Math.hypot(n.x-o.x,n.y-o.y)<150);if(peer){tx+=(peer.x-tx)*.5;ty+=(peer.y-ty)*.5;}}
 const dx=tx-o.homeX,dy=ty-o.homeY,r=Math.hypot(dx,dy);if(r>p.territory){tx=o.homeX+dx/r*p.territory;ty=o.homeY+dy/r*p.territory;}
 const pace=(o.kind==='turtle'?.22:o.kind==='deer'?1.1:.65)*p.energy*(o.awake??1);
 o.x+=(tx-o.x)*Math.min(1,dt*pace);o.y+=(ty-o.y)*Math.min(1,dt*pace);
}
