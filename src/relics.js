import {openSurface} from './frame-state.js';
import {contactEntry} from './contact.js';
export const RELIC_RATE=1/48,MAGICAL_RELIC_RATE=1/384;
// A separate seed keeps terrain and existing object identities unchanged.
export function relicAt(cx,cy,size,seedOf,rng) {
  if(Math.max(Math.abs(cx),Math.abs(cy))<2)return null;
  const r=rng(seedOf(`relic-site:v1:${cx},${cy}`)),roll=r();
  if(roll>=RELIC_RATE)return null;
  const magical=roll<MAGICAL_RELIC_RATE;
  return {id:`site:v1:${cx},${cy}`,x:(cx+.2+r()*.6)*size,y:(cy+.2+r()*.6)*size,s:Math.floor(r()*12),magical,name:magical?'Constelación dormida':'Eco antiguo',got:false};
}
export function advanceRelic(state,site,dt,distance,pulse=false) {
  if(distance>140){state.dwell=0;state.pulses=0;return false;}
  if(distance<=100){state.dwell=Math.min(site.magical?12:6,(state.dwell||0)+Math.max(0,Math.min(dt,.05)));if(pulse)state.pulses=Math.min(site.magical?5:3,(state.pulses||0)+1);}
  return state.dwell>=(site.magical?12:6)&&state.pulses>=(site.magical?5:3);
}
export function initialize(runtime) {
  const states=new Map(),echoes=new Map();let owner=runtime.S;
  function nearbyRelics() {
    if(owner!==runtime.S){owner=runtime.S;states.clear();echoes.clear();}
    const result=[],cx=Math.floor(runtime.S.wx/runtime.WCH),cy=Math.floor(runtime.S.wy/runtime.WCH);
    for(let x=cx-1;x<=cx+1;x++)for(let y=cy-1;y<=cy+1;y++){
      const site=relicAt(x,y,runtime.WCH,runtime.seedOf,runtime.rng);
      if(site&&!runtime.S.relicSites?.[site.id])result.push(site);
    }
    // Preserve the remaining relics from the saved day; never generate more legacy sites.
    if(runtime.S.rel?.day===runtime.S.todayKey)result.push(...runtime.S.rel.list.filter(r=>!r.got));
    return result;
  }
  function visitRelic(site,dt,pulse=false) {
    if(!site.id)return false;
    const distance=Math.hypot(site.x-runtime.S.wx,site.y-runtime.S.wy);
    if(distance<=100&&dt>0&&!runtime.S.help.relicInstructions){runtime.S.help.relicInstructions=true;runtime.say('Reliquia: un recuerdo musical. Quédate cerca y lanza '+(site.magical?'cinco':'tres')+' pulsos.','Despierta un recuerdo');}
    let state=states.get(site.id);
    if(!state){if(distance>140)return false;state={dwell:0,pulses:0};states.set(site.id,state);}
    const ready=advanceRelic(state,site,dt,distance,pulse);
    if(distance>140)states.delete(site.id);
    if(ready){runtime.takeRelic(site);states.delete(site.id);}
    return ready;
  }
  function pulseRelics(){
    for(const site of nearbyRelics()){
      if(!site.id||Math.hypot(site.x-runtime.S.wx,site.y-runtime.S.wy)>100)continue;
      visitRelic(site,0,true);
      const degree=relicProgress(site).pulses;
      runtime.beatSoon(q=>runtime.playVoice('reliquia',degree,q,runtime.regionOfPos(site.x,site.y),site.magical,1,site));
    }
  }
  function relicProgress(site){return states.get(site.id)||{dwell:0,pulses:0};}
  function recoveredRelics(){
    if(owner!==runtime.S){owner=runtime.S;states.clear();echoes.clear();}
    const cx=Math.floor(runtime.S.wx/runtime.WCH),cy=Math.floor(runtime.S.wy/runtime.WCH),out=[];
    for(let x=cx-1;x<=cx+1;x++)for(let y=cy-1;y<=cy+1;y++){const site=relicAt(x,y,runtime.WCH,runtime.seedOf,runtime.rng);if(!site||!runtime.S.relicSites?.[site.id])continue;
      if(!echoes.has(site.id)){echoes.set(site.id,{...site,touching:false});while(echoes.size>64)echoes.delete(echoes.keys().next().value);}out.push(echoes.get(site.id));}return out;
  }
  function echoTick(){
    const available=runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'&&!globalThis.document?.hidden&&!openSurface('.modal:not([hidden])')&&!runtime.scanning;
    for(const o of recoveredRelics()){const distance=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy);if(contactEntry(o,distance<22,available)&&runtime.S.sound&&runtime.ac?.state==='running'){const state=runtime.S;runtime.beatSoon(t=>{if(state===runtime.S&&Math.hypot(o.x-state.wx,o.y-state.wy)<70)runtime.playVoice('reliquia',0,t,runtime.regionOfPos(o.x,o.y),true,.6,o,'player');},null,'player');}}
  }
  function drawEchoes(ox,oy,radius){if(!runtime.inWorld()||(runtime.S.layer||'superficie')!=='superficie')return;const c=runtime.cx;
    for(const o of recoveredRelics()){const d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy);if(d>radius)continue;c.save();c.translate(o.x+ox,o.y+oy);c.strokeStyle=runtime.GOLD;c.globalAlpha=Math.max(0,1-d/radius)*.65;c.lineWidth=1;c.beginPath();c.moveTo(0,-6);c.lineTo(5,0);c.lineTo(0,6);c.lineTo(-5,0);c.closePath();c.stroke();if(d<65){c.font='11px "Geist Mono", monospace';c.textAlign='center';c.fillStyle=runtime.GOLD;c.fillText('Toca el recuerdo',0,22);}c.restore();}
  }
  function pruneRelics() {const visible=new Set(nearbyRelics().map(s=>s.id));for(const id of states.keys())if(!visible.has(id))states.delete(id);}
  Object.defineProperties(runtime,{nearbyRelics:{get:()=>nearbyRelics},recoveredRelics:{get:()=>recoveredRelics},relicEchoTick:{get:()=>echoTick},drawRelicEchoes:{get:()=>drawEchoes},visitRelic:{get:()=>visitRelic},pulseRelics:{get:()=>pulseRelics},relicProgress:{get:()=>relicProgress},pruneRelics:{get:()=>pruneRelics},clearRelicProgress:{get:()=>()=>states.clear()}});
}
