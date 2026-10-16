// Integration of the actual scheduler with a recording graph, not a DSP/listening test.
import assert from 'node:assert/strict';
let clock=0,schedule=null;const starts=[];
const parameter=()=>({value:0,setValueAtTime(v){this.value=v;},setTargetAtTime(v){this.value=v;},linearRampToValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;},cancelScheduledValues(){},cancelAndHoldAtTime(){},setValueCurveAtTime(){}});
function node(){const n={connect:to=>to,disconnect(){},start(t){if(t!==undefined){assert(Number.isFinite(t));starts.push(t);}},stop(){},setPeriodicWave(){}};for(const id of ['gain','frequency','detune','Q','threshold','knee','ratio','attack','release','delayTime','pan','offset','playbackRate'])n[id]=parameter();return n;}
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
try{for(const genre of ['deep','dnb','ambient']){
 clock=0;schedule=null;const r={unifiedMusic:true};for(const id of ['data','progress','world','audio','foreground','voices','instruments','patches','effects','spatial','influence','blobs','living-composition','world-memory','performance'])(await import('../src/'+id+'.js')).initialize(r);
 const {labScore}=await import('../src/lab-score.js');const origin=r.regionOfPos(900,900);let d;for(let i=0;i<1600;i++){const candidate={...origin,key:(i%40-20)+','+(Math.floor(i/40)-20),genre,sea:false};if(labScore(candidate,r.seedOf,r.rng).electronic.count===(genre==='ambient'?1:10)){d=candidate;break;}};
 
 d.track={...origin.track,bassI:r.GEN[genre].bassI,hookI:r.GEN[genre].hookP[0]};d.bpm=(r.GEN[genre].bpm[0]+r.GEN[genre].bpm[1])/2;r.S.mode='world';r.S.sound=true;r.MU.dnaT=d;r.setBiome(d.z);r.MU.E=.45;r.MU.vit=1;r.MU.vari=2;const hits={};r.recordInstrument=id=>hits[id]=(hits[id]||0)+1;r.audio();
 for(let tick=0;tick<400;tick++){clock=tick*.025;schedule();}assert.equal(r.MU.radio.referenceOrigin,'acd766f');assert.equal(r.MU.radio.labScore.electronic.count,genre==='ambient'?1:10);assert(genre==='ambient'?Object.keys(hits).length===1:Object.keys(hits).length>=10,JSON.stringify({genre,hits}));console.log('PASS restored '+genre+' production: '+Object.keys(hits).length+' actual scheduled instruments; recording graph, not DSP');
}}finally{globalThis.setInterval=oldInterval;globalThis.setTimeout=oldTimeout;}
