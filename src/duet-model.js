export function roomTransport(room,serverNow,audioNow,nextStep=null){
 const six=60/room.bpm/4;const desired=Math.max(0,Math.ceil(((serverNow-room.epoch)/1000+.085)/six));
 const step=nextStep===null||Math.abs(nextStep-desired)>4?desired:nextStep;
 return {step,six,next:audioNow+(room.epoch+step*six*1000-serverNow)/1000};
}
export function duetVoice(voice,slot,genre){
 const allowed=slot===0?['bajo','acorde']:['perc','lead','agudo'];if(allowed.includes(voice.role))return voice;
 const role=slot===0?'bajo':'perc',pool=role==='bajo'?(genre.bassP||[genre.bassI]):['wood','tom','conga'];return {...voice,role,instrument:pool[voice.degree%pool.length],low:role==='bajo'?36:45,high:role==='bajo'?54:69};
}
