import {setLatencyNudge,latencyNudge} from './journey-pulse.js';
// Calibration without a menu (plan H2, docs/MUNDO.md; Matsuura and Mizuguchi in the second panel): the first twelve
// pulses near a beat measure how late this player, this phone and these headphones are. If they agree (the middle half
// within 60 ms), that delay is kept in the save and every judgement of «on time» counts it. Ajustes can nudge it by
// 10 ms or measure again. A player who just plays off time is not «calibrated» away: scattered pulses keep it as it is.
export const CAL_SAMPLES=12,CAL_SPREAD=.06,CAL_REACH=.25,CAL_STEP=.01;
// The median and the spread of the middle half of the samples; whether they agree enough to be a delay.
export function calibrate(samples){const v=samples.filter(Number.isFinite).slice().sort((a,b)=>a-b);if(v.length<CAL_SAMPLES)return {ok:false,median:0,spread:Infinity};
 const q=k=>v[Math.min(v.length-1,Math.max(0,Math.round(k*(v.length-1))))],median=q(.5),spread=q(.75)-q(.25);return {ok:spread<=CAL_SPREAD,median,spread};}
export function normalizeLatency(s){const v=Number(s?.latencyNudge);return {nudge:Number.isFinite(v)?Math.max(-.08,Math.min(.3,v)):0,done:s?.latencyCal===true};}
export function initialize(runtime){
 let owner=null;const samples=[];
 // Reading a save never writes to it (a copy from the cloud must stay as it came): the fields appear when they change.
 function own(){if(owner!==runtime.S){owner=runtime.S;setLatencyNudge(normalizeLatency(runtime.S).nudge);samples.length=0;}return runtime.S;}
 const done=()=>normalizeLatency(own()).done;
 function sample(delta){const S=own();if(done()||!runtime.S.sound||!Number.isFinite(delta)||Math.abs(delta)>CAL_REACH)return;samples.push(delta);if(samples.length<CAL_SAMPLES)return;
  const r=calibrate(samples.slice(-CAL_SAMPLES));if(!r.ok){samples.shift();return;}
  // The pulses were judged with the delay already counted: the new one is the old plus what is still left over.
  S.latencyNudge=setLatencyNudge(latencyNudge()+(Math.abs(r.median)>.015?r.median:0));S.latencyCal=true;samples.length=0;runtime.save?.();show();}
 function nudge(by){const S=own();S.latencyNudge=setLatencyNudge(latencyNudge()+by);S.latencyCal=true;runtime.save?.();show();}
 function again(){const S=own();S.latencyCal=false;samples.length=0;runtime.save?.();show();}
 function show(){const el=runtime.$?.('latencyNow');if(!el)return;el.textContent=done()?`${Math.round(latencyNudge()*1000)} ms`:'Midiendo…';}
 own();if(runtime.$?.('latencyLess'))runtime.$('latencyLess').onclick=()=>nudge(-CAL_STEP);if(runtime.$?.('latencyMore'))runtime.$('latencyMore').onclick=()=>nudge(CAL_STEP);if(runtime.$?.('latencyAgain'))runtime.$('latencyAgain').onclick=again;
 Object.defineProperties(runtime,{calibrationSample:{get:()=>sample},latencyShow:{get:()=>show},calibrationState:{get:()=>()=>({nudge:latencyNudge(),done:done(),samples:samples.length})}});
}
