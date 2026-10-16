// Integration of the actual scheduler with a recording graph, not a DSP/listening test.
import assert from 'node:assert/strict';
let clock=0,schedule=null;const starts=[];
const parameter=()=>({value:0,setValueAtTime(v){this.value=v;},setTargetAtTime(v){this.value=v;},linearRampToValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;},cancelScheduledValues(){},cancelAndHoldAtTime(){},setValueCurveAtTime(){}});
function node(){const n={connect:to=>to,disconnect(){},start(t){if(t!==undefined){assert(Number.isFinite(t));starts.push(t);}},stop(){},setPeriodicWave(){}};for(const id of ['gain','frequency','detune','Q','threshold','knee','ratio','attack','release','delayTime','pan','offset'])n[id]=parameter();return n;}
class RecordingContext{
 constructor(){this.sampleRate=48000;this.state='running';this.destination=node();}
 get currentTime(){return clock;}
 createBuffer(ch,length){const rows=Array.from({length:ch},()=>new Float32Array(length));return {getChannelData:i=>rows[i],copyToChannel:(data,i)=>rows[i].set(data.subarray(0,rows[i].length)),duration:length/48000};}
 createPeriodicWave(){return {};}
 resume(){return Promise.resolve();}
}
for(const method of ['Gain','Oscillator','BufferSource','BiquadFilter','DynamicsCompressor','WaveShaper','Convolver','Delay','StereoPanner','ConstantSource'])RecordingContext.prototype['create'+method]=node;
globalThis.window=globalThis;globalThis.AudioContext=RecordingContext;globalThis.document={hidden:false,querySelector:()=>null};globalThis.localStorage={getItem:()=>null,setItem(){}};
const oldInterval=globalThis.setInterval,oldTimeout=globalThis.setTimeout;globalThis.setInterval=fn=>(schedule=fn,0);globalThis.setTimeout=()=>0;
try{
 const r={unifiedMusic:true};for(const id of ['data','progress','world','territory-journey','audio','foreground','voices','instruments','patches','effects','spatial','influence','blobs','living-composition','world-memory','performance'])(await import('../src/'+id+'.js')).initialize(r);
 r.S.mode='world';r.S.sound=false;r.audio();assert.equal(r.ac,null,'muted input does not create a graph');r.S.sound=true;r.S.wx=2700;r.S.wy=1800;r.MU.dnaT=r.regionOfPos(r.S.wx,r.S.wy);r.setBiome(r.MU.dnaT.z);r.MU.E=.6;r.MU.vit=1;
 const frames=[];r.territoryJourneyCue=f=>frames.push(f);r.audio();assert(schedule);
 for(let tick=0;tick<7200;tick++){
  clock=tick*.025;r.S.wx+=150*.025;r.MU.dnaT=r.regionOfPos(r.S.wx,r.S.wy);r.setBiome(r.MU.dnaT.z);schedule();
  if(r.MU.neighborRadio)assert.notEqual(r.MU.neighborRadio.key,r.MU.dnaA.key,'the two radios retain distinct territories');
 }
 assert(starts.length>100);assert(frames.length>50);let changedAt=frames[0].bar,swaps=0;
 for(let i=1;i<frames.length;i++){
  const a=frames[i-1],b=frames[i];
  if(a.primary!==b.primary){assert(b.swap);assert.equal(b.bar%8,0);assert(b.bar-changedAt>=8);changedAt=b.bar;swaps++;}
 }
 assert(swaps>=2,'exercise multiple real scheduler handovers');assert(frames.some(f=>f.secondary&&f.to>0));
 console.log('PASS actual production scheduler across 180 seconds of travel, distinct retained radios, multiple eight-bar handovers and finite scheduled sources; recording graph only, no DSP claim');
}finally{globalThis.setInterval=oldInterval;globalThis.setTimeout=oldTimeout;}
