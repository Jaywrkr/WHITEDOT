const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
// Each family owns its gestures; the world owns tuning, scheduling and density.
export const FAMILIES={
 box:{name:'Caja de posibilidades',hint:'Abre la caja · edita pasos y mueve piezas',description:'Abre la caja para editar 16 pasos de Bajo, Groove o Motivo; toca la tapa para cerrarla. Toca una pieza para elegirla, arrástrala para cambiar su posición o mantenla para silenciarla.',role:'bass',shape:'box',
  tap(s){s.c=(s.c+1)%4;s.a=s.c===0?.15:.85;},drag(s,x,y){s.a=clamp(.5-y/140);s.b=clamp(.5+x/150);},
  influence(s){return {bass:(s.a-.5)*1.6,groove:(s.b-.5)*1.5,space:s.c===3?.5:0};},figure(s){return (Math.floor(s.b*5)+s.c)%8;},
  arrange(track,s){if(s.c===2||s.c===3)track.hook=track.hook.map((n,i)=>i%8===0?n:-1);if(s.b<.3)track.bass=track.bass.map((n,i)=>i%4===0?n:-1);return track;}},
 shadow:{name:'Escultura de sombra',hint:'Arrastra la luz · toca para cambiar el ángulo de proyección',role:'groove',shape:'shadow',
  tap(s){s.a=(s.a+.25)%1;},drag(s,x,y){s.a=clamp(.5+x/160);s.b=clamp(.5-y/150);},
  influence(s){return {groove:(s.a-.5)*1.5,space:(s.b-.5)*1.1};},figure(s){return Math.floor(s.a*7);},
  arrange(track,s){const phase=Math.floor(s.a*8),width=1+Math.floor(s.b*3);track.bass=track.bass.map((n,i)=>i===0||(i+phase)%8<width?n:-1);return track;}},
 flower:{name:'Flor de presión',hint:'Quédate para abrir pétalos · toca uno y arrastra su tensión',role:'space',shape:'flower',
  tap(s){s.a=(s.a+.26)%1;},drag(s,x,y){s.a=clamp(.5+x/150);s.b=clamp(.5-y/130);},
  influence(s){const channel=['bass','groove','melody','space'][Math.min(3,Math.floor(s.a*4))];return {[channel]:(s.b-.5)*1.8*(.25+s.charge*.75)};},figure(s){return (Math.floor(s.a*4)+Math.floor(s.b*4))%8;},
  arrange(track,s){const petal=Math.min(3,Math.floor(s.a*4));if(petal===2)track.hook=track.hook.map((n,i)=>n>=0&&i%4!==0?(n+Math.round(s.b*2))%7:n);if(petal===3&&s.b>.6)track.hook=track.hook.map((n,i)=>i%8===0?n:-1);return track;}},
 stream:{name:'Corriente reversible',hint:'Arrastra para invertir la corriente · toca para crear un remolino',role:'melody',shape:'stream',
  tap(s){s.c=s.c?0:1;s.a=s.a>.5?.2:.8;},drag(s,x,y){s.a=clamp(.5+x/140);s.b=clamp(.5-y/140);},
  influence(s){return {melody:(s.a-.5)*1.7,groove:(s.b-.5)*1.4};},figure(s){return (Math.floor(s.a*5)+s.c*2)%8;},
  arrange(track,s){if(s.a<.35)track.hook=[track.hook[0],...track.hook.slice(1).reverse()];if(s.c){const notes=track.hook.filter(n=>n>=0).slice(0,2);if(notes.length)track.hook=track.hook.map((n,i)=>i%4===2?notes[(i>>2)%notes.length]:n);}return track;}},
 animal:{name:'Animal de intercambio',hint:'Mantén para enseñar · toca para cambiar papel',description:'Mantén su cuerpo para iniciar dos compases de escucha. Toca objetos o pulsa en el vacío: el animal aprende el ritmo y el contorno de tu frase y responde por turnos. Arrastrarlo permite acercarlo a otro.',role:'groove',shape:'animal',
  tap(s){s.a=(s.a+.26)%1;s.c=1;},drag(s,x,y){s.dx=clamp(x,-100,100);s.dy=clamp(y,-100,100);s.b=clamp(.5+x/200);},
  tick(s,dt,near,context){if(!context)return;const o=context.object;o.homeX??=o.x;o.homeY??=o.y;o.x=o.homeX+(s.dx||0);o.y=o.homeY+(s.dy||0);const peers=context.runtime.encounterObjects||[];s.c=peers.some(p=>p!==o&&p.kind==='animal'&&Math.hypot(p.x-o.x,p.y-o.y)<210)?1:0;},
  voiceRole(s){return ['bass','groove','melody','space'][Math.min(3,Math.floor(s.a*4))];},
  influence(s){const channel=['bass','groove','melody','space'][Math.min(3,Math.floor(s.a*4))],out={[channel]:(s.b-.5)*1.6};out.space=(out.space||0)-s.c*.2;return out;},figure(s){return (Math.floor(s.a*4)*2+Math.floor(s.b*3))%8;}},
 peel:{name:'Piedra de capas',hint:'Toca para descubrir · arrastra hacia abajo para recubrir',role:'melody',shape:'peel',
  tap(s){s.a=(s.a+1/3)%1;},drag(s,x,y,speed=0){s.a=clamp(.5-y/120);s.b=clamp(.5+x/140);s.c=clamp(speed/500);},
  influence(s){return {melody:(s.a-.5)*1.8,space:(s.b-.5)*1.2};},figure(s){return (Math.floor(s.a*3)*2+Math.floor(s.c*2))%8;}},
 orbit:{name:'Semillas orbitales',hint:'Toca para tomar o soltar · arrastra para cambiar órbita y ritmo',role:'groove',shape:'orbit',
  tap(s){s.a=(s.a+.26)%1;s.c=s.c?0:1;},drag(s,x,y){s.a=clamp(.5+x/160);s.b=clamp(.5-y/140);},
  tick(s,dt,near){if(!near)s.c=0;},
  influence(s){return {groove:(s.b-.5)*1.6,bass:(s.a-.5)*1.1};},figure(s){return (Math.floor(s.a*4)+Math.floor(s.b*4))%8;}},
 well:{name:'Pozo de silencio',hint:'Toca para elegir la capa · arrastra para ampliar el silencio',role:'space',shape:'well',silent:true,
  tap(s){s.a=(s.a+1/3)%1;},drag(s,x,y){s.a=clamp(.5+x/160);s.b=clamp(.5-y/120);s.c=.65;},
  tick(s,dt,near,context){if(context)s.c=clamp(1-context.distance/(60+s.b*90));},
  influence(s){return {[['bass','groove','melody'][Math.min(2,Math.floor(s.a*3))]]:-s.c,space:s.b*.5};},figure(s){return Math.floor(s.a*7);}},
 weaver:{name:'Criatura tejedora',hint:'Une puntos · toca un hilo para retirar',description:'Une sus anclas y objetos cercanos mediante arrastre o dos toques. La red cambia su figura musical; tocar un hilo lo retira. Hasta seis hilos, sin realimentación sonora.',role:'groove',shape:'weaver',
  tap(s){s.a=(s.a+.34)%1;},drag(s,x,y){s.a=clamp(.5+x/140);s.b=clamp(.5-y/140);},
  tick(s,dt,near){if(near)s.c=(s.c+dt*.1)%1;},
  influence(s){return {groove:(s.a-.5)*1.7,space:(.5-s.b)*1.3};},figure(s){return (Math.floor(s.a*3)+Math.floor(s.b*5))%8;}},
 cloud:{name:'Nube amasable',hint:'Arrastra para comprimir o estirar · toca para soltar',role:'bass',shape:'cloud',
  tap(s){s.a=s.a>.5?.15:.85;},drag(s,x,y){s.a=clamp(.5-y/100);s.b=clamp(.5+x/140);},
  tick(s,dt,near){if(!near){s.a+=(.5-s.a)*dt*.12;s.b+=(.5-s.b)*dt*.12;}},
  influence(s){return {bass:(s.a-.5)*1.8,space:(s.b-.5)*1.2};},figure(s){return Math.round(s.b*7);}},
};
export function createFamilyState(){return {a:.5,b:.5,c:0,charge:0,phase:0,active:0,used:false};}
export function familyInfluence(kind,state){const values=FAMILIES[kind]?.influence(state)||{};return Object.fromEntries(Object.entries(values).filter(([,v])=>Number.isFinite(v)).map(([k,v])=>[k,clamp(v,-1,1)]));}
export function encounterVoice(kind,region,genres,seedOf){
 const [id,override]=kind.split(':'),g=genres[region.genre],index=seedOf(`encounter-voice:${region.key}:${id}`),channel=encounterRole(id,region,seedOf,override);
 const roles={bass:'bajo',groove:'perc',melody:'lead',space:'acorde'},pool=channel==='bass'?(g.bassP||[g.bassI]):channel==='groove'?(g.percP||['tom','conga','wood','rim']):g.hookP;
 return {role:roles[channel],instrument:pool[index%pool.length],degree:index%7,response:4,low:channel==='bass'?36:48,high:channel==='bass'?55:72};
}

