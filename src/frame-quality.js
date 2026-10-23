import {openSurface} from './frame-state.js';
// Graphics quality. Automatic by default: if this device keeps drawing slower than about 40 frames per second,
// it switches to light mode (canvas at 1x and fewer particles) for the rest of the session. Ajustes can fix it.
export const QUALITIES=Object.freeze(['auto','alta','ligera']);
export const SAMPLE=90,SLOW_MS=25;
// Median interval of a full sample, ignoring pauses (hidden tab, a long load) and impossible values.
export function slowSample(intervals){const ok=intervals.filter(x=>x>4&&x<250).sort((a,b)=>a-b);if(ok.length<SAMPLE*.8)return false;return ok[Math.floor(ok.length/2)]>SLOW_MS;}
export const qualityOf=v=>QUALITIES.includes(v)?v:'auto';
// Measuring on a real phone (phase 4 of the plan): the median and the 95th percentile of the last frames, in ms.
export const MEASURE_FRAMES=300;
export function frameStats(intervals){const ok=intervals.filter(x=>x>0&&x<1000).sort((a,b)=>a-b);if(!ok.length)return {n:0,p50:0,p95:0};const at=q=>ok[Math.min(ok.length-1,Math.floor(ok.length*q))];return {n:ok.length,p50:Math.round(at(.5)*10)/10,p95:Math.round(at(.95)*10)/10};}
export function initialize(runtime){
 const $=runtime.$;let light=false,samples=[],last=null,slow=0;const recent=[];
 // `?medir=1` shows the frame times in a corner, to read them on a phone; nothing is sent anywhere.
 const measuring=(()=>{try{return new URLSearchParams(location.search).get('medir')==='1';}catch(_){return false;}})();let meter=null,shownAt=0;
 function show(t){if(!measuring||t-shownAt<1000)return;shownAt=t;if(!meter){meter=document.createElement('div');meter.id='frameMeter';meter.setAttribute('aria-hidden','true');meter.style.cssText='position:fixed;left:8px;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:9999;font:11px/1.4 monospace;color:#fff;background:#000c;padding:2px 6px;pointer-events:none';document.body.appendChild(meter);}const s=frameStats(recent);meter.textContent=`p50 ${s.p50} ms · p95 ${s.p95} ms · ${isLight()?'ligera':'alta'} · ${Math.round(devicePixelRatio*10)/10}×`;}
 // Automated browsers in tests run slowly by design; the automatic switch stays off there.
 const automated=!!globalThis.navigator?.webdriver;
 const setting=()=>qualityOf(runtime.S?.quality);
 const isLight=()=>setting()==='ligera'||(setting()==='auto'&&light);
 function apply(){runtime.resizeCanvas?.();$('graphicsQuality').value=setting();$('graphicsQualityHint').textContent=setting()==='auto'?(light?'Automática: ligera en este dispositivo.':'Automática: alta.'):setting()==='ligera'?'Menos resolución y partículas.':'Máxima resolución.';}
 function judge(list){if(setting()!=='auto'||light)return;if(slowSample(list)){if(++slow>=2){light=true;apply();}}else slow=0;}
 function tick(t){
  if(document.hidden||openSurface('.modal:not([hidden])')){last=null;return;}
  if(last!==null){samples.push(t-last);recent.push(t-last);if(recent.length>MEASURE_FRAMES)recent.shift();}last=t;show(t);if(samples.length<SAMPLE)return;const list=samples;samples=[];if(!automated)judge(list);
 }
 $('graphicsQuality').onchange=e=>{runtime.S.quality=qualityOf(e.target.value);if(runtime.S.quality!=='auto')light=false;slow=0;apply();runtime.save();};
 Object.defineProperties(runtime,{lightQuality:{get:()=>isLight},qualityTick:{get:()=>tick},
  // Tests feed a sample directly, since automation never judges by itself.
  qualityProbe:{get:()=>list=>{judge(list);return isLight();}},qualityState:{get:()=>()=>({setting:setting(),light,slow})},frameTimes:{get:()=>()=>({...frameStats(recent),light:isLight()})}});
 apply();
}
