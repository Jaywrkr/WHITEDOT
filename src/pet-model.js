export const PET_BOX_DENOMINATOR=128;
// Persistent companionship. No offline decay, feeding, payment or species menu.
export const PET_SPECIES={
 golondrina:{name:'Meteoro de eco',role:'melody',pool:['reed','kalimba','flute'],hue:30},
 grulla:{name:'Planeta grave',role:'bass',pool:['sub','hollow','bowed'],hue:200},
 luciernaga:{name:'Estrella de pulso',role:'groove',pool:['wood','conga','rim'],hue:70}
};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function normalizePet(raw){
 if(!raw||!Object.hasOwn(PET_SPECIES,raw.species)||!Number.isInteger(raw.seed))return null;
 const finite=(n,max)=>Number.isFinite(n)?clamp(n,0,max):0;
 const places=Array.isArray(raw.places)?[...new Set(raw.places.filter(p=>typeof p==='string'&&/^(-?\d+),(-?\d+)$/.test(p)))].slice(-128):[];
 const phrase=Array.isArray(raw.phrase)?raw.phrase.filter(n=>n&&Number.isInteger(n.degree)&&n.degree>=0&&n.degree<7&&Number.isInteger(n.step)&&n.step>=0&&n.step<16).slice(-8).map(n=>({degree:n.degree,step:n.step})):[];
 return {version:1,species:raw.species,seed:raw.seed>>>0,seconds:finite(raw.seconds,1e8),places,phrase};
}
export function createPet(species,seed,phrase=[]){return normalizePet({species,seed,seconds:0,places:[],phrase:phrase.length?phrase:[{degree:0,step:0},{degree:2,step:4},{degree:4,step:8}]});}
export function petStage(p){if(!p)return 0;return p.seconds>=5400&&p.places.length>=20?3:p.seconds>=1800&&p.places.length>=8?2:p.seconds>=600&&p.places.length>=3?1:0;}
export const petCapacity=p=>4+petStage(p);
export function learnPet(p,degree){if(!p||!Number.isFinite(degree))return;degree=((Math.round(degree)%7)+7)%7;const last=p.phrase.at(-1);if(last?.degree===degree)return;p.phrase.push({degree,step:0});p.phrase=p.phrase.slice(-petCapacity(p)).map((n,i)=>({degree:n.degree,step:i*2}));}
export function growPet(p,dt,key){if(!p)return;dt=Number.isFinite(dt)?clamp(dt,0,.1):0;p.seconds=Math.min(1e8,p.seconds+dt);if(/^(-?\d+),(-?\d+)$/.test(key)&&!p.places.includes(key)){p.places.push(key);if(p.places.length>128)p.places.shift();}}
export function petFromBox(id,seedOf){if(!/^caja:/.test(id))return null;const seed=seedOf(`pet:box:v1:${id}`);return seed%PET_BOX_DENOMINATOR===0?Object.keys(PET_SPECIES)[(seed>>>8)%3]:null;}
export function petFormationEligible(f){return ['golondrina','grulla'].includes(f.species)&&f.trust>=.6&&f.follow>0&&f.followTime>=30;}