export function familyArrange(kind,track,state){
 const f=FAMILIES[kind];if(!f?.arrange)return track;
 const out=f.arrange({...track,bass:[...track.bass],hook:[...track.hook],grammar:{...track.grammar}},state);
 for(const [part,limit]of [['bass',8],['hook',Math.min(6,out.grammar.hookLimit||5)]]){let n=0;out[part]=out[part].map(value=>value>=0&&++n>limit?-1:value);}
 return out;
}
export function encounterRole(kind,region,seedOf,override){
 if(['bass','groove','melody','space'].includes(override))return override;
 const base=FAMILIES[kind]?.role||'melody';if(kind==='cloud'||kind==='well'||kind==='animal')return base;
 const channels=['bass','groove','melody','space'],offset=seedOf(`encounter-role:${region.key}:${kind}`)%4;
 return channels[(channels.indexOf(base)+offset)%4];
}
export function regionalFamilyInfluence(kind,state,region,seedOf){
 const values=familyInfluence(kind,state);if(['cloud','well','animal','flower'].includes(kind))return values;
 const channels=['bass','groove','melody','space'],base=FAMILIES[kind].role,target=encounterRole(kind,region,seedOf),offset=(channels.indexOf(target)-channels.indexOf(base)+4)%4;
 return Object.fromEntries(Object.entries(values).map(([channel,value])=>[channels[(channels.indexOf(channel)+offset)%4],value]));
}
