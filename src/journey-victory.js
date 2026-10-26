import {cueDelay,landDelay} from './journey-pulse.js';
import {SONG_IDS,layerStep,songChord} from './song.js';
import {stageEvents,songPlan} from './song-stage.js';
// A kept place briefly answers with the same layer heard later in Tu canción. The radio, player's filter and output
// remain untouched: no mandatory riser, crash, silence, or independent lead. Driven by the live sequencer/chord.
export const DROP_BARS=2;
export const victorySeconds=six=>DROP_BARS*16*six;
export function dropEvents(id,chordAt){const out=[];for(let s=0;s<DROP_BARS*16;s++)out.push(...layerStep(id,s,songChord(chordAt(Math.floor(s/16)))));return out;}
export function initialize(runtime){
 let run=null;
 function release(r,at=runtime.ac?.currentTime||0){if(!r)return;const now=at;try{r.out.gain.cancelScheduledValues(now);r.out.gain.setTargetAtTime(.0001,now,.02);setTimeout(()=>r.out.disconnect(),landDelay(at,runtime.ac?.currentTime||0)+150);}catch(_){r.out.disconnect?.();}}
 function cancel(at){const previous=run;run=null;release(previous,at);}
 function play(id){cancel();const ac=runtime.ac;if(!SONG_IDS.includes(id)||!runtime.S.sound||!ac||!runtime.bus||!runtime.songHit)return 0;
  const out=ac.createGain();out.gain.value=.3;out.connect(runtime.bus);const six=runtime.SIX||.15;
  // The next scheduled downbeat; otherwise wait for step zero instead of guessing a beat from wall time.
  const next=(runtime.MU?.sq||[]).filter(e=>e.s%16===0&&e.t>ac.currentTime+.01).sort((a,b)=>a.t-b.t)[0]?.t;
  run={id,out,six,drop:next??null,end:next==null?null:next+victorySeconds(six),owner:runtime.S,mode:runtime.S.mode,layer:runtime.S.layer,played:new Set(),bars:{},k:-1,lastStep:null,lastTime:-Infinity,plan:songPlan({ids:[id]})};
  return cueDelay(ac,(next??ac.currentTime+16*six)+victorySeconds(six));}
 function step(s,t){if(!run)return;if(!runtime.S.sound||run.owner!==runtime.S||run.mode!==runtime.S.mode||run.layer!==runtime.S.layer){cancel();return;}
  if(run.drop===null){if(s%16)return;run.drop=t;run.end=t+victorySeconds(run.six);}
  if(t<run.drop-.001||t<=run.lastTime)return;const beat=((s%16)+16)%16;if(run.lastStep===null&&beat!==0)return;
  const delta=run.lastStep===null?1:(beat-run.lastStep+16)%16;if(!delta)return;run.k+=delta;run.lastStep=beat;run.lastTime=t;
  if(run.k>=DROP_BARS*16){cancel(t);return;}const k=run.k,six=runtime.SIX||run.six;run.end=t+(DROP_BARS*16-k)*six;run.played.add(k);
  const bar=Math.floor(k/16),chord=runtime.chordTones?.()||[57,60,64],MU=runtime.MU||{},scale=MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale;run.bars[bar]||=chord.slice();
  for(const e of stageEvents(run.plan,k,chord,{tiers:{[run.id]:2},scale,tr:MU.tr||0}))runtime.songHit(run.out,e,t,six);}
 Object.defineProperties(runtime,{journeyVictory:{get:()=>play},cancelJourneyVictory:{get:()=>cancel},victoryMusicStep:{get:()=>step},journeyVictoryState:{get:()=>()=>run?{id:run.id,drop:run.drop,end:run.end,played:run.played.size,chords:{...run.bars}}:null}});
}
