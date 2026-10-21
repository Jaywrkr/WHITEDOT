import assert from 'node:assert/strict';
import {CUBE_SHOP,shopPiece} from '../src/cube-shop-model.js';
import {SHOP_VOICES,SHOP_SOUNDS,playShopVoice,playHum,playRadio,playStepNote,playScratch,filterCutoff,stepDegree,fit,initialize} from '../src/cube-shop-sound.js';
// Batch 5 pieces, as listed in docs/TIENDA_DEL_CUBO.md.
const batch5=[...SHOP_VOICES,...SHOP_SOUNDS,'trail:notes'].map(shopPiece);
assert(batch5.every(Boolean));assert.equal(batch5.length,12);assert.equal(batch5.reduce((a,p)=>a+p.cost,0),3025);
assert(SHOP_VOICES.every(id=>shopPiece(id).slot==='pulseVoice'));assert(SHOP_SOUNDS.every(id=>shopPiece(id).slot==='sound'));assert.equal(shopPiece('trail:notes').slot,'trail');
assert.equal(new Set(CUBE_SHOP.map(p=>p.id)).size,CUBE_SHOP.length);
// A small offline graph: every node records what it was asked to do.
function fakeContext(){
 const nodes=[];const param=v=>({value:v,events:[],setValueAtTime(x,t){this.events.push(['set',x,t]);},exponentialRampToValueAtTime(x,t){assert(x>0,'exponential ramps need a positive target');this.events.push(['exp',x,t]);},linearRampToValueAtTime(x,t){this.events.push(['lin',x,t]);},setTargetAtTime(x,t){this.events.push(['target',x,t]);}});
 const node=(kind,extra={})=>{const n={kind,links:[],connect(o){this.links.push(o);return o;},...extra};nodes.push(n);return n;};
 return {nodes,currentTime:0,createOscillator:()=>node('osc',{type:'sine',frequency:param(440),start(t){this.at=t;},stop(t){this.end=t;}}),createGain:()=>node('gain',{gain:param(1)}),createBiquadFilter:()=>node('filter',{type:'lowpass',frequency:param(350),Q:param(1)}),createBufferSource:()=>node('buffer',{playbackRate:param(1),start(t){this.at=t;},stop(t){this.end=t;}})};
}
const out={kind:'out'},peak=ac=>Math.max(...ac.nodes.filter(n=>n.kind==='gain'&&!n.gain.events.some(e=>e[0]==='set'&&e[1]>1)).flatMap(n=>n.gain.events.filter(e=>e[0]==='exp').map(e=>e[1])));
const ranges={'voice:808':[31,43],'voice:bell':[72,84],'voice:acid':[36,48],'voice:vocal':[55,67],'voice:scratch':[48,60],'voice:chord':[55,72]};
for(const id of SHOP_VOICES)for(const n of [24,45,60,71,96]){
 const ac=fakeContext(),notes=playShopVoice(ac,out,id,1,n,.2,{tones:[60,64,67,71,74],noise:{}});
 assert(notes.length===(id==='voice:chord'?3:1),id);for(const m of notes)assert(m>=ranges[id][0]&&m<=ranges[id][1],id+' '+m);
 assert(ac.nodes.some(n=>n.links.includes(out)),id+' reaches the bus');assert(peak(ac)<=.2*1.25+1e-9,id+' stays near the pulse level');
 assert(ac.nodes.filter(n=>n.kind==='osc'||n.kind==='buffer').every(n=>n.at>=1&&n.end>n.at&&n.end<=2.5),id+' every source starts and stops');
}
assert.deepEqual(playShopVoice(fakeContext(),out,'voice:chord',0,60,.2,{tones:[50,53,57]}).map(n=>n%12),[50%12,53%12,57%12]);
assert.deepEqual(playShopVoice(fakeContext(),out,'voice:none',0,60,.2),[]);assert.deepEqual(playShopVoice(null,out,'voice:808',0,60,.2),[]);assert.deepEqual(playShopVoice(fakeContext(),out,'voice:808',0,NaN,.2),[]);
for(const f of [playHum,playRadio,playStepNote]){const ac=fakeContext();f(ac,out,0,60,.03);assert(peak(ac)<=.03+1e-9);}
{const ac=fakeContext();playScratch(ac,out,0,70,.05,{});assert(ac.nodes.some(n=>n.kind==='buffer'));}
assert.equal(fit(20,31,43),32);assert.equal(fit(100,72,84),76);
assert.equal(filterCutoff(0),4200);assert.equal(filterCutoff(1e6),18000);assert(filterCutoff(80)>4200&&filterCutoff(80)<18000);
assert.equal(stepDegree(10,10),stepDegree(40,50));assert(Array.from({length:40},(_,i)=>stepDegree(i*64,0)).every(d=>d>=0&&d<7));
// Runtime: the pulse is handed over only while worn in the World, and nothing sounds while the sound is off.
const queue=[];
const r={S:{wx:0,wy:0,sound:false,layer:'superficie',mode:'world'},MU:{q8:queue,dnaT:{key:'0,0',z:0,trOff:0,scale:[0,2,4,5,7,9,11]},deg:0},BIOMES:[{tr:0}],W:400,H:400,inWorld:()=>true,sparkEconomy:{wear:{},on:{}},vel:x=>x,regionOfPos:(x)=>({key:x>600?'1,0':'0,0',z:0,trOff:x>600?5:0,scale:[0,2,4,5,7,9,11]}),hatHit:()=>{r.hats=(r.hats||0)+1;}};
initialize(r);
const raw=Object.freeze({role:'perc',instrument:'wood',low:40,high:60});
assert.equal(r.cubeShopPulseVoice(raw),null);
r.sparkEconomy={wear:{pulseVoice:'voice:bell'},on:{}};assert.equal(r.cubeShopPulseVoice(raw).instrument,'shop:voice:bell');assert.equal(r.cubeShopPulseVoice(raw).role,'perc');
r.inWorld=()=>false;assert.equal(r.cubeShopPulseVoice(raw),null);r.inWorld=()=>true;
assert.equal(r.playCubeShopVoice('shop:voice:bell',60,0,.2,null),false,'no audio graph, no sound');
const c={save(){},restore(){},fillRect(){},strokeRect(){},beginPath(){},arc(){},stroke(){},fill(){},moveTo(){},lineTo(){},closePath(){},quadraticCurveTo(){}};
r.sparkEconomy={wear:{trail:'trail:notes'},on:{'sound:hat':true,'sound:hum':true,'sound:antenna':true,'sound:dj':true,'sound:filter':true}};
let t=1000;const walk=(dx,dy,frames)=>{for(let i=0;i<frames;i++){t+=16;r.S.wx+=dx;r.S.wy+=dy;r.cubeShopFilterTick();r.drawCubeShopSoundUnder(c,200,200,10,t);r.drawCubeShopSoundOver(c,200,200,10,t);}};
walk(2,0,120);assert.equal(queue.length,0,'muted: nothing is queued');assert(r.cubeShopSounds().marks>=3,'step notes still show while muted');
// Sound on: a tiny audio graph lets the queue run.
r.S.sound=true;r.ac=Object.assign(fakeContext(),{state:'running'});r.bus={kind:'bus'};r.mfilt={frequency:{events:[],setTargetAtTime(x,tt){this.events.push(x);}}};
walk(2,0,60);assert(queue.length>=1,'walking queues a hat');for(const item of queue.splice(0))item.fn(r.ac.currentTime+.1);assert(r.hats>=1);
assert(r.mfilt.frequency.events.length&&r.mfilt.frequency.events.at(-1)>4200,'running opens the filter');
r.S.mode='camino';walk(0,0,2);assert.equal(r.mfilt.frequency.events.at(-1),18000,'leaving the World opens the music');r.S.mode='world';walk(2,0,10);
walk(-2,0,30);for(const item of queue.splice(0))item.fn(.2);assert(r.cubeShopSounds().dj>=1,'a sharp turn scratches');
for(let i=0;i<80;i++)walk(-2,0,1);for(const item of queue.splice(0))item.fn(.3);assert(r.cubeShopSounds().step>=1,'walking back over a note plays it');
for(let i=0;i<20;i++){walk(0,0,10);for(const item of queue.splice(0))item.fn(.4);}assert(r.cubeShopSounds().hum>=1,'standing still hums');
r.S.wx=300;r.S.wy=0;for(let i=0;i<20;i++){t+=1100;walk(0,0,2);for(const item of queue.splice(0))item.fn(.5);}assert(r.cubeShopSounds().radio>=1&&r.cubeShopSounds().neighbour==='1,0','the antenna hears the neighbour');
r.sparkEconomy={wear:{},on:{}};walk(0,0,2);assert.equal(r.mfilt.frequency.events.at(-1),18000,'taking the filter off opens the music again');
console.log('PASS batch 5: 12 sound pieces and 3025 sparks, six voices in range and level, quiet cube sounds, filter by speed, deterministic step notes, silent while muted');
