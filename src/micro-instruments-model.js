// Original electronic families. Placement has its own stream; old maps never move.
const family=(name,role,instrument,hint,path)=>Object.freeze({name,role,instrument,hint,path});
export const MICRO_INSTRUMENTS=Object.freeze({
 drum:family('Nido de pulsos','perc','kick','Cruza cada semilla para cambiar el golpe.','M-15 3Q-15 -9 -6 -9Q3 -9 3 3Q3 15 -6 15Q-15 15 -15 3M6 -8Q6 -16 13 -16Q20 -16 20 -8Q20 0 13 0Q6 0 6 -8M7 11h12'),
 acid:family('Raíz ácida','bajo','mi_acid','Rodea la raíz para abrir su filtro.','M-18 10Q-6 10 -8 -3T5 -12Q18 -12 18 -3M-8 -3Q-20 -18 -13 -21M-8 -3Q-2 9 6 15'),
 analog:family('Semilla sub','bajo','mi_analog','Acércate despacio para darle cuerpo al bajo.','M0 -19C-20 -9 -18 15 0 19C18 15 20 -9 0 -19M-8 3Q0 10 8 3'),
 poly:family('Corola eléctrica','acorde','mi_poly','Quédate junto a la corola para abrir sus acordes.','M0 0Q-24 -27 -18 -2Q-21 20 0 0Q24 -27 18 -2Q21 20 0 0M0 0Q-12 -27 0 -23Q12 -27 0 0'),
 fm:family('Gotas FM','lead','mi_fm','Cruza las gotas para escuchar una respuesta cálida.','M-13 -14Q-29 7 -13 9Q3 7 -13 -14M11 -5Q-5 16 11 18Q27 16 11 -5'),
 wave:family('Lámina de ondas','lead','wavetable','Muévete a su lado para entrelazar las ondas.','M-23 -8Q-12 -24 0 -8T23 -8M-23 0Q-12 -16 0 0T23 0M-23 8Q-12 -8 0 8T23 8'),
 grain:family('Nube de granos','acorde','graincloud','Permanece cerca: sus granos sostienen la armonía.','M-22 -4Q-25 -19 -10 -15Q2 -29 13 -13Q29 -13 23 4M-16 7h2M-6 16h2M4 7h2M14 16h2'),
 slice:family('Semillas cortadas','perc','mi_slice','Cruza y vuelve: cada entrada recorta otra textura.','M-19 -10Q-10 -18 -7 -7Q-9 4 -19 -10M1 -6Q10 -14 13 -3Q11 8 1 -6M-9 12Q0 4 3 15Q1 26 -9 12'),
 ring:family('Anillo modulador','lead','mi_ring','Rodéalo para cambiar la modulación sin desafinar.','M18 0A18 18 0 1 1 -18 0A18 18 0 1 1 18 0M-24 7Q0 -17 24 7M-3 -3h6v6h-6Z'),
 arp:family('Enredadera secuenciada','lead','resonantpluck','Quédate dentro para recorrer tres notas del acorde.','M-16 18Q-18 0 -3 -2Q13 -4 12 -20M-11 8Q-25 0 -18 -5M1 -4Q12 7 19 1M9 -14Q-4 -22 0 -26')
});
export const MICRO_IDS=Object.freeze(Object.keys(MICRO_INSTRUMENTS));
export const microPath=id=>MICRO_INSTRUMENTS[id]?.path||MICRO_INSTRUMENTS.analog.path;
const calm=new Set(['ambient','heart','downtempo','dub','dubtechno']);
const machine=new Set(['minimal','minimaltechno','acid','robotic','electro','ebm','detroitelectro','berlin']);
const dance=new Set(['nudisco','cosmic','boogie','electrofunk','chicago','tropical','afro','tribal']);
export function microTerritory(region,seedOf){
 const h=seedOf('micro:habitat:v1:'+region.key)>>>0,pool=calm.has(region.genre)?['poly','fm','analog','wave']:machine.has(region.genre)?['acid','drum','arp','ring']:dance.has(region.genre)?['drum','analog','poly','fm']:['fm','wave','slice','arp','poly','analog'];
 return Object.freeze({primary:pool[h%pool.length],secondary:pool[(h%pool.length+1+(h>>>8)%(pool.length-1))%pool.length],grove:(h>>>16)%6===0,seed:h});
}
export function microChunk(cx,cy,size,region,seedOf,rng){
 if(region.sea||region.anomaly)return [];
 const habitat=microTerritory(region,seedOf),random=rng(seedOf(`micro:placement:v1:${cx},${cy}`));
 if(random()>(habitat.grove?.58:.26))return [];
 const count=habitat.grove?2+Math.floor(random()*2):1,anchor={x:(cx+.2+random()*.6)*size,y:(cy+.2+random()*.6)*size};
 return Array.from({length:count},(_,i)=>{const pick=random(),kind=pick<.68?habitat.primary:pick<.94?habitat.secondary:random()<.5?'grain':'ring',angle=i/count*Math.PI*2,offset=i?48:0;
  return {id:`micro:v1:${cx},${cy}:${i}`,kind,x:anchor.x+Math.cos(angle)*offset,y:anchor.y+Math.sin(angle)*offset,variant:Math.floor(random()*64),phase:random()*6.283,parameter:.35,charge:0,lit:0,touching:false,turn:0,entry:0};});
}
export function microVoice(kind,source=null){
 const id=kind.split(':')[1],spec=MICRO_INSTRUMENTS[id];if(!spec)return null;
 const variant=source?.variant||0,drums=['kick','snare','clap','hat','tom'],instrument=id==='drum'?drums[((source?.entry||0)+variant)%drums.length]:spec.instrument;
 return {role:spec.role,instrument,degree:id==='arp'?0:variant%3*2,response:4,low:spec.role==='bajo'?33:45,high:spec.role==='bajo'?55:69,volume:id==='grain'?.65:1};
}
export function microArticulation(source){const amount=Math.max(0,Math.min(1,Number.isFinite(source?.parameter)?source.parameter:.35));return {pressure:amount,morph:amount,toneScale:.65+amount*.8,decayScale:source?.kind==='slice'?.35:1};}
export function microKit(region,seedOf){const h=seedOf('micro:kit:v1:'+region.key)>>>0;return {seed:h,kick:39+h%16,body:125+(h>>>5)%95,snap:1600+(h>>>12)%1600,tail:.08+(h>>>18)%7*.015,metal:machine.has(region.genre),dark:calm.has(region.genre)};}
export function microPattern(kind,variant=0){return kind==='arp'?[0,4,8]:kind==='drum'||kind==='slice'?(variant%2?[0,6,12]:[0,8]):[0];}
