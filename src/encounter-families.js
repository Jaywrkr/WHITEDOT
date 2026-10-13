const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
// Each family owns its gestures; the world owns tuning, scheduling and density.
export const FAMILIES={
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
 weaver:{name:'Criatura tejedora',hint:'Toca para retirar un hilo · arrastra para cambiar sus uniones',role:'groove',shape:'weaver',
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
 const family=FAMILIES[kind],g=genres[region.genre],index=seedOf(`encounter-voice:${region.key}:${kind}`),channel=family?.role||'melody';
 const roles={bass:'bajo',groove:'perc',melody:'lead',space:'acorde'},pool=channel==='bass'?(g.bassP||[g.bassI]):channel==='groove'?['tom','conga','wood','rim']:g.hookP;
 return {role:roles[channel],instrument:pool[index%pool.length],degree:index%7,response:4,low:channel==='bass'?36:48,high:channel==='bass'?55:72};
}
