// One transport and harmonic frame for sources; instrument identities remain local.
const pc=n=>((n%12)+12)%12;
export function fitRegister(note,low,high){let n=note;while(n<low)n+=12;while(n>high)n-=12;return n;}
export function consonantPitch(note,tones,low=36,high=76){
 let best=note,distance=Infinity;for(const tone of tones)for(let n=low;n<=high;n++){if(pc(n)!==pc(tone))continue;const d=Math.abs(n-note);if(d<distance){best=n;distance=d;}}return best;
}
export function createMusicalConductor(){
 const frames=[];
 function remember(time,step,region,degree,six,swing,chords){
  if(!region||!Number.isFinite(time)||!(six>0))return;
  if(frames.length&&time<frames.at(-1).time)frames.length=0;
  frames.push(Object.freeze({time,step,region,degree,six,swing:Math.max(0,Math.min(.28,swing||0)),chords:Object.freeze(chords.slice())}));
  if(frames.length>48)frames.shift();
 }
 function at(time){for(let i=frames.length-1;i>=0;i--)if(frames[i].time<=time+.0001)return frames[i];return frames[0]||null;}
 function align(time,now=0){
  const frame=at(time);if(!frame||!Number.isFinite(time))return time;
  let best=null,distance=Infinity;
  const candidate=t=>{if(t<now+.006)return;const d=Math.abs(time-t);if(d<distance){best=t;distance=d;}};
  for(const f of frames)candidate(f.time+(f.step%2?f.swing*f.six:0));
  const last=frames.at(-1);
  if(time>last.time){const n=Math.round((time-last.time)/last.six);for(let i=Math.max(1,n-1);i<=n+2;i++)candidate(last.time+i*last.six+((last.step+i)%2?last.swing*last.six:0));}
  // Existing scheduled microtiming stays intact; unscheduled contact joins the grid.
  return best===null?Math.max(time,now+.006):distance<.009?Math.max(time,now+.006):best;
 }
 return {remember,at,align,clear:()=>{frames.length=0;},get size(){return frames.length;}};
}
