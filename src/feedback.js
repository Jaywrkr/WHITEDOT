import {musicalInk} from './visual.js';
// Audio onset uses the audio clock; drawing uses the monotonic display clock.
export function createCueBuffer(limit=32) {
  const cues=[];
  return {
    add(source,role,onset,filter=null) {
      if(!source||!Number.isFinite(source.x)||!Number.isFinite(source.y)||!Number.isFinite(onset))return;
      cues.push({source,role,onset,filter});
      if(cues.length>limit)cues.splice(0,cues.length-limit);
    },
    active(now) {
      for(let i=cues.length-1;i>=0;i--)if(now-cues[i].onset>650)cues.splice(i,1);
      return cues.filter(c=>now>=c.onset).map(c=>({...c,age:(now-c.onset)/650}));
    },
    clear(){cues.length=0;}
  };
}
export function initialize(runtime) {
  const buffer=createCueBuffer();
  function musicInk(source,role='lead'){
    const region=runtime.regionOfPos?.(source?.x??runtime.S.wx,source?.y??runtime.S.wy);
    return musicalInk(region?.hue??190,role);
  }
  function soundCue(source,role,time) {
    if(!runtime.inWorld()||!runtime.S.sound||runtime.ac?.state!=='running')return;
    buffer.add(source,role,performance.now()+Math.max(0,time-runtime.ac.currentTime)*1000);
  }
  function filterCue(source,role,filter,time){
    if(!runtime.inWorld()||!runtime.S.sound||runtime.ac?.state!=='running')return;
    buffer.add(source,role,performance.now()+Math.max(0,time-runtime.ac.currentTime)*1000,{...filter});
  }
  function drawSoundCues(ox,oy,radius) {
    if(!runtime.inWorld()||!runtime.S.sound||runtime.ac?.state!=='running'){buffer.clear();return;}
    const ctx=runtime.cx;
    for(const cue of buffer.active(performance.now())) {
      const {source,role,age}=cue;
      if(Math.hypot(source.x-runtime.S.wx,source.y-runtime.S.wy)>radius)continue;
      const r=8+age*(role==='bajo'?38:18);
      ctx.save();ctx.translate(source.x+ox,source.y+oy);
      ctx.strokeStyle=musicInk(source,role);ctx.lineWidth=role==='bajo'?2:1;ctx.globalAlpha=(1-age)*.65;
      ctx.beginPath();
      if(role==='perc')for(let i=0;i<4;i++){const a=i*Math.PI/2;ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.lineTo(Math.cos(a)*(r+5),Math.sin(a)*(r+5));}
      else if(role==='lead'){ctx.moveTo(-r/2,0);ctx.lineTo(0,-r);ctx.lineTo(r/2,-r/2);}
      else if(role==='agudo'){ctx.moveTo(-r/2,0);ctx.lineTo(r/2,0);ctx.moveTo(0,-r/2);ctx.lineTo(0,r/2);}
      else {ctx.arc(0,0,r,0,Math.PI*2);if(role==='acorde')for(let i=1;i<3;i++){ctx.moveTo(r+i*4,0);ctx.arc(0,0,r+i*4,0,Math.PI*2);}}
      ctx.stroke();
      const filter=cue.filter;
      if(filter){
       const phase=filter.end>filter.start?age:1-age;ctx.lineWidth=.8;for(let i=0;i<filter.stages;i++){ctx.beginPath();ctx.arc(0,0,9+i*3,-Math.PI/2,-Math.PI/2+Math.PI*2*(.2+phase*.7));ctx.stroke();}
       if(Math.hypot(source.x-runtime.S.wx,source.y-runtime.S.wy)<90){ctx.fillStyle=ctx.strokeStyle;ctx.font='9px "Geist Mono", monospace';ctx.textAlign='center';ctx.fillText(filter.slope?'Filtro '+filter.slope+' dB':filter.type==='bandpass'?'Filtro de banda':'Filtro de muesca',0,-24);}
      }ctx.restore();
    }
  }
  Object.defineProperties(runtime,{musicInk:{get:()=>musicInk},clearSoundCues:{get:()=>()=>buffer.clear()},soundCue:{get:()=>soundCue},filterCue:{get:()=>filterCue},drawSoundCues:{get:()=>drawSoundCues}});
}
