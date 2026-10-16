// Presentation grammar only; original species bits, IDs and placement stay intact.
export const NATIVE_STYLES=Object.freeze({terraces:'pixel',tidal:'membrane',orbital:'membrane',marsh:'membrane',prism:'facets',dunes:'filament',vault:'filament',grove:'anatomy'});
export function nativeVisualFamily(region,seedOf){return NATIVE_STYLES[region.worldFamily?.id]||'anatomy';}
export function nativeVisualDescriptor(species,region,seedOf){
 const h=seedOf('visual:native-lineage:v1:'+species.id)>>>0,
  style=species.mob&&(seedOf('visual:pixel-cohort:v1:'+species.id)>>>0)%100<48?'pixel':nativeVisualFamily(region,seedOf);
 return {style,shape:style==='filament'?(species.mob?['worm','manta','jelly'][h%3]:['reeds','vine','network'][h%3]):null,
  width:style==='filament'?.65:1,height:style==='filament'?1.15:1,scale:style==='facets'?.8:1,phase:(h%628)/100};
}
export function facetPoints(bits,phase=0){const sides=3+(bits>>>3)%4,radius=.7+(bits%5)*.045;return Array.from({length:sides},(_,i)=>{const a=i*Math.PI*2/sides+(bits%7)*.15+Math.sin(phase)*.035;const edge=radius*(.84+((bits>>(i%15))&1)*.16);return [Math.cos(a)*edge,Math.sin(a)*edge];});}
export function pixelCells(bits){const out=[];for(let row=0;row<5;row++)for(let k=0;k<3;k++)if(bits>>(row*3+k)&1){out.push([k-2,row-2.5]);if(k<2)out.push([2-k,row-2.5]);}return out;}
// Find a real visible exemplar rather than fabricating a laboratory creature.
export function nativePractice(runtime,style,maxRing=12){
 const size=runtime.REG*runtime.WCH;
 for(let ring=0;ring<=maxRing;ring++)for(let x=-ring;x<=ring;x++)for(let y=-ring;y<=ring;y++){
  if(Math.max(Math.abs(x),Math.abs(y))!==ring)continue;
  const d=runtime.regionOfPos((x+.5)*size,(y+.5)*size);if(d.sea||nativeVisualFamily(d,runtime.seedOf)!==style)continue;
  for(let a=0;a<runtime.REG;a++)for(let b=0;b<runtime.REG;b++){
   const raw=runtime.wchunk(x*runtime.REG+a,y*runtime.REG+b),view=runtime.sceneChunk?.(raw)||raw,candidates=view.sp?.filter(o=>nativeVisualDescriptor(o.s,d,runtime.seedOf).style===style)||[],object=candidates.find(o=>o.s.mob)||candidates[0];
   if(object)return {x:object.x,y:object.y,id:object.s.id,bits:object.s.bits};
  }
 }return null;
}
