import {openSurface} from './frame-state.js';
// Graphics quality. Automatic by default: if this device keeps drawing slower than about 40 frames per second,
// it switches to light mode (canvas at 1x and fewer particles) for the rest of the session. Ajustes can fix it.
export const QUALITIES=Object.freeze(['auto','alta','ligera']);
export const SAMPLE=90,SLOW_MS=25;
// Median interval of a full sample, ignoring pauses (hidden tab, a long load) and impossible values.
export function slowSample(intervals){const ok=intervals.filter(x=>x>4&&x<250).sort((a,b)=>a-b);if(ok.length<SAMPLE*.8)return false;return ok[Math.floor(ok.length/2)]>SLOW_MS;}
export const qualityOf=v=>QUALITIES.includes(v)?v:'auto';
export function initialize(runtime){
 const $=runtime.$;let light=false,samples=[],last=null,slow=0;
 // Automated browsers in tests run slowly by design; the automatic switch stays off there.
 const automated=!!globalThis.navigator?.webdriver;
 const setting=()=>qualityOf(runtime.S?.quality);
 const isLight=()=>setting()==='ligera'||(setting()==='auto'&&light);
 function apply(){runtime.resizeCanvas?.();$('graphicsQuality').value=setting();$('graphicsQualityHint').textContent=setting()==='auto'?(light?'Automática: ligera en este dispositivo.':'Automática: alta.'):setting()==='ligera'?'Menos resolución y partículas.':'Máxima resolución.';}
 function judge(list){if(setting()!=='auto'||light)return;if(slowSample(list)){if(++slow>=2){light=true;apply();}}else slow=0;}
 function tick(t){
  if(document.hidden||openSurface('.modal:not([hidden])')){last=null;return;}
  if(last!==null)samples.push(t-last);last=t;if(samples.length<SAMPLE)return;const list=samples;samples=[];if(!automated)judge(list);
 }
 $('graphicsQuality').onchange=e=>{runtime.S.quality=qualityOf(e.target.value);if(runtime.S.quality!=='auto')light=false;slow=0;apply();runtime.save();};
 Object.defineProperties(runtime,{lightQuality:{get:()=>isLight},qualityTick:{get:()=>tick},
  // Tests feed a sample directly, since automation never judges by itself.
  qualityProbe:{get:()=>list=>{judge(list);return isLight();}},qualityState:{get:()=>()=>({setting:setting(),light,slow})}});
 apply();
}
