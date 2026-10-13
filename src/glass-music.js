import {voiceRegister} from './musical-character.js';
const CHANNELS=['bass','groove','melody'];
export function glassChannel(region,pane,seedOf){return CHANNELS[(pane+seedOf(`glass-role:${region.key}`)%3)%3];}
export function glassVoice(region,pane,genres,seedOf){
 const channel=glassChannel(region,pane,seedOf),g=genres[region.genre],role=channel==='bass'?'bajo':channel==='groove'?'perc':seedOf(`glass-harmony:${region.key}`)%2?'acorde':'lead';
 const pool=channel==='bass'?(g.bassP||[g.bassI]):channel==='groove'?(g.percP||['tom','wood','rim']):g.hookP;
 return voiceRegister({role,instrument:pool[seedOf(`glass-tone:${region.key}:${pane}`)%pool.length],degree:0,response:4,low:channel==='bass'?36:48,high:channel==='bass'?55:67},region.genre);
}
export function glassShape(angles,pane,region,seedOf){
 const a=angles.map(x=>((x%(Math.PI*2))+Math.PI*2)%(Math.PI*2));
 const alignment=(3+Math.cos(a[0]-a[1])+Math.cos(a[1]-a[2])+Math.cos(a[2]-a[0]))/6;
 return {channel:glassChannel(region,pane,seedOf),degree:[0,2,4][Math.floor(a[pane]/(Math.PI*2)*3)],amount:.3+alignment*.3,variant:(Math.floor(a[pane]/(Math.PI*2)*8)+Math.floor(a[(pane+1)%3]/(Math.PI*2)*8))%8};
}

export function glassColor(hue,angle,pane){
 const normalized=((angle%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
 return ((hue+pane*120+Math.sin(normalized)*30)%360+360)%360;
}
