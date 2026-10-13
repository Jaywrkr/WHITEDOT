// Output protection stays linear until the last few dB of headroom.
// Saturation is an intentional player effect, not the normal sound of every note.
export function peakGuardCurve(size=8193) {
 const curve=new Float32Array(size);
 for(let i=0;i<size;i++){
  const x=i/(size-1)*2-1,a=Math.abs(x);
  curve[i]=Math.sign(x)*(a<=.9?a:.9+.05*Math.tanh((a-.9)/.05));
 }
 return curve;
}

export function returnFilters(ac,low=150,high=7500) {
 const hp=ac.createBiquadFilter(),lp=ac.createBiquadFilter();
 hp.type='highpass';hp.frequency.value=low;hp.Q.value=Math.SQRT1_2;
 lp.type='lowpass';lp.frequency.value=high;lp.Q.value=Math.SQRT1_2;
 hp.connect(lp);
 return {input:hp,output:lp};
}
