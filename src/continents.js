// Escala del mundo: continentes sonoros, mares de silencio y campo de vitalidad.
// Funciones puras y deterministas (misma semilla para todos). Unidades: regiones
// (una región = REG×WCH px). Se calculan bajo demanda y se guardan en caché.
import {FAMILIES,familyOf} from './rhythms.js';

export const CONTINENT_VERSION=1;
const CELL=10;                 // celda de semillas de continente, en regiones
const OCEAN_CELL=.2;           // celdas sin continente: océano abierto
const SEA_GAP=1.15;            // ancho de los mares entre continentes (en regiones ponderadas)
const SAFE_ORIGIN=2;           // alrededor del origen siempre hay tierra

// Hash entero rápido para ruido (no usa cadenas: se llama muchas veces por cuadro).
function hash2(x,y,salt){let h=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(salt|0,2147483647);h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296;}
const smooth=t=>t*t*(3-2*t);
export function valueNoise(x,y,salt){
 const ix=Math.floor(x),iy=Math.floor(y),fx=smooth(x-ix),fy=smooth(y-iy);
 const a=hash2(ix,iy,salt),b=hash2(ix+1,iy,salt),c=hash2(ix,iy+1,salt),d=hash2(ix+1,iy+1,salt);
 return (a*(1-fx)+b*fx)*(1-fy)+(c*(1-fx)+d*fx)*fy;
}

const SYL=['ka','lu','mi','sor','vel','tan','ri','zo','ne','dra','om','is','ur','fe','lia','qua','bel','no','ash','ti','mar','en','yo','sil','ro','ve','len','ai','dun','ma','ko','sa'];
const NOTE=['Do','Do♯','Re','Mi♭','Mi','Fa','Fa♯','Sol','La♭','La','Si♭','Si'];

export function createContinents(seedOf,rng,genres){
 const seeds=new Map(),regions=new Map();
 // Familias de géneros con su tempo central, para dar identidad a cada continente.
 const fams={};for(const [id,g]of Object.entries(genres)){const f=familyOf(id);(fams[f]||=[]).push((g.bpm[0]+g.bpm[1])/2);}
 const famList=Object.keys(fams).filter(f=>FAMILIES[f]);
 
 function seedOfCell(i,j){
  const k=i+','+j;if(seeds.has(k))return seeds.get(k);
  const r=rng(seedOf(`continent:v${CONTINENT_VERSION}:${k}`));let s=null;
  const home=i===0&&j===0;
  if(home||r()>=OCEAN_CELL){
   const u=r(),w=home?1.7:.5+1.7*u*u*u;     // pocos continentes gigantes, muchos medianos, islas pequeñas
   const px=home?.5:(i+.15+.7*r())*CELL,py=home?.5:(j+.15+.7*r())*CELL;
   const n=2+(r()<.5?1:0);let name='';let prev=-1;for(let q=0;q<n;q++){let x=Math.floor(r()*SYL.length);if(x===prev)x=(x+5)%SYL.length;prev=x;name+=SYL[x];}
   name=name[0].toUpperCase()+name.slice(1);
   // La familia se elige en proporción a cuántos estilos tiene, para no desequilibrar el reparto global.
   let pick=r()*famList.reduce((t,f)=>t+fams[f].length,0),family=famList[0];for(const f of famList){pick-=fams[f].length;if(pick<=0){family=f;break;}}
   if(home)family='house';
   const fifths=home?0:Math.floor(r()*7)-3,hue=Math.floor(r()*360),tempo=fams[family][Math.floor(r()*fams[family].length)]+(r()-.5)*6;   // tempo de un estilo de la familia: hay continentes lentos y rápidos
   const pitch=((fifths*7)%12+12)%12;
   s={id:k,cell:[i,j],x:px,y:py,w,name:home?'Tierra de Origen':name,family,familyName:FAMILIES[family],fifths,tonic:NOTE[pitch],hue,tempo,size:w<.8?'isla':w<1.5?'continente':'continente gigante'};
  }
  seeds.set(k,s);return s;
 }

 // Continente de una región (rx,ry). Devuelve el continente más cercano y si la región es mar.
 function at(rx,ry){
  const k=rx+','+ry;if(regions.has(k))return regions.get(k);
  // Deformación del dominio: fronteras curvas en vez de líneas rectas.
  const wx=rx+.5+(valueNoise(rx/6,ry/6,11)-.5)*5,wy=ry+.5+(valueNoise(rx/6,ry/6,23)-.5)*5;
  const ci=Math.floor(wx/CELL),cj=Math.floor(wy/CELL);let best=null,e1=1e9,e2=1e9;
  for(let i=ci-2;i<=ci+2;i++)for(let j=cj-2;j<=cj+2;j++){const s=seedOfCell(i,j);if(!s)continue;
   const e=Math.hypot(wx-s.x,wy-s.y)/s.w;if(e<e1){e2=e1;e1=e;best=s;}else if(e<e2)e2=e;}
  const near=Math.max(Math.abs(rx),Math.abs(ry))<=SAFE_ORIGIN;
  if(near)best=seedOfCell(0,0);
  const gap=e2-e1,open=e1>CELL*.62;
  const sea=!near&&(!best||open||gap<SEA_GAP);
  const coast=sea?0:Math.min(1,(gap-SEA_GAP)/2.5);   // 0 en la costa, 1 tierra adentro
  const out={continent:best,sea,coast,depth:sea?Math.min(1,Math.max(open?(e1-CELL*.62)/3:0,(SEA_GAP-gap)/SEA_GAP)):0};
  regions.set(k,out);return out;
 }

 // Vitalidad continua en px del mundo: 0 = desierto largo, 1 = oasis lleno.
 // Contraste fuerte a propósito: el vacío es la subida, lo lleno es el drop.
 function vitality(x,y,regionPx){
  const u=x/regionPx,v=y/regionPx;
  const n=.72*valueNoise(u/3.2,v/3.2,41)+.28*valueNoise(u/1.1,v/1.1,57);
  let vit=smooth(Math.min(1,Math.max(0,(n-.34)/.36)));
  const c=at(Math.floor(u),Math.floor(v));
  if(c.sea)vit*=.08;else vit*=.55+.45*Math.min(1,c.coast*2.5);
  if(Math.hypot(u-.5,v-.5)<1.6)vit=Math.max(vit,.55);       // el Origen nunca es un desierto
  return vit;
 }
 // Multiplicador de densidad para la generación de un chunk.
 const densityOf=vit=>.1+2.6*Math.pow(vit,1.35);

 return {at,vitality,densityOf,seedOfCell,clear(){seeds.clear();regions.clear();}};
}
