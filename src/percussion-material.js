// Original compact physical-material strikes; no recordings, bright jingles or loops.
export const STRIKE_BODIES=Object.freeze({
 stone:{frequency:59,ratio:1.58,decay:.32,fall:1.8,noise:0},
 hollow:{frequency:118,ratio:2.23,decay:.23,fall:1.16,noise:.12},
 roots:{frequency:410,ratio:1.43,decay:.075,fall:1,noise:.25},
 reeds:{frequency:700,ratio:1.7,decay:.16,fall:1,noise:.9},
 pods:{frequency:480,ratio:1.7,decay:.11,fall:1,noise:1},
 shell:{frequency:220,ratio:2.76,decay:.3,fall:1.02,noise:.06},
 dust:{frequency:630,ratio:1.4,decay:.15,fall:1,noise:1},
 fossil:{frequency:96,ratio:1.7,decay:.27,fall:1.07,noise:.1},
 pool:{frequency:145,ratio:1.52,decay:.24,fall:2.05,noise:.08}
});
export function strikeProfile(kind,variant=0){const spec=STRIKE_BODIES[kind];if(!spec)return null;const v=((Math.trunc(variant)||0)%8+8)%8;
 return {...spec,frequency:spec.frequency*(.88+v*.035),decay:spec.decay*(.85+v*.04)};}
export function playMaterialStrike(runtime,kind,variant,time,volume){
 const p=strikeProfile(kind,variant),ac=runtime.ac;if(!p||!ac?.createOscillator)return false;
 const nodes=[],oscillators=[],strength=Math.max(0,Math.min(.1,volume)),end=time+p.decay+.04;
 for(let i=0;i<2;i++){const o=ac.createOscillator(),g=ac.createGain(),frequency=p.frequency*(i?p.ratio:1);o.type='sine';o.frequency.setValueAtTime(frequency*p.fall,time);o.frequency.exponentialRampToValueAtTime(frequency,time+.045);
  g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(strength*(i?.22:1)*(1-p.noise*.5),time+.003);g.gain.exponentialRampToValueAtTime(.00001,time+p.decay);
  o.connect(g).connect(runtime.bus);nodes.push(o,g);oscillators.push(o);o.start(time);o.stop(end);}
 // Noise routes through exactly the same source patch, spatial path and foreground stage.
 if(p.noise)runtime.noiseHit?.(time,'bandpass',p.frequency*2,kind==='reeds'?3:.8,strength*p.noise,p.decay,false);
 oscillators[0].onended=()=>nodes.forEach(n=>n.disconnect());
 runtime.materialStrikeCue?.({kind,variant,time,frequency:p.frequency,decay:p.decay});return true;
}
