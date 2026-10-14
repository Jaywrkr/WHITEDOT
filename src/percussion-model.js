// An additive stream: existing terrain, flora, genres and favourite coordinates never move.
export const RHYTHM_ELEMENTS=Object.freeze({
 stone:{name:'Piedra de bombo',material:'metal',voices:['kick','tom'],gesture:'hold',hint:'Pasa para golpear; permanece para sostener el pulso grave.'},
 hollow:{name:'Tronco hueco',material:'wood',voices:['conga','tom'],gesture:'hold',hint:'Entra para golpear; quédate para una respuesta sincopada.'},
 roots:{name:'Raíces de clave',material:'wood',voices:['wood','rim'],gesture:'cross',hint:'Cruza las raíces; cada entrada añade un acento seco.'},
 reeds:{name:'Juncos de raspado',material:'wood',voices:['guiro','wood'],gesture:'brush',hint:'Muévete entre los juncos para raspar al tempo.'},
 pods:{name:'Vainas de ritmo',material:'wood',voices:['shaker','wood'],gesture:'brush',hint:'Sacúdelas al pasar; el movimiento activa su textura.'},
 shell:{name:'Concha de timbal',material:'metal',voices:['timbale','rim'],gesture:'orbit',hint:'Rodea la concha para acentuar el ritmo.'},
 dust:{name:'Polvo de palmas',material:'air',voices:['clap','shaker'],gesture:'cross',hint:'Atraviesa los puntos: se reúnen en un golpe suave.'},
 fossil:{name:'Fósil de ritmo',material:'wood',voices:['wood','tom'],gesture:'hold',hint:'Toca el fósil; permanece para despertar su ritmo lento y cambiante.'},
 pool:{name:'Charco de toms',material:'glass',voices:['tom','conga'],gesture:'hold',hint:'Entra para un golpe redondo; permanece para una frase grave.'}
});
export const RHYTHM_KINDS=Object.keys(RHYTHM_ELEMENTS).filter(k=>k!=='fossil');
const calm=g=>['ambient','heart','downtempo','dub','dubtechno','berlinschool'].includes(g);
export function rhythmVoice(kind,region,seedOf){
 const [,family,variant='0']=kind.split(':'),spec=RHYTHM_ELEMENTS[family];if(!spec)return null;
 const n=seedOf(`rhythm:voice:v1:${region.key}:${region.genre}:${family}:${variant}`);
 let instrument=spec.voices[n%spec.voices.length];
 if(calm(region.genre)&&['shaker','clap','timbale'].includes(instrument))instrument=family==='shell'?'rim':'wood';
 return {role:'perc',instrument,degree:n%4,response:6,low:36,high:60};
}
export function rhythmPattern(kind,genre,variant=0){
 if(calm(genre))return variant%2?[4,12]:[0,10];
 if(kind==='fossil')return variant%2?[0,12]:[4,14];
 if(kind==='stone')return ['breaks','garage','dnb','liquid','dubstep','idm'].includes(genre)?[0,6]:[0,8];
 if(kind==='hollow'||kind==='pool')return variant%2?[3,11]:[6,14];
 return variant%2?[2,10]:[4,12];
}
export function createRhythmElements(cx,cy,size,region,seedOf,rng){
 if(region.sea)return [];
 const random=rng(seedOf(`rhythm:placement:v1:${cx},${cy}`));
 if(random()<.3){
  if(seedOf(`rhythm:fossil:v1:${cx},${cy}`)%192!==0)return [];
  const rare=rng(seedOf(`rhythm:fossil-position:v1:${cx},${cy}`));
  return [{id:`rhythm:fossil:v1:${cx},${cy}`,kind:'fossil',x:(cx+.25+rare()*.5)*size,y:(cy+.25+rare()*.5)*size,variant:Math.floor(rare()*8),phase:rare()*6.283,touching:false,lit:0,cooldown:0,turn:0}];
 }
 const count=1+Math.floor(random()*3),x=(cx+.18+random()*.64)*size,y=(cy+.18+random()*.64)*size;
 return Array.from({length:count},(_,i)=>{
  const kind=RHYTHM_KINDS[Math.floor(random()*RHYTHM_KINDS.length)],a=random()*Math.PI*2,rad=i?45+random()*50:0;
  return {id:`rhythm:v1:${cx},${cy}:${i}`,kind,x:x+Math.cos(a)*rad,y:y+Math.sin(a)*rad,variant:Math.floor(random()*8),phase:random()*6.283,touching:false,lit:0,cooldown:0,turn:0};
 });
}
