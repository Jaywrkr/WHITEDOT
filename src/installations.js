// Share the extra ambient budget between all installations, even on region borders.
const clocks=new WeakMap();
export function claimInstallationBar(runtime,bar){
 const last=clocks.get(runtime);
 if(last?.state===runtime.S&&last.bar===bar)return false;
 clocks.set(runtime,{state:runtime.S,bar});return true;
}
