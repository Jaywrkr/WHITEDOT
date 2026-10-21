// Bought pulse looks. Drawing only: a wave wearing one of these keeps the reach of the original pulse.
const TAU=Math.PI*2;
export const SHOP_PULSES=Object.freeze(['pulse:square','pulse:star','pulse:double','pulse:spiral','pulse:bolt','pulse:echo','pulse:charged']);
// An eighth note at the wave's speed (420 px/s, 120 bpm): how far behind the echoes travel.
export const ECHO_GAP=105;
function ring(c,r){c.beginPath();c.arc(0,0,Math.max(0,r),0,TAU);c.stroke();}
function shape(c,id,r,turn){
 if(id==='pulse:square'){const h=r*.88;c.strokeRect(-h,-h,h*2,h*2);return;}
 if(id==='pulse:star'){c.beginPath();for(let i=0;i<=10;i++){const a=-Math.PI/2+i*TAU/10,k=i%2?r*.48:r;i?c.lineTo(Math.cos(a)*k,Math.sin(a)*k):c.moveTo(Math.cos(a)*k,Math.sin(a)*k);}c.stroke();return;}
 if(id==='pulse:double'){ring(c,r);ring(c,r*.9);return;}
 if(id==='pulse:spiral'){for(let i=0;i<6;i++){const a=turn+i*TAU/6;c.beginPath();c.arc(0,0,r,a,a+TAU/10);c.stroke();}return;}
 if(id==='pulse:bolt'){c.beginPath();for(let i=0;i<=28;i++){const a=i*TAU/28,k=i%2?r*.86:r;i?c.lineTo(Math.cos(a)*k,Math.sin(a)*k):c.moveTo(Math.cos(a)*k,Math.sin(a)*k);}c.stroke();return;}
 ring(c,r);
}
// One wave: x,y on screen, r its radius now; charge (0..1) only makes it brighter and thicker.
export function drawShopPulse(c,id,x,y,r,{alpha=.6,color='#fff',charge=0,reduced=false,gap=ECHO_GAP}={}){
 c.save();c.translate(x,y);c.strokeStyle=color;c.globalAlpha=alpha;c.lineWidth=1.5;const turn=reduced?0:r/40;
 if(id==='pulse:charged'){c.lineWidth=1.5+charge*2.5;c.globalAlpha=Math.min(1,alpha*(1+charge*.8));ring(c,r);if(charge>.2){c.fillStyle='#fff';const n=Math.round(4+charge*8);for(let i=0;i<n;i++){const a=i*TAU/n+turn;c.fillRect(Math.round(Math.cos(a)*r)-1,Math.round(Math.sin(a)*r)-1,2,2);}}}
 else if(id==='pulse:echo'){ring(c,r);for(let k=1;k<=2;k++){if(r-gap*k<=2)break;c.globalAlpha=alpha*(.55/k);ring(c,r-gap*k);}}
 else shape(c,id,r,turn);
 c.restore();
}
