// Presentation grammar only; original species bits, IDs and placement stay intact.
export const NATIVE_STYLES=Object.freeze({terraces:'pixel',tidal:'membrane',orbital:'membrane',marsh:'membrane',prism:'facets',dunes:'filament',vault:'filament',grove:'anatomy'});
export function nativeVisualFamily(region,seedOf){return NATIVE_STYLES[region.worldFamily?.id]||'anatomy';}
export function nativeVisualDescriptor(species,region,seedOf){
 const style=nativeVisualFamily(region,seedOf),h=seedOf('visual:native-lineage:v1:'+species.id)>>>0;
 return {style,shape:style==='filament'?(species.mob?['worm','manta','jelly'][h%3]:['reeds','vine','network'][h%3]):null,
  width:style==='filament'?.65:1,height:style==='filament'?1.15:1,scale:style==='facets'?.8:1,phase:(h%628)/100};
}
export function facetPoints(bits,phase=0){const sides=3+(bits>>>3)%4,radius=.7+(bits%5)*.045;return Array.from({length:sides},(_,i)=>{const a=i*Math.PI*2/sides+(bits%7)*.15+Math.sin(phase)*.035;const edge=radius*(.84+((bits>>(i%15))&1)*.16);return [Math.cos(a)*edge,Math.sin(a)*edge];});}
export function pixelCells(bits){const out=[];for(let row=0;row<5;row++)for(let k=0;k<3;k++)if(bits>>(row*3+k)&1){out.push([k-2,row-2.5]);if(k<2)out.push([2-k,row-2.5]);}return out;}
