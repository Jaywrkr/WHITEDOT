// Three persistent accompaniment paths. Gestures never lower their own voice or master.
export function createStage(ac,outputs){
 const inputs=outputs.map(output=>{const gain=ac.createGain();gain.connect(output);return gain;});let until=-Infinity;
 function focus(time){
  if(!Number.isFinite(time))return;time=Math.max(ac.currentTime,time);until=Math.max(until,time+.5);
  for(const node of inputs){const p=node.gain;if(p.cancelAndHoldAtTime)p.cancelAndHoldAtTime(time);else p.cancelScheduledValues?.(time);
   p.setTargetAtTime(.62,time,.012);p.setTargetAtTime(1,until,.22);}
 }
 return {inputs,focus,get until(){return until;}};
}
export function initialize(runtime){
 let ac=null,stage=null;
 function ensure(){if(runtime.ac&&runtime.ac!==ac){ac=runtime.ac;stage=createStage(ac,[runtime.bus,runtime.verbIn,runtime.dsend]);}return stage;}
 function accompaniment(emit){const s=ensure();if(!s)return emit();const old=[runtime.bus,runtime.verbIn,runtime.dsend];[runtime.bus,runtime.verbIn,runtime.dsend]=s.inputs;
  try{return emit();}finally{[runtime.bus,runtime.verbIn,runtime.dsend]=old;}}
 function focus(time,source,role){if(!runtime.inWorld()||!runtime.S.sound||runtime.ac?.state!=='running'||globalThis.document?.hidden||globalThis.document?.querySelector('.modal:not([hidden])'))return;
  ensure()?.focus(time);runtime.foregroundNoteCue?.({time,role,source:source?.id});}
 Object.defineProperties(runtime,{withAccompaniment:{get:()=>accompaniment},focusGesture:{get:()=>focus},accompanimentStage:{get:()=>ensure}});
}
