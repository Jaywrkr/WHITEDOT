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
  const states=new Map();
  function nearbyRelics() {
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
  function pruneRelics() {const visible=new Set(nearbyRelics().map(s=>s.id));for(const id of states.keys())if(!visible.has(id))states.delete(id);}
  Object.defineProperties(runtime,{nearbyRelics:{get:()=>nearbyRelics},visitRelic:{get:()=>visitRelic},pulseRelics:{get:()=>pulseRelics},relicProgress:{get:()=>relicProgress},pruneRelics:{get:()=>pruneRelics},clearRelicProgress:{get:()=>()=>states.clear()}});
}
