// Rasgos estables por objeto: no consume el RNG del mapa ni cambia los IDs.
export function personalityOf(id,seedOf,rng) {
  const r=rng(seedOf(`personality:v1:${id}`)),style=Math.floor(r()*3);
  return Object.freeze({name:['Sereno','Vivaz','Elástico'][style],
    speed:[.6,1,.8][style]+r()*.4,mass:[1.1,.65,.8][style]+r()*.4,drag:[1.1,.8,.9][style]+r()*.3,home:[.5,.75,.45][style]+r()*.3,
    cooldown:[1200,650,900][style]+r()*500,period:[1600,750,1100][style]+r()*600,sway:[.06,.15,.12][style]+r()*.1,
    recovery:.65+r()*1.15,jump:12+r()*24,spin:4+r()*8,
    degree:Math.floor(r()*7),volume:.7+r()*.25,stamina:12+r()*18});
}
export function attachPersonalities(chunk,seedOf,rng) {
  for(const field of ['grass','plants','props','lotus','crystals','pillars','sp','flies','walkers','playthings'])
    (chunk[field]||[]).forEach((object,index)=>{object.personality=personalityOf(`${chunk.id}:${field}:${index}`,seedOf,rng);});
}
