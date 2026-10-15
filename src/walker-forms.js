import {interactionInstruments,expressiveBassInstruments} from './musical-character.js';
// Fifty original miniature silhouettes. Independent hashes preserve old map placement.
const BODIES=['Brote','Órbita','Nudo','Vela','Pulso'],HEADS=['lente','antena','semilla','doble luz','corona'];
export const WALKER_FORMS=Object.freeze(Array.from({length:50},(_,id)=>Object.freeze({id,body:Math.floor(id/10),head:Math.floor(id%10/2),gait:id%2,name:BODIES[Math.floor(id/10)]+' · '+HEADS[Math.floor(id%10/2)]+(id%2?' errante':' serena'),speed:.7+(id%5)*.12,patience:1+(id%4)*.18,following:16+(id%7)*2,spacing:36+(id%5)*6})));
export function walkerForm(source,region,seedOf){
 const [rx,ry]=region.key.split(',').map(Number),territory=Math.floor(rx/3)+','+Math.floor(ry/3),body=seedOf('walker:body:v1:'+territory+':'+(region.worldFamily?.id||'native'))%5;
 const h=seedOf('walker:individual:v1:'+territory+':'+(source.hx??source.x).toFixed(3)+','+(source.hy??source.y).toFixed(3));return WALKER_FORMS[body*10+h%10];
}
export function walkerGeometry(form,phase=0){
 const body=[[[0,-2],[3,1],[0,4],[-3,1]],[[0,-3],[3,-1],[3,2],[0,4],[-3,2],[-3,-1]],[[-3,-2],[3,-2],[2,3],[-2,3]],[[-2,-3],[3,0],[1,4],[-3,2]],[[-3,-1],[0,-3],[3,-1],[3,3],[-3,3]]][form.body];
 const heads=[[[0,-5],[2,-5]],[[0,-4],[0,-7]],[[0,-7],[2,-5],[0,-4],[-2,-5],[0,-7]],[[-2,-6],[-1,-5],[1,-6],[2,-5]],[[-3,-5],[-3,-7],[0,-5],[3,-7],[3,-5]]][form.head];
 const swing=Math.sin(phase)*(form.gait?1.6:.6),legs=form.gait?[[-2,4],[-3-swing,6],[2,4],[3+swing,6]]:[[-1,4],[-1+swing,6],[1,4],[1-swing,6]];
 return {body,heads,legs,arms:form.body%2?[[-3,0],[-5,2+swing],[3,0],[5,2-swing]]:[[-3,1],[-4,3-swing],[3,1],[4,3+swing]]};
}
export function drawWalker(c,form,x,y,time,reduced=false){const g=walkerGeometry(form,reduced?0:time/(form.gait?150:320));c.save();c.translate(x,y);c.lineWidth=1;c.beginPath();g.body.forEach(([a,b],i)=>i?c.lineTo(a,b):c.moveTo(a,b));c.closePath();c.stroke();for(const points of [g.heads,g.legs,g.arms]){c.beginPath();for(let i=0;i<points.length;i+=2){c.moveTo(...points[i]);if(points[i+1])c.lineTo(...points[i+1]);}c.stroke();}c.restore();}
export function walkerPortrait(form){const g=walkerGeometry(form);return '<path d="M'+g.body.map(p=>p.join(' ')).join('L')+'Z"/><path d="'+[g.heads,g.legs,g.arms].map(points=>points.map((p,i)=>(i%2?'L':'M')+p.join(' ')).join('')).join('')+'"/>';}

export function walkerVoice(source,region,genres,seedOf){const f=source.walkerForm||walkerForm(source,region,seedOf),shift=seedOf('walker:role:v1:'+region.key)%5,role=['lead','acorde','perc','bajo','lead'][(f.body+shift)%5],g=genres[region.genre],pool=role==='bajo'?expressiveBassInstruments(region.genre,g):role==='perc'?(g.percP||['tom','wood','conga','rim','shaker']):interactionInstruments(region.genre,g,role);return {role,instrument:pool[f.head%pool.length],degree:(f.head+(source.personality?.degree||0))%7,response:f.gait?3:6,low:role==='bajo'?36:45,high:role==='bajo'?52:69};}
export function moveWalker(k,f,player,dt,time){dt=Math.max(0,Math.min(.05,dt));if(!dt)return;const distance=Math.hypot(k.x-player.x,k.y-player.y)||1,phase=time/1000;
 if(k.follow>0){const angle=phase*(f.body===1?.55:.18)+(f.head*1.3),spacing=f.spacing,tx=player.x+Math.cos(angle)*spacing,ty=player.y+Math.sin(angle)*spacing,dx=tx-k.x,dy=ty-k.y,d=Math.hypot(dx,dy)||1;const move=Math.min(d,Math.min(145,d*1.8)*dt*f.speed*(k.personality?.speed||1)*(f.body===2?.7:1));k.x+=dx/d*move;k.y+=dy/d*move;return;}
 k.a+=Math.sin(phase/(f.gait?1.1:2.8)+k.hx)*dt*.6;
 if(f.body===0&&distance<180&&distance>70+f.head*5)k.a=Math.atan2(player.y-k.y,player.x-k.x);
 if(f.body===1)k.a=Math.atan2(k.hy-k.y,k.hx-k.x)+.9+f.head*.08;
 if(f.body===2&&distance<100+f.head*6)k.a=Math.atan2(k.y-player.y,k.x-player.x);
 if(Math.hypot(k.hx-k.x,k.hy-k.y)>380)k.a=Math.atan2(k.hy-k.y,k.hx-k.x);
 const rest=f.body===3&&Math.sin(phase*.6+f.head)>.2?0:f.body===4?(Math.sin(phase*3)>0?1.5:.25):1;
 const speed=22*f.speed*rest*(k.personality?.speed||1);k.x+=Math.cos(k.a)*speed*dt;k.y+=Math.sin(k.a)*speed*dt;
}
export function initialize(runtime){let owner=runtime.S,heard=new WeakMap();
 function record(form){const s=runtime.S;s.walkerForms=s.walkerForms&&typeof s.walkerForms==='object'&&!Array.isArray(s.walkerForms)?s.walkerForms:{};if(!Object.hasOwn(s.walkerForms,form.id)){s.walkerForms[form.id]={day:s.todayKey};runtime.save?.();}}
 function hear({degree,time,region}){if(!runtime.inWorld()||!runtime.S.sound||runtime.musicVolume?.()===0||runtime.ac?.state!=='running'||document.hidden||runtime.scanning||document.querySelector('.modal:not([hidden])'))return;if(owner!==runtime.S){owner=runtime.S;heard=new WeakMap();}const bar=Math.floor(time/(runtime.SIX*16));for(const k of (runtime.MU.walkerFollowers||[]).slice(0,2)){if(k.follow<=0||Math.hypot(k.x-runtime.S.wx,k.y-runtime.S.wy)>300||heard.get(k)===bar)continue;heard.set(k,bar);const voice=runtime.getVoice('caminante',region,k),index=((degree+2-runtime.MU.deg-voice.degree)%7+7)%7,at=time+runtime.SIX*voice.response;runtime.playVoice('caminante',index,at,region,false,.45,k,'ambient');runtime.walkerNoteCue?.({form:k.walkerForm?.id,role:voice.role,instrument:voice.instrument,at,index});}}
 Object.defineProperties(runtime,{walkerHear:{get:()=>hear},recordWalkerForm:{get:()=>record}});
}
