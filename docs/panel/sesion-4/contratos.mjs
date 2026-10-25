// Evidence probe for session 4. It reports violated contracts; this is not a passing regression test.
import {layerStep,songChord} from '../../../src/song.js';
import {themePitch,THEME,landDelay} from '../../../src/journey-pulse.js';
import {victorySeconds} from '../../../src/journey-victory.js';
import {initialize} from '../../../src/places.js';
const scale=[0,2,3,5,7,8,10],chord=[57,60,64],allowed=new Set(scale.map(n=>(57+n)%12));
const events=layerStep('cristales',4,songChord(chord)),pitches=THEME.map(([d])=>themePitch(d,scale)+19);
let disk,fail=false;globalThis.setTimeout=()=>0;
const r={S:{wx:0,wy:0,sound:true,sparks:0,todayKey:'audit',journey:{finished:true}},BIOMES:[{id:'llanura'}],biomeOfPos:()=>0,regionOfPos:()=>({}),MU:{},save:()=>{if(fail)return false;disk=JSON.parse(JSON.stringify(r.S));return true;},hud(){},$:()=>null};
initialize(r);r.startPlace('llanura');for(let i=0;i<10;i++)r.placeHear('llanura',true,{});fail=true;const closed=r.placeFinish('llanura');
const f={S:{wx:0,wy:0,journey:{finished:true},lugares:{version:9,unknown:'keep'}},BIOMES:[],MU:{},$:()=>null};initialize(f);let futureReadError=null;try{f.places();}catch(e){futureReadError=e.name+': '+e.message;}
console.log(JSON.stringify({
 scope:'Pure runtime contracts, synthetic valid harmony and mocked save failure. Not human play or a real storage-quota test.',
 harmony:{scale,chord,events,outsideScale:events.filter(e=>Number.isFinite(e.midi)&&!allowed.has(e.midi%12)),finalSecondTheme:pitches,outsideSecondTheme:pitches.filter(n=>!allowed.has(n%12)),
 currentPrismaContext:{scale:[0,2,4,5,7,9,11],transpose:7,chord:[73,76,80],events:layerStep('cristales',4,songChord([73,76,80])),description:'C# minor is diatonic in E major. Emitted MIDI 77 (F natural) is outside that scale.'}},
 saveFailure:{finishReturned:closed,ramStars:r.S.lugares.stars.llanura,diskStars:disk.lugares.stars.llanura,ramSparks:r.S.sparks,diskSparks:disk.sparks},
 futureState:{state:f.S.lugares,error:futureReadError},
 timing:{outputLatencyMs:400,returnedVisualDelayMs:landDelay(1,1,.4),earlyMs:400-landDelay(1,1,.4),scope:'Pure scheduling limit, not a measured phone'},
 closeTiming:{at120BpmSeconds:victorySeconds(.125),resultCardDelaySeconds:1.2,scope:'Source contract: results timer in places.js, not a measured user transition'}
},null,2));
