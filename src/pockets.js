// Tres espacios por chunk, con semilla propia y sin modificar terreno ni criaturas.
export function createPockets(cx,cy,size,seedOf,rng) {
  const r=rng(seedOf(`pockets:v1:${cx},${cy}`));
  const positions=[[.28,.28],[.72,.28],[.28,.72],[.72,.72]];
  for(let i=positions.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[positions[i],positions[j]]=[positions[j],positions[i]];}
  return ['quiet','ensemble','discovery'].map((kind,i)=>({kind,x:cx*size+(positions[i][0]+(r()-.5)*.05)*size,y:cy*size+(positions[i][1]+(r()-.5)*.05)*size,radius:kind==='quiet'?130+r()*40:110+r()*35}));
}
export const POCKET_NAMES={quiet:'Claro de escucha',ensemble:'Espacio de ensamble',discovery:'Rincón de descubrimiento'};
export function pocketAt(pockets,x,y) {return pockets.find(p=>Math.hypot(x-p.x,y-p.y)<=p.radius)||null;}
export function distributePlaythings(objects,pockets,seedOf,rng) {
  if(!objects.length)return;
  const r=rng(seedOf(`pocket-layout:v1:${objects[0].id}`));
  const ensemble=pockets.find(p=>p.kind==='ensemble'),discovery=pockets.find(p=>p.kind==='discovery');
  objects.forEach((o,i)=>{
    const pocket=i<Math.max(1,Math.min(objects.length-1,Math.ceil(objects.length*.7)))?ensemble:discovery;
    const a=r()*Math.PI*2,d=25+Math.sqrt(r())*(pocket.radius-45);
    o.x=o.hx=pocket.x+Math.cos(a)*d;o.y=o.hy=pocket.y+Math.sin(a)*d;
  });
}
export function initialize(runtime) {
  function currentPocket() {
    if(!runtime.inWorld())return null;
    const chunk=runtime.wchunks.get(`${Math.floor(runtime.S.wx/runtime.WCH)},${Math.floor(runtime.S.wy/runtime.WCH)}`);
    return chunk?pocketAt(chunk.pockets||[],runtime.S.wx,runtime.S.wy):null;
  }
  function drawPocketHints(chunk,ox,oy,radius) {
    const ctx=runtime.cx;
    ctx.save();ctx.strokeStyle=chunk.pal.soft;ctx.fillStyle=chunk.pal.soft;ctx.lineWidth=1;
    for(const p of chunk.pockets||[]) {
      const distance=Math.hypot(p.x-runtime.S.wx,p.y-runtime.S.wy);
      if(distance>radius+p.radius)continue;
      ctx.globalAlpha=.16*Math.max(0,1-distance/(radius+p.radius));
      if(p.kind==='quiet'){ctx.beginPath();ctx.arc(p.x+ox,p.y+oy,p.radius*.65,0,Math.PI*2);ctx.stroke();}
      else for(let i=0;i<3;i++){const a=i*Math.PI*2/3;ctx.fillRect(p.x+ox+Math.cos(a)*12,p.y+oy+Math.sin(a)*12,2,2);}
    }
    ctx.restore();
  }
  Object.defineProperties(runtime,{currentPocket:{get:()=>currentPocket},drawPocketHints:{get:()=>drawPocketHints}});
}
