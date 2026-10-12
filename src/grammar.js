const LEAN=['minimal','rominimal','microhouse','minimaltechno','dub','heart','robotic','techhouse','melodictechno','berlin','ebm'];
const CALM=['ambient','heart','downtempo'];
const PROGRESSIONS=[[0,5,3,4],[0,3,5,4],[0,4,3,5],[0,0,3,0]];
const RHYTHMS=[[0,3,6,10,12],[2,6,10,14],[3,7,11,15],[0,5,10],[1,6,9,14]];
export function createGrammar(region,seedOf,rng) {
 const r=rng(seedOf(`grammar:v1:${region.key}:${region.genre}`));
 const lean=LEAN.includes(region.genre),calm=CALM.includes(region.genre);
 const rotation=Math.floor(r()*8),cell=RHYTHMS[Math.floor(r()*RHYTHMS.length)];
 const accents=cell.map(step=>(step+rotation)%16).sort((a,b)=>a-b);
 const progression=PROGRESSIONS[Math.floor(r()*PROGRESSIONS.length)].slice();
 const brightness=6000+r()*4500,accentInstrument=['wood','rim','shaker'][Math.floor(r()*3)];
 return {version:1,key:region.key,accents,accentInstrument,accentLevel:calm?0:.012+r()*.009,
  progression,harmonyBars:lean?16:calm?12:8,motifRotation:2*Math.floor(r()*4),hookLimit:lean?3:4+Math.floor(r()*2),
  phraseBars:4+Math.floor(r()*3)*2,hookLevel:.75+r()*.2,bassLevel:.8+r()*.15,brightness,
  character:`${brightness<7500?'Cálido':brightness>9500?'Aéreo':'Equilibrado'} · ${accentInstrument==='wood'?'madera':accentInstrument==='rim'?'acentos secos':'textura rítmica'}`};
}
export function shapeMotif(recipe,grammar) {
 const shifted=Array(16).fill(-1);let anchor=recipe.findIndex((n,i)=>n>=0&&i%4===0);if(anchor<0)anchor=0;
 shifted[anchor]=0;
 recipe.forEach((n,i)=>{if(n>=0&&i!==anchor){let step=(i+grammar.motifRotation)%16;if(step===anchor)step=(step+2)%16;shifted[step]=n;}});
 return shifted;
}
export function harmonicDegree(grammar,bar) {return grammar.progression[Math.floor(bar/grammar.harmonyBars)%grammar.progression.length];}
export function createVoiceCurator() {
 const buckets=new Map();
 return {
  gain(time,six,role,soft=false){
   const key=Math.round(time/six);let counts=buckets.get(key);if(!counts){counts={total:0,bass:0};buckets.set(key,counts);}
   const density=1/Math.sqrt(1+counts.total*.3),bass=role==='bajo'?1/(1+counts.bass*.8):1;
   counts.total++;if(role==='bajo')counts.bass++;
   while(buckets.size>128)buckets.delete(buckets.keys().next().value);
   return density*bass*(role==='agudo'?(soft?.55:.8):1);
  },
  clear(){buckets.clear();}
 };
}
