import {prefersReducedMotion} from './frame-state.js';
import {territoryInk} from './territory-transition.js';
import {musicalInk} from './visual.js';
// Audio onset uses the audio clock; drawing uses the monotonic display clock.
export function createCueBuffer(limit=32) {
  const cues=[];
  return {
    add(source,role,onset,filter=null,origin='ambient') {
      if(!source||!Number.isFinite(source.x)||!Number.isFinite(source.y)||!Number.isFinite(onset))return;
      if(filter){const same=cues.findLast(c=>c.source===source&&c.role===role&&Math.abs(c.onset-onset)<15);if(same){same.filter=filter;return;}}
      cues.push({source,role,onset,filter,origin});
      if(cues.length>limit){const quiet=cues.findIndex(c=>!['player','field','lesson'].includes(c.origin));cues.splice(quiet<0?0:quiet,1);}
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
    return region?territoryInk(region,role,runtime.seedOf):musicalInk(190,role);
  }
  function soundCue(source,role,time,origin='ambient') {
    if(!runtime.inWorld()||!runtime.S.sound||runtime.musicVolume?.()===0||runtime.ac?.state!=='running')return;
    runtime.wowSoundCue?.(source,role,time);
    buffer.add(source,role,performance.now()+Math.max(0,time-runtime.ac.currentTime)*1000,null,origin);
  }
  function filterCue(source,role,filter,time){
    if(!runtime.inWorld()||!runtime.S.sound||runtime.musicVolume?.()===0||runtime.ac?.state!=='running')return;
    buffer.add(source,role,performance.now()+Math.max(0,time-runtime.ac.currentTime)*1000,{...filter});
  }
  function drawSoundCues(ox,oy,radius) {
    if(!runtime.inWorld()||!runtime.S.sound||runtime.musicVolume?.()===0||runtime.ac?.state!=='running'){buffer.clear();return;}
    const ctx=runtime.cx;let named=false;
    runtime.drawLabLearning?.(ox,oy);
    const held=runtime.heldContact;
    if(held?.source){const source=held.source,x=source.x+ox,y=source.y+oy,r=Math.min(30,(source.size||18)+8);
      ctx.save();ctx.strokeStyle=musicInk(source,held.role);ctx.globalAlpha=.7;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,Math.PI*1.1);ctx.stroke();ctx.restore();
    }
    const cues=buffer.active(performance.now()).reverse().sort((a,b)=>Number(['player','field','lesson'].includes(b.origin))-Number(['player','field','lesson'].includes(a.origin))).slice(0,8);
    for(const cue of cues) {
      const {source,role,age}=cue;
      if(Math.hypot(source.x-runtime.S.wx,source.y-runtime.S.wy)>radius)continue;
      const reduced=runtime.S.reducedMotion||prefersReducedMotion(),r=12+(reduced?0:age*(role==='bajo'?28:20));
      ctx.save();ctx.translate(source.x+ox,source.y+oy);
      const foreground=['player','field','lesson'].includes(cue.origin);
      ctx.strokeStyle=musicInk(source,role);ctx.lineWidth=(role==='bajo'?2:1.6)+(foreground?.4:0);ctx.globalAlpha=(1-age)*(foreground?.98:.42);
      ctx.beginPath();
      if(role==='perc')for(let i=0;i<4;i++){const a=i*Math.PI/2;ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.lineTo(Math.cos(a)*(r+5),Math.sin(a)*(r+5));}
      else if(/string|bow|harp|guitar|silk|cello/i.test(source.musicInstrument||'')){for(let i=-1;i<=1;i++){ctx.moveTo(-r,i*4);ctx.quadraticCurveTo(0,i*4+Math.sin(age*Math.PI*4)*5*(1-age),r,i*4);}}
      else if(/flute|wind|reed|horn/i.test(source.musicInstrument||'')){ctx.moveTo(-r,3);ctx.bezierCurveTo(-r/3,-r,r/3,r,r,-3);}
      else if(/piano|keys|clav|rhodes|tine/i.test(source.musicInstrument||'')){for(let i=-1;i<=1;i++){ctx.moveTo(i*7,-r*.5);ctx.lineTo(i*7,-r*.5-6-age*4);}}
      else if(role==='lead'){ctx.moveTo(-r/2,0);ctx.lineTo(0,-r);ctx.lineTo(r/2,-r/2);}
      else if(role==='agudo'){ctx.moveTo(-r/2,0);ctx.lineTo(r/2,0);ctx.moveTo(0,-r/2);ctx.lineTo(0,r/2);}
      else {ctx.arc(0,0,r,0,Math.PI*2);if(role==='acorde')for(let i=1;i<3;i++){ctx.moveTo(r+i*4,0);ctx.arc(0,0,r+i*4,0,Math.PI*2);}}
      ctx.stroke();
      const filter=cue.filter;
      if(foreground&&!named&&Math.hypot(source.x-runtime.S.wx,source.y-runtime.S.wy)<65&&age<.7){named=true;ctx.font='11px "Geist Mono", monospace';ctx.textAlign='center';ctx.fillStyle=ctx.strokeStyle;
       const name={bajo:'Bajo',perc:'Ritmo',acorde:'Acorde',lead:'Melodía',agudo:'Detalle'}[role]||'';ctx.fillText(name+(filter?' · Filtro'+(filter.slope?' '+filter.slope+' dB':''):''),0,-28,180);}
      if(filter){
       const phase=filter.end>filter.start?age:1-age;ctx.lineWidth=.8;for(let i=0;i<filter.stages;i++){ctx.beginPath();ctx.arc(0,0,9+i*3,-Math.PI/2,-Math.PI/2+Math.PI*2*(.2+phase*.7));ctx.stroke();}
      }ctx.restore();
    }
  }
  Object.defineProperties(runtime,{musicInk:{get:()=>musicInk},clearSoundCues:{get:()=>()=>buffer.clear()},soundCue:{get:()=>soundCue},soundCuesNow:{get:()=>()=>buffer.active(performance.now())},filterCue:{get:()=>filterCue},drawSoundCues:{get:()=>drawSoundCues}});
}
